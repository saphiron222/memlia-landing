"""Contrat M3-S indépendant des sources : mesure les artefacts effectivement publiés."""
from pathlib import Path
from html.parser import HTMLParser
from html import unescape
import json
import os
import re
import unicodedata
import unittest
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / 'dist'
TEXT_SUFFIXES = {'.html', '.htm', '.txt', '.md', '.xml', '.json', '.svg', '.js', '.mjs', '.webmanifest', '.vtt'}
CATALOGUE = re.compile(r'module-|suivi.social|supervision.sociale|bulletins.dsn|synth.se.salaires|flux.compta|conseil.fiscal|memlia.desk|Office\.js|COM/\.NET|SoftwareApplication|En pilote|Sur étude|Périmètre distinct', re.I)
PRODUCT_WORDS = re.compile(r'\bmodules?\b|\bcompléments?\s+(?:Excel|Memlia)\b', re.I)
# Exception fermée : une définition technique isolée, jamais un nom/CTA de produit.
# Toute autre mention au singulier exige une revue explicite, pas une heuristique permissive.
GENERIC_DEFINITIONS = {'Un module est une unité logicielle.'}
# Charte §9 bis (agents IA, v7 du 15/10/2026) : ce qu'on n'écrit jamais d'un agent IA. Source unique, lue aussi par
# tests/helpers/agents-interdits.mjs (données des agents) : les deux lecteurs appliquent la même règle de correspondance.
AGENTS_INTERDITS = tuple(json.loads((ROOT / 'config' / 'agents-interdits.json').read_text(encoding='utf-8'))['expressions'])
# Plancher : la liste de la charte ne perd jamais une expression, elle peut en gagner.
AGENTS_INTERDITS_CHARTE = (
    'agent autonome', 'collaborateur IA', 'employé IA', 'assistant IA', 'spécialiste IA', 'agent IA CAC',
    'commissaire aux comptes IA', 'DPO IA', 'embaucher', 'recruter', 'votre nouveau collègue',
    'agent administratif', 'agent comptable',
)
MOT_COURT = 3  # « ia », « aux », « dpo », « cac » ne se pluralisent pas
INVISIBLES = re.compile('[\u00ad\u200b-\u200d\u2060\ufeff]')
APOSTROPHES = re.compile('[\u2018\u2019\u02bc\u2032]')
# La construction rejoue ce verrou après l'export pour les assistants (generate-agent-markdown) :
# la variable l'annonce, et les surfaces de l'export deviennent alors exigées.
FINAL_EXPORT_FLAG = 'POSITIONING_FINAL_EXPORT'
BASE_SURFACES = {'index.html', '404.html', 'mentions-legales.html', 'politique-de-confidentialite.html', 'llms.txt',
                 'blog.html', 'blog/rss.xml'}
SITEMAP_FILE = re.compile(r'sitemap(?:-[^/]+)?\.xml')
# Une adresse tierce n'est pas de la copie : un éditeur cité en source peut écrire « modules » dans son
# chemin. Son libellé reste contrôlé, comme toute adresse memlia.fr ou sans hôte ; le contrôle historique
# (CATALOGUE) continue de lire la source brute, adresses comprises.
ADDRESS = re.compile(r"https?://[A-Za-z0-9\-._~:/?#@!$&*+,;=%]+")
OWN_HOSTS = {'memlia.fr', 'www.memlia.fr'}


def without_third_party_addresses(text):
    def keep_own(match):
        host = (urlsplit(match.group()).hostname or '').rstrip('.')
        return ' ' if host and host not in OWN_HOSTS else match.group()
    return ADDRESS.sub(keep_own, text)


def normalise_agents(text):
    """Texte comparé : NFC, apostrophes droites, blancs repliés, césures et largeurs nulles ôtées, minuscules."""
    text = unicodedata.normalize('NFC', text)
    text = APOSTROPHES.sub("'", INVISIBLES.sub('', text))
    return re.sub(r'\s+', ' ', text).strip().lower()


def agents_interdits_pattern(expression):
    """L'expression entière (ni lettre ni chiffre autour) ; chaque mot de plus de trois lettres accepte un « s » final."""
    words = []
    for word in normalise_agents(expression).split(' '):
        escaped = re.escape(word)
        words.append(escaped + 's?' if len(word) > MOT_COURT and word[-1] not in 'sx' else escaped)
    return re.compile(r'(?<!\w)' + ' '.join(words) + r'(?!\w)')


AGENTS_INTERDITS_PATTERNS = tuple((expression, agents_interdits_pattern(expression)) for expression in AGENTS_INTERDITS)


def agents_interdits_found(text):
    """Les expressions interdites que le texte contient, sous leur forme du fichier de configuration."""
    normalised = normalise_agents(text)
    return [expression for expression, pattern in AGENTS_INTERDITS_PATTERNS if pattern.search(normalised)]


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
        copy = without_third_party_addresses(text)
        match = CATALOGUE.search(copy) or PRODUCT_WORDS.search(copy)
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


def agents_page_violations(source, suffix):
    """Les expressions interdites d'une page : texte et attributs publics d'un HTML, ou le texte brut d'un Markdown."""
    parts = PublicText(source).parts if suffix in {'.html', '.htm'} else [source]
    found = []
    for part in parts:
        for expression in agents_interdits_found(unescape(part)):
            if expression not in found:
                found.append(expression)
    return found


def agents_surfaces(dist_root, source_root=ROOT):
    """Les pages construites où les agents IA parlent : /integrations toujours ; le hub et les fiches dès que leur
    source existe (une route écrite doit être construite, sans quoi la page ne serait jamais lue). Leurs Markdown
    d'export sont lus quand ils sont là : l'export n'est exigé que par le verrou final (required_surfaces)."""
    sources = source_root / 'src' / 'pages' / 'agents-ia'
    pages = {'integrations.html'}
    if (sources / 'index.astro').is_file():
        pages.add('agents-ia.html')
    fiches = {p.relative_to(dist_root).as_posix() for p in (dist_root / 'agents-ia').glob('*.html')}
    if sources.is_dir() and any(p.suffix == '.astro' and p.name != 'index.astro' for p in sources.iterdir()) and not fiches:
        raise AssertionError('Un gabarit de fiche existe dans les sources, aucune fiche n’est construite dans dist/agents-ia/.')
    pages |= fiches
    markdown = {f'markdown/{Path(page).with_suffix("").as_posix()}.md' for page in pages}
    return pages, {name for name in markdown if (dist_root / name).is_file()}


def agents_surface_violations(dist_root, source_root=ROOT):
    pages, markdown = agents_surfaces(dist_root, source_root)
    missing = sorted(name for name in pages if not (dist_root / name).is_file())
    violations = {}
    for name in sorted((pages - set(missing)) | markdown):
        found = agents_page_violations((dist_root / name).read_text(encoding='utf-8'), Path(name).suffix.lower())
        if found:
            violations[name] = found
    return pages, markdown, missing, violations


def final_export_requested(environ):
    value = environ.get(FINAL_EXPORT_FLAG, '')
    if value not in {'', '1'}:
        raise AssertionError(f'{FINAL_EXPORT_FLAG}={value!r} : seules la valeur « 1 » et l’absence sont lues.')
    return value == '1'


def agent_export_surfaces(root):
    """Ce que generate-agent-markdown écrit : llms-full.txt et un Markdown par page des urlset du sitemap."""
    pages = set()
    for path in root.glob('sitemap*.xml'):
        if not SITEMAP_FILE.fullmatch(path.name):
            continue
        xml = path.read_text(encoding='utf-8')
        if re.search(r'<urlset(?:\s|>)', xml):
            pages.update(re.findall(r'<loc>([^<]+)</loc>', xml))
    if not pages:
        raise AssertionError('Sitemap sans page : l’export pour les assistants ne peut pas être exigé.')
    routes = {unquote(urlsplit(url).path).strip('/') for url in pages}
    return {'llms-full.txt'} | {f'markdown/{route or "index"}.md' for route in routes}


def required_surfaces(root, final_export):
    # Les articles publiés sont des surfaces texte comme les autres : aucun n'échappe au contrat.
    articles = {p.relative_to(root).as_posix() for p in (root / 'blog').glob('*.html')}
    required = BASE_SURFACES | articles
    return required | agent_export_surfaces(root) if final_export else required


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
        self.assertGreaterEqual(len(list((DIST / 'blog').glob('*.html'))), 2)
        final_export = final_export_requested(os.environ)
        required = required_surfaces(DIST, final_export)
        self.assertEqual(required - {p.relative_to(DIST).as_posix() for p in checked}, set())
        print(f'Positionnement{" après export" if final_export else ""} : {len(checked)} surfaces texte / '
              f'{len(files)} fichiers ; {len(files) - len(checked)} contenus binaires/CSS hors analyse lexicale, '
              f'noms contrôlés.')
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

    def test_guard_reads_third_party_addresses_as_addresses(self):
        # Sources datées des pages service (src/data/couverture-logiciels.mjs, 06/10/2026) : l'éditeur écrit
        # « modules » dans son chemin ; le HTML le tient dans un href, l'export Markdown l'écrit en clair.
        acd = 'https://www.acd-groupe.fr/solution-collaborative/modules-social/'
        kanta = 'https://www.kanta.fr/modules/lutte-anti-blanchiment'
        for source, suffix in [
            (f'[ACD i-PAIE]({acd}) fait saisir les variables par le client.', '.md'),
            (f'Source : {kanta}\n\n[Kanta]({kanta}) récupère les informations INPI.', '.txt'),
            (f'{{"citation":"{kanta}"}}', '.json'),
            (f'<script type="application/ld+json">{{"citation":"{acd}"}}</script>', '.html'),
            (f'<p>Voir <a href="{acd}">ACD i-PAIE</a>.</p>', '.html'),
        ]:
            with self.subTest(source=source):
                self.assertEqual(catalogue_violations(source, suffix), [])

    def test_guard_keeps_copy_and_own_addresses_next_to_sources(self):
        kanta = 'https://www.kanta.fr/modules/lutte-anti-blanchiment'
        for source, suffix in [
            (f'Nos modules : [Kanta]({kanta}).', '.md'),
            (f'[Les modules Kanta]({kanta})', '.md'),
            (f'[Kanta]({kanta}) et un complément Excel.', '.txt'),
            ('[Paie](https://memlia.fr/modules/paie)', '.md'),
            ('Version Markdown : https://www.memlia.fr/markdown/modules.md', '.txt'),
            (f'{{"name":"Nos modules","url":"{kanta}"}}', '.json'),
            (f'<p>Nos modules <a href="{kanta}">Kanta</a></p>', '.html'),
            (f'[Kanta]({kanta}/module-paie)', '.md'),
            # Seule l'adresse est exemptée : la copie collée juste après elle reste lue.
            (f'[Kanta]({kanta})modules', '.md'),
            (f'[Kanta]({kanta})complément Excel', '.md'),
            (f'{{"url":"{kanta}","name":"modules"}}', '.json'),
            (f'<loc>{kanta}</loc>modules', '.xml'),
            # Sans hôte, ou memlia.fr écrit avec son point final : rien ne prouve une adresse tierce.
            ('[Paie](https:///modules/paie)', '.md'),
            ('[Paie](https://memlia.fr./modules)', '.md'),
        ]:
            with self.subTest(source=source):
                self.assertTrue(catalogue_violations(source, suffix))

    def test_agents_pages_respect_the_agent_ia_charter(self):
        pages, markdown, missing, violations = agents_surface_violations(DIST)
        print(f'Agents IA : {len(pages)} page(s) et {len(markdown)} Markdown lus, {len(AGENTS_INTERDITS)} expressions interdites.')
        self.assertEqual(missing, [])
        self.assertEqual(violations, {})

    def test_agents_forbidden_expressions_keep_the_charter_floor(self):
        self.assertTrue(all(isinstance(e, str) and e == e.strip() and e for e in AGENTS_INTERDITS))
        self.assertEqual(len({normalise_agents(e) for e in AGENTS_INTERDITS}), len(AGENTS_INTERDITS))
        self.assertEqual([e for e in AGENTS_INTERDITS_CHARTE if e not in AGENTS_INTERDITS], [])

    def test_agents_guard_rejects_every_forbidden_expression_on_every_text_channel(self):
        for expression in AGENTS_INTERDITS:
            for source, suffix in [
                (f'<p>Découvrez notre {expression} dès aujourd’hui.</p>', '.html'),
                (f'<p>Découvrez notre <em>{expression}</em>.</p>', '.html'),
                (f'<img alt="{expression}">', '.html'),
                (f'<meta name="description" content="{expression.upper()}">', '.html'),
                (f'<button aria-label="{expression}">Voir</button>', '.html'),
                (f'<script type="application/ld+json">{{"description":"{expression}"}}</script>', '.html'),
                (f'<p>{expression.replace(" ", chr(0xa0))}</p>', '.html'),
                (f'<p>{expression.replace(" ", "&nbsp;")}</p>', '.html'),
                (f'Nos {expression}.', '.md'),
                (f'{expression.upper()}', '.md'),
            ]:
                with self.subTest(expression=expression, source=source):
                    self.assertEqual(agents_page_violations(source, suffix), [expression])

    def test_agents_guard_rejects_plurals(self):
        for source, expression in [
            ('<p>Nos agents autonomes</p>', 'agent autonome'), ('<p>Des collaborateurs IA</p>', 'collaborateur IA'),
            ('<p>Les employés IA</p>', 'employé IA'), ('<p>Vos agents comptables</p>', 'agent comptable'),
            ('<p>Des agents administratifs</p>', 'agent administratif'),
        ]:
            with self.subTest(source=source):
                self.assertEqual(agents_page_violations(source, '.html'), [expression])

    def test_agents_guard_allows_denied_autonomy_and_the_human_recruiter(self):
        for source in [
            '<p>Un agent IA ne travaille jamais en autonomie : il s’arrête dès qu’un cas sort de la règle.</p>',
            '<p>Il ne promet jamais l’autonomie ni un envoi sans validation.</p>',
            '<h1>Agents IA pour cabinet d’expertise comptable : chacun prépare un métier, vos collaborateurs valident.</h1>',
            '<p>Balthazar, agent IA comptable, prépare les écritures ; votre collaborateur les valide.</p>',
            '<p>La réponse à un candidat est envoyée par la personne qui recrute. Préparer un recrutement.</p>',
            '<p>Un accusé de réception prêt pour chaque candidat, que le recruteur envoie.</p>',
            '<p>Aude prépare la mécanique de vos missions d’audit ; le jugement reste au commissaire aux comptes.</p>',
            '<style>.agent-autonome { color: red; }</style><p>Agents IA</p>',
        ]:
            with self.subTest(source=source):
                self.assertEqual(agents_page_violations(source, '.html'), [])
        # Limite connue et assumée : seules les formes écrites dans la liste sont vues (« embaucher », pas « embauchez »).
        self.assertEqual(agents_page_violations('<p>Embauchez Balthazar.</p>', '.html'), [])

    def test_agents_surfaces_follow_the_sources(self):
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as directory:
            dist, source = Path(directory) / 'dist', Path(directory) / 'source'
            (dist / 'markdown').mkdir(parents=True)
            (dist / 'integrations.html').write_text('<p>Vos outils</p>', encoding='utf-8')
            # Sans source d'agents : /integrations seule.
            self.assertEqual(agents_surfaces(dist, source), ({'integrations.html'}, set()))
            # Le hub est écrit : sa page est exigée, et absente elle est dite manquante.
            (source / 'src' / 'pages' / 'agents-ia').mkdir(parents=True)
            (source / 'src' / 'pages' / 'agents-ia' / 'index.astro').write_text('', encoding='utf-8')
            self.assertEqual(agents_surfaces(dist, source)[0], {'integrations.html', 'agents-ia.html'})
            self.assertEqual(agents_surface_violations(dist, source)[2], ['agents-ia.html'])
            (dist / 'agents-ia.html').write_text('<h1>Agents IA</h1>', encoding='utf-8')
            self.assertEqual(agents_surface_violations(dist, source)[2], [])
            # Le gabarit de fiche est écrit sans fiche construite : la construction est en défaut.
            (source / 'src' / 'pages' / 'agents-ia' / '[metier].astro').write_text('', encoding='utf-8')
            with self.assertRaises(AssertionError):
                agents_surfaces(dist, source)
            (dist / 'agents-ia').mkdir()
            (dist / 'agents-ia' / 'comptabilite.html').write_text('<p>Balthazar est un agent autonome.</p>', encoding='utf-8')
            (dist / 'markdown' / 'agents-ia').mkdir()
            (dist / 'markdown' / 'agents-ia' / 'comptabilite.md').write_text('Balthazar, DPO IA.', encoding='utf-8')
            pages, markdown, missing, violations = agents_surface_violations(dist, source)
            self.assertEqual(pages, {'integrations.html', 'agents-ia.html', 'agents-ia/comptabilite.html'})
            self.assertEqual(markdown, {'markdown/agents-ia/comptabilite.md'})
            self.assertEqual(missing, [])
            self.assertEqual(violations, {'agents-ia/comptabilite.html': ['agent autonome'],
                                          'markdown/agents-ia/comptabilite.md': ['DPO IA']})

    def test_final_export_requires_llms_full_and_every_sitemap_markdown(self):
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'blog').mkdir()
            for name in ['a.html', 'b.html']:
                (root / 'blog' / name).write_text('<p>Article</p>', encoding='utf-8')
            # Comme le générateur : les urlset seuls, jamais l'index ; la route est décodée.
            (root / 'sitemap-index.xml').write_text(
                '<sitemapindex><sitemap><loc>https://memlia.fr/sitemap-pages.xml</loc></sitemap></sitemapindex>',
                encoding='utf-8')
            (root / 'sitemap-pages.xml').write_text(
                '<urlset><url><loc>https://memlia.fr/</loc></url>'
                '<url><loc>https://memlia.fr/automatisation/paie</loc></url>'
                '<url><loc>https://memlia.fr/glossaire/r%C3%A8gle</loc></url>'
                '<url><loc>https://memlia.fr/outils-comptables-gratuits/</loc></url></urlset>', encoding='utf-8')
            # Un nom hors du motif du générateur n'est pas lu, même s'il porte un urlset.
            (root / 'sitemap_ancien.xml').write_text(
                '<urlset><url><loc>https://memlia.fr/ancienne-page</loc></url></urlset>', encoding='utf-8')
            before = required_surfaces(root, final_export=False)
            after = required_surfaces(root, final_export=True)
            self.assertEqual(before, BASE_SURFACES | {'blog/a.html', 'blog/b.html'})
            self.assertEqual(after - before, {'llms-full.txt', 'markdown/index.md', 'markdown/automatisation/paie.md',
                                              'markdown/glossaire/règle.md', 'markdown/outils-comptables-gratuits.md'})

    def test_final_export_flag_is_one_or_absent(self):
        self.assertFalse(final_export_requested({}))
        self.assertFalse(final_export_requested({FINAL_EXPORT_FLAG: ''}))
        self.assertTrue(final_export_requested({FINAL_EXPORT_FLAG: '1'}))
        # Une valeur mal écrite ne doit jamais retirer l'export du contrôle sans bruit.
        for value in ['true', '0', 'oui', ' 1']:
            with self.subTest(value=value), self.assertRaises(AssertionError):
                final_export_requested({FINAL_EXPORT_FLAG: value})

    def test_final_export_refuses_a_sitemap_without_pages(self):
        from tempfile import TemporaryDirectory
        with TemporaryDirectory() as directory:
            root = Path(directory)
            (root / 'sitemap-index.xml').write_text('<sitemapindex></sitemapindex>', encoding='utf-8')
            with self.assertRaises(AssertionError):
                required_surfaces(root, final_export=True)

    def test_build_relocks_vocabulary_on_the_final_export(self):
        scripts = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['scripts']
        steps = [step.strip() for step in scripts['build:locked'].split('&&')]
        # Le dernier contrôle lit la sortie livrée : rien n'écrit plus dans dist après lui.
        self.assertEqual(steps[-1], 'npm run test:positioning:export')
        self.assertIn('node scripts/generate-agent-markdown.mjs', steps[:-1])
        relock = scripts['test:positioning:export']
        self.assertIn(f'{FINAL_EXPORT_FLAG}=1 ', relock)
        self.assertIn('-p test_positioning.py', relock)

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
        # Le passage est la mention du système de page (07/10/2026) : la classe `daily-note` le désigne.
        match = re.search(r'<p[^>]*class="(?:[^"]* )?daily-note(?: [^"]*)?"[^>]*>(.*?)</p>', html, re.S)
        self.assertIsNotNone(match)
        assert match is not None
        passage = match.group(1)
        text = ' '.join(' '.join(Text(passage).parts).split())
        self.assertEqual(text, 'Écrire la règle, c’est notre métier. Une règle écrite appartient au cabinet. '
                         'Nous en automatisons la part répétitive lorsque les formats, les accès et les cas couverts le permettent.')
        self.assertNotIn('une règle écrite s’automatise', html)

    def test_blog_hub_separates_published_methods_and_service(self):
        html = (DIST / 'blog.html').read_text()
        text = ' '.join(' '.join(Text(html).parts).split())
        for phrase in [
            'Nous publions des méthodes pour en écrire la règle',
            'La décision reste au cabinet.',
            'Vous avez lu la méthode ; vous pouvez aussi nous confier la tâche.',
            'Dans la série Cicatrices, Kevin Kitanga raconte à la première personne',
        ]:
            self.assertIn(phrase, text)
        self.assertIn('https://memlia.fr/blog', html)
        self.assertNotIn('Kevin Sauvaget', html)
        for slug in ['paie-dsn-cabinet-comptable', 'gestion-pieces-comptables', 'ia-cabinet-comptable']:
            self.assertIn(f'href="/blog/rubrique/{slug}"', html)
            self.assertTrue((DIST / 'blog' / 'rubrique' / f'{slug}.html').is_file())

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
