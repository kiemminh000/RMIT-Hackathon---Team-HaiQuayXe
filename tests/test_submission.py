"""Catch submission mistakes that can waste a limited competition attempt."""

import csv
import tempfile
import unittest
from pathlib import Path

from scripts.validate_submission import validate_submission


class SubmissionTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.sample = self.write("sample.csv", ["id", "target"], [("001", 0), ("002", 0)])

    def write(self, name, header, rows):
        path = self.root / name
        with path.open("w", newline="", encoding="utf-8-sig") as handle:
            writer = csv.writer(handle)
            writer.writerow(header)
            writer.writerows(rows)
        return path

    def test_valid_utf8_bom_and_probability_boundaries(self):
        candidate = self.write("out.csv", ["id", "target"], [("001", 0), ("002", 1)])
        self.assertEqual(validate_submission(self.sample, candidate), 2)

    def test_explicit_case_sensitive_sample_columns(self):
        sample = self.write("case.csv", ["Id", "target"], [("A", 0)])
        candidate = self.write("out.csv", ["Id", "target"], [("A", 0.25)])
        self.assertEqual(validate_submission(sample, candidate, id_column="Id"), 1)

    def test_wrong_or_reordered_headers(self):
        for header in (["id", "label"], ["Id", "target"], ["target", "id"]):
            with self.subTest(header=header):
                candidate = self.write("out.csv", header, [("001", 0.5), ("002", 0.5)])
                with self.assertRaisesRegex(ValueError, "Header/order"):
                    validate_submission(self.sample, candidate)

    def test_missing_or_extra_rows(self):
        for ids in (["001"], ["001", "002", "003"]):
            with self.subTest(ids=ids):
                candidate = self.write("out.csv", ["id", "target"], [(i, 0.5) for i in ids])
                with self.assertRaisesRegex(ValueError, "Expected 2 rows"):
                    validate_submission(self.sample, candidate)

    def test_shuffled_or_changed_ids(self):
        for ids in (["002", "001"], ["1", "2"], ["001", "999"]):
            with self.subTest(ids=ids):
                candidate = self.write("out.csv", ["id", "target"], [(i, 0.5) for i in ids])
                with self.assertRaisesRegex(ValueError, "IDs and their order"):
                    validate_submission(self.sample, candidate)

    def test_duplicate_and_blank_ids(self):
        for ids, message in ((["001", "001"], "duplicate IDs"), (["001", ""], "empty ID")):
            with self.subTest(ids=ids):
                candidate = self.write("out.csv", ["id", "target"], [(i, 0.5) for i in ids])
                with self.assertRaisesRegex(ValueError, message):
                    validate_submission(self.sample, candidate)

    def test_invalid_probabilities(self):
        for value in ("nan", "inf", "-inf", "", "jailbreak", "-0.01", "1.01"):
            with self.subTest(value=value):
                candidate = self.write("out.csv", ["id", "target"], [("001", value), ("002", 0.5)])
                with self.assertRaisesRegex(ValueError, "probability must"):
                    validate_submission(self.sample, candidate)

    def test_malformed_row(self):
        candidate = self.write("out.csv", ["id", "target"], [("001",), ("002", 0.5)])
        with self.assertRaisesRegex(ValueError, "malformed CSV"):
            validate_submission(self.sample, candidate)

    def test_invalid_sample(self):
        for header, rows in ((["id", "id"], [(1, 0)]), (["id", "target"], [])):
            with self.subTest(header=header, rows=rows):
                sample = self.write("invalid.csv", header, rows)
                with self.assertRaises(ValueError):
                    validate_submission(sample, self.sample)


if __name__ == "__main__":
    unittest.main()
