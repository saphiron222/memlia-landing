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
import { ORIGINE, autocompleterGoogle, backlinksDataForSeo, chatGptRechercheDataForSeo, chercherPage, journaliserCout, porteDeCout, referentsCloudflare, serpDataForSeo } from '../lib/seo-instruments.mjs';
import { analyserSerp } from '../lib/seo-regles.mjs';
import { conserverMesureValide, detecterAutorite, estRefusPaiementDataForSeo, lireAccesRobots, lireBacklinks, lireReferents, lireTacheIaAncree, validerEchantillonIa } from '../lib/seo-autorite.mjs';

const DOMAINE = 'memlia.fr';
const MARQUE = 'memlia';
const DEPART = '2026-09';
const COMPTE_CLOUDFLARE = '063970336833bc239dbe83778a7fea26'; // Premier relevé : l'âge du site sert à juger un zéro.
const DOSSIER = 'docs/strategy/site-v3/mesures';
const ECHANTILLON_IA = `${DOSSIER}/echantillon-ia.json`;
const ENDPOINT_BACKLINKS = 'backlinks_summary';
const ENDPOINT_IA = 'ai_optimization_chat_gpt_scraper';
const ENDPOINT_SERP = 'serp_organic_live_advanced';
const CRAWLERS_IA = Object.freeze([
  { userAgent: 'OAI-SearchBot', capacite: 'citation ChatGPT Search' },
  { userAgent: 'GPTBot', capacite: 'entraînement OpenAI' },
  { userAgent: 'Claude-SearchBot', capacite: 'citation Claude Search' },
  { userAgent: 'ClaudeBot', capacite: 'entraînement Anthropic' },
  { userAgent: 'PerplexityBot', capacite: 'citation Perplexity' },
  { userAgent: 'Googlebot', capacite: 'Google Search et AI Overviews' },
  { userAgent: 'Google-Extended', capacite: 'entraînement et grounding Gemini, pas Google Search' },
  { userAgent: 'Applebot', capacite: 'Siri, Spotlight et Safari' },
  { userAgent: 'Applebot-Extended', capacite: 'préférence d’entraînement Apple Intelligence' },
  { userAgent: 'CCBot', capacite: 'jeu Common Crawl' },
  { userAgent: 'Bytespider', capacite: 'entraînement ByteDance' },
]);

export const dateParis = (d = new Date()) => d.toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
export const repereParis = (d = new Date()) => {
  const jour = dateParis(d);
  const [annee, mois, numeroJour] = jour.split('-');
  const moisReleve = `${annee}-${mois}`;
  return {
    mois: moisReleve,
    jour,
    jourFrancais: `${numeroJour}/${mois}/${annee}`,
    chemin: `${DOSSIER}/mois-${moisReleve}-autorite.json`,
  };
};
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

export async function relever(root, { mois, sansIa = false, budget = 0.6, instant = new Date() } = {}) {
  const repere = repereParis(instant);
  const moisReleve = mois ?? repere.mois;
  const cheminReleve = mois ? `${DOSSIER}/mois-${moisReleve}-autorite.json` : repere.chemin;
  mkdirSync(join(root, DOSSIER), { recursive: true });
  const releveExistant = lireJson(join(root, cheminReleve), null);
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
  if (autorite.erreur && releveExistant?.autorite && !releveExistant.autorite.erreur) {
    const erreurDerniereTentative = autorite.erreur;
    autorite = conserverMesureValide(autorite, releveExistant.autorite, releveExistant.jour);
    exclusions.push(`profil de liens conservé au ${autorite.mesureeLe} : la tentative courante a échoué (${erreurDerniereTentative})`);
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
  if (entite.erreur && releveExistant?.entite && !releveExistant.entite.erreur) {
    const erreurDerniereTentative = entite.erreur;
    Object.assign(entite, conserverMesureValide(entite, releveExistant.entite, releveExistant.jour));
    exclusions.push(`entité conservée au ${entite.mesureeLe} : la tentative courante a échoué (${erreurDerniereTentative})`);
  }

  // 3. Visibilité IA ancrée. La notoriété non ancrée du 19/09 reste dans le relevé comme témoin
  // historique, mais ne partage ni le dénominateur ni le verdict de cette vraie recherche.
  const historiqueNonAncre = releveExistant?.ia?.historiqueNonAncre
    ?? (releveExistant?.ia?.avecRecherche === 0 ? {
      mesureeLe: releveExistant.jour,
      instrument: 'chatgpt-llm-responses-sans-recherche',
      requetes: releveExistant.ia.requetes,
      nomme: releveExistant.ia.nomme,
      citations: null,
      detail: releveExistant.ia.detail,
      lecture: "notoriété seulement : l'absence de citation n'était pas mesurée",
    } : null);
  const ia = {
    instrument: 'dataforseo-chatgpt-search-scraper-force-web-search',
    typeMesure: 'citation-ancree',
    echantillon: ECHANTILLON_IA,
    requetes: 0,
    avecRecherche: 0,
    citations: 0,
    nomme: 0,
    domainesCites: [],
    detail: [],
    erreur: null,
    historiqueNonAncre,
  };
  let porteIa = { ok: false, porte: sansIa ? 'desactivee' : 'non-demandee', couvertPar: null };
  if (sansIa) exclusions.push('visibilité IA non relevée : désactivée par option');
  else {
    const documentEchantillon = lireJson(join(root, ECHANTILLON_IA), null);
    const echantillon = validerEchantillonIa(documentEchantillon, { date: repere.jour });
    if (!echantillon.ok) {
      ia.erreur = echantillon.erreur;
      exclusions.push(`citations IA non relevées : ${echantillon.erreur} (${ECHANTILLON_IA})`);
    }
    porteIa = echantillon.ok ? autorise(ENDPOINT_IA, echantillon.questions.length, budget, depenses, exclusions) : porteIa;
    if (porteIa.ok) {
      for (const item of echantillon.questions) {
        const requete = item.question;
        const r = await chatGptRechercheDataForSeo(requete);
        if (!r.ok) {
          ia.detail.push({ requete, origine: item.origine, source: item.source, routeCandidate: item.routeCandidate, intention: item.intention ?? null, erreur: r.erreur });
          if (estRefusPaiementDataForSeo(r.erreur)) {
            ia.erreur = `DataForSEO refuse la mesure : ${r.erreur}`;
            exclusions.push('citations IA non relevées : DataForSEO refuse le paiement, arrêt après le premier refus pour ne pas multiplier les appels inutiles');
            break;
          }
          continue;
        }
        const lu = lireTacheIaAncree(r.reponse?.tasks?.[0], { domaine: DOMAINE });
        compter(ENDPOINT_IA, lu.cout);
        if (!lu.ok) {
          ia.detail.push({ requete, origine: item.origine, source: item.source, routeCandidate: item.routeCandidate, intention: item.intention ?? null, erreur: lu.erreur });
          if (estRefusPaiementDataForSeo(lu.erreur)) {
            ia.erreur = `DataForSEO refuse la mesure : ${lu.erreur}`;
            exclusions.push('citations IA non relevées : DataForSEO refuse le paiement dans la tâche, arrêt après le premier refus pour ne pas multiplier les appels inutiles');
            break;
          }
          continue;
        }
        ia.requetes += 1;
        if (lu.lecture.rechercheWeb) ia.avecRecherche += 1;
        if (lu.lecture.cite === true) ia.citations += 1;
        if (lu.lecture.nomme) ia.nomme += 1;
        for (const domaine of lu.lecture.domainesCites) {
          const ligne = ia.domainesCites.find((d) => d.domaine === domaine);
          if (ligne) ligne.citations += 1;
          else ia.domainesCites.push({ domaine, citations: 1 });
        }
        ia.detail.push({
          requete,
          origine: item.origine,
          source: item.source,
          routeCandidate: item.routeCandidate,
          intention: item.intention ?? null,
          rechercheWeb: lu.lecture.rechercheWeb,
          cite: lu.lecture.cite,
          nomme: lu.lecture.nomme,
          domainesCites: lu.lecture.domainesCites,
          pagesCitees: lu.lecture.pagesCitees,
        });
      }
      ia.domainesCites.sort((a, b) => b.citations - a.citations || a.domaine.localeCompare(b.domaine, 'fr'));
    }
  }

  // L'endpoint forcé qui n'aboutit jamais n'est pas transformé en zéro de visibilité.
  if (!sansIa && ia.requetes > 0 && ia.avecRecherche === 0) {
    exclusions.push(`citations IA non mesurées : aucune des ${ia.requetes} réponses n'a prouvé une recherche web forcée`);
  }

  // 4. Lisibilité machine : règles robots réellement servies et indexabilité HTTP, par capacité.
  const lisibiliteMachine = { mesureeLe: instant.toISOString(), crawlers: [], llmsTxt: null };
  for (const crawler of CRAWLERS_IA) {
    const suffixe = `${moisReleve}-${crawler.userAgent.toLowerCase()}`;
    const [robots, page] = await Promise.all([
      chercherPage(`${ORIGINE}/robots.txt?mesure-ia=${suffixe}`, { ua: crawler.userAgent, timeoutMs: 20_000 }),
      chercherPage(`${ORIGINE}/?mesure-ia=${suffixe}`, { ua: crawler.userAgent, timeoutMs: 20_000 }),
    ]);
    const acces = robots.ok ? lireAccesRobots(robots.corps, { userAgent: crawler.userAgent, chemin: '/' }) : { autorise: null, groupe: null, regle: null };
    lisibiliteMachine.crawlers.push({
      ...crawler,
      robotsHttp: robots.status,
      pageHttp: page.status,
      autoriseRobots: acces.autorise,
      groupeRobots: acces.groupe,
      regleRobots: acces.regle,
      xRobotsTag: page.xRobotsTag,
      indexableHttp: page.status === 200 && !/\bnoindex\b/i.test(page.xRobotsTag ?? ''),
      erreur: robots.erreur || page.erreur || null,
    });
  }
  const llms = await chercherPage(`${ORIGINE}/llms.txt?mesure-ia=${moisReleve}`, { timeoutMs: 20_000 });
  lisibiliteMachine.llmsTxt = {
    existe: llms.status === 200,
    http: llms.status,
    octets: Buffer.byteLength(llms.corps ?? '', 'utf8'),
    xRobotsTag: llms.xRobotsTag,
    effetCitationMesure: null,
    conclusion: 'présence mesurée seulement : aucun effet de citation attribuable ; Google Search ignore llms.txt',
    erreur: llms.erreur,
  };

  // 5. Audience : d'où viennent les visites, et notamment celles envoyées par un assistant.
  // Gratuit, mais il faut le jeton ; sans lui, on l'écrit au lieu de compter zéro visite.
  let audience = { ok: false, erreur: 'non relevée', visites: null, directes: null, assistants: [], visitesAssistants: null, hotes: [] };
  const finMois = new Date(instant);
  const debutMois = new Date(finMois.getTime() - 30 * 24 * 3600 * 1000);
  const ref = await referentsCloudflare({ compte: COMPTE_CLOUDFLARE, depuis: debutMois.toISOString(), jusqu: finMois.toISOString() });
  if (!ref.ok) {
    audience.erreur = ref.erreur;
    exclusions.push(`référents d'audience non relevés : ${ref.erreur}`);
  } else {
    audience = lireReferents(ref.reponse, { hoteSite: 'memlia.fr' });
    if (!audience.ok) exclusions.push(`référents d'audience non lus : ${audience.erreur}`);
  }

  const precedent = lireJson(join(root, DOSSIER, `mois-${moisPrecedent(moisReleve)}-autorite.json`), null);
  const detection = detecterAutorite({ mois: moisReleve, autorite, entite, ia, precedent, moisDepuisDepart: moisEcoules(DEPART, moisReleve) });
  const releve = { mois: moisReleve, jour: repere.jour, autorite, entite, ia, lisibiliteMachine, audience, depenses, budget, portes: { liens: porteLiens, serp: porteSerp, ia: porteIa }, exclusions, ...detection };
  ecrireJson(join(root, cheminReleve), releve);
  return releve;
}

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const argv = process.argv.slice(2);
  const o = { sansIa: argv.includes('--sans-ia'), budget: 0.6 };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--budget') o.budget = Number(argv[++i]);
    else if (argv[i] === '--mois') o.mois = argv[++i];
  }
  if (argv[0] !== 'relever') { console.error('usage : autorite.mjs relever [--sans-ia] [--budget N] [--mois AAAA-MM]'); process.exit(2); }
  const r = await relever(process.cwd(), o);
  console.log(`autorité ${r.mois} : rang ${r.autorite.rang ?? 'ND'}, ${r.autorite.domainesReferents ?? 'ND'} domaines référents ; marque ${r.entite.spell ? `réécrite en « ${r.entite.spell.mot} »` : 'non réécrite'}, rang ${r.entite.rangMarque ?? 'hors top'} ; IA ${r.ia.avecRecherche === 0 ? `citations non mesurées (0 recherche web sur ${r.ia.requetes} requêtes), marque nommée ${r.ia.nomme} fois` : `${r.ia.citations}/${r.ia.avecRecherche} citations`} ; ${r.depenses.total} $`);
  console.log(`  audience : ${r.audience.ok ? `${r.audience.chargements} chargements vus par la balise sur 30 jours (dont ${r.audience.directes} sans référent et ${r.audience.internes} de navigation interne — ce total inclut nos propres passages, ce n'est pas une audience) ; référents externes : ${r.audience.externes.length ? r.audience.externes.map((h) => `${h.hote} ${h.visites}`).join(', ') : 'aucun'} ; venues d'un assistant : ${r.audience.visitesAssistants} (plancher)` : `non relevée — ${r.audience.erreur}`}`);
  for (const x of r.rouges) console.log(`  ROUGE ${x.code} : ${x.motif} (${x.mesure})`);
  for (const x of r.avertissements) console.log(`  avertissement ${x.code} : ${x.motif} (${x.mesure})`);
  for (const x of r.infos) console.log(`  info ${x}`);
  for (const x of r.exclusions) console.log(`  exclusion ${x}`);
}
