# Quick Start

> **TL;DR:** Run one command to set up automatic Storybook deployments with PR previews.

## What You'll Learn

- How to get your Scry credentials
- How to run the init command
- What happens after setup

## Prerequisites

- [ ] A Storybook project with a `build-storybook` script
- [ ] A GitHub repository (public or private)
- [ ] GitHub CLI installed and authenticated (`gh auth login`)

## Step 1: Get Your Credentials

Visit the [Scry Dashboard](https://dashboard.scry.com) and:

1. Sign in with your GitHub account
2. Create a new project
3. Copy your **Project ID** and **API Key**

::: tip
Your API key starts with `scry_proj_` and is only shown once. Save it securely!
:::

## Step 2: Run the Init Command

From your project's root directory:

::: code-group

```bash [npm]
npx @scry/storybook-deployer init \
  --projectId YOUR_PROJECT_ID \
  --apiKey YOUR_API_KEY
```

```bash [pnpm]
pnpm dlx @scry/storybook-deployer init \
  --projectId YOUR_PROJECT_ID \
  --apiKey YOUR_API_KEY
```

```bash [yarn]
yarn dlx @scry/storybook-deployer init \
  --projectId YOUR_PROJECT_ID \
  --apiKey YOUR_API_KEY
```

:::

## Step 3: Verify Setup

The init command automatically:

- ✅ Creates `.storybook-deployer.json` configuration
- ✅ Generates GitHub Actions workflows
- ✅ Sets up repository variables and secrets
- ✅ Commits and pushes to GitHub
- ✅ Triggers the first deployment

Check your repository's **Actions** tab to see the deployment in progress.

## What Happens Next?

Your Storybook now deploys automatically:

| Event | Result | URL Pattern |
|-------|--------|-------------|
| Push to main | Production deployment | `/{project}/latest` |
| Open PR | Preview deployment | `/{project}/pr-{number}` |
| Update PR | Preview updated | Same URL |
| Merge PR | Main updated | `/{project}/latest` |

## Verification

After the first workflow completes, you should see:

1. A successful workflow run in GitHub Actions
2. Your Storybook live at the deployment URL
3. A comment on PRs with preview links

```bash
# Check your deployment
curl https://view.scry.com/{project}/latest/
```

## Troubleshooting

### "Not a git repository"

Initialize git first:

```bash
git init
git remote add origin https://github.com/your-username/your-repo.git
```

### "GitHub CLI not found"

Install and authenticate GitHub CLI:

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Then authenticate
gh auth login
```

### Skip GitHub CLI Setup

If you prefer to set up secrets manually:

```bash
npx @scry/storybook-deployer init \
  --projectId YOUR_PROJECT_ID \
  --apiKey YOUR_API_KEY \
  --skip-gh-setup
```

Then manually add variables in **Settings → Secrets and variables → Actions**.

## Next Steps

- [First Deployment](/guide/first-deployment) - Understand the deployment process
- [GitHub Actions](/guide/github-actions) - Customize your workflows
- [PR Previews](/guide/pr-previews) - Set up preview comments
