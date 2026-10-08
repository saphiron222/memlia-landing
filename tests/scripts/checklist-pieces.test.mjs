import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../../src/lib/checklist-pieces.mjs';

test('quatre états : demande exacte et inconnu séparé',()=>{
 const s=m.demoSession(),r=m.result(s);
 assert.equal(r.missing.length,1);assert.equal(r.unknown.length,1);
 assert.match(r.message,/Relevé bancaire de septembre/);
 for(const label of ['Factures d’achat','Justificatif d’acquisition','Récapitulatif de paie']) assert.ok(!r.message.includes(label));
 assert.equal(r.complete,false);
});
test('toutes reçues : terminé, pas de relance ; vide distinct',()=>{
 const s=m.demoSession();s.items.forEach(i=>i.state='received');
 assert.equal(m.result(s).complete,true);assert.equal(m.result(s).message,'');
 assert.equal(m.result(m.createSession()).complete,false);
});
test('ajout et suppression conservés dans toutes les sorties',()=>{
 let s=m.addItem(m.createSession(),{family:'libre',label:'Pièce libre',state:'missing',note:''});
 assert.match(m.result(s).message,/Pièce libre/);assert.match(m.exportCsv(s),/Pièce libre/);
 s=m.removeItem(s,s.items[0].id);assert.equal(s.items.length,0);assert.equal(m.result(s).message,'');
});
test('reprise JSON stricte, sans muter la session',()=>{
 const s=m.demoSession(),before=structuredClone(s);
 assert.deepEqual(m.importJson(m.exportJson(s)),s);
 for(const change of [{version:2},{extra:'unexpected'},{mode:'fiscal'},{items:[{...s.items[0],state:'maybe'}]}]) assert.throws(()=>m.importJson(JSON.stringify({...s,...change})));
 assert.deepEqual(s,before);
});
for(const [field,values] of [['state',[['missing'],['unknown'],{},1,null]],['family',[['banque'],{},1,null]]]){
 for(const value of values)test(`enum ${field} non textuel refusé : ${JSON.stringify(value)}`,()=>{
  const s=m.demoSession();s.items=[{...s.items[1],[field]:value}];const before=structuredClone(s);
  assert.throws(()=>m.importJson(JSON.stringify(s)),/Famille ou état inconnu/);
  assert.throws(()=>m.result(s),/Famille ou état inconnu/);
  assert.deepEqual(s,before);
 });
}
test('quatre états textuels et reprises JSON/CSV restent exacts',()=>{
 for(const state of ['received','missing','na','unknown']){
  const s=m.demoSession();s.items=[{...s.items[1],state}];
  for(const restored of [m.importJson(m.exportJson(s)),m.importCsv(m.exportCsv(s))]){
   assert.deepEqual(restored,s);const r=m.result(restored);
   assert.equal(r.complete,state==='received'||state==='na');
   assert.deepEqual(r.missing,state==='missing'?s.items:[]);
   assert.deepEqual(r.unknown,state==='unknown'?s.items:[]);
   assert.equal(Boolean(r.message),state==='missing');
  }
 }
});
test('CSV neutralisé et réimport exact, guillemets, multiligne, apostrophe native',()=>{
 const s=m.demoSession();s.period='=1+1';s.items[0].label='@SUM(1;2)';s.items[0].note='Texte; "cité"\nligne suivante';s.items[1].label="'=original";
 const csv=m.exportCsv(s);assert.ok(csv.startsWith('\ufeff'));assert.match(csv,/'@SUM/);
 assert.deepEqual(m.importCsv(csv,';'),s);assert.deepEqual(m.importCsv(m.exportCsv(m.createSession()),';'),m.createSession());
 assert.throws(()=>m.importCsv(csv.replace('received','bad'),';'));
});
test('HTML échappé et message texte sans interprétation',()=>{
 const s=m.demoSession();s.items[1].label='<img src=x onerror=alert(1)>';
 assert.match(m.printHtml(s),/&lt;img/);assert.ok(!m.printHtml(s).includes('<img'));
 assert.match(m.result(s).message,/<img/);
});
test('100 accepté, 101 refusé ; libellé absent refusé',()=>{
 let s=m.createSession();for(let i=0;i<100;i++)s=m.addItem(s,{family:'libre',label:String(i),state:'unknown',note:''});
 assert.equal(s.items.length,100);assert.throws(()=>m.addItem(s,{family:'libre',label:'101',state:'unknown',note:''}),/100/);
 assert.throws(()=>m.addItem(m.createSession(),{family:'libre',label:' ',state:'unknown',note:''}));
});
test('trame ajoutée sans remplacer ni reclasser les saisies',()=>{
 const s=m.demoSession(),n=m.addFamilies(s,['ventes','social']);assert.deepEqual(n.items.slice(0,4),s.items);
 assert.equal(n.items.at(-1).state,'unknown');assert.equal(m.addFamilies(n,['ventes','social']).items.length,n.items.length);
});
test('date organisationnelle valide, pas date fiscale calculée',()=>{
 const s=m.demoSession();assert.throws(()=>m.validate({...s,deadline:'2026-02-30'}));
 s.deadline='2026-10-15';assert.match(m.result(s).message,/2026-10-15/);
});
test('doublons, JSON non objet, tailles, CSV invalide refusés',()=>{
 assert.throws(()=>m.importJson('[]'));assert.throws(()=>m.importJson('{}'));assert.throws(()=>m.importJson(' '.repeat(m.MAX_BYTES+1)));
 const s=m.demoSession();s.items[1].id=s.items[0].id;assert.throws(()=>m.validate(s));
 assert.throws(()=>m.importCsv('a;b\n"oops;b',';'));
});
