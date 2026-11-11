#!/usr/bin/env node
/**
 * C1, la sentinelle d'indexation et de dérive (docs/strategy/site-v3/CRONS-SEO.md §3, RUNBOOK-SEO.md).
 *
 *   node scripts/seo/sentinelle.mjs [--date AAAA-MM-JJ] [--sans-derive] [--sans-indexnow] [--json]
 *
 * Lit : le sitemap de production, Search Console en lecture seule (scripts/seo/gsc.py), la dérive de chaque
 * URL contre sa baseline (drift_compare.py du skill seo), l'oracle maison d'indexabilité, les variantes
 * http:// et www. Écrit : .qa/seo/sentinelle/<date>.json (brut, non suivi), .qa/seo/etat-sentinelle.json
 * (premières vues, état, baselines), docs/strategy/site-v3/mesures/sentinelle.jsonl (une ligne par jour).
 * Ne corrige rien : elle nomme. Code de sortie 0 sans rouge, 2 avec rouge, 1 si un instrument manque.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

import { CHEMINS, ecrireJson, lireJson } from '../lib/seo-registres.mjs';
import { SEUILS, fenetres, jugerIndexation } from '../lib/seo-regles.mjs';
import {
  ORIGINE,
  chercherPage,
  commitDistant,
  deriveComparer,
  derivePoser,
  gscPy,
  indexNow,
  indexabiliteProduction,
  sitemapProduction,
} from '../lib/seo-instruments.mjs';

const VARIANTES = ['http://memlia.fr/', 'https://www.memlia.fr/', 'http://www.memlia.fr/'];

export const dateLocale = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });

function options(argv) {
  const o = { date: null, sansDerive: false, sansIndexnow: false, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--date') o.date = argv[++i];
    else if (argv[i] === '--sans-derive') o.sansDerive = true;
    else if (argv[i] === '--sans-indexnow') o.sansIndexnow = true;
    else if (argv[i] === '--json') o.json = true;
    else throw new Error(`option inconnue : ${argv[i]}`);
  }
  if (o.date && !/^\d{4}-\d{2}-\d{2}$/.test(o.date)) throw new Error('--date attend AAAA-MM-JJ');
  return o;
}

const etatVide = () => ({ version: 1, premieresVues: {}, etat: {}, baselines: {} });

const ETAT_ARCHIVABLE = join(CHEMINS.mesures, 'sentinelle-etat.json');
const archivesSentinelle = () => process.env.MEMLIA_SEO_ARCHIVES
  || join(homedir(), '.hermes/profiles/marketing/cron/seo-archives/sentinelle');

/** L'état local fait foi ; les archives complètent seulement les entrées absentes. */
export function chargerEtatSentinelle({ root, archiveRoot = archivesSentinelle() }) {
  const etat = etatVide();
  const sources = [];
  const messages = [];
  const charger = (chemin, archive = false) => {
    if (!existsSync(chemin)) return;
    try {
      const lu = lireJson(chemin);
      if (lu.version !== 1 || ['premieresVues', 'etat', 'baselines'].some((k) => !lu[k] || typeof lu[k] !== 'object' || Array.isArray(lu[k]))) {
        throw new Error(`état sentinelle invalide : ${chemin}`);
      }
      let ajoutes = 0;
      for (const cle of ['premieresVues', 'etat', 'baselines']) {
        for (const [url, valeur] of Object.entries(lu[cle])) {
          if (Object.hasOwn(etat[cle], url)) continue;
          etat[cle][url] = valeur;
          ajoutes += 1;
        }
      }
      if (ajoutes) sources.push(chemin);
    } catch (e) {
      if (!archive) throw e;
      messages.push(`archive ignorée : ${chemin} : ${e.message}`);
    }
  };
  charger(join(root, CHEMINS.brut, 'etat-sentinelle.json'));
  charger(join(root, ETAT_ARCHIVABLE));
  if (existsSync(archiveRoot)) {
    const dossiers = readdirSync(archiveRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort().reverse();
    for (const dossier of dossiers) charger(join(archiveRoot, dossier, ETAT_ARCHIVABLE), true);
  }
  return { etat, sources, messages };
}

export async function releverVariante(url, { chercher = chercherPage } = {}) {
  const tentatives = [];
  for (let essai = 0; essai < 2; essai += 1) {
    const premier = await chercher(url, { suivre: false, timeoutMs: 15_000 });
    const final = await chercher(url, { suivre: true, timeoutMs: 15_000 });
    const mesure = {
      status: premier.status, location: premier.location ?? null,
      finalStatus: final.status, finalUrl: final.finalUrl ?? null,
      redirections: final.redirections ?? 0, erreur: premier.erreur ?? final.erreur ?? null,
    };
    tentatives.push(mesure);
    if (!mesure.erreur && mesure.status !== 0 && mesure.finalStatus !== 0) break;
  }
  return { url, ...tentatives.at(-1), tentatives };
}

export function couvertureSentinelle({ urls, inspections, derive, variantes, sitemapsDisponibles, analytiqueDisponible, sansDerive = false }) {
  const compter = (attendues, mesurees) => ({ attendues: attendues.length, mesurees: mesurees.length, exclues: attendues.filter((u) => !mesurees.includes(u)) });
  const couverture = {
    inspections: compter(urls, urls.filter((url) => inspections.some((i) => i.url === url && !i.error && i.coverage_state))),
    derive: compter(urls, urls.filter((url) => derive.some((d) => d.url === url && ['ok', 'derive'].includes(d.statut)))),
    variantes: compter(variantes.map((v) => v.url), variantes.filter((v) => !v.erreur && v.status !== 0 && v.finalStatus !== 0).map((v) => v.url)),
    sitemaps: sitemapsDisponibles,
    impressionsVariantes: analytiqueDisponible,
    exclusions: ['Core Web Vitals', 'positions', 'rendu visuel', ...(sansDerive ? ['dérive désactivée'] : [])],
  };
  couverture.complete = sitemapsDisponibles && analytiqueDisponible
    && ['inspections', 'derive', 'variantes'].every((k) => couverture[k].exclues.length === 0);
  return couverture;
}

function ligneCompacte(verdict, extras) {
  return {
    date: verdict.date,
    urls: verdict.resume.urls,
    indexees: verdict.resume.indexees,
    enAttente: verdict.resume.enAttente,
    rouges: verdict.rouges.map((r) => `${r.code}${r.url ? ` ${r.url}` : ''}`),
    avertissements: verdict.avertissements.length,
    ...extras,
  };
}

/** Les lignes du registre journalier, une par jour : une relance le même jour remplace la ligne du jour. */
function lignesRegistre(chemin) {
  if (!existsSync(chemin)) return [];
  return readFileSync(chemin, 'utf8').trim().split('\n').filter(Boolean).map((l) => {
    try {
      return JSON.parse(l);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

export async function sentinelle({ root = process.cwd(), date = dateLocale(), sansDerive = false, sansIndexnow = false, archiveRoot = archivesSentinelle() } = {}) {
  const historique = chargerEtatSentinelle({ root, archiveRoot });
  const messages = [...historique.messages];
  const etatChemin = join(root, CHEMINS.brut, 'etat-sentinelle.json');
  const etat = historique.etat;

  const sitemap = await sitemapProduction();
  if (!sitemap.ok || sitemap.urls.length === 0) {
    return { ok: false, code: 1, message: `sitemap de production illisible (HTTP ${sitemap.status}${sitemap.erreur ? `, ${sitemap.erreur}` : ''})` };
  }
  const urls = sitemap.urls;

  const inspectionBrute = gscPy(root, 'inspect', ['--urls', ...urls]);
  const inspections = inspectionBrute.json?.inspections
    ?? urls.map((url) => ({ url, error: `gsc.py inspect sans réponse : ${(inspectionBrute.erreur || inspectionBrute.sortie).trim().slice(-200) || `code ${inspectionBrute.code}`}` }));

  const sitemapsBruts = gscPy(root, 'sitemaps');
  const sitemaps = sitemapsBruts.json?.sitemaps ?? [];
  if (!sitemapsBruts.json) messages.push(`état des sitemaps indisponible : ${(sitemapsBruts.erreur || sitemapsBruts.sortie).trim().slice(-200)}`);

  const f = fenetres({ aujourdhui: date });
  const analytique = gscPy(root, 'analytics', ['--debut', f.mois.debut, '--fin', f.mois.fin, '--dimensions', 'page']);
  const lignesPages = analytique.json?.rows ?? [];
  const variantes = [];
  for (const v of VARIANTES) {
    const mesure = await releverVariante(v);
    const impressions28j = lignesPages.filter((l) => String(l.keys?.[0] ?? '').startsWith(v.replace(/\/$/, ''))).reduce((t, l) => t + Number(l.impressions ?? 0), 0);
    variantes.push({ ...mesure, impressions28j: analytique.json ? impressions28j : null });
    if (mesure.tentatives.length > 1) messages.push(`variante reprise une fois : ${v} (${mesure.tentatives[0].erreur ?? 'aucune réponse HTTP'})`);
  }

  const commitDeploye = commitDistant(root);
  const derive = [];
  if (!sansDerive) {
    for (const url of urls) {
      const base = etat.baselines[url];
      if (!base) derive.push({ url, statut: 'sans-baseline' });
      else derive.push(deriveComparer(url, { commitBaseline: base.commit ?? null, baselineId: base.baselineId ?? null }));
    }
  }

  const indexabilite = indexabiliteProduction(root);
  const couverture = couvertureSentinelle({ urls, inspections, derive, variantes, sansDerive,
    sitemapsDisponibles: Array.isArray(sitemapsBruts.json?.sitemaps) && sitemaps.length > 0,
    analytiqueDisponible: Array.isArray(analytique.json?.rows),
  });

  const verdict = jugerIndexation({
    inspections,
    sitemaps,
    premieresVues: etat.premieresVues,
    etatPrecedent: etat.etat,
    derive,
    indexabilite: { passed: indexabilite.passed, message: indexabilite.message },
    variantes,
    aujourdhui: date,
    maintenant: new Date().toISOString(),
    commitDeploye,
    seuils: SEUILS,
  });

  const baselinesPosees = [];
  if (!sansDerive) {
    for (const url of new Set(verdict.actions.poserBaseline)) {
      const pose = derivePoser(url);
      if (pose.ok) {
        etat.baselines[url] = { baselineId: pose.baselineId, commit: commitDeploye, date };
        baselinesPosees.push(url);
      } else {
        messages.push(`baseline non posée pour ${url} : ${pose.message}`);
      }
    }
  }

  const envoiIndexNow = sansIndexnow
    ? { statut: 'desactive', ok: true, message: null }
    : indexNow(root, verdict.actions.indexnow);

  etat.premieresVues = verdict.premieresVues;
  etat.etat = verdict.etat;
  ecrireJson(etatChemin, etat);
  ecrireJson(join(root, ETAT_ARCHIVABLE), etat);

  const brut = {
    date,
    commitDeploye,
    sitemapUrls: urls,
    inspections,
    sitemaps,
    variantes,
    derive,
    indexabilite: { passed: indexabilite.passed, message: indexabilite.message },
    verdict,
    baselinesPosees,
    indexnow: envoiIndexNow,
    messages,
    historique: { sources: historique.sources },
    couverture,
  };
  ecrireJson(join(root, CHEMINS.brut, 'sentinelle', `${date}.json`), brut);

  const registreChemin = join(root, CHEMINS.mesures, 'sentinelle.jsonl');
  const anciennes = lignesRegistre(registreChemin).filter((l) => l.date !== date);
  const precedente = anciennes.length ? anciennes[anciennes.length - 1] : null;
  const ligne = ligneCompacte(verdict, { baselinesPosees: baselinesPosees.length, indexnow: envoiIndexNow.statut, commit: commitDeploye, couverture });
  mkdirSync(join(root, CHEMINS.mesures), { recursive: true });
  writeFileSync(registreChemin, [...anciennes, ligne].map((l) => JSON.stringify(l)).join('\n') + '\n');
  const sansDate = ({ date: _d, commit: _c, baselinesPosees: _b, ...reste }) => JSON.stringify(reste);
  const aCommiter = verdict.rouges.length > 0 || !precedente || sansDate(precedente) !== sansDate(ligne);

  return {
    ok: true,
    code: !couverture.complete ? 1 : verdict.rouges.length ? 2 : 0,
    couverture,
    historique: { sources: historique.sources },
    date,
    commitDeploye,
    resume: verdict.resume,
    rouges: verdict.rouges,
    avertissements: verdict.avertissements,
    infos: verdict.infos,
    actions: { ...verdict.actions, baselinesPosees, indexnow: envoiIndexNow },
    messages,
    aCommiter,
    fichiers: { brut: join(CHEMINS.brut, 'sentinelle', `${date}.json`), registre: join(CHEMINS.mesures, 'sentinelle.jsonl'), etat: join(CHEMINS.brut, 'etat-sentinelle.json') },
  };
}

function afficher(resultat, json) {
  if (json) {
    console.log(JSON.stringify(resultat, null, 2));
    return;
  }
  if (!resultat.ok) {
    console.log(`SENTINELLE ${resultat.message}`);
    return;
  }
  const r = resultat.resume;
  console.log(`SENTINELLE ${resultat.date} · ${r.urls} URL · ${r.indexees} indexées · ${r.enAttente} en attente · ${resultat.rouges.length} rouge(s) · ${resultat.avertissements.length} avertissement(s) · commit ${resultat.commitDeploye ?? '?'}`);
  for (const x of resultat.rouges) console.log(`  ROUGE ${x.code} ${x.url ?? ''} : ${x.message}`);
  for (const x of resultat.avertissements) console.log(`  avertissement ${x.code} ${x.url ?? ''} : ${x.message}`);
  for (const x of resultat.infos) console.log(`  info ${x.code} ${x.url ?? ''} : ${x.message}`);
  if (resultat.actions.demanderIndexation.length) console.log(`  À DEMANDER dans Search Console (action de Kevin) : ${resultat.actions.demanderIndexation.join(', ')}`);
  console.log(`  IndexNow : ${resultat.actions.indexnow.statut}${resultat.actions.indexnow.message ? ` (${resultat.actions.indexnow.message})` : ''} · baselines posées : ${resultat.actions.baselinesPosees.length}`);
  for (const m of resultat.messages) console.log(`  note : ${m}`);
  console.log(`  à commiter : ${resultat.aCommiter ? 'oui' : 'non'} · brut : ${resultat.fichiers.brut} · registre : ${resultat.fichiers.registre}`);
}

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const o = options(process.argv.slice(2));
  const resultat = await sentinelle({ date: o.date ?? dateLocale(), sansDerive: o.sansDerive, sansIndexnow: o.sansIndexnow });
  afficher(resultat, o.json);
  process.exitCode = resultat.ok ? resultat.code : 1;
}
