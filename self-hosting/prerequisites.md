# Self-Hosting Prerequisites

Everything you need before deploying your own Scry instance.

## Accounts Required

### Cloudflare Account

- **Sign up:** [cloudflare.com](https://cloudflare.com)
- **Required:** Workers, R2, KV (all free tier available)
- **Optional:** Custom domain (can use workers.dev subdomain)

### Firebase Project

- **Sign up:** [firebase.google.com](https://firebase.google.com)
- **Required:** Firestore, Authentication
- **Plan:** Spark (free) is sufficient for most use cases

### GitHub OAuth App

- **Required for:** Dashboard authentication
- **Create at:** GitHub → Settings → Developer settings → OAuth Apps

### Vercel Account (Optional)

- **Sign up:** [vercel.com](https://vercel.com)
- **Required for:** Easy dashboard deployment
- **Alternative:** Any Node.js hosting (Railway, Render, self-hosted)

## Local Tools

### Node.js

Version 18 or later:

```bash
# Check version
node --version  # Should be v18.x or v20.x

# Install via nvm (recommended)
nvm install 20
nvm use 20
```

### pnpm

Package manager:

```bash
# Install
npm install -g pnpm

# Verify
pnpm --version
```

### Wrangler CLI

Cloudflare Workers CLI:

```bash
# Install
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Verify
wrangler whoami
```

### GitHub CLI (Optional)

For repository setup:

```bash
# Install
brew install gh  # macOS
# or
sudo apt install gh  # Ubuntu

# Login
gh auth login
```

## Information to Gather

Before starting, collect these values:

### Cloudflare

| Item | How to Find |
|------|-------------|
| Account ID | Dashboard overview page |
| Zone ID | Domain → Overview (if using custom domain) |
| R2 Access Key ID | R2 → Manage R2 API Tokens |
| R2 Secret Access Key | Same as above |

### Firebase

| Item | How to Find |
|------|-------------|
| Project ID | Project Settings → General |
| API Key | Project Settings → General → Web API Key |
| Auth Domain | `{project-id}.firebaseapp.com` |
| Service Account JSON | Project Settings → Service Accounts → Generate new private key |

### GitHub OAuth

| Item | How to Find |
|------|-------------|
| Client ID | After creating OAuth app |
| Client Secret | After creating OAuth app |
| Callback URL | From Firebase Console → Authentication → GitHub |

## Checklist

Use this checklist to track your progress:

### Accounts
- [ ] Cloudflare account created
- [ ] Firebase project created
- [ ] GitHub OAuth app created (or planned)
- [ ] Vercel account created (optional)

### Cloudflare Resources
- [ ] Account ID noted
- [ ] R2 bucket created
- [ ] R2 API token created
- [ ] KV namespace created (will do during setup)

### Firebase Configuration
- [ ] Firestore enabled
- [ ] Authentication enabled
- [ ] GitHub provider configured
- [ ] Service account JSON downloaded
- [ ] Configuration values noted

### Local Environment
- [ ] Node.js 18+ installed
- [ ] pnpm installed
- [ ] Wrangler CLI installed and logged in
- [ ] Git installed

### Optional
- [ ] Custom domain available
- [ ] DNS access configured
- [ ] SSL certificates (handled by Cloudflare)

## Resource Limits

Ensure your accounts support these limits:

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| R2 Storage | 1 GB | 10 GB |
| R2 Operations | 10K/month | 1M/month |
| Workers Requests | 100K/day | 10M/month |
| KV Operations | 100K/day | Unlimited |
| Firestore Reads | 50K/day | 100K/day |
| Firestore Writes | 20K/day | 50K/day |

All these are within free tier limits for small-medium usage.

## Time Estimate

| Task | Time |
|------|------|
| Account setup | 30 minutes |
| Cloudflare configuration | 30 minutes |
| Firebase configuration | 30 minutes |
| Upload Service deployment | 15 minutes |
| CDN Service deployment | 15 minutes |
| Dashboard deployment | 15 minutes |
| DNS & verification | 15 minutes |
| **Total** | **~2.5 hours** |

## Next Steps

Once you have all prerequisites:

1. [Complete Setup](/self-hosting/complete-setup) - Full walkthrough
2. Or individual guides:
   - [Cloudflare Setup](/self-hosting/cloudflare)
   - [Firebase Setup](/self-hosting/firebase)
   - [Vercel Deployment](/self-hosting/vercel)
