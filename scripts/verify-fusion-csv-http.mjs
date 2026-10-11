import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const base=process.env.QA_URL;if(!base)throw Error('QA_URL requis');
const route='/outils-comptables-gratuits/fusionner-fichiers-csv',results=[];
for(const method of ['GET','HEAD'])for(const conditions of [{},{'If-None-Match':'"old"'},{Range:'bytes=0-10','If-Range':'"old"'}]){
 const response=await fetch(base+route,{method,headers:{'Cache-Control':'no-cache',...conditions}});const body=await response.text();
 assert.equal(response.status,200);assert.match(response.headers.get('content-security-policy'),/connect-src 'none'/);assert.match(response.headers.get('cache-control'),/no-transform/);
 if(method==='GET'){assert.ok(!/static.cloudflareinsights.com|beacon.min.js/.test(body));assert.ok(body.includes('https://memlia.fr'+route));assert.ok(body.includes('WebApplication'));assert.ok(body.includes('BreadcrumbList'));}
 results.push({method,conditions,status:response.status,headers:Object.fromEntries(response.headers),bytes:body.length});
}
for(const path of ['/outils-comptables-gratuits','/methode','/automatisation-cabinet-comptable']){
 const r=await fetch(base+path,{headers:{'Cache-Control':'no-cache'}});assert.equal(r.status,200);assert.ok((await r.text()).includes(`href="${route}"`));results.push({path,status:r.status,incomingLink:true});
}
const sm=await fetch(base+'/sitemap-outils.xml');assert.equal(sm.status,200);assert.ok((await sm.text()).includes('https://memlia.fr'+route));results.push({path:'/sitemap-outils.xml',status:sm.status,listed:true});
writeFileSync('docs/qa/fusion-csv/http-preview.json',JSON.stringify({base,checkedAt:new Date().toISOString(),results},null,2)+'\n');console.log(`${results.length} preuves HTTP, en-têtes, absence de beacon, entrants et sitemap PASS.`);
