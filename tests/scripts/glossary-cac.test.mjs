import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { appendCacEvidence, CAC_PACKET, loadCacProjections } from '../../scripts/lib/resource-metier-cac.mjs';

const root = process.cwd();
test('une copie changée ou un texte public divergent refuse le report des preuves', () => {
  const scratch = mkdtempSync(join(tmpdir(), 'glossary-cac-'));
  try {
    cpSync(CAC_PACKET, join(scratch, CAC_PACKET), { recursive: true });
    cpSync('src/data', join(scratch, 'src/data'), { recursive: true });
    const lot = loadCacProjections(scratch)[0];
    const source = lot.evidence.sources.find(source => source.official);
    const path = join(scratch, source.snapshotPath);
    const original = readFileSync(path);
    writeFileSync(path, 'copie remplacée');
    assert.throws(() => loadCacProjections(scratch), /Copie CAC divergente/);
    writeFileSync(path, original);
    const glossaryPath = join(scratch, 'src/data/glossary.ts');
    writeFileSync(glossaryPath, readFileSync(glossaryPath, 'utf8').replace(lot.packet.entries[0].definition, 'Définition changée'));
    assert.throws(() => appendCacEvidence({ claimsEvidence: {} }, scratch), /Fond CAC divergent/);
  } finally { rmSync(scratch, { recursive: true, force: true }); }
});
test('les quatre lots relus couvrent 40 termes et 200 champs sans perdre les copies distinctes', () => {
  const lots = loadCacProjections(root);
  assert.equal(lots.length, 4);
  assert.equal(lots.flatMap(l => l.packet.entries).length, 40);
  assert.equal(lots.flatMap(l => l.evidence.renderedUnitInventory).length, 200);
  const ids = lots.flatMap(l => l.evidence.sources.map(s => s.id));
  assert.equal(new Set(ids).size, ids.length);
  const glossary = readFileSync('src/data/glossary.ts', 'utf8');
  assert.equal([...glossary.matchAll(/\.\.\.common, id: '/g)].length, 95);
  for (const lot of lots) for (const entry of lot.packet.entries) {
    const block = glossary.split(`...common, id: '${entry.id}'`)[1]?.split('...common, id:')[0];
    for (const field of ['definition', 'context', 'exampleFictitious', 'commonConfusion', 'automationBoundary'])
      assert.ok(block?.includes(`${field}: '${entry[field]}'`), `${entry.id}:${field}`);
  }
});
test('les identités, dates, motifs et citations des avis acquis restent conservés', () => {
  for (const lot of loadCacProjections(root)) {
    assert.equal(lot.review.status, 'AI_REVIEW_PASS');
    for (const row of lot.review.claimSourceVerdicts) {
      const claim = lot.evidence.claims.find(c => c.id === row.claimId);
      assert.ok(claim);
      assert.deepEqual(row.citationIds, claim.citationIds);
      assert.ok(row.reasoning.length > 12);
      assert.ok(row.checkedAt.startsWith('2026-10-11'));
    }
  }
});
