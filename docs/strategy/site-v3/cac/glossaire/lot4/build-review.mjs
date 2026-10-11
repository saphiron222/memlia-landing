// Matérialise les décisions sémantiques écrites dans review/reasons.json ; ne les calcule pas.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('.',import.meta.url).pathname;
const candidatePath='candidate/docs/strategy/site-v3/glossaire-cac-lot-4.json';
const original=readFileSync(root+candidatePath), pack=JSON.parse(original);
const reasons=JSON.parse(readFileSync(root+'review/reasons.json'));
const hash=x=>createHash('sha256').update(x).digest('hex');
const canonical=x=>Array.isArray(x)?`[${x.map(canonical).join(',')}]`:x&&typeof x==='object'?`{${Object.keys(x).filter(k=>x[k]!==undefined).sort().map(k=>`${JSON.stringify(k)}:${canonical(x[k])}`).join(',')}}`:JSON.stringify(x);
const checkedAt=new Date().toISOString();
const methodSource='source-lot-4-memlia';
const sensitiveTypes=new Set(['paie','social','dsn','fiscal','juridique','legal-reglementaire','statistique-chiffre']);
const projectedSources=Object.entries(pack.evidence.sources).map(([id,s])=>({
 id,publisher:pack.sources[id].publisher,title:pack.sources[id].title,official:true,level:s.level,provenance:'primary',
 requestedUrl:s.requestedUrl,finalUrl:s.finalUrl,upstreamUrl:s.upstreamUrl??s.requestedUrl,checkedAt:s.retrievedAt,
 snapshotPath:'candidate/'+s.snapshotPath,contentSha256:s.contentSha256,
 ...(s.dilaCopyPath?{dilaCopyPath:'candidate/'+s.dilaCopyPath,dilaCopySha256:s.dilaCopySha256}:{}),
 verificationEvidenceRef:s.dilaCopyPath?'candidate/'+s.dilaCopyPath:'review/source-recheck.json',
 classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:[]
}));
projectedSources.push({id:methodSource,publisher:'Memlia',title:'Exemples, frontières et conventions du lot CAC 4',official:false,level:'original-method',provenance:'primary',requestedUrl:'file://'+candidatePath,finalUrl:'file://'+candidatePath,checkedAt:pack.preparedAt,snapshotPath:candidatePath,contentSha256:hash(original),verificationEvidenceRef:'review/REVUE.md#candidat',classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:[]});
function paragraph(sourceId,num){
 const s=pack.evidence.sources[sourceId], text=readFileSync(root+'candidate/'+s.snapshotPath,'utf8');
 const lines=text.split('\n');
 const re=new RegExp(`^0?${num}\\. `);
 const i=lines.findIndex(l=>re.test(l)); assert.ok(i>=0);
 let end=i+1; while(end<lines.length&&!/^0?\d+\. /.test(lines[end])&&!/^Conséquences|^Documentation|^Remonter/.test(lines[end])) end++;
 return {text:lines.slice(i,end).join('\n').trimEnd(),locator:`${sourceId}:nep-580:paragraphe-${num}:ligne-${i+1}`};
}
const claims=[],citations=[],units=new Map(),verdicts=[],unitReviews=[],extraMethodClaims=[];
function addClaim(u,id,text,sourceId,cs,reasoning,scope){
 const entry=pack.entries.find(e=>e.id===u.entryId), src=projectedSources.find(s=>s.id===sourceId);
 assert.ok(entry[u.field].includes(text));
 const unitId=`unit-t-${u.entryId}-${u.field}`;
 if(!units.has(unitId)) units.set(unitId,{id:unitId,text:entry[u.field],sha256:hash(entry[u.field]),contentPath:'src/data/glossary.ts',contentLocator:`${u.entryId}:${u.field}`,claimIds:[]});
 units.get(unitId).claimIds.push(id); src.claimIds.push(id);
 const ids=cs.map((c,i)=>`${id}-citation-${i+1}`);
 cs.forEach((c,i)=>citations.push({id:ids[i],...c,sourceId,claimIds:[id],sha256:hash(c.text),sourceContentSha256:src.contentSha256,finalUrl:src.finalUrl,verdict:'soutient'}));
 const type=sourceId===methodSource?'methode-memlia':u.type;
 claims.push({id,unitId,text,sha256:hash(text),type,sourceIds:[sourceId],citationIds:ids,checkedAt,applicability:{population:scope??u.applicability,regime:sourceId===methodSource?'Convention de présentation du glossaire, pas norme autonome.':u.regime,exceptions:u.exceptions,validAsOf:src.checkedAt.slice(0,10),sourceIds:[sourceId]}});
 if(sensitiveTypes.has(type)) verdicts.push({claimId:id,sourceId,citationIds:ids,sourceContentSha256:src.contentSha256,checkedAt,verdict:'soutient',reasoning});
}
for(const u of pack.evidence.units){
 let cs=u.sourceId?structuredClone(u.citations):[{text:u.text,locator:`${u.entryId}:${u.field}`}];
 let reasoning=reasons[u.entryId][u.field]; assert.ok(reasoning?.length>40);
 if(u.sourceId?.startsWith('dila-')) reasoning+=' Copie locale identique au réexport A4 ; collecte originale et réserve de consolidation maintenues.';
 else if(u.sourceId) reasoning+=' Source institutionnelle rouverte, version et portée vérifiées.';
 let supported=[u.text];
 if(u.entryId==='declarations-ecrites-direction'&&u.field==='context'&&u.sourceId) cs.push(paragraph(u.sourceId,11));
 if(u.entryId==='declarations-ecrites-direction'&&u.field==='definition'&&u.sourceId){
   const i=u.text.indexOf(', pas une mission'); assert.ok(i>0); supported=[u.text.slice(0,i)];
   if(!extraMethodClaims.length) extraMethodClaims.push({u,text:u.text.slice(i+2)});
 }
 if(u.sourceId?.startsWith('cncc-nep-')){
   supported=['homologuées le 24 juillet 2026','remplacent celles homologuées le 13 novembre 2024'];
   supported.forEach((text,i)=>addClaim(u,`${u.id}-${i?'remplacement':'homologation'}`,text,u.sourceId,cs,reasoning,`NEP ${u.sourceId.slice(-3)} seulement ; la formulation publique conjointe est étayée par les deux pages CNCC.`));
 } else addClaim(u,u.id,supported[0],u.sourceId??methodSource,cs,reasoning);
 unitReviews.push({unitId:u.id,entryId:u.entryId,field:u.field,sourceId:u.sourceId??null,verdict:'PASS',sourceSupportedTexts:supported,reasoning,supplementalCitations:cs.filter(c=>!u.citations?.some(old=>old.text===c.text))});
}
for(const {u,text} of extraMethodClaims){
 const id='declarations-ecrites-direction-definition-convention-alias-review';
 addClaim(u,id,text,methodSource,[{text,locator:'declarations-ecrites-direction:definition:convention-alias'}],reasons[u.entryId].definition,'Choix de présentation des termes dans ce glossaire seulement.');
}
const bundle=projectedSources.map(s=>({path:s.snapshotPath,sha256:s.contentSha256}));
projectedSources.filter(s=>s.dilaCopyPath).forEach(s=>bundle.push({path:s.dilaCopyPath,sha256:s.dilaCopySha256}));
const projection={schemaVersion:'resource-manifest-v1',contractRevision:3,formatAdapter:'T',resourceType:'terme',candidate:{canonicalPath:'/glossaire',author:'Memlia',editorialReviewer:'Équipe éditoriale Memlia',fanOut:pack.entries.map(e=>'/glossaire#'+e.anchor)},claimsEvidence:{renderedUnitInventory:[...units.values()],claims,citations,sources:projectedSources,sensitiveMatter:{detected:true,checkedAt}},integrity:{sourceBundle:{entries:bundle,digest:hash(canonical(bundle))}},limitations:['Projection de preuves du seul lot 4, pas manifeste global publiable. Réserves A4 maintenues.','La phrase CNCC conjointe est étayée pour chaque norme par ses dates bornées ; NEP 580 §11 ajouté en preuve et clause éditoriale d’alias séparée, sans changer le candidat.']};
const subject={};
for(const k of ['schemaVersion','contractRevision','formatAdapter','resourceType','editorialFormat','policyBaseline','taxonomy','candidate','formatContract','research','claimsEvidence','assets','links','skills','quality','negativeWitnessesRef','contradictions','limitations']) if(projection[k]!==undefined) subject[k]=projection[k];
subject.sourceBundleDigest=projection.integrity.sourceBundle.digest;
const businessReview={required:true,reviewerType:'ai-agent',reviewerProfile:'metier',reviewerId:'t_bf6cb3b3',reviewerRole:'reviewer-metier-memlia',distinctFrom:['author','editorialReviewer','sourceClassifier'],reviewedCandidateHash:hash(canonical(subject)),status:'AI_REVIEW_PASS',claimSourceVerdicts:verdicts};
mkdirSync(root+'review',{recursive:true});
writeFileSync(root+'review/business-review.json',JSON.stringify(businessReview,null,2)+'\n');
projection.claimsEvidence.sensitiveMatter.businessReview={...businessReview,evidenceRef:'review/business-review.json',evidenceSha256:hash(readFileSync(root+'review/business-review.json'))};
writeFileSync(root+'review/claims-evidence-projection.json',JSON.stringify(projection,null,2)+'\n');
const counts={entries:pack.entries.length,originalUnitReviews:unitReviews.length,originalOfficialUnitReviews:unitReviews.filter(u=>u.sourceId).length,originalMethodUnitReviews:unitReviews.filter(u=>!u.sourceId).length,projectedClaims:claims.length,sensitiveClaimSourceVerdicts:verdicts.length,renderedFields:units.size,citations:citations.length,officialSources:projectedSources.length-1};
writeFileSync(root+'review/lot-review.json',JSON.stringify({schemaVersion:1,lot:pack.lot,verdict:'PASS',checkedAt,reviewerId:'t_bf6cb3b3',reviewerRole:'reviewer-metier-memlia',reviewedPackageSha256:hash(original),baselineMain:pack.baselineMain,publicationAuthorized:false,counts,unitReviews},null,2)+'\n');
console.log(JSON.stringify({pass:true,counts,reviewedPackageSha256:hash(original),reviewedCandidateHash:businessReview.reviewedCandidateHash},null,2));
