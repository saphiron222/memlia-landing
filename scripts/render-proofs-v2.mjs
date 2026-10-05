/**
 * Rendu des preuves fonctionnelles du site v2 : docs/design/site-v2-proofs → public/proofs/v2.
 *
 * Même discipline que scripts/render-proof-images.mjs pour la série de l'accueil, dans un
 * script distinct : le premier scelle ses neuf cadres et vingt-et-un actifs par des
 * assertions exactes, et les toucher périmerait sa chaîne de rendu. Ici :
 *   - chaque cadre doit mesurer exactement 1600 × 900, ses polices chargées ;
 *   - aucun texte tronqué, masqué ni hors de son conteneur ;
 *   - le texte rendu est FIGÉ dans content-contract.json : `--adopt` l'enregistre après
 *     validation visuelle, `--check` refuse toute dérive sans rien écrire ;
 *   - un WebP par cadre, moins de 150 Ko, publié atomiquement avec son empreinte ;
 *   - un cadre marqué data-og produit en plus l'image sociale 1200 × 630 de sa page (og/).
 */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--adopt') ? 'adopt' : 'render';
const fec = process.argv.includes('--series=fec');
const maturite = process.argv.includes('--series=maturite');
const roi = process.argv.includes('--series=roi');
assert.ok([fec, roi, maturite].filter(Boolean).length <= 1, 'Choisir une seule série');
const series = maturite ? 'maturite-ia' : roi ? 'roi-automatisation' : fec ? 'fec-local' : 'site-v2';
const option = (name, fallback) => process.argv.find((arg) => arg.startsWith(`--${name}=`))?.split('=').slice(1).join('=') ?? fallback;
const source = option('source', maturite ? 'docs/design/maturite-ia-proof' : roi ? 'docs/design/roi-automatisation-proof' : fec ? 'docs/design/fec-local-proof' : 'docs/design/site-v2-proofs');
const contractPath = `${source}/content-contract.json`;
const manifestPath = option('manifest', `docs/qa/${series}/proofs-manifest.json`);
const startIndex = Number(option('start', maturite || roi ? '30' : fec ? '29' : '1'));
assert.ok(Number.isInteger(startIndex) && startIndex > 0, 'Index de départ invalide');
const output = `.qa/annotations/${series}-${mode}`;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
mkdirSync(output, { recursive: true });

const contract = existsSync(contractPath) ? JSON.parse(readFileSync(contractPath, 'utf8')) : [];
const browser = await chromium.launch({ channel: 'chromium' });
const records = [];
const candidates = [];
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
  assert.ok(ids.length > 0 && ids.every(Boolean), 'Chaque cadre porte un identifiant');
  if (mode !== 'adopt') assert.deepEqual(ids, contract.map((c) => c.id), 'Les cadres ne correspondent pas au contrat');

  await page.addStyleTag({ content: 'body{padding:0}main{display:block}.frame{display:none}.frame[data-render]{display:grid}' });
  const adopted = [];
  for (const [index, id] of ids.entries()) {
    await page.evaluate((cible) => {
      document.querySelector('[data-render]')?.removeAttribute('data-render');
      document.getElementById(cible).setAttribute('data-render', '');
    }, id);
    const element = page.locator(`#${id}`);
    await element.scrollIntoViewIfNeeded();
    const measured = await element.evaluate((root) => {
      const normalize = (text) => text.trim().split(/\s+/).filter(Boolean);
      const words = []; const clipped = []; const hidden = [];
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) continue;
        words.push(...normalize(node.textContent));
        const range = document.createRange(); range.selectNodeContents(node);
        const rects = [...range.getClientRects()];
        if (!rects.length || rects.every((r) => r.width === 0 || r.height === 0)) hidden.push(node.textContent.trim());
        for (const rect of rects) {
          let ancestor = node.parentElement;
          while (ancestor) {
            const css = getComputedStyle(ancestor);
            if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) === 0) hidden.push(node.textContent.trim());
            if (ancestor === root || ['hidden', 'clip'].includes(css.overflow)) {
              const box = ancestor.getBoundingClientRect();
              if (rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1) {
                clipped.push({ text: node.textContent.trim(), ancestor: ancestor.className });
              }
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
    if (mode !== 'adopt') assert.equal(measured.text, contract[index].centralText, `Contenu divergent : ${id}`);
    adopted.push({ id, centralText: measured.text });
    const name = `${String(index + startIndex).padStart(2, '0')}-${id}`;
    const png = await element.screenshot({ animations: 'disabled', path: `${output}/${name}.png` });
    const webp = await sharp(png).webp({ quality: 90, effort: 6 }).toBuffer();
    assert.ok(webp.length < 150_000, `Preuve trop lourde : ${name} (${webp.length} octets)`);
    writeFileSync(`${output}/${name}.webp`, webp);
    candidates.push({ target: `public/proofs/v2/${name}.webp`, bytes: webp, source: `${source}/index.html#${id}` });
    records.push({ id, pngSha256: hash(png), webpSha256: hash(webp), bytes: webp.length });
    // Un cadre de tête porte aussi l'image sociale de sa page : 1200 × 630, recadrée au centre du 16:9.
    if (await element.evaluate((root) => root.hasAttribute('data-og'))) {
      const og = await sharp(png).resize(1200, 675).extract({ left: 0, top: 22, width: 1200, height: 630 }).webp({ quality: 88, effort: 6 }).toBuffer();
      assert.ok(og.length < 150_000, `Image sociale trop lourde : ${name} (${og.length} octets)`);
      writeFileSync(`${output}/${name}-og.webp`, og);
      candidates.push({ target: `public/proofs/v2/og/${name}.webp`, bytes: og, source: `${source}/index.html#${id}` });
    }
  }
  assert.equal(new Set(records.map((r) => r.webpSha256)).size, records.length, 'Deux cadres rendent la même image');

  if (mode === 'adopt') {
    writeFileSync(contractPath, JSON.stringify(adopted, null, 2) + '\n');
  }
  const manifest = {
    schemaVersion: 1,
    sources: [`${source}/index.html`, `${source}/styles.css`, 'docs/design/m4-r1-functional-proofs/styles.css', contractPath, 'scripts/render-proofs-v2.mjs']
      .map((path) => ({ path, sha256: hash(readFileSync(path)) })),
    browser: browser.version(),
    entries: candidates.map((c) => ({ source: c.source, target: c.target, bytes: c.bytes.length, sha256: hash(c.bytes) })),
  };
  if (mode === 'check') {
    const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
    for (const candidate of candidates) {
      const entry = previous.entries.find((e) => e.target === candidate.target);
      assert.ok(entry, `Cible non répertoriée : ${candidate.target}`);
      assert.equal(entry.sha256, hash(candidate.bytes), `Manifeste périmé : ${candidate.target}`);
      assert.equal(hash(readFileSync(candidate.target)), hash(candidate.bytes), `Actif périmé : ${candidate.target}`);
    }
    console.log(`check : ${candidates.length} preuves v2 conformes à leur manifeste.`);
  } else {
    mkdirSync('public/proofs/v2/og', { recursive: true });
    mkdirSync(`docs/qa/${series}`, { recursive: true });
    for (const candidate of candidates) writeFileSync(candidate.target, candidate.bytes);
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    console.log(`${mode} : ${candidates.length} preuves v2 publiées dans public/proofs/v2, manifeste ${manifestPath}.`);
  }
  for (const r of records) console.log(`  ${r.id.padEnd(20)} ${Math.round(r.bytes / 1024)} Ko`);
} finally {
  await browser.close();
}
