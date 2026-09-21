export const INTEGRATIONS_HUB_PATH = '/integrations' as const;

export type IntegrationStatus = 'forte' | 'moyenne' | 'refusee';
export type IntegrationVendor = 'Sage' | 'Cegid' | 'Silae' | 'Pennylane' | 'Quadra';
export type ServicePath =
  | '/automatisation-cabinet-comptable'
  | '/automatisation/paie'
  | '/automatisation/rapprochement-bancaire'
  | '/automatisation/saisie-comptable';

export interface IntegrationCandidate {
  task: string;
  vendor: IntegrationVendor;
  suggestions: number;
  status: IntegrationStatus;
}

/**
 * Grille mesurée le 20 septembre 2026 à l'autocomplétion française.
 * Règle de lancement : >= 6 ouvre la vague 1 ; 2 à 5 attend les signaux
 * d'indexation ; 0 ou 1 est refusé. Aucune URL n'est créée hors vague 1.
 */
export const INTEGRATION_CANDIDATES: readonly IntegrationCandidate[] = [
  { task: 'rapprochement bancaire', vendor: 'Sage', suggestions: 10, status: 'forte' },
  { task: 'rapprochement bancaire', vendor: 'Cegid', suggestions: 2, status: 'moyenne' },
  { task: 'rapprochement bancaire', vendor: 'Silae', suggestions: 0, status: 'refusee' },
  { task: 'rapprochement bancaire', vendor: 'Pennylane', suggestions: 1, status: 'refusee' },
  { task: 'rapprochement bancaire', vendor: 'Quadra', suggestions: 4, status: 'moyenne' },
  { task: 'lettrage', vendor: 'Sage', suggestions: 10, status: 'forte' },
  { task: 'lettrage', vendor: 'Cegid', suggestions: 6, status: 'forte' },
  { task: 'lettrage', vendor: 'Silae', suggestions: 0, status: 'refusee' },
  { task: 'lettrage', vendor: 'Pennylane', suggestions: 4, status: 'moyenne' },
  { task: 'lettrage', vendor: 'Quadra', suggestions: 5, status: 'moyenne' },
  { task: 'DSN', vendor: 'Sage', suggestions: 7, status: 'forte' },
  { task: 'DSN', vendor: 'Cegid', suggestions: 5, status: 'moyenne' },
  { task: 'DSN', vendor: 'Silae', suggestions: 10, status: 'forte' },
  { task: 'DSN', vendor: 'Pennylane', suggestions: 0, status: 'refusee' },
  { task: 'DSN', vendor: 'Quadra', suggestions: 2, status: 'moyenne' },
  { task: 'bulletin de paie', vendor: 'Sage', suggestions: 10, status: 'forte' },
  { task: 'bulletin de paie', vendor: 'Cegid', suggestions: 1, status: 'refusee' },
  { task: 'bulletin de paie', vendor: 'Silae', suggestions: 10, status: 'forte' },
  { task: 'bulletin de paie', vendor: 'Pennylane', suggestions: 1, status: 'refusee' },
  { task: 'bulletin de paie', vendor: 'Quadra', suggestions: 0, status: 'refusee' },
  { task: 'saisie comptable', vendor: 'Sage', suggestions: 6, status: 'forte' },
  { task: 'saisie comptable', vendor: 'Cegid', suggestions: 1, status: 'refusee' },
  { task: 'saisie comptable', vendor: 'Silae', suggestions: 1, status: 'refusee' },
  { task: 'saisie comptable', vendor: 'Pennylane', suggestions: 1, status: 'refusee' },
  { task: 'saisie comptable', vendor: 'Quadra', suggestions: 1, status: 'refusee' },
  { task: 'relance client', vendor: 'Sage', suggestions: 2, status: 'moyenne' },
  { task: 'relance client', vendor: 'Cegid', suggestions: 0, status: 'refusee' },
  { task: 'relance client', vendor: 'Silae', suggestions: 0, status: 'refusee' },
  { task: 'relance client', vendor: 'Pennylane', suggestions: 1, status: 'refusee' },
  { task: 'relance client', vendor: 'Quadra', suggestions: 0, status: 'refusee' },
  { task: 'clôture', vendor: 'Sage', suggestions: 10, status: 'forte' },
  { task: 'clôture', vendor: 'Cegid', suggestions: 3, status: 'moyenne' },
  { task: 'clôture', vendor: 'Silae', suggestions: 0, status: 'refusee' },
  { task: 'clôture', vendor: 'Pennylane', suggestions: 2, status: 'moyenne' },
  { task: 'clôture', vendor: 'Quadra', suggestions: 3, status: 'moyenne' },
] as const;

export interface IntegrationSource {
  title: string;
  url: string;
  checkedAt: string;
  fact: string;
}

export interface IntegrationReplayCase {
  input: string;
  rule: string;
  outcome: 'Préparé' | 'À valider' | 'Arrêt';
  detail: string;
}

export interface IntegrationDefinition {
  slug: string;
  task: string;
  vendor: 'Sage' | 'Cegid' | 'Silae';
  product: string;
  primaryQuery: string;
  suggestions: number;
  modifiers: readonly string[];
  h1: string;
  tabTitle: string;
  description: string;
  intro: string;
  datePublication: string;
  dateMiseAJour: string;
  auteur: 'kevin';
  service: { href: ServicePath; label: string };
  officialPath: string;
  fields: readonly string[];
  knownTrap: string;
  writtenRule: string;
  boundary: { prepared: string; validation: string; human: string };
  replay: readonly IntegrationReplayCase[];
  source: IntegrationSource;
  tool?: { href: string; label: string };
}

export const INTEGRATIONS: readonly IntegrationDefinition[] = [
  {
    slug: 'rapprochement-bancaire-sage',
    task: 'rapprochement bancaire',
    vendor: 'Sage',
    product: 'Sage 100 Comptabilité',
    primaryQuery: 'rapprochement bancaire sage',
    suggestions: 10,
    modifiers: ['Sage 100', 'rapprochement bancaire manuel'],
    h1: 'Rapprochement bancaire Sage : écrire la règle avant le pointage',
    tabTitle: 'Rapprochement bancaire Sage | Memlia',
    description: 'Cadrez un rapprochement bancaire Sage 100 sur les écritures réellement visibles, avec proposition, contrôle des écarts et validation humaine.',
    intro: 'Dans Sage 100 Comptabilité, le rapprochement dépend du journal de banque, de l’exercice affiché et des écritures encore ouvertes. Nous partons de ces repères réels : une ligne certaine peut être proposée, une ligne ambiguë reste ouverte, et aucune écriture n’est rapprochée par simple ressemblance.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/rapprochement-bancaire', label: 'Voir le moyeu rapprochement bancaire' },
    officialPath: 'Rapprochement bancaire manuel → sélectionner le journal de banque → valider par Entrée',
    fields: ['journal de banque', 'date d’écriture', 'libellé', 'montant', 'statut rapproché'],
    knownTrap: 'La base de connaissances Sage indique que le rapprochement se gère sur deux exercices, N et N-1, selon l’exercice sélectionné. Une écriture N-2 ne doit donc pas être absorbée comme un cas courant.',
    writtenRule: 'Proposer seulement une paire qui concorde sur le montant, le sens et la période définie par le cabinet. Plusieurs candidats, un exercice hors fenêtre ou un solde incohérent déclenchent un arrêt.',
    boundary: {
      prepared: 'Comparer les écritures couvertes et préparer les appariements qui n’ont qu’un candidat.',
      validation: 'Présenter la source, l’écart et la proposition sans modifier le statut dans Sage.',
      human: 'Valider le rapprochement dans Sage et décider des écritures anciennes ou ambiguës.',
    },
    replay: [
      { input: 'Une écriture banque et une écriture comptable de 480,00 €, même sens, même période', rule: 'Un seul candidat dans la fenêtre', outcome: 'Préparé', detail: 'La paire est proposée avec ses deux références.' },
      { input: 'Deux écritures comptables de 480,00 €', rule: 'Plus d’un candidat', outcome: 'À valider', detail: 'Les deux choix restent visibles ; aucun pointage n’est déduit.' },
      { input: 'Écriture issue de N-2', rule: 'Exercice hors fenêtre N / N-1', outcome: 'Arrêt', detail: 'Le cas sort de la règle et demande un traitement explicite.' },
    ],
    source: {
      title: 'Sage KB — Mettre en place le rapprochement bancaire',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150061508&view=print',
      checkedAt: '20 septembre 2026',
      fact: 'La fiche décrit la reprise des écritures non rapprochées et le rapprochement bancaire dans Sage 100 Comptabilité.',
    },
    tool: { href: '/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit', label: 'Rejouer la règle avec le modèle gratuit' },
  },
  {
    slug: 'lettrage-sage',
    task: 'lettrage',
    vendor: 'Sage',
    product: 'Sage 100 Comptabilité',
    primaryQuery: 'lettrage sage',
    suggestions: 10,
    modifiers: ['Sage 100', 'lettrage manuel', 'gestion des comptes tiers'],
    h1: 'Lettrage Sage : proposer les paires sans masquer l’écart',
    tabTitle: 'Lettrage Sage | Memlia',
    description: 'Cadrez le lettrage Sage 100 depuis les journaux ou les comptes tiers, avec règle d’équilibre, proposition traçable et arrêt sur écart.',
    intro: 'Sage 100 permet d’ouvrir le lettrage depuis les journaux de saisie ou la gestion des comptes tiers. Le même tiers peut donc être vu dans deux parcours. La règle écrite porte sur les écritures, leur compte et leur équilibre ; elle ne dépend pas de la fenêtre depuis laquelle le collaborateur a commencé.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/saisie-comptable', label: 'Voir le moyeu saisie comptable' },
    officialPath: 'Traitement → Journaux de saisie ou Traitement → Gestion des comptes tiers → Actions → Lettrer le compte',
    fields: ['compte tiers', 'référence de pièce', 'date', 'débit', 'crédit', 'code de lettrage'],
    knownTrap: 'Un écart entre facture et règlement ne forme pas une paire équilibrée. La documentation Sage prévoit des écritures d’écart ; les créer automatiquement sans règle de seuil et de compte serait une décision comptable.',
    writtenRule: 'Regrouper sur un même compte tiers, exiger l’équilibre exact ou un écart couvert par une règle signée, puis proposer le groupe. Toute référence réutilisée ou différence hors règle bloque.',
    boundary: {
      prepared: 'Former les groupes équilibrés sur un même tiers et exposer leur somme.',
      validation: 'Présenter le groupe, les références et l’éventuel écart couvert avant le geste dans Sage.',
      human: 'Valider le code de lettrage et décider d’une écriture d’écart.',
    },
    replay: [
      { input: 'Facture 1 200 € et règlement 1 200 € sur le même tiers', rule: 'Débit = crédit', outcome: 'Préparé', detail: 'La paire est proposée avec son compte tiers.' },
      { input: 'Facture 1 200 € et deux règlements totalisant 1 200 €', rule: 'Groupe équilibré, plusieurs lignes', outcome: 'À valider', detail: 'Le groupe est présenté ; la validation reste au collaborateur.' },
      { input: 'Écart de 8 € sans règle écrite', rule: 'Équilibre absent', outcome: 'Arrêt', detail: 'Aucune écriture d’écart n’est créée.' },
    ],
    source: {
      title: 'Sage KB — Lettrer : le code lettrage est différent sur les tiers',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010160118208',
      checkedAt: '20 septembre 2026',
      fact: 'La fiche Sage nomme les deux parcours de lettrage depuis les journaux de saisie et la gestion des comptes tiers.',
    },
  },
  {
    slug: 'dsn-sage',
    task: 'DSN',
    vendor: 'Sage',
    product: 'Sage 100 Paie & RH',
    primaryQuery: 'dsn sage',
    suggestions: 7,
    modifiers: ['Sage 100 Paie', 'paramétrage DSN', 'blocs DSN'],
    h1: 'DSN Sage : préparer les contrôles, laisser la déclaration au gestionnaire',
    tabTitle: 'DSN Sage | Memlia',
    description: 'Cadrez les contrôles d’une DSN Sage à partir des organismes, blocs et retours visibles, sans transmettre ni corriger à la place du gestionnaire.',
    intro: 'Une DSN Sage dépend du paramétrage des organismes, de leur périodicité et des données de paie qui alimentent les blocs. Nous ne présentons donc pas la transmission comme une formalité automatique : la préparation peut relever les incohérences, mais le gestionnaire reste responsable de la correction et de l’envoi.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'DSN → paramétrage des organismes, périodicité et mode de paiement → contrôle des blocs avant transmission',
    fields: ['organisme', 'périodicité', 'mode de paiement', 'bloc S21.G00.20', 'bloc S21.G00.41', 'retour métier'],
    knownTrap: 'Sage demande notamment de sélectionner les organismes ARRCO et AGIRC pour la remontée des cotisations retraite. Une absence de paramétrage peut produire une déclaration incomplète sans qu’une comparaison de montants suffise à l’expliquer.',
    writtenRule: 'Comparer les organismes attendus, les paramètres déclaratifs et les blocs présents. Un organisme absent, une profondeur de recalcul incohérente ou un retour métier non résolu arrête la préparation.',
    boundary: {
      prepared: 'Recenser les blocs et paramètres attendus, puis signaler les absences et divergences.',
      validation: 'Présenter chaque anomalie avec son organisme ou son bloc source.',
      human: 'Corriger le paramétrage, interpréter le retour métier et transmettre la DSN.',
    },
    replay: [
      { input: 'Organismes attendus présents, périodicité et paiement renseignés', rule: 'Contrôles de présence satisfaits', outcome: 'Préparé', detail: 'La liste de contrôle est prête pour lecture.' },
      { input: 'Changement de contrat présent en S21.G00.41', rule: 'Bloc sensible identifié', outcome: 'À valider', detail: 'La profondeur de recalcul est affichée sans être modifiée.' },
      { input: 'Organisme retraite attendu absent', rule: 'Paramétrage incomplet', outcome: 'Arrêt', detail: 'La préparation refuse de conclure à une DSN complète.' },
    ],
    source: {
      title: 'Sage KB — Tout savoir sur le paramétrage de la DSN',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=211010160115920',
      checkedAt: '20 septembre 2026',
      fact: 'La fiche Sage documente les organismes retraite, leur périodicité et leur mode de paiement pour la remontée DSN.',
    },
  },
  {
    slug: 'bulletin-de-paie-sage',
    task: 'bulletin de paie',
    vendor: 'Sage',
    product: 'Sage 100 Paie & RH',
    primaryQuery: 'bulletin de paie sage',
    suggestions: 10,
    modifiers: ['Sage Paie', 'bulletin détaillé', 'verrouillage de période'],
    h1: 'Bulletin de paie Sage : contrôler les changements avant verrouillage',
    tabTitle: 'Bulletin de paie Sage | Memlia',
    description: 'Préparez le contrôle d’un bulletin Sage après modification des données salarié, absences ou rubriques, avant validation et verrouillage humain.',
    intro: 'Dans Sage, une modification des données salarié, du bulletin ou des absences peut recalculer le bulletin. La règle utile n’est donc pas “le PDF existe” : elle compare ce qui a changé, le résultat recalculé et les contrôles du cabinet avant tout verrouillage de la période.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'Salariés / Bulletins / Absences → recalcul du bulletin → édition détaillée → verrouillage de la période',
    fields: ['salarié', 'période', 'rubrique', 'base', 'taux', 'montant', 'absence', 'net à payer'],
    knownTrap: 'La base Sage indique qu’un bulletin est recalculé après modification d’une donnée et qu’une période peut être verrouillée après édition. Un contrôle exécuté sur une version antérieure du bulletin n’est plus une preuve.',
    writtenRule: 'Attacher chaque contrôle à la période et à la version recalculée. Une donnée modifiée après contrôle invalide la trace et impose un nouveau passage avant verrouillage.',
    boundary: {
      prepared: 'Comparer les rubriques et montants au référentiel fictif du cabinet.',
      validation: 'Montrer les changements depuis le dernier calcul et les contrôles à relire.',
      human: 'Corriger le bulletin, valider son contenu puis verrouiller la période.',
    },
    replay: [
      { input: 'Bulletin recalculé sans changement hors tolérance écrite', rule: 'Version courante contrôlée', outcome: 'Préparé', detail: 'La trace indique période, salarié fictif et version.' },
      { input: 'Une absence modifie une rubrique attendue', rule: 'Changement explicable mais sensible', outcome: 'À valider', detail: 'Avant/après présenté au gestionnaire.' },
      { input: 'Bulletin modifié après le contrôle', rule: 'Trace devenue obsolète', outcome: 'Arrêt', detail: 'Le verrouillage n’est pas proposé.' },
    ],
    source: {
      title: 'Sage KB — Questions fréquentes autour des bulletins',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010160115059',
      checkedAt: '20 septembre 2026',
      fact: 'La fiche Sage documente le recalcul après modification et la possibilité de verrouiller la période après édition.',
    },
  },
  {
    slug: 'saisie-comptable-sage',
    task: 'saisie comptable',
    vendor: 'Sage',
    product: 'Sage 100 Comptabilité',
    primaryQuery: 'saisie comptable sage',
    suggestions: 6,
    modifiers: ['Sage 100', 'saisie par lot', 'modèle de saisie'],
    h1: 'Saisie comptable Sage : préparer un lot sans perdre le contexte',
    tabTitle: 'Saisie comptable Sage | Memlia',
    description: 'Cadrez une préparation de saisie Sage 100 par lot avec champs obligatoires, contrôle d’équilibre et validation avant intégration.',
    intro: 'La saisie par lot isole le travail en cours : la documentation Sage précise que l’utilisateur n’y voit pas les écritures déjà enregistrées, les soldes ni le lettrage. Une automatisation ne doit donc pas traiter ce fichier comme une vue complète du dossier. Elle prépare le lot, contrôle son équilibre et rend visibles les limites de contexte.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/saisie-comptable', label: 'Voir le moyeu saisie comptable' },
    officialPath: 'Sélectionner l’exercice dans Fenêtre → Traitement → Saisie par lot',
    fields: ['exercice', 'journal', 'date', 'compte général', 'compte tiers', 'référence', 'débit', 'crédit'],
    knownTrap: 'Dans la saisie par lot, les écritures déjà enregistrées et les soldes ne sont pas visibles. Une règle qui prétend contrôler le doublon ou le solde à partir du seul lot serait incomplète.',
    writtenRule: 'Préparer uniquement les champs du lot, exiger son équilibre et marquer comme non vérifiés les contrôles qui demandent le dossier Sage complet. L’intégration reste un geste distinct.',
    boundary: {
      prepared: 'Construire le lot fictif, vérifier les champs obligatoires et l’équilibre débit/crédit.',
      validation: 'Présenter les lignes et la liste des contrôles impossibles sans le dossier complet.',
      human: 'Contrôler le contexte dans Sage puis intégrer ou corriger le lot.',
    },
    replay: [
      { input: 'Lot équilibré, journal et comptes connus', rule: 'Champs présents et débit = crédit', outcome: 'Préparé', detail: 'Le lot reste séparé de l’intégration.' },
      { input: 'Référence déjà rencontrée dans le lot fictif', rule: 'Doublon interne possible', outcome: 'À valider', detail: 'Les deux lignes sont rapprochées visuellement.' },
      { input: 'Contrôle du solde demandé depuis le seul lot', rule: 'Contexte Sage absent', outcome: 'Arrêt', detail: 'Le résultat n’est pas présenté comme un contrôle de dossier.' },
    ],
    source: {
      title: 'Sage KB — Connaître la saisie par lot',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150075937',
      checkedAt: '20 septembre 2026',
      fact: 'La fiche Sage décrit l’accès à la saisie par lot et les informations du dossier qui n’y sont pas visibles.',
    },
  },
  {
    slug: 'cloture-sage',
    task: 'clôture',
    vendor: 'Sage',
    product: 'Sage 100 Comptabilité',
    primaryQuery: 'clôture sage',
    suggestions: 10,
    modifiers: ['clôture Sage 100', 'à-nouveaux', 'traitements de fin d’année'],
    h1: 'Clôture Sage : préparer les contrôles, jamais le clic final',
    tabTitle: 'Clôture Sage 100 | Memlia',
    description: 'Structurez les contrôles de clôture Sage 100, les journaux et les à-nouveaux, tout en laissant la décision irréversible au cabinet.',
    intro: 'La clôture Sage 100 enchaîne des contrôles dont les effets ne se confondent pas : journaux, écritures de situation, caisse, génération des à-nouveaux. La règle écrite prépare la liste et ses preuves ; elle ne transforme pas un feu vert technique en décision de clôturer.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation-cabinet-comptable', label: 'Voir le service d’automatisation du cabinet' },
    officialPath: 'Traitements de fin d’année → contrôles des journaux → clôture de l’exercice → génération des à-nouveaux',
    fields: ['exercice', 'journal', 'statut de clôture', 'écritures de situation', 'solde de caisse', 'à-nouveaux'],
    knownTrap: 'La documentation Sage signale notamment le journal de caisse créditeur et le traitement des écritures de situation. Ces cas exigent une décision comptable ; les masquer pour obtenir un statut vert serait un défaut.',
    writtenRule: 'Préparer une checklist liée à l’exercice, conserver chaque alerte et interdire le passage au geste final tant qu’un contrôle n’est pas explicitement décidé.',
    boundary: {
      prepared: 'Recenser les journaux, états et alertes de l’exercice dans une checklist horodatée.',
      validation: 'Présenter les points ouverts et la source de chaque statut.',
      human: 'Décider des écritures de situation, traiter les alertes et déclencher la clôture.',
    },
    replay: [
      { input: 'Tous les journaux fictifs contrôlés, aucune alerte', rule: 'Checklist complète', outcome: 'Préparé', detail: 'Le dossier de contrôle est prêt, sans action de clôture.' },
      { input: 'Écriture de situation encore présente', rule: 'Traitement à décider', outcome: 'À valider', detail: 'Le choix transfert/suppression reste au cabinet.' },
      { input: 'Journal de caisse créditeur', rule: 'Alerte bloquante', outcome: 'Arrêt', detail: 'Aucun feu vert de clôture n’est affiché.' },
    ],
    source: {
      title: 'Sage KB — Étapes pour paramétrer la clôture d’un exercice',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=211010150018497',
      checkedAt: '20 septembre 2026',
      fact: 'La fiche Sage rassemble les étapes et questions fréquentes d’une clôture dans Sage 100 Comptabilité.',
    },
  },
  {
    slug: 'lettrage-cegid',
    task: 'lettrage',
    vendor: 'Cegid',
    product: 'Cegid Loop',
    primaryQuery: 'lettrage cegid',
    suggestions: 6,
    modifiers: ['code lettrage', 'compte lettrable', 'Cegid Loop'],
    h1: 'Lettrage Cegid : équilibrer le paquet sur le bon compte',
    tabTitle: 'Lettrage Cegid | Memlia',
    description: 'Cadrez un lettrage Cegid avec compte lettrable, code de lettrage, équilibre du paquet et validation humaine des écarts.',
    intro: 'La documentation publique Cegid Loop expose des champs précis : code de lettrage, journal, référence de pièce, date et numéro de compte. Elle précise aussi qu’un paquet importé doit être équilibré sur le même compte lettrable. Ces invariants forment une meilleure règle que la seule égalité de montants.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/saisie-comptable', label: 'Voir le moyeu saisie comptable' },
    officialPath: 'Écritures comptables → filtre compte / référence / date → codeLettrage ; import seulement sur paquet équilibré',
    fields: ['codeLettrage', 'journalCode', 'refPiece', 'datePiece', 'compteNumero', 'débit', 'crédit'],
    knownTrap: 'Pour un import correctement lettré, Cegid exige un compte lettrable, un même compte pour le code de lettrage et un paquet équilibré. Une égalité entre lignes de comptes différents ne suffit pas.',
    writtenRule: 'Former le groupe sur un même compte lettrable, vérifier débit = crédit et garder la référence de chaque écriture. Une rupture de compte ou d’équilibre bloque la proposition.',
    boundary: {
      prepared: 'Regrouper les écritures compatibles et calculer l’équilibre du paquet.',
      validation: 'Afficher le compte, les références et le code proposé.',
      human: 'Valider le lettrage dans Cegid et décider d’un écart ou d’une rupture de compte.',
    },
    replay: [
      { input: 'Deux écritures sur le compte 411000, paquet équilibré', rule: 'Même compte lettrable et débit = crédit', outcome: 'Préparé', detail: 'Le groupe reçoit un code proposé.' },
      { input: 'Trois écritures équilibrées avec une référence dupliquée', rule: 'Référence ambiguë', outcome: 'À valider', detail: 'Le paquet est visible sans être confirmé.' },
      { input: 'Écritures équilibrées sur 411000 et 401000', rule: 'Rupture du compte lettrable', outcome: 'Arrêt', detail: 'Aucun code commun n’est proposé.' },
    ],
    source: {
      title: 'Cegid Developers — Import des écritures comptables au format JSON',
      url: 'https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html',
      checkedAt: '20 septembre 2026',
      fact: 'La référence Cegid documente les conditions de compte lettrable, de code et d’équilibre pour le lettrage importé.',
    },
  },
  {
    slug: 'dsn-silae',
    task: 'DSN',
    vendor: 'Silae',
    product: 'mySilae',
    primaryQuery: 'dsn silae',
    suggestions: 10,
    modifiers: ['télédéclarations', 'CRM DSN', 'Net-entreprises'],
    h1: 'DSN Silae : traiter les contrôles avant la transmission',
    tabTitle: 'DSN Silae | Memlia',
    description: 'Cadrez les contrôles d’une DSN Silae depuis la période, les blocs et les comptes rendus métier, sans transmettre à la place du gestionnaire.',
    intro: 'Silae indique que les DSN se génèrent depuis les bulletins calculés, puis se gèrent dans les télédéclarations avant transmission vers Net-entreprises. Le retour ne s’arrête pas au dépôt : les comptes rendus métier peuvent demander une correction. La règle écrite couvre donc le cycle jusqu’au retour, pas seulement la génération du fichier.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'Télédéclarations → sélectionner la période → contrôler → transmettre vers Net-entreprises → lire les CRM',
    fields: ['période', 'salarié', 'organisme', 'bloc DSN', 'statut de contrôle', 'CRM', 'taux PAS', 'taux AT/MP'],
    knownTrap: 'Un dépôt n’est pas une validation. La documentation Silae distingue les CRM de validation et d’anomalies ; un retour non lu ne doit pas devenir un état “terminé”.',
    writtenRule: 'Relier la période aux bulletins calculés, vérifier les anomalies avant transmission et garder le dossier ouvert jusqu’au CRM attendu. Toute anomalie non décidée bloque le statut final.',
    boundary: {
      prepared: 'Recenser les contrôles, les blocs signalés et les retours reçus pour la période.',
      validation: 'Présenter les anomalies et leurs sources sans altérer la déclaration.',
      human: 'Corriger, transmettre et décider du traitement de chaque CRM.',
    },
    replay: [
      { input: 'Période fictive complète, contrôles sans anomalie', rule: 'Préparation cohérente', outcome: 'Préparé', detail: 'La synthèse est prête avant transmission.' },
      { input: 'CRM reçu avec une anomalie identifiée', rule: 'Retour à interpréter', outcome: 'À valider', detail: 'L’anomalie reste ouverte avec son libellé.' },
      { input: 'Aucun CRM après un dépôt fictif', rule: 'Cycle incomplet', outcome: 'Arrêt', detail: 'Le statut final n’est pas accordé.' },
    ],
    source: {
      title: 'Silae — Logiciel de paie compatible DSN',
      url: 'https://www.silae.fr/solution-rh-paie/logiciel-paie/dsn/',
      checkedAt: '20 septembre 2026',
      fact: 'Silae décrit la génération depuis les bulletins, le parcours des télédéclarations et les CRM de validation ou d’anomalies.',
    },
  },
  {
    slug: 'bulletin-de-paie-silae',
    task: 'bulletin de paie',
    vendor: 'Silae',
    product: 'mySilae',
    primaryQuery: 'bulletin de paie silae',
    suggestions: 10,
    modifiers: ['éléments variables', 'validation de la paie', 'distribution des bulletins'],
    h1: 'Bulletin de paie Silae : contrôler les variables avant distribution',
    tabTitle: 'Bulletin de paie Silae | Memlia',
    description: 'Cadrez le contrôle d’un bulletin Silae depuis les éléments fixes, variables et cotisations, avant validation et distribution humaine.',
    intro: 'Silae structure le cycle depuis la collecte des variables jusqu’au contrôle, à la validation et à la distribution des bulletins. Les primes, heures, absences et frais n’ont pas le même effet. La règle écrite garde donc leur type, leur origine et leur validation, au lieu de comparer seulement le net à payer.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-09-20',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'Collecte des éléments variables → production du bulletin → contrôle et validation du cycle → distribution dématérialisée',
    fields: ['salarié', 'salaire de base', 'prime', 'heure supplémentaire', 'absence', 'cotisation', 'net à payer', 'statut de validation'],
    knownTrap: 'La documentation Silae distingue les éléments fixes, les variables et les cotisations. Un net identique peut masquer une mauvaise rubrique ou deux erreurs qui se compensent.',
    writtenRule: 'Comparer chaque variable à sa source validée, contrôler les rubriques sensibles et rendre caduque la trace si une donnée change avant distribution.',
    boundary: {
      prepared: 'Comparer les variables et rubriques du bulletin fictif à la collecte validée.',
      validation: 'Afficher les écarts rubrique par rubrique et la dernière version contrôlée.',
      human: 'Corriger, valider le cycle et déclencher la distribution du bulletin.',
    },
    replay: [
      { input: 'Prime et absence fictives présentes dans la collecte validée', rule: 'Origine et montant concordent', outcome: 'Préparé', detail: 'La trace relie chaque variable à sa source.' },
      { input: 'Heures supplémentaires modifiées après le premier calcul', rule: 'Nouvelle version du bulletin', outcome: 'À valider', detail: 'Avant/après visible, ancien contrôle invalidé.' },
      { input: 'Net inchangé mais rubrique de cotisation différente', rule: 'Contrôle par rubrique', outcome: 'Arrêt', detail: 'La compensation au net ne masque pas l’écart.' },
    ],
    source: {
      title: 'Silae — Logiciel de gestion de la paie',
      url: 'https://www.silae.fr/solution-rh-paie/logiciel-paie/',
      checkedAt: '20 septembre 2026',
      fact: 'Silae décrit la collecte des variables, la production, le contrôle, la validation et la distribution des bulletins.',
    },
  },
] as const;

export const INTEGRATIONS_INDEXABLES = INTEGRATIONS;

export function integrationPath(integration: Pick<IntegrationDefinition, 'slug'>): string {
  return `${INTEGRATIONS_HUB_PATH}/${integration.slug}`;
}

export function integrationsForService(path: string): readonly IntegrationDefinition[] {
  return INTEGRATIONS.filter((integration) => integration.service.href === path);
}

export function getIntegration(slug: string): IntegrationDefinition {
  const integration = INTEGRATIONS.find((entry) => entry.slug === slug);
  if (!integration) throw new Error(`Intégration inconnue : ${slug}`);
  return integration;
}
