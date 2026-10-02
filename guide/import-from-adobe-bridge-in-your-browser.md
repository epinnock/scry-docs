# Import from Adobe Bridge in your browser (beta)

> **TL;DR:** Export your pictures from Adobe Bridge into a folder, open your project in the Scry dashboard, choose **Import images** and drop the folder on the page. Your browser reads the Bridge tags, strips everything else out of the picture files, shrinks very large photos and shows you what it found. You confirm, and only the cleaned pictures and five Bridge fields (title, description, keywords, rating and label) are uploaded. A few minutes later you can search them. Nothing to install, no terminal.

::: warning Beta
This page is for people who keep pictures in Adobe Bridge and do not use a terminal. What we have and have not checked:

- **Bridge export settings: checked on a Mac only.** We exported real files from Bridge 2026 on a Mac and confirmed which Export panel settings keep your tags and which lose them (listed in [step 1](#_1-export-from-bridge)). Adobe's help pages describe the same panel on Windows, but we have not run it there yet. Menu names can differ slightly between Bridge versions.
- **Windows: not yet tried with a real Bridge export.** The page works the same way in Edge and Chrome on Windows, and we are arranging a run with a real Windows user before this beta widens.
- **Folders of a few hundred pictures are the target.** A very large folder may be too big for one browser tab; the page tells you if so, and you can import it in parts.

Try it with a small folder first and [tell us](/feedback) what is confusing or breaks.
:::

## What you need

- A Scry account and a **project** to import into. Use a project made for these pictures: everybody who is a member of it can see them.
- The **Developer** role in that project, or **Admin** or **Owner**. People with the **Viewer** role can look around but cannot import; ask a project admin to change your role (see [Members and Invites](/guide/members-and-invites)).
- Adobe Bridge on your Windows PC or Mac, and a recent Chrome, Edge, Safari or Firefox.

If you do not have a project yet, the import page asks for a name and creates one for you before showing the drop area.

If you are comfortable in a terminal, the `scry import` command does the same job from the command line and can also convert PSD, TIFF, HEIC, PDF and AI files. The browser page cannot convert those yet; see [which files work](#which-files-work).

## 1. Export from Bridge

The tags you added in Bridge (title, description, keywords, rating, label) only travel with a picture if the export keeps them. Bridge's defaults do. Three settings do not, and Bridge gives no warning when it drops the tags.

1. In Bridge, select the pictures you want to import.
2. Open Bridge's **Export** panel and choose or create a preset with these settings:
   - **Format:** JPEG or PNG. (Bridge's Export panel offers JPEG, PNG, TIFF and DNG. It cannot export WebP. TIFF and DNG pictures are skipped by this page; see below.)
   - **Metadata:** **All**. **All Except Camera And Camera Raw Info** also works and keeps the same five fields.
   - **Include Original Metadata:** leave it **ticked**. It is ticked by default.
3. Under **Save To**, the default is the pictures' original location. Choose a new, empty folder instead, or use the subfolder option, so the exported pictures end up together in a folder of their own.
4. Choose **Start Export**.

Resizing in the Export panel is fine: your tags are kept when Bridge makes pictures smaller or converts between JPEG and PNG.

::: danger These settings lose your tags
| Bridge Export setting | What survives |
|---|---|
| **Copyright Only** | Nothing. No title, description, keywords, rating or label |
| **Copyright And Contact Info Only** | Only the title |
| **Include Original Metadata** unticked | Nothing |

The pictures still import, but they will not be searchable by your keywords. The review screen warns you when most of the pictures have no Bridge tags (see [step 3](#_3-review-what-was-found)); re-export with **Metadata: All** and drop the new folder.
:::

You do not need to copy `.xmp` sidecar files. Bridge's Export puts the tags inside each picture, and this page ignores sidecar files.

> **[Screenshot placeholder, Stage 5 replaces it]** Bridge's Export panel with Metadata set to All and Include Original Metadata ticked. Design reference: `features/dashboard-import/figma/import-drop-zone-help-open.png` (the "How do I export from Bridge?" help in the drop area).

## 2. Drop the folder

1. Sign in to the [Scry dashboard](https://dashboard.scrymore.com), open your project and choose **Import images**. (A project with no builds yet also shows an **Import images** button in its empty state.)
2. Drag the exported folder onto the page, or choose **Choose a folder**. If your browser cannot take a dropped folder, the page says so and offers **Choose files** instead, where you can select the pictures themselves.

The page reads the pictures on your computer. A progress bar ("Reading 37 of 50 files") shows how far it is, and **Cancel** stops it. **Nothing has left your computer at this point.**

> **[Screenshot placeholder, Stage 5 replaces it]** The drop area, empty and while dragging. Design reference: `features/dashboard-import/figma/import-drop-zone-empty.png`, `import-drop-zone-dragging.png`, `import-reading.png`.

## 3. Review what was found

When reading finishes you see a summary such as **48 images ready, 6 skipped**, and a table of the pictures with a thumbnail, title, keywords, rating and label. Pictures that were shrunk (see [size](#large-pictures-are-shrunk)) are marked **resized**.

- **Ready.** These will be imported.
- **Few tags warning.** If fewer pictures carry Bridge tags than there are pictures, a banner says so, for example: "Only 12 of 48 images have Bridge tags. In Bridge's Export panel set Metadata to All and re-export if you want titles and keywords searchable." You can still import; the pictures are simply not searchable by tags you never exported.
- **Skipped.** Open **Skipped** to see the files that will not be imported, grouped by plain reasons. File names are shown here, on your screen only; they are never sent.

| Reason you may see | What to do |
|---|---|
| **Not supported yet: PSD (3).** (or TIFF, HEIC, PDF, AI) | Export these as JPEG from Bridge first, then drop the new folder |
| **Not an image or unreadable** | The file is damaged or is not a picture. Re-export it |
| **Same picture as another file** | The same picture appeared twice in the folder; one copy is imported and the keywords from both are merged |
| **Too large** | A single file over 256 MB. Make it smaller in Bridge |

Hidden files and system files (such as `.DS_Store` and `Thumbs.db`) are ignored, not listed as skipped.

> **[Screenshot placeholder, Stage 5 replaces it]** The review screen, ready, with skipped files, and with the few-tags banner. Design reference: `features/dashboard-import/figma/import-review-ready.png`, `import-review-with-skipped.png`, `import-review-few-tags.png`, `import-skipped-list.png`.

## 4. Confirm

Choose **Import 48 images** (your number). A confirmation window says where the pictures will go and who processes them. It reads, in full:

> These 48 images will be uploaded to *your project* and processed by Google Gemini and Jina. What is sent: the cleaned image files, each image's size, and the title, description, keywords, rating and label.

Nothing is uploaded until you choose **Upload**. **Cancel** sends nothing.

Two things to know about that wording:

- It names Google Gemini and Jina, which turn each picture into the numbers that search uses. A third service, OpenAI, writes each picture's short description. The [Subprocessors](/subprocessors) page lists every service and what it receives, and is the place to check who is current.
- Scry also records which account ran the import, as it does for any upload.

> **[Screenshot placeholder, Stage 5 replaces it]** The confirm window. Design reference: `features/dashboard-import/figma/import-confirm.png`.

## 5. Upload and wait

A bar shows "Uploading 31.2 of 84 MB", then "Processing on Scry...". When it is done the page says "48 images imported. They will be searchable in about a minute." For a larger folder it takes longer. **View build** opens the new build in your project; **Import more** starts again. The skipped count stays on the page so you can go back to the list.

Every import is a new build in the project. If you import the same folder again you get a second build; the pictures keep the same identity, so search shows one result per picture, not two.

> **[Screenshot placeholder, Stage 5 replaces it]** Uploading and done screens. Design reference: `features/dashboard-import/figma/import-uploading.png`, `import-done.png`.

## What is sent, and what is never sent

Scry keeps five Bridge fields and nothing else.

| Kept | Limit |
|---|---|
| **Title** | Up to 200 characters |
| **Description** | Up to 2,000 characters read; Scry indexes the first 1,000 |
| **Keywords** | Up to 50 per picture, 64 characters each |
| **Rating** | 1 to 5 stars |
| **Label** | Up to 32 characters (for example a colour label) |

**Sent:** the cleaned picture file, its size, and those five fields.

**Never sent:**

- **Location and camera data.** GPS position, camera and lens details, serial numbers and every other piece of metadata in the file are removed in your browser before anything is uploaded.
- **People's names** stored in the file's metadata (creator, copyright holder, contact details).
- **File names and folder paths.** The upload names each picture by a code made from its contents, not by its file name. Your folder names never leave the page.

The only thing Scry keeps about files it skipped is a count by type (for example "3 PSD, 1 TIFF"), never a name. We use these counts to decide which file types to support next.

Two limits to keep in mind:

- **What is in the picture is sent.** A visible street sign, a face or a client's logo is part of the pixels.
- **Text you wrote is sent as written.** Scry removes markup and control characters from titles and keywords and shows them only as plain text. Do not put secrets, file paths or private notes in titles, descriptions or keywords.

## Which files work

| In your folder | What happens |
|---|---|
| **JPEG, PNG, WebP** | Imported |
| **PSD, TIFF, HEIC, PDF, AI** | Skipped, with the reason "Not supported yet". Export them as JPEG from Bridge. Converting these in the browser may come later |
| Anything else (GIF, camera RAW, video, text) | Ignored |

One import takes at most 10,000 pictures. Subfolders are read; hidden files are skipped.

### Large pictures are shrunk

A picture that is already up to 4 MB and 4,096 pixels on its longest side is imported as it is, with only the extra metadata removed. A bigger one is shrunk in your browser to at most 2,048 pixels on its longest side before it is uploaded, and the page marks it **resized**. A WebP that has to be shrunk is saved as PNG or JPEG. Shrinking does not change a picture's identity, so importing a shrunk picture again later is still recognised as the same picture. The original file on your computer is never changed.

## Who can see the pictures

An imported collection is an ordinary project and follows the project's visibility. In a **private** project, only its members can search or open the pictures. In a **public** project anyone can. Do not import into a public project unless you mean the pictures to be public. For the details and limits of what "private" covers, and for how to have a collection removed, see [Privacy](/privacy); removal is a manual request to <privacy@scrymore.com> today, and deleting a build or project in the dashboard does not remove the stored pictures yet.

## If something goes wrong

**"Upload failed. Nothing was imported."** The page shows a **Ref** code. A failed or interrupted upload never leaves a finished build behind: a half-finished one is marked failed and cleaned up. If your connection dropped at the very last step, the page checks whether the import went through before asking you to try again. Choose **Try again**, and if it keeps failing [contact us](/feedback) with the Ref code.

**"You don't have access to this project."** You are signed in but are not a member of the project. Ask a project admin to invite you.

**"Viewers can't import images."** You have the Viewer role. Ask a project admin to give you the Developer role.

**There is no Import images button.** The feature is switched on gradually during the beta. Ask us if you need it.

**Titles and keywords are missing.** The export dropped the tags; see the settings table in [step 1](#_1-export-from-bridge) and re-export with **Metadata: All**.

**The page says the folder is too big for this tab.** Import it in smaller parts, for example 500 pictures at a time. A single import is limited by what your browser tab can hold.

## Not in this beta

Converting PSD, TIFF, HEIC, PDF and AI files; reading `.xmp` sidecar files; resuming an interrupted upload; adding pictures to an existing build; removing pictures from the page; a "Send to Scry" panel inside Bridge; Lightroom and other tools.
