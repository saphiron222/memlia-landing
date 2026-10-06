import generatedGuides from './guides.generated.json' with { type: 'json' };

export const INTEGRATIONS_HUB_PATH = '/integrations' as const;

export type IntegrationStatus = 'forte' | 'moyenne' | 'refusee';
export type IntegrationVendor = string;
export type ServicePath = `/automatisation/${string}`
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
  vendor: IntegrationVendor;
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
  documentScope: string;
  fields: readonly { label: string; control: string }[];
  knownTrap: string;
  writtenRule: string;
  boundary: { prepared: string; validation: string; human: string };
  replay: readonly IntegrationReplayCase[];
  source: IntegrationSource;
  tool?: { href: string; label: string };
}

export const INTEGRATIONS_HISTORIQUES: readonly IntegrationDefinition[] = [
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
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/rapprochement-bancaire', label: 'Voir le moyeu rapprochement bancaire' },
    officialPath: 'Repère documentaire : zones du rapprochement bancaire manuel, selon l’exercice sélectionné et le journal de trésorerie.',
    documentScope: 'Sage 100 Comptabilité : la fiche du 11 février 2024 décrit les zones du rapprochement manuel, sans version chiffrée. Le périmètre dépend de l’exercice sélectionné ; les critères de paire ci-dessous sont une règle de cadrage du cabinet, pas une fonction d’appariement attestée par cette fiche.',
    fields: [
      { label: 'journal de banque', control: 'Délimite les mouvements du compte de trésorerie ; vérifier le journal lié au compte avant de comparer les soldes.' },
      { label: 'date d’écriture', control: 'Situe le mouvement dans la période couverte ; une date hors fenêtre de la règle illustrative reste à traiter séparément.' },
      { label: 'libellé', control: 'Aide à relire l’origine du mouvement ; une ressemblance de texte ne suffit pas à établir une paire certaine.' },
      { label: 'montant', control: 'Porte la valeur et le sens du mouvement ; vérifier débit et crédit, sans confondre égalité de montant et identité de pièce.' },
      { label: 'statut rapproché', control: 'Sépare les lignes encore ouvertes des lignes déjà traitées ; une proposition ne doit jamais modifier ce statut dans Sage.' },
    ],
    knownTrap: 'La fiche distingue l’exercice unique ou le plus ancien des autres exercices. Dans le second cas, les cumuls incluent N et N-1 ; ce n’est pas une limite universelle à tout traitement bancaire. Le cas N-2 ci-dessous sort seulement de la fenêtre choisie pour notre illustration.',
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
      title: 'Sage KB — Description des zones du rapprochement bancaire manuel',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=211010150055768',
      checkedAt: '2026-10-04',
      fact: 'Fiche modifiée le 11 février 2024 : elle distingue les cumuls selon l’exercice sélectionné et décrit les soldes. Elle ne documente pas un appariement automatique des mouvements.',
    },
    tool: { href: '/outils-comptables-gratuits/modele-rapprochement-bancaire-excel-gratuit', label: 'Contrôler des soldes fictifs et exporter le CSV' },
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
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/saisie-comptable', label: 'Voir le moyeu saisie comptable' },
    officialPath: 'Traitement → Journaux de saisie ou Traitement → Gestion des comptes tiers → Actions → Lettrer le compte',
    documentScope: 'Sage 100 Comptabilité : fiche modifiée le 5 septembre 2023, sans version chiffrée. Elle établit les deux accès au lettrage et la différence d’incrémentation des codes. Les conditions d’équilibre et d’arrêt ci-dessous relèvent de la règle illustrative du cabinet.',
    fields: [
      { label: 'compte tiers', control: 'Rattache le groupe au même tiers et à son collectif ; des écritures de tiers différents ne forment pas une paire.' },
      { label: 'référence de pièce', control: 'Relie facture et règlement à leurs justificatifs ; une référence réutilisée demande une lecture humaine.' },
      { label: 'date', control: 'Délimite les écritures de la période retenue ; vérifier la période avant de proposer le groupe.' },
      { label: 'débit', control: 'Mesure un côté du groupe ; additionner les débits dans une même devise avant le contrôle d’équilibre.' },
      { label: 'crédit', control: 'Mesure l’autre côté du groupe ; comparer sa somme aux débits, sans créer une écriture pour masquer un écart.' },
      { label: 'code de lettrage', control: 'Identifie le groupe dans Sage ; sa séquence dépend du parcours et ne constitue pas une preuve d’équilibre.' },
    ],
    knownTrap: 'La fiche Sage explique que le code s’incrémente par tiers en gestion des tiers, mais à partir du dernier code du même collectif en journal. Une discontinuité de codes ne prouve donc pas une erreur. Dans notre illustration, un écart non couvert reste humain.',
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
      checkedAt: '2026-10-04',
      fact: 'Fiche modifiée le 5 septembre 2023 : accès par les journaux ou la gestion des tiers, avec une incrémentation différente des codes. Elle n’établit pas notre règle de tolérance d’écart.',
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
    description: 'Cadrez les contrôles d’une DSN Sage 100 Paie & RH : reprise des contrats sociaux, référence et plage de transfert, avec validation humaine.',
    intro: 'Dans Sage 100 Paie & RH, un contrat social modifié doit être repris dans Sage DS sur la plage de dates concernée. La préparation rapproche le contrat attendu et les données transférées ; le gestionnaire garde la correction, la lecture des retours et l’envoi de la DSN.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'Listes / contrats sociaux : vérifier « A déclarer DSN » ; après modification, transfert DSN sur une plage au moins équivalente à celle du contrat social.',
    documentScope: 'Sage Paie et Sage 100 Paie & RH : fiche contrats sociaux modifiée le 12 juin 2024, sans version chiffrée. Elle décrit la reprise dans Sage DS, pas l’ensemble des contrôles DSN. La grille ci-dessous cible ce transfert ; les exigences déclaratives applicables restent à vérifier pour la période du cabinet.',
    fields: [
      { label: 'contrat social', control: 'Identifie la référence à reprendre dans Sage DS ; comparer la référence attendue à celle transférée.' },
      { label: 'A déclarer DSN', control: 'Indique si le contrat est destiné à la déclaration ; un contrat attendu non sélectionné reste une anomalie à décider.' },
      { label: 'plage de transfert', control: 'Couvre les dates du contrat modifié ; une plage trop courte ne permet pas de conclure à une reprise complète.' },
      { label: 'code option', control: 'Vient de la fiche de personnel ou, si vide, du contrat société selon la fiche Sage ; relire l’origine retenue.' },
      { label: 'code population', control: 'Suit le repli décrit par Sage vers le contrat société ; une valeur vide doit être examinée dans son contexte.' },
      { label: 'retour métier', control: 'Porte les anomalies après déclaration ; notre grille conserve un retour non résolu ouvert pour le gestionnaire.' },
    ],
    knownTrap: 'La fiche Sage indique qu’une référence de contrat modifiée ne remonte pas sans transfert sur une plage au moins équivalente à celle du contrat. Un montant cohérent ne suffit donc pas à établir que le contrat courant a été repris.',
    writtenRule: 'Comparer la référence du contrat, son option déclarative et les dates transférées. Une référence non reprise, une plage insuffisante ou un retour métier non résolu arrête la préparation illustrative.',
    boundary: {
      prepared: 'Recenser les contrats et dates attendus, puis signaler les absences et divergences de reprise.',
      validation: 'Présenter chaque anomalie avec son contrat ou son retour source.',
      human: 'Corriger le paramétrage, interpréter le retour métier et transmettre la DSN.',
    },
    replay: [
      { input: 'Contrat fictif sélectionné, référence et dates reprises', rule: 'Périmètre du transfert cohérent', outcome: 'Préparé', detail: 'La liste ciblée est prête pour lecture, sans conclure à la conformité de toute la DSN.' },
      { input: 'Code option salarié vide, valeur issue du contrat société', rule: 'Origine de la valeur à relire', outcome: 'À valider', detail: 'Le repli est présenté au gestionnaire.' },
      { input: 'Référence modifiée, plage de transfert plus courte que le contrat', rule: 'Reprise non démontrée', outcome: 'Arrêt', detail: 'Le contrat reste ouvert au contrôle.' },
    ],
    source: {
      title: 'Sage KB — Reprendre les contrats sociaux dans la DSN',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=211010160115038',
      checkedAt: '2026-10-04',
      fact: 'Fiche modifiée le 12 juin 2024 pour Sage Paie et Sage 100 Paie & RH : option A déclarer DSN, plage de transfert du contrat et origine des codes option/population.',
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
    h1: 'Bulletin de paie Sage : contrôler les changements avant validation',
    tabTitle: 'Bulletin de paie Sage | Memlia',
    description: 'Préparez le contrôle d’un bulletin Sage 100 Paie & RH : salarié, période, variables et rubriques, avec repère de version et validation humaine.',
    intro: 'Pour contrôler un bulletin Sage 100 Paie & RH, le cabinet identifie d’abord la version du logiciel et le bulletin concerné. La règle proposée compare les variables, les rubriques et le résultat courant ; l’existence d’un PDF ne suffit pas à valider le contenu de la paie.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'Repère v4.11 : bulletins clarifiés 2022 disponibles depuis les bulletins salariés, en édition en masse et en personnalisation. Accès et édition actuels à confirmer dans le dossier.',
    documentScope: 'La note Sage ouverte concerne Sage 100 Paie & RH v4.11 non hébergée, modifiée le 4 avril 2023 : c’est un repère historique d’édition, pas une version recommandée pour 2026. La grille de contrôle est une proposition du cabinet ; cette note ne prouve ni un recalcul automatique actuel ni un menu de verrouillage.',
    fields: [
      { label: 'salarié', control: 'Relie la collecte au bulletin fictif concerné ; une identité incertaine interdit de comparer deux bulletins.' },
      { label: 'période', control: 'Situe le bulletin et ses variables ; comparer la même période et distinguer un éventuel bulletin de rappel.' },
      { label: 'rubrique', control: 'Identifie la nature du calcul ; vérifier son code et son libellé plutôt que le seul total du bulletin.' },
      { label: 'base', control: 'Porte l’assiette de la rubrique ; une base modifiée impose de relire le calcul et sa source.' },
      { label: 'taux', control: 'Porte le coefficient appliqué à la base ; sa validité pour la période se décide par le gestionnaire, pas par comparaison seule.' },
      { label: 'montant', control: 'Porte le résultat de la rubrique ; comparer avant/après selon la tolérance écrite, sans corriger le bulletin.' },
      { label: 'absence', control: 'Relie un événement de collecte à son traitement en paie ; vérifier dates, unité et source validée.' },
      { label: 'net à payer', control: 'Synthétise le résultat versé ; un net stable ne dispense pas du contrôle des rubriques et de leurs écarts.' },
    ],
    knownTrap: 'Dans notre règle de contrôle, une donnée modifiée rend la trace précédente caduque. C’est une convention de recette, pas un comportement logiciel établi par la note v4.11.',
    writtenRule: 'Attacher chaque contrôle à la période et à la version du bulletin relue. Une donnée modifiée après contrôle invalide la trace et impose un nouveau passage avant validation.',
    boundary: {
      prepared: 'Comparer les rubriques et montants au référentiel fictif du cabinet.',
      validation: 'Montrer les changements depuis le dernier calcul et les contrôles à relire.',
      human: 'Corriger le bulletin, valider son contenu et décider de l’édition finale dans la version utilisée.',
    },
    replay: [
      { input: 'Bulletin courant sans changement hors tolérance écrite', rule: 'Version courante contrôlée', outcome: 'Préparé', detail: 'La trace prévue indique période, salarié fictif et version.' },
      { input: 'Une absence modifie une rubrique attendue', rule: 'Changement explicable mais sensible', outcome: 'À valider', detail: 'Avant/après présenté au gestionnaire.' },
      { input: 'Bulletin modifié après le contrôle', rule: 'Trace devenue obsolète', outcome: 'Arrêt', detail: 'La validation n’est pas proposée.' },
    ],
    source: {
      title: 'Sage KB — Découvrir la version 4.11 de Sage 100 Paie & RH',
      url: 'https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=220124154343280',
      checkedAt: '2026-10-04',
      fact: 'Note modifiée le 4 avril 2023 : v4.11 non hébergée, accompagnée de DS v12.11, et accès aux éditions de bulletins clarifiés 2022. Elle ne fixe pas les règles de paie de la période actuelle.',
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
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/saisie-comptable', label: 'Voir le moyeu saisie comptable' },
    officialPath: 'Sélectionner l’exercice dans Fenêtre → Traitement → Saisie par lot',
    documentScope: 'Sage 100 Comptabilité : fiche saisie par lot modifiée le 30 août 2023, sans version chiffrée. Elle décrit le fichier .LOT, son accès et ses limites de contexte. Les champs ci-dessous forment notre grille de préparation ; leur présence ne prouve pas l’absence de doublon dans le dossier.',
    fields: [
      { label: 'exercice', control: 'Délimite le fichier lot ; confirmer l’exercice sélectionné avant d’y préparer des écritures.' },
      { label: 'journal', control: 'Classe les lignes du lot ; vérifier le code du journal et le mois ouvert avant la préparation.' },
      { label: 'date', control: 'Place l’écriture dans la période ; une date hors exercice reste une exception à décider.' },
      { label: 'compte général', control: 'Porte l’imputation proposée ; un compte inconnu demande une décision comptable, jamais une création silencieuse.' },
      { label: 'compte tiers', control: 'Rattache une ligne au tiers attendu lorsqu’il est requis ; une ambiguïté conserve la ligne à valider.' },
      { label: 'référence', control: 'Relie l’écriture à sa pièce ; un doublon interne au lot se signale, ceux du dossier restent non vérifiés.' },
      { label: 'débit', control: 'Alimente un côté du total du lot ; vérifier le signe et la somme avant toute intégration.' },
      { label: 'crédit', control: 'Alimente l’autre côté du total ; exiger l’équilibre avec les débits sans ajouter de ligne d’écart.' },
    ],
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
      checkedAt: '2026-10-04',
      fact: 'Fiche modifiée le 30 août 2023 : fichier .LOT séparé, absence des écritures déjà enregistrées et des soldes, puis mise à jour distincte de la comptabilité.',
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
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation-cabinet-comptable', label: 'Voir le service d’automatisation du cabinet' },
    officialPath: 'Étapes documentées : contrôle et intégration des données → sauvegarde de la base et sauvegarde fiscale → clôture totale des journaux → nouvel exercice → reports à nouveaux définitifs → clôture de l’exercice → FEC.',
    documentScope: 'Sage 100 Comptabilité : fiche TDFA modifiée le 31 octobre 2024. Elle distingue le guide courant du guide v8 et antérieures ; l’ordre ci-dessous reprend sa liste d’étapes, pas un menu unique. Le cabinet choisit le guide de sa version et décide chaque opération engageante.',
    fields: [
      { label: 'exercice', control: 'Fixe le périmètre de clôture ; vérifier l’exercice et la version du guide avant la checklist.' },
      { label: 'journal', control: 'Identifie les journaux à contrôler ; une liste incomplète interdit de conclure la checklist.' },
      { label: 'statut de clôture', control: 'Distingue journal contrôlé et journal clôturé ; conserver la source du statut sans déclencher le traitement.' },
      { label: 'écritures de situation', control: 'Repère les écritures dont le traitement reste à décider ; ne supprimer ni transférer une ligne automatiquement.' },
      { label: 'solde de caisse', control: 'Expose un éventuel solde créditeur dans notre cas fictif ; le cabinet examine son origine avant tout feu vert.' },
      { label: 'à-nouveaux', control: 'Relie les reports à l’exercice suivant ; contrôler leur génération et leur cohérence sans les confondre avec la clôture finale.' },
    ],
    knownTrap: 'La fiche TDFA pose les questions du journal de caisse qui refuse de se clôturer et des écritures de situation. Elle ne suffit pas à établir ici toutes les causes du refus. Dans notre grille, ces alertes restent ouvertes jusqu’à la décision comptable.',
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
      checkedAt: '2026-10-04',
      fact: 'Fiche modifiée le 31 octobre 2024 : liste d’étapes TDFA avec sauvegardes, reports définitifs avant clôture de l’exercice et FEC ; lien distinct vers le guide v8 et antérieures.',
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
    intro: 'La référence publique Cegid Loop décrit l’import des écritures au format JSON, avec code de lettrage, journal, pièce, date et compte. Le paquet importé doit être équilibré sur le même compte lettrable. Ces conditions portent sur un format d’import, pas sur un parcours de lettrage dans l’interface.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/saisie-comptable', label: 'Voir le moyeu saisie comptable' },
    officialPath: 'Format JSON : data.ecritures → codeLettrage, compte ou tiers lettrable, debit et credit ; l’API POST /importJson crée une demande dont le traitement doit être suivi séparément.',
    documentScope: 'Cegid Loop : référence publique de l’import JSON par API, sans version ni date de modification affichée. Les clés ci-dessous appartiennent au fichier transmis ; elles ne désignent pas des menus de l’interface. Aucun appel d’import n’a été exécuté pour ce guide.',
    fields: [
      { label: 'codeLettrage', control: 'Identifie le paquet importé ; exiger le même compte lettrable et son équilibre pour chaque code.' },
      { label: 'journal', control: 'Porte le code du journal dans le JSON ; vérifier le journal attendu, sans inventer une clé journalCode.' },
      { label: 'refPiece', control: 'Relie la ligne à une pièce ; une référence ambiguë reste visible sans valider le paquet.' },
      { label: 'date', control: 'Porte la date comptable dans le JSON ; vérifier le format et la période des écritures, distincts du justificatif dateJustif.' },
      { label: 'compte', control: 'Porte le numéro du compte général ; vérifier s’il est lettrable et si les lignes partagent le même périmètre.' },
      { label: 'tiers', control: 'Porte le code du tiers ; si le lettrage repose sur le tiers, vérifier qu’il est lettrable et commun au paquet.' },
      { label: 'debit.amount', control: 'Porte le montant débiteur de l’objet debit ; sommer dans la même devise pour contrôler l’équilibre.' },
      { label: 'credit.amount', control: 'Porte le montant créditeur de l’objet credit ; le comparer au débit du même compte lettrable, sans compensation entre comptes.' },
    ],
    knownTrap: 'Cegid exige que le compte général ou le tiers soit lettrable, que le code soit sur le même compte lettrable et que le paquet soit équilibré. Un succès de demande API ne démontre pas, à lui seul, la réussite du traitement de l’import.',
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
      checkedAt: '2026-10-04',
      fact: 'La référence décrit les clés de l’import JSON et le lettrage importé : compte général ou tiers lettrable, même compte lettrable par code et débit = crédit. Aucune version chiffrée n’est affichée.',
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
    intro: 'La présentation publique mySilae relie les bulletins calculés à la DSN et décrit les retours après dépôt. Nous en tirons une grille de cadrage : suivre la période, les anomalies et les retours attendus. Elle ne constitue pas une procédure d’interface testée dans mySilae.',
    datePublication: '2026-09-20',
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'Cycle de cadrage : bulletins de la période → contrôles avant dépôt → retours des organismes à lire. Les accès réels sont à confirmer dans l’environnement autorisé du cabinet.',
    documentScope: 'mySilae : page commerciale DSN ouverte le 4 octobre 2026, sans version chiffrée. Elle présente la génération et les retours, mais pas une documentation technique des menus ou des blocs. Cette grille de cadrage définit les informations à rapprocher avec le gestionnaire avant recette.',
    fields: [
      { label: 'période', control: 'Relie déclaration et bulletins du mois ; un décalage de période laisse la préparation ouverte.' },
      { label: 'salarié', control: 'Relie une anomalie au bulletin concerné ; vérifier l’identifiant sans déduire une identité incertaine.' },
      { label: 'organisme', control: 'Identifie l’émetteur du retour attendu ; ne pas confondre un retour reçu et la totalité des retours du dossier.' },
      { label: 'bloc DSN', control: 'Localise la donnée signalée dans la déclaration ; son interprétation et sa correction restent au gestionnaire.' },
      { label: 'statut de contrôle', control: 'Distingue préparation, dépôt et retour ; conserver les anomalies ouvertes plutôt que déduire la conformité du dépôt.' },
      { label: 'CRM', control: 'Compte rendu métier reçu d’un organisme : rattacher son message à la période et garder la suite à décider visible.' },
      { label: 'taux PAS', control: 'Repère le prélèvement à la source utilisé ; contrôler origine et date d’effet avec le gestionnaire, sans substituer un taux.' },
      { label: 'taux AT/MP', control: 'Repère le taux accidents du travail et maladies professionnelles ; faire vérifier sa notification et sa date d’effet.' },
    ],
    knownTrap: 'Dans notre grille, un dépôt ne ferme pas le dossier : les retours attendus doivent être lus et leurs anomalies décidées. La page commerciale Silae mentionne les CRM ; elle ne démontre pas l’exhaustivité de ces contrôles dans une version du logiciel.',
    writtenRule: 'Relier la période aux bulletins calculés, vérifier les anomalies avant transmission et garder le dossier ouvert jusqu’au CRM attendu. Toute anomalie non décidée bloque le statut final.',
    boundary: {
      prepared: 'Recenser les contrôles, les blocs signalés et les retours reçus pour la période.',
      validation: 'Présenter les anomalies et leurs sources sans altérer la déclaration.',
      human: 'Corriger, transmettre et décider du traitement de chaque CRM.',
    },
    replay: [
      { input: 'Période fictive complète, contrôles sans anomalie', rule: 'Préparation cohérente', outcome: 'Préparé', detail: 'La synthèse est prête avant transmission.' },
      { input: 'CRM reçu avec une anomalie identifiée', rule: 'Retour à interpréter', outcome: 'À valider', detail: 'L’anomalie reste ouverte avec son libellé.' },
      { input: 'Un CRM attendu manque après un dépôt fictif', rule: 'Retour attendu non reçu', outcome: 'Arrêt', detail: 'La grille ne ferme pas le dossier ; le gestionnaire vérifie le suivi.' },
    ],
    source: {
      title: 'Silae — Logiciel de paie compatible DSN',
      url: 'https://www.silae.fr/solution-rh-paie/logiciel-paie/dsn/',
      checkedAt: '2026-10-04',
      fact: 'Présentation commerciale, sans date de modification affichée : DSN issue des bulletins calculés et CRM après dépôt. Elle n’établit ni les menus d’une version précise ni une conformité réglementaire de notre grille.',
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
    dateMiseAJour: '2026-10-04',
    auteur: 'kevin',
    service: { href: '/automatisation/paie', label: 'Voir le moyeu paie' },
    officialPath: 'Cycle présenté par l’éditeur : collecte des variables → production → contrôle et validation → distribution. Ce sont des étapes, pas un chemin de menus testé.',
    documentScope: 'mySilae : présentation commerciale de la gestion de paie, sans version ni date de modification affichée. Elle décrit collecte, production, contrôle et distribution, pas les menus ou un algorithme de contrôle. Les champs ci-dessous constituent notre grille de cadrage, à recetter dans le dossier autorisé.',
    fields: [
      { label: 'salarié', control: 'Relie variables et bulletin à la même personne fictive ; une identité incertaine arrête la comparaison.' },
      { label: 'salaire de base', control: 'Porte un élément fixe ; comparer au référentiel de la période validé par le gestionnaire.' },
      { label: 'prime', control: 'Porte une variable de rémunération ; vérifier origine, période et montant avant de conclure à la concordance.' },
      { label: 'heure supplémentaire', control: 'Relie quantité et traitement en paie ; une modification exige une nouvelle lecture des rubriques concernées.' },
      { label: 'absence', control: 'Relie un événement à ses dates et à son unité ; sa qualification et son incidence restent décidées en paie.' },
      { label: 'cotisation', control: 'Porte une rubrique avec base, taux et montant ; relire ces éléments même lorsque le net ne change pas.' },
      { label: 'net à payer', control: 'Synthétise le montant à verser ; des erreurs peuvent se compenser, donc un net stable ne clôt pas le contrôle.' },
      { label: 'statut de validation', control: 'Trace la décision humaine sur la version relue ; une modification rend cette trace à revalider dans notre règle.' },
    ],
    knownTrap: 'Dans notre grille de contrôle, un net identique peut masquer une mauvaise rubrique ou deux erreurs compensées. La présentation commerciale Silae établit les étapes du cycle, pas l’efficacité de cette comparaison ni sa présence native dans le logiciel.',
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
      checkedAt: '2026-10-04',
      fact: 'Présentation commerciale, sans date de modification affichée : collecte des variables, production des bulletins, contrôle et validation des cycles, puis distribution. Elle ne documente pas les conditions de notre grille de contrôle.',
    },
  },
] as const;

export const INTEGRATIONS: readonly IntegrationDefinition[] = [
  ...INTEGRATIONS_HISTORIQUES,
  ...(generatedGuides as IntegrationDefinition[]),
];

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
