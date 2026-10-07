import { chromium } from '@playwright/test';
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const base = process.env.QA_URL;
if (!base) throw new Error('QA_URL requis : URL exacte de la preview à vérifier.');
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
/**
 * Le dossier comparé est celui qu'on a réellement déployé : `dist` pour une production,
 * `.qa/preview-dist` pour une preview noindex, dont les octets diffèrent par construction.
 * Comparer au mauvais dossier ferait mentir l'équivalence dans les deux sens.
 */
const source = process.env.PREVIEW_SOURCE ?? 'dist';
// Les routes sont énumérées depuis le dossier déployé, jamais écrites à la main : une page
// ajoutée au site entre donc dans le contrôle sans que personne ait à y penser.
const pages = readdirSync(source, { recursive: true, withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.html'))
  .map(entry => join(entry.parentPath, entry.name).replace(`${source}/`, ''))
  .sort();
const articles = pages.filter(f => f.startsWith('blog/')).map(f => f.replace(/^blog\/|\.html$/g, ''));
if (articles.length < 2) throw new Error(`Blog débranché : ${articles.length} article(s) dans ${source}/blog.`);
const routeDepuisFichier = fichier => fichier === 'index.html' ? '/' : `/${fichier.replace(/\.html$/, '')}`;
const routes = [
  ...pages.filter(f => f !== '404.html').map(f => [routeDepuisFichier(f), f, 200]),
  ['/m3-page-inexistante', '404.html', 404],
  ['/blog/rss.xml', 'blog/rss.xml', 200],
  ['/sitemap.xml', 'sitemap.xml', 200],
  ['/sitemap-blog.xml', 'sitemap-blog.xml', 200],
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
    const local = readFileSync(`${source}/${file}`, 'utf8');
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
writeFileSync('.qa/preview-http.json', JSON.stringify({ base, source, reports }, null, 2));
console.log(JSON.stringify({ base, source, routes: reports.length, reports }, null, 2));
if (reports.some(r => r.status !== r.expectedStatus || !r.equivalent || r.injectedBlocks > 1 || (r.expectedStatus === 200 && !r.robots?.includes('noindex')))) process.exitCode = 1;
