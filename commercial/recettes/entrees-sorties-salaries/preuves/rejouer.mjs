import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';

// Données fictives déjà structurées ; pas d’extraction ni de connexion métier.
export function preparer(input) {
  if (input.dejaTraitePortail) return { etat: 'circuit-existant-conserve', propositions: [] };
  if (input.canal === 'telephone' && !input.compteRendu) return { etat: 'arret-source-absente', propositions: [] };
  if (!input.couvert || !['entree', 'sortie'].includes(input.evenement)) return { etat: 'arret-cas-hors-regle', propositions: [] };
  if (!input.dates.length || new Set(input.dates).size !== 1) return { etat: 'arret-conflit-dates', propositions: [] };
  const manquantes = input.attendues.filter((champ) => !Object.hasOwn(input.champs, champ));
  if (manquantes.length) return { etat: 'liste-manques-finalisation-bloquee', manquantes, propositions: [] };
  const champs = { ...input.champs, dateEvenement: input.dates[0] };
  const types = input.evenement === 'entree' ? ['champs-dpae', 'champs-fiche-salarie'] : ['synthese-sortie'];
  return {
    etat: 'preparation-a-valider',
    propositions: types.map((type) => ({ type, champs: { ...champs }, source: input.source, validation: 'gestionnaire-requise' })),
    transmis: false,
    salarieCree: false,
  };
}
const entree = { evenement: 'entree', canal: 'email', source: 'message-fictif-A', couvert: true, dejaTraitePortail: false, dates: ['2026-11-02'], attendues: ['champ-A', 'champ-B'], champs: { 'champ-A': 'valeur-fictive-A', 'champ-B': 'valeur-fictive-B' } };
const sortie = { ...entree, evenement: 'sortie', canal: 'telephone', compteRendu: true, source: 'compte-rendu-fictif-B' };
const proposition = (type, source) => ({ type, champs: { ...entree.champs, dateEvenement: '2026-11-02' }, source, validation: 'gestionnaire-requise' });
const fixtures = [
  { id: 'ES-ENTREE-01', kind: 'courant', input: entree, expected: { etat: 'preparation-a-valider', propositions: [proposition('champs-dpae', entree.source), proposition('champs-fiche-salarie', entree.source)], transmis: false, salarieCree: false }, decision: 'controle-et-validation-gestionnaire' },
  { id: 'ES-SORTIE-02', kind: 'courant', input: sortie, expected: { etat: 'preparation-a-valider', propositions: [proposition('synthese-sortie', sortie.source)], transmis: false, salarieCree: false }, decision: 'traitement-social-humain' },
  { id: 'ES-MANQUE-03', kind: 'limite', input: { ...entree, champs: { 'champ-A': 'valeur-fictive-A' } }, expected: { etat: 'liste-manques-finalisation-bloquee', manquantes: ['champ-B'], propositions: [] }, decision: 'validation-questions-client' },
  { id: 'ES-CONFLIT-04', kind: 'refus', input: { ...entree, dates: ['2026-11-02', '2026-11-03'] }, expected: { etat: 'arret-conflit-dates', propositions: [] }, decision: 'choix-version-gestionnaire' },
  { id: 'ES-HORS-05', kind: 'refus', input: { ...sortie, couvert: false }, expected: { etat: 'arret-cas-hors-regle', propositions: [] }, decision: 'examen-pole-social' },
  { id: 'ES-PORTAIL-06', kind: 'refus', input: { ...entree, dejaTraitePortail: true }, expected: { etat: 'circuit-existant-conserve', propositions: [] }, decision: 'poursuite-dans-outil-existant' },
  { id: 'ES-APPEL-07', kind: 'refus', input: { ...sortie, compteRendu: false }, expected: { etat: 'arret-source-absente', propositions: [] }, decision: 'consigner-appel' },
];
const cases = fixtures.map((test) => {
  const original = JSON.stringify(test.input);
  const observed = preparer(test.input);
  assert.deepEqual(observed, test.expected);
  assert.equal(JSON.stringify(test.input), original);
  if (test.input.evenement === 'sortie') assert.ok(!observed.propositions.some((p) => p.type === 'champs-dpae'));
  return { ...test, observed, pass: true };
});
const replayedAt = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const proof = { version: 1, status: 'PASS', fictitious: true, replayedAt, rule: 'Préparer uniquement les annonces hors circuit existant : champs fictifs à valider pour une entrée, synthèse pour une sortie ; aucun doublon du portail.', limits: 'Essai sur états déclarés et champs fictifs ; aucune liste réglementaire, extraction, détection de doublon réelle, écoute téléphonique, connexion, création ou transmission.', cases };
writeFileSync(new URL('./rejeu.json', import.meta.url), `${JSON.stringify(proof, null, 2)}\n`);
console.log(`PASS : ${cases.length} cas fictifs, résultats attendus vérifiés, entrées inchangées ; aucune DPAE de sortie.`);
