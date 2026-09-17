"""Contrat M4-R3 : médias livrés, non de simples marqueurs dans les sources."""
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

    def test_r9_is_the_only_exported_video_generation(self):
        self.assertEqual(sorted(p.name for p in (DIST / 'media').iterdir()), ['r9'])
        self.assertEqual(
            sorted(p.name for p in (DIST / 'media/r9').iterdir() if p.is_file()),
            ['explainer-hero-45s.mp4', 'explainer.vtt', 'hero-poster-1200.webp', 'hero-poster.webp'],
        )
        videos = [video for path in DIST.rglob('*.html') for video in Document(path).select('video')]
        self.assertEqual(len(videos), 1)
        self.assertEqual(videos[0]['src'], '/media/r9/explainer-hero-45s.mp4')

    def test_hero_has_accessible_r9_player(self):
        doc = Document(DIST / 'index.html')
        videos = doc.select('video')
        self.assertEqual(len(videos), 1)
        video = videos[0]
        for attr in ['playsinline', 'muted', 'loop']:
            self.assertIn(attr, video)
        self.assertNotIn('controls', video)
        self.assertIn('data-video', video)
        self.assertEqual(video.get('tabindex'), '0')
        self.assertEqual(video['preload'], 'metadata')
        self.assertTrue(video['aria-label'])
        self.assertEqual(video['poster'], '/media/r9/hero-poster-1200.webp')
        self.assertEqual(video['src'], '/media/r9/explainer-hero-45s.mp4')
        self.assertEqual(hashlib.sha256((DIST / video['src'].lstrip('/')).read_bytes()).hexdigest(), '4c435fd18d104c213764dfc65fc65d090ed76442e313bc429df3a8243961a01a')
        tracks = doc.select('track')
        self.assertEqual(len(tracks), 1)
        self.assertEqual(tracks[0]['kind'], 'subtitles')
        self.assertEqual(tracks[0]['srclang'], 'fr')
        vtt = (DIST / tracks[0]['src'].lstrip('/')).read_text()
        self.assertTrue(vtt.startswith('WEBVTT\n'))
        self.assertEqual(vtt.count(' --> '), 20)
        html = (DIST / 'index.html').read_text()
        self.assertNotIn('aria-describedby', video)
        players = [attrs for _, attrs in doc.tags if 'data-video-player' in attrs]
        self.assertEqual(len(players), 1)
        sound_buttons = [attrs for tag, attrs in doc.tags if tag == 'button' and 'data-video-sound' in attrs]
        self.assertEqual(len(sound_buttons), 1)
        self.assertRegex(html, r'<button\b[^>]*data-video-sound[^>]*>[\s\S]*?<span[^>]*>Activer le son</span>[\s\S]*?</button>')
        self.assertRegex(html, r'<div\b[^>]*data-video-overlay[^>]*>\s*<button\b[^>]*data-video-sound[^>]*>[\s\S]*?</button>\s*</div>')
        self.assertNotIn('La vidéo redémarrera depuis le début.', html)
        self.assertNotIn('hero-video-invitation', html)
        self.assertIn('Votre navigateur ne peut pas lancer le lecteur interactif.', html)
        statuses = [attrs for tag, attrs in doc.tags if tag == 'div' and 'data-video-status' in attrs and attrs.get('role') == 'status']
        self.assertEqual(len(statuses), 1)
        for removed in ['Lire la transcription', 'Lire le détail', 'repere-lien', 'Illustration de fonctionnement sur données fictives, pas une capture produit.', 'hero-media-help', 'hero-transcript', 'Agrandir l’illustration', 'transcription ci-dessous']:
            self.assertNotIn(removed, html)
        for target in ['methode', 'faq-ia-decide', 'faq-donnees-reelles']:
            self.assertEqual(html.count(f'id="{target}"'), 1)

    def test_proof_figures_contain_only_static_images(self):
        html = (DIST / 'index.html').read_text()
        figures = re.findall(r'<figure\b[^>]*data-proof="[^"]+"[^>]*>(.*?)</figure>', html, re.S)
        self.assertEqual(len(figures), 9)
        for figure in figures:
            self.assertRegex(figure.strip(), r'^<img\b[^>]+>$')
            self.assertNotRegex(figure, r'\s(?:tabindex|role|on\w+)\s*=')
        self.assertNotRegex(html, r'<dialog\b|role="dialog"|proof-zoom')

    def test_nine_functional_proofs_replace_all_legacy_images(self):
        doc = Document(DIST / 'index.html')
        images = doc.select('img')
        proof_images = [i for i in images if i.get('src', '').startswith('/proofs/')]
        self.assertEqual(sorted(i['src'] for i in proof_images), [f'/proofs/{p}.webp' for p in PROOFS])
        for image in proof_images:
            self.assertGreater(len(image['alt']), 50)
            self.assertEqual((image['width'], image['height']), ('1600', '900'))
            self.assertTrue((DIST / image['src'].lstrip('/')).is_file())
        self.assertFalse(any(i.get('src', '').startswith('/images/img-') for i in images))
        self.assertFalse(any(re.match(r'img-(0[1-9]|1[0-9]|2[0-2])-', p.name) for p in (DIST / 'images').iterdir()))

    def test_tagline_is_preserved_exactly(self):
        self.assertIn('Le savoir-faire de votre cabinet, écrit et automatisé. La décision reste à vous.', (DIST / 'index.html').read_text())

    def test_hero_poster_is_prioritized_before_video_metadata(self):
        links = Document(DIST / 'index.html').select('link')
        poster = [l for l in links if l.get('href') == '/media/r9/hero-poster-1200.webp']
        self.assertEqual(len(poster), 1)
        self.assertEqual(poster[0].get('rel'), 'preload')
        self.assertEqual(poster[0].get('as'), 'image')
        self.assertEqual(poster[0].get('fetchpriority'), 'high')
