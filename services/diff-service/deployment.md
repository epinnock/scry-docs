# Deployment

A Cloudflare Worker with a D1 database and an R2 binding.

## Bindings

| Binding | Kind | Resource |
| --- | --- | --- |
| `DB` | D1 | `scry-diff-db` — pairs, issues, events, connections, screens |
| `SCREENSHOT_BUCKET` | R2 | `scry-component-snapshot-bucket` — screenshots, evidence, run artifacts |

The bucket is shared with build processing and the dashboard. This service reads screenshots it did not write, which is the point: pairs reference existing objects rather than copying them.

## Secrets

| Secret | Purpose |
| --- | --- |
| `SERVICE_AUTH_TOKEN` | Bearer token for every route except `/healthz`. Held only by the dashboard |
| `OPENROUTER_API_KEY` | The configured production annotator |
| `ANTHROPIC_API_KEY` | Supported when `ANNOTATOR_PROVIDER=anthropic` |
| `FIGMA_CLIENT_ID` / `FIGMA_CLIENT_SECRET` | Figma OAuth app |
| `FIGMA_OAUTH_REDIRECT_URI` | Must match the app's registered callback |
| `FIGMA_TOKEN_ENCRYPTION_KEY` | Encrypts stored Figma tokens at rest in D1 |

`FIGMA_TOKEN_ENCRYPTION_KEY` is load-bearing: stored connections cannot be decrypted without it, so rotating it invalidates every existing connection and each project has to reconnect.

## Variables

| Variable | Production default |
| --- | --- |
| `ANNOTATOR_PROVIDER` | `openrouter` |
| `ANNOTATOR_MODEL` | `openai/gpt-5.6-sol` |
| `ANNOTATOR_REASONING_EFFORT` | `medium` |
| `ANNOTATOR_MAX_TOKENS` | `16000` |
| `FIGMA_APP_KIND` | Which kind of Figma app the connection uses |
| `ANNOTATOR_BASE_URL` | Override the provider endpoint |
| `DIFF_TIERS_ENABLED` | `1`: Basic/Plus tier pipeline. `0` runs the pre-tier pipeline |
| `PREFILTER_IMPL` | `ts` (in-process pre-filter); `python` uses the separate pre-filter Worker |
| `PLUS_BUSY_THRESHOLD` | `49`: pre-filter candidates at which Plus adds the Opus check |
| `CREDITS_MODE` | `shadow`: credits are counted, not enforced. `enforce` refuses runs without credits, `off` skips the ledger |

Deploy stamps — `SCRY_ENV`, `SCRY_COMMIT`, `SCRY_BRANCH`, `SCRY_BUILD_TIME`, `SCRY_DEPLOY_ID`, `SCRY_ACTOR` — are injected at build time and reported by `/healthz`.

## Migrations

Schema lives in `migrations/`, applied in order:

| Migration | Adds |
| --- | --- |
| `0001_init` | Pairs, issues, review state |
| `0002_issue_lifecycle` | Status transitions and events |
| `0003_diff_evidence` | Hybrid evidence keys on a pair |
| `0004_figma_oauth` | Encrypted Figma connections |
| `0005_figma_ingest` | Design snapshots and imported screens |
| `0006_candidates_severity` | Candidate status, severity, confidence |

Staging has its own database (`scry-diff-db-staging`) and its own bucket (`scry-component-snapshot-bucket-staging`), so review data never crosses tiers.

## Local development

```bash
npm install
echo 'SERVICE_AUTH_TOKEN = "local-dev-token"' > .dev.vars
npm run db:migrate:local
npm run dev          # http://localhost:8789
npm test             # vitest + @cloudflare/vitest-pool-workers
```

Tests run against real D1 and R2 through miniflare rather than mocks, so migrations and bucket behaviour are exercised as written.

## Verifying a deploy

```bash
curl -s -o /dev/null -w '%{http_code}\n' https://diff.scrymore.com/healthz   # 200
curl -s -o /dev/null -w '%{http_code}\n' https://diff.scrymore.com/api/queue # 401
```

`401` on an authenticated route is the healthy answer without a token — a `200` there would mean the service is answering unauthenticated callers.
