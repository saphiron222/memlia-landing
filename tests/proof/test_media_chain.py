"""Recalcul indépendant : copie approuvée → public → dist ; chronologie VTT."""
import hashlib
import json
import re
import unittest

from pathlib import Path
from test_build import DIST


ROOT = DIST.parent
MANIFEST = ROOT / 'docs/qa/m4-r4/media-manifest.json'
# Les seules provenances admises hors du dépôt : les rendus de l'atelier vidéo.
EXTERNES = (str(Path.home() / 'dev/interne/memlia-video'),)


class MediaChainProof(unittest.TestCase):
    def test_all_media_match_sealed_manifest(self):
        entries = json.loads(MANIFEST.read_text())['entries']
        self.assertEqual(len(entries), 26)
        self.assertEqual(sum(not e.get('derivative', False) for e in entries), 13)
        verifiees = []
        for entry in entries:
            with self.subTest(target=entry['target']):
                path = ROOT / entry['target']
                # Un champ que personne ne lit pourrit en silence : le 18/09/2026, douze sources
                # de dérivés pointaient sur des fichiers qui n'ont jamais existé à cet endroit.
                # On ne contrôle que les sources DU dépôt : quatre entrées viennent de
                # ~/dev/interne/memlia-video, absent du constructeur Cloudflare — exiger leur
                # présence ferait dépendre la construction d'un autre dépôt (échec mesuré le
                # 19/09/2026 sur le déploiement 546ffe1b). Leur chemin absolu dit la provenance.
                brut = entry['source'].split('#')[0]
                if brut.startswith('/'):
                    self.assertTrue(brut.startswith(EXTERNES), f"source hors dépôt non déclarée : {brut}")
                else:
                    verifiees.append(brut)
                    self.assertTrue((ROOT / brut).exists(), f"source introuvable pour {entry['target']} : {brut}")
                self.assertEqual(path.stat().st_size, entry['bytes'])
                self.assertEqual(hashlib.sha256(path.read_bytes()).hexdigest(), entry['sha256'])
                if entry['target'].startswith('public/'):
                    built = DIST / Path(entry['target']).relative_to('public')
                    self.assertEqual(hashlib.sha256(built.read_bytes()).hexdigest(), entry['sha256'])
        # « aucune source vérifiée » serait un vert creux : au moins une doit l'avoir été.
        self.assertGreaterEqual(len(verifiees), 4, 'aucune source du dépôt contrôlée')

    def test_vtt_timing_and_captions_are_complete(self):
        vtt = (DIST / 'media/r9/explainer.vtt').read_text()
        blocks = vtt.strip().split('\n\n')[1:]
        self.assertEqual(len(blocks), 20)

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
            self.assertTrue(' '.join(lines).strip())

    def test_method_coverage_without_added_captions(self):
        html = (DIST / 'index.html').read_text()
        self.assertEqual(sorted(re.findall(r'data-proof="(0[4-7]-[a-z]+)"', html)), ['04-observer', '05-cadrer', '06-eprouver', '07-livrer'])
        self.assertNotIn('Illustration de fonctionnement sur données fictives, pas une capture produit.', html)
