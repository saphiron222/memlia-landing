import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFileSync } from 'node:fs';
import { integrationInventory, assertIntegrationCoverage, assertScope } from './integration-inventory.mjs';

const source = readFileSync('src/data/integrations.ts', 'utf8');
const compiled = ts.transpileModule(source.replace("import generatedGuides from './guides.generated.json' with { type: 'json' };", `const generatedGuides = ${readFileSync('src/data/guides.generated.json', 'utf8')};`), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { INTEGRATIONS, INTEGRATION_CANDIDATES } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const extra = { ...structuredClone(INTEGRATIONS[0]), slug: 'guide-fictif-nouveau', vendor: 'Éditeur fictif', task: 'geste fictif', primaryQuery: 'geste fictif nouveau', source: { ...INTEGRATIONS[0].source, checkedAt: '2026-11-12' } };
const candidate = { task: extra.task, vendor: extra.vendor, suggestions: extra.suggestions, status: 'forte' };

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