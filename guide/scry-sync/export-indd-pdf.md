---
title: How to export an InDesign file to PDF
description: "Scry Sync cannot read InDesign (INDD) files directly. Export a PDF into your synced folder and it syncs on its own."
---

# How to export an InDesign file to PDF

Scry Sync shows **Needs a PDF** next to an InDesign (`.indd`) file. InDesign files can only be read by InDesign, so Scry Sync works from an export instead. Export a PDF into the synced folder and it is converted and sent like any other file. Nothing else needs doing in the app.

Your `.indd` file stays where it is and is never sent.

To find the folder, open the Scry Sync menu (the Scry Sync icon in the menu bar on Mac) and choose **Show in folder** on the card that says your `.indd` file **needs a PDF**. On Mac it opens the folder in Finder with the `.indd` file selected.

## Export a PDF

1. In InDesign, open the document.
2. Choose **File → Export**. The menu is the same on Mac and Windows.
3. Pick the synced folder as the location. Subfolders work too.
4. Set **Format** (Mac) or **Save as type** (Windows) to **Adobe PDF (Print)**, and click **Save**.
5. In the **Export Adobe PDF** dialog, choose a preset such as **High Quality Print** or **Smallest File Size**. In the **General** tab, make sure **All** pages is selected, or give the range you want to see in Scry.
6. Click **Export**.

While you export, the Scry Sync menu says **Changes are waiting.** About a minute after the folder goes quiet, the PDF shows up under **Recent** as **Converted and sent**. Each page becomes one picture, up to the page limit.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/indd-1-needs-pdf-win.mp4">
    <track kind="captions" src="/videos/indd-1-needs-pdf-win.vtt" srclang="en" default>
  </video>
  <figcaption>The Needs a PDF row, then a PDF arriving in the synced folder. The recording computer has no InDesign, so the PDF is copied into the folder instead of exported, and the minute-long waits are shortened.</figcaption>
</figure>

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/indd-1-needs-pdf-mac.mp4">
    <track kind="captions" src="/videos/indd-1-needs-pdf-mac.vtt" srclang="en" default>
  </video>
  <figcaption>On Mac: the Needs a PDF card in the Scry Sync menu, Show in folder opening the synced folder in Finder, then a PDF arriving there and being converted and sent. The recording Mac has no InDesign, so the PDF is copied into the folder instead of exported, and the minute-long wait is cut.</figcaption>
</figure>

::: tip The row stays
The `.indd` file itself keeps showing **Needs a PDF**, because Scry Sync still cannot read it. That is expected. The exported PDF is what appears in Scry. When you export again over the same PDF, its pictures replace the old ones.
:::

## Export a PNG instead

For a single page, **File → Export**, then choose **PNG** (or **JPEG**) as the format, and pick the synced folder. This gives an exact picture of one page with no fonts to worry about.

## Make the picture accurate

- **Embed your fonts.** A PDF whose fonts are not embedded is sent with an **approximate** badge, because text is drawn with a stand-in font. Most InDesign presets embed fonts; export again if you see the badge.
- **Use RGB for screens.** A PDF in CMYK without a colour profile is sent with an **approximate** badge, because its colours are close but not exact.
- **Keep it under 200 inches.** A page larger than 200 inches on a side is drawn small.

## Still stuck?

See [What gets converted](/guide/scry-sync/what-gets-converted), [Troubleshooting](/guide/scry-sync/troubleshooting), or use **Send feedback** in the app's Settings.

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
