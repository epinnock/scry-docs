---
title: Terms of Service
description: The rules for using Scry — accounts, your content, AI features and credits, acceptable use, and our responsibilities to each other.
editLink: false
---

::: danger Draft — not yet reviewed
This page is a draft. It has not been reviewed by a lawyer or approved by Scrymore, and it is not yet in effect.
:::

# Terms of Service

**Effective date:** EFFECTIVE_DATE

These terms cover Scry: the developer dashboard (dashboard.scrymore.com), the Scry CLI (`@scrymore/scry-deployer`), the Storybook viewer (view.scrymore.com), the search API, the MCP server, the design-diff service, the **Scry Link** Figma plugin, this documentation site and scrymore.com (together, "Scry").

Scry is operated by **Scrymore** ("we", "us"). By creating an account, signing in, or using Scry, you agree to these terms. How we handle personal data is covered separately in our [privacy policy](/privacy).

In short:

- Scry is a tool for software teams. You must be at least 18 and using it for work.
- Your content stays yours. We only use it to run Scry for you, and we do not train AI models on it.
- AI findings and suggestions can be wrong. Check them before you rely on them.
- Public projects can be seen by anyone.
- Scry is free today and provided "as is", without an uptime guarantee.

## 1. Who can use Scry

- You must be at least 18.
- Scry is a business tool for building and reviewing software. It is not meant for personal, family or household use.
- If you use Scry for a company or other organisation, you confirm that you are allowed to accept these terms for it. In that case "you" means both you and that organisation.
- You may not use Scry if you are barred from receiving services under the laws of the United States or the place you live.

## 2. Accounts and organisations

- **Signing in.** You sign in with GitHub or Google. Keep that account, and any Scry API keys or CLI and plugin sign-ins you create, secure. You are responsible for what happens under your account and your keys. If you think one has been misused, revoke it and tell us at [support@scrymore.com](mailto:support@scrymore.com).
- **Accurate information.** Give us accurate account details and keep your email address current, because that is where we send notices.
- **Organisations.** Projects can belong to an organisation. The organisation's owners and admins decide who is a member and what members can see and do. Members of a project, and of the organisation it belongs to, can see its data.
- **One person per account.** Don't share a sign-in between several people. Invite them to your organisation instead.

## 3. AI credits

Some AI features, such as design diffs, AI search, Storybook indexing, plugin link suggestions and MCP image generation, use **AI credits** when credits are turned on.

- **Credits belong to an organisation**, not to a person. Tasks run on a project are charged to the organisation that pays for that project. The Credits page in the dashboard shows the balance, what used it and when the balance resets.
- **Monthly credits reset.** Each organisation may receive a monthly allowance. It resets on the first day of each month (UTC). Unused monthly credits expire at the reset and do not roll over.
- **Bonus credits.** We may grant extra credits, for example for a pilot or to make up for a problem. A grant may have its own expiry date, which we show when we grant it.
- **When credits run out**, AI tasks that need credits pause until the balance resets or more are added. Text search falls back to keyword search, and new Storybook builds are stored and viewable but not searchable until they can be indexed.
- **No cash value.** Credits are not money. They cannot be sold, transferred between organisations, or exchanged for cash or a refund, and they end when the organisation's account ends.
- **Changes.** We may change credit prices, the monthly allowance or which tasks use credits. For changes that reduce what you get, we will give at least 14 days' notice, as described in [Changes to these terms](#_17-changes-to-these-terms). A task already running keeps the price it started with. If a task fails, we return its credits.

## 4. Fees

Scry has no paid plans today. We may introduce paid plans or credit purchases later. If we do, they will come with their own pricing and payment terms, which you will see and agree to before you pay anything. We will not start charging you for something that is free today without that agreement.

## 5. Your content

"Your content" means what you or your team put into Scry: Storybook builds, screenshots, story metadata, coverage reports, Figma renders and link records, component requests, review decisions, notes, and anything else you upload or connect.

- **You own your content.** These terms do not give us ownership of any of it.
- **Our licence to it is limited.** You give us permission to host, copy, process, index and display your content only as needed to run Scry for you and the people you share it with. That includes: storing and serving your Storybooks; taking screenshots of your stories; having an AI model describe them and turning them into embeddings for search; comparing your Figma designs with your Storybook in the design-diff service; answering searches from you, your team and your MCP clients; and, for public projects, showing them to anyone (see [section 6](#_6-public-projects)). This permission covers the subprocessors that help us do this, listed on [Subprocessors](/subprocessors). It ends when your content is deleted, apart from copies kept for the limited periods in our privacy policy.
- **No training.** We do not train AI models on your content, and we only use model providers whose terms for our account say they do not train on it. See [AI features](/privacy#ai-features) in the privacy policy.
- **Research use is opt-in.** If a project owner or admin turns on **Research use** for a project, we may also use that project's screens, diffs and review decisions to evaluate and improve Scry's own AI features. It is never used to train third-party models. It is off unless you turn it on, and you can turn it off at any time.
- **Your responsibility.** You confirm that you have the rights needed to upload your content and to let us process it as described here. Your Storybook is a compiled bundle, so don't put secrets, credentials or personal data you shouldn't share in it.
- **Aggregate numbers.** We may use counts and measurements about how Scry is used, which do not identify you or reveal your content, to run and improve Scry.
- **Feedback.** If you send us ideas or suggestions, we may use them without owing you anything. This does not give us any rights in your content.

## 6. Public projects

A project you make **public** can be seen by anyone, including people without a Scry account. Its Storybook, screenshots and generated descriptions can be viewed, and they can appear in search results, including searches through the MCP server and other people's AI tools. Don't make a project public unless you are allowed to publish its content. You can make it private again or delete it at any time, but we cannot recall copies that other people have already taken.

Private projects are visible only to their members and the members of the organisation they belong to.

## 7. Acceptable use

Don't use Scry to do, or help anyone else do, any of the following:

- **Break the law** or infringe someone else's rights, including copyright, trademarks, trade secrets and privacy.
- **Upload content you don't have the rights to**, such as another company's app screens, designs or Storybooks without their permission, or malware.
- **Scrape or rehost.** Don't copy other people's projects, screenshots, descriptions or search results in bulk, or republish them as your own collection or dataset. Don't use Scry output to build a competing screenshot library or search product.
- **Abuse AI features.** Don't use them to generate unlawful, deceptive or harmful content, to get around the safety rules of the underlying model providers, or to run workloads that have nothing to do with building software. Don't use the MCP server's image tool to make images of real people without their consent.
- **Get around limits.** Don't dodge rate limits, credit balances or access controls, for example by creating extra accounts or organisations, sharing keys, or automating sign-ups.
- **Attack or probe Scry.** Don't try to get into accounts or projects that aren't yours, test our security without permission, reverse engineer our security controls, or disrupt the service (for example with denial-of-service traffic). If you find a security problem, please report it to [security@scrymore.com](mailto:security@scrymore.com).
- **Misrepresent yourself** or impersonate someone else.

## 8. Rate limits and fair use

We set limits on how fast and how much you can use Scry, for example requests per minute for the upload API, the search API and the MCP server. Current limits are listed in these docs and may change. If your use puts the service or other customers at risk, we may slow it down or pause it, and we will tell you why.

## 9. AI output

Scry uses AI models to describe screenshots, rank search results, suggest links between Figma layers and stories, find differences between designs and code, and generate images.

- **AI output can be wrong.** A diff can miss a real difference or report one that isn't there, a suggested link can point to the wrong story, and a description can be inaccurate. Review AI output before you act on it, ship code because of it, or show it to others.
- **You decide.** You are responsible for what you do with AI output, including the issues you file and the code you change.
- **Similar output.** Other people may get similar output from the same models. We don't claim any rights in the output generated for you; as between you and us, you may use it as you like, subject to these terms and to the terms of the model provider.

## 10. Third-party services

Scry works with services run by other companies, such as Figma, GitHub, Google and the AI and infrastructure providers listed on [Subprocessors](/subprocessors).

- When you connect Figma or GitHub, or sign in with GitHub or Google, your use of those services is governed by their own terms. You can disconnect them at any time.
- We are not responsible for those services, their availability, or changes they make that affect Scry. If a provider changes or stops a service, we may have to change or remove the Scry feature that depends on it.
- The Scry Link plugin runs inside Figma and is also subject to Figma's terms for plugins.

## 11. Our software

- Scry, including the dashboard, services, plugin, MCP server, CLI, our brand and these docs, belongs to Scrymore and its licensors. Apart from the right to use Scry under these terms, we don't give you any rights in it.
- Where we publish code under an open-source licence (for example in a public repository), that licence governs your use of that code. These terms govern your use of the hosted service.
- The CLI's `--local` mode sends data straight to the providers whose keys you supply. That use is between you and those providers.

## 12. Availability and changes to Scry

- Scry is provided "as is" and "as available". We don't offer an uptime guarantee or service level agreement today.
- We work on Scry constantly, so features will change. We may add, change or remove features. If we remove a major feature you rely on, we will try to give you reasonable notice.
- Some features are labelled beta, preview or early access. They may be less reliable and may change or be removed without notice.
- Keep your own copies of anything you can't afford to lose. Scry is not a backup service.

## 13. Suspension and termination

- **You can stop at any time.** Delete your projects, or email [privacy@scrymore.com](mailto:privacy@scrymore.com) from the address on your account to have your account deleted.
- **We may suspend or end access** to an account, organisation, project or API key if you seriously or repeatedly break these terms, if your use puts Scry, other customers or third parties at risk, if we are required to by law, or if an account has been inactive for a long time. Where it is safe and lawful, we will tell you first and give you a chance to fix the problem. We may also take down specific content that we reasonably believe breaks these terms or someone else's rights.
- **We may stop offering Scry.** If we shut Scry down, we will give at least 30 days' notice so you can export what you need.

### What happens to your data

When your account or a project is deleted, we delete the related data as described in [How long we keep it](/privacy#how-long-we-keep-it) in the privacy policy. Deletion is done by hand for now, so allow a few working days. Some copies last longer for limited periods, for example error reports and AI traces held by our providers, which are deleted on their own schedule. Public content that others have already copied is outside our control. Unused AI credits end with the account.

Section 5 (the parts about feedback and aggregate numbers), section 9 and sections 14 to 19 continue to apply after your use of Scry ends.

## 14. Disclaimers

Apart from what these terms say expressly, and to the extent the law allows, Scry and all AI output are provided without warranties of any kind, express or implied, including warranties of merchantability, fitness for a particular purpose, title and non-infringement. We don't promise that Scry will be uninterrupted, error-free or secure, that AI output will be accurate, or that your content will never be lost.

## 15. Limitation of liability

To the extent the law allows:

- Neither you nor we are liable to the other for indirect, incidental, special, consequential or punitive damages, or for lost profits, revenue, data or goodwill, arising from these terms or Scry, even if told they were possible.
- Our total liability for all claims arising from these terms or Scry is limited to the greater of (a) the amounts you paid us for Scry in the 12 months before the event that gave rise to the claim, and (b) US $100.

These limits don't apply to your obligations under section 16 (Indemnity), or to liability that the law does not allow to be limited, such as liability for fraud.

## 16. Indemnity

If someone brings a claim against us because of content you uploaded to Scry, or because you used Scry in breach of section 7 (Acceptable use) or the law, you will cover our reasonable costs of dealing with that claim, including reasonable legal fees and any damages or settlement. We will tell you about the claim promptly, let you control the defence where that is reasonable, and not settle it in a way that admits fault on your behalf without your agreement.

## 17. Changes to these terms

When we change these terms, we update the date at the top. If a change is material, we will email account holders at least 14 days before it takes effect. Changes we have to make for legal reasons, or that only affect new features, can take effect sooner. If you keep using Scry after a change takes effect, you accept the new terms. If you don't agree, stop using Scry and ask us to delete your account.

## 18. Governing law and disputes

These terms are governed by the laws of the State of Texas, USA, without regard to its conflict-of-laws rules. Any dispute arising from these terms or Scry will be heard only in the state or federal courts located in Bexar County, Texas, and you and we agree to those courts' jurisdiction. Before going to court, please email us first so we can try to resolve it informally. Either of us may still ask any court for urgent relief to protect intellectual property or confidential information.

## 19. General

- These terms, together with the privacy policy and any terms shown for a specific feature, are the whole agreement between you and us about Scry.
- If a part of these terms can't be enforced, the rest still applies.
- If we don't enforce a part of these terms straight away, we can still enforce it later.
- You may not transfer these terms to someone else without our agreement. We may transfer them as part of a merger, acquisition or sale of the business, and we will tell you if we do.
- Neither of us is responsible for delays caused by events beyond reasonable control, such as outages at our providers, natural disasters or government action.
- We send notices to the email address on your account. Send notices to us at [support@scrymore.com](mailto:support@scrymore.com).

## Contact

Scrymore · [support@scrymore.com](mailto:support@scrymore.com) for questions about these terms and for legal notices. Privacy requests go to [privacy@scrymore.com](mailto:privacy@scrymore.com), and security reports to [security@scrymore.com](mailto:security@scrymore.com).
