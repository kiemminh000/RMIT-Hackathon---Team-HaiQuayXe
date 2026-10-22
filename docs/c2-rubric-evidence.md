# TestFlow: judging evidence for Plan C

This is an evidence map, not a predicted score. The [official Plan C notice](https://tide.org/unlocked/#plan-c) permits this simulation with equal judging treatment. The product must still explain where Tide fits and why shared grant authority matters.

| Criterion | Weight | Story and evidence to present |
|---|---:|---|
| Vision & originality | 25% | The original project owner is unavailable; shared stewardship delegates a narrow testing task instead of requiring the owner to do it. |
| Trust constraint insight | 20% | Show that a request and one simulated approval grant nothing. Two distinct eligible simulated subjects must approve. Explain that real Tide policy would protect grant authority. |
| Value & impact | 20% | Return to Tester, change TF-003 severity, and show export still locked. Avoid invented time-saved or adoption statistics. |
| Why TideCloak matters | 20% | Explain the difference between an operator-controlled role table and signed-policy governance. Cite the actual MCP planning and the [integration map](c2-plan-c.md). Never describe the demo cookie or counter as Tide signatures. |
| Prototype & storytelling | 15% | Show the working request, pending approval, completed grant, server-permitted edit and activity. The separate export permission produces all 11 fields after its own approval sequence. |

## Current evidence

Tests verify denied access without a role, denial after one approval, a grant after two distinct eligible subjects, rejection of duplicate/self approvals, separate export/edit capabilities, session expiry/forgery, reset and the disabled-mode gate. The production build and TypeScript checks pass, with **22 passing tests, no skips**, and **43 HTTP checks** against the running application. Browser rehearsal verified the approval sequence, a severity change surviving reload, and export still locked for the edit-only tester. These are observed simulation behaviors, not evidence of real Tide signatures.

The [recorded demonstration](../demo/testflow-demo.mp4) shows the Plan C label, request, first approval, completed grant, tester workspace and activity. The MP4 contains 1080p H.264 video and AAC audio; both streams passed a complete decode check. The root README explains the problem, intended value and Tide integration, with a [walkthrough](c2-demo-runbook.md) for replaying the flow.

## What the demo does and does not establish

The server enforces the simulation's two-of-three rule and exact capabilities. One viewer deliberately controls all demo identities; there is no claim of independent real approvers. Live Tide thresholds follow signed policy, and live canon does not universally forbid an eligible requester from approving their own change. Self-approval rejection is our additional demo policy.

The live path remains separate. Its SDK verification and setup are retained, but real enrollment and governed grants remain unverified. That no longer blocks delivery under official Plan C. Synthetic records, ordinary activity and a selectable identity cannot prove confidentiality, tamper resistance or protection from the app operator.

Keep the explanation centered on shared authority and useful work. Additional dashboards, a Jira connection or an unverified encryption claim are outside this demonstration.
