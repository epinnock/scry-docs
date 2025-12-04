# Development Setup

Set up your local environment for Scry development.

## Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime |
| pnpm | 8+ | Package manager |
| Wrangler | 3+ | Cloudflare CLI |
| Git | 2+ | Version control |

## Clone Repositories

```bash
# Create workspace directory
mkdir scry-dev && cd scry-dev

# Clone all repositories
git clone https://github.com/epinnock/scry-node.git
git clone https://github.com/epinnock/scry-storybook-upload-service.git
git clone https://github.com/epinnock/scry-cdn-service.git
git clone https://github.com/epinnock/scry-developer-dashboard.git
```

## CLI Development

### Setup

```bash
cd scry-node
npm install
```

### Run Locally

```bash
# Run from source
node bin/cli.js --help

# Or link globally
npm link
storybook-deployer --help
```

### Test Changes

```bash
# Create test Storybook directory
mkdir test-storybook
echo "<html><body>Test</body></html>" > test-storybook/index.html

# Test deployment
node bin/cli.js --dir ./test-storybook --verbose
```

## Upload Service Development

### Setup

```bash
cd scry-storybook-upload-service
npm install
```

### Configure

Create `.dev.vars`:

```bash
R2_ACCOUNT_ID="your-account-id"
R2_S3_ACCESS_KEY_ID="your-access-key"
R2_S3_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="scry-static-sites-staging"
```

### Run Locally

```bash
# Start development server
wrangler dev

# Service available at http://localhost:8787
```

### Test Endpoints

```bash
# Health check
curl http://localhost:8787/health

# Upload (requires test API key)
curl -X POST \
  -H "X-API-Key: test-key" \
  -H "Content-Type: application/zip" \
  --data-binary @test.zip \
  http://localhost:8787/upload/test-project/v1.0.0
```

## CDN Service Development

### Setup

```bash
cd scry-cdn-service
npm install
```

### Configure

Update `cloudflare/wrangler.toml` with your KV namespace IDs.

### Run Locally

```bash
# From cloudflare directory
cd cloudflare
wrangler dev

# Service available at http://localhost:8787
```

### Test File Serving

```bash
# Test with Host header
curl -H "Host: view-test.localhost:8787" http://localhost:8787/index.html
```

## Dashboard Development

### Setup

```bash
cd scry-developer-dashboard
pnpm install
```

### Configure

```bash
cp .env.local.example .env.local
# Edit .env.local with your Firebase config
```

### Run Locally

```bash
pnpm dev
# Dashboard available at http://localhost:3000
```

## IDE Setup

### VS Code Extensions

Recommended extensions:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ZixuanChen.vitest-explorer"
  ]
}
```

### Settings

`.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## Environment Variables

### Local Development

| Variable | Description | Where |
|----------|-------------|-------|
| `R2_*` | R2 credentials | Upload/CDN service |
| `FIREBASE_*` | Firebase config | Upload service |
| `NEXT_PUBLIC_*` | Dashboard config | Dashboard |

### Test Environment

Use staging resources:

- R2 bucket: `scry-static-sites-staging`
- Firebase: Separate dev project
- API keys: Test keys only

## Common Tasks

### Build All Services

```bash
# CLI
cd scry-node && npm run build

# Upload Service
cd scry-storybook-upload-service && npm run build

# CDN Service
cd scry-cdn-service && npm run build

# Dashboard
cd scry-developer-dashboard && pnpm build
```

### Run Tests

```bash
# CLI
cd scry-node && npm test

# Upload Service
cd scry-storybook-upload-service && npm test

# CDN Service
cd scry-cdn-service && npm test

# Dashboard
cd scry-developer-dashboard && pnpm test
```

### Type Check

```bash
# In any TypeScript project
npm run typecheck
# or
pnpm typecheck
```

## Troubleshooting

### "Module not found"

```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
# or
pnpm install
```

### "Wrangler not found"

```bash
npm install -g wrangler
wrangler login
```

### "Firebase connection failed"

- Verify `.env.local` has correct values
- Check Firebase project exists
- Ensure Firestore is enabled

### Port already in use

```bash
# Find process
lsof -i :3000
lsof -i :8787

# Kill process
kill -9 <PID>
```

## Next Steps

- [Code Style](/contributing/code-style) - Coding conventions
- [Testing](/contributing/testing) - Writing tests
- [Pull Requests](/contributing/pull-requests) - Submit changes
