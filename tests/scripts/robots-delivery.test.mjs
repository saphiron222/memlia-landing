import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequestGet,onRequestHead} from '../../functions/automatisation/[slug].js';
import {onRequestGet as hubGet} from '../../functions/automatisation-cabinet-comptable.js';
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
test('la route dynamique conserve le traitement des services historiques et des inconnus',async()=>{
 for(const slug of ['paie','inconnu']){const original=new Response('Service historique');const res=await onRequestGet({params:{slug},next:async()=>original});assert.equal(res,original);}
});
