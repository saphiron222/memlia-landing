import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { preparerGuide, scellerGuide, publierGuide, auditerGuides, verifierRecetteGuide } from '../../scripts/lib/guide-forge.mjs';

const sha = (s) => createHash('sha256').update(s).digest('hex');
const json = (root, path, data) => { mkdirSync(dirname(join(root, path)), { recursive: true }); writeFileSync(join(root, path), JSON.stringify(data, null, 2) + '\n'); };
const read = (root, path) => JSON.parse(readFileSync(join(root, path)));
const historical = read(process.cwd(), 'guides/recettes/rapprochement-bancaire-sage/recette.json');
function fixture(t, count = 6, source = process.cwd()) {
  const root = mkdtempSync(join(tmpdir(), 'guide-forge-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'src/data'), { recursive: true });
  copyFileSync(join(source, 'src/data/integrations.ts'), join(root, 'src/data/integrations.ts'));
  // Le corpus public a ses propres recettes et sceaux : ne pas importer ses entrées seules.
  json(root, 'src/data/guides.generated.json', []);
  json(root, 'src/data/guide-proofs.generated.json', {});
  const recipe = structuredClone(historical);
  recipe.mode = 'nouveau'; recipe.author = 'auteur-test';
  recipe.integration.slug = 'controle-test-sage'; recipe.integration.primaryQuery = 'controle test sage';
  recipe.integration.suggestions = count;
  recipe.integration.h1 = 'Controle test Sage : écrire la règle';
  recipe.demand = { evidencePath: 'autocomplete.json' };
  const response = ['controle test sage', Array.from({ length: count }, (_, i) => `controle test sage cas ${i + 1}`)];
  const evidence = { provider: 'google-autocomplete', measuredAt: '2026-10-06', endpoint: 'https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=fr&q=controle+test+sage', httpStatus: 200, response };
  recipe.demand.sha256 = sha(JSON.stringify(evidence, null, 2) + '\n');
  const dir = `guides/recettes/${recipe.integration.slug}`;
  json(root, `${dir}/recette.json`, recipe); json(root, `${dir}/autocomplete.json`, evidence);
  return { root, recipe, dir, slug: recipe.integration.slug };
}
const review = (f) => json(f.root, `${f.dir}/revue.json`, { kind: 'qa', status: 'PASS', reviewer: 'qa-independant', reviewedAt: '2026-10-06', candidateSha256: sha(readFileSync(join(f.root, f.dir, 'recette.json'))), observations: ['Frontière et simulation relues.'] });
const served = (recipe, root) => async (url) => url.endsWith('.webp') ? new Response(readFileSync(join(root, `public/proofs/integrations/${recipe.integration.slug}.webp`))) : url.endsWith('/robots.txt') ? new Response('User-agent: *\nAllow: /\n', { status: 200 }) : response(recipe);
const response = (recipe, options = {}) => {
  const d = recipe.integration;
  const copy = [d.intro, d.documentScope, d.officialPath, d.knownTrap, d.writtenRule, ...d.fields.flatMap(f => [f.label, f.control]), ...Object.values(d.boundary), ...d.replay.flatMap(Object.values)].join(' ');
  const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
  return new Response(`<html><head><link rel="canonical" href="https://memlia.fr/integrations/${d.slug}"></head><body><h1>${d.h1}</h1><template data-guide-sha256="${sha(JSON.stringify(d))}"></template><p>${escape(copy)}</p><a href="${d.source.url}" title="${escape(d.source.title)}">source</a><img src="/proofs/integrations/${d.slug}.webp"></body></html>`, { status: 200, headers: { 'content-type': 'text/html', ...options.headers } });
};

test('page vide, ancien corps, identité absente/divergente et preuve absente/altérée refusés sans reçu', async (t) => {
  const f = fixture(t); await preparerGuide(f); review(f); await scellerGuide(f);
  const good = await response(f.recipe).text();
  const alterations = [
    () => `<link rel="canonical" href="https://memlia.fr/integrations/${f.slug}"><h1>${f.recipe.integration.h1}</h1>`,
    html => html.replace(/<p>.*?<\/p>/, '<p>ancien corps</p>'),
    html => html.replace(/<template.*?<\/template>/, ''),
    html => html.replace(/data-guide-sha256="[^"]+"/, 'data-guide-sha256="autre"'),
    html => html.replace(/<img[^>]+>/, ''),
    html => html.replace(/ title="[^"]*">source</, '>source<'),
  ];
  for (const alter of alterations) {
    const fetchImpl = async url => url.endsWith(`/integrations/${f.slug}`) ? new Response(alter(good)) : served(f.recipe, f.root)(url);
    assert.equal((await publierGuide({ ...f, fetchImpl })).pass, false);
    assert.equal(read(f.root, `guides/etats/${f.slug}/manifest.json`).status, 'scelle');
    assert.equal(existsSync(join(f.root, `guides/etats/${f.slug}/publication.json`)), false);
  }
  for (const proofResponse of [new Response('absent', { status: 404 }), new Response('autre image')]) {
    const fetchImpl = async url => url.endsWith('.webp') ? proofResponse : served(f.recipe, f.root)(url);
    assert.equal((await publierGuide({ ...f, fetchImpl })).pass, false);
    assert.equal(existsSync(join(f.root, `guides/etats/${f.slug}/publication.json`)), false);
  }
});

test('données absentes, entiers seuls et données fictives refusés', async (t) => {
  const f = fixture(t);
  assert.ok(verifierRecetteGuide({ root: f.root, recipe: {} }).length);
  for (const evidence of [{ suggestions: 6 }, { provider: 'fiction', response: ['controle test sage', ['a','b','c','d','e','f']] }]) {
    json(f.root, `${f.dir}/autocomplete.json`, evidence);
    const result = await preparerGuide(f);
    assert.equal(result.pass, false);
    assert.equal(existsSync(join(f.root, 'guides/etats', f.slug, 'manifest.json')), false);
  }
});

test('frontière mesurée 5 refus / 6 accepté et actif WebP réellement rendu', async (t) => {
  const five = fixture(t, 5); assert.equal((await preparerGuide(five)).pass, false);
  const six = fixture(t, 6); assert.equal((await preparerGuide(six)).pass, true);
  const bytes = readFileSync(join(six.root, `public/proofs/integrations/${six.slug}.webp`));
  assert.equal(bytes.subarray(8, 12).toString(), 'WEBP'); assert.ok(bytes.length > 1000);
  const sharp = (await import('sharp')).default;
  const meta = await sharp(bytes).metadata(); assert.equal(meta.width, 1600); assert.equal(meta.height, 900);
});

test('suggestions distinctes, requête liée et source de mesure contrôlées', async (t) => {
  for (const alter of [e => e.response[1].fill('controle test sage doublon'), e => e.response[0] = 'autre requête', e => e.endpoint = 'https://example.com/?q=controle+test+sage', e => e.fictitious = true]) {
    const f = fixture(t); const e = read(f.root, `${f.dir}/autocomplete.json`); alter(e);
    json(f.root, `${f.dir}/autocomplete.json`, e); f.recipe.demand.sha256 = sha(readFileSync(join(f.root, f.dir, 'autocomplete.json'))); json(f.root, `${f.dir}/recette.json`, f.recipe);
    assert.equal((await preparerGuide(f)).pass, false);
  }
});

test('revue indépendante PASS liée au candidat obligatoire, une seule QA', async (t) => {
  const f = fixture(t); await preparerGuide(f);
  assert.equal((await scellerGuide(f)).pass, false);
  review(f); assert.equal((await scellerGuide(f)).pass, true);
  assert.equal(auditerGuides({ root: f.root }).pass, true);
  assert.equal(read(f.root, 'src/data/guides.generated.json')[0].slug, f.slug);
  assert.ok(read(f.root, 'src/data/guide-proofs.generated.json')[`integrations/${f.slug}`]);
});

test('auto-revue, verdict absent et empreinte périmée refusés', async (t) => {
  for (const change of [r => r.reviewer = 'auteur-test', r => delete r.status, r => r.candidateSha256 = '0'.repeat(64)]) {
    const f = fixture(t); await preparerGuide(f); review(f);
    const r = read(f.root, `${f.dir}/revue.json`); change(r); json(f.root, `${f.dir}/revue.json`, r);
    assert.equal((await scellerGuide(f)).pass, false);
  }
});

test('mutations recette, preuve, rendu, sceau et collection font échouer audit/publication', async (t) => {
  for (const target of ['recette.json', 'autocomplete.json', 'revue.json', '@asset', '@seal', '@collection']) {
    const f = fixture(t); await preparerGuide(f); review(f); await scellerGuide(f);
    const path = target === '@asset' ? `public/proofs/integrations/${f.slug}.webp` : target === '@seal' ? `guides/etats/${f.slug}/scellement.json` : target === '@collection' ? 'src/data/guides.generated.json' : `${f.dir}/${target}`;
    writeFileSync(join(f.root, path), Buffer.concat([readFileSync(join(f.root, path)), Buffer.from(target === '@asset' ? 'mutation' : '\n ')]));
    assert.equal(auditerGuides({ root: f.root }).pass, false, target);
    assert.equal((await publierGuide({ ...f, fetchImpl: served(f.recipe, f.root) })).pass, false, target);
  }
});

test('publication constate HTTP, canonical, H1 et indexabilité avant transition', async (t) => {
  const f = fixture(t); await preparerGuide(f); review(f); await scellerGuide(f);
  for (const fetchImpl of [async () => new Response('absent', { status: 404 }), async () => new Response('<h1>autre</h1>'), async () => response(f.recipe, { headers: { 'x-robots-tag': 'noindex' } }), async () => new Response(`<link rel="canonical" href="https://memlia.fr/integrations/${f.slug}"><meta name="robots" content="noindex"><h1>${f.recipe.integration.h1}</h1>`), async () => { throw new Error('offline'); }]) {
    assert.equal((await publierGuide({ ...f, fetchImpl })).pass, false);
    assert.equal(read(f.root, `guides/etats/${f.slug}/manifest.json`).status, 'scelle');
  }
  assert.equal((await publierGuide({ ...f, fetchImpl: served(f.recipe, f.root) })).pass, true);
  assert.equal(read(f.root, `guides/etats/${f.slug}/manifest.json`).status, 'publie');
  assert.equal(auditerGuides({ root: f.root }).pass, true);
});

test('robots.txt bloquant le guide, même HTTP 200 et meta index, refuse publication', async (t) => {
  const f = fixture(t); await preparerGuide(f); review(f); await scellerGuide(f);
  const fetchImpl = async url => url.endsWith('/robots.txt') ? new Response('User-agent: *\nDisallow: /integrations/\n') : served(f.recipe, f.root)(url);
  assert.equal((await publierGuide({ ...f, fetchImpl })).pass, false);
  assert.equal(read(f.root, `guides/etats/${f.slug}/manifest.json`).status, 'scelle');
});

test('inventaire du candidat et métadonnées du sceau ne peuvent pas être amputés', async (t) => {
  const f = fixture(t); await preparerGuide(f);
  const path = `guides/etats/${f.slug}/manifest.json`;
  const m = read(f.root, path); delete m.files[`public/proofs/integrations/${f.slug}.webp`]; json(f.root, path, m);
  review(f); assert.equal((await scellerGuide(f)).pass, false);
});

test('rejeu idempotent et publié immuable ; reçu de publication scellé', async (t) => {
  const f = fixture(t); await preparerGuide(f); review(f); await scellerGuide(f);
  await publierGuide({ ...f, fetchImpl: served(f.recipe, f.root) });
  const before = readFileSync(join(f.root, `guides/etats/${f.slug}/scellement.json`));
  assert.equal((await preparerGuide(f)).pass, true); assert.equal((await scellerGuide(f)).pass, true);
  assert.equal((await publierGuide({ ...f, fetchImpl: () => { throw Error('doit être idempotent'); } })).pass, true);
  assert.deepEqual(readFileSync(join(f.root, `guides/etats/${f.slug}/scellement.json`)), before);
  const receipt = `guides/etats/${f.slug}/publication.json`;
  const altered = read(f.root, receipt); altered.httpStatus = 500; json(f.root, receipt, altered);
  assert.equal(auditerGuides({ root: f.root }).pass, false);
  f.recipe.integration.intro += ' Modification.'; json(f.root, `${f.dir}/recette.json`, f.recipe);
  assert.equal((await preparerGuide(f)).pass, false);
});

test('une mutation pendant la requête réseau refuse la publication sans reçu', async (t) => {
  const f = fixture(t); await preparerGuide(f); review(f); await scellerGuide(f);
  const fetchImpl = async url => {
    if (url.endsWith('/robots.txt')) {
      f.recipe.integration.intro += ' mutation concurrente';
      json(f.root, `${f.dir}/recette.json`, f.recipe);
      return new Response('User-agent: *\nAllow: /\n');
    }
    return served(f.recipe, f.root)(url);
  };
  assert.equal((await publierGuide({ ...f, fetchImpl })).pass, false);
  assert.equal(existsSync(join(f.root, `guides/etats/${f.slug}/publication.json`)), false);
});

test('nouvel éditeur, moyeu publié et revue métier sont acceptés', async (t) => {
  const f = fixture(t);
  f.recipe.integration.vendor = 'ACD';
  f.recipe.integration.service = { href: '/automatisation/test-cac', label: 'La tâche CAC' };
  f.recipe.reviewKind = 'metier';
  json(f.root, `${f.dir}/recette.json`, f.recipe);
  const service = join(f.root, 'src/content/services/test-cac.md');
  mkdirSync(dirname(service), { recursive: true }); writeFileSync(service, '---\nstatus: publie\n---\n');
  const result = await preparerGuide(f);
  assert.equal(result.pass, true, result.errors?.join('\n'));
  review(f);
  assert.equal((await scellerGuide(f)).pass, false);
  const r = read(f.root, `${f.dir}/revue.json`); r.kind = 'metier'; json(f.root, `${f.dir}/revue.json`, r);
  assert.equal((await scellerGuide(f)).pass, true);
});

test('fixture synthétique indépendante d’un corpus source non vide', (t) => {
  const source = mkdtempSync(join(tmpdir(), 'guide-source-'));
  t.after(() => rmSync(source, { recursive: true, force: true }));
  mkdirSync(join(source, 'src/data'), { recursive: true });
  copyFileSync('src/data/integrations.ts', join(source, 'src/data/integrations.ts'));
  json(source, 'src/data/guides.generated.json', [{ slug: 'guide-source' }]);
  json(source, 'src/data/guide-proofs.generated.json', { 'integrations/guide-source': { source: 'source.webp' } });
  const f = fixture(t, 6, source);
  assert.deepEqual(read(f.root, 'src/data/guides.generated.json'), []);
  assert.deepEqual(read(f.root, 'src/data/guide-proofs.generated.json'), {});
  assert.equal(auditerGuides({ root: f.root }).pass, true);
  assert.deepEqual(read(source, 'src/data/guides.generated.json'), [{ slug: 'guide-source' }]);
  assert.deepEqual(read(source, 'src/data/guide-proofs.generated.json'), { 'integrations/guide-source': { source: 'source.webp' } });
});

test('audit refuse toujours les entrées générées orphelines', (t) => {
  const f = fixture(t);
  json(f.root, 'src/data/guides.generated.json', [{ slug: 'guide-orphelin' }]);
  json(f.root, 'src/data/guide-proofs.generated.json', { 'integrations/guide-orphelin': {} });
  const result = auditerGuides({ root: f.root });
  assert.equal(result.pass, false);
  assert.ok(result.errors.some(e => e.includes('Guide généré sans sceau : guide-orphelin')));
});

test('recette historique datée rejouée sans modifier un corpus déjà scellé ni sa preuve', async (t) => {
  const f = fixture(t);
  assert.equal((await preparerGuide(f)).pass, true); review(f);
  assert.equal((await scellerGuide(f)).pass, true);
  const preservedPaths = ['src/data/integrations.ts', 'src/data/guides.generated.json', 'src/data/guide-proofs.generated.json', `public/proofs/integrations/${f.slug}.webp`, `guides/etats/${f.slug}/manifest.json`, `guides/etats/${f.slug}/scellement.json`];
  const corpusBefore = preservedPaths.map(path => readFileSync(join(f.root, path)));
  const recipe = structuredClone(historical); const slug = recipe.integration.slug;
  const dir = `guides/recettes/${slug}`;
  json(f.root, `${dir}/recette.json`, recipe);
  const asset = `public/proofs/integrations/${slug}.webp`;
  mkdirSync(dirname(join(f.root, asset)), { recursive: true }); copyFileSync(asset, join(f.root, asset));
  const before = readFileSync(join(f.root, asset));
  assert.equal((await preparerGuide({ root: f.root, slug })).pass, true);
  assert.deepEqual(readFileSync(join(f.root, asset)), before);
  assert.equal((await preparerGuide({ root: f.root, slug })).idempotent, true);
  for (const [i, path] of preservedPaths.entries()) assert.deepEqual(readFileSync(join(f.root, path)), corpusBefore[i], path);
  assert.equal(auditerGuides({ root: f.root }).pass, true);
  recipe.integration.intro += ' falsification'; json(f.root, `${dir}/recette.json`, recipe);
  assert.equal((await preparerGuide({ root: f.root, slug })).pass, false);
  for (const [i, path] of preservedPaths.entries()) assert.deepEqual(readFileSync(join(f.root, path)), corpusBefore[i], path);
  assert.deepEqual(readFileSync(join(f.root, asset)), before);
});
