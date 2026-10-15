import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : finance (AGENTS-CONTENU.md §4, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const FINANCE: Specialiste = {
  slug: 'finance',
  prenom: 'Florent',
  libelle: 'Finance',
  groupe: 'production-conseil',
  teinte: 'conseil-missions',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Prépare situations, trésorerie et prévisionnels de vos clients depuis la comptabilité tenue ; chaque hypothèse est tracée pour votre revue.',
  frontiereEnBref: [
    'Projeter les flux datés et chiffrés',
    'Chaque hypothèse et chaque retraitement',
    'Le conseil au client',
  ],
  familles: [
    'situations-reporting-client', 'tresorerie-previsionnelle', 'previsionnel-business-plan', 'financement-aides',
    'remuneration-dirigeant', 'evaluation-transmission',
  ],
  servicesLies: [],
  logiciels: [
    'Microsoft Excel', 'RCA Évaluation', 'Qonto', 'Pennylane', 'Cegid Loop', 'ACD COMPTA', 'Sage 100 Comptabilité',
    'EBP Comptabilité', 'MyU',
  ],
  avatar: { src: '/agents/finance-256.webp', alt: 'Figurine Memlia, agent IA finance.' },
  demonstration: {
    tache: 'trésorerie prévisionnelle',
    dossier: 'Dossier fictif : la Menuiserie Pinson, SAS inventée, solde bancaire rapproché au 30/09/2026, projection jusqu’au 31/12/2026.',
    regle: 'La projection part du solde bancaire rapproché et n’ajoute que des flux datés et chiffrés : échéances connues (emprunts, salaires, TVA, cotisations) et factures émises ou reçues à leur date d’échéance future. Une facture déjà échue reste hors de la projection tant qu’une date future d’encaissement n’est pas validée ; elle peut faire l’objet d’un scénario séparé. Un flux sans date ni montant écrit, un solde non rapproché ou une hypothèse sans source reste hors de la projection et se présente au collaborateur.',
    cas: [
      { cas: 'Solde rapproché au 30/09 ; échéance d’emprunt, salaires et TVA datés', sortie: 'Projection semaine par semaine jusqu’à fin décembre, chaque flux avec sa source', issue: 'Préparé' },
      { cas: 'Facture client de 18 000 € échue depuis soixante jours', sortie: 'Encaissement exclu de la projection de départ ; scénario séparé en attente d’une date future d’encaissement validée', issue: 'À valider' },
      { cas: 'Semaine du 23/11, solde projeté sous le seuil d’alerte écrit du dossier', sortie: 'Tension signalée, les trois flux qui la causent listés', issue: 'À valider' },
      { cas: 'Grosse commande annoncée par le dirigeant, sans date ni montant écrit', sortie: 'Flux non intégré. Motif : hypothèse sans source', issue: 'Arrêt' },
    ],
  },
  fiche: {
    requete: "agent ia finance",
    h1: "Agent IA finance : vos situations et prévisionnels préparés pour la revue.",
    titreOnglet: "Agent IA finance : situations, trésorerie et prévisionnels | Memlia",
    descriptionLead: "Agent IA finance",
    description: "Agent IA finance pour cabinet comptable : situations, trésorerie et prévisionnels préparés depuis les comptes tenus. Chaque hypothèse attend votre revue.",
    chapeau: "Florent est l’agent IA Memlia pour les missions de conseil financier de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Il agrège, projette et met en forme ; vous validez chaque hypothèse et gardez le conseil au client.",
    serviceType: "Préparation des situations, projections de trésorerie et prévisionnels des clients du cabinet",
    eeat: {
      auteur: "kevin",
      datePublication: "2026-10-15",
      dateModification: "2026-10-15",
      sources: []
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/52-fiche-finance.webp",
      alt: "Rejoué sur un dossier fictif : la trésorerie de la Menuiserie Pinson, une projection préparée, deux scénarios à valider et une hypothèse sans source arrêtée."
    },
    taches: [
      {
        geste: "Préparer les situations intermédiaires",
        prepare: "Situation trimestrielle ou semestrielle tirée de la comptabilité tenue, retraitements proposés (stocks, charges à payer), commentaires de variation pré-rédigés.",
        famille: "situations-reporting-client"
      },
      {
        geste: "Tenir le tableau de bord du client",
        prepare: "Les indicateurs qu’il a choisis (chiffre d’affaires, marge, trésorerie, délais de paiement) mis à jour chaque mois ; seuils d’alerte signalés au collaborateur.",
        famille: "situations-reporting-client"
      },
      {
        geste: "Préparer le rendez-vous bilan",
        prepare: "Synthèse commentée, graphiques, points de conseil à aborder et questions ouvertes du dossier.",
        famille: "situations-reporting-client"
      },
      {
        geste: "Projeter la trésorerie",
        prepare: "Position rapprochée, encaissements et décaissements datés, semaine par semaine ; tensions signalées avec leurs causes.",
        famille: "tresorerie-previsionnelle"
      },
      {
        geste: "Construire le prévisionnel",
        prepare: "Compte de résultat prévisionnel et plan de financement bâtis depuis l’historique, chaque hypothèse écrite avec sa source.",
        famille: "previsionnel-business-plan"
      },
      {
        geste: "Comparer budget et réalisé",
        prepare: "Écarts du mois rapprochés du budget, comptes en cause listés, questions préparées pour le dirigeant.",
        famille: "previsionnel-business-plan"
      },
      {
        geste: "Monter le dossier de financement",
        prepare: "Prévisionnel, liasses, situation et pièces du dossier permanent assemblés dans l’ordre que demande l’établissement prêteur.",
        famille: "financement-aides"
      },
      {
        geste: "Repérer aides et crédits d’impôt à étudier",
        prepare: "Dispositifs à examiner selon l’activité et le territoire, justificatifs à réunir listés ; l’éligibilité se juge au cabinet.",
        famille: "financement-aides"
      },
      {
        geste: "Simuler la rémunération du dirigeant",
        prepare: "Scénarios salaire et dividendes calculés sur les barèmes de l’année, chaque hypothèse affichée.",
        famille: "remuneration-dirigeant"
      },
      {
        geste: "Préparer évaluation et transmission",
        prepare: "Retraitements, éléments chiffrés et versions du dossier réunis avant le tableau d’évaluation ; la valeur reste au cabinet.",
        famille: "evaluation-transmission"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "La situation semestrielle",
        texte: "Pour la Menuiserie Pinson : compte de résultat au 30/06, trois retraitements proposés, commentaire de variation prêt à relire."
      },
      {
        titre: "La trésorerie projetée semaine par semaine",
        texte: "La semaine en tension signalée avec ses causes : échéance d’emprunt, TVA et salaires."
      },
      {
        titre: "Le tableau de bord mensuel de chaque client",
        texte: "Mis à jour à chaque fin de mois tenue."
      }
    ],
    frontiere: [
      ["Agréger la comptabilité tenue", "Chaque hypothèse et chaque retraitement", "Le conseil au client"],
      ["Projeter les flux datés et chiffrés", "Chaque commentaire destiné au client", "Le choix des hypothèses d’avenir avec le dirigeant"],
      ["Mettre à jour indicateurs, tableaux et graphiques", "Chaque scénario de rémunération", "La valeur d’une entreprise"],
      ["Assembler les pièces d’un dossier de financement", "Chaque dossier avant transmission", "L’engagement du cabinet sur un document remis"]
    ],
    arrets: ["Pièce ou période de l’exercice absente.", "Retraitement sans justification écrite.", "Hypothèse sans source ni date."],
    neJamaisSansVous: [
      {
        envoi: "La situation, le tableau de bord ou le prévisionnel",
        validation: "remis au client par votre collaborateur, après revue de l’expert-comptable."
      },
      {
        envoi: "Le dossier de financement",
        validation: "transmis par votre cabinet ou par le client, après validation."
      },
      {
        envoi: "La simulation de rémunération",
        validation: "présentée au dirigeant par l’expert-comptable."
      }
    ],
    avecSans: [
      {
        sans: "Reconstruire la situation dans un tableur à chaque demande",
        avec: "Une situation préparée depuis la comptabilité tenue, que l’expert-comptable commente"
      },
      {
        sans: "Apprendre la tension de trésorerie quand le client appelle",
        avec: "Une tension signalée avec ses causes, que le collaborateur présente au client"
      },
      {
        sans: "Perdre la trace d’une hypothèse d’une version à l’autre",
        avec: "Chaque hypothèse sourcée et datée, que l’expert-comptable valide"
      },
      {
        sans: "Monter le dossier bancaire en cherchant les pièces",
        avec: "Un dossier assemblé dans l’ordre attendu, que le cabinet transmet"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Faut-il changer d’outil de prévisionnel ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. En finance, ce sont les données à rassembler, les hypothèses à tracer et les versions à tenir."
        },
        {
          question: "D’où viennent les chiffres ?",
          reponse: "De la comptabilité tenue par votre cabinet et des pièces du dossier. Une donnée extérieure n’entre qu’avec sa source et sa date."
        },
        {
          question: "Florent conseille-t-il vos clients ?",
          reponse: "Il prépare les chiffres, les scénarios et les points à aborder. Le conseil, la présentation et l’engagement du cabinet restent à l’expert-comptable."
        },
        {
          question: "Que devient une hypothèse du dirigeant sans chiffre ?",
          reponse: "Elle reste hors de la projection et rejoint la liste des questions à lui poser. Rien n’est estimé à sa place."
        },
        {
          question: "Florent peut-il préparer une évaluation ?",
          reponse: "Il réunit retraitements, éléments chiffrés et versions du dossier. La méthode retenue et la valeur restent au cabinet."
        }
      ]
    },
    tachesDepart: ["situations-reporting-client", "tresorerie-previsionnelle", "evaluation-transmission"],
    voisins: [
      {
        agent: "comptabilite",
        role: "avant",
        objet: "les comptes tenus"
      },
      {
        agent: "juridique-fiscal",
        role: "avant",
        objet: "les déclarations"
      },
      {
        agent: "relation-client",
        role: "apres",
        objet: "le rendez-vous avec le client"
      }
    ]
  },
};
