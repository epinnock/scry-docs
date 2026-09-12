# CLI Commands

## init

Initialize a project with Scry configuration and GitHub Actions workflows.

```bash
npx @scry/storybook-deployer init [options]
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `--projectId` | string | Yes | Your Scry project ID |
| `--apiKey` | string | Yes | Your Scry API key |
| `--skip-gh-setup` | boolean | No | Skip GitHub CLI setup |

### What It Does

1. Creates `.storybook-deployer.json` configuration file
2. Generates GitHub Actions workflows:
   - `.github/workflows/deploy-storybook.yml`
   - `.github/workflows/deploy-pr-preview.yml`
3. Sets up GitHub repository variables and secrets (unless `--skip-gh-setup`)
4. Commits and pushes changes to GitHub

### Examples

```bash
# Full setup
npx @scry/storybook-deployer init \
  --projectId my-design-system \
  --apiKey scry_proj_my-design-system_xxx

# Skip GitHub CLI setup (manual secrets)
npx @scry/storybook-deployer init \
  --projectId my-project \
  --apiKey scry_proj_xxx \
  --skip-gh-setup
```

## deploy (default)

Deploy a Storybook build to Scry. This is the default command when no command is specified.

```bash
npx @scry/storybook-deployer [options]
# or
npx @scry/storybook-deployer deploy [options]
```

### Options

| Option | Environment Variable | Required | Default | Description |
|--------|---------------------|----------|---------|-------------|
| `--dir` | `STORYBOOK_DEPLOYER_DIR` | Yes | - | Path to built Storybook directory |
| `--project` | `STORYBOOK_DEPLOYER_PROJECT` | No | `main` | Project identifier |
| `--version` | `STORYBOOK_DEPLOYER_VERSION` | No | `latest` | Version string |
| `--api-key` | `STORYBOOK_DEPLOYER_API_KEY` | No* | - | API key for authentication |
| `--api-url` | `STORYBOOK_DEPLOYER_API_URL` | No | Default API | API endpoint URL |
| `--with-analysis` | `STORYBOOK_DEPLOYER_WITH_ANALYSIS` | No | `false` | Enable story analysis |
| `--verbose` | `STORYBOOK_DEPLOYER_VERBOSE` | No | `false` | Enable debug logging |

*API key is required unless using presigned URLs with prior authentication.

### Examples

```bash
# Basic deployment
npx @scry/storybook-deployer \
  --dir ./storybook-static \
  --project my-project \
  --version v1.0.0

# Using environment variables
export STORYBOOK_DEPLOYER_API_KEY=scry_proj_xxx
export STORYBOOK_DEPLOYER_PROJECT=my-project
npx @scry/storybook-deployer --dir ./storybook-static

# Verbose output
npx @scry/storybook-deployer \
  --dir ./storybook-static \
  --verbose

# With story analysis
npx @scry/storybook-deployer \
  --dir ./storybook-static \
  --with-analysis \
  --storybook-url http://localhost:6006
```

### Output

```
[scry] Starting deployment...
[scry] Building archive from ./storybook-static
[scry] Archive size: 2.3 MB
[scry] Authenticating with API key...
[scry] Requesting presigned URL...
[scry] Uploading to cloud storage...
[scry] ✓ Upload complete!
[scry]
[scry] Deployment URL: https://view.scrymore.com/my-project/v1.0.0/
[scry] Build ID: abc123def456
[scry] Build Number: 42
```

## analyze

Analyze Storybook stories and capture screenshots without deploying.

```bash
npx @scry/storybook-deployer analyze [options]
```

### Options

| Option | Environment Variable | Required | Default | Description |
|--------|---------------------|----------|---------|-------------|
| `--project` | `STORYBOOK_DEPLOYER_PROJECT` | No | `main` | Project identifier |
| `--version` | `STORYBOOK_DEPLOYER_VERSION` | No | `latest` | Version string |
| `--stories-dir` | `STORYBOOK_DEPLOYER_STORIES_DIR` | No | Auto-detect | Path to stories directory |
| `--screenshots-dir` | `STORYBOOK_DEPLOYER_SCREENSHOTS_DIR` | No | `./screenshots` | Output directory for screenshots |
| `--storybook-url` | `STORYBOOK_DEPLOYER_STORYBOOK_URL` | No | `http://localhost:6006` | Running Storybook URL |
| `--verbose` | `STORYBOOK_DEPLOYER_VERBOSE` | No | `false` | Enable debug logging |

### Story Auto-Detection

The analyze command automatically finds story files anywhere in your project:

**Supported patterns:**
- `.stories.ts`, `.stories.tsx`
- `.stories.js`, `.stories.jsx`
- `.stories.mjs`, `.stories.cjs`

**Excluded directories:**
- `node_modules`
- `dist`, `build`
- `.git`, `.next`, `.nuxt`

### Examples

```bash
# Auto-detect stories and capture screenshots
npx @scry/storybook-deployer analyze \
  --storybook-url http://localhost:6006

# Specify stories directory
npx @scry/storybook-deployer analyze \
  --stories-dir ./src/components \
  --storybook-url http://localhost:6006

# Custom output directory
npx @scry/storybook-deployer analyze \
  --screenshots-dir ./visual-snapshots
```

### Output

The analyze command creates:

```
screenshots/
├── Button--Primary.png
├── Button--Secondary.png
├── Card--Default.png
└── ...

metadata.json
```

The `metadata.json` contains:
- Story metadata (file paths, component names, story names)
- Screenshot mappings
- Analysis timestamp

## Global Options

These options work with all commands:

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show help message |
| `--version`, `-v` | Show version number |
| `--verbose` | Enable debug logging |

## Configuration File

The CLI looks for `.storybook-deployer.json` in the current directory:

```json
{
  "apiUrl": "https://upload.scrymore.com",
  "dir": "./storybook-static",
  "project": "my-project",
  "version": "latest",
  "verbose": false
}
```

See [Configuration](/cli/configuration) for all options.
