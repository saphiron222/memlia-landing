import test from 'node:test';
import assert from 'node:assert/strict';
import { buildDepreciationSchedule } from '../../src/lib/amortissement.mjs';

test('dégressif : acquisitions depuis le 01/01/2010 seulement, sans restriction du linéaire', () => {
  const input = { value: 1_500_000, durationYears: 10, method: 'declining' };
  for (const acquisitionDate of ['2009-07-03', '2009-12-31']) {
    assert.throws(() => buildDepreciationSchedule({ ...input, acquisitionDate }), /01\/01\/2010/);
  }
  const plan = buildDepreciationSchedule({ ...input, acquisitionDate: '2010-01-01' });
  assert.equal(plan.coefficient, 2.25);
  assert.equal(plan.rows[0].amount, 337500);
  assert.equal(buildDepreciationSchedule({ ...input, method: 'linear', startDate: '2009-07-03' }).total, input.value);
  const modern = buildDepreciationSchedule({ value: 10000, durationYears: 5, method: 'declining', acquisitionDate: '2026-11-15', startDate: '2026-12-15' });
  assert.equal(modern.rows[0].amount, 583.33);
  assert.equal(modern.rows[0].rule, 'Dégressif sur 2/12 mois');
});

test('arrondis : aucune dotation négative ni cumul au-delà de la base, y compris deux centimes', () => {
  const tiny = buildDepreciationSchedule({ value: 0.02, startDate: '2024-01-15', durationYears: 3, method: 'linear' });
  assert.match(tiny.rows[2].formula, /plafonnée/);
  for (let durationYears = 1; durationYears <= 50; durationYears += 1) {
    for (let month = 1; month <= 12; month += 1) {
      for (const value of [0.01, 0.02, 0.03, 0.07, 1234.56, 1_000_000_000]) {
        for (const method of ['linear', 'declining']) {
          if (method === 'declining' && durationYears < 3) continue;
          const date = `2024-${String(month).padStart(2, '0')}-15`;
          const plan = buildDepreciationSchedule({ value, startDate: date, acquisitionDate: date, durationYears, method });
          assert.equal(plan.total, value);
          assert.equal(plan.rows.at(-1).closing, 0);
          for (const row of plan.rows) {
            assert.ok(row.amount >= 0 && row.amount <= row.opening, JSON.stringify({ value, method, durationYears, date, row }));
            assert.ok(row.accumulated <= value);
          }
        }
      }
    }
  }
});

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
    acquisitionDate: '2026-04-15',
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
    /0,01 €/,
  );
  assert.throws(
    () => buildDepreciationSchedule({ value: 1000, startDate: '2026-02-30', durationYears: 5, method: 'linear' }),
    /date valide/,
  );
  assert.throws(
    () => buildDepreciationSchedule({ value: 1000, acquisitionDate: '2026-01-01', durationYears: 2, method: 'declining' }),
    /au moins 3 ans/,
  );
});

test('la valeur amortissable respecte la précision monétaire au centime', () => {
  for (const value of [0.001, 0.004]) {
    assert.throws(
      () => buildDepreciationSchedule({ value, startDate: '2026-01-01', durationYears: 5, method: 'linear' }),
      /centime/,
    );
  }

  const plan = buildDepreciationSchedule({
    value: 0.01,
    startDate: '2026-01-01',
    durationYears: 5,
    method: 'linear',
  });
  assert.equal(plan.value, 0.01);
  assert.equal(plan.total, 0.01);
});
