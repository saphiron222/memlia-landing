import { readFileSync, writeFileSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const SITEMAP_TYPES = ['pages', 'services', 'guides', 'outils', 'blog', 'glossaire', 'cac'];
const namespace = 'http://www.sitemaps.org/schemas/sitemap/0.9';
const declaration = '<?xml version="1.0" encoding="UTF-8"?>';
const prefixes = { services: '/automatisation', guides: '/integrations', outils: '/outils-comptables-gratuits', blog: '/blog', glossaire: '/glossaire', cac: '/commissaires-aux-comptes' };

/** La profession ne déplace pas les services/outils hors de leur type de page. */
export function sitemapType(url) {
  const path = new URL(url).pathname.replace(/\/$/, '') || '/';
  return Object.entries(prefixes).find(([, prefix]) => path === prefix || path.startsWith(`${prefix}/`))?.[0] ?? 'pages';
}

/** Lit les urlsets seulement : ni index ni double lecture de son alias historique. */
export function readSitemapPages(dist) {
  return readdirSync(dist).filter(name => /^sitemap(?:-[^/]+)?\.xml$/.test(name)).sort()
    .map(name => readFileSync(join(dist, name), 'utf8'))
    .filter(xml => /<urlset(?:\s|>)/.test(xml)).join('\n');
}

/** Partitionne la sortie Astro sans réécrire les blocs url ni leurs lastmod. */
export function splitSitemaps(dist, origin) {
  const generated = readdirSync(dist).filter(name => /^sitemap-\d+\.xml$/.test(name)).sort();
  if (!generated.length) throw new Error('Sitemap Astro absent : partition impossible.');
  const groups = Object.fromEntries(SITEMAP_TYPES.map(type => [type, []]));
  const seen = new Set();
  for (const file of generated) {
    const xml = readFileSync(join(dist, file), 'utf8');
    for (const [entry] of xml.matchAll(/<url(?:\s[^>]*)?>[\s\S]*?<\/url>/g)) {
      const url = entry.match(/<loc>([^<]+)<\/loc>/)?.[1];
      if (!url || !url.startsWith(`${origin}/`)) throw new Error(`URL sitemap invalide : ${url}`);
      if (seen.has(url)) throw new Error(`URL sitemap en doublon : ${url}`);
      seen.add(url);
      groups[sitemapType(url)].push(entry);
    }
  }
  const children = [];
  for (const type of SITEMAP_TYPES) {
    const entries = groups[type];
    // Pas de sitemap vide soumis à Google : CAC apparaît avec sa première page publiée.
    if (!entries.length) {
      const obsolete = join(dist, `sitemap-${type}.xml`);
      if (existsSync(obsolete)) unlinkSync(obsolete);
      continue;
    }
    const xml = `${declaration}<urlset xmlns="${namespace}">${entries.join('')}</urlset>`;
    if (entries.length > 50_000 || Buffer.byteLength(xml) > 50 * 1024 * 1024) throw new Error(`Sitemap ${type} au-delà de la limite protocole.`);
    writeFileSync(join(dist, `sitemap-${type}.xml`), xml);
    // Pas de date de build dans l'index : les dates des pages restent la source.
    const dates = entries.flatMap(entry => [...entry.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map(match => match[1]));
    const lastmod = dates.sort().at(-1);
    children.push(`<sitemap><loc>${origin}/sitemap-${type}.xml</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</sitemap>`);
  }
  const index = `${declaration}<sitemapindex xmlns="${namespace}">${children.join('')}</sitemapindex>`;
  writeFileSync(join(dist, 'sitemap-index.xml'), index);
  writeFileSync(join(dist, 'sitemap.xml'), index);
  for (const file of generated) unlinkSync(join(dist, file));
}

export default function typedSitemaps() {
  return { name: 'memlia-sitemaps-types', hooks: {
    'astro:build:done': ({ dir }) => splitSitemaps(fileURLToPath(dir), 'https://memlia.fr'),
  } };
}
