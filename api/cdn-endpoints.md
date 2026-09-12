# CDN Endpoints

API endpoints for serving Storybook files.

## Base URL

Files are served via subdomain:

```
https://view-{project}.scrymore.com
```

## Health Check

Check if the CDN service is running.

```http
GET /health
```

### Response

```json
{
  "status": "healthy",
  "service": "scry-cdn-service",
  "platform": "cloudflare",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Serve Static File

Serve any file from the project's Storybook build.

```http
GET /{path}
```

### Authentication

Not required. Files are publicly accessible.

### URL Format

```
https://view-{project}.scrymore.com/{path}
```

### Path Resolution

| Request Path | Resolved File |
|--------------|---------------|
| `/` | `index.html` |
| `/index.html` | `index.html` |
| `/iframe.html` | `iframe.html` |
| `/static/main.js` | `static/main.js` |
| `/assets/logo.png` | `assets/logo.png` |

### Response Headers

```http
HTTP/2 200
Content-Type: text/html
Cache-Control: public, max-age=31536000, immutable
Access-Control-Allow-Origin: *
ETag: "abc123"
```

### Examples

```bash
# Get homepage
curl https://view-my-project.scrymore.com/

# Get specific file
curl https://view-my-project.scrymore.com/static/main.js

# Get with verbose headers
curl -I https://view-my-project.scrymore.com/index.html
```

---

## MIME Types

Files are served with appropriate MIME types:

| Extension | MIME Type |
|-----------|-----------|
| `.html` | `text/html` |
| `.js` | `application/javascript` |
| `.mjs` | `application/javascript` |
| `.css` | `text/css` |
| `.json` | `application/json` |
| `.svg` | `image/svg+xml` |
| `.png` | `image/png` |
| `.jpg`, `.jpeg` | `image/jpeg` |
| `.gif` | `image/gif` |
| `.webp` | `image/webp` |
| `.woff` | `font/woff` |
| `.woff2` | `font/woff2` |
| `.ico` | `image/x-icon` |
| Other | `application/octet-stream` |

---

## Caching

### Edge Caching

Files are cached at Cloudflare's edge locations worldwide:

```
Cache-Control: public, max-age=31536000, immutable
```

- **max-age:** 1 year (31,536,000 seconds)
- **immutable:** Content won't change, skip revalidation

### Cache Invalidation

Cached content is invalidated when:

1. New ZIP is uploaded (new version)
2. Cache TTL expires
3. Manual purge (via Cloudflare dashboard)

### Browser Caching

Browsers cache files according to response headers. Use unique filenames (e.g., with hashes) for cache busting.

---

## Error Responses

### 400 Bad Request

Invalid subdomain format.

```json
{
  "error": "Invalid subdomain. Use view-{project}.domain.com"
}
```

### 404 Not Found

File not found in the archive.

```html
<!DOCTYPE html>
<html>
<head><title>404 Not Found</title></head>
<body>
<h1>Not Found</h1>
<p>The requested file was not found.</p>
</body>
</html>
```

### 500 Internal Server Error

Server error (e.g., storage unavailable).

```json
{
  "error": "Internal server error"
}
```

---

## SPA Fallback

For single-page applications, unknown paths fall back to `index.html`:

```
view-my-project.scrymore.com/about       → index.html (if about not found)
view-my-project.scrymore.com/users/123   → index.html (if users/123 not found)
```

This allows client-side routing to work correctly.

---

## CORS

All responses include CORS headers:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

This allows Storybooks to be embedded in iframes from any origin.

---

## Performance

### Response Times

| Scenario | Typical Latency |
|----------|-----------------|
| Cache hit (edge) | ~10-30ms |
| Cache miss (first request) | ~50-100ms |
| Global average | ~30ms |

### Optimizations

1. **Partial ZIP extraction** - Only requested bytes are fetched
2. **Central directory caching** - ZIP metadata cached in KV
3. **Edge caching** - Content cached at 300+ locations
4. **Compression** - Files decompressed on-demand

---

## Version Access

### Latest Version

```
https://view-my-project.scrymore.com/
```

Serves the most recently uploaded build.

### Specific Version (Optional)

If configured with path-based versioning:

```
https://view-my-project.scrymore.com/v1.0.0/
https://view-my-project.scrymore.com/pr-123/
```

---

## Limits

| Limit | Value |
|-------|-------|
| Maximum file size | 100 MB |
| Request rate | Unlimited (cached at edge) |
| Concurrent connections | Unlimited |
