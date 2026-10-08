import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

// Cloudflare Pages supports one greedy splat with a suffix (e.g. /*.jpg).
// https://developers.cloudflare.com/pages/configuration/headers/
const rules = [];
for (const line of readFileSync('public/_headers', 'utf8').split('\n')) {
  if (!line.trim() || line.trimStart().startsWith('#')) continue;
  if (!/^\s/.test(line)) rules.push({ path: line.trim(), headers: [] });
  else rules.at(-1).headers.push(line.trim());
}
const matches = (pattern, path) => new RegExp(`^${pattern.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*')}$`).test(path);
const robotsFor = (path) => rules.filter((rule) => matches(rule.path, path))
  .flatMap((rule) => rule.headers).filter((header) => /^X-Robots-Tag:/i.test(header));
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? files(path) : [path.replace(/^public/, '')];
  });
}
const assets = files('public');

test('tous les AVIF publics reçoivent uniquement noindex', () => {
  const avifs = assets.filter((path) => path.endsWith('.avif'));
  assert.ok(avifs.length > 0, 'des AVIF doivent être présents pour exercer le contrat');
  for (const path of avifs) assert.deepEqual(robotsFor(path), ['X-Robots-Tag: noindex'], path);
});

test('WebP, PNG et pages ne reçoivent pas de restriction d’indexation', () => {
  const indexable = assets.filter((path) => /\.(webp|png)$/.test(path));
  assert.ok(indexable.some((path) => path.endsWith('.webp')));
  assert.ok(indexable.some((path) => path.endsWith('.png')));
  for (const path of [...indexable, '/', '/blog', '/outils-comptables-gratuits', '/outils-comptables-gratuits/test']) {
    assert.deepEqual(robotsFor(path), [], path);
  }
});

test('la règle AVIF couvre aussi les nouveaux dossiers, sans englober les autres extensions', () => {
  assert.deepEqual(robotsFor('/nouveau/dossier/image.avif'), ['X-Robots-Tag: noindex']);
  assert.deepEqual(robotsFor('/images/image.avif.webp'), []);
  assert.deepEqual(robotsFor('/images/image.avif/page'), []);
});
