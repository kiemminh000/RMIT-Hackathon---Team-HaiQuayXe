# TestFlow: two-minute demo and delivery runbook

Use the live version only after genuine Tide sign-in and independent approvals work. The current preview is functional for browsing synthetic cases; it cannot demonstrate authenticated edits, exports or governance. The team reported an organiser-wide Tide licensing incident on 22 October. That dependency is still unresolved.

## One sentence

**TestFlow lets a testing team delegate specific work without concentrating permission-granting authority in one owner.**

## Four-person rehearsal

| Person | Job during the demonstration |
|---|---|
| Tester / narrator | Explain the course-project problem; request a capability; retry the action after the real grant. |
| Steward A | Review the tester's identity and request; propose/sign the actual Tide role change. |
| Steward B | Independently review and sign; verify that the live threshold is satisfied. |
| Steward C / recorder | Remain a genuinely enrolled third steward; record the screen, check timing and review the final file. |

Separate browser profiles on this computer keep sessions distinct. Each person controls their own enrollment and recovery information. Three independent stewards with a live threshold of two is the intended configuration, not an already demonstrated fact. Confirm it in the console before recording.

## Live recording: 120 seconds

The spoken lines below describe the intended **observed** sequence. Skip or rewrite any claim the recording does not establish. Rehearse once; speed up setup transitions if necessary, but show the pending/committed states and actual result legibly.

| Time | Screen / action | Narration |
|---|---|---|
| 0:00–0:18 | TestFlow workspace; team and project name visible. | “In our Software Testing course, updating severity and exporting a report became dependent on one teammate. The access problem stopped the whole team. TestFlow separates the work people need to do from the authority to grant access.” |
| 0:18–0:35 | Tester searches a case, opens details; editing/export are restricted. | “This is our synthetic testing project. A teammate can review cases, but editing severity and exporting the complete report are separate capabilities. Nobody needs broad administrator access just to prioritise a test.” |
| 0:35–0:50 | Tester saves a `test-editor` request; steward inbox shows identity, capability and reason. | “I request editing access and explain why. Saving this request changes no permissions. A steward reviews the identity and proposes the actual grant in TideCloak.” |
| 0:50–1:12 | Real Tide console: configured threshold and first independent approval; pending change. Refresh tester permissions; editing remains unavailable. | “This realm requires two independent approvals. One steward has approved, but the change remains pending. The tester still cannot edit. The app has no button that grants this permission on its own.” |
| 1:12–1:35 | Second steward signs; committed status. Tester refreshes/re-enters session, changes one severity; activity records it. | “A second steward approves the same change. Once Tide commits it, the tester refreshes their signed permissions and updates the severity. The server checks that capability before accepting the edit.” |
| 1:35–1:48 | Export remains restricted for the edit-only tester. Optionally show an independently, previously granted export role and an actual CSV. | “Editing permission does not grant export permission. The complete eleven-field report needs its own capability. That keeps delegation specific and understandable.” |
| 1:48–2:00 | Workspace and closing project title. | “TestFlow keeps teams moving through shared stewardship. Today it is a local prototype with synthetic data. Tide governs permission grants; our ordinary activity history is not tamper-proof, and this is not a Jira integration.” |

## Verify before recording the live version

- [ ] A real licensed realm and public adapter are installed; the app reaches a genuine Tide login.
- [ ] One tester and three independent stewards have enrolled. The configured approval threshold is visible.
- [ ] Tester begins without either app capability. Missing/invalid tokens are rejected; missing roles do not allow actions.
- [ ] A saved application request alone leaves permissions unchanged.
- [ ] The actual role grant remains pending after the first approval, and the tester is still denied.
- [ ] Required independent approvals commit the change. A refreshed signed session enables only the granted action.
- [ ] An edit succeeds and persists after reload. Edit-only access still cannot call the export endpoint.
- [ ] A separately authorised export produces a readable CSV containing all 8 synthetic records and 11 fields, including multiline steps.
- [ ] Tokens, enrollment links, recovery details, email addresses and bootstrap credentials are outside the capture.

Use the [application setup and verification guide](../apps/testflow/README.md) for exact configuration. Local unit tests and forged-token tests cannot establish real Tide enrollment or approval behavior.

## If Tide remains unavailable

At **16:30 Vietnam**, assess whether there is enough time to activate, enroll, verify and record the real flow. Preserve working code and the failed realm state. Follow new support instructions; do not keep creating realms or weaken the approval threshold to make a demonstration succeed.

Prepare an honest preview recording while awaiting recovery. This is a fallback artifact, **not proof that the mandatory live Tide integration works**. Keep the setup-required banner visible. Use this alternative sequence:

| Time | What to show and say |
|---|---|
| 0:00–0:25 | Explain the real course-project bottleneck and the specific-capability idea. |
| 0:25–0:55 | Search/filter actual synthetic cases and open a case's steps. Show the separate editing and report permissions, currently disabled. |
| 0:55–1:20 | Show the implemented access checks and passing local test summary. Say: “These checks verify application behavior; they are not a live Tide demonstration.” Do not expose environment files. |
| 1:20–1:40 | Explain the planned two-of-three steward flow as a design. Say: “Tide's licensing service is currently unavailable, so real sign-in and quorum enforcement remain unverified.” |
| 1:40–2:00 | State what is built, what remains blocked, and the recovery steps. End with the repository and team name. |

If support resolves the incident in time, replace the middle preview footage with the verified live flow. Ask organisers about how the outage affects judging when a representative is available; do not assume an exception or extension.

## Final file and submission

1. Record/export **`demo/testflow-demo.mp4`**, approximately two minutes and **strictly under 100 MB**. Keep the actual recording inside the repository; a script or video link does not satisfy that requirement.
2. Watch the exported file from beginning to end. Check readable UI, audible narration, no secrets, truthful captions and no broken frames. Record its duration and size.
3. Update the root README's overview to match what was actually demonstrated, keeping its five judging prompts within 300 words. Link the video prominently.
4. Push source, README and video. Verify the public repository and video without relying on the team's signed-in session.
5. Target **17:30 Vietnam** for the [official form](https://forms.gle/HRHYjnqB86j1LFS97): group **RMIT_SGS_HaiQuayXe_C2**, repository **https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe**. The official deadline remains **18:00 Vietnam**.
6. Preserve the confirmation and submitted commit. Do not mark C2 complete before the required artifacts and actual form submission exist.
