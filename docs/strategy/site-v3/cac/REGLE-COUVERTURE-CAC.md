# Règle de couverture CAC (06/10/2026)

Cette règle prime sur les familles et les cartes de pages d’`ARCHITECTURE-CAC.md`, qui est un fichier généré par `build_cac_architecture.py`. Le générateur devra l’intégrer à sa prochaine version.

## Pourquoi

Au premier rendez-vous CAC, le cabinet travaillait sur Acropole Expert CAC. Ce que nous lui montrions, son outil le faisait déjà : réception du FEC, collecte des pièces par AUDITdrive, modèles de rapport, ossature du dossier, déclaration d’activité, archivage. Sa réponse : « je le fais déjà ». La seule tâche qu’il attendait est la sélection des tiers à circulariser. Aucune suite ni aucune plateforme ne l’automatise.

La vérification porte sur six suites (Acropole Expert CAC, Auditsoft, RevisAudit, DreamAudit, Caseware, PackAUDIT) et quatre plateformes (e-Circu, Auditsoft Anywhere, Circit, Confirmation). Les preuves datées sont dans le chantier `cac-site-niveau-superieur`, dossier `sorties/couverture-logiciels-2026-10-06/` (coffre Memlia).

## La règle

Aucune page, aucun outil ni aucun support ne présente comme un gain un geste que la suite d’audit du cabinet fait déjà. Une page qui touche une tâche couverte en partie dit d’abord ce que fait la suite, puis montre ce qui reste.

## Conséquences pour le site

- **Familles en retrait, sans page service** : `cac-fec-reception`, `cac-demandes-documents`, `cac-revue-analytique`, `cac-rapport-certification`, `cac-revue-ecritures`, `cac-dossier-de-travail`. Les suites couvrent ces gestes. Des articles de méthode restent possibles, à condition de citer ce que font les suites.
- **`cac-confirmations-audit`, recadrée** :
  - La famille porte la sélection des tiers selon la règle du cabinet : plus gros soldes, plus gros mouvements et part aléatoire tirée avec une graine conservée. La sélection s’arrête à une couverture ou à un nombre de comptes, en deux passes (30/09 puis clôture).
  - Elle porte aussi la feuille des écarts et les procédures alternatives : NEP 505 ; NEP 911 § 24 et NEP 912 § 23, révisées le 24/07/2026.
  - Les lettres, l’envoi et les relances restent aux plateformes.
- **`cac-suivi-mandats`, recadrée** : l’échéancier des mandats et le barème d’heures. Pas la déclaration d’activité, que les suites pré-remplissent déjà via Aglaé.
- **À ouvrir** :
  - les fichiers du client rapprochés de la balance : DSN avec les comptes 421, 431, 641 et 645, immobilisations avec 2x, 28x et 68x, inventaire avec 3x ;
  - les conventions réglementées et les vérifications spécifiques (NEP 9510) ;
  - en perspective, les factures électroniques exploitées à la clôture (FAQ CNCC v3, Q44, Q45, Q47 et Q50).
- **Services** :
  - `circularisation-cac` est recentrée sur la sélection et les écarts ;
  - `revue-analytique-cac` et `dossier-travail-cac` sont suspendues.
- **Outils** :
  - restent : `suivi-circularisation`, `seuil-signification-audit` et `bareme-heures-cac` ;
  - à construire en premier : la sélection des tiers à circulariser, de la balance à une sélection documentée ;
  - suspendus jusqu’à leur requalification : `revue-analytique-excel` et `feuilles-maitresses-audit`.
- **`/commissaires-aux-comptes`** :
  - trois écrans : la sélection des tiers, les écarts et procédures alternatives, les fichiers du client rapprochés de la balance ;
  - un bandeau qui dit ce que la suite du cabinet fait déjà ;
  - ni le contrôle du FEC à réception ni les procédures analytiques ne sont plus des écrans.
- **Pages service, EC comme CAC** : chacune a son entrée dans `src/data/couverture-logiciels.mjs`. Le test `tests/scripts/service-couverture.test.mjs` refuse une page sans entrée.
