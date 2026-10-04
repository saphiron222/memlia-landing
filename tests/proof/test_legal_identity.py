"""Identité publique autorisée : oracle sur le HTML livré, sans accès au dossier privé."""
from datetime import date, timedelta
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import unittest

DIST = Path(__file__).resolve().parents[2] / 'dist'
SITE = 'https://memlia.fr'
ORGANIZATION_ID = f'{SITE}/#organization'
CLOUDFLARE_PHONE = '+1 (888) 99 FLARE'
CLOUDFLARE_PHONE_NUMERIC = '+1 888 993 5273'
CLOUDFLARE_PHONE_URI = 'tel:+18889935273'
CLOUDFLARE_TERMS_UPDATED = '12 septembre 2025'
CLOUDFLARE_PHONE_CHECKED_AT = date(2026, 9, 20)
CLOUDFLARE_PHONE_EXPIRES_AT = CLOUDFLARE_PHONE_CHECKED_AT + timedelta(days=30)
FICHES_PUBLIQUES = [
    'https://annuaire-entreprises.data.gouv.fr/entreprise/memlia-108621541',
    'https://www.pappers.fr/entreprise/memlia-108621541',
    'https://www.societe.com/societe/memlia-108621541.html',
]


class LegalText(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_content = False
        self.depth = 0
        self.parts = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'div':
            if self.in_content:
                self.depth += 1
            elif 'legal-corps' in (attrs.get('class') or '').split():
                self.in_content = True
                self.depth = 1
        if self.in_content and tag == 'a':
            self.links.append(attrs.get('href'))

    def handle_endtag(self, tag):
        if self.in_content and tag == 'div':
            self.depth -= 1
            if self.depth == 0:
                self.in_content = False

    def handle_data(self, data):
        if self.in_content:
            self.parts.append(data)


class VisibleText(HTMLParser):
    """Texte rendu d'une page, à l'exclusion des données structurées et des styles."""

    IGNORED_TAGS = {'script', 'style', 'template'}

    def __init__(self):
        super().__init__()
        self.ignored_depth = 0
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag in self.IGNORED_TAGS:
            self.ignored_depth += 1

    def handle_endtag(self, tag):
        if tag in self.IGNORED_TAGS and self.ignored_depth:
            self.ignored_depth -= 1

    def handle_data(self, data):
        if not self.ignored_depth:
            self.parts.append(data)


def texte_visible(page):
    doc = VisibleText()
    doc.feed(page.read_text())
    return re.sub(r'\s+', ' ', ' '.join(doc.parts)).strip()


class LegalIdentityProof(unittest.TestCase):
    def setUp(self):
        self.doc = LegalText()
        self.doc.feed((DIST / 'mentions-legales.html').read_text())
        self.text = re.sub(r'\s+', ' ', ' '.join(self.doc.parts)).strip()

    def test_publisher_identity_is_in_legal_body(self):
        for expected in [
            'MEMLIA', 'société par actions simplifiée unipersonnelle (SASU)',
            'capital social de 1 €', 'Bureau 326, 59 rue de Ponthieu, 75008 Paris',
            '108 621 541', '10862154100011', 'RCS Paris 108 621 541',
            'Directeur de la publication : Kevin KITANGA, président de MEMLIA',
        ]:
            with self.subTest(expected=expected):
                self.assertIn(expected, self.text)
        self.assertIn('mailto:contact@memlia.fr', self.doc.links)

    def test_host_identity_contact_and_source_are_in_legal_body(self):
        for expected in [
            'Cloudflare Pages', 'Cloudflare, Inc.',
            '101 Townsend St., San Francisco, CA 94107, États-Unis',
            CLOUDFLARE_PHONE, CLOUDFLARE_PHONE_NUMERIC,
            f'mises à jour le {CLOUDFLARE_TERMS_UPDATED}',
        ]:
            with self.subTest(expected=expected):
                self.assertIn(expected, self.text)
        self.assertIn(CLOUDFLARE_PHONE_URI, self.doc.links)
        self.assertIn('https://www.cloudflare.com/', self.doc.links)
        self.assertIn('https://www.cloudflare.com/terms/', self.doc.links)

    def test_host_phone_source_is_not_expired(self):
        self.assertLessEqual(
            date.today(),
            CLOUDFLARE_PHONE_EXPIRES_AT,
            'le téléphone de l’hébergeur doit être revérifié sur les conditions Cloudflare',
        )


def noeuds_editeur():
    """Chaque nœud éditeur du site livré, indexé par la page qui l'émet."""
    par_page = {}
    for page in sorted(DIST.rglob('*.html')):
        blocs = re.findall(
            r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', page.read_text(), re.S
        )
        for bloc in blocs:
            for noeud in json.loads(bloc).get('@graph', []):
                if noeud.get('@id') == ORGANIZATION_ID:
                    par_page.setdefault(page.relative_to(DIST).as_posix(), []).append(noeud)
    return par_page


class PublisherEntityProof(unittest.TestCase):
    """
    L'éditeur doit se lire comme une entité nommée, pas comme une faute de frappe. Mesuré
    le 17/09/2026 : sur « memlia », Google réécrit la requête en « mellia » et sert une
    autre entité. Ce qui distingue Memlia, ce sont sa raison sociale, son siège, ses
    numéros de registre et les fiches publiques qui les portent.

    Second invariant, indépendant du premier : toutes les pages émettent ce nœud sous le
    même `@id`. Elles doivent donc l'émettre à l'identique, sans quoi l'entité change de
    forme selon la page par laquelle un moteur entre.
    """

    def setUp(self):
        self.par_page = noeuds_editeur()
        self.assertTrue(self.par_page, 'aucun nœud éditeur dans le site livré')
        self.noeud = next(iter(self.par_page.values()))[0]

    def test_publisher_is_emitted_by_every_family_of_pages(self):
        for page in ['index.html', 'blog.html', 'glossaire.html', 'methode.html', 'a-propos.html']:
            with self.subTest(page=page):
                self.assertIn(page, self.par_page)

    def test_one_id_means_one_definition(self):
        formes = {
            json.dumps(noeud, sort_keys=True, ensure_ascii=False)
            for noeuds in self.par_page.values()
            for noeud in noeuds
        }
        self.assertEqual(len(formes), 1, f'{len(formes)} définitions pour un seul @id')

    def test_publisher_carries_its_legal_identity(self):
        self.assertEqual(self.noeud['name'], 'Memlia')
        self.assertEqual(self.noeud['legalName'], 'MEMLIA')
        self.assertEqual(
            self.noeud['address'],
            {
                '@type': 'PostalAddress',
                'streetAddress': 'Bureau 326, 59 rue de Ponthieu',
                'postalCode': '75008',
                'addressLocality': 'Paris',
                'addressCountry': 'FR',
            },
        )
        registres = {i['propertyID']: i['value'] for i in self.noeud['identifier']}
        self.assertEqual(registres, {'SIREN': '108621541', 'SIRET': '10862154100011'})

    def test_publisher_points_at_public_registry_records(self):
        self.assertEqual(self.noeud['sameAs'], FICHES_PUBLIQUES)

    def test_schema_address_repeats_the_legal_page(self):
        """L'adresse du schéma n'est pas une saisie neuve : c'est celle déjà publiée."""
        doc = LegalText()
        doc.feed((DIST / 'mentions-legales.html').read_text())
        texte = re.sub(r'\s+', ' ', ' '.join(doc.parts)).strip()
        adresse = self.noeud['address']
        self.assertIn(
            f"{adresse['streetAddress']}, {adresse['postalCode']} {adresse['addressLocality']}",
            texte,
        )
        registres = {i['propertyID']: i['value'] for i in self.noeud['identifier']}
        self.assertIn(registres['SIRET'], texte)
        siren = registres['SIREN']
        self.assertIn(f'{siren[:3]} {siren[3:6]} {siren[6:]}', texte)


class LegalSurfaceSeparationProof(unittest.TestCase):
    """L'identité juridique reste légale ou structurée ; le corps public explique la valeur."""

    ALLOWLIST = {'mentions-legales.html'}
    LEGAL_IDENTITY_PATTERNS = {
        'RCS': r'\bRCS\b',
        'immatriculation': r'\bimmatricul(?:ée|e|ation)\b',
        'unité légale': r'\bunité légale\b',
        'Annuaire des Entreprises': r'\bAnnuaire des Entreprises\b',
        'identifiant SIREN': r'\b108[ .]?621[ .]?541\b',
        'identifiant SIRET': r'\b10862154100011\b',
    }
    REFERENCE_COPY = (
        'Memlia livre l’automatisation IA des tâches répétitives d’un cabinet '
        'd’expertise comptable, dans les outils que ses équipes utilisent déjà.'
    )

    def test_legal_identity_is_absent_from_visible_non_legal_pages(self):
        infractions = []
        for page in sorted(DIST.rglob('*.html')):
            route = page.relative_to(DIST).as_posix()
            if route in self.ALLOWLIST:
                continue
            visible = texte_visible(page)
            for label, pattern in self.LEGAL_IDENTITY_PATTERNS.items():
                if re.search(pattern, visible, re.I):
                    infractions.append(f'{route}: {label}')
        self.assertEqual(infractions, [], 'identité juridique visible hors surface légale : ' + ', '.join(infractions))

    def test_registry_source_is_not_rendered_as_page_evidence(self):
        visible = texte_visible(DIST / 'a-propos.html')
        self.assertNotIn('Annuaire des Entreprises', visible)
        self.assertNotIn('unité légale 108 621 541', visible)

    def test_reference_copy_is_not_repeated_verbatim(self):
        routes = []
        for page in sorted(DIST.rglob('*.html')):
            if self.REFERENCE_COPY in texte_visible(page):
                routes.append(page.relative_to(DIST).as_posix())
        self.assertLessEqual(len(routes), 1, f'copy de référence répétée telle quelle : {routes}')


if __name__ == '__main__':
    unittest.main(verbosity=2)
