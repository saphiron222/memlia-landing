/** Cadres sociaux des deux offres : sources réelles, polices et scène fictive du site. */
import fs from 'node:fs';import {createHash} from 'node:crypto';import sharp from 'sharp';import {SOLUTIONS} from '../src/data/solutions.ts';
const inputs=['src/data/solutions.ts','src/data/modeles-ouverts.ts','src/lib/solutions-scenes.ts','src/components/solutions/PageSolution.astro','src/components/solutions/SceneModele.astro','src/components/solutions/SceneOS.astro','src/styles/solutions/solutions.css','src/styles/tokens.css','src/components/Lockup.astro','scripts/render-solutions-social.mjs'];
const sha=b=>createHash('sha256').update(b).digest('hex');const sourceSha=sha(inputs.map(p=>fs.readFileSync(p)).join('\n'));const manifest='docs/qa/memoire-modeles/social-manifest.json';
if(process.argv.includes('--check')){const m=JSON.parse(fs.readFileSync(manifest));if(m.sourceSha!==sourceSha)throw Error('Scènes modifiées : cadres sociaux à régénérer.');if(m.records.length!==2)throw Error('Exactement deux cadres sont requis.');for(const id of ['os','modele']){const r=m.records.find(r=>r.target===`public/assets/solutions/og-${id}.webp`&&r.route===SOLUTIONS[id].chemin);if(!r||r.width!==1200||r.height!==630||sha(fs.readFileSync(r.target))!==r.sha256)throw Error('Cadre absent ou modifié : '+id);const meta=await sharp(r.target).metadata();if(meta.width!==1200||meta.height!==630)throw Error('Dimensions réelles incorrectes : '+id);}console.log('Deux cadres sociaux scellés, sources et actifs cohérents.');}
else{
 const base=process.env.QA_URL;if(!base)throw Error('QA_URL du serveur de développement requis ; ce script ne lance pas de build.');
 const {chromium}=await import('@playwright/test');const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await page.goto(base+SOLUTIONS.os.chemin);await page.evaluate(()=>document.fonts.ready);await page.locator('[data-os-step="1"]').click();const osScreenshot=await page.locator('[data-os-workspace]').screenshot();
 await page.goto(base+SOLUTIONS.modele.chemin);await page.evaluate(()=>document.fonts.ready);await page.locator('[data-model-step="1"]').click();const screenshot=await page.locator('[data-model-scene]').screenshot();await browser.close();
 const records=[];
 for(const id of ['os','modele']){
  const title=id==='os'?'Memlia OS':'Votre modèle IA privé';const lines=id==='os'?['La mémoire collective','du cabinet comptable.']:['Formé à votre façon','de travailler.'];
  const svg=`<svg width="1200" height="630"><rect width="1200" height="630" fill="#fffefb"/><text x="54" y="165" font-family="Georgia" font-size="46" fill="#231f20">${title}</text><text x="54" y="235" font-family="sans-serif" font-size="28" fill="#176f37">${lines[0]}</text><text x="54" y="280" font-family="sans-serif" font-size="28" fill="#176f37">${lines[1]}</text><text x="54" y="560" font-family="sans-serif" font-size="20" fill="#231f20">Memlia · Votre savoir au travail</text></svg>`;
  const asset=await sharp(id==='os'?osScreenshot:screenshot).resize(680,540,{fit:'contain',background:'#fffefb'}).toBuffer();
  const target=`public/assets/solutions/og-${id}.webp`;await sharp(Buffer.from(svg)).composite([{input:asset,left:510,top:45}]).webp({quality:86}).toFile(target);
  records.push({target,width:1200,height:630,sha256:sha(fs.readFileSync(target)),route:SOLUTIONS[id].chemin});
 }
 fs.writeFileSync(manifest,JSON.stringify({date:'2026-10-16',sourceSha,inputs,records},null,2)+'\n');console.log('Deux cadres sociaux générés depuis les deux scènes Memlia.');
}
