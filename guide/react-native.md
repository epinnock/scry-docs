# React Native

Capture your React Native app's screens and components and see them in Scry next to your web Storybook, in search, and in the MCP server. If your app has an on-device [Storybook](https://github.com/storybookjs/react-native), the Scry CLI drives it on a simulator or emulator, screenshots every story and uploads the result as a [capture source](/guide/capture-sources). React Native needs the least setup of the native paths: Scry has a built-in adapter, `capture rn`, so there is no capture script to write. This page walks through it with the sample app, [`scry-sample-rn`](https://github.com/scryorg/scry-sample-rn), a small coffee-order app called Kettle.

**No source code of yours is uploaded.** Scry receives PNG screenshots and a small manifest. The sample app also sends a layout tree per screen (component names, text and positions), never source files, unless you pass `--include-source`, which this guide never does.

## Before you start

- [React Native Storybook](https://github.com/storybookjs/react-native) v10 or newer, configured with `websockets: 'auto'` (its default). The sample app already is. Scry drives it the same way its own dev client does: by selecting stories over its websocket channel.
- **iOS:** a Mac with Xcode and a Simulator runtime installed. `capture rn --platform ios` boots or reuses a named Simulator (`xcrun simctl`).
- **Android:** the Android SDK with an emulator (AVD), or an attached device reachable by `adb`, and JDK 17. `capture rn --platform android` boots or reuses it.
- A build of your app to install: pass `--app` with a path to a built `.app` / `.apk`, pass `--build` to build one with `expo run:<platform>`, or install it yourself first and let the CLI find it from `app.json`.
- Node 20.19+ or 22.12+, and a Scry project with a **project API key** (dashboard Settings, API keys). The examples use the placeholders `proj_xxxxxxxx` and `sk_live_xxxxxxxx`: they do not work, so replace them with your own and never commit a real key.

## 1. Get the sample app

Clone the sample, install, and run it on an emulator or simulator:

```bash verify
git clone https://github.com/scryorg/scry-sample-rn.git
cd scry-sample-rn
npm install
```

```bash
npm run android        # or: npm run ios
```

The app opens on the Kettle Menu screen. The same code also contains 21 Storybook stories <!-- TODO count --> (three screens plus the Button, MenuItem and QuantityStepper components, with variants), which is what Scry captures.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-1-clone-and-run.mp4">
    <track kind="captions" src="/videos/rn-1-clone-and-run.vtt" srclang="en" default>
  </video>
  <figcaption>Step 1 — cloning the sample app and running it on an emulator.</figcaption>
</figure>

## 2. Capture your screens

With the emulator or simulator booted and the app installed, run the capture command:

```bash verify
npx @scrymore/scry-deployer capture rn --platform android --device Pixel_6_API_34
```

On iOS, use `--platform ios --device "iPhone 16"`, and add `--app-id host.exp.Exponent --open-url exp://127.0.0.1:8081` to run the app inside Expo Go on the simulator. The command starts Metro in Storybook mode, opens each story in turn, screenshots it and writes the result to `.scry/capture/`. It finishes with a line like `21 of 21 stories captured, 0 skipped. Bundle: .scry/capture`.

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

Validate the bundle before you upload it:

```bash verify
npx @scrymore/scry-deployer upload .scry/capture --dry-run
```

```text expected
Validating .scry/capture ...
✅ Bundle valid: {{n}} captures, source storybook-rn:android.
Dry run: not uploading. Bundle ZIP: {{*}}
```

This checks the bundle against the [Scry Capture Format](/guide/capture-bundle-format) and zips it locally. Nothing is sent and no API key is needed. A good bundle ends with `Bundle valid: 21 captures, source storybook-rn:android.` <!-- TODO count --> followed by `Dry run: not uploading.` Open a few images in `.scry/capture/images/` to check them by eye. If a story was skipped, the capture step printed why; fix the story rather than filtering it out.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-3-validate.mp4">
    <track kind="captions" src="/videos/rn-3-validate.vtt" srclang="en" default>
  </video>
  <figcaption>Step 3 — checking the bundle with <code>upload --dry-run</code>.</figcaption>
</figure>

## 4. Upload

Set your project id and API key, then upload:

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
✅ Bundle uploaded (build #{{n}}).
```

The command prints the build number when the upload is accepted. Only `scf.json` and the images are sent.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-4-upload.mp4">
    <track kind="captions" src="/videos/rn-4-upload.vtt" srclang="en" default>
  </video>
  <figcaption>Step 4 — uploading the bundle to your Scry project.</figcaption>
</figure>

## 5. See it in Scry

Open your project in the Scry dashboard. On the **Builds** tab the new build carries the source chip **React Native · Android** (or **React Native · iOS**) and a device card with the device it was captured on. Open a screen to see it in the editor. If the chip is missing, the build is still being indexed; refresh after a minute. Native stories show their captured image instead of a live Storybook, as described in [Capture sources](/guide/capture-sources#live-embed-vs-captured-image).

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/rn-5-dashboard.mp4">
    <track kind="captions" src="/videos/rn-5-dashboard.vtt" srclang="en" default>
  </video>
  <figcaption>Step 5 — the build in the dashboard, with its source chip and a screen.</figcaption>
</figure>

## Use it

Search in the dashboard and the [MCP server](/guide/mcp) draw from every source's latest build together, and each React Native result is labelled with its platform, so a native capture is found alongside its web Storybook story. See [Capture sources](/guide/capture-sources).

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

**Set up your own app.** If you already have a React Native app, the easiest path is the Scry skill: install it (see [Set up Scry with your AI assistant](/guide/skill)), then ask your assistant "set up Scry capture for this app". It checks for on-device Storybook, adds the capture mode and test ids the sample has, runs `capture rn` and `upload --dry-run`, shows you the screenshots, and stops before uploading. To do it by hand, copy `src/capture.ts` and `.rnstorybook/preview.tsx` from the sample and give each story root `testID="scry-root"`. The sample's `scripts/make-bare.sh <dest>` writes the same app without any Scry setup if you want to try this on a clean copy.

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

Each story becomes one image plus an entry in the bundle's manifest recording the platform, device, capture scale and where the story is defined in your code, the same fields a web Storybook capture records. By default, **no source code is included.**

## Including source text (`--include-source`)

Pass `--include-source` on the `upload` step to also copy each captured component's file into the bundle:

```bash
npx @scrymore/scry-deployer upload .scry/capture --project <id> --include-source
```

Without it, no source file ever leaves your CI: any source text already in the bundle is dropped before upload. When the flag is set, the CLI prints how many components' source text it included, so it's visible in your build log. Source text is used as extra context for visual diffs; see [Capture bundle format](/guide/capture-bundle-format#structure-trees-and-source-text-both-opt-in).

## Troubleshooting

**`No Android device is connected and no --device (AVD name) was given.`** Boot an emulator first, or pass `--device <AVD name or adb serial>`. List your AVDs with `emulator -list-avds`.

**`No available simulator named "iPhone 16"`.** `--device` must match a name in `xcrun simctl list devices`. `capture rn --platform ios` also needs macOS with Xcode.

**`<app id> is not installed on <device>.`** Install the app first (`npm run android` or `npm run ios`), or pass `--app <path to .apk/.app>` or `--build`.

**Some stories are skipped.** Each skipped story is printed with its reason, for example `skipped (timeout: the story did not render within 10 s)`. Fix the story, or raise the per-story budget with `--settle-timeout <ms>`.

**`Nothing was captured.`** The command exits with an error and uploads nothing. Check that Storybook mode is on (the app should show stories, not the plain Menu) and that `adb reverse tcp:8081 tcp:8081` and `tcp:7007` are set on Android.

**`Missing X-API-Key header` (401) or `Project mismatch` (403).** The key is missing, or it belongs to a different project than `SCRY_PROJECT_ID`. Check both variables; see [Authentication](/api/authentication). If an upload is rejected, quote the `Ref:` id it prints when you [contact us](/feedback).

**The build shows no source chip.** The build is still being indexed; refresh after a minute.

## Privacy and data

Capture runs on your machine or your CI runner. The upload sends the PNG screenshots, `scf.json` (platform, device, capture scale, story ids and titles, and where each story is defined in your code), and, if your app includes the dev-only probe, a layout tree per screen. Source text is sent only if you pass `--include-source`. The sample app adds no analytics.

## Feedback and support

Something broke or felt wrong? Tell us on the [feedback form](/feedback) or email <feedback@scrymore.com>.

## Changelog

- **Native how-to rewrite** — this page now follows the same five steps as the other native guides, with a video for each step, the sample app's ready CI workflow, and a bare variant for trying capture setup on a clean copy.
- **Earlier** — `capture rn` for iOS and Android, structure trees, the top-of-screen overlay check, `--include-source`.

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
