# Build-free web capture

> **TL;DR:** `scry-deployer capture web` takes a screenshot and a structure tree of every story in
> a React Storybook without building Storybook. It starts your project's own Vite dev server and
> renders each story in headless Chromium. `scry-deployer upload` then sends the result to Scry.
> It needs `@scrymore/scry-deployer` 0.14.0 or newer, Storybook 10 on a Vite framework, and
> Playwright with Chromium. Projects that do not fit keep using the Storybook-build path, which
> stays fully supported.

## What it is

Scry's usual web path builds Storybook (`storybook build`), deploys the static site, and then
captures screenshots of it. This page describes a second path for the same project:

1. `capture web` starts your project's own Vite dev server.
2. It renders each story with Storybook's portable stories API in headless Chromium.
3. It writes one PNG and one structure tree per story as a
   [Scry Capture Format](/guide/capture-bundle-format) (SCF 1.0) bundle.
4. `upload` validates the bundle and sends it to Scry.

Search, the MCP server and the Figma plugin read the result the same way as any other
[capture source](/guide/capture-sources). The source is recorded as a web Storybook.

### When to use it

Use it when your Storybook is React on Vite and you want Scry's screenshots and search without
the cost of a Storybook build in CI. Keep the Storybook-build path when you also want a hosted
Storybook, [PR previews](/guide/pr-previews) or story coverage reports (see
[What stays on the Storybook-build path](#what-stays-on-the-storybook-build-path)).

## Requirements

- `@scrymore/scry-deployer` **0.14.0 or newer**.
- Storybook 10 on a Vite framework with the React renderer: `@storybook/react-vite` or
  `@storybook/nextjs-vite`. Other Storybook versions and other renderers stop with a clear
  message.
- `storybook`, `vite` and `playwright` installed in your project. The deployer uses the copies in
  your project and does not bring its own.
- Chromium for Playwright: `npx playwright install chromium`.
- Node 20.19 or newer (what Storybook itself needs).

## Run it locally

```bash
npm install --save-dev @scrymore/scry-deployer@^0.14.0
npx playwright install chromium
npx scry-deployer capture web
```

This writes the bundle to `.scry/capture` and a run report to `.scry/capture-report.json`. Then
send the bundle to Scry:

```bash
npx scry-deployer upload .scry/capture
```

`upload` reads your project ID, API key and API URL the same way the deploy command does: from
flags, from the `STORYBOOK_DEPLOYER_*` environment variables, or from `.storybook-deployer.json`.
See [Configuration](/cli/configuration).

Nothing is written into your project except the bundle, the report and a dependency cache under
`node_modules/.cache/scry-capture-web`. Set `SCRY_CAPTURE_CACHE_DIR` to move the cache.

### Check what it will capture

```bash
npx scry-deployer capture web --list
```

This prints the story IDs, one per line, and captures nothing.

### Capture only the stories you changed

```bash
npx scry-deployer capture web --changed-since origin/main --list       # affected story files
npx scry-deployer capture web --changed-since origin/main --list-ids   # affected story ids
npx scry-deployer capture web --changed-since origin/main              # capture them
```

A story is affected when its file, or a file it imports, changed since the ref (committed,
staged, unstaged or untracked). A change to the Storybook config directory, to a file the preview
imports, or to `package.json`, a lock file, or a Vite, TypeScript, Tailwind or PostCSS config
affects every story.

A run with `--changed-since` or `--stories` captures only some stories. It writes images, trees
and the report (with `"partial": true`) but no `scf.json`, so it is a preview and not a bundle to
upload. `upload` refuses such a bundle, because uploading part of a project would make the rest
look deleted.

### Common flags

| Flag | Default | Meaning |
| --- | --- | --- |
| `--config-dir <dir>` | `.storybook` | Storybook config directory |
| `--project-dir <dir>` | current directory | Project root |
| `--out <dir>` | `.scry/capture` | Bundle directory |
| `--workers <n>` | CPU cores the process may use, at most 4 | Browser pages capturing at once |
| `--max-dropped <n>` | `0` | Exit 1 when more than this many stories fail to capture |
| `--retries <n>` | `1` | Extra tries, each on a fresh page, for a story that fails |
| `--story-timeout <ms>` | `15000` | Time a story gets to render and finish its play function |
| `--viewport <WxH>` | `1280x720` | Browser viewport |
| `--fixed-time <iso\|off>` | `2026-11-14T12:00:00Z` | Instant the page clock starts at for each story; `off` uses the real clock |

The full list is in the [CLI reference](/cli/commands#capture-web).

## What a run does to each story

- The story renders into a fresh element. Its loaders, decorators and play function run.
- It counts as settled when the play function is done, fonts are loaded and two frames have been
  painted. Animations and transitions are switched off.
- Between stories the previous story is unmounted, and storage, cookies, scroll position, focus,
  viewport, document title and page address are reset.
- The page clock starts at `--fixed-time` for each story and then runs at real speed. The time
  zone is UTC and the locale is `en-US`. A story that prints a date gives the same image on every
  run.
- The image is cropped to the story's root element. A story that opens a dialog or popover
  outside its root is captured as the whole viewport.
- A story that fails is tried again on a fresh page. If it still fails it is listed in
  `counts.skipped` with a reason (`error` or `timeout`). It is never dropped silently.
- A capture that is one flat colour is kept and flagged as `blank_suspect`.
- Console errors go into the report. They never fail a story.

Stories stay private to your machine or runner during capture. The tool makes no network calls of
its own. A story that fetches from the network does so as it would in Storybook.

### Per-story settings

```js
export const Mobile = {
  parameters: {
    scry: {
      capture: {
        skip: false,                            // true: leave this story out
        viewport: { width: 375, height: 667 },  // overrides --viewport for this story
        delay: 200,                             // wait in ms before the screenshot
        fullPage: false,                        // true: capture the whole scrollable page
      },
      fields: { team: 'core' },                 // custom metadata
    },
  },
};
```

## Set it up in CI

The recommended way is to let the CLI write the workflow:

```bash
npx @scrymore/scry-deployer init --capture web --projectId my-project --apiKey scry_proj_xxx
```

For a project that already has Scry workflows, use `update-workflows`:

```bash
npx @scrymore/scry-deployer update-workflows --capture web
```

Both write `.github/workflows/scry-capture-web.yml`. The workflow installs `@scrymore/scry-deployer`
`^0.14.0`, installs Chromium, runs `capture web`, and uploads the bundle with `upload`.

To write it by hand, the core steps are:

```yaml
jobs:
  capture:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - run: npm install --no-save @scrymore/scry-deployer@^0.14.0
      - run: npx playwright install --with-deps chromium
      - run: npx scry-deployer capture web
      - run: npx scry-deployer upload .scry/capture
        env:
          STORYBOOK_DEPLOYER_API_URL: ${{ vars.SCRY_API_URL }}
          STORYBOOK_DEPLOYER_PROJECT: ${{ vars.SCRY_PROJECT_ID }}
          STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
```

An upload becomes the project's latest build, the same as a deploy from the Storybook-build
path. If both workflows upload on every push, they replace each other's latest build. While you
run both paths, let only one of them upload. `npx scry-deployer upload .scry/capture --dry-run`
validates a bundle exactly as a real upload does and sends nothing, so a second workflow can run
as a dry run.

::: warning Use ubuntu-24.04
`ubuntu-latest` is now Ubuntu 26.04. Playwright 1.55 has no Chromium for it. Set
`runs-on: ubuntu-24.04` until your Playwright version supports the newer image.
:::

### How long it takes

These are two measurements from one project, a design system with 1,734 stories. They are not a
promise for your project.

| Runner | Result |
| --- | --- |
| Self-hosted | capture 377 s with all 1,734 stories captured; upload 88 s for 87.5 MB |
| GitHub-hosted 2-core `ubuntu-24.04` | capture 601 s (a dry run, without upload) |

`--workers` defaults to the cores the job may use, up to 4. A smaller runner is slower.

## Move an existing project from the Storybook-build path

You can run both paths side by side, and keep the old one until you trust the new one.

### By hand

1. Check the [requirements](#requirements). If any is not met, stay on the Storybook-build path.
2. Install the deployer 0.14.0 or newer, `playwright` and Chromium in the project.
3. Run `npx scry-deployer capture web --list`, then `npx scry-deployer capture web`, and read
   `.scry/capture-report.json`. Check that `counts.captured` matches what you expect and look at
   `counts.skipped`.
4. Add the `scry-capture-web.yml` workflow (see above) and run it once.
5. Your existing `deploy-storybook.yml` and `deploy-pr-preview.yml` keep working. Remove them only
   if you no longer want a hosted Storybook or PR previews. While both run, let only one workflow
   upload (see the note above).

### With the setup skill

Ask your assistant to move the project to build-free capture. The [`scry-setup`
skill](/guide/skill) checks the requirements, runs `update-workflows --capture web`, and runs one
local capture so you see the story count before anything is pushed. It does not remove your
existing deploy workflows.

## What stays on the Storybook-build path

Build-free capture produces screenshots and structure trees. These features still need a built
Storybook, so they stay on the original path:

- A **hosted Storybook** (the live site Scry serves for your project, and the "Open in
  Storybook" link).
- [PR previews](/guide/pr-previews).
- **Story coverage** reports from the `scry-sbcov` analyzer.

## Limits

- React only. Vue, Svelte, Angular and web-components Storybooks are refused.
- Vite frameworks only. A webpack-based Storybook must be built and deployed the usual way.
- Storybook 10 only. Storybook 9 is refused.
- Docs pages (MDX and autodocs) are not captured.
- The clock runs while a story renders, so a story that prints the time to the second can differ
  between runs if its play function takes over a second.
- A story whose data holds dates later than `--fixed-time` sees them in the future. Pass a later
  `--fixed-time` for such a project.
- Web workers and `Temporal` read the real clock.
- The changed-stories graph follows JavaScript and TypeScript imports. It does not follow a CSS
  file's own `@import` chain.

## Troubleshooting

**The run stops with a message about the Storybook version or renderer.** Your project is outside
the [requirements](#requirements). Use the Storybook-build path.

**`Executable doesn't exist` or a Chromium launch error.** Run `npx playwright install chromium`.
On a CI runner, use `ubuntu-24.04` and `npx playwright install --with-deps chromium`.

**Exit code 1 with stories skipped.** Open `.scry/capture-report.json` and read `counts.skipped`.
Each entry has the story ID and a reason. A story file that cannot be imported skips all its
stories with that reason. Raise `--story-timeout` for slow play functions. Use `--max-dropped <n>`
to allow a known number of failures.

**`--out` is refused.** The directory must not exist, be empty, hold the `.scry-capture` marker
file, or hold a bundle written by `capture web`. Choose another directory.

**`upload` refuses the bundle.** It was a partial run (`--changed-since` or `--stories`). Run
`capture web` with no filter.

**An image looks wrong or blank.** Check `blankSuspect` in the report. A story that needs data
from the network behaves as it would in Storybook. Add a `delay` or fix the story's loader.

## Next steps

- [CLI reference: `capture web`](/cli/commands#capture-web)
- [GitHub Actions](/guide/github-actions)
- [Capture sources](/guide/capture-sources)
- [Capture bundle format](/guide/capture-bundle-format)
