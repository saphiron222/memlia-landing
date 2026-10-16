"""Direction figurines A validée le 15/10 : médias réels, archives conservées."""
import hashlib
import re
import unittest
from pathlib import Path
from test_build import DIST, Document

PROOFS = ['01-flux', '02-repetition', '03-controle', '04-observer', '05-cadrer', '06-eprouver', '07-livrer', '08-integration', '09-garanties']


class IntegratedMediaProof(unittest.TestCase):
    def test_historical_generations_are_not_exported(self):
        # R7 (cartouche) et R8 (mention d'épreuve) restent dans le projet vidéo, jamais dans le site.
        for generation in ['r7', 'r8']:
            dist_dir = DIST / f'media/{generation}'
            self.assertEqual(sorted(p.relative_to(DIST).as_posix() for p in dist_dir.rglob('*') if p.is_file()), [], generation)

    def test_historical_generations_are_not_referenced_by_any_exported_surface(self):
        references = []
        for path in DIST.rglob('*'):
            if path.is_file() and path.suffix in {'.html', '.css', '.js', '.json', '.xml', '.txt'}:
                text = path.read_text(errors='replace').lower()
                if 'media/r7/' in text or 'media/r8/' in text or 'animatique' in text:
                    references.append(path.relative_to(DIST).as_posix())
        self.assertEqual(references, [])

    def test_video_archives_are_preserved_without_reintroducing_players(self):
        self.assertEqual(sorted(p.name for p in (DIST / 'media').iterdir()), ['cac-r4', 'r9'])
        self.assertEqual(sorted(p.name for p in (DIST / 'media/r9').iterdir() if p.is_file()),
            ['explainer-hero-45s-mobile.mp4', 'explainer-hero-45s.mp4', 'explainer.vtt', 'hero-poster-1200.webp', 'hero-poster.webp'])
        for page in ['index.html', 'commissaires-aux-comptes.html']:
            self.assertEqual(Document(DIST / page).select('video'), [], page)

    def test_six_approved_scenes_match_their_production_manifest(self):
        import json
        manifest = json.loads((DIST.parent / 'docs/qa/coherence-figurines/production-images.json').read_text())
        self.assertEqual({e['id'] for e in manifest['entries']}, {'accueil','cac','methode','apropos','garanties','contact'})
        for entry in manifest['entries']:
            page = DIST / ('index.html' if entry['route'] == '/' else entry['route'].strip('/') + '.html')
            html = page.read_text()
            scenes = [a for tag, a in Document(page).tags if 'data-scene' in a]
            self.assertTrue(any(a['data-scene'] == entry['id'] for a in scenes), entry['id'])
            for file in entry['files']:
                target = DIST / file['target'].removeprefix('public/')
                self.assertEqual(hashlib.sha256(target.read_bytes()).hexdigest(), file['sha256'])
            images = [a for a in Document(page).select('img') if a.get('src') == '/illustrations/figurines/' + entry['id'] + '-1200.webp']
            self.assertTrue(images, entry['id'])
            for image in images:
                self.assertGreater(len(image.get('alt', '')), 40)
                self.assertEqual((image['width'], image['height']), ('1200','800'))
                self.assertIn('-640.webp 640w', image['srcset'])
                self.assertEqual(image.get('decoding'), 'async')
            self.assertNotRegex(html, r'<dialog\b')
            self.assertNotRegex(html, r'<a\b[^>]*href="/illustrations/[^"]+\.(?:webp|avif)"')

    def test_catalogue_figurines_replace_homepage_mockups(self):
        for name in ['index', 'commissaires-aux-comptes']:
            doc = Document(DIST / (name + '.html'))
            images = doc.select('img')
            self.assertFalse(any(i.get('src','').startswith('/proofs/') for i in images), name)
            self.assertGreaterEqual(sum(i.get('src','').startswith(('/robots/', '/illustrations/figurines/')) for i in images), 3)
            for image in images:
                self.assertTrue((DIST / image['src'].lstrip('/')).is_file())
                self.assertTrue(image.get('width') and image.get('height'))

    def test_tagline_is_preserved_exactly(self):
        self.assertIn('Des services IA adaptés à votre cabinet, déployés et maintenus.', (DIST / 'index.html').read_text())

    def test_centered_hero_keeps_the_scene_in_the_following_content(self):
        html = (DIST / 'index.html').read_text()
        hero = re.search(r'<section class="hero-editorial"[^>]*>(.*?)</section>', html, re.S)
        self.assertIsNotNone(hero)
        self.assertNotIn('<img', hero.group(1))
        self.assertIn('data-scene="accueil"', html)
        self.assertLess(html.index('hero-editorial'), html.index('data-scene="accueil"'))
