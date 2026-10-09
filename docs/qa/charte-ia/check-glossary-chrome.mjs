import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { parse, serialize } from 'parse5';
import { digest } from '../../../scripts/lib/resource-pipeline.mjs';
const html = path => readFileSync(path, 'utf8');
function main(source) {
  const doc = parse(source);
  const visit = node => node.nodeName === 'main' ? node : (node.childNodes ?? []).map(visit).find(Boolean);
  return serialize(visit(doc));
}
const before = html('../baseline/dist/glossaire.html');
const after = html('dist/glossaire.html');
assert.equal(main(before), main(after), 'La matière du glossaire a changé');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(html('../baseline/editorial/resources/glossaire/manifest.json'));
const bundle = manifest.integrity.buildOutput;
const entry = bundle.entries.find(entry => entry.path === 'dist/glossaire.html');
assert.equal(hash(before), entry.sha256, 'Le témoin ne reproduit pas le rendu initial');
const old = { bytes: entry.bytes, sha256: entry.sha256, digest: bundle.digest };
entry.bytes = Buffer.byteLength(after); entry.sha256 = hash(after);
const next = { bytes: entry.bytes, sha256: entry.sha256, digest: digest(bundle.entries) };
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), glossaryMainIdentical: true, originalReviewPreserved: true, reason: 'Ajout du lien outil 04 dans le footer généré ; aucune matière du glossaire modifiée.', old, next }, null, 2));
