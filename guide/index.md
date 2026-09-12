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

## Set up Scry

Install the setup skill in your application's repository:

```bash
npx skills add epinnock/scry-node --skill scry-setup
```

The installer requires Node.js 22.20 or newer. Ask your assistant to set up
Scry, or request only the integration you need: Storybook deployment, component
search through MCP, or Figma linking. The assistant checks your existing
configuration and verifies the result; you complete browser sign-in.

See [Set up with AI](/guide/skill) for details, or use the
[direct CLI quick start](/guide/quick-start#set-up-directly-with-the-cli).

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
