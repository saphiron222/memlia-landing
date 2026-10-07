import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { parse as parseHtml } from 'parse5';
import { parse as parseYaml } from 'yaml';
import { chargerAutocompletionMesuree, titrePorteUneRequeteMesuree } from '../../scripts/lib/blog-title-intent.mjs';
import { dateIntentionScellee } from '../../scripts/lib/blog-pipeline.mjs';

const ROOT = resolve(import.meta.dirname, '../..');
const BLOG = join(ROOT, 'src/content/blog');
function mesureArticle(slug) {
  // Pendant production-check, go-production expose déjà la route mais le sceau
  // n'est écrit qu'après le build. Sans sceau, exiger le relevé frais du jour.
  return chargerAutocompletionMesuree(ROOT, { au: dateIntentionScellee(ROOT, slug) ?? undefined });
}

test('un relevé de la nuit Paris reste frais sans emprunter le jour UTC précédent', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-intent-paris-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dossier = join(root, 'docs/strategy/site-v3/mesures');
  mkdirSync(dossier, { recursive: true });
  writeFileSync(join(dossier, 'questions-2026-09-30.json'), JSON.stringify({ autocompletion: { 'tests verts': [] } }));
  t.mock.timers.enable({ apis: ['Date'], now: Date.parse('2026-09-29T23:22:00Z') });
  try {
    const mesure = chargerAutocompletionMesuree(root);
    assert.equal(mesure.au, '2026-09-30');
    assert.ok(Object.hasOwn(mesure.autocompletion, 'tests verts'));
  } finally {
    t.mock.timers.reset();
  }
});

function dossierDeMesures(t, prefixe) {
  const root = mkdtempSync(join(tmpdir(), prefixe));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const dossier = join(root, 'docs/strategy/site-v3/mesures');
  mkdirSync(dossier, { recursive: true });
  return { root, dossier };
}

test('le relevé de demande du lundi compte comme mesure, pas ses pannes, et vieillit comme les autres', (t) => {
  const { root, dossier } = dossierDeMesures(t, 'memlia-intent-demande-');
  writeFileSync(join(dossier, 'semaine-2026-W41-demande.json'), JSON.stringify({
    date: '2026-10-06',
    autocompletion: {
      mesuree: { 'prompt chatgpt expert comptable': ['prompt chatgpt expert comptable'], 'requete sans suggestion': [] },
      pannes: [{ requete: 'requete en panne', erreur: 'HTTP 429' }],
    },
  }));
  // L'instantané d'intégrité de la même semaine n'est pas un relevé d'autocomplétion.
  writeFileSync(join(dossier, 'semaine-2026-W41-integrite.json'), JSON.stringify({ date: '2026-10-06' }));
  const mesure = chargerAutocompletionMesuree(root, { au: '2026-10-07' });
  assert.deepEqual(mesure.fichiers, ['semaine-2026-W41-demande.json']);
  assert.ok(Object.hasOwn(mesure.autocompletion, 'prompt chatgpt expert comptable'));
  assert.ok(Object.hasOwn(mesure.autocompletion, 'requete sans suggestion'));
  assert.equal(Object.hasOwn(mesure.autocompletion, 'requete en panne'), false);
  assert.equal(mesure.mesureParRequete['prompt chatgpt expert comptable'].date, '2026-10-06');
  assert.throws(() => chargerAutocompletionMesuree(root, { au: '2026-10-15' }), /aucun relevé d’autocomplétion frais/);
});

test('la mesure la plus récente gagne, qu’elle vienne de la forge ou du relevé de demande', (t) => {
  const { root, dossier } = dossierDeMesures(t, 'memlia-intent-recent-');
  writeFileSync(join(dossier, 'titres-intent-2026-10-05.json'), JSON.stringify({ autocompletion: { 'lettrage sage': ['ancienne'] } }));
  writeFileSync(join(dossier, 'semaine-2026-W41-demande.json'), JSON.stringify({ date: '2026-10-06', autocompletion: { mesuree: { 'lettrage sage': ['lundi'] }, pannes: [] } }));
  writeFileSync(join(dossier, 'titres-intent-2026-10-07.json'), JSON.stringify({ autocompletion: { 'lettrage sage': ['forge du jour'] } }));
  assert.deepEqual(chargerAutocompletionMesuree(root, { au: '2026-10-06' }).autocompletion['lettrage sage'], ['lundi']);
  assert.deepEqual(chargerAutocompletionMesuree(root, { au: '2026-10-07' }).autocompletion['lettrage sage'], ['forge du jour']);
});

test('un relevé de demande sans date lisible arrête la lecture au lieu d’être ignoré', (t) => {
  const { root, dossier } = dossierDeMesures(t, 'memlia-intent-sans-date-');
  writeFileSync(join(dossier, 'semaine-2026-W42-demande.json'), JSON.stringify({ autocompletion: { mesuree: {}, pannes: [] } }));
  assert.throws(() => chargerAutocompletionMesuree(root, { au: '2026-10-14' }), /relevé de demande sans date valide/);
});

test('une mesure du lundi datée après le jour lu est ignorée, comme toute mesure future', (t) => {
  const { root, dossier } = dossierDeMesures(t, 'memlia-intent-futur-');
  writeFileSync(join(dossier, 'titres-intent-2026-10-05.json'), JSON.stringify({ autocompletion: { 'lettrage sage': ['ancienne'] } }));
  writeFileSync(join(dossier, 'semaine-2026-W41-demande.json'), JSON.stringify({ date: '2026-10-08', autocompletion: { mesuree: { 'lettrage sage': ['futur'] }, pannes: [] } }));
  writeFileSync(join(dossier, 'semaine-2026-W42-demande.json'), JSON.stringify({ date: '2026-10-12', autocompletion: { mesuree: { 'lettrage sage': ['semaine suivante'] }, pannes: [] } }));
  const mesure = chargerAutocompletionMesuree(root, { au: '2026-10-07' });
  assert.deepEqual(mesure.autocompletion['lettrage sage'], ['ancienne']);
  assert.deepEqual(mesure.fichiers, ['titres-intent-2026-10-05.json']);
});

test('un relevé du lundi entièrement en pannes n’est pas un relevé frais', (t) => {
  const { root, dossier } = dossierDeMesures(t, 'memlia-intent-pannes-');
  writeFileSync(join(dossier, 'titres-intent-2026-09-28.json'), JSON.stringify({ autocompletion: { 'lettrage sage': [] } }));
  writeFileSync(join(dossier, 'semaine-2026-W41-demande.json'), JSON.stringify({ date: '2026-10-06', autocompletion: { mesuree: {}, pannes: [{ requete: 'lettrage sage', erreur: 'HTTP 429' }] } }));
  assert.throws(() => chargerAutocompletionMesuree(root, { au: '2026-10-07' }), /aucun relevé d’autocomplétion frais/);
});

test('le préfiltre ouvre une semaine tant que son dimanche est dans la fenêtre', (t) => {
  const { root, dossier } = dossierDeMesures(t, 'memlia-intent-borne-');
  writeFileSync(join(dossier, 'semaine-2026-W41-demande.json'), JSON.stringify({ date: '2026-10-11', autocompletion: { mesuree: { 'lettrage sage': ['dimanche'] }, pannes: [] } }));
  // Le dimanche 11/10 a 8 jours le 19/10 : la mesure est encore fraîche, la semaine doit être ouverte.
  assert.deepEqual(chargerAutocompletionMesuree(root, { au: '2026-10-19' }).autocompletion['lettrage sage'], ['dimanche']);
  // Le 20/10, elle a 9 jours : plus rien n'est frais.
  assert.throws(() => chargerAutocompletionMesuree(root, { au: '2026-10-20' }), /aucun relevé d’autocomplétion frais/);
});

test('un vieux relevé de demande abîmé ne bloque pas la porte ; un relevé frais abîmé l’arrête en se nommant', (t) => {
  const { root, dossier } = dossierDeMesures(t, 'memlia-intent-abime-');
  writeFileSync(join(dossier, 'titres-intent-2026-10-05.json'), JSON.stringify({ autocompletion: { 'lettrage sage': [] } }));
  writeFileSync(join(dossier, 'semaine-2026-W26-demande.json'), '{"date": "2026-06-2');
  assert.deepEqual(chargerAutocompletionMesuree(root, { au: '2026-10-07' }).fichiers, ['titres-intent-2026-10-05.json']);
  writeFileSync(join(dossier, 'semaine-2026-W41-demande.json'), '{"date": "2026-10-0');
  assert.throws(() => chargerAutocompletionMesuree(root, { au: '2026-10-07' }), /relevé de demande illisible : semaine-2026-W41-demande\.json/);
  writeFileSync(join(dossier, 'semaine-2026-W41-demande.json'), 'null');
  assert.throws(() => chargerAutocompletionMesuree(root, { au: '2026-10-07' }), /relevé de demande sans date valide : semaine-2026-W41-demande\.json/);
});

function frontmatter(path) {
  const source = readFileSync(path, 'utf8');
  const bloc = source.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(bloc, `frontmatter absent : ${path}`);
  return parseYaml(bloc[1]);
}

function articlesPublies() {
  return readdirSync(BLOG)
    .filter((nom) => nom.endsWith('.md'))
    .map((nom) => ({ slug: nom.slice(0, -3), fm: frontmatter(join(BLOG, nom)) }))
    .filter(({ fm }) => fm.brouillon === false);
}

function parcourir(node, visite) {
  visite(node);
  for (const enfant of node.childNodes ?? []) parcourir(enfant, visite);
}

function texte(node) {
  return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(texte).join('');
}

function attribut(node, nom) {
  return node.attrs?.find((item) => item.name === nom)?.value ?? null;
}

function surfacesArticle(slug) {
  const document = parseHtml(readFileSync(join(ROOT, 'dist/blog', `${slug}.html`), 'utf8'));
  let h1 = null;
  let title = null;
  let ogTitle = null;
  let headline = null;
  parcourir(document, (node) => {
    if (node.nodeName === 'h1') h1 = texte(node).trim();
    if (node.nodeName === 'title') title = texte(node).trim();
    if (node.nodeName === 'meta' && attribut(node, 'property') === 'og:title') ogTitle = attribut(node, 'content');
    if (node.nodeName === 'script' && attribut(node, 'type') === 'application/ld+json') {
      const valeur = JSON.parse(texte(node));
      const graphe = valeur['@graph'] ?? [];
      const article = graphe.find((item) => item['@type'] === 'BlogPosting');
      if (article) headline = article.headline;
    }
  });
  return { h1, title, ogTitle, headline };
}

test('chaque H1 publié porte une requête mesurée, y compris une mesure sans suggestion', () => {
  const articles = articlesPublies();
  assert.ok(articles.length >= 7, `corpus publié anormalement vide : ${articles.length} article(s)`);
  for (const { slug, fm } of articles) {
    const mesure = mesureArticle(slug);
    const requetes = [fm.primaryQuery, ...(fm.secondaryQueries ?? [])];
    const mesurees = requetes.filter((requete) => Object.hasOwn(mesure.autocompletion, requete));
    assert.ok(mesurees.length > 0, `${slug} : aucune requête du frontmatter n'a de relevé d'autocomplétion`);
    assert.ok(titrePorteUneRequeteMesuree(fm.titre, requetes, mesure.autocompletion), `${slug} : H1 narratif sans intention mesurée — ${fm.titre}`);
  }
});

test('le gardien rejette un H1 narratif fabriqué', () => {
  const requetes = [
    "pourquoi les cabinets comptables n'adoptent pas les nouveaux outils",
    'adoption outil cabinet comptable',
    'changement de logiciel cabinet comptable resistance',
  ];
  const mesure = chargerAutocompletionMesuree(ROOT, { au: '2026-09-28' });
  assert.equal(
    titrePorteUneRequeteMesuree("La plateforme que personne n'a achetée, et ce que le refus m'a appris", requetes, mesure.autocompletion),
    false,
  );
});

test('H1, Open Graph et JSON-LD portent le même titre intent-first ; l’onglet garde la même intention', () => {
  for (const { slug, fm } of articlesPublies()) {
    const mesure = mesureArticle(slug);
    const surfaces = surfacesArticle(slug);
    assert.equal(surfaces.h1, fm.titre, `${slug} : H1`);
    assert.equal(surfaces.ogTitle, fm.titre, `${slug} : og:title`);
    assert.equal(surfaces.headline, fm.titre, `${slug} : JSON-LD headline`);
    assert.equal(surfaces.title, fm.titreOnglet, `${slug} : title`);
    assert.ok(titrePorteUneRequeteMesuree(surfaces.title, [fm.primaryQuery, ...(fm.secondaryQueries ?? [])], mesure.autocompletion), `${slug} : titre d'onglet sans intention mesurée`);
  }
});
