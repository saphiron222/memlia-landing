const DAY_MS = 86_400_000;

function roundCents(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function hasCentPrecision(value) {
  return roundCents(value) === value;
}

function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return date;
}

function addYearsClamped(date, years) {
  const year = date.getUTCFullYear() + years;
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  return new Date(Date.UTC(year, month, Math.min(day, lastDay)));
}

function daysInYear(year) {
  return (Date.UTC(year + 1, 0, 1) - Date.UTC(year, 0, 1)) / DAY_MS;
}

function formatIso(date) {
  return date.toISOString().slice(0, 10);
}

function previousDay(date) {
  return new Date(date.getTime() - DAY_MS);
}

function validateInput({ value, startDate, acquisitionDate, durationYears, method }) {
  if (!Number.isFinite(value) || value < 0.01 || value > 1_000_000_000 || !hasCentPrecision(value)) {
    throw new Error('La valeur amortissable doit être comprise entre 0,01 € et 1 milliard d’euros et saisie au centime, avec deux décimales au plus.');
  }
  const start = parseIsoDate(method === 'declining' ? acquisitionDate ?? '' : startDate);
  if (!start) throw new Error(method === 'declining' ? 'La date d’acquisition doit être une date valide.' : 'La date de mise en service doit être une date valide.');
  if (!Number.isInteger(durationYears) || durationYears < 1 || durationYears > 50) {
    throw new Error('La durée doit être un nombre entier compris entre 1 et 50 ans.');
  }
  if (!['linear', 'declining'].includes(method)) throw new Error('Choisissez une méthode de calcul.');
  if (method === 'declining' && durationYears < 3) {
    throw new Error('Le dégressif fiscal exige une durée d’au moins 3 ans pour appliquer l’un des coefficients prévus.');
  }
  return start;
}

function linearSchedule(value, start, durationYears) {
  const rows = [];
  const end = addYearsClamped(start, durationYears);
  const annualRate = 1 / durationYears;
  let cursor = start;
  let opening = value;
  let accumulated = 0;

  while (cursor < end) {
    const year = cursor.getUTCFullYear();
    const nextYear = new Date(Date.UTC(year + 1, 0, 1));
    const periodEnd = nextYear < end ? nextYear : end;
    const days = Math.round((periodEnd.getTime() - cursor.getTime()) / DAY_MS);
    const denominator = daysInYear(year);
    const raw = value * annualRate * (days / denominator);
    const isLast = periodEnd.getTime() === end.getTime();
    // Une dotation arrondie ne peut consommer plus que la base restante.
    const amount = Math.min(opening, Math.max(0, isLast ? roundCents(value - accumulated) : roundCents(raw)));
    const closing = roundCents(opening - amount);

    rows.push({
      year,
      periodStart: formatIso(cursor),
      periodEnd: formatIso(previousDay(periodEnd)),
      opening: roundCents(opening),
      amount,
      accumulated: roundCents(accumulated + amount),
      closing: Math.max(0, closing),
      rule: `${days}/${denominator}`,
      formula: `Valeur × ${(annualRate * 100).toFixed(4)} % × ${days}/${denominator}${!isLast && roundCents(raw) > opening ? ' ; dotation plafonnée à la base restante après arrondi' : ''}`,
    });
    accumulated = roundCents(accumulated + amount);
    opening = Math.max(0, closing);
    cursor = periodEnd;
  }

  return {
    method: 'Linéaire comptable',
    annualRate,
    coefficient: undefined,
    convention: 'Prorata au jour exact, de la date de mise en service à la date anniversaire, exercice clos au 31 décembre.',
    rows,
  };
}

function decliningCoefficient(durationYears) {
  if (durationYears <= 4) return 1.25;
  if (durationYears <= 6) return 1.75;
  return 2.25;
}

function decliningSchedule(value, start, durationYears) {
  const rows = [];
  const coefficient = decliningCoefficient(durationYears);
  const annualRate = coefficient / durationYears;
  const firstYearMonths = 12 - start.getUTCMonth();
  let opening = value;
  let accumulated = 0;

  for (let index = 0; index < durationYears; index += 1) {
    const year = start.getUTCFullYear() + index;
    const remainingYears = durationYears - index;
    const decliningAmount = opening * annualRate;
    const straightLineAmount = opening / remainingYears;
    const isFirst = index === 0;
    const isLast = remainingYears === 1;
    const switchToLinear = !isFirst && straightLineAmount >= decliningAmount;
    let raw = isFirst ? decliningAmount * (firstYearMonths / 12) : (switchToLinear ? straightLineAmount : decliningAmount);
    if (isLast) raw = opening;
    const amount = isLast ? roundCents(value - accumulated) : roundCents(raw);
    const closing = roundCents(opening - amount);
    const rule = isFirst
      ? `Dégressif sur ${firstYearMonths}/12 mois`
      : switchToLinear ? `Linéaire sur ${remainingYears} an${remainingYears > 1 ? 's' : ''}` : 'Dégressif sur la valeur résiduelle';
    const formula = isFirst
      ? `Valeur × ${(annualRate * 100).toFixed(4)} % × ${firstYearMonths}/12`
      : switchToLinear ? `Valeur résiduelle ÷ ${remainingYears}` : `Valeur résiduelle × ${(annualRate * 100).toFixed(4)} %`;

    rows.push({
      year,
      periodStart: isFirst ? `${year}-${String(start.getUTCMonth() + 1).padStart(2, '0')}-01` : `${year}-01-01`,
      periodEnd: `${year}-12-31`,
      opening: roundCents(opening),
      amount,
      accumulated: roundCents(accumulated + amount),
      closing: Math.max(0, closing),
      rule,
      formula,
    });
    accumulated = roundCents(accumulated + amount);
    opening = Math.max(0, closing);
  }

  return {
    method: 'Dégressif fiscal',
    annualRate,
    coefficient,
    convention: `Coefficient ${coefficient.toFixed(2).replace('.', ',')} ; première annuité du premier jour du mois d’acquisition à la clôture du 31 décembre ; option de passage au quotient de la valeur résiduelle lorsqu’il atteint ou dépasse l’annuité dégressive. L’exercice d’acquisition compte pour une année entière.`,
    rows,
  };
}

export function buildDepreciationSchedule(input) {
  const start = validateInput(input);
  const schedule = input.method === 'linear'
    ? linearSchedule(input.value, start, input.durationYears)
    : decliningSchedule(input.value, start, input.durationYears);
  return {
    ...schedule,
    value: roundCents(input.value),
    startDate: input.method === 'declining' ? input.acquisitionDate : input.startDate,
    durationYears: input.durationYears,
    total: roundCents(schedule.rows.reduce((sum, row) => sum + row.amount, 0)),
  };
}
