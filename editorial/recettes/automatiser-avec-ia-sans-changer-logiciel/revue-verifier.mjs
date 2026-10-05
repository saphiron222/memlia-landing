import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';

import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { auditerContratBlog } from '../../../scripts/verify-blog-contract.mjs';
import { renderedBodySha256, reviewSha256 } from '../../../scripts/lib/blog-review-binding.mjs';

const slug='automatiser-avec-ia-sans-changer-logiciel';
const dir=resolve('editorial/recettes/'+slug), dist=resolve('.qa/revue-'+slug);
const json=p=>JSON.parse(readFileSync(p,'utf8'));
const save=(p,v)=>writeFileSync(resolve(dir,p),JSON.stringify(v,null,2)+'\n');
const originalJournal=readFileSync(resolve(dir,'journal-rejeu.json'));
const originalProgram=readFileSync(resolve(dir,'rejouer-cas.mjs'),'utf8');
// Copie byte-identique et exécution native dans un bac QA : le journal auteur ne bouge pas.
const replayDir=resolve('.qa/replay-t_003f2bb5');mkdirSync(replayDir,{recursive:true});
const replayProgram=resolve(replayDir,'rejouer-cas.mjs');writeFileSync(replayProgram,originalProgram);
const {passage}=await import(pathToFileURL(replayProgram).href);
const capturedJournal=json(resolve(replayDir,'journal-rejeu.json'));
assert.equal(capturedJournal.cases.length,8);
assert.deepEqual(readFileSync(resolve(dir,'journal-rejeu.json')),originalJournal);
const journal=json(resolve(dir,'journal-rejeu.json'));
for(let i=0;i<8;i++)assert.deepEqual(capturedJournal.cases[i],journal.cases[i]);
// Oracle écrit ici à partir de la fiche, et non des attentes du programme auteur.
const nominal={id:'F-012',periode:'2026-09',version:'v1',etat:'a_preparer',pieces:['relevé A','facture B'],saisie:null};

const base=JSON.parse(JSON.stringify(passage(nominal).proposition));
const oracle=[
 ['préparation',nominal,null,null,'PROPOSITION','P-F-012-v1'],
 ['traité',{...nominal,id:'F-013',etat:'traite'},null,null,'REFUS','DEJA_TRAITE'],
 ['entrée absente',{...nominal,id:'F-014',pieces:null},null,null,'REFUS','ENTREE_ABSENTE'],
 ['saisie humaine',{...nominal,id:'F-015',saisie:'Texte corrigé par le collaborateur'},null,null,'REFUS','SAISIE_PROTEGEE'],
 ['reprise',nominal,base,null,'REUTILISER','P-F-012-v1'],
 ['version modifiée',{...nominal,version:'v2'},base,null,'REFUS','VERSION_CHANGEE'],
 ['état inconnu',{...nominal,id:'F-016',etat:'inconnu'},null,null,'REFUS','ETAT_INCONNU'],
 ['accord ancien',nominal,base,'P-F-012-v0','REFUS','VALIDATION_PERIMEE'],
 ['contenu modifié même version',{...nominal,pieces:['pièce C']},base,null,'REFUS','VERSION_CHANGEE'],
 ['période changée avec proposition précédente',{...nominal,periode:'2026-10'},base,null,'REFUS','VERSION_CHANGEE'],
 ['pièce vide',{...nominal,pieces:[' ']},null,null,'REFUS','ENTREE_ABSENTE'],
 ['version absente',{...nominal,version:null},null,null,'REFUS','ENTREE_ABSENTE']
];
const replay=[];
for(const [cas,input,previous,approval,status,motif] of oracle){
 const before=structuredClone({input,previous});
 const output=JSON.parse(JSON.stringify(passage(input,previous,approval)));
 assert.equal(output.statut,status);assert.equal(output.motif,motif);
 assert.deepEqual({input,previous},before);assert.equal(output.saisie,input.saisie??null);
 replay.push({cas,input,previous,approval,output});
}
assert.equal(base.texte,'Pièces attendues : relevé A, facture B.');
assert.equal(passage(nominal,base).proposition,base);
const contract=auditerContratBlog({root:process.cwd(),dist,slugs:[slug]});assert.equal(contract.pass,true,JSON.stringify(contract));
const server=createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');let p=resolve(dist,'.'+url.pathname);
 if(!p.startsWith(dist+'/'))return res.writeHead(403).end();
 if(!existsSync(p)&&!extname(p))p+='.html';
 if(!existsSync(p))return res.writeHead(404).end();
 res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.woff2':'font/woff2','.webp':'image/webp','.avif':'image/avif'})[extname(p)]||'application/octet-stream');res.end(readFileSync(p));
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();const views=[];
try{
 for(const width of [1280,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[],failed=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()}));page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
  await page.goto('http://127.0.0.1:'+server.address().port+'/blog/'+slug);await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:dir+'/revue-haut-'+width+'.png'});
  const data=await page.evaluate(()=>({
   width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,lang:document.documentElement.lang,
   h1:[...document.querySelectorAll('h1')].map(h=>h.innerText),canonical:document.querySelector('link[rel=canonical]')?.href,
   robots:document.querySelector('meta[name=robots]')?.content,title:document.title,description:document.querySelector('meta[name=description]')?.content,
   og:document.querySelector('meta[property="og:title"]')?.content,author:document.querySelector('meta[name=author]')?.content,
   schema:[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s=>{const j=JSON.parse(s.textContent);return j['@graph']||[j];}),
   headings:[...document.querySelectorAll('.article-corps h2,.article-corps h3')].map(h=>({level:h.tagName,text:h.innerText,id:h.id})),
   links:[...document.querySelectorAll('.article-corps a[href^="/"]')].map(a=>a.getAttribute('href')),
   tables:[...document.querySelectorAll('.article-corps table')].map(t=>({headers:[...t.querySelectorAll('th')].map(x=>x.innerText),rows:[...t.querySelectorAll('tbody tr')].map(r=>[...r.cells].map(c=>c.innerText))})),
   text:document.querySelector('.article-corps').innerText,
   cta:[...document.querySelectorAll('a[href="/contact"]')].map(a=>a.innerText)
  }));
  assert.equal(data.lang,'fr');assert.equal(data.h1.length,1);assert.equal(data.canonical,'https://memlia.fr/blog/'+slug);assert.equal(data.author,'Kevin Kitanga');assert.equal(data.og,data.h1[0]);assert.equal(data.overflow,false);
  assert.equal(data.tables.length,4);assert.equal(data.tables[0].rows.length,15);assert.equal(data.tables[3].rows.length,8);
  for(const expected of replay.slice(0,8))assert.ok(data.text.includes(expected.output.motif),expected.cas);
  assert.ok(data.text.includes('Aucun modèle'));assert.ok(data.text.includes('séquentiel'));assert.ok(data.cta.includes('Confier cette tâche'));
  assert.ok(data.schema.some(x=>x['@type']==='BlogPosting'));assert.ok(data.schema.some(x=>x['@type']==='Person'&&x.name==='Kevin Kitanga'));
  const links=[];
  for(const href of [...new Set(data.links)]){
   const [p,anchor]=href.split('#'),response=await page.request.get('http://127.0.0.1:'+server.address().port+p);
   assert.equal(response.status(),200,href);const html=await response.text();if(anchor)assert.ok(html.includes('id="'+anchor+'"'),href);
   links.push({href,status:response.status(),anchorFound:anchor?true:null});
  }
  const tables=[];
  for(const [index,table] of (await page.locator('.article-corps table').all()).entries()){
   await table.scrollIntoViewIfNeeded();
   const state=await table.evaluate(t=>{let p=t;while(p!==document.body&&!(p.scrollWidth>p.clientWidth&&['auto','scroll'].includes(getComputedStyle(p).overflowX)))p=p.parentElement;
    if(p===document.body)return {needsScroll:false,fontSize:getComputedStyle(t).fontSize};
    const initial=p.scrollLeft;p.scrollLeft=p.scrollWidth;const cell=t.rows[t.rows.length-1].cells[t.rows[t.rows.length-1].cells.length-1].getBoundingClientRect(),box=p.getBoundingClientRect();
    return {needsScroll:true,initial,left:p.scrollLeft,max:p.scrollWidth-p.clientWidth,lastCellVisible:cell.right<=box.right+2,tabindex:p.getAttribute('tabindex'),fontSize:getComputedStyle(t).fontSize};});
   if(state.needsScroll){assert.ok(state.left>0);assert.equal(state.lastCellVisible,true);}
   await page.screenshot({path:dir+'/revue-table-'+width+'-'+index+'.png'});tables.push(state);
  }
  const figures=[];
  for(let i=0;i<2;i++){
   const figure=page.locator('[data-blog-proof]').nth(i);await figure.scrollIntoViewIfNeeded();
   await figure.locator('img').evaluate(async img=>{await img.decode();});
   const metadata=await figure.locator('img').evaluate(img=>({src:img.getAttribute('src'),alt:img.alt,width:img.naturalWidth,height:img.naturalHeight,displayWidth:img.getBoundingClientRect().width}));
   assert.equal(metadata.width,1600);assert.equal(metadata.height,900);assert.ok(metadata.alt&&!metadata.src.includes('-mobile'));
   await page.screenshot({path:dir+'/revue-figure-'+width+'-'+i+'.png',animations:'disabled'});figures.push(metadata);
  }
  await page.screenshot({path:dir+'/revue-page-'+width+'.png',fullPage:true});assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
  views.push({...data,linksVerified:links,tablesScroll:tables,figures,errors,failed});await page.close();
 }
}finally{await browser.close();await new Promise(r=>server.close(r));}
const images=[];
for(const id of ['passage-registre','passage-reprises']){const p='public/proofs/blog/'+id+'.webp',m=await sharp(p).metadata();assert.equal(m.width,1600);assert.equal(m.height,900);assert.ok(statSync(p).size<150000);images.push({path:p,width:m.width,height:m.height,bytes:statSync(p).size});}
for(const width of [768,1200,1600])for(const format of ['webp','avif']){const p='public/images/img-art-'+slug+'-'+width+'.'+format,m=await sharp(p).metadata();assert.equal(m.width,width);assert.equal(m.height,width*9/16);images.push({path:p,width:m.width,height:m.height,bytes:statSync(p).size});}
const og='public/images/img-art-'+slug+'-og.webp',ogMeta=await sharp(og).metadata();assert.equal(ogMeta.width,1200);assert.equal(ogMeta.height,630);
const sourceProof=json('editorial/articles/'+slug+'/preuves/sources/cnil-risques.json');
const response=await fetch(sourceProof.finalUrl,{headers:{'User-Agent':'MemliaBlogSourceVerifier/1.0'},signal:AbortSignal.timeout(30000)});
assert.equal(response.status,200);const sourceHtml=await response.text();assert.ok(sourceHtml.includes(sourceProof.excerpt));assert.ok(sourceHtml.includes('18 juillet 2024'));
writeFileSync(dir+'/revue-source-cnil.html',sourceHtml);
const source={requestedUrl:sourceProof.finalUrl,finalUrl:response.url,status:response.status,checkedAt:new Date().toISOString(),citationFound:true,sha256:createHash('sha256').update(sourceHtml).digest('hex')};
const html=readFileSync(resolve(dist,'blog',slug+'.html'),'utf8');
const subject={slug,bodySha256:reviewSha256(readFileSync(resolve(dir,'corps.md'),'utf8').trim()),recipeSha256:reviewSha256(readFileSync(resolve(dir,'recette.json'))),renderedSha256:renderedBodySha256(html)};
save('revue-verification.json',{reviewerTaskId:'t_003f2bb5',checkedAt:new Date().toISOString(),subject,originalJournalPreserved:true,replay,contract,views,images,source});
console.log(JSON.stringify({subject,replay:replay.length,originalJournalPreserved:true,contract,views:views.map(v=>({width:v.width,headings:v.headings.length,tablesScroll:v.tablesScroll,links:v.linksVerified,figures:v.figures,errors:v.errors,failed:v.failed,robots:v.robots,schema:v.schema.map(x=>x['@type'])})),images,source},null,2));
