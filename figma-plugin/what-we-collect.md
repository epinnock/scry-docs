---
title: What Scry Link collects
description: Exactly what the Scry Link Figma plugin sends, stores in your file, and keeps on your device, and how to turn usage data off.
editLink: false
---

::: danger Draft — not yet reviewed
This page is a draft. It has not been reviewed by a lawyer or approved by Scrymore, and it describes the analytics release before it ships. Items marked **TO CONFIRM** still need to be checked.
:::

# What Scry Link collects

This page lists everything the Scry Link Figma plugin sends, what it stores in your Figma file, and what it keeps on your device. The [privacy policy](/privacy) covers the rest of Scry.

**In short:** the plugin sends anonymous usage events and error reports so we can fix problems and see which features are used. They never include layer names, text, file names or designs. You can turn them off in **Settings → Privacy**.

## Who the plugin talks to

| Destination | When | What |
|---|---|---|
| **Your Storybook** (the URL you enter) | Always | Reads `index.json` and loads story previews. Nothing goes through Scry, so a local or internal Storybook stays on your network. |
| **Scrymore** (dashboard.scrymore.com) | Only when you're signed in and use a feature | Sign-in, your project list, Suggest links, sync and component requests. See [Signed-in features](#signed-in-features). |
| **Scrymore, for usage events** (dashboard.scrymore.com/ingest, passed on to PostHog) | Unless you turn it off | Anonymous usage events, listed below |
| **Sentry** | Unless you turn it off | Error reports, scrubbed, described below |

## Usage events

Each event has a name, a few properties that are counts or fixed categories, and these details on every event: which surface sent it (`plugin`), the plugin version, stage or production, and the Figma editor type (Figma or Dev Mode). Signed-in events also carry your opaque Scry project and organisation ids.

| Event | When it's sent | Properties |
|---|---|---|
| `plugin_opened` | You open the plugin | first open (yes/no), signed in (yes/no), has a Storybook (yes/no), Storybook kind (`scry_hosted`, `external` or `none`), days since first open |
| `plugin_signed_in` | A sign-in finishes | result (`approved`, `expired`, `timed_out`, `error` or `cancelled`), how long it took, whether the pop-up was blocked |
| `plugin_story_linked` | You link a layer to a story | method (`manual`, `suggest` or `suggest_bulk`), layer type (component, component set, instance or frame), whether it replaced a link, how many instances inherit it (0, 1–5, 6–50 or 50+), match confidence for suggestions, Storybook kind |
| `plugin_unlinked` | You remove a link | layer type |
| `plugin_suggest_scanned` | A Suggest links scan finishes | scope (selection, page or file), number of candidates, high/medium/unmatched counts, whether visual matching ran, duration |
| `plugin_sync_run` | A sync finishes | trigger (after linking, manual or from suggestions), result, error kind (`http_4xx`, `http_5xx`, `network` or `export_failed`), duration, size range |
| `plugin_diff_opened` | You open a comparison | where from (compare view or dashboard link), confidence |
| `plugin_component_requested` | You request a component | result (`created`, `failed`, needs sign-in, needs a repository), whether it was a retry |
| `plugin_error_shown` | The plugin shows you an error | area (`auth`, `connect`, `sync`, `suggest`, `request` or `preview`), error kind, the Sentry report id if there is one. Not the error text. |
| `plugin_settings_opt_out` / `plugin_settings_opt_in` | You turn usage data off or on | where (Settings or the first-run notice) |

### Never sent in events

- Figma file keys or file names
- Page, frame or layer names, or any text from your designs
- Story ids, titles or names
- Your Storybook's URL (only whether it's hosted by Scry, external, or none)
- Your name or email address
- Screenshots, images or designs

The plugin does not record its screen and does not track clicks automatically.

### How you're identified

- **Signed out:** by a one-way hash of your Figma user id (`fig_` followed by 32 characters). The hash is worked out inside the plugin, so your Figma id itself is never sent. The same Figma account gives the same hash on any computer.
- **Signed in:** by your Scry account id. When you sign in, your earlier anonymous events are joined to that id, so we can see a first open turn into a first sync.
- **After you sign out:** events go back to the hashed id, but PostHog keeps counting them for the last account you signed in with.

We don't send your name or email address to PostHog.

## Error reports

When something fails, the plugin sends Sentry the error type, a scrubbed message, the stack trace, the plugin version and which part of the plugin failed. Before a report leaves the plugin:

- anything in quotes is replaced with `"<redacted>"`, which is how layer and story names appear in messages;
- Figma file links and Scry tokens are removed;
- your Storybook's host is replaced with `storybook-host`;
- no user, request or extra data is attached, and console output and clicks are not recorded.

Network failures against your own Storybook are counted as `plugin_error_shown` events, not sent as error reports.

## Turning it off

One switch covers both usage events and error reports: **Settings → Privacy → Share anonymous usage data and error reports**. You'll also see a one-time notice with a **Turn off** button the first time you open a version that includes analytics.

When it's off:

- the last event sent is `plugin_settings_opt_out`, and then nothing more;
- the plugin checks your choice before it starts, so on later opens it sends nothing, not even `plugin_opened`;
- Scry Link works exactly the same.

## Signed-in features

These send data to Scrymore only when you use them.

- **Sync:** a rendered image of the linked layer, plus what we need to pair it with its story: the layer's name, node id and size, its page and file names, the file key when Figma provides it (otherwise an id the plugin generates for the file), any Dev Mode links on the layer, and the story's id, title, name and Storybook URL. It's stored in your Scry project.
- **Suggest links:** small thumbnails (up to 320 px wide) of the layers being matched. They are used to search your project and are not stored.
- **Component requests:** the component's name, a preview image and your notes. If your project has a GitHub repository connected, they become a GitHub issue there.

## Stored in your Figma file

Links live in the file as shared plugin data, so everyone with access to the file can see them:

- on each linked layer: the story it links to (id, title, name, Storybook URL) and the display name of the person who linked it, and when;
- on a layer with a component request: the request id, issue number and link, repository, title, requester name and date.

Your sign-in token is never stored in the file.

## Stored on your device

In Figma's plugin storage for your account: your Storybook settings, your sign-in token and Scry account id, when you first opened the plugin, whether you've seen the notices, and your usage-data choice.

## Who receives it

- **PostHog** (US), for usage events. The plugin sends them through our own address, dashboard.scrymore.com/ingest, which passes them to PostHog.
- **Sentry** (US), for error reports.
- **Scrymore's own services** and their [subprocessors](/subprocessors), for signed-in features.

## Figma Community listing text

> **Privacy.** Scry Link sends anonymous usage events (for example, "a layer was linked") and error reports to Scrymore, using PostHog and Sentry. It never sends layer names, text, file names or designs. Turn it off in Settings → Privacy. Signed in, it also sends the frames you choose to sync. Details: https://docs.scrymore.com/figma-plugin/what-we-collect · Privacy policy: https://docs.scrymore.com/privacy
