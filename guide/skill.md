# Set up Scry with your AI assistant

Install the `scry-setup` skill, then ask your coding assistant to configure Scry
for your project. The skill inspects your repository, adapts the setup to your
Storybook and package manager, and checks the integrations you requested.

## Install the skill

From your application's repository, run:

```bash
npx skills add epinnock/scry-node --skill scry-setup
```

Choose your assistant when prompted. The installer supports Claude Code, Codex,
Cursor, and other compatible coding agents. You can select one explicitly:

::: code-group

```bash [Claude Code]
npx skills add epinnock/scry-node --skill scry-setup --agent claude-code
```

```bash [Codex]
npx skills add epinnock/scry-node --skill scry-setup --agent codex
```

```bash [Cursor]
npx skills add epinnock/scry-node --skill scry-setup --agent cursor
```

:::

Installation is project-scoped by default. Add `--global` to make the skill
available across your projects. The [skills installer](https://github.com/vercel-labs/skills)
is a separate tool from the Scry deployer.

**Installer requirement:** Node.js 22.20 or newer for `skills` 1.5.26. Check
`node --version` first. Your application's Node version does not need to change
just to install a skill; run the installer with a separate compatible runtime
or use the manual installation below. The Scry deployer itself requires Node.js
18 or newer.

## Ask for the setup you need

Open your assistant in the application's repository and ask:

> Set up Scry for this project and connect my assistant to its components.

You can also request a specific integration:

| Request | What the assistant sets up |
| --- | --- |
| “Deploy this Storybook to Scry with GitHub Actions and PR previews.” | Deployment configuration and workflows adapted to the repository |
| “Connect Scry MCP only; my project is already indexed.” | The assistant's remote MCP connection and a project-filtered search check |
| “Make this project's components searchable through Scry.” | Screenshot and metadata capture, deployment, and an indexing check |
| “Help me link this Storybook to Figma.” | Storybook connection checks and the Figma plugin setup steps |

To invoke it explicitly in Codex, use `$scry-setup`; in Claude Code, use
`/scry-setup`. Other clients can select it automatically when your request
matches. Reload the assistant if a newly installed skill does not appear.

## What happens during setup

The assistant first checks the existing Storybook build, package manager,
workspace layout, Scry project settings, workflows, and MCP connections. It
reuses existing configuration and asks for missing project choices. An
MCP-only setup does not need a deployer installation or new workflows.

For deployment, select or create a project in the
[Scry Dashboard](https://dashboard.scrymore.com). Supply its deployment key
through your local environment or your CI secret store. Complete MCP sign-in
and any Figma approval in your browser when prompted. **Keep keys out of chat
and committed files.**

The assistant can prepare local configuration for review. Tell it when you also
want to configure GitHub secrets, push the workflows, or deploy. The direct CLI
`init` shortcut performs those GitHub setup actions and commits and pushes;
`--skip-gh-setup` does not turn it into a local-only command.

If you do not have Storybook yet, say whether you want to add it or connect an
already indexed Scry project. The skill supports customer project setup;
[self-hosting the platform](/self-hosting/) is a separate infrastructure task.

## Check the result

Ask the assistant to show the checks for the capabilities you requested:

- **Deployment:** a successful build/upload or CI run and the actual Storybook
  URL. Open it while signed in if the project is private.
- **MCP:** the connected Scry account, followed by a search for a known
  component using your project's ID.
- **Indexing:** uploaded screenshots and metadata, then a search result from
  the expected build. Hosting can finish before indexing does.
- **Figma:** one linked layer whose **View Story** action opens the right story.

The assistant should identify any remaining browser action or processing step.
Writing the configuration alone does not complete authentication or indexing.

## Manual installation

Download or clone the [Scry CLI repository](https://github.com/epinnock/scry-node)
and copy the entire `skills/scry-setup` directory into your assistant's skill
directory. Include `references/` and `agents/` along with `SKILL.md`.

| Assistant | Project skill directory |
| --- | --- |
| Codex | `.agents/skills/scry-setup/` |
| Claude Code | `.claude/skills/scry-setup/` |

For other assistants, use their documented skill location or the installer.
This also works when you cannot run the installer in your environment.

If the installer reports **No skills found**, check that the source checkout
contains `skills/scry-setup/SKILL.md`, or update your downloaded checkout.
For MCP login or empty-search problems, see [MCP troubleshooting](/guide/mcp#troubleshooting).

## Direct setup guides

- [CLI installation](/guide/installation)
- [First deployment](/guide/first-deployment)
- [GitHub Actions](/guide/github-actions)
- [MCP connection](/guide/mcp)
- [Figma plugin](/guide/figma-plugin)
