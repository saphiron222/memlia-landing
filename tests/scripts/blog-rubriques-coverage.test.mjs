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

async function stockPublie() {
  const compiled = ts.transpileModule(readFileSync('src/data/familles.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
  const { FAMILLES } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  const entries = readdirSync('src/content/blog').filter((file) => file.endsWith('.md')).map((file) => {
    const markdown = readFileSync(`src/content/blog/${file}`, 'utf8');
    return { id: file.slice(0, -3), data: parse(markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)[1]) };
  }).filter(({ data }) => data.brouillon === false);
  return { entries, FAMILLES };
}

function verifierStock(entries, FAMILLES, {
  rubriques = taxonomy.BLOG_RUBRIQUES, exemptions = taxonomy.ARTICLES_HORS_RUBRIQUE,
} = {}) {
  assert.ok(entries.length > 0);
  taxonomy.verifierCouvertureRubriques(entries, FAMILLES, { rubriques, exemptions });
  const hubs = taxonomy.construireRubriques(entries, { rubriques });
  for (const { id, data } of entries) {
    const famille = FAMILLES.find((famille) => famille.id === data.famille);
    assert.ok(famille, `${id} : famille connue`);
    if (famille.profession !== 'ec') continue;
    const rattachements = hubs.filter(({ articles }) => articles.some((article) => article.id === id));
    const horsRubrique = Object.hasOwn(exemptions, id);
    assert.equal(rattachements.length + Number(horsRubrique), 1, `${id} : un parcours ou une exemption, exclusivement`);
    if (horsRubrique) {
      assert.match(exemptions[id].date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(exemptions[id].raison.trim().length >= 50, `${id} : motif substantiel`);
    } else {
      assert.equal(taxonomy.rubriquePourArticle(id)?.slug, rattachements[0].slug);
    }
  }
}

test('le stock publié réel rejoint un hub ou une exemption motivée, sans liste historique figée', async () => {
  const { entries, FAMILLES } = await stockPublie();
  verifierStock(entries, FAMILLES);
});

test('le stock réel accepte plusieurs nouvelles exemptions sans créer de parcours artificiel', async () => {
  const { entries, FAMILLES } = await stockPublie();
  const famille = FAMILLES.find(({ profession }) => profession === 'ec');
  const exemptions = { ...taxonomy.ARTICLES_HORS_RUBRIQUE };
  const evolutif = [...entries];
  for (const id of ['nouvelle-exemption-a', 'nouvelle-exemption-b']) {
    evolutif.push(entry(id, famille.id));
    exemptions[id] = exemption;
    verifierStock(evolutif, FAMILLES, { exemptions });
    const sansExemption = { ...exemptions };
    delete sansExemption[id];
    assert.throws(() => taxonomy.verifierCouvertureRubriques(evolutif, FAMILLES, { exemptions: sansExemption }), /sans parcours de rubrique|rubrique ou exemption/);
    assert.throws(() => taxonomy.verifierCouvertureRubriques(evolutif, FAMILLES, {
      exemptions: { ...exemptions, [id]: { ...exemption, raison: 'Transversal' } },
    }), /exemption datée et motivée/);
  }
});

test('les exemptions du stock réel restent contrôlées et les rattachements exclusifs', async () => {
  const { entries, FAMILLES } = await stockPublie();
  const ec = entries.filter(({ data }) => FAMILLES.some(({ id, profession }) => id === data.famille && profession === 'ec'));
  const exemptes = ec.filter(({ id }) => Object.hasOwn(taxonomy.ARTICLES_HORS_RUBRIQUE, id));
  assert.ok(exemptes.length > 0);
  for (const { id } of exemptes) {
    for (const invalide of [undefined, { ...exemption, raison: 'Transversal' }, { ...exemption, date: '' }]) {
      const exemptions = { ...taxonomy.ARTICLES_HORS_RUBRIQUE, [id]: invalide };
      if (!invalide) delete exemptions[id];
      assert.throws(() => taxonomy.verifierCouvertureRubriques(entries, FAMILLES, { exemptions }), /sans parcours de rubrique|rubrique ou exemption|exemption datée et motivée/);
    }
    const inconnue = entries.map((article) => article.id === id ? entry(id, 'inconnue') : article);
    assert.throws(() => taxonomy.verifierCouvertureRubriques(inconnue, FAMILLES), /famille inconnue/);
  }
  const rattache = ec.find(({ id }) => taxonomy.rubriquePourArticle(id));
  assert.ok(rattache);
  assert.throws(() => taxonomy.verifierCouvertureRubriques(entries, FAMILLES, {
    rubriques: [...taxonomy.BLOG_RUBRIQUES, { slug: 'doublon', articleIds: [rattache.id] }],
  }), /plusieurs rubriques/);
  assert.throws(() => taxonomy.verifierCouvertureRubriques(entries, FAMILLES, {
    exemptions: { ...taxonomy.ARTICLES_HORS_RUBRIQUE, [rattache.id]: exemption },
  }), /rattaché et hors rubrique/);
});
