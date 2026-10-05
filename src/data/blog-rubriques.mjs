/**
 * Taxonomie éditoriale du blog : deux rubriques réelles, et seulement elles.
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
]);

/**
 * Les articles transversaux restent hors rubrique par décision explicite. Chaque exemption est
 * datée et motivée : le garde du contrat blog peut ainsi la rendre visible sans liste parallèle.
 */
export const ARTICLES_HORS_RUBRIQUE = Object.freeze({
  'automatiser-avec-ia-sans-changer-logiciel': Object.freeze({
    date: '2026-10-05',
    raison: 'Fiche transversale du passage entre outils et de sa reprise ; la demande de pièces est un cas fictif, pas une nouvelle étape réservée à Saisie et pièces. Famille IA existante, sans nouvelle rubrique artificielle.',
  }),
  'automatiser-un-cabinet-comptable-la-carte-des-taches': Object.freeze({
    date: '2026-09-20',
    raison: 'Article de référence transversal : il relie les familles de tâches de tout le cabinet et ne doit pas être réduit à la paie, à la DSN, à la saisie ou aux pièces.',
  }),
  'pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils': Object.freeze({
    date: '2026-09-20',
    raison: 'Cicatrice transversale : elle raconte une décision de cadrage et la règle qui en est sortie, pas une tâche appartenant à l’une des deux rubriques.',
  }),
  'cabinet-comptable-surcharge-de-travail-ou-passe-le-temps': Object.freeze({
    date: '2026-09-21',
    raison: 'Diagnostic transversal de la charge et des états du flux : il concerne plusieurs familles de production et ne relève exclusivement ni de la paie-DSN ni de la gestion des pièces.',
  }),
  'intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain': Object.freeze({
    date: '2026-09-21',
    raison: 'Article transversal sur les compétences, la préparation et la décision humaine : il ne correspond pas à une chaîne de tâches propre aux deux rubriques existantes.',
  }),
  'utiliser-chatgpt-cabinet-comptable': Object.freeze({
    date: '2026-10-04',
    raison: 'Guide transversal de sélection d’un premier usage IA : il ne décrit ni une étape Paie et DSN ni une étape Saisie et pièces. La famille IA existante porte son rattachement sans créer une rubrique artificielle.',
  }),
  'verifier-reponse-ia-comptabilite': Object.freeze({
    date: '2026-10-04',
    raison: 'Checklist transversale de contrôle des affirmations IA, distincte des chaînes Paie et DSN et Saisie et pièces ; rattachement à la famille IA sans nouvelle rubrique mince.',
  }),
  'ia-comptabilite-confidentialite-donnees': Object.freeze({
    date: '2026-10-05',
    raison: 'Fiche transversale de préparation et autorisation des entrées IA ; famille RGPD, secret et sécurité, sans correspondre aux chaînes Paie et DSN ou Saisie et pièces.',
  }),
  'prompt-chatgpt-expert-comptable': Object.freeze({
    date: '2026-09-28',
    raison: 'Guide transversal sur l’usage prudent d’un prompt ChatGPT en cabinet : la demande de pièce est un exemple fictif, pas une étape de la chaîne Saisie et pièces ni du cycle Paie et DSN.',
  }),
  'logiciel-ia-comptabilite': Object.freeze({
    date: '2026-09-28',
    raison: 'Grille de choix transversale entre logiciel existant et solutions envisagées : le parcours fictif d’une pièce sert à comparer les exceptions, sans transformer ce guide en étape de la chaîne Saisie et pièces.',
  }),
  'tests-verts-et-regle-des-trois-passes': Object.freeze({
    date: '2026-09-28',
    raison: 'Cicatrice de méthode transversale sur les suites, la chaîne de preuve et l’écran : elle concerne la recette de toute tâche, non une étape propre aux rubriques Paie et DSN ou Saisie et pièces.',
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
 * Joint la taxonomie à la collection réellement visible. Une rubrique ne produit aucune route
 * avec une liste maigre : si moins de deux de ses articles sont rendus, le build échoue fermé.
 */
export function construireRubriques(entrees, { minimum = 2 } = {}) {
  const visibles = new Map(entrees.map((entree) => [entree.id, entree]));
  return BLOG_RUBRIQUES.map((rubrique) => {
    const articles = rubrique.articleIds
      .map((articleId) => visibles.get(articleId))
      .filter(Boolean);
    if (articles.length < minimum) {
      throw new Error(`[blog-rubriques] ${rubrique.slug} : ${articles.length} article visible, minimum ${minimum}`);
    }
    return Object.freeze({ ...rubrique, articles: Object.freeze(articles) });
  });
}
