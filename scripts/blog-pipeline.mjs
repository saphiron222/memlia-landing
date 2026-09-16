#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parse as parseHtml } from 'parse5';
import { auditArticleInventory, createCandidate, validateDossier, verifySource } from './lib/blog-pipeline.mjs';
import { preparePreview } from './prepare-preview.mjs';
import { requireBlogPreviewOrigin } from '../src/data/blog-preview-origin.mjs';

const root = process.cwd();
const qaRoot = join(root, '.qa', 'blog');
const astroCli = join(dirname(fileURLToPath(import.meta.resolve('astro/package.json'))), 'bin/astro.mjs');
const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

function writeReport(path, report) {
  mkdirSync(resolve(path, '..'), { recursive: true });
  writeFileSync(path, `${JSON.stringify(report, null, 2)}\n`);
}

function printReport(report) {
  console.log(JSON.stringify(report, null, 2));
  if (!report.pass) process.exitCode = 1;
}

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, { cwd: root, env, encoding: 'utf8', stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} a échoué avec le code ${result.status}.`);
}

function listFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name))
    .sort();
}

function renderedPagePath(outputRoot, pathname) {
  const direct = join(outputRoot, pathname.replace(/^\//, ''));
  if (existsSync(`${direct}.html`)) return `${direct}.html`;
  return join(direct, 'index.html');
}

async function validateWithRenderedBlog(slug, previewSlug = slug, gateMode = 'protected-preview') {
  const expectedLink = `/blog/${slug}`;
  const preflight = await validateDossier({
    root,
    slug,
    renderedBlogHtml: `<li data-article="${slug}"><a href="${expectedLink}"></a></li>`,
    gateMode,
  });
  if (!preflight.pass) return preflight;

  const outputRoot = mkdtempSync(join(tmpdir(), 'memlia-blog-render-'));
  try {
    run(process.execPath, [astroCli, 'build', '--root', root, '--outDir', outputRoot], { ...process.env, BLOG_PREVIEW_SLUG: previewSlug });
    const blogPath = renderedPagePath(outputRoot, '/blog');
    const renderedBlogHtml = existsSync(blogPath) ? readFileSync(blogPath, 'utf8') : undefined;
    return validateDossier({ root, slug, renderedBlogHtml, gateMode });
  } finally {
    rmSync(outputRoot, { recursive: true, force: true });
  }
}

async function audit() {
  const inventory = auditArticleInventory({ root });
  const dossiers = [];
  for (const article of inventory.articles.filter((item) => item.status === 'pipeline')) {
    const manifest = JSON.parse(readFileSync(join(root, 'editorial/articles', article.slug, 'manifest.json')));
    const published = manifest.editorialStatus === 'publie-non-atteste';
    dossiers.push(await validateWithRenderedBlog(article.slug, published ? '' : article.slug, published ? 'published-audit' : 'protected-preview'));
  }
  const errors = [...inventory.errors, ...dossiers.flatMap((dossier) => dossier.errors.map((error) => `${dossier.slug}: ${error}`))];
  const report = {
    generatedAt: new Date().toISOString(),
    pass: errors.length === 0,
    counts: {
      articles: inventory.articles.length,
      legacyPreserved: inventory.articles.filter((item) => item.status === 'legacy-preserved').length,
      pipeline: dossiers.length,
      blocked: errors.length,
    },
    inventory: inventory.articles,
    dossiers,
    errors,
  };
  writeReport(join(qaRoot, 'audit.json'), report);
  printReport(report);
}

async function gate(slug) {
  if (!slug) throw new Error('Slug requis : npm run blog:gate -- <slug>.');
  const report = { generatedAt: new Date().toISOString(), ...await validateWithRenderedBlog(slug) };
  const path = join(qaRoot, slug, 'gate-preview.json');
  writeReport(path, report);
  printReport({ ...report, report: relative(root, path) });
  return { report, path };
}

function reviewPackage(slug, gateReport) {
  const dossier = join(root, 'editorial', 'articles', slug);
  const files = listFiles(dossier).map((path) => ({ path: relative(root, path), bytes: statSync(path).size, sha256: sha256(path) }));
  const reportPath = join(qaRoot, slug, 'review-package.md');
  const lines = [
    `# Dossier de revue — ${slug}`,
    '',
    `Généré : ${new Date().toISOString()}`,
    `Gate preview : ${gateReport.pass ? 'PASS' : 'FAIL'}`,
    `Erreurs : ${gateReport.errors.length}`,
    '',
    '## Inventaire scellé',
    '',
    '| Fichier | Octets | SHA-256 |',
    '|---|---:|---|',
    ...files.map((file) => `| \`${file.path}\` | ${file.bytes} | \`${file.sha256}\` |`),
    '',
    '## Contrats externes à joindre',
    '',
    '- URL exacte de preview et preuve HTML + HTTP `noindex, nofollow` ;',
    '- captures 320, 375, 768, 1024, 1440 et 1920 px ;',
    '- résultat Astro check/build/tests ;',
    '- limites, réserves et décision explicite de Kevin.',
    '',
  ];
  mkdirSync(resolve(reportPath, '..'), { recursive: true });
  writeFileSync(reportPath, lines.join('\n'));
  return reportPath;
}

function verifyCandidatePreview(slug, previewDirectory, previewOrigin) {
  const errors = [];
  const articlePath = join(previewDirectory, 'blog', `${slug}.html`);
  if (!existsSync(articlePath)) errors.push(`Le candidat rendu manque : blog/${slug}.html.`);
  else {
    const html = readFileSync(articlePath, 'utf8');
    if (!/<meta\s+name=["']robots["'][^>]+content=["']noindex, nofollow["']/i.test(html)) errors.push('Le candidat ne porte pas la meta noindex, nofollow.');
    if (!html.includes('Candidat éditorial — preview privée, non publiable')) errors.push('Le témoin visuel de preview manque sur le candidat.');
    const socialUrls = [
      ...html.matchAll(/<meta\s+(?:property=["']og:image["']|name=["']twitter:image["'])\s+content=["']([^"']+)["']/gi),
    ].map((match) => match[1]);
    const jsonLdMatch = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      const graph = JSON.parse(jsonLdMatch[1]);
      const posting = graph['@graph']?.find((node) => node['@type'] === 'BlogPosting');
      socialUrls.push(posting?.image?.url, posting?.thumbnailUrl);
    }
    if (socialUrls.length !== 4 || socialUrls.some((url) => typeof url !== 'string' || !url.startsWith(`${previewOrigin}/images/`))) {
      errors.push(`OG, Twitter et JSON-LD doivent référencer quatre fois un asset servi par ${previewOrigin}.`);
    }
    for (const url of new Set(socialUrls.filter((value) => typeof value === 'string'))) {
      const pathname = new URL(url).pathname.replace(/^\//, '');
      if (!existsSync(join(previewDirectory, pathname))) errors.push(`L’asset social référencé manque du paquet : ${pathname}.`);
    }
  }
  const headers = existsSync(join(previewDirectory, '_headers')) ? readFileSync(join(previewDirectory, '_headers'), 'utf8') : '';
  if (!/X-Robots-Tag:\s*noindex, nofollow/i.test(headers)) errors.push('L’en-tête X-Robots-Tag noindex, nofollow manque.');
  for (const file of ['sitemap-0.xml', 'blog/rss.xml']) {
    const path = join(previewDirectory, file);
    if (existsSync(path) && readFileSync(path, 'utf8').includes(`/blog/${slug}`)) errors.push(`Le candidat ne doit pas apparaître dans ${file}.`);
  }
  return errors;
}

function htmlAttribute(node, name) {
  return node.attrs?.find((attribute) => attribute.name === name)?.value;
}

function findHtmlElements(node, predicate, matches = []) {
  if (node.tagName && predicate(node)) matches.push(node);
  for (const child of node.childNodes ?? []) findHtmlElements(child, predicate, matches);
  return matches;
}

export function verifyCandidateBatchPreview(slugs, previewDirectory, previewOrigin) {
  const errors = slugs.flatMap((slug) =>
    verifyCandidatePreview(slug, previewDirectory, previewOrigin).map((error) => `${slug}: ${error}`)
  );
  for (const slug of slugs) {
    const articlePath = join(previewDirectory, 'blog', `${slug}.html`);
    if (!existsSync(articlePath)) continue;
    const document = parseHtml(readFileSync(articlePath, 'utf8'));
    const articleBodies = findHtmlElements(
      document,
      (node) => node.tagName === 'div' && (htmlAttribute(node, 'class') ?? '').split(/\s+/).includes('article-corps')
    );
    if (articleBodies.length !== 1) {
      errors.push(`${slug}: le paquet doit contenir un descendant .article-corps unique.`);
      continue;
    }
    for (const otherSlug of slugs.filter((candidate) => candidate !== slug)) {
      const href = `/blog/${otherSlug}`;
      const links = findHtmlElements(
        articleBodies[0],
        (node) => node.tagName === 'a' && htmlAttribute(node, 'href') === href
      );
      if (links.length === 0) errors.push(`${slug}: aucun descendant <a href="${href}"> dans .article-corps.`);
      if (!existsSync(join(previewDirectory, 'blog', `${otherSlug}.html`))) {
        errors.push(`${slug}: la destination construite manque : blog/${otherSlug}.html.`);
      }
    }
  }
  return errors;
}

async function preview(slugs) {
  if (slugs.length === 0) throw new Error('Au moins un slug est requis : npm run blog:preview -- <slug> [autre-slug].');
  const uniqueSlugs = [...new Set(slugs)];
  const previewOrigin = requireBlogPreviewOrigin(process.env.BLOG_PREVIEW_ORIGIN);
  const gates = [];
  for (const slug of uniqueSlugs) gates.push({ slug, ...await gate(slug) });
  if (gates.some(({ report }) => !report.pass)) return;
  const previewEnv = { ...process.env, BLOG_PREVIEW_SLUG: '', BLOG_PREVIEW_SLUGS: uniqueSlugs.join(',') };
  run(process.execPath, [astroCli, 'build', '--root', root], previewEnv);
  run(process.execPath, [join(root, 'scripts', 'strip-briefs.mjs')], previewEnv);
  const packageName = uniqueSlugs.length === 1 ? uniqueSlugs[0] : `lot-${uniqueSlugs.join('--')}`;
  const target = join(root, '.qa', 'preview-dist', packageName);
  const gateReports = Object.fromEntries(gates.map(({ slug, path }) => [slug, path]));
  preparePreview({ source: join(root, 'dist'), target, candidateSlugs: uniqueSlugs, gateReports });
  const errors = verifyCandidateBatchPreview(uniqueSlugs, target, previewOrigin);
  const report = {
    generatedAt: new Date().toISOString(), slugs: uniqueSlugs, pass: errors.length === 0,
    previewDirectory: relative(root, target), previewOrigin,
    gateReports: Object.fromEntries(gates.map(({ slug, path }) => [slug, relative(root, path)])), errors,
  };
  writeReport(join(qaRoot, packageName, 'preview-local.json'), report);
  const reviewPackages = gates.map(({ slug, report: gateReport }) => relative(root, reviewPackage(slug, gateReport)));
  printReport({ ...report, reviewPackages });
}

async function productionCheck(slug) {
  const result = await validateWithRenderedBlog(slug, '', 'production');
  const manifestPath = join(root, 'editorial', 'articles', slug, 'manifest.json');
  const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {};
  const errors = [...result.errors];
  if (manifest.editorialStatus !== 'go-production' || manifest.kevin?.productionApproved !== true) {
    errors.push('La production exige editorialStatus=go-production et kevin.productionApproved=true pour ce candidat exact.');
  }
  if (errors.length === 0) {
    run('npm', ['run', 'build:site'], { ...process.env, BLOG_PREVIEW_SLUG: '' });
    const htmlPath = join(root, 'dist', 'blog', `${slug}.html`);
    if (!existsSync(htmlPath)) errors.push('La page production n’est pas construite ; vérifier brouillon:false après go Kevin.');
    else {
      const html = readFileSync(htmlPath, 'utf8');
      if (/noindex/i.test(html)) errors.push('La page production contient encore noindex.');
      if (!html.includes(`<link rel="canonical" href="https://memlia.fr/blog/${slug}"`)) errors.push('Canonical auto-référent absent.');
    }
    for (const file of ['dist/sitemap-0.xml', 'dist/blog/rss.xml']) {
      if (!existsSync(join(root, file)) || !readFileSync(join(root, file), 'utf8').includes(`/blog/${slug}`)) errors.push(`${file} ne référence pas le candidat autorisé.`);
    }
  }
  const report = { generatedAt: new Date().toISOString(), slug, pass: errors.length === 0, errors };
  writeReport(join(qaRoot, slug, 'gate-production.json'), report);
  printReport(report);
}

export async function main(argv = process.argv.slice(2)) {
  const [command, ...args] = argv;
  if (command === 'audit') return audit();
  if (command === 'gate') return gate(args[0]);
  if (command === 'review') {
    const { report } = await gate(args[0]);
    const path = reviewPackage(args[0], report);
    console.log(path);
    return;
  }
  if (command === 'preview') return preview(args);
  if (command === 'production-check') return productionCheck(args[0]);
  if (command === 'verify-source') {
    const [slug, sourceId, excerpt] = args;
    if (!slug || !sourceId || !excerpt) throw new Error('Usage : verify-source <slug> <source-id> <extrait exact>.');
    console.log(JSON.stringify(await verifySource({ root, slug, sourceId, excerpt }), null, 2));
    return;
  }
  if (command === 'create') {
    const [slug, title, date = new Date().toISOString().slice(0, 10)] = args;
    const result = createCandidate({ root, slug, title, date });
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  throw new Error('Commande attendue : audit | create <slug> <titre> [date] | verify-source <slug> <source-id> <extrait exact> | gate <slug> | preview <slug> | review <slug> | production-check <slug>.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`[blog-pipeline] ${error.message}`);
    process.exitCode = 1;
  });
}
