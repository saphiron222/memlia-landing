import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const AUTHOR_ID = 'https://memlia.fr/a-propos#kevin-kitanga';
const ORGANIZATION_ID = 'https://memlia.fr/#organization';

const pages = [
  { route: '/methode', modified: '2026-10-15' },
  { route: '/garanties', modified: '2026-10-15' },
  { route: '/a-propos', modified: '2026-10-15' },
];

function htmlFor(route) {
  return readFileSync(join(ROOT, 'dist', `${route.slice(1)}.html`), 'utf8');
}

function graphFor(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, 'un bloc JSON-LD consolidé est attendu');
  return JSON.parse(scripts[0][1])['@graph'] ?? [];
}

// Décision de Kevin du 04/10/2026 : ces pages ne sont pas des articles ; ni signature ni dates visibles.
// Décision de Kevin du 06/10/2026 : aucune section « Sources » ni « Expérience de première main » ; une source se
// cite par un lien sur un mot ou un chiffre du texte. Le JSON-LD garde l'auteur et les dates.
test('les pages éditoriales gardent leur auteur réel, sans signature, dates visibles ni section de sources', () => {
  for (const page of pages) {
    const html = htmlFor(page.route);
    assert.doesNotMatch(html, /data-page-byline/, `${page.route} : aucune signature d’article`);
    assert.doesNotMatch(html, /Par <a[^>]*rel="author"/, `${page.route} : aucun « Par Kevin Kitanga » visible`);
    assert.doesNotMatch(html, /publié le <time/, `${page.route} : aucune date de publication visible`);
    assert.doesNotMatch(html, /mis à jour le <time/, `${page.route} : aucune date de mise à jour visible`);
    assert.doesNotMatch(html, /data-source-section|id="page-evidence-title"/, `${page.route} : aucune section Sources`);
    assert.doesNotMatch(html, /data-first-hand-experience/, `${page.route} : aucune section Expérience de première main`);

    const graph = graphFor(html);
    const person = graph.find((node) => node['@type'] === 'Person' && node['@id'] === AUTHOR_ID);
    assert.ok(person, `${page.route} : Person canonique`);
    assert.equal(person.worksFor?.['@id'], ORGANIZATION_ID, `${page.route} : Person reliée à Organization`);
    const pageNode = graph.find((node) => {
      const types = Array.isArray(node['@type']) ? node['@type'] : [node['@type']];
      return types.some((type) => typeof type === 'string' && type.endsWith('Page'));
    });
    assert.equal(pageNode?.author?.['@id'], AUTHOR_ID, `${page.route} : author canonique`);
    assert.match(pageNode?.datePublished ?? '', /^2026-09-(?:16|20)$/, `${page.route} : datePublished réelle`);
    assert.equal(pageNode?.dateModified, page.modified, `${page.route} : dateModified réelle`);
  }
});

test('les catalogues et leurs fiches citent l’auteur humain et le fournisseur, sans personnifier un agent ou un robot', () => {
  const fiches = ['automatisation', 'agents-ia'].flatMap((section) => readdirSync(join(ROOT, 'dist', section))
    .filter((file) => file.endsWith('.html')).map((file) => `/${section}/${file.slice(0, -5)}`));
  assert.equal(fiches.filter((route) => route.startsWith('/automatisation/')).length, 21);
  // Dix fiches métier ; Edmond et Octavie mènent aux pages transverses /methode et /integrations.
  assert.equal(fiches.filter((route) => route.startsWith('/agents-ia/')).length, 10);
  for (const route of ['/automatisation-cabinet-comptable', '/agents-ia', '/integrations', ...fiches]) {
    const html = htmlFor(route);
    const graph = graphFor(html);
    const page = graph.find((node) => node['@id'] === `https://memlia.fr${route}#page`);
    assert.equal(page?.author?.['@id'], AUTHOR_ID, `${route} : auteur réel canonique`);
    assert.equal(page?.dateModified, '2026-10-15', `${route} : date du catalogue approuvé`);
    assert.ok(graph.some((node) => node['@type'] === 'Organization' && node['@id'] === ORGANIZATION_ID), `${route} : fournisseur défini`);
    assert.ok(!graph.some((node) => node['@type'] === 'Person'), `${route} : aucune figurine déclarée comme une personne`);
    assert.ok(!graph.some((node) => ['SoftwareApplication', 'FAQPage', 'Review', 'AggregateRating'].includes(node['@type'])), `${route} : aucune application, FAQ ou preuve commerciale inventée`);
    if (fiches.includes(route)) {
      const service = graph.find((node) => node['@type'] === 'Service');
      assert.equal(service?.provider?.['@id'], ORGANIZATION_ID, `${route} : Service relié à Memlia`);
      assert.equal(page?.datePublished, '2026-10-15');
      assert.doesNotMatch(html, /data-page-byline|data-source-section|data-first-hand-experience/);
    }
  }
});

// Oracle indépendant de page-eeat.ts : chaque source publique est un lien posé sur ces mots-là du texte rendu.
const citations = [
  { route: '/agents-ia/paie-social', url: 'https://www.net-entreprises.fr/glossaire/tiers-declarant/', mot: 'votre compte déclarant' },
  { route: '/agents-ia/paie-social', url: 'https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/', mot: 'les comptes rendus métier' },
  { route: '/automatisation/cfe', url: 'https://www.impots.gouv.fr/professionnel/questions/comment-puis-je-acceder-mon-avis-de-cfe-et-le-payer', mot: 'DGFiP : consulter les avis de CFE et les payer' },
  { route: '/automatisation/taxes-foncieres', url: 'https://www.impots.gouv.fr/particulier/questions/quelle-date-vais-je-recevoir-mon-avis-de-taxe-fonciere-et-quand-dois-je-la', mot: 'DGFiP : mise à disposition des avis de taxe foncière' },
  { route: '/garanties', url: 'https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees', mot: 'une mesure individuelle continue' },
  { route: '/methode', url: '/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils', mot: 'Le cadrage' },
];

test('chaque source se cite par un lien sur un mot du texte de sa page', () => {
  for (const { route, url, mot } of citations) {
    const main = htmlFor(route).split('<main')[1]?.split('</main>')[0] ?? '';
    const liens = [...main.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)];
    assert.ok(liens.some(([, href, texte]) => href === url && texte === mot), `${route} : « ${mot} » porte ${url}`);
  }
});
