# TestFlow

A testing workspace for delegating severity editing and report export when the project owner is unavailable. The competition delivery uses the [official Plan C simulation](https://tide.org/unlocked/#plan-c), with the same judging treatment as a live integration. Live Tide verification is not a prerequisite for this route.

## Run the competition demo

Use **Node.js 24** and npm. From the repository root:

```powershell
cd apps/testflow
npm ci
npm run demo
```

Open **http://127.0.0.1:3030/demo**. The command enables `TESTFLOW_DEMO_MODE=1` and starts Next on the loopback address and port. Choose **Tester**, then follow the [walkthrough](../../docs/c2-demo-runbook.md), or [watch the demo on YouTube](https://youtu.be/YUJ8YIpAtIM). The [MP4 copy](../../demo/testflow-demo.mp4) is also included. No Docker, licence, Tide account or Python installation is required for Plan C.

The banner identifies the simulation throughout. One viewer can select every identity; these are not independent people, real Tide sign-ins or cryptographic approvals. **Reset rehearsal → Reset demo data** restores the synthetic cases and clears all simulated requests, grants, sessions and activity.

## What the simulation enforces

- `test-editor` permits severity changes; `report-exporter` permits the complete CSV. Neither implies the other or administrator privileges.
- Saving a request grants nothing. Two distinct eligible simulated stewards must approve the same request. Duplicate approvals and self-approvals are rejected by this app's demo policy.
- The server checks the current session's permission on every edit/export request. Hiding a button is not the permission check.
- Opaque, expiring HTTPOnly cookies use `SameSite=Strict` and `Path=/api/demo`. The identity selector is intentionally a demo control.
- Demo state is separate, in memory, and shared by one Node process. Restarting or resetting clears it. The demo never changes the live store, Tide realm, roles or tokens.
- Every demo API returns 404 unless `TESTFLOW_DEMO_MODE` is exactly `1`. JSON bodies reject unknown fields; cross-site mutations are rejected.

See [where Tide fits](../../docs/c2-plan-c.md) for the MCP planning evidence and the difference between the chosen demo rule and live signed-policy governance.

## Verify and build

```powershell
npm run typecheck
npm test
npm run build
```

For a production demo build in PowerShell:

```powershell
$env:TESTFLOW_DEMO_MODE='1'
npm start -- --hostname 127.0.0.1 --port 3030
```

Focused tests cover zero/one/two approvals, concurrent duplicate approvals, self-approval, separate capabilities, reset, forged/expired cookies, input validation and the disabled-mode gate. Shared tests cover safe CSV formatting and the retained live role checks. These verify application behavior, not real Tide cryptography. Browser/HTTP rehearsal and the exported recording still need their own checks.

## Retained live integration

The existing `/api/workspace`, `/api/access-requests`, `/api/testcases/*` and `/api/export` endpoints retain Tide-token verification. A saved live app request is not a Tide change request. The demo cookie cannot authenticate these endpoints. Without a valid public adapter, live protected endpoints fail closed.

The live route requires a licensed TideCloak realm and independently enrolled users. The local instance's activation was blocked during the event; real sign-in and governed grants remain unverified. Plan C lets the team deliver without waiting for recovery.

Existing Windows helpers remain available under `scripts/`: `start-tidecloak.ps1`, `prepare-tide-tools.ps1`, and `initialize-tidecloak.ps1`. They retain the official `init/tcinit.sh` flow. The dedicated container is `haiquayxe-testflow-tidecloak` at `127.0.0.1:8080`; credentials, realm data and `tidecloak.json` remain ignored. Preserve the existing realm instead of reinitializing it. A live adapter must contain only public configuration, never private keys or administrator credentials.

For future live work, use the [Tide Quickstart](https://docs.tide.org/get-started/Tidecloak%20Quickstart) and current MCP canon. Configure the exact application origin `http://127.0.0.1:3030`. Verify the in-force signed policy; do not assume every live realm uses two-of-three. Governance approval requires each eligible administrator's own identity and the current approval-enclave flow. No such live approval is claimed by this demo.

## Data and delivery

Eight synthetic cases belong to `A3G9ST-DEMO`. CSV exports all 11 fields, preserves quoted multiline text and neutralises spreadsheet formulas. Export permission governs this endpoint; it cannot prevent copying fields already visible on screen. Activity is ordinary application history. There is no Jira integration, end-to-end encryption, tamper-proof log or protection against a malicious app host.

Original template: [`@tidecloak/create-nextjs`](https://github.com/tide-foundation/tidecloak-js/tree/main/packages/tidecloak-create-nextjs), version 0.14.33; SDK 0.14.40. Preserve Tide's [licence notices](https://tide.org/licenses_tcoc2-0-0-en).

The competition package contains source, the project overview and a two-minute MP4 under 100 MB inside the repository.
