import test from 'node:test';
import assert from 'node:assert/strict';
import { creerNavigation, LIEN_CAC } from '../../src/data/navigation.mjs';
import { AUTOMATISE } from '../navigation-attendue.mjs';

const aplatir = (navigation) => navigation.flatMap((e) => e.sousEntrees ?? [e]);
const groupe = (navigation, id) => navigation.find((e) => e.id === id);

test('les hubs restent accessibles sans route CAC ni menu de lecture locale', () => {
  const links = aplatir(creerNavigation({ chemin: '/', cacDisponible: false, blogActif: true }));
  assert.deepEqual(links.map((e) => e.href), [
    '/automatisation-cabinet-comptable',
    '/agents-ia',
    '/integrations',
    '/outils-comptables-gratuits',
    '/blog',
  ]);
  assert.ok(!links.some((e) => e.href === LIEN_CAC.href));
});

test('la publication CAC active son entrée sans ajouter un menu de lecture', () => {
  const links = aplatir(creerNavigation({ chemin: LIEN_CAC.href, cacDisponible: true, blogActif: true }));
  assert.ok(links.every((e) => !e.href.includes('#')));
  assert.ok(links.some((e) => e.href === LIEN_CAC.href && e.libelle === 'Commissaires aux comptes'));
});

test('une page interne conserve les hubs et le blog suit sa disponibilité', () => {
  const navigation = creerNavigation({ chemin: '/methode', cacDisponible: true, blogActif: false });
  assert.equal(aplatir(navigation)[0].href, '/');
  assert.ok(!navigation.some((e) => e.id === 'lecture'));
  assert.ok(!aplatir(navigation).some((e) => e.href === '/blog'));
  const ids = navigation.filter((e) => e.sousEntrees).map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('« Ce qu’on automatise » expose les trois catalogues : Robots, Agents IA et Intégrations', () => {
  for (const cacDisponible of [true, false]) {
    const entree = groupe(creerNavigation({ chemin: '/', cacDisponible, blogActif: true }), 'automatise');
    assert.ok(entree, `groupe automatise présent (cacDisponible ${cacDisponible})`);
    assert.equal(entree.libelle, 'Ce qu’on automatise');
    assert.equal(entree.href, undefined, 'un groupe est un bouton : il ne mène nulle part lui-même');
    assert.deepEqual(entree.sousEntrees, AUTOMATISE);
  }
});

test('l’ordre de la barre : Cabinets, Ce qu’on automatise, Outils gratuits, Blog', () => {
  const navigation = creerNavigation({ chemin: '/', cacDisponible: true, blogActif: true });
  assert.deepEqual(
    navigation.map((e) => e.id ?? e.href),
    ['cabinets', 'automatise', '/outils-comptables-gratuits', '/blog'],
  );
  const sansCac = creerNavigation({ chemin: '/', cacDisponible: false, blogActif: true });
  assert.deepEqual(
    sansCac.map((e) => e.id ?? e.href),
    ['automatise', '/outils-comptables-gratuits', '/blog'],
  );
});

test('aucun lien direct ne dépasse son groupe : chaque destination n’apparaît qu’une fois', () => {
  const hrefs = aplatir(creerNavigation({ chemin: '/', cacDisponible: true, blogActif: true })).map((e) => e.href);
  assert.equal(new Set(hrefs).size, hrefs.length, hrefs.join(' '));
});

test('les intitulés suivent la charte : casse de phrase, sigle IA et aucun ancien intitulé', () => {
  const navigation = creerNavigation({ chemin: '/', cacDisponible: true, blogActif: true });
  const intitules = [...navigation.map((e) => e.libelle), ...aplatir(navigation).map((e) => e.libelle)];
  for (const intitule of intitules) {
    assert.match(intitule.replace(/\bIA\b/gu, 'ia'), /^\p{Lu}[^\p{Lu}]*$/u, `${intitule} : casse de phrase, sigle IA admis`);
    assert.doesNotMatch(intitule, /module|compl[ée]ment excel/i, intitule);
    assert.doesNotMatch(intitule, /Par tâche|Par métier|Dans vos outils|Guides par environnement|Automatisation par pôle/iu);
  }
});
