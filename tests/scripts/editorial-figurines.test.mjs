import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import sharp from 'sharp';import {parse} from 'parse5';
import {SCENES} from '../../src/data/scenes-figurines.ts';
const manifest=JSON.parse(fs.readFileSync('docs/qa/coherence-figurines/production-images.json'));
const baseline=JSON.parse(fs.readFileSync('docs/qa/coherence-figurines/baseline-pages.json'));
const pageFor=route=>parse(fs.readFileSync(path.join('dist',route==='/'?'index.html':route.slice(1)+'.html'),'utf8'));
const walk=(n,fn)=>{fn(n);for(const c of n.childNodes??[])walk(c,fn)};
const attrs=n=>Object.fromEntries((n.attrs??[]).map(a=>[a.name,a.value]));
test('six scènes distinctes, manifestées et adaptées au poids du site',async()=>{
 assert.equal(manifest.entries.length,6);assert.deepEqual(manifest.entries.map(e=>e.id).sort(),Object.keys(SCENES).sort());const hashes=new Set();
 for(const entry of manifest.entries){assert.equal(entry.route,SCENES[entry.id].route);assert.equal(entry.files.length,4);for(const f of entry.files){const bytes=fs.readFileSync(f.target);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),f.sha256);const m=await sharp(bytes).metadata();assert.equal(m.width,f.width);assert.equal(m.height,f.height);assert.ok(bytes.length<80000,f.target);if(f.width===1200&&f.target.endsWith('webp'))hashes.add(f.sha256);}}
 assert.equal(hashes.size,6);
});
test('le contact garde exactement sa logique, ses présélections et ses consentements',()=>{
 const after=fs.readFileSync('src/pages/contact.astro','utf8');
 assert.match(after,/sessionStorage\.removeItem\('memlia-tache'\)/);
 assert.match(after,/Array\.from\(choixTache\.options\)/);
 const doc=pageFor('/contact');const fields=[];walk(doc,n=>{if(['input','select','textarea'].includes(n.nodeName))fields.push(attrs(n).name)});for(const name of ['nom','cabinet','type_cabinet','courriel','tache_robot','message','consentement','consentement_origine','site_web','origine'])assert.ok(fields.includes(name),name);
});
test('les six pages gardent leurs liens contextuels et leurs ancres utiles',()=>{
 for(const base of baseline.pages){const doc=pageFor(base.route);const ids=new Set(),links=new Set();walk(doc,n=>{const a=attrs(n);if(a.id)ids.add(a.id);if(a.href)links.add(a.href)});
  // Décision A : vidéos retirées. Kevin retire aussi ce paragraphe précis le 15/10 à 14:20.
  const videosRetirees=new Set(['/media/r9/explainer-hero-45s.mp4','/media/cac-r4/explainer-hero-45s.mp4']);
  for(const href of base.hrefs.filter(href=>!videosRetirees.has(href)&&!(base.route==='/methode'&&href==='/automatisation/facture-electronique')))assert.ok(links.has(href),`${base.route} lien perdu : ${href}`);
  for(const id of base.ids.filter(id=>id!=='hero-video-description'))assert.ok(ids.has(id),`${base.route} ancre perdue : ${id}`);
 }
});
test('une scène propre, aucun ancien cadre, des métadonnées complètes pour chaque page',async()=>{
 for(const [id,scene] of Object.entries(SCENES)){const doc=pageFor(scene.route);const images=[],h1=[],metas=[],canonical=[];walk(doc,n=>{const a=attrs(n);if(n.nodeName==='h1')h1.push(n);if(n.nodeName==='img')images.push(a);if(n.nodeName==='meta')metas.push(a);if(a.rel==='canonical')canonical.push(a.href)});
 assert.equal(h1.length,1);assert.equal(images.filter(a=>a.src?.includes('/'+id+'-1200.webp')).length,1);assert.equal(images.filter(a=>a['data-proof']).length,0);assert.equal(canonical[0],'https://memlia.fr'+scene.route);
 const og=metas.find(m=>m.property==='og:image').content;assert.equal(og,`https://memlia.fr/social/illustrations/figurines/${id}-1200.webp.jpg`);const social=await sharp(path.join('dist',new URL(og).pathname)).metadata();assert.equal(social.width,1200);assert.equal(social.height,630);
 }
});
test('les guides conservent leur coque et les pages éditoriales choisissent leur nouvelle coque',()=>{
 assert.match(fs.readFileSync('src/pages/integrations/[slug].astro','utf8'),/import PageCommerciale/);
 for(const name of ['methode','a-propos','garanties','contact'])assert.match(fs.readFileSync(`src/pages/${name}.astro`,'utf8'),/import PageEditoriale/);
});
