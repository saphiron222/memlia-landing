// @ts-check
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import ancresTitres from './src/lib/ancres-titres.mjs';


import { SITE, PAGES_NOINDEX } from './src/data/site.mjs';
import { BLOG, lireArticlesPublies } from './src/data/blog.mjs';

/** lastmod par article (dateMiseAJour ou datePublication) ; les autres pages datent du site. */
const LASTMOD_BLOG = new Map(lireArticlesPublies().map((a) => [`${SITE.url}${BLOG.chemin}/${a.slug}`, a.lastmod]));

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  // `file` : `mentions-legales.html` servi par Cloudflare Pages à `/mentions-legales`
  // (clean URLs), donc canonical extensionless sans saut de redirection.
  build: { format: 'file', inlineStylesheets: 'always' },
  compressHTML: true,
  // Processeur Markdown d'Astro 7 : les ancres des titres d'articles sont posées en ASCII
  // avant le plugin d'identifiants d'Astro, qui conserve un `id` déjà présent.
  markdown: { processor: satteri({ hastPlugins: [ancresTitres()] }) },
  integrations: [
    sitemap({
      // Astro génère un index et ses sous-sitemaps ; alias historique créé au post-build.
      filenameBase: 'sitemap',
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '') || '/';
        if (PAGES_NOINDEX.includes(path)) return false;

        return true;
      },
      serialize: (item) => ({
        ...item,
        lastmod: LASTMOD_BLOG.get(item.url) ?? SITE.derniereMiseAJour,
        // `SitemapItem.changefreq` attend l'enum du paquet `sitemap`, pas la chaîne littérale.
        changefreq: item.url === `${SITE.url}${BLOG.chemin}` ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY,
        priority: item.url === `${SITE.url}/` ? 1.0 : LASTMOD_BLOG.has(item.url) ? 0.7 : 0.6,
      }),
    }),
  ],
});
