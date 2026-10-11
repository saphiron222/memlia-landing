import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { digest, candidateDigestPayload, reviewSubjectDigestPayload } from '../../../../../scripts/lib/resource-pipeline.mjs';

const packet = 'docs/strategy/site-v3/ec/glossaire-reglementaire';
const manifestPath = 'editorial/resources/glossaire/manifest.json';
const read = (path) => JSON.parse(readFileSync(path, 'utf8'));
const write = (path, data) => writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
// Base d’intégration fraîche ; jamais une nouvelle revue attribuée aux anciens auteurs.
const base = JSON.parse(execFileSync('git', ['show', 'f9b65c7d5a40d6ec6ccf17a3c8dee8f6f93eb73f:' + manifestPath], { encoding: 'utf8' }));
const manifest = read(manifestPath);
const lot = read(`${packet}/review/business-review.json`);
assert.equal(lot.status, 'AI_REVIEW_PASS');
assert.equal(sha(readFileSync(`${packet}/entries.json`)), lot.reviewedCandidateHash);
for (const field of ['renderedUnitInventory', 'claims', 'citations', 'sources']) {
  const current = new Map(manifest.claimsEvidence[field].map((row) => [row.id, row]));
  for (const row of base.claimsEvidence[field]) {
    const before = structuredClone(row);
    const after = structuredClone(current.get(row.id));
    // La copie de convention interne est glossary.ts : seuls son hash et ses liens
    // inverses changent avec l’ajout. Les textes, citations et sources officielles restent stricts.
    if (field === 'citations' && row.sourceId === 'source-glossary-memlia') {
      delete before.sourceContentSha256;
      delete after.sourceContentSha256;
    }
    if (field === 'sources' && row.id === 'source-glossary-memlia') {
      delete before.contentSha256;
      delete after.contentSha256;
      assert.ok(before.claimIds.every((id) => after.claimIds.includes(id)));
      delete before.claimIds;
      delete after.claimIds;
    }
    assert.deepEqual(after, before, `Historique modifié : ${field}/${row.id}`);
  }
}
const candidates = read(`${packet}/claims.json`);
const reasons = new Map(lot.claimSourceVerdicts.map((row) => [row.claimId, row]));
const oldReview = base.claimsEvidence.sensitiveMatter.businessReview;
const verdicts = structuredClone(oldReview.claimSourceVerdicts);
const remapping = [];
for (const claim of manifest.claimsEvidence.claims.filter((row) => row.id.startsWith('claim-t-ec-'))) {
  const originalId = claim.id.slice('claim-t-ec-'.length);
  const original = candidates.find((row) => row.id === originalId);
  assert.equal(claim.text, original.claim);
  if (!original.sourceId) continue; // Avis pédagogiques conservés dans le rapport, pas une règle sensible.
  const review = reasons.get(originalId);
  assert.equal(review.verdict, 'soutient');
  const source = manifest.claimsEvidence.sources.find((row) => row.id === claim.sourceIds[0]);
  assert.equal(sha(readFileSync(source.snapshotPath)), review.sourceContentSha256);
  const citation = manifest.claimsEvidence.citations.find((row) => row.id === claim.citationIds[0]);
  assert.equal(citation.text, original.excerpt);
  verdicts.push({ claimId: claim.id, sourceId: source.id, citationIds: claim.citationIds,
    verdict: review.verdict, sourceContentSha256: review.sourceContentSha256,
    checkedAt: review.reviewedAt, reasoning: review.reasoning });
  remapping.push({ originalId, claimId: claim.id, sourceId: source.id, citationIds: claim.citationIds, reviewerId: lot.reviewerId, reviewedAt: review.reviewedAt });
}
const review = {
  required: true, reviewerType: lot.reviewerType, reviewerProfile: lot.reviewerProfile,
  reviewerId: lot.reviewerId, reviewerRole: lot.reviewerRole, distinctFrom: lot.distinctFrom,
  reviewedCandidateHash: null, status: lot.status, claimSourceVerdicts: verdicts,
};
manifest.claimsEvidence.sensitiveMatter.checkedAt = lot.reviewedAt;
manifest.claimsEvidence.sensitiveMatter.businessReview = review;
review.reviewedCandidateHash = digest(reviewSubjectDigestPayload(manifest));
const evidenceRef = `${packet}/review/business-review-global.json`;
write(evidenceRef, review);
review.evidenceRef = evidenceRef;
review.evidenceSha256 = sha(readFileSync(evidenceRef));
const candidateHash = digest(candidateDigestPayload(manifest));
manifest.integrity.candidateHash.value = candidateHash;
manifest.audit.candidateHash = candidateHash;
const audit = { ...manifest.audit };
delete audit.auditHash;
manifest.audit.auditHash = digest(audit);
write(manifestPath, manifest);
const registerPath = 'docs/qa/hub-ressources/metier-fix-c-register.json';
const register = read(registerPath);
for (const field of ['units', 'claims', 'citations', 'sources']) {
  const sourceField = field === 'units' ? 'renderedUnitInventory' : field;
  assert.deepEqual(register[field], manifest.claimsEvidence[sourceField].map((row) => ({ ...row, surface: 'T' })));
}
register.generatedFrom = [{ path: manifestPath, sha256: sha(readFileSync(manifestPath)) }];
write(registerPath, register);
write(`${packet}/review/remappage.json`, {
  historicalReview: { reviewerId: oldReview.reviewerId, evidenceRef: oldReview.evidenceRef, verdicts: oldReview.claimSourceVerdicts.length, datesAndReasonsPreserved: true },
  newReview: { reviewerId: lot.reviewerId, evidenceRef: `${packet}/review/REVUE.md`, remapping },
  rule: 'Enveloppe composée pour le sous-lot admis ; les verdicts historiques restent inchangés. Aucune nouvelle lecture du fond revendiquée.',
});
console.log(`${verdicts.length} avis sensibles intégrés, dont ${remapping.length} nouveaux ; historique strictement identique.`);
