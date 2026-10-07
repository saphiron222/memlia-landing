import type { ContenuAccueil } from './types';

/** E1 : copy CAC à relire par E2. E3 enregistre les médias avant le branchement E4. */
export const SEO_CAC = {
  chemin: '/commissaires-aux-comptes',
  requete: 'automatisation commissaire aux comptes',
  titre: 'Automatisation pour commissaire aux comptes | Memlia',
  description: 'Automatisation pour commissaire aux comptes : sélection des tiers, écarts de confirmation et rapprochements. Votre équipe garde ses contrôles et son jugement.',
} as const;

/** Bandeau à rendre après Orientation, avant les exemples : règle de couverture du 06/10. */
export const COUVERTURE_CAC = {
  titre: 'Ce que votre suite d’audit fait déjà',
  texte: 'Réception du FEC, procédures analytiques (revue analytique), dossier de travail, modèles de rapport, collecte de pièces et archivage : nous partons des fonctions de votre suite. Nous vérifions celles que vous utilisez avant de proposer un traitement.',
  suite: 'La sélection selon votre règle, les écarts de confirmation et les fichiers du client à rapprocher de la balance sont nos points de départ. Les lettres, l’envoi et les relances restent dans votre circuit de circularisation.',
} as const;

/** Tableau visible requis par la règle écrite ; aucune colonne ne doit disparaître au rendu. */
export const FRONTIERE_CAC = {
  titre: 'La règle écrite pour une sélection de tiers',
  colonnes: ['Se prépare seul', 'Attend votre validation', 'Reste humain'],
  lignes: [
    ['Classer la population selon les soldes et mouvements prévus ; préparer le tirage avec la graine conservée.', 'La proposition de tiers et sa couverture, selon les critères que vous avez fixés.', 'Choisir les assertions, les risques, la méthode de sélection et les paramètres.'],
    ['Comparer la première passe à celle de clôture et signaler les nouveaux tiers.', 'La liste retenue et sa transmission dans le circuit autorisé.', 'Garder la maîtrise des demandes et apprécier les réponses et les non-réponses.'],
    ['Calculer les différences entre montants comparables et référencer les pièces disponibles.', 'Le rapprochement proposé et les éléments à examiner.', 'Décider des procédures alternatives ou supplémentaires et conclure.'],
  ],
} as const;

export const FICHE_OUTIL_CAC = {
  titre: 'Une fiche outil pour votre dossier',
  texte: 'La livraison comprend une fiche outil : objectif, périmètre, méthode et version, données d’entrée, contrôles de fiabilité, paramètres, sorties et traces. Elle décrit aussi les limites, les arrêts et les essais fictifs. Vous disposez de ces éléments pour apprécier l’outil et documenter son usage dans la mission.',
  precision: 'La NEP 315 révisée distingue les outils et techniques automatisés des logiciels de dossier (§ 14). Elle demande d’en apprécier le fonctionnement et les informations intégrées (§ 46), puis de consigner cette appréciation (§ 48 d). La fiche est notre support de livraison. Votre appréciation et vos travaux restent à documenter.',
  source: { libelle: 'H2A, NEP 315 révisée', href: 'https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/' },
} as const;

/** Trois cadres fictifs rendus et scellés par E3, réutilisables uniquement sur l’accueil CAC. */
export const MEDIAS_CAC = {
  selection: 'cac/accueil-selection-tiers',
  ecarts: 'cac/accueil-ecarts-confirmation',
  rapprochements: 'cac/accueil-fichiers-balance',
} as const;

export const CONTENU_CAC: ContenuAccueil = {
  hero: {
    etiquette: 'Automatisation IA pour cabinets de commissariat aux comptes',
    titre: 'Automatisation pour commissaire aux comptes : confiez la mécanique, gardez le jugement.',
    texte: 'Quels tiers retenir, quel retour rapprocher, quel fichier comparer à la balance : votre équipe connaît les gestes. Nous écrivons leur règle avec vous et automatisons la part répétitive dans vos outils. Vos auditeurs gardent leurs contrôles. Le signataire garde son opinion.',
    poster: '/proofs/cac/accueil-selection-tiers.webp',
    video: '',
    sousTitres: '',
  },
  orientation: {
    titre: 'Partez de la tâche qui revient dans vos missions.',
    destinations: [
      { libelle: 'Certification des comptes', href: '#use-certification', texte: 'Sélection des tiers à circulariser, écarts de confirmation, fichiers du client à rapprocher : une mécanique cadrée autour de vos travaux.' },
      { libelle: 'Interventions légales', href: '#use-interventions', texte: 'Une opération ponctuelle : réunir les données et préparer les comparaisons prévues, dans le périmètre de cette intervention.' },
      { libelle: 'Services autres que la certification des comptes (SACC)', href: '#use-sacc', texte: 'Une prestation distincte : écrire le traitement attendu et ses limites, après votre appréciation de l’indépendance.' },
      { libelle: 'Durabilité', href: '#use-durabilite', texte: 'Pour une mission entrant dans votre périmètre : préparer les rapprochements entre indicateurs et pièces. Le cadrage précède toute automatisation.' },
      { libelle: 'Administration des mandats', href: '#use-administration', texte: 'Préparer les comparaisons de budget ou l’échéancier que vos outils ne couvrent pas, avec les paramètres de votre cabinet.' },
    ],
    invitation: 'Voir comment une tâche se prend en charge',
    services: [
      { libelle: 'La règle écrite', href: '#methode' },
      { libelle: 'Vos garanties', href: '#garanties' },
      { libelle: 'Les questions pratiques', href: '#questions' },
    ],
  },
  quotidien: {
    titre: 'Votre règle de sélection ne devrait pas vivre dans une seule tête.',
    texte: 'La balance arrive. Vous reprenez les plus gros soldes, les mouvements à examiner et la part aléatoire prévue. À la clôture, il faut retrouver les critères de la première passe, puis expliquer les ajouts. Nous écrivons cette règle pour qu’elle se rejoue et se relise.',
    points: [
      { titre: 'Reprendre les paramètres.', texte: 'Population, critères, couverture ou nombre de comptes : les choix du cabinet restent visibles d’une passe à l’autre.' },
      { titre: 'Retrouver l’origine.', texte: 'Chaque proposition renvoie à son tiers, à sa source et à la règle qui l’a retenue.' },
      { titre: 'Transmettre le savoir-faire.', texte: 'Le chef de mission relit la règle écrite. L’auditeur suivant retrouve les paramètres plutôt que de reconstituer le geste.' },
    ],
    note: 'L’objectif est de décharger l’équipe des manipulations répétitives et de garder la règle au cabinet. Le choix des diligences reste au commissaire aux comptes.',
    image: MEDIAS_CAC.selection,
  },
  promesse: {
    titre: 'Vous confiez une tâche. Nous la prenons entière.',
    texte: 'Observation, règle écrite, construction, essais, validation par votre équipe et maintenance : nous prenons en charge le traitement convenu. Vos auditeurs travaillent sur les écarts qui demandent une appréciation.',
    points: [
      { titre: 'Une règle qui appartient au cabinet.', texte: 'Les sources, les critères et les exceptions s’écrivent dans vos mots avant de devenir un traitement.' },
      { titre: 'Des propositions à relire.', texte: 'La sélection et les rapprochements préparés restent distincts de vos commentaires et de vos conclusions.' },
      { titre: 'Des arrêts expliqués.', texte: 'Une période incohérente ou une référence absente bloque la proposition concernée. Le cas reste visible pour votre équipe.' },
    ],
    image: MEDIAS_CAC.selection,
  },
  usages: {
    titre: 'Des gestes précis, dans le périmètre de chaque mission.',
    texte: 'Commencez par la certification et une tâche que votre suite laisse à l’équipe. Pour les autres missions, nous vérifions ensemble le besoin et la frontière du traitement avant de nous engager.',
    exemples: [
      { id: 'certification', title: 'Préparer la sélection et les rapprochements', text: 'Appliquer votre règle de soldes, mouvements et part aléatoire aux tiers à circulariser. Préparer deux passes, puis la feuille des écarts de confirmation. Rapprocher les fichiers de paie, d’immobilisations ou d’inventaire avec les comptes convenus de la balance.' },
      { id: 'interventions', title: 'Préparer les comparaisons d’une intervention légale', text: 'Pour une opération d’apport, de fusion ou de transformation, définir les sources et les comparaisons à préparer. La nature de la mission, les contrôles et les conclusions restent au professionnel.' },
      { id: 'sacc', title: 'Cadrer la mécanique d’une prestation distincte', text: 'Écrire les rapprochements attendus pour un service autre que la certification des comptes. Le périmètre, les accès et l’appréciation de l’indépendance se traitent séparément pour chaque mission.' },
      { id: 'durabilite', title: 'Relier un indicateur à ses pièces', text: 'Si la mission entre dans le périmètre de votre cabinet, cadrer une préparation reliant les indicateurs reçus à leurs sources. L’appréciation de ces informations et les conclusions restent au professionnel chargé de la mission.' },
      { id: 'administration', title: 'Préparer les repères du portefeuille de mandats', text: 'Partir des dates et budgets que vous avez retenus pour préparer un échéancier ou une comparaison. Nous conservons les fonctions de votre suite, notamment le préremplissage des déclarations qu’elle propose.' },
    ],
  },
  methode: {
    titre: 'La règle écrite, appliquée à vos travaux d’audit.',
    libelleEtape: 'Étape',
    etapes: [
      { numero: 1, titre: 'Observer le geste et sa frontière.', texte: 'Nous suivons la tâche avec votre équipe et repérons ce que votre suite fait déjà. Nous écrivons la frontière en trois colonnes : préparation seule, validation attendue, jugement humain.', image: MEDIAS_CAC.selection },
      { numero: 2, titre: 'Écrire la proposition et ses arrêts.', texte: 'Votre cabinet fixe les critères. Nous écrivons la règle qui prépare une proposition et conserve vos saisies. Dans le doute, le traitement s’arrête : population incomplète, période différente ou clé ambiguë.', image: MEDIAS_CAC.rapprochements },
      { numero: 3, titre: 'Rejouer la règle sur un dossier fictif.', texte: 'Un jeu d’essai fictif utilise des données inventées. Nous vérifions les résultats attendus et les cas qui doivent s’arrêter. Pour un tirage, la graine et les paramètres permettent de reproduire la sélection sur la même population.', image: MEDIAS_CAC.selection },
      { numero: 4, titre: 'Faire valider, remettre la fiche outil, maintenir.', texte: 'La recette est la vérification du traitement par votre équipe dans l’environnement autorisé. Nous livrons la règle, les essais et la fiche outil pour votre appréciation au dossier. La maintenance et les évolutions sont écrites au devis.', image: MEDIAS_CAC.ecarts },
    ],
  },
  integration: {
    titre: 'Votre suite d’audit reste le point de départ.',
    texte: 'Nous partons de vos exports, fichiers et circuits existants. Pour rapprocher un état d’immobilisations de la balance, nous cadrons les périodes, les comptes, les clés et les pièces à retrouver.',
    limites: 'Formats, accès et fonctions de votre version sont vérifiés avant l’engagement. Une connexion directe n’est annoncée qu’après cette vérification.',
    regles: [
      { titre: 'Conserver les fonctions utilisées.', texte: 'Les lettres et leur circuit d’envoi restent dans vos outils de circularisation.' },
      { titre: 'Rendre la source lisible.', texte: 'Le tableau préparé conserve les références nécessaires pour retourner au fichier et à la ligne concernés.' },
      { titre: 'Cadrer les changements.', texte: 'Une nouvelle structure de fichier ou un changement de règle se vérifie avant de reprendre le traitement.' },
    ],
    image: MEDIAS_CAC.rapprochements,
  },
  preuves: {
    etiquette: 'Illustrations fonctionnelles fictives',
    titre: 'Une différence calculée reste un point à examiner.',
    texte: 'La feuille prépare les écarts entre la demande et la réponse. Une différence de période ou de périmètre bloque le rapprochement. Une non-réponse reste ouverte pour l’équipe d’audit.',
    propriete: 'Vos commentaires et conclusions restent intacts quand la proposition se régénère. Le CAC décide des procédures alternatives ou supplémentaires et apprécie les éléments obtenus. Aucun envoi externe sans validation humaine.',
    reperes: [
      { title: 'La sélection se reproduit.', text: 'Même population, même version, mêmes paramètres et même graine : le jeu fictif permet de vérifier le tirage.' },
      { title: 'L’écart garde son origine.', text: 'Le montant demandé, le montant reçu et leurs références restent visibles. Le calcul ne vaut pas conclusion.' },
      { title: 'Le rapprochement montre ses limites.', text: 'Une pièce absente ou deux clés possibles laissent la ligne ouverte. Le traitement n’invente pas de correspondance.' },
    ],
    image: MEDIAS_CAC.ecarts,
  },
  garanties: {
    titre: 'Le secret, l’indépendance et le jugement cadrent la mission.',
    invitation: 'Lire les réponses pour votre cabinet',
    image: MEDIAS_CAC.rapprochements,
    liens: [
      { picto: 'bouclier', libelle: 'Données et accès cadrés par mission', href: '#faq-secret' },
      { picto: 'regle', libelle: 'Indépendance appréciée par le CAC', href: '#faq-independance' },
      { picto: 'main', libelle: 'Opinion et responsabilité au CAC', href: '#faq-opinion' },
      { picto: 'fictif', libelle: 'Des données inventées pour les essais', href: '#faq-essais' },
      { picto: 'stop', libelle: 'Le doute arrête la proposition', href: '#faq-arret' },
      { picto: 'regle', libelle: 'Une fiche outil pour votre appréciation', href: '#faq-fiche' },
    ],
  },
  faq: {
    titre: 'Les questions à régler avant de confier une tâche.',
    texte: 'Votre suite, les données, la sélection et le dossier : des réponses pour délimiter le traitement.',
    questions: [
      { id: 'suite', question: 'Notre suite d’audit fait déjà ces travaux. Que prenez-vous en charge ?', reponse: 'Nous vérifions d’abord ce que votre version couvre. Nous conservons ces fonctions et ciblons le geste restant : votre règle de sélection des tiers, les écarts de confirmation ou les fichiers du client à rapprocher de la balance. Si votre outil couvre déjà la tâche, nous vous le disons.' },
      { id: 'selection', question: 'Qui choisit les tiers à circulariser ?', reponse: 'Vous fixez la population, les critères et les paramètres. Nous préparons une sélection selon cette règle, avec les raisons du choix et la graine du tirage. Vous retenez les tiers. La NEP 505 (§ 09) vous laisse la maîtrise de la sélection, de la rédaction, de l’envoi et de la réception des réponses.' },
      { id: 'alternatives', question: 'Que faire lorsqu’un tiers ne répond pas ?', reponse: 'La non-réponse reste visible. Nous préparons les rapprochements et les références aux pièces prévues dans le périmètre. Vous décidez et mettez en œuvre les procédures alternatives nécessaires, puis appréciez les éléments obtenus. La NEP 505 (§ 13 à 15) prévoit aussi des procédures supplémentaires lorsque les éléments restent insuffisants.' },
      { id: 'fiche', question: 'Comment apprécier l’outil pour la NEP 315 révisée ?', reponse: 'Nous remettons une fiche décrivant le fonctionnement, la version, les entrées, les contrôles de fiabilité, les paramètres, les sorties et les limites. Les essais fictifs montrent les résultats et les arrêts attendus. Vous appréciez le fonctionnement et les informations intégrées, puis consignez votre appréciation au dossier (§ 46 et 48 d). Le § 14 définit les outils automatisés ; il n’impose pas notre modèle de fiche.' },
      { id: 'dossier', question: 'Le tableau préparé suffit-il pour documenter les travaux ?', reponse: 'Vous appréciez et complétez les paramètres, traces et résultats remis. La NEP 230 (§ 04) demande de pouvoir comprendre les procédures, les éléments testés, les résultats et les conclusions. La fiche décrit le traitement ; votre dossier documente aussi vos travaux et votre jugement. Un export seul ne démontre pas la suffisance des diligences.' },
      { id: 'secret', question: 'Comment cadrer le secret professionnel et les accès ?', reponse: 'Le secret de L.821-35 s’applique aux CAC, collaborateurs et experts. Avant la mission, nous décrivons les données lues, les accès, les destinataires et les traitements. Les essais utilisent des données fictives. Une exécution locale se vérifie aussi par ses appels réseau et sa télémétrie. Vous appréciez les conditions d’utilisation ; le recours à Memlia ne lève pas le secret.' },
      { id: 'independance', question: 'Notre cabinet fait aussi la comptabilité. Pouvons-nous partager la règle ?', reponse: 'Chaque mission conserve son périmètre, ses accès et ses responsabilités. Vous appréciez les incompatibilités et les risques d’indépendance, notamment au regard de L.821-27, L.821-31 et du code de déontologie. Le partage d’un outil ne justifie pas de préparer puis d’auditer les mêmes comptes.' },
      { id: 'opinion', question: 'Qui conserve l’opinion et la responsabilité de la mission ?', reponse: 'Le commissaire aux comptes conserve la responsabilité de sa mission et de son opinion. Nous préparons les sélections, rapprochements et exceptions. Votre équipe garde les contrôles et le signataire ses conclusions et sa signature. Une sortie de traitement ne certifie pas les comptes.' },
      { id: 'arret', question: 'Que se passe-t-il si les fichiers ne concordent pas ?', reponse: 'Une période différente, une population incomplète ou une clé ambiguë bloque la proposition concernée et en affiche la raison. Vos commentaires restent conservés. L’équipe examine le cas avant de reprendre ; le traitement ne complète pas une donnée au jugé.' },
      { id: 'essais', question: 'Comment vérifier le traitement avant son utilisation ?', reponse: 'Nous construisons un jeu d’essai fictif avec des données inventées. Il contient les cas qui doivent aboutir et ceux qui doivent s’arrêter. Votre équipe vérifie ensuite le traitement dans l’environnement autorisé : c’est la recette. Cette vérification et la fiche outil accompagnent votre appréciation ; elles ne garantissent pas la conformité du dossier aux NEP.' },
      { id: 'prix', question: 'Que comprend le devis ?', reponse: 'Une tâche prise en charge, de l’observation à la livraison et à la maintenance convenue. Le prix dépend des sources, des règles, des exceptions et des validations. Vous payez la complexité du traitement, pas des sièges. Le périmètre, les critères de recette, le support et les évolutions sont écrits avant de commencer.' },
    ],
  },
  appelFinal: {
    titre: 'Quelle manipulation votre équipe refait-elle à chaque mandat ?',
    texte: 'Décrivez le geste en trois phrases. Nous vous disons ce que votre suite couvre, ce qui peut se cadrer et ce que nous prendrions en charge. Rien à envoyer : la description suffit.',
    points: [
      'Le geste restant : votre équipe, ses outils et le résultat attendu.',
      'La règle : les sources, les exceptions et les validations.',
      'Le devis : une tâche entière, avec sa recette et sa maintenance.',
    ],
  },
};
