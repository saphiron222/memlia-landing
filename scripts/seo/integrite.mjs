#!/usr/bin/env node
/**
 * C3, l'intégrité éditoriale et technique (docs/strategy/site-v3/CRONS-SEO.md §3, RUNBOOK-SEO.md).
 *
 *   node scripts/seo/integrite.mjs [--date AAAA-MM-JJ] [--sans-vitesse] [--sans-sources] [--json]
 *
 * Lit les pages de production (sitemap), vérifie le maillage (liens entrants dans main, pilier ↔ satellites,
 * ancres du glossaire), rouvre chaque source citée avec l'UA du vérificateur et cherche la citation exacte
 * sans rien écrire dans les dossiers scellés, mesure la vitesse mobile avec PageSpeed Insights et lit CrUX.
 * Dépose les tâches dans la file de maintenance et écrit l'instantané de la semaine dans
 * docs/strategy/site-v3/mesures/semaine-<AAAA-Www>-integrite.json. Code 0 sans rouge, 2 avec rouge,
 * 1 si le sitemap de production est illisible.
 */
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { CHEMINS, ajouterTache, articlesPublies, chargerMaintenance, ecrireJson, lireJson, sauverMaintenance } from '../lib/seo-registres.mjs';
import { SEUILS, chercherExtrait, jugerSources, jugerVitesse, semaineIso, verifierMaillage } from '../lib/seo-regles.mjs';
import { ORIGINE, UA_VERIFICATEUR, cheminDepuisUrl, chercherPage, cruxOrigine, pagesProduction, psiMobile, sitemapProduction } from '../lib/seo-instruments.mjs';

const ESSAIS_SOURCE = 3;
const PAUSE_ENTRE_ESSAIS_MS = 5000;
const dateLocale = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Paris' });
const dormir = (ms) => new Promise((r) => setTimeout(r, ms));

function options(argv) {
  const o = { date: null, sansVitesse: false, sansSources: false, json: false };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--date') o.date = argv[++i];
    else if (argv[i] === '--sans-vitesse') o.sansVitesse = true;
    else if (argv[i] === '--sans-sources') o.sansSources = true;
    else if (argv[i] === '--json') o.json = true;
    else throw new Error(`option inconnue : ${argv[i]}`);
  }
  if (o.date && !/^\d{4}-\d{2}-\d{2}$/.test(o.date)) throw new Error('--date attend AAAA-MM-JJ');
  return o;
}

/** Les sources citées par un article publié, lues sans rien écrire : manifeste v3 (extrait dans la preuve) ou claims-sources hérité. */
export function sourcesDe(root, slug) {
  const dossier = join(root, 'editorial/articles', slug);
  const manifest = lireJson(join(dossier, 'manifest.json'), null);
  if (Array.isArray(manifest?.sources)) {
    return manifest.sources.map((s) => {
      const preuve = s.verificationEvidence ? lireJson(join(dossier, s.verificationEvidence), null) : null;
      return { sourceId: s.id, url: s.url, extraits: preuve?.excerpt ? [preuve.excerpt] : [], origine: 'manifest' };
    });
  }
  const claims = lireJson(join(dossier, 'claims-sources.json'), null);
  if (Array.isArray(claims?.sources)) {
    // Dossier hérité : le champ `evidence` est une note de vérification rédigée, pas une citation exacte.
    // Seule la réponse HTTP se vérifie, tant que l'article n'est pas repassé par la forge.
    return claims.sources.map((s) => ({ sourceId: s.id, url: s.url, extraits: [], origine: 'claims-sources' }));
  }
  return [];
}

async function ouvrirSource(url, cache) {
  if (cache.has(url)) return cache.get(url);
  const essais = [];
  for (let n = 1; n <= ESSAIS_SOURCE; n += 1) {
    const r = await chercherPage(url, { ua: UA_VERIFICATEUR, timeoutMs: SEUILS.sourceLenteMs });
    essais.push(r);
    if (r.ok) break;
    if (n < ESSAIS_SOURCE) await dormir(PAUSE_ENTRE_ESSAIS_MS);
  }
  cache.set(url, essais);
  return essais;
}

function dernierInstantane(root) {
  const dossier = join(root, CHEMINS.mesures);
  if (!existsSync(dossier)) return null;
  const fichiers = readdirSync(dossier).filter((f) => /^semaine-\d{4}-W\d{2}-integrite\.json$/.test(f)).sort();
  return fichiers.length ? lireJson(join(dossier, fichiers[fichiers.length - 1]), null) : null;
}

export async function integrite({ root = process.cwd(), date = dateLocale(), sansVitesse = false, sansSources = false } = {}) {
  const messages = [];
  const exclusions = [];
  const sitemap = await sitemapProduction();
  if (!sitemap.ok || sitemap.urls.length === 0) {
    return { ok: false, code: 1, message: `sitemap de production illisible (HTTP ${sitemap.status}${sitemap.erreur ? `, ${sitemap.erreur}` : ''})` };
  }
  const { pages, echecs } = await pagesProduction(sitemap.urls);
  for (const e of echecs) messages.push(`page non lue ${e.url} : ${e.erreur ?? `HTTP ${e.status}`}`);

  const publies = articlesPublies(root, { aujourdhui: date });
  const pilier = publies.find((a) => a.format === 'pillar-page') ?? null;
  const satellites = publies.filter((a) => a !== pilier);
  const maillage = verifierMaillage({
    pages,
    pilier: pilier ? cheminDepuisUrl(pilier.url) : null,
    satellites: satellites.map((a) => cheminDepuisUrl(a.url)),
    seuil: SEUILS.liensEntrantsMin,
    aujourdhui: date,
  });

  let sources = { total: 0, ok: 0, rouges: [], avertissements: [], lents: [], nonVerifiables: [], taches: [], verifications: [] };
  if (sansSources) {
    exclusions.push('sources non rouvertes : désactivé par option');
  } else {
    const cache = new Map();
    const verifications = [];
    for (const article of publies) {
      for (const source of sourcesDe(root, article.slug)) {
        const essais = await ouvrirSource(source.url, cache);
        const ordre = { absent: 3, normalise: 2, brut: 1, 'non-verifiable': 0 };
        const detail = essais.map((e) => {
          const niveaux = e.ok && !e.corpsIgnore ? source.extraits.map((x) => chercherExtrait(e.corps, x)) : [];
          const extrait = !e.ok ? 'absent' : niveaux.length ? niveaux.reduce((pire, n) => (ordre[n] > ordre[pire] ? n : pire), 'brut') : 'non-verifiable';
          return {
            ok: e.ok,
            status: e.status,
            finalUrl: e.finalUrl,
            contentType: e.contentType ?? null,
            extrait,
            extraitTrouve: extrait === 'absent' ? false : extrait === 'non-verifiable' ? null : true,
            extraitsManquants: source.extraits.filter((x, k) => niveaux[k] === 'absent').map((x) => x.slice(0, 80)),
            dureeMs: e.dureeMs,
            erreur: e.erreur,
          };
        });
        verifications.push({ slug: article.slug, sourceId: source.sourceId, url: source.url, origine: source.origine, extraits: source.extraits.length, essais: detail });
        if (source.extraits.length === 0 || detail.some((e) => e.ok && e.extrait === 'non-verifiable')) sources.nonVerifiables.push({ slug: article.slug, sourceId: source.sourceId, url: source.url, origine: source.origine });
      }
    }
    const jugement = jugerSources({ verifications, aujourdhui: date });
    sources = { total: verifications.length, ...jugement, nonVerifiables: sources.nonVerifiables, verifications };
    if (sources.nonVerifiables.length) exclusions.push(`${sources.nonVerifiables.length} source(s) sans citation exacte vérifiable (dossier hérité ou document non textuel) : seule la réponse HTTP est vérifiée`);
  }

  let vitesse = { resultats: [], rouges: [], aSurveiller: [], avertissements: [], infos: [] };
  let crux = null;
  if (sansVitesse) {
    exclusions.push('vitesse non mesurée : désactivé par option');
  } else {
    const dernier = [...publies].sort((a, b) => String(b.publieLe).localeCompare(String(a.publieLe)))[0] ?? null;
    const urlsVitesse = [...new Set([`${ORIGINE}/`, `${ORIGINE}/blog`, pilier?.url, dernier?.url, `${ORIGINE}/contact`, `${ORIGINE}/glossaire`].filter(Boolean))];
    const resultats = urlsVitesse.map((u) => psiMobile(u));
    const precedent = dernierInstantane(root)?.vitesse?.resultats ?? [];
    vitesse = { ...jugerVitesse({ resultats, precedent, plancher: SEUILS.plancherVitesse }), resultats };
    crux = cruxOrigine(`${ORIGINE}/`);
  }

  let file = chargerMaintenance(root);
  const tachesADeposer = [...maillage.taches, ...sources.taches];
  let ajoutees = 0;
  let misesAJour = 0;
  for (const t of tachesADeposer) {
    const r = ajouterTache(file, t, { aujourdhui: date });
    file = r.file;
    if (r.ajoutee) ajoutees += 1;
    else misesAJour += 1;
  }
  if (tachesADeposer.length) sauverMaintenance(root, file);

  const rouges = [
    ...maillage.rouges.map((r) => ({ volet: 'maillage', ...r })),
    ...sources.rouges.map((r) => ({ volet: 'sources', ...r })),
    ...vitesse.rouges.map((r) => ({ volet: 'vitesse', ...r })),
  ];
  const instantane = {
    date,
    semaine: semaineIso(date),
    pages: { lues: Object.keys(pages).length, echecs },
    maillage: { liens: maillage.liens, rouges: maillage.rouges, avertissements: maillage.avertissements, infos: maillage.infos },
    sources: { total: sources.total, ok: sources.ok, rouges: sources.rouges, avertissements: sources.avertissements, lents: sources.lents, nonVerifiables: sources.nonVerifiables, verifications: (sources.verifications ?? []).map((v) => ({ ...v, essais: v.essais.map(({ ok, status, finalUrl, extraitTrouve, extraitsManquants, dureeMs, erreur }) => ({ ok, status, finalUrl, extraitTrouve, extraitsManquants, dureeMs, erreur })) })) },
    vitesse: { resultats: vitesse.resultats, rouges: vitesse.rouges, aSurveiller: vitesse.aSurveiller, avertissements: vitesse.avertissements },
    crux,
    rouges,
    taches: { deposees: tachesADeposer.length, ajoutees, misesAJour },
    exclusions,
    messages,
  };
  const fichier = join(CHEMINS.mesures, `semaine-${semaineIso(date)}-integrite.json`);
  ecrireJson(join(root, fichier), instantane);
  return { ok: true, code: rouges.length ? 2 : 0, fichier, ...instantane };
}

function afficher(r, json) {
  if (json) {
    console.log(JSON.stringify(r, null, 2));
    return;
  }
  if (!r.ok) {
    console.log(`INTÉGRITÉ ${r.message}`);
    return;
  }
  console.log(`INTÉGRITÉ ${r.date} (${r.semaine}) · ${r.pages.lues} pages lues · ${r.rouges.length} rouge(s)`);
  console.log(`  maillage : ${r.maillage.infos.map((i) => i.message).join(' · ')}`);
  for (const x of r.maillage.rouges) console.log(`  ROUGE maillage ${x.code} ${x.cible ?? x.depuis ?? ''} : ${x.message}`);
  for (const x of r.maillage.avertissements) console.log(`  avertissement maillage ${x.code} ${x.cible ?? ''} : ${x.message}`);
  console.log(`  sources : ${r.sources.ok}/${r.sources.total} ouvertes avec leur citation · ${r.sources.lents.length} lente(s) · ${r.sources.nonVerifiables.length} sans citation enregistrée`);
  for (const x of r.sources.rouges) console.log(`  ROUGE source ${x.code} ${x.slug} ${x.sourceId} ${x.url} : ${x.message}`);
  for (const x of r.sources.avertissements) console.log(`  avertissement source ${x.code} ${x.slug} ${x.sourceId} : ${x.message}`);
  for (const x of r.vitesse.resultats) console.log(`  vitesse ${x.url} : ${x.erreur ? `erreur ${x.erreur}` : `${x.scores.performance}/${x.scores.accessibility}/${x.scores.bestPractices}/${x.scores.seo} · LCP ${x.labo.lcpMs} ms · CLS ${x.labo.cls}`}`);
  for (const x of r.vitesse.rouges) console.log(`  ROUGE vitesse ${x.code} ${x.url} : ${x.message}`);
  for (const x of r.vitesse.aSurveiller) console.log(`  à surveiller ${x.url} : ${x.message}`);
  if (r.crux) console.log(`  CrUX : ${r.crux.disponible ? JSON.stringify(r.crux.metriques) : r.crux.message}`);
  console.log(`  tâches de maintenance : ${r.taches.ajoutees} ajoutée(s), ${r.taches.misesAJour} mise(s) à jour`);
  for (const e of r.exclusions) console.log(`  écarté : ${e}`);
  for (const m of r.messages) console.log(`  note : ${m}`);
  console.log(`  instantané : ${r.fichier}`);
}

const estPrincipal = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (estPrincipal) {
  const o = options(process.argv.slice(2));
  const r = await integrite({ date: o.date ?? dateLocale(), sansVitesse: o.sansVitesse, sansSources: o.sansSources });
  afficher(r, o.json);
  process.exitCode = r.ok ? r.code : 1;
}
