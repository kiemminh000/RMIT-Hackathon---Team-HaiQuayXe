# Notebooks

Store experiments or Kaggle notebooks here. Record the source data, random seed, validation method, metric, and runtime. A notebook should run from the first cell to the last in a clean session.

For local notebooks, select the project's `.venv` interpreter after bootstrap. Import shared functions from `haiquayxe`; do not copy the implementation or add machine-specific paths to `sys.path`. A notebook editor/kernel is optional and is not installed by the base setup.

Kaggle uses a separate environment. Confirm the permitted libraries, internet access, and code-sharing rules before transferring package code or installing dependencies there. If the task requires a self-contained notebook, prepare and test that deliverable explicitly; a working local package does not automatically configure Kaggle.

Clear all code-cell outputs and execution counts before committing; repository checks enforce this on staged notebooks. Review source cells for dataset text, private information, or credentials as well. Keep keys in the execution platform's secret store rather than notebook cells.

The 2025 brief specified `<campus>_<team>_C<challenge>` names for C2/C4. This is historical reference only; check the 2026 naming rules when released.
