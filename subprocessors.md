---
title: Subprocessors
description: The outside services that process customer data for Scry, what each one receives, and where.
editLink: false
---

::: danger Draft — not yet reviewed
This page is a draft. It has not been reviewed by a lawyer or approved by Scrymore, and it is not yet in effect. Items marked **TO CONFIRM** still need to be checked.
:::

# Subprocessors

**Last updated:** [TO CONFIRM: effective date]

A subprocessor is an outside company that stores or processes customer data so that Scry can run. This page lists every one we use, what it gets, and where it runs. We built this list from our own code, not from memory. How we use the data is covered in the [privacy policy](/privacy).

**Changes.** We update this page before a new subprocessor starts receiving customer data. Customers with an agreement that names our subprocessors get an email at least [TO CONFIRM: notice period, recommended 14 days] before the change.

## Infrastructure and storage

| Subprocessor | What we use it for | Data it receives | Location | Their terms |
|---|---|---|---|---|
| **Cloudflare, Inc.** | Runs our backend services (Workers): uploads, build processing, the Storybook viewer, the design-diff service, the MCP server and the feedback form. Stores Storybook builds and screenshots (R2) and service records (D1, KV, Queues). Receives mail sent to our support addresses and forwards it. DNS and network edge. | Uploaded Storybook builds, story screenshots, Figma renders you sync, diff results and review decisions, encrypted Figma connection tokens, MCP sign-in tokens, feedback form answers, email sent to our support addresses | United States (R2 storage); Workers run on Cloudflare's global network | [DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) · [Subprocessors](https://www.cloudflare.com/gdpr/subprocessors/) |
| **Google LLC** (Firebase Authentication, Cloud Firestore) | Sign-in, and the database for accounts, organisations, projects, builds, API keys and links between Figma layers and stories | Account name, email address and sign-in provider id; project, build and membership records; Figma link records (layer, page and file names, node id, story id and title, Storybook URL); product event counts | [TO CONFIRM: Firestore location, expected US] | [Data processing terms](https://firebase.google.com/terms/data-processing-terms) · [Subprocessors](https://cloud.google.com/terms/subprocessors) |
| **Vercel Inc.** | Hosts the developer dashboard, the search API, this documentation site and scrymore.com. Vercel Web Analytics counts page views on the dashboard and scrymore.com. | Everything the dashboard and search API handle, in transit; page views without cookies | [TO CONFIRM: function region, Vercel default is Washington, D.C., US] | [DPA](https://vercel.com/legal/dpa) · [Subprocessors](https://vercel.com/legal/sub-processors) |
| **Zilliz** (Zilliz Cloud, managed Milvus) [TO CONFIRM: contracting entity] | Search index for components | Text and image embeddings, generated component descriptions, story ids and titles, project ids | United States (Google Cloud us-west1) | [Trust center](https://zilliz.com/trust-center) · [Subprocessors](https://zilliz.com/trust-center/subprocessors-list) · [TO CONFIRM: DPA] |

## AI and machine learning

We use these services to process data for you. **None of them may train models on your data.** We do not train models on your data either. See [AI features](/privacy#ai-features) in the privacy policy.

| Subprocessor | What we use it for | Data it receives | Location | Their terms |
|---|---|---|---|---|
| **OpenAI, L.L.C.** (API) | Writes a short description of each story screenshot when a Storybook is indexed | Story screenshots and their file names, which are derived from story ids | United States | [DPA](https://openai.com/policies/data-processing-addendum/) · [Subprocessors](https://platform.openai.com/subprocessors) |
| **Jina AI GmbH** (Embeddings API; acquired by Elastic N.V. in October 2025) | Turns screenshots, descriptions and search queries into embeddings for search and for matching Figma layers to stories | Story screenshots, generated descriptions, search query text (not stored by Scry), thumbnails of Figma layers when you run Suggest links. [TO CONFIRM: Jina's API terms bar training on inputs] | [TO CONFIRM: processing region] | [Elastic customer DPA](https://www.elastic.co/pdf/v100623-0-elastic-customer-dpa.pdf) · [Jina legal](https://jina.ai/legal) |
| **OpenRouter, Inc.** | Routes design-diff requests to the model provider. Every request is sent with OpenRouter's `data_collection: deny` setting, so it is only routed to providers that do not store or train on it. | Figma and Storybook screenshots, the Figma layer structure, the rendered page structure (DOM) and implementation source used for the comparison | United States | [Privacy](https://openrouter.ai/privacy) · [TO CONFIRM: DPA] |
| Model providers reached through OpenRouter: **OpenAI** (GPT models) and **Anthropic, PBC** (Claude models) | Run the design-diff models | Same as OpenRouter, per request | United States | [TO CONFIRM: which upstream hosts OpenRouter uses for each model] |
| **Anthropic, PBC** (API, direct) | Fallback for design diff when OpenRouter is unavailable. Off in production. | Same as OpenRouter | United States | [Commercial terms](https://www.anthropic.com/legal/commercial-terms) |
| **Google LLC** (Gemini API) | The MCP server's `generate_image` tool | The prompt and any reference images you send to that tool | United States [TO CONFIRM]. [TO CONFIRM: our key is on a paid, billing-enabled project; on the free tier Google may use inputs to improve its products] | [Gemini API terms](https://ai.google.dev/gemini-api/terms) |

## Monitoring and analytics

| Subprocessor | What we use it for | Data it receives | Location | Their terms |
|---|---|---|---|---|
| **Functional Software, Inc.** (Sentry) | Error reports from the dashboard, search API, backend services and CLI. In the dashboard, a screen recording of a session that hit an error, with all text masked and all images and inputs blocked. **Starting with the analytics release:** error reports from the Scry Link Figma plugin. | Scrubbed error reports and stack traces, app version, masked session replays (dashboard only). No API keys, no email addresses. | United States | [DPA](https://sentry.io/legal/dpa/) · [Subprocessors](https://sentry.io/legal/subprocessors/) |
| **PostHog, Inc.** *(starting with the analytics release)* | Product analytics for the dashboard and the Figma plugin: which features are used, and where people get stuck | A pseudonymous id (your Scry account id, or a one-way hash of your Figma user id), event names with counts and fixed categories, page paths without query strings, opaque project and organisation ids. No names, email addresses, file, layer or story names, design content or search text. | United States (PostHog Cloud US) | [DPA](https://posthog.com/dpa) · [Subprocessors](https://posthog.com/subprocessors) |
| **Langfuse GmbH** (Langfuse Cloud, part of ClickHouse) *(starting with the AI telemetry release)* | Traces of our AI calls, so we can debug a bad result and measure how often people keep what the AI finds | Prompts and model outputs for AI features, references to screenshots (not the images), pseudonymous user and project ids, promote and dismiss decisions | United States (Langfuse Cloud US) | [DPA](https://langfuse.com/security/dpa) · [Subprocessors](https://langfuse.com/security/subprocessors) |
| **Cloudflare, Inc.** (AI Gateway) *(starting with the AI telemetry release)* | Routes and meters our AI requests | Requests in transit. We turn off request and response logging, so prompts, images and outputs are **not stored**. It keeps one row per request: model, token counts, cost, duration, status, and tags for service, feature, project, user id and run id. | Cloudflare's global network | Covered by the Cloudflare DPA above |

## Integrations you choose to connect

These companies receive data only when you connect them, and you can disconnect them.

| Subprocessor | What we use it for | Data it receives | Location | Their terms |
|---|---|---|---|---|
| **GitHub, Inc.** | Sign in with GitHub. The Scry GitHub App opens component-request issues in the repositories you choose. | For sign-in, GitHub shares your name, email and avatar with us. For the App, we send the issue title, notes, requester display name and a signed link to the preview image. | United States | [Customer terms and DPA](https://github.com/customer-terms) · [Subprocessors](https://docs.github.com/en/site-policy/privacy-policies/github-subprocessors) |
| **Figma, Inc.** | When you connect Figma to a project, we read the files and layers you link through Figma's API to compare them with your Storybook | Your Figma access token (sent back to Figma), file keys and node ids we request | United States | [Privacy](https://www.figma.com/legal/privacy/) |

## Not on this list

- **Your own services.** In `--local` mode, the Scry CLI sends data straight to the OpenAI, Jina and Milvus accounts whose keys you pass. Scry never sees it. When the CLI posts a pull-request comment, it uses your repository's own GitHub token.
- **Your Storybook host.** The Figma plugin loads your Storybook straight from the URL you enter.

## Questions

Email [TO CONFIRM: privacy contact address].
