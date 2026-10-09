import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as taxonomy from '../../src/data/blog-rubriques.mjs';
import * as contract from '../../scripts/verify-page-contract.mjs';

const direct = { ...taxonomy.BLOG_RUBRIQUES[0], slug: 'fixture-directe', chemin: '/blog/fixture-directe', articleIds: ['fixture-a', 'fixture-b'] };
const entries = [{ id: 'fixture-a' }, { id: 'fixture-b' }];

test('une rubrique directe utilise son chemin déclaré, pas son slug', () => {
  const routes = taxonomy.construireRoutesRubriques(entries, { rubriques: [{ ...direct, slug: 'autre-slug' }] });
  assert.equal(routes[0].param, 'fixture-directe');
  assert.equal(routes[0].historique, false);
  assert.equal(routes[0].rubrique.chemin, '/blog/fixture-directe');
  assert.deepEqual(routes[0].rubrique.articles, entries);
});

test('les routes EC gardent leur chemin et leur liste, sans alias direct', () => {
  const visibles = taxonomy.BLOG_RUBRIQUES.flatMap(({ articleIds }) => articleIds.map((id) => ({ id })));
  const routes = taxonomy.construireRoutesRubriques(visibles);
  assert.deepEqual(routes.map(({ rubrique }) => rubrique.chemin), taxonomy.BLOG_RUBRIQUES.map(({ chemin }) => chemin));
  assert.ok(routes.every(({ historique, param, rubrique }) => historique && `/blog/rubrique/${param}` === rubrique.chemin));
});

test('collision avec un article, doublon et chemin réservé échouent fermés', () => {
  assert.throws(() => taxonomy.construireRoutesRubriques([...entries, { id: 'fixture-directe' }], { rubriques: [direct] }), /collision.*article/i);
  assert.throws(() => taxonomy.construireRoutesRubriques(entries, { rubriques: [direct, { ...direct, slug: 'autre' }] }), /dupliqu/i);
  for (const chemin of ['/blog', '/blog/page/2', '/blog/rubrique', '/ailleurs/test']) {
    assert.throws(() => taxonomy.construireRoutesRubriques(entries, { rubriques: [{ ...direct, chemin }] }), /chemin/i);
  }
  assert.throws(() => taxonomy.construireRoutesRubriques(entries.slice(0, 1), { rubriques: [direct] }), /minimum 2/);
});

test('le registre classe une route directe comme CollectionPage avant les articles', () => {
  assert.equal(contract.isBlogArticle(direct.chemin, [direct]), false);
  assert.deepEqual(contract.expectedSchema(direct.chemin, [direct]), ['WebPage', 'CollectionPage', 'BreadcrumbList']);
  assert.ok(contract.sourceForRoute('/site', direct.chemin, [direct]).endsWith('/src/pages/blog/[...rubrique].astro'));
  assert.equal(contract.isBlogArticle('/blog/fixture-a', [direct]), true);
  assert.deepEqual(contract.expectedSchema('/blog/fixture-a', [direct]), ['BlogPosting', 'BreadcrumbList']);
});

test('les deux routes partagent le rendu et son canonical déclaré', () => {
  const read = (path) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8');
  for (const path of ['src/pages/blog/rubrique/[slug].astro', 'src/pages/blog/[...rubrique].astro']) {
    assert.match(read(path), /<BlogRubrique rubrique=\{Astro.props.rubrique\}/);
    assert.match(read(path), /construireRoutesRubriques/);
  }
  const component = read('src/components/blog/BlogRubrique.astro');
  assert.match(component, /chemin=\{rubrique.chemin\}/);
  assert.match(component, /const url = `\$\{SITE.url\}\$\{rubrique.chemin\}`/);
  assert.doesNotMatch(component, /getStaticPaths/);
  assert.match(read('src/pages/blog/[slug].astro'), /construireRoutesRubriques\(publies\)/);
});
