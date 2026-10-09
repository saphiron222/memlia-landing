import assert from 'node:assert/strict';
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { materialiser } from '../../../scripts/blog-forge.mjs';
import { validateDossier } from '../../../scripts/lib/blog-pipeline.mjs';
import { reviewBindingErrors } from '../../../scripts/lib/blog-review-binding.mjs';
const root=process.cwd(),slug='automatiser-avec-ia-sans-changer-logiciel',dir=resolve(root,'editorial/recettes',slug);
const review=JSON.parse(readFileSync(resolve(dir,'revues.json'),'utf8'));
const rendered=readFileSync(resolve(root,'.qa/revue-'+slug,'blog',slug+'.html'),'utf8');
assert.deepEqual(reviewBindingErrors(review,slug,readFileSync(resolve(dir,'corps.md'),'utf8'),readFileSync(resolve(dir,'recette.json')),rendered),[]);
const total=Object.values(review.qualite.categories).reduce((sum,row)=>{assert.ok(row.score<=row.max);return sum+row.score;},0);
assert.equal(total,review.qualite.score);
for(const artifact of review.verificationArtifacts)assert.ok(existsSync(resolve(dir,artifact)),artifact);
// Fixture non Git, hors candidat, pour la consommation native de revues.json uniquement.
// Ni ce bac ni son gate ne prouvent une autorisation de publication ou la fraîcheur de main.
const fixture=resolve(root,'.qa/forge-fixture-t_003f2bb5');mkdirSync(fixture,{recursive:true});
for(const folder of ['src','scripts','editorial','docs/strategy/site-v3'])cpSync(resolve(root,folder),resolve(fixture,folder),{recursive:true});
for(const filename of ['package.json','astro.config.mjs'])if(existsSync(resolve(root,filename)))cpSync(resolve(root,filename),resolve(fixture,filename));
for(const id of ['passage-registre','passage-reprises']){const path='public/proofs/blog/'+id+'.webp';mkdirSync(dirname(resolve(fixture,path)),{recursive:true});cpSync(resolve(root,path),resolve(fixture,path));}
for(const width of [768,1200,1600])for(const format of ['webp','avif']){const path='public/images/img-art-'+slug+'-'+width+'.'+format;mkdirSync(dirname(resolve(fixture,path)),{recursive:true});cpSync(resolve(root,path),resolve(fixture,path));}
cpSync(resolve(root,'public/images/img-art-'+slug+'-og.webp'),resolve(fixture,'public/images/img-art-'+slug+'-og.webp'));
const prepared=await materialiser({root:fixture,slug,statut:'pret-preview'});
assert.deepEqual(prepared.erreurs,[]);
const gate=await validateDossier({root:fixture,slug,renderedArticleHtml:rendered,renderedBlogHtml:readFileSync(resolve(root,'.qa/revue-'+slug,'blog.html'),'utf8')});
const result={reviewerTaskId:'t_003f2bb5',checkedAt:new Date().toISOString(),scope:'Consommation native de revue dans fixture non Git, aucune écriture ou scellement du candidat, aucune intégration ou publication prouvée.',reviewBindingErrors:[],qualityTotal:total,materialiserErrors:prepared.erreurs,gate};
writeFileSync(resolve(dir,'revue-forge.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
assert.equal(gate.pass,true,JSON.stringify(gate));
