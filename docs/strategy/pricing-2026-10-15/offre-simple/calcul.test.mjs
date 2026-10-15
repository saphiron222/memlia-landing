import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {offre, devis, qualifierLot, economie} from './calcul.mjs';
const compta = ['comptabilite'];
test('un seul socle, nombre de pôles, tous les métiers actuels couverts', () => {
  const catalogue = JSON.parse(fs.readFileSync(new URL('../mammouth/COUVERTURE-TRAVAUX.json', import.meta.url)));
  assert.deepEqual([...offre.poles].sort(), catalogue.agents.map(a => a.id).sort());
  for (let n = 1; n <= offre.poles.length; n++) {
    const q = devis({poles: offre.poles.slice(0, n), usageCents: 0});
    assert.equal(q.invoiceCents, 100000 + n * 30000);
    assert.equal(q.includedCents, n * 20000);
  }
});
test('inclus non ajouté à la facture, dépassement exact au centime', () => {
  assert.equal(devis({poles: compta, usageCents: 20000}).invoiceCents, 130000);
  const extra = usageCents => devis({poles: compta, usageCents, authorizedOverageCents: 20000});
  assert.equal(extra(20001).invoiceCents, 130001);
  assert.equal(extra(28000).invoiceCents, 138000);
  assert.equal(extra(40000).invoiceCents, 150000);
  assert.equal(extra(40001).permitted, false);
  assert.equal(extra(40001).invoiceCents, null);
  assert.equal(devis({poles: compta, usageCents: 20001}).permitted, false);
});
test('enveloppe mutualisée entre pôles, sans facturation de chaque agent', () => {
  const q = devis({poles: ['comptabilite', 'paie-social'], usageCents: 48000, authorizedOverageCents: 8000});
  assert.equal(q.invoiceCents, 168000);
  assert.equal(q.includedCents, 40000);
});
test('pas de facturation sur une entrée absente, inconnue ou invalide', () => {
  for (const poles of [[], ['inconnu'], ['comptabilite', 'comptabilite'], null]) assert.throws(() => devis({poles, usageCents: 0}), RangeError);
  for (const usageCents of [undefined, null, '', NaN, -1, .5, Infinity, Number.MAX_SAFE_INTEGER]) assert.throws(() => devis({poles: compta, usageCents}), RangeError);
  assert.throws(() => devis({poles: compta, usageCents: 0, authorizedOverageCents: -1}), RangeError);
});
test('porte économique : tous les coûts variables, humain compris, borne avant lancement', () => {
  const accepted = {serviceCeilingCents: 10000, apiCostCents: 100, executionCostCents: 400, operationalHumanCostCents: 2000};
  assert.equal(qualifierLot(accepted).economicGate, true);
  assert.equal(qualifierLot({...accepted, operationalHumanCostCents: 2001}).economicGate, false);
  assert.equal(qualifierLot({...accepted, serviceCeilingCents: 10004, operationalHumanCostCents: 2001}).economicGate, true);
  assert.throws(() => qualifierLot({...accepted, operationalHumanCostCents: undefined}), RangeError);
  assert.equal(qualifierLot({serviceCeilingCents: 0, apiCostCents: 0, executionCostCents: 0, operationalHumanCostCents: 0}).economicGate, true);
});
test('économie du forfait, coûts de base et scénarios qui échouent à la cible', () => {
  assert.equal(economie(1).directEur, 293.75);
  assert.equal(economie(2).directEur, 387.25);
  assert.equal(economie(1).contributionAfterAllocationsEur, 926.25);
  assert.equal(economie(1, 200).directEur, 347.75);
  for (let n = 1; n <= 12; n++) assert.equal(economie(n).passesTarget, true);
  assert.equal(economie(1, 0, offre.costScenarios[1]).passesTarget, false);
  assert(economie(1, 0, {...offre.costScenarios[1], sharedHours: 30}).contributionAfterAllocationsEur < 0);
  assert.throws(() => economie(1, 0, {...offre.costScenarios[0], sharedHours: undefined}), RangeError);
  assert.throws(() => economie(1, 0, offre.costScenarios[0], 1.1), RangeError);
});
