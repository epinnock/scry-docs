---
title: Install Scry Sync and first run
description: "Download and install Scry Sync on Windows, get past the one-time unsigned-beta warning, and sign in with your browser. The Mac installer is not published yet."
---

# Install and first run

The beta installers are **not code-signed**. Your operating system warns you once because it does not recognise the publisher. That does not mean anything is wrong with the file. Check that you downloaded it from the link on this page, then follow the steps for your system. You only do this once per install.

The Windows installer is on this page. The Mac installer is not published yet; this page will carry its link when it is.

## Mac

The Mac installer is not published yet, so there is nothing to download for Mac today. These are the steps you will follow once it is. It needs macOS 13 (Ventura) or later (Apple silicon and Intel).

1. Open the downloaded `.dmg` and drag **Scry Sync** into **Applications**.
2. In **Applications**, hold Control and click (or right-click) **Scry Sync**, choose **Open**, then click **Open** in the dialog.
3. If macOS only offers **Done** or **Move to Trash** (macOS 15 and later), open **System Settings → Privacy & Security**, scroll to the message about Scry Sync, click **Open Anyway**, and confirm with your password.

If you prefer Terminal, this clears the warning for the app:

```sh
xattr -dr com.apple.quarantine "/Applications/Scry Sync.app"
```

::: warning Updates on Mac are manual during the beta
The app shows a notice when a new version is available. Download the new `.dmg` and replace the app in **Applications**. Because the app is not signed, macOS may ask for Keychain access again, or the app may ask you to sign in again, after an update.
:::

## Windows

Needs Windows 10 or Windows 11 (64-bit).

1. [Download the Windows installer](https://updates.scrymore.com/latest/Scry-Sync-Setup.exe) (about 120 MB). This link always gives you the newest version, and the file you save has the version in its name, for example `Scry Sync-Setup-0.1.1.exe`.
2. Run it. The installer is one click, installs for your user only (there is no administrator prompt), and Scry Sync opens when it finishes.
3. Windows SmartScreen shows **Windows protected your PC** and says the publisher is unknown. Click **More info**, then **Run anyway**. The **Run anyway** button only appears after you click **More info**.
4. If Windows blocks the file after download: right-click it, choose **Properties**, tick **Unblock** at the bottom, click **OK**, and run it again.

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

1. **Sign in with your browser.** The app opens Scry in your browser and shows a short code. Check the code matches, choose the project the pictures should go to (only projects you can add to are listed), and approve. You never paste a key.
2. **Choose a folder.** See [Connect a folder](/guide/scry-sync/connect-a-folder). (A later version is planned to offer Creative Cloud Libraries here too: [Sync Creative Cloud Libraries](/guide/scry-sync/creative-cloud-libraries), in development.)
3. A one-time notice explains the anonymous usage data and error reports the app shares, and where to turn them off. See [What Scry Sync sends and collects](/guide/scry-sync/privacy).

After that the app lives in the menu bar (Mac) or system tray (Windows). Click the icon to see the project and folder, the latest activity, anything that needs attention, and **Pause**, **Open in Scry** and **Settings**.

## The tray icon

| Icon | Meaning |
|---|---|
| Up to date | Everything in the folder is in Scry. |
| Syncing | Converting or sending. You can keep working. |
| Paused | You paused it. Pausing is for a set time and survives a restart. |
| Needs attention | At least one file or the sync itself has a problem; open the popover. |
| Stopped | Offline, or Scry no longer accepts this computer. |
| Signed out | Sign in again from the popover. Nothing in your folder is changed. |
