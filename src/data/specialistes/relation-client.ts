import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : relation-client (AGENTS-CONTENU.md §8, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const RELATION_CLIENT: Specialiste = {
  slug: 'relation-client',
  prenom: 'Émile',
  libelle: 'Relation client',
  groupe: 'relation-client',
  teinte: 'administratif-secretariat',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Trie chaque demande de vos clients, la relie à son dossier et prépare la réponse ; votre collaborateur la valide et l’envoie.',
  frontiereEnBref: [
    'Trier, relier au dossier et prioriser',
    'Chaque réponse avant envoi',
    'Toute réponse qui engage le cabinet ou donne un conseil',
  ],
  familles: [
    'boite-mail-courriers', 'suivi-demandes-clients', 'envois-plaquettes-documents', 'rendez-vous-agenda',
    'offboarding-transfert', 'satisfaction-clients',
  ],
  servicesLies: [],
  logiciels: ['Microsoft Outlook', 'Gmail', 'Microsoft SharePoint', 'Microsoft OneDrive', 'Google Drive', 'Microsoft Excel'],
  avatar: { src: '/agents/relation-client-256.webp', alt: 'Figurine Memlia, agent IA relation client.' },
  demonstration: {
    tache: 'tri et réponse',
    dossier: 'Dossier fictif : la boîte partagée d’un cabinet inventé, messages du 12/10/2026 sur le dossier Fauvette (SARL de fleuristerie inventée).',
    regle: 'Un message reçoit une réponse préparée quand son expéditeur est relié à un dossier et que sa demande correspond à l’une des réponses types écrites par le cabinet, remplie avec les données du dossier ; un expéditeur inconnu est rapproché du dossier probable, à confirmer. Une demande hors des réponses types, dont toute demande de conseil, ou une pièce jointe illisible arrête la réponse et place le message devant le collaborateur du dossier.',
    cas: [
      { cas: 'La gérante de Fauvette demande la date de sa prochaine déclaration de TVA', sortie: 'Réponse rédigée avec la date du calendrier du dossier', issue: 'Préparé' },
      { cas: 'La gérante demande la plaquette de l’exercice 2025', sortie: 'Plaquette retrouvée dans le dossier, envoi préparé', issue: 'Préparé' },
      { cas: 'Message d’une adresse inconnue, facture en pièce jointe', sortie: 'Pièce mise de côté, dossier probable proposé', issue: 'À valider' },
      { cas: 'La gérante demande s’il vaut mieux acheter ou louer sa camionnette', sortie: 'Aucune réponse rédigée. Motif : demande de conseil, hors des réponses types ; message placé devant l’expert-comptable', issue: 'Arrêt' },
    ],
  },
  fiche: {
    requete: "relation client cabinet comptable",
    h1: "Relation client en cabinet comptable : réponses préparées, votre collaborateur valide et envoie.",
    titreOnglet: "Relation client en cabinet comptable : réponses préparées | Memlia",
    descriptionLead: "Relation client en cabinet comptable",
    description: "Relation client en cabinet comptable : demandes triées, reliées au dossier et réponses courantes préparées. Votre collaborateur valide et fait chaque envoi.",
    chapeau: "Émile est l’agent IA Memlia pour la relation client de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Il trie les demandes et prépare les réponses courantes ; votre collaborateur valide et envoie, l’expert-comptable garde le conseil.",
    serviceType: "Préparation du tri des demandes, des réponses et des envois aux clients du cabinet",
    eeat: {
      auteur: "kevin",
      datePublication: "2026-10-15",
      dateModification: "2026-10-15",
      sources: []
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/55-fiche-relation-client.webp",
      alt: "Rejoué sur un dossier fictif : quatre messages sur le dossier Fauvette, deux réponses préparées, une adresse à confirmer et un arrêt sur une demande de conseil."
    },
    taches: [
      {
        geste: "Trier la boîte partagée",
        prepare: "Chaque message classé par client, par dossier et par priorité ; échéance proche ou courrier d’un organisme placé en tête.",
        famille: "boite-mail-courriers"
      },
      {
        geste: "Relier chaque demande à son dossier",
        prepare: "Expéditeur reconnu, demande rattachée au dossier, collaborateur du dossier prévenu.",
        famille: "boite-mail-courriers"
      },
      {
        geste: "Préparer les réponses courantes",
        prepare: "Échéance, document, accès au portail : réponse rédigée depuis vos réponses types et les données du dossier.",
        famille: "boite-mail-courriers"
      },
      {
        geste: "Accuser réception et classer les pièces",
        prepare: "Accusé de réception préparé, pièces jointes renommées et rangées dans le dossier selon votre plan.",
        famille: "boite-mail-courriers"
      },
      {
        geste: "Rattacher le courrier numérisé",
        prepare: "Courrier papier scanné et lu, rattaché au dossier, échéance ou montant repéré.",
        famille: "boite-mail-courriers"
      },
      {
        geste: "Suivre les demandes en attente",
        prepare: "Demandes restées sans réponse au-delà du délai que fixe le cabinet, par dossier ; vue du pôle en agrégats.",
        famille: "suivi-demandes-clients"
      },
      {
        geste: "Suivre les envois périodiques",
        prepare: "Plaquettes, attestations, documents annuels : ce qui est parti et ce qui reste à envoyer, pour chaque dossier.",
        famille: "envois-plaquettes-documents"
      },
      {
        geste: "Préparer les rendez-vous clients",
        prepare: "Ordre du jour, pièces et points ouverts du dossier ; invitation rédigée, créneau proposé.",
        famille: "rendez-vous-agenda"
      },
      {
        geste: "Préparer la fin de mission et le transfert",
        prepare: "Inventaire des documents à remettre, courrier au confrère, accès à clore.",
        famille: "offboarding-transfert"
      },
      {
        geste: "Recueillir l’avis des clients",
        prepare: "Questionnaire après le bilan préparé, réponses rassemblées en agrégats pour l’associé.",
        famille: "satisfaction-clients"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "La boîte partagée du lundi matin, triée",
        texte: "Chaque message avec son dossier, sa priorité et le collaborateur concerné."
      },
      {
        titre: "Trois réponses courantes prêtes à valider",
        texte: "La date d’une échéance, l’envoi d’une attestation, l’accès au portail."
      },
      {
        titre: "Le suivi des envois annuels",
        texte: "Plaquettes et attestations suivies pour chaque dossier."
      }
    ],
    frontiere: [
      ["Trier, relier au dossier et prioriser", "Chaque réponse avant envoi", "Toute réponse qui engage le cabinet ou donne un conseil"],
      ["Rédiger réponses types et accusés de réception", "Chaque envoi de document", "Une réclamation ou un désaccord"],
      ["Classer pièces jointes et courrier", "Chaque invitation", "La décision de transférer un dossier"],
      ["Préparer rendez-vous et envois périodiques", "Chaque courrier de fin de mission", "Le ton d’une relation difficile"]
    ],
    arrets: [
      "Expéditeur relié à aucun dossier, ou à plusieurs.",
      "Demande hors des réponses types écrites, dont toute demande de conseil.",
      "Pièce jointe illisible, ou destinée à un autre dossier."
    ],
    neJamaisSansVous: [
      {
        envoi: "La réponse au client et l’accusé de réception",
        validation: "envoyés par le collaborateur du dossier."
      },
      {
        envoi: "La plaquette, l’attestation ou le document annuel",
        validation: "envoyés par le collaborateur."
      },
      {
        envoi: "L’invitation à un rendez-vous",
        validation: "envoyée par le collaborateur."
      },
      {
        envoi: "Le courrier au confrère",
        validation: "signé par l’expert-comptable."
      },
      {
        envoi: "Le questionnaire de satisfaction",
        validation: "envoyé par le cabinet."
      }
    ],
    avecSans: [
      {
        sans: "Une boîte partagée lue par tout le monde et traitée par personne",
        avec: "Une boîte triée chaque matin, où chaque collaborateur trouve ses dossiers"
      },
      {
        sans: "La même réponse réécrite à chaque demande",
        avec: "Une réponse type remplie avec le dossier, que le collaborateur valide"
      },
      {
        sans: "Une pièce jointe perdue dans un fil de messages",
        avec: "Une pièce rangée dans son dossier, que le collaborateur retrouve"
      },
      {
        sans: "Une demande oubliée, découverte quand le client relance",
        avec: "Les demandes en attente visibles par dossier, que le responsable de pôle suit"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Émile lit-il les boîtes personnelles de vos collaborateurs ?",
          reponse: "Il travaille sur les boîtes partagées et sur celles que vos collaborateurs lui confient. Aucune mesure ne porte sur une personne : le suivi se lit par dossier et en agrégats."
        },
        {
          question: "Une réponse peut-elle partir sans validation ?",
          reponse: "Chaque réponse attend la validation du collaborateur du dossier. L’envoi reste son geste."
        },
        {
          question: "Que devient une demande de conseil ?",
          reponse: "La règle la reconnaît et s’arrête : aucune réponse n’est rédigée. Le message passe devant l’expert-comptable, avec le dossier ouvert."
        },
        {
          question: "Faut-il changer de messagerie ou de portail client ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. Votre messagerie et votre portail restent en place ; nous trions, relions et préparons dans ces outils."
        },
        {
          question: "Qui voit les messages de vos clients ?",
          reponse: "Les messages sont lus en place, dans votre messagerie, avec les seuls accès ouverts pour la tâche. La règle est rejouée sur une boîte fictive avant de toucher la vôtre."
        }
      ]
    },
    tachesDepart: ["boite-mail-courriers", "envois-plaquettes-documents", "rendez-vous-agenda"],
    voisins: [
      {
        agent: "commercial",
        role: "avant",
        objet: "le nouveau client"
      },
      {
        agent: "comptabilite",
        role: "a-cote",
        objet: "le dossier comptable derrière chaque demande"
      },
      {
        agent: "juridique-fiscal",
        role: "a-cote",
        objet: "les échéances derrière chaque demande"
      },
      {
        agent: "finance",
        role: "a-cote",
        objet: "les chiffres à présenter au client"
      }
    ]
  },
};
