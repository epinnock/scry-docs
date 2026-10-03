---
title: Connect a folder to a Scry project
description: "Choose a project and a folder in Scry Sync, read the first scan, and confirm what will be sent before anything leaves your computer."
---

# Connect a folder

## Choose the project

The project is chosen in your browser while you sign in. Only projects you can add to are offered. Viewers see a project greyed out with the reason.

A project receives pictures from **one synced folder**. If another computer already syncs a folder to the project, the browser says so first: *This will replace the pictures sent from that device*.

## Choose the folder

Pick the folder that holds your exports. Subfolders are included. Scry Sync ignores hidden files and folders, macOS `__MACOSX` folders, and files that are not pictures or design files. It does not follow shortcuts, aliases or symbolic links, and says so if it meets one.

Limits, so you are not surprised:

- Up to **10,000 pictures** per folder.
- A folder whose pictures add up to more than **1 GiB** is refused with *This folder is too big; link a smaller folder*.
- Pictures are sent at no more than 2048 pixels on the long side and 4 MB each.

## Read the scan, then confirm

Scry Sync scans the folder and shows a summary like this:

> **212 pictures found.** 180 are ready, 26 will be converted first, 6 can't be used (see why). **Nothing is sent until you press Start.**

The *6 can't be used* link lists each file with the reason and the fix. The summary names what will be sent, and **Start syncing** is your confirmation for this folder. Until you press it, nothing leaves your computer, and it asks again for any other folder you connect.

## What happens after Start

- **Changes are picked up on their own.** Scry Sync waits until the folder has been quiet for about a minute, converts what changed, and sends the whole folder's pictures only if something is different.
- **Edits keep their place.** A picture is identified by its file's position in the folder, not by its contents. Editing a file replaces its picture, and links and history in Scry stay attached.
- **Deleting a file removes its picture** from Scry at the next sync. The file in your folder is never touched.
- **Renaming or moving a file** counts as a new picture and a removed one.
- **A picture's name** in Scry is the folder name plus the file name without its extension. See [What Scry Sync sends and collects](/guide/scry-sync/privacy).
- **Pause** stops syncing for a time you choose. It survives a restart and shows when it ends.

## Change or leave the folder

Use **Settings** in the app to pick another folder, or see [Disconnect a device](/guide/scry-sync/disconnect) to stop syncing altogether.
