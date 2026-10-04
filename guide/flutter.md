# Capture a Flutter app

Capture the screens of a Flutter app and put them in your Scry project, where they are browsable build by build and searchable by your AI assistant through the [MCP server](/guide/mcp). This page walks through `scry-sample-flutter`, a small Flutter app called Kettle, from clone to a build in your project, then shows how to do the same for your own app.

**No code of yours is uploaded.** Scry receives PNG screenshots and a small manifest, nothing else. No widget tree and no source text leave your machine.

::: info How capture works for Flutter
Flutter capture is a **reference script** that lives in the sample app and in the Scry skill. It is not a built-in Scry command: there is no `scry capture flutter`. You copy the script into your project (or let the skill add it), and the only Scry command involved is `scry upload` (run as `npx @scrymore/scry-deployer upload`).
:::

## Which Flutter apps this covers

- **Flutter apps for Android and iOS.** Each screen is rendered by your own Flutter code and saved as a PNG.
- **Two ways to capture, one bundle format.** On an **emulator or simulator** you get the real system fonts and pixel density of that device, and a build labelled **Flutter · Android** or **Flutter · iOS**. With **no device** (the headless path) the screens are rendered by `flutter test` in seconds on any Linux or Mac machine with the Flutter SDK, and the build is labelled **Flutter · Other**.
- **The headless path is a Flutter Material rendering, not the iOS look.** Use it for CI and for machines without a simulator. If you want your screens as they look on an iPhone, capture on a simulator.
- **Not covered:** Flutter web and Linux, Windows or macOS desktop apps, and linking a captured screen to a Figma frame (not available for any native app yet).

## Before you start

- **The Flutter SDK** on your `PATH` (`flutter --version`). The sample is pinned to Flutter 3.47.6; the headless pixels can differ between Flutter versions and operating systems, so pin the version in CI.
- **For the emulator or simulator path:** an Android emulator (or a device) reachable by `adb`, or the iOS Simulator on a Mac with Xcode.
- **Node.js 18 or later**, which runs the Scry CLI through `npx`.
- A Scry project and a project API key (below).

### Get a project API key

In the [dashboard](https://dashboard.scrymore.com), open your project, then **Settings ▸ General** for the project ID and **Settings ▸ API keys** to generate a key. Keys are project-scoped: a key only uploads to the project it was created in. Copy the key when it is shown and keep it out of chat and committed files.

<figure class="step-shot">
  <img src="/images/native-apps/api-keys-settings.png" alt="Project Settings, API keys tab, with the Create API key button" width="1280" height="720">
  <figcaption>The <strong>API keys</strong> tab of your project settings.</figcaption>
</figure>

## 1. Install: the skill, or the sample

There are two ways to get the capture setup into a Flutter app.

**Use the Scry skill (for your own app).** Install it in your app's repository:

```bash
npx skills add scryorg/scry-node --skill scry-native-capture-setup
```

The installer works with Claude Code, Codex and Cursor, and needs Node.js 22.20 or newer; see [Set up with AI](/guide/skill) for the details. Then ask your assistant:

> Set up Scry capture for this app.

The skill recognises a Flutter app by its `pubspec.yaml`. It inspects your project and asks only what it cannot find: which screens matter, your project id, and whether you want CI. It adds files for capture only:

- `integration_test/scry/screens.dart`, the registry: one entry per screen with its `id`, name and the widget, built with fixed data so it renders the same every run;
- `integration_test/scry_capture_test.dart` and `test_driver/integration_test.dart`, the capture on an emulator or simulator;
- `test/scry_capture_test.dart`, the headless capture;
- `scripts/capture.sh`, `scripts/make-scf.mjs` and `scripts/screens.json`;
- optionally, the CI workflow;
- two lines in the `dev_dependencies` of `pubspec.yaml`: `integration_test` and `flutter_test`. Both ship inside the Flutter SDK, so nothing is downloaded from pub.dev.

Nothing in `lib/` changes. If a device is available where the assistant runs, it runs the capture and `upload --dry-run` and shows you the screenshots; otherwise it lists the commands for you to run. It never uploads, and never touches your API key, without your go.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/flutter-1-skill.mp4">
    <track kind="captions" src="/videos/flutter-1-skill.vtt" srclang="en" default>
  </video>
  <figcaption>Step 1 — the skill setting up a bare Flutter app for capture.</figcaption>
</figure>

**Or start from the sample (a working example).** Clone the Kettle sample app, a small coffee-order app with six screens: Menu, Item Detail, Order, Order placed, and the two components QuantityStepper and Button states.

```bash verify
git clone https://github.com/scryorg/scry-sample-flutter.git
cd scry-sample-flutter
flutter pub get
```

```text expected
Got dependencies!
```

## 2. Capture your screens

### With no device (headless)

This renders each registered screen with `flutter test` and writes the bundle. It needs no emulator or simulator.

```bash verify
bash scripts/capture.sh headless
```

```text expected
scf: 6/6 captured, 0 skipped -> .scry/capture
```

```bash verify
ls .scry/capture .scry/capture/images
```

The images are a Flutter Material rendering at 390 by 844 points and 3× density, with the fonts your app declares (and Flutter's own Roboto and Material Icons) loaded. The script refuses to write a bundle if no fonts could be loaded, because the screenshots would show black blocks instead of text.

### On an emulator or simulator

Start an Android emulator, or boot an iOS Simulator, then run the script for that platform. The screens are driven by `flutter drive` with the `integration_test` package, and each screenshot is the app surface of the device (the status bar is not part of it).

```bash
# Android emulator (or a device) reachable by adb
bash scripts/capture.sh android

# iOS Simulator, on a Mac
bash scripts/capture.sh ios
```

In both cases `.scry/capture` holds one image per screen and a small manifest. The device path labels the build **Flutter · Android** or **Flutter · iOS** and records the device name and OS version in the manifest; the headless path records `flutter_test 390x844@3x`.

::: tip Add one of your own screens
Open `integration_test/scry/screens.dart` (it lives under `integration_test/`, so it never ships in a release build) and add one entry to the registry: an `id`, a display `name`, and the widget with its fixed data. Add the matching entry to `scripts/screens.json`, which is the list the capture script reads. Run the script again and the bundle holds one more capture.

The `id` is the screen's identity across builds. Use a route or class name, never a title a person might edit.
:::

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/flutter-2-capture.mp4">
    <track kind="captions" src="/videos/flutter-2-capture.vtt" srclang="en" default>
  </video>
  <figcaption>Step 2 — the capture script rendering each screen and writing the bundle.</figcaption>
</figure>

## 3. Check the bundle

Check the bundle before you send anything. Run the upload command with the dry-run flag. It validates the bundle with the same validator the real upload uses, then stops. Nothing leaves your machine, and no key is needed.

```bash verify
npx @scrymore/scry-deployer upload .scry/capture --dry-run
```

```text expected
Validating .scry/capture ...
✅ Bundle valid: 6 captures, source flutter-golden:other.
Dry run: not uploading. Bundle ZIP: {{*}}
```

The source line comes from the manifest: `flutter-golden:other` is how Scry knows this is a headless Flutter capture. A bundle captured on an emulator says `flutter-golden:android`, and on a simulator `flutter-golden:ios`. A rejected bundle prints every problem with its code (see [Troubleshooting](#troubleshooting)).

::: warning A valid bundle can still be a short one
The validator accepts a bundle that is missing screens, because the manifest lists them as skipped. Check the count in `Bundle valid: N captures` against the number of screens you registered, and look at the images in `.scry/capture/images/` for a keyboard, a permission dialog, a loading spinner or boxes where text should be.
:::

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/flutter-3-check.mp4">
    <track kind="captions" src="/videos/flutter-3-check.vtt" srclang="en" default>
  </video>
  <figcaption>Step 3 — validating the bundle with --dry-run.</figcaption>
</figure>

## 4. Upload

Now upload. Set your project id and API key as environment variables, then run the same command without the dry-run flag. It validates the bundle again, stores it, and prints the build number once the upload is queued for indexing.

```bash
export SCRY_PROJECT_ID=proj_xxxxxxxx
export SCRY_API_KEY=sk_live_xxxxxxxx
```

Replace both placeholders with the values from your project. The placeholders above are not real and are rejected if you use them.

```bash verify
npx @scrymore/scry-deployer upload .scry/capture
```

```text expected
Validating .scry/capture ...
✅ Bundle valid: 6 captures, source flutter-golden:other.
Bundle stored ({{*}}, build #{{n}}).
Bundle complete: attempt 1/3, {{*}}, timeout {{n}} s...
Bundle complete: sent {{*}} in {{*}} s (attempt 1/3).
✅ Bundle uploaded (build #{{n}}).
⏳ Indexing has been queued, not finished. Components are searchable once the build shows processingStatus "completed".
```

The CLI reads `SCRY_PROJECT_ID` and `SCRY_API_KEY` itself. You can pass `--project` and `--api-key` instead, but then the key sits in your shell history, so prefer the environment.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/flutter-4-upload.mp4">
    <track kind="captions" src="/videos/flutter-4-upload.vtt" srclang="en" default>
  </video>
  <figcaption>Step 4 — uploading the bundle. The key shown is a placeholder.</figcaption>
</figure>

## 5. See it in Scry, and search it

Open your project in the dashboard. The new build appears in the **Builds** tab with the source **Flutter · Android**, **Flutter · iOS** or, for the headless path, **Flutter · Other**, and a device line: the device's name, scale and screen count. Open the build to see the screens on its **Capture** tab. A native build has no Storybook behind it, so there is no "Open in Storybook" link. The Builds tab, the source chips and the project's other capture sources are covered in [Capture sources](/guide/capture-sources).

Once the build is indexed, its screens are searchable. The recording runs the same search the MCP server runs, for `quantity stepper`. A result from this build carries its source type `flutter-golden` and its platform, and the MCP server prints a `Platform:` line such as `Flutter · Android`; when the capture recorded a source file, it also prints `Source: <file>:<line>` instead of a Storybook link. Ranking depends on what else is in your project.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/flutter-5-see-and-search.mp4">
    <track kind="captions" src="/videos/flutter-5-see-and-search.vtt" srclang="en" default>
  </video>
  <figcaption>Step 5 — the new build in the dashboard, and the same search the MCP server runs.</figcaption>
</figure>

- **Ask your assistant.** Connect the [MCP server](/guide/mcp) and ask for a screen in plain words, for example `quantity stepper`.
- **See the builds in the dashboard.** The **Builds** tab lists each build with its source, device and screen count.
- **Link screens to designs.** Linking a native screen to a Figma frame from the Scry Link plugin is not available yet.

## Put it in CI

The sample ships two GitHub Actions workflows in `.github/workflows/`:

- **`ci.yml`** builds and tests the app on every pull request, on a GitHub-hosted runner, with no secrets.
- **`scry-capture.yml`** captures headless on an Ubuntu runner and uploads, only on a push to the default branch. Pull requests from forks never reach it, so your key is never exposed to code you did not review.

CI uses the headless path only. An emulator on a GitHub-hosted runner is slow and flaky, so capture on a device from your own machine when you want the Android or iOS look.

Add the project id as a repository **variable** and the key as a repository **secret**:

| Where | Name | Value |
| --- | --- | --- |
| Repository variable | `SCRY_PROJECT_ID` | your project ID |
| Repository secret | `SCRY_API_KEY` | your project API key |

The upload step in the workflow is the command from step 4:

```yaml
      - name: Upload to Scry
        run: npx @scrymore/scry-deployer upload .scry/capture
        env:
          SCRY_PROJECT_ID: ${{ vars.SCRY_PROJECT_ID }}
          SCRY_API_KEY: ${{ secrets.SCRY_API_KEY }}
```

## Make it your own

To turn the sample into a build in your own project, change three things:

1. **The screens list** in `integration_test/scry/screens.dart` and `scripts/screens.json`: replace the Kettle screens with yours, each with a stable `id`.
2. **The project id**: `SCRY_PROJECT_ID`.
3. **The key**: `SCRY_API_KEY`, from your project's **Settings ▸ API keys**.

To wire an existing app instead of copying the sample, use the skill (step 1). The skill adds no non-dev dependency to your app and does not change a release build: its files sit under `integration_test/`, `test/`, `test_driver/` and `scripts/`, and nothing in `lib/` is touched. It does not cover UIKit-only apps: for those, and for any tool of your own, the bundle format is documented on [Capture bundle format](/guide/capture-bundle-format).

<details>
<summary>What the skill adds, if you would rather do it by hand</summary>

The sample app is the worked example of each piece. Copy them from `scry-sample-flutter`:

| Piece | File | What it does |
| --- | --- | --- |
| Screen registry | `integration_test/scry/screens.dart` | one entry per screen: `id`, `name`, the widget with fixed data |
| Device capture | `integration_test/scry_capture_test.dart`, `test_driver/integration_test.dart` | opens each screen on an emulator or simulator and saves a PNG |
| Headless capture | `test/scry_capture_test.dart` | renders each screen with `flutter test` and fails if fonts did not load |
| Capture script | `scripts/capture.sh` | runs `android`, `ios` or `headless`, then calls the bundle writer |
| Bundle writer | `scripts/make-scf.mjs` | writes `scf.json` and `images/<id>.png` |
| CI | `.github/workflows/scry-capture.yml` | captures headless and uploads on a push to the default branch |

</details>

## Troubleshooting

**`HTTP 401 Unauthorized - Authentication required`** The upload reached Scry without an API key. The service's own message is `Missing X-API-Key header`. Check that `SCRY_API_KEY` is set in the shell that runs the upload (`test -n "$SCRY_API_KEY" && echo set || echo missing`), then run it again. In CI, check that the repository secret exists and that the workflow passes it in `env`. If the response carries a request id, the CLI prints a `Ref:` line; quote it when you contact us.

**`HTTP 401 Unauthorized - Invalid API key format`** The value is not a Scry project key. The placeholder `sk_live_xxxxxxxx` on this page produces exactly this error; copy a real key from **Settings ▸ API keys**.

**`HTTP 403 Forbidden - Project mismatch`** The key belongs to a different project than the one you uploaded to. A key only works for the project it was created in: use the key from the same project as `SCRY_PROJECT_ID`.

**`❌ --project is required to upload.`** `SCRY_PROJECT_ID` is not set and no `--project` was passed. `--dry-run` works without it; a real upload does not.

**`❌ The bundle was rejected by the Scry Capture Format validator. Nothing was uploaded.`** The lines below it name the problem and its code. Two you may meet:

```text
  error DUPLICATE_ID [menu]: Duplicate capture id (2×): menu
  error IMAGE_HEADER_UNREADABLE [menu]: Could not read image dimensions from the header: images/menu.png
```

`DUPLICATE_ID` means two entries in your screens list share an `id`: each screen needs its own. `IMAGE_HEADER_UNREADABLE` means a screenshot file is empty or cut short, which usually follows a capture that was interrupted: run `bash scripts/capture.sh` again.

**`scf: 5/6 captured, 1 skipped`.** A screen did not produce an image, so it is listed as skipped in the manifest. `upload --dry-run` still says the bundle is valid with five captures, so do not treat a short count as success. Run the capture again and read the lines above the summary for the screen's name.

**The screenshots show black blocks instead of text.** The headless script checks that fonts loaded before it writes a bundle and stops with a message about fonts instead of producing one. If you see blocks anyway, a font your app uses is not declared in `pubspec.yaml`: declare it under `flutter: fonts:` so it is loaded, then capture again.

**`flutter: command not found`.** The Flutter SDK is not on your `PATH`. Install it, add its `bin` folder to `PATH`, and check `flutter --version`.

**The build is in the Builds tab but has no screens yet.** Indexing runs after the upload: the CLI prints `Indexing has been queued, not finished` and the screens become searchable once the build is processed. Refresh the Builds tab in a minute.

**An emulator or simulator problem.** Run `flutter devices` to check that your emulator or simulator is listed, start one, and run the script again. If you cannot get a device running, use the headless path, or let the skill stop and print the exact commands for you to run instead of claiming a capture.

For problems with the Scry CLI itself, see [Troubleshooting](/guide/troubleshooting).

## Privacy and data

An upload sends the bundle and nothing else from your project: the PNG screenshots, and `scf.json`, which lists each screen's `id` and name, its device and scale, and the source `file` and `line` if you registered them (a path and a number, not the code). The upload also carries the commit SHA and branch name it is run from (read from your CI environment or the local git checkout). No widget tree and no source text is uploaded: `--include-source`, the option that would also upload each capture's source file, is off by default and this page never uses it.

The capture runs entirely on your machine, and the Scry skill never uploads without your go. The CLI reports errors to Scry's error tracker (errors only); set `SCRY_TELEMETRY=0` or `DO_NOT_TRACK=1` to turn that off.

## Feedback and support

Something broke or felt wrong? Tell us on the [feedback form](/feedback) or email <feedback@scrymore.com>. Include the `Ref:` line from the CLI if it printed one.

## Changelog

- **First version** of this page.

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
.step-shot {
  margin: 24px 0;
}
.step-shot img {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: block;
}
.step-shot figcaption {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
