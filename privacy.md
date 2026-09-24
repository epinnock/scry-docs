---
title: Privacy policy
description: What Scry collects, why, who processes it, how long we keep it, and how to opt out or have it deleted.
editLink: false
---

# Privacy policy

**Effective date:** September 24, 2026

This policy covers Scry: the developer dashboard (dashboard.scrymore.com), the Scry CLI (`@scrymore/scry-deployer`), the Storybook viewer (view.scrymore.com), the search API, the MCP server, the design-diff service, the **Scry Link** Figma plugin, this documentation site and scrymore.com.

Scry is operated by **Scrymore** ("we"). Questions go to [privacy@scrymore.com](mailto:privacy@scrymore.com).

In short:

- We use what you give us to run Scry for you. We do not sell it, and we do not train AI models on it.
- We never store the text of your searches.
- Our usage analytics never contain file, layer or story names, email addresses or design content. You can turn them off.
- When our AI features call a model, the gateway in front of it does not store the prompt, the images or the answer.
- Your data is stored in the United States. A few providers may process it elsewhere; see [Where your data is processed](#where-your-data-is-processed) and our [subprocessor list](/subprocessors).

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

- **No training.** We do not train AI models on your data, and we only use model providers whose terms for our account say they do not train on it. Design-diff requests go through OpenRouter with `data_collection: deny`, so OpenRouter only routes them to providers that do not collect the data. Some providers keep requests for a limited time under their own terms, for example to detect abuse.
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
| Storybook builds, screenshots, descriptions, search index | Until you delete the project or ask us to. We always keep each project's 10 most recent builds; older builds are deleted automatically once they are 90 days old. |
| Search query text | Never stored |
| Figma renders you sync, link records, diff results and review decisions | Until you delete the project or ask us to |
| Figma connection token | Until you disconnect Figma or delete the project |
| Usage analytics (PostHog) | Available to us for analysis for 1 year on our current PostHog plan. PostHog does not delete older events automatically; we delete your events when you ask us to delete your account. |
| Usage event counts stored before the analytics release (our database) | Kept as an archive. From the analytics release, new events go to PostHog only, after a 30-day overlap. |
| Error reports and session replays (Sentry) | 30 days, Sentry's retention on our plan |
| AI call traces (Langfuse) | 30 days |
| Archived AI traces (our own storage, starting with the AI telemetry release) | 90 days, then deleted automatically. We delete a project's traces sooner when you ask us to. |
| AI gateway request rows (no content) | 90 days, then deleted automatically |
| Feedback form answers | 24 months, then deleted automatically. We delete them sooner when you ask us to. |
| Support email | Until you ask us to delete it |

## Your choices

- **Figma plugin analytics and error reports:** turn off **Settings → Privacy → Share anonymous usage data and error reports**, or press **Turn off** on the notice the first time you see it. Once it is off, the plugin sends nothing to PostHog or Sentry, from the next open onwards too.
- **Dashboard analytics:** turn off **Settings → Privacy → Product analytics**.
- **CLI error reports:** set `SCRY_TELEMETRY=0` or `DO_NOT_TRACK=1`. Both work in CI too.
- **Research use:** it is off by default. Project owners and admins can change it in project settings.
- **Figma and GitHub connections:** disconnect them in the dashboard, or revoke Scry from your Figma or GitHub account settings.

## Your rights

You can ask us for a copy of your data, to correct it, or to delete it. Email [privacy@scrymore.com](mailto:privacy@scrymore.com) from the address on your account. Deletion is done by hand for now, so allow a few working days. We will confirm when it is done, including the copies held by our subprocessors that we can delete.

You can also ask for your data in a portable format, or object to a use of it. We reply within 30 days. We will not treat you differently for using these rights. We may need to confirm that a request really comes from you.

**Data your organisation controls.** When your company uses Scry, the projects, builds and designs it uploads belong to it. For that data we act on your company's instructions, so we may pass your request to your organisation's admin.

**Europe and the UK.** If data protection law such as the GDPR applies to you, we rely on these legal bases: running the service you signed up for (contract); fixing errors, keeping Scry secure and improving it through usage analytics and error reports (our legitimate interests, which you can object to with the opt-outs above); and Research use (your organisation's choice to turn it on). Transfers to the United States are covered by our providers' standard contractual clauses where they offer them. You may complain to your local data protection authority.

**California and other US states.** We do not sell personal information, and we do not share it for cross-context behavioural advertising. We collect the categories of data described above, for the purposes described above.

## Security

- Screenshots and previews are served through short-lived signed links, not public buckets.
- Figma tokens are stored encrypted. API keys are never sent in error reports.
- Access narrows on failure: if we can't read an organisation's membership, it grants no access.

We don't hold a SOC 2 or similar certification yet.

## Where your data is processed

We store your data in the United States: our database (Google Cloud Firestore, US multi-region), our file storage (Cloudflare R2), our search index (Zilliz, Google Cloud us-west1) and our dashboard and search API (Vercel, Washington, D.C.).

Some processing can happen outside the United States:

- **Embeddings.** Jina AI GmbH (Germany, part of Elastic) turns screenshots, descriptions and search text into embeddings. Jina does not publish where its API servers run.
- **Image generation.** If you use the MCP server's `generate_image` tool, Google may process your prompt in any country where it has facilities.
- **Networks.** Cloudflare and Vercel deliver requests through global networks, so a request may pass through a location near you.

We don't currently offer an EU data residency option.

## Children

Scry is a tool for software teams. You must be at least 18 to use it, and we do not knowingly collect data from anyone younger. If you think a child has given us data, email us and we will delete it.

## Changes to this policy

When we change this policy, we update the date at the top. If a change is significant, we will email account holders at least 14 days before it takes effect.

## Governing law

This policy is governed by the laws of the State of Texas, USA, except where the privacy law of the place you live gives you rights that cannot be waived.

## Contact

Scrymore · [privacy@scrymore.com](mailto:privacy@scrymore.com). We handle privacy requests by email only. To report a security vulnerability, email [security@scrymore.com](mailto:security@scrymore.com).
