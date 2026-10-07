import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const AUTHOR_ID = 'https://memlia.fr/a-propos#kevin-kitanga';
const ORGANIZATION_ID = 'https://memlia.fr/#organization';

const pages = [
  { route: '/automatisation/paie', modified: '2026-10-06' },
  { route: '/automatisation/saisie-comptable', modified: '2026-10-06' },
  { route: '/automatisation/rapprochement-bancaire', modified: '2026-10-06' },
  { route: '/automatisation/notes-de-frais', modified: '2026-10-06' },
  { route: '/automatisation/factures-fournisseurs', modified: '2026-10-06' },
  { route: '/automatisation-cabinet-comptable', modified: '2026-10-06' },
  { route: '/methode', modified: '2026-10-04' },
  { route: '/garanties', modified: '2026-10-06' },
  { route: '/a-propos', modified: '2026-09-21' },
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
test('les neuf pages hors blog gardent un Person relié, sans signature, dates visibles ni section de sources', () => {
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

// Oracle indépendant de page-eeat.ts : chaque source publique est un lien posé sur ces mots-là du texte rendu.
const citations = [
  { route: '/automatisation/paie', url: 'https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/', mot: 'tout dépôt' },
  { route: '/automatisation/saisie-comptable', url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F31808', mot: 'les champs' },
  { route: '/automatisation/rapprochement-bancaire', url: 'https://www.anc.gouv.fr/plan-comptable-general-0', mot: 'des écritures' },
  { route: '/automatisation/notes-de-frais', url: 'https://www.service-public.fr/particuliers/vosdroits/F19846', mot: 'un justificatif' },
  { route: '/automatisation-cabinet-comptable', url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2', mot: 'des données fictives' },
  { route: '/garanties', url: 'https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees', mot: 'une mesure individuelle continue' },
  { route: '/methode', url: '/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils', mot: 'le cadrage' },
];

test('chaque source se cite par un lien sur un mot du texte de sa page', () => {
  for (const { route, url, mot } of citations) {
    const main = htmlFor(route).split('<main')[1]?.split('</main>')[0] ?? '';
    const liens = [...main.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)];
    assert.ok(liens.some(([, href, texte]) => href === url && texte === mot), `${route} : « ${mot} » porte ${url}`);
  }
});
