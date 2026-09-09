import { chromium } from '@playwright/test';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const base = process.env.QA_URL;
if (!base) throw new Error('QA_URL requis : URL exacte de la preview à vérifier.');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
// Les articles publiés sont lus dans dist : toute route construite est relue, aucune n'est oubliée.
const articles = readdirSync('dist/blog').filter(name => name.endsWith('.html')).map(name => name.replace(/\.html$/, ''));
if (articles.length < 2) throw new Error(`Blog débranché : ${articles.length} article(s) dans dist/blog.`);
const routes = [
  ['/', 'index.html', 200],
  ['/mentions-legales', 'mentions-legales.html', 200],
  ['/politique-de-confidentialite', 'politique-de-confidentialite.html', 200],
  ['/m3-page-inexistante', '404.html', 404],
  ['/blog', 'blog.html', 200],
  ...articles.map(slug => [`/blog/${slug}`, `blog/${slug}.html`, 200]),
  ['/blog/rss.xml', 'blog/rss.xml', 200],
  ['/sitemap.xml', 'sitemap.xml', 200],
  ['/sitemap-0.xml', 'sitemap-0.xml', 200],
  ['/robots.txt', 'robots.txt', 200],
  ['/llms.txt', 'llms.txt', 200],
];
const browser = await chromium.launch({ channel: 'chromium' });
const reports = [];
try {
  const page = await browser.newPage();
  for (const [route, file, status] of routes) {
    const response = await page.goto(base + route);
    if (!response) throw new Error(`Pas de réponse pour ${route}`);
    const remote = await response.text();
    const local = readFileSync(`dist/${file}`, 'utf8');
    // Cloudflare injecte un beacon et son commentaire avant </body> : conserver les hashes
    // bruts et compter ce qu'on exclut, puis comparer exactement le reste.
    const injections = [...remote.matchAll(/<!-- Cloudflare Pages Analytics -->[\s\S]*?<!-- Cloudflare Pages Analytics -->/g)];
    const normalized = remote.replace(/<!-- Cloudflare Pages Analytics -->[\s\S]*?<!-- Cloudflare Pages Analytics -->/g, '');
    const report = { route, status: response.status(), expectedStatus: status, robots: response.headers()['x-robots-tag'] ?? null,
      localHash: hash(local), remoteHash: hash(remote), injectedBlocks: injections.length, equivalent: normalized === local };
    reports.push(report);
  }
} finally { await browser.close(); }
mkdirSync('.qa', { recursive: true });
writeFileSync('.qa/preview-http.json', JSON.stringify({ base, reports }, null, 2));
console.log(JSON.stringify({ base, reports }, null, 2));
if (reports.some(r => r.status !== r.expectedStatus || !r.equivalent || r.injectedBlocks > 1 || (r.expectedStatus === 200 && !r.robots?.includes('noindex')))) process.exitCode = 1;
