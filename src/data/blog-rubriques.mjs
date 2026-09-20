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
    h1: 'Paie et DSN en cabinet comptable : du bulletin au retour métier',
    titreOnglet: 'Paie et DSN en cabinet comptable | Memlia',
    description: 'Contrôler les bulletins, lire les retours DSN et suivre le pôle social : trois méthodes reliées par la règle écrite du cabinet.',
    chapeau: 'Le cycle social ne s’arrête ni au calcul du bulletin ni au dépôt de la DSN. Cette rubrique relie les contrôles avant transmission, la lecture des retours métier et le suivi des dossiers, avec une frontière claire entre ce qui se prépare, ce qui attend une validation et ce qui reste au pôle social.',
    roleTitre: 'Une chaîne de contrôle, trois décisions distinctes',
    role: 'Le hub donne le chemin d’ensemble sans réduire ces tâches à une checklist unique. Le contrôle du bulletin prépare un fichier vérifié, les comptes rendus métier expliquent ce qui revient après le dépôt, et le suivi de production situe chaque dossier dans le cycle. Chaque article garde sa requête et son geste propres ; la rubrique montre seulement comment les enchaîner sans confondre contrôle technique, interprétation métier et pilotage.',
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
    h1: 'Gestion des pièces comptables : de la relance à la saisie vérifiée',
    titreOnglet: 'Gestion des pièces comptables en cabinet | Memlia',
    description: 'Organiser les pièces manquantes puis vérifier les écritures proposées : deux méthodes pour garder la chaîne comptable sous contrôle humain.',
    chapeau: 'Une pièce absente bloque la production ; une pièce lue trop vite déplace le risque dans la saisie. Cette rubrique suit la même matière de la collecte à la proposition d’écriture, en séparant la relance, la complétude, l’extraction et les contrôles que le cabinet garde.',
    roleTitre: 'De la pièce attendue à l’écriture proposée',
    role: 'Le premier article écrit la règle qui détermine quelles pièces manquent, quand préparer une relance et quand cesser. Le second commence lorsque la pièce est là : il distingue les champs extraits, les contrôles déterministes et les anomalies qui attendent une personne. Le hub relie ces deux moments sans viser la requête propre à la saisie automatisée.',
    articleIds: Object.freeze([
      'automatiser-la-relance-des-pieces-clients',
      'automatiser-la-saisie-comptable-ce-qui-reste-a-verifier',
    ]),
  }),
]);

/**
 * Deux articles transversaux restent hors rubrique par décision explicite. Leur présence ici
 * empêche qu’une future taxonomie les range implicitement dans une catégorie à un seul article.
 */
export const ARTICLES_HORS_RUBRIQUE = Object.freeze({
  'automatiser-un-cabinet-comptable-la-carte-des-taches': 'Article de référence transversal : il relie les familles de tâches de tout le cabinet et ne doit pas être réduit à la paie, à la DSN, à la saisie ou aux pièces.',
  'la-plateforme-que-personne-n-a-achetee': 'Cicatrice transversale : elle raconte une décision de cadrage et la règle qui en est sortie, pas une tâche appartenant à l’une des deux rubriques.',
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
      .filter(Boolean)
      .sort((a, b) => b.data.datePublication.getTime() - a.data.datePublication.getTime());
    if (articles.length < minimum) {
      throw new Error(`[blog-rubriques] ${rubrique.slug} : ${articles.length} article visible, minimum ${minimum}`);
    }
    return Object.freeze({ ...rubrique, articles: Object.freeze(articles) });
  });
}
