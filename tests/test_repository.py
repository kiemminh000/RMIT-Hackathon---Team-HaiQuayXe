"""Check common accidental publication paths and notebook outputs."""

import json
import unittest

from scripts.check_repository import inspect_file


class RepositoryTests(unittest.TestCase):
    def test_local_files_are_rejected(self):
        for name in (
            ".env",
            "apps/demo/.env.local",
            "kaggle.json",
            "data/raw/train.csv",
            "outputs/submission.csv",
            "models/best.joblib",
        ):
            with self.subTest(name=name):
                self.assertTrue(inspect_file(name))

    def test_documents_and_templates_are_allowed(self):
        for name in (
            ".env.example",
            "data/README.md",
            "data/raw/.gitkeep",
            "outputs/.gitkeep",
            "tests/fixtures/synthetic.csv",
        ):
            with self.subTest(name=name):
                self.assertEqual(inspect_file(name), [])

    def test_notebook_output_must_be_cleared(self):
        for outputs, count in (([{"text": "private example"}], None), ([], 1)):
            with self.subTest(outputs=outputs, count=count):
                content = json.dumps(
                    {"cells": [{"cell_type": "code", "outputs": outputs, "execution_count": count}]}
                ).encode()
                self.assertTrue(inspect_file("notebooks/run.ipynb", content))

    def test_clean_notebook_is_allowed(self):
        content = b'{"cells":[{"cell_type":"code","outputs":[],"execution_count":null}]}'
        self.assertEqual(inspect_file("notebooks/run.ipynb", content), [])

    def test_malformed_notebook_is_rejected(self):
        for content in (b"not JSON", b"{}", b'{"cells":42}'):
            self.assertTrue(inspect_file("notebooks/run.ipynb", content))
