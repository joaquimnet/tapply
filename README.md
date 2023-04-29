# tapply

CLI to clone a repository and apply it to a folder, with option to overwrite or not.

## Features

- Clone a repository and apply it to a folder.
- Option to overwrite or not.
- `.git` folder gets removed.

## Usage

```bash
$ tapply --help

Template Apply v0.1.0

Usage: tapply <repository> [targetPath]

A CLI to apply github repositories in your project

Options:
  -v, --version  Output the current version
  -d, --dry-run  Dry run, no files are changed.
  -r, --replace  Replace files if they exist.
  -V, --verbose  Verbose output, including warnings and errors.
  -h, --help     Output usage information
```

## Examples

```bash
$ tapply joaquimnet/partial-node-configs my-project --replace

$ tapply joaquimnet/partial-node-configs my-project --dry-run

$ tapply joaquimnet/partial-node-configs my-project -dr
```

## License

MIT 🙂
