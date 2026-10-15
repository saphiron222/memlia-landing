import type { ContenuAccueil } from './types';

/** E1 : copy CAC à relire par E2. E3 enregistre les médias avant le branchement E4. */
export const SEO_CAC = {
  chemin: '/commissaires-aux-comptes',
  requete: 'automatisation commissaire aux comptes',
  titre: 'Automatisation pour commissaire aux comptes | Memlia',
  description: 'Automatisation pour commissaire aux comptes : agents IA, pièces et rapprochements préparés. Déploiement adapté à vos mandats, maintenance et sur mesure.',
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

/** Trois cadres fictifs rendus et scellés par E3, réutilisables uniquement sur l’accueil CAC. */
export const MEDIAS_CAC = {
  selection: 'cac/accueil-selection-tiers',
  ecarts: 'cac/accueil-ecarts-confirmation',
  rapprochements: 'cac/accueil-fichiers-balance',
} as const;

export const CONTENU_CAC: ContenuAccueil = {
  hero: {
    etiquette: 'Automatisation IA pour cabinets de commissariat aux comptes',
    titre: 'Automatisation pour commissaire aux comptes : robots et agents IA.',
    texte: 'Nous déployons des agents IA pour préparer les pièces, sélections et rapprochements de vos mandats. Vos auditeurs vérifient les résultats ; le signataire garde ses conclusions. Nous adaptons le catalogue à vos travaux et construisons sur mesure au besoin.',
    poster: '/media/cac-r4/hero-poster-1200.webp',
    video: '/media/cac-r4/explainer-hero-45s.mp4',
    sousTitres: '/media/cac-r4/explainer.vtt',
    sousTitresOptionnels: true,
    descriptionVideo: 'Démonstration sur un jeu fictif : réponses de tiers, proposition de montant, ambiguïté bloquée et validation par le cabinet. Les conclusions restent au CAC.',
  },
  orientation: {
    titre: 'Choisissez ce qui prépare vos mandats.',
    destinations: [
      { libelle: 'Certification des comptes', href: '#use-certification', texte: 'Sélection des tiers à circulariser, écarts de confirmation, fichiers du client à rapprocher : une mécanique cadrée autour de vos travaux.' },
      { libelle: 'Interventions légales', href: '#use-interventions', texte: 'Une opération ponctuelle : réunir les données et préparer les comparaisons prévues, dans le périmètre de cette intervention.' },
      { libelle: 'Services autres que la certification des comptes (SACC)', href: '#use-sacc', texte: 'Une prestation distincte : écrire le traitement attendu et ses limites, après votre appréciation de l’indépendance.' },
      { libelle: 'Durabilité', href: '#use-durabilite', texte: 'Pour une mission entrant dans votre périmètre : préparer les rapprochements entre indicateurs et pièces. Le cadrage précède toute automatisation.' },
      { libelle: 'Administration des mandats', href: '#use-administration', texte: 'Préparer les comparaisons de budget ou l’échéancier que vos outils ne couvrent pas, avec les paramètres de votre cabinet.' },
    ],
    invitation: 'Préparer le déploiement dans votre cabinet',
    services: [
      { libelle: 'La règle écrite', href: '#methode' },
      { libelle: 'Vos garanties', href: '#garanties' },
      { libelle: 'Les questions pratiques', href: '#questions' },
    ],
  },
  quotidien: {
    titre: 'Des feuilles de travail préparées pour votre revue.',
    texte: 'La balance arrive, les réponses de tiers s’accumulent et les fichiers du client restent à rapprocher. L’agent prépare la sélection selon vos paramètres, les tableaux de comparaison et les références aux pièces. Votre équipe reprend les écarts et documente son appréciation.',
    points: [
      { titre: 'Reprendre les paramètres.', texte: 'Population, critères, couverture ou nombre de comptes : les choix du cabinet restent visibles d’une passe à l’autre.' },
      { titre: 'Retrouver l’origine.', texte: 'Chaque proposition renvoie à son tiers, à sa source et à la règle qui l’a retenue.' },
      { titre: 'Reprendre le travail.', texte: 'Le chef de mission retrouve les paramètres, les exceptions et les références dans le résultat préparé. Il garde ses commentaires et ses conclusions.' },
    ],
    note: 'Nous adaptons l’agent aux formats, aux accès et aux procédures que vous avez retenus. Le choix des diligences et l’appréciation des éléments collectés restent au commissaire aux comptes.',
    image: MEDIAS_CAC.selection,
  },
  promesse: {
    titre: 'Un agent adapté à vos travaux, maintenu par Memlia.',
    texte: 'Nous partons des prises en charge Memlia et les adaptons à votre environnement d’audit. Vous définissez les travaux ; nous préparons le traitement, sa mise en service et la maintenance convenue.',
    points: [
      { titre: 'Un déploiement défini par mission.', texte: 'Nous précisons les sources, les critères, les accès et les exceptions avec votre équipe. Les fonctions de votre suite d’audit restent en place.' },
      { titre: 'Des propositions à relire.', texte: 'La sélection et les rapprochements préparés restent distincts de vos commentaires et de vos conclusions.' },
      { titre: 'Le sur mesure pour vos besoins propres.', texte: 'Un fichier particulier ou une comparaison absente du catalogue ? Nous construisons le traitement nécessaire, avec les limites et les essais de cette mission.' },
    ],
    image: MEDIAS_CAC.selection,
  },
  usages: {
    titre: 'Des gestes précis, dans le périmètre de chaque mission.',
    texte: 'Sélection de tiers, écarts de confirmation et rapprochements de fichiers sont des points de départ. Nous adaptons nos agents à vos procédures ; les besoins propres aux autres missions font l’objet d’un périmètre et d’un traitement sur mesure.',
    exemples: [
      { id: 'certification', title: 'Préparer la sélection et les rapprochements', text: 'Appliquer votre règle de soldes, mouvements et part aléatoire aux tiers à circulariser. Préparer deux passes, puis la feuille des écarts de confirmation. Rapprocher les fichiers de paie, d’immobilisations ou d’inventaire avec les comptes convenus de la balance.' },
      { id: 'interventions', title: 'Préparer les comparaisons d’une intervention légale', text: 'Pour une opération d’apport, de fusion ou de transformation, définir les sources et les comparaisons à préparer. La nature de la mission, les contrôles et les conclusions restent au professionnel.' },
      { id: 'sacc', title: 'Cadrer la mécanique d’une prestation distincte', text: 'Écrire les rapprochements attendus pour un service autre que la certification des comptes. Le périmètre, les accès et l’appréciation de l’indépendance se traitent séparément pour chaque mission.' },
      { id: 'durabilite', title: 'Relier un indicateur à ses pièces', text: 'Si la mission entre dans le périmètre de votre cabinet, cadrer une préparation reliant les indicateurs reçus à leurs sources. L’appréciation de ces informations et les conclusions restent au professionnel chargé de la mission.' },
      { id: 'administration', title: 'Préparer les repères du portefeuille de mandats', text: 'Partir des dates et budgets que vous avez retenus pour préparer un échéancier ou une comparaison. Nous conservons les fonctions de votre suite, notamment le préremplissage des déclarations qu’elle propose.' },
    ],
  },
  methode: {
    titre: 'Du choix de l’agent à son utilisation dans vos mandats.',
    libelleEtape: 'Étape',
    etapes: [
      { numero: 1, titre: 'Retenir une première prise en charge.', texte: 'Nous identifions l’agent et la tâche utiles à vos mandats, en tenant compte des fonctions de votre suite d’audit. Le résultat attendu et la frontière du traitement sont écrits.', image: MEDIAS_CAC.selection },
      { numero: 2, titre: 'Adapter à vos procédures.', texte: 'Vous fixez les critères. Nous configurons les entrées, les propositions et les arrêts. Si le catalogue ne couvre pas votre comparaison, nous construisons le traitement sur mesure.', image: MEDIAS_CAC.rapprochements },
      { numero: 3, titre: 'Vérifier les résultats et les limites.', texte: 'Les essais fictifs montrent les résultats attendus et les cas bloqués. Votre équipe fait la recette dans l’environnement autorisé. La fiche outil décrit le traitement pour votre appréciation au dossier.', image: MEDIAS_CAC.selection },
      { numero: 4, titre: 'Mettre en service et maintenir.', texte: 'Nous déployons le périmètre accepté. La règle, les essais et la fiche outil accompagnent la livraison. Le devis définit la maintenance, le support et les évolutions couverts.', image: MEDIAS_CAC.ecarts },
    ],
  },
  integration: {
    titre: 'Dans votre environnement d’audit.',
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
    titre: 'Avant de déployer un agent dans vos mandats.',
    texte: 'Compatibilité, déploiement, données et responsabilité : les points à préciser avec votre cabinet.',
    questions: [
      { id: 'suite', question: 'Notre suite d’audit fait déjà ces travaux. Que prenez-vous en charge ?', reponse: 'Nous vérifions d’abord ce que votre version couvre. Nous conservons ces fonctions et ciblons le geste restant : votre règle de sélection des tiers, les écarts de confirmation ou les fichiers du client à rapprocher de la balance. Si votre outil couvre déjà la tâche, nous vous le disons.' },
      { id: 'selection', question: 'Qui choisit les tiers à circulariser ?', reponse: 'Vous fixez la population, les critères et les paramètres. Nous préparons une sélection selon cette règle, avec les raisons du choix et la graine du tirage. Vous retenez les tiers. La NEP 505 (§ 09) vous laisse la maîtrise de la sélection, de la rédaction, de l’envoi et de la réception des réponses.' },
      { id: 'alternatives', question: 'Que faire lorsqu’un tiers ne répond pas ?', reponse: 'La non-réponse reste visible. Nous préparons les rapprochements et les références aux pièces prévues dans le périmètre. Vous décidez et mettez en œuvre les procédures alternatives nécessaires, puis appréciez les éléments obtenus. La NEP 505 (§ 13 à 15) prévoit aussi des procédures supplémentaires lorsque les éléments restent insuffisants.' },
      { id: 'fiche', question: 'Comment apprécier l’outil au regard des NEP 315 et 330 révisées ?', reponse: 'Nous remettons une fiche décrivant l’objectif, le fonctionnement, la version, les entrées, les contrôles de fiabilité, les paramètres, les sorties, les traces et les limites. Les essais fictifs montrent les résultats et les arrêts attendus. Vous appréciez si l’outil permet d’atteindre l’objectif de vos procédures : son fonctionnement, la pertinence et la fiabilité des informations intégrées. Vous consignez cette appréciation au dossier : NEP 315 révisée (§ 46 et 48 d) pour l’évaluation des risques, NEP 330 révisée (§ 33 et 34 e) pour les procédures qui y répondent, comme la circularisation. La fiche est notre support de livraison ; elle ne remplace pas votre appréciation. Le § 14 de la NEP 315 définit les outils et techniques automatisés et les distingue des logiciels de dossier ; il n’impose pas notre modèle de fiche.' },
      { id: 'dossier', question: 'Le tableau préparé suffit-il pour documenter les travaux ?', reponse: 'Vous appréciez et complétez les paramètres, traces et résultats remis. La NEP 230 (§ 04) demande de pouvoir comprendre les procédures, les éléments testés, les résultats et les conclusions. La fiche décrit le traitement ; votre dossier documente aussi vos travaux et votre jugement. Un export seul ne démontre pas la suffisance des diligences.' },
      { id: 'secret', question: 'Comment cadrer le secret professionnel et les accès ?', reponse: 'Le secret de L.821-35 s’applique aux CAC, collaborateurs et experts. Avant la mission, nous décrivons les données lues, les accès, les destinataires et les traitements. Les essais utilisent des données fictives. Une exécution locale se vérifie aussi par ses appels réseau et sa télémétrie. Vous appréciez les conditions d’utilisation ; le recours à Memlia ne lève pas le secret.' },
      { id: 'independance', question: 'Notre cabinet fait aussi la comptabilité. Pouvons-nous partager la règle ?', reponse: 'Chaque mission conserve son périmètre, ses accès et ses responsabilités. Vous appréciez les incompatibilités et les risques d’indépendance, notamment au regard de L.821-27, L.821-31 et du code de déontologie. Le partage d’un outil ne justifie pas de préparer puis d’auditer les mêmes comptes.' },
      { id: 'opinion', question: 'Qui conserve l’opinion et la responsabilité de la mission ?', reponse: 'Le commissaire aux comptes conserve la responsabilité de sa mission et de son opinion. Nous préparons les sélections, rapprochements et exceptions. Votre équipe garde les contrôles et le signataire ses conclusions et sa signature. Une sortie de traitement ne certifie pas les comptes.' },
      { id: 'arret', question: 'Que se passe-t-il si les fichiers ne concordent pas ?', reponse: 'Une période différente, une population incomplète ou une clé ambiguë bloque la proposition concernée et en affiche la raison. Vos commentaires restent conservés. L’équipe examine le cas avant de reprendre ; le traitement ne complète pas une donnée au jugé.' },
      { id: 'essais', question: 'Comment vérifier le traitement avant son utilisation ?', reponse: 'Nous construisons un jeu d’essai fictif avec des données inventées. Il contient les cas qui doivent aboutir et ceux qui doivent s’arrêter. Votre équipe vérifie ensuite le traitement dans l’environnement autorisé : c’est la recette. Cette vérification et la fiche outil accompagnent votre appréciation ; elles ne garantissent pas la conformité du dossier aux NEP.' },
      { id: 'prix', question: 'Que comprend le devis ?', reponse: 'Le déploiement de la prise en charge retenue, son adaptation à votre cabinet, la recette et la maintenance convenue. Une construction sur mesure est précisée lorsqu’elle est nécessaire. Le prix dépend des sources, des règles, des exceptions et des validations. Vous payez une tâche prise en charge, pas des sièges.' },
    ],
  },
  appelFinal: {
    titre: 'Préparons le premier déploiement pour vos mandats.',
    texte: 'Indiquez l’agent ou la préparation qui vous intéresse, votre suite d’audit et le résultat attendu. Nous définissons l’adaptation, les validations et le devis. Un besoin particulier peut aussi faire l’objet d’une construction sur mesure.',
    points: [
      'Une première tâche utile à vos mandats.',
      'Un périmètre adapté à vos procédures.',
      'Un devis couvrant le déploiement et la maintenance.',
    ],
  },
};
