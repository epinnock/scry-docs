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
| `GET /api/issues?pair=` | List issues for a pair |
| `POST /api/issues` | Create one. Needs a note or at least one box |
| `PATCH /api/issues/:id` | Update the note |
| `DELETE /api/issues/:id` | Delete |
| `POST /api/issues/:id/transition` | Move through the lifecycle |
| `PATCH /api/issues/:id/severity` | Change severity on a promoted issue |

Boxes are `{x, y, w, h}` normalised 0..1. On list responses `box_a`/`box_b` come back as JSON strings or null, and `labels` as an array — shapes kept compatible with the reference implementation.

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
