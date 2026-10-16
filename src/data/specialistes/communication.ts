import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : communication (AGENTS-CONTENU.md §7, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const COMMUNICATION: Specialiste = {
  slug: 'communication',
  prenom: 'Colette',
  libelle: 'Communication',
  groupe: 'relation-client',
  teinte: 'developpement-cabinet',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Rédige la lettre d’information et l’actualité de vos clients depuis les sources officielles ; vous la relisez et l’envoyez.',
  frontiereEnBref: [
    'Lire les sources officielles et repérer les changements',
    'Chaque texte avant envoi ou publication',
    'Le choix des sujets et la parole du cabinet',
  ],
  familles: ['actualite-a-diffuser', 'lettre-information-clients', 'publications-cabinet'],
  servicesLies: [],
  logiciels: ['Microsoft Outlook', 'Gmail', 'Microsoft SharePoint', 'Google Drive', 'Brevo', 'Mailchimp'],
  avatar: { src: '/agents/communication-256.webp', alt: 'Figurine Memlia, agent IA communication.' },
  demonstration: {
    tache: 'lettre d’information',
    dossier: 'Dossier fictif : le cabinet Alouette, cabinet inventé, lettre d’information d’octobre 2026.',
    regle: 'Un sujet entre dans la lettre s’il a été retenu par le cabinet et que chaque règle citée renvoie à une source officielle datée ; le texte suit le ton et les formules écrites pour le cabinet. Une source absente ou non officielle, une date d’application incertaine ou un destinataire hors de la liste autorisée arrête le sujet, ou l’envoi.',
    cas: [
      { cas: 'Sujet retenu : réception des factures électroniques, source officielle lue', sortie: 'Paragraphe rédigé autour de la phrase « Depuis le 1er septembre 2026, toute entreprise établie en France et assujettie à la TVA doit pouvoir recevoir ses factures électroniques. », lien vers la source', issue: 'Préparé' },
      { cas: 'Sujet proposé par la veille, pas encore retenu par l’associé', sortie: 'Sujet placé en attente au calendrier, résumé joint', issue: 'À valider' },
      { cas: 'Liste de diffusion qui contient trois clients sortis du portefeuille', sortie: 'Destinataires en cause listés, envoi suspendu jusqu’à la décision de l’associé', issue: 'À valider' },
      { cas: 'Barème repris d’un article de presse, sans texte officiel', sortie: 'Aucun paragraphe rédigé. Motif : source non officielle', issue: 'Arrêt' },
    ],
  },
  fiche: {
    requete: "newsletter expert comptable",
    h1: "Newsletter d’expert-comptable : l’agent IA rédige, votre cabinet relit et envoie.",
    titreOnglet: "Newsletter d’expert-comptable : la lettre préparée | Memlia",
    descriptionLead: "Newsletter d’expert-comptable",
    description: "Newsletter d’expert-comptable : veille officielle, lettre d’information et publications préparées dans le ton du cabinet. Votre équipe relit, choisit et envoie.",
    chapeau: "Colette est l’agent IA Memlia pour la communication de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Elle rédige depuis les sources officielles et s’arrête si une règle manque de source datée ; votre cabinet relit, publie et envoie.",
    serviceType: "Préparation de la lettre d’information clients et des publications du cabinet",
    eeat: {
      auteur: "kevin",
      datePublication: "2026-10-15",
      dateModification: "2026-10-15",
      sources: [
        {
          editeur: "Ministère de l’Économie",
          titre: "Tout savoir sur la facturation électronique pour les entreprises",
          url: "https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises",
          consulteLe: "2026-10-14",
          preuve: "Le calendrier de réception au 1er septembre 2026 borne le sujet du rejeu fictif. La fiche ne promet ni émission ni transmission de factures.",
          mot: "La réception des factures électroniques"
        }
      ]
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/54-fiche-communication.webp",
      alt: "Rejoué sur un dossier fictif : la lettre d’information du cabinet Alouette, un sujet préparé, deux choix à valider et un arrêt faute de source officielle."
    },
    taches: [
      {
        geste: "Suivre l’actualité utile à vos clients",
        prepare: "Sources officielles lues (Légifrance, BOFiP, Urssaf, service-public.fr), changements qui touchent votre portefeuille repérés et résumés pour l’associé.",
        famille: "actualite-a-diffuser"
      },
      {
        geste: "Rédiger la lettre d’information",
        prepare: "La lettre du mois écrite depuis les sujets retenus, dans le ton de votre cabinet, chaque règle reliée à sa source officielle.",
        famille: "lettre-information-clients"
      },
      {
        geste: "Adapter une note à un secteur",
        prepare: "Le même sujet réécrit pour un groupe de clients (artisans, commerçants, professions libérales), avec des exemples de leur métier.",
        famille: "actualite-a-diffuser"
      },
      {
        geste: "Préparer les rappels collectifs",
        prepare: "Déclaration de revenus, clôtures, obligation nouvelle : message à un groupe de clients, avec les pièces à préparer.",
        famille: "lettre-information-clients"
      },
      {
        geste: "Rédiger les publications du cabinet",
        prepare: "Publications LinkedIn et articles du site tirés de l’actualité et des travaux du cabinet, prêts à relire.",
        famille: "publications-cabinet"
      },
      {
        geste: "Tenir le calendrier éditorial",
        prepare: "Sujets, dates, canaux et état de relecture sur le trimestre, haute saison comprise.",
        famille: "publications-cabinet"
      },
      {
        geste: "Préparer les invitations aux événements",
        prepare: "Matinale, webinaire, réunion d’information : invitation, rappel et support de présentation.",
        famille: "publications-cabinet"
      },
      {
        geste: "Mettre à jour la présentation du cabinet",
        prepare: "Plaquette de présentation, page équipe et pages de services relues et mises à jour.",
        famille: "publications-cabinet"
      },
      {
        geste: "Lire les retours en agrégats",
        prepare: "Sujets les plus lus et questions reçues après chaque envoi, sans suivi lecteur par lecteur.",
        famille: "publications-cabinet"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "La lettre d’information d’octobre",
        texte: "Pour le cabinet Alouette : trois sujets retenus par l’associé, chaque règle reliée à sa source officielle, prête à relire."
      },
      {
        titre: "La note « artisans du bâtiment »",
        texte: "Tirée du même sujet, avec le ton et les exemples adaptés au secteur."
      },
      {
        titre: "Le calendrier éditorial du trimestre",
        texte: "Chaque publication préparée avec son état de relecture."
      }
    ],
    frontiere: [
      ["Lire les sources officielles et repérer les changements", "Chaque sujet retenu", "Le choix des sujets et la parole du cabinet"],
      ["Résumer, rédiger et mettre en forme", "Chaque texte avant envoi ou publication", "Le conseil personnalisé à un client"],
      ["Adapter un sujet à un secteur", "Chaque liste de destinataires", "La publication et l’envoi"],
      ["Tenir le calendrier et lire les retours en agrégats", "Chaque publication programmée", "La réponse aux réactions publiques"]
    ],
    arrets: [
      "Règle citée sans source officielle datée.",
      "Date d’application incertaine, ou texte encore en projet.",
      "Destinataire hors de la liste que le cabinet a autorisée."
    ],
    neJamaisSansVous: [
      {
        envoi: "La lettre d’information",
        validation: "envoyée par votre cabinet après relecture de l’associé."
      },
      {
        envoi: "La publication LinkedIn ou l’article du site",
        validation: "publiés par votre cabinet."
      },
      {
        envoi: "L’invitation à un événement",
        validation: "envoyée par votre cabinet."
      },
      {
        envoi: "Le rappel collectif",
        validation: "envoyé par le collaborateur en charge."
      }
    ],
    avecSans: [
      {
        sans: "Une lettre repoussée de mois en mois, faute de temps",
        avec: "Une lettre prête chaque mois, que l’associé relit et envoie"
      },
      {
        sans: "Une actualité recopiée d’une revue sans vérifier sa date",
        avec: "Chaque règle reliée à sa source officielle, que le collaborateur vérifie"
      },
      {
        sans: "Le même texte envoyé à tous les clients",
        avec: "Une version par secteur, dont l’associé choisit les destinataires"
      },
      {
        sans: "Une page du cabinet muette pendant la haute saison",
        avec: "Un calendrier tenu à l’avance, que le cabinet publie"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Colette publie-t-elle sur les réseaux du cabinet ?",
          reponse: "Elle prépare chaque publication et la place au calendrier. La publication reste un geste du cabinet, après relecture."
        },
        {
          question: "D’où vient l’actualité ?",
          reponse: "Des sources officielles : textes, doctrine administrative, pages des organismes. Un article de presse sert de signal, et la règle n’entre dans la lettre qu’avec sa source officielle. La réception des factures électroniques du rejeu suit le calendrier de l’administration."
        },
        {
          question: "La lettre ressemblera-t-elle à celle de tous les cabinets ?",
          reponse: "Elle part de vos sujets, de vos secteurs de clients et du ton de votre cabinet. Chaque lettre se relit avant envoi, et vos corrections enrichissent la règle."
        },
        {
          question: "Qui choisit les sujets ?",
          reponse: "L’associé, ou la personne en charge de la communication. Colette propose, à partir de la veille, ce qui touche votre portefeuille."
        },
        {
          question: "Faut-il changer d’outil d’envoi ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. Votre outil d’envoi garde la liste et l’expédition ; nous préparons le contenu et le calendrier."
        }
      ]
    },
    tachesDepart: ["lettre-information-clients", "actualite-a-diffuser", "publications-cabinet"],
    voisins: [
      {
        agent: "commercial",
        role: "apres",
        objet: "le prospect qui répond"
      },
      {
        agent: "relation-client",
        role: "a-cote",
        objet: "les questions des clients"
      },
      {
        agent: "juridique-fiscal",
        role: "a-cote",
        objet: "les échéances à rappeler"
      }
    ]
  },
};
