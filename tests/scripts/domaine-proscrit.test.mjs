import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOMAINES_PROSCRITS, DOMAINE, LIEN, neutralise } from '../helpers/domaines-proscrits.mjs';

/*
 * Des domaines qui portent du contenu de casino, un traceur publicitaire ou un nom abandonné ne se lient jamais
 * (revisaudit.fr : demande de Kevin du 06/10/2026 ; les six autres : CONNECTEURS.md §17, relevé du 15/10/2026).
 * Garde portée de memlia-rdv/tests/preuve/domaine-proscrit.test.ts et étendue à ces domaines.
 *
 * - Ce qui se livre (code, données, fichiers publics, build) ne les nomme sous aucune forme.
 * - Les notes (docs/, commercial/, editorial/) peuvent les nommer pour mettre en garde, jamais sous une forme qui se clique, sauf la liste
 *   fermée et datée ci-dessous : elle échoue si elle grossit, et aussi si elle périme (un lien neutralisé doit
 *   sortir de la liste).
 * Les fichiers se lisent octet pour octet (latin1) : les noms de domaine sont de l'ASCII, et un binaire qui en
 * porterait un serait vu comme un fichier texte.
 */

const RACINE = fileURLToPath(new URL('../../', import.meta.url));
const LIVRES = ['src', 'public', 'functions', 'scripts', 'config', 'db', 'workers', 'guides'];
/** Les trois arbres de notes : le relevé de sources de `commercial/` et les dossiers de `editorial/` valent ceux de `docs/`. */
const NOTES = ['docs', 'commercial', 'editorial'];
const BUILD = 'dist';

/** Relevé du 15/10/2026 : les deux seuls liens cliquables que les notes portent encore. */
const LISTE_FERMEE = Object.freeze([
  { chemin: 'docs/strategy/site-v3/cac/TERRAIN-CAC.md', ligne: 204, lien: 'https://www.revisaudit.fr', releve: '2026-10-15' },
  { chemin: 'docs/strategy/site-v3/cac/terrain-verbatims.json', ligne: 35, lien: 'https://www.revisaudit.fr', releve: '2026-10-15' },
]);

/** Les fichiers d'un dossier relatif à `racine`, en chemins POSIX ; un lien symbolique ou un fichier spécial échoue. */
function fichiers(racine, dossier) {
  const entrees = readdirSync(join(racine, dossier), { recursive: true, withFileTypes: true });
  const speciaux = entrees.filter((entree) => !entree.isFile() && !entree.isDirectory());
  assert.deepEqual(speciaux.map((entree) => join(entree.parentPath, entree.name)), [], `${dossier} : entrée ni fichier ni dossier, donc non lue`);
  return entrees
    .filter((entree) => entree.isFile())
    .map((entree) => relative(racine, join(entree.parentPath, entree.name)).split(sep).join('/'));
}

const lire = (racine, chemin) => readFileSync(join(racine, chemin), 'latin1');

/**
 * Toutes les occurrences de `motif` dans les fichiers, avec leur ligne. `prefiltre` écarte d'abord, à bas coût, les
 * fichiers qui ne peuvent pas correspondre (un lien contient toujours le domaine) : 200 Mo de notes se lisent en
 * une seconde au lieu de six.
 */
function occurrences(racine, chemins, motif, prefiltre = motif) {
  const global = new RegExp(motif.source, motif.flags.includes('g') ? motif.flags : `${motif.flags}g`);
  const trouvees = [];
  for (const chemin of chemins) {
    const contenu = lire(racine, chemin);
    if (!prefiltre.test(contenu)) continue;
    for (const correspondance of contenu.matchAll(global)) {
      trouvees.push({ chemin, ligne: contenu.slice(0, correspondance.index).split('\n').length, trouve: correspondance[0] });
    }
  }
  return trouvees;
}

const compter = (cles) => cles.reduce((comptes, cle) => comptes.set(cle, (comptes.get(cle) ?? 0) + 1), new Map());
const cle = (chemin, lien) => `${chemin} ${lien.toLowerCase()}`;

/** Compare les liens cliquables trouvés à la liste fermée : ce qui s'y ajoute, et ce qui s'y périme. */
function comparer(trouvees, liste) {
  const vus = compter(trouvees.map(({ chemin, trouve }) => cle(chemin, trouve)));
  const attendus = compter(liste.map(({ chemin, lien }) => cle(chemin, lien)));
  const inattendus = trouvees.filter(({ chemin, trouve }) => (vus.get(cle(chemin, trouve)) ?? 0) > (attendus.get(cle(chemin, trouve)) ?? 0));
  const perimes = liste.filter(({ chemin, lien }) => (vus.get(cle(chemin, lien)) ?? 0) < (attendus.get(cle(chemin, lien)) ?? 0));
  return { inattendus, perimes };
}

const controleNotes = (racine, liste, arbres = NOTES) => {
  const trouvees = occurrences(racine, arbres.flatMap((arbre) => fichiers(racine, arbre)), LIEN, DOMAINE);
  return { trouvees, ...comparer(trouvees, liste) };
};
const controleLivre = (racine, dossiers) => occurrences(racine, dossiers.flatMap((dossier) => fichiers(racine, dossier)), DOMAINE);
const decrire = (liste) => liste.map(({ chemin, ligne, trouve, lien }) => `${chemin}${ligne ? `:${ligne}` : ''} ${trouve ?? lien}`);

/** Une arborescence jetable : chaque témoin écrit la sienne et la jette. */
function arbre(fichiersEcrits, usage) {
  const racine = mkdtempSync(join(tmpdir(), 'domaine-proscrit-'));
  try {
    for (const [chemin, contenu] of Object.entries(fichiersEcrits)) {
      mkdirSync(dirname(join(racine, chemin)), { recursive: true });
      writeFileSync(join(racine, chemin), contenu, 'utf8');
    }
    return usage(racine);
  } finally {
    rmSync(racine, { recursive: true, force: true });
  }
}

const LIEN_LISTE = 'https://www.revisaudit.fr/decouvrir-revisaudit-premium/';
const LISTE_TEMOIN = [{ chemin: 'docs/a.md', lien: 'https://www.revisaudit.fr' }];

test('la liste des domaines proscrits porte les sept domaines relevés', () => {
  assert.deepEqual(
    DOMAINES_PROSCRITS.map(({ domaine }) => domaine),
    ['revisaudit.fr', 'ibizasoftware.fr', 'ibiza.fr', 'formalis.io', 'sirene.fr', 'survey-smiles.com', 'sandh-zvg.com'],
  );
});

test('témoins : un lien et une mention posés exprès sont vus ; un nom neutralisé ou le seul nom de l’outil, non', () => {
  for (const { domaine } of DOMAINES_PROSCRITS) {
    const majuscules = domaine.toUpperCase();
    // Ce qui se clique : un schéma, « www. », une adresse sans schéma, un autolien, un courriel.
    for (const clic of [`voir https://www.${domaine}/webinars/`, `(www.${majuscules})`, `<https://${domaine}>`, `href="//${domaine}/x"`, `mailto:contact@${domaine}`]) {
      assert.equal(LIEN.test(clic), true, `lien non vu : ${clic}`);
      assert.equal(DOMAINE.test(clic), true, `mention non vue : ${clic}`);
    }
    // Le nom du domaine seul est une mention, pas un lien.
    assert.equal(DOMAINE.test(`${domaine} porte du contenu injecté`), true, domaine);
    assert.equal(LIEN.test(`${domaine} porte du contenu injecté`), false, domaine);
    assert.equal(DOMAINE.test(majuscules), true, domaine);
    // La forme neutralisée est la seule que les notes écrivent.
    for (const neutre of [`${neutralise(domaine)}/webinars/`, `voir ${neutralise(domaine)}`]) {
      assert.equal(DOMAINE.test(neutre), false, `mention de ${neutre}`);
      assert.equal(LIEN.test(neutre), false, `lien de ${neutre}`);
    }
  }
  // Le seul nom de l'outil n'est pas le domaine.
  for (const nom of ['RevisAudit (Gest On Line)', 'Ibiza', 'Formalis', 'le répertoire Sirene', 'Sandh', 'Survey']) {
    assert.equal(DOMAINE.test(nom), false, nom);
  }
});

test('témoins : le domaine se lit entier, sous-domaine compris, jamais au milieu d’un autre nom', () => {
  for (const vu of ['api.sirene.fr', 'https://www.ibiza.fr/', 'contact@formalis.io']) assert.equal(DOMAINE.test(vu), true, vu);
  for (const absent of ['monibiza.fr', 'notre-sirene.fr', 'ibiza.free.fr', 'xrevisaudit.fr', 'revisaudit.fr-ancien', 'sirene.frais']) {
    assert.equal(DOMAINE.test(absent), false, absent);
  }
  // Dans un JSON sans blanc, la chaîne voisine ne fait pas de la première une adresse qui mène au domaine.
  assert.equal(LIEN.test('["https://exemple.fr/a","revisaudit.fr"]'), false);
  assert.equal(DOMAINE.test('["https://exemple.fr/a","revisaudit.fr"]'), true);
});

test('témoins du balayage : un lien ajouté aux notes, un second lien dans un fichier listé, un lien retiré, une mention livrée', () => {
  const base = {
    'docs/a.md': `[x](${LIEN_LISTE})\n`,
    'docs/b.md': `la forme neutralisée ${neutralise('revisaudit.fr')} est permise\n`,
    'commercial/recette/sources.md': `- I1 https://www.ibizasoftware${'[.]'}fr/ [D]\n`,
    'editorial/article/manifest.json': '{"sources":["https://exemple.fr/a"]}\n',
  };
  // L'état de base : la liste fermée dit exactement ce que les notes portent.
  const propre = arbre(base, (racine) => controleNotes(racine, LISTE_TEMOIN));
  assert.deepEqual([propre.inattendus, propre.perimes], [[], []]);
  assert.equal(propre.trouvees.length, 1);

  // Un lien ajouté dans une note neuve : la liste grossit.
  const ajoute = arbre({ ...base, 'docs/c.md': '[ibiza](https://www.ibiza.fr/)\n' }, (racine) => controleNotes(racine, LISTE_TEMOIN));
  assert.deepEqual(decrire(ajoute.inattendus), ['docs/c.md:1 https://www.ibiza.fr']);

  // Le même lien dans `commercial/` ou dans `editorial/` : la liste grossit aussi (la garde ne s'arrête plus à `docs/`).
  for (const dossier of ['commercial', 'editorial']) {
    const ailleurs = dossier === 'commercial' ? { 'commercial/recette/sources.md': '- I1 https://www.ibizasoftware.fr/ [D]\n' } : { 'editorial/article/manifest.json': '{"url":"https://www.formalis.io/"}\n' };
    const vu = dossier === 'commercial' ? 'commercial/recette/sources.md:1 https://www.ibizasoftware.fr' : 'editorial/article/manifest.json:1 https://www.formalis.io';
    assert.deepEqual(decrire(arbre({ ...base, ...ailleurs }, (racine) => controleNotes(racine, LISTE_TEMOIN)).inattendus), [vu], dossier);
  }

  // Un lien de plus dans un fichier déjà listé : elle grossit aussi.
  const double = arbre({ ...base, 'docs/a.md': `[x](${LIEN_LISTE})\n[y](${LIEN_LISTE})\n` }, (racine) => controleNotes(racine, LISTE_TEMOIN));
  assert.equal(double.inattendus.length, 2);

  // Un lien neutralisé reste dans la liste : elle périme et le dit.
  const neutralisee = arbre({ ...base, 'docs/a.md': `[x](${neutralise('revisaudit.fr')})\n` }, (racine) => controleNotes(racine, LISTE_TEMOIN));
  assert.deepEqual(decrire(neutralisee.perimes), ['docs/a.md https://www.revisaudit.fr']);
  assert.deepEqual(neutralisee.inattendus, []);

  // Une mention, même sans lien, dans ce qui se livre.
  const livre = arbre({ 'src/x.ts': "export const note = 'sirene.fr';\n", 'config/y.json': `{"note":"${neutralise('sirene.fr')}"}\n` }, (racine) => controleLivre(racine, ['src', 'config']));
  assert.deepEqual(decrire(livre), ['src/x.ts:1 sirene.fr']);
});

test('témoin : une entrée que le balayage ne sait pas lire échoue au lieu d’être sautée', () => {
  arbre({ 'docs/a.md': 'rien\n' }, (racine) => {
    symlinkSync(join(racine, 'docs/a.md'), join(racine, 'docs/lien.md'));
    assert.throws(() => fichiers(racine, 'docs'), /ni fichier ni dossier/);
  });
});

test('ce qui se livre ne nomme aucun domaine proscrit : src, public, functions, scripts, config, db, workers, guides, et dist quand il est construit', (t) => {
  const dossiers = [...LIVRES, ...(existsSync(join(RACINE, BUILD)) ? [BUILD] : [])];
  const lus = dossiers.flatMap((dossier) => fichiers(RACINE, dossier));
  // La lecture voit bien ce qu'elle doit voir : un fichier de chaque dossier livré.
  for (const attendu of [
    'src/data/familles.ts', 'public/_headers', 'functions/contact.js', 'scripts/test-scripts.mjs', 'config/page-intent-contract.json',
    'db/contact/0001-messages.sql', 'workers/purge-contact/index.mjs', 'guides/recettes/lettrage-ebp/recette.json',
  ]) {
    assert.ok(lus.includes(attendu), `${attendu} n'est pas lu`);
  }
  t.diagnostic(`${lus.length} fichiers lus dans ${dossiers.join(', ')}${dossiers.includes(BUILD) ? '' : ` (${BUILD} absent : non construit, non lu)`}`);
  assert.deepEqual(decrire(controleLivre(RACINE, dossiers)), []);
});

test('les notes (docs, commercial, editorial) nomment les domaines proscrits pour mettre en garde, jamais sous une forme qui se clique, hors la liste fermée du 15/10/2026', (t) => {
  const parArbre = Object.fromEntries(NOTES.map((arbre) => [arbre, fichiers(RACINE, arbre)]));
  // La lecture voit bien ce qu'elle doit voir dans chaque arbre : les deux fichiers de la liste fermée (dont un JSON) et
  // une note neutralisée dans docs ; le relevé de sources qui portait un lien ibizasoftware dans commercial ; un manifeste
  // dans editorial.
  for (const { chemin } of LISTE_FERMEE) assert.ok(parArbre.docs.includes(chemin), `${chemin} n'est pas lu`);
  for (const attendu of [
    'docs/strategy/site-v3/hub-agents-ia/CONNECTEURS.md',
    'commercial/recettes/facture-electronique/preuves/etude-couverture/ec-production.md',
    'editorial/articles/automatiser-un-cabinet-comptable-la-carte-des-taches/manifest.json',
  ]) {
    assert.ok(Object.values(parArbre).some((lus) => lus.includes(attendu)), `${attendu} n'est pas lu`);
  }
  for (const arbre of NOTES) assert.ok(parArbre[arbre].length > 0, `${arbre} : aucun fichier lu`);
  const { trouvees, inattendus, perimes } = controleNotes(RACINE, LISTE_FERMEE);
  const total = Object.values(parArbre).reduce((somme, lus) => somme + lus.length, 0);
  t.diagnostic(`${total} fichiers lus (${NOTES.map((arbre) => `${arbre} ${parArbre[arbre].length}`).join(', ')}) ; ${trouvees.length} lien(s) cliquable(s), liste fermée de ${LISTE_FERMEE.length}`);
  t.diagnostic(`liste fermée relevée le ${LISTE_FERMEE[0].releve} : ${decrire(LISTE_FERMEE).join(' ; ')}`);
  assert.deepEqual(decrire(inattendus), [], 'un lien cliquable vers un domaine proscrit : l’écrire sous sa forme neutralisée, par exemple revisaudit[.]fr');
  assert.deepEqual(decrire(perimes), [], 'la liste fermée périme : retirer l’entrée dont le lien a été neutralisé');
});
