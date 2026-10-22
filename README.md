# TestFlow — RMIT Hackathon 2026 · Team HaiQuayXe

TestFlow is a testing workspace where teammates request permission to edit test severity or export a report, and stewards review permission changes through TideCloak.

## Project overview — Challenge 2

**Vision & originality.** TestFlow separates the work a tester needs to do from the authority to grant access. Editing test severity and exporting a complete report are separate permissions, with shared stewardship intended to keep work moving when the original owner is unavailable.

**Trust constraint insight.** During our Software Testing course, we wanted to update test severity and export a Jira report. Our Atlassian MCP connection required site-administrator authorization, so we needed help from the project owner. This access problem inspired TestFlow; it is not a claim that Jira lacks these features.

**Value & impact.** In our demo scenario, a tester needs to change a case's severity while the owner is offline. Independent stewards would jointly grant editing permission without also granting report export or administration. The tester could then finish the task without asking someone else to perform it.

**Why TideCloak matters.** The API checks Tide-signed permissions. The intended live demonstration uses Tide governance: one approval is insufficient, and a grant takes effect only after the configured threshold is met. Saving a request in TestFlow grants no access.

**Prototype & storytelling.** The app includes synthetic test cases, permission checks, CSV exports, requests and activity history. It distinguishes saved requests from Tide review and current signed permissions. Build and local checks pass; real sign-in and quorum approval remain unverified during Tide's licensing incident. TestFlow has no Jira connection, end-to-end encryption or protection against its own host accessing plaintext.

## Run TestFlow and rehearse the demo

Use **Node.js 24** and npm. From the repository root:

```powershell
cd apps/testflow
npm ci
npm run dev -- --hostname 127.0.0.1 --port 3030
```

Open **http://127.0.0.1:3030/**. Without a valid Tide adapter, the app opens a read-only preview with synthetic records. You can search cases, open their details and rehearse the explanation. Sign-in, editing, export and access requests require a real Tide connection.

Follow the [two-minute demo runbook](docs/c2-demo-runbook.md) for the narration, team roles and recording sequence. Use its preview sequence while licensing is blocked. The [TestFlow setup guide](apps/testflow/README.md) covers the production build and Tide connection; the [rubric evidence map](docs/c2-rubric-evidence.md) explains what the demo needs to establish. Python setup is only needed for the separate Challenge 1 tools below.

## Current delivery status

[![Project checks](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe/actions/workflows/checks.yml/badge.svg)](https://github.com/kiemminh000/RMIT-Hackathon---Team-HaiQuayXe/actions/workflows/checks.yml)

**Challenge 1:** the best accepted submission has a **0.95610 public leaderboard score**. It uses approved XLM-RoBERTa Large, 512-token inputs and three epochs on 11,200 training examples. Its separate 2,800-example holdout scored **0.964754 macro-F1**. A full-data Large refit and a separate mmBERT experiment are in progress. The public score covers approximately 30% of the test set; final standings use the other 70%. See the [Kaggle guide](docs/kaggle-c1-guide.md) for the workflow and the [submission checklist](docs/submission-checklist.md) for current run and submission details.

**Challenge 2:** TestFlow and the local TideCloak server run on this computer. Tide's licensing incident is blocking activation, so real sign-in and governed permission changes remain unverified. The required demo video is also unfinished. A preview recording can explain the implemented product, but does not establish that live Tide integration works.

**Submission:** follow the [submission checklist](docs/submission-checklist.md) and [2026 requirements](docs/2026-brief.md). C1 uses **RMIT_SGS_HaiQuayXe_C1** on Kaggle; C2 uses **RMIT_SGS_HaiQuayXe_C2** on the organiser's form. The C2 repository must contain source, this overview and a real two-minute video. [2025 materials](docs/2025-reference.md) are historical references.

## Set up the Challenge 1 Python tools

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
