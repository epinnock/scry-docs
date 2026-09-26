# Configuration

The Scry CLI can be configured through multiple sources.

## Configuration Hierarchy

Configuration is resolved in order of priority:

1. **Command-line arguments** (highest priority)
2. **GitHub Actions context** (deployment version)
3. **Environment variables**
4. **Configuration file** (`.storybook-deployer.json`)
5. **Default values** (lowest priority)

## Configuration File

Create `.storybook-deployer.json` in your project root:

```json
{
  "apiUrl": "https://upload.scrymore.com",
  "apiKey": null,
  "dir": "./storybook-static",
  "project": "my-project",
  "version": "latest",
  "verbose": false,
  "withAnalysis": false,
  "storiesDir": null,
  "screenshotsDir": "./screenshots",
  "storybookUrl": "http://localhost:6006"
}
```

::: warning
Never commit API keys in the configuration file. Use environment variables for secrets.
:::

### File Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `apiUrl` | string | API default | Backend API endpoint |
| `apiKey` | string | - | API key (use env var instead) |
| `dir` | string | - | Storybook build directory |
| `project` | string | `main` | Project identifier |
| `version` | string | `latest` | Version string |
| `verbose` | boolean | `false` | Enable debug logging |
| `withAnalysis` | boolean | `false` | Enable story analysis |
| `storiesDir` | string | Auto-detect | Stories directory path |
| `screenshotsDir` | string | `./screenshots` | Screenshots output |
| `storybookUrl` | string | `http://localhost:6006` | Running Storybook URL |

### Version names

A deployment version may use letters, digits, `.`, `_` and `-` (up to 128
characters, starting with a letter or digit). Every name the upload accepts
opens in the viewer at `https://view.scrymore.com/{project}/{version}/`,
including dotted names such as git tags (`1.2.3`, `v1.2.3-rc.1`,
`2026.09.26`). Keep the trailing `/` when you link a version on its own.

Use `--deploy-version latest` when the main build must publish a `/latest/`
alias. GitHub Actions context can override version values supplied only through
the environment or configuration file. The CLI does not automatically load
`.env`; supply variables to the process or use your existing environment loader.
`init` requires its own project/key flags.

## Environment Variables

All configuration options can be set via environment variables.

### Primary Prefix: `STORYBOOK_DEPLOYER_`

| Variable | Corresponding Option |
|----------|---------------------|
| `STORYBOOK_DEPLOYER_API_URL` | `--api-url` |
| `STORYBOOK_DEPLOYER_API_KEY` | `--api-key` |
| `STORYBOOK_DEPLOYER_DIR` | `--dir` |
| `STORYBOOK_DEPLOYER_PROJECT` | `--project` |
| `STORYBOOK_DEPLOYER_VERSION` | `--version` |
| `STORYBOOK_DEPLOYER_VERBOSE` | `--verbose` |
| `STORYBOOK_DEPLOYER_WITH_ANALYSIS` | `--with-analysis` |
| `STORYBOOK_DEPLOYER_STORIES_DIR` | `--stories-dir` |
| `STORYBOOK_DEPLOYER_SCREENSHOTS_DIR` | `--screenshots-dir` |
| `STORYBOOK_DEPLOYER_STORYBOOK_URL` | `--storybook-url` |

### Alternative Prefix: `SCRY_`

The `SCRY_` prefix is also supported and takes precedence:

| Variable | Description |
|----------|-------------|
| `SCRY_API_URL` | API endpoint |
| `SCRY_API_KEY` | API key |
| `SCRY_PROJECT_ID` | Project identifier |
| `SCRY_VIEW_URL` | CDN viewer URL |

### Usage Examples

```bash
# Set environment variables
export STORYBOOK_DEPLOYER_PROJECT=my-project
export STORYBOOK_DEPLOYER_VERSION=v1.0.0
export STORYBOOK_DEPLOYER_API_KEY=scry_proj_xxx

# Run CLI (picks up env vars)
npx @scrymore/scry-deployer --dir ./storybook-static
```

```bash
# Using SCRY_ prefix (takes precedence)
export SCRY_PROJECT_ID=my-project
export SCRY_API_KEY=scry_proj_xxx
export SCRY_API_URL=https://upload.scrymore.com

npx @scrymore/scry-deployer --dir ./storybook-static
```

## GitHub Actions Variables

For GitHub Actions, set these as repository variables and secrets:

### Variables (Settings → Secrets and variables → Actions → Variables)

| Variable | Value |
|----------|-------|
| `SCRY_PROJECT_ID` | Your project ID |
| `SCRY_API_URL` | `https://upload.scrymore.com` |
| `SCRY_VIEW_URL` | `https://view.scrymore.com` |

### Secrets (Settings → Secrets and variables → Actions → Secrets)

| Secret | Value |
|--------|-------|
| `SCRY_API_KEY` | Your API key |

### Workflow Usage

```yaml
- name: Deploy
  env:
    STORYBOOK_DEPLOYER_API_URL: ${{ vars.SCRY_API_URL }}
    STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
    STORYBOOK_DEPLOYER_PROJECT: ${{ vars.SCRY_PROJECT_ID }}
    STORYBOOK_DEPLOYER_VERSION: ${{ github.sha }}
  run: npx @scrymore/scry-deployer --dir ./storybook-static --deploy-version "${{ github.sha }}"
```

## Default Values

When not specified, these defaults are used:

| Option | Default Value |
|--------|---------------|
| `project` | `main` |
| `version` | `latest` |
| `verbose` | `false` |
| `withAnalysis` | `false` |
| `screenshotsDir` | `./screenshots` |
| `storybookUrl` | `http://localhost:6006` |

## Example Configurations

### Minimal Configuration

```json
{
  "project": "my-project",
  "dir": "./storybook-static"
}
```

### Development Configuration

```json
{
  "apiUrl": "https://upload-stage.scrymore.com",
  "project": "my-project-dev",
  "dir": "./storybook-static",
  "verbose": true
}
```

### Production Configuration

```json
{
  "apiUrl": "https://upload.scrymore.com",
  "project": "my-project",
  "dir": "./storybook-static",
  "version": "latest",
  "verbose": false
}
```

### With Analysis

```json
{
  "project": "my-project",
  "dir": "./storybook-static",
  "withAnalysis": true,
  "storiesDir": "./src",
  "screenshotsDir": "./visual-snapshots",
  "storybookUrl": "http://localhost:6006"
}
```

## Validation

The CLI validates configuration on startup:

- Required fields must be present
- URLs must be valid
- Directories must exist (for `--dir`)
- API key format is checked

Invalid configuration produces helpful error messages:

```
[scry] Error: --dir is required
[scry] Error: Directory './storybook-static' not found
[scry] Error: Invalid API key format
```

## Best Practices

1. **Use environment variables for secrets** - Never commit API keys
2. **Use config file for project defaults** - Share common settings
3. **Override in CI** - Use env vars for CI-specific values
4. **Enable verbose in development** - Helps with debugging
5. **Use version control for config** - Track `.storybook-deployer.json`

## Next Steps

- [Commands](/cli/commands) - Full command reference
- [Examples](/cli/examples) - Real-world usage
- [GitHub Actions](/guide/github-actions) - CI/CD setup
