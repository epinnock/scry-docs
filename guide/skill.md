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

<!-- DRAFT: the native skill and sample repos are private until founder go -->

## Native app capture

Install the Scry native capture skill with npx skills add, then ask your assistant to set up Scry capture. It adds the launch hook, screen registry and capture scripts. With a simulator or emulator available, it runs the capture and a dry run. Otherwise it hands you the commands to run on a Mac. It never uploads without your go.

```bash
npx skills add epinnock/scry-node --skill scry-native-capture-setup
```

The `scry-setup` skill above covers Storybook on the web. This second skill, `scry-native-capture-setup`, sets up an iOS (SwiftUI), Android (Jetpack Compose) or React Native app so that Scry can capture its screens. Install it from your app's repository. The `--agent` choices and the Node.js 22.20 installer requirement are the same as for `scry-setup`. Then ask your assistant:

> Set up Scry capture for this app.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/skill-setup.mp4">
    <track kind="captions" src="/videos/skill-setup.vtt" srclang="en" default>
  </video>
  <figcaption>The skill setting up a bare app for capture. The assistant in the video ran where no simulator was available, so it handed over the commands, which are then run on a Mac.</figcaption>
</figure>

### What the skill adds to your app

For SwiftUI and Compose, the skill inspects the project, asks only what it cannot find (which screens matter, your project id, whether you want CI), and adds:

- a **launch handler** (`ScryLaunch.swift` or `ScryLaunch.kt`, about 30 lines) that shows only the requested screen when the app is launched with a screen id. A normal launch is unchanged;
- a **screen registry** (`ScryScreens.swift` or `ScryScreens.kt`) that maps each stable screen id to its view and source location;
- **fixtures**, so each screen renders without sign-in or network;
- **`scripts/capture.sh` and `scripts/make-scf.mjs`**, the reference capture script and the bundle writer;
- optionally, the **CI workflow** `.github/workflows/scry-capture.yml`.

For React Native, the skill uses the built-in `scry capture rn` command, which needs no capture script.

When a simulator or emulator is available, it runs the capture and `scry upload <bundle> --dry-run` and shows you the screenshots; otherwise it lists the commands for you to run on a Mac. A valid bundle can still hold a bad image, so look at them.

### What the skill will not do

- It **never uploads** until you say so, and it never prints, stores or commits your API key. Set `SCRY_PROJECT_ID` and `SCRY_API_KEY` yourself, in your shell or your CI secrets.
- It adds **no dependency** to your app, and its capture paths do not change a release build.
- It does not use `--include-source` unless you ask, so no source text is uploaded.
- It never dismisses a permission prompt on your simulator or emulator.
- If no simulator or emulator is available where it runs, it stops, tells you so, and lists the exact commands for you to run. It does not claim a capture it did not make.
- It does not cover UIKit or Flutter apps. The [Capture bundle format](/guide/capture-bundle-format) page documents the bundle for writing your own script.

Capture for SwiftUI and Compose is a reference script that the skill copies into your project. It is not a built-in Scry command.

### Next

- [Native apps overview](/guide/native-apps)
- [iOS (SwiftUI)](/guide/ios-swiftui)
- [Android (Compose)](/guide/android-compose)
- [React Native](/guide/react-native)

<style>
.step-video {
  margin: 24px 0;
}
.step-video video {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: block;
}
.step-video figcaption {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
