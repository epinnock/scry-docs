# Upload Service Configuration

Environment variables and configuration options for the Upload Service.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `R2_ACCOUNT_ID` | Cloudflare account ID | `abc123def456` |
| `R2_BUCKET_NAME` | R2 bucket name | `my-storybooks-production` |
| `R2_S3_ACCESS_KEY_ID` | R2 S3 API access key | `xxx` |
| `R2_S3_SECRET_ACCESS_KEY` | R2 S3 API secret key | `xxx` |

### Firebase Variables (Node.js)

| Variable | Description |
|----------|-------------|
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to service account JSON |
| `FIRESTORE_SERVICE_ACCOUNT_ID` | Service account identifier |

### Firebase Variables (Workers)

| Variable | Description |
|----------|-------------|
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Service account email |
| `FIREBASE_PRIVATE_KEY` | Service account private key |
| `FIRESTORE_SERVICE_ACCOUNT_ID` | Service account identifier |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port (Node.js only) |
| `LOG_LEVEL` | `info` | Logging level |

## Configuration Files

### .env (Node.js)

```bash
# .env
PORT=3000

# R2 Storage
R2_ACCOUNT_ID=your-account-id
R2_BUCKET_NAME=my-storybooks-production
R2_S3_ACCESS_KEY_ID=your-access-key
R2_S3_SECRET_ACCESS_KEY=your-secret-key

# Firebase
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
FIRESTORE_SERVICE_ACCOUNT_ID=upload-service
```

### .dev.vars (Workers Local Development)

```bash
# .dev.vars
R2_ACCOUNT_ID="your-account-id"
R2_S3_ACCESS_KEY_ID="your-access-key"
R2_S3_SECRET_ACCESS_KEY="your-secret-key"
R2_BUCKET_NAME="my-storybooks-staging"

# Firebase (extract from serviceAccount.json)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"
FIRESTORE_SERVICE_ACCOUNT_ID="upload-service"
```

::: warning
The `FIREBASE_PRIVATE_KEY` must include literal `\n` characters, not actual newlines.
:::

### wrangler.toml

```toml
name = "storybook-upload-service"
main = "dist/entry.worker.js"
compatibility_date = "2024-01-01"

# R2 Bucket Binding
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "my-storybooks-production"
preview_bucket_name = "my-storybooks-staging"

# Environment Variables
[vars]
R2_BUCKET_NAME = "my-storybooks-production"
LOG_LEVEL = "info"

# Production Environment
[env.production]
name = "storybook-upload-service"
[[env.production.r2_buckets]]
binding = "BUCKET"
bucket_name = "my-storybooks-production"

# Staging Environment
[env.staging]
name = "storybook-upload-service-staging"
[[env.staging.r2_buckets]]
binding = "BUCKET"
bucket_name = "my-storybooks-staging"
```

## Environment Separation

| Environment | R2 Bucket | Purpose |
|-------------|-----------|---------|
| Local Development | `my-storybooks-staging` | Developer testing |
| PR Preview | `my-storybooks-staging` | PR deployments |
| Production | `my-storybooks-production` | Live service |

## Secrets Management

### Cloudflare Workers

Set secrets using Wrangler CLI:

```bash
# Interactive
wrangler secret put R2_ACCOUNT_ID

# From stdin
echo "your-value" | wrangler secret put R2_S3_ACCESS_KEY_ID

# For specific environment
wrangler secret put R2_ACCOUNT_ID --env production
```

List existing secrets:

```bash
wrangler secret list
```

### GitHub Actions

Add secrets in repository settings:

1. **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add each required secret

Use in workflows:

```yaml
env:
  R2_ACCOUNT_ID: ${{ secrets.R2_ACCOUNT_ID }}
  R2_S3_ACCESS_KEY_ID: ${{ secrets.R2_S3_ACCESS_KEY_ID }}
  R2_S3_SECRET_ACCESS_KEY: ${{ secrets.R2_S3_SECRET_ACCESS_KEY }}
```

## Firebase Configuration

### Service Account Setup

1. Go to Firebase Console → Project Settings
2. Navigate to Service Accounts tab
3. Click "Generate new private key"
4. Save the JSON file securely

### Using Service Account

**Node.js:**

```bash
export GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json
```

**Cloudflare Workers:**

Extract values from JSON and set as secrets:

```bash
# Extract from serviceAccount.json
PROJECT_ID=$(jq -r '.project_id' serviceAccount.json)
CLIENT_EMAIL=$(jq -r '.client_email' serviceAccount.json)
PRIVATE_KEY=$(jq -r '.private_key' serviceAccount.json)

# Set as secrets
wrangler secret put FIREBASE_PROJECT_ID <<< "$PROJECT_ID"
wrangler secret put FIREBASE_CLIENT_EMAIL <<< "$CLIENT_EMAIL"
wrangler secret put FIREBASE_PRIVATE_KEY <<< "$PRIVATE_KEY"
```

## Validation

The service validates configuration on startup:

```
[upload-service] Starting...
[upload-service] R2 Account ID: abc***
[upload-service] R2 Bucket: my-storybooks-production
[upload-service] Firebase Project: my-firebase-project
[upload-service] ✓ Configuration valid
[upload-service] Listening on port 3000
```

Missing required variables cause startup failure:

```
[upload-service] Error: Missing required environment variable: R2_ACCOUNT_ID
```

## Next Steps

- [Deployment](/services/upload-service/deployment) - Deploy the service
- [API Reference](/services/upload-service/api-reference) - Endpoint documentation
- [Authentication](/services/upload-service/authentication) - API key setup
