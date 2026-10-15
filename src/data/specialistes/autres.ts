import type { Specialiste } from '../specialistes.ts';

/*
 * Les deux agents dont la carte mène à une page existante (spec §0 et §3) : aucune fiche, aucun contenu de fiche.
 * Leur démonstration passe le même contrôle de forme que celle des dix fiches (arbitrage 4 de la porte 2). Ils sont
 * `publie: true` : leur page de destination est déjà construite (R19 du 15/10/2026).
 */

/**
 * Aude · Missions d’audit (AGENTS-CONTENU.md §5). Sa carte mène à l'accueil CAC, auquel aucun bloc n'est ajouté
 * (spec §3, D5) : la démonstration reste dans les données. Le métier se dit « missions d'audit » ; le titre de
 * commissaire aux comptes désigne le lecteur, jamais l'agent.
 */
export const MISSIONS_AUDIT: Specialiste = {
  slug: 'missions-audit',
  prenom: 'Aude',
  libelle: 'Missions d’audit',
  groupe: 'production-conseil',
  teinte: 'audit-cac',
  publie: true,
  destination: { type: 'page', chemin: '/commissaires-aux-comptes' },
  ligne: 'Prépare la mécanique de vos mandats : FEC reçu, revue analytique, sélections et confirmations des tiers ; le jugement reste au commissaire aux comptes.',
  frontiereEnBref: [
    'Tester la forme des fichiers reçus',
    'La méthode et les paramètres de chaque sélection',
    'Les conclusions, l’opinion et la signature',
  ],
  familles: [
    'cac-fec-reception', 'cac-demandes-documents', 'cac-revue-analytique', 'cac-revue-ecritures',
    'cac-confirmations-audit', 'cac-dossier-de-travail', 'cac-rapport-certification', 'cac-suivi-mandats',
    'cac-planification-missions', 'cac-heures-realisees', 'cac-acceptation-mandats', 'cac-attestations-chiffres',
    'audit-legal',
  ],
  servicesLies: [],
  logiciels: [
    'Caseware Audit France', 'Acropole Expert CAC', 'Auditsoft Premier', 'PackAUDIT', 'SmartFEC+', 'DreamAudit',
    'e-Circu', 'Circit', 'Microsoft Excel',
  ],
  avatar: { src: '/agents/missions-audit-256.webp', alt: 'Figurine Memlia, agent IA missions audit.' },
  demonstration: {
    tache: 'réception du FEC',
    dossier: 'Dossier fictif : le mandat Héron, SAS inventée, exercice clos le 30/06/2026, FEC et balance remis par l’entité.',
    regle: 'À réception, le FEC est testé dans sa forme (colonnes attendues, numérotation continue par journal, équilibre entre débit et crédit, dates dans l’exercice), puis ses totaux sont rapprochés de la balance remise. Un fichier illisible, un exercice différent de celui du mandat ou une balance absente arrête le constat ; aucune conclusion sur les comptes n’est écrite.',
    cas: [
      { cas: 'FEC complet et balance remise, totaux identiques', sortie: 'Constat de forme sans défaut, totaux rapprochés journal par journal', issue: 'Préparé' },
      { cas: 'Journal des ventes déséquilibré sur deux dates', sortie: 'Défaut listé avec les écritures en cause, question préparée pour l’entité', issue: 'À valider' },
      { cas: 'Écritures datées après la clôture dans le fichier de l’exercice', sortie: 'Écritures isolées et listées pour le chef de mission', issue: 'À valider' },
      { cas: 'Fichier remis pour l’exercice précédent', sortie: 'Aucun constat établi. Motif : exercice du fichier différent de celui du mandat', issue: 'Arrêt' },
    ],
  },
};

/**
 * Octavie · Informatique et outils (AGENTS-CONTENU.md §11). Sa carte mène à /integrations : la page des outils
 * reçoit le bandeau « Qui prend ce métier » et rend la démonstration sous lui (spec §2.1).
 */
export const INFORMATIQUE_OUTILS: Specialiste = {
  slug: 'informatique-outils',
  prenom: 'Octavie',
  libelle: 'Informatique et outils',
  groupe: 'vie-cabinet',
  teinte: 'excel-outils-existants',
  publie: true,
  destination: { type: 'page', chemin: '/integrations' },
  ligne: 'Relie vos logiciels, contrôle chaque import et prépare accès, sauvegardes et migrations ; votre administrateur applique.',
  frontiereEnBref: [
    'Préparer fichiers d’import, listes d’accès et réponses de support',
    'Chaque import avant intégration',
    'Les droits d’administration et la sécurité',
  ],
  familles: [
    'integration-connecteurs', 'exports-imports-logiciels', 'excel-classeurs-suivi', 'comptes-acces',
    'sauvegardes-mises-a-jour', 'support-outils', 'migrations-reprises', 'inventaire-outils', 'complements-excel',
  ],
  servicesLies: [],
  logiciels: [
    'Microsoft Excel', 'Microsoft SharePoint', 'Microsoft OneDrive', 'Google Drive', 'Microsoft Outlook', 'Gmail',
    'Cegid Loop', 'Sage 100 Comptabilité', 'ACD COMPTA', 'Pennylane', 'EBP Comptabilité', 'Silae', 'Planity',
    'PrestaShop',
  ],
  avatar: { src: '/agents/informatique-outils-256.webp', alt: 'Figurine Memlia, agent IA informatique outils.' },
  demonstration: {
    tache: 'import contrôlé',
    dossier: 'Dossier fictif : l’Épicerie Bergeronnette, SARL inventée, export de caisse de septembre 2026 vers le logiciel comptable du cabinet.',
    regle: 'Un export entre dans le fichier d’import quand ses colonnes correspondent au schéma écrit, que sa période est celle demandée et qu’aucune de ses lignes n’a déjà été importée. Un schéma modifié par l’éditeur, une période différente ou un compte absent du plan du dossier arrête la ligne ou le fichier, et le présente au collaborateur.',
    cas: [
      { cas: 'Export de septembre au schéma attendu', sortie: 'Fichier d’import préparé ; totaux par jour égaux à ceux de l’export', issue: 'Préparé' },
      { cas: 'Le même export déposé une seconde fois', sortie: 'Aucune ligne nouvelle ; dépôt signalé comme déjà importé', issue: 'Préparé' },
      { cas: 'Moyen de paiement nouveau (titres-restaurant dématérialisés), absent du plan de comptes du dossier', sortie: 'Lignes isolées, compte à créer proposé', issue: 'À valider' },
      { cas: 'Colonne « TVA » renommée après une mise à jour du logiciel de caisse', sortie: 'Aucun fichier préparé. Motif : schéma modifié par l’éditeur', issue: 'Arrêt' },
    ],
  },
};
