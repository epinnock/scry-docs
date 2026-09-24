# Webhooks

> **Note:** Webhooks are a planned feature and not yet implemented.

## Overview

Webhooks will notify your services when events occur in Scry.

## Planned Events

| Event | Description |
|-------|-------------|
| `build.created` | New build uploaded |
| `build.completed` | Build processing finished |
| `build.failed` | Build processing failed |
| `project.created` | New project created |
| `apikey.created` | New API key generated |
| `apikey.revoked` | API key revoked |

## Planned Payload Format

```json
{
  "id": "evt_abc123",
  "type": "build.created",
  "created": "2024-01-15T10:30:00.000Z",
  "data": {
    "object": {
      "id": "bld_xyz789",
      "projectId": "my-project",
      "versionId": "v1.0.0",
      "buildNumber": 42,
      "status": "active",
      "url": "https://view.scrymore.com/my-project/v1.0.0/"
    }
  }
}
```

## Planned Configuration

Configure webhooks via the Dashboard:

1. Go to **Settings → Webhooks**
2. Click **Add Endpoint**
3. Enter your URL
4. Select events to receive
5. Save

## Security (Planned)

Webhook requests will include a signature header:

```
X-Scry-Signature: sha256=...
```

Verify using your webhook secret:

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return `sha256=${expected}` === signature;
}
```

## Retry Policy (Planned)

Failed deliveries will be retried:

| Attempt | Delay |
|---------|-------|
| 1 | Immediate |
| 2 | 1 minute |
| 3 | 5 minutes |
| 4 | 30 minutes |
| 5 | 2 hours |

After 5 failures, the webhook will be disabled.

## Alternative: GitHub Actions

Until webhooks are implemented, use GitHub Actions for notifications:

```yaml
- name: Notify on deployment
  if: success()
  run: |
    curl -X POST \
      -H "Content-Type: application/json" \
      -d '{
        "type": "build.completed",
        "project": "${{ vars.SCRY_PROJECT_ID }}",
        "version": "${{ github.sha }}",
        "url": "${{ steps.deploy.outputs.url }}"
      }' \
      https://your-webhook-endpoint.com/scry
```

## Feature Request

If you need webhooks, please:

1. Open an issue on [GitHub](https://github.com/epinnock/scry-node/issues)
2. Describe your use case
3. Vote on existing feature requests

This helps prioritize development.
