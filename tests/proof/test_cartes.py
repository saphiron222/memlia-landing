"""Contrat du 07/10/2026 (Kevin) : aucune image ne s'agrandit, un seul dessin de carte.

1. « On ne doit pas pouvoir agrandir une image, nulle part sur le site » : aucune page construite
   ne porte de dialogue, de commande « Agrandir » ni de lien vers un fichier image.
2. « Toutes les cartes du site pareilles » : la carte, sa grille et la bande à cellules sont
   dessinées une seule fois dans global.css ; un composant peut placer une grille (marges,
   flex), jamais redessiner la carte. Les anciens motifs locaux ne reviennent pas.
"""
from pathlib import Path
import re
import unittest

from test_build import DIST

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / 'src'
LIEN_IMAGE = re.compile(r'<a\b[^>]*\bhref="[^"]+\.(?:webp|avif|png|jpe?g|gif|svg)(?:[?#][^"]*)?"', re.I)
COMMANDE_AGRANDIR = re.compile(r'>\s*Agrandir\b')
CLASSES_CARTE = re.compile(r'\.(?:cartes?|carte-[a-z-]+|cellule|bande)(?![\w-])')
DESSIN = re.compile(r'(?:^|;)\s*(?:background(?:-color|-image)?|border(?:-[a-z-]+)?|box-shadow|padding(?:-[a-z-]+)?|color|font(?:-[a-z-]+)?|outline(?:-[a-z-]+)?)\s*:')
MOTIFS_ABANDONNES = ['pv-carte', 'pv-cartes', 'pv-carte-marque', 'pv-carte-corps', 'pv-cellule', 'pv-bande', 'pv-bande-liste',
                     'pv-renvoi', 'pv-renvois', 'use-card', 'use-mark', 'use-copy', 'orientation-item', 'outil-garantie-icon',
                     'service-principle-icon', 'proof-detail']
# Le blog garde son propre dessin (Kevin, 07/10/2026 : « les blogs pas besoin de toucher »).
SOURCES_BLOG = {'src/pages/blog.astro', 'src/layouts/Article.astro'}


def est_source_blog(path):
    relatif = path.relative_to(ROOT).as_posix()
    return relatif in SOURCES_BLOG or relatif.startswith('src/pages/blog/')


def est_page_blog(page):
    relatif = page.relative_to(DIST).as_posix()
    return relatif == 'blog.html' or relatif.startswith('blog/')


def pages():
    return sorted(DIST.rglob('*.html'))


def styles_astro():
    for path in sorted(SRC.rglob('*.astro')):
        if est_source_blog(path):
            continue
        for bloc in re.findall(r'<style(?:\s[^>]*)?>([\s\S]*?)</style>', path.read_text()):
            yield path, re.sub(r'/\*[\s\S]*?\*/', '', bloc)


class AucunAgrandissement(unittest.TestCase):
    def test_aucune_page_ne_propose_d_agrandir_une_image(self):
        fautes = []
        for page in pages():
            html = page.read_text(errors='replace')
            route = page.relative_to(DIST).as_posix()
            if re.search(r'<dialog\b', html):
                fautes.append(f'{route} : dialogue')
            if COMMANDE_AGRANDIR.search(html) or 'data-proof-detail' in html:
                fautes.append(f'{route} : commande « Agrandir »')
            for lien in LIEN_IMAGE.findall(html):
                fautes.append(f'{route} : lien vers une image {lien[:80]}')
        self.assertTrue(pages(), 'dist absent : construire le site avant ce contrat')
        self.assertEqual(fautes, [])

    def test_le_composant_d_agrandissement_n_existe_plus(self):
        self.assertFalse((SRC / 'components/ProofDetail.astro').exists())
        for path in SRC.rglob('*.astro'):
            source = path.read_text()
            self.assertNotIn('ProofDetail', source, path)
            self.assertNotRegex(source, r'\benlarge\b', path)


class UnSeulDessinDeCarte(unittest.TestCase):
    def test_global_css_dessine_la_carte_la_grille_et_la_bande(self):
        css = (SRC / 'styles/global.css').read_text()
        for selecteur in ['.cartes {', '.carte {', '.carte-icone {', '.carte-titre {', '.carte-texte {', '.bande {', '.cellule {']:
            self.assertIn(selecteur, css)
        # Grille : une colonne, puis deux ; trois pour un multiple de trois ; impair étendu.
        self.assertIn('@container (min-width: 36rem)', css)
        self.assertIn('.cartes > :last-child:nth-child(odd)', css)
        self.assertIn('.cartes:has(> :last-child:nth-child(3n))', css)

    def test_aucun_composant_ne_redessine_la_carte(self):
        fautes = []
        for path, css in styles_astro():
            for selecteur, corps in re.findall(r'([^{}]+)\{([^{}]*)\}', css):
                if CLASSES_CARTE.search(selecteur) and DESSIN.search(corps):
                    fautes.append(f'{path.relative_to(ROOT)} : {selecteur.strip()}')
        self.assertEqual(fautes, [], 'une carte ne se redessine pas localement : global.css seulement')

    def test_les_anciens_motifs_de_cartes_ne_reviennent_pas(self):
        fautes = []
        for page in pages():
            if est_page_blog(page):
                continue
            html = page.read_text(errors='replace')
            classes = {classe for attribut in re.findall(r'\bclass="([^"]*)"', html) for classe in attribut.split()}
            for motif in MOTIFS_ABANDONNES:
                if motif in classes:
                    fautes.append(f'{page.relative_to(DIST).as_posix()} : {motif}')
            if 'data-vedette' in html or 'data-colonnes' in html:
                fautes.append(f'{page.relative_to(DIST).as_posix()} : colonnes fixées à la main')
        self.assertEqual(fautes, [])

    def test_le_blog_ne_porte_aucune_carte_du_site(self):
        fautes = []
        blog = [page for page in pages() if est_page_blog(page)]
        self.assertGreater(len(blog), 3)
        for page in blog:
            classes = {classe for attribut in re.findall(r'\bclass="([^"]*)"', page.read_text(errors='replace')) for classe in attribut.split()}
            communes = classes & {'cartes', 'carte', 'cellule', 'bande'}
            if communes:
                fautes.append(f'{page.relative_to(DIST).as_posix()} : {sorted(communes)}')
        self.assertEqual(fautes, [])
        for path in [ROOT / 'src/pages/blog.astro', ROOT / 'src/layouts/Article.astro', *sorted((SRC / 'pages/blog').rglob('*.astro'))]:
            self.assertNotRegex(path.read_text(), r'class="(?:[^"]*\s)?cartes?(?:\s[^"]*)?"', path)


if __name__ == '__main__':
    unittest.main()
