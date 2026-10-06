# Calendrier éditorial v3 — quinze articles et une Cicatrice par semaine au plus

Généré le 06/10/2026 par `build-cluster-plan.py` depuis `backlog-v3.json` : ne pas éditer à la main, corriger le backlog ou la taxonomie puis régénérer. Décision de Kevin du 05/10 appliquée le 06/10 : quinze articles ordinaires par semaine ISO, trois par jour au plus du lundi au vendredi, EC et CAC confondus, plus une Cicatrice le samedi. Les dates sont des créneaux de production, pas des promesses : un article qui n'atteint pas le gate attend le créneau suivant, et le backlog se réordonne à chaque signal (impressions Search Console par famille, demandes de contact citant une tâche).

## Règles

- Les priorités 1 → 3 restent celles du backlog (1 : la requête primaire a des suggestions d'autocomplétion Google, sauf l'angle IA publié conservé en P1 : primaire à zéro le 21/09 dans `titres-intent-2026-09-21.json`, secondaires non mesurées, questions de la SERP par famille du 19/09 dans `questions-2026-09-19.json` ; 2 : seule une requête secondaire en a ; 3 : aucune suggestion relevée sur les formulations testées — relevé `scripts/seo/questions.mjs`). --check contrôle aussi les P1 publiées du backlog sans réécrire les publications ; les trois historiques synthétiques et la série sont hors gate. Ce signal ne permet de conclure ni au volume de recherche, ni à la demande, ni à l’audience ; une formulation non mesurée ne vaut pas zéro suggestion. Ces priorités guident l'ordre des candidats compatibles avec l'alternance ; l'équilibre du stock de formats peut différer une priorité 1 sans changer sa mesure ni son angle.
- Les créneaux ordinaires non figés alternent pôle et format entre deux articles successifs ; les dates publiées et `datePlanifiee` ne bougent jamais. Si un conflit daté est inévitable, `exceptionAlternance` dans le backlog désigne séparément `pole` ou `format`, chacun avec `date` (YYYY-MM-DD) et `raison` non vide ; seul le champ effectivement en conflit à cette date est dispensé. La série factuelle Cicatrices ne peut pas porter cette exception.
- Chaque famille active conserve ses quatre angles (méthode, contrôle ou checklist, exceptions et refus, définition) ; leur ordre de sortie dépend des contraintes de calendrier et du stock disponible.
- Une requête primaire par article, unique ; sources officielles obligatoires pour toute matière paie, sociale, fiscale, juridique ou données.
- Le pilier reçoit un lien à chaque publication (republication scellée par la forge).

- Une Cicatrice factuelle peut paraître le samedi, au plus une par semaine ISO, en sus du plafond des quinze articles ordinaires ; sans faits signés ni recette, le créneau reste vide. `manque` désigne une date échue conservée en trace, pas une publication.

- Les anciennes réservations ordinaires manquées restent dans `dateManquee` du backlog ; leur date proposée au statut `a-replanifier` n’est pas actionnable. Une décision humaine fixe une nouvelle `datePlanifiee`, soumise aux portes de qualité et au quota du jour réel.

- Rattrapage IA historique : `rattrapage-ia-2026-10-05.json` rattache quatre sujets à 2026-W40, avec dates réelles 04/10 et 05/10. Le 05/10 accepte trois articles uniquement de ce lot. Ils ne consomment pas les quinze nouveaux sujets W41 ; le jour réel reste occupé. Archives antérieures et Cicatrices inchangées.

## Volume

- 281 satellites + 1 pilier ; 15 satellite(s) publié(s) dans le registre au 06/10/2026 ; dernier créneau planifié : 2027-02-03.

## Semaine par semaine

### Semaine 2026-W37

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-09 | [Comment contrôler les bulletins de paie avant la DSN ?](/blog/controler-les-bulletins-de-paie-avant-la-dsn) | Bulletins et contrôles avant et après paie | Paie et social | how-to-guide | 1 | published |
| 2026-09-09 | [Tableau de bord paie Excel en cabinet : suivre sans surveiller](/blog/suivre-la-production-sociale-dans-excel) | Suivi de la production sociale | Paie et social | how-to-guide | 1 | published |

### Semaine 2026-W38

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-15 | [Comprendre les comptes rendus métier DSN : méthode de lecture](/blog/comprendre-les-comptes-rendus-metier-dsn) | DSN et comptes rendus métier | Paie et social | how-to-guide | 1 | published |
| 2026-09-16 | [Automatiser la relance des pièces clients manquantes](/blog/automatiser-la-relance-des-pieces-clients) | Collecte et relance des pièces | Production comptable | how-to-guide | 3 | published |
| 2026-09-16 | [Automatiser un cabinet comptable : la carte des tâches](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches) | Choisir et cadrer une automatisation | Méthode et décision humaine | pillar-page | 1 | published |
| 2026-09-17 | [Automatiser la saisie comptable : ce qui reste à vérifier](/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier) | Saisie, OCR et pré-comptabilité | Production comptable | how-to-guide | 3 | published |
| 2026-09-19 | [Pourquoi un cabinet n’adopte pas un outil : la leçon de mon échec](/blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils) | Choisir et cadrer une automatisation | Méthode et décision humaine | thought-leadership | 3 | published |

### Semaine 2026-W39

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-21 | [Charge de travail en cabinet comptable : où passe le temps ?](/blog/cabinet-comptable-surcharge-de-travail-ou-passe-le-temps) | Plan de charge et affectation | Portefeuille et échéances | how-to-guide | 1 | published |
| 2026-09-21 | [Intelligence artificielle et métier comptable : compétences humaines](/blog/intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain) | Formation et maîtrise de l’IA | RH et formation | thought-leadership | 1 | published |
| 2026-09-22 | Ancien créneau manqué de « Prompt ChatGPT expert comptable : écrire des consignes qui tiennent sur les dossiers » — trace, non actionnable | — | — | — | — | manque |
| 2026-09-24 | Ancien créneau manqué de « Logiciel IA comptabilité : comparer l’outil à la tâche du cabinet » — trace, non actionnable | — | — | — | — | manque |

### Semaine 2026-W40

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-29 | [Logiciel IA comptabilité : comparer l’outil à la tâche du cabinet](/blog/logiciel-ia-comptabilite) | IA générative et agents | Numérique, IT et data | faq-knowledge | 1 | published |
| 2026-09-29 | [Prompt ChatGPT expert comptable : écrire des consignes qui tiennent sur les dossiers](/blog/prompt-chatgpt-expert-comptable) | IA générative et agents | Numérique, IT et data | how-to-guide | 1 | published |
| 2026-09-29 | Ancien créneau manqué de « IA cabinet comptable : ce qu’elle prépare, ce que vous décidez » — trace, non actionnable | — | — | — | — | manque |
| 2026-10-02 | [Pourquoi des tests verts manquent des défauts : la règle des trois passes](/blog/tests-verts-et-regle-des-trois-passes) | Règle, jeu d’essai et recette | Méthode et décision humaine | thought-leadership | 3 | published |
| 2026-10-03 | [Pourquoi une installation logicielle échoue en cabinet : le test qui a tranché](/blog/l-outil-qui-ne-se-chargeait-jamais) | Connecteurs, imports et synchronisation | Numérique, IT et data | thought-leadership | 3 | manque |
| 2026-10-04 | [Utiliser ChatGPT en cabinet comptable : choisir un premier usage utile](/blog/utiliser-chatgpt-cabinet-comptable) | IA générative et agents | Numérique, IT et data | how-to-guide | 3 | published |

### Semaine 2026-W41

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-10-05 | [Automatiser avec l'IA sans changer de logiciel : écrire le passage entre les outils](/blog/automatiser-avec-ia-sans-changer-logiciel) | IA générative et agents | Numérique, IT et data | how-to-guide | 3 | published |
| 2026-10-05 | [IA en cabinet comptable : préparer les données sans perdre leur confidentialité](/blog/ia-comptabilite-confidentialite-donnees) | RGPD, secret professionnel et sécurité | Numérique, IT et data | how-to-guide | 3 | published |
| 2026-10-05 | [Vérifier une réponse IA en comptabilité : une checklist avant utilisation](/blog/verifier-reponse-ia-comptabilite) | IA générative et agents | Numérique, IT et data | how-to-guide | 3 | published |
| 2026-10-06 | [Automatiser l'entrée en relation d'un nouveau client](/blog/automatiser-l-entree-en-relation-d-un-nouveau-client) | Entrée en relation et onboarding client | Administration et secrétariat | listicle-checklist | 1 | planned |
| 2026-10-06 | [Rapprochement bancaire automatisé : les écarts à remonter](/blog/rapprochement-bancaire-automatise-les-ecarts-a-remonter) | Relevés bancaires et rapprochement | Production comptable | how-to-guide | 1 | planned |
| 2026-10-06 | [Date limite de dépôt de la DSN mensuelle : la checklist avant le 5 ou le 15](/blog/checklist-avant-le-depot-mensuel-de-la-dsn) | DSN et comptes rendus métier | Paie et social | listicle-checklist | 1 | planned |
| 2026-10-07 | [FEC contrôle : préparer le constat de réception pour la mission CAC](/blog/cac-reception-fec-constat) | Réception du FEC | Certification des comptes | tutorial | 1 | planned |
| 2026-10-07 | [Calendrier fiscal d'un cabinet comptable : suivre les échéances d'un portefeuille](/blog/suivre-les-echeances-fiscales-d-un-portefeuille) | Calendrier et échéances fiscales du portefeuille | Portefeuille et échéances | how-to-guide | 1 | planned |
| 2026-10-07 | [Mentions obligatoires de la facture électronique : la checklist avant le passage](/blog/checklist-de-conformite-avant-le-passage-a-la-facture-electronique) | Facture électronique et e-reporting | Production comptable | listicle-checklist | 1 | planned |
| 2026-10-08 | [Manuel de procédures d'un cabinet d'expertise comptable : écrire les règles qui tournent](/blog/manuel-de-procedures-cabinet-expertise-comptable-ecrire-les-regles-qui-tournent) | Règle, jeu d’essai et recette | Méthode et décision humaine | how-to-guide | 1 | planned |
| 2026-10-08 | [Qu'est-ce que le rapprochement bancaire, en comptabilité ?](/blog/qu-est-ce-que-le-rapprochement-bancaire-en-comptabilite) | Relevés bancaires et rapprochement | Production comptable | faq-knowledge | 1 | planned |
| 2026-10-08 | [Seuil de signification en audit : documenter un exemple de choix](/blog/cac-seuil-signification-justification) | Revue analytique | Certification des comptes | how-to-guide | 1 | planned |
| 2026-10-09 | [Documents obligatoires en fin de contrat : la checklist de sortie d'un salarié](/blog/checklist-de-sortie-d-un-salarie-documents-et-delais) | Entrées, sorties et attestations | Paie et social | listicle-checklist | 1 | planned |
| 2026-10-09 | [Circularisation commissaire aux comptes : préparer et suivre une campagne](/blog/cac-circularisation-campagne) | Confirmations de tiers | Certification des comptes | tutorial | 1 | planned |
| 2026-10-09 | [Mise au rebut d'une immobilisation : ce qu'un tableau d'amortissement ne tranche pas](/blog/cession-et-mise-au-rebut-ce-qu-un-tableau-d-amortissement-automatique-ne-tranche-pas) | Immobilisations, amortissements et emprunts | Production comptable | how-to-guide | 1 | planned |
| 2026-10-10 | [Pourquoi un build réussi ne prouve pas qu’une application démarre](/blog/build-reussi-application-ne-demarre-pas) | Connecteurs, imports et synchronisation | Numérique, IT et data | thought-leadership | 3 | planned |

### Semaine 2026-W42

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-10-12 | [Test des écritures de journal en audit FEC : rejouer les critères du cabinet](/blog/cac-ecritures-journal-criteres) | Sélection des écritures | Certification des comptes | tutorial | 3 | planned |
| 2026-10-12 | [Rupture conventionnelle : délai d'homologation, ce qu'un générateur ne boucle pas seul](/blog/les-ruptures-de-contrat-qu-un-generateur-automatique-de-documents-ne-doit-pas-boucler-seul) | Entrées, sorties et attestations | Paie et social | how-to-guide | 1 | planned |
| 2026-10-12 | [FEC conforme : pourquoi la structure ne conclut pas sur les comptes](/blog/cac-fec-controle-structure-limites) | Réception du FEC | Certification des comptes | faq-knowledge | 1 | planned |
| 2026-10-13 | [Majoration de retard Urssaf : le calcul, et ce qu'un suivi automatique doit signaler](/blog/retard-ou-erreur-de-cotisation-ce-qu-un-suivi-automatique-doit-toujours-signaler) | Charges sociales et échéances | Paie et social | how-to-guide | 1 | planned |
| 2026-10-13 | [Avenant à la lettre de mission : ce qui se prépare seul, ce qui attend la signature](/blog/checklist-avant-le-renouvellement-d-une-lettre-de-mission) | Lettre de mission et vigilance | Juridique et fiscal | listicle-checklist | 1 | planned |
| 2026-10-13 | [Dossier CAC partagé : reprendre les contributions sans écraser les saisies](/blog/cac-contributions-dossier-preservation) | Dossier de travail | Certification des comptes | how-to-guide | 3 | planned |
| 2026-10-14 | [CRM DSN de substitution : ce que le compte rendu remplace, et ce qu'il faut refaire](/blog/crm-dsn-de-substitution-ce-que-le-compte-rendu-remplace-et-ce-qu-il-faut-refaire) | DSN et comptes rendus métier | Paie et social | faq-knowledge | 1 | planned |
| 2026-10-14 | [Automatisation en cabinet CAC : la carte des tâches et des décisions humaines](/blog/automatiser-un-cabinet-cac-la-carte-des-taches) | Dossier de travail | Certification des comptes | pillar-page | 3 | planned |
| 2026-10-14 | [Changement de bénéficiaire effectif : ce qu'une mise à jour ne déclare pas seule](/blog/changement-de-beneficiaire-effectif-ce-qu-une-mise-a-jour-automatique-ne-declare-pas-seule) | Registres et obligations périodiques | Juridique et fiscal | how-to-guide | 1 | planned |
| 2026-10-15 | [FEC non conforme : tracer les défauts et demander un nouvel export](/blog/cac-fec-non-conforme-traitement) | Réception du FEC | Certification des comptes | listicle-checklist | 1 | planned |
| 2026-10-15 | [Déclaration de soupçon Tracfin : ce qu'un suivi de mission ne décide jamais seul](/blog/vigilance-lcb-ft-ce-qu-un-suivi-automatique-de-mission-ne-decide-jamais-seul) | Lettre de mission et vigilance | Juridique et fiscal | how-to-guide | 1 | planned |
| 2026-10-15 | [Procédures analytiques en audit : distinguer préparation et conclusion](/blog/cac-revue-analytique-procedures) | Revue analytique | Certification des comptes | faq-knowledge | 1 | planned |
| 2026-10-16 | [Proposer un échéancier de paiement à un client : la proposition, puis la validation](/blog/les-echeanciers-de-regularisation-qu-un-outil-ne-doit-jamais-proposer-sans-validation) | Prélèvements, encaissements et rejets | Facturation et recouvrement du cabinet | how-to-guide | 1 | planned |
| 2026-10-16 | [Réponse à la circularisation fournisseurs : rapprocher avant de clôturer](/blog/cac-circularisation-reponse-rapprochement) | Confirmations de tiers | Certification des comptes | listicle-checklist | 1 | planned |
| 2026-10-16 | [Fin de mandat CAC : préparer le transfert sans conclure sur le renouvellement](/blog/cac-fin-mandat-transfert) | Mandats et préparation du déclaratif | Administration et direction CAC | how-to-guide | 1 | planned |
| 2026-10-17 | [Pourquoi zéro erreur ne prouve pas une collecte complète : sept pages manquaient](/blog/zero-erreur-collecte-incomplete) | Règle, jeu d’essai et recette | Méthode et décision humaine | thought-leadership | 3 | planned |

### Semaine 2026-W43

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-10-19 | [Caisses de retraite complémentaire obligatoires : ce que le cabinet suit par dossier](/blog/quelles-charges-sociales-un-cabinet-doit-il-suivre-pour-chaque-dossier) | Charges sociales et échéances | Paie et social | faq-knowledge | 1 | planned |
| 2026-10-19 | [Procédures alternatives à la circularisation : documenter le relais humain](/blog/cac-circularisation-alternatives) | Confirmations de tiers | Certification des comptes | how-to-guide | 1 | planned |
| 2026-10-19 | [Déclaration d’activité CAC : rapprocher les données avant le dépôt humain](/blog/cac-declaration-activite-preparation) | Mandats et préparation du déclaratif | Administration et direction CAC | listicle-checklist | 1 | planned |
| 2026-10-20 | [Automatiser la tenue des registres et du registre des bénéficiaires effectifs](/blog/automatiser-la-tenue-des-registres-et-du-registre-des-beneficiaires-effectifs) | Registres et obligations périodiques | Juridique et fiscal | how-to-guide | 2 | planned |
| 2026-10-20 | [Codes motifs de rejet de prélèvement SEPA : les lire, puis proposer l'échéancier](/blog/qu-est-ce-qu-un-rejet-de-prelevement-et-quels-sont-ses-motifs-courants) | Prélèvements, encaissements et rejets | Facturation et recouvrement du cabinet | faq-knowledge | 1 | planned |
| 2026-10-20 | [Lettrage automatique : les règles et les cas de refus](/blog/lettrage-automatique-regles-et-cas-de-refus) | Lettrage des comptes de tiers | Production comptable | how-to-guide | 3 | planned |
| 2026-10-21 | [TVA collectée et TVA déductible : quelle différence ?](/blog/tva-collectee-et-tva-deductible-quelle-difference) | TVA : préparation et contrôles | Juridique et fiscal | faq-knowledge | 1 | planned |
| 2026-10-21 | [Détecter les rejets de prélèvement et proposer un échéancier](/blog/detecter-les-rejets-de-prelevement-et-proposer-un-echeancier) | Prélèvements, encaissements et rejets | Facturation et recouvrement du cabinet | how-to-guide | 2 | planned |
| 2026-10-21 | [La checklist avant le versement d'un acompte d'IS](/blog/checklist-avant-le-versement-d-un-acompte-d-is) | Impôt sur les sociétés, acomptes et soldes | Juridique et fiscal | listicle-checklist | 2 | planned |
| 2026-10-22 | [Automatiser le suivi des factures d'achat et des échéances fournisseurs](/blog/automatiser-le-suivi-des-factures-d-achat-et-des-echeances-fournisseurs) | Factures d’achat et fournisseurs | Production comptable | how-to-guide | 3 | planned |
| 2026-10-22 | [Comment se calcule un acompte d'impôt sur les sociétés ?](/blog/comment-se-calcule-un-acompte-d-impot-sur-les-societes) | Impôt sur les sociétés, acomptes et soldes | Juridique et fiscal | faq-knowledge | 1 | planned |
| 2026-10-22 | [Automatiser l'import des ventes de caisse et e-commerce en comptabilité](/blog/automatiser-l-import-des-ventes-de-caisse-et-e-commerce-en-comptabilite) | Ventes, caisse et journaux de vente | Production comptable | how-to-guide | 3 | planned |
| 2026-10-23 | [La checklist annuelle des registres obligatoires d'une société](/blog/checklist-annuelle-des-registres-obligatoires-d-une-societe) | Registres et obligations périodiques | Juridique et fiscal | listicle-checklist | 2 | planned |
| 2026-10-23 | [Notes de frais clients : les traiter sans ressaisie](/blog/notes-de-frais-clients-traiter-sans-ressaisie) | Notes de frais | Production comptable | how-to-guide | 3 | planned |
| 2026-10-23 | [Qui doit déclarer la CVAE ? La règle du cabinet, dossier par dossier](/blog/cfe-cvae-das2-ifu-a-quoi-correspond-chaque-declaration-annexe) | Déclarations annexes | Juridique et fiscal | faq-knowledge | 1 | planned |
| 2026-10-24 | [Pourquoi un rapport analytics peut mesurer le mauvais site](/blog/rapport-analytics-mauvais-site) | Mesurer le temps gagné | Méthode et décision humaine | thought-leadership | 3 | planned |

### Semaine 2026-W44

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-10-26 | [Automatiser les tableaux d'amortissement et d'emprunt du dossier permanent](/blog/automatiser-les-tableaux-d-amortissement-et-d-emprunt-du-dossier-permanent) | Immobilisations, amortissements et emprunts | Production comptable | how-to-guide | 3 | planned |
| 2026-10-26 | [La checklist avant d'installer un complément Office.js sur un classeur](/blog/checklist-avant-d-installer-un-complement-office-js-sur-un-classeur) | Compléments greffés sur Excel | Excel et outils existants | listicle-checklist | 3 | planned |
| 2026-10-26 | [Automatiser la justification des soldes en révision comptable](/blog/automatiser-la-justification-des-soldes-en-revision-comptable) | Révision par cycles et justification des soldes | Production comptable | how-to-guide | 3 | planned |
| 2026-10-27 | [Délai de dépôt des comptes au greffe : le calendrier que le cabinet tient par dossier](/blog/quel-est-le-delai-legal-pour-approuver-les-comptes-annuels) | Approbation des comptes et secrétariat juridique | Juridique et fiscal | faq-knowledge | 1 | planned |
| 2026-10-27 | [Automatiser la production de la plaquette de bilan](/blog/automatiser-la-production-de-la-plaquette-de-bilan) | Clôture, bilan et plaquette | Production comptable | how-to-guide | 3 | planned |
| 2026-10-27 | [La checklist mensuelle des échéances fiscales du portefeuille](/blog/checklist-mensuelle-des-echeances-fiscales-du-portefeuille) | Calendrier et échéances fiscales du portefeuille | Portefeuille et échéances | listicle-checklist | 3 | planned |
| 2026-10-28 | [Automatiser les situations intermédiaires et le reporting client](/blog/automatiser-les-situations-intermediaires-et-le-reporting-client) | Situations intermédiaires et reporting client | Production comptable | how-to-guide | 3 | planned |
| 2026-10-28 | [Transfert de siège social : les formalités, et ce qui se prépare seul au cabinet](/blog/quelles-formalites-declencher-lors-d-une-modification-statutaire) | Création, modifications et formalités | Juridique et fiscal | faq-knowledge | 1 | planned |
| 2026-10-28 | [Automatiser la réception des factures électroniques au cabinet](/blog/automatiser-la-reception-des-factures-electroniques-au-cabinet) | Facture électronique et e-reporting | Production comptable | how-to-guide | 3 | planned |
| 2026-10-29 | [La checklist avant le dépôt d'une télédéclaration EDI](/blog/checklist-avant-le-depot-d-une-teledeclaration-edi) | Télédéclarations et rejets | Portefeuille et échéances | listicle-checklist | 3 | planned |
| 2026-10-29 | [Automatiser le classement et le nommage des pièces du dossier permanent](/blog/automatiser-le-classement-et-le-nommage-des-pieces-du-dossier-permanent) | GED, dossier permanent et nommage des pièces | Production comptable | how-to-guide | 3 | planned |
| 2026-10-29 | [Qu'est-ce que le registre des bénéficiaires effectifs ?](/blog/qu-est-ce-que-le-registre-des-beneficiaires-effectifs) | Registres et obligations périodiques | Juridique et fiscal | faq-knowledge | 1 | planned |
| 2026-10-30 | [Suivre la liasse EDI-TDFC et ses rejets](/blog/suivre-la-liasse-edi-tdfc-et-ses-rejets) | Télédéclarations et rejets | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-10-30 | [Contrôler la complétude d'un dossier client avant saisie](/blog/controler-la-completude-d-un-dossier-client) | Collecte et relance des pièces | Production comptable | listicle-checklist | 3 | planned |
| 2026-10-30 | [Automatiser le suivi des dossiers par état dans un classeur partagé](/blog/automatiser-le-suivi-des-dossiers-par-etat-dans-un-classeur-partage) | Suivi des dossiers par état | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-10-31 | [Pourquoi une revue visuelle peut valider la mauvaise palette](/blog/revue-visuelle-mauvaise-palette) | Règle, jeu d’essai et recette | Méthode et décision humaine | thought-leadership | 3 | planned |

### Semaine 2026-W45

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-02 | [Qu'est-ce que la lettre de mission d'un expert-comptable ?](/blog/qu-est-ce-que-la-lettre-de-mission-d-un-expert-comptable) | Lettre de mission et vigilance | Juridique et fiscal | faq-knowledge | 1 | planned |
| 2026-11-02 | [Un tableau de bord de production sans classer les personnes](/blog/tableau-de-bord-de-production-sans-classer-les-personnes) | Tableau de bord de production | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-11-02 | [Contrôler une pré-comptabilisation automatique avant validation](/blog/controler-une-pre-comptabilisation-automatique-avant-validation) | Saisie, OCR et pré-comptabilité | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-03 | [Automatiser le plan de charge et l'affectation des dossiers](/blog/automatiser-le-plan-de-charge-et-l-affectation-des-dossiers) | Plan de charge et affectation | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-11-03 | [Modèles de courrier d'un cabinet comptable : les fiabiliser sans les figer](/blog/qu-est-ce-qu-un-courrier-type-et-comment-le-fiabiliser-au-cabinet) | Boîte mail, tri et courriers types | Administration et secrétariat | faq-knowledge | 1 | planned |
| 2026-11-03 | [Collecter les variables de paie sans relancer à la main](/blog/collecter-les-variables-de-paie-sans-relancer-a-la-main) | Collecte des variables de paie | Paie et social | how-to-guide | 3 | planned |
| 2026-11-04 | [La checklist avant de valider un rapprochement bancaire automatisé](/blog/checklist-avant-de-valider-un-rapprochement-bancaire-automatise) | Relevés bancaires et rapprochement | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-04 | [Automatiser les contrôles de bulletins après le calcul de la paie](/blog/automatiser-les-controles-de-bulletins-apres-le-calcul-de-la-paie) | Bulletins et contrôles avant et après paie | Paie et social | how-to-guide | 3 | planned |
| 2026-11-04 | [Compte de résultat prévisionnel : définition, hypothèses, et ce que le cabinet valide](/blog/qu-est-ce-qu-un-previsionnel-financier-et-quelles-hypotheses-le-composent) | Prévisionnel et business plan | Conseil et missions spéciales | faq-knowledge | 1 | planned |
| 2026-11-05 | [Automatiser le contrôle et le dépôt de la DSN](/blog/automatiser-le-controle-et-le-depot-de-la-dsn) | DSN et comptes rendus métier | Paie et social | how-to-guide | 3 | planned |
| 2026-11-05 | [Contrôler un lettrage automatique avant clôture](/blog/controler-un-lettrage-automatique-avant-cloture) | Lettrage des comptes de tiers | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-05 | [Automatiser les entrées et sorties de salariés sans ressaisie](/blog/automatiser-les-entrees-et-sorties-de-salaries-sans-ressaisie) | Entrées, sorties et attestations | Paie et social | how-to-guide | 3 | planned |
| 2026-11-06 | [NEP 580 et déclarations de direction : situer la lettre dans le dossier](/blog/cac-declarations-direction-lettre) | Synthèse et lettre d’affirmation | Certification des comptes | faq-knowledge | 1 | planned |
| 2026-11-06 | [Automatiser le suivi des absences et des indemnités journalières](/blog/automatiser-le-suivi-des-absences-et-des-indemnites-journalieres) | Absences, arrêts et IJSS | Paie et social | how-to-guide | 3 | planned |
| 2026-11-06 | [Détecter les doublons de factures fournisseurs avant paiement](/blog/detecter-les-doublons-de-factures-fournisseurs-avant-paiement) | Factures d’achat et fournisseurs | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-07 | [Pourquoi un test automatisé peut accuser le mauvais système](/blog/test-automatise-accuse-mauvais-systeme) | Règle, jeu d’essai et recette | Méthode et décision humaine | thought-leadership | 3 | planned |

### Semaine 2026-W46

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-09 | [Automatiser le suivi des échéances Urssaf et caisses de retraite](/blog/automatiser-le-suivi-des-echeances-urssaf-et-caisses-de-retraite) | Charges sociales et échéances | Paie et social | how-to-guide | 3 | planned |
| 2026-11-09 | [Circularisation ouverte ou fermée : écrire le type de demande choisi](/blog/cac-circularisation-ouverte-fermee) | Confirmations de tiers | Certification des comptes | faq-knowledge | 1 | planned |
| 2026-11-09 | [Piloter le pôle social par étape, sans jamais nommer un salarié](/blog/piloter-le-pole-social-par-etape-sans-jamais-nommer-un-salarie) | Suivi de la production sociale | Paie et social | how-to-guide | 3 | planned |
| 2026-11-10 | [Contrôler un journal de ventes importé avant validation](/blog/controler-un-journal-de-ventes-importe-avant-validation) | Ventes, caisse et journaux de vente | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-10 | [Préparer la TVA : les contrôles avant déclaration](/blog/preparer-la-tva-les-controles-avant-declaration) | TVA : préparation et contrôles | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-11-10 | [Dossier de travail du commissaire aux comptes : distinguer annuel et permanent](/blog/cac-dossier-travail-permanent) | Dossier de travail | Certification des comptes | faq-knowledge | 1 | planned |
| 2026-11-11 | [Automatiser le calcul et le suivi des acomptes d'IS](/blog/automatiser-le-calcul-et-le-suivi-des-acomptes-d-is) | Impôt sur les sociétés, acomptes et soldes | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-11-11 | [La checklist de contrôle d'une note de frais avant remboursement](/blog/checklist-de-controle-d-une-note-de-frais-avant-remboursement) | Notes de frais | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-11 | [Automatiser le suivi des déclarations annexes : CFE, CVAE, DAS2](/blog/automatiser-le-suivi-des-declarations-annexes-cfe-cvae-das2) | Déclarations annexes | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-11-12 | [OCR comptable et IA générative : quelle différence pour la saisie ?](/blog/ocr-comptable-et-ia-generative-quelle-difference-pour-la-saisie) | Saisie, OCR et pré-comptabilité | Production comptable | faq-knowledge | 2 | planned |
| 2026-11-12 | [Approbation des comptes : préparer le secrétariat juridique annuel](/blog/approbation-des-comptes-preparer-le-secretariat-juridique-annuel) | Approbation des comptes et secrétariat juridique | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-11-12 | [Contrôler les soldes d'amortissement avant la clôture](/blog/controler-les-soldes-d-amortissement-avant-la-cloture) | Immobilisations, amortissements et emprunts | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-13 | [Automatiser la constitution des dossiers de formalités d'entreprise](/blog/automatiser-la-constitution-des-dossiers-de-formalites-d-entreprise) | Création, modifications et formalités | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-11-13 | [Quelles mentions un bulletin de paie doit-il toujours comporter ?](/blog/quelles-mentions-un-bulletin-de-paie-doit-il-toujours-comporter) | Bulletins et contrôles avant et après paie | Paie et social | faq-knowledge | 2 | planned |
| 2026-11-13 | [Suivre le renouvellement des lettres de mission](/blog/suivre-le-renouvellement-des-lettres-de-mission) | Lettre de mission et vigilance | Juridique et fiscal | how-to-guide | 3 | planned |

### Semaine 2026-W47

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-16 | [Automatiser les contrôles répétitifs de la révision par cycles](/blog/automatiser-les-controles-repetitifs-de-la-revision-par-cycles) | Révision par cycles et justification des soldes | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-16 | [Ne pas facturer deux fois un acte hors forfait](/blog/ne-pas-facturer-deux-fois-un-acte-hors-forfait) | Honoraires et actes hors forfait | Facturation et recouvrement du cabinet | how-to-guide | 3 | planned |
| 2026-11-16 | [DPAE et attestation employeur : quelle différence ?](/blog/dpae-et-attestation-employeur-quelle-difference) | Entrées, sorties et attestations | Paie et social | faq-knowledge | 2 | planned |
| 2026-11-17 | [Automatiser les relances d'honoraires impayés](/blog/automatiser-les-relances-d-honoraires-impayes) | Relances d’impayés | Facturation et recouvrement du cabinet | how-to-guide | 3 | planned |
| 2026-11-17 | [Clôture annuelle : automatiser les contrôles répétitifs](/blog/cloture-annuelle-automatiser-les-controles-repetitifs) | Clôture, bilan et plaquette | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-17 | [Repérer un dossier facturé sous son tarif](/blog/reperer-un-dossier-facture-sous-son-tarif) | Temps, rentabilité et sous-facturation | Facturation et recouvrement du cabinet | how-to-guide | 3 | planned |
| 2026-11-18 | [Qu'est-ce qu'un manuel de procédures comptables, et que doit-il contenir ?](/blog/qu-est-ce-qu-un-manuel-de-procedures-comptables-et-que-doit-il-contenir) | Règle, jeu d’essai et recette | Méthode et décision humaine | faq-knowledge | 2 | planned |
| 2026-11-18 | [Trier la boîte mail du cabinet par client et par priorité](/blog/trier-la-boite-mail-du-cabinet-par-client-et-priorite) | Boîte mail, tri et courriers types | Administration et secrétariat | how-to-guide | 3 | planned |
| 2026-11-18 | [Contrôler une situation intermédiaire avant de l'envoyer au client](/blog/controler-une-situation-intermediaire-avant-envoi-au-client) | Situations intermédiaires et reporting client | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-19 | [Automatiser le transfert de dossier à la fin d'une mission](/blog/automatiser-le-transfert-de-dossier-a-la-fin-d-une-mission) | Fin de mission et transfert de dossier | Administration et secrétariat | how-to-guide | 3 | planned |
| 2026-11-19 | [Quelles sont les méthodes d'évaluation d'une entreprise en transmission ?](/blog/quelles-sont-les-methodes-d-evaluation-d-une-entreprise-en-transmission) | Évaluation et transmission | Conseil et missions spéciales | faq-knowledge | 2 | planned |
| 2026-11-19 | [Suivre l'envoi des plaquettes de bilan](/blog/suivre-l-envoi-des-plaquettes-de-bilan) | Envois de plaquettes et de documents | Administration et secrétariat | how-to-guide | 3 | planned |
| 2026-11-20 | [La checklist pour vérifier un dossier permanent avant transfert](/blog/checklist-pour-verifier-un-dossier-permanent-avant-transfert) | GED, dossier permanent et nommage des pièces | Production comptable | listicle-checklist | 3 | planned |
| 2026-11-20 | [Automatiser la préparation des rendez-vous périodiques du cabinet](/blog/automatiser-la-preparation-des-rendez-vous-periodiques-du-cabinet) | Rendez-vous et agenda du cabinet | Administration et secrétariat | how-to-guide | 3 | planned |
| 2026-11-20 | [La checklist pour fiabiliser les états d'un classeur de suivi](/blog/checklist-pour-fiabiliser-les-etats-d-un-classeur-de-suivi-de-dossiers) | Suivi des dossiers par état | Portefeuille et échéances | listicle-checklist | 3 | planned |

### Semaine 2026-W48

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-23 | [Automatiser la préparation de l'arrivée d'un nouveau collaborateur](/blog/automatiser-la-preparation-de-l-arrivee-d-un-nouveau-collaborateur) | RH interne du cabinet | RH et formation | how-to-guide | 3 | planned |
| 2026-11-23 | [Qu'est-ce qu'un complément Excel greffé sur un classeur existant ?](/blog/qu-est-ce-qu-un-complement-excel-greffe-sur-un-classeur-existant) | Compléments greffés sur Excel | Excel et outils existants | faq-knowledge | 3 | planned |
| 2026-11-23 | [Synthèse de rémunération d'un salarié, sans la reconstruire](/blog/synthese-de-remuneration-d-un-salarie-sans-la-reconstruire) | Synthèse de rémunération | RH et formation | how-to-guide | 3 | planned |
| 2026-11-24 | [Les indicateurs à suivre dans un tableau de bord de production](/blog/checklist-des-indicateurs-a-suivre-dans-un-tableau-de-bord-de-production) | Tableau de bord de production | Portefeuille et échéances | listicle-checklist | 3 | planned |
| 2026-11-24 | [Organiser la formation de l'équipe à l'IA et à ses limites](/blog/organiser-la-formation-de-l-equipe-a-l-ia-et-a-ses-limites) | Formation et maîtrise de l’IA | RH et formation | how-to-guide | 3 | planned |
| 2026-11-24 | [Écritures manuelles en audit : définir une population avant de la tester](/blog/cac-ecritures-manuelles-perimetre) | Sélection des écritures | Certification des comptes | faq-knowledge | 3 | planned |
| 2026-11-25 | [Automatiser sans exposer le secret professionnel du cabinet](/blog/automatiser-sans-exposer-le-secret-professionnel-du-cabinet) | RGPD, secret professionnel et sécurité | Numérique, IT et data | how-to-guide | 3 | planned |
| 2026-11-25 | [La checklist pour vérifier un plan de charge avant une période de pointe](/blog/checklist-pour-verifier-un-plan-de-charge-avant-une-periode-de-pointe) | Plan de charge et affectation | Portefeuille et échéances | listicle-checklist | 3 | planned |
| 2026-11-25 | [Automatiser les échanges entre logiciels par connecteur ou par fichier](/blog/automatiser-les-echanges-entre-logiciels-par-connecteur-ou-par-fichier) | Connecteurs, imports et synchronisation | Numérique, IT et data | how-to-guide | 3 | planned |
| 2026-11-26 | [Qu'est-ce qu'une pièce manquante, au sens du cabinet comptable ?](/blog/qu-est-ce-qu-une-piece-comptable-manquante-au-sens-du-cabinet) | Collecte et relance des pièces | Production comptable | faq-knowledge | 3 | planned |
| 2026-11-26 | [Mettre un cabinet comptable en conformité avec l'AI Act](/blog/mettre-un-cabinet-comptable-en-conformite-avec-l-ai-act) | AI Act et conformité des outils | Numérique, IT et data | how-to-guide | 3 | planned |
| 2026-11-26 | [La checklist de contrôle des variables de paie avant le bulletin](/blog/checklist-de-controle-des-variables-de-paie-avant-le-bulletin) | Collecte des variables de paie | Paie et social | listicle-checklist | 3 | planned |
| 2026-11-27 | [Structurer un classeur de suivi Excel partagé par tout le cabinet](/blog/structurer-un-classeur-de-suivi-excel-partage-par-tout-le-cabinet) | Classeurs de suivi Excel | Excel et outils existants | how-to-guide | 3 | planned |
| 2026-11-27 | [Qu'est-ce que le lettrage comptable, et peut-on l'automatiser entièrement ?](/blog/qu-est-ce-que-le-lettrage-comptable-et-peut-on-l-automatiser-entierement) | Lettrage des comptes de tiers | Production comptable | faq-knowledge | 3 | planned |
| 2026-11-27 | [Importer un export logiciel dans Excel sans ressaisie](/blog/importer-un-export-logiciel-dans-excel-sans-ressaisie) | Exports et imports des logiciels | Excel et outils existants | how-to-guide | 3 | planned |

### Semaine 2026-W49

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-30 | [La checklist de contrôle des bulletins à éléments variables](/blog/checklist-de-controle-des-bulletins-a-elements-variables) | Bulletins et contrôles avant et après paie | Paie et social | listicle-checklist | 3 | planned |
| 2026-11-30 | [Organiser la validation humaine d'une automatisation au cabinet](/blog/organiser-la-validation-humaine-d-une-automatisation-au-cabinet) | Validation humaine et cas de refus | Méthode et décision humaine | how-to-guide | 3 | planned |
| 2026-11-30 | [Factures d'achat et notes de frais : où est la frontière comptable ?](/blog/factures-d-achat-et-notes-de-frais-ou-est-la-frontiere) | Factures d’achat et fournisseurs | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-01 | [Mesurer le temps réellement gagné par une automatisation](/blog/mesurer-le-temps-reellement-gagne-par-une-automatisation) | Mesurer le temps gagné | Méthode et décision humaine | how-to-guide | 3 | planned |
| 2026-12-01 | [La checklist de contrôle d'un arrêt de travail avant la paie](/blog/checklist-de-controle-d-un-arret-de-travail-avant-la-paie) | Absences, arrêts et IJSS | Paie et social | listicle-checklist | 3 | planned |
| 2026-12-01 | [Automatiser la production d'un prévisionnel à partir des données tenues](/blog/automatiser-la-production-d-un-previsionnel-a-partir-des-donnees-tenues) | Prévisionnel et business plan | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2026-12-02 | [Qu'est-ce qu'un journal de ventes, et comment l'alimenter sans ressaisie ?](/blog/qu-est-ce-qu-un-journal-de-ventes-et-comment-il-s-alimente-automatiquement) | Ventes, caisse et journaux de vente | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-02 | [Automatiser la projection de trésorerie d'un client depuis ses échéances](/blog/automatiser-la-projection-de-tresorerie-d-un-client-depuis-ses-echeances) | Trésorerie prévisionnelle | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2026-12-02 | [La checklist avant le règlement des charges sociales mensuelles](/blog/checklist-avant-le-reglement-des-charges-sociales-mensuelles) | Charges sociales et échéances | Paie et social | listicle-checklist | 3 | planned |
| 2026-12-03 | [Automatiser la constitution des dossiers de financement et d'aides](/blog/automatiser-la-constitution-des-dossiers-de-financement-et-d-aides) | Financement et aides | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2026-12-03 | [Quels frais professionnels sont exonérés de cotisations sociales ?](/blog/quels-frais-professionnels-sont-exoneres-de-cotisations) | Notes de frais | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-03 | [Automatiser la préparation des éléments chiffrés d'une évaluation d'entreprise](/blog/automatiser-la-preparation-des-elements-chiffres-d-une-evaluation-d-entreprise) | Évaluation et transmission | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2026-12-04 | [Les indicateurs à agréger pour piloter le pôle social](/blog/checklist-des-indicateurs-a-agreger-pour-le-pole-social) | Suivi de la production sociale | Paie et social | listicle-checklist | 3 | planned |
| 2026-12-04 | [Automatiser la collecte des pièces d'entrée en relation](/blog/automatiser-la-collecte-des-pieces-d-entree-en-relation) | Entrée en relation et onboarding client | Administration et secrétariat | how-to-guide | 3 | planned |
| 2026-12-04 | [Qu'est-ce qu'une immobilisation, et comment son amortissement se calcule ?](/blog/qu-est-ce-qu-une-immobilisation-et-comment-son-amortissement-se-calcule) | Immobilisations, amortissements et emprunts | Production comptable | faq-knowledge | 3 | planned |

### Semaine 2026-W50

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-07 | [Ce qu'un complément Excel ne doit jamais écrire sans validation](/blog/ce-qu-un-complement-excel-ne-doit-jamais-ecrire-sans-validation) | Compléments greffés sur Excel | Excel et outils existants | how-to-guide | 3 | planned |
| 2026-12-07 | [La checklist de contrôle de la TVA avant télétransmission](/blog/checklist-de-controle-de-la-tva-avant-teletransmission) | TVA : préparation et contrôles | Juridique et fiscal | listicle-checklist | 3 | planned |
| 2026-12-07 | [Choisir la première tâche à automatiser](/blog/choisir-la-premiere-tache-a-automatiser) | Choisir et cadrer une automatisation | Méthode et décision humaine | how-to-guide | 3 | planned |
| 2026-12-08 | [Qu'est-ce que la révision par cycles, en comptabilité ?](/blog/qu-est-ce-que-la-revision-par-cycles-en-comptabilite) | Révision par cycles et justification des soldes | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-08 | [Échéances reportées ou suspendues : ce qu'un calendrier ne décide pas](/blog/echeances-fiscales-reportees-ou-suspendues-ce-qu-un-calendrier-automatique-ne-decide-pas) | Calendrier et échéances fiscales du portefeuille | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-12-08 | [La checklist annuelle des déclarations annexes par dossier](/blog/checklist-annuelle-des-declarations-annexes-par-dossier) | Déclarations annexes | Juridique et fiscal | listicle-checklist | 3 | planned |
| 2026-12-09 | [Les cas où la relance de pièces doit rester manuelle](/blog/les-cas-ou-la-relance-de-pieces-doit-rester-manuelle) | Collecte et relance des pièces | Production comptable | how-to-guide | 3 | planned |
| 2026-12-09 | [Qu'est-ce qu'une échéance fiscale de portefeuille, et comment la suivre ?](/blog/qu-est-ce-qu-une-echeance-fiscale-de-portefeuille-et-comment-elle-se-suit) | Calendrier et échéances fiscales du portefeuille | Portefeuille et échéances | faq-knowledge | 3 | planned |
| 2026-12-09 | [Quand la lecture automatique d'une pièce doit remonter à un collaborateur](/blog/quand-la-lecture-automatique-d-une-piece-doit-remonter-a-un-collaborateur) | Saisie, OCR et pré-comptabilité | Production comptable | how-to-guide | 3 | planned |
| 2026-12-10 | [La checklist des documents d'une assemblée générale annuelle](/blog/checklist-des-documents-d-une-assemblee-generale-annuelle) | Approbation des comptes et secrétariat juridique | Juridique et fiscal | listicle-checklist | 3 | planned |
| 2026-12-10 | [Les écarts qu'un rapprochement bancaire automatique ne tranche pas seul](/blog/les-ecarts-bancaires-qu-un-rapprochement-automatique-ne-doit-pas-trancher-seul) | Relevés bancaires et rapprochement | Production comptable | how-to-guide | 3 | planned |
| 2026-12-10 | [Qu'est-ce que la télétransmission EDI-TDFC, en cabinet comptable ?](/blog/qu-est-ce-que-la-teletransmission-edi-tdfc-en-cabinet-comptable) | Télédéclarations et rejets | Portefeuille et échéances | faq-knowledge | 3 | planned |
| 2026-12-11 | [Paiements groupés et écarts de centimes : ce que le lettrage refuse](/blog/paiements-groupes-et-ecarts-de-centimes-ce-que-le-lettrage-automatique-refuse) | Lettrage des comptes de tiers | Production comptable | how-to-guide | 3 | planned |
| 2026-12-11 | [La checklist des pièces d'un dossier de formalité avant dépôt](/blog/checklist-des-pieces-d-un-dossier-de-formalite-avant-depot) | Création, modifications et formalités | Juridique et fiscal | listicle-checklist | 3 | planned |
| 2026-12-11 | [Les avoirs fournisseurs qu'un rapprochement automatique n'impute pas seul](/blog/les-avoirs-fournisseurs-qu-un-rapprochement-automatique-ne-doit-pas-imputer-seul) | Factures d’achat et fournisseurs | Production comptable | how-to-guide | 3 | planned |

### Semaine 2026-W51

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-14 | [Quels sont les états possibles d'un dossier, dans un cabinet comptable ?](/blog/quels-sont-les-etats-possibles-d-un-dossier-dans-un-cabinet-comptable) | Suivi des dossiers par état | Portefeuille et échéances | faq-knowledge | 3 | planned |
| 2026-12-14 | [Les écarts de caisse qu'un import de ventes ne corrige jamais seul](/blog/les-ecarts-de-caisse-qu-un-import-de-ventes-ne-doit-jamais-corriger-seul) | Ventes, caisse et journaux de vente | Production comptable | how-to-guide | 3 | planned |
| 2026-12-14 | [La checklist mensuelle de facturation des honoraires](/blog/checklist-mensuelle-de-facturation-des-honoraires) | Honoraires et actes hors forfait | Facturation et recouvrement du cabinet | listicle-checklist | 3 | planned |
| 2026-12-15 | [Les notes de frais qu'un traitement automatique fait toujours remonter](/blog/les-notes-de-frais-qu-un-traitement-automatique-doit-toujours-faire-remonter) | Notes de frais | Production comptable | how-to-guide | 3 | planned |
| 2026-12-15 | [Qu'est-ce qu'un tableau de bord de production, en cabinet comptable ?](/blog/qu-est-ce-qu-un-tableau-de-bord-de-production-en-cabinet-comptable) | Tableau de bord de production | Portefeuille et échéances | faq-knowledge | 3 | planned |
| 2026-12-15 | [Les soldes de révision qu'un contrôle automatique ne classe pas seul](/blog/les-soldes-de-revision-qu-un-controle-automatique-ne-doit-pas-classer-seul) | Révision par cycles et justification des soldes | Production comptable | how-to-guide | 3 | planned |
| 2026-12-16 | [La checklist avant de constituer un lot de prélèvement SEPA](/blog/checklist-avant-de-constituer-un-lot-de-prelevement-sepa) | Prélèvements, encaissements et rejets | Facturation et recouvrement du cabinet | listicle-checklist | 3 | planned |
| 2026-12-16 | [Ce qu'une clôture automatisée laisse toujours au réviseur](/blog/ce-qu-une-cloture-automatisee-laisse-toujours-au-reviseur) | Clôture, bilan et plaquette | Production comptable | how-to-guide | 3 | planned |
| 2026-12-16 | [Qu'est-ce qu'une variable de paie, et qui doit la transmettre ?](/blog/qu-est-ce-qu-une-variable-de-paie-et-qui-doit-la-transmettre) | Collecte des variables de paie | Paie et social | faq-knowledge | 3 | planned |
| 2026-12-17 | [Les indicateurs qu'un reporting client automatique ne commente pas seul](/blog/les-indicateurs-de-reporting-client-qu-un-tableau-automatique-ne-doit-pas-commenter-seul) | Situations intermédiaires et reporting client | Production comptable | how-to-guide | 3 | planned |
| 2026-12-17 | [La checklist de la cadence de relance d'un impayé](/blog/checklist-de-la-cadence-de-relance-d-un-impaye) | Relances d’impayés | Facturation et recouvrement du cabinet | listicle-checklist | 3 | planned |
| 2026-12-17 | [E-reporting : les opérations qu'un cabinet vérifie toujours à la main](/blog/e-reporting-les-operations-qu-un-cabinet-doit-toujours-verifier-a-la-main) | Facture électronique et e-reporting | Production comptable | how-to-guide | 3 | planned |
| 2026-12-18 | [Qu'est-ce que la subrogation, en matière d'indemnités journalières ?](/blog/qu-est-ce-que-la-subrogation-en-matiere-d-indemnites-journalieres) | Absences, arrêts et IJSS | Paie et social | faq-knowledge | 3 | planned |
| 2026-12-18 | [Les pièces sensibles qu'un classement automatique ne déplace pas seul](/blog/les-pieces-sensibles-qu-un-classement-automatique-ne-doit-jamais-deplacer-seul) | GED, dossier permanent et nommage des pièces | Production comptable | how-to-guide | 3 | planned |
| 2026-12-18 | [La checklist pour mesurer la rentabilité d'un dossier client](/blog/checklist-pour-mesurer-la-rentabilite-d-un-dossier-client) | Temps, rentabilité et sous-facturation | Facturation et recouvrement du cabinet | listicle-checklist | 3 | planned |

### Semaine 2026-W52

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-21 | [Les rejets EDI qu'un suivi automatique ne corrige pas seul](/blog/les-rejets-edi-qu-un-suivi-automatique-ne-doit-pas-corriger-seul) | Télédéclarations et rejets | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-12-21 | [Quelles sont les étapes obligatoires d'une clôture annuelle ?](/blog/quelles-sont-les-etapes-obligatoires-d-une-cloture-annuelle) | Clôture, bilan et plaquette | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-21 | [Les dossiers bloqués qu'un suivi automatique signale toujours](/blog/les-dossiers-bloques-qu-un-suivi-automatique-doit-toujours-signaler-a-un-humain) | Suivi des dossiers par état | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-12-22 | [La checklist pour assainir une boîte mail de cabinet saturée](/blog/checklist-pour-assainir-une-boite-mail-de-cabinet-saturee) | Boîte mail, tri et courriers types | Administration et secrétariat | listicle-checklist | 3 | planned |
| 2026-12-22 | [Pourquoi un tableau de bord de production ne nomme jamais un collaborateur](/blog/pourquoi-un-tableau-de-bord-de-production-ne-doit-jamais-nommer-un-collaborateur) | Tableau de bord de production | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-12-22 | [Situation intermédiaire et reporting client : quelle différence ?](/blog/situation-intermediaire-et-reporting-client-quelle-difference) | Situations intermédiaires et reporting client | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-23 | [Répartition de charge : ce qu'un plan automatique n'arbitre pas seul](/blog/repartition-de-charge-ce-qu-un-plan-automatique-ne-doit-pas-arbitrer-seul) | Plan de charge et affectation | Portefeuille et échéances | how-to-guide | 3 | planned |
| 2026-12-23 | [La checklist de fin de mission avant transfert de dossier](/blog/checklist-de-fin-de-mission-avant-transfert-de-dossier) | Fin de mission et transfert de dossier | Administration et secrétariat | listicle-checklist | 3 | planned |
| 2026-12-23 | [Les variables de paie qu'un formulaire automatique ne valide jamais seul](/blog/les-variables-de-paie-qu-un-formulaire-automatique-ne-doit-jamais-valider-seul) | Collecte des variables de paie | Paie et social | how-to-guide | 3 | planned |
| 2026-12-24 | [Facture électronique : ce que change la collecte des pièces](/blog/facture-electronique-ce-que-change-la-collecte-des-pieces) | Facture électronique et e-reporting | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-24 | [Les bulletins de paie qu'un contrôle automatique isole toujours](/blog/les-bulletins-de-paie-qu-un-controle-automatique-doit-toujours-isoler) | Bulletins et contrôles avant et après paie | Paie et social | how-to-guide | 3 | planned |
| 2026-12-24 | [La checklist de suivi de l'envoi des documents périodiques](/blog/checklist-de-suivi-de-l-envoi-des-documents-periodiques) | Envois de plaquettes et de documents | Administration et secrétariat | listicle-checklist | 3 | planned |
| 2026-12-25 | [Que faire quand un compte rendu métier DSN signale une anomalie ?](/blog/que-faire-quand-un-compte-rendu-metier-dsn-signale-une-anomalie) | DSN et comptes rendus métier | Paie et social | how-to-guide | 3 | planned |
| 2026-12-25 | [Qu'est-ce qu'un dossier permanent, en cabinet d'expertise comptable ?](/blog/qu-est-ce-qu-un-dossier-permanent-en-cabinet-d-expertise-comptable) | GED, dossier permanent et nommage des pièces | Production comptable | faq-knowledge | 3 | planned |
| 2026-12-25 | [Les indemnités journalières qu'un rapprochement automatique ne solde pas seul](/blog/les-indemnites-journalieres-qu-un-rapprochement-automatique-ne-doit-pas-solder-seul) | Absences, arrêts et IJSS | Paie et social | how-to-guide | 3 | planned |

### Semaine 2026-W53

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-28 | [La checklist avant un rendez-vous client périodique](/blog/checklist-avant-un-rendez-vous-client-periodique) | Rendez-vous et agenda du cabinet | Administration et secrétariat | listicle-checklist | 3 | planned |
| 2026-12-28 | [Pourquoi un indicateur de production sociale ne remonte jamais un nom](/blog/pourquoi-un-indicateur-de-production-sociale-ne-doit-jamais-remonter-un-nom) | Suivi de la production sociale | Paie et social | how-to-guide | 3 | planned |
| 2026-12-28 | [Honoraires mensualisés et actes hors forfait : quelle différence ?](/blog/honoraires-mensualises-et-actes-hors-forfait-quelle-difference) | Honoraires et actes hors forfait | Facturation et recouvrement du cabinet | faq-knowledge | 3 | planned |
| 2026-12-29 | [Les opérations de TVA qu'un contrôle automatique ne tranche jamais seul](/blog/les-operations-de-tva-qu-un-controle-automatique-ne-doit-jamais-trancher-seul) | TVA : préparation et contrôles | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-12-29 | [La checklist d'intégration d'un nouveau collaborateur au cabinet](/blog/checklist-d-integration-d-un-nouveau-collaborateur-au-cabinet) | RH interne du cabinet | RH et formation | listicle-checklist | 3 | planned |
| 2026-12-29 | [Sous-estimation d'acompte d'IS : ce qu'un calcul automatique signale](/blog/sous-estimation-d-acompte-d-is-ce-qu-un-calcul-automatique-doit-signaler) | Impôt sur les sociétés, acomptes et soldes | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-12-30 | [Qu'est-ce que le suivi de la production sociale d'un cabinet ?](/blog/qu-est-ce-que-le-suivi-de-la-production-sociale-d-un-cabinet) | Suivi de la production sociale | Paie et social | faq-knowledge | 3 | planned |
| 2026-12-30 | [Quelles déclarations annexes un changement de situation fait revérifier](/blog/quelles-declarations-annexes-un-changement-de-situation-fait-toujours-reverifier) | Déclarations annexes | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-12-30 | [La checklist de contrôle d'une synthèse de rémunération avant remise](/blog/checklist-de-controle-d-une-synthese-de-remuneration-avant-remise) | Synthèse de rémunération | RH et formation | listicle-checklist | 3 | planned |
| 2026-12-31 | [Les décisions d'assemblée générale qu'un générateur de PV ne rédige jamais seul](/blog/les-decisions-d-assemblee-generale-qu-un-generateur-de-pv-ne-redige-jamais-seul) | Approbation des comptes et secrétariat juridique | Juridique et fiscal | how-to-guide | 3 | planned |
| 2026-12-31 | [À partir de quand un honoraire est-il considéré comme impayé ?](/blog/a-partir-de-quand-un-honoraire-est-il-considere-comme-impaye) | Relances d’impayés | Facturation et recouvrement du cabinet | faq-knowledge | 3 | planned |
| 2026-12-31 | [Les formalités d'entreprise qui échouent toujours sans validation humaine](/blog/les-formalites-d-entreprise-qui-echouent-toujours-sans-validation-humaine) | Création, modifications et formalités | Juridique et fiscal | how-to-guide | 3 | planned |
| 2027-01-01 | [La checklist pour tenir la preuve de formation à l'IA au cabinet](/blog/checklist-pour-tenir-la-preuve-de-formation-a-l-ia-au-cabinet) | Formation et maîtrise de l’IA | RH et formation | listicle-checklist | 3 | planned |
| 2027-01-01 | [Les actes hors forfait qu'une facturation automatique n'émet jamais seule](/blog/les-actes-hors-forfait-qu-une-facturation-automatique-ne-doit-jamais-emettre-seule) | Honoraires et actes hors forfait | Facturation et recouvrement du cabinet | how-to-guide | 3 | planned |
| 2027-01-01 | [Qu'est-ce que l'entrée en relation avec un nouveau client, au cabinet ?](/blog/qu-est-ce-que-l-entree-en-relation-avec-un-nouveau-client-au-cabinet) | Entrée en relation et onboarding client | Administration et secrétariat | faq-knowledge | 3 | planned |

### Semaine 2027-W01

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-04 | [Les relances d'impayés qu'un cabinet arrête toujours avant l'envoi](/blog/les-relances-d-impayes-qu-un-cabinet-doit-toujours-arreter-avant-l-envoi) | Relances d’impayés | Facturation et recouvrement du cabinet | how-to-guide | 3 | planned |
| 2027-01-04 | [La checklist RGPD avant de brancher un outil d'IA sur des données clients](/blog/checklist-rgpd-avant-de-brancher-un-outil-d-ia-sur-des-donnees-clients) | RGPD, secret professionnel et sécurité | Numérique, IT et data | listicle-checklist | 3 | planned |
| 2027-01-04 | [Écart de tarif détecté : ce qu'un outil de rentabilité ne décide jamais seul](/blog/ecart-de-tarif-detecte-ce-qu-un-outil-de-rentabilite-ne-decide-jamais-seul) | Temps, rentabilité et sous-facturation | Facturation et recouvrement du cabinet | how-to-guide | 3 | planned |
| 2027-01-05 | [Qu'est-ce qu'une lettre de confrère, et quand l'envoyer ?](/blog/qu-est-ce-qu-une-lettre-de-confrere-et-quand-l-envoyer) | Fin de mission et transfert de dossier | Administration et secrétariat | faq-knowledge | 3 | planned |
| 2027-01-05 | [Les étapes de recrutement qu'un cabinet ne délègue jamais à un outil](/blog/les-etapes-de-recrutement-qu-un-cabinet-ne-doit-jamais-deleguer-a-un-outil) | RH interne du cabinet | RH et formation | how-to-guide | 3 | planned |
| 2027-01-05 | [La checklist avant de brancher un connecteur entre deux logiciels](/blog/checklist-avant-de-brancher-un-connecteur-entre-deux-logiciels-du-cabinet) | Connecteurs, imports et synchronisation | Numérique, IT et data | listicle-checklist | 3 | planned |
| 2027-01-06 | [Les courriers qu'un tri automatique de boîte mail ne classe jamais seul](/blog/les-courriers-qu-un-tri-automatique-de-boite-mail-ne-doit-jamais-classer-seul) | Boîte mail, tri et courriers types | Administration et secrétariat | how-to-guide | 3 | planned |
| 2027-01-06 | [Comment se mesure la rentabilité d'un dossier, en cabinet comptable ?](/blog/comment-se-mesure-la-rentabilite-d-un-dossier-en-cabinet-comptable) | Temps, rentabilité et sous-facturation | Facturation et recouvrement du cabinet | faq-knowledge | 3 | planned |
| 2027-01-06 | [Les jalons d'un onboarding client qui attendent toujours la signature](/blog/les-jalons-d-un-onboarding-client-qui-attendent-toujours-la-signature) | Entrée en relation et onboarding client | Administration et secrétariat | how-to-guide | 3 | planned |
| 2027-01-07 | [La checklist de conformité AI Act pour un petit cabinet comptable](/blog/checklist-de-conformite-ai-act-pour-un-petit-cabinet-comptable) | AI Act et conformité des outils | Numérique, IT et data | listicle-checklist | 3 | planned |
| 2027-01-07 | [Ce qu'un transfert de dossier ne doit jamais oublier de signaler au confrère](/blog/ce-qu-un-transfert-de-dossier-ne-doit-jamais-oublier-de-signaler-au-confrere) | Fin de mission et transfert de dossier | Administration et secrétariat | how-to-guide | 3 | planned |
| 2027-01-07 | [Qu'est-ce que la RH interne d'un cabinet d'expertise comptable ?](/blog/qu-est-ce-que-la-rh-interne-d-un-cabinet-d-expertise-comptable) | RH interne du cabinet | RH et formation | faq-knowledge | 3 | planned |
| 2027-01-08 | [Les plaquettes de bilan qu'un envoi automatique ne diffuse pas sans relecture](/blog/les-plaquettes-de-bilan-qu-un-envoi-automatique-ne-doit-jamais-diffuser-sans-relecture) | Envois de plaquettes et de documents | Administration et secrétariat | how-to-guide | 3 | planned |
| 2027-01-08 | [La checklist pour vérifier un classeur de suivi Excel avant de le partager](/blog/checklist-pour-verifier-un-classeur-de-suivi-excel-avant-de-le-partager) | Classeurs de suivi Excel | Excel et outils existants | listicle-checklist | 3 | planned |
| 2027-01-08 | [Les rendez-vous qu'un agenda partagé ne confirme jamais seul](/blog/les-rendez-vous-qu-un-agenda-partage-ne-doit-jamais-confirmer-seul) | Rendez-vous et agenda du cabinet | Administration et secrétariat | how-to-guide | 3 | planned |

### Semaine 2027-W02

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-11 | [Qu'est-ce qu'une synthèse de rémunération, et à qui sert-elle ?](/blog/qu-est-ce-qu-une-synthese-de-remuneration-et-a-qui-sert-elle) | Synthèse de rémunération | RH et formation | faq-knowledge | 3 | planned |
| 2027-01-11 | [Les données qu'un cabinet ne transmet jamais à un outil d'IA grand public](/blog/les-donnees-qu-un-cabinet-ne-doit-jamais-transmettre-a-un-outil-d-ia-grand-public) | RGPD, secret professionnel et sécurité | Numérique, IT et data | how-to-guide | 3 | planned |
| 2027-01-11 | [La checklist avant d'importer un export logiciel dans Excel](/blog/checklist-avant-d-importer-un-export-logiciel-dans-excel) | Exports et imports des logiciels | Excel et outils existants | listicle-checklist | 3 | planned |
| 2027-01-12 | [Les éléments de rémunération qu'une synthèse automatique n'interprète pas seule](/blog/les-elements-de-remuneration-qu-une-synthese-automatique-ne-doit-pas-interpreter-seule) | Synthèse de rémunération | RH et formation | how-to-guide | 3 | planned |
| 2027-01-12 | [Quels documents un cabinet comptable envoie-t-il périodiquement à ses clients ?](/blog/quels-documents-un-cabinet-comptable-envoie-t-il-periodiquement-a-ses-clients) | Envois de plaquettes et de documents | Administration et secrétariat | faq-knowledge | 3 | planned |
| 2027-01-12 | [Les usages de l'IA qu'une formation doit toujours signaler comme interdits](/blog/les-usages-de-l-ia-qu-une-formation-doit-toujours-signaler-comme-interdits) | Formation et maîtrise de l’IA | RH et formation | how-to-guide | 3 | planned |
| 2027-01-13 | [La checklist de recette avant de mettre en service une automatisation](/blog/checklist-de-recette-avant-de-mettre-en-service-une-automatisation) | Règle, jeu d’essai et recette | Méthode et décision humaine | listicle-checklist | 3 | planned |
| 2027-01-13 | [Les échecs de synchronisation qu'un connecteur signale sans rejouer seul](/blog/les-echecs-de-synchronisation-qu-un-connecteur-doit-toujours-signaler-sans-rejouer-seul) | Connecteurs, imports et synchronisation | Numérique, IT et data | how-to-guide | 3 | planned |
| 2027-01-13 | [Qu'est-ce qu'un agenda partagé de cabinet comptable, et à quoi sert-il ?](/blog/qu-est-ce-qu-un-agenda-partage-de-cabinet-comptable-et-a-quoi-sert-il) | Rendez-vous et agenda du cabinet | Administration et secrétariat | faq-knowledge | 3 | planned |
| 2027-01-14 | [Quels usages de l'IA l'AI Act interdit-il à un cabinet comptable ?](/blog/quels-usages-de-l-ia-l-ai-act-interdit-il-a-un-cabinet-comptable) | AI Act et conformité des outils | Numérique, IT et data | how-to-guide | 3 | planned |
| 2027-01-14 | [La checklist pour savoir si une exception doit remonter à un humain](/blog/checklist-pour-savoir-si-une-exception-doit-remonter-a-un-humain) | Validation humaine et cas de refus | Méthode et décision humaine | listicle-checklist | 3 | planned |
| 2027-01-14 | [Les modifications de classeur Excel qu'il ne faut jamais faire sans verrou](/blog/les-modifications-de-classeur-excel-qu-il-ne-faut-jamais-faire-sans-verrou) | Classeurs de suivi Excel | Excel et outils existants | how-to-guide | 3 | planned |
| 2027-01-15 | [RGPD et IA au cabinet : sous-traitance et secret professionnel](/blog/rgpd-et-ia-au-cabinet-sous-traitance-et-secret-professionnel) | RGPD, secret professionnel et sécurité | Numérique, IT et data | faq-knowledge | 3 | planned |
| 2027-01-15 | [Les imports d'export logiciel qui doivent toujours être rejoués sans créer de doublon](/blog/les-imports-d-export-logiciel-qui-doivent-toujours-etre-rejoues-sans-creer-de-doublon) | Exports et imports des logiciels | Excel et outils existants | how-to-guide | 3 | planned |
| 2027-01-15 | [La checklist du protocole de mesure avant-après une automatisation](/blog/checklist-du-protocole-de-mesure-avant-apres-une-automatisation) | Mesurer le temps gagné | Méthode et décision humaine | listicle-checklist | 3 | planned |

### Semaine 2027-W03

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-18 | [Les hypothèses de prévisionnel qu'un générateur automatique ne fixe jamais seul](/blog/les-hypotheses-de-previsionnel-qu-un-generateur-automatique-ne-doit-jamais-fixer-seul) | Prévisionnel et business plan | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2027-01-18 | [Qu'est-ce qu'un connecteur entre logiciels, et quand s'en passer ?](/blog/qu-est-ce-qu-un-connecteur-entre-logiciels-et-quand-s-en-passer) | Connecteurs, imports et synchronisation | Numérique, IT et data | faq-knowledge | 3 | planned |
| 2027-01-18 | [La checklist de contrôle d'un prévisionnel avant remise au client](/blog/checklist-de-controle-d-un-previsionnel-avant-remise-au-client) | Prévisionnel et business plan | Conseil et missions spéciales | listicle-checklist | 3 | planned |
| 2027-01-19 | [Les cas qu'un jeu d'essai doit toujours inclure avant la recette](/blog/les-cas-qu-un-jeu-d-essai-doit-toujours-inclure-avant-la-recette) | Règle, jeu d’essai et recette | Méthode et décision humaine | how-to-guide | 3 | planned |
| 2027-01-19 | [AI Act : ce qu'un cabinet de dix personnes doit faire](/blog/ai-act-ce-qu-un-cabinet-de-dix-personnes-doit-faire) | AI Act et conformité des outils | Numérique, IT et data | faq-knowledge | 3 | planned |
| 2027-01-19 | [La checklist avant de présenter une trésorerie prévisionnelle au client](/blog/checklist-avant-de-presenter-une-tresorerie-previsionnelle-au-client) | Trésorerie prévisionnelle | Conseil et missions spéciales | listicle-checklist | 3 | planned |
| 2027-01-20 | [Les décisions qu'une automatisation ne prend jamais à la place de l'expert-comptable](/blog/les-decisions-qu-une-automatisation-ne-doit-jamais-prendre-a-la-place-de-l-expert-comptable) | Validation humaine et cas de refus | Méthode et décision humaine | how-to-guide | 3 | planned |
| 2027-01-20 | [Ce qu'Excel tient, et ce qu'il ne tient plus](/blog/ce-qu-excel-tient-et-ce-qu-il-ne-tient-plus) | Classeurs de suivi Excel | Excel et outils existants | faq-knowledge | 3 | planned |
| 2027-01-20 | [La checklist des pièces d'un dossier de financement avant dépôt](/blog/checklist-des-pieces-d-un-dossier-de-financement-avant-depot) | Financement et aides | Conseil et missions spéciales | listicle-checklist | 3 | planned |
| 2027-01-21 | [Ce qu'un gain de temps mesuré ne doit jamais généraliser sans le dire](/blog/ce-qu-un-gain-de-temps-mesure-ne-doit-jamais-generaliser-sans-le-dire) | Mesurer le temps gagné | Méthode et décision humaine | how-to-guide | 3 | planned |
| 2027-01-21 | [Qu'est-ce qu'un export logiciel, et comment vérifier son schéma avant import ?](/blog/qu-est-ce-qu-un-export-logiciel-et-comment-verifier-son-schema-avant-import) | Exports et imports des logiciels | Excel et outils existants | faq-knowledge | 3 | planned |
| 2027-01-21 | [Pièces reçues en audit : distinguer dépôt et réponse exploitable](/blog/cac-pieces-recues-exploitables) | Demandes de documents | Certification des comptes | listicle-checklist | 3 | planned |
| 2027-01-22 | [Tension de trésorerie détectée : ce qu'un outil de projection ne décide jamais seul](/blog/tension-de-tresorerie-detectee-ce-qu-un-outil-de-projection-ne-decide-jamais-seul) | Trésorerie prévisionnelle | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2027-01-22 | [Informations produites par l’entité : décrire l’extraction demandée](/blog/cac-ipe-extraction-demandee) | Demandes de documents | Certification des comptes | faq-knowledge | 3 | planned |
| 2027-01-22 | [La checklist des éléments chiffrés à réunir avant une évaluation d'entreprise](/blog/checklist-des-elements-chiffres-a-reunir-avant-une-evaluation-d-entreprise) | Évaluation et transmission | Conseil et missions spéciales | listicle-checklist | 3 | planned |

### Semaine 2027-W04

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-25 | [Relance de documents en audit : arrêter la règle sur les cas contestés](/blog/cac-relance-documents-arret) | Demandes de documents | Certification des comptes | how-to-guide | 3 | planned |
| 2027-01-25 | [Qu'est-ce qu'une tâche répétitive automatisable, dans un cabinet comptable ?](/blog/qu-est-ce-qu-une-tache-repetitive-automatisable-dans-un-cabinet-comptable) | Choisir et cadrer une automatisation | Méthode et décision humaine | faq-knowledge | 3 | planned |
| 2027-01-25 | [NEP 315 et 330 : préparer les demandes de documents par cycle](/blog/cac-demandes-documents-cycles) | Demandes de documents | Certification des comptes | tutorial | 1 | planned |
| 2027-01-26 | [Les signaux qui disent qu'une tâche n'est pas prête à être automatisée](/blog/les-signaux-qui-disent-qu-une-tache-n-est-pas-prete-a-etre-automatisee) | Choisir et cadrer une automatisation | Méthode et décision humaine | listicle-checklist | 3 | planned |
| 2027-01-26 | [Projet de rapport CAC : laisser l’opinion en blanc et arrêter dans le doute](/blog/cac-projet-rapport-opinion-en-blanc) | Synthèse et lettre d’affirmation | Certification des comptes | how-to-guide | 3 | planned |
| 2027-01-26 | [Ce qu'il ne faut pas automatiser dans un cabinet](/blog/ce-qu-il-ne-faut-pas-automatiser-dans-un-cabinet) | Validation humaine et cas de refus | Méthode et décision humaine | faq-knowledge | 3 | planned |
| 2027-01-27 | [Revue analytique en audit : un exemple de variations à expliquer](/blog/cac-revue-analytique-exemple) | Revue analytique | Certification des comptes | tutorial | 1 | planned |
| 2027-01-27 | [Les dossiers de financement qu'un cabinet ne dépose jamais sans relecture de l'associé](/blog/les-dossiers-de-financement-qu-un-cabinet-ne-doit-jamais-deposer-sans-relecture-de-l-associe) | Financement et aides | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2027-01-27 | [Variations N/N-1 : traiter les soldes nuls et les nouveaux comptes](/blog/cac-variations-zero-nouveaux-comptes) | Revue analytique | Certification des comptes | listicle-checklist | 3 | planned |
| 2027-01-28 | [Qu'est-ce qu'un gain de temps mesuré, en automatisation de cabinet ?](/blog/qu-est-ce-qu-un-gain-de-temps-mesure-en-automatisation-de-cabinet) | Mesurer le temps gagné | Méthode et décision humaine | faq-knowledge | 3 | planned |
| 2027-01-28 | [Lettre d’affirmation CAC : préparer les éléments et suivre la signature](/blog/cac-lettre-affirmation-preparation) | Synthèse et lettre d’affirmation | Certification des comptes | tutorial | 1 | planned |
| 2027-01-28 | [La méthode d'évaluation qu'un outil ne choisit jamais seul](/blog/la-methode-d-evaluation-qu-un-outil-ne-doit-jamais-choisir-seul) | Évaluation et transmission | Conseil et missions spéciales | how-to-guide | 3 | planned |
| 2027-01-29 | [Mémos vers la synthèse CAC : garder le renvoi à chaque observation](/blog/cac-memos-synthese-renvois) | Synthèse et lettre d’affirmation | Certification des comptes | listicle-checklist | 3 | planned |
| 2027-01-29 | [Qu'est-ce qu'une trésorerie prévisionnelle, et comment se construit-elle ?](/blog/qu-est-ce-qu-une-tresorerie-previsionnelle-et-comment-elle-se-construit) | Trésorerie prévisionnelle | Conseil et missions spéciales | faq-knowledge | 3 | planned |
| 2027-01-29 | [Feuille maîtresse d’audit : un exemple de passage de la balance au cycle](/blog/cac-feuille-maitresse-exemple) | Dossier de travail | Certification des comptes | tutorial | 1 | planned |

### Semaine 2027-W05

| Date | Article | Famille | Pôle | Format | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-01 | [Quelles aides un cabinet comptable aide-t-il à mobiliser pour ses clients ?](/blog/quelles-aides-un-cabinet-comptable-aide-t-il-a-mobiliser-pour-ses-clients) | Financement et aides | Conseil et missions spéciales | faq-knowledge | 3 | planned |
| 2027-02-01 | [Écritures inhabituelles dans le FEC : qualifier un signal sans accuser](/blog/cac-ecritures-inhabituelles-qualification) | Sélection des écritures | Certification des comptes | listicle-checklist | 3 | planned |
| 2027-02-01 | [IA cabinet comptable : ce qu’elle prépare, ce que vous décidez](/blog/ia-cabinet-comptable) | IA générative et agents | Numérique, IT et data | pillar-page | 1 | a-replanifier |
| 2027-02-02 | [Versionner le FEC reçu en audit sans perdre la trace des contrôles](/blog/cac-fec-reception-versions) | Réception du FEC | Certification des comptes | how-to-guide | 3 | planned |
| 2027-02-02 | [Calendrier du commissaire aux comptes : préparer les repères par mandat](/blog/cac-calendrier-mandats) | Mandats et préparation du déclaratif | Administration et direction CAC | tutorial | 1 | planned |
| 2027-02-02 | [Référencement du dossier d’audit : retrouver chaque feuille et sa pièce](/blog/cac-referencement-dossier) | Dossier de travail | Certification des comptes | listicle-checklist | 3 | planned |
| 2027-02-03 | [Barème d’heures CAC : distinguer calcul, budget et temps réalisé](/blog/cac-bareme-budget-realise) | Mandats et préparation du déclaratif | Administration et direction CAC | faq-knowledge | 3 | planned |
| 2027-02-03 | [Revue des écritures : refuser une sélection sur une population incomplète](/blog/cac-revue-ecritures-limites-population) | Sélection des écritures | Certification des comptes | how-to-guide | 3 | planned |

