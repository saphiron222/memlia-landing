import assert from 'node:assert/strict';
import { test } from 'node:test';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const source = 'docs/design/m4-r1-functional-proofs';
const manifestPath = 'docs/qa/m4-r4/media-manifest.json';

// Each host renders its own isolated fixture; historical goldens remain untouched.
test('historical replay keeps all required proofs and declared derivatives fail-closed', async t => {
  mkdirSync('.qa', { recursive: true });
  const root = mkdtempSync(resolve('.qa/historical-proof-render-'));
  const run = (...args) => spawnSync(process.execPath, ['scripts/render-proof-images.mjs', ...args], {
    cwd: root, encoding: 'utf8', timeout: 60_000,
  });
  const succeeds = result => assert.equal(result.status, 0, result.stderr || result.error?.message);
  try {
    for (const path of [source, manifestPath, 'scripts/render-proof-images.mjs', 'package-lock.json', 'public/fonts', 'public/proofs']) {
      cpSync(path, join(root, path), { recursive: true });
    }
    symlinkSync(resolve('node_modules'), join(root, 'node_modules'), 'dir');
    // Include a still-required derivative without relying on retired blog covers.
    const manifest = JSON.parse(readFileSync(join(root, manifestPath), 'utf8'));
    const proof = manifest.entries.find(entry => entry.target === 'public/proofs/01-flux.webp');
    manifest.entries.push({ source: proof.target, target: 'public/proofs/test-derived-768.webp', derivative: true });
    writeFileSync(join(root, manifestPath), JSON.stringify(manifest));
    succeeds(run());
    succeeds(run('--check'));
    const rendered = JSON.parse(readFileSync(join(root, '.qa/annotations/render/report.json'), 'utf8'));
    assert.equal(rendered.records.length, 9);
    assert.equal(rendered.assets.length, 10);

    const mutate = async (name, path, change, expected) => t.test(name, () => {
      const absolute = join(root, path);
      const original = readFileSync(absolute);
      try {
        change(absolute, original);
        const result = run('--check');
        assert.notEqual(result.status, 0, 'invalid replay accepted');
        assert.match(result.stderr, expected);
      } finally {
        writeFileSync(absolute, original);
      }
    });
    const editJson = edit => (path, bytes) => {
      const data = JSON.parse(bytes);
      edit(data);
      writeFileSync(path, JSON.stringify(data));
    };
    for (const [label, path, message] of [
      ['PNG', `${source}/renders/01-flux.png`, /PNG périmé/],
      ['WebP', proof.target, /Actif périmé/],
      ['derivative', 'public/proofs/test-derived-768.webp', /Actif périmé/],
    ]) {
      await mutate(`${label} missing`, path, absolute => rmSync(absolute), /ENOENT/);
      await mutate(`${label} divergent`, path, (absolute, bytes) => writeFileSync(absolute, Buffer.concat([bytes, Buffer.from('changed')])), message);
    }
    await mutate('required manifest entry missing', manifestPath,
      editJson(data => { data.entries = data.entries.filter(entry => entry.target !== proof.target); }), /Cible non répertoriée/);
    await mutate('manifest digest stale', manifestPath,
      editJson(data => { data.entries.find(entry => entry.target === proof.target).sha256 = 'stale'; }), /Manifeste périmé/);
    await mutate('manifest size stale', manifestPath,
      editJson(data => { data.entries.find(entry => entry.target === proof.target).bytes++; }), /Taille périmée/);
    await mutate('manifest source divergent', manifestPath,
      editJson(data => { data.entries.find(entry => entry.target === proof.target).source = 'wrong'; }), /Source divergente/);
    await mutate('manifest duplicate target', manifestPath,
      editJson(data => { data.entries.push(data.entries.find(entry => entry.target === proof.target)); }), /Cible dupliquée/);
    await mutate('render provenance stale', manifestPath,
      editJson(data => { data.proofRender.sources[0].sha256 = 'stale'; }), /Chaîne de rendu périmée/);
    await mutate('required proof missing from contract', `${source}/content-contract.json`,
      editJson(data => { data.pop(); }), /Contrat incomplet/);
    await mutate('functional text divergent', `${source}/content-contract.json`,
      editJson(data => { data[0].centralText = 'divergent'; }), /Contenu fonctionnel divergent/);
    await mutate('unknown derivative source', manifestPath,
      editJson(data => { data.entries.find(entry => entry.target === 'public/proofs/test-derived-768.webp').source = 'public/proofs/unknown.webp'; }), /Source de dérivé inconnue/);
    succeeds(run('--check'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
