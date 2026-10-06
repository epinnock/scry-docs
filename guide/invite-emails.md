# Invite emails

When you invite someone to a project or a workspace, Scry emails them the invitation. The invite link also stays on screen in the invite dialog, so an invitation never depends on the email arriving. This page covers what is sent and when, what the recipient sees, and what to do when the email does not show up. For roles, expiry and accepting an invite, see [Members and invites](/guide/members-and-invites).

## When an email is sent

Scry sends one email when:

- you create an invite from the **Invite** dialog, for a project or for a workspace, and
- you renew an existing pending invite with **Renew and email again**, or by inviting the same address again. The renewed email is marked as a reminder.

Only a signed-in person who is allowed to invite to that project or workspace can cause an email, and the email goes only to the address on the invite. Invites created with a [personal access token](/api/authentication) through the API are created as usual and return the link, but no email is sent. Invites that were already pending before invite emails existed are not emailed; renew one to send it.

After you press **Invite**, the dialog tells you what happened and always shows the link below it:

| What the dialog says | What it means |
|---|---|
| `Email sent to name@company.com` | The email was handed to the mail service. The link below it also works if the email lands in spam. |
| `Couldn't send the email. The invite is saved. Copy the link and send it yourself.` | The mail service did not take the message. The invite exists and the link works. |
| `Email limit reached for today. The invite is saved. Copy the link and send it yourself.` | You or Scry reached a daily limit (see [Limits](#limits)). The invite exists and the link works. |
| `We can't email this address. The invite is saved. Copy the link and send it yourself.` | Scry can't send mail to this address. The invite exists and the link works. |
| `Emailed 4 minutes ago. Copy the link below if they can't find it.` | You renewed an invite that was emailed in the last 10 minutes, so no second email was sent. |

A failed or skipped email never loses or blocks the invite.

## What the recipient sees

- **From:** `Scry <invites@mail.scrymore.com>`. The sender is always the same fixed name and address, whoever invited them. Scry never sends invites from your own address or from the root `scrymore.com` domain.
- **Reply-To:** `support@scrymore.com`. A reply goes to a person at Scry, not to the inviter.
- **Subject:** `{Name} invited you to {Project} on Scry`. For a workspace: `{Name} invited you to the {Workspace} workspace on Scry`. A renewal starts with `Reminder:`.
- **Body:** one sentence saying who invited them, to what, and as which role; one **Accept invitation** button; the same link as plain text; the expiry date; and a line saying to ignore the email if they don't know the person who invited them. Nothing happens until they accept.

The button opens `https://dashboard.scrymore.com/invites/<id>`, the same link shown in the dialog. Scry does not add tracking pixels or wrap links, so the link goes straight to the dashboard. The invite expires **7 days** after it is created or renewed. To accept, the recipient signs in with GitHub as the address the invite was sent to; if they are signed in as a different account, the invite page says so.

Names in the email (the inviter, the project or workspace) are cleaned before they are used: long names are shortened, and web addresses and `@` signs in a name are defused, so a project name cannot turn the email into a link to somewhere else.

## Resend and copy the link

- **Copy the link.** The link field in the dialog is always there, in every state shown above. Paste it into a message, a chat or a ticket. It is the same link the email contains.
- **Renew and email again.** In the pending invites list, open the row menu and choose **Renew and email again**. It gives the invite a fresh 7 days and sends a reminder email. If the last email for that invite went out less than 10 minutes ago, Scry does not send another and the dialog says when it was sent.
- **Revoke.** Revoking an invite deletes it, so the link in an email that was already sent stops working.

## If the email doesn't arrive

Check these in order:

1. **Look in spam or junk.** Invite email comes from a fixed sender, `invites@mail.scrymore.com`. If it landed in spam, mark it as not spam and add that sender to the recipient's contacts.
2. **Wait a few minutes**, then ask the recipient to check again. Mail is not always instant.
3. **Check the dialog.** If it said `Couldn't send the email`, the email was not sent at all. If it said `We can't email this address`, see below.
4. **Send the link yourself.** Copy it from the dialog (or use **Renew and email again** to bring the dialog back for that address) and send it by another route. The link works the same whether or not an email was sent.

### An address Scry can't email

Some addresses are unavailable for email, for example an address that mail has been refused for before. Scry shows the same message for every address it can't email, `We can't email this address`, and does not say why. The invite is still created and the link still works, so use the link. The same message appears for any address that Scry's test environment declines to email, so the message alone does not tell you the reason.

## Limits

Invite emails are limited so Scry cannot be used to flood anyone's inbox. The invite itself is always created; only the email is skipped, and the dialog tells you.

- **Per person:** 20 invite emails per person per day. This is well above a normal day of inviting a whole team.
- **Per address:** 3 emails per day to any one address, counted across everyone who invites it.
- **Per invite:** one email per invite every 10 minutes. Pressing **Invite** twice, or renewing straight after sending, sends one email.
- **Across Scry:** a daily ceiling across all invite emails.

Days are counted in UTC and the counters reset at midnight UTC. When you reach a limit, copy the link from the dialog, or try again after the reset.

## Staging and test environments

Scry's test (staging) environment never emails real people. Invites created there are recorded for testing and are only delivered to a small list of test addresses that Scry's own team controls. Invites created on [dashboard.scrymore.com](https://dashboard.scrymore.com) are the ones that send real email.

## Related

- [Members and invites](/guide/members-and-invites): roles, expiry, and accepting an invite.
