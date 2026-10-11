import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
// Démonstrateur de la règle fictive, pas moteur de paie ni automatisation livrée.
function control(input) {
 const alerts=[];
 if(!input.readable) return {status:'ARRET',reason:'source_illisible',alerts};
 if(input.period!=='2026-09'||input.variablePeriod!==input.period) return {status:'ARRET',reason:'periode_incoherente',alerts};
 if(new Set(input.ids).size!==input.ids.length) return {status:'ARRET',reason:'cle_non_unique',alerts};
 if(input.sourcePrime===null) return {status:'ARRET',reason:'reference_absente',alerts};
 if(input.sourcePrime!==input.bulletinPrime) alerts.push('prime_a_rapprocher');
 // Seuil arbitraire de 100 euros sur brut N/N-1, convention fictive sans valeur légale.
 if(Math.abs(input.gross-input.previousGross)>10000) alerts.push('variation_a_expliquer');
 if(/grève|représentant du personnel/i.test(input.label)) alerts.push('libelle_a_examiner');
 if(input.reviewedVersion&&input.reviewedVersion!==input.version) alerts.push('validation_a_reprendre');
 return {status:alerts.length?'ECARTS_A_VALIDER':'PROPOSITION_A_VALIDER',reason:null,alerts};
}
const base={readable:true,period:'2026-09',variablePeriod:'2026-09',ids:['FICTIF-01'],sourcePrime:20000,bulletinPrime:20000,gross:280000,previousGross:280000,label:'Prime',version:'v1',reviewedVersion:null};
const fixtures=[
 ['courant',{}, {status:'PROPOSITION_A_VALIDER',reason:null,alerts:[]}],
 ['prime_ecart',{bulletinPrime:15000},{status:'ECARTS_A_VALIDER',reason:null,alerts:['prime_a_rapprocher']}],
 ['variation',{gross:291000},{status:'ECARTS_A_VALIDER',reason:null,alerts:['variation_a_expliquer']}],
 ['reference_absente',{sourcePrime:null},{status:'ARRET',reason:'reference_absente',alerts:[]}],
 ['periode',{variablePeriod:'2026-08'},{status:'ARRET',reason:'periode_incoherente',alerts:[]}],
 ['doublon',{ids:['FICTIF-01','FICTIF-01']},{status:'ARRET',reason:'cle_non_unique',alerts:[]}],
 ['illisible',{readable:false},{status:'ARRET',reason:'source_illisible',alerts:[]}],
 ['libelle',{label:'Retenue grève'},{status:'ECARTS_A_VALIDER',reason:null,alerts:['libelle_a_examiner']}],
 ['recalcul',{version:'v2',reviewedVersion:'v1'},{status:'ECARTS_A_VALIDER',reason:null,alerts:['validation_a_reprendre']}],
];
const cases=fixtures.map(([id,overrides,expected])=>{const input={...base,...overrides};const actual=control(input);assert.deepEqual(actual,expected,id);return {id,input,expected,actual,pass:true,writePayroll:false,humanDecisionRequired:true};});
const proof={version:1,status:'PASS',fictitious:true,replayedAt:'2026-10-06',executedAt:new Date().toISOString(),scope:'Contrôles de rapprochement fictifs uniquement ; aucune correction, validation, transmission ou qualification juridique automatique.',cases};
writeFileSync(fileURLToPath(new URL('./rejeu.json',import.meta.url)),JSON.stringify(proof,null,2)+'\n');
console.log(`${cases.length} cas PASS ; zéro écriture de paie ; validation humaine pour toutes les propositions.`);
