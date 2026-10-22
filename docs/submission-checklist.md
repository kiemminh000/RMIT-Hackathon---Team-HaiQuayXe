# Final submission checklist — 22 October 2026

Both challenges close at **18:00 Vietnam (UTC+7)**. Target **17:00 for the C2 form**, **17:15 for final C1 selection**, and use the time through **17:30** to resolve delivery problems and verify confirmations. Submit a complete package earlier when possible. This checklist follows the organiser's submission slide provided by the team.

## Challenge 1

- [x] Live Kaggle leaderboard verifies team **RMIT_SGS_HaiQuayXe_C1**, team ID **17174582**.
- [ ] Verify all intended teammates are registered members of that team.
- [x] Approved XLM-RoBERTa Base, Large and mmBERT Base have been genuinely fine-tuned in separate experiments; validation evidence is preserved.
- [x] First CSV accepted: submission **57509933**, public score **0.91371**. This is a baseline, not a final ranking.
- [x] Base full-data refit accepted: submission **57512689**, public score **0.94870**.
- [x] Large development model accepted: submission **57515188**, public score **0.95610**, held-out macro-F1 **0.964754**. This earlier accepted result remains preserved.
- [x] mmBERT development model accepted: submission **57518032**, public score **0.96654**, fixed-holdout macro-F1 **0.969861755**; rank **99** observed at **16:03:51 Vietnam**. Four submissions used; **two remain** under the six-attempt limit. Rank is provisional; recheck attempts before any new submission.
- [ ] Select the final candidate using validation and error analysis; validate exactly 6,000 `id,label` rows before submission.
- [x] Canonical public notebook **V7** and repository source match the current best accepted mmBERT development submission; approved input is `aisuko/mmbert-base/Transformers/default/1`. SHA-256: `d4b4050fc8f09b01fd6b77aeaaa3f0db633eb9d81d02e79abe49800d6bf5feb4`. Recheck if the final candidate changes.
- [x] Preserve earlier Large development evidence and its accepted submission separately. The canonical repository notebook now mirrors mmBERT V7, with outputs cleared and event-only limits disabled for replay.
- [x] Publish the correctly named main notebook with the official competition and approved mmBERT Base model attached for the [competition Code area](https://www.kaggle.com/competitions/rmit-hackathon-2026/code). Public metadata, source and anonymous access were verified; publication used Quick Save without retraining.
- [ ] Record the final accepted submission ID and select the intended final submission(s), if Kaggle provides a final-selection option.
- [x] Follow the published requirements and pursue C1 ranking; the team cannot obtain additional organiser clarification. Completion credit is not a perfect classification score.

Our public notebook: [RMIT_SGS_HaiQuayXe_C1](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1), canonical V7. The [mmBERT development run](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1-mmbert-candidate), executed V1, produced the current best accepted 0.96654. Executed version 1 of the separate [Large development notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1-xlmr-large-candidate) produced 0.95610; its model and outputs remain there. The earlier [executed Base V3 run](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1?scriptVersionId=361027521) produced 0.94870 and remains preserved. The full-data Large refit was rejected after producing zero PROMPT_INJECTION predictions; it was not submitted. The accepted development result remains preserved. Notebook naming does not prove the competition team is correctly named.

The supplied leaderboard screenshot says the public leaderboard uses approximately **30%** of the test data, with final standings based on the other **70%**. Do not tune repeatedly against public scores or treat the current rank as final.

## Challenge 2 — official Plan C

Use the [two-minute simulation runbook](c2-demo-runbook.md) and [Tide integration map](c2-plan-c.md). The [official Plan C notice](https://tide.org/unlocked/#plan-c) gives simulated and live integrations equal judging treatment. Live activation is no longer a delivery prerequisite for this route. Keep the simulation label visible; do not claim real Tide signatures.

Target a complete recording by **16:40**, a publicly checked MP4 by **16:50**, and the form confirmation by **17:00 Vietnam**.

- [x] Official Plan C route selected; Tide MCP scenario, RBAC playbook and current IGA canon retrieved for integration planning.
- [x] Isolated simulation source exists with gated APIs, selectable demo sessions, two distinct steward approvals and separate edit/export checks.
- [x] Production build and TypeScript checks pass; all **22 tests** pass with no skips. **43 actual HTTP checks** also passed against the running app.
- [x] Local root README is within 300 words and addresses all five judging prompts; final public publication remains below.
- [x] Actual browser rehearsal verified 0/1/2 approvals, permission grant, severity edit persisting after reload, and export remaining locked after edit-only access.
- [x] Current production build and running HTTP/browser behavior verified. Recheck relevant behavior if code changes before final packaging.
- [ ] A real two-minute `.mp4` under 100 MB exists inside the repository and plays correctly from beginning to end.
- [ ] Link the actual video prominently from the README after the file exists.
- [ ] Push final source, README and video; verify repository access and video playback without the team's GitHub login.
- [ ] Submit **one GitHub repository URL** through the [official Challenge 2 form](https://forms.gle/HRHYjnqB86j1LFS97) with group **RMIT_SGS_HaiQuayXe_C2**.
- [ ] Preserve the actual form confirmation and submitted repository commit.

Repository: [Team HaiQuayXe](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe). Previously published source remains available; the new Plan C package must be pushed and checked separately. Video recording, final public package and C2 form confirmation are not yet marked complete. Real Tide verification remains a separate future task, not a condition for Plan C's equal judging treatment.
