"""Identité publique autorisée : oracle sur le HTML livré, sans accès au dossier privé."""
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest

DIST = Path(__file__).resolve().parents[2] / 'dist'


class LegalText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_content = False
        self.depth = 0
        self.parts = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'div':
            if self.in_content:
                self.depth += 1
            elif 'legal-corps' in (attrs.get('class') or '').split():
                self.in_content = True
                self.depth = 1
        if self.in_content and tag == 'a':
            self.links.append(attrs.get('href'))

    def handle_endtag(self, tag):
        if self.in_content and tag == 'div':
            self.depth -= 1
            if self.depth == 0:
                self.in_content = False

    def handle_data(self, data):
        if self.in_content:
            self.parts.append(data)


class LegalIdentityProof(unittest.TestCase):
    def setUp(self):
        self.doc = LegalText()
        self.doc.feed((DIST / 'mentions-legales.html').read_text())
        self.text = re.sub(r'\s+', ' ', ' '.join(self.doc.parts)).strip()

    def test_publisher_identity_is_in_legal_body(self):
        for expected in [
            'MEMLIA', 'société par actions simplifiée unipersonnelle (SASU)',
            'capital social de 1 €', 'Bureau 326, 59 rue de Ponthieu, 75008 Paris',
            '108 621 541', '10862154100011', 'RCS Paris 108 621 541',
            'Directeur de la publication : Kevin KITANGA, président de MEMLIA',
        ]:
            with self.subTest(expected=expected):
                self.assertIn(expected, self.text)
        self.assertIn('mailto:contact@memlia.fr', self.doc.links)

    def test_host_identity_and_contact_are_in_legal_body(self):
        for expected in [
            'Cloudflare Pages', 'Cloudflare, Inc.',
            '101 Townsend St., San Francisco, CA 94107, États-Unis',
            '+1 888 993 5273',
        ]:
            with self.subTest(expected=expected):
                self.assertIn(expected, self.text)
        self.assertIn('tel:+18889935273', self.doc.links)
        self.assertIn('https://www.cloudflare.com/terms/', self.doc.links)


if __name__ == '__main__':
    unittest.main(verbosity=2)
