---
title: Scry Snip
description: "Scry Snip takes a screenshot with a hotkey, lets you review it, and sends it to a Scry project so you and your coding agent can use it. Hotkeys, permissions, what is stored, sharing and deleting."
---

# Scry Snip

::: info Beta
Snip is part of [Scry Sync](/guide/scry-sync/) and is in beta. **Mac support is in beta**: the Mac installer is not code-signed yet, so you grant Screen Recording yourself and may need to grant it again after an update (see [Mac permission](#mac-screen-recording)). Windows needs no permission.
:::

Press a hotkey, select part of your screen, check the picture, and send it to a Scry project. The snip then shows up on your **Snips** page in the dashboard, and your coding agent can fetch it by asking for "the snip I just took". You do not need to connect a folder to use Snip.

## What it does

1. **Takes the screenshot** with a hotkey, from the Mac menu bar or the Windows system tray app.
2. **Shows a review card** with the picture, so you can send it, copy it, keep it or throw it away. Nothing leaves your computer until you press **Send** (see [Review, then send](#review-then-send)).
3. **Puts the picture on your clipboard** and saves a copy in a Snips folder on your computer, so you can paste it into any chat or document straight away.
4. **Sends it to your project**, where you can share it or give it to an agent.

After you sign in for the first time, the app asks **How do you want to use Scry?** Choose **Snip only** if you do not want to sync a folder, or **Sync a folder too**.

## Hotkeys

| | Default hotkey | What you get |
|---|---|---|
| **Mac** | **Control + Option + 4** | Apple's own crosshair: drag to select, **Space** switches to a window, **Esc** cancels. |
| **Windows** | **Ctrl + Shift + 4** | A dimmed overlay over a frozen picture of each screen: drag to select, **Space** moves the selection, **Esc** cancels. The size is shown while you drag. |

You can also snip from the tray menu: **Snip now** and **Snip full screen**. The tray menu also has **Pause Snip** (and **Resume Snip**) and a **Recent snips** list.

To change the hotkey, open **Settings** in Scry Sync, go to the **Snip** tab, press **Record new** and press the keys you want. If another app already uses those keys, Scry says so: "*hotkey* is used by another app. Pick another, or use Snip now from the tray."

### Use Cmd+Shift+4 for Scry (Mac)

Mac already uses Cmd+Shift+4 for its own screenshot, so Scry does not take it by default. If you would rather use it for Snip, **Settings > Snip** has a **Prefer Cmd+Shift+4? See how** link that opens a short guide. The steps are:

1. Open **System Settings > Keyboard > Keyboard Shortcuts > Screenshots**.
2. Untick **Save picture of selected area as a file**.
3. Back in Scry, press **Record new**, then press **Cmd+Shift+4**.

Scry Sync never changes your Mac's settings. To undo it, tick the shortcut again in System Settings.

## Review, then send

By default every snip stops at a review card. It shows the picture, its size and how it was captured, and says **On your clipboard**. The buttons are:

| Button | What it does |
|---|---|
| **Send to *project*** | Uploads the snip to the project named on the button. |
| **Copy image** | Copies the picture again. |
| **Save** | Keeps it in **Recent snips** on your computer without sending it. |
| **Discard** | Throws it away. **Esc** does the same. |

If you do nothing for 30 seconds, the card moves the snip to **Recent snips**. It is not sent. After you press **Send**, the card says **Sending…** and then **Sent**, with the project name. If the upload fails the card says **Not sent** and offers **Retry**.

**Send immediately** is an option in **Settings > Snip**. It is off until you turn it on, and Scry explains what it does before it switches on. When it is on, a snip uploads as soon as you take it, and the card shows **Undo** for a moment. It applies to this computer only, and signing out turns it off.

Sharing, copying a link and deleting happen on the **Snips** page in the dashboard, not on the card.

## Permissions

### Mac: Screen Recording {#mac-screen-recording}

macOS only lets an app read the screen after you allow it. The first time you snip, Scry shows **Scry needs Screen Recording**:

1. Open **System Settings > Privacy & Security > Screen Recording**.
2. Turn on **Scry Sync**.
3. **Quit and reopen Scry Sync.** macOS only applies the change to an app that starts afterwards.

Scry checks that it can really read the screen before it takes a snip. Without the permission macOS quietly hands back a plain wallpaper, and Scry would rather tell you than send you a useless picture. If the check cannot run, for example over a full-screen app, the card says **Scry could not confirm Screen Recording** and nothing is captured. Switch to a normal window and try again.

**After every update, while the beta is unsigned.** Mac updates are manual for now, and the app is not yet code-signed. macOS may forget the Screen Recording permission when you install a new version. If a snip says **Scry needs Screen Recording** after an update, open the same System Settings page, switch **Scry Sync** off and on (or remove it and add it again), then quit and reopen Scry Sync. After a manual update you may also be asked to sign in again. The [install page](/guide/scry-sync/install) explains how to open an unsigned app.

### Windows

Windows does not ask for permission. If a full-screen video or a protected window is in the way, Windows may return an empty picture. Scry then shows **Windows did not give Scry the screen** and saves nothing. Close the video or window and try again.

## What the card says when it cannot snip

Scry tells you why instead of failing silently. Nothing is captured or saved when you see one of these.

| Card | Meaning |
|---|---|
| **Snip is paused** | You paused Snip. Choose **Resume Snip**. Pausing lasts through a restart or an update. Folder sync keeps running. |
| ***App* is in front, not capturing** | The app is on your **Never snip while** list (see below). |
| **Scry needs Screen Recording** | Mac only. See [above](#mac-screen-recording). |
| **That snip came out blank** | The picture was all black, so nothing was saved or sent. Try again. |
| **Snips folder is inside your synced folder** | Snips are kept outside a synced folder so they are not uploaded twice. Choose another Snips folder in Settings. |

## Settings

Open **Settings > Snip**.

| Setting | What it does |
|---|---|
| **Hotkey** | Change the hotkey. Defaults are listed above. |
| **Send mode** | Review first (default) or **Send immediately**. |
| **Snips folder** | Where your local copies go. The default is `Pictures/Scry Snips` in your home folder. It must be outside any synced folder. |
| **Keep local copies** | How long Scry keeps the copies in your Snips folder: 7, 14, 30 (default), 90 or 365 days, or **Keep them**. This only affects your computer. |
| **Never snip while** | A list of apps (up to 50) where Snip refuses to capture, for example a password manager. Suggestions are 1Password, Bitwarden and Chase. |
| **Pause** | Stop the hotkey until you resume. |

## What is stored, and for how long

When you press **Send**, Scry stores, in the project you sent it to:

- **The picture**, as the original (a PNG, at most 4096 pixels on the long side), a smaller preview, and a small copy sized for AI assistants.
- **A record**: who took it, when, which project, the picture size, and a note if you add one.

The app does not send which app or window the snip came from, and it does not send your folder paths or user name.

**A snip stops being available 30 days after you send it.** After that, you, the people it was shared with, and agents can no longer open it. The local copy in your Snips folder is separate and follows your **Keep local copies** setting. You can delete a snip earlier at any time (see [Delete a snip](#delete-a-snip)). Deleting a project deletes all of its snips.

Snips are private to you until you share them. Project admins cannot see other people's snips.

## Share a snip

On the **Snips** page, open a snip and choose **Share**. Only the person who took the snip can share or delete it.

| Level | Who can see it |
|---|---|
| **People** | Only the people you pick. |
| **Organization** | Anyone in your organization. |
| **Whole project** | Everyone who can open the project. |
| **Anyone with the link** | Anyone who has the link, with no sign-in. They see a **preview only**, never the original. |

Things to know about links:

- You choose how long a link lasts: 1, 7 (the default) or 30 days. A snip has one live link at a time.
- Scry shows the link once. **Copy it now**: after you close the dialog it is not shown again, and you would create a new one.
- Turn the link off at any time in the same dialog. An expired or turned-off link shows **This link has expired or was turned off**.
- People you share with cannot share it onward, but they can choose **Remove from my view**.

Snips shared with you are on the **Shared with me** tab.

## Use a snip with your coding agent

An agent connected to the [Scry MCP server](/guide/mcp) can fetch your snips. Copy the id from the **Snips** page with **Copy for agent** (it copies "Look at Scry capture *id*"), or just describe what you did:

> I just snipped the broken checkout button. Fix the spacing, and check it against the snip.

> Look at Scry capture cap_7k3f and tell me what is off in the header.

> What snips have I taken in the last hour? Then open the second one.

> Show me what my teammate shared with me and tell me which one is about the settings page.

Behind the scenes the agent uses `latest_capture`, `get_capture` and `list_captures`. By default `latest_capture` only returns a snip from the last 15 minutes, so an agent never silently looks at an old picture; if yours is older, it tells you and asks. The agent sees a smaller copy of the picture, and can open the full-resolution original through a link that works for one hour. See the [tools reference](/services/mcp-server/tools#capture-tools) for the details.

An agent can also delete a snip you took, but only if you ask it to.

## Delete a snip

- **On the Snips page**: open the snip and choose **Delete**. This removes the original, the pictures and any link.
- **From an agent**: ask it to delete the snip, for example "Delete Scry capture cap_7k3f". Only your own snips can be deleted this way.
- **Snips shared with you**: use **Remove from my view**. The owner's copy is not affected.
- **On your computer**: the copy in your Snips folder is yours to delete. Scry also removes old copies after the number of days you chose in **Keep local copies**.

To remove everything, delete the project in the dashboard, which deletes its snips as well. To ask for your data to be deleted, email [privacy@scrymore.com](mailto:privacy@scrymore.com).

## Troubleshooting

**Nothing happens when I press the hotkey.** Check that Snip is not paused (the tray menu says **Resume Snip** if it is), and that another app is not using the same keys. Try **Snip now** from the tray menu, or record a different hotkey in **Settings > Snip**.

**Mac says Scry needs Screen Recording, but it is already on.** Quit and reopen Scry Sync. If it still says so after an update, switch Scry Sync off and on in **System Settings > Privacy & Security > Screen Recording**.

**The snip is on my computer but not in the dashboard.** The card says **Not sent** when the upload fails; press **Retry**. Snips you **Save** or let time out stay in **Recent snips** until you send them.

More help: [Scry Sync troubleshooting](/guide/scry-sync/troubleshooting), the in-app **Report a problem**, or [support@scrymore.com](mailto:support@scrymore.com).

See also: [What Scry Sync sends and collects](/guide/scry-sync/privacy).
