import json
import os
import re
import unittest
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / 'dist'
SITE = 'https://memlia.fr'


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.canonicals = []
        self.h1 = 0
        self.resources = 0
        self.scripts = []
        self._json_ld = False
        self._json_parts = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == 'a' and values.get('href'):
            self.links.append(values['href'])
        if tag == 'link' and values.get('rel') == 'canonical':
            self.canonicals.append(values.get('href'))
        if tag == 'h1':
            self.h1 += 1
        if values.get('data-resource-id'):
            self.resources += 1
        if tag == 'script' and values.get('type') == 'application/ld+json':
            self._json_ld = True
            self._json_parts = []

    def handle_data(self, data):
        if self._json_ld:
            self._json_parts.append(data)

    def handle_endtag(self, tag):
        if tag == 'script' and self._json_ld:
            self.scripts.append(json.loads(''.join(self._json_parts)))
            self._json_ld = False


def published_blog_slugs():
    slugs = []
    for article in sorted((ROOT / 'src/content/blog').glob('*.md')):
        frontmatter = article.read_text(encoding='utf-8').split('---', 2)[1]
        if re.search(r'^brouillon:\s*false\s*$', frontmatter, re.MULTILINE):
            slugs.append(article.stem)
    return slugs


def visible_blog_slugs():
    preview = {slug for slug in os.environ.get('BLOG_PREVIEW_SLUGS', '').split(',') if slug}
    return sorted(set(published_blog_slugs()) | preview)


def sitemap_urls():
    namespace = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    index = ET.parse(DIST / 'sitemap-index.xml')
    urls = set()
    for loc in index.findall('.//s:loc', namespace):
        if loc.text is None:
            raise AssertionError('URL de sous-sitemap absente')
        subtree = DIST / Path(loc.text).name
        for page in ET.parse(subtree).findall('.//s:loc', namespace):
            urls.add(page.text)
    return urls


class ResourceProof(unittest.TestCase):
    def test_build_audits_resources_after_generating_the_site(self):
        scripts = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))['scripts']
        build_steps = [step.strip() for step in scripts['build'].split('&&')]

        self.assertLess(build_steps.index('npm run build:site'), build_steps.index('npm run resource:audit:qa'))

    def test_conditional_indexes_and_sitemap_fail_closed(self):
        self.assertFalse((DIST / 'guides.html').exists())
        self.assertFalse((DIST / 'modeles.html').exists())
        self.assertFalse((DIST / 'guides').exists())
        self.assertFalse((DIST / 'modeles').exists())

        urls = sitemap_urls()
        self.assertNotIn(f'{SITE}/ressources', urls)
        self.assertIn(f'{SITE}/glossaire', urls)
        self.assertNotIn(f'{SITE}/guides', urls)
        self.assertNotIn(f'{SITE}/modeles', urls)
        self.assertFalse(any('/roles/' in url or '/tags/' in url or '?' in url for url in urls))

    def test_historical_rss_remains_blog_only(self):
        channel = ET.parse(DIST / 'blog/rss.xml')
        links = [link for item in channel.findall('./channel/item') if (link := item.findtext('link')) is not None]
        expected = {f'{SITE}/blog/{slug}' for slug in published_blog_slugs()}
        self.assertEqual(set(links), expected)
        self.assertFalse(any('/ressources' in link or '/glossaire' in link for link in links))


if __name__ == '__main__':
    unittest.main()
