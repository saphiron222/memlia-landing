import test from 'node:test';
import assert from 'node:assert/strict';
import { creerNavigation, LIEN_CAC } from '../../src/data/navigation.mjs';

const aplatir = (navigation) => navigation.flatMap((e) => e.sousEntrees ?? [e]);

test('les hubs restent accessibles sans route CAC ni menu de lecture locale', () => {
  const links = aplatir(creerNavigation({ chemin: '/', cacDisponible: false, blogActif: true }));
  assert.deepEqual(links.map((e) => e.href), ['/automatisation-cabinet-comptable', '/outils-comptables-gratuits', '/blog']);
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
