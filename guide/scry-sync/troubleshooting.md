---
title: Scry Sync troubleshooting
description: "Fixes for the common Scry Sync problems: warnings on first open, nothing syncing, a file marked approximate or not sent, signed-out states, and how to report a problem."
---

# Troubleshooting

When something needs attention the tray icon changes and the popover lists it in plain words, with one action per row. Most rows fix themselves once the file or connection is fixed. Start with the row: it names the file and the fix.

## The Mac or Windows warning on first open

The beta is not code-signed, so both systems warn once. Follow [Install and first run](/guide/scry-sync/install). On Mac, if **Open** is missing, use **System Settings → Privacy & Security → Open Anyway**. On Windows, use **More info → Run anyway**.

## Nothing is being sent

- **Did you press Start syncing?** Nothing is sent from a folder until you do.
- **Is it paused?** The icon shows pause and the popover says when it ends. Choose **Resume now**.
- **Is it waiting?** Syncing starts after the folder has been quiet for about a minute.
- **Offline?** Changes wait and go when you are back online. The app retries on its own.
- **Signed out?** Choose **Sign in again**. Your folder is unchanged.

## A file says "approximate"

It was sent, but the picture may differ from the file. The row says why. See [What gets converted](/guide/scry-sync/what-gets-converted). The most common causes are a Photoshop file saved without **Maximize PSD and PSB File Compatibility** and a PDF without embedded fonts.

## A file says "Not sent"

The row gives the reason and the fix, and every reason is listed in [What gets converted](/guide/scry-sync/what-gets-converted#what-is-not-sent-and-why). For InDesign files, see [How to export an InDesign file to PDF](/guide/scry-sync/export-indd-pdf).

## A HEIC photo isn't syncing

HEIC photos aren't supported yet. This is the same on Mac and Windows. The row says so and nothing else is affected. Export it as a JPEG or PNG and put that in the folder. The next sync picks it up.

The row stays until the HEIC file is moved out of the folder or deleted. Adding a JPEG next to it is not enough. Once the HEIC file is gone, the row clears.

## "This folder is too big"

A folder is limited to 1 GiB of converted pictures and 10,000 pictures. Link a smaller folder, or move files out of this one.

## "Scry no longer accepts this computer"

The device was revoked, expired, or your access to the project changed (in that case the tray shows **You can't add to "&lt;project&gt;" anymore**). Sign in again. If you cannot, ask a project admin whether you can still add to the project. See [Disconnect a device](/guide/scry-sync/disconnect).

## "This folder cannot be opened" or "Can't watch this folder"

Check that the folder still exists and its drive or network share is connected. Scry Sync keeps trying and checks again every few minutes.

## The app's disk is full or it cannot write its files

Make room on the disk, or check that your account can write to Scry Sync's app data folder. Syncing tries again on its own.

## Report a problem

1. Choose **Report a problem** in the app, or **Settings → Send feedback**. It opens the [feedback form](/feedback) with the app version and a **Ref** code filled in.
2. Say what you expected to happen. Add your email only if you want a reply.

Rows that show a **Ref** code (a short code such as `a1b2c3d4`) are the ones to quote. **Copy details** puts the version, your operating system and the latest Ref codes on your clipboard. You can also email [support@scrymore.com](mailto:support@scrymore.com).

Neither the form nor the Ref code includes file names or paths.
