// @ts-check
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';


import { SITE, PAGES_NOINDEX } from './src/data/site.mjs';



export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  // `file` : `mentions-legales.html` servi par Cloudflare Pages à `/mentions-legales`
  // (clean URLs), donc canonical extensionless sans saut de redirection.
  build: { format: 'file', inlineStylesheets: 'always' },
  compressHTML: true,
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
        lastmod: SITE.derniereMiseAJour,
        // `SitemapItem.changefreq` attend l'enum du paquet `sitemap`, pas la chaîne littérale.
        changefreq: ChangeFreqEnum.MONTHLY,
        priority: item.url === `${SITE.url}/` ? 1.0 : 0.6,
      }),
    }),
  ],
});
