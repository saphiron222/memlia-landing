import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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
  'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps',
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain',
  'pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils',
  'prompt-chatgpt-expert-comptable',
  'logiciel-ia-comptabilite',
  'tests-verts-et-regle-des-trois-passes',
];

const entree = (id, date = '2026-09-20') => ({
  id,
  data: { datePublication: new Date(`${date}T00:00:00.000Z`), titre: id, resume: `Résumé substantiel de ${id}` },
});

test('le contrat central conserve les rubriques historiques et motive chaque exclusion du stock vivant', () => {
  assert.ok(BLOG_RUBRIQUES.length >= 2);
  const attaches = BLOG_RUBRIQUES.flatMap((rubrique) => rubrique.articleIds);
  for (const id of ATTACHES) assert.ok(attaches.includes(id));
  assert.equal(new Set(attaches).size, attaches.length);
  for (const rubrique of BLOG_RUBRIQUES) assert.ok(rubrique.articleIds.length >= 2);
  const registre = JSON.parse(readFileSync(new URL('../../docs/strategy/site-v3/mesures/registre-requetes.json', import.meta.url), 'utf8'));
  const publies = registre.articles.filter(({ type }) => type === 'blog').map(({ slug }) => slug);
  assert.deepEqual([...attaches, ...Object.keys(ARTICLES_HORS_RUBRIQUE)].sort(), publies.sort());
  assert.ok(Object.values(ARTICLES_HORS_RUBRIQUE).every(({ date, raison }) => /^\d{4}-\d{2}-\d{2}$/.test(date) && raison.length >= 50));
  assert.ok(BLOG_RUBRIQUES.every((rubrique) => rubrique.chemin === `/blog/rubrique/${rubrique.slug}`));
});

test('la liste de chaque hub vient des entrées visibles et ignore un article absent de la collection', () => {
  const visiblesHistoriques = [
    entree('controler-les-bulletins-de-paie-avant-la-dsn', '2026-09-09'),
    entree('comprendre-les-comptes-rendus-metier-dsn', '2026-09-15'),
    entree('suivre-la-production-sociale-dans-excel', '2026-09-10'),
    entree('automatiser-la-saisie-comptable-ce-qui-reste-a-verifier', '2026-09-17'),
    entree('automatiser-la-relance-des-pieces-clients', '2026-09-16'),
    entree('automatiser-un-cabinet-comptable-la-carte-des-taches'),
    entree('pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils'),
  ];
  const visibles = [...visiblesHistoriques, ...BLOG_RUBRIQUES.flatMap(({ articleIds }) => articleIds)
    .filter((id) => !visiblesHistoriques.some((entry) => entry.id === id)).map((id) => entree(id))];
  const rubriques = construireRubriques(visibles);
  assert.equal(rubriques.length, BLOG_RUBRIQUES.length);
  assert.deepEqual(rubriques.map((rubrique) => rubrique.articles.length), BLOG_RUBRIQUES.map(({ articleIds }) => articleIds.length));
  assert.deepEqual(
    rubriques[0].articles.map((article) => article.id),
    BLOG_RUBRIQUES[0].articleIds.filter((id) => visibles.some((entry) => entry.id === id)),
  );
  for (const id of Object.keys(ARTICLES_HORS_RUBRIQUE)) assert.equal(rubriquePourArticle(id), null);
  assert.equal(rubriquePourArticle(ATTACHES[0])?.slug, BLOG_RUBRIQUES[0].slug);
});

test('une rubrique qui tombe sous deux articles visibles est refusée', () => {
  const incomplet = BLOG_RUBRIQUES.flatMap(({ articleIds }) => articleIds).filter((id) => ![
    'comprendre-les-comptes-rendus-metier-dsn',
    'suivre-la-production-sociale-dans-excel',
  ].includes(id)).map((id) => entree(id));
  assert.throws(
    () => construireRubriques(incomplet),
    /paie-dsn-cabinet-comptable.*1 article visible.*minimum 2/,
  );
});
