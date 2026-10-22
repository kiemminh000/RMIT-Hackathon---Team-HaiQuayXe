# TestFlow: two-minute Plan C demo and delivery runbook

Use the working simulation at **http://127.0.0.1:3030/demo**. [Official Plan C](https://tide.org/unlocked/#plan-c) permits this route with equal judging treatment. Keep the simulation banner visible and explain it at the start. Live Tide activation is not a prerequisite for recording or submission.

## Prepare once

1. On this computer, the app is already running: open **http://127.0.0.1:3030/demo**. Do not start a second server. On a fresh checkout, use Node.js 24 and run `npm ci`, then `npm run demo` from `apps/testflow`.
2. Open `/demo`. Select **Reset rehearsal**, then **Reset demo data**. Start from no identity, no requests and no grants.
3. Pick a narrator and a screen operator. A third teammate watches timing and readable text; a fourth records and checks the final file. They do not need to enrol real Tide identities for this simulation.
4. Rehearse the exact clicks below once. One operator switches all demo identities; never describe these as independent real approvals.
5. Use a readable browser zoom, hide personal tabs, and leave the simulation banner visible. Aim for a 1:50 take plus ten seconds of closing footage.

## Main recording: about two minutes

| Time | Exact screen/action | Spoken words |
|---|---|---|
| 0:00–0:18 | Show the simulation banner and workspace. | “We're Team HaiQuayXe. This is TestFlow, using the organiser's Plan C simulation. During our Software Testing project, an access problem left us relying on one teammate. We asked: can the team keep working when its owner is unavailable?” |
| 0:18–0:32 | Choose **Tester**. Show TF-003 and the locked **Export all fields** button. | “Our tester can inspect these synthetic cases, but cannot change severity or export a report. Those are separate permissions. The tester does not need administrator access.” |
| 0:32–0:48 | Click **Request editing access**. Keep the supplied reason or enter the reason below. Click **Save demo request**. The page scrolls to Access requests, showing 0/2. | “I ask for editing access and explain the task. Saving this request grants nothing. The demo server keeps access locked until two different eligible stewards approve.” |
| 0:48–1:05 | In **Review as**, choose **Steward A**. Click **Approve request**. Show 1/2, **Another steward needed**, and **Already approved**. | “Steward A approves. One approval is insufficient, and repeating it cannot count twice. The request stays pending, so the tester still cannot edit.” |
| 1:05–1:24 | In **Review as**, choose **Steward B**. Click **Approve request**. Show 2/2 and **Demo grant complete**. Click **Return to Tester**. | “Steward B supplies the second distinct demo approval. The server grants only editing. These identities are selectable simulations; no real Tide signature is being created.” |
| 1:24–1:42 | Scroll to TF-003. Change the **Demo severity for TF-003** dropdown from medium to high. Show success; **Export all fields** remains locked. | “Back as the tester, I can now change this case's severity. The server checks the capability. Export is still locked because editing never grants the separate report permission.” |
| 1:42–2:00 | Show Rehearsal activity, then the workspace/team name. | “In the intended live system, Tide's signed policy protects who can issue these grants. We used Tide's MCP to plan that integration. This simulation shows the workflow: shared approval, one useful permission, and a team that can keep moving.” |

Suggested reason: **“I need to update test-case severity for our course report. I do not need export access.”** The dropdown's accessible label is **Demo severity for TF-003**; the visible current value is **medium** before the edit. Allow each successful response to finish before the next click.

## Separate CSV rehearsal

The main recording intentionally ends with export locked, proving separate capabilities. Verify export separately before filming; include a short extra shot only if the recording remains about two minutes.

1. As **Tester**, click **Request export access**, then **Save demo request**.
2. On the **Export all fields** request card, use **Review as → Steward A → Approve request**, then **Review as → Steward B → Approve request**. Editing approvals do not count toward this new request.
3. Click **Return to Tester**, then the enabled **Export all fields** button above the cases.
4. Open the downloaded CSV. Confirm 8 synthetic cases and all 11 fields, including multiline steps and the updated severity.
5. Reset the rehearsal before recording the main story so its initial locked state is genuine.

## Verify before pressing Record

- [ ] The page shows **Plan C simulation** and the correct team/project.
- [ ] The clean tester cannot edit or export.
- [ ] Saving the editing request shows 0/2 and grants nothing.
- [ ] One approval shows 1/2; the same steward cannot approve again.
- [ ] The second distinct steward completes the grant; returning to Tester enables severity editing only.
- [ ] TF-003 changes successfully and remains changed after reloading the page.
- [ ] Export remains locked after the editing grant; its separate approval flow yields a valid CSV.
- [ ] Narration describes selectable identities and intended Tide integration accurately.
- [ ] No credentials, enrollment links, recovery information or personal records appear.

This checklist is for the actual rehearsal; leave boxes open until observed. The [Plan C integration map](c2-plan-c.md) supplies the technical explanation. Two-of-three is our chosen demo policy. Real Tide thresholds follow signed policy; the recording does not claim real cryptographic enforcement or malicious-host protection.

## Save and submit

1. Record **`demo/testflow-demo.mp4`**, about two minutes and **strictly under 100 MB**. A script, screenshot or external video link does not replace the required file inside the repository.
2. Watch the entire exported file. Confirm audible narration, readable states, truthful simulation labels, successful actions and no private information. Check duration and byte size. H.264 at 720p or 1080p around 15–30 MB is a practical target.
3. Add the actual video link to the root README after the file exists. Push source, README and video; check anonymous access and playback.
4. Submit the repository URL through the [official C2 form](https://forms.gle/HRHYjnqB86j1LFS97) with group **RMIT_SGS_HaiQuayXe_C2** and repository **https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe**.
5. Save the form confirmation and submitted commit. Do not mark video or form complete before those artifacts exist.

| Vietnam time, 22 October | Deliverable |
|---|---|
| Now | Finish one complete simulation rehearsal and timed take. |
| By 16:40 | Save the recording; check narration, readable UI, duration and file size. |
| By 16:50 | Publish the real MP4 and final README; verify public playback. |
| By 17:00 | Submit C2 form and preserve confirmation. |
| By 17:15 | Final C1 candidate selection and matching notebook check. |
| Through 17:30 | Resolve delivery problems and verify receipts. |
| 18:00 | Official deadline. |

## Short answers for judges

**Why Tide instead of a normal role table?** The intended deployment protects authority to issue a role through signed policy and eligible approvers. A normal backend administrator can rewrite its local grants; our simulation illustrates the intended difference without claiming to prove Tide cryptography.

**Does every edit need two approvals?** No. Approval grants a capability. Later actions check that capability.

**Are these real independent stewards?** No. The role selector deliberately simulates them for Plan C. Real identity enrollment and signatures belong to a future live verification.

**Is this a Jira plugin?** No. Our course experience inspired a standalone prototype using synthetic records.

**What remains to deliver?** The actual checked video, public package and confirmed submission form until each is complete.
