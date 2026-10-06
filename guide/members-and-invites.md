# Members and invites

Scry has two places people get added: a **workspace** (the billing and tenancy unit — every account has a personal
one, and a team creates a shared one) and a **project** (one Storybook, belonging to one workspace). Inviting someone
to a workspace does not add them to any of its projects, and inviting them to a project does not add them to the
workspace — the two are separate invite flows, with the same dialog and the same 7-day link.

## Workspace members

**Workspace ▸ Members** (`/workspaces/:ws/members`) lists everyone with a role in the workspace and its pending
invites. Roles are **Owner**, **Admin** and **Member**; only an owner or admin can invite, change a role, or remove
someone. A workspace's role controls who can manage its billing and its Danger zone (rename, delete), not what a
person can do inside any one project — that's the project's own roles, below.

## Project members

**Project ▸ Settings ▸ Members** (`/projects/:id/settings/members`) lists everyone with a role on that project.
Roles are **Owner**, **Admin**, **Developer** and **Viewer**:

| Role | Can |
|---|---|
| Owner | Everything, including deleting the project |
| Admin | Everything except deleting the project |
| Developer | Deploy builds, run diffs, promote/dismiss findings, manage API keys |
| Viewer | Read-only: browse builds, screens and issues |

Attaching a project to a team workspace does **not** add every workspace member to it automatically — a project's
roster is its own list, managed from this page. (A team workspace's home page does show every project attached to
it, including ones you're not a member of, so you can ask an admin to add you — see the workspace home page.)

## Inviting someone

Both flows use the same dialog: enter an email, choose a role, and **Invite** creates a link and emails it to that
address. The link is also shown in the dialog to copy and send yourself, so the invite works even if the email does
not arrive. It expires after **7 days**; if it's already expired or you want to resend it, **Renew and email again**
(or inviting the same address again) renews it with a fresh expiry and sends a reminder. What the email looks like,
and what to do when it doesn't arrive, is on [Invite emails](/guide/invite-emails).

If the email you invite already has an account and is already a member, the dialog tells you instead of creating a
duplicate invite.

## Accepting an invite

An invite link is `/invites/:id`. Opening it while signed out prompts sign-in first (`/login?returnUrl=/invites/:id`),
then lands you on the invite. Accepting a **workspace** invite takes you to that workspace's home page; accepting a
**project** invite takes you straight to the project's Overview.
