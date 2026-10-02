# Capture sources

> **TL;DR:** A capture source is where Scry's screenshots of your UI come from — a web Storybook,
> a React Native app's on-device Storybook, or another tool that writes a
> [Scry Capture Format](/guide/capture-bundle-format) bundle. A project can hold more than one
> source at once (for example, web and iOS builds of the same design system), and search, the MCP
> server and the Figma plugin always work from each source's latest build.

## What a source is

Every build Scry indexes came from somewhere: a Storybook build, a native app, a crawl of a
running site. Scry records that as the build's **source** — a kind (`storybook`, `storybook-rn`,
…) and a platform (`web`, `ios`, `android`, …). A project's **Capture sources** are the distinct
sources it has ever uploaded a build from.

You don't set this up directly. It's recorded automatically from what each upload contains: the
existing Storybook deploy step keeps working exactly as before, and a native capture command (see
[React Native](/guide/react-native)) records its own kind and platform when it uploads.

## Storybook (web) vs native

A **Storybook** source runs stories in a browser and screenshots them with
[scry-sbcov](/guide/storybook-capture-settings) — this is what every existing Scry project already
has.

A **native** source runs the same idea on a device or simulator instead of a browser. The first
one Scry ships an adapter for is **React Native**: it reuses your app's existing on-device
Storybook and the same story ids as your web stories, so a component with stories on both
platforms is easy to tell apart in search and easy to link to the same Figma frame if you want to.

The labels you will see for native sources:

| Label | What it is | How it gets captured |
|---|---|---|
| React Native · iOS, React Native · Android | an app's on-device Storybook | built-in adapter: `scry-deployer capture rn` ([React Native](/guide/react-native)) |
| SwiftUI · iOS | the screens of a SwiftUI app | reference script in the sample app and the Scry skill, not a built-in adapter |
| Compose · Android | the screens of a Jetpack Compose app | reference script in the sample app and the Scry skill, not a built-in adapter |

SwiftUI and Compose are fed by a reference capture script (it runs the app on a simulator or emulator, screenshots each screen and writes a bundle), which lives in the sample app and in the Scry skill. Scry's CLI has no `capture swiftui` or `capture compose` command; the script writes a [Scry Capture Format](/guide/capture-bundle-format) bundle and `upload` sends it like any other.

Other tools can feed Scry the same way. Anything that writes a
[Scry Capture Format](/guide/capture-bundle-format) bundle is a capture source — see that page if
you want to point a tool Scry doesn't have a built-in adapter for.

## Live embed vs captured image

A web Storybook story can be embedded live wherever Scry shows a story today — the Figma plugin's
preview, "Open in Storybook", and the CDN view. That only works because a web Storybook has a URL
to embed.

The rule is by source, not by story: web Storybook stories are embedded live, native stories never
are. That holds even when a component exists on both platforms: its web story keeps the live embed
and its iOS or Android story shows its captured image.

A native capture has no such URL: it's a screenshot taken once, on a simulator or device, during
your build. Everywhere Scry would otherwise show a live Storybook, a native story shows its
captured image instead, along with the device it was captured on (for example, "iPhone 16 · 3×").
Nothing ever offers to open a native story "in Storybook" — it links to its source file instead,
when the capture recorded one.

## Several sources, one project

One project can hold several sources — a web build alongside an iOS build and an Android build of
the same design system, for instance. Uploading a new build from one source never hides another
source's latest build: each source keeps its own "latest build", and search, the MCP server and the
Figma plugin's story picker draw from all of them together, each result labelled with its platform.

If a source's ids change between builds (a renamed story, a different id scheme), that build's row in
the Builds list carries an id-churn warning with the ids that went missing, so links and issues
that pointed at them don't quietly go dead.

**Project settings → Capture sources** lists every source the project has, with its last build,
device (for native sources) and screen count.

## Search shows each source's latest build

Search and the MCP server search across every source's current build at once — not just the most
recently uploaded one. A result from a native source shows its platform (for example, "React
Native · iOS") and, where the capture recorded one, its source file instead of a Storybook link.
