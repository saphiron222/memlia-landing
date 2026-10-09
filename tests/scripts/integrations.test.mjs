import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';
import { integrationInventory, assertIntegrationCoverage } from './integration-inventory.mjs';

const root = process.cwd();
const source = readFileSync(join(root, 'src/data/integrations.ts'), 'utf8');
const dist = join(root, 'dist');

const compiled = ts.transpileModule(source.replace("import generatedGuides from './guides.generated.json' with { type: 'json' };", `const generatedGuides = ${readFileSync(join(root, 'src/data/guides.generated.json'), 'utf8')};`), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { INTEGRATIONS, INTEGRATIONS_HISTORIQUES, INTEGRATION_CANDIDATES: candidates } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const { primaryQueries, mappings } = integrationInventory(INTEGRATIONS_HISTORIQUES, candidates);
const slugs = INTEGRATIONS.map(entry => entry.slug);
for (const entry of INTEGRATIONS.filter(entry => !INTEGRATIONS_HISTORIQUES.includes(entry))) {
  primaryQueries.set(entry.slug, entry.primaryQuery);
  const file = `${entry.service.href.slice(1)}.html`;
  mappings.set(file, [...(mappings.get(file) ?? []), entry.slug]);
}

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

test('seuls les guides historiques et scellés produisent une page', () => {
  const audit = spawnSync(process.execPath, ['scripts/service-forge.mjs', '--guide', 'audit'], { encoding: 'utf8', timeout: 30_000 });
  assert.equal(audit.status, 0, `${audit.stdout}\n${audit.stderr}`);
  const rendered = readdirSync(join(dist, 'integrations'))
    .filter((name) => name.endsWith('.html'))
    .map((name) => name.replace(/\.html$/, ''))
    .sort();
  assertIntegrationCoverage(rendered, slugs);
});

test('chaque page porte une intention, une source, un auteur et une preuve propres', () => {
  const mediaIds = new Set();
  const sourceUrls = new Set();

  for (const slug of slugs) {
    const html = readFileSync(join(dist, 'integrations', `${slug}.html`), 'utf8');
    const h1 = decodeEntities(html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)?.[1] ?? '').replace(/<[^>]+>/g, '').trim();
    const ogTitle = decodeEntities(html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? '');
    const primaryQuery = primaryQueries.get(slug);
    assert.ok(primaryQuery, slug);
    assert.ok(h1.toLocaleLowerCase('fr').startsWith(primaryQuery), `${slug}: H1 intent-first`);
    assert.equal(ogTitle, h1, `${slug}: H1 = og:title`);
    assert.match(html, /"headline":"[^"]+"/, `${slug}: headline JSON-LD`);
    assert.match(html, /Kevin Kitanga/, `${slug}: auteur`);
    assert.match(html, /id="regle-ecrite"/, `${slug}: règle écrite`);
    assert.match(html, /id="jeu-fictif"/, `${slug}: jeu fictif`);
    assert.doesNotMatch(html, /Par Kevin Kitanga, mis à jour/, `${slug}: pas de signature dans le corps`);
    assert.doesNotMatch(html, /Memlia est indépendante de|ni partenariat|compatibilité déjà acquise/, `${slug}: pas d’avertissement défensif répété`);
    assert.doesNotMatch(html, /Source primaire|Ce qu’elle établit\.|<strong>Limite\.<\/strong>/, `${slug}: source éditoriale compacte`);

    const media = html.match(/<img\b[^>]*src="(\/proofs\/integrations\/[^\"]+\.webp)"[^>]*>/)?.[1];
    assert.equal(media, `/proofs/integrations/${slug}.webp`, `${slug}: média figé propre`);
    assert.ok(!mediaIds.has(media), `${slug}: média unique`);
    mediaIds.add(media);

    // Décision de Kevin du 06/10/2026 : le document de l'éditeur se cite dans le paragraphe de portée, pas dans une section.
    const sourceUrl = html.match(/aria-labelledby="repere-editeur"[\s\S]*?<a href="([^"]+)" rel="noopener noreferrer"/)?.[1];
    assert.ok(sourceUrl?.startsWith('https://'), `${slug}: source éditeur`);
    assert.ok(!sourceUrls.has(sourceUrl), `${slug}: source propre`);
    sourceUrls.add(sourceUrl);

    const words = textContent(html).split(/\s+/).filter(Boolean).length;
    assert.ok(words >= 650, `${slug}: ${words} mots, contenu trop mince`);
  }
});

test('le hub et les guides suivent la coque commerciale canonique sans CSS de page parallèle', () => {
  const hub = readFileSync(join(root, 'src/pages/integrations/index.astro'), 'utf8');
  const guide = readFileSync(join(root, 'src/pages/integrations/[slug].astro'), 'utf8');
  for (const [label, contenu] of [['hub', hub], ['guide', guide]]) {
    assert.match(contenu, /import PageCommerciale from '@\/layouts\/PageCommerciale\.astro'/, `${label}: coque canonique`);
    assert.doesNotMatch(contenu, /<style>/, `${label}: pas de grammaire CSS locale`);
  }
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
  const targets = manifest.entries.map((entry) => entry.target);
  assert.ok(targets.length >= 10, 'plancher : dix preuves');
  assertIntegrationCoverage(targets, [
    'public/proofs/integrations/hub.webp',
    ...slugs.map((slug) => `public/proofs/integrations/${slug}.webp`),
  ]);
  for (const target of targets) assert.ok(readFileSync(join(root, target)).length < 150_000, `${target}: moins de 150 Ko`);
});

test('les moyeux listent tous leurs rayons et le footer expose le hub', () => {
  for (const [file, expected] of mappings) {
    const html = readFileSync(join(dist, file), 'utf8');
    for (const slug of expected) assert.match(html, new RegExp(`href="/integrations/${slug}"`), `${file} → ${slug}`);
  }
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.match(home, /href="\/integrations"[^>]*>Guides par environnement<\/a>/);
});

test('le footer ne rend chaque destination légale qu’une seule fois', () => {
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  for (const href of ['/mentions-legales', '/politique-de-confidentialite']) {
    assert.equal([...home.matchAll(new RegExp(`href="${href}"`, 'g'))].length, 1, href);
  }
  assert.doesNotMatch(home, /<h2 class="pied-titre">Légal<\/h2>/);
});
