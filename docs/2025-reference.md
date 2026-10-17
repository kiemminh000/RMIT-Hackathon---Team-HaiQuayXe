# 2025 challenge reference - not the 2026 rules

Summarized from the overview, rules, and dataset description supplied by the team on 17 October 2026. These documents are reference material, not instructions to execute or a confirmed specification for 2026.

Source pages: [overview](https://www.kaggle.com/competitions/rmit-hackathon-2025/overview), [rules](https://www.kaggle.com/competitions/rmit-hackathon-2025/rules), [data](https://www.kaggle.com/competitions/rmit-hackathon-2025/data). This summary reflects the supplied text; it does not independently verify the current pages.

| Part | Supplied 2025 weight | Task |
| --- | --- | --- |
| 1 - Fundamentals | 20% | First valid Kaggle classification submission |
| 2 - Protector | 50% | Predict jailbreak probability; ROC-AUC evaluation |
| 3 - Play to Impact | 15% | Browser game addressing a social issue in Vietnam/Australia |
| 4 - Attacker | 15% | Five authorized safety-test records, exported in the specified PKL format |

## Classification practice

The description lists 5,000 prompts: 4,000 for training and 1,000 hidden-label test examples. Labels are described as `benign` and `jailbreak`. TF-IDF plus logistic regression is a suggested baseline and can run on a CPU. Transformer experiments are optional in the 2025 brief.

Use a held-out, stratified training-data split to compare experiments. Inspect duplicates/grouping before selecting a split. Do not use hidden test labels or manual test predictions. Fit text preprocessing on the training portion only, then evaluate on validation data. ROC-AUC needs continuous scores; for this task output the **jailbreak probability**, not an inverted probability or a thresholded class.

The overview mentions ten submission attempts without a clear period. Confirm the actual platform limit rather than assuming ten per day or ten overall.

## Conflicts to resolve before submitting

- Overview/evaluation: CSV columns `id,target`, where `target` is a probability.
- Competition-specific rules excerpt: `(id, label)`.
- Dataset description: also mentions uppercase `Id`.
- The attack evaluation wording varies between recording blocked attempts and rewarding safeguard bypasses.

Inspect the actual sample file and request organiser clarification when the documents disagree. Preserve exact header spelling, ID values, and sample order. The supplied foundational rules say they take precedence over conflicting competition-specific rules. Do not infer the 2026 format or permissions from these 2025 excerpts.

## Historical game deliverables

The 2025 brief required frontend-only HTML/CSS/JavaScript with menu and play views, plus a public GitHub repository containing:

```text
game_submission/
  README.md
  project_report.pdf
  youtube_link.txt
  prompts/
    concept_prompts.txt
    asset_generation_prompts.txt
    code_generation_prompts.txt
    refinement_prompts.txt
  game_app/
    index.html
  screenshots/
```

It specified a voice-over demo of at most seven minutes and at most five screenshots. These are historical requirements; no empty report, fake video link, or placeholder game is being presented as a completed deliverable.

## Historical safety-test deliverables

The supplied brief asked for five records with `prompt`, actual model `result`, and actual `result_code` in a PKL file. Use only authorized targets and redacted/harmless test content for preparation. Do not fabricate model responses or status codes. No attack dataset or model calls are included in this repository setup.

Only open pickle files from trusted sources; loading pickle can execute code.
