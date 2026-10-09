import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { resolve, extname } from 'node:path';
import vm from 'node:vm';
import { chromium } from 'playwright';
import sharp from 'sharp';
import { parse } from 'parse5';
import { BLOG_SKILLS, SEO_SKILLS } from '../../../scripts/lib/blog-pipeline.mjs';
import { reviewBindingErrors } from '../../../scripts/lib/blog-review-binding.mjs';

const slug = 'ia-comptabilite-confidentialite-donnees';
const dir = `editorial/recettes/${slug}`;
const imageDir = `editorial/articles/${slug}/preuves/image`;
const sourceDir = `editorial/articles/${slug}/preuves/sources`;
const root = resolve(`.qa/render-${slug}`);
const htmlPath = `${root}/blog/${slug}.html`;
const json = p => JSON.parse(readFileSync(p, 'utf8'));
const hash = b => createHash('sha256').update(b).digest('hex');
const recipe = json(`${dir}/recette.json`);
const packet = json(`${dir}/paquet-revue.json`);
const results = { reviewer: 'metier:t_6446d285', executedAt: new Date().toISOString(), htmlPath, checks: [] };
const record = (name, evidence) => results.checks.push({ name, evidence });

// Execute the original demonstration with its disk write intercepted, not rewritten.
let replay;
const code = readFileSync(`${dir}/rejouer-cas.mjs`, 'utf8')
  .replace(/^import .*;\n/gm, '')
  .replace("new URL('./journal-rejeu.json',import.meta.url)", "'journal-intercepte'");
vm.runInNewContext(code + '\nglobalThis.routerRevue = router;', {
  assert, Date, console: { log: () => {} },
  writeFileSync: (_path, text) => { replay = JSON.parse(text); },
  globalThis: results,
});
const router = results.routerRevue;
delete results.routerRevue;
assert.deepEqual(replay.resultats.map(r => r.sortie), ['PREPARATION_PRETE', 'RETIRER_IDENTIFIANT', 'ENVIRONNEMENT_INCONNU', 'ARBITRAGE_HUMAIN']);
assert.ok(replay.resultats.every(r => r.transmission === false));
assert.equal(router({ ...replay.resultats[0].entree, qualification: false }), 'QUALIFICATION_ABSENTE');
const sample = replay.resultats[0].entree;
const edgeCases = Object.fromEntries(['qualification', 'environnement', 'identifiantInutile', 'reconstructible'].map(key => {
  const c = { ...sample }; delete c[key]; return [key, router(c)];
}));
const journal = json(`${dir}/journal-rejeu.json`);
assert.deepEqual(replay.resultats, journal.resultats);
record('rejeu', { resultats: replay.resultats, qualificationAbsente: 'QUALIFICATION_ABSENTE', champsAbsents: edgeCases, scope: 'Le script ne valide pas tous les types/présences. Démonstration bornée aux qualifications booléennes fournies ; aucun outil réel, aucune transmission.' });

const catalogue = json(`${dir}/catalogue-lectures.json`);
const coverage = json(`${dir}/couverture-candidat.json`);
const names = coverage.lignes.map(r => r.skill);
assert.equal(names.length, 63);
assert.equal(new Set(names).size, 63);
const expected = new Set(['blog', 'seo', ...BLOG_SKILLS, ...SEO_SKILLS, ...catalogue.lectures.map(r => r[0])]);
assert.deepEqual([...new Set(names)].sort(), [...expected].sort());
for (const lecture of catalogue.lectures) {
  const path = resolve(catalogue.racines[lecture[1]], lecture[2]);
  assert.equal(hash(readFileSync(path)), lecture[3], path);
}
for (const row of coverage.lignes) {
  assert.ok(row.motif?.trim() && row.constat?.trim());
  for (const ref of row.lecture_ref) {
    const lecture = catalogue.lectures[Number(ref.split('/').at(-1))];
    assert.equal(lecture[0], row.skill);
  }
  if (row.etat === 'execute') assert.ok(row.preuves.length);
  for (const proof of row.preuves) assert.ok(existsSync(resolve(dir, proof)), proof);
}
const states = {};
for (const row of coverage.lignes) states[row.etat] = (states[row.etat] ?? 0) + 1;
record('couverture', { uniqueSkills: names.length, lectures: catalogue.lectures.length, states, rows: coverage.lignes.map(r => ({ skill: r.skill, phase: r.phase, etat: r.etat, motif: r.motif, constat: r.constat })), scope: 'Cohérence et existence contrôlées ; ni nouvelle lecture intégrale de 65 skills ni 63 workflows exécutés.' });

function text(node) {
  if (['script', 'style', 'head', 'noscript', 'template'].includes(node.tagName) || node.attrs?.some(a => a.name === 'hidden')) return '';
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes ?? []).map(text).join(' ');
}
for (const source of recipe.sources) {
  const native = readFileSync(`${sourceDir}/${source.id}.source.txt`);
  const receipt = json(`${sourceDir}/${source.id}.json`);
  assert.equal(hash(native), receipt.contentSha256);
  const content = text(parse(native.toString())).replace(/\s+/g, ' ');
  for (const claim of packet.claims.filter(c => c.sourceId === source.id)) assert.ok(content.includes(claim.citation));
  record(`source-${source.id}`, { httpStatusAuthor: receipt.httpStatus, retrievedAtAuthor: receipt.retrievedAt, nativeIntegrity: true, exactCitationsPresent: true });
}

for (const path of [`${imageDir}/master.png`, `${imageDir}/og.webp`, ...[768, 1200, 1600].flatMap(w => ['webp', 'avif'].map(ext => `public/images/${recipe.image.heroId}-${w}.${ext}`)), ...recipe.inlineProofs.map(f => `public/proofs/blog/${f.id}.webp`)]) {
  const meta = await sharp(path).metadata();
  record('image-dimension', { path, width: meta.width, height: meta.height, format: meta.format, bytes: statSync(path).size });
}
const visual = json(`${imageDir}/visual-review.json`);
assert.equal(visual.palette.statut, 'PASS');
assert.equal(hash(readFileSync(`${imageDir}/master.png`)), json(`${imageDir}/generation.json`).outputSha256);
record('palette', visual.palette);

const server = createServer((req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const path = resolve(root, '.' + rel);
  if (!path.startsWith(root + '/') || !existsSync(path)) { res.writeHead(404); res.end(); return; }
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.woff2': 'font/woff2', '.webp': 'image/webp', '.avif': 'image/avif', '.svg': 'image/svg+xml' };
  res.setHeader('Content-Type', types[extname(path)] ?? 'application/octet-stream');
  res.end(readFileSync(path));
});
await new Promise(resolveReady => server.listen(0, '127.0.0.1', resolveReady));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('response', r => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`); });
    assert.equal((await page.goto(`${base}/blog/${slug}.html`, { waitUntil: 'networkidle' })).status(), 200);
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('h1').innerText(), recipe.title);
    assert.equal(await page.title(), recipe.tabTitle);
    assert.equal(await page.locator('html').getAttribute('lang'), 'fr');
    assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), `https://memlia.fr/blog/${slug}`);
    assert.equal(await page.locator('meta[name=description]').getAttribute('content'), recipe.description);
    const body = await page.locator('.article-corps').innerText();
    if (width === 1280) writeFileSync(`${dir}/revue-html-lu.txt`, body + '\n\nCHROME / ATTRIBUTION\n' + await page.locator('body').innerText());
    const schemas = (await page.locator('script[type="application/ld+json"]').allTextContents()).map(s => JSON.parse(s));
    assert.ok(JSON.stringify(schemas).includes('Kevin Kitanga'));
    for (const c of packet.claims) assert.ok(body.includes(c.claim));
    const links = await page.locator('.article-corps a').evaluateAll(es => es.map(e => e.getAttribute('href')));
    for (const link of recipe.links.outgoing) {
      assert.ok(links.includes(link));
      const url = new URL(link, base);
      const paths = [resolve(root, '.' + url.pathname), resolve(root, '.' + url.pathname + '.html'), resolve(root, '.' + url.pathname, 'index.html')];
      assert.ok(paths.some(existsSync), link);
      if (url.hash) {
        const linkedHtml = readFileSync(paths.find(p => existsSync(p) && statSync(p).isFile()), 'utf8');
        assert.ok(linkedHtml.includes(`id="${url.hash.slice(1)}"`), link);
      }
    }
    for (const img of await page.locator('main img').all()) { await img.scrollIntoViewIfNeeded(); await img.evaluate(e => e.decode()); }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    const tables = await page.locator('.article-corps table').evaluateAll(es => es.map(t => {
      const wrap = t.parentElement;
      wrap.scrollLeft = wrap.scrollWidth;
      t.scrollLeft = t.scrollWidth;
      return { headers: [...t.querySelectorAll('th')].map(e => e.textContent), rows: t.rows.length, tableWidth: t.offsetWidth, parentWidth: wrap.clientWidth, scrollMax: wrap.scrollWidth - wrap.clientWidth, scrolled: wrap.scrollLeft, selfScrollMax: t.scrollWidth - t.clientWidth, selfScrolled: t.scrollLeft, font: getComputedStyle(t.querySelector('td')).fontSize, cells: [...t.querySelectorAll('th,td')].map(e => ({ text: e.textContent, display: getComputedStyle(e).display, visibility: getComputedStyle(e).visibility, width: e.getBoundingClientRect().width })) };
    }));
    assert.equal(tables.length, 4);
    assert.ok(tables.every(t => t.headers.length));
    const images = await page.locator('main img').evaluateAll(es => es.map(e => ({ src: e.currentSrc, alt: e.alt, width: e.clientWidth, naturalWidth: e.naturalWidth, naturalHeight: e.naturalHeight, loading: e.loading, priority: e.fetchPriority })));
    const headings = await page.locator('main h1, main h2, main h3').evaluateAll(es => es.map(e => ({ tag: e.tagName, text: e.textContent })));
    assert.deepEqual(errors, []);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `${dir}/revue-capture-${width}.png`, fullPage: true });
    record(`navigateur-${width}`, { tables, images, headings, schemas, errors, meta: await page.locator('meta').evaluateAll(es => es.map(e => ({ name: e.name || e.getAttribute('property'), content: e.content }))) });
    await page.close();
  }
} finally { await browser.close(); await new Promise(r => server.close(r)); }
if (existsSync(`${dir}/revues.json`)) {
  const review = json(`${dir}/revues.json`);
  assert.deepEqual(reviewBindingErrors(review, slug, readFileSync(`${dir}/corps.md`, 'utf8'), readFileSync(`${dir}/recette.json`), readFileSync(htmlPath, 'utf8')), []);
  assert.equal(review.reviewerProfile, 'metier');
  assert.equal(review.reviewerTaskId, 't_6446d285');
  assert.equal(Object.keys(review.editorial.criteria).length, 7);
  assert.equal(Object.keys(review.image.criteria).length, 6);
  assert.deepEqual(Object.keys(review.business.claims).sort(), packet.claims.map(c => c.id).sort());
  assert.equal(review.qualite.score, Object.values(review.qualite.categories).reduce((n, c) => n + c.score, 0));
  record('revue-json-binding', { exactSubject: true, completeGrids: true, scoreVerified: review.qualite.score });
}
writeFileSync(`${dir}/revue-verification.json`, JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify({reviewer: results.reviewer, checks: results.checks.map(c => c.name), browserTables: results.checks.filter(c => c.name.startsWith('navigateur')).map(c => ({ name: c.name, tables: c.evidence.tables.map(t => ({ headers: t.headers, hiddenCells: t.cells.filter(e => e.display === 'none' || e.width === 0), scrollMax: t.scrollMax, selfScrollMax: t.selfScrollMax, selfScrolled: t.selfScrolled })) })) }, null, 2));
