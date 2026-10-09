import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
// Convention fictive : préparer des résultats comparables, jamais une valeur d’entreprise.
export function preparer(input){
 const reasons=[]; const docs=input.documents??[];
 if(input.scope!=='societe-fictive-01')reasons.push('PERIMETRE');
 if(input.periods.length!==3||new Set(input.periods).size!==3)reasons.push('PERIODES');
 if(docs.some(d=>d.unit!=='EUR'||!Number.isSafeInteger(d.result)))reasons.push('UNITE_OU_MONTANT');
 if(docs.some(d=>!d.source||!d.version))reasons.push('SOURCE');
 if(docs.some(d=>!input.periods.includes(d.period)))reasons.push('HORS_PERIODE');
 for(const period of input.periods)if(docs.filter(d=>d.period===period).length!==1)reasons.push('PIECE_ABSENTE_OU_CONFLIT');
 for(const a of input.adjustments??[]){if(!['accepted','pending','rejected'].includes(a.status)||!Number.isSafeInteger(a.amount))reasons.push('RETRAITEMENT_INVALIDE');if(a.status==='accepted'&&(!a.source||!a.approvedBy||!a.rationale||!input.periods.includes(a.period)))reasons.push('RETRAITEMENT_NON_JUSTIFIE');}
 if(reasons.length)return {status:'ARRET',reasons:[...new Set(reasons)],generated:null,userNotes:input.userNotes};
 const rows=input.periods.map(period=>{const d=docs.find(d=>d.period===period);const accepted=(input.adjustments??[]).filter(a=>a.period===period&&a.status==='accepted');return {period,source:d.source,version:d.version,baseResult:d.result,acceptedAdjustments:accepted.map(a=>({id:a.id,amount:a.amount,source:a.source,approvedBy:a.approvedBy,rationale:a.rationale})),preparedResult:d.result+accepted.reduce((s,a)=>s+a.amount,0)};});
 const pending=(input.adjustments??[]).filter(a=>a.status==='pending');
 return {status:pending.length?'ATTEND_VALIDATION':'PROPOSITION',generated:{rows,pending:pending.map(a=>a.id)},userNotes:input.userNotes,method:null,enterpriseValue:null,price:null};
}
const base={scope:'societe-fictive-01',periods:['2023','2024','2025'],documents:[{period:'2023',result:80000,unit:'EUR',source:'bilan-2023-fictif',version:'v1'},{period:'2024',result:90000,unit:'EUR',source:'bilan-2024-fictif',version:'v1'},{period:'2025',result:100000,unit:'EUR',source:'bilan-2025-fictif',version:'v1'}],adjustments:[{id:'A1',period:'2025',amount:12000,status:'accepted',source:'piece-charge-fictive',approvedBy:'responsable-fictif',rationale:'Réintégration décidée par le cabinet pour ce seul tableau de préparation.'}],userNotes:{method:'à décider par le cabinet',comment:'conserver ma note'}};
const clone=()=>structuredClone(base);
const scenarios=[
 ['courant',clone(),o=>{assert.equal(o.status,'PROPOSITION');assert.deepEqual(o.generated.rows.map(r=>r.preparedResult),[80000,90000,112000]);}],
 ['retraitement-en-attente',(()=>{const x=clone();x.adjustments[0].status='pending';return x;})(),o=>{assert.equal(o.status,'ATTEND_VALIDATION');assert.equal(o.generated.rows[2].preparedResult,100000);assert.deepEqual(o.generated.pending,['A1']);}],
 ['piece-manquante',(()=>{const x=clone();x.documents.pop();return x;})(),o=>assert.equal(o.status,'ARRET')],
 ['versions-concurrentes',(()=>{const x=clone();x.documents.push({...x.documents[2],version:'v2',result:110000});return x;})(),o=>assert.equal(o.status,'ARRET')],
 ['unite-incompatible',(()=>{const x=clone();x.documents[2].unit='kEUR';return x;})(),o=>assert.equal(o.status,'ARRET')],
 ['validation-sans-piece',(()=>{const x=clone();delete x.adjustments[0].source;return x;})(),o=>assert.equal(o.status,'ARRET')],
 ['perimetre-different',(()=>{const x=clone();x.scope='groupe-fictif';return x;})(),o=>assert.equal(o.status,'ARRET')],
 ['retraitement-rejete',(()=>{const x=clone();x.adjustments[0].status='rejected';return x;})(),o=>{assert.equal(o.status,'PROPOSITION');assert.equal(o.generated.rows[2].preparedResult,100000);}],
 ['sans-tracabilite',(()=>{const x=clone();delete x.documents[0].version;return x;})(),o=>assert.equal(o.status,'ARRET')],
 ['nouveau-rejeu',clone(),o=>assert.deepEqual(o,preparer(clone()))]
];
const cases=scenarios.map(([id,input,check])=>{const snapshot=JSON.stringify(input);const output=preparer(input);check(output);assert.equal(JSON.stringify(input),snapshot);assert.deepEqual(output.userNotes,input.userNotes);if(output.status==='ARRET')assert.equal(output.generated,null);else for(const key of ['method','enterpriseValue','price'])assert.equal(output[key],null);return {id,input,output,status:'PASS'};});
const proof={status:'PASS',fictitious:true,replayedAt:'2026-10-06',scope:'Préparation documentaire et arithmétique uniquement. Aucune formule de valorisation, avis, décision de méthode ou choix de prix.',executable:'preuves/rejouer.mjs',cases};
writeFileSync(new URL('./rejeu.json',import.meta.url),JSON.stringify(proof,null,2)+'\n');console.log(`PASS : ${cases.length} cas fictifs ; entrées et notes humaines préservées ; aucune valeur ni prix calculés.`);
