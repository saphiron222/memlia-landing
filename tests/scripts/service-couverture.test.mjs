import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { COUVERTURE_SERVICES } from '../../src/data/couverture-logiciels.mjs';

/*
 * Règle du 06/10/2026 : une page service dit d'abord ce que le logiciel du cabinet fait déjà,
 * sources datées, puis ce qui reste à la main. Une nouvelle page service ne passe pas sans son
 * entrée dans src/data/couverture-logiciels.mjs.
 */

const ROOT = fileURLToPath(new URL('../..', import.meta.url));
const SERVICES = join(ROOT, 'src/content/services');
const DATE = /^\d{4}-\d{2}-\d{2}$/;
// Mots du catalogue refusés sur le site (tests/proof/test_positioning.py) et appellations de Memlia proscrites.
const INTERDITS = [
  /\bmodules?\b/i,
  /\bcompléments?\s+(?:Excel|Memlia)\b/i,
  /\b(?:notre|Memlia est un|le service est un)\s+logiciel\b/i,
  /suivi.social|supervision.sociale|bulletins.dsn|synth.se.salaires|flux.compta|conseil.fiscal/i,
  /\b(?:revue métier|fact-check|non attesté)\b/i,
];
/** Une date AAAA-MM-JJ qui existe au calendrier (le 31 février ne passe pas). */
const dateReelle = (iso) => DATE.test(iso) && new Date(`${iso}T00:00:00Z`).toISOString().slice(0, 10) === iso;

const pages = existsSync(SERVICES)
  ? readdirSync(SERVICES).filter((nom) => nom.endsWith('.md')).map((nom) => nom.replace(/\.md$/, '')).sort()
  : [];
const aujourdHui = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const textesPublics = (couverture) => [
  ...couverture.dejaFait.flatMap((geste) => [geste.outil, geste.geste, geste.source.libelle]),
  ...couverture.reste,
];

test('chaque page service a sa couverture, et chaque couverture a sa page', () => {
  assert.ok(pages.length > 0, 'aucune page service trouvée');
  assert.deepEqual(pages.filter((slug) => !COUVERTURE_SERVICES[slug]), [], 'page service sans couverture');
  assert.deepEqual(Object.keys(COUVERTURE_SERVICES).filter((slug) => !pages.includes(slug)).sort(), [], 'couverture sans page');
});

test('chaque geste déjà outillé porte un éditeur, une source https et une date de lecture valide', () => {
  for (const [slug, couverture] of Object.entries(COUVERTURE_SERVICES)) {
    assert.ok(couverture.dejaFait.length > 0, `${slug} : aucun geste déjà outillé`);
    for (const geste of couverture.dejaFait) {
      assert.ok(geste.outil.trim() && geste.geste.trim(), `${slug} : geste incomplet`);
      assert.match(geste.source.url, /^https:\/\/[^\s]+$/, `${slug} : source non https (${geste.outil})`);
      assert.ok(geste.source.libelle.trim().split(/\s+/).length <= 12, `${slug} : libellé de source de plus de 12 mots`);
      assert.ok(dateReelle(geste.source.consulteLe), `${slug} : date de lecture illisible ou impossible (${geste.outil})`);
      assert.ok(geste.source.consulteLe <= aujourdHui, `${slug} : date de lecture future (${geste.outil})`);
    }
  }
});

test('chaque page dit ce qui reste à la main', () => {
  for (const [slug, couverture] of Object.entries(COUVERTURE_SERVICES)) {
    assert.ok(couverture.reste.length > 0, `${slug} : rien ne reste à la main`);
    assert.ok(couverture.reste.every((ligne) => ligne.trim().length > 0), `${slug} : ligne vide`);
  }
});

test('le vocabulaire public suit la charte : apostrophe typographique, aucun mot interdit', () => {
  for (const [slug, couverture] of Object.entries(COUVERTURE_SERVICES)) {
    for (const texte of textesPublics(couverture)) {
      assert.ok(!texte.includes("'"), `${slug} : apostrophe droite dans « ${texte} »`);
      for (const motif of INTERDITS) assert.doesNotMatch(texte, motif, `${slug} : mot interdit dans « ${texte} »`);
    }
  }
});

test('une page construite affiche le bloc de couverture', () => {
  for (const slug of pages) {
    const html = [join(ROOT, 'dist/automatisation', slug, 'index.html'), join(ROOT, 'dist/automatisation', `${slug}.html`)].find(existsSync);
    if (!html) continue;
    const contenu = readFileSync(html, 'utf8');
    assert.ok(contenu.includes('data-service-section="couverture"'), `${slug} : bloc de couverture absent du rendu`);
    for (const geste of COUVERTURE_SERVICES[slug].dejaFait) {
      assert.ok(contenu.includes(geste.source.url), `${slug} : source absente du rendu (${geste.outil})`);
    }
  }
});
