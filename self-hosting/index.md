# Self-Hosting Overview

Deploy the complete Scry stack on your own infrastructure.

## Why Self-Host?

- **Data Control** - Keep your Storybook builds on your infrastructure
- **Custom Domain** - Use your own domain for deployments
- **Integration** - Connect to your existing auth and storage systems
- **Compliance** - Meet internal security requirements

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Self-Hosted Scry Stack                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐            │
│  │   Dashboard    │    │ Upload Service │    │  CDN Service   │            │
│  │   (Vercel)     │    │   (Workers)    │    │   (Workers)    │            │
│  └───────┬────────┘    └───────┬────────┘    └───────┬────────┘            │
│          │                     │                     │                      │
│          ▼                     ▼                     ▼                      │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │                    Firebase (Firestore)                      │           │
│  │  • User authentication                                       │           │
│  │  • Project data                                              │           │
│  │  • API keys                                                  │           │
│  │  • Build metadata                                            │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────┐           │
│  │                    Cloudflare (R2 + KV)                      │           │
│  │  • R2: ZIP file storage                                      │           │
│  │  • KV: Central directory cache                               │           │
│  └─────────────────────────────────────────────────────────────┘           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Components

| Component | Deployment | Purpose |
|-----------|------------|---------|
| Dashboard | Vercel / Any Node.js host | Project management, API keys |
| Upload Service | Cloudflare Workers | File uploads, build tracking |
| CDN Service | Cloudflare Workers | File serving |
| Firebase | Google Cloud | Authentication, database |
| Cloudflare R2 | Cloudflare | ZIP file storage |
| Cloudflare KV | Cloudflare | Metadata caching |

## Prerequisites

Before starting, you'll need:

- [ ] **Cloudflare account** with Workers, R2, and KV enabled
- [ ] **Firebase project** with Firestore and Authentication enabled
- [ ] **GitHub OAuth app** (for dashboard authentication)
- [ ] **Domain name** (for custom URLs)
- [ ] **Node.js 18+** and **pnpm** installed locally

## Deployment Order

Deploy components in this order:

1. **Firebase** - Set up authentication and database
2. **Cloudflare R2 & KV** - Create storage resources
3. **Upload Service** - Deploy to Cloudflare Workers
4. **CDN Service** - Deploy to Cloudflare Workers
5. **Dashboard** - Deploy to Vercel
6. **DNS** - Configure custom domains

## Quick Links

- [Prerequisites](/self-hosting/prerequisites) - Detailed requirements
- [Complete Setup](/self-hosting/complete-setup) - Step-by-step guide
- [Cloudflare Setup](/self-hosting/cloudflare) - R2, KV, Workers
- [Firebase Setup](/self-hosting/firebase) - Auth, Firestore
- [Vercel Deployment](/self-hosting/vercel) - Dashboard hosting
- [Monitoring](/self-hosting/monitoring) - Observability setup

## Cost Estimation

| Service | Free Tier | Typical Usage |
|---------|-----------|---------------|
| Cloudflare Workers | 100K requests/day | Usually free |
| Cloudflare R2 | 10 GB storage, 1M requests | ~$0.015/GB |
| Cloudflare KV | 100K reads/day | Usually free |
| Firebase Firestore | 50K reads/day | Usually free |
| Firebase Auth | 50K MAU | Usually free |
| Vercel | Hobby plan | Usually free |

**Total for small team: $0-5/month**

## Alternative Setups

### Minimal Setup (Workers Only)

Skip the Dashboard; manage API keys manually:

1. Deploy Upload Service
2. Deploy CDN Service
3. Create API keys in Firebase Console
4. Use CLI directly

### Docker Setup

Run services as containers:

1. Build Docker images
2. Deploy to Kubernetes/ECS/etc.
3. Use R2 via S3 SDK
4. Same Firebase backend

### On-Premises

Use MinIO instead of R2:

1. Deploy MinIO cluster
2. Configure Upload Service for S3 endpoint
3. Configure CDN Service for MinIO
4. Deploy everything on-prem

## Next Steps

Start with [Prerequisites](/self-hosting/prerequisites) to gather everything you need.
