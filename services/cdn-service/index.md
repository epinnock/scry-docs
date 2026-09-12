# CDN Service

The CDN Service is a Cloudflare Worker that serves Storybook builds from R2 storage using subdomain-based routing and partial ZIP extraction.

## Features

- **Partial ZIP Extraction** - Fetch only required bytes from ZIP archives
- **Subdomain Routing** - Route requests by subdomain (`view-{uuid}.domain.com`)
- **Multi-Platform Support** - Cloudflare Workers with R2 or Docker with filesystem
- **Edge Caching** - Global edge caching with Cloudflare KV
- **SPA Fallbacks** - Smart path resolution for single-page apps

## Architecture

```
scry-cdn-service/
├── src/
│   ├── adapters/
│   │   ├── storage/              # R2 / filesystem backends
│   │   └── zip/                  # R2 range reader for unzipit
│   ├── services/
│   │   └── zip/                  # Central directory + extraction logic
│   ├── routes/                   # Route handlers
│   └── utils/                    # Shared helpers
├── cloudflare/                   # Cloudflare Worker entrypoint
└── docker/                       # Node server & Docker assets
```

## How It Works

```
1. Request: https://view-{project}.scrymore.com/path/to/file.js
                    │
                    ▼
2. Parse subdomain to get project ID
                    │
                    ▼
3. Load ZIP central directory from KV cache
   (or hydrate from R2 if cache miss)
                    │
                    ▼
4. Locate file entry in central directory
                    │
                    ▼
5. Fetch only the file's byte range from R2
                    │
                    ▼
6. Decompress if needed (stored vs deflate)
                    │
                    ▼
7. Return with correct MIME type and cache headers
```

## URL Format

Storybooks are accessed via subdomain:

```
https://view-{project-id}.scrymore.com/{path}
```

Examples:
- `https://view-my-design-system.scrymore.com/`
- `https://view-my-design-system.scrymore.com/iframe.html`
- `https://view-my-design-system.scrymore.com/static/main.js`

## Performance

| Metric | Value |
|--------|-------|
| Cache miss (first request) | ~62ms |
| Cache hit | ~31ms |
| Data transfer reduction | ~50x vs full download |
| Edge locations | 300+ globally |

## Storage Backends

### R2 (Cloudflare)

Primary deployment path:
- Archives stored at `static-sites/{project}.zip`
- Partial extraction via range requests
- Metadata cached in KV

### Filesystem (Docker)

For local development:
- Pre-extracted directories
- Mimics ZIP contents structure
- Hot reload support

## Quick Start

### Viewing Deployed Storybooks

```bash
# Access a deployed Storybook
curl https://view-my-project.scrymore.com/

# Access a specific file
curl https://view-my-project.scrymore.com/static/main.js
```

### Self-Hosting

See [Deployment](/services/cdn-service/deployment) for self-hosting instructions.

## Next Steps

- [Architecture](/services/cdn-service/architecture) - Technical deep dive
- [Subdomain Routing](/services/cdn-service/subdomain-routing) - URL routing details
- [ZIP Extraction](/services/cdn-service/zip-extraction) - Partial extraction explained
- [Deployment](/services/cdn-service/deployment) - Deploy your own instance
