"""Oracle indépendant de traçabilité du contrat Ressources v3."""

from __future__ import annotations

import hashlib
import html
import json
import re
import unittest
from datetime import datetime
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
# La surface H (page Ressources) est retirée depuis le 16/09/2026 au soir : seul le glossaire est scellé.
MANIFESTS = (
    ROOT / "editorial/resources/glossaire/manifest.json",
)
REGISTER = ROOT / "docs/qa/hub-ressources/metier-fix-c-register.json"
CONTRACT_FILES = (
    ROOT / "editorial/templates/resource-manifest-v1.schema.json",
    ROOT / "scripts/lib/resource-metier-evidence.mjs",
    ROOT / "scripts/lib/resource-metier-v3.mjs",
    ROOT / "scripts/lib/resource-pipeline.mjs",
    ROOT / "scripts/seal-resource-surfaces.mjs",
    ROOT / "tests/scripts/resource-fixture.mjs",
    ROOT / "tests/scripts/resource-pipeline.test.mjs",
    *MANIFESTS,
)


def sha256(value: str | bytes) -> str:
    payload = value.encode() if isinstance(value, str) else value
    return hashlib.sha256(payload).hexdigest()


def normalized(value: str) -> str:
    return " ".join(html.unescape(value).split())


class VisibleTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self._hidden_depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in {"script", "style", "template"}:
            self._hidden_depth += 1

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "template"} and self._hidden_depth:
            self._hidden_depth -= 1

    def handle_data(self, data: str) -> None:
        if not self._hidden_depth:
            self.parts.append(data)


class ResourceV3TraceabilityProof(unittest.TestCase):
    def test_blog_authority_and_recouvrement_doctrine_are_preserved(self) -> None:
        # Autorite Blog re-pointee le 16/09/2026 sur le commit e2196a3 qui retire les encarts
        # de processus des trois articles publies, aucun brouillon.
        expected_articles = {
            "controler-les-bulletins-de-paie-avant-la-dsn": "b8c678eff08c79efc96784ded33deb9842eaf99f83bec50aa1e5d78bddd97cb8",
            "suivre-la-production-sociale-dans-excel": "bd822ed24264fd9dbbb5e2865dd429ba03c8445fc89523e2fde3a9d52961cf4b",
        }
        for slug, expected_hash in expected_articles.items():
            article = ROOT / f"src/content/blog/{slug}.md"
            dossier = ROOT / f"editorial/articles/{slug}/manifest.json"
            self.assertEqual(sha256(article.read_bytes()), expected_hash, slug)
            self.assertTrue(dossier.is_file(), slug)

        # L'article 3 est publie depuis le 16/09/2026 par la chaine blog, sans manifeste de
        # ressource : son dossier n'a donc pas ete adopte par ce candidat. Il est malgre tout
        # garde en octets, pour qu'une regression du blog publie reste detectee.
        self.assertEqual(
            sha256((ROOT / "src/content/blog/comprendre-les-comptes-rendus-metier-dsn.md").read_bytes()),
            "9cc990b2451c024ee24d5bb5950382c3b1ffe0e5ac43096bbe79972f53d32db8",
            "comprendre-les-comptes-rendus-metier-dsn",
        )

        glossary_manifest = json.loads(MANIFESTS[0].read_text())
        unit_id = "unit-t-recouvrement-amiable-commonConfusion"
        claims = [
            claim for claim in glossary_manifest["claimsEvidence"]["claims"]
            if claim["unitId"] == unit_id
        ]
        self.assertEqual(len(claims), 2)
        self.assertEqual(
            {claim["sourceIds"][0] for claim in claims},
            {"source-glossary-memlia", "source-service-public-recouvrement"},
        )
        self.assertTrue(any("simple retard" in claim["text"] for claim in claims))

    def test_visible_units_have_complete_bidirectional_evidence(self) -> None:
        totals = {"units": 0, "claims": 0, "citations": 0}
        global_unit_ids: set[str] = set()

        for manifest_path in MANIFESTS:
            manifest = json.loads(manifest_path.read_text())
            self.assertEqual(manifest["contractRevision"], 3, manifest_path)
            evidence = manifest["claimsEvidence"]
            units = {row["id"]: row for row in evidence["renderedUnitInventory"]}
            claims = {row["id"]: row for row in evidence["claims"]}
            citations = {row["id"]: row for row in evidence["citations"]}
            sources = {row["id"]: row for row in evidence["sources"]}
            self.assertEqual(len(units), len(evidence["renderedUnitInventory"]), manifest_path)
            self.assertEqual(len(claims), len(evidence["claims"]), manifest_path)
            self.assertEqual(len(citations), len(evidence["citations"]), manifest_path)
            self.assertTrue(global_unit_ids.isdisjoint(units), manifest_path)
            global_unit_ids.update(units)

            output = ROOT / manifest["integrity"]["buildOutput"]["entries"][0]["path"]
            parser = VisibleTextParser()
            parser.feed(output.read_text())
            visible_text = normalized(" ".join(parser.parts))

            for unit_id, unit in units.items():
                self.assertEqual(unit["sha256"], sha256(unit["text"]), unit_id)
                self.assertTrue(unit["claimIds"], unit_id)
                self.assertEqual(
                    set(unit["claimIds"]),
                    {claim_id for claim_id, claim in claims.items() if claim["unitId"] == unit_id},
                    unit_id,
                )
                self.assertIn(normalized(unit["text"]), visible_text, unit_id)

            for claim_id, claim in claims.items():
                self.assertIn(claim["unitId"], units, claim_id)
                self.assertIn(claim_id, units[claim["unitId"]]["claimIds"], claim_id)
                self.assertEqual(claim["sha256"], sha256(claim["text"]), claim_id)
                self.assertTrue(claim["sourceIds"], claim_id)
                self.assertTrue(claim["citationIds"], claim_id)
                applicability = claim["applicability"]
                self.assertEqual(set(applicability["sourceIds"]), set(claim["sourceIds"]), claim_id)
                for field in ("population", "regime", "validAsOf", "exceptions"):
                    self.assertTrue(str(applicability[field]).strip(), f"{claim_id}:{field}")

                claim_checked_at = datetime.fromisoformat(claim["checkedAt"])
                for source_id in claim["sourceIds"]:
                    source = sources[source_id]
                    self.assertIn(claim_id, source["claimIds"], f"{claim_id}:{source_id}")
                    source_checked_at = datetime.fromisoformat(source["checkedAt"])
                    self.assertEqual(applicability["validAsOf"], source_checked_at.date().isoformat(), claim_id)
                    self.assertGreaterEqual(claim_checked_at, source_checked_at, claim_id)

                for citation_id in claim["citationIds"]:
                    citation = citations[citation_id]
                    self.assertIn(claim_id, citation["claimIds"], f"{claim_id}:{citation_id}")
                    self.assertIn(citation["sourceId"], claim["sourceIds"], f"{claim_id}:{citation_id}")
                    self.assertEqual(citation["sha256"], sha256(citation["text"]), citation_id)
                    source = sources[citation["sourceId"]]
                    snapshot = (ROOT / source["snapshotPath"]).read_bytes()
                    self.assertEqual(source["contentSha256"], sha256(snapshot), source["id"])
                    self.assertEqual(citation["sourceContentSha256"], source["contentSha256"], citation_id)
                    self.assertIn(normalized(citation["text"]), normalized(snapshot.decode()), citation_id)

            for source_id, source in sources.items():
                self.assertEqual(
                    set(source["claimIds"]),
                    {claim_id for claim_id, claim in claims.items() if source_id in claim["sourceIds"]},
                    source_id,
                )
            for citation_id, citation in citations.items():
                self.assertEqual(
                    set(citation["claimIds"]),
                    {claim_id for claim_id, claim in claims.items() if citation_id in claim["citationIds"]},
                    citation_id,
                )

            totals["units"] += len(units)
            totals["claims"] += len(claims)
            totals["citations"] += len(citations)

        self.assertEqual(totals, {"units": 63, "claims": 64, "citations": 77})

    def test_machine_readable_register_is_an_exact_projection(self) -> None:
        register = json.loads(REGISTER.read_text())
        expected = {"units": [], "claims": [], "citations": [], "sources": []}
        manifest_hashes = {}
        for manifest_path in MANIFESTS:
            raw = manifest_path.read_bytes()
            manifest = json.loads(raw)
            surface = manifest["formatAdapter"]
            manifest_hashes[str(manifest_path.relative_to(ROOT))] = sha256(raw)
            for key in expected:
                evidence_key = "renderedUnitInventory" if key == "units" else key
                expected[key].extend({**row, "surface": surface} for row in manifest["claimsEvidence"][evidence_key])
        for key, rows in expected.items():
            self.assertEqual(register[key], rows, key)
        self.assertEqual(register["counts"], {key: len(rows) for key, rows in expected.items()})
        self.assertEqual(
            {row["path"]: row["sha256"] for row in register["generatedFrom"]},
            manifest_hashes,
        )

    def test_contract_v3_contains_no_effective_date_field(self) -> None:
        for path in CONTRACT_FILES:
            self.assertNotRegex(path.read_text(), re.compile(r'\beffectiveDate\b'), str(path))


if __name__ == "__main__":
    unittest.main()
