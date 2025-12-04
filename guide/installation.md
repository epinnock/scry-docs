# Installation

> **TL;DR:** Use `npx` for one-off commands, or install as a dev dependency for local development.

## Using npx (Recommended)

The simplest way to use Scry is via `npx`. No installation required:

```bash
# Initialize a new project
npx @scry/storybook-deployer init --projectId xxx --apiKey yyy

# Deploy manually
npx @scry/storybook-deployer --dir ./storybook-static
```

This always uses the latest version and requires no local dependencies.

## Installing as a Dependency

If you prefer to have the package in your `node_modules`:

::: code-group

```bash [npm]
npm install @scry/storybook-deployer --save-dev
```

```bash [pnpm]
pnpm add @scry/storybook-deployer -D
```

```bash [yarn]
yarn add @scry/storybook-deployer --dev
```

:::

After installation, you can run commands using:

```bash
# Using the full name
npx storybook-deployer init --projectId xxx --apiKey yyy

# Using the short alias
npx scry init --projectId xxx --apiKey yyy
```

## Installing from GitHub

For the latest development version:

::: code-group

```bash [npm]
npm install github:epinnock/scry-node --save-dev
```

```bash [pnpm]
pnpm add github:epinnock/scry-node -D
```

```bash [yarn]
yarn add github:epinnock/scry-node --dev
```

:::

## Binary Aliases

The package provides multiple binary names for convenience:

| Binary | Description |
|--------|-------------|
| `storybook-deployer` | Full name |
| `storybook-deploy` | Short name for deploy commands |
| `scry` | Shortest alias |

All binaries are equivalent:

```bash
npx storybook-deployer --help
npx storybook-deploy --help
npx scry --help
```

## Verifying Installation

Check that the CLI is working:

```bash
npx @scry/storybook-deployer --version
```

Expected output:

```
@scry/storybook-deployer v1.0.0
```

## System Requirements

| Requirement | Version |
|-------------|---------|
| Node.js | 18.x or later |
| npm/pnpm/yarn | Any recent version |
| Git | 2.x or later |
| GitHub CLI | 2.x or later (optional, for init) |

## Environment Setup

The CLI reads configuration from multiple sources:

1. **Command-line arguments** (highest priority)
2. **Environment variables** (prefixed with `STORYBOOK_DEPLOYER_` or `SCRY_`)
3. **Configuration file** (`.storybook-deployer.json`)
4. **Default values** (lowest priority)

See [Configuration](/cli/configuration) for details.

## Next Steps

- [Quick Start](/guide/quick-start) - Set up automatic deployments
- [CLI Commands](/cli/commands) - Full command reference
- [Configuration](/cli/configuration) - Configuration options
