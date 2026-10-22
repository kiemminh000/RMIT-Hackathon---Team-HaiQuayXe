# Notebooks

For 2026 C1, [RMIT_SGS_HaiQuayXe_C1.ipynb](RMIT_SGS_HaiQuayXe_C1.ipynb) contains the exact source of our successfully executed V3 full-data refit, with outputs and execution counts cleared. It uses the approved XLM-RoBERTa Base with a three-class head, all 14,000 training rows, 512-token inputs, three epochs and one T4 GPU. Follow the [step-by-step guide](../docs/kaggle-c1-guide.md) to reproduce it; the local CPU environment does not include PyTorch or Transformers.

The [executed V3 notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1?scriptVersionId=361027521) and its exact-source [public notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1) are accessible without signing in. V4 is a public Quick Save of V3's source, not another training experiment. V3 was executed privately before publication; the preserved source describes that original execution.

Submission **57512689** was accepted with **0.94870 public macro-F1** on 22 October 2026. The earlier V2 development model scored **0.942501 validation macro-F1** on 2,800 held-out rows. **V3 has no held-out validation score**, because it trained on all 14,000 labelled rows. The final private leaderboard remains unknown; public and validation scores are different measurements.

Store experiments or Kaggle notebooks here. Record the source data, random seed, validation method, metric, and runtime. A notebook should run from the first cell to the last in a clean session.

For local notebooks, select the project's `.venv` interpreter after bootstrap. Import shared functions from `haiquayxe`; do not copy the implementation or add machine-specific paths to `sys.path`. A notebook editor/kernel is optional and is not installed by the base setup.

Kaggle uses a separate environment. Confirm the permitted libraries, internet access, and code-sharing rules before transferring package code or installing dependencies there. If the task requires a self-contained notebook, prepare and test that deliverable explicitly; a working local package does not automatically configure Kaggle.

Clear all code-cell outputs and execution counts before committing; repository checks enforce this on staged notebooks. Review source cells for dataset text, private information, or credentials as well. Keep keys in the execution platform's secret store rather than notebook cells.

The 2026 notebook naming rule is `<university>_<campus>_<team>_C1`, for example `RMIT_SGS_HaiQuayXe_C1`. See the [2026 brief](../docs/2026-brief.md).
