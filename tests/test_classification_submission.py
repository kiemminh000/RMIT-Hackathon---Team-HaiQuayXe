"""Prevent schema and ID mistakes from consuming limited C1 submissions."""

import tempfile
import unittest
from pathlib import Path

from haiquayxe.submission import validate_classification_submission


class ClassificationSubmissionTests(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.root = Path(directory.name)
        self.sample = self.root / "sample.csv"
        self.output = self.root / "submission.csv"
        self.sample.write_text("id,label\n001,BENIGN\n002,BENIGN\n", encoding="utf-8")

    def check(self, content):
        self.output.write_text(content, encoding="utf-8-sig")
        return validate_classification_submission(self.sample, self.output, expected_rows=2)

    def test_predictions_may_differ_from_placeholders(self):
        self.assertEqual(self.check("id,label\n001,PROMPT_INJECTION\n002,JAILBREAK\n"), 2)

    def test_probability_and_loose_label_formats_rejected(self):
        for value in ("0.9", "benign", " BENIGN", "BENIGN ", "", "INJECTION"):
            with self.subTest(value=value), self.assertRaisesRegex(ValueError, "label must"):
                self.check(f"id,label\n001,{value}\n002,JAILBREAK\n")

    def test_wrong_schema_rejected(self):
        for header in ("id,target", "label,id", "id,label,extra"):
            with self.subTest(header=header), self.assertRaises(ValueError):
                self.check(f"{header}\n001,BENIGN\n002,JAILBREAK\n")

    def test_incomplete_or_mismatched_ids_rejected(self):
        for rows in (
            "001,BENIGN\n",
            "002,BENIGN\n001,JAILBREAK\n",
            "001,BENIGN\n001,JAILBREAK\n",
            "1,BENIGN\n2,JAILBREAK\n",
            ",BENIGN\n002,JAILBREAK\n",
        ):
            with self.subTest(rows=rows), self.assertRaises(ValueError):
                self.check("id,label\n" + rows)

    def test_actual_competition_row_count_is_default(self):
        self.output.write_text(self.sample.read_text(), encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "expected 6000"):
            validate_classification_submission(self.sample, self.output)

    def test_duplicate_sample_ids_are_rejected(self):
        self.sample.write_text("id,label\n001,BENIGN\n001,BENIGN\n", encoding="utf-8")
        with self.assertRaisesRegex(ValueError, "Sample contains duplicate IDs"):
            self.check("id,label\n001,JAILBREAK\n002,BENIGN\n")
