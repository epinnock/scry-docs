---
title: Disconnect a device
description: "Stop Scry Sync from sending pictures, either from the app or from Scry, and what stays behind."
---

# Disconnect a device

When you sign in, Scry gives that computer its own access to **one project, for adding pictures only**. It cannot read, list or change anything else, and it is not your personal login. Disconnecting ends that access.

## From the app

1. Open the Scry Sync popover and choose **Settings**.
2. Choose **Sign out** (the app also calls this **Disconnect**) and confirm.

Scry Sync tells the server to cancel this computer's access, then stops. **Your folder and files stay exactly as they are, and pictures already in Scry stay there.** If you are offline, the app tells you the disconnect did not go through and keeps syncing until you try again.

## From Scry

If you no longer have the computer, or someone else's device should lose access, revoke it in Scry:

- **Project owners and admins** see every device connected to a project in the project's settings, under **Devices**, and can revoke any of them.
- **Developers** see and revoke their own devices.
- Your own devices are also listed under **Signed-in devices** in your account.
- Devices are listed by computer name, the name your computer has in its system settings, so rename a computer in the OS if two look alike.

A revoked device stops at its next upload. The app shows **Please sign in again** instead of retrying, and nothing in the folder changes.

## Access that lapses on its own

A device that has not synced for a year loses its access automatically. If your access to the project changes, the app tells you (**You can't add to "&lt;project&gt;" anymore**, with your project's name in place of `<project>`) and offers to pick another project.

## What stays in Scry

Pictures already sent stay in the project until you delete them there, or delete the project. To remove pictures Scry Sync sent, delete the files from the synced folder **before** disconnecting: the next sync removes their pictures. See [What Scry Sync sends and collects](/guide/scry-sync/privacy) for how long Scry keeps data.
