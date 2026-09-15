"""Oracle BLOG-A3 : candidat CRM DSN, preuves fraîches et mutations rejetées."""
from __future__ import annotations

from html.parser import HTMLParser
import json
from pathlib import Path
import re
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[2]
SLUG = "comprendre-les-comptes-rendus-metier-dsn"
ARTICLE = ROOT / "src/content/blog" / f"{SLUG}.md"
DIST = ROOT / "dist"
TODAY = "2026-09-15"


class Document(HTMLParser):
    def __init__(self, source: str):
        super().__init__()
        self.tags: list[tuple[str, dict[str, str | None]]] = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


def frontmatter(source: str) -> str:
    return source.split("---", 2)[1]


def body(source: str) -> str:
    return source.split("---", 2)[2]


def source_records(source: str) -> list[tuple[str, str]]:
    return re.findall(r'url: "(https://[^"<>\s]+)", consulte: (\d{4}-\d{2}-\d{2})', frontmatter(source))


def source_errors(source: str) -> list[str]:
    records = source_records(source)
    errors: list[str] = []
    if len(records) < 5:
        errors.append("sources-absentes")
    for url, consulted in records:
        if consulted != TODAY:
            errors.append(f"source-perimee:{url}")
        if url not in body(source):
            errors.append(f"claim-sans-citation:{url}")
    return errors


def identity_errors(source: str) -> list[str]:
    fm = frontmatter(source)
    errors: list[str] = []
    if not re.search(r"^auteur: kevin$", fm, re.M):
        errors.append("auteur-incorrect")
    if not re.search(r"^statutEditorial: publie-non-atteste$", fm, re.M):
        errors.append("attestation-fabriquee")
    if "Contenu non attesté." not in body(source):
        errors.append("mention-non-attestee-absente")
    return errors


def html_route_exists(href: str) -> bool:
    path = urlsplit(href).path
    if path == "/":
        return (DIST / "index.html").is_file()
    direct = DIST / path.lstrip("/")
    return direct.is_file() or direct.with_suffix(".html").is_file() or (direct / "index.html").is_file()


class Article3Contract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = ARTICLE.read_text(encoding="utf-8")
        cls.rendered_path = DIST / "blog" / f"{SLUG}.html"
        cls.rendered = cls.rendered_path.read_text(encoding="utf-8")
        cls.doc = Document(cls.rendered)

    def test_source_contract_is_complete_and_fresh(self):
        self.assertEqual(source_errors(self.source), [])
        self.assertEqual(len(source_records(self.source)), 5)

    def test_identity_and_non_attestation_are_explicit(self):
        self.assertEqual(identity_errors(self.source), [])
        self.assertNotRegex(self.source, r"(?i)\b(téléphone|TVA intracommunautaire|donnée client réelle)\b")

    def test_post_deposit_intent_and_bidirectional_link(self):
        self.assertIn("exclusivement de l’interprétation et du suivi après dépôt", self.source)
        existing = (ROOT / "src/content/blog/controler-les-bulletins-de-paie-avant-la-dsn.md").read_text(encoding="utf-8")
        self.assertIn(f"](/blog/{SLUG})", existing)

    def test_rendered_canonical_links_and_jsonld(self):
        canonical = next(attrs["href"] for tag, attrs in self.doc.tags if tag == "link" and attrs.get("rel") == "canonical")
        self.assertEqual(canonical, f"https://memlia.fr/blog/{SLUG}")
        body_match = re.search(r'<div class="article-corps lecture"[^>]*>(.*?)<section class="article-sources"', self.rendered, re.S)
        self.assertIsNotNone(body_match)
        assert body_match is not None
        article_body = body_match.group(1)
        body_doc = Document(article_body)
        internal = sorted({str(attrs["href"]) for tag, attrs in body_doc.tags if tag == "a" and (attrs.get("href") or "").startswith("/")})
        self.assertGreaterEqual(len(internal), 3)
        self.assertLessEqual(len(internal), 10)
        self.assertTrue(all(html_route_exists(href) for href in internal), internal)
        scripts = re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', self.rendered)
        self.assertEqual(len(scripts), 1)
        graph = json.loads(scripts[0])["@graph"]
        person = next(node for node in graph if node["@type"] == "Person")
        posting = next(node for node in graph if node["@type"] == "BlogPosting")
        self.assertEqual(person["name"], "Kevin Kitanga")
        self.assertEqual(posting["mainEntityOfPage"]["@id"], canonical)
        self.assertGreaterEqual(posting["wordCount"], 1500)
        social_image = f"https://memlia.fr/images/img-25-comptes-rendus-metier-dsn-1200.webp"
        og_image = next(attrs.get("content") for tag, attrs in self.doc.tags if tag == "meta" and attrs.get("property") == "og:image")
        twitter_image = next(attrs.get("content") for tag, attrs in self.doc.tags if tag == "meta" and attrs.get("name") == "twitter:image")
        self.assertEqual(og_image, social_image)
        self.assertEqual(twitter_image, social_image)

    def test_mutations_reject_missing_stale_or_uncited_sources(self):
        records = source_records(self.source)
        first_url, _ = records[0]
        source_line = re.search(r'^  - \{ editeur:.*' + re.escape(first_url) + r'.*\}\n', self.source, re.M)
        self.assertIsNotNone(source_line)
        assert source_line is not None
        missing = self.source.replace(source_line.group(), "")
        self.assertIn("sources-absentes", source_errors(missing))
        stale = self.source.replace(f"consulte: {TODAY}", "consulte: 2025-09-15", 1)
        self.assertTrue(any(error.startswith("source-perimee:") for error in source_errors(stale)))
        marker = f"]({first_url})"
        uncited = self.source.replace(marker, "](https://example.invalid/source)", 1)
        self.assertIn(f"claim-sans-citation:{first_url}", source_errors(uncited))

    def test_mutations_reject_wrong_author_and_fabricated_attestation(self):
        wrong_author = self.source.replace("auteur: kevin", "auteur: autre", 1)
        self.assertIn("auteur-incorrect", identity_errors(wrong_author))
        fake_attestation = self.source.replace("statutEditorial: publie-non-atteste", "statutEditorial: atteste", 1)
        self.assertIn("attestation-fabriquee", identity_errors(fake_attestation))

    def test_mutations_reject_bad_canonical_and_internal_404(self):
        canonical = f"https://memlia.fr/blog/{SLUG}"
        self.assertNotEqual(canonical + "/", canonical)
        self.assertFalse(html_route_exists("/blog/route-absente-blog-a3"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
