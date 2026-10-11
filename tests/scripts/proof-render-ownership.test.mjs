import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '../..');
const manifestPath = 'docs/qa/m4-r4/media-manifest.json';

test('le rendu respecte les propriétaires du manifeste et garde le contrôle des neuf preuves', { timeout: 120_000 }, () => {
  const fixture = mkdtempSync(join(tmpdir(), 'proof-render-ownership-'));
  try {
    for (const path of ['docs/design/m4-r1-functional-proofs', 'public/fonts', 'public/proofs', manifestPath, 'scripts/render-proof-images.mjs', 'package-lock.json']) {
      mkdirSync(dirname(join(fixture, path)), { recursive: true });
      cpSync(join(root, path), join(fixture, path), { recursive: true });
    }
    symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir');
    const manifest = JSON.parse(readFileSync(join(fixture, manifestPath), 'utf8'));
    const foreign = manifest.entries.filter(entry => !entry.target.startsWith('public/proofs/'));
    // Les couvertures actuelles appartiennent à la forge éditoriale : le renderer
    // accueil ne doit ni lire leur master ni remplacer leurs actifs/manifeste.
    for (const entry of foreign.filter(entry => entry.derivative)) {
      mkdirSync(dirname(join(fixture, entry.target)), { recursive: true });
      writeFileSync(join(fixture, entry.target), 'actif du propriétaire éditorial');
    }
    const run = (...args) => spawnSync(process.execPath, ['scripts/render-proof-images.mjs', ...args], {
      cwd: fixture, encoding: 'utf8', timeout: 45_000,
    });
    const rendered = run();
    assert.equal(rendered.status, 0, rendered.stderr);
    const sealed = JSON.parse(readFileSync(join(fixture, manifestPath), 'utf8'));
    assert.deepEqual(sealed.entries.filter(entry => !entry.target.startsWith('public/proofs/')), foreign);
    for (const entry of foreign.filter(entry => entry.derivative)) {
      assert.equal(readFileSync(join(fixture, entry.target), 'utf8'), 'actif du propriétaire éditorial');
    }
    const verified = run('--check');
    assert.equal(verified.status, 0, verified.stderr);
    const before = readFileSync(join(fixture, manifestPath));
    writeFileSync(join(fixture, 'public/proofs/01-flux.webp'), 'altération');
    const rejected = run('--check');
    assert.notEqual(rejected.status, 0);
    assert.match(rejected.stderr, /Actif périmé/);
    assert.deepEqual(readFileSync(join(fixture, manifestPath)), before);
    assert.equal(readFileSync(join(fixture, 'public/proofs/01-flux.webp'), 'utf8'), 'altération');
  } finally {
    rmSync(fixture, { recursive: true, force: true });
  }
});
