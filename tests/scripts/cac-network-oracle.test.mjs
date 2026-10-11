import {test} from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {observeCacRequests} from '../browser/helpers/cac-network-oracle.mjs';

// Chromium peut classer son favicon automatique comme « other ». La recette
// navigateur force « image » ; cette matrice couvre aussi la classification native.
test('only a bodyless static local GET favicon is passive',()=>{
 const page=new EventEmitter();page.url=()=> 'https://memlia.fr/outils-comptables-gratuits/bareme-heures-cac';
 const requests=observeCacRequests(page);
 const emit=(overrides={})=>{
  const data={url:'https://memlia.fr/favicon.svg',method:'GET',postData:null,resourceType:'other',...overrides};
  page.emit('request',Object.fromEntries(Object.entries(data).map(([key,value])=>[key,()=>value])));
 };
 emit();emit({resourceType:'image'});emit({url:'blob:https://memlia.fr/export'});
 assert.deepEqual(requests,[]);
 for(const overrides of [
  {resourceType:'fetch'}, {resourceType:'xhr'}, {resourceType:'ping'},
  {method:'POST',postData:'note'}, {postData:'note'},
  {url:'https://memlia.fr/favicon.svg?note=private'},
  {url:'https://example.org/favicon.svg'},
  {url:'https://memlia.fr/collect',resourceType:'image'},
 ]){
  const before=requests.length;emit(overrides);assert.equal(requests.length,before+1);
 }
});
