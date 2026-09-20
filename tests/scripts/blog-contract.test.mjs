import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { auditerContratBlog } from '../../scripts/verify-blog-contract.mjs';

const SLUG = 'article-test';
const REQUETE = 'contrôle bulletin de paie';
const TITRE = 'Contrôle bulletin de paie : la méthode du cabinet';
const TITRE_ONGLET = 'Contrôle bulletin de paie en cabinet | Memlia';
const DESCRIPTION = 'Contrôle bulletin de paie : les étapes, les preuves et les arrêts à documenter avant la DSN.';
const MESURE = { autocompletion: { [REQUETE]: [] } };

function sourceArticle({ rubrique = true } = {}) {
  return `---\ntitre: "${TITRE}"\ntitreOnglet: "${TITRE_ONGLET}"\ndescription: "${DESCRIPTION}"\nprimaryQuery: "${REQUETE}"\nsecondaryQueries: []\n${rubrique ? 'rubrique: paie-dsn\n' : ''}---\n\n## Section\n`;
}

function preuve(numero) {
  return `<figure data-blog-proof><img src="/preuves/${numero}.webp" alt="Preuve ${numero}"><figcaption>Source : jeu d’essai fictif Memlia — capture du <time datetime="2026-09-20">20 septembre 2026</time>.</figcaption></figure>`;
}

function pageArticle({
  preuves = 2,
  sommaire = true,
  description = DESCRIPTION,
  ogTitle = TITRE,
  headline = TITRE,
  title = TITRE_ONGLET,
  lienRubrique = true,
} = {}) {
  const sections = Array.from({ length: 6 }, (_, index) => `<h2 id="section-${index + 1}">Section ${index + 1}</h2><p>Contenu.</p>`).join('');
  const liens = Array.from({ length: 6 }, (_, index) => `<li><a href="#section-${index + 1}">Section ${index + 1}</a></li>`).join('');
  return `<!doctype html><html><head><title>${title}</title><meta name="description" content="${description}"><meta property="og:title" content="${ogTitle}"><script type="application/ld+json">${JSON.stringify({ '@graph': [{ '@type': 'BlogPosting', headline }] })}</script></head><body><article><h1>${TITRE}</h1>${lienRubrique ? '<a data-blog-rubrique href="/blog/paie-dsn">Paie / DSN</a>' : ''}${sommaire ? `<nav data-blog-toc aria-label="Sommaire"><ol>${liens}</ol></nav>` : ''}<div class="article-corps">${Array.from({ length: preuves }, (_, index) => preuve(index + 1)).join('')}${sections}</div></article></body></html>`;
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
    assert.deepEqual(auditer(root), { pass: true, articles: 2, erreurs: [] });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('clause 1 — deux preuves légendées, sourcées et datées en plus de la couverture', () => {
  temoinClause(1, { preuves: 1 });
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
