# CLI Overview

The Scry CLI (`@scrymore/scry-deployer`) is a command-line tool for deploying Storybook builds to the cloud.

## Installation

::: code-group

```bash [npx (recommended)]
npx @scrymore/scry-deployer [command] [options]
```

```bash [npm]
npm install @scrymore/scry-deployer --save-dev
npm exec -- scry-deployer [command] [options]
```

```bash [pnpm]
pnpm add @scrymore/scry-deployer -D
pnpm exec scry-deployer [command] [options]
```

:::

## Quick Reference

| Command | Description |
|---------|-------------|
| `init` | Initialize project with workflows and config |
| No subcommand | Deploy Storybook |
| `analyze` | Analyze stories and capture screenshots |

## Binary Aliases

The package provides multiple binary names:

- `scry-deployer` - Full name
- `storybook-deploy` - Short name
- `scry` - Shortest alias

All are equivalent:

```bash
npm exec -- scry-deployer --help
npx storybook-deploy --help
npx scry --help
```

## Basic Usage

### Initialize a Project

```bash
npx @scrymore/scry-deployer init \
  --projectId my-project \
  --apiKey scry_proj_xxx
```

### Deploy Storybook

```bash
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-project \
  --version latest
```

### Analyze Stories

```bash
npx @scrymore/scry-deployer analyze \
  --storybook-url http://localhost:6006
```

## Configuration Sources

The CLI reads configuration from multiple sources in order of priority:

1. **Command-line arguments** (highest priority)
2. **GitHub Actions context** (deployment version)
3. **Environment variables** (`STORYBOOK_DEPLOYER_*` or `SCRY_*`)
4. **Configuration file** (`.storybook-deployer.json`)
5. **Default values** (lowest priority)

Use `--deploy-version latest` when the main build must publish a `/latest/`
alias. GitHub Actions context can override version values supplied only through
the environment or configuration file. The CLI does not automatically load
`.env`; supply variables to the process or use your existing environment loader.
`init` requires its own project/key flags.

## Environment Variables

All options can be set via environment variables:

| Option | Environment Variable |
|--------|---------------------|
| `--dir` | `STORYBOOK_DEPLOYER_DIR` |
| `--project` | `STORYBOOK_DEPLOYER_PROJECT` |
| `--version` | `STORYBOOK_DEPLOYER_VERSION` |
| `--api-key` | `STORYBOOK_DEPLOYER_API_KEY` |
| `--api-url` | `STORYBOOK_DEPLOYER_API_URL` |

The `SCRY_` prefix also works and takes precedence:

```bash
export SCRY_PROJECT_ID=my-project
export SCRY_API_KEY=scry_proj_xxx
```

## Exit Codes

| Code | Description |
|------|-------------|
| 0 | Success |
| 1 | General error |
| 2 | Configuration error |
| 3 | Authentication error |
| 4 | Upload error |

## Getting Help

```bash
npx @scrymore/scry-deployer --help
npx @scrymore/scry-deployer init --help
npx @scrymore/scry-deployer analyze --help
```

## Next Steps

- [Commands](/cli/commands) - Full command reference
- [Configuration](/cli/configuration) - Configuration options
- [Examples](/cli/examples) - Real-world usage examples
