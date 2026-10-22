# TestFlow: official Plan C and the Tide integration map

## Delivery decision

On 22 October 2026, the [official UNLOCKED Plan C notice](https://tide.org/unlocked/#plan-c) permits teams affected by Tide's network problems to simulate sign-in, roles and access checks while using Tide's MCP to plan the integration. Its judging statement is: **“Simulated and live integrations are judged exactly the same.”**

TestFlow follows this route at `http://127.0.0.1:3030/demo`. Live activation is not a prerequisite for equal judging under Plan C. The simulation must still explain what Tide enables; an ordinary login screen alone would not show the product's idea.

## What the product changes

The original owner is unavailable. A tester needs one capability to finish a team review. Shared stewardship can grant that capability without making the tester an administrator or giving one steward unilateral grant authority under the configured policy. Approvals govern the permission grant, not every later severity edit.

The demo chooses **two of three simulated stewards**. One person may switch between all identities to explain the workflow. The backend records distinct subjects and checks capabilities; this is application enforcement, not evidence of independent people or Tide signatures.

## Actual MCP planning evidence

The coding agent queried **https://mcp.tide.org/mcp** at **2026-10-22 08:55:09 UTC / 15:55:09 Vietnam**:

| Tool | Requested resource | How it informed TestFlow |
|---|---|---|
| `tide_scenario` | `iga-admin-governance` | Separate ordinary work from the governed authority to issue roles. |
| `tide_playbook` | `add-rbac-nextjs` | Verify identity server-side and require the exact capability for each protected operation. |
| `tide_canon` | `iga-change-requests-api` | Use current change-request identities, distinct callers and the current approval flow. |

The local retrieval is preserved in ignored `outputs/tide-plan-c-mcp-guidance.json`. This document summarizes it for reviewers; retrieving guidance is not a live integration test. Where the scenario and current canon differ, the current canon governs the planned implementation.

## Simulation versus future live integration

| Concern | Implemented Plan C behavior | Intended Tide integration |
|---|---|---|
| Identity | Select Tester or Steward A/B/C; an opaque demo cookie identifies the selection. | Tide sign-in, signed token verification and expiry checks. |
| Request | Store a reason and one requested capability; no grant occurs. | A steward reviews the app request and proposes the actual governed role change. App and Tide request IDs remain distinct. |
| Approval | Count each eligible simulated subject once; grant at two. | Each eligible administrator calls `/iga/change-requests/{id}/approve` using their own authenticated identity, completing enclave signing when requested. The current endpoint auto-commits when quorum is met. |
| Effective authority | Derive demo capabilities from completed requests and check them on the server. | Read the role from a refreshed, verified Tide session after the real change is applied. |
| Edit/export | Check `test-editor` and `report-exporter` separately. | Preserve those same application checks using real signed capabilities. |
| History | Plain synthetic application activity. | Separate application actions from actual Tide change-request and signature evidence. |

**Two important distinctions:** the live threshold comes from the in-force signed policy; it is not universally two-of-three. Current Tide canon allows an eligible filer to approve their own request. TestFlow's demo rejects self-approval as a stricter application policy, and its tester is not an eligible steward. We do not attribute that extra rule to Tide.

An ordinary backend can reproduce the demo counter, but its operator can rewrite that counter or grant roles. A correctly configured Tide deployment moves protected grant authority into signed policy and eligible approvers. The simulation illustrates this intended change; it cannot prove the cryptographic protection itself.

## Isolation and limits

`lib/demo.ts` and `/api/demo/*` use a dedicated state object, session map and serialized queue. They do not import live authentication or live storage and do not write a Tide realm. `TESTFLOW_DEMO_MODE=1` is required. Restart/reset clears all demo state. The retained live endpoints continue requiring Tide authentication.

The application stores synthetic records and readable activity. It has no Jira connection, end-to-end encryption, malicious-host protection or tamper-proof audit claim. A reviewer controlling every demo identity is deliberately able to complete the simulation.

## Reproduction and delivery

Run `npm ci` then `npm run demo` from `apps/testflow`. Follow the [two-minute runbook](c2-demo-runbook.md). Record by **16:40**, verify/publish the MP4 by **16:50**, and submit the form by **17:00 Vietnam**. The official deadline is **18:00**. Recording, video upload and form confirmation remain separate completion checks.
