// Rejeu depuis la racine du candidat, après construction du témoin ../baseline
// sur la version de main intégrée. Ne change que le chrome, jamais la matière revue.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { digest } from '../../../scripts/lib/resource-pipeline.mjs';
const base = 'docs/qa/charte-ia/correction';
const manifestPath = 'editorial/resources/glossaire/manifest.json';
const instrument = 'scripts/.reaffirm-charte-chrome.mjs';
const sha = value => createHash('sha256').update(value).digest('hex');
const json = path => JSON.parse(readFileSync(path, 'utf8'));
const save = (path, value) => writeFileSync(path, JSON.stringify(value, null, 2) + '\n');
function run(command, args) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout;
}
const baseline = json('../baseline/' + manifestPath);
const manifest = json(manifestPath);
assert.deepEqual(manifest.claimsEvidence, baseline.claimsEvidence, 'La matière ou les verdicts ont changé depuis main');
console.log(run('node', ['docs/qa/charte-ia/check-glossary-chrome.mjs']));
// Le même instrument fail-closed, avec ses sorties isolées de la revue historique.
let source = readFileSync('scripts/reaffirm-resource-review.mjs', 'utf8');
for (const [name, path] of Object.entries({ ANCRE: `${base}/sujet-ancre.json`, DECLARATION: `${base}/declaration.json`, RAPPORT: `${base}/reaffirmation.json` })) {
  source = source.replace(new RegExp(`const ${name} = [^;]+;`), `const ${name} = '${path}';`);
}
writeFileSync(instrument, source);
try {
  console.log(run('node', [instrument, 'ancrer']));
  save(`${base}/declaration.json`, { schemaVersion: 2, deltasAutorises: { buildOutputDigest: 'Ajout de la charte au footer : main sérialisé identique au témoin intégré ; affirmations, copies et 27 verdicts conservés.' } });
  const bytes = readFileSync('dist/glossaire.html');
  manifest.integrity.buildOutput.entries = [{ path: 'dist/glossaire.html', bytes: bytes.length, sha256: sha(bytes) }];
  manifest.integrity.buildOutput.digest = digest(manifest.integrity.buildOutput.entries);
  save(manifestPath, manifest);
  const receiptText = run('node', ['docs/qa/charte-ia/replay-chrome-build.mjs']);
  writeFileSync(`${base}/build-receipt.json`, receiptText);
  const receipt = JSON.parse(receiptText);
  Object.assign(manifest.build, { startedAt: receipt.startedAt, endedAt: receipt.endedAt, outputDigest: manifest.integrity.buildOutput.digest, receiptRef: `${base}/build-receipt.json`, receiptSha256: sha(receiptText) });
  save(manifestPath, manifest);
  console.log(run('node', [instrument, 'reaffirmer']));
  const after = json(manifestPath);
  assert.deepEqual(after.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts, baseline.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts);
  assert.equal(after.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts.length, 27);
  console.log('PASS : matière identique à main, deux reconstructions, 27 verdicts conservés.');
} finally {
  unlinkSync(instrument);
}
