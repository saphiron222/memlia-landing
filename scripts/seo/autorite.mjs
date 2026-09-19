#!/usr/bin/env node
/**
 * C4 — autorité, entité et visibilité IA (le 1er du mois).
 *
 *   node scripts/seo/autorite.mjs relever [--sans-ia] [--budget 0.60] [--mois AAAA-MM]
 *
 * Trois grandeurs, relevées puis comparées au mois précédent (règles pures dans
 * scripts/lib/seo-autorite.mjs) : l'autorité (profil de liens entrants), l'entité (le moteur
 * sait-il qui nous sommes : réécriture de la marque, rang sur son propre nom, autocomplétion)
 * et la visibilité IA (un assistant nous cite-t-il sur les requêtes de tête de famille).
 *
 * Le coût. Chaque appel payant passe par la porte de coût du poste de travail. Deux des mesures
 * IA y sont au-dessus du seuil d'approbation automatique : elles ne s'exécutent que si un
 * --budget explicite les couvre, et ce dépassement est ÉCRIT dans le relevé, avec le verdict
 * qu'avait rendu la porte. C'est l'autorisation de Kevin du 19/09/2026 (décision D2, environ
 * 0,40 $ par mois), rendue vérifiable plutôt que silencieuse.
 *
 * Écrit docs/strategy/site-v3/mesures/mois-<AAAA-MM>-autorite.json. Ne publie rien, ne pousse rien.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { autocompleterGoogle, backlinksDataForSeo, chatGptDataForSeo, journaliserCout, porteDeCout, referentsCloudflare, serpDataForSeo } from '../lib/seo-instruments.mjs';
import { analyserSerp } from '../lib/seo-regles.mjs';
import { detecterAutorite, lireBacklinks, lireReferents, lireTacheIa } from '../lib/seo-autorite.mjs';

const DOMAINE = 'memlia.fr';
const MARQUE = 'memlia';
const DEPART = '2026-09';
const COMPTE_CLOUDFLARE = '063970336833bc239dbe83778a7fea26'; // Premier relevé : l'âge du site sert à juger un zéro.
const DOSSIER = 'docs/strategy/site-v3/mesures';
const ENDPOINT_BACKLINKS = 'backlinks_summary';
const ENDPOINT_IA = 'ai_optimization_chat_gpt_scraper';
/** Le modèle interrogé ; sans lui l'interface refuse l'appel (mesuré le 19/09/2026 : 40501). */
const MODELE_IA = 'gpt-4o-mini';
const ENDPOINT_SERP = 'serp_organic_live_advanced';
const REQUETES_IA = [
  'automatisation cabinet comptable',
  'ia expert comptable',
  'manuel de procédures cabinet expertise comptable',
  'crm dsn',
  'automatisation saisie comptable',
  'cabinet comptable surcharge de travail',
];

const moisCourant = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const moisEcoules = (depuis, jusqu) => {
  const [a1, m1] = depuis.split('-').map(Number);
  const [a2, m2] = jusqu.split('-').map(Number);
  return (a2 - a1) * 12 + (m2 - m1);
};
const lireJson = (chemin, defaut) => (existsSync(chemin) ? JSON.parse(readFileSync(chemin, 'utf8')) : defaut);
const ecrireJson = (chemin, valeur) => writeFileSync(chemin, `${JSON.stringify(valeur, null, 2)}\n`);
const moisPrecedent = (mois) => {
  const [a, m] = mois.split('-').map(Number);
  return m === 1 ? `${a - 1}-12` : `${a}-${String(m - 1).padStart(2, '0')}`;
};

/** La porte de coût, et le budget explicite qui peut la couvrir : les deux verdicts sont écrits. */
function autorise(endpoint, nombre, budget, depenses, exclusions) {
  const porte = porteDeCout(endpoint, nombre);
  if (porte.statut === 'approved') return { ok: true, porte: porte.statut, couvertPar: 'porte' };
  const prevu = Number(porte.coutPrevu ?? 0);
  if (porte.statut === 'needs_approval' && budget > 0 && depenses.total + prevu <= budget) {
    return { ok: true, porte: porte.statut, couvertPar: `budget explicite (${budget} $, décision D2 du 19/09/2026)` };
  }
  exclusions.push(`${endpoint} non relevé : porte de coût ${porte.statut} (${porte.coutPrevu ?? '?'} $ prévus) et budget ${budget} $ insuffisant`);
  return { ok: false, porte: porte.statut, couvertPar: null };
}

export async function relever(root, { mois = moisCourant(), sansIa = false, budget = 0.6 } = {}) {
  mkdirSync(join(root, DOSSIER), { recursive: true });
  const exclusions = [];
  const depenses = { total: 0, parEndpoint: {} };
  const compter = (endpoint, cout) => {
    const c = Number(cout ?? 0);
    if (c <= 0) return;
    depenses.total = Number((depenses.total + c).toFixed(4));
    depenses.parEndpoint[endpoint] = Number(((depenses.parEndpoint[endpoint] ?? 0) + c).toFixed(4));
    journaliserCout(endpoint, c);
  };

  // 1. Autorité
  let autorite = { rang: null, liens: null, domainesReferents: null, domainesPrincipaux: null, liensCasses: null, erreur: null };
  const porteLiens = autorise(ENDPOINT_BACKLINKS, 1, budget, depenses, exclusions);
  if (porteLiens.ok) {
    const r = await backlinksDataForSeo(DOMAINE);
    if (!r.ok) { autorite.erreur = r.erreur; exclusions.push(`profil de liens non relevé : ${r.erreur}`); }
    else {
      const lu = lireBacklinks(r.reponse);
      compter(ENDPOINT_BACKLINKS, lu.cout);
      if (lu.ok) autorite = { ...lu.resume, erreur: null };
      else { autorite.erreur = lu.erreur; exclusions.push(`profil de liens refusé : ${lu.erreur}`); }
    }
  }

  // 2. Entité
  const entite = { spell: null, rangMarque: null, suggestions: 0, erreur: null };
  const ac = await autocompleterGoogle(MARQUE);
  entite.suggestions = ac.ok ? ac.suggestions.length : null;
  if (!ac.ok) exclusions.push(`autocomplétion de la marque non relevée : ${ac.erreur}`);
  const porteSerp = autorise(ENDPOINT_SERP, 1, budget, depenses, exclusions);
  if (porteSerp.ok) {
    const r = await serpDataForSeo(MARQUE);
    compter(ENDPOINT_SERP, r.cout);
    if (r.ok) {
      const s = analyserSerp(r.resultat, { domaine: DOMAINE });
      entite.spell = s.spell;
      entite.rangMarque = s.rangMemlia;
    } else { entite.erreur = r.erreur; exclusions.push(`page de résultats de la marque non relevée : ${r.erreur}`); }
  }

  // 3. Visibilité IA
  const ia = { requetes: 0, avecRecherche: 0, citations: 0, nomme: 0, detail: [], erreur: null };
  if (sansIa) exclusions.push('visibilité IA non relevée : désactivée par option');
  else {
    const porteIa = autorise(ENDPOINT_IA, REQUETES_IA.length, budget, depenses, exclusions);
    if (porteIa.ok) {
      for (const requete of REQUETES_IA) {
        const r = await chatGptDataForSeo(requete, { modele: MODELE_IA });
        if (!r.ok) { ia.detail.push({ requete, erreur: r.erreur }); continue; }
        const lu = lireTacheIa(r.reponse?.tasks?.[0], { domaine: DOMAINE });
        compter(ENDPOINT_IA, lu.cout);
        if (!lu.ok) { ia.detail.push({ requete, erreur: lu.erreur }); continue; }
        ia.requetes += 1;
        if (lu.lecture.rechercheWeb) ia.avecRecherche += 1;
        if (lu.lecture.cite === true) ia.citations += 1;
        if (lu.lecture.nomme) ia.nomme += 1;
        ia.detail.push({ requete, rechercheWeb: lu.lecture.rechercheWeb, cite: lu.lecture.cite, nomme: lu.lecture.nomme, domainesCites: lu.lecture.domainesCites.slice(0, 8) });
      }
    }
  }

  // Sans recherche web, la citation n'est pas mesurée : on l'écrit au lieu de compter un zéro.
  if (!sansIa && ia.requetes > 0 && ia.avecRecherche === 0) {
    exclusions.push(`citations IA non mesurées : l'interface a répondu sans recherche web sur les ${ia.requetes} requêtes (relevé du 19/09/2026 : web_search rendu à false quel que soit le paramètre) ; seul « la marque est nommée » est mesuré`);
  }

  // 4. Audience : d'où viennent les visites, et notamment celles envoyées par un assistant.
  // Gratuit, mais il faut le jeton ; sans lui, on l'écrit au lieu de compter zéro visite.
  let audience = { ok: false, erreur: 'non relevée', visites: null, directes: null, assistants: [], visitesAssistants: null, hotes: [] };
  const finMois = new Date();
  const debutMois = new Date(finMois.getTime() - 30 * 24 * 3600 * 1000);
  const ref = await referentsCloudflare({ compte: COMPTE_CLOUDFLARE, depuis: debutMois.toISOString(), jusqu: finMois.toISOString() });
  if (!ref.ok) {
    audience.erreur = ref.erreur;
    exclusions.push(`référents d'audience non relevés : ${ref.erreur}`);
  } else {
    audience = lireReferents(ref.reponse);
    if (!audience.ok) exclusions.push(`référents d'audience non lus : ${audience.erreur}`);
  }

  const precedent = lireJson(join(root, DOSSIER, `mois-${moisPrecedent(mois)}-autorite.json`), null);
  const detection = detecterAutorite({ mois, autorite, entite, ia, precedent, moisDepuisDepart: moisEcoules(DEPART, mois) });
  const releve = { mois, jour: new Date().toISOString().slice(0, 10), autorite, entite, ia, audience, depenses, budget, portes: { liens: porteLiens, serp: porteSerp }, exclusions, ...detection };
  ecrireJson(join(root, DOSSIER, `mois-${mois}-autorite.json`), releve);
  return releve;
}

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const argv = process.argv.slice(2);
  const o = { sansIa: argv.includes('--sans-ia'), budget: 0.6, mois: moisCourant() };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--budget') o.budget = Number(argv[++i]);
    else if (argv[i] === '--mois') o.mois = argv[++i];
  }
  if (argv[0] !== 'relever') { console.error('usage : autorite.mjs relever [--sans-ia] [--budget N] [--mois AAAA-MM]'); process.exit(2); }
  const r = await relever(process.cwd(), o);
  console.log(`autorité ${r.mois} : rang ${r.autorite.rang ?? 'ND'}, ${r.autorite.domainesReferents ?? 'ND'} domaines référents ; marque ${r.entite.spell ? `réécrite en « ${r.entite.spell.mot} »` : 'non réécrite'}, rang ${r.entite.rangMarque ?? 'hors top'} ; IA ${r.ia.avecRecherche === 0 ? `citations non mesurées (0 recherche web sur ${r.ia.requetes} requêtes), marque nommée ${r.ia.nomme} fois` : `${r.ia.citations}/${r.ia.avecRecherche} citations`} ; ${r.depenses.total} $`);
  console.log(`  audience : ${r.audience.ok ? `${r.audience.visites} visites sur 30 jours, dont ${r.audience.directes} directes et ${r.audience.visitesAssistants} venues d'un assistant (plancher : la plupart arrivent sans référent)` : `non relevée — ${r.audience.erreur}`}`);
  for (const x of r.rouges) console.log(`  ROUGE ${x.code} : ${x.motif} (${x.mesure})`);
  for (const x of r.avertissements) console.log(`  avertissement ${x.code} : ${x.motif} (${x.mesure})`);
  for (const x of r.infos) console.log(`  info ${x}`);
  for (const x of r.exclusions) console.log(`  exclusion ${x}`);
}
