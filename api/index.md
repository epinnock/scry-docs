# API Overview

Scry provides REST APIs for uploading and serving Storybook builds.

## Services

| Service | Base URL | Purpose |
|---------|----------|---------|
| Upload Service | `https://api.scry.com` | File uploads, build tracking |
| CDN Service | `https://view-{project}.scry.com` | File serving |

## Authentication

Protected endpoints require an API key in the `X-API-Key` header:

```bash
curl -H "X-API-Key: scry_proj_my-project_xxx" \
  https://api.scry.com/upload/my-project/v1.0.0
```

See [Authentication](/api/authentication) for details.

## Quick Reference

### Upload Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `POST` | `/upload/:project/:version` | Yes | Direct upload |
| `POST` | `/presigned-url/:project/:version/:filename` | Yes | Get presigned URL |
| `GET` | `/upload/:project/:version` | No | Get file info |

### CDN Service

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | No | Health check |
| `GET` | `/*` | No | Serve static files |

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Server Error |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/upload/*` | 100/minute per API key |
| `/presigned-url/*` | 100/minute per API key |
| `/health` | Unlimited |
| CDN files | Unlimited (cached at edge) |

## SDKs and Tools

### CLI

The official CLI handles API communication:

```bash
npx @scry/storybook-deployer --dir ./storybook-static
```

### cURL Examples

```bash
# Health check
curl https://api.scry.com/health

# Upload
curl -X POST \
  -H "X-API-Key: scry_proj_xxx" \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  https://api.scry.com/upload/my-project/v1.0.0

# Get presigned URL
curl -X POST \
  -H "X-API-Key: scry_proj_xxx" \
  -H "Content-Type: application/zip" \
  https://api.scry.com/presigned-url/my-project/v1.0.0/storybook.zip
```

## API Reference

- [Upload Endpoints](/api/upload-endpoints) - File upload API
- [CDN Endpoints](/api/cdn-endpoints) - File serving API
- [Authentication](/api/authentication) - API key authentication
- [Webhooks](/api/webhooks) - Event notifications
