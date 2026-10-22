# TestFlow — RMIT Hackathon 2026 · Team HaiQuayXe

TestFlow helps software-testing teams delegate specific work while sharing the authority to grant sensitive permissions.

## Project overview — Challenge 2

**Vision & originality.** Testing work should continue when the original owner is unavailable. TestFlow separates everyday severity updates and report exports from the authority to grant those capabilities.

**Trust constraint insight.** Our team became dependent on one owner while trying to update test severity and export a course-project report. Broad administrator access would concentrate power in more accounts. We propose specific capabilities governed by independent team stewards.

**Value & impact.** A tester can receive permission to edit severity without receiving permission to export a complete report. Clear requests and shared stewardship let small teams delegate work without giving every contributor administrative control.

**Why TideCloak matters.** The application integrates TideCloak's SDK to check signed permissions at its API. Sensitive role grants are intended to require real Tide governance. The demonstration must show one approval remaining insufficient until the live quorum is satisfied; the interface cannot grant access itself.

**Prototype & storytelling.** A synthetic Software Testing workspace provides test cases, guarded edits, CSV exports, access requests and an activity history. The code builds and its local checks pass. Real sign-in and quorum approval still require connection and verification. The current preview states this explicitly. It does not connect to Jira or claim to protect plaintext records from the application host.

## Current delivery status

[![Project checks](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe/actions/workflows/checks.yml/badge.svg)](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe/actions/workflows/checks.yml)

**Competition day:** start with the [Kaggle C1 guide](docs/kaggle-c1-guide.md) and [2026 requirements](docs/2026-brief.md). C1's third accepted submission scored **0.95610 on the public leaderboard**, improving on 0.94870 and 0.91371. It uses approved XLM-RoBERTa Large, 512-token inputs and three epochs on 11,200 training examples, with **0.964754 macro-F1 on 2,800 held-out examples**. A separate full-14,000-row Large refit is running; its result is not yet available. Three submission attempts remain as of 14:33 Vietnam. The public score covers approximately 30% of test examples; final standings use the other 70%. C2's [TestFlow application](apps/testflow/README.md) and local TideCloak server run on this computer. Tide's remote wallet activation is being resolved before real sign-in and governance verification. [2025 materials](docs/2025-reference.md) are historical references.

**Required delivery:** follow the [submission checklist](docs/submission-checklist.md). C1 uses Kaggle team **RMIT_SGS_HaiQuayXe_C1**; C2 uses **RMIT_SGS_HaiQuayXe_C2** on the organiser's form. The final C2 repository must contain source, this factual overview and a real two-minute video. The video and live Tide verification are not complete.

**Demo preparation:** the [two-minute recording runbook](docs/c2-demo-runbook.md) contains the narration, four-person roles and live verification sequence. Tide's licensing incident remains under investigation according to the support announcement relayed by the team. A clearly labelled preview recording is the fallback if service does not recover in time; it does not prove live Tide integration.

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
  submission.py        2026 class-label and historical probability CSV validation
scripts/               Setup and repository maintenance commands
notebooks/             Exploratory and Kaggle notebooks
apps/testflow/         C2 Next.js application, Tide integration, focused tests
data/raw/              Original competition downloads (local, ignored)
outputs/               Generated predictions, models, reports (local, ignored)
tests/                 Unit, CLI, and repository-check regression tests
docs/                  Architecture, challenge brief, and competition runbook
.github/               Cross-platform CI and pull request template
pyproject.toml         Package metadata, dependency ranges, lint configuration
requirements*.txt      Pinned runtime and development dependencies
```

Keep reusable Python logic in `src/haiquayxe/`; notebooks and commands call it. TestFlow has its own Node dependencies and setup under `apps/testflow/`. Never change the original downloaded data. Read the [architecture and extension guide](docs/architecture.md) before adding a new component.

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

For **2026 C1**, validate exactly 6,000 predictions with columns `id,label`:

```powershell
.\.venv\Scripts\python.exe -m haiquayxe validate-c1 --sample data/raw/sample_submission.csv --submission outputs/submission.csv
```

Allowed labels are `BENIGN`, `JAILBREAK`, and `PROMPT_INJECTION`. This checks exact labels, headers, row count, unique IDs and sample order. Passing validation does not establish model quality or prove fine-tuning. The Kaggle notebook also validates its output.

The older `validate-submission` command supports **binary probability CSVs** for the 2025 practice task only:

```powershell
.\.venv\Scripts\python.exe -m haiquayxe validate-submission --sample data/raw/sample_submission.csv --submission outputs/submission.csv --id-column id --probability-column target
```

It checks CSV syntax, column names/order, row counts, unique IDs in sample order, and finite decimal probabilities in `[0, 1]`. It preserves leading zeroes in IDs. Use `--id-column Id` if the real sample has uppercase `Id`.

A format pass does not establish model quality or positive-class correctness. Neither command uploads to Kaggle.

## Team workflow

- One owner integrates and submits; a second teammate can repeat the entire run.
- Use short feature branches and pull requests. Keep `main` runnable; see [contribution steps](CONTRIBUTING.md).
- CI runs lint, formatting, tests, dependency checks, repository checks, and meaningful commit-diff whitespace checks on **Windows/Linux and Python 3.11/3.12**.
- Follow the [2026 brief](docs/2026-brief.md) and [competition runbook](docs/competition-runbook.md).
- Record experiments using the [experiment template](docs/experiment-template.md). Preserve the best working commit while trying improvements.

The local tools run on CPU. **C1 model fine-tuning uses a Kaggle GPU notebook**; TideCloak is required for **C2 only**. No paid API is needed for the prepared C1 workflow. Competition/team enrollment remains separate.

## Data and access

Download data through your own authorized Kaggle account and place it in `data/raw/`; see [data notes](data/README.md). Competition CSVs are local only and excluded from Git. Common credentials, local data, model files, and outputs are ignored, with CI checks for common accidental tracked files and notebook outputs. Review code and notebook source for sensitive content too; these checks are not a general secret scanner.

Teammates need GitHub collaborator access to push. Repository branch protection is an owner-managed setting; CI alone does not enforce review or prevent direct pushes. Dataset terms are separate from code licensing, and no repository license has been chosen. Confirm actual 2026 sharing rules before publishing competition materials.
