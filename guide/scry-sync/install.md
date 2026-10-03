---
title: Install Scry Sync and first run
description: "Install Scry Sync on Mac or Windows, get past the one-time unsigned-beta warning, and sign in with your browser."
---

# Install and first run

The beta installers are **not code-signed**. Your operating system warns you once because it does not recognise the publisher. That does not mean anything is wrong with the file. Check that you downloaded it from the link in your beta invite, then follow the steps for your system. You only do this once per install.

## Mac

Needs macOS 13 (Ventura) or later (Apple silicon and Intel).

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

Needs Windows 11.

1. Run `Scry Sync-Setup-<version>.exe`.
2. Windows SmartScreen shows **Windows protected your PC**. Click **More info**, then **Run anyway**.
3. If Windows blocks the file after download: right-click it, choose **Properties**, tick **Unblock** at the bottom, click **OK**, and run it again.

The app tells you when a new version is ready.

## First run

1. **Sign in with your browser.** The app opens Scry in your browser and shows a short code. Check the code matches, choose the project the pictures should go to (only projects you can add to are listed), and approve. You never paste a key.
2. **Choose a folder.** See [Connect a folder](/guide/scry-sync/connect-a-folder).
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
