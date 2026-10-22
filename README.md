# TestFlow · Team HaiQuayXe

**[Watch the two-minute demo on YouTube](https://youtu.be/YUJ8YIpAtIM)**

[Download the MP4 copy (5.6 MB)](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe/raw/refs/heads/main/demo/testflow-demo.mp4)

TestFlow helps a testing team keep working when its project owner is unavailable. A tester requests permission to change case severity, two stewards review the request, and the tester can finish the task. Exporting a report requires separate approval.

The idea came from our Software Testing course. An Atlassian MCP connection needed site-admin authorisation, leaving us dependent on one teammate. We built a standalone workspace to explore how a team could delegate a specific task without handing out administrator access. The records are synthetic; TestFlow does not connect to Jira.

The demo follows one request from locked access to two distinct approvals, a severity update and an activity record. One approval grants nothing. Editing access never unlocks report export, and the server checks permissions on each action.

TideCloak is intended to protect the authority to issue those permissions through signed policy and eligible approvers. We used Tide's MCP to plan that integration. Under [official Plan C](https://tide.org/unlocked/#plan-c), this prototype simulates sign-in and approvals while enforcing the demonstrated permissions in its own backend. The visible simulation label makes that distinction clear. The [integration map](docs/c2-plan-c.md) explains the live design and what remains unverified.

## Run

Use Node.js 24:

```powershell
cd apps/testflow
npm ci
npm run demo
```

Open [the simulation](http://127.0.0.1:3030/demo). The [demo walkthrough](docs/c2-demo-runbook.md) shows the main flow; the [setup guide](apps/testflow/README.md) covers configuration and tests.

**Challenge 1:** approved mmBERT Base achieved **0.96654** on the public leaderboard. The [Kaggle guide](docs/kaggle-c1-guide.md) documents training and validation. Final standings use the private test portion.

[Contribution commands](CONTRIBUTING.md) · [Architecture](docs/architecture.md) · [2026 requirements](docs/2026-brief.md)
