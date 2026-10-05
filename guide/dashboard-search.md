# Search in the dashboard

The dashboard has a **Search** page (`/search`, in the sidebar) that finds screens across your indexed Storybook builds. You can search by text, by image, or by both, narrow the search to chosen projects, and decide whether to see only the newest version of each screen or older versions too. It runs the same search as the [search API](/api/search), the [MCP server](/guide/mcp) and Scry Link, and it returns only what your account can already read.

## Run a search

Open **Search** in the sidebar, type what you are looking for, and press Enter or **Search**. You need text, an image, or both. The button stays disabled until there is something to search for, and **Esc** clears the field.

| You give | Scry searches for |
|---|---|
| Text only | Screens whose name, story, or content matches the description, for example `login form with error state` |
| An image only | Screens that look like the image |
| Text and an image | Both together: the image sets what the screen looks like, and the text steers it |

To search by image, click the image area and choose a file, drag a file onto the search box, or paste an image from the clipboard. A thumbnail appears with a remove button. The image must be **PNG, JPG or WebP and no larger than 8 MB**. Anything else is rejected before it is sent, with a message saying why. Large images are shrunk in your browser before they are sent, and WebP images are converted to JPEG, so the search always receives a PNG or JPEG.

Each result shows the screenshot, the screen's name, the project it belongs to, a **Public** or **Private** label, whether it is the **Latest** version or an **Older version** (a project with no recorded latest build shows neither label), and its match score. Where a screen has a Storybook page, the result links to it. Long result lists load a page at a time.

## Choose projects

The project filter lists the projects you can search, in two groups:

- **Private projects**: projects whose visibility is private. You see only the ones you are a member of.
- **Public projects**: projects whose owners have made them public, including other teams' projects.

A project's group follows its visibility, not who owns it. Projects you belong to are marked as yours, in either group. Each group shows a count, and has **Select all** and **Clear** controls. Selected projects appear as chips above the results.

If you select nothing, the filter reads **All projects** and Scry searches everything you can search. Selecting a few restricts the results to those projects and no others.

### Limits

- A search covers at most **100 projects**. If more than 100 are available to you, the list is cut off and a notice says so. Pick the projects you care about to search them directly.
- If you have chosen a project that you can no longer read, for example because your access was removed, Scry leaves it out of the search and the results page tells you which projects were skipped. It never widens the search to make up for it.

## Latest or older versions

Every time a build is indexed, its screens are indexed again and the older copies are kept. The **Latest versions only** switch controls which you see:

- **Latest versions only** (the default): each project is searched at its most recent indexed build, so you see the screens as they are now.
- **Include older versions**: builds before the latest are searched too. Results from them are labelled **Older version**. Use this to find a screen that has since been removed or changed, or to compare how a screen looked across deploys.

The setting is part of the page address, together with your text and chosen projects, so you can share or bookmark a search. Images are not kept in the address; the link restores the text, the projects and the switch.

## What you can and cannot see

- You see screens from projects you are a member of, and from projects that are public.
- You never see a private project you are not a member of, even if someone sends you its id. The check runs on the server for every project in every search.
- Search needs you to be signed in. Signed-out visitors are sent to sign in.

Searching also uses AI credits, charged to the workspace described in [How credits work](/guide/credits#who-pays). If the balance has run out, the page shows a message saying so instead of results.

## Troubleshooting

**A message that search is not available.** The search service is not reachable or not configured. Try again in a minute; if it persists, tell us on the [feedback form](/feedback) and include the request id from the message, if there is one.

**No results.** Check which projects are selected, and whether **Latest versions only** is on. A screen that exists only in an older build appears only when older versions are included.

**A project is missing from the filter.** The filter lists projects you are a member of and public projects. Ask a project admin to add you (see [Members and invites](/guide/members-and-invites)).

**An image is rejected.** Use PNG, JPG or WebP under 8 MB. Screenshots exported at very high resolution may need to be resized.

**A search fails with a temporary error.** Search again. The message includes a request id; see [Request ids](/api/request-ids) if you contact us.

## Related

- [Search API](/api/search) for the request and response fields behind this page
- [MCP Server](/guide/mcp) to search from an AI assistant
- [How credits work](/guide/credits)
