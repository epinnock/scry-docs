---
title: Scry Sync
description: "Scry Sync is a small desktop app for Mac and Windows that keeps a folder of design exports in sync with a Scry project, converting files on your computer first."
---

# Scry Sync

::: info Beta
Scry Sync is in beta. The installers are not yet code-signed, so your computer shows a one-time warning the first time you open the app. [Install and first run](/guide/scry-sync/install) walks through it.
:::

Scry Sync links **one folder on your computer to one Scry project**. After that it lives in the Mac menu bar or the Windows system tray, notices new and changed files, converts them into pictures on your own computer, and sends only those pictures to Scry, where they become searchable.

Use it when your designs live in files (Photoshop, Illustrator, InDesign exports, plain images) rather than in Figma or Storybook, and you want them findable in Scry without uploading them by hand each time.

## What it does, in order

1. **Watches the folder** and its subfolders. It waits until the folder has been quiet for about a minute, so it does not send half-saved files.
2. **Converts** each changed file to a picture, on your computer. Every file gets one of three verdicts: *faithful*, *approximate* or *not sent*. See [What gets converted](/guide/scry-sync/what-gets-converted).
3. **Sends** the pictures for the folder, only when something changed.
4. **Tells you** what needs attention, in a plain list in the app, with one action per row.

Your folder is never modified. Scry Sync only reads from it, and it only goes one way: folder to Scry.

## Which files it handles

| You have | What Scry Sync does |
|---|---|
| **PNG, JPG, WebP, HEIC** | Sends the picture. HEIC is converted to a standard picture first. |
| **PDF** | Converts each page to a picture. |
| **Illustrator (AI)** | Reads it as a PDF, so the file must have been saved with **Create PDF Compatible File** turned on. |
| **InDesign (INDD)** | Cannot be read directly. Export a **PDF** (or PNG) of it into the folder and the export syncs. See [How to export an InDesign file to PDF](/guide/scry-sync/export-indd-pdf). |
| **Photoshop (PSD, PSB)** | Reads the flattened picture Photoshop saved inside the file. This needs **Maximize PSD and PSB File Compatibility** turned on when you save. |

Not in this version: Figma and Sketch files, an Adobe Bridge or Photoshop panel, Linux, and more than one folder per project. Figma designs are covered by the [Scry Link plugin](/guide/figma-plugin).

## Before you start

- A Scry account and a project you can add to. Owners, admins and developers can connect a folder; viewers cannot.
- A Mac with macOS 13 (Ventura) or later, or a PC with Windows 11.
- A folder of design exports. Subfolders are included.

## In this guide

- [Install and first run](/guide/scry-sync/install): download, the one-time Mac and Windows warnings, signing in.
- [Connect a folder](/guide/scry-sync/connect-a-folder): choose a project and folder, the scan, and what you confirm before anything is sent.
- [What gets converted](/guide/scry-sync/what-gets-converted): the three verdicts, what *approximate* means, and every reason a file is not sent.
- [How to export an InDesign file to PDF](/guide/scry-sync/export-indd-pdf)
- [Disconnect a device](/guide/scry-sync/disconnect)
- [What Scry Sync sends and collects](/guide/scry-sync/privacy)
- [Troubleshooting](/guide/scry-sync/troubleshooting)

Something not working? Use **Report a problem** in the app, or the [feedback form](/feedback). Email [support@scrymore.com](mailto:support@scrymore.com) if you would rather write.
