#!/usr/bin/env node
// Oracle indépendant du calcul du démonstrateur : seuils explicites de la recette relue.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const dossier = new URL('./', import.meta.url);
const chemin = (nom) => new URL(nom, dossier);
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const sortie = process.argv[2] ? new URL(process.argv[2], `file://${process.cwd()}/`) : chemin('journal-rejeu.json');
const journal = JSON.parse(readFileSync(sortie, 'utf8'));
const fixtureBytes = readFileSync(chemin('cas-executes.json'));
const fixture = JSON.parse(fixtureBytes);

assert.equal(journal.nature, 'reconstitution_fictive_non_historique');
assert.equal(journal.fixtureSha256, sha256(fixtureBytes), 'fixture changée depuis exécution');
assert.equal(journal.scriptSha256, sha256(readFileSync(chemin('rejouer-cas.mjs'))), 'script changé depuis exécution');
// Kevin a relu et validé sous son nom ces octets exacts le 29/09 (commentaire kanban 3997).
// Toute modification du corps nécessite un nouvel accord, sans transférer cette signature.
assert.equal(sha256(readFileSync(chemin('corps.md'))), '76ffb89670b44fa9acecc86b709546f3044b10e8bf3e9288a1b0e9e0fa5e5e3b', 'corps différent du témoignage validé');
assert.equal(fixture.troisPasses.statut, journal.nature);

const oracle = {
  chaine: { attendu: 55, totalReferenceDecalee: 50, statut: 'divergence' },
  ecran: { totalAfficheSansFiltre: 20, totalExerciceChoisi: 12 },
  suites: { borneZ: 26, borneAB: 28, lecteurMonoLettreAB: 1 },
};
// Deux lectures distinctes : oracle fixe et résultats déjà déclarés dans cas-executes.json.
assert.deepEqual(journal.sorties, oracle, 'sortie exécutée différente de l’oracle indépendant');
for (const cle of ['chaine', 'ecran', 'suites']) {
  assert.deepEqual(fixture.troisPasses[cle], oracle[cle], `cas-executes.json : ${cle} divergent`);
}
assert.ok(journal.sorties.chaine.attendu !== journal.sorties.chaine.totalReferenceDecalee);
assert.ok(journal.sorties.ecran.totalAfficheSansFiltre !== journal.sorties.ecran.totalExerciceChoisi);
assert.ok(journal.sorties.suites.borneAB !== journal.sorties.suites.lecteurMonoLettreAB);
console.log(`PASS : trois cas fictifs exécutés, oracle distinct et fixture concordants ; corps signé sur SHA exact 76ffb89670b44fa9acecc86b709546f3044b10e8bf3e9288a1b0e9e0fa5e5e3b ; journal ${fileURLToPath(sortie)}`);
