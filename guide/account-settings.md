# Account settings

**Account** in the dashboard holds settings that belong to you rather than to a workspace or a project.

## Help

**Account ▸ Help** (`/account/help`) is where you replay the dashboard tours.

- **Replay tours** lists each tour with whether you finished or skipped it. Choose **Replay** to clear it and start it again where it begins.
- Replay is disabled when the page it opens does not exist for you yet (for example you have no project).

| Tour | Replay opens |
|---|---|
| Welcome | The Projects page |
| Your first project | Your most recent project |
| Review your screens | The Screens page of your most recent project |
| The diff editor | The screen you looked at last in this browser. Disabled until this browser has opened a screen |
| Triage issues | The Issues page of your most recent project |
| Fix an issue | The most recent open issue in your most recent project. Disabled when the project has no open issue |
| Usage & credits | The Usage & credits page of your active workspace (listed only where credits are on) |
| Low credits | The Screens page of your most recent project (listed only where credits are on) |
| Capture sources | Settings > Figma of your most recent project |
| Build sources | The Builds page of your most recent project |
| Capture warnings | The Screens page of your most recent project |
| Coverage report | The Coverage page of your most recent project. Needs a project with a coverage report |
| Power tips | The Builds page of your most recent project |

Replay ignores the conditions a tour normally waits for. A tour about something your project does not have (a capture warning, a second capture source) can show fewer steps or none.

![Account, Help: a tour with its Replay button](/images/coachmarks/account-help-replay-tours.png)

Tours are described in [Quick Start](/guide/quick-start#the-dashboard-tour). Each shows once, only on screens 900 pixels wide or more. Esc and **Skip tour** dismiss a card.
