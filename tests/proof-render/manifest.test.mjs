import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source = 'docs/design/m4-r1-functional-proofs';
const manifestPath = 'docs/qa/m4-r4/media-manifest.json';

for (const derivative of [false, true]) {
  test(`rendu et recalcul avec ${derivative ? 'un dérivé déclaré' : 'aucun dérivé'}`, () => {
    mkdirSync(resolve(root, '.qa/proof-render-tests'), { recursive: true });
    const cwd = mkdtempSync(resolve(root, '.qa/proof-render-tests/case-'));
    try {
      for (const path of [source, 'public/fonts', 'scripts/render-proof-images.mjs', 'package-lock.json']) {
        const target = resolve(cwd, path);
        mkdirSync(dirname(target), { recursive: true });
        cpSync(resolve(root, path), target, { recursive: true });
      }
      const manifest = JSON.parse(readFileSync(resolve(root, manifestPath), 'utf8'));
      manifest.entries = manifest.entries.filter(entry => entry.target.startsWith('public/proofs/'));
      if (derivative) manifest.entries.push({
        target: 'public/blog/test-proof-800.webp',
        source: manifest.entries[0].target,
        derivative: true,
      });
      for (const entry of manifest.entries) mkdirSync(dirname(resolve(cwd, entry.target)), { recursive: true });
      mkdirSync(dirname(resolve(cwd, manifestPath)), { recursive: true });
      writeFileSync(resolve(cwd, manifestPath), JSON.stringify(manifest));
      const run = args => {
        const result = spawnSync(process.execPath, ['scripts/render-proof-images.mjs', ...args], {
          cwd, encoding: 'utf8', timeout: 120_000,
        });
        assert.equal(result.status, 0, result.stderr || result.error?.message);
      };
      run([]);
      const report = JSON.parse(readFileSync(resolve(cwd, '.qa/annotations/render/report.json'), 'utf8'));
      assert.deepEqual(report.assets.map(asset => asset.target).sort(), manifest.entries.map(entry => entry.target).sort());
      for (const png of JSON.parse(readFileSync(resolve(cwd, manifestPath), 'utf8')).proofRender.pngs) {
        assert.deepEqual(readFileSync(resolve(cwd, png.path)), readFileSync(resolve(root, png.path)), `Visuel modifié : ${png.path}`);
      }
      run(['--check']);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
}
