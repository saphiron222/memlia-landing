import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { parse } from 'parse5';
import { BLOG_SKILLS, SEO_SKILLS } from '../../../scripts/lib/blog-pipeline.mjs';
import { auditerContratBlog } from '../../../scripts/verify-blog-contract.mjs';
import { renderedBodySha256, reviewSha256 } from '../../../scripts/lib/blog-review-binding.mjs';
const slug='verifier-reponse-ia-comptabilite', dir=resolve('editorial/recettes/'+slug), dist=resolve('.qa/render-'+slug);
const json=p=>JSON.parse(readFileSync(p,'utf8')), sha=b=>createHash('sha256').update(b).digest('hex');
const coverage=json(dir+'/couverture-skills.json'), reads=json(dir+'/lectures-skills.json'), catalogue=json(dir+'/catalogue-hermes.json');
const parent=json('docs/strategy/site-v3/mesures/diagnostic-2026-10-03/couverture-livraison.json');
const rows=coverage.lignes, names=rows.map(r=>r.skill);
const extras=['blog','seo','seo-ahrefs','seo-bing','seo-firecrawl','seo-profound','seo-seranking','seo-unlighthouse'];
assert.deepEqual([...names].sort(),[...BLOG_SKILLS,...SEO_SKILLS,...extras].sort());assert.equal(new Set(names).size,63);assert.equal(reads.length,63);
for(const r of rows){
 const bytes=readFileSync(r.chemin_charge), reading=reads.find(x=>x.skill===r.skill);
 assert.equal(sha(bytes),r.version_sha256,r.skill);assert.equal(reading.sha256,r.version_sha256);assert.equal(reading.content,bytes.toString(),r.skill+' lecture');
 assert.ok(r.motif.trim()&&r.constat.trim());assert.equal(r.slug,slug);
 for(const p of r.preuves)assert.ok(existsSync(resolve(dir,p))||existsSync(resolve(p)),r.skill+' preuve '+p);
 if(r.etat==='N/A')assert.equal(r.applicabilite,'N/A');
}
const counts=Object.fromEntries([...new Set(rows.map(r=>r.etat))].map(s=>[s,rows.filter(r=>r.etat===s).length]));
// Rejouer le candidat sans réécrire son journal d'auteur : seul l'appel d'écriture est remplacé.
const source=readFileSync(dir+'/rejouer-cas.mjs','utf8');
const runnable=source.replace("writeFileSync(new URL('./journal-rejeu.json',import.meta.url),JSON.stringify(result,null,2)+'\\n');console.log(JSON.stringify(result,null,2));",'export { result };');
assert.notEqual(source,runnable);
const {orienter,result}=await import('data:text/javascript;base64,'+Buffer.from(runnable).toString('base64'));
const journal=json(dir+'/journal-rejeu.json');assert.deepEqual(result.cases,journal.cases);assert.deepEqual(result.documents,journal.documents);assert.deepEqual(result.calcul,journal.calcul);assert.equal(result.modeleInterroge,null);
const expected=[['fidele','GARDER','FIDELE_AU_DOCUMENT'],['ajout','CORRIGER','DATE_NON_ETAYEE'],['introuvable','RECHERCHER','SOURCE_INTROUVABLE'],['reserve_omise','CORRIGER','RESERVE_OMISE'],['contradiction','ECARTER','ARBITRAGE_HUMAIN']];
for(const [q,decision,motif] of expected)assert.deepEqual(orienter(q),{decision,motif});
for(const q of [undefined,null,'','FIDELE','qualification-inventee',{},[]])assert.deepEqual(orienter(q),{decision:'RECHERCHER',motif:'QUALIFICATION_ABSENTE'});
assert.ok(result.documents['NOTE-A-v1'].includes('sous réserve de confirmation'));assert.ok(!result.documents['NOTE-A-v1'].includes('12 octobre'));
assert.equal(result.calcul.entrees.reduce((a,b)=>a+b,0),200);assert.ok(result.cases.every(x=>!x.saisie));
const nativeUrl='https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative';
const liveResponse=await fetch(nativeUrl,{signal:AbortSignal.timeout(30000)});assert.equal(liveResponse.status,200);
const liveHtml=await liveResponse.text();writeFileSync(dir+'/revue-source-cnil.html',liveHtml);
const nativeClaims=json('editorial/articles/'+slug+'/claims.json').claims;
for(const c of nativeClaims)assert.ok(liveHtml.includes(c.sourceExcerpts['cnil-hallucinations']),c.id+' source actuelle');
assert.ok(liveHtml.includes('18 juillet 2024'));
const html=readFileSync(dist+'/blog/'+slug+'.html','utf8'), body=readFileSync(dir+'/corps.md','utf8');
const subject={slug,bodySha256:reviewSha256(body.trim()),recipeSha256:reviewSha256(readFileSync(dir+'/recette.json')),renderedSha256:renderedBodySha256(html)};
const contract=auditerContratBlog({root:process.cwd(),dist,slugs:[slug]});assert.equal(contract.pass,true,JSON.stringify(contract));
const sources=json('editorial/articles/'+slug+'/claims.json').claims;
const receipt=json('editorial/articles/'+slug+'/preuves/sources/cnil-hallucinations.json');
const sourceBytes=readFileSync('editorial/articles/'+slug+'/'+receipt.contentPath);assert.equal(sha(sourceBytes),receipt.contentSha256);
for(const c of sources)assert.ok(sourceBytes.toString().includes(c.sourceExcerpts['cnil-hallucinations']));
const images=[];for(const p of ['public/proofs/blog/verification-registre.webp','public/proofs/blog/verification-fiche-reserve.webp','editorial/articles/'+slug+'/preuves/image/master.png',...['768','1200','1600'].flatMap(w=>['webp','avif'].map(f=>'public/images/img-art-'+slug+'-'+w+'.'+f)),'public/images/img-art-'+slug+'-og.webp']){const m=await sharp(p).metadata();images.push({path:p,width:m.width,height:m.height,format:m.format,bytes:statSync(p).size});if(p.includes('/proofs/')){assert.equal(m.width,1600);assert.equal(m.height,900);assert.ok(statSync(p).size<150000);}}
const server=createServer((req,res)=>{let p=resolve(dist,'.'+new URL(req.url,'http://localhost').pathname);if(!p.startsWith(dist+'/'))return res.writeHead(403).end();if(!existsSync(p)&&!extname(p))p+='.html';if(!existsSync(p))return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.avif':'image/avif','.woff2':'font/woff2'})[extname(p)]||'application/octet-stream');res.end(readFileSync(p));});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch();const browsers=[];
try{for(const width of [1280,390]){
 const page=await browser.newPage({viewport:{width,height:900}}), errors=[],failures=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)failures.push({url:r.url(),status:r.status()});});
 await page.goto('http://127.0.0.1:'+server.address().port+'/blog/'+slug);await page.evaluate(()=>document.fonts.ready);await page.locator('[data-blog-proof]').last().scrollIntoViewIfNeeded();await page.waitForFunction(()=>[...document.querySelectorAll('[data-blog-proof] img')].every(i=>i.complete&&i.naturalWidth>0));
 const state=await page.evaluate(()=>({width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,lang:document.documentElement.lang,h1:[...document.querySelectorAll('h1')].map(h=>h.innerText),h2:[...document.querySelectorAll('.article-corps h2')].map(h=>h.innerText),robots:document.querySelector('meta[name=robots]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,title:document.title,description:document.querySelector('meta[name=description]')?.content,ogTitle:document.querySelector('meta[property="og:title"]')?.content,author:document.querySelector('meta[name=author]')?.content,schema:[...document.querySelectorAll('script[type="application/ld+json"]')].flatMap(s=>{const j=JSON.parse(s.textContent);return j['@graph']||[j];}),images:[...document.querySelectorAll('[data-blog-proof] img')].map(i=>({src:i.getAttribute('src'),naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,alt:i.alt,renderedWidth:i.getBoundingClientRect().width})),links:[...document.querySelectorAll('.article-corps a[href^="/"]')].map(a=>a.getAttribute('href')),text:document.querySelector('.article-corps').innerText,tables:[...document.querySelectorAll('.article-corps table')].map(t=>({headers:[...t.querySelectorAll('thead th')].map(c=>c.innerText),rows:[...t.querySelectorAll('tbody tr')].map(r=>[...r.cells].map(c=>c.innerText)),fontSize:getComputedStyle(t).fontSize,scrollWidth:t.parentElement.scrollWidth,clientWidth:t.parentElement.clientWidth}))}));
 assert.equal(state.overflow,false);assert.equal(state.lang,'fr');assert.equal(state.h1.length,1);assert.equal(state.canonical,'https://memlia.fr/blog/'+slug);assert.equal(state.ogTitle,state.h1[0]);assert.equal(state.author,'Kevin Kitanga');assert.equal(state.robots,'noindex, follow');assert.equal(state.images.length,2);for(const i of state.images){assert.equal(i.naturalWidth,1600);assert.equal(i.naturalHeight,900);assert.ok(!i.src.includes('-mobile'));assert.ok(i.alt);}
 assert.equal(state.tables.length,5);assert.equal(state.tables[1].rows.length,14);assert.equal(state.tables[2].rows.length,4);assert.equal(state.tables[4].rows.length,5);assert.ok(state.tables.every(t=>t.headers.length>0));
 assert.ok(state.text.includes('Aucun modèle'));assert.ok(state.text.includes('qualification préalable'));assert.ok(state.text.includes('pas des réponses obtenues de ChatGPT'));
 for(const [i,c] of result.cases.entries())assert.ok(state.tables[4].rows[i].join(' ').includes(c.decision+' / '+c.motif));
 for(const href of state.links){const [pathname,anchor]=href.split('#'), p=[resolve(dist,'.'+pathname+'.html'),resolve(dist,'.'+pathname+'/index.html')].find(existsSync);assert.ok(p,href);if(anchor){const target=readFileSync(p,'utf8');assert.ok(target.includes('id="'+anchor+'"'),href);}}
 const movements=[];for(let i=0;i<state.tables.length;i++){
  const table=page.locator('.article-corps table').nth(i);
  await table.evaluate(t=>{const candidates=[];for(let e=t;e!==document.body;e=e.parentElement)candidates.push(e);const p=candidates.find(e=>e.scrollWidth>e.clientWidth+1&&['auto','scroll'].includes(getComputedStyle(e).overflowX))||t;p.scrollLeft=p.scrollWidth;});
  await page.waitForTimeout(300);
  const movement=await table.evaluate(t=>{const candidates=[];for(let e=t;e!==document.body;e=e.parentElement)candidates.push(e);const p=candidates.find(e=>e.scrollWidth>e.clientWidth+1&&['auto','scroll'].includes(getComputedStyle(e).overflowX))||t;const cell=t.rows[t.rows.length-1].cells[t.rows[0].cells.length-1],r=cell.getBoundingClientRect(),bounds=p.getBoundingClientRect();return {tag:p.tagName,scrollLeft:p.scrollLeft,max:p.scrollWidth-p.clientWidth,overflowX:getComputedStyle(p).overflowX,lastCell:cell.innerText,lastCellInHorizontalViewport:r.right<=bounds.right+1&&r.left>=bounds.left-1};});
  console.log('SCROLL_PROBE',width,i,JSON.stringify(movement));if(movement.max>1){assert.ok(movement.scrollLeft>0);assert.ok(movement.lastCellInHorizontalViewport);}movements.push(movement);
 }
 if(width===390)assert.equal(movements.filter(x=>x.max>1).length,4);
 await page.locator('.article-corps table').nth(4).evaluate(t=>window.scrollTo(0,window.scrollY+t.getBoundingClientRect().top-100));
 await page.screenshot({path:dir+'/revue-table-'+width+'.png'});await page.screenshot({path:dir+'/revue-rendu-'+width+'.png',fullPage:true});
 for(let i=0;i<2;i++)await page.locator('[data-blog-proof]').nth(i).screenshot({path:dir+'/revue-figure-'+width+'-'+i+'.png'});
 assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);browsers.push({...state,movements,errors,failures});await page.close();
}}
finally{await browser.close();await new Promise(r=>server.close(r));}
const output={checkedAt:new Date().toISOString(),reviewerTaskId:'t_2352a08b',subject,contract,coverage:{total:names.length,counts,registries:{blog:BLOG_SKILLS.length,seo:SEO_SKILLS.length,extensions:extras},catalogueCount:catalogue.skills.filter(x=>names.includes(x.name)).length,readsVerified:reads.length,allEvidenceResolved:true,parentCounts:parent.comptages},replay:{...result,additionalUnknownQualifications:7},source:{httpStatus:receipt.httpStatus,checkedAt:receipt.checkedAt,contentIntegrity:true,claimsFound:sources.length,live:{url:liveResponse.url,httpStatus:liveResponse.status,claimsFound:nativeClaims.length,displayedDate:'18 juillet 2024',artifact:'revue-source-cnil.html'}},images,browser:browsers};
writeFileSync(dir+'/revue-verification.json',JSON.stringify(output,null,2)+'\n');console.log(JSON.stringify({...output,browser:browsers.map(({text,schema,...r})=>({...r,schemaTypes:schema.map(s=>s['@type'])}))},null,2));
