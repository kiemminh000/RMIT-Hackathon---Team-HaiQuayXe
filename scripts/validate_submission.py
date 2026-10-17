"""Compatibility entry point for the original submission-check command."""

import sys

from haiquayxe.cli import main

if __name__ == "__main__":
    raise SystemExit(main(["validate-submission", *sys.argv[1:]]))
