# PR Previews

> **TL;DR:** Automatically deploy Storybook previews for every pull request.

## What You'll Learn

- How PR previews work
- How to customize preview comments
- How to handle preview cleanup

## How It Works

When a pull request is opened or updated:

1. **Build** - Storybook is built from the PR branch
2. **Deploy** - Deployed to a unique version (`pr-{number}`)
3. **Comment** - PR is commented with the preview URL
4. **Update** - Comment is updated on subsequent commits

```
PR #123 opened
    │
    ▼
┌─────────────────┐
│ Build Storybook │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Deploy to       │
│ pr-123 version  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Comment on PR   │
│ with preview URL│
└─────────────────┘
```

## Preview URL Format

Each PR gets a unique URL:

```
https://view.scry.com/{project}/pr-{number}/
```

Examples:
- `https://view.scry.com/my-design-system/pr-42/`
- `https://view.scry.com/my-design-system/pr-123/`

## PR Comment

The workflow automatically posts a comment:

```markdown
## 🚀 Storybook Preview Deployed

**Preview URL:** https://view.scry.com/my-project/pr-123

📌 **Details:**
- **Commit:** `abc1234`
- **Branch:** `feature/new-button`
- **Deployed at:** Wed, 13 Nov 2024 05:00:00 GMT

> This preview will be updated automatically on each commit to this PR.
```

## Workflow Configuration

The PR preview workflow (`.github/workflows/deploy-pr-preview.yml`):

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
          STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
          STORYBOOK_DEPLOYER_PROJECT: ${{ vars.SCRY_PROJECT_ID }}
          STORYBOOK_DEPLOYER_VERSION: pr-${{ github.event.pull_request.number }}
        run: npx @scry/storybook-deployer --dir ./storybook-static

      - name: Comment on PR
        uses: actions/github-script@v7
        with:
          script: |
            // Comment script here
```

## Customizing Comments

### Minimal Comment

```javascript
const body = `Preview: ${url}`;
```

### Detailed Comment

```javascript
const body = `
## 🚀 Storybook Preview

| Info | Value |
|------|-------|
| URL | [Preview](${url}) |
| Commit | \`${context.sha.substring(0, 7)}\` |
| Branch | \`${context.payload.pull_request.head.ref}\` |
| Author | @${context.payload.pull_request.user.login} |

### What's Changed
${context.payload.pull_request.title}

---
*Updated: ${new Date().toISOString()}*
`;
```

### With Status Badge

```javascript
const body = `
![Deploy Status](https://img.shields.io/badge/preview-deployed-success)

**Preview:** ${url}
`;
```

## Skip Preview Deployment

Add a label or keyword to skip preview deployment:

```yaml
jobs:
  deploy:
    if: |
      !contains(github.event.pull_request.labels.*.name, 'skip-preview') &&
      !contains(github.event.pull_request.title, '[skip-preview]')
```

## Draft PR Handling

Deploy drafts differently:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Check if draft
        if: github.event.pull_request.draft == true
        run: echo "Skipping deployment for draft PR"

      - name: Deploy Preview
        if: github.event.pull_request.draft != true
        # deployment steps
```

Or deploy drafts to a different path:

```yaml
- name: Deploy Preview
  env:
    STORYBOOK_DEPLOYER_VERSION: ${{ github.event.pull_request.draft && 'draft-' || 'pr-' }}${{ github.event.pull_request.number }}
```

## Preview Cleanup

### Manual Cleanup

Currently, previews persist after PR closure. To clean up:

1. Access the dashboard
2. Navigate to project versions
3. Delete old PR versions

### Cleanup Notification

Add a workflow to notify when PR is closed:

```yaml
name: PR Preview Cleanup Notice

on:
  pull_request:
    types: [closed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Comment cleanup notice
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: '> ℹ️ The Storybook preview for this PR is no longer maintained.'
            });
```

## Troubleshooting

### "Comment not posted"

Check that:
1. Workflow has `pull-requests: write` permission
2. GitHub Actions has permission to comment
3. Bot isn't blocked from commenting

### "Preview not updating"

Ensure:
1. Workflow triggers on `synchronize` event
2. Version uses `pr-{number}` format
3. No caching issues

### "Multiple comments"

The workflow should update existing comments, but if multiple appear:
1. Check comment search logic
2. Ensure bot identity is consistent
3. Delete duplicate comments manually

## Next Steps

- [Notifications](/guide/notifications) - Add Slack/Teams notifications
- [GitHub Actions](/guide/github-actions) - Customize workflows
- [Troubleshooting](/guide/troubleshooting) - Common issues
