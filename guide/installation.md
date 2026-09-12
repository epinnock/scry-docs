# Installation

For guided setup in Claude Code, Codex, Cursor, or another coding assistant,
install the [Scry setup skill](/guide/skill):

```bash
npx skills add epinnock/scry-node --skill scry-setup
```

The current skill installer requires Node.js 22.20 or newer. The sections below
cover the deployment CLI, which requires Node.js 18 or newer. To connect only
to an existing project's components, follow the [MCP guide](/guide/mcp).

## Use the CLI with npx

The package is **`@scrymore/scry-deployer`**. You can run it without adding a
project dependency:

```bash
npx @scrymore/scry-deployer --help
```

Use `@scrymore/scry-deployer@0.6.0` to select that release explicitly. For
repeatable CI, install the package as a development dependency and commit your
lockfile. See [Quick Start](/guide/quick-start) before running `init`, which
configures GitHub and commits and pushes changes.

## Install as a development dependency

::: code-group

```bash [npm]
npm install @scrymore/scry-deployer --save-dev
npm exec -- scry-deployer --help
```

```bash [pnpm]
pnpm add @scrymore/scry-deployer -D
pnpm exec scry-deployer --help
```

```bash [yarn]
yarn add @scrymore/scry-deployer --dev
yarn run scry-deployer --help
```

:::

The package's postinstall can create `.storybook-deployer.json`. Set its
nonsecret project, build directory, and API URL before deployment; the generic
default API URL is a placeholder. Supply the key through `SCRY_API_KEY` or your
CI secret store, rather than filling a key into this file.

## Install from GitHub

To use source from the development repository:

```bash
npm install github:epinnock/scry-node --save-dev
```

Use your package manager's equivalent command if needed. This installs the CLI;
skill installation is a separate step.

## Binary aliases

| Binary | Description |
| --- | --- |
| `scry-deployer` | Full deployer binary name |
| `storybook-deploy` | Storybook alias |
| `scry` | Short alias |

All three invoke the same CLI when provided by the installed package. Use the
full scoped package name for one-off `npx` commands to select the right package.

## Verify installation

Run `--help` to check that the CLI loads. For an installed dependency, inspect
its version with your package manager, for example:

```bash
npm ls @scrymore/scry-deployer --depth=0
```

`--version` and `--deploy-version` specify a **deployment version**; they do not
print the installed package version.

## Configuration

For deployment, configuration priority is:

1. Command-line arguments
2. GitHub Actions context (deployment version)
3. Environment variables (`SCRY_*`, then `STORYBOOK_DEPLOYER_*`)
4. `.storybook-deployer.json` in the current working directory
5. Defaults

The CLI does not automatically load `.env`. Use your existing environment
loader or supply variables to the process. `init` requires project and key
flags; its options differ from deployment's configuration resolution.

See [Configuration](/cli/configuration) for details and
[First Deployment](/guide/first-deployment) for the build/upload steps.
