/**
 * C4 — autorité, entité et visibilité IA : les règles pures du relevé mensuel.
 *
 * Trois grandeurs distinctes, qu'on ne mélange pas :
 *   - l'AUTORITÉ, ce que d'autres sites disent de nous (rang de domaine, domaines référents) ;
 *   - l'ENTITÉ, la capacité d'un moteur à savoir qui nous sommes — aujourd'hui « memlia » est
 *     réécrit en « mellia » et sert une autre entreprise, c'est le défaut le plus coûteux ;
 *   - la VISIBILITÉ IA, le fait d'être cité par un assistant, qui n'est ni l'un ni l'autre.
 *
 * Deux principes de mesure, hérités des leçons de ce chantier :
 *   - sans mois précédent, aucun recul ne se conclut : il n'y a rien à comparer, et un rouge
 *     posé sur un point unique mesure l'absence d'historique, pas une dégradation ;
 *   - un zéro n'est un rouge qu'après le délai où l'on pouvait raisonnablement attendre autre
 *     chose : zéro citation IA à un mois mesure l'âge du site, pas sa visibilité.
 *
 * Fonctions pures : aucune lecture de fichier, aucun appel réseau, aucune mutation.
 */

export const SEUILS_AUTORITE = Object.freeze({
  /** Avant ce nombre de mois, zéro citation par un assistant n'est pas un défaut mais un délai. */
  moisAvantCitationIa: 6,
  /** Passé ce délai, une marque encore réécrite par le moteur appelle un plan d'entité. */
  moisAvantEntiteRedressee: 3,
  /** Un lien cassé isolé arrive ; au-delà, la question se pose. */
  liensCassesTolerables: 2,
});

const sansWww = (d) => String(d ?? '').toLowerCase().replace(/^www\./, '');

/** Le résumé de profil de liens d'une réponse DataForSEO, avec son coût, ou l'erreur qui la nomme. */
export function lireBacklinks(reponse) {
  const tache = reponse?.tasks?.[0];
  if (!tache) return { ok: false, cout: 0, resume: null, erreur: 'réponse sans tâche' };
  if (Number(tache.status_code) !== 20000) {
    return { ok: false, cout: Number(tache.cost ?? 0), resume: null, erreur: `${tache.status_code} ${tache.status_message ?? ''}`.trim() };
  }
  const r = tache.result?.[0] ?? {};
  return {
    ok: true,
    cout: Number(tache.cost ?? 0),
    erreur: null,
    resume: {
      // ⚠ `rang` est le rang de domaine de DataForSEO, PAS l'autorité de domaine de Moz :
      // deux échelles différentes, qu'on ne compare jamais entre elles. Un relevé se compare
      // au relevé du mois précédent PAR LE MÊME INSTRUMENT, jamais à un chiffre d'une autre source.
      instrument: 'dataforseo-backlinks-summary',
      domaine: r.target ?? null,
      rang: r.rank ?? null,
      liens: r.backlinks ?? null,
      domainesReferents: r.referring_domains ?? null,
      domainesPrincipaux: r.referring_main_domains ?? null,
      liensCasses: r.broken_backlinks ?? null,
    },
  };
}

/**
 * Ce qu'une réponse d'assistant dit de nous. Deux choses différentes, comptées séparément :
 * être CITÉ (le domaine figure dans les sources) et être NOMMÉ (le domaine apparaît dans le texte).
 */
export function lireCitationsIa(resultat, { domaine }) {
  const cible = sansWww(domaine);
  const items = Array.isArray(resultat?.items) ? resultat.items : [];
  // Forme réelle de la réponse, relevée le 19/09/2026 : items[].sections[].text, et les sources
  // éventuelles dans sections[].annotations. L'ancien lecteur cherchait items[].message et ne
  // trouvait jamais rien : il rendait « aucune citation » sur des réponses pleines.
  const sections = items.flatMap((i) => (Array.isArray(i.sections) ? i.sections : []));
  const texte = sections.map((s) => String(s.text ?? '')).join('\n');
  const domaines = [];
  for (const s of sections) {
    for (const a of s.annotations ?? []) {
      try {
        const d = sansWww(new URL(a.url ?? a.uri ?? '').hostname);
        if (d && !domaines.includes(d)) domaines.push(d);
      } catch { /* une annotation sans URL lisible n'est pas une citation */ }
    }
  }
  // `web_search` dit si le modèle est allé chercher des sources. S'il ne l'a pas fait, l'absence
  // de citation ne mesure RIEN : il n'y avait aucune source à citer. Seul « nommé » reste vrai.
  const rechercheWeb = resultat?.web_search === true;
  return {
    rechercheWeb,
    cite: rechercheWeb ? domaines.includes(cible) : null,
    nomme: texte.toLowerCase().includes(cible) || texte.toLowerCase().includes(cible.split('.')[0]),
    domainesCites: domaines,
    extrait: texte ? texte.slice(0, 400) : null,
  };
}

/**
 * La tâche d'une réponse d'assistant : réussie, refusée, ou absente. Une tâche refusée est une
 * ERREUR et n'a pas de lecture — elle ne doit jamais se compter comme « aucune citation ».
 * Le 19/09/2026, un premier câblage sans `model_name` recevait 40501 et écrivait « 0 citation
 * sur 6 requêtes » pour zéro dollar : le zéro mesurait le refus de l'interface, pas la réalité.
 */
export function lireTacheIa(tache, { domaine }) {
  if (!tache) return { ok: false, cout: 0, lecture: null, erreur: 'réponse sans tâche' };
  if (Number(tache.status_code) !== 20000) {
    return { ok: false, cout: Number(tache.cost ?? 0), lecture: null, erreur: `${tache.status_code} ${tache.status_message ?? ''}`.trim() };
  }
  return { ok: true, cout: Number(tache.cost ?? 0), lecture: lireCitationsIa(tache.result?.[0] ?? null, { domaine }), erreur: null };
}

/**
 * Les hôtes d'assistants dont une visite compte comme une arrivée « par l'IA ».
 * ⚠ La plupart des visites venues d'un assistant arrivent **sans référent** et tombent donc dans
 * les visites directes : ce compte est un plancher, jamais un total.
 */
export const ASSISTANTS = Object.freeze([
  'chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'www.perplexity.ai', 'claude.ai',
  'gemini.google.com', 'copilot.microsoft.com', 'bing.com/chat', 'you.com', 'mistral.ai', 'chat.mistral.ai',
]);

/**
 * Les référents d'audience (Cloudflare Web Analytics, interface GraphQL). Une réponse en erreur
 * ne rend aucun compte — surtout pas zéro : c'est la leçon des trois zéros creux du 19/09/2026.
 * Un référent vide est une visite **directe**, pas un référent inconnu.
 */
export function lireReferents(reponse, { hoteSite = 'memlia.fr' } = {}) {
  const vide = { ok: false, erreur: null, chargements: null, directes: null, internes: null, externes: [], assistants: [], visitesAssistants: null };
  if (!reponse) return { ...vide, erreur: 'aucune réponse' };
  if (Array.isArray(reponse.errors) && reponse.errors.length > 0) return { ...vide, erreur: reponse.errors.map((e) => e.message).join(' · ') };
  const lignes = reponse?.data?.viewer?.accounts?.[0]?.rumPageloadEventsAdaptiveGroups;
  if (!Array.isArray(lignes)) return { ...vide, erreur: 'réponse sans jeu de données attendu' };
  const hotes = lignes.map((l) => ({ hote: String(l.dimensions?.refererHost ?? '').toLowerCase(), visites: Number(l.count ?? 0) }));
  const interne = (h) => h === hoteSite || h === `www.${hoteSite}` || h.endsWith(`.${hoteSite}`);
  const externes = hotes.filter((h) => h.hote && !interne(h.hote));
  const assistants = externes.filter((h) => ASSISTANTS.includes(h.hote));
  return {
    ok: true,
    erreur: null,
    // ⚠ `chargements` compte TOUT ce que la balise a vu, y compris nos propres passages
    // automatisés (recettes, contrôles de production, suites navigateur). Ce n'est PAS une
    // audience : mesuré le 19/09/2026, 1 890 chargements pour 15 impressions au moteur.
    // Ce qui vaut quelque chose ici, c'est la LISTE des référents externes, pas le total.
    chargements: hotes.reduce((n, h) => n + h.visites, 0),
    directes: hotes.filter((h) => !h.hote).reduce((n, h) => n + h.visites, 0),
    internes: hotes.filter((h) => h.hote && interne(h.hote)).reduce((n, h) => n + h.visites, 0),
    externes,
    assistants,
    visitesAssistants: assistants.reduce((n, h) => n + h.visites, 0),
  };
}

const rouge = (code, motif, mesure) => ({ code, motif, mesure });

/** Les rouges, avertissements et informations du relevé mensuel, chacun avec sa mesure. */
export function detecterAutorite({ mois, autorite, entite, ia, precedent = null, moisDepuisDepart = 0, seuils = SEUILS_AUTORITE }) {
  const rouges = [];
  const avertissements = [];
  const infos = [];

  if (!precedent) {
    infos.push("Aucun mois précédent au registre : aucun recul n'est conclu, ce relevé pose le point de départ.");
  } else {
    if (autorite.rang != null && precedent.autorite?.rang != null && autorite.rang < precedent.autorite.rang) {
      rouges.push(rouge('autorite-en-recul', "le rang de domaine a reculé d'un mois sur l'autre", `${precedent.autorite.rang} → ${autorite.rang}`));
    }
    if (autorite.domainesReferents != null && precedent.autorite?.domainesReferents != null && autorite.domainesReferents < precedent.autorite.domainesReferents) {
      rouges.push(rouge('domaines-referents-en-recul', 'des domaines référents ont disparu', `${precedent.autorite.domainesReferents} → ${autorite.domainesReferents}`));
    }
  }

  if (entite.spell && moisDepuisDepart >= seuils.moisAvantEntiteRedressee) {
    rouges.push(rouge('marque-toujours-reecrite', `le moteur réécrit encore la marque après ${moisDepuisDepart} mois : un plan d'entité est dû`, `« ${entite.spell.mot} » (${entite.spell.type})`));
  } else if (entite.spell) {
    avertissements.push(rouge('marque-reecrite', "le moteur réécrit la marque ; c'est attendu tant que l'entité est jeune", `« ${entite.spell.mot} »`));
  }

  // Un zéro ne se juge que si l'on a vraiment mesuré. Deux façons de ne pas mesurer : aucune
  // requête n'a abouti, ou le modèle a répondu sans chercher sur le web — alors il n'avait
  // aucune source à citer, et l'absence de citation ne dit rien de nous.
  if (ia.requetes > 0 && (ia.avecRecherche ?? 0) === 0) {
    avertissements.push(rouge('citations-ia-non-mesurees', "le modèle a répondu sans recherche web : les citations ne sont pas mesurées ce mois-ci", `${ia.requetes} requêtes, 0 avec recherche`));
    infos.push(`La marque est nommée dans ${ia.nomme} réponse(s) sur ${ia.requetes}, de mémoire du modèle et sans source.`);
  } else if (ia.requetes === 0) {
    avertissements.push(rouge('visibilite-ia-non-mesuree', "aucune requête n'a abouti : la visibilité IA n'est pas mesurée ce mois-ci", `${(ia.detail ?? []).filter((d) => d.erreur).length} refus`));
  } else if (ia.citations === 0 && moisDepuisDepart >= seuils.moisAvantCitationIa) {
    rouges.push(rouge('aucune-citation-ia', `aucun assistant ne cite le site après ${moisDepuisDepart} mois, sur ${ia.requetes} requêtes`, '0 citation'));
  } else if (ia.citations === 0) {
    infos.push(`Aucune citation par un assistant sur ${ia.requetes} requêtes : à ${moisDepuisDepart} mois, cela mesure l'âge du site.`);
  } else {
    infos.push(`${ia.citations} citation(s) par un assistant sur ${ia.requetes} requêtes.`);
  }

  if (autorite.liensCasses != null && autorite.liensCasses > seuils.liensCassesTolerables) {
    avertissements.push(rouge('liens-casses', 'des liens entrants pointent sur des pages qui ne répondent plus', `${autorite.liensCasses} liens`));
  }
  if (entite.rangMarque != null && entite.rangMarque > 10) {
    avertissements.push(rouge('marque-hors-premiere-page', "le site n'est pas en première page sur son propre nom", `rang ${entite.rangMarque}`));
  }
  if (entite.suggestions === 0) {
    infos.push("L'autocomplétion ne propose rien sur la marque : elle est sous le seuil de volume, ce qui est attendu pour une marque jeune.");
  }

  return { mois, rouges, avertissements, infos };
}
