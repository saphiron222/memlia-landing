import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
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
