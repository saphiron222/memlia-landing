import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { classerPiece } from './rejouer-cas.mjs';

const journal = JSON.parse(readFileSync(new URL('./journal-rejeu.json', import.meta.url), 'utf8'));
const oracle = [
  { nom: 'normal', statut: 'proposition_a_valider', motif: 'contrôles humains requis' },
  { nom: 'doublon', statut: 'exception', motif: 'doublon probable' },
  { nom: 'periode_ambigue', statut: 'exception', motif: 'période ambiguë' },
  { nom: 'contexte_absent', statut: 'arret', motif: 'donnée absente' },
];
assert.equal(journal.cas.length, oracle.length);
for (const [index, attendu] of oracle.entries()) {
  const { nom, entree, sortie } = journal.cas[index];
  assert.equal(nom, attendu.nom);
  assert.deepEqual(sortie, classerPiece(entree), `${nom} : sortie journale différente de la règle`);
  assert.equal(sortie.statut, attendu.statut);
  assert.equal(sortie.motif, attendu.motif);
  assert.equal(sortie.ecriture, 'aucune');
}
assert.equal(journal.cas[0].entree.periode, 'avril');
assert.equal(journal.cas[1].entree.empreintesConnues.includes(journal.cas[1].entree.empreinte), true);
assert.notEqual(journal.cas[2].entree.periode, journal.cas[2].entree.periodeAttendue);
assert.equal(journal.cas[3].entree.empreinte, '');
console.log('Quatre cas fictifs : entrées, sorties et oracle vérifiés ; aucune écriture ni éditeur interrogé.');
