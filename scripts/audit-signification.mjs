import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
const base=process.env.QA_URL??'http://127.0.0.1:45873',route='/outils-comptables-gratuits/seuil-signification-audit',out='docs/qa/signification';mkdirSync(out,{recursive:true});
const response=await fetch(base+route,{headers:{'Cache-Control':'no-cache'}});assert.equal(response.status,200);const headers=Object.fromEntries(response.headers);assert.match(headers['content-security-policy'],/connect-src 'none'/);assert.match(headers['cache-control'],/no-transform/);assert.equal(headers['x-content-type-options'],'nosniff');
const browser=await chromium.launch({channel:'chromium'}),records=[];
const storage=p=>p.evaluate(async()=>({local:localStorage.length,session:sessionStorage.length,cookies:document.cookie,indexedDB:await indexedDB.databases(),caches:await caches.keys()}));
async function exportText(p,selector){const wait=p.waitForEvent('download');await p.locator(selector).click();return readFileSync(await(await wait).path(),'utf8');}
try{
 for(const width of [320,375,768,1024,1440,1920]){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),p=await ctx.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto(base+route,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);
  const requests=[];ctx.on('request',r=>requests.push({url:r.url(),method:r.method(),data:r.postData()}));
  assert.equal(await p.locator('#sig-rate').inputValue(),'');assert.equal(await p.locator('#sig-planning').inputValue(),'');
  await p.getByRole('button',{name:'Charger l’exemple fictif',exact:true}).click();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await p.evaluate(()=>{document.activeElement?.blur();document.querySelector('.sig .table-scroll').scrollLeft=0;window.scrollTo(0,0);});
  if([375,1440].includes(width))await p.screenshot({path:`${out}/signification-${width}.png`,fullPage:true});
  await p.getByRole('button',{name:'Retenir 001',exact:true}).click();
  const json=await exportText(p,'[data-sig-export="json"]');assert.equal(JSON.parse(json).retainedId,'001');
  const csv=await exportText(p,'[data-sig-export="csv"]');assert.ok(csv.startsWith('\ufeff'));assert.match(csv,/10000.00/);
  const html=await exportText(p,'[data-sig-final]');assert.match(html,/CHOIX UTILISATEUR/);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await p.locator('#sig-base').fill('1234,56');await p.locator('#sig-rate').fill('1,25');await p.getByRole('button',{name:'Calculer et enregistrer le scénario',exact:true}).click();assert.match(await p.locator('[data-sig-table]').innerText(),/15.43/);assert.match(await p.locator('[data-sig-summary]').innerText(),/BROUILLON/);
  const current=await exportText(p,'[data-sig-export="json"]');
  p.once('dialog',d=>d.accept());await p.getByRole('button',{name:'Effacer la session',exact:true}).click();assert.match(await p.locator('[data-sig-summary]').innerText(),/0 scénario/);assert.equal(await p.locator('[data-sig-downloads] a').count(),0);
  await p.getByText('Reprendre une sauvegarde JSON',{exact:true}).click();await p.locator('#sig-json').setInputFiles({name:'reprise.json',mimeType:'application/json',buffer:Buffer.from(current)});await p.getByRole('button',{name:'Reprendre le JSON',exact:true}).click();await p.waitForFunction(()=>document.querySelector('[data-sig-summary]').textContent.includes('2 scénario'));assert.deepEqual(JSON.parse(await exportText(p,'[data-sig-export="json"]')),JSON.parse(current));
  const graph=await p.locator('script[type="application/ld+json"]').evaluateAll(els=>els.map(el=>JSON.parse(el.textContent)));const nodes=graph.flatMap(g=>g['@graph']??[g]);for(const type of ['WebPage','WebApplication','BreadcrumbList'])assert.ok(nodes.some(n=>n['@type']===type));
  assert.equal(await p.locator('h1').count(),1);const h1=await p.locator('h1').innerText();assert.equal(await p.locator('meta[property="og:title"]').getAttribute('content'),h1);assert.equal(nodes.find(n=>n['@type']==='WebPage').headline,h1);assert.equal(await p.locator('link[rel=canonical]').getAttribute('href'),'https://memlia.fr'+route);
  const stores=await storage(p);assert.deepEqual(stores,{local:0,session:0,cookies:'',indexedDB:[],caches:[]});assert.deepEqual(requests,[]);assert.deepEqual(errors,[]);
  await p.locator('#sig-base').focus();assert.ok(await p.locator('#sig-base').evaluate(e=>getComputedStyle(e).outlineStyle!=='none'));
  records.push({width,overflow:false,requests,storage:stores,errors,nominal:true,decimalExact:true,exports:['csv','json','html'],resumeEqual:true});await ctx.close();
 }
 for(const width of [375,1440]){const p=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});await p.goto(base+'/outils-comptables-gratuits/verificateur-fec-local',{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.screenshot({path:`${out}/historique-fec-${width}.png`,fullPage:true});await p.close();}
 const incoming=[];for(const from of ['/methode','/garanties','/outils-comptables-gratuits']){const r=await fetch(base+from);assert.equal(r.status,200);assert.ok((await r.text()).includes(`href="${route}"`));incoming.push(from);}
 const index=readFileSync('dist/sitemap.xml','utf8');const locations=[...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);assert.ok(locations.length);assert.ok(locations.some(url=>readFileSync('dist'+new URL(url).pathname,'utf8').includes('https://memlia.fr'+route)));
 writeFileSync(`${out}/audit.json`,JSON.stringify({checkedAt:new Date().toISOString(),environment:'Cloudflare Pages local via wrangler ; pas production',route,headers,records,incoming,reflow400:'viewport CSS 320px, équivalent de 1280px à 400%',renderer:'node scripts/render-proofs-v2.mjs --source=docs/design/signification-proof --manifest=docs/qa/signification/proofs-manifest.json --start=41 --check'},null,2)+'\n');console.log('PASS : six largeurs, zéro requête après chargement (contexte navigateur / Worker), stockages vides, en-têtes réels, exports/reprise, calcul, clavier et trois entrants.');
}finally{await browser.close();}
