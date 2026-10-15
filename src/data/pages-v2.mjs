import { ROBOT_HUB } from './robots.ts';
/**
 * Les cinq pages commerciales du site v2 — une seule source pour la navigation,
 * les titres, les chapeaux et les appels à l'action.
 *
 * La charte de message fait foi : .agents/product-marketing.md (v7, 15/10/2026). Ce fichier la transporte vers
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
    chapeau: "Nous prenons une tâche répétitive entière, de l’observation à la maintenance. Vous recevez une règle écrite dans vos mots et une automatisation dans vos outils existants. Votre équipe vérifie le résultat et garde la décision.",
    ariane: 'Méthode',
    secondaire: { libelle: 'Examiner les garanties', href: '/garanties' },
  },
  garanties: {
    chemin: '/garanties',
    nav: 'Garanties',
    titre: "Ce que Memlia garantit | Garanties",
    description: "Déploiement des robots et agents IA Memlia : accès définis, résultats vérifiés, validations conservées et maintenance au devis. Vos engagements avant la mise en service.",
    h1: 'Vos robots au travail. Vos décisions sous contrôle.',
    chapeau: "Un robot du catalogue, un agent IA adapté ou une construction sur mesure : nous définissons ce qu’il fait, les données qu’il utilise et les décisions qu’il vous laisse. Votre équipe vérifie le résultat avant la mise en service.",
    ariane: 'Garanties',
    secondaire: { libelle: 'Comprendre les essais', href: '/methode' },
  },
  apropos: {
    chemin: '/a-propos',
    nav: 'À propos',
    titre: 'À propos de Memlia : robots et agents IA pour les cabinets',
    description: "Memlia conçoit, déploie et maintient des robots et agents IA pour les cabinets comptables. Catalogue adapté à vos outils et construction sur mesure au besoin.",
    h1: 'Nous mettons les robots et agents IA au travail dans votre cabinet.',
    chapeau: "Memlia conçoit des robots pour vos routines et des agents IA pour vos métiers. Nous partons de ce catalogue, l’adaptons à votre organisation et assurons sa mise en service et sa maintenance. Nous construisons aussi sur mesure pour vos besoins particuliers.",
    ariane: 'À propos',
    secondaire: { libelle: 'Comprendre la méthode', href: '/methode' },
  },
  contact: {
    chemin: '/contact',
    nav: 'Contact',
    titre: 'Confier une première tâche | Contact Memlia',
    description: "Choisissez un robot, parlez de l’agent IA recherché ou décrivez votre besoin sur mesure. Nous préparons le périmètre de déploiement et un devis adapté à votre cabinet.",
    h1: 'Quel robot ou agent IA souhaitez-vous déployer ?',
    chapeau: "Vous avez repéré une tâche dans notre catalogue ? Indiquez-la avec vos outils et le résultat attendu. Si votre besoin est différent, décrivez-le : nous vous proposons une adaptation ou une construction sur mesure.",
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
