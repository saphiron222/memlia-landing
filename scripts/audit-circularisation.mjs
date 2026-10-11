import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {writeFileSync,mkdirSync} from 'node:fs';
const base=process.env.QA_URL??'http://127.0.0.1:45871',route='/outils-comptables-gratuits/suivi-circularisation',out='docs/qa/circularisation';mkdirSync(out,{recursive:true});
const response=await fetch(base+route,{headers:{'Cache-Control':'no-cache'}});assert.equal(response.status,200);const headers=Object.fromEntries(response.headers);assert.match(headers['content-security-policy'],/connect-src 'none'/);assert.match(headers['cache-control'],/no-transform/);assert.equal(headers['x-content-type-options'],'nosniff');
const b=await chromium.launch({channel:'chromium'});const records=[];
try{
 for(const width of [320,375,768,1024,1440,1920]){
  const context=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);
  const requests=[];page.on('request',r=>requests.push({url:r.url(),method:r.method(),postData:r.postData()}));await page.getByRole('button',{name:'Charger l’exemple fictif',exact:true}).click();await page.getByRole('button',{name:'Ouvrir 001',exact:true}).click();
  const graph=await page.locator('script[type="application/ld+json"]').evaluateAll(els=>els.map(el=>JSON.parse(el.textContent)));assert.ok(graph.some(g=>g['@graph']?.some(n=>n['@type']==='WebApplication')));
  assert.equal(await page.locator('h1').count(),1);assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'),await page.locator('h1').innerText());
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
  const storage=await page.evaluate(async()=>({local:localStorage.length,session:sessionStorage.length,cookies:document.cookie,indexedDB:await indexedDB.databases(),caches:await caches.keys()}));assert.deepEqual(storage,{local:0,session:0,cookies:'',indexedDB:[],caches:[]});assert.deepEqual(requests,[]);assert.deepEqual(errors,[]);
  await page.locator('#circ-id').focus();assert.ok(await page.locator('#circ-id').evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));
  await page.evaluate(()=>{document.activeElement?.blur();document.querySelector('.table-scroll').scrollLeft=0;window.scrollTo(0,0);});
  if([375,1440].includes(width))await page.screenshot({path:`${out}/circularisation-${width}.png`,fullPage:true});
  records.push({width,overflow,requests,storage,errors});await context.close();
 }
 for(const width of [375,1440]){const page=await b.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await page.goto(base+'/outils-comptables-gratuits/verificateur-fec-local');await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:`${out}/historique-fec-${width}.png`,fullPage:true});await page.close();}
 // 1280px at 400% browser zoom has a 320px CSS layout viewport (not 200% text-only scaling).
 const page=await b.newPage({viewport:{width:320,height:900}});await page.goto(base+route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.close();
 for(const from of ['/methode','/garanties','/outils-comptables-gratuits']){const r=await fetch(base+from);assert.equal(r.status,200);assert.ok((await r.text()).includes(`href="${route}"`));}
 writeFileSync(`${out}/audit.json`,JSON.stringify({checkedAt:new Date().toISOString(),environment:'Cloudflare Pages local via wrangler (pas production)',route,headers,records,reflow400:'layout viewport 320px, équivalent CSS de 1280px à 400%',incoming:['/methode','/garanties','/outils-comptables-gratuits']},null,2)+'\n');console.log('PASS : six largeurs, réseau/stockages, en-têtes réels, JSON-LD, clavier et trois entrants.');
}finally{await b.close();}
