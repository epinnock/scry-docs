# CDN Service Deployment

Deploy the CDN Service to Cloudflare Workers or as a Docker container.

## Prerequisites

- Node.js 20+
- Cloudflare account (for Workers deployment)
- Docker (for Docker deployment)

## Cloudflare Workers Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/epinnock/scry-cdn-service.git
cd scry-cdn-service
npm install
```

### 2. Create R2 Bucket

```bash
wrangler r2 bucket create scry-static-sites
```

### 3. Create KV Namespace

```bash
# Production namespace
wrangler kv:namespace create CDN_CACHE

# Preview namespace (for local development)
wrangler kv:namespace create CDN_CACHE --preview
```

Note the IDs returned for each namespace.

### 4. Configure wrangler.toml

```toml
name = "scry-cdn-service"
main = "cloudflare/index.ts"
compatibility_date = "2024-01-01"

# R2 Bucket Binding
[[r2_buckets]]
binding = "STATIC_SITES"
bucket_name = "scry-static-sites"
preview_bucket_name = "scry-static-sites-staging"

# KV Namespace Binding
[[kv_namespaces]]
binding = "CDN_CACHE"
id = "your-production-kv-id"
preview_id = "your-preview-kv-id"

# Worker Routes
routes = [
  { pattern = "view-*.scry.com/*", zone_name = "scry.com" }
]

# Environment Variables
[vars]
PLATFORM = "cloudflare"
CACHE_CONTROL = "public, max-age=31536000, immutable"
ALLOWED_ORIGINS = "*"
```

### 5. Set Secrets (if needed)

```bash
wrangler secret put FIREBASE_SERVICE_ACCOUNT
wrangler secret put FIREBASE_API_KEY
```

### 6. Deploy

```bash
npm run build:cloudflare
wrangler deploy
```

## Docker Deployment

### 1. Build Image

```bash
npm run docker:build
# or
docker build -t scry-cdn-service .
```

### 2. Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e PLATFORM=docker \
  -e STORAGE_TYPE=filesystem \
  -e STORAGE_PATH=/data \
  -v /var/data/static-sites:/data \
  scry-cdn-service:latest
```

### Using R2 with Docker

```bash
docker run -d \
  -p 3000:3000 \
  -e PLATFORM=docker \
  -e STORAGE_TYPE=r2 \
  -e R2_BUCKET=scry-static-sites \
  -e R2_ACCOUNT_ID=your-account-id \
  -e R2_ACCESS_KEY_ID=your-access-key \
  -e R2_SECRET_ACCESS_KEY=your-secret-key \
  scry-cdn-service:latest
```

### Docker Compose

```yaml
version: '3.8'

services:
  cdn-service:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PLATFORM=docker
      - STORAGE_TYPE=r2
      - R2_BUCKET=${R2_BUCKET}
      - R2_ACCOUNT_ID=${R2_ACCOUNT_ID}
      - R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
      - R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
    restart: unless-stopped
```

## DNS Configuration

### Cloudflare DNS

Add a wildcard record:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| AAAA | `view-*` | `100::` | Enabled |

Or use CNAME:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| CNAME | `*` | `scry-cdn-service.workers.dev` | Enabled |

### Other DNS Providers

Point your domain to Cloudflare nameservers, then configure DNS in Cloudflare.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PLATFORM` | - | `cloudflare` or `docker` |
| `STORAGE_TYPE` | `filesystem` | `filesystem` or `r2` (Docker only) |
| `STORAGE_PATH` | `/data` | Path for filesystem storage |
| `R2_BUCKET` | - | R2 bucket name |
| `R2_ACCOUNT_ID` | - | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | - | R2 access key |
| `R2_SECRET_ACCESS_KEY` | - | R2 secret key |
| `CACHE_CONTROL` | `public, max-age=31536000` | Cache-Control header |
| `ALLOWED_ORIGINS` | `*` | CORS allowed origins |

## Verification

### Health Check

```bash
curl https://view-test.scry.com/health
```

Expected response:

```json
{
  "status": "healthy",
  "service": "scry-cdn-service",
  "platform": "cloudflare",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test File Serving

```bash
# Upload a test ZIP
wrangler r2 object put STATIC_SITES/test-project.zip --file=test.zip

# Access via subdomain
curl -H "Host: view-test-project.localhost:8787" http://localhost:8787/index.html
```

## CI/CD Deployment

### GitHub Actions

```yaml
name: Deploy CDN Service

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm run build:cloudflare

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          workingDirectory: cloudflare
```

## Monitoring

### Cloudflare Dashboard

- Workers → Analytics
- View request counts, errors, latency
- Monitor KV and R2 usage

### Real-time Logs

```bash
wrangler tail
```

### Docker Logs

```bash
docker logs -f scry-cdn-service
```

## Scaling

### Cloudflare Workers

- Automatic global distribution
- No configuration needed
- Scales to millions of requests

### Docker

- Use Kubernetes or Docker Swarm
- Add load balancer
- Configure horizontal pod autoscaler

## Troubleshooting

### "Central directory not found"

- Ensure ZIP file exists in R2/storage
- Check file path format: `{project}.zip`

### "KV namespace not found"

- Verify KV namespace ID in wrangler.toml
- Ensure KV binding name matches code

### "Route not matching"

- Check DNS configuration
- Verify route pattern in wrangler.toml
- Ensure zone_name matches your domain

### CORS Errors

- Check `ALLOWED_ORIGINS` configuration
- Verify CORS headers in response

## Next Steps

- [Architecture](/services/cdn-service/architecture) - Technical details
- [ZIP Extraction](/services/cdn-service/zip-extraction) - How extraction works
- [Upload Service Deployment](/services/upload-service/deployment) - Deploy the upload service
