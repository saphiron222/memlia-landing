/**
 * Règles des crons SEO (docs/strategy/site-v3/CRONS-SEO.md §3) : C1 sentinelle, C2 demande, C3 intégrité.
 *
 * Tout ici est pur : les relevés sont déjà lus (Search Console, DataForSEO, HTML servi, PageSpeed,
 * ouvertures de sources), les règles les jugent et rendent des rouges, des avertissements, des infos,
 * des actions et des tâches de maintenance. Chaque verdict nomme ce qu'il mesure ; ce qui n'est pas
 * mesuré n'est pas inventé.
 */
import { marquerRequetesVues } from './seo-registres.mjs';

export const SEUILS = Object.freeze({
  indexationJours: 7,
  sitemapHeures: 72,
  decalageJours: 3,
  demande: Object.freeze({
    porteePosMin: 5,
    porteePosMax: 20,
    porteeImpressionsMin: 5,
    ctrImpressionsMin: 20,
    ctrMax: 0.01,
    chuteImpressionsMin: 20,
    chuteRatio: 0.5,
    satellitesMin: 3,
    rangMarqueMax: 1.5,
  }),
  liensEntrantsMin: 3,
  plancherVitesse: 95,
  clsMax: 0.1,
  lcpMsMax: 2500,
  sourceLenteMs: 25000,
});

// ---------------------------------------------------------------- dates

export function ajouterJours(iso, n) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function joursEntre(debut, fin) {
  return Math.round((Date.parse(`${fin}T00:00:00Z`) - Date.parse(`${debut}T00:00:00Z`)) / 86_400_000);
}

/** Semaine ISO 8601 d'une date ISO : AAAA-Www (l'année est celle de la semaine, pas du jour). */
export function semaineIso(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  const jour = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - jour);
  const debutAnnee = Date.UTC(d.getUTCFullYear(), 0, 1);
  const semaine = Math.ceil(((d.getTime() - debutAnnee) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(semaine).padStart(2, '0')}`;
}

const heuresEntre = (debutIso, finIso) => (Date.parse(finIso) - Date.parse(debutIso)) / 3_600_000;

// ---------------------------------------------------------------- C1 : indexation et dérive

export function estIndexee(coverageState) {
  const etat = String(coverageState ?? '').trim().toLowerCase();
  return etat.startsWith('submitted and indexed') || etat.startsWith('indexed');
}

const memeSite = (url) => /^https:\/\/memlia\.fr\//.test(String(url ?? ''));

export function jugerIndexation({
  inspections = [],
  sitemaps = [],
  premieresVues = {},
  etatPrecedent = {},
  derive = [],
  indexabilite = null,
  variantes = [],
  aujourdhui,
  maintenant = null,
  commitDeploye = null,
  seuils = SEUILS,
}) {
  const rouges = [];
  const avertissements = [];
  const infos = [];
  const actions = { demanderIndexation: [], indexnow: [], poserBaseline: [] };
  const vues = { ...premieresVues };
  const etat = {};
  const instant = maintenant ?? `${aujourdhui}T12:00:00Z`;
  let indexees = 0;
  let enAttente = 0;

  const repondues = inspections.filter((i) => !i.error && i.coverage_state);
  if (inspections.length > 0 && repondues.length === 0) {
    rouges.push({ code: 'instrument-muet', url: null, message: `aucune des ${inspections.length} inspections n'a répondu (${inspections[0].error ?? 'réponse vide'})` });
  }

  for (const i of inspections) {
    if (!vues[i.url]) vues[i.url] = aujourdhui;
    if (i.error || !i.coverage_state) {
      avertissements.push({ code: 'inspection-indisponible', url: i.url, message: i.error ?? 'réponse vide' });
      continue;
    }
    const indexee = estIndexee(i.coverage_state);
    etat[i.url] = indexee ? 'indexee' : 'non-indexee';
    if (indexee) {
      indexees += 1;
      if (i.canonical && i.canonical.match === false) {
        rouges.push({ code: 'canonique-divergente', url: i.url, message: `Google retient ${i.canonical.google_canonical} au lieu de ${i.canonical.user_canonical}` });
      }
      continue;
    }
    if (etatPrecedent[i.url] === 'indexee') {
      rouges.push({ code: 'sortie-index', url: i.url, message: `indexée au relevé précédent, aujourd'hui « ${i.coverage_state} »` });
    }
    const age = joursEntre(vues[i.url], aujourdhui);
    if (age >= seuils.indexationJours) {
      rouges.push({ code: 'non-indexee-7j', url: i.url, message: `« ${i.coverage_state} » depuis ${age} jours (première vue ${vues[i.url]})` });
      actions.demanderIndexation.push(i.url);
    } else {
      enAttente += 1;
      infos.push({ code: 'en-attente', url: i.url, message: `« ${i.coverage_state} » depuis ${age} jour(s)` });
    }
    actions.indexnow.push(i.url);
  }

  for (const s of sitemaps) {
    const erreurs = Number(s.errors ?? 0);
    if (erreurs > 0) rouges.push({ code: 'sitemap-erreur', url: s.path, message: `${erreurs} erreur(s) signalée(s) par Search Console` });
    if (!s.last_downloaded) {
      rouges.push({ code: 'sitemap-non-relu', url: s.path, message: 'jamais relu par Google' });
    } else if (heuresEntre(s.last_downloaded, instant) > seuils.sitemapHeures) {
      rouges.push({ code: 'sitemap-non-relu', url: s.path, message: `dernière lecture par Google le ${s.last_downloaded}` });
    }
    if (s.is_pending) infos.push({ code: 'sitemap-en-attente', url: s.path, message: 'soumission en attente de traitement' });
    if (Number(s.warnings ?? 0) > 0) avertissements.push({ code: 'sitemap-avertissements', url: s.path, message: `${s.warnings} avertissement(s)` });
  }

  for (const d of derive) {
    if (d.statut === 'sans-baseline') {
      actions.poserBaseline.push(d.url);
      infos.push({ code: 'sans-baseline', url: d.url, message: 'aucune baseline de dérive : à poser' });
    } else if (d.statut === 'erreur') {
      avertissements.push({ code: 'derive-indisponible', url: d.url, message: d.message ?? 'comparaison impossible' });
    } else if (d.statut === 'derive') {
      const resume = (d.findings ?? []).map((f) => `${f.severity} ${f.rule}`).join(', ') || 'règles non détaillées';
      if (d.commitBaseline && commitDeploye && d.commitBaseline !== commitDeploye) {
        infos.push({ code: 'derive-attendue', url: d.url, message: `déploiement ${commitDeploye} postérieur à la baseline ${d.commitBaseline} : ${resume}` });
        actions.poserBaseline.push(d.url);
      } else if ((d.critical ?? 0) > 0 || (d.warning ?? 0) > 0) {
        rouges.push({ code: 'derive', url: d.url, message: `dérive sans déploiement (baseline ${d.commitBaseline ?? 'sans commit'}) : ${resume}` });
      } else {
        infos.push({ code: 'derive-info', url: d.url, message: resume });
      }
    }
  }

  if (indexabilite && indexabilite.passed === false) {
    rouges.push({ code: 'indexabilite', url: 'https://memlia.fr/', message: indexabilite.message ?? 'oracle d’indexabilité en échec' });
  }

  for (const v of variantes) {
    const status = Number(v.status);
    const arrivee = v.finalUrl ?? v.location ?? null;
    const permanent = [301, 308].includes(status);
    const temporaire = [302, 307].includes(status);
    if (!memeSite(arrivee) || !(permanent || temporaire)) {
      rouges.push({ code: 'variante-non-redirigee', url: v.url, message: `répond ${v.status}${arrivee ? ` vers ${arrivee}` : ''} au lieu d'une redirection permanente vers https://memlia.fr/` });
    } else if (temporaire) {
      avertissements.push({ code: 'variante-redirection-temporaire', url: v.url, message: `redirection ${v.status}, une 301 est attendue` });
    } else if (Number(v.redirections ?? 1) > 1) {
      avertissements.push({ code: 'variante-chaine-de-redirections', url: v.url, message: `${v.redirections} redirections avant ${arrivee} : une seule est attendue` });
    }
    if (Number(v.impressions28j ?? 0) > 0) {
      infos.push({ code: 'variante-avec-impressions', url: v.url, message: `${v.impressions28j} impression(s) sur 28 jours sur une variante non canonique` });
    }
  }

  return {
    date: aujourdhui,
    resume: { urls: inspections.length, indexees, enAttente, rouges: rouges.length, avertissements: avertissements.length, infos: infos.length },
    rouges,
    avertissements,
    infos,
    actions,
    premieresVues: vues,
    etat,
  };
}

// ---------------------------------------------------------------- C2 : demande

export function fenetres({ aujourdhui, decalageJours = SEUILS.decalageJours }) {
  const fin = ajouterJours(aujourdhui, -decalageJours);
  return {
    fin,
    semaine: { debut: ajouterJours(fin, -6), fin },
    mois: { debut: ajouterJours(fin, -27), fin },
    moisPrecedent: { debut: ajouterJours(fin, -55), fin: ajouterJours(fin, -28) },
  };
}

const sansWww = (domaine) => String(domaine ?? '').toLowerCase().replace(/^www\./, '');

export function analyserSerp(resultat, { domaine }) {
  const items = Array.isArray(resultat?.items) ? resultat.items : [];
  const organiques = items.filter((i) => i.type === 'organic');
  const cible = sansWww(domaine);
  const memlia = organiques.find((i) => sansWww(i.domain) === cible);
  const types = new Set(items.map((i) => i.type));
  const aiOverview = items.find((i) => i.type === 'ai_overview') ?? null;
  return {
    requete: resultat?.keyword ?? null,
    spell: resultat?.spell ? { mot: resultat.spell.keyword ?? null, type: resultat.spell.type ?? null } : null,
    rangMemlia: memlia?.rank_absolute ?? null,
    urlMemlia: memlia?.url ?? null,
    top: organiques.slice(0, 10).map((i) => ({ rang: i.rank_absolute ?? null, domaine: i.domain ?? null, titre: i.title ?? '', url: i.url ?? null })),
    blocs: {
      aiOverview: types.has('ai_overview'),
      peopleAlsoAsk: types.has('people_also_ask'),
      video: types.has('video'),
      knowledgeGraph: types.has('knowledge_graph'),
      featuredSnippet: types.has('featured_snippet'),
    },
    memliaDansAiOverview: aiOverview ? JSON.stringify(aiOverview).includes(cible) : null,
    resultats: resultat?.se_results_count ?? null,
  };
}

/** Ce qu'une SERP dit de la demande : les questions « Autres questions », les recherches associées, les domaines organiques dans l'ordre, l'aperçu IA. */
export function extraireQuestionsSerp(resultat) {
  const items = Array.isArray(resultat?.items) ? resultat.items : [];
  const questions = items.filter((i) => i.type === 'people_also_ask').flatMap((i) => (i.items ?? []).map((q) => q.title).filter(Boolean));
  const associees = items.filter((i) => i.type === 'related_searches').flatMap((i) => (i.items ?? []).filter((s) => typeof s === 'string'));
  const domaines = items.filter((i) => i.type === 'organic').sort((a, b) => (a.rank_group ?? 0) - (b.rank_group ?? 0)).map((i) => sansWww(i.domain)).filter(Boolean);
  return {
    questions: [...new Set(questions)],
    associees: [...new Set(associees)],
    domaines: [...new Set(domaines)],
    apercuIa: items.some((i) => i.type === 'ai_overview'),
    spell: resultat?.spell ? { mot: resultat.spell.keyword ?? null, type: resultat.spell.type ?? null } : null,
  };
}

/**
 * C2 — une requête primaire mesurée à zéro suggestion d'autocomplétion est un angle que personne ne tape.
 * Une requête absente des mesures n'a pas été mesurée (instrument en panne) : aucune alerte, jamais un zéro supposé.
 */
export function alertesDemande(registre, autocompletion) {
  return (registre?.articles ?? [])
    .filter((a) => Object.prototype.hasOwnProperty.call(autocompletion ?? {}, a.requete) && (autocompletion[a.requete] ?? []).length === 0)
    .map((a) => `requête primaire sans demande mesurée à l’autocomplétion : « ${a.requete} » (${a.slug}) — recaler le titre ou l’angle (voir questions.mjs)`);
}

const normaliserPage = (page) => String(page ?? '').replace(/\/$/, '') || String(page ?? '');
const cle1 = (ligne) => ligne.keys?.[0];
const cle2 = (ligne) => ligne.keys?.[1];
const ctrDe = (ligne) => (ligne.impressions > 0 ? ligne.clicks / ligne.impressions : 0);

export function detecterDemande({ registre, gsc, requetesVues = {}, aujourdhui, seuils = SEUILS.demande }) {
  const semaine = gsc?.semaine ?? { pages: [], requetes: [], pagesRequetes: [] };
  const mois = gsc?.mois ?? { pages: [], requetes: [], pagesRequetes: [] };
  const moisPrecedent = gsc?.moisPrecedent ?? { pages: [] };
  const parUrl = new Map(registre.articles.map((a) => [normaliserPage(a.url), a]));
  const articleDe = (page) => parUrl.get(normaliserPage(page)) ?? null;

  const somme = (lignes, page, champ) => lignes.filter((l) => normaliserPage(cle1(l)) === normaliserPage(page)).reduce((t, l) => t + Number(l[champ] ?? 0), 0);
  const positionDe = (lignes, page) => {
    const l = lignes.find((x) => normaliserPage(cle1(x)) === normaliserPage(page));
    return l ? Number(l.position) : null;
  };

  const parArticle = registre.articles.map((a) => ({
    slug: a.slug,
    famille: a.famille ?? null,
    requete: a.requete,
    impressions7: somme(semaine.pages, a.url, 'impressions'),
    clics7: somme(semaine.pages, a.url, 'clicks'),
    impressions28: somme(mois.pages, a.url, 'impressions'),
    clics28: somme(mois.pages, a.url, 'clicks'),
    position28: positionDe(mois.pages, a.url),
    requetes: mois.pagesRequetes
      .filter((l) => normaliserPage(cle1(l)) === normaliserPage(a.url))
      .map((l) => ({ requete: cle2(l), impressions: Number(l.impressions ?? 0), clics: Number(l.clicks ?? 0), position: Number(l.position) }))
      .sort((x, y) => y.impressions - x.impressions),
  }));

  const horsRegistre = mois.pages
    .filter((l) => !articleDe(cle1(l)))
    .map((l) => ({ page: cle1(l), impressions28: Number(l.impressions ?? 0), clics28: Number(l.clicks ?? 0) }));

  const familles = new Map();
  for (const a of parArticle) {
    const f = a.famille ?? 'sans-famille';
    const acc = familles.get(f) ?? { famille: f, articles: 0, impressions28: 0, requetes: new Set() };
    acc.articles += 1;
    acc.impressions28 += a.impressions28;
    for (const r of a.requetes) if (r.impressions > 0) acc.requetes.add(r.requete);
    familles.set(f, acc);
  }
  const parFamille = [...familles.values()].map((f) => ({ famille: f.famille, articles: f.articles, impressions28: f.impressions28, requetesAvecImpressions: f.requetes.size }));
  const famillesSansImpression = parFamille.filter((f) => f.articles >= seuils.satellitesMin && f.impressions28 === 0).map((f) => f.famille).sort();

  const portee = semaine.pagesRequetes
    .filter((l) => Number(l.position) >= seuils.porteePosMin && Number(l.position) <= seuils.porteePosMax && Number(l.impressions ?? 0) >= seuils.porteeImpressionsMin)
    .map((l) => ({ page: cle1(l), slug: articleDe(cle1(l))?.slug ?? null, requete: cle2(l), position: Number(l.position), impressions: Number(l.impressions), clics: Number(l.clicks ?? 0) }));

  const ctr = mois.pagesRequetes
    .filter((l) => Number(l.impressions ?? 0) >= seuils.ctrImpressionsMin && ctrDe(l) < seuils.ctrMax)
    .map((l) => ({ page: cle1(l), slug: articleDe(cle1(l))?.slug ?? null, requete: cle2(l), impressions: Number(l.impressions), clics: Number(l.clicks ?? 0), ctr: ctrDe(l) }));

  const chutes = moisPrecedent.pages
    .filter((l) => Number(l.impressions ?? 0) >= seuils.chuteImpressionsMin)
    .map((l) => ({ page: cle1(l), slug: articleDe(cle1(l))?.slug ?? null, avant: Number(l.impressions), apres: somme(mois.pages, cle1(l), 'impressions') }))
    .filter((c) => c.apres <= c.avant * seuils.chuteRatio);

  const requetesDuMois = [...mois.requetes.map(cle1), ...mois.pagesRequetes.map(cle2)].filter(Boolean);
  const { vues, nouvelles } = marquerRequetesVues(requetesVues, requetesDuMois, { aujourdhui });

  const marque = (registre.marque ?? []).map((terme) => {
    const ligne = mois.requetes.find((l) => String(cle1(l)).toLowerCase() === terme.toLowerCase());
    if (!ligne) return { requete: terme, statut: 'absente', position: null, impressions: 0, clics: 0, pages: [] };
    const pages = mois.pagesRequetes.filter((l) => String(cle2(l)).toLowerCase() === terme.toLowerCase()).map(cle1);
    return {
      requete: terme,
      statut: Number(ligne.position) <= seuils.rangMarqueMax ? 'rang-1' : 'hors-rang-1',
      position: Number(ligne.position),
      impressions: Number(ligne.impressions ?? 0),
      clics: Number(ligne.clicks ?? 0),
      pages,
    };
  });

  const taches = [];
  const poser = (t) => {
    const doublon = taches.find((x) => x.slug === t.slug && x.type === t.type && x.cle === t.cle);
    if (!doublon) taches.push(t);
    else if (t.gravite === 'haute') doublon.gravite = 'haute';
  };
  for (const p of portee) {
    if (!p.slug) continue;
    poser({
      slug: p.slug,
      type: 'recaler-titre',
      cle: p.requete,
      motif: `« ${p.requete} » en position ${p.position.toFixed(1)} avec ${p.impressions} impressions sur 7 jours : titre ou introduction à recaler sur la requête`,
      mesure: { valeur: `position ${p.position.toFixed(1)}, ${p.impressions} impressions`, instrument: 'Search Console, 7 jours', date: aujourdhui },
      gravite: p.impressions >= 20 ? 'haute' : 'moyenne',
      cron: 'C2',
    });
  }
  for (const c of ctr) {
    if (!c.slug) continue;
    poser({
      slug: c.slug,
      type: 'recaler-titre',
      cle: c.requete,
      motif: `« ${c.requete} » : ${c.impressions} impressions et ${c.clics} clic(s) sur 28 jours, CTR ${(c.ctr * 100).toFixed(1)} % : titre et description à revoir`,
      mesure: { valeur: `CTR ${(c.ctr * 100).toFixed(1)} % sur ${c.impressions} impressions`, instrument: 'Search Console, 28 jours', date: aujourdhui },
      gravite: c.impressions >= 50 ? 'haute' : 'moyenne',
      cron: 'C2',
    });
  }
  for (const c of chutes) {
    if (!c.slug) continue;
    poser({
      slug: c.slug,
      type: 'rafraichir',
      cle: 'impressions-28-jours',
      motif: `impressions passées de ${c.avant} à ${c.apres} d'une période de 28 jours à la suivante : chercher le glissement de requête, rafraîchir`,
      mesure: { valeur: `${c.avant} → ${c.apres}`, instrument: 'Search Console, 28 jours contre 28 jours', date: aujourdhui },
      gravite: 'haute',
      cron: 'C2',
    });
  }

  return { parArticle, horsRegistre, parFamille, famillesSansImpression, portee, ctr, chutes, nouvelles, marque, taches, requetesVues: vues };
}

// ---------------------------------------------------------------- C3 : maillage

const contenuPrincipal = (html) => {
  const m = String(html ?? '').match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return m ? m[1] : String(html ?? '');
};

const normaliserLien = (href) => {
  const sansSuffixe = String(href).split(/[?#]/)[0];
  return sansSuffixe.length > 1 ? sansSuffixe.replace(/\/$/, '') : sansSuffixe;
};

const liensDe = (html) => [...contenuPrincipal(html).matchAll(/href="([^"]+)"/g)].map((m) => m[1]);

export function liensEntrants({ pages, cibles }) {
  const chemins = Object.keys(pages).sort();
  return cibles.map((cible) => {
    const entrants = chemins.filter((chemin) => chemin !== cible && liensDe(pages[chemin]).some((h) => normaliserLien(h) === cible));
    return { cible, entrants, nombre: entrants.length };
  });
}

const slugDe = (chemin) => String(chemin).split('/').filter(Boolean).pop();

export function verifierMaillage({ pages, pilier, satellites = [], seuil = SEUILS.liensEntrantsMin, aujourdhui = null }) {
  const cibles = [pilier, ...satellites].filter(Boolean);
  const liens = liensEntrants({ pages, cibles });
  const rouges = [];
  const avertissements = [];
  const infos = [];
  const taches = [];
  const mesure = (valeur, instrument) => ({ valeur, instrument, ...(aujourdhui ? { date: aujourdhui } : {}) });

  for (const l of liens) {
    if (l.nombre === 0) rouges.push({ code: 'orpheline', cible: l.cible, message: 'aucune page ne la lie' });
    if (l.nombre < seuil) {
      rouges.push({ code: 'liens-entrants-insuffisants', cible: l.cible, nombre: l.nombre, seuil, message: `${l.nombre} lien(s) entrant(s) sur ${seuil} attendus` });
      taches.push({
        slug: slugDe(l.cible),
        type: 'inserer-lien',
        cle: 'liens-entrants',
        motif: `${l.nombre} lien(s) entrant(s) sur ${seuil} attendus : ajouter un lien dans le corps d'un article voisin, avec une ancre parlante`,
        mesure: mesure(String(l.nombre), 'HTML servi, liens dans main'),
        gravite: 'moyenne',
        cron: 'C3',
      });
    }
  }

  if (pilier && pages[pilier] !== undefined) {
    const liensPilier = liensDe(pages[pilier]).map(normaliserLien);
    for (const s of satellites) {
      if (pages[s] === undefined) {
        avertissements.push({ code: 'page-non-lue', cible: s, message: 'page absente du relevé' });
        continue;
      }
      if (!liensDe(pages[s]).map(normaliserLien).includes(pilier)) {
        rouges.push({ code: 'satellite-sans-lien-pilier', cible: s, message: `ne lie pas le pilier ${pilier}` });
        taches.push({
          slug: slugDe(s),
          type: 'inserer-lien',
          cle: 'lien-vers-pilier',
          motif: `ne lie pas le pilier ${pilier} : ajouter le lien dans le corps, là où la carte des tâches est nommée, par republication scellée`,
          mesure: mesure('absent', 'HTML servi, liens dans main'),
          gravite: 'haute',
          cron: 'C3',
        });
      }
      if (!liensPilier.includes(s)) {
        rouges.push({ code: 'pilier-sans-lien-satellite', cible: s, message: `le pilier ${pilier} ne lie pas ce satellite` });
        taches.push({
          slug: slugDe(pilier),
          type: 'inserer-lien',
          cle: `lien-vers-${slugDe(s)}`,
          motif: `le pilier ne lie pas ${s} : ajouter le lien là où sa famille est nommée`,
          mesure: mesure('absent', 'HTML servi, liens dans main'),
          gravite: 'haute',
          cron: 'C3',
        });
      }
    }
  } else if (pilier) {
    avertissements.push({ code: 'page-non-lue', cible: pilier, message: 'pilier absent du relevé' });
  }

  const glossaire = pages['/glossaire'];
  if (glossaire === undefined) {
    avertissements.push({ code: 'glossaire-non-lu', cible: '/glossaire', message: 'ancres non vérifiables' });
  } else {
    const ids = new Set([...String(glossaire).matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
    for (const [chemin, html] of Object.entries(pages)) {
      for (const href of liensDe(html)) {
        const m = String(href).match(/^\/glossaire#(.+)$/);
        if (m && !ids.has(m[1])) rouges.push({ code: 'ancre-glossaire-absente', depuis: chemin, ancre: m[1], message: `l'ancre #${m[1]} n'existe pas dans le glossaire` });
      }
    }
  }

  infos.push({ code: 'liens-entrants', message: liens.map((l) => `${slugDe(l.cible)} ${l.nombre}`).join(', ') });
  return { liens, rouges, avertissements, infos, taches };
}

// ---------------------------------------------------------------- C3 : ancres des liens internes

/** Le texte qu'un lecteur voit : balises et entités retirées, casse conservée. */
const texteVisible = (fragment) => String(fragment ?? '')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (m, nom) => ENTITES[nom.toLowerCase()] ?? m)
  .replace(/[\u00a0\u202f\u2009]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/**
 * Ancres qui ne décrivent pas leur destination : le lecteur ne sait pas où il va, et la
 * page d'arrivée ne reçoit aucun mot qui la qualifie.
 */
const ANCRES_GENERIQUES = new Set([
  'ici', 'cliquez ici', 'cliquer ici', 'ce lien', 'lien', 'le lien', 'cet article', 'cette page',
  'lire', 'lire la suite', 'lire l article', 'voir', 'voir plus', 'en savoir plus',
  'plus d informations', 'plus d info', 'la page', 'la suite', 'cliquez', 'suivant',
]);

const MOTS_VIDES = new Set([
  'avec', 'dans', 'pour', 'sans', 'sous', 'leur', 'leurs', 'cette', 'comme', 'entre', 'plus', 'tout',
  'tous', 'toute', 'toutes', 'elle', 'elles', 'etre', 'avoir', 'faire', 'chaque', 'selon', 'vers',
  'mais', 'donc', 'ainsi', 'aussi', 'depuis', 'apres', 'avant',
  // Mots de trois lettres : le seuil descend à trois pour garder les sigles du métier
  // (dsn, crm, tva, ocr), il faut donc écarter la grammaire de la même longueur.
  'les', 'des', 'une', 'aux', 'par', 'sur', 'que', 'qui', 'quoi', 'ces', 'ses', 'son', 'sa', 'ils',
  'est', 'ont', 'ete', 'non', 'oui', 'car', 'nos', 'vos', 'ils', 'lui', 'peu', 'ceux', 'cela',
]);

/** Mots comparables : sans balise, sans entité, sans accent, sans ponctuation. */
const normaliserMots = (texte) => normaliserTexte(texte)
  .normalize('NFD').replace(/\p{Diacritic}/gu, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

/**
 * Les ancres telles qu'un lecteur les perçoit. Un lien `aria-hidden` double une destination
 * déjà annoncée à côté (les cartes du blog le font pour ne pas lire deux fois le même titre) :
 * il ne porte pas d'ancre et n'en attend pas. À défaut de texte, l'alt de l'image en tient lieu.
 */
const ancresDe = (html) => [...contenuPrincipal(html).matchAll(/<a\b([^>]*)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi)]
  .filter((m) => !/aria-hidden="true"/i.test(m[1] + m[3]))
  .map((m) => {
    // `normaliserTexte` met en bas de casse (il sert à comparer des citations) ; une ancre se
    // relit telle que le lecteur la voit, donc la casse est rendue à la chaîne nettoyée.
    const texte = texteVisible(m[4]);
    const alt = texte ? null : texteVisible(m[4].match(/<img\b[^>]*\balt="([^"]*)"/i)?.[1] ?? '');
    return { href: m[2], ancre: texte || alt || '' };
  })
  .filter((l) => l.href.startsWith('/'));

/**
 * Deux défauts seulement, et c'est voulu. Une ancre générique ne dit pas au lecteur ce
 * qu'il trouvera ; une ancre ambiguë le mène à deux endroits différents selon la page.
 * Répéter l'ancre la plus claire vers une même destination n'est PAS un défaut : le
 * compte des ancres distinctes est rendu en info, sans verdict.
 */
export function verifierAncres({ pages, aujourdhui = null }) {
  const rouges = [];
  const avertissements = [];
  const infos = [];
  const taches = [];
  const vues = new Set();
  const mesure = (valeur) => ({ valeur, instrument: 'HTML servi, ancres dans main', ...(aujourdhui ? { date: aujourdhui } : {}) });
  const deposer = (depuis, cible, motif, valeur, gravite) => {
    // Seul un article se republie par la forge ; une ancre d'une page commerciale se
    // corrige à la main, elle est signalée sans tâche pour ne pas déposer un ticket
    // que le vendredi de la forge ne saurait pas traiter.
    if (!depuis.startsWith('/blog/')) return;
    const cle = `ancre-vers-${slugDe(cible) ?? 'accueil'}`;
    const id = `${slugDe(depuis)}|${cle}`;
    if (vues.has(id)) return;
    vues.add(id);
    taches.push({ slug: slugDe(depuis), type: 'varier-ancre', cle, motif, mesure: mesure(valeur), gravite, cron: 'C3' });
  };

  const liens = [];
  for (const chemin of Object.keys(pages).sort()) {
    for (const { href, ancre } of ancresDe(pages[chemin])) {
      const cible = normaliserLien(href);
      if (cible === chemin) continue;
      liens.push({ depuis: chemin, cible, ancre, cle: normaliserMots(ancre) });
    }
  }

  for (const l of liens) {
    if (l.cle && !ANCRES_GENERIQUES.has(l.cle)) continue;
    const vue = l.ancre || '(vide)';
    rouges.push({ code: 'ancre-generique', depuis: l.depuis, cible: l.cible, ancre: vue, message: `l'ancre « ${vue} » ne décrit pas ${l.cible}` });
    deposer(l.depuis, l.cible, `l'ancre « ${vue} » vers ${l.cible} ne dit pas ce que le lecteur y trouve : la réécrire dans la phrase qui la porte`, vue, 'moyenne');
  }

  const parAncre = new Map();
  for (const l of liens) {
    if (!l.cle || ANCRES_GENERIQUES.has(l.cle)) continue;
    parAncre.set(l.cle, [...(parAncre.get(l.cle) ?? []), l]);
  }
  for (const [, groupe] of [...parAncre].sort(([a], [b]) => a.localeCompare(b))) {
    const parCible = new Map();
    for (const l of groupe) parCible.set(l.cible, [...(parCible.get(l.cible) ?? []), l]);
    if (parCible.size < 2) continue;
    const cibles = [...parCible.keys()].sort();
    rouges.push({ code: 'ancre-ambigue', ancre: groupe[0].ancre, cibles, depuis: [...new Set(groupe.map((l) => l.depuis))].sort(), message: `l'ancre « ${groupe[0].ancre} » mène à ${cibles.join(' et ')}` });
    const compte = [...parCible.values()].map((v) => v.length);
    const max = Math.max(...compte);
    const majoritaireUnique = compte.filter((n) => n === max).length === 1;
    for (const [cible, v] of parCible) {
      // La destination majoritaire garde ses mots ; ce sont les autres qui doivent changer.
      if (majoritaireUnique && v.length === max) continue;
      for (const l of v) deposer(l.depuis, cible, `l'ancre « ${l.ancre} » mène ici à ${cible} et ailleurs à ${cibles.filter((c) => c !== cible).join(', ')} : choisir des mots propres à cette destination`, l.ancre, 'moyenne');
    }
  }

  const parDestination = new Map();
  for (const l of liens) {
    const etat = parDestination.get(l.cible) ?? { liens: 0, ancres: new Set() };
    etat.liens += 1;
    etat.ancres.add(l.cle);
    parDestination.set(l.cible, etat);
  }
  const destinations = [...parDestination]
    .map(([cible, e]) => ({ cible, liens: e.liens, ancres: e.ancres.size }))
    .sort((a, b) => b.liens - a.liens || a.cible.localeCompare(b.cible));
  infos.push({ code: 'ancres-par-destination', destinations, message: `${liens.length} lien(s) interne(s) vers ${destinations.length} destination(s)` });
  return { liens, rouges, avertissements, infos, taches };
}

// ---------------------------------------------------------------- C3 : routes vers les articles

/**
 * Les pages qui nomment des tâches ou des engagements que les articles documentent.
 * `/contact` en est exclue par décision : c'est la page de conversion, l'en sortir dessert.
 * Les pages légales et `/a-propos` (page de marque) n'ont pas à router vers un article.
 */
export const PAGES_A_SERVIR = Object.freeze(['/', '/automatisation-cabinet-comptable', '/methode', '/garanties']);

/**
 * Deux mesures, aucune tâche : les correctifs vivent hors de la forge (une page .astro, le
 * glossaire et sa chaîne scellée), donc un ticket déposé ici ne suivrait pas le code.
 */
export function verifierRoutes({ pages, articles = [], pagesAServir = PAGES_A_SERVIR }) {
  const avertissements = [];
  const infos = [];
  const chemins = Object.keys(pages).sort();
  const estArticle = (chemin) => chemin.startsWith('/blog/');
  const sortants = (chemin) => liensDe(pages[chemin]).map(normaliserLien);

  const orphelins = [];
  for (const article of articles) {
    if (pages[article] === undefined) continue;
    const entrants = chemins.filter((c) => c !== article && sortants(c).includes(article));
    const horsBlog = entrants.filter((c) => c !== '/blog' && !estArticle(c));
    if (horsBlog.length > 0) continue;
    orphelins.push(article);
    avertissements.push({ code: 'article-sans-route-hors-blog', cible: article, entrants, message: `aucune page hors du blog ne mène à cet article (${entrants.length} lien(s) entrant(s), tous depuis le blog ou ses articles)` });
  }

  const muettes = [];
  for (const page of pagesAServir) {
    if (pages[page] === undefined) continue;
    if (sortants(page).some(estArticle)) continue;
    muettes.push(page);
    avertissements.push({ code: 'page-sans-route-vers-article', cible: page, message: 'cette page ne mène à aucun article' });
  }

  infos.push({ code: 'routes', orphelins, muettes, message: `${articles.length - orphelins.length}/${articles.length} article(s) atteignable(s) hors du blog · ${pagesAServir.length - muettes.length}/${pagesAServir.length} page(s) qui mènent à un article` });
  return { avertissements, infos, taches: [] };
}

// ---------------------------------------------------------------- F3 : passages candidats

/**
 * Les paragraphes d'un corps qui portent tous les mots significatifs d'une expression.
 * Sert à proposer un lien là où la tâche est déjà nommée, sans deviner le sens : titres et
 * tableaux sont écartés, une phrase qui ne porte qu'une partie des mots ne compte pas.
 */
export function chercherPassages(corps, expressions = [], { minJetons = 3, minParExpression = 2, longueur = 220 } = {}) {
  const paragraphes = String(corps ?? '')
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#') && !p.startsWith('|'));
  const significatifs = (texte) => [...new Set(normaliserMots(texte).split(' ').filter((t) => t.length >= minJetons && !MOTS_VIDES.has(t)))];
  // Un sigle (trois lettres) doit correspondre exactement ; au-delà, l'accord et le pluriel
  // sont tolérés par préfixe. Sans cette borne, « con » vaudrait « contrôle ».
  const correspond = (attendu, mot) => (attendu.length <= 3 || mot.length <= 3
    ? attendu === mot
    : mot.startsWith(attendu) || attendu.startsWith(mot));
  const trouves = [];
  for (const expression of expressions) {
    const attendus = significatifs(expression);
    // Un seul mot significatif ne justifie pas un lien : mesuré le 18/09/2026, « anomalies dsn »
    // réduit à « anomalies » proposait six paragraphes d'un article qui ne parle pas de DSN.
    if (attendus.length < minParExpression) continue;
    for (const paragraphe of paragraphes) {
      const presents = significatifs(paragraphe);
      if (!attendus.every((j) => presents.some((mot) => correspond(j, mot)))) continue;
      trouves.push({ expression, paragraphe: paragraphe.length > longueur ? `${paragraphe.slice(0, longueur)}…` : paragraphe });
    }
  }
  return trouves;
}

// ---------------------------------------------------------------- C3 : vitesse

export function jugerVitesse({ resultats = [], precedent = [], plancher = SEUILS.plancherVitesse, seuils = SEUILS }) {
  const rouges = [];
  const aSurveiller = [];
  const avertissements = [];
  const infos = [];
  const sousPlancher = (scores) => Object.entries(scores ?? {}).filter(([, v]) => Number(v) < plancher).map(([k, v]) => `${k} ${v}`);
  for (const r of resultats) {
    if (r.erreur) {
      avertissements.push({ code: 'psi-indisponible', url: r.url, message: r.erreur });
      continue;
    }
    const sous = sousPlancher(r.scores);
    if (sous.length) {
      const avant = precedent.find((p) => p.url === r.url);
      if (avant && sousPlancher(avant.scores).length) {
        rouges.push({ code: 'score-sous-plancher', url: r.url, message: `${sous.join(', ')} sous ${plancher} à deux relevés consécutifs` });
      } else {
        aSurveiller.push({ code: 'score-sous-plancher-une-fois', url: r.url, message: `${sous.join(', ')} sous ${plancher} : à confirmer au prochain relevé` });
      }
    }
    const cls = Number(r.labo?.cls ?? 0);
    if (cls > seuils.clsMax) rouges.push({ code: 'cls', url: r.url, message: `CLS ${cls.toFixed(3)} au-dessus de ${seuils.clsMax}` });
    const lcp = Number(r.labo?.lcpMs ?? 0);
    if (lcp > seuils.lcpMsMax) avertissements.push({ code: 'lcp', url: r.url, message: `LCP ${Math.round(lcp)} ms au-dessus de ${seuils.lcpMsMax} ms (laboratoire)` });
    infos.push({ code: 'scores', url: r.url, message: Object.entries(r.scores ?? {}).map(([k, v]) => `${k} ${v}`).join(', ') });
  }
  return { rouges, aSurveiller, avertissements, infos };
}

// ---------------------------------------------------------------- C3 : sources

const ENTITES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', laquo: '«', raquo: '»', hellip: '…', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', ocirc: 'ô', ecirc: 'ê', ucirc: 'û', icirc: 'î', acirc: 'â', euml: 'ë', iuml: 'ï', uuml: 'ü', ndash: '–', mdash: '—' };

/** Texte comparable : sans balises ni entités, apostrophes et guillemets unifiés, espaces réduits, minuscules, NFC. */
export function normaliserTexte(texte) {
  return String(texte ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, nom) => ENTITES[nom.toLowerCase()] ?? m)
    .replace(/[\u00a0\u202f\u2009]/g, ' ')
    .replace(/[’‘`´]/g, "'")
    .replace(/«\s*/g, '"')
    .replace(/\s*»/g, '"')
    .replace(/[“”]/g, '"')
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/** 'brut' si la citation exacte est dans le corps, 'normalise' si elle n'y est qu'après normalisation, 'absent' sinon. */
export function chercherExtrait(corps, extrait) {
  if (typeof extrait !== 'string' || !extrait) return 'non-verifiable';
  if (String(corps ?? '').includes(extrait)) return 'brut';
  return normaliserTexte(corps).includes(normaliserTexte(extrait)) ? 'normalise' : 'absent';
}

export function memeAdresse(a, b) {
  try {
    const ua = new URL(a);
    const ub = new URL(b);
    const chemin = (u) => u.pathname.replace(/\/$/, '') || '/';
    return ua.hostname.toLowerCase().replace(/^www\./, '') === ub.hostname.toLowerCase().replace(/^www\./, '') && chemin(ua) === chemin(ub);
  } catch {
    return a === b;
  }
}

export function jugerSources({ verifications = [], seuilLentMs = SEUILS.sourceLenteMs, aujourdhui = null }) {
  const rouges = [];
  const avertissements = [];
  const lents = [];
  const taches = [];
  let ok = 0;
  let nonVerifiables = 0;
  const niveau = (e) => e.extrait ?? (e.extraitTrouve === true ? 'brut' : e.extraitTrouve === false ? 'absent' : 'non-verifiable');
  const mesure = (valeur, instrument) => ({ valeur, instrument, ...(aujourdhui ? { date: aujourdhui } : {}) });
  const tache = (v, gravite, motif, valeur) => taches.push({
    slug: v.slug,
    type: 'reverifier-source',
    cle: v.sourceId,
    motif,
    mesure: mesure(valeur, 'ouverture de la source avec l’UA du vérificateur'),
    gravite,
    cron: 'C3',
  });

  for (const v of verifications) {
    const essais = Array.isArray(v.essais) ? v.essais : [];
    const reussi = essais.find((e) => e.ok);
    if (!reussi) {
      const dernier = essais[essais.length - 1] ?? {};
      const detail = dernier.erreur ? `${dernier.erreur}` : `HTTP ${dernier.status ?? '?'}`;
      rouges.push({ code: 'source-morte', slug: v.slug, sourceId: v.sourceId, url: v.url, message: `${essais.length} essai(s) sans réponse valide (${detail})` });
      tache(v, 'haute', `la source ${v.url} ne répond plus (${detail}) : remplacer ou retirer la citation, puis republier`, detail);
      continue;
    }
    const extrait = niveau(reussi);
    if (extrait === 'absent') {
      rouges.push({ code: 'extrait-absent', slug: v.slug, sourceId: v.sourceId, url: v.url, message: 'la page répond mais la citation exacte n’y figure plus, même après normalisation' });
      tache(v, 'haute', `la citation exacte n'est plus dans ${v.url} : relire la source, corriger l'extrait ou l'affirmation, puis republier`, 'extrait absent');
      continue;
    }
    ok += 1;
    if (extrait === 'normalise') {
      avertissements.push({ code: 'extrait-forme-changee', slug: v.slug, sourceId: v.sourceId, url: v.url, message: 'citation retrouvée après normalisation typographique : la page a changé de forme, pas de fond' });
    } else if (extrait === 'non-verifiable') {
      nonVerifiables += 1;
    }
    if (reussi.finalUrl && !memeAdresse(reussi.finalUrl, v.url)) {
      avertissements.push({ code: 'source-redirigee', slug: v.slug, sourceId: v.sourceId, url: v.url, message: `redirigée vers ${reussi.finalUrl}` });
      tache(v, 'moyenne', `la source ${v.url} redirige vers ${reussi.finalUrl} : mettre l'URL citée à jour et vérifier la citation`, reussi.finalUrl);
    }
    if (Number(reussi.dureeMs ?? 0) > seuilLentMs) {
      lents.push({ slug: v.slug, sourceId: v.sourceId, url: v.url, dureeMs: reussi.dureeMs });
    }
  }
  return { ok, nonVerifiables, rouges, avertissements, lents, taches };
}
