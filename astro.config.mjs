// @ts-check
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import ancresTitres from './src/lib/ancres-titres.mjs';
import typedSitemaps from './scripts/lib/sitemaps.mjs';
import { fileURLToPath } from 'node:url';
import { renderSocialImages } from './scripts/render-social-images.mjs';
import responsiveProofs from './scripts/lib/responsive-proofs.mjs';


import { SITE, PAGES_NOINDEX } from './src/data/site.mjs';
import { BLOG, lireArticlesPublies } from './src/data/blog.mjs';
import { parseBlogPreviewSlugs } from './src/data/blog-visibility.mjs';

const BLOG_PREVIEW_SLUGS = new Set(parseBlogPreviewSlugs(process.env.BLOG_PREVIEW_SLUGS ?? process.env.BLOG_PREVIEW_SLUG));

/**
 * Une page de service préparée existe dans le rendu pour la preview, mais reste `noindex` et
 * ne doit pas être découverte par le sitemap. La publication forge seule passe son statut à
 * `publie`; le filtre lit donc la même source que le layout au lieu d'inférer depuis la route.
 */
const SERVICES_PUBLIES = new Set((() => {
  const dossier = './src/content/services';
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier)
    .filter((nom) => nom.endsWith('.md'))
    .filter((nom) => /^status:\s*publie\s*$/m.test(readFileSync(`${dossier}/${nom}`, 'utf8')))
    .map((nom) => `/automatisation/${nom.slice(0, -3)}`);
})());

/** lastmod par article (dateMiseAJour ou datePublication) : une seule source, le frontmatter. */
const LASTMOD_BLOG = new Map(lireArticlesPublies().map((a) => [`${SITE.url}${BLOG.chemin}/${a.slug}`, a.lastmod]));

/**
 * `lastmod` des pages non éditoriales : le registre versionné, tenu par leur contenu rendu.
 *
 * Voir scripts/sync-lastmod.mjs pour le pourquoi — une date écrite à la main ne bouge pas, et
 * une date lue dans git ne se lit pas pareil sur l'image de construction de Cloudflare.
 */
const LASTMOD_PAGES = new Map((() => {
  try {
    return Object.entries(JSON.parse(readFileSync('./src/data/pages-lastmod.json', 'utf8')).pages)
      .map(([route, page]) => [`${SITE.url}${route === '/' ? '/' : route}`, page.lastmod]);
  } catch {
    // Registre absent : première construction avant son amorçage par scripts/sync-lastmod.mjs.
    return [];
  }
})());

export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  // `file` : `mentions-legales.html` servi par Cloudflare Pages à `/mentions-legales`
  // (clean URLs), donc canonical extensionless sans saut de redirection.
  build: { format: 'file', inlineStylesheets: 'always' },
  // Les petits scripts traités par Astro sont sinon réinjectés inline (< 4 Ko),
  // incompatibles avec script-src 'self' sur /contact. Conserver les autres actifs.
  vite: { build: { assetsInlineLimit: (filePath) => filePath.endsWith('.js') ? false : undefined } },
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
        if (path.startsWith('/automatisation/') && !SERVICES_PUBLIES.has(path)) return false;

        return true;
      },
      serialize: (item) => ({
        ...item,
        lastmod: LASTMOD_BLOG.get(item.url) ?? LASTMOD_PAGES.get(item.url) ?? SITE.derniereMiseAJour,
        // `SitemapItem.changefreq` attend l'enum du paquet `sitemap`, pas la chaîne littérale.
        changefreq: item.url === `${SITE.url}${BLOG.chemin}` ? ChangeFreqEnum.WEEKLY : ChangeFreqEnum.MONTHLY,
        priority: item.url === `${SITE.url}/` ? 1.0 : LASTMOD_BLOG.has(item.url) ? 0.7 : 0.6,
      }),
    }),
    typedSitemaps(),
    { name: 'memlia-social-images', hooks: {
      'astro:build:done': async ({ dir }) => {
        console.log(`${await renderSocialImages(fileURLToPath(dir))} images sociales JPEG générées.`);
      },
    } },
    responsiveProofs(),
  ],
});
