"""Oracle indépendant sur dist : aucun import du code Astro ou du manifeste produit."""
import hashlib
import json
import os
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / 'dist'
SITE = 'https://memlia.fr'
# Les cinq pages commerciales du site v2 ont rejoint le site le 16/09/2026.
PAGES_FIXES = ['404', 'a-propos', 'automatisation-cabinet-comptable', 'blog', 'contact', 'garanties',
               'glossaire', 'index', 'mentions-legales', 'methode', 'outils-comptables-gratuits',
               'politique-de-confidentialite']
PREVIEW_ARTICLES = {slug for slug in os.environ.get('BLOG_PREVIEW_SLUGS', '').split(',') if slug}
PUBLIC_ARTICLES = {'controler-les-bulletins-de-paie-avant-la-dsn', 'suivre-la-production-sociale-dans-excel',
                   'comprendre-les-comptes-rendus-metier-dsn',
                   # v3, 16/09/2026 : le pilier et le premier satellite publiés par la forge.
                   'automatiser-un-cabinet-comptable-la-carte-des-taches', 'automatiser-la-relance-des-pieces-clients',
                   # v3, 17/09/2026 : deuxième satellite, famille « Saisie, OCR et pré-comptabilité ».
                   'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
                   # v3, 19/09/2026 : première cicatrice, relue et validée par Kevin.
                   'pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils'}
BLOG_RUBRIQUES = {
    'controler-les-bulletins-de-paie-avant-la-dsn': 'paie-dsn-cabinet-comptable',
    'comprendre-les-comptes-rendus-metier-dsn': 'paie-dsn-cabinet-comptable',
    'suivre-la-production-sociale-dans-excel': 'paie-dsn-cabinet-comptable',
    'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier': 'gestion-pieces-comptables',
    'automatiser-la-relance-des-pieces-clients': 'gestion-pieces-comptables',
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


def jsonld(path):
    scripts = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', path.read_text())
    return [json.loads(s) for s in scripts]


def articles():
    return sorted((DIST / 'blog').glob('*.html'))


def is_preview_article(article):
    return article.stem in PREVIEW_ARTICLES and article.stem not in PUBLIC_ARTICLES


def pillar_slugs():
    """
    Slugs déclarés `format: pillar-page` dans la source. Le rendu n'expose ce format nulle
    part : la liste du blog l'applique en triant, sans l'écrire. L'oracle lit donc l'intention
    à la source et vérifie que le rendu lui obéit, comme il le fait déjà pour `famille:`.
    """
    trouves = set()
    for article in (ROOT / 'src/content/blog').glob('*.md'):
        texte = article.read_text(encoding='utf-8')
        if not texte.startswith('---'):
            continue
        frontmatter = texte.split('---', 2)[1]
        if re.search(r'^format:\s*[\'"]?pillar-page[\'"]?\s*$', frontmatter, re.M):
            trouves.add(article.stem)
    return trouves


class BuildProof(unittest.TestCase):
    def test_pages_one_h1_french(self):
        pages = sorted(DIST.glob('*.html'))
        self.assertEqual([p.stem for p in pages], PAGES_FIXES)
        self.assertEqual({article.stem for article in articles()}, PUBLIC_ARTICLES | PREVIEW_ARTICLES)
        for page in pages + articles():
            doc = Document(page)
            self.assertEqual(len(doc.select('h1')), 1, page.name)
            self.assertEqual(doc.select('html')[0]['lang'], 'fr')

    def test_legal_noindex_canonical(self):
        # Les deux pages de réponse du formulaire de contact suivent le même régime que les pages légales.
        for slug in ['mentions-legales', 'politique-de-confidentialite', 'contact/merci', 'contact/erreur',
                     'outils-comptables-gratuits/temoin-calcul-local']:
            doc = Document(DIST / f'{slug}.html')
            robots = next(m['content'] for m in doc.select('meta') if m.get('name') == 'robots')
            self.assertIn('noindex', robots)
            canonical = next(m['href'] for m in doc.select('link') if m.get('rel') == 'canonical')
            self.assertEqual(canonical, f'{SITE}/{slug}')
            self.assertEqual(len(doc.select('h1')), 1, slug)

    def test_contact_form_posts_to_the_function(self):
        # Le formulaire fonctionne sans JavaScript : méthode, action, champs requis, piège et consentement.
        html = (DIST / 'contact.html').read_text()
        form = re.search(r'<form[^>]*>', html).group(0)
        self.assertIn('method="post"', form)
        self.assertIn('action="/api/contact"', form)
        for name in ['nom', 'cabinet', 'courriel', 'message', 'consentement', 'site_web']:
            self.assertRegex(html, rf'name="{name}"', name)
        self.assertNotIn('type="file"', html)
        self.assertNotIn('enctype', form)
        self.assertEqual(len(re.findall(r'<form\b', html)), 1)
        self.assertEqual(len(re.findall(r'<button[^>]*type="submit"', html)), 1)

    def test_sitemap_complete_no_legal(self):
        index = ET.parse(DIST / 'sitemap.xml')
        ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        links = [el.text for el in index.findall('.//s:loc', ns)]
        self.assertGreater(len(links), 0)
        pages = {}
        for link in links:
            self.assertIsInstance(link, str)
            if link is None: self.fail('URL sitemap vide')
            subtree = ET.parse(DIST / urlsplit(link).path.lstrip('/'))
            for url in subtree.findall('.//s:url', ns):
                pages[url.find('s:loc', ns).text] = url.find('s:lastmod', ns).text
        published_articles = [a for a in articles() if not is_preview_article(a)]
        # Les pages légales et les candidats service noindex restent hors sitemap. Une page de
        # service n'y entre qu'après le passage de la forge au statut `publie`.
        services_publies = set()
        for service in (ROOT / 'src/content/services').glob('*.md'):
            if re.search(r'^status:\s*publie\s*$', service.read_text(), re.MULTILINE):
                services_publies.add(f'{SITE}/automatisation/{service.stem}')
        attendues = {f'{SITE}/', f'{SITE}/blog', f'{SITE}/glossaire',
                     f'{SITE}/automatisation-cabinet-comptable', f'{SITE}/methode', f'{SITE}/garanties',
                     f'{SITE}/a-propos', f'{SITE}/contact', f'{SITE}/outils-comptables-gratuits',
                     f'{SITE}/outils-comptables-gratuits/calculateur-marge-commerciale',
                     f'{SITE}/outils-comptables-gratuits/calculateur-date-echeance-facture',
                     f'{SITE}/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit'} | {
                         f'{SITE}/blog/rubrique/{slug}' for slug in set(BLOG_RUBRIQUES.values())
                     } | {f'{SITE}/blog/{a.stem}' for a in published_articles} | services_publies
        self.assertEqual(set(pages), attendues)
        self.assertNotIn(f'{SITE}/blog/rss.xml', pages)
        self.assertNotIn(f'{SITE}/outils-comptables-gratuits/temoin-calcul-local', pages)
        # lastmod d'un article publié = dateModified de son schéma (une seule source : le frontmatter).
        for article in published_articles:
            posting = next(n for g in jsonld(article) for n in g['@graph'] if n['@type'] == 'BlogPosting')
            self.assertEqual(pages[f'{SITE}/blog/{article.stem}'][:10], posting['dateModified'][:10])
        # Les pages non éditoriales datent du dernier commit qui a touché ce qui les rend : une
        # date figée à la main ne bouge pas quand le site change, et Google ne relit pas un
        # sitemap qui prétend n'avoir pas bougé (Search Console, 16/09/2026 : 4 pages découvertes
        # alors que douze étaient en ligne).
        registre = json.loads((ROOT / 'src/data/pages-lastmod.json').read_text())['pages']
        pages_non_editoriales = {page for page in attendues if not urlsplit(page).path.startswith('/blog/')}
        for page in pages_non_editoriales:
            route = urlsplit(page).path.rstrip('/') or '/'
            self.assertIn(route, registre, route)
            # À la seconde : une date au jour annonce minuit, plus ancien que la dernière
            # lecture de Google le même jour, et le sitemap passe pour inchangé.
            self.assertEqual(pages[page][:19], registre[route]['lastmod'][:19], route)
            self.assertRegex(registre[route]['lastmod'], r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}')
            fichier = DIST / ('index.html' if route == '/' else f'{route.lstrip("/")}.html')
            self.assertEqual(hashlib.sha256(fichier.read_bytes()).hexdigest(), registre[route]['sha256'],
                             f'{route} : rendu modifié sans que sa date suive (npm run lastmod:sync)')
        self.assertIn('Sitemap: https://memlia.fr/sitemap.xml', (DIST / 'robots.txt').read_text())

    def test_outil_temoin_csp_and_schema_are_fail_closed(self):
        slug = 'outils-comptables-gratuits/temoin-calcul-local'
        path = DIST / f'{slug}.html'
        doc = Document(path)
        csp = next(m['content'] for m in doc.select('meta') if m.get('http-equiv') == 'Content-Security-Policy')
        self.assertIn("connect-src 'none'", csp)
        headers = (DIST / '_headers').read_text()
        self.assertIn('/outils-comptables-gratuits/*', headers)
        self.assertIn("connect-src 'none'", headers)
        graph = jsonld(path)[0]['@graph']
        self.assertEqual([node['@type'] for node in graph], ['WebPage', 'WebApplication', 'BreadcrumbList'])
        self.assertNotIn('SoftwareApplication', path.read_text())

    def test_outils_disponibles_ont_trois_liens_entrants_contextuels(self):
        outils = {
            '/outils-comptables-gratuits/calculateur-marge-commerciale',
            '/outils-comptables-gratuits/calculateur-date-echeance-facture',
            '/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit',
        }
        sources = {}
        for page in DIST.rglob('*.html'):
            route = '/' + str(page.relative_to(DIST)).removesuffix('.html')
            if route == '/index': route = '/'
            hrefs = {attrs.get('href') for attrs in Document(page).select('a')}
            for outil in outils:
                if outil in hrefs and route != outil:
                    sources.setdefault(outil, set()).add(route)
        for outil in outils:
            self.assertGreaterEqual(len(sources.get(outil, set())), 3, (outil, sources.get(outil)))
            self.assertIn('/outils-comptables-gratuits', sources[outil])
            self.assertIn('/methode', sources[outil], 'la méthode est la ressource exacte qui rejoue le geste')

    def test_aucune_mention_de_processus_rendue(self):
        """Le lecteur ne lit pas notre chaîne éditoriale.

        Kevin l'a demandé deux fois : les encarts de statut, les dates de relecture et les
        étiquettes de revue n'ont rien à faire dans une page publique. Les sources citées,
        elles, restent — ce sont des références, pas du processus. Ce contrôle balaie le
        contenu visible de chaque page pour que la consigne ne dépende pas de la mémoire.
        """
        interdits = ['Revue métier', 'Sources relues', 'Éditoriale Memlia', 'Requise avant publication',
                     'Contenu non attesté', 'non attesté', 'fact-check', 'a-t-il été vérifié',
                     'revue métier IA', 'statutEditorial']
        fautes = []
        for page in sorted(DIST.rglob('*.html')):
            html = re.sub(r'(?is)<(script|style)\b.*?</\1>', ' ', page.read_text())
            corps = re.search(r'(?is)<main\b[^>]*>(.*?)</main>', html)
            visible = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', corps.group(1) if corps else ''))
            fautes += [f'{page.name} : « {mot} »' for mot in interdits if mot in visible]
        self.assertEqual(fautes, [], 'mention de processus rendue au lecteur')

    def test_asset_and_srcset_targets(self):
        seen = set()
        for page in DIST.rglob('*.html'):
            for tag, attrs in Document(page).tags:
                targets = []
                if tag in ['img', 'script', 'source', 'video', 'track'] and attrs.get('src'): targets.append(attrs['src'])
                if tag == 'video' and attrs.get('poster'): targets.append(attrs['poster'])
                if attrs.get('srcset'): targets.extend(part.strip().split()[0] for part in attrs['srcset'].split(','))
                if tag == 'link' and attrs.get('rel') in ['icon', 'preload', 'apple-touch-icon', 'alternate']: targets.append(attrs['href'])
                for target in targets:
                    if target.startswith('/'):
                        self.assertTrue((DIST / target.lstrip('/')).is_file(), f'{page.name}: {target}')
                        seen.add(target)
        # M4-R3 : 9 preuves originales ; les dérivés Blog ne sont chargés que pour le candidat explicitement rendu.
        self.assertTrue({f'/proofs/{name}.webp' for name in ['01-flux', '02-repetition', '03-controle', '04-observer', '05-cadrer', '06-eprouver', '07-livrer', '08-integration', '09-garanties']} <= seen)
        self.assertGreaterEqual(len(seen), 24 if PREVIEW_ARTICLES else 18)

    def test_placeholders_and_briefs(self):
        briefs = ROOT / 'public/images'
        self.assertEqual(len(list(briefs.glob('brief-img-1[6-9]-*.md'))) + len(list(briefs.glob('brief-img-2[0-4]-*.md'))), 9)
        self.assertEqual(len(list((DIST / 'images').glob('brief-*.md'))), 0)
        # Trois couvertures publiées : 3 largeurs x 2 formats chacune, plus une image
        # sociale webp par article (imageOg, exigée par le contrat de la collection).
        # Les pages commerciales n'ajoutent rien ici : leur visuel de tête est une preuve
        # fonctionnelle rendue sous public/proofs/v2, avec son image sociale sous og/.
        publies = [a for a in articles() if not is_preview_article(a)]
        self.assertEqual(len(list((DIST / 'images').glob('*.avif'))), 3 * len(publies))
        self.assertEqual(len(list((DIST / 'images').glob('*.webp'))), 4 * len(publies))
        self.assertEqual(len(list((DIST / 'proofs').glob('*.webp'))), 9)
        # Série v2 : treize preuves de section, cinq preuves de tête, cinq scènes propres
        # aux pages de service et quatre scènes propres aux outils. Les neuf images sociales
        # correspondantes restent sous og/.
        self.assertEqual(len(list((DIST / 'proofs/v2').glob('*.webp'))), 27)
        self.assertEqual(
            sorted(p.name for p in (DIST / 'proofs/v2/og').glob('*.webp')),
            sorted([
                '14-hero-service.webp', '15-hero-methode.webp', '16-hero-garanties.webp',
                '17-hero-apropos.webp', '18-hero-contact.webp', '24-outils-hub.webp',
                '25-outil-marge.webp', '26-outil-echeance.webp', '27-outil-rapprochement.webp',
            ]),
        )

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
        llms = (DIST / 'llms.txt').read_text()
        anchors = re.findall(r'https://memlia.fr/#([a-z0-9-]+)', llms)
        self.assertGreaterEqual(len(anchors), 4)
        self.assertEqual(set(anchors) - ids, set())
        # Chaque article publié est déclaré dans llms.txt, et rien d'autre ne l'est.
        declares = set(re.findall(r'https://memlia.fr/blog/([a-z0-9-]+)\)', llms))
        self.assertEqual(declares, {a.stem for a in articles()})

    def test_structured_data_no_unreleased_features(self):
        html = (DIST / 'index.html').read_text()
        scripts = re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html)
        self.assertEqual(len(scripts), 1)
        graph = json.loads(scripts[0])['@graph']
        self.assertEqual([node['@type'] for node in graph], ['Organization', 'WebSite', 'WebPage', 'Service', 'FAQPage'])
        service = next(node for node in graph if node['@type'] == 'Service')
        self.assertNotIn('featureList', service)
        self.assertNotIn('offers', service)
        self.assertEqual(len(graph[-1]['mainEntity']), 11)
        self.assertNotIn('aggregateRating', scripts[0])

    def test_blog_index_lists_every_article(self):
        doc = Document(DIST / 'blog.html')
        listed = re.findall(r'data-article="([^"]+)"', (DIST / 'blog.html').read_text())
        self.assertEqual(sorted(listed), [a.stem for a in articles()])
        canonical = next(m['href'] for m in doc.select('link') if m.get('rel') == 'canonical')
        self.assertEqual(canonical, f'{SITE}/blog')
        robots = next(m['content'] for m in doc.select('meta') if m.get('name') == 'robots')
        self.assertNotIn('noindex', robots)
        rss = [l for l in doc.select('link') if l.get('rel') == 'alternate']
        self.assertEqual([l['href'] for l in rss], [] if PREVIEW_ARTICLES else ['/blog/rss.xml'])
        self.assertEqual(any(attrs.get('id') == 'auteur-kevin' for _, attrs in doc.tags), bool(articles()))
        (graph,) = jsonld(DIST / 'blog.html')
        types = [n['@type'] for n in graph['@graph']]
        # Le contrat de schema attend une CollectionPage ; « Blog » seul ne fournissait
        # aucun noeud de page a cette route.
        self.assertEqual(types, [['CollectionPage', 'Blog'], 'BreadcrumbList', 'Person', 'Organization', 'WebSite'])
        blog = graph['@graph'][0]
        self.assertEqual(sorted(p['@id'] for p in blog['blogPost']), [f'{SITE}/blog/{a.stem}#article' for a in articles()])
        # Règle réelle depuis la v3 (16/09/2026, commit d992cec) : le pilier ouvre la liste quand
        # il est publié, puis les autres du plus récent au plus ancien, dans la liste HTML comme
        # dans le graphe (égalité des dates tolérée). L'assertion précédente n'exigeait qu'une
        # décroissance stricte, sans exception : elle est restée verte par coïncidence tant que le
        # pilier était l'article le plus récent, et le premier satellite daté après lui l'a cassée.
        dates = {a.stem: next(n for g in jsonld(a) for n in g['@graph'] if n['@type'] == 'BlogPosting')['datePublished'] for a in articles()}
        piliers = [s for s in listed if s in pillar_slugs()]
        self.assertLessEqual(len(piliers), 1, 'un seul article peut porter le format pillar-page')
        if piliers:
            self.assertEqual(listed[0], piliers[0], 'le pilier doit ouvrir la liste du blog')
        suite = [s for s in listed if s not in piliers]
        self.assertEqual([dates[s] for s in suite], sorted((dates[s] for s in suite), reverse=True))
        self.assertEqual([p['@id'] for p in blog['blogPost']], [f'{SITE}/blog/{s}#article' for s in listed])

    def test_blog_articles_schema_and_head(self):
        for article in articles():
            with self.subTest(article=article.name):
                doc = Document(article)
                url = f'{SITE}/blog/{article.stem}'
                canonical = next(m['href'] for m in doc.select('link') if m.get('rel') == 'canonical')
                self.assertEqual(canonical, url)
                metas = {m.get('property') or m.get('name'): m['content'] for m in doc.select('meta') if m.get('content')}
                self.assertEqual(metas['og:type'], 'article')
                self.assertEqual(metas['og:url'], url)
                if is_preview_article(article):
                    self.assertIn('noindex', metas['robots'])
                else:
                    self.assertNotIn('noindex', metas['robots'])
                self.assertRegex(metas['article:published_time'], r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$')
                # Une seule identite d'auteur sur tout le site : la balise Open Graph doit
                # designer exactement le noeud Person du graphe, pas une fiche de liste.
                personne = next(n for g in jsonld(article) for n in g['@graph'] if n['@type'] == 'Person')
                self.assertEqual(metas['article:author'], personne['@id'])
                self.assertEqual(personne['@id'], f'{SITE}/a-propos#kevin-kitanga')
                self.assertLessEqual(len(metas['description']), 160)
                titre = re.search(r'<title>(.*?)</title>', article.read_text()).group(1)
                self.assertLessEqual(len(titre), 70, titre)
                self.assertLessEqual(len(metas['og:title']), 70, metas['og:title'])
                (graph,) = jsonld(article)
                nodes = {n['@type']: n for n in graph['@graph']}
                self.assertEqual(set(nodes), {'BlogPosting', 'BreadcrumbList', 'Person', 'Organization', 'WebSite'})
                self.assertEqual(nodes['WebSite']['@id'], f'{SITE}/#website')
                posting = nodes['BlogPosting']
                self.assertEqual(posting['@id'], f'{url}#article')
                self.assertEqual(posting['mainEntityOfPage']['@id'], url)
                self.assertEqual(posting['datePublished'], metas['article:published_time'])
                self.assertGreaterEqual(posting['dateModified'], posting['datePublished'])
                self.assertEqual(posting['author']['@id'], nodes['Person']['@id'])
                self.assertEqual(nodes['Person']['name'], 'Kevin Kitanga')
                self.assertEqual(posting['publisher']['@id'], f'{SITE}/#organization')
                image = posting['image']['url']
                self.assertTrue(image.startswith(f'{SITE}/images/'))
                self.assertTrue((DIST / image[len(SITE) + 1:]).is_file(), image)
                self.assertGreaterEqual(posting['image']['width'], 1200)
                self.assertGreaterEqual(posting['wordCount'], 1500)
                # Le compte de mots déclaré correspond au corps réellement rendu (±10 %).
                body = re.search(r'<div class="article-corps[^"]*"[^>]*>(.*?)<section class="article-sources', article.read_text(), re.S).group(1)
                mots = len([m for m in re.sub(r'<[^>]+>', ' ', body).split() if re.search(r'\w', m)])
                self.assertLess(abs(mots - posting['wordCount']) / mots, 0.10, (mots, posting['wordCount']))
                crumbs = nodes['BreadcrumbList']['itemListElement']
                attendus = [f'{SITE}/', f'{SITE}/blog']
                if article.stem in BLOG_RUBRIQUES:
                    attendus.append(f'{SITE}/blog/rubrique/{BLOG_RUBRIQUES[article.stem]}')
                attendus.append(url)
                self.assertEqual([c['item'] for c in crumbs], attendus)
                self.assertNotIn('aggregateRating', article.read_text())
                self.assertIn('Sources consultées', article.read_text())
                self.assertGreaterEqual(article.read_text().count('rel="noopener"'), 3)

    def test_rss_feed_matches_articles(self):
        feed = ET.parse(DIST / 'blog' / 'rss.xml').getroot()
        channel = feed.find('channel')
        self.assertEqual(channel.find('link').text, f'{SITE}/blog')
        self.assertEqual(channel.find('language').text, 'fr-fr')
        self.assertEqual(channel.find('{http://www.w3.org/2005/Atom}link').get('href'), f'{SITE}/blog/rss.xml')
        items = channel.findall('item')
        published_articles = [a for a in articles() if not is_preview_article(a)]
        self.assertEqual(sorted(i.find('link').text for i in items), [f'{SITE}/blog/{a.stem}' for a in published_articles])
        # Même ordre que la partie publiée de la liste HTML ; un candidat preview reste exclu du flux.
        listed = re.findall(r'data-article="([^"]+)"', (DIST / 'blog.html').read_text())
        listed_published = [slug for slug in listed if slug not in PREVIEW_ARTICLES]
        self.assertEqual([i.find('link').text for i in items], [f'{SITE}/blog/{s}' for s in listed_published])
        for item in items:
            self.assertTrue(item.find('title').text)
            self.assertTrue(item.find('description').text)
            self.assertTrue(item.find('pubDate').text)
            self.assertEqual(item.find('{http://purl.org/dc/elements/1.1/}creator').text, 'Kevin Kitanga')


if __name__ == '__main__':
    print('Sujet SHA256 dist/index.html:', hashlib.sha256((DIST / 'index.html').read_bytes()).hexdigest(), flush=True)
    unittest.main(verbosity=2)

class FamillesDesArticles(unittest.TestCase):
    """La famille de chaque article du pipeline existe dans la taxonomie (src/data/familles.ts), source unique."""

    def test_familles_des_articles_pipeline(self):
        taxonomie = (ROOT / 'src/data/familles.ts').read_text(encoding='utf-8')
        ids = set(re.findall(r"f\('([a-z0-9-]+)'", taxonomie))
        self.assertGreaterEqual(len(ids), 60)
        verifies = 0
        for article in (ROOT / 'src/content/blog').glob('*.md'):
            frontmatter = article.read_text(encoding='utf-8').split('---', 2)[1]
            famille = re.search(r'^famille:\s*([a-z0-9-]+)\s*$', frontmatter, re.M)
            if famille is None:
                continue
            self.assertIn(famille.group(1), ids, article.name)
            verifies += 1
        # Le compte affiché dit ce que le test a réellement contrôlé : zéro article pipeline n'est pas un succès silencieux.
        print(f'familles vérifiées : {verifies} article(s) pipeline')

