import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import sharp from 'sharp';
import { MODELS } from '../../src/lib/bibliotheque-prompts.mjs';
const route = '/outils-comptables-gratuits/bibliotheque-prompts-comptables';
test('bibliothèque construite : metadata, corps statique, médias, sitemap et entrants contextuels', async () => {
  const html = readFileSync(`dist${route}.html`, 'utf8');
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.ok(html.includes('Bibliothèque de prompts comptables'));
  assert.ok(html.includes(`href="https://memlia.fr${route}"`));
  assert.ok(html.includes('name="robots" content="index, follow, max-image-preview:large"'));
  assert.ok(html.includes('connect-src &#39;none&#39;') || html.includes("connect-src 'none'"));
  assert.ok(html.includes('L’assemblage, sa source et son refus sont visibles.'));
  for (const m of MODELS) assert.ok(html.includes(`data-model="${m.id}"`));
  for (const type of ['WebPage', 'WebApplication', 'BreadcrumbList']) assert.ok(html.includes(`"@type":"${type}"`));
  assert.ok(!html.includes('"@type":"BlogPosting"'));
  assert.ok(readFileSync('dist/sitemap-0.xml', 'utf8').includes(`https://memlia.fr${route}`));
  for (const from of ['outils-comptables-gratuits', 'methode', 'outils-comptables-gratuits/generateur-prompt-expert-comptable']) {
    const source = readFileSync(`dist/${from}.html`, 'utf8');
    const main = source.split('<main')[1].split('</main>')[0];
    assert.ok(main.includes(`href="${route}"`), from);
  }
  for (const [file, width, height] of [['31-outil-bibliotheque.webp',1600,900], ['og/31-outil-bibliotheque.webp',1200,630]]) {
    const bytes = readFileSync(`public/proofs/v2/${file}`);
    const meta = await sharp(bytes).metadata();
    assert.equal(meta.width, width); assert.equal(meta.height, height); assert.ok(bytes.length < 150000);
  }
});
