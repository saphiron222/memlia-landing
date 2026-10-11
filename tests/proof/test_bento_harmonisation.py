"""Contrat source : aucune palette ou illustration autonome par capacité.

Système de page du 07/10/2026 : les cinq usages de l'accueil sont des définitions (un terme, son
explication), non cliquables ; ce sont des lignes (`.lignes`), plus des cartes, puisqu'une carte
est une destination. Leur dessin vit une seule fois dans global.css, le même pictogramme de la
même couleur ouvre chaque ligne, et Usages.astro ne redessine rien.
"""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
CLASSES_FORMES = re.compile(r'\.(?:cartes?|carte-[a-z-]+|cellule|bande|lignes?|ligne-[a-z-]+|uses-grid)\b')


def regles(css):
    return [(selecteur.strip(), corps) for selecteur, corps in re.findall(r'([^{}]+)\{([^{}]*)\}', css)]


def style_local(source):
    blocs = re.findall(r'<style(?:\s[^>]*)?>([\s\S]*?)</style>', source)
    return '\n'.join(blocs)


class BentoHarmonisationProof(unittest.TestCase):
    def test_no_card_specific_icon_treatments(self):
        source = (ROOT / 'src/components/sections/Usages.astro').read_text()
        self.assertEqual(source.count('class="ligne-picto"'), 1, 'un seul conteneur pour les cinq pictogrammes')
        self.assertNotIn('use-mark', source)
        self.assertNotIn('class="carte', source, 'les usages ne sont pas des cartes : aucune destination')
        global_css = (ROOT / 'src/styles/global.css').read_text()
        pictos = [selecteur for selecteur, _ in regles(global_css) if '.ligne-picto' in selecteur]
        self.assertTrue(any(re.search(r'(?:^|\s)\.ligne-picto$', selecteur) for selecteur in pictos), pictos)
        variantes = [s for s in pictos if 'data-usage' in s or re.search(r'\.ligne-picto[.\[#]', s)]
        self.assertEqual(variantes, [], 'aucune variante de pictogramme par usage')

    def test_no_secondary_mixed_surfaces_or_raw_colors(self):
        source = (ROOT / 'src/components/sections/Usages.astro').read_text()
        css = style_local(source)
        self.assertNotRegex(css, r'color-mix\(|gradient\(|#[0-9a-fA-F]{3,8}\b|rgba?\(')
        self.assertNotIn('var(--accent)', css)
        self.assertNotIn('var(--accent-voile)', css)
        self.assertNotRegex(css, r'\[data-usage=[^]]+\]\s*\{')
        # La section ne redessine aucune forme du site (surface, bord, rayon, marges, couleur).
        for selecteur, corps in regles(css):
            if CLASSES_FORMES.search(selecteur):
                self.assertNotRegex(corps, r'\b(?:background|border|border-radius|padding|box-shadow|color)\s*:', selecteur)


if __name__ == '__main__':
    unittest.main()
