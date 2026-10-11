# Image search in the dashboard

The dashboard has an **Image search** page (`/search`, in the sidebar) that finds screens across your indexed Storybook builds. You can search by text, by image, or by both, narrow the search to chosen projects, and decide whether to see only the newest version of each screen or older versions too. It runs the same search as the [search API](/api/search), the [MCP server](/guide/mcp) and Scry Link, and it returns only what your account can already read.

## Run a search

Open **Image search** in the sidebar, type what you are looking for, and press Enter or **Search**. You need text, an image, or both. The button stays disabled until there is something to search for, and **Esc** clears the field.

| You give | Scry searches for |
|---|---|
| Text only | Screens whose name, story, or content matches the description, for example `login form with error state` |
| An image only | Screens that look like the image |
| Text and an image | Both together: the image sets what the screen looks like, and the text steers it |

To search by image, click the image area and choose a file, drag a file onto the search box, or paste an image from the clipboard. A thumbnail appears with a remove button. The image must be a **PNG, JPG or WebP file of 8 MB or less**; anything else is rejected before it is sent, with a message saying why. The search itself accepts only PNG and JPEG, so large images are shrunk in your browser and WebP images are converted to JPEG before they are sent. WebP is never sent as it is.

Each result shows the screenshot, the screen's name, the project it belongs to, a **Public** or **Private** label, whether it is the **Latest** version or an **Older version** (a project with no recorded latest build shows neither label), and its match score. Click a result to open its [story page](/guide/story-page). Where a screen has a Storybook page, **Open in Storybook** opens it in a new tab, and **View build** opens the build the screen came from. Long result lists load a page at a time.


### From the search box at the top (Ctrl+K)

The search box at the top right of the dashboard (**Ctrl+K**, or Cmd+K on Mac) finds projects, pages and actions; it does not search screenshots. When you type words there, its last row is **Search images for “your words”**. Choose it to open Image search with those words already searched. When your words match nothing else in the dashboard, it is the only row, so Enter takes you straight there. A project name still comes first, so typing a project's name and pressing Enter still opens the project.

### From a snip {#from-a-snip}

If you take screenshots with [Scry Snip](/guide/scry-sync/snip), you can search with one. **Send and search in Scry** on the snip's review card, and **Search in Scry** on a sent snip (on the card and in the snip's detail panel on the **Snips** page), open Image search at `/search?snip=<project id>.<snip id>`. The address holds only those two ids, never the picture. If you are signed out you sign in first and come back to the same search.

<!-- SCREENSHOT PLACEHOLDER: dashsearch-snip-arrival.png (Image search opened from a snip: image box, banner, results) -->

- **The snip fills the image box** as if you had dropped it there, and the search runs on its own over all the projects you can search, the same as a plain image search. It costs 1 credit and counts toward the same rate limit.
- **A banner under the image** reads **Searching with your snip from** *time*, for example "2 min ago". It stays while the snip is the image being searched, and goes when you remove or replace the image or run a text-only search.
- **Search only *project*** in the banner narrows the search to the project the snip was sent to, in one click. The banner then offers **Search all projects** to go back. The button is hidden if the snip's project is not in your project list.
- **That snip is not available** appears instead of the banner when the snip was deleted, has expired (snips last 30 days), or is not shared with you. You get a normal empty search page and can search by text or image as usual.
- If your credits have run out or you are searching too fast, the page shows the usual messages for those cases.

## Choose projects

The project filter lists the projects you can search, in two groups:

- **Private projects**: projects whose visibility is private. You see only the ones you are a member of.
- **Public projects**: projects whose owners have made them public, including other teams' projects.

A project's group follows its visibility, not who owns it. Projects you belong to are marked as yours, in either group. Each group shows a count, and has **Select all** and **Clear** controls. Selected projects appear as chips above the results.

If you select nothing, the filter reads **All projects** and Scry searches everything you can search. Selecting a few restricts the results to those projects and no others.

### Limits

- A search covers at most **1,000 projects**. If more than 1,000 are available to you, the list is cut off and a notice says so. Pick the projects you care about to search them directly.
- If you have chosen a project that you can no longer read, for example because your access was removed, Scry leaves it out of the search and the results page tells you which projects were skipped. It never widens the search to make up for it.

## Filter by tag

If your screens carry [tags](/guide/tags-and-custom-fields), the filters have a **Tags** box. Type a tag and press Enter, or type a comma, to add it as a chip. Click a chip, or press Backspace in the empty box, to remove it.

- A screen must have **every** tag you add, and each tag must match exactly, including capital letters.
- You can add up to 10 tags, each 1 to 64 characters. The box says **Tag limit reached** at 10, and explains if a tag is empty, too long or has control characters.
- Tags narrow a search, so you still need text or an image. A search with only tags does not run.
- Screens without tags, or captured before tags were supported, never match a tag filter. That is not an error.

Tags are part of the page address, `?q=login&tag=checkout&tag=needs-review`, so a filtered search can be shared or bookmarked.

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

**An image is rejected.** Use a PNG, JPG or WebP file under 8 MB. Screenshots exported at very high resolution may need to be resized.

**A search fails with a temporary error.** Search again. The message includes a request id; see [Request ids](/api/request-ids) if you contact us.

## Related

- [Search API](/api/search) for the request and response fields behind this page
- [Scry Snip](/guide/scry-sync/snip#search-from-a-snip), to search with a screenshot you just took
- [Tags and custom fields](/guide/tags-and-custom-fields) and the [Story page](/guide/story-page), where a result opens
- [MCP Server](/guide/mcp) to search from an AI assistant
- [How credits work](/guide/credits)
