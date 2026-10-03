---
title: What Scry Sync converts and what the badges mean
description: "The three verdicts Scry Sync gives every file, what approximate means, and every reason a file is not sent, with the fix for each."
---

# What gets converted and what the badges mean

Scry Sync converts files to pictures **on your computer**. Your original files are never sent. Every file in the folder ends in exactly one of three states, and none is dropped silently.

| Verdict | What happened | What you see |
|---|---|---|
| **Faithful** | The picture is a true copy of the file. | Sent, no badge. |
| **Approximate** | Sent, but the picture may not look exactly like the file. | Sent with an **approximate** badge in Scry, and a row in the app's list that says why. |
| **Not sent** | Scry Sync knows it cannot make a correct picture. | Not sent. The row says why and how to fix it. |

Scry never shows an approximate picture as if it were exact: the badge stays on it until you fix the file and it is sent again.

## What "approximate" means

The picture was made, but something in the file could not be reproduced exactly. The row in the app names the reason:

| Reason | What it means | Fix |
|---|---|---|
| **No full preview** (PSD, PSB) | Photoshop saved the file without a full flattened preview, so the picture may be blank or wrong. | In Photoshop, turn on **Preferences → File Handling → Maximize PSD and PSB File Compatibility**, then save the file again. |
| **Fonts not embedded** (PDF, AI) | Some fonts are not inside the file, so text was drawn with a stand-in font. | Export the PDF again with fonts embedded. |
| **CMYK without a colour profile** | Colours are close but not exact. | Export a PNG or JPEG into the folder for an exact picture. |
| **Colours not converted to sRGB** | Colours were not converted to standard sRGB on this computer, so they can be slightly off. | Export a PNG or JPEG into the folder for an exact picture. |
| **32-bit picture** | Brightness was mapped to a normal range, so it can look different from Photoshop. | Export a PNG or JPEG into the folder for an exact picture. |
| **Very large page** | A page is over 200 inches wide or tall, so it was drawn small. | Export a PNG or JPEG into the folder for an exact picture. |
| **Only the first pages** | The file has more pages than the page limit; only the first pages were converted. | Export a PNG or JPEG into the folder for an exact picture. |
| **More than one picture in the file** | Only the first picture was used. | Export a PNG or JPEG into the folder for an exact picture. |
| **Duotone** | Shown in grey, without its ink colours. | Export a PNG or JPEG into the folder for an exact picture. |

Exporting a **PNG or JPEG** of the design into the folder always gives an exact picture.

## What is not sent, and why

A file is refused only when a correct picture cannot be made. Each reason has a fix, and the app shows it on the row.

| Reason | Why | Fix |
|---|---|---|
| **InDesign file** | InDesign files cannot be read outside InDesign. | [Export a PDF or PNG](/guide/scry-sync/export-indd-pdf) into the folder. |
| **Illustrator file without PDF compatibility** | The file can only be read inside Illustrator. | Save it again with **Create PDF Compatible File** on, or export a PNG. |
| **Could not be read** | The file may be damaged, or not really the type its name says. | Open it in the app that made it and save it again. |
| **Empty file** | There is nothing in it. | Save it again from the app that made it. |
| **Too large** | The picture is over 16,384 px on a side or over 200 megapixels. | Export a smaller copy. |
| **Colour mode not supported** (Lab, Multichannel) | It cannot be converted faithfully. | In Photoshop, change **Image → Mode** to **RGB Color** and save again. |
| **Preview compression not supported** | The preview saved inside the file uses a compression Scry Sync cannot read. | Save the file again from Photoshop. |
| **HEIC photo** | HEIC photos aren't supported yet, on Mac or Windows. | Export it as a JPEG or PNG and put that in the folder. |
| **Password-protected PDF** | It cannot be opened. | Save a copy without a password into the folder. |
| **No pages** | The document has none. | Export it again with at least one page. |
| **Cannot be made small enough** | The converted picture would still be over 4 MB or 2048 px. | Export a simpler or smaller copy. |
| **A shortcut or link** | Links are never followed. | Put the file itself in the folder. |
| **Outside the folder** | The file resolves to a place outside the synced folder, so it is not read. | Put the file itself in the folder. |
| **Nested too deeply** | The folder is too deep to be read. | Move the files closer to the top of the synced folder. |
| **Unusual file name** | The name has a character, such as a backslash, that Scry Sync cannot use. | Rename it with plain letters and numbers. |
| **Folder could not be opened** | The pictures inside were not synced. | Allow the app to read the folder, or move the pictures somewhere it can open. |
| **Changed while being read** | The file was being saved. | It is read again at the next sync. Save once and leave it alone. |
| **Other kinds of file** | Not a type Scry Sync converts. | Export a PNG, JPEG or PDF into the folder. |

Fix the file, or put the export in the folder, and the next sync picks it up. You do not need to do anything in the app.

## Turn on Maximize PSD and PSB File Compatibility

A Photoshop file only carries a full flattened picture if Photoshop was told to save one. Scry Sync reads that picture, so the setting matters:

- **Mac:** **Photoshop → Settings → File Handling → Maximize PSD and PSB File Compatibility → Always**
- **Windows:** **Edit → Preferences → File Handling → Maximize PSD and PSB File Compatibility → Always**

Then open each affected file and save it again. Files saved before you changed the setting stay approximate until you do.
