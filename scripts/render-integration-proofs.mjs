import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--adopt') ? 'adopt' : 'render';
const source = 'docs/design/integration-proofs';
const contractPath = `${source}/content-contract.json`;
const manifestPath = 'docs/qa/integration-proofs/proofs-manifest.json';
const output = `.qa/annotations/integration-proofs-${mode}`;
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const contract = existsSync(contractPath) ? JSON.parse(readFileSync(contractPath, 'utf8')) : [];
const sourcePaths = [`${source}/index.html`, `${source}/styles.css`, contractPath, 'scripts/render-integration-proofs.mjs'];

// Cloudflare Pages ne fournit pas Chromium. Le rendu pixel complet reste
// obligatoire en recette locale ; le build distant vérifie le sceau portable
// des sources, du contrat, du manifeste et des WebP déjà revus.
if (mode === 'check' && process.env.CF_PAGES === '1') {
  const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
  assert.equal(previous.schemaVersion, 1, 'Version de manifeste inconnue');
  assert.equal(contract.length, 10, 'Dix scènes sont requises');
  const ids = contract.map(({ id }) => id);
  assert.equal(new Set(ids).size, 10, 'Chaque scène porte un identifiant unique');
  assert.deepEqual(previous.sources, sourcePaths.map((path) => ({ path, sha256: sha256(readFileSync(path)) })), 'Sources ou contrat de rendu périmés');
  assert.equal(previous.entries.length, 10, 'Le manifeste ne couvre pas les dix scènes');
  assert.deepEqual(previous.entries.map(({ source: path }) => path), ids.map((id) => `${source}/index.html#${id}`), 'Ordre ou source des scènes divergent du contrat');
  assert.equal(new Set(previous.entries.map(({ target }) => target)).size, 10, 'Deux scènes partagent le même actif');
  for (const [index, entry] of previous.entries.entries()) {
    assert.equal(entry.target, `public/proofs/integrations/${ids[index]}.webp`, `Cible inattendue : ${entry.target}`);
    const bytes = readFileSync(entry.target);
    assert.equal(bytes.length, entry.bytes, `Taille périmée : ${entry.target}`);
    assert.ok(bytes.length < 150_000, `Actif trop lourd : ${entry.target}`);
    assert.equal(sha256(bytes), entry.sha256, `Actif périmé : ${entry.target}`);
  }
  console.log('check Cloudflare : 10 preuves intégrations scellées, sources et actifs intègres.');
  process.exit(0);
}

mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({ viewport: { width: 1720, height: 1000 }, deviceScaleFactor: 1 });
  const failures = [];
  page.on('requestfailed', (request) => failures.push(request.url()));
  page.on('pageerror', (error) => failures.push(error.message));
  await page.goto(pathToFileURL(resolve(source, 'index.html')).href);
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(failures, [], 'Chargement incomplet');
  const fonts = await page.evaluate(() => [...document.fonts].map((font) => ({ family: font.family, status: font.status })));
  assert.ok(fonts.filter((font) => font.status === 'loaded').length >= 2, `Polices non chargées : ${JSON.stringify(fonts)}`);
  const ids = await page.locator('.frame').evaluateAll((elements) => elements.map((element) => element.id));
  assert.equal(ids.length, 10, 'Dix scènes sont requises');
  assert.equal(new Set(ids).size, 10, 'Chaque scène porte un identifiant unique');
  if (mode !== 'adopt') assert.deepEqual(ids, contract.map((entry) => entry.id), 'Les scènes divergent du contrat');

  await page.addStyleTag({ content: 'body{padding:0}main{display:block}.frame{display:none}.frame[data-render]{display:grid}' });
  const adopted = [];
  const candidates = [];
  for (const id of ids) {
    await page.evaluate((target) => {
      document.querySelector('[data-render]')?.removeAttribute('data-render');
      document.getElementById(target)?.setAttribute('data-render', '');
    }, id);
    const element = page.locator(`#${id}`);
    const measured = await element.evaluate((root) => {
      const words = [];
      const clipped = [];
      const hidden = [];
      const rootBox = root.getBoundingClientRect();
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        const value = node.textContent?.trim();
        if (!value) continue;
        words.push(...value.split(/\s+/));
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()];
        if (!rects.length) hidden.push(value);
        for (const rect of rects) {
          if (rect.left < rootBox.left - 1 || rect.right > rootBox.right + 1 || rect.top < rootBox.top - 1 || rect.bottom > rootBox.bottom + 1) clipped.push(value);
        }
      }
      return { width: rootBox.width, height: rootBox.height, text: words.join(' '), clipped, hidden };
    });
    assert.equal(measured.width, 1600, `Largeur ${id}`);
    assert.equal(measured.height, 900, `Hauteur ${id}`);
    assert.deepEqual(measured.clipped, [], `Texte tronqué : ${id}`);
    assert.deepEqual(measured.hidden, [], `Texte masqué : ${id}`);
    const expected = contract.find((entry) => entry.id === id);
    if (mode !== 'adopt') assert.equal(measured.text, expected?.centralText, `Contenu divergent : ${id}`);
    adopted.push({ id, centralText: measured.text });
    const png = await element.screenshot({ animations: 'disabled', path: `${output}/${id}.png` });
    const webp = await sharp(png).webp({ quality: 89, effort: 6 }).toBuffer();
    assert.ok(webp.length < 150_000, `${id} dépasse 150 Ko (${webp.length} octets)`);
    writeFileSync(`${output}/${id}.webp`, webp);
    candidates.push({ source: `${source}/index.html#${id}`, target: `public/proofs/integrations/${id}.webp`, bytes: webp.length, sha256: sha256(webp), buffer: webp });
  }
  assert.equal(new Set(candidates.map((candidate) => candidate.sha256)).size, 10, 'Deux scènes rendent la même image');
  if (mode === 'adopt') writeFileSync(contractPath, `${JSON.stringify(adopted, null, 2)}\n`);

  const manifest = {
    schemaVersion: 1,
    sources: sourcePaths.map((path) => ({ path, sha256: sha256(readFileSync(path)) })),
    browser: browser.version(),
    entries: candidates.map(({ source, target, bytes, sha256 }) => ({ source, target, bytes, sha256 })),
  };
  if (mode === 'check') {
    const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(manifest, previous, 'Le manifeste des preuves intégrations a dérivé');
    for (const candidate of candidates) assert.equal(sha256(readFileSync(candidate.target)), candidate.sha256, `Actif périmé : ${candidate.target}`);
    console.log('check : 10 preuves intégrations conformes à leur contrat et à leur manifeste.');
  } else {
    mkdirSync('public/proofs/integrations', { recursive: true });
    mkdirSync('docs/qa/integration-proofs', { recursive: true });
    for (const candidate of candidates) writeFileSync(candidate.target, candidate.buffer);
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`${mode} : 10 preuves intégrations publiées et manifestées.`);
  }
  for (const candidate of candidates) console.log(`  ${candidate.target} ${Math.round(candidate.bytes / 1024)} Ko`);
} finally {
  await browser.close();
}
