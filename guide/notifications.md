# Notifications

> **TL;DR:** Get notified on Slack or Microsoft Teams when Storybook previews are deployed.

## What You'll Learn

- How to set up Slack notifications
- How to set up Microsoft Teams notifications
- How to customize notification content

## Overview

Notifications are added as extra steps in your GitHub Actions workflow. This approach gives you full control over when and how notifications are sent.

```
┌────────────────────────────────────────────────────────────────┐
│  GitHub Actions Workflow                                       │
├────────────────────────────────────────────────────────────────┤
│  1. Build Storybook                                            │
│  2. Deploy to Scry           ─────► deployment_url             │
│  3. Comment on PR (existing)                                   │
│  4. Notify Slack (optional)  ◄───── uses deployment_url        │
│  5. Notify Teams (optional)  ◄───── uses deployment_url        │
└────────────────────────────────────────────────────────────────┘
```

## Slack Setup

### Step 1: Create Slack Webhook

1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App** → **From scratch**
3. Name your app (e.g., "Scry Storybook") and select your workspace
4. Go to **Incoming Webhooks** → Toggle **Activate** to ON
5. Click **Add New Webhook to Workspace**
6. Select the channel for notifications
7. Copy the webhook URL

### Step 2: Add Secret to GitHub

```bash
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/services/..."
```

Or via GitHub UI: **Settings → Secrets → Actions → New secret**

### Step 3: Add Workflow Step

Add this after your deploy step:

```yaml
- name: Notify Slack
  if: success()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    payload: |
      {
        "text": "🚀 Storybook Preview Ready",
        "blocks": [
          {
            "type": "header",
            "text": {
              "type": "plain_text",
              "text": "🚀 Storybook Preview Deployed"
            }
          },
          {
            "type": "section",
            "fields": [
              {
                "type": "mrkdwn",
                "text": "*PR:*\n<${{ github.event.pull_request.html_url }}|#${{ github.event.pull_request.number }}>"
              },
              {
                "type": "mrkdwn",
                "text": "*Author:*\n${{ github.event.pull_request.user.login }}"
              },
              {
                "type": "mrkdwn",
                "text": "*Branch:*\n`${{ github.head_ref }}`"
              },
              {
                "type": "mrkdwn",
                "text": "*Commit:*\n`${{ github.sha }}`"
              }
            ]
          },
          {
            "type": "actions",
            "elements": [
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "📖 View Storybook"
                },
                "url": "${{ steps.deploy.outputs.deployment_url }}",
                "style": "primary"
              },
              {
                "type": "button",
                "text": {
                  "type": "plain_text",
                  "text": "View PR"
                },
                "url": "${{ github.event.pull_request.html_url }}"
              }
            ]
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Microsoft Teams Setup

### Step 1: Create Teams Webhook

1. In Microsoft Teams, go to your channel
2. Click **⋯** (more options) → **Connectors** (or **Workflows**)
3. Search for **Incoming Webhook** → **Configure**
4. Name it (e.g., "Scry Storybook")
5. Copy the webhook URL

### Step 2: Add Secret to GitHub

```bash
gh secret set TEAMS_WEBHOOK_URL --body "https://outlook.office.com/webhook/..."
```

### Step 3: Add Workflow Step

Add this after your deploy step:

```yaml
- name: Notify Teams
  if: success()
  run: |
    curl -H "Content-Type: application/json" -d '{
      "@type": "MessageCard",
      "@context": "http://schema.org/extensions",
      "themeColor": "0076D7",
      "summary": "Storybook Preview Deployed",
      "sections": [{
        "activityTitle": "🚀 Storybook Preview Deployed",
        "activitySubtitle": "PR #${{ github.event.pull_request.number }} by ${{ github.event.pull_request.user.login }}",
        "facts": [{
          "name": "Branch",
          "value": "${{ github.head_ref }}"
        }, {
          "name": "Commit",
          "value": "${{ github.sha }}"
        }, {
          "name": "Title",
          "value": "${{ github.event.pull_request.title }}"
        }],
        "markdown": true
      }],
      "potentialAction": [{
        "@type": "OpenUri",
        "name": "View Storybook",
        "targets": [{
          "os": "default",
          "uri": "${{ steps.deploy.outputs.deployment_url }}"
        }]
      }, {
        "@type": "OpenUri",
        "name": "View PR",
        "targets": [{
          "os": "default",
          "uri": "${{ github.event.pull_request.html_url }}"
        }]
      }]
    }' "${{ secrets.TEAMS_WEBHOOK_URL }}"
```

## Toggle Notifications

Use GitHub Variables to enable/disable notifications:

```bash
gh variable set ENABLE_SLACK_NOTIFICATIONS --body "true"
gh variable set ENABLE_TEAMS_NOTIFICATIONS --body "true"
```

Then update the workflow:

```yaml
- name: Notify Slack
  if: success() && vars.ENABLE_SLACK_NOTIFICATIONS == 'true'
  # ... notification step
```

## Notification Appearance

### Slack

```
┌───────────────────────────────────────────────┐
│ 🚀 Storybook Preview Deployed                 │
├───────────────────────────────────────────────┤
│ PR:     #42           Author: @developer      │
│ Branch: feature/new   Commit: abc1234         │
├───────────────────────────────────────────────┤
│ Title: Add new button component               │
│                                               │
│ [📖 View Storybook]  [View PR]                │
└───────────────────────────────────────────────┘
```

### Teams

```
┌───────────────────────────────────────────────┐
│ 🚀 Storybook Preview Deployed                 │
│ PR #42 by developer                           │
├───────────────────────────────────────────────┤
│ Branch: feature/new-button                    │
│ Commit: abc1234                               │
│ Title:  Add new button component              │
├───────────────────────────────────────────────┤
│ [View Storybook]  [View PR]                   │
└───────────────────────────────────────────────┘
```

## Failure Notifications

Notify on deployment failures:

```yaml
- name: Notify Slack on Failure
  if: failure()
  uses: slackapi/slack-github-action@v1.26.0
  with:
    payload: |
      {
        "text": "❌ Storybook Deployment Failed",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "❌ *Storybook deployment failed* for PR #${{ github.event.pull_request.number }}\n\n<${{ github.event.pull_request.html_url }}|View PR> | <${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Logs>"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Troubleshooting

### "Slack notification fails with channel_not_found"

- Regenerate the webhook URL
- Ensure the Slack app is still installed in your workspace

### "Teams notification shows as plain text"

- Ensure using an "Incoming Webhook" connector
- Not a Power Automate flow

### "Notification doesn't include buttons"

- Some configurations may not support interactive elements
- Links will still appear as text

## Variables Reference

| Name | Type | Description |
|------|------|-------------|
| `SLACK_WEBHOOK_URL` | Secret | Slack incoming webhook URL |
| `TEAMS_WEBHOOK_URL` | Secret | Teams incoming webhook URL |
| `ENABLE_SLACK_NOTIFICATIONS` | Variable | Set to `true` to enable |
| `ENABLE_TEAMS_NOTIFICATIONS` | Variable | Set to `true` to enable |

## Next Steps

- [GitHub Actions](/guide/github-actions) - Customize workflows
- [Troubleshooting](/guide/troubleshooting) - Common issues
- [CLI Commands](/cli/commands) - Command reference
