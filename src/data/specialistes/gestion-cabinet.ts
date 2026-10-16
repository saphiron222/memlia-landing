import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : gestion-cabinet (AGENTS-CONTENU.md §9, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const GESTION_CABINET: Specialiste = {
  slug: 'gestion-cabinet',
  prenom: 'Honoré',
  libelle: 'Gestion du cabinet',
  groupe: 'vie-cabinet',
  teinte: 'facturation-recouvrement',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Prépare honoraires, prélèvements, relances d’impayés et plan de charge ; le portefeuille se lit en agrégats, jamais par personne.',
  frontiereEnBref: [
    'Rapprocher actes, relevés et barèmes',
    'Chaque facture',
    'Toute appréciation d’un collaborateur',
  ],
  familles: [
    'honoraires-facturation', 'prelevements-encaissements', 'relances-impayes', 'rentabilite-dossiers',
    'suivi-dossiers-etats', 'tableau-de-bord-production', 'planification-charge',
  ],
  servicesLies: [],
  logiciels: [
    'ACD GI', 'MEG (Mon Expert en Gestion)', 'Microsoft Excel', 'Qonto', 'Pennylane', 'Cegid Loop',
    'Microsoft Outlook', 'Gmail',
  ],
  avatar: { src: '/agents/gestion-cabinet-256.webp', alt: 'Figurine Memlia, agent IA gestion cabinet.' },
  demonstration: {
    tache: 'actes hors forfait',
    dossier: 'Dossier fictif : trois dossiers inventés (Martinet, Rossignol, Sittelle), relevé d’actes d’octobre 2026.',
    regle: 'Un acte hors forfait se facture une fois : il figure au relevé du mois, son tarif est écrit dans la lettre de mission ou le barème, et aucune facture antérieure ne porte sa référence. Un acte sans tarif écrit ou déjà facturé arrête la ligne ; une lettre de mission échue laisse la ligne au tarif en vigueur et le signale.',
    cas: [
      { cas: 'Martinet : trois bulletins au-delà du forfait, tarif unitaire écrit dans la lettre', sortie: 'Ligne préparée avec la référence du relevé d’actes', issue: 'Préparé' },
      { cas: 'Martinet : lettre de mission échue au 30/09/2026', sortie: 'Ligne préparée au tarif de la lettre échue, mention « lettre à renouveler »', issue: 'À valider' },
      { cas: 'Rossignol : attestation demandée par la banque, aucun tarif écrit', sortie: 'Aucune ligne préparée. Motif : acte sans tarif écrit', issue: 'Arrêt' },
      { cas: 'Sittelle : déclaration rectificative déjà facturée en septembre', sortie: 'Aucune ligne préparée. Motif : acte déjà facturé, facture de septembre en lien', issue: 'Arrêt' },
    ],
  },
  fiche: {
    requete: "gestion cabinet comptable",
    h1: "Gestion de cabinet comptable : honoraires et charge préparés, l’associé arbitre.",
    titreOnglet: "Gestion de cabinet comptable : honoraires et charge | Memlia",
    descriptionLead: "Gestion de cabinet comptable",
    description: "Gestion de cabinet comptable : factures d’honoraires, prélèvements, relances et plan de charge préparés. Vous validez ; les vues restent en agrégats.",
    chapeau: "Honoré est l’agent IA Memlia pour la gestion de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Il prépare factures, relances et plan de charge en agrégats ; l’associé garde les tarifs, les décisions d’emploi et la répartition entre les personnes.",
    serviceType: "Préparation des honoraires, encaissements et indicateurs de gestion du cabinet",
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
          preuve: "Le calendrier borne la facture d’honoraires du cabinet selon sa taille ; Memlia prépare la facture, le cabinet l’émet.",
          mot: "Les PME et les micro-entreprises émettront au format électronique à partir du 1er septembre 2027"
        }
      ]
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/56-fiche-gestion-cabinet.webp",
      alt: "Rejoué sur un dossier fictif : les actes hors forfait de trois dossiers inventés, une ligne préparée, une lettre échue à valider et deux arrêts motivés."
    },
    taches: [
      {
        geste: "Préparer la facturation du mois",
        prepare: "Forfaits mensualisés et actes hors forfait (bulletins supplémentaires, attestations, déclarations rectificatives) rapprochés du relevé d’actes, chacun facturé une seule fois.",
        famille: "honoraires-facturation"
      },
      {
        geste: "Réviser les honoraires",
        prepare: "Révision annuelle calculée selon la clause écrite de chaque lettre de mission, proposition par dossier.",
        famille: "honoraires-facturation"
      },
      {
        geste: "Constituer les lots de prélèvement",
        prepare: "Lots préparés depuis les factures validées, mandats et références contrôlés.",
        famille: "prelevements-encaissements"
      },
      {
        geste: "Traiter les rejets de prélèvement",
        prepare: "Rejets lus, motif rattaché au dossier, échéancier proposé.",
        famille: "prelevements-encaissements"
      },
      {
        geste: "Rapprocher les encaissements",
        prepare: "Règlements reçus lettrés avec les factures d’honoraires, restes dus listés, trésorerie du cabinet projetée sur les encaissements attendus.",
        famille: "prelevements-encaissements"
      },
      {
        geste: "Relancer les impayés",
        prepare: "Relance graduée depuis les messages types du cabinet, au stade qui convient ; suspension de mission signalée à l’associé.",
        famille: "relances-impayes"
      },
      {
        geste: "Mesurer la rentabilité par dossier",
        prepare: "Temps déjà saisis rapprochés des honoraires : marge et écarts de tarif par dossier et par mission, en agrégats.",
        famille: "rentabilite-dossiers"
      },
      {
        geste: "Suivre les dossiers par état",
        prepare: "Étape et exceptions de chaque dossier, retards signalés avant l’échéance.",
        famille: "suivi-dossiers-etats"
      },
      {
        geste: "Tenir le tableau de bord de production",
        prepare: "Avancement et retards du portefeuille en indicateurs non nominatifs, par équipe et par étape.",
        famille: "tableau-de-bord-production"
      },
      {
        geste: "Préparer le plan de charge",
        prepare: "Dossiers et pointes de la saison répartis par équipe et par semaine, proposition de répartition à arbitrer.",
        famille: "planification-charge"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "La facturation d’octobre",
        texte: "Sur un portefeuille inventé : chaque dossier avec son forfait et ses actes hors forfait ; un acte déjà facturé écarté avec sa référence."
      },
      {
        titre: "Les relances d’impayés au deuxième stade",
        texte: "Prêtes à envoyer, avec l’historique de chaque dossier."
      },
      {
        titre: "Le tableau de bord du portefeuille",
        texte: "En agrégats par équipe et par étape, jamais par personne."
      }
    ],
    frontiere: [
      ["Rapprocher actes, relevés et barèmes", "Chaque facture", "Le tarif et le geste commercial"],
      ["Constituer lots, relances et échéanciers", "Chaque lot de prélèvement", "La suspension d’une mission"],
      ["Lettrer les encaissements", "Chaque relance d’impayé et chaque échéancier", "La répartition de la charge entre les personnes"],
      [
        "Agréger avancement, charge et rentabilité par dossier ou par équipe",
        "Chaque révision d’honoraires",
        "Toute appréciation d’un collaborateur"
      ]
    ],
    arrets: [
      "Acte sans tarif écrit, ou déjà facturé.",
      "Rejet de prélèvement sans motif lisible.",
      "Demande d’un indicateur nominatif sur un collaborateur."
    ],
    neJamaisSansVous: [
      {
        envoi: "La facture d’honoraires",
        validation: "émise par votre cabinet après validation, par sa plateforme agréée dès que l’émission électronique s’applique à lui."
      },
      {
        envoi: "Le lot de prélèvement",
        validation: "remis à la banque par votre cabinet."
      },
      {
        envoi: "La relance d’impayé",
        validation: "envoyée par le collaborateur ou par l’associé."
      },
      {
        envoi: "L’échéancier",
        validation: "proposé au client par l’associé."
      }
    ],
    avecSans: [
      {
        sans: "Des actes hors forfait oubliés, ou facturés deux fois",
        avec: "Chaque acte repris une fois dans le projet de facture, que le collaborateur valide"
      },
      {
        sans: "Des rejets de prélèvement découverts trop tard",
        avec: "Chaque rejet rattaché à son dossier, l’échéancier proposé que l’associé accepte"
      },
      {
        sans: "Des relances écrites quand quelqu’un y pense",
        avec: "Une relance au stade prévu, que l’associé envoie"
      },
      {
        sans: "Un plan de charge refait de mémoire avant la haute saison",
        avec: "Une répartition proposée par équipe, que l’associé arbitre"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Honoré mesure-t-il le travail de chaque collaborateur ?",
          reponse: "Les indicateurs se lisent par dossier, par équipe et par étape, jamais par personne. Une demande d’indicateur nominatif arrête la règle."
        },
        {
          question: "Nos factures d’honoraires passent-elles par Honoré ?",
          reponse: "Honoré prépare chaque facture ; votre cabinet l’émet, par la plateforme agréée qu’il a choisie dès que l’émission électronique s’applique à lui. Les PME et les micro-entreprises émettront au format électronique à partir du 1er septembre 2027."
        },
        {
          question: "Faut-il changer de logiciel de gestion interne ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. Votre outil garde les temps et la facture ; nous rapprochons les actes, préparons les lots et suivons ce qui reste dû."
        },
        {
          question: "Que devient un rejet sans motif ?",
          reponse: "La règle s’arrête pour ce dossier et le présente au collaborateur, relevé bancaire en lien. Aucune relance n’est préparée tant que le motif n’est pas connu."
        },
        {
          question: "Qui décide de suspendre une mission ?",
          reponse: "L’associé, toujours. Honoré signale le dossier, son historique de relances et ce qui reste dû."
        },
        {
          question: "Honoré décide-t-il de recruter ou de répartir les dossiers entre les personnes ?",
          reponse: "Il prépare la charge par équipe et par semaine. L’associé décide de recruter et de répartir les dossiers entre les personnes. Raphaël prépare ensuite les documents du recrutement."
        }
      ]
    },
    tachesDepart: ["honoraires-facturation", "relances-impayes", "planification-charge"],
    voisins: [
      {
        agent: "commercial",
        role: "avant",
        objet: "la lettre de mission qui fixe le tarif"
      },
      {
        agent: "rh-cabinet",
        role: "a-cote",
        objet: "l’équipe"
      },
      {
        agent: "informatique-outils",
        role: "a-cote",
        objet: "les outils"
      }
    ]
  },
};
