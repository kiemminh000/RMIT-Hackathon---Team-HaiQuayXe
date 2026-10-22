# Final submission checklist — 22 October 2026

Both challenges close at **18:00 Vietnam (UTC+7)**. Aim for accepted, accessible deliverables by **17:30**. This checklist follows the organiser's submission slide provided by the team.

## Challenge 1

- [x] Live Kaggle leaderboard verifies team **RMIT_SGS_HaiQuayXe_C1**, team ID **17174582**.
- [ ] Verify all intended teammates are registered members of that team.
- [x] Approved XLM-RoBERTa Base and Large have been genuinely fine-tuned in separate experiments; validation evidence is preserved.
- [x] First CSV accepted: submission **57509933**, public score **0.91371**. This is a baseline, not a final ranking.
- [x] Base full-data refit accepted: submission **57512689**, public score **0.94870**.
- [x] Large development model accepted: submission **57515188**, public score **0.95610**, held-out macro-F1 **0.964754**. Three submissions used; three remain under the event's six-attempt limit, as of 14:33 Vietnam.
- [ ] Select the final candidate using validation and error analysis; validate exactly 6,000 `id,label` rows before submission.
- [x] Preserve a complete executable notebook for the accepted Large model. Repository source mirrors the public reproduction notebook; event-only time limits are disabled and outputs cleared. Executed training settings are retained.
- [x] Publish the correctly named main notebook with the official competition and approved Large model attached for the [competition Code area](https://www.kaggle.com/competitions/rmit-hackathon-2026/code). Public metadata, source and anonymous access were verified; publication used Quick Save without retraining.
- [ ] Record the final accepted submission ID and select the intended final submission(s), if Kaggle provides a final-selection option.
- [x] Follow the published requirements and pursue C1 ranking; the team cannot obtain additional organiser clarification. Completion credit is not a perfect classification score.

Our public notebook: [RMIT_SGS_HaiQuayXe_C1](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1). Executed version 1 of the separate [Large development notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1-xlmr-large-candidate) produced 0.95610; its model and outputs remain there. The earlier [executed Base V3 run](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1?scriptVersionId=361027521) produced 0.94870 and remains preserved. A new full-data Large refit is running; no result is claimed yet. Notebook naming does not prove the competition team is correctly named.

The supplied leaderboard screenshot says the public leaderboard uses approximately **30%** of the test data, with final standings based on the other **70%**. Do not tune repeatedly against public scores or treat the current rank as final.

## Challenge 2

Use the [two-minute demo and delivery runbook](c2-demo-runbook.md) for roles, narration, proof to capture, and an explicitly labelled fallback if Tide's licensing outage continues. The fallback does not establish compliance with the live-integration requirement.

- [ ] Real TideCloak login, independent capabilities and genuine quorum-governed role grants pass the demonstration.
- [x] TestFlow source exists at `apps/testflow/`; build and focused tests pass.
- [ ] The public repository's top README has the final factual project overview, at most 300 words, covering all five judging prompts. Setup instructions follow separately.
- [ ] A real two-minute `.mp4` under 100 MB is inside the repository and plays successfully.
- [ ] Source, README and video are pushed; the repository can be opened without the team's GitHub login.
- [ ] Submit **one GitHub repository URL** through the [official Challenge 2 form](https://forms.gle/HRHYjnqB86j1LFS97) with group name **RMIT_SGS_HaiQuayXe_C2**. The link transcribed from the organiser's slide resolves to “RMIT Hackathon 2026 - Challenge 2”; access verified on competition day.
- [ ] Preserve the form confirmation and submitted repository commit.

Candidate repository: [Team HaiQuayXe](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe). Source and current README are published and anonymously accessible; Python checks on Windows/Linux and the TestFlow build/API safeguard checks pass in GitHub Actions. The live Tide demonstration and video remain incomplete. No final C2 form submission has been made.
