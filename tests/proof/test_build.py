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
PAGES_FIXES = ['404', 'blog', 'glossaire', 'index', 'mentions-legales', 'politique-de-confidentialite', 'ressources']
PREVIEW_ARTICLES = {slug for slug in os.environ.get('BLOG_PREVIEW_SLUGS', '').split(',') if slug}
PUBLIC_ARTICLES = {'controler-les-bulletins-de-paie-avant-la-dsn', 'suivre-la-production-sociale-dans-excel'}


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
        for slug in ['mentions-legales', 'politique-de-confidentialite']:
            doc = Document(DIST / f'{slug}.html')
            robots = next(m['content'] for m in doc.select('meta') if m.get('name') == 'robots')
            self.assertIn('noindex', robots)
            canonical = next(m['href'] for m in doc.select('link') if m.get('rel') == 'canonical')
            self.assertEqual(canonical, f'{SITE}/{slug}')

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
        attendues = {f'{SITE}/', f'{SITE}/blog', f'{SITE}/glossaire', f'{SITE}/ressources'} | {f'{SITE}/blog/{a.stem}' for a in published_articles}
        self.assertEqual(set(pages), attendues)
        self.assertNotIn(f'{SITE}/blog/rss.xml', pages)
        # lastmod d'un article publié = dateModified de son schéma (une seule source : le frontmatter).
        for article in published_articles:
            posting = next(n for g in jsonld(article) for n in g['@graph'] if n['@type'] == 'BlogPosting')
            self.assertEqual(pages[f'{SITE}/blog/{article.stem}'][:10], posting['dateModified'][:10])
        self.assertIn('Sitemap: https://memlia.fr/sitemap.xml', (DIST / 'robots.txt').read_text())

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
        self.assertEqual(len(list((DIST / 'images').glob('*.avif'))), 9)
        self.assertEqual(len(list((DIST / 'images').glob('*.webp'))), 12)
        self.assertEqual(len(list((DIST / 'proofs').glob('*.webp'))), 9)

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
        self.assertEqual([node['@type'] for node in graph], ['Organization', 'WebSite', 'Service', 'FAQPage'])
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
        self.assertEqual(types, ['Blog', 'BreadcrumbList', 'Person', 'Organization', 'WebSite'])
        blog = graph['@graph'][0]
        self.assertEqual(sorted(p['@id'] for p in blog['blogPost']), [f'{SITE}/blog/{a.stem}#article' for a in articles()])
        # Du plus récent au plus ancien, dans la liste HTML comme dans le graphe (égalité des dates tolérée).
        dates = {a.stem: next(n for g in jsonld(a) for n in g['@graph'] if n['@type'] == 'BlogPosting')['datePublished'] for a in articles()}
        self.assertEqual([dates[s] for s in listed], sorted((dates[s] for s in listed), reverse=True))
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
                self.assertTrue(metas['article:author'].startswith(f'{SITE}/blog#auteur-'))
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
                self.assertEqual([c['item'] for c in crumbs], [f'{SITE}/', f'{SITE}/blog', url])
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
