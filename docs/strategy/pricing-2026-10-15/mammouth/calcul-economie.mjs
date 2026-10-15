/** Modèle d’étude interne, sans réseau, sans exécution d’agent ni facturation. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=path.dirname(fileURLToPath(import.meta.url));
export const bareme=JSON.parse(fs.readFileSync(path.join(root,'bareme-agents.json'),'utf8'));
const catalogue=JSON.parse(fs.readFileSync(path.join(root,'tarifs-modeles.json'),'utf8'));
const index=new Map(catalogue.models.map(m=>[m.id,m]));
const positive=(x,name,{zero=false}={})=>{if(!Number.isFinite(x)||(zero?x<0:x<=0))throw new RangeError(`${name} invalide`);return x;};
const integer=(x,name)=>{if(!Number.isSafeInteger(x)||x<0)throw new RangeError(`${name} doit être un entier positif ou nul`);return x;};
export function modele(id){if(['mammouth-recommended','mammouth','recommended'].includes(id))throw new RangeError('Alias mouvant exclu du chiffrage');const m=index.get(id);if(!m)throw new RangeError(`Modèle absent : ${id}`);positive(m.input_usd_per_million,'tarif entrée');positive(m.output_usd_per_million,'tarif sortie');return m;}
export function coutUnite(unit,scenario=bareme.scenarios[0]){
  const m=modele(scenario.premium?bareme.premiumModelId:unit.modelId);
  for(const k of ['usdToEurBudget','humanHourlyEur','tokenMultiplier','attemptFactor','humanMultiplier','toolsMultiplier'])positive(scenario[k],k);
  positive(unit.inputTokens,'tokens entrée',{zero:true});positive(unit.outputTokens,'tokens sortie',{zero:true});positive(unit.humanSeconds,'secondes humaines',{zero:true});positive(unit.toolsReserveEur,'réserve outils',{zero:true});
  const apiUsd=(unit.inputTokens*m.input_usd_per_million+unit.outputTokens*m.output_usd_per_million)/1e6*scenario.tokenMultiplier*scenario.attemptFactor;
  const apiEur=apiUsd*scenario.usdToEurBudget*positive(scenario.supplierTaxMultiplier,'coefficient taxes fournisseur');
  const humanEur=unit.humanSeconds*scenario.humanMultiplier/3600*scenario.humanHourlyEur;
  const toolsEur=unit.toolsReserveEur*scenario.toolsMultiplier;
  const priceEur=unit.priceCents/100;
  const collectionEur=priceEur*positive(scenario.collectionPercent,'réserve encaissement',{zero:true});
  const totalEur=apiEur+humanEur+toolsEur+collectionEur;
  const targetCost=priceEur*(1-bareme.targetVariableMargin);
  const humanSecondsAtTarget=(targetCost-apiEur-toolsEur-collectionEur)/scenario.humanHourlyEur*3600;
  const apiEnvelopeUsd=(unit.inputTokens*m.input_usd_per_million+unit.outputTokens*m.output_usd_per_million)/1e6*unit.technicalEnvelopeMultiplier;
  return {id:unit.id,modelId:m.id,priceEur,apiUsd,apiEur,humanEur,toolsEur,collectionEur,totalEur,margin:(priceEur-totalEur)/priceEur,humanSecondsAtTarget,apiEnvelopeUsd,noteEnvelope:'Provision avec quatre fois les tokens nominaux, pas garantie fournisseur ni coût observé.'};
}
export function devis(quantites,capCents=bareme.initialUsageCapCents,scenario=bareme.scenarios[0],setupId='standard'){
  integer(capCents,'plafond');
  const known=new Set(bareme.units.map(u=>u.id));
  for(const id of Object.keys(quantites))if(!known.has(id))throw new RangeError(`Unité inconnue ${id}`);
  const lignes=bareme.units.map(u=>{const quantity=integer(quantites[u.id]??0,`quantité ${u.id}`);return {...coutUnite(u,scenario),quantity,lineCents:u.priceCents*quantity};});
  const usageCents=lignes.reduce((s,l)=>s+l.lineCents,0);integer(usageCents,'total');
  const fixedDirectEur=positive(scenario.fixedInfraMonthlyEur,'coûts fixes',{zero:true})+positive(scenario.fixedHumanMinutes,'minutes fixes',{zero:true})/60*scenario.humanHourlyEur;
  const variableDirectEur=lignes.reduce((s,l)=>s+l.quantity*l.totalEur,0);
  const overhead=bareme.overheadAssumptions;
  const allocatedEur=overhead.generalMonthlyEur+overhead.acquisitionPerCabinetEur/positive(overhead.acquisitionAmortizationMonths,'amortissement acquisition')+overhead.cataloguePerCabinetEur/positive(overhead.catalogueAmortizationMonths,'amortissement catalogue');
  const setup=setupId===null?null:bareme.setup.find(s=>s.id===setupId);if(setupId!==null&&!setup)throw new RangeError('Mise en service inconnue');
  const setupCents=setup?.priceCents??0;
  const monthlyCents=bareme.baseMonthlyCents+usageCents;
  const collectionEur=bareme.baseMonthlyCents/100*positive(scenario.collectionPercent,'réserve encaissement',{zero:true})+positive(scenario.collectionFixedEur,'réserve fixe encaissement',{zero:true});
  const directEur=fixedDirectEur+variableDirectEur+collectionEur;
  const setupDirectEur=setup?setup.hours*scenario.setupEffortMultiplier*scenario.humanHourlyEur+setup.technicalReserveEur*scenario.toolsMultiplier+setupCents/100*scenario.collectionPercent+scenario.collectionFixedEur*positive(bareme.setupPaymentCount,'encaissements installation'):0;
  return {lignes,usageCents,capCents,withinCap:usageCents<=capCents,remainingCents:capCents-usageCents,monthlyCents,maxMonthlyCents:bareme.baseMonthlyCents+capCents,setupCents,firstMonthCents:monthlyCents+setupCents,maxFirstMonthCents:bareme.baseMonthlyCents+capCents+setupCents,firstYearCents:12*monthlyCents+setupCents,fixedDirectEur,variableDirectEur,collectionEur,directEur,setupDirectEur,setupMargin:setup?1-setupDirectEur/(setupCents/100):null,grossMargin:(monthlyCents/100-directEur)/(monthlyCents/100),allocatedEur,contributionEur:monthlyCents/100-directEur-allocatedEur,humanHours:scenario.fixedHumanMinutes/60+lignes.reduce((s,l)=>s+l.quantity*bareme.units.find(u=>u.id===l.id).humanSeconds*scenario.humanMultiplier/3600,0)};
}
export function verifier(){
  assert.equal(new Set(bareme.units.map(u=>u.id)).size,8);
  assert.equal(catalogue.model_count,catalogue.models.length);
  const normal=bareme.scenarios[0];
  const units=bareme.units.map(u=>coutUnite(u,normal));
  assert(Math.abs(units[0].apiUsd-0.0275)<1e-12); // (6k×2 + 1k×10)/1M ×1,25
  assert(Math.abs(units[0].apiEur-0.03025)<1e-12);
  assert.equal(devis({U1:200}).withinCap,true);assert.equal(devis({U1:201}).withinCap,false);
  assert.equal(devis({U1:200}).monthlyCents,29900);assert.equal(devis({U1:200}).maxFirstMonthCents,108900);
  assert.equal(devis({},0,normal,null).monthlyCents,9900);
  assert.equal(devis({},0,normal,null).setupCents,0);
  assert.throws(()=>devis({U1:.5}),RangeError);assert.throws(()=>devis({INCONNUE:1}),RangeError);assert.throws(()=>devis({U1:-1}),RangeError);assert.throws(()=>devis({},NaN),RangeError);
  assert.throws(()=>modele('mammouth-recommended'),RangeError); // On ne chiffre pas un alias mouvant.
  for(const u of bareme.units){const m=modele(u.modelId);assert(u.inputTokens<=m.max_input_tokens);assert(u.outputTokens<=m.max_output_tokens);}
  const example=devis(Object.fromEntries(bareme.units.map(u=>[u.id,u.defaultQuantity])));
  assert.equal(example.usageCents,17400);assert.equal(example.monthlyCents,27300);assert.equal(example.firstMonthCents,106300);assert.equal(example.firstYearCents,406600);
  const degraded=bareme.units.map(u=>coutUnite(u,bareme.scenarios[2]));
  assert(degraded.every((c,i)=>c.totalEur>units[i].totalEur));
  return {resultat:'PASS',comparaisons:8,prixEtPlafonds:'centimes entiers ; limites exactes testées',consommationReelle:false};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  const checks=verifier();
  const exampleQuantities=Object.fromEntries(bareme.units.map(u=>[u.id,u.defaultQuantity]));
  const report={date:'2026-10-15',nature:'Coûts calculés sur prix publics et hypothèses ; aucune inférence ni facture API mesurée',checks,scenarios:bareme.scenarios.map(s=>({id:s.id,label:s.label,units:bareme.units.map(u=>coutUnite(u,s)),example:devis(exampleQuantities,bareme.initialUsageCapCents,s)})),setup:bareme.setup.map(s=>{const q=devis({},0,bareme.scenarios[0],s.id);return {...s,baseDirectEur:q.setupDirectEur,baseMargin:q.setupMargin};})};
  fs.writeFileSync(path.join(root,'calculs-agents.json'),JSON.stringify(report,null,2)+'\n');
  const columns=['unite','travail','prix_ht','api_eur_base','humain_eur_base','reserve_outils_eur','encaissement_variable_eur','cout_direct_eur','marge_variable','secondes_humaines_max_marge70'];
  const round=x=>Math.round(x*1e6)/1e6;
  const rows=bareme.units.map(u=>{const c=coutUnite(u);return [u.id,u.label,c.priceEur,round(c.apiEur),round(c.humanEur),c.toolsEur,round(c.collectionEur),round(c.totalEur),round(c.margin),round(c.humanSecondsAtTarget)].join(';');});
  fs.writeFileSync(path.join(root,'grille-couts-agents.csv'),columns.join(';')+'\n'+rows.join('\n')+'\n');
  console.log(JSON.stringify({checks,example:{mensuel_ht:report.scenarios[0].example.monthlyCents/100,premiere_annee_ht:report.scenarios[0].example.firstYearCents/100,cout_direct_calcule:report.scenarios[0].example.directEur,contribution_apres_allocations:report.scenarios[0].example.contributionEur}}));
}
