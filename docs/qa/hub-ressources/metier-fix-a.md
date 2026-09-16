# Ressources v2 — correctif métier A

Date de contrôle : 2026-09-14T15:37:40+01:00

Candidat de départ : `252e819c2ee394d673c63ae3b5240b40c1190e68`. Le contenu a été modifié puis rescellé comme nouveau candidat ; le verdict historique FAIL n’est pas réécrit.

## Verdict du candidat

- `contractRevision: 2` sur H et T.
- Inventaire exhaustif : **26 unités**, soit **23 définitions T** et **3 claims H**.
- Aucune unité ou claim sensible orphelin dans les manifestes.
- Statut maintenu **FAIL/PENDING** : aucune nouvelle identité de reviewer, aucune preuve de revue indépendante et aucun scellement de revue n’ont été ajoutés.
- Les deux P0 déclarés restent uniquement `P0-revue-metier-v2-absente` et `P0-scellement-revue-v2-absent`.
- Aucun push, preview, production, publication ou cron.

## Empreintes des manifestes

| Surface | Manifeste | Unités | Claims | Citations | Sources | Hash candidat | Octets | SHA-256 fichier |
|---|---|---:|---:|---:|---:|---|---:|---|
| H | `editorial/resources/hub/manifest.json` | 3 | 3 | 6 | 3 | `fa9ff454f956678054bdb9eca49abfff03d9d99e779cfedeee9d6744d0e98f02` | 87290 | `3d8d951455889861c43174f947249d57298b943f89a403577ce4d86e87ca493f` |
| T | `editorial/resources/glossaire/manifest.json` | 23 | 23 | 24 | 9 | `be6f4ab97b69164df28e1db8f5c355d69eec21afa7bcb096348791d9e3384747` | 127935 | `621e6e0856d7a80ab18f4abf9b98d2d8e701d003d5a4829fa3331cd8126c618b` |

## Vérification des sources

Les neuf URLs officielles qui soutiennent directement les claims H/T ont été ouvertes dans Chromium le 14 septembre 2026. Les URL finales, titres et passages visibles ont été relus ; les copies locales normalisent seulement les espaces. Les autres références visibles Net-entreprises et NIST ont également été rouvertes ; EUR-Lex, dont le navigateur n’a renvoyé aucun corps exploitable, a été retiré plutôt que déclaré frais. L’ancienne fiche Service-Public `F24013`, devenue « Déclarer et payer les cotisations et contributions sociales des salariés », n’a pas été réutilisée pour définir la DSN. Elle est remplacée par le tableau de bord officiel DSN-INFO de Net-entreprises. Le tableau suivant inventorie les neuf copies officielles utilisées par les manifestes et les deux sources originales Memlia.

## Classification des sources

| Source | Classement | URL finale | SHA-256 copie | Copie locale |
|---|---|---|---|---|
| source-net-dsn-overview | tier-1 officielle primaire | https://www.net-entreprises.fr/tableau-de-bord-dsn/ | `a1eaf288ec3d9c0db15357a4827bca6a5c081311ffe57d539f0f685868a78acf` | `docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-overview.txt` |
| source-net-dsn-val | tier-1 officielle primaire | https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/ | `9834a215c9c9e3958c928cfaae86403dcde770e4bc810ea01fd804bbca32db34` | `docs/qa/hub-ressources/metier-fix-a-sources/net-dsn-val.txt` |
| source-net-crm | tier-1 officielle primaire | https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/ | `91947e373079dcfdcc9aa08a0687e19114925388b24c2e3a8d8ac37bdf15cf15` | `docs/qa/hub-ressources/metier-fix-a-sources/net-crm.txt` |
| source-net-annule | tier-1 officielle primaire | https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/ | `378a556297ccb0c0eaa25b61b3db9a23c8b2bf68d86d47a4a78fa7b5cd0bbca9` | `docs/qa/hub-ressources/metier-fix-a-sources/net-annule.txt` |
| source-cnil-donnee | tier-1 officielle primaire | https://www.cnil.fr/fr/definition/donnee-personnelle | `640d1c3a0fbe442918ddc8df0637e6a0cab8097ec1cf71550cba7474dcd9e5de` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-donnee.txt` |
| source-cnil-rgpd | tier-1 officielle primaire | https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2 | `9070dc4ae25949e60a5828f8655185c60380f78c1b5fa01204466d08daffcd90` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-rgpd.txt` |
| source-cnil-anonymisation | tier-1 officielle primaire | https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles | `15ce8529147ae5e9110d8cfef05434a1bf404fd7c56f1936c2970eabf98030a7` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-anonymisation.txt` |
| source-service-public-recouvrement | tier-1 officielle primaire | https://entreprendre.service-public.gouv.fr/vosdroits/F38586 | `af2f1cc9f8cb1d6611c58dc4cfe9db371013e19eb35bb465fa9a321260d9ebda` | `docs/qa/hub-ressources/metier-fix-a-sources/service-public-recouvrement.txt` |
| source-cnil-controle-activite | tier-1 officielle primaire | https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees | `f2c64ee8a487847e6fe864a168e5835e77abc86c376e9c84d1c4d29815fa10d3` | `docs/qa/hub-ressources/metier-fix-a-sources/cnil-controle-activite.txt` |
| source-glossary-memlia | méthode originale Memlia | file://src/data/glossary.ts | `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387` | `src/data/glossary.ts` |
| source-hub-memlia | méthode originale Memlia | file://src/pages/ressources.astro | `fdbcc75fc6a3e42947aed5622c637a4762f06277085e513143036b899bdf184f` | `src/pages/ressources.astro` |

Les pages Net-entreprises/GIP-MDS, CNIL et Service-Public sont classées tier-1, officielles et primaires pour les claims concernés. Les deux sources Memlia ne servent qu’aux formulations explicitement bornées comme vocabulaire, contrat technique ou positionnement Memlia ; elles ne soutiennent aucun claim réglementaire général.

## Inventaire claim par claim

### 1. T-DEF-DSN

- Surface et emplacement : T — `src/data/glossary.ts`, dsn:definition
- Wording exact : « La déclaration sociale nominative (DSN) est obligatoire pour les entreprises du secteur privé ainsi que pour la fonction publique ; elle remplace des formalités qui s’appuient sur les données de paie. »
- Source : Net-entreprises (GIP-MDS), [DSN-INFO : La déclaration Sociale Nominative (DSN)](https://www.net-entreprises.fr/tableau-de-bord-dsn/) — `source-net-dsn-overview`
- Extrait(s) soutenant(s) :
  - « La DSN – Déclaration Sociale Nominative – est obligatoire pour toutes les entreprises du secteur privé ainsi qu’à la Fonction publique. Elle remplace à ce jour près de 80 procédures et a vocation à supprimer encore des formalités qui s’appuient sur les données de paie. » — DSN-INFO : La déclaration Sociale Nominative (DSN)
- Applicabilité : Entreprises du secteur privé et fonction publique concernées par la DSN en France.
- Exceptions et limites : Les déclarations et signalements couverts par la DSN conservent leurs règles propres.
- SHA-256 du claim : `2de4d39df915ad37e47123702510f1241b9c5d8a22943496b55bec47465a846d`
- SHA-256 de la copie source : `a1eaf288ec3d9c0db15357a4827bca6a5c081311ffe57d539f0f685868a78acf`

### 2. T-DEF-DSN-VAL

- Surface et emplacement : T — `src/data/glossary.ts`, dsn-val:definition
- Wording exact : « DSN-Val est l’outil d’auto-contrôle qui teste un fichier DSN avant dépôt selon le cahier technique et le journal de maintenance de la norme associés. »
- Source : Net-entreprises (GIP-MDS), [Outils d’auto-contrôle Dsn-Val et brique de contrôle](https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/) — `source-net-dsn-val`
- Extrait(s) soutenant(s) :
  - « L’outil de contrôle Dsn-Val permet de tester votre fichier DSN avant de le déposer. Les contrôles effectués portent sur le cahier technique et le journal de maintenance de la norme (JMN) associé. » — Outils d’auto-contrôle Dsn-Val et brique de contrôle
- Applicabilité : Fichiers DSN contrôlés avant dépôt, selon le cahier technique et le JMN applicables.
- Exceptions et limites : Un contrôle de norme ne prouve pas l’exactitude métier des variables de paie.
- SHA-256 du claim : `28fa1fe774dda69777467635d8679f2d6a1770f124013862ee13f2bf4bed5ff6`
- SHA-256 de la copie source : `9834a215c9c9e3958c928cfaae86403dcde770e4bc810ea01fd804bbca32db34`

### 3. T-DEF-COMPTE-RENDU-METIER-DSN

- Surface et emplacement : T — `src/data/glossary.ts`, compte-rendu-metier-dsn:definition
- Wording exact : « Un compte rendu métier est le retour d’un organisme ou d’une administration après réception d’une déclaration lorsqu’une erreur ou une suspicion d’erreur est détectée ; il peut aussi confirmer la qualité du traitement reçu. »
- Source : Net-entreprises (GIP-MDS), [Les Comptes Rendus Métiers DSN](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/) — `source-net-crm`
- Extrait(s) soutenant(s) :
  - « Un Compte Rendu Métier (CRM) est un rapport permettant à l’organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu’une erreur ou suspicion d’erreur est détectée. Il est donc important de prendre en compte ces retours. » — Les Comptes Rendus Métiers DSN
  - « Suite à cette analyse, chaque organisme destinataire de vos DSN vous met à disposition un « Compte Rendu Métier (ou CRM) » sur votre tableau de bord, pour vous préciser vos anomalies ou vous confirmer la qualité de vos déclarations. » — Les Comptes Rendus Métiers DSN
- Applicabilité : Déclarations reçues et analysées par les organismes destinataires.
- Exceptions et limites : Les CRM diffèrent selon l’organisme ; leur silence ne garantit pas la justesse générale.
- SHA-256 du claim : `0a5d9dccecb7cdac20fd6431446ab9d50b9faf0f1875c280ac111167d0221410`
- SHA-256 de la copie source : `91947e373079dcfdcc9aa08a0687e19114925388b24c2e3a8d8ac37bdf15cf15`

### 4. T-DEF-ANNULE-ET-REMPLACE-DSN

- Surface et emplacement : T — `src/data/glossary.ts`, annule-et-remplace-dsn:definition
- Wording exact : « Une DSN « annule et remplace » remplace une déclaration déjà transmise dans la fenêtre autorisée pour ce type de déclaration. »
- Source : Net-entreprises (GIP-MDS), [Annule et remplace DSN mensuelle et signalements](https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/) — `source-net-annule`
- Extrait(s) soutenant(s) :
  - « Concernant la DSN mensuelle, celle-ci peut faire l'objet d' « annule et remplace » tant que l'échéance d'envoi retenue pour votre entreprise n'est pas dépassée (5 ou 15 du mois suivant). » — Annule et remplace DSN mensuelle et signalements
- Applicabilité : DSN mensuelle dans la fenêtre propre à l’échéance de l’entreprise.
- Exceptions et limites : Les signalements d’événement suivent une autre fenêtre, explicitée près du claim dans le glossaire.
- SHA-256 du claim : `04cfc0a5773c76ab04da6e3594e6e05e2763f0a8fe0c3c1c14fe44f3932a7c8d`
- SHA-256 de la copie source : `378a556297ccb0c0eaa25b61b3db9a23c8b2bf68d86d47a4a78fa7b5cd0bbca9`

### 5. T-DEF-CONTROLE-AVANT-DSN

- Surface et emplacement : T — `src/data/glossary.ts`, controle-avant-dsn:definition
- Wording exact : « Dans ce glossaire, Memlia appelle « contrôle avant DSN » l’ensemble des vérifications que le cabinet choisit de rejouer entre le calcul de la paie et le dépôt : pièces, variables, écarts, cohérences métier et conformité du fichier. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans ce glossaire, Memlia appelle « contrôle avant DSN » l’ensemble des vérifications que le cabinet choisit de rejouer entre le calcul de la paie et le dépôt : pièces, variables, écarts, cohérences métier et conformité du fichier. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `fca06fe42a7e25b4b05ae0efd1017cfec7f45341c7415d36b8c15070e4b34f46`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 6. T-DEF-PRODUCTION-SOCIALE

- Surface et emplacement : T — `src/data/glossary.ts`, production-sociale:definition
- Wording exact : « Dans ce glossaire, Memlia appelle « production sociale » le cycle de travail retenu par le cabinet pour collecter les variables, établir et contrôler les bulletins, déposer les déclarations puis traiter les retours et documents. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans ce glossaire, Memlia appelle « production sociale » le cycle de travail retenu par le cabinet pour collecter les variables, établir et contrôler les bulletins, déposer les déclarations puis traiter les retours et documents. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `acb724673cb90dace6ec722eb50a00f14ffd211298293d2d6367a4e5fd48cff6`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 7. T-DEF-DONNEE-PERSONNELLE

- Surface et emplacement : T — `src/data/glossary.ts`, donnee-personnelle:definition
- Wording exact : « Toute information se rapportant à une personne physique identifiée ou identifiable, directement ou indirectement. »
- Source : CNIL, [Donnée personnelle](https://www.cnil.fr/fr/definition/donnee-personnelle) — `source-cnil-donnee`
- Extrait(s) soutenant(s) :
  - « Une donnée personnelle est toute information se rapportant à une personne physique identifiée ou identifiable. » — Donnée personnelle
- Applicabilité : Informations se rapportant à une personne physique identifiée ou identifiable.
- Exceptions et limites : L’identification peut être directe ou indirecte ; retirer le nom ne suffit pas nécessairement.
- SHA-256 du claim : `07374ae4579dba91f4a2256482693eaf7b786bb17d7b83ff4a1e47cede7ad878`
- SHA-256 de la copie source : `640d1c3a0fbe442918ddc8df0637e6a0cab8097ec1cf71550cba7474dcd9e5de`

### 8. T-DEF-MINIMISATION-DES-DONNEES

- Surface et emplacement : T — `src/data/glossary.ts`, minimisation-des-donnees:definition
- Wording exact : « Principe selon lequel les données traitées doivent être adéquates, pertinentes et limitées à ce qui est nécessaire au regard de la finalité. »
- Source : CNIL, [CHAPITRE II - Principes](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2) — `source-cnil-rgpd`
- Extrait(s) soutenant(s) :
  - « adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées (minimisation des données); » — CHAPITRE II - Principes
- Applicabilité : Traitements de données à caractère personnel, au regard de finalités déterminées.
- Exceptions et limites : Le nécessaire s’apprécie selon la finalité ; une collecte « au cas où » n’est pas justifiée.
- SHA-256 du claim : `51b51d2660e1eb6fead8f3b7eb7ddad5ea0b700e596e6bb1b76256eed4d8e8d9`
- SHA-256 de la copie source : `9070dc4ae25949e60a5828f8655185c60380f78c1b5fa01204466d08daffcd90`

### 9. T-DEF-ANONYMISATION

- Surface et emplacement : T — `src/data/glossary.ts`, anonymisation:definition
- Wording exact : « Traitement visant à rendre impossible, en pratique, l’identification d’une personne par tout moyen raisonnablement utilisable et de manière irréversible. »
- Source : CNIL, [L’anonymisation de données personnelles](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles) — `source-cnil-anonymisation`
- Extrait(s) soutenant(s) :
  - « L’anonymisation est un traitement qui consiste à utiliser un ensemble de techniques de manière à rendre impossible, en pratique, toute identification de la personne par quelque moyen que ce soit et de manière irréversible. » — L’anonymisation de données personnelles
- Applicabilité : Jeu de données dont l’irréversibilité pratique doit être démontrée.
- Exceptions et limites : Pseudonymisation et agrégation trop fine ne suffisent pas à établir l’anonymat.
- SHA-256 du claim : `2fbcce1d74eaef151d1383b8a759956e5f3e688b23f430db6dcd35d79c4113d2`
- SHA-256 de la copie source : `15ce8529147ae5e9110d8cfef05434a1bf404fd7c56f1936c2970eabf98030a7`

### 10. T-DEF-PSEUDONYMISATION

- Surface et emplacement : T — `src/data/glossary.ts`, pseudonymisation:definition
- Wording exact : « Traitement de données personnelles réalisé de manière à ne plus pouvoir attribuer les données à une personne physique sans information supplémentaire. »
- Source : CNIL, [L’anonymisation de données personnelles](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles) — `source-cnil-anonymisation`
- Extrait(s) soutenant(s) :
  - « La pseudonymisation est un traitement de données personnelles réalisé de manière à ce qu'on ne puisse plus attribuer les données relatives à une personne physique sans information supplémentaire. » — L’anonymisation de données personnelles
- Applicabilité : Données personnelles qui ne peuvent plus être attribuées sans information supplémentaire.
- Exceptions et limites : Les données restent personnelles et l’opération est réversible.
- SHA-256 du claim : `e48722dd8e47be496c804ebff095b9ed4fbca7d88cc51a5b380a15939cb0c3d2`
- SHA-256 de la copie source : `15ce8529147ae5e9110d8cfef05434a1bf404fd7c56f1936c2970eabf98030a7`

### 11. T-DEF-AGREGAT-NON-NOMINATIF

- Surface et emplacement : T — `src/data/glossary.ts`, agregat-non-nominatif:definition
- Wording exact : « Résultat regroupant des dossiers, étapes ou périodes sans afficher un indicateur par personne. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Résultat regroupant des dossiers, étapes ou périodes sans afficher un indicateur par personne. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `1ebf26f16dd177c4b45395c3a3ccf7db7ed646d53df5f63457e3946d25e63095`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 12. T-DEF-LETTRAGE-COMPTABLE

- Surface et emplacement : T — `src/data/glossary.ts`, lettrage-comptable:definition
- Wording exact : « Dans ce glossaire, Memlia appelle « lettrage comptable » le rapprochement d’écritures que le cabinet considère comme liées, par exemple une facture et son règlement, au moyen d’un repère commun. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans ce glossaire, Memlia appelle « lettrage comptable » le rapprochement d’écritures que le cabinet considère comme liées, par exemple une facture et son règlement, au moyen d’un repère commun. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `5e251550804bff5c985f1977625f66a37ec867df5da9ba4a4bfbaf5018dd00fb`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 13. T-DEF-RAPPROCHEMENT-BANCAIRE

- Surface et emplacement : T — `src/data/glossary.ts`, rapprochement-bancaire:definition
- Wording exact : « Dans ce glossaire, Memlia appelle « rapprochement bancaire » le contrôle qui compare les mouvements et le solde comptables d’un compte au relevé de la banque, puis prépare l’explication des écarts de date, d’omission ou d’erreur. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans ce glossaire, Memlia appelle « rapprochement bancaire » le contrôle qui compare les mouvements et le solde comptables d’un compte au relevé de la banque, puis prépare l’explication des écarts de date, d’omission ou d’erreur. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `5d6711e4a86e86cd3a95ed9cb8b0d54d311f6dd578fcdfbf0c99b373cc772c48`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 14. T-DEF-REVISION-COMPTABLE

- Surface et emplacement : T — `src/data/glossary.ts`, revision-comptable:definition
- Wording exact : « Dans ce glossaire, Memlia appelle « révision comptable » l’ensemble de contrôles défini par la mission du cabinet pour examiner les comptes, documenter les anomalies et préparer leur validation. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans ce glossaire, Memlia appelle « révision comptable » l’ensemble de contrôles défini par la mission du cabinet pour examiner les comptes, documenter les anomalies et préparer leur validation. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `1bb644f7358a3eb85955f013c6eb131b8722ee74487b4d597b735e4598bbb755`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 15. T-DEF-PIECE-JUSTIFICATIVE

- Surface et emplacement : T — `src/data/glossary.ts`, piece-justificative:definition
- Wording exact : « Dans ce glossaire, Memlia appelle « pièce justificative » le document ou la trace que le cabinet retient pour expliquer et étayer une opération enregistrée ou une décision de contrôle. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans ce glossaire, Memlia appelle « pièce justificative » le document ou la trace que le cabinet retient pour expliquer et étayer une opération enregistrée ou une décision de contrôle. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `a765ba57657d449aef91e08dcac9bbf8e6ad6cba44930a214c16cbe21e9b50bb`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 16. T-DEF-RECOUVREMENT-AMIABLE

- Surface et emplacement : T — `src/data/glossary.ts`, recouvrement-amiable:definition
- Wording exact : « Tentative d’obtenir le paiement d’une créance sans engager d’abord une action judiciaire, généralement par relance puis, en cas d’échec, par mise en demeure. »
- Source : Service-Public Entreprendre, [Recouvrement amiable : relance et mise en demeure de payer](https://entreprendre.service-public.gouv.fr/vosdroits/F38586) — `source-service-public-recouvrement`
- Extrait(s) soutenant(s) :
  - « Elle peut d'abord essayer de recouvrer ses impayés de façon amiable sans engager une action judiciaire. Cela se traduit généralement par une relance puis, en cas d'échec, par une mise en demeure. » — Recouvrement amiable : relance et mise en demeure de payer
- Applicabilité : Entreprise créancière confrontée à un retard de paiement client.
- Exceptions et limites : La relance et la mise en demeure sont distinctes ; aucun envoi automatique sans validation.
- SHA-256 du claim : `ecb2978a8a2f7ab79359b1965c31b05df87767b032fe7481f3232690dac493fc`
- SHA-256 de la copie source : `af2f1cc9f8cb1d6611c58dc4cfe9db371013e19eb35bb465fa9a321260d9ebda`

### 17. T-DEF-REGLE-DE-CABINET

- Surface et emplacement : T — `src/data/glossary.ts`, regle-de-cabinet:definition
- Wording exact : « Instruction explicite qui décrit ce que le cabinet attend d’une entrée donnée, les exceptions admises et le résultat à préparer. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Instruction explicite qui décrit ce que le cabinet attend d’une entrée donnée, les exceptions admises et le résultat à préparer. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `b94515f0319c8330469b0516ef1bc892a5793f7c70e44cefa4f542e17ad37528`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 18. T-DEF-CAS-DE-REFUS

- Surface et emplacement : T — `src/data/glossary.ts`, cas-de-refus:definition
- Wording exact : « Situation prévue dans laquelle le traitement s’arrête et demande une intervention au lieu de produire un résultat incertain. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Situation prévue dans laquelle le traitement s’arrête et demande une intervention au lieu de produire un résultat incertain. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `322fc7b6a29dc30567b72ea3d2b4c09191c9107ad81d3476e5822275d4dce4dd`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 19. T-DEF-CONTROLE-DE-COHERENCE

- Surface et emplacement : T — `src/data/glossary.ts`, controle-de-coherence:definition
- Wording exact : « Dans ce glossaire, Memlia appelle « contrôle de cohérence » une vérification qui compare des données entre elles ou à une règle du cabinet pour faire ressortir une anomalie possible. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans ce glossaire, Memlia appelle « contrôle de cohérence » une vérification qui compare des données entre elles ou à une règle du cabinet pour faire ressortir une anomalie possible. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `c9692a450e9890e647cc0292233593ce074db032e72eda209524caeff4189c13`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 20. T-DEF-SCHEMA-DE-DONNEES

- Surface et emplacement : T — `src/data/glossary.ts`, schema-de-donnees:definition
- Wording exact : « Dans le contrat technique Memlia, le « schéma de données » décrit la structure attendue d’un jeu de données : champs, types, formats, valeurs admises et relations utiles au traitement. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans le contrat technique Memlia, le « schéma de données » décrit la structure attendue d’un jeu de données : champs, types, formats, valeurs admises et relations utiles au traitement. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `f3a6538359f5ecac5b06ce359be2ad772d9e26cff576ab69631a41851c5aca3c`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 21. T-DEF-TRACABILITE

- Surface et emplacement : T — `src/data/glossary.ts`, tracabilite:definition
- Wording exact : « Dans le contrat technique Memlia, la « traçabilité » permet de retrouver quelles entrées, quelle règle, quelle version et quel résultat ont conduit à une proposition ou à une décision. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans le contrat technique Memlia, la « traçabilité » permet de retrouver quelles entrées, quelle règle, quelle version et quel résultat ont conduit à une proposition ou à une décision. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `b5e9e626feeb05bb79bf98dc5bfff437d28848865218681951503f66df53f36a`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 22. T-DEF-VALIDATION-HUMAINE

- Surface et emplacement : T — `src/data/glossary.ts`, validation-humaine:definition
- Wording exact : « Étape où une personne compétente accepte, corrige ou refuse la proposition préparée avant qu’elle produise un effet métier. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Étape où une personne compétente accepte, corrige ou refuse la proposition préparée avant qu’elle produise un effet métier. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `146f1957b12faf35ffd1ca6a168522cd48a56ca15ef3dd40c10acbb8fe972fab`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 23. T-DEF-FAIL-CLOSED

- Surface et emplacement : T — `src/data/glossary.ts`, fail-closed:definition
- Wording exact : « Dans le contrat technique Memlia, « fail-closed » désigne le comportement testé où une entrée inconnue, invalide ou ambiguë bloque le traitement au lieu d’autoriser une sortie par défaut. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Dans le contrat technique Memlia, « fail-closed » désigne le comportement testé où une entrée inconnue, invalide ou ambiguë bloque le traitement au lieu d’autoriser une sortie par défaut. » — Vocabulaire et contrats Memlia
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `7067305c1bf51ffbc2b0eadee41b25f9a61094299e322ab24906f0d4f91e610d`
- SHA-256 de la copie source : `eec5242619fa7c4932eefabc701b3382c5388428f03e9e5f747fd40adfefb387`

### 24. H-DESCRIPTION

- Surface et emplacement : H — `src/pages/ressources.astro`, description
- Wording exact : « Des ressources pour comprendre, vérifier et cadrer les tâches d’un cabinet, sans céder la décision humaine. »
- Source : Memlia, [Positionnement éditorial du Hub Ressources](file://src/pages/ressources.astro) — `source-hub-memlia`
- Extrait(s) soutenant(s) :
  - « Des ressources pour comprendre, vérifier et cadrer les tâches d’un cabinet, sans céder la décision humaine. » — description
- Applicabilité : Promesse éditoriale du Hub ; elle décrit la posture des ressources.
- Exceptions et limites : Les résumés réglementaires rendus par le Hub possèdent leurs propres claims et preuves.
- SHA-256 du claim : `d6a1d95e30fa8d1ec6851c763ec941a73268d6b7ce994b379d2862ba20b43094`
- SHA-256 de la copie source : `fdbcc75fc6a3e42947aed5622c637a4762f06277085e513143036b899bdf184f`

### 25. H-DSN-DEADLINE-SUMMARY

- Surface et emplacement : H — `src/content/blog/controler-les-bulletins-de-paie-avant-la-dsn.md`, frontmatter.resume
- Wording exact : « Contrôler avant de déposer : pour une DSN mensuelle, l’« annule et remplace » se ferme la veille de l’échéance à minuit ; les signalements d’événement suivent une autre fenêtre. Une liste de contrôles écrite, rejouée chaque mois, puis DSN-Val et les comptes rendus métier. Le cabinet décide. »
- Source : Net-entreprises (GIP-MDS), [Annule et remplace DSN mensuelle et signalements](https://net-entreprises.custhelp.com/app/answers/detail/a_id/434/) — `source-net-annule`
- Extrait(s) soutenant(s) :
  - « L'échéance de dépôt des DSN "annule et remplace" est située la veille du jour de l'échéance à minuit. » — Annule et remplace DSN mensuelle et signalements
  - « Si la déclaration « annule et remplace » concerne un signalement d'événement, il n’y a pas de date limite à son envoi (envoi de la déclaration « annule et remplace » dès que nécessaire). » — Annule et remplace DSN mensuelle et signalements
- Applicabilité : DSN mensuelle annule-et-remplace ; échéance propre à l’entreprise, le 5 ou le 15.
- Exceptions et limites : Le résumé visible précise que les signalements d’événement suivent une autre fenêtre.
- SHA-256 du claim : `3146963f437f345f0972222ab1d1b20dda90ff594ed0dd2af058baabad9efe62`
- SHA-256 de la copie source : `378a556297ccb0c0eaa25b61b3db9a23c8b2bf68d86d47a4a78fa7b5cd0bbca9`

### 26. H-SOCIAL-MONITORING-SUMMARY

- Surface et emplacement : H — `src/content/blog/suivre-la-production-sociale-dans-excel.md`, frontmatter.resume
- Wording exact : « Un suivi tient si son unité est le dossier et l’étape, jamais la personne. S’il permet de contrôler l’activité du personnel, il doit être justifié et proportionné, présenté aux salariés et, dans les entreprises privées de 50 salariés et plus, soumis à la consultation du CSE. »
- Source : CNIL, [Travail, ressources humaines : le contrôle de l’activité des personnes employées](https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees) — `source-cnil-controle-activite`
- Extrait(s) soutenant(s) :
  - « Sauf exception (par exemple, lorsqu’un dispositif de contrôle est imposé par la loi), un dispositif de contrôle de l’activité du personnel doit cumulativement : satisfaire aux tests de justification et de proportionnalité ; être soumis aux instances représentatives du personnel selon les règles en vigueur ; être porté à la connaissance des salariés/agents. » — Conditions cumulatives
  - « Dans le cadre du dialogue social, l'employeur doit consulter : le conseil social et économique (CSE) dans les entreprises privées de 50 salariés et plus, les établissements publics à caractère industriel et commercial et les établissements publics à caractère administratif lorsqu'ils emploient du personnel dans les conditions du droit privé ; le comité social d’administration, territorial ou d’établissement (CSA, CST et CSE) ou leurs formations spécialisées dans les organismes publics. » — Condition n°2
  - « Le dispositif doit être porté à la connaissance des personnes concernées, préalablement à sa mise en place, pour satisfaire aux obligations de loyauté et d’information qui incombent à l'employeur. » — Condition n°3
- Applicabilité : Dispositif qui permet le contrôle de l’activité du personnel ; consultation CSE formulée ici pour les entreprises privées de 50 salariés et plus.
- Exceptions et limites : La qualification dépend du dispositif ; les exceptions légales et les autres instances du secteur public ne sont pas généralisées au Hub.
- SHA-256 du claim : `ba1eaf617fccd2eddfe3599de32e8e9d9de1633bc808f9e04639153c988a6df7`
- SHA-256 de la copie source : `f2c64ee8a487847e6fe864a168e5835e77abc86c376e9c84d1c4d29815fa10d3`

## Applicabilité visible dans le rendu

- H / DSN : le résumé nomme la **DSN mensuelle** et indique que les signalements d’événement suivent une autre fenêtre.
- H / contrôle de l’activité : le résumé conditionne la règle à un suivi qui permet de contrôler l’activité, conserve justification et proportionnalité, mentionne l’information des salariés et borne la consultation du CSE aux entreprises privées de **50 salariés et plus**.
- T : les limites restent visibles dans les champs « contexte », « confusion fréquente » et « limite de l’automatisation ». Les sept termes professionnels signalés commencent désormais par « Dans ce glossaire, Memlia appelle… ». Les trois termes techniques signalés commencent par « Dans le contrat technique Memlia… ». Tous portent la nature « Éditoriale Memlia ».

## Audit attendu avant la nouvelle revue

L’audit QA reste rouge, comme exigé. Ses relations de surface sont complètes (2 découvertes, 2 reliées, 0 orpheline) et il ne remonte aucune erreur d’intégrité, de fraîcheur, de citation, de source ou d’inventaire. Les erreurs métier restantes dérivent de l’absence de reviewer, de verdicts unitaires et de preuve scellée ; les autres erreurs de l’audit complet correspondent aux gates de recherche/qualité historiques encore FAIL et ne sont pas maquillées par ce correctif de contenu.

## Résultats de vérification

- Astro check : 101 fichiers, 0 erreur, 0 warning, 1 hint préexistant.
- Build site : PASS après modification du rendu.
- Tests du pipeline Ressources : 33/33 PASS ; oracle Python du contrat IA : 1/1 PASS.
- Playwright sur un serveur dédié au worktree : 98/98 PASS, dont les lectures 375 px et 1440 px de `/ressources` et `/glossaire`.
- Audit QA : exit 1 attendu, 2 manifestes découverts, 0 PASS, 2 FAIL ; aucune relation de surface en erreur.
- Comptes, octets, empreintes de fichiers et chaînes claim↔unité↔citation↔source recalculés indépendamment après le dernier scellement.

## Commandes de vérification

- `npm run check`
- `npm run build:site`
- `npm run resource:seal-surfaces`
- `npm run resource:audit:qa` — sortie 1 attendue tant que la nouvelle revue n’existe pas
- `node --test tests/scripts/resource-pipeline.test.mjs`
- `python3 -m unittest discover -s tests/proof -p 'test_resource_ai_review.py' -v`
- `QA_URL=http://localhost:4391 npm run test`
- recalcul indépendant avec `jq`, `wc` et `shasum -a 256`
