/**
 * Registres du suivi SEO (docs/strategy/site-v3/CRONS-SEO.md §5).
 *
 * Trois registres, trois contrats :
 *   - le registre des requêtes : quel article vise quelle requête, dans quelle famille ;
 *   - la file de maintenance : les tâches que les crons déposent et que la forge consomme le vendredi ;
 *   - les requêtes vues : la première et la dernière date où Search Console a montré une requête.
 *
 * Les fonctions de calcul sont pures (l'argument reçu n'est jamais muté) ; la lecture et l'écriture
 * sont explicites et séparées. Aucune donnée nominative ne transite ici.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { PUBLICATION_SEAL_PATH, validatePublicationSeal } from './blog-pipeline.mjs';

export const CHEMINS = Object.freeze({
  mesures: 'docs/strategy/site-v3/mesures',
  registreRequetes: 'docs/strategy/site-v3/mesures/registre-requetes.json',
  requetesVues: 'docs/strategy/site-v3/mesures/requetes-vues.json',
  maintenance: 'editorial/maintenance.json',
  brut: '.qa/seo',
});

export const TYPES_TACHE = Object.freeze(['recaler-titre', 'reverifier-source', 'inserer-lien', 'varier-ancre', 'rafraichir']);
export const GRAVITES = Object.freeze(['haute', 'moyenne', 'basse']);
const RANG_GRAVITE = { haute: 0, moyenne: 1, basse: 2 };
const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;

// ---------------------------------------------------------------- lecture et écriture

export function lireJson(chemin, defaut) {
  if (!existsSync(chemin)) return typeof defaut === 'function' ? defaut() : defaut;
  return JSON.parse(readFileSync(chemin, 'utf8'));
}

export function ecrireJson(chemin, valeur) {
  mkdirSync(dirname(chemin), { recursive: true });
  writeFileSync(chemin, `${JSON.stringify(valeur, null, 2)}\n`);
}

export const chargerRegistre = (root) => lireJson(join(root, CHEMINS.registreRequetes), registreVide);
export const sauverRegistre = (root, registre) => ecrireJson(join(root, CHEMINS.registreRequetes), registre);
export const chargerMaintenance = (root) => lireJson(join(root, CHEMINS.maintenance), maintenanceVide);
export const sauverMaintenance = (root, file) => ecrireJson(join(root, CHEMINS.maintenance), file);
export const chargerRequetesVues = (root) => lireJson(join(root, CHEMINS.requetesVues), () => ({}));
export const sauverRequetesVues = (root, vues) => ecrireJson(join(root, CHEMINS.requetesVues), vues);

function exigerDate(valeur, nom) {
  if (typeof valeur !== 'string' || !DATE_ISO.test(valeur)) throw new Error(`${nom} doit être une date ISO (AAAA-MM-JJ), reçu : ${valeur}`);
  return valeur;
}

// ---------------------------------------------------------------- registre des requêtes

export function registreVide() {
  return { version: 1, marque: ['memlia'], articles: [] };
}

function validerEntree(entree) {
  if (!entree || typeof entree.slug !== 'string' || !entree.slug.trim()) throw new Error('registre : slug requis');
  if (typeof entree.requete !== 'string' || !entree.requete.trim()) throw new Error(`registre : requete requise pour ${entree.slug}`);
  if (typeof entree.url !== 'string' || !/^https:\/\/memlia\.fr\//.test(entree.url)) throw new Error(`registre : url https://memlia.fr/… requise pour ${entree.slug}`);
  if (entree.secondaires !== undefined && !Array.isArray(entree.secondaires)) throw new Error(`registre : secondaires doit être une liste pour ${entree.slug}`);
  if (entree.publieLe !== undefined && entree.publieLe !== null) exigerDate(entree.publieLe, `registre : publieLe de ${entree.slug}`);
}

export function ajouterAuRegistre(registre, entree) {
  validerEntree(entree);
  const existante = registre.articles.find((a) => a.slug === entree.slug);
  const secondaires = [...new Set([...(existante?.secondaires ?? []), ...(entree.secondaires ?? [])])];
  const fusion = { ...(existante ?? {}), ...entree, requete: entree.requete.trim(), secondaires };
  const articles = existante
    ? registre.articles.map((a) => (a.slug === entree.slug ? fusion : a))
    : [...registre.articles, fusion];
  return { ...registre, articles };
}

/** Ajoute les articles publiés absents du registre ; un article déjà inscrit garde sa requête. */
export function reconcilierRegistre(registre, publies) {
  const connus = new Set(registre.articles.map((a) => a.slug));
  const ajoutes = [];
  let resultat = registre;
  for (const publie of publies) {
    if (connus.has(publie.slug)) continue;
    resultat = ajouterAuRegistre(resultat, publie);
    connus.add(publie.slug);
    ajoutes.push(publie.slug);
  }
  return { registre: resultat, ajoutes };
}

// ---------------------------------------------------------------- file de maintenance

export function maintenanceVide() {
  return { version: 1, taches: [] };
}

function validerTache(tache) {
  if (!tache || typeof tache.slug !== 'string' || !tache.slug.trim()) throw new Error('maintenance : slug requis');
  if (!TYPES_TACHE.includes(tache.type)) throw new Error(`maintenance : type inconnu « ${tache.type} » (attendu : ${TYPES_TACHE.join(', ')})`);
  if (!GRAVITES.includes(tache.gravite)) throw new Error(`maintenance : gravite inconnue « ${tache.gravite} » (attendu : ${GRAVITES.join(', ')})`);
  if (typeof tache.motif !== 'string' || !tache.motif.trim()) throw new Error(`maintenance : motif requis pour ${tache.slug}`);
  const m = tache.mesure;
  if (!m || typeof m !== 'object' || m.valeur === undefined || !m.instrument) throw new Error(`maintenance : mesure {valeur, instrument, date} requise pour ${tache.slug}`);
  if (m.date !== undefined) exigerDate(m.date, `maintenance : mesure.date de ${tache.slug}`);
}

export function ajouterTache(file, tache, { aujourdhui }) {
  validerTache(tache);
  exigerDate(aujourdhui, 'aujourdhui');
  const cle = typeof tache.cle === 'string' && tache.cle ? tache.cle : tache.motif;
  const index = file.taches.findIndex((t) => t.statut === 'a-faire' && t.slug === tache.slug && t.type === tache.type && t.cle === cle);
  if (index >= 0) {
    const ancienne = file.taches[index];
    const gravite = RANG_GRAVITE[tache.gravite] < RANG_GRAVITE[ancienne.gravite] ? tache.gravite : ancienne.gravite;
    const maj = { ...ancienne, motif: tache.motif, mesure: { ...tache.mesure }, gravite, misAJourLe: aujourdhui };
    return { file: { ...file, taches: file.taches.map((t, i) => (i === index ? maj : t)) }, ajoutee: false, tache: maj };
  }
  const prefixe = `${aujourdhui}-${tache.type}-${tache.slug}-`;
  const rang = file.taches.filter((t) => t.id.startsWith(prefixe)).length + 1;
  const nouvelle = {
    id: `${prefixe}${rang}`,
    slug: tache.slug,
    type: tache.type,
    cle,
    motif: tache.motif,
    mesure: { ...tache.mesure },
    gravite: tache.gravite,
    cron: tache.cron ?? null,
    statut: 'a-faire',
    creeLe: aujourdhui,
    misAJourLe: aujourdhui,
    traiteLe: null,
    commit: null,
  };
  return { file: { ...file, taches: [...file.taches, nouvelle] }, ajoutee: true, tache: nouvelle };
}

function trouverAFaire(file, id) {
  const tache = file.taches.find((t) => t.id === id);
  if (!tache) throw new Error(`maintenance : tâche inconnue ${id}`);
  if (tache.statut !== 'a-faire') throw new Error(`maintenance : la tâche ${id} est déjà au statut ${tache.statut}`);
  return tache;
}

const remplacer = (file, id, maj) => ({ ...file, taches: file.taches.map((t) => (t.id === id ? maj : t)) });

export function cloturerTache(file, id, { commit, aujourdhui }) {
  const tache = trouverAFaire(file, id);
  if (typeof commit !== 'string' || !commit.trim()) throw new Error(`maintenance : commit requis pour clôturer ${id}`);
  exigerDate(aujourdhui, 'aujourdhui');
  return remplacer(file, id, { ...tache, statut: 'fait', traiteLe: aujourdhui, commit: commit.trim() });
}

export function ecarterTache(file, id, { motif, aujourdhui }) {
  const tache = trouverAFaire(file, id);
  if (typeof motif !== 'string' || !motif.trim()) throw new Error(`maintenance : motif requis pour écarter ${id}`);
  exigerDate(aujourdhui, 'aujourdhui');
  return remplacer(file, id, { ...tache, statut: 'ecarte', traiteLe: aujourdhui, motifEcart: motif.trim() });
}

export function tachesAFaire(file) {
  return file.taches
    .filter((t) => t.statut === 'a-faire')
    .sort((a, b) => RANG_GRAVITE[a.gravite] - RANG_GRAVITE[b.gravite] || a.creeLe.localeCompare(b.creeLe) || a.id.localeCompare(b.id));
}

// ---------------------------------------------------------------- requêtes vues

export function marquerRequetesVues(vues, requetes, { aujourdhui }) {
  exigerDate(aujourdhui, 'aujourdhui');
  const suite = { ...vues };
  const nouvelles = [];
  for (const brute of requetes) {
    const requete = String(brute).trim();
    if (!requete) continue;
    if (suite[requete]) {
      suite[requete] = { ...suite[requete], derniereVue: aujourdhui };
    } else {
      suite[requete] = { premiereVue: aujourdhui, derniereVue: aujourdhui };
      nouvelles.push(requete);
    }
  }
  return { vues: suite, nouvelles };
}

// ---------------------------------------------------------------- articles publiés (frontmatter)

/**
 * Lit un sous-ensemble YAML suffisant pour le frontmatter des articles : clé: valeur au premier niveau,
 * chaînes citées, listes [a, b], booléens. Les blocs imbriqués (sources, cta, preuveRole) sont ignorés.
 */
export function lireFrontmatter(markdown) {
  const bloc = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!bloc) return {};
  const champs = {};
  for (const ligne of bloc[1].split(/\r?\n/)) {
    const m = ligne.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (!m) continue;
    let valeur = m[2].trim();
    if (/^".*"$/.test(valeur) || /^'.*'$/.test(valeur)) valeur = valeur.slice(1, -1);
    else if (/^\[.*\]$/.test(valeur)) valeur = valeur.slice(1, -1).split(',').map((v) => v.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    else if (valeur === 'true' || valeur === 'false') valeur = valeur === 'true';
    champs[m[1]] = valeur;
  }
  return champs;
}

function publicationScellee(root, slug, markdown) {
  const dossier = join(root, 'editorial/articles', slug);
  const manifestPath = join(dossier, 'manifest.json');
  if (!existsSync(manifestPath) || !existsSync(join(dossier, PUBLICATION_SEAL_PATH))) return false;
  try {
    const manifestBytes = readFileSync(manifestPath);
    const manifest = JSON.parse(manifestBytes.toString('utf8'));
    const sha256 = (contenu) => createHash('sha256').update(contenu).digest('hex');
    return validatePublicationSeal(dossier, manifest, {
      slug,
      articleHash: sha256(markdown),
      manifestHash: sha256(manifestBytes),
    }).length === 0;
  } catch {
    return false;
  }
}

/**
 * Les articles publiés du site, tels que les sources les décrivent : le frontmatter fait foi
 * (`brouillon: false` comme pour le site, `datePublication`, `famille`, `primaryQuery`), la recette
 * complète ce qui manque. Un article sans requête connue est rendu avec `requete: null` : c'est au
 * registre de la porter (les trois articles antérieurs à la v3).
 */
export function articlesPublies(root, { aujourdhui, inclureScellesFuturs = false } = {}) {
  const dossier = join(root, 'src/content/blog');
  if (!existsSync(dossier)) return [];
  const jour = aujourdhui ?? new Date().toISOString().slice(0, 10);
  const articles = [];
  for (const fichier of readdirSync(dossier).filter((f) => f.endsWith('.md')).sort()) {
    const slug = fichier.slice(0, -3);
    const markdown = readFileSync(join(dossier, fichier), 'utf8');
    const fm = lireFrontmatter(markdown);
    if (fm.brouillon !== false) continue;
    const publieLe = typeof fm.datePublication === 'string' ? fm.datePublication.slice(0, 10) : null;
    if (publieLe && publieLe > jour && !(inclureScellesFuturs && fm.statutEditorial === 'publie' && publicationScellee(root, slug, markdown))) continue;
    const recette = lireJson(join(root, 'editorial/recettes', slug, 'recette.json'), null);
    const secondaires = Array.isArray(fm.secondaryQueries) ? fm.secondaryQueries : Array.isArray(recette?.secondaryQueries) ? recette.secondaryQueries : [];
    articles.push({
      slug,
      url: `https://memlia.fr/blog/${slug}`,
      requete: (typeof fm.primaryQuery === 'string' && fm.primaryQuery) || recette?.primaryQuery || null,
      secondaires,
      famille: fm.famille ?? recette?.famille ?? null,
      format: fm.format ?? null,
      publieLe,
      titreOnglet: fm.titreOnglet ?? null,
      source: typeof fm.primaryQuery === 'string' && fm.primaryQuery ? 'frontmatter' : recette ? 'recette' : 'aucune',
    });
  }
  return articles;
}
