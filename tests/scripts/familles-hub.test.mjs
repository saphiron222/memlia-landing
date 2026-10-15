import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as familles from '../../src/data/familles.ts';

/*
 * I3 : les comptes publics ne bougent pas quand le hub ajoute ses familles.
 *
 * Les 21 familles neuves vivent dans `FAMILLES_HUB` (même fichier, `active: false` imposé), jamais dans `FAMILLES` :
 * « soixante familles, douze pôles » (accueil, /methode, pilier, article scellé « la carte des tâches ») et
 * « huit familles » (carte CAC) restent vrais. `FAMILLES_HUB` n'existe pas encore (tâche 2) : les contrôles qui le
 * lisent échouent, les comptes déjà publiés sont gardés dès aujourd'hui.
 */

const RACINE = fileURLToPath(new URL('../../', import.meta.url));
const lire = (chemin) => readFileSync(`${RACINE}${chemin}`, 'utf8');
const { FAMILLES, POLES, IDS_POLES, IDS_FAMILLES, famillesDeLaProfession } = familles;

const ARTICLE_EC = 'automatiser-un-cabinet-comptable-la-carte-des-taches';
const ARTICLE_CAC = 'automatiser-un-cabinet-cac-la-carte-des-taches';
/** Les 21 familles neuves et leur pôle (AGENTS-CONTENU §14 ; liste de la tâche 2). */
const NEUVES = {
  'developpement-cabinet': ['suivi-prospects', 'propositions-mission', 'actualite-a-diffuser', 'lettre-information-clients', 'publications-cabinet'],
  'paie-social': ['ecritures-de-paie', 'diffusion-documents-paie'],
  'juridique-fiscal': ['liasse-fiscale'],
  'conseil-missions': ['remuneration-dirigeant'],
  'administratif-secretariat': ['suivi-demandes-clients', 'satisfaction-clients'],
  'rh-formation': ['indicateurs-sociaux-cabinet'],
  'numerique-it-data': ['comptes-acces', 'sauvegardes-mises-a-jour', 'support-outils', 'inventaire-outils', 'registre-traitements', 'demandes-droits', 'durees-conservation', 'incidents-donnees'],
  'excel-outils-existants': ['migrations-reprises'],
};
/** Descriptions de familles.ts que FACT-CHECK.md contredit (« à éviter » n° 10 et n° 7, §4), à corriger avec la tâche 2. */
const DESCRIPTIONS_CONTREDITES = {
  'dsn-crm': /déposer la DSN/iu,
  'facture-electronique': /transmettre/iu,
  'lettre-de-mission-lcbft': /tenir la vigilance/iu,
};

const hub = () => {
  assert.ok(Array.isArray(familles.FAMILLES_HUB), 'FAMILLES_HUB n’est pas exporté par src/data/familles.ts (tâche 2)');
  return familles.FAMILLES_HUB;
};

const UNITES = { zéro: 0, un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7, huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14, quinze: 15, seize: 16 };
const DIZAINES = { vingt: 20, trente: 30, quarante: 40, cinquante: 50, soixante: 60 };
/** « Soixante » → 60, « vingt-cinq » → 25, « quatre-vingt-dix-sept » → 97 ; jusqu'à 99. */
function motsEnNombre(mots) {
  const parties = mots.toLowerCase().replace(/-et-/gu, '-').split('-').map((partie) => partie.replace(/(?<=vingt)s$/u, ''));
  let total = 0;
  for (let i = 0; i < parties.length; i += 1) {
    if (parties[i] === 'quatre' && parties[i + 1] === 'vingt') { total += 80; i += 1; continue; }
    const valeur = UNITES[parties[i]] ?? DIZAINES[parties[i]] ?? (parties[i] === 'vingt' ? 20 : undefined);
    assert.notEqual(valeur, undefined, `nombre en toutes lettres illisible : « ${mots} »`);
    total += valeur;
  }
  return total;
}

/** Le résumé de l'article, dans sa copie scellée (manifeste éditorial) et dans la copie publiée (frontmatter). */
function resumes(slug) {
  const scelle = JSON.parse(lire(`editorial/articles/${slug}/manifest.json`)).summary;
  const publie = /^resume: "(.*)"$/mu.exec(lire(`src/content/blog/${slug}.md`))?.[1];
  assert.ok(scelle && publie, `${slug} : résumé scellé ou publié introuvable`);
  return { scelle, publie };
}

/** Un pôle absent de l'enum `cluster` du blog ne doit pas porter de famille active (le blog ne l'accepterait pas). */
function polesHorsEnumAvecFamilleActive(poles, enumCluster, toutes) {
  return poles.filter((pole) => !enumCluster.includes(pole) && toutes.some((famille) => famille.pole === pole && famille.active));
}
const enumCluster = () => {
  const ligne = /cluster: z\.enum\(\[([^\]]*)\]\)/u.exec(lire('src/content.config.ts'));
  assert.ok(ligne, 'enum cluster introuvable dans src/content.config.ts');
  return [...ligne[1].matchAll(/'([^']+)'/gu)].map((m) => m[1]);
};

test('témoin : les nombres en toutes lettres des résumés se lisent', () => {
  for (const [mots, nombre] of [['Soixante', 60], ['douze', 12], ['Huit', 8], ['vingt-cinq', 25], ['quatre-vingts', 80], ['quatre-vingt-dix-sept', 97], ['soixante-et-onze', 71], ['soixante-dix', 70]]) {
    assert.equal(motsEnNombre(mots), nombre, mots);
  }
  assert.throws(() => motsEnNombre('mille'), /illisible/u);
});

test('témoin : un pôle hors de l’enum `cluster` qui porte une famille active est vu, un pôle sans famille active non', () => {
  const toutes = [{ pole: 'a', active: true }, { pole: 'b', active: false }, { pole: 'b', active: false }, { pole: 'c', active: true }];
  assert.deepEqual(polesHorsEnumAvecFamilleActive(['a', 'b', 'c'], ['a'], toutes), ['c']);
  assert.deepEqual(polesHorsEnumAvecFamilleActive(['a', 'b'], ['a'], toutes), []);
});

test('I3 : la carte publiée compte 85 familles, dont 60 EC dans 12 pôles et 25 CAC dont 8 ouvertes', () => {
  assert.equal(FAMILLES.length, 85);
  const ec = famillesDeLaProfession('ec');
  assert.equal(ec.length, 60);
  assert.equal(new Set(ec.map(({ pole }) => pole)).size, 12);
  const cac = famillesDeLaProfession('cac');
  assert.equal(cac.length, 25);
  assert.equal(cac.filter(({ active }) => active).length, 8);
  assert.equal(IDS_FAMILLES.length, 85);
  assert.deepEqual([...IDS_FAMILLES], FAMILLES.map(({ id }) => id));
});

test('I3 : les résumés de « la carte des tâches » (copie scellée et copie publiée) disent les nombres de la carte, mots rendus en chiffres', () => {
  const ec = famillesDeLaProfession('ec');
  const poles = new Set(ec.map(({ pole }) => pole)).size;
  for (const [source, resume] of Object.entries(resumes(ARTICLE_EC))) {
    const nombreFamilles = /^(\p{L}[\p{L}-]*) familles\b/u.exec(resume)?.[1];
    const nombrePoles = /\ben (\p{L}[\p{L}-]*) pôles\b/u.exec(resume)?.[1];
    assert.ok(nombreFamilles && nombrePoles, `${source} : « N familles … en N pôles » introuvable dans « ${resume} »`);
    assert.equal(motsEnNombre(nombreFamilles), ec.length, `${source} : familles`);
    assert.equal(motsEnNombre(nombrePoles), poles, `${source} : pôles`);
  }
  const ouvertes = famillesDeLaProfession('cac').filter(({ active }) => active).length;
  for (const [source, resume] of Object.entries(resumes(ARTICLE_CAC))) {
    const nombre = /^(\p{L}[\p{L}-]*) familles\b/u.exec(resume)?.[1];
    assert.ok(nombre, `${source} : « N familles » introuvable dans « ${resume} »`);
    assert.equal(motsEnNombre(nombre), ouvertes, `${source} : familles CAC ouvertes`);
  }
});

test('I3 : `cluster` est contenu dans les pôles, et tout pôle hors de l’enum n’a que des familles inactives', () => {
  const cluster = enumCluster();
  assert.ok(cluster.length >= 17, `${cluster.length} valeurs dans l’enum cluster`);
  assert.deepEqual(cluster.filter((pole) => !IDS_POLES.includes(pole)), [], 'valeur de cluster qui n’est pas un pôle');
  assert.deepEqual(polesHorsEnumAvecFamilleActive(IDS_POLES, cluster, [...FAMILLES, ...(familles.FAMILLES_HUB ?? [])]), []);
});

test('I3 : FAMILLES_HUB porte les 21 familles neuves, toutes inactives et de profession EC, aucune dans la carte publiée', () => {
  const attendues = Object.entries(NEUVES).flatMap(([pole, ids]) => ids.map((id) => [id, pole]));
  assert.equal(attendues.length, 21);
  assert.deepEqual(hub().map(({ id, pole }) => [id, pole]).sort(), attendues.sort());
  assert.ok(hub().every(({ active }) => active === false), 'FAMILLES_HUB impose active: false');
  assert.ok(hub().every(({ profession }) => profession === 'ec'));
  assert.ok(hub().every(({ libelle, description }) => libelle && description), 'libellé et description rédigés');
  const publiees = new Set(FAMILLES.map(({ id }) => id));
  assert.deepEqual(hub().filter(({ id }) => publiees.has(id)), []);
});

test('I3 : le pôle « Développement du cabinet » existe, et la carte publiée ne le porte pas', () => {
  assert.deepEqual(POLES['developpement-cabinet'], { libelle: 'Développement du cabinet', couleur: '#c2410c' });
  assert.ok(IDS_POLES.includes('developpement-cabinet'));
  assert.equal(IDS_POLES.length, 18);
  assert.deepEqual(FAMILLES.filter(({ pole }) => pole === 'developpement-cabinet'), []);
});

test('I3 : TOUTES_LES_FAMILLES réunit la carte et FAMILLES_HUB ; la recherche par id et par pôle les trouve, les listes publiées non', () => {
  assert.ok(Array.isArray(familles.TOUTES_LES_FAMILLES), 'TOUTES_LES_FAMILLES n’est pas exporté par src/data/familles.ts (tâche 2)');
  assert.deepEqual(familles.TOUTES_LES_FAMILLES.map(({ id }) => id), [...FAMILLES, ...hub()].map(({ id }) => id));
  assert.equal(familles.TOUTES_LES_FAMILLES.length, 106);
  assert.equal(new Set(familles.TOUTES_LES_FAMILLES.map(({ id }) => id)).size, 106, 'identifiants uniques');
  assert.equal(familles.familleParId('registre-traitements')?.pole, 'numerique-it-data');
  assert.equal(familles.familleParId('collecte-pieces')?.pole, 'production-comptable');
  assert.deepEqual(familles.famillesDuPole('developpement-cabinet').map(({ id }) => id).sort(), [...NEUVES['developpement-cabinet']].sort());
  assert.ok(NEUVES['numerique-it-data'].every((id) => familles.famillesDuPole('numerique-it-data').some((famille) => famille.id === id)));
  // La carte publiée, elle, ne bouge pas.
  assert.equal(IDS_FAMILLES.length, 85);
  assert.equal(famillesDeLaProfession('ec').length, 60);
  assert.deepEqual(IDS_FAMILLES.filter((id) => hub().some((famille) => famille.id === id)), []);
});

test('I3 : les trois descriptions que FACT-CHECK.md contredit sont corrigées (DSN déposée, facture transmise, vigilance tenue)', () => {
  for (const [id, interdit] of Object.entries(DESCRIPTIONS_CONTREDITES)) {
    const famille = familles.familleParId(id);
    assert.ok(famille, id);
    assert.doesNotMatch(famille.description, interdit, `${id} : « ${famille.description} »`);
  }
});
