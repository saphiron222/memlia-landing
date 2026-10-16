"""Contrat des sitemaps produits : partition exacte des pages indexables."""
import unittest
import xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit

DIST = Path(__file__).resolve().parents[2] / 'dist'
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
TYPES = ('pages', 'services', 'guides', 'outils', 'blog', 'glossaire', 'cac', 'agents')


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical = None
        self.noindex = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'link' and attrs.get('rel') == 'canonical':
            self.canonical = attrs.get('href')
        if tag == 'meta' and attrs.get('name') == 'robots':
            self.noindex |= 'noindex' in (attrs.get('content') or '').lower()


class TypedSitemapsTest(unittest.TestCase):
    def test_complete_unique_partition_of_rendered_indexable_pages(self):
        index = ET.parse(DIST / 'sitemap.xml')
        children = [node.text for node in index.findall('s:sitemap/s:loc', NS)]
        expected_children = {f'https://memlia.fr/sitemap-{kind}.xml' for kind in TYPES
                             if (DIST / f'sitemap-{kind}.xml').exists()}
        self.assertEqual(set(children), expected_children)
        self.assertEqual(len(children), len(expected_children))
        self.assertEqual((DIST / 'sitemap.xml').read_bytes(), (DIST / 'sitemap-index.xml').read_bytes())
        self.assertFalse((DIST / 'sitemap-0.xml').exists())
        actual = []
        for location in children:
            assert location is not None
            path = DIST / urlsplit(location).path.lstrip('/')
            self.assertLessEqual(path.stat().st_size, 50 * 1024 * 1024)
            entries = ET.parse(path).findall('s:url', NS)
            self.assertGreater(len(entries), 0, 'Ne pas soumettre un sitemap vide à Google')
            self.assertLessEqual(len(entries), 50000)
            for entry in entries:
                loc = entry.find('s:loc', NS)
                assert loc is not None and loc.text is not None
                url = loc.text
                self.assertTrue(url.startswith('https://memlia.fr/'))
                self.assertIsNotNone(entry.find('s:lastmod', NS))
                actual.append(url)
        self.assertEqual(len(actual), len(set(actual)), 'URL présente dans plusieurs sitemaps')
        expected = set()
        for html in DIST.rglob('*.html'):
            metadata = Metadata()
            metadata.feed(html.read_text())
            if metadata.canonical and not metadata.noindex:
                expected.add(metadata.canonical)
        self.assertEqual(set(actual), expected)

    def test_les_agents_ia_ont_leur_sitemap(self):
        # Le hub et chaque fiche construite (tâche 4, puis 6 et 9) : un type à part, préfixe /agents-ia.
        path = DIST / 'sitemap-agents.xml'
        self.assertTrue(path.exists(), 'sitemap-agents.xml absent')
        urls = [node.text for node in ET.parse(path).findall('s:url/s:loc', NS)]
        self.assertIn('https://memlia.fr/agents-ia', urls)
        for url in urls:
            assert url is not None
            chemin = urlsplit(url).path
            self.assertTrue(chemin == '/agents-ia' or chemin.startswith('/agents-ia/'), url)
        index = (DIST / 'sitemap.xml').read_text()
        self.assertIn('https://memlia.fr/sitemap-agents.xml', index)
