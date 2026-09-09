"""Contrat M4-R3 : médias livrés, non de simples marqueurs dans les sources."""
import hashlib
import re
import unittest
from pathlib import Path
from test_build import DIST, Document

PROOFS = ['01-flux', '02-repetition', '03-controle', '04-observer', '05-cadrer', '06-eprouver', '07-livrer', '08-integration', '09-garanties']


class IntegratedMediaProof(unittest.TestCase):
    def test_hero_has_accessible_r7_player(self):
        doc = Document(DIST / 'index.html')
        videos = doc.select('video')
        self.assertEqual(len(videos), 1)
        video = videos[0]
        for attr in ['controls', 'playsinline']:
            self.assertIn(attr, video)
        self.assertNotIn('autoplay', video)
        self.assertEqual(video['preload'], 'metadata')
        self.assertTrue(video['aria-label'])
        self.assertEqual(video['poster'], '/media/r7/hero-poster.webp')
        self.assertEqual(video['src'], '/media/r7/animatique-hero-45s.mp4')
        self.assertEqual(hashlib.sha256((DIST / video['src'].lstrip('/')).read_bytes()).hexdigest(), '649d2d767f086cb22c870b88ab71797fe09b6d73f228e2e3b89406b062fa2700')
        tracks = doc.select('track')
        self.assertEqual(len(tracks), 1)
        self.assertEqual(tracks[0]['kind'], 'subtitles')
        self.assertEqual(tracks[0]['srclang'], 'fr')
        vtt = (DIST / tracks[0]['src'].lstrip('/')).read_text()
        self.assertTrue(vtt.startswith('WEBVTT\n'))
        self.assertEqual(vtt.count(' --> '), 20)
        html = (DIST / 'index.html').read_text()
        self.assertIn('Lire la transcription', html)
        self.assertIn('Vos saisies restent préservées.', html)

    def test_nine_functional_proofs_replace_all_legacy_images(self):
        doc = Document(DIST / 'index.html')
        images = doc.select('img')
        proof_images = [i for i in images if i.get('src', '').startswith('/proofs/')]
        self.assertEqual(sorted(i['src'] for i in proof_images), [f'/proofs/{p}.webp' for p in PROOFS])
        for image in proof_images:
            self.assertGreater(len(image['alt']), 50)
            self.assertEqual((image['width'], image['height']), ('1600', '900'))
            self.assertTrue((DIST / image['src'].lstrip('/')).is_file())
        self.assertFalse(any(i.get('src', '').startswith('/images/img-') for i in images))
        self.assertFalse(any(re.match(r'img-(0[1-9]|1[0-9]|2[0-2])-', p.name) for p in (DIST / 'images').iterdir()))

    def test_tagline_is_preserved_exactly(self):
        self.assertIn('L’IA automatise le travail répétitif. Votre cabinet garde la décision.', (DIST / 'index.html').read_text())
