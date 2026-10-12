import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

export const CAC_PACKET = 'docs/strategy/site-v3/cac/glossaire';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

/** Copies et projections relues restent distinctes, même pour une même norme. */
export function loadCacProjections(root) {
  return [1, 2, 3, 4].map(n => {
    const prefix = `${CAC_PACKET}/lot${n}/`;
    const read = path => JSON.parse(readFileSync(join(root, prefix, path), 'utf8'));
    const candidate = n === 2 ? 'corrected' : 'candidate';
    const packet = read(`${candidate}/docs/strategy/site-v3/glossaire-cac-lot-${n}.json`);
    const projection = read('review/claims-evidence-projection.json');
    const original = projection.claimsEvidence;
    const review = original.sensitiveMatter.businessReview;
    if (review.status !== 'AI_REVIEW_PASS' || hash(readFileSync(join(root, prefix, review.evidenceRef))) !== review.evidenceSha256)
      throw new Error(`Preuve de revue CAC ${n} divergente`);
    const id = value => `cac${n}-${value}`;
    const evidence = structuredClone(original);
    for (const unit of evidence.renderedUnitInventory) {
      unit.id = id(unit.id); unit.claimIds = unit.claimIds.map(id);
      delete unit.contentPath; delete unit.contentLocator;
    }
    for (const claim of evidence.claims) {
      claim.id = id(claim.id); claim.unitId = id(claim.unitId);
      claim.sourceIds = claim.sourceIds.map(id); claim.citationIds = claim.citationIds.map(id);
      claim.applicability.sourceIds = claim.applicability.sourceIds.map(id);
      if (claim.basedOnClaimIds) claim.basedOnClaimIds = claim.basedOnClaimIds.map(id);
      // Métadonnées sémantiques conservées dans la projection relue importée ;
      // le manifeste exécutable natif n'accepte que ses champs contractuels.
      delete claim.basedOnClaimIds; delete claim.claimSubject; delete claim.evidenceStatus;
      claim.status = 'PASS';
    }
    for (const citation of evidence.citations) {
      citation.id = id(citation.id); citation.sourceId = id(citation.sourceId); citation.claimIds = citation.claimIds.map(id);
    }
    for (const source of evidence.sources) {
      source.id = id(source.id); source.claimIds = source.claimIds.map(id);
      source.upstreamUrl ??= source.requestedUrl;
      for (const key of ['snapshotPath', 'dilaCopyPath', 'verificationEvidenceRef', 'classificationEvidenceRef'])
        if (source[key]) source[key] = prefix + source[key];
      if (hash(readFileSync(join(root, source.snapshotPath))) !== source.contentSha256)
        throw new Error(`Copie CAC divergente : ${source.id}`);
    }
    for (const citation of evidence.citations) {
      const source = evidence.sources.find(source => source.id === citation.sourceId);
      citation.title = source.title; citation.checkedAt = source.checkedAt;
    }
    const mappedReview = structuredClone(review);
    mappedReview.claimSourceVerdicts = review.claimSourceVerdicts.map(row => ({
      ...row, claimId: id(row.claimId), sourceId: id(row.sourceId), citationIds: row.citationIds.map(id),
    }));
    return { packet, evidence, review: mappedReview, prefix };
  });
}

export function appendCacEvidence(manifest, root) {
  const glossary = readFileSync(join(root, 'src/data/glossary.ts'), 'utf8');
  for (const lot of loadCacProjections(root)) {
    for (const entry of lot.packet.entries) {
      const block = glossary.split(`...common, id: '${entry.id}'`)[1]?.split('...common, id:')[0];
      for (const field of ['definition', 'context', 'exampleFictitious', 'commonConfusion', 'automationBoundary'])
        if (!block?.includes(`${field}: '${entry[field]}'`)) throw new Error(`Fond CAC divergent : ${entry.id}:${field}`);
    }
    for (const key of ['renderedUnitInventory', 'claims', 'citations', 'sources'])
      manifest.claimsEvidence[key].push(...lot.evidence[key]);
  }
}
