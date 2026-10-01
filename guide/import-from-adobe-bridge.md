# Import from Adobe Bridge (beta)

> **TL;DR:** Export pictures from Adobe Bridge into a folder, then run `scry import <folder> --project <id>`. Scry converts what it can on your machine, keeps only a short list of Bridge metadata (title, description, keywords, rating, label), strips everything else out of the image files, asks you to confirm, and uploads the pictures as a [visual collection](/guide/visual-collections) you can search by text or by image.

::: warning Beta
`scry import` is a beta command. The format conversion for PSD, TIFF, HEIC, PDF and AI has been tested with a stand-in converter, and the command has not yet been run on a large library. Try it on a small folder you are happy to send to the services listed under [Who processes your pictures](#who-processes-your-pictures), and [tell us](/feedback) what breaks.
:::

## When to use this

Use it when you keep photographs, illustrations, logos, textures or mood boards in Adobe Bridge and want to find them again by describing them ("blue ceramic teapot on a white table") or by showing a similar picture. Scry's usual input is screenshots of an app's screens; this command is for pictures that are not app screens.

It is a one-shot import. Scry never scans your Bridge library, never watches a folder and never syncs in the background. It reads the one folder you give it, once.

## Before you start

- A Scry **project** and its API key. Use a project made for this collection: everyone who is a member of it can see the pictures (see [Who can see the pictures](#who-can-see-the-pictures)).
- The Scry deployer CLI (`@scrymore/scry-deployer`). See [Installation](/guide/installation). `import` takes the same configuration as the other commands, so a project ID and API key you already set up are picked up the same way.
- **To convert PSD, TIFF, HEIC, PDF or AI files**, one of these tools installed on your computer:

  | Tool | Converts |
  |---|---|
  | ImageMagick (`magick`, or `convert` on macOS and Linux) | PSD, TIFF, HEIC, PDF, AI |
  | `sips` (built into macOS) | PSD, TIFF, HEIC, PDF, AI |
  | `pdftoppm` (from poppler) | PDF and AI only |

  A converter that is installed but cannot read a particular format simply fails on that file, and the file is skipped.

  PNG, JPEG and WebP need no tool. Without a tool, files that need converting are skipped and the command says why.

## 1. Export from Bridge

1. In Bridge, select the pictures you want to import.
2. Open the **Export** panel and export them to a new, empty folder. Pick the option that keeps the original metadata, so your keywords, rating and label travel with the files. The option names differ between Bridge versions; see Adobe's [Export panel help](https://helpx.adobe.com/bridge/using/export-panel.html).
3. Give the folder only the pictures you mean to send. Do not point the command at your home folder or at a whole library: it refuses those two (your home folder and the disk root).

Bridge keeps keywords, ratings and labels as XMP, either inside the file or in a sidecar `.xmp` next to it. Scry reads both. If you copy files by hand instead of exporting, copy the sidecar with the picture and keep its name (`IMG_1.xmp` or `IMG_1.jpg.xmp`). When a field is in both, the sidecar wins.

## 2. Check what would be sent (dry run)

```bash
scry import ./bridge-export --dry-run
```

A dry run converts the pictures, builds the upload, prints the summary and sends nothing. It does not need `--project` and does not ask you anything.

The summary tells you how many pictures are ready (used as they are, or converted), how many were skipped and why, how many had Bridge metadata, and how many other files in the folder were ignored because they are not images. It lists up to 20 skipped files by name.

A dry run leaves the prepared upload in your computer's temporary folder and prints where. It holds the cleaned pictures and their metadata, so delete it when you are done looking.

## 3. Import

```bash
scry import ./bridge-export --project my-project
```

Before anything leaves your computer, the command prints the summary and asks:

```
These 42 images will be uploaded to project my-project and sent to Google Gemini and Jina for AI captioning and embeddings.
What is sent: the image files (metadata removed), each image's size, and the title, description, keywords, rating and label found for it.
Send 42 images for AI processing? [y/N]
```

Only `y` or `yes` continues. Anything else, including Ctrl-C or Ctrl-D, sends nothing and exits with code 1.

To skip the question in a script, pass `--yes` (or `-y`). A run that is not at an interactive terminal and has no `--yes` sends nothing and says so, so a script cannot send pictures by accident.

| Option | What it does |
|---|---|
| `<folder>` | The folder you exported from Bridge. Only this folder is read. |
| `--project <id>` | The project to upload into. Required unless you pass `--dry-run`. |
| `--deploy-version <name>`, `-v` | A name for this upload. Default: `bundle-` followed by a timestamp. |
| `--api-key <key>` | Project API key. |
| `--api-url <url>` | Upload service URL. |
| `--yes`, `-y` | Confirm that the pictures may be sent for AI processing. Required when not at a terminal. |
| `--dry-run` | Build and check the upload; send nothing. |
| `--verbose` | More logging. |

When the upload is accepted, the command says the pictures are queued. Indexing finishes a little later; the pictures are searchable once the build's processing status is `completed`. Every import is a new upload (a new build) in the project. Each picture keeps the same ID when you import it again, because the ID comes from the picture's contents, not its name or location.

## What is converted

| In your folder | What Scry does |
|---|---|
| PNG, JPEG, WebP | Used as they are, with embedded metadata removed |
| PSD, TIFF, HEIC (HEIF), PDF, AI | Converted to PNG or JPEG on your computer. The original never leaves it. A multi-page PDF or AI file contributes its first page |
| A picture over 20 MB or 16,384 pixels on its longest side | Re-encoded smaller until it fits |
| Anything else (GIF, camera RAW, video, text) | Ignored, and counted in the summary |

Other things to know:

- Subfolders are read. Hidden files and folders are skipped.
- Symbolic links are never followed, for pictures, folders or sidecars. A link, or anything that resolves outside the folder you gave, is skipped and reported.
- One import takes at most 10,000 picture files. Split a bigger folder.
- If two files hold the same picture, one is uploaded and the keywords from both are merged.
- The converters run with memory, disk, pixel-area and time limits, so one damaged file cannot take over your computer. A file that cannot be converted is skipped with a reason; the rest continue.

## What is kept, and what is never sent

Scry keeps five Bridge fields and nothing else.

| Kept | Notes |
|---|---|
| **Title** | Up to 200 characters |
| **Description** | Long text is shortened (to 1,000 characters when indexed) |
| **Keywords** | Up to 50 per picture, 64 characters each |
| **Rating** | 1 to 5 stars. A rating of 0 or "rejected" is not stored |
| **Label** | Up to 32 characters (for example a colour label) |

Creator is not imported.

These are never sent:

- **Location and device data.** GPS, camera serial numbers and every other field in the file's metadata are never read, and EXIF, XMP and IPTC data and anything appended after the end of the picture are removed from the image file that is uploaded. Converted pictures are cleaned the same way.
- **File names and folder paths.** The upload names each picture by a hash, not by its file name.
- **Your source code.** Nothing from the repository is uploaded. The upload does carry the git commit and branch of the repository in the folder you ran the command from, if there is one; the confirmation text shows them.

Two limits to keep in mind:

- **What is in the picture is sent.** A visible street sign, a face or a client's logo is part of the pixels, and the pixels are processed as described below.
- **Text you wrote is sent as written.** Scry removes markup, control characters, text that looks like an instruction to an AI, and text that looks like GPS coordinates or a file path. That cleaning is best effort, not a guarantee, so do not put secrets, file paths or private notes in titles, descriptions or keywords.

## Who processes your pictures

The pictures are sent to Google (Gemini API) to be described, and the pictures and their search text are turned into embeddings by our embeddings provider so they can be searched. The confirmation text names Google Gemini and Jina; our [subprocessor list](/subprocessors) says which of them is active and where each one processes data.

Your title, description and keywords are not given to the model that writes the picture's description. They are added to the text that is indexed for search, and that text is embedded. Text in the picture itself (a sign, a caption) is treated as something to describe, not as an instruction.

## Who can see the pictures

A visual collection is an ordinary project. Only the project's members can find its pictures, through search or the dashboard, and the same rules apply as for any other project. Specifically:

- A person who is not a member gets no rows, descriptions, keywords, image URLs or presigned URLs from search or from the image presign endpoint, whether they search the project, their organisation or everything they can read.
- The image bytes themselves are served by an image proxy that does not check membership. A picture can be fetched by anyone who has its exact storage key, which has the form `<project id>/<build id>/<hash>.<extension>`. The key cannot be guessed, and Scry only shows it to members, but it is a link: it stays valid if someone who once had it is removed from the project, and it can end up in a chat transcript or a log you pasted. Scry does not promise more than that for pictures. The same is true for the screenshots of every project today. It is a known gap that we have logged to fix.

If a collection is more sensitive than that allows, do not import it yet.

## Removing a collection

Deleting a project in the dashboard removes the project and its member list, but not, at that moment, its builds and stored pictures: the delete dialog says so. To have a collection's pictures and search entries removed, email <privacy@scrymore.com> from the address on your account, with the project ID; deletion is done by hand for now. Builds beyond a project's newest 10 are also deleted automatically after 90 days; see [Privacy](/privacy).

## Troubleshooting

**"No supported images found, so nothing was uploaded."** The folder holds no PNG, JPEG or WebP, and either there is no converter installed for the other types or none of them could be converted. Read the skipped lines above that message.

**`skipped IMG_0001.psd: no converter for .psd on this machine`.** Install ImageMagick, or on macOS use the built-in `sips`. For PDF and AI files `pdftoppm` is enough.

**"That folder is too broad."** You passed your home folder or the disk root. Export into a folder of its own.

**"Nothing was uploaded: this shell is not interactive."** Add `--yes` to confirm that the pictures may be sent.

**"symbolic link not followed" or "resolves outside the folder".** Copy the real files into the folder. Scry does not follow links out of it.

**Keywords are missing.** Check that the export kept the metadata, or copy the `.xmp` sidecar next to each picture. The summary says how many pictures had Bridge metadata.

**The upload was rejected.** The command prints the reason and a `Ref:` code. Quote the code when you [contact us](/feedback).

## Not in this beta

A "Send to Scry" panel inside Bridge, background sync, Creative Cloud Libraries, Adobe Stock, writing tags back into Bridge, camera RAW files and video.

## Next

[Visual collections](/guide/visual-collections): search the pictures you imported, from Claude or from the API.
