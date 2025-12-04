# API Authentication

How to authenticate with the Scry API.

## Overview

The Upload Service uses API key authentication. API keys are:

- Bound to a single project
- Hashed before storage (never stored in plain text)
- Revocable at any time

## API Key Format

```
scry_proj_{projectId}_{randomString}
```

Components:
| Part | Description |
|------|-------------|
| `scry_proj_` | Fixed prefix (10 chars) |
| `{projectId}` | Your project ID (variable) |
| `_` | Separator |
| `{randomString}` | Random base64url (32 chars) |

Example:

```
scry_proj_my-design-system_KjE2MzQ1Njc4OTBhYmNkZWYxMjM0
```

## Using API Keys

### HTTP Header

Include the API key in the `X-API-Key` header:

```bash
curl -X POST \
  -H "X-API-Key: scry_proj_my-project_xxx" \
  -H "Content-Type: application/zip" \
  --data-binary @storybook.zip \
  https://api.scry.com/upload/my-project/v1.0.0
```

### Environment Variable

Set as environment variable for CLI:

```bash
export STORYBOOK_DEPLOYER_API_KEY=scry_proj_my-project_xxx
# or
export SCRY_API_KEY=scry_proj_my-project_xxx

npx @scry/storybook-deployer --dir ./storybook-static
```

### GitHub Actions Secret

1. Add as repository secret:
   - **Settings → Secrets → Actions → New secret**
   - Name: `SCRY_API_KEY`
   - Value: Your API key

2. Use in workflow:

```yaml
- name: Deploy
  env:
    STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
  run: npx @scry/storybook-deployer --dir ./storybook-static
```

## Getting API Keys

### Via Dashboard

1. Log in to [dashboard.scry.com](https://dashboard.scry.com)
2. Select your project
3. Go to **Settings → API Keys**
4. Click **Generate New Key**
5. Copy immediately (shown once!)

### Self-Hosted

For self-hosted instances, create keys via Firebase Console or using the key generation script:

```javascript
const crypto = require('crypto');
const projectId = 'my-project';
const randomPart = crypto.randomBytes(32).toString('base64url');
const rawKey = `scry_proj_${projectId}_${randomPart}`;
const hash = crypto.createHash('sha256').update(rawKey).digest('hex');

console.log('Raw Key:', rawKey);
console.log('Hash:', hash);
console.log('Prefix:', rawKey.slice(0, 12));
```

## Error Responses

### 401 Unauthorized

**Missing header:**

```json
{
  "error": "Authentication required",
  "message": "Missing X-API-Key header"
}
```

**Invalid format:**

```json
{
  "error": "Invalid API key format",
  "message": "API key must start with scry_proj_"
}
```

**Invalid key:**

```json
{
  "error": "Invalid API key",
  "message": "The provided API key is invalid or has been revoked"
}
```

**Expired key:**

```json
{
  "error": "API key expired",
  "message": "This API key has expired"
}
```

### 403 Forbidden

**Project mismatch:**

```json
{
  "error": "Project mismatch",
  "message": "The API key does not belong to the requested project"
}
```

## Authentication Flow

```
1. Client sends request with X-API-Key header
           │
           ▼
2. Middleware extracts API key
           │
           ▼
3. Validate format (scry_proj_{project}_{random})
           │
           ▼
4. Extract project ID from key
           │
           ▼
5. Hash key with SHA-256
           │
           ▼
6. Query Firestore for matching hash
           │
           ▼
7. Verify key status (active, not expired)
           │
           ▼
8. Verify project ID matches request
           │
           ▼
9. Update lastUsedAt timestamp
           │
           ▼
10. Allow request to proceed
```

## Security Best Practices

### Do

- Store keys in environment variables or secret managers
- Use different keys for different environments
- Rotate keys periodically (every 90 days)
- Revoke unused keys immediately
- Monitor key usage via dashboard

### Don't

- Commit keys to version control
- Share keys across projects
- Use keys in client-side code
- Expose keys in logs or error messages

## Key Lifecycle

### Creation

1. User requests new key
2. System generates random string
3. Key is displayed once to user
4. Only SHA-256 hash is stored

### Usage

1. Request includes API key
2. System hashes and validates
3. `lastUsedAt` timestamp updated
4. Request proceeds

### Revocation

1. User revokes key in dashboard
2. Status set to `revoked`
3. Future requests immediately rejected

## Troubleshooting

### "Invalid API key format"

- Ensure key starts with `scry_proj_`
- Check for extra whitespace
- Verify no truncation occurred

### "Invalid API key"

- Key may have been revoked
- Key may be for different project
- Check for typos when copying

### "Project mismatch"

- API key is bound to different project
- Verify project ID in request URL
- Generate new key for correct project

## Next Steps

- [Upload Endpoints](/api/upload-endpoints) - API reference
- [Dashboard API Keys](/services/dashboard/api-keys) - Key management
- [CLI Configuration](/cli/configuration) - Using keys with CLI
