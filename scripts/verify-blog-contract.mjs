import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseHtml } from 'parse5';
import { parse as parseYaml } from 'yaml';
import { dateIntentionScellee } from './lib/blog-pipeline.mjs';
import {
  chargerAutocompletionMesuree,
  titrePorteUneRequeteMesuree,
} from './lib/blog-title-intent.mjs';
import {
  ARTICLES_HORS_RUBRIQUE,
  rubriquePourArticle,
} from '../src/data/blog-rubriques.mjs';

const LEGENDE_TECHNIQUE_INTERDITE = /Ouvrir la preuve en grand|Preuve visuelle défilante|reconstitution fidèle[^.]{0,240}recette scellée|recette scellée/i;

function legendePreuveValide(figure, historique) {
  const captions = elements(figure, (node) => node.tagName === 'figcaption');
  // L'exception sans légende ne vaut que pour les anciens dossiers épinglés.
  if (captions.length === 0) return historique;
  if (captions.length !== 1) return false;
  const contenu = texte(captions[0]).replace(/\s+/g, ' ').trim();
  const match = /^Source\s*:\s*(.+?)\s*·\s*capture du (\d{4}-\d{2}-\d{2})$/i.exec(contenu);
  if (!match || !match[1].trim() || LEGENDE_TECHNIQUE_INTERDITE.test(contenu)) return false;
  const date = new Date(`${match[2]}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === match[2]
    && date.getTime() <= Date.now();
}

function preuveDirecteSourcee(root, slug, figure) {
  const image = premier(figure, (node) => node.tagName === 'img');
  const id = attribut(figure, 'data-blog-proof');
  if (!id || !image || image.parentNode !== figure
    || elements(figure, (node) => node.tagName === 'figcaption').length
    || elements(figure, (node) => classes(node).has('preuve-defilante')).length) return false;
  try {
    const recette = JSON.parse(readFileSync(join(root, 'editorial/recettes', slug, 'recette.json'), 'utf8'));
    const preuves = recette.inlineProofs ?? [];
    const preuve = preuves.find((item) => item.id === id);
    const date = new Date(`${preuve?.capturedAt}T00:00:00Z`);
    return preuves.filter((item) => item.id === id).length === 1
      && preuve.alt === attribut(image, 'alt') && Boolean(preuve.alt?.trim())
      && attribut(image, 'src') === `/proofs/blog/${id}.webp`
      && Boolean(preuve.source?.trim())
      && /^\d{4}-\d{2}-\d{2}$/.test(preuve.capturedAt ?? '')
      && !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === preuve.capturedAt
      && date.getTime() <= Date.now();
  } catch {
    return false;
  }
}

function preuveDirecteAttendue(root, slug, figure) {
  try {
    const recette = JSON.parse(readFileSync(join(root, 'editorial/recettes', slug, 'recette.json'), 'utf8'));
    return (recette.inlineProofs ?? []).some((preuve) => preuve.id === attribut(figure, 'data-blog-proof'));
  } catch {
    return false;
  }
}

function estPreuveHistorique(root, slug, path, frontmatter) {
  if (frontmatter.brouillon !== false) return false;
  try {
    const baseline = JSON.parse(readFileSync(join(root, 'editorial/legacy-review-baseline.json'), 'utf8'));
    const entree = baseline.articles?.[slug];
    if (!entree?.recipeSha256 || !entree?.reviewSha256) return false;
    const dossier = join(root, 'editorial/recettes', slug);
    const hash = (nom) => createHash('sha256').update(readFileSync(join(dossier, nom))).digest('hex');
    const publication = JSON.parse(readFileSync(join(root, 'editorial/articles', slug, 'preuves/publication.json'), 'utf8'));
    return publication.kind === 'publication-scellee' && publication.candidateSlug === slug
      && createHash('sha256').update(readFileSync(path)).digest('hex') === publication.articleSha256
      && hash('recette.json') === entree.recipeSha256 && hash('revues.json') === entree.reviewSha256;
  } catch {
    return false;
  }
}

function parcourir(node, visite) {
  visite(node);
  for (const enfant of node.childNodes ?? []) parcourir(enfant, visite);
}

function elements(node, predicat) {
  const trouves = [];
  parcourir(node, (candidat) => {
    if (candidat.tagName && predicat(candidat)) trouves.push(candidat);
  });
  return trouves;
}

function premier(node, predicat) {
  return elements(node, predicat)[0] ?? null;
}

function attribut(node, nom) {
  return node?.attrs?.find((item) => item.name === nom)?.value ?? null;
}

function aAttribut(node, nom) {
  return node?.attrs?.some((item) => item.name === nom) ?? false;
}

function classes(node) {
  return new Set((attribut(node, 'class') ?? '').split(/\s+/).filter(Boolean));
}

function texte(node) {
  if (!node) return '';
  return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(texte).join('');
}

function texteSansLegendes(node) {
  if (!node || node.tagName === 'figcaption') return '';
  return node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(texteSansLegendes).join(' ');
}

function normaliser(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .replace(/[’']/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function memeRoute(a, b) {
  const nettoyer = (value) => String(value ?? '').split(/[?#]/, 1)[0].replace(/\/$/, '') || '/';
  return nettoyer(a) === nettoyer(b);
}

function cheminRendu(dist, route) {
  const propre = route.split(/[?#]/, 1)[0].replace(/^\//, '').replace(/\/$/, '');
  const direct = join(dist, propre);
  for (const candidat of [`${direct}.html`, join(direct, 'index.html')]) {
    if (existsSync(candidat)) return candidat;
  }
  return null;
}

function lireFrontmatter(path) {
  const markdown = readFileSync(path, 'utf8');
  const bloc = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!bloc) return { markdown, frontmatter: null };
  return { markdown, frontmatter: parseYaml(bloc[1]) ?? null };
}

function requetesDeclarees(frontmatter) {
  return [frontmatter?.primaryQuery, ...(frontmatter?.secondaryQueries ?? [])]
    .filter((requete) => typeof requete === 'string' && requete.trim());
}

function requetesMesurees(frontmatter, mesure) {
  const clesMesurees = new Set(Object.keys(mesure.autocompletion).map(normaliser));
  return requetesDeclarees(frontmatter).filter((requete) => clesMesurees.has(normaliser(requete)));
}

function descriptionCommenceParRequete(description, frontmatter, mesure) {
  const debut = normaliser(description);
  return requetesMesurees(frontmatter, mesure).find((requete) => debut.startsWith(normaliser(requete))) ?? null;
}

function mediasPreuve(articleCorps) {
  if (!articleCorps) return [];
  return elements(articleCorps, (node) => node.tagName === 'figure' && attribut(node, 'data-blog-proof') !== null)
    .map((figure) => {
      const image = premier(figure, (node) => node.tagName === 'img');
      const alt = attribut(image, 'alt') ?? '';
      return {
        figure,
        conforme: Boolean(image && alt.trim()),
        alt,
      };
    })
    .filter(({ figure }) => premier(figure, (node) => node.tagName === 'img'));
}

function estSommaire(node) {
  if (aAttribut(node, 'data-blog-toc')) return true;
  if ([...classes(node)].some((classe) => /sommaire|table-of-contents|toc/.test(classe))) return true;
  return /sommaire|table of contents/i.test(attribut(node, 'aria-label') ?? '');
}

function surfacesTitre(document) {
  const h1 = premier(document, (node) => node.tagName === 'h1');
  const title = premier(document, (node) => node.tagName === 'title');
  const og = premier(document, (node) => node.tagName === 'meta' && attribut(node, 'property') === 'og:title');
  let headline = null;
  for (const script of elements(document, (node) => node.tagName === 'script' && attribut(node, 'type') === 'application/ld+json')) {
    try {
      const valeur = JSON.parse(texte(script));
      const noeuds = Array.isArray(valeur) ? valeur : (valeur['@graph'] ?? [valeur]);
      const article = noeuds.find((item) => item?.['@type'] === 'BlogPosting');
      if (article?.headline) {
        headline = article.headline;
        break;
      }
    } catch {
      // Le parseur de schéma dédié signalera le JSON invalide ; ici la surface reste absente.
    }
  }
  return {
    h1: texte(h1).trim() || null,
    title: texte(title).trim() || null,
    ogTitle: attribut(og, 'content'),
    headline,
  };
}

function routeRubriqueDeclaree(rubrique, articleSlug) {
  if (typeof rubrique === 'string' && rubrique.trim()) {
    const valeur = rubrique.trim();
    if (valeur.startsWith('/')) return [valeur];
    return [`/blog/${valeur}`, `/blog/rubrique/${valeur}`];
  }
  if (!rubrique || typeof rubrique !== 'object') {
    const canonique = rubriquePourArticle(articleSlug);
    return canonique ? [canonique.chemin] : [];
  }
  const chemin = rubrique.chemin ?? rubrique.path ?? rubrique.href;
  if (typeof chemin === 'string' && chemin.startsWith('/')) return [chemin];
  const slug = rubrique.slug ?? rubrique.id;
  return typeof slug === 'string' && slug.trim()
    ? [`/blog/${slug.trim()}`, `/blog/rubrique/${slug.trim()}`]
    : [];
}

function exemptionRubrique(slug) {
  const exemption = ARTICLES_HORS_RUBRIQUE[slug];
  if (!exemption) return null;
  const dateValide = /^\d{4}-\d{2}-\d{2}$/.test(exemption.date ?? '');
  const raisonValide = typeof exemption.raison === 'string' && exemption.raison.trim().length >= 50;
  return { ...exemption, valide: dateValide && raisonValide };
}

function auditerArticle({ root, dist, slug, path, mesure }) {
  const erreurs = [];
  const { frontmatter } = lireFrontmatter(path);
  if (!frontmatter) {
    for (let clause = 1; clause <= 5; clause += 1) erreurs.push(`${slug} : clause ${clause}, frontmatter absent ou illisible`);
    return erreurs;
  }

  const routeArticle = `/blog/${slug}`;
  const page = cheminRendu(dist, routeArticle);
  if (!page) {
    for (let clause = 1; clause <= 5; clause += 1) erreurs.push(`${slug} : clause ${clause}, page construite absente pour ${routeArticle}`);
    return erreurs;
  }

  const document = parseHtml(readFileSync(page, 'utf8'));
  const articleCorps = premier(document, (node) => node.tagName === 'div' && classes(node).has('article-corps'));

  const medias = mediasPreuve(articleCorps);
  const idsVus = new Set();
  const doublons = medias.filter(({ figure }) => {
    const id = attribut(figure, 'data-blog-proof');
    if (!id) return false; // Les figures historiques à légende n'ont pas d'identifiant.
    if (idsVus.has(id)) return true;
    idsVus.add(id);
    return false;
  });
  const conformes = medias.filter((media) => media.conforme && !doublons.includes(media));
  if (conformes.length < 2) {
    erreurs.push(`${slug} : clause 1, ${medias.length} image(s) de preuve en plus de la couverture, ${conformes.length} avec alternative accessible ; 2 requises`);
  }
  if (doublons.length) erreurs.push(`${slug} : clause 1, identifiant data-blog-proof répété entre figures`);
  const contenuPublic = texte(articleCorps).replace(/\s+/g, ' ').trim();
  const horsLegendes = texteSansLegendes(articleCorps);
  const historique = medias.some(({ figure }) => elements(figure, (node) => node.tagName === 'figcaption').length === 0)
    && estPreuveHistorique(root, slug, path, frontmatter);
  if (LEGENDE_TECHNIQUE_INTERDITE.test(contenuPublic)
      || /Source\s*:[^.]{0,320}capture du/i.test(horsLegendes)
      || medias.some(({ figure }) => preuveDirecteAttendue(root, slug, figure)
        ? !preuveDirecteSourcee(root, slug, figure)
        : !legendePreuveValide(figure, historique) && !preuveDirecteSourcee(root, slug, figure))) {
    erreurs.push(`${slug} : clause 1, légende de preuve invalide, provenance interne manquante ou consigne technique publique`);
  }

  const h2 = articleCorps ? elements(articleCorps, (node) => node.tagName === 'h2') : [];
  if (h2.length >= 6) {
    const sansId = h2.filter((titre) => !attribut(titre, 'id'));
    const sommaires = elements(document, estSommaire);
    const ancres = new Set(sommaires.flatMap((sommaire) =>
      elements(sommaire, (node) => node.tagName === 'a')
        .map((lien) => attribut(lien, 'href'))
        .filter((href) => href?.startsWith('#'))
    ));
    const manquantes = h2.filter((titre) => {
      const id = attribut(titre, 'id');
      return id && !ancres.has(`#${id}`);
    });
    if (sommaires.length === 0 || sansId.length > 0 || manquantes.length > 0) {
      erreurs.push(`${slug} : clause 2, ${h2.length} H2 mais sommaire incomplet (${sommaires.length === 0 ? 'sommaire absent' : `${manquantes.length} ancre(s) manquante(s), ${sansId.length} H2 sans id`})`);
    }
  }

  const metaDescription = premier(document, (node) => node.tagName === 'meta' && attribut(node, 'name') === 'description');
  const description = attribut(metaDescription, 'content') ?? '';
  const requeteAmorce = descriptionCommenceParRequete(description, frontmatter, mesure);
  if (!requeteAmorce) {
    erreurs.push(`${slug} : clause 3, la meta-description n’ouvre sur aucune requête déclarée et mesurée — « ${description.slice(0, 72)}${description.length > 72 ? '…' : ''} »`);
  }

  const exemption = exemptionRubrique(slug);
  const cheminsDeclares = routeRubriqueDeclaree(frontmatter.rubrique, slug);
  if (cheminsDeclares.length === 0) {
    if (exemption && !exemption.valide) {
      erreurs.push(`${slug} : clause 4, exemption hors rubrique invalide — date ISO et raison d’au moins 50 caractères requises`);
    } else if (!exemption) {
      erreurs.push(`${slug} : clause 4, rubrique non déclarée dans le registre canonique ni dans le frontmatter`);
    }
  } else {
    const liensRubrique = elements(document, (node) => node.tagName === 'a' && (
      aAttribut(node, 'data-blog-rubrique')
      || cheminsDeclares.some((route) => memeRoute(attribut(node, 'href'), route))
    ));
    const routeRubrique = attribut(liensRubrique[0], 'href');
    if (!routeRubrique) {
      erreurs.push(`${slug} : clause 4, aucun lien rendu vers la rubrique déclarée`);
    } else {
      const pageRubrique = cheminRendu(dist, routeRubrique);
      if (!pageRubrique) {
        erreurs.push(`${slug} : clause 4, page de rubrique construite absente pour ${routeRubrique}`);
      } else {
        const documentRubrique = parseHtml(readFileSync(pageRubrique, 'utf8'));
        const retour = elements(documentRubrique, (node) => node.tagName === 'a' && memeRoute(attribut(node, 'href'), routeArticle));
        if (retour.length === 0) erreurs.push(`${slug} : clause 4, ${routeRubrique} ne pointe pas vers ${routeArticle}`);
      }
    }
  }

  const titres = surfacesTitre(document);
  if (!titres.h1 || titres.ogTitle !== titres.h1 || titres.headline !== titres.h1) {
    erreurs.push(`${slug} : clause 5, H1, og:title et headline divergent — H1 « ${titres.h1 ?? 'absent'} », og:title « ${titres.ogTitle ?? 'absent'} », headline « ${titres.headline ?? 'absent'} »`);
  }
  if (!titres.title) {
    erreurs.push(`${slug} : clause 5, <title> absent`);
  } else if (titres.h1 && titres.title !== titres.h1) {
    const requetes = requetesDeclarees(frontmatter);
    if (!titrePorteUneRequeteMesuree(titres.title, requetes, mesure.autocompletion)) {
      erreurs.push(`${slug} : clause 5, le <title> diffère du H1 sans porter de requête déclarée et mesurée — « ${titres.title} »`);
    }
  }

  return erreurs;
}

export function auditerContratBlog({
  root = process.cwd(),
  dist = join(root, 'dist'),
  slugs = null,
  mesure = null,
  au,
} = {}) {
  const dossier = join(root, 'src/content/blog');
  const tous = existsSync(dossier)
    ? readdirSync(dossier).filter((nom) => nom.endsWith('.md')).map((nom) => nom.slice(0, -3)).sort()
    : [];
  // La route Astro exclut les brouillons du build public. Si une preview les rend,
  // ils sont soumis aux cinq mêmes clauses ; un article public manquant reste rouge.
  const demandes = slugs === null ? null : new Set(slugs);
  const selection = demandes ? tous.filter((slug) => demandes.has(slug)) : tous.filter((slug) => {
    const { frontmatter } = lireFrontmatter(join(dossier, `${slug}.md`));
    return frontmatter?.brouillon !== true || Boolean(cheminRendu(dist, `/blog/${slug}`));
  });
  const erreurs = demandes
    ? [...demandes].filter((slug) => !tous.includes(slug)).map((slug) => `${slug} : source article absente`)
    : [];
  const exemptions = [];
  for (const slug of selection) {
    let mesureChargee = mesure;
    let erreurMesure = null;
    if (!mesureChargee) {
      try {
        mesureChargee = chargerAutocompletionMesuree(root, { au: dateIntentionScellee(root, slug) ?? au });
      } catch (error) {
        erreurMesure = error.message;
        mesureChargee = { autocompletion: {} };
      }
    }
    const exemption = exemptionRubrique(slug);
    if (exemption?.valide) exemptions.push({ slug, clause: 4, date: exemption.date, raison: exemption.raison });
    if (erreurMesure) erreurs.push(`${slug} : clauses 3 et 5, ${erreurMesure}`);
    erreurs.push(...auditerArticle({ root, dist, slug, path: join(dossier, `${slug}.md`), mesure: mesureChargee }));
  }
  return { pass: erreurs.length === 0, articles: selection.length, exemptions, erreurs };
}

function cli() {
  const args = process.argv.slice(2);
  const indexSlug = args.indexOf('--slug');
  const slugs = indexSlug >= 0 && args[indexSlug + 1] ? [args[indexSlug + 1]] : null;
  const resultat = auditerContratBlog({ root: resolve(process.cwd()), slugs });
  console.log(`${resultat.pass ? 'VERT' : 'ROUGE'} — contrat blog : ${resultat.articles} article(s) contrôlé(s) · ${resultat.exemptions.length} exemption(s) clause 4`);
  for (const exemption of resultat.exemptions) console.log(`- ${exemption.slug} : clause 4 exemptée le ${exemption.date} — ${exemption.raison}`);
  for (const erreur of resultat.erreurs) console.error(`- ${erreur}`);
  if (!resultat.pass) process.exitCode = 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) cli();
