# TestFlow

TestFlow is a small testing workspace with separate permissions for editing test severity and exporting a complete report. Teammates explain what access they need; stewards review the actual permission change in TideCloak.

## Run the app and rehearse

Use **Node.js 24** and npm. From the repository root:

```powershell
cd apps/testflow
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3030
```

Open **http://127.0.0.1:3030/**. Without a valid `tidecloak.json`, the app shows a read-only preview. You can search the synthetic cases, filter them, open their details and explain the delegation flow. Protected actions require a real Tide connection.

The [two-minute demo runbook](../../docs/c2-demo-runbook.md) has the narration, four-person roles and recording steps. Rehearse its preview sequence now. Use the live sequence only after genuine sign-in, independent approvals and permitted actions have been verified.

The app requires Node.js 20.9 or newer; Node 24 is used for the tests. Python is not needed to run TestFlow.

## Why we built it

During our Software Testing course, we wanted to update severity and export a Jira report. The Atlassian MCP connection required site-administrator authorization, so we had to ask the project owner for help. That experience prompted a broader question: how can a team delegate a specific task when the person who originally set up access is unavailable?

TestFlow explores that question with the synthetic **A3G9ST-DEMO** project. It has no Jira integration and does not suggest that Jira cannot edit severity or export reports. Our proposed workflow lets independent stewards jointly grant a narrow permission, while a single steward cannot complete a protected grant alone. The configured threshold must be verified in the real Tide realm.

The interface shows three separate facts: a request saved in TestFlow, review details available in the Tide console, and capabilities verified for the current session. It does not infer approval from a saved request or infer denial when a capability is absent. The [root project overview](../../README.md#project-overview--challenge-2) addresses the five judging criteria.

## Current verification status

Tide's licensing incident is blocking realm activation. The local server runs, but that alone does not establish a working Tide integration. Keep this distinction visible in the recording.

- Production build and TypeScript checks pass.
- Tests cover complete CSV output, formula prevention, role scoping, token expiry, public configuration filtering and the distinction between saved requests and verified access.
- Without a real adapter, protected APIs return HTTP 503 and the interface clearly says setup is required.
- **Real Tide sign-in, role grants, quorum approvals and permitted API actions are not yet verified.** Connect and test a real realm before presenting these flows as working.

## Check and build

Run these commands from `apps/testflow`:

```powershell
npm run typecheck
npm test
npm run build
npm start -- --hostname 127.0.0.1 --port 3030
```

The lockfile records installed versions. The foundation uses Next.js 16.4.2, React 19 and `@tidecloak/nextjs` 0.14.40, adapted from official `@tidecloak/create-nextjs` 0.14.33. Confirm server/SDK compatibility when the real instance is provided.

## Connect real TideCloak

### Windows local setup for this team

After the Windows restart, open Docker Desktop and wait for its **Linux engine** to run. The scripts below do not install Docker/WSL, restart Windows or change global settings. Run from `apps/testflow` in PowerShell:

```powershell
# Checks the engine only; creates no container or credentials.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-tidecloak.ps1 -CheckOnly

# Downloads a portable, checksum-verified jq 1.8.2 to ignored .testflow/tools.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/prepare-tide-tools.ps1

# Starts or safely reuses this app's own TideCloak development container.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-tidecloak.ps1

# Replace the example with the enrolling teammate's real email.
# Wait for http://127.0.0.1:8080 before this command.
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/initialize-tidecloak.ps1 -SubscriptionEmail 'your-real-email@example.com'
```

`-ExecutionPolicy Bypass` applies only to that PowerShell process. Git for Windows supplies Bash, curl, sed and mktemp; the helper avoids the WindowsApps WSL Bash shim. To check the initializer's tools without touching Docker or a realm, use `initialize-tidecloak.ps1 -CheckOnly` after preparing jq. Its portable jq wrapper uses the [documented Windows binary mode](https://jqlang.org/manual/#invoking-jq) to preserve LF output in Git Bash.

The container is named `haiquayxe-testflow-tidecloak`, with only `127.0.0.1:8080` exposed. H2 data persists in `.testflow/tidecloak-data` on this checkout's D: drive. Random bootstrap credentials are saved in ignored `.testflow/tidecloak-bootstrap.env`; the helpers neither print them nor put them on the Docker command line. Keep this folder private and preserve it across restarts. Docker's own image/disk storage is managed separately by Docker Desktop. The official development image is `tideorg/tidecloak-dev:latest`; the helper records the pulled image digest in `.testflow/tidecloak-image-digests.json` and never silently recreates an existing container to update it.

The wrapper runs the retained **official `init/tcinit.sh` unchanged**, with realm `testflow`, public client `testflow`, auth origin `http://127.0.0.1:8080` and app origin **`http://127.0.0.1:3030`**. It provisions the first administrator and exports the adapter. The official setup contacts the Tide Cybersecurity Fabric and licenses the realm using the supplied email; running locally still requires internet access.

**A person must complete the one-time Tide enrollment link printed by the initializer.** Keep the terminal open until it finishes, and keep the link private. Use the actual enrolling person's identity/recovery details. If setup fails after creating the realm, preserve its state and ask the Tide team to inspect it; this wrapper refuses existing realms instead of automatically approving their pending changes. A successful existing adapter is also protected against overwrite.

Then start/restart the app with the exact configured address:

```powershell
npm run dev -- --hostname 127.0.0.1 --port 3030
# Or, after npm run build:
npm start -- --hostname 127.0.0.1 --port 3030
```

In the real console at `http://127.0.0.1:8080/realms/testflow/tide-console/`, the enrolled administrator must verify the two app roles imported from `init/realm.json`, enroll the tester and two additional independent stewards, and complete the governed role grants described below. Each steward uses their own Tide identity; on a loopback-only setup, they can use separate browser profiles on this machine. The script does **not** fabricate additional approvers or pregrant editing/export. Validate the real quorum before filming.

### Realm checklist (local or supplied instance)

1. Obtain a running **TideCloak** instance. A plain Keycloak realm is not equivalent. Follow the [official Quickstart](https://docs.tide.org/get-started/Tidecloak%20Quickstart) or use an instance supplied by the Tide team. The retained `init/tcinit.sh` is the official interactive initializer; it mutates the specified realm. Do not run it against an existing shared realm without agreeing on that setup.
2. Create a dedicated project realm/public browser client and complete the administrator's Tide enrollment. License the realm, enable **Tide-mode** governance and verify the exported adapter contains public `jwk`, `vendorId`, and `homeOrkUrl`.
3. Set browser redirect URIs for your exact app origin, including `/auth/redirect` and `/silent-check-sso.html`, and the corresponding web origin. For local default: `http://localhost:3000`. If using `127.0.0.1:3030`, configure that exact origin instead.
4. Export the public Tide adapter to **`apps/testflow/tidecloak.json`**. The file is ignored by Git. Never place admin credentials, client secrets or private keys there. The app allowlists public values and rejects private/symmetric JWKs and credential-bearing adapters.
5. Create the `test-editor` and `report-exporter` realm roles (or client roles on this app's configured resource). Do not give them to every user as defaults. Ensure the normal Tide-required `_tide_*` setup is present as directed by the Quickstart.
6. Create one tester and three independently enrolled administrators. A steward's verified token must include the `tide-realm-admin` **client role on `realm-management`** to see the in-app request inbox. Ordinary test editing and export do not require administrator access.
7. Use the built-in Tide console for genuine governed role grants. Verify each live request's threshold, approval identities and committed state. The documented default yields two approvals for three administrators; the app deliberately never invents an approval count.
8. Restart the app after adapter changes. Sign in, grant one capability, then use **Refresh my permissions** or sign out/in to obtain the updated token.

Optional: set `TIDECLOAK_CONSOLE_URL` in `.env.local` if your console URL differs from the default realm console. This URL is not a credential.

An access request saved in TestFlow is an application request for a steward to review. It is **not** a Tide change request and grants nothing. A steward reviews the identity/capability in the inbox and proposes the actual role change in TideCloak. The app has no local approve, self-grant or role-switching endpoint.

## Verify the live flow

| Identity / request | Expected result |
|---|---|
| No token / invalid token, configured realm | HTTP 401; no protected data or mutation |
| Signed-in tester, neither capability | Can review synthetic records and request access; cannot edit or export |
| Only `test-editor` | Severity PATCH succeeds; export returns 403 |
| Only `report-exporter` | CSV download succeeds; severity PATCH returns 403 |
| Body includes `role`, `admin`, `approved`, or other extra fields | Rejected; request body cannot grant authority |
| One approval when live quorum requires two | Tide change stays pending; tester still lacks the role |
| Required independent approvals complete | Tide grants the role; refreshed tester session can perform that action |

The server uses the SDK's signature/issuer/authorised-party (`azp`) checks against the configured public keys and client, then requires a finite unexpired `exp` and checks only realm roles or roles on this configured client. It does not claim separate `aud` validation or DPoP binding; the current prototype uses Bearer tokens over the configured connection.

For fail-closed HTTP checks against a running **unconfigured** app:

```powershell
$env:TESTFLOW_UNCONFIGURED_URL='http://127.0.0.1:3030'
npm test
Remove-Item Env:TESTFLOW_UNCONFIGURED_URL
```

These tests are not evidence of live Tide enrollment or quorum enforcement.

## Data, permissions and limits

- All test cases are synthetic. There is no Atlassian API/MCP integration or attempt to bypass its site-administrator approval.
- Export includes `id`, `project`, `title`, `description`, `preconditions`, `steps`, `expected_result`, `severity`, `status`, `assignee`, and `updated_at`. Quoting preserves commas/newlines; UTF-8 BOM supports spreadsheets; formula-like cells are neutralised.
- `report-exporter` controls the official CSV endpoint, not the ability to manually copy records already visible to an authorised viewer.
- Local state is stored in ignored `.testflow/state.json`, using serialized atomic writes within one Node process. Run one server instance. This is prototype storage, not a distributed database.
- The activity history is ordinary app storage. It is not tamper-proof, and records are not end-to-end encrypted.
- The protected boundary is the API's verification of signed permissions. Do not claim protection against a malicious application operator who can rewrite the code or access plaintext storage.
- Pending app requests remain recorded after a grant; the current signed identity is the authority for effective access. A requester sees their own requests; a verified Tide steward sees the inbox.

## Provenance and delivery

Original template: [tide-foundation/tidecloak-js](https://github.com/tide-foundation/tidecloak-js/tree/main/packages/tidecloak-create-nextjs), package `@tidecloak/create-nextjs@0.14.33`. The SDK points to the [Tide Community Open Code License](https://tide.org/licenses_tcoc2-0-0-en). Preserve Tide's notices when distributing its materials. App source, local configuration safeguards and TestFlow workflow were added for Team HaiQuayXe.

For Challenge 2, include this code, the project overview and a real two-minute `.mp4` under 100 MB in the public team repository. Record the live integration only after the checklist above passes.
