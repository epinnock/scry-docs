# Mermaid Diagrams Setup Guide

This guide shows you how to use Mermaid diagrams in your VitePress documentation.

## Installation

The required packages have been added to `package.json`. Install them by running:

```bash
cd docs
npm install
```

This will install:
- `vitepress-plugin-mermaid` - VitePress plugin for Mermaid support
- `mermaid` - The Mermaid diagram library

## Configuration

The configuration has already been updated in `.vitepress/config.ts`:

```typescript
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid({
  // ... your existing config
})
```

## Usage in Markdown

### Basic Syntax

Use triple backticks with `mermaid` language identifier:

````markdown
```mermaid
graph LR
  A[Start] --> B[Process]
  B --> C[End]
```
````

### Examples

#### 1. Flowchart

````markdown
```mermaid
graph TD
    A[User Visits Site] --> B{Authenticated?}
    B -->|Yes| C[Show Dashboard]
    B -->|No| D[Show Login]
    D --> E[User Logs In]
    E --> C
```
````

**Renders as:**
```mermaid
graph TD
    A[User Visits Site] --> B{Authenticated?}
    B -->|Yes| C[Show Dashboard]
    B -->|No| D[Show Login]
    D --> E[User Logs In]
    E --> C
```

#### 2. Sequence Diagram

````markdown
```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant API
    participant R2

    User->>CLI: scry deploy
    CLI->>CLI: Build Storybook
    CLI->>API: Request presigned URL
    API->>R2: Generate presigned URL
    R2-->>API: Return URL
    API-->>CLI: Presigned URL
    CLI->>R2: Upload ZIP
    R2-->>CLI: Success
    CLI-->>User: Deployment complete
```
````

**Renders as:**
```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant API
    participant R2

    User->>CLI: scry deploy
    CLI->>CLI: Build Storybook
    CLI->>API: Request presigned URL
    API->>R2: Generate presigned URL
    R2-->>API: Return URL
    API-->>CLI: Presigned URL
    CLI->>R2: Upload ZIP
    R2-->>CLI: Success
    CLI-->>User: Deployment complete
```

#### 3. State Diagram

````markdown
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Building: npm run build-storybook
    Building --> Uploading: Build complete
    Uploading --> Deployed: Upload success
    Uploading --> Failed: Upload error
    Failed --> Idle: Retry
    Deployed --> [*]
```
````

**Renders as:**
```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Building: npm run build-storybook
    Building --> Uploading: Build complete
    Uploading --> Deployed: Upload success
    Uploading --> Failed: Upload error
    Failed --> Idle: Retry
    Deployed --> [*]
```

#### 4. Entity Relationship Diagram

````markdown
```mermaid
erDiagram
    PROJECT ||--o{ BUILD : has
    PROJECT ||--o{ API_KEY : has
    BUILD ||--|| VERSION : belongs_to
    
    PROJECT {
        string id PK
        string name
        timestamp createdAt
    }
    
    BUILD {
        string id PK
        string projectId FK
        int buildNumber
        string zipUrl
        timestamp createdAt
    }
    
    API_KEY {
        string id PK
        string projectId FK
        string hash
        string status
    }
```
````

**Renders as:**
```mermaid
erDiagram
    PROJECT ||--o{ BUILD : has
    PROJECT ||--o{ API_KEY : has
    BUILD ||--|| VERSION : belongs_to
    
    PROJECT {
        string id PK
        string name
        timestamp createdAt
    }
    
    BUILD {
        string id PK
        string projectId FK
        int buildNumber
        string zipUrl
        timestamp createdAt
    }
    
    API_KEY {
        string id PK
        string projectId FK
        string hash
        string status
    }
```

#### 5. Gantt Chart (Project Timeline)

````markdown
```mermaid
gantt
    title Scry Documentation Rollout
    dateFormat  YYYY-MM-DD
    section Week 1
    CLI Documentation           :done, w1, 2024-12-01, 7d
    Quick Start Guide          :done, w1a, 2024-12-01, 3d
    section Week 2
    Upload Service Docs        :active, w2, 2024-12-08, 7d
    API Reference             :w2a, 2024-12-08, 5d
    section Week 3
    CDN Service Docs          :w3, 2024-12-15, 7d
    Architecture Guides       :w3a, 2024-12-15, 5d
    section Week 4
    Dashboard Docs            :w4, 2024-12-22, 7d
    Contributing Guide        :w4a, 2024-12-22, 5d
```
````

**Renders as:**
```mermaid
gantt
    title Scry Documentation Rollout
    dateFormat  YYYY-MM-DD
    section Week 1
    CLI Documentation           :done, w1, 2024-12-01, 7d
    Quick Start Guide          :done, w1a, 2024-12-01, 3d
    section Week 2
    Upload Service Docs        :active, w2, 2024-12-08, 7d
    API Reference             :w2a, 2024-12-08, 5d
    section Week 3
    CDN Service Docs          :w3, 2024-12-15, 7d
    Architecture Guides       :w3a, 2024-12-15, 5d
    section Week 4
    Dashboard Docs            :w4, 2024-12-22, 7d
    Contributing Guide        :w4a, 2024-12-22, 5d
```

#### 6. Pie Chart

````markdown
```mermaid
pie title Traffic Sources
    "Direct" : 35
    "GitHub" : 30
    "Search" : 20
    "Social Media" : 10
    "Other" : 5
```
````

**Renders as:**
```mermaid
pie title Traffic Sources
    "Direct" : 35
    "GitHub" : 30
    "Search" : 20
    "Social Media" : 10
    "Other" : 5
```

## Diagram Types Reference

| Type | Identifier | Use Case |
|------|-----------|----------|
| Flowchart | `graph` or `flowchart` | Process flows, decision trees |
| Sequence | `sequenceDiagram` | API interactions, workflows |
| Class | `classDiagram` | Object-oriented design |
| State | `stateDiagram-v2` | State machines, lifecycles |
| ER | `erDiagram` | Database schemas |
| Gantt | `gantt` | Project timelines |
| Pie | `pie` | Proportions, distributions |
| Git | `gitGraph` | Git history visualization |

## Customization

You can customize Mermaid theme in `.vitepress/config.ts`:

```typescript
export default withMermaid({
  // ... other config
  
  mermaidPlugin: {
    class: 'mermaid'
  },
  
  mermaid: {
    // Mermaid configuration
    theme: 'default', // 'default', 'dark', 'forest', 'neutral'
    themeVariables: {
      primaryColor: '#007acc',
      primaryTextColor: '#fff',
      primaryBorderColor: '#005a9e',
      lineColor: '#004578',
      secondaryColor: '#41d1ff',
      tertiaryColor: '#f0f0f0'
    }
  }
})
```

## Troubleshooting

### Diagrams not rendering

1. **Make sure packages are installed:**
   ```bash
   cd docs
   npm install
   ```

2. **Check your markdown syntax:**
   - Use triple backticks (```)
   - Specify `mermaid` as the language
   - Ensure proper Mermaid syntax

3. **Clear cache and rebuild:**
   ```bash
   rm -rf docs/.vitepress/cache
   npm run dev
   ```

### TypeScript errors

The TypeScript errors in config.ts are expected until you run `npm install`. They will disappear after installation.

## Resources

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/) - Test diagrams online
- [VitePress Mermaid Plugin](https://github.com/emersonbottero/vitepress-plugin-mermaid)

## Next Steps

1. Run `npm install` in the docs directory
2. Start the dev server: `npm run dev`
3. Add Mermaid diagrams to your markdown files
4. See them render in real-time!