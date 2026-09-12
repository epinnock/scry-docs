# MCP Server

The Scry MCP server puts your indexed components in front of an AI assistant. Ask Claude, Cursor or any [MCP](https://modelcontextprotocol.io/) client for "the date picker we already have" and it searches your Storybook builds — by text, or by an image of a design — and answers with the component, the file to import, and a screenshot.

It is a remote server: nothing to install, and it sees only the projects your account can already read.

## Connect it

The server lives at `https://mcp.scrymore.com/mcp`.

### Claude Code

```bash
claude mcp add --transport http scry https://mcp.scrymore.com/mcp
```

### Claude Desktop, Cursor, and other clients

Clients that speak stdio reach a remote server through [`mcp-remote`](https://www.npmjs.com/package/mcp-remote). Add this to the client's MCP config — for Claude Desktop that is `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS:

```json
{
  "mcpServers": {
    "scry": {
      "command": "npx",
      "args": ["mcp-remote", "https://mcp.scrymore.com/mcp"]
    }
  }
}
```

Restart the client. On the first tool call a browser window opens for sign-in; approve it and the tools appear. The server issues its own token to the client, so your Scry session is never handed to the assistant.

Run `whoami` to confirm which account you are connected as.

## Scope: the thing to get right

Search is only as useful as its scope, and the default is broad.

**Pass `project_id` whenever you know it.** Results are then that project's components only. The id is usually in the repository already — `.scry/config.json`, `.storybook-deployer.json`, or `SCRY_PROJECT_ID` in `.env` or CI config — so an assistant can normally find it without asking you.

**Without `project_id`, the search spans every project your account can read.** That includes unrelated codebases, and a component from another repo is not safe to import. Omit it deliberately, not by accident.

With a `project_id` you can also choose how far to look:

| `scope` | Searches |
| --- | --- |
| `project` (default) | That project only. Never widens — an empty result means this project has no match |
| `org` | Also other projects in the same organisation, where the owner opted in to discovery and you can read them |

`org` results are flagged `crossProject: true`. They answer "does this already exist anywhere in our design system?" — but they may not be importable from the repository you are in.

## Tools

| Tool | Use it for |
| --- | --- |
| `search_components` | Find components by text. Hybrid semantic + keyword search |
| `search_by_image` | Find components that look like an image — a screenshot, a mockup, a Figma export |
| `get_component_screenshot` | Fetch a result's screenshot as an image the assistant can actually look at |
| `generate_image` | Generate a reference image from a prompt, optionally guided by reference images |
| `whoami` | Which account is connected |

`search_by_image` takes base64 (up to 10MB, data-URI prefix optional) and accepts an optional text query alongside it for a hybrid match. Both searches return at most 50 results per page.

## Reading a result

A result carries more than a name and a score:

```json
{
  "name": "StorybookConnection",
  "score": 19.46,
  "description": "This is an onboarding/connect panel for linking a Storybook instance…",
  "sourcePath": "src/features/settings/StorybookConnection.tsx",
  "storyPath": "src/features/settings/StorybookConnection.stories.tsx",
  "storyTitle": "Features/Settings/StorybookConnection",
  "variant": "Disconnected",
  "projectId": "…", "crossProject": false,
  "buildId": "…", "buildSha": "ea816a7…", "storyId": "features-settings-storybookconnection--disconnected",
  "indexedAt": "2026-09-11T21:52:19.231Z",
  "latestBuildId": "…", "freshness": "fresh", "freshnessReason": "matches_current_build",
  "screenshotUrl": "https://…"
}
```

Three fields matter more than they look:

- **`sourcePath` is what you import.** `storyPath` is the `.stories` file the screenshot was captured from — importing that is a common mistake.
- **`freshness`** says whether the row came from the project's current build. `fresh` means it matches `latestBuildId`; anything else means the index is behind the code, and `freshnessReason` says why. A row indexed before build tracking shipped reports `unknown` until its project is re-indexed.
- **`screenshotUrl` is presigned and expires in an hour.** Use `get_component_screenshot` rather than storing the URL.

## Troubleshooting

**The client shows no tools, or every call fails with 401.** The sign-in did not complete. Trigger any tool to reopen the browser flow, and check you approved it for the account that can see the project.

**`RATE_LIMITED`.** The server allows 60 requests per minute per user. Wait and retry.

**`PROJECT_REQUIRED` or `PROJECT_HAS_NO_ORG`.** `scope: "org"` needs a `project_id`, and the project must belong to an organisation. Use `scope: "project"`.

**Results look out of date.** Check `freshness` on the rows. Hosting a build and indexing it complete separately, so a Storybook can be live while the index still describes the previous build.

**An empty result with `scope: "project"`** means that project genuinely has no match. It never silently falls back to a wider search, so an empty answer is information.

## Privacy and data

The server searches only what your account can already read, and enforces the same project visibility and membership rules as the dashboard. Your Firebase session stays on the server — the MCP client receives a separate token scoped to MCP, and screenshots are handed out as short-lived presigned URLs rather than public links.

## Feedback

Something not working, or a tool you wish existed? Tell us on the [feedback form](/feedback) or email <feedback@scrymore.com>.

For how the server is built and deployed, see the [MCP Server service docs](/services/mcp-server/).
