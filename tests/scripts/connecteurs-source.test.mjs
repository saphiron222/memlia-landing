import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/*
 * `src/data/connecteurs.ts` reprend `docs/strategy/site-v3/hub-agents-ia/CONNECTEURS.md` mot pour mot (tâche 8) :
 * même ordre de cartes, même domaine, même nom (le texte en gras de la colonne « Logiciel », R14), même ligne
 * « Ce que nos agents font avec ». Une ligne « Idem X. » vaut la ligne de la carte X du même domaine. Les comptes par
 * domaine sont ceux du tableau du §19.1, que le document tient à la main : une carte perdue ou ajoutée d'un seul côté
 * rougit ici. Seule différence admise : les apostrophes, typographiques dans les données.
 *
 * Ce lecteur est écrit à part du script qui a produit les données ; il ne lit que le Markdown et le module.
 */

const RACINE = fileURLToPath(new URL('../../', import.meta.url));
const SOURCE = `${RACINE}docs/strategy/site-v3/hub-agents-ia/CONNECTEURS.md`;
const connecteurs = () => import('../../src/data/connecteurs.ts');

const PREMIERE_SECTION = 2;
const DERNIERE_SECTION = 16;
const apostrophes = (texte) => String(texte).replace(/[’‘ʼ]/gu, "'");

/** Les cellules d'une ligne de tableau Markdown, sans les bords. */
const cellules = (ligne) => ligne.replace(/^\|\s?|\s?\|$/gu, '').split(' | ').map((c) => c.trim());

/**
 * Les cartes du document, section par section (§2 à §16), chacune avec son nom en gras et sa ligne résolue ; et les
 * comptes du §19.1. Lève sur une table mal formée (nombre de cellules) ou sur un « Idem » introuvable.
 */
export function lireCartes(markdown) {
  const sections = [];
  let courante = null;
  let entetes = null;
  for (const ligne of markdown.split('\n')) {
    const titre = ligne.match(/^## (\d+)\. (.+)$/u);
    if (titre) {
      const numero = Number(titre[1]);
      courante = numero >= PREMIERE_SECTION && numero <= DERNIERE_SECTION ? { numero, titre: titre[2], cartes: [] } : null;
      if (courante) sections.push(courante);
      entetes = null;
      continue;
    }
    if (!courante || !ligne.startsWith('| ')) continue;
    const morceaux = cellules(ligne);
    if (morceaux[0] === '#') { entetes = morceaux; continue; }
    if (!entetes || !/^\d+$/u.test(morceaux[0])) continue;
    if (morceaux.length !== entetes.length) throw new Error(`§${courante.numero}, carte ${morceaux[0]} : ${morceaux.length} cellules pour ${entetes.length} colonnes`);
    const cellule = (nom) => morceaux[entetes.indexOf(nom)];
    const nom = morceaux[1].match(/^\*\*(.+?)\*\*/u)?.[1];
    if (!nom) throw new Error(`§${courante.numero}, carte ${morceaux[0]} : nom sans gras`);
    const ligneBrute = cellule('Ce que nos agents font avec');
    if (!ligneBrute) throw new Error(`§${courante.numero}, ${nom} : colonne « Ce que nos agents font avec » absente`);
    courante.cartes.push({ nom, ligneBrute });
  }
  for (const section of sections) {
    for (const carte of section.cartes) {
      let ligne = carte.ligneBrute;
      const vues = [];
      for (let idem = ligne.match(/^Idem (.+)\.$/u); idem; idem = ligne.match(/^Idem (.+)\.$/u)) {
        const x = idem[1];
        const candidats = section.cartes.filter((autre) => autre !== carte && (autre.nom === x || autre.nom.startsWith(`${x} `) || autre.nom.endsWith(` ${x}`)));
        const exact = candidats.filter((autre) => autre.nom === x);
        const cible = exact.length === 1 ? exact[0] : candidats.length === 1 ? candidats[0] : null;
        if (!cible || vues.includes(cible.nom)) throw new Error(`§${section.numero}, ${carte.nom} : « Idem ${x} » introuvable, ambigu ou circulaire`);
        vues.push(cible.nom);
        ligne = cible.ligneBrute;
      }
      if (/^Idem\b/u.test(ligne)) throw new Error(`§${section.numero}, ${carte.nom} : « ${ligne} » ne se résout pas mot pour mot`);
      carte.ligne = ligne;
    }
  }
  const comptes = [];
  const debut = markdown.indexOf('### 19.1');
  const fin = markdown.indexOf('### 19.2');
  for (const ligne of markdown.slice(debut, fin).split('\n')) {
    const morceaux = ligne.startsWith('| ') ? cellules(ligne) : [];
    if (/^\d+$/u.test(morceaux[0] ?? '')) comptes.push({ domaine: morceaux[1], nombre: Number(morceaux.at(-1).match(/^\d+/u)?.[0]) });
  }
  return { sections, comptes };
}

/** Les écarts entre le document lu et les données. */
function ecarts({ sections, comptes }, { CONNECTEURS, DOMAINES }) {
  const erreurs = [];
  if (sections.length !== DOMAINES.length) erreurs.push(`${sections.length} sections pour ${DOMAINES.length} domaines`);
  if (comptes.length !== sections.length) erreurs.push(`§19.1 : ${comptes.length} domaines comptés pour ${sections.length} sections`);
  sections.forEach((section, i) => {
    if (comptes[i] && comptes[i].nombre !== section.cartes.length) erreurs.push(`§${section.numero} : ${section.cartes.length} cartes, §19.1 en annonce ${comptes[i].nombre}`);
    const domaine = DOMAINES[i];
    if (!domaine) return;
    if (!section.titre.startsWith(domaine.libelle)) erreurs.push(`§${section.numero} « ${section.titre} » : domaine « ${domaine.libelle} » attendu à ce rang`);
    const donnees = CONNECTEURS.filter((c) => c.domaine === domaine.id);
    if (donnees.length !== section.cartes.length) erreurs.push(`${domaine.id} : ${donnees.length} cartes dans les données, ${section.cartes.length} dans le document`);
    section.cartes.forEach((carte, j) => {
      const c = donnees[j];
      if (!c) return;
      if (apostrophes(c.nom) !== apostrophes(carte.nom)) erreurs.push(`${domaine.id} n° ${j + 1} : nom « ${c.nom} », le document dit « ${carte.nom} »`);
      if (apostrophes(c.faitAvec) !== apostrophes(carte.ligne)) erreurs.push(`${domaine.id}, ${carte.nom} : ligne différente du document`);
    });
  });
  const total = sections.reduce((somme, s) => somme + s.cartes.length, 0);
  if (total !== CONNECTEURS.length) erreurs.push(`${total} cartes dans le document, ${CONNECTEURS.length} dans les données`);
  return erreurs;
}

test('témoins : une carte retirée, un mot changé, un « Idem » sans cible ou un compte du §19.1 faux rougissent', async () => {
  const module = await connecteurs();
  const markdown = readFileSync(SOURCE, 'utf8');
  assert.deepEqual(ecarts(lireCartes(markdown), module), [], 'le document réel est le témoin vert');
  const ligneDe = (nom) => markdown.split('\n').find((l) => l.includes(`| **${nom}**`));
  const sansPennylane = markdown.replace(`${ligneDe('Pennylane')}\n`, '');
  const sansCarte = ecarts(lireCartes(sansPennylane), module);
  assert.ok(sansCarte.includes('§2 : 48 cartes, §19.1 en annonce 49'), sansCarte.join(' | '));
  assert.ok(sansCarte.includes('production-comptable : 49 cartes dans les données, 48 dans le document'), sansCarte.join(' | '));
  const motChange = markdown.replace(ligneDe('Qonto'), ligneDe('Qonto').replace('Rapproche un par un', 'Rapproche deux par deux'));
  assert.ok(ecarts(lireCartes(motChange), module).some((e) => /Qonto : ligne différente/u.test(e)));
  // Shine dit « Idem Qonto. » : changer Qonto change aussi Shine.
  assert.ok(ecarts(lireCartes(motChange), module).some((e) => /Shine : ligne différente/u.test(e)));
  assert.throws(() => lireCartes(markdown.replace('| Idem Qonto. |', '| Idem Carte inventée. |')), /introuvable/u);
  assert.ok(ecarts(lireCartes(markdown.replace(/(\| 2 \| Paie et social \| [^|]+ \| )40 \|/u, '$141 |')), module).some((e) => /§3 : 40 cartes, §19.1 en annonce 41/u.test(e)));
});

test('les cartes des données sont celles de CONNECTEURS.md : ordre, domaine, nom et ligne, comptes du §19.1', async (t) => {
  const module = await connecteurs();
  const lu = lireCartes(readFileSync(SOURCE, 'utf8'));
  t.diagnostic(`${lu.sections.reduce((s, x) => s + x.cartes.length, 0)} cartes lues en ${lu.sections.length} sections ; §19.1 : ${lu.comptes.map(({ nombre }) => nombre).join(', ')}`);
  assert.deepEqual(ecarts(lu, module), []);
});
