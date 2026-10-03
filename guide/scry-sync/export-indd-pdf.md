---
title: How to export an InDesign file to PDF
description: "Scry Sync cannot read InDesign (INDD) files directly. Export a PDF into your synced folder and it syncs on its own."
---

# How to export an InDesign file to PDF

Scry Sync shows **Needs a PDF** next to an InDesign (`.indd`) file. InDesign files can only be read by InDesign, so Scry Sync works from an export instead. Export a PDF into the synced folder and it is converted and sent like any other file. Nothing else needs doing in the app.

Your `.indd` file stays where it is and is never sent.

## Export a PDF

1. In InDesign, open the document.
2. Choose **File → Export**. The menu is the same on Mac and Windows.
3. Pick the synced folder as the location. Subfolders work too.
4. Set **Format** (Mac) or **Save as type** (Windows) to **Adobe PDF (Print)**, and click **Save**.
5. In the **Export Adobe PDF** dialog, choose a preset such as **High Quality Print** or **Smallest File Size**. In the **General** tab, make sure **All** pages is selected, or give the range you want to see in Scry.
6. Click **Export**.

A minute or so after the export finishes, the PDF appears in the app's activity list and the pictures are sent. Each page becomes one picture, up to the page limit.

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

See [What gets converted](/guide/scry-sync/what-gets-converted), [Troubleshooting](/guide/scry-sync/troubleshooting), or use **Report a problem** in the app.
