---
title: Disconnect a device
description: "Stop Scry Sync from sending pictures, either from the app or from Scry, and what stays behind."
---

# Disconnect a device

When you sign in, Scry gives that computer its own access to **one project, for adding pictures only**. It cannot read, list or change anything else, and it is not your personal login. Disconnecting ends that access.

## From the app

1. Open the Scry Sync popover (click the Scry Sync icon in the menu bar on Mac, or in the notification area on Windows) and choose the gear in its top-right corner. The **Scry Sync Settings** window opens.
2. Next to **Signed in**, choose **Sign out**. Scry Sync asks **Sign out of Scry Sync?**; choose **Sign out** again (or **Cancel**). Scry Sync signs this computer out and returns to its sign-in screen. Your folder and files stay as they are.

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/disconnect-1-app-win.mp4">
    <track kind="captions" src="/videos/disconnect-1-app-win.vtt" srclang="en" default>
  </video>
  <figcaption>Signing out from the app: the gear, Settings, Sign out, and the confirmation before it signs out.</figcaption>
</figure>

<figure class="step-video">
  <video controls preload="metadata" playsinline width="1920" height="1080" src="/videos/disconnect-1-app-mac.mp4">
    <track kind="captions" src="/videos/disconnect-1-app-mac.vtt" srclang="en" default>
  </video>
  <figcaption>Signing out from the app (Mac): the menu bar icon, the gear, Settings, Sign out, the confirmation, and the sign-in screen it returns to.</figcaption>
</figure>

Scry Sync tells the server to cancel this computer's access, then stops. **Your folder and files stay exactly as they are, and pictures already in Scry stay there.** If you are offline, the app tells you the disconnect did not go through and keeps syncing until you try again.

## From Scry

If you no longer have the computer, or someone else's device should lose access, revoke it in Scry:

- **Project owners and admins** see every device connected to a project in the project's settings, under **Devices**, and can revoke any of them.
- **Developers** see and revoke their own devices.
- Your own devices are also listed under **Signed-in devices** in your account.
- Devices are listed by computer name, the name your computer has in its system settings, so rename a computer in the OS if two look alike.

A revoked device stops at its next upload. The app shows **Please sign in again** instead of retrying, and nothing in the folder changes.

## When a device loses access

In this beta a device does not lose access just because it has been idle; ending its access is done by revoking it, as above. Automatic expiry of devices that have not synced for a long time is planned before the public release. If your access to the project changes, the app tells you (**You can't add to "&lt;project&gt;" anymore**, with your project's name in place of `<project>`) and offers to pick another project.

## What stays in Scry

Pictures already sent stay in the project until you delete them there, or delete the project. To remove pictures Scry Sync sent, delete the files from the synced folder **before** disconnecting: the next sync removes their pictures. See [What Scry Sync sends and collects](/guide/scry-sync/privacy) for how long Scry keeps data.

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
