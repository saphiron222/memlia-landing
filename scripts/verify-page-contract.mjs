import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseHtml } from 'parse5';
import { auditerServiceDesign } from './verify-service-design.mjs';
import { BLOG_RUBRIQUES } from '../src/data/blog-rubriques.mjs';

const CLAUSES = Object.freeze({ 1: 'DA', 2: 'IMAGES', 3: 'SEO', 4: 'COPIE', 5: 'LIENS' });
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
const IMPORTS = /import\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g;
const SECTION_PATH = /(?:^|\/)components\/sections\/([^/]+)\.astro$/;
const LAYOUT_PATH = /(?:^|\/)layouts\/([^/]+)\.astro$/;

function walk(directory, predicate = () => true) {
  if (!existsSync(directory)) return [];
  const results = [];
  for (const name of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, name.name);
    if (name.isDirectory()) results.push(...walk(path, predicate));
    else if (predicate(path)) results.push(path);
  }
  return results;
}

function routeFromHtml(dist, path) {
  let name = relative(dist, path).split(sep).join('/');
  if (name === 'index.html') return '/';
  name = name.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  return `/${name}`;
}

function sourceForRoute(root, route) {
  if (route === '/') return join(root, 'src/pages/index.astro');
  if (route.startsWith('/automatisation/')) return join(root, 'src/pages/automatisation/[slug].astro');
  if (route.startsWith('/blog/rubrique/')) return join(root, 'src/pages/blog/rubrique/[slug].astro');
  if (route.startsWith('/blog/')) return join(root, 'src/pages/blog/[slug].astro');
  return join(root, 'src/pages', `${route.slice(1)}.astro`);
}

function isBlogArticle(route) {
  return /^\/blog\/[^/]+$/.test(route);
}

function resolveLocalImport(root, owner, specifier) {
  if (specifier.startsWith('@/')) return join(root, 'src', specifier.slice(2));
  if (specifier.startsWith('./') || specifier.startsWith('../')) return resolve(join(owner, '..'), specifier);
  return null;
}

export function auditerComposition({ root = process.cwd(), sourcePath }) {
  const visited = new Set();
  const sections = new Set();
  const layouts = new Set();
  let cssLocalLines = 0;

  function follow(path) {
    if (!path || visited.has(path) || !existsSync(path)) return;
    visited.add(path);
    const source = readFileSync(path, 'utf8');
    for (const block of source.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g)) {
      cssLocalLines += block[1].split('\n').filter((line) => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('/*') && !trimmed.startsWith('*') && !trimmed.endsWith('*/');
      }).length;
    }
    for (const match of source.matchAll(IMPORTS)) {
      const imported = resolveLocalImport(root, path, match[1]);
      if (!imported) continue;
      const section = imported.match(SECTION_PATH)?.[1];
      if (section) sections.add(section);
      const layout = imported.match(LAYOUT_PATH)?.[1];
      if (layout) {
        layouts.add(layout);
        follow(imported);
      }
    }
  }

  follow(sourcePath);
  const errors = [];
  if (sections.size === 0 && layouts.size === 0) errors.push('aucune section ou aucun layout de composition approuvé n’est importé');
  if (layouts.has('Outil') && sections.size < 3) {
    errors.push(`le gabarit Outil ne compose que ${sections.size} section(s) du système, 3 requises au minimum`);
  }
  if (layouts.has('Outil') && cssLocalLines > 10) {
    errors.push(`le gabarit Outil porte ${cssLocalLines} ligne(s) CSS locale(s), 10 tolérées au maximum pour les ajustements propres au layout`);
  }
  return { pass: errors.length === 0, errors, sections: [...sections].sort(), layouts: [...layouts].sort(), cssLocalLines };
}

function traverse(node, visit) {
  visit(node);
  for (const child of node.childNodes ?? []) traverse(child, visit);
  if (node.content) traverse(node.content, visit);
}

function attr(node, name) {
  return node.attrs?.find((item) => item.name === name)?.value ?? null;
}

function text(node) {
  if (node.nodeName === '#text') return node.value;
  return (node.childNodes ?? []).map(text).join('');
}

function normalizedText(value) {
  return String(value ?? '').replace(/\s+/g, ' ').trim();
}

function normalizeRoute(href) {
  if (!href || !href.startsWith('/') || href.startsWith('//')) return null;
  const route = href.split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  return route.endsWith('.html') ? route.slice(0, -5) : route;
}

function collectJsonLd(document) {
  const values = [];
  traverse(document, (node) => {
    if (node.nodeName !== 'script' || attr(node, 'type') !== 'application/ld+json') return;
    try {
      values.push(JSON.parse(text(node)));
    } catch {
      values.push({ __invalid: true });
    }
  });
  return values;
}

function collectSchema(value, state = { types: new Set(), headlines: [], authors: 0, datesPublished: [], datesModified: [] }) {
  if (Array.isArray(value)) {
    for (const item of value) collectSchema(item, state);
    return state;
  }
  if (!value || typeof value !== 'object') return state;
  const type = value['@type'];
  for (const item of Array.isArray(type) ? type : type ? [type] : []) state.types.add(item);
  if (typeof value.headline === 'string') state.headlines.push(normalizedText(value.headline));
  if (value.author) state.authors += 1;
  if (typeof value.datePublished === 'string') state.datesPublished.push(value.datePublished);
  if (typeof value.dateModified === 'string') state.datesModified.push(value.dateModified);
  for (const child of Object.values(value)) collectSchema(child, state);
  return state;
}

function pageSnapshot(route, path) {
  const document = parseHtml(readFileSync(path, 'utf8'));
  const headings = [];
  const descriptions = [];
  const ogTitles = [];
  const hrefs = [];
  const footerHrefs = [];
  const media = [];
  let title = '';
  let main = null;
  let robots = '';
  traverse(document, (node) => {
    if (node.nodeName === 'main' && attr(node, 'id') === 'main') main = node;
    if (node.nodeName === 'title') title = normalizedText(text(node));
    if (node.nodeName === 'meta' && attr(node, 'name') === 'description') descriptions.push(normalizedText(attr(node, 'content')));
    if (node.nodeName === 'meta' && attr(node, 'name') === 'robots') robots = normalizedText(attr(node, 'content'));
    if (node.nodeName === 'meta' && attr(node, 'property') === 'og:title') ogTitles.push(normalizedText(attr(node, 'content')));
    if (node.nodeName === 'a') {
      const href = normalizeRoute(attr(node, 'href'));
      if (href) hrefs.push(href);
    }
    if (node.nodeName === 'footer') {
      traverse(node, (child) => {
        if (child.nodeName !== 'a') return;
        const href = normalizeRoute(attr(child, 'href'));
        if (href) footerHrefs.push(href);
      });
    }
  });
  if (main) {
    traverse(main, (node) => {
      if (node.nodeName === 'h1') headings.push(normalizedText(text(node)));
      if (node.nodeName === 'img' && attr(node, 'src')) media.push(attr(node, 'src'));
      if (node.nodeName === 'video') {
        if (attr(node, 'poster')) media.push(attr(node, 'poster'));
        if (attr(node, 'src')) media.push(attr(node, 'src'));
      }
    });
  }
  const jsonLd = collectJsonLd(document);
  const schema = collectSchema(jsonLd);
  return {
    route, path, document, main, h1s: headings, title, descriptions, ogTitles, hrefs, footerHrefs,
    media: [...new Set(media.filter((item) => item.startsWith('/')))], robots, jsonLd, schema,
  };
}

function manifestedMedia(root) {
  const exact = new Set();
  for (const path of walk(join(root, 'docs/qa'), (item) => extname(item) === '.json')) {
    try {
      const value = JSON.parse(readFileSync(path, 'utf8'));
      traverseJson(value, (item) => {
        if (typeof item?.target === 'string' && item.target.startsWith('public/')) exact.add(`/${item.target.slice(7)}`);
      });
    } catch {
      // Un autre garde valide les JSON métier ; le contrat ignore seulement les JSON sans manifeste média.
    }
  }
  const articleOwners = new Map();
  for (const manifest of walk(join(root, 'editorial/articles'), (item) => item.endsWith('/manifest.json'))) {
    try {
      const value = JSON.parse(readFileSync(manifest, 'utf8'));
      const heroId = value?.image?.heroId;
      const prompt = join(manifest.slice(0, -'manifest.json'.length), 'preuves/image/prompt.json');
      const slug = relative(join(root, 'editorial/articles'), manifest).split(sep)[0];
      if (heroId && existsSync(prompt)) articleOwners.set(`/images/${heroId}-`, `/blog/${slug}`);
    } catch {
      // Même règle : seuls les manifestes lisibles prouvent la provenance.
    }
  }
  return { exact, articleOwners };
}

function traverseJson(value, visit) {
  if (Array.isArray(value)) {
    for (const item of value) traverseJson(item, visit);
    return;
  }
  if (!value || typeof value !== 'object') return;
  visit(value);
  for (const child of Object.values(value)) traverseJson(child, visit);
}

function mediaOwner(provenance, asset) {
  for (const [prefix, route] of provenance.articleOwners) if (asset.startsWith(prefix)) return route;
  return null;
}

function mediaIsOwned(root, provenance, asset, route, references) {
  if (!existsSync(join(root, 'public', asset.slice(1)))) return false;
  const explicitOwner = mediaOwner(provenance, asset);
  if (explicitOwner) return explicitOwner === route;
  return provenance.exact.has(asset) && references.get(asset)?.length === 1;
}

function expectedSchema(route) {
  if (/^\/automatisation\/[^/]+$/.test(route)) return ['WebPage', 'Service', 'Audience', 'BreadcrumbList'];
  if (/^\/outils-comptables-gratuits\/[^/]+$/.test(route)) return ['WebPage', 'WebApplication', 'BreadcrumbList'];
  if (route === '/outils-comptables-gratuits') return ['CollectionPage', 'ItemList', 'BreadcrumbList'];
  if (/^\/blog\/rubrique\/[^/]+$/.test(route)) return ['WebPage', 'CollectionPage', 'BreadcrumbList'];
  if (isBlogArticle(route)) return ['BlogPosting', 'BreadcrumbList'];
  if (route === '/blog' || route === '/glossaire') return ['CollectionPage', 'BreadcrumbList'];
  if (route === '/a-propos') return ['AboutPage', 'BreadcrumbList'];
  if (route === '/contact') return ['ContactPage', 'BreadcrumbList'];
  return ['WebPage'];
}

export function routesAvecIntentionMesuree(root) {
  const routes = new Set();
  for (const rubrique of BLOG_RUBRIQUES) routes.add(rubrique.chemin);
  const contract = join(root, 'config/page-intent-contract.json');
  if (existsSync(contract)) {
    const value = JSON.parse(readFileSync(contract, 'utf8'));
    for (const route of Object.keys(value.pages ?? {})) routes.add(route);
  }
  const registre = join(root, 'docs/strategy/site-v3/mesures/registre-requetes.json');
  if (existsSync(registre)) {
    const value = JSON.parse(readFileSync(registre, 'utf8'));
    for (const entree of value.articles ?? []) {
      try { routes.add(new URL(entree.url).pathname.replace(/\/$/, '') || '/'); } catch { /* URL invalide : la forge la refusera. */ }
    }
  }
  const audit = join(root, 'docs/strategy/site-v3/AUDIT-AUDIENCE-REQUETES-2026-09-20.md');
  if (existsSync(audit)) {
    for (const match of readFileSync(audit, 'utf8').matchAll(/^\|\s*`(\/[^`]*)`\s*\|/gm)) routes.add(match[1].replace(/\/$/, '') || '/');
  }
  return routes;
}

export function contratsIntention(root) {
  const path = join(root, 'config/page-intent-contract.json');
  const pages = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')).pages ?? {} : {};
  const contrats = new Map(Object.entries(pages));
  for (const rubrique of BLOG_RUBRIQUES) {
    contrats.set(rubrique.chemin, {
      query: rubrique.primaryQuery,
      descriptionLead: rubrique.descriptionLead,
    });
  }
  return contrats;
}

function literalTokenErrors(root) {
  const tokensPath = join(root, 'src/styles/tokens.css');
  if (!existsSync(tokensPath)) return [];
  const tokens = readFileSync(tokensPath, 'utf8');
  const literals = [...new Set([...tokens.matchAll(/--[\w-]+:\s*(#[0-9a-fA-F]{6})\b/g)].map((match) => match[1].toLowerCase()))];
  const errors = [];
  for (const path of walk(join(root, 'src'), (item) => ['.astro', '.css'].includes(extname(item)) && item !== tokensPath)) {
    const source = readFileSync(path, 'utf8').toLowerCase();
    for (const literal of literals) {
      if (source.includes(literal)) errors.push(`${relative(root, path)} redéfinit ${literal} au lieu d’un jeton de tokens.css`);
    }
  }
  return errors;
}

function selectorMinHeight(source, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const block = source.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`, 's'))?.[1] ?? '';
  const value = Number(block.match(/min-height:\s*([\d.]+)px/)?.[1]);
  return Number.isFinite(value) ? value : 0;
}

export function auditerNavigationMobile({ root = process.cwd() } = {}) {
  const path = join(root, 'src/components/Nav.astro');
  if (!existsSync(path)) return { pass: false, errors: ['src/components/Nav.astro absent'] };
  const source = readFileSync(path, 'utf8');
  const errors = [];
  if (!source.includes('data-mobile-visible')) errors.push('navigation mobile immédiatement visible absente');
  const ctaHeight = selectorMinHeight(source, '.nav-principal');
  if (ctaHeight < 44) errors.push(`cible principale mobile haute de ${ctaHeight}px dans le contrat CSS, 44px requis`);
  const linkHeight = selectorMinHeight(source, '.nav-mobile-visible a');
  if (linkHeight < 44) errors.push(`liens structurants mobiles hauts de ${linkHeight}px dans le contrat CSS, 44px requis`);
  return { pass: errors.length === 0, errors };
}

function validateExemptions(exemptions, routes) {
  const invalid = [];
  for (const exemption of exemptions) {
    const clauses = exemption?.clauses;
    if (!routes.has(exemption?.route) || !Array.isArray(clauses) || clauses.length === 0 ||
        clauses.some((clause) => !CLAUSES[clause]) || !DATE_ISO.test(exemption?.date ?? '') ||
        typeof exemption?.reason !== 'string' || exemption.reason.trim().length < 60) {
      invalid.push(exemption);
    }
  }
  return invalid;
}

function error(route, clause, detail) {
  return { route, clause, message: `${route} : clause ${clause} (${CLAUSES[clause]}) — ${detail}` };
}

function isExempt(exemptions, route, clause) {
  return exemptions.some((item) => item.route === route && item.clauses.includes(clause));
}

export function auditerContratPages({
  root = process.cwd(), dist = join(root, 'dist'), exemptions = [], copyVerifier = () => ({ pass: true, errors: [] }),
  intentRoutes = routesAvecIntentionMesuree(root),
  intentContracts = contratsIntention(root),
} = {}) {
  const paths = walk(dist, (path) => path.endsWith('.html'));
  const pages = paths.map((path) => pageSnapshot(routeFromHtml(dist, path), path)).sort((a, b) => a.route.localeCompare(b.route, 'fr'));
  const routes = new Set(pages.map((page) => page.route));
  const erreurs = [];
  const invalidExemptions = validateExemptions(exemptions, routes);
  for (const item of invalidExemptions) erreurs.push({ route: item?.route ?? '/*', clause: 0, message: `${item?.route ?? '/*'} : exemption invalide — route exacte, clauses, date ISO et raison d’au moins 60 caractères requises` });

  for (const detail of literalTokenErrors(root)) erreurs.push(error('/*', 1, detail));
  for (const detail of auditerNavigationMobile({ root }).errors) erreurs.push(error('/*', 1, detail));

  const mediaOwners = new Map();
  for (const page of pages) {
    for (const asset of page.media) mediaOwners.set(asset, [...(mediaOwners.get(asset) ?? []), page.route]);
  }
  const provenance = manifestedMedia(root);
  const descriptionOwners = new Map();
  for (const page of pages) {
    for (const description of page.descriptions) descriptionOwners.set(description, [...(descriptionOwners.get(description) ?? []), page.route]);
  }

  for (const page of pages) {
    const sourcePath = sourceForRoute(root, page.route);
    if (!existsSync(sourcePath)) erreurs.push(error(page.route, 1, `source Astro introuvable : ${relative(root, sourcePath)}`));
    else {
      const composition = auditerComposition({ root, sourcePath });
      for (const detail of composition.errors) erreurs.push(error(page.route, 1, detail));
    }
    if (!page.main || page.main.childNodes?.length === 0) erreurs.push(error(page.route, 1, 'contenu principal absent ou vide'));

    const ownedManifested = page.media.filter((asset) => mediaIsOwned(root, provenance, asset, page.route, mediaOwners));
    if (ownedManifested.length === 0) {
      const shared = page.media.filter((asset) => (mediaOwners.get(asset)?.length ?? 0) > 1);
      const detail = page.media.length === 0
        ? 'aucun média dans le contenu principal'
        : shared.length === page.media.length
          ? `aucun média propre à la page ; partagés : ${shared.join(', ')}`
          : `aucun média propre issu d’une série rendue et scellée ; vus : ${page.media.join(', ')}`;
      erreurs.push(error(page.route, 2, detail));
    }
    const minimumMedia = intentContracts.get(page.route)?.minMedia ?? 1;
    if (ownedManifested.length > 0 && ownedManifested.length < minimumMedia) {
      erreurs.push(error(page.route, 2, `${ownedManifested.length} média(s) propre(s) manifesté(s), ${minimumMedia} requis par le contrat de cette page`));
    }

    const h1 = page.h1s[0];
    const indexable = !page.robots.toLowerCase().includes('noindex');
    if (!intentRoutes.has(page.route)) erreurs.push(error(page.route, 3, 'aucune requête mesurée ni décision d’intention écrite pour cette route'));
    if (!page.title) erreurs.push(error(page.route, 3, 'title d’onglet absent'));
    if (page.descriptions.length !== 1 || !page.descriptions[0]) erreurs.push(error(page.route, 3, `${page.descriptions.length} description(s), une description non vide requise`));
    if (page.descriptions.length === 1 && (descriptionOwners.get(page.descriptions[0])?.length ?? 0) > 1) {
      erreurs.push(error(page.route, 3, `description dupliquée avec ${descriptionOwners.get(page.descriptions[0]).filter((route) => route !== page.route).join(', ')}`));
    }
    const intentContract = intentContracts.get(page.route);
    if (indexable && !isBlogArticle(page.route) && !intentContract) erreurs.push(error(page.route, 3, 'contrat de requête et d’ouverture de description absent'));
    if (indexable && !isBlogArticle(page.route) && intentContract && page.descriptions.length === 1 &&
        !page.descriptions[0].toLocaleLowerCase('fr').startsWith(String(intentContract.descriptionLead).toLocaleLowerCase('fr'))) {
      erreurs.push(error(page.route, 3, `la description doit ouvrir sur ${JSON.stringify(intentContract.descriptionLead)} pour la requête ${JSON.stringify(intentContract.query)}`));
    }
    if (page.h1s.length !== 1) erreurs.push(error(page.route, 3, `${page.h1s.length} H1, un seul requis`));
    if (page.ogTitles.length !== 1 || !h1 || page.ogTitles[0] !== h1) erreurs.push(error(page.route, 3, `og:title doit être identique au H1 ; H1=${JSON.stringify(h1 ?? null)}, og:title=${JSON.stringify(page.ogTitles[0] ?? null)}`));
    if (page.jsonLd.some((value) => value?.__invalid)) erreurs.push(error(page.route, 3, 'JSON-LD invalide'));
    if (!h1 || !page.schema.headlines.includes(h1)) erreurs.push(error(page.route, 3, 'headline JSON-LD doit être identique au H1'));
    if (page.schema.authors === 0) erreurs.push(error(page.route, 3, 'author absent du JSON-LD'));
    if (page.schema.datesPublished.length === 0) erreurs.push(error(page.route, 3, 'datePublished absente du JSON-LD'));
    if (page.schema.datesModified.length === 0) erreurs.push(error(page.route, 3, 'dateModified absente du JSON-LD'));
    for (const type of expectedSchema(page.route)) {
      if (!page.schema.types.has(type)) erreurs.push(error(page.route, 3, `schéma ${type} absent ou incohérent avec le type de page`));
    }
  }

  const copy = copyVerifier();
  if (!copy?.pass) {
    for (const item of copy?.errors ?? [{ route: '/*', message: 'test_positioning.py a échoué' }]) {
      erreurs.push(error(item.route ?? '/*', 4, item.message ?? 'test_positioning.py a échoué'));
    }
  }

  for (const target of pages) {
    const incoming = pages.filter((source) => source.route !== target.route && source.hrefs.includes(target.route));
    if (incoming.length === 0) erreurs.push(error(target.route, 5, 'aucune page servie ne pointe vers elle'));
  }
  for (const page of pages) {
    if (!page.footerHrefs.includes('/outils-comptables-gratuits')) {
      erreurs.push(error(page.route, 5, 'le footer généré ne porte pas le hub /outils-comptables-gratuits'));
    }
  }

  const validExemptions = exemptions.filter((item) => !invalidExemptions.includes(item));
  const filtered = erreurs.filter((item) => item.clause === 0 || item.route === '/*' || !isExempt(validExemptions, item.route, item.clause));
  const exemptionsAppliquees = validExemptions.filter((item) => erreurs.some((candidate) => candidate.route === item.route && item.clauses.includes(candidate.clause)));
  return { pass: filtered.length === 0, pages: pages.length, erreurs: filtered, exemptionsAppliquees };
}

function run(command, args, root) {
  const result = spawnSync(command, args, { cwd: root, encoding: 'utf8', env: process.env });
  return { pass: result.status === 0, output: `${result.stdout ?? ''}${result.stderr ?? ''}`.trim(), status: result.status ?? 1 };
}

function cli() {
  const root = process.cwd();
  const configPath = join(root, 'config/page-contract-exemptions.json');
  const exemptions = existsSync(configPath) ? JSON.parse(readFileSync(configPath, 'utf8')).exemptions ?? [] : [];
  const copyRun = run('python3', ['-m', 'unittest', 'discover', '-s', 'tests/proof', '-p', 'test_positioning.py', '-v'], root);
  const resultat = auditerContratPages({
    root,
    exemptions,
    copyVerifier: () => copyRun.pass ? { pass: true, errors: [] } : { pass: false, errors: [{ route: '/*', message: `test_positioning.py a échoué (code ${copyRun.status})` }] },
  });
  const delegates = [
    { label: 'service-forge', clause: 3, result: run(process.execPath, ['scripts/service-forge.mjs', 'auditer'], root) },
    { label: 'blog-contract', clause: 3, result: run(process.execPath, ['scripts/verify-blog-contract.mjs'], root) },
    { label: 'blog-title-intent', clause: 3, result: run(process.execPath, ['--test', 'tests/scripts/blog-title-intent.test.mjs'], root) },
  ];
  const serviceDesign = auditerServiceDesign({ root });
  if (!serviceDesign.pass) {
    for (const detail of serviceDesign.erreurs) {
      const route = detail.match(/^(\/[^ ]+)/)?.[1] ?? '/*';
      const clause = /média|image|recette|partagé/.test(detail) ? 2 : 1;
      resultat.erreurs.push(error(route, clause, `verify-service-design.mjs : ${detail}`));
    }
  }
  for (const delegate of delegates) {
    if (!delegate.result.pass) resultat.erreurs.push(error('/*', delegate.clause, `${delegate.label} a échoué (code ${delegate.result.status})`));
  }
  resultat.pass = resultat.erreurs.length === 0;

  console.log(`${resultat.pass ? 'VERT' : 'ROUGE'} — contrat de page : ${resultat.pages} page(s), 5 clauses, ${resultat.exemptionsAppliquees.length} exemption(s) appliquée(s)`);
  console.log(`- clause 4 déléguée : test_positioning.py ${copyRun.pass ? 'PASS' : 'FAIL'}`);
  console.log(`- garde services déléguée : verify-service-design.mjs ${serviceDesign.pass ? 'PASS' : 'FAIL'}`);
  for (const delegate of delegates) console.log(`- ${delegate.label} délégué : ${delegate.result.pass ? 'PASS' : 'FAIL'}`);
  for (const item of resultat.erreurs) console.error(`- ${item.message}`);
  if (!resultat.pass) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) cli();
