"""Contrat M3-S indépendant des sources : mesure les artefacts effectivement publiés."""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
import json
import re
import unittest

DIST = Path(__file__).resolve().parents[2] / 'dist'
TEXT_SUFFIXES = {'.html', '.htm', '.txt', '.md', '.xml', '.json', '.svg', '.js', '.mjs', '.webmanifest'}
CATALOGUE = re.compile(r'module-|suivi.social|supervision.sociale|bulletins.dsn|synth.se.salaires|flux.compta|conseil.fiscal|memlia.desk|Office\.js|COM/\.NET|SoftwareApplication|En pilote|Sur étude|Périmètre distinct', re.I)
PRODUCT_WORDS = re.compile(r'\bmodules?\b|\bcompléments?\s+(?:Excel|Memlia)\b', re.I)
# Exception fermée : une définition technique isolée, jamais un nom/CTA de produit.
# Toute autre mention au singulier exige une revue explicite, pas une heuristique permissive.
GENERIC_DEFINITIONS = {'Un module est une unité logicielle.'}


class PublicText(HTMLParser):
    """Texte et attributs publics ; CSS et attributs techniques ne sont pas de la copy."""
    def __init__(self, source):
        super().__init__()
        self.parts = []
        self.text = []
        self.in_style = False
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
        for key, value in attrs:
            if key in {'content', 'alt', 'title', 'aria-label', 'aria-description', 'placeholder', 'value'} and value:
                self.parts.append(value)

    def handle_endtag(self, tag):
        if tag == 'style':
            self.in_style = False
        if tag in {'p', 'div', 'section', 'li', 'h1', 'h2', 'h3', 'title', 'script', 'style'}:
            self.flush()

    def handle_data(self, data):
        if not self.in_style:
            self.text.append(data)


def catalogue_violations(source, suffix):
    parts = PublicText(source).parts if suffix in {'.html', '.htm', '.svg'} else [source]
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
        required = {'index.html', '404.html', 'mentions-legales.html', 'politique-de-confidentialite.html', 'llms.txt'}
        self.assertTrue(required <= {p.relative_to(DIST).as_posix() for p in checked})
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
        self.assertIn('Automatisez les tâches qui ralentissent votre cabinet.', text)
        hero = re.search(r'<section[^>]*class="hero"[\s\S]*?</section>', html).group()
        self.assertNotIn('Excel', hero)
        self.assertNotIn('module', hero.lower())
        self.assertIn('Automatisation IA pour cabinets comptables | Memlia', html)
        graph = json.loads(re.search(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html).group(1))['@graph']
        service = next(n for n in graph if n['@type'] == 'Service')
        self.assertEqual(service['serviceType'], "Automatisation IA pour cabinets d'expertise comptable")
        self.assertNotIn('offers', service)
        self.assertNotIn('featureList', service)

    def test_illustrations_are_not_product_cards(self):
        html = (DIST / 'index.html').read_text()
        usages = re.search(r'<section[^>]*id="usages"[\s\S]*?</section>', html).group()
        self.assertEqual(usages.count('data-usage='), 5)
        self.assertIn('Exemples non contractuels', usages)
        self.assertNotIn('<button', usages)
        self.assertNotIn('<a ', usages)
        self.assertIn('validation humaine', (DIST / 'llms.txt').read_text())

    def test_external_actions_and_data_are_bounded(self):
        text = ' '.join(Text((DIST / 'index.html').read_text()).parts)
        for phrase in ['Aucun envoi externe sans validation humaine', 'proposition vs saisie', 'jamais nominatif', 'RGPD', 'jeux fictifs']:
            self.assertIn(phrase, text)


if __name__ == '__main__':
    unittest.main(verbosity=2)
