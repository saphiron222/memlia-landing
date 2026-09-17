import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { materialiser, ecrireSceau, unitesRendues, jetons, construireManifest, frontmatter } from '../../scripts/blog-forge.mjs';
import { validateDossier, semaineIso, verifierPlafonds, PUBLICATION_SEAL_PATH } from '../../scripts/lib/blog-pipeline.mjs';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SLUG = 'automatiser-une-tache-de-test';
const jour = new Date().toISOString().slice(0, 10);

const CORPS = `## Réponse directe

Automatiser une tâche de cabinet consiste à exécuter une règle écrite sans intervention humaine à chaque occurrence, et à faire remonter ce qui sort de la règle. La validation reste au cabinet.

## Ce que dit le cadre

Les données personnelles ne peuvent pas être conservées indéfiniment et une durée de conservation doit être déterminée par le responsable de traitement. Le cabinet fixe donc une durée par pièce.

## Ce qui reste humain

Le module prépare un résultat et la personne responsable conserve la validation ; il refuse d'écrire quand une pièce est illisible ou quand la règle ne couvre pas le cas rencontré. Voir [la méthode](/methode) et [l'article frère](/blog/article-frere).`;

const PAGE_SOURCE = `<html><head><title>Durées de conservation</title></head>
<body>
<p>Les données personnelles ne peuvent pas être conservées indéfiniment : une durée de conservation doit être déterminée par le responsable de traitement en fonction de l’objectif ayant conduit à la collecte de ces données.</p>
<p>La définition de la durée de conservation relève de l’analyse de conformité que le responsable doit mener pour son traitement.</p>
</body></html>
`;

function recette() {
  return {
    slug: SLUG, title: 'Automatiser une tâche de test dans un cabinet', tabTitle: 'Automatiser une tâche de test | Memlia',
    summary: 'Une règle écrite, un jeu fictif et une validation humaine : la méthode de test rejouable dans un cabinet.',
    description: 'Méthode de test pour automatiser une tâche répétitive de cabinet avec une règle écrite, un jeu fictif et une validation humaine.',
    date: jour, topics: ['methode', 'automatisation'], keywords: ['automatisation cabinet'],
    primaryQuery: 'automatiser une tâche de test cabinet', secondaryQueries: ['tâche de test cabinet comptable'], intent: 'executer', fanOut: ['quelle règle écrire'],
    role: { primary: 'direction-associes', secondary: [], proofLevel: 'hypothese', proofNote: 'Rôle supposé pour le test.' },
    funnel: 'TOFU', cluster: 'methode-decision-humaine', famille: 'choisir-cadrer', contentType: 'searchable', format: 'how-to-guide',
    task: 'Décider quelle tâche automatiser en premier.', rankability: 'plausible', businessRelevance: 'directe',
    proofRequired: 'Jeu fictif à trois cas : courant, limite, refus.', reviewRule: 'Réviser lors de tout changement de source officielle citée.',
    cta: { label: 'Voir la méthode', destination: '/methode', outcome: 'Comprendre le cadrage d’une automatisation.' },
    image: { heroId: `img-art-${SLUG}`, alt: 'Trois colonnes : ce qui se prépare seul, ce qui attend une validation, ce qui reste humain', cadre: { titre: 'Automatiser une tâche de test', sousTitre: 'La règle, le jeu fictif, la validation', famille: 'Méthode', colonnes: [{ titre: 'Se prépare seul', items: ['Relance à J+7'] }, { titre: 'Attend une validation', items: ['Envoi au client'] }, { titre: 'Reste humain', items: ['Litige'] }], pied: 'memlia.fr' } },
    sources: [
      { id: 'cnil-durees', publisher: 'CNIL', title: 'Les durées de conservation des données', url: 'https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees', level: 'tier-1', official: true, classificationReason: 'Source officielle primaire publiée directement par l’autorité de protection des données.', excerpt: 'une durée de conservation doit être déterminée par le responsable de traitement' },
      { id: 'cnil-durees-bis', publisher: 'CNIL', title: 'Les durées de conservation des données (analyse)', url: 'https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees?vue=analyse', level: 'tier-1', official: true, classificationReason: 'Même page officielle, lue pour le passage sur l’analyse de conformité du responsable.', excerpt: 'relève de l’analyse de conformité que le responsable doit mener' },
      { id: 'cnil-durees-ter', publisher: 'CNIL', title: 'Les durées de conservation des données (cycle)', url: 'https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees?vue=cycle', level: 'tier-1', official: true, classificationReason: 'Même page officielle, lue pour le cycle de vie de la donnée.', excerpt: 'ne peuvent pas être conservées indéfiniment' },
    ],
    links: { outgoing: ['/methode', '/blog/article-frere'], incoming: ['/', '/blog'] },
    cannibalization: { risk: 'faible', comparedWith: ['/blog/article-frere'], decision: 'Intentions distinctes après comparaison du corpus.' },
    serp: { requete: 'automatiser une tâche de test cabinet', date: jour, acteurs: ['aucun'], note: 'Relevé fictif de test.' },
    gsc: { requete: 'automatiser une tâche de test cabinet', date: jour, impressions: 0, clics: 0, note: 'Propriété lue, aucune impression : nouvel article.' },
    claims: [
      { unite: 'Les données personnelles ne peuvent pas être conservées indéfiniment', claim: 'Les données personnelles ne peuvent pas être conservées indéfiniment et une durée de conservation doit être déterminée par le responsable de traitement', type: 'legal-reglementaire', sourceId: 'cnil-durees', excerpt: 'Les données personnelles ne peuvent pas être conservées indéfiniment : une durée de conservation doit être déterminée par le responsable de traitement en fonction de l’objectif ayant conduit à la collecte de ces données.', explanation: 'La CNIL énonce la règle reprise mot pour mot par le claim.' },
    ],
    businessReview: { reviewerId: 'relecteur-metier-ia-memlia', role: 'collaborateurs-comptables' },
  };
}

function revues(claimId) {
  const criteres = Object.fromEntries(['intent-satisfaction', 'serp-format-rankability', 'eeat-sources', 'information-gain-proof', 'technical-onpage-seo', 'ai-citability', 'contextual-conversion'].map((id) => [id, { result: 'PASS', observations: [`${id} vérifié sur le contenu rendu du candidat de test.`] }]));
  const criteresImage = Object.fromEntries(['brief-six-components', 'generation-constraints', 'fictive-provenance', 'recognizable-subject', 'technical-derivatives', 'alt-information'].map((id) => [id, { result: 'PASS', observations: [`${id} observé dans le rendu du cadre de preuve.`] }]));
  return {
    editorial: { criteria: criteres, p0: [] },
    business: { claims: { [claimId]: { verdict: 'soutient', reasoning: 'Le reviewer métier a comparé le claim et la citation exacte de la CNIL dans la copie locale.' } } },
    image: { criteria: criteresImage, directionArt: 18, semanticRelevance: 22 },
    sources: { reviewedBy: 'relecteur-metier-ia-memlia' },
  };
}

const imageFictive = (width, height) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="#fffefb"/><rect x="${width * 0.1}" y="${height * 0.2}" width="${width * 0.35}" height="${height * 0.6}" fill="#dff5e6" stroke="#1c8a41" stroke-width="12"/><rect x="${width * 0.55}" y="${height * 0.2}" width="${width * 0.35}" height="${height * 0.6}" fill="#f3efe3" stroke="#231f20" stroke-width="12"/><circle cx="${width / 2}" cy="${height / 2}" r="${height * 0.12}" fill="#27b657"/></svg>`);
const rendreImage = async (html, cible) => { assert.ok(html.includes('Automatiser une tâche de test'), 'le cadre porte le titre'); await sharp(imageFictive(1920, 1080)).png().toFile(cible); };
const fetcher = async () => new Response(PAGE_SOURCE, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'content-length': String(Buffer.byteLength(PAGE_SOURCE)) } });

function racineDeTest() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-forge-'));
  mkdirSync(join(root, 'editorial/templates'), { recursive: true });
  mkdirSync(join(root, 'editorial/recettes', SLUG), { recursive: true });
  mkdirSync(join(root, 'src/content/blog'), { recursive: true });
  mkdirSync(join(root, 'src/pages'), { recursive: true });
  mkdirSync(join(root, 'src/data'), { recursive: true });
  mkdirSync(join(root, 'public/fonts'), { recursive: true });
  writeFileSync(join(root, 'editorial/templates/cadre-article.html'), readFileSync(join(RACINE, 'editorial/templates/cadre-article.html'), 'utf8'));
  writeFileSync(join(root, 'editorial/queue.json'), JSON.stringify({ version: 1, candidates: [] }));
  writeFileSync(join(root, 'src/data/images.mjs'), "export const IMAGES = {\n  'img-existante': {\n    largeurs: [768],\n    ratio: [16, 9],\n    alt: 'Existante',\n  },\n};\nexport const PUBLISHED_IMAGE_IDS = [\n  'img-existante',\n];\n");
  writeFileSync(join(root, 'src/pages/index.astro'), `<a href="/blog/${SLUG}">Article</a>`);
  writeFileSync(join(root, 'src/pages/methode.astro'), '<h1>Méthode</h1>');
  writeFileSync(join(root, 'src/pages/blog.astro'), '<ul class="blog-liste"></ul>');
  writeFileSync(join(root, 'src/content/blog/article-frere.md'), '---\ntitre: "Article frère de test"\nbrouillon: false\nprimaryQuery: "autre requête"\nintent: comprendre\n---\n\n## Frère\n\nContenu distinct et suffisamment long pour ne pas être confondu avec le candidat de test.\n');
  writeFileSync(join(root, 'editorial/legacy-baseline.json'), JSON.stringify({ version: 1, articles: {} }));
  writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify(recette(), null, 2));
  writeFileSync(join(root, 'editorial/recettes', SLUG, 'corps.md'), CORPS);
  return root;
}
const blogRendu = `<li data-article="${SLUG}"><a href="/blog/${SLUG}"></a></li>`;

test('semaineIso et les plafonds de cadence : deux par jour, quatre par semaine ISO', () => {
  assert.equal(semaineIso('2026-09-16'), '2026-W38');
  assert.equal(semaineIso('2026-09-21'), '2026-W39');
  assert.equal(semaineIso('2027-01-01'), '2026-W53');
  const actifs = [{ date: '2026-09-16', status: 'publie' }, { date: '2026-09-16', status: 'publie' }];
  assert.throws(() => verifierPlafonds(actifs, '2026-09-16'), /2 candidats sont déjà planifiés le/);
  verifierPlafonds(actifs, '2026-09-17');
  const semainePleine = [...actifs, { date: '2026-09-17', status: 'publie' }, { date: '2026-09-18', status: 'archive' }, { date: '2026-09-18', status: 'a-valider' }];
  assert.throws(() => verifierPlafonds(semainePleine, '2026-09-19'), /4 candidats sont déjà planifiés la semaine 2026-W38/);
  verifierPlafonds(semainePleine, '2026-09-21');
});

test('le découpage en unités et les jetons suivent le pipeline', () => {
  const unites = unitesRendues('## Titre **gras**\n\nUn [lien](/x) et du `code`.\n\n\nDernier.');
  assert.deepEqual(unites.map((u) => u.text), ['Titre gras', 'Un lien et du code.', 'Dernier.']);
  assert.match(unites[0].id, /^unit-[a-f0-9]{12}$/);
  assert.deepEqual(jetons('Les données personnelles ne peuvent pas être conservées'), ['donnees', 'personnelles', 'peuvent', 'conservees']);
});

test('le frontmatter reproduit le manifeste champ pour champ', () => {
  const manifest = construireManifest(recette(), 'pret-preview', jour, null);
  const fm = frontmatter(manifest);
  assert.match(fm, /^brouillon: true$/m);
  assert.match(fm, /^famille: choisir-cadrer$/m);
  assert.match(fm, /^statutEditorial: pret-preview$/m);
  const publie = frontmatter(construireManifest(recette(), 'publie', jour, null));
  assert.match(publie, /^brouillon: false$/m);
});

test('la forge produit un dossier que le gate accepte, puis un dossier publié scellé sur ses octets', async () => {
  const root = racineDeTest();
  try {
    // 1. Préparation sans revues : le dossier existe, le gate le refuse pour la seule raison des revues.
    const preparation = await materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage });
    assert.deepEqual(preparation.erreurs, []);
    const paquet = JSON.parse(readFileSync(join(root, 'editorial/recettes', SLUG, 'paquet-revue.json'), 'utf8'));
    assert.equal(paquet.claims.length, 1);
    const claimId = paquet.claims[0].id;
    const sansRevue = await validateDossier({ root, slug: SLUG, renderedBlogHtml: blogRendu, gateMode: 'protected-preview' });
    assert.equal(sansRevue.pass, false);
    assert.ok(sansRevue.errors.every((e) => /revue|review|P0|score|image|visuel|business|pret-preview|blocking|soutient|editorialStatus/i.test(e)), sansRevue.errors.join('\n'));

    // 2. Avec les revues : le gate passe en preview protégée.
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'revues.json'), JSON.stringify(revues(claimId), null, 2));
    const scellement = await materialiser({ root, slug: SLUG, statut: 'pret-preview', fetcher, rendreImage });
    assert.deepEqual(scellement.erreurs, []);
    const preview = await validateDossier({ root, slug: SLUG, renderedBlogHtml: blogRendu, gateMode: 'protected-preview' });
    assert.deepEqual(preview.errors, []);
    assert.equal(preview.pass, true);
    const images = readFileSync(join(root, 'src/data/images.mjs'), 'utf8');
    assert.ok(images.includes(`'img-art-${SLUG}'`) && images.includes('Trois colonnes'), 'hero déclaré avec son alt');
    assert.ok(images.includes("'img-existante'"), 'les entrées existantes sont conservées');
    const queue = JSON.parse(readFileSync(join(root, 'editorial/queue.json'), 'utf8'));
    assert.deepEqual(queue.candidates, [{ slug: SLUG, date: jour, status: 'pret-preview' }]);

    // 3. Production puis publication scellée : l'audit en mode publication-scellee passe.
    const production = await materialiser({ root, slug: SLUG, statut: 'go-production', fetcher, rendreImage });
    assert.deepEqual(production.erreurs, []);
    const prod = await validateDossier({ root, slug: SLUG, renderedBlogHtml: blogRendu, gateMode: 'production' });
    assert.deepEqual(prod.errors, []);
    assert.match(readFileSync(join(root, 'src/content/blog', `${SLUG}.md`), 'utf8'), /^brouillon: false$/m);
    await materialiser({ root, slug: SLUG, statut: 'publie', fetcher, rendreImage });
    ecrireSceau(root, SLUG);
    const scelle = await validateDossier({ root, slug: SLUG, renderedBlogHtml: blogRendu, gateMode: 'publication-scellee' });
    assert.deepEqual(scelle.errors, []);
    const sceau = JSON.parse(readFileSync(join(root, 'editorial/articles', SLUG, PUBLICATION_SEAL_PATH), 'utf8'));
    assert.equal(sceau.kind, 'publication-scellee');
    assert.ok(sceau.files.length > 20 && sceau.files.every((f) => /^[a-f0-9]{64}$/.test(f.sha256)));

    // 4. Un octet modifié après publication casse le sceau.
    const claimsPath = join(root, 'editorial/articles', SLUG, 'claims.json');
    writeFileSync(claimsPath, readFileSync(claimsPath, 'utf8').replace('"version": 1', '"version": 1 '));
    const casse = await validateDossier({ root, slug: SLUG, renderedBlogHtml: blogRendu, gateMode: 'publication-scellee' });
    assert.ok(casse.errors.some((e) => /empreinte divergente \(claims\.json\)/.test(e)), casse.errors.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la forge refuse un claim dont la citation ne recouvre pas l’affirmation', async () => {
  const root = racineDeTest();
  try {
    const r = recette();
    r.claims[0].claim = 'Les données personnelles ne peuvent pas être conservées indéfiniment';
    r.claims[0].excerpt = 'relève de l’analyse de conformité que le responsable doit mener pour son traitement.';
    r.claims[0].sourceId = 'cnil-durees-bis';
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify(r, null, 2));
    const resultat = await materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage });
    assert.ok(resultat.erreurs.some((e) => /recouvrement insuffisant/.test(e)), resultat.erreurs.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la recette porte sa date de mise à jour jusqu’au frontmatter, et son absence ne l’invente pas', () => {
  const sans = frontmatter(construireManifest(recette(), 'publie', jour, null));
  assert.ok(!/^dateMiseAJour:/m.test(sans), 'aucune date de mise à jour ne doit apparaître sans updatedAt');
  const manifest = construireManifest({ ...recette(), updatedAt: '2026-09-17' }, 'publie', jour, null);
  assert.equal(manifest.updatedAt, '2026-09-17');
  assert.match(frontmatter(manifest), /^datePublication: [^\n]+\ndateMiseAJour: 2026-09-17$/m);
});
