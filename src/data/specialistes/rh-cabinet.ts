import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : rh-cabinet (AGENTS-CONTENU.md §10, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const RH_CABINET: Specialiste = {
  slug: 'rh-cabinet',
  prenom: 'Raphaël',
  libelle: 'RH du cabinet',
  groupe: 'vie-cabinet',
  teinte: 'rh-formation',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Prépare les documents RH de votre équipe, de l’annonce à la synthèse de rémunération ; les décisions sur les personnes restent à vous.',
  frontiereEnBref: [
    'Rassembler depuis la paie tenue et vos modèles',
    'Chaque document remis à un salarié ou à un candidat',
    'Toute appréciation sur une personne',
  ],
  familles: ['rh-interne-cabinet', 'formation-ia-competences', 'synthese-remuneration', 'indicateurs-sociaux-cabinet'],
  servicesLies: [],
  logiciels: ['Silae', 'Microsoft Excel', 'Microsoft Outlook', 'Gmail', 'Microsoft SharePoint', 'Youtrust', 'Docusign'],
  avatar: { src: '/agents/rh-cabinet-256.webp', alt: 'Figurine Memlia, agent IA rh cabinet.' },
  demonstration: {
    tache: 'synthèse de rémunération',
    dossier: 'Dossier fictif : le cabinet Alouette, cabinet inventé, synthèse de rémunération 2025 d’une collaboratrice inventée.',
    regle: 'La synthèse reprend, pour l’année, chaque élément de rémunération que la paie tenue enregistre, avec sa rubrique et son mois d’origine, sans rien recalculer ; une rubrique nouvelle reçoit un libellé proposé, à valider. Une rubrique présente dans deux sources aux montants différents, une donnée sensible non prévue par la règle ou une demande d’appréciation de la personne arrête la synthèse.',
    cas: [
      { cas: 'Salaire de base de l’année et prime annuelle versée en décembre', sortie: 'Lignes reprises avec leur rubrique et leur mois', issue: 'Préparé' },
      { cas: 'Rubrique créée cette année pour le forfait mobilités durables', sortie: 'Ligne reprise, libellé proposé pour la synthèse', issue: 'À valider' },
      { cas: 'Avantage en nature véhicule présent dans la paie et dans un tableau annexe, montants différents', sortie: 'Synthèse suspendue. Motif : double source ; les deux montants présentés côte à côte', issue: 'Arrêt' },
      { cas: 'Demande d’ajouter un commentaire sur la performance de l’année', sortie: 'Aucun commentaire rédigé. Motif : appréciation d’une personne, hors de la règle', issue: 'Arrêt' },
    ],
  },
  fiche: {
    requete: "ia rh",
    h1: "IA RH pour cabinet comptable : les documents prêts, les décisions restent à vous.",
    titreOnglet: "IA RH pour cabinet comptable : documents et formation | Memlia",
    descriptionLead: "IA RH pour cabinet comptable",
    description: "IA RH pour cabinet comptable : candidatures organisées, arrivées, formation et synthèses de rémunération préparées. Les décisions sur les personnes restent à vous.",
    chapeau: "Raphaël est l’agent IA Memlia pour les tâches RH internes de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Il prépare les documents et rassemble les faits ; vous choisissez les candidats et gardez toute décision sur les personnes.",
    serviceType: "Préparation des documents RH, du suivi de formation et des synthèses de rémunération du cabinet",
    eeat: {
      auteur: "kevin",
      datePublication: "2026-10-15",
      dateModification: "2026-10-15",
      sources: [
        {
          editeur: "Ministère du Travail",
          titre: "Déclarations aux indicateurs de l’index égalité professionnelle et de la loi Rixain pour 2026",
          url: "https://travail-emploi.gouv.fr/declarations-aux-indicateurs-de-lindex-egalite-professionnelle-et-de-la-loi-rixain-pour-2026",
          consulteLe: "2026-10-15",
          preuve: "Le ministère confirme l’index actuel en 2026 pour les entreprises d’au moins 50 salariés. La fiche ne présente pas la directive 2023/970 comme déjà transposée.",
          mot: "les entreprises d’au moins 50 salariés"
        }
      ]
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/57-fiche-rh-cabinet.webp",
      alt: "Rejoué sur un dossier fictif : la synthèse de rémunération d’une collaboratrice inventée, une ligne préparée, un libellé à valider et deux arrêts motivés."
    },
    taches: [
      {
        geste: "Préparer un recrutement",
        prepare: "Fiche de poste et annonce rédigées depuis votre besoin, diffusion préparée sur les canaux que vous choisissez.",
        famille: "rh-interne-cabinet"
      },
      {
        geste: "Organiser les candidatures",
        prepare: "Accusés de réception préparés, entretiens planifiés, dossier de chaque candidat assemblé tel qu’il est arrivé, sans tri ni note.",
        famille: "rh-interne-cabinet"
      },
      {
        geste: "Préparer l’arrivée d’un collaborateur",
        prepare: "Contrat tiré de votre modèle, DPAE à déposer, affiliation à la mutuelle, parcours de la première semaine, demande d’accès transmise à Octavie.",
        famille: "rh-interne-cabinet"
      },
      {
        geste: "Préparer un départ",
        prepare: "Documents de fin de contrat, restitution du matériel, révocation des accès demandée.",
        famille: "rh-interne-cabinet"
      },
      {
        geste: "Préparer les entretiens annuels et professionnels",
        prepare: "Convocations aux échéances, trames qui reprennent les faits (poste, formations suivies, souhaits exprimés l’an passé) ; aucune appréciation pré-rédigée.",
        famille: "rh-interne-cabinet"
      },
      {
        geste: "Rassembler les demandes de congés",
        prepare: "Demandes reçues, soldes lus dans la paie, réponse préparée pour le responsable ; capacité de l’équipe par semaine en agrégats.",
        famille: "rh-interne-cabinet"
      },
      {
        geste: "Suivre la formation continue",
        prepare: "Heures suivies, inscriptions et attestations classées pour chaque professionnel soumis à l’obligation de formation.",
        famille: "formation-ia-competences"
      },
      {
        geste: "Tenir la preuve de formation à l’IA",
        prepare: "Les outils d’IA du cabinet, leurs limites écrites et les formations suivies par l’équipe, pièces à l’appui.",
        famille: "formation-ia-competences"
      },
      {
        geste: "Produire la synthèse annuelle de rémunération",
        prepare: "Pour chaque salarié, les éléments de rémunération de l’année repris de la paie tenue, mis en forme, prêts à remettre.",
        famille: "synthese-remuneration"
      },
      {
        geste: "Préparer les indicateurs sociaux",
        prepare: "Mise à jour du registre unique du personnel ; effectifs en agrégats et index de l’égalité professionnelle, pour les cabinets qui y sont tenus.",
        famille: "indicateurs-sociaux-cabinet"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "La synthèse annuelle de rémunération",
        texte: "Pour une collaboratrice inventée : chaque ligne reprise de la paie tenue, prête à remettre."
      },
      {
        titre: "Le dossier d’arrivée",
        texte: "Pour un collaborateur inventé : contrat tiré de votre modèle, accès à créer logiciel par logiciel, parcours de la première semaine."
      },
      {
        titre: "Le suivi de formation de l’équipe",
        texte: "Les heures suivies et les attestations classées."
      }
    ],
    frontiere: [
      ["Rassembler depuis la paie tenue et vos modèles", "Chaque document remis à un salarié ou à un candidat", "Le choix d’un candidat"],
      [
        "Rédiger annonces, convocations et dossiers d’arrivée ou de départ",
        "Chaque annonce avant diffusion",
        "Toute appréciation sur une personne"
      ],
      ["Classer attestations et pièces", "Chaque réponse à une demande de congé", "L’entretien et ce qui s’y décide"],
      ["Agréger les indicateurs sociaux", "Chaque indicateur publié", "La rémunération et les décisions d’emploi"]
    ],
    arrets: [
      "Ligne de paie ambiguë, ou présente dans deux sources.",
      "Donnée sensible non prévue par la règle (santé, situation familiale).",
      "Demande de noter, de classer ou d’évaluer une personne."
    ],
    neJamaisSansVous: [
      {
        envoi: "L’annonce",
        validation: "diffusée par votre cabinet."
      },
      {
        envoi: "La réponse à un candidat",
        validation: "envoyée par la personne qui recrute."
      },
      {
        envoi: "Le contrat et les documents de fin de contrat",
        validation: "signés par l’employeur."
      },
      {
        envoi: "La DPAE",
        validation: "déposée par votre cabinet."
      },
      {
        envoi: "La synthèse de rémunération",
        validation: "remise au salarié par son responsable."
      }
    ],
    avecSans: [
      {
        sans: "Des candidatures sans réponse pendant la haute saison",
        avec: "Un accusé de réception prêt pour chaque candidat, que le recruteur envoie"
      },
      {
        sans: "Une arrivée préparée la veille, accès compris",
        avec: "Un dossier d’arrivée complet, que le responsable valide"
      },
      {
        sans: "Des attestations de formation éparpillées dans les boîtes",
        avec: "Chaque attestation classée, que le responsable consulte"
      },
      {
        sans: "Une synthèse de rémunération reconstruite à la main",
        avec: "Une synthèse reprise de la paie tenue, que le responsable relit et remet"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Raphaël évalue-t-il vos collaborateurs ou vos candidats ?",
          reponse: "Jamais : il prépare des documents et des agrégats. Toute demande de note, de classement ou d’appréciation arrête la règle."
        },
        {
          question: "Faut-il changer de logiciel de paie ou de SIRH ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. La paie reste tenue dans votre logiciel ; Raphaël en lit ce que la tâche demande."
        },
        {
          question: "Que devient une ligne de paie ambiguë ?",
          reponse: "La synthèse s’arrête et présente les deux sources côte à côte au responsable. Rien n’est recalculé ni choisi à sa place."
        },
        {
          question: "Qui voit les données de l’équipe ?",
          reponse: "Les données sont lues en place, avec les seuls accès ouverts pour la tâche. Les vues de pilotage restent en agrégats."
        },
        {
          question: "Raphaël tient-il le registre du personnel ?",
          reponse: "Il en prépare la mise à jour à chaque arrivée et à chaque départ. Le registre reste tenu par votre cabinet, en sa qualité d’employeur."
        },
        {
          question: "Raphaël prépare-t-il l’index de l’égalité professionnelle ?",
          reponse: "Oui, pour les entreprises d’au moins 50 salariés qui y sont tenues. Il rassemble les données et prépare les indicateurs selon la règle écrite applicable ; votre cabinet les valide et les publie."
        }
      ]
    },
    tachesDepart: ["synthese-remuneration", "rh-interne-cabinet", "formation-ia-competences"],
    voisins: [
      {
        agent: "paie-social",
        role: "a-cote",
        objet: "la paie"
      },
      {
        agent: "informatique-outils",
        role: "a-cote",
        objet: "les accès"
      },
      {
        agent: "gestion-cabinet",
        role: "a-cote",
        objet: "le plan de charge"
      }
    ]
  },
};
