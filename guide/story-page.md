# Story page

Every screen Scry has indexed has a **story page**: one place that shows the screenshot, how it changed over recent builds, its [tags and fields](/guide/tags-and-custom-fields), and links to where it lives in Storybook, GitHub, Figma and Creative Cloud. Today the page is read-only. Editing tags and fields from it is coming later.

## Open a story page

| From | Do this |
| --- | --- |
| [Search](/guide/dashboard-search) | Click **Open story** on a result |
| The project's **Screens** page | Open the **...** menu on a row and choose **Open story page** |

The **...** menu on the Screens page also has **Quick peek**. It opens a side drawer with the screenshot, the tags and the fields, plus icon links to Storybook and GitHub. **Open full page** in the drawer takes you to the story page. A row without a story id has neither option.

The address looks like `/projects/<project id>/stories/<story key>`. The story key is a long code Scry works out from the story's source and id, so it stays the same from build to build and you can bookmark or share the page.

## What is on the page

- **Header.** The story's title, a **Screens** link back to the list, and **Open live** when the story has a Storybook link. Under it you see the source (for example Storybook, or React Native · iOS) and the build it comes from: build number, capture date, branch and commit.
- **Screenshot.** The latest capture of the story, and **This story across recent builds**: up to six builds side by side, so you can see when it last changed.
- **Tags.** Each tag is a chip, with a small note of where it came from: **from Storybook**, **from capture**, or **from file** for Adobe files. A story with none reads **No tags yet.**
- **Fields.** Each field name with its value and **from capture**. Yes and No stand for true and false, and lists are joined with commas. A story with none reads **No fields were captured for this story.**
- **About this story.** Facts about the capture. They depend on the source:

| Source | Rows |
| --- | --- |
| Storybook | Story id, Args, File and line |
| Native apps | Story id, Device, OS, Locale, Theme, File |
| Adobe and Creative Cloud | Original file, Library, Format, Stock credit line |

  A row appears only when Scry has a value for it.
- **Links.** Only the links that exist are shown.

## Links

| Link | Opens | When it appears |
| --- | --- | --- |
| **Open in Storybook** | The story in your published Storybook | The capture recorded a Storybook address |
| **View code on GitHub** | The story's file at the build's commit, on the right line | Storybook and native builds that recorded their repository address, commit and file |
| **Figma link** | The Figma frame linked to this story | The story has a [Figma link](/guide/figma-plugin) |
| **Open in Creative Cloud** | The item in Adobe Creative Cloud | Creative Cloud items. It opens only for people the library is shared with |

The GitHub link points at a fixed commit, not a branch, so it keeps showing the code the screenshot was taken from even after the file changes.

## Who can see it

You can open a story page if you are a member of the project, or if the project is public. Viewers and visitors to a public project see a note: **You have view access to the project. Tags and fields are read-only.**

::: warning Public projects show captured fields
On a public project, anyone can see the tags and fields on its story pages, signed in or not. Do not capture anything in a tag or field that you would not show a visitor. See [Tags and custom fields](/guide/tags-and-custom-fields).
:::

## The not-found page

If the page says **Story not found**, one of these is true: the story was removed, the address is wrong, or the project is private and you are not a member. Scry shows the same page in all three cases on purpose, so nobody can use it to find out whether a private project or story exists. Use **Back to screens** to return to the list. If you expect access, ask a project admin to add you (see [Members and invites](/guide/members-and-invites)).

## Troubleshooting

**No tags or fields.** The story has none captured. See [Troubleshooting](/guide/tags-and-custom-fields#troubleshooting) on the tags page.

**No Open in Storybook or View code on GitHub link.** The link is shown only when the build recorded what it needs: a Storybook address, or a GitHub repository, a commit and the story's file. Native and Storybook builds uploaded from CI usually record these; a build uploaded by hand may not.

**Quick peek says "Story could not be loaded".** Close the drawer and try again. If it keeps happening, tell us on the [feedback form](/feedback) with the request id, if it shows one.

## Related

- [Tags and custom fields](/guide/tags-and-custom-fields) for how tags and fields get onto a story
- [Search in the dashboard](/guide/dashboard-search) to find stories by text, image or tag
- [Capture bundle format](/guide/capture-bundle-format) for how a capture is described
