import { ROBOT_HUB } from './robots.ts';
/**
 * Les cinq pages commerciales du site v2 — une seule source pour la navigation,
 * les titres, les chapeaux et les appels à l'action.
 *
 * La charte de message fait foi : .agents/product-marketing.md (v11, 16/10/2026). Ce fichier la transporte vers
 * les gabarits, les tests et le maillage, pour qu'un libellé ne vive jamais à deux
 * endroits qui pourraient diverger.
 */
export const PAGES_V2 = {
  service: {
    chemin: String(ROBOT_HUB.chemin),
    nav: 'Robots comptables',
    titre: String(ROBOT_HUB.titre),
    description: String(ROBOT_HUB.description),
    h1: String(ROBOT_HUB.h1),
    chapeau: String(ROBOT_HUB.introduction),
    ariane: 'Robots comptables',
    secondaire: { libelle: 'Trouver votre premier robot', href: '#annuaire' },
  },
  methode: {
    chemin: '/methode',
    nav: 'Méthode',
    titre: 'Comment se déroule une mission Memlia | Méthode',
    description: "Observer le geste réel, écrire la règle, éprouver sur des cas fictifs et livrer après votre recette. Une tâche prise en charge et maintenue dans vos outils.",
    h1: 'Observer. Écrire. Éprouver. Livrer.',
    chapeau: "Nous partons du résultat attendu pour choisir le service et écrire son périmètre. Robots et agents s’adaptent depuis le catalogue ; la mémoire collective relie vos sources ; le modèle privé suit des essais d’entraînement et une évaluation. Votre équipe vérifie le résultat avant la mise en service.",
    ariane: 'Méthode',
    secondaire: { libelle: 'Examiner les garanties', href: '/garanties' },
  },
  garanties: {
    chemin: '/garanties',
    nav: 'Garanties',
    titre: "Ce que Memlia garantit | Garanties",
    description: "Déploiement des robots et agents IA Memlia, mémoire collective et modèle privé : accès, recette, validations et maintenance définis avant la mise en service.",
    h1: 'Vos services IA au travail. Vos décisions sous contrôle.',
    chapeau: "Pour chaque service, nous définissons le résultat, les données utilisées, les accès et les validations. Votre équipe vérifie les critères de recette avant la mise en service. Les essais d’un modèle privé ont leur budget et leurs critères d’acceptation.",
    ariane: 'Garanties',
    secondaire: { libelle: 'Comprendre les essais', href: '/methode' },
  },
  apropos: {
    chemin: '/a-propos',
    nav: 'À propos',
    titre: 'À propos de Memlia : les services IA pour votre cabinet',
    description: "Memlia conçoit, déploie et maintient des robots, agents IA, mémoires collectives et modèles privés. Catalogue adapté et sur mesure selon le besoin.",
    h1: 'Nous mettons l’IA au travail avec votre cabinet.',
    chapeau: "Memlia conçoit des robots pour les routines et des agents IA pour les métiers. Memlia OS relie le savoir du cabinet ; le modèle privé apprend à partir d’exemples autorisés. Nous adaptons chaque service à votre organisation, avec une recette et une maintenance définies.",
    ariane: 'À propos',
    secondaire: { libelle: 'Comprendre la méthode', href: '/methode' },
  },
  contact: {
    chemin: '/contact',
    nav: 'Contact',
    titre: 'Confier une première tâche | Contact Memlia',
    description: "Choisissez un robot, un agent IA, une mémoire collective ou un modèle privé. Décrivez votre besoin pour cadrer le périmètre, la recette et le devis.",
    h1: 'Que souhaitez-vous confier à Memlia ?',
    chapeau: "Vous avez repéré un robot, un agent IA, Memlia OS ou le modèle privé ? Indiquez le résultat attendu et vos outils. Nous retenons un premier périmètre et préparons le devis. Pour les robots et agents, nous partons du catalogue et construisons sur mesure au besoin.",
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
