import importlib.util
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / 'scripts' / 'validate_glossary_evidence.py'


def load_validator():
    spec = importlib.util.spec_from_file_location('validate_glossary_evidence', SCRIPT)
    if spec is None or spec.loader is None:
        raise AssertionError(f'Impossible de charger {SCRIPT}')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class GlossaryEvidenceValidatorTest(unittest.TestCase):
    def test_validated_frontmatter_requires_approval_metadata(self):
        validator = load_validator()
        valid = '''---
statut: valide
auteur: hermes
valide_par: rubrique
valide_le: 2026-09-13
sources:
  - "kanban:t_0658decc"
tags: [marketing]
---
# Preuve
'''

        self.assertEqual(validator.validate_frontmatter(valid), [])

    def test_invalid_status_and_missing_approval_metadata_fail_closed(self):
        validator = load_validator()
        invalid = '''---
statut: a-valider
auteur: hermes
sources:
  - "kanban:t_0658decc"
tags: [marketing]
---
# Preuve
'''

        errors = validator.validate_frontmatter(invalid)

        self.assertTrue(any('statut' in error for error in errors))
        self.assertTrue(any('valide_par' in error for error in errors))
        self.assertTrue(any('valide_le' in error for error in errors))

    def test_invalid_author_and_calendar_date_fail_closed(self):
        validator = load_validator()
        invalid = '''---
statut: valide
auteur: kevin
valide_par: rubrique
valide_le: 2026-02-31
sources:
  - "kanban:t_0658decc"
tags: [marketing]
---
# Preuve
'''

        errors = validator.validate_frontmatter(invalid)

        self.assertTrue(any('auteur' in error for error in errors))
        self.assertTrue(any('valide_le' in error for error in errors))


if __name__ == '__main__':
    unittest.main(verbosity=2)
