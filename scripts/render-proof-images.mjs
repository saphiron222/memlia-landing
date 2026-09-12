/** Rendu reproductible des preuves HTML ; --check ne publie rien et compare les octets. */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const check = process.argv.includes('--check');
const source = 'docs/design/m4-r1-functional-proofs';
const output = `.qa/annotations/${check ? 'recheck' : 'render'}`;
const contract = JSON.parse(readFileSync(`${source}/content-contract.json`, 'utf8'));
const manifestPath = 'docs/qa/m4-r4/media-manifest.json';
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const records = [];
const candidates = [];
mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chromium' });
try {
  const page = await browser.newPage({ viewport: { width: 1720, height: 1000 }, deviceScaleFactor: 1 });
  const failures = [];
  page.on('requestfailed', request => failures.push(request.url()));
  page.on('pageerror', error => failures.push(error.message));
  await page.goto(pathToFileURL(resolve(source, 'index.html')).href);
  await page.evaluate(() => document.fonts.ready);
  assert.deepEqual(failures, [], 'Chargement incomplet');
  const fonts = await page.evaluate(() => [...document.fonts].map(f => ({ family: f.family, status: f.status })));
  assert.equal(fonts.length, 3);
  assert.ok(fonts.every(f => f.status === 'loaded'), 'Polices non chargées');
  assert.equal(await page.locator('.frame').count(), 9);
  // Origine fixe : le défilement d'une longue planche change la rastérisation des ombres.
  await page.addStyleTag({ content: 'body{padding:0}main{display:block}.frame{display:none}.frame[data-render]{display:grid}' });
  for (const [index, frame] of contract.entries()) {
    const element = page.locator(`#${frame.id}`);
    await page.evaluate(id => {
      document.querySelector('[data-render]')?.removeAttribute('data-render');
      document.getElementById(id).setAttribute('data-render', '');
    }, frame.id);
    await element.scrollIntoViewIfNeeded();
    const measured = await element.evaluate(root => {
      const normalize = text => text.trim().split(/\s+/).filter(Boolean);
      const words = [];
      const clipped = [];
      const hidden = [];
      let checkedTextNodes = 0;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) continue;
        words.push(...normalize(node.textContent));
        // La flèche du curseur est dessinée en CSS, le caractère de secours a une taille nulle.
        if (node.parentElement.classList.contains('cursor')) continue;
        checkedTextNodes++;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()];
        if (!rects.length || rects.every(rect => rect.width === 0 || rect.height === 0)) hidden.push(node.textContent.trim());
        for (const rect of rects) {
          let ancestor = node.parentElement;
          while (ancestor) {
            const css = getComputedStyle(ancestor);
            if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) === 0) {
              hidden.push(node.textContent.trim());
            }
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
      const overlaps = [];
      for (const label of root.querySelectorAll('.cursor span')) {
        const a = label.getBoundingClientRect();
        for (const button of root.querySelectorAll('button')) {
          const b = button.getBoundingClientRect();
          if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) {
            overlaps.push({ label: label.textContent, button: button.textContent });
          }
        }
      }
      const box = root.getBoundingClientRect();
      const generated = [...root.querySelectorAll('*'), root].flatMap(el => ['::before', '::after'].map(p => getComputedStyle(el, p).content)).join(' ');
      return { width: box.width, height: box.height, text: words.join(' '), generated, clipped, hidden, overlaps, checkedTextNodes,
        forbiddenElements: root.querySelectorAll('.frame-head,.frame-no,.proof-caption,.kicker').length };
    });
    assert.equal(measured.width, 1600);
    assert.equal(measured.height, 900);
    assert.equal(measured.forbiddenElements, 0);
    assert.equal(measured.text, frame.centralText, `Contenu fonctionnel divergent : ${frame.id}`);
    for (const entry of contract) for (const forbidden of entry.removed) {
      assert.ok(!`${measured.text} ${measured.generated}`.includes(forbidden), `Annotation rendue : ${forbidden}`);
    }
    assert.deepEqual(measured.clipped, [], `Texte tronqué : ${frame.id}`);
    assert.deepEqual(measured.hidden, [], `Texte masqué : ${frame.id}`);
    assert.deepEqual(measured.overlaps, [], `Curseur sur un bouton : ${frame.id}`);
    const name = `${String(index + 1).padStart(2, '0')}-${frame.id}`;
    const png = await element.screenshot({ animations: 'disabled', path: `${output}/${name}.png` });
    if (check) assert.equal(hash(readFileSync(`${source}/renders/${name}.png`)), hash(png), `PNG périmé : ${name}`);
    const webp = await sharp(png).webp({ quality: 90, effort: 6 }).toBuffer();
    assert.ok(webp.length < 150_000, `Preuve trop lourde : ${name}`);
    candidates.push({ target: `public/proofs/${name}.webp`, bytes: webp, source: `${source}/index.html#${frame.id}` });
    writeFileSync(`${output}/${name}.webp`, webp);
    records.push({ id: frame.id, width: measured.width, height: measured.height, checkedTextNodes: measured.checkedTextNodes,
      clipped: measured.clipped, pngSha256: hash(png), webpSha256: hash(webp), bytes: webp.length });
  }
  assert.equal(new Set(records.map(r => r.webpSha256)).size, 9);
  // Les deux couvertures de blog proviennent des mêmes preuves : ne pas conserver d'annotations dérivées.
  for (const entry of manifest.entries.filter(e => e.derivative && e.source.startsWith('public/proofs/'))) {
    const input = candidates.find(c => c.target === entry.source);
    assert.ok(input, `Source de dérivé inconnue : ${entry.source}`);
    const [, width, format] = entry.target.match(/-(\d+)\.(avif|webp)$/);
    const bytes = await sharp(input.bytes).resize(Number(width)).toFormat(format, { quality: 85 }).toBuffer();
    candidates.push({ target: entry.target, source: entry.source, bytes });
  }
  assert.equal(candidates.length, 21);
  for (const candidate of candidates) {
    const entry = manifest.entries.find(e => e.target === candidate.target);
    assert.ok(entry, `Cible non répertoriée : ${candidate.target}`);
    if (check) {
      assert.equal(hash(readFileSync(candidate.target)), hash(candidate.bytes), `Actif périmé : ${candidate.target}`);
      assert.equal(entry.sha256, hash(candidate.bytes), `Manifeste périmé : ${candidate.target}`);
    }
  }
  // Publication seulement après le rendu, la validation et l'encodage de tout le lot.
  const proofRender = {
    browser: browser.version(),
    sources: [`${source}/index.html`, `${source}/styles.css`, `${source}/content-contract.json`,
      'scripts/render-proof-images.mjs', 'package-lock.json', 'public/fonts/fraunces-600.woff2',
      'public/fonts/hanken-400.woff2', 'public/fonts/hanken-600.woff2'].map(path => ({ path, sha256: hash(readFileSync(path)) })),
    pngs: records.map((record, index) => ({ path: `${source}/renders/${String(index + 1).padStart(2, '0')}-${record.id}.png`, sha256: record.pngSha256 })),
  };
  if (check) assert.deepEqual(manifest.proofRender, proofRender, 'Chaîne de rendu périmée');
  if (!check) {
    mkdirSync(`${source}/renders`, { recursive: true });
    for (const [index, frame] of contract.entries()) {
      const name = `${String(index + 1).padStart(2, '0')}-${frame.id}`;
      copyFileSync(`${output}/${name}.png`, `${source}/renders/${name}.png`);
    }
    for (const candidate of candidates) {
      writeFileSync(candidate.target, candidate.bytes);
      Object.assign(manifest.entries.find(e => e.target === candidate.target), {
        source: candidate.source, sha256: hash(candidate.bytes), bytes: candidate.bytes.length,
      });
    }
    manifest.sources.sourceProofs = source;
    manifest.proofRender = proofRender;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  }
  const report = { mode: check ? 'check' : 'render', browser: browser.version(), fonts,
    sources: ['index.html', 'styles.css', 'content-contract.json'].map(name => ({ name, sha256: hash(readFileSync(`${source}/${name}`)) })),
    records, assets: candidates.map(c => ({ target: c.target, bytes: c.bytes.length, sha256: hash(c.bytes) })) };
  writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
