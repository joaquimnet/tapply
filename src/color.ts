export function cyan(str: string) {
  return `\x1b[36m${str}\x1b[0m`;
}

export function green(str: string) {
  return `\x1b[32m${str}\x1b[0m`;
}

export function red(str: string) {
  return `\x1b[31m${str}\x1b[0m`;
}

export function orange(str: string) {
  return `\x1b[33m${str}\x1b[0m`;
}

export function gray(str: string) {
  return `\x1b[90m${str}\x1b[0m`;
}
