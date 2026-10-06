import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { preparerGuide, scellerGuide, auditerGuides } from '../../scripts/lib/guide-forge.mjs';

const project = resolve(import.meta.dirname, '../..');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const write = (root, path, data) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), JSON.stringify(data, null, 2) + '\n'); };

test('un guide scellé produit réellement sa page, son média, ses liens hub et moyeu via Astro', async t => {
  const root = mkdtempSync(join(tmpdir(), 'guide-render-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of ['src','public','scripts/lib/sitemaps.mjs','astro.config.mjs','tsconfig.json','package.json']) cpSync(join(project, path), join(root, path), { recursive: true });
  symlinkSync(join(project, 'node_modules'), join(root, 'node_modules'), 'dir');
  const recipe = JSON.parse(readFileSync(join(project, 'guides/recettes/rapprochement-bancaire-sage/recette.json')));
  recipe.mode = 'nouveau'; recipe.author = 'auteur-fixture';
  const d = recipe.integration;
  d.slug = 'guide-fixture-sage'; d.task = 'contrôle de test'; d.primaryQuery = 'controle fixture sage';
  d.h1 = 'Contrôle fixture Sage : règle illustrative'; d.product = 'Produit fixture Sage'; d.suggestions = 6;
  // Réponse simulée uniquement dans ce répertoire éphémère de test, jamais publiée.
  const evidence = { provider: 'google-autocomplete', measuredAt: '2026-10-06', endpoint: 'https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=fr&q=controle+fixture+sage', httpStatus: 200, response: [d.primaryQuery, Array.from({ length: 6 }, (_, i) => `${d.primaryQuery} ${i}`)] };
  const dir = `guides/recettes/${d.slug}`;
  write(root, `${dir}/autocomplete.json`, evidence);
  recipe.demand = { evidencePath: 'autocomplete.json', sha256: sha(readFileSync(join(root, dir, 'autocomplete.json'))) };
  write(root, `${dir}/recette.json`, recipe);
  assert.equal((await preparerGuide({ root, slug: d.slug })).pass, true);
  write(root, `${dir}/revue.json`, { kind: 'qa', status: 'PASS', reviewer: 'qa-fixture', reviewedAt: '2026-10-06', candidateSha256: sha(readFileSync(join(root, dir, 'recette.json'))), observations: ['Revue simulée du test de rendu.'] });
  assert.equal((await scellerGuide({ root, slug: d.slug })).pass, true);
  assert.equal(auditerGuides({ root }).pass, true);
  const build = spawnSync(process.execPath, [join(project, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 5_000_000 });
  assert.equal(build.status, 0, build.stdout + build.stderr);
  const page = readFileSync(join(root, `dist/integrations/${d.slug}.html`), 'utf8');
  assert.match(page, /<h1[^>]*>Contrôle fixture Sage : règle illustrative<\/h1>/);
  assert.ok(page.includes(`/proofs/integrations/${d.slug}.webp`));
  assert.ok(page.includes(`href="https://memlia.fr/integrations/${d.slug}"`));
  for (const path of ['integrations.html','automatisation/rapprochement-bancaire.html']) {
    const html = readFileSync(join(root, 'dist', path), 'utf8');
    assert.ok(html.includes(`href="/integrations/${d.slug}"`), path);
  }
  assert.ok(readFileSync(join(root, 'dist/integrations.html'), 'utf8').includes(d.product), 'nouveau produit réellement listé au hub');
  assert.ok(readFileSync(join(root, `dist/proofs/integrations/${d.slug}.webp`)).length > 1000);
});
