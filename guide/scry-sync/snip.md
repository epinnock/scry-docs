---
title: Scry Snip
description: "Scry Snip takes a screenshot with a hotkey, lets you review it, and sends it to a Scry project so you and your coding agent can use it. Hotkeys, permissions, what is stored, sharing and deleting."
---

# Scry Snip

::: info Beta
Snip is part of [Scry Sync](/guide/scry-sync/) and is in beta. **Mac support is in beta**: the Mac installer is not code-signed yet, so you grant Screen Recording yourself and may need to grant it again after an update (see [Mac permission](#mac-screen-recording)). Windows needs no permission.
:::

Press a hotkey, select part of your screen, check the picture, and send it to a Scry project. The snip then shows up on your **Snips** page in the dashboard, and your coding agent can fetch it by asking for "the snip I just took". You do not need to connect a folder to use Snip. Scry also makes each snip [searchable](#find-your-snips-in-search), so you can find it later by describing it. To show something that moves, [record a clip](#record-a-clip) of up to 10 seconds instead.

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

## Record a clip {#record-a-clip}

Some things only make sense when they move: a hover state, a loading flash, a menu that jumps. Record the part of your screen you pick, for up to 10 seconds, and Scry keeps it as a short clip next to a normal snip. Record a clip needs Scry Sync 0.1.14 or later, on Mac and Windows.

If you do not see **Record a clip** in the menu, clips are not on for your account yet, or Scry Sync is older than 0.1.14.

::: info Screenshots
The pictures below come from the approved design prototype. They will be replaced with captures of the real app.
:::

### Record one

| | Record a clip | Snip (a still picture) |
|---|---|---|
| **Mac** | **Control + Option + 5** | **Control + Option + 4** |
| **Windows** | **Ctrl + Shift + 5** | **Ctrl + Shift + 4** |

You can also choose **Record a clip** in the menu bar (Mac) or tray (Windows) menu. It sits between **Snip now** and **Snip full screen**.

1. Press the hotkey. Scry checks your **Never snip while** list first, the same as for a snip.
2. Drag to select a region, or click a window to record that window. **Space** moves the selection and **Esc** cancels. The overlay shows the size and **Clip · up to 10 s**. Recording starts when you let go of the mouse.

   ![The region overlay for a clip: a dimmed screen, the selected region with its size 1280 x 720, the label Clip · up to 10 s and the hint Esc cancel, Space move the selection, Click a window to record it, Recording starts when you let go](/images/scry-sync/animated-snips-select.png)

3. A red outline marks the region. A small bar shows **Recording**, the time (**0:04 / 0:10**) and **Stop**. It sits below the region, or above it when there is no room below. If the region is the whole screen, the bar moves to another display, or you only see the timer in the menu bar or tray. The outline and the bar are not in the clip.

   ![A clip being recorded: a red outline around the selected region and, below it, a dark bar with Recording, 0:04 / 0:10, Stop and Esc cancels](/images/scry-sync/animated-snips-recording.png)

4. Press **Stop**, or the record hotkey again, to keep the clip. Press **Esc** to throw it away. At 10 seconds it stops by itself. For the last two seconds the bar says **Stops in 2 s**, and then **Stopped at 10 s**.

A still snip on a Mac uses Apple's crosshair. A clip uses Scry's own selection overlay, the same one Windows uses, so it can show the size and **Clip · up to 10 s**.

To change the hotkey, open **Settings > Snip** and use **Record hotkey**, next to the snip hotkey. Mac keeps Cmd+Shift+5 for its own screen recorder, so Scry does not use it.

### Limits

| Limit | Value |
|---|---|
| **Length** | Up to 10 seconds. A clip shorter than half a second is thrown away. |
| **Speed** | Up to 12 frames a second. |
| **Size** | At most 1280 pixels on the long side. A larger area is scaled down. |
| **File** | At most 15 MB. |
| **Sound** | None. A clip is silent. |

If a clip comes out bigger than 15 MB, Scry Sync tries once more at lower quality. If it is still too big, the card says **Clip too large to send** and shows the real size. A smaller area or fewer seconds helps.

### What you get

After you stop, the card says **Preparing clip…** while Scry makes the file. Then it says **Clip ready**, with a **▶ 0:07** badge on the picture and **Key frame copied**.

![The Clip ready card in the corner of the screen: a small picture with a ▶ 0:07 badge, Clip ready, Key frame copied, 0:07 to scry-dashboard, and the Send, Search and more buttons](/images/scry-sync/animated-snips-ready.png)

- **The picture is the middle frame of the clip.** Scry calls it the key frame. It goes on your clipboard, because a video cannot be pasted as a picture into most apps, so pasting into a chat still works.
- **The clip is saved on your computer** in your Snips folder as `scry-snip-xxxxxxxx.mp4`, next to the picture `scry-snip-xxxxxxxx.png`.
- **A clip always stops at the review card**, even when **Send immediately** is on. **Send**, **Search** and **⋯** work as they do for a snip.
- After **Send**, the card shows how much has been uploaded (for example **Clip 4.8 MB · 62 %**), then **Sent to *project***. **Copy link** copies the link to the snip in the dashboard.

### What is sent

| Where | What |
|---|---|
| **Your project** | The clip as an MP4 and the key frame as the snip's picture, with the smaller preview. Also a small copy for AI assistants: six frames of the clip in a grid. |
| **People who open the snip in Scry** | On the **Snips** page the tile shows **▶ 0:07**. Hover over it, or tab to it, and the clip plays, muted and on a loop. Open it to see a player. If your computer is set to reduce motion, it does not play by itself. |
| **Anyone with a public link** | If you share with **Anyone with the link**, the page plays the clip with no sign-in. It never shows the original. See [Share a snip](#share-a-snip). |
| **Your coding agent** | The six-frame picture and a link to the clip that works for one hour. See [Use a snip with your coding agent](#use-a-snip-with-your-coding-agent). |
| **Search** | The key frame, like any snip. Search does not look at the motion. |

A clip is as private as its snip. The same people can see it, and it goes away with the snip after 30 days. Deleting a snip also deletes its clip. Scry does not send the name of the app or window you recorded. See [What Scry Sync sends and collects](/guide/scry-sync/privacy#scry-snip).

### Permission

Clips use the same Screen Recording permission as snips on a Mac, so macOS asks for nothing new (see [Mac: Screen Recording](#mac-screen-recording)). Scry Sync only looks at the part you select, and only while the red dot shows. It never records in the background. Windows does not ask for permission.

### When a clip is stopped or not sent

![The card "1Password came to the front, clip stopped" over a desktop: Nothing was captured or saved, with Edit avoid list and Dismiss](/images/scry-sync/animated-snips-avoided.png)

| Card | What it means |
|---|---|
| ***App* came to the front, clip stopped** | The app is on your **Never snip while** list. Scry checks for the whole recording, not just at the start. It stops at once and keeps nothing: **Nothing was captured or saved**. |
| **Clip stopped: could not check the front app** | Scry could not tell which app was in front. To be safe, it stopped and kept nothing. |
| **Clip too short to keep** | The clip was shorter than half a second. Hold for at least half a second. |
| **Clip could not be made** | Encoding stopped on this computer. Nothing was sent. **Send key frame** sends the picture as a normal snip. |
| **Clip too large to send** | The clip is over 15 MB, even after one try at lower quality. **Send key frame** sends the picture. |
| **Sent as a still** | Clips are not on for this project yet. Scry sent the key frame as a normal snip, and the clip is saved on this computer. |
| **Queued** | You are offline. The clip sends when you are back online, like any snip. |
| **Windows did not give Scry the screen** | Windows only. The clip came back empty, so nothing was saved. Close any full-screen video or protected window and try again. |

### Not in this version

- You cannot mark up a clip.
- There is no GIF export. A clip is an MP4.
- A clip has no sound.
- You cannot trim a clip. Stop sooner, or record it again.
- Search finds a clip by its key frame, not by what moves.

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

macOS only lets an app read the screen after you allow it. The first time you snip, Scry shows a card, **Let Scry Sync see your screen**, with an **Open System Settings** button:

1. Open **System Settings > Privacy & Security > Screen & System Audio Recording** (called **Screen Recording** on macOS 14 and earlier).
2. Turn on **Scry Sync**. If **Scry Sync** is not in the list yet, click the **+** button under the list, enter your Mac password, choose **Scry Sync** in **Applications**, and click **Open**.
3. **Quit and reopen Scry Sync** (macOS offers **Quit & Reopen**). macOS only applies the change to an app that starts afterwards.

The first time you finish a region snip, macOS may also ask whether Scry Sync can bypass the system private window picker. Choose **Allow**.

Scry checks that it can really read the screen before it takes a snip. Without the permission macOS quietly hands back a plain wallpaper, and Scry would rather tell you than send you a useless picture. If the check cannot run, for example over a full-screen app, the card says **Scry could not confirm Screen Recording** and nothing is captured. Switch to a normal window and try again.

**After every update, while the beta is unsigned.** Mac updates are manual for now, and the app is not yet code-signed. macOS may forget the Screen Recording permission when you install a new version. If a snip shows the **Let Scry Sync see your screen** card after an update, open the same System Settings page, switch **Scry Sync** off and on (or remove it and add it again), then quit and reopen Scry Sync. After a manual update you may also be asked to sign in again. The [install page](/guide/scry-sync/install) explains how to open an unsigned app.

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
| **Record hotkey** | Change the hotkey for [recording a clip](#record-a-clip). It is only there when Record a clip is on for you. |
| **Send mode** | Review first (default) or **Send immediately**. |
| **Snips folder** | Where your local copies go. The default is `Pictures/Scry Snips` in your home folder. It must be outside any synced folder. |
| **Keep local copies** | How long Scry keeps the copies in your Snips folder: 7, 14, 30 (default), 90 or 365 days, or **Keep them**. This only affects your computer. |
| **Never snip while** | A list of apps (up to 50) where Snip refuses to capture, for example a password manager. Suggestions are 1Password, Bitwarden and Chase. |
| **Index my snips** | A switch, **Make my snips searchable**, on by default. Turn it off to keep your snips out of search. It is the same switch as on the **Snips** page in the dashboard (see [Find your snips in search](#find-your-snips-in-search)), so changing it in either place changes both. |
| **Pause** | Stop the hotkey until you resume. |

## What is stored, and for how long

When you press **Send**, Scry stores, in the project you sent it to:

- **The picture**, as the original (a PNG, at most 4096 pixels on the long side), a smaller preview, and a small copy sized for AI assistants.
- **A record**: who took it, when, which project, the picture size, and a note if you add one.
- **A search entry**, unless you turned off **Make my snips searchable**: a short description of the picture written by AI, and numbers that let search match it. See [Find your snips in search](#find-your-snips-in-search).

The app does not send which app or window the snip came from, and it does not send your folder paths or user name.

**A snip stops being available 30 days after you send it.** After that, you, the people it was shared with, and agents can no longer open it. The local copy in your Snips folder is separate and follows your **Keep local copies** setting. You can delete a snip earlier at any time (see [Delete a snip](#delete-a-snip)). Deleting a project deletes all of its snips.

Snips are private to you until you share them. Project admins cannot see other people's snips, and that includes search.

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

Snips shared with you are on the **Shared with me** tab. They also turn up when you search, see below.

## Find your snips in search

Once you send a snip, Scry describes it and adds it to search, usually within a few seconds. After that you can find it on the dashboard's [Image search](/guide/dashboard-search#snips-in-search) page by describing it (for example "the blue pricing card" or "error toast") or by searching with a similar picture. Your coding agent can find it too: the [Scry MCP server](/guide/mcp) search tools include snips, marked as snips, and the agent can open one with `get_capture`.

Each snip on the **Mine** tab of the **Snips** page shows where it stands:

| Label | Meaning |
|---|---|
| **Searchable** | It is in search. |
| **Indexing…** | Scry is still describing it. The label updates by itself. |
| **Not searchable (turned off)** | You have **Make my snips searchable** switched off. |
| **Could not make searchable** | Something went wrong while describing it. Turn the switch off and on again, or [tell us](/feedback). |
| **Not searchable** | The snip was sent before snips could be searched, and has not been added. |

### Who can find a snip

Only the people who can already open a snip can find it in search:

- **You**, for every snip you took.
- **The people you shared it with**, in the way you shared it: the people you picked, your organization, or everyone who can open the project.
- **Nobody else.** Other members of the project, project admins and people outside the project never see your private snip in their results. There is no placeholder and no count that hints it exists.

Search only shows snips to people who are signed in. A link on its own does not put a snip in anyone's results.

A snip leaves search when it is no longer available to the person looking: when it is deleted, when you stop sharing it with them, when they choose **Remove from my view**, when its owner leaves the project, and when it passes its 30 days. A snip someone removed from their own view leaves their results but stays with its owner.

### Turn it off

Snips can show private screens, such as chat or email, so each person decides for their own snips. Use the **Make my snips searchable** switch:

- **On the dashboard**: open the **Snips** page, on the **Mine** tab.
- **In Scry Sync**: open **Settings** and find **Index my snips**. Older versions of Scry Sync do not have the switch; use the dashboard instead.

The text under the switch says: "Scry describes each snip with AI so you can find it by searching. Only people you share a snip with can find it."

While the switch is off, your new snips are not sent to AI for searching, and the ones already in search are taken out of it. Turning it back on adds your snips again. Pictures Scry has already described are not described a second time.

To describe a snip, Scry sends its picture to the same AI services that Scry uses to make your synced pictures searchable. They are listed on the [subprocessor list](/subprocessors). Turning the switch off stops this for new snips. It cannot take back a description that was already made.

## Use a snip with your coding agent

An agent connected to the [Scry MCP server](/guide/mcp) can fetch your snips. Copy the id from the **Snips** page with **Copy for agent** (it copies "Look at Scry capture *id*"), or just describe what you did:

> I just snipped the broken checkout button. Fix the spacing, and check it against the snip.

> Look at Scry capture cap_7k3f and tell me what is off in the header.

> What snips have I taken in the last hour? Then open the second one.

> Show me what my teammate shared with me and tell me which one is about the settings page.

Behind the scenes the agent uses `latest_capture`, `get_capture` and `list_captures`. By default `latest_capture` only returns a snip from the last 15 minutes, so an agent never silently looks at an old picture; if yours is older, it tells you and asks. The agent sees a smaller copy of the picture, and can open the full-resolution original through a link that works for one hour. See the [tools reference](/services/mcp-server/tools#capture-tools) for the details.

An agent can also delete a snip you took, but only if you ask it to.

## Delete a snip

- **On the Snips page**: open the snip and choose **Delete**. This removes the original, the pictures, any link and the snip's entry in search.
- **From an agent**: ask it to delete the snip, for example "Delete Scry capture cap_7k3f". Only your own snips can be deleted this way.
- **Snips shared with you**: use **Remove from my view**. The owner's copy is not affected.
- **On your computer**: the copy in your Snips folder is yours to delete. Scry also removes old copies after the number of days you chose in **Keep local copies**.

To remove everything, delete the project in the dashboard, which deletes its snips as well. To ask for your data to be deleted, email [privacy@scrymore.com](mailto:privacy@scrymore.com).

## Troubleshooting

**Nothing happens when I press the hotkey.** Check that Snip is not paused (the tray menu says **Resume Snip** if it is), and that another app is not using the same keys. Try **Snip now** from the tray menu, or record a different hotkey in **Settings > Snip**.

**Mac says Scry needs Screen Recording, but it is already on.** Quit and reopen Scry Sync. If it still says so after an update, switch Scry Sync off and on in **System Settings > Privacy & Security > Screen Recording**.

**The snip is on my computer but not in the dashboard.** The card says **Not sent** when the upload fails; press **Retry**. Snips you **Save** or let time out stay in **Recent snips** until you send them.

**A snip does not show up in search.** Look at its label on the **Mine** tab of the **Snips** page. **Indexing…** means wait a few seconds. **Not searchable (turned off)** means **Make my snips searchable** is off; turn it on. A snip you sent before snips could be searched shows **Not searchable**. For a snip someone shared with you, ask them to check that they still share it and that their switch is on.

More help: [Scry Sync troubleshooting](/guide/scry-sync/troubleshooting), the in-app **Report a problem**, or [support@scrymore.com](mailto:support@scrymore.com).

See also: [What Scry Sync sends and collects](/guide/scry-sync/privacy).
