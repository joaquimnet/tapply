import degit from 'degit';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import fs from 'node:fs/promises';
import { orange } from './color';
import { logOperation } from './util';

export interface Flags {
  replace: boolean;
  dryRun: boolean;
  verbose: boolean;
}

export async function applyRepository(repository: string, targetPath: string, flags: Flags) {
  const emitter = degit(repository, {
    cache: false,
    force: true,
    verbose: flags.verbose,
  });

  emitter.on('info', (info) => {
    if (flags.verbose) {
      console.log(info.message);
    }
  });

  emitter.on('warn', (warning) => {
    if (flags.verbose) {
      console.log(warning.message);
    }
  });

  const tmpFolder = await createTmpFolder(repository);

  await emitter.clone(tmpFolder);

  const resolvedTargetPath = resolve(process.cwd(), targetPath);

  await fs.mkdir(resolvedTargetPath, { recursive: true });
  await copyFiles(tmpFolder, resolvedTargetPath, flags);
  await fs.rm(tmpFolder, { recursive: true, force: true });

  if (flags.dryRun) {
    console.log('');
    console.log(orange('DRY RUN'), 'No files were changed.');
  }
}

async function createTmpFolder(repository: string) {
  const tmpFolder = join(tmpdir(), 'tapply', repository.replace('/', '-'));
  await fs.rm(tmpFolder, { recursive: true, force: true });
  await fs.mkdir(tmpFolder, { recursive: true });
  return tmpFolder;
}

async function copyFiles(downloadedPath: string, targetPath: string, flags: Flags) {
  const files = await fs.readdir(downloadedPath);
  for (const file of files) {
    const filePath = join(downloadedPath, file);
    const targetFilePath = join(targetPath, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      await fs.mkdir(targetFilePath, { recursive: true });
      await copyFiles(filePath, targetFilePath, flags);
    } else {
      await copyFile(filePath, targetFilePath, flags);
    }
  }
}

async function copyFile(filePath: string, targetFilePath: string, flags: Flags) {
  const alreadyExists = await fs
    .access(targetFilePath)
    .then(() => true)
    .catch(() => false);
  logOperation(filePath, targetFilePath, flags.replace, alreadyExists);

  const fileSkipped = alreadyExists && !flags.replace;

  if (fileSkipped) {
    return;
  }

  if (flags.dryRun) {
    return;
  }

  if (flags.replace) {
    // for linux
    await fs.unlink(targetFilePath).catch(() => {
      // this is fine
    });
    await fs.copyFile(filePath, targetFilePath);
  } else {
    await fs.copyFile(filePath, targetFilePath);
  }
}
