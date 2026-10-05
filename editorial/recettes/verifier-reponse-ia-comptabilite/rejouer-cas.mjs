import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
// Démonstration de routage après qualification humaine. Aucun modèle, aucun détecteur sémantique.
const documents={
 'NOTE-A-v1':'D-012 : préparer la liste des pièces à demander. Réunion jeudi, sous réserve de confirmation.',
 'NOTE-B-v1':'D-012 : réunion jeudi.',
 'NOTE-B-v2':'D-012 : réunion vendredi. Cette note ne précise pas si elle remplace NOTE-B-v1.'
};
const inputs=[
 {id:'V-01',affirmation:'Préparer la liste des pièces à demander.',source:'NOTE-A-v1',qualification:'fidele'},
 {id:'V-02',affirmation:'Le retour est attendu le 12 octobre.',source:'NOTE-A-v1',qualification:'ajout'},
 {id:'V-03',affirmation:'La procédure prévoit une validation unique.',source:null,qualification:'introuvable'},
 {id:'V-04',affirmation:'La réunion est confirmée jeudi.',source:'NOTE-A-v1',qualification:'reserve_omise'},
 {id:'V-05',affirmation:'La réunion a lieu jeudi.',source:['NOTE-B-v1','NOTE-B-v2'],qualification:'contradiction'}
];
export function orienter(q){
 switch(q){
 case 'fidele':return {decision:'GARDER',motif:'FIDELE_AU_DOCUMENT'};
 case 'ajout':return {decision:'CORRIGER',motif:'DATE_NON_ETAYEE'};
 case 'introuvable':return {decision:'RECHERCHER',motif:'SOURCE_INTROUVABLE'};
 case 'reserve_omise':return {decision:'CORRIGER',motif:'RESERVE_OMISE'};
 case 'contradiction':return {decision:'ECARTER',motif:'ARBITRAGE_HUMAIN'};
 default:return {decision:'RECHERCHER',motif:'QUALIFICATION_ABSENTE'};
 }
}
const cases=inputs.map(x=>({...x,...orienter(x.qualification),saisie:false}));
assert.deepEqual(cases.map(x=>x.decision),['GARDER','CORRIGER','RECHERCHER','CORRIGER','ECARTER']);
assert.deepEqual(orienter('inconnue'),{decision:'RECHERCHER',motif:'QUALIFICATION_ABSENTE'});
assert.ok(cases.every(x=>x.saisie===false));
const calcul={entrees:[125,75],total:125+75,unite:'unités fictives',regle:'Addition indépendante de tout modèle, sans règle fiscale'};
assert.equal(calcul.total,200);
const result={executedAt:new Date().toISOString(),modeleInterroge:null,nature:'Routage déterministe de qualifications préalables humaines, pas analyse automatique du texte',documents,cases,calcul};
writeFileSync(new URL('./journal-rejeu.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
