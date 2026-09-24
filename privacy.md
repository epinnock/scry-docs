---
title: Privacy policy
description: What Scry collects, why, who processes it, how long we keep it, and how to opt out or have it deleted.
editLink: false
---

::: danger Draft — not yet reviewed
This page is a draft. It has not been reviewed by a lawyer or approved by Scrymore, and it is not yet in effect. Items marked **TO CONFIRM** still need to be checked or decided.
:::

# Privacy policy

**Effective date:** [TO CONFIRM: effective date]

This policy covers Scry: the developer dashboard (dashboard.scrymore.com), the Scry CLI (`@scrymore/scry-deployer`), the Storybook viewer (view.scrymore.com), the search API, the MCP server, the design-diff service, the **Scry Link** Figma plugin, this documentation site and scrymore.com.

Scry is operated by **[TO CONFIRM: legal entity name]** ("Scrymore", "we"). Questions go to **[TO CONFIRM: privacy contact address]**.

In short:

- We use what you give us to run Scry for you. We do not sell it, and we do not train AI models on it.
- We never store the text of your searches.
- Our usage analytics never contain file, layer or story names, email addresses or design content. You can turn them off.
- When our AI features call a model, the gateway in front of it does not store the prompt, the images or the answer.
- Your data is processed in the United States [TO CONFIRM: Jina AI's region], by the companies on our [subprocessor list](/subprocessors).

## What we collect

### Your account

When you sign in with GitHub or Google, we receive your name, email address, avatar and the provider's user id. We store your account, your organisations, your projects and who is a member of each. We also store API keys you create, and the fact that you approved a plugin or CLI sign-in.

### What you upload with the CLI

- **Your built Storybook** (`storybook-static/`, as a zip). It is a compiled bundle, so it contains your components' code in built form plus any assets and fixture data your stories use. It does **not** include your repository, git history, `.env` files or anything outside the build directory.
- **A screenshot of every story.**
- **Story metadata:** ids, titles, variants and file paths.
- **A coverage report**, if you turn that on.

### What we derive from it

- A short written description of each story screenshot, made by an AI model.
- Text and image embeddings, which power search.
- A search index of the above.

### Figma data

- **Scry Link plugin, signed out.** The plugin talks only to the Storybook URL you enter. Links between layers and stories are stored inside your Figma file, not by us.
- **Scry Link plugin, signed in.** Only what you choose to send:
  - When you **sync** a linked layer, we receive a rendered image of it and what we need to pair it with the story: the layer's name, node id and size, its page and file names, the file key when Figma provides it (otherwise an id the plugin generates for the file), any Dev Mode links on the layer, and the linked story's id, title, name and Storybook URL.
  - When you run **Suggest links**, we receive small thumbnails of the layers being matched. They are used to search your project and are not stored.
  - When you **request a component**, we receive its name, a preview image and your notes, and open a GitHub issue if your project has a repository connected.
- **Figma connection in the dashboard.** If you connect a Figma account to a project, we store its access token encrypted and use it to read the files and layers you have linked, so we can compare them with your Storybook.

### Search and MCP

We count searches and record which project was searched, how many results came back and whether the scope was widened. **We never store the query text**: it is sent to our embedding provider to be turned into numbers and then discarded. If you use the MCP server's `generate_image` tool, your prompt and any reference images go to Google's Gemini API to make the image.

### Usage analytics

We use PostHog to see which features are used and where people get stuck. This starts with the analytics release, and you can turn it off (see [Your choices](#your-choices)).

- **Dashboard:** the pages you visit (the path only, with query strings removed) and named events such as "project created", "Storybook uploaded", "Figma connected", "diff run started" and "issue promoted". They carry opaque project and organisation ids.
- **Figma plugin:** named events such as "plugin opened", "layer linked", "sync run" and "error shown". Their properties are counts and fixed categories (for example `method: manual`, `result: success`). The full list is on [What Scry Link collects](/figma-plugin/what-we-collect).
- **Who the events belong to.** Signed in, events use your Scry account id. Before sign-in, the plugin uses a one-way hash of your Figma user id. Your raw Figma id never leaves the plugin.

**Never in analytics:** your name or email address, Figma file keys or file names, page, frame or layer names, text from your designs, story ids, titles or names, Storybook URLs, search text, screenshots or designs. We don't record sessions and don't track clicks automatically. The plugin never records its screen.

Vercel Web Analytics also counts page views on the dashboard and scrymore.com. It uses no cookies.

### Error reports

We use Sentry to learn when something breaks.

- The dashboard, search API, backend services and CLI send the error, its stack trace and the app version. They are set not to attach personal data such as IP addresses or email addresses. The CLI also removes API keys, upload URLs, absolute file paths, hostnames and usernames before sending.
- When a dashboard session hits an error, Sentry keeps a recording of that session. All text is masked, and all images and form inputs are blocked, so it shows the layout but not your content. Sessions without an error are not recorded.
- Starting with the analytics release, the Figma plugin sends error reports too. Before sending, it replaces quoted names (which is how layer and story names appear in messages) with `<redacted>`, and removes Figma file links, tokens and your Storybook's address.

### Design comparison

The design-diff service compares a Figma design with your Storybook. To do that it sends model providers the screenshots, the Figma layer structure, the rendered page structure (DOM) and, when available, the implementation source. See [AI features](#ai-features) below.

### Support and feedback

If you email us or use the [feedback form](/feedback), we keep what you send. The form's email field is optional. To limit spam we store a salted hash of your IP address, never the address itself.

### Cookies and local storage

- The dashboard and the viewer use a sign-in session cookie. It is needed for the service to work.
- Analytics in the dashboard is stored in your browser's local storage, not in cookies.
- The Figma plugin keeps its settings, your sign-in token and your analytics choice in Figma's plugin storage on your device.

We don't use advertising cookies or trackers.

## How we use it

- To run Scry: host and show your Storybooks, index and search them, compare designs with code, and sign you in.
- To fix problems and keep the service secure: error reports and abuse limits.
- To improve Scry: aggregate usage analytics, and quality numbers for our AI features (for example, how often a finding is promoted rather than dismissed).
- To reply to you when you contact us.

We do not sell your data or share it for advertising.

## AI features

- **No training.** We do not train AI models on your data, and our model providers are set up not to keep it or train on it. Design-diff requests go through OpenRouter with `data_collection: deny`, so they are only sent to providers that do not store or train on them.
- **The gateway does not keep content.** Starting with the AI telemetry release, our AI requests go through Cloudflare AI Gateway with body logging turned off. It keeps one row per request (model, tokens, cost, time, status, and ids for the service, project, user and run), but **never the prompt, images or answer**.
- **Traces for debugging.** Starting with the AI telemetry release, we keep a trace of each AI call in Langfuse (prompts, outputs, and references to screenshots, not the images) so we can debug a bad result. We delete these after 30 days.
- **Research use is off unless you turn it on.** A project owner or admin can turn on **Research use** for a project. Then Scry may use that project's screens, diffs and review decisions to evaluate and improve Scry's own AI. It is never used to train third-party models. Turning it off stops new use. To remove data already used, email us.

## Who we share it with

- **Subprocessors.** The companies that run parts of Scry for us are listed, with what each receives, on [Subprocessors](/subprocessors).
- **Services you connect.** GitHub (for sign-in and component-request issues) and Figma (for the Figma connection) receive what's needed for the feature you turned on.
- **People you share with.** Members of your project, and of an organisation it is attached to, can see its data.
- **The law.** If we are legally required to disclose data, we will. We will tell you first, unless the law forbids it.
- **A sale of the business.** If Scrymore is acquired, your data would move with it under this policy, and we would tell you.

## How long we keep it

| Data | How long |
|---|---|
| Account, organisations, projects, membership | Until you ask us to delete your account |
| Storybook builds, screenshots, descriptions, search index | Until you delete the project or ask us to. **Today we keep every build's data. Nothing is deleted automatically.** [TO CONFIRM: whether to add an automatic policy] |
| Search query text | Never stored |
| Figma renders you sync, link records, diff results and review decisions | Until you delete the project or ask us to |
| Figma connection token | Until you disconnect Figma or delete the project |
| Usage analytics (PostHog) | [TO CONFIRM: PostHog retention on our plan] |
| Usage event counts stored before the analytics release (our database) | Kept as an archive. From the analytics release, new events go to PostHog only, after a 30-day overlap. |
| Error reports and session replays (Sentry) | [TO CONFIRM: Sentry retention on our plan] |
| AI call traces (Langfuse) | 30 days |
| Archived AI traces (our own storage) | [TO CONFIRM: retention for projects without Research use] |
| AI gateway request rows (no content) | Oldest rows are deleted automatically once the gateway's row limit is reached [TO CONFIRM: set a time limit] |
| Feedback form answers and support email | [TO CONFIRM: retention] |

## Your choices

- **Figma plugin analytics and error reports:** turn off **Settings → Privacy → Share anonymous usage data and error reports**, or press **Turn off** on the notice the first time you see it. Once it is off, the plugin sends nothing to PostHog or Sentry, from the next open onwards too.
- **Dashboard analytics:** turn off **Settings → Privacy → Product analytics**.
- **CLI error reports:** set `SCRY_TELEMETRY=0` or `DO_NOT_TRACK=1`. Both work in CI too.
- **Research use:** it is off by default. Project owners and admins can change it in project settings.
- **Figma and GitHub connections:** disconnect them in the dashboard, or revoke Scry from your Figma or GitHub account settings.

## Your rights

You can ask us for a copy of your data, to correct it, or to delete it. Email [TO CONFIRM: privacy contact address] from the address on your account. Deletion is done by hand for now, so allow a few working days. We will confirm when it is done, including the copies held by our subprocessors that we can delete.

[TO CONFIRM: rights wording for GDPR (EU/UK) and US state privacy laws such as CCPA, depending on who the customers are]

## Security

- Screenshots and previews are served through short-lived signed links, not public buckets.
- Figma tokens are stored encrypted. API keys are never sent in error reports.
- Access narrows on failure: if we can't read an organisation's membership, it grants no access.

We don't hold a SOC 2 or similar certification yet.

## Where your data is processed

In the United States [TO CONFIRM: Jina AI's region]. Some of our providers use global networks to deliver requests. We don't currently offer an EU data residency option.

## Children

Scry is a tool for software teams and is not meant for anyone under [TO CONFIRM: 13 or 16].

## Changes to this policy

When we change this policy, we update the date at the top. If a change is significant, we will email account holders at least [TO CONFIRM: notice period] before it takes effect.

## Governing law

This policy is governed by the laws of [TO CONFIRM: governing law, e.g. the State of Texas, USA], except where the privacy law of the place you live gives you rights that cannot be waived.

## Contact

[TO CONFIRM: legal entity name and postal address] · [TO CONFIRM: privacy contact address]
