import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDepreciationSchedule } from '../../src/lib/amortissement.mjs';

test('linéaire : prorata quotidien, années civiles et total réconcilié au centime', () => {
  const plan = buildDepreciationSchedule({
    value: 10_000,
    startDate: '2026-04-01',
    durationYears: 5,
    method: 'linear',
  });

  assert.equal(plan.method, 'Linéaire comptable');
  assert.equal(plan.annualRate, 0.2);
  assert.equal(plan.rows.length, 6);
  assert.deepEqual(
    plan.rows.map(({ year, rule, amount, closing }) => ({ year, rule, amount, closing })),
    [
      { year: 2026, rule: '275/365', amount: 1506.85, closing: 8493.15 },
      { year: 2027, rule: '365/365', amount: 2000, closing: 6493.15 },
      { year: 2028, rule: '366/366', amount: 2000, closing: 4493.15 },
      { year: 2029, rule: '365/365', amount: 2000, closing: 2493.15 },
      { year: 2030, rule: '365/365', amount: 2000, closing: 493.15 },
      { year: 2031, rule: '90/365', amount: 493.15, closing: 0 },
    ],
  );
  assert.equal(plan.total, 10_000);
});

test('dégressif : coefficient, prorata mensuel et bascule au quotient résiduel', () => {
  const plan = buildDepreciationSchedule({
    value: 10_000,
    startDate: '2026-04-15',
    durationYears: 5,
    method: 'declining',
  });

  assert.equal(plan.coefficient, 1.75);
  assert.equal(plan.annualRate, 0.35);
  assert.deepEqual(
    plan.rows.map(({ year, rule, amount, closing }) => ({ year, rule, amount, closing })),
    [
      { year: 2026, rule: 'Dégressif sur 9/12 mois', amount: 2625, closing: 7375 },
      { year: 2027, rule: 'Dégressif sur la valeur résiduelle', amount: 2581.25, closing: 4793.75 },
      { year: 2028, rule: 'Dégressif sur la valeur résiduelle', amount: 1677.81, closing: 3115.94 },
      { year: 2029, rule: 'Linéaire sur 2 ans', amount: 1557.97, closing: 1557.97 },
      { year: 2030, rule: 'Linéaire sur 1 an', amount: 1557.97, closing: 0 },
    ],
  );
  assert.equal(plan.total, 10_000);
});

test('les entrées incohérentes sont refusées avant tout plan', () => {
  assert.throws(
    () => buildDepreciationSchedule({ value: 0, startDate: '2026-01-01', durationYears: 5, method: 'linear' }),
    /supérieure à zéro/,
  );
  assert.throws(
    () => buildDepreciationSchedule({ value: 1000, startDate: '2026-02-30', durationYears: 5, method: 'linear' }),
    /date valide/,
  );
  assert.throws(
    () => buildDepreciationSchedule({ value: 1000, startDate: '2026-01-01', durationYears: 2, method: 'declining' }),
    /au moins 3 ans/,
  );
});
