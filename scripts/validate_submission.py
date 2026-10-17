"""Validate a two-column binary probability CSV against its official sample."""

import argparse
import csv
import math
from pathlib import Path


def read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        header = reader.fieldnames
        if not header or len(set(header)) != len(header):
            raise ValueError(f"{path.name}: missing or duplicate column headers")
        rows = list(reader)
    if not rows:
        raise ValueError(f"{path.name}: CSV has no data rows")
    for line, row in enumerate(rows, start=2):
        if None in row or any(value is None for value in row.values()):
            raise ValueError(f"{path.name}: malformed CSV record {line}")
    return header, rows


def validate_submission(
    sample: Path,
    submission: Path,
    id_column: str = "id",
    probability_column: str = "target",
) -> int:
    sample_header, sample_rows = read_csv(sample)
    header, rows = read_csv(submission)
    if id_column == probability_column:
        raise ValueError("ID and probability columns must be different")
    if len(sample_header) != 2 or set(sample_header) != {id_column, probability_column}:
        raise ValueError(
            f"Sample header is {sample_header}. Verify the task and pass its exact "
            "--id-column and --probability-column names. This tool checks only "
            "two-column probability submissions."
        )
    if header != sample_header:
        raise ValueError(f"Header/order must exactly match the sample: {sample_header}")
    if len(rows) != len(sample_rows):
        raise ValueError(f"Expected {len(sample_rows)} rows; received {len(rows)}")

    expected_ids = [row[id_column] for row in sample_rows]
    actual_ids = [row[id_column] for row in rows]
    for name, ids in (("Sample", expected_ids), ("Submission", actual_ids)):
        if any(not value.strip() for value in ids):
            raise ValueError(f"{name} contains an empty ID")
        if len(set(ids)) != len(ids):
            raise ValueError(f"{name} contains duplicate IDs")
    if actual_ids != expected_ids:
        raise ValueError("IDs and their order must exactly match the sample")

    for line, row in enumerate(rows, start=2):
        try:
            probability = float(row[probability_column])
        except ValueError as exc:
            raise ValueError(f"Record {line}: probability must be a number") from exc
        if not math.isfinite(probability) or not 0 <= probability <= 1:
            raise ValueError(f"Record {line}: probability must be finite and between 0 and 1")
    return len(rows)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sample", type=Path, required=True)
    parser.add_argument("--submission", type=Path, required=True)
    parser.add_argument("--id-column", default="id")
    parser.add_argument("--probability-column", default="target")
    args = parser.parse_args()
    try:
        count = validate_submission(
            args.sample, args.submission, args.id_column, args.probability_column
        )
    except (OSError, ValueError, csv.Error) as exc:
        parser.exit(1, f"FAIL: {exc}\n")
    print(f"PASS: {count} rows; matching headers/IDs; finite probabilities in [0, 1].")
    print("Format check only. Confirm positive-class meaning and official rules separately.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
