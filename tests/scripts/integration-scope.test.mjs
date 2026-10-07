import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INTEGRATIONS, INTEGRATIONS_HISTORIQUES, generatedGuides } from '../helpers/integration-data.mjs';

const read = (path) => readFileSync(path, 'utf8');

const guide = read('src/pages/integrations/[slug].astro');
const get = (slug) => INTEGRATIONS.find((entry) => entry.slug === slug);

test('guides historiques et scellés : chaque champ explique un rôle et sa condition de contrôle', () => {
  assert.equal(INTEGRATIONS_HISTORIQUES.length, 9);
  assert.deepEqual(INTEGRATIONS, [...INTEGRATIONS_HISTORIQUES, ...generatedGuides]);
  for (const entry of INTEGRATIONS) {
    assert.ok(entry.documentScope.length > 80, entry.slug);
    assert.ok(entry.fields.every((field) => field.label && field.control.length > 40), entry.slug);
    assert.equal(new Set(entry.fields.map((field) => field.control)).size, entry.fields.length, entry.slug);
    if (INTEGRATIONS_HISTORIQUES.includes(entry)) assert.equal(entry.source.checkedAt, '2026-10-04');
    else assert.match(entry.source.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
  }
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
