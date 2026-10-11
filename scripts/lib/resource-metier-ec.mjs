import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const PACKET = 'docs/strategy/site-v3/ec/glossaire-reglementaire';
export const EC_ADMITTED = ['lettre-de-mission', 'facture-electronique-et-plateforme-agreee'];

/** Import des phrases relues, sans recomposer une règle ni redater le corpus historique. */
export function expandEcEvidence({ root, glossary, entries, sources }) {
  const read = (file) => JSON.parse(readFileSync(join(root, PACKET, file), 'utf8'));
  const candidates = read('entries.json').filter((entry) => EC_ADMITTED.includes(entry.anchor));
  const claims = read('claims.json').filter((claim) => EC_ADMITTED.includes(claim.entryId));
  const used = new Set(claims.map((claim) => claim.sourceId).filter(Boolean));
  for (const source of read('sources.json').filter((source) => used.has(source.id))) {
    const id = `source-ec-${source.id}`;
    sources[id] = {
      ...source, id, snapshotPath: `${PACKET}/${source.snapshotPath}`,
      requestedUrl: source.url, finalUrl: source.url, upstreamUrl: source.url,
      official: true, level: 'tier-1', provenance: 'primary',
      verificationEvidenceRef: `${PACKET}/README.md#réserves-a4--disponibilité-réellement-constatée`,
      classificationEvidenceRef: `${PACKET}/README.md#livrable-et-usage`,
    };
  }
  for (const candidate of candidates) {
    const block = glossary.split(`...common, id: '${candidate.id}'`)[1]?.split('...common, id:')[0];
    for (const field of ['definition', 'context', 'exampleFictitious', 'commonConfusion', 'automationBoundary']) {
      if (!block?.includes(`${field}: '${candidate[field]}'`)) throw new Error(`Fond EC divergent : ${candidate.id}:${field}`);
      const rows = claims.filter((claim) => claim.entryId === candidate.id && claim.field === field);
      if (!rows.length) throw new Error(`Champ EC sans preuve : ${candidate.id}:${field}`);
      for (const row of rows) {
        const sourceId = row.sourceId ? `source-ec-${row.sourceId}` : 'source-glossary-memlia';
        const id = `ec-${row.id}`;
        entries.push({
          id: `T-EC-${row.id}`, surface: 'T', unitId: `unit-t-ec-${candidate.id}-${field}`,
          claimId: `claim-t-${id}`, text: row.claim, unitText: row.fieldText,
          type: row.sourceId ? row.claimType : 'methode-memlia', sourceId,
          citations: [{ id: `citation-t-${id}`, text: row.excerpt ?? row.claim, locator: row.locator ?? `${candidate.id}:${field}` }],
          contentPath: 'src/data/glossary.ts', contentLocator: `${candidate.id}:${field}`,
          checkedAt: row.sourceId ? sources[sourceId].checkedAt : sources['source-glossary-memlia'].checkedAt,
          validAsOf: sources[sourceId].checkedAt.slice(0, 10),
          applicability: row.sourceId ? `Population et opérations bornées dans le champ ${candidate.id}:${field} : ${candidate.context}` : 'Convention pédagogique Memlia, cas entièrement fictif ou frontière du service.',
          regime: row.sourceId ? sources[sourceId].version : 'Convention interne Memlia, sans portée réglementaire autonome.',
          exceptions: row.sourceId ? candidate.commonConfusion : 'Ne constitue ni obligation universelle, ni résultat réel, ni certification.',
        });
      }
    }
  }
}
