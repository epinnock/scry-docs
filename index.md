---
layout: home

hero:
  name: Scry
  text: Deploy Storybook to the cloud
  tagline: Set up with your AI assistant. Deploy Storybook and find your components.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/epinnock/scry-node

features:
  - icon: ⚡
    title: Set Up with Your Assistant
    details: Install the Scry skill to configure deployments, MCP, and component indexing for your project
  - icon: 🔍
    title: Automatic PR Previews
    details: Every pull request gets its own preview URL for visual review
  - icon: 🚀
    title: Seamless CI/CD
    details: Automatic GitHub Actions workflows for main and PR deployments
  - icon: 🔒
    title: Secure by Default
    details: API key authentication, presigned URLs, and Firebase integration
  - icon: 📦
    title: Cloudflare Powered
    details: R2 storage and Workers for global, low-latency delivery
  - icon: 🛠️
    title: Self-Hostable
    details: Deploy the complete stack on your own infrastructure
---

## Set up with your AI assistant

From your application's repository:

```bash
npx skills add epinnock/scry-node --skill scry-setup
```

Use Node.js 22.20 or newer for the installer. Choose your assistant, then ask:
**“Set up Scry for this project and connect my assistant to its components.”**

The skill adapts to your repository and helps configure deployment, MCP, and
optional Figma linking. You complete sign-in in your browser.

[Set up with AI →](/guide/skill) · [Use the CLI directly →](/guide/quick-start#set-up-directly-with-the-cli)

## How It Works

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Your Codebase  │────▶│  GitHub Actions  │────▶│   Scry Cloud    │
│                 │     │                  │     │                 │
│  • Storybook    │     │  • Build         │     │  • R2 Storage   │
│  • Components   │     │  • Deploy        │     │  • CDN Delivery │
│  • Stories      │     │  • Notify        │     │  • PR Previews  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### What happens when you push?

1. **Push to main** → Deploys to production (`/latest`)
2. **Open a PR** → Deploys preview (`/pr-123`)
3. **Update PR** → Updates preview automatically
4. **Merge PR** → Main deployment updated

## Why Scry?

| Feature | Scry | Chromatic | Vercel |
|---------|------|-----------|--------|
| Storybook Hosting | ✅ | ✅ | ❌ |
| PR Previews | ✅ | ✅ | ✅ |
| One-Command Setup | ✅ | ❌ | ❌ |
| Self-Hostable | ✅ | ❌ | ❌ |
| GitHub Actions | ✅ | ✅ | ✅ |
| Free Tier | ✅ | Limited | Limited |

## Architecture

Scry consists of three main components:

- **CLI (`@scrymore/scry-deployer`)** - The command-line tool you run in CI
- **Upload Service** - Cloudflare Worker that handles file uploads
- **CDN Service** - Cloudflare Worker that serves your Storybook

[Learn more about the architecture →](/services/overview)
