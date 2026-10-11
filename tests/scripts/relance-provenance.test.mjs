import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = resolve(import.meta.dirname, '../..');
const manifestPath = 'docs/qa/relance-facture/proofs-manifest.json';
const wrapper = 'scripts/render-relance-facture-proof.mjs';

test('la provenance relance est rafraîchie une seule fois par chemin après deux rendus et une évolution inerte', { timeout: 180_000 }, (t) => {
  const fixture = mkdtempSync(join(tmpdir(), 'relance-provenance-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  for (const path of ['docs/design', 'public/fonts', 'public/proofs/v2', manifestPath, wrapper, 'scripts/render-proofs-v2.mjs', 'src/lib']) {
    mkdirSync(dirname(join(fixture, path)), { recursive: true });
    cpSync(join(root, path), join(fixture, path), { recursive: true });
  }
  symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir');
  const manifest = JSON.parse(readFileSync(join(fixture, manifestPath), 'utf8'));
  const foreignPath = 'docs/design/site-v2-proofs/index.html';
  const foreign = { path: foreignPath, sha256: createHash('sha256').update(readFileSync(join(fixture, foreignPath))).digest('hex') };
  manifest.sources.push(foreign);
  // Anciennes variantes de chemin : un rendu doit aussi réparer ces doublons.
  manifest.sources.push({ ...manifest.sources.find(source => source.path === wrapper), path: `./${wrapper}` });
  writeFileSync(join(fixture, manifestPath), JSON.stringify(manifest));
  const run = (...args) => spawnSync(process.execPath, [wrapper, ...args], { cwd: fixture, encoding: 'utf8', timeout: 50_000 });
  for (let pass = 0; pass < 3; pass++) {
    if (pass === 2) appendFileSync(join(fixture, wrapper), '\n// Évolution inerte de provenance.\n');
    const rendered = run();
    assert.equal(rendered.status, 0, rendered.stderr);
    const sealed = JSON.parse(readFileSync(join(fixture, manifestPath), 'utf8'));
    const normalized = sealed.sources.map(source => resolve(fixture, source.path));
    assert.equal(new Set(normalized).size, normalized.length, 'une occurrence par chemin normalisé');
    assert.deepEqual(sealed.sources.find(source => source.path === foreignPath), foreign);
    const before = readFileSync(join(fixture, manifestPath));
    const checked = run('--check');
    assert.equal(checked.status, 0, checked.stderr);
    assert.deepEqual(readFileSync(join(fixture, manifestPath)), before);
  }
});
