import test from 'node:test';
import assert from 'node:assert/strict';
import { parseDelimited, decodeFile, transform, serializeCsv, defaultActions, MAX_BYTES } from '../../src/lib/pseudonymisation.mjs';

const text = 'Nom;Libelle;Date;Montant\r\nAlice;"Mail alice@example.test\npièce";20261004;9876\r\nAlice;Facture;20261005;10\r\nBob;Facture;20261006;20';
test('alias cohérents, valeurs distinctes et original intact', () => {
  const original = parseDelimited(text, ';'); const before = structuredClone(original);
  const result = transform(original, ['alias', 'remove', 'keep', 'keep']);
  assert.deepEqual(original, before);
  assert.deepEqual(result.rows.map(r => r[0]), ['C1_000001', 'C1_000001', 'C1_000002']);
  assert.equal(result.rows[0].length, 3);
  assert.ok(!serializeCsv([result.headers, ...result.rows]).includes('Alice'));
  assert.equal(result.mapping[0][2], 'Alice');
  assert.ok(result.risks.some(r => r.includes('réidentification')));
});
test('champs libres retirés par défaut et alerte si conservés', () => {
  const data = parseDelimited(text, ';');
  assert.equal(defaultActions(data.headers)[1], 'remove');
  const r = transform(data, ['alias','keep','keep','keep']);
  assert.ok(r.risks.some(r => r.includes('email')));
  assert.ok(r.risks.some(r => r.includes('libre')));
});
test('BOM, accents, guillemets et retours ligne roundtrip', () => {
  const data = parseDelimited('\uFEFFNom;Texte\r\nÉlodie;"a; b ""c""\nfin"\r\n', ';');
  assert.deepEqual(parseDelimited(serializeCsv([data.headers, ...data.rows]), ';'), data);
  assert.equal(data.rows[0][1], 'a; b "c"\nfin');
});
test('refus fermé des entrées ambiguës, binaires et irrégulières', () => {
  for (const bad of ['A;A\n1;2', 'A;B\n1', 'A;B\n"x;2', 'A;B\n"x"z;2', 'A\n\u0000']) assert.throws(() => parseDelimited(bad, ';'));
  assert.throws(() => parseDelimited('A\n1', ','));
  assert.throws(() => decodeFile(new Uint8Array([0xff,0xfe,0x61,0]), 'utf-8'));
  assert.throws(() => decodeFile(new Uint8Array([0xe9]), 'utf-8'));
  assert.equal(decodeFile(new Uint8Array([0xe9]), 'windows-1252'), 'é');
  assert.throws(() => decodeFile(new Uint8Array(MAX_BYTES + 1), 'utf-8'));
});
test('neutralisation explicite des formules, contrôles et en-têtes', () => {
  const csv = serializeCsv([['=Nom','Valeur'], ['=HYPERLINK("x")',' +1'], ['\t@sum(1)','-45']]);
  const data = parseDelimited(csv, ';');
  assert.equal(data.headers[0], "'=Nom");
  assert.equal(data.rows[0][0], "'=HYPERLINK(\"x\")");
  assert.equal(data.rows[1][1], "'-45");
});
test('aucune colonne conservée refuse export, actions invalides refusées, vide sans alias', () => {
  const d = parseDelimited('Nom;Montant\n;3', ';');
  assert.throws(() => transform(d, ['remove','remove']));
  assert.throws(() => transform(d, ['keep']));
  assert.throws(() => transform(d, ['wrong','keep']));
  assert.equal(transform(d, ['alias','keep']).rows[0][0], '');
});
