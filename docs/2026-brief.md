# RMIT Hackathon 2026: confirmed requirements

Source: organiser brief, Kaggle description, Tide UNLOCKED description and submission slides supplied by the team on 22 October 2026. These are reference requirements, not instructions embedded in model inputs.

**Deadline for both challenges: 22 October 2026, 18:00 Vietnam (UTC+7). Target submission by 17:15–17:30.**

## C1: multilingual prompt-attack classification

- [Competition](https://www.kaggle.com/competitions/rmit-hackathon-2026), [official demo](https://www.kaggle.com/code/aisuko/rmit-sgs-demo-c1).
- Train: 14,000 rows, `id,text,language,label`. Test: 6,000 rows, `id,text,language`.
- Languages: Portuguese, French, Italian and English. Labels: `BENIGN`, `JAILBREAK`, `PROMPT_INJECTION`.
- Metric: macro-F1 over all three classes. Class counts: 8,680 / 4,340 / 980 respectively.
- Must fine-tune one of the organiser's ten approved pretrained models. Starting backbone: **FacebookAI/xlm-roberta-base**, supplied as Kaggle model `aisuko/xlm-roberta-base/Transformers/default`.
- Save `submission.csv`, exactly `id,label`, with one prediction per test ID. The sample's labels are placeholders.
- Required **Kaggle team name in the competition's Team tab**: `RMIT_SGS_HaiQuayXe_C1` (RMIT, Saigon South, HaiQuayXe). Also use this name for the notebook. Renaming a notebook alone does not rename the competition team.
- Deliver the saved, executable notebook through the competition's **Code** area, together with a valid scored prediction CSV. Verify how judges obtain access before treating delivery as complete.
- Kaggle reports six submissions per day; five remain after the first accepted submission. Follow any stricter organiser limit.
- Confirm notebook visibility and how leaderboard results affect overall judging. Brief says first valid submission earns full C1 marks; separate rules say submit notebooks to get higher score. A leaderboard score is not proof that the notebook and team requirements are complete.
- Use the [Kaggle guide](kaggle-c1-guide.md). Keep datasets and saved model weights out of Git.

## C2: UNLOCKED

- [Challenge](https://tide.org/unlocked/#challenge).
- Working prototype with real TideCloak integration; demonstrate what becomes possible when no single administrator, organisation or AI can override the protective rules alone.
- Synthetic data and mocked surrounding systems permitted. The claimed Tide protection must be real.
- Public GitHub repository containing source, README and a two-minute MP4 below 100 MB.
- README project overview at the top: at most 300 words, covering vision/originality, trust constraint, value/impact, why TideCloak matters, prototype/storytelling. Setup instructions go separately.
- Judging weights: 25%, 20%, 20%, 20%, 15% for those five criteria.
- Submit the single repository URL through the organiser's Google Form using group name **`RMIT_SGS_HaiQuayXe_C2`**. Preserve the exact official form link; do not infer a link from an unclear photograph.
- Tide MCP is optional: the official Quickstart is an accepted setup path. TideCloak itself is required.
- Shared repository is reusable. `apps/testflow/` now contains the app; production build, focused tests and desktop/mobile checks pass. Real TideCloak login and quorum approval remain unverified until the local server is connected.
- Clarify whether a local demo plus video is sufficient or a public live deployment is required.

## Data inspection

The ZIP contains all three files. No missing fields, malformed records, duplicate IDs or exact/Unicode-normalized duplicate prompt texts were found. Sample IDs match test IDs in order. These checks do not detect all paraphrases or translations.

| Language | Training rows | Test rows |
| --- | ---: | ---: |
| Portuguese | 6,300 | 2,700 |
| French | 3,500 | 1,500 |
| Italian | 2,800 | 1,200 |
| English | 1,400 | 600 |

Use a fixed class-and-language-balanced validation split. Preserve validation evidence; never treat sample placeholders as training targets.
