import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expandV3Evidence } from './resource-metier-v3.mjs';

const REPORT = 'docs/qa/hub-ressources/metier-fix-a.md';
// Planchers fail-closed : 23 définitions et 41 unités au candidat R4, 43 et 66 depuis la vague 1 (R5).
const DEFINITIONS_ATTENDUES = 43;
const UNITES_ATTENDUES = 66;

const SOURCE_SPECS = {
  'source-net-dsn-overview': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'DSN-INFO : La déclaration Sociale Nominative (DSN)',
    url: 'https://www.net-entreprises.fr/tableau-de-bord-dsn/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-overview.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-net-dsn-val': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'Outils d’auto-contrôle Dsn-Val et brique de contrôle',
    url: 'https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-val.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-net-crm': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'Les Comptes Rendus Métiers DSN',
    url: 'https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-crm.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-net-annule': {
    publisher: 'Net-entreprises (GIP-MDS)',
    title: 'Annule et remplace DSN mensuelle et signalements',
    url: 'https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/net-annule.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-donnee': {
    publisher: 'CNIL', title: 'Donnée personnelle',
    url: 'https://www.cnil.fr/fr/definition/donnee-personnelle',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-donnee.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-rgpd': {
    publisher: 'CNIL', title: 'CHAPITRE II - Principes',
    url: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-rgpd.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-anonymisation': {
    publisher: 'CNIL', title: 'L’anonymisation de données personnelles',
    url: 'https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-anonymisation.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-service-public-recouvrement': {
    publisher: 'Service-Public Entreprendre', title: 'Recouvrement amiable : relance et mise en demeure de payer',
    url: 'https://entreprendre.service-public.gouv.fr/vosdroits/F38586',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/service-public-recouvrement.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-cnil-controle-activite': {
    publisher: 'CNIL', title: 'Travail, ressources humaines : le contrôle de l’activité des personnes employées',
    url: 'https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees',
    snapshotPath: 'docs/qa/hub-ressources/metier-fix-a-sources/cnil-controle-activite.txt',
    level: 'tier-1', provenance: 'primary', official: true,
  },
  // --- vague 1 du glossaire (2026-09-16) : copies prises le jour même, rapport docs/qa/hub-ressources/glossaire-vague-1.md ---
  "source-cnil-sous-traitant": {
    publisher: "CNIL", title: "Sous-traitant | CNIL",
    url: "https://www.cnil.fr/fr/definition/sous-traitant",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-sous-traitant.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-cnil-modele-de-langage": {
    publisher: "CNIL", title: "Modèle de langage | CNIL",
    url: "https://www.cnil.fr/fr/definition/modele-de-langage",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-modele-de-langage.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-cnil-ia-generative": {
    publisher: "CNIL", title: "Comment déployer une IA générative ? La CNIL apporte de premières précisions | CNIL",
    url: "https://www.cnil.fr/fr/comment-deployer-une-ia-generative-la-cnil-apporte-de-premieres-precisions",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-ia-generative.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-cnil-hallucination": {
    publisher: "CNIL", title: "Les questions-réponses de la CNIL sur l’utilisation d’un système d’IA générative | CNIL",
    url: "https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-hallucination.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-eurlex-ai-act": {
    publisher: "EUR-Lex — Union européenne", title: "Règlement (UE) 2024/1689 du 13 juin 2024 (règlement sur l’intelligence artificielle), texte intégral en français",
    url: "https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024R1689",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/eurlex-ai-act.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-microsoft-power-automate-declencheur": {
    publisher: "Microsoft", title: "Déclencheurs - Power Automate | Microsoft Learn",
    url: "https://learn.microsoft.com/fr-fr/power-automate/triggers-introduction",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/microsoft-power-automate-declencheur.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-microsoft-ocr": {
    publisher: "Microsoft", title: "OCR – reconnaissance optique de caractères - Foundry Tools | Microsoft Learn",
    url: "https://learn.microsoft.com/fr-fr/azure/ai-services/computer-vision/overview-ocr",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/microsoft-ocr.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-microsoft-document-intelligence": {
    publisher: "Microsoft", title: "Qu’est-ce que Azure Document Intelligence dans les outils Foundry ? - Foundry Tools | Microsoft Learn",
    url: "https://learn.microsoft.com/fr-fr/azure/ai-services/document-intelligence/overview?view=doc-intel-4.0.0",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/microsoft-document-intelligence.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-banque-france-sepa": {
    publisher: "Banque de France", title: "Foire aux questions - Le prélèvement SEPA | Banque de France",
    url: "https://www.banque-france.fr/fr/foire-aux-questions-le-prelevement-sepa",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/banque-france-sepa.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-legifrance-deontologie-honoraires": {
    publisher: "Légifrance", title: "Article 158 - Décret n° 2012-432 du 30 mars 2012 relatif à l’exercice de l’activité d’expertise comptable (code de déontologie, section 2 : devoirs envers les clients ou adhérents)",
    url: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039401724",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/legifrance-deontologie-honoraires.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  "source-legifrance-ccag-tic": {
    publisher: "Légifrance", title: "Arrêté du 30 mars 2021 portant approbation du cahier des clauses administratives générales des marchés publics de techniques de l’information et de la communication (CCAG-TIC), article 2 « Définitions »",
    url: "https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043310689",
    snapshotPath: "docs/qa/hub-ressources/glossaire-vague-1-sources/legifrance-ccag-tic.txt", report: "docs/qa/hub-ressources/glossaire-vague-1.md",
    level: 'tier-1', provenance: 'primary', official: true,
  },
  'source-glossary-memlia': {
    publisher: 'Memlia', title: 'Vocabulaire et contrats Memlia',
    url: 'file://src/data/glossary.ts', snapshotPath: 'src/data/glossary.ts',
    level: 'original-method', provenance: 'primary', official: false,
  },
  'source-hub-memlia': {
    publisher: 'Memlia', title: 'Positionnement éditorial du Hub Ressources',
    url: 'file://src/pages/ressources.astro', snapshotPath: 'src/pages/ressources.astro',
    level: 'original-method', provenance: 'primary', official: false,
  },
};

const OFFICIAL = {
  dsn: {
    sourceId: 'source-net-dsn-overview', type: 'dsn',
    citations: ['La DSN – Déclaration Sociale Nominative – est obligatoire pour toutes les entreprises du secteur privé ainsi qu’à la Fonction publique. Elle remplace à ce jour près de 80 procédures et a vocation à supprimer encore des formalités qui s’appuient sur les données de paie.'],
    applicability: 'Entreprises du secteur privé et fonction publique concernées par la DSN en France.',
    regime: 'Déclaration sociale nominative française et formalités qu’elle remplace.',
    exceptions: 'Les déclarations et signalements couverts par la DSN conservent leurs règles propres.',
  },
  'dsn-val': {
    sourceId: 'source-net-dsn-val', type: 'dsn',
    citations: ['L’outil de contrôle Dsn-Val permet de tester votre fichier DSN avant de le déposer. Les contrôles effectués portent sur le cahier technique et le journal de maintenance de la norme (JMN) associé.'],
    applicability: 'Fichiers DSN contrôlés avant dépôt, selon le cahier technique et le JMN applicables.',
    regime: 'Contrôle de norme DSN selon le cahier technique et le JMN applicables au fichier.',
    exceptions: 'Un contrôle de norme ne prouve pas l’exactitude métier des variables de paie.',
  },
  'compte-rendu-metier-dsn': {
    sourceId: 'source-net-crm', type: 'dsn',
    citations: [
      'Un Compte Rendu Métier (CRM) est un rapport permettant à l’organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu’une erreur ou suspicion d’erreur est détectée. Il est donc important de prendre en compte ces retours.',
      'Suite à cette analyse, chaque organisme destinataire de vos DSN vous met à disposition un « Compte Rendu Métier (ou CRM) » sur votre tableau de bord, pour vous préciser vos anomalies ou vous confirmer la qualité de vos déclarations.',
    ],
    applicability: 'Déclarations reçues et analysées par les organismes destinataires.',
    regime: 'Comptes rendus métier émis par les organismes destinataires d’une DSN.',
    exceptions: 'Les CRM diffèrent selon l’organisme ; leur silence ne garantit pas la justesse générale.',
  },
  'annule-et-remplace-dsn': {
    sourceId: 'source-net-annule', type: 'dsn',
    citations: ["Concernant la DSN mensuelle, celle-ci peut faire l'objet d' « annule et remplace » tant que l'échéance d'envoi retenue pour votre entreprise n'est pas dépassée (5 ou 15 du mois suivant)."],
    applicability: 'DSN mensuelle dans la fenêtre propre à l’échéance de l’entreprise.',
    regime: 'DSN mensuelle annule-et-remplace, distincte des signalements d’événement.',
    exceptions: 'Les signalements d’événement suivent une autre fenêtre, explicitée près du claim dans le glossaire.',
  },
  'donnee-personnelle': {
    sourceId: 'source-cnil-donnee', type: 'legal-reglementaire',
    citations: ['Une donnée personnelle est toute information se rapportant à une personne physique identifiée ou identifiable.'],
    applicability: 'Informations se rapportant à une personne physique identifiée ou identifiable.',
    regime: 'Définition des données à caractère personnel au sens du RGPD.',
    exceptions: 'L’identification peut être directe ou indirecte ; retirer le nom ne suffit pas nécessairement.',
  },
  'minimisation-des-donnees': {
    sourceId: 'source-cnil-rgpd', type: 'legal-reglementaire',
    citations: ['adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées (minimisation des données);'],
    applicability: 'Traitements de données à caractère personnel, au regard de finalités déterminées.',
    regime: 'Principe de minimisation des données prévu par le RGPD.',
    exceptions: 'Le nécessaire s’apprécie selon la finalité ; une collecte « au cas où » n’est pas justifiée.',
  },
  anonymisation: {
    sourceId: 'source-cnil-anonymisation', type: 'legal-reglementaire',
    citations: ['L’anonymisation est un traitement qui consiste à utiliser un ensemble de techniques de manière à rendre impossible, en pratique, toute identification de la personne par quelque moyen que ce soit et de manière irréversible.'],
    applicability: 'Jeu de données dont l’irréversibilité pratique doit être démontrée.',
    regime: 'Qualification d’anonymisation selon les critères exposés par la CNIL.',
    exceptions: 'Pseudonymisation et agrégation trop fine ne suffisent pas à établir l’anonymat.',
  },
  pseudonymisation: {
    sourceId: 'source-cnil-anonymisation', type: 'legal-reglementaire',
    citations: ["La pseudonymisation est un traitement de données personnelles réalisé de manière à ce qu'on ne puisse plus attribuer les données relatives à une personne physique sans information supplémentaire."],
    applicability: 'Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.',
    regime: 'Pseudonymisation de données personnelles au sens du RGPD.',
    exceptions: 'Les données restent personnelles et l’opération est réversible.',
  },
  'recouvrement-amiable': {
    sourceId: 'source-service-public-recouvrement', type: 'legal-reglementaire',
    citations: ["Elle peut d'abord essayer de recouvrer ses impayés de façon amiable sans engager une action judiciaire. Cela se traduit généralement par une relance puis, en cas d'échec, par une mise en demeure."],
    applicability: 'Entreprise créancière confrontée à un retard de paiement client.',
    regime: 'Recouvrement amiable d’une créance professionnelle avant action judiciaire.',
    exceptions: 'La relance et la mise en demeure sont distinctes ; aucun envoi automatique sans validation.',
  },
  // --- vague 1 du glossaire (2026-09-16) ---
  "systeme-d-ia": {
    sourceId: "source-eurlex-ai-act", type: "legal-reglementaire",
    citations: ["«système d’IA», un système automatisé qui est conçu pour fonctionner à différents niveaux d’autonomie et peut faire preuve d’une capacité d’adaptation après son déploiement, et qui, pour des objectifs explicites ou implicites, déduit, à partir des entrées qu’il reçoit, la manière de générer des sorties telles que des prédictions, du contenu, des recommandations ou des décisions qui peuvent influencer les environnements physiques ou virtuels;"],
    applicability: "Systèmes répondant à la définition de l’article 3, point 1, du règlement (UE) 2024/1689.",
    regime: "Règlement (UE) 2024/1689 sur l’intelligence artificielle, définition du système d’IA.",
    exceptions: "La qualification d’un outil précis relève d’un examen au cas par cas ; les obligations qui en découlent dépendent du rôle et du niveau de risque.",
  },
  "systeme-d-ia-regles": {
    sourceId: "source-eurlex-ai-act", type: "legal-reglementaire",
    citations: ["En outre, la définition devrait être fondée sur les caractéristiques essentielles des systèmes d’IA qui la distinguent des systèmes logiciels ou des approches de programmation traditionnels plus simples, et ne devrait pas couvrir les systèmes fondés sur les règles définies uniquement par les personnes physiques pour exécuter automatiquement des opérations."],
    applicability: "Distinction entre systèmes d’IA et systèmes fondés sur des règles définies uniquement par des personnes physiques.",
    regime: "Considérant 12 du règlement (UE) 2024/1689, portée de la définition du système d’IA.",
    exceptions: "Un considérant éclaire la définition sans créer d’obligation propre ; la qualification concrète reste un examen au cas par cas.",
  },
  "sous-traitant-rgpd": {
    sourceId: "source-cnil-sous-traitant", type: "legal-reglementaire",
    citations: ["Le sous-traitant est la personne physique ou morale (entreprise ou organisme public) qui traite des données pour le compte d’un autre organisme (« le responsable de traitement »), dans le cadre d’un service ou d’une prestation.", "Les sous-traitants ont des obligations concernant les données personnelles, qui doivent être présentes dans le contrat :"],
    applicability: "Organismes qui traitent des données personnelles pour le compte d’un responsable de traitement.",
    regime: "Définition du sous-traitant au sens du RGPD et obligations à inscrire au contrat, telles que présentées par la CNIL.",
    exceptions: "La qualification d’un prestataire donné et le contenu exact des clauses relèvent d’une analyse juridique propre à chaque relation.",
  },
  "ia-generative": {
    sourceId: "source-cnil-ia-generative", type: "information",
    citations: ["L' intelligence artificielle dite « générative » désigne les systèmes capables de créer des contenus (texte, code informatique, images, musique, audio, vidéos, etc.). Lorsqu’ils permettent de réaliser un large éventail de tâches, ces systèmes peuvent être qualifiés de systèmes d’IA à usage général. C’est par exemple le cas des systèmes intégrant des grands modèles de langage (en anglais large language models ou LLM)."],
    applicability: "Systèmes capables de créer des contenus, tels que décrits par la CNIL.",
    regime: "Présentation par la CNIL de l’IA générative et des systèmes d’IA à usage général.",
    exceptions: "La seconde phrase de la définition décrit le caractère non déterministe des sorties ; elle relève de la doctrine Memlia.",
  },
  "grand-modele-de-langage": {
    sourceId: "source-cnil-modele-de-langage", type: "information",
    citations: ["Modèle statistique de la distribution d’unité linguistiques (par exemple : lettres, phonèmes, mots) dans une langue naturelle. Un modèle de langage peut par exemple prédire le mot suivant dans une séquence de mots. On parle de modèles de langage de grande taille ou « Large Language Models » (LLM) en anglais pour les modèles possédant un grand nombre de paramètres (généralement de l'ordre du milliard de poids ou plus) comme GPT-3, BLOOM, Megatron NLG, Llama ou encore PaLM."],
    applicability: "Modèles de langage et modèles de langage de grande taille au sens du glossaire de la CNIL.",
    regime: "Définition du modèle de langage publiée par la CNIL.",
    exceptions: "La phrase sur les usages de rédaction ou de synthèse relève de la doctrine Memlia.",
  },
  "hallucination": {
    sourceId: "source-cnil-hallucination", type: "information",
    citations: ["Les modèles génératifs ne sont pas des bases de connaissance : ils obéissent à une logique probabiliste, ce qui signifie qu’ils ne génèrent que le résultat qui sera statistiquement le plus probable compte tenu des données sur lesquelles ils ont été entraînés. Ces systèmes peuvent générer des résultats inexacts qui peuvent, pourtant, paraître plausibles (on parle alors souvent d’hallucinations). Cela pourra survenir lorsqu’ils sont interrogés à propos d’informations qui ne sont pas présentes dans leurs données d’entraînement. C’est par exemple le cas sur des évènements postérieurs à leur développement, ces systèmes n’étant pas toujours reliés à des bases de connaissances actualisées."],
    applicability: "Résultats inexacts mais plausibles produits par un système d’IA générative.",
    regime: "Questions-réponses de la CNIL sur l’utilisation d’un système d’IA générative.",
    exceptions: "La cause évoquée (information absente des données d’entraînement) est un cas parmi d’autres ; la CNIL décrit une logique probabiliste générale.",
  },
  "reconnaissance-optique-de-caracteres": {
    sourceId: "source-microsoft-ocr", type: "information",
    citations: ["OCR ou Reconnaissance optique de caractères est également appelé reconnaissance de texte ou extraction de texte. Les techniques OCR basées sur le Machine Learning vous permettent d’extraire du texte imprimé ou manuscrit à partir d’images telles que des affiches, des panneaux de rue et des étiquettes de produits, ainsi que des documents tels que des articles, des rapports, des formulaires et des factures. Le texte est généralement extrait sous forme de mots, de lignes de texte et de paragraphes ou de blocs de texte, ce qui permet d’accéder à la version numérique du texte numérisé. Cette fonctionnalité élimine ou réduit considérablement la nécessité d’une entrée de données manuelle."],
    applicability: "Extraction de texte imprimé ou manuscrit à partir d’images et de documents.",
    regime: "Documentation Microsoft Learn du service OCR, description générale de la technologie.",
    exceptions: "Documentation d’un éditeur : elle décrit la technologie, pas une norme ; la limite « elle n’interprète pas le sens » relève de la doctrine Memlia.",
  },
  "extraction-de-donnees": {
    sourceId: "source-microsoft-document-intelligence", type: "information",
    citations: ["Les modèles d’extraction de champs de document sont formés pour extraire des champs étiquetés à partir de documents.", "Extrayez du texte, des structures et des paires clé-valeur."],
    applicability: "Extraction de champs étiquetés, de texte, de structures et de paires clé-valeur à partir de documents.",
    regime: "Documentation Microsoft Learn d’Azure Document Intelligence, description des modèles d’extraction.",
    exceptions: "Documentation d’un éditeur : l’ordre « après la lecture, jamais avant » et les exemples de champs relèvent de la doctrine Memlia.",
  },
  "declencheur": {
    sourceId: "source-microsoft-power-automate-declencheur", type: "information",
    citations: ["Un déclencheur est un événement qui démarre un flux de cloud. Par exemple, vous souhaitez recevoir une notification dans Microsoft Teams lorsque quelqu’un vous envoie un courrier électronique. Dans ce cas, la réception d’un courrier électronique est le déclencheur qui démarre ce flux."],
    applicability: "Événement qui démarre un flux automatisé.",
    regime: "Documentation Microsoft Learn de Power Automate, notion de déclencheur.",
    exceptions: "Documentation d’un éditeur : la distinction déclencheur / règle / conditions relève de la doctrine Memlia.",
  },
  "prelevement-sepa-et-rejet": {
    sourceId: "source-banque-france-sepa", type: "juridique",
    citations: ["Un créancier n’a légalement pas le droit d’émettre un prélèvement en l’absence du consentement du débiteur, ce dernier se matérialisant par la signature d’un mandat de prélèvement. Cependant, certains acteurs mal intentionnés parviennent à émettre des prélèvements non autorisés à l’aide de mandats fictifs. Les IBAN utilisés pour ces faux prélèvements peuvent notamment avoir été obtenus à la suite de fuites de données personnelles.", "Lorsque la provision sur votre compte n’est pas suffisante, votre prestataire de services de paiement (généralement votre banque) peut refuser de payer le prélèvement. Il doit vous le notifier et vous préciser le motif du refus."],
    applicability: "Prélèvements SEPA émis sur mandat signé par le débiteur, et refus de paiement notifiés par la banque.",
    regime: "Foire aux questions de la Banque de France sur le prélèvement SEPA.",
    exceptions: "La FAQ s’adresse au débiteur ; la conduite à tenir après un rejet (nouvelle présentation, contact) relève de la doctrine Memlia et des conditions du mandat.",
  },
  "honoraires-mensualises-et-actes-hors-forfait": {
    sourceId: "source-legifrance-deontologie-honoraires", type: "legal-reglementaire",
    citations: ["Les honoraires sont fixés librement entre le client et les experts-comptables ou les professionnels ayant été autorisés à exercer partiellement l'activité d'expertise comptable en fonction de l'importance des diligences à mettre en œuvre, de la difficulté des cas à traiter, des frais exposés ainsi que de la notoriété de l'expert-comptable ou du professionnel."],
    applicability: "Honoraires des experts-comptables et des professionnels autorisés à exercer partiellement l’activité.",
    regime: "Article 158 du décret n° 2012-432 (code de déontologie des professionnels de l’expertise comptable), version en vigueur depuis le 21 novembre 2019.",
    exceptions: "La mensualisation et la notion d’acte hors forfait relèvent de la lettre de mission et de la doctrine Memlia, pas de l’article cité.",
  },
  "recette": {
    sourceId: "source-legifrance-ccag-tic", type: "information",
    citations: ["l'« admission » est la décision, prise après vérifications, par laquelle l'acheteur reconnaît la conformité des prestations aux stipulations du marché."],
    applicability: "Vocabulaire des marchés publics de techniques de l’information et de la communication.",
    regime: "CCAG-TIC approuvé par l’arrêté du 30 mars 2021, article 2, définition de l’admission.",
    exceptions: "La recette Memlia est une convention de service ; le CCAG n’est cité que pour le vocabulaire vérification puis admission.",
  },
  'jeu-d-essai-fictif-anonymisation': {
    ...OFFICIAL_ANONYMISATION_REF(),
  },
};

/** Le jeu d’essai fictif se distingue de l’anonymisation : même source et même citation que le terme « anonymisation ». */
function OFFICIAL_ANONYMISATION_REF() {
  return {
    sourceId: 'source-cnil-anonymisation', type: 'legal-reglementaire',
    citations: ['L’anonymisation est un traitement qui consiste à utiliser un ensemble de techniques de manière à rendre impossible, en pratique, toute identification de la personne par quelque moyen que ce soit et de manière irréversible.'],
    applicability: 'Distinction entre données inventées et données réelles anonymisées.',
    regime: 'Qualification de l’anonymisation selon les critères exposés par la CNIL.',
    exceptions: 'La CNIL définit l’anonymisation ; le caractère inventé du jeu d’essai est une convention Memlia.',
  };
}

function extractDefinitions(source) {
  const entries = [...source.matchAll(/\.\.\.common, id: '([^']+)'[\s\S]*?definition: '([^']+)'/g)]
    .map((match) => ({ slug: match[1], text: match[2] }));
  if (entries.length !== DEFINITIONS_ATTENDUES) throw new Error(`Inventaire T incomplet : ${DEFINITIONS_ATTENDUES} définitions attendues, ${entries.length} trouvées.`);
  return entries;
}

function extractSummary(source, path) {
  const summary = source.match(/^resume: "(.+)"$/m)?.[1];
  if (!summary) throw new Error(`Résumé introuvable dans ${path}.`);
  return summary;
}

export function loadMetierEvidence(root, checkedAt) {
  const glossaryPath = 'src/data/glossary.ts';
  const resourcesPath = 'src/pages/ressources.astro';
  const dsnArticlePath = 'src/content/blog/controler-les-bulletins-de-paie-avant-la-dsn.md';
  const socialArticlePath = 'src/content/blog/suivre-la-production-sociale-dans-excel.md';
  const glossary = readFileSync(join(root, glossaryPath), 'utf8');
  const resources = readFileSync(join(root, resourcesPath), 'utf8');
  const dsnArticle = readFileSync(join(root, dsnArticlePath), 'utf8');
  const socialArticle = readFileSync(join(root, socialArticlePath), 'utf8');
  const hubDescription = 'Des ressources pour comprendre, vérifier et cadrer les tâches d’un cabinet, sans céder la décision humaine.';
  if (!resources.includes(hubDescription)) throw new Error('Claim H-DESCRIPTION absent de la page Ressources.');

  const sources = Object.fromEntries(Object.entries(SOURCE_SPECS).map(([id, source]) => [id, {
    id, ...source, checkedAt,
    requestedUrl: source.url,
    finalUrl: source.url,
    upstreamUrl: source.url,
    verificationEvidenceRef: `${source.report ?? REPORT}#verification-des-sources`,
    classificationEvidenceRef: `${source.report ?? REPORT}#classification-des-sources`,
  }]));

  const entries = extractDefinitions(glossary).map(({ slug, text }) => {
    const official = OFFICIAL[slug];
    const sourceId = official?.sourceId ?? 'source-glossary-memlia';
    const citations = official?.citations ?? [text];
    return {
      id: `T-DEF-${slug.toUpperCase()}`,
      surface: 'T', unitId: `unit-t-${slug}`, claimId: `claim-t-${slug}`,
      text, type: official?.type ?? 'methode-memlia', sourceId,
      citations: citations.map((citation, index) => ({
        id: `citation-t-${slug}-${index + 1}`, text: citation, locator: sources[sourceId].title,
      })),
      contentPath: glossaryPath, contentLocator: `${slug}:definition`,
      applicability: official?.applicability ?? 'Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.',
      regime: official?.regime ?? 'Convention de vocabulaire ou contrat technique propre au service Memlia décrit.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: official?.exceptions ?? 'La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.',
    };
  });

  entries.push(
    {
      id: 'H-DESCRIPTION', surface: 'H', unitId: 'unit-h-description', claimId: 'claim-h-description',
      text: hubDescription, type: 'positionnement', sourceId: 'source-hub-memlia',
      citations: [{ id: 'citation-h-description-1', text: hubDescription, locator: 'description' }],
      contentPath: resourcesPath, contentLocator: 'description',
      applicability: 'Promesse éditoriale du Hub ; elle décrit la posture des ressources.',
      regime: 'Positionnement éditorial Memlia, sans portée réglementaire autonome.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: 'Les résumés réglementaires rendus par le Hub possèdent leurs propres claims et preuves.',
    },
    {
      id: 'H-DSN-DEADLINE-SUMMARY', surface: 'H', unitId: 'unit-h-dsn-deadline-summary', claimId: 'claim-h-dsn-deadline-summary',
      text: extractSummary(dsnArticle, dsnArticlePath), type: 'dsn', sourceId: 'source-net-annule',
      citations: [
        { id: 'citation-h-dsn-deadline-1', text: 'L\'échéance de dépôt des DSN "annule et remplace" est située la veille du jour de l\'échéance à minuit.', locator: 'Annule et remplace DSN mensuelle et signalements' },
        { id: 'citation-h-dsn-deadline-2', text: "Si la déclaration « annule et remplace » concerne un signalement d'événement, il n’y a pas de date limite à son envoi (envoi de la déclaration « annule et remplace » dès que nécessaire).", locator: 'Annule et remplace DSN mensuelle et signalements' },
      ],
      contentPath: dsnArticlePath, contentLocator: 'frontmatter.resume',
      applicability: 'DSN mensuelle annule-et-remplace ; échéance propre à l’entreprise, le 5 ou le 15.',
      regime: 'DSN mensuelle annule-et-remplace, distincte des signalements d’événement.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: 'Le résumé visible précise que les signalements d’événement suivent une autre fenêtre.',
    },
    {
      id: 'H-SOCIAL-MONITORING-SUMMARY', surface: 'H', unitId: 'unit-h-social-monitoring-summary', claimId: 'claim-h-social-monitoring-summary',
      text: extractSummary(socialArticle, socialArticlePath), type: 'legal-reglementaire', sourceId: 'source-cnil-controle-activite',
      citations: [
        { id: 'citation-h-social-1', text: 'Pour être licite (c’est-à-dire autorisé par la loi), un dispositif de contrôle de l’activité du personnel doit cumulativement : satisfaire aux tests de justification et de proportionnalité ; être soumis aux instances représentatives du personnel selon les règles en vigueur ; être porté à la connaissance des salariés/agents.', locator: 'Conditions cumulatives, formulation du 16/09/2026' },
        { id: 'citation-h-social-2', text: "Dans le cadre du dialogue social, l'employeur doit consulter : le conseil social et économique (CSE) dans les entreprises privées de 50 salariés et plus, les établissements publics à caractère industriel et commercial et les établissements publics à caractère administratif lorsqu'ils emploient du personnel dans les conditions du droit privé ; le comité social d’administration, territorial ou d’établissement (CSA, CST et CSE) ou leurs formations spécialisées dans les organismes publics.", locator: 'Condition n°2' },
        { id: 'citation-h-social-3', text: "Le dispositif doit être porté à la connaissance des personnes concernées, préalablement à sa mise en place, pour satisfaire aux obligations de loyauté et d’information qui incombent à l'employeur.", locator: 'Condition n°3' },
      ],
      contentPath: socialArticlePath, contentLocator: 'frontmatter.resume',
      applicability: 'Dispositif qui permet le contrôle de l’activité du personnel ; consultation CSE formulée ici pour les entreprises privées de 50 salariés et plus.',
      regime: 'Contrôle de l’activité du personnel et consultation du CSE dans le secteur privé.',
      validAsOf: checkedAt.slice(0, 10),
      exceptions: 'La qualification dépend du dispositif ; les exceptions légales et les autres instances du secteur public ne sont pas généralisées au Hub.',
    },
  );

  expandV3Evidence({ root, glossary, entries, sources, official: OFFICIAL, checkedAt });
  if (new Set(entries.map((entry) => entry.unitId)).size !== UNITES_ATTENDUES) throw new Error(`${UNITES_ATTENDUES} unités métier sont obligatoires.`);
  for (const entry of entries) {
    if (!readFileSync(join(root, entry.contentPath), 'utf8').includes(entry.text)) throw new Error(`Claim non rendu dans sa source : ${entry.id}`);
    const snapshot = readFileSync(join(root, sources[entry.sourceId].snapshotPath), 'utf8');
    for (const citation of entry.citations) if (!snapshot.includes(citation.text)) throw new Error(`Citation absente de la copie : ${citation.id}`);
  }
  return { contractRevision: 3, checkedAt, sources, entries };
}
