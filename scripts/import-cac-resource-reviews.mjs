#!/usr/bin/env node
// Agrégation technique des avis acquis ; ne produit aucun avis de fond.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { digest, reviewSubjectDigestPayload, candidateDigestPayload } from './lib/resource-pipeline.mjs';
import { loadCacProjections, CAC_PACKET } from './lib/resource-metier-cac.mjs';

const root = process.cwd();
const path = 'editorial/resources/glossaire/manifest.json';
const manifest = JSON.parse(readFileSync(path, 'utf8'));
const previous = manifest.claimsEvidence.sensitiveMatter.businessReview;
const lots = loadCacProjections(root);
for (const lot of lots) {
  const original = JSON.parse(readFileSync(join(root, lot.prefix, 'review/claims-evidence-projection.json'), 'utf8'));
  if (digest(reviewSubjectDigestPayload(original)) !== original.claimsEvidence.sensitiveMatter.businessReview.reviewedCandidateHash)
    throw new Error(`Sujet de revue divergent : ${lot.prefix}`);
}
const verdicts = [
  ...previous.claimSourceVerdicts.filter(row => !/^cac[1-4]-/.test(row.claimId)),
  ...lots.flatMap(lot => lot.review.claimSourceVerdicts),
];
const sensitive = manifest.claimsEvidence.claims.filter(claim => ['paie', 'social', 'dsn', 'fiscal', 'juridique', 'legal-reglementaire', 'statistique-chiffre'].includes(claim.type));
const required = sensitive.flatMap(claim => claim.sourceIds.map(id => `${claim.id}/${id}`)).sort();
const supplied = verdicts.map(row => `${row.claimId}/${row.sourceId}`).sort();
if (JSON.stringify(required) !== JSON.stringify(supplied)) throw new Error('Couverture des avis CAC divergente');
// La campagne enveloppe les avis ; leurs dates, identités et motifs restent dans les paquets originaux.
manifest.claimsEvidence.sensitiveMatter.checkedAt = verdicts.map(row => row.checkedAt).sort().at(-1);
const review = {
  required: true, reviewerType: previous.reviewerType, reviewerProfile: previous.reviewerProfile,
  reviewerId: previous.reviewerId, reviewerRole: previous.reviewerRole, distinctFrom: previous.distinctFrom,
  reviewedCandidateHash: digest(reviewSubjectDigestPayload(manifest)), status: 'AI_REVIEW_PASS', claimSourceVerdicts: verdicts,
};
const evidenceRef = `${CAC_PACKET}/business-review-aggregate.json`;
const bytes = `${JSON.stringify(review, null, 2)}\n`;
writeFileSync(evidenceRef, bytes);
manifest.claimsEvidence.sensitiveMatter.businessReview = {
  ...review, evidenceRef, evidenceSha256: createHash('sha256').update(bytes).digest('hex'),
};
const candidateHash = digest(candidateDigestPayload(manifest));
manifest.integrity.candidateHash.value = candidateHash;
manifest.audit.candidateHash = candidateHash;
const audit = { ...manifest.audit }; delete audit.auditHash;
manifest.audit.auditHash = digest(audit);
writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
const registerPath = 'docs/qa/hub-ressources/metier-fix-c-register.json';
const register = JSON.parse(readFileSync(registerPath, 'utf8'));
register.generatedFrom = [{ path, sha256: createHash('sha256').update(readFileSync(path)).digest('hex') }];
writeFileSync(registerPath, `${JSON.stringify(register, null, 2)}\n`);
console.log(JSON.stringify({ reviews: lots.map(l => l.review.reviewerId), acquiredSensitiveVerdicts: verdicts.length, units: manifest.claimsEvidence.renderedUnitInventory.length }));
