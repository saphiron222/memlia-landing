import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : commercial (AGENTS-CONTENU.md §6, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const COMMERCIAL: Specialiste = {
  slug: 'commercial',
  prenom: 'Victoire',
  libelle: 'Commercial',
  groupe: 'relation-client',
  teinte: 'developpement-cabinet',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Prépare propositions, entrée en relation et lettres de mission ; l’acceptation du client et la vigilance restent à votre cabinet.',
  frontiereEnBref: [
    'Chiffrer depuis votre barème écrit',
    'Chaque proposition et son prix',
    'L’appréciation du risque et la vigilance LCB-FT',
  ],
  familles: ['suivi-prospects', 'propositions-mission', 'onboarding-client', 'lettre-de-mission-lcbft'],
  servicesLies: [],
  logiciels: [
    'Youtrust', 'Docusign', 'jesignexpert.com', 'Kanta', 'Répertoire Sirene', 'Registre national des entreprises',
    'Microsoft Outlook', 'Gmail', 'Microsoft Excel',
  ],
  avatar: { src: '/agents/commercial-256.webp', alt: 'Figurine Memlia, agent IA commercial.' },
  demonstration: {
    tache: 'entrée en relation',
    dossier: 'Dossier fictif : le Studio Rouge-Gorge, SAS de design graphique inventée, entrée en relation ouverte le 01/10/2026.',
    regle: 'Une entrée en relation avance d’un jalon quand chaque pièce que votre règle de vigilance demande pour ce jalon est reçue, lisible et en cours de validité ; une pièce expirée déclenche une nouvelle demande. Une pièce illisible, un bénéficiaire effectif non identifié ou un jalon franchi sans l’accord écrit de l’associé arrête le dossier et le présente à l’associé.',
    cas: [
      { cas: 'Statuts, extrait d’immatriculation et pièce d’identité de la présidente reçus et lisibles', sortie: 'Jalon « identification de la société » complet, pièces classées dans le dossier', issue: 'Préparé' },
      { cas: 'Pièce d’identité du second associé expirée depuis mars', sortie: 'Pièce signalée, nouvelle demande rédigée pour le dirigeant', issue: 'À valider' },
      { cas: 'Société détenue à 60 % par une holding dont les associés ne sont pas connus', sortie: 'Dossier bloqué. Motif : bénéficiaire effectif non identifié', issue: 'Arrêt' },
      { cas: 'Proposition acceptée, toutes les pièces du jalon reçues', sortie: 'Projet de lettre de mission prêt à relire, honoraires repris de la proposition', issue: 'À valider' },
    ],
  },
  fiche: {
    requete: "agent ia commercial",
    h1: "Agent IA commercial : les propositions prêtes, votre cabinet choisit et envoie.",
    titreOnglet: "Agent IA commercial pour cabinet comptable | Memlia",
    descriptionLead: "Agent IA commercial",
    description: "Agent IA commercial pour cabinet comptable : propositions, pièces d’entrée en relation et lettres de mission préparées. L’associé accepte le client et envoie.",
    chapeau: "Victoire est l’agent IA Memlia pour les tâches commerciales de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Elle prépare propositions, pièces et lettres de mission ; votre cabinet garde l’acceptation du client, la vigilance et chaque envoi.",
    serviceType: "Préparation des propositions de mission, du suivi commercial et des dossiers d’entrée en relation",
    eeat: {
      auteur: "kevin",
      datePublication: "2026-10-15",
      dateModification: "2026-10-15",
      sources: [
        {
          editeur: "Légifrance",
          titre: "Code monétaire et financier, article L.561-5",
          url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033517742",
          consulteLe: "2026-10-14",
          preuve: "La vigilance relève du professionnel assujetti ; le service rassemble les pièces demandées par la règle du cabinet.",
          mot: "À l’entrée en relation"
        },
        {
          editeur: "Légifrance",
          titre: "Code monétaire et financier, article L.561-15",
          url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033517847",
          consulteLe: "2026-10-14",
          preuve: "La déclaration est une obligation du professionnel ; L.561-18 en protège la confidentialité, hors des préparations de Memlia.",
          mot: "La déclaration de soupçon appartient au professionnel assujetti"
        },
        {
          editeur: "Insee",
          titre: "Sirene : immatriculation, cessation ou modification",
          url: "https://www.insee.fr/fr/information/7731865",
          consulteLe: "2026-10-15",
          preuve: "Le répertoire renseigne les inscriptions et données administratives ; il n’établit aucun droit de contacter une entreprise.",
          mot: "sa source"
        }
      ]
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/53-fiche-commercial.webp",
      alt: "Rejoué sur un dossier fictif : l’entrée en relation du Studio Rouge-Gorge, les pièces classées, deux préparations à valider et un arrêt pour bénéficiaire effectif non identifié."
    },
    taches: [
      {
        geste: "Repérer les entreprises à contacter",
        prepare: "Entreprises récemment inscrites au répertoire Sirene dans vos secteurs et sur votre territoire, listées avec leur source. Un premier message est préparé ; l’associé choisit qui contacter et fait chaque envoi.",
        famille: "suivi-prospects"
      },
      {
        geste: "Qualifier les demandes entrantes",
        prepare: "Formulaire, courriel ou appel noté : activité, forme sociale, effectif, besoin ; fiche prospect complétée des données publiques.",
        famille: "suivi-prospects"
      },
      {
        geste: "Préparer le premier rendez-vous",
        prepare: "Fiche du prospect, questions à poser, pièces à demander, points que votre règle de vigilance fait vérifier.",
        famille: "suivi-prospects"
      },
      {
        geste: "Chiffrer la proposition de mission",
        prepare: "Périmètre et honoraires calculés depuis votre barème écrit, options présentées, proposition mise en page aux couleurs du cabinet.",
        famille: "propositions-mission"
      },
      {
        geste: "Relancer les propositions en attente",
        prepare: "Date d’envoi, montant et prochaine relance de chaque proposition ; brouillon de relance prêt au moment prévu.",
        famille: "suivi-prospects"
      },
      {
        geste: "Réunir les pièces d’entrée en relation",
        prepare: "Liste par jalon selon votre règle de vigilance (identité, bénéficiaires effectifs, statuts, extrait d’immatriculation), manquants réclamés en les nommant.",
        famille: "onboarding-client"
      },
      {
        geste: "Préparer le dossier d’appréciation du risque",
        prepare: "Pièces et informations rassemblées pour la décision de l’associé, sans appréciation à sa place.",
        famille: "lettre-de-mission-lcbft"
      },
      {
        geste: "Rédiger la lettre de mission",
        prepare: "Projet tiré de votre modèle, des données du dossier et de la proposition acceptée, prêt pour la signature électronique.",
        famille: "lettre-de-mission-lcbft"
      },
      {
        geste: "Ouvrir le dossier dans vos outils",
        prepare: "Fiche créée dans la comptabilité, la paie et la GED selon votre plan de classement ; reprise d’un dossier transmis par un confrère préparée (pièces demandées, balance d’entrée contrôlée).",
        famille: "onboarding-client"
      },
      {
        geste: "Renouveler les lettres de mission",
        prepare: "Lettres échues ou à réviser listées, mises à jour selon le barème en vigueur, prêtes à signer.",
        famille: "lettre-de-mission-lcbft"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "La proposition de mission",
        texte: "Pour le Studio Rouge-Gorge : tenue, paie de quatre salariés, juridique annuel ; honoraires calculés depuis votre barème, deux options."
      },
      {
        titre: "La liste des pièces d’entrée en relation par jalon",
        texte: "Avec le brouillon de demande au dirigeant."
      },
      {
        titre: "Le suivi des propositions envoyées",
        texte: "Date, montant, prochaine relance et état de chacune."
      }
    ],
    frontiere: [
      ["Noter et qualifier les demandes", "Chaque proposition et son prix", "L’acceptation de la mission"],
      ["Chiffrer depuis votre barème écrit", "Chaque demande de pièces au prospect", "L’appréciation du risque et la vigilance LCB-FT"],
      [
        "Préparer rendez-vous, propositions et lettres depuis vos modèles",
        "Chaque projet de lettre de mission",
        "La déclaration de soupçon, hors de tout ce que nous préparons"
      ],
      ["Réunir, classer et suivre les pièces d’entrée", "Chaque relance de prospect", "Le choix de qui contacter, et la signature"]
    ],
    arrets: [
      "Pièce illisible, ou pièce expirée restée sans remplacement.",
      "Bénéficiaire effectif non identifié.",
      "Prix hors du barème écrit, ou jalon franchi sans l’accord écrit de l’associé."
    ],
    neJamaisSansVous: [
      {
        envoi: "La proposition de mission",
        validation: "envoyée au prospect par l’associé."
      },
      {
        envoi: "La demande de pièces",
        validation: "envoyée par votre collaborateur."
      },
      {
        envoi: "La lettre de mission",
        validation: "mise en signature par votre cabinet."
      },
      {
        envoi: "La relance d’un prospect",
        validation: "envoyée par l’associé ou le collaborateur qui suit le contact."
      }
    ],
    avecSans: [
      {
        sans: "Rédiger chaque proposition en repartant d’un ancien devis",
        avec: "Une proposition chiffrée depuis votre barème, que l’associé ajuste et envoie"
      },
      {
        sans: "Oublier une proposition restée sans réponse",
        avec: "Chaque proposition suivie, la relance prête que l’associé envoie"
      },
      {
        sans: "Courir après les pièces d’identification une fois la mission commencée",
        avec: "Les pièces réunies jalon par jalon, que le collaborateur vérifie"
      },
      {
        sans: "Laisser des lettres de mission échues sans renouvellement",
        avec: "Les lettres à renouveler listées, que l’associé fait signer"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Victoire décide-t-elle de la vigilance LCB-FT ?",
          reponse: "À l’entrée en relation, nous réunissons les pièces que votre règle de vigilance demande ; l’appréciation et l’acceptation du client restent à votre cabinet. La déclaration de soupçon appartient au professionnel assujetti ; elle reste hors de tout ce que nous préparons."
        },
        {
          question: "La lettre de mission part-elle seule en signature ?",
          reponse: "Le projet attend la relecture de l’associé, puis votre cabinet le met en signature. Le retour signé est suivi et classé dans le dossier."
        },
        {
          question: "D’où viennent les prix des propositions ?",
          reponse: "De votre barème écrit et des options que vous proposez. Un périmètre que le barème ne couvre pas arrête la proposition et la présente à l’associé."
        },
        {
          question: "Victoire contacte-t-elle des prospects à votre place ?",
          reponse: "Elle prépare la liste, avec sa source, et un premier message. L’associé choisit qui contacter, vérifie les conditions de sollicitation et les oppositions, puis fait chaque envoi."
        },
        {
          question: "Faut-il changer d’outil de signature ou de suivi commercial ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. Votre outil de signature garde l’envoi et la preuve ; nous préparons ce qui arrive avant et suivons ce qui revient."
        }
      ]
    },
    tachesDepart: ["onboarding-client", "lettre-de-mission-lcbft", "propositions-mission"],
    voisins: [
      {
        agent: "communication",
        role: "avant",
        objet: "la parole du cabinet"
      },
      {
        agent: "relation-client",
        role: "apres",
        objet: "le dossier ouvert"
      },
      {
        agent: "comptabilite",
        role: "apres",
        objet: "le dossier comptable ouvert"
      },
      {
        agent: "paie-social",
        role: "apres",
        objet: "le dossier de paie ouvert"
      }
    ]
  },
};
