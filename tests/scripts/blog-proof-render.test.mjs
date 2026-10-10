import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';

const project = resolve(import.meta.dirname, '../..');
const manifestPath = 'docs/qa/blog-article-proofs/manifest.json';
const manifest = JSON.parse(readFileSync(join(project, manifestPath), 'utf8'));
const files = [...manifest.sources.map(({ path }) => path), manifestPath, ...manifest.entries.map(({ target }) => target)];
const contract = JSON.parse(readFileSync(join(project, 'docs/design/blog-article-proofs/content-contract.json')));
files.push(...new Set(contract.map(({ article }) => `editorial/recettes/${article}/recette.json`).filter((path) => existsSync(join(project, path)))));

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-proof-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of files) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    copyFileSync(join(project, path), join(root, path));
  }
  return root;
}

function check(root) {
  return spawnSync(process.execPath, [join(project, 'scripts/render-blog-article-proofs.mjs'), '--check'], {
    cwd: root, env: { ...process.env, CF_PAGES: '1', PLAYWRIGHT_BROWSERS_PATH: join(root, 'no-browser') }, encoding: 'utf8',
  });
}

test('Cloudflare vérifie les preuves blog scellées sans Chromium', (t) => {
  const result = check(fixture(t));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`${manifest.entries.length} preuves scellées`));
});

test('Cloudflare refuse une recette F4 présente mais divergente', (t) => {
  const root = fixture(t);
  const path = join(root, 'editorial/recettes/cac-reception-fec-constat');
  mkdirSync(path, { recursive: true });
  writeFileSync(join(path, 'recette.json'), JSON.stringify({ inlineProofs: [{ id: 'autre' }] }));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Recette et contrat divergent/);
});

test('Cloudflare refuse une source blog modifiée', (t) => {
  const root = fixture(t);
  const path = join(root, 'docs/design/blog-article-proofs/styles.css');
  writeFileSync(path, `${readFileSync(path, 'utf8')}\n/* dérive */\n`);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Sources ou contrat de rendu périmés/);
});

test('Cloudflare refuse un WebP blog altéré', (t) => {
  const root = fixture(t);
  const path = join(root, manifest.entries[0].target);
  writeFileSync(path, Buffer.concat([readFileSync(path), Buffer.from('dérive')]));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Actif périmé/);
});

for (const [label, alter, message] of [
  ['une entrée -mobile', (entries) => { entries[0].target = entries[0].target.replace('.webp', '-mobile.webp'); }, /Aucune variante portrait/],
  ['une entrée manquante', (entries) => entries.pop(), /une image et une seule par preuve/],
]) {
  test(`Cloudflare refuse ${label}`, (t) => {
    const root = fixture(t);
    const altered = structuredClone(manifest);
    alter(altered.entries);
    writeFileSync(join(root, manifestPath), JSON.stringify(altered));
    const result = check(root);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  });
}

test('le témoin de rejeu fonctionne depuis un autre dossier courant', (t) => {
  const root = fixture(t);
  const cwd = join(root, 'autre-dossier');
  mkdirSync(cwd);
  const result = spawnSync(process.execPath, [join(project, 'tests/scripts/blog-replay-proof-consistency.test.mjs')], {
    cwd, encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stdout + result.stderr);
});
