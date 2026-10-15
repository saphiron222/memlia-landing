/** Étude interne : pas de compteur produit, d’appel API ou de facture réelle. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url));
export const offre = JSON.parse(fs.readFileSync(path.join(directory, 'offre.json'), 'utf8'));
const historique = JSON.parse(fs.readFileSync(path.join(directory, '../mammouth/calculs-agents.json'), 'utf8'));
const unitCosts = new Map(historique.scenarios.find(s => s.id === 'base').units.map(u => [u.id, u.apiEur + u.toolsEur + u.humanEur]));
function entier(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${label} doit être un entier positif ou nul`);
  return value;
}
function positif(value, label) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${label} doit être renseigné et positif ou nul`);
  return value;
}
export function agentsDe(ids) {
  if (!Array.isArray(ids) || !ids.length || new Set(ids).size !== ids.length) throw new RangeError('Choisir au moins un agent sans doublon');
  return ids.map(id => {
    const a = offre.agents.find(a => a.id === id);
    if (!a) throw new RangeError(`Agent inconnu : ${id}`);
    return a;
  });
}
export function creditsPourCout(costEur) {
  positif(costEur, 'coût complet réservé');
  if (!(offre.creditProductionReserveCents > 0)) throw new RangeError('Réserve par crédit invalide');
  return entier(Math.ceil(costEur * 100 / offre.creditProductionReserveCents), 'crédits');
}
export function panier(quantities) {
  let costEur = 0, credits = 0;
  const lines = Object.entries(quantities).map(([id, quantity]) => {
    if (!unitCosts.has(id)) throw new RangeError(`Référence de coût inconnue : ${id}`);
    entier(quantity, 'quantité');
    const lineCredits = entier(creditsPourCout(unitCosts.get(id)) * quantity, 'crédits de ligne');
    const lineCostEur = unitCosts.get(id) * quantity;
    costEur += lineCostEur; credits += lineCredits;
    return {reference: id, quantity, credits: lineCredits, costEur: lineCostEur};
  });
  return {lines, credits: entier(credits, 'crédits du panier'), costEur};
}
export function devis({agentIds, usedCredits, authorizedOverageCents = offre.defaultAuthorizedOverageCents}) {
  const agents = agentsDe(agentIds);
  entier(usedCredits, 'usage'); entier(authorizedOverageCents, 'supplément autorisé');
  const subscriptionCents = entier(offre.baseMonthlyCents + agents.reduce((s, a) => s + a.priceCents, 0), 'abonnement');
  const includedCredits = entier(agents.reduce((s, a) => s + a.includedCredits, 0), 'inclus');
  const extraCredits = Math.max(0, usedCredits - includedCredits);
  const overageCents = entier(extraCredits * offre.overagePriceCentsPerCredit, 'supplément');
  const proposedInvoiceCents = entier(subscriptionCents + overageCents, 'facture proposée');
  const permitted = overageCents <= authorizedOverageCents;
  return {agentIds, subscriptionCents, includedCredits, usedCredits, extraCredits, overageCents, proposedInvoiceCents,
    invoiceCents: permitted ? proposedInvoiceCents : null, permitted, maxInvoiceCents: entier(subscriptionCents + authorizedOverageCents, 'maximum')};
}
export function economie(agentIds, scenario = offre.baseScenario, options = {}) {
  const agents = agentsDe(agentIds);
  const baseCents = options.baseCents ?? offre.baseMonthlyCents;
  const extraCredits = options.extraCredits ?? 0;
  const utilization = options.utilization ?? 1;
  entier(baseCents, 'socle'); entier(extraCredits, 'crédits supplémentaires'); positif(utilization, 'usage');
  if (utilization > 1) throw new RangeError('Usage inclus supérieur à 100 %');
  for (const k of ['hourlyHumanEur','sharedMaintenanceMinutes','sharedInfraEur','agentTimeMultiplier','agentInfraMultiplier','incidentReserveMultiplier','unbudgetedVariableMultiplier','collectionRate','collectionFixedEur','allocationsMonthlyEur']) positif(scenario[k], k);
  if (scenario.collectionRate >= 1) throw new RangeError('Taux d’encaissement invalide');
  const revenueEur = (baseCents + agents.reduce((s, a) => s + a.priceCents, 0) + extraCredits * offre.overagePriceCentsPerCredit) / 100;
  const includedCredits = agents.reduce((s, a) => s + a.includedCredits, 0);
  const variableCostEur = (includedCredits * utilization + extraCredits) * offre.creditProductionReserveCents / 100 * scenario.unbudgetedVariableMultiplier;
  const fixedHumanEur = (scenario.sharedMaintenanceMinutes + agents.reduce((s, a) => s + a.maintenanceMinutes * scenario.agentTimeMultiplier, 0)) / 60 * scenario.hourlyHumanEur;
  const infraEur = scenario.sharedInfraEur + agents.reduce((s, a) => s + a.infraEur * scenario.agentInfraMultiplier, 0);
  const incidentReserveEur = agents.reduce((s, a) => s + a.incidentReserveEur * scenario.incidentReserveMultiplier, 0);
  const collectionEur = revenueEur * scenario.collectionRate + scenario.collectionFixedEur;
  const directEur = variableCostEur + fixedHumanEur + infraEur + incidentReserveEur + collectionEur;
  return {agentIds, revenueEur, includedCredits, variableCostEur, fixedHumanEur, infraEur, incidentReserveEur, collectionEur, directEur,
    directMargin: 1 - directEur / revenueEur, allocatedEur: scenario.allocationsMonthlyEur,
    contributionEur: revenueEur - directEur - scenario.allocationsMonthlyEur, passesMarginTarget: 1 - directEur / revenueEur >= offre.directMarginTarget};
}
export function scanCombinaisons() {
  let minimum = null, failures = 0, count = 0;
  for (let mask = 1; mask < 2 ** offre.agents.length; mask++) {
    const ids = offre.agents.filter((_, i) => mask & (1 << i)).map(a => a.id);
    const e = economie(ids);
    if (!minimum || e.directMargin < minimum.directMargin) minimum = e;
    if (!e.passesMarginTarget) failures++;
    count++;
  }
  return {count, failures, minimum};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const s = offre.baseScenario;
  const setup = offre.setup;
  const setupCost = (priceCents, hours, toolsEur) => hours * setup.hourlyHumanEur + toolsEur + priceCents / 100 * s.collectionRate + setup.paymentCount * s.collectionFixedEur;
  const report = {
    date: '2026-10-15', nature: 'Prix candidats, coûts et paniers hypothétiques ; aucune consommation facturée ni capacité mesurée',
    baseCandidates: offre.baseCandidatesCents.map(baseCents => {
      const directEur = s.sharedMaintenanceMinutes / 60 * s.hourlyHumanEur + s.sharedInfraEur + baseCents / 100 * s.collectionRate + s.collectionFixedEur;
      return {baseEur: baseCents / 100, directEur, contributionAfterAllocationsEur: baseCents / 100 - directEur - s.allocationsMonthlyEur,
        withLightestAgent: economie(['communication'], s, {baseCents})};
    }),
    agents: offre.agents.map(a => ({id: a.id, name: a.name, priceEur: a.priceCents / 100, includedCredits: a.includedCredits,
      includedVariableBudgetEur: a.includedCredits * offre.creditProductionReserveCents / 100,
      sample: panier(a.sample), fullUsage: economie([a.id]), noUsage: economie([a.id], s, {utilization: 0}), stress: economie([a.id], offre.stressScenario)})),
    allCombinations: scanCombinaisons(),
    examples: {
      balthazar: economie(['comptabilite']),
      balthazarPlusEmile: economie(['comptabilite', 'relation-client']),
      balthazarPlusSalome: economie(['comptabilite', 'paie-social']),
      balthazar1000Extra: economie(['comptabilite'], s, {extraCredits: 1000}),
      allAgents: economie(offre.agents.map(a => a.id)),
      heavyIncident: economie(['comptabilite'], {...offre.stressScenario, sharedMaintenanceMinutes: 600})
    },
    setup: {firstPriceEur: setup.firstAgentPriceCents / 100, firstDirectEur: setupCost(setup.firstAgentPriceCents, setup.firstAgentHours, setup.firstTechnicalEur),
      additionalPriceEur: setup.additionalAgentPriceCents / 100, additionalDirectEur: setupCost(setup.additionalAgentPriceCents, setup.additionalAgentHours, setup.additionalTechnicalEur)}
  };
  fs.writeFileSync(path.join(directory, 'calculs.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({baseCandidates: report.baseCandidates, agents: report.agents.map(a => ({id: a.id, priceEur: a.priceEur,
    includedCredits: a.includedCredits, sampleCredits: a.sample.credits, directEur: a.fullUsage.directEur,
    margin: a.fullUsage.directMargin, contribution: a.fullUsage.contributionEur, stressContribution: a.stress.contributionEur})),
    allCombinations: report.allCombinations, setup: report.setup}, null, 2));
}
