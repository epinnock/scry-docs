# Developer Dashboard

The Developer Dashboard is a web application for managing Scry projects, API keys, and viewing build history.

## Features

- **Project Management** - Create, view, and manage projects
- **Organisations** - Share projects across a team, with members and invites
- **API Key Management** - Generate and revoke project-scoped keys
- **Build History** - View deployment history and status
- **Design Sync** - Figma connection, linked screens, and imported designs
- **Visual Review** - Compare a Figma layer with its story, and raise issues on the difference, with an [Evidence strip](/services/diff-service/review-model#inspect-a-finding-pixel-by-pixel) to inspect a finding pixel by pixel
- **Support references** - Failed actions show a [Ref](#support-references) you can quote to us, and each diff run keeps one
- **Private Previews** - Mint short-lived tokens so private stories render in the Figma plugin
- **GitHub Integration** - Import projects from GitHub repositories
- **User Authentication** - Firebase Auth: Google, GitHub, or email and password

## Support references

When an action in the dashboard fails, the red error message keeps its title and description and adds a line **Ref:** with the request id, plus a **Copy reference** button. After you click it, the button shows **Copied** for two seconds. On a narrow screen the id wraps onto its own line rather than being cut off.

<figure>
  <img src="/images/observability-request-id/toast-with-ref.png" alt="A red error message titled Could not run the diff, saying the diff service did not answer in time (504), with a line Ref: 01M3F9V0Z3K7P2Q8R4S6T1W5X9 and a copy button, and a Dismiss button" width="420" height="222">
  <figcaption>An error with its reference. Copy it with the button next to the id.</figcaption>
</figure>

There's no Ref line when the request never reached Scry, for example when you're offline.

Diff runs keep their reference too. The **Runs for this link** card has a **Run** column after **When**: the short run id (`6fc0a1…`) with a copy button, and under it `ref` with the first characters of the request id that started the run. Hover for the full run id and reference. The copy menu has **Copy run id** and **Copy reference**. Runs from before references existed show `ref —` and only the run id.

<figure>
  <img src="/images/observability-request-id/runs-run-id-column.png" alt="The Runs for this link card with columns When, Run, Who, Tier, Candidates, Cost and Status; each row's Run cell shows a short run id and a ref line with copy buttons, and the oldest row shows ref with a dash" width="880" height="354">
  <figcaption>Run history with the Run column. The oldest run predates references.</figcaption>
</figure>

A reference is safe to paste into an email or a GitHub issue: it's random and grants no access. What to send us with it, and how the id works across services: [Request ids and support references](/api/request-ids#support-references).

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

Sign-in goes through Firebase Auth, which supports Google, GitHub and email/password. The dashboard never handles a provider credential itself — Firebase returns an ID token, and the dashboard exchanges it for its own session.

```
User ──▶ Dashboard ──▶ Firebase Auth ──▶ provider (Google / GitHub / email) ──▶ session
```

Two other credentials exist alongside that session, because not every client is a browser:

| Credential | Prefix | Used by |
| --- | --- | --- |
| Project API key | `scry_proj_` | CI, via the upload service |
| Personal access token | `scry_pat_` | The CLI and the Figma plugin |

Both are stored as hashes. A project key is scoped to one project; a personal access token acts as the user and is what the Figma plugin's device-code sign-in produces.

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
