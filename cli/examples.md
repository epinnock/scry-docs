# CLI Examples

Real-world examples of using the Scry CLI.

## Basic Deployments

### Deploy to Latest

Deploy your Storybook to the `latest` version:

```bash
npm run build-storybook
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --version latest
```

### Deploy with Version Tag

Deploy a specific version:

```bash
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --version v1.2.3
```

### Deploy with Commit SHA

Use the git commit SHA as version:

```bash
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --version $(git rev-parse --short HEAD)
```

## PR Preview Deployments

### Basic PR Preview

```bash
# Get PR number from environment or git
PR_NUMBER=$(gh pr view --json number -q .number 2>/dev/null || echo "local")

npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --version "pr-${PR_NUMBER}"
```

### In GitHub Actions

```yaml
- name: Deploy PR Preview
  env:
    STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
    STORYBOOK_DEPLOYER_PROJECT: ${{ vars.SCRY_PROJECT_ID }}
    STORYBOOK_DEPLOYER_VERSION: pr-${{ github.event.pull_request.number }}
  run: npx @scrymore/scry-deployer --dir ./storybook-static
```

## Branch-Based Deployments

### Deploy Feature Branch

```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD | sed 's/[^a-zA-Z0-9]/-/g')

npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --version "branch-${BRANCH}"
```

### Deploy with Date

```bash
DATE=$(date +%Y%m%d)

npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --version "${DATE}-latest"
```

## With Story Analysis

### Full Analysis

Analyze stories, capture screenshots, and deploy:

```bash
# Start Storybook in background
npm run storybook &
sleep 10  # Wait for server

npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --version v1.0.0 \
  --with-analysis \
  --storybook-url http://localhost:6006

# Stop Storybook
kill %1
```

### Using wait-on

More reliable server waiting:

```bash
npm run storybook &

npx wait-on http://localhost:6006

npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --with-analysis \
  --storybook-url http://localhost:6006
```

### Analysis Only (No Deploy)

Analyze and capture screenshots without deploying:

```bash
npm run storybook &
npx wait-on http://localhost:6006

npx @scrymore/scry-deployer analyze \
  --project my-design-system \
  --storybook-url http://localhost:6006 \
  --screenshots-dir ./visual-snapshots
```

## Monorepo Setups

### Deploy Multiple Storybooks

```bash
#!/bin/bash
# deploy-all.sh

PACKAGES=(
  "packages/ui:design-system"
  "packages/icons:icon-library"
  "apps/docs:documentation"
)

for package in "${PACKAGES[@]}"; do
  IFS=':' read -r path project <<< "$package"

  echo "Deploying ${project}..."

  npx @scrymore/scry-deployer \
    --dir "${path}/storybook-static" \
    --project "${project}" \
    --version latest
done
```

### Parallel Deployment (GitHub Actions)

```yaml
jobs:
  deploy:
    strategy:
      matrix:
        include:
          - path: packages/ui
            project: design-system
          - path: packages/icons
            project: icon-library
    steps:
      - uses: actions/checkout@v4

      - name: Build Storybook
        run: npm run build-storybook
        working-directory: ${{ matrix.path }}

      - name: Deploy
        env:
          STORYBOOK_DEPLOYER_PROJECT: ${{ matrix.project }}
        run: |
          npx @scrymore/scry-deployer \
            --dir ${{ matrix.path }}/storybook-static
```

## Custom API Endpoints

### Staging Environment

```bash
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --api-url https://upload-stage.scrymore.com \
  --version staging
```

### Self-Hosted Backend

```bash
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --project my-design-system \
  --api-url https://storybook-api.mycompany.com \
  --api-key my_custom_key_xxx
```

## Scripted Deployments

### npm Script

Add to `package.json`:

```json
{
  "scripts": {
    "deploy:storybook": "npm run build-storybook && npx @scrymore/scry-deployer --dir ./storybook-static",
    "deploy:storybook:staging": "npm run deploy:storybook -- --version staging",
    "deploy:storybook:production": "npm run deploy:storybook -- --version latest"
  }
}
```

Usage:

```bash
npm run deploy:storybook:staging
npm run deploy:storybook:production
```

### Makefile

```makefile
.PHONY: deploy-storybook

build-storybook:
	npm run build-storybook

deploy-storybook: build-storybook
	npx @scrymore/scry-deployer \
		--dir ./storybook-static \
		--project $(PROJECT) \
		--version $(VERSION)

deploy-staging: PROJECT=my-design-system VERSION=staging
deploy-staging: deploy-storybook

deploy-production: PROJECT=my-design-system VERSION=latest
deploy-production: deploy-storybook
```

Usage:

```bash
make deploy-staging
make deploy-production
```

## Debugging

### Verbose Output

```bash
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --verbose
```

### Check Configuration

```bash
# Print effective configuration
cat .storybook-deployer.json

# Check environment
env | grep -E "(STORYBOOK_DEPLOYER|SCRY)_"

# Dry run (just build archive)
npx @scrymore/scry-deployer \
  --dir ./storybook-static \
  --verbose 2>&1 | head -20
```

### Test API Connectivity

```bash
# Check API health
curl -I https://upload.scrymore.com/health

# Validate API key format
node -e 'console.log((process.env.SCRY_API_KEY || process.env.STORYBOOK_DEPLOYER_API_KEY) ? "API key is set" : "API key is missing")'
```

## Error Handling

### Retry on Failure

```bash
#!/bin/bash

MAX_RETRIES=3
RETRY_DELAY=5

for i in $(seq 1 $MAX_RETRIES); do
  npx @scrymore/scry-deployer \
    --dir ./storybook-static \
    --project my-design-system \
    && exit 0

  echo "Attempt $i failed, retrying in ${RETRY_DELAY}s..."
  sleep $RETRY_DELAY
done

echo "Deployment failed after $MAX_RETRIES attempts"
exit 1
```

### Conditional Deployment

```bash
#!/bin/bash

# Only deploy if Storybook files changed
if git diff --name-only HEAD~1 | grep -qE '\.(stories|mdx)\.(ts|tsx|js|jsx)$'; then
  echo "Storybook files changed, deploying..."
  npx @scrymore/scry-deployer --dir ./storybook-static
else
  echo "No Storybook changes, skipping deployment"
fi
```

## CI/CD Examples

See [GitHub Actions](/guide/github-actions) for complete workflow examples.

## Next Steps

- [Commands](/cli/commands) - Full command reference
- [Configuration](/cli/configuration) - All configuration options
- [Troubleshooting](/guide/troubleshooting) - Common issues
