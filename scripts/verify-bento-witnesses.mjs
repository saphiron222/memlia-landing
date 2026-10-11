/** Réintroduit séparément chaque divergence, uniquement dans dist, puis restaure. */
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const target = 'dist/index.html';
const original = readFileSync(target);
const sha = data => createHash('sha256').update(data).digest('hex');
const cases = [
  ['collect-transparent', '#usages [data-usage="collect"] .carte-icone { background: transparent !important; }'],
  ['check-border', '#usages [data-usage="check"] .carte-icone { border: 1px solid var(--ligne-forte) !important; }'],
  ['compare-split', '#usages [data-usage="compare"] .carte-icone { background: linear-gradient(90deg,var(--surface-feuille) 49%,var(--ligne) 49%,var(--ligne) 51%,var(--surface-feuille) 51%) !important; }'],
  ['follow-active', '#usages [data-usage="follow"] .carte-icone { border-bottom: 3px solid var(--accent-appui) !important; }'],
  ['decide-mint', '#usages [data-usage="decide"] .carte-icone { background: var(--accent-voile) !important; }'],
  ['compare-mix', '#usages [data-usage="compare"] { background: color-mix(in srgb,var(--accent-voile) 45%,var(--surface-feuille)) !important; }'],
  ['follow-mix', '#usages [data-usage="follow"] { background: color-mix(in srgb,var(--accent-voile) 65%,var(--surface-page)) !important; }'],
];
const results = [];
try {
  for (const [id, css] of cases) {
    writeFileSync(target, original.toString().replace('</head>', `<style>${css}</style></head>`));
    const run = spawnSync('npx', ['playwright', 'test', 'tests/browser/bento-harmonisation.spec.ts', '--grep', '1440'], { env: { ...process.env, QA_URL: 'http://127.0.0.1:4371' }, encoding: 'utf8' });
    writeFileSync(`.qa/harmonisation/witness-${id}.log`, run.stdout + run.stderr);
    assert.equal(run.status, 1, `${id} doit échouer`);
    assert.match(run.stdout, /Error: expect\(received\)/, `${id} doit échouer sur une assertion, pas sur le harnais`);
    results.push({ id, rejected: true });
  }
} finally { writeFileSync(target, original); }
assert.equal(sha(readFileSync(target)), sha(original));
writeFileSync('.qa/harmonisation/witnesses.json', JSON.stringify({ results, restoredSha256: sha(original) }, null, 2));
console.log(JSON.stringify({ witnesses: results.length, restored: true }));
