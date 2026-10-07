import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { dirname, join } from 'node:path';

const escape = (s) => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const fonts = () => [['Hanken', 'hanken-400'], ['Fraunces', 'fraunces-600']].map(([family, file]) =>
  `@font-face{font-family:${family};src:url(data:font/woff2;base64,${readFileSync(new URL(`../public/fonts/${file}.woff2`, import.meta.url)).toString('base64')}) format('woff2')}`).join('\n');
/** Simulation documentaire propre au guide, pas une capture ni un essai éditeur. */
export async function renderGuideProof({ root, integration: d }) {
  const source = `guides/etats/${d.slug}/preuve.html`;
  const target = `public/proofs/integrations/${d.slug}.webp`;
  if (existsSync(join(root, source)) || existsSync(join(root, target))) throw Error('Rendu déjà présent : écrasement interdit.');
  const states = { 'Préparé': 'success', 'À valider': 'warning', 'Arrêt': 'blocked' };
  const html = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><style>
${fonts()}
*{box-sizing:border-box}body{margin:0;color:#231f20;font-family:Hanken,sans-serif}
main{width:1600px;height:900px;padding:54px 64px;background:#fffefb;border:1px solid #c8c4bb}
header{border-bottom:1px solid #dedbd4;padding-bottom:24px}p,h2{margin:0;overflow-wrap:anywhere}
h2{font-family:Fraunces,serif;font-size:40px;line-height:1.4}
.head,.row{display:grid;grid-template-columns:1fr 1fr 1.2fr .42fr;gap:28px}
.head{margin-top:28px;padding:0 22px 16px;font-size:16px;color:#625d5f}
.row{padding:26px 22px;border-top:1px solid #dedbd4;font-size:23px;line-height:1.35;align-items:start}
.row:last-child{border-bottom:1px solid #dedbd4}.row>*{min-width:0}.row p{font-weight:400}
.state{font-size:18px;line-height:1.3;padding:8px 10px;border-radius:16px;text-align:center}
.success{background:#eaf8ef;color:#1c8a41}.warning{background:#fff4d9;color:#71500a}.blocked{background:#f9e7e3;color:#7b3226}
</style></head><body><main><header><h2>${escape(d.task)}</h2></header>
<div class="head"><span>Entrée lue</span><span>Règle appliquée</span><span>Sortie / cause</span><span>Décision</span></div>
${d.replay.map(c => `<article class="row"><p>${escape(c.input)}</p><p>${escape(c.rule)}</p><p>${escape(c.detail)}</p><p class="state ${states[c.outcome]}">${escape(c.outcome)}</p></article>`).join('')}
</main></body></html>`;
  const browser = await chromium.launch({ channel: 'chromium' });
  let png;
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 1 });
    await page.setContent(html);
    await page.evaluate(() => document.fonts.ready);
    const issues = await page.evaluate(() => {
      const errors = [];
      if ([...document.fonts].some(f => f.status !== 'loaded')) errors.push('Police non chargée.');
      const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) continue;
        const box = node.parentElement.getBoundingClientRect();
        const range = document.createRange(); range.selectNodeContents(node);
        for (const r of range.getClientRects()) {
          if (r.left < box.left - 1 || r.right > box.right + 1 || r.top < box.top - 1 || r.bottom > box.bottom + 1 || r.left < 0 || r.right > 1600 || r.top < 0 || r.bottom > 900) errors.push(`Texte hors cadre : ${node.textContent}`);
        }
      }
      return errors;
    });
    if (issues.length) throw Error(issues.join('\n') + '\nRaccourcir la recette, jamais tronquer.');
    png = await page.locator('main').screenshot({ animations: 'disabled' });
  } finally { await browser.close(); }
  const bytes = await sharp(png).webp({ quality: 85, effort: 0 }).toBuffer();
  const meta = await sharp(bytes).metadata();
  if (meta.width !== 1600 || meta.height !== 900 || bytes.length >= 150000) throw Error('Dimensions ou poids de preuve hors contrat.');
  mkdirSync(dirname(join(root, source)), { recursive: true });
  mkdirSync(dirname(join(root, target)), { recursive: true });
  writeFileSync(join(root, source), html + '\n'); writeFileSync(join(root, target), bytes);
  return { source, target, proof: { title: d.h1, alt: `Simulation documentaire ${d.product} : ${d.task}, trois cas illustratifs, préparation, validation et arrêt.`, detail: 'Simulation locale des cas illustratifs de la règle écrite ; aucune exécution dans le logiciel éditeur.' } };
}
