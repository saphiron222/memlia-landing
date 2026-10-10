import { parse } from 'parse5';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readSitemapPages } from './lib/sitemaps.mjs';
import { renderLlmsInventory } from './lib/llms-inventory.mjs';

const OMIT = new Set(['head', 'script', 'style', 'template', 'nav', 'form', 'button', 'input', 'select', 'textarea', 'svg', 'img']);
const BLOCK = new Set(['p', 'section', 'article', 'div', 'aside', 'header', 'footer', 'figure', 'figcaption', 'details', 'summary', 'dl', 'dt', 'dd']);
const attr = (node, name) => node.attrs?.find(a => a.name === name)?.value;
const children = node => node.childNodes ?? [];
function find(node, tag) {
  if (node.tagName === tag) return node;
  for (const child of children(node)) { const found = find(child, tag); if (found) return found; }
}
const escapeText = text => text.replace(/\\/g, '\\\\').replace(/([*_[\]`])/g, '\\$1');
const rawText = node => node.nodeName === '#text' ? node.value : children(node).map(rawText).join('');

/** Le HTML final est la seule source : pas de lecture du corpus interne scellé. */
export function pageMarkdown(html, url) {
  const main = find(parse(html, { scriptingEnabled: false }), 'main');
  if (!main) throw new Error(`${url} : main absent`);
  function render(node, depth = 0) {
    if (node.nodeName === '#text') return escapeText(node.value.replace(/\s+/g, ' '));
    const tag = node.tagName;
    if (OMIT.has(tag) || attr(node, 'hidden') !== undefined || attr(node, 'aria-hidden') === 'true') return '';
    const body = () => children(node).map(child => render(child, depth)).join('');
    if (/^h[1-6]$/.test(tag ?? '')) return `\n\n${'#'.repeat(Number(tag[1]))} ${body().trim()}\n\n`;
    if (tag === 'br') return '\n';
    if (tag === 'a') {
      const text = body().trim();
      const href = attr(node, 'href');
      if (!href || !text) return text;
      const target = new URL(href, url);
      if (!['https:', 'http:', 'mailto:', 'tel:'].includes(target.protocol)) return text;
      const destination = target.href.replace(/\(/g, '%28').replace(/\)/g, '%29');
      // Une ancre HTML peut englober une carte, mais un lien Markdown est inline.
      // Conserver les titres comme blocs et le libellé complet comme un seul lien.
      if (text.includes('\n\n')) {
        const headings = [];
        function collectHeadings(child) {
          if (/^h[1-6]$/.test(child.tagName ?? '')) headings.push(render(child, depth).trim());
          else for (const descendant of children(child)) collectHeadings(descendant);
        }
        collectHeadings(node);
        return `\n\n${headings.length ? `${headings.join('\n\n')}\n\n` : ''}[${text.replace(/(^|\n)#{1,6} /g, '$1').replace(/\s+/g, ' ').trim()}](${destination})\n\n`;
      }
      return `[${text}](${destination})`;
    }
    if (tag === 'strong' || tag === 'b') return `**${body()}**`;
    if (tag === 'em' || tag === 'i') return `*${body()}*`;
    if (tag === 'pre') {
      const text = rawText(node).trimEnd();
      const fence = '`'.repeat(Math.max(3, ...[...text.matchAll(/`+/g)].map(m => m[0].length + 1)));
      return `\n\n${fence}\n${text}\n${fence}\n\n`;
    }
    if (tag === 'code') {
      const text = rawText(node).replace(/\s+/g, ' ');
      const fence = '`'.repeat(Math.max(1, ...[...text.matchAll(/`+/g)].map(m => m[0].length + 1)));
      return `${fence} ${text} ${fence}`;
    }
    if (tag === 'ul' || tag === 'ol') {
      let index = Number(attr(node, 'start') ?? 1);
      const items = children(node).filter(n => n.tagName === 'li').map(li => {
        const value = children(li).map(child => render(child, depth + 1)).join('').trim();
        const marker = tag === 'ol' ? `${index++}. ` : '- ';
        const lines = value.split('\n');
        return `${marker}${lines[0]}${lines.slice(1).map(line => `\n${line ? ' '.repeat(marker.length) + line : ''}`).join('')}`;
      });
      return `\n\n${items.join('\n\n')}\n\n`;
    }
    if (tag === 'table') {
      const rows = [];
      function collect(node) {
        if (node.tagName === 'tr') rows.push(children(node).filter(n => ['th', 'td'].includes(n.tagName)).map(n => render(n).trim().replace(/\n+/g, '<br>').replace(/\|/g, '\\|')));
        else for (const child of children(node)) collect(child);
      }
      collect(node);
      if (!rows.length) return '';
      const width = Math.max(...rows.map(row => row.length));
      const line = row => `| ${Array.from({ length: width }, (_, i) => row[i] ?? '').join(' | ')} |`;
      const caption = children(node).find(n => n.tagName === 'caption');
      return `\n\n${caption ? `${render(caption).trim()}\n\n` : ''}${line(rows[0])}\n${line(Array(width).fill('---'))}\n${rows.slice(1).map(line).join('\n')}\n\n`;
    }
    if (tag === 'blockquote') return `\n\n${body().trim().split('\n').map(line => `> ${line}`).join('\n')}\n\n`;
    if (tag === 'hr') return '\n\n---\n\n';
    return BLOCK.has(tag) ? `\n\n${body().trim()}\n\n` : body();
  }
  return `${render(main).replace(/\n[ \t]+\n/g, '\n\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

const MARKER = '\n## Versions Markdown statiques\n';
const HEADER_MARKER = '\n# Versions Markdown statiques\n';
export function generateAgentMarkdown(dist = 'dist') {
  const urls = [...new Set([...readSitemapPages(dist).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]))].sort();
  if (!urls.length) throw new Error('Sitemap vide : aucune version Markdown générée.');
  const entries = urls.map(url => {
    const parsed = new URL(url);
    const route = decodeURIComponent(parsed.pathname).replace(/^\/|\/$/g, '');
    if (parsed.origin !== 'https://memlia.fr' || route.split('/').some(part => ['.', '..'].includes(part))) throw new Error(`Route invalide : ${url}`);
    const file = join(dist, route ? `${route}.html` : 'index.html');
    const html = readFileSync(file, 'utf8');
    const markdown = pageMarkdown(html, url);
    const path = `/markdown/${route || 'index'}.md`;
    mkdirSync(dirname(join(dist, path)), { recursive: true });
    writeFileSync(join(dist, path), markdown);
    const alternate = `<link rel="alternate" type="text/markdown" href="https://memlia.fr${path}">`;
    if (!html.includes(alternate)) {
      if (!html.includes('</head>')) throw new Error(`${url} : head absent`);
      writeFileSync(file, html.replace('</head>', `${alternate}</head>`));
    }
    return { url, path, html, markdown, title: markdown.match(/^# (.+)$/m)?.[1] ?? route };
  });
  writeFileSync(join(dist, 'llms-full.txt'), `# Memlia — contenu des pages publiques\n\nVersions textuelles statiques ; les outils interactifs restent disponibles sur leurs pages HTML.\n\n${entries.map(e => `---\n\nSource : ${e.url}\nVersion Markdown : https://memlia.fr${e.path}\n\n${e.markdown}`).join('\n')}`);
  const llms = join(dist, 'llms.txt');
  const template = readFileSync(llms, 'utf8').split(MARKER)[0].trimEnd();
  const inventory = renderLlmsInventory(template, entries);
  writeFileSync(llms, `${inventory.trimEnd()}${MARKER}\n- [Toutes les pages en texte intégral](https://memlia.fr/llms-full.txt)\n${entries.map(e => `- [${e.title.replace(/[\[\]]/g, '')}](https://memlia.fr${e.path})`).join('\n')}\n`);
  const headers = join(dist, '_headers');
  writeFileSync(headers, `${readFileSync(headers, 'utf8').split(HEADER_MARKER)[0].trimEnd()}${HEADER_MARKER}/markdown/*\n  Content-Type: text/markdown; charset=utf-8\n  X-Content-Type-Options: nosniff\n  X-Robots-Tag: noindex\n\n/llms-full.txt\n  Content-Type: text/plain; charset=utf-8\n  X-Robots-Tag: noindex\n`);
  return entries.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  console.log(`Markdown statique : ${generateAgentMarkdown()} pages et llms-full.txt générés.`);
}
