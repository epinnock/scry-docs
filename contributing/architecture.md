# Architecture

Technical architecture and design decisions for Scry.

## System Overview

Scry is a distributed system for deploying and serving Storybook builds:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              User's CI/CD                                    │
│                                                                              │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐            │
│  │  Build         │───▶│  Scry CLI      │───▶│  ZIP Archive   │            │
│  │  Storybook     │    │                │    │                │            │
│  └────────────────┘    └────────────────┘    └───────┬────────┘            │
└──────────────────────────────────────────────────────┼──────────────────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            Upload Service                                    │
│                     (Cloudflare Worker + Hono)                               │
│                                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │  Auth    │  │ Presigned│  │  Build   │  │  Direct  │                    │
│  │  Check   │──▶│   URL    │──▶│  Track   │──▶│  Upload  │                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│       │                                          │                          │
│       ▼                                          ▼                          │
│  ┌──────────┐                             ┌──────────┐                      │
│  │ Firestore│                             │    R2    │                      │
│  │ (builds) │                             │ (files)  │                      │
│  └──────────┘                             └──────────┘                      │
└──────────────────────────────────────────────────────────────────────────────┘
                                                       │
                                                       ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                             CDN Service                                      │
│                     (Cloudflare Worker + Hono)                               │
│                                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Subdomain│  │  Central │  │  Range   │  │   File   │                    │
│  │  Parse   │──▶│   Dir    │──▶│  Request │──▶│  Serve   │                    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│       │              │                                                       │
│       │              ▼                                                       │
│       │        ┌──────────┐                                                 │
│       │        │    KV    │                                                 │
│       │        │  (cache) │                                                 │
│       │        └──────────┘                                                 │
│       ▼                                                                      │
│  ┌──────────┐                                                               │
│  │    R2    │                                                               │
│  │  (ZIPs)  │                                                               │
│  └──────────┘                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Design Principles

### 1. Edge-First

All services run at the edge:
- Cloudflare Workers for compute
- R2 for storage
- KV for caching

Benefits:
- Low latency globally
- No cold starts
- Automatic scaling

### 2. Storage as ZIP

Storybook builds are stored as ZIP files:
- Single object to manage
- Efficient partial extraction
- Atomic uploads

### 3. Presigned URLs

Direct uploads to R2:
- Reduces service bandwidth
- Faster uploads
- Lower costs

### 4. Service Abstraction

All services use interface abstractions:

```typescript
// Storage abstraction
interface StorageService {
  put(key: string, data: ArrayBuffer): Promise<void>;
  get(key: string): Promise<ArrayBuffer | null>;
  getPresignedUrl(key: string): Promise<string>;
}

// Implementations
class R2StorageService implements StorageService { }
class S3StorageService implements StorageService { }
class FilesystemStorageService implements StorageService { }
```

Benefits:
- Portable across environments
- Easy testing
- Flexible deployment

## Component Details

### CLI (`@scry/storybook-deployer`)

**Purpose:** Build, package, and upload Storybook

**Key modules:**

```
bin/
├── cli.js              # Entry point, argument parsing
lib/
├── archive.js          # ZIP creation
├── apiClient.js        # HTTP client
├── logger.js           # Colored output
└── errors.js           # Custom errors
```

**Flow:**

```
1. Parse arguments
2. Load config file
3. Create ZIP archive
4. Request presigned URL
5. Upload directly to R2
```

### Upload Service

**Purpose:** Authenticate uploads, track builds

**Key modules:**

```
src/
├── app.ts              # Hono routes
├── entry.worker.ts     # Worker entry
├── middleware/
│   └── auth.ts         # API key validation
└── services/
    ├── storage/        # R2 operations
    ├── firestore/      # Build tracking
    └── apikey/         # Key management
```

**Authentication flow:**

```
1. Extract X-API-Key header
2. Validate format (scry_proj_{project}_{random})
3. Extract project ID from key
4. Hash key with SHA-256
5. Query Firestore for hash match
6. Verify status and expiration
7. Check project matches request
8. Update lastUsedAt
```

### CDN Service

**Purpose:** Serve files from ZIP archives

**Key modules:**

```
src/
├── routes/
│   └── zip-static.ts   # File serving
├── services/
│   └── zip/
│       ├── central-directory.ts  # ZIP metadata
│       └── extractor.ts          # File extraction
└── adapters/
    ├── storage/        # R2/filesystem
    └── zip/            # Range reader
```

**Partial extraction:**

```
1. Parse subdomain for project ID
2. Load central directory from KV (or R2)
3. Find file entry in directory
4. Calculate byte offset and size
5. Range request to R2 for file bytes
6. Decompress if needed
7. Return with MIME type
```

### Dashboard

**Purpose:** Project and API key management

**Key modules:**

```
app/
├── (dashboard)/        # Protected routes
│   ├── projects/       # Project management
│   └── settings/       # User settings
├── api/                # API routes
└── login/              # Authentication
lib/
├── firebase.ts         # Firebase init
├── firebase-provider.tsx  # Auth context
└── services/           # Data access
```

## Data Model

### Firestore Structure

```
projects/{projectId}/
├── name: string
├── description: string
├── ownerId: string
├── createdAt: Timestamp
│
├── builds/{buildId}/
│   ├── projectId: string
│   ├── versionId: string
│   ├── buildNumber: number
│   ├── zipUrl: string
│   ├── status: 'active' | 'archived'
│   └── createdAt: Timestamp
│
├── apiKeys/{keyId}/
│   ├── name: string
│   ├── prefix: string
│   ├── hash: string
│   ├── status: 'active' | 'revoked'
│   ├── createdAt: Timestamp
│   └── lastUsedAt: Timestamp
│
└── counters/builds/
    └── currentBuildNumber: number
```

### R2 Structure

```
static-sites/
└── {projectId}/
    └── {versionId}.zip
```

### KV Structure

```
cd:{projectId}.zip → { central directory metadata }
```

## Security

### API Key Security

1. **Never stored raw** - Only SHA-256 hash
2. **Project-scoped** - Can only access assigned project
3. **Revocable** - Immediate effect on revocation
4. **Audited** - `lastUsedAt` tracking

### Request Validation

1. Check API key format
2. Validate project ownership
3. Verify file type (ZIP only)
4. Enforce size limits

### Data Isolation

1. Subdomain routing prevents cross-project access
2. Firestore rules enforce owner-only access
3. API keys bound to single project

## Performance

### Caching Strategy

| Data | Cache | TTL |
|------|-------|-----|
| Static files | Edge (Cloudflare) | 1 year |
| Central directory | KV | 24 hours |
| API key validation | None | Real-time |

### Optimization Techniques

1. **Partial ZIP extraction** - ~50x less data transfer
2. **KV caching** - ~10ms vs ~50ms from R2
3. **Presigned URLs** - Direct upload to storage
4. **Edge computing** - No origin roundtrip

## Extensibility

### Adding New Storage Backend

```typescript
// 1. Implement interface
class NewStorageService implements StorageService {
  async put(key: string, data: ArrayBuffer): Promise<void> { }
  async get(key: string): Promise<ArrayBuffer | null> { }
  async getPresignedUrl(key: string): Promise<string> { }
}

// 2. Register in factory
function createStorage(type: string): StorageService {
  switch (type) {
    case 'r2': return new R2StorageService();
    case 'new': return new NewStorageService();
  }
}
```

### Adding New Auth Method

```typescript
// 1. Create middleware
async function newAuth(c: Context, next: Next) {
  const token = c.req.header('Authorization');
  // Validate token
  await next();
}

// 2. Add route
app.post('/upload/*', newAuth, uploadHandler);
```

## Future Considerations

### Planned Features

- Webhooks for build events
- Build comparison/diff
- Team/organization support
- Custom domains per project

### Scalability

Current architecture supports:
- Millions of requests/day
- Thousands of concurrent uploads
- Unlimited storage (R2)

Potential bottlenecks:
- Firestore writes (can shard)
- KV writes (can batch)
- Worker CPU (can optimize)

## Next Steps

- [Development Setup](/contributing/development) - Get started
- [Code Style](/contributing/code-style) - Guidelines
- [Services Overview](/services/overview) - Detailed service docs
