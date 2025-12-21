# What is Scry?

Scry is a cloud deployment platform specifically designed for Storybook. It enables teams to:

- **Deploy Storybook builds** with a single command
- **Preview UI changes** on every pull request
- **Automate deployments** through GitHub Actions
- **Self-host** the entire infrastructure if needed

## The Problem

Sharing Storybook builds with your team shouldn't be complicated. Traditional approaches require:

- Setting up hosting infrastructure
- Configuring build pipelines
- Managing preview environments
- Dealing with access control

## The Solution

Scry simplifies this to a single command:

```bash
npx @scry/scry init --projectId my-project --apiKey sk_xxx
```

This command:

1. Creates a configuration file
2. Generates GitHub Actions workflows
3. Sets up repository secrets
4. Commits and pushes everything
5. Triggers the first deployment

## Key Concepts

### Projects

A project in Scry corresponds to a single Storybook. Each project has:

- A unique **Project ID**
- An **API Key** for authentication
- Multiple **versions** (deployments)

### Versions

Each deployment creates a new version. Versions can be:

- **Named versions** like `v1.0.0` or `latest`
- **PR versions** like `pr-123`
- **Branch versions** like `feature-new-button`

### Deployments

A deployment is the process of:

1. Building your Storybook
2. Zipping the static files
3. Uploading to Scry
4. Making it available via CDN

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        Your Repository                           │
├──────────────────────────────────────────────────────────────────┤
│  .storybook-deployer.json    GitHub Actions Workflows            │
│  ├── apiUrl                  ├── deploy-storybook.yml            │
│  ├── project                 └── deploy-pr-preview.yml           │
│  └── dir                                                         │
└──────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Scry Upload Service                          │
├──────────────────────────────────────────────────────────────────┤
│  • Authenticates API keys                                        │
│  • Generates presigned URLs                                      │
│  • Stores builds in Cloudflare R2                                │
│  • Tracks builds in Firebase                                     │
└──────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌──────────────────────────────────────────────────────────────────┐
│                       Scry CDN Service                           │
├──────────────────────────────────────────────────────────────────┤
│  • Serves files from R2                                          │
│  • Subdomain-based routing                                       │
│  • Partial ZIP extraction                                        │
│  • Global edge caching                                           │
└──────────────────────────────────────────────────────────────────┘
```

## Next Steps

- [Quick Start](/guide/quick-start) - Get up and running in 5 minutes
- [Installation](/guide/installation) - Detailed installation options
- [First Deployment](/guide/first-deployment) - Deploy your first Storybook
