import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';

// Règle fictive locale : aucun accès éditeur et aucune transmission.
function preparer(d) {
  const stop = (reason, state = 'ARRET') => ({ state, reason, externalWrite: false });
  if (d.covered) return stop('déjà pris en charge', 'EXCLU');
  if (d.actionPlanned) return stop('action déjà prévue', 'EXCLU');
  if (!d.platformConfirmed) return stop('plateforme à confirmer');
  if (d.identities !== 1) return stop('dossier ambigu');
  if (d.contradiction) return stop('information contradictoire');
  if (!d.contactAuthorized) return stop('contact à valider');
  if (d.platform === 'plateforme-cabinet') return stop('circuit du cabinet', 'EXCLU');
  if (!['préparation inachevée', 'réponse attendue'].includes(d.need)) return stop('besoin à clarifier');
  return {
    state: 'PROPOSITION', dossier: d.dossier,
    priority: d.need === 'préparation inachevée' ? 1 : 2,
    reason: d.need, origin: d.origin,
    draft: `Bonjour, pour votre dossier ${d.dossier}, pouvez-vous confirmer ${d.missing} ? Merci.`,
    externalWrite: false,
  };
}
const normal = {
  dossier: 'D-041', platform: 'plateforme-client-A', platformConfirmed: true,
  covered: false, actionPlanned: false, identities: 1, contradiction: false,
  contactAuthorized: true, need: 'préparation inachevée',
  missing: 'le point de préparation restant', origin: 'échange fictif confirmé',
  cabinetNote: 'Appeler avant tout envoi ; conserver cette note',
};
const proposed = (input, priority) => ({
  state: 'PROPOSITION', dossier: input.dossier, priority, reason: input.need,
  origin: input.origin,
  draft: `Bonjour, pour votre dossier ${input.dossier}, pouvez-vous confirmer ${input.missing} ? Merci.`,
  externalWrite: false,
});
const stopped = (reason, state = 'ARRET') => ({ state, reason, externalWrite: false });
const followup = { ...normal, dossier: 'D-042', need: 'réponse attendue', missing: 'le retour attendu sur votre préparation' };
const fixtures = [
  ['FE-01', normal, proposed(normal, 1)],
  ['FE-02', followup, proposed(followup, 2)],
  ['FE-03', { ...normal, covered: true }, stopped('déjà pris en charge', 'EXCLU')],
  ['FE-04', { ...normal, platformConfirmed: false }, stopped('plateforme à confirmer')],
  ['FE-05', { ...normal, identities: 2 }, stopped('dossier ambigu')],
  ['FE-06', { ...normal, contradiction: true }, stopped('information contradictoire')],
  ['FE-07', { ...normal, contactAuthorized: false }, stopped('contact à valider')],
  ['FE-08', { ...normal, actionPlanned: true }, stopped('action déjà prévue', 'EXCLU')],
];
const cases = fixtures.map(([id, input, expected]) => {
  const before = structuredClone(input);
  const output = preparer(input);
  assert.deepEqual(output, expected);
  assert.deepEqual(input, before);
  return { id, input, expected, output, status: 'PASS', humanDecisionPreserved: true };
});
const result = {
  status: 'PASS', fictitious: true, replayedAt: '2026-10-06', executedAt: new Date().toISOString(),
  scope: 'Préparation des appels et relances hors circuit couvert, sur données confirmées fictives ; aucun envoi ni inscription.',
  command: 'node commercial/recettes/facture-electronique/preuves/rejouer.mjs', cases,
  invariants: { humanDecisionPreserved: true, noExternalWrites: true, coverageExclusion: true },
};
writeFileSync(new URL('./rejeu.json', import.meta.url), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ status: result.status, cases: cases.length, invariants: result.invariants }, null, 2));
