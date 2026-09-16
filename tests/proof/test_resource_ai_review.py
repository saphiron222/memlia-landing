import copy
import hashlib
import json
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def canonical_digest(value: object) -> str:
    payload = json.dumps(value, ensure_ascii=False, separators=(",", ":"), sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()


def review_subject_payload(manifest: dict) -> dict:
    claims_evidence = copy.deepcopy(manifest["claimsEvidence"])
    del claims_evidence["sensitiveMatter"]["businessReview"]
    return {
        "schemaVersion": manifest["schemaVersion"],
        "contractRevision": manifest["contractRevision"],
        "formatAdapter": manifest["formatAdapter"],
        "resourceType": manifest["resourceType"],
        "editorialFormat": manifest["editorialFormat"],
        "policyBaseline": manifest["policyBaseline"],
        "taxonomy": manifest["taxonomy"],
        "candidate": manifest["candidate"],
        "formatContract": manifest["formatContract"],
        "research": manifest["research"],
        "claimsEvidence": claims_evidence,
        "assets": manifest["assets"],
        "links": manifest["links"],
        "skills": manifest["skills"],
        "quality": manifest["quality"],
        "negativeWitnessesRef": manifest["negativeWitnessesRef"],
        "contradictions": manifest["contradictions"],
        "limitations": manifest["limitations"],
        "sourceBundleDigest": manifest["integrity"]["sourceBundle"]["digest"],
        "assetBundleDigest": manifest["integrity"]["assetBundle"]["digest"],
        "configBundleDigest": manifest["integrity"]["configBundle"]["digest"],
        "buildOutputDigest": manifest["integrity"]["buildOutput"]["digest"],
    }


class ResourceAiReviewContractTests(unittest.TestCase):
    def test_oracle_recalcule_le_sujet_la_preuve_et_la_matrice(self) -> None:
        with tempfile.TemporaryDirectory(prefix="memlia-resource-ai-review-") as directory:
            root = Path(directory)
            script = """
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createResourceFixture } from './tests/scripts/resource-fixture.mjs';
const root = process.argv[1];
writeFileSync(join(root, 'manifest.json'), `${JSON.stringify(createResourceFixture(root, 'H', 'qa'), null, 2)}\\n`);
"""
            subprocess.run(
                ["node", "--input-type=module", "-e", script, str(root)],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            )
            manifest = json.loads((root / "manifest.json").read_text())
            review = manifest["claimsEvidence"]["sensitiveMatter"]["businessReview"]

            self.assertEqual(review["reviewerType"], "ai-agent")
            self.assertEqual(review["reviewerProfile"], "metier")
            self.assertEqual(review["reviewerRole"], "reviewer-metier-memlia")
            self.assertEqual(review["status"], "AI_REVIEW_PASS")
            self.assertNotIn(
                review["reviewerId"],
                {manifest["candidate"]["author"], manifest["candidate"]["editorialReviewer"]},
            )
            self.assertEqual(
                review["reviewedCandidateHash"],
                canonical_digest(review_subject_payload(manifest)),
            )
            changed_applicability = copy.deepcopy(manifest)
            changed_applicability["claimsEvidence"]["claims"][0]["applicability"]["population"] += " Mutation."
            self.assertNotEqual(
                canonical_digest(review_subject_payload(changed_applicability)),
                review["reviewedCandidateHash"],
            )
            changed_review_only = copy.deepcopy(manifest)
            changed_review_only["claimsEvidence"]["sensitiveMatter"]["businessReview"]["status"] = "FAIL"
            self.assertEqual(
                canonical_digest(review_subject_payload(changed_review_only)),
                review["reviewedCandidateHash"],
            )

            evidence_path = root / review["evidenceRef"]
            evidence_bytes = evidence_path.read_bytes()
            self.assertEqual(hashlib.sha256(evidence_bytes).hexdigest(), review["evidenceSha256"])
            expected_evidence = {
                key: review[key]
                for key in (
                    "required",
                    "reviewerType",
                    "reviewerProfile",
                    "reviewerId",
                    "reviewerRole",
                    "distinctFrom",
                    "reviewedCandidateHash",
                    "status",
                    "claimSourceVerdicts",
                )
            }
            self.assertEqual(json.loads(evidence_bytes), expected_evidence)

            citations = {
                citation["id"]: citation
                for citation in manifest["claimsEvidence"]["citations"]
            }
            sources = {
                source["id"]: source
                for source in manifest["claimsEvidence"]["sources"]
            }
            expected_pairs = {
                (claim["id"], source_id)
                for claim in manifest["claimsEvidence"]["claims"]
                for source_id in claim["sourceIds"]
            }
            observed_pairs = {
                (verdict["claimId"], verdict["sourceId"])
                for verdict in review["claimSourceVerdicts"]
            }
            self.assertEqual(observed_pairs, expected_pairs)
            self.assertEqual(len(review["claimSourceVerdicts"]), len(expected_pairs))
            for verdict in review["claimSourceVerdicts"]:
                self.assertEqual(verdict["verdict"], "soutient")
                self.assertEqual(
                    verdict["sourceContentSha256"],
                    sources[verdict["sourceId"]]["contentSha256"],
                )
                self.assertTrue(verdict["citationIds"])
                self.assertTrue(
                    all(citations[citation_id]["sourceId"] == verdict["sourceId"] for citation_id in verdict["citationIds"])
                )


if __name__ == "__main__":
    unittest.main()
