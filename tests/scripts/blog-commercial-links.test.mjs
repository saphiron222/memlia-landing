import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { LIENS_COMMERCIAUX_BLOG, lienCommercialPourArticle } from '../../src/data/blog-commercial-links.mjs';

const ROOT = process.cwd();
const registre = JSON.parse(readFileSync(join(ROOT, 'docs/strategy/site-v3/mesures/registre-requetes.json'), 'utf8'));
const articles = registre.articles.filter((entree) => entree.type === 'blog');

const liensAttendus = new Map([
  ['automatiser-la-saisie-comptable-ce-qui-reste-a-verifier', '/automatisation/saisie-comptable'],
  ['comprendre-les-comptes-rendus-metier-dsn', '/automatisation/paie'],
  ['controler-les-bulletins-de-paie-avant-la-dsn', '/automatisation/paie'],
  ['suivre-la-production-sociale-dans-excel', '/automatisation/paie'],
]);
const pontsW39 = new Map([
  ['logiciel-ia-comptabilite', { href: '/automatisation-cabinet-comptable', label: 'Voir le service d’automatisation sur mesure' }],
  ['prompt-chatgpt-expert-comptable', { href: '/automatisation-cabinet-comptable', label: 'Voir comment automatiser une règle de cabinet' }],
  ['tests-verts-et-regle-des-trois-passes', { href: '/automatisation-cabinet-comptable', label: 'Voir le service d’automatisation et sa recette' }],
]);

function verifierCardinalite(articlesPublies) {
  const slugsAttendus = new Set([...articlesPublies.map(({ slug }) => slug), ...pontsW39.keys()]);
  assert.equal(Object.keys(LIENS_COMMERCIAUX_BLOG).length, slugsAttendus.size);
}

test('chaque article publié reçoit un pont commercial explicite après le corps éditorial', () => {
  verifierCardinalite(articles);
  for (const entree of articles) {
    const lien = lienCommercialPourArticle(entree.slug);
    assert.match(lien.href, /^\/automatisation(?:-cabinet-comptable|\/[a-z0-9-]+)$/);
    assert.ok(lien.label.trim(), `${entree.slug} : libellé commercial vide`);
    assert.ok(Object.hasOwn(LIENS_COMMERCIAUX_BLOG, entree.slug), `${entree.slug} : repli non autorisé pour un article publié`);
  }
});

test('le passage de 9 à 12 articles publiés ne double-compte pas les trois ponts W39', () => {
  const articlesHistoriques = articles.filter(({ slug }) => !pontsW39.has(slug));
  assert.equal(articlesHistoriques.length, 9);
  verifierCardinalite(articlesHistoriques);
  const articlesPublies = [...articlesHistoriques, ...[...pontsW39.keys()].map((slug) => ({ type: 'blog', slug }))];
  assert.equal(articlesPublies.length, 12);
  verifierCardinalite(articlesPublies);
  for (const { slug } of articlesPublies) {
    assert.ok(Object.hasOwn(LIENS_COMMERCIAUX_BLOG, slug), `${slug} : pont explicite absent après publication`);
  }
});

test('les trois articles W39 ont un pont explicite avant leur publication, sans repli générique', () => {
  for (const [slug, lien] of pontsW39) {
    assert.ok(Object.hasOwn(LIENS_COMMERCIAUX_BLOG, slug), `${slug} : pont explicite absent`);
    assert.deepEqual(lienCommercialPourArticle(slug), lien);
  }
});

test('les articles spécialisés mènent directement à la page service correspondante', () => {
  for (const [slug, cible] of liensAttendus) {
    assert.equal(lienCommercialPourArticle(slug).href, cible, `${slug} → ${cible}`);
  }
});

test('le build rend le pont commercial attendu dans chaque article publié', () => {
  for (const entree of articles) {
    const lien = lienCommercialPourArticle(entree.slug);
    const html = readFileSync(join(ROOT, 'dist/blog', `${entree.slug}.html`), 'utf8');
    assert.match(
      html,
      new RegExp(`href="${lien.href}"[^>]{0,200}class="btn btn-lien"`),
      `${entree.slug} : pont commercial absent du rendu`,
    );
    assert.ok(html.includes(lien.label), `${entree.slug} : libellé commercial absent du rendu`);
  }
});
