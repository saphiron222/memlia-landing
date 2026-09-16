import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { preparePreview } from '../../scripts/prepare-preview.mjs';

const INDEXABLE_META = '<meta name="robots" content="index, follow, max-image-preview:large">';
const NOINDEX_META = '<meta name="robots" content="noindex, follow">';
const PREVIEW_META = '<meta name="robots" content="noindex, nofollow">';

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-preview-'));
  const dist = join(root, 'dist');
  const target = join(root, '.qa', 'preview-dist');
  mkdirSync(join(dist, 'blog'), { recursive: true });
  writeFileSync(join(dist, 'index.html'), `<html><head>${INDEXABLE_META}</head><body>Accueil</body></html>`);
  writeFileSync(join(dist, '404.html'), `<html><head>${NOINDEX_META}</head><body>Absente</body></html>`);
  writeFileSync(join(dist, 'blog', 'article.html'), `<html><head>${INDEXABLE_META}</head><body>Article</body></html>`);
  writeFileSync(join(dist, 'asset.txt'), 'inchangé');
  return { root, dist, target };
}

test('prépare une copie noindex, nofollow sans modifier le dist indexable', () => {
  const { root, dist, target } = fixture();
  try {
    const originalIndex = readFileSync(join(dist, 'index.html'), 'utf8');
    const original404 = readFileSync(join(dist, '404.html'), 'utf8');

    const result = preparePreview({ source: dist, target });

    assert.deepEqual(result, { htmlFiles: 3, target });
    assert.equal(readFileSync(join(dist, 'index.html'), 'utf8'), originalIndex);
    assert.equal(readFileSync(join(dist, '404.html'), 'utf8'), original404);
    assert.match(readFileSync(join(target, '_headers'), 'utf8'), /X-Robots-Tag: noindex, nofollow/);
    for (const relative of ['index.html', '404.html', 'blog/article.html']) {
      const html = readFileSync(join(target, relative), 'utf8');
      assert.equal(html.match(/<meta name="robots"/g)?.length, 1);
      assert.match(html, new RegExp(PREVIEW_META));
      assert.doesNotMatch(html, /content="index, follow/);
      assert.doesNotMatch(html, /content="noindex, follow"/);
    }
    assert.equal(readFileSync(join(target, 'asset.txt'), 'utf8'), 'inchangé');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('refuse de préparer une preview dans le dist de production', () => {
  const { root, dist } = fixture();
  try {
    assert.throws(() => preparePreview({ source: dist, target: dist }), /distincte du dist/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('refuse un HTML sans meta robots unique plutôt que de publier une protection partielle', () => {
  const { root, dist, target } = fixture();
  try {
    writeFileSync(join(dist, 'index.html'), '<html><head></head><body>Accueil</body></html>');
    assert.throws(() => preparePreview({ source: dist, target }), /meta robots unique/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('refuse une preview candidat sans rapport de gate PASS correspondant', () => {
  const { root, dist, target } = fixture();
  try {
    assert.throws(
      () => preparePreview({ source: dist, target, candidateSlug: 'article-candidat', gateReport: join(root, 'gate.json') }),
      /gate PASS/
    );
    writeFileSync(join(root, 'gate.json'), JSON.stringify({ slug: 'autre-article', pass: true }));
    assert.throws(
      () => preparePreview({ source: dist, target, candidateSlug: 'article-candidat', gateReport: join(root, 'gate.json') }),
      /gate PASS/
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
