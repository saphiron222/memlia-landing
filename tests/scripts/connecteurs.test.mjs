import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { INTEGRATIONS } from '../helpers/integration-data.mjs';
import { DOMAINE } from '../helpers/domaines-proscrits.mjs';
import { normaliser } from '../helpers/agents-interdits.mjs';

/*
 * I9 (remplacé à la porte 2, 15/10/2026) : la page `/integrations` est une page de compatibilité à logos, sans statut
 * d'outil, sans total, sans lien sortant. Les règles viennent de porte2-rulings.md §1 à §3 et du plan, tâche 8.
 *
 * `src/data/connecteurs.ts` n'existe pas encore (tâche 8) : les contrôles qui le lisent échouent avec « Cannot find
 * module », les témoins de l'instrument (connecteurs fictifs) passent déjà.
 *
 * Contrat d'export attendu de `src/data/connecteurs.ts` (le plan nomme DOMAINES, Connecteur, MENTION_MARQUES et
 * PAGE_OUTILS, pas la liste ni l'indicateur de logos ; ce test fixe leurs noms) :
 *   CONNECTEURS: readonly Connecteur[]   DOMAINES: readonly { id; libelle; gestes }[]
 *   MENTION_MARQUES: string              PAGE_OUTILS: { chemin; … }      LOGOS_REQUIRED: boolean
 */

const RACINE = fileURLToPath(new URL('../../', import.meta.url));
const connecteurs = () => import('../../src/data/connecteurs.ts');
const specialistes = () => import('../../src/data/specialistes.ts');

const CLES = ['id', 'nom', 'editeur', 'domaine', 'faitAvec', 'guides', 'agents', 'logo', 'etat'];
const MENTION_MARQUES = 'Marques et logos de leurs titulaires, cités sans partenariat.';
const AGENTS_ID = [
  'comptabilite', 'paie-social', 'juridique-fiscal', 'finance', 'missions-audit', 'commercial',
  'communication', 'relation-client', 'gestion-cabinet', 'rh-cabinet', 'informatique-outils', 'protection-donnees',
];
/** Les quatre cartes de l'État : nom seul, jamais de logo (Marianne est réservée aux services de l'État). */
const CARTES_DE_L_ETAT = ['impots.gouv.fr', 'guichet unique', 'annuaire des entreprises', 'douane.gouv.fr'];
const DOMAINE_FACTURATION = 'facturation-electronique';
const DOMAINES_ATTENDUS = 15;
const SRC_LOGO = /^\/logos\/[a-z0-9][a-z0-9-]*\.(?:svg|webp)$/u;
const ADRESSE = /https?:\/\/|\/\/[a-z0-9]|\bwww\.|mailto:/iu;
/** Un total affiché : « 365 connecteurs », « 500+ logiciels », « plus de 300 outils ». */
const TOTAL = /\b\d[\d\s.,]*\+?\s*(?:connecteurs?|logiciels?|outils?|intégrations?|solutions?|cartes?)\b/iu;

/** Le compte des cartes écrit comme un nombre, sauf après « Microsoft » (Microsoft 365 est un produit). */
const motifDuTotal = (n) => new RegExp(`(?<!Microsoft\\s)(?<![\\p{L}\\p{N}])${n}(?![\\p{N}])`, 'u');
const chaines = (valeur) => {
  if (typeof valeur === 'string') return [valeur];
  if (Array.isArray(valeur)) return valeur.flatMap(chaines);
  if (valeur && typeof valeur === 'object') return Object.values(valeur).flatMap(chaines);
  return [];
};
const cle = (texte) => normaliser(texte);
const motEntier = (texte) => new RegExp(`(?<![\\p{L}\\p{N}])${normaliser(texte).replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}(?![\\p{L}\\p{N}])`, 'u');

/** Les erreurs d'une fiche de connecteur seule. `contexte` = { domaines, guides, logoPresent }. */
function erreursConnecteur(c, { domaines, guides, logoPresent }) {
  const erreurs = [];
  const nom = `${c?.id ?? '?'}`;
  for (const cleInconnue of Object.keys(c).filter((k) => !CLES.includes(k))) {
    const nature = /statut|status|livraison|format|verifi|eprouv|export|demande|recette/iu.test(cleInconnue) ? 'champ de statut'
      : /lien|url|href|site|marque/iu.test(cleInconnue) ? 'lien sortant ou marque de lien' : 'champ hors contrat';
    erreurs.push(`${nom} : ${nature} « ${cleInconnue} »`);
  }
  if (typeof c.id !== 'string' || !/^[a-z0-9][a-z0-9-]*$/u.test(c.id)) erreurs.push(`${nom} : id illisible`);
  for (const champ of ['nom', 'editeur', 'faitAvec']) {
    if (typeof c[champ] !== 'string' || c[champ].trim() !== c[champ] || c[champ] === '') erreurs.push(`${nom} : ${champ} vide ou mal cadré`);
  }
  if (typeof c.faitAvec === 'string' && /\n/u.test(c.faitAvec)) erreurs.push(`${nom} : faitAvec tient sur plusieurs lignes`);
  if (!domaines.includes(c.domaine)) erreurs.push(`${nom} : domaine inconnu « ${c.domaine} »`);
  if (c.guides !== undefined) {
    if (!Array.isArray(c.guides) || c.guides.length === 0) erreurs.push(`${nom} : guides vide`);
    else for (const guide of c.guides) if (!guides.includes(guide)) erreurs.push(`${nom} : guide inconnu « ${guide} »`);
  }
  if (c.agents !== undefined) {
    if (!Array.isArray(c.agents) || c.agents.length === 0) erreurs.push(`${nom} : agents vide`);
    else for (const agent of c.agents) if (!AGENTS_ID.includes(agent)) erreurs.push(`${nom} : agent inconnu « ${agent} »`);
  }
  if (!('logo' in c)) erreurs.push(`${nom} : logo absent (null ou { src, alt })`);
  else if (c.logo !== null) {
    if (Object.keys(c.logo ?? {}).sort().join() !== 'alt,src') erreurs.push(`${nom} : logo doit être { src, alt }`);
    else if (!SRC_LOGO.test(c.logo.src)) erreurs.push(`${nom} : logo.src hors de /logos/ en svg ou webp « ${c.logo.src} »`);
    // R27 (mineur différé de la tâche 1) : le fichier porte l'id de SA carte, jamais celui d'une autre.
    else if (c.logo.src.replace(/^\/logos\/|\.(?:svg|webp)$/gu, '') !== c.id) erreurs.push(`${nom} : logo.src ne porte pas l'id de sa carte « ${c.logo.src} »`);
    else if (!logoPresent(c.logo.src)) erreurs.push(`${nom} : fichier de logo absent « ${c.logo.src} »`);
    if (typeof c.logo?.alt !== 'string' || c.logo.alt.trim() === '') erreurs.push(`${nom} : logo.alt vide`);
  }
  if (c.etat !== undefined && c.etat !== true) erreurs.push(`${nom} : etat vaut true ou n'existe pas`);
  if (c.etat === true && c.logo !== null) erreurs.push(`${nom} : une carte de l'État n'a jamais de logo`);
  for (const texte of chaines(c)) {
    if (ADRESSE.test(texte)) erreurs.push(`${nom} : adresse dans « ${texte} » (aucun lien sortant)`);
    if (DOMAINE.test(texte)) erreurs.push(`${nom} : domaine proscrit dans « ${texte} »`);
  }
  if (/r[ée]visaudit/iu.test(c.nom ?? '')) erreurs.push(`${nom} : RévisAudit est exclu`);
  return erreurs;
}

const valide = () => ({ id: 'pennylane', nom: 'Pennylane', editeur: 'Pennylane', domaine: 'comptabilite', faitAvec: 'Prépare les imports et les rapprochements, que le collaborateur valide.', guides: ['dsn-sage'], agents: ['comptabilite'], logo: { src: '/logos/pennylane.svg', alt: 'Logo Pennylane' } });
const contexte = { domaines: ['comptabilite', 'paie'], guides: ['dsn-sage', 'lettrage-sage'], logoPresent: () => true };
const mutant = (changes) => ({ ...valide(), ...changes });

test('témoin : un connecteur conforme ne rend aucune erreur, une carte de l’État sans logo non plus', () => {
  assert.deepEqual(erreursConnecteur(valide(), contexte), []);
  assert.deepEqual(erreursConnecteur(mutant({ id: 'impots', nom: 'impots.gouv.fr', logo: null, etat: true }), contexte), []);
  assert.deepEqual(erreursConnecteur(mutant({ guides: undefined, agents: undefined }), contexte), []);
});

test('témoins : un champ de statut, un lien, un logo mal posé, un guide inconnu, une adresse ou un domaine proscrit rougissent', () => {
  const cas = [
    [{ statut: 'eprouve' }, /champ de statut « statut »/u],
    [{ livraison: { libelle: 'x' } }, /champ de statut « livraison »/u],
    [{ format: 'FEC' }, /champ de statut « format »/u],
    [{ verifieLe: '2026-10-15' }, /champ de statut « verifieLe »/u],
    [{ lien: 'https://www.pennylane.com/' }, /lien sortant ou marque de lien « lien »/u],
    [{ marque: 'texte' }, /marque de lien « marque »/u],
    [{ faitAvec: 'Voir https://www.pennylane.com/fr' }, /adresse dans/u],
    [{ faitAvec: 'Écrire à contact@sirene.fr' }, /domaine proscrit/u],
    [{ domaine: 'inconnu' }, /domaine inconnu/u],
    [{ guides: ['guide-inventé'] }, /guide inconnu/u],
    [{ agents: ['agent-inventé'] }, /agent inconnu/u],
    [{ nom: '' }, /nom vide/u],
    [{ faitAvec: 'ligne un\nligne deux' }, /plusieurs lignes/u],
    [{ logo: undefined }, /logo doit être|logo absent/u],
    [{ logo: { src: 'https://cdn.exemple.fr/logo.svg', alt: 'x' } }, /logo.src hors de \/logos\//u],
    [{ logo: { src: '/logos/pennylane.png', alt: 'x' } }, /logo.src hors de \/logos\//u],
    [{ logo: { src: '/logos/pennylane.svg', alt: '' } }, /logo.alt vide/u],
    [{ logo: { src: '/logos/cegid-loop.svg', alt: 'Logo Cegid' } }, /ne porte pas l'id de sa carte/u],
    [{ logo: { src: '/logos/pennylane-encre.svg', alt: 'Logo Pennylane' } }, /ne porte pas l'id de sa carte/u],
    [{ etat: true }, /carte de l'État n'a jamais de logo/u],
    [{ etat: false }, /etat vaut true/u],
    [{ nom: 'RévisAudit' }, /RévisAudit est exclu/u],
  ];
  for (const [changes, attendu] of cas) {
    const c = mutant(changes);
    if ('logo' in changes && changes.logo === undefined) delete c.logo;
    const erreurs = erreursConnecteur(c, contexte);
    assert.ok(erreurs.some((e) => attendu.test(e)), `${JSON.stringify(changes)} → ${JSON.stringify(erreurs)}`);
  }
  // Un logo déclaré mais absent du disque rougit, même quand les logos ne sont pas encore exigés.
  assert.ok(erreursConnecteur(valide(), { ...contexte, logoPresent: () => false }).some((e) => /fichier de logo absent/u.test(e)));
});

test('I9 : chaque connecteur a id, nom, éditeur, domaine et une ligne « ce que nos agents font avec » ; aucun champ de statut, aucun lien', async () => {
  const { CONNECTEURS, DOMAINES } = await connecteurs();
  assert.ok(Array.isArray(CONNECTEURS) && CONNECTEURS.length > 0, 'CONNECTEURS est exporté et non vide');
  const contexteReel = {
    domaines: DOMAINES.map(({ id }) => id),
    guides: INTEGRATIONS.map(({ slug }) => slug),
    logoPresent: (src) => existsSync(`${RACINE}public${src}`),
  };
  assert.deepEqual(CONNECTEURS.flatMap((c) => erreursConnecteur(c, contexteReel)), []);
});

test('I9 : ids et noms uniques (chaque logiciel une seule fois), aucun total dans les données de la page', async (t) => {
  const { CONNECTEURS, DOMAINES, PAGE_OUTILS } = await connecteurs();
  const doublons = (valeurs) => valeurs.filter((valeur, i) => valeurs.indexOf(valeur) !== i);
  assert.deepEqual(doublons(CONNECTEURS.map(({ id }) => id)), [], 'ids en double');
  assert.deepEqual(doublons(CONNECTEURS.map(({ nom }) => cle(nom))), [], 'noms en double');
  assert.equal(PAGE_OUTILS.chemin, '/integrations');
  // Aucun total : ni dans les domaines, ni dans la page. Le compte (365 au relevé du 15/10) reste interne ; le motif
  // suit le compte réel, et « Microsoft 365 » (un nom de produit) n'en est pas un.
  const textes = [...chaines(DOMAINES), ...chaines(PAGE_OUTILS)];
  const total = motifDuTotal(CONNECTEURS.length);
  assert.deepEqual(textes.filter((texte) => TOTAL.test(texte) || total.test(texte)), []);
  const parDomaine = DOMAINES.map(({ id }) => `${id} ${CONNECTEURS.filter((c) => c.domaine === id).length}`);
  t.diagnostic(`${CONNECTEURS.length} connecteurs en ${DOMAINES.length} domaines (compte interne, jamais affiché) : ${parDomaine.join(', ')}`);
});

test('I9 : quinze domaines, chacun avec ses connecteurs sauf la facturation électronique, qui ne nomme aucune plateforme', async () => {
  const { CONNECTEURS, DOMAINES } = await connecteurs();
  assert.equal(DOMAINES.length, DOMAINES_ATTENDUS);
  assert.ok(DOMAINES.every(({ id, libelle }) => typeof id === 'string' && id && typeof libelle === 'string' && libelle));
  const vides = DOMAINES.filter(({ id }) => id !== DOMAINE_FACTURATION && !CONNECTEURS.some((c) => c.domaine === id));
  assert.deepEqual(vides.map(({ id }) => id), [], 'domaine sans carte');

  const facturation = DOMAINES.find(({ id }) => id === DOMAINE_FACTURATION);
  assert.ok(facturation, `le domaine « ${DOMAINE_FACTURATION} » existe (CONNECTEURS.md §6)`);
  assert.deepEqual(CONNECTEURS.filter((c) => c.domaine === DOMAINE_FACTURATION).map(({ id }) => id), [], 'aucune plateforme nommée en facturation électronique');
  const texte = normaliser(chaines(facturation).join(' '));
  const nommes = CONNECTEURS.flatMap((c) => [c.nom, c.editeur]).filter((nom, i, tous) => typeof nom === 'string' && nom.length > 2 && tous.indexOf(nom) === i && motEntier(nom).test(texte));
  assert.deepEqual(nommes, [], 'le domaine de la facturation électronique nomme un éditeur ou un logiciel');
});

test('I9 : exactement quatre cartes de l’État, sans logo ; MENTION_MARQUES dit la mention de la charte', async () => {
  const { CONNECTEURS, MENTION_MARQUES: mention } = await connecteurs();
  assert.equal(mention, MENTION_MARQUES);
  const etat = CONNECTEURS.filter((c) => c.etat === true);
  assert.equal(etat.length, 4);
  assert.ok(etat.every((c) => c.logo === null), 'une carte de l’État ne porte jamais de logo');
  for (const attendu of CARTES_DE_L_ETAT) assert.ok(etat.some((c) => normaliser(c.nom).includes(attendu)), `carte de l’État manquante : ${attendu}`);
  assert.deepEqual(CONNECTEURS.filter((c) => c.etat !== true && c.etat !== undefined), []);
});

test('I9 : LOGOS_REQUIRED est booléen ; vrai, toute carte hors État a son logo présent sous public/logos/', async (t) => {
  const { CONNECTEURS, LOGOS_REQUIRED } = await connecteurs();
  assert.equal(typeof LOGOS_REQUIRED, 'boolean', 'LOGOS_REQUIRED est exporté (même patron que AVATARS_REQUIRED)');
  const sansLogo = CONNECTEURS.filter((c) => c.etat !== true && c.logo === null);
  t.diagnostic(`LOGOS_REQUIRED = ${LOGOS_REQUIRED} ; ${CONNECTEURS.length - sansLogo.length - CONNECTEURS.filter((c) => c.etat === true).length} logos posés, ${sansLogo.length} noms en texte`);
  if (LOGOS_REQUIRED) {
    assert.deepEqual(sansLogo.map(({ id }) => id), [], 'LOGOS_REQUIRED est vrai : chaque carte hors État porte son logo');
    assert.ok(CONNECTEURS.filter((c) => c.etat !== true).every((c) => existsSync(`${RACINE}public${c.logo.src}`)));
  }
});

test('I9 : chaque nom de Specialiste.logiciels est le nom exact d’une carte (R14), comme le contrôle de CONNECTEURS.md §20 bis', async (t) => {
  const { CONNECTEURS } = await connecteurs();
  const { AGENTS } = await specialistes();
  // R14 : égalité stricte avec `Connecteur.nom` (le texte en gras de la colonne « Logiciel »), ni casse ni id.
  const connus = new Set(CONNECTEURS.map((c) => c.nom));
  const cites = AGENTS.flatMap((agent) => (agent.logiciels ?? agent.fiche?.logiciels ?? []).map((nom) => [agent.slug, nom]));
  assert.ok(cites.length > 0, 'aucun agent n’expose `logiciels` (sur Specialiste ou sur sa Fiche) : le contrôle serait vide');
  t.diagnostic(`${cites.length} logiciels cités par les agents, ${new Set(cites.map(([, nom]) => cle(nom))).size} noms distincts`);
  assert.deepEqual(cites.filter(([, nom]) => !connus.has(nom)).map(([slug, nom]) => `${slug} : ${nom}`), []);
});

/* ---------------------------------------------------------------------------------------------------------------
 * Tâche 8 : les fichiers de logos, les domaines et la page (porte 2, R14, R17, R27).
 * ------------------------------------------------------------------------------------------------------------- */

const DOSSIER_LOGOS = `${RACINE}public/logos`;
/** Ce qui, dans un SVG servi par le site, pourrait agir hors de l'image (le fichier vient d'un tiers). */
const SVG_INTERDIT = [
  [/<script/iu, '<script>'],
  [/\son[a-z]+\s*=/iu, 'attribut on*'],
  [/<foreignObject/iu, '<foreignObject>'],
  [/(?:xlink:)?href\s*=\s*["'](?!#|data:image\/(?:png|jpe?g|gif|webp);base64,)/iu, 'href externe'],
  [/@import/iu, '@import'],
  [/url\(\s*['"]?\s*(?:https?:|\/\/)/iu, 'url() externe'],
  [/javascript:/iu, 'javascript:'],
  [/<!ENTITY|<!DOCTYPE/iu, 'DOCTYPE ou ENTITY'],
  [/<(?:iframe|embed|object)\b/iu, 'iframe, embed ou object'],
  // Un SVG servi est une surface publique : test_positioning.py y lit « module- » jusque dans les noms de classes.
  [/module-|\bmodules?\b|\bcompléments?\s+(?:excel|memlia)\b/iu, 'vocabulaire verrouillé (charte §9)'],
];
/** Un logo est petit : un fichier plus lourd est un visuel, ou un raster mal converti. */
const OCTETS_MAX = 40_000;
const WEBP = (octets) => octets.subarray(0, 4).toString('latin1') === 'RIFF' && octets.subarray(8, 12).toString('latin1') === 'WEBP';

/** Les erreurs d'un fichier de logo, lu comme octets ; `nom` est son nom dans public/logos. */
function erreursFichierLogo(nom, octets) {
  const erreurs = [];
  if (octets.length > OCTETS_MAX) erreurs.push(`${nom} : ${octets.length} octets (plafond ${OCTETS_MAX})`);
  if (nom.endsWith('.svg')) {
    const texte = octets.toString('utf8');
    for (const [motif, libelle] of SVG_INTERDIT) if (motif.test(texte)) erreurs.push(`${nom} : ${libelle}`);
    const ouverture = texte.match(/<svg\b[^>]*>/iu)?.[0];
    if (!ouverture) erreurs.push(`${nom} : aucune balise <svg>`);
    else if (!/\sxmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/u.test(ouverture)) erreurs.push(`${nom} : xmlns SVG absent (rien ne s'affiche dans un <img>)`);
  } else if (nom.endsWith('.webp')) {
    if (!WEBP(octets)) erreurs.push(`${nom} : pas un WebP (en-tête RIFF/WEBP absent)`);
  } else erreurs.push(`${nom} : extension hors de svg et webp`);
  return erreurs;
}

test('témoins : un SVG piégé, sans xmlns, un faux WebP ou un fichier lourd rougissent ; un SVG sain passe', () => {
  const sain = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 10 10"><defs><path id="a" d="M0 0h10v10z"/></defs><use xlink:href="#a"/><image href="data:image/png;base64,AAAA"/></svg>';
  assert.deepEqual(erreursFichierLogo('sain.svg', Buffer.from(sain)), []);
  const piege = (morceau) => erreursFichierLogo('piege.svg', Buffer.from(sain.replace('<defs>', `${morceau}<defs>`)));
  for (const [morceau, attendu] of [
    ['<script>alert(1)</script>', /<script>/u],
    ['<g onload="x()"/>', /attribut on\*/u],
    ['<foreignObject><p>x</p></foreignObject>', /foreignObject/u],
    ['<a href="https://exemple.fr"><g/></a>', /href externe/u],
    ['<use xlink:href="https://exemple.fr/s.svg#a"/>', /href externe/u],
    ['<style>@import url(x.css);</style>', /@import/u],
    ['<rect style="fill:url(https://exemple.fr/p.svg#g)"/>', /url\(\) externe/u],
    ['<a href="javascript:x()"><g/></a>', /javascript:|href externe/u],
    ['<iframe src="x"/>', /iframe/u],
    ['<g class="Logo-module--medium--3cfc65"/>', /vocabulaire verrouillé/u],
  ]) assert.ok(piege(morceau).some((e) => attendu.test(e)), morceau);
  assert.ok(erreursFichierLogo('a.svg', Buffer.from('<?xml version="1.0"?><!DOCTYPE svg [<!ENTITY a "b">]><svg xmlns="http://www.w3.org/2000/svg"/>')).some((e) => /DOCTYPE/u.test(e)));
  assert.ok(erreursFichierLogo('a.svg', Buffer.from('<svg viewBox="0 0 1 1"><path d="M0 0"/></svg>')).some((e) => /xmlns/u.test(e)));
  assert.ok(erreursFichierLogo('a.webp', Buffer.from('<html>pas une image</html>')).some((e) => /pas un WebP/u.test(e)));
  assert.ok(erreursFichierLogo('a.png', Buffer.from('x')).some((e) => /extension/u.test(e)));
  assert.ok(erreursFichierLogo('a.svg', Buffer.from(sain.padEnd(OCTETS_MAX + 1, ' '))).some((e) => /plafond/u.test(e)));
});

test('témoin : le motif du total suit le compte et laisse passer « Microsoft 365 »', () => {
  const total = motifDuTotal(365);
  assert.ok(total.test('Nos 365 connecteurs'));
  assert.ok(total.test('365 logiciels pris en charge'));
  assert.ok(!total.test('Microsoft 365, Google Workspace'));
  assert.ok(!total.test('3650 ou 1365'));
  assert.ok(motifDuTotal(366).test('366 cartes') && !motifDuTotal(366).test('365 cartes'));
});

test('R27 : chaque fichier de public/logos est le logo d’une seule carte, sain, et chaque logo déclaré y est', async (t) => {
  const { CONNECTEURS } = await connecteurs();
  const fichiers = existsSync(DOSSIER_LOGOS) ? readdirSync(DOSSIER_LOGOS) : [];
  const declares = new Map(CONNECTEURS.filter((c) => c.logo).map((c) => [c.logo.src.replace(/^\/logos\//u, ''), c.id]));
  t.diagnostic(`${fichiers.length} fichiers dans public/logos, ${declares.size} logos déclarés`);
  assert.deepEqual(fichiers.filter((nom) => !declares.has(nom)), [], 'fichier de logo sans carte (orphelin)');
  assert.deepEqual([...declares.keys()].filter((nom) => !fichiers.includes(nom)), [], 'logo déclaré sans fichier');
  // Un id, un fichier : deux extensions pour la même carte rendraient la correspondance ambiguë.
  const ids = fichiers.map((nom) => nom.replace(/\.[a-z]+$/u, ''));
  assert.deepEqual(ids.filter((id, i) => ids.indexOf(id) !== i), [], 'deux fichiers pour une même carte');
  assert.deepEqual(fichiers.flatMap((nom) => erreursFichierLogo(nom, readFileSync(`${DOSSIER_LOGOS}/${nom}`))), []);
});

test('R17 : les logos sur tuile encre sont des logos posés, jamais une carte de l’État', async () => {
  const { CONNECTEURS, LOGOS_SUR_ENCRE } = await connecteurs();
  assert.ok(LOGOS_SUR_ENCRE instanceof Set, 'LOGOS_SUR_ENCRE est un ensemble d’ids de cartes');
  const parId = new Map(CONNECTEURS.map((c) => [c.id, c]));
  assert.deepEqual([...LOGOS_SUR_ENCRE].filter((id) => !parId.get(id)?.logo || parId.get(id)?.etat), []);
});

test('les domaines : agents connus, ids distincts de ceux des cartes (ancres), libellé de la famille Excel jamais affiché', async () => {
  const { CONNECTEURS, DOMAINES, PAGE_OUTILS } = await connecteurs();
  for (const domaine of DOMAINES) {
    assert.ok(typeof domaine.gestes === 'string' && domaine.gestes.trim() !== '', `${domaine.id} : gestes vides`);
    assert.ok(Array.isArray(domaine.agents) && domaine.agents.length > 0, `${domaine.id} : aucun agent`);
    assert.deepEqual(domaine.agents.filter((agent) => !AGENTS_ID.includes(agent)), [], `${domaine.id} : agent inconnu`);
  }
  const idsCartes = new Set(CONNECTEURS.map(({ id }) => id));
  assert.deepEqual(DOMAINES.map(({ id }) => id).filter((id) => idsCartes.has(id)), [], 'un domaine et une carte partagent une ancre');
  const visibles = normaliser([...chaines(DOMAINES), ...chaines(PAGE_OUTILS), ...CONNECTEURS.flatMap(chaines)].join(' '));
  assert.ok(!visibles.includes(normaliser('Compléments greffés sur Excel')), 'le libellé de la famille complements-excel ne s’affiche jamais');
  assert.ok(!/\bmodules?\b|\bcompléments?\s+(?:excel|memlia)\b/iu.test(visibles), '« module » et « complément Excel » ne s’écrivent pas');
});

test('PAGE_OUTILS : la requête et l’ouverture de la description du contrat d’intention ; le H1 porte la requête', async () => {
  const { PAGE_OUTILS } = await connecteurs();
  const contrat = JSON.parse(readFileSync(`${RACINE}config/page-intent-contract.json`, 'utf8')).pages[PAGE_OUTILS.chemin];
  assert.ok(contrat, 'config/page-intent-contract.json porte /integrations');
  assert.equal(contrat.query, PAGE_OUTILS.requete);
  assert.equal(contrat.descriptionLead, PAGE_OUTILS.descriptionLead);
  assert.ok(PAGE_OUTILS.description.startsWith(PAGE_OUTILS.descriptionLead), 'la description ouvre sur son descriptionLead');
  const mots = (texte) => normaliser(texte).normalize('NFD').replace(/\p{M}/gu, '').match(/[\p{L}\p{N}]+/gu) ?? [];
  const h1 = new Set(mots(PAGE_OUTILS.h1).map((mot) => mot.replace(/s$/u, '')));
  const manquants = mots(PAGE_OUTILS.requete).filter((mot) => mot.length > 2 && !h1.has(mot.replace(/s$/u, '')));
  assert.deepEqual(manquants, [], 'mot de la requête absent du H1');
  for (const champ of ['h1', 'titreOnglet', 'description', 'ariane', 'nomListe', 'datePublication', 'dateMiseAJour']) {
    assert.ok(typeof PAGE_OUTILS[champ] === 'string' && PAGE_OUTILS[champ].trim() !== '', `PAGE_OUTILS.${champ}`);
  }
  assert.ok(PAGE_OUTILS.datePublication <= PAGE_OUTILS.dateMiseAJour);
});
