# TestFlow — project overview draft

**Internal draft. Do not present planned protections as working until the real Tide demonstration passes.** The overview below is under the challenge's 300-word limit. Move the final, verified version to the repository README before C2 submission; keep setup instructions separate.

---

**TestFlow helps software-testing teams share narrowly scoped permissions without depending on one all-powerful project owner.**

**Vision & originality.** Student and small-team testing work should continue when the original owner is unavailable. TestFlow separates everyday testing work from the authority to grant access, combining a focused testing workspace with shared governance.

**Trust constraint insight.** Our team encountered this problem while trying to update test severity and export a course-project report. Delegation became an owner-dependent bottleneck. Granting everyone broad administrator access would create a different problem: any one account could control sensitive permissions.

**Value & impact.** A tester can receive permission to edit severity without receiving permission to export a complete report. Team stewards collectively authorise sensitive grants, helping teams continue their work while limiting the power delegated to each person.

**Why TideCloak matters.** TideCloak authenticates users and governs protected permission grants. The application checks signed permissions at its API. The intended demonstration shows a grant remaining pending after one steward approves, then becoming effective only after the real Tide quorum is satisfied.

**Prototype & storytelling.** In a synthetic Software Testing project, a tester requests export access, sees a denied operation, and later exports a CSV after the required approvals and an identity refresh. The testing data is simulated; the final demonstration must use real Tide authentication and governance. The prototype does not claim to encrypt project data against the application host.

---

Before publication: replace "intended demonstration" with a factual description only after the live test; state the verified quorum and preserve an accurate limitation statement. Do not imply integration with the original Jira site.
