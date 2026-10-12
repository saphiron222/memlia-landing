import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {reviewBindingErrors} from '../../../../scripts/lib/blog-review-binding.mjs';
import {REVIEW_CRITERIA} from '../../../../scripts/lib/blog-pipeline.mjs';
import {IMAGE_REVIEW_CRITERIA} from '../../../../scripts/blog-forge.mjs';
const base='docs/qa/cac-f4-metier/complement-2026-10-12';
const slugs=['automatiser-un-cabinet-cac-la-carte-des-taches','cac-reception-fec-constat'];
const json=p=>JSON.parse(fs.readFileSync(p));
const protectedFiles=json(base+'/INTEGRITE-AVANT.json');
const changes=Object.entries(protectedFiles).filter(([p,h])=>createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h).map(([p])=>p);assert.deepEqual(changes,[]);
const results=[];
for(const slug of slugs){const dir=`editorial/recettes/${slug}`,r=json(dir+'/revues.json');
assert.equal(r.reviewedAt,'2026-10-11');assert.equal(r.cardId,'t_8bb28890');assert.equal(r.verdict,'PASS AVEC RÉSERVES');assert.equal(r.reviewerId,'relecteur-metier-ia-memlia');
for(const k of ['business','sources','historicalEditorial','historicalImage']){assert.equal(r[k].reviewedAt,'2026-10-11');assert.equal(r[k].cardId,'t_8bb28890');}
assert.equal(r.avis.renderedReviewed,false);assert.equal(r.complement.renderedReviewed,true);assert.equal(r.complement.reviewedAt,'2026-10-12');assert.equal(r.complement.cardId,'t_5b379d47');assert.equal(r.complement.newBusinessReview,false);
for(const k of ['editorial','image']){assert.equal(r[k].reviewedAt,'2026-10-12');assert.equal(r[k].cardId,'t_5b379d47');assert.ok(fs.existsSync(r[k].report));}
assert.deepEqual(Object.keys(r.editorial.criteria).sort(),REVIEW_CRITERIA.map(c=>c.id).sort());assert.deepEqual(Object.keys(r.image.criteria).sort(),[...IMAGE_REVIEW_CRITERIA].sort());
for(const row of [...Object.values(r.editorial.criteria),...Object.values(r.image.criteria)]){assert.equal(row.result,'PASS');assert.ok(row.observations.every(o=>o.length>40));}
assert.ok(Object.values(r.historicalEditorial.criteria).every(c=>c.result==='NON_EXAMINE'));assert.equal(Object.values(r.historicalImage.criteria).filter(c=>c.result==='NON_EXAMINE').length,4);
for(const id of ['fictive-provenance','recognizable-subject']){assert.equal(r.image.criteria[id].reviewedAt,'2026-10-11');assert.equal(r.image.criteria[id].cardId,'t_8bb28890');assert.equal(r.historicalImage.criteria[id].result,'PASS');}
assert.equal(r.qualite,undefined);for(const k of ['score','directionArt','semanticRelevance'])assert.equal(r.image[k],undefined);
assert.deepEqual(r.image.reservations,r.historicalImage.reservations);assert.equal(r.publicationApproval,false);assert.equal(r.complement.publicationApproval,false);
const errors=reviewBindingErrors(r,slug,fs.readFileSync(dir+'/corps.md','utf8'),fs.readFileSync(dir+'/recette.json'),fs.readFileSync(`.qa/render-cac-f4/blog/${slug}.html`,'utf8'),process.cwd());assert.deepEqual(errors,[]);
results.push({slug,bindingErrors:errors,complementEditorialCriteria:7,complementImageCriteria:4,acquiredImageCriteria:2,historicalMetadataPreserved:true,scoresInvented:false,publicationApproval:false});}
const proof=json(base+'/CONTROLES-INDEPENDANTS.json');for(const row of proof.results){assert.equal(row.synthetic.imageScore,100);assert.equal(row.synthetic.imageStatus,'PASS');assert.equal(row.synthetic.editorialStatus,'PASS');assert.equal(row.synthetic.editorialDecision,'pret-preview');assert.equal(row.synthetic.business,'PASS');assert.equal(row.synthetic.imageCriteria.filter(c=>c.result==='NON_EXAMINE').length,4);assert.equal(row.synthetic.editorialCriteria.filter(c=>c.result==='NON_EXAMINE').length,7);}
const report={observedAt:new Date().toISOString(),ok:true,protectedFiles:Object.keys(protectedFiles).length,changes,results,forgePresenceIsNotReview:true,scellingPerformed:false,publicationPerformed:false};fs.writeFileSync(base+'/LIAISON-FINALE.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
