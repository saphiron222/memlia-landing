import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
const base = 'docs/qa/hub-ressources/glossaire-cac-lot-2-sources';
const pack = JSON.parse(readFileSync(process.env.F1_PACK ?? 'docs/strategy/site-v3/glossaire-cac-lot-2.json'));
const cases = [
  ['phrase omise', p => { p.evidence.units = p.evidence.units.filter(u => u.claimId !== 'assertions-audit-context-f1-2'); }],
  ['sous-claim tronqué', p => { p.evidence.units.find(u => u.claimId === 'assertions-audit-context-f1-2').text = 'La NEP 315'; }],
  ['unitText altéré', p => { p.evidence.units.find(u => u.claimId).unitText = 'Texte incomplet'; }],
  ['identifiant dupliqué', p => { p.evidence.units.push(structuredClone(p.evidence.units[0])); }],
  ['source sans citation', p => { p.evidence.units.find(u => u.claimId && u.sourceId).citations = []; }],
  ['lexique doté de portée réglementaire', p => { p.evidence.units.find(u => u.claimId && !u.sourceId).type = 'legal-reglementaire'; }],
];
for (const [name, change] of cases) {
  test(`F1 refus matériel : ${name}`, () => {
    const directory = mkdtempSync(join(tmpdir(), 'cac-f1-'));
    try {
      const candidate = structuredClone(pack);
      change(candidate);
      const path = join(directory, 'candidate.json');
      writeFileSync(path, JSON.stringify(candidate));
      const result = spawnSync(process.execPath, [`${base}/validate.mjs`, path], {encoding:'utf8'});
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.match(result.stderr, /AssertionError/);
    } finally { rmSync(directory, {recursive:true, force:true}); }
  });
}
