/**
 * Taxonomie éditoriale du blog : rubriques substantielles déclarées dans les données.
 *
 * Le rattachement vit ici pour que le hub, le fil d’Ariane, l’étiquette d’article et le pied de
 * page lisent la même décision. Les articles restent une collection Astro ; cette table ne
 * contient ni titre ni résumé d’article et ne peut donc pas devenir une seconde liste éditoriale.
 */
export const BLOG_RUBRIQUES = Object.freeze([
  Object.freeze({
    slug: 'paie-dsn-cabinet-comptable',
    chemin: '/blog/rubrique/paie-dsn-cabinet-comptable',
    libelle: 'Paie et DSN',
    primaryQuery: 'paie et dsn cabinet comptable',
    descriptionLead: 'Paie et DSN en cabinet comptable',
    h1: 'Paie et DSN en cabinet comptable : du bulletin au retour métier',
    titreOnglet: 'Paie et DSN en cabinet comptable | Memlia',
    description: 'Paie et DSN en cabinet comptable : contrôler les bulletins, lire les retours DSN et suivre le pôle social avec la règle écrite du cabinet.',
    chapeau: 'Le cycle social ne s’arrête ni au calcul du bulletin ni au dépôt de la DSN. Cette rubrique relie les contrôles avant transmission, la lecture des retours métier et le suivi des dossiers, avec une frontière claire entre ce qui se prépare, ce qui attend une validation et ce qui reste au pôle social.',
    roleTitre: 'Une chaîne de contrôle, trois décisions distinctes',
    role: 'Choisissez le geste selon le moment du cycle : avant le dépôt, contrôler les bulletins ; après le dépôt, lire les comptes rendus métier ; pour le pilotage, suivre la production sociale. Chaque article distingue la préparation, la validation du pôle social et les cas qui demandent une décision.',
    articleIds: Object.freeze([
      'controler-les-bulletins-de-paie-avant-la-dsn',
      'comprendre-les-comptes-rendus-metier-dsn',
      'suivre-la-production-sociale-dans-excel',
    ]),
  }),
  Object.freeze({
    slug: 'gestion-pieces-comptables',
    chemin: '/blog/rubrique/gestion-pieces-comptables',
    libelle: 'Saisie et pièces',
    primaryQuery: 'gestion des pièces comptables',
    descriptionLead: 'Gestion des pièces comptables',
    h1: 'Gestion des pièces comptables : de la relance à la saisie vérifiée',
    titreOnglet: 'Gestion des pièces comptables en cabinet | Memlia',
    description: 'Gestion des pièces comptables : organiser les pièces manquantes puis vérifier les écritures proposées sous le contrôle du cabinet.',
    chapeau: 'Une pièce absente bloque la production ; une pièce lue trop vite déplace le risque dans la saisie. Cette rubrique suit la même matière de la collecte à la proposition d’écriture, en séparant la relance, la complétude, l’extraction et les contrôles que le cabinet garde.',
    roleTitre: 'De la pièce attendue à l’écriture proposée',
    role: 'Choisissez le geste selon l’état de la pièce : absente, préparer la relance, sa cadence et son arrêt ; reçue, passer les six contrôles après la saisie proposée. L’envoi de la relance et la validation des écritures restent au cabinet.',
    articleIds: Object.freeze([
      'automatiser-la-relance-des-pieces-clients',
      'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
    ]),
  }),
  Object.freeze({
    slug: 'ia-cabinet-comptable',
    chemin: '/blog/rubrique/ia-cabinet-comptable',
    libelle: 'IA en cabinet',
    primaryQuery: 'ia cabinet comptable',
    descriptionLead: 'IA en cabinet comptable',
    h1: 'IA en cabinet comptable : choisir l’usage, protéger les données, vérifier la réponse',
    titreOnglet: 'IA en cabinet comptable | Memlia',
    description: 'IA en cabinet comptable : choisir un premier usage, écrire la consigne, préparer les données sans perdre leur confidentialité et vérifier chaque réponse.',
    chapeau: 'L’IA ne remplace ni le logiciel du cabinet ni le jugement du collaborateur. Cette rubrique suit un usage de bout en bout : quoi lui confier, comment le lui demander, quelles données lui donner et comment relire ce qu’elle produit avant de s’en servir.',
    roleTitre: 'Du premier usage à la réponse vérifiée',
    role: 'Choisissez l’article selon votre étape. Pour démarrer, choisir un premier usage ou un outil. Pour demander, écrire une consigne qui part d’une tâche. Pour protéger, préparer les données avant de les confier. Pour utiliser, vérifier la réponse et la chaîne qui l’a produite. Dans tous les cas, la décision reste au cabinet.',
    articleIds: Object.freeze([
      'utiliser-chatgpt-cabinet-comptable',
      'logiciel-ia-comptabilite',
      'prompt-chatgpt-expert-comptable',
      'ia-comptabilite-confidentialite-donnees',
      'verifier-reponse-ia-comptabilite',
      'automatiser-avec-ia-sans-changer-logiciel',
      'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain',
      'tests-verts-et-regle-des-trois-passes',
    ]),
  }),
  Object.freeze({
    slug: 'commissariat-aux-comptes',
    chemin: '/blog/commissariat-aux-comptes',
    libelle: 'Commissariat aux comptes',
    primaryQuery: 'commissariat aux comptes',
    descriptionLead: 'Commissariat aux comptes',
    h1: 'Commissariat aux comptes : écrire la règle et examiner le résultat',
    titreOnglet: 'Commissariat aux comptes : méthodes du cabinet | Memlia',
    description: 'Commissariat aux comptes : une carte des tâches à préparer et un exemple de réception du FEC, avec des règles écrites et des résultats à examiner.',
    chapeau: 'Commencez par la tâche que vous voulez préparer, puis regardez ses entrées, ses contrôles et sa sortie. Ces deux articles présentent une carte des tâches du cabinet et un exemple de réception d’un FEC sur un jeu fictif.',
    roleTitre: 'De la tâche choisie au constat de réception',
    role: 'La carte aide à choisir un premier geste et à écrire sa règle. L’exemple de réception du FEC montre les résultats des contrôles, leurs limites et les questions à reprendre avec l’équipe. Lisez la carte pour cadrer le travail, ou ouvrez le constat pour examiner un fichier reçu. Les cas et leurs limites sont présentés dans chaque méthode.',
    articleIds: Object.freeze([
      'automatiser-un-cabinet-cac-la-carte-des-taches',
      'cac-reception-fec-constat',
    ]),
  }),
]);
/**
 * Les articles transversaux restent hors rubrique par décision explicite. Chaque exemption est
 * datée et motivée : le garde du contrat blog peut ainsi la rendre visible sans liste parallèle.
 */
export const ARTICLES_HORS_RUBRIQUE = Object.freeze({
  'rapprochement-bancaire-automatise-les-ecarts-a-remonter': Object.freeze({
    date: '2026-10-12',
    raison: 'Premier guide de la famille banque-rapprochement : sa méthode de comparaison relevé/journal ne relève ni de la paie, ni de la collecte et saisie des pièces, ni du choix d’un usage IA. Il reste relié au pilier général et au service bancaire ; ouvrir une rubrique bancaire avec ce seul article produirait un parcours maigre.',
  }),
  'automatiser-un-cabinet-comptable-la-carte-des-taches': Object.freeze({
    date: '2026-09-20',
    raison: 'Pilier transversal de toutes les familles de tâches du cabinet : il reste la porte d’entrée générale, sans être réduit à un parcours métier ou à un usage de l’IA.',
  }),
  'pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils': Object.freeze({
    date: '2026-09-20',
    raison: 'Cicatrice transversale d’adoption et de cadrage : elle explique un échec et la règle qui en est sortie, pas l’exécution d’un geste métier. La réunir avec le pilier ne constituerait pas un parcours propre.',
  }),
  'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps': Object.freeze({
    date: '2026-09-21',
    raison: 'Diagnostic transversal de la charge et des états du flux : seul article du portefeuille, il concerne plusieurs familles. Les pièces y illustrent un blocage sans justifier un rattachement au parcours de saisie.',
  }),
});

const PAR_ARTICLE = new Map();
for (const rubrique of BLOG_RUBRIQUES) {
  if (rubrique.articleIds.length < 2) {
    throw new Error(`[blog-rubriques] ${rubrique.slug} configure ${rubrique.articleIds.length} article : minimum 2`);
  }
  for (const articleId of rubrique.articleIds) {
    if (PAR_ARTICLE.has(articleId)) {
      throw new Error(`[blog-rubriques] ${articleId} appartient à plusieurs rubriques`);
    }
    if (Object.hasOwn(ARTICLES_HORS_RUBRIQUE, articleId)) {
      throw new Error(`[blog-rubriques] ${articleId} est à la fois rattaché et hors rubrique`);
    }
    PAR_ARTICLE.set(articleId, rubrique);
  }
}

export const rubriquePourArticle = (articleId) => PAR_ARTICLE.get(articleId) ?? null;

/**
 * Croise le stock publié EC avec les familles/pôles de la source de vérité.
 * Les exemptions ne comptent pas dans le seuil de deux articles d’un pôle ; les rubriques
 * suivent une intention de lecture et peuvent donc réunir plusieurs pôles (par exemple l’IA).
 * L’appelant fournit le stock publié : les brouillons en aperçu ne forcent pas une archive.
 */
export function verifierCouvertureRubriques(entrees, familles, {
  rubriques = BLOG_RUBRIQUES, exemptions = ARTICLES_HORS_RUBRIQUE,
} = {}) {
  const parFamille = new Map(familles.map((famille) => [famille.id, famille]));
  const rattachements = new Map();
  for (const rubrique of rubriques) {
    for (const id of rubrique.articleIds) {
      if (rattachements.has(id)) throw new Error(`[blog-rubriques] ${id} appartient à plusieurs rubriques`);
      if (Object.hasOwn(exemptions, id)) throw new Error(`[blog-rubriques] ${id} est à la fois rattaché et hors rubrique`);
      rattachements.set(id, rubrique);
    }
  }
  const parPole = new Map();
  for (const { id, data } of entrees) {
    const famille = parFamille.get(data.famille);
    if (!famille) throw new Error(`[blog-rubriques] ${id} : famille inconnue ${data.famille}`);
    if (famille.profession !== 'ec') continue;
    if (Object.hasOwn(exemptions, id)) {
      const { date, raison } = exemptions[id];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? '') || typeof raison !== 'string' || raison.trim().length < 50) {
        throw new Error(`[blog-rubriques] ${id} : exemption datée et motivée requise`);
      }
      continue;
    }
    if (!parPole.has(famille.pole)) parPole.set(famille.pole, []);
    parPole.get(famille.pole).push(id);
  }
  for (const [pole, ids] of parPole) {
    const sansRubrique = ids.filter((id) => !rattachements.has(id));
    if (sansRubrique.length && ids.length >= 2) {
      throw new Error(`[blog-rubriques] ${pole} : ${ids.length} articles non exemptés, sans parcours de rubrique pour ${sansRubrique.join(', ')}`);
    }
    if (sansRubrique.length) {
      throw new Error(`[blog-rubriques] ${sansRubrique[0]} : rubrique ou exemption motivée requise`);
    }
  }
}

/**
 * Joint la taxonomie à la collection réellement visible. Une rubrique ne produit aucune route
 * avec une liste maigre : si moins de deux de ses articles sont rendus, le build échoue fermé.
 */
export function construireRubriques(entrees, { minimum = 2, rubriques = BLOG_RUBRIQUES } = {}) {
  const visibles = new Map(entrees.map((entree) => [entree.id, entree]));
  return rubriques.map((rubrique) => {
    const articles = rubrique.articleIds
      .map((articleId) => visibles.get(articleId))
      .filter(Boolean);
    if (articles.length < minimum) {
      throw new Error(`[blog-rubriques] ${rubrique.slug} : ${articles.length} article visible, minimum ${minimum}`);
    }
    return Object.freeze({ ...rubrique, articles: Object.freeze(articles) });
  });
}

/** Résout un seul chemin par rubrique et refuse toute collision avec la collection. */
export function construireRoutesRubriques(entrees, { rubriques = BLOG_RUBRIQUES } = {}) {
  const chemins = new Set();
  const articles = new Set(entrees.map(({ id }) => `/blog/${id}`));
  for (const { chemin } of rubriques) {
    if (!/^\/blog\/(?:rubrique\/)?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(chemin) ||
        ['/blog/rubrique', '/blog/page'].includes(chemin)) {
      throw new Error(`[blog-rubriques] chemin de rubrique invalide : ${chemin}`);
    }
    if (chemins.has(chemin)) throw new Error(`[blog-rubriques] chemin dupliqué : ${chemin}`);
    if (articles.has(chemin)) throw new Error(`[blog-rubriques] collision avec un article : ${chemin}`);
    chemins.add(chemin);
  }
  return construireRubriques(entrees, { rubriques }).map((rubrique) => {
    const historique = rubrique.chemin.startsWith('/blog/rubrique/');
    const prefixe = historique ? '/blog/rubrique/' : '/blog/';
    return { rubrique, historique, param: rubrique.chemin.slice(prefixe.length) };
  });
}
