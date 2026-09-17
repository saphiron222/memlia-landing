#!/usr/bin/env node
/**
 * Les deux extensions de la forge (docs/strategy/site-v3/CRONS-SEO.md §4) et les registres qu'elles partagent
 * avec les crons.
 *
 *   node scripts/seo/forge-seo.mjs registre reconcilier            inscrit les articles publiés absents du registre
 *   node scripts/seo/forge-seo.mjs registre definir <slug> --requete "…" [--secondaires "a ; b"] [--famille f]
 *   node scripts/seo/forge-seo.mjs registre lister
 *   node scripts/seo/forge-seo.mjs maintenance initialiser|lister [--json]
 *   node scripts/seo/forge-seo.mjs maintenance ajouter --slug s --type t --gravite g --motif "…" --valeur v --instrument i [--cle c]
 *   node scripts/seo/forge-seo.mjs maintenance cloturer <id> --commit <sha>
 *   node scripts/seo/forge-seo.mjs maintenance ecarter <id> --motif "…"
 *   node scripts/seo/forge-seo.mjs indexnow initialiser|verifier|envoyer <url…>
 *   node scripts/seo/forge-seo.mjs apres-publication <slug…> [--sans-indexnow] [--attente-max-s 600]
 *
 * `apres-publication` (F1) se lance après le contrôle en ligne du runbook §5 : il attend que la production
 * serve l'article, pose la baseline de dérive de l'article, de /blog et du pilier, inscrit l'article au
 * registre des requêtes et envoie un ping IndexNow. Le vendredi (F2), `maintenance lister` donne à la forge
 * les tâches à traiter par republication scellée, et `cloturer` les ferme avec le commit.
 */
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  CHEMINS,
  ajouterAuRegistre,
  ajouterTache,
  articlesPublies,
  chargerMaintenance,
  chargerRegistre,
  cloturerTache,
  ecarterTache,
  ecrireJson,
  lireJson,
  maintenanceVide,
  reconcilierRegistre,
  sauverMaintenance,
  sauverRegistre,
  tachesAFaire,
} from '../lib/seo-registres.mjs';
import { CHEMIN_INDEXNOW, ORIGINE, UA_NAVIGATEUR, chercherPage, commitDistant, derivePoser, indexNow, lireCleIndexNow } from '../lib/seo-instruments.mjs';

const dateLocale = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

function lireOptions(argv) {
  const positionnels = [];
  const o = {};
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const nom = a.slice(2);
      const suivant = argv[i + 1];
      if (suivant === undefined || suivant.startsWith('--')) o[nom] = true;
      else {
        o[nom] = suivant;
        i += 1;
      }
    } else positionnels.push(a);
  }
  return { positionnels, o };
}

// ---------------------------------------------------------------- registre

export function inscrireArticle(root, slug, { aujourdhui = dateLocale() } = {}) {
  const article = articlesPublies(root, { aujourdhui }).find((a) => a.slug === slug);
  if (!article) return { ok: false, message: `article ${slug} introuvable parmi les articles publiés (brouillon: false, date passée)` };
  if (!article.requete) return { ok: false, message: `article ${slug} sans requête primaire dans le frontmatter ni la recette` };
  const registre = chargerRegistre(root);
  const existant = registre.articles.find((a) => a.slug === slug);
  if (existant) return { ok: true, message: `article ${slug} déjà inscrit (requête « ${existant.requete} »)`, ajoute: false };
  sauverRegistre(root, ajouterAuRegistre(registre, { ...article, source: article.source }));
  return { ok: true, message: `article ${slug} inscrit avec la requête « ${article.requete} »`, ajoute: true };
}

function registre(root, sousCommande, positionnels, o) {
  if (sousCommande === 'reconcilier') {
    const publies = articlesPublies(root, { aujourdhui: o.date ?? dateLocale() });
    const sansRequete = publies.filter((a) => !a.requete).map((a) => a.slug);
    const { registre: apres, ajoutes } = reconcilierRegistre(chargerRegistre(root), publies.filter((a) => a.requete));
    if (ajoutes.length) sauverRegistre(root, apres);
    return { ajoutes, sansRequete, total: apres.articles.length };
  }
  if (sousCommande === 'definir') {
    const [slug] = positionnels;
    if (!slug || typeof o.requete !== 'string') throw new Error('definir <slug> --requete "…" [--secondaires "a ; b"] [--famille f] [--publie-le AAAA-MM-JJ]');
    const publie = articlesPublies(root).find((a) => a.slug === slug);
    const entree = {
      slug,
      url: `${ORIGINE}/blog/${slug}`,
      requete: o.requete,
      secondaires: typeof o.secondaires === 'string' ? o.secondaires.split(';').map((s) => s.trim()).filter(Boolean) : [],
      famille: typeof o.famille === 'string' ? o.famille : publie?.famille ?? null,
      publieLe: typeof o['publie-le'] === 'string' ? o['publie-le'] : publie?.publieLe ?? null,
      source: typeof o.source === 'string' ? o.source : 'definition-manuelle',
    };
    const apres = ajouterAuRegistre(chargerRegistre(root), entree);
    sauverRegistre(root, apres);
    return { defini: apres.articles.find((a) => a.slug === slug) };
  }
  if (sousCommande === 'lister') return chargerRegistre(root);
  throw new Error('registre reconcilier | definir <slug> … | lister');
}

// ---------------------------------------------------------------- maintenance

function maintenance(root, sousCommande, positionnels, o) {
  const aujourdhui = typeof o.date === 'string' ? o.date : dateLocale();
  if (sousCommande === 'initialiser') {
    const chemin = join(root, CHEMINS.maintenance);
    if (existsSync(chemin)) return { cree: false, chemin: CHEMINS.maintenance };
    sauverMaintenance(root, maintenanceVide());
    return { cree: true, chemin: CHEMINS.maintenance };
  }
  const file = chargerMaintenance(root);
  if (sousCommande === 'lister') return { aFaire: tachesAFaire(file), total: file.taches.length };
  if (sousCommande === 'ajouter') {
    const { file: apres, ajoutee, tache } = ajouterTache(file, {
      slug: o.slug,
      type: o.type,
      gravite: o.gravite,
      motif: o.motif,
      cle: typeof o.cle === 'string' ? o.cle : undefined,
      mesure: { valeur: String(o.valeur ?? ''), instrument: o.instrument, date: aujourdhui },
      cron: typeof o.cron === 'string' ? o.cron : 'manuel',
    }, { aujourdhui });
    sauverMaintenance(root, apres);
    return { ajoutee, tache };
  }
  if (sousCommande === 'cloturer') {
    const [id] = positionnels;
    if (!id || typeof o.commit !== 'string') throw new Error('cloturer <id> --commit <sha>');
    const apres = cloturerTache(file, id, { commit: o.commit, aujourdhui });
    sauverMaintenance(root, apres);
    return { cloturee: apres.taches.find((t) => t.id === id) };
  }
  if (sousCommande === 'ecarter') {
    const [id] = positionnels;
    if (!id || typeof o.motif !== 'string') throw new Error('ecarter <id> --motif "…"');
    const apres = ecarterTache(file, id, { motif: o.motif, aujourdhui });
    sauverMaintenance(root, apres);
    return { ecartee: apres.taches.find((t) => t.id === id) };
  }
  throw new Error('maintenance initialiser | lister | ajouter … | cloturer <id> --commit <sha> | ecarter <id> --motif "…"');
}

// ---------------------------------------------------------------- IndexNow

function indexnow(root, sousCommande, positionnels) {
  if (sousCommande === 'initialiser') {
    const existante = lireCleIndexNow(root);
    if (existante) return { cree: false, ...existante };
    const cle = randomBytes(16).toString('hex');
    const fichier = `${cle}.txt`;
    mkdirSync(join(root, 'public'), { recursive: true });
    writeFileSync(join(root, 'public', fichier), `${cle}\n`);
    const declaration = { cle, emplacement: `${ORIGINE}/${fichier}`, fichier: `public/${fichier}`, creeLe: dateLocale(), note: 'Clé IndexNow, publique par conception : elle prouve la maîtrise du domaine, rien de plus.' };
    ecrireJson(join(root, CHEMIN_INDEXNOW), declaration);
    return { cree: true, ...declaration };
  }
  if (sousCommande === 'verifier') return indexNow(root, [], { verifierSeulement: true });
  if (sousCommande === 'envoyer') {
    if (!positionnels.length) throw new Error('envoyer <url…>');
    return indexNow(root, positionnels);
  }
  throw new Error('indexnow initialiser | verifier | envoyer <url…>');
}

// ---------------------------------------------------------------- après publication (F1)

async function attendreProduction(url, { marqueur = null, attenteMaxS = 600 } = {}) {
  const debut = Date.now();
  let dernier = null;
  while ((Date.now() - debut) / 1000 < attenteMaxS) {
    const r = await chercherPage(url, { ua: UA_NAVIGATEUR, timeoutMs: 20_000 });
    dernier = { status: r.status, erreur: r.erreur };
    if (r.ok && (!marqueur || r.corps.includes(marqueur))) return { servie: true, apresS: Math.round((Date.now() - debut) / 1000), status: r.status };
    await dormir(30_000);
  }
  return { servie: false, apresS: attenteMaxS, ...dernier };
}

export async function apresPublication(root, slugs, { sansIndexnow = false, attenteMaxS = 600 } = {}) {
  const date = dateLocale();
  const publies = articlesPublies(root, { aujourdhui: date });
  const pilier = publies.find((a) => a.format === 'pillar-page');
  const etatChemin = join(root, CHEMINS.brut, 'etat-sentinelle.json');
  const etat = lireJson(etatChemin, () => ({ version: 1, premieresVues: {}, etat: {}, baselines: {} }));
  const commit = commitDistant(root);
  const rapport = { date, commit, articles: [], baselines: [], registre: [], indexnow: null, erreurs: [] };

  const aBaseliner = new Set([`${ORIGINE}/blog`]);
  if (pilier) aBaseliner.add(pilier.url);
  for (const slug of slugs) {
    const article = publies.find((a) => a.slug === slug);
    if (!article) {
      rapport.erreurs.push(`article ${slug} introuvable parmi les articles publiés`);
      continue;
    }
    const marqueur = article.titreOnglet ? article.titreOnglet.replace(/&/g, '&amp;') : null;
    const attente = await attendreProduction(article.url, { marqueur, attenteMaxS });
    rapport.articles.push({ slug, url: article.url, ...attente });
    if (!attente.servie) {
      rapport.erreurs.push(`${article.url} ne sert pas encore le contenu publié après ${attenteMaxS} s`);
      continue;
    }
    aBaseliner.add(article.url);
    rapport.registre.push(inscrireArticle(root, slug, { aujourdhui: date }));
  }

  for (const url of aBaseliner) {
    const pose = derivePoser(url);
    if (pose.ok) {
      etat.baselines[url] = { baselineId: pose.baselineId, commit, date };
      if (!etat.premieresVues[url]) etat.premieresVues[url] = date;
      rapport.baselines.push({ url, baselineId: pose.baselineId });
    } else {
      rapport.erreurs.push(`baseline non posée pour ${url} : ${pose.message}`);
    }
  }
  ecrireJson(etatChemin, etat);

  rapport.indexnow = sansIndexnow ? { statut: 'desactive' } : indexNow(root, [...aBaseliner]);
  return rapport;
}

// ---------------------------------------------------------------- entrée

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const root = process.cwd();
  const [commande, sousCommande, ...reste] = process.argv.slice(2);
  const { positionnels, o } = lireOptions(reste);
  try {
    let resultat;
    if (commande === 'registre') resultat = registre(root, sousCommande, positionnels, o);
    else if (commande === 'maintenance') resultat = maintenance(root, sousCommande, positionnels, o);
    else if (commande === 'indexnow') resultat = indexnow(root, sousCommande, positionnels);
    else if (commande === 'apres-publication') {
      const slugs = [sousCommande, ...positionnels].filter((s) => s && !s.startsWith('--'));
      resultat = await apresPublication(root, slugs, { sansIndexnow: Boolean(o['sans-indexnow']), attenteMaxS: Number(o['attente-max-s'] ?? 600) });
      if (resultat.erreurs.length) process.exitCode = 2;
    } else throw new Error('commande attendue : registre | maintenance | indexnow | apres-publication');
    console.log(JSON.stringify(resultat, null, 2));
  } catch (e) {
    console.error(`forge-seo : ${e.message}`);
    process.exitCode = 1;
  }
}
