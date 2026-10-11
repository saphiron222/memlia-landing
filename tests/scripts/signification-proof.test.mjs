import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import sharp from 'sharp';
import {demoSession,calculate} from '../../src/lib/signification.mjs';
const source=new URL('../../docs/design/signification-proof/',import.meta.url);
const contract=JSON.parse(readFileSync(new URL('content-contract.json',source),'utf8'));
function clean(text){assert.doesNotMatch(text,/Memlia|CNCC|H2A|partenari|indépendant de|confier une première tâche|\b20\d{2}\b/i);}
test('scène propre, jeu réellement calculé, pas de taux recommandé ni de choix inventé',()=>{
 const s=demoSession();assert.equal(s.retainedId,'');assert.deepEqual(s.scenarios.map(calculate).map(c=>[c.signification,c.planning]),[['10000.00','7000.00'],['12500.00','7500.00']]);
 assert.equal(contract.length,1);assert.equal(contract[0].id,'outil-signification');clean(contract[0].centralText);
 for(const v of ['10 000 EUR','12 500 EUR','7 000 EUR','7 500 EUR','Aucun retenu','Justification saisie'])assert.ok(contract[0].centralText.includes(v));
 for(const annotation of ['Memlia','CNCC','2026','partenariat','Confier une première tâche'])assert.throws(()=>clean(contract[0].centralText+' '+annotation));
 const html=readFileSync(new URL('index.html',source),'utf8');assert.match(html,/data-og/);assert.doesNotMatch(html,/display:\s*none|aria-hidden|<img|<svg|logo/i);
});
test('actifs distincts, dimensions et poids de la scène / image sociale',async()=>{
 for(const [folder,width,height] of [['',1600,900],['og/',1200,630]]){const file=new URL(`../../public/proofs/v2/${folder}41-outil-signification.webp`,import.meta.url),buffer=readFileSync(file),meta=await sharp(buffer).metadata();assert.equal(meta.width,width);assert.equal(meta.height,height);assert.ok(buffer.length<150000);assert.notDeepEqual(buffer,readFileSync(new URL(`../../public/proofs/v2/${folder}40-outil-circularisation.webp`,import.meta.url)));}
});
