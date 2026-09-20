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

test('chaque article publié reçoit un pont commercial explicite après le corps éditorial', () => {
  assert.equal(Object.keys(LIENS_COMMERCIAUX_BLOG).length, articles.length);
  for (const entree of articles) {
    const lien = lienCommercialPourArticle(entree.slug);
    assert.match(lien.href, /^\/automatisation(?:-cabinet-comptable|\/[a-z0-9-]+)$/);
    assert.ok(lien.label.trim(), `${entree.slug} : libellé commercial vide`);
    assert.ok(Object.hasOwn(LIENS_COMMERCIAUX_BLOG, entree.slug), `${entree.slug} : repli non autorisé pour un article publié`);
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
