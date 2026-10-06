import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import { calculate, example, EXCLUSIONS, restore, save, csv, report } from '../../src/lib/bareme-heures-cac.mjs';
const bounds = [[305000,20,35],[760000,30,50],[1525000,40,60],[3050000,50,80],[7622000,70,120],[15245000,100,200],[45735000,180,360],[122000000,300,700]];
const withBase = v => ({...example(), balance:v, operating:'0', financial:'0'});
test('official grid: all boundaries and adjacent cent',()=>{
 for(const [i,[b,min,max]] of bounds.entries()) {
  assert.deepEqual(calculate(withBase((b-0.01).toFixed(2))).range,[min,max]);
  const exact=calculate(withBase(String(b)));
  if(i<7) { assert.equal(exact.status,'boundary'); assert.equal(exact.range,null); }
  else assert.deepEqual(exact.range,[300,700]);
  const above=calculate(withBase((b+0.01).toFixed(2)));
  if(i<7) assert.deepEqual(above.range,bounds[i+1].slice(1));
  else {assert.equal(above.status,'excluded');assert.equal(above.range,null);}
 }
 assert.deepEqual(calculate(withBase('0')).range,[20,35]);
});
test('exact decomposition; budget separate',()=>{
 const r=calculate(example());assert.equal(r.base,'260000.00');assert.deepEqual(r.range,[20,35]);assert.equal(r.budget,'42');
 assert.equal(calculate({...example(),balance:'0.10',operating:'0.20',financial:'0.01'}).base,'0.31');
});
test('all exclusions and unknown suspend',()=>{
 for(const {id} of EXCLUSIONS) for(const answer of ['yes','unknown']) {
  const input=example();input.exclusions[id]=answer;assert.equal(calculate(input).range,null);
 }
 for(const mission of ['unknown','consolidated','durability','other','small-audit']) assert.equal(calculate({...example(),mission}).range,null);
 for(const derogation of ['unknown','requested']) assert.equal(calculate({...example(),derogation}).range,null);
});
test('alert applies to programme, never interval',()=>{
 const input={...example(),alert:true,alertRate:'25',programme:'40'};
 const r=calculate(input);assert.deepEqual(r.range,[20,35]);assert.equal(r.alertHours,'50.00');
 assert.throws(()=>calculate({...input,alertRate:'33.34'}));
 assert.equal(calculate({...input,alertRate:'1/3'}).alertHours,'160/3');
 assert.equal(calculate({...input,alert:false}).alertHours,null);
});
test('reject ambiguity, unit, negatives, missing',()=>{
 for(const balance of ['-1','1 000','1e6','1.000,50','12k','1.234','NaN','']) assert.throws(()=>calculate({...example(),balance}));
 assert.throws(()=>calculate({...example(),unit:'kEUR'}));assert.throws(()=>calculate({...example(),exclusions:{}}));assert.throws(()=>calculate({...example(),period:''}));
});
test('reprise, safe CSV, inert HTML',()=>{
 const input={...example(),notes:'=HYPERLINK("https://example.com")<script>alert(1)</script>',missionRef:'001'};
 const encoded=save(input);assert.deepEqual(restore(encoded),input);
 assert.ok(csv(input).startsWith('\ufeff'));assert.ok(csv(input).includes("'=HYPERLINK"));
 assert.ok(!report(input).includes('<script>'));assert.ok(report(input).includes('&lt;script&gt;'));
 assert.throws(()=>restore(encoded.replace('bareme-heures-cac-1','future')));assert.throws(()=>restore('{"version":"bareme-heures-cac-1","input":{}}'));assert.throws(()=>restore('x'.repeat(20000001)));
});
test('official transcript, proof fixture and export provenance',()=>{
 const source=readFileSync(new URL('../../docs/strategy/site-v3/cac/outils/sources/D821-188.md',import.meta.url),'utf8');
 for(const [bound,min,max] of bounds) {
  assert.ok(source.includes(String(bound).replace(/\B(?=(\d{3})+(?!\d))/g,' ')));
  assert.ok(source.includes(`${min} à ${max} heures`));
 }
 const html=readFileSync(new URL('../../docs/design/bareme-cac-proof/index.html',import.meta.url),'utf8');
 assert.match(html,/<section class="frame"[^>]+aria-label=/);
 assert.doesNotMatch(html,/logo|Memlia|partenariat|2026-10|mise à jour/i);
 for(const value of ['100 000 €','150 000 €','10 000 €','260 000 €','20 à 35 h','42 h'])assert.ok(html.includes(value));
 const backup=JSON.parse(save(example()));assert.ok(backup.generatedAt);assert.ok(backup.checks.length);assert.deepEqual(backup.result.range,[20,35]);
 const modified={...backup,result:{range:[1,999]}};assert.deepEqual(calculate(restore(JSON.stringify(modified))).range,[20,35]);
});
