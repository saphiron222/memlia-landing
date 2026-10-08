/**
 * Les cinq pages commerciales du site v2 — une seule source pour la navigation,
 * les titres, les chapeaux et les appels à l'action.
 *
 * La charte de message fait foi : .agents/product-marketing.md (v3, 17/09/2026). Ce fichier la transporte vers
 * les gabarits, les tests et le maillage, pour qu'un libellé ne vive jamais à deux
 * endroits qui pourraient diverger.
 */
export const PAGES_V2 = {
  service: {
    chemin: '/automatisation-cabinet-comptable',
    nav: 'Automatisation',
    titre: 'Automatisation sur mesure pour cabinet comptable | Memlia',
    description: "Toute tâche répétitive de votre cabinet, écrite dans vos mots puis automatisée dans vos outils. Livrée après recette, maintenue, sans siège à payer.",
    h1: 'Automatisation pour cabinet comptable : votre règle écrite, dans vos outils.',
    chapeau: "Nous prenons une tâche répétitive entière, de l’observation à la maintenance, dans les outils que vos équipes utilisent déjà. La règle est écrite avec le cabinet ; votre équipe garde chaque décision.",
    ariane: 'Automatisation',
    secondaire: { libelle: 'Voir comment se déroule la mission', href: '/methode' },
  },
  methode: {
    chemin: '/methode',
    nav: 'Méthode',
    titre: 'Comment se déroule une mission Memlia | Méthode',
    description: "Observer le geste réel, écrire la règle, éprouver sur des cas fictifs et livrer après votre recette. Une tâche prise en charge et maintenue dans vos outils.",
    h1: 'Observer. Écrire. Éprouver. Livrer.',
    chapeau: "Nous prenons une tâche répétitive entière, de l’observation à la maintenance. Vous recevez une règle écrite dans vos mots et une automatisation dans vos outils existants. Votre équipe vérifie le résultat et garde la décision.",
    ariane: 'Méthode',
    secondaire: { libelle: 'Examiner les garanties', href: '/garanties' },
  },
  garanties: {
    chemin: '/garanties',
    nav: 'Garanties',
    titre: "Ce que Memlia garantit | Garanties",
    description: "Garanties Memlia : arrêt dans le doute, aucune mesure des personnes, recette sur les refus et périmètre écrit avant de commencer.",
    h1: 'Ce que nous garantissons, avant même de commencer.',
    chapeau: "Une donnée absente, une règle ambiguë ou une exception ne disparaît jamais dans le traitement : l’automatisation s’arrête et vous présente le cas. Le périmètre, les accès et les validations sont écrits avant la mise en service.",
    ariane: 'Garanties',
    secondaire: { libelle: 'Comprendre les essais', href: '/methode' },
  },
  apropos: {
    chemin: '/a-propos',
    nav: 'À propos',
    titre: 'À propos de Memlia : le savoir-faire des cabinets, écrit et automatisé',
    description: "À propos de Memlia : nous écrivons le savoir-faire des cabinets comptables et automatisons la part répétitive du travail, avec validation humaine.",
    h1: 'Nous écrivons ce que votre cabinet sait faire. Puis nous le faisons tourner.',
    chapeau: "Les cabinets ne manquent ni de compétences ni d’outils. Ils manquent de temps, de bras, et d’une règle écrite quelque part. Memlia écrit cette règle avec vous, puis automatise tout ce qui se répète.",
    ariane: 'À propos',
    secondaire: { libelle: 'Comprendre la méthode', href: '/methode' },
  },
  contact: {
    chemin: '/contact',
    nav: 'Contact',
    titre: 'Confier une première tâche | Contact Memlia',
    description: "Décrivez la tâche que vos collaborateurs refont à la main : nous vous disons si elle se cadre, ce qu’il faut pour la prendre en charge, et à quel prix.",
    h1: 'Quelle tâche vos collaborateurs refont-ils encore à la main ?',
    chapeau: "Décrivez-la en trois phrases : le geste, les outils, le résultat attendu. Nous vous disons ce qui se cadre, ce qu’il faudrait pour le prendre en charge, et à quel prix. Rien à envoyer, aucun engagement.",
    ariane: 'Contact',
    secondaire: { libelle: 'Écrire à Memlia', href: 'mailto:contact@memlia.fr' },
  },
};

/** Le header reste une lecture courte de l'accueil ; le footer porte le plan du site complet. */
export const NAV_V2 = [
  { libelle: 'Tâches', href: '/#usages' },
  { libelle: 'Méthode', href: '/#methode' },
  { libelle: 'Contrôle humain', href: '/#preuves' },
  { libelle: 'Questions', href: '/#questions' },
];

/**
 * Ancres historiques de l'accueil : des liens existants pointent dessus, et une
 * ancre absente rend la page sans erreur. Elles ne se suppriment pas.
 */
export const ANCRES_HISTORIQUES = ['usages', 'methode', 'integration', 'garanties', 'questions', 'preuves'];
