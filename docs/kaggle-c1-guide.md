# Challenge 1: reproduce the accepted mmBERT model

Our [mmBERT development notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1-mmbert-candidate), executed version 1, produced accepted submission **57518032**, with **0.96654 public macro-F1**. Its fixed 2,800-row holdout scored **0.9698617551817764**. The [public main notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1), **version 7**, now contains its executable reproduction source and the approved `aisuko/mmbert-base/Transformers/default/1` input.

The repository notebook and public V7 match SHA-256 **`d4b4050fc8f09b01fd6b77aeaaa3f0db633eb9d81d02e79abe49800d6bf5feb4`**. Publication used Quick Save without another training run. Replay disables event-only time guards and clears outputs; the training recipe, fixed split and prediction logic are retained. Original executed weights and results remain in the separate development notebook's version 1.

At **16:03:51 Vietnam, 22 October 2026**, the accepted mmBERT result ranked **99**; four submissions were used and **two remained**. Rank is provisional. Public scoring uses approximately 30% of test rows; final standings use the other 70%. Final private score and final submission selection remain unconfirmed. The full-data Large refit was rejected for zero PROMPT_INJECTION predictions and was not submitted.

A notebook contains Python code cells and explanations. Kaggle runs it on its servers; local PyTorch installation is unnecessary.

## What the organiser demo actually does

The downloaded `rmit-sgs-demo-c1.ipynb` contains two code cells. It reads only the first 200 labelled rows, tokenizes input, loads XLM-RoBERTa with a new three-class head, and prints the architecture. It does not train, evaluate, predict or export a CSV. Its 86-second runtime is not a full training-time estimate. Missing classifier weights are expected for a new prediction head. Stored `T4 x2` output describes the organiser's run, not your current session.

## Setup in Kaggle

1. Open the [official demo](https://www.kaggle.com/code/aisuko/rmit-sgs-demo-c1) and select **Copy & Edit**. This makes your own editable copy.
2. Name it **RMIT_SGS_HaiQuayXe_C1**, adjusted only if your registered team name differs. Keep it private while developing unless organisers require otherwise.
3. In the editor, use **File → Import Notebook** (the label may be **Upload Notebook** in another UI version). Upload `notebooks/RMIT_SGS_HaiQuayXe_C1.ipynb` from this repository to replace the demo cells. If an option to create a new notebook is offered instead, attach the inputs listed below there.
4. Under notebook/session settings, choose a GPU accelerator, preferably **GPU T4 x2** if available. This notebook deliberately uses one visible GPU first, for a straightforward reproducible run. Do not assume two GPUs double training speed or memory capacity. If no GPU is available, ask onsite support immediately about approved compute.
5. Confirm both inputs remain attached after import: **RMIT HACKATHON 2026** competition and **mmBERT Base by aisuko, Transformers/default, version 1**. Use **Add Input** if missing. The notebook reads mounted competition data; do not upload the local ZIP as a public dataset.
6. Start with a fresh session and run the notebook from the top. The first cells report actual GPU availability, library versions, inputs and data checks. Stop at any error and copy its full message. Do not continue running later cells after an error.
7. When the setup checks pass, run the remaining cells. It performs a small training check, trains on 11,200 rows and evaluates on 2,800 held-out rows. The executed mmBERT training took approximately 29.3 minutes on its T4; setup, inference and output finalization take additional time, and another run may differ. Leave `ENFORCE_EVENT_GUARD=False` for later reproduction.

Expected input locations from the organiser's notebook:

```text
/kaggle/input/competitions/rmit-hackathon-2026
/kaggle/input/models/aisuko/mmbert-base/transformers/default/1
```

The notebook also checks alternative Kaggle mount paths and reports missing/ambiguous inputs. It uses attached model files rather than downloading another pretrained backbone. No API key, TideCloak or Docker is required for C1.

## Current notebook and development evidence

- Approved backbone: jhu-clsp/mmBERT-base from the organiser's attached model; new three-class classification head.
- Use 11,200 labelled rows for fitting and a fixed label/language-stratified 2,800-row holdout, with fresh initialization from the approved checkpoint. Split hashes must match the recorded development runs.
- Settings: first 512 tokens, three epochs, learning rate 3e-5, training batch 4 with four gradient-accumulation steps (effective batch 16), seed 42, FP16 after a finite-gradient probe, SDPA and gradient checkpointing on one T4. A documented memory fallback uses batch 2 with accumulation 8; the effective batch remains 16.
- Select the best epoch using held-out macro-F1. Epoch 3 won the executed mmBERT run with **0.9698617551817764** on the same fixed holdout used for the earlier comparisons.
- Predict every test row and write `/kaggle/working/submission.csv`, matching the sample IDs and exact labels `BENIGN`, `JAILBREAK`, `PROMPT_INJECTION`.
- Save the selected model, training history, split manifest, run configuration and prediction logits in Kaggle output storage. Local audits verified finite logits, the exact 6,000-row CSV, all three completed epochs and matching holdout IDs/labels; model weights were not downloaded to this computer.

The settings were chosen using earlier development runs with the same label-and-language-stratified 11,200/2,800 split:

| Run | Training setup | Held-out macro-F1 | Public score |
| --- | --- | --- | --- |
| V1 baseline | 256 tokens, two epochs, 11,200 fit rows | 0.932524 | 0.91371 |
| V2 development | 512 tokens, three epochs, 11,200 fit rows | 0.942501 | Not submitted |
| V3 full-data refit | 512 tokens, three epochs, 14,000 fit rows | **Unavailable: no holdout** | **0.94870** |
| Base-long development | 512 tokens, five-epoch schedule; epoch 4 selected; 11,200 fit rows | 0.949179 | Not submitted |
| Large development | 512 tokens, three epochs, 11,200 fit rows | **0.964754** | **0.95610** |
| Large full-data refit | 512 tokens, three epochs, 14,000 fit rows | **Unavailable: no holdout** | Rejected: no PI predictions; not submitted |
| mmBERT development | 512 tokens, three epochs, 11,200 fit rows | **0.969861755** | **0.96654** |

The earlier Large development submission **57515188** and public score **0.95610** remain preserved in its [executed notebook](https://www.kaggle.com/code/truongkiemminh/rmit-sgs-haiquayxe-c1-xlmr-large-candidate). The V2 score is evidence for its development model, not a validation score for V3. Reusing the fixed holdout across experiments makes it development evidence, not a fresh independent final evaluation. Counts and agreement between predictions cannot establish hidden-test quality. Future changes should be justified by validation and error analysis before another submission.

## Save and submit

**Required team identity:** in the competition's **Team** tab, verify **RMIT_SGS_HaiQuayXe_C1** and the actual registered team members. The notebook title is separate from this team setting. Do not create extra accounts or submit under another team to gain attempts.

1. Confirm the last prediction/export cell succeeded and `submission.csv` contains 6,000 rows plus its header.
2. Preserve the notebook version, metrics and model outputs. Kaggle **Save Version** may offer a quick save of the current session or a fresh **Save & Run All**; the latter reruns training, so budget the extra time. Confirm the saved version includes the intended output files.
3. Download `submission.csv` from the notebook's output/files area. On the competition page use **Submit Prediction** to upload that file, or use Kaggle's notebook-output submission option if offered.
4. Wait for an accepted/scored result. Record the score, settings and remaining attempts. Do not submit the original sample CSV or an untrained smoke-test result.
5. Deliver the saved executable notebook through the competition's **Code** area and verify public access. This has been completed for the accepted mmBERT development model: public main notebook V7 retains the official competition and approved `aisuko/mmbert-base/Transformers/default/1` input. The naming requirement applies to the competition team as well as our notebook convention. A scored CSV alone does not establish complete delivery.

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
