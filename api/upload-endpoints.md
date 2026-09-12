# Upload Endpoints

API endpoints for uploading Storybook builds.

## Base URL

```
https://upload.scrymore.com
```

## Health Check

Check if the service is running.

```http
GET /health
```

### Response

```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Direct Upload

Upload a zipped Storybook build directly to storage.

```http
POST /upload/:project/:version
```

### Authentication

Required. Include `X-API-Key` header.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Project identifier |
| `version` | string | Version string |

### Headers

| Header | Required | Value |
|--------|----------|-------|
| `X-API-Key` | Yes | Your API key |
| `Content-Type` | Yes | `application/zip` |

### Request Body

Binary ZIP file data.

### Response (201 Created)

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

### Example

```bash
curl -X POST \
  -H "X-API-Key: scry_proj_my-project_xxx" \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  https://upload.scrymore.com/upload/my-project/v1.0.0
```

---

## Generate Presigned URL

Get a presigned URL for direct client-side upload to storage.

```http
POST /presigned-url/:project/:version/:filename
```

### Authentication

Required. Include `X-API-Key` header.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Project identifier |
| `version` | string | Version string |
| `filename` | string | File name (e.g., `storybook.zip`) |

### Headers

| Header | Required | Value |
|--------|----------|-------|
| `X-API-Key` | Yes | Your API key |
| `Content-Type` | Yes | MIME type of file to upload |

### Response (200 OK)

```json
{
  "url": "https://xxx.r2.cloudflarestorage.com/bucket/path?X-Amz-...",
  "key": "my-project/v1.0.0/storybook.zip",
  "buildId": "abc123def456",
  "buildNumber": 42
}
```

### Using the Presigned URL

```bash
# 1. Get presigned URL
RESPONSE=$(curl -s -X POST \
  -H "X-API-Key: scry_proj_xxx" \
  -H "Content-Type: application/zip" \
  https://upload.scrymore.com/presigned-url/my-project/v1.0.0/storybook.zip)

# 2. Extract URL
URL=$(echo $RESPONSE | jq -r '.url')

# 3. Upload directly to storage (no API key needed)
curl -X PUT \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  "$URL"
```

---

## Get File Info

Check if a file exists and get its information.

```http
GET /upload/:project/:version
```

### Authentication

Not required.

### Path Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `project` | string | Project identifier |
| `version` | string | Version string |

### Response (200 OK)

```json
{
  "project": "my-project",
  "version": "v1.0.0",
  "key": "my-project/v1.0.0/storybook.zip",
  "available": true
}
```

### Response (404 Not Found)

```json
{
  "project": "my-project",
  "version": "v1.0.0",
  "available": false
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "Missing required parameter: project"
}
```

### 401 Unauthorized

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

```json
{
  "error": "Project mismatch",
  "message": "The API key does not belong to the requested project"
}
```

### 413 Payload Too Large

```json
{
  "error": "File too large",
  "message": "Maximum upload size is 100 MB"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Upload failed"
}
```

---

## Limits

| Limit | Value |
|-------|-------|
| Maximum upload size | 100 MB |
| Presigned URL expiry | 15 minutes |
| Rate limit | 100 requests/minute per API key |

---

## Build Tracking

When Firestore is configured, uploads are tracked:

| Field | Description |
|-------|-------------|
| `buildId` | Unique build identifier |
| `buildNumber` | Auto-incrementing sequence number |
| `projectId` | Project identifier |
| `versionId` | Version string |
| `zipUrl` | Public URL to the uploaded file |
| `status` | `active` or `archived` |
| `createdAt` | Upload timestamp |
