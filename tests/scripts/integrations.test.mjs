import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { integrationInventory, assertIntegrationCoverage } from './integration-inventory.mjs';

const root = process.cwd();
const source = readFileSync(join(root, 'src/data/integrations.ts'), 'utf8');
const dist = join(root, 'dist');

const compiled = ts.transpileModule(source.replace("import generatedGuides from './guides.generated.json' with { type: 'json' };", `const generatedGuides = ${readFileSync(join(root, 'src/data/guides.generated.json'), 'utf8')};`), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { INTEGRATIONS, INTEGRATION_CANDIDATES: historicalCandidates } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const generated = JSON.parse(readFileSync(join(root, 'src/data/guides.generated.json'), 'utf8'));
const candidates = [...historicalCandidates, ...generated.map(({ task, vendor, suggestions }) => ({ task, vendor, suggestions, status: 'forte' }))];
const { slugs, primaryQueries } = integrationInventory(INTEGRATIONS, candidates);

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function textContent(html) {
  return decodeEntities(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

test('la grille conserve ses planchers et affiche tous les comptes source', () => {
  const proof = readFileSync(join(root, 'docs/design/integration-proofs/index.html'), 'utf8');
  const hub = proof.split('id="rapprochement-bancaire-sage"')[0];
  assert.doesNotMatch(hub, /formulations mesurées|suggestions ou plus|variations|page maigre|guides ouverts/);
  for (const product of ['Sage 100 Comptabilité', 'Sage 100 Paie &amp; RH', 'Cegid Loop', 'mySilae']) assert.ok(hub.includes(product));
  assert.match(hub, /La préparation s’arrête et présente le motif/);
});

test('le cadre du hub illustre les sorties attendues sans annoncer un rejeu exécuté', () => {
  const proof = readFileSync(join(root, 'docs/design/integration-proofs/index.html'), 'utf8');
  const hub = proof.split('id="rapprochement-bancaire-sage"')[0];
  const contract = JSON.parse(readFileSync(join(root, 'docs/design/integration-proofs/content-contract.json'), 'utf8'));
  for (const text of [textContent(hub), contract.find(({ id }) => id === 'hub').centralText]) {
    assert.match(text, /Contrôle illustré sur un cas fictif/);
    assert.doesNotMatch(text, /Contrôle rejoué|résultats exécutés/);
  }
  const guide = readFileSync(join(root, 'src/pages/integrations/[slug].astro'), 'utf8');
  assert.match(guide, /sorties attendues de la règle proposée, pas des résultats exécutés/);
});

test('les guides restent audités comme archives et aucune ancienne route HTML n’est construite', () => {
  const audit = spawnSync(process.execPath, ['scripts/service-forge.mjs', '--guide', 'audit'], { encoding: 'utf8', timeout: 30_000 });
  assert.equal(audit.status, 0, `${audit.stdout}\n${audit.stderr}`);
  const rendered = existsSync(join(dist, 'integrations')) ? readdirSync(join(dist, 'integrations'))
    .filter((name) => name.endsWith('.html')).map((name) => name.replace(/\.html$/, '')).sort() : [];
  assertIntegrationCoverage(rendered, []);
  assert.equal(slugs.length, 12, 'le retrait du rendu ne supprime aucune archive');
});

test('les douze archives conservent intention, source, auteur, dates et cas illustratifs propres', () => {
  const sourceUrls = new Set();
  for (const guide of INTEGRATIONS) {
    assert.ok(guide.h1.toLocaleLowerCase('fr').startsWith(primaryQueries.get(guide.slug)), `${guide.slug}: H1 intent-first`);
    assert.equal(guide.auteur, 'kevin');
    assert.match(guide.datePublication, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(guide.dateMiseAJour, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(guide.source.url.startsWith('https://'), `${guide.slug}: source éditeur`);
    assert.ok(!sourceUrls.has(guide.source.url), `${guide.slug}: source propre`);
    sourceUrls.add(guide.source.url);
    assert.ok(guide.documentScope.length > 80, `${guide.slug}: portée documentaire conservée`);
    assert.deepEqual([...new Set(guide.replay.map(cas => cas.outcome))].sort(), ['Arrêt', 'Préparé', 'À valider'].sort());
    assert.ok(guide.writtenRule.length > 40, `${guide.slug}: règle écrite conservée`);
    assert.ok(Object.values(guide.boundary).every(value => value.length > 20), `${guide.slug}: frontière conservée`);
  }
});

test('le hub utilise le chrome commun et les guides gardent leur coque commerciale', () => {
  const hub = readFileSync(join(root, 'src/pages/integrations/index.astro'), 'utf8');
  const guide = readFileSync(join(root, 'src/pages/integrations/[slug].astro'), 'utf8');
  assert.match(hub, /import Base from '@\/layouts\/Base\.astro'/, 'hub : chrome commun');
  assert.doesNotMatch(hub, /<header\b|<footer\b|:root\s*\{/, 'hub : aucun chrome ni token global dupliqué');
  assert.match(guide, /import PageCommerciale from '@\/layouts\/PageCommerciale\.astro'/, 'guides : coque canonique');
  assert.doesNotMatch(guide, /<style>/, 'guides : pas de grammaire CSS locale');
});

test('les guides conservent auteur et dates dans le schéma sans signature éditoriale', () => {
  const guide = readFileSync(join(root, 'src/pages/integrations/[slug].astro'), 'utf8');
  const hub = readFileSync(join(root, 'src/pages/integrations/index.astro'), 'utf8');
  const data = readFileSync(join(root, 'src/data/integrations.ts'), 'utf8');
  assert.match(guide, /datePublished: integration\.datePublication/);
  assert.match(guide, /dateModified: integration\.dateMiseAJour/);
  assert.match(guide, /author: \{ '@id': authorUrl \}/);
  assert.doesNotMatch(guide, /Par <a rel="author"|integration\.independence|ni partenariat|compatibilité déjà acquise/);
  assert.doesNotMatch(hub, /Par <a rel="author"/);
  assert.doesNotMatch(data, /independence:|Independence\s*=/);
});

test('toutes les routes intégrations ont chacune une preuve figée manifestée', () => {
  const manifest = JSON.parse(readFileSync(join(root, 'docs/qa/integration-proofs/proofs-manifest.json'), 'utf8'));
  const generatedProofs = JSON.parse(readFileSync(join(root, 'src/data/guide-proofs.generated.json'), 'utf8'));
  const targets = [...manifest.entries.map((entry) => entry.target), ...Object.keys(generatedProofs).map((key) => `public/proofs/${key}.webp`)];
  assert.ok(targets.length >= 10, 'plancher : dix preuves');
  assertIntegrationCoverage(targets, [
    'public/proofs/integrations/hub.webp',
    ...slugs.map((slug) => `public/proofs/integrations/${slug}.webp`),
  ]);
  for (const target of targets) assert.ok(readFileSync(join(root, target)).length < 150_000, `${target}: moins de 150 Ko`);
});

test('le catalogue commun remplace les anciens rayons : aucun guide ni service retiré dans le maillage final', () => {
  const migration = JSON.parse(readFileSync(join(root, 'config/migration-catalogues.json'), 'utf8'));
  const paths = ['index.html', 'integrations.html', 'agents-ia.html', 'automatisation-cabinet-comptable.html'];
  for (const file of paths) {
    const html = readFileSync(join(dist, file), 'utf8');
    for (const row of migration.routes) {
      assert.ok(!html.includes(`href="${row.from}"`) && !html.includes(`href="https://memlia.fr${row.from}"`), `${file}: lien retiré ${row.from}`);
    }
  }
  const hub = readFileSync(join(dist, 'integrations.html'), 'utf8');
  assert.doesNotMatch(hub, /data-integration-cards|data-guide-product|data-guide-filters|Guides par environnement/iu);
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.equal([...home.matchAll(/<a class="pied-lien" href="\/integrations"[^>]*>Intégrations<\/a>/g)].length, 1);
});

test('le footer ne rend chaque destination légale qu’une seule fois', () => {
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  for (const href of ['/mentions-legales', '/politique-de-confidentialite']) {
    assert.equal([...home.matchAll(new RegExp(`href="${href}"`, 'g'))].length, 1, href);
  }
  assert.doesNotMatch(home, /<h2 class="pied-titre">Légal<\/h2>/);
});
