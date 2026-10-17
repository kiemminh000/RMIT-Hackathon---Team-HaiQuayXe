"""File validation for a two-column binary probability submission."""

import csv
import math
import re
from pathlib import Path

_NUMBER = re.compile(r"[+-]?(?:[0-9]+(?:\.[0-9]*)?|\.[0-9]+)(?:[eE][+-]?[0-9]+)?")


def _read_csv(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open(newline="", encoding="utf-8-sig") as handle:
        reader = csv.reader(handle, strict=True)
        try:
            header = next(reader, None)
            if not header or any(not name.strip() for name in header):
                raise ValueError(f"{path.name}: missing or empty column headers")
            if len(set(header)) != len(header):
                raise ValueError(f"{path.name}: duplicate column headers")
            rows = []
            for values in reader:
                if not values:
                    continue
                if len(values) != len(header):
                    raise ValueError(
                        f"{path.name}: malformed CSV record ending at line {reader.line_num}"
                    )
                rows.append(dict(zip(header, values, strict=True)))
        except csv.Error as exc:
            raise ValueError(f"{path.name}: malformed CSV: {exc}") from exc
    if not rows:
        raise ValueError(f"{path.name}: CSV has no data rows")
    return header, rows


def validate_submission(
    sample: Path,
    submission: Path,
    id_column: str = "id",
    probability_column: str = "target",
) -> int:
    """Return the valid row count; raise on structural or probability errors.

    IDs remain strings so leading zeroes survive. This does not evaluate model
    quality, verify positive-class meaning, or contact the competition platform.
    """
    sample_header, sample_rows = _read_csv(sample)
    header, rows = _read_csv(submission)
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
    for record, row in enumerate(rows, start=1):
        value = row[probability_column].strip()
        if not _NUMBER.fullmatch(value):
            raise ValueError(f"Data record {record}: probability must be a decimal number")
        probability = float(value)
        if not math.isfinite(probability) or not 0 <= probability <= 1:
            raise ValueError(
                f"Data record {record}: probability must be finite and between 0 and 1"
            )
    return len(rows)
