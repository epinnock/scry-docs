# Tags and custom fields

Scry can carry two kinds of extra information alongside each screen: **tags**, short labels such as `checkout` or `needs-review`, and **fields**, named values such as `owner: Payments` or `priority: 2`. You write them where you already describe your stories. Scry captures them when you upload a build, shows them on the [story page](/guide/story-page), and lets you filter [search](/guide/dashboard-search) by tag.

This page covers what Scry reads from Storybook and from a Scry Capture Format (SCF) bundle, the limits it applies, and how to find a tag in search. Today tags and fields come from your code and are read-only in the dashboard. Editing them in the dashboard, and importing them from Adobe files, are coming later.

::: warning Captured fields are visible on public projects
Anyone who can see a public project can see the tags and fields captured for its stories, on the story page and through the API. Do not put anything in a tag or field that you would not show a visitor to a public project. Until you can restrict them to project members, keep a project private if its fields hold anything sensitive.
:::

## Add tags in Storybook

Scry reads the standard Storybook `tags` list, on a story or on the component's default export. Tags are merged the way Storybook merges them: the component's tags first, then the story's.

```ts
const meta = {
  title: 'Checkout/PaymentForm',
  component: PaymentForm,
  tags: ['checkout', 'payments'],
} satisfies Meta<typeof PaymentForm>;
export default meta;

export const WithError: StoryObj<typeof meta> = {
  tags: ['needs-review', '!payments'],
};
```

`WithError` ends up with the tags `checkout` and `needs-review`. A tag that starts with `!` removes a tag the story inherited from the component, so `!payments` takes `payments` away for that story.

Storybook's own tags, `dev`, `test` and `autodocs`, are left out because they describe how Storybook treats a story, not what it is about. Tags written in the older style, `Button.tags = ['a']`, are read too.

## Add fields in Storybook

Fields live under `parameters.scry.fields`, on a story or on the component. A field on a story wins over a field with the same name on the component.

```ts
const meta = {
  title: 'Checkout/PaymentForm',
  component: PaymentForm,
  parameters: {
    scry: {
      fields: { owner: 'Payments', priority: 2 },
    },
  },
} satisfies Meta<typeof PaymentForm>;

export const WithError: StoryObj<typeof meta> = {
  parameters: { scry: { fields: { priority: 1, reviewed: false, platforms: ['web', 'ios'] } } },
};
```

Scry reads these **as plain text, from your story files. It never runs your code.** That is why only written-out values count:

| A field value can be | Example |
| --- | --- |
| A string | `'Payments'` |
| A number | `2` |
| A true or false value | `false` |
| A list of strings | `['web', 'ios']` |

Values that need code to work out, such as a variable, a function call, a spread (`...shared`) or a template string with `${}` in it, are skipped. A skipped value is not an error: the story is still captured, and the skip is counted (see [Limits](#limits)). If you want a value to come from a constant, write the value out in the story.

## Add tags and fields in an SCF bundle

If you write [Scry Capture Format](/guide/capture-bundle-format) bundles yourself, put tags on the capture and fields under `x-scry-fields`. See [Tags and fields in a bundle](/guide/capture-bundle-format#tags-and-fields-in-a-bundle) for the shape. Storybook builds uploaded with the deployer carry the same information, so you do not need to do anything extra.

## Limits

Scry keeps your tags and fields small and tidy. When something is over a limit it is **dropped, never cut short**. A 70-character tag does not become a 64-character tag; it is left out, so you never end up with a tag that says something different from what you wrote.

| What | Limit |
| --- | --- |
| Tags per story | 100 |
| Length of a tag | 1 to 64 characters |
| Fields per story | 50 |
| Field name | Starts with a letter, then letters, digits, spaces, `_` or `-`, up to 64 characters |
| A text field | Up to 500 characters. A blank text field is dropped |
| A list field | Up to 20 strings. An empty list is dropped |
| All fields of one story together | About 8 KB. If they are larger, fields are dropped from the end of the list |

Other things Scry tidies up:

- Hidden characters are removed from tags: control characters, zero-width characters and the characters that reverse text direction. Two tags that match after this are kept once.
- Control characters are removed from text fields. Line breaks and tabs stay.
- A tag is matched exactly. `Checkout` and `checkout` are different tags.

### Drop counts

Every build reports how many stories had tags, how many had fields, and how many tags and fields were dropped. The coverage step of your upload prints a line like this when it captures your Storybook:

```
Metadata: 42 of 60 stories with tags, 12 with fields (dropped: 2 tags, 3 fields)
```

The numbers are counts only; Scry does not echo the values. If the dropped numbers are not zero, a tag or field was over a limit or could not be read as plain text. Check the rows in the table above, fix the story and upload again.

## Find screens by tag

Open **Search** in the dashboard and use the **Tags** box in the filters. Type a tag and press Enter to add it as a chip. You can add up to 10 tags. A screen must have **every** tag you add, and each tag has to match exactly. Remove a chip by clicking it or by pressing Backspace in the empty box.

Tags narrow a search, so type some text or add an image as well. A search with only tags does not run. The tags are part of the page address (`tag=checkout&tag=needs-review`), so you can bookmark or share a filtered search. See [Search in the dashboard](/guide/dashboard-search#filter-by-tag).

The [search API](/api/search#filter-by-tag) takes the same filter as a `tags` list.

## Troubleshooting

**A tag is missing from the story page or from search.** Check these in order.

1. The story is in a build that was uploaded after tags were supported, with analysis on (`--with-analysis`). Older builds have no tags. Upload a new build.
2. The tools that capture your Storybook are recent enough. Tags and fields need a recent Storybook coverage tool (`@scrymore/scry-sbcov`, 0.8 or later) and a deployer that uses it. If your CI pins an older deployer version in a workflow file or a copied command, tags are silently left out. Check the version your CI really installs.
3. The tag is not one of `dev`, `test` or `autodocs`, and does not start with `!`. These are never captured.
4. The tag is 1 to 64 characters. Look for a nonzero **dropped** count in the `Metadata:` line of your upload.

**A field is missing.** Check that the value is written out in the story file, not computed, and that the field name and size are within the [limits](#limits). A skipped computed value is counted as dropped.

**A search with tags returns nothing.** Every tag you add must match exactly, and a screen needs all of them. Remove a chip to widen the search. Screens captured before tags were supported never match a tag filter.

## Coming later

Editing tags and fields in the dashboard, choosing who can see fields, and importing tags from Adobe files are not available yet.

## Related

- [Story page](/guide/story-page) to see a story's tags, fields and links
- [Search in the dashboard](/guide/dashboard-search) for the Tags filter
- [Capture bundle format](/guide/capture-bundle-format) for tags and fields in an SCF bundle
- [Search API](/api/search) for the `tags` request option
