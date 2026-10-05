import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { assertScope } from './integration-inventory.mjs';

const read = (path) => readFileSync(path, 'utf8');
const compiled = ts.transpileModule(read('src/data/integrations.ts'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { INTEGRATIONS } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const guide = read('src/pages/integrations/[slug].astro');
const get = (slug) => INTEGRATIONS.find((entry) => entry.slug === slug);

test('au moins neuf guides : chaque champ explique un rôle et sa condition de contrôle', () => {
  assertScope(INTEGRATIONS);
  assert.doesNotMatch(guide, /Champ observé dans le jeu fictif/);
  assert.match(guide, /integration.source.checkedAt/);
});

test('Cegid : clés JSON et non menu ; compte général ou tiers lettrable', () => {
  const entry = get('lettrage-cegid');
  assert.match(entry.officialPath, /JSON/);
  assert.doesNotMatch(entry.officialPath, /Écritures comptables →/);
  assert.deepEqual(entry.fields.map((field) => field.label), ['codeLettrage', 'journal', 'refPiece', 'date', 'compte', 'tiers', 'debit.amount', 'credit.amount']);
  assert.match(entry.knownTrap, /tiers/);
});

test('portée éditeur, versions et règles du cabinet restent distinctes', () => {
  for (const slug of ['dsn-silae', 'bulletin-de-paie-silae']) {
    assert.match(get(slug).documentScope, /commerciale/);
    assert.match(get(slug).documentScope, /grille de cadrage/);
    assert.doesNotMatch(get(slug).officialPath, /Télédéclarations →/);
  }
  assert.match(get('dsn-sage').source.fact, /Sage 100 Paie/);
  assert.doesNotMatch(get('dsn-sage').knownTrap, /ARRCO et AGIRC/);
  assert.match(get('bulletin-de-paie-sage').documentScope, /4.11/);
  assert.match(get('rapprochement-bancaire-sage').knownTrap, /plus ancien/);
  assert.match(get('cloture-sage').officialPath, /sauvegarde/i);
});

test('cas illustratifs, visuels fictifs et outil de soldes ne deviennent pas un essai éditeur', () => {
  assert.doesNotMatch(guide, /Rejoué sur le jeu fictif|sortie obtenue par la règle/);
  assert.match(guide, /Cas illustratifs sur données fictives/);
  assert.match(guide, /aucun essai dans le logiciel éditeur/);
  assert.match(get('rapprochement-bancaire-sage').tool.label, /soldes fictifs/);
  assert.match(read('src/layouts/Service.astro'), /pas l’appariement des mouvements/);
});
