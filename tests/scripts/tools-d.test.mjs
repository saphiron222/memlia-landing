import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { buildDepreciationSchedule } from '../../src/lib/amortissement.mjs';
const read = (file) => readFileSync(new URL(`../../${file}`, import.meta.url), 'utf8');

test('marge : trois formules lisibles avant le formulaire sans JavaScript', () => {
  const staticHtml = read('src/components/outils/CalculateurMarge.astro').split('<script>')[0];
  for (const formula of ['Marge = vente HT − achat HT', 'Taux de marge = marge ÷ achat HT × 100', 'Taux de marque = marge ÷ vente HT × 100', 'strictement positifs']) assert.ok(staticHtml.includes(formula), formula);
});
test('échéance : délai convenu distinct des exclusions avant la saisie', () => {
  const html = read('src/components/outils/CalculateurEcheance.astro');
  assert.ok(html.indexOf('factures périodiques') < html.indexOf('<select'));
  assert.ok(html.includes('Délai applicable ou convenu'));
  assert.ok(!html.includes('sans règle sectorielle ni accord particulier'));
});
test('dégressif : acquisition distincte de mise en service, novembre compte pour deux mois', () => {
  const plan = buildDepreciationSchedule({ value: 10000, startDate: '2026-12-15', acquisitionDate: '2026-11-15', durationYears: 5, method: 'declining' });
  assert.equal(plan.rows[0].periodStart, '2026-11-01');
  assert.equal(plan.rows[0].amount, 583.33);
  assert.match(plan.convention, /mois d’acquisition/);
  assert.throws(() => buildDepreciationSchedule({ value: 10000, startDate: '2026-12-15', durationYears: 5, method: 'declining' }), /acquisition/);
});
test('rapprochement : vrai classeur et exceptions exportables non validées', () => {
  assert.ok(existsSync(new URL('../../public/downloads/modele-rapprochement-bancaire.xlsx', import.meta.url)));
  const html = read('src/components/outils/ModeleRapprochement.astro');
  assert.ok(html.includes('href="/downloads/modele-rapprochement-bancaire.xlsx"'));
  assert.ok(html.includes('NON VALIDÉ'));
  assert.ok(!html.includes('Le téléchargement reste bloqué'));
});
