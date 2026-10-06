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
    # vague 1 (2026-09-16), vingt termes
    'automatisation', 'flux-de-travail', 'declencheur', 'exception', 'file-d-anomalies',
    'proposition-puis-validation', 'recette', 'jeu-d-essai-fictif', 'systeme-d-ia', 'ia-generative',
    'grand-modele-de-langage', 'hallucination', 'reconnaissance-optique-de-caracteres', 'extraction-de-donnees',
    'sous-traitant-rgpd', 'pre-comptabilite', 'completude-du-dossier', 'relance-de-pieces',
    'prelevement-sepa-et-rejet', 'honoraires-mensualises-et-actes-hors-forfait',
    'agregat-non-nominatif', 'annule-et-remplace-dsn', 'anonymisation',
    'cas-de-refus', 'compte-rendu-metier-dsn', 'controle-avant-dsn',
    'controle-de-coherence', 'donnee-personnelle', 'dsn', 'dsn-val',
    'fail-closed', 'lettrage-comptable', 'minimisation-des-donnees',
    'piece-justificative', 'production-sociale', 'pseudonymisation',
    'rapprochement-bancaire', 'recouvrement-amiable', 'regle-de-cabinet',
    'revision-comptable', 'schema-de-donnees', 'tracabilite',
    'validation-humaine',
    # vague 2 (2026-09-19), dix termes
    'automatisation-robotisee-des-processus', 'idempotence', 'reliquat-d-exceptions', 'seuil-d-alerte',
    'agent-ia', 'generation-augmentee-par-recuperation', 'modele-local', 'connecteur-et-api',
    'export-logiciel-et-import-csv', 'cle-de-rapprochement',
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

    def test_exactly_53_unique_visible_terms_and_real_letters(self):
        anchors = re.findall(r'<div class="glossaire-entree" id="([a-z0-9-]+)"', self.html)
        self.assertEqual(len(anchors), 53)
        self.assertEqual(set(anchors), EXPECTED_ANCHORS)
        self.assertEqual(len(anchors), len(set(anchors)))
        terms = re.findall(r'<dt[^>]*>\s*<a[^>]*>(.*?)</a>', self.html, re.S)
        self.assertEqual(len(terms), 53)
        letters = re.findall(r'<section[^>]*data-lettre="([A-Z])"', self.html)
        self.assertEqual(letters, sorted(set(term.strip()[0].upper() for term in terms)))

    def test_metadata_sources_and_boundaries_are_complete(self):
        self.assertEqual(self.html.count('data-definition='), 53)
        self.assertEqual(self.html.count('data-example-fictitious='), 53)
        self.assertEqual(self.html.count('data-common-confusion='), 53)
        self.assertEqual(self.html.count('data-automation-boundary='), 53)
        # Décision de Kevin du 06/10/2026 : pas de bloc « Sources » ; l'organisme externe est cité par un lien
        # en fin de définition. Les seules sources internes (méthode, articles Memlia) restent des renvois.
        self.assertNotIn('entree-sources', self.html)
        definitions = re.findall(r'<p class="definition"[^>]*>(.*?)</p>', self.html, re.S)
        self.assertEqual(len(definitions), 53)
        cites = [definition for definition in definitions if 'href="https://' in definition]
        # 22 entrées ne s'appuient que sur la méthode ou un article Memlia : rien d'externe à citer.
        self.assertEqual(len(cites), 31)
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
        self.assertEqual(len(term_set['hasDefinedTerm']), 53)
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
        # Le plan du site du footer inclut désormais les collections dynamiques. Dériver les
        # routes de tout le rendu plutôt que de maintenir une liste spéciale pour le blog : une
        # nouvelle famille de pages doit être reconnue si, et seulement si, Astro l'a construite.
        paths = {'/'}
        for page in DIST.rglob('*.html'):
            relatif = page.relative_to(DIST).with_suffix('').as_posix()
            if relatif == '404':
                continue
            route = f'/{relatif}'
            if route.endswith('/index'):
                route = route[:-len('index')].rstrip('/') or '/'
            paths.add(route)
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
        self.assertEqual(len(definitions), 53)
        self.assertEqual(len(set(definitions)), 53)
        for entry in re.findall(r'<div class="glossaire-entree".*?</dd>\s*</div>', self.html, re.S):
            text = re.sub(r'<[^>]+>', ' ', entry)
            self.assertGreaterEqual(len(text.split()), 55)

    def test_glossary_links_to_the_exact_preserved_articles(self):
        # Depuis le 17/09/2026 au soir, plus aucun dossier « publie-non-atteste » : les trois articles
        # historiques sont entres dans la forge. Chaque dossier porte alors un review.json dont le sujet
        # scelle les octets éditoriaux de l'article. Les figures data-blog-proof ont leur propre manifeste
        # de rendu : elles sont retirées comme le fait la forge avant de recalculer cette empreinte.
        preserved = [
            path for path in (ROOT / 'editorial/articles').glob('*/manifest.json')
            if json.loads(path.read_text()).get('editorialStatus') == 'publie-non-atteste'
        ]
        self.assertEqual(preserved, [])
        published = sorted(
            article for article in (ROOT / 'src/content/blog').glob('*.md')
            if '\nbrouillon: false\n' in article.read_text(encoding='utf-8')
        )
        self.assertGreaterEqual(len(published), 6)
        for article in published:
            review = json.loads((ROOT / 'editorial/articles' / article.stem / 'review.json').read_text())
            self.assertEqual(review['subject']['slug'], article.stem)
            markdown = article.read_text(encoding='utf-8')
            editorial = re.sub(
                r'<figure\b[^>]*\bdata-blog-proof=(?:"[^"]*"|\'[^\']*\')[^>]*>.*?</figure>',
                '',
                markdown,
                flags=re.I | re.S,
            )
            editorial = re.sub(r'\n{3,}', '\n\n', editorial)
            self.assertEqual(hashlib.sha256(editorial.encode()).hexdigest(), review['subject']['articleSha256'], article.stem)
        # Le glossaire ne renvoie qu'a des articles publies, et garde ses renvois historiques vers les
        # deux articles paie et social qu'il citait avant leur entree dans la forge.
        linked = set(re.findall(r'href="/blog/([a-z0-9-]+)"', self.html))
        self.assertTrue(linked <= {article.stem for article in published}, linked)
        for slug in ('controler-les-bulletins-de-paie-avant-la-dsn', 'suivre-la-production-sociale-dans-excel'):
            self.assertIn(slug, linked)


if __name__ == '__main__':
    unittest.main(verbosity=2)
