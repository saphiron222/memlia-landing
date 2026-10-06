import test from 'node:test';
import assert from 'node:assert/strict';
import * as m from '../../src/lib/signification.mjs';
const input=(patch={})=>({id:'001',name:'Scénario A',baseName:'Chiffre d’affaires',base:'1000000',rate:'1',period:'2026',reference:'Balance fictive',justification:'Base choisie et motivée pour cet essai fictif.',planningMode:'rate',planning:'70',...patch});
const session=(patch={})=>m.addScenario(m.createSession(),input(patch));
test('cas 1 : signification et planification exactes sans taux métier par défaut',()=>{
 assert.equal(m.emptyScenario().rate,'');assert.equal(m.emptyScenario().planning,'');
 assert.deepEqual(m.calculate(input()),{signification:'10000.00',planning:'7000.00',errors:[]});
});
test('cas 2–3 : absence, zéro, négatif et taux hors borne refusés',()=>{
 for(const patch of [{rate:''},{base:'0'},{base:'-100'},{rate:'0'},{rate:'100.001'},{rate:'1e1'},{base:'1 000'}])assert.ok(m.calculate(input(patch)).errors.length);
 assert.equal(m.calculate(input({rate:'100'})).errors.length,0);
});
test('cas 4 : décimaux exacts, arrondi seulement à restitution, demi-centime vers le haut',()=>{
 assert.deepEqual(m.calculate(input({base:'1234,56',rate:'1,25',planningMode:'none',planning:''})),{signification:'15.43',planning:null,errors:[]});
 assert.equal(m.calculate(input({base:'1.005',rate:'100',planningMode:'rate',planning:'50'})).planning,'0.50');
 assert.equal(m.calculate(input({base:'1.005',rate:'100'})).signification,'1.01');
 assert.equal(m.calculate(input({base:'9007199254740993',rate:'100'})).signification,'9007199254740993.00');
});
test('cas 5 : planification supérieure au seuil exact bloque le dossier final',()=>{
 let s=session({planningMode:'amount',planning:'11000'});assert.ok(m.calculate(s.scenarios[0]).errors.length);
 assert.throws(()=>m.retainScenario(s,'001'));assert.throws(()=>m.exportReport(s,true),/incohér|planification/i);
 assert.ok(m.exportReport(s).includes('BROUILLON'));
 assert.ok(m.calculate(input({base:'1.001',rate:'100',planningMode:'amount',planning:'1.002'})).errors.length);
});
test('cas 6 : choix et justification explicites, comparabilité visible',()=>{
 let s=session();s=m.addScenario(s,input({id:'002',name:'Scénario B',rate:'2'}));
 assert.equal(m.dossierState(s),'BROUILLON');
 s=m.retainScenario(s,'001');assert.equal(m.dossierState(s),'CHOIX UTILISATEUR');
 assert.match(m.exportCsv(s),/NON RETENU/);assert.match(m.exportReport(s,true),/CHOIX UTILISATEUR/);
 assert.throws(()=>m.retainScenario(session({justification:''}),'001'),/justification/i);
 assert.equal(m.comparability(s.scenarios),'Même base, période et référence');
 assert.match(m.comparability([input(),input({id:'2',period:'2025'})]),/différent/);
});
test('cas 7 : correction conserve commentaire, invalide le choix et trace le changement',()=>{
 let s=m.retainScenario(session(),'001');s=m.updateScenario(s,'001',{base:'2000000'});
 assert.equal(s.scenarios[0].justification,input().justification);assert.equal(s.retainedId,'');
 assert.equal(s.scenarios[0].changedSinceValidation,true);assert.equal(m.dossierState(s),'BROUILLON');
 s=m.retainScenario(s,'001');assert.equal(s.scenarios[0].changedSinceValidation,false);
});
test('cas 8 : reprise exacte, CSV neutralisé et HTML échappé sans attribut de validation inventé',()=>{
 const s=m.retainScenario(session({name:'=1+1',reference:'<img src=x onerror=alert(1)>'}),'001');
 assert.deepEqual(m.importSession(m.exportJson(s)),s);
 assert.ok(m.exportCsv(s).startsWith('\ufeff'));assert.match(m.exportCsv(s),/'=1\+1/);
 assert.ok(!m.exportReport(s).includes('<img'));assert.match(m.exportReport(s),/&lt;img/);
 const forged=JSON.parse(m.exportJson(s));forged.scenarios[0].base='999';assert.throws(()=>m.importSession(JSON.stringify(forged)),/validation/i);
});
test('reprise : schéma, champs inconnus, doublons, limites et annulation logique',()=>{
 const s=session();assert.throws(()=>m.importSession(JSON.stringify({...s,version:'unknown'})));
 assert.throws(()=>m.importSession(JSON.stringify({...s,extra:'x'})));
 assert.throws(()=>m.addScenario(s,input()),/identifiant/i);
 assert.throws(()=>m.exportCsv({...s,complete:false}),/incomplet/i);
 assert.throws(()=>m.importSession('x'.repeat(m.MAX_BYTES+1)),/20 Mo/i);
});
test('CSV explicite : source et zéros initiaux, mapping, aperçu sans correction silencieuse',()=>{
 const csv='Identifiant;Nom;Base;Montant;Taux;Période;Source;Justification;Mode;Planification\n001;A;CA;1234,56;1,25;2026;Balance;Motif;none;';
 const parsed=m.parseImport(csv,';');const mapping=Object.fromEntries(m.INPUT_FIELDS.map((key,i)=>[key,i]));
 const rows=m.mapImport(parsed,mapping);assert.equal(rows[0].id,'001');assert.equal(rows[0].base,'1234,56');
 assert.equal(m.calculate(rows[0]).signification,'15.43');assert.equal(m.appendImport(m.createSession(),rows).scenarios.length,1);
 assert.throws(()=>m.parseImport(csv,','));assert.throws(()=>m.mapImport(parsed,{id:0}));
 assert.throws(()=>m.appendImport(session(),rows),/identifiant/i);
});
test('données exploratoires invalides conservées dans JSON, jamais retenues',()=>{
 const s=session({rate:'',justification:''});assert.deepEqual(m.importSession(m.exportJson(s)),s);
 assert.equal(m.calculate(s.scenarios[0]).signification,null);assert.throws(()=>m.retainScenario(s,'001'));
});
test('exports multipart repris sans pertes, manquants/mélangés refusés',()=>{
 const s=session({justification:'x'.repeat(6000)});const parts=m.exportParts(s,1000);
 assert.ok(parts.length>1);assert.deepEqual(m.importParts(parts.map(p=>p.content)),s);
 assert.throws(()=>m.importParts(parts.slice(1).map(p=>p.content)));
 const other=m.exportParts(session({justification:'y'.repeat(6000)}),1000);
 assert.throws(()=>m.importParts([parts[0].content,...other.slice(1).map(p=>p.content)]));
});
test('bornes de texte et retour aux anciennes entrées : reprise sans attribution de choix',()=>{
 let s=m.retainScenario(session({justification:'x'.repeat(65536)}),'001');
 assert.deepEqual(m.importSession(m.exportJson(s)),s);
 s=m.updateScenario(s,'001',{base:'2'});s=m.updateScenario(s,'001',{base:'1000000'});
 assert.equal(s.retainedId,'');assert.deepEqual(m.importSession(m.exportJson(s)),s);
 assert.equal(m.calculate(input({base:'0',rate:''})).errors.length,2);
});
test('100 000 scénarios : export intégral, multipart ≤20 Mo, reprise intégrale et borne',()=>{
 const rows=Array.from({length:100000},(_,i)=>input({id:String(i).padStart(6,'0')}));
 const s=m.appendImport(m.createSession(),rows);assert.throws(()=>m.addScenario(s,input({id:'excess'})),/100 000/);
 const parts=m.exportParts(s);assert.ok(parts.length>1);for(const p of parts)assert.ok(Buffer.byteLength(p.content)<=m.MAX_BYTES);
 const restored=m.importParts(parts.map(p=>p.content));assert.deepEqual(restored,s);
 const csv=m.exportCsv(s);assert.ok(csv.includes('099999'));assert.equal(csv.split('\r\n').length,100002);
});
