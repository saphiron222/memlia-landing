/**
 * Suggestions et SERP relevées : le backlog éditorial recalé sur les formulations testées.
 *
 * Deux instruments, deux portées : l'autocomplétion Google relève des suggestions sur les
 * formulations testées, sans volume Ads ni preuve de demande ou d'audience ; une liste vide
 * signifie aucune suggestion relevée, pas zéro recherche. Une SERP est relevée par famille,
 * pas par angle : questions « Autres questions », recherches associées et domaines du haut de page
 * éclairent l'intention à vérifier manuellement, sans trancher celle de chaque angle.
 *
 * Règle de priorité, écrite pour être relue : 1 si la requête primaire a des suggestions, 2 si seule
 * une requête secondaire en a, 3 si aucune suggestion n'est relevée sur les formulations testées.
 * Le pilier n'est jamais recalé. L'intention adverse n'abaisse pas la priorité toute seule :
 * confronter SERP, intention cabinet et Search Console avant de décider une correction d'angle.
 * Fonctions pures : aucune lecture de fichier, aucune mutation des objets reçus.
 */

export const DOMAINES_LOGICIEL = Object.freeze([
  'pennylane.com', 'agicap.com', 'sage.com', 'cegid.com', 'tiime.fr', 'indy.fr', 'quickbooks.intuit.com', 'axonaut.com',
  'sellsy.com', 'evoliz.com', 'dext.com', 'libeo.io', 'yooz.com', 'welyb.fr', 'mycompanyfiles.fr', 'ibiza-software.fr',
  'acd-groupe.fr', 'fulll.fr', 'inqom.com', 'regate.io', 'qonto.com', 'shine.fr', 'zervant.com', 'abby.fr', 'keobiz.fr',
  'dougs.fr', 'clementine.fr', 'silae.fr', 'payfit.com', 'lucca.fr', 'eurecia.com', 'nibelis.com', 'kelio.com',
]);

const PART_LOGICIEL = 0.5;
const HAUT_DE_PAGE = 5;

/** « logiciel » quand au moins la moitié des cinq premiers domaines sont des éditeurs, sinon null. */
export function intentionDesDomaines(domaines) {
  const haut = (domaines ?? []).slice(0, HAUT_DE_PAGE);
  if (haut.length === 0) return null;
  const editeurs = haut.filter((d) => DOMAINES_LOGICIEL.includes(String(d).replace(/^www\./, ''))).length;
  return editeurs / haut.length >= PART_LOGICIEL ? 'logiciel' : null;
}

const nombre = (liste) => (Array.isArray(liste) ? liste.length : 0);

function prioriteMesuree(requete, secondaires) {
  if (requete > 0) return 1;
  if (secondaires > 0) return 2;
  return 3;
}

/** Le backlog recalé : mêmes entrées, même ordre, priorité et bloc `demande` posés depuis les mesures. */
export function recalerBacklog(backlog, mesures) {
  const autocompletion = mesures?.autocompletion ?? {};
  const serpParFamille = new Map(Object.values(mesures?.serp ?? {}).filter((s) => s?.famille).map((s) => [s.famille, s]));
  return backlog.map((entree) => {
    if (entree.format === 'pillar-page') return { ...entree };
    // Une amorce absente des mesures n'a pas été mesurée (instrument en panne) : ce n'est pas un zéro, la priorité ne bouge pas.
    const mesuree = Object.prototype.hasOwnProperty.call(autocompletion, entree.requete);
    const requete = mesuree ? nombre(autocompletion[entree.requete]) : null;
    const secondairesListe = entree.secondaires ?? [];
    const secondairesMesurees = secondairesListe.every((s) => Object.prototype.hasOwnProperty.call(autocompletion, s));
    const suggestionSecondaire = secondairesListe.some((s) => Object.prototype.hasOwnProperty.call(autocompletion, s) && nombre(autocompletion[s]) > 0);
    const secondaires = secondairesMesurees ? Math.max(0, ...secondairesListe.map((s) => nombre(autocompletion[s]))) : null;
    const serp = serpParFamille.get(entree.famille) ?? null;
    return {
      ...entree,
      priorite: requete > 0 ? 1 : mesuree && suggestionSecondaire ? 2 : mesuree && secondaires !== null ? prioriteMesuree(requete, secondaires) : entree.priorite,
      demande: {
        mesureeLe: mesuree || secondairesListe.some((s) => Object.prototype.hasOwnProperty.call(autocompletion, s)) ? mesures.jour : null,
        requete,
        secondaires,
        questions: serp ? [...(serp.questions ?? [])] : [],
        intention: serp ? intentionDesDomaines(serp.domaines) : null,
        apercuIa: serp ? Boolean(serp.apercuIa) : null,
      },
    };
  });
}

/** Toutes les amorces à autocompléter : requêtes primaires puis secondaires, sans doublon, dans l'ordre du backlog. */
export function amorcesDuBacklog(backlog, supplementaires = []) {
  const vues = new Set();
  const amorces = [];
  for (const q of [...backlog.flatMap((e) => [e.requete, ...(e.secondaires ?? [])]), ...supplementaires]) {
    const cle = String(q ?? '').trim();
    if (!cle || vues.has(cle)) continue;
    vues.add(cle);
    amorces.push(cle);
  }
  return amorces;
}

/** Une amorce SERP par famille : la requête primaire la plus suggérée ; à égalité, la première du backlog (l'angle méthode). */
export function amorcesSerpParFamille(backlog, autocompletion) {
  const parFamille = new Map();
  for (const e of backlog) {
    if (e.format === 'pillar-page') continue;
    const n = nombre(autocompletion[e.requete]);
    const courant = parFamille.get(e.famille);
    if (!courant || n > courant.n) parFamille.set(e.famille, { famille: e.famille, requete: e.requete, n });
  }
  return [...parFamille.values()];
}

/** Ce que le recalage a changé, pour le rapport : comptes par priorité avant et après, et les mouvements. */
export function rapportRecalage(avant, apres) {
  const compte = (liste) => liste.reduce((acc, e) => ({ ...acc, [e.priorite]: (acc[e.priorite] ?? 0) + 1 }), {});
  const avantPar = new Map(avant.map((e) => [e.slug, e.priorite]));
  const mouvements = apres.filter((e) => avantPar.get(e.slug) !== e.priorite).map((e) => ({ slug: e.slug, de: avantPar.get(e.slug), vers: e.priorite, requete: e.requete }));
  return { avant: compte(avant), apres: compte(apres), mouvements };
}

/** Un relevé joué sans SERP reprend la SERP (et son coût) du relevé précédent du même jour ; rien n'est muté. */
export function fusionnerReleve(precedent, nouveau) {
  if (!precedent || precedent.jour !== nouveau.jour || Object.keys(nouveau.serp ?? {}).length > 0 || Object.keys(precedent.serp ?? {}).length === 0) return nouveau;
  return {
    ...nouveau,
    serp: { ...precedent.serp },
    cout: precedent.cout,
    exclusions: [...(nouveau.exclusions ?? []).filter((e) => !/^SERP non relevée : désactivée par option$/.test(e)), `SERP reprise du relevé précédent du ${precedent.jour} (option --sans-serp)`],
  };
}
