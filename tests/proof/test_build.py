"""Oracle indépendant sur dist : aucun import du code Astro ou du manifeste produit."""
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / 'dist'


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def select(self, tag):
        return [attrs for name, attrs in self.tags if name == tag]


class BuildProof(unittest.TestCase):
    def test_four_pages_one_h1_french(self):
        pages = sorted(DIST.glob('*.html'))
        self.assertEqual([p.stem for p in pages], ['404', 'index', 'mentions-legales', 'politique-de-confidentialite'])
        for page in pages:
            doc = Document(page)
            self.assertEqual(len(doc.select('h1')), 1, page.name)
            self.assertEqual(doc.select('html')[0]['lang'], 'fr')

    def test_legal_noindex_canonical(self):
        for slug in ['mentions-legales', 'politique-de-confidentialite']:
            doc = Document(DIST / f'{slug}.html')
            robots = next(m['content'] for m in doc.select('meta') if m.get('name') == 'robots')
            self.assertIn('noindex', robots)
            canonical = next(m['href'] for m in doc.select('link') if m.get('rel') == 'canonical')
            self.assertEqual(canonical, f'https://memlia.fr/{slug}')

    def test_sitemap_complete_no_legal(self):
        index = ET.parse(DIST / 'sitemap.xml')
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        links = [el.text for el in index.findall('.//s:loc', ns)]
        self.assertGreater(len(links), 0)
        pages = []
        for link in links:
            self.assertIsInstance(link, str)
            if link is None: self.fail('URL sitemap vide')
            subtree = ET.parse(DIST / urlsplit(link).path.lstrip('/'))
            pages.extend(el.text for el in subtree.findall('.//s:loc', ns))
        self.assertEqual(pages, ['https://memlia.fr/'])
        self.assertIn('Sitemap: https://memlia.fr/sitemap.xml', (DIST / 'robots.txt').read_text())

    def test_asset_and_srcset_targets(self):
        seen = set()
        for page in DIST.glob('*.html'):
            for tag, attrs in Document(page).tags:
                targets = []
                if tag in ['img', 'script', 'source'] and attrs.get('src'): targets.append(attrs['src'])
                if attrs.get('srcset'): targets.extend(part.strip().split()[0] for part in attrs['srcset'].split(','))
                if tag == 'link' and attrs.get('rel') in ['icon', 'preload', 'apple-touch-icon']: targets.append(attrs['href'])
                for target in targets:
                    if target.startswith('/'):
                        self.assertTrue((DIST / target.lstrip('/')).is_file(), target)
                        seen.add(target)
        self.assertGreaterEqual(len(seen), 40)

    def test_placeholders_and_briefs(self):
        self.assertEqual(len(list((ROOT / 'public/images').glob('brief-img-1[6-9]-*.md'))) + len(list((ROOT / 'public/images').glob('brief-img-2[0-2]-*.md'))), 7)
        self.assertEqual(len(list((DIST / 'images').glob('brief-*.md'))), 0)
        self.assertEqual(len(list((DIST / 'images').glob('*.avif'))), 24)
        self.assertEqual(len(list((DIST / 'images').glob('*.webp'))), 24)

    def test_five_generic_examples_no_product_statuses(self):
        html = (DIST / 'index.html').read_text()
        ids = re.findall(r'data-usage="([^"]+)"', html)
        self.assertEqual(set(ids), {'collect', 'check', 'compare', 'follow', 'decide'})
        self.assertEqual(len(ids), 5)
        self.assertNotIn('id="module-', html)
        for status in ['En pilote', 'Sur étude', 'Périmètre distinct']:
            self.assertNotIn(status, html)

    def test_llms_anchors(self):
        ids = {attrs['id'] for _, attrs in Document(DIST / 'index.html').tags if 'id' in attrs}
        anchors = re.findall(r'https://memlia.fr/#([a-z0-9-]+)', (DIST / 'llms.txt').read_text())
        self.assertGreaterEqual(len(anchors), 4)
        self.assertEqual(set(anchors) - ids, set())

    def test_structured_data_no_unreleased_features(self):
        html = (DIST / 'index.html').read_text()
        scripts = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html)
        self.assertEqual(len(scripts), 1)
        graph = json.loads(scripts[0])['@graph']
        self.assertEqual([node['@type'] for node in graph], ['Organization', 'WebSite', 'Service', 'FAQPage'])
        service = next(node for node in graph if node['@type'] == 'Service')
        self.assertNotIn('featureList', service)
        self.assertNotIn('offers', service)
        self.assertEqual(len(graph[-1]['mainEntity']), 11)
        self.assertNotIn('aggregateRating', scripts[0])


if __name__ == '__main__':
    print('Sujet SHA256 dist/index.html:', hashlib.sha256((DIST / 'index.html').read_bytes()).hexdigest(), flush=True)
    unittest.main(verbosity=2)
