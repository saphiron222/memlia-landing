import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';

// Jeu fictif : aucune donnée client ni écriture de régularisation.
const cle = (ligne) => [ligne.compte, ligne.sens, ligne.montantCentimes, ligne.devise, ligne.reference].join('|');

function rapprocher({ releve, journal, soldeOuvertureReleve, soldeOuvertureJournal }) {
  if (!Number.isInteger(soldeOuvertureReleve) || !Number.isInteger(soldeOuvertureJournal)) {
    return { statut: 'REFUS_ENTREE', motif: 'solde d’ouverture du relevé manquant', paires: [] };
  }
  const candidats = journal.filter((ligne) => ligne.reference && ligne.reference === releve.reference && cle(ligne) === cle(releve));
  if (candidats.length > 1) {
    return { statut: 'REFUS_AMBIGUITE', motif: `${candidats.length} candidats pour ${releve.id}`, paires: [] };
  }
  if (candidats.length === 1) {
    return { statut: 'PROPOSITION_UNIQUE', paires: [{ releve: releve.id, journal: candidats[0].id, reference: releve.reference, montantCentimes: releve.montantCentimes }] };
  }
  return { statut: 'ECART_OUVERT', motif: journal.length ? `${journal[0].id} : transit possible non confirmé` : `${releve.id} : écriture ou pièce à rechercher`, paires: [] };
}

const base = { compte: '512-TEST', sens: 'credit', devise: 'EUR' };
const essais = [
  {
    id: 'RB-01',
    entree: { soldeOuvertureReleve: 0, soldeOuvertureJournal: 0, releve: { ...base, id: 'R-01', reference: 'V-041', montantCentimes: 12500 }, journal: [{ ...base, id: 'J-01', reference: 'V-041', montantCentimes: 12500 }] },
    attendu: { statut: 'PROPOSITION_UNIQUE', paires: [{ releve: 'R-01', journal: 'J-01', reference: 'V-041', montantCentimes: 12500 }] },
  },
  {
    id: 'RB-02',
    entree: { soldeOuvertureReleve: 0, soldeOuvertureJournal: 0, releve: { ...base, id: 'R-02', reference: 'V-999', montantCentimes: 0 }, journal: [{ ...base, id: 'J-02', reference: 'V-042', montantCentimes: 8000 }] },
    attendu: { statut: 'ECART_OUVERT', motif: 'J-02 : transit possible non confirmé', paires: [] },
  },
  {
    id: 'RB-03',
    entree: { soldeOuvertureReleve: 0, soldeOuvertureJournal: 0, releve: { ...base, id: 'R-03', reference: 'V-043', montantCentimes: 5000 }, journal: [{ ...base, id: 'J-03', reference: 'V-043', montantCentimes: 5000 }, { ...base, id: 'J-04', reference: 'V-043', montantCentimes: 5000 }] },
    attendu: { statut: 'REFUS_AMBIGUITE', motif: '2 candidats pour R-03', paires: [] },
  },
  {
    id: 'RB-04',
    entree: { soldeOuvertureReleve: null, soldeOuvertureJournal: 0, releve: { ...base, id: 'R-04', reference: 'V-044', montantCentimes: 1000 }, journal: [] },
    attendu: { statut: 'REFUS_ENTREE', motif: 'solde d’ouverture du relevé manquant', paires: [] },
  },
];

const sorties = essais.map(({ id, entree, attendu }) => {
  const obtenu = rapprocher(entree);
  assert.deepEqual(obtenu, attendu, `${id} diverge`);
  return { id, obtenu };
});
writeFileSync(new URL('./rejeu.json', import.meta.url), JSON.stringify({ jeu: 'fictif', cas: sorties }, null, 2) + '\n');
console.log(`Rejeu validé : ${sorties.length} cas fictifs, aucune paire forcée sur les refus.`);
