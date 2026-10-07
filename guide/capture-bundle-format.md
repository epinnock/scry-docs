# Capture bundle format

> **TL;DR:** Every build Scry indexes — Storybook or otherwise — is a **Scry Capture Format (SCF)**
> bundle under the hood: a manifest plus images. It's a public, versioned spec, so any tool can
> write one. This page is a summary; the spec itself is the source of truth.

## The spec is the source of truth

Scry Capture Format (SCF) is documented in its own public repository:
[github.com/scryorg/scry-capture-format](https://github.com/scryorg/scry-capture-format). If
anything here and the spec disagree, the spec wins. It has:

- The full spec (`spec/scf-1.0.md`)
- A JSON Schema
- The validator (`@scrymore/scf`, not published to npm yet: use `upload --dry-run`, see [Validate before uploading](#validate-before-uploading))
- Conformance fixtures and reference adapters

You never need to read the spec to use Scry with Storybook or React Native — the deployer CLI
writes and validates the bundle for you (see [React Native](/guide/react-native) and
[CLI commands](/cli/commands)). Read this page and the spec if you want another tool to feed Scry
directly.

## A bundle, briefly

A directory (or a `.zip` of one) with a manifest, `scf.json`, at the root, and image files under
`images/`. Everything else is optional:

```json
{
  "scf": "1.0",
  "source": { "kind": "storybook-rn", "platform": "ios" },
  "captures": [
    {
      "id": "Components/Button--Primary",
      "image": "images/button-primary.png",
      "title": ["Components", "Button"],
      "name": "Primary",
      "code": { "file": "src/components/Button.stories.tsx", "line": 12 },
      "capture": { "scale": 3, "crop": "root" }
    }
  ]
}
```

Only two things are required on a capture: an `id` (any unique string) and an `image` (the path to
its screenshot). Everything else — where it's defined, what device captured it, how it should be
cropped — makes Scry's map of your UI richer, but nothing breaks without it.

**Ids are never sanitised.** Write them exactly as your tool names the thing being captured — a
story id, a fully-qualified class name, a route. Scry derives its own storage keys by hashing, so
there's nothing for an adapter to escape or slugify.

## Source kinds for native apps

`source.kind` says what produced the bundle and `source.platform` where it ran. These are the values the Scry samples and skill write for native apps; the label is what you see in the dashboard.

| `source.kind` | `source.platform` | `capture.method` | Label | Written by |
| --- | --- | --- | --- | --- |
| `storybook-rn` | `ios`, `android` | `simulator`, `emulator` | React Native · iOS, React Native · Android | `scry capture rn` ([React Native](/guide/react-native)) |
| `swiftui-preview` | `ios` | `simulator` | SwiftUI · iOS | the reference script ([iOS (SwiftUI)](/guide/ios-swiftui)) |
| `compose-preview` | `android` | `emulator` | Compose · Android | the reference script ([Android (Compose)](/guide/android-compose)) |
| `flutter-golden` | `android`, `ios` | `emulator`, `simulator` | Flutter · Android, Flutter · iOS | the reference script, on a device ([Flutter](/guide/flutter)) |
| `flutter-golden` | `other` | `headless-render` | Flutter · Other | the reference script, with no device ([Flutter](/guide/flutter)) |

## `links.live` must be `https:`

If a capture sets `links.live` — a URL that renders it live, such as a Storybook iframe URL — it
must be an absolute `https:` URL with no credentials in it. Scry only ever embeds it as a live
preview when its origin is one your project already trusts (your project's own Storybook host);
otherwise it's shown as a link, never an iframe. A bundle with an invalid `links.live` is rejected,
because Scry may act on it automatically.

## Structure trees and source text (both opt-in)

A capture can point at a **structure tree** — a JSON file under `structure/` describing the
rendered layout (bounds, text, and whatever style information the platform exposes), shaped so its
nodes can be paired with Figma layers. It's optional and experimental: include one only if your
tool already has the tree in hand (a DOM, a React Native fiber tree, an accessibility tree); skip
it otherwise. See `scf-tree/1` in the spec for the shape. When a capture has a tree, Scry hands it
to the visual diff alongside the screenshot, which finds more of the differences a person would
flag; captures without one are diffed on the image alone, exactly as before.

A capture can also carry the **source text** of the component it shows (under `source/`). This is
off unless the person uploading asks for it: the deployer copies source files into the bundle only
when you pass `--include-source`, and drops any that were already in the bundle otherwise. When
present, source text is used the same way as a structure tree, as extra context for the diff.

Both kinds of file are checked as they are read: a `structure` path that isn't a `.json` file
under `structure/`, or a file that doesn't parse as `scf-tree/1`, is rejected rather than ignored.
A tree over 2 MB draws a `STRUCTURE_TREE_LARGE` warning; over 10 MB is an error.

## Warnings your adapter can leave on a capture

Vendor data lives under an `x-<vendor>` key and Scry preserves it. Scry's own deployer uses
`x-scry` on a capture to record capture-time warnings, for example
`"x-scry": { "captureWarnings": ["overlaps_top_unsafe_area"] }` when a React Native story was
captured with the iOS Dynamic Island painted over it (see
[React Native](/guide/react-native#the-dynamic-island-and-other-hardware-overlays)). Warnings are
information only: they never stop a bundle from being accepted, and an adapter of your own can
add its own under its own `x-<name>` key.

## Tags and fields in a bundle

A capture can carry tags and custom fields. Scry reads them, shows them on the [story page](/guide/story-page), and lets you filter [search](/guide/dashboard-search#filter-by-tag) by tag. For how Storybook builds produce them, see [Tags and custom fields](/guide/tags-and-custom-fields).

```json
{
  "id": "Checkout/PaymentForm--WithError",
  "image": "images/payment-form-with-error.png",
  "tags": ["checkout", "needs-review"],
  "x-scry-fields": { "owner": "Payments", "priority": 2, "reviewed": false, "platforms": ["web", "ios"] }
}
```

- **`tags`** is a list of strings, part of the spec. Keep them stable from build to build.
- **`x-scry-fields`** is a vendor key (see the section above) that Scry reads. It is an object of named values. A value can be a string, a number, a true or false value, or a list of strings.

Scry does not reject a bundle because of its tags or fields. It keeps what fits the limits and **drops, never cuts, what does not**, then counts the drops for the build:

| What | Limit |
| --- | --- |
| Tags per capture | 100, each 1 to 64 characters |
| Fields per capture | 50, in all about 8 KB |
| Field name | Starts with a letter, then letters, digits, spaces, `_` or `-`, up to 64 characters |
| A text value | Up to 500 characters; a blank one is dropped |
| A list value | Up to 20 strings; an empty one is dropped |

Control characters, zero-width characters and text-direction marks are removed from tags, and control and text-hiding characters from text values. Everything else is stored as you wrote it. Tags and fields on a public project are visible to anyone who can see the project.

::: info Other `x-<vendor>` data is still just preserved
Scry reads `x-scry-fields` and nothing else under `x-scry`. Any other vendor key is still kept as it is and never interpreted.
:::

A bundle's tags and fields are read when the bundle is first indexed. To change them, upload the bundle again as a new build; an SCF build cannot be re-indexed in place.

## Ids must stay stable — and Scry tells you when they don't

Everything Scry links to a capture — a Figma link, an issue, its history — is keyed on the
capture's `id`. If a source's ids change from one build to the next (a renamed test, a different
id scheme), those links silently point at nothing.

Scry warns about this on upload: when more than 20% of a source's ids are new compared with its
previous build, the build is flagged with an id-churn warning, shown on that build's row in the
project's Builds list with the percentage of new ids and the first 20 ids that disappeared (then
"+N more"). That lets you tell a real rename from a broken adapter before it costs you a Figma
link. The warning never blocks the build from being indexed.

## Validate before uploading

```bash
npx @scrymore/scry-deployer upload <bundle-dir-or-zip> --dry-run
```

This runs the same validator Scry runs on upload, then zips the bundle locally and stops: nothing is sent and no API key is needed. Every problem it finds names the capture id or file path it's about. A good bundle ends with `Bundle valid: <n> captures, source <kind>:<platform>.`; anything it accepts locally, Scry accepts on upload too, with the same messages if it doesn't.

::: info The standalone validator is not published yet
The spec repository's validator, `@scrymore/scf`, is not on npm yet, so `upload --dry-run` is the way to validate a bundle for now. Once it is published, you will also be able to run the same check without the deployer.
:::

The validator enforces every fixed set of values in the schema, not just the required fields. A
value outside its set — a `source.platform`, `capture.method`, `capture.crop`, `kind`,
`structure.origin` or `structure.format` it doesn't know (`source.kind` is the one that also accepts your own
`x-<name>`) — is rejected with `ENUM_VALUE_INVALID`, which names the capture and the field, instead of being accepted and
misfiled later. An image whose header is cut off is `IMAGE_HEADER_UNREADABLE` both locally and on
upload.

Two more codes you may meet when a bundle folder holds more than the manifest names: `STRUCTURE_PATH_INVALID` (a capture's `structure.file` is not a `.json` path under `structure/`; fix the path or drop the `structure` entry) and `FORBIDDEN_MEMBER` (a file in the bundle that no capture refers to, such as a stray `structure/evil.html`; delete it). They usually appear together: `error FORBIDDEN_MEMBER [structure/evil.html]: Bundle member is not referenced by any capture: structure/evil.html`.

## Writing your own adapter

An **adapter** is any program that writes an SCF bundle. If you use a tool Scry has no built-in
support for — a different native UI framework, an E2E test runner, a design tool export — point
your coding agent at the spec repository's
[`AGENTS.md`](https://github.com/scryorg/scry-capture-format/blob/stage/AGENTS.md) and ask it to
write an adapter. It's written to be a complete, self-contained brief for a coding agent: what a
bundle needs, how to pick stable ids, and three short reference adapters to copy from.
