import { parse } from 'parse5';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Audit text nodes, not raw HTML: split tags and HTML entities must not evade the guard.
// Hidden body text is also checked so CSS cannot be used to conceal process labels.
const LABELS = /\b(?:consult[ée](?:e)?s?\s+le\s+\d|vérifi[ée](?:e)?s?\s+le\s+\d|(?:date|dates)\s+de\s+(?:consultation|vérification|capture)\b|sources?\s+(?:consultées?|vérifiées?)\b|captur(?:e|é|ée)s?\s+(?:du|le)\s+\d)/giu;
const BLOCKS = new Set(['p', 'li', 'div', 'section', 'article', 'h1', 'h2', 'h3', 'h4', 'figure', 'figcaption', 'tr', 'td', 'br']);
const INTERNAL = new Set(['head', 'script', 'style', 'template']);

export function publicText(html) {
  function text(node) {
    if (INTERNAL.has(node.tagName)) return '';
    if (node.nodeName === '#text') return node.value;
    const value = (node.childNodes ?? []).map(text).join('');
    return BLOCKS.has(node.tagName) ? ` ${value} ` : value;
  }
  return text(parse(html)).normalize('NFC').replace(/\s+/gu, ' ').trim();
}

export function auditHtml(html) {
  const text = publicText(html);
  return [...text.matchAll(LABELS)].map((match) => ({
    label: match[0], context: text.slice(Math.max(0, match.index - 65), match.index + match[0].length + 95),
  }));
}

export function renderedPages(dist = 'dist') {
  const pages = [];
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = join(dir, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name.endsWith('.html')) {
        const name = relative(dist, file).replaceAll('\\', '/');
        const route = name === 'index.html' ? '/' : `/${name.replace(/(?:\/index)?\.html$/, '')}`;
        pages.push({ route, file });
      }
    }
  }
  walk(dist);
  if (!pages.length) throw new Error(`Aucune page HTML dans ${dist}`);
  return pages.sort((a, b) => a.route.localeCompare(b.route));
}

async function fetchText(url, expectedStatus = 200) {
  const response = await fetch(url, { headers: { 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(30000) });
  if (![expectedStatus].flat().includes(response.status)) throw new Error(`${url}: HTTP ${response.status}, attendu ${expectedStatus}`);
  return response.text();
}

export async function auditSite({ dist = 'dist', origin } = {}) {
  const pages = renderedPages(dist);
  const routes = new Set(pages.map(({ route }) => route));
  if (origin) {
    // Sitemap + all rendered routes: legal/noindex pages are not lost from the inventory.
    const seen = new Set();
    async function sitemap(url) {
      if (seen.has(url)) return;
      seen.add(url);
      const xml = await fetchText(url);
      const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replaceAll('&amp;', '&'));
      if (!urls.length) throw new Error(`Sitemap vide : ${url}`);
      for (const value of urls) {
        const location = new URL(value);
        if (/<sitemapindex\b/.test(xml)) await sitemap(new URL(location.pathname, origin).href);
        else routes.add(location.pathname.replace(/\/$/, '') || '/');
      }
    }
    await sitemap(new URL('/sitemap-index.xml', origin).href);
  }
  const results = [];
  // Sequential fetches intentionally bound load on the public site.
  for (const route of [...routes].sort()) {
    const html = origin
      ? await fetchText(new URL(route, origin).href, route === '/404' ? [200, 404] : 200)
      : readFileSync(pages.find((page) => page.route === route).file, 'utf8');
    results.push({ route, url: origin ? new URL(route, origin).href : null, matches: auditHtml(html) });
  }
  return { origin: origin ?? 'dist', pages: results.length, failingPages: results.filter((page) => page.matches.length).length, results };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const origin = process.argv.find((arg) => arg.startsWith('--origin='))?.slice('--origin='.length);
  const report = process.argv.find((arg) => arg.startsWith('--report='))?.slice('--report='.length);
  try {
    const result = await auditSite({ origin });
    if (report) writeFileSync(report, `${JSON.stringify(result, null, 2)}\n`);
    for (const page of result.results.filter((page) => page.matches.length)) console.error(`${page.route}: ${page.matches.map((m) => m.context).join('\n')}`);
    console.log(`Sources publiques : ${result.pages} pages, ${result.failingPages} pages avec libellés de processus.`);
    process.exitCode = result.failingPages ? 1 : 0;
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
