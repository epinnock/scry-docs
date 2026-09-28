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
- The validator, published as [`@scrymore/scf`](https://www.npmjs.com/package/@scrymore/scf)
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

## `links.live` must be `https:`

If a capture sets `links.live` — a URL that renders it live, such as a Storybook iframe URL — it
must be an absolute `https:` URL with no credentials in it. Scry only ever embeds it as a live
preview when its origin is one your project already trusts (your project's own Storybook host);
otherwise it's shown as a link, never an iframe. A bundle with an invalid `links.live` is rejected,
because Scry may act on it automatically.

## Structure trees (optional)

A capture can point at a **structure tree** — a JSON file describing the rendered layout (bounds,
text, and whatever style information the platform exposes), shaped so its nodes can be paired with
Figma layers. It's optional and experimental: include one only if your tool already has the tree in
hand (a DOM, a React Native fiber tree, an accessibility tree); skip it otherwise. See `scf-tree/1`
in the spec for the shape.

## Ids must stay stable — and Scry tells you when they don't

Everything Scry links to a capture — a Figma link, an issue, its history — is keyed on the
capture's `id`. If a source's ids change from one build to the next (a renamed test, a different
id scheme), those links silently point at nothing.

Scry warns about this on upload: when more than 20% of a source's ids are new compared with its
previous build, the build is flagged with an id-churn warning listing which ids disappeared, so you
can tell a real rename from a broken adapter before it costs you a Figma link.

## Validate before uploading

```bash
npx @scrymore/scf validate <bundle-dir-or-zip>
```

This runs the same validator Scry runs on upload. Every problem it finds names the capture id or
file path it's about. Exit code `0` means Scry will accept the bundle; anything it accepts locally,
Scry accepts on upload too, with the same messages if it doesn't.

## Writing your own adapter

An **adapter** is any program that writes an SCF bundle. If you use a tool Scry has no built-in
support for — a different native UI framework, an E2E test runner, a design tool export — point
your coding agent at the spec repository's
[`AGENTS.md`](https://github.com/scryorg/scry-capture-format/blob/main/AGENTS.md) and ask it to
write an adapter. It's written to be a complete, self-contained brief for a coding agent: what a
bundle needs, how to pick stable ids, and three short reference adapters to copy from.
