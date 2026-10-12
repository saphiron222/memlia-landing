import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {parse} from 'parse5';
import {createServer} from 'node:http';
import {chromium} from '@playwright/test';
import {construireManifest, IMAGE_REVIEW_CRITERIA} from '../../../../scripts/blog-forge.mjs';
import {REVIEW_CRITERIA} from '../../../../scripts/lib/blog-pipeline.mjs';
const out='docs/qa/cac-f4-metier/complement-2026-10-12';fs.mkdirSync(out,{recursive:true});
const slugs=['automatiser-un-cabinet-cac-la-carte-des-taches','cac-reception-fec-constat'];
const forge=fs.readFileSync('scripts/blog-forge.mjs','utf8');
const walk=n=>[n,...(n.childNodes??[]).flatMap(walk)],attr=(n,k)=>n.attrs?.find(a=>a.name===k)?.value,text=n=>n.nodeName==='#text'?n.value:(n.childNodes??[]).map(text).join('');
const dist=path.resolve('.qa/render-cac-f4');
const route=p=>[dist+p,dist+p+'.html',dist+p+'/index.html'].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
const server=createServer((req,res)=>{const p=route(new URL(req.url,'http://local').pathname);if(!p){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':path.extname(p)==='.html'?'text/html':path.extname(p)==='.css'?'text/css':'application/octet-stream'});res.end(fs.readFileSync(p));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true});const results=[];
try {for(const slug of slugs){
 const recipe=JSON.parse(fs.readFileSync(`editorial/recettes/${slug}/recette.json`));const review=JSON.parse(fs.readFileSync(`editorial/recettes/${slug}/revues.json`));
 const writes={};const sandbox={join:path.join,dossier:slug,imageDir:slug+'/image',sujet:{slug,articleHash:'probe',manifestHash:'probe'},jour:'2026-10-12',revueImage:review.image,palette:null,IMAGE_REVIEW_CRITERIA,recette:recipe,engine:'html-original',ecrireJson:(p,v)=>{writes[p]=v;},artefact:(_s,_k,_j,v)=>v};
 const block=forge.slice(forge.indexOf("  ecrireJson(join(imageDir, 'visual-review.json')"),forge.indexOf('  return erreursImage;'));
 vm.runInNewContext(block,sandbox);
 assert.equal(writes[slug+'/image.json'].score,100);assert.equal(writes[slug+'/image/visual-review.json'].status,'PASS');
 const editorialWrites={};vm.runInNewContext(forge.slice(forge.indexOf('  const editorial = revuesValides?.editorial;'),forge.indexOf('  const business = revuesValides?.business;')),{slug,join:path.join,dossier:slug,sujet:{slug,articleHash:'probe',manifestHash:'probe'},jour:'2026-10-12',revuesValides:review,manifestFinal:{reviewer:review.reviewerId},REVIEW_CRITERIA,ecrireJson:(p,v)=>editorialWrites[p]=v,artefact:(_s,_k,_j,v)=>v});
 const synthetic={business:construireManifest(recipe,'a-valider','2026-10-12',{business:{}}).businessReview.status,imageStatus:writes[slug+'/image/visual-review.json'].status,imageScore:writes[slug+'/image.json'].score,imageCriteria:writes[slug+'/image/visual-review.json'].criteria.map(c=>({id:c.id,result:c.result})),editorialStatus:editorialWrites[slug+'/preuves/review.json'].status,editorialDecision:editorialWrites[slug+'/review.json'].decision,editorialCriteria:editorialWrites[slug+'/preuves/review.json'].criteria};
 const html=fs.readFileSync(route('/blog/'+slug),'utf8');const nodes=walk(parse(html));const art=nodes.find(n=>(attr(n,'class')??'').split(' ').includes('article-corps'));assert.ok(art);const inside=walk(art);
 const headings=nodes.filter(n=>/^h[1-6]$/.test(n.tagName??''));assert.equal(headings.filter(n=>n.tagName==='h1').length,1);
 const localAssets=nodes.filter(n=>n.tagName==='img').map(n=>attr(n,'src'));for(const n of nodes.filter(n=>['img','source'].includes(n.tagName)))for(const url of (attr(n,'srcset')??'').split(',').map(x=>x.trim().split(' ')[0]).filter(Boolean))localAssets.push(url);
 for(const n of nodes.filter(n=>n.tagName==='meta'&&['og:image','twitter:image'].includes(attr(n,'property')??attr(n,'name'))))localAssets.push(new URL(attr(n,'content')).pathname);
 const assets=[];for(const p of [...new Set(localAssets)]){assert.ok(route(p),p);const m=await sharp(route(p)).metadata();assets.push({path:p,width:m.width,height:m.height,format:m.format,bytes:fs.statSync(route(p)).size});}
 const derivatives=[];for(const f of fs.readdirSync('public/images').filter(f=>f.startsWith(recipe.image.heroId+'-'))){const p='public/images/'+f,m=await sharp(p).metadata();derivatives.push({path:p,width:m.width,height:m.height,format:m.format,bytes:fs.statSync(p).size});}assert.equal(derivatives.length,7);
 const descriptor=JSON.parse(fs.readFileSync(`editorial/articles/${slug}/image.json`));const declaredAssets=[];for(const a of [descriptor.master,descriptor.og,...descriptor.variants]){const p=`editorial/articles/${slug}/${a.path}`,m=await sharp(p).metadata();assert.equal(m.width,a.width);assert.equal(m.height,a.height);declaredAssets.push({path:p,width:m.width,height:m.height,format:m.format});}
 const viewports=[];for(const width of [375,1440]){const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const resp=await page.goto(origin+'/blog/'+slug,{waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;for(const i of document.images)i.loading='eager';await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));});const observed=await page.evaluate(()=>({documentWidth:document.documentElement.scrollWidth,missing:[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src),body:document.querySelector('.article-corps').textContent}));assert.equal(resp.status(),200);assert.ok(observed.documentWidth<=width);assert.equal(errors.length,0);assert.equal(observed.missing.length,0);viewports.push({width,http:resp.status(),documentWidth:observed.documentWidth,errors,missing:observed.missing});await page.close();}
 const links=[];for(const a of inside.filter(n=>n.tagName==='a'&&attr(n,'href')?.startsWith('/'))){const url=new URL(attr(a,'href'),origin),p=route(url.pathname);assert.ok(p,url.pathname);if(url.hash)assert.ok(walk(parse(fs.readFileSync(p,'utf8'))).some(n=>attr(n,'id')===decodeURIComponent(url.hash.slice(1))),url.hash);links.push({href:attr(a,'href'),anchor:text(a),http:(await fetch(origin+url.pathname)).status});}
 results.push({slug,synthetic,assets,derivatives,declaredAssets,viewports,links});
}}finally{await browser.close();await new Promise(r=>server.close(r));}
const matrix=JSON.parse(fs.readFileSync('docs/qa/cac-f4-livraison/editorial/couverture-skills.json'));const matrixCounts=matrix.rows.reduce((a,r)=>(a[r.execution]=(a[r.execution]??0)+1,a),{});assert.equal(matrix.rows.length,63);for(const row of matrix.rows)for(const p of row.evidence)assert.ok(fs.existsSync(p),p);
const before=JSON.parse(fs.readFileSync(out+'/INTEGRITE-AVANT.json'));const changed=Object.entries(before).filter(([p,h])=>createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==h).map(([p])=>p);assert.deepEqual(changed,[]);
const receipt={observedAt:new Date().toISOString(),scope:'Complément métier ciblé, exécution indépendante ; blocs writers réels de forge en sandbox sans materialiser/sceller',results,matrixCounts,protectedFiles:Object.keys(before).length,changed};fs.writeFileSync(out+'/CONTROLES-APRES-LIAISON.json',JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify({ok:true,slugs:results.map(r=>({slug:r.slug,assets:r.assets.length,derivatives:r.derivatives.length,viewports:r.viewports,syntheticScore:r.synthetic.imageScore,syntheticImageStatus:r.synthetic.imageStatus})),matrixCounts,protectedFiles:receipt.protectedFiles,changed},null,2));
