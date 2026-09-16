// @ts-check
import { execFileSync } from 'node:child_process';
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import ancresTitres from './src/lib/ancres-titres.mjs';


import { SITE, PAGES_NOINDEX } from './src/data/site.mjs';
import { BLOG, lireArticlesPublies } from './src/data/blog.mjs';
import { parseBlogPreviewSlugs } from './src/data/blog-visibility.mjs';

const BLOG_PREVIEW_SLUGS = new Set(parseBlogPreviewSlugs(process.env.BLOG_PREVIEW_SLUGS ?? process.env.BLOG_PREVIEW_SLUG));

/**
 * `lastmod` des pages non éditoriales : la date du dernier commit qui a touché ce qui les rend.
 *
 * Une date écrite à la main ne bouge que si quelqu'un y pense — et personne n'y a pensé : le
 * 16/09/2026, cinq pages nouvelles étaient en ligne depuis six heures et le sitemap les datait
 * encore du 09/09. Google, qui compare ce `lastmod` à sa dernière lecture, n'avait aucune raison
 * de le relire : Search Console affichait toujours quatre pages découvertes.
 *
 * La date vient donc de git, jamais de l'horloge : deux constructions du même commit produisent
 * le même octet (la chaîne de preuve compare le dist local aux octets servis), et un commit qui
 * ne touche ni les sources ni les actifs ne prétend pas que le site a changé.
 */
const DERNIERE_SOURCE = (() => {
  try {
    const sortie = execFileSync('git', ['log', '-1', '--format=%cI', '--', 'src', 'public', 'astro.config.mjs'], { encoding: 'utf8' }).trim();
    return sortie || SITE.derniereMiseAJour;
  } catch {
    // Sans dépôt (archive, image de construction sans git), la constante déclarée fait office de plancher.
    return SITE.derniereMiseAJour;
  }
})();

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
        if (BLOG_PREVIEW_SLUGS.has(path.slice(`${BLOG.chemin}/`.length))) return false;

        return true;
      },
      serialize: (item) => ({
        ...item,
        lastmod: LASTMOD_BLOG.get(item.url) ?? DERNIERE_SOURCE,
        // `SitemapItem.changefreq` attend l'enum du paquet `sitemap`, pas la chaîne littérale.
        changefreq: item.url === `${SITE.url}${BLOG.chemin}` ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY,
        priority: item.url === `${SITE.url}/` ? 1.0 : LASTMOD_BLOG.has(item.url) ? 0.7 : 0.6,
      }),
    }),
  ],
});
