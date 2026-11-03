---
title: Clipboard across computers
description: "Scry Sync puts your snips on the clipboard of every computer you are signed in on, and adds Scry Copy and Scry Paste hotkeys that copy and paste between them."
---

# Clipboard across computers

::: info Rolling out
This is part of [Scry Sync](/guide/scry-sync/) 0.1.21 and later. It turns on as Scry enables it for your account. Until then, the **Clipboard** tab does not appear in Settings.
:::

If you use Scry Sync on more than one computer and sign in as the same person on each, they share one clipboard for Scry:

- **Snips go everywhere.** Take a [snip](/guide/scry-sync/snip) on one computer, and a few seconds after it reaches Scry the picture is on the clipboard of your other computers too. They show a notification: "Snip from your other computer is on your clipboard".
- **Scry Copy and Scry Paste** work like normal copy and paste (text, formatted text and pictures), except the copy reaches all your computers.

## Hotkeys

| | Mac | Windows | What it does |
|---|---|---|---|
| **Scry Copy** | **Control + Option + C** | **Ctrl + Alt + C** | Copies what is selected in the app in front and sends it to all your computers. You see "Copied to all your computers". |
| **Scry Paste** | **Control + Option + V** | **Ctrl + Alt + V** | Pastes your newest snip or Scry Copy, from any of your computers, into the app in front. |

Your normal copy and paste (Cmd+C / Ctrl+C) stay on the one computer. Only Scry Copy and snips travel.

To change a hotkey, open **Settings** in Scry Sync, go to the **Clipboard** tab, press **Record new** next to **Scry Copy hotkey** or **Scry Paste hotkey** and press the keys you want. Esc cancels. If another app already uses those keys, Scry says so.

## Let Scry Sync press copy and paste (Mac)

To copy what is selected and paste into the app in front, Scry Sync presses Cmd+C and Cmd+V for you. On a Mac that needs **Accessibility** permission. **Settings > Clipboard** shows **Let Scry Sync press copy and paste** with **Granted** or **Not granted**; press **Open System Settings** and turn on Scry Sync under **Privacy & Security > Accessibility**.

Without it, Scry Copy sends what is already on your clipboard, and Scry Paste puts the item on your clipboard and tells you "Press ⌘V to paste". Windows needs no permission.

## What it will not do

- It never replaces your clipboard with something old. When a computer starts, wakes up or signs in, it does not paste in what it missed; it only takes items made in the last two minutes, and never one it made itself.
- Nothing from your clipboard leaves your computer unless you press Scry Copy or take a snip.
- Copied files and folders do not travel (only any text the system puts on the clipboard with them). Phones and clipboard history are not included.
- Sizes: text up to 512 KB, pictures up to 20 MB. Anything bigger shows "Too big to copy to your other computers".

Only you can see your items: other people in your projects never get your clipboard or your snips this way. Your other computers can get a Scry Copy for 24 hours, and each new one replaces the last.

## Turn it off

In **Settings > Clipboard**, turn off **Share my clipboard with my other computers**. Scry Sync then stops checking for new items on that computer and releases both hotkeys. Snips still go to your project as before.
