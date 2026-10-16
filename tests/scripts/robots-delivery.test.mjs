import test from 'node:test';
import assert from 'node:assert/strict';
import { loadBundledModules } from '../helpers/bundled-modules.mjs';
const [{onRequestGet,onRequestHead},{onRequestGet:hubGet}] = await loadBundledModules([
 '/functions/automatisation/[slug].js',
 '/functions/automatisation-cabinet-comptable.js',
]);
test('démonstrations robots : CSP sans réseau, cache sans transformation et HEAD concordant',async()=>{
 globalThis.HTMLRewriter=class{on(){return this;}transform(r){return r;}};
 try{
  for(const [handler,slug,method] of [[onRequestGet,'cfe','GET'],[onRequestHead,'situation-tva','HEAD'],[hubGet,null,'GET']]){
   const request=new Request('https://preview-hub-robots.memlia.pages.dev/automatisation/'+(slug??''),{method});
   const res=await handler({request,params:{slug},next:async()=>new Response('Exemple fictif',{headers:{'Content-Type':'text/html'}})});
   assert.match(res.headers.get('Content-Security-Policy'),/connect-src 'none'/);assert.match(res.headers.get('Cache-Control'),/no-transform/);assert.equal(res.headers.get('Strict-Transport-Security'),null);assert.equal(await res.text(),method==='HEAD'?'':'Exemple fictif');
  }
 }finally{delete globalThis.HTMLRewriter;}
});
test('la route dynamique redirige la paie retirée et conserve le vrai 404 des inconnus',async()=>{
 const response=await onRequestGet({request:new Request('https://preview.memlia.pages.dev/automatisation/paie'),params:{slug:'paie'},next:async()=>{throw Error('ancienne page ne doit pas passer');}});
 assert.equal(response.status,301);assert.equal(response.headers.get('Location'),'https://preview.memlia.pages.dev/agents-ia/paie-social');
 const original=new Response('Introuvable',{status:404});const res=await onRequestGet({request:new Request('https://preview.memlia.pages.dev/automatisation/inconnu'),params:{slug:'inconnu'},next:async()=>original});assert.equal(res,original);
});
