import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { SITE } from '@/data/site.mjs';
import { BLOG } from '@/data/blog.mjs';
import { auteurPar } from '@/data/auteurs';

/** `customData` est inséré brut : tout texte qui y passe est échappé pour rester du XML valide. */
const xml = (texte: string) =>
  texte.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Flux RSS 2.0 du blog : articles publiés, du plus récent au plus ancien. */
export async function GET(context: APIContext) {
  const publies = (await getCollection('blog', ({ data }) => !data.brouillon)).sort(
    (a, b) => Number(b.data.format === 'pillar-page') - Number(a.data.format === 'pillar-page')
      || b.data.datePublication.getTime() - a.data.datePublication.getTime()
  );
  const site = context.site ?? new URL(SITE.url);
  const fluxUrl = new URL(BLOG.fluxRss, site).href;
  return rss({
    title: BLOG.titre,
    description: BLOG.description,
    // Le canal pointe sur la page du blog ; les liens d'articles restent absolus depuis la racine.
    site: new URL(BLOG.chemin, site),
    // Même convention que le site (`trailingSlash: 'never'`) : les liens du flux sont canoniques.
    trailingSlash: false,
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/', atom: 'http://www.w3.org/2005/Atom' },
    customData: `<language>fr-fr</language><managingEditor>${xml(`${SITE.email} (${SITE.nom})`)}</managingEditor><atom:link href="${xml(fluxUrl)}" rel="self" type="application/rss+xml"/>`,
    items: publies.map((entree) => ({
      title: entree.data.titre,
      description: entree.data.resume,
      link: `${BLOG.chemin}/${entree.id}`,
      pubDate: entree.data.datePublication,
      categories: entree.data.sujets,
      customData: `<dc:creator>${xml(auteurPar(entree.data.auteur).nom)}</dc:creator>`,
    })),
  });
}
