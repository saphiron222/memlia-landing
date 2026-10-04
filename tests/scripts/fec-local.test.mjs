import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeFec, FIELDS, MAX_BYTES, exampleFec, reportCsv, decodeFec } from '../../src/lib/fec-local.mjs';
const row = (changes = {}) => ['AC','Achats','0001','20260101','060600','Fournitures','','','P001','20260101','Écriture fictive','10,00','0,00','','','20260101','',''].map((v,i) => changes[i] ?? v).join('|');
const text = (...rows) => FIELDS.join('|')+'\r\n'+rows.join('\r\n');
test('nominal, zéros initiaux et accents sans mutation', () => {
  const input = text(row()); const r = analyzeFec(input);
  assert.equal(r.state,'complete'); assert.equal(r.anomalies.length,0); assert.equal(input,text(row()));
  assert.equal(r.rules.find(x=>x.id==='equilibre').status,'non évalué');
});
test('date impossible ligne 4, champ et règle', () => {
  const r = analyzeFec(text(row(),row(),row({3:'20260230'})));
  assert.deepEqual(r.anomalies.map(x=>[x.line,x.column,x.rule]),[[4,'EcritureDate','date']]);
});
test('en-tête déplacé : seulement en-tête évalué, pas interprétation de mauvaises colonnes', () => {
  const h = [...FIELDS]; [h[0],h[1]]=[h[1],h[0]];
  const r=analyzeFec(h.join('|')+'\n'+row());
  assert.equal(r.anomalies.length,2); assert.equal(r.anomalies[0].line,1);
  assert.equal(r.rules.find(x=>x.id==='date').status,'non évalué');
});
test('ligne courte et lignes blanches internes conservent leur index', () => {
  const r=analyzeFec(text(row(),'','AC|Achats'));
  assert.deepEqual(r.anomalies.map(x=>x.line),[3,4]);
  assert.ok(r.anomalies.every(x=>x.rule==='largeur'));
});
test('dates calendrier, champs obligatoires et décimaux signés sans coercition', () => {
  const r=analyzeFec(text(row({0:' ',3:'20260229',11:'1 000,00',12:'1,2.3',15:'00000000'})));
  assert.equal(r.anomalies.length,5);
  assert.equal(analyzeFec(text(row({3:'20240229',11:'-12345678901234567890,12345',12:'+0.00'}))).anomalies.length,0);
});
test('profils alternatifs et binaires non évalués', () => {
  for(const input of ['JournalCode|Montant|Sens\nAC|12|D','PK\u0000binary','<?xml version="1.0"?>']) {
    const r=analyzeFec(input); assert.equal(r.state,'unsupported'); assert.equal(r.anomalies.length,0);
  }
});
test('limite avant lecture, encodage choisi explicite et BOM', () => {
  assert.throws(()=>decodeFec(new Uint8Array(MAX_BYTES+1)),/20 Mo/);
  assert.equal(analyzeFec(decodeFec(new TextEncoder().encode('\uFEFF'+text(row())))).anomalies.length,0);
  const cp=new Uint8Array([0xc9]); assert.equal(decodeFec(cp,'windows-1252'),'É');
  assert.throws(()=>decodeFec(cp,'utf-8'),/encodage/);
});
test('300 anomalies : total/export complet, texte neutre contre les formules', () => {
  const r=analyzeFec(text(...Array.from({length:300},()=>row({3:'20260230'}))));
  assert.equal(r.anomalies.length,300);
  assert.equal(reportCsv(r).split('\r\n').filter(x=>x.includes('"anomalie"')).length,300);
  const formula=analyzeFec(FIELDS.map((x,i)=>i===0?'=HYPERLINK("x")':x).join('|'));
  assert.ok(reportCsv(formula).includes("'=HYPERLINK"));
});
test('exemple démontre réellement la date impossible ligne 4', () => {
  const r=analyzeFec(exampleFec()); assert.deepEqual(r.anomalies.map(x=>[x.line,x.column]),[[4,'EcritureDate']]);
});
