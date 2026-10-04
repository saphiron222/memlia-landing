import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';

const project = resolve(import.meta.dirname, '../..');
const source = 'docs/design/blog-article-proofs';
const contract = JSON.parse(readFileSync(join(project, source, 'content-contract.json'), 'utf8'));

test('le renderer adopte les quatre nouveaux articles depuis leur contrat sans réécrire les historiques', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-growth-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const path of [source, 'public/fonts', ...contract.map(({ article }) => `editorial/recettes/${article}`)]) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    cpSync(join(project, path), join(root, path), { recursive: true });
  }
  // Le manifeste inclut le programme réellement exécuté.
  mkdirSync(join(root, 'scripts'), { recursive: true });
  cpSync(join(project, 'scripts/render-blog-article-proofs.mjs'), join(root, 'scripts/render-blog-article-proofs.mjs'));
  // Comparer deux rendus sur le même hôte : Linux et macOS rasterisent différemment.
  const baseline = spawnSync(process.execPath, [join(project, 'scripts/render-blog-article-proofs.mjs')], {
    cwd: root, env: { ...process.env, CF_PAGES: '0' }, encoding: 'utf8', timeout: 120_000,
  });
  assert.equal(baseline.status, 0, baseline.stderr);
  const historicAssets = new Map(contract.map(({ id }) => [id, readFileSync(join(root, `public/proofs/blog/${id}.webp`))]));
  const htmlPath = join(root, source, 'index.html');
  let html = readFileSync(htmlPath, 'utf8');
  const original = html;
  const dom = parse(original, { sourceCodeLocationInfo: true });
  function frameFor(node, id) {
    if (node.attrs?.some((attr) => attr.name === 'id' && attr.value === id)) {
      return original.slice(node.sourceCodeLocation.startOffset, node.sourceCodeLocation.endOffset);
    }
    for (const child of node.childNodes ?? []) {
      const frame = frameFor(child, id);
      if (frame) return frame;
    }
  }
  const extended = structuredClone(contract);
  for (const article of ['utiliser-chatgpt-cabinet-comptable', 'verifier-reponse-ia-comptabilite',
    'ia-comptabilite-confidentialite-donnees', 'automatiser-avec-ia-sans-changer-logiciel']) {
    const preuves = contract.slice(0, 2).map((entry, index) => {
      const id = `${article}-${index + 1}`;
      const frame = frameFor(dom, entry.id);
      assert.ok(frame, entry.id);
      const added = frame.replace(`id="${entry.id}"`, `id="${id}"`)
        .replace(/(<b>)[^<]+(<\/b>)/, `$1Essai ${extended.length + index}$2`);
      html = html.replace('</main>', `${added}\n</main>`);
      return { ...entry, id, article, source: `${source}/index.html#${id}` };
    });
    extended.push(...preuves);
    const recette = join(root, 'editorial/recettes', article, 'recette.json');
    mkdirSync(dirname(recette), { recursive: true });
    writeFileSync(recette, JSON.stringify({ inlineProofs: preuves }));
  }
  writeFileSync(htmlPath, html);
  writeFileSync(join(root, source, 'content-contract.json'), JSON.stringify(extended));
  const result = spawnSync(process.execPath, [join(project, 'scripts/render-blog-article-proofs.mjs'), '--adopt'], {
    cwd: root, env: { ...process.env, CF_PAGES: '0' }, encoding: 'utf8', timeout: 120_000,
  });
  assert.equal(result.status, 0, result.stderr);
  const adopted = JSON.parse(readFileSync(join(root, source, 'content-contract.json')));
  assert.deepEqual(adopted.slice(0, contract.length), contract);
  const manifest = JSON.parse(readFileSync(join(root, 'docs/qa/blog-article-proofs/manifest.json')));
  assert.equal(manifest.entries.length, extended.length);
  for (const entry of contract) {
    assert.deepEqual(readFileSync(join(root, `public/proofs/blog/${entry.id}.webp`)),
      historicAssets.get(entry.id));
  }
  // Retirer un écran et son entrée ensemble ne satisfait pas le contrat de paire.
  const removed = adopted.pop();
  const mutantDom = parse(html, { sourceCodeLocationInfo: true });
  function removeFrame(node) {
    if (node.attrs?.some((attr) => attr.name === 'id' && attr.value === removed.id)) {
      html = html.slice(0, node.sourceCodeLocation.startOffset) + html.slice(node.sourceCodeLocation.endOffset);
      return true;
    }
    return (node.childNodes ?? []).some(removeFrame);
  }
  assert.ok(removeFrame(mutantDom));
  writeFileSync(htmlPath, html);
  writeFileSync(join(root, source, 'content-contract.json'), JSON.stringify(adopted));
  const incomplete = spawnSync(process.execPath, [join(project, 'scripts/render-blog-article-proofs.mjs'), '--adopt'], {
    cwd: root, env: { ...process.env, CF_PAGES: '0' }, encoding: 'utf8', timeout: 120_000,
  });
  assert.notEqual(incomplete.status, 0);
  assert.match(incomplete.stderr, /doit porter exactement deux preuves/);
});

for (const [label, extra] of [
  ['nœud texte avant la fenêtre', 'Texte parasite<article class="window full">'],
  ['nœud texte après la fenêtre', '<article class="window full">'],
  ['élément hors fenêtre', '<p>Texte parasite</p><article class="window full">'],
]) {
  test(`le renderer refuse un ${label}, même en adoption`, (t) => {
    const root = mkdtempSync(join(tmpdir(), 'memlia-blog-frame-'));
    t.after(() => rmSync(root, { recursive: true, force: true }));
    for (const path of [source, 'public/fonts', 'scripts/render-blog-article-proofs.mjs', ...contract.map(({ article }) => `editorial/recettes/${article}`)]) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      cpSync(join(project, path), join(root, path), { recursive: true });
    }
    const path = join(root, source, 'index.html');
    let html = readFileSync(path, 'utf8').replace('<article class="window full">', extra);
    if (label === 'nœud texte après la fenêtre') html = html.replace('</article>', '</article>Texte parasite');
    writeFileSync(path, html);
    const result = spawnSync(process.execPath, [join(project, 'scripts/render-blog-article-proofs.mjs'), '--adopt'], {
      cwd: root, env: { ...process.env, CF_PAGES: '0' }, encoding: 'utf8', timeout: 120_000,
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Le cadre ne contient que sa fenêtre/);
  });
}
