import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
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
  // Aucun total : ni dans les domaines, ni dans la page. Le compte (365 au relevé du 15/10) reste interne.
  const textes = [...chaines(DOMAINES), ...chaines(PAGE_OUTILS)];
  assert.deepEqual(textes.filter((texte) => TOTAL.test(texte) || /\b365\b/u.test(texte)), []);
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

test('I9 : chaque nom de Specialiste.logiciels est un connecteur (nom ou id), comme le contrôle de CONNECTEURS.md §20 bis', async (t) => {
  const { CONNECTEURS } = await connecteurs();
  const { AGENTS } = await specialistes();
  const connus = new Set(CONNECTEURS.flatMap((c) => [cle(c.nom), cle(c.id)]));
  const cites = AGENTS.flatMap((agent) => (agent.logiciels ?? agent.fiche?.logiciels ?? []).map((nom) => [agent.slug, nom]));
  assert.ok(cites.length > 0, 'aucun agent n’expose `logiciels` (sur Specialiste ou sur sa Fiche) : le contrôle serait vide');
  t.diagnostic(`${cites.length} logiciels cités par les agents, ${new Set(cites.map(([, nom]) => cle(nom))).size} noms distincts`);
  assert.deepEqual(cites.filter(([, nom]) => !connus.has(cle(nom))).map(([slug, nom]) => `${slug} : ${nom}`), []);
});
