# Diff Service API Reference

## Base URL

- **Production:** `https://diff.scrymore.com`
- **Stage:** `https://diff-stage.scrymore.com`

## Authentication

Every route except `GET /healthz` requires:

```http
Authorization: Bearer <SERVICE_AUTH_TOKEN>
```

Only the dashboard server holds this token. Browser traffic goes through the dashboard's `/api/diff` proxy, which is where per-user authorization happens.

## Request ids

Every response, `GET /healthz` and `401`s included, carries an `x-scry-request-id` header. The service keeps the id the dashboard forwards (a ULID or a lowercase UUID v4) and makes a new ULID for anything else. Every JSON error body repeats it as `request_id`:

```json
{ "error": "Unauthorized", "request_id": "01M3EQG44Y0J8F2K6ZP9RX1T7C" }
```

The id is stored on the diff run it starts, as the run's `request_id` (see [Runs](#runs)). Format, accepted values and what to send support: [Request ids and support references](/api/request-ids).

## Pairs

| Route | Purpose |
| --- | --- |
| `GET /healthz` | Liveness. The only open route |
| `POST /api/pairs` | Register or replace a pair. Idempotent — re-posting reopens the review and preserves issues |
| `GET /api/pairs/:pairId` | The pair, plus `has_issues_count`, `candidate_count` and review `state` |
| `GET /image/:pairId/:slot` | Stream slot `a` (Figma reference) or `b` (Storybook build) |

A pair registration carries R2 keys, never image bytes:

```json
{
  "pair_id": "…", "project_id": "…", "link_id": "…", "name": "…",
  "image_a_key": "…", "image_b_key": "…",
  "figma_structure_key": "…", "dom_structure_key": "…", "source_key": "…",
  "icon_candidates_key": "…", "icon_contact_sheet_key": "…"
}
```

The evidence keys are optional and unlock better analysis — see [Review Model](/services/diff-service/review-model#hybrid-evidence).

## Issues

| Route | Purpose |
| --- | --- |
| `GET /api/issues?pair=` | List issues for a pair, each with its `evidence` (object or null) |
| `POST /api/issues` | Create one. Needs a note or at least one box |
| `PATCH /api/issues/:id` | Update the note |
| `DELETE /api/issues/:id` | Delete |
| `POST /api/issues/:id/transition` | Move through the lifecycle |
| `PATCH /api/issues/:id/severity` | Change severity on a promoted issue |

Boxes are `{x, y, w, h}` normalised 0..1. On list responses `box_a`/`box_b` come back as JSON strings or null, and `labels` as an array — shapes kept compatible with the reference implementation.

Each issue row also carries `evidence`: an object, or `null` for issues people add and for rows created before the field existed (treat a missing field as `null`). It holds what the pre-filter measured for an AI finding, and the dashboard's [Evidence strip](/services/diff-service/review-model#inspect-a-finding-pixel-by-pixel) uses it for the measured delta. Unlike `box_a`/`box_b`, it comes back parsed, not as a JSON string. It's unrelated to the pair's [hybrid evidence](/services/diff-service/review-model#hybrid-evidence) keys.

```ts
interface IssueEvidence {
  kind: string;              // pre-filter finding kind, e.g. row_gap, text_style, h_shift,
                             // global_offset, missing_divider, line_missing, line_extra
  measure?: {                // only when both sides were measured on one axis
    axis: 'x' | 'y' | 'w' | 'h';  // x/y = position, w/h = size
    a: number;               // Figma side, px of image A
    b: number;               // Storybook side, px of image B
    delta: number;           // b - a, px, sign kept
    unit: 'px';
  };
  [extra: string]: unknown;  // anything else the pre-filter recorded, passed through
}
```

`measure` is left out when the pre-filter recorded only a delta, so no values are invented. Nothing is backfilled for older rows.

`transition` takes `{action, who, ...}` where action is `promote | dismiss | restore | fix | verify | reopen`. `promote` requires a `severity`; `dismiss` requires a `reason`.

## Agent

| Route | Purpose |
| --- | --- |
| `POST /api/agent/annotate` | Run the structural pass over a pair; findings land as candidates |
| `POST /api/agent/refine` | Rewrite a rough reviewer note into developer-facing feedback |
| `GET /api/pairs/:pairId/prediction` | Export the current AI result in the reference prediction format |
| `GET /api/pairs/:pairId/runs/:runId/:artifact` | Read a run artifact |

`artifact` is one of `prediction`, `main-pass`, `icon-pass`, `raw-pass-findings`, `hybrid-report`.

`annotate` returns `{format, run_id, prediction, created, detected, refreshed, superseded, candidates, count, passes, artifacts}` — the counts describe reconciliation against existing candidates, not just what was found.

## Runs

Every AI run is recorded, with the request id that started it.

| Route | Purpose |
| --- | --- |
| `GET /api/projects/:projectId/runs?from=&to=&request_id=` | A project's runs in a time window, newest first |
| `GET /api/pairs/:pairId/runs` | A pair's runs |
| `GET /api/agent/runs/:runId` | One run |

All three return run objects with a `request_id` field. It's `null` for runs started before request ids existed; nothing is backfilled.

The project route takes:

| Param | Default | Notes |
| --- | --- | --- |
| `from` | 24 hours ago | ISO 8601 time, e.g. `2026-09-26T14:00:00Z`. Compared with the run's `started_at` |
| `to` | Now | ISO 8601 time |
| `request_id` | None | Only the runs started by this request |

It returns at most 200 runs. A malformed parameter is a `400`. To go further back, set `to` to the `started_at` of the oldest run you have.

```json
{
  "runs": [
    {
      "run_id": "6fc0a1a8-f408-4725-b426-617a35de8d44",
      "request_id": "01M3EQG44Y0J8F2K6ZP9RX1T7C",
      "pair_id": "…",
      "status": "complete",
      "tier": "plus",
      "started_at": "2026-09-26T14:32:07.120Z",
      "latency_ms": 41250,
      "cost_usd": 0.083
    }
  ],
  "count": 1
}
```

| Field | Values |
| --- | --- |
| `status` | `queued`, `running`, `complete`, `degraded` or `errored` |
| `tier` | The tier the run used: `basic`, `plus`, `legacy` or `n/a` |
| `latency_ms` | `null` until the run finishes |
| `cost_usd` | Model spend for the run, in US dollars |

`count` is the number of runs in `runs`. The `request_id` filter never widens access: the query always stays inside `:projectId`.

From a browser or a personal access token, call it through the dashboard proxy as `GET /api/diff/api/projects/:projectId/runs`, with the same parameters. The proxy checks that you're a member of the project, as it does for every project route.

## Bulk

| Route | Purpose |
| --- | --- |
| `POST /api/pairs/:pairId/candidates/dismiss-bulk` | `{ids? \| max_confidence? \| label?, reason, who}` |

This is the **only** bulk path. There is deliberately no bulk promote: promotion assigns severity and is a per-issue human decision.

## Review queue

| Route | Purpose |
| --- | --- |
| `POST /api/claim` | Acquire or refresh the lock on a pair. `force` overrides |
| `POST /api/release` | Release the lock. No-op if not the holder |
| `POST /api/done` | Set or unset done. Marking done clears the lock |
| `POST /api/done_next` | Mark done and return the next claimable pair |
| `GET /api/next?who=&after=&project=` | Next claimable pair after `after`, wrapping |
| `GET /api/queue?project=` | `{total, done, in_progress, open}` |
| `GET /api/state?project=` | Every pair's state for a project |

Locks go stale after **180 seconds**, after which anyone may claim them — a reviewer who closes their laptop mid-review does not block the queue. Traversal skips pairs that are done or live-locked by someone else.

## Figma

| Route | Purpose |
| --- | --- |
| `GET /api/figma/oauth/start` | Begin the OAuth connection |
| `GET/POST/DELETE /api/projects/:projectId/figma-connections` | Manage connections |
| `POST /api/projects/:projectId/figma-connections/:id/test` | Verify a connection still works |
| `GET /api/projects/:projectId/figma/files/:fileKey/meta` | File metadata |
| `POST /api/projects/:projectId/figma/resolve-file` | Resolve a Figma URL to a file |
| `GET/POST /api/projects/:projectId/figma-sources` | Tracked source files |
| `POST /api/projects/:projectId/design-snapshots` | Start a snapshot import |
| `POST /api/projects/:projectId/design-snapshots/:id/ingest-file` | Ingest a file into it |
| `POST /api/projects/:projectId/design-snapshots/:id/complete` | Finish the snapshot |
| `GET /api/projects/:projectId/design-screens` | Imported screens |
| `GET /api/projects/:projectId/design-screens/:screenId/image` | Stream a screen image |
| `GET/PUT /api/projects/:projectId/dev-resources` | Figma Dev Mode resources |

A connection is unique per `(project_id, figma_user_id)`, and its token is encrypted with `FIGMA_TOKEN_ENCRYPTION_KEY`.
