import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { createHash } from 'node:crypto';
import sharp from 'sharp';
import { parse } from 'parse5';

const project = resolve(import.meta.dirname, '../..');
const manifest = JSON.parse(readFileSync(join(project, 'docs/qa/integration-proofs/proofs-manifest.json'), 'utf8'));
const contract = JSON.parse(readFileSync(join(project, 'docs/design/integration-proofs/content-contract.json'), 'utf8'));
const files = [
  ...manifest.sources.map(({ path }) => path),
  'docs/qa/integration-proofs/proofs-manifest.json',
  ...manifest.entries.map(({ target }) => target),
];

test('les scènes montrent le geste sans chrome promotionnel ni mentions de coin', () => {
  const html = readFileSync(join(project, 'docs/design/integration-proofs/index.html'), 'utf8');
  assert.doesNotMatch(html, /class="brand"|class="foot"|<h1\b/i);
  assert.doesNotMatch(html, /Jeu fictif|aucun partenariat|aucune donnée client|Memlia/i);
  const nodesWithClass = (node, name) => [
    ...(node.attrs?.find((attr) => attr.name === 'class')?.value.split(/\s+/).includes(name) ? [node] : []),
    ...(node.childNodes ?? []).flatMap((child) => nodesWithClass(child, name)),
  ];
  const frames = nodesWithClass(parse(html), 'frame');
  assert.ok(frames.length >= 10, 'plancher : dix scènes');
  assert.deepEqual(frames.map((node) => node.attrs.find((attr) => attr.name === 'id')?.value), contract.map(({ id }) => id));
  for (const frame of frames) {
    assert.equal(nodesWithClass(frame, 'workspace').length, 1);
    assert.equal(nodesWithClass(frame, 'exception').length, 1);
  }
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

test('Cloudflare vérifie toutes les preuves scellées sans lancer Chromium', (t) => {
  const result = check(fixture(t));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`${contract.length} preuves intégrations scellées`));
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
  assert.match(result.stderr, /ne couvre pas toutes les scènes/);
});

function reseal(root, altered = structuredClone(manifest)) {
  altered.sources = altered.sources.map(({ path }) => ({ path, sha256: createHash('sha256').update(readFileSync(join(root, path))).digest('hex') }));
  writeFileSync(join(root, 'docs/qa/integration-proofs/proofs-manifest.json'), JSON.stringify(altered));
}

test('Cloudflare accepte une scène fictive supplémentaire manifestée sans plafond de dix', async (t) => {
  const root = fixture(t);
  const id = 'guide-fictif-nouveau';
  const contractPath = join(root, 'docs/design/integration-proofs/content-contract.json');
  writeFileSync(contractPath, JSON.stringify([...contract, { id, centralText: 'Scène supplémentaire' }]));
  const htmlPath = join(root, 'docs/design/integration-proofs/index.html');
  writeFileSync(htmlPath, readFileSync(htmlPath, 'utf8').replace('</main>', `<section class="frame" id="${id}"><div class="workspace">Scène supplémentaire<aside class="exception">Contrôle</aside></div></section></main>`));
  const bytes = await sharp({ create: { width: 8, height: 8, channels: 3, background: '#123456' } }).webp().toBuffer();
  const target = `public/proofs/integrations/${id}.webp`;
  writeFileSync(join(root, target), bytes);
  const altered = structuredClone(manifest);
  altered.entries.push({ source: `docs/design/integration-proofs/index.html#${id}`, target, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  reseal(root, altered);
  const result = check(root);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, new RegExp(`${contract.length + 1} preuves intégrations scellées`));
});

test('Cloudflare refuse le passage sous le plancher même avec sources et manifeste rescellés', (t) => {
  const root = fixture(t);
  writeFileSync(join(root, 'docs/design/integration-proofs/content-contract.json'), JSON.stringify(contract.slice(0, 9)));
  const altered = structuredClone(manifest);
  altered.entries = altered.entries.slice(0, 9);
  reseal(root, altered);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Au moins dix scènes/);
});

test('Cloudflare refuse une scène HTML absente même avec empreinte à jour', (t) => {
  const root = fixture(t);
  const path = join(root, 'docs/design/integration-proofs/index.html');
  writeFileSync(path, readFileSync(path, 'utf8').replace(/<section class="frame hub"[\s\S]*?<\/section>/, ''));
  reseal(root);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /scènes divergent du contrat/);
});

test('Cloudflare refuse des identités de contrat dupliquées après rescellage', (t) => {
  const root = fixture(t);
  const altered = structuredClone(contract);
  altered[1].id = altered[0].id;
  writeFileSync(join(root, 'docs/design/integration-proofs/content-contract.json'), JSON.stringify(altered));
  reseal(root);
  const result = check(root);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /identifiant unique/);
});
