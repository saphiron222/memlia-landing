import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { verifyCandidateBatchPreview, productionArtifactsErrors, reviewPackage } from '../../scripts/blog-pipeline.mjs';
import { preparePreview } from '../../scripts/prepare-preview.mjs';
import { isBlogEntryVisibleForSlugs, parseBlogPreviewSlugs } from '../../src/data/blog-visibility.mjs';

const slugs = ['controler-les-bulletins-de-paie-avant-la-dsn', 'suivre-la-production-sociale-dans-excel'];
const previewOrigin = 'https://preview-blog-lot.memlia.pages.dev';
const robots = '<meta name="robots" content="index, follow, max-image-preview:large">';

function writeCandidate(dist, slug, otherSlug) {
  mkdirSync(join(dist, 'blog'), { recursive: true });
  writeFileSync(join(dist, 'blog', `${slug}.html`), `<!doctype html><html><head>${robots}<link rel="canonical" href="https://memlia.fr/blog/${slug}"><meta property="og:image" content="${previewOrigin}/images/${slug}-og.webp"><meta name="twitter:image" content="${previewOrigin}/images/${slug}-og.webp"><script type="application/ld+json">{"@graph":[{"@type":"BlogPosting","image":{"url":"${previewOrigin}/images/${slug}-og.webp"},"thumbnailUrl":"${previewOrigin}/images/${slug}-og.webp"}]}</script></head><body><article data-article="${slug}"><p>Candidat éditorial — preview privée, non publiable</p><div class="article-corps"><a href="/blog/${otherSlug}">Article lié</a></div></article></body></html>`);
  mkdirSync(join(dist, 'images'), { recursive: true });
  writeFileSync(join(dist, 'images', `${slug}-og.webp`), 'fixture');
}

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'memlia-blog-batch-'));
  const dist = join(root, 'dist');
  const target = join(root, 'preview');
  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, 'index.html'), `<html><head>${robots}</head><body>Accueil</body></html>`);
  writeCandidate(dist, slugs[0], slugs[1]);
  writeCandidate(dist, slugs[1], slugs[0]);
  writeFileSync(join(dist, 'sitemap-0.xml'), '<urlset></urlset>');
  mkdirSync(join(dist, 'blog'), { recursive: true });
  writeFileSync(join(dist, 'blog', 'rss.xml'), '<rss></rss>');
  const gateReports = Object.fromEntries(slugs.map((slug) => {
    const path = join(root, `${slug}.gate.json`);
    writeFileSync(path, JSON.stringify({ slug, pass: true, errors: [] }));
    return [slug, path];
  }));
  return { root, dist, target, gateReports };
}

test('normalise une liste explicite de slugs de preview sans ouvrir tous les brouillons', () => {
  assert.deepEqual(parseBlogPreviewSlugs(' premier ,second,premier '), ['premier', 'second']);
  assert.throws(() => parseBlogPreviewSlugs('premier,,second'), /slug vide/i);
  assert.equal(isBlogEntryVisibleForSlugs({ id: 'second', data: { brouillon: true } }, ['premier', 'second']), true);
  assert.equal(isBlogEntryVisibleForSlugs({ id: 'tiers', data: { brouillon: true } }, ['premier', 'second']), false);
  assert.equal(isBlogEntryVisibleForSlugs({ id: 'public', data: { brouillon: false } }, []), true);
});

test('prépare un paquet uniquement si chaque candidat du lot possède un gate PASS correspondant', () => {
  const { root, dist, target, gateReports } = fixture();
  try {
    assert.throws(
      () => preparePreview({ source: dist, target, candidateSlugs: slugs, gateReports: { [slugs[0]]: gateReports[slugs[0]] } }),
      new RegExp(`gate PASS.*${slugs[1]}`, 'i')
    );
    const result = preparePreview({ source: dist, target, candidateSlugs: slugs, gateReports });
    assert.equal(result.htmlFiles, 3);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('vérifie dans le paquet que chaque article lie l’autre et que les deux destinations existent', () => {
  const { root, dist, target, gateReports } = fixture();
  try {
    preparePreview({ source: dist, target, candidateSlugs: slugs, gateReports });
    assert.deepEqual(verifyCandidateBatchPreview(slugs, target, previewOrigin), []);

    writeFileSync(join(target, 'blog', `${slugs[0]}.html`), `<!doctype html><html><head>${robots}</head><body><article data-article="${slugs[0]}"><div class="article-corps"><p>Lien absent</p></div></article></body></html>`);
    assert.ok(verifyCandidateBatchPreview(slugs, target, previewOrigin).some((error) => error.includes(`/${slugs[1]}`)));

    rmSync(join(target, 'blog', `${slugs[1]}.html`));
    assert.ok(verifyCandidateBatchPreview(slugs, target, previewOrigin).some((error) => error.includes(`blog/${slugs[1]}.html`)));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('le contrôle de production exige toutes les pages du lot dans le même build', () => {
  const { root, dist } = fixture();
  try {
    assert.ok(productionArtifactsErrors(root, slugs).some((e) => e.includes('sitemap')));
    writeFileSync(join(dist, 'sitemap-0.xml'), slugs.map((slug) => `<loc>https://memlia.fr/blog/${slug}</loc>`).join(''));
    writeFileSync(join(dist, 'blog', 'rss.xml'), slugs.map((slug) => `<link>https://memlia.fr/blog/${slug}</link>`).join(''));
    assert.deepEqual(productionArtifactsErrors(root, slugs), []);
    rmSync(join(dist, 'blog', `${slugs[1]}.html`));
    assert.ok(productionArtifactsErrors(root, slugs).some((e) => e.includes(slugs[1])));
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('le paquet de revue sollicite un reçu opérateur borné aux octets, non un go humain routinier', () => {
  const { root } = fixture();
  try {
    const dossier = join(root, 'editorial', 'articles', slugs[0]);
    mkdirSync(dossier, { recursive: true });
    writeFileSync(join(dossier, 'manifest.json'), '{}');
    const paquet = readFileSync(reviewPackage(slugs[0], { pass: true, errors: [] }, root), 'utf8');
    assert.match(paquet, /SHA-256/);
    assert.match(paquet, /opérateur.*octets/i);
    assert.doesNotMatch(paquet, /décision explicite de Kevin|go individuel de Kevin/i);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
