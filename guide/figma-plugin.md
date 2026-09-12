# Figma Plugin (Scry - Storybook Linker)

[Scry - Storybook Linker](https://www.figma.com/community/plugin/1602918953997015259) links layers in a Figma file to stories in any hosted Storybook. Every linked layer gets a **View Story** relaunch button that opens the live story, and links live in the Figma file, so everyone editing it sees them. **Suggest links** scans a selection, a page or the whole file and proposes a story per layer, which you accept one at a time or in bulk.

**No account is needed for linking.** Connecting, browsing, linking and Suggest links all work signed out; a free Scrymore account adds visual matching, screenshot sync and diffs.

## Install and connect

1. Run the plugin from the [Community listing](https://www.figma.com/community/plugin/1602918953997015259), or in an open file: **Plugins → Scry - Storybook Linker → Run**.
2. On the **Connect your Storybook** screen, paste a Storybook URL (for example `https://storybook.example.com`) and click **+ Add Storybook**. The plugin fetches `<your-url>/index.json` to list the stories.
3. The URL is stored on the document, so collaborators opening that file are already connected. **Settings → Change Storybook** disconnects it; links stay on the layers.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/step-1-run-scry.mp4"></video>
  <figcaption>Step 1 — running the plugin in an open Figma file.</figcaption>
</figure>

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/step-2-connect-storybook.mp4"></video>
  <figcaption>Step 2 — pasting a Storybook URL on the <strong>Connect your Storybook</strong> screen.</figcaption>
</figure>

### Sign in with Scrymore

The connect screen also offers **Sign in with Scrymore**, a device-code flow: the plugin shows a one-time code and opens your browser, you approve it there, and the plugin picks the session up. Then choose a project — its Storybook is already configured, so there is no URL to paste.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/signin-1-start.mp4"></video>
  <figcaption>Starting the flow — the plugin shows a one-time code and opens your browser.</figcaption>
</figure>

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/signin-2-approve.mp4"></video>
  <figcaption>Approving the code in the browser; the plugin picks the session up on its own.</figcaption>
</figure>

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/signin-3-project.mp4"></video>
  <figcaption>Choosing a project — its Storybook is already configured, so there is no URL to paste.</figcaption>
</figure>

Signing in adds:

- Visual matching in Suggest links (layers matched against story screenshots, not only names)
- Screenshot sync: the Figma render of a linked layer is uploaded to the project
- Side-by-side and overlay diffs, and **View diff in Scrymore** on a synced pair
- Previews of private Scrymore-hosted Storybooks inside the plugin
- A Dev Mode resource on linked layers, once the project is connected to Figma in the dashboard

## Link a layer

Select a single component, component set, instance or frame, find its story in the list, and click **Link**. Instances inherit their main component's link, so linking a component covers everything placed from it.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/step-3-link-a-layer.mp4"></video>
  <figcaption>Step 3 — selecting a layer and linking it to its story.</figcaption>
</figure>

A linked layer shows the story, an embedded preview, **Open in Browser**, **Change story** (relink without unlinking) and **Unlink**. Figma also adds the **View Story** relaunch button to the layer, so anyone can reach the live story without opening the plugin.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/step-4-open-live-story.mp4"></video>
  <figcaption>Step 4 — opening the live story from the <strong>View Story</strong> relaunch button.</figcaption>
</figure>

Links are stored with Figma's `sharedPluginData` API (namespace `scry_storybook_linker`): the Storybook URL on the file, the story link on each node. It is part of the file, so collaborators see it and it survives duplication.

If the preview shows **Preview blocked**, that Storybook refuses to be framed (`X-Frame-Options`); use **Open in Browser**.

## Suggest links

Open **Suggest links** and pick a scope: **Selection**, **This page** or **Whole file**. The scan reads only the open file and uses no Figma API quota. It collects component-set variants, standalone components and screen-sized top-level frames, skipping instances, hidden layers, names starting with `_` or `iOS/`, and anything already linked.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/suggest-1-scan.mp4"></video>
  <figcaption>Scanning — pick a scope and the plugin collects candidates from the open file.</figcaption>
</figure>

- **Signed out**, matching is by name: both sides are normalised, so `screen-04`, `Screen 04` and `screen04` are the same thing, and variant properties are compared with story names.
- **Signed in with a project selected**, the thumbnails are also matched against the project's latest build screenshots. A story's score is the better of its name and visual score, and each row shows which matcher had an opinion. If that endpoint is unreachable, the review says *Visual matching unavailable — showing name matches only*.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/suggest-2-review.mp4"></video>
  <figcaption>The review screen — each row pairs the Figma layer with its proposed story and shows which matcher had an opinion.</figcaption>
</figure>

Results are grouped into Components, Screens and a collapsed No match group, sorted by confidence. Nothing is linked until you accept it: accept rows one by one, or use **Accept _n_ high-confidence** in one click. Each accept writes the same link the manual flow writes and, when signed in with a project, syncs the Figma render.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/suggest-3-accept.mp4"></video>
  <figcaption>Accepting — one row at a time, or every high-confidence row in a single click.</figcaption>
</figure>

### Compare a pair before accepting

**Compare** on a row shows the pair two ways: **Side by side** (Figma export left, Storybook screenshot right) and **Overlay** (one box, with a Storybook opacity slider). Accept or skip moves to the next pending pair. Once a pair is linked and synced, **View diff in Scrymore ↗** opens its review in the dashboard.

## Private Storybooks

The plugin fetches `index.json` from Figma's sandbox, so a Storybook behind a login, VPN or IP allowlist cannot be connected by URL.

Private Storybooks hosted on Scrymore are different: sign in, choose the project, and listing, search and linking work normally. For the story *preview* the plugin mints a short-lived signed token that the CDN exchanges for a partitioned cookie, so the story renders in the plugin. That needs partitioned-cookie support in the host browser (Chromium, including the Figma desktop app); without it the panel says **Previews of private Storybooks open in your browser**.

## Troubleshooting

**The connection fails.** The URL must serve `index.json` — open `<your-url>/index.json` in a browser first. The failure card lists the usual causes: CORS blocked the request, the URL is wrong or unreachable, or the Storybook is down. CORS is the common one.

**"File unidentified" in the dashboard.** Figma exposes a file's key only to privately published plugins, so a synced screenshot arrives without one. Open the linked screen and paste the file's Figma URL into the **Identify file** box; Scrymore verifies it through the project's Figma connection and pairs the renders.

**Stale build.** The plugin footer reads `Scry <version> · prod`. If that is not the release you expect, close and re-run the plugin so Figma loads the current bundle.

## Privacy and data

Signed out, the plugin talks only to the Storybook URL you enter, and links never leave the Figma file. Signed in, it also talks to Scrymore for sign-in, your projects, visual matching and sync: scan thumbnails are sent for matching, and only the frames you accept or sync are uploaded as renders. The plugin never lists or exports your Figma files.

## Feedback and support

Something broke or felt wrong? Tell us on the [feedback form](/feedback) (five questions, answer the ones you have an answer for) or email <feedback@scrymore.com>.

You can also comment on the [Community listing](https://www.figma.com/community/plugin/1602918953997015259) — comments are answered within a day.

## Changelog

- **Current release** — Suggest links, private Storybook previews, project picker fixes.
- **Initial release** — connect, browse, link, View Story.

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
