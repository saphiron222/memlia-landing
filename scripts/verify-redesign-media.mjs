/** Compare les médias réellement servis aux fichiers locaux, au manifeste et au commit parent. */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const base = process.env.QA_URL;
assert.ok(base?.startsWith('https://'));
const parent = '76214ba85602b88689e82fb235069dc5baa849bd';
const manifest = JSON.parse(readFileSync('docs/qa/m4-r4/media-manifest.json', 'utf8'));
const entries = manifest.entries.filter(entry => entry.target.startsWith('public/'));
assert.equal(entries.length, 25);
assert.equal(manifest.entries.length - entries.length, 1);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const report = [];
for (const entry of entries) {
  const local = readFileSync(entry.target);
  const ancestor = execFileSync('git', ['show', `${parent}:${entry.target}`], { maxBuffer: 32 * 1024 * 1024 });
  assert.equal(hash(local), hash(ancestor), `Média parent changé : ${entry.target}`);
  assert.equal(hash(local), entry.sha256);
  const response = await fetch(new URL(entry.target.slice('public'.length), base));
  assert.equal(response.status, 200);
  const remote = Buffer.from(await response.arrayBuffer());
  assert.equal(remote.length, entry.bytes);
  assert.equal(hash(remote), hash(local));
  assert.match(response.headers.get('x-robots-tag') ?? '', /noindex/);
  report.push({ path: entry.target, bytes: remote.length, sha256: hash(remote), parentIdentical: true, noindex: true });
}
const result = { base, parent, checked: report.length, excluded: 1, exclusion: 'Script documentaire non public', report };
writeFileSync('.qa/redesign/remote-media.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify({ base, checked: report.length, parentIdentical: true, noindex: true }));
