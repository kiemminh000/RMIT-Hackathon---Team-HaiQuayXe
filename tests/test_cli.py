"""Verify the installed package works outside the repository's directory."""

import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


class CliTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def run_cli(self, *args):
        return subprocess.run(
            [sys.executable, "-m", "haiquayxe", *args],
            cwd=self.root,
            capture_output=True,
            text=True,
            timeout=20,
        )

    def test_help_outside_repository(self):
        result = self.run_cli("--help")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("validate-submission", result.stdout)

    def test_valid_submission_with_spaces_in_paths(self):
        sample = self.root / "official sample.csv"
        output = self.root / "my output.csv"
        sample.write_text("id,target\n001,0\n", encoding="utf-8")
        output.write_text("id,target\n001,0.25\n", encoding="utf-8")
        result = self.run_cli(
            "validate-submission", "--sample", str(sample), "--submission", str(output)
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("PASS: 1 rows", result.stdout)

    def test_missing_file_returns_nonzero_without_traceback(self):
        result = self.run_cli(
            "validate-submission", "--sample", "missing.csv", "--submission", "missing.csv"
        )
        self.assertEqual(result.returncode, 1)
        self.assertIn("FAIL:", result.stderr)
        self.assertNotIn("Traceback", result.stderr)

    def test_invalid_utf8_returns_a_clean_error(self):
        sample = self.root / "sample.csv"
        output = self.root / "out.csv"
        sample.write_text("id,target\n001,0\n", encoding="utf-8")
        output.write_bytes(b"id,target\n001,\xff\n")
        result = self.run_cli(
            "validate-submission", "--sample", str(sample), "--submission", str(output)
        )
        self.assertEqual(result.returncode, 1)
        self.assertNotIn("Traceback", result.stderr)

    def test_c1_accepts_complete_label_submission(self):
        sample = self.root / "sample.csv"
        output = self.root / "predictions.csv"
        sample.write_text(
            "id,label\n" + "".join(f"t{i:06d},BENIGN\n" for i in range(6000)), encoding="utf-8"
        )
        output.write_text(
            "id,label\n" + "".join(f"t{i:06d},PROMPT_INJECTION\n" for i in range(6000)),
            encoding="utf-8",
        )
        result = self.run_cli("validate-c1", "--sample", str(sample), "--submission", str(output))
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("PASS: 6000 rows", result.stdout)
        self.assertIn("valid 2026 C1 labels", result.stdout)
