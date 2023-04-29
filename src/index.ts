#! /usr/bin/env node

import { Command } from 'commander';
import { cyan, green, red } from './color';
import { Flags, applyRepository } from './io';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const version = require('../package.json').version;

const program = new Command();

console.log(`Tapply v${version}\n`);

program
  .usage('<repository> [targetPath]')
  .description('A CLI to apply github repositories in your project')
  .version(version, '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Output usage information')
  .option('-d, --dry-run', 'Dry run, no files are changed.')
  .option('-r, --replace', 'Replace files if they exist.')
  .option('-V, --verbose', 'Verbose output, including warnings and errors.')
  .parse(process.argv);

async function run() {
  const options = program.opts<Flags>();
  const args = program.args;

  if (!process.argv.slice(2).length || !args.length || args.length > 2) {
    program.outputHelp();
    process.exit(0);
  }

  const repository = args[0];
  const targetPath = args[1] || '.';

  console.log(green('>'), `Cloning ${cyan(repository)} into ${cyan(targetPath)}\n`);

  try {
    await applyRepository(repository, targetPath, options);
  } catch (err) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log(red('ERROR:'), (err as any).message);
  }
}

run();
