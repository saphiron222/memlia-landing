"""Contrat M3-S indépendant des sources : mesure les artefacts effectivement publiés."""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
from functools import lru_cache
import json
import re
import subprocess
import unittest

DIST = Path(__file__).resolve().parents[2] / 'dist'
TEXT_SUFFIXES = {'.html', '.htm', '.txt', '.md', '.xml', '.json', '.svg', '.js', '.mjs', '.webmanifest', '.vtt'}
CATALOGUE = re.compile(r'module-|suivi.social|supervision.sociale|bulletins.dsn|synth.se.salaires|flux.compta|conseil.fiscal|memlia.desk|Office\.js|COM/\.NET|SoftwareApplication|En pilote|Sur étude|Périmètre distinct', re.I)
PRODUCT_WORDS = re.compile(r'\bmodules?\b|\bcompléments?\s+(?:Excel|Memlia)\b', re.I)
# Exception fermée : une définition technique isolée, jamais un nom/CTA de produit.
# Toute autre mention au singulier exige une revue explicite, pas une heuristique permissive.
GENERIC_DEFINITIONS = {'Un module est une unité logicielle.'}

@lru_cache(maxsize=256)
def without_worker_technical_terms(source):
    if not PRODUCT_WORDS.search(source):
        return source
    # Le parseur déjà utilisé par Astro distingue code, chaînes, templates et regex.
    # Une panne du parseur échoue le contrôle plutôt que d'exempter du texte.
    return subprocess.run(
        ['node', str(Path(__file__).with_name('worker-technical-terms.mjs'))],
        input=source, text=True, capture_output=True, check=True, timeout=30,
    ).stdout


class PublicText(HTMLParser):
    """Texte et attributs publics ; CSS et attributs techniques ne sont pas de la copy."""
    def __init__(self, source):
        super().__init__()
        self.parts = []
        self.text = []
        self.in_style = False
        self.in_javascript = False
        self.feed(source)
        self.flush()

    def flush(self):
        if self.text:
            self.parts.append(''.join(self.text))
            self.text = []

    def handle_starttag(self, tag, attrs):
        if tag in {'p', 'div', 'section', 'li', 'h1', 'h2', 'h3', 'title', 'script', 'style', 'br'}:
            self.flush()
        if tag == 'style':
            self.in_style = True
        if tag == 'script':
            self.in_javascript = (dict(attrs).get('type') or '').lower() in {
                '', 'module', 'text/javascript', 'application/javascript',
            }
        for key, value in attrs:
            if key in {'content', 'alt', 'title', 'aria-label', 'aria-description', 'placeholder', 'value'} and value:
                self.parts.append(value)

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False
        if tag == 'script':
            self.in_javascript = False
        if tag in {'p', 'div', 'section', 'li', 'h1', 'h2', 'h3', 'title', 'script', 'style'}:
            self.flush()

    def handle_data(self, data):
        if not self.in_style:
            self.text.append(without_worker_technical_terms(data) if self.in_javascript else data)


def catalogue_violations(source, suffix):
    if suffix in {'.html', '.htm', '.svg'}:
        parts = PublicText(source).parts
    else:
        parts = [without_worker_technical_terms(source) if suffix in {'.js', '.mjs'} else source]
    # Préserver aussi le contrat historique sur ancres/attributs et identifiants.
    legacy = CATALOGUE.search(source)
    violations = [legacy.group()] if legacy else []
    for part in parts:
        text = ' '.join(unescape(part).split())
        if text in GENERIC_DEFINITIONS:
            continue
        match = CATALOGUE.search(text) or PRODUCT_WORDS.search(text)
        if match:
            violations.append(text)
    return violations


def public_surface_violations(root):
    files = sorted(path for path in root.rglob('*') if path.is_file())
    checked = [path for path in files if path.suffix.lower() in TEXT_SUFFIXES]
    violations = {}
    for path in files:
        name = path.relative_to(root).as_posix()
        if CATALOGUE.search(name) or PRODUCT_WORDS.search(name):
            violations[name] = ['Nom de fichier catalogue']
    for path in checked:
        findings = catalogue_violations(path.read_text(encoding='utf-8'), path.suffix.lower())
        if findings:
            violations.setdefault(path.relative_to(root).as_posix(), []).extend(findings)
    return checked, files, violations


class Text(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.parts = []
        self.feed(html)

    def handle_data(self, value):
        self.parts.append(value)


class PositioningProof(unittest.TestCase):
    maxDiff = None

    def test_no_catalogue_in_any_public_surface(self):
        checked, files, violations = public_surface_violations(DIST)
        required = {'index.html', '404.html', 'mentions-legales.html', 'politique-de-confidentialite.html', 'llms.txt',
                    'blog.html', 'blog/rss.xml'}
        # Les articles publiés sont des surfaces texte comme les autres : aucun n'échappe au contrat.
        articles = {p.relative_to(DIST).as_posix() for p in (DIST / 'blog').glob('*.html')}
        self.assertGreaterEqual(len(articles), 2)
        self.assertTrue((required | articles) <= {p.relative_to(DIST).as_posix() for p in checked})
        print(f'Positionnement : {len(checked)} surfaces texte / {len(files)} fichiers ; '
              f'{len(files) - len(checked)} contenus binaires/CSS hors analyse lexicale, noms contrôlés.')
        self.assertEqual(violations, {})

    def test_guard_rejects_catalogue_on_every_text_channel(self):
        for source in [
            '<p>Retrouvez les modules</p>', '<p>Découvrez notre module.</p>',
            '<p>documentés module par module</p>', '<p>Un complément Excel</p>',
            '<p>Des compléments <strong>Excel</strong></p>', '<p>compléments Memlia</p>',
            '<meta name="description" content="Retrouvez les modules">',
            '<meta property="og:description" content="Complément&#32;Excel">',
            '<img alt="Nos modules">', '<button aria-label="Voir le module">Voir</button>',
            '<script type="application/ld+json">{"description":"Nos modules"}</script>',
            '<script>document.title = "Nos modules";</script>',
            '<a href="#module-suivi-social">Découvrir</a>',
            '<p>Un module est une unité logicielle. Découvrez notre offre.</p>',
        ]:
            with self.subTest(source=source):
                self.assertTrue(catalogue_violations(source, '.html'))

    def test_guard_allows_only_isolated_generic_singular(self):
        for source in [
            '<p>Un module est une unité logicielle.</p>',
            '<script type="module">document.title = "Memlia";</script>',
            '<style>.modules { display: grid; }</style><p>Automatisation IA</p>',
            '<p>Un complément d’information sur les outils existants, dont Excel.</p>',
        ]:
            with self.subTest(source=source):
                self.assertEqual(catalogue_violations(source, '.html'), [])

    def test_guard_accepts_technical_worker_without_exempting_public_copy(self):
        technical = [
            "new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });",
            'new Worker(workerUrl,{type:"module",name:"calcul"});',
            'new Worker("/_astro/worker.js", {name: "calcul", "type": "module"});',
            "throw new Error('Module Worker indisponible');",
            'throw new Error("Module Worker indisponible");',
        ]
        for source in technical:
            for suffix in ('.js', '.mjs', '.html', '.htm', '.svg'):
                with self.subTest(source=source, suffix=suffix):
                    surface = f'<script type="module">{source}</script>' if suffix in {'.html', '.htm', '.svg'} else source
                    self.assertEqual(catalogue_violations(surface, suffix), [])
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as directory:
            root = Path(directory)
            bundle = root / 'worker.js'
            bundle.write_text('\n'.join(technical), encoding='utf-8')
            self.assertEqual(public_surface_violations(root)[2], {})
            bundle.write_text('\n'.join(technical) + '\ndocument.title="Nos modules";', encoding='utf-8')
            self.assertEqual(set(public_surface_violations(root)[2]), {'worker.js'})

    def test_guard_keeps_catalogue_checks_next_to_technical_workers(self):
        worker = 'new Worker(workerUrl,{type:"module"});'
        # Du code apparent dans une chaîne n'est jamais une option ou un diagnostic.
        for source in [
            'document.title = "new Error(\'Module Worker indisponible\')";',
            "document.title = `Découvrez notre new Worker(url, {type: 'module'})`;",
            'new Worker(url, {type: \'classic\', name: "Notre offre, type:\'module\', comptable"});',
        ]:
            for suffix in ('.js', '.mjs', '.html', '.htm', '.svg'):
                with self.subTest(source=source, suffix=suffix):
                    surface = f'<script>{source}</script>' if suffix in {'.html', '.htm', '.svg'} else source
                    self.assertTrue(catalogue_violations(surface, suffix))
        for source, suffix in [
            (worker + 'document.title="Notre module comptable";', '.js'),
            (worker + 'const offre="Modules Memlia";', '.mjs'),
            ('new Worker(workerUrl,{type:"module",name:"Notre module comptable"});', '.js'),
            ('const offre={type:"module",description:"Notre offre"};', '.js'),
            ('throw new Error("Module Worker indisponible : découvrez notre module");', '.js'),
            ('const texte="Module Worker indisponible";', '.js'),
            (f'<script>{worker}</script><p>Découvrez notre module.</p>', '.html'),
            ('<p>Module Worker indisponible</p>', '.html'),
            ('<button aria-label="Module Worker indisponible">Voir</button>', '.html'),
            ('<script type="application/ld+json">{"type":"module"}</script>', '.html'),
            ('<script type="application/json">{"description":"Module Worker indisponible"}</script>', '.html'),
            ('{"type":"module"}', '.json'),
            (worker + 'const lien="#module-comptable";', '.js'),
        ]:
            with self.subTest(source=source, suffix=suffix):
                self.assertTrue(catalogue_violations(source, suffix))

    def test_guard_discovers_nested_and_non_html_surfaces(self):
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as directory:
            root = Path(directory)
            for suffix in sorted(TEXT_SUFFIXES):
                path = root / 'nouvelle-route' / f'surface{suffix}'
                path.parent.mkdir(exist_ok=True)
                path.write_text('Retrouvez les modules', encoding='utf-8')
            checked, files, violations = public_surface_violations(root)
            self.assertEqual(len(checked), len(TEXT_SUFFIXES))
            self.assertEqual(len(files), len(TEXT_SUFFIXES))
            self.assertEqual(set(violations), {p.relative_to(root).as_posix() for p in checked})

    def test_service_identity_and_hero(self):
        html = (DIST / 'index.html').read_text()
        text = ' '.join(Text(html).parts)
        self.assertIn('Votre cabinet tourne sur un savoir-faire que personne n’a écrit.', text)
        hero = re.search(r'<section[^>]*class="hero"[\s\S]*?</section>', html).group()
        self.assertNotIn('Excel', hero)
        self.assertNotIn('module', hero.lower())
        self.assertIn('Automatisation IA pour cabinets comptables | Memlia', html)
        schemas = [
            json.loads(payload)
            for payload in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html)
        ]
        graph = next(schema['@graph'] for schema in schemas if '@graph' in schema)
        service = next(n for n in graph if n['@type'] == 'Service')
        self.assertEqual(service['serviceType'], "Automatisation IA pour cabinets d'expertise comptable")
        self.assertNotIn('offers', service)
        self.assertNotIn('featureList', service)

    def test_written_rule_automation_is_bounded_in_daily_passage(self):
        html = (DIST / 'index.html').read_text()
        match = re.search(r'<p[^>]*class="daily-note texte-2"[^>]*>(.*?)</p>', html, re.S)
        self.assertIsNotNone(match)
        assert match is not None
        passage = match.group(1)
        text = ' '.join(' '.join(Text(passage).parts).split())
        self.assertEqual(text, 'Écrire la règle, c’est notre métier. Une règle écrite appartient au cabinet. '
                         'Nous en automatisons la part répétitive lorsque les formats, les accès et les cas couverts le permettent.')
        self.assertNotIn('une règle écrite s’automatise', html)

    def test_illustrations_are_not_product_cards(self):
        html = (DIST / 'index.html').read_text()
        usages = re.search(r'<section[^>]*id="usages"[\s\S]*?</section>', html).group()
        self.assertEqual(usages.count('data-usage='), 5)
        self.assertNotIn('Exemples non contractuels', usages)
        self.assertNotIn('Ils ne décrivent pas des fonctions prêtes à installer.', usages)
        self.assertNotIn('Exemple de parcours', usages)
        self.assertNotIn('<dl', usages)
        self.assertEqual(usages.count('<h3'), 5)
        self.assertNotIn('<button', usages)
        self.assertNotIn('<a ', usages)
        self.assertIn('validation humaine', (DIST / 'llms.txt').read_text())

    def test_external_actions_and_data_are_bounded(self):
        text = ' '.join(Text((DIST / 'index.html').read_text()).parts)
        for phrase in ['Aucun envoi externe sans validation humaine', 'proposition vs saisie', 'jamais nominatif', 'RGPD', 'jeux fictifs']:
            self.assertIn(phrase, text)


if __name__ == '__main__':
    unittest.main(verbosity=2)
