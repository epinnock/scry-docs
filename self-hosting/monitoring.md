# Monitoring

Set up observability for your self-hosted Scry instance.

## Overview

Monitor these components:

| Component | Monitoring |
|-----------|------------|
| Upload Service | Cloudflare Analytics, Worker Logs |
| CDN Service | Cloudflare Analytics, Worker Logs |
| Dashboard | Vercel Analytics, Error tracking |
| Firebase | Firebase Console, Cloud Monitoring |
| R2 Storage | Cloudflare Dashboard |

## Cloudflare Workers

### Analytics Dashboard

1. Go to Cloudflare Dashboard → Workers
2. Select your worker
3. View **Analytics** tab

Key metrics:
- **Requests:** Total and requests/second
- **Errors:** Error rate and types
- **CPU Time:** Execution duration
- **Data Transfer:** Bytes in/out

### Real-time Logs

Use `wrangler tail` for live logs:

```bash
# Upload Service
wrangler tail scry-upload-service

# CDN Service
wrangler tail scry-cdn-service

# Filter by status
wrangler tail scry-upload-service --format=json | jq 'select(.outcome == "exception")'
```

### Custom Logging

Add structured logging to your workers:

```typescript
console.log(JSON.stringify({
  level: 'info',
  message: 'Upload completed',
  projectId: project,
  version: version,
  size: bytes,
  duration: ms
}));
```

## Firebase Monitoring

### Firestore Usage

1. Go to Firebase Console → Usage and billing
2. View **Firestore** usage:
   - Reads/writes per day
   - Storage used
   - Network egress

### Authentication Metrics

1. Go to Authentication → Usage
2. View:
   - Daily active users
   - Sign-in methods
   - Authentication failures

### Cloud Monitoring (Advanced)

Enable Google Cloud Monitoring:

1. Go to Google Cloud Console
2. Navigate to Monitoring
3. Create dashboard for Firebase metrics

Key metrics:
- `firestore.googleapis.com/document/read_count`
- `firestore.googleapis.com/document/write_count`
- `identitytoolkit.googleapis.com/request_count`

## Vercel Dashboard

### Built-in Analytics

Enable in Project Settings → Analytics:

- **Page views:** Traffic patterns
- **Web Vitals:** Performance metrics
- **Functions:** Serverless function usage

### Deployment Monitoring

View in Deployments tab:
- Build duration
- Build size
- Deployment status

### Error Tracking

Integrate with error tracking services:

```typescript
// lib/error-tracking.ts
export function captureError(error: Error, context?: object) {
  console.error('Application error:', error, context);

  // Send to external service (Sentry, etc.)
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  }
}
```

## Alerting

### Cloudflare Alerts

1. Go to Cloudflare Dashboard → Notifications
2. Create alerts for:
   - Worker error rate > 1%
   - Worker requests spike
   - R2 storage usage

### Firebase Alerts

1. Go to Firebase Console → Settings → Integrations
2. Configure budget alerts
3. Set up Cloud Monitoring alerts

### Uptime Monitoring

Use external monitoring services:

```bash
# Health check endpoints
# Upload Service
https://your-upload-service.workers.dev/health

# CDN Service
https://view-test.yourdomain.com/health

# Dashboard
https://dashboard.yourdomain.com/api/health
```

Recommended services:
- UptimeRobot (free tier available)
- Better Uptime
- Pingdom

## Custom Health Checks

### Upload Service Health

```typescript
// Already included
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});
```

### CDN Service Health

```typescript
// Already included
app.get('/health', (c) => {
  return c.json({
    status: 'healthy',
    service: 'scry-cdn-service',
    platform: 'cloudflare',
    timestamp: new Date().toISOString()
  });
});
```

### Dashboard Health

Create `app/api/health/route.ts`:

```typescript
export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    checks: {
      firebase: await checkFirebase(),
    }
  };

  return Response.json(health);
}

async function checkFirebase() {
  try {
    // Quick Firestore ping
    const db = getFirestore();
    await db.collection('_health').doc('ping').get();
    return 'ok';
  } catch {
    return 'error';
  }
}
```

## Logging Best Practices

### Structured Logs

Use JSON format for searchability:

```typescript
function log(level: string, message: string, data?: object) {
  console.log(JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...data
  }));
}

// Usage
log('info', 'Upload started', { projectId, version, size });
log('error', 'Upload failed', { projectId, error: err.message });
```

### Log Levels

| Level | Use Case |
|-------|----------|
| `debug` | Detailed debugging info |
| `info` | Normal operations |
| `warn` | Unexpected but handled |
| `error` | Failures requiring attention |

### Sensitive Data

Never log:
- API keys
- Passwords
- Personal information
- Full request bodies

## Metrics Dashboard

### Grafana (Self-hosted)

For advanced monitoring, set up Grafana:

```yaml
# docker-compose.yml
services:
  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    volumes:
      - grafana-data:/var/lib/grafana

  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

volumes:
  grafana-data:
```

### Key Metrics to Track

| Metric | Description | Alert Threshold |
|--------|-------------|-----------------|
| Request rate | Requests per second | Sudden spike |
| Error rate | % of 4xx/5xx | > 1% |
| Latency p99 | 99th percentile response time | > 1s |
| Storage used | R2 bucket size | > 80% quota |
| API key usage | Requests per key | Unusual patterns |

## Incident Response

### Runbook Template

```markdown
## Incident: [Description]

### Detection
- How was the issue detected?
- What alerts fired?

### Impact
- Which services affected?
- Number of users impacted?

### Timeline
- [Time] Issue detected
- [Time] Investigation started
- [Time] Root cause identified
- [Time] Fix deployed
- [Time] Issue resolved

### Root Cause
[Description of what caused the issue]

### Resolution
[Steps taken to resolve]

### Prevention
[Steps to prevent recurrence]
```

### Common Issues

**High error rate:**
1. Check Worker logs
2. Verify R2 connectivity
3. Check Firebase status
4. Review recent deployments

**Slow responses:**
1. Check Worker CPU time
2. Review KV cache hit rate
3. Check R2 latency
4. Analyze request patterns

**Authentication failures:**
1. Check Firebase Auth status
2. Verify API key validity
3. Review Firestore rules
4. Check rate limits

## Next Steps

- [Complete Setup](/self-hosting/complete-setup) - Full deployment guide
- [Architecture](/services/overview) - System architecture
- [Troubleshooting](/guide/troubleshooting) - Common issues
