---
title: What Scry Sync sends and collects
description: "Exactly what leaves your computer when Scry Sync runs, what it keeps on your computer, and how to turn off usage data and error reports."
---

# What Scry Sync sends and collects

This page lists everything Scry Sync sends and keeps. The [privacy policy](/privacy) covers the rest of Scry.

**In short:** only converted pictures and a few labels leave your computer. Your original files and folder paths never do, and your user name is never sent with uploads or in file paths. At sign-in the app sends your computer's name so you can recognise it in your dashboard. The app also sends anonymous usage events and scrubbed error reports, which you can turn off.

## What is sent to Scry

| What | Details |
|---|---|
| **Pictures** | One converted picture per file, or per page for a PDF, at no more than 2048 pixels and 4 MB. Never the original file. |
| **A name for each picture** | The folder's name plus the file's name **without its extension**, for example the folder `Checkout redesign` and the file `Homepage-v4.psd` give a picture named from those two. This is the one place a file name reaches Scry, so search and links can show it. |
| **A stable id** | A one-way hash of the folder and the file's position inside it, so editing a file keeps its picture. The path itself is not sent and cannot be recovered from the id. |
| **A few labels** | How the picture was made (for example converted from a PSD), its verdict (faithful or approximate), and the app version. Keywords, rating and label the file already carries are kept; anything that looks like a path or file name is removed. |
| **Computer name** | Sent once, when you sign in, so you can recognise this computer in the **Devices** list in your Scry dashboard. It may contain your name if your computer is named after you. To change it, rename the computer and sign in again. |
| **Who and where** | The project's access key for this computer, to prove the upload is allowed. The key is held in the Mac Keychain or Windows credential store, never in a file, a log or an error report. |

Scry then processes the pictures like any other upload: it indexes them for search and may describe them with AI. The providers involved are on the [subprocessor list](/subprocessors).

## What is never sent

- Your original design files (PSD, PSB, AI, INDD, PDF, images).
- Folder paths or drive names, or your user name in uploads or file paths. (Your computer's name is sent at sign-in; see the table above.)
- File names in usage events or error reports.
- Anything from outside the folder you chose.

Scry Sync only reads your folder. It never writes to it.

The planned Creative Cloud Libraries source reads Adobe's local copy of your libraries instead of a folder, never writes to it, and skips Adobe Stock unless you switch it on. What it reads and sends is on [Sync Creative Cloud Libraries](/guide/scry-sync/creative-cloud-libraries); this page will list its usage events when it is released.

## What stays on your computer

- A small record per folder of what was sent, so only changes are sent again.
- A log file for troubleshooting: one line per event, with event names, counts, fixed codes and request ids. It never contains file names, folder paths, user names or keys, and the app does not upload it.
- Your settings, and the sign-in key in the Keychain or credential store.

## Usage data and error reports

Scry Sync shares anonymous usage events and error reports so we can fix problems and see which features are used. This is **on by default, and you can turn it off**: the first run shows a short notice, and **Settings → Share anonymous usage data and error reports** switches it off at any time. It is also off if the environment variable `DO_NOT_TRACK` is set to `1`, `true` or `yes`, or `SCRY_TELEMETRY` is set to `0` or `false`.

### Usage events (PostHog)

Events have a name and a few properties that are counts, yes/no values or fixed words. Every event also carries `surface: desktop`, the app version, the operating system (Mac, Windows or other) and whether it is a production or test build.

| Event | When | Properties |
|---|---|---|
| App opened | The app starts | Whether it is the first open |
| Signed in | A sign-in finishes | Result (approved, expired, denied, failed, cancelled) and how long it took |
| Folder linked | You choose a folder | How many files it holds |
| Scan finished | The first scan is done | How many are ready, to be converted, or cannot be used, and how long it took |
| Sync finished | A sync ends | Result, how many pictures, how many were faithful, approximate or failed, and how long it took |
| Problem shown | The app shows a problem | A fixed problem code, such as `psd_no_full_preview`. Never the file or its text. |
| Update available | A new version is found | Whether it installs automatically or you download it |
| Paused, resumed | You pause or resume | Minutes paused; whether you or the timer resumed |
| Signed out | The app signs out | Why: you, a revoked device, or a changed Keychain |

Before you sign in, events use a random id made on your computer. After you sign in they use your Scry account id, so we can count people rather than events.

**Never in usage events:** file names, folder names, paths, project names, picture names, search text, pictures, your name or email address.

### Error reports (Sentry)

When the app hits an error it sends the error, its stack trace and the app version (`scry-sync@<version>`). Before sending, it removes file and folder paths, anything that looks like a file name or email address, quoted names, Scry keys and tokens, and the query part of web addresses. It records no breadcrumbs, no screenshots and no sessions. Error reports only: Sentry is not used for usage data.

## Reporting a problem

**Report a problem** in the app opens the [feedback form](/feedback) with the app version and a short reference code (for example `?src=scry-sync&v=0.1.0&ref=a1b2c3d4`). The code lets us find the matching technical log entries. **Copy details** puts the version, your operating system and recent reference codes on your clipboard so you can paste them into an email to [support@scrymore.com](mailto:support@scrymore.com). Nothing is sent until you press **Send** on the form, and an email address on the form is optional.

## Getting your data deleted

Email [privacy@scrymore.com](mailto:privacy@scrymore.com) and we delete your pictures, account data and usage events. To remove pictures yourself, delete the files from the synced folder and let it sync, or delete them in Scry.
