# CDN Service Architecture

Technical architecture of the CDN Service.

## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CDN Service                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                   │
│  │   Request    │───▶│   Path       │───▶│   Central    │                   │
│  │   Handler    │    │   Resolver   │    │   Directory  │                   │
│  └──────────────┘    └──────────────┘    │   Loader     │                   │
│                                          └───────┬──────┘                   │
│                                                  │                          │
│                                          ┌───────▼──────┐                   │
│                                          │    KV Cache  │                   │
│                                          │   (24h TTL)  │                   │
│                                          └───────┬──────┘                   │
│                                                  │                          │
│                                          ┌───────▼──────┐                   │
│                                          │     R2       │                   │
│                                          │   Storage    │                   │
│                                          └───────┬──────┘                   │
│                                                  │                          │
│  ┌──────────────┐    ┌──────────────┐    ┌───────▼──────┐                   │
│  │   Response   │◀───│   MIME Type  │◀───│    File      │                   │
│  │   Handler    │    │   Detection  │    │   Extractor  │                   │
│  └──────────────┘    └──────────────┘    └──────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Request Handler

Entry point for all incoming requests:

```typescript
app.get('/*', async (c) => {
  const hostname = c.req.header('host') || '';
  const projectId = extractProjectId(hostname);
  const path = c.req.path;

  // Route to appropriate handler
  return handleStaticFile(c, projectId, path);
});
```

### Path Resolver

Resolves the project and version from the path (`src/utils/subdomain.ts`, `parsePathForUUID` — the filename predates path routing):

```typescript
// /{projectId}/{versionId}/{file}
function parsePathForUUID(pathname: string): PathInfo | null {
  const segments = pathname.replace(/^\//, '').split('/').filter(Boolean);
  if (segments.length === 0) return null;
  const projectId = segments[0];
  // …resolves the version and the remaining file path
```

### Central Directory Loader

Loads ZIP metadata with KV caching:

```typescript
async function loadCentralDirectory(projectId: string) {
  const cacheKey = `cd:${projectId}.zip`;

  // Try KV cache first
  let metadata = await kv.get(cacheKey, 'json');

  if (!metadata) {
    // Load from R2 using range request
    metadata = await loadFromR2(projectId);
    await kv.put(cacheKey, JSON.stringify(metadata), {
      expirationTtl: 86400 // 24 hours
    });
  }

  return metadata;
}
```

### File Extractor

Extracts individual files from ZIP:

```typescript
async function extractFile(projectId: string, path: string) {
  const metadata = await loadCentralDirectory(projectId);
  const entry = findEntry(metadata, path);

  if (!entry) {
    return notFound();
  }

  // Fetch only the file's bytes
  const data = await fetchRange(projectId, entry.offset, entry.size);

  // Decompress if needed
  if (entry.compressionMethod === 8) {
    return pako.inflate(data);
  }

  return data;
}
```

### MIME Type Detection

Automatic content type detection:

```typescript
const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  // ... more types
};

function getMimeType(path: string): string {
  const ext = path.match(/\.[^.]+$/)?.[0] || '';
  return MIME_TYPES[ext] || 'application/octet-stream';
}
```

### Response Handler

Builds response with proper headers:

```typescript
function buildResponse(data: ArrayBuffer, path: string) {
  return new Response(data, {
    headers: {
      'Content-Type': getMimeType(path),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    }
  });
}
```

## Data Flow

### First Request (Cache Miss)

```
1. Request arrives at edge
2. Path parsed for project and version, access checked
3. Check KV for central directory → MISS
4. Range request to R2 for ZIP end-of-file
5. Parse central directory from response
6. Store central directory in KV
7. Locate requested file in directory
8. Range request to R2 for file bytes
9. Decompress if deflate-compressed
10. Return with headers
```

### Subsequent Requests (Cache Hit)

```
1. Request arrives at edge
2. Path parsed for project and version, access checked
3. Check KV for central directory → HIT
4. Locate requested file in directory
5. Range request to R2 for file bytes
6. Return with headers
```

## Storage Structure

### R2 Bucket

```
static-sites/
├── project-a/
│   ├── latest.zip
│   ├── v1.0.0.zip
│   └── pr-123.zip
├── project-b/
│   └── latest.zip
└── ...
```

### KV Namespace

```
cd:project-a.zip → { central directory metadata }
cd:project-b.zip → { central directory metadata }
```

## ZIP Structure

Each archive contains:

```
{project}-{version}.zip
├── index.html           # Storybook entry point
├── iframe.html          # Storybook iframe
├── static/
│   ├── main.js
│   ├── styles.css
│   └── ...
├── assets/
│   └── ...
└── [other files]
```

## Error Handling

### File Not Found

```typescript
if (!entry) {
  // Try SPA fallback
  const fallback = findEntry(metadata, 'index.html');
  if (fallback) {
    return extractAndServe(fallback);
  }
  return notFound();
}
```

### Invalid Project

```typescript
if (!projectId) {
  // A path with no resolvable project: try the Referer fallback for
  // absolutely-referenced assets before giving up.
  return new Response('Not found', { status: 404 });
}
```

### Storage Errors

```typescript
try {
  const data = await r2.get(key);
  if (!data) {
    return notFound();
  }
  return serve(data);
} catch (error) {
  console.error('R2 error:', error);
  return serverError();
}
```

## Caching Strategy

| Cache | TTL | Purpose |
|-------|-----|---------|
| Cloudflare Edge | 1 year | Static file caching |
| KV | 24 hours | Central directory metadata |
| Browser | 1 year | Immutable assets |

### Cache Headers

```
Cache-Control: public, max-age=31536000, immutable
```

### Cache Invalidation

- Re-uploading a ZIP doesn't immediately invalidate cache
- Wait for KV TTL to expire (24 hours)
- Or call `clearCentralDirectoryCache()` programmatically

## Performance Optimizations

### Range Requests

Only fetch needed bytes:

```typescript
const response = await r2.get(key, {
  range: { offset, length }
});
```

### Streaming

Stream large files without buffering:

```typescript
return new Response(stream, {
  headers: { 'Content-Type': mimeType }
});
```

### Compression

Files are stored compressed in ZIP; we decompress on the fly for supported types.

## Next Steps

- [Path Routing](/services/cdn-service/path-routing) - URL routing details
- [ZIP Extraction](/services/cdn-service/zip-extraction) - Partial extraction explained
- [Deployment](/services/cdn-service/deployment) - Self-hosting guide
