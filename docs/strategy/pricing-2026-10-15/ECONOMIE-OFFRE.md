# Économie et construction de l’offre Memlia

Date : 15 octobre 2026. **Document de décision interne, aucune grille commerciale publiée.**

Cette analyse distingue un modèle recommandé, des prix candidats et des hypothèses à mesurer. Elle ne démontre ni une disposition à payer des cabinets, ni un prix optimal. Les relevés concurrents et les recherches de marché de ce chantier font foi pour les prix effectivement observés ; les montants concurrents transmis dans la demande ne sont pas traités ici comme des preuves vérifiées.

Lectures : `.agents/product-marketing.md` v8 ; skills Claude `pricing` v2.1.3 et `offers` v1.0.1 ; références `pricing-models.md`, `offer-formats.md` et `guarantee-design.md`. Les statistiques générales présentes dans ces skills ne sont pas reprises comme résultats de recherche Memlia.

## Recommandation

**Conserver deux façons de payer : un forfait annuel borné pour les robots, une base de fonctionnement et une consommation pour les agents IA. Facturer séparément la mise en service lorsque l’adaptation exige du travail.**

La consommation doit correspondre à une unité de travail compréhensible pour le cabinet. Une heure pendant laquelle un programme est ouvert, un jeton de modèle ou une tentative technique ne constitue pas une unité de valeur convenable par défaut.

Les prix de 600, 1 200 et 1 800 € HT/an sont des **candidats de forfaits robots** cohérents avec le repère demandé par Kevin, à tester sur des périmètres standard. Ils ne financent pas automatiquement le déploiement, les exceptions et la maintenance de vingt et un robots sans limites. La partie difficile est le contenu du forfait et son coût, davantage que le choix entre 600 et 650 €.

Pour les agents, **ne pas copier 7 €/heure comme tarif final avant de savoir ce que cette heure mesure**. Si cette unité est retenue pour un lancement rapide, elle doit être une heure d’exécution active mesurée, accompagnée d’un devis de consommation maximale par mission et d’un plafond mensuel. L’objectif préférable après le pilote est un prix par travail livré, avec un compteur métier et un budget en euros.

## Ce que Memlia vend réellement

Memlia déploie et adapte un catalogue de vingt et un robots et douze agents. Les figurines ne sont pas douze licences à acheter : un même agent regroupe plusieurs tâches dont les coûts peuvent être très différents. Un cabinet peut aussi demander une construction sur mesure.

La prise en charge comprend un résultat défini, une règle, ses essais, une recette et une maintenance convenue. Elle comporte donc trois économies distinctes :

| Composante | Ce qu’elle finance | Facturation proposée |
|---|---|---|
| Mise en service | Accès, adaptation du connecteur et de la règle, formats, essais, accompagnement à la recette | Prix fixe accepté avant de commencer, pour le périmètre réellement à déployer |
| Fonctionnement | Supervision, gestion des incidents et maintenance du périmètre convenu | Forfait récurrent ; mutualiser ce qui est commun au même cabinet |
| Travail variable | Modèles, OCR, appels payants, calcul, stockage associé et éventuelle reprise incluse | Compris dans le volume robots ou facturé en unités agents |

Les nouveaux outils, règles, livrables, environnements ou validations constituent une extension si le devis ne les couvre pas. Un changement ordinaire de portail couvert par la maintenance ne devient pas, à chaque fois, une nouvelle installation. Préciser les deux cas au devis.

Ne pas vendre à nouveau un même connecteur parce que deux figurines s’en servent. Ne pas facturer à la fois un lot à l’agent et sa sous-tâche au robot sans le dire : une même sortie ne doit pas être comptée deux fois.

## Unités de facturation : choisir par tâche

Le nombre de dossiers peut être une bonne unité de **prévisibilité** pour une collecte répétée sur un portefeuille. Il décrit mal un traitement de documents, un tableau de bord ou une mission d’agent. Le siège utilisateur n’a pas à devenir le défaut non plus ; son inadéquation à Memlia ne signifie pas qu’il soit universellement obsolète.

| Besoin | Unité intelligible à tester | Définition indispensable |
|---|---|---|
| CFE ou taxes foncières | Dossier et campagne/année | Comptes et établissements couverts, profondeur d’historique, pièces attendues |
| Surveillance de messagerie, dette ou situation TVA | Dossier actif et période | Fréquence, comptes compris, livrables, volume atypique et authentifications |
| Anonymisation | Document ou lot borné | Formats, nombre de pages/lignes, taille maximale, types de masquage |
| Restitution FEC | Dossier, exercice et restitution | Taille de FEC, modèle de restitution, fréquence et actualisations |
| Préparation de rapprochements par un agent | Lot borné livré | Nombre maximal de lignes/pièces, sorties et exceptions attendues |
| Rédaction ou préparation d’un dossier par un agent | Travail nommé livré | Entrées nécessaires, longueur/volume, étapes couvertes et validation attendue |

Une fiche métier d’agent entière n’est pas une unité : « un travail de Balthazar » n’explique pas la différence entre lire une facture et rapprocher plusieurs milliers de mouvements.

Le contrat de compteur doit définir : identifiant de tâche, objet du cabinet, période ou version, volume maximal, état final et prix. Il permet d’éviter de compter deux fois le même dossier lors d’une relance technique.

Un résultat livré peut contenir des exceptions valides : l’automatisation ne se substitue pas au jugement de l’expert. En revanche, une session expirée, un traitement interrompu avant lecture ou une sortie inutilisable ne doit pas être présenté comme un travail abouti et facturé intégralement. Une restitution de diagnostic seule peut être facturable uniquement si elle a été commandée comme livrable distinct, au prix annoncé.

## Construction commerciale proposée

### Robots : forfait prévisible, périmètre nommé

Hypothèse de lancement : **600 / 1 200 / 1 800 € HT par an**, correspondant à trois volumes d’un périmètre standard clairement nommé. Ces montants restent des hypothèses jusqu’au rapprochement entre coûts et acceptation commerciale.

Le niveau ne doit pas dépendre du nombre de collaborateurs. Pour une collecte de portefeuille, compter les dossiers réellement autorisés et couverts par le forfait annuel, avec une règle stable d’ajout et de retrait. Ne pas faire monter une facture mensuelle parce qu’une même société a été scannée plusieurs fois. Fixer une fréquence incluse, des tailles maximales et une enveloppe annuelle ; le suivi reste simple pour le cabinet.

**Ne pas inventer ici les seuils de 100, 300 ou 600 dossiers** : ils doivent être confrontés au coût réel d’une campagne et au profil des cabinets visés. Les seuils du concurrent, une fois vérifiés, fournissent un point de comparaison, pas la preuve que les mêmes seuils conviennent à Memlia.

Pour commencer, le périmètre standard peut être un ensemble restreint de collectes ayant des connecteurs et une recette réutilisables. Le catalogue entier reste déployable. Les restitutions très personnalisées, la vidéo, les volumes documentaires importants ou des règles nouvelles font l’objet d’une extension chiffrée. Cela évite de transformer la promesse commerciale du catalogue en engagement d’illimité invérifiable.

Pas de dépassement au dossier en silence. À l’approche de l’enveloppe, proposer le palier suivant ou une extension fixe ; appliquer le nouveau prix seulement après accord. Les tâches sans unité « dossier » demandent une enveloppe spécifique ; ne pas masquer cette différence dans un forfait général.

### Agents IA : fonctionnement plus consommation plafonnée

Hypothèse de lancement recommandée : **un socle unique de fonctionnement au cabinet, puis un prix par tâche métier livrée**, annoncé avant exécution. Les tâches déployées et leur maintenance figurent dans le périmètre ; aucun abonnement par figurine ou par utilisateur.

Un socle candidat à **99 € HT/mois** pour un périmètre standard est un point de test commercial, pas une estimation du coût réel ni une recommandation définitivement calibrée. Le choisir plutôt que promettre une maintenance humaine gratuite dans un tarif d’exécution très faible. Sa pertinence devra être comparée à un socle de 50 € et de 149 € sur des coûts et des devis identiques. Le budget annuel et la consommation maximale sont toujours visibles.

Si le cabinet paie déjà un forfait robots, déduire de ce socle la part commune de fonctionnement réellement déjà facturée. La réduction doit être annoncée dans le devis ; aucun rabais systématique de 50 € n’est justifié tant que la part commune n’est pas mesurée. Une seule ligne de fonctionnement sur la facture finale est préférable à deux abonnements dont les couvertures se recoupent.

Les premiers prix unitaires se fixent **après mesure sur des lots représentatifs**, à partir du coût direct, de l’alternative disponible et de la valeur comprise par le cabinet. Fixer maintenant « 0,10 € par facture » ou « 5 € par dossier » sans connaître le traitement serait une précision fabriquée. La recommandation porte sur l’unité et les garde-fous, pas sur de faux tarifs calculés.

### Mise en service : préserver le coût de l’adaptation

Une première tâche peut avoir un tarif de mise en service fixe et un point de recette explicite. Le cabinet sait ce qu’il reçoit avant de passer au fonctionnement récurrent. Un pilote payé avec sortie possible après la recette réduit le risque d’achat sans promettre un gain en heures que Memlia n’a pas mesuré.

Un connecteur et une règle déjà réutilisables peuvent réduire la mise en service ; ils ne la rendent pas nécessairement nulle. Le sur mesure reste à prix fixe sur périmètre convenu, séparé de la consommation. Ne pas financer une construction de plusieurs jours par un engagement robot à 600 € par an sans calcul de durée de retour et sans trésorerie correspondante.

## Simulations indépendantes de marge

Tous les nombres de cette section sont des **hypothèses de stress-test**, pas les coûts constatés de Memlia. Les coûts réels de modèles, d’OCR, d’infrastructure, de stockage, de supervision, de support et de reprise sont inconnus. Le coût humain chargé de 50 ou 75 €/h n’est ni un salaire ni un prix de vente. La marge brute cible de 70 ou 80 % n’est pas un standard prouvé pour ce service.

Formules :

```text
Marge brute = (revenu HT − coûts directs de service) / revenu HT
Budget de coûts directs = revenu HT × (1 − marge cible)
Heures humaines maximales = (budget de coûts − autres coûts directs) / coût humain horaire
Prix minimal au coût = coût direct / (1 − marge cible)
```

Ce plancher n’établit pas une disposition à payer. Frais commerciaux, acquisition, développement du catalogue, frais généraux et impôts doivent encore être financés par la marge restante.

### Ce que financent réellement 600 / 1 200 / 1 800 € par an

Le tableau suivant suppose d’abord **zéro autre coût direct**, donc une borne haute généreuse du temps humain finançable.

| Revenu annuel HT | Coûts directs max. à 70 % | Heures à 50 €/h | Heures à 75 €/h | Coûts max. à 80 % | Heures à 50 €/h | Heures à 75 €/h |
|---:|---:|---:|---:|---:|---:|---:|
| 600 € | 180 € | 3,6 h | 2,4 h | 120 € | 2,4 h | 1,6 h |
| 1 200 € | 360 € | 7,2 h | 4,8 h | 240 € | 4,8 h | 3,2 h |
| 1 800 € | 540 € | 10,8 h | 7,2 h | 360 € | 7,2 h | 4,8 h |

Si les autres coûts directs valent, par exemple, **120 €/cabinet/an**, les heures humaines à 75 €/h deviennent :

| Revenu annuel HT | Marge cible 70 % | Marge cible 80 % |
|---:|---:|---:|
| 600 € | 0,8 h/an | 0 h/an |
| 1 200 € | 3,2 h/an | 1,6 h/an |
| 1 800 € | 5,6 h/an | 3,2 h/an |

Un total de 1 800 € pour vingt et un robots laisserait, à 70 % de marge et avant tout autre coût, 7,2 heures humaines annuelles à 75 €/h, soit environ **20,6 minutes par robot et par an**. Ce n’est pas un budget crédible pour vingt et une adaptations individuelles, de multiples portails et un support sans limites. Il pourrait devenir viable pour un produit très mutualisé avec très peu d’incidents ; cela reste à démontrer.

### Mise en service : isoler l’investissement initial

Pour huit heures de mise en service, le coût humain seul serait de 400 € à 50 €/h ou de 600 € à 75 €/h. Sans autre coût, le prix correspondant serait :

| Coût direct illustratif | Prix pour 50 % de marge | Prix pour 70 % de marge | Prix pour 80 % de marge |
|---:|---:|---:|---:|
| 400 € | 800 € | 1 333,33 € | 2 000 € |
| 600 € | 1 200 € | 2 000 € | 3 000 € |

Une cible de marge de prestation initiale peut différer de celle du fonctionnement. Le tableau montre le coût du choix ; il ne recommande pas d’exiger 80 % sur toute adaptation. Un amortissement dans l’abonnement exige une durée et un risque de résiliation explicites.

### Agents à 7 €/heure : très peu de support finançable

À 7 €/heure facturée, tous les coûts directs réunis doivent rester sous **2,10 €/h pour 70 % de marge**, ou **1,40 €/h pour 80 %**.

Hypothèse de calcul technique à 0,50 €/heure facturée :

| Coût humain chargé | Support max. par heure facturée à 70 % | Support max. à 80 % |
|---:|---:|---:|
| 50 €/h | 1,92 minute | 1,08 minute |
| 75 €/h | 1,28 minute | 0,72 minute |

À 75 €/h, trois minutes de reprise humaine et 0,50 € de calcul coûtent déjà 4,25 € : marge brute **39,3 %** sur 7 €. Cinq minutes de reprise donnent un coût de 6,75 € : marge **3,6 %**, avant tout autre coût. À 2 € de calcul par heure, la marge à 80 % est impossible même sans humain.

Une base de fonctionnement peut absorber les coûts fixes, mais elle ne répare pas un coût variable supérieur au revenu variable à gros volume. Les heures facturables doivent aussi être rapprochées des heures **réellement mesurées** : une attente bloquée pendant une authentification n’apporte pas le même service qu’une préparation de rapprochements.

Pour 100 heures actives facturées 7 €, la consommation vaut 700 €. Avec un socle candidat de 99 €, la facture mensuelle est de 799 €. À 70 % de marge, le budget direct total est de 239,70 €. Ce plafond doit financer le calcul des 100 heures, le support, les reprises, le fonctionnement et la maintenance attribuable au mois. Ne pas montrer cette simulation comme une économie client : aucune durée humaine évitée n’a été mesurée.

## Arbitrage entre modèles agents

| Modèle | Atout | Risque | Décision proposée |
|---|---|---|---|
| 7 € par heure machine seule | Comparaison facile à communiquer ; consommation visible si le compteur est défini | Rémunère le temps plus que le livrable, facture potentiellement les lenteurs, couvre mal support et faible usage | Repère concurrent ; solution transitoire seulement avec définition et plafond |
| Forfait seul, agents et travaux illimités | Budget très simple | Exposition aux tâches lourdes, reprises et à la consommation exceptionnelle | Écarter au lancement |
| Paiement par mission entière et succès comptable | Promesse liée à la valeur | Le jugement du cabinet et la qualité des entrées empêchent une attribution simple ; litiges sur « réussi » | Écarter pour les décisions, comptes certifiés, gains d’heures ou déclarations acceptées |
| Fonctionnement + travail métier livré et borné | Budget fixe pour la maintenance, variable lié à un livrable lisible | Nécessite un compteur, un tarif par famille et une règle d’exception honnête | Modèle cible recommandé |
| Fonctionnement + heure active plafonnée par mission | Peut démarrer avant le calibrage des prix par travail | Définition de l’heure et concurrence d’agents à expliquer | Modèle provisoire acceptable si le prix reste candidat |

Ne pas appeler « paiement au résultat » une simple sortie de modèle. « Tableau préparé, pièces et exceptions réunies selon la règle » est un livrable ; « dossier juste, conforme ou accepté par l’administration » est un résultat extérieur que Memlia ne contrôle pas.

## Garde-fous de facturation à définir avant la première facture

1. **Budget en euros avant exécution** : montant estimé et plafond par mission, plafond mensuel cabinet ; aucun dépassement automatique du plafond accepté. Alertes avant l’épuisement, puis pause sûre du prochain travail. Une action engageante conserve sa validation propre.
2. **Pas de double comptage** : même objet, même tâche, même période/version = une unité. Relances réseau, appels de sous-agents et reprises techniques internes n’ajoutent pas de facturation métier.
3. **Échec technique Memlia** : correction et rejeu technique non refacturés. Définir le traitement d’une entrée invalide avant démarrage ; ne pas facturer un lot entier dont seul un fragment a été livré sans règle de prorata annoncée.
4. **Correction du cabinet** : changement demandé des données, de la règle ou du livrable = nouvelle version, montrée comme telle et autorisée avant un nouveau travail payant. Une objection au résultat ne doit pas automatiquement devenir un travail supplémentaire.
5. **Attente exclue** si facturation horaire provisoire : temps sans exécution, file, session expirée et attente de validation ne sont pas des heures actives payantes.
6. **Concurrence contrôlée** : trois agents choisis par l’orchestrateur pour une même mission ne produisent pas trois compteurs cachés. Le cabinet autorise le total maximal de la mission ; les sous-agents sont un choix de production de Memlia.
7. **Traçabilité et contestation** : relevé tâche, quantité, période/version, état, prix et compteur restant. Les justificatifs techniques n’exposent pas inutilement des données de dossier sur une facture.
8. **Saisonnalité** : les droits de campagne ou les enveloppes annuelles robots ne disparaissent pas chaque mois. Pour les agents, annoncer la durée de validité, le report éventuel et le sort du budget non consommé ; éviter un portefeuille de crédits opaques avec péremption surprise.
9. **Maintenance et extensions lisibles** : incident couvert, modification ordinaire de portail, nouvelle tâche et nouvelle intégration ont chacun une règle explicite. Pas de support illimité promis sans capacité correspondante.
10. **Aucune métrique d’équipe** : journaliser le service et sa consommation ; ne pas transformer le modèle économique en mesure de productivité nominative des collaborateurs.

Ces règles constituent une proposition de spécification commerciale et de compteur. Elles ne prouvent pas qu’un système de facturation les applique déjà. Le site vitrine ne doit pas annoncer un compteur, un portail de budget ou un contrôle technique effectivement disponibles tant qu’ils ne sont pas construits et vérifiés.

## Test de lancement concret

**Phase 1 — mesure sans promesse de gains.** Choisir deux routines de collecte réutilisables et deux tâches agents bornées, avec un jeu fictif comprenant des cas ordinaires, des doublons, des volumes élevés et des arrêts. Mesurer coût variable, temps actif, temps total, reprise humaine, installation et livrable réellement obtenu. Aucun portail client ne doit être utilisé sans son périmètre d’autorisation.

**Phase 2 — devis pilotes payés, périmètre identique.** Présenter aux prochains prospects qualifiés une fiche d’offre simple distinguant mise en service, fonctionnement et consommation maximale. Demander quel budget ils peuvent réellement signer, quelle unité ils comprennent et quels points empêchent la signature. Consigner aussi les devis refusés, les reports et l’alternative retenue. Un avis favorable à un prix dans un entretien n’est pas une vente.

Les 600/1 200/1 800 € sont une première grille robots à tester. Pour les agents, comparer séquentiellement deux structures sur des missions comparables : fonctionnement plus heure active plafonnée, puis fonctionnement plus livrable borné. Annoncer les conditions du pilote et les maintenir pendant sa durée ; ne pas changer le tarif discrètement entre deux factures. Si le nombre de clients est faible, ce sera un apprentissage qualitatif, pas un test statistiquement concluant.

**Phase 3 — décision sur un cycle de consommation et une campagne pertinente.** Une période mensuelle ne décrit pas le coût annuel d’un robot saisonnier. Mesurer au moins la mise en service, les traitements réels et les premiers incidents ; prévoir explicitement la réserve de maintenance et vérifier après un cycle saisonnier. Ne pas projeter un seul mois calme sur douze mois de service.

Gates internes proposées, à accepter comme objectifs de pilotage :

- chaque devis reste rentable sous l’hypothèse de coût choisie et dans un scénario de volume ou support dégradé ;
- au moins 70 % de marge brute visée sur le fonctionnement standard, en incluant l’humain, sans présenter cette cible comme une vérité du marché ;
- le budget maximal, les essais ratés, les reprises et les rejouages n’engendrent aucune surprise de facturation ;
- les acheteurs comprennent leur unité sans traduction en jetons ou en heures de sous-agents ;
- un pilote converti, un renouvellement et un périmètre effectivement maintenu pèsent davantage qu’un « tarif intéressant » déclaré.

Les seuils commerciaux d’acceptation doivent partir du volume réel de prospects et de la marge minimale nécessaire. Ne pas inventer de taux de conversion objectif ou conclure à une préférence des experts-comptables à partir de quelques entretiens.

## Mesures manquantes et décision avant publication

À récupérer : temps d’adaptation par intégration et routine ; volume et fréquence par cabinet ; coût modèle/OCR/appels externes ; infrastructure attribuable ; taux d’échec et de rejeu ; temps support et reprise ; réserve de maintenance des portails ; variation saisonnière ; frais d’acquisition ; éventuelles licences à la charge du cabinet ; critères de recette ; délai et modalités de paiement.

Avant de transformer ces hypothèses en prix publics, arrêter : périmètre de chaque forfait robots, volumes/seuils et dépassements, mise en service, montant de fonctionnement agents, unité/état final facturable, premiers tarifs unitaires et plafonds. Les chiffres concurrents seuls ne permettent pas de remplir ces champs honnêtement.

Dans le simulateur ROI, distinguer **hypothèse de coût estimée**, **tarif Memlia proposé** et **prix effectivement décidé**. Montrer les frais initiaux dans le calcul de première année et distinguer les années suivantes. Déduire le temps de validation et ne compter que les gestes que le logiciel du cabinet ne prend pas déjà en charge. Le nombre de dossiers n’est pas en lui-même un nombre d’heures économisées.

Le choix recommandé est donc suffisamment clair pour préparer l’offre : **robots au forfait, agents à l’usage, mise en service selon l’adaptation, un budget maîtrisé et aucun siège**. Les montants et limites restent des paris commerciaux à tester, sans être maquillés en meilleur prix démontré.
