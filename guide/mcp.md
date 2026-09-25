# MCP Server

The Scry MCP server puts your indexed components in front of an AI assistant. Ask Claude, Codex, Cursor, the Figma agent or any [MCP](https://modelcontextprotocol.io/) client for "the date picker we already have" and it searches your Storybook builds — by text, or by an image of a design — and answers with the component, the file to import, and a screenshot.

It is a remote server: nothing to install, and it sees only the projects your account can already read.

## Connect it

To have your coding assistant configure the connection, install the
[Scry setup skill](/guide/skill) and ask **“Connect Scry MCP only.”** The skill
reuses your project settings and checks an authenticated, project-filtered
search. Follow the manual steps below if you prefer to configure it directly.

The server lives at `https://mcp.scrymore.com/mcp`.

### Claude Code

```bash
claude mcp add --transport http scry https://mcp.scrymore.com/mcp
```

### Codex

The Codex CLI, the Codex IDE extension and the ChatGPT desktop app share one config file, `~/.codex/config.toml`. Add Scry in any of them and the other two see it too.

**From the terminal:**

```bash
codex mcp add scry --url https://mcp.scrymore.com/mcp
```

Codex detects that Scry uses OAuth and starts sign-in straight away: it prints a URL, and opens it if it can. Sign in with the Scry account that can see your project. The terminal then prints `Successfully logged in.`

If sign-in was interrupted, or you need to switch accounts later, run:

```bash
codex mcp login scry
```

**From the IDE extension or the desktop app:**

1. Open the gear menu in the IDE extension, or **Settings** in the app.
2. Select **MCP servers**, then **Add server**.
3. Name it `scry`, choose **Streamable HTTP**, and paste `https://mcp.scrymore.com/mcp`.
4. Select **Authenticate** and sign in.

Either route leaves this in `~/.codex/config.toml`:

```toml
[mcp_servers.scry]
url = "https://mcp.scrymore.com/mcp"
```

Check the connection with `codex mcp list`: `scry` should show `enabled` with `OAuth` in the Auth column. Inside a session, `/mcp` lists the server and its tools.

**Tool approval.** By default Codex asks before every MCP tool call. The search tools only read, so you can let them run without prompting. The [issue tools](/guide/mcp-issues) can claim and mark issues fixed, so decide whether you want those to ask first:

```toml
[mcp_servers.scry]
url = "https://mcp.scrymore.com/mcp"
default_tools_approval_mode = "approve"
```

You need this setting for `codex exec` and other non-interactive runs. They cannot show a prompt, so a Scry call fails with `MCP tool call requires approval, but approval policy is never`.

Try it:

> Use the scry MCP server: run whoami, then search_components for "primary button" in this repository's Scry project.

### Figma agent and Figma Make

Add Scry as a custom connector and the Figma agent or Figma Make can look up components your team has already built while you design.

**Before you start:**
- Custom connectors need a paid Figma plan and edit access to the file.
- On Organization and Enterprise plans, an admin can turn custom connectors off.
- By default, only admins can create custom connectors.

1. In a Figma agent or Figma Make chat, click **Add context**, hover **Connectors**, and select **Manage**.
2. Open the **Created by you** tab and click **Create**.
3. Enter **Scry** as the name. Icon, tagline and description are optional.
4. Paste `https://mcp.scrymore.com/mcp` as the MCP server URL and click **Create**.
5. Leave **Advanced settings** empty. Scry registers Figma as an OAuth client automatically, so there is no client ID, secret or API key to enter.
6. Click **Connect** on the Scry connector and sign in with your Scry account.
7. Review the tools and switch on the ones you want. Figma turns write tools off by default. The search tools may appear in that group even though they only read, so turn on `search_components`, `search_by_image`, `get_component_screenshot` and `whoami`. The issue tools (`claim_design_issue`, `mark_design_issue_fixed`, `request_verify`, `comment_design_issue`) do write, so leave them on **Ask to run** unless you want the agent to act on its own.

For each tool, choose **Ask to run**, **Always run** or **Never run**. The connector is visible only to you unless an admin publishes it to the organisation.

**Give the agent your project id.** A coding assistant can read `project_id` from your repository, but the Figma agent has no repository to read. Without an id it searches every project your account can read (see [Scope](#scope-the-thing-to-get-right) below). Copy the id from your project's dashboard URL, `dashboard.scrymore.com/projects/<id>`, and put it in the prompt:

> Search Scry project `<id>` for the card component we already have, and show me its screenshot.

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
| `list_design_issues`, `get_design_issue`, `claim_design_issue`, `mark_design_issue_fixed`, `request_verify`, `comment_design_issue` | Pick up promoted Figma↔Storybook drift issues and fix them in code or in Figma. See [Agents: resolving issues over MCP](/guide/mcp-issues) |

`search_by_image` takes base64 (up to 10MB, data-URI prefix optional) and accepts an optional text query alongside it for a hybrid match. Both searches return at most 50 results per page.

`generate_image` takes an optional `aspect_ratio` (`1:1` by default; also `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`) and `quality` (`fast` or `quality`). Image generation and search use [credits](/guide/credits); at zero credits `generate_image` and image search are refused with a link to the Credits page, and text search falls back to keyword search.

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

**The client shows no tools, or every call fails with 401.** The sign-in did not complete. Trigger any tool to reopen the browser flow, and check you approved it for the account that can see the project. In Codex, run `codex mcp login scry`. In Figma, click **Connect** on the connector again.

**Codex sign-in on a remote machine ends on a page that won't load.** Codex waits for the sign-in redirect on `127.0.0.1` on the machine where Codex runs. If your browser is on another computer, as with SSH or a dev box, the final redirect can't reach it. Copy the full URL from the browser's address bar, then request it on the Codex machine while `codex mcp login` is still waiting:

```bash
curl "http://127.0.0.1:<port>/callback/…"
```

Codex prints `Successfully logged in.`

**Codex: `MCP tool call requires approval, but approval policy is never`.** A non-interactive run tried to call a Scry tool that needs approval. Set `default_tools_approval_mode = "approve"` under `[mcp_servers.scry]`; see [Codex](#codex).

**Figma: the Scry tools are there but never run.** They are probably switched off. Open **Manage** on the connector and turn them on.

**`RATE_LIMITED`.** The server allows 60 requests per minute per user. Wait and retry.

**`PROJECT_REQUIRED` or `PROJECT_HAS_NO_ORG`.** `scope: "org"` needs a `project_id`, and the project must belong to an organisation. Use `scope: "project"`.

**Results look out of date.** Check `freshness` on the rows. Hosting a build and indexing it complete separately, so a Storybook can be live while the index still describes the previous build.

**An empty result with `scope: "project"`** means that project genuinely has no match. It never silently falls back to a wider search, so an empty answer is information.

## Privacy and data

The server searches only what your account can already read, and enforces the same project visibility and membership rules as the dashboard. Your Firebase session stays on the server — the MCP client receives a separate token scoped to MCP, and screenshots are handed out as short-lived presigned URLs rather than public links.

## Feedback

Something not working, or a tool you wish existed? Tell us on the [feedback form](/feedback) or email <feedback@scrymore.com>.

For how the server is built and deployed, see the [MCP Server service docs](/services/mcp-server/).
