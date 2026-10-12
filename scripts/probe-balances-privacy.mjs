import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
const origin=process.env.QA_URL??'http://127.0.0.1:4330';
const browser=await chromium.launch({channel:'chromium'});
try{
 const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']});
 const page=await context.newPage();
 const response=await page.goto(origin+'/outils-comptables-gratuits/comparateur-balances-comptables');await page.waitForLoadState('networkidle');
 const headers=await response.allHeaders();assert.match(headers['content-security-policy'],/connect-src 'none'/);assert.match(headers['cache-control'],/no-transform/);
 assert.ok(!(await page.content()).includes('static.cloudflareinsights.com'));
 const snapshot=()=>page.evaluate(async()=>({local:{...localStorage},session:{...sessionStorage},cookies:document.cookie,databases:await indexedDB.databases(),caches:await caches.keys()}));
 const before=await snapshot();const requests=[];page.on('request',r=>requests.push({method:r.method(),url:r.url(),type:r.resourceType(),body:r.postData()}));
 await page.getByRole('button',{name:'Charger les deux CSV fictifs'}).click();
 await page.locator('#same-currency').check();await page.locator('#comparable').check();
 await page.locator('#file-current').setInputFiles({name:'preuve-fictive.csv',mimeType:'text/csv',buffer:Buffer.from('Compte;Libellé;Solde\n00123;Compte fictif;130,00\n707;Ventes fictives;50,00\n401;Fournisseur fictif;-80,00')});
 page.once('dialog',d=>d.accept());await page.getByRole('button',{name:'Lire N',exact:true}).click();await page.getByText('Fichier preuve-fictive.csv lu localement. Vérifiez le mapping.').waitFor();
 await page.getByRole('button',{name:'Comparer les balances',exact:true}).click();await page.locator('[data-result]').waitFor({state:'visible'});
 await page.getByRole('button',{name:'Copier le rapport complet'}).click();
 const download=page.waitForEvent('download');await page.getByRole('button',{name:'Exporter le rapport CSV complet'}).click();await download;
 const after=await snapshot();assert.deepEqual(before,after);
 for(const request of requests){assert.equal(request.method,'GET');assert.equal(request.body,null);assert.ok(request.url.startsWith(origin+'/_astro/'),'Seuls les assets du Worker sont chargés après interaction');assert.ok(!['fetch','xhr','ping'].includes(request.type));}
 const proof={surface:'Wrangler Pages (Functions et en-têtes réels)',url:response.url(),headers,steps:['exemple','fichier CSV fictif','lecture confirmée','calcul','copie','export'],requests,before,after,pass:true};
 mkdirSync('docs/qa/comparateur-balances',{recursive:true});writeFileSync('docs/qa/comparateur-balances/reseau-stockage.json',JSON.stringify(proof,null,2)+'\n');console.log(JSON.stringify({pass:true,requestsAfterLoading:requests.length,storageUnchanged:true}));
}finally{await browser.close()}
