#!/usr/bin/env node
/**
 * Le relevé des questions — le backlog éditorial recalé sur la demande mesurée (19/09/2026).
 *
 *   node scripts/seo/questions.mjs relever [--sans-serp] [--max-serp 62] [--jour AAAA-MM-JJ]
 *   node scripts/seo/questions.mjs recaler [--jour AAAA-MM-JJ]
 *   node scripts/seo/questions.mjs rapport [--jour AAAA-MM-JJ]
 *
 * `relever` autocomplète chaque requête primaire et secondaire du backlog (instrument gratuit, mis en
 * cache par jour dans mesures/autocompletion-cache.json ; une panne n'est jamais comptée comme zéro),
 * puis relève une page de résultats DataForSEO par famille (l'amorce la plus suggérée) et pour chaque
 * amorce de marché de mesures/amorces-marche.json, derrière la porte de coût `serp_organic_live_advanced`.
 * Il écrit mesures/questions-<jour>.json. `recaler` pose la priorité et le bloc `demande` de chaque angle
 * du backlog depuis ce relevé (règle dans scripts/lib/seo-questions.mjs) ; le calendrier se régénère
 * ensuite par `python3 docs/strategy/site-v3/build-cluster-plan.py --check`, dont un invariant refuse
 * un angle de priorité 1 sans demande mesurée. `rapport` écrit mesures/questions-<jour>.md, la lecture
 * par famille qui sert à corriger les angles à la main. Aucune écriture hors de ces trois fichiers.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { autocompleterGoogle, journaliserCout, porteDeCout, serpDataForSeo } from '../lib/seo-instruments.mjs';
import { extraireQuestionsSerp } from '../lib/seo-regles.mjs';
import { amorcesDuBacklog, amorcesSerpParFamille, fusionnerReleve, rapportRecalage, recalerBacklog } from '../lib/seo-questions.mjs';

const ENDPOINT_SERP = 'serp_organic_live_advanced';
const CHEMIN_BACKLOG = 'docs/strategy/site-v3/backlog-v3.json';
const DOSSIER_MESURES = 'docs/strategy/site-v3/mesures';
const CHEMIN_CACHE = `${DOSSIER_MESURES}/autocompletion-cache.json`;
const CHEMIN_AMORCES_MARCHE = `${DOSSIER_MESURES}/amorces-marche.json`;
const DELAI_ENTRE_APPELS_MS = 150;
const PANNES_CONSECUTIVES_MAX = 5;
const MAX_SERP_DEFAUT = 62;

const dateLocale = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));
const lireJson = (chemin, defaut) => (existsSync(chemin) ? JSON.parse(readFileSync(chemin, 'utf8')) : defaut);
const ecrireJson = (chemin, valeur) => writeFileSync(chemin, `${JSON.stringify(valeur, null, 2)}\n`);

function options(argv) {
  const o = { sansSerp: false, maxSerp: MAX_SERP_DEFAUT, jour: null };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--sans-serp') o.sansSerp = true;
    else if (argv[i] === '--max-serp') o.maxSerp = Number(argv[++i]);
    else if (argv[i] === '--jour') o.jour = argv[++i];
    else throw new Error(`option inconnue : ${argv[i]}`);
  }
  return o;
}

function dernierReleve(root, jour) {
  const dossier = join(root, DOSSIER_MESURES);
  if (jour) return join(dossier, `questions-${jour}.json`);
  const fichiers = readdirSync(dossier).filter((f) => /^questions-\d{4}-\d{2}-\d{2}\.json$/.test(f)).sort();
  if (!fichiers.length) throw new Error(`aucun relevé questions-*.json dans ${DOSSIER_MESURES} : lancer relever d'abord`);
  return join(dossier, fichiers.at(-1));
}

export async function relever(root, { jour = dateLocale(), sansSerp = false, maxSerp = MAX_SERP_DEFAUT } = {}) {
  const backlog = lireJson(join(root, CHEMIN_BACKLOG), []);
  const marche = lireJson(join(root, CHEMIN_AMORCES_MARCHE), { amorces: [] }).amorces ?? [];
  const amorces = amorcesDuBacklog(backlog, marche);
  mkdirSync(join(root, DOSSIER_MESURES), { recursive: true });
  const cache = lireJson(join(root, CHEMIN_CACHE), {});
  const autocompletion = {};
  const pannes = [];
  const exclusions = [];
  let consecutives = 0;
  let appels = 0;
  for (const amorce of amorces) {
    if (cache[amorce]?.le === jour) { autocompletion[amorce] = cache[amorce].suggestions; continue; }
    const r = await autocompleterGoogle(amorce);
    appels += 1;
    if (r.ok) {
      autocompletion[amorce] = r.suggestions;
      cache[amorce] = { suggestions: r.suggestions, le: jour };
      consecutives = 0;
    } else {
      pannes.push({ amorce, erreur: r.erreur });
      consecutives += 1;
      if (consecutives >= PANNES_CONSECUTIVES_MAX) {
        exclusions.push(`autocomplétion interrompue après ${PANNES_CONSECUTIVES_MAX} pannes consécutives (${r.erreur}) : ${amorces.length - Object.keys(autocompletion).length - pannes.length} amorces non mesurées`);
        break;
      }
    }
    if (appels % 50 === 0) ecrireJson(join(root, CHEMIN_CACHE), cache);
    await dormir(DELAI_ENTRE_APPELS_MS);
  }
  ecrireJson(join(root, CHEMIN_CACHE), cache);

  const serp = {};
  let cout = 0;
  if (sansSerp) {
    exclusions.push('SERP non relevée : désactivée par option');
  } else {
    const cibles = [...amorcesSerpParFamille(backlog, autocompletion), ...marche.map((requete) => ({ famille: null, requete }))].slice(0, maxSerp);
    const porte = porteDeCout(ENDPOINT_SERP, cibles.length);
    if (porte.statut !== 'approved') {
      exclusions.push(`SERP non relevée, porte de coût DataForSEO : ${porte.statut} (${porte.coutPrevu ?? '?'} $ prévus pour ${cibles.length} appels, reste ${porte.resteJour ?? '?'} $ aujourd'hui)`);
    } else {
      for (const cible of cibles) {
        const r = await serpDataForSeo(cible.requete);
        cout += Number(r.cout ?? 0);
        if (!r.ok) { pannes.push({ amorce: cible.requete, erreur: `SERP : ${r.erreur}` }); continue; }
        serp[cible.requete] = { famille: cible.famille, ...extraireQuestionsSerp(r.resultat) };
      }
      cout = Number(cout.toFixed(4));
      if (cout > 0) journaliserCout(ENDPOINT_SERP, cout);
    }
  }
  const cheminReleve = join(root, DOSSIER_MESURES, `questions-${jour}.json`);
  const releve = fusionnerReleve(lireJson(cheminReleve, null), { jour, amorces: amorces.length, mesurees: Object.keys(autocompletion).length, avecSuggestions: Object.values(autocompletion).filter((s) => s.length > 0).length, pannes, autocompletion, serp, cout, exclusions });
  ecrireJson(cheminReleve, releve);
  return releve;
}

export function recaler(root, { jour = null } = {}) {
  const mesures = JSON.parse(readFileSync(dernierReleve(root, jour), 'utf8'));
  const avant = lireJson(join(root, CHEMIN_BACKLOG), []);
  const apres = recalerBacklog(avant, mesures);
  ecrireJson(join(root, CHEMIN_BACKLOG), apres);
  return { jour: mesures.jour, ...rapportRecalage(avant, apres) };
}

export function rapport(root, { jour = null } = {}) {
  const chemin = dernierReleve(root, jour);
  const m = JSON.parse(readFileSync(chemin, 'utf8'));
  const backlog = lireJson(join(root, CHEMIN_BACKLOG), []);
  const L = [`# Relevé des questions du ${m.jour}`, '', `Généré par \`scripts/seo/questions.mjs rapport\` depuis \`${chemin.replace(`${root}/`, '')}\` : ${m.amorces} amorces, ${m.mesurees} mesurées, ${m.avecSuggestions} avec au moins une suggestion, ${Object.keys(m.serp).length} pages de résultats (${m.cout} $), ${m.pannes.length} panne(s).`, ''];
  if (m.exclusions.length) L.push('Exclusions : ' + m.exclusions.join(' · '), '');
  const familles = [...new Set(backlog.filter((e) => e.format !== 'pillar-page').map((e) => e.famille))];
  for (const famille of familles) {
    L.push(`## ${famille}`, '');
    for (const e of backlog.filter((x) => x.famille === famille)) {
      const s = m.autocompletion[e.requete];
      L.push(`- **${e.slug}** (P${e.priorite}) — « ${e.requete} » → ${s === undefined ? 'non mesurée' : `${s.length} suggestion(s)${s.length ? ' : ' + s.slice(0, 6).join(' · ') : ''}`}`);
      for (const sec of e.secondaires ?? []) {
        const ss = m.autocompletion[sec];
        if (ss?.length) L.push(`  - secondaire « ${sec} » → ${ss.length} : ${ss.slice(0, 4).join(' · ')}`);
      }
    }
    const serps = Object.entries(m.serp).filter(([, v]) => v.famille === famille);
    for (const [requete, v] of serps) {
      L.push(`- SERP « ${requete} » : questions ${v.questions.length ? v.questions.map((q) => `« ${q} »`).join(', ') : 'aucune'} ; associées ${v.associees.length ? v.associees.join(' · ') : 'aucune'} ; haut de page ${v.domaines.slice(0, 5).join(', ') || 'vide'} ; aperçu IA ${v.apercuIa ? 'oui' : 'non'}${v.spell ? ` ; orthographe proposée « ${v.spell.mot} »` : ''}`);
    }
    L.push('');
  }
  const marche = Object.entries(m.serp).filter(([, v]) => !v.famille);
  if (marche.length) {
    L.push('## Amorces de marché', '');
    for (const [requete, v] of marche) L.push(`- « ${requete} » (${(m.autocompletion[requete] ?? []).length} suggestion(s)) : questions ${v.questions.length ? v.questions.map((q) => `« ${q} »`).join(', ') : 'aucune'} ; associées ${v.associees.join(' · ') || 'aucune'} ; haut de page ${v.domaines.slice(0, 5).join(', ') || 'vide'} ; aperçu IA ${v.apercuIa ? 'oui' : 'non'}`);
    L.push('');
  }
  const sortie = join(root, DOSSIER_MESURES, `questions-${m.jour}.md`);
  writeFileSync(sortie, `${L.join('\n')}\n`);
  return sortie;
}

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const [commande, ...reste] = process.argv.slice(2);
  const o = options(reste);
  const root = process.cwd();
  if (commande === 'relever') {
    const r = await relever(root, { jour: o.jour ?? dateLocale(), sansSerp: o.sansSerp, maxSerp: o.maxSerp });
    console.log(`relevé ${r.jour} : ${r.amorces} amorces, ${r.mesurees} mesurées, ${r.avecSuggestions} avec suggestions, ${Object.keys(r.serp).length} SERP (${r.cout} $), ${r.pannes.length} panne(s)${r.exclusions.length ? ' ; ' + r.exclusions.join(' ; ') : ''}`);
  } else if (commande === 'recaler') {
    const r = recaler(root, { jour: o.jour });
    console.log(`recalé sur le relevé du ${r.jour} : priorités avant ${JSON.stringify(r.avant)} → après ${JSON.stringify(r.apres)} ; ${r.mouvements.length} mouvement(s)`);
    for (const mv of r.mouvements) console.log(`  P${mv.de} → P${mv.vers}  ${mv.slug}  « ${mv.requete} »`);
  } else if (commande === 'rapport') {
    console.log(`rapport écrit : ${rapport(root, { jour: o.jour })}`);
  } else {
    console.error('usage : questions.mjs relever [--sans-serp] [--max-serp N] [--jour J] | recaler [--jour J] | rapport [--jour J]');
    process.exit(2);
  }
}
