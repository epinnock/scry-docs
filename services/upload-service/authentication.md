# Upload Service Authentication

The Upload Service uses API key authentication to secure upload endpoints.

## API Key Format

API keys follow this format:

```
scry_proj_{projectId}_{randomString}
```

Example:

```
scry_proj_my-design-system_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

Components:
- `scry_proj_` - Fixed prefix
- `{projectId}` - Your project identifier
- `{randomString}` - 32-character random string

## Security Features

### Hashed Storage

Raw API keys are never stored. Only SHA-256 hashes are saved in Firestore:

```
Raw key shown once → SHA-256 hash stored → Hash compared on auth
```

### Project Scoping

Each API key is bound to a specific project:
- Key can only upload to its assigned project
- Cross-project access returns 403 Forbidden

### Optional Expiration

Keys can have an expiration date:

```json
{
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

Expired keys are rejected with 401 Unauthorized.

### Usage Tracking

Each successful authentication updates `lastUsedAt`:

```json
{
  "lastUsedAt": "2024-01-15T10:30:00Z"
}
```

## Firestore Data Model

API keys are stored in Firestore:

```
projects/{projectId}/apiKeys/{keyId}
├── id: string
├── name: string          # e.g., "CI/CD Key"
├── prefix: string        # First 12 chars for display
├── hash: string          # SHA-256 hash (raw key NEVER stored)
├── status: 'active' | 'revoked'
├── createdAt: Date
├── createdBy: string
├── lastUsedAt?: Date     # Updated on each auth
├── expiresAt?: Date      # Optional expiration
├── revokedAt?: Date
└── revokedBy?: string
```

## Using API Keys

### In Request Headers

```bash
curl -X POST \
  -H "X-API-Key: scry_proj_my-project_xxx" \
  https://api.scry.com/upload/my-project/v1.0.0
```

### In Environment Variables

```bash
export SCRY_API_KEY=scry_proj_my-project_xxx
npx @scry/storybook-deployer --dir ./storybook-static
```

### In GitHub Actions

```yaml
- name: Deploy
  env:
    STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
  run: npx @scry/storybook-deployer --dir ./storybook-static
```

## Creating API Keys

### Via Dashboard

1. Log in to the Scry Dashboard
2. Navigate to your project
3. Go to Settings → API Keys
4. Click "Create New Key"
5. Copy the key immediately (shown once!)

### Via Firebase Console

For self-hosted instances:

1. Navigate to Firestore in Firebase Console
2. Go to `projects/{projectId}/apiKeys`
3. Create a new document with required fields
4. Generate hash using:

```javascript
const crypto = require('crypto');
const rawKey = 'scry_proj_my-project_' + crypto.randomBytes(32).toString('base64url');
const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
console.log('Raw Key (save this!):', rawKey);
console.log('Hash (store in Firestore):', hash);
```

## Revoking API Keys

### Via Dashboard

1. Navigate to project API Keys
2. Click "Revoke" on the target key
3. Confirm revocation

### Via Firebase Console

1. Find the key document in `projects/{projectId}/apiKeys/{keyId}`
2. Set `status` to `"revoked"`
3. Optionally set `revokedAt` and `revokedBy`

Revoked keys are immediately rejected.

## Error Responses

| Status | Error | Meaning |
|--------|-------|---------|
| 401 | Authentication required | Missing X-API-Key header |
| 401 | Invalid API key format | Key doesn't match expected format |
| 401 | Invalid API key | Key not found or revoked |
| 401 | API key expired | Key past expiration date |
| 403 | Project mismatch | Key doesn't belong to requested project |

## Best Practices

1. **Never commit keys** - Use environment variables or secrets
2. **Rotate keys regularly** - Create new keys and revoke old ones
3. **Use descriptive names** - Name keys by purpose (e.g., "GitHub Actions")
4. **Monitor usage** - Check `lastUsedAt` for suspicious activity
5. **Set expiration** - For temporary access, use expiring keys
6. **Revoke immediately** - If a key is compromised, revoke it

## Key Generation Script

Generate a key locally for self-hosted instances:

```bash
node -e "
const crypto = require('crypto');
const projectId = 'your-project-id';
const randomPart = crypto.randomBytes(32).toString('base64url');
const rawKey = \`scry_proj_\${projectId}_\${randomPart}\`;
const hash = crypto.createHash('sha256').update(rawKey).digest('hex');
console.log('Raw Key (save this!):', rawKey);
console.log('Hash (store in Firestore):', hash);
console.log('Prefix:', rawKey.slice(0, 12));
"
```

## Next Steps

- [API Reference](/services/upload-service/api-reference) - Complete endpoints
- [Deployment](/services/upload-service/deployment) - Self-hosting guide
- [Configuration](/services/upload-service/configuration) - Environment setup
