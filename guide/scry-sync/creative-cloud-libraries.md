---
title: Sync Creative Cloud Libraries
description: "Scry Sync can keep your Adobe Creative Cloud Libraries searchable in Scry by reading the copy Adobe already keeps on your computer. What it reads, what it never touches, Adobe Stock, and what to do when a library does not show up."
---

# Sync Creative Cloud Libraries

::: warning Not released yet
This feature is in development. This page describes the planned behaviour and will change before release. Nothing here is available in the current Scry Sync download.
:::

Instead of choosing a folder, Scry Sync can start from your **Creative Cloud Libraries**. It finds the libraries Adobe already keeps on your computer (your own and the ones shared with you), you tick the ones you want, and Scry keeps those pictures current. You do not export anything.

Everything else about Scry Sync is the same: pictures are made on your computer, only pictures and a few labels are sent, and it only goes one way, from your computer to Scry. See [Scry Sync](/guide/scry-sync/).

## What you need

- **Windows 11 or a Mac** (macOS 13 or later). These are the systems this feature is built and tested on. **Windows 10 is not tested yet**, so it is not promised; the page will say so until it is.
- **The Creative Cloud app installed and signed in**, with your libraries opened at least once in **Your libraries**. Scry reads what the app has already stored on this computer; it does not talk to Adobe's servers and does not ask for your Adobe password.
- A Scry account and a project you can add to, as for a folder.

## What Scry reads, and what it never does

Scry reads **Adobe's local copy of your libraries**. These are the places:

| System | Where |
|---|---|
| Windows | `%APPDATA%\Adobe\Creative Cloud Libraries\LIBS` |
| Mac | `~/Library/Application Support/Adobe/Creative Cloud Libraries/LIBS` |

You never type a path; Scry looks in those two places itself.

| | |
|---|---|
| **Read** | The name of every library, and the time it last changed in Creative Cloud. For a library you **tick**: its list of items and the pictures in it. |
| **Never read** | The pictures of a library you did not tick (only its name and last-changed time are read). Anything in Adobe's `identity` folder, which holds Adobe's sign-in material. |
| **Never changed** | Scry **never writes to Adobe's copy**: it does not add, rename, delete, lock or re-time anything there. It opens files read-only and works on a copy of each picture in its own folder, and checks the copy matches what Adobe recorded before using it. |
| **Never sent** | Adobe's index files, links with sign-in tokens in them, and anything from the `identity` folder. Library and picture names are sent so you can find pictures in Scry; they are not put in usage events or logs. |

Scry's own usage events for this feature carry counts and fixed codes only. See [What Scry Sync sends and collects](/guide/scry-sync/privacy).

## Set it up

1. Open Scry Sync and sign in. When it asks where your pictures are, choose **Creative Cloud Libraries** (the other choice is **A folder on this computer**).
2. Scry looks for your libraries. If it cannot find any, see [Troubleshooting](#troubleshooting).
3. On **Choose your libraries**, tick the libraries you want. Each row shows the library name, a tag (**Yours** or **Shared with you**) and when it last changed in Creative Cloud. After you tick a library the row also shows about how many pictures it holds.
4. Decide about **Include Adobe Stock items** (next section). It is off unless you switch it on.
5. Press **Continue**. Scry tells you how many libraries it will send to which project and how many credits each new or changed picture uses (2), then waits for **Start syncing**. Nothing is sent before you press it.

Pictures that Adobe has not downloaded to your computer yet are skipped until Adobe has them.

## Adobe Stock items

Libraries often hold **Adobe Stock** items. In Adobe's local copy those are small previews (about 360 pixels), and Adobe's Stock terms may limit keeping Stock outside Adobe. So:

- **The switch "Include Adobe Stock items" is off by default.** With it off, Stock items are skipped and the status screen says how many (for example "1,060 Adobe Stock previews skipped").
- **If Scry cannot tell whether an item is Stock, it treats it as Stock.** It would rather skip a picture than send something it should not.
- **Switching it on asks first:** "Adobe Stock previews will be sent to Scry and searchable in this project. Adobe's Stock terms may limit keeping Stock outside Adobe. Include them?" Choose **Include Stock** or **Not now**. Without that confirmation nothing Stock is sent.
- **Switching it off later asks:** "Remove the Adobe Stock pictures already in Scry?" **Remove them** deletes Stock pictures from your Scry project; **Keep what is there, stop adding** leaves them and sends no more. Your own pictures are not touched either way.
- It is **one switch for the whole source**, not one per library, and it is on the status screen as well as in setup.

## When a library last changed, and how fresh it is

Each library on the status screen shows **"Last changed in Creative Cloud &lt;time&gt;"**. That is when the library's content last changed in Creative Cloud, for example when you added or renamed a picture. When it is more than a day ago, Scry adds how many days. An old time only means nothing has changed since; it does not mean Scry is behind.

**Adobe updates its local copy itself, usually in about a second or two, and Scry reads that copy.** In our own test, a change made in Creative Cloud reached the copy on both Windows 11 and Mac within one to three seconds, whether the Creative Cloud window was open or closed. So there is no **Sync now** button: there is nothing for Scry to ask Adobe to do. Scry checks Adobe's copy every 30 seconds, waits until the library has been quiet for about a minute, as it does for folders, and then sends what changed.

The one time you may need to open Creative Cloud yourself is when Scry cannot find or read Adobe's copy, or the computer is offline. Scry then shows a hint: *Open the Creative Cloud app and sign in, then check Your libraries.* Timing has not been tested after a computer wakes from sleep, or on Windows 10.

The status screen also shows, per library, **"Last sent to Scry &lt;time&gt; · &lt;n&gt; pictures"**, how many Stock previews were skipped or included, and how many items are **not pictures**.

## What happens when things change

- **A new or edited picture** is sent again; one that did not change is not sent and costs nothing.
- **Renaming a picture in Adobe** keeps it the same picture in Scry. Only its title changes, and links and history stay attached. (Unlike a folder, where a renamed file counts as a new picture.)
- **Deleting a picture in Adobe** removes it from Scry at the next send, only when Adobe's own list says it was removed.
- **Items that are not pictures** (colours, character styles, brushes and the like) are counted as "not pictures" and are never sent.
- **Layered files.** Scry sends the picture Adobe has stored for the item on this computer. For some layered files (Photoshop, Illustrator) that can be a preview rather than the full-size picture.
- **Stop syncing this library** (on the status screen) asks you to confirm: its pictures leave your Scry project the next time Scry sends, earlier builds stay in history until they expire, and Adobe's copy is not changed.
- **Credits:** 2 credits per new or changed picture, the same as for a folder.

### Safety holds: "pictures disappeared, nothing deleted"

Scry will not delete your pictures from Scry on a hunch. It **holds** (changes nothing and shows why) when:

- one update would remove 10 or more pictures **and** more than half of a library. The screen says "&lt;n&gt; pictures disappeared from Adobe's cache at once" and asks you to choose **Keep them** or **Delete from Scry**. Until you answer, nothing is deleted.
- Adobe's copy goes missing or becomes unreadable (for example you signed out of Creative Cloud). The screen says "Scry lost sight of &lt;library&gt;". Sign in to the Creative Cloud app again; the hold clears on its own when the library is readable.
- Adobe's storage format is not one Scry understands (see below).

## Links back to the original

Each picture keeps a few facts about where it came from, shown on the picture in Scry:

| Field | Meaning |
|---|---|
| `origin.kind` | `cc-library` |
| `origin.library` | The library's name |
| `origin.item` | The item's name |
| `origin.stock` | `true` for an Adobe Stock preview |
| `origin.link` | For your own items, a link back to the library on Adobe's site, when Adobe's copy has one. For Stock previews only the Stock content id, and only when the Stock switch is on. No link with a sign-in token or a signed address is ever kept. |

## Troubleshooting

### "Sign in to the Creative Cloud app first"

Scry could not find any libraries on this computer. Open the Creative Cloud app, sign in, open **Your libraries** once, then choose **Check again** in Scry. If Creative Cloud is not installed, choose **Choose a folder instead**.

### "No libraries yet"

Scry found Adobe's folder but no libraries in it. Create or open a library in Creative Cloud, then **Check again**.

### "Scry can't read the Creative Cloud libraries on this computer"

Nothing is sent. Two causes:

- **Mac permission.** macOS may block Scry from reading Adobe's folder. Open **System Settings → Privacy & Security** and allow the item macOS names for Scry Sync, then choose **Check again**. <!-- TODO F4/F11: exact wording and whether macOS prompts at all is decided by acceptance row 15; update before release -->
- **A locked file.** Another program has Adobe's files open. Scry tries again after the next quiet minute. If it does not clear, restart the Creative Cloud app and choose **Check again**. <!-- TODO: locked-file body is draft copy (plan "Deviations", F10) -->

### "Adobe has changed how Creative Cloud stores libraries"

This version of Scry cannot read them safely, so it reads nothing and sends nothing; what is already in Scry stays. Choose **Check for a Scry update**: a new version will support it if Adobe's change can be handled. **Tell us** opens the [feedback form](/feedback). The only thing Scry reports about this is the format version number.

### Pictures are missing, but nothing was deleted

If the status screen shows that pictures disappeared at once or that Scry lost sight of a library, it is a hold, not a delete. See [Safety holds](#safety-holds-pictures-disappeared-nothing-deleted).

### A picture I expected is not in Scry

- It may be an **Adobe Stock** item and the switch is off.
- It may not be a picture (a colour, a style, a brush).
- Adobe may not have downloaded it to this computer yet; open it in **Your libraries** so Adobe fetches it.
- If you changed something in Creative Cloud and it is missing here, make sure Creative Cloud is running and online. Adobe normally updates its copy within seconds and Scry picks the change up by itself within a minute or two.

### The "Last changed in Creative Cloud" time is old

That is the time the library's content last changed, so an old time usually just means nothing has changed since. If you know you changed something more recently, make sure the Creative Cloud app is running, signed in and online; Adobe then updates its copy within seconds and Scry picks the change up by itself. Scry cannot trigger Adobe.

### Report a problem

Use **Report a problem** in the app, as described in [Scry Sync troubleshooting](/guide/scry-sync/troubleshooting#report-a-problem).

## Related

- [Scry Sync overview](/guide/scry-sync/)
- [Connect a folder](/guide/scry-sync/connect-a-folder), the other way to start
- [What Scry Sync sends and collects](/guide/scry-sync/privacy)
- [Scry Sync troubleshooting](/guide/scry-sync/troubleshooting)
