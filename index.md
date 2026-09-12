---
layout: home

hero:
  name: Scry
  text: Deploy Storybook to the cloud
  tagline: One command. Automatic PR previews. Zero configuration.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/quick-start
    - theme: alt
      text: View on GitHub
      link: https://github.com/epinnock/scry-node

features:
  - icon: ⚡
    title: Lightning Fast Setup
    details: Deploy your Storybook in under 5 minutes with npx @scry/storybook-deployer init
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

## Get Started in 5 Minutes

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

That's it! Your Storybook now deploys automatically on every push.

[Learn more →](/guide/quick-start)

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
4. **Merge PR** → Preview cleaned up, main updated

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

- **CLI (`@scry/storybook-deployer`)** - The command-line tool you run in CI
- **Upload Service** - Cloudflare Worker that handles file uploads
- **CDN Service** - Cloudflare Worker that serves your Storybook

[Learn more about the architecture →](/services/overview)
