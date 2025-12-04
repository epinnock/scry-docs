# CLI Overview

The Scry CLI (`@scry/storybook-deployer`) is a command-line tool for deploying Storybook builds to the cloud.

## Installation

::: code-group

```bash [npx (recommended)]
npx @scry/storybook-deployer [command] [options]
```

```bash [npm]
npm install @scry/storybook-deployer --save-dev
npx storybook-deployer [command] [options]
```

```bash [pnpm]
pnpm add @scry/storybook-deployer -D
pnpm dlx storybook-deployer [command] [options]
```

:::

## Quick Reference

| Command | Description |
|---------|-------------|
| `init` | Initialize project with workflows and config |
| `deploy` | Deploy Storybook (default command) |
| `analyze` | Analyze stories and capture screenshots |

## Binary Aliases

The package provides multiple binary names:

- `storybook-deployer` - Full name
- `storybook-deploy` - Short name
- `scry` - Shortest alias

All are equivalent:

```bash
npx storybook-deployer --help
npx storybook-deploy --help
npx scry --help
```

## Basic Usage

### Initialize a Project

```bash
npx @scry/storybook-deployer init \
  --projectId my-project \
  --apiKey scry_proj_xxx
```

### Deploy Storybook

```bash
npx @scry/storybook-deployer \
  --dir ./storybook-static \
  --project my-project \
  --version latest
```

### Analyze Stories

```bash
npx @scry/storybook-deployer analyze \
  --storybook-url http://localhost:6006
```

## Configuration Sources

The CLI reads configuration from multiple sources in order of priority:

1. **Command-line arguments** (highest priority)
2. **Environment variables** (`STORYBOOK_DEPLOYER_*` or `SCRY_*`)
3. **Configuration file** (`.storybook-deployer.json`)
4. **Default values** (lowest priority)

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
npx @scry/storybook-deployer --help
npx @scry/storybook-deployer init --help
npx @scry/storybook-deployer analyze --help
```

## Next Steps

- [Commands](/cli/commands) - Full command reference
- [Configuration](/cli/configuration) - Configuration options
- [Examples](/cli/examples) - Real-world usage examples
