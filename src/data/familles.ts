/**
 * Taxonomie éditoriale v3 : les familles de tâches d'un cabinet d'expertise comptable.
 *
 * Un « pôle » est l'un des clusters du schéma du blog (`cluster` dans src/content.config.ts) ;
 * une « famille » est la maille éditoriale : un groupe de tâches qui se répètent, se décrivent
 * par une règle et s'automatisent (ou non) de la même manière. Chaque article porte une famille
 * (`famille` du frontmatter) ; le pilier « la carte des tâches » les liste toutes.
 *
 * Source de vérité unique : lue par le schéma du blog, par le hub Ressources, par le plan de
 * cluster (docs/strategy/site-v3/build-cluster-plan.py) et par les tests.
 */
export const PROFESSIONS = ['ec', 'cac'] as const;
export type Profession = (typeof PROFESSIONS)[number];
export const PROFESSION_PAR_DEFAUT: Profession = 'ec';
export const estProfession = (valeur: unknown): valeur is Profession =>
  typeof valeur === 'string' && (PROFESSIONS as readonly string[]).includes(valeur);

export type PoleId =
  | 'production-comptable' | 'portefeuille-echeances' | 'paie-social' | 'juridique-fiscal'
  | 'facturation-recouvrement' | 'administratif-secretariat' | 'rh-formation' | 'numerique-it-data'
  | 'excel-outils-existants' | 'methode-decision-humaine' | 'conseil-missions' | 'audit-cac'
  | 'certification' | 'interventions-legales' | 'sacc' | 'durabilite' | 'administration';

export interface Famille {
  id: string;
  profession: Profession;
  libelle: string;
  pole: PoleId;
  /** Ce que la famille recouvre, en une phrase : sert de chapeau dans le pilier et le hub. */
  description: string;
  /** `false` : aucune tâche documentée ni module ; la famille reste listée, pas ouverte. */
  active: boolean;
}

export const POLES: Record<PoleId, { libelle: string; couleur: string }> = {
  'production-comptable': { libelle: 'Production comptable', couleur: '#1c8a41' },
  'portefeuille-echeances': { libelle: 'Portefeuille et échéances', couleur: '#0e7490' },
  'paie-social': { libelle: 'Paie et social', couleur: '#be123c' },
  'juridique-fiscal': { libelle: 'Juridique et fiscal', couleur: '#4b5563' },
  'facturation-recouvrement': { libelle: 'Facturation et recouvrement du cabinet', couleur: '#b5651d' },
  'administratif-secretariat': { libelle: 'Administration et secrétariat', couleur: '#6d28d9' },
  'rh-formation': { libelle: 'RH et formation', couleur: '#9d174d' },
  'numerique-it-data': { libelle: 'Numérique, IT et data', couleur: '#1d4ed8' },
  'excel-outils-existants': { libelle: 'Excel et outils existants', couleur: '#a16207' },
  'methode-decision-humaine': { libelle: 'Méthode et décision humaine', couleur: '#27b657' },
  'conseil-missions': { libelle: 'Conseil et missions spéciales', couleur: '#0f766e' },
  'audit-cac': { libelle: 'Audit et commissariat aux comptes', couleur: '#78716c' },
  'certification': { libelle: 'Certification des comptes', couleur: '#0e7490' },
  'interventions-legales': { libelle: 'Interventions légales', couleur: '#6d28d9' },
  'sacc': { libelle: 'Services autres que la certification', couleur: '#0f766e' },
  'durabilite': { libelle: 'Durabilité (conditionnelle)', couleur: '#78716c' },
  'administration': { libelle: 'Administration et direction CAC', couleur: '#b5651d' },
};

const f = (id: string, libelle: string, pole: PoleId, description: string, active = true, profession: Profession = PROFESSION_PAR_DEFAUT): Famille => ({ id, libelle, pole, description, active, profession });

export const FAMILLES: readonly Famille[] = [
  // Production comptable : de la pièce reçue au bilan livré.
  f('collecte-pieces', 'Collecte et relance des pièces', 'production-comptable', 'Obtenir les pièces attendues d’un dossier, relancer ce qui manque, s’arrêter à réception.'),
  f('saisie-ocr', 'Saisie, OCR et pré-comptabilité', 'production-comptable', 'Lire les pièces, extraire les champs, pré-imputer, et faire remonter ce que la lecture n’a pas su traiter.'),
  f('banque-rapprochement', 'Relevés bancaires et rapprochement', 'production-comptable', 'Récupérer les relevés, rapprocher les mouvements des écritures, typer les écarts.'),
  f('lettrage', 'Lettrage des comptes de tiers', 'production-comptable', 'Apparier factures et règlements selon des règles écrites, isoler les cas de refus.'),
  f('achats-fournisseurs', 'Factures d’achat et fournisseurs', 'production-comptable', 'Suivre les factures d’achat, les avoirs, les échéances fournisseurs et les doublons.'),
  f('ventes-caisse', 'Ventes, caisse et journaux de vente', 'production-comptable', 'Importer les ventes (caisse, e-commerce, facturation client) sans ressaisie et contrôler les écarts.'),
  f('notes-de-frais', 'Notes de frais', 'production-comptable', 'Traiter les justificatifs de frais, extraire, contrôler, faire remonter les exceptions.'),
  f('immobilisations-emprunts', 'Immobilisations, amortissements et emprunts', 'production-comptable', 'Tenir les tableaux d’amortissement et d’emprunt, générer les écritures récurrentes, contrôler les soldes.'),
  f('revision-cycles', 'Révision par cycles et justification des soldes', 'production-comptable', 'Rejouer les contrôles répétitifs de la révision, justifier chaque solde, tracer les écritures d’inventaire.'),
  f('cloture-bilan', 'Clôture, bilan et plaquette', 'production-comptable', 'Dérouler la clôture, produire les états et la plaquette, contrôler avant livraison.'),
  f('situations-reporting-client', 'Situations intermédiaires et reporting client', 'production-comptable', 'Produire des situations et tableaux de bord clients à partir de la comptabilité tenue.'),
  f('facture-electronique', 'Facture électronique et e-reporting', 'production-comptable', 'Recevoir, transmettre et archiver les factures électroniques ; ce que la réforme change dans la collecte.'),
  f('ged-dossier-permanent', 'GED, dossier permanent et nommage des pièces', 'production-comptable', 'Classer, nommer et retrouver les pièces et le dossier permanent sans reclasser à la main.'),
  // Portefeuille et échéances : piloter la production sans classer les personnes.
  f('echeances-fiscales', 'Calendrier et échéances fiscales du portefeuille', 'portefeuille-echeances', 'Tenir, par dossier, les échéances déclaratives et de paiement, avec alertes agrégées.'),
  f('teledeclarations-rejets', 'Télédéclarations et rejets', 'portefeuille-echeances', 'Suivre les envois EDI et EFI, leurs accusés et leurs rejets, jusqu’à la correction.'),
  f('suivi-dossiers-etats', 'Suivi des dossiers par état', 'portefeuille-echeances', 'Connaître l’étape et les exceptions de chaque dossier dans un classeur, sans reconstruire.'),
  f('tableau-de-bord-production', 'Tableau de bord de production', 'portefeuille-echeances', 'Agréger l’avancement et les retards du portefeuille en indicateurs non nominatifs.'),
  f('planification-charge', 'Plan de charge et affectation', 'portefeuille-echeances', 'Répartir les dossiers et les périodes de pointe sans surveiller les personnes.'),
  // Paie et social : les modules livrés, et ce qui les entoure.
  f('variables-de-paie', 'Collecte des variables de paie', 'paie-social', 'Obtenir chaque mois les variables des clients, relancer, contrôler avant le bulletin.'),
  f('bulletins-controle', 'Bulletins et contrôles avant et après paie', 'paie-social', 'Contrôler la cohérence des bulletins avant le dépôt et après le calcul.'),
  f('dsn-crm', 'DSN et comptes rendus métier', 'paie-social', 'Préparer, contrôler et déposer la DSN ; lire et traiter les retours.'),
  f('entrees-sorties-salaries', 'Entrées, sorties et attestations', 'paie-social', 'DPAE, contrats, soldes de tout compte, attestations : préparer sans ressaisir.'),
  f('absences-ijss', 'Absences, arrêts et IJSS', 'paie-social', 'Suivre les absences, les arrêts et les indemnités journalières, et leurs pièces.'),
  f('charges-sociales-echeances', 'Charges sociales et échéances', 'paie-social', 'Suivre les échéances Urssaf et caisses par dossier, préparer les règlements.'),
  f('suivi-production-sociale', 'Suivi de la production sociale', 'paie-social', 'Piloter le pôle social par dossier et par étape, en agrégats, jamais par personne.'),
  // Juridique et fiscal.
  f('tva', 'TVA : préparation et contrôles', 'juridique-fiscal', 'Préparer la déclaration, contrôler la cohérence, tracer ce qui a été vérifié.'),
  f('is-acomptes', 'Impôt sur les sociétés, acomptes et soldes', 'juridique-fiscal', 'Calculer et suivre acomptes et soldes par dossier, préparer les déclarations.'),
  f('declarations-annexes', 'Déclarations annexes', 'juridique-fiscal', 'CFE, CVAE, DAS2, IFU, taxes sur les véhicules : préparer et suivre sans oubli.'),
  f('secretariat-juridique', 'Approbation des comptes et secrétariat juridique', 'juridique-fiscal', 'Préparer AG, procès-verbaux et dépôt des comptes, à partir des données tenues.'),
  f('formalites-creation-modification', 'Création, modifications et formalités', 'juridique-fiscal', 'Constituer les dossiers de formalités et suivre leur avancement.'),
  f('registres-obligations', 'Registres et obligations périodiques', 'juridique-fiscal', 'Tenir registres, bénéficiaires effectifs et obligations récurrentes par dossier.'),
  f('lettre-de-mission-lcbft', 'Lettre de mission et vigilance', 'juridique-fiscal', 'Rédiger, faire signer, renouveler la lettre de mission ; tenir la vigilance LCB-FT.'),
  // Facturation et recouvrement du cabinet.
  f('honoraires-facturation', 'Honoraires et actes hors forfait', 'facturation-recouvrement', 'Facturer les honoraires mensualisés et les actes hors forfait, une seule fois.'),
  f('prelevements-encaissements', 'Prélèvements, encaissements et rejets', 'facturation-recouvrement', 'Constituer les lots de prélèvement, détecter les rejets, proposer les échéanciers.'),
  f('relances-impayes', 'Relances d’impayés', 'facturation-recouvrement', 'Relancer au bon stade depuis les messages types du cabinet, valider avant envoi.'),
  f('rentabilite-dossiers', 'Temps, rentabilité et sous-facturation', 'facturation-recouvrement', 'Mesurer coût, marge et écarts de tarif par dossier, en agrégats.'),
  // Administration et secrétariat.
  f('boite-mail-courriers', 'Boîte mail, tri et courriers types', 'administratif-secretariat', 'Assainir et tenir le tri par client et par priorité ; préparer les courriers types.'),
  f('onboarding-client', 'Entrée en relation et onboarding client', 'administratif-secretariat', 'Collecter les pièces d’entrée, poser les jalons, préparer ce qui attend la signature.'),
  f('offboarding-transfert', 'Fin de mission et transfert de dossier', 'administratif-secretariat', 'Clore une mission et transférer le dossier au confrère sans rien oublier.'),
  f('envois-plaquettes-documents', 'Envois de plaquettes et de documents', 'administratif-secretariat', 'Suivre l’envoi des plaquettes, attestations et documents périodiques.'),
  f('rendez-vous-agenda', 'Rendez-vous et agenda du cabinet', 'administratif-secretariat', 'Préparer les rendez-vous périodiques et leurs pièces ; tenir l’agenda partagé.'),
  // RH et formation.
  f('rh-interne-cabinet', 'RH interne du cabinet', 'rh-formation', 'Recrutement, arrivée d’un collaborateur, entretiens : préparer sans reconstruire.'),
  f('synthese-remuneration', 'Synthèse de rémunération', 'rh-formation', 'Produire la synthèse annuelle d’un salarié à partir de la paie tenue.'),
  f('formation-ia-competences', 'Formation et maîtrise de l’IA', 'rh-formation', 'Former l’équipe aux outils et à leurs limites ; tenir la preuve de la formation.'),
  // Numérique, IT et data.
  f('ia-generative-agents', 'IA générative et agents', 'numerique-it-data', 'Ce que l’IA prépare, ce qu’elle ne décide pas ; agents, assistants, modèles locaux.'),
  f('rgpd-secret-securite', 'RGPD, secret professionnel et sécurité', 'numerique-it-data', 'Données, sous-traitance, hébergement, accès : le cadre de toute automatisation.'),
  f('integration-connecteurs', 'Connecteurs, imports et synchronisation', 'numerique-it-data', 'Relier les logiciels par API ou par fichiers, sans ressaisie ni double écriture.'),
  f('ai-act-conformite', 'AI Act et conformité des outils', 'numerique-it-data', 'Les obligations qui s’appliquent à un cabinet utilisateur d’IA, datées et sourcées.'),
  // Excel et outils existants.
  f('excel-classeurs-suivi', 'Classeurs de suivi Excel', 'excel-outils-existants', 'Structurer et entretenir un classeur de suivi partagé : dictionnaire, états, contrôles.'),
  f('complements-excel', 'Compléments greffés sur Excel', 'excel-outils-existants', 'Automatiser dans le classeur existant par un complément, sans macro ni migration.'),
  f('exports-imports-logiciels', 'Exports et imports des logiciels', 'excel-outils-existants', 'Importer un export logiciel sans ressaisie, contrôler son schéma, rejouer sans doublon.'),
  // Méthode et décision humaine.
  f('choisir-cadrer', 'Choisir et cadrer une automatisation', 'methode-decision-humaine', 'Qualifier les tâches candidates, choisir la première, écrire le cadre.'),
  f('regle-jeu-essai-recette', 'Règle, jeu d’essai et recette', 'methode-decision-humaine', 'Écrire la règle dans les mots du cabinet, la rejouer sur un jeu fictif, la recetter.'),
  f('validation-humaine-refus', 'Validation humaine et cas de refus', 'methode-decision-humaine', 'Où va la validation, ce que l’outil refuse, comment les exceptions remontent.'),
  f('mesure-roi', 'Mesurer le temps gagné', 'methode-decision-humaine', 'Mesurer avant et après sur un jeu fictif ; ne pas reprendre de chiffre non mesuré.'),
  // Conseil et missions spéciales.
  f('previsionnel-business-plan', 'Prévisionnel et business plan', 'conseil-missions', 'Produire un prévisionnel à partir des données tenues, avec hypothèses tracées.'),
  f('tresorerie-previsionnelle', 'Trésorerie prévisionnelle', 'conseil-missions', 'Projeter la trésorerie d’un client depuis les échéances connues, signaler les tensions.'),
  f('financement-aides', 'Financement et aides', 'conseil-missions', 'Constituer les dossiers de financement et d’aides à partir du dossier permanent.'),
  f('evaluation-transmission', 'Évaluation et transmission', 'conseil-missions', 'Préparer les éléments chiffrés d’une évaluation ou d’une transmission.'),
  // Audit et commissariat aux comptes : listé, pas ouvert.
  f('audit-legal', 'Audit légal', 'audit-cac', 'Aucun besoin documenté, aucun module : famille listée, non ouverte.', false),
  // CAC : ouverture éditoriale interne C1 + C2, pas autorisation de publication.
  f('cac-fec-reception', 'Réception du FEC', 'certification', 'Constater la réception et les défauts du fichier avant les travaux, sans conclure sur les comptes.', true, 'cac'),
  f('cac-demandes-documents', 'Demandes de documents', 'certification', 'Préparer la liste par cycle, suivre les manquants et proposer les relances au chef de mission.', true, 'cac'),
  f('cac-revue-analytique', 'Revue analytique', 'certification', 'Comparer les exercices et préparer les variations à expliquer, sans décider de leur portée.', true, 'cac'),
  f('cac-rapport-certification', 'Synthèse et lettre d’affirmation', 'certification', 'Reporter les observations dans un projet et suivre la lettre, en laissant opinion et signature au CAC.', true, 'cac'),
  f('cac-confirmations-audit', 'Confirmations de tiers', 'certification', 'Préparer les demandes, suivre les réponses et rapprocher les écarts, sélection et conclusion humaines.', true, 'cac'),
  f('cac-revue-ecritures', 'Sélection des écritures', 'certification', 'Rejouer les critères écrits du cabinet et présenter chaque écriture avec la raison du signal.', true, 'cac'),
  f('cac-dossier-de-travail', 'Dossier de travail', 'certification', 'Assembler les feuilles par cycle, indexer les justificatifs et préserver les contributions.', true, 'cac'),
  f('cac-rapport-apports-fusion', 'Apports et fusion', 'interventions-legales', 'Préparer les données du traité et les renvois du rapport ; demande praticien non étayée en C2.', false, 'cac'),
  f('cac-rapport-reduction-capital', 'Réduction de capital', 'interventions-legales', 'Préparer le projet et ses pièces ; demande propre non mesurée.', false, 'cac'),
  f('cac-rapport-suppression-dps', 'Suppression du DPS', 'interventions-legales', 'Distinguer les versions et destinataires du rapport ; demande propre non mesurée.', false, 'cac'),
  f('cac-rapport-transformation', 'Transformation', 'interventions-legales', 'Assembler les pièces et préparer le rapport ; demande propre non mesurée.', false, 'cac'),
  f('cac-attestation-remunerations', 'Attestation des rémunérations', 'interventions-legales', 'Préparer la concordance avec les comptes ; demande propre non mesurée.', false, 'cac'),
  f('cac-attestations-chiffres', 'Attestations de chiffres', 'sacc', 'Rapprocher les chiffres et leurs pièces dans le contexte du demandeur ; demande propre non mesurée.', false, 'cac'),
  f('cac-procedures-convenues', 'Procédures convenues', 'sacc', 'Préparer les constats factuels selon les procédures convenues ; demande propre non mesurée.', false, 'cac'),
  f('cac-audit-contractuel', 'Audit contractuel', 'sacc', 'Préparer les travaux dans un périmètre explicitement demandé ; demande propre non mesurée.', false, 'cac'),
  f('cac-attestation-depenses-subventionnees', 'Dépenses subventionnées', 'sacc', 'Relier les dépenses aux justificatifs et au compte rendu ; demande propre non mesurée.', false, 'cac'),
  f('cac-durabilite-indicateurs', 'Indicateurs de durabilité', 'durabilite', 'Conditionnelle : relier les indicateurs aux pièces ; marché CAC non validé.', false, 'cac'),
  f('cac-processus-informations-publiees', 'Choix des informations publiées', 'durabilite', 'Conditionnelle : documenter les informations retenues ; marché CAC non validé.', false, 'cac'),
  f('cac-informations-taxinomie', 'Informations de taxinomie', 'durabilite', 'Conditionnelle : préparer les concordances ; marché CAC non validé.', false, 'cac'),
  f('cac-suivi-mandats', 'Mandats et préparation du déclaratif', 'administration', 'Tenir les repères du mandat et préparer les données déclaratives, sans dépôt automatique.', true, 'cac'),
  f('cac-relance-honoraires', 'Relance des honoraires', 'administration', 'Préparer les relances ; terrain proxy EC et demande CAC non étayée.', false, 'cac'),
  f('cac-acceptation-mandats', 'Acceptation et maintien', 'administration', 'Assembler les éléments pour la décision du signataire ; C2 réglementaire trop indirect pour ouvrir.', false, 'cac'),
  f('cac-planification-missions', 'Planification des missions', 'administration', 'Préparer les affectations par mission ; demande propre non mesurée.', false, 'cac'),
  f('cac-declarations-de-la-profession', 'Déclarations professionnelles', 'administration', 'Geste traité dans la famille mandats, pas de cluster autonome ni de dépôt promis.', false, 'cac'),
  f('cac-heures-realisees', 'Heures et budgets', 'administration', 'Comparer les temps déjà saisis ; barème distinct du réalisé, demande propre non mesurée.', false, 'cac'),
];

export const IDS_FAMILLES = FAMILLES.map((famille) => famille.id) as [string, ...string[]];
export const IDS_POLES = Object.keys(POLES) as [PoleId, ...PoleId[]];
export const familleParId = (id: string): Famille | undefined => FAMILLES.find((famille) => famille.id === id);
export const famillesDuPole = (pole: PoleId): Famille[] => FAMILLES.filter((famille) => famille.pole === pole);
export const famillesDeLaProfession = (profession: Profession = PROFESSION_PAR_DEFAUT): Famille[] => FAMILLES.filter((famille) => famille.profession === profession);
