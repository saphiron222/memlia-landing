import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';

const project = resolve(import.meta.dirname, '../..');
const manifest = JSON.parse(readFileSync(join(project, 'docs/qa/integration-proofs/proofs-manifest.json'), 'utf8'));
const files = [
  ...manifest.sources.map(({ path }) => path),
  'docs/qa/integration-proofs/proofs-manifest.json',
  ...manifest.entries.map(({ target }) => target),
];

test('les scènes montrent le geste sans chrome promotionnel ni mentions de coin', () => {
  const html = readFileSync(join(project, 'docs/design/integration-proofs/index.html'), 'utf8');
  assert.doesNotMatch(html, /class="brand"|class="foot"|<h1\b/i);
  assert.doesNotMatch(html, /Jeu fictif|aucun partenariat|aucune donnée client|Memlia/i);
  assert.equal((html.match(/class="frame(?:\s|\")/g) ?? []).length, 10);
  assert.equal((html.match(/class="workspace"/g) ?? []).length, 10);
  assert.equal((html.match(/class="exception"/g) ?? []).length, 10);
});

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'memlia-integration-proof-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of files) {
    const destination = join(root, path);
    mkdirSync(dirname(destination), { recursive: true });
    copyFileSync(join(project, path), destination);
  }
  return root;
}

function check(root) {
  return spawnSync(process.execPath, [join(project, 'scripts/render-integration-proofs.mjs'), '--check'], {
    cwd: root,
    env: { ...process.env, CF_PAGES: '1' },
    encoding: 'utf8',
  });
}

test('Cloudflare vérifie les dix preuves scellées sans lancer Chromium', (t) => {
  const result = check(fixture(t));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /10 preuves intégrations scellées/);
});

test('Cloudflare refuse une source de rendu modifiée', (t) => {
  const root = fixture(t);
  const path = join(root, 'docs/design/integration-proofs/styles.css');
  writeFileSync(path, `${readFileSync(path, 'utf8')}\n/* dérive */\n`);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Sources ou contrat de rendu périmés/);
});

test('Cloudflare refuse un WebP modifié', (t) => {
  const root = fixture(t);
  const path = join(root, manifest.entries[0].target);
  writeFileSync(path, Buffer.concat([readFileSync(path), Buffer.from('dérive')]));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Taille périmée|Actif périmé/);
});

test('Cloudflare refuse un manifeste qui omet une scène', (t) => {
  const root = fixture(t);
  const path = join(root, 'docs/qa/integration-proofs/proofs-manifest.json');
  const altered = structuredClone(manifest);
  altered.entries.pop();
  writeFileSync(path, JSON.stringify(altered));
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ne couvre pas les dix scènes/);
});
