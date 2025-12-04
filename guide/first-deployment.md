# First Deployment

> **TL;DR:** Understand what happens when you deploy your Storybook to Scry.

## What You'll Learn

- The deployment process step by step
- How to trigger a manual deployment
- How to verify your deployment succeeded

## Prerequisites

- [ ] Completed the [Quick Start](/guide/quick-start) setup
- [ ] Have a built Storybook in `./storybook-static`

## The Deployment Process

When you push to main or a workflow triggers, here's what happens:

```
┌─────────────────────────────────────────────────────────────────┐
│  1. BUILD                                                       │
│     npm run build-storybook                                     │
│     └── Creates ./storybook-static/                             │
├─────────────────────────────────────────────────────────────────┤
│  2. PACKAGE                                                     │
│     The CLI zips the storybook-static directory                 │
│     └── Creates {project}-{version}.zip                         │
├─────────────────────────────────────────────────────────────────┤
│  3. AUTHENTICATE                                                │
│     CLI authenticates with API key                              │
│     └── Gets presigned URL for upload                           │
├─────────────────────────────────────────────────────────────────┤
│  4. UPLOAD                                                      │
│     ZIP file uploaded directly to Cloudflare R2                 │
│     └── Build tracked in Firebase                               │
├─────────────────────────────────────────────────────────────────┤
│  5. AVAILABLE                                                   │
│     CDN serves files from ZIP                                   │
│     └── https://view.scry.com/{project}/{version}/              │
└─────────────────────────────────────────────────────────────────┘
```

## Manual Deployment

You can trigger a deployment manually without GitHub Actions:

### Step 1: Build Storybook

```bash
npm run build-storybook
```

This creates the `storybook-static` directory with your built Storybook.

### Step 2: Deploy

```bash
npx @scry/storybook-deployer \
  --dir ./storybook-static \
  --project my-project \
  --version v1.0.0
```

### Step 3: Verify

Check the deployment URL:

```bash
curl -I https://view.scry.com/my-project/v1.0.0/
```

Expected response:

```
HTTP/2 200
content-type: text/html
cache-control: public, max-age=31536000
```

## Understanding Versions

Each deployment is identified by a version string:

| Version | Description | Use Case |
|---------|-------------|----------|
| `latest` | Most recent main branch build | Production |
| `v1.0.0` | Semantic version | Releases |
| `pr-123` | Pull request number | PR previews |
| `abc123` | Commit SHA | Specific builds |

## Viewing Your Deployment

After deployment, your Storybook is available at:

```
https://view.scry.com/{project}/{version}/
```

For example:
- `https://view.scry.com/my-project/latest/`
- `https://view.scry.com/my-project/pr-42/`

## Deployment Logs

The CLI outputs detailed logs:

```
[scry] Starting deployment...
[scry] Building archive from ./storybook-static
[scry] Archive size: 2.3 MB
[scry] Authenticating with API key...
[scry] Requesting presigned URL...
[scry] Uploading to cloud storage...
[scry] ✓ Upload complete!
[scry]
[scry] Deployment URL: https://view.scry.com/my-project/v1.0.0/
[scry] Build ID: abc123def456
[scry] Build Number: 42
```

Use `--verbose` for additional debug information:

```bash
npx @scry/storybook-deployer --dir ./storybook-static --verbose
```

## Troubleshooting

### "Directory not found"

Ensure your Storybook build directory exists:

```bash
ls -la ./storybook-static
```

If it doesn't exist, build Storybook first:

```bash
npm run build-storybook
```

### "Authentication failed"

Verify your API key:

```bash
echo $STORYBOOK_DEPLOYER_API_KEY
```

The key should start with `scry_proj_`.

### "Upload failed"

Check your network connection and try again. The CLI automatically retries on transient failures.

For persistent issues, check the [Troubleshooting](/guide/troubleshooting) guide.

## Next Steps

- [GitHub Actions](/guide/github-actions) - Automate deployments
- [PR Previews](/guide/pr-previews) - Set up preview comments
- [CLI Commands](/cli/commands) - Full command reference
