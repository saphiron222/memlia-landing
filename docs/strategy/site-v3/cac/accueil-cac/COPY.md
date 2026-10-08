# Accueil CAC — copy E1 pour E2, E3 et E4

## Décision éditoriale et mesure

La page vend la prise en charge d’une mécanique précise dans les outils du cabinet. Premier exemple : sélection des tiers selon la règle du cabinet ; puis écarts de confirmation et fichiers du client rapprochés de la balance. Le signataire conserve son opinion. Les fonctions déjà couvertes par la suite sont reconnues avant les exemples.

Requête primaire : `automatisation commissaire aux comptes`. Mesure C2 : 2026-10-05T22:17:28.634Z, zéro suggestion, réponse valide. Provenance : `../mesures/autocomplete-cac-2026-10-06.json`, `../REQUETES-CAC.md` et `../page-intent-plan.json`. Aucun volume mensuel mesuré. Le singulier sert à porter la requête ; le lecteur est désigné, jamais Memlia. Les intentions circularisation et alternatives restent aux pages de tâche, pas à cette entrée commerciale.

Source de copy : `src/data/accueil/cac.ts`. Le bloc « Texte intégral » ci-dessous en reprend toutes les chaînes. Onze sections au contrat `ContenuAccueil`, cinq orientations métier, cinq exemples et onze FAQ. CTA partagé : « Confier une première tâche » vers `/contact`. Bouton de navigation : « Parlons de votre tâche ». Aucun changement de l’accueil EC, de sa FAQ, de ses médias ou de ses données structurées.

## Contrat de construction pour E4

Conserver les onze sections et leur langage visuel. Les données E1 ne sont pas encore branchées dans `contenuDe`. E2 relit le fond, E3 produit les médias, E4 rend et publie.

Trois blocs additionnels de contenu sont exportés sans modifier le contrat D1 :

- `COUVERTURE_CAC` : bandeau immédiatement après Orientation, avant les exemples. Son titre exact est « Ce que votre suite d’audit fait déjà ». Pas un élément escamoté dans la FAQ.
- `FRONTIERE_CAC` : tableau visible à trois colonnes dans Méthode, après l’étape de cadrage. Conserver les colonnes sur mobile avec en-têtes accessibles. La prose de l’étape ne remplace pas ce tableau.
- `FICHE_OUTIL_CAC` : encadré dans Méthode, après les étapes ; afficher le lien H2A. La fiche est un support Memlia, pas un modèle exigé par le § 14 ni un certificat de conformité.

Le hero garde une affiche CAC. `video` et `sousTitres` sont vides tant qu’E9 n’a pas livré les médias CAC : E4 rend le poster seul et masque lecteur, lecture et téléchargement. Ne jamais passer une chaîne vide à un lecteur rendu, ni reprendre le film EC. Cette variante est à construire par E4 ; elle n’existe pas encore dans Hero. SEO_CAC fournit les métadonnées ; og:title et headline éventuel reprennent le H1 exact. E4 utilise la FAQ CAC pour le rendu et le schéma, jamais FAQ EC. L’image sociale CAC vient d’E3.

Les ancres locales d’Orientation pointent vers les H3 `use-certification`, `use-interventions`, `use-sacc`, `use-durabilite`, `use-administration`, déjà construits par Usages. Les garanties pointent vers `faq-<id>`, selon Faq. Pas de liens vers des pages service encore absentes. Méthode et Garanties restent accessibles par leurs ancres locales.

Sources publiques compactes à placer après FAQ : H2A NEP 315 révisée, NEP 505, NEP 230 ; CNCC Code de commerce et code de déontologie. Libellés éditoriaux et liens seulement ; dates d’ouverture et extraits exacts restent dans ce document interne. Les citations ci-dessous ne sont pas de la copy commerciale.

## Sources et rattachement des faits pour E2

Ouvertures officielles effectuées pendant E1, le 08/10/2026 en France (les preuves d’ouverture sont dans les résultats Hermes). Numérotation 2024. La brochure législative CNCC est une consolidation de septembre 2024, pas une attestation d’absence de modification ultérieure ; E2 vérifie la version applicable avec son référentiel avant PASS. Aucune obligation mouvante de CSRD, date de mise en œuvre, seuil légal ou pourcentage H2A n’est affirmé dans la page.

### S1 — H2A, NEP 315 révisée

URL : https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/

Extraits exacts :

- § 14 : « Ces outils et techniques automatisés se distinguent des plateformes et logiciels d’audit utilisés pour documenter les travaux du commissaire aux comptes. »
- § 46 : « la manière dont les outils fonctionnent » ; « le degré de pertinence et de fiabilité des informations qui sont intégrées dans ces outils ».
- § 48 d) : « Les éléments d’appréciation des outils et techniques automatisés visés au paragraphe 46. »

Rattachement : FICHE_OUTIL_CAC, méthode étape 4, garantie fiche, FAQ fiche. Les rubriques de notre fiche sont un engagement de livraison issu de la charte v5 § 6, pas des exigences de formulaire attribuées à la norme. La NEP 330 peut ajouter des exigences selon la procédure ; aucune suffisance universelle de la fiche n’est annoncée.

### S2 — H2A, NEP 505

URL : https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/

Extraits exacts :

- § 09 : « Le commissaire aux comptes a la maîtrise de la sélection des tiers à qui il souhaite adresser les demandes de confirmation, de la rédaction et de l’envoi de ces demandes, ainsi que de la réception des réponses. »
- § 13 : « Lorsque le commissaire aux comptes n’obtient pas de réponse à une demande de confirmation, il met en œuvre des procédures d’audit alternatives permettant de collecter les éléments qu’il estime nécessaires pour vérifier les assertions faisant l’objet du contrôle. »
- § 14 : « il met en œuvre des procédures d’audit supplémentaires afin de les obtenir. »
- § 15 : « Le commissaire aux comptes évalue si les résultats des demandes de confirmation des tiers et des procédures d’audit alternatives et supplémentaires mises en œuvre apportent des éléments suffisants et appropriés pour vérifier les assertions faisant l’objet du contrôle. »

Rattachement : frontière, preuves, FAQ sélection et alternatives. La feuille rapproche et référence ; elle ne décide pas qu’une non-réponse est résolue. Aucun taux de couverture n’est présenté comme normatif, aucune taille de sondage ni extrapolation n’est promise. La combinaison de critères et la graine sont une convention du cabinet, pas une prescription de NEP 530.

### S3 — H2A, NEP 230

URL : https://h2a-france.org/normes/documentation-de-laudit-des-comptes/

Extraits exacts § 04 : « la nature, le calendrier et l’étendue des procédures d’audit effectuées » ; « les caractéristiques qui permettent d’identifier les éléments qu’il a testés afin de préciser l’étendue des procédures mises en œuvre » ; « les résultats de ces procédures et les éléments collectés » ; « les conclusions du commissaire aux comptes sur ces problématiques ».

Rattachement : FAQ dossier, références de source dans Intégration, fiche outil. Aucun délai d’archivage ni garantie de dossier complet n’est vendu. Les traces du traitement ne se substituent pas à la documentation du CAC.

### S4 — CNCC, Code de commerce, partie législative

URL : https://doc.cncc.fr/docs/brochure-code-com-partie-legislative-2024/attachments/brochure-ccom-legislative-septembre-2024

Extraits exacts :

- L.821-35 : « les commissaires aux comptes, ainsi que leurs collaborateurs et experts, sont astreints au secret professionnel pour les faits, actes et renseignements dont ils ont pu avoir connaissance dans l’exercice de leur profession ».
- L.821-31 : « Le commissaire aux comptes ne peut prendre, recevoir ou conserver, directement ou indirectement, un intérêt auprès de la personne ou de l’entité pour laquelle il exerce une mission ou une prestation ».
- L.821-37 : « Les commissaires aux comptes sont responsables, tant à l’égard de la personne ou de l’entité que des tiers, des conséquences dommageables des fautes et négligences par eux commises dans l’exercice de leur profession. »
- L.821-53 : « Les commissaires aux comptes certifient, en justifiant de leurs appréciations, que les comptes annuels sont réguliers et sincères ».

Rattachement : hero, garanties, FAQ secret, indépendance et opinion. L.821-27 porte les incompatibilités générales ; L.821-31 ne résume pas seul tout le droit de l’indépendance. Les références de FAQ restent celles de la charte v5. L.821-7 protège le titre : nos noms désignent des tâches ; Memlia n’est jamais nommé CAC.

### S5 — CNCC, code de déontologie, mars 2026

URL : https://doc.cncc.fr/docs/codedeontologiemars2026/attachments/brochure-code-de-deontologie-mars-2026

Extrait exact art. 5 I : « Le commissaire aux comptes doit être indépendant de la personne ou de l’entité à laquelle il fournit une mission ou une prestation. » Rattachement : orientation SACC, usages SACC, garanties et FAQ indépendance. Articles 9 et 10 : secret et recours aux collaborateurs/experts ; responsabilité au CAC. Le document est une consolidation CNCC ; seuls les textes publiés au JO font foi. Aucun régime transitoire ni délai n’est repris dans la page.

### S6 — Demande et vocabulaire, pas preuve de droit

`../DEMANDE-CAC.md`, `../TERRAIN-CAC.md` et `../terrain/verbatims.json` si disponible dans le dépôt : langage des gestes, questions de circularisation, lien entre réponse, pièce et dossier. Les forums anciens et questions éditoriales ne sont pas présentés comme des témoignages Memlia.

FAQ sélection : NEP505 + demande circularisation ; alternatives : question observée dans la recherche du 05/10 § 3.1 et 3.2 + C2 § 4.1 ; fiche : question de formation CEECA dans C2 § 3 et § 4.4 ; dossier : C1 thème lisibilité ; suite : décision de couverture du 06/10 ; secret, indépendance, opinion : objections de la charte v5 ; arrêt et essais : questions pratiques construites à partir des limites du service ; prix : objection commerciale de la charte. Le titre FAQ dit « questions à régler », pas « questions de nos clients ». La banque C1 ne démontre pas que toutes ces formulations ont été prononcées mot pour mot.

### S7 — Couverture et promesse de service

`../REGLE-COUVERTURE-CAC.md` prime sur `../ARCHITECTURE-CAC.md`. Note interne du coffre : `~/memlia-vault/10-memlia/chantiers/cac-site-niveau-superieur/sorties/couverture-logiciels-2026-10-06/00-synthese.md`. Fonctions issues des pages d’éditeurs, pas tests de toutes les versions. La copy impose leur vérification par cabinet et ne dit jamais qu’aucun éditeur ne couvre ces gestes.

Charte `.agents/product-marketing.md` v5 : bénéfices sans chiffres, règle écrite, prix à la complexité, maintenance, données fictives et préservation des saisies. Toute description de traitement est un périmètre à construire et recetter par mission, pas une intégration CAC déjà livrée. Les autres pôles restent conditionnels ; aucun catalogue CAC opérationnel n’est annoncé.

H2A contrôles 2025 (note source du 05/10 § 1.8) : contexte de recherche pour les références, dates et points ouverts. Aucun pourcentage repris : les contrôles ne sont ni un taux national représentatif ni une preuve de performance Memlia.

## Brief E3 — trois illustrations, un jeu fictif

Jeu nommé « Mandat fictif Atelier des Rives ». Ni cabinet réel ni capture d’automatisation livrée. Le libellé « Illustration fonctionnelle fictive » reste visible. Rendu HTML figé par la chaîne existante, DA canonique, aucun ajout de style produit hors contrat.

1. `cac/accueil-selection-tiers` : population fictive, critères de solde et mouvement, part aléatoire et graine visibles ; choix couverture ou nombre, jamais seuil normatif. Deux passes nommées « intermédiaire » et « clôture », raisons de sélection et ajouts visibles, validation en attente. Les résultats numériques éventuels sont calculés depuis une fixture rejouée par E3. Aucune promesse d’extrapolation sur la population. Quotidien, Promesse et Méthode observation/essais utilisent cette scène. Le poster et l’image sociale en sont des compositions propres à CAC.
2. `cac/accueil-ecarts-confirmation` : réponse reçue avec différence ; non-réponse ouverte ; période incompatible bloquée ; pièces référencées et proposition de rapprochement distincte du commentaire saisi. Zone « Appréciation du CAC » vide ; procédures alternatives à décider/documenter par l’équipe. Preuves et dernière étape de Méthode utilisent cette scène.
3. `cac/accueil-fichiers-balance` : état d’immobilisations fictif et comptes de balance de même période, comparaison de montants, référence d’origine ; clé multiple ou période incohérente arrêtée. Le total concordant n’est pas nommé contrôle suffisant ou comptes fiables. Intégration, Garanties et cadrage de Méthode utilisent cette scène.

Les IDs sont réservés, pas encore enregistrés dans PROOFS. E3 fournit textes alt, détail, manifeste et fichiers ; E4 refuse toute référence manquante. Réutilisation des trois scènes dans la même page autorisée par le périmètre E3 ; aucun média EC, aucun contrôle FEC ou revue analytique comme preuve.

## Auto-relecture E1 selon v5

- Clarté : part répétitive précise avant l’IA ; une tâche entière au devis, pas un abonnement à un outil.
- Voix : nous, vous, phrases concrètes ; aucun témoignage, superlatif ou gain fabriqué.
- Valeur : moins de manipulations, règle conservée au cabinet, continuité de l’équipe ; aucune peur du contrôle H2A comme levier de vente.
- Preuves : sources S1–S7 rattachées ; illustrations et essais distingués des fonctions livrées.
- Frontière : proposition/validation, arrêt, essais et tableau trois colonnes ; sélection et opinion jamais déléguées au traitement.
- Risque : secret documenté sans promesse d’hébergement ni de traitement local non vérifié ; indépendance par mission ; SACC et durabilité conditionnels.
- Acquisition : requête mesurée sans volume inventé ; pas de concurrence avec les pages de tâche ni de faux guide marque.
- Conversion : un CTA partagé ; description suffisante ; aucun fichier demandé.

Cette auto-relecture ne remplace pas E2. La page n’est pas publiée par E1. Le build de l’existant et le contrat des données sont vérifiés séparément ; la surface CAC rendue, les médias et la production appartiennent à E3/E4.

## Frontière à rendre en tableau

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Classer la population et préparer le tirage avec la graine conservée. | La proposition de tiers et sa couverture selon vos critères. | Choisir assertions, risques, méthode et paramètres. |
| Comparer les deux passes et signaler les nouveaux tiers. | La liste retenue et sa transmission dans le circuit autorisé. | Garder la maîtrise des demandes et apprécier les réponses. |
| Calculer les différences comparables et référencer les pièces. | Le rapprochement proposé et les éléments à examiner. | Décider des procédures alternatives ou supplémentaires et conclure. |

Le tableau exact de production est exporté dans FRONTIERE_CAC et transcrit ci-dessous. Ce résumé sert à la lecture métier du mécanisme.

## Texte intégral issu des données

### SEO_CAC

#### chemin

/commissaires-aux-comptes

#### requete

automatisation commissaire aux comptes

#### titre

Automatisation pour commissaire aux comptes | Memlia

#### description

Automatisation pour commissaire aux comptes : sélection des tiers, écarts de confirmation et rapprochements. Votre équipe garde ses contrôles et son jugement.

### COUVERTURE_CAC

#### titre

Ce que votre suite d’audit fait déjà

#### texte

Réception du FEC, procédures analytiques (revue analytique), dossier de travail, modèles de rapport, collecte de pièces et archivage : nous partons des fonctions de votre suite. Nous vérifions celles que vous utilisez avant de proposer un traitement.

#### suite

La sélection selon votre règle, les écarts de confirmation et les fichiers du client à rapprocher de la balance sont nos points de départ. Les lettres, l’envoi et les relances restent dans votre circuit de circularisation.

### FRONTIERE_CAC

#### titre

La règle écrite pour une sélection de tiers

#### colonnes

##### 1

Se prépare seul

##### 2

Attend votre validation

##### 3

Reste humain

#### lignes

##### 1

###### 1

Classer la population selon les soldes et mouvements prévus ; préparer le tirage avec la graine conservée.

###### 2

La proposition de tiers et sa couverture, selon les critères que vous avez fixés.

###### 3

Choisir les assertions, les risques, la méthode de sélection et les paramètres.

##### 2

###### 1

Comparer la première passe à celle de clôture et signaler les nouveaux tiers.

###### 2

La liste retenue et sa transmission dans le circuit autorisé.

###### 3

Garder la maîtrise des demandes et apprécier les réponses et les non-réponses.

##### 3

###### 1

Calculer les différences entre montants comparables et référencer les pièces disponibles.

###### 2

Le rapprochement proposé et les éléments à examiner.

###### 3

Décider des procédures alternatives ou supplémentaires et conclure.

### FICHE_OUTIL_CAC

#### titre

Une fiche outil pour votre dossier

#### texte

La livraison comprend une fiche outil : objectif, périmètre, méthode et version, données d’entrée, contrôles de fiabilité, paramètres, sorties et traces. Elle décrit aussi les limites, les arrêts et les essais fictifs. Vous disposez de ces éléments pour apprécier l’outil et documenter son usage dans la mission.

#### precision

La NEP 315 révisée distingue les outils et techniques automatisés des logiciels de dossier (§ 14). Elle demande d’en apprécier le fonctionnement et les informations intégrées (§ 46), puis de consigner cette appréciation (§ 48 d). La fiche est notre support de livraison. Votre appréciation et vos travaux restent à documenter.

#### source

##### libelle

H2A, NEP 315 révisée

##### href

https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/

### MEDIAS_CAC

#### selection

cac/accueil-selection-tiers

#### ecarts

cac/accueil-ecarts-confirmation

#### rapprochements

cac/accueil-fichiers-balance

### CONTENU_CAC

#### hero

##### etiquette

Automatisation IA pour cabinets de commissariat aux comptes

##### titre

Automatisation pour commissaire aux comptes : confiez la mécanique, gardez le jugement.

##### texte

Quels tiers retenir, quel retour rapprocher, quel fichier comparer à la balance : votre équipe connaît les gestes. Nous écrivons leur règle avec vous et automatisons la part répétitive dans vos outils. Vos auditeurs gardent leurs contrôles. Le signataire garde son opinion.

##### poster

/proofs/cac/accueil-selection-tiers.webp

##### video



##### sousTitres



#### orientation

##### titre

Partez de la tâche qui revient dans vos missions.

##### destinations

###### 1

###### libelle

Certification des comptes

###### href

#use-certification

###### texte

Sélection des tiers à circulariser, écarts de confirmation, fichiers du client à rapprocher : une mécanique cadrée autour de vos travaux.

###### 2

###### libelle

Interventions légales

###### href

#use-interventions

###### texte

Une opération ponctuelle : réunir les données et préparer les comparaisons prévues, dans le périmètre de cette intervention.

###### 3

###### libelle

Services autres que la certification des comptes (SACC)

###### href

#use-sacc

###### texte

Une prestation distincte : écrire le traitement attendu et ses limites, après votre appréciation de l’indépendance.

###### 4

###### libelle

Durabilité

###### href

#use-durabilite

###### texte

Pour une mission entrant dans votre périmètre : préparer les rapprochements entre indicateurs et pièces. Le cadrage précède toute automatisation.

###### 5

###### libelle

Administration des mandats

###### href

#use-administration

###### texte

Préparer les comparaisons de budget ou l’échéancier que vos outils ne couvrent pas, avec les paramètres de votre cabinet.

##### invitation

Voir comment une tâche se prend en charge

##### services

###### 1

###### libelle

La règle écrite

###### href

#methode

###### 2

###### libelle

Vos garanties

###### href

#garanties

###### 3

###### libelle

Les questions pratiques

###### href

#questions

#### quotidien

##### titre

Votre règle de sélection ne devrait pas vivre dans une seule tête.

##### texte

La balance arrive. Vous reprenez les plus gros soldes, les mouvements à examiner et la part aléatoire prévue. À la clôture, il faut retrouver les critères de la première passe, puis expliquer les ajouts. Nous écrivons cette règle pour qu’elle se rejoue et se relise.

##### points

###### 1

###### titre

Reprendre les paramètres.

###### texte

Population, critères, couverture ou nombre de comptes : les choix du cabinet restent visibles d’une passe à l’autre.

###### 2

###### titre

Retrouver l’origine.

###### texte

Chaque proposition renvoie à son tiers, à sa source et à la règle qui l’a retenue.

###### 3

###### titre

Transmettre le savoir-faire.

###### texte

Le chef de mission relit la règle écrite. L’auditeur suivant retrouve les paramètres plutôt que de reconstituer le geste.

##### note

L’objectif est de décharger l’équipe des manipulations répétitives et de garder la règle au cabinet. Le choix des diligences reste au commissaire aux comptes.

##### image

cac/accueil-selection-tiers

#### promesse

##### titre

Vous confiez une tâche. Nous la prenons entière.

##### texte

Observation, règle écrite, construction, essais, validation par votre équipe et maintenance : nous prenons en charge le traitement convenu. Vos auditeurs travaillent sur les écarts qui demandent une appréciation.

##### points

###### 1

###### titre

Une règle qui appartient au cabinet.

###### texte

Les sources, les critères et les exceptions s’écrivent dans vos mots avant de devenir un traitement.

###### 2

###### titre

Des propositions à relire.

###### texte

La sélection et les rapprochements préparés restent distincts de vos commentaires et de vos conclusions.

###### 3

###### titre

Des arrêts expliqués.

###### texte

Une période incohérente ou une référence absente bloque la proposition concernée. Le cas reste visible pour votre équipe.

##### image

cac/accueil-selection-tiers

#### usages

##### titre

Des gestes précis, dans le périmètre de chaque mission.

##### texte

Commencez par la certification et une tâche que votre suite laisse à l’équipe. Pour les autres missions, nous vérifions ensemble le besoin et la frontière du traitement avant de nous engager.

##### exemples

###### 1

###### id

certification

###### title

Préparer la sélection et les rapprochements

###### text

Appliquer votre règle de soldes, mouvements et part aléatoire aux tiers à circulariser. Préparer deux passes, puis la feuille des écarts de confirmation. Rapprocher les fichiers de paie, d’immobilisations ou d’inventaire avec les comptes convenus de la balance.

###### 2

###### id

interventions

###### title

Préparer les comparaisons d’une intervention légale

###### text

Pour une opération d’apport, de fusion ou de transformation, définir les sources et les comparaisons à préparer. La nature de la mission, les contrôles et les conclusions restent au professionnel.

###### 3

###### id

sacc

###### title

Cadrer la mécanique d’une prestation distincte

###### text

Écrire les rapprochements attendus pour un service autre que la certification des comptes. Le périmètre, les accès et l’appréciation de l’indépendance se traitent séparément pour chaque mission.

###### 4

###### id

durabilite

###### title

Relier un indicateur à ses pièces

###### text

Si la mission entre dans le périmètre de votre cabinet, cadrer une préparation reliant les indicateurs reçus à leurs sources. L’appréciation de ces informations et les conclusions restent au professionnel chargé de la mission.

###### 5

###### id

administration

###### title

Préparer les repères du portefeuille de mandats

###### text

Partir des dates et budgets que vous avez retenus pour préparer un échéancier ou une comparaison. Nous conservons les fonctions de votre suite, notamment le préremplissage des déclarations qu’elle propose.

#### methode

##### titre

La règle écrite, appliquée à vos travaux d’audit.

##### libelleEtape

Étape

##### etapes

###### 1

###### numero

###### titre

Observer le geste et sa frontière.

###### texte

Nous suivons la tâche avec votre équipe et repérons ce que votre suite fait déjà. Nous écrivons la frontière en trois colonnes : préparation seule, validation attendue, jugement humain.

###### image

cac/accueil-selection-tiers

###### 2

###### numero

###### titre

Écrire la proposition et ses arrêts.

###### texte

Votre cabinet fixe les critères. Nous écrivons la règle qui prépare une proposition et conserve vos saisies. Dans le doute, le traitement s’arrête : population incomplète, période différente ou clé ambiguë.

###### image

cac/accueil-fichiers-balance

###### 3

###### numero

###### titre

Rejouer la règle sur un dossier fictif.

###### texte

Un jeu d’essai fictif utilise des données inventées. Nous vérifions les résultats attendus et les cas qui doivent s’arrêter. Pour un tirage, la graine et les paramètres permettent de reproduire la sélection sur la même population.

###### image

cac/accueil-selection-tiers

###### 4

###### numero

###### titre

Faire valider, remettre la fiche outil, maintenir.

###### texte

La recette est la vérification du traitement par votre équipe dans l’environnement autorisé. Nous livrons la règle, les essais et la fiche outil pour votre appréciation au dossier. La maintenance et les évolutions sont écrites au devis.

###### image

cac/accueil-ecarts-confirmation

#### integration

##### titre

Votre suite d’audit reste le point de départ.

##### texte

Nous partons de vos exports, fichiers et circuits existants. Pour rapprocher un état d’immobilisations de la balance, nous cadrons les périodes, les comptes, les clés et les pièces à retrouver.

##### limites

Formats, accès et fonctions de votre version sont vérifiés avant l’engagement. Une connexion directe n’est annoncée qu’après cette vérification.

##### regles

###### 1

###### titre

Conserver les fonctions utilisées.

###### texte

Les lettres et leur circuit d’envoi restent dans vos outils de circularisation.

###### 2

###### titre

Rendre la source lisible.

###### texte

Le tableau préparé conserve les références nécessaires pour retourner au fichier et à la ligne concernés.

###### 3

###### titre

Cadrer les changements.

###### texte

Une nouvelle structure de fichier ou un changement de règle se vérifie avant de reprendre le traitement.

##### image

cac/accueil-fichiers-balance

#### preuves

##### etiquette

Illustrations fonctionnelles fictives

##### titre

Une différence calculée reste un point à examiner.

##### texte

La feuille prépare les écarts entre la demande et la réponse. Une différence de période ou de périmètre bloque le rapprochement. Une non-réponse reste ouverte pour l’équipe d’audit.

##### propriete

Vos commentaires et conclusions restent intacts quand la proposition se régénère. Le CAC décide des procédures alternatives ou supplémentaires et apprécie les éléments obtenus. Aucun envoi externe sans validation humaine.

##### reperes

###### 1

###### title

La sélection se reproduit.

###### text

Même population, même version, mêmes paramètres et même graine : le jeu fictif permet de vérifier le tirage.

###### 2

###### title

L’écart garde son origine.

###### text

Le montant demandé, le montant reçu et leurs références restent visibles. Le calcul ne vaut pas conclusion.

###### 3

###### title

Le rapprochement montre ses limites.

###### text

Une pièce absente ou deux clés possibles laissent la ligne ouverte. Le traitement n’invente pas de correspondance.

##### image

cac/accueil-ecarts-confirmation

#### garanties

##### titre

Le secret, l’indépendance et le jugement cadrent la mission.

##### invitation

Lire les réponses pour votre cabinet

##### image

cac/accueil-fichiers-balance

##### liens

###### 1

###### picto

bouclier

###### libelle

Données et accès cadrés par mission

###### href

#faq-secret

###### 2

###### picto

regle

###### libelle

Indépendance appréciée par le CAC

###### href

#faq-independance

###### 3

###### picto

main

###### libelle

Opinion et responsabilité au CAC

###### href

#faq-opinion

###### 4

###### picto

fictif

###### libelle

Des données inventées pour les essais

###### href

#faq-essais

###### 5

###### picto

stop

###### libelle

Le doute arrête la proposition

###### href

#faq-arret

###### 6

###### picto

regle

###### libelle

Une fiche outil pour votre appréciation

###### href

#faq-fiche

#### faq

##### titre

Les questions à régler avant de confier une tâche.

##### texte

Votre suite, les données, la sélection et le dossier : des réponses pour délimiter le traitement.

##### questions

###### 1

###### id

suite

###### question

Notre suite d’audit fait déjà ces travaux. Que prenez-vous en charge ?

###### reponse

Nous vérifions d’abord ce que votre version couvre. Nous conservons ces fonctions et ciblons le geste restant : votre règle de sélection des tiers, les écarts de confirmation ou les fichiers du client à rapprocher de la balance. Si votre outil couvre déjà la tâche, nous vous le disons.

###### 2

###### id

selection

###### question

Qui choisit les tiers à circulariser ?

###### reponse

Vous fixez la population, les critères et les paramètres. Nous préparons une sélection selon cette règle, avec les raisons du choix et la graine du tirage. Vous retenez les tiers. La NEP 505 (§ 09) vous laisse la maîtrise de la sélection, de la rédaction, de l’envoi et de la réception des réponses.

###### 3

###### id

alternatives

###### question

Que faire lorsqu’un tiers ne répond pas ?

###### reponse

La non-réponse reste visible. Nous préparons les rapprochements et les références aux pièces prévues dans le périmètre. Vous décidez et mettez en œuvre les procédures alternatives nécessaires, puis appréciez les éléments obtenus. La NEP 505 (§ 13 à 15) prévoit aussi des procédures supplémentaires lorsque les éléments restent insuffisants.

###### 4

###### id

fiche

###### question

Comment apprécier l’outil pour la NEP 315 révisée ?

###### reponse

Nous remettons une fiche décrivant le fonctionnement, la version, les entrées, les contrôles de fiabilité, les paramètres, les sorties et les limites. Les essais fictifs montrent les résultats et les arrêts attendus. Vous appréciez le fonctionnement et les informations intégrées, puis consignez votre appréciation au dossier (§ 46 et 48 d). Le § 14 définit les outils automatisés ; il n’impose pas notre modèle de fiche.

###### 5

###### id

dossier

###### question

Le tableau préparé suffit-il pour documenter les travaux ?

###### reponse

Vous appréciez et complétez les paramètres, traces et résultats remis. La NEP 230 (§ 04) demande de pouvoir comprendre les procédures, les éléments testés, les résultats et les conclusions. La fiche décrit le traitement ; votre dossier documente aussi vos travaux et votre jugement. Un export seul ne démontre pas la suffisance des diligences.

###### 6

###### id

secret

###### question

Comment cadrer le secret professionnel et les accès ?

###### reponse

Le secret de L.821-35 s’applique aux CAC, collaborateurs et experts. Avant la mission, nous décrivons les données lues, les accès, les destinataires et les traitements. Les essais utilisent des données fictives. Une exécution locale se vérifie aussi par ses appels réseau et sa télémétrie. Vous appréciez les conditions d’utilisation ; le recours à Memlia ne lève pas le secret.

###### 7

###### id

independance

###### question

Notre cabinet fait aussi la comptabilité. Pouvons-nous partager la règle ?

###### reponse

Chaque mission conserve son périmètre, ses accès et ses responsabilités. Vous appréciez les incompatibilités et les risques d’indépendance, notamment au regard de L.821-27, L.821-31 et du code de déontologie. Le partage d’un outil ne justifie pas de préparer puis d’auditer les mêmes comptes.

###### 8

###### id

opinion

###### question

Qui conserve l’opinion et la responsabilité de la mission ?

###### reponse

Le commissaire aux comptes conserve la responsabilité de sa mission et de son opinion. Nous préparons les sélections, rapprochements et exceptions. Votre équipe garde les contrôles et le signataire ses conclusions et sa signature. Une sortie de traitement ne certifie pas les comptes.

###### 9

###### id

arret

###### question

Que se passe-t-il si les fichiers ne concordent pas ?

###### reponse

Une période différente, une population incomplète ou une clé ambiguë bloque la proposition concernée et en affiche la raison. Vos commentaires restent conservés. L’équipe examine le cas avant de reprendre ; le traitement ne complète pas une donnée au jugé.

###### 10

###### id

essais

###### question

Comment vérifier le traitement avant son utilisation ?

###### reponse

Nous construisons un jeu d’essai fictif avec des données inventées. Il contient les cas qui doivent aboutir et ceux qui doivent s’arrêter. Votre équipe vérifie ensuite le traitement dans l’environnement autorisé : c’est la recette. Cette vérification et la fiche outil accompagnent votre appréciation ; elles ne garantissent pas la conformité du dossier aux NEP.

###### 11

###### id

prix

###### question

Que comprend le devis ?

###### reponse

Une tâche prise en charge, de l’observation à la livraison et à la maintenance convenue. Le prix dépend des sources, des règles, des exceptions et des validations. Vous payez la complexité du traitement, pas des sièges. Le périmètre, les critères de recette, le support et les évolutions sont écrits avant de commencer.

#### appelFinal

##### titre

Quelle manipulation votre équipe refait-elle à chaque mandat ?

##### texte

Décrivez le geste en trois phrases. Nous vous disons ce que votre suite couvre, ce qui peut se cadrer et ce que nous prendrions en charge. Rien à envoyer : la description suffit.

##### points

###### 1

Le geste restant : votre équipe, ses outils et le résultat attendu.

###### 2

La règle : les sources, les exceptions et les validations.

###### 3

Le devis : une tâche entière, avec sa recette et sa maintenance.

