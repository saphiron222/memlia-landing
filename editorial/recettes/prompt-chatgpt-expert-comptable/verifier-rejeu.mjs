import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preparerDemande } from './rejouer-cas.mjs';

const journal = JSON.parse(readFileSync(new URL('./journal-rejeu.json', import.meta.url), 'utf8'));
assert.deepEqual(journal.cas.map(({ nom, entree, sortie }) => {
  assert.deepEqual(preparerDemande(entree), sortie, `${nom} : sortie journale différente`);
  assert.equal(sortie.envoi, false);
  return nom;
}), ['nominal', 'piece_absente', 'demande_deja_partie']);
assert.equal(journal.cas[0].sortie.destinataire, 'à confirmer');
assert.equal(journal.cas[1].sortie.message, null);
assert.equal(journal.cas[2].sortie.motif, 'demande déjà partie');
console.log('Trois cas fictifs rejoués et comparés aux entrées/sorties journalisées ; zéro envoi, aucun modèle interrogé.');
