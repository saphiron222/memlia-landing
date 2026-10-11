import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadMetierEvidence } from '../../scripts/lib/resource-metier-evidence.mjs';

const packet = 'docs/strategy/site-v3/ec/glossaire-reglementaire';
const admitted = ['lettre-de-mission', 'facture-electronique-et-plateforme-agreee'];
const read = (file) => JSON.parse(readFileSync(`${packet}/${file}`, 'utf8'));

test('EC : seuls les deux termes admis sont publics, sans réécriture du fond', async () => {
  const { GLOSSARY_ENTRIES } = await import('../../src/data/glossary.ts');
  for (const candidate of read('entries.json')) {
    const entry = GLOSSARY_ENTRIES.find((row) => row.anchor === candidate.anchor);
    if (!admitted.includes(candidate.anchor)) {
      assert.equal(entry, undefined);
      continue;
    }
    assert.deepEqual(entry, candidate);
    assert.ok(entry.internalLinks.length);
  }
});

test('EC : chaque phrase des cinq champs est tracée avec sa preuve exacte', () => {
  const evidence = loadMetierEvidence(process.cwd(), '2026-09-16T20:24:14+01:00');
  const expected = read('claims.json').filter((row) => admitted.includes(row.entryId));
  for (const row of expected) {
    const claim = evidence.entries.find((entry) => entry.claimId === `claim-t-ec-${row.id}`);
    assert.ok(claim, row.id);
    assert.equal(claim.text, row.claim);
    assert.equal(claim.unitText, row.fieldText);
    assert.equal(claim.type, row.sourceId ? row.claimType : 'methode-memlia');
    assert.equal(claim.citations[0].text, row.excerpt ?? row.claim);
  }
  for (const anchor of admitted) {
    assert.equal(new Set(evidence.entries.filter((entry) => entry.contentLocator.startsWith(`${anchor}:`)).map((entry) => entry.unitId)).size, 5);
  }
});
