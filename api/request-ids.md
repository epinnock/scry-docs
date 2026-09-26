# Request ids and support references

Every request to the dashboard API, the diff service and the search API carries a request id. It's the same id on every service a request passes through, so one id is enough for us to find what happened to it. When something fails in the dashboard, the error shows that id as a **Ref**, so you can quote it to us.

## The `x-scry-request-id` header

| | Rule |
| --- | --- |
| Header | `x-scry-request-id`, on requests and responses (HTTP header names are case-insensitive) |
| Format | A [ULID](https://github.com/ulid/spec): 26 characters of Crockford base32, uppercase, e.g. `01M3EQG44Y0J8F2K6ZP9RX1T7C`. The first 10 characters encode when it was made, so ids sort by time |
| Accepted on requests | A ULID in uppercase, or a lowercase UUID v4 (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`) |
| Anything else | Ignored. The service makes a new ULID instead and never echoes or logs the value you sent |
| On responses | Always: successes, `4xx` and `5xx` errors, CORS preflights, and the dashboard proxy's own `502` and `504` |

You don't have to send one. If a request arrives without an id, the first Scry service it reaches makes one, and passes it on to every Scry service it calls. If you do send one, for example to join our id to your own logs, use a ULID or a UUID and read it back from the response.

For the Figma plugin's cross-origin calls, the dashboard lists the header in `Access-Control-Expose-Headers`, so the plugin can read it.

## `request_id` in error bodies

JSON error bodies repeat the id as `request_id`, so a client that only logs the body still has it.

| Service | Where `request_id` appears |
| --- | --- |
| Diff service | Every JSON error, e.g. `{"error": "Unauthorized", "request_id": "01M3EQG44Y0J8F2K6ZP9RX1T7C"}` |
| Search API | Every JSON error |
| MCP server | Every tool error, next to `error`, `message` and `retryable` (see [Failure modes](/services/mcp-server/tools#failure-modes)). Each tool call gets its own id |
| Dashboard | The `/api/diff` proxy's own `502` and `504` errors and the shared error responses. Other routes carry the id in the header only, so read the header first |

In dashboard bodies, `requestId` (camel case) is something else: the id of a [component request](/guide/component-requests). The request id is always `request_id` in a body, or the header.

## Support references

When a dashboard action fails, the red error message has a second line, **Ref:** and the request id, with a **Copy reference** button next to it. The button shows **Copied** for two seconds. Diff runs keep their reference too: the **Run** column in a link's run history has **Copy reference** in its copy menu (see [Developer Dashboard](/services/dashboard/#support-references)).

If you contact us about an error, send:

1. **The Ref**, copied with the button. Copying avoids misreading characters from a screenshot, though Crockford base32 has no I, L, O or U to confuse.
2. **The project** you were working in.
3. **What you were doing**, in a sentence: "running a diff on the checkout screen".

With the Ref we can see when the request happened, which services it reached and where it failed, without asking you for logs.

A Ref is safe to share, in an email or a public GitHub issue. It's random, not derived from you or your data, and it grants no access: looking up a Ref still needs membership of the project it belongs to.

There's no Ref when the request never reached us, for example when you're offline. Then tell us the time instead. The Figma plugin, the CLI and MCP results don't show a Ref yet.

Send it to <feedback@scrymore.com> or through the [feedback form](/feedback).
