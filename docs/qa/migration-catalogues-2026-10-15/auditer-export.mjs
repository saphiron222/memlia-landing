import { parse } from 'parse5';
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, join, relative, extname } from 'node:path';

// Audit sans réseau ni mutation du site : le HTML final reste l'autorité.
const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')));
const dist = resolve(args.dist ?? 'dist');
const destination = args.output ? resolve(args.output) : resolve('docs/qa/migration-catalogues-2026-10-15/export-audit.json');
const origin = 'https://memlia.fr';
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const rawText = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(rawText).join('');
const compact = text => text.replace(/\s+/g, ' ').trim();
function descendants(node, filter, found = []) {
  if (filter(node)) found.push(node);
  for (const child of node.childNodes ?? []) descendants(child, filter, found);
  return found;
}
function files(directory) {
  return readdirSync(directory).flatMap(name => {
    const file = join(directory, name);
    return statSync(file).isDirectory() ? files(file) : [file];
  });
}
const inventory = files(dist);
const findings = [];
const issue = (severity, code, page, detail) => findings.push({ severity, code, page, detail });
const normalize = path => decodeURIComponent(path).replace(/\.html$/, '').replace(/\/index$/, '/').replace(/\/$/, '') || '/';
const all = new Map(inventory.filter(file => file.endsWith('.html')).map(file => {
  const relativeFile = relative(dist, file);
  const route = normalize(`/${relativeFile}`);
  const html = readFileSync(file, 'utf8');
  const document = parse(html, { scriptingEnabled: false });
  const nodes = descendants(document, () => true);
  const heads = nodes.filter(node => node.tagName === 'head');
  const head = heads[0];
  const metadata = name => nodes.filter(node => node.tagName === 'meta' && (attr(node, 'name') === name || attr(node, 'property') === name)).map(node => attr(node, 'content') ?? '');
  const h1 = nodes.filter(node => node.tagName === 'h1').map(node => compact(rawText(node)));
  const title = nodes.filter(node => node.tagName === 'title').map(node => compact(rawText(node)));
  const description = metadata('description');
  const robots = metadata('robots').join(',');
  const canonical = nodes.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical').map(node => attr(node, 'href'));
  const ids = nodes.flatMap(node => attr(node, 'id') ? [attr(node, 'id')] : []);
  const schemas = [];
  for (const node of nodes.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json')) {
    try { schemas.push(JSON.parse(rawText(node))); } catch (error) { issue('error', 'jsonld-invalid', route, error.message); }
  }
  const main = nodes.find(node => node.tagName === 'main');
  return [route, { route, file, html, nodes, head, title, description, robots, canonical, h1, ids: new Set(ids), duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))], schemas, metadata, main, bytes: Buffer.byteLength(html), links: nodes.filter(node => node.tagName === 'a').map(node => attr(node, 'href')).filter(Boolean), images: nodes.filter(node => node.tagName === 'img'), indexable: !/\bnoindex\b/i.test(robots) }];
}));
const redirects = new Map();
if (existsSync(join(dist, '_redirects'))) {
  for (const line of readFileSync(join(dist, '_redirects'), 'utf8').split('\n')) {
    const [from, to, status] = line.trim().split(/\s+/);
    if (from?.startsWith('/') && to && /^30[1278]$/.test(status)) redirects.set(normalize(from), { to, status });
  }
}
function localTarget(href, from) {
  let url;
  try { url = new URL(href, `${origin}${from}`); } catch { return { invalid: true, href }; }
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) return null;
  const route = normalize(url.pathname);
  const original = route;
  const chain = [];
  while (redirects.has(normalize(url.pathname)) && chain.length < 5) {
    const current = redirects.get(normalize(url.pathname));
    chain.push(url.pathname);
    url = new URL(current.to, origin);
    if (url.origin !== origin) return { externalRedirect: url.href, chain };
    if (all.has(normalize(url.pathname))) break;
    if (!redirects.has(normalize(url.pathname))) break;
  }
  const targetRoute = normalize(url.pathname);
  const page = all.get(targetRoute);
  const asset = join(dist, decodeURIComponent(url.pathname).replace(/^\//, ''));
  return { route: targetRoute, original, page, chain, exists: Boolean(page) || existsSync(asset), hash: url.hash ? decodeURIComponent(url.hash.slice(1)) : '', asset };
}
const inbound = new Map([...all.keys()].map(route => [route, new Set()]));
const outgoing = new Map([...all.keys()].map(route => [route, new Set()]));
let localLinks = 0;
const imageFiles = new Map();
for (const page of all.values()) {
  if (page.title.length !== 1 || !page.title[0]) issue('error', 'title-count', page.route, page.title);
  if (page.description.length !== 1 || !page.description[0]) issue('error', 'description-count', page.route, page.description);
  if (page.h1.length !== 1 || !page.h1[0]) issue('error', 'h1-count', page.route, page.h1);
  if (page.canonical.length !== 1 || page.canonical[0] !== `${origin}${page.route === '/' ? '/' : page.route}`) issue('error', 'canonical', page.route, page.canonical);
  if (!page.main) issue('error', 'main-missing', page.route, 'Contenu principal absent');
  if (page.duplicateIds.length) issue('error', 'duplicate-id', page.route, page.duplicateIds);
  if (page.bytes >= 2 * 1024 * 1024) issue('warning', 'html-over-2mb', page.route, page.bytes);
  for (const name of ['og:title', 'og:description', 'og:url', 'og:image', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) if (page.metadata(name).length !== 1 || !page.metadata(name)[0]) issue('error', 'social-meta', page.route, name);
  if (page.metadata('og:url')[0] !== page.canonical[0]) issue('error', 'og-canonical', page.route, page.metadata('og:url'));
  for (const name of ['og:image', 'twitter:image']) {
    const image = localTarget(page.metadata(name)[0], page.route);
    if (image && !image.exists) issue('error', 'social-image-missing', page.route, page.metadata(name)[0]);
  }
  if (page.indexable && !page.schemas.length) issue('error', 'jsonld-missing', page.route, 'Aucun JSON-LD');
  for (const schema of page.schemas) {
    if (!schema['@context']) issue('error', 'jsonld-context-missing', page.route, '@context absent');
    const graph = schema['@graph'] ?? (Array.isArray(schema) ? schema : [schema]);
    for (const entity of graph) if (!entity['@type']) issue('error', 'jsonld-type-missing', page.route, entity['@id'] ?? 'Entité sans type');
    const types = graph.flatMap(entity => entity['@type'] ?? []);
    if (['/agents-ia', '/automatisation-cabinet-comptable', '/integrations'].includes(page.route)) {
      for (const expected of ['CollectionPage', 'ItemList', 'BreadcrumbList']) if (!types.includes(expected)) issue('error', 'catalogue-schema-type', page.route, expected);
    }
    if (page.route.startsWith('/agents-ia/') || (page.route.startsWith('/automatisation/') && !page.route.endsWith('/paie'))) {
      for (const expected of ['WebPage', 'Service', 'BreadcrumbList']) if (!types.includes(expected)) issue('error', 'fiche-schema-type', page.route, expected);
    }
    function auditSchemaValue(value, key = '') {
      if (Array.isArray(value)) { for (const child of value) auditSchemaValue(child, key); return; }
      if (value && typeof value === 'object') { for (const [childKey, child] of Object.entries(value)) auditSchemaValue(child, childKey); return; }
      if (typeof value !== 'string' || !['@id', 'url', 'item', 'image', 'contentUrl', 'embedUrl', 'thumbnailUrl', 'logo', 'sameAs', 'isBasedOn'].includes(key)) return;
      if (!value.startsWith(`${origin}/`)) return;
      const target = localTarget(value, page.route);
      if (target && !target.exists) issue('error', 'schema-url-missing', page.route, { key, url: value });
      if (target?.chain.length) issue('error', 'schema-url-redirect', page.route, { key, url: value, destination: target.route });
      // @id identifie une entité, et ne doit pas être confondu avec une ancre HTML.
      if (key !== '@id' && target?.hash && target.page && !target.page.ids.has(target.hash)) issue('error', 'schema-anchor-missing', page.route, { key, url: value });
    }
    auditSchemaValue(schema);
  }
  for (const href of page.links) {
    const target = localTarget(href, page.route);
    if (!target) continue;
    localLinks++;
    if (target.invalid) { issue('error', 'href-invalid', page.route, href); continue; }
    if (target.externalRedirect) continue;
    if (!target.exists) { issue('error', 'link-missing', page.route, href); continue; }
    if (target.chain.length) issue('warning', 'link-redirect', page.route, { href, destination: target.route, chain: target.chain });
    if (target.chain.length > 1) issue('error', 'redirect-chain', page.route, { href, chain: target.chain });
    if (target.hash && target.page && !target.page.ids.has(target.hash)) issue('error', 'anchor-missing', page.route, href);
    if (target.page && target.route !== page.route) {
      inbound.get(target.route).add(page.route);
      outgoing.get(page.route).add(target.route);
    }
  }
  for (const image of page.images) {
    const src = attr(image, 'src');
    if (attr(image, 'alt') === undefined) issue('error', 'image-alt-missing', page.route, src);
    if (!attr(image, 'width') || !attr(image, 'height')) issue('warning', 'image-dimensions', page.route, src);
    const variants = [src, ...String(attr(image, 'srcset') ?? '').split(',').map(item => item.trim().split(/\s+/)[0])].filter(Boolean);
    const picture = image.parentNode?.tagName === 'picture' ? image.parentNode : null;
    if (picture) for (const source of picture.childNodes.filter(node => node.tagName === 'source')) variants.push(...String(attr(source, 'srcset') ?? '').split(',').map(item => item.trim().split(/\s+/)[0]).filter(Boolean));
    for (const variant of variants) {
      const target = localTarget(variant, page.route);
      if (target && !target.exists) issue('error', 'image-missing', page.route, variant);
      if (target?.exists && !target.page && !imageFiles.has(target.asset)) imageFiles.set(target.asset, { src: variant, bytes: statSync(target.asset).size, format: extname(target.asset) });
    }
  }
}
const indexable = [...all.values()].filter(page => page.indexable);
for (const key of ['title', 'description', 'h1']) {
  const groups = new Map();
  for (const page of indexable) {
    const text = page[key][0];
    if (text) groups.set(text, [...(groups.get(text) ?? []), page.route]);
  }
  for (const [value, routes] of groups) if (routes.length > 1) issue('error', `duplicate-${key}`, '*', { value, routes });
}
const sitemapUrls = new Set();
for (const file of inventory.filter(file => /sitemap(?:-[^/]+)?\.xml$/.test(file))) {
  const xml = readFileSync(file, 'utf8');
  for (const [, href] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const target = localTarget(href, '/');
    if (!target?.exists) issue('error', 'sitemap-target', relative(dist, file), href);
    if (/<urlset(?:\s|>)/.test(xml)) {
      if (new URL(href).origin !== origin) issue('error', 'sitemap-origin', relative(dist, file), href);
      if (sitemapUrls.has(href)) issue('error', 'sitemap-duplicate', relative(dist, file), href);
      sitemapUrls.add(href);
      if (target?.page && !target.page.indexable) issue('error', 'sitemap-noindex', relative(dist, file), href);
      if (target?.chain.length) issue('error', 'sitemap-redirect', relative(dist, file), href);
    }
  }
}
for (const page of indexable) if (!sitemapUrls.has(`${origin}${page.route === '/' ? '/' : page.route}`)) issue('error', 'sitemap-unlisted', page.route, 'Page indexable absente du sitemap');
const queue = ['/'];
const depths = new Map([['/', 0]]);
while (queue.length) {
  const route = queue.shift();
  for (const target of outgoing.get(route) ?? []) if (!depths.has(target)) { depths.set(target, depths.get(route) + 1); queue.push(target); }
}
for (const page of indexable) {
  if (!inbound.get(page.route).size && page.route !== '/') issue('error', 'orphan', page.route, 'Aucun lien HTML entrant');
  if (!depths.has(page.route)) issue('error', 'unreachable-from-home', page.route, 'Aucun parcours HTML depuis accueil');
  else if (depths.get(page.route) > 3) issue('warning', 'deep-page', page.route, depths.get(page.route));
}
const discovery = {};
for (const name of ['robots.txt', 'llms.txt', 'llms-full.txt', 'blog/rss.xml']) {
  const file = join(dist, name);
  if (!existsSync(file)) { issue('error', 'discovery-file-missing', '/', name); continue; }
  const content = readFileSync(file, 'utf8');
  discovery[name] = { bytes: Buffer.byteLength(content) };
  const hrefs = name === 'robots.txt' ? [...content.matchAll(/^Sitemap:\s*(\S+)/gm)].map(match => match[1]) : name === 'blog/rss.xml' ? [...content.matchAll(/<link>([^<]+)<\/link>/g)].map(match => match[1]) : [...content.matchAll(/\]\((https:\/\/memlia\.fr[^)]+)\)/g)].map(match => match[1]);
  for (const href of hrefs) {
    const target = localTarget(href, '/');
    if (target && !target.exists) issue('error', 'discovery-link-missing', name, href);
    if (target?.hash && target.page && !target.page.ids.has(target.hash)) issue('error', 'discovery-anchor-missing', name, href);
    if (target?.chain.length) issue('error', 'discovery-link-redirect', name, href);
  }
}
for (const page of indexable) {
  const markdownPath = `/markdown/${page.route === '/' ? 'index' : page.route.slice(1)}.md`;
  if (!existsSync(join(dist, markdownPath))) issue('error', 'markdown-missing', page.route, markdownPath);
  if (!page.nodes.some(node => node.tagName === 'link' && attr(node, 'rel') === 'alternate' && attr(node, 'type') === 'text/markdown' && attr(node, 'href') === `${origin}${markdownPath}`)) issue('error', 'markdown-alternate', page.route, markdownPath);
}
const result = {
  date: new Date().toISOString(), dist,
  method: 'Analyse statique de tous les HTML finaux avec parse5 ; aucun réseau, aucun classement ni mesure terrain déduit.',
  summary: { htmlPages: all.size, indexablePages: indexable.length, sitemapUrls: sitemapUrls.size, internalLinks: localLinks, imageElements: [...all.values()].reduce((total, page) => total + page.images.length, 0), imageFiles: imageFiles.size, largestHtml: [...all.values()].sort((a,b) => b.bytes-a.bytes).slice(0,5).map(page => ({ route: page.route, bytes: page.bytes })), errors: findings.filter(item => item.severity === 'error').length, warnings: findings.filter(item => item.severity === 'warning').length },
  pages: [...all.values()].map(page => ({ route: page.route, indexable: page.indexable, title: page.title[0], description: page.description[0], h1: page.h1[0], canonical: page.canonical[0], bytes: page.bytes, depth: depths.get(page.route) ?? null, inbound: inbound.get(page.route).size, schemas: page.schemas.flatMap(schema => schema['@graph'] ?? [schema]).map(schema => schema['@type']).flat().filter(Boolean) })),
  discovery, largestImages: [...imageFiles.values()].sort((a,b) => b.bytes-a.bytes).slice(0,20), findings,
};
writeFileSync(destination, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result.summary, null, 2));
console.log(`Rapport : ${destination}`);
if (args.strict === 'true' && result.summary.errors) process.exitCode = 1;
