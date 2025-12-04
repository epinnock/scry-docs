# Cloudflare Setup

Configure Cloudflare R2, KV, and Workers for self-hosted Scry.

## Prerequisites

- Cloudflare account
- Wrangler CLI installed and authenticated

```bash
# Verify Wrangler is set up
wrangler whoami
```

## R2 Storage Setup

### Create Buckets

Create separate buckets for production and staging:

```bash
# Production bucket
wrangler r2 bucket create scry-static-sites

# Staging bucket
wrangler r2 bucket create scry-static-sites-staging
```

### Enable Public Access

For the CDN to serve files publicly:

1. Go to Cloudflare Dashboard → R2
2. Select your production bucket
3. Go to **Settings** tab
4. Find **Public access** section
5. Click **Allow Access**
6. Confirm

Note the public URL: `https://pub-{bucket-hash}.{account-id}.r2.dev`

### Create API Token

For S3-compatible API access:

1. Go to R2 → **Manage R2 API Tokens**
2. Click **Create API Token**
3. Configure:
   - **Token name:** Scry Upload Service
   - **Permissions:** Object Read & Write
   - **Specify bucket(s):** Select your buckets
4. Create token
5. **Copy both values immediately:**
   - Access Key ID
   - Secret Access Key

### Verify R2 Access

```bash
# Test with AWS CLI (using R2 endpoint)
aws s3 ls s3://scry-static-sites \
  --endpoint-url https://{account-id}.r2.cloudflarestorage.com
```

## KV Namespace Setup

### Create Namespaces

```bash
# Production namespace
wrangler kv:namespace create CDN_CACHE
```

Output:

```
🌀 Creating namespace with title "scry-cdn-service-CDN_CACHE"
✨ Success!
Add the following to your configuration file:
[[kv_namespaces]]
binding = "CDN_CACHE"
id = "abc123..."
```

```bash
# Preview namespace (for local development)
wrangler kv:namespace create CDN_CACHE --preview
```

Note both IDs for your configuration.

### Configure in wrangler.toml

```toml
[[kv_namespaces]]
binding = "CDN_CACHE"
id = "your-production-id"
preview_id = "your-preview-id"
```

## Workers Deployment

### Upload Service

See [Upload Service Deployment](/services/upload-service/deployment) for detailed steps.

Quick overview:

```bash
# Clone and install
git clone https://github.com/epinnock/scry-storybook-upload-service.git
cd scry-storybook-upload-service
npm install

# Configure wrangler.toml
# Set secrets
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_S3_ACCESS_KEY_ID
wrangler secret put R2_S3_SECRET_ACCESS_KEY

# Deploy
npm run build && wrangler deploy
```

### CDN Service

See [CDN Service Deployment](/services/cdn-service/deployment) for detailed steps.

Quick overview:

```bash
# Clone and install
git clone https://github.com/epinnock/scry-cdn-service.git
cd scry-cdn-service
npm install

# Configure wrangler.toml with KV namespace
# Deploy
npm run build:cloudflare && wrangler deploy
```

## Custom Domain Setup

### Add Domain to Cloudflare

If not already using Cloudflare for DNS:

1. Go to Cloudflare Dashboard
2. Click **Add a Site**
3. Enter your domain
4. Select a plan (Free works)
5. Update nameservers at your registrar

### Configure DNS for CDN

Add a wildcard record for subdomain routing:

**Option 1: AAAA Record (Recommended)**

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| AAAA | `view-*` | `100::` | Proxied |

**Option 2: CNAME Record**

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `*` | `your-cdn-worker.workers.dev` | Proxied |

### Configure Worker Routes

Update CDN Service `wrangler.toml`:

```toml
routes = [
  { pattern = "view-*.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

Redeploy:

```bash
wrangler deploy
```

### Configure Custom Domain for Upload Service

Option 1: Use Workers subdomain (default)

Option 2: Add custom domain:

1. Go to Workers → Your Worker → Triggers
2. Click **Add Custom Domain**
3. Enter `api.yourdomain.com`
4. Add route

## SSL/TLS Configuration

Cloudflare handles SSL automatically when proxy is enabled.

For optimal security:

1. Go to SSL/TLS → Overview
2. Select **Full (strict)** mode
3. Enable **Always Use HTTPS**

## Security Settings

### Configure WAF Rules (Optional)

1. Go to Security → WAF
2. Create custom rules for rate limiting:

```
(http.request.uri.path contains "/upload" and rate > 100)
```

### Configure Access Policies (Optional)

Restrict dashboard access to specific users:

1. Go to Access → Applications
2. Create application for dashboard
3. Configure policies

## Verification

### Test R2 Access

```bash
# Upload test file
echo "test" > test.txt
wrangler r2 object put scry-static-sites/test.txt --file=test.txt

# Verify public access
curl https://pub-xxx.r2.dev/test.txt
```

### Test KV Access

```bash
# Write test value
wrangler kv:key put --namespace-id=xxx test-key "test-value"

# Read test value
wrangler kv:key get --namespace-id=xxx test-key
```

### Test Worker Health

```bash
# Upload Service
curl https://your-upload-service.workers.dev/health

# CDN Service
curl -H "Host: view-test.yourdomain.com" https://your-cdn-service.workers.dev/health
```

## Cost Monitoring

Set up billing alerts:

1. Go to your Cloudflare dashboard
2. Navigate to Manage Account → Billing
3. Set up notifications for usage thresholds

### Current Pricing (as of 2024)

| Resource | Free Tier | Paid |
|----------|-----------|------|
| Workers Requests | 100K/day | $0.50/M |
| R2 Storage | 10 GB | $0.015/GB |
| R2 Operations | 10M Class A, 1M Class B | $0.36/M, $0.036/M |
| KV Reads | 100K/day | $0.50/M |
| KV Writes | 1K/day | $5.00/M |

## Troubleshooting

### "R2 bucket not found"

- Verify bucket name in wrangler.toml
- Check bucket exists: `wrangler r2 bucket list`

### "KV namespace not found"

- Verify namespace ID in wrangler.toml
- Check namespace exists: `wrangler kv:namespace list`

### "Route not matching"

- Verify DNS is proxied (orange cloud)
- Check zone_name matches your domain
- Verify pattern matches expected URLs

### "Public URL returns 403"

- Enable public access on R2 bucket
- Wait a few minutes for propagation

## Next Steps

- [Firebase Setup](/self-hosting/firebase) - Configure authentication
- [Complete Setup](/self-hosting/complete-setup) - Full deployment guide
