# Glossaire vague 1 — vérification des sources et inventaire des affirmations

Vingt termes ajoutés au glossaire le 16 septembre 2026 (contrat Ressources v3, surface T). Ce rapport est la preuve documentaire référencée par le manifeste `editorial/resources/glossaire/manifest.json` pour les sources de la vague 1 ; les neuf sources du candidat précédent restent décrites dans `metier-fix-a.md` et ont été rouvertes le même soir (chaque passage cité est présent mot pour mot dans la page vivante).

## Vérification des sources

Les onze pages officielles ci-dessous ont été ouvertes le 16 septembre 2026 au soir : neuf par `curl` avec un en-tête de navigateur, deux (Légifrance) dans Chrome parce que le site oppose un défi anti-robot Cloudflare à `curl` et au navigateur intégré (HTTP 403). Les copies locales ne gardent que l’en-tête et les passages cités, espaces normalisés. Trois extraits du fichier de rédaction (`docs/strategy/site-v3/glossaire-vague-1.json`) ne figuraient pas mot pour mot dans les pages vivantes (EUR-Lex : extrait retouché ; Microsoft OCR : ellipse ; Azure Document Intelligence et Service-Public : page ou passage réécrits) : les citations retenues sont celles des pages vivantes, et les définitions ont été recadrées sur ce qu’elles énoncent. Cinq sources du fichier de rédaction ne sont plus citées (CNIL intervention humaine, Ordre des experts-comptables, Power Automate « flux », Service-Public obligations comptables, doublon CNIL anonymisation) : les définitions concernées sont des conventions Memlia, adossées à `/methode`.

## Classification des sources

| Source | Classement | URL finale | Consultée le | SHA-256 copie | Copie locale |
|---|---|---|---|---|---|
| source-microsoft-power-automate-declencheur | tier-1 officielle primary | https://learn.microsoft.com/fr-fr/power-automate/triggers-introduction | 2026-09-16T20:40:00+02:00 | `641db3cde27d808fbf4c338752ec0aa7a5f25376fed6a62b563a7f65c655eadc` | `docs/qa/hub-ressources/glossaire-vague-1-sources/microsoft-power-automate-declencheur.txt` |
| source-legifrance-ccag-tic | tier-1 officielle primary | https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043310689 | 2026-09-16T20:40:00+02:00 | `e7ac7b36c1deb61eabfe88f81a461d910acba656e5d46523f8495e8419af4877` | `docs/qa/hub-ressources/glossaire-vague-1-sources/legifrance-ccag-tic.txt` |
| source-eurlex-ai-act | tier-1 officielle primary | https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024R1689 | 2026-09-16T20:40:00+02:00 | `c8084dc4b489ebbe3d100ef3d5982e7a01dfe4ecd6326671e6cac268d3695230` | `docs/qa/hub-ressources/glossaire-vague-1-sources/eurlex-ai-act.txt` |
| source-cnil-ia-generative | tier-1 officielle primary | https://www.cnil.fr/fr/comment-deployer-une-ia-generative-la-cnil-apporte-de-premieres-precisions | 2026-09-16T20:40:00+02:00 | `c8ab6f8b55f42909ffb622e6ccba54c4c1062d72455b03d972cf4c0e13f38307` | `docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-ia-generative.txt` |
| source-cnil-modele-de-langage | tier-1 officielle primary | https://www.cnil.fr/fr/definition/modele-de-langage | 2026-09-16T20:40:00+02:00 | `0034c41d2757fcde3fd8a27b111b3e0c4dba47ed6f1bc5ededec502fbf0d09fd` | `docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-modele-de-langage.txt` |
| source-cnil-hallucination | tier-1 officielle primary | https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative | 2026-09-16T20:40:00+02:00 | `3ae66a2d62ded7c2ccb412b0a564bc69b77e806a88981de091c367413a8cfcf7` | `docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-hallucination.txt` |
| source-microsoft-ocr | tier-1 officielle primary | https://learn.microsoft.com/fr-fr/azure/ai-services/computer-vision/overview-ocr | 2026-09-16T20:40:00+02:00 | `4d3da89b55d4e668d97cd3baf04699a9487a84004d3f520767c3d22569ccd287` | `docs/qa/hub-ressources/glossaire-vague-1-sources/microsoft-ocr.txt` |
| source-microsoft-document-intelligence | tier-1 officielle primary | https://learn.microsoft.com/fr-fr/azure/ai-services/document-intelligence/overview?view=doc-intel-4.0.0 | 2026-09-16T20:40:00+02:00 | `04af8a9c3babe187c147bc16f2ad7fb41fc8c629c3e8a9280dd9c7e2173b787d` | `docs/qa/hub-ressources/glossaire-vague-1-sources/microsoft-document-intelligence.txt` |
| source-cnil-sous-traitant | tier-1 officielle primary | https://www.cnil.fr/fr/definition/sous-traitant | 2026-09-16T20:40:00+02:00 | `9a887425be3a8666586d4a858a6632f17f1237d8a1c9f7d779b4fa02b963532d` | `docs/qa/hub-ressources/glossaire-vague-1-sources/cnil-sous-traitant.txt` |
| source-banque-france-sepa | tier-1 officielle primary | https://www.banque-france.fr/fr/foire-aux-questions-le-prelevement-sepa | 2026-09-16T20:40:00+02:00 | `9c1cf92a313b863a22150a51948729a1becdbef1f77e75f6e91d3cdcc03058ea` | `docs/qa/hub-ressources/glossaire-vague-1-sources/banque-france-sepa.txt` |
| source-legifrance-deontologie-honoraires | tier-1 officielle primary | https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039401724 | 2026-09-16T20:40:00+02:00 | `8e898bab2cba8303ff8b693e1065686f267202e7c0739a185c59ee5286454689` | `docs/qa/hub-ressources/glossaire-vague-1-sources/legifrance-deontologie-honoraires.txt` |

Toutes sont classées tier-1, officielles et primaires : CNIL, EUR-Lex (Journal officiel de l’Union européenne), Banque de France, Légifrance ; les deux pages Microsoft Learn sont la documentation primaire de l’éditeur pour des notions techniques (OCR, extraction, déclencheur) sans portée réglementaire.

## Inventaire claim par claim

### 1. claim-t-automatisation

- Unité : `unit-t-automatisation` — type `methode-memlia`
- Wording exact : « L’automatisation consiste à faire exécuter par un outil, sans intervention humaine à chaque occurrence, une règle explicite et stable : les mêmes conditions produisent toujours le même traitement. Ce qui sort de la règle — une donnée absente, un cas non prévu — doit être signalé plutôt que traité par approximation, pour rester fidèle à la règle écrite. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « L’automatisation consiste à faire exécuter par un outil, sans intervention humaine à chaque occurrence, une règle explicite et stable : les mêmes conditions produisent toujours le même traitement. Ce qui sort de la règle — une donnée absente, un cas non prévu — doit être signalé plutôt que traité par approximation, pour rester fidèle à la règle écrite. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `96230605db4208e81218a25489db246fc744765ec9c379abbe05c0e628419d06`

### 2. claim-t-flux-de-travail

- Unité : `unit-t-flux-de-travail` — type `methode-memlia`
- Wording exact : « Un flux de travail est l’enchaînement ordonné des étapes qui transforment une demande en résultat : chacune a un responsable, une condition qui permet de la déclencher, et une sortie qui alimente l’étape suivante. Il existe indépendamment de tout logiciel ; un outil peut ensuite exécuter tout ou partie de ses étapes. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Un flux de travail est l’enchaînement ordonné des étapes qui transforment une demande en résultat : chacune a un responsable, une condition qui permet de la déclencher, et une sortie qui alimente l’étape suivante. Il existe indépendamment de tout logiciel ; un outil peut ensuite exécuter tout ou partie de ses étapes. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `1bdb8ddbda00abca0aac6c891098fbfb07f4d2a56838ba7bfda939bc2b0e5351`

### 3. claim-t-declencheur

- Unité : `unit-t-declencheur` — type `information`
- Wording exact : « Un déclencheur est l’événement précis qui lance l’exécution d’une règle : une date atteinte, la réception d’un document, un changement de statut dans un dossier. Il se distingue de la règle elle-même, qui décrit ce qui se passe une fois l’exécution lancée, et des conditions, qui filtrent ensuite les cas à traiter. »
- Source : Microsoft, [Déclencheurs - Power Automate | Microsoft Learn](https://learn.microsoft.com/fr-fr/power-automate/triggers-introduction) — `source-microsoft-power-automate-declencheur`
- Extrait(s) soutenant(s) :
  - « Un déclencheur est un événement qui démarre un flux de cloud. Par exemple, vous souhaitez recevoir une notification dans Microsoft Teams lorsque quelqu’un vous envoie un courrier électronique. Dans ce cas, la réception d’un courrier électronique est le déclencheur qui démarre ce flux. »
- Applicabilité : Événement qui démarre un flux automatisé.
- Régime : Documentation Microsoft Learn de Power Automate, notion de déclencheur.
- Exceptions et limites : Documentation d’un éditeur : la distinction déclencheur / règle / conditions relève de la doctrine Memlia.
- SHA-256 du claim : `af5adaa4df8caefff1c3bc7943f8115f7c6acf2dd922a402e624f16401cec692`

### 4. claim-t-exception

- Unité : `unit-t-exception` — type `methode-memlia`
- Wording exact : « Une exception est une occurrence que la règle écrite ne couvre pas — une donnée absente, un format inattendu, une combinaison non prévue — et qui doit remonter à une personne plutôt qu’être traitée par une valeur par défaut. Une exception n’est pas une erreur : c’est le fonctionnement attendu d’une règle qui refuse de deviner. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Une exception est une occurrence que la règle écrite ne couvre pas — une donnée absente, un format inattendu, une combinaison non prévue — et qui doit remonter à une personne plutôt qu’être traitée par une valeur par défaut. Une exception n’est pas une erreur : c’est le fonctionnement attendu d’une règle qui refuse de deviner. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `850600a19b721cc4666597b435bd6cbd1b782d46c06c8a2dbc70aec2e4471a61`

### 5. claim-t-file-d-anomalies

- Unité : `unit-t-file-d-anomalies` — type `methode-memlia`
- Wording exact : « Une file d’anomalies est la liste unique où se regroupent toutes les exceptions détectées par un traitement, chacune avec son motif et son statut, pour être reprise en une seule séance par une personne plutôt qu’au fil de l’eau. Elle transforme des interruptions dispersées en une revue périodique et maîtrisable. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Une file d’anomalies est la liste unique où se regroupent toutes les exceptions détectées par un traitement, chacune avec son motif et son statut, pour être reprise en une seule séance par une personne plutôt qu’au fil de l’eau. Elle transforme des interruptions dispersées en une revue périodique et maîtrisable. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `b34be3463258ab375c19747720598d213b1184b6bed71f911fd067bd123347c3`

### 6. claim-t-proposition-puis-validation

- Unité : `unit-t-proposition-puis-validation` — type `methode-memlia`
- Wording exact : « Proposition puis validation décrit un fonctionnement en deux temps : l’outil prépare une valeur, un texte ou une action à partir d’une règle, puis une personne l’accepte, la corrige ou la refuse avant qu’elle ne produise un effet. Ce que la personne saisit ou corrige n’est jamais réécrit ensuite par l’outil. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Proposition puis validation décrit un fonctionnement en deux temps : l’outil prépare une valeur, un texte ou une action à partir d’une règle, puis une personne l’accepte, la corrige ou la refuse avant qu’elle ne produise un effet. Ce que la personne saisit ou corrige n’est jamais réécrit ensuite par l’outil. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `08b4932c54da12dd4c50b0232db3ab6d940d0ea995edca1cd82811f19efaa967`

### 7. claim-t-recette

- Unité : `unit-t-recette` — type `information`
- Wording exact : « La recette est la séance au cours de laquelle le cabinet rejoue ses propres cas sur ses propres fichiers et décide d’accepter ou de refuser le livrable, en confrontant un cas courant, un cas limite et un cas de refus. Le vocabulaire des marchés publics informatiques l’appelle vérification puis admission. »
- Source : Légifrance, [Arrêté du 30 mars 2021 portant approbation du cahier des clauses administratives générales des marchés publics de techniques de l’information et de la communication (CCAG-TIC), article 2 « Définitions »](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043310689) — `source-legifrance-ccag-tic`
- Extrait(s) soutenant(s) :
  - « l'« admission » est la décision, prise après vérifications, par laquelle l'acheteur reconnaît la conformité des prestations aux stipulations du marché. »
- Applicabilité : Vocabulaire des marchés publics de techniques de l’information et de la communication.
- Régime : CCAG-TIC approuvé par l’arrêté du 30 mars 2021, article 2, définition de l’admission.
- Exceptions et limites : La recette Memlia est une convention de service ; le CCAG n’est cité que pour le vocabulaire vérification puis admission.
- SHA-256 du claim : `e1170a0dc837caabf7cfd94ea26cd5ba3630cbf301330345cb9a044ec0fe5e35`

### 8. claim-t-jeu-d-essai-fictif

- Unité : `unit-t-jeu-d-essai-fictif` — type `methode-memlia`
- Wording exact : « Un jeu d’essai fictif est un ensemble de données entièrement inventées, plausibles, construites pour couvrir un cas courant, un cas limite et un cas de refus, utilisé pour construire et éprouver un traitement sans jamais exposer de dossier réel. Il se distingue de données anonymisées ou pseudonymisées, qui proviennent toujours de personnes réelles. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « Un jeu d’essai fictif est un ensemble de données entièrement inventées, plausibles, construites pour couvrir un cas courant, un cas limite et un cas de refus, utilisé pour construire et éprouver un traitement sans jamais exposer de dossier réel. Il se distingue de données anonymisées ou pseudonymisées, qui proviennent toujours de personnes réelles. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `34921b975d981e6672063b19d9dff280ef814393071f1deff4dab2efe6e29dbb`

### 9. claim-t-systeme-d-ia

- Unité : `unit-t-systeme-d-ia` — type `legal-reglementaire`
- Wording exact : « Au sens de l’article 3 du règlement (UE) 2024/1689, un système d’IA est un système automatisé conçu pour fonctionner à différents niveaux d’autonomie, qui peut faire preuve d’une capacité d’adaptation après son déploiement et qui déduit, à partir des entrées qu’il reçoit, la manière de générer des sorties telles que des prédictions, du contenu, des recommandations ou des décisions. »
- Source : EUR-Lex — Union européenne, [Règlement (UE) 2024/1689 du 13 juin 2024 (règlement sur l’intelligence artificielle), texte intégral en français](https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024R1689) — `source-eurlex-ai-act`
- Extrait(s) soutenant(s) :
  - « «système d’IA», un système automatisé qui est conçu pour fonctionner à différents niveaux d’autonomie et peut faire preuve d’une capacité d’adaptation après son déploiement, et qui, pour des objectifs explicites ou implicites, déduit, à partir des entrées qu’il reçoit, la manière de générer des sorties telles que des prédictions, du contenu, des recommandations ou des décisions qui peuvent influencer les environnements physiques ou virtuels; »
- Applicabilité : Systèmes répondant à la définition de l’article 3, point 1, du règlement (UE) 2024/1689.
- Régime : Règlement (UE) 2024/1689 sur l’intelligence artificielle, définition du système d’IA.
- Exceptions et limites : La qualification d’un outil précis relève d’un examen au cas par cas ; les obligations qui en découlent dépendent du rôle et du niveau de risque.
- SHA-256 du claim : `ed401e2d1323d2e7f809c553a4a3b90c2ec02d4a858fb6b24c18ccf9f25edd99`

### 10. claim-t-ia-generative

- Unité : `unit-t-ia-generative` — type `information`
- Wording exact : « L’intelligence artificielle dite générative désigne les systèmes capables de créer des contenus — texte, code informatique, images, son ou vidéo — à partir d’une consigne, plutôt que de retrouver un contenu déjà existant. Le résultat produit est nouveau à chaque exécution, même pour une consigne proche d’une exécution précédente. »
- Source : CNIL, [Comment déployer une IA générative ? La CNIL apporte de premières précisions | CNIL](https://www.cnil.fr/fr/comment-deployer-une-ia-generative-la-cnil-apporte-de-premieres-precisions) — `source-cnil-ia-generative`
- Extrait(s) soutenant(s) :
  - « L' intelligence artificielle dite « générative » désigne les systèmes capables de créer des contenus (texte, code informatique, images, musique, audio, vidéos, etc.). Lorsqu’ils permettent de réaliser un large éventail de tâches, ces systèmes peuvent être qualifiés de systèmes d’IA à usage général. C’est par exemple le cas des systèmes intégrant des grands modèles de langage (en anglais large language models ou LLM). »
- Applicabilité : Systèmes capables de créer des contenus, tels que décrits par la CNIL.
- Régime : Présentation par la CNIL de l’IA générative et des systèmes d’IA à usage général.
- Exceptions et limites : La seconde phrase de la définition décrit le caractère non déterministe des sorties ; elle relève de la doctrine Memlia.
- SHA-256 du claim : `6bc98c19047df460c1e4b601cd8b4fe5dfb9b6c3d9b89a45ac2174183f2781e9`

### 11. claim-t-grand-modele-de-langage

- Unité : `unit-t-grand-modele-de-langage` — type `information`
- Wording exact : « Un grand modèle de langage, ou Large Language Model (LLM), est un modèle statistique entraîné sur de très grands volumes de texte, possédant un grand nombre de paramètres, généralement de l’ordre du milliard ou plus, qui prédit la suite la plus probable d’un texte donné. Cette capacité de prédiction sert ensuite de base à des usages comme la rédaction ou la synthèse. »
- Source : CNIL, [Modèle de langage | CNIL](https://www.cnil.fr/fr/definition/modele-de-langage) — `source-cnil-modele-de-langage`
- Extrait(s) soutenant(s) :
  - « Modèle statistique de la distribution d’unité linguistiques (par exemple : lettres, phonèmes, mots) dans une langue naturelle. Un modèle de langage peut par exemple prédire le mot suivant dans une séquence de mots. On parle de modèles de langage de grande taille ou « Large Language Models » (LLM) en anglais pour les modèles possédant un grand nombre de paramètres (généralement de l'ordre du milliard de poids ou plus) comme GPT-3, BLOOM, Megatron NLG, Llama ou encore PaLM. »
- Applicabilité : Modèles de langage et modèles de langage de grande taille au sens du glossaire de la CNIL.
- Régime : Définition du modèle de langage publiée par la CNIL.
- Exceptions et limites : La phrase sur les usages de rédaction ou de synthèse relève de la doctrine Memlia.
- SHA-256 du claim : `befb8f4f6740f67aa317868d7cc15a44e51810a61ad8eef43020aa6ef5837ca7`

### 12. claim-t-hallucination

- Unité : `unit-t-hallucination` — type `information`
- Wording exact : « Une hallucination est un résultat produit par un système d’IA générative qui paraît plausible et formulé avec assurance, mais qui est inexact ou inventé. Elle survient notamment lorsque le système est interrogé sur une information absente de ses données d’entraînement, sans qu’il signale cette absence. »
- Source : CNIL, [Les questions-réponses de la CNIL sur l’utilisation d’un système d’IA générative | CNIL](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative) — `source-cnil-hallucination`
- Extrait(s) soutenant(s) :
  - « Les modèles génératifs ne sont pas des bases de connaissance : ils obéissent à une logique probabiliste, ce qui signifie qu’ils ne génèrent que le résultat qui sera statistiquement le plus probable compte tenu des données sur lesquelles ils ont été entraînés. Ces systèmes peuvent générer des résultats inexacts qui peuvent, pourtant, paraître plausibles (on parle alors souvent d’hallucinations). Cela pourra survenir lorsqu’ils sont interrogés à propos d’informations qui ne sont pas présentes dans leurs données d’entraînement. C’est par exemple le cas sur des évènements postérieurs à leur développement, ces systèmes n’étant pas toujours reliés à des bases de connaissances actualisées. »
- Applicabilité : Résultats inexacts mais plausibles produits par un système d’IA générative.
- Régime : Questions-réponses de la CNIL sur l’utilisation d’un système d’IA générative.
- Exceptions et limites : La cause évoquée (information absente des données d’entraînement) est un cas parmi d’autres ; la CNIL décrit une logique probabiliste générale.
- SHA-256 du claim : `0a78153dd2c94183135fa45e234809017407817a85da3ce2bcb4c43acdeac7cb`

### 13. claim-t-reconnaissance-optique-de-caracteres

- Unité : `unit-t-reconnaissance-optique-de-caracteres` — type `information`
- Wording exact : « La reconnaissance optique de caractères, ou OCR, est une technologie qui transforme l’image d’un document — une facture scannée, une photo de ticket — en texte numérique exploitable, mot par mot et ligne par ligne. Elle lit des caractères ; elle n’interprète pas le sens de ce qu’elle lit. »
- Source : Microsoft, [OCR – reconnaissance optique de caractères - Foundry Tools | Microsoft Learn](https://learn.microsoft.com/fr-fr/azure/ai-services/computer-vision/overview-ocr) — `source-microsoft-ocr`
- Extrait(s) soutenant(s) :
  - « OCR ou Reconnaissance optique de caractères est également appelé reconnaissance de texte ou extraction de texte. Les techniques OCR basées sur le Machine Learning vous permettent d’extraire du texte imprimé ou manuscrit à partir d’images telles que des affiches, des panneaux de rue et des étiquettes de produits, ainsi que des documents tels que des articles, des rapports, des formulaires et des factures. Le texte est généralement extrait sous forme de mots, de lignes de texte et de paragraphes ou de blocs de texte, ce qui permet d’accéder à la version numérique du texte numérisé. Cette fonctionnalité élimine ou réduit considérablement la nécessité d’une entrée de données manuelle. »
- Applicabilité : Extraction de texte imprimé ou manuscrit à partir d’images et de documents.
- Régime : Documentation Microsoft Learn du service OCR, description générale de la technologie.
- Exceptions et limites : Documentation d’un éditeur : elle décrit la technologie, pas une norme ; la limite « elle n’interprète pas le sens » relève de la doctrine Memlia.
- SHA-256 du claim : `e77f5d28a5b50016c5f4b8080e704a1387ca5e96c47b6e4324004317e806a04b`

### 14. claim-t-extraction-de-donnees

- Unité : `unit-t-extraction-de-donnees` — type `information`
- Wording exact : « L’extraction de données est l’étape qui repère, dans le texte obtenu après lecture d’un document, les champs qui ont un sens métier — fournisseur, montant, taux de TVA, date d’échéance — pour les rendre exploitables par un traitement. Elle intervient après la lecture du document, jamais avant. »
- Source : Microsoft, [Qu’est-ce que Azure Document Intelligence dans les outils Foundry ? - Foundry Tools | Microsoft Learn](https://learn.microsoft.com/fr-fr/azure/ai-services/document-intelligence/overview?view=doc-intel-4.0.0) — `source-microsoft-document-intelligence`
- Extrait(s) soutenant(s) :
  - « Les modèles d’extraction de champs de document sont formés pour extraire des champs étiquetés à partir de documents. »
  - « Extrayez du texte, des structures et des paires clé-valeur. »
- Applicabilité : Extraction de champs étiquetés, de texte, de structures et de paires clé-valeur à partir de documents.
- Régime : Documentation Microsoft Learn d’Azure Document Intelligence, description des modèles d’extraction.
- Exceptions et limites : Documentation d’un éditeur : l’ordre « après la lecture, jamais avant » et les exemples de champs relèvent de la doctrine Memlia.
- SHA-256 du claim : `7c614bbd6b6a4b8afd85ead27c5bdfd2bcd14c76091778ca04ae189d91d5889b`

### 15. claim-t-sous-traitant-rgpd

- Unité : `unit-t-sous-traitant-rgpd` — type `legal-reglementaire`
- Wording exact : « Au sens du RGPD, le sous-traitant est la personne physique ou morale qui traite des données personnelles pour le compte d’un autre organisme, le responsable de traitement, dans le cadre d’un service ou d’une prestation. Ses obligations concernant ces données doivent figurer dans le contrat qui le lie au responsable de traitement. »
- Source : CNIL, [Sous-traitant | CNIL](https://www.cnil.fr/fr/definition/sous-traitant) — `source-cnil-sous-traitant`
- Extrait(s) soutenant(s) :
  - « Le sous-traitant est la personne physique ou morale (entreprise ou organisme public) qui traite des données pour le compte d’un autre organisme (« le responsable de traitement »), dans le cadre d’un service ou d’une prestation. »
  - « Les sous-traitants ont des obligations concernant les données personnelles, qui doivent être présentes dans le contrat : »
- Applicabilité : Organismes qui traitent des données personnelles pour le compte d’un responsable de traitement.
- Régime : Définition du sous-traitant au sens du RGPD et obligations à inscrire au contrat, telles que présentées par la CNIL.
- Exceptions et limites : La qualification d’un prestataire donné et le contenu exact des clauses relèvent d’une analyse juridique propre à chaque relation.
- SHA-256 du claim : `db227d0f120f49b349b67f0846585d2029247ceba99f4c9544eed2af47ce5086`

### 16. claim-t-pre-comptabilite

- Unité : `unit-t-pre-comptabilite` — type `methode-memlia`
- Wording exact : « La pré-comptabilité regroupe les tâches qui précèdent l’écriture comptable proprement dite : collecter les pièces, les trier par nature et par période, vérifier qu’elles sont lisibles et complètes, puis les préparer pour la saisie. Elle s’arrête avant l’imputation sur un compte, qui relève de la tenue comptable. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « La pré-comptabilité regroupe les tâches qui précèdent l’écriture comptable proprement dite : collecter les pièces, les trier par nature et par période, vérifier qu’elles sont lisibles et complètes, puis les préparer pour la saisie. Elle s’arrête avant l’imputation sur un compte, qui relève de la tenue comptable. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `c6887845013007b3690277b463dae90ceb28ded078b6e0b17870fcae677c1484`

### 17. claim-t-completude-du-dossier

- Unité : `unit-t-completude-du-dossier` — type `methode-memlia`
- Wording exact : « La complétude d’un dossier désigne l’état dans lequel toutes les pièces attendues pour une période donnée ont été reçues et sont lisibles, selon une liste définie à l’avance pour ce dossier. Elle se constate pièce par pièce, jamais par une impression générale que « le client a envoyé quelque chose ». »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « La complétude d’un dossier désigne l’état dans lequel toutes les pièces attendues pour une période donnée ont été reçues et sont lisibles, selon une liste définie à l’avance pour ce dossier. Elle se constate pièce par pièce, jamais par une impression générale que « le client a envoyé quelque chose ». »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `fa008e7bb0c97e1525e4015e0f22c9e9dc99128d3614f59913d48d3d471d95a5`

### 18. claim-t-relance-de-pieces

- Unité : `unit-t-relance-de-pieces` — type `methode-memlia`
- Wording exact : « La relance de pièces est la demande, adressée à un client selon une cadence définie à l’avance, des pièces manquantes pour compléter un dossier ; elle s’arrête dès leur réception. Elle porte sur des documents attendus dans une mission en cours, jamais sur une somme due. »
- Source : Memlia, [Vocabulaire et contrats Memlia](file://src/data/glossary.ts) — `source-glossary-memlia`
- Extrait(s) soutenant(s) :
  - « La relance de pièces est la demande, adressée à un client selon une cadence définie à l’avance, des pièces manquantes pour compléter un dossier ; elle s’arrête dès leur réception. Elle porte sur des documents attendus dans une mission en cours, jamais sur une somme due. »
- Applicabilité : Convention de vocabulaire ou contrat technique Memlia, limitée au service décrit.
- Régime : Convention de vocabulaire ou contrat technique propre au service Memlia décrit.
- Exceptions et limites : La définition décrit le vocabulaire Memlia ; elle ne constitue ni une norme professionnelle universelle ni une qualification juridique.
- SHA-256 du claim : `3bba2a0d062afc8d31f3fc4febeb81f79b1e560b2ecf37a9a909f6ba75bd4a77`

### 19. claim-t-prelevement-sepa-et-rejet

- Unité : `unit-t-prelevement-sepa-et-rejet` — type `juridique`
- Wording exact : « Le prélèvement SEPA permet de débiter les honoraires d’un client qui y a consenti par la signature d’un mandat de prélèvement ; un rejet est le refus de ce débit par la banque du client, qui doit le lui notifier en précisant le motif, par exemple une provision insuffisante. Un rejet n’est pas un impayé définitif : il appelle une nouvelle présentation ou un contact avec le client. »
- Source : Banque de France, [Foire aux questions - Le prélèvement SEPA | Banque de France](https://www.banque-france.fr/fr/foire-aux-questions-le-prelevement-sepa) — `source-banque-france-sepa`
- Extrait(s) soutenant(s) :
  - « Un créancier n’a légalement pas le droit d’émettre un prélèvement en l’absence du consentement du débiteur, ce dernier se matérialisant par la signature d’un mandat de prélèvement. Cependant, certains acteurs mal intentionnés parviennent à émettre des prélèvements non autorisés à l’aide de mandats fictifs. Les IBAN utilisés pour ces faux prélèvements peuvent notamment avoir été obtenus à la suite de fuites de données personnelles. »
  - « Lorsque la provision sur votre compte n’est pas suffisante, votre prestataire de services de paiement (généralement votre banque) peut refuser de payer le prélèvement. Il doit vous le notifier et vous préciser le motif du refus. »
- Applicabilité : Prélèvements SEPA émis sur mandat signé par le débiteur, et refus de paiement notifiés par la banque.
- Régime : Foire aux questions de la Banque de France sur le prélèvement SEPA.
- Exceptions et limites : La FAQ s’adresse au débiteur ; la conduite à tenir après un rejet (nouvelle présentation, contact) relève de la doctrine Memlia et des conditions du mandat.
- SHA-256 du claim : `6f53b3f2e00e3d2b327ce1f55a0a9d8c49fd785a322046a84e34f82912b628d7`

### 20. claim-t-honoraires-mensualises-et-actes-hors-forfait

- Unité : `unit-t-honoraires-mensualises-et-actes-hors-forfait` — type `legal-reglementaire`
- Wording exact : « Les honoraires mensualisés sont prélevés chaque mois sur une base fixée par la lettre de mission ; un acte hors forfait correspond à une prestation non comprise dans ce forfait, qui s’ajoute et se facture séparément, une seule fois. Le code de déontologie prévoit que les honoraires sont fixés librement entre le client et l’expert-comptable, en fonction de l’importance des diligences, de la difficulté des cas et des frais exposés. »
- Source : Légifrance, [Article 158 - Décret n° 2012-432 du 30 mars 2012 relatif à l’exercice de l’activité d’expertise comptable (code de déontologie, section 2 : devoirs envers les clients ou adhérents)](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000039401724) — `source-legifrance-deontologie-honoraires`
- Extrait(s) soutenant(s) :
  - « Les honoraires sont fixés librement entre le client et les experts-comptables ou les professionnels ayant été autorisés à exercer partiellement l'activité d'expertise comptable en fonction de l'importance des diligences à mettre en œuvre, de la difficulté des cas à traiter, des frais exposés ainsi que de la notoriété de l'expert-comptable ou du professionnel. »
- Applicabilité : Honoraires des experts-comptables et des professionnels autorisés à exercer partiellement l’activité.
- Régime : Article 158 du décret n° 2012-432 (code de déontologie des professionnels de l’expertise comptable), version en vigueur depuis le 21 novembre 2019.
- Exceptions et limites : La mensualisation et la notion d’acte hors forfait relèvent de la lettre de mission et de la doctrine Memlia, pas de l’article cité.
- SHA-256 du claim : `9a8929b79653f2fc686d7ddb784234d9f0d6f161b0b4787b8dd4248b1590978d`

### 21. claim-t-systeme-d-ia-context

- Unité : `unit-t-systeme-d-ia-context` — type `legal-reglementaire`
- Wording exact : « Un cabinet croise cette notion chaque fois qu’il évalue un outil qui promet de l’intelligence artificielle : tout logiciel n’est pas un système d’IA au sens du règlement, qui ne couvre pas les systèmes fondés sur des règles définies uniquement par des personnes pour exécuter automatiquement des opérations. La qualification conditionne les obligations qui s’appliquent à l’éditeur et, parfois, à l’utilisateur professionnel. »
- Source : EUR-Lex — Union européenne, [Règlement (UE) 2024/1689 du 13 juin 2024 (règlement sur l’intelligence artificielle), texte intégral en français](https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024R1689) — `source-eurlex-ai-act`
- Extrait(s) soutenant(s) :
  - « En outre, la définition devrait être fondée sur les caractéristiques essentielles des systèmes d’IA qui la distinguent des systèmes logiciels ou des approches de programmation traditionnels plus simples, et ne devrait pas couvrir les systèmes fondés sur les règles définies uniquement par les personnes physiques pour exécuter automatiquement des opérations. »
- Applicabilité : Distinction entre systèmes d’IA et systèmes fondés sur des règles définies uniquement par des personnes physiques.
- Régime : Considérant 12 du règlement (UE) 2024/1689, portée de la définition du système d’IA.
- Exceptions et limites : Un considérant éclaire la définition sans créer d’obligation propre ; la qualification concrète reste un examen au cas par cas.
- SHA-256 du claim : `efb28db071e7c657110757c1c1fd7326ed1bc3202b4faa61907c90a1286fe0ee`

### 22. claim-t-systeme-d-ia-commonConfusion

- Unité : `unit-t-systeme-d-ia-commonConfusion` — type `legal-reglementaire`
- Wording exact : « Un système d’IA est parfois confondu avec n’importe quel logiciel automatisé ; le règlement réserve la qualification aux systèmes qui déduisent leurs sorties à partir des entrées reçues, et exclut ceux qui appliquent des règles définies uniquement par des personnes. »
- Source : EUR-Lex — Union européenne, [Règlement (UE) 2024/1689 du 13 juin 2024 (règlement sur l’intelligence artificielle), texte intégral en français](https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:32024R1689) — `source-eurlex-ai-act`
- Extrait(s) soutenant(s) :
  - « En outre, la définition devrait être fondée sur les caractéristiques essentielles des systèmes d’IA qui la distinguent des systèmes logiciels ou des approches de programmation traditionnels plus simples, et ne devrait pas couvrir les systèmes fondés sur les règles définies uniquement par les personnes physiques pour exécuter automatiquement des opérations. »
- Applicabilité : Distinction entre systèmes d’IA et systèmes fondés sur des règles définies uniquement par des personnes physiques.
- Régime : Considérant 12 du règlement (UE) 2024/1689, portée de la définition du système d’IA.
- Exceptions et limites : Un considérant éclaire la définition sans créer d’obligation propre ; la qualification concrète reste un examen au cas par cas.
- SHA-256 du claim : `27ebfbce6e406f8b76909a34d6b7c74e47ca02791ed4f0cf0b5a33f028bd3c1e`

### 23. claim-t-sous-traitant-rgpd-context

- Unité : `unit-t-sous-traitant-rgpd-context` — type `legal-reglementaire`
- Wording exact : « Un cabinet, responsable du traitement de ses dossiers clients, qualifie chaque éditeur logiciel ou hébergeur qui traite ces données pour son compte : un outil d’IA hébergé par un tiers relève souvent de ce statut. Cette qualification impose d’inscrire dans le contrat les obligations du sous-traitant concernant les données personnelles. »
- Source : CNIL, [Sous-traitant | CNIL](https://www.cnil.fr/fr/definition/sous-traitant) — `source-cnil-sous-traitant`
- Extrait(s) soutenant(s) :
  - « Le sous-traitant est la personne physique ou morale (entreprise ou organisme public) qui traite des données pour le compte d’un autre organisme (« le responsable de traitement »), dans le cadre d’un service ou d’une prestation. »
  - « Les sous-traitants ont des obligations concernant les données personnelles, qui doivent être présentes dans le contrat : »
- Applicabilité : Organismes qui traitent des données personnelles pour le compte d’un responsable de traitement.
- Régime : Définition du sous-traitant au sens du RGPD et obligations à inscrire au contrat, telles que présentées par la CNIL.
- Exceptions et limites : La qualification d’un prestataire donné et le contenu exact des clauses relèvent d’une analyse juridique propre à chaque relation.
- SHA-256 du claim : `9bb5634192398d45efc620128acd8bea3d5c69704830f537c3aff2fbfc5c9ca5`

### 24. claim-t-sous-traitant-rgpd-commonConfusion

- Unité : `unit-t-sous-traitant-rgpd-commonConfusion` — type `legal-reglementaire`
- Wording exact : « Un sous-traitant au sens du RGPD est parfois confondu avec un simple fournisseur ; un fournisseur qui ne touche jamais aux données personnelles n’a pas ce statut, tandis qu’un éditeur d’IA qui héberge des données de dossiers en a un. »
- Source : CNIL, [Sous-traitant | CNIL](https://www.cnil.fr/fr/definition/sous-traitant) — `source-cnil-sous-traitant`
- Extrait(s) soutenant(s) :
  - « Le sous-traitant est la personne physique ou morale (entreprise ou organisme public) qui traite des données pour le compte d’un autre organisme (« le responsable de traitement »), dans le cadre d’un service ou d’une prestation. »
  - « Les sous-traitants ont des obligations concernant les données personnelles, qui doivent être présentes dans le contrat : »
- Applicabilité : Organismes qui traitent des données personnelles pour le compte d’un responsable de traitement.
- Régime : Définition du sous-traitant au sens du RGPD et obligations à inscrire au contrat, telles que présentées par la CNIL.
- Exceptions et limites : La qualification d’un prestataire donné et le contenu exact des clauses relèvent d’une analyse juridique propre à chaque relation.
- SHA-256 du claim : `88b1ae5577134c269b996a7da03f9679858cafc1d52bc41bbf4c761080c1f714`

### 25. claim-t-jeu-d-essai-fictif-commonConfusion

- Unité : `unit-t-jeu-d-essai-fictif-commonConfusion` — type `legal-reglementaire`
- Wording exact : « Un jeu d’essai fictif est parfois pris pour un jeu de données anonymisées : l’anonymisation part de données réelles et cherche à empêcher la réidentification, alors que le jeu fictif n’a jamais correspondu à une personne existante. »
- Source : CNIL, [L’anonymisation de données personnelles](https://www.cnil.fr/fr/technologies/lanonymisation-de-donnees-personnelles) — `source-cnil-anonymisation`
- Extrait(s) soutenant(s) :
  - « L’anonymisation est un traitement qui consiste à utiliser un ensemble de techniques de manière à rendre impossible, en pratique, toute identification de la personne par quelque moyen que ce soit et de manière irréversible. »
- Applicabilité : Distinction entre données inventées et données réelles anonymisées.
- Régime : Qualification de l’anonymisation selon les critères exposés par la CNIL.
- Exceptions et limites : La CNIL définit l’anonymisation ; le caractère inventé du jeu d’essai est une convention Memlia.
- SHA-256 du claim : `a81405bd15715d701a0a374c15c581b545d9e1833291eb5bbb1837f599973402`

