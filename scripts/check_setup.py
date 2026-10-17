"""Compatibility entry point. Prefer python -m haiquayxe doctor."""

from haiquayxe.cli import main

if __name__ == "__main__":
    raise SystemExit(main(["doctor"]))
