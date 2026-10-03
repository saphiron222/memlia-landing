import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--adopt') ? 'adopt' : 'render';
const source = 'docs/design/blog-recrutement-proofs';
const contractPath = `${source}/content-contract.json`;
const manifestPath = 'docs/qa/blog-recrutement-proofs.json';
const output = `.qa/annotations/blog-recrutement-${mode}`;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
mkdirSync(output, { recursive: true });
const contract = existsSync(contractPath) ? JSON.parse(readFileSync(contractPath, 'utf8')) : [];
const replayPath = 'docs/qa/blog-recrutement-replay.json';
const replay = JSON.parse(readFileSync(replayPath, 'utf8'));
assert.equal(replay.status, 'PASS', 'L’oracle de rejeu doit être PASS avant le rendu des preuves');
assert.equal(replay.fictitious, true, 'L’oracle de rejeu doit porter uniquement sur des cas fictifs');
assert.equal(replay.articles.length, 2, 'L’oracle doit couvrir les deux articles du lot');
assert.ok(replay.articles.every((article) => article.status === 'PASS' && article.cases.length >= 3 && article.cases.every((entry) => entry.passed)), 'Tous les cas de rejeu doivent être PASS');
const proofRecipes = new Map();
for (const recipeDir of readdirSync('editorial/recettes', { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const recipePath = `editorial/recettes/${recipeDir.name}/recette.json`;
  if (!existsSync(recipePath)) continue;
  const recipe = JSON.parse(readFileSync(recipePath, 'utf8'));
  for (const proof of recipe.inlineProofs ?? []) proofRecipes.set(proof.id, { article: recipe.slug, ...proof });
}

if (mode === 'check' && process.env.CF_PAGES === '1') {
  const prior = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const sources = prior.sources.map(({ path }) => ({ path, sha256: hash(readFileSync(path)) }));
  assert.deepEqual(prior.sources, sources, 'Sources ou contrat de rendu périmés');
  assert.equal(prior.entries.length, contract.length + 2, 'Le manifeste ne couvre pas toutes les variantes');
  for (const entry of prior.entries) {
    assert.ok(existsSync(entry.target), `Actif absent : ${entry.target}`);
    assert.equal(hash(readFileSync(entry.target)), entry.sha256, `Actif périmé : ${entry.target}`);
  }
  console.log(`check Cloudflare : ${prior.entries.length} preuves du cluster scellées.`);
  process.exit(0);
}

const browser = await chromium.launch({ channel: 'chromium' });
const records = [];
try {
  const page = await browser.newPage({ viewport: { width: 1720, height: 1000 }, deviceScaleFactor: 1 });
  const failures = [];
  page.on('requestfailed', (request) => failures.push(request.url()));
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(pathToFileURL(resolve(source, 'index.html')).href);
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(failures, [], 'Chargement incomplet');
  const fonts = await page.evaluate(() => [...document.fonts].map((f) => ({ family: f.family, status: f.status })));
  assert.ok(fonts.length >= 3 && fonts.every((f) => f.status === 'loaded'), 'Polices non chargées');
  const ids = await page.locator('.frame').evaluateAll((els) => els.map((el) => el.id));
  assert.equal(ids.length, 4, 'Quatre preuves attendues');
  assert.ok(ids.every((id) => proofRecipes.has(id)), 'Chaque cadre doit correspondre à une preuve déclarée dans une recette');
  if (mode !== 'adopt') assert.deepEqual(ids, contract.map((c) => c.id), 'Cadres hors contrat');
  if (mode !== 'adopt') {
    assert.ok(contract.every((entry) => entry.article && entry.alt && entry.source && /^\d{4}-\d{2}-\d{2}$/.test(entry.capturedAt)), 'Métadonnées de preuve incomplètes');
    const articles = Map.groupBy(contract, (entry) => entry.article);
    assert.equal(articles.size, 2, 'Deux articles distincts sont attendus');
    for (const [article, proofs] of articles) assert.equal(proofs.length, 2, `${article} doit porter exactement deux preuves`);
  }
  await page.addStyleTag({ content: 'body{padding:0}main{display:block}.frame{display:none}.frame[data-render]{display:grid}' });
  const adopted = [];
  for (const id of ids) {
    await page.evaluate((target) => {
      document.querySelector('[data-render]')?.removeAttribute('data-render');
      document.getElementById(target).setAttribute('data-render', '');
    }, id);
    const element = page.locator(`#${id}`);
    const measured = await element.evaluate((root) => {
      const words = []; const clipped = []; const hidden = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) continue;
        words.push(...node.textContent.trim().split(/\s+/));
        const range = document.createRange(); range.selectNodeContents(node);
        const rects = [...range.getClientRects()];
        if (!rects.length || rects.every((r) => !r.width || !r.height)) hidden.push(node.textContent.trim());
        for (const rect of rects) {
          let ancestor = node.parentElement;
          while (ancestor) {
            const css = getComputedStyle(ancestor);
            if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) === 0) hidden.push(node.textContent.trim());
            if (ancestor === root || ['hidden', 'clip'].includes(css.overflow)) {
              const box = ancestor.getBoundingClientRect();
              if (rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1) clipped.push(node.textContent.trim());
            }
            if (ancestor === root) break;
            ancestor = ancestor.parentElement;
          }
        }
      }
      const box = root.getBoundingClientRect();
      return { width: box.width, height: box.height, text: words.join(' '), clipped, hidden };
    });
    assert.equal(measured.width, 1600, `Largeur ${id}`);
    assert.equal(measured.height, 900, `Hauteur ${id}`);
    assert.deepEqual(measured.clipped, [], `Texte tronqué : ${id}`);
    assert.deepEqual(measured.hidden, [], `Texte masqué : ${id}`);
    const expected = contract.find((c) => c.id === id)?.centralText;
    if (mode !== 'adopt') assert.equal(measured.text, expected, `Contenu divergent : ${id}`);
    adopted.push({ ...proofRecipes.get(id), centralText: measured.text });
    const png = await element.screenshot({ animations: 'disabled', path: `${output}/${id}.png` });
    const webp = await sharp(png).webp({ quality: 88, effort: 6 }).toBuffer();
    assert.ok(webp.length < 150_000, `Preuve trop lourde : ${id}`);
    const target = `public/proofs/blog/${id}.webp`;
    records.push({ id, source: `${source}/index.html#${id}`, target, bytes: webp.length, sha256: hash(webp), buffer: webp });
  }
  assert.equal(new Set(records.map((r) => r.sha256)).size, records.length, 'Deux preuves identiques');
  const portrait = await browser.newPage({ viewport: { width: 360, height: 900 }, deviceScaleFactor: 3 });
  try {
    await portrait.goto(pathToFileURL(resolve(source, 'index.html')).href);
    await portrait.evaluate(() => document.fonts.ready);
    await portrait.addStyleTag({ content: 'main{display:block}.frame{display:none}.frame[data-render]{display:grid}' });
    for (const entry of contract.filter((item) => item.article === 'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain')) {
      await portrait.evaluate((id) => {
        document.querySelector('[data-render]')?.removeAttribute('data-render');
        document.getElementById(id)?.setAttribute('data-render', '');
      }, entry.id);
      const element = portrait.locator(`#${entry.id}`);
      const measured = await element.evaluate((root) => {
        const nodes = [];
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) if (walker.currentNode.textContent.trim()) nodes.push(walker.currentNode);
        const box = root.getBoundingClientRect();
        const clipped = nodes.filter((node) => {
          const range = document.createRange(); range.selectNodeContents(node);
          return [...range.getClientRects()].some((rect) => rect.left < box.left - 1 || rect.right > box.right + 1 || rect.bottom > box.bottom + 1);
        }).map((node) => node.textContent.trim());
        return { width: box.width, overflow: root.scrollWidth > root.clientWidth, clipped,
          fontSize: Math.min(...nodes.map((node) => parseFloat(getComputedStyle(node.parentElement).fontSize))),
          text: nodes.flatMap((node) => node.textContent.trim().split(/\s+/)).join(' ') };
      });
      assert.equal(measured.width, 360, `Portrait ${entry.id}`);
      assert.equal(measured.overflow, false, `Débordement portrait ${entry.id}`);
      assert.deepEqual(measured.clipped, [], `Texte coupé portrait ${entry.id}`);
      assert.ok(measured.fontSize >= 18, `Texte trop petit portrait ${entry.id}`);
      assert.equal(measured.text, entry.centralText, `Texte divergent portrait ${entry.id}`);
      const png = await element.screenshot({ animations: 'disabled', path: `${output}/${entry.id}-mobile.png` });
      const buffer = await sharp(png).resize({ width: 1200 }).webp({ quality: 86, effort: 6 }).toBuffer();
      assert.ok(buffer.length < 250_000, `Preuve portrait trop lourde : ${entry.id}`);
      const target = `public/proofs/blog/${entry.id}-mobile.webp`;
      records.push({ id: `${entry.id}-mobile`, source: `${source}/index.html#${entry.id}`, target, bytes: buffer.length, sha256: hash(buffer), buffer });
    }
  } finally {
    await portrait.close();
  }
  if (mode === 'adopt') writeFileSync(contractPath, JSON.stringify(adopted, null, 2) + '\n');
  const manifest = { schemaVersion: 1, browser: browser.version(), sources: [`${source}/index.html`, `${source}/styles.css`, contractPath, `${source}/replay-fixtures.json`, replayPath, 'scripts/replay-blog-recrutement-cases.mjs', 'scripts/render-blog-recrutement-proofs.mjs'].map((path) => ({ path, sha256: hash(readFileSync(path)) })), entries: records.map(({ buffer, ...r }) => r) };
  if (mode === 'check') {
    const prior = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(prior, manifest, 'Manifeste périmé');
    for (const record of records) assert.equal(hash(readFileSync(record.target)), record.sha256, `Actif périmé : ${record.target}`);
    console.log(`check : ${records.length} preuves blog conformes.`);
  } else {
    mkdirSync('public/proofs/blog', { recursive: true });
    mkdirSync('docs/qa', { recursive: true });
    for (const record of records) writeFileSync(record.target, record.buffer);
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`${mode} : ${records.length} preuves blog publiées.`);
  }
} finally {
  await browser.close();
}
