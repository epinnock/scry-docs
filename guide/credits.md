# How Credits Work

> **TL;DR:** Every AI task in Scry uses credits. Your personal workspace gets 2,000 free credits each month. Credits belong to an organization, and Scry picks which one pays.

::: info Rollout
Credits are enforced since 2026-09-24. When a balance can't cover a task, the task pauses until credits reset or are granted. See [When you run out](#when-you-run-out).
:::

## What costs credits

| Task | Credits |
|------|---------|
| Design Sync diff, Basic | 10 |
| Design Sync diff, Plus | 40 if it escalates to the deeper check, otherwise 10 |
| Refine and recheck a diff | Free |
| MCP `generate_image`, fast | 40 |
| MCP `generate_image`, quality | 150 |
| Build indexing | 2 per new or changed story (or uploaded image) |
| Image search | 1 per search |
| AI text search | 1 per 100 searches |
| Scry Link Suggest, name matching | Free |
| Scry Link Suggest, visual matching | 1 per 10 frames per scan, rounded up |

A few details:

- **Plus diffs.** A Plus run holds 40 credits up front. If the screen isn't busy enough to escalate to the deeper check, or Plus falls back to Basic, you are charged 10 and the other 30 go straight back. A failed run is refunded in full.
- **Diff tier.** Only a project owner or admin signed in to the dashboard can change a project's diff tier. Personal access tokens can't change it.
- **Build indexing.** Stories that didn't change since an earlier build are reused. They cost nothing.
- **AI text search.** The first search of each block of 100 charges 1 credit. The next 99 are free.
- **Suggest.** Visual matching is charged once per scan, not per request. All frames in the scan are counted together and rounded up once, so a scan of 24 frames costs 3 credits.

## Where credits come from

Credits belong to an organization. Each organization has its own balance.

| Workspace | Monthly credits | Notes |
|-----------|-----------------|-------|
| Personal workspace | 2,000 | Every user has one. Resets on the 1st of each month (UTC). |
| Team organization | 0 | Funded by credit grants from the Scry team. |

- **Monthly credits** don't roll over. What you don't use by the end of the month is gone.
- **Bonus credits** come from grants. They are used after your monthly credits run out. Some grants have an expiry date.
- You can't buy credits yet. Paid plans come later.

## Who pays

You never pick which balance pays. Scry works it out.

**Project work** is always paid by the project:

- Design Sync diffs, build indexing and image uploads are paid by the project's organization.
- If the project has no organization, the project owner's personal workspace pays.
- This is true whoever starts the task.

**Personal actions** (text search, image search, Scry Link Suggest, MCP images) depend on where you are:

- In a project whose organization you belong to, that organization pays. For a project in someone's personal workspace, this applies only to the owner.
- Anywhere else, your own credits pay. For example, if you search someone else's public project, the charge comes from you, not from them.
- "Your own credits" means your active organization if you are a member of it, otherwise your personal workspace.

The org picker in the dashboard sets your active organization. Scry Link and the MCP server show its name next to the balance.

## Check your balance

Open the **Credits** page at [dashboard.scrymore.com/credits](https://dashboard.scrymore.com/credits).

- Every member of an organization sees its balance and their own usage.
- The organization owner also sees every charge and can export it as CSV.
- Project members can see the project's diff run history: who ran each diff and what it cost.

When 80% of the monthly credits are used (400 or fewer left) and there are no bonus credits, the dashboard shows a warning.

## How a task is charged

1. Scry checks the balance before the task starts.
2. It holds the price while the task runs.
3. It charges when the task finishes.

If a task fails, the credits come back automatically. The Credits page shows it as **failed, refunded**. A retried task is never charged twice.

## When you run out

These tasks pause until credits reset or are granted:

- Design Sync diffs
- Build indexing
- Image search
- Scry Link Suggest's visual matching
- MCP images

Some things keep working:

| Feature | At zero credits |
|---------|-----------------|
| Text search | Falls back to keyword search. No AI, and free. |
| Scry Link Suggest | Matches by name only. |
| New builds | Stored and viewable, but not searchable yet. |
| Existing diffs, issues and indexed stories | Keep working. |

A build that is waiting shows **Waiting for credits** and how many credits it needs. Scry checks every hour and starts indexing on its own once the balance covers it. Project members who can upload builds (owner, admin and developer, not viewers) can also press **Index now** on the **Builds** tab.

Signed out, search is keyword-only. Image search needs you to sign in.

## Need more credits

Press **Request more credits** on the Credits page. It opens the [feedback form](/feedback).

## Next Steps

- [Figma Plugin](/guide/figma-plugin) - Link stories and use Suggest
- [MCP Server](/guide/mcp) - Search and generate images from your AI tools
- [Troubleshooting](/guide/troubleshooting) - Common issues
