# Search

The search API finds components in your indexed Storybook builds by text, by image, or both. The Scry dashboard, the [MCP server](/guide/mcp), Scry Link and the CLI call it for you, and it returns only what your account can already read. This page covers the request options and result fields that decide how many copies of a screen you get back. Every response carries an `x-scry-request-id` header: see [Request ids](/api/request-ids).

## One row per screen

Every time a build is indexed, each of its screens is indexed again, and older copies are kept. Searching across projects, or in a project that has not been re-indexed recently, could therefore return the same screen several times, once per deploy, even when nothing about it changed.

By default a search now returns **one row per screen: the newest indexed copy**. A screen is the same project, the same capture source (web, iOS or Android) and the same story. The row tells you how many copies it stands for, so you know the older ones exist. Copies indexed before screens had an id are matched by component and story name instead, and only when that name belongs to exactly one screen; otherwise they stay as separate rows.

A dedup never removes a screen. A screen with a single copy is returned as it is, and a screen that exists only in an older build is returned once, marked `stale`, as it was before. Two projects that happen to use the same story name both appear, and so do a web and an iOS capture of the same story.

## Request

`POST /api/search`

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `text` | string | — | Text to search for |
| `image` | string | — | Base64 image to search by. Send `text`, `image`, or both |
| `project_id` | string | — | Restrict the search to one project |
| `limit` | number | `10` | Rows per page |
| `page` | number | `1` | Page number |
| `tags` | string[] | — | Only screens that have every tag. See [Filter by tag](#filter-by-tag) |
| `versions` | `"latest"` \| `"all"` | `"latest"` | `latest` returns one row per screen. `all` returns every indexed copy, exactly the list the API returned before this option existed |

Any other value for `versions` is rejected with a `400`:

```json
{ "error": "Field versions must be \"latest\" or \"all\"", "code": "invalid_versions", "request_id": "01M3EQG44Y0J8F2K6ZP9RX1T7C" }
```

A request that does not send `versions` is not an error: it gets the default, `latest`.

## Filter by tag

Send `tags` to keep only screens that carry **all** of the tags listed (an AND, with exact matching):

```json
{ "text": "payment form", "tags": ["checkout", "needs-review"] }
```

Send 1 to 10 tags, each 1 to 64 characters. Invisible characters are stripped and surrounding spaces trimmed, and duplicates are removed. An empty list sends no filter. More than 10 tags, a value that is not a string, a tag that is empty or too long once cleaned, or a tag with a control character is rejected with a `400` and the code `invalid_tags`. `tags` narrows a search, so you still send `text`, `image` or both. Screens that have no tags never match and are not an error. How tags get onto screens is explained in [Tags and custom fields](/guide/tags-and-custom-fields).

A row that has tags returns them as a `tags` list; the field is left out when there are none.

## Response

```json
{
  "results": [
    {
      "component_name": "Login",
      "score": 0.98,
      "project_id": "…",
      "build_id": "…",
      "story_id": "auth-login--default",
      "indexed_at": "2026-09-20T10:00:00.000Z",
      "freshness": "fresh",
      "version_count": 3
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 9, "total_pages": 1, "has_next": false, "has_prev": false },
  "duplicates_collapsed": 11
}
```

Rows carry the same fields as before, plus one new one. The example above shows only some of them.

| Field | Where | Meaning |
| --- | --- | --- |
| `version_count` | each row | How many indexed copies of this screen the search found, including the one returned. `1` means the screen has only one copy. With `versions: "all"` it is the number of copies in the results |
| `duplicates_collapsed` | top level | How many older copies were folded into the rows returned. Always `0` with `versions: "all"` |

Both numbers are counted only from rows you are allowed to read. A project you cannot read never changes the count on a row you can see.

The kept row keeps its own `score` and its place in the order. The scores of the older copies are ignored. When several copies of a screen exist, the most recently indexed one is kept.

`pagination` describes the deduplicated list. When you search without a `project_id`, the total counts the best matches the search looked at, so treat it as a guide rather than an exact count of everything that exists.

## Getting every version

Send `"versions": "all"` when you want the history of a screen, for example to compare how it looked across deploys:

```bash
curl -X POST https://search.scrymore.com/api/search \
  -H "Content-Type: application/json" \
  -d '{ "text": "login screen", "versions": "all" }'
```

Without credentials the search covers public projects only.

Existing integrations do not need to change. They send no `versions`, read rows by field name, and now get fewer duplicate rows plus the two new fields. If you relied on seeing every copy, add `"versions": "all"` to get the previous list.
