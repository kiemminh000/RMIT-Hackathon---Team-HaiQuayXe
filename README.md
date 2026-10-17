# RMIT Hackathon 2026 - Team HaiQuayXe

[![Project checks](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe/actions/workflows/checks.yml/badge.svg)](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe/actions/workflows/checks.yml)

Our shared workspace for building, evaluating, and delivering competition solutions.

**Readiness:** the engineering foundation is ready to use. The official 2026 task, actual data, scoring rules, and solution are still pending. [2025 materials](docs/2025-reference.md) are historical practice references.

## Start here

Install **Git** and **Python 3.11 or 3.12**. Clone the repository, enter its folder, and run one setup command:

```powershell
git clone https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe.git
cd RMIT-Hackathon---Team-HaiQuayXe
python scripts/bootstrap.py
```

On macOS/Linux, use `python3 scripts/bootstrap.py`. Setup creates `.venv`, installs the project and pinned dependencies, and checks that the CPU tools work. Re-running it updates the same environment without deleting data. Select `.venv` as your editor's Python interpreter. No activation or PowerShell execution-policy change is needed.

**Already set up?** After pulling dependency changes, run the setup command again. See [CONTRIBUTING.md](CONTRIBUTING.md) for daily commands and troubleshooting.

## Structure

```text
src/haiquayxe/          Shared, importable Python code and command-line tools
  cli.py               Argument handling and user-facing errors
  environment.py       Local dependency/CPU checks
  submission.py        Strict probability CSV validation
scripts/               Setup and repository maintenance commands
notebooks/             Exploratory and Kaggle notebooks
apps/                  Application source if a challenge requires it
data/raw/              Original competition downloads (local, ignored)
outputs/               Generated predictions, models, reports (local, ignored)
tests/                 Unit, CLI, and repository-check regression tests
docs/                  Architecture, challenge brief, and competition runbook
.github/               Cross-platform CI and pull request template
pyproject.toml         Package metadata, dependency ranges, lint configuration
requirements*.txt      Pinned runtime and development dependencies
```

Keep reusable logic in `src/haiquayxe/`; notebooks and commands call it. Put an application under `apps/<name>/` only after choosing a task. Never change the original downloaded data. Read the [architecture and extension guide](docs/architecture.md) before adding a new component.

## Commands on Windows

```powershell
# Verify the current environment
.\.venv\Scripts\python.exe -m haiquayxe doctor

# Run tests
.\.venv\Scripts\python.exe -m unittest discover -s tests -v

# Check code style and formatting
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m ruff format --check .

# Check tracked paths and staged notebook outputs
.\.venv\Scripts\python.exe scripts/check_repository.py
```

On macOS/Linux, replace `.\.venv\Scripts\python.exe` with `.venv/bin/python`. If the environment is activated, `hq` is the short form of `python -m haiquayxe`. The original `scripts/check_setup.py` and `scripts/validate_submission.py` commands remain available after setup.

## Check a submission

The current validator supports a **two-column binary probability CSV**, such as the 2025 practice task. Confirm the real sample's exact header spelling first:

```powershell
.\.venv\Scripts\python.exe -m haiquayxe validate-submission --sample data/raw/sample_submission.csv --submission outputs/submission.csv --id-column id --probability-column target
```

It checks CSV syntax, column names/order, row counts, unique IDs in sample order, and finite decimal probabilities in `[0, 1]`. It preserves leading zeroes in IDs. Use `--id-column Id` if the real sample has uppercase `Id`.

A format pass does not establish model quality or positive-class correctness. It does not upload to Kaggle. Different 2026 output types will need their own validator.

## Team workflow

- One owner integrates and submits; a second teammate can repeat the entire run.
- Use short feature branches and pull requests. Keep `main` runnable; see [contribution steps](CONTRIBUTING.md).
- CI runs lint, formatting, tests, dependency checks, repository checks, and meaningful commit-diff whitespace checks on **Windows/Linux and Python 3.11/3.12**.
- Fill in the [2026 brief](docs/2026-brief.md) when the tasks arrive, then follow the [competition runbook](docs/competition-runbook.md).
- Record experiments using the [experiment template](docs/experiment-template.md). Preserve the best working commit while trying improvements.

No GPU, paid API, or Kaggle notebook is required for this setup. Competition/team enrollment and any challenge-specific runtime setup remain separate.

## Data and access

Download data through your own authorized Kaggle account and place it in `data/raw/`; see [data notes](data/README.md). No competition CSVs are currently included. Common credentials, local data, model files, and outputs are ignored, with CI checks for common accidental tracked files and notebook outputs. Review code and notebook source for sensitive content too; these checks are not a general secret scanner.

Teammates need GitHub collaborator access to push. Repository branch protection is an owner-managed setting; CI alone does not enforce review or prevent direct pushes. Dataset terms are separate from code licensing, and no repository license has been chosen. Confirm actual 2026 sharing rules before publishing competition materials.
