# TestFlow: two-minute demo and delivery runbook

Use the live version only after genuine Tide sign-in and independent approvals work. The current preview is functional for browsing synthetic cases; it cannot demonstrate authenticated edits, exports or governance. The team reported an organiser-wide Tide licensing incident on 22 October. That dependency is still unresolved.

## Understand the app before rehearsing

**TestFlow is a testing workspace where a teammate can ask for one useful permission and independent stewards can jointly grant it.**

Imagine the original project owner is away. You need to change a test case's severity for a report. In TestFlow, you request editing access and explain the reason. Stewards review the request and make the real permission change through TideCloak. Once that grant is committed and your session is refreshed, the server allows the edit. Editing does not also grant report export or administrator access.

The app stores the request and checks permissions. TideCloak supplies the signed identity and governs protected grants. A request in our app is not an approval. The intended two-of-three approval rule must be confirmed on the live realm. Approvals apply to the permission grant, not every subsequent edit.

Our course experience inspired this workflow. The screenshot we received showed an Atlassian MCP app awaiting site-admin authorisation; it did not prove Jira itself lacks editing or export features. TestFlow uses eight synthetic test cases and is not connected to Jira.

## What the team should do now

1. Choose one narrator and practise the words below slowly. Use the preview at `http://127.0.0.1:3030` to learn the layout.
2. Have a second person navigate while the narrator speaks. Practise search, case details and the delegation panel; restricted actions will remain unavailable in preview.
3. Time one rehearsal. Aim to finish the narration in 1:50, leaving ten seconds for transitions and the closing screen.
4. Keep the three stewards available for their own enrolment if Tide recovers. Pass any new support instructions to the coding lead.

No coding or manual model training is assigned to the team. Recording, personal enrolment and a final review of the video still need people. The coding lead handles code, model checks, packaging and submission verification.

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
| 0:00–0:18 | TestFlow workspace; team and project name visible. | “Hi, we're Team HaiQuayXe. During our Software Testing course, an access problem left us depending on one teammate to help finish our report. We built TestFlow so a team can delegate specific work when its original owner is unavailable.” |
| 0:18–0:35 | Tester searches a case and opens details; editing and export are restricted. | “Here is our testing workspace, using sample data. I can review a case, but I cannot change its severity or export the report. Those are separate permissions, and neither requires making me an administrator.” |
| 0:35–0:50 | Tester saves a `test-editor` request; steward inbox shows identity, capability and reason. | “I request editing access and explain what I need to do. This saves a request, not a grant. A steward reviews it and proposes the permission change in TideCloak.” |
| 0:50–1:10 | Real Tide console: confirmed threshold and first independent approval; pending change. Tester refreshes permissions and is still denied. | “Our configured rule requires two independent approvals. After the first approval, the change is still pending and I still cannot edit. One steward cannot grant this protected permission alone.” |
| 1:10–1:34 | Second steward signs; show committed state. Tester refreshes, edits a severity and reloads to show persistence. | “The second steward approves. Tide commits the grant, and I refresh my session. Now I can update this case's severity. The server checks my signed permission before accepting the change, and the update stays after a reload.” |
| 1:34–1:48 | Export remains restricted for the edit-only tester; activity shows the successful edit. | “Export is still restricted because I requested editing only. A complete report needs its own permission. The activity history records the change we just made.” |
| 1:48–2:00 | Workspace and closing team/repository title. | “The goal is simple: help a team keep working when its owner is unavailable, without giving everyone control over access. That's TestFlow.” |

Use the real request reason: **“I need to update test-case severity for our course report. I do not need export access.”** Keep the cursor still while speaking; let the viewer see each result. Put a short caption on the opening screen: **“Local prototype · synthetic test data · no Jira connection.”** Do not film credentials or enrolment screens. This is a storyboard until the live checklist below passes; it is not evidence that these actions already work with Tide.

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

At **16:15 Vietnam**, decide which version can be recorded reliably by 16:40. Preserve working code and the failed realm state. Follow new support instructions; do not keep creating realms or weaken the approval threshold to make a demonstration succeed. If Tide recovers, continue genuine verification while keeping the preview recording available. Replace the preview only when the live flow is verified and there is time to upload and check it.

Prepare an honest preview recording while awaiting recovery. This is a fallback artifact, **not proof that the mandatory live Tide integration works**. Keep the setup-required banner visible. Use this alternative sequence:

| Time | What to show and say |
|---|---|
| 0:00–0:25 | Explain the real course-project bottleneck and the specific-capability idea. |
| 0:25–0:55 | Search/filter actual synthetic cases and open a case's steps. Show the separate editing and report permissions, currently disabled. |
| 0:55–1:20 | Show the implemented access checks and passing local test summary. Say: “These checks verify application behavior; they are not a live Tide demonstration.” Do not expose environment files. |
| 1:20–1:40 | Explain the planned two-of-three steward flow as a design. Say: “Tide's licensing service is currently unavailable, so real sign-in and quorum enforcement remain unverified.” |
| 1:40–2:00 | State what is built, what remains blocked, and the recovery steps. End with the repository and team name. |

For the preview version, keep the live script's introduction, then use these words while showing the actual preview:

> This is our testing workspace, using eight sample cases. I can search for a case, read its steps and see its severity and status. The delegation panel keeps editing and report export separate.
>
> The design is straightforward. A teammate requests one permission and explains why. A steward reviews that request and proposes the real role grant in TideCloak. Our intended setup requires two independent stewards to approve. Saving a request in TestFlow does not itself grant access.
>
> We have implemented the application, permission checks, report generation and activity history. The local build and application tests pass. However, Tide's licensing service is currently blocking activation. We have not verified real sign-in or quorum approval, so this recording is a preview, not a live integration demonstration.
>
> The disabled actions are deliberate: without a verified permission, the app should not let me edit or export. Once activation is restored, our next steps are to enrol the users, verify the approval threshold, and test the full grant-and-edit sequence.
>
> Our aim is to help a team keep working when its owner is unavailable, without giving everyone control over access. We're Team HaiQuayXe, and this is TestFlow.

If support resolves the incident in time, replace the middle preview footage with the verified live flow. Ask organisers about how the outage affects judging when a representative is available; do not assume an exception or extension.

## Final file and submission

1. Record/export **`demo/testflow-demo.mp4`**, approximately two minutes and **strictly under 100 MB**. Keep the actual recording inside the repository; a script or video link does not satisfy that requirement.
2. Watch the exported file from beginning to end. Check readable UI, audible narration, no secrets, truthful captions and no broken frames. Record its duration and size.
3. Update the root README's overview to match what was actually demonstrated, keeping its five judging prompts within 300 words. Link the video prominently.
4. Push source, README and video. Verify the public repository and video without relying on the team's signed-in session.
5. Target **17:00 Vietnam** for the [official form](https://forms.gle/HRHYjnqB86j1LFS97): group **RMIT_SGS_HaiQuayXe_C2**, repository **https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe**. Submit earlier if the package is complete. The official deadline remains **18:00 Vietnam**.
6. Preserve the confirmation and submitted commit. Do not mark C2 complete before the required artifacts and actual form submission exist.

## Delivery times — Vietnam time, 22 October

| Time | Deliverable / owner |
|---|---|
| Now–16:00 | Team rehearses; coding lead continues C1 and prepares the final package. |
| 16:15 | Choose the honest recording route based on actual Tide availability and verification. |
| By 16:40 | Team saves a complete recording; coding lead checks duration, sound and file size. |
| By 16:50 | Coding lead pushes the video and final README, then checks public access. |
| By 17:00 | Target C2 form submission and confirmation. Existing C1 accepted submission stays preserved; submit verified improvements as soon as ready. |
| By 17:15 | Target final C1 selection and matching notebook publication. |
| 17:00–17:30 | Resolve upload/form problems, verify receipts and save the delivered commit. |
| 18:00 | Official deadline. Do not depend on a last-minute upload or an unconfirmed extension. |

For easier uploading, aim for a readable 720p or 1080p H.264 MP4 around **15–30 MB**; the hard requirement is **under 100 MB**. Rehearsal time is not recording time: allow a second take and watch the exported file. An outage-labelled preview is a truthful fallback but does not prove the required live Tide integration or guarantee judging eligibility.

## Questions the team should be ready to answer

**What is new here?** The testing workspace demonstrates specific permissions granted through shared approval when the original owner is unavailable. The table of test cases is only the setting for that workflow.

**Does every severity edit need two approvals?** No. The protected permission grant does. Once granted, the tester can use that permission until it is changed or revoked and their session reflects the change.

**Can one steward grant access?** That is the intended restriction. We can only claim it works after the real realm shows a pending grant below its threshold and a committed grant once the threshold is met.

**Is this a Jira plugin?** No. The course experience inspired a standalone prototype using synthetic records.

**Are the records encrypted against the server owner?** No. This prototype checks signed permissions at the API. Its local records and ordinary activity history are not end-to-end encrypted or tamper-proof.
