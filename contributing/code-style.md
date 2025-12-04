# Code Style

Coding conventions and style guidelines for Scry.

## General Principles

- **Clarity over cleverness** - Write readable code
- **Consistency** - Follow existing patterns
- **Simplicity** - Avoid over-engineering
- **Documentation** - Comment non-obvious logic

## TypeScript

### Use TypeScript

All new code should be TypeScript:

```typescript
// Good
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Avoid - JavaScript without types
function greet(name) {
  return `Hello, ${name}`;
}
```

### Type Annotations

Be explicit with types:

```typescript
// Good - explicit return type
function getUser(id: string): Promise<User> {
  return db.users.get(id);
}

// Avoid - implicit return type for public functions
function getUser(id: string) {
  return db.users.get(id);
}
```

### Interfaces vs Types

Use interfaces for objects, types for unions/intersections:

```typescript
// Interface for objects
interface User {
  id: string;
  name: string;
  email: string;
}

// Type for unions
type Status = 'active' | 'inactive' | 'pending';

// Type for intersections
type AdminUser = User & { permissions: string[] };
```

### Avoid `any`

Use `unknown` instead of `any`:

```typescript
// Good
function parse(input: unknown): User {
  if (isUser(input)) {
    return input;
  }
  throw new Error('Invalid input');
}

// Avoid
function parse(input: any): User {
  return input;
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `apiKey` |
| Functions | camelCase | `getUser`, `validateKey` |
| Classes | PascalCase | `StorageService`, `ApiClient` |
| Interfaces | PascalCase | `User`, `BuildRecord` |
| Types | PascalCase | `Status`, `ApiResponse` |
| Constants | UPPER_SNAKE | `MAX_SIZE`, `DEFAULT_TTL` |
| Files | kebab-case | `api-client.ts`, `storage-service.ts` |

## File Organization

### Project Structure

```
src/
├── index.ts           # Main entry point
├── types/             # Type definitions
│   └── index.ts
├── services/          # Business logic
│   ├── storage.ts
│   └── auth.ts
├── routes/            # API routes
│   └── upload.ts
├── middleware/        # Middleware
│   └── auth.ts
└── utils/             # Helpers
    └── hash.ts
```

### File Contents

Order exports consistently:

```typescript
// 1. Imports
import { Hono } from 'hono';
import type { Context } from 'hono';

// 2. Type definitions
interface Config {
  apiUrl: string;
}

// 3. Constants
const DEFAULT_TTL = 3600;

// 4. Main logic
export class MyService {
  // ...
}

// 5. Helper functions
function helper() {
  // ...
}
```

## Functions

### Keep Functions Small

Each function should do one thing:

```typescript
// Good - single responsibility
async function uploadFile(file: File): Promise<string> {
  const key = generateKey(file);
  await storage.put(key, file);
  return key;
}

async function trackBuild(key: string): Promise<Build> {
  return db.builds.create({ key });
}

// Avoid - too many responsibilities
async function uploadAndTrack(file: File): Promise<Build> {
  const key = generateKey(file);
  await storage.put(key, file);
  const build = await db.builds.create({ key });
  await notifySlack(build);
  return build;
}
```

### Use Early Returns

```typescript
// Good - early returns
function processRequest(req: Request): Response {
  if (!req.body) {
    return new Response('Missing body', { status: 400 });
  }

  if (!isValid(req.body)) {
    return new Response('Invalid body', { status: 400 });
  }

  return handleRequest(req);
}

// Avoid - deep nesting
function processRequest(req: Request): Response {
  if (req.body) {
    if (isValid(req.body)) {
      return handleRequest(req);
    } else {
      return new Response('Invalid body', { status: 400 });
    }
  } else {
    return new Response('Missing body', { status: 400 });
  }
}
```

## Error Handling

### Use Custom Errors

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Usage
throw new ApiError(401, 'Invalid API key');
```

### Handle Errors Explicitly

```typescript
// Good - explicit handling
try {
  await uploadFile(file);
} catch (error) {
  if (error instanceof StorageError) {
    console.error('Storage failed:', error.message);
    throw new ApiError(500, 'Upload failed');
  }
  throw error;
}

// Avoid - swallowing errors
try {
  await uploadFile(file);
} catch (error) {
  console.error(error);
}
```

## Async/Await

### Always Use Async/Await

```typescript
// Good
async function getData(): Promise<Data> {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Avoid
function getData(): Promise<Data> {
  return fetch(url)
    .then(res => res.json())
    .then(data => data);
}
```

### Parallel Operations

```typescript
// Good - parallel when possible
const [users, projects] = await Promise.all([
  getUsers(),
  getProjects()
]);

// Avoid - unnecessary sequential
const users = await getUsers();
const projects = await getProjects();
```

## Comments

### When to Comment

```typescript
// Good - explain why
// Use SHA-256 to match the existing key format stored in Firestore
const hash = crypto.createHash('sha256').update(key).digest('hex');

// Avoid - explain what (code should be self-explanatory)
// Hash the key
const hash = crypto.createHash('sha256').update(key).digest('hex');
```

### JSDoc for Public APIs

```typescript
/**
 * Upload a file to storage and track the build.
 *
 * @param file - The file to upload
 * @param options - Upload options
 * @returns The created build record
 * @throws {ApiError} If authentication fails
 */
export async function upload(
  file: File,
  options: UploadOptions
): Promise<Build> {
  // ...
}
```

## Formatting

### Use Prettier

Configure Prettier in `package.json`:

```json
{
  "prettier": {
    "semi": true,
    "singleQuote": true,
    "tabWidth": 2,
    "trailingComma": "es5"
  }
}
```

### Run Before Commit

```bash
# Format all files
npx prettier --write .

# Check formatting
npx prettier --check .
```

## Linting

### Use ESLint

Configure in `.eslintrc.json`:

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error"
  }
}
```

### Run Before Commit

```bash
# Lint all files
npx eslint .

# Fix auto-fixable issues
npx eslint --fix .
```

## Next Steps

- [Testing](/contributing/testing) - Writing tests
- [Pull Requests](/contributing/pull-requests) - Submit changes
- [Development](/contributing/development) - Local setup
