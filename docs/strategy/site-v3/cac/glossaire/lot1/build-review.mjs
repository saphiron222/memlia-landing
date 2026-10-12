import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {digest,reviewSubjectDigestPayload} from './main/scripts/lib/resource-pipeline.mjs';
import assert from 'node:assert/strict';
const root=new URL('.',import.meta.url).pathname;
const original=readFileSync(root+'candidate/docs/strategy/site-v3/glossaire-cac-lot-1.json');
const pack=JSON.parse(original), prior=JSON.parse(readFileSync('/Users/kevinkitanga/.hermes/kanban/attachments/t_ada6a80c/metier-lot-1/PREUVE-REVUE.json'));
const hash=x=>createHash('sha256').update(x).digest('hex');
const checkedAt=new Date().toISOString();
const specific={
'audit-legal-context-dila-l821-53':'D1 levé : la sous-affirmation ne porte plus que sur la certification. Les alinéas 1 et 2 de L.821-53 la démontrent ; la NEP 200 ne leur est plus attribuée. Réserve A4 conservée.',
'audit-legal-context-h2a-nep-200':'D1 levé : NEP 200 §03, copie ligne 68, définit les principes de l’audit en vue de la certification. Arrêté du 27/11/2024, JO 30/11/2024, A.821-63. Citation relue également sur la page H2A, distincte du claim L.821-53.',
'h2a-commonConfusion-h2a-presentation':'D2 levé : le sujet H2A est explicite. Les lignes 58–59 attestent son statut d’autorité indépendante et ses missions de supervision ; aucun rôle CNCC n’est attribué à cette source.',
'h2a-commonConfusion-cncc-representation':'D2 levé : le sujet CNCC est explicite. La page CNCC lignes 55 et 59 atteste l’instance représentative et désigne la H2A comme régulateur. Le fragment n’est pas présenté comme citation H2A.',
'h2a-commonConfusion-synthese-memlia':'D2 levé : synthèse éditoriale explicitement non normative, sans citation H2A/CNCC fictive, renvoyant aux deux unités factuelles jugées séparément. La distinction des rôles est soutenue, aucune approbation produit déduite.',
'cncc-context-cncc-representation':'D3 levé : seules la représentation professionnelle et la H2A comme régulateur sont attribuées aux lignes 55/59 de la page CNCC. Aucune portée doctrinale de ses publications ne lui est attribuée.',
'cncc-context-frontiere-memlia':'D3 levé : la phrase sur publications et texte normatif est une frontière éditoriale et interprétation de lecture, non une obligation ni une citation institutionnelle. Elle ne qualifie pas juridiquement une publication déterminée.'
};
const sources=Object.entries(pack.evidence.sources).map(([id,s])=>({id,publisher:s.publisher,title:s.title,official:true,level:'tier-1',provenance:'primary',requestedUrl:s.requestedUrl,finalUrl:s.finalUrl,upstreamUrl:s.upstreamUrl??s.requestedUrl,checkedAt:s.retrievedAt,snapshotPath:'candidate/'+s.snapshotPath,contentSha256:s.contentSha256,...(s.dilaCopyPath?{dilaCopyPath:'candidate/'+s.dilaCopyPath,dilaCopySha256:s.dilaCopySha256}:{}),verificationEvidenceRef:s.dilaCopyPath?'candidate/'+s.dilaCopyPath:'candidate/docs/qa/hub-ressources/glossaire-cac-lot-1-sources/captures.json',classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:pack.evidence.units.filter(u=>u.sourceId===id).map(u=>u.id)}));
sources.push({id:'source-lot-1-memlia',publisher:'Memlia',title:'Exemples et frontières éditoriales du lot CAC 1',official:false,level:'original-method',provenance:'primary',requestedUrl:'file://candidate/docs/strategy/site-v3/glossaire-cac-lot-1.json',finalUrl:'file://candidate/docs/strategy/site-v3/glossaire-cac-lot-1.json',checkedAt:pack.preparedAt,snapshotPath:'candidate/docs/strategy/site-v3/glossaire-cac-lot-1.json',contentSha256:hash(original),verificationEvidenceRef:'review/REVUE.md#candidat',classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:pack.evidence.units.filter(u=>!u.sourceId).map(u=>u.id)});
const claims=[],citations=[],units=new Map(),lotVerdicts=[],sensitiveVerdicts=[],unitReviews=[];
for(const u of pack.evidence.units){
 const entry=pack.entries.find(e=>e.id===u.entryId), sourceId=u.sourceId??'source-lot-1-memlia',src=sources.find(s=>s.id===sourceId);
 const priorRow=prior.claimSourceVerdicts.find(v=>v.claimId===u.id)??prior.methodUnitVerdicts.find(v=>v.unitId===u.id);
 const revised=Object.hasOwn(specific,u.id); assert.ok(revised||priorRow);
 if(!revised&&u.sourceId) assert.equal(priorRow.verdict,'soutient');
 const reasoning=revised?specific[u.id]:priorRow.reasoning;
 const reviewAt=revised?checkedAt:priorRow.checkedAt??prior.checkedAt;
 const unitId=`unit-t-${u.entryId}-${u.field}`;
 if(!units.has(unitId)) units.set(unitId,{id:unitId,text:entry[u.field],sha256:hash(entry[u.field]),contentPath:'src/data/glossary.ts',contentLocator:`${u.entryId}:${u.field}`,claimIds:[]});
 units.get(unitId).claimIds.push(u.id); assert.ok(entry[u.field].includes(u.text));
 const cs=u.sourceId?u.citations:[{text:u.text,locator:`${u.entryId}:${u.field}:frontiere-editoriale`}];
 const ids=cs.map((c,i)=>`citation-${u.id}-${i+1}`);
 cs.forEach((c,i)=>citations.push({id:ids[i],...c,sourceId,claimIds:[u.id],sha256:hash(c.text),sourceContentSha256:src.contentSha256,finalUrl:src.finalUrl,verdict:'soutient'}));
 claims.push({id:u.id,unitId,text:u.text,sha256:hash(u.text),type:u.type,sourceIds:[sourceId],citationIds:ids,checkedAt:reviewAt,applicability:{population:u.applicability,regime:u.regime,exceptions:u.exceptions,validAsOf:src.checkedAt.slice(0,10),sourceIds:[sourceId]},...(u.claimSubject?{claimSubject:u.claimSubject}:{}),...(u.evidenceStatus?{evidenceStatus:u.evidenceStatus}:{}),...(u.basedOnUnitIds?{basedOnClaimIds:u.basedOnUnitIds}:{})});
 unitReviews.push({unitId:u.id,entryId:u.entryId,field:u.field,sourceId:u.sourceId??null,verdict:'PASS',checkedAt:reviewAt,reviewMode:revised?'reexamen-D1-D3':'report-revue-initiale-fond-inchange',sourceSupportedText:u.text,reasoning});
 if(u.sourceId){const v={claimId:u.id,sourceId:u.sourceId,citationIds:ids,sourceContentSha256:src.contentSha256,checkedAt:reviewAt,verdict:'soutient',reasoning};lotVerdicts.push(v); if(u.type==='legal-reglementaire') sensitiveVerdicts.push(v);}
}
const bundle=sources.map(s=>({path:s.snapshotPath,sha256:s.contentSha256}));
sources.filter(s=>s.dilaCopyPath).forEach(s=>bundle.push({path:s.dilaCopyPath,sha256:s.dilaCopySha256}));
const projection={schemaVersion:'resource-manifest-v1',contractRevision:3,formatAdapter:'T',resourceType:'terme',candidate:{canonicalPath:'/glossaire',author:'Memlia',editorialReviewer:'Équipe éditoriale Memlia',fanOut:pack.entries.map(e=>'/glossaire#'+e.anchor)},claimsEvidence:{renderedUnitInventory:[...units.values()],claims,citations,sources,sensitiveMatter:{detected:true,checkedAt}},integrity:{sourceBundle:{entries:bundle,digest:digest(bundle)}},limitations:['Projection des preuves du lot 1, pas manifeste global publiable. Réserve A4 et dates de collecte conservées. Revue initiale reportée sur le fond inchangé ; réexamen limité à D1–D3.']};
const businessReview={required:true,reviewerType:'ai-agent',reviewerProfile:'metier',reviewerId:'t_ada6a80c',reviewerRole:'reviewer-metier-memlia',distinctFrom:['author','editorialReviewer','sourceClassifier'],reviewedCandidateHash:digest(reviewSubjectDigestPayload(projection)),status:'AI_REVIEW_PASS',claimSourceVerdicts:sensitiveVerdicts};
mkdirSync(root+'review',{recursive:true});
writeFileSync(root+'review/business-review.json',JSON.stringify(businessReview,null,2)+'\n');
projection.claimsEvidence.sensitiveMatter.businessReview={...businessReview,evidenceRef:'review/business-review.json',evidenceSha256:hash(readFileSync(root+'review/business-review.json'))};
writeFileSync(root+'review/claims-evidence-projection.json',JSON.stringify(projection,null,2)+'\n');
const review={schemaVersion:1,lot:pack.lot,verdict:'PASS',status:'AI_REVIEW_PASS',checkedAt,reviewerProfile:'metier',reviewerId:'t_ada6a80c',reviewerRole:'reviewer-metier-memlia',reviewedPackageSha256:hash(original),baselineMain:readFileSync(root+'baseline-main.txt','utf8').trim(),initialReviewRef:'initial-review/PREUVE-REVUE.json',initialAuthor:'t_33e01ca3',correctedCandidateAuthor:'t_79f71254',reviewScope:['D1','D2','D3','critere-de-fini'],defectsResolved:['D1','D2','D3'],publicationAuthorized:false,counts:{entries:pack.entries.length,unitReviews:unitReviews.length,officialClaimSourceVerdicts:lotVerdicts.length,nativeSensitiveClaimSourceVerdicts:sensitiveVerdicts.length,methodUnitVerdicts:unitReviews.length-lotVerdicts.length,carriedOverReviews:unitReviews.filter(v=>v.reviewMode.startsWith('report-')).length,targetedReviews:7,renderedFields:units.size},unitReviews,claimSourceVerdicts:lotVerdicts};
writeFileSync(root+'review/lot-review.json',JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify(review.counts,null,2));
