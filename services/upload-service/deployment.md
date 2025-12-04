# Upload Service Deployment

Deploy the Upload Service to Cloudflare Workers or as a Docker container.

## Prerequisites

- Node.js 18+
- Cloudflare account (for Workers deployment)
- Firebase project with Firestore
- Cloudflare R2 bucket

## Cloudflare Workers Deployment

### 1. Clone the Repository

```bash
git clone https://github.com/epinnock/scry-storybook-upload-service.git
cd scry-storybook-upload-service
npm install
```

### 2. Create R2 Bucket

```bash
# Using Wrangler CLI
wrangler r2 bucket create my-storybooks-production

# Enable public access in Cloudflare Dashboard:
# R2 → Select bucket → Settings → Public access → Allow Access
```

### 3. Configure wrangler.toml

```toml
name = "storybook-upload-service"
main = "dist/entry.worker.js"
compatibility_date = "2024-01-01"

[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-storybooks-production"

[vars]
R2_BUCKET_NAME = "my-storybooks-production"
```

### 4. Set Secrets

```bash
# R2 credentials
wrangler secret put R2_ACCOUNT_ID
wrangler secret put R2_S3_ACCESS_KEY_ID
wrangler secret put R2_S3_SECRET_ACCESS_KEY

# Firebase credentials
wrangler secret put FIREBASE_PROJECT_ID
wrangler secret put FIREBASE_CLIENT_EMAIL
wrangler secret put FIREBASE_PRIVATE_KEY
```

### 5. Build and Deploy

```bash
npm run build
wrangler deploy
```

## Docker Deployment

### 1. Build Image

```bash
docker build -t storybook-upload-service .
```

### 2. Run Container

```bash
docker run -d \
  -p 3000:3000 \
  -e PORT=3000 \
  -e R2_ACCOUNT_ID="your-account-id" \
  -e R2_BUCKET_NAME="your-bucket-name" \
  -e R2_S3_ACCESS_KEY_ID="your-access-key" \
  -e R2_S3_SECRET_ACCESS_KEY="your-secret-key" \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/serviceAccount.json \
  -v /path/to/serviceAccount.json:/app/serviceAccount.json \
  storybook-upload-service
```

### Using Docker Compose

```yaml
version: '3.8'

services:
  upload-service:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - R2_ACCOUNT_ID=${R2_ACCOUNT_ID}
      - R2_BUCKET_NAME=${R2_BUCKET_NAME}
      - R2_S3_ACCESS_KEY_ID=${R2_S3_ACCESS_KEY_ID}
      - R2_S3_SECRET_ACCESS_KEY=${R2_S3_SECRET_ACCESS_KEY}
    volumes:
      - ./serviceAccount.json:/app/serviceAccount.json
```

## Firebase Setup

### 1. Create Service Account

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `serviceAccount.json`

### 2. Configure Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId}/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Create Initial Collections

The service will create collections automatically, but you can initialize:

```javascript
// projects/{projectId}/counters/builds
{
  currentBuildNumber: 0
}
```

## R2 Configuration

### Create API Token

1. Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Create token with "Admin Read & Write" permissions
3. Copy Access Key ID and Secret Access Key

### Enable Public Access

For serving files publicly:

1. R2 → Select bucket → Settings
2. Public access → Allow Access
3. Note the public URL: `https://pub-{bucket}.{account}.r2.dev`

## CI/CD Deployment

### GitHub Actions

```yaml
name: Deploy Upload Service

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
      - run: npm run build

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

## Verification

### Health Check

```bash
curl https://your-worker.workers.dev/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Upload

```bash
# Create test file
echo "test" | zip test.zip -

# Upload
curl -X POST \
  -H "Content-Type: application/zip" \
  -H "X-API-Key: your-api-key" \
  --data-binary @test.zip \
  https://your-worker.workers.dev/upload/test-project/v1.0.0
```

## Monitoring

### Cloudflare Workers

- Cloudflare Dashboard → Workers → Analytics
- View request counts, errors, and latency
- Enable Worker Tail for real-time logs

### Docker/Node.js

- Standard stdout/stderr logging
- Use log aggregation tools (e.g., ELK, Loki)
- Health check endpoint for monitoring

## Troubleshooting

### "R2 connection failed"

- Verify R2 credentials are correct
- Check bucket name matches configuration
- Ensure API token has correct permissions

### "Firebase authentication failed"

- Verify service account JSON is valid
- Check FIREBASE_PRIVATE_KEY includes `\n` characters
- Ensure Firestore is enabled in Firebase Console

### "Public URL returns 403"

- Enable public access on R2 bucket
- Wait a few minutes for propagation

## Next Steps

- [Configuration](/services/upload-service/configuration) - Environment variables
- [API Reference](/services/upload-service/api-reference) - Endpoint documentation
- [CDN Service Deployment](/services/cdn-service/deployment) - Deploy the viewer
