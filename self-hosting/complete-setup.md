# Complete Self-Hosting Setup

Step-by-step guide to deploy the complete Scry stack.

## Overview

We'll deploy in this order:

1. Firebase (database & auth)
2. Cloudflare R2 & KV (storage)
3. Upload Service (Workers)
4. CDN Service (Workers)
5. Dashboard (Vercel)
6. DNS configuration
7. Verification

**Estimated time:** 2-3 hours

## Step 1: Firebase Setup

### Create Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `scry-self-hosted` (or your choice)
4. Disable Google Analytics (optional)
5. Create project

### Enable Firestore

1. Go to Firestore Database
2. Click "Create database"
3. Select "Start in production mode"
4. Choose region closest to your users
5. Create

### Enable Authentication

1. Go to Authentication → Sign-in method
2. Enable "GitHub"
3. Note the callback URL (you'll need it for GitHub OAuth)
4. Leave Client ID/Secret empty for now

### Create GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Name:** Scry Dashboard
   - **Homepage URL:** `https://dashboard.yourdomain.com`
   - **Callback URL:** (from Firebase, looks like `https://your-project.firebaseapp.com/__/auth/handler`)
4. Create application
5. Copy Client ID
6. Generate and copy Client Secret

### Complete GitHub Auth Setup

1. Back in Firebase → Authentication → GitHub
2. Enter Client ID and Client Secret
3. Save

### Generate Service Account

1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Save as `serviceAccount.json`

### Note Configuration Values

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_API_KEY=your-web-api-key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
```

## Step 2: Cloudflare Setup

### Create R2 Buckets

```bash
# Production bucket
wrangler r2 bucket create scry-static-sites

# Staging bucket (for development)
wrangler r2 bucket create scry-static-sites-staging
```

### Enable Public Access

1. Go to Cloudflare Dashboard → R2
2. Select `scry-static-sites`
3. Settings → Public access → Allow Access
4. Note the public URL: `https://pub-xxx.r2.dev`

### Create R2 API Token

1. R2 → Manage R2 API Tokens
2. Create token with "Admin Read & Write" permissions
3. Note Access Key ID and Secret Access Key

### Create KV Namespaces

```bash
# Production
wrangler kv:namespace create CDN_CACHE
# Note the ID

# Preview
wrangler kv:namespace create CDN_CACHE --preview
# Note the preview_id
```

### Note Cloudflare Values

```
CLOUDFLARE_ACCOUNT_ID=your-account-id
R2_BUCKET_NAME=scry-static-sites
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
KV_NAMESPACE_ID=your-kv-id
KV_PREVIEW_ID=your-preview-id
```

## Step 3: Deploy Upload Service

### Clone Repository

```bash
git clone https://github.com/epinnock/scry-storybook-upload-service.git
cd scry-storybook-upload-service
npm install
```

### Configure wrangler.toml

```toml
name = "scry-upload-service"
main = "dist/entry.worker.js"
compatibility_date = "2024-01-01"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "scry-static-sites"

[vars]
R2_BUCKET_NAME = "scry-static-sites"
```

### Set Secrets

```bash
# R2 credentials
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_S3_ACCESS_KEY_ID
wrangler secret put R2_S3_SECRET_ACCESS_KEY

# Firebase credentials (from serviceAccount.json)
wrangler secret put FIREBASE_PROJECT_ID
wrangler secret put FIREBASE_CLIENT_EMAIL
wrangler secret put FIREBASE_PRIVATE_KEY
```

### Deploy

```bash
npm run build
wrangler deploy
```

Note the worker URL: `https://scry-upload-service.your-subdomain.workers.dev`

## Step 4: Deploy CDN Service

### Clone Repository

```bash
cd ..
git clone https://github.com/epinnock/scry-cdn-service.git
cd scry-cdn-service
npm install
```

### Configure wrangler.toml

```toml
name = "scry-cdn-service"
main = "cloudflare/index.ts"
compatibility_date = "2024-01-01"

[[r2_buckets]]
binding = "STATIC_SITES"
bucket_name = "scry-static-sites"

[[kv_namespaces]]
binding = "CDN_CACHE"
id = "your-kv-namespace-id"
preview_id = "your-preview-id"

routes = [
  { pattern = "view.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

### Deploy

```bash
npm run build:cloudflare
wrangler deploy
```

## Step 5: Deploy Dashboard

### Clone Repository

```bash
cd ..
git clone https://github.com/epinnock/scry-developer-dashboard.git
cd scry-developer-dashboard
pnpm install
```

### Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_USE_AUTH=true
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add all other variables
```

Or deploy via Vercel dashboard:
1. Import repository
2. Add environment variables
3. Deploy

## Step 6: DNS Configuration

### Custom Domain for CDN

The CDN routes by path, so one hostname is enough (no wildcard). Add a proxied DNS record:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| AAAA | `view` | `100::` | Yes |

### Custom Domain for Dashboard

Configure in Vercel:
1. Go to project settings → Domains
2. Add `dashboard.yourdomain.com`
3. Configure DNS as instructed

### Update Worker Routes

If using custom domain, update wrangler.toml:

```toml
routes = [
  { pattern = "view.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

Redeploy CDN Service:

```bash
wrangler deploy
```

## Step 7: Verification

### Test Health Endpoints

```bash
# Upload Service
curl https://scry-upload-service.workers.dev/health

# CDN Service
curl https://view-test.yourdomain.com/health
```

### Test Authentication

1. Open Dashboard URL
2. Click "Sign in with GitHub"
3. Complete OAuth flow
4. Verify you see the dashboard

### Test Upload

```bash
# Create test project in Dashboard
# Get API key

# Create test ZIP
echo "test" > test.txt
zip test.zip test.txt

# Upload
curl -X POST \
  -H "X-API-Key: scry_proj_xxx" \
  -H "Content-Type: application/zip" \
  --data-binary @test.zip \
  https://scry-upload-service.workers.dev/upload/test-project/v1.0.0

# View
curl https://view-test-project.yourdomain.com/test.txt
```

## Configuration Reference

### Upload Service Environment

| Variable | Description |
|----------|-------------|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_S3_ACCESS_KEY_ID` | R2 access key |
| `R2_S3_SECRET_ACCESS_KEY` | R2 secret key |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |

### CDN Service Environment

| Variable | Description |
|----------|-------------|
| `R2_BUCKET_NAME` | R2 bucket name (via binding) |
| `CDN_CACHE` | KV namespace (via binding) |

### Dashboard Environment

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase configuration |
| `NEXT_PUBLIC_USE_AUTH` | Enable authentication |

## Troubleshooting

### "Firebase authentication error"

- Verify GitHub OAuth callback URL
- Check Firebase API key is correct
- Ensure GitHub provider is enabled

### "R2 access denied"

- Check R2 API token permissions
- Verify bucket name matches
- Enable public access for downloads

### "CDN returns 404"

- Verify file was uploaded successfully
- Check the URL has the form `/{projectId}/{versionId}/{file}` (the CDN routes by path)
- Verify KV namespace binding

## Next Steps

- [Monitoring](/self-hosting/monitoring) - Set up observability
- [Scaling](/services/overview) - Architecture for scaling
