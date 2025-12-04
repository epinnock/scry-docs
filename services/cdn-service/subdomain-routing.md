# Subdomain Routing

The CDN Service uses subdomain-based routing to serve different projects.

## URL Format

```
https://view-{project-id}.{domain}/{path}
```

Components:
- `view-` - Fixed prefix
- `{project-id}` - Your project identifier
- `{domain}` - Your domain (e.g., `scry.com`)
- `{path}` - File path within the Storybook

## Examples

| URL | Project | Path |
|-----|---------|------|
| `https://view-my-app.scry.com/` | `my-app` | `/` (index.html) |
| `https://view-my-app.scry.com/iframe.html` | `my-app` | `/iframe.html` |
| `https://view-design-system.scry.com/static/main.js` | `design-system` | `/static/main.js` |

## How It Works

### 1. DNS Configuration

Wildcard DNS record points to Cloudflare:

```
*.scry.com → Cloudflare Workers
```

### 2. Worker Route

Worker handles matching requests:

```toml
# wrangler.toml
routes = [
  { pattern = "view-*.scry.com/*", zone_name = "scry.com" }
]
```

### 3. Subdomain Parsing

The worker extracts the project ID:

```typescript
function extractProjectId(hostname: string): string | null {
  // Pattern: view-{projectId}.domain.com
  const match = hostname.match(/^view-([^.]+)\./);
  return match ? match[1] : null;
}

// Examples:
// view-my-app.scry.com → "my-app"
// view-design-system.scry.com → "design-system"
// my-app.scry.com → null (missing view- prefix)
```

### 4. File Resolution

The path is resolved within the project's ZIP:

```typescript
async function handleRequest(c: Context) {
  const hostname = c.req.header('host') || '';
  const projectId = extractProjectId(hostname);
  const path = c.req.path || '/';

  // Resolve to file in ZIP
  const filePath = path === '/' ? 'index.html' : path.slice(1);

  return extractAndServe(projectId, filePath);
}
```

## DNS Configuration

### Cloudflare (Recommended)

1. Add a wildcard AAAA record:
   - **Type:** AAAA
   - **Name:** `view-*` or `*`
   - **Content:** `100::`
   - **Proxy:** Enabled (orange cloud)

2. Or use CNAME:
   - **Type:** CNAME
   - **Name:** `*`
   - **Target:** Your Workers subdomain

### Other DNS Providers

Point wildcard to Cloudflare nameservers, then configure in Cloudflare.

## Worker Routes

### Basic Setup

```toml
# wrangler.toml
routes = [
  { pattern = "view-*.scry.com/*", zone_name = "scry.com" }
]
```

### Multiple Domains

```toml
routes = [
  { pattern = "view-*.scry.com/*", zone_name = "scry.com" },
  { pattern = "view-*.preview.scry.com/*", zone_name = "scry.com" },
  { pattern = "view-*.mycompany.com/*", zone_name = "mycompany.com" }
]
```

### Custom Domain

```toml
routes = [
  { pattern = "storybooks.mycompany.com/*", zone_name = "mycompany.com" },
  { pattern = "view-*.storybooks.mycompany.com/*", zone_name = "mycompany.com" }
]
```

## Path Resolution

### Default Index

```
view-my-app.scry.com/           → index.html
view-my-app.scry.com/index.html → index.html
```

### Nested Paths

```
view-my-app.scry.com/static/main.js     → static/main.js
view-my-app.scry.com/assets/logo.png    → assets/logo.png
view-my-app.scry.com/stories/button.html → stories/button.html
```

### SPA Fallback

For paths that don't match files:

```typescript
if (!entry) {
  // Try index.html for SPA routing
  const fallback = findEntry(metadata, 'index.html');
  if (fallback) {
    return extractAndServe(projectId, 'index.html');
  }
}
```

## Version Routing

By default, subdomain routes to `latest.zip`. For specific versions, use path-based routing:

```
view-my-app.scry.com/             → my-app/latest.zip
view-my-app.scry.com/v1.0.0/      → my-app/v1.0.0.zip (with path middleware)
```

Or use separate subdomains:

```
view-my-app-v1.scry.com/          → my-app-v1/latest.zip
view-my-app-pr-123.scry.com/      → my-app-pr-123/latest.zip
```

## Local Development

### Using curl with Host Header

```bash
# Start local development server
npm run dev:cloudflare  # Port 8787

# Test with Host header
curl -H "Host: view-my-app.localhost:8787" http://localhost:8787/index.html
```

### Using /etc/hosts

Add entries to `/etc/hosts`:

```
127.0.0.1 view-my-app.localhost
127.0.0.1 view-design-system.localhost
```

Access in browser:
- `http://view-my-app.localhost:8787/`

## Error Handling

### Invalid Subdomain

```typescript
if (!projectId) {
  return new Response('Invalid subdomain. Use view-{project}.domain.com', {
    status: 400
  });
}
```

### Project Not Found

```typescript
if (!await projectExists(projectId)) {
  return new Response('Project not found', { status: 404 });
}
```

### File Not Found

```typescript
if (!entry) {
  return new Response('File not found', { status: 404 });
}
```

## Security Considerations

### Project Isolation

Each subdomain is isolated to its project:
- `view-project-a.scry.com` can only access `project-a` files
- Cross-project access is not possible via subdomain manipulation

### CORS

CORS headers allow embedding:

```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
}
```

### Content Security

Files are served with appropriate MIME types to prevent XSS.

## Next Steps

- [ZIP Extraction](/services/cdn-service/zip-extraction) - How files are extracted
- [Architecture](/services/cdn-service/architecture) - Technical deep dive
- [Deployment](/services/cdn-service/deployment) - Self-hosting guide
