---
title: Search your pictures
description: "Press a shortcut in any app and find a picture, or a moment in a video, by what it looks like or what is in it. Choose for each folder whether it is searched on this computer or synced to Scry. Setup, keys, privacy and requirements."
---

# Search your pictures

::: info Beta
Search is part of [Scry Sync](/guide/scry-sync/) and is in beta. It appears in your app when it is turned on for your account.
:::

Press a shortcut in any app, type what you remember ("checkout with a credit card", "dark music player", "someone typing a password"), and pick up the picture, or the moment in a video. It searches the folders Scry Sync already knows about: your **Sync folder** and your **Scry Snips folder**.

You decide, folder by folder, where each one is searched:

- **Sync to Scry**: the folder uploads to your Scry project, as Sync always has, and it is searched in Scry.
- **On this computer**: nothing in the folder uploads on its own, and it is searched on your computer.

One search covers both. The results arrive in one list.

## What it finds

- **Pictures and videos.** You can find a video by what happens in it. The preview starts at the second that matched.
- **By what it looks like.** "Pricing page with three plans" finds pictures that look like that.
- **By what is in it.** For pictures kept on this computer, a short description is written on your computer (the words in the picture, the parts of the screen, the style). Words you type are matched against it, too.
- **Newest first while it works.** A picture you took a moment ago is searchable within seconds, even while older ones wait for their descriptions.

Videos are searched only in folders kept **On this computer**. Scry cloud search finds pictures only, so a video in a folder set to **Sync to Scry** is not searched.

## Open the search

| | Shortcut | Also |
|---|---|---|
| **Mac** | **Control + Option + Space** | The **Search pictures** item in the menu bar |
| **Windows** | **Ctrl + Shift + Space** | The **Search pictures** item in the tray menu |

The panel opens over whatever you are doing. Click away or press **Esc** to close it. Your last search is still there when you open it again.

To use another shortcut, choose **Change** next to it (on the first-open card, and in Scry Sync's Settings). If another app already uses the one you pick, the panel says it is taken and keeps the old one. Word and Excel already use Ctrl + Shift + Space on Windows, and Photoshop uses combinations with Space, so change it if the panel does not open.

<div class="shot-pair">
  <figure class="shot shot-placeholder">
    <div class="shot-box">PLACEHOLDER(shot-panel-mac): the search panel with results on a Mac, one image for light and one for dark</div>
    <figcaption>The search panel on a Mac: the search field, results from this computer and from Scry, and the preview.</figcaption>
  </figure>
  <figure class="shot shot-placeholder">
    <div class="shot-box">PLACEHOLDER(shot-panel-win): the search panel with results on Windows, one image for light and one for dark</div>
    <figcaption>The same panel on Windows.</figcaption>
  </figure>
</div>

## The keys

| | Mac | Windows |
|---|---|---|
| Move through the results | **Up** and **Down** | **Up** and **Down** |
| Open the file. A picture synced to Scry opens in Scry. | **Return** | **Enter** |
| Show it in Finder or File Explorer (pictures kept on this computer) | **Command + Return** | **Ctrl + Enter** |
| Copy the picture. For a synced picture, copy its link. | **Command + C** | **Ctrl + C** |
| Find more like this one | **Command + F** | **Ctrl + F** |
| Choose where each folder is searched | **Command + ,** | **Ctrl + ,** |
| Close the panel | **Esc** | **Esc** |

You can also drag a picture from the results into another app.

**More like this** looks for similar pictures on this computer only. Nothing is uploaded to compare it. When the picture is kept on this computer, the panel says Scry cloud was not searched.

The buttons beside the search field show **All**, only **Pictures**, only **Videos** or only **Snips**. Each side of the search looks only at the folders set to its own choice: your computer searches the folders kept **On this computer**, and Scry searches the pictures already synced from folders set to **Sync to Scry**. Results from this computer appear first and the ones from Scry join them when they arrive. A small mark on each row says where it came from.

## Choose where each folder is searched

Both folders start as **Sync to Scry**, which is how Scry Sync works today. Nothing changes until you choose. Open the choice with **Folders** in the panel (**Command + ,** on a Mac, **Ctrl + ,** on Windows).

| | Sync to Scry | On this computer |
|---|---|---|
| **Uploaded to Scry** | Yes, converted pictures only, as described in [What Scry Sync sends and collects](/guide/scry-sync/privacy) | **Not on its own.** Pressing **Send** on one snip's card still sends that snip. |
| **Searched** | In Scry, with the search the dashboard uses | On this computer, by look and by description |
| **Videos** | Not searched | Searched |
| **Needs a download** | No | Yes, once. See [Set up search on this computer](#set-up-search-on-this-computer). |
| **Needs the internet** | Yes | No |
| **Also appears in your dashboard and for your agent** | Yes | No |

Each of the two folders has its own setting. You can keep your Snips syncing and keep a client's references on this computer.

<div class="shot-pair">
  <figure class="shot shot-placeholder">
    <div class="shot-box">PLACEHOLDER(shot-folders-mac): the Folders choice on a Mac, light and dark</div>
    <figcaption>Folders on a Mac: each folder is Sync to Scry or On this computer.</figcaption>
  </figure>
  <figure class="shot shot-placeholder">
    <div class="shot-box">PLACEHOLDER(shot-folders-win): the Folders choice on Windows, light and dark</div>
    <figcaption>Folders on Windows.</figcaption>
  </figure>
</div>

### Move a folder to this computer

The app asks you to confirm first. From then on, nothing in that folder uploads on its own, and it is searched on this computer.

- **Your Sync folder.** Scry Sync still watches the folder and notes what changes, but sends nothing, and an upload that is under way stops. The tray menu shows **Kept on this computer** in place of the paused state, and it has no **Resume** button, because there is nothing to resume.
- **Your Snips folder.** A new snip is not sent automatically. If **Send immediately** is on, the snip stops at its [review card](/guide/scry-sync/snip#review-then-send) instead. A snip that was waiting to send when you changed the setting is held, not sent. Pressing **Send** on a snip's card still sends that one snip, because you chose to send it.
- **Pictures already in Scry stay there** until you delete them in Scry. Moving the folder does not delete them. Deleting is a separate step in the dashboard.
- If search on this computer is not set up yet, the first search waits for the one-time download.

The setting stays in force if search is later turned off for your account: a folder set to **On this computer** still does not upload on its own. Turning search off only hides it.

### Move a folder back to Scry

Choose **Sync to Scry** again. The app asks you to confirm first. The confirmation names your Scry project and what each new or changed picture costs in credits (see [How credits work](/guide/credits)), as it does when you connect a folder. Nothing uploads before you confirm. After that, Sync goes back to its normal behaviour for that folder and uploads what is new or changed.

## Set up search on this computer

The first time you keep a folder on this computer, Scry Sync downloads what it needs. It never downloads anything by itself. You start it, and **Cancel** stops it and keeps what has arrived, so the next try carries on from there.

| What | Size | When |
|---|---|---|
| The search program, from Scry | PLACEHOLDER engine pack size | First |
| The search model, which reads what a picture looks like | about 0.9 GB | After the program |
| The description model, which writes what is in a picture | about 1.8 GB | Also downloaded, so descriptions can start |

Search works as soon as the search model has arrived. Descriptions are added when the description model is ready too. The panel shows how far each download has got. The downloads are checked against fixed checksums before they are used.

The program comes from Scry's own server. The two models come from Hugging Face, a public model host. See [What leaves your computer](#what-leaves-your-computer).

## While it works

Scry Sync prepares each picture in two steps, newest first.

1. **Searchable by look.** This is what lets a new snip turn up within seconds. It runs whenever there is something new. Without a graphics card, a picture takes roughly 4 to 9 seconds. It is much faster with a supported graphics card.
2. **Described.** A small model on your computer looks at the picture and writes what is in it. This is slower: roughly 30 to 60 seconds a picture without a graphics card, and much faster with one.

**Describing runs only while the computer is idle and plugged in.** It starts after the computer has had no keyboard or mouse input for 2 minutes and is not running on battery. It stops within a few seconds when you touch the keyboard or mouse, unplug the computer, or let it sleep. The picture it was working on waits and starts again later. Nothing is lost.

Until a picture is described, it is found by how it looks, and its details say **Not described yet**. The panel's status line shows how many pictures are searchable and how many are described.

A big folder can take a few hours the first time on a computer without a graphics card. Search works on whatever is ready.

## What Scry cloud search covers

For folders set to **Sync to Scry**, the panel asks Scry for the pictures you have already synced.

- **Only your project.** It searches the one project your Sync folder uploads to. It does not search other projects, builds or screens. For those, use [Image search in the dashboard](/guide/dashboard-search).
- **Pictures.** Results come from the same search the dashboard's Image search uses, limited to that project. Cloud rows show the picture's name and have no description in the panel.
- **Needs the internet and a signed-in app.** If you are offline, results from this computer still show, and the panel says Scry cloud could not be reached. If you are signed out, sign in again from the tray or menu bar.
- **Credits.** Searching a folder On this computer does not use credits. A search in Scry cloud is charged the way the same person's search in the dashboard is (see [How credits work](/guide/credits)). When your credits run out it falls back to keyword search, as it does in the dashboard ([When you run out](/guide/credits#when-you-run-out)). Pictures uploaded from a folder set to **Sync to Scry** use credits as described in the same page.
- **A moment longer.** Results from this computer show first. The ones from Scry join the list when they arrive. A slow answer shows a timer and a **Try again** button.

## What leaves your computer

| | What is sent |
|---|---|
| **Searching a folder On this computer** | Nothing. The pictures, the descriptions, the index and what you type stay on your computer. |
| **Searching Scry cloud** | The words you type, sent to Scry over an encrypted connection with this computer's access key, to search your project. Scry logs a request id, not your words. The thumbnails come back from Scry. |
| **More like this** on a picture kept here | Nothing. |
| **Send** on a snip's card, in a Snips folder kept On this computer | That one snip, to your Scry project, as for any snip. Nothing else in the folder. |
| **Setup downloads** | Your computer asks Scry for the search program and Hugging Face for the two models. They see an ordinary download request, with your computer's address. No picture, file name or search is in it. |
| **Usage data** | No search text, file names or pictures. See [What Scry Sync sends and collects](/guide/scry-sync/privacy). |

For a folder kept on this computer, the descriptions are written on your computer and no picture is sent to an AI service for them. A folder set to **Sync to Scry** is processed in Scry as described in [What Scry Sync sends and collects](/guide/scry-sync/privacy).

## Requirements

| | Needed |
|---|---|
| **Mac** | macOS 13.3 or later, Apple silicon or Intel, to search a folder On this computer. Scry Sync itself runs on macOS 13 and later; see [Install and first run](/guide/scry-sync/install). |
| **Windows** | Windows 10 version 2004 or later, or Windows 11, 64-bit. |
| **Disk space** | About 2.7 GB for the two models, plus the search program (see the table above). |
| **Memory** | About 1.2 GB for searching, and about 2.3 GB more while it describes. The second part is given back after 5 minutes with nothing to describe. |
| **Graphics** | Not required. A supported graphics chip makes it much faster, and the app uses it when there is one. |
| **Account** | Scry Sync signed in. Searching a folder On this computer needs no internet after setup. |

## When something is not right

| What you see | What to do |
|---|---|
| The shortcut does nothing | Another app may use it. Choose another shortcut with **Change** (see [Open the search](#open-the-search)). The **Search pictures** item in the tray or menu bar always opens the panel. |
| The panel says it is getting search ready | The one-time download is still running. It carries on if you close the panel. If it stopped, choose **Download** again to resume. |
| **Search stopped** | The search program quit twice in a row. Choose **Restart**. If it stops again, use **Send feedback** in Settings. |
| A new picture does not show up | Pictures are made searchable newest first. The panel's status line shows how far it has got. |
| A picture says **Not described yet** | Descriptions wait until the computer is idle for 2 minutes and plugged in. Search by look works meanwhile. |
| The tray says **Kept on this computer** | Your Sync folder is set to **On this computer**, so nothing in it uploads. To sync it to Scry again, open **Folders** and choose **Sync to Scry**. |
| **Send immediately** shows the review card | Your Snips folder is set to **On this computer**, so snips are not sent automatically. Press **Send** on the card to send that one snip. |
| A video does not show up | Videos are searched only in folders set to **On this computer**. |
| No results from Scry cloud | You may be offline or signed out. Results from this computer still show. |

For anything else, see [Scry Sync troubleshooting](/guide/scry-sync/troubleshooting), or use **Send feedback** in the app's Settings, or write to [support@scrymore.com](mailto:support@scrymore.com).

<style>
.shot-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin: 24px 0;
}
.shot {
  margin: 0;
  min-width: 0;
}
.shot img {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: block;
}
.shot .shot-dark { display: none; }
.dark .shot .shot-light { display: none; }
.dark .shot .shot-dark { display: block; }
.shot-box {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 32px 16px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  overflow-wrap: anywhere;
}
.shot figcaption {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
@media (max-width: 640px) {
  .shot-pair { grid-template-columns: minmax(0, 1fr); }
}
</style>
