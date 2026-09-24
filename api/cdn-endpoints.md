# CDN Endpoints

API endpoints for serving Storybook files.

## Base URL

Every project is served from one hostname, with the project and version in the path:

```
https://view.scrymore.com/{projectId}/{versionId}/{path}
```

`versionId` is whatever the build was uploaded as, for example `main`, `pr-123` or `v1.0.0`. See [Path Routing](/services/cdn-service/path-routing) for how a request resolves.

## Health Check

Check if the CDN service is running.

```http
GET /health
```

Returns `200` with a JSON body that includes `"ok": true`, the service name, environment and deployed commit. `/healthz` returns the same.

---

## Serve Static File

Serve any file from a project's Storybook build.

```http
GET /{projectId}/{versionId}/{path}
```

### Authentication

Public projects: none. Private projects need a signed-in Scrymore session (or a short-lived signed preview token), otherwise the CDN answers `401` or `403`.

### Path Resolution

| Request Path | Resolved File |
|--------------|---------------|
| `/{projectId}/{versionId}/` | `index.html` |
| `/{projectId}/{versionId}/iframe.html` | `iframe.html` |
| `/{projectId}/{versionId}/index.json` | `index.json` |
| `/{projectId}/{versionId}/assets/main.js` | `assets/main.js` |

### Examples

```bash
# The demo Storybook
curl https://view.scrymore.com/U9m2H2yeC9wFiR4hlMta/demo-1786260947/

# Its story index
curl https://view.scrymore.com/U9m2H2yeC9wFiR4hlMta/demo-1786260947/index.json

# Headers only
curl -I https://view.scrymore.com/U9m2H2yeC9wFiR4hlMta/demo-1786260947/iframe.html
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

- HTML pages are sent with `Cache-Control: public, max-age=0, must-revalidate`, so a new upload to the same version shows up right away.
- Other files (JS, CSS, `index.json`, images) are sent with `Cache-Control: public, max-age=3600`.

Use hashed filenames (Storybook's default build does) if you need longer browser caching.

---

## Error Responses

| Status | When |
|--------|------|
| `401` / `403` | Private project and you're not signed in, or not a member |
| `404` | Unknown project, version or file. The body is plain text `Not Found` |
| `500` | Server error (e.g. storage unavailable) |

## SPA Fallback

Paths without a file extension that don't exist in the build fall back to the version's `index.html`, so client-side routing works. A missing file with an extension (say `/missing.html`) is a `404`.

---

## CORS

All responses include CORS headers:

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
Access-Control-Allow-Headers: Content-Type, Accept, Cookie, Authorization
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

Each upload lives at its own `versionId`:

```
https://view.scrymore.com/{projectId}/main/
https://view.scrymore.com/{projectId}/pr-123/
https://view.scrymore.com/{projectId}/v1.0.0/
```

Each project keeps its 10 most recent builds. Older builds are deleted automatically once they are 90 days old, and their URLs then return `404` (see [Privacy](/privacy)).

---

## Limits

| Limit | Value |
|-------|-------|
| Maximum file size | 100 MB |
| Request rate | Unlimited (cached at edge) |
| Concurrent connections | Unlimited |
