import { sep } from 'path';
import { gray, orange, green } from './color';

export function logOperation(filePath: string, targetFilePath: string, isReplace: boolean, alreadyExists?: boolean) {
  if (alreadyExists && !isReplace) {
    console.log(gray('SKIP'), getFilename(filePath), `-> ${prettifyFilePath(targetFilePath)}`);
    return;
  }

  if (alreadyExists && isReplace) {
    console.log(orange('REPLACE'), getFilename(filePath), `-> ${prettifyFilePath(targetFilePath)}`);
    return;
  }

  console.log(green('COPY'), getFilename(filePath), `-> ${prettifyFilePath(targetFilePath)}`);
}

export function getFilename(fullPath: string) {
  const parts = fullPath.split(sep);
  return parts[parts.length - 1];
}

export function prettifyFilePath(fullPath: string) {
  return fullPath.replace(process.cwd(), '.').replace(/\\/g, '/');
}
