#!/usr/bin/env node
// Reconstitution éditoriale fictive : aucun appel au produit historique ni donnée client.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dossier = new URL('./', import.meta.url);
const fixture = new URL('cas-executes.json', dossier);
const script = fileURLToPath(import.meta.url);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

export function rejouer() {
  // Les entrées, et non les résultats déclarés par la fixture, alimentent le calcul.
  const couts = [{ poste: 'personnel', montant: 40 }, { poste: 'logiciel', montant: 10 }, { poste: 'autres', montant: 5 }];
  const referencesDecalees = ['personnel', 'logiciel'];
  const attendu = couts.reduce((total, ligne) => total + ligne.montant, 0);
  const totalReferenceDecalee = couts.filter((ligne) => referencesDecalees.includes(ligne.poste))
    .reduce((total, ligne) => total + ligne.montant, 0);
  const lignes = [{ exercice: 'N', montant: 12 }, { exercice: 'N-1', montant: 8 }];
  const totalAfficheSansFiltre = lignes.reduce((total, ligne) => total + ligne.montant, 0);
  const totalExerciceChoisi = lignes.filter((ligne) => ligne.exercice === 'N')
    .reduce((total, ligne) => total + ligne.montant, 0);
  const numeroColonne = (adresse) => [...adresse].reduce((n, lettre) => n * 26 + lettre.charCodeAt(0) - 64, 0);
  const lecteurMonoLettre = (adresse) => adresse.charCodeAt(0) - 64;
  return {
    chaine: { attendu, totalReferenceDecalee, statut: attendu === totalReferenceDecalee ? 'accord' : 'divergence' },
    ecran: { totalAfficheSansFiltre, totalExerciceChoisi },
    suites: { borneZ: numeroColonne('Z'), borneAB: numeroColonne('AB'), lecteurMonoLettreAB: lecteurMonoLettre('AB') },
  };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const sortie = process.argv[2] ? new URL(process.argv[2], `file://${process.cwd()}/`) : new URL('journal-rejeu.json', dossier);
  const bytes = readFileSync(fixture);
  const attendus = JSON.parse(bytes).troisPasses;
  if (attendus?.statut !== 'reconstitution_fictive_non_historique') throw new Error('Statut fictif attendu manquant');
  const journal = {
    nature: 'reconstitution_fictive_non_historique',
    protocole: 'exécution locale déterministe, sans modèle ni produit historique',
    fixtureSha256: sha256(bytes),
    scriptSha256: sha256(readFileSync(script)),
    sorties: rejouer(),
  };
  writeFileSync(sortie, `${JSON.stringify(journal, null, 2)}\n`);
  console.log(`Journal écrit : ${fileURLToPath(sortie)}`);
}
