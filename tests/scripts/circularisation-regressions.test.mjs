import test from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../../src/lib/circularisation.mjs';

for(const patch of [{referenceDate:'2026-06-30'},{currency:'USD'},{requestedAmount:'110'}]) test(`R1 invalidates comparison ${JSON.stringify(patch)}`,()=>{
 let s=c.reconcileResponse(c.demoSession(),'001');
 const original=structuredClone(s.tiers[0]);
 s=c.updateTier(s,'001',{...patch,note:'Correction conservée'});
 assert.equal(c.compareResponse(s.tiers[0]).evaluated,false);
 assert.throws(()=>c.reconcileResponse(s,'001'));
 assert.deepEqual(s.tiers[0].history.find(h=>h.type==='response-added').details,original.history.find(h=>h.type==='response-added').details);
 assert.equal(s.tiers[0].notes.at(-1).text,'Correction conservée');
 s=c.addResponse(s,'001',{date:'2026-07-01',amount:'120',currency:s.tiers[0].currency,comparable:true,comment:'Nouvelle déclaration sur la base corrigée'});
 s=c.reconcileResponse(s,'001');
 assert.deepEqual(c.importSession(c.exportSession(s)),s);
});

for(const count of [25000,100000]) test(`R2 ${count} tiers and complete work roundtrip`,()=>{
 const headers=['id','category','recipient','contact','referenceDate','currency','requestedAmount','confirmationType'];
 const csv=headers.join(';')+'\n'+Array.from({length:count},(_,i)=>`${i};client;Fictif ${i};Adresse fictive;2026-01-01;EUR;100;closed`).join('\n');
 assert.ok(Buffer.byteLength(csv)<c.MAX_BYTES);
 let s=c.importCsv(c.createSession({preparer:'Préparateur fictif'}),c.parseCsv(csv,{delimiter:';'}),{mapping:Object.fromEntries(headers.map(h=>[h,h])),selectedRows:Array.from({length:count},(_,i)=>i),selectionValidated:true});
 s=c.updateTier(s,'0',{note:'Note à conserver',sentDate:'2026-01-10'});
 s=c.generateLetter(s,'0',{returnContact:'Retour fictif',validated:true,amountValidated:true}).session;
 s=c.addResponse(s,'0',{date:'2026-01-11',amount:'120',comparable:true});
 s=c.reconcileResponse(s,'0');
 s=c.updateParameters(s,{reminderDelayDays:30});
 const files=c.exportSessionFiles(s);
 assert.ok(files.length>1);
 assert.ok(files.every(f=>Buffer.byteLength(f.text)<=c.MAX_BYTES));
 assert.deepEqual(c.importSessionFiles(files.map(f=>f.text).reverse()),s);
 assert.throws(()=>c.importSessionFiles(files.slice(1).map(f=>f.text)),/partie|incompl/i);
 assert.throws(()=>c.importSessionFiles([files[0].text,...files.map(f=>f.text)]),/partie|dupli/i);
 assert.throws(()=>c.importSessionFiles(files.map(f=>f.text),{current:s}),/confirm/i);
 assert.deepEqual(c.importSessionFiles(files.map(f=>f.text),{current:s,replaceConfirmed:true}),s);
});
