# React Native

Capture your React Native app's screens and components and see them in Scry next to your web Storybook, in search, and in the MCP server. If your app has an on-device [Storybook](https://github.com/storybookjs/react-native), the Scry CLI drives it on a simulator or emulator, screenshots every story and uploads the result as a [capture source](/guide/capture-sources). React Native needs the least setup of the native paths: Scry has a built-in adapter, `capture rn`, so there is no capture script to write. This page walks through it with the sample app, [`scry-sample-rn`](https://github.com/scryorg/scry-sample-rn), a small coffee-order app called Kettle.

**No source code of yours is uploaded.** Scry receives PNG screenshots and a small manifest. The sample app also sends a layout tree per screen (component names, text and positions), never source files.

## Before you start

- [React Native Storybook](https://github.com/storybookjs/react-native) v10 or newer, configured with `websockets: 'auto'` (its default). The sample app already is. Scry drives it the same way its own dev client does: by selecting stories over its websocket channel.
- **iOS:** a Mac with Xcode and a Simulator runtime installed. `capture rn --platform ios` boots or reuses a named Simulator (`xcrun simctl`).
- **Android:** the Android SDK with an emulator (AVD), or an attached device reachable by `adb`, and JDK 17. `capture rn --platform android` boots or reuses it.
- A build of your app to install: pass `--app` with a path to a built `.app` / `.apk`, pass `--build` to build one with `expo run:<platform>`, or install it yourself first and let the CLI find it from `app.json`.
- Node 20.19+ or 22.12+, and a Scry project with a **project API key** (dashboard Settings, API keys). The examples use the placeholders `proj_xxxxxxxx` and `sk_live_xxxxxxxx`: they do not work, so replace them with your own and never commit a real key.

## 1. Get the sample app

Clone the Scry sample app, scry-sample-rn, a small coffee-order app called Kettle. Run npm install, then npm run android, or npm run ios on a Mac. The app opens on the Kettle Menu screen. The same code holds 21 Storybook stories, and those are what Scry captures.

```bash verify
git clone https://github.com/scryorg/scry-sample-rn.git
cd scry-sample-rn
npm install
```

```bash
npm run android        # or: npm run ios
```

`npm install` prints a number of `npm warn ERESOLVE overriding peer dependency` lines (the React and React DOM versions in Storybook's dependencies) and a couple of deprecation warnings. They are harmless; the install ends with a line like `added 729 packages`, and the video shows only that last line. `npm run android` needs `JAVA_HOME` (JDK 17) and `ANDROID_HOME`; the first run generates the native project and runs Gradle, which takes a few minutes, then installs the app and opens it. The 21 stories are the three screens plus the Button, MenuItem and QuantityStepper components, with variants.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-1-clone-and-run.mp4">
    <track kind="captions" src="/videos/rn-1-clone-and-run.vtt" srclang="en" default>
  </video>
  <figcaption>Step 1 — cloning the sample app, installing it and running it on an emulator.</figcaption>
</figure>

## 2. Capture your screens

With the emulator booted and the app installed, run the capture rn command with the platform and device. It starts Metro in Storybook mode, opens each story, screenshots it, and writes a bundle to `.scry/capture`. It ends by reporting how many stories were captured and how many were skipped.

```bash verify
npx @scrymore/scry-deployer capture rn --platform android --device Pixel_6_API_34
```

```text expected
Capturing {{n}} stories on {{*}} ...
{{n}} of {{n}} stories captured, {{n}} skipped. Bundle: {{*}}/.scry/capture
✅ Valid SCF bundle. Upload it with: scry upload .scry/capture --project {{*}}
```

In the expected output, a placeholder in double braces stands for a number or for any text. The command first prints the device it found, then one `✓` line per story, then the summary line, which names the absolute path of the bundle directory. Capturing 21 stories took about two minutes on a software-rendered emulator, and the video shows it sped up.

On iOS, use `--platform ios --device "iPhone 16"`, and add `--app-id host.exp.Exponent --open-url exp://127.0.0.1:8081` to run the app inside Expo Go on the simulator. The bundle is written to `.scry/capture/`.

::: tip Capture only some stories
Add `--stories components-button--primary,screens-menu--default` to capture a few stories while you work, or `--out <dir>` to write the bundle somewhere else.
:::

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-2-capture.mp4">
    <track kind="captions" src="/videos/rn-2-capture.vtt" srclang="en" default>
  </video>
  <figcaption>Step 2 — capturing every story with <code>scry-deployer capture rn</code>.</figcaption>
</figure>

## 3. Check the bundle

Before uploading, check the bundle: run the upload command on `.scry/capture` with the dry-run flag. It validates the bundle and zips it locally. Nothing is sent, and no API key is needed. A good bundle prints Bundle valid with the number of captures.

```bash verify
npx @scrymore/scry-deployer upload .scry/capture --dry-run
```

```text expected
Validating .scry/capture ...
✅ Bundle valid: {{n}} captures, source storybook-rn:android.
Dry run: not uploading. Bundle ZIP: {{*}}
```

This checks the bundle against the [Scry Capture Format](/guide/capture-bundle-format). A good bundle prints `Bundle valid: 21 captures, source storybook-rn:android.` and then `Dry run: not uploading.`, followed by the path of the zip it made. Open a few images in `.scry/capture/images/` to check them by eye. If a story was skipped, the capture step printed why; fix the story rather than filtering it out.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-3-validate.mp4">
    <track kind="captions" src="/videos/rn-3-validate.vtt" srclang="en" default>
  </video>
  <figcaption>Step 3 — checking the bundle with <code>upload --dry-run</code>.</figcaption>
</figure>

## 4. Upload

Set your project id and your project API key as environment variables, then run the same upload command without the dry-run flag. Only the manifest, the screenshots and a layout tree for each screen are sent, never your source code. When the upload is accepted, the command prints the build number. The key shown here is a placeholder.

```bash
export SCRY_PROJECT_ID=proj_xxxxxxxx
export SCRY_API_KEY=sk_live_xxxxxxxx
```

```bash verify
npx @scrymore/scry-deployer upload .scry/capture
```

```text expected
Validating .scry/capture ...
✅ Bundle valid: {{n}} captures, source storybook-rn:android.
Bundle stored ({{*}}, build #{{n}}).
Bundle complete: attempt 1/3, {{*}}, timeout {{n}} s...
Bundle complete: sent {{*}} in {{*}} s (attempt 1/3).
✅ Bundle uploaded (build #{{n}}).
⏳ Indexing has been queued, not finished. Components are searchable once the build shows processingStatus "completed".
```

The layout trees are the `structure/` folder next to `scf.json` and `images/` in the bundle: component names, text and positions. Replace both placeholders with the values from your project.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-4-upload.mp4">
    <track kind="captions" src="/videos/rn-4-upload.vtt" srclang="en" default>
  </video>
  <figcaption>Step 4 — uploading the bundle to your Scry project.</figcaption>
</figure>

## 5. See it in Scry

Open your project in the Scry dashboard. On the **Builds** tab the new build carries the source chip **React Native · Android** and a device line, for example *Pixel 6 · 2.63× · 21 screens*. Open the build to see them on its **Capture** tab. If the chip is missing, refresh after a minute.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-5-dashboard.mp4">
    <track kind="captions" src="/videos/rn-5-dashboard.vtt" srclang="en" default>
  </video>
  <figcaption>Step 5 — the build in the dashboard, with its source chip, device line and Capture tab.</figcaption>
</figure>

Native stories show their captured image instead of a live Storybook where Scry embeds one, as described in [Capture sources](/guide/capture-sources#live-embed-vs-captured-image).

## Use it

Search runs across every source in the project together, so a native capture is found alongside its web Storybook story, and the search API labels each result with its source type and platform. Ask for a screen through the [MCP server](/guide/mcp). See [Capture sources](/guide/capture-sources).

## Put it in CI

Next to your existing Storybook deploy step, on a runner that has the emulator or simulator:

```bash
# SCRY_API_KEY comes from your CI secret store, not the command line
npx @scrymore/scry-deployer capture rn --platform ios --device "iPhone 16"
npx @scrymore/scry-deployer upload .scry/capture --project <id>
```

Use `--platform android --device <AVD name or adb serial>` for an Android build. Run one or both, in the same job or separate jobs: each is its own capture source (`React Native · iOS` and `React Native · Android` are tracked and searched separately, per [Capture sources](/guide/capture-sources)).

The sample app ships a ready workflow, `.github/workflows/scry-capture.yml`, which captures on an Android emulator and uploads. It runs only on a push to the default branch, never on a pull request, so a fork's pull request can never reach your key. Add a repository variable `SCRY_PROJECT_ID` and a secret `SCRY_API_KEY` and it starts working; until then it is skipped. Keep pull request jobs on hosted runners with no secrets, and never use `pull_request_target` for a job that captures or uploads. The sample's `scripts/check-workflows.sh` checks those rules.

## Make it your own

**Start from the sample.** Change the app id in `app.json`, replace or add stories under `src/`, and set your project id and API key.

**Set up your own app.** If you already have a React Native app, the easiest path is the Scry skill: install it (see [Set up Scry with your AI assistant](/guide/skill)), then ask your assistant "set up Scry capture for this app". It checks for on-device Storybook and adds the capture mode and test ids the sample has. If a simulator or emulator is available where the assistant runs, it runs `capture rn` and `upload --dry-run` and shows you the screenshots; otherwise it lists the commands for you to run. It stops before uploading. To do it by hand, copy `src/capture.ts` and `.rnstorybook/preview.tsx` from the sample and give each story root `testID="scry-root"`. The sample's `scripts/make-bare.sh <dest>` writes the same app without any Scry setup if you want to try this on a clean copy.

## What the command does

`capture rn`:

1. Starts Metro with `STORYBOOK_ENABLED=true` (skipped if a Storybook websocket channel is already listening on port 7007, so you can point it at a server you already started).
2. Boots or finds the simulator or emulator, installs the app, and launches it.
3. Reads the story list from the running app's own `/index.json`, the same list your web Storybook uses, and selects each story in turn over the websocket channel.
4. Waits for the screen to settle (two identical frames, or a 10-second timeout; a story that times out is recorded as skipped, not silently dropped) and takes the screenshot.
5. Crops to the view carrying `testID="scry-root"`, when your Storybook decorator sets one.
6. Writes the result as a [Scry Capture Format](/guide/capture-bundle-format) bundle to `.scry/capture` (change with `--out`).

## Determinism

Before capturing, the CLI fixes the parts of the screen that would otherwise vary between runs:

- **Status bar.** iOS: 9:41 with a full battery, no other indicators. Android: system UI demo mode (also 9:41, full battery, no notifications).
- **Animations off**, so a screenshot never lands mid-transition.

Both are undone when the capture finishes, so your simulator or emulator is left as it was.

### The Dynamic Island and other hardware overlays

A simulator screenshot includes the hardware overlays: the Dynamic Island, the notch, the status bar. `capture rn` crops to your story's `scry-root` view but never hides or moves an overlay, so a component that renders at the very top of the screen is captured with the island painted over it.

On iOS the CLI checks for this. It reads the story root's position and, when it starts inside the device's top unsafe area (about 59 pt on an iPhone 15 or 16), prints a warning for that story and records `"x-scry": { "captureWarnings": ["overlaps_top_unsafe_area"] }` on its capture. The capture is still taken and still uploaded; the warning is there so you can fix the story rather than find the overlay in a diff.

To fix it, wrap your stories in a `SafeAreaView` decorator (from `react-native-safe-area-context`) in `.rnstorybook/preview.tsx`, so components render below the island:

```tsx
decorators: [
  (Story) => (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']}><Story /></SafeAreaView>
    </SafeAreaProvider>
  ),
],
```

If your device isn't in the CLI's table of unsafe-area heights, or you want a stricter check, pass `--safe-area-inset <points>` to `capture rn`. It only changes the height the check uses; it doesn't crop or move anything. The check needs Scry's dev-only probe in your app (see below), since the story's position comes from it.

## Structure trees (optional)

If your app includes Scry's small, dev-only probe (the [sample app](https://github.com/scryorg/scry-sample-rn) shows how, in `.rnstorybook/scryProbe.tsx`), each story also gets a structure tree of the React Native view hierarchy. It's a development-only addition that never ships in your release build. Without the probe the capture still works; it just has no tree and no overlay check. See [Capture bundle format](/guide/capture-bundle-format#structure-trees-and-source-text-both-opt-in).

## What gets uploaded

Each story becomes one image plus an entry in the bundle's manifest recording the platform, device, capture scale and where the story is defined in your code, the same fields a web Storybook capture records. **No source code is included.**

## Troubleshooting

**`No Android device is connected and no --device (AVD name) was given.`** Boot an emulator first, or pass `--device <AVD name or adb serial>`. List your AVDs with `emulator -list-avds`.

**`No available simulator named "iPhone 16"`.** `--device` must match a name in `xcrun simctl list devices`. `capture rn --platform ios` also needs macOS with Xcode.

**`<app id> is not installed on <device>.`** Install the app first (`npm run android` or `npm run ios`), or pass `--app <path to .apk/.app>` or `--build`.

**Some stories are skipped.** Each skipped story is printed with its reason, for example `skipped (timeout: the story did not render within 10 s)`. Fix the story, or raise the per-story budget with `--settle-timeout <ms>`.

**`Nothing was captured.`** The command exits with an error and uploads nothing. Check that Storybook mode is on (the app should show stories, not the plain Menu) and that `adb reverse tcp:8081 tcp:8081` and `tcp:7007` are set on Android.

**`Missing X-API-Key header` (401) or `Project mismatch` (403).** The key is missing, or it belongs to a different project than `SCRY_PROJECT_ID`. Check both variables; see [Authentication](/api/authentication). If an upload is rejected, quote the `Ref:` id it prints when you [contact us](/feedback).

**The build shows no source chip.** The build is still being indexed; refresh after a minute.

## Privacy and data

Capture runs on your machine or your CI runner. The upload sends the PNG screenshots, `scf.json` (platform, device, capture scale, story ids and titles, and where each story is defined in your code), and, if your app includes the dev-only probe, a layout tree per screen. No source text is sent. The sample app adds no analytics.

## Feedback and support

Something broke or felt wrong? Tell us on the [feedback form](/feedback) or email <feedback@scrymore.com>.

## Changelog

- **Native how-to rewrite** — this page now follows the same five steps as the other native guides, with a video for each step, the sample app's ready CI workflow, and a bare variant for trying capture setup on a clean copy.
- **Earlier** — `capture rn` for iOS and Android, structure trees, the top-of-screen overlay check.

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
