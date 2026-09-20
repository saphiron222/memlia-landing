import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARTICLES_HORS_RUBRIQUE,
  BLOG_RUBRIQUES,
  construireRubriques,
  rubriquePourArticle,
} from '../../src/data/blog-rubriques.mjs';

const ATTACHES = [
  'controler-les-bulletins-de-paie-avant-la-dsn',
  'comprendre-les-comptes-rendus-metier-dsn',
  'suivre-la-production-sociale-dans-excel',
  'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
  'automatiser-la-relance-des-pieces-clients',
];

const HORS_RUBRIQUE = [
  'automatiser-un-cabinet-comptable-la-carte-des-taches',
  'la-plateforme-que-personne-n-a-achetee',
];

const entree = (id, date = '2026-09-20') => ({
  id,
  data: { datePublication: new Date(`${date}T00:00:00.000Z`), titre: id, resume: `Résumé substantiel de ${id}` },
});

test('le contrat central porte deux rubriques, cinq articles rattachés et deux exclusions motivées', () => {
  assert.equal(BLOG_RUBRIQUES.length, 2);
  const attaches = BLOG_RUBRIQUES.flatMap((rubrique) => rubrique.articleIds);
  assert.deepEqual([...attaches].sort(), [...ATTACHES].sort());
  assert.equal(new Set(attaches).size, 5);
  assert.deepEqual(Object.keys(ARTICLES_HORS_RUBRIQUE).sort(), [...HORS_RUBRIQUE].sort());
  assert.ok(Object.values(ARTICLES_HORS_RUBRIQUE).every((raison) => raison.length >= 50));
  assert.ok(BLOG_RUBRIQUES.every((rubrique) => rubrique.chemin === `/blog/rubrique/${rubrique.slug}`));
});

test('la liste de chaque hub vient des entrées visibles et ignore un article absent de la collection', () => {
  const visibles = [
    entree('controler-les-bulletins-de-paie-avant-la-dsn', '2026-09-09'),
    entree('comprendre-les-comptes-rendus-metier-dsn', '2026-09-15'),
    entree('suivre-la-production-sociale-dans-excel', '2026-09-10'),
    entree('automatiser-la-saisie-comptable-ce-qui-reste-a-verifier', '2026-09-17'),
    entree('automatiser-la-relance-des-pieces-clients', '2026-09-16'),
    entree('automatiser-un-cabinet-comptable-la-carte-des-taches'),
    entree('la-plateforme-que-personne-n-a-achetee'),
  ];
  const rubriques = construireRubriques(visibles);
  assert.equal(rubriques.length, 2);
  assert.deepEqual(rubriques.map((rubrique) => rubrique.articles.length), [3, 2]);
  assert.deepEqual(
    rubriques[0].articles.map((article) => article.id),
    ['comprendre-les-comptes-rendus-metier-dsn', 'suivre-la-production-sociale-dans-excel', 'controler-les-bulletins-de-paie-avant-la-dsn'],
  );
  assert.equal(rubriquePourArticle(HORS_RUBRIQUE[0]), null);
  assert.equal(rubriquePourArticle(ATTACHES[0])?.slug, BLOG_RUBRIQUES[0].slug);
});

test('une rubrique qui tombe sous deux articles visibles est refusée', () => {
  const incomplet = ATTACHES.filter((id) => ![
    'comprendre-les-comptes-rendus-metier-dsn',
    'suivre-la-production-sociale-dans-excel',
  ].includes(id)).map((id) => entree(id));
  assert.throws(
    () => construireRubriques(incomplet),
    /paie-dsn-cabinet-comptable.*1 article visible.*minimum 2/,
  );
});
