import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import sharp from 'sharp';
const dir='editorial/recettes/utiliser-chatgpt-cabinet-comptable', art='editorial/articles/utiliser-chatgpt-cabinet-comptable';
const read=p=>JSON.parse(readFileSync(p,'utf8')), hash=b=>createHash('sha256').update(b).digest('hex');
const v=read(dir+'/revue-verification.json'),m=read(dir+'/couverture-skills.json'),cat=read(dir+'/catalogue-hermes.json').skills;
const diagnostic=read('docs/strategy/site-v3/mesures/diagnostic-2026-10-03/couverture-livraison.json');
const expected=[...cat.filter(s=>/^(blog|seo)(-|$)/.test(s.name)).map(s=>s.name),...diagnostic.difference_catalogue.pack_absents_catalogue];
const actual=m.lignes.map(l=>l.skill);
const coverage={expected:expected.length,actual:actual.length,missing:expected.filter(s=>!actual.includes(s)),extra:actual.filter(s=>!expected.includes(s)),changedSkills:m.lignes.filter(l=>hash(readFileSync(l.chemin_charge))!==l.version_sha256).map(l=>l.skill)};
assert.equal(expected.length,63);assert.deepEqual(coverage.missing,[]);assert.deepEqual(coverage.extra,[]);assert.deepEqual(coverage.changedSkills,[]);
const receipts=[];for(const id of ['cnil-ia-generative','ordre-ia']){const r=read(art+'/preuves/sources/'+id+'.json');const valid=hash(readFileSync(art+'/'+r.contentPath))===r.contentSha256;assert(valid);receipts.push({id,status:r.httpStatus,retrievedAt:r.retrievedAt,valid});}
const images=[];for(const p of [art+'/preuves/image/master.png',art+'/preuves/image/og.webp',art+'/preuves/image/hero-768.avif','public/proofs/blog/usage-fiche-selection.webp','public/proofs/blog/usage-file-essais.webp']){const meta=await sharp(p).metadata();images.push({path:p,width:meta.width,height:meta.height,format:meta.format});}
const summary={coverage,receipts,images,sources:v.sources,replay:v.replay,additionalCases:v.additionalCases,browser:v.browser.map(({text,schema,tables,images,...r})=>({...r,tables:tables.map(({text,...t})=>t),schemaTypes:schema.flatMap(s=>s['@graph']||[s]).map(s=>s['@type'])})),matrixStates:v.matrix.states};
writeFileSync(dir+'/revue-complements.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
