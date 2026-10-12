# Image search in the dashboard

The dashboard has an **Image search** page (`/search`, in the sidebar) that finds screens across your indexed Storybook builds. You can search by text, by image, or by both, narrow the search to chosen projects, and decide whether to see only the newest version of each screen or older versions too. It runs the same search as the [search API](/api/search), the [MCP server](/guide/mcp) and Scry Link, and it returns only what your account can already read.

## Run a search

Open **Image search** in the sidebar, type what you are looking for, and press Enter or **Search**. You need text, an image, or both. The button stays disabled until there is something to search for, and **Esc** clears the field.

| You give | Scry searches for |
|---|---|
| Text only | Screens whose name, story, or content matches the description, for example `login form with error state` |
| An image only | Screens that look like the image |
| Text and an image | Both together: the image sets what the screen looks like, and the text steers it |

To search by image, click the image area and choose a file, drag a file onto the search box, or paste an image from the clipboard. A thumbnail appears with a remove button. The image must be **PNG, JPG or WebP and no larger than 8 MB**. Anything else is rejected before it is sent, with a message saying why. Large images are shrunk in your browser before they are sent, and WebP images are converted to JPEG, so the search always receives a PNG or JPEG.

Each result shows the screenshot, the screen's name, the project it belongs to, a **Public** or **Private** label, whether it is the **Latest** version or an **Older version** (a project with no recorded latest build shows neither label), and its match score. Click a result to open its [story page](/guide/story-page). Where a screen has a Storybook page, **Open in Storybook** opens it in a new tab, and **View build** opens the build the screen came from. Long result lists load a page at a time.


### From the search box at the top (Ctrl+K)

The search box at the top right of the dashboard (**Ctrl+K**, or Cmd+K on Mac) finds projects, pages and actions; it does not search screenshots. When you type words there, its last row is **Search images for “your words”**. Choose it to open Image search with those words already searched. When your words match nothing else in the dashboard, it is the only row, so Enter takes you straight there. A project name still comes first, so typing a project's name and pressing Enter still opens the project.

## Snips in search

Snips taken with [Scry Snip](/guide/scry-sync/snip) can turn up in search next to your screens. This is only on for accounts where it has been switched on.

- A **Source** filter above the results has two chips, **All** and **Snips**. **All** (the default) shows screens and snips together. **Snips** shows snips only; choose it again to go back to **All**.
- A snip result carries a **Snip** badge instead of a build or **Latest** label, and shows who took it. A snip someone shared with you reads **Shared by** and their name. **Open snip** opens it on the [Snips page](/guide/scry-sync/snip#share-a-snip).
- When a search matches snips, the page counts them, for example **3 snips match**. When none match it says: "No snips match. Snips you take, or that are shared with you, show up here a few seconds after you send them."
- Snips are not tied to a build, so **Latest versions only** does not hide them, and the project filter limits them like any other result.

You only ever see snips you took or that were shared with you. Other people's private snips never appear, and nothing tells you that they exist. A snip you deleted, a snip that has expired, and a snip you removed from your view are gone from results. To keep your own snips out of search, see [Find your snips in search](/guide/scry-sync/snip#find-your-snips-in-search).

## Choose projects

The project filter lists the projects you can search, in two groups:

- **Private projects**: projects whose visibility is private. You see only the ones you are a member of.
- **Public projects**: projects whose owners have made them public, including other teams' projects.

A project's group follows its visibility, not who owns it. Projects you belong to are marked as yours, in either group. Each group shows a count, and has **Select all** and **Clear** controls. Selected projects appear as chips above the results.

If you select nothing, the filter reads **All projects** and Scry searches everything you can search. Selecting a few restricts the results to those projects and no others.

### Limits

- A search covers at most **100 projects**. If more than 100 are available to you, the list is cut off and a notice says so. Pick the projects you care about to search them directly.
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
- Snips are the exception to project access: being in a project does not let you see a teammate's snip. You see a snip only if you took it or it was shared with you.
- You never see a private project you are not a member of, even if someone sends you its id. The check runs on the server for every project in every search.
- Search needs you to be signed in. Signed-out visitors are sent to sign in.

Searching also uses AI credits, charged to the workspace described in [How credits work](/guide/credits#who-pays). If the balance has run out, the page shows a message saying so instead of results.

## Troubleshooting

**A message that search is not available.** The search service is not reachable or not configured. Try again in a minute; if it persists, tell us on the [feedback form](/feedback) and include the request id from the message, if there is one.

**No results.** Check which projects are selected, and whether **Latest versions only** is on. A screen that exists only in an older build appears only when older versions are included.

**A project is missing from the filter.** The filter lists projects you are a member of and public projects. Ask a project admin to add you (see [Members and invites](/guide/members-and-invites)).

**A snip is missing.** Check that the **Snips** chip is not hiding it, and that its label on the **Snips** page says **Searchable**. A snip that was shared with you is found only while the person who took it still shares it and has snip search switched on.

**An image is rejected.** Use PNG, JPG or WebP under 8 MB. Screenshots exported at very high resolution may need to be resized.

**A search fails with a temporary error.** Search again. The message includes a request id; see [Request ids](/api/request-ids) if you contact us.

## Related

- [Search API](/api/search) for the request and response fields behind this page
- [Tags and custom fields](/guide/tags-and-custom-fields) and the [Story page](/guide/story-page), where a result opens
- [MCP Server](/guide/mcp) to search from an AI assistant
- [Scry Snip](/guide/scry-sync/snip) for taking, sharing and searching snips
- [How credits work](/guide/credits)
