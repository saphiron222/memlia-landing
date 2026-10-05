"""Contrat rendu des deux rubriques éditoriales du blog."""
import json
from html.parser import HTMLParser
from pathlib import Path
import re
import unittest
from source_inventory import source_export
import xml.etree.ElementTree as ET
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
DIST = ROOT / "dist"
SITE = "https://memlia.fr"
RUBRIQUES = {
    "paie-dsn-cabinet-comptable": {
        "label": "Paie et DSN",
        "articles": {
            "controler-les-bulletins-de-paie-avant-la-dsn",
            "comprendre-les-comptes-rendus-metier-dsn",
            "suivre-la-production-sociale-dans-excel",
        },
    },
    "gestion-pieces-comptables": {
        "label": "Saisie et pièces",
        "articles": {
            "automatiser-la-saisie-comptable-ce-qui-reste-a-verifier",
            "automatiser-la-relance-des-pieces-clients",
        },
    },
}
HORS_RUBRIQUE = {
    "automatiser-un-cabinet-comptable-la-carte-des-taches",
    "pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils",
}


class Document(HTMLParser):
    def __init__(self, html):
        super().__init__()
        self.tags = []
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


def texte_visible(fragment):
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment)).strip()


def page_path(route):
    direct = DIST / f"{route.lstrip('/')}.html"
    return direct if direct.exists() else DIST / route.lstrip("/") / "index.html"


def sitemap_urls():
    index = ET.parse(DIST / "sitemap.xml")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = set()
    for location in index.findall(".//s:loc", ns):
        subtree = DIST / str(urlsplit(location.text or "").path).lstrip("/")
        tree = ET.parse(subtree)
        urls.update(node.text for node in tree.findall(".//s:url/s:loc", ns))
    return urls


RUBRIQUES_HISTORIQUES = set(RUBRIQUES)
RUBRIQUES = {entry['slug']: {'label': entry['libelle'], 'articles': set(entry['articleIds'])}
             for entry in source_export(ROOT, 'src/data/blog-rubriques.mjs', 'BLOG_RUBRIQUES')}
HORS_RUBRIQUE = set(source_export(ROOT, 'src/data/blog-rubriques.mjs', 'ARTICLES_HORS_RUBRIQUE'))


class BlogRubriquesProof(unittest.TestCase):
    def test_hubs_substantiels_et_dynamiques(self):
        self.assertGreaterEqual(len(RUBRIQUES), 2)
        self.assertTrue(RUBRIQUES_HISTORIQUES <= set(RUBRIQUES))
        hubs = sorted((DIST / "blog/rubrique").glob("*.html"))
        self.assertEqual([hub.stem for hub in hubs], sorted(RUBRIQUES))
        for slug, attendu in RUBRIQUES.items():
            self.assertGreaterEqual(len(attendu['articles']), 2)
            route = f"/blog/rubrique/{slug}"
            html = page_path(route).read_text(encoding="utf-8")
            doc = Document(html)
            canonical = next(attrs["href"] for tag, attrs in doc.tags if tag == "link" and attrs.get("rel") == "canonical")
            self.assertEqual(canonical, f"{SITE}{route}")
            self.assertEqual(len(re.findall(r"<h1\b", html)), 1)
            chapeau = re.search(r'<p class="rubrique-chapeau[^>]*>(.*?)</p>', html, re.S)
            role = re.search(r'<section class="[^"]*rubrique-role[^"]*"[^>]*>(.*?)</section>', html, re.S)
            if chapeau is None:
                self.fail(f"{route}: chapeau absent")
            if role is None:
                self.fail(f"{route}: explication du rôle absente")
            self.assertGreaterEqual(len(texte_visible(chapeau.group(1)).split()), 30)
            self.assertGreaterEqual(len(texte_visible(role.group(1)).split()), 45)
            cartes = set(re.findall(r'data-rubrique-article="([a-z0-9-]+)"', html))
            self.assertEqual(cartes, attendu["articles"])
            for article in attendu["articles"]:
                carte = re.search(rf'<li[^>]*data-rubrique-article="{article}".*?</li>', html, re.S)
                if carte is None:
                    self.fail(f"{route}: carte absente pour {article}")
                resume = re.search(r'<p class="[^"]*rubrique-resume[^"]*"[^>]*>(.*?)</p>', carte.group(0), re.S)
                if resume is None:
                    self.fail(f"{route}: description absente pour {article}")
                self.assertGreaterEqual(len(texte_visible(resume.group(1)).split()), 12)
            graph = json.loads(re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html)[0])["@graph"]
            types = graph[0]["@type"]
            self.assertIn("WebPage", types)
            self.assertIn("CollectionPage", types)
            self.assertEqual(graph[1]["@type"], "BreadcrumbList")
            self.assertEqual(graph[0]["headline"], texte_visible(re.findall(r'<h1[^>]*>(.*?)</h1>', html, re.S)[0]))
            self.assertEqual(graph[0]["mainEntity"]["numberOfItems"], len(attendu["articles"]))
            self.assertEqual(
                {urlsplit(item["url"]).path.rsplit("/", 1)[-1] for item in graph[0]["mainEntity"]["itemListElement"]},
                attendu["articles"],
            )
            self.assertEqual(
                [crumb["item"] for crumb in graph[1]["itemListElement"]],
                [f"{SITE}/", f"{SITE}/blog", f"{SITE}{route}"],
            )
            og_title = next(attrs["content"] for tag, attrs in doc.tags if tag == "meta" and attrs.get("property") == "og:title")
            self.assertEqual(og_title, graph[0]["headline"])

    def test_articles_rattaches_lient_le_hub_en_html_et_jsonld(self):
        for rubrique_slug, attendu in RUBRIQUES.items():
            hub = f"/blog/rubrique/{rubrique_slug}"
            hub_url = f"{SITE}{hub}"
            for article in attendu["articles"]:
                html = page_path(f"/blog/{article}").read_text(encoding="utf-8")
                self.assertRegex(html, rf'<a[^>]*data-blog-rubrique[^>]*href="{hub}"')
                ariane = re.search(r'<nav class="ariane".*?</nav>', html, re.S)
                if ariane is None:
                    self.fail(f"{article}: fil d’Ariane absent")
                self.assertIn(f'href="{hub}"', ariane.group(0))
                graph = json.loads(re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>', html)[0])["@graph"]
                crumbs = next(node for node in graph if node["@type"] == "BreadcrumbList")["itemListElement"]
                self.assertEqual([crumb["position"] for crumb in crumbs], [1, 2, 3, 4])
                self.assertEqual(crumbs[2]["item"], hub_url)
        for article in HORS_RUBRIQUE:
            html = page_path(f"/blog/{article}").read_text(encoding="utf-8")
            self.assertNotIn("data-blog-rubrique", html)

    def test_footer_sitemap_et_liens_internes(self):
        blog = page_path("/blog").read_text(encoding="utf-8")
        comprendre = re.search(r'<h2 class="pied-titre"[^>]*>Comprendre</h2>\s*<ul class="pied-liste"[^>]*>(.*?)</ul>', blog, re.S)
        if comprendre is None:
            self.fail("colonne Comprendre absente du footer")
        urls = sitemap_urls()
        for slug in RUBRIQUES:
            route = f"/blog/rubrique/{slug}"
            self.assertIn(f'href="{route}"', comprendre.group(1))
            self.assertIn(f"{SITE}{route}", urls)

        routes = {"/"}
        for page in DIST.rglob("*.html"):
            relatif = page.relative_to(DIST).with_suffix("").as_posix()
            route = f"/{relatif}"
            if route.endswith("/index"):
                route = route[:-len("index")].rstrip("/") or "/"
            routes.add(route)
        for page in DIST.rglob("*.html"):
            if page.name == "404.html":
                continue
            for href in re.findall(r'href="(/[^"]*)"', page.read_text(encoding="utf-8")):
                route = href.split("#", 1)[0].split("?", 1)[0] or "/"
                if route.startswith("/assets/") or route.startswith("/images/") or route.startswith("/fonts/"):
                    continue
                normalisee = route.rstrip("/") or "/"
                cible_fichier = DIST / route.lstrip("/")
                self.assertTrue(normalisee in routes or cible_fichier.is_file(), f"{page}: {href}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
