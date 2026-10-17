# Working together

## First time

Run `python scripts/bootstrap.py` (or `python3` on macOS/Linux), then select `.venv` in your editor. Supported Python versions are 3.11 and 3.12. The script installs the package in editable mode: changes inside `src/haiquayxe/` are immediately usable without reinstalling.

## Daily loop

```text
git switch main
git pull --ff-only
git switch -c feature/short-description
```

Agree on ownership before working on the same file or notebook. Put reusable logic in the package; use notebooks to explore and explain. Keep each change focused on one outcome.

Run these from the repository root (macOS/Linux: use `.venv/bin/python`):

```powershell
.\.venv\Scripts\python.exe -m ruff check .
.\.venv\Scripts\python.exe -m ruff format --check .
.\.venv\Scripts\python.exe -m unittest discover -s tests -v
```

To apply formatting, run `python -m ruff format .` using the environment's interpreter. Stage only intended files, then review the actual staged changes:

```text
git add path/to/changed-file
git diff --cached
git diff --cached --check
```

Run `.\.venv\Scripts\python.exe scripts/check_repository.py` after staging. It examines tracked paths and the staged notebook content. Clear notebook outputs and execution counts, then stage the clean notebook again. Review source cells manually for dataset text and credentials.

Commit, push your branch, and open a pull request:

```text
git commit -m "Describe the result of the change"
git push -u origin feature/short-description
```

Have a teammate review the change and wait for CI before merging. Pull the merged `main` before starting the next change. If the team needs an emergency direct change, run the same checks and keep another person informed.

## Dependencies

- `pyproject.toml`: supported Python and direct runtime dependency ranges.
- `requirements.txt`: tested, exact runtime dependency snapshot plus the local package.
- `requirements-dev.txt`: runtime snapshot plus the formatter/linter.
- `[build-system]`: pinned package-build backend.

Change dependencies deliberately on a branch; update both declared ranges and pins when needed. Re-run bootstrap, `python -m pip check`, and the complete checks. Review any new or changed indirect packages. Avoid broad upgrades during the competition. Do not replace the requirements file with an unreviewed `pip freeze` containing machine-specific local paths.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| `No module named haiquayxe` | Run bootstrap; use the `.venv` interpreter, not system Python. |
| Wrong Python version | Install 3.11/3.12 and run bootstrap with that interpreter. |
| Existing `.venv` is damaged or belongs to another Python | Rename it to `.venv-backup` after checking it; rerun bootstrap. Never delete your data to repair an environment. |
| Package installation cannot connect | Restore internet access and rerun bootstrap; do not change package pins randomly. |
| CSV validation fails | Compare the error with the actual sample file; preserve exact IDs/header case. |
| GitHub push denied | Confirm repository collaborator access and sign in through your normal Git/GitHub client. |
| Git merge conflict | Coordinate with the file owner, resolve the change, then rerun relevant checks. |

## Ready to merge

The change runs from a clean session, has meaningful tests where needed, contains no private data or credentials, and explains its impact on the competition metric or deliverable. Formatting changes alone do not need new tests.
