/**
 * Rend les preuves fonctionnelles intégrées aux articles du blog.
 *
 * Série distincte des preuves de l’accueil et du site v2 : leurs renderers scellent
 * des nombres exacts d’actifs. Ici, chaque cadre mesure 1600 × 900, son texte est
 * figé dans content-contract.json, et son WebP reste sous 150 Ko.
 *
 * Recette de référence (décision Kevin du 03/10/2026) : une figure de corps est UNE
 * image 1600 × 900, servie telle quelle sur bureau comme sur téléphone, jamais une
 * variante portrait « -mobile ». Elle montre l’écran d’un outil fictif dans la fenêtre
 * de référence (pastille, nom de l’écran, « Jeu d’essai fictif · contexte ») : elle
 * illustre, elle n’explique pas l’article.
 *
 *   --adopt  fige le texte après revue visuelle et publie les actifs
 *   (sans option) rend et publie contre le contrat existant
 *   --check  refuse toute dérive sans écrire dans public/ ni dans le manifeste
 */
import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const mode = process.argv.includes('--check') ? 'check' : process.argv.includes('--adopt') ? 'adopt' : 'render';
const source = 'docs/design/blog-article-proofs';
const contractPath = `${source}/content-contract.json`;
const manifestPath = 'docs/qa/blog-article-proofs/manifest.json';
const output = `.qa/annotations/blog-article-proofs-${mode}`;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
const records = [];
const candidates = [];
mkdirSync(output, { recursive: true });

// Les hashes WebP scellent un rendu visuel produit et revu sur macOS. Les
// recalculer dans l'image Linux de Cloudflare donnerait des octets différents
// (rasterisation des polices), même lorsque le contenu et la mise en page sont
// inchangés. En CI Pages, on vérifie donc le sceau portable : sources, manifeste
// et actifs versionnés. Le rendu pixel complet reste obligatoire localement.
if (mode === 'check' && process.env.CF_PAGES === '1') {
  const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const currentSources = previous.sources.map(({ path }) => ({ path, sha256: hash(readFileSync(path)) }));
  assert.deepEqual(previous.sources, currentSources, 'Sources ou contrat de rendu périmés');
  assert.equal(previous.entries.length, contract.length, 'Le manifeste doit couvrir une image et une seule par preuve');
  assert.ok(previous.entries.every((entry) => !/-mobile\.webp$/.test(entry.target)), 'Aucune variante portrait n’est attendue');
  for (const entry of previous.entries) {
    assert.ok(existsSync(entry.target), `Actif absent : ${entry.target}`);
    assert.equal(hash(readFileSync(entry.target)), entry.sha256, `Actif périmé : ${entry.target}`);
  }
  console.log(`check Cloudflare : ${previous.entries.length} preuves scellées, sources et actifs intègres.`);
  process.exit(0);
}

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
  assert.ok(fonts.length >= 3 && fonts.every((font) => font.status === 'loaded'), 'Polices non chargées');
  const ids = await page.locator('.frame').evaluateAll((elements) => elements.map((element) => element.id));
  assert.ok(ids.length > 0, 'Au moins un article avec preuves est attendu');
  assert.equal(new Set(ids).size, ids.length, 'Identifiants de preuve en double');
  assert.deepEqual(ids, contract.map((entry) => entry.id), 'Les cadres ne correspondent pas au contrat');
  assert.ok(contract.every((entry) => entry.article && entry.alt && entry.source && entry.capturedAt), 'Métadonnées de preuve incomplètes');
  assert.ok(contract.every((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry.capturedAt)
    && !Number.isNaN(Date.parse(`${entry.capturedAt}T00:00:00Z`))), 'Date de capture invalide');
  const articles = Map.groupBy(contract, (entry) => entry.article);

  for (const [article, preuves] of articles) {
    assert.equal(preuves.length, 2, `${article} doit porter exactement deux preuves`);
    const recettePath = `editorial/recettes/${article}/recette.json`;
    assert.ok(existsSync(recettePath), `Recette absente : ${article}`);
    const recette = JSON.parse(readFileSync(recettePath, 'utf8'));
    assert.deepEqual(recette.inlineProofs?.map(({ id }) => id), preuves.map(({ id }) => id), `Recette et contrat divergent : ${article}`);
  }

  // Recette : chaque cadre est une seule fenêtre de référence dont l’en-tête nomme l’écran
  // et se déclare jeu d’essai fictif (ou reconstitution).
  const chromes = await page.locator('.frame').evaluateAll((frames) => frames.map((frame) => {
    const windows = frame.querySelectorAll(':scope > .window.full');
    const bar = windows[0]?.querySelector(':scope > header.window-bar');
    const parts = bar ? [...bar.children] : [];
    return {
      id: frame.id,
      children: [...frame.childNodes].filter((node) => node.nodeType === Node.ELEMENT_NODE
        || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())).length,
      windows: windows.length,
      dot: parts[0]?.classList.contains('dot') ?? false,
      name: parts[1]?.tagName === 'B' ? parts[1].textContent.trim() : '',
      context: parts.at(-1)?.tagName === 'SPAN' ? parts.at(-1).textContent.trim() : '',
    };
  }));
  for (const chrome of chromes) {
    assert.equal(chrome.windows, 1, `Une seule fenêtre attendue : ${chrome.id}`);
    // Rien à côté de la fenêtre : une explication ajoutée hors de l'écran serait figée par --adopt.
    assert.equal(chrome.children, 1, `Le cadre ne contient que sa fenêtre : ${chrome.id}`);
    assert.ok(chrome.dot && chrome.name, `En-tête de fenêtre incomplet : ${chrome.id}`);
    assert.match(chrome.context, /^(Jeu d’essai fictif|Reconstitution) · \S/, `Provenance fictive absente de l’en-tête : ${chrome.id}`);
  }

  await page.addStyleTag({ content: 'body{padding:0}main{display:block}.frame{display:none}.frame[data-render]{display:grid}' });
  const adopted = [];
  for (const entry of contract) {
    await page.evaluate((id) => {
      document.querySelector('[data-render]')?.removeAttribute('data-render');
      document.getElementById(id)?.setAttribute('data-render', '');
    }, entry.id);
    const element = page.locator(`#${entry.id}`);
    await element.scrollIntoViewIfNeeded();
    const measured = await element.evaluate((root) => {
      const normalize = (text) => text.trim().split(/\s+/).filter(Boolean);
      const words = [];
      const clipped = [];
      const hidden = [];
      let checkedTextNodes = 0;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode;
        if (!node.textContent.trim()) continue;
        words.push(...normalize(node.textContent));
        checkedTextNodes += 1;
        const range = document.createRange();
        range.selectNodeContents(node);
        const rects = [...range.getClientRects()];
        if (!rects.length || rects.every((rect) => rect.width === 0 || rect.height === 0)) hidden.push(node.textContent.trim());
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
      return { width: box.width, height: box.height, text: words.join(' '), clipped, hidden, checkedTextNodes };
    });
    assert.equal(measured.width, 1600, `Largeur ${entry.id}`);
    assert.equal(measured.height, 900, `Hauteur ${entry.id}`);
    assert.deepEqual(measured.clipped, [], `Texte tronqué : ${entry.id}`);
    assert.deepEqual(measured.hidden, [], `Texte masqué : ${entry.id}`);
    if (mode !== 'adopt') assert.equal(measured.text, entry.centralText, `Contenu divergent : ${entry.id}`);
    adopted.push({ ...entry, centralText: measured.text });

    const png = await element.screenshot({ animations: 'disabled', path: `${output}/${entry.id}.png` });
    const webp = await sharp(png).webp({ quality: 88, effort: 6 }).toBuffer();
    assert.ok(webp.length < 150_000, `Preuve trop lourde : ${entry.id} (${webp.length} octets)`);
    writeFileSync(`${output}/${entry.id}.webp`, webp);
    const target = `public/proofs/blog/${entry.id}.webp`;
    candidates.push({ target, source: `${source}/index.html#${entry.id}`, bytes: webp });
    records.push({ id: entry.id, article: entry.article, checkedTextNodes: measured.checkedTextNodes, pngSha256: hash(png), webpSha256: hash(webp), bytes: webp.length });
  }
  assert.equal(new Set(records.map((record) => record.webpSha256)).size, records.length, 'Deux preuves rendent la même image');

  if (mode === 'adopt') writeFileSync(contractPath, `${JSON.stringify(adopted, null, 2)}\n`);
  const manifest = {
    schemaVersion: 1,
    sources: [`${source}/index.html`, `${source}/styles.css`, contractPath, 'scripts/render-blog-article-proofs.mjs']
      .map((path) => ({ path, sha256: hash(readFileSync(path)) })),
    browser: browser.version(),
    entries: candidates.map((candidate) => ({ source: candidate.source, target: candidate.target, bytes: candidate.bytes.length, sha256: hash(candidate.bytes) })),
  };
  if (mode === 'check') {
    const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));
    assert.deepEqual(previous.sources, manifest.sources, 'Sources ou contrat de rendu périmés');
    assert.equal(previous.entries.length, candidates.length, 'Manifeste incomplet');
    for (const candidate of candidates) {
      const previousEntry = previous.entries.find((entry) => entry.target === candidate.target);
      assert.ok(previousEntry, `Cible non répertoriée : ${candidate.target}`);
      assert.equal(previousEntry.sha256, hash(candidate.bytes), `Manifeste périmé : ${candidate.target}`);
      assert.equal(hash(readFileSync(candidate.target)), hash(candidate.bytes), `Actif périmé : ${candidate.target}`);
    }
    console.log(`check : ${candidates.length} preuves d’article conformes à leur contrat et à leur manifeste.`);
  } else {
    mkdirSync('public/proofs/blog', { recursive: true });
    mkdirSync('docs/qa/blog-article-proofs', { recursive: true });
    for (const candidate of candidates) writeFileSync(candidate.target, candidate.bytes);
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    console.log(`${mode} : ${candidates.length} preuves d’article publiées dans public/proofs/blog.`);
  }
  for (const record of records) console.log(`  ${record.id.padEnd(30)} ${Math.round(record.bytes / 1024)} Ko`);
} finally {
  await browser.close();
}
