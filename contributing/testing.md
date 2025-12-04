# Testing

Guidelines for writing and running tests.

## Testing Stack

| Project | Framework | Runner |
|---------|-----------|--------|
| CLI | - | npm test |
| Upload Service | Vitest | npm test |
| CDN Service | Vitest | npm test |
| Dashboard | Vitest | pnpm test |

## Running Tests

### All Tests

```bash
# In each project directory
npm test
# or
pnpm test
```

### Watch Mode

```bash
npm run test:watch
# or
pnpm test:watch
```

### Coverage

```bash
npm run test:coverage
# or
pnpm test:coverage
```

## Writing Tests

### File Naming

Place tests next to source files:

```
src/
├── services/
│   ├── storage.ts
│   └── storage.test.ts
├── utils/
│   ├── hash.ts
│   └── hash.test.ts
```

Or in a `__tests__` directory:

```
src/
├── services/
│   └── storage.ts
└── __tests__/
    └── storage.test.ts
```

### Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from './storage';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
  });

  describe('upload', () => {
    it('should upload a file and return the key', async () => {
      const file = new Blob(['content']);
      const key = await service.upload(file, 'test.txt');

      expect(key).toBe('test.txt');
    });

    it('should throw on invalid file', async () => {
      await expect(
        service.upload(null as any, 'test.txt')
      ).rejects.toThrow('Invalid file');
    });
  });
});
```

### Naming Conventions

Use descriptive test names:

```typescript
// Good - describes behavior
it('should return 401 when API key is missing', () => {});
it('should create build record in Firestore', () => {});
it('should extract file from ZIP at correct offset', () => {});

// Avoid - too vague
it('works', () => {});
it('handles errors', () => {});
it('test upload', () => {});
```

## Test Types

### Unit Tests

Test individual functions/classes in isolation:

```typescript
import { hashApiKey } from './hash';

describe('hashApiKey', () => {
  it('should return SHA-256 hash', () => {
    const key = 'scry_proj_test_abc123';
    const hash = hashApiKey(key);

    expect(hash).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should produce consistent hashes', () => {
    const key = 'scry_proj_test_abc123';
    const hash1 = hashApiKey(key);
    const hash2 = hashApiKey(key);

    expect(hash1).toBe(hash2);
  });
});
```

### Integration Tests

Test multiple components together:

```typescript
import { createApp } from './app';
import { MockStorage } from './__mocks__/storage';

describe('Upload API', () => {
  let app: Hono;
  let storage: MockStorage;

  beforeEach(() => {
    storage = new MockStorage();
    app = createApp({ storage });
  });

  it('should upload file and return URL', async () => {
    const response = await app.request('/upload/test/v1', {
      method: 'POST',
      headers: { 'X-API-Key': 'valid-key' },
      body: new Blob(['content']),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.url).toContain('test/v1');
  });
});
```

### E2E Tests

Test the full system:

```typescript
describe('E2E: Deploy Flow', () => {
  it('should deploy and serve Storybook', async () => {
    // 1. Upload
    const uploadRes = await fetch(`${API_URL}/upload/e2e-test/v1`, {
      method: 'POST',
      headers: { 'X-API-Key': E2E_API_KEY },
      body: testZipFile,
    });
    expect(uploadRes.status).toBe(201);

    // 2. Wait for processing
    await new Promise(r => setTimeout(r, 1000));

    // 3. Verify serving
    const cdnRes = await fetch(`${CDN_URL}/index.html`);
    expect(cdnRes.status).toBe(200);
    expect(await cdnRes.text()).toContain('<html>');
  });
});
```

## Mocking

### Manual Mocks

```typescript
// __mocks__/storage.ts
export class MockStorage {
  private files = new Map<string, ArrayBuffer>();

  async put(key: string, data: ArrayBuffer): Promise<void> {
    this.files.set(key, data);
  }

  async get(key: string): Promise<ArrayBuffer | null> {
    return this.files.get(key) || null;
  }
}
```

### Vitest Mocks

```typescript
import { vi, describe, it, expect } from 'vitest';
import { uploadFile } from './upload';
import * as storage from './storage';

vi.mock('./storage');

describe('uploadFile', () => {
  it('should call storage.put', async () => {
    const putSpy = vi.spyOn(storage, 'put').mockResolvedValue();

    await uploadFile(testFile);

    expect(putSpy).toHaveBeenCalledWith(
      expect.stringContaining('.zip'),
      expect.any(ArrayBuffer)
    );
  });
});
```

### Environment Mocking

```typescript
beforeEach(() => {
  vi.stubEnv('R2_BUCKET_NAME', 'test-bucket');
  vi.stubEnv('API_KEY', 'test-key');
});

afterEach(() => {
  vi.unstubAllEnvs();
});
```

## Test Data

### Fixtures

Create test fixtures:

```typescript
// __fixtures__/users.ts
export const testUser = {
  id: 'user-123',
  email: 'test@example.com',
  name: 'Test User',
};

export const testApiKey = {
  id: 'key-123',
  hash: 'abc123...',
  status: 'active',
};
```

### Factories

Use factories for flexible test data:

```typescript
// __factories__/build.ts
export function createBuild(overrides = {}) {
  return {
    id: `build-${Date.now()}`,
    projectId: 'test-project',
    versionId: 'v1.0.0',
    buildNumber: 1,
    status: 'active',
    createdAt: new Date(),
    ...overrides,
  };
}

// Usage
const build = createBuild({ buildNumber: 42 });
```

## Coverage Goals

Target coverage levels:

| Type | Goal |
|------|------|
| Statements | 80% |
| Branches | 75% |
| Functions | 80% |
| Lines | 80% |

Configure in `vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['**/*.test.ts', '**/__mocks__/**'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

## CI Integration

Tests run automatically on PRs:

```yaml
# .github/workflows/test.yml
name: Tests

on:
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - run: npm ci
      - run: npm test
```

## Next Steps

- [Pull Requests](/contributing/pull-requests) - Submit changes
- [Code Style](/contributing/code-style) - Coding conventions
- [Development](/contributing/development) - Local setup
