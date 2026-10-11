import test from 'node:test';
import assert from 'node:assert/strict';
import { creerNavigation, LIEN_CAC } from '../../src/data/navigation.mjs';

const aplatir = (navigation) => navigation.flatMap((e) => e.sousEntrees ?? [e]);

test('les hubs et la lecture de la page restent accessibles sans route CAC', () => {
  const links = aplatir(creerNavigation({ chemin: '/', cacDisponible: false, blogActif: true }));
  assert.deepEqual(links.map((e) => e.href), ['/#usages', '/#methode', '/#preuves', '/#questions', '/automatisation-cabinet-comptable', '/outils-comptables-gratuits', '/blog']);
  assert.ok(!links.some((e) => e.href === LIEN_CAC.href));
});

test('la publication CAC active son entrée et ses ancres propres', () => {
  const links = aplatir(creerNavigation({ chemin: LIEN_CAC.href, cacDisponible: true, blogActif: true }));
  assert.deepEqual(links.slice(0, 4).map((e) => e.href), ['usages', 'methode', 'preuves', 'questions'].map((id) => `${LIEN_CAC.href}#${id}`));
  assert.ok(links.some((e) => e.href === LIEN_CAC.href && e.libelle === 'Commissaires aux comptes'));
});

test('une page interne conserve la lecture de l’accueil et le blog suit sa disponibilité', () => {
  const navigation = creerNavigation({ chemin: '/methode', cacDisponible: true, blogActif: false });
  assert.equal(aplatir(navigation)[0].href, '/#usages');
  assert.ok(!aplatir(navigation).some((e) => e.href === '/blog'));
  const ids = navigation.filter((e) => e.sousEntrees).map((e) => e.id);
  assert.equal(new Set(ids).size, ids.length);
});
