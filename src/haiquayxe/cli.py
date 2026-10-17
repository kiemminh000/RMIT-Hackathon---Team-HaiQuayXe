"""Command-line interface; file validation stays independently importable."""

import argparse
from importlib.metadata import version
from pathlib import Path

from haiquayxe.submission import validate_submission


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="hq", description="Team HaiQuayXe project tools")
    parser.add_argument("--version", action="version", version=version("haiquayxe-hackathon"))
    commands = parser.add_subparsers(dest="command", required=True)
    commands.add_parser("doctor", help="Check Python and the local CPU dependencies")
    validate = commands.add_parser(
        "validate-submission", help="Check a two-column probability CSV against its sample"
    )
    validate.add_argument("--sample", type=Path, required=True)
    validate.add_argument("--submission", type=Path, required=True)
    validate.add_argument("--id-column", default="id")
    validate.add_argument("--probability-column", default="target")
    args = parser.parse_args(argv)
    if args.command == "doctor":
        from haiquayxe.environment import check_environment

        return check_environment()
    try:
        count = validate_submission(
            args.sample, args.submission, args.id_column, args.probability_column
        )
    except (OSError, ValueError) as exc:
        parser.exit(1, f"FAIL: {exc}\n")
    print(f"PASS: {count} rows; matching headers/IDs; finite probabilities in [0, 1].")
    print("Format check only. Confirm positive-class meaning and official rules separately.")
    return 0
