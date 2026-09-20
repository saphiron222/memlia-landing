import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const AUTHOR_ID = 'https://memlia.fr/a-propos#kevin-kitanga';
const ORGANIZATION_ID = 'https://memlia.fr/#organization';

const pages = [
  { route: '/automatisation/paie', sources: 1, experience: false },
  { route: '/automatisation/saisie-comptable', sources: 1, experience: false },
  { route: '/automatisation/rapprochement-bancaire', sources: 1, experience: false },
  { route: '/automatisation/notes-de-frais', sources: 1, experience: false },
  { route: '/automatisation/factures-fournisseurs', sources: 1, experience: false },
  { route: '/automatisation-cabinet-comptable', sources: 1, experience: true },
  { route: '/methode', sources: 0, experience: true },
  { route: '/garanties', sources: 1, experience: false },
  { route: '/a-propos', sources: 1, experience: false },
];

function htmlFor(route) {
  return readFileSync(join(ROOT, 'dist', `${route.slice(1)}.html`), 'utf8');
}

function graphFor(html) {
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1, 'un bloc JSON-LD consolidé est attendu');
  return JSON.parse(scripts[0][1])['@graph'] ?? [];
}

test('les neuf pages E-E-A-T rendent une attribution vraie, un Person relié et uniquement les preuves disponibles', () => {
  for (const page of pages) {
    const html = htmlFor(page.route);
    assert.match(html, /data-page-byline/, `${page.route} : byline visible`);
    assert.match(html, /rel="author"/, `${page.route} : lien auteur visible`);
    assert.match(html, /publié le <time datetime="2026-09-(?:16|20)"/, `${page.route} : publication visible`);
    assert.match(html, /mis à jour le <time datetime="2026-09-20"/, `${page.route} : modification visible`);
    assert.equal((html.match(/data-primary-source/g) ?? []).length, page.sources, `${page.route} : sources primaires`);
    assert.equal(html.includes('data-first-hand-experience'), page.experience, `${page.route} : expérience de première main`);

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
    assert.equal(pageNode?.dateModified, '2026-09-20', `${page.route} : dateModified réelle`);
  }
});
