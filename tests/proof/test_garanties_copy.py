"""CONT-08 : la page documente un engagement, pas une attestation."""
from pathlib import Path
import unittest
from test_positioning import Text

ROOT = Path(__file__).resolve().parents[2]


class GarantiesCopy(unittest.TestCase):
    def test_attestation_boundary_and_documented_commitments(self):
        html = (ROOT / 'dist/garanties.html').read_text()
        text = ' '.join(' '.join(Text(html).parts).split())
        self.assertIn('Aucune attestation de conformité', text)
        self.assertNotIn('Aucune conformité', text)
        for phrase in ['Nous documentons le traitement prévu et ses limites.',
                       'droits d’accès, les destinataires et les flux',
                       'maintenance, le support et les évolutions',
                       'Aucun envoi externe sans validation humaine',
                       'la signature reste au CAC']:
            self.assertIn(phrase, text)

    def test_page_and_faq_have_same_boundaries(self):
        html = (ROOT / 'dist/garanties.html').read_text()
        faq = (ROOT / 'src/data/faq.ts').read_text()
        for phrase in ['jeux fictifs', 'validation humaine', 'maintenance', 'recette']:
            self.assertIn(phrase, html)
            self.assertIn(phrase, faq)
        self.assertIn('ne constitue pas une certification de conformité', faq)
        self.assertIn('Ce document n’est pas une attestation de conformité', html)


if __name__ == '__main__':
    unittest.main()
