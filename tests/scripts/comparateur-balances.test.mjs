import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {Worker} from 'node:worker_threads';
import {once} from 'node:events';
import {parseBalance, compareBalances, exportComparisonCsv, EXAMPLE_PREVIOUS, EXAMPLE_CURRENT, MAX_BYTES, MAX_ROWS} from '../../src/lib/outils/comparateur-balances.mjs';
import {parseDelimited} from '../../src/lib/pseudonymisation.mjs';
const mapping={account:0,label:1,balance:2};
const parse=(text,options={})=>parseBalance(text,{mapping,...options});
const csv=(rows)=>'Compte;Libellé;Solde\n'+rows.join('\n');
const options={periodPrevious:{start:'2025-01-01',end:'2025-12-31'},periodCurrent:{start:'2026-01-01',end:'2026-12-31'},sameCurrency:true,comparable:true,absoluteThreshold:'30'};
const compare=(a,b,patch={})=>compareBalances(parse(a),parse(b),{...options,...patch});
test('exemple, zéros initiaux, signes, statuts, totaux et ordre lexical',()=>{
 const r=compare(EXAMPLE_PREVIOUS,EXAMPLE_CURRENT);
 assert.deepEqual(r.rows.map(x=>[x.account,x.previous,x.current,x.delta,x.percent,x.status,x.selected]),[['00123','10000','13000','3000','30.00','présent',true],['401','-10000','-8000','2000','20.00','présent',false],['707','0','5000','5000',null,'nouveau',true]]);
 assert.deepEqual(r.totals,{previous:'0',current:'10000',delta:'10000'});
});
test('disparu et référence zéro',()=>{
 const r=compare(csv(['401;A;5','500;B;0']),csv(['500;B;1']));
 assert.equal(r.rows[0].status,'disparu'); assert.equal(r.rows[0].percent,'-100.00'); assert.equal(r.rows[1].percent,null);
});
test('centimes exacts au-delà des floats',()=>{
 const r=compare(csv(['1;A;9007199254740993,01']),csv(['1;A;9007199254740993,02']),{absoluteThreshold:'0,01'});
 assert.equal(r.rows[0].delta,'1'); assert.equal(r.rows[0].selected,true);
});
test('débit moins crédit et mapping explicite',()=>{
 const p=parseBalance('Libellé|Crédit|Compte|Débit\nA|200,10|001|100,01',{delimiter:'|',mode:'debit-credit',mapping:{account:2,label:0,debit:3,credit:1}});
 assert.equal(p.accounts[0].cents,'-10009');
});
test('montants invalides, ambigus ou fractionnaires refusés sans arrondi',()=>{
 for(const amount of ['1,234','1.234','1 000,00','1e3','NaN','','1,2.3','0,001']) assert.throws(()=>parse(csv([`1;A;${amount}`])),/montant|centime|ambigu/i);
});
test('doublons : refus puis agrégation confirmée, libellés et provenance',()=>{
 const text=csv(['001;A;1','001;B;2']); assert.throws(()=>parse(text),/doublon|agrégation/i);
 const p=parse(text,{aggregate:true,name:'balance.csv'}); assert.deepEqual(p.accounts[0],{account:'001',label:'A',cents:'300',lines:[2,3],labels:['A','B']}); assert.equal(p.rowCount,2); assert.equal(p.name,'balance.csv'); assert.match(p.warnings.join(' '),/libellés/i);
});
test('CSV BOM, CRLF, quotes multilignes et ligne physique',()=>{
 const p=parse('\uFEFFCompte;Libellé;Solde\r\n001;"A\r\nB ""C""";1\r\n002;D;2\r\n');
 assert.equal(p.accounts[0].label,'A\r\nB "C"'); assert.deepEqual(p.accounts.map(x=>x.lines),[[2],[4]]);
});
test('CSV malformé et mapping invalide refusés',()=>{
 for(const text of ['Compte;Libellé;Solde\n1;"A;1','Compte;Libellé;Solde\n1;A','Compte;Libellé;Solde\n;A;1']) assert.throws(()=>parse(text));
 for(const m of [{account:0,label:1,balance:8},{account:0,label:1,balance:1},{account:-1,label:1,balance:2}]) assert.throws(()=>parse(csv(['1;A;1']),{mapping:m}),/mapping|colonne/i);
 assert.throws(()=>parse(csv(['1;A;1']),{mode:'inconnu'}));
});
test('seuil obligatoire, non négatif, exact et OR inclusif',()=>{
 const a=csv(['1;A;100']),b=csv(['1;A;130']);
 for(const patch of [{absoluteThreshold:'',relativeThreshold:''},{absoluteThreshold:'-1'},{relativeThreshold:'-0,1'},{relativeThreshold:'1,234'},{absoluteThreshold:30}]) assert.throws(()=>compare(a,b,patch),/seuil|montant|pourcentage/i);
 assert.equal(compare(a,b,{absoluteThreshold:'31',relativeThreshold:'30'}).rows[0].selected,true);
 assert.equal(compare(a,b,{absoluteThreshold:'31',relativeThreshold:'30,01'}).rows[0].selected,false);
 assert.equal(compare(a,b,{absoluteThreshold:'0'}).rows[0].selected,true);
});
test('seuil relatif compare ratio exact, pas pourcentage arrondi',()=>{
 const r=compare(csv(['1;A;300']),csv(['1;A;301']),{absoluteThreshold:'',relativeThreshold:'0,33'});
 assert.equal(r.rows[0].percent,'0.33'); assert.equal(r.rows[0].selected,true);
 assert.equal(compare(csv(['1;A;300']),csv(['1;A;301']),{absoluteThreshold:'',relativeThreshold:'0,34'}).rows[0].selected,false);
});
test('arrondi relatif symétrique à deux décimales et valeur absolue référence',()=>{
 const r=compare(csv(['1;A;-6','2;B;6']),csv(['1;A;-5','2;B;5']));
 assert.deepEqual(r.rows.map(x=>x.percent),['16.67','-16.67']);
});
test('dates valides, ordre et confirmations strictement obligatoires',()=>{
 const a=csv(['1;A;1']);
 for(const patch of [{sameCurrency:false},{sameCurrency:'true'},{comparable:false},{periodPrevious:undefined},{periodCurrent:{start:'2026-02-30',end:'2026-03-01'}},{periodCurrent:{start:'2026-03-01',end:'2026-02-01'}}]) assert.throws(()=>compare(a,a,patch));
});
test('durées différentes : warning persistant et conventions exportées',()=>{
 const r=compare(EXAMPLE_PREVIOUS,EXAMPLE_CURRENT,{periodCurrent:{start:'2026-01-01',end:'2026-06-30'}});
 assert.match(r.warnings.join(' '),/durée/i); assert.equal(r.conventions.comparable,true); assert.match(exportComparisonCsv(r),/durée/i);
});
test('libellé différent entre périodes signalé et sources inchangées',()=>{
 const a=parse(csv(['1;Ancien;1'])),b=parse(csv(['1;Nouveau;2'])); const snapshot=JSON.stringify([a,b]);
 const r=compareBalances(a,b,options); assert.match(r.warnings.join(' '),/libellé/i); assert.equal(JSON.stringify([a,b]),snapshot);
});
test('limites individuelles octets UTF-8 et lignes',()=>{
 assert.equal(MAX_BYTES,10_000_000); assert.equal(MAX_ROWS,20_000);
 assert.throws(()=>parse(csv([`1;${'é'.repeat(MAX_BYTES/2)};1`])),/10 Mo|octets/i);
 assert.throws(()=>parse(csv(Array.from({length:MAX_ROWS+1},(_,i)=>`${i};A;1`))),/20 000|lignes/i);
});
test('limites cumulées des deux fichiers et lignes agrégées',()=>{
 const p=parse(csv(Array(10001).fill('1;A;1')),{aggregate:true}); assert.throws(()=>compareBalances(p,structuredClone(p),options),/20 000|lignes/i);
 const q=parse(csv(Array.from({length:100},(_,i)=>`${i};${'a'.repeat(51000)};1`))); assert.throws(()=>compareBalances(q,structuredClone(q),options),/10 Mo|octets/i);
});
test('comptage physique borne aussi les cellules multilignes',()=>{
 assert.throws(()=>parse(csv([`1;"${'\n'.repeat(MAX_ROWS)}";1`])),/20 000|lignes/i);
});
test('rapport complet versionné, provenance, noms, totaux et 300 écarts',()=>{
 const a=parse(csv(['0;A;0']),{name:'N-1.csv'}),b=parse(csv(Array.from({length:300},(_,i)=>`${i};A;1`)),{name:'N.csv'});
 const r=compareBalances(a,b,options),out=exportComparisonCsv(r); const parsed=parseDelimited(out,';');
 assert.equal(r.rows.length,300); assert.match(out,/comparateur-balances-1/); assert.match(out,/N-1.csv/); assert.match(out,/N.csv/); assert.match(out,/totaux/); assert.equal(parsed.rows.filter(x=>x[0]==='compte').length,300); assert.deepEqual(r.rows.find(x=>x.account==='299').currentLines,[301]);
});
test('export neutralise formules, préserve HTML en texte et originaux',()=>{
 const p=parse(csv(['=1+1;"<img src=x onerror=alert(1)>";1']),{name:'@evil.csv'}); const r=compareBalances(p,p,options); const out=exportComparisonCsv(r);
 assert.match(out,/'=1\+1/); assert.match(out,/'@evil.csv/); assert.match(out,/<img src=x onerror=alert\(1\)>/); assert.equal(r.rows[0].account,'=1+1'); assert.match(out,/apostrophe/i);
});
test('Worker : parse, compare, erreurs et identifiant conservé',async()=>{
 const source=await readFile(new URL('../../src/lib/outils/comparateur-balances.worker.ts',import.meta.url),'utf8');
 const replies=[]; const self={postMessage:r=>replies.push(r)};
 // Le Worker volontairement sans syntaxe TS peut être exercé dans le contexte Worker.
 vm.runInNewContext(source.replace(/^import .*;\s*$/m,''),{self,parseBalance,compareBalances,Error});
 self.onmessage({data:{id:'p',type:'parse',text:EXAMPLE_PREVIOUS,options:{mapping}}});
 assert.equal(replies[0].ok,true); assert.equal(replies[0].id,'p');
 self.onmessage({data:{id:2,type:'compare',previous:replies[0].result,current:parse(EXAMPLE_CURRENT),options}}); assert.equal(replies[1].result.rows[0].delta,'3000');
 self.onmessage({data:{id:3,type:'parse',text:'bad',options:{mapping}}}); assert.equal(replies[2].ok,false); assert.equal(typeof replies[2].error,'string');
 self.onmessage({data:{id:4,type:'unknown'}}); assert.equal(replies[3].ok,false); assert.equal(replies[3].id,4);
});
test('Worker réel : transfert structured clone, aller-retour et terminate',async(t)=>{
 const source=await readFile(new URL('../../src/lib/outils/comparateur-balances.worker.ts',import.meta.url),'utf8');
 const engineUrl=new URL('../../src/lib/outils/comparateur-balances.mjs',import.meta.url).href;
 const workerSource=source.replace("'./comparateur-balances.mjs'",JSON.stringify(engineUrl));
 const bootstrap=`import {parentPort} from 'node:worker_threads';
 globalThis.self={postMessage:result=>parentPort.postMessage(result)};
 await import('data:text/javascript,'+encodeURIComponent(${JSON.stringify(workerSource)}));
 parentPort.on('message',data=>self.onmessage({data}));`;
 const worker=new Worker(new URL('data:text/javascript,'+encodeURIComponent(bootstrap)));
 t.after(()=>worker.terminate());
 const request=async data=>{const reply=once(worker,'message'); worker.postMessage(data); return (await reply)[0];};
 const a=await request({id:1,type:'parse',text:EXAMPLE_PREVIOUS,options:{mapping}});
 const b=await request({id:2,type:'parse',text:EXAMPLE_CURRENT,options:{mapping}});
 const result=await request({id:3,type:'compare',previous:a.result,current:b.result,options});
 assert.equal(result.ok,true); assert.equal(result.result.rows[0].percent,'30.00');
 assert.equal((await request({id:4,type:'parse',text:'invalid',options:{mapping}})).ok,false);
 const code=await worker.terminate(); assert.equal(typeof code,'number');
});
test('seuil zéro relatif reste non calculable sur référence zéro',()=>{
 assert.equal(compare(csv(['1;A;0']),csv(['1;A;1']),{absoluteThreshold:'',relativeThreshold:'0'}).rows[0].selected,false);
});
test('limite totale exacte de 20 000 lignes acceptée après agrégation',()=>{
 const a=parse(csv(Array(10000).fill('1;A;0,01')),{aggregate:true});
 const r=compareBalances(a,structuredClone(a),options); assert.equal(r.totals.previous,'10000'); assert.equal(r.rows[0].previousLines.length,10000);
});
