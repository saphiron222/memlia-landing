import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('.',import.meta.url).pathname;
const native=readFileSync(root+'baseline/scripts/lib/resource-pipeline.mjs','utf8');
const probe=root+'baseline/scripts/lib/resource-review-claims-probe.mjs';
writeFileSync(probe,native+'\nexport { validateClaims as reviewValidateClaims };\n');
const {reviewValidateClaims,digest,reviewSubjectDigestPayload}=await import(pathToFileURL(probe));
const manifest=JSON.parse(readFileSync(root+'review/claims-evidence-projection.json'));manifest.__root=root;
const errors=[];const result=reviewValidateClaims(manifest,'qa',errors);
assert.deepEqual(errors,[]);
assert.equal(digest(reviewSubjectDigestPayload(manifest)),manifest.claimsEvidence.sensitiveMatter.businessReview.reviewedCandidateHash);
const mutations=[];
for(const [name,mutate] of [
 ['unité sensible manquante',m=>m.claimsEvidence.claims.splice(0,1)],
 ['citation fabriquée',m=>m.claimsEvidence.citations[0].text='Citation fictive de test négatif'],
 ['avis absent',m=>m.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts.splice(0,1)],
 ['reviewer auteur',m=>m.candidate.author='t_135675b2'],
 ['copie DILA redatée',m=>m.claimsEvidence.sources.find(s=>s.dilaCopyPath).checkedAt=new Date().toISOString()],
 ['extension du sous-claim',m=>m.claimsEvidence.claims.find(c=>c.id.includes('commonConfusion')).text='Tout fichier est fiable sans contrôle'],
]){
 const m=structuredClone(manifest);mutate(m);const es=[];reviewValidateClaims(m,'qa',es);assert.ok(es.length>0,name);mutations.push({name,rejected:true,errorCount:es.length});
}
const report={pass:true,scope:'Sous-contrat validateClaims et digest natifs ; projection réelle du lot 2, pas manifeste global de publication.',nativeLibrarySha256:createHash('sha256').update(native).digest('hex'),counts:{renderedFields:result.units.size,claims:result.claims.size,citations:result.citations.size,sources:result.sources.size,sensitiveVerdicts:manifest.claimsEvidence.sensitiveMatter.businessReview.claimSourceVerdicts.length},errors,mutations};
writeFileSync(root+'review/claims-check.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
