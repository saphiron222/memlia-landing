import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const manifestPath = 'docs/qa/site-v2/proofs-manifest.json';
const owner = 'docs/design/site-v2-proofs/index.html';

test('le rendu v2 remplace sa série, préserve les séries indépendantes et refuse leurs cibles', { timeout: 240_000 }, (t) => {
  const fixture = mkdtempSync(join(tmpdir(), 'proofs-v2-ownership-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  for (const path of ['docs/design', 'public/fonts', 'public/proofs/v2', manifestPath, 'scripts/render-proofs-v2.mjs']) {
    mkdirSync(dirname(join(fixture, path)), { recursive: true });
    cpSync(join(root, path), join(fixture, path), { recursive: true });
  }
  symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir');
  const manifest = JSON.parse(readFileSync(join(fixture, manifestPath), 'utf8'));
  const foreign = manifest.entries.filter(entry => !entry.source.startsWith(`${owner}#`));
  assert.ok(foreign.length > 0, 'la fixture contient des preuves indépendantes');
  const foreignSources = manifest.sources.filter(entry => !entry.path.startsWith('docs/design/site-v2-proofs/') && !entry.path.startsWith('scripts/') && !entry.path.startsWith('docs/design/m4-r1-functional-proofs/'));
  const snapshots = [...foreign.map(entry => entry.target), ...foreignSources.map(entry => entry.path)]
    .map(path => ({ path, bytes: readFileSync(join(fixture, path)) }));
  const obsolete = { ...manifest.entries[0], source: `${owner}#retire`, target: 'public/proofs/v2/ancien.webp' };
  manifest.entries.push(obsolete);
  writeFileSync(join(fixture, manifestPath), JSON.stringify(manifest));
  const run = (...args) => spawnSync(process.execPath, ['scripts/render-proofs-v2.mjs', ...args], {
    cwd: fixture, encoding: 'utf8', timeout: 100_000,
  });
  const rendered = run('--source=./docs/design/site-v2-proofs');
  assert.equal(rendered.status, 0, rendered.stderr);
  const sealed = JSON.parse(readFileSync(join(fixture, manifestPath), 'utf8'));
  assert.deepEqual(sealed.entries.filter(entry => !entry.source.startsWith(`${owner}#`) && !entry.source.startsWith(`./${owner}#`)), foreign);
  assert.deepEqual(sealed.sources.filter(entry => foreignSources.some(source => source.path === entry.path)), foreignSources);
  assert.ok(!sealed.entries.some(entry => entry.target === obsolete.target));
  assert.equal(new Set(sealed.entries.map(entry => entry.target)).size, sealed.entries.length);
  for (const { path, bytes } of snapshots) assert.deepEqual(readFileSync(join(fixture, path)), bytes, path);
  const beforeCheck = readFileSync(join(fixture, manifestPath));
  const checked = run('--check');
  assert.equal(checked.status, 0, checked.stderr);
  assert.deepEqual(readFileSync(join(fixture, manifestPath)), beforeCheck);

  // Une autre série revendique une cible du renderer : aucune écriture publiée n'est permise.
  sealed.entries[0].source = foreign[0].source;
  writeFileSync(join(fixture, manifestPath), JSON.stringify(sealed));
  const beforeCollision = readFileSync(join(fixture, manifestPath));
  const assets = sealed.entries.map(entry => ({ path: entry.target, bytes: readFileSync(join(fixture, entry.target)) }));
  const contractPath = join(fixture, 'docs/design/site-v2-proofs/content-contract.json');
  const beforeContract = readFileSync(contractPath);
  const rejected = run('--adopt');
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /Cible appartenant à une autre série/);
  assert.deepEqual(readFileSync(join(fixture, manifestPath)), beforeCollision);
  assert.deepEqual(readFileSync(contractPath), beforeContract);
  for (const { path, bytes } of assets) assert.deepEqual(readFileSync(join(fixture, path)), bytes, path);
});
