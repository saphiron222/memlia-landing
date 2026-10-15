import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {offre, agentsDe, creditsPourCout, panier, devis, economie, scanCombinaisons} from './calcul.mjs';
test('douze agents réellement présents, sans doublon, avec prix et quota propres', () => {
  const catalogue = JSON.parse(fs.readFileSync(new URL('../mammouth/COUVERTURE-TRAVAUX.json', import.meta.url)));
  assert.deepEqual(offre.agents.map(a => a.id).sort(), catalogue.agents.map(a => a.id).sort());
  assert.equal(new Set(offre.agents.map(a => a.id)).size, 12);
  for (const a of offre.agents) {
    assert(a.priceCents > 0 && Number.isSafeInteger(a.priceCents));
    assert(a.includedCredits > 0 && Number.isSafeInteger(a.includedCredits));
    assert(panier(a.sample).credits <= a.includedCredits);
  }
});
test('un seul socle et enveloppes mutualisées, sans deuxième abonnement par pôle', () => {
  const q = devis({agentIds: ['comptabilite','relation-client'], usedCredits: 8000});
  assert.equal(q.subscriptionCents, 74700);
  assert.equal(q.includedCredits, 8000);
  assert.equal(q.invoiceCents, 74700);
  assert.equal(devis({agentIds: ['comptabilite'], usedCredits: 0}).invoiceCents, 54800);
});
test('dépassement au prorata et plafond ferme à la frontière du crédit', () => {
  const q = usedCredits => devis({agentIds: ['comptabilite'], usedCredits, authorizedOverageCents: 5000});
  assert.equal(q(5000).invoiceCents, 54800);
  assert.equal(q(5001).invoiceCents, 54805);
  assert.equal(q(6000).invoiceCents, 59800);
  assert.equal(q(6001).permitted, false);
  assert.equal(q(6001).invoiceCents, null);
  assert.equal(q(6001).maxInvoiceCents, 59800);
  assert.equal(devis({agentIds: ['comptabilite'], usedCredits: 5001}).permitted, false);
});
test('entrée manquante, quantité fractionnaire et socle inventé refusés', () => {
  for (const ids of [[], ['inconnu'], ['comptabilite','comptabilite'], undefined]) assert.throws(() => agentsDe(ids), RangeError);
  for (const usedCredits of [null, undefined, '', NaN, -1, .5, Infinity, Number.MAX_SAFE_INTEGER]) assert.throws(() => devis({agentIds: ['comptabilite'], usedCredits}), RangeError);
  assert.throws(() => economie(['comptabilite'], offre.baseScenario, {utilization: 1.01}), RangeError);
  assert.throws(() => economie(['comptabilite'], {...offre.baseScenario, hourlyHumanEur: undefined}), RangeError);
});
test('crédit de réserve complet, arrondi, coût inconnu non remplacé par zéro', () => {
  assert.equal(creditsPourCout(0.16441666666666666), 17);
  assert.equal(creditsPourCout(4.60), 460);
  assert.equal(creditsPourCout(4.6001), 461);
  assert.equal(creditsPourCout(0), 0);
  assert.equal(creditsPourCout(0.000000001), 1);
  assert.throws(() => creditsPourCout(undefined), RangeError);
  assert.throws(() => panier({inconnu: 10}), RangeError);
  assert.equal(panier({U2: 80, U5: 3}).credits, 2965);
});
test('coûts complets : API et humain de production distincts du support fixe', () => {
  const e = economie(['comptabilite']);
  assert.equal(e.revenueEur, 548);
  assert.equal(e.variableCostEur, 50);
  assert.equal(e.fixedHumanEur, 75);
  assert.equal(e.directEur, 171.21);
  assert(Math.abs(e.contributionEur - 296.79) < 1e-8);
  const extra = economie(['comptabilite'], offre.baseScenario, {extraCredits: 1000});
  assert(Math.abs(extra.revenueEur - e.revenueEur - 50) < 1e-8);
  assert(Math.abs(extra.directEur - e.directEur - 11) < 1e-8);
  assert(economie(['comptabilite'], offre.stressScenario).directMargin < offre.directMarginTarget);
  assert(economie(['comptabilite'], {...offre.stressScenario, sharedMaintenanceMinutes: 600}).contributionEur < 0);
});
test('4 095 combinaisons à pleine consommation, sans revenus de dépassement supposés', () => {
  const scan = scanCombinaisons();
  assert.equal(scan.count, 4095);
  assert.equal(scan.failures, 0);
  assert(scan.minimum.directMargin >= offre.directMarginTarget);
});
