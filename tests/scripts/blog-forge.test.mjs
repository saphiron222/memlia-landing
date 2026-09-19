import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import * as forge from '../../scripts/blog-forge.mjs';
import { materialiser, ecrireSceau, unitesRendues, jetons, construireManifest, frontmatter } from '../../scripts/blog-forge.mjs';
import { validateDossier, semaineIso, verifierPlafonds, PUBLICATION_SEAL_PATH } from '../../scripts/lib/blog-pipeline.mjs';

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SLUG = 'automatiser-une-tache-de-test';
const jour = new Date().toISOString().slice(0, 10);

const CORPS_REGLE = `## La règle écrite

**La frontière.** Ce qui se prépare seul, ce qui attend une validation, ce qui reste humain.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| la lecture du relevé | l'écart typé | le jugement sur un écart inexpliqué |

**La proposition.** Nous produisons une proposition ; le collaborateur saisit ou valide.

**L’arrêt.** Un montant illisible arrête la règle, qui nomme la ligne refusée.

**Le jeu d’essai.** Rejoué sur un dossier fictif de douze mouvements.

## Rejoué sur le jeu fictif

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| mouvement courant | rapproché, écart 0,00 | proposé |
| montant illisible | refusé, ligne 7 nommée | humain |
| doublon | rapproché, doublon signalé | validation |
`;

const CORPS = `## Réponse directe

Automatiser une tâche de cabinet consiste à exécuter une règle écrite sans intervention humaine à chaque occurrence, et à faire remonter ce qui sort de la règle. La validation reste au cabinet.

## Ce que dit le cadre

Les données personnelles ne peuvent pas être conservées indéfiniment et une durée de conservation doit être déterminée par le responsable de traitement. Le cabinet fixe donc une durée par pièce.

## Ce qui reste humain

Le module prépare un résultat et la personne responsable conserve la validation ; il refuse d'écrire quand une pièce est illisible ou quand la règle ne couvre pas le cas rencontré. Voir [la méthode](/methode) et [l'article frère](/blog/article-frere).
${CORPS_REGLE}`;

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
  mkdirSync(join(root, 'docs/strategy/site-v3/mesures'), { recursive: true });
  writeFileSync(join(root, `docs/strategy/site-v3/mesures/questions-${jour}.json`), JSON.stringify({
    jour,
    autocompletion: {
      'automatiser une tâche de test cabinet': [],
      'tâche de test cabinet comptable': [],
    },
  }));
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

test('les Cicatrices ont leur samedi hebdomadaire en sus des quatre articles ordinaires', () => {
  const semainePleine = [
    { date: '2026-09-15', status: 'publie' },
    { date: '2026-09-16', status: 'publie' },
    { date: '2026-09-16', status: 'publie' },
    { date: '2026-09-17', status: 'publie' },
  ];
  verifierPlafonds(semainePleine, '2026-09-19', { serie: 'cicatrices' });
  assert.throws(() => verifierPlafonds(semainePleine, '2026-09-18', { serie: 'cicatrices' }), /paraît le samedi/);
  const avecCicatrice = [...semainePleine, { date: '2026-09-19', status: 'publie', serie: 'cicatrices' }];
  assert.throws(() => verifierPlafonds(avecCicatrice, '2026-09-19', { serie: 'cicatrices' }), /déjà planifiée la semaine 2026-W38/);
  assert.throws(() => verifierPlafonds(avecCicatrice, '2026-09-17'), /4 candidats sont déjà planifiés la semaine 2026-W38/);
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

test('la forge refuse un H1 narratif avant de créer le candidat', async () => {
  const root = racineDeTest();
  try {
    const r = recette();
    r.title = "La plateforme que personne n'a achetée, et ce que le refus m'a appris";
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify(r, null, 2));
    await assert.rejects(
      materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage, jour }),
      /H1 narratif sans intention mesurée/,
    );
    assert.equal(existsSync(join(root, 'editorial/articles', SLUG)), false, 'aucun dossier candidat ne doit être écrit');
    assert.equal(existsSync(join(root, 'src/content/blog', `${SLUG}.md`)), false, 'aucun article ne doit être écrit');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
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

test('le contexte d’une source HTML monoligne avec balise inline reste borné et passe le gate', async () => {
  const root = racineDeTest();
  try {
    const r = recette();
    const phrase = r.claims[0].excerpt;
    const autresExtraits = r.sources.slice(1).map((source) => `<p>${source.excerpt} dans une phrase de contrôle distincte.</p>`).join('');
    const contexteAttendu = `Introduction ${phrase} conclusion.`;
    const pageSurUneLigne = `<html><head><style>${'.carte{color:#231f20}'.repeat(80)}</style></head><body><p>Phrase précédente sans rapport.</p><p>Introduction <a>${phrase}</a> conclusion.</p>${autresExtraits}<p>Phrase suivante sans rapport.</p></body></html>`;
    const fetcherMonoligne = async () => new Response(pageSurUneLigne, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } });
    const preparation = await materialiser({
      root,
      slug: SLUG,
      statut: 'a-valider',
      fetcher: fetcherMonoligne,
      rendreImage,
    });
    assert.deepEqual(preparation.erreurs, []);
    const claims = JSON.parse(readFileSync(join(root, 'editorial/articles', SLUG, 'claims.json'), 'utf8'));
    const contexte = claims.claims[0].factCheck.sourceResults[0].context;
    assert.equal(contexte, contexteAttendu);
    assert.ok(!contexte.includes('.carte'));
    assert.ok(contexte.length < 300);

    writeFileSync(join(root, 'editorial/recettes', SLUG, 'revues.json'), JSON.stringify(revues(claims.claims[0].id), null, 2));
    const scellement = await materialiser({ root, slug: SLUG, statut: 'pret-preview', fetcher: fetcherMonoligne, rendreImage });
    assert.deepEqual(scellement.erreurs, []);
    const gate = await validateDossier({ root, slug: SLUG, renderedBlogHtml: blogRendu, gateMode: 'protected-preview' });
    assert.deepEqual(gate.errors, []);
    assert.equal(gate.pass, true);
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

// --- La règle écrite (charte §2 bis, 19/09/2026) : exigée pour les articles nouveaux, jamais pour les anciens.


test('la règle écrite : exigée pour un article daté à partir du 19/09/2026, ignorée avant', () => {
  const ancien = '## Réponse directe\n\nRien de plus.';
  assert.deepEqual(forge.verifierRegleEcrite(ancien, { date: '2026-09-18' }), []);
  const erreurs = forge.verifierRegleEcrite(ancien, { date: '2026-09-19' });
  assert.ok(erreurs.some((e) => /La règle écrite/.test(e)), erreurs.join('\n'));
  assert.ok(erreurs.some((e) => /Rejoué sur le jeu fictif/.test(e)), erreurs.join('\n'));
  assert.deepEqual(forge.verifierRegleEcrite(`${ancien}\n\n${CORPS_REGLE}`, { date: '2026-09-19' }), []);
});

test('la règle écrite : chaque partie manquante est nommée, et deux lignes de rejeu ne suffisent pas', () => {
  const sansArret = CORPS_REGLE.replace('**L’arrêt.** Un montant illisible arrête la règle, qui nomme la ligne refusée.', 'Un montant illisible arrête la règle.');
  const e1 = forge.verifierRegleEcrite(sansArret, { date: '2026-10-01' });
  assert.ok(e1.some((e) => /L’arrêt/.test(e)) && e1.length === 1, e1.join('\n'));
  const sansTableau = CORPS_REGLE.replace(/\| Se prépare seul[\s\S]*?humain \|\n/, '');
  assert.ok(forge.verifierRegleEcrite(sansTableau, { date: '2026-10-01' }).some((e) => /trois colonnes/.test(e)));
  const deuxLignes = CORPS_REGLE.replace('| doublon | rapproché, doublon signalé | validation |\n', '');
  assert.ok(forge.verifierRegleEcrite(deuxLignes, { date: '2026-10-01' }).some((e) => /trois lignes/.test(e)));
  const apostropheDroite = CORPS_REGLE.replace('**L’arrêt.**', "**L'arrêt.**").replace('**Le jeu d’essai.**', "**Le jeu d'essai.**");
  assert.deepEqual(forge.verifierRegleEcrite(apostropheDroite, { date: '2026-10-01' }), []);
});

test('la forge refuse de matérialiser un article nouveau sans sa règle écrite, et l’accepte avec', async () => {
  const root = racineDeTest();
  try {
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'corps.md'), CORPS.replace(CORPS_REGLE, ''));
    const refus = await materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage });
    assert.ok(refus.erreurs.some((e) => /La règle écrite/.test(e)), refus.erreurs.join('\n'));
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'corps.md'), CORPS);
    const ok = await materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage });
    assert.deepEqual(ok.erreurs, []);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('la palette : le brief d’un article nouveau doit épingler ses couleurs, et l’image doit les porter', async () => {
  const root = racineDeTest();
  try {
    const source = join(root, 'editorial/recettes', SLUG, 'image-source.png');
    // Une image crème et verte, sans le moindre graphite : exactement la dette mesurée le 18/09/2026.
    await sharp({ create: { width: 640, height: 360, channels: 3, background: '#fcfbf7' } })
      .composite([{ input: await sharp({ create: { width: 320, height: 180, channels: 3, background: '#27b657' } }).png().toBuffer(), left: 40, top: 40 }])
      .png().toFile(source);
    const r = recette();
    r.date = '2026-09-20';
    r.image.source = { path: 'image-source.png', generationId: 'test-1', model: 'gpt_image_2_5', provider: 'higgsfield', generatedAt: r.date, credits: 3 };
    r.image.brief = { sujet: 'Sujet de test.', composition: 'Composition de test.', style: 'Style de test.', palette: 'Vert Memlia #27b657 dominant, crème #fcfbf7, touches de graphite #231f20.', interdits: 'Texte lisible.', prompt: 'Prompt de test.' };
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify(r, null, 2));
    const refus = await materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage });
    assert.ok(refus.erreurs.some((e) => /#231f20/.test(e) && /plancher/.test(e)), refus.erreurs.join('\n'));
    const revue = JSON.parse(readFileSync(join(root, 'editorial/articles', SLUG, 'preuves/image/visual-review.json'), 'utf8'));
    assert.equal(revue.palette.statut, 'FAIL');
    assert.ok(revue.palette.parts['#27b657'] > 0.2, 'le vert du carré est bien mesuré');

    // Le même défaut sur un article antérieur au 19/09 : enregistré en dette, il ne bloque pas.
    r.date = '2026-09-15';
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify(r, null, 2));
    const dette = await materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage });
    assert.deepEqual(dette.erreurs, []);
    const revueDette = JSON.parse(readFileSync(join(root, 'editorial/articles', SLUG, 'preuves/image/visual-review.json'), 'utf8'));
    assert.equal(revueDette.palette.statut, 'DETTE');
    assert.ok(revueDette.palette.ecarts.some((e) => /#231f20/.test(e)));

    // Un brief qui nomme une couleur sans son hex est refusé avant même de regarder l'image.
    r.date = '2026-09-20';
    r.image.brief.palette = 'Vert Memlia #27b657 dominant, crème #fcfbf7, touches de graphite.';
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify(r, null, 2));
    const flou = await materialiser({ root, slug: SLUG, statut: 'a-valider', fetcher, rendreImage });
    assert.ok(flou.erreurs.some((e) => /graphite/.test(e) && /hex/.test(e)), flou.erreurs.join('\n'));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
