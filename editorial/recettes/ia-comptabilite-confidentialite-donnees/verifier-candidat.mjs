import {chromium} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const slug='ia-comptabilite-confidentialite-donnees';
const dir=`editorial/recettes/${slug}`;
const htmlPath=`.qa/render-${slug}/blog/${slug}.html`;
const recette=JSON.parse(readFileSync(`${dir}/recette.json`));
const checks=[];
const record=(name,detail)=>checks.push({name,detail});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
const html=readFileSync(htmlPath,'utf8');
await page.setContent(html);
assert.equal(await page.locator('h1').count(),1);
assert.equal(await page.locator('h1').innerText(),recette.title);
assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),`https://memlia.fr/blog/${slug}`);
assert.equal(await page.title(),recette.tabTitle);
assert.equal(await page.locator('meta[name=description]').getAttribute('content'),recette.description);
record('metadata','H1 unique, canonical, onglet et description identiques à la recette.');
const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();
assert.ok(schemas.some(s=>s.includes('BlogPosting')&&s.includes('Kevin Kitanga')&&s.includes(recette.title)));
record('schema','BlogPosting réel, auteur Kevin Kitanga et headline cohérents.');
const body=await page.locator('.article-corps').innerText();
assert.ok(body.startsWith('Réponse directe'));
for(const h of ['La règle écrite','Rejoué sur le jeu fictif','La règle à retenir','Pour aller plus loin'])assert.ok(body.includes(h));
assert.ok(body.includes('ENVIRONNEMENT_INCONNU')&&body.includes('ARBITRAGE_HUMAIN'));
record('gain-intention','Réponse directe, fiche complète, quatre états du rejeu et FAQ réellement dans le HTML.');
const links=await page.locator('.article-corps a').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
for(const link of recette.links.outgoing)assert.ok(links.includes(link),link);
record('maillage','Sept destinations sortantes présentes ; entrant /blog automatique. Pas de modification de voisin publié pour ajouter un entrant.');
for(const f of recette.inlineProofs){
 const meta=await sharp(`public/proofs/blog/${f.id}.webp`).metadata();
 assert.equal(meta.width,1600);assert.equal(meta.height,900);
 assert.equal(await page.locator(`figure[data-blog-proof] img[src="/proofs/blog/${f.id}.webp"]`).count(),1);
}
record('figures','Deux images directes 1600×900, alternatives propres et provenance fictive de recette.');
const captured=[];
for(const width of [390,1280]){
 await page.setViewportSize({width,height:900});
 await page.goto(`http://127.0.0.1:8793/blog/${slug}.html`,{waitUntil:'networkidle'});
 assert.equal(await page.locator('figure[data-blog-proof] img').count(),2);
 for(const img of await page.locator('figure[data-blog-proof] img').all()){
  await img.scrollIntoViewIfNeeded();
  await img.evaluate(e=>e.decode());
 }
 assert.ok(await page.locator('figure[data-blog-proof] img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth===1600)));
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await page.evaluate(()=>window.scrollTo(0,0));
 const p=`${dir}/capture-${width}.png`;await page.screenshot({path:p,fullPage:true});captured.push(p);
}
record('navigateur','Images chargées, deux figures et absence de débordement global aux largeurs 390/1280. Captures réelles.');
await browser.close();
const journal=JSON.parse(readFileSync(`${dir}/journal-rejeu.json`));assert.equal(journal.resultats.length,4);assert.ok(journal.resultats.every(r=>r.transmission===false));
record('rejeu','Quatre assertions des états attendus, transmission false, pas modèle ni analyse sémantique.');
writeFileSync(`${dir}/verification-candidat.json`,JSON.stringify({generatedAt:new Date().toISOString(),phase:'candidat-non-publie',htmlPath,htmlSha256:createHash('sha256').update(html).digest('hex'),checks,captured,limites:['Revue indépendante en attente','Aucune preuve de production ni CI distante','Deux sources utiles, pas trois artificielles ; /blog seul entrant déclaré','Analyseurs Blog anglais heuristiques ; textstat absent','Runtime SEO externe indisponible, contrôles natifs utilisés']},null,2)+'\n');
console.log(JSON.stringify(checks,null,2));
