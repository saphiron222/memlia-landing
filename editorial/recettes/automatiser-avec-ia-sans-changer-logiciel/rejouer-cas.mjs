import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
export function passage(input,previous=null,approval=null){
 const refuse=motif=>({statut:'REFUS',motif,proposition:null,saisie:input.saisie??null});
 if(input.etat==='traite')return refuse('DEJA_TRAITE');
 if(input.saisie)return refuse('SAISIE_PROTEGEE');
 if(input.etat!=='a_preparer')return refuse('ETAT_INCONNU');
 if(!input.id||!input.periode||!input.version||!Array.isArray(input.pieces)||!input.pieces.length||input.pieces.some(x=>typeof x!=='string'||!x.trim()))return refuse('ENTREE_ABSENTE');
 const cle=input.id+'|'+input.periode+'|demande-pieces';
 const signature=JSON.stringify(input.pieces);
 if(previous&&(previous.cle!==cle||previous.version!==input.version||previous.signature!==signature))return refuse('VERSION_CHANGEE');
 const proposition=previous??{id:'P-'+input.id+'-'+input.version,cle,version:input.version,signature,texte:'Pièces attendues : '+input.pieces.join(', ')+'.'};
 if(approval&&approval!==proposition.id)return refuse('VALIDATION_PERIMEE');
 return {statut:previous?'REUTILISER':'PROPOSITION',motif:proposition.id,proposition,saisie:null};
}
const nominal={id:'F-012',periode:'2026-09',version:'v1',etat:'a_preparer',pieces:['relevé A','facture B'],saisie:null};
const base=passage(nominal).proposition;
const inputs=[['nominal',nominal,null,null,'PROPOSITION','P-F-012-v1'],['traite',{...nominal,id:'F-013',etat:'traite'},null,null,'REFUS','DEJA_TRAITE'],['absent',{...nominal,id:'F-014',pieces:null},null,null,'REFUS','ENTREE_ABSENTE'],['saisie',{...nominal,id:'F-015',saisie:'Texte corrigé par le collaborateur'},null,null,'REFUS','SAISIE_PROTEGEE'],['reprise',nominal,base,null,'REUTILISER','P-F-012-v1'],['version',{...nominal,version:'v2'},base,null,'REFUS','VERSION_CHANGEE'],['etat',{...nominal,id:'F-016',etat:'inconnu'},null,null,'REFUS','ETAT_INCONNU'],['accord-ancien',nominal,base,'P-F-012-v0','REFUS','VALIDATION_PERIMEE']];
const cases=inputs.map(([cas,input,previous,approval,statut,motif])=>{const before=structuredClone(input),out=passage(input,previous,approval);assert.deepEqual(input,before);assert.equal(out.statut,statut);assert.equal(out.motif,motif);assert.equal(out.saisie,input.saisie??null);return {cas,input,previous,approval,sortie:out};});
assert.equal(cases[0].sortie.proposition.texte,'Pièces attendues : relevé A, facture B.');assert.deepEqual(cases[4].sortie.proposition,base);
assert.equal(passage({...nominal,pieces:['pièce C']},base).motif,'VERSION_CHANGEE');
const result={executedAt:new Date().toISOString(),modeleInterroge:null,connexionEditeur:null,envoi:false,ecritureMetier:false,cases,additionalMutation:'contenu modifié à version identique : VERSION_CHANGEE'};
writeFileSync(new URL('./journal-rejeu.json',import.meta.url),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
