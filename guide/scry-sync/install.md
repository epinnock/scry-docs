---
title: Install Scry Sync and first run
description: "Download and install Scry Sync on Mac or Windows, get past the one-time first-open prompt, and sign in with your browser."
---

# Install and first run

The installers are **signed**. On Mac the app is also notarized by Apple, so macOS asks you to confirm the first time you open it. On Windows, SmartScreen can still show a warning for an app that few people have downloaded yet. Download the installer from the link on this page, then follow the steps for your system. You only do this once per install.

Both installers are on this page: Mac and Windows.

## Mac

Needs macOS 13 (Ventura) or later, on Apple silicon or Intel. Not sure which you have? Choose **Apple menu → About This Mac**: **Chip: Apple M…** is Apple silicon, **Processor: Intel…** is Intel.

1. Download the installer for your Mac. These links always give you the newest version, and the file you save has the version in its name.
   - [Download for Apple silicon (M1 and later)](https://updates.scrymore.com/latest/Scry-Sync-arm64.dmg)
   - [Download for Intel](https://updates.scrymore.com/latest/Scry-Sync-x64.dmg)
2. Open the downloaded `.dmg` and drag **Scry Sync** into **Applications**.
3. Open **Scry Sync** from **Applications**. macOS says it is an app downloaded from the Internet and that Apple checked it for malicious software. Click **Open**.

Scry Sync lives in the menu bar at the top of the screen, not in the Dock. If you want to use [Scry Snip](/guide/scry-sync/snip), macOS asks you to allow **Screen Recording** the first time you take a snip, and you may need to add **Scry Sync** to the list yourself. See [Mac: Screen Recording](/guide/scry-sync/snip#mac-screen-recording).

::: warning Updates on Mac are manual during the beta
The app checks for a new version when it starts and every six hours, and shows a notice, **A new version is available**, with a link to this page. It never installs anything by itself on Mac. Download the new `.dmg` from this page and replace the app in **Applications**.
:::

## Windows

Needs Windows 10 or Windows 11 (64-bit).

1. [Download the Windows installer](https://updates.scrymore.com/latest/Scry-Sync-Setup.exe) (about 120 MB). This link always gives you the newest version, and the file you save has the version in its name.
2. Run it. The installer is one click, installs for your user only (there is no administrator prompt), and Scry Sync opens when it finishes.
3. Windows SmartScreen may show **Windows protected your PC** and say it prevented an unrecognized app from starting. The installer is signed, and SmartScreen warns about any app that few people have downloaded yet. Click **More info**, check that the **Publisher** line shows a name, then click **Run anyway**. The **Run anyway** button only appears after you click **More info**.
4. If Windows blocks the file after download: right-click it, choose **Properties**, tick **Unblock** at the bottom, click **OK**, and run it again.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/install-2-open-win.mp4">
    <track kind="captions" src="/videos/install-2-open-win.vtt" srclang="en" default>
  </video>
  <figcaption>Windows steps 2 and 3: running the installer, getting past the one-time SmartScreen warning with More info and Run anyway, and Scry Sync opening on its sign-in screen.</figcaption>
</figure>

The tray icon may sit behind the hidden-icons arrow (^) at the right of the taskbar. Drag it out onto the taskbar if you want it always in view.

::: tip Scry Sync starts when you sign in to Windows
It starts hidden in the tray, so you do not see a window. Settings has a switch if you would rather open it yourself from the **Start** menu.
:::

::: warning Updates are manual during the beta
The app checks for a new version when it starts and every six hours, and shows a notification, **A new version is available**, when there is one. Download the new installer from this page and run it over the old one. Your settings are kept.

Settings has an **Install updates automatically** switch. It is off by default, so nothing is downloaded or installed unless you turn it on.
:::

To remove Scry Sync, open **Settings → Apps**, choose **Scry Sync** and click **Uninstall**. Uninstalling leaves your settings and logs in `%APPDATA%\Scry Sync`. Delete that folder yourself if you want them gone.

## First run

1. **Sign in with your browser.** Choose **Sign in with your browser**. The app shows a short code and opens a sign-in page, which also offers **Create your account** with Google, GitHub or email if you are new to Scry. Type the code from the app into the page, choose the project the pictures should go to (only projects you can add to are listed), and approve. You never paste a key.
2. **Choose how to use Scry.** The Welcome screen asks **How do you want to use Scry?** **Snip only** takes screenshots by hotkey and watches no folder. **Sync a folder too** keeps a folder, or Creative Cloud Libraries, in sync as well. See [Connect a folder](/guide/scry-sync/connect-a-folder).
3. A one-time notice explains the anonymous usage data and error reports the app shares, and where to turn them off. See [What Scry Sync sends and collects](/guide/scry-sync/privacy).

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/signin-1-browser-win.mp4">
    <track kind="captions" src="/videos/signin-1-browser-win.vtt" srclang="en" default>
  </video>
  <figcaption>First run, step 1: Sign in with your browser. The app shows a code, you type it into the sign-in page, choose the project and approve.</figcaption>
</figure>

After that the app lives in the menu bar (Mac) or system tray (Windows). Click the icon to see the project and folder, the latest activity, anything that needs attention, and **Pause**, **Open in Scry** and the **Settings** gear.

## The tray icon

| Icon | Meaning |
|---|---|
| Up to date | Everything in the folder is in Scry. |
| Syncing | Converting or sending. You can keep working. |
| Paused | You paused it. Pausing is for a set time and survives a restart. |
| Needs attention | At least one file or the sync itself has a problem; open the popover. |
| Stopped | Offline, or Scry no longer accepts this computer. |
| Signed out | Sign in again from the popover. Nothing in your folder is changed. |

<style>
.step-video {
  margin: 24px 0;
}
.step-video video {
  width: 100%;
  height: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  display: block;
}
.step-video figcaption {
  margin-top: 8px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
</style>
