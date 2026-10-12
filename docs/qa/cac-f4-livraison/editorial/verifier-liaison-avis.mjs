import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {construireClaims,injecterPreuvesInline,corpsSansTitreDuplique,verifierRegleEcrite} from '../../../../scripts/blog-forge.mjs';
import {reviewBindingErrors,reviewSha256} from '../../../../scripts/lib/blog-review-binding.mjs';
const base='docs/qa/cac-f4-livraison/liaison-avis';fs.mkdirSync(base,{recursive:true});
const slugs=['automatiser-un-cabinet-cac-la-carte-des-taches','cac-reception-fec-constat'];
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const protectedFiles=[];
for(const s of slugs){protectedFiles.push(`editorial/recettes/${s}/corps.md`,`editorial/recettes/${s}/recette.json`,`editorial/articles/${s}/claims.json`);for(const dir of [`editorial/articles/${s}/preuves/sources`,`editorial/recettes/${s}/preuves`]){for(const f of fs.readdirSync(dir)){const p=path.join(dir,f);if(fs.statSync(p).isFile())protectedFiles.push(p);}}}
for(const f of ['cac-inventaire-taches','cac-fiche-regle','cac-fec-registre-reception','cac-fec-constat'])protectedFiles.push(`public/proofs/blog/${f}.webp`);
const snapshot=Object.fromEntries(protectedFiles.map(p=>[p,reviewSha256(fs.readFileSync(p))]));
if(process.argv.includes('--baseline')){fs.writeFileSync(`${base}/INTEGRITE-AVANT.json`,JSON.stringify(snapshot,null,2)+'\n');console.log('Intégrité avant liaison : enregistrée');process.exit(0);}
assert.deepEqual(snapshot,json(`${base}/INTEGRITE-AVANT.json`),'Corps/recettes/claims/sources/figures modifiés');
const required=[{'unit-a8b93ddd7abd':1,'unit-0965ce7da77b':2,'unit-77849f5f3eff':3},{'unit-bc18e9499a79':2}];
const results=[];
for(const [i,s] of slugs.entries()){
 const dir=`editorial/recettes/${s}`,body=fs.readFileSync(`${dir}/corps.md`,'utf8'),recipeBytes=fs.readFileSync(`${dir}/recette.json`),recipe=JSON.parse(recipeBytes),actual=json(`editorial/articles/${s}/claims.json`),review=json(`${dir}/revues.json`),html=fs.readFileSync(`.qa/render-cac-f4/blog/${s}/index.html`,'utf8');
 const rebuilt=construireClaims({recette:recipe,corps:injecterPreuvesInline(corpsSansTitreDuplique(body.trim(),recipe.title),recipe.inlineProofs),dossier:path.resolve(`editorial/articles/${s}`),sujet:{slug:s,articleHash:actual.articleSha256},jour:actual.claims[0].checkedAt});
 assert.deepEqual(rebuilt.erreurs,[]);assert.deepEqual(rebuilt.claims,actual,'Registre produit divergent du rejeu forge');assert.equal(actual.claims.length,[10,5][i]);
 for(const [unit,count] of Object.entries(required[i]))assert.equal(actual.contentUnits.find(u=>u.id===unit)?.claimIds.length,count);
 const bindingErrors=reviewBindingErrors(review,s,body,recipeBytes,html,process.cwd());assert.deepEqual(bindingErrors,[]);
 assert.equal(review.reviewerId,'relecteur-metier-ia-memlia');assert.equal(review.reviewedAt,'2026-10-11');assert.equal(review.verdict,'PASS AVEC RÉSERVES');assert.equal(review.cardId,'t_8bb28890');assert.equal(review.avis.sha256,reviewSha256(fs.readFileSync(review.avis.path)));
 assert.deepEqual(Object.keys(review.business.claims).sort(),actual.claims.map(c=>c.id).sort());
 for(const c of actual.claims){const r=review.business.claims[c.id];assert.equal(r.verdict,'soutient');assert.equal(r.claim,c.claim);assert.deepEqual(r.evidence.sourceExcerpts,c.sourceExcerpts);assert.ok(r.reasoning.includes('sans nouvel avis'));for(const sourceId of c.sourceIds){const dir=`editorial/articles/${s}/preuves/sources`,receipt=json(`${dir}/${sourceId}.json`),copy=fs.readFileSync(`${dir}/${sourceId}.source.txt`,'utf8');assert.equal(reviewSha256(copy),receipt.contentSha256);assert.ok(copy.includes(c.sourceExcerpts[sourceId]));}}
 assert.equal(review.qualite,undefined);for(const k of ['directionArt','semanticRelevance','score'])assert.equal(review.image[k],undefined);
 const r1Claims=actual.claims.filter(c=>required[i][c.unitId]);const context=r1Claims.map(c=>c.factCheck.sourceResults[0].explanation+' '+review.business.claims[c.id].reasoning).join('\n');for(const token of ['NEP330','§33','§34 e)'])assert.ok(context.includes(token));if(i===0)for(const token of ['§10','entre signature','approbation','refus','soixante jours','§48'])assert.ok(context.includes(token));
 const ruleErrors=verifierRegleEcrite(body,recipe);assert.deepEqual(ruleErrors,[]);
 results.push({slug:s,claims:actual.claims.length,preflightErrors:rebuilt.erreurs,ruleErrors,bindingErrors,R1Units:required[i],claimsSourceHashesVerified:true,actualRegistryEqualsForgeReplay:true,verdictAcquis:review.verdict,publicationApproval:false});
}
const result={kind:'verification-mecanique-R1-et-liaison',newIndependentReview:false,protectedFilesUnchanged:true,results};fs.writeFileSync(`${base}/VERIFICATION-R1-LIAISON.json`,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
