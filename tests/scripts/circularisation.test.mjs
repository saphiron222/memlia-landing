import test from 'node:test';
import assert from 'node:assert/strict';
import * as c from '../../src/lib/circularisation.mjs';
const input = (id='001', more={}) => ({id, category:'client', recipient:'Tiers fictif', contact:'Adresse fictive', missionRef:'M01', referenceDate:'2026-01-01', currency:'EUR', requestedAmount:'100', confirmationType:'closed', selected:true, ...more});
const sent = () => c.updateTier(c.addTier(c.createSession(), input()), '001', {sentDate:'2026-01-10'});

test('1: exact +20 and unanswered is not zero', () => {
 let s=c.addTier(sent(), input('002')); s=c.addResponse(s,'001',{date:'2026-01-11',amount:'120',currency:'EUR',comparable:true,reference:'R1'});
 assert.equal(c.compareResponse(s.tiers[0]).difference,'20'); assert.equal(c.compareResponse(s.tiers[1]).evaluated,false);
 assert.equal(c.compareAmounts('9007199254740993.10','9007199254740993.30'), '0.2');
 assert.equal(c.compareAmounts('0.1','0.3'),'0.2');
});
test('2/3: validated letters, open hides amount, generation never sends', () => {
 let s=c.addTier(c.createSession(),input('001',{requestedAmount:'987654.32',confirmationType:'open'}));
 assert.throws(()=>c.generateLetter(s,'001',{}),/valid|retour/i);
 let out=c.generateLetter(s,'001',{returnContact:'Cabinet, adresse de retour',validated:true});
 assert.ok(!out.letter.text.includes('987654')); assert.equal(out.session.tiers[0].status,'prepared'); assert.equal(c.reminderEligible(out.session.tiers[0],{asOf:'2026-03-01',delayDays:15}).eligible,false);
 s=c.addTier(c.createSession(),input()); assert.throws(()=>c.generateLetter(s,'001',{returnContact:'Cabinet',validated:true}),/solde/i);
 out=c.generateLetter(s,'001',{returnContact:'Cabinet',validated:true,amountValidated:true}); assert.match(out.letter.text,/100 EUR/);
 out=c.generateLetter(out.session,'001',{returnContact:'Cabinet',validated:true,amountValidated:true}); assert.equal(out.session.tiers[0].letters.length,2);
});
test('4/5: received distinct from reconciled, suspend all responses, no FX', () => {
 for(const kind of ['confirmation','refusal','disagreement']) {
 let s=c.addResponse(sent(),'001',{date:'2026-01-11',kind,amount:'120',currency:'USD',comparable:true});
 assert.equal(c.reminderEligible(s.tiers[0],{asOf:'2026-02-01',delayDays:15}).eligible,false);
 assert.equal(c.compareResponse(s.tiers[0]).evaluated,false);
 if(kind==='confirmation') { assert.equal(s.tiers[0].status,'received'); assert.match(c.compareResponse(s.tiers[0]).reason,/devise/i); }
 }
 let s=c.addResponse(sent(),'001',{date:'2026-01-11',amount:'120',currency:'EUR',comparable:true}); s=c.reconcileResponse(s,'001'); assert.equal(s.tiers[0].status,'reconciled');
});
test('6: duplicates, dates, mutation and note/history preservation', () => {
 let s=c.addTier(c.createSession(),input('001',{note:'première note'})); assert.throws(()=>c.addTier(s,input()),/doublon/i);
 assert.throws(()=>c.addTier(s,input('002',{referenceDate:'2026-02-30'})),/date/i);
 assert.throws(()=>c.addResponse(sent(),'001',{date:'2026-01-09'}),/avant/i);
 const next=c.updateTier(s,'001',{recipient:'Correction',note:'nouvelle note'}); assert.equal(s.tiers[0].recipient,'Tiers fictif'); assert.equal(next.tiers[0].notes.length,2); assert.equal(next.tiers[0].history.length,2);
 assert.throws(()=>c.updateTier(next,'001',{history:[]}),/champ/i);
 assert.throws(()=>c.updateTier(sent(),'001',{sentDate:''}),/envoi/i);
});
test('7: strict versioned roundtrip, explicit replacement/reset, no silent merge', () => {
 let s=c.demoSession(); const json=c.exportSession(s); assert.deepEqual(c.importSession(json),s);
 assert.throws(()=>c.importSession(json,{current:s}),/confirm/i);
 assert.deepEqual(c.importSession(json,{current:s,replaceConfirmed:true}),s);
 assert.throws(()=>c.resetSession(s),/confirm/i); assert.equal(c.resetSession(s,{confirmed:true}).tiers.length,0);
 for(const edit of [x=>x.version='future',x=>x.unknown=1,x=>x.tiers[0].status='bogus',x=>x.tiers.push(x.tiers[0]),x=>x.tiers[0].responses[0].date='2026-01-01']) {
 const x=JSON.parse(json); edit(x); assert.throws(()=>c.importSession(JSON.stringify(x)));
 }
});
test('8: BOM CSV complete and neutralized; HTML escaped and real metadata', () => {
 let s=c.addTier(c.createSession({preparer:'<p>',reviewer:'=HYPERLINK()'}),input('001',{recipient:'<script>alert(1)</script>',note:'=HYPERLINK("x")'}));
 let out=c.generateLetter(s,'001',{returnContact:'Cabinet',validated:true,amountValidated:true}); s=c.updateTier(out.session,'001',{sentDate:'2026-01-10'}); s=c.addResponse(s,'001',{date:'2026-01-11',amount:'120',currency:'EUR',comparable:true,comment:'@danger'});
 const csv=c.exportCsv(s); assert.ok(csv.startsWith('\uFEFF')); assert.match(csv,/'=HYPERLINK/); assert.match(csv,/letters|lettres/); assert.match(csv,/'@danger/);
 const before=Date.now(); const html=c.printReport(s); assert.ok(!html.includes('<script>')); assert.match(html,/&lt;script&gt;/); assert.match(html,/méthode|Méthode/); assert.match(html,/Limites/); assert.match(html,/Préparateur/); assert.match(html,/Réviseur/);
 const stamp=html.match(/data-generated-at="([^"]+)"/)[1]; assert.ok(Date.parse(stamp)>=before); assert.match(csv,/circulation|circularisation/);
});
test('bounded reminders and explicit nonresponse', () => {
 const t=sent().tiers[0]; assert.equal(c.reminderEligible(t,{asOf:'2026-01-25',delayDays:15}).eligible,true); assert.equal(c.reminderEligible(t,{asOf:'2026-01-24',delayDays:15}).eligible,false);
 for(const delayDays of [0,-1,366,1.5]) assert.throws(()=>c.reminderEligible(t,{asOf:'2026-01-25',delayDays}));
 assert.equal(c.updateTier(sent(),'001',{status:'non-response'}).tiers[0].status,'non-response');
});
test('CSV mapping preview, selection, limits and quoted multiline', () => {
 const text='code;nom;date;devise;type;notes\n001;"Fictif; A";2026-01-01;EUR;open;"ligne 1\nligne 2"\n002;B;2026-01-01;EUR;closed;x';
 const mapping={id:'code',recipient:'nom',referenceDate:'date',currency:'devise',confirmationType:'type',note:'notes'};
 const parsed=c.parseCsv(text,{delimiter:';'}); const preview=c.previewCsv(parsed,{mapping,defaults:{category:'client',contact:'Adresse'}}); assert.equal(preview.total,2); assert.equal(preview.rows[0].tier.id,'001'); assert.equal(preview.rows[0].valid,true);
 assert.throws(()=>c.importCsv(c.createSession(),parsed,{mapping}),/sélection/i);
 const s=c.importCsv(c.createSession(),parsed,{mapping,defaults:{category:'client',contact:'Adresse'},selectedRows:[0],selectionValidated:true}); assert.equal(s.tiers.length,1); assert.equal(s.tiers[0].notes[0].text,'ligne 1\nligne 2');
 assert.throws(()=>c.parseCsv('a'.repeat(c.MAX_BYTES+1),{delimiter:';'}),/20 Mo/);
 assert.throws(()=>c.parseCsv('a;b\n'+'x;y\n'.repeat(100001),{delimiter:';'}),/100 000/);
 assert.throws(()=>c.parseCsv('a;b\n"bad;b',{delimiter:';'}),/guillemet/);
 assert.throws(()=>c.previewCsv(parsed,{mapping:{id:'absent'}}),/mapping/i);
});
test('Worker: actual Node thread parsing, full-size acceptance, cancellation and refusal', async () => {
 const {Worker}=await import('node:worker_threads');
 const {startCsvWorkerJob}=await import('../../src/lib/circularisation-worker.mjs');
 class NodeWorkerAdapter {
  constructor(url) {
   this.worker=new Worker(`const {parentPort}=require('node:worker_threads'); const loaded=import(${JSON.stringify(url.href)}); parentPort.on('message', async request=>{try{const m=await loaded;parentPort.postMessage({complete:true,data:await m.executeWorkerRequest(request)});}catch(e){parentPort.postMessage({complete:false,error:e.message});}});`,{eval:true});
   this.worker.on('message',data=>this.onmessage?.({data})); this.worker.on('error',e=>this.onerror?.(e));
  }
  postMessage(request){this.worker.postMessage(request);}
  terminate(){return this.worker.terminate();}
 }
 const opts={WorkerClass:NodeWorkerAdapter};
 const successful=await startCsvWorkerJob({operation:'parse',text:'code;nom\n001;A',delimiter:';'},opts).promise;
 assert.equal(successful.complete,true); assert.equal(successful.data.rows[0][0],'001');
 const request={text:'id;recipient;contact;category;referenceDate;currency;confirmationType\n001;Fictif;Adresse;client;2026-01-01;EUR;open',delimiter:';',mapping:Object.fromEntries(['id','recipient','contact','category','referenceDate','currency','confirmationType'].map(f=>[f,f]))};
 const preview=await startCsvWorkerJob({...request,operation:'preview'},opts).promise; assert.equal(preview.data.preview.rows[0].valid,true);
 const imported=await startCsvWorkerJob({...request,operation:'import',session:c.createSession(),selectedRows:[0],selectionValidated:true},opts).promise;
 assert.equal(imported.data.tiers[0].id,'001'); assert.equal(imported.data.tiers[0].selected,true);
 const full=await startCsvWorkerJob({operation:'parse',text:'a;b\n'+'x;y\n'.repeat(100000),delimiter:';'},opts).promise;
 assert.equal(full.data.rows.length,100000);
 await assert.rejects(startCsvWorkerJob({operation:'parse',text:'a;b\n'+'x;y\n'.repeat(100001),delimiter:';'},opts).promise,/100 000/);
 const cancelled=startCsvWorkerJob({operation:'parse',text:'a;b\n'+'x;y\n'.repeat(100000),delimiter:';'},opts); cancelled.cancel();
 const result=await cancelled.promise; assert.deepEqual(result,{complete:false,cancelled:true,data:null}); assert.throws(()=>c.exportCsv(result),/Structure/);
 const controller=new AbortController(); controller.abort(); assert.equal((await startCsvWorkerJob({operation:'parse'}, {...opts,signal:controller.signal}).promise).complete,false);
 await assert.rejects(startCsvWorkerJob({operation:'parse',file:{size:c.MAX_BYTES+1},delimiter:';'},opts).promise,/20 Mo/);
});
test('correction after reconciliation retains original validation in history and requires revalidation', () => {
 let s=c.reconcileResponse(c.addResponse(sent(),'001',{date:'2026-01-11',amount:'120',currency:'EUR',comparable:true}),'001');
 s=c.updateTier(s,'001',{requestedAmount:'110',note:'Correction de base'});
 assert.equal(s.tiers[0].status,'received'); assert.equal(s.tiers[0].responses[0].reconciled,false);
 assert.equal(s.tiers[0].history.find(e=>e.type==='response-reconciled').details.comparison.difference,'20');
 assert.deepEqual(c.importSession(c.exportSession(s)),s);
 assert.throws(()=>c.reconcileResponse(s,'001'),/comparable/i);
 s=c.addResponse(s,'001',{date:'2026-01-12',amount:'120',currency:'EUR',comparable:true});
 s=c.reconcileResponse(s,'001'); assert.equal(c.compareResponse(s.tiers[0]).difference,'10');
 assert.equal(s.tiers[0].history.filter(e=>e.type==='response-reconciled').length,2);
});
test('CSV record width, all trail rows, exact lexical controls and strict malicious imports', () => {
 const s=c.demoSession(); const parsed=c.parseCsv(c.exportCsv(s),{delimiter:';'}); assert.ok(parsed.rows.some(r=>r[0]==='letter')); assert.ok(parsed.rows.some(r=>r[0]==='response')); assert.ok(parsed.rows.some(r=>r[0]==='note'));
 for(const x of ['1e2','1 000','NaN','0x10',100]) assert.throws(()=>c.compareAmounts(x,'120'));
 assert.equal(c.compareAmounts('-10,50','-8,25'),'2.25'); assert.equal(c.compareAmounts('100','100'),'0');
 const source=c.exportSession(s);
 for(const mutate of [x=>x.tiers[0].responses[0].extra=1,x=>x.tiers[0].notes[0].at='bad',x=>x.tiers[0].letters[0].validated=false,x=>x.complete=false,x=>x.tiers[0].history[0].details.extra=1]) {const x=JSON.parse(source); mutate(x); assert.throws(()=>c.importSession(JSON.stringify(x)));}
 assert.throws(()=>c.importSession(source.replace('"schemaVersion": 1','"schemaVersion": 2, "schemaVersion": 1')),/dupliquée/);
 assert.throws(()=>c.importSession(source,{current:c.createSession()}),/confirm/i);
 assert.throws(()=>c.importSession(source.replace('"metadata": {','"metadata": {"__proto__": {},')));
 let next=c.addResponse(s,'001',{date:'2026-01-12',amount:'121',currency:'EUR',comparable:true,comment:'Correction déclarée par une nouvelle réponse'}); assert.equal(next.tiers[0].responses.length,2); assert.equal(s.tiers[0].responses.length,1);
 assert.equal(c.compareResponse(next.tiers[0],1).difference,'20'); assert.equal(c.compareResponse(next.tiers[0]).difference,'21');
});
test('no storage/network calls in module or worker', async () => {
 const {readFile}=await import('node:fs/promises');
 for(const file of ['circularisation.mjs','circularisation-worker.mjs']) { const source=await readFile(new URL('../../src/lib/'+file,import.meta.url),'utf8'); assert.doesNotMatch(source,/\b(fetch|XMLHttpRequest|localStorage|sessionStorage|indexedDB|sendBeacon)\b/); }
});
