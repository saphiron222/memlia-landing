export interface GlossarySource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  checkedAt: string;
}

export interface GlossaryLink {
  label: string;
  href: string;
}

export interface GlossaryEntry {
  id: string;
  term: string;
  anchor: string;
  nature: 'Réglementaire' | 'Professionnelle' | 'Éditoriale Memlia' | 'Technique';
  definition: string;
  context: string;
  exampleFictitious: string;
  commonConfusion: string;
  automationBoundary: string;
  relatedTerms: string[];
  internalLinks: GlossaryLink[];
  owner: string;
  author: 'Memlia';
  editorialReviewer: 'Équipe éditoriale Memlia';
  businessReviewer: null;
  reviewedAt: null;
  sourceCheckedAt: '2026-09-14';
  nextReviewAt: '2026-12-13' | '2027-03-13';
  sourceIds: string[];
  routeDecision: 'anchor';
  status: 'preview-only';
}

export const GLOSSARY_SOURCES: Record<string, GlossarySource> = {
  'net-dsn-overview': {
    id: 'net-dsn-overview', publisher: 'Net-entreprises',
    title: 'DSN-INFO : la déclaration sociale nominative', url: 'https://www.net-entreprises.fr/tableau-de-bord-dsn/', checkedAt: '2026-09-14',
  },
  'net-dsn-val': {
    id: 'net-dsn-val', publisher: 'Net-entreprises',
    title: 'Outils d’auto-contrôle DSN-Val', url: 'https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/', checkedAt: '2026-09-14',
  },
  'net-crm': {
    id: 'net-crm', publisher: 'Net-entreprises',
    title: 'Les comptes rendus métiers DSN', url: 'https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/', checkedAt: '2026-09-14',
  },
  'net-annule': {
    id: 'net-annule', publisher: 'Net-entreprises',
    title: 'Annule et remplace — DSN mensuelle et signalements', url: 'https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/', checkedAt: '2026-09-14',
  },
  'net-fiabilisation': {
    id: 'net-fiabilisation', publisher: 'Net-entreprises',
    title: 'La fiabilisation des données de la DSN', url: 'https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/', checkedAt: '2026-09-14',
  },
  'cnil-donnee': {
    id: 'cnil-donnee', publisher: 'CNIL',
    title: 'Donnée personnelle', url: 'https://www.cnil.fr/fr/definition/donnee-personnelle', checkedAt: '2026-09-14',
  },
  'cnil-rgpd': {
    id: 'cnil-rgpd', publisher: 'CNIL',
    title: 'Principes relatifs au traitement des données', url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2', checkedAt: '2026-09-14',
  },
  'cnil-anonymisation': {
    id: 'cnil-anonymisation', publisher: 'CNIL',
    title: 'L’anonymisation de données personnelles', url: 'https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles', checkedAt: '2026-09-14',
  },

  'service-public-recouvrement': {
    id: 'service-public-recouvrement', publisher: 'Service-Public Entreprendre',
    title: 'Recouvrement amiable : relance et mise en demeure de payer', url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F38586', checkedAt: '2026-09-14',
  },
  'methode-memlia': {
    id: 'methode-memlia', publisher: 'Memlia',
    title: 'Méthode : écrire la règle, éprouver, livrer', url: '/#methode', checkedAt: '2026-09-14',
  },
  'article-controle-dsn': {
    id: 'article-controle-dsn', publisher: 'Memlia',
    title: 'Contrôler les bulletins de paie avant la DSN', url: '/blog/controler-les-bulletins-de-paie-avant-la-dsn', checkedAt: '2026-09-14',
  },
  'article-production-sociale': {
    id: 'article-production-sociale', publisher: 'Memlia',
    title: 'Suivre la production sociale dans Excel', url: '/blog/suivre-la-production-sociale-dans-excel', checkedAt: '2026-09-14',
  },
  nist: {
    id: 'nist', publisher: 'NIST', title: 'Audit trail', url: 'https://csrc.nist.gov/glossary/term/audit_trail', checkedAt: '2026-09-14',
  },
};

const common = {
  author: 'Memlia' as const,
  editorialReviewer: 'Équipe éditoriale Memlia' as const,
  businessReviewer: null,
  reviewedAt: null,
  sourceCheckedAt: '2026-09-14' as const,
  routeDecision: 'anchor' as const,
  status: 'preview-only' as const,
};

export const GLOSSARY_ENTRIES = ([
  {
    ...common, id: 'dsn', term: 'DSN', anchor: 'dsn', nature: 'Réglementaire',
    definition: 'La déclaration sociale nominative (DSN) est obligatoire pour les entreprises du secteur privé ainsi que pour la fonction publique ; elle remplace des formalités qui s’appuient sur les données de paie.',
    context: 'Le pôle social prépare la paie, contrôle le fichier, dépose la DSN puis traite les retours des organismes.',
    exampleFictitious: 'Pour un dossier fictif, le fichier du mois est contrôlé avant son dépôt ; aucun salarié réel n’est utilisé.',
    commonConfusion: 'Convention Memlia : un fichier accepté techniquement reste soumis à la revue de paie du cabinet.',
    automationBoundary: 'L’automatisation peut préparer des contrôles et signaler des écarts ; le gestionnaire valide les corrections et le dépôt.',
    relatedTerms: ['dsn-val', 'compte-rendu-metier-dsn', 'annule-et-remplace-dsn'],
    internalLinks: [{ label: 'la méthode complète de contrôle avant DSN', href: '/blog/controler-les-bulletins-de-paie-avant-la-dsn' }],
    owner: 'Pôle social', nextReviewAt: '2026-12-13', sourceIds: ['net-dsn-overview'],
  },
  {
    ...common, id: 'dsn-val', term: 'DSN-Val', anchor: 'dsn-val', nature: 'Réglementaire',
    definition: 'DSN-Val est l’outil d’auto-contrôle qui teste un fichier DSN avant dépôt selon le cahier technique et le journal de maintenance de la norme associés.',
    context: 'Il intervient après les contrôles de paie et avant le dépôt.',
    exampleFictitious: 'Un export fictif est refusé parce qu’une rubrique ne respecte pas la structure attendue.',
    commonConfusion: 'Convention Memlia : la recherche des primes oubliées relève de la revue du bulletin, distincte du test DSN-Val.',
    automationBoundary: 'Lancer le test et lire un résultat sont automatisables ; qualifier l’origine métier et corriger la paie relèvent du gestionnaire.',
    relatedTerms: ['dsn', 'controle-avant-dsn', 'controle-de-coherence'],
    internalLinks: [{ label: 'les contrôles métier à réaliser avant le dépôt', href: '/blog/controler-les-bulletins-de-paie-avant-la-dsn' }],
    owner: 'Pôle social', nextReviewAt: '2026-12-13', sourceIds: ['net-dsn-val'],
  },
  {
    ...common, id: 'compte-rendu-metier-dsn', term: 'Compte rendu métier DSN', anchor: 'compte-rendu-metier-dsn', nature: 'Réglementaire',
    definition: 'Un compte rendu métier est le retour d’un organisme ou d’une administration après réception d’une déclaration lorsqu’une erreur ou une suspicion d’erreur est détectée ; il peut aussi confirmer la qualité du traitement reçu.',
    context: 'Le pôle social lit les retours, rattache chaque anomalie au dossier et décide de l’action.',
    exampleFictitious: 'Un retour fictif signale un écart d’assiette ; la ligne est remontée pour revue, pas corrigée automatiquement.',
    commonConfusion: 'Convention Memlia : même sans anomalie visible dans un retour, le cabinet conserve sa revue de paie.',
    automationBoundary: 'Collecter, classer et rapprocher le retour du dossier est automatisable ; la correction et sa fenêtre sont validées par le gestionnaire.',
    relatedTerms: ['dsn', 'annule-et-remplace-dsn', 'tracabilite'],
    internalLinks: [{ label: 'le traitement des contrôles et retours DSN', href: '/blog/controler-les-bulletins-de-paie-avant-la-dsn' }],
    owner: 'Pôle social', nextReviewAt: '2026-12-13', sourceIds: ['net-crm', 'net-fiabilisation'],
  },
  {
    ...common, id: 'annule-et-remplace-dsn', term: 'Annule et remplace DSN', anchor: 'annule-et-remplace-dsn', nature: 'Réglementaire',
    definition: 'Une DSN « annule et remplace » remplace une déclaration déjà transmise dans la fenêtre autorisée pour ce type de déclaration.',
    context: 'Elle sert lorsqu’une erreur est identifiée assez tôt pour corriger la paie et retransmettre avant la fermeture de la fenêtre applicable.',
    exampleFictitious: 'Une variable oubliée est repérée sur un dossier fictif ; le gestionnaire confirme la correction puis choisit la déclaration adaptée.',
    commonConfusion: 'Les mêmes délais ne valent pas pour chaque déclaration ou signalement.',
    automationBoundary: 'Détecter l’écart et préparer un dossier de correction est automatisable ; choisir, corriger et transmettre exige une validation.',
    relatedTerms: ['dsn', 'compte-rendu-metier-dsn', 'cas-de-refus'],
    internalLinks: [{ label: 'comprendre le contrôle avant une correction DSN', href: '/blog/controler-les-bulletins-de-paie-avant-la-dsn' }],
    owner: 'Pôle social', nextReviewAt: '2026-12-13', sourceIds: ['net-annule'],
  },
  {
    ...common, id: 'controle-avant-dsn', term: 'Contrôle avant DSN', anchor: 'controle-avant-dsn', nature: 'Éditoriale Memlia',
    definition: 'Dans ce glossaire, Memlia appelle « contrôle avant DSN » l’ensemble des vérifications que le cabinet choisit de rejouer entre le calcul de la paie et le dépôt : pièces, variables, écarts, cohérences métier et conformité du fichier.',
    context: 'La liste appartient au cabinet, avec pour chaque contrôle un attendu, une exception et un valideur.',
    exampleFictitious: 'Une variation de brut est signalée ; une prime annuelle documentée explique l’écart, qui est alors validé.',
    commonConfusion: 'Ce contrôle ne se réduit pas à DSN-Val et tout écart n’est pas nécessairement une erreur.',
    automationBoundary: 'Comparer, tester et documenter sont automatisables ; qualifier l’écart, modifier la paie et déposer restent humains.',
    relatedTerms: ['dsn-val', 'controle-de-coherence', 'regle-de-cabinet'],
    internalLinks: [{ label: 'la méthode complète de contrôle avant DSN', href: '/blog/controler-les-bulletins-de-paie-avant-la-dsn' }],
    owner: 'Article contrôle DSN', nextReviewAt: '2027-03-13', sourceIds: ['article-controle-dsn', 'net-fiabilisation'],
  },
  {
    ...common, id: 'production-sociale', term: 'Production sociale', anchor: 'production-sociale', nature: 'Éditoriale Memlia',
    definition: 'Dans ce glossaire, Memlia appelle « production sociale » le cycle de travail retenu par le cabinet pour collecter les variables, établir et contrôler les bulletins, déposer les déclarations puis traiter les retours et documents.',
    context: 'Le pilotage porte sur des dossiers, des étapes et des échéances, pas sur un classement individuel des personnes.',
    exampleFictitious: 'Une vue agrège les dossiers fictifs « pièces reçues », « contrôlés » et « déposés » pour le mois.',
    commonConfusion: 'La production sociale n’est ni le logiciel de paie ni une mesure de productivité individuelle.',
    automationBoundary: 'Mettre à jour les états, calculer des agrégats et signaler les exceptions est automatisable ; relancer ou valider un dépôt reste humain.',
    relatedTerms: ['controle-avant-dsn', 'agregat-non-nominatif', 'validation-humaine'],
    internalLinks: [{ label: 'structurer un suivi par dossier, sans classer les personnes', href: '/blog/suivre-la-production-sociale-dans-excel' }],
    owner: 'Article production sociale', nextReviewAt: '2027-03-13', sourceIds: ['article-production-sociale'],
  },
  {
    ...common, id: 'donnee-personnelle', term: 'Donnée personnelle', anchor: 'donnee-personnelle', nature: 'Réglementaire',
    definition: 'Toute information se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement.',
    context: 'Une personne physique peut être identifiée directement ou indirectement.',
    exampleFictitious: 'Un tableau remplace les noms par des numéros, mais une table séparée permet de retrouver les personnes : les données restent personnelles.',
    commonConfusion: 'Retirer le nom ne suffit pas toujours à sortir du champ du RGPD.',
    automationBoundary: 'Détecter certains champs ou empêcher leur export peut être automatisé ; déterminer la finalité, la base et les accès exige une décision responsable.',
    relatedTerms: ['pseudonymisation', 'anonymisation', 'minimisation-des-donnees'],
    internalLinks: [{ label: 'le cadrage des données avant développement', href: '/#faq-donnees-reelles' }],
    owner: 'Référentiel RGPD', nextReviewAt: '2026-12-13', sourceIds: ['cnil-donnee'],
  },
  {
    ...common, id: 'minimisation-des-donnees', term: 'Minimisation des données', anchor: 'minimisation-des-donnees', nature: 'Réglementaire',
    definition: 'Principe selon lequel les données traitées doivent être adéquates, pertinentes et limitées à ce qui est nécessaire au regard de la finalité.',
    context: 'Convention Memlia : le suivi retient l’état du dossier, pas l’enregistrement de chaque geste individuel.',
    exampleFictitious: 'La vue affiche trois dossiers en attente, sans nom de gestionnaire ni temps passé.',
    commonConfusion: 'La finalité du traitement détermine quelles données sont nécessaires ; une colonne sans nécessité au regard de cette finalité est exclue.',
    automationBoundary: 'Bloquer des champs interdits et produire une vue agrégée est automatisable ; fixer la finalité et décider ce qui est nécessaire reste humain.',
    relatedTerms: ['donnee-personnelle', 'agregat-non-nominatif', 'regle-de-cabinet'],
    internalLinks: [{ label: 'structurer un suivi sans surveillance individuelle', href: '/blog/suivre-la-production-sociale-dans-excel' }],
    owner: 'Référentiel RGPD', nextReviewAt: '2026-12-13', sourceIds: ['cnil-rgpd'],
  },
  {
    ...common, id: 'anonymisation', term: 'Anonymisation', anchor: 'anonymisation', nature: 'Réglementaire',
    definition: 'Traitement visant à rendre impossible, en pratique, l’identification d’une personne par tout moyen raisonnablement utilisable et de manière irréversible.',
    context: 'Convention Memlia : nous réservons le mot « anonyme » à un résultat dont les possibilités de réidentification ont été examinées.',
    exampleFictitious: 'Un petit groupe avec un seul dossier atypique reste reconnaissable malgré l’absence de nom : l’export n’est pas déclaré anonyme.',
    commonConfusion: 'Les données pseudonymisées conservent un caractère personnel ; la pseudonymisation est réversible, contrairement à l’anonymisation.',
    automationBoundary: 'Appliquer des transformations et tester des seuils est automatisable ; qualifier juridiquement le résultat nécessite une revue humaine.',
    relatedTerms: ['pseudonymisation', 'donnee-personnelle', 'agregat-non-nominatif'],
    internalLinks: [{ label: 'les garanties appliquées aux données', href: '/#garanties' }],
    owner: 'Référentiel RGPD', nextReviewAt: '2026-12-13', sourceIds: ['cnil-anonymisation'],
  },
  {
    ...common, id: 'pseudonymisation', term: 'Pseudonymisation', anchor: 'pseudonymisation', nature: 'Réglementaire',
    definition: 'Traitement de données personnelles réalisé de manière à ne plus pouvoir attribuer les données à une personne physique sans information supplémentaire.',
    context: 'Remplacer un nom par un identifiant limite l’exposition directe, mais les données restent personnelles si la personne peut être retrouvée.',
    exampleFictitious: 'La vue utilise « DOS-017 » et la table de correspondance est isolée avec des droits plus stricts.',
    commonConfusion: 'La pseudonymisation n’est ni une anonymisation ni une sortie du RGPD.',
    automationBoundary: 'Remplacer les identifiants et séparer les tables est automatisable ; choisir les accès, la conservation et l’usage reste une responsabilité humaine.',
    relatedTerms: ['anonymisation', 'donnee-personnelle', 'tracabilite'],
    internalLinks: [{ label: 'le cadrage des données avant développement', href: '/#faq-donnees-reelles' }],
    owner: 'Référentiel RGPD', nextReviewAt: '2026-12-13', sourceIds: ['cnil-anonymisation'],
  },
  {
    ...common, id: 'agregat-non-nominatif', term: 'Agrégat non nominatif', anchor: 'agregat-non-nominatif', nature: 'Éditoriale Memlia',
    definition: 'Résultat regroupant des dossiers, étapes ou périodes sans afficher un indicateur par personne.',
    context: 'Il aide à voir le flux global, par exemple les dossiers en attente, sans produire de classement individuel.',
    exampleFictitious: '« 7 dossiers à contrôler » est affiché pour le pôle ; aucun nom, cadence ou score de gestionnaire n’apparaît.',
    commonConfusion: 'Convention Memlia : nous ne déclarons jamais un export anonyme ou conforme au seul motif que ses lignes sont regroupées.',
    automationBoundary: 'Calculer et afficher les comptes est automatisable ; définir la granularité, la finalité et les droits de lecture relève du cabinet.',
    relatedTerms: ['minimisation-des-donnees', 'anonymisation', 'production-sociale'],
    internalLinks: [{ label: 'structurer un suivi par dossier, sans classer les personnes', href: '/blog/suivre-la-production-sociale-dans-excel' }],
    owner: 'Positionnement anti-surveillance', nextReviewAt: '2027-03-13', sourceIds: ['article-production-sociale', 'cnil-rgpd'],
  },
  {
    ...common, id: 'lettrage-comptable', term: 'Lettrage comptable', anchor: 'lettrage-comptable', nature: 'Éditoriale Memlia',
    definition: 'Dans ce glossaire, Memlia appelle « lettrage comptable » le rapprochement d’écritures que le cabinet considère comme liées, par exemple une facture et son règlement, au moyen d’un repère commun.',
    context: 'Le lettrage aide à distinguer les soldes expliqués des écritures encore ouvertes avant la revue.',
    exampleFictitious: 'Une facture fictive de 600 € et un règlement fictif de 600 € reçoivent le même repère ; un avoir non affecté reste ouvert.',
    commonConfusion: 'Il ne faut pas forcer un lettrage pour faire disparaître un écart ni associer des montants sans vérifier les pièces.',
    automationBoundary: 'Proposer des correspondances exactes ou plausibles est automatisable ; confirmer une affectation ambiguë ou un solde litigieux reste humain.',
    relatedTerms: ['piece-justificative', 'controle-de-coherence', 'tracabilite'],
    internalLinks: [{ label: 'partir du fichier et écrire la règle de contrôle', href: '/#methode' }],
    owner: 'Pratique comptable', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'rapprochement-bancaire', term: 'Rapprochement bancaire', anchor: 'rapprochement-bancaire', nature: 'Éditoriale Memlia',
    definition: 'Dans ce glossaire, Memlia appelle « rapprochement bancaire » le contrôle qui compare les mouvements et le solde comptables d’un compte au relevé de la banque, puis prépare l’explication des écarts de date, d’omission ou d’erreur.',
    context: 'Le collaborateur prépare l’état de rapprochement et remonte les écarts non expliqués au valideur.',
    exampleFictitious: 'Un virement fictif comptabilisé le 30 apparaît sur le relevé le 2 du mois suivant ; l’écart est daté, pas supprimé.',
    commonConfusion: 'Une écriture ne doit pas être modifiée uniquement pour forcer l’égalité des soldes.',
    automationBoundary: 'Importer, rapprocher des références et lister les écarts est automatisable ; justifier l’écart et passer une écriture restent soumis à validation.',
    relatedTerms: ['lettrage-comptable', 'piece-justificative', 'cas-de-refus'],
    internalLinks: [{ label: 'partir du fichier et écrire la règle de contrôle', href: '/#integration' }],
    owner: 'Pratique comptable', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'revision-comptable', term: 'Révision comptable', anchor: 'revision-comptable', nature: 'Éditoriale Memlia',
    definition: 'Dans ce glossaire, Memlia appelle « révision comptable » l’ensemble de contrôles défini par la mission du cabinet pour examiner les comptes, documenter les anomalies et préparer leur validation.',
    context: 'Les diligences, seuils et responsabilités dépendent de la mission ; la révision n’est pas automatiquement un audit légal.',
    exampleFictitious: 'Un cycle fournisseurs fictif comporte soldes anciens, doublons possibles et pièces manquantes ; chaque point reçoit preuve, conclusion ou demande de revue.',
    commonConfusion: 'Une checklist générique ne remplace pas les diligences adaptées à la mission et la révision n’est pas la certification des comptes.',
    automationBoundary: 'Exécuter des tests définis et préparer le dossier est automatisable ; fixer les diligences et conclure reste au professionnel.',
    relatedTerms: ['controle-de-coherence', 'piece-justificative', 'validation-humaine'],
    internalLinks: [{ label: 'partir du fichier et écrire la règle de contrôle', href: '/#methode' }],
    owner: 'Pratique comptable', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'piece-justificative', term: 'Pièce justificative', anchor: 'piece-justificative', nature: 'Éditoriale Memlia',
    definition: 'Dans ce glossaire, Memlia appelle « pièce justificative » le document ou la trace que le cabinet retient pour expliquer et étayer une opération enregistrée ou une décision de contrôle.',
    context: 'Elle relie l’écriture ou l’état du dossier à son origine et permet une revue ultérieure.',
    exampleFictitious: 'Une dépense fictive reste « à revoir » car le libellé bancaire existe, mais la facture correspondante manque.',
    commonConfusion: 'Un montant saisi, une capture sans origine ou un commentaire libre ne constitue pas toujours une preuve suffisante.',
    automationBoundary: 'Vérifier présence, format, date ou doublon est automatisable ; juger l’adéquation de la pièce et la traiter relève du professionnel.',
    relatedTerms: ['tracabilite', 'revision-comptable', 'schema-de-donnees'],
    internalLinks: [{ label: 'les preuves attendues avant une proposition', href: '/#preuves' }],
    owner: 'Pratique comptable', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'recouvrement-amiable', term: 'Recouvrement amiable', anchor: 'recouvrement-amiable', nature: 'Réglementaire',
    definition: 'Tentative d’obtenir le paiement d’une créance sans engager d’abord une action judiciaire, généralement par relance puis, en cas d’échec, par mise en demeure.',
    context: 'Avant tout envoi, il faut vérifier le statut du dossier, le paiement éventuel, l’échéance et le destinataire.',
    exampleFictitious: 'Un statut « déjà payé » bloque une relance préparée ; la personne contrôle le relevé avant de décider.',
    commonConfusion: 'Convention Memlia : un simple retard ne doit pas déclencher automatiquement un envoi. Une relance précède généralement la mise en demeure en cas d’échec ; ce sont deux étapes distinctes.',
    automationBoundary: 'Détecter les retards et préparer une proposition de message est automatisable ; décider du ton, du destinataire et envoyer reste humain.',
    relatedTerms: ['rapprochement-bancaire', 'cas-de-refus', 'validation-humaine'],
    internalLinks: [{ label: 'préparer sans envoyer avant validation', href: '/#garanties' }],
    owner: 'Recouvrement', nextReviewAt: '2026-12-13', sourceIds: ['service-public-recouvrement'],
  },
  {
    ...common, id: 'regle-de-cabinet', term: 'Règle de cabinet', anchor: 'regle-de-cabinet', nature: 'Éditoriale Memlia',
    definition: 'Instruction explicite qui décrit ce que le cabinet attend d’une entrée donnée, les exceptions admises et le résultat à préparer.',
    context: 'Elle part d’un contrôle ou d’un geste réellement pratiqué, puis est codée et éprouvée sur des fichiers fictifs ou autorisés.',
    exampleFictitious: '« Signaler toute ligne sans référence de pièce, sauf les écritures d’ouverture identifiées. »',
    commonConfusion: 'Une habitude orale ambiguë ne doit pas devenir un automatisme sans validation de son périmètre.',
    automationBoundary: 'Exécuter une règle stabilisée est automatisable ; choisir la règle, ses exceptions et sa version reste une décision du cabinet.',
    relatedTerms: ['controle-de-coherence', 'cas-de-refus', 'validation-humaine'],
    internalLinks: [{ label: 'écrire puis éprouver la règle du cabinet', href: '/#methode' }],
    owner: 'Méthode Memlia', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'cas-de-refus', term: 'Cas de refus', anchor: 'cas-de-refus', nature: 'Éditoriale Memlia',
    definition: 'Situation prévue dans laquelle le traitement s’arrête et demande une intervention au lieu de produire un résultat incertain.',
    context: 'Chaque automatisation doit préciser les entrées invalides, ambiguës, incomplètes ou hors périmètre.',
    exampleFictitious: 'Deux feuilles portent le même nom attendu mais des structures différentes ; le traitement n’en choisit aucune.',
    commonConfusion: 'Un arrêt explicite est une protection du dossier, pas un échec à masquer.',
    automationBoundary: 'Reconnaître une condition interdite et préparer le diagnostic est automatisable ; corriger ou élargir la règle reste humain.',
    relatedTerms: ['fail-closed', 'schema-de-donnees', 'tracabilite'],
    internalLinks: [{ label: 'les garanties qui empêchent une sortie incertaine', href: '/#garanties' }],
    owner: 'Méthode Memlia', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'controle-de-coherence', term: 'Contrôle de cohérence', anchor: 'controle-de-coherence', nature: 'Éditoriale Memlia',
    definition: 'Dans ce glossaire, Memlia appelle « contrôle de cohérence » une vérification qui compare des données entre elles ou à une règle du cabinet pour faire ressortir une anomalie possible.',
    context: 'Il prépare une revue en signalant ce qui mérite une explication ; il ne remplace pas la conclusion professionnelle.',
    exampleFictitious: 'Le total d’un tableau fictif diffère de la somme de ses lignes ; l’écart et les cellules concernées sont listés.',
    commonConfusion: 'Tout signal n’est pas une erreur certaine et aucune correction ne doit être faite sans pièce ni contexte.',
    automationBoundary: 'Recalculer, comparer et classer les écarts est automatisable ; expliquer l’écart et décider de la correction reste humain.',
    relatedTerms: ['regle-de-cabinet', 'piece-justificative', 'validation-humaine'],
    internalLinks: [{ label: 'voir les contrôles appliqués avant la DSN', href: '/blog/controler-les-bulletins-de-paie-avant-la-dsn' }],
    owner: 'Méthode de contrôle', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia', 'article-controle-dsn'],
  },
  {
    ...common, id: 'schema-de-donnees', term: 'Schéma de données', anchor: 'schema-de-donnees', nature: 'Éditoriale Memlia',
    definition: 'Dans le contrat technique Memlia, le « schéma de données » décrit la structure attendue d’un jeu de données : champs, types, formats, valeurs admises et relations utiles au traitement.',
    context: 'Il rend explicite ce qu’un export Excel ou CSV doit contenir avant qu’une règle soit exécutée.',
    exampleFictitious: 'La colonne « date_piece » exige une date valide, « montant » un nombre décimal et « reference » une chaîne non vide.',
    commonConfusion: 'Deux fichiers ne sont pas compatibles simplement parce que leurs colonnes se ressemblent visuellement.',
    automationBoundary: 'Valider types, champs et formats est automatisable ; décider du sens métier d’une colonne et faire évoluer le contrat reste humain.',
    relatedTerms: ['cas-de-refus', 'regle-de-cabinet', 'tracabilite'],
    internalLinks: [{ label: 'intégrer les fichiers déjà utilisés par le cabinet', href: '/#integration' }],
    owner: 'Contrat de données', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'tracabilite', term: 'Traçabilité', anchor: 'tracabilite', nature: 'Éditoriale Memlia',
    definition: 'Dans le contrat technique Memlia, la « traçabilité » permet de retrouver quelles entrées, quelle règle, quelle version et quel résultat ont conduit à une proposition ou à une décision.',
    context: 'Elle permet au reviewer de comprendre ce qui a été préparé sans exposer plus de données que nécessaire.',
    exampleFictitious: 'Un rapport fictif indique la version de règle, l’horodatage, les contrôles exécutés et les lignes refusées.',
    commonConfusion: 'La traçabilité n’est ni une surveillance nominative ni une conservation illimitée de chaque action.',
    automationBoundary: 'Journaliser les étapes techniques prévues est automatisable ; choisir les événements, accès et durées de conservation reste humain.',
    relatedTerms: ['minimisation-des-donnees', 'agregat-non-nominatif', 'validation-humaine'],
    internalLinks: [{ label: 'les garanties de traitement et de contrôle', href: '/#garanties' }],
    owner: 'Méthode Memlia', nextReviewAt: '2027-03-13', sourceIds: ['nist', 'methode-memlia'],
  },
  {
    ...common, id: 'validation-humaine', term: 'Validation humaine', anchor: 'validation-humaine', nature: 'Éditoriale Memlia',
    definition: 'Étape où une personne compétente accepte, corrige ou refuse la proposition préparée avant qu’elle produise un effet métier.',
    context: 'Le valideur, les éléments visibles et les actions possibles sont définis pour chaque mission.',
    exampleFictitious: 'Une correspondance bancaire proposée reste en attente jusqu’à ce qu’un collaborateur vérifie la pièce et confirme l’affectation.',
    commonConfusion: 'Un clic automatique, une absence de réponse ou un écran sans éléments de preuve n’est pas une validation.',
    automationBoundary: 'Préparer le dossier de décision et consigner le choix est automatisable ; porter le jugement et l’autoriser reste humain.',
    relatedTerms: ['regle-de-cabinet', 'cas-de-refus', 'tracabilite'],
    internalLinks: [{ label: 'la proposition avant la saisie ou la validation', href: '/#methode' }],
    owner: 'Doctrine human-in-the-loop', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
  {
    ...common, id: 'fail-closed', term: 'Fail-closed', anchor: 'fail-closed', nature: 'Éditoriale Memlia',
    definition: 'Dans le contrat technique Memlia, « fail-closed » désigne le comportement testé où une entrée inconnue, invalide ou ambiguë bloque le traitement au lieu d’autoriser une sortie par défaut.',
    context: 'La règle produit soit un résultat dans son périmètre, soit un refus explicite avec les éléments à examiner.',
    exampleFictitious: 'Une colonne obligatoire manque dans un export fictif ; aucun rapprochement n’est produit et le diagnostic nomme la colonne attendue.',
    commonConfusion: 'Remplacer un champ absent par zéro, deviner une feuille ou poursuivre silencieusement fabrique un résultat non fiable.',
    automationBoundary: 'Arrêter et diagnostiquer selon des conditions codées est automatisable ; corriger l’entrée ou changer la règle demande validation.',
    relatedTerms: ['cas-de-refus', 'schema-de-donnees', 'validation-humaine'],
    internalLinks: [{ label: 'les garanties qui ferment le traitement en cas de doute', href: '/#garanties' }],
    owner: 'Méthode Memlia', nextReviewAt: '2027-03-13', sourceIds: ['methode-memlia'],
  },
] satisfies GlossaryEntry[]).sort((a, b) => a.term.localeCompare(b.term, 'fr'));

export const GLOSSARY_BY_ID = new Map(GLOSSARY_ENTRIES.map((entry) => [entry.id, entry]));
