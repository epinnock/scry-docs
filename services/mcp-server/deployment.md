# Deployment

The MCP server is a Cloudflare Worker with a Durable Object and a KV namespace. It holds no component data itself — it calls the search API — so deploying it is mostly a matter of bindings and secrets.

## Configuration

| Variable | Purpose |
| --- | --- |
| `FIREBASE_API_KEY` | Firebase web config, for the login UI |
| `FIREBASE_AUTH_DOMAIN` | Firebase web config |
| `FIREBASE_PROJECT_ID` | Firebase project, also used to verify ID tokens |
| `SCRY_SEARCH_API_URL` | Base URL of the search service |
| `SCRY_SEARCH_API_KEY` | That service's shared key |
| `COOKIE_ENCRYPTION_KEY` | Encrypts the stored upstream credential |
| `GEMINI_API_KEY` | Image generation for `generate_image` |

`SCRY_ENV` is a plain var (`production` or `staging`). Deploy stamps — `SCRY_COMMIT`, `SCRY_BRANCH`, `SCRY_BUILD_TIME`, `SCRY_DEPLOY_ID`, `SCRY_ACTOR` — are injected at build time so a running Worker can report what it is.

Locally these go in `.dev.vars`; in Cloudflare they are secrets.

```bash
cp .dev.vars.example .dev.vars
```

## Bindings

| Binding | Type | Role |
| --- | --- | --- |
| `OAUTH_KV` | KV namespace | OAuth state and the encrypted upstream credential |
| `MCP_OBJECT` | Durable Object (`ScryMCP`) | Tool execution and per-user rate limiting |
| `ASSETS` | Assets | Built widget bundle from `web/dist/widgets` |

The Durable Object is declared as a SQLite class in the `v1` migration. Compatibility flags are `nodejs_compat` and `global_fetch_strictly_public`.

## Commands

```bash
npm run dev                # local worker on :8787
npm run typecheck
npm run test               # unit
npm run test:e2e
npm run deploy:staging     # scry-mcp-staging
npm run deploy:production
```

Staging is a separate Worker with its own KV namespace, so its OAuth state never mixes with production.

## Firebase setup

1. Enable **Authentication → Sign-in method** for Google and/or Email/Password.
2. Add the Worker's hostname under **Authentication → Settings → Authorized domains**. Without this the login window fails at the last step.
3. Copy `apiKey`, `authDomain` and `projectId` from the web app config into the Worker's secrets.

## Verifying a deploy

The OAuth metadata document is public, so it is the cheapest liveness check:

```bash
curl -s -o /dev/null -w '%{http_code}\n' \
  https://mcp.scrymore.com/.well-known/oauth-authorization-server   # 200

curl -s -o /dev/null -w '%{http_code}\n' \
  https://mcp.scrymore.com/mcp                                       # 401
```

`401` on `/mcp` is the healthy answer for an unauthenticated request — a `200` there would mean the endpoint is not protected. Connect a client and call `whoami` to confirm the full path, including Firebase and the search API, is working end to end.

## Local development

`npm run dev` serves on `http://localhost:8787`. Point a client at `http://localhost:8787/mcp` through `mcp-remote`, or use the MCP Inspector. The KV namespace has a `preview_id` so local runs do not touch production OAuth state.
