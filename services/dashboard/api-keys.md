# API Keys Management

Create and manage API keys through the Developer Dashboard.

## Overview

API keys authenticate CLI requests to the Upload Service. Each key is:

- Bound to a single project
- Hashed before storage (never stored in plain text)
- Shown only once when created

## Creating API Keys

### Via Dashboard

1. Log in to the Dashboard
2. Select your project
3. Go to **Settings → API Keys**
4. Click **Generate New Key**
5. Enter a name (e.g., "GitHub Actions")
6. **Copy the key immediately** - it won't be shown again!

### Key Display

When a key is created:

```
┌─────────────────────────────────────────────────────────┐
│  New API Key Created                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ⚠️  Copy this key now. It won't be shown again!       │
│                                                         │
│  scry_proj_my-project_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6 │
│                                                         │
│  [Copy to Clipboard]                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Key Format

```
scry_proj_{projectId}_{randomString}
```

| Part | Description | Length |
|------|-------------|--------|
| `scry_proj_` | Fixed prefix | 10 chars |
| `{projectId}` | Your project ID | Variable |
| `_` | Separator | 1 char |
| `{randomString}` | Random base64url | 32 chars |

Example: `scry_proj_design-system_KjE2MzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkw`

## Using API Keys

### In CLI

```bash
npx @scry/storybook-deployer \
  --dir ./storybook-static \
  --api-key scry_proj_xxx
```

### In Environment Variables

```bash
export STORYBOOK_DEPLOYER_API_KEY=scry_proj_xxx
# or
export SCRY_API_KEY=scry_proj_xxx
```

### In GitHub Actions

1. Add as repository secret:
   - Go to **Settings → Secrets → Actions**
   - Click **New repository secret**
   - Name: `SCRY_API_KEY`
   - Value: Your API key

2. Use in workflow:

```yaml
- name: Deploy
  env:
    STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
  run: npx @scry/storybook-deployer --dir ./storybook-static
```

## Viewing Keys

The key list shows:

| Column | Description |
|--------|-------------|
| Name | Descriptive name you provided |
| Prefix | First 12 characters (safe to display) |
| Last Used | When the key was last used for authentication |
| Created | When the key was created |
| Status | Active or Revoked |

```
┌─────────────────────────────────────────────────────────────────┐
│  API Keys                                                       │
├─────────┬──────────────┬─────────────┬────────────┬────────────┤
│  Name   │  Prefix      │  Last Used  │  Created   │  Status    │
├─────────┼──────────────┼─────────────┼────────────┼────────────┤
│  CI/CD  │  scry_proj_  │  2h ago     │  Jan 15    │  ✓ Active  │
│  Local  │  scry_proj_  │  Never      │  Jan 10    │  ✓ Active  │
│  Old    │  scry_proj_  │  30d ago    │  Dec 1     │  ✗ Revoked │
└─────────┴──────────────┴─────────────┴────────────┴────────────┘
```

## Revoking Keys

To revoke a key:

1. Go to **Settings → API Keys**
2. Find the key to revoke
3. Click the **Revoke** button
4. Confirm revocation

Revoked keys:
- Immediately stop working
- Cannot be un-revoked
- Remain visible in the list (marked as revoked)

::: warning
Revoking a key is immediate and permanent. Any workflows using this key will fail.
:::

## Key Rotation

Best practice is to rotate keys periodically:

1. Create a new key
2. Update your CI/CD secrets
3. Verify deployments work with new key
4. Revoke the old key

### GitHub Actions Rotation

```bash
# 1. Create new key in Dashboard

# 2. Update secret
gh secret set SCRY_API_KEY

# 3. Trigger a deployment to verify

# 4. Revoke old key in Dashboard
```

## Security Best Practices

1. **Never commit keys** - Use environment variables or secrets management
2. **Use descriptive names** - Know which key is used where
3. **Rotate regularly** - Replace keys every 90 days
4. **Revoke unused keys** - Remove keys no longer in use
5. **Monitor usage** - Check "Last Used" for suspicious activity
6. **One key per environment** - Separate keys for CI, staging, production

## Firestore Storage

Keys are stored securely in Firestore:

```
projects/{projectId}/apiKeys/{keyId}
├── id: string
├── name: string          # User-provided name
├── prefix: string        # First 12 chars
├── hash: string          # SHA-256 hash (NEVER the raw key)
├── status: 'active' | 'revoked'
├── createdAt: Timestamp
├── createdBy: string     # User ID
├── lastUsedAt: Timestamp # Updated on each use
├── expiresAt?: Timestamp # Optional expiration
├── revokedAt?: Timestamp
└── revokedBy?: string    # User who revoked
```

::: info
The raw key is never stored. Only the SHA-256 hash is saved, making it impossible to recover the key if lost.
:::

## Troubleshooting

### "Invalid API key"

- Verify the key was copied correctly
- Check the key hasn't been revoked
- Ensure you're using the right project

### "Project mismatch"

- API key is bound to a different project
- Check the project ID in your configuration

### "Key expired"

- Some keys have expiration dates
- Create a new key if expired

### Lost Key

If you lose an API key:
1. You cannot recover it (only hash is stored)
2. Create a new key
3. Revoke the lost key to prevent unauthorized use

## Next Steps

- [Dashboard Setup](/services/dashboard/setup) - Set up the dashboard
- [Firebase Config](/services/dashboard/firebase-config) - Firebase details
- [Upload Service Auth](/services/upload-service/authentication) - How authentication works
