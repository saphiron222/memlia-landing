import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
const baseline = { dossier: 'DOSSIER-FICTIF', exercice: '2025', identityConfirmed: true, coverageChecked: true, covered: false, date: '2026-10-20', dateConfirmed: true, reference: 'Échéance validée par le cabinet, fixture', contradictory: false, approvalPending: false, depositAnnounced: false, receiptConfirmed: false, reminderPlanned: false, contactAuthorized: true, cabinetNote: 'Note humaine à conserver' };
function prepare(input) {
  if (!input.identityConfirmed) return { status: 'arret-identite' };
  if (input.covered) return { status: 'exclu-circuit-couvert' };
  if (!input.coverageChecked) return { status: 'arret-couverture-inconnue' };
  if (!input.dateConfirmed || !input.date || !input.reference) return { status: 'arret-date-non-confirmee' };
  if (input.contradictory) return { status: 'arret-contradiction' };
  if (input.depositAnnounced && !input.receiptConfirmed) return { status: 'depot-a-verifier' };
  if (input.receiptConfirmed) return { status: 'aucun-rappel-justificatif-confirme' };
  if (input.reminderPlanned) return { status: 'aucun-second-rappel' };
  const line = { dossier: input.dossier, exercice: input.exercice, date: input.date, reference: input.reference };
  if (input.approvalPending) return { status: 'approbation-a-suivre', line };
  if (!input.contactAuthorized) return { status: 'arret-contact-non-autorise' };
  return { status: 'rappel-depot-a-valider', line, draft: `Pour le dossier ${input.dossier}, exercice ${input.exercice}, l’échéance de dépôt confirmée est le ${input.date}. Merci de nous transmettre le justificatif de dépôt ou de nous indiquer ce qui reste à faire.` };
}
const specifications = [
  ['APPROBATION', { approvalPending: true }, 'approbation-a-suivre'],
  ['DEPOT', {}, 'rappel-depot-a-valider'],
  ['COUVERT', { covered: true }, 'exclu-circuit-couvert'],
  ['COUVERTURE', { coverageChecked: false }, 'arret-couverture-inconnue'],
  ['DATE', { date: null, dateConfirmed: false }, 'arret-date-non-confirmee'],
  ['CONTRADICTION', { contradictory: true }, 'arret-contradiction'],
  ['ANNONCE', { depositAnnounced: true }, 'depot-a-verifier'],
  ['JUSTIFICATIF', { receiptConfirmed: true }, 'aucun-rappel-justificatif-confirme'],
  ['RAPPEL', { reminderPlanned: true }, 'aucun-second-rappel'],
  ['CONTACT', { contactAuthorized: false }, 'arret-contact-non-autorise'],
];
const cases = specifications.map(([id, changes, expected]) => {
  const input = { ...baseline, ...changes };
  const before = structuredClone(input);
  const observed = prepare(input);
  assert.deepEqual(input, before);
  assert.equal(observed.status, expected);
  if (id === 'DEPOT') { assert.ok(observed.draft.includes(input.date)); assert.ok(observed.draft.includes('justificatif')); }
  if (!['APPROBATION', 'DEPOT'].includes(id)) assert.equal(observed.draft, undefined);
  return { id: `SJ-${id}`, input, expected, observed, inputUnchanged: true, pass: true };
});
const proof = { version: 1, status: 'PASS', fictitious: true, replayedAt: '2026-10-06', rule: 'Échéances confirmées et rappels hors circuit couvert uniquement ; aucun calcul de délai légal, document juridique, envoi ou dépôt.', runner: 'preuves/rejouer.mjs', cases };
writeFileSync(new URL('./rejeu.json', import.meta.url), JSON.stringify(proof, null, 2) + '\n');
console.log(JSON.stringify({ status: proof.status, cases: cases.length, inputUnchanged: true }));
