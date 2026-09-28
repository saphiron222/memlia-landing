import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const path = resolve(import.meta.dirname, '../../docs/strategy/site-v3/mesures/titres-intent-2026-09-28.json');
const mesure = JSON.parse(readFileSync(path, 'utf8'));

test('le relevé W39 conserve les métadonnées, les mesures antérieures et la provenance CRM DSN', () => {
  assert.equal(mesure.measuredAt, '2026-09-28T02:29:05.947Z');
  assert.equal(mesure.market, 'France');
  assert.equal(mesure.instrument, 'Google suggest hl=fr gl=fr');
  assert.deepEqual(mesure.autocompletion['crm dsn'], mesure.provenance['crm dsn'].rawResponse[1]);
  assert.equal(mesure.provenance['crm dsn'].capturedAt, '2026-09-28T02:51:55Z');
  assert.equal(mesure.provenance['crm dsn'].url, 'https://suggestqueries.google.com/complete/search?client=firefox&hl=fr&gl=fr&q=crm%20dsn');
  for (const requete of [
    'relance pièces manquantes cabinet comptable', 'automatisation saisie comptable',
    'automatisation cabinet comptable', 'comptes rendus métier DSN',
    'contrôle bulletin de paie', 'pourquoi les cabinets comptables n’adoptent pas les nouveaux outils',
    'tableau de bord paie excel',
  ]) assert.ok(Object.hasOwn(mesure.autocompletion, requete), `mesure antérieure effacée : ${requete}`);
  for (const requete of [
    'logiciel ia comptabilite', 'prompt chatgpt expert comptable',
    'pourquoi des tests verts peuvent manquer des défauts',
  ]) assert.ok(Object.hasOwn(mesure.autocompletion, requete), `mesure W39 absente : ${requete}`);
});
