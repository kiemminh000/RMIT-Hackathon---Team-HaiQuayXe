"""Check tracked file paths and staged notebooks before they are published."""

import json
import subprocess
import sys
from pathlib import Path, PurePosixPath


def inspect_file(name: str, content: bytes | None = None) -> list[str]:
    path = PurePosixPath(name)
    filename = path.name.lower()
    issues = []
    if (
        (filename.startswith(".env") and filename != ".env.example")
        or filename in {"kaggle.json", "credentials.json"}
        or path.suffix.lower() in {".pem", ".key"}
    ):
        issues.append(f"{name}: credential/config file must not be tracked")
    if path.parts[0] in {"data", "outputs"} and filename != ".gitkeep" and name != "data/README.md":
        issues.append(f"{name}: local data/generated output must not be tracked")
    if path.suffix.lower() in {
        ".pkl",
        ".pickle",
        ".joblib",
        ".pt",
        ".pth",
        ".onnx",
        ".safetensors",
    }:
        issues.append(f"{name}: generated model/binary artifact must not be tracked")
    if path.suffix.lower() == ".ipynb" and content is not None:
        try:
            notebook = json.loads(content)
            cells = notebook["cells"]
            if not isinstance(cells, list):
                raise ValueError("cells must be a list")
            for index, cell in enumerate(cells, start=1):
                if cell.get("cell_type") == "code" and (
                    cell.get("outputs") or cell.get("execution_count") is not None
                ):
                    issues.append(f"{name}: clear outputs/execution count in cell {index}")
        except (ValueError, KeyError, TypeError, AttributeError):
            issues.append(f"{name}: notebook must be valid JSON with a cells list")
    return issues


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    result = subprocess.run(["git", "ls-files", "-z"], cwd=root, capture_output=True, check=True)
    names = result.stdout.decode("utf-8").split("\0")
    issues = []
    for name in filter(None, names):
        content = None
        if name.lower().endswith(".ipynb"):
            content = subprocess.run(
                ["git", "show", f":{name}"], cwd=root, capture_output=True, check=True
            ).stdout
        issues.extend(inspect_file(name, content))
    if issues:
        print("Repository checks failed:\n" + "\n".join(issues), file=sys.stderr)
        return 1
    print("OK: tracked data/credential paths and staged notebook outputs checked.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
