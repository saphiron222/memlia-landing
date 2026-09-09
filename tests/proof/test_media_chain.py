"""Recalcul indépendant : copie approuvée → public → dist ; VTT → transcription HTML."""
import hashlib
import json
import re
import unittest
from html import unescape
from pathlib import Path
from test_build import DIST
from test_positioning import Text

ROOT = DIST.parent
MANIFEST = ROOT / 'docs/qa/m4-r3/media-manifest.json'


class MediaChainProof(unittest.TestCase):
    def test_all_media_match_sealed_manifest(self):
        entries = json.loads(MANIFEST.read_text())['entries']
        self.assertEqual(len(entries), 26)
        self.assertEqual(sum(not e.get('derivative', False) for e in entries), 13)
        for entry in entries:
            with self.subTest(target=entry['target']):
                path = ROOT / entry['target']
                self.assertEqual(path.stat().st_size, entry['bytes'])
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), entry['sha256'])
                if entry['target'].startswith('public/'):
                    built = DIST / Path(entry['target']).relative_to('public')
                    self.assertEqual(hashlib.sha256(built.read_bytes()).hexdigest(), entry['sha256'])

    def test_vtt_timing_and_transcription_are_complete(self):
        vtt = (DIST / 'media/r7/animatique.vtt').read_text()
        blocks = vtt.strip().split('\n\n')[1:]
        self.assertEqual(len(blocks), 20)
        text = unescape(' '.join(Text((DIST / 'index.html').read_text()).parts))
        previous_end = 0
        for block in blocks:
            timing, *lines = block.splitlines()
            start, end = timing.split(' --> ')
            def seconds(value):
                h, m, s = value.split(':')
                return int(h) * 3600 + int(m) * 60 + float(s)
            start, end = seconds(start), seconds(end)
            self.assertGreaterEqual(start, previous_end)
            self.assertGreater(end, start)
            self.assertLessEqual(end, 45)
            previous_end = end
            self.assertIn(' '.join(lines), text)

    def test_fictional_arithmetic_and_method_coverage(self):
        html = (DIST / 'index.html').read_text()
        text = unescape(' '.join(Text(html).parts))
        counts = re.search(r'Sur (\d+) éléments fictifs analysés, (\d+) propositions.*?et un cas reste à vérifier', text)
        if counts is None:
            self.fail('Bilan fictif introuvable dans le HTML rendu')
        total, proposed = map(int, counts.groups())
        self.assertEqual(total, proposed + 1)
        self.assertEqual(sorted(re.findall(r'data-proof="(0[4-7]-[a-z]+)"', html)), ['04-observer', '05-cadrer', '06-eprouver', '07-livrer'])
        self.assertEqual(html.count('Illustration de fonctionnement sur données fictives, pas une capture produit.'), 9)
