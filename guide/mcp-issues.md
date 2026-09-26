# Agents: Resolving Issues over MCP

Once a person has promoted a drift issue and picked where it gets fixed ([Fix in](/guide/fix-in-figma-or-code)), a coding agent can pick it up. It reads the issue, fixes the code or the Figma node, records the fix, and asks Scry to check.

The six tools below come with the [Scry MCP server](/guide/mcp). Connect it once and your agent has them. There's nothing extra to install.

## The tools

| Tool | Inputs | Returns |
| --- | --- | --- |
| `list_design_issues` | `project_id`; optional filters `link_id`, `figma_file_key`, `figma_node_id`, `story_id`, `fix_side[]`, `status[]`, `side_status[]`, `severity[]`, `assignee: "me"`, `changed_since`, `cursor`, `limit` (default 50, max 100) | Promoted issues: `issue_id`, `#number`, severity, status, Fix in, each side's status (and who claimed it), screen, story id, Figma node. Plus `next_cursor`. |
| `get_design_issue` | `issue_id`, or `project_id` + `number`; `images` (`crops` default, `full`, `none`); `max_width` | Everything needed to fix it: the note, AI hint, tracks, the Figma side (file key, node id, deep link, layer subtree, crop), the code side (story, `component_file`, `story_file`, `repository`, build sha and branch, Storybook URL, crop), expected vs actual value when known, last re-check, recent timeline, and how to fix each side. |
| `claim_design_issue` | `issue_id`, `side` (`code` or `design`), `release?` | That side moves to in progress for 15 minutes. Call again to renew, or `release: true` to give it back. |
| `mark_design_issue_fixed` | `issue_id`, `side`, `ref_url`, `ref_kind?`, `note?` | That side moves to fixed and the claim clears. Returns the tracks and a hint saying what will verify it. |
| `request_verify` | `issue_id`, or `project_id` + `link_id` for a whole screen; `side?`; `rediff?` | Verdicts (`matches` or `still_drifts` with a reason), which tracks moved, what is still waiting for new input, and the remaining quota. |
| `comment_design_issue` | `issue_id`, `body`, `propose_fix_side?` | The comment on the issue's timeline. |

A typical loop: `list_design_issues` with `status: ["open"]` and `fix_side: ["code"]` → `get_design_issue` → `claim_design_issue` → fix → `mark_design_issue_fixed` → `request_verify`.

Try it:

> Use the scry MCP server. List the open code-side issues in project `<id>`, take the top one, fix it in this repo and open a PR.

## Fixing the code side

1. `get_design_issue` gives the `component_file` and `story_file` paths, the build sha and branch, and both crops.
2. Edit those files in your own checkout. Scry never gets write access to your repo.
3. Open a pull request.
4. `mark_design_issue_fixed` with `side: "code"` and `ref_url` set to the PR URL. A bare commit sha works too, with `ref_kind: "commit"`.
5. Scry verifies the side on the next Storybook build uploaded to the project. A PR preview build counts. If a newer build already exists, `request_verify` with `side: "code"` checks now.

`code.repository` names the repo to edit. It's filled when the build was uploaded with **scry-sbcov 0.5.1 or later**. With older builds it's empty, so the agent should work from the repo it's already in.

## Fixing the design side

1. `get_design_issue` gives the `figma_file_key`, `figma_node_id`, a Figma deep link, the node's layer subtree and the expected value.
2. Change the node with **Figma's own MCP** (for example `use_figma`). Scry doesn't write to Figma.
3. `mark_design_issue_fixed` with `side: "design"` and `ref_url` set to a Figma version link, a numeric version id, or `ref_kind: "synced"` with no URL.
4. `request_verify` with `side: "design"`. Scry pulls the node's current render through the project's Figma connection and re-checks. A designer syncing the frame in Scry Link also triggers the re-check.

## What agents can't do

Agents act as the person who connected them, with fewer powers:

- **Promoted issues only.** Unreviewed AI findings and dismissed issues don't exist for an agent. Asking for one returns `NOT_FOUND`.
- **No triage.** Agents can't promote, dismiss, change severity, assign, or set Fix in. If Fix in is still Undecided, claiming fails with `FIX_SIDE_UNDECIDED`. The agent can suggest a side with `comment_design_issue` and `propose_fix_side`, and a person decides.
- **No verify or close.** Agents record fixes. Scry or a person verifies them.
- **Viewers stay read-only.** An agent connected by a viewer can list and read, and every write returns `FORBIDDEN`.
- **Claims are leases.** 15 minutes, renewable. If someone else holds the side, the call returns `CLAIMED` with who has it and when it expires. People can override an agent's claim.

## Limits

- 60 requests per minute per user across all Scry tools, and 30 issue writes per minute (`WRITE_RATE_LIMITED`).
- `request_verify` shares the project's cap of 20 per hour and 200 per day (`VERIFY_RATE_LIMITED`). When there's nothing new to check it returns `ran: false` and doesn't count.
- `rediff: true` runs a full new diff instead of a re-check. It costs 10 [credits](/guide/credits) from the project's organisation. It returns `INSUFFICIENT_CREDITS` when the balance is short. Only use it when someone asks for it.

## What people see

Every agent action lands on the issue's timeline with the agent's name and the person it's acting for:

> Claude Code (for Ana) marked the code side fixed — PR #412

Behind that line, the event is stored with actor kind `agent`, the client's name, and `via: mcp`. The dashboard sets these from the signed-in user, not from anything the agent sends. The Issues view also shows **Agent** on sides an agent has claimed.

## Errors

Each error is JSON with `error`, `message` and `retryable`.

| Code | Meaning |
| --- | --- |
| `NOT_FOUND` | No such promoted issue in a project you can access |
| `FORBIDDEN` | Your role is viewer |
| `FORBIDDEN_FOR_AGENTS` | People decide this in the dashboard |
| `CLAIMED` | Someone else holds this side. Includes `claimed_by` and `claim_expires_at` |
| `FIX_SIDE_UNDECIDED` | No person has picked Code or Design yet |
| `SIDE_NOT_REQUIRED` | This issue doesn't need a fix on that side |
| `CONFLICT` | The issue isn't in a state that allows this. Read it again |
| `RATE_LIMITED`, `WRITE_RATE_LIMITED`, `VERIFY_RATE_LIMITED` | Wait and retry |
| `INSUFFICIENT_CREDITS` | Not enough credits for `rediff`. Retry without it |
