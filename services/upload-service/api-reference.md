# Upload Service API Reference

## Base URL

- **Production:** `https://upload.scrymore.com`
- **Self-hosted:** Your deployment URL

## Authentication

Protected endpoints require an `X-API-Key` header:

```http
X-API-Key: scry_proj_my-project_your-api-key-here
```

## Endpoints

### Health Check

Check if the service is running.

```http
GET /health
```

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### Direct Upload

Upload a zipped Storybook build directly.

```http
POST /upload/:project/:version
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Project identifier |
| `version` | string | Version string (e.g., `v1.0.0`, `latest`, `pr-123`) |

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes | Your project API key |
| `Content-Type` | Yes | `application/zip` or `multipart/form-data` |

**Body:**

Raw binary ZIP file data.

**Success Response (201 Created):**

```json
{
  "success": true,
  "message": "Upload successful",
  "key": "my-project/v1.0.0/storybook.zip",
  "data": {
    "url": "https://pub-xxx.r2.dev/my-project/v1.0.0/storybook.zip",
    "path": "my-project/v1.0.0/storybook.zip",
    "versionId": "v1.0.0",
    "buildId": "abc123def456",
    "buildNumber": 42
  }
}
```

**Example:**

```bash
curl -X POST \
  -H "X-API-Key: scry_proj_my-project_xxx" \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  https://upload.scrymore.com/upload/my-project/v1.0.0
```

---

### Generate Presigned URL

Generate a presigned URL for direct client-side upload.

```http
POST /presigned-url/:project/:version/:filename
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Project identifier |
| `version` | string | Version string |
| `filename` | string | File name (e.g., `storybook.zip`) |

**Headers:**

| Header | Required | Description |
|--------|----------|-------------|
| `X-API-Key` | Yes | Your project API key |
| `Content-Type` | Yes | MIME type of the file |

**Success Response (200 OK):**

```json
{
  "url": "https://xxx.r2.cloudflarestorage.com/bucket/path?X-Amz-...",
  "key": "my-project/v1.0.0/storybook.zip",
  "buildId": "abc123def456",
  "buildNumber": 42
}
```

**Example:**

```bash
# 1. Get presigned URL
RESPONSE=$(curl -s -X POST \
  -H "X-API-Key: scry_proj_xxx" \
  -H "Content-Type: application/zip" \
  https://upload.scrymore.com/presigned-url/my-project/v1.0.0/storybook.zip)

# 2. Extract URL
URL=$(echo $RESPONSE | jq -r '.url')

# 3. Upload directly to R2
curl -X PUT \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  "$URL"
```

---

### Get File Info

Check if a file exists (no authentication required).

```http
GET /upload/:project/:version
```

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Project identifier |
| `version` | string | Version string |

**Success Response (200 OK):**

```json
{
  "project": "my-project",
  "version": "v1.0.0",
  "key": "my-project/v1.0.0/storybook.zip",
  "available": true
}
```

## Error Responses

### 400 Bad Request

Missing or invalid parameters.

```json
{
  "error": "Missing required parameter: project"
}
```

### 401 Unauthorized

Missing or invalid API key.

```json
{
  "error": "Authentication required"
}
```

```json
{
  "error": "Invalid API key format"
}
```

```json
{
  "error": "Invalid API key"
}
```

### 403 Forbidden

API key doesn't match project.

```json
{
  "error": "Project mismatch",
  "message": "The API key does not belong to the requested project"
}
```

### 500 Internal Server Error

Server-side error.

```json
{
  "error": "Internal server error",
  "message": "Upload failed"
}
```

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/health` | Unlimited |
| `/upload/*` | 100/minute per API key |
| `/presigned-url/*` | 100/minute per API key |

## File Size Limits

| Limit | Value |
|-------|-------|
| Maximum upload size | 100 MB |
| Presigned URL expiry | 15 minutes |

## Next Steps

- [Authentication](/services/upload-service/authentication) - API key management
- [Deployment](/services/upload-service/deployment) - Self-hosting guide
