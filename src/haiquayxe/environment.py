"""Check the CPU environment without network calls or competition datasets."""

import importlib
import sys


def check_environment() -> int:
    print(f"Python {sys.version.split()[0]}: {sys.executable}")
    if not (3, 11) <= sys.version_info[:2] < (3, 13):
        print("FAIL: this project supports Python 3.11 and 3.12.")
        return 1
    failed = False
    for name in ("pandas", "sklearn"):
        try:
            module = importlib.import_module(name)
            print(f"OK: {name} {module.__version__}")
        except (ImportError, OSError) as exc:
            print(f"FAIL: cannot load {name}: {exc}")
            failed = True
    if failed:
        print("Run python scripts/bootstrap.py from the repository and retry.")
        return 1

    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import make_pipeline

    # Synthetic topics verify library compatibility, not competition performance.
    model = make_pipeline(TfidfVectorizer(), LogisticRegression(random_state=42))
    model.fit(["red apple", "green apple", "blue boat", "white boat"], [0, 0, 1, 1])
    probability = model.predict_proba(["small boat"])[0, 1]
    if not 0 <= probability <= 1:
        print("FAIL: dependency smoke check returned an invalid probability.")
        return 1
    print("OK: CPU text-vectorization/classifier smoke check")
    print("Environment ready. No competition data, GPU, or API key used.")
    return 0
