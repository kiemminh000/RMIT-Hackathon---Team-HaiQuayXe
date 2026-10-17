# Local data

Download competition data after accepting the relevant Kaggle rules yourself. Place the original files in `data/raw/` and leave them unchanged. This repository does not download data, accept rules, or use Kaggle credentials automatically.

For the 2025 practice task, the supplied description lists:

- `train.csv`: 4,000 labeled prompts; inspect the actual text and label columns.
- `test.csv`: 1,000 prompts with hidden labels.
- `sample_submission.csv`: the submission template to inspect before generating output.

The copied descriptions disagree about `id` versus `Id`, and `target` versus `label`. Verify the actual files and official clarification before choosing names or label encoding. For the probability task, the positive class is **jailbreak**; a larger prediction means more likely jailbreak.

The supplied dataset description lists CC BY-NC-SA 4.0. This is a source note, not a license applied to our repository. Preserve source attribution and check the competition's data-sharing terms before redistributing data. Local datasets are ignored by Git.

Source: [RMIT Hackathon 2025 data](https://www.kaggle.com/competitions/rmit-hackathon-2025/data), described in participant-provided reference material on 17 October 2026. No actual CSV contents have been inspected yet.
