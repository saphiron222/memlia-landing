/**
 * Blog — identité de la section et lecture minimale des articles hors Astro.
 *
 * `lireArticlesPublies()` est appelé par astro.config.mjs pour dater chaque URL du
 * sitemap (lastmod = dateMiseAJour ou datePublication) : la configuration Astro ne
 * peut pas importer `astro:content`, on lit donc le frontmatter des fichiers Markdown.
 * Les pages, elles, passent par la collection typée (src/content.config.ts).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const BLOG = {
  chemin: '/blog',
  titre: 'Blog Memlia : vérifier et automatiser le travail du cabinet',
  description:
    'Paie, DSN et suivi des dossiers : des méthodes pour préparer le travail répétitif dans les outils du cabinet, avec vérification et décision humaines.',
  fluxRss: '/blog/rss.xml',
  /** Mots par minute retenus pour le temps de lecture affiché. */
  motsParMinute: 200,
};

const DOSSIER = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'blog');

const champ = (frontmatter, nom) => {
  const ligne = frontmatter.match(new RegExp(`^${nom}:\\s*["']?([^"'\\n]*)["']?\\s*$`, 'm'));
  return ligne ? ligne[1].trim() : undefined;
};

/* Même contrat que `z.coerce.date()` du schéma (src/content.config.ts) : ce que la
   collection accepte, le sitemap le date ; ce qu'elle refuse échoue ici aussi. */
const dateIso = (valeur, nom, champNom) => {
  const d = new Date(valeur);
  if (Number.isNaN(d.getTime())) throw new Error(`[blog] ${champNom} invalide dans ${nom} : « ${valeur} »`);
  return d.toISOString();
};

/** Articles publiés (brouillon: false) : slug et dates ISO, lus depuis le frontmatter. */
export const lireArticlesPublies = () => {
  const articles = [];
  for (const nom of readdirSync(DOSSIER).filter((n) => n.endsWith('.md')).sort()) {
    const source = readFileSync(join(DOSSIER, nom), 'utf8');
    const bloc = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!bloc) throw new Error(`[blog] frontmatter absent : ${nom}`);
    const frontmatter = bloc[1];
    if (champ(frontmatter, 'brouillon') !== 'false') continue;
    const publication = champ(frontmatter, 'datePublication');
    if (!publication) throw new Error(`[blog] datePublication absente : ${nom}`);
    const miseAJour = champ(frontmatter, 'dateMiseAJour');
    const datePublication = dateIso(publication, nom, 'datePublication');
    const dateMiseAJour = miseAJour ? dateIso(miseAJour, nom, 'dateMiseAJour') : undefined;
    articles.push({ slug: nom.replace(/\.md$/, ''), datePublication, dateMiseAJour, lastmod: dateMiseAJour ?? datePublication });
  }
  return articles;
};

/** Nombre de mots d'un corps Markdown : sans balises HTML, sans cibles de liens, sans mise en forme. */
export const compterMots = (markdown) =>
  markdown
    .replace(/<[^>]+>/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[`*_#>|\-]+/g, ' ')
    .split(/\s+/)
    .filter((mot) => /[\p{L}\p{N}]/u.test(mot)).length;
