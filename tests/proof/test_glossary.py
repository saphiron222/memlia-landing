"""Oracle indépendant du glossaire rendu dans dist."""
import hashlib
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / 'dist'
SITE = 'https://memlia.fr'
GLOSSARY_URL = f'{SITE}/glossaire'
EXPECTED_ANCHORS = {
    'agregat-non-nominatif', 'annule-et-remplace-dsn', 'anonymisation',
    'cas-de-refus', 'compte-rendu-metier-dsn', 'controle-avant-dsn',
    'controle-de-coherence', 'donnee-personnelle', 'dsn', 'dsn-val',
    'fail-closed', 'lettrage-comptable', 'minimisation-des-donnees',
    'piece-justificative', 'production-sociale', 'pseudonymisation',
    'rapprochement-bancaire', 'recouvrement-amiable', 'regle-de-cabinet',
    'revision-comptable', 'schema-de-donnees', 'tracabilite',
    'validation-humaine',
}


class Document(HTMLParser):
    def __init__(self, path):
        super().__init__()
        self.tags = []
        self.feed(path.read_text())

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def select(self, tag):
        return [attrs for name, attrs in self.tags if name == tag]


def sitemap_urls():
    index = ET.parse(DIST / 'sitemap.xml')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    urls = set()
    for location in index.findall('.//s:loc', ns):
        sitemap_path = str(urlsplit(location.text or '').path).lstrip('/')
        subtree = ET.parse(DIST / sitemap_path)
        urls.update(node.text for node in subtree.findall('.//s:url/s:loc', ns))
    return urls


class GlossaryProof(unittest.TestCase):
    def setUp(self):
        self.path = DIST / 'glossaire.html'
        self.html = self.path.read_text()
        self.doc = Document(self.path)

    def test_exactly_23_unique_visible_terms_and_real_letters(self):
        anchors = re.findall(r'<div class="glossaire-entree" id="([a-z0-9-]+)"', self.html)
        self.assertEqual(len(anchors), 23)
        self.assertEqual(set(anchors), EXPECTED_ANCHORS)
        self.assertEqual(len(anchors), len(set(anchors)))
        terms = re.findall(r'<dt[^>]*>\s*<a[^>]*>(.*?)</a>', self.html, re.S)
        self.assertEqual(len(terms), 23)
        letters = re.findall(r'<section[^>]*data-lettre="([A-Z])"', self.html)
        self.assertEqual(letters, sorted(set(term.strip()[0].upper() for term in terms)))

    def test_metadata_sources_and_boundaries_are_complete(self):
        self.assertEqual(self.html.count('data-definition='), 23)
        self.assertEqual(self.html.count('data-example-fictitious='), 23)
        self.assertEqual(self.html.count('data-common-confusion='), 23)
        self.assertEqual(self.html.count('data-automation-boundary='), 23)
        self.assertEqual(self.html.count('class="entree-sources"'), 23)
        # Le lecteur voit les sources, jamais notre chaîne éditoriale : ni encart de statut,
        # ni date de relecture, ni marqueur de revue — pas même dans les attributs du HTML.
        self.assertNotIn('data-business-reviewer', self.html)
        self.assertNotIn('entree-meta', self.html)
        self.assertEqual([time.get('datetime') for time in self.doc.select('time')], [])
        # La date de relecture reste une donnée éditoriale : elle vit dans la source, pas dans la page.
        donnees = (ROOT / 'src/data/glossary.ts').read_text()
        self.assertIn("sourceCheckedAt: '2026-09-14'", donnees)
        self.assertNotIn('Donnée client réelle', self.html)

    def test_canonical_schema_and_breadcrumb_are_consistent(self):
        canonical = next(link['href'] for link in self.doc.select('link') if link.get('rel') == 'canonical')
        self.assertEqual(canonical, GLOSSARY_URL)
        scripts = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', self.html)
        self.assertEqual(len(scripts), 1)
        graph = json.loads(scripts[0])['@graph']
        types = [node['@type'] for node in graph]
        self.assertEqual(types, ['CollectionPage', 'DefinedTermSet', 'BreadcrumbList', 'Organization', 'WebSite'])
        term_set = graph[1]
        self.assertEqual(term_set['url'], GLOSSARY_URL)
        self.assertEqual(len(term_set['hasDefinedTerm']), 23)
        schema_urls = {term['url'] for term in term_set['hasDefinedTerm']}
        self.assertEqual(schema_urls, {f'{GLOSSARY_URL}#{anchor}' for anchor in EXPECTED_ANCHORS})
        self.assertTrue(all(term['inDefinedTermSet'] == {'@id': f'{GLOSSARY_URL}#term-set'} for term in term_set['hasDefinedTerm']))
        self.assertNotIn('FAQPage', self.html)
        crumbs = graph[2]['itemListElement']
        self.assertEqual([crumb['item'] for crumb in crumbs], [f'{SITE}/', GLOSSARY_URL])

    def test_sitemap_contains_only_the_index_not_fragment_or_term_pages(self):
        urls = sitemap_urls()
        self.assertIn(GLOSSARY_URL, urls)
        self.assertFalse(any('#' in url for url in urls))
        self.assertFalse(any(url.startswith(f'{GLOSSARY_URL}/') for url in urls))

    def test_internal_links_only_target_rendered_routes_or_fragments(self):
        paths = {'/'}
        paths.update(f'/{page.stem}' for page in DIST.glob('*.html') if page.stem not in {'index', '404'})
        paths.update(f'/blog/{page.stem}' for page in (DIST / 'blog').glob('*.html'))
        ids = {attrs['id'] for _, attrs in self.doc.tags if attrs.get('id')}
        for anchor in self.doc.select('a'):
            href = anchor.get('href', '')
            if href.startswith('#'):
                self.assertIn(href[1:], ids, href)
            elif href.startswith('/'):
                path, _, fragment = href.partition('#')
                self.assertIn(path or '/', paths, href)
                if path == '/glossaire' and fragment:
                    self.assertIn(fragment, ids, href)

    def test_no_autonomous_or_thin_glossary_pages_exist(self):
        self.assertEqual(list((DIST / 'glossaire').glob('*.html')), [])
        self.assertNotRegex(self.html, r'href="/glossaire/[^"]+"')
        definitions = [re.sub(r'<[^>]+>', ' ', value).strip() for value in re.findall(r'<p class="definition"[^>]*>(.*?)</p>', self.html, re.S)]
        self.assertEqual(len(definitions), 23)
        self.assertEqual(len(set(definitions)), 23)
        for entry in re.findall(r'<div class="glossaire-entree".*?</dd>\s*</div>', self.html, re.S):
            text = re.sub(r'<[^>]+>', ' ', entry)
            self.assertGreaterEqual(len(text.split()), 55)

    def test_glossary_links_to_the_exact_preserved_articles(self):
        dossiers = sorted(
            path for path in (ROOT / 'editorial/articles').glob('*/review.json')
            if json.loads((path.parent / 'manifest.json').read_text()).get('editorialStatus') == 'publie-non-atteste'
        )
        # Les deux dossiers historiques conservés ; les dossiers scellés par la forge ont leur propre audit.
        self.assertEqual(len(dossiers), 2)
        for review_path in dossiers:
            review = json.loads(review_path.read_text())
            slug = review['subject']['slug']
            expected_hash = review['subject']['articleSha256']
            source = (ROOT / 'src/content/blog' / f'{slug}.md').read_bytes()
            self.assertEqual(hashlib.sha256(source).hexdigest(), expected_hash, slug)
            self.assertIn(f'href="/blog/{slug}"', self.html, slug)


if __name__ == '__main__':
    unittest.main(verbosity=2)
