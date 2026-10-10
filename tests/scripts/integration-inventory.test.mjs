import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

import { integrationInventory, assertIntegrationCoverage, assertScope } from './integration-inventory.mjs';
import { loadIntegrationFixture } from './integration-fixture.mjs';

const { INTEGRATIONS, INTEGRATION_CANDIDATES } = await loadIntegrationFixture();
const extra = { ...structuredClone(INTEGRATIONS[0]), slug: 'guide-fictif-nouveau', vendor: 'Éditeur fictif', task: 'geste fictif', primaryQuery: 'geste fictif nouveau', source: { ...INTEGRATIONS[0].source, checkedAt: '2026-11-12' } };
const candidate = { task: extra.task, vendor: extra.vendor, suggestions: extra.suggestions, status: 'forte' };

test('une collection générée non vide raccorde chaque mesure source aux routes et mappings', async () => {
  const generatedGuides = [extra, { ...extra, slug: 'autre-guide-fictif', task: 'autre geste fictif', suggestions: 6 }];
  const data = await loadIntegrationFixture({ generatedGuides });
  const inventory = integrationInventory(data.INTEGRATIONS, data.INTEGRATION_CANDIDATES);
  for (const guide of generatedGuides) {
    assert.ok(inventory.slugs.includes(guide.slug));
    assert.equal(inventory.primaryQueries.get(guide.slug), guide.primaryQuery);
    assert.ok(inventory.mappings.get(`${guide.service.href.slice(1)}.html`).includes(guide.slug));
    assert.deepEqual(data.INTEGRATION_CANDIDATES.find(({ task, vendor }) => task === guide.task && vendor === guide.vendor), {
      task: guide.task, vendor: guide.vendor, suggestions: guide.suggestions, status: 'forte',
    });
  }
  assertScope(data.INTEGRATIONS);
});

test('les candidats générés ne masquent ni orphelin, ni doublon, ni mesure divergente', async () => {
  const { INTEGRATIONS: entries, INTEGRATION_CANDIDATES: candidates } = await loadIntegrationFixture({ generatedGuides: [extra] });
  assert.throws(() => integrationInventory(entries.slice(0, -1), candidates), /couverture/);
  assert.throws(() => integrationInventory([...entries, { ...extra, slug: 'orphelin', task: 'geste orphelin' }], candidates), /couverture/);
  assert.throws(() => integrationInventory([...entries, extra], candidates), /dupliquées/);
  assert.throws(() => integrationInventory(entries, [...candidates, candidate]), /couverture/);
  assert.throws(() => integrationInventory(entries.map(entry => entry.slug === extra.slug ? { ...entry, suggestions: entry.suggestions + 1 } : entry), candidates), /mesure/);
  const insufficient = await loadIntegrationFixture({ generatedGuides: [{ ...extra, suggestions: 5 }] });
  assert.throws(() => integrationInventory(insufficient.INTEGRATIONS, insufficient.INTEGRATION_CANDIDATES), /seuil/);
});

test('un guide et un vendeur fictifs étendent requêtes, routes et mappings sans changer les planchers', () => {
  const entries = [...INTEGRATIONS, extra];
  const inventory = integrationInventory(entries, [...INTEGRATION_CANDIDATES, candidate]);
  assert.ok(inventory.slugs.includes(extra.slug));
  assert.equal(inventory.primaryQueries.get(extra.slug), extra.primaryQuery);
  assert.ok(inventory.mappings.get(`${extra.service.href.slice(1)}.html`).includes(extra.slug));
  assertIntegrationCoverage([...inventory.slugs], inventory.slugs);
  assertScope(entries);
  const program = ts.createProgram(['src/data/integrations.ts'], { noEmit: true, skipLibCheck: true });
  const checker = program.getTypeChecker();
  const file = program.getSourceFile('src/data/integrations.ts');
  const definition = file.statements.find((node) => ts.isInterfaceDeclaration(node) && node.name.text === 'IntegrationDefinition');
  const vendor = definition.members.find((node) => node.name?.getText(file) === 'vendor');
  assert.equal(checker.typeToString(checker.getTypeAtLocation(vendor)), 'string');
});

test('couverture exacte : un guide absent, supplémentaire ou dupliqué échoue', () => {
  const { slugs } = integrationInventory(INTEGRATIONS, INTEGRATION_CANDIDATES);
  for (const rendered of [slugs.slice(1), [...slugs, extra.slug], [...slugs, slugs[0]]]) {
    assert.throws(() => assertIntegrationCoverage(rendered, slugs));
  }
});

test('les planchers et le seuil de lancement restent bloquants', () => {
  assert.throws(() => integrationInventory(INTEGRATIONS.slice(0, 8), INTEGRATION_CANDIDATES), /plancher/);
  for (const [status, floor] of [['forte', 9], ['moyenne', 10], ['refusee', 16]]) {
    const reduced = [...INTEGRATION_CANDIDATES.filter((entry) => entry.status !== status), ...INTEGRATION_CANDIDATES.filter((entry) => entry.status === status).slice(0, floor - 1)];
    assert.throws(() => integrationInventory(INTEGRATIONS, reduced), /plancher/);
  }
  assert.throws(() => integrationInventory([...INTEGRATIONS, { ...extra, suggestions: 5 }], [...INTEGRATION_CANDIDATES, { ...candidate, suggestions: 5 }]), /seuil/);
  assert.throws(() => integrationInventory(INTEGRATIONS, [...INTEGRATION_CANDIDATES, candidate]), /couverture/);
  assert.throws(() => integrationInventory([...INTEGRATIONS, { ...extra, vendor: ' ' }], [...INTEGRATION_CANDIDATES, candidate]), /vendeur/);
  assert.throws(() => assertScope([...INTEGRATIONS, { ...extra, source: { ...extra.source, checkedAt: '2026-02-30' } }]), /date/);
});