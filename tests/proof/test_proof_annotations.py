"""Oracle des neuf sources : annotations interdites et contenu central conservé."""
import json
import re
import unittest
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / 'docs/design/m4-r1-functional-proofs/index.html'
INVENTORY = ROOT / 'docs/design/m4-r1-functional-proofs/content-contract.json'


class FrameText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.frames = {}
        self.current = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'section':
            self.current = attrs['id']
            self.frames[self.current] = []

    def handle_endtag(self, tag):
        if tag == 'section':
            self.current = None

    def handle_data(self, data):
        if self.current:
            self.frames[self.current].extend(data.split())


class ProofAnnotations(unittest.TestCase):
    def setUp(self):
        self.source = SOURCE.read_text()
        self.contract = json.loads(INVENTORY.read_text())
        self.parser = FrameText()
        self.parser.feed(self.source)

    def test_nine_frames_keep_exact_functional_content(self):
        self.assertEqual(list(self.parser.frames), [x['id'] for x in self.contract])
        for frame in self.contract:
            with self.subTest(frame=frame['id']):
                self.assertEqual(' '.join(self.parser.frames[frame['id']]), frame['centralText'])

    def test_peripheral_annotations_are_absent_not_hidden(self):
        self.assertNotRegex(self.source, r'frame-head|frame-no|proof-caption|class="kicker"')
        text = ' '.join(' '.join(x) for x in self.parser.frames.values())
        self.assertNotRegex(text, r'0[1-9]\s*/\s*09|Livrable visible\s*:|Brouillon partagé')
        for frame in self.contract:
            for forbidden in frame['removed']:
                with self.subTest(annotation=forbidden):
                    self.assertNotIn(forbidden, text)

    def test_styles_have_no_external_worktree_or_generated_annotations(self):
        css = SOURCE.with_name('styles.css').read_text()
        self.assertNotIn('.worktrees/', css)
        self.assertNotRegex(css, r'content\s*:\s*[\'"][^\'"]*(?:/\s*09|Livrable visible|Brouillon partagé)')
        for name in re.findall(r"url\(['\"]?([^)'\"]+)", css):
            self.assertTrue((SOURCE.parent / name).is_file(), name)

    def test_contract_preserves_guardrails_and_internal_versions(self):
        text = ' '.join(x['centralText'] for x in self.contract)
        for required in ['jeu fictif', 'v.04', 'Session 01', 'Version 1.0',
                         'Aucun export n’est produit avant décision.',
                         'Aucune compatibilité universelle promise',
                         'Pas de surveillance individuelle des salariés.',
                         'Une proposition ne devient résultat qu’après décision.']:
            self.assertIn(required, text)
