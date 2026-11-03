import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES_NOINDEX } from '../../src/data/site.mjs';

/**
 * /ressources a été retiré le 16/09/2026 (29a3eaa3) sans redirection : Google l'affichait encore et la
 * production répondait 404. Ce test tient la 301 vers /blog dans public/_redirects, sans build (il ne lit
 * que les sources) ; la présence réelle de la cible dans le sitemap se prouve au build (tests/proof/test_resources.py
 * tient /ressources hors du sitemap).
 */
const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SOURCES = ['/ressources', '/ressources/', '/ressources.html'];
const CIBLE = '/blog';

const regles = readFileSync(join(ROOT, 'public/_redirects'), 'utf8')
  .split('\n').map(ligne => ligne.trim()).filter(ligne => ligne && !ligne.startsWith('#'))
  .map(ligne => {
    const [from, to, status, extra] = ligne.split(/\s+/);
    return { ligne, from, to, status, extra };
  });
const parSource = new Map(regles.map(regle => [regle.from, regle]));

test('ressources : chaque variante de l’ancienne URL est une 301 exacte vers /blog', () => {
  for (const source of SOURCES) {
    const regle = parSource.get(source);
    assert.ok(regle, `règle absente pour ${source}`);
    assert.equal(regle.to, CIBLE, source);
    assert.equal(regle.status, '301', `${source} : redirection permanente attendue`);
    assert.equal(regle.extra, undefined, `${source} : aucun champ en trop`);
  }
});

test('ressources : aucune règle _redirects n’a de source dupliquée', () => {
  assert.equal(parSource.size, regles.length, 'une source répétée rend la règle appliquée ambiguë');
});

test('ressources : la cible est une vraie page indexable, sans chaîne ni boucle', () => {
  assert.ok(existsSync(join(ROOT, 'src/pages/blog.astro')), `${CIBLE} n’a pas de route source`);
  assert.ok(!PAGES_NOINDEX.includes(CIBLE), `${CIBLE} est en noindex : une 301 vers elle ne remplace rien`);
  assert.ok(!parSource.has(CIBLE) && !parSource.has(`${CIBLE}/`) && !parSource.has(`${CIBLE}.html`), 'la cible redirige à son tour : chaîne');
  for (const source of SOURCES) assert.notEqual(parSource.get(source)?.to, source, `${source} : boucle`);
  for (const regle of regles) assert.ok(!SOURCES.includes(regle.to.replace(/#.*/, '')), `${regle.ligne} : une autre règle vise l’ancienne URL`);
});

test('ressources : plus aucune page statique ni lien interne ne vit sur /ressources', () => {
  assert.ok(!existsSync(join(ROOT, 'src/pages/ressources.astro')) && !existsSync(join(ROOT, 'src/pages/ressources')),
    'une page /ressources réapparaît : la redirection la masquerait');
  const lien = /(?:href\s*=\s*["']|\]\(|["'`])\/ressources(?:["'`)#?/]|\s|$)/;
  const trouves = [];
  const parcourir = (dossier) => {
    for (const nom of readdirSync(dossier)) {
      const chemin = join(dossier, nom);
      if (statSync(chemin).isDirectory()) { parcourir(chemin); continue; }
      if (!/\.(astro|mjs|ts|tsx|md|mdx|json|txt|html)$/.test(nom)) continue;
      if (lien.test(readFileSync(chemin, 'utf8'))) trouves.push(relative(ROOT, chemin));
    }
  };
  parcourir(join(ROOT, 'src'));
  parcourir(join(ROOT, 'public'));
  assert.deepEqual(trouves, [], 'des pages pointent vers /ressources, qui redirige maintenant');
});
