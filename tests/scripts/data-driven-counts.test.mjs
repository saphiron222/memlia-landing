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


test('les compteurs commerciaux actifs viennent des catalogues, sans ancien total de pôles', () => {
  const home = read('src/data/accueil/ec.ts');
  const robots = read('src/components/catalogue/HubRobots.astro');
  const agents = read('src/components/catalogue/HubAgents.astro');
  assert.match(home, /\$\{ROBOTS\.length\}/);
  assert.match(robots, /\{ROBOTS\.length\}/);
  assert.match(robots, /comptesRobots\(\)/);
  assert.match(agents, /\{AGENTS\.length\}/);
  assert.match(agents, /comptesParGroupe\(\)/);
  for (const source of [home, robots, agents]) assert.doesNotMatch(source, /soixante familles|douze pôles|21 robots|12 agents IA/);
});

test('le catalogue de compatibilités parcourt tous les domaines et tous les logiciels, sans filtre d’éditeur figé', () => {
  const source = read('src/pages/integrations/index.astro');
  const section = read('src/components/sections/ConnecteursDomaine.astro');
  assert.match(source, /DOMAINES\.map/);
  assert.match(section, /connecteursDu\(domaine\.id\)/);
  assert.match(section, /cartes\.map/);
  assert.doesNotMatch(source, /INTEGRATIONS_INDEXABLES|data-guide-filters|Neuf guides/);
});

test('les guides historiques ne sont plus un second catalogue public', async () => {
  const { INTEGRATIONS_INDEXABLES, INTEGRATIONS_ARCHIVEES } = await import('../../src/data/integrations.ts');
  assert.deepEqual(INTEGRATIONS_INDEXABLES, []);
  assert.equal(INTEGRATIONS_ARCHIVEES.length, 12);
  assert.doesNotMatch(read('src/pages/integrations/index.astro'), /IntegrationCards|RelatedIntegrations/);
  assert.doesNotMatch(read('src/components/catalogue/HubRobots.astro'), /INTEGRATIONS_INDEXABLES|hub-guides/);
});

test('les catalogues et tâches agents sont des destinations commerciales, pas les adresses externes ou paramétrées', () => {
  for (const href of ['/commissaires-aux-comptes', '/agents-ia/paie-social', '/agents-ia/comptabilite#regle', '/automatisation-cabinet-comptable', '/integrations']) assert.equal(estLienCommercialBlog(href), true);
  for (const href of ['/blog/fictif', 'https://exemple.fr', '/commissaires-aux-comptes?x=1', '/commissaires-aux-comptes-autre']) assert.equal(estLienCommercialBlog(href), false);
});

test('le hub agents compose les cartes et filtres depuis les données, même si un groupe change', async () => {
  const page = read('src/pages/agents-ia/index.astro');
  const hub = read('src/components/catalogue/HubAgents.astro');
  assert.match(page, /import HubAgents/);
  assert.match(hub, /AGENTS\.map/);
  assert.match(hub, /GROUPES\.map/);
  assert.match(hub, /value="\$\{id\}"/);
  assert.match(hub, /comptes\[g\.id\]/);
  const { AGENTS, GROUPES, HUB, comptesParGroupe } = await import('../../src/data/specialistes.ts');
  const counts = comptesParGroupe();
  assert.equal(Object.values(counts).reduce((sum, count) => sum + count, 0), AGENTS.length);
  for (const group of GROUPES) assert.equal(counts[group.id], AGENTS.filter(a => a.groupe === group.id).length);
  const COMPTE_ECRIT = /\b(?:[2-9]|1\d|deux|trois|quatre|cinq|six|sept|huit|neuf|dix|onze|douze)\s+(?:agents?|fiches?|métiers)\b/iu;
  assert.doesNotMatch(hub.replace(/\/\*[\s\S]*?\*\//g, ''), COMPTE_ECRIT);
  assert.doesNotMatch(JSON.stringify(HUB), COMPTE_ECRIT);
});
