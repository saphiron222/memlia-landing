#!/usr/bin/env node
// Oracle limité à quatre cas fictifs ; aucune écriture comptable n'est générée.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dossier = dirname(fileURLToPath(import.meta.url));
const jeu = JSON.parse(readFileSync(join(dossier, 'jeu-fictif.json'), 'utf8'));
const attendus = JSON.parse(readFileSync(join(dossier, 'rejeu.json'), 'utf8'));
const dansPeriode = date => date >= jeu.periode[0] && date <= jeu.periode[1];
const signe = (source, sens) => (source === 'releve' ? sens === 'credit' : sens === 'debit') ? 1 : -1;
const cle = (ligne, source) => [ligne.compte, ligne.devise, signe(source, ligne.sens), ligne.montantCentimes, ligne.reference].join('|');
function jouer(cas) {
  for (const source of ['releve', 'journal']) {
    const donnees = cas[source];
    if (!Number.isInteger(donnees.ouverture)) return { statut: 'REFUS_ENTREE', motif: `solde d’ouverture du ${source === 'releve' ? 'relevé' : 'journal'} manquant`, paires: [] };
    if (!Number.isInteger(donnees.cloture) || donnees.lignes.some(l => !dansPeriode(l.date))) return { statut: 'REFUS_ENTREE', motif: `clôture ou date du ${source} invalide`, paires: [] };
    const calcule = donnees.ouverture + donnees.lignes.reduce((total, ligne) => total + signe(source, ligne.sens) * ligne.montantCentimes, 0);
    if (calcule !== donnees.cloture) return { statut: 'REFUS_ENTREE', motif: `solde de clôture du ${source} incohérent`, paires: [] };
  }
  const bancaires = cas.releve.lignes;
  const comptables = cas.journal.lignes;
  for (const releve of bancaires) {
    if (!releve.reference) continue;
    const candidats = comptables.filter(l => cle(l, 'journal') === cle(releve, 'releve'));
    if (candidats.length > 1) return { statut: 'REFUS_AMBIGUITE', motif: `${candidats.length} candidats pour ${releve.id}`, paires: [] };
  }
  const paires = bancaires.flatMap(releve => {
    if (!releve.reference) return [];
    const candidats = comptables.filter(l => cle(l, 'journal') === cle(releve, 'releve'));
    const concurrents = bancaires.filter(l => cle(l, 'releve') === cle(releve, 'releve'));
    return candidats.length === 1 && concurrents.length === 1
      ? [{ releve: releve.id, journal: candidats[0].id, reference: releve.reference, montantCentimes: releve.montantCentimes }] : [];
  });
  if (paires.length) return { statut: 'PROPOSITION_UNIQUE', paires };
  const sansReleve = comptables.find(l => !bancaires.some(r => cle(r, 'releve') === cle(l, 'journal')));
  if (sansReleve) return { statut: 'ECART_OUVERT', motif: `${sansReleve.id} : transit possible non confirmé`, paires: [] };
  return { statut: 'ECART_OUVERT', motif: 'lignes non appariées à examiner', paires: [] };
}
const resultats = jeu.cas.map(cas => ({ id: cas.id, obtenu: jouer(cas) }));
assert.deepEqual(resultats, attendus.cas);
if (process.argv.includes('--write-proof')) {
  writeFileSync(join(dossier, 'preuve-rejeu.json'), `${JSON.stringify({ jeu: 'fictif', periode: jeu.periode, resultats }, null, 2)}\n`);
}
console.log(`PASS : ${resultats.length} cas fictifs, entrées → oracle → résultats attendus concordants`);
