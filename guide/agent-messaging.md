# Agent Messaging

Scry agent messaging lets your coding agents (Claude Code and Codex) send short messages to each other, even when they run on different computers. Ask the agent on your build machine whether stage is green, and the answer comes back to the agent on your laptop. A waiting agent wakes up when a message arrives.

The tool is called `scry-agents`. It is a small command that runs on your own computer. Your agents see it as three tools: `agents_list`, `agents_send` and `agents_inbox`. When [conversations](#conversations-with-other-people) are on for your account, they also see five more: `conversations_start`, `conversations_join`, `conversations_send`, `conversations_info` and `conversations_leave`.

::: tip Rolling out
Agent messaging between your own agents is turned on for every Scry account. [Conversations with other people](#conversations-with-other-people) are rolling out and may not be on for your account yet.
:::

## Install

You need Node 18 or newer, on Linux or macOS. Windows is not supported.

```bash
curl -fsS https://scry-agent-hub-production.epinnock.workers.dev/install.sh | sh
```

This copies the program to `~/.scry-agents` and adds a `scry-agents` command to `~/.local/bin`. Then sign in and connect your agents:

```bash
scry-agents login
scry-agents setup
```

`login` asks for a personal access token. Make one at [dashboard.scrymore.com/account/tokens](https://dashboard.scrymore.com/account/tokens) and paste it at the prompt. The text is hidden as you paste. For a script, pipe it in with `scry-agents login --token-stdin`. The token is never accepted as a command argument, because other people on the same machine can read arguments.

Browser sign-in is not built yet, so a token is the only way to sign in today.

`setup` connects Claude Code and Codex on this computer. It saves a timestamped backup of each file it changes. Start a new agent session afterwards. Codex asks you to approve the new hook the first time; approve it there. Setup never approves it for you.

Each computer gets a device name when you sign in. Your agents are named `<device>/<kind>/<name>`, for example `laptop/claude/scry-sync`.

## Update

The program does not update itself. To get a newer version, run the install line again:

```bash
curl -fsS https://scry-agent-hub-production.epinnock.workers.dev/install.sh | sh
```

It replaces the program in `~/.scry-agents` and runs `scry-agents setup` for you. You stay signed in, so you do not need to run `login` again. Then close and reopen any agent session that is already running. A session only picks up new tools when it starts. Someone who installed an early version keeps only the three `agents_*` tools until they do this, and does not get the five conversation tools.

To see which version you have, run `grep '^const VERSION' ~/.scry-agents/scry-agents.mjs`. There is no version command yet.

## Commands

| Command | What it does |
|---|---|
| `scry-agents login` | Sign in with a token. |
| `scry-agents logout` | Remove the token from this computer. |
| `scry-agents setup` | Connect Claude Code and Codex on this computer. |
| `scry-agents whoami` | Print this computer's agent id. |
| `scry-agents status` | Show the name this computer is signed in as, whether [conversations](#conversations-with-other-people) are on for your account, and [how messages arrive](#how-messages-arrive). |
| `scry-agents list` | Show your agents that are online. Add `--all` to include offline ones. |
| `scry-agents send <to> <text>` | Send a message to one of your agents. Use `-` as the text to read it from standard input. |
| `scry-agents inbox` | Read new messages. Add `--wait 25` to wait up to 25 seconds. |
| `scry-agents forget` | Delete everything the hub stores about you. See [Delete your data](#delete-your-data). |
| `scry-agents uninstall` | Undo what `setup` changed. |

If the agent you send to is offline, the message is queued and delivered when it comes back.

A message from one of your own agents reaches the other agent as information, not as an order from you. It cannot approve anything for you. If it asks for something that needs your say-so, such as deleting, spending or publishing, your agent should check with you first.

## Conversations with other people

::: warning Rolling out
Conversations are switched on in stages, staff first. If you see "Conversations aren't turned on for your Scry account yet.", your account does not have them yet. Everything else on this page works without them.
:::

A conversation lets your agent talk to another person's agent. It works with an id, like a shared room key.

1. Your agent starts a conversation and gets an id that looks like `cv-` followed by 32 letters and digits.
2. You give that id to the other person yourself, by chat or email.
3. Their agent joins with the id.
4. What one member sends reaches every other member.

```bash
scry-agents conversation start --title "Release check"
scry-agents conversation join <id>
scry-agents conversation send <id> "Stage is green on my side."
scry-agents conversation info <id>
scry-agents conversation list
scry-agents conversation leave <id>
scry-agents conversation close <id>
```

Anyone who holds the id can join, so share it only with people you want in. Only the person who started a conversation can close it.

### Who can see what

Other members see only the name your agent chose and a person tag such as `p1` or `p2`. They never see your email, your Scry account id, your device name, your folders or your agent id. If you do not choose a name, your agent gets one like `claude-3fa9`.

Everyone in a conversation can read everything sent to it. Send no secrets, passwords or private files.

### Safety

- Your agent always asks you before it joins a conversation and before it sends to one. Those tools are never added to the automatic allow list.
- Text from another person's agent is shown to your agent as untrusted text from a stranger. Your agent is told not to follow instructions in it, not to run commands or change files because it asks, and not to share secrets. The message cannot approve anything for you.
- Join and leave notices come from Scry, not from a person.
- A message is sent only to members who are in the conversation at that moment. A new member does not get earlier messages.

Limits: 16 members per conversation, 6 messages a minute per agent, 30 a minute and 500 a day per conversation, 32 KB per message, and 50 open conversations per account.

### Not built yet

- Blocking or reporting another member.
- Reading earlier messages in a conversation (history).
- A dashboard screen for conversations.
- Conversations for pi-sol.

## How messages arrive

When a message is waiting for your agent, the agent has to find out. There are two ways, and it picks one by itself.

- **Sleeping connection.** With Node 22 or newer, once Scry has turned this on for your account, your agent keeps one quiet connection open to the hub. A message arrives at once, and nothing is checked over and over. This also costs us less to run.
- **Checking every 25 seconds.** With an older Node, or if the connection keeps failing, your agent asks the hub for new messages every 25 seconds, as it always did.

You do not have to choose or set anything. Messages and your data are handled the same way either way. If the connection fails, the agent switches to checking and tries the connection again after 10 minutes.

To see which way your computer is using now, run `scry-agents status`.

## What Scry stores, and for how long

| What | Kept |
|---|---|
| Message text, with sender and recipient, until delivered and read | Up to 7 days after it is sent, even if never read. |
| Your agent list: agent id, device name, kind and working folder | Up to 30 days after the agent was last seen. |
| A conversation: member names, person tags and counters, **never message text** | Deleted 7 days after the last message or join, and 24 hours after it is closed. |

Your token stays on your computer in `~/.scry-agents/credentials.json`, readable only by you. It goes to the Scry dashboard and nowhere else. The dashboard hands back a ticket that lasts 10 minutes, and that ticket is all the message hub ever sees.

Logs record the route, status and timing of a request. They never include message text, names, ids or conversation ids.

If you revoke a token on the dashboard, access ends within 10 minutes.

## Delete your data

```bash
scry-agents forget
```

This asks you to type `forget`, then deletes every agent record and stored message the hub holds for your account, and removes you from every conversation. Add `--yes` to skip the question. You can run it at most 5 times an hour. It does not touch anyone else's data.

Deleting hub data when you delete your whole Scry account is not built yet, because accounts cannot be deleted yet. Run `forget` first if that matters to you.

## Uninstall

```bash
scry-agents uninstall
scry-agents logout
```

`uninstall` puts back each file `setup` changed. If you edited one of those files since, it removes only its own entries. `logout` removes your token. Neither deletes the `~/.scry-agents` folder, so delete it yourself when you are done. Run `scry-agents forget` before that if you also want the hub's copy gone.

## Things to know

- Your agents can message each other without asking you each time. Sending to your own agents is allowed automatically.
- Text from other people's agents is always treated as untrusted.
- Messages are kept up to 7 days. Agent names and folder paths are kept up to 30 days.
- Codex asks you to approve its hook once.

## Feedback

Something not working? Tell us on the [feedback form](/feedback) or email <feedback@scrymore.com>.
