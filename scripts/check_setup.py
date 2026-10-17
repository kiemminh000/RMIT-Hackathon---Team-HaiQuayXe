"""Check the local CPU environment without downloading data or contacting APIs."""

import importlib
import sys
from pathlib import Path


def main() -> int:
    print(f"Python {sys.version.split()[0]}")
    if sys.version_info < (3, 11):
        print("Use Python 3.11 or newer. Python 3.11 is the tested project version.")
        return 1

    missing = []
    for module_name in ("pandas", "sklearn"):
        try:
            module = importlib.import_module(module_name)
            print(f"OK: {module_name} {module.__version__}")
        except ImportError as exc:
            missing.append(module_name)
            print(f"Missing or broken dependency: {module_name} ({exc})")
    if missing:
        print("Install requirements.txt using this environment's Python, then retry.")
        return 1

    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import make_pipeline

    # Synthetic topic labels only: verifies that installed libraries work together.
    # This is not a jailbreak model or a performance evaluation.
    model = make_pipeline(TfidfVectorizer(), LogisticRegression(random_state=42))
    model.fit(["red apple", "green apple", "blue boat", "white boat"], [0, 0, 1, 1])
    probability = model.predict_proba(["small boat"])[0, 1]
    if not 0 <= probability <= 1:
        print("FAIL: the dependency smoke check returned an invalid probability.")
        return 1
    print("OK: CPU text-vectorization/classifier smoke check")

    raw = Path(__file__).resolve().parents[1] / "data" / "raw"
    absent = [name for name in ("train.csv", "test.csv", "sample_submission.csv")
              if not (raw / name).is_file()]
    if absent:
        print("Optional 2025 practice data not present: " + ", ".join(absent))
    print("Setup ready. No GPU or API key is needed for these checks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
