import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { estLienCommercialBlog } from '../../src/data/blog-commercial-links.mjs';

const read = (path) => readFileSync(path, 'utf8');

test('une troisième rubrique fictive rejoint le contrat sans retoucher ses tests', async () => {
  const source = read('src/data/blog-rubriques.mjs').replace('export const BLOG_RUBRIQUES = Object.freeze([', `export const BLOG_RUBRIQUES = Object.freeze([
    Object.freeze({ slug: 'fictive', chemin: '/blog/rubrique/fictive', articleIds: ['fictif-a', 'fictif-b'] }),`);
  const { BLOG_RUBRIQUES, construireRubriques } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  const entries = BLOG_RUBRIQUES.flatMap(({ articleIds }) => articleIds.map((id) => ({ id })));
  const hubs = construireRubriques(entries);
  assert.deepEqual(hubs.map(({ articles }) => articles.map(({ id }) => id)), BLOG_RUBRIQUES.map(({ articleIds }) => articleIds));
  assert.throws(() => construireRubriques(entries.filter(({ id }) => id !== 'fictif-b')), /minimum 2/);
  assert.doesNotMatch(read('tests/scripts/blog-rubriques.test.mjs'), /assert\.equal\(BLOG_RUBRIQUES\.length, 2\)/);
});

test('les compteurs des pages non scellées viennent de la taxonomie', () => {
  const usages = read('src/components/sections/Usages.astro');
  assert.match(usages, /contenuDe\('ec'\)\.usages/);
  assert.match(usages, /\{contenu\.texte\}/);
  for (const path of ['src/data/accueil/ec.ts', 'src/pages/methode.astro', 'src/pages/automatisation-cabinet-comptable.astro']) {
    const source = read(path);
    assert.match(source, /famillesDeLaProfession\('ec'\)/);
    assert.match(source, /new Set\(familles\.map\(\(\{ pole \}\) => pole\)\)\.size/);
    assert.match(source, /\$?\{familles\.length\}/);
    assert.match(source, /\$?\{nombrePoles\}/);
    assert.doesNotMatch(source, /soixante familles|douze pôles/);
  }
});


test('le hub ne masque pas un produit d’un nouvel éditeur', () => {
  const source = read('src/pages/integrations/index.astro');
  assert.match(source, /new Set\(INTEGRATIONS_INDEXABLES\.map\(/);
  assert.doesNotMatch(source, /Neuf guides/);
});

test('les guides par environnement d’une page se comptent depuis les données', () => {
  // Le garde du hub (« Neuf guides ») n'avait pas été porté à ce composant : il annonçait encore
  // « les neuf guides » quand il y en avait douze, et titrait un guide par sa requête (« Dsn sage »).
  const source = read('src/components/RelatedIntegrations.astro');
  assert.doesNotMatch(source, /neuf guides/i);
  assert.match(source, /\{INTEGRATIONS_INDEXABLES\.length\} guides/);
  assert.doesNotMatch(source, /primaryQuery/);
});

test('le pont CAC est accepté, pas une destination éditoriale ou externe', () => {
  for (const href of ['/commissaires-aux-comptes', '/automatisation/paie', '/automatisation-cabinet-comptable']) assert.equal(estLienCommercialBlog(href), true);
  for (const href of ['/blog/fictif', 'https://exemple.fr', '/commissaires-aux-comptes?x=1', '/commissaires-aux-comptes-autre']) assert.equal(estLienCommercialBlog(href), false);
});

test('le hub des agents IA ne compte pas ses agents à la main : le compteur et les filtres viennent des données', async () => {
  // Annexe §1.1 : « 12 agents IA » et le compte de chaque filtre se dérivent (AGENTS.length, comptesParGroupe()).
  // Un nombre écrit à la main reste vrai jusqu'au jour où un agent s'ajoute, puis ment sans que rien ne rougisse.
  const { readdirSync, existsSync } = await import('node:fs');
  const { join } = await import('node:path');
  const pages = existsSync('src/pages/agents-ia')
    ? readdirSync('src/pages/agents-ia', { recursive: true }).filter((f) => String(f).endsWith('.astro')).map((f) => join('src/pages/agents-ia', String(f)))
    : [];
  const sections = readdirSync('src/components/sections').filter((f) => /^(?:Agent\w*|Derriere)\.astro$/.test(f)).map((f) => join('src/components/sections', f));
  const sources = [...pages, ...sections];
  for (const attendu of ['src/pages/agents-ia/index.astro', 'src/components/sections/AgentAnnuaire.astro', 'src/components/sections/AgentCarte.astro']) {
    assert.ok(sources.includes(attendu), `${attendu} absent : le contrôle ne lirait rien`);
  }
  const COMPTE_ECRIT = /\b(?:[2-9]|1\d|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze)\s+(?:agents?|fiches?|métiers)\b/iu;
  for (const path of sources) assert.doesNotMatch(read(path), COMPTE_ECRIT, path);
  const annuaire = read('src/components/sections/AgentAnnuaire.astro');
  assert.match(annuaire, /\bagents\.length\b|\bAGENTS\.length\b/, 'compteur dérivé du tableau des agents');
  assert.match(annuaire, /comptesParGroupe\(\)/, 'compte de chaque filtre dérivé des données');
  // Le CSS ne compare pas deux attributs : chaque groupe a sa règle de masquage, écrite à la main. Un groupe
  // ajouté aux données sans la sienne laisserait son filtre sans effet.
  const { GROUPES } = await import('../../src/data/specialistes.ts');
  for (const { id } of GROUPES) assert.match(annuaire, new RegExp(`#filtre-${id}:checked`), `règle de masquage du filtre ${id}`);
  // La copie du hub vit dans HUB (specialistes.ts) : elle ne compte pas non plus à la main.
  const { HUB } = await import('../../src/data/specialistes.ts');
  const textes = JSON.stringify(HUB);
  assert.doesNotMatch(textes, COMPTE_ECRIT, 'HUB écrit un effectif à la main');
});
