# Quick Start

Set up Scry with your coding assistant, or use the CLI directly.

## Set up with your assistant

From your application's repository:

```bash
npx skills add epinnock/scry-node --skill scry-setup
```

The current installer requires Node.js 22.20 or newer. Choose your assistant,
then ask: **“Set up Scry for this project and connect my assistant to its
components.”**

The skill checks your Storybook, configures the requested deployment and MCP
integration, and verifies the result. You complete account sign-in in your
browser. You can also ask for MCP alone if your project is already indexed.

See [Set up with your AI assistant](/guide/skill) for client-specific commands,
manual installation, and example requests.

## Set up directly with the CLI

This path needs an existing Storybook build script, a GitHub repository, Node.js
18 or newer, and an authenticated GitHub CLI (`gh auth login`) for automatic
repository secret setup.

### 1. Select a Scry project

Sign in to the [Scry Dashboard](https://dashboard.scrymore.com), create or select
a project, and save its **Project ID** and **API Key**. Keep the key in your
local environment as `SCRY_API_KEY`; do not put it in committed configuration.
Use the API URL supplied by the dashboard or your existing project settings.

### 2. Run init

`init` creates or overwrites `.storybook-deployer.json` and the generated
workflows, configures GitHub variables/secrets, then **commits and pushes**.
Check your working tree and staged changes first. If you want to prepare local
files before publishing, use the skill or the
[manual deployment guide](/guide/first-deployment).

Run from the repository containing your Storybook:

::: code-group

```bash [npm]
npx @scrymore/scry-deployer init \
  --project-id YOUR_PROJECT_ID \
  --api-key "$SCRY_API_KEY"
```

```bash [pnpm]
pnpm dlx @scrymore/scry-deployer init \
  --project-id YOUR_PROJECT_ID \
  --api-key "$SCRY_API_KEY"
```

```bash [yarn]
yarn dlx @scrymore/scry-deployer init \
  --project-id YOUR_PROJECT_ID \
  --api-key "$SCRY_API_KEY"
```

:::

Add `--api-url YOUR_UPLOAD_API_URL` if your project uses a different endpoint.
The `--skip-gh-setup` option skips setting GitHub variables and secrets; it
**still commits and pushes**. Its manual setup output can include the key, so
do not share those logs. For manual CI configuration, see
[GitHub Actions](/guide/github-actions#repository-variables).

### 3. Check the workflows and deployment

Check the repository's **Actions** tab and open the URL reported by the
deployment. Adapt generated workflows for a monorepo, custom build output,
package-manager version, or default branch as needed.

To maintain a `/latest/` URL for the main build, pass `--deploy-version latest`
in its deployment step. GitHub context can override a version set only in the
configuration file or environment. PR deployments should pass the PR number
explicitly too, for example `--deploy-version pr-123`; the
[workflow example](/guide/github-actions) uses the event's PR number.

For searchable components, keep `--with-analysis` and coverage enabled, confirm
that screenshots and metadata were uploaded, and wait for indexing to finish.
Then [connect MCP](/guide/mcp) and search for a known component with your
project's ID. A successful static upload alone does not confirm search is ready.

## Next steps

- [First Deployment](/guide/first-deployment) — deploy without running init
- [GitHub Actions](/guide/github-actions) — customize deployment and previews
- [MCP Server](/guide/mcp) — connect your assistant to indexed components
- [Figma Plugin](/guide/figma-plugin) — link design layers to stories
