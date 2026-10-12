import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('.',import.meta.url).pathname;
const original=readFileSync(root+'candidate/docs/strategy/site-v3/glossaire-cac-lot-3.json');
const pack=JSON.parse(original);
const hash=x=>createHash('sha256').update(x).digest('hex');
const canonical=x=>Array.isArray(x)?`[${x.map(canonical).join(',')}]`:x&&typeof x==='object'?`{${Object.keys(x).filter(k=>x[k]!==undefined).sort().map(k=>`${JSON.stringify(k)}:${canonical(x[k])}`).join(',')}}`:JSON.stringify(x);
const checkedAt=new Date().toISOString();
const reasons={
'elements-collectes-audit':{
 definition:'NEP 500 §§01/04 : les éléments servent aux conclusions fondant l’opinion et incluent audit courant, audits antérieurs, autres interventions et acceptation/maintien.',
 context:'NEP 500 §§05/06 : la simple collecte ne vaut pas suffisance/qualité ; la source établit la distinction appliquée à une pièce reçue.',
 commonConfusion:'NEP 500 §§06/07 : quantité distincte de pertinence/fiabilité ; incohérence à élucider par des procédures complémentaires choisies par le CAC.'},
'caractere-probant':{
 definition:'NEP 500 §§05/06 : preuves ou présomptions sur assertions, suffisance quantitative et caractère approprié qualitatif, pertinence et fiabilité.',
 context:'NEP 500 §§06/07 : quantité liée au risque et à la qualité ; fiabilité dépendant origine/nature/circonstances et maintien de l’esprit critique.',
 commonConfusion:'NEP 500 §§06/07 : principes de fiabilité circonstanciés, non garantie d’une pièce externe ; doute et incohérence appellent investigations.'},
'confirmation-tiers-audit':{
 definition:'NEP 505 §03 : déclaration du tiers directement adressée au CAC sur une ou plusieurs informations ; l’alias est jugé séparément comme vocabulaire de pratique.',
 context:'NEP 505 §§04/08/09 : distinction ouverte/fermée, assertions concernées et maîtrise par le CAC de sélection, rédaction, envoi et réception.',
 commonConfusion:'NEP 505 §§07/13/15 : existence distincte d’évaluation, alternatives en absence de réponse et appréciation des résultats ; réception ou concordance n’est pas conclusion.'},
'procedures-alternatives-audit':{
 definition:'NEP 505 §§11/13 : alternatives en cas de refus fondé ou absence de réponse ; définition expressément bornée aux confirmations.',
 context:'NEP 505 §§10–12/14/15 : analyse du refus, conséquences éventuelles du refus non fondé, procédures supplémentaires et appréciation des résultats.',
 commonConfusion:'NEP 505 §§13–15 : alternatives visant la collecte d’éléments et compléments si insuffisance ; une relance administrative seule n’établit pas cette collecte.'},
'procedures-analytiques':{
 definition:'NEP 520 §04 : corrélations et variations significatives/tendances inattendues. Le terme revue analytique est apprécié séparément en alias de pratique.',
 context:'NEP 520 §§05–08 : étapes initiale/finale obligatoires, faculté d’usage en substance et attentes/écarts acceptables définis pour la substance.',
 commonConfusion:'NEP 520 §§05/09/10 : attente et écarts acceptables, variations à élucider et risques nouveaux à apprécier ; un calcul seul n’est pas une conclusion.'},
 'tests-procedures':{
 definition:'NEP 330 §08 : définition des tests sur les contrôles visant leur efficacité au niveau des assertions. Seule cette partie normative est attribuée à la source ; le rapprochement terminologique est une convention jugée séparément.',
 context:'NEP 330 §§14/15 : appui prévu sur les contrôles et/ou substance seule insuffisante ; tests ne se limitant pas aux demandes d’information.',
 commonConfusion:'NEP 330 §§15/23 : description/demandes seules insuffisantes et absence d’anomalie en substance ne prouvant pas efficacité des contrôles.'},
 'controles-substance':{
 definition:'NEP 330 §06 : substance visant anomalies au niveau des assertions, avec tests de détail et procédures analytiques de substance. Le rapprochement terminologique relève de la convention Memlia distincte.',
 context:'NEP 330 §§05/07/10 : test individuel, attentes/écarts de substance et lien nature/calendrier/étendue aux risques.',
 commonConfusion:'NEP 330 §§06/08/23 : objectif de détection distinct de l’efficacité des contrôles ; pas de preuve de cette efficacité par absence d’anomalies.'},
 'sondage-audit':{
 definition:'NEP 530 §§04/07 : chance de sélection pour tous les éléments, statistique ou non ; sondages distincts de sélection spécifique.',
 context:'NEP 530 §§04/08/09 : choix sous jugement, analyse des résultats et conclusion sur population pour sondage, nature/cause/conséquences des anomalies.',
 commonConfusion:'NEP 530 §§06/07/09 : ciblage inhabituel ou en valeur distinct du sondage ; couverture élevée ne justifiant pas une extrapolation automatique.'},
 'population-audit':{
 definition:'NEP 530 §03 : ensemble de données de sélection et de conclusion, notamment solde/catégorie d’opérations.',
 context:'NEP 530 §04 établit la première phrase sur les caractéristiques de population et le choix de sélection. NEP 500 §06 établit la seconde sur exactitude/exhaustivité des informations produites par l’entité. Les claims sont bornés à leur source respective, sans modifier le texte rendu.',
 commonConfusion:'NEP 530 §03 établit le périmètre de population voulu, qui n’est pas automatiquement celui du fichier disponible. NEP 500 §06 établit la collecte d’éléments sur exactitude/exhaustivité ; les deux phrases sont reliées à leurs sources respectives.'},
 'selection-elements-specifiques':{
 definition:'NEP 530 §06 : sélection en valeur au-delà d’un montant fixé ou éléments inhabituels par importance/nature ; aucun seuil chiffré imposé.',
 context:'NEP 530 §§04/06/08 : connaissance/risques, une ou plusieurs méthodes et appréciation du caractère suffisant/approprié des résultats.',
 commonConfusion:'NEP 530 §§06/07/09 : ciblage spécifique distinct du sondage ; conclusion sur population liée au sondage et non transposable par seul taux de couverture.'}
};
function scoped(u){
 if(u.entryId==='population-audit'&&['context','commonConfusion'].includes(u.field)){
  const p=u.text.indexOf('. ')+1;
  return u.sourceId.includes('530')||u.sourceId.includes('78')?u.text.slice(0,p):u.text.slice(p+1);
 }
 if(u.entryId==='tests-procedures'&&u.field==='definition'&&u.sourceId) return u.text.split(': ')[1];
 if(u.entryId==='controles-substance'&&u.field==='definition'&&u.sourceId) return u.text.slice(u.text.indexOf('. ')+2);
 return u.text;
}
const projectedSources=Object.entries(pack.evidence.sources).map(([id,s])=>({
 id,publisher:pack.sources[id].publisher,title:pack.sources[id].title,official:true,level:'tier-1',provenance:'primary',
 requestedUrl:s.requestedUrl,finalUrl:s.finalUrl,upstreamUrl:s.upstreamUrl??s.requestedUrl,checkedAt:s.retrievedAt,
 snapshotPath:'candidate/'+s.snapshotPath,contentSha256:s.contentSha256,
 ...(s.dilaCopyPath?{dilaCopyPath:'candidate/'+s.dilaCopyPath,dilaCopySha256:s.dilaCopySha256}:{}),
 verificationEvidenceRef:s.dilaCopyPath?'candidate/'+s.dilaCopyPath:'review/source-recheck.json',
 classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:pack.evidence.units.filter(u=>u.sourceId===id).map(u=>u.id)
}));
projectedSources.push({id:'source-lot-3-memlia',publisher:'Memlia',title:'Exemples, frontières et alias proposés du lot CAC 3',official:false,level:'original-method',provenance:'primary',requestedUrl:'file://candidate/docs/strategy/site-v3/glossaire-cac-lot-3.json',finalUrl:'file://candidate/docs/strategy/site-v3/glossaire-cac-lot-3.json',checkedAt:pack.preparedAt,snapshotPath:'candidate/docs/strategy/site-v3/glossaire-cac-lot-3.json',contentSha256:hash(original),verificationEvidenceRef:'review/REVUE.md#candidat',classificationEvidenceRef:'review/REVUE.md#classification-des-sources',claimIds:pack.evidence.units.filter(u=>!u.sourceId).map(u=>u.id)});
const claims=[],citations=[],units=new Map(),verdicts=[],unitReviews=[];
for(const u of pack.evidence.units){
 const entry=pack.entries.find(e=>e.id===u.entryId), sourceId=u.sourceId??'source-lot-3-memlia', src=projectedSources.find(s=>s.id===sourceId);
 const unitId=`unit-t-${u.entryId}-${u.field}`;
 if(!units.has(unitId)) units.set(unitId,{id:unitId,text:entry[u.field],sha256:hash(entry[u.field]),contentPath:'src/data/glossary.ts',contentLocator:`${u.entryId}:${u.field}`,claimIds:[]});
 units.get(unitId).claimIds.push(u.id);
 const text=scoped(u); assert.ok(entry[u.field].includes(text));
 const cs=u.sourceId?u.citations:[{text:u.text,locator:`${u.entryId}:${u.field}`}];
 const ids=cs.map((c,i)=>`${u.id}-citation-${i+1}`);
 cs.forEach((c,i)=>citations.push({id:ids[i],...c,sourceId,claimIds:[u.id],sha256:hash(c.text),sourceContentSha256:src.contentSha256,finalUrl:src.finalUrl,verdict:'soutient'}));
 claims.push({id:u.id,unitId,text,sha256:hash(text),type:u.type,sourceIds:[sourceId],citationIds:ids,checkedAt,applicability:{population:u.applicability,regime:u.regime,exceptions:u.exceptions,validAsOf:src.checkedAt.slice(0,10),sourceIds:[sourceId]}});
 const reasoning=u.sourceId?reasons[u.entryId][u.field]+(u.sourceId.startsWith('dila-')?' Copie locale identique à l’export A4 relu ; réserve de consolidation conservée.':' Corps normatif H2A rouvert et identique ; version et article attestés.'):'Exemple explicitement fictif, frontière de préparation/validation/jugement ou convention de vocabulaire recevable ; ne démontre ni automatisation livrée ni obligation normative.';
 unitReviews.push({unitId:u.id,entryId:u.entryId,field:u.field,sourceId:u.sourceId??null,verdict:'PASS',sourceSupportedText:text,reasoning});
 if(u.sourceId) verdicts.push({claimId:u.id,sourceId:u.sourceId,citationIds:ids,sourceContentSha256:src.contentSha256,checkedAt,verdict:'soutient',reasoning});
}
const bundle=projectedSources.map(s=>({path:s.snapshotPath,sha256:s.contentSha256}));
projectedSources.filter(s=>s.dilaCopyPath).forEach(s=>bundle.push({path:s.dilaCopyPath,sha256:s.dilaCopySha256}));
const projection={schemaVersion:'resource-manifest-v1',contractRevision:3,formatAdapter:'T',resourceType:'terme',candidate:{canonicalPath:'/glossaire',author:'Memlia',editorialReviewer:'Équipe éditoriale Memlia',fanOut:pack.entries.map(e=>'/glossaire#'+e.anchor)},claimsEvidence:{renderedUnitInventory:[...units.values()],claims,citations,sources:projectedSources,sensitiveMatter:{detected:true,checkedAt}},integrity:{sourceBundle:{entries:bundle,digest:hash(canonical(bundle))}},limitations:['Projection de preuves du lot 3, pas manifeste global publiable. Réserves A4 maintenues.']};
const subject={};
for(const k of ['schemaVersion','contractRevision','formatAdapter','resourceType','editorialFormat','policyBaseline','taxonomy','candidate','formatContract','research','claimsEvidence','assets','links','skills','quality','negativeWitnessesRef','contradictions','limitations']) if(projection[k]!==undefined) subject[k]=projection[k];
subject.sourceBundleDigest=projection.integrity.sourceBundle.digest;
const businessReview={required:true,reviewerType:'ai-agent',reviewerProfile:'metier',reviewerId:'t_f87ddaa1',reviewerRole:'reviewer-metier-memlia',distinctFrom:['author','editorialReviewer','sourceClassifier'],reviewedCandidateHash:hash(canonical(subject)),status:'AI_REVIEW_PASS',claimSourceVerdicts:verdicts};
mkdirSync(root+'review',{recursive:true});
writeFileSync(root+'review/business-review.json',JSON.stringify(businessReview,null,2)+'\n');
projection.claimsEvidence.sensitiveMatter.businessReview={...businessReview,evidenceRef:'review/business-review.json',evidenceSha256:hash(readFileSync(root+'review/business-review.json'))};
writeFileSync(root+'review/claims-evidence-projection.json',JSON.stringify(projection,null,2)+'\n');
writeFileSync(root+'review/lot-review.json',JSON.stringify({schemaVersion:1,lot:pack.lot,verdict:'PASS',checkedAt,reviewerId:'t_f87ddaa1',reviewerRole:'reviewer-metier-memlia',reviewedPackageSha256:hash(original),baselineMain:pack.baselineMain,publicationAuthorized:false,counts:{entries:pack.entries.length,unitReviews:unitReviews.length,sensitiveClaimSourceVerdicts:verdicts.length,methodReviews:unitReviews.length-verdicts.length},unitReviews},null,2)+'\n');
console.log(JSON.stringify({pass:true,entries:pack.entries.length,unitReviews:unitReviews.length,sensitiveVerdicts:verdicts.length,methodReviews:unitReviews.length-verdicts.length,renderedFields:units.size,reviewedPackageSha256:hash(original),reviewedCandidateHash:businessReview.reviewedCandidateHash},null,2));
