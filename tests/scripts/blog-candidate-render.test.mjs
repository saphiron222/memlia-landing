import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';

import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test as nodeTest } from 'node:test';
import sharp from 'sharp';
import { chromium } from '@playwright/test';
import { preparePreview } from '../../scripts/prepare-preview.mjs';
import { createCompleteDossier, DEFAULT_BODY } from './blog-fixture.mjs';

const test = (name, run) => nodeTest(name, { timeout: 180_000 }, run);
const REPO = resolve(import.meta.dirname, '../..');
const ASTRO_PACKAGE = fileURLToPath(import.meta.resolve('astro/package.json'));
const DEPENDENCIES = dirname(dirname(ASTRO_PACKAGE));
const ASTRO_CLI = join(dirname(ASTRO_PACKAGE), 'bin/astro.mjs');
const slug = 'fixture-candidat-pipeline';
const heroId = 'img-fixture-candidat-pipeline';
const previewOrigin = 'https://preview-blog-fixture.memlia.pages.dev';

function copyFile(source, target) {
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
}

function pagePath(root, pathname) {
  if (pathname === '/') return join(root, 'index.html');
  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  const direct = join(root, clean);
  if (existsSync(direct) && statSync(direct).isFile()) return direct;
  if (existsSync(`${direct}.html`)) return `${direct}.html`;
  return join(direct, 'index.html');
}

async function servePreview(root) {
  const server = createServer((request, response) => {
    const path = pagePath(root, new URL(request.url, 'http://127.0.0.1').pathname);
    if (!existsSync(path)) {
      response.writeHead(404, { 'X-Robots-Tag': 'noindex, nofollow' });
      response.end('not found');
      return;
    }
    response.writeHead(200, {
      'Content-Type': path.endsWith('.html') ? 'text/html; charset=utf-8' : path.endsWith('.xml') ? 'application/xml' : 'application/octet-stream',
      'X-Robots-Tag': 'noindex, nofollow',
    });
    response.end(readFileSync(path));
  });
  await new Promise((resolveReady) => server.listen(0, '127.0.0.1', resolveReady));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

test('la fixture candidate est réellement construite par Astro puis servie en preview cohérente', async () => {
  mkdirSync(join(REPO, '.qa'), { recursive: true });
  const workspace = mkdtempSync(join(REPO, '.qa', 'blog-astro-fixture-'));
  const project = join(workspace, 'site');
  const staging = join(workspace, 'staging');
  let server;
  let browser;
  try {
    mkdirSync(project, { recursive: true });
    for (const entry of ['src', 'public', 'editorial', 'scripts', 'astro.config.mjs', 'tsconfig.json', 'package.json']) {
      copyFile(join(REPO, entry), join(project, entry));
    }
    symlinkSync(DEPENDENCIES, join(project, 'node_modules'), 'dir');

    const fixtureBody = `${DEFAULT_BODY}

<figure data-blog-proof="fixture-frontiere">
  <img src="/proofs/blog/fixture-frontiere.webp" alt="Frontière fictive entre proposition automatisée et validation humaine." width="640" height="360" loading="lazy" decoding="async">
</figure>

<figure data-blog-proof="fixture-refus">
  <img src="/proofs/blog/fixture-refus.webp" alt="Cas fictif refusé lorsque la règle métier manque." width="640" height="360" loading="lazy" decoding="async">
</figure>`;
    const fixture = await createCompleteDossier(staging, { slug, heroId, body: fixtureBody, claimsBody: DEFAULT_BODY });
    copyFile(fixture.articlePath, join(project, 'src/content/blog', `${slug}.md`));
    copyFile(fixture.dossier, join(project, 'editorial/articles', slug));
    copyFile(join(staging, 'docs/strategy/site-v3/mesures'), join(project, 'docs/strategy/site-v3/mesures'));
    for (const extension of ['avif', 'webp']) {
      copyFile(join(staging, `public/images/${heroId}-768.${extension}`), join(project, `public/images/${heroId}-768.${extension}`));
    }
    copyFile(join(staging, `public/images/${heroId}-og.webp`), join(project, `public/images/${heroId}-og.webp`));
    for (const proofId of ['fixture-frontiere', 'fixture-refus']) {
      const proofPath = join(project, `public/proofs/blog/${proofId}.webp`);
      mkdirSync(dirname(proofPath), { recursive: true });
      await sharp({
        create: {
          width: 640,
          height: 360,
          channels: 3,
          background: proofId === 'fixture-frontiere' ? '#dff5e6' : '#f3efe3',
        },
      }).webp().toFile(proofPath);
    }

    const imagesPath = join(project, 'src/data/images.mjs');
    const images = readFileSync(imagesPath, 'utf8');
    const marker = '\n};\n\n/** Formats livrés';
    assert.ok(images.includes(marker), 'point d’insertion du manifeste image introuvable');
    writeFileSync(imagesPath, images
      .replace(marker, `\n  '${heroId}': {\n    brief: 'FIXTURE',\n    largeurs: [768],\n    ratio: [16, 9],\n    alt: '${fixture.manifest.image.alt}',\n    generee: true,\n  },${marker}`)
      .replace("export const PUBLISHED_IMAGE_IDS = [", `export const PUBLISHED_IMAGE_IDS = ['${heroId}', `));
    const indexPath = join(project, 'src/pages/index.astro');
    writeFileSync(indexPath, `${readFileSync(indexPath, 'utf8')}\n<a data-fixture-link href="/blog/${slug}">Fixture candidat</a>\n`);

    const rubriquesPath = join(project, 'src/data/blog-rubriques.mjs');
    const rubriques = readFileSync(rubriquesPath, 'utf8');
    const horsRubriqueMarker = 'export const ARTICLES_HORS_RUBRIQUE = Object.freeze({';
    assert.ok(rubriques.includes(horsRubriqueMarker), 'registre des articles hors rubrique introuvable');
    writeFileSync(rubriquesPath, rubriques.replace(
      horsRubriqueMarker,
      `${horsRubriqueMarker}\n  '${slug}': Object.freeze({ date: '${fixture.manifest.publicationDate}', raison: 'Fixture transversale du pipeline, sans route de rubrique dédiée.' }),`,
    ));

    const blogPath = join(project, 'src/pages/blog.astro');
    const blogSource = readFileSync(blogPath, 'utf8');
    const distSentinel = join(project, 'dist', 'sentinel.txt');
    mkdirSync(dirname(distSentinel), { recursive: true });
    writeFileSync(distSentinel, 'artefact préexistant');
    const runGate = () => {
      return spawnSync(process.execPath, [join(project, 'scripts/blog-pipeline.mjs'), 'gate', slug], {
        cwd: project,
        env: { ...process.env, BLOG_PREVIEW_SLUG: slug, BLOG_PREVIEW_SLUGS: slug },
        encoding: 'utf8',
        timeout: 120_000,
        maxBuffer: 10 * 1024 * 1024,
      });
    };
    // La page /blog émet le lien entrant par deux endroits depuis l’épinglage du pilier : l’article mis en
    // avant et la liste décroissante. Les deux sont neutralisés, et chaque ancre est exigée présente —
    // sinon ce témoin resterait vert en ne neutralisant plus rien.
    const EMETTEURS_DE_LIEN = ['{pilier && (', '{suite.map('];
    const deadBranch = EMETTEURS_DE_LIEN.reduce((source, ancre) => {
      assert.ok(source.includes(ancre), `la page /blog n’émet plus de lien par ${ancre} : l’oracle de ce témoin doit suivre la page`);
      return source.replaceAll(ancre, `{false && ${ancre.slice(1)}`);
    }, blogSource);
    assert.notEqual(deadBranch, blogSource, 'la fixture doit placer les boucles réelles dans une branche morte');
    writeFileSync(blogPath, deadBranch);
    const deadBranchGate = runGate();
    assert.equal(deadBranchGate.status, 1, 'une boucle présente dans le source mais absente du rendu ne doit pas être créditée');
    assert.match(deadBranchGate.stdout, new RegExp(`Le lien entrant depuis /blog vers /blog/${slug} est absent\\.`));
    assert.equal(readFileSync(distSentinel, 'utf8'), 'artefact préexistant', 'le gate ne doit pas remplacer dist');
    writeFileSync(blogPath, blogSource);

    const gate = runGate();
    assert.equal(gate.status, 0, `${gate.error?.message ?? ''}\n${gate.stdout ?? ''}\n${gate.stderr ?? ''}`);
    assert.equal(readFileSync(distSentinel, 'utf8'), 'artefact préexistant', 'le gate positif ne doit pas remplacer dist');

    const build = spawnSync(process.execPath, [ASTRO_CLI, 'build', '--root', project], {
      cwd: project,
      env: { ...process.env, BLOG_PREVIEW_SLUG: slug, BLOG_PREVIEW_SLUGS: slug, BLOG_PREVIEW_ORIGIN: previewOrigin },
      encoding: 'utf8',
      timeout: 120_000,
      maxBuffer: 10 * 1024 * 1024,
    });
    assert.equal(build.status, 0, `${build.error?.message ?? ''}\n${build.stdout ?? ''}\n${build.stderr ?? ''}`);
    const strip = spawnSync(process.execPath, [join(project, 'scripts/strip-briefs.mjs')], {
      cwd: project,
      env: { ...process.env, BLOG_PREVIEW_SLUG: slug, BLOG_PREVIEW_SLUGS: slug, BLOG_PREVIEW_ORIGIN: previewOrigin },
      encoding: 'utf8',
      timeout: 120_000,
    });
    assert.equal(strip.status, 0, `${strip.error?.message ?? ''}\n${strip.stdout ?? ''}\n${strip.stderr ?? ''}`);

    const dist = join(project, 'dist');
    const blogHtml = readFileSync(pagePath(dist, '/blog'), 'utf8');
    assert.ok(blogHtml.includes(`href="/blog/${slug}"`), 'la liste /blog rendue ne référence pas le candidat de la collection');
    const gatePath = join(project, 'gate.json');
    writeFileSync(gatePath, JSON.stringify({ slug, pass: true, errors: [] }));
    const preview = join(project, 'preview');
    preparePreview({ source: dist, target: preview, candidateSlug: slug, gateReport: gatePath });

    const articlePath = join(preview, 'blog', `${slug}.html`);
    assert.ok(existsSync(articlePath), 'le candidat n’a pas été construit par Astro');
    const html = readFileSync(articlePath, 'utf8');
    const ogUrl = `${previewOrigin}/images/${heroId}-og.webp`;
    assert.match(html, /<meta name="robots" content="noindex, nofollow">/);
    assert.ok(html.includes(`<link rel="canonical" href="https://memlia.fr/blog/${slug}">`));
    assert.ok(html.includes(`<meta property="og:image" content="${ogUrl}">`), 'OG candidat non appliqué');
    assert.ok(html.includes('<meta property="og:image:width" content="1200">'));
    assert.ok(html.includes('<meta property="og:image:height" content="630">'));
    assert.ok(html.includes(`<meta name="twitter:image" content="${ogUrl}">`), 'Twitter image candidate non appliquée');
    assert.ok(html.includes(`href="${fixture.manifest.cta.destination}"`), 'destination CTA candidate non appliquée');
    assert.ok(html.includes(fixture.manifest.cta.label), 'libellé CTA candidat non appliqué');
    assert.ok(html.includes(fixture.manifest.cta.outcome), 'résultat CTA candidat non rendu');

    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    assert.ok(jsonLdMatch, 'JSON-LD Article absent');
    const graph = JSON.parse(jsonLdMatch[1]);
    const posting = graph['@graph'].find((node) => node['@type'] === 'BlogPosting');
    assert.equal(posting.url, `https://memlia.fr/blog/${slug}`);
    assert.equal(posting.image.url, ogUrl);
    assert.equal(posting.image.width, 1200);
    assert.equal(posting.image.height, 630);
    assert.equal(posting.thumbnailUrl, ogUrl);

    for (const xmlPath of ['sitemap-0.xml', 'blog/rss.xml']) {
      const xml = readFileSync(join(preview, xmlPath), 'utf8');
      assert.ok(!xml.includes(`/blog/${slug}`), `${xmlPath} expose le brouillon preview`);
    }
    for (const imagePath of [`images/${heroId}-768.avif`, `images/${heroId}-768.webp`, `images/${heroId}-og.webp`]) {
      const metadata = await sharp(join(preview, imagePath)).metadata();
      assert.ok(metadata.width && metadata.height, `${imagePath} illisible`);
    }

    const served = await servePreview(preview);
    server = served.server;
    for (const route of ['/', '/blog', `/blog/${slug}`, '/sitemap-0.xml', '/blog/rss.xml', `/images/${heroId}-og.webp`]) {
      const response = await fetch(`${served.origin}${route}`);
      assert.equal(response.status, 200, `${route} ne répond pas 200`);
      assert.equal(response.headers.get('x-robots-tag'), 'noindex, nofollow', `${route} sans X-Robots-Tag`);
    }
    const remoteHtml = await (await fetch(`${served.origin}/blog/${slug}`)).text();
    assert.equal(remoteHtml, html, 'le serveur HTTP ne sert pas le HTML preview exact');
    browser = await chromium.launch({ headless: true });
    for (const width of [375, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: width === 375 ? 812 : 1000 }, deviceScaleFactor: 1 });
      await page.goto(`${served.origin}/blog/${slug}`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('h1').count(), 1, `${width}px doit rendre exactement un H1`);
      const geometry = await page.evaluate(() => {
        const hero = document.querySelector('.article-couverture img');
        const rect = hero?.getBoundingClientRect();
        return {
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          heroWidth: rect?.width ?? 0,
          heroHeight: rect?.height ?? 0,
          naturalWidth: hero instanceof HTMLImageElement ? hero.naturalWidth : 0,
        };
      });
      assert.equal(geometry.overflow, 0, `${width}px contient un débordement horizontal`);
      assert.ok(geometry.heroWidth > 250 && geometry.heroHeight > 120 && geometry.naturalWidth > 0, `${width}px ne rend pas un hero visible et chargé : ${JSON.stringify(geometry)}`);
      mkdirSync(join(REPO, '.qa/blog'), { recursive: true });
      await page.screenshot({ path: join(REPO, `.qa/blog/blog-sys-4r2-article-${width}.png`), fullPage: true });
      await page.close();
    }
  } finally {
    if (browser) await browser.close();
    if (server) await new Promise((resolveClose) => server.close(resolveClose));
    rmSync(workspace, { recursive: true, force: true });
  }
});
