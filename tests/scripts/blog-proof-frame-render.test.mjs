import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import test from 'node:test';

const project = resolve(import.meta.dirname, '../..');
const source = 'docs/design/blog-article-proofs';
const contract = JSON.parse(readFileSync(join(project, source, 'content-contract.json'), 'utf8'));

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
