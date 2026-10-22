# TestFlow · Team HaiQuayXe

**Vision & originality.** TestFlow lets a testing team delegate a specific task when its project owner is unavailable. A tester requests severity-editing access; two different simulated stewards review it. Report export stays separately controlled.

**Trust constraint insight.** Our Software Testing project depended on an owner when an Atlassian MCP connection required site-admin authorisation. That inspired a question: who can grant access when the usual owner is absent? TestFlow is standalone, with synthetic records and no Jira connection.

**Value & impact.** The tester can finish the review without receiving administrator access or asking someone else to perform the work. One approval remains insufficient; the second unlocks only the requested capability.

**Why TideCloak matters.** Ordinary backend permissions leave grant authority with the application's administrator. Our intended Tide integration governs that authority through signed policy and distinct eligible approvers. We used Tide's MCP to plan the integration; the [Plan C implementation map](docs/c2-plan-c.md) distinguishes it from today's simulation.

**Prototype & storytelling.** The working simulation demonstrates requests, approvals, server-enforced access, severity changes and complete CSV export. It uses selectable demo identities, not real Tide signatures. [Official Plan C](https://tide.org/unlocked/#plan-c) gives simulated and live integrations equal judging treatment. The demo video and final form are still pending.

## Run

Use Node.js 24:

```powershell
cd apps/testflow
npm ci
npm run demo
```

Open [the simulation](http://127.0.0.1:3030/demo). Follow the [two-minute script](docs/c2-demo-runbook.md), [setup guide](apps/testflow/README.md) and [submission checklist](docs/submission-checklist.md).

**Challenge 1:** best accepted public score **0.96654**, using approved mmBERT Base. See the [Kaggle guide](docs/kaggle-c1-guide.md) and final-selection checklist. Final standings use the private test portion.

[Contribution commands](CONTRIBUTING.md) · [Architecture](docs/architecture.md) · [2026 requirements](docs/2026-brief.md)
