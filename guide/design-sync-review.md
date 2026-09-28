# Reviewing a Design Sync run

Design Sync is the feature that compares a linked Figma layer against its Storybook story and tracks the drift it
finds. In the dashboard, the feature lives across three pages: **Screens** (the list of linked pairs), the **diff
editor** (one pair, side by side), and **Issues** (drift that's been promoted and is being tracked). This page walks
through the three, and where each one hands off to the next. For what a run actually records (judge, capture
warnings), see [What a Design Sync run records](/guide/design-sync-run-details); for the promote/dismiss/severity
model behind Issues, see [Review Model](/services/diff-service/review-model).

## Screens

**Project ▸ Screens** (`/projects/:id/screens`) lists every linked pair in the project: one row per Figma layer ↔
Storybook story link, with its latest run's status. Filter by state — **To triage**, **Needs review**, **Needs
verify**, **Matches**, **Never diffed** — or switch the view to **Designs** (Figma layers not yet linked) or
**Requests** (component requests filed from Figma, see [Component Requests](/guide/component-requests)) with the
`?view=` query. A row with open capture warnings on its latest run shows a small badge; hover it for which warning
(see [What a Design Sync run records](/guide/design-sync-run-details) for what each one means and how to fix it).

Click a row to open its **diff editor**.

## The diff editor

**`/projects/:id/screens/:screenId`** puts the Figma export and the Storybook screenshot side by side, with an
Evidence strip underneath that inspects the currently-selected finding pixel by pixel — the Figma and Storybook crops
cropped to the finding's box, and a diff tile that highlights every differing pixel. Use `2×`/`4×`/`8×`/`Fit` to
zoom, or `Blink` (keyboard `B`) to flip between the two crops instead of comparing side by side.

Findings a run detected but no one has ruled on yet are **candidates** — "none is an issue until you promote it."
From here you:

- **Promote** a candidate to a tracked issue, choosing its severity (blocker/major/minor/nit) — never automatic,
  never bulk.
- **Dismiss** a candidate (with a reason); dismissing is the one bulk action available, and a dismissal is
  remembered across re-runs, so a re-annotation never resurrects something you've already ruled out.
- Open a promoted finding's **Issue** page directly, or come back to it later from **Issues** (below).

`?issue=<n>` on this URL selects a specific finding when you arrive from an issue or a notification; `?run=<runId>`
pins the editor to a specific historical run instead of the pair's latest one.

## Issues

**Project ▸ Issues** (`/projects/:id/issues`) is every promoted, tracked drift for the project — not the raw
candidates, which stay on Screens until someone rules on them. Filter with `?lens=` (`triage`, `open`, `awaiting`,
`closed`, `dismissed`), or narrow to one screen's issues with `?screen=<screenId>`, one severity with `?severity=`,
one label with `?label=`, or one resolution side with `?fix=design|code`.

Opening a row goes to **`/projects/:id/issues/:n`**, the Issue page: the finding, its "Fix in" side (design or code)
and resolution track, severity (changeable after promotion — recorded as a `severity_set` event), and a link back
into the diff editor at the exact screen and run it came from.

## Where these links come from

A link to a specific screen or issue — from the MCP server, a GitHub issue Scry filed on your drift, or the Scry Link
Figma plugin's **View diff in Scrymore** button — always lands on the canonical URL above (`/screens/:screenId` or
`/issues/:n`). Older links written before a URL change still work: see `docs/legacy-redirects.md` in the
`scry-developer-dashboard` repo for the full compatibility table.
