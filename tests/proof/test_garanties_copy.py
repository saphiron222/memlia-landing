"""CONT-08 : la page documente un engagement, pas une attestation."""
from pathlib import Path
import unittest
from test_positioning import Text

ROOT = Path(__file__).resolve().parents[2]


class GarantiesCopy(unittest.TestCase):
    def test_d1_locality_is_bounded_to_cadrage(self):
        html = (ROOT / 'dist/garanties.html').read_text()
        self.assertIn('Des essais fictifs, des flux cadrés par mission', html)
        self.assertIn('/illustrations/figurines/garanties-1200.webp', html)
        self.assertIn('entièrement fictifs', html)
        for claim in ['Vos fichiers restent chez vous', 'aucune copie entre les deux',
                      'Chez Memlia ne vivent que', 'Vos fichiers sont lus en place.']:
            self.assertNotIn(claim, html)
        source = (ROOT / 'docs/design/garanties-cadrage-proof/index.html').read_text()
        self.assertIn('Cadrage', source)
        self.assertIn('Développement', source)
        self.assertNotIn('Lecture, jamais copie', source)

    def test_attestation_boundary_and_documented_commitments(self):
        html = (ROOT / 'dist/garanties.html').read_text()
        text = ' '.join(' '.join(Text(html).parts).split())
        self.assertIn('Elle ne constitue pas une attestation de conformité', text)
        self.assertNotIn('Aucune conformité', text)
        # Charte v11 : ces engagements couvrent les quatre services, modèle privé compris.
        for phrase in ['Nous décrivons le fonctionnement et les limites du service retenu.',
                       'La recette accepte le périmètre convenu.',
                       'ne certifie ni les comptes ni le dossier d’audit',
                       'les exemples d’évaluation sont séparés de ceux de l’entraînement',
                       'le budget d’essai et les droits selon la licence de base',
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
        self.assertIn('Elle ne constitue pas une attestation de conformité', html)


if __name__ == '__main__':
    unittest.main()
