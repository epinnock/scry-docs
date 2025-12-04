# Upload Service

The Upload Service is a Cloudflare Worker that handles Storybook build uploads and tracking.

## Features

- **Direct Upload** - Upload zipped Storybook builds directly
- **Presigned URLs** - Generate secure, short-lived URLs for client-side uploads
- **API Key Authentication** - Secure project-scoped authentication via Firebase
- **Build Tracking** - Automatically track builds in Firestore with version history
- **Auto-incrementing Build Numbers** - Each project gets sequential build numbers
- **Multi-environment Support** - Run on Node.js, Docker, or Cloudflare Workers

## Architecture

```
src/
├── app.ts              # Shared Hono application logic and routes
├── entry.node.ts       # Entry point for Node.js server
├── entry.worker.ts     # Entry point for Cloudflare Worker
├── middleware/
│   └── auth.ts         # API key authentication middleware
└── services/
    ├── apikey/         # API key service abstraction
    ├── firestore/      # Firestore service for build tracking
    └── storage/        # Storage service abstraction (R2/S3)
```

## Storage Abstraction

The service uses a storage abstraction layer for portability:

- `StorageService` interface for file storage operations
- `R2S3StorageService` implementation for R2/S3 compatible storage
- Works with Cloudflare R2, AWS S3, or MinIO

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `POST` | `/upload/:project/:version` | Yes | Direct upload |
| `POST` | `/presigned-url/:project/:version/:filename` | Yes | Get presigned URL |
| `GET` | `/upload/:project/:version` | No | Get file info |

See [API Reference](/services/upload-service/api-reference) for details.

## Authentication

All upload endpoints require an `X-API-Key` header:

```bash
curl -X POST \
  -H "X-API-Key: scry_proj_my-project_your-api-key-here" \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  https://api.scry.com/upload/my-project/v1.0.0
```

See [Authentication](/services/upload-service/authentication) for details.

## Build Tracking

Builds are tracked in Firebase Firestore:

```
projects/{projectId}/
├── builds/{buildId}
│   ├── id: string
│   ├── projectId: string
│   ├── versionId: string
│   ├── buildNumber: number   # Auto-incrementing
│   ├── zipUrl: string
│   ├── status: 'active' | 'archived'
│   ├── createdAt: Date
│   └── createdBy: string
└── counters/builds
    └── currentBuildNumber: number
```

## Quick Start

### Using the Hosted Service

```bash
# Get presigned URL
curl -X POST \
  -H "X-API-Key: scry_proj_xxx" \
  -H "Content-Type: application/zip" \
  https://api.scry.com/presigned-url/my-project/v1.0.0/storybook.zip

# Upload to returned URL
curl -X PUT \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  "PRESIGNED_URL_HERE"
```

### Self-Hosting

See [Deployment](/services/upload-service/deployment) for self-hosting instructions.

## Next Steps

- [API Reference](/services/upload-service/api-reference) - Complete endpoint documentation
- [Authentication](/services/upload-service/authentication) - API key details
- [Deployment](/services/upload-service/deployment) - Deploy your own instance
- [Configuration](/services/upload-service/configuration) - Environment variables
