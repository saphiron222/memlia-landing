"""Contrat source : aucune palette ou illustration autonome par capacité.

Depuis le 07/10/2026 (Kevin : « toutes les cartes du site pareilles »), les cinq usages de
l'accueil sont des cartes du site : leur dessin vit une seule fois dans global.css, et
Usages.astro ne garde que la place de sa grille dans la section.
"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
CLASSES_CARTE = re.compile(r'\.(?:cartes?|carte-[a-z-]+|cellule|bande|uses-grid)\b')


def regles(css):
    return [(selecteur.strip(), corps) for selecteur, corps in re.findall(r'([^{}]+)\{([^{}]*)\}', css)]


class BentoHarmonisationProof(unittest.TestCase):
    def test_no_card_specific_icon_treatments(self):
        source = (ROOT / 'src/components/sections/Usages.astro').read_text()
        self.assertEqual(source.count('class="carte-icone"'), 1, 'un seul conteneur pour les cinq pictogrammes')
        self.assertNotIn('use-mark', source)
        global_css = (ROOT / 'src/styles/global.css').read_text()
        icones = [selecteur for selecteur, _ in regles(global_css) if '.carte-icone' in selecteur]
        self.assertTrue(any(re.search(r'(?:^|\s)\.carte-icone$', selecteur) for selecteur in icones), icones)
        variantes = [s for s in icones if 'data-usage' in s or re.search(r'\.carte-icone[.\[#]', s)]
        self.assertEqual(variantes, [], 'aucune variante de pastille par carte')

    def test_no_secondary_mixed_surfaces_or_raw_colors(self):
        source = (ROOT / 'src/components/sections/Usages.astro').read_text()
        css = source.split('<style>', 1)[1].split('</style>', 1)[0]
        self.assertNotRegex(css, r'color-mix\(|gradient\(|#[0-9a-fA-F]{3,8}\b|rgba?\(')
        self.assertNotIn('var(--accent)', css)
        self.assertNotIn('var(--accent-voile)', css)
        self.assertNotRegex(css, r'\[data-usage=[^]]+\]\s*\{')
        # La section place sa grille ; elle ne redessine pas la carte (surface, bord, rayon, marges).
        for selecteur, corps in regles(css):
            if CLASSES_CARTE.search(selecteur):
                self.assertNotRegex(corps, r'\b(?:background|border|border-radius|padding|box-shadow|color)\s*:', selecteur)


if __name__ == '__main__':
    unittest.main()
