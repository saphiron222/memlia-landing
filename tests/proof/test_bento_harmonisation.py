"""Contrat source : aucune palette ou illustration autonome par capacité."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]


class BentoHarmonisationProof(unittest.TestCase):
    def test_no_card_specific_icon_treatments(self):
        source = (ROOT / 'src/components/sections/Usages.astro').read_text()
        css = source.split('<style>', 1)[1].split('</style>', 1)[0]
        rules = re.findall(r'([^{}]+)\{([^{}]*)\}', css)
        variants = [(selector.strip(), body) for selector, body in rules
                    if '.use-mark' in selector and selector.strip() != '.use-mark']
        self.assertTrue(rules)
        self.assertEqual(variants, [], 'Un seul conteneur pour les cinq pictogrammes')

    def test_no_secondary_mixed_surfaces_or_raw_colors(self):
        source = (ROOT / 'src/components/sections/Usages.astro').read_text()
        css = source.split('<style>', 1)[1].split('</style>', 1)[0]
        self.assertNotRegex(css, r'color-mix\(|gradient\(|#[0-9a-fA-F]{3,8}\b|rgba?\(')
        self.assertNotIn('var(--accent)', css)
        self.assertNotIn('var(--accent-voile)', css)
        self.assertNotRegex(css, r'\[data-usage=[^]]+\]\s*\{')


if __name__ == '__main__':
    unittest.main()
