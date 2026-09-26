# Fix in Figma or Code

When Scry finds a difference between a Figma frame and its Storybook story, it doesn't know which one is wrong. Sometimes the build drifted. Sometimes the design did. Each issue has a **Fix in** field, so you can say where the fix belongs, and Scry checks each side on its own.

This happens in the dashboard, under **Design Sync → Issues**. Coding agents can do the same work through the MCP server: see [Agents: resolving issues over MCP](/guide/mcp-issues).

## Fix in

Each promoted issue has one of four values:

| Fix in | Meaning |
| --- | --- |
| **Code** | The Storybook build is wrong. A developer changes the code. |
| **Design** | The Figma file is wrong. A designer changes the node. |
| **Both** | Both need a change. Each side is tracked and verified separately. |
| **Undecided** | Nobody has picked yet. The issue works as before: one **Mark fixed**, then **Verify & close**. |

You pick it when you promote a finding, next to severity. You can change it later from the issue.

### The AI hint

Scry sometimes suggests a side, for example *AI suggests: Design — Figma uses #5B5BD6, the token color.accent resolves to #6366F1*. The promote dialog starts on that suggestion, but it's only a hint. You still confirm it, and you can pick something else.

The hint comes from simple rules over data the diff already has. It costs no extra model call. When the rules aren't sure, it says nothing and the field starts on **Undecided**.

## One track per side

With Fix in set to Code, Design or Both, each side that needs work gets its own track:

**todo → in progress → fixed → verified**

- **todo**: this side needs a change.
- **in progress**: someone claimed it. A claim is a 15-minute lease. Renew it while you work, or release it.
- **fixed**: someone recorded a fix. Code fixes need a PR link or commit. Design fixes need a Figma version link or "synced".
- **verified**: Scry re-checked and the difference is gone.

The issue follows its tracks. If any side is still todo or in progress, the issue is open. When every side is fixed or verified, it waits for verification. When every side is verified, it closes.

If a re-check still sees the difference, the side goes back to **todo**. The panel shows *Rejected* with the reason.

## How each side gets verified

Scry re-checks a side only when that side has something new to look at.

- **Code**: the next Storybook build uploaded to the project. When a new build lands, Scry re-checks the open code sides automatically. A PR preview build counts.
- **Design**: the next Scry Link sync of that frame, or a verify request. **Verify now** on a design side makes Scry fetch the node's current render through the project's Figma connection, then re-check.

A new build never verifies a design side, and a Figma sync never verifies a code side. **Both** needs both.

If the re-check matches, the side is verified, even when nobody marked it fixed. A designer who just fixes the frame and syncs doesn't need to click anything else.

Owners, admins and developers can also mark a side verified by hand.

## In Scry Link

Scry Link doesn't show the issues themselves yet. On a linked frame with open issues, it shows one row:

**2 open issues · View in dashboard ↗**

The link opens the dashboard's Issues view filtered to that frame. The count only includes promoted issues that are open or waiting for verification, never unreviewed AI findings. There's no row when the count is zero, when you're signed out, or when no project is selected.

To fix a design-side issue: change the frame in Figma and sync it in Scry Link as usual. The sync triggers the re-check.

## Who can do what

- **Owners, admins, developers**: promote, set Fix in, claim, mark fixed, verify, reopen.
- **Viewers**: read only. They can see issues and tracks, but the buttons are hidden and writes are refused.
- **Agents** act as the person who connected them, with fewer powers. See [Agents: resolving issues over MCP](/guide/mcp-issues).

## Limits and cost

- A re-check is free. Explicit verify requests (**Verify now**, or an agent's `request_verify`) are capped at **20 per hour and 200 per day per project**. Re-checks that fire because a new build or sync arrived don't count.
- A full re-diff instead of a re-check costs **10 credits**, the same as a Basic diff. See [How Credits Work](/guide/credits).
- When there's nothing new to judge, a verify request says so and doesn't use up the cap.

## How accurate is it?

The **AI quality** card on the project's **Usage** tab tracks three numbers from your own project:

- **Fix in hint acceptance**: how often people kept the AI's suggested side instead of overriding it.
- **Auto-close precision**: how often issues Scry closed stayed closed. An issue reopened within 30 days counts against it.
- **Wrong-side rate**: how often Fix in was changed after promote.

Each number shows *needs 10* until there are at least 10 decisions to count.
