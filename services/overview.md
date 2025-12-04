# Architecture Overview

Scry is composed of three main services that work together to provide Storybook deployment and hosting.

## System Architecture

```mermaid
graph TD
    subgraph CI["CI/CD Pipeline"]
        A[Build Storybook] --> B[Scry CLI Package]
        B --> C[Upload ZIP Archive]
    end
    
    subgraph Upload["Scry Upload Service"]
        D[Authenticate API Key] --> E[Generate Presigned URL]
        E --> F[Store in Cloudflare R2]
        F --> G[Track Build in Firebase]
    end
    
    subgraph CDN["Scry CDN Service"]
        H[Subdomain Routing] --> I[Partial ZIP Extraction]
        I --> J[Serve Static Files]
    end
    
    subgraph Dashboard["Developer Dashboard"]
        K[Project Management]
        L[API Key Management]
        M[Build History]
    end
    
    C --> D
    G --> H
    J --> Dashboard
```

## Services

### 1. CLI (`@scry/storybook-deployer`)

The command-line tool that developers use in their CI/CD pipelines.

**Responsibilities:**
- Initialize project configuration
- Build and zip Storybook static files
- Authenticate with the upload service
- Upload to cloud storage

**Technology:**
- Node.js
- TypeScript
- Published to npm

[Learn more about the CLI →](/cli/)

### 2. Upload Service

A Cloudflare Worker that handles file uploads and build tracking.

**Responsibilities:**
- Validate API keys
- Generate presigned URLs for direct upload
- Track builds in Firebase Firestore
- Manage build numbers and versions

**Technology:**
- Cloudflare Workers
- Hono framework
- Firebase Firestore
- Cloudflare R2

[Learn more about the Upload Service →](/services/upload-service/)

### 3. CDN Service

A Cloudflare Worker that serves Storybook builds from R2 storage.

**Responsibilities:**
- Route requests by subdomain
- Extract files from ZIP archives on-demand
- Cache metadata in Cloudflare KV
- Serve static files with proper MIME types

**Technology:**
- Cloudflare Workers
- Hono framework
- Cloudflare R2 & KV
- Partial ZIP extraction

[Learn more about the CDN Service →](/services/cdn-service/)

### 4. Developer Dashboard

A web application for managing projects and API keys.

**Responsibilities:**
- User authentication (GitHub OAuth)
- Project creation and management
- API key generation and revocation
- Build history viewing

**Technology:**
- Next.js
- TypeScript
- Firebase (Auth, Firestore)
- Tailwind CSS

[Learn more about the Dashboard →](/services/dashboard/)

## Data Flow

### Upload Flow

```mermaid
sequenceDiagram
    participant CI as CI/CD Pipeline
    participant CLI as Scry CLI
    participant Upload as Upload Service
    participant R2 as Cloudflare R2
    participant DB as Firestore
    
    CI->>CI: Build Storybook
    CI->>CLI: Trigger deployment
    CLI->>CLI: ZIP static files
    CLI->>Upload: Request presigned URL + API key
    Upload->>Upload: Validate API key
    Upload->>DB: Create build record
    Upload->>CLI: Return presigned URL
    CLI->>R2: Upload ZIP directly
    R2-->>CLI: Confirm upload
    CLI-->>CI: Deployment complete
```

### View Flow

```mermaid
sequenceDiagram
    participant User
    participant CDN as CDN Service
    participant KV as Cloudflare KV
    participant R2 as Cloudflare R2
    
    User->>CDN: GET view-{project}.scry.com/file
    CDN->>CDN: Parse project from subdomain
    CDN->>KV: Lookup ZIP metadata
    alt Metadata in cache
        KV-->>CDN: Return metadata
    else Cache miss
        CDN->>R2: Read ZIP central directory
        R2-->>CDN: Central directory
        CDN->>KV: Cache metadata (24h TTL)
    end
    CDN->>R2: Extract specific file
    R2-->>CDN: File content
    CDN->>CDN: Set cache headers
    CDN-->>User: Return file
    Note over CDN,User: Response cached at edge
```

## Storage

### Cloudflare R2

Object storage for Storybook builds:

```
static-sites/
├── {project-id}/
│   ├── latest.zip
│   ├── v1.0.0.zip
│   ├── pr-123.zip
│   └── ...
```

### Firebase Firestore

Database for build metadata and API keys:

```mermaid
graph TD
    subgraph Firestore["Firebase Firestore"]
        Project["projects/{projectId}/"]
        
        Builds["builds/{buildId}"]
        BuildData["• buildNumber<br/>• versionId<br/>• zipUrl<br/>• status<br/>• createdAt"]
        
        Keys["apiKeys/{keyId}"]
        KeyData["• hash<br/>• prefix<br/>• status<br/>• createdAt"]
        
        Counters["counters/builds"]
        CounterData["• currentBuildNumber"]
        
        Project --> Builds
        Project --> Keys
        Project --> Counters
        Builds -.-> BuildData
        Keys -.-> KeyData
        Counters -.-> CounterData
    end
```

Or as a hierarchical structure:

```
projects/{projectId}/
├── builds/{buildId}
│   ├── buildNumber
│   ├── versionId
│   ├── zipUrl
│   ├── status
│   └── createdAt
├── apiKeys/{keyId}
│   ├── hash
│   ├── prefix
│   ├── status
│   └── createdAt
└── counters/builds
    └── currentBuildNumber
```

### Cloudflare KV

Cache for ZIP central directory metadata:

```
cd:{project-id}.zip → {central directory metadata}
```

TTL: 24 hours

## Security

### API Key Authentication

- Keys follow format: `scry_proj_{projectId}_{randomString}`
- Only SHA-256 hashes stored in Firestore
- Keys are project-scoped
- Optional expiration support

### Presigned URLs

- Short-lived URLs for direct upload
- No need to proxy file data through service
- Reduces bandwidth and latency

### Build Isolation

- Each project has isolated storage namespace
- Subdomain routing prevents cross-project access
- API keys only work for their assigned project

## Performance

### CDN Edge Caching

- Static files cached at Cloudflare edge
- Long cache TTL (1 year for versioned files)
- Immutable content headers

### Partial ZIP Extraction

- Only extract requested files
- ~50x less data transfer vs full download
- Central directory cached in KV

### Metrics

| Metric | Value |
|--------|-------|
| Cache miss (first request) | ~62ms |
| Cache hit | ~31ms |
| Edge locations | 300+ |

## Self-Hosting

All services can be self-hosted:

1. **Upload Service** - Deploy to Cloudflare Workers
2. **CDN Service** - Deploy to Cloudflare Workers
3. **Dashboard** - Deploy to Vercel or any Node.js host

[Learn more about self-hosting →](/self-hosting/)

## Next Steps

- [Upload Service](/services/upload-service/) - Learn about file uploads
- [CDN Service](/services/cdn-service/) - Learn about file serving
- [Dashboard](/services/dashboard/) - Learn about project management
- [Self-Hosting](/self-hosting/) - Deploy your own instance
