# Developer Dashboard

The Developer Dashboard is a web application for managing Scry projects, API keys, and viewing build history.

## Features

- **Project Management** - Create, view, and manage projects
- **GitHub Integration** - Import projects from GitHub repositories
- **API Key Management** - Generate and revoke API keys
- **Build History** - View deployment history and status
- **User Authentication** - GitHub OAuth via Firebase

## Tech Stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI & shadcn/ui
- **Backend:** Firebase (Auth, Firestore, Storage)

## Quick Start

### Access the Hosted Dashboard

Visit [dashboard.scrymore.com](https://dashboard.scrymore.com) to:

1. Sign in with GitHub
2. Create a new project
3. Generate an API key
4. Start deploying!

### Self-Hosting

See [Setup](/services/dashboard/setup) for self-hosting instructions.

## Dashboard Features

### Projects Page

View all your projects:

```
┌─────────────────────────────────────────────────────────┐
│  My Projects                              [New Project] │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Design System│  │ Docs Site    │  │ Component Lib│  │
│  │ 42 builds    │  │ 15 builds    │  │ 8 builds     │  │
│  │ Active       │  │ Active       │  │ Active       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Project Details

View project information and recent builds:

```
┌─────────────────────────────────────────────────────────┐
│  Design System                                          │
├─────────────────────────────────────────────────────────┤
│  Project ID: design-system                              │
│  Created: Jan 15, 2024                                  │
│  Total Builds: 42                                       │
│                                                         │
│  Recent Builds                                          │
│  ├── #42 latest    ✓ Active    2 hours ago             │
│  ├── #41 pr-123    ✓ Active    5 hours ago             │
│  └── #40 v1.2.0    ✓ Active    1 day ago               │
│                                                         │
│  [View All Builds]  [Settings]  [API Keys]              │
└─────────────────────────────────────────────────────────┘
```

### API Keys Management

Generate and manage API keys:

```
┌─────────────────────────────────────────────────────────┐
│  API Keys                                [Generate Key] │
├─────────────────────────────────────────────────────────┤
│  Name            Prefix          Last Used    Status    │
│  ────────────────────────────────────────────────────── │
│  CI/CD Key       scry_proj_...   2 hours ago  Active    │
│  Local Dev       scry_proj_...   Never        Active    │
│  Old Key         scry_proj_...   30 days ago  Revoked   │
└─────────────────────────────────────────────────────────┘
```

## Authentication Flow

1. User clicks "Sign in with GitHub"
2. Redirected to GitHub OAuth
3. GitHub returns authorization code
4. Firebase exchanges code for tokens
5. User session created
6. Redirected to dashboard

```
User ──▶ Dashboard ──▶ GitHub OAuth ──▶ Firebase Auth ──▶ Dashboard
```

## Data Model

### Projects

```typescript
interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: Timestamp;
  createdBy: string;
  ownerId: string;
  settings: {
    defaultVersion: string;
  };
}
```

### Builds

```typescript
interface Build {
  id: string;
  projectId: string;
  versionId: string;
  buildNumber: number;
  zipUrl: string;
  viewerUrl: string;
  status: 'active' | 'archived';
  createdAt: Timestamp;
  createdBy: string;
}
```

### API Keys

```typescript
interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  hash: string; // SHA-256, never the raw key
  status: 'active' | 'revoked';
  createdAt: Timestamp;
  lastUsedAt?: Timestamp;
  expiresAt?: Timestamp;
}
```

## Next Steps

- [Setup](/services/dashboard/setup) - Self-hosting guide
- [Firebase Config](/services/dashboard/firebase-config) - Configure Firebase
- [API Keys](/services/dashboard/api-keys) - Manage API keys
