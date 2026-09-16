---
statut: valide
auteur: hermes
---

# FIX-C — rapport final du candidat Ressources v3

> **Rapport historique remplacé par la recette R4.** Le 15 septembre 2026, `t_54774b16` a restauré les articles publics exacts de `939464c` puis migré les dossiers sans nouvelle collecte ni attestation. Le PASS ci-dessous portait sur les brouillons périmés de `92ec8350` : il ne décrit pas le candidat courant. Verdict courant, limites et preuves : [freshness-r4-exec.md](freshness-r4-exec.md). Les anciens hashes et mesures ci-dessous sont conservés comme historique, pas comme preuve actuelle.

Date de scellement : `2026-09-15T09:48:47.028Z`.

## Verdict

**PASS mécanique local — `AI_REVIEW_PASS` PENDING — non publié.**

Le candidat ferme les cinq défauts R2 et les deux réserves des contre-revues sans fabriquer de verdict paie/social. Les deux articles restent des brouillons de candidat : leur rendu de contrôle est explicitement sélectionné par `BLOG_PREVIEW_SLUGS`, porte `noindex`, et reste exclu du sitemap et du RSS. Aucun push, preview distante, déploiement, publication, envoi externe ou cron n'a été exécuté.

## Identité et comptes recalculés

| Surface | Manifeste | Unités | Claims | Citations | Sources | candidateHash | auditHash | SHA-256 manifeste |
|---|---|---:|---:|---:|---:|---|---|---|
| H | `editorial/resources/hub/manifest.json` | 3 | 10 | 10 | 6 | `602da2df7c598f343f822a3bf6322edba1dc204a6394cd392b6c50f97d580918` | `f6c5e7dbe66322df2833683516bd081db24a642b799f12ce4c9038970eada899` | `bf66ea7ab7b829f460634649093e9236b4fe3a7785a83263e57dd2b159e2ace5` |
| T | `editorial/resources/glossaire/manifest.json` | 38 | 39 | 47 | 9 | `450250f6c6376d7ea8bcf58ef260df1a1a9d8b425ca715a448e990dcb67700e4` | `3bd7d5664139f610cc4a8e7e35e5b752745c18fa62729f42d88c0335b9719adc` | `bd7a59bb6fa487c5316878b431fec9a6d0c3ab6c010ba08dc17aee2b04097eab` |

Total exact : **41 unités, 49 claims, 57 citations**. Zéro unité, claim, citation ou source orpheline selon l'oracle bidirectionnel. Le registre machine-lisible est `docs/qa/hub-ressources/metier-fix-c-register.json` (`19c937be73aa79d8e42c2890eaa2824e99884680b842d8dea47ad71f2e04d878`).

## Les cinq défauts R2 fermés

| Défaut | Fermeture mesurée |
|---|---|
| P0-01 — articles Blog non autoritaires/non tracés | Articles et dossiers importés depuis `92ec8350bb7810bd64f6a0507dc02efd1ebdf244`; hashes exacts `0a341080fd998fa54364ab0dfd47440a0f6eb8e724242abd6a3dfa8761694a85` et `256952640851bcdb9f23a53d526e149ee1bd7e706e601712fe7c6020a23a61a8`; `blog:audit` compte 2 pipeline, 0 legacy-preserved, 0 bloqué. |
| P0-02 — inventaire incomplet | 41/41 unités visibles inventoriées : H=3, T=38. |
| P1-01 — relations/orphelines | Projection exacte unité↔claim↔citation↔source, 0 relation invalide. |
| P1-02 — résumés H non atomiques | Résumé DSN divisé en 5 claims et résumé suivi social en 4 claims, chacun avec source et citation propres. |
| P1-03 — date ambiguë | `validAsOf` est prouvé par le jour du `checkedAt` de la source ; 0 champ contractuel `effectiveDate` dans les 9 fichiers du contrat v3. |

## Réserves de contre-revue fermées

- P1-E01 : `recouvrement-amiable.commonConfusion` contient deux sous-claims atomiques. La doctrine Memlia « un simple retard ne doit pas déclencher automatiquement un envoi » dépend de `source-glossary-memlia`; la séquence relance/mise en demeure dépend séparément de `source-service-public-recouvrement`.
- P1 scelleur : `docs/qa/hub-ressources/metier-fix-c-build-receipt.json` (`a688c611c11c80f85b4a2e7ea334e660b75c6f2f2ce6ca7270da414b1c8a8f0e`) porte les commandes et codes de sortie, puis lie les quatre digests source/asset/config/output de chaque surface au snapshot exact. Le validateur recalcule le hash du reçu. Le mutant « timestamps frais sans reçu » est refusé.

## Score projeté et gate métier

- Grille mécanique : **85/100 bruts** ; le critère SERP vaut `ND` et rapporte 0/15.
- Projection contractuelle normalisée sur les 85 points mesurables : **100/100 mécanique**.
- Score métier final : **non établi**. `businessReview.status=PENDING`, aucun reviewer `metier`, aucun verdict claim/source et aucun `AI_REVIEW_PASS` ne sont présents. Le build complet s'arrête donc honnêtement au seul gate métier, avec 59 diagnostics dérivés de cette preuve absente.
- Proposition d'article soumise à Kevin : **aucune**. Les deux dossiers autoritaires ont été repris à l'identique.

## Sources et classifications

| Source | Éditeur | Classification | checkedAt | Snapshot | SHA-256 snapshot |
|---|---|---|---|---|---|
| `source-cnil-anonymisation` | CNIL | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-anonymisation.txt` | `15ce8529147ae5e9110d8cfef05434a1bf404fd7c56f1936c2970eabf98030a7` |
| `source-cnil-controle-activite` | CNIL | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-controle-activite.txt` | `f2c64ee8a487847e6fe864a168e5835e77abc86c376e9c84d1c4d29815fa10d3` |
| `source-cnil-donnee` | CNIL | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-donnee.txt` | `640d1c3a0fbe442918ddc8df0637e6a0cab8097ec1cf71550cba7474dcd9e5de` |
| `source-cnil-rgpd` | CNIL | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-rgpd.txt` | `9070dc4ae25949e60a5828f8655185c60380f78c1b5fa01204466d08daffcd90` |
| `source-glossary-memlia` | Memlia | méthode originale Memlia | `2026-09-14T15:37:40+01:00` | `src/data/glossary.ts` | `ac184aa5e5050cc5b00009343a39c14eb9badd010a209745202e357e2aa54e0c` |
| `source-hub-memlia` | Memlia | méthode originale Memlia | `2026-09-14T15:37:40+01:00` | `src/pages/ressources.astro` | `403ec36bf1469f3b87ce93c8f50b66fff53b9633c5e26c8f0eb639a0efaf86fe` |
| `source-net-annule` | Net-entreprises (GIP-MDS) | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/net-annule.txt` | `378a556297ccb0c0eaa25b61b3db9a23c8b2bf68d86d47a4a78fa7b5cd0bbca9` |
| `source-net-crm` | Net-entreprises (GIP-MDS) | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/net-crm.txt` | `91947e373079dcfdcc9aa08a0687e19114925388b24c2e3a8d8ac37bdf15cf15` |
| `source-net-dsn-overview` | Net-entreprises (GIP-MDS) | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-overview.txt` | `a1eaf288ec3d9c0db15357a4827bca6a5c081311ffe57d539f0f685868a78acf` |
| `source-net-dsn-val` | Net-entreprises (GIP-MDS) | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-val.txt` | `9834a215c9c9e3958c928cfaae86403dcde770e4bc810ea01fd804bbca32db34` |
| `source-service-public-recouvrement` | Service-Public Entreprendre | tier-1 officielle primaire | `2026-09-14T15:37:40+01:00` | `docs/qa/hub-ressources/metier-fix-a-sources/service-public-recouvrement.txt` | `af2f1cc9f8cb1d6611c58dc4cfe9db371013e19eb35bb465fa9a321260d9ebda` |
| `source-summaries-memlia` | Memlia | méthode originale Memlia | `2026-09-14T15:37:40+01:00` | `src/data/resource-summaries.json` | `d1adfb5605c20a34c194e9b7c8884b543649013bf9b8032733d23ef978241ce4` |

## Inventaire des 41 assertions, citations et applicabilités

| Surface | Unité | Texte visible | Claims | Citations | Sources | Applicabilité / régime / validAsOf / exceptions |
|---|---|---|---|---|---|---|
| H | `unit-h-description` | Des ressources pour comprendre, vérifier et cadrer les tâches d’un cabinet, sans céder la décision humaine. | `claim-h-description` | `citation-h-description-1` | `source-hub-memlia` | claim-h-description: population=Promesse éditoriale du Hub ; elle décrit la posture des ressources.; régime=Positionnement éditorial Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Les résumés réglementaires rendus par le Hub possèdent leurs propres claims et preuves. |
| H | `unit-h-dsn-deadline-summary` | Méthode Memlia : une liste de contrôles écrite, rejouée chaque mois ; le cabinet décide. Pour une DSN mensuelle, l’annule et remplace se ferme la veille de l’échéance à minuit. Pour un signalement d’événement, l’annule et remplace peut être envoyé dès que nécessaire, sans date limite d’envoi. DSN-Val teste le fichier avant dépôt selon le cahier technique et le JMN associés. Les comptes rendus métier transmettent les retours des organismes après réception de la déclaration. | `claim-h-dsn-deadline-summary-1`, `claim-h-dsn-deadline-summary-2`, `claim-h-dsn-deadline-summary-3`, `claim-h-dsn-deadline-summary-4`, `claim-h-dsn-deadline-summary-5` | `citation-claim-h-dsn-deadline-summary-1-1`, `citation-claim-h-dsn-deadline-summary-2-1`, `citation-claim-h-dsn-deadline-summary-3-1`, `citation-claim-h-dsn-deadline-summary-4-1`, `citation-claim-h-dsn-deadline-summary-5-1` | `source-net-annule`, `source-net-crm`, `source-net-dsn-val`, `source-summaries-memlia` | claim-h-dsn-deadline-summary-1: population=Méthode ou doctrine propre au service Memlia décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Les règles DSN et CNIL sont séparées dans les autres sous-claims. ; claim-h-dsn-deadline-summary-2: population=DSN mensuelle dans la fenêtre propre à l’échéance de l’entreprise.; régime=DSN mensuelle annule-et-remplace, distincte des signalements d’événement.; validAsOf=2026-09-14; exceptions=Les signalements d’événement suivent une autre fenêtre, explicitée près du claim dans le glossaire. ; claim-h-dsn-deadline-summary-3: population=Signalements d’événement en DSN.; régime=Annule-et-remplace de signalement, et non DSN mensuelle.; validAsOf=2026-09-14; exceptions=Ne pas appliquer cette absence de limite à la DSN mensuelle. ; claim-h-dsn-deadline-summary-4: population=Fichiers DSN contrôlés avant dépôt, selon le cahier technique et le JMN applicables.; régime=Contrôle de norme DSN selon le cahier technique et le JMN applicables au fichier.; validAsOf=2026-09-14; exceptions=Un contrôle de norme ne prouve pas l’exactitude métier des variables de paie. ; claim-h-dsn-deadline-summary-5: population=Déclarations reçues et analysées par les organismes destinataires.; régime=Comptes rendus métier émis par les organismes destinataires d’une DSN.; validAsOf=2026-09-14; exceptions=Les CRM diffèrent selon l’organisme ; leur silence ne garantit pas la justesse générale. |
| H | `unit-h-social-monitoring-summary` | Doctrine Memlia : suivre les dossiers et les étapes, jamais classer les personnes. Sauf exception légale, un dispositif de contrôle de l’activité du personnel doit être justifié et proportionné. Il doit être porté à la connaissance des personnes concernées avant sa mise en place. Dans les entreprises privées de 50 salariés et plus, l’employeur doit consulter le CSE sur ce dispositif. | `claim-h-social-monitoring-summary-1`, `claim-h-social-monitoring-summary-2`, `claim-h-social-monitoring-summary-3`, `claim-h-social-monitoring-summary-4` | `citation-claim-h-social-monitoring-summary-1-1`, `citation-claim-h-social-monitoring-summary-2-1`, `citation-claim-h-social-monitoring-summary-3-1`, `citation-claim-h-social-monitoring-summary-4-1` | `source-cnil-controle-activite`, `source-summaries-memlia` | claim-h-social-monitoring-summary-1: population=Méthode ou doctrine propre au service Memlia décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Les règles DSN et CNIL sont séparées dans les autres sous-claims. ; claim-h-social-monitoring-summary-2: population=Dispositif qui permet le contrôle de l’activité du personnel ; consultation CSE formulée ici pour les entreprises privées de 50 salariés et plus.; régime=Contrôle de l’activité du personnel et consultation du CSE dans le secteur privé.; validAsOf=2026-09-14; exceptions=La qualification dépend du dispositif ; les exceptions légales et les autres instances du secteur public ne sont pas généralisées au Hub. ; claim-h-social-monitoring-summary-3: population=Dispositif qui permet le contrôle de l’activité du personnel ; consultation CSE formulée ici pour les entreprises privées de 50 salariés et plus.; régime=Contrôle de l’activité du personnel et consultation du CSE dans le secteur privé.; validAsOf=2026-09-14; exceptions=La qualification dépend du dispositif ; les exceptions légales et les autres instances du secteur public ne sont pas généralisées au Hub. ; claim-h-social-monitoring-summary-4: population=Dispositif qui permet le contrôle de l’activité du personnel ; consultation CSE formulée ici pour les entreprises privées de 50 salariés et plus.; régime=Contrôle de l’activité du personnel et consultation du CSE dans le secteur privé.; validAsOf=2026-09-14; exceptions=La qualification dépend du dispositif ; les exceptions légales et les autres instances du secteur public ne sont pas généralisées au Hub. |
| T | `unit-t-dsn` | La déclaration sociale nominative (DSN) est obligatoire pour les entreprises du secteur privé ainsi que pour la fonction publique ; elle remplace des formalités qui s’appuient sur les données de paie. | `claim-t-dsn` | `citation-t-dsn-1` | `source-net-dsn-overview` | claim-t-dsn: population=Entreprises du secteur privé et fonction publique concernées par la DSN en France.; régime=Déclaration sociale nominative française et formalités qu’elle remplace.; validAsOf=2026-09-14; exceptions=Les déclarations et signalements couverts par la DSN conservent leurs règles propres. |
| T | `unit-t-dsn-val` | DSN-Val est l’outil d’auto-contrôle qui teste un fichier DSN avant dépôt selon le cahier technique et le journal de maintenance de la norme associés. | `claim-t-dsn-val` | `citation-t-dsn-val-1` | `source-net-dsn-val` | claim-t-dsn-val: population=Fichiers DSN contrôlés avant dépôt, selon le cahier technique et le JMN applicables.; régime=Contrôle de norme DSN selon le cahier technique et le JMN applicables au fichier.; validAsOf=2026-09-14; exceptions=Un contrôle de norme ne prouve pas l’exactitude métier des variables de paie. |
| T | `unit-t-compte-rendu-metier-dsn` | Un compte rendu métier est le retour d’un organisme ou d’une administration après réception d’une déclaration lorsqu’une erreur ou une suspicion d’erreur est détectée ; il peut aussi confirmer la qualité du traitement reçu. | `claim-t-compte-rendu-metier-dsn` | `citation-t-compte-rendu-metier-dsn-1`, `citation-t-compte-rendu-metier-dsn-2` | `source-net-crm` | claim-t-compte-rendu-metier-dsn: population=Déclarations reçues et analysées par les organismes destinataires.; régime=Comptes rendus métier émis par les organismes destinataires d’une DSN.; validAsOf=2026-09-14; exceptions=Les CRM diffèrent selon l’organisme ; leur silence ne garantit pas la justesse générale. |
| T | `unit-t-annule-et-remplace-dsn` | Une DSN « annule et remplace » remplace une déclaration déjà transmise dans la fenêtre autorisée pour ce type de déclaration. | `claim-t-annule-et-remplace-dsn` | `citation-t-annule-et-remplace-dsn-1` | `source-net-annule` | claim-t-annule-et-remplace-dsn: population=DSN mensuelle dans la fenêtre propre à l’échéance de l’entreprise.; régime=DSN mensuelle annule-et-remplace, distincte des signalements d’événement.; validAsOf=2026-09-14; exceptions=Les signalements d’événement suivent une autre fenêtre, explicitée près du claim dans le glossaire. |
| T | `unit-t-controle-avant-dsn` | Dans ce glossaire, Memlia appelle « contrôle avant DSN » l’ensemble des vérifications que le cabinet choisit de rejouer entre le calcul de la paie et le dépôt : pièces, variables, écarts, cohérences métier et conformité du fichier. | `claim-t-controle-avant-dsn` | `citation-t-controle-avant-dsn-1` | `source-glossary-memlia` | claim-t-controle-avant-dsn: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-production-sociale` | Dans ce glossaire, Memlia appelle « production sociale » le cycle de travail retenu par le cabinet pour collecter les variables, établir et contrôler les bulletins, déposer les déclarations puis traiter les retours et documents. | `claim-t-production-sociale` | `citation-t-production-sociale-1` | `source-glossary-memlia` | claim-t-production-sociale: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-donnee-personnelle` | Toute information se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement. | `claim-t-donnee-personnelle` | `citation-t-donnee-personnelle-1` | `source-cnil-donnee` | claim-t-donnee-personnelle: population=Informations se rapportant à une personne physique identifiée ou identifiable.; régime=Définition des données à caractère personnel au sens du RGPD.; validAsOf=2026-09-14; exceptions=L’identification peut être directe ou indirecte ; retirer le nom ne suffit pas nécessairement. |
| T | `unit-t-minimisation-des-donnees` | Principe selon lequel les données traitées doivent être adéquates, pertinentes et limitées à ce qui est nécessaire au regard de la finalité. | `claim-t-minimisation-des-donnees` | `citation-t-minimisation-des-donnees-1` | `source-cnil-rgpd` | claim-t-minimisation-des-donnees: population=Traitements de données à caractère personnel, au regard de finalités déterminées.; régime=Principe de minimisation des données prévu par le RGPD.; validAsOf=2026-09-14; exceptions=Le nécessaire s’apprécie selon la finalité ; une collecte « au cas où » n’est pas justifiée. |
| T | `unit-t-anonymisation` | Traitement visant à rendre impossible, en pratique, l’identification d’une personne par tout moyen raisonnablement utilisable et de manière irréversible. | `claim-t-anonymisation` | `citation-t-anonymisation-1` | `source-cnil-anonymisation` | claim-t-anonymisation: population=Jeu de données dont l’irréversibilité pratique doit être démontrée.; régime=Qualification d’anonymisation selon les critères exposés par la CNIL.; validAsOf=2026-09-14; exceptions=Pseudonymisation et agrégation trop fine ne suffisent pas à établir l’anonymat. |
| T | `unit-t-pseudonymisation` | Traitement de données personnelles réalisé de manière à ne plus pouvoir attribuer les données à une personne physique sans information supplémentaire. | `claim-t-pseudonymisation` | `citation-t-pseudonymisation-1` | `source-cnil-anonymisation` | claim-t-pseudonymisation: population=Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.; régime=Pseudonymisation de données personnelles au sens du RGPD.; validAsOf=2026-09-14; exceptions=Les données restent personnelles et l’opération est réversible. |
| T | `unit-t-agregat-non-nominatif` | Résultat regroupant des dossiers, étapes ou périodes sans afficher un indicateur par personne. | `claim-t-agregat-non-nominatif` | `citation-t-agregat-non-nominatif-1` | `source-glossary-memlia` | claim-t-agregat-non-nominatif: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-lettrage-comptable` | Dans ce glossaire, Memlia appelle « lettrage comptable » le rapprochement d’écritures que le cabinet considère comme liées, par exemple une facture et son règlement, au moyen d’un repère commun. | `claim-t-lettrage-comptable` | `citation-t-lettrage-comptable-1` | `source-glossary-memlia` | claim-t-lettrage-comptable: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-rapprochement-bancaire` | Dans ce glossaire, Memlia appelle « rapprochement bancaire » le contrôle qui compare les mouvements et le solde comptables d’un compte au relevé de la banque, puis prépare l’explication des écarts de date, d’omission ou d’erreur. | `claim-t-rapprochement-bancaire` | `citation-t-rapprochement-bancaire-1` | `source-glossary-memlia` | claim-t-rapprochement-bancaire: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-revision-comptable` | Dans ce glossaire, Memlia appelle « révision comptable » l’ensemble de contrôles défini par la mission du cabinet pour examiner les comptes, documenter les anomalies et préparer leur validation. | `claim-t-revision-comptable` | `citation-t-revision-comptable-1` | `source-glossary-memlia` | claim-t-revision-comptable: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-piece-justificative` | Dans ce glossaire, Memlia appelle « pièce justificative » le document ou la trace que le cabinet retient pour expliquer et étayer une opération enregistrée ou une décision de contrôle. | `claim-t-piece-justificative` | `citation-t-piece-justificative-1` | `source-glossary-memlia` | claim-t-piece-justificative: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-recouvrement-amiable` | Tentative d’obtenir le paiement d’une créance sans engager d’abord une action judiciaire, généralement par relance puis, en cas d’échec, par mise en demeure. | `claim-t-recouvrement-amiable` | `citation-t-recouvrement-amiable-1` | `source-service-public-recouvrement` | claim-t-recouvrement-amiable: population=Entreprise créancière confrontée à un retard de paiement client.; régime=Recouvrement amiable d’une créance professionnelle avant action judiciaire.; validAsOf=2026-09-14; exceptions=La relance et la mise en demeure sont distinctes ; aucun envoi automatique sans validation. |
| T | `unit-t-regle-de-cabinet` | Instruction explicite qui décrit ce que le cabinet attend d’une entrée donnée, les exceptions admises et le résultat à préparer. | `claim-t-regle-de-cabinet` | `citation-t-regle-de-cabinet-1` | `source-glossary-memlia` | claim-t-regle-de-cabinet: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-cas-de-refus` | Situation prévue dans laquelle le traitement s’arrête et demande une intervention au lieu de produire un résultat incertain. | `claim-t-cas-de-refus` | `citation-t-cas-de-refus-1` | `source-glossary-memlia` | claim-t-cas-de-refus: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-controle-de-coherence` | Dans ce glossaire, Memlia appelle « contrôle de cohérence » une vérification qui compare des données entre elles ou à une règle du cabinet pour faire ressortir une anomalie possible. | `claim-t-controle-de-coherence` | `citation-t-controle-de-coherence-1` | `source-glossary-memlia` | claim-t-controle-de-coherence: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-schema-de-donnees` | Dans le contrat technique Memlia, le « schéma de données » décrit la structure attendue d’un jeu de données : champs, types, formats, valeurs admises et relations utiles au traitement. | `claim-t-schema-de-donnees` | `citation-t-schema-de-donnees-1` | `source-glossary-memlia` | claim-t-schema-de-donnees: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-tracabilite` | Dans le contrat technique Memlia, la « traçabilité » permet de retrouver quelles entrées, quelle règle, quelle version et quel résultat ont conduit à une proposition ou à une décision. | `claim-t-tracabilite` | `citation-t-tracabilite-1` | `source-glossary-memlia` | claim-t-tracabilite: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-validation-humaine` | Étape où une personne compétente accepte, corrige ou refuse la proposition préparée avant qu’elle produise un effet métier. | `claim-t-validation-humaine` | `citation-t-validation-humaine-1` | `source-glossary-memlia` | claim-t-validation-humaine: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-fail-closed` | Dans le contrat technique Memlia, « fail-closed » désigne le comportement testé où une entrée inconnue, invalide ou ambiguë bloque le traitement au lieu d’autoriser une sortie par défaut. | `claim-t-fail-closed` | `citation-t-fail-closed-1` | `source-glossary-memlia` | claim-t-fail-closed: population=Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.; régime=Convention de vocabulaire ou contrat technique propre au service Memlia décrit.; validAsOf=2026-09-14; exceptions=La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique. |
| T | `unit-t-dsn-commonConfusion` | Convention Memlia : un fichier accepté techniquement reste soumis à la revue de paie du cabinet. | `claim-t-dsn-commonConfusion` | `citation-t-dsn-commonConfusion-1` | `source-glossary-memlia` | claim-t-dsn-commonConfusion: population=Convention interne Memlia appliquée au suivi du cabinet décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Ne constitue pas une règle juridique ni une garantie de conformité. |
| T | `unit-t-dsn-val-commonConfusion` | Convention Memlia : la recherche des primes oubliées relève de la revue du bulletin, distincte du test DSN-Val. | `claim-t-dsn-val-commonConfusion` | `citation-t-dsn-val-commonConfusion-1` | `source-glossary-memlia` | claim-t-dsn-val-commonConfusion: population=Convention interne Memlia appliquée au suivi du cabinet décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Ne constitue pas une règle juridique ni une garantie de conformité. |
| T | `unit-t-compte-rendu-metier-dsn-commonConfusion` | Convention Memlia : même sans anomalie visible dans un retour, le cabinet conserve sa revue de paie. | `claim-t-compte-rendu-metier-dsn-commonConfusion` | `citation-t-compte-rendu-metier-dsn-commonConfusion-1` | `source-glossary-memlia` | claim-t-compte-rendu-metier-dsn-commonConfusion: population=Convention interne Memlia appliquée au suivi du cabinet décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Ne constitue pas une règle juridique ni une garantie de conformité. |
| T | `unit-t-annule-et-remplace-dsn-commonConfusion` | Les mêmes délais ne valent pas pour chaque déclaration ou signalement. | `claim-t-annule-et-remplace-dsn-commonConfusion` | `citation-t-annule-et-remplace-dsn-commonConfusion-1`, `citation-t-annule-et-remplace-dsn-commonConfusion-2` | `source-net-annule` | claim-t-annule-et-remplace-dsn-commonConfusion: population=DSN mensuelle dans la fenêtre propre à l’échéance de l’entreprise.; régime=DSN mensuelle annule-et-remplace, distincte des signalements d’événement.; validAsOf=2026-09-14; exceptions=Les signalements d’événement suivent une autre fenêtre, explicitée près du claim dans le glossaire. |
| T | `unit-t-donnee-personnelle-context` | Une personne physique peut être identifiée directement ou indirectement. | `claim-t-donnee-personnelle-context` | `citation-t-donnee-personnelle-context-1`, `citation-t-donnee-personnelle-context-2` | `source-cnil-donnee` | claim-t-donnee-personnelle-context: population=Informations se rapportant à une personne physique identifiée ou identifiable.; régime=Définition des données à caractère personnel au sens du RGPD.; validAsOf=2026-09-14; exceptions=L’identification peut être directe ou indirecte ; retirer le nom ne suffit pas nécessairement. |
| T | `unit-t-donnee-personnelle-exampleFictitious` | Un tableau remplace les noms par des numéros, mais une table séparée permet de retrouver les personnes : les données restent personnelles. | `claim-t-donnee-personnelle-exampleFictitious` | `citation-t-donnee-personnelle-exampleFictitious-1`, `citation-t-donnee-personnelle-exampleFictitious-2` | `source-cnil-anonymisation` | claim-t-donnee-personnelle-exampleFictitious: population=Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.; régime=Pseudonymisation de données personnelles au sens du RGPD.; validAsOf=2026-09-14; exceptions=Les données restent personnelles et l’opération est réversible. |
| T | `unit-t-donnee-personnelle-commonConfusion` | Retirer le nom ne suffit pas toujours à sortir du champ du RGPD. | `claim-t-donnee-personnelle-commonConfusion` | `citation-t-donnee-personnelle-commonConfusion-1`, `citation-t-donnee-personnelle-commonConfusion-2` | `source-cnil-anonymisation` | claim-t-donnee-personnelle-commonConfusion: population=Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.; régime=Pseudonymisation de données personnelles au sens du RGPD.; validAsOf=2026-09-14; exceptions=Les données restent personnelles et l’opération est réversible. |
| T | `unit-t-minimisation-des-donnees-context` | Convention Memlia : le suivi retient l’état du dossier, pas l’enregistrement de chaque geste individuel. | `claim-t-minimisation-des-donnees-context` | `citation-t-minimisation-des-donnees-context-1` | `source-glossary-memlia` | claim-t-minimisation-des-donnees-context: population=Convention interne Memlia appliquée au suivi du cabinet décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Ne constitue pas une règle juridique ni une garantie de conformité. |
| T | `unit-t-minimisation-des-donnees-commonConfusion` | La finalité du traitement détermine quelles données sont nécessaires ; une colonne sans nécessité au regard de cette finalité est exclue. | `claim-t-minimisation-des-donnees-commonConfusion` | `citation-t-minimisation-des-donnees-commonConfusion-1` | `source-cnil-rgpd` | claim-t-minimisation-des-donnees-commonConfusion: population=Traitements de données à caractère personnel, au regard de finalités déterminées.; régime=Principe de minimisation des données prévu par le RGPD.; validAsOf=2026-09-14; exceptions=Le nécessaire s’apprécie selon la finalité ; une collecte « au cas où » n’est pas justifiée. |
| T | `unit-t-anonymisation-context` | Convention Memlia : nous réservons le mot « anonyme » à un résultat dont les possibilités de réidentification ont été examinées. | `claim-t-anonymisation-context` | `citation-t-anonymisation-context-1` | `source-glossary-memlia` | claim-t-anonymisation-context: population=Convention interne Memlia appliquée au suivi du cabinet décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Ne constitue pas une règle juridique ni une garantie de conformité. |
| T | `unit-t-anonymisation-commonConfusion` | Les données pseudonymisées conservent un caractère personnel ; la pseudonymisation est réversible, contrairement à l’anonymisation. | `claim-t-anonymisation-commonConfusion` | `citation-t-anonymisation-commonConfusion-1`, `citation-t-anonymisation-commonConfusion-2` | `source-cnil-anonymisation` | claim-t-anonymisation-commonConfusion: population=Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.; régime=Pseudonymisation de données personnelles au sens du RGPD.; validAsOf=2026-09-14; exceptions=Les données restent personnelles et l’opération est réversible. |
| T | `unit-t-pseudonymisation-context` | Remplacer un nom par un identifiant limite l’exposition directe, mais les données restent personnelles si la personne peut être retrouvée. | `claim-t-pseudonymisation-context` | `citation-t-pseudonymisation-context-1`, `citation-t-pseudonymisation-context-2` | `source-cnil-anonymisation` | claim-t-pseudonymisation-context: population=Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.; régime=Pseudonymisation de données personnelles au sens du RGPD.; validAsOf=2026-09-14; exceptions=Les données restent personnelles et l’opération est réversible. |
| T | `unit-t-pseudonymisation-commonConfusion` | La pseudonymisation n’est ni une anonymisation ni une sortie du RGPD. | `claim-t-pseudonymisation-commonConfusion` | `citation-t-pseudonymisation-commonConfusion-1`, `citation-t-pseudonymisation-commonConfusion-2` | `source-cnil-anonymisation` | claim-t-pseudonymisation-commonConfusion: population=Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.; régime=Pseudonymisation de données personnelles au sens du RGPD.; validAsOf=2026-09-14; exceptions=Les données restent personnelles et l’opération est réversible. |
| T | `unit-t-agregat-non-nominatif-commonConfusion` | Convention Memlia : nous ne déclarons jamais un export anonyme ou conforme au seul motif que ses lignes sont regroupées. | `claim-t-agregat-non-nominatif-commonConfusion` | `citation-t-agregat-non-nominatif-commonConfusion-1` | `source-glossary-memlia` | claim-t-agregat-non-nominatif-commonConfusion: population=Convention interne Memlia appliquée au suivi du cabinet décrit.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Ne constitue pas une règle juridique ni une garantie de conformité. |
| T | `unit-t-recouvrement-amiable-commonConfusion` | Convention Memlia : un simple retard ne doit pas déclencher automatiquement un envoi. Une relance précède généralement la mise en demeure en cas d’échec ; ce sont deux étapes distinctes. | `claim-t-recouvrement-amiable-commonConfusion-doctrine`, `claim-t-recouvrement-amiable-commonConfusion-sequence` | `citation-t-recouvrement-amiable-commonConfusion-doctrine-1`, `citation-t-recouvrement-amiable-commonConfusion-sequence-1` | `source-glossary-memlia`, `source-service-public-recouvrement` | claim-t-recouvrement-amiable-commonConfusion-doctrine: population=Convention interne Memlia appliquée à la préparation des relances du cabinet.; régime=Doctrine Memlia, sans portée réglementaire autonome.; validAsOf=2026-09-14; exceptions=Le cabinet décide selon le statut réel du dossier ; cette doctrine ne qualifie pas juridiquement la créance. ; claim-t-recouvrement-amiable-commonConfusion-sequence: population=Entreprise créancière confrontée à un retard de paiement client.; régime=Recouvrement amiable d’une créance professionnelle avant action judiciaire.; validAsOf=2026-09-14; exceptions=La relance et la mise en demeure sont distinctes ; aucun envoi automatique sans validation. |

## Dossiers Blog importés du commit autoritaire

- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/claims.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/image.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/manifest.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/business-review-deferral.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/cannibalization.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/generation.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/img-23-controle-bulletins-paie-1200.avif`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/img-23-controle-bulletins-paie-1200.webp`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/img-23-controle-bulletins-paie-1600.avif`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/img-23-controle-bulletins-paie-1600.webp`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/img-23-controle-bulletins-paie-768.avif`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/img-23-controle-bulletins-paie-768.webp`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/master.png`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/og.webp`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/prompt.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/image/visual-review.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/research-gsc.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/research-serp.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/review.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/role.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-analyze.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-audit.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-brand.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-brief.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-calendar.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-cannibalization.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-cluster.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-factcheck.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-flow.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-geo.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-image.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-outline.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-persona.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-rewrite.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-schema.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-seo-check.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-strategy.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/blog-taxonomy.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-audit.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-cluster.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-content-brief.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-content.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-dataforseo.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-flow.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-geo.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-images.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-page.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-plan.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-schema.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-sitemap.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-sxo.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/skills/seo-technical.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-crm.classification.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-crm.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-crm.source.txt`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-dsn-val.classification.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-dsn-val.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-dsn-val.source.txt`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-fiabilisation.classification.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-fiabilisation.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/net-entreprises-fiabilisation.source.txt`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/service-public-dsn.classification.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/service-public-dsn.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/preuves/sources/service-public-dsn.source.txt`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/review.json`
- `editorial/articles/controler-les-bulletins-de-paie-avant-la-dsn/skills.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/claims.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/image.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/manifest.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/business-review-deferral.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/cannibalization.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/generation.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/img-24-suivi-production-sociale-1200.avif`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/img-24-suivi-production-sociale-1200.webp`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/img-24-suivi-production-sociale-1600.avif`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/img-24-suivi-production-sociale-1600.webp`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/img-24-suivi-production-sociale-768.avif`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/img-24-suivi-production-sociale-768.webp`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/master.png`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/og.webp`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/prompt.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/image/visual-review.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/research-gsc.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/research-serp.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/review.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/role.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-analyze.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-audit.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-brand.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-brief.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-calendar.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-cannibalization.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-cluster.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-decay.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-factcheck.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-flow.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-geo.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-google.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-image.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-outline.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-persona.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-rewrite.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-schema.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-seo-check.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-strategy.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/blog-taxonomy.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-audit.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-backlinks.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-cluster.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-content-brief.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-content.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-dataforseo.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-drift.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-flow.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-geo.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-google.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-images.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-page.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-plan.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-schema.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-sitemap.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-sxo.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/skills/seo-technical.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/cnil-employee-monitoring.classification.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/cnil-employee-monitoring.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/cnil-employee-monitoring.source.txt`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/microsoft-excel-tables.classification.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/microsoft-excel-tables.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/microsoft-excel-tables.source.txt`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/microsoft-protect-sheet.classification.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/microsoft-protect-sheet.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/preuves/sources/microsoft-protect-sheet.source.txt`
- `editorial/articles/suivre-la-production-sociale-dans-excel/review.json`
- `editorial/articles/suivre-la-production-sociale-dans-excel/skills.json`

Les fichiers Markdown associés sous `src/content/blog/` sont byte-identiques au commit autoritaire. Le baseline historique demeure uniquement comme garde de compatibilité : la présence des dossiers complets classe les deux articles `pipeline` avant toute exemption legacy.

## Commandes et codes de sortie mesurés

| Commande | Code | Résultat |
|---|---:|---|
| `npm run resource:seal-surfaces` | 0 | bootstrap Astro + scellement + build candidat vérifié ; Python 56/56, Blog 68/68 + rendu 1/1, Ressources 35/35 |
| `npm run check` | 0 | 105 fichiers, 0 erreur, 0 warning, 1 hint préexistant |
| `npm run blog:audit` | 0 | 2 pipeline, 0 legacy-preserved, 0 bloqué |
| `python3 -m unittest discover -s tests/proof -p test_resource_v3_traceability.py -v` | 0 | 5/5 |
| `npm run resource:audit:qa` | 1 attendu | 2 surfaces liées, 0 orpheline ; 59 diagnostics exclusivement dus à `AI_REVIEW_PASS` absent |
| `BLOG_PREVIEW_SLUGS=... QA_URL=http://127.0.0.1:4387 npm run test` | 0 | Playwright 100/100, dont 375 et 1440 px |
| `BLOG_PREVIEW_SLUGS=... npm run build` | 1 attendu | Blog et `build:site` verts ; arrêt au seul audit métier PENDING |
| `git diff --check` | 0 | aucune erreur d'espace |

## Passe écran

Captures fraîches locales : `/tmp/t_a29a7b32-ressources-375.png`, `/tmp/t_a29a7b32-glossaire-1440-top.png`. La page Ressources à 375 px et le haut du Glossaire à 1440 px sont PASS visuels : aucun chevauchement, texte coupé, débordement horizontal ou composant cassé. Les tests navigateur couvrent aussi les deux pages sur 320, 375, 768, 1024, 1440 et 1920 px.

## Limites

- Contenu paie/social non attesté ; `AI_REVIEW_PASS` reste PENDING.
- G5 preview/approbation et G6 release restent PENDING.
- SERP Hub desktop reste `ND`; aucune recherche n'a été relancée et aucun point SEO brut n'est attribué.
- Le candidat n'a été ni poussé ni déployé.
