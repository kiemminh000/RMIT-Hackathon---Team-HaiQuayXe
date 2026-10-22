# TestFlow: two-minute demo walkthrough

Use the working simulation at **http://127.0.0.1:3030/demo**. [Official Plan C](https://tide.org/unlocked/#plan-c) permits this route with equal judging treatment. Keep the simulation banner visible and explain it at the start. Live Tide activation is not a prerequisite for recording or submission.

## Prepare once

1. Use Node.js 24 and run `npm ci`, then `npm run demo` from `apps/testflow`. If the app is already running, open **http://127.0.0.1:3030/demo** without starting another server.
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
| 1:42–2:00 | Click **Activity** (the clock icon in the left sidebar) to show Rehearsal activity. Press **Ctrl+Home** to return to the TestFlow title and team name. | “In the intended live system, Tide's signed policy protects who can issue these grants. We used Tide's MCP to plan that integration. This simulation shows the workflow: shared approval, one useful permission, and a team that can keep moving.” |

Suggested reason: **“I need to update test-case severity for our course report. I do not need export access.”** The dropdown's accessible label is **Demo severity for TF-003**; the visible current value is **medium** before the edit. Allow each successful response to finish before the next click.

## Separate CSV rehearsal

The main recording intentionally ends with export locked, proving separate capabilities. Verify export separately before filming; include a short extra shot only if the recording remains about two minutes.

1. As **Tester**, click **Request export access**, then **Save demo request**.
2. On the **Export all fields** request card, use **Review as → Steward A → Approve request**, then **Review as → Steward B → Approve request**. Editing approvals do not count toward this new request.
3. Click **Return to Tester**, then the enabled **Export all fields** button above the cases.
4. Open the downloaded CSV. Confirm 8 synthetic cases and all 11 fields, including multiline steps and the updated severity.
5. Reset the rehearsal before recording the main story so its initial locked state is genuine.

## What the demonstration establishes

The sequence demonstrates locked access, two distinct approvals, a persistent severity change and separate export permission. The [integration map](c2-plan-c.md) explains the intended live system. Two-of-three is our chosen demo policy; real Tide thresholds follow signed policy. Selectable demo identities do not establish real cryptographic enforcement or protection against a malicious host.

## Save and submit

1. Record **`demo/testflow-demo.mp4`**, about two minutes and **strictly under 100 MB**. A script, screenshot or external video link does not replace the required file inside the repository.
2. Watch the entire exported file. Confirm audible narration, readable states, truthful simulation labels, successful actions and no private information. Check duration and byte size. H.264 at 720p or 1080p around 15–30 MB is a practical target.
3. Add the actual video link to the root README after the file exists. Push source, README and video; check anonymous access and playback.
4. Submit the repository URL through the [official C2 form](https://forms.gle/HRHYjnqB86j1LFS97) with group **RMIT_SGS_HaiQuayXe_C2** and repository **https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe**.
5. Save the form confirmation and submitted commit. The official deadline is **22 October 2026 at 18:00 Vietnam (UTC+7)**.

## Short answers for judges

**Why Tide instead of a normal role table?** The intended deployment protects authority to issue a role through signed policy and eligible approvers. A normal backend administrator can rewrite its local grants; our simulation illustrates the intended difference without claiming to prove Tide cryptography.

**Does every edit need two approvals?** No. Approval grants a capability. Later actions check that capability.

**Are these real independent stewards?** No. The role selector deliberately simulates them for Plan C. Real identity enrollment and signatures belong to a future live verification.

**Is this a Jira plugin?** No. Our course experience inspired a standalone prototype using synthetic records.
