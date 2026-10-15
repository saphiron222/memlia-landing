import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { onRequestGet, onRequestHead } from '../../functions/outils-comptables-gratuits/comparateur-balances-comptables.js';
const route='/outils-comptables-gratuits/comparateur-balances-comptables';
test('registre : action du comparateur explicite pour le hub',()=>{
 const registry=readFileSync('src/data/outils.ts','utf8');
 const entry=registry.split("slug: 'comparateur-balances-comptables'")[1]?.split('\n  },')[0];
 assert.ok(entry,'comparateur présent dans le registre');
 assert.match(entry,/libelleAction: 'Comparer deux balances comptables'/);
});
test('livraison locale : beacon retiré, GET/HEAD, cache et CSP',async()=>{
 const removed=[];globalThis.HTMLRewriter=class{on(selector,handler){assert.equal(selector,'script[src]');for(const src of ['https://static.cloudflareinsights.com/beacon.min.js','https://static.cloudflareinsights.com/beacon.min.js/v123','/_astro/balances.js'])handler.element({getAttribute:()=>src,remove:()=>removed.push(src)});return this}transform(r){return r}};
 try{for(const method of ['GET','HEAD']){const request=new Request('https://memlia.fr'+route,{method,headers:{'If-None-Match':'old',Range:'bytes=0-8'}});const response=await(method==='HEAD'?onRequestHead:onRequestGet)({request,next:async req=>{assert.equal(req.headers.get('If-None-Match'),null);assert.equal(req.headers.get('Range'),null);return new Response('<html>fictif</html>',{headers:{'Content-Type':'text/html',ETag:'old'}})}});assert.equal(response.status,200);assert.match(response.headers.get('Cache-Control'),/no-transform/);assert.match(response.headers.get('Content-Security-Policy'),/connect-src 'none'/);assert.equal(response.headers.get('ETag'),null);if(method==='HEAD')assert.equal(await response.text(),'');}assert.equal(removed.length,4)}finally{delete globalThis.HTMLRewriter}
});
test('HTML canonique, schémas, outil réel, image sociale et entrants construits',()=>{
 const html=readFileSync('dist'+route+'.html','utf8');assert.match(html,/<h1\b/);assert.equal((html.match(/<h1\b/g)||[]).length,1);assert.ok(html.includes('https://memlia.fr'+route));assert.ok(html.includes('WebApplication'));assert.ok(html.includes('BreadcrumbList'));assert.ok(html.includes('property="og:image" content="https://memlia.fr/social/outils/social/comparateur-balances-comptables.webp.jpg"'));
 assert.ok(html.includes('data-outil="comparateur-balances-comptables"'));
 assert.match(html, /<input\b[^>]*type="file"/);
 assert.match(html, /<button\b[^>]*type="submit"[^>]*>Comparer les balances<\/button>/);
 assert.doesNotMatch(html, /<img\b[^>]*45-outil-balances\.webp/);
 assert.ok((html.match(/<form\b/g)||[]).length > 0);
 for (const form of html.match(/<form\b[^>]*>/g)||[]) assert.match(form, /method="dialog"/);
 assert.doesNotMatch(html, /<dialog\b/);
 assert.ok(html.includes("form-action &#39;none&#39;")||html.includes("form-action 'none'"));assert.ok(html.includes("connect-src &#39;none&#39;")||html.includes("connect-src 'none'"));assert.ok(!html.includes('static.cloudflareinsights.com'));
 for(const parent of ['methode','outils-comptables-gratuits','outils-comptables-gratuits/calculateur-amortissement-comptable'])assert.ok(readFileSync(`dist/${parent}.html`,'utf8').includes(`href="${route}"`),parent);
 assert.ok(readFileSync('dist/sitemap-outils.xml','utf8').includes(route));
 execFileSync(process.execPath,['scripts/generate-balances-proof.mjs','--check']);
});
