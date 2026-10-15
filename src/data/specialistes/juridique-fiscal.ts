import type { Specialiste } from '../specialistes.ts';

/**
 * Fiche publiée : juridique-fiscal (AGENTS-CONTENU.md §3, tâche 9).
 * Contenu validé, relu avec les skills Claude copywriting puis copy-editing et la charte v8.
 * Identifiants, familles, logiciels et démonstration conservés ; arbitrages métier tracés dans AGENTS-CONTENU.
 */
export const JURIDIQUE_FISCAL: Specialiste = {
  slug: 'juridique-fiscal',
  prenom: 'Grégoire',
  libelle: 'Juridique et fiscal',
  groupe: 'production-conseil',
  teinte: 'juridique-fiscal',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Prépare déclarations fiscales, formalités et documents de l’approbation des comptes ; les associés approuvent, votre cabinet signe et dépose.',
  frontiereEnBref: [
    'Calculer échéances et acomptes depuis les données tenues',
    'Chaque déclaration avant télétransmission',
    'La télédéclaration, le dépôt des comptes et des formalités',
  ],
  familles: [
    'tva', 'is-acomptes', 'liasse-fiscale', 'declarations-annexes', 'echeances-fiscales', 'teledeclarations-rejets',
    'secretariat-juridique', 'formalites-creation-modification', 'registres-obligations',
  ],
  servicesLies: [],
  logiciels: [
    'Lexis PolyActe', 'Registre national des entreprises', 'BODACC', 'Répertoire Sirene', 'Youtrust', 'Docusign',
    'Cegid Loop', 'ACD COMPTA', 'Sage 100 Comptabilité', 'EBP Comptabilité', 'Microsoft Excel',
  ],
  avatar: { src: '/agents/juridique-fiscal-256.webp', alt: 'Figurine Memlia, agent IA juridique fiscal.' },
  demonstration: {
    tache: 'calendrier d’approbation et de dépôt',
    dossier: 'Dossier fictif : un portefeuille de quatre sociétés inventées ; calendrier joué le 14/10/2026.',
    regle: 'Pour chaque dossier, la date limite d’approbation se calcule depuis la clôture confirmée et le délai écrit pour sa forme sociale, puis le dépôt suit dans le mois, ou dans les deux mois par voie électronique. Une clôture non confirmée ou une forme sociale sans délai écrit dans la règle arrête le calcul ; une prolongation annoncée sans décision reçue laisse la date légale en place et le signale.',
    cas: [
      { cas: 'SARL Bouvreuil, clôture au 30/06/2026 confirmée par la balance', sortie: 'Approbation au plus tard le 31/12/2026, sauf prolongation accordée par le juge ; dépôt dans le mois qui suit, ou dans les deux mois en ligne ; rappel au gérant préparé', issue: 'Préparé' },
      { cas: 'SA Grand-Duc, même clôture, prolongation évoquée par le président', sortie: 'Date légale conservée, mention « prolongation annoncée, décision à recevoir »', issue: 'À valider' },
      { cas: 'SARL Hulotte, clôture au 30/06/2026 selon les statuts, au 31/12/2026 selon la balance remise', sortie: 'Aucune date calculée. Motif : date de clôture divergente entre deux sources', issue: 'Arrêt' },
      { cas: 'SARL Ortolan, comptes approuvés le 20/06/2026, aucun dépôt constaté', sortie: 'Dépôt manquant signalé, justificatif réclamé dans un brouillon au gérant', issue: 'À valider' },
    ],
  },
  fiche: {
    requete: "ia juridique expert comptable",
    h1: "IA juridique pour expert-comptable : documents de l’approbation des comptes prêts à valider.",
    titreOnglet: "IA juridique pour expert-comptable : fiscalité et actes | Memlia",
    descriptionLead: "IA juridique pour expert-comptable",
    description: "IA juridique pour expert-comptable : TVA, liasse, formalités et documents de l’approbation des comptes préparés. Votre cabinet valide, signe et dépose.",
    chapeau: "Grégoire est l’agent IA Memlia pour les tâches juridiques et fiscales de votre cabinet. Nous l’adaptons à vos outils et à vos validations, puis le déployons et le maintenons. Il prépare échéances, déclarations et projets d’actes ; les associés approuvent les comptes, votre cabinet valide, signe et dépose.",
    serviceType: "Préparation des déclarations fiscales et des documents juridiques du cabinet",
    eeat: {
      auteur: "kevin",
      datePublication: "2026-10-15",
      dateModification: "2026-10-15",
      sources: [
        {
          editeur: "INPI",
          titre: "Dépôt des comptes annuels",
          url: "https://www.inpi.fr/realiser-demarches/formalites-dentreprises/depot-comptes-annuels",
          consulteLe: "2026-10-14",
          preuve: "La source distingue dépôt électronique au guichet unique et dépôt papier au greffe ; Memlia prépare les pièces, le cabinet dépose.",
          mot: "Les comptes se déposent en ligne sur le guichet unique, ou sur papier au greffe"
        },
        {
          editeur: "Légifrance",
          titre: "Code de commerce, article L.232-22",
          url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048535223",
          consulteLe: "2026-10-14",
          preuve: "Le délai des SARL est un mois après l’approbation, deux en dépôt électronique ; les sociétés par actions relèvent de L.232-23.",
          mot: "Le dépôt suit dans le mois de l’approbation, ou dans les deux mois par voie électronique"
        },
        {
          editeur: "Légifrance",
          titre: "Code de commerce, article L.223-26",
          url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048535091",
          consulteLe: "2026-10-14",
          preuve: "Le texte prévoit six mois et une prolongation possible par décision de justice ; aucun délai SAS n’en est déduit.",
          mot: "En SARL"
        },
        {
          editeur: "Légifrance",
          titre: "Code de commerce, article L.225-100",
          url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000048535138",
          consulteLe: "2026-10-14",
          preuve: "L’assemblée ordinaire de SA se réunit dans les six mois, sauf prolongation par décision de justice.",
          mot: "et en SA"
        }
      ]
    },
    image: {
      url: "https://memlia.fr/proofs/v2/og/51-fiche-juridique-fiscal.webp",
      alt: "Rejoué sur un dossier fictif : le calendrier de quatre sociétés inventées, une échéance préparée, deux points à valider et un arrêt pour clôtures divergentes."
    },
    taches: [
      {
        geste: "Préparer la TVA",
        prepare: "La déclaration préparée depuis la comptabilité tenue ; cohérence entre chiffre d’affaires, TVA collectée et crédits contrôlée, chaque vérification tracée.",
        famille: "tva"
      },
      {
        geste: "Calculer acomptes et solde d’IS",
        prepare: "Acomptes calculés depuis le dernier résultat, relevés préparés, échéances posées au calendrier du dossier.",
        famille: "is-acomptes"
      },
      {
        geste: "Préparer la liasse fiscale",
        prepare: "La liasse remplie depuis la balance validée, contrôles de cohérence entre tableaux, points à justifier listés.",
        famille: "liasse-fiscale"
      },
      {
        geste: "Préparer les déclarations annexes",
        prepare: "CFE, CVAE, DAS2, IFU et taxes sur les véhicules préparées et suivies jusqu’à leur dépôt.",
        famille: "declarations-annexes"
      },
      {
        geste: "Tenir le calendrier fiscal du portefeuille",
        prepare: "Échéances déclaratives et de paiement de chaque dossier selon son régime et sa clôture, retards signalés en agrégats.",
        famille: "echeances-fiscales"
      },
      {
        geste: "Suivre télédéclarations et rejets",
        prepare: "Accusés de réception lus, rejets rattachés au dossier, correction proposée jusqu’au nouvel envoi.",
        famille: "teledeclarations-rejets"
      },
      {
        geste: "Préparer les documents de l’approbation des comptes",
        prepare: "Convocation, projet de rapport de gestion repris des comptes, projets de résolutions et de procès-verbal.",
        famille: "secretariat-juridique"
      },
      {
        geste: "Préparer le dépôt des comptes",
        prepare: "La liasse de pièces assemblée pour le guichet unique ou le greffe, le délai qui suit l’approbation posé au calendrier.",
        famille: "secretariat-juridique"
      },
      {
        geste: "Constituer les dossiers de formalités",
        prepare: "Création, modification ou cessation : dossier préparé pour le guichet unique, pièces manquantes réclamées en les nommant.",
        famille: "formalites-creation-modification"
      },
      {
        geste: "Mettre à jour registres et bénéficiaires effectifs",
        prepare: "Registres des décisions et des mouvements de titres mis à jour, déclaration des bénéficiaires effectifs préparée, changement repéré au registre national des entreprises ou au BODACC.",
        famille: "registres-obligations"
      }
    ],
    aussi: [],
    livrables: [
      {
        titre: "Le calendrier des approbations du portefeuille",
        texte: "Chaque dossier avec sa clôture, sa date limite d’approbation et le dépôt qui suit, plus le rappel prêt pour chaque dirigeant."
      },
      {
        titre: "Le projet de procès-verbal d’approbation",
        texte: "Pour la SARL Bouvreuil : affectation du résultat reprise de la proposition de la gérance, prête à relire."
      },
      {
        titre: "Les avis d’impôt et les messages des espaces professionnels",
        texte: "Ceux de vos clients, relevés et rattachés à chaque dossier."
      }
    ],
    frontiere: [
      [
        "Rassembler dates, balances et décisions déjà prises",
        "Chaque déclaration avant télétransmission",
        "La qualification fiscale ou juridique d’une opération"
      ],
      ["Calculer échéances et acomptes depuis les données tenues", "Chaque projet d’acte et de procès-verbal", "Les décisions des associés"],
      ["Préparer déclarations, projets d’actes et dossiers de formalité", "Chaque date et chaque destinataire d’un rappel", "La signature"],
      [
        "Lire accusés, rejets et annonces légales",
        "Chaque dossier de formalité avant dépôt",
        "La télédéclaration, le dépôt des comptes et des formalités"
      ]
    ],
    arrets: [
      "Date de clôture non confirmée, ou divergente entre deux sources.",
      "Forme sociale ou régime fiscal sans règle écrite dans le dossier.",
      "Montant à déclarer sans concordance avec la comptabilité validée."
    ],
    neJamaisSansVous: [
      {
        envoi: "La déclaration de TVA, les relevés d’IS et la liasse",
        validation: "télétransmis par votre cabinet après validation."
      },
      {
        envoi: "Le procès-verbal et les décisions",
        validation: "signés par les associés."
      },
      {
        envoi: "Le dépôt des comptes et les formalités",
        validation: "déposés par votre cabinet sur le guichet unique, ou au greffe pour un dépôt papier."
      },
      {
        envoi: "La déclaration des bénéficiaires effectifs",
        validation: "déposée par votre cabinet."
      },
      {
        envoi: "Le rappel au dirigeant",
        validation: "envoyé par votre collaborateur."
      }
    ],
    avecSans: [
      {
        sans: "Tenir les échéances dans un tableur que personne ne met à jour",
        avec: "Un calendrier recalculé à chaque clôture, que le responsable juridique relit"
      },
      {
        sans: "Ressaisir la balance dans la liasse",
        avec: "Une liasse préparée avec ses contrôles, que l’expert-comptable valide et télétransmet"
      },
      {
        sans: "Rédiger chaque procès-verbal depuis un ancien modèle",
        avec: "Des projets d’actes repris des comptes, que le juriste relit"
      },
      {
        sans: "Découvrir un dépôt oublié l’exercice suivant",
        avec: "Les dépôts manquants signalés, que le collaborateur relance"
      }
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: "Notre logiciel juridique suit déjà les assemblées : que reste-t-il ?",
          reponse: "Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu’il laisse. Il reste souvent le rappel au dirigeant, les pièces qui manquent et le dépôt que personne n’a constaté."
        },
        {
          question: "Le dépôt des comptes part-il seul ?",
          reponse: "Les comptes se déposent en ligne sur le guichet unique, ou sur papier au greffe ; nous préparons la liasse de pièces, sans rien déposer à votre place. Le dépôt suit dans le mois de l’approbation, ou dans les deux mois par voie électronique."
        },
        {
          question: "Grégoire approuve-t-il les comptes ?",
          reponse: "L’approbation est une décision des associés. Grégoire en prépare les documents : convocation, projet de rapport, projets de résolutions et de procès-verbal."
        },
        {
          question: "Les échéances tiennent-elles compte de la forme de la société ?",
          reponse: "En SARL et en SA, les comptes sont approuvés dans les six mois de la clôture, sauf prolongation accordée par le juge. Pour une autre forme, le délai s’écrit d’abord dans la règle du dossier, et le calcul attend qu’il y soit."
        },
        {
          question: "Les formalités passent-elles par Grégoire ?",
          reponse: "Les formalités de création, de modification et de cessation passent par le guichet unique ; nous préparons le dossier, votre cabinet le signe et le dépose. Les pièces manquantes sont réclamées en les nommant."
        },
        {
          question: "Que devient le calendrier quand une date manque ?",
          reponse: "Le calcul s’arrête pour ce dossier et le présente au collaborateur, avec la source qui manque. Les autres dossiers du portefeuille continuent."
        }
      ]
    },
    tachesDepart: ["secretariat-juridique", "tva", "echeances-fiscales"],
    voisins: [
      {
        agent: "comptabilite",
        role: "avant",
        objet: "la comptabilité tenue"
      },
      {
        agent: "finance",
        role: "apres"
      },
      {
        agent: "commercial",
        role: "a-cote",
        objet: "la lettre de mission"
      }
    ],
  },
};
