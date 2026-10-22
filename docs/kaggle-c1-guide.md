# Challenge 1: reproduce the accepted full-data refit

Our [executed V3 notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1?scriptVersionId=361027521) completed successfully and produced accepted submission **57512689**, with **0.94870 public macro-F1**. The [current public notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1) is V4, a Quick Save of the exact V3 source; publication did not request another training run. Public access and source identity were verified. The repository notebook preserves that executed source, including its description of the originally private run, with outputs and execution counts cleared.

As of **13:14 Vietnam, 22 October 2026**, two submissions have been used and four are available. The supplied leaderboard note says approximately 30% of test rows determine the public score; the other 70% determine final standings. The final private score is unknown.

A notebook is a document containing Python code cells and explanations. Kaggle executes the code on its servers. The `.ipynb` file in this repository is a notebook; you do not need to install PyTorch locally.

## What the organiser demo actually does

The downloaded `rmit-sgs-demo-c1.ipynb` contains two code cells. It reads only the first 200 labelled rows, tokenizes input, loads XLM-RoBERTa with a new three-class head, and prints the architecture. It does not train, evaluate, predict or export a CSV. Its 86-second runtime is not a full training-time estimate. Missing classifier weights are expected for a new prediction head. Stored `T4 x2` output describes the organiser's run, not your current session.

## Setup in Kaggle

1. Open the [official demo](https://www.kaggle.com/code/aisuko/rmit-sgs-demo-c1) and select **Copy & Edit**. This makes your own editable copy.
2. Name it **RMIT_SGS_HaiQuayXe_C1**, adjusted only if your registered team name differs. Keep it private while developing unless organisers require otherwise.
3. In the editor, use **File → Import Notebook** (the label may be **Upload Notebook** in another UI version). Upload `notebooks/RMIT_SGS_HaiQuayXe_C1.ipynb` from this repository to replace the demo cells. If an option to create a new notebook is offered instead, attach the inputs listed below there.
4. Under notebook/session settings, choose a GPU accelerator, preferably **GPU T4 x2** if available. This notebook deliberately uses one visible GPU first, for a straightforward reproducible run. Do not assume two GPUs double training speed or memory capacity. If no GPU is available, ask onsite support immediately about approved compute.
5. Confirm both inputs remain attached after import: **RMIT HACKATHON 2026** competition and **XLM-RoBERTa Base by aisuko, Transformers/default, version 1**. Use **Add Input** if missing. The notebook reads mounted competition data; do not upload the local ZIP as a public dataset.
6. Start with a fresh session and run the notebook from the top. The first cells report actual GPU availability, library versions, inputs and data checks. Stop at any error and copy its full message. Do not continue running later cells after an error.
7. When the setup checks pass, run the remaining cells. It performs a small training check, then the full-data training run and inference. It does not create or evaluate a validation split. The executed V3 training took approximately 17.3 minutes on its T4; setup, inference and output finalization take additional time, and another run may differ.

Expected input locations from the organiser's notebook:

```text
/kaggle/input/competitions/rmit-hackathon-2026
/kaggle/input/models/aisuko/xlm-roberta-base/transformers/default/1
```

The notebook also checks alternative Kaggle mount paths and reports missing/ambiguous inputs. It uses attached model files rather than downloading another pretrained backbone. No API key, TideCloak or Docker is required for C1.

## Current notebook and development evidence

- Approved backbone: FacebookAI/xlm-roberta-base; new three-class classification head.
- All 14,000 labelled rows are used for fitting, with a fresh initialization from the approved base checkpoint. No held-out split is created.
- Settings: first 512 tokens, three epochs, learning rate 2e-5, training batch 4 with four gradient-accumulation steps (effective batch 16), seed 42 and FP16 on one T4.
- Train exactly three epochs and export the final model. There is no intermediate checkpoint selection and no held-out score for this refit.
- Predict every test row and write `/kaggle/working/submission.csv`, matching the sample IDs and exact labels `BENIGN`, `JAILBREAK`, `PROMPT_INJECTION`.
- Save the final model, training history, data hashes, run configuration and prediction logits in Kaggle output storage. Local audits verified finite logits, the exact 6,000-row CSV, completed epochs and matching dataset hashes; model weights were not downloaded to this computer.

The settings were chosen using earlier development runs with the same label-and-language-stratified 11,200/2,800 split:

| Run | Training setup | Held-out macro-F1 | Public score |
| --- | --- | --- | --- |
| V1 baseline | 256 tokens, two epochs, 11,200 fit rows | 0.932524 | 0.91371 |
| V2 development | 512 tokens, three epochs, 11,200 fit rows | 0.942501 | Not submitted |
| V3 full-data refit | 512 tokens, three epochs, 14,000 fit rows | **Unavailable: no holdout** | **0.94870** |

The V2 score is evidence for its development model, not a validation score for V3. Counts and agreement between predictions cannot establish hidden-test quality. Future changes should be justified by validation and error analysis before another submission.

## Save and submit

**Required team identity:** in the competition's **Team** tab, verify **RMIT_SGS_HaiQuayXe_C1** and the actual registered team members. The notebook title is separate from this team setting. Do not create extra accounts or submit under another team to gain attempts.

1. Confirm the last prediction/export cell succeeded and `submission.csv` contains 6,000 rows plus its header.
2. Preserve the notebook version, metrics and model outputs. Kaggle **Save Version** may offer a quick save of the current session or a fresh **Save & Run All**; the latter reruns training, so budget the extra time. Confirm the saved version includes the intended output files.
3. Download `submission.csv` from the notebook's output/files area. On the competition page use **Submit Prediction** to upload that file, or use Kaggle's notebook-output submission option if offered.
4. Wait for an accepted/scored result. Record the score, settings and remaining attempts. Do not submit the original sample CSV or an untrained smoke-test result.
5. Deliver the saved executable notebook through the competition's **Code** area and verify public access. This has been completed for the current V3 source: the public notebook retains the official competition and approved model inputs. The naming requirement applies to the competition team as well as our notebook convention. A scored CSV alone does not establish complete delivery.

Locally, a downloaded prediction file can be checked with:

```powershell
.\.venv\Scripts\python.exe -m haiquayxe validate-c1 --sample data/raw/sample_submission.csv --submission outputs/submission.csv
```

Six submission attempts are stated. Use local validation to choose experiments and reserve attempts for later improvements. Aim to have all required submissions accepted by 17:15–17:30 Vietnam time, before the 18:00 deadline on 22 October 2026.

## Troubleshooting

- **GPU unavailable:** verify your own notebook's accelerator setting. The demo's stored output is not evidence that your account has GPU access.
- **CUDA out of memory:** end/restart the session, reduce training/inference batch sizes, increase gradient accumulation to preserve effective batch size, and rerun from the top. Keep the model and data selection unchanged while fixing memory.
- **Model/data missing:** attach the exact organiser inputs, inspect the path diagnostic, and retry. Do not substitute an unapproved model.
- **Unexpected/missing head weights when first loading:** expected for this base model and fresh classification head; training is still required. Other errors require inspection.
- **A library import or API error:** send the complete traceback and printed package versions. Avoid blind package upgrades during the timed event.

Source references: supplied competition brief and demo, [Hugging Face classification guide](https://huggingface.co/docs/transformers/tasks/sequence_classification), [Trainer reference](https://huggingface.co/docs/transformers/main_classes/trainer), [Kaggle notebook documentation](https://www.kaggle.com/docs/notebooks).
