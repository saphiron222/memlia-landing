import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { preparerGuide, scellerGuide, publierGuide, auditerGuides } from '../../scripts/lib/guide-forge.mjs';

const project = resolve(import.meta.dirname, '../..');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const write = (root, path, data) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), JSON.stringify(data, null, 2) + '\n'); };

test('la forge archive un guide synthétique, dont le rendu Astro reste isolé des 24 routes retirées', async t => {
  const root = mkdtempSync(join(tmpdir(), 'guide-render-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of ['src','public','config','scripts/lib/sitemaps.mjs','scripts/lib/responsive-proofs.mjs','scripts/render-social-images.mjs','astro.config.mjs','tsconfig.json','package.json']) cpSync(join(project, path), join(root, path), { recursive: true });
  // Seul le candidat synthétique est scellé dans ce dossier, pas le corpus public copié.
  write(root, 'src/data/guides.generated.json', []);
  write(root, 'src/data/guide-proofs.generated.json', {});
  // Le catalogue public n'active plus aucun guide. Le banc de rendu opt-in ne construit
  // que le candidat synthétique scellé ci-dessous, jamais un des guides retirés par Kevin.
  const registryPath = join(root, 'src/data/integrations.ts');
  const registry = readFileSync(registryPath, 'utf8');
  const inactive = 'export const INTEGRATIONS_INDEXABLES: readonly IntegrationDefinition[] = [];';
  assert.ok(registry.includes(inactive), 'le vrai catalogue garde les guides hors des routes publiques');
  writeFileSync(registryPath, registry.replace(inactive,
    'export const INTEGRATIONS_INDEXABLES: readonly IntegrationDefinition[] = generatedGuides as IntegrationDefinition[];'));
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
  assert.deepEqual(JSON.parse(readFileSync(join(root, 'src/data/guides.generated.json'))), [d]);
  assert.deepEqual(Object.keys(JSON.parse(readFileSync(join(root, 'src/data/guide-proofs.generated.json')))), [`integrations/${d.slug}`]);
  assert.equal(auditerGuides({ root }).pass, true);
  const build = spawnSync(process.execPath, [join(project, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: root, encoding: 'utf8', timeout: 120000, maxBuffer: 5_000_000 });
  assert.equal(build.status, 0, build.stdout + build.stderr);
  const page = readFileSync(join(root, `dist/integrations/${d.slug}.html`), 'utf8');
  // Le titre de page passe par Insecable (#166) : « Sage : » reste sur une ligne, le texte ne change pas.
  assert.equal(page.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, ''), 'Contrôle fixture Sage : règle illustrative');
  assert.ok(page.includes(`/proofs/integrations/${d.slug}.webp`));
  assert.ok(page.includes(`href="https://memlia.fr/integrations/${d.slug}"`));
  const hub = readFileSync(join(root, 'dist/integrations.html'), 'utf8');
  assert.ok(hub.includes('Sources officielles') || hub.includes('logiciels'), 'le hub commun des compatibilités est réellement rendu');
  assert.ok(!hub.includes(`href="/integrations/${d.slug}"`), 'la forge de guides ne recrée pas un second catalogue public');
  const migration = JSON.parse(readFileSync(join(root, 'config/migration-catalogues.json'), 'utf8'));
  for (const row of migration.routes) {
    assert.ok(!existsSync(join(root, `dist${row.from}.html`)), `${row.from} reste retirée même dans le banc de rendu`);
  }
  const serviceMigration = migration.routes.find(row => row.from === d.service.href);
  assert.ok(serviceMigration, 'le lien du gabarit archivé possède une migration explicite');
  assert.ok(page.includes(`href="${d.service.href}"`), 'le rendu historique conserve son lien de service');
  const [target, anchor] = serviceMigration.to.split('#');
  const destination = readFileSync(join(root, `dist${target}.html`), 'utf8');
  assert.ok(destination.includes(`id="${anchor}"`), 'la destination actuelle porte la tâche correspondante');
  assert.ok(readFileSync(join(root, 'dist/_redirects'), 'utf8').includes(`${d.service.href} ${serviceMigration.to} 301`), 'le parcours historique arrive à cette tâche par une 301');
  assert.ok(readFileSync(join(root, `dist/proofs/integrations/${d.slug}.webp`)).length > 1000);
  const publication = await publierGuide({ root, slug: d.slug, fetchImpl: async url => {
    const path = new URL(url).pathname;
    if (path === '/robots.txt') return new Response('User-agent: *\nAllow: /\n');
    return new Response(readFileSync(join(root, 'dist', path.slice(1) + (path.endsWith('.webp') ? '' : '.html'))));
  } });
  assert.equal(publication.pass, true, publication.errors?.join('\n'));
  assert.equal(auditerGuides({ root }).pass, true);
});
