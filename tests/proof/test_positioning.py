"""Contrat M3-S indépendant des sources : mesure les artefacts effectivement publiés."""
from pathlib import Path
from html.parser import HTMLParser
import json
import re
import unittest

DIST = Path(__file__).resolve().parents[2] / 'dist'


class Text(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.parts = []
        self.feed(html)

    def handle_data(self, value):
        self.parts.append(value)


class PositioningProof(unittest.TestCase):
    def test_no_catalogue_in_any_public_surface(self):
        forbidden = re.compile(r'module-|suivi.social|supervision.sociale|bulletins.dsn|synth.se.salaires|flux.compta|conseil.fiscal|memlia.desk|Office\.js|COM/\.NET|SoftwareApplication|En pilote|Sur étude|Périmètre distinct', re.I)
        pages = list(DIST.glob('*.html')) + [DIST / 'llms.txt']
        self.assertEqual(len(pages), 5)
        for page in pages:
            self.assertIsNone(forbidden.search(page.read_text()), page.name)
        for asset in (DIST / 'images').iterdir():
            self.assertIsNone(forbidden.search(asset.name), asset.name)

    def test_service_identity_and_hero(self):
        html = (DIST / 'index.html').read_text()
        text = ' '.join(Text(html).parts)
        self.assertIn('Automatisez les tâches qui ralentissent votre cabinet.', text)
        hero = re.search(r'<section[^>]*class="hero"[\s\S]*?</section>', html).group()
        self.assertNotIn('Excel', hero)
        self.assertNotIn('module', hero.lower())
        self.assertIn('Automatisation IA pour cabinets comptables | Memlia', html)
        graph = json.loads(re.search(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html).group(1))['@graph']
        service = next(n for n in graph if n['@type'] == 'Service')
        self.assertEqual(service['serviceType'], "Automatisation IA pour cabinets d'expertise comptable")
        self.assertNotIn('offers', service)
        self.assertNotIn('featureList', service)

    def test_illustrations_are_not_product_cards(self):
        html = (DIST / 'index.html').read_text()
        usages = re.search(r'<section[^>]*id="usages"[\s\S]*?</section>', html).group()
        self.assertEqual(usages.count('data-usage='), 5)
        self.assertIn('Exemples non contractuels', usages)
        self.assertNotIn('<button', usages)
        self.assertNotIn('<a ', usages)
        self.assertIn('validation humaine', (DIST / 'llms.txt').read_text())

    def test_external_actions_and_data_are_bounded(self):
        text = ' '.join(Text((DIST / 'index.html').read_text()).parts)
        for phrase in ['Aucun envoi externe sans validation humaine', 'proposition vs saisie', 'jamais nominatif', 'RGPD', 'jeux fictifs']:
            self.assertIn(phrase, text)


if __name__ == '__main__':
    unittest.main(verbosity=2)
