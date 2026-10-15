import type { Specialiste } from '../specialistes.ts';

/**
 * Salomé · Paie et social. Nouvelle fiche du catalogue lors du retrait de l’ancienne page par pôle
 * (décision de Kevin, 15/10/2026). Périmètre issu d’AGENTS-CONTENU §2, adapté à la charte v8.
 * Les actes déclaratifs, la correction de la paie et les décisions individuelles restent au cabinet.
 */
export const PAIE_SOCIAL: Specialiste = {
  slug: 'paie-social',
  prenom: 'Salomé',
  libelle: 'Paie et social',
  groupe: 'production-conseil',
  teinte: 'paie-social',
  publie: true,
  destination: { type: 'fiche' },
  ligne: 'Prépare la paie de vos dossiers, des variables reçues aux retours DSN ; votre gestionnaire valide et dépose.',
  frontiereEnBref: [
    'Comparer au mois précédent et à la règle du dossier',
    'Chaque écart de bulletin',
    'Le dépôt de la DSN et de la DPAE',
  ],
  familles: [
    'variables-de-paie', 'bulletins-controle', 'dsn-crm', 'entrees-sorties-salaries', 'absences-ijss',
    'charges-sociales-echeances', 'ecritures-de-paie', 'diffusion-documents-paie', 'suivi-production-sociale',
  ],
  servicesLies: [],
  logiciels: [
    'Silae', 'Payfit', 'Sage 100 Paie & RH', 'Sage Paie', 'Cegid Quadra Paie', 'Cegid Payroll Ultimate', 'ACD PAIE',
    'Microsoft Excel', 'Microsoft Outlook', 'Gmail',
  ],
  avatar: { src: '/agents/paie-social-256.webp', alt: 'Figurine Memlia, agent IA paie social.' },
  demonstration: {
    tache: 'collecte des variables',
    dossier: 'Dossier fictif : la Pâtisserie Mésange, SARL inventée, douze salariés fictifs, paie versée le dernier jour du mois, variables d’octobre 2026.',
    regle: 'Une variable reçue est reprise quand le salarié figure dans la paie du mois et que l’écart au mois précédent reste dans le seuil écrit du dossier. Un salarié absent de la paie, une variable attendue qui manque ou deux sources qui se contredisent arrêtent la reprise et placent le cas devant le gestionnaire.',
    cas: [
      { cas: 'Heures supplémentaires d’une vendeuse, dans le seuil du dossier', sortie: 'Variable reprise, courriel du client en lien', issue: 'Préparé' },
      { cas: 'Prime exceptionnelle d’un pâtissier, trois fois sa prime habituelle', sortie: 'Écart au mois précédent présenté avec le seuil écrit', issue: 'À valider' },
      { cas: 'Arrêt de travail annoncé par téléphone, sans dates dans le courriel', sortie: 'Absence notée « à confirmer », dates réclamées dans un brouillon au client', issue: 'À valider' },
      { cas: 'Heures transmises pour un apprenti absent de la paie, aucune entrée déclarée', sortie: 'Reprise refusée. Motif : salarié inconnu de la paie du mois', issue: 'Arrêt' },
    ],
  },
  fiche: {
    requete: 'ia paie',
    h1: 'IA paie : des variables aux retours DSN, votre gestionnaire garde la main.',
    titreOnglet: 'IA paie et social pour cabinet comptable | Memlia',
    descriptionLead: 'IA paie pour cabinet comptable',
    description: 'IA paie pour cabinet comptable : variables rassemblées, bulletins contrôlés et retours DSN triés. Salomé prépare ; votre gestionnaire valide et dépose.',
    chapeau: 'Salomé prépare la paie de vos dossiers : variables rassemblées, écarts de bulletin expliqués et retours DSN triés. Nous adaptons cet agent IA à votre logiciel, aux règles des dossiers et au calendrier de votre équipe. Votre gestionnaire corrige, valide la paie et effectue les dépôts.',
    serviceType: 'Préparation et contrôle de la paie : variables, bulletins, DSN et production sociale',
    eeat: {
      auteur: 'kevin',
      datePublication: '2026-10-15',
      dateModification: '2026-10-15',
      sources: [
        {
          editeur: 'Net-entreprises',
          titre: 'Les Comptes Rendus Métiers DSN',
          url: 'https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/',
          consulteLe: '2026-10-15',
          preuve: 'La page décrit les retours après réception des DSN et la nécessité de traiter les anomalies. Le tri et la proposition de suite sont le périmètre Memlia ; la décision et la correction restent au gestionnaire.',
          mot: 'les comptes rendus métier',
        },
        {
          editeur: 'Net-entreprises',
          titre: 'Tiers déclarant',
          url: 'https://www.net-entreprises.fr/glossaire/tiers-declarant/',
          consulteLe: '2026-10-15',
          preuve: 'Le glossaire définit le tiers déclarant comme celui qui assure les déclarations sociales pour plusieurs entreprises. Le service Memlia prépare les contrôles et ne prend pas ce rôle ; le dépôt reste dans le circuit du cabinet.',
          mot: 'votre compte déclarant',
        },
      ],
    },
    image: {
      url: 'https://memlia.fr/proofs/v2/og/60-fiche-paie-social.webp',
      alt: 'Dossier fictif de la Pâtisserie Mésange : variables préparées, écarts à valider et arrêt pour un salarié inconnu de la paie.',
    },
    taches: [
      {
        geste: 'Rassembler les variables du mois',
        prepare: 'Les variables reçues par courriel ou tableau, rattachées au dossier et au salarié, rapprochées du mois précédent. Les informations absentes sont nommées dans une demande prête pour le client.',
        famille: 'variables-de-paie',
      },
      {
        geste: 'Contrôler les bulletins avant la DSN',
        prepare: 'Les bulletins calculés par votre logiciel comparés aux données et à la règle du dossier : absences, primes, taux et plafonds attendus. Chaque écart est présenté avec sa source.',
        famille: 'bulletins-controle',
      },
      {
        geste: 'Préparer les contrôles de la DSN',
        prepare: 'Les vérifications de cohérence et les éléments manquants, avant le dépôt par votre gestionnaire. Le calendrier reprend l’échéance applicable que le cabinet a validée pour chaque dossier.',
        famille: 'dsn-crm',
      },
      {
        geste: 'Trier les retours DSN',
        prepare: 'Les comptes rendus métier disponibles rattachés à la déclaration et au dossier, avec l’écart relevé et la suite proposée. Le gestionnaire choisit la correction et les suites déclaratives.',
        famille: 'dsn-crm',
      },
      {
        geste: 'Préparer les entrées et les sorties',
        prepare: 'Les données et pièces nécessaires à la DPAE, le contrat tiré de votre modèle, les éléments de solde de tout compte et les documents de départ prêts à relire. Le circuit déjà couvert par votre portail reste en place.',
        famille: 'entrees-sorties-salaries',
      },
      {
        geste: 'Suivre les absences et les indemnités journalières',
        prepare: 'Les arrêts reçus rattachés au salarié, les dates à confirmer isolées, les éléments d’attestation de salaire rassemblés et les indemnités journalières rapprochées des versements accessibles.',
        famille: 'absences-ijss',
      },
      {
        geste: 'Suivre les échéances de cotisations',
        prepare: 'Un échéancier par dossier, les montants rapprochés des états de paie et de la DSN, les écarts et les éléments de règlement préparés. Le cabinet vérifie les échéances et l’employeur valide les paiements.',
        famille: 'charges-sociales-echeances',
      },
      {
        geste: 'Préparer le journal de paie pour la comptabilité',
        prepare: 'Le journal de paie mis au format d’import du dossier comptable, avec les totaux et la concordance des charges sociales présentés pour contrôle avant import.',
        famille: 'ecritures-de-paie',
      },
      {
        geste: 'Préparer la remise des bulletins et des états',
        prepare: 'Les bulletins, journaux et états nommés et classés selon le destinataire prévu. Le gestionnaire valide la paie, vérifie les destinataires et déclenche la diffusion.',
        famille: 'diffusion-documents-paie',
      },
      {
        geste: 'Suivre la production sociale',
        prepare: 'L’avancement par dossier et par étape, les échéances et les exceptions encore ouvertes. Les vues de pilotage présentent des agrégats, sans classement des gestionnaires.',
        famille: 'suivi-production-sociale',
      },
    ],
    aussi: [],
    livrables: [
      {
        titre: 'Le contrôle avant DSN',
        texte: 'Pour la Pâtisserie Mésange inventée : les bulletins comparés à la règle du dossier, une prime inhabituelle et un taux différent présentés avec les pièces à revoir.',
      },
      {
        titre: 'La demande de variables prête à envoyer',
        texte: 'Pour la paie d’octobre du dossier fictif : les variables rassemblées, leur courriel d’origine et les dates d’un arrêt à confirmer dans le brouillon destiné au client.',
      },
      {
        titre: 'Le récapitulatif des retours DSN',
        texte: 'Les retours disponibles triés par dossier et par déclaration, les écarts à reprendre et la suite proposée pour le gestionnaire.',
      },
    ],
    frontiere: [
      ['Rassembler les variables et préparer les demandes au client', 'Chaque variable hors seuil', 'L’interprétation d’une situation individuelle et de la convention collective'],
      ['Comparer au mois précédent et à la règle du dossier', 'Chaque écart de bulletin', 'La correction et la validation du calcul dans le logiciel de paie'],
      ['Trier les comptes rendus métier', 'Chaque demande au client', 'Le dépôt de la DSN et de la DPAE'],
      ['Préparer les documents d’entrée, d’absence et de départ', 'Chaque document destiné à un salarié', 'Le conseil social et les décisions de l’employeur'],
    ],
    arrets: [
      'Salarié absent de la paie du mois ou matricule ambigu.',
      'Variable attendue manquante ou contradictoire entre deux sources : sa reprise reste bloquée jusqu’à la réponse du gestionnaire.',
      'Écart hors du seuil écrit : aucune correction appliquée avant validation.',
      'Accès expiré, fichier illisible ou période différente de celle demandée.',
      'Destinataire d’un bulletin non confirmé : aucune diffusion préparée pour cet envoi.',
    ],
    neJamaisSansVous: [
      { envoi: 'La DSN et la DPAE', validation: 'déposées par votre gestionnaire depuis le compte déclarant autorisé.' },
      { envoi: 'La demande de variables ou de pièces', validation: 'relue et envoyée au client par votre gestionnaire.' },
      { envoi: 'Les bulletins et les états', validation: 'diffusés par votre gestionnaire après validation de la paie et des destinataires.' },
      { envoi: 'Les documents de fin de contrat', validation: 'vérifiés par le cabinet et signés par l’employeur lorsque leur signature est requise.' },
      { envoi: 'Le règlement des cotisations', validation: 'validé par l’employeur avant tout paiement.' },
      { envoi: 'Le journal de paie', validation: 'contrôlé avant son import en comptabilité.' },
    ],
    avecSans: [
      { sans: 'Des variables recopiées depuis plusieurs courriels et tableaux', avec: 'Les variables rassemblées avec leur source ; le gestionnaire valide les écarts' },
      { sans: 'Des écarts recherchés bulletin par bulletin', avec: 'Les contrôles du dossier rejoués ; le gestionnaire examine les écarts et corrige la paie' },
      { sans: 'Des comptes rendus DSN ouverts un à un', avec: 'Les retours triés par dossier ; le gestionnaire choisit la correction et les suites' },
      { sans: 'Des demandes au client reconstruites chaque mois', avec: 'Une demande préparée avec les informations manquantes ; le gestionnaire la relit et l’envoie' },
    ],
    faq: {
      balisage: false,
      questions: [
        {
          question: 'Salomé calcule-t-elle les bulletins ou dépose-t-elle la DSN ?',
          reponse: 'Votre logiciel calcule les bulletins. Salomé rassemble les variables, prépare les contrôles et présente les écarts. Le gestionnaire corrige et valide la paie, puis dépose la DSN depuis votre compte déclarant. Nous configurons le calendrier à partir des échéances que votre cabinet confirme pour les dossiers.',
        },
        {
          question: 'Faut-il changer de logiciel de paie ou de portail client ?',
          reponse: 'Nous adaptons Salomé à vos logiciels et aux formats que vous recevez déjà. La préparation du déploiement fixe les accès autorisés, les fichiers lus et les sorties remises. Les fonctions déjà assurées par votre logiciel ou votre portail restent dans leur circuit ; nous prenons en charge les collectes, rapprochements et contrôles convenus autour.',
        },
        {
          question: 'Que fait Salomé quand une variable manque ou semble incohérente ?',
          reponse: 'La reprise concernée reste bloquée. Salomé présente la donnée attendue, l’écart ou les deux sources contradictoires, puis prépare la demande de précision. Votre gestionnaire décide de la correction et de la demande à envoyer. Une absence de réponse ne devient jamais une variable à zéro.',
        },
        {
          question: 'Comment sont traités les retours après le dépôt DSN ?',
          reponse: 'Salomé rassemble les comptes rendus métier disponibles après la déclaration et les rattache au dossier concerné. Chaque anomalie est présentée avec sa source et une suite proposée. Votre gestionnaire analyse le retour, corrige dans le logiciel de paie et effectue les suites déclaratives nécessaires.',
        },
        {
          question: 'Peut-on suivre plusieurs dossiers sans surveiller les gestionnaires ?',
          reponse: 'Oui. Les tâches sont configurées pour les dossiers, comptes et périodes autorisés, avec leurs propres règles et destinataires. Le suivi montre les étapes, les échéances et les exceptions en attente. Les vues de pilotage restent en agrégats et ne classent pas les gestionnaires.',
        },
        {
          question: 'Par quelle tâche commencer et comment est fixé le prix ?',
          reponse: 'La collecte des variables, le contrôle des bulletins ou le tri des retours DSN donnent un point de départ concret. Nous déployons Salomé sur le périmètre choisi, l’adaptons à vos règles et faisons vérifier le résultat par votre équipe avant sa mise en service. Le devis dépend des sources, des exceptions et des validations ; il précise le support et la maintenance. Un besoin au-delà du catalogue se construit sur mesure.',
        },
      ],
    },
    tachesDepart: ['variables-de-paie', 'bulletins-controle', 'dsn-crm'],
    voisins: [
      { agent: 'relation-client', role: 'avant', objet: 'l’entrée en relation avec le client' },
      { agent: 'comptabilite', role: 'apres', objet: 'la reprise des écritures de paie' },
      { agent: 'rh-cabinet', role: 'a-cote', objet: 'les salariés de votre cabinet' },
    ],
  },
};
