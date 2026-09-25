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
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { CHEMINS, ecrireJson, lireJson } from '../lib/seo-registres.mjs';
import { SEUILS, fenetres, jugerIndexation } from '../lib/seo-regles.mjs';
import { publicationAlerts } from '../lib/blog-publication-watch.mjs';
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

export async function sentinelle({ root = process.cwd(), date = dateLocale(), sansDerive = false, sansIndexnow = false } = {}) {
  const messages = [];
  const etatChemin = join(root, CHEMINS.brut, 'etat-sentinelle.json');
  const etat = lireJson(etatChemin, etatVide);

  const sitemap = await sitemapProduction();
  if (!sitemap.ok || sitemap.urls.length === 0) {
    return { ok: false, code: 1, message: `sitemap de production illisible (HTTP ${sitemap.status}${sitemap.erreur ? `, ${sitemap.erreur}` : ''})` };
  }
  const urls = sitemap.urls;
  const calendrier = readFileSync(join(root, 'docs/strategy/site-v3/CONTENT-CALENDAR.md'), 'utf8');
  const heureParis = new Date().toLocaleTimeString('en-GB', { timeZone: 'Europe/Paris', hour12: false });
  const publication = publicationAlerts({ calendar: calendrier, date, urls, previous: etat.publicationMissing ?? [], afterSlot: date === dateLocale() && heureParis >= '18:30' });

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
    const premier = await chercherPage(v, { suivre: false, timeoutMs: 15_000 });
    const final = await chercherPage(v, { suivre: true, timeoutMs: 15_000 });
    const impressions28j = lignesPages.filter((l) => String(l.keys?.[0] ?? '').startsWith(v.replace(/\/$/, ''))).reduce((t, l) => t + Number(l.impressions ?? 0), 0);
    variantes.push({ url: v, status: premier.status, location: premier.location, finalUrl: final.finalUrl, redirections: final.redirections, impressions28j, erreur: premier.erreur ?? final.erreur });
  }

  const commitDeploye = commitDistant(root);
  const derive = [];
  if (!sansDerive) {
    for (const url of urls) {
      const base = etat.baselines[url];
      if (!base) derive.push({ url, statut: 'sans-baseline' });
      else derive.push(deriveComparer(url, { commitBaseline: base.commit ?? null }));
    }
  }

  const indexabilite = indexabiliteProduction(root);

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
  etat.publicationMissing = publication.current;
  ecrireJson(etatChemin, etat);

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
    publication,
    baselinesPosees,
    indexnow: envoiIndexNow,
    messages,
  };
  ecrireJson(join(root, CHEMINS.brut, 'sentinelle', `${date}.json`), brut);

  const registreChemin = join(root, CHEMINS.mesures, 'sentinelle.jsonl');
  const anciennes = lignesRegistre(registreChemin).filter((l) => l.date !== date);
  const precedente = anciennes.length ? anciennes[anciennes.length - 1] : null;
  const ligne = ligneCompacte(verdict, { baselinesPosees: baselinesPosees.length, indexnow: envoiIndexNow.statut, commit: commitDeploye });
  ligne.publicationMissing = publication.current.map((x) => x.slug);
  mkdirSync(join(root, CHEMINS.mesures), { recursive: true });
  writeFileSync(registreChemin, [...anciennes, ligne].map((l) => JSON.stringify(l)).join('\n') + '\n');
  const sansDate = ({ date: _d, commit: _c, baselinesPosees: _b, ...reste }) => JSON.stringify(reste);
  const aCommiter = verdict.rouges.length > 0 || publication.newAlerts.length > 0 || !precedente || sansDate(precedente) !== sansDate(ligne);

  return {
    ok: true,
    code: verdict.rouges.length || publication.newAlerts.length ? 2 : 0,
    date,
    commitDeploye,
    resume: verdict.resume,
    rouges: verdict.rouges,
    publication,
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
  for (const x of resultat.publication.newAlerts) console.log(`  [CRON_FAILURE] publication à vérifier : ${x.message}`);
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
