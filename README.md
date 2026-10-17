# RMIT Hackathon 2026 - Team HaiQuayXe

Shared workspace for our four-person team. Start here; keep the working version easy for everyone to run.

**Status:** repository setup only. No competition dataset, trained model, or finished challenge solution is included yet. The 2026 task and submission requirements must be confirmed when released. The 2025 challenge is practice/reference material only.

## Start on Windows

Python 3.11 is the tested local version. Open a terminal inside this repository, then run:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe scripts/check_setup.py
```

Using the environment's Python directly avoids PowerShell activation/permission problems. In VS Code, select `.venv` as the Python interpreter.

On macOS/Linux, use `python3 -m venv .venv`, then `.venv/bin/python` for the remaining commands.

Teammates should clone this repository first:

```text
git clone https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe.git
cd RMIT-Hackathon---Team-HaiQuayXe
```

No API key, paid service, GPU, or Kaggle notebook is required for this repository setup. Kaggle accounts and competition/team enrollment are separate from GitHub access. A challenge that requires Kaggle notebooks or a GPU will need additional setup when its requirements are known.

## Where things go

| Location | Purpose |
| --- | --- |
| `data/raw/` | Downloaded competition files; kept off Git |
| `src/` | Shared Python solution code |
| `notebooks/` | Kaggle notebooks and experiments |
| `apps/` | Application source, if the 2026 challenge requires one |
| `outputs/` | Generated submissions, reports, and models; kept off Git |
| `scripts/` | Setup and submission checks |
| `tests/` | Checks for code that protects submission correctness |
| `docs/2025-reference.md` | Last year's task summary and conflicting instructions |
| `docs/2026-brief.md` | Checklist to complete when the actual task arrives |

After joining the relevant Kaggle competition, download its files through your own account. For the 2025 practice task, place `train.csv`, `test.csv`, and `sample_submission.csv` in `data/raw/`. See [data notes](data/README.md). These files have not been downloaded or supplied yet.

## Check a probability submission

For the **2025-style binary probability task**, once the actual sample confirms the column names:

```powershell
.\.venv\Scripts\python.exe scripts/validate_submission.py --sample data/raw/sample_submission.csv --submission outputs/submission.csv --id-column id --probability-column target
```

This checks the exact header/order, row count, unique IDs in sample order, and finite probabilities from 0 to 1. If the real sample uses `Id`, pass `--id-column Id`. Do not rename columns based on a copied description. The validator does not measure model quality or submit anything to Kaggle. It is not a validator for arbitrary 2026 tasks or string-label submissions.

## Work together

1. Pick an owner for data/evaluation, model code, application work, and integration/submission. Adjust once the task is known.
2. Pull the current `main`, then create a short branch for your work:

   ```text
   git switch main
   git pull --ff-only
   git switch -c feature/describe-your-change
   ```

3. Commit only your intended files, push your branch, and open a pull request. Have another teammate check it before merging. Avoid editing the same notebook simultaneously.
4. Keep a runnable version on `main`. Make an early valid submission, then improve it using local validation.
5. Track each experiment's change, validation score, runtime, and commit in your notes. Keep hidden test labels out of model development.

Before sharing code, run:

```powershell
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
git diff --check
git status --short
```

GitHub Actions also runs the setup check and tests on pushes and pull requests. It uses no competition data or secrets. The workflow follows [GitHub's Python CI documentation](https://docs.github.com/en/actions/tutorials/build-and-test-code/python).

## Keep out of Git

The ignore rules exclude local datasets/CSV files, model weights, generated output, virtual environments, and common credential files. Clear sensitive dataset examples and outputs before committing notebooks. Check staged files before pushing; ignore rules do not remove files already tracked by Git.

Dataset licensing and sharing permissions are separate from our code. No repository license has been chosen yet. Confirm the 2026 sharing rules before publishing competition materials.
