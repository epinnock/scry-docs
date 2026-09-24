# Tools

The server registers five tools. All of them run as the authenticated user, and every search is filtered to the projects that user can read.

## `search_components`

Text search over the component index, combining semantic (dense vector) and keyword (BM25 sparse) matching.

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `query` | string | — | Required. 1–500 characters |
| `project_id` | string | — | Restrict to one project. Max 128 characters |
| `scope` | `project` \| `org` | `project` | `org` requires `project_id` |
| `limit` | number | `10` | 1–50 |
| `page` | number | `1` | Pagination |

**Scope is the important parameter.** With `project_id` and the default `scope: "project"`, the search never widens: an empty result means that project has no match, not that it fell back elsewhere. With `scope: "org"` it also returns components from other projects in the same organisation — but only those whose owners opted in to discovery and that the account can read; each is flagged `crossProject: true`.

Omitting `project_id` searches **every** project the account can read, which spans unrelated codebases. Results from those are not safe to import.

## `search_by_image`

The same search, anchored on an image — a screenshot, a mockup, a Figma export.

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `image` | string | — | Required. Base64 PNG/JPG, max 10MB. Data-URI prefix optional |
| `query` | string | — | Optional text to combine with the image for a hybrid match |
| `project_id` | string | — | As above |
| `limit` | number | `10` | 1–50 |
| `page` | number | `1` | Pagination |

## `get_component_screenshot`

Fetches a result's screenshot and returns it as an image block, so the assistant can actually look at the component rather than at a URL.

| Parameter | Type | Notes |
| --- | --- | --- |
| `screenshot_url` | string | Required. The `screenshotUrl` from a search result |
| `component_name` | string | Optional, for labelling the response |

Screenshot URLs are presigned and expire after an hour, so fetch through this tool rather than storing the URL.

## `generate_image`

Generates a reference image from a prompt, optionally guided by reference images for style transfer.

| Parameter | Type | Notes |
| --- | --- | --- |
| `prompt` | string | Required. Description of the image |
| `aspect_ratio` | enum | Optional, default `1:1`. One of `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9` |
| `quality` | `fast` \| `quality` | Optional. `fast` (Gemini 3.1 Flash) or `quality` (Gemini 3 Pro) |
| `reference_images` | string[] | Optional. Base64 images for img2img |
| `reference_image` | string | Deprecated — use `reference_images` |

Each image uses [credits](/guide/credits): 40 for `fast`, 150 for `quality` (see [who pays](/guide/credits#who-pays)). If the wallet can't cover the price, the tool returns `INSUFFICIENT_CREDITS` (with the balance and a link to the Credits page) and no image is generated.

## `whoami`

No parameters. Returns the authenticated user's uid, email and display name — the quickest way to confirm which account a client is connected as.

## Result shape

Both searches return `results`, plus a `summary`, the `scope` used, and `widenedToOrg`.

```json
{
  "name": "StorybookConnection",
  "score": 19.457698822021484,
  "description": "This is an onboarding/connect panel for linking a Storybook instance…",
  "searchableText": "…the text the row was indexed on…",
  "tags": ["Connect Storybook Panel", "React", "Onboarding", "Form"],
  "sourcePath": "src/features/settings/StorybookConnection.tsx",
  "storyPath": "src/features/settings/StorybookConnection.stories.tsx",
  "storyTitle": "Features/Settings/StorybookConnection",
  "variant": "Disconnected",
  "projectId": "BlJfujLJOl8AJ8Vkkjou",
  "crossProject": false,
  "buildId": "mz2P7qU3uZpHoJHGSSbR",
  "buildSha": "ea816a7ae69b5d31f5268aaea9b365fef71bf9e2",
  "storyId": "features-settings-storybookconnection--disconnected",
  "indexedAt": "2026-09-11T21:52:19.231Z",
  "latestBuildId": "mz2P7qU3uZpHoJHGSSbR",
  "freshness": "fresh",
  "freshnessReason": "matches_current_build",
  "screenshotUrl": "https://…presigned…"
}
```

| Field | Why it matters |
| --- | --- |
| `sourcePath` | The component to import. `storyPath` is the `.stories` file it was captured from — importing that instead is a common mistake |
| `crossProject` | `true` means the row came from another project via `scope: "org"`, and may not be importable here |
| `freshness` | `fresh` when `buildId` equals `latestBuildId`. Otherwise the index is behind the code, and `freshnessReason` says why |
| `buildSha` | The commit the build came from, when the deployer reported one |
| `indexedAt` | When the row was written, not when the build was deployed |

Rows indexed before build tracking shipped report `freshness: "unknown"` until their project is re-indexed.

## Failure modes

Tools return a typed error rather than an empty result, so a client can branch on it.

| Code | Meaning |
| --- | --- |
| `RATE_LIMITED` | Over 60 requests per minute for this user. Wait and retry |
| `SEARCH_API_5xx` | Upstream search error. Retry once |
| `VALIDATION_ERROR` | Input failed schema validation. Fix parameters |
| `INVALID_SCOPE` | `scope` was not `project` or `org` |
| `PROJECT_REQUIRED` | `scope: "org"` without a `project_id` |
| `PROJECT_HAS_NO_ORG` | `scope: "org"` on a project with no organisation |

Input limits are enforced by Zod schemas: 500-character queries, 10MB images, 128-character project ids, and a 30-second timeout on upstream calls.
