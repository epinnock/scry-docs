# GitHub Actions

> **TL;DR:** Automate Storybook deployments on every push with GitHub Actions.

## What You'll Learn

- How the generated workflows work
- How to customize deployment triggers
- How to handle different environments

## Prerequisites

- [ ] Completed the [Quick Start](/guide/quick-start) setup
- [ ] Repository with GitHub Actions enabled

## Generated Workflows

The `init` command creates two workflow files:

### Main Deployment (`.github/workflows/deploy-storybook.yml`)

Deploys to production on pushes to main:

```yaml
name: Deploy Storybook

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Deploy to Scry
        env:
          STORYBOOK_DEPLOYER_API_URL: ${{ vars.SCRY_API_URL }}
          STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
          STORYBOOK_DEPLOYER_PROJECT: ${{ vars.SCRY_PROJECT_ID }}
          STORYBOOK_DEPLOYER_VERSION: latest
        run: npx @scry/storybook-deployer --dir ./storybook-static
```

### PR Preview (`.github/workflows/deploy-pr-preview.yml`)

Deploys previews for pull requests:

```yaml
name: Deploy PR Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read
  pull-requests: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Storybook
        run: npm run build-storybook

      - name: Deploy Preview
        id: deploy
        env:
          STORYBOOK_DEPLOYER_API_URL: ${{ vars.SCRY_API_URL }}
          STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
          STORYBOOK_DEPLOYER_PROJECT: ${{ vars.SCRY_PROJECT_ID }}
          STORYBOOK_DEPLOYER_VERSION: pr-${{ github.event.pull_request.number }}
        run: |
          npx @scry/storybook-deployer --dir ./storybook-static
          echo "url=${{ vars.SCRY_VIEW_URL }}/${{ vars.SCRY_PROJECT_ID }}/pr-${{ github.event.pull_request.number }}" >> $GITHUB_OUTPUT

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            const url = '${{ steps.deploy.outputs.url }}';
            const body = `## 🚀 Storybook Preview Deployed\n\n**Preview URL:** ${url}\n\n📌 **Details:**\n- **Commit:** \`${{ github.sha }}\`\n- **Branch:** \`${{ github.head_ref }}\`\n\n> This preview will be updated automatically on each commit.`;

            const { data: comments } = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
            });

            const botComment = comments.find(c => c.body.includes('Storybook Preview Deployed'));

            if (botComment) {
              await github.rest.issues.updateComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                comment_id: botComment.id,
                body
              });
            } else {
              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: context.issue.number,
                body
              });
            }
```

## Repository Variables

Set these in **Settings → Secrets and variables → Actions → Variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `SCRY_PROJECT_ID` | Your project identifier | `my-storybook` |
| `SCRY_API_URL` | Upload service endpoint | `https://upload.scrymore.com` |
| `SCRY_VIEW_URL` | CDN viewer URL | `https://view.scrymore.com` |

## Repository Secrets

Set these in **Settings → Secrets and variables → Actions → Secrets**:

| Secret | Description |
|--------|-------------|
| `SCRY_API_KEY` | Your project API key |

::: warning Security
Never commit API keys to your repository. Always use GitHub Secrets.
:::

## Customizing Workflows

### Different Build Commands

If your build command differs from `build-storybook`:

```yaml
- name: Build Storybook
  run: npm run storybook:build  # Your custom command
```

### Additional Build Steps

Add steps before deployment:

```yaml
- name: Run Tests
  run: npm test

- name: Lint
  run: npm run lint

- name: Build Storybook
  run: npm run build-storybook
```

### Deploy on Tags

Deploy on release tags:

```yaml
on:
  push:
    tags:
      - 'v*'

# In deploy step:
STORYBOOK_DEPLOYER_VERSION: ${{ github.ref_name }}
```

### Matrix Builds

Deploy multiple Storybooks:

```yaml
jobs:
  deploy:
    strategy:
      matrix:
        storybook: [main, components, patterns]
    steps:
      # ...
      - name: Deploy
        env:
          STORYBOOK_DEPLOYER_PROJECT: my-project-${{ matrix.storybook }}
        run: npx @scry/storybook-deployer --dir ./storybook-${{ matrix.storybook }}
```

### Conditional Deployment

Deploy only when Storybook files change:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.stories.*'
      - '.storybook/**'
      - 'package.json'
```

## Environment Variables Reference

| Variable | CLI Flag | Description |
|----------|----------|-------------|
| `STORYBOOK_DEPLOYER_DIR` | `--dir` | Build directory |
| `STORYBOOK_DEPLOYER_PROJECT` | `--project` | Project ID |
| `STORYBOOK_DEPLOYER_VERSION` | `--version` | Version string |
| `STORYBOOK_DEPLOYER_API_KEY` | `--api-key` | API key |
| `STORYBOOK_DEPLOYER_API_URL` | `--api-url` | API endpoint |

::: tip
The `SCRY_` prefix also works for all variables and takes precedence.
:::

## Troubleshooting

### "Workflow not triggered"

Check that:
1. Workflow file is in `.github/workflows/`
2. Branch name matches trigger conditions
3. GitHub Actions is enabled for the repository

### "Secrets not available"

For pull requests from forks, secrets are not available by default. Consider:
- Using environment-based secrets
- Requiring approval for fork PRs

### "Build fails"

Check that:
1. `build-storybook` script exists in `package.json`
2. Dependencies are correctly installed
3. Node.js version matches your project requirements

## Next Steps

- [PR Previews](/guide/pr-previews) - Configure preview comments
- [Notifications](/guide/notifications) - Add Slack/Teams notifications
- [Troubleshooting](/guide/troubleshooting) - Common issues and solutions
