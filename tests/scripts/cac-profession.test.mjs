import test from 'node:test';
import assert from 'node:assert/strict';
import { PROFESSIONS, PROFESSION_PAR_DEFAUT, estProfession, FAMILLES, famillesDeLaProfession, famillesDuPole, familleParId } from '../../src/data/familles.ts';

test('taxonomie : profession EC par défaut et contrôle fermé des valeurs', () => {
  assert.deepEqual(PROFESSIONS, ['ec', 'cac']);
  assert.equal(PROFESSION_PAR_DEFAUT, 'ec');
  for (const value of ['ec', 'cac']) assert.equal(estProfession(value), true);
  for (const value of [undefined, null, '', 'CAC', 'audit', 1, {}]) assert.equal(estProfession(value), false);
  assert.deepEqual(famillesDeLaProfession(), famillesDeLaProfession('ec'));
  assert.equal(familleParId('collecte-pieces').profession, 'ec');
  assert.equal(familleParId('audit-legal').active, false);
});

test('taxonomie : 25 gestes CAC du support et huit familles ouvertes seulement', () => {
  const cac = famillesDeLaProfession('cac');
  assert.equal(cac.length, 25);
  assert.equal(cac.filter((f) => f.active).length, 8);
  assert.deepEqual([...new Set(cac.map((f) => f.pole))].sort(), ['administration', 'certification', 'durabilite', 'interventions-legales', 'sacc']);
  assert.ok(famillesDuPole('durabilite').every((f) => !f.active));
  assert.equal(FAMILLES.length, new Set(FAMILLES.map((f) => f.id)).size);
  assert.ok(cac.every((f) => f.id.startsWith('cac-')));
});
