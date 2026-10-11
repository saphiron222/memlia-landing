import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { readSitemapPages } from './lib/sitemaps.mjs';
import { pageMarkdown } from './generate-agent-markdown.mjs';
import { auditHtml } from './verify-public-source-labels.mjs';

/** Contrat de l'export final, ou de la même sortie servie par Cloudflare. */
export async function verifyAgentMarkdown({ dist = 'dist', origin } = {}) {
  const urls = [...new Set([...readSitemapPages(dist).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]))].sort();
  assert.ok(urls.length, 'Le sitemap ne doit pas être vide.');
  async function load(path, type) {
    if (!origin) return readFileSync(join(dist, path), 'utf8');
    const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30000) });
    assert.equal(response.status, 200, `${path} : HTTP 200 attendu`);
    assert.ok(response.headers.get('content-type')?.startsWith(type), `${path} : ${type} attendu, reçu ${response.headers.get('content-type')}`);
    return response.text();
  }
  const llms = await load('/llms.txt', 'text/plain');
  const full = await load('/llms-full.txt', 'text/plain');
  assert.ok(llms.includes('https://memlia.fr/llms-full.txt'));
  for (const url of urls) {
    const route = new URL(url).pathname.replace(/^\/|\/$/g, '');
    const path = `/markdown/${route || 'index'}.md`;
    const html = origin ? await load(new URL(url).pathname, 'text/html') : readFileSync(join(dist, route ? `${route}.html` : 'index.html'), 'utf8');
    const markdown = await load(path, 'text/markdown');
    assert.equal(markdown, pageMarkdown(html, url), `${path} : texte divergent du main final`);
    assert.match(markdown, /^# .+/m, `${path} : titre absent`);
    assert.ok(full.includes(`Source : ${url}\nVersion Markdown : https://memlia.fr${path}\n\n${markdown}`), `${path} : absent du texte intégral`);
    assert.ok(llms.includes(`https://memlia.fr${path}`), `${path} : absent de llms.txt`);
    assert.ok(html.includes(`<link rel="alternate" type="text/markdown" href="https://memlia.fr${path}">`), `${url} : alternate absent`);
    const escaped = markdown.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    assert.deepEqual(auditHtml(`<main>${escaped}</main>`), [], `${path} : libellé de source interne`);
  }
  if (!origin) assert.ok(readFileSync(join(dist, '_headers'), 'utf8').includes('/markdown/*\n  Content-Type: text/markdown; charset=utf-8'));
  return urls.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const origin = process.argv.find(arg => arg.startsWith('--origin='))?.slice('--origin='.length);
  console.log(`Contrat Markdown PASS : ${await verifyAgentMarkdown({ origin })} pages (${origin ?? 'dist'}).`);
}
