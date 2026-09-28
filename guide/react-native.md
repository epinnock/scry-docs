# React Native

> **TL;DR:** Add two lines next to your existing Storybook deploy step to capture your React
> Native app's on-device Storybook and upload it as a [capture source](/guide/capture-sources). No
> app code changes — the CLI enables Storybook with an environment variable, drives a simulator or
> emulator, and screenshots every story.

## Requirements

- [React Native Storybook](https://github.com/storybookjs/react-native) v10 or newer, configured
  with `websockets: 'auto'` (its default). Scry drives it the same way its own dev client does: by
  selecting stories over its websocket channel.
- **iOS:** a Mac with Xcode and a Simulator runtime installed. `capture rn --platform ios` boots or
  reuses a named Simulator (`xcrun simctl`).
- **Android:** the Android SDK with an emulator (AVD) or an attached device reachable by `adb`.
  `capture rn --platform android` boots or reuses it.
- A build of your app to install: pass `--app` with a path to a built `.app` / `.apk`, pass
  `--build` to build one with `expo run:<platform>`, or install it yourself first and let the CLI
  find it from `app.json`.

## Add it to your CI

Next to your existing Storybook deploy step:

```bash
npx @scrymore/scry-deployer capture rn --platform ios --device "iPhone 16"
npx @scrymore/scry-deployer upload .scry/capture --project <id> --api-key <key>
```

Use `--platform android --device <AVD name or adb serial>` for an Android build. Run one or both,
in the same job or separate jobs — each is its own capture source (`React Native · iOS` and
`React Native · Android` are tracked and searched separately, per
[Capture sources](/guide/capture-sources)).

## What the command does

`capture rn`:

1. Starts Metro with `STORYBOOK_ENABLED=true` (skipped if a Storybook websocket channel is already
   listening on port 7007, so you can point it at a server you already started).
2. Boots or finds the simulator or emulator, installs the app, and launches it.
3. Reads the story list from the running app's own `/index.json` — the same list your web Storybook
   uses — and selects each story in turn over the websocket channel.
4. Waits for the screen to settle (two identical frames, or a 10-second timeout — a story that
   times out is recorded as skipped, not silently dropped) and takes the screenshot.
5. Crops to the view carrying `testID="scry-root"`, when your Storybook decorator sets one.
6. Writes the result as a [Scry Capture Format](/guide/capture-bundle-format) bundle to
   `.scry/capture` (change with `--out`).

## Determinism

Before capturing, the CLI fixes the parts of the screen that would otherwise vary between runs:

- **Status bar.** iOS: 9:41 with a full battery, no other indicators. Android: system UI demo mode
  (also 9:41, full battery, no notifications).
- **Animations off**, so a screenshot never lands mid-transition.

Both are undone when the capture finishes, so your simulator or emulator is left as it was.

## What gets uploaded

Each story becomes one image plus an entry in the bundle's manifest recording the platform, device,
capture scale and where the story is defined in your code — the same fields a web Storybook
capture records. By default, **no source code is included.**

## Including source text (`--include-source`)

Pass `--include-source` on the `upload` step to also copy each captured component's file into the
bundle:

```bash
npx @scrymore/scry-deployer upload .scry/capture --project <id> --api-key <key> --include-source
```

Without it, no source file ever leaves your CI. The CLI prints how many components' source text it
included when the flag is set, so it's visible in your build log either way.

## Next steps

- Read [Capture sources](/guide/capture-sources) for how native and web builds show up together in
  search and the Figma plugin.
- Read [Capture bundle format](/guide/capture-bundle-format) if you want to point another tool
  (not React Native) at Scry.
