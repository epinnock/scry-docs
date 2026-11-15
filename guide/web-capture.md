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
- For the CI workflow written by `init` and `update-workflows`: Playwright installed in your
  project (for example `npm install --save-dev playwright`) and the Storybook project at the
  repository root.
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

`init` and `update-workflows` write the GitHub Actions workflow for you. Both need
`@scrymore/scry-deployer` 0.14.0 or newer.

```bash
npx @scrymore/scry-deployer init --projectId YOUR_PROJECT_ID --apiKey YOUR_API_KEY --capture web   # new project
npx -y @scrymore/scry-deployer@^0.14.0 update-workflows --capture web                              # existing project
```

Add `--config-dir <dir>` when your Storybook config is not in `.storybook`. The Storybook
project must be at the repository root. For a project in a subfolder, copy the workflow below and
add a `working-directory`.

The command first checks the project: Storybook 10, a Vite framework, the React renderer, Vite,
and Playwright installed in the project. If a check fails, it prints which one, writes no files
and exits 1.

### What it writes

| File | What changes |
| --- | --- |
| `.github/workflows/scry-capture-web.yml` | New. On a push to the default branch it captures every story and uploads the bundle. |
| `.github/workflows/deploy-storybook.yml` | `--with-analysis` becomes `--no-analysis`. It still builds and hosts Storybook and reports coverage. It no longer captures the stories. |
| `.github/workflows/deploy-pr-preview.yml` | Nothing changes. Pull requests keep the preview, the comment and their screenshots, because `capture web` runs only on the default branch. |

An uploaded bundle carries screenshots and structure for search. It has no browsable Storybook
and no coverage report, so the deploy workflow stays for those. Each push to the default branch
therefore creates two builds in Scry: the hosted Storybook, which is not indexed, and the bundle,
which is. The bundle is what search reads.

### The generated workflow

This is the file `--capture web` writes. The two workflows do not fight over the latest build,
because the deploy workflow runs with `--no-analysis` and is not indexed.

```yaml
# Auto-generated by Scry Storybook Deployer
# Capture every Storybook story without building Storybook, then upload the screenshots to Scry
# Regenerate with: npx -y @scrymore/scry-deployer@^0.14.0 update-workflows --capture web
#
# Needs Storybook 10 on a Vite framework with the React renderer, and Playwright in the project.
# deploy-storybook.yml still builds and hosts Storybook and reports coverage; it runs with
# --no-analysis so the stories are captured once, here.

name: Scry Capture (web)

on:
  push:
    branches: [main, master]
  workflow_dispatch:

# Runs for one branch queue up instead of cancelling: a cancelled capture uploads nothing.
concurrency:
  group: scry-capture-web-${{ github.ref }}
  cancel-in-progress: false

jobs:
  capture:
    # A fixed Ubuntu, not the floating "latest" label: that one moves to a new Ubuntu before
    # the project's Playwright has a Chromium build for it, and the browser install then fails.
    runs-on: ubuntu-24.04
    timeout-minutes: 30

    permissions:
      contents: read
      # Listed because a permissions block drops every scope it does not name
      # (GitHub Packages installs need it).
      packages: read

    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          # Project code runs on this checkout; the token is not left in .git/config.
          persist-credentials: false

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          # capture web needs Node 20.19 or newer; '20' resolves to the newest 20.x.
          node-version: '20'


      - name: Install dependencies
        run: npm install

      - name: Install the Scry deployer
        id: scry
        # Its own folder and a floor of ^0.14.0 (the first release with capture web): the
        # repo's own pin cannot pick an older deployer.
        # --ignore-scripts: nothing in its tree needs an install script.
        run: |
          set -o pipefail
          mkdir -p "$RUNNER_TEMP/scry"
          npm i --no-save --no-audit --no-fund --ignore-scripts --prefix "$RUNNER_TEMP/scry" @scrymore/scry-deployer@^0.14.0
          echo "version=$(node -p "require('$RUNNER_TEMP/scry/node_modules/@scrymore/scry-deployer/package.json').version")" >> "$GITHUB_OUTPUT"

      - name: Install Chromium with the project's Playwright
        # The project's own Playwright, run from the checkout: capture web drives that one, so
        # the browser build has to match it.
        run: npx --no-install playwright install --with-deps chromium

      - name: Capture the stories
        # Exits 1 when more stories fail to capture than SCRY_MAX_DROPPED allows (default 0).
        # Each failed story is retried once first. A red run uploads nothing, so Scry keeps
        # the last complete capture instead of one with stories missing.
        run: |
          "$RUNNER_TEMP/scry/node_modules/.bin/scry-deployer" capture web \
            --out "$RUNNER_TEMP/capture" \
            --report "$RUNNER_TEMP/capture-report.json" \
            --max-dropped "${SCRY_MAX_DROPPED:-0}"
        env:
          # Optional: stories allowed to fail capture before the run ends red (default 0).
          SCRY_MAX_DROPPED: ${{ vars.SCRY_MAX_DROPPED }}

      - name: Keep the capture report
        if: ${{ always() }}
        uses: actions/upload-artifact@v4
        with:
          name: scry-capture-web-report
          path: ${{ runner.temp }}/capture-report.json
          retention-days: 7
          if-no-files-found: ignore

      - name: Validate the bundle (manual run on another branch)
        # A manual run on a branch that is not the default one checks the bundle and sends nothing.
        if: ${{ github.event_name != 'push' && github.ref_name != github.event.repository.default_branch }}
        run: |
          "$RUNNER_TEMP/scry/node_modules/.bin/scry-deployer" upload "$RUNNER_TEMP/capture" --dry-run
        env:
          TMPDIR: ${{ runner.temp }}

      - name: Upload the bundle to Scry
        if: ${{ github.event_name == 'push' || github.ref_name == github.event.repository.default_branch }}
        run: |
          "$RUNNER_TEMP/scry/node_modules/.bin/scry-deployer" upload "$RUNNER_TEMP/capture" --deploy-version "${GITHUB_SHA::12}"
        env:
          STORYBOOK_DEPLOYER_API_URL: ${{ vars.SCRY_API_URL }}
          STORYBOOK_DEPLOYER_PROJECT: ${{ vars.SCRY_PROJECT_ID }}
          STORYBOOK_DEPLOYER_API_KEY: ${{ secrets.SCRY_API_KEY }}
```

What it does:

- Runs on `ubuntu-24.04`, not `ubuntu-latest`. The floating label moves to a new Ubuntu before
  older Playwright versions have a Chromium build for it, and the browser install then fails.
- Uses Node 20 (the newest 20.x, which is 20.19 or newer).
- Installs the deployer from npm into `$RUNNER_TEMP/scry`, outside your checkout, with a floor of
  `^0.14.0`.
- Installs Chromium with your project's own Playwright.
- Keeps `capture-report.json` as a workflow artifact for 7 days.
- Gives the API key only to the upload step. It reads the secret `SCRY_API_KEY` and the variables
  `SCRY_API_URL` and `SCRY_PROJECT_ID`, the same ones the deploy workflows use.
- Stops after 30 minutes.
- Can be started by hand. A manual run on a branch other than the default one checks the bundle
  with `upload --dry-run` and sends nothing.

One optional repository variable, `SCRY_MAX_DROPPED`, sets how many stories may fail to capture
before the run ends red. The default is `0`. A failed story is retried once first. With `0`, one
story that cannot be captured fails the run and nothing is uploaded, so search keeps the last
complete capture. Raise it only for stories you know are flaky.

::: warning Hand-written workflows
If you write your own workflows instead of using the generated ones, an upload becomes the
project's latest build, the same as a deploy. Do not let a workflow that uploads a bundle and a
workflow that deploys with `--with-analysis` both run on the same push, or each replaces the
other's latest build. The generated setup avoids this with `--no-analysis`.
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

### By hand

1. Check the [requirements](#requirements). If any is not met, stay on the Storybook-build path.
2. Count your stories today: build Storybook and count the entries of type `story` in
   `storybook-static/index.json`, or read the count from the latest green deploy run.
3. Prove the capture locally before you change CI:

   ```bash
   npx playwright install chromium
   npx -y @scrymore/scry-deployer@^0.14.0 capture web --list
   npx -y @scrymore/scry-deployer@^0.14.0 capture web
   npx -y @scrymore/scry-deployer@^0.14.0 upload .scry/capture --dry-run
   ```

   The capture prints `N of M stories captured` and writes `.scry/capture-report.json`. `M`
   should equal your old count. Docs pages are not stories and neither path captures them.
   Explain every difference from the report before you go on. Add `.scry/` to `.gitignore`.
4. Write the workflows:

   ```bash
   npx -y @scrymore/scry-deployer@^0.14.0 update-workflows --capture web
   ```

   `update-workflows` overwrites `deploy-storybook.yml` and `deploy-pr-preview.yml`, so review the
   diff and re-apply any edits you made by hand. Your repository variables and secret stay as
   they are.
5. After the push, the "Scry Capture (web)" run should end green with the same story count, and
   "Deploy Storybook" should still host Storybook and report coverage.

### With the setup skill

Ask your assistant to switch the project to build-free web capture. The [`scry-setup`
skill](/guide/skill) follows the steps above:

- It checks that the project qualifies and that the published deployer has the command. If
  0.14.0 is not out yet, it tells you build-free capture arrives in 0.14.0, leaves the project
  as it is and stops.
- It records the story count, runs `capture web` and `upload --dry-run` locally, and compares the
  counts. It will not switch CI over a gap it cannot explain.
- It then runs `update-workflows --capture web`, shows you the diff, and commits only what you
  have authorised. If Playwright is missing, it tells you that adding it changes your project.
- It tells you what changed and how to go back.

### Go back

Run `update-workflows` without `--capture web`, then delete
`.github/workflows/scry-capture-web.yml`. If you leave that file, the command warns that every
push will be captured twice.

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

**`crypto.hash is not a function`.** Your Node is older than 20.19. Storybook 10 and `capture web`
need Node 20.19 or newer. Check `node --version` and upgrade.

**`init` or `update-workflows` writes nothing and exits 1.** The project did not pass the check
(Storybook 10, Vite framework, React renderer, Vite, and Playwright installed in the project). The
message names the failed requirement.

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
