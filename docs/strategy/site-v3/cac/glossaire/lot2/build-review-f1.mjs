import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {digest,reviewSubjectDigestPayload} from './baseline/scripts/lib/resource-pipeline.mjs';
const root=new URL('.',import.meta.url).pathname;
const path='docs/strategy/site-v3/glossaire-cac-lot-2.json';
const raw=readFileSync(root+'corrected/'+path),pack=JSON.parse(raw),old=JSON.parse(readFileSync(root+'corrected/original/'+path)),prior=JSON.parse(readFileSync(root+'prior/PREUVE.json'));
const hash=x=>createHash('sha256').update(x).digest('hex');
const checkedAt=new Date().toISOString();
const specific={
 'assertions-audit:definition':[
  'F1 levé : la définition seule est attribuée à NEP 500 §03 / A.821-74 §3 et NEP 315 §05. Les critères ne sont plus confondus avec les procédures.',
  'F1 levé : explication pédagogique du rôle des assertions dans les vérifications, non citation littérale. NEP 500 §05 relie preuves et assertions ; dans NEP 315, §17 décrit les travaux et conclusions, lu avec la définition §05 et le lien aux assertions §18/21. Cette phrase ne définit ni un test ni une opinion.'],
 'assertions-audit:context':[
  'F1 levé : la liste réalité/séparation des exercices/existence/annexe relève exclusivement de NEP 500 §09 / A.821-74 §9. L’article A.821-74 est attesté par l’en-tête de la copie.',
  'F1 levé : seules les assertions pertinentes avant prise en compte des contrôles sont attribuées à NEP 315 §06 ; la liste de NEP 500 ne lui est plus imputée.'],
 'assertions-audit:commonConfusion':[
  'F1 levé : NEP 315 §05 ajouté à §17 ; NEP 500 §§03/05 et A.821-74 §§3/5 établissent critères, preuves et conclusion. La distinction assertion / déclaration / test est une explication fidèle de ces définitions, pas une nouvelle obligation.'],
 'anomalie-significative:context':[
  'F1 levé : NEP 200 §04 seul porte le rappel anaphorique de la définition publiée juste avant ; aucune règle montant/nature/circonstances ne lui est attribuée.',
  'F1 levé : NEP 320 §§09/10 porte entièrement montant, nature, circonstances et jugement professionnel.'],
 'anomalie-significative:commonConfusion':[
  'F1 levé : NEP 320 §09 porte le caractère significatif qualitatif et circonstancié, sans le réduire au dépassement d’un seuil.',
  'F1 levé : le cumul seul est attribué à NEP 200 §04 et NEP 320 §04. Le point-virgule est conservé pour couvrir le champ, sans étendre la preuve au sous-claim précédent.'],
 'risque-inherent:context':[
  'F1 levé : NEP 200 §11 distingue les composantes du risque propre à l’entité ; la liste de facteurs et l’évaluation distincte ne lui sont plus attribuées.',
  'F1 levé : NEP 315 §02 donne les facteurs, §39 l’évaluation séparée et §40 la probabilité/ampleur et incidence des facteurs ; « peuvent » ne transforme pas un facteur en score automatique.'],
 'risque-inherent:commonConfusion':[
  'F1 levé : NEP 200 §11 définit le risque inhérent sans tenir compte du contrôle interne, même si ce dernier est efficace.',
  'F1 levé : NEP 315 §§02/40 relie complexité/volumétrie à l’évaluation du CAC, sans attribuer de niveau automatique ni établir une causalité certaine.'],
 'risque-lie-controle:definition':[
  'F1 levé : la définition, y compris non-correction en temps voulu et distinction inhérent/contrôle, est prouvée par NEP 200 §11 ou NEP 315 §02. Les seuls §§34/41 ne sont plus présentés comme définition.'],
 'risque-lie-controle:context':[
  'F1 levé : rappel de définition seul attribué à NEP 200 §11, lu avec le champ définition ; ni tests ni absence de tests ne lui sont attribués.',
  'F1 levé : NEP 315 §§34/41 distingue conception, mise en œuvre et efficacité du fonctionnement ; une description ne prouve pas un test.',
  'F1 levé : la dernière phrase de NEP 315 §41 énonce exactement la conséquence de l’absence de tests sur l’évaluation au niveau des assertions ; elle fait désormais l’objet de son propre sous-claim.'],
 'risque-lie-controle:commonConfusion':[
  'F1 levé : NEP 315 §§34/41 distingue description/conception/mise en œuvre et tests d’efficacité ; le sous-claim ne traite plus la non-détection.',
  'F1 levé : NEP 200 §§11/12 oppose risque propre à l’entité et risque propre à la mission ; aucune règle de test du contrôle ne lui est attribuée.'],
 'ipe-audit:definition':[
  'F1 levé : convention lexicale professionnelle et exemples de documents internes, sans prétendre que les NEP définissent l’acronyme IPE. Aucune obligation autonome, source normative ou caution n’est ajoutée ; les exigences de fiabilité sont distinctes.',
  'F1 levé : NEP 500 §§06/07 / A.821-74 §§6/7 relie fiabilité à l’origine, nature, circonstances, contrôle interne et esprit critique. L’origine interne n’établit pas seule la fiabilité.'],
 'ipe-audit:context':[
  'F1 levé : NEP 500 §06 / A.821-74 §6 porte la collecte d’éléments sur exactitude/exhaustivité des informations produites par l’entité ; la règle particulière des outils automatisés est isolée.',
  'F1 levé : NEP 315 §46 seul porte l’appréciation de la pertinence/fiabilité des informations intégrées aux outils dans l’identification et l’évaluation des risques, sans définition normative de l’acronyme IPE.'],
 'ipe-audit:commonConfusion':[
  'F1 levé : NEP 500 §§05/06 / A.821-74 §§5/6 porte suffisance, qualité, exactitude, exhaustivité et pertinence. Export ou total rapproché est une illustration éditoriale de cette exigence, pas une diligence dispensatoire. Le rattachement global à NEP 315 §46 est supprimé.']
};
const acquired={
 'assertions-audit':'NEP 500 §§03/05/09 : critères et assertions, preuves suffisantes/appropriées ; NEP 315 §§05/06/17 selon le sujet.',
 'anomalie-significative':'NEP 200 §04 et NEP 320 §§04/09/10 : définition, cumul, montant/nature/circonstances et jugement.',
 'risque-audit':'NEP 200 §§10–13 : risque d’opinion inappropriée, risques de l’entité et non-détection, assurance raisonnable sans garantie absolue.',
 'risque-inherent':'NEP 200 §11 / NEP 315 §02 : risque apprécié sans les contrôles, facteurs et jugement distincts.',
 'risque-lie-controle':'NEP 200 §§11/12 / NEP 315 §§02/34/41 : contrôles de l’entité distincts de non-détection et des tests de fonctionnement.',
 'risque-non-detection':'NEP 200 §§10/12/13 : risque propre à la mission, réponse adaptée et impossibilité d’obtenir une assurance absolue.',
 'seuil-signification-audit':'NEP 320 §§06/09/10/14–16/21–24 : montant, jugement, critères et révision documentée ; pas de pourcentage universel prescrit.',
 'seuil-planification-audit':'NEP 320 §§07/17–19/21–24 : montant inférieur au seuil de signification, risque de cumul, expérience/connaissance et jugement ; pas de taux obligatoire.',
 'controle-interne-audit':'NEP 315 §§24/34/41 et A.821-72 : dispositif de l’entité, conception/mise en œuvre distinctes des tests, efficacité appréciée par le CAC.',
 'ipe-audit':'NEP 500 §§05/06 / NEP 315 §46 selon le sujet ; source d’information distincte de caractère suffisant/approprié.'
};
const sources=Object.entries(pack.evidence.sources).map(([id,s])=>({id,publisher:pack.sources[id].publisher,title:pack.sources[id].title,official:true,level:'tier-1',provenance:'primary',requestedUrl:s.requestedUrl,finalUrl:s.finalUrl,upstreamUrl:s.upstreamUrl??s.requestedUrl,checkedAt:s.retrievedAt,snapshotPath:'corrected/'+s.snapshotPath,contentSha256:s.contentSha256,...(s.dilaCopyPath?{dilaCopyPath:'corrected/'+s.dilaCopyPath,dilaCopySha256:s.dilaCopySha256}:{}),verificationEvidenceRef:s.dilaCopyPath?'corrected/'+s.dilaCopyPath:'prior/sources/independent-access.json',classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:pack.evidence.units.filter(u=>u.sourceId===id).map(u=>u.id)}));
sources.push({id:'source-lot-2-memlia',publisher:'Memlia',title:'Exemples, frontières et convention lexicale IPE du lot CAC 2',official:false,level:'original-method',provenance:'primary',requestedUrl:'file://corrected/'+path,finalUrl:'file://corrected/'+path,checkedAt:pack.preparedAt,snapshotPath:'corrected/'+path,contentSha256:hash(raw),verificationEvidenceRef:'review/REVUE.md#candidat',classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:pack.evidence.units.filter(u=>!u.sourceId).map(u=>u.id)});
const units=new Map(),claims=[],citations=[],verdicts=[],unitReviews=[];
for(const u of pack.evidence.units){
 const original=old.evidence.units.find(x=>x.id===u.id),revised=!original;
 if(original)assert.deepEqual(u,original);
 const entry=pack.entries.find(e=>e.id===u.entryId),sourceId=u.sourceId??'source-lot-2-memlia',s=sources.find(x=>x.id===sourceId);
 const initial=prior.unitVerdicts.find(x=>x.id===u.id);
 if(!revised)assert.ok(initial&&['soutient','recevable-methode-memlia'].includes(initial.verdict));
 const reviewAt=revised?checkedAt:prior.checkedAt;
 const i=revised?Number(u.claimId.match(/-f1-(\d+)$/)[1])-1:0;
 const reasoning=revised?specific[u.entryId+':'+u.field][i]:'Avis acquis du 11/10 reporté, preuve historique prior/PREUVE.json, sans nouvelle revue de fond : '+(u.sourceId?acquired[u.entryId]:'Exemple explicitement fictif ou frontière préparatoire recevable : paramètres, appréciation, diligences et conclusions restent au CAC, sans garantie NEP ni preuve de produit livré.');
 assert.ok(reasoning);
 const unitId=`unit-t-${u.entryId}-${u.field}`;
 if(!units.has(unitId))units.set(unitId,{id:unitId,text:entry[u.field],sha256:hash(entry[u.field]),contentPath:'src/data/glossary.ts',contentLocator:u.entryId+':'+u.field,claimIds:[]});
 units.get(unitId).claimIds.push(u.id);assert.ok(entry[u.field].includes(u.text));
 const cs=u.sourceId?u.citations:[{text:u.text,locator:u.entryId+':'+u.field+':convention-editoriale'}],ids=cs.map((x,i)=>`citation-${u.id}-${i+1}`);
 cs.forEach((x,i)=>citations.push({id:ids[i],...x,sourceId,claimIds:[u.id],sha256:hash(x.text),sourceContentSha256:s.contentSha256,finalUrl:s.finalUrl,verdict:'soutient'}));
 claims.push({id:u.id,unitId,text:u.text,sha256:hash(u.text),type:u.type,sourceIds:[sourceId],citationIds:ids,checkedAt:reviewAt,applicability:{population:u.applicability,regime:u.regime,exceptions:u.exceptions,validAsOf:s.checkedAt.slice(0,10),sourceIds:[sourceId]}});
 unitReviews.push({unitId:u.id,entryId:u.entryId,field:u.field,sourceId:u.sourceId??null,verdict:'PASS',checkedAt:reviewAt,reviewMode:revised?'reexamen-F1':'report-revue-initiale-fond-inchange',sourceSupportedText:u.text,reasoning});
 if(u.sourceId)verdicts.push({claimId:u.id,sourceId:u.sourceId,citationIds:ids,sourceContentSha256:s.contentSha256,checkedAt:reviewAt,verdict:'soutient',reasoning});
}
const bundle=sources.map(s=>({path:s.snapshotPath,sha256:s.contentSha256}));sources.filter(s=>s.dilaCopyPath).forEach(s=>bundle.push({path:s.dilaCopyPath,sha256:s.dilaCopySha256}));
const projection={schemaVersion:'resource-manifest-v1',contractRevision:3,formatAdapter:'T',resourceType:'terme',candidate:{canonicalPath:'/glossaire',author:'Memlia',editorialReviewer:'Équipe éditoriale Memlia',fanOut:pack.entries.map(e=>'/glossaire#'+e.anchor)},claimsEvidence:{renderedUnitInventory:[...units.values()],claims,citations,sources,sensitiveMatter:{detected:true,checkedAt}},integrity:{sourceBundle:{entries:bundle,digest:digest(bundle)}},limitations:['Projection du lot CAC 2 seulement, non manifeste global publiable. Réserves A4 et dates réelles conservées. Avis acquis reportés ; réexamen limité à F1 et au critère de fini.']};
const business={required:true,reviewerType:'ai-agent',reviewerProfile:'metier',reviewerId:'t_135675b2',reviewerRole:'reviewer-metier-memlia',distinctFrom:['author','editorialReviewer','sourceClassifier'],reviewedCandidateHash:digest(reviewSubjectDigestPayload(projection)),status:'AI_REVIEW_PASS',claimSourceVerdicts:verdicts};
mkdirSync(root+'review',{recursive:true});writeFileSync(root+'review/business-review.json',JSON.stringify(business,null,2)+'\n');
projection.claimsEvidence.sensitiveMatter.businessReview={...business,evidenceRef:'review/business-review.json',evidenceSha256:hash(readFileSync(root+'review/business-review.json'))};
writeFileSync(root+'review/claims-evidence-projection.json',JSON.stringify(projection,null,2)+'\n');
const counts={entries:pack.entries.length,renderedFields:units.size,unitReviews:unitReviews.length,sensitiveClaimSourceVerdicts:verdicts.length,methodUnitReviews:unitReviews.length-verdicts.length,targetedReviews:unitReviews.filter(x=>x.reviewMode==='reexamen-F1').length,carriedOverReviews:unitReviews.filter(x=>x.reviewMode.startsWith('report-')).length,sources:sources.length,citations:citations.length};
writeFileSync(root+'review/lot-review.json',JSON.stringify({schemaVersion:'glossaire-cac-review-v1',verdict:'PASS',status:'AI_REVIEW_PASS',checkedAt,reviewerType:'ai-agent',reviewerProfile:'metier',reviewerId:'t_135675b2',reviewerRole:'reviewer-metier-memlia',distinctFrom:business.distinctFrom,reviewedPackageSha256:hash(raw),candidatePath:'corrected/'+path,initialReviewRef:'prior/PREUVE.json',initialAuthor:'t_b084bb7e',correctedCandidateAuthor:'t_b92f3e26',baselineMain:'b896a3a37f6a4fbf902d7889fdaf184711d6c573',reviewScope:['F1','critere-de-fini'],defectsResolved:['F1'],canonical:'/glossaire',entryIds:pack.entries.map(e=>e.id),publicationAuthorized:false,counts,unitReviews,claimSourceVerdicts:verdicts},null,2)+'\n');
console.log(JSON.stringify(counts,null,2));
