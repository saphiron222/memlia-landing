/**
 * Les cinq pages commerciales du site v2 — une seule source pour la navigation,
 * les titres, les chapeaux et les appels à l'action.
 *
 * La copy fait foi : docs/strategy/site-v2/copy/. Ce fichier la transporte vers
 * les gabarits, les tests et le maillage, pour qu'un libellé ne vive jamais à deux
 * endroits qui pourraient diverger.
 */
export const PAGES_V2 = {
  service: {
    chemin: '/automatisation-cabinet-comptable',
    nav: 'Automatisation',
    titre: 'Automatisation sur mesure pour cabinet comptable | Memlia',
    description: "Nous cadrons une tâche répétitive de votre cabinet, écrivons sa règle et livrons une automatisation dont chaque résultat reste à vérifier. Devis à la complexité, jamais au siège.",
    h1: 'Votre tâche, vos règles, une automatisation à vérifier.',
    chapeau: "Ressaisies, rapprochements, préparation de contrôles : nous cadrons une tâche avec vous avant de construire. Les formats, les exceptions et les critères de recette définissent ce qui sera livré.",
    ariane: 'Automatisation',
    secondaire: { libelle: 'Voir comment se déroule la mission', href: '/methode' },
  },
  methode: {
    chemin: '/methode',
    nav: 'Méthode',
    titre: 'Comment se déroule une mission Memlia | Méthode',
    description: "Observer le geste réel, écrire la règle dans vos mots, éprouver sur des cas qui doivent échouer, livrer après recette. Les quatre étapes d'une automatisation vérifiable.",
    h1: 'On commence par observer. On livre après vérification.',
    chapeau: "De la tâche répétitive au résultat préparé, chaque étape nomme ses règles et ses limites. Les cas qui doivent s'arrêter sont testés autant que ceux qui doivent aboutir.",
    ariane: 'Méthode',
    secondaire: { libelle: 'Examiner les garanties', href: '/garanties' },
  },
  garanties: {
    chemin: '/garanties',
    nav: 'Garanties',
    titre: "Ce que Memlia garantit, et ce qu'il refuse de faire | Garanties",
    description: "Arrêt en cas de doute, aucune donnée de cabinet dans les jeux d'essai, aucune mesure individuelle des collaborateurs, périmètre écrit avant la mise en service. Nos limites, énoncées.",
    h1: 'La proposition ne prend pas la décision.',
    chapeau: "Une donnée absente, une règle ambiguë ou une exception ne doit pas disparaître dans le traitement. Le périmètre, les accès et les points de validation sont définis avant la mise en service.",
    ariane: 'Garanties',
    secondaire: { libelle: 'Comprendre les essais', href: '/methode' },
  },
  apropos: {
    chemin: '/a-propos',
    nav: 'À propos',
    titre: 'Kevin Kitanga, fondateur de Memlia | À propos',
    description: "Qui construit et livre les automatisations Memlia, avec quel périmètre et quelles limites assumées. Une responsabilité identifiée, pas une qualification supposée.",
    h1: 'Memlia, un service porté par Kevin Kitanga.',
    chapeau: "J’aide les cabinets à transformer leurs tâches répétitives en automatisations délimitées et vérifiables. Le point de départ reste le travail réel ; la décision reste au cabinet.",
    ariane: 'À propos',
    secondaire: { libelle: 'Lire les méthodes', href: '/blog' },
  },
  contact: {
    chemin: '/contact',
    nav: 'Contact',
    titre: 'Décrire une tâche à automatiser | Contact Memlia',
    description: "Un échange pour décrire le geste qui revient, les outils utilisés et le résultat attendu. Sans fichier client, sans donnée de paie, sans engagement.",
    h1: 'Quelle tâche aimeriez-vous ne plus refaire ?',
    chapeau: "Décrivez le geste répétitif, les outils utilisés et le résultat attendu. Pour ce premier échange, n’envoyez ni fichier client ni donnée de paie. Nous verrons ce qui peut être cadré, avant tout engagement sur un développement.",
    ariane: 'Contact',
    secondaire: { libelle: 'Écrire à Memlia', href: 'mailto:contact@memlia.fr' },
  },
};

/** Les six destinations du header, visibles sans ouvrir de menu sur mobile (D05). */
export const NAV_V2 = [
  { libelle: PAGES_V2.service.nav, href: PAGES_V2.service.chemin },
  { libelle: PAGES_V2.methode.nav, href: PAGES_V2.methode.chemin },
  { libelle: PAGES_V2.garanties.nav, href: PAGES_V2.garanties.chemin },
  { libelle: 'Ressources', href: '/ressources' },
  { libelle: 'Blog', href: '/blog' },
];

/**
 * Ancres historiques de l'accueil : des liens existants pointent dessus, et une
 * ancre absente rend la page sans erreur. Elles ne se suppriment pas.
 */
export const ANCRES_HISTORIQUES = ['usages', 'methode', 'integration', 'garanties', 'questions', 'preuves'];
