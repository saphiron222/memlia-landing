import assert from 'node:assert/strict';

export function assertIntegrationCoverage(actual, expected) {
  assert.equal(new Set(actual).size, actual.length, 'couverture : identités dupliquées');
  assert.deepEqual([...actual].sort(), [...expected].sort(), 'couverture source-rendu incomplète');
}

export function integrationInventory(integrations, candidates) {
  assert.ok(integrations.length >= 9, 'plancher : neuf guides');
  assert.ok(candidates.length >= 35, 'plancher : 35 formulations');
  for (const [status, floor] of [['forte', 9], ['moyenne', 10], ['refusee', 16]]) {
    assert.ok(candidates.filter((entry) => entry.status === status).length >= floor, `plancher : ${status}`);
  }
  const key = ({ task, vendor }) => JSON.stringify([task, vendor]);
  for (const entry of [...integrations, ...candidates]) {
    assert.ok(typeof entry.vendor === 'string' && entry.vendor.trim(), 'vendeur non vide');
    assert.ok(Number.isInteger(entry.suggestions) && entry.suggestions >= 0, 'suggestions invalides');
  }
  for (const entry of candidates) {
    const status = entry.suggestions >= 6 ? 'forte' : entry.suggestions >= 2 ? 'moyenne' : 'refusee';
    assert.equal(entry.status, status, 'seuil de lancement : 6 suggestions');
  }
  assertIntegrationCoverage(integrations.map(key), candidates.filter((entry) => entry.status === 'forte').map(key));
  const slugs = integrations.map((entry) => entry.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'slugs uniques');
  const mappings = new Map();
  for (const entry of integrations) {
    assert.ok(entry.suggestions >= 6, 'seuil de lancement : 6 suggestions');
    assert.equal(entry.suggestions, candidates.find((candidate) => key(candidate) === key(entry)).suggestions, 'mesure guide/candidat');
    assert.ok(entry.slug && entry.primaryQuery?.trim(), 'identité et requête non vides');
    const file = `${entry.service.href.slice(1)}.html`;
    mappings.set(file, [...(mappings.get(file) ?? []), entry.slug]);
  }
  return { slugs, primaryQueries: new Map(integrations.map((entry) => [entry.slug, entry.primaryQuery])), mappings };
}

export function assertScope(integrations) {
  assert.ok(integrations.length >= 9, 'plancher : neuf guides');
  for (const entry of integrations) {
    assert.ok(entry.documentScope.length > 80, entry.slug);
    assert.ok(entry.fields.every((field) => field.label && field.control.length > 40), entry.slug);
    assert.equal(new Set(entry.fields.map((field) => field.control)).size, entry.fields.length, entry.slug);
    const date = entry.source.checkedAt;
    assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${entry.slug}: date ISO`);
    const parsed = new Date(`${date}T00:00:00Z`);
    assert.ok(Number.isFinite(parsed.getTime()), `${entry.slug}: date valide`);
    assert.equal(parsed.toISOString().slice(0, 10), date, `${entry.slug}: date valide`);
  }
}