import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import sharp from 'sharp';
const read = p => readFileSync(p,'utf8');
const slug = 'generateur-relance-facture-impayee';
test('route, registre, intention et deux entrants contextuels', () => {
 assert.match(read(`src/pages/outils-comptables-gratuits/${slug}.astro`), /GenerateurRelanceFacture/);
 assert.match(read('src/data/outils.ts'), new RegExp(`slug: '${slug}'`));
 assert.match(read('src/data/proofs.ts'), /44-outil-relance-facture/);
 for (const p of ['methode','automatisation-cabinet-comptable']) assert.match(read(`src/pages/${p}.astro`),new RegExp(slug));
 assert.ok(JSON.parse(read('config/page-intent-contract.json')).pages[`/outils-comptables-gratuits/${slug}`]);
 const entry=JSON.parse(read('docs/strategy/site-v3/mesures/registre-requetes.json')).articles.find(e=>e.slug===slug);
 assert.equal(entry.type,'outil'); assert.equal(entry.publieLe,null);
});
test('preuve canonique scellée, dimensions et poids', async () => {
 const folder='docs/design/relance-facture-proof';
 for (const p of ['index.html','styles.css','content-contract.json','replay.json']) assert.ok(existsSync(`${folder}/${p}`),p);
 const html=read(`${folder}/index.html`); assert.match(html,/data-og/); assert.match(html,/90,00/); assert.match(html,/soldée/i); assert.match(html,/litige/i);
 for(const [dir,width,height] of [['',1600,900],['og/',1200,630]]) {
 const path=`public/proofs/v2/${dir}44-outil-relance-facture.webp`; const b=readFileSync(path); const m=await sharp(b).metadata();
 assert.equal(m.width,width);assert.equal(m.height,height);assert.ok(b.length<150000);
 }
 const replay=JSON.parse(read(`${folder}/replay.json`)); assert.equal(replay.messages.length,1); assert.equal(replay.invoices.length,3);
 const { prepareReminders } = await import('../../src/lib/relance-facture.mjs');
 const {inputs,options}=JSON.parse(read(`${folder}/replay-input.json`));
 assert.deepEqual(prepareReminders(inputs,options),replay);
 const { createHash } = await import('node:crypto');
 const manifest=JSON.parse(read('docs/qa/relance-facture/proofs-manifest.json'));
 for(const e of [...manifest.sources,...manifest.entries.map(e=>({...e,path:e.target}))]) assert.equal(createHash('sha256').update(readFileSync(e.path)).digest('hex'),e.sha256,e.path);
});
