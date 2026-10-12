import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';
import { parse } from 'yaml';
import * as taxonomy from '../../src/data/blog-rubriques.mjs';
import { articleMarkdown, candidateManifest } from './blog-fixture.mjs';

const familles = [
  { id: 'collecte', pole: 'production', profession: 'ec' },
  { id: 'saisie', pole: 'production', profession: 'ec' },
  { id: 'cadrage', pole: 'methode', profession: 'ec' },
  { id: 'audit', pole: 'certification', profession: 'cac' },
];
const entry = (id, famille) => ({ id, data: { famille, brouillon: false } });
const rubrique = { slug: 'pieces', articleIds: ['collecte-a', 'saisie-b'] };
const exemption = { date: '2026-09-20', raison: 'Pilier transversal des tâches du cabinet, porte d’entrée générale et non parcours de production.' };
const options = { rubriques: [rubrique], exemptions: { pilier: exemption } };

const verifier = (entries, overrides = {}) => taxonomy.verifierCouvertureRubriques(entries, familles, { ...options, ...overrides });

test('couverture positive : deux familles du même pôle, rubrique et exemption transversale', () => {
  assert.doesNotThrow(() => verifier([entry('collecte-a', 'collecte'), entry('saisie-b', 'saisie'), entry('pilier', 'cadrage')]));
});

test('deux articles non exemptés d’un pôle sans parcours sont refusés', () => {
  assert.throws(() => verifier([entry('collecte-a', 'collecte'), entry('saisie-b', 'saisie')], { rubriques: [] }), /production.*2 articles.*sans parcours de rubrique/);
});

test('un pôle partiellement rattaché ne masque pas son second article', () => {
  assert.throws(() => verifier([entry('collecte-a', 'collecte'), entry('nouvelle-saisie', 'saisie')]), /production.*2 articles.*sans parcours de rubrique.*nouvelle-saisie/);
});

test('chaque article publié doit avoir une rubrique ou une exemption motivée', () => {
  assert.throws(() => verifier([entry('isole', 'cadrage')]), /isole.*rubrique ou exemption/);
  assert.throws(() => verifier([entry('pilier', 'cadrage')], { exemptions: { pilier: { ...exemption, raison: 'Transversal' } } }), /pilier.*exemption.*motivée/);
  assert.throws(() => verifier([entry('pilier', 'cadrage')], { exemptions: { pilier: { ...exemption, date: '' } } }), /pilier.*exemption/);
});

test('la famille doit être connue même pour un article exempté', () => {
  assert.throws(() => verifier([entry('pilier', 'inconnue')]), /pilier.*famille inconnue/);
});

test('la vraie fixture preview reste couverte une fois publiée, sans accepter une famille inconnue', async () => {
  const compiled = ts.transpileModule(readFileSync('src/data/familles.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { FAMILLES } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  const manifest = candidateManifest('fixture-candidat-pipeline');
  const markdown = articleMarkdown(manifest).replace('brouillon: true', 'brouillon: false');
  const data = parse(markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]);
  const published = { id: manifest.slug, data };
  const fixtureOptions = { rubriques: [], exemptions: { [manifest.slug]: exemption } };
  assert.equal(data.brouillon, false);
  assert.doesNotThrow(() => taxonomy.verifierCouvertureRubriques([published], FAMILLES, fixtureOptions));
  assert.throws(() => taxonomy.verifierCouvertureRubriques([{ ...published, data: { ...data, famille: 'inconnue' } }], FAMILLES, fixtureOptions), /fixture-candidat-pipeline.*famille inconnue/);
});

test('un rattachement double ou doublé par une exemption est refusé', () => {
  assert.throws(() => verifier([entry('collecte-a', 'collecte')], { rubriques: [rubrique, { ...rubrique, slug: 'autre' }] }), /collecte-a.*plusieurs rubriques/);
  assert.throws(() => verifier([entry('collecte-a', 'collecte')], { exemptions: { 'collecte-a': exemption } }), /collecte-a.*rattaché et hors rubrique/);
});

test('les exceptions ne déclenchent pas une archive artificielle et le stock CAC reste distinct', () => {
  assert.doesNotThrow(() => verifier([entry('pilier', 'cadrage'), entry('cicatrice', 'cadrage'), entry('cac-a', 'audit'), entry('cac-b', 'audit')], { rubriques: [], exemptions: { pilier: exemption, cicatrice: exemption } }));
});

test('le stock publié réel est couvert à partir du frontmatter et de la taxonomie des familles', async () => {
  const compiled = ts.transpileModule(readFileSync('src/data/familles.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { FAMILLES } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  const entries = readdirSync('src/content/blog').filter((file) => file.endsWith('.md')).map((file) => {
    const markdown = readFileSync(`src/content/blog/${file}`, 'utf8');
    return { id: file.slice(0, -3), data: parse(markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]) };
  }).filter(({ data }) => data.brouillon === false);
  assert.ok(entries.length > 0);
  assert.doesNotThrow(() => taxonomy.verifierCouvertureRubriques(entries, FAMILLES));
  const base = readFileSync('src/layouts/Base.astro', 'utf8');
  assert.match(base, /verifierCouvertureRubriques\(articles\.filter\(.*brouillon === false.*\), FAMILLES\)/);
  assert.deepEqual(Object.keys(taxonomy.ARTICLES_HORS_RUBRIQUE).sort(), [
    'automatiser-un-cabinet-comptable-la-carte-des-taches',
    'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps',
    'pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils',
  ].sort());
  for (const { raison } of Object.values(taxonomy.ARTICLES_HORS_RUBRIQUE)) assert.doesNotMatch(raison, /deux rubriques/);
});
