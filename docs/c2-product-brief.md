# TestFlow — Challenge 2 product brief

Status: application implemented; production build and focused tests pass. The local TideCloak runtime is verified. Remote wallet activation, human enrolment and the live governance demonstration remain incomplete.

## Problem grounded in the team's experience

In a Software Testing course, team members needed to update test-case severity and export project A3G9ST to CSV with all fields. They depended on an owner who could not resolve the permission request. The supplied screenshot specifically shows an **Atlassian MCP OAuth app requiring site-administrator authorisation**. It does not establish the user's native Jira edit/export permissions. Do not claim Jira lacks these features or that this app bypasses Atlassian's controls.

Our opportunity: let testing teams delegate specific capabilities clearly, while protecting the authority to grant those capabilities from unilateral changes.

## Product scope

TestFlow is a small software-testing workspace using synthetic records in **A3G9ST-DEMO**. It is a standalone competition prototype; connecting the original Jira site is outside the first demonstration.

- A readable list of test cases with severity, status and owner.
- Separate permissions to change severity and export a complete CSV report.
- A clear route to request the missing capability.
- Real TideCloak sign-in and server-side verification of the required permission.
- Real Tide governance for granting protected roles. Requests and UI status alone cannot grant access.
- A record of app actions, described as a prototype activity history rather than a tamper-proof audit ledger.

The test data and surrounding issue-tracking system are synthetic, as permitted in the challenge. The authentication and permission enforcement must be real before claiming a working integration.

## Authority model

The first implementation uses one project, with `test-editor` and `report-exporter` capabilities. A user with edit access does not automatically receive export access or administrative privileges.

Three independently enrolled Tide administrators are intended to govern sensitive permission grants. The documented default quorum gives two approvals for three administrators. Verify the actual change request's threshold and pending/committed state on the running server before making a two-of-three claim. Use Tide's built-in governance console for the first demonstration.

Ordinary authorised work does not ask for a new governance vote on each edit or export. Governance controls the permission grant. Existing authenticated sessions may need token refresh or re-login after a grant.

Security claim: the prototype verifies signed Tide permissions and demonstrates that one identity administrator cannot commit a protected role grant alone. This does not establish confidentiality against a malicious application host or prevent copying data after an authorised export. End-to-end encryption is not part of the initial scope.

## Two-minute demonstration plan

1. **0:00–0:20 — Real problem:** teammates had testing work to do but became dependent on one owner for permissions.
2. **0:20–0:40 — Specific need:** sign in as a tester; attempt an all-fields export; the API denies access and the interface explains the missing capability.
3. **0:40–1:10 — Shared authority:** show a real Tide role grant pending after one approval; the tester still cannot export. A second independent steward approves, with the original owner absent.
4. **1:10–1:40 — Work proceeds:** refresh the tester's identity, export the synthetic test report, and demonstrate that edit/export capabilities are separate.
5. **1:40–2:00 — Why Tide matters:** show that one steward cannot independently grant the protected capability to another account. Explain what the prototype proves and what is simulated.

Record the actual live sequence only after testing it. A frontend approval counter or role switcher is not evidence of Tide governance.

## Required delivery

- Source and setup instructions in a public GitHub repository.
- Project overview at the top of the README, no more than 300 words, addressing all five judging prompts.
- Two-minute MP4 under 100 MB inside the repository.
- Repository link through the organiser's submission form before **18:00 Vietnam, 22 October 2026**. Target **17:15–17:30**.

## Current external dependency

A running **TideCloak** instance and human administrator enrolment are required. Docker Desktop 4.96.2 is running under `D:\Applications\DockerDesktop`, with its WSL data verified under `D:\DockerData`. The persistent TideCloak container is bound to `127.0.0.1:8080`; TestFlow runs at `127.0.0.1:3030`. The initial realm exists and the licence-active check succeeds, but Tide's external wallet finalization has returned errors. Real sign-in and quorum approval remain unverified until that activation completes. No simulated approval is substituted for real governance.

## References

- [Challenge brief](https://tide.org/unlocked/#challenge), supplied by the team.
- [Tide QEA setup](https://docs.tide.org/Admin/SetupIGA).
- [Atlassian explanation of the supplied authorisation error](https://support.atlassian.com/atlassian-cloud/kb/your-site-admin-must-authorize-this-app-error-in-atlassian-cloud-apps/).
- Team's account of the Software Testing course and screenshot, provided on 22 October 2026.
