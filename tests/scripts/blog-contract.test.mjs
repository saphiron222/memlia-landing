import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditerContratBlog } from '../../scripts/verify-blog-contract.mjs';

const SLUG = 'article-test';
const REQUETE = 'contrôle bulletin de paie';
const TITRE = 'Contrôle bulletin de paie : la méthode du cabinet';
const TITRE_ONGLET = 'Contrôle bulletin de paie en cabinet | Memlia';
const DESCRIPTION = 'Contrôle bulletin de paie : les étapes, les preuves et les arrêts à documenter avant la DSN.';
const MESURE = { autocompletion: { [REQUETE]: [] } };

function sourceArticle({ rubrique = true, brouillon = false } = {}) {
  return `---\ntitre: "${TITRE}"\ntitreOnglet: "${TITRE_ONGLET}"\ndescription: "${DESCRIPTION}"\nprimaryQuery: "${REQUETE}"\nsecondaryQueries: []\nbrouillon: ${brouillon}\n${rubrique ? 'rubrique: paie-dsn\n' : ''}---\n\n## Section\n`;
}

function preuve(numero) {
  return `<figure data-blog-proof><img src="/preuves/${numero}.webp" alt="Preuve ${numero}"></figure>`;
}

function pageArticle({
  preuves = 2,
  sommaire = true,
  description = DESCRIPTION,
  ogTitle = TITRE,
  headline = TITRE,
  title = TITRE_ONGLET,
  lienRubrique = true,
  legendeTechnique = false,
  legendePreuve = 'Source : jeu d’essai fictif · capture du 2026-09-20',
} = {}) {
  const sections = Array.from({ length: 6 }, (_, index) => `<h2 id="section-${index + 1}">Section ${index + 1}</h2><p>Contenu.</p>`).join('');
  const liens = Array.from({ length: 6 }, (_, index) => `<li><a href="#section-${index + 1}">Section ${index + 1}</a></li>`).join('');
  const technique = legendeTechnique ? '<p>Ouvrir la preuve en grand. Source : recette scellée ; capture du 20 septembre 2026.</p>' : '';
  return `<!doctype html><html><head><title>${title}</title><meta name="description" content="${description}"><meta property="og:title" content="${ogTitle}"><script type="application/ld+json">${JSON.stringify({ '@graph': [{ '@type': 'BlogPosting', headline }] })}</script></head><body><article><h1>${TITRE}</h1>${lienRubrique ? '<a data-blog-rubrique href="/blog/paie-dsn">Paie / DSN</a>' : ''}${sommaire ? `<nav data-blog-toc aria-label="Sommaire"><ol>${liens}</ol></nav>` : ''}<div class="article-corps">${Array.from({ length: preuves }, (_, index) => legendePreuve === null ? preuve(index + 1) : preuve(index + 1).replace('</figure>', `<figcaption>${legendePreuve}</figcaption></figure>`)).join('')}${technique}${sections}</div></article></body></html>`;
}

function fixture(options = {}) {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-contract-'));
  mkdirSync(join(root, 'src/content/blog'), { recursive: true });
  mkdirSync(join(root, 'dist/blog'), { recursive: true });
  writeFileSync(join(root, 'src/content/blog', `${SLUG}.md`), sourceArticle(options));
  writeFileSync(join(root, 'dist/blog', `${SLUG}.html`), pageArticle(options));
  writeFileSync(join(root, 'dist/blog/paie-dsn.html'), `<h1>Paie / DSN</h1><a href="/blog/${SLUG}">Lire</a>`);
  return root;
}

function auditer(root) {
  return auditerContratBlog({ root, dist: join(root, 'dist'), mesure: MESURE });
}

function temoinClause(clause, options) {
  const root = fixture(options);
  try {
    const resultat = auditer(root);
    const erreur = resultat.erreurs.find((item) => item.includes(`clause ${clause}`));
    assert.ok(erreur, `la clause ${clause} devait rougir : ${resultat.erreurs.join('\n')}`);
    console.log(`[TÉMOIN ROUGE CLAUSE ${clause}] ${erreur}`);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

test('le contrat vert contrôle chaque article de la collection sans slug codé en dur', () => {
  const root = fixture();
  try {
    const second = 'deuxieme-article-test';
    writeFileSync(join(root, 'src/content/blog', `${second}.md`), sourceArticle());
    writeFileSync(join(root, 'dist/blog', `${second}.html`), pageArticle());
    writeFileSync(join(root, 'dist/blog/paie-dsn.html'), `<h1>Paie / DSN</h1><a href="/blog/${SLUG}">Lire</a><a href="/blog/${second}">Lire</a>`);
    assert.deepEqual(auditer(root), { pass: true, articles: 2, exemptions: [], erreurs: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le build public ignore seulement les brouillons absents ; leur preview reste contrôlée intégralement', () => {
  const root = fixture();
  const draft = 'brouillon-test';
  try {
    writeFileSync(join(root, 'src/content/blog', `${draft}.md`), sourceArticle({ brouillon: true }));
    assert.deepEqual(auditer(root), { pass: true, articles: 1, exemptions: [], erreurs: [] });
    assert.match(auditerContratBlog({ root, dist: join(root, 'dist'), mesure: MESURE, slugs: [draft] }).erreurs.join('\n'), /page construite absente/);
    writeFileSync(join(root, 'dist/blog', `${draft}.html`), pageArticle({ legendeTechnique: true }));
    assert.match(auditer(root).erreurs.join('\n'), /brouillon-test : clause 1/);
    writeFileSync(join(root, 'dist/blog', `${draft}.html`), pageArticle());
    writeFileSync(join(root, 'dist/blog/paie-dsn.html'), `<a href="/blog/${SLUG}">Lire</a><a href="/blog/${draft}">Lire</a>`);
    assert.deepEqual(auditer(root), { pass: true, articles: 2, exemptions: [], erreurs: [] });
    rmSync(join(root, 'dist/blog', `${SLUG}.html`));
    assert.match(auditer(root).erreurs.join('\n'), /article-test : clause 1, page construite absente/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('un slug explicitement demandé mais absent des sources échoue au lieu de valider zéro article', () => {
  const root = fixture();
  try {
    const resultat = auditerContratBlog({ root, dist: join(root, 'dist'), mesure: MESURE, slugs: ['absent-test'] });
    assert.equal(resultat.pass, false);
    assert.match(resultat.erreurs.join('\n'), /absent-test : source article absente/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 1 — le nombre seul ne refuse pas, chaque figure et preuve déclarée reste contrôlée', () => {
  const root = fixture();
  const page = join(root, 'dist/blog', `${SLUG}.html`);
  try {
    for (const preuves of [0, 1, 2, 3]) {
      writeFileSync(page, pageArticle({ preuves }));
      assert.deepEqual(auditer(root).erreurs, [], `quota seul : ${preuves}`);
    }
    writeFileSync(page, pageArticle({ preuves: 0 }).replace(/<div class="article-corps">[\s\S]*?<\/div>/, ''));
    assert.match(auditer(root).erreurs.join('\n'), /corps.*absent/);
    for (const mutation of [
      pageArticle().replace('alt="Preuve 1"', 'alt=""'),
      pageArticle().replace('<img src="/preuves/1.webp" alt="Preuve 1">', ''),
    ]) {
      writeFileSync(page, mutation);
      assert.match(auditer(root).erreurs.join('\n'), /clause 1.*alternative accessible/);
    }
    mkdirSync(join(root, 'editorial/recettes', SLUG), { recursive: true });
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify({
      inlineProofs: [{ id: 'requise', alt: 'Preuve requise', source: 'jeu fictif', capturedAt: '2026-09-20' }],
    }));
    writeFileSync(page, pageArticle({ preuves: 0 }));
    assert.match(auditer(root).erreurs.join('\n'), /clause 1.*preuve déclarée.*requise.*absente/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 1 — zéro figure ne permet pas un corps rendu vide et n’impose aucune longueur', () => {
  const root = fixture({ preuves: 0 });
  const page = join(root, 'dist/blog', `${SLUG}.html`);
  const remplacerCorps = (contenu) => pageArticle({ preuves: 0 })
    .replace(/<div class="article-corps">[\s\S]*?<\/div>/, `<div class="article-corps">${contenu}</div>`);
  try {
    mkdirSync(join(root, 'editorial/recettes', SLUG), { recursive: true });
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify({ inlineProofs: [] }));
    for (const contenu of ['', ' \n\t ', '<!-- contenu perdu -->', '<p> &nbsp; </p><!-- contenu perdu -->']) {
      writeFileSync(page, remplacerCorps(contenu));
      const resultat = auditer(root);
      assert.equal(resultat.pass, false, `corps sans contenu : ${JSON.stringify(contenu)}`);
      assert.match(resultat.erreurs.join('\n'), /clause 1.*corps.*vide/);
    }
    writeFileSync(page, remplacerCorps('<p>X</p>'));
    assert.deepEqual(auditer(root).erreurs, [], 'aucun seuil de longueur ni quota de figures');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 1 — une légende technique publique fait échouer le contrat', () => {
  temoinClause(1, { legendeTechnique: true });
});

test('clause 1 — la source et la date informatives sont permises, pas une attestation ou consigne', () => {
  const valide = 'Source : jeu d’essai fictif · capture du 2026-09-20';
  const root = fixture({ legendePreuve: valide });
  try {
    assert.deepEqual(auditer(root).erreurs, []);
    for (const mutation of [
      'Source : jeu d’essai fictif',
      'Capture du 2026-09-20',
      'Source : recette scellée · capture du 2026-09-20',
      'Source : reconstitution fidèle de la recette scellée · capture du 2026-09-20',
      'Ouvrir la preuve en grand. ' + valide,
      'Source : jeu d’essai fictif · capture du 2026-13-90',
      'Source : jeu d’essai fictif · capture du 2099-01-01',
      'Source :   · capture du 2026-09-20',
    ]) {
      writeFileSync(join(root, 'dist/blog', `${SLUG}.html`), pageArticle({ legendePreuve: mutation }));
      assert.match(auditer(root).erreurs.join('\n'), /clause 1/, mutation);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 1 — nouvelles figures sans légende refusées, ancien dossier épinglé conservé', () => {
  const root = fixture({ brouillon: true, legendePreuve: null });
  try {
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/);
    writeFileSync(join(root, 'src/content/blog', `${SLUG}.md`), sourceArticle());
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/);
    const recette = '{"historique":true}', revue = 'revue historique';
    const hash = (value) => createHash('sha256').update(value).digest('hex');
    mkdirSync(join(root, 'editorial/recettes', SLUG), { recursive: true });
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), recette);
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'revues.json'), revue);
    mkdirSync(join(root, 'editorial'), { recursive: true });
    writeFileSync(join(root, 'editorial/legacy-review-baseline.json'), JSON.stringify({ articles: {
      [SLUG]: { recipeSha256: hash(recette), reviewSha256: hash(revue) },
    } }));
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/, 'baseline seule insuffisante');
    mkdirSync(join(root, 'editorial/articles', SLUG, 'preuves'), { recursive: true });
    const source = sourceArticle();
    writeFileSync(join(root, 'editorial/articles', SLUG, 'preuves/publication.json'), JSON.stringify({
      kind: 'publication-scellee', candidateSlug: SLUG, articleSha256: hash(source),
    }));
    assert.deepEqual(auditer(root).erreurs, []);
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), 'recette republiée');
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/);
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), recette);
    writeFileSync(join(root, 'src/content/blog', `${SLUG}.md`), `${source}\nNouvelle version`);
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 1 — image directe sans légende exige provenance liée à la recette', () => {
  const root = fixture({ legendePreuve: null });
  try {
    const recipePath = join(root, 'editorial/recettes', SLUG, 'recette.json');
    mkdirSync(join(root, 'editorial/recettes', SLUG), { recursive: true });
    const preuves = [1, 2].map((numero) => ({
      id: `preuve-${numero}`, alt: `Preuve ${numero}`,
      source: 'jeu fictif', capturedAt: '2026-09-20',
    }));
    writeFileSync(join(root, 'dist/blog', `${SLUG}.html`), pageArticle({ legendePreuve: null })
      .replace('data-blog-proof>', 'data-blog-proof="preuve-1">')
      .replace('data-blog-proof>', 'data-blog-proof="preuve-2">')
      .replace('/preuves/1.webp', '/proofs/blog/preuve-1.webp')
      .replace('/preuves/2.webp', '/proofs/blog/preuve-2.webp'));
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/, 'aucune provenance : refus');
    writeFileSync(recipePath, JSON.stringify({ inlineProofs: preuves }));
    assert.deepEqual(auditer(root).erreurs, []);
    writeFileSync(recipePath, JSON.stringify({ inlineProofs: [{ ...preuves[0], source: '' }, preuves[1]] }));
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/, 'provenance absente : refus');
    writeFileSync(recipePath, JSON.stringify({ inlineProofs: [{ ...preuves[0], alt: 'autre preuve' }, preuves[1]] }));
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/, 'alt divergent : refus');
    writeFileSync(recipePath, JSON.stringify({ inlineProofs: preuves }));
    const page = pageArticle({ legendePreuve: null })
      .replace('data-blog-proof>', 'data-blog-proof="preuve-1">')
      .replace('data-blog-proof>', 'data-blog-proof="preuve-2">')
      .replace('/preuves/1.webp', '/proofs/blog/preuve-1.webp')
      .replace('/preuves/2.webp', '/proofs/blog/preuve-2.webp');
    writeFileSync(join(root, 'dist/blog', `${SLUG}.html`), page.replace(
      '<img src="/proofs/blog/preuve-1.webp"',
      '<div class="preuve-defilante"><img src="/proofs/blog/preuve-1.webp"',
    ).replace('alt="Preuve 1"></figure>', 'alt="Preuve 1"></div></figure>'));
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/, 'panneau défilant : refus');
    writeFileSync(join(root, 'dist/blog', `${SLUG}.html`), page);
    writeFileSync(recipePath, JSON.stringify({ inlineProofs: [{ ...preuves[0], capturedAt: '2099-01-01' }, preuves[1]] }));
    assert.match(auditer(root).erreurs.join('\n'), /clause 1/, 'date future : refus');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 1 — deux figures avec le même identifiant ne comptent pas comme deux preuves', () => {
  const root = fixture({ legendePreuve: null });
  try {
    mkdirSync(join(root, 'editorial/recettes', SLUG), { recursive: true });
    writeFileSync(join(root, 'editorial/recettes', SLUG, 'recette.json'), JSON.stringify({
      inlineProofs: [{ id: 'preuve-1', alt: 'Preuve 1', source: 'jeu fictif', capturedAt: '2026-09-20' }],
    }));
    const figure = '<figure data-blog-proof="preuve-1"><img src="/proofs/blog/preuve-1.webp" alt="Preuve 1"></figure>';
    const page = pageArticle({ legendePreuve: null })
      .replace('<figure data-blog-proof><img src="/preuves/1.webp" alt="Preuve 1"></figure>', figure)
      .replace('<figure data-blog-proof><img src="/preuves/2.webp" alt="Preuve 2"></figure>', figure);
    writeFileSync(join(root, 'dist/blog', `${SLUG}.html`), page);
    const erreurs = auditer(root).erreurs.join('\n');
    assert.match(erreurs, /clause 1, identifiant data-blog-proof répété entre figures/);
    assert.doesNotMatch(erreurs, /2 requises/, 'le doublon est critique, pas le quota');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 2 — dès six H2, le sommaire porte toutes les ancres', () => {
  temoinClause(2, { sommaire: false });
});

test('clause 3 — la meta-description ouvre sur la requête mesurée', () => {
  temoinClause(3, { description: 'La méthode en six étapes pour préparer le contrôle et ses preuves.' });
});

test('clause 4 — la rubrique est déclarée, construite et réciproque', () => {
  temoinClause(4, { rubrique: false, lienRubrique: false });
});

test('clause 5 — H1, Open Graph et headline restent identiques', () => {
  temoinClause(5, { ogTitle: 'Un autre titre' });
});

test('clause 4 — une page de rubrique sans lien retour échoue', () => {
  const root = fixture();
  try {
    writeFileSync(join(root, 'dist/blog/paie-dsn.html'), '<h1>Paie / DSN</h1>');
    const resultat = auditer(root);
    assert.match(resultat.erreurs.join('\n'), /clause 4, \/blog\/paie-dsn ne pointe pas vers \/blog\/article-test/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 5 — un titre d’onglet distinct exige une requête déclarée et mesurée', () => {
  const root = fixture({ title: 'Guide pratique du cabinet | Memlia' });
  try {
    const resultat = auditer(root);
    assert.match(resultat.erreurs.join('\n'), /clause 5, le <title> diffère du H1 sans porter de requête déclarée et mesurée/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
