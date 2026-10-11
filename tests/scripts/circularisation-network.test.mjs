import { test } from 'node:test';
import assert from 'node:assert/strict';
import { networkViolation } from '../helpers/circularisation-network.mjs';
const origin='http://127.0.0.1:4329';
const policy={origin,iconUrl:origin+'/favicon.svg'};
const request=(overrides={})=>({phase:'operations',url:origin+'/_astro/circularisation-worker-abc.js',type:'script',method:'GET',hasBody:false,...overrides});
test('Worker local et icône native différée restent des ressources, pas des envois',()=>{
 assert.equal(networkViolation(request(),policy),null);
 assert.equal(networkViolation(request({url:policy.iconUrl,type:'other'}),policy),null);
 assert.equal(networkViolation(request({phase:'load',url:origin+'/fonts/hanken-400.woff2',type:'font'}),policy),null);
});
test('la séparation des phases ne masque ni origine externe ni données envoyées',()=>{
 for(const phase of ['load','operations'])for(const overrides of [
  {url:'https://example.org/_astro/x.js'},
  {url:'http://127.0.0.1:4329@evil.example/_astro/x.js'},
  {method:'POST'}, {hasBody:true}, {url:policy.iconUrl+'?data=private',type:'other'},
  {url:origin+'/_astro/x.js?data=private'},
 ]) assert.ok(networkViolation(request({phase,...overrides}),policy),JSON.stringify({phase,...overrides}));
});
test('aucune allowlist générale : fetch/XHR, autre icône et ressources tardives sont refusés',()=>{
 for(const overrides of [
  {url:policy.iconUrl,type:'fetch'}, {url:policy.iconUrl,type:'xhr'},
  {url:origin+'/favicon2.svg',type:'other'},
  {url:origin+'/fonts/hanken-400.woff2',type:'font'},
  {type:'fetch'}, {url:origin+'/api'},
 ]) assert.ok(networkViolation(request(overrides),policy),JSON.stringify(overrides));
});
