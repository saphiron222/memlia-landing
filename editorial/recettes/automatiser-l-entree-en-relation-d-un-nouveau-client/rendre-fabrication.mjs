import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import MarkdownIt from 'markdown-it';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { injecterPreuvesInline, verifierRegleEcrite } from '../../../scripts/blog-forge.mjs';
const dir = dirname(fileURLToPath(import.meta.url));
const root = process.cwd();
const recette = JSON.parse(readFileSync(join(dir, 'recette.json'), 'utf8'));
const corps = readFileSync(join(dir, 'corps.md'), 'utf8');
assert.deepEqual(verifierRegleEcrite(corps, { date: recette.date }), []);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1728, height: 1100 } });
await page.goto(pathToFileURL(join(dir, 'figures.html')).href);
await page.evaluate(() => document.fonts.ready);
const figures = [];
for (const p of recette.inlineProofs) {
  const cadre = page.locator('#' + p.id);
  const box = await cadre.boundingBox();
  assert.equal(box.width, 1600); assert.equal(box.height, 900);
  const defauts = await cadre.evaluate(el => [...el.querySelectorAll('*')].filter(n => n.scrollWidth > n.clientWidth + 2 || n.scrollHeight > n.clientHeight + 2).map(n => n.tagName + '.' + n.className));
  assert.deepEqual(defauts, []);
  const png = await cadre.screenshot();
  const out = join(dir, `preuves/${p.id}.webp`);
  await sharp(png).webp({ quality: 86 }).toFile(out);
  assert.ok(statSync(out).size < 150000);
  figures.push({ id: p.id, width: 1600, height: 900, bytes: statSync(out).size, overflow: defauts });
}
const md = new MarkdownIt({ html: true });
let html = md.render(injecterPreuvesInline(corps, recette.inlineProofs));
html = html.replaceAll('/proofs/blog/', 'preuves/');
let n = 0;
const sommaire = [];
html = html.replace(/<h2>(.*?)<\/h2>/g, (_, t) => { const id = 'section-' + (++n); sommaire.push(`<li><a href="#${id}">${t}</a></li>`); return `<h2 id="${id}">${t}</h2>`; });
html = html.replace(/<table>[\s\S]*?<\/table>/g, t => `<div data-table-scroll tabindex="0" role="region" aria-label="Tableau défilant">${t}</div>`);
const tokens = readFileSync(join(root, 'src/styles/tokens.css'), 'utf8');
const layout = readFileSync(join(root, 'src/layouts/Article.astro'), 'utf8').split('<style>')[1].split('</style>')[0].replace(/:global\(([^)]*)\)/g, '$1');
const css = `@font-face{font-family:Fraunces;src:url('../../../public/fonts/fraunces-600.woff2');font-weight:600}@font-face{font-family:Hanken Grotesk;src:url('../../../public/fonts/hanken-400.woff2')}*{box-sizing:border-box}body{margin:0;background:#fffefb;color:#231f20;font:18px/1.65 'Hanken Grotesk',sans-serif}h1,h2,h3{font-family:Fraunces,serif;line-height:1.2}main{margin:auto;width:calc(100% - 40px);max-width:720px;padding:32px 0}img{max-width:100%;height:auto}h1{font-size:clamp(32px,5vw,50px)}[data-table-scroll]{overflow:auto;max-width:100%}`;
const preview = `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>${recette.tabTitle}</title><meta name="description" content="${recette.description}"><style>${tokens}\n${layout}\n${css}</style></head><body><main><p>Fabrication locale · non publiée · Kevin Kitanga</p><h1>${recette.title}</h1><p>${recette.summary}</p><nav aria-label="Sommaire"><ol>${sommaire.join('')}</ol></nav><img src="preuves/hero-1200.webp" width="1200" height="675" alt="${recette.image.alt}"><div class="article-corps">${html}</div><h2>Et dans votre cabinet ?</h2><p>${recette.cta.outcome}</p><a href="/contact">${recette.cta.label}</a></main></body></html>`;
writeFileSync(join(dir, 'rendu-fabrication.html'), preview);
const vues = [];
for (const width of [1280, 390]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(pathToFileURL(join(dir, 'rendu-fabrication.html')).href);
  await page.evaluate(() => document.fonts.ready);
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await image.evaluate(i => i.decode());
  }
  await page.evaluate(() => scrollTo(0, 0));
  assert.equal(await page.locator('h1').count(), 1);
  const etat = await page.evaluate(() => ({ width: innerWidth, pageWidth: document.documentElement.scrollWidth, images: [...document.images].map(i => ({ alt: i.alt, chargee: i.complete && i.naturalWidth > 0 })), tables: document.querySelectorAll('[data-table-scroll]').length, sommaire: [...document.querySelectorAll('nav a')].every(a => document.querySelector(a.hash)) }));
  assert.ok(etat.pageWidth <= width + 1);
  assert.ok(etat.images.every(i => i.alt && i.chargee));
  assert.ok(etat.sommaire);
  await page.screenshot({ path: join(dir, `preuves/rendu-${width}.png`), fullPage: true });
  vues.push(etat);
}
await browser.close();
writeFileSync(join(dir, 'preuves/rendu-controles.json'), JSON.stringify({ type: 'fabrication-locale-non-Astro-non-publiee', figures, vues, limites: 'Le rendu emploie les styles Article et la vraie injection de figures, mais pas Base/Article Astro ni JSON-LD public. Les cadres isolés doivent être intégrés au contrat global par platform après revue.' }, null, 2) + '\n');
console.log(JSON.stringify({ figures, vues }, null, 2));
