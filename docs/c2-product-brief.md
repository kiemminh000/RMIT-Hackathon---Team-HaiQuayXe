# TestFlow — Challenge 2 product brief

Delivery route: the [official Plan C simulation](https://tide.org/unlocked/#plan-c). The app demonstrates its workflow with simulated identity, governance and roles; live verification is no longer required for equal judging under this route. A recording and confirmed submission are still required.

## Problem

During our Software Testing course, teammates needed to update severity and export project A3G9ST with all fields. They depended on an owner who could not resolve the access request. The supplied screenshot shows an Atlassian MCP connection awaiting site-admin authorisation; it does not prove that Jira itself lacks editing or export capabilities.

TestFlow asks how a team can delegate a narrow task when the original owner is unavailable, while sharing the authority to grant access.

## Product

A standalone workspace presents eight synthetic cases in **A3G9ST-DEMO**. A tester requests `test-editor` or `report-exporter` with a reason. The request grants nothing. Two distinct simulated stewards approve the same request; then the server allows only that capability. Editing does not grant export or administration. The grant covers subsequent permitted actions rather than requiring a fresh vote for every edit.

The demonstration shows the full before/request/one-approval-blocked/two-approvals-granted/after sequence. CSV contains all 11 fields, and the activity history explains the changes. Reset restores a clean rehearsal.

## Why Tide matters

Ordinary backend roles leave permission-granting authority under one operator's control. The intended Tide deployment uses signed governance policy and distinct eligible administrators to protect that authority. A tester can keep working without the original owner personally carrying out the task or one steward unilaterally issuing a protected grant.

We used Tide MCP scenario, RBAC playbook and current IGA canon to plan this architecture. The [Plan C integration map](c2-plan-c.md) records the actual retrieval and maps simulated behavior to the live system. Live policy determines its own threshold. Two-of-three and rejection of self-approval are chosen demo rules, not universal Tide requirements.

## Honest boundaries

A viewer can select every demo identity. Those selections are not independent humans or cryptographic signatures. The backend enforces the simulated workflow, but a malicious application host can alter the code or read plaintext. Records and activity are not end-to-end encrypted or tamper-proof. There is no Jira integration; export permission cannot stop copying information already visible to a viewer.

The live Tide integration remains available separately and unverified during activation problems. Plan C neither changes its authentication nor pretends that simulated grants are real Tide grants.

## Deliverables

- Public source repository and a five-prompt README overview within 300 words.
- Working Plan C demonstration using the [exact recording script](c2-demo-runbook.md).
- Actual two-minute MP4 under 100 MB inside the repository.
- Repository URL submitted as **RMIT_SGS_HaiQuayXe_C2** through the organiser's form.

Target recording **16:40**, public video **16:50**, form confirmation **17:00**, and delivery checks through **17:30 Vietnam**, 22 October 2026. Official deadline: **18:00**. Do not mark video or form complete before checking the actual artifact and confirmation.
