import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import sharp from 'sharp';
import { injecterPreuvesInline } from '../../scripts/blog-forge.mjs';

const root = new URL('../../', import.meta.url).pathname;
const proof = (id) => ({ id, insertBeforeHeading: 'Suite', alt: 'Preuve fictive', source: 'Jeu fictif', capturedAt: '2026-09-29' });

// Recette de référence (décision Kevin du 03/10/2026) : une figure de corps est une seule
// image 1600 × 900, la même sur bureau et sur téléphone. Elle illustre l’écran d’un outil
// fictif ; elle n’est plus refluée en bande portrait « -mobile » qui explique l’article.
const RECETTE = [
  'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
  'automatiser-un-cabinet-comptable-la-carte-des-taches',
  'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps',
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain',
  'logiciel-ia-comptabilite',
  'prompt-chatgpt-expert-comptable',
  'tests-verts-et-regle-des-trois-passes',
];
const preuvesDe = (slug) => JSON.parse(readFileSync(`${root}/editorial/recettes/${slug}/recette.json`, 'utf8')).inlineProofs;
const echapper = (texte) => texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const figureAttendue = ({ id, alt }) => `<figure data-blog-proof="${id}">\n  <img src="/proofs/blog/${id}.webp" alt="${echapper(alt)}" width="1600" height="900" loading="lazy" decoding="async">\n</figure>`;

test('les preuves de corps des sept articles sont une image 1600 × 900, sans variante portrait', async () => {
  const ids = RECETTE.flatMap((slug) => preuvesDe(slug).map(({ id }) => id));
  assert.equal(new Set(ids).size, 14);
  for (const id of ids) {
    const path = `${root}/public/proofs/blog/${id}.webp`;
    assert.ok(existsSync(path), `Preuve absente : ${id}`);
    const { format, width, height } = await sharp(path).metadata();
    assert.deepEqual([format, width, height], ['webp', 1600, 900], `Format de la recette : ${id}`);
    assert.ok(!existsSync(`${root}/public/proofs/blog/${id}-mobile.webp`), `Variante portrait interdite : ${id}`);
    const rendered = injecterPreuvesInline('Intro\n\n## Suite\n', [proof(id)]);
    assert.ok(rendered.includes(figureAttendue(proof(id))), `Figure de la forge hors recette : ${id}`);
    assert.doesNotMatch(rendered, /srcset=|sizes=|figcaption|preuve-defilante|-mobile\.webp/);
  }
});

test('les corps publiés portent exactement la figure de référence, avant le H2 déclaré', () => {
  for (const slug of RECETTE) {
    const markdown = readFileSync(`${root}/src/content/blog/${slug}.md`, 'utf8');
    const figures = markdown.match(/<figure\b[^>]*\bdata-blog-proof=[\s\S]*?<\/figure>/g) ?? [];
    const preuves = preuvesDe(slug);
    assert.equal(figures.length, preuves.length, `${slug} : nombre de figures`);
    // L'ordre de la recette n'est pas celui du corps : chaque figure attendue y figure une fois.
    for (const preuve of preuves) {
      assert.equal(figures.filter((figure) => figure === figureAttendue(preuve)).length, 1, `${slug} : figure ${preuve.id}`);
      assert.ok(markdown.includes(`${figureAttendue(preuve)}\n\n## ${preuve.insertBeforeHeading}\n`), `${slug} : ancrage ${preuve.id}`);
    }
    assert.doesNotMatch(markdown, /\/proofs\/blog\/[a-z0-9-]+-mobile\.webp/, `${slug} : portrait résiduel`);
  }
});

// Plus aucune bande portrait n'est publiée, et la forge n'en sert jamais : même si un fichier
// « -mobile » réapparaissait, la figure garde l'image 1600 × 900 de la recette.
test('aucun portrait « -mobile » n’est publié ni servi par la forge', () => {
  assert.deepEqual(readdirSync(`${root}/public/proofs/blog`).filter((name) => /-mobile\.webp$/.test(name)), []);
  const temporaire = mkdtempSync(join(tmpdir(), 'preuve-portrait-'));
  const cwd = process.cwd();
  try {
    mkdirSync(join(temporaire, 'public/proofs/blog'), { recursive: true });
    writeFileSync(join(temporaire, 'public/proofs/blog/preuve-test-mobile.webp'), 'portrait de fixture');
    process.chdir(temporaire);
    const rendered = injecterPreuvesInline('Intro\n\n## Suite\n', [proof('preuve-test')]);
    assert.ok(rendered.includes(figureAttendue(proof('preuve-test'))));
    assert.doesNotMatch(rendered, /-mobile\.webp|width="1200"/);
  } finally {
    process.chdir(cwd);
    rmSync(temporaire, { recursive: true, force: true });
  }
});
