import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : protection-donnees (AGENTS-CONTENU.md §12, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const PROTECTION_DONNEES: Specialiste = {
  slug: 'protection-donnees',
  prenom: 'Prudence',
  libelle: 'Protection des données',
  groupe: 'vie-cabinet',
  teinte: 'numerique-it-data',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Prépare la mise à jour du registre des traitements et les réponses aux demandes d’accès des personnes concernées ; votre référent décide.',
  frontiereEnBref: [
    'Inventorier traitements, outils et sous-traitants',
    'Chaque réponse à une personne concernée',
    'La décision du responsable de traitement et de la personne qu’il a désignée',
  ],
  familles: [
    'registre-traitements', 'demandes-droits', 'rgpd-secret-securite', 'durees-conservation', 'incidents-donnees',
    'ai-act-conformite',
  ],
  servicesLies: [],
  logiciels: [
    'Modèle de registre des traitements', 'Microsoft Excel', 'Microsoft SharePoint', 'Microsoft OneDrive',
    'Microsoft Outlook', 'Gmail', 'Silae',
  ],
  avatar: { src: '/agents/protection-donnees-256.webp', alt: 'Figurine Memlia, agent IA protection donnees.' },
  demonstration: {
    tache: 'demande d’accès',
    dossier: 'Dossier fictif : le cabinet Alouette, cabinet inventé, demandes reçues en octobre 2026.',
    regle: 'Une demande d’accès d’une personne concernée, dont l’identité est vérifiée selon la règle du cabinet, déclenche la recherche de ses données dans les outils listés au registre, puis des éléments de réponse présentés traitement par traitement. Pour les traitements réalisés pour un client, ils sont destinés au responsable de traitement selon les instructions convenues ; le référent du cabinet ne répond directement que dans le périmètre autorisé. Une identité non vérifiée ou une demande venant d’une personne morale arrête la recherche ; un passage qui concerne aussi un tiers est isolé pour la décision du référent.',
    cas: [
      { cas: 'Salariée d’un client, identité vérifiée ; données dans la paie et la messagerie', sortie: 'Données retrouvées par traitement, éléments de réponse préparés pour l’employeur responsable du traitement, date limite suivie', issue: 'Préparé' },
      { cas: 'Courriel de la même salariée qui cite aussi un collègue', sortie: 'Passages concernant le tiers isolés pour la décision du responsable de traitement ou de son interlocuteur autorisé', issue: 'À valider' },
      { cas: 'Client particulier écrivant d’une adresse inconnue du dossier', sortie: 'Aucune recherche lancée. Motif : identité non vérifiée ; demande de justificatif préparée', issue: 'Arrêt' },
      { cas: 'Société cliente qui demande « toutes ses données personnelles »', sortie: 'Aucune recherche lancée. Motif : le droit d’accès appartient aux personnes physiques ; note au référent', issue: 'Arrêt' },
    ],
  },
  fiche: {
    requete: "rgpd expert comptable",
    h1: "RGPD de l’expert-comptable : mises à jour du registre des traitements préparées pour votre référent.",
    titreOnglet: "RGPD de l’expert-comptable : registre et demandes d’accès | Memlia",
    descriptionLead: "RGPD de l’expert-comptable",
    description: "RGPD de l’expert-comptable : mises à jour du registre des traitements, demandes d’accès et contrats préparés. Votre référent valide et décide de ce qui part.",
    chapeau: "Prudence est l’agent IA Memlia pour les tâches de protection des données de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Elle prépare les mises à jour du registre et les éléments de réponse. Votre cabinet tient ses registres ; le responsable de traitement ou son interlocuteur autorisé valide la réponse.",
    serviceType: "Préparation des mises à jour du registre des traitements et des demandes de droits",
    eeat: {
      auteur: "kevin",
      datePublication: "2026-10-15",
      dateModification: "2026-10-15",
      sources: [
        {
          editeur: "EUR-Lex",
          titre: "RGPD, article 30",
          url: "https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679",
          consulteLe: "2026-10-14",
          preuve: "Le responsable de traitement tient le registre ; l’agent en prépare la mise à jour.",
          mot: "Le registre reste celui que tient votre cabinet"
        },
        {
          editeur: "CNIL",
          titre: "Guide pratique RGPD : délégués à la protection des données",
          url: "https://www.cnil.fr/sites/cnil/files/atoms/files/guide_pratique_rgpd_-_delegues_a_la_protection_des_donnees.pdf",
          consulteLe: "2026-10-14",
          preuve: "Le guide lu le 14/10 distingue désignation obligatoire et recommandée ; aucun rôle de DPO n’est attribué à l’agent.",
          mot: "Désigner un DPO dépend de vos traitements"
        },
        {
          editeur: "EUR-Lex",
          titre: "RGPD, article 15",
          url: "https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679",
          consulteLe: "2026-10-14",
          preuve: "Le droit d’accès appartient à la personne physique concernée, pas à la société cliente pour elle-même.",
          mot: "Les personnes physiques concernées"
        },
        {
          editeur: "EUR-Lex",
          titre: "RGPD, article 12, paragraphe 3",
          url: "https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32016R0679",
          consulteLe: "2026-10-14",
          preuve: "Le délai est un mois à la réception, prolongeable de deux mois selon la complexité et le nombre de demandes avec information dans le premier mois.",
          mot: "Le délai légal court dès la réception"
        }
      ]
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/58-fiche-protection-donnees.webp",
      alt: "Rejoué sur un dossier fictif : quatre demandes d’accès au cabinet Alouette, une réponse préparée, un passage sur un tiers à valider et deux recherches arrêtées."
    },
    taches: [
      {
        geste: "Préparer la mise à jour du registre des traitements",
        prepare: "Tâche par tâche, depuis vos outils : finalité, données, destinataires et durée de chaque traitement ; lignes changées signalées au référent.",
        famille: "registre-traitements"
      },
      {
        geste: "Préparer la réponse à une demande d’accès",
        prepare: "Données de la personne concernée retrouvées dans les outils listés au registre, réponse rédigée traitement par traitement, délai suivi.",
        famille: "demandes-droits"
      },
      {
        geste: "Préparer les autres demandes de droits",
        prepare: "Rectification, effacement, opposition : données en cause listées, obligations de conservation qui s’y opposent signalées.",
        famille: "demandes-droits"
      },
      {
        geste: "Revoir les contrats de sous-traitance",
        prepare: "Clauses que le RGPD exige d’un contrat de sous-traitance repérées dans chaque contrat, manques listés.",
        famille: "rgpd-secret-securite"
      },
      {
        geste: "Suivre les durées de conservation",
        prepare: "Données arrivées au terme de leur durée listées par dossier, suppression ou archivage proposés.",
        famille: "durees-conservation"
      },
      {
        geste: "Préparer le dossier d’un incident",
        prepare: "Faits, données et personnes concernées rassemblés ; projet de notification préparé pour la décision du responsable de traitement.",
        famille: "incidents-donnees"
      },
      {
        geste: "Préparer l’analyse d’impact",
        prepare: "Trame remplie depuis le registre et la description du traitement, risques à apprécier listés.",
        famille: "rgpd-secret-securite"
      },
      {
        geste: "Préparer les mentions d’information",
        prepare: "Clause de la lettre de mission, politique de confidentialité, mentions des formulaires, relues à chaque tâche nouvelle.",
        famille: "rgpd-secret-securite"
      },
      {
        geste: "Préparer une copie pseudonymisée",
        prepare: "Noms et identifiants remplacés avant un essai ou un partage hors du cabinet ; la table de correspondance reste chez vous.",
        famille: "rgpd-secret-securite"
      },
      {
        geste: "Suivre les obligations liées à l’IA",
        prepare: "Outils d’IA du cabinet, données traitées, information des personnes et obligations du règlement européen sur l’IA pour un utilisateur, datées et sourcées.",
        famille: "ai-act-conformite"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "La mise à jour du registre des traitements",
        texte: "Après une tâche nouvelle : la ligne « collecte des variables de paie » complétée avec sa finalité, ses données, ses destinataires et sa durée."
      },
      {
        titre: "La réponse à la demande d’accès",
        texte: "Pour une salariée inventée d’un client inventé : données retrouvées dans la paie et la messagerie, réponse rédigée, date limite posée."
      },
      {
        titre: "La revue des contrats de vos sous-traitants",
        texte: "Chaque contrat repris clause par clause."
      }
    ],
    frontiere: [
      [
        "Inventorier traitements, outils et sous-traitants",
        "Chaque ligne du registre",
        "La décision du responsable de traitement et de la personne qu’il a désignée"
      ],
      ["Retrouver les données d’une personne concernée", "Chaque réponse à une personne concernée", "L’appréciation d’un risque ou d’un incident"],
      ["Rédiger les mises à jour du registre, les réponses, trames et mentions", "Chaque proposition de suppression", "Toute notification"],
      ["Suivre délais et durées de conservation", "Chaque mention d’information", "La désignation d’un délégué à la protection des données"]
    ],
    arrets: [
      "Identité du demandeur non vérifiée.",
      "Demande venant d’une personne morale, ou donnée qui concerne aussi un tiers.",
      "Traitement absent du registre, ou sous-traitant sans contrat."
    ],
    neJamaisSansVous: [
      {
        envoi: "La réponse à une personne concernée",
        validation: "envoyée par le responsable de traitement ou par son interlocuteur autorisé."
      },
      {
        envoi: "La notification d’un incident",
        validation: "décidée et faite par le responsable de traitement."
      },
      {
        envoi: "La suppression de données",
        validation: "faite par votre cabinet, après décision."
      },
      {
        envoi: "La mise à jour du registre des traitements",
        validation: "validée par votre référent."
      }
    ],
    avecSans: [
      {
        sans: "Un registre écrit une fois, jamais relu",
        avec: "Un registre mis à jour à chaque tâche nouvelle, que le référent valide"
      },
      {
        sans: "Une demande d’accès qui arrive sans que personne sache où chercher",
        avec: "Les données retrouvées outil par outil, que le référent relit"
      },
      {
        sans: "Des contrats de sous-traitance jamais relus",
        avec: "Les clauses manquantes listées, que l’associé fait corriger"
      },
      {
        sans: "Des données gardées faute de savoir quand les supprimer",
        avec: "Les durées échues listées, dont le cabinet décide la suppression"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Prudence remplace-t-elle votre délégué à la protection des données ?",
          reponse: "Notre agent IA n’est pas votre délégué à la protection des données : il prépare, la personne que vous avez désignée décide. Le registre reste celui que tient votre cabinet."
        },
        {
          question: "Votre cabinet doit-il désigner un délégué ?",
          reponse: "Désigner un DPO dépend de vos traitements : votre cabinet en juge ; la CNIL le recommande même lorsqu’il n’est pas obligatoire. Prudence rassemble les éléments qui éclairent ce choix."
        },
        {
          question: "Qui peut demander l’accès à ses données ?",
          reponse: "Les personnes physiques concernées : clients particuliers, salariés de vos clients, collaborateurs. Une société cliente n’exerce pas ce droit pour elle-même. Nous identifions d’abord le rôle du cabinet. Pour les traitements réalisés pour un client, les éléments sont préparés pour son responsable de traitement, selon les instructions convenues. Votre référent ne répond directement que dans le périmètre autorisé."
        },
        {
          question: "Quel est le délai de réponse ?",
          reponse: "Le délai légal court dès la réception : un mois, prolongeable de deux mois dans les cas prévus, en informant la personne. Prudence pose la date au calendrier dès que la demande arrive."
        },
        {
          question: "Comment vos données sont-elles traitées pendant la tâche ?",
          reponse: "Fichiers lus en place, accès limités à la tâche, jeu d’essai fictif avant tout vrai dossier. Le détail est sur la page Garanties."
        },
        {
          question: "Faut-il changer d’outil pour le registre ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. Le registre peut rester dans le modèle de la CNIL ou dans votre tableur ; nous en préparons la mise à jour."
        }
      ]
    },
    tachesDepart: ["registre-traitements", "demandes-droits", "rgpd-secret-securite"],
    voisins: [
      {
        agent: "informatique-outils",
        role: "a-cote",
        objet: "l’inventaire des outils"
      },
      {
        agent: "rh-cabinet",
        role: "a-cote",
        objet: "les données de l’équipe"
      },
      {
        agent: "commercial",
        role: "a-cote",
        objet: "les mentions de la lettre de mission"
      }
    ]
  },
};
