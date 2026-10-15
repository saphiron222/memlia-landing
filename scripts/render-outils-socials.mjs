/** Visuels sociaux des outils : même collection de figurines que les catalogues. Aucun faux écran. */
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {chromium} from '@playwright/test';
import sharp from 'sharp';
import assert from 'node:assert/strict';
import {OUTILS_VITRINE} from '../src/data/outils-vitrine.ts';
const check=process.argv.includes('--check'),hash=b=>createHash('sha256').update(b).digest('hex');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const font=name=>readFileSync(`public/fonts/${name}`).toString('base64');
const figure=id=>`data:image/webp;base64,${readFileSync(`public/agents/${id}-512.webp`).toString('base64')}`;
const sourcePaths=['scripts/render-outils-socials.mjs','src/data/outils-vitrine.ts','src/data/outils.ts','public/fonts/hanken-400.woff2','public/fonts/fraunces-600.woff2',...new Set(OUTILS_VITRINE.map(o=>`public/agents/${o.imageAgent}-512.webp`))];
const sources=Object.fromEntries(sourcePaths.map(p=>[p,hash(readFileSync(p))]));
const records=[],manifestPath='docs/qa/outils-simples-2026-10-15/social-manifest.json';
const old=check?JSON.parse(readFileSync(manifestPath)):null;
if(check)assert.deepEqual(sources,old.sources,'Sources sociales modifiées : régénérer.');
const browser=await chromium.launch({channel:'chromium'});
try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const entries=[{slug:'hub',nom:'Outils comptables gratuits',texte:'Un prompt, un calcul, un fichier à vérifier.',imageAgent:'comptabilite'},...OUTILS_VITRINE];
 for(const o of entries){
  const html=`<!doctype html><html lang="fr"><meta charset="utf-8"><style>@font-face{font-family:Hanken;src:url(data:font/woff2;base64,${font('hanken-400.woff2')})}@font-face{font-family:Fraunces;src:url(data:font/woff2;base64,${font('fraunces-600.woff2')})}*{box-sizing:border-box}body{margin:0;background:#fffefb;color:#231f20;font:24px/1.4 Hanken}main{width:1200px;height:630px;padding:60px;display:grid;grid-template-columns:700px 310px;gap:60px;align-items:center;border:16px solid #edf6ef}.copy{display:grid;gap:22px;align-content:center}header{font-family:Fraunces;font-size:30px}.eyebrow{color:#176f37;font-size:20px}h1{font:600 59px/1.08 Fraunces;margin:0;letter-spacing:-1px}p{margin:0;color:#605c5a}img{width:310px;height:310px;object-fit:cover;border-radius:50%;border:1px solid #e5e3dd}footer{font-size:20px;color:#176f37}</style><main><div class="copy"><header>Memlia</header><p class="eyebrow">Les outils gratuits du cabinet</p><h1>${esc(o.nom)}</h1><p>${esc(o.texte)}</p><footer>Gratuit, sans inscription · memlia.fr</footer></div><img src="${figure(o.imageAgent)}" alt=""></main></html>`;
  await page.setContent(html);await page.evaluate(()=>document.fonts.ready);
  const size=await page.locator('main').evaluate(el=>({w:el.scrollWidth,h:el.scrollHeight}));assert.ok(size.w<=1200&&size.h<=630,`${o.slug}: débordement`);
  const bytes=await sharp(await page.screenshot({animations:'disabled'})).webp({quality:88}).toBuffer();assert.ok(bytes.length<150000);
  const target=`public/outils/social/${o.slug}.webp`;
  const record={slug:o.slug,path:target,width:1200,height:630,bytes:bytes.length,sha256:hash(bytes),sourceHash:hash(html)};
  if(check){assert.deepEqual(record,old.records.find(r=>r.slug===o.slug),o.slug);assert.ok(existsSync(target));assert.equal(hash(readFileSync(target)),record.sha256);}
  else{mkdirSync('public/outils/social',{recursive:true});writeFileSync(target,bytes);}
  records.push(record);
 }
 if(!check)writeFileSync(manifestPath,JSON.stringify({renderer:'scripts/render-outils-socials.mjs',sources,records},null,2)+'\n');
 console.log(`${records.length} images sociales ${check?'vérifiées':'générées'}, 1200 × 630, moins de 150 Ko.`);
}finally{await browser.close();}
