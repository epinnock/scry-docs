# Vercel Deployment

Deploy the Developer Dashboard to Vercel.

## Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- Firebase configuration ready
- Dashboard repository cloned

## Deploy via Vercel Dashboard

### 1. Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import from GitHub (connect if needed)
4. Select the dashboard repository

### 2. Configure Build Settings

Vercel auto-detects Next.js. Verify:

| Setting | Value |
|---------|-------|
| Framework Preset | Next.js |
| Root Directory | `.` (or subdirectory if monorepo) |
| Build Command | `pnpm build` |
| Output Directory | `.next` |

### 3. Add Environment Variables

Add each variable:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID |
| `NEXT_PUBLIC_USE_AUTH` | `true` |

### 4. Deploy

Click **Deploy** and wait for build to complete.

## Deploy via CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

### Deploy

From the dashboard directory:

```bash
# First deployment (interactive)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? scry-dashboard
# - Directory? ./
# - Override settings? No
```

### Add Environment Variables

```bash
# Add each variable
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# Select environments (Production, Preview, Development)
# Enter value

# Or add from file
vercel env pull .env.local  # Pull existing
vercel env push .env.local  # Push to Vercel
```

### Production Deployment

```bash
vercel --prod
```

## Custom Domain

### Add Domain in Vercel

1. Go to Project Settings → Domains
2. Enter your domain: `dashboard.yourdomain.com`
3. Click **Add**

### Configure DNS

Add the DNS record as instructed:

**Option 1: CNAME (Subdomain)**

| Type | Name | Value |
|------|------|-------|
| CNAME | `dashboard` | `cname.vercel-dns.com` |

**Option 2: A Record (Apex domain)**

| Type | Name | Value |
|------|------|-------|
| A | `@` | `76.76.21.21` |

### Verify Domain

1. Wait for DNS propagation (may take a few minutes)
2. Vercel will automatically provision SSL
3. Access your dashboard at the custom domain

## Update Firebase Authorized Domains

Add your Vercel domains to Firebase:

1. Go to Firebase Console → Authentication → Settings
2. Under **Authorized domains**, add:
   - `your-project.vercel.app`
   - `dashboard.yourdomain.com`

## Environment Configuration

### Production vs Preview

Vercel supports different environments:

| Environment | Branch | Purpose |
|-------------|--------|---------|
| Production | `main` | Live site |
| Preview | Other branches | PR previews |
| Development | Local | `vercel dev` |

Set environment-specific variables:

```bash
# Production only
vercel env add NEXT_PUBLIC_USE_AUTH production
# Enter: true

# Preview (for testing without auth)
vercel env add NEXT_PUBLIC_USE_AUTH preview
# Enter: false
```

### Secure Variables

For sensitive values (not `NEXT_PUBLIC_`), use encrypted environment variables. These are not exposed to the browser.

## Automatic Deployments

### GitHub Integration

Vercel automatically deploys when you push:

- **Production:** Push to `main` branch
- **Preview:** Push to any other branch or open PR

### Configure in Vercel

1. Go to Project Settings → Git
2. Configure:
   - Production Branch: `main`
   - Deploy on push: Enabled
   - Preview deployments: Enabled

## Monitoring

### Vercel Analytics

Enable in Project Settings → Analytics:

- Page views
- Web Vitals
- Real-time visitors

### Logs

View deployment logs:

1. Go to Deployments
2. Select a deployment
3. View **Functions** and **Build** logs

### Alerts

Configure alerts in Settings → Notifications:

- Deployment failures
- Domain issues
- Usage warnings

## Alternative Hosting

### Railway

```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### Render

1. Connect GitHub repository
2. Create new Web Service
3. Configure build command: `pnpm build`
4. Configure start command: `pnpm start`
5. Add environment variables
6. Deploy

### Docker (Self-hosted)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t scry-dashboard .
docker run -p 3000:3000 --env-file .env.local scry-dashboard
```

## Troubleshooting

### "Build failed"

- Check build logs for errors
- Verify all environment variables are set
- Ensure `pnpm-lock.yaml` is committed

### "Firebase auth not working"

- Add Vercel domain to Firebase authorized domains
- Check environment variables are set correctly
- Verify GitHub OAuth callback URL includes Vercel domain

### "Page not found (404)"

- Ensure `next.config.js` is configured correctly
- Check for trailing slashes in routes
- Verify pages exist in `app/` directory

### "Environment variables undefined"

- Variables must start with `NEXT_PUBLIC_` to be available in browser
- Redeploy after adding new variables
- Check variable names for typos

## Next Steps

- [Complete Setup](/self-hosting/complete-setup) - Full deployment guide
- [Monitoring](/self-hosting/monitoring) - Set up observability
- [Firebase Config](/services/dashboard/firebase-config) - Firebase details
