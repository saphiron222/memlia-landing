#!/usr/bin/env node
/**
 * C2, le relevé de demande (docs/strategy/site-v3/CRONS-SEO.md §3, RUNBOOK-SEO.md).
 *
 *   node scripts/seo/releve-demande.mjs [--date AAAA-MM-JJ] [--sans-serp] [--json]
 *
 * Lit Search Console (lecture seule, fenêtres de 7 et 28 jours closes trois jours avant la date, et les
 * 28 jours précédents), la SERP DataForSEO de chaque requête du registre derrière la porte de coût, et la
 * page officielle des mises à jour de classement Google. Juge avec detecterDemande, dépose les tâches dans
 * la file de maintenance, réconcilie le registre des requêtes, et écrit l'instantané de la semaine dans
 * docs/strategy/site-v3/mesures/semaine-<AAAA-Www>-demande.json. Zéro est une mesure : l'instantané est
 * écrit même quand tout est à zéro. Code de sortie 0 ; 1 quand Search Console n'a pas répondu.
 */
import { join } from 'node:path';

import {
  CHEMINS,
  ajouterTache,
  articlesPublies,
  chargerMaintenance,
  chargerRegistre,
  chargerRequetesVues,
  ecrireJson,
  reconcilierRegistre,
  sauverMaintenance,
  sauverRegistre,
  sauverRequetesVues,
} from '../lib/seo-registres.mjs';
import { analyserSerp, detecterDemande, fenetres, semaineIso } from '../lib/seo-regles.mjs';
import { gscPy, journaliserCout, misesAJourGoogle, porteDeCout, serpDataForSeo } from '../lib/seo-instruments.mjs';

const ENDPOINT_SERP = 'serp_organic_live_advanced';
const dateLocale = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

/** Une erreur 401xx de DataForSEO (résultats partiels, erreur interne du moteur) est transitoire : une seule reprise. */
async function serpAvecReprise(requete) {
  const premier = await serpDataForSeo(requete);
  if (premier.ok || !/^401\d\d/.test(String(premier.erreur ?? ''))) return premier;
  await dormir(3000);
  const second = await serpDataForSeo(requete);
  return { ...second, cout: Number(second.cout ?? 0) + Number(premier.cout ?? 0), reprise: true };
}

function options(argv) {
  const o = { date: null, sansSerp: false, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--date') o.date = argv[++i];
    else if (argv[i] === '--sans-serp') o.sansSerp = true;
    else if (argv[i] === '--json') o.json = true;
    else throw new Error(`option inconnue : ${argv[i]}`);
  }
  if (o.date && !/^\d{4}-\d{2}-\d{2}$/.test(o.date)) throw new Error('--date attend AAAA-MM-JJ');
  return o;
}

export async function releveDemande({ root = process.cwd(), date = dateLocale(), sansSerp = false } = {}) {
  const messages = [];
  const exclusions = [];
  const f = fenetres({ aujourdhui: date });

  const publies = articlesPublies(root, { aujourdhui: date });
  const sansRequete = publies.filter((a) => !a.requete).map((a) => a.slug);
  let registre = chargerRegistre(root);
  const reconciliation = reconcilierRegistre(registre, publies.filter((a) => a.requete));
  if (reconciliation.ajoutes.length) {
    sauverRegistre(root, reconciliation.registre);
    registre = reconciliation.registre;
  }
  if (sansRequete.length) messages.push(`articles publiés sans requête connue, hors registre : ${sansRequete.join(', ')}`);

  const lire = (debut, fin, dimensions) => {
    const r = gscPy(root, 'analytics', ['--debut', debut, '--fin', fin, '--dimensions', dimensions]);
    if (!r.json || r.json.error) {
      messages.push(`Search Console ${dimensions} ${debut} → ${fin} : ${r.json?.error ?? (r.erreur || r.sortie).trim().slice(-160) ?? 'sans réponse'}`);
      return { rows: [], totals: null, complet: null, erreur: true };
    }
    return { rows: r.json.rows ?? [], totals: r.json.totals ?? null, complet: r.json.totals_complete ?? null, erreur: false };
  };
  const bloc = (fenetre) => {
    const pages = lire(fenetre.debut, fenetre.fin, 'page');
    const requetes = lire(fenetre.debut, fenetre.fin, 'query');
    const pagesRequetes = lire(fenetre.debut, fenetre.fin, 'page,query');
    return {
      pages: pages.rows,
      requetes: requetes.rows,
      pagesRequetes: pagesRequetes.rows,
      totaux: pages.totals,
      complet: pages.complet,
      erreur: pages.erreur || requetes.erreur || pagesRequetes.erreur,
    };
  };
  const semaine = bloc(f.semaine);
  const mois = bloc(f.mois);
  const precedent = lire(f.moisPrecedent.debut, f.moisPrecedent.fin, 'page');
  const moisPrecedent = { pages: precedent.rows, totaux: precedent.totals };
  const gscMuet = semaine.erreur && mois.erreur;
  if (mois.complet === false) exclusions.push('requêtes anonymisées par Google : la somme des lignes est inférieure aux totaux du site (totals_complete = false)');
  if (mois.requetes.length === 0 && (mois.totaux?.impressions ?? 0) > 0) exclusions.push(`aucune ligne de requête rendue alors que le site totalise ${mois.totaux.impressions} impressions sur 28 jours : requêtes sous le seuil d'anonymisation`);

  const detection = detecterDemande({ registre, gsc: { semaine, mois, moisPrecedent }, requetesVues: chargerRequetesVues(root), aujourdhui: date });
  sauverRequetesVues(root, detection.requetesVues);

  const serp = { joue: false, requetes: [], cout: 0, raison: null };
  if (sansSerp) {
    serp.raison = 'désactivée par option';
  } else {
    const cibles = [
      ...registre.articles.map((a) => ({ slug: a.slug, requete: a.requete })),
      ...(registre.marque ?? []).map((m) => ({ slug: null, requete: m })),
    ];
    const porte = porteDeCout(ENDPOINT_SERP, cibles.length);
    if (porte.statut !== 'approved') {
      serp.raison = `porte de coût DataForSEO : ${porte.statut} (${porte.coutPrevu ?? '?'} $ prévus, reste ${porte.resteJour ?? '?'} $ aujourd'hui)`;
      exclusions.push(`SERP non relevée, ${serp.raison}`);
    } else {
      serp.joue = true;
      for (const cible of cibles) {
        const r = await serpAvecReprise(cible.requete);
        serp.cout += Number(r.cout ?? 0);
        if (!r.ok) {
          serp.requetes.push({ slug: cible.slug, requete: cible.requete, erreur: r.erreur });
          continue;
        }
        serp.requetes.push({ slug: cible.slug, ...analyserSerp(r.resultat, { domaine: 'memlia.fr' }) });
      }
      serp.cout = Number(serp.cout.toFixed(4));
      if (serp.cout > 0) journaliserCout(ENDPOINT_SERP, serp.cout);
    }
  }

  const maj = await misesAJourGoogle();
  const misesAJour = { ok: maj.ok, erreur: maj.erreur, dansLaFenetre: maj.lignes.filter((l) => l.date >= f.moisPrecedent.debut) };

  let file = chargerMaintenance(root);
  let ajoutees = 0;
  let misesAJourTaches = 0;
  for (const t of detection.taches) {
    const r = ajouterTache(file, t, { aujourdhui: date });
    file = r.file;
    if (r.ajoutee) ajoutees += 1;
    else misesAJourTaches += 1;
  }
  if (detection.taches.length) sauverMaintenance(root, file);

  const alertes = [
    ...detection.chutes.map((c) => `chute ${c.slug ?? c.page} : ${c.avant} → ${c.apres} impressions`),
    ...detection.marque.filter((m) => m.statut === 'hors-rang-1' && m.impressions > 0).map((m) => `marque « ${m.requete} » en position ${m.position}`),
    ...detection.famillesSansImpression.map((fam) => `famille ${fam} sans impression après ${detection.parFamille.find((x) => x.famille === fam)?.articles ?? '?'} articles : réallocation à proposer`),
  ];

  const instantane = {
    date,
    semaine: semaineIso(date),
    fenetres: f,
    totaux: { semaine: semaine.totaux, mois: mois.totaux, moisPrecedent: moisPrecedent.totaux, complet28j: mois.complet },
    gscMuet,
    parArticle: detection.parArticle,
    horsRegistre: detection.horsRegistre,
    parFamille: detection.parFamille,
    famillesSansImpression: detection.famillesSansImpression,
    portee: detection.portee,
    ctr: detection.ctr,
    chutes: detection.chutes,
    nouvelles: detection.nouvelles,
    marque: detection.marque,
    serp,
    misesAJourGoogle: misesAJour,
    alertes,
    taches: { deposees: detection.taches.length, ajoutees, misesAJour: misesAJourTaches },
    registre: { total: registre.articles.length, ajoutes: reconciliation.ajoutes, sansRequete },
    exclusions,
    messages,
  };
  const fichier = join(CHEMINS.mesures, `semaine-${semaineIso(date)}-demande.json`);
  ecrireJson(join(root, fichier), instantane);
  return { ok: !gscMuet, code: gscMuet ? 1 : 0, fichier, ...instantane };
}

function afficher(r, json) {
  if (json) {
    console.log(JSON.stringify(r, null, 2));
    return;
  }
  const t = r.totaux;
  const fmt = (x) => (x ? `${x.impressions} impressions, ${x.clicks} clics` : 'sans réponse');
  console.log(`RELEVÉ DE DEMANDE ${r.date} (${r.semaine}) · semaine ${r.fenetres.semaine.debut} → ${r.fenetres.semaine.fin} : ${fmt(t.semaine)} · 28 jours : ${fmt(t.mois)} · 28 jours précédents : ${fmt(t.moisPrecedent)}${r.gscMuet ? ' · SEARCH CONSOLE MUETTE' : ''}`);
  for (const a of r.parArticle) console.log(`  ${a.slug} [${a.famille ?? '?'}] · 7 j ${a.impressions7}/${a.clics7} · 28 j ${a.impressions28}/${a.clics28}${a.position28 ? ` · pos ${a.position28}` : ''} · requêtes ${a.requetes.length}`);
  for (const h of r.horsRegistre) console.log(`  hors registre ${h.page} · 28 j ${h.impressions28}/${h.clics28}`);
  for (const fam of r.parFamille) console.log(`  famille ${fam.famille} · ${fam.articles} article(s) · ${fam.impressions28} impressions · ${fam.requetesAvecImpressions} requête(s)`);
  for (const m of r.marque) console.log(`  marque « ${m.requete} » : ${m.statut}${m.position ? ` (position ${m.position}, ${m.impressions} impressions)` : ''}`);
  if (r.serp.joue) for (const s of r.serp.requetes) console.log(`  SERP « ${s.requete} » : ${s.erreur ? `erreur ${s.erreur}` : `memlia ${s.rangMemlia ? `rang ${s.rangMemlia}` : 'absent du top 20'}${s.spell ? ` · orthographe ${s.spell.type} → ${s.spell.mot}` : ''}${s.blocs?.aiOverview ? ' · AI Overview' : ''} · top : ${s.top.slice(0, 5).map((x) => x.domaine).join(', ')}`}`);
  else console.log(`  SERP : ${r.serp.raison}`);
  if (r.serp.joue) console.log(`  coût DataForSEO : ${r.serp.cout} $`);
  for (const p of r.portee) console.log(`  à portée : ${p.slug ?? p.page} « ${p.requete} » position ${p.position} (${p.impressions} impressions)`);
  for (const c of r.ctr) console.log(`  CTR anormal : ${c.slug ?? c.page} « ${c.requete} » ${c.impressions} impressions, ${c.clics} clics`);
  for (const a of r.alertes) console.log(`  ALERTE ${a}`);
  if (r.nouvelles.length) console.log(`  requêtes nouvelles : ${r.nouvelles.join(' · ')}`);
  console.log(`  mises à jour Google dans la fenêtre : ${r.misesAJourGoogle.dansLaFenetre.map((m) => `${m.nom} (${m.date})`).join(', ') || 'aucune'}${r.misesAJourGoogle.ok ? '' : ` · page non lue : ${r.misesAJourGoogle.erreur}`}`);
  console.log(`  tâches de maintenance : ${r.taches.ajoutees} ajoutée(s), ${r.taches.misesAJour} mise(s) à jour · registre : ${r.registre.total} article(s), ${r.registre.ajoutes.length} inscrit(s) aujourd'hui`);
  for (const e of r.exclusions) console.log(`  écarté : ${e}`);
  for (const m of r.messages) console.log(`  note : ${m}`);
  console.log(`  instantané : ${r.fichier}`);
}

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const o = options(process.argv.slice(2));
  const r = await releveDemande({ date: o.date ?? dateLocale(), sansSerp: o.sansSerp });
  afficher(r, o.json);
  process.exitCode = r.code;
}
