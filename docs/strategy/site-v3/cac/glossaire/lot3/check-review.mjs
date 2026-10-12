import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('.',import.meta.url).pathname;
const library=root+'fresh-main/scripts/lib/resource-pipeline.mjs';
const native=readFileSync(library,'utf8');
const probe=root+'fresh-main/scripts/lib/resource-review-claims-probe.mjs';
writeFileSync(probe,native+'\nexport { validateClaims as reviewValidateClaims };\n');
const {reviewValidateClaims,digest,reviewSubjectDigestPayload}=await import(pathToFileURL(probe));
const manifest=JSON.parse(readFileSync(root+'review/claims-evidence-projection.json'));
manifest.__root=root;
const errors=[];
const result=reviewValidateClaims(manifest,'qa',errors);
assert.deepEqual(errors,[]);
assert.equal(digest(reviewSubjectDigestPayload(manifest)),manifest.claimsEvidence.sensitiveMatter.businessReview.reviewedCandidateHash);
const sha=x=>createHash('sha256').update(x).digest('hex');
assert.equal(sha(readFileSync(root+'candidate/docs/strategy/site-v3/glossaire-cac-lot-3.json')),sha(readFileSync('/Users/kevinkitanga/.hermes/kanban/attachments/t_0d1dd807/glossaire-cac-lot-3.json')));
const mutations=[];
for(const [name,mutate] of [
 ['unité sensible manquante',m=>m.claimsEvidence.claims.splice(0,1)],
 ['citation inventée',m=>m.claimsEvidence.citations[0].text='Citation réglementaire fabriquée pour essai négatif'],
 ['avis absent',m=>m.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts.splice(0,1)],
 ['reviewer auteur',m=>m.candidate.author='t_f87ddaa1'],
 ['copie DILA redatée',m=>m.claimsEvidence.sources.find(s=>s.dilaCopyPath).checkedAt=new Date().toISOString()],
 ['confusion auto-validée',m=>m.claimsEvidence.claims.find(c=>c.id.includes('commonConfusion')).text='Tout retour reçu est probant'],
]){
 const m=structuredClone(manifest); mutate(m); const es=[]; reviewValidateClaims(m,'qa',es);
 assert.ok(es.length>0,name); mutations.push({name,rejected:true,errorCount:es.length});
}
const report={pass:true,scope:'Fonction validateClaims native de resource-pipeline et digest natif exercés sur une projection réelle du lot 3 ; pas validation d’un manifeste global ni autorisation de publication.',librarySha256:sha(native),projectionCounts:{renderedFields:result.units.size,claims:result.claims.size,citations:result.citations.size,sources:result.sources.size,sensitiveVerdicts:manifest.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts.length},errors,mutations,candidateUnchanged:true};
writeFileSync(root+'review/claims-check.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
