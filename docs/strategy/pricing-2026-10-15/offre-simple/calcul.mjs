/** Étude économique uniquement. Aucun compteur produit, aucune API, aucune facture émise. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const directory = path.dirname(fileURLToPath(import.meta.url));
export const offre = JSON.parse(fs.readFileSync(path.join(directory, 'offre.json'), 'utf8'));
function cents(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name} : centimes entiers positifs ou nuls requis`);
  return value;
}
function nonNegative(value, name) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} : nombre positif ou nul requis`);
  return value;
}
export function devis({poles, usageCents, authorizedOverageCents = offre.defaultAuthorizedOverageCents}) {
  if (!Array.isArray(poles) || poles.length < 1 || new Set(poles).size !== poles.length || poles.some(p => !offre.poles.includes(p))) {
    throw new RangeError('Au moins un pôle connu, sans doublon');
  }
  cents(usageCents, 'usage');
  cents(authorizedOverageCents, 'autorisation de dépassement');
  const subscriptionCents = cents(offre.baseMonthlyCents + poles.length * offre.poleMonthlyCents, 'abonnement');
  const includedCents = cents(poles.length * offre.includedUsagePerPoleCents, 'inclus');
  const overageCents = Math.max(0, usageCents - includedCents);
  const proposedInvoiceCents = cents(subscriptionCents + overageCents, 'facture proposée');
  const permitted = overageCents <= authorizedOverageCents;
  return {poleCount: poles.length, subscriptionCents, includedCents, usageCents, overageCents,
    proposedInvoiceCents, permitted, invoiceCents: permitted ? proposedInvoiceCents : null,
    maxInvoiceCents: cents(subscriptionCents + authorizedOverageCents, 'maximum'),
    remainingUsageCents: includedCents + authorizedOverageCents - usageCents};
}
/** Le prix de service est fixé avant le lot ; les coûts ne modifient pas rétroactivement ce prix. */
export function qualifierLot({serviceCeilingCents, apiCostCents, executionCostCents, operationalHumanCostCents}) {
  cents(serviceCeilingCents, 'prix maximum du lot');
  const reservedCostCents = cents(cents(apiCostCents, 'réserve API') + cents(executionCostCents, 'réserve exécution') + cents(operationalHumanCostCents, 'réserve humain opérationnel'), 'coût variable réservé');
  const minimumServiceCents = cents(Math.ceil(reservedCostCents / offre.maxOperatingCostFractionOfUsage), 'plancher interne');
  return {serviceCeilingCents, reservedCostCents, minimumServiceCents, economicGate: serviceCeilingCents >= minimumServiceCents};
}
export function economie(poleCount, overageEur = 0, scenario = offre.costScenarios[0], utilization = 1) {
  if (!Number.isInteger(poleCount) || poleCount < 1 || poleCount > offre.poles.length) throw new RangeError('Nombre de pôles invalide');
  nonNegative(overageEur, 'dépassement');
  nonNegative(utilization, 'taux d’usage');
  if (utilization > 1) throw new RangeError('Utilisation supérieure à 100 %');
  for (const key of ['hourlyHumanEur', 'sharedHours', 'poleFixedHours', 'infraMonthlyEur', 'collectionPercent', 'collectionFixedEur', 'allocationsMonthlyEur']) nonNegative(scenario[key], key);
  if (scenario.collectionPercent >= 1) throw new RangeError('Réserve d’encaissement invalide');
  const revenueEur = (offre.baseMonthlyCents + poleCount * offre.poleMonthlyCents) / 100 + overageEur;
  const usageValueEur = poleCount * offre.includedUsagePerPoleCents / 100 * utilization + overageEur;
  // Tous les coûts variables de production sont dans ce budget : pas seulement les tokens.
  const variableCostBudgetEur = usageValueEur * offre.maxOperatingCostFractionOfUsage;
  const fixedHumanEur = (scenario.sharedHours + poleCount * scenario.poleFixedHours) * scenario.hourlyHumanEur;
  const collectionEur = revenueEur * scenario.collectionPercent + scenario.collectionFixedEur;
  const directEur = variableCostBudgetEur + fixedHumanEur + scenario.infraMonthlyEur + collectionEur;
  return {poleCount, overageEur, revenueEur, usageValueEur, variableCostBudgetEur, fixedHumanEur,
    infraEur: scenario.infraMonthlyEur, collectionEur, directEur, grossMargin: 1 - directEur / revenueEur,
    contributionAfterAllocationsEur: revenueEur - directEur - scenario.allocationsMonthlyEur,
    passesTarget: 1 - directEur / revenueEur >= offre.minFullMonthlyDirectMargin,
    condition: 'Coûts variables effectivement contenus dans leur réserve ; coûts fixes hypothétiques ; aucune rentabilité observée.'};
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const s = offre.setupReference;
  const setupCostEur = s.hours * s.humanHourlyEur + s.technicalReserveEur + s.priceCents / 100 * s.collectionPercent + s.collectionFixedEur * s.paymentCount;
  const firstPoleMonthlyEur = (offre.baseMonthlyCents + offre.poleMonthlyCents) / 100;
  const historical = JSON.parse(fs.readFileSync(path.join(directory, '../mammouth/calculs-agents.json'), 'utf8'));
  const evidence = historical.scenarios.map(scenario => ({
    scenario: scenario.id,
    // Coût variable humain compris, hors encaissement déjà compté dans l’économie du mois.
    minimumPriceExamples: scenario.units.map(u => ({
      id: u.id, variableCostEur: u.apiEur + u.humanEur + u.toolsEur,
      minimumServiceEur: Math.ceil((u.apiEur + u.humanEur + u.toolsEur) * 100 / offre.maxOperatingCostFractionOfUsage - 1e-9) / 100
    }))
  }));
  const result = {
    date: '2026-10-15', nature: 'Budgets et calculs hypothétiques ; aucun usage facturé mesuré',
    examples: [1, 2, 3, 12].map(n => economie(n)),
    onePoleNoUsage: economie(1, 0, offre.costScenarios[0], 0),
    onePoleAt1500Cap: economie(1, 200),
    adverseOnePole: economie(1, 0, offre.costScenarios[1]),
    incidentOnePole: economie(1, 0, {...offre.costScenarios[1], sharedHours: 30}),
    setup: {revenueEur: s.priceCents / 100, directCostEur: setupCostEur, firstMonthOnePoleEur: s.priceCents / 100 + firstPoleMonthlyEur, firstYearOnePoleEur: s.priceCents / 100 + 12 * firstPoleMonthlyEur},
    valueThreshold: {hourlyValueHypothesisEur: 35, monthlyHoursWithoutSetup: firstPoleMonthlyEur / 35, monthlyHoursWithSetup: (firstPoleMonthlyEur + s.priceCents / 1200) / 35, measuredSavings: false},
    costReferenceExamples: evidence
  };
  fs.writeFileSync(path.join(directory, 'calculs.json'), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({examples: result.examples, adverse: result.adverseOnePole, incident: result.incidentOnePole, setup: result.setup}, null, 2));
}
