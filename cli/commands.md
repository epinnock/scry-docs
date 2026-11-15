# CLI Commands

## init

Initialize a project with Scry configuration and GitHub Actions workflows.

```bash
npx @scrymore/scry-deployer init [options]
# with build-free capture:
npx -y @scrymore/scry-deployer@^0.14.0 init --project-id YOUR_PROJECT_ID --api-key YOUR_API_KEY --capture web
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `--project-id` | string | Yes | Your Scry project ID |
| `--api-key` | string | Yes | Your Scry API key |
| `--skip-gh-setup` | boolean | No | Skip GitHub CLI setup |
| `--capture web` | string | No | Also write the build-free web capture workflow (needs 0.14.0 or newer). Stops with a message and writes nothing if the project does not qualify. Run at the repository root. Use `@^0.14.0`: an older or cached deployer ignores it |
| `--config-dir` | string | No | With `--capture web`: Storybook config directory (default `.storybook`) |

### What It Does

1. Creates `.storybook-deployer.json` configuration file
2. Generates GitHub Actions workflows:
   - `.github/workflows/deploy-storybook.yml`
   - `.github/workflows/deploy-pr-preview.yml`
3. Sets up GitHub repository variables and secrets (unless `--skip-gh-setup`)
4. Commits and pushes changes to GitHub

`--skip-gh-setup` skips only GitHub variable/secret setup. It still writes
files, commits, and pushes; the manual secret instructions can print the key.
For local configuration before publishing, use the [setup skill](/guide/skill)
or [manual deployment](/guide/first-deployment).

### Examples

```bash
# Full setup
npx @scrymore/scry-deployer init \
  --project-id my-design-system \
  --api-key scry_proj_my-design-system_xxx

# Skip GitHub CLI setup (manual secrets)
npx @scrymore/scry-deployer init \
  --project-id my-project \
  --api-key scry_proj_xxx \
  --skip-gh-setup
```

## update-workflows

Rewrite the Scry GitHub Actions workflows in an existing project to the current templates.

```bash
npx @scrymore/scry-deployer update-workflows [--capture web]
```

With `--capture web` (and optionally `--config-dir <dir>`) it also writes
`.github/workflows/scry-capture-web.yml`, the workflow for
[build-free web capture](/guide/web-capture#set-it-up-in-ci), and changes `deploy-storybook.yml`
from `--with-analysis` to `--no-analysis`. `deploy-pr-preview.yml` is unchanged. The command
checks the project first (loading its Storybook and Vite config with credentials removed, so run
it only in a repository you trust) and writes nothing if it does not qualify. Run it at the
repository root. Without `--capture web` it
returns the workflows to the Storybook-build path. Delete `scry-capture-web.yml` by hand when you
go back.

## capture web

Requires `@scrymore/scry-deployer` 0.14.0 or newer. Captures every story of a React Storybook 10
project on Vite into a [Scry Capture Format](/guide/capture-bundle-format) bundle without building
Storybook. The [web capture guide](/guide/web-capture) has requirements, CI setup and
troubleshooting.

```bash
npx scry-deployer capture web            # writes .scry/capture and .scry/capture-report.json
npx scry-deployer upload .scry/capture   # validate and upload the bundle
```

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `--config-dir <dir>` | `.storybook` | Storybook config directory |
| `--project-dir <dir>` | current directory | Project root |
| `--out <dir>` | `.scry/capture` | Bundle directory |
| `--workers <n>` | CPU cores the process may use, at most 4 | Browser pages capturing at once |
| `--max-dropped <n>` | `0` | Exit 1 when more than this many stories fail to capture |
| `--retries <n>` | `1` | Extra tries, each on a fresh page, for a story that fails |
| `--story-timeout <ms>` | `15000` | Time a story gets to render and finish its play function |
| `--scale <n>` | `1` | Device scale factor of the images |
| `--viewport <WxH>` | `1280x720` | Browser viewport |
| `--fixed-time <iso\|off>` | `2026-11-14T12:00:00Z` | Instant the page clock starts at for each story; `off` uses the real clock |
| `--stories <ids>` | all | Comma-separated story ids |
| `--changed-since <ref>` | | Capture only stories affected by changes since a git ref |
| `--list` | | Print story ids (or, with `--changed-since`, story files) and capture nothing |
| `--list-ids` | | With `--changed-since`: print affected story ids |
| `--report <file>` | `capture-report.json` next to the bundle | Run report |

`--out` must be a directory the tool may clear: one that does not exist, an empty one, one with
the `.scry-capture` marker, or a bundle written by `capture web`. Anything else stops the run
before a file is touched.

### Output and exit code

```
.scry/capture/
  scf.json                 # manifest: source storybook:web, counts, captures
  images/<story id>.png
  structure/<story id>.json
.scry/capture-report.json  # outside the bundle
```

Exit code 0 when the bundle is valid and no more than `--max-dropped` stories failed. Stories
left out with `parameters.scry.capture.skip` do not count as failed. A run with `--stories` or
`--changed-since` writes no `scf.json` and cannot be uploaded.

## Deployment (no subcommand)

Deploy a Storybook build to Scry. This is the default command when no command is specified.

```bash
npx @scrymore/scry-deployer [options]
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
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-project \
  --version v1.0.0

# Using environment variables
export STORYBOOK_DEPLOYER_API_KEY=scry_proj_xxx
export STORYBOOK_DEPLOYER_PROJECT=my-project
npx @scrymore/scry-deployer --dir ./storybook-static

# Verbose output
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --verbose

# With story analysis
npx @scrymore/scry-deployer \
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
npx @scrymore/scry-deployer analyze [options]
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
npx @scrymore/scry-deployer analyze \
  --storybook-url http://localhost:6006

# Specify stories directory
npx @scrymore/scry-deployer analyze \
  --stories-dir ./src/components \
  --storybook-url http://localhost:6006

# Custom output directory
npx @scrymore/scry-deployer analyze \
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
