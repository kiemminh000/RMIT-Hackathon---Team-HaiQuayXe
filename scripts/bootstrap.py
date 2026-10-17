"""Create the environment, install pinned tools, and verify the setup."""

import os
import subprocess
import sys
import venv
from pathlib import Path


def main() -> int:
    if not (3, 11) <= sys.version_info[:2] < (3, 13):
        print("Use Python 3.11 or 3.12 to run this script.", file=sys.stderr)
        return 1
    root = Path(__file__).resolve().parents[1]
    environment = root / ".venv"
    python = environment / ("Scripts/python.exe" if os.name == "nt" else "bin/python")
    if not python.is_file():
        if environment.exists():
            print(
                ".venv exists but has no Python executable. Inspect it before replacing it.",
                file=sys.stderr,
            )
            return 1
        print("Creating .venv ...", flush=True)
        venv.EnvBuilder(with_pip=True).create(environment)
    print("Installing the project and pinned development dependencies ...", flush=True)
    commands = [
        [
            str(python),
            "-m",
            "pip",
            "install",
            "--disable-pip-version-check",
            "--only-binary=:all:",
            "--cache-dir",
            str(root / ".cache" / "pip"),
            "-r",
            "requirements-dev.txt",
        ],
        [str(python), "-m", "pip", "check"],
        [str(python), "-m", "haiquayxe", "doctor"],
    ]
    for command in commands:
        subprocess.run(command, cwd=root, check=True)
    print("Ready. Select .venv as your editor's Python interpreter.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (OSError, subprocess.CalledProcessError) as exc:
        print(f"Setup failed: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
