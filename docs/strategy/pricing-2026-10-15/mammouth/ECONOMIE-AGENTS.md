# Agents Memlia : unités, mise en service et économie de lancement

15 octobre 2026. Document interne de proposition commerciale. Kevin a retenu le socle de **99 € HT/mois** et une consommation distincte des agents ; le fournisseur IA demandé est Mammouth. Les montants unitaires et de mise en service ci-dessous sont des **prix candidats concrets**, pas des tarifs historiquement pratiqués, une disposition à payer mesurée ni des coûts constatés. Aucun code produit, contrat ou prix public n’est modifié par ce document.

Références : charte `.agents/product-marketing.md` v8, `RECOMMANDATION.md`, `ECONOMIE-OFFRE.md`, skills Claude `pricing` et `offers`. Le parent du chantier calcule séparément les coûts API Mammouth à partir des informations publiques. **Les réserves techniques de cette note ne sont pas des prix Mammouth : elles devront être remplacées ou rapprochées de ce calcul avant adoption de la grille.** Aucun benchmark facturé n’a été lancé.

## La proposition en une phrase

**99 € HT/mois pour le maintien en service du périmètre déployé, puis de 1 à 79 € par travail borné remis ; une mise en service à 790 €, 1 990 € ou sur devis à partir de 4 900 €, selon le travail d’adaptation.**

Le montant de consommation dépend de la tâche et de son volume, pas de la figurine utilisée ni du nombre de collaborateurs. Les agents du catalogue utilisent les mêmes familles d’unités. Les nouvelles intégrations, modèles et règles doivent être déployés avant d’être disponibles à ce prix d’usage. Le cabinet garde sa validation et son jugement ; aucune revue comptable, juridique, sociale ou d’audit par un professionnel Memlia n’est implicitement comprise dans ces prix.

## 1. Huit unités de travail proposées

Prix HT par unité **dans un gabarit et une règle déjà déployés et recettés**. Les bornes d’entrée, de sortie, de langue, de format et de règles sont contractuelles. Les nombres de pages désignent des pages normalement lisibles, non des images compressées contenant une quantité de données arbitraire ; le plafond de données réellement accepté est contrôlé avant lancement. Un export complexe ou un document surdimensionné ne devient pas artificiellement une seule page.

| Code | Travail et prix candidat | Entrées et limites par unité | Sortie remise |
|---|---|---|---|
| **U1** | **Pièce lue et structurée — 1 €** | Un document, jusqu’à 5 pages et 30 champs attendus ; un seul type documentaire/règle | Champs extraits, référence de la pièce et anomalies ; proposition d’imputation seulement si la règle déjà déployée la prévoit |
| **U2** | **Message préparé — 2 €** | Un destinataire et un contexte, jusqu’à 5 pages de contexte, sortie de 600 mots maximum | Brouillon de courriel, réponse ou relance ; pas d’envoi ni de recherche ouverte de destinataires |
| **U3** | **Jeu de données contrôlé — 5 €** | Un jeu structuré jusqu’à 250 lignes, 10 règles écrites déterministes déjà choisies | Tableau de contrôles, écarts et références des lignes ; pas d’opinion sur la conformité du dossier |
| **U4** | **Lot de rapprochement préparé — 10 €** | Jusqu’à 500 mouvements et 500 écritures, une période, règles déjà recettées | Appariements proposés et suspens, avec références ; les choix ambigus restent au cabinet |
| **U5** | **Synthèse de dossier — 12 €** | Une question définie, un dossier, jusqu’à 20 pages **ou** 2 000 lignes structurées, sortie de 2 pages maximum | Synthèse liée aux entrées, points à examiner et manquants ; pas de recherche web ouverte |
| **U6** | **Dossier préparé — 25 €** | Un gabarit déjà choisi, jusqu’à 10 documents et 50 pages au total ; note de 3 pages maximum | Pièces assemblées/référencées, checklist des manquants et note préparatoire ; ni acte définitif, signature ni dépôt |
| **U7** | **Reporting préparé — 39 €** | Une entité et une période, un export jusqu’à 5 000 lignes, modèle déjà déployé, jusqu’à 5 indicateurs | Tableau de bord et commentaires jusqu’à 2 pages ; hypothèses et exceptions indiquées |
| **U8** | **Scénario financier préparé — 79 €** | Une entité, horizon de 12 mois, jusqu’à 500 flux et 3 hypothèses explicites, modèle déjà déployé | Tableaux et note jusqu’à 3 pages ; les hypothèses et le conseil sont validés au cabinet |

Précisions pour que l’offre reste défendable :

- **Pas de double facturation.** La lecture des pièces nécessaire à U6 ou les calculs nécessaires à U7/U8 font partie de cette unité ; ils ne rajoutent pas U1, U3 ou U5. Une tâche distincte commandée séparément peut former une autre unité, annoncée comme telle avant lancement.
- **Pas de création de règle incluse.** Choisir dix nouvelles règles de contrôle, construire le modèle de reporting ou créer un connecteur relève de la mise en service/adaptation, pas des 5 ou 39 € d’usage.
- **Pas de fractionnement opaque.** Au-delà des bornes, proposer un lot supplémentaire ou un devis, avec son prix total, avant démarrage. Un export de 501 lignes n’est pas découpé d’office en deux factures cachées.
- **Pas de résultat réglementaire vendu.** Une déclaration acceptée, un avis juridique, des comptes certifiés, une éligibilité à une aide ou une décision RH ne constituent pas l’état facturable de ces unités.
- **Arrêts et reprises.** Panne, session expirée, défaut Memlia et reprise technique ne rajoutent pas d’unité. Une exception métier fait partie d’un livrable si sa restitution est prévue ; un simple arrêt technique sans travail utilisable n’est pas une unité intégralement livrée. Prévoir un prorata par sous-livrable pour les lots partiels, accepté avant lancement.
- **Sur mesure.** Recherche ouverte, rédaction longue, acte définitif, création de modèle, nouvelle source et flux métier non borné restent au devis. Le catalogue reste déployable ; ces prix ne promettent pas que chaque tâche imaginable tienne dans les huit unités.
- **Travail résiduel réel.** Ne pas facturer au cabinet la reprise d’un geste que son logiciel réalise déjà correctement. U1, par exemple, concerne les pièces et formats restant hors de son circuit ou un livrable réellement supplémentaire ; le tarif ne justifie pas de recréer son OCR existant. Vérifier ce besoin avant le devis.

Les contrôles structurés, rapprochements et calculs financiers doivent employer les mécanismes appropriés ; envoyer des milliers de lignes à un modèle ne garantit pas l’exactitude d’un tableau. Cette note ne prouve pas que ces mécanismes sont déjà implémentés.

## 2. Le coût humain est la contrainte principale

Hypothèse de base : **75 €/heure de coût humain chargé**, avec sensibilités à 50 et 100 €/h. Il s’agit d’un coût interne de simulation, ni d’un salaire annoncé, ni d’un tarif de vente. Cible illustrative de **70 % de marge sur la consommation**, pas une norme du marché ; la prestation initiale est traitée séparément.

Formules :

```text
Coût direct variable par unité = coût technique + coût des reprises humaines attribuables
Budget humain/unité = prix × (1 − marge cible) − coût technique
Secondes humaines/unité = budget humain × 3 600 / coût humain horaire
```

Les montants techniques ci-dessous sont des **réserves provisoires de calcul**, choisies pour révéler le budget humain restant. Elles doivent couvrir, selon le travail, API, reprises techniques, OCR, calcul et frais variables attribuables. Elles ne sont ni des mesures ni une promesse qu’un abonnement Mammouth grand public finance l’API ou l’automatisation. Si le coût Mammouth/OCR réellement calculé est supérieur, le budget humain se réduit euro pour euro ; si un service tiers est requis, il doit être compris ou annoncé distinctement avant commande.

### Support/reprise maximal par unité à 70 % de marge

Temps **moyen sur toutes les unités**, y compris celles sans incident ; il ne s’agit pas d’un temps d’intervention offert sur chacune.

| Unité | Prix | Réserve technique provisoire | Budget humain restant | Maximum à 50 €/h | Maximum à 75 €/h | Maximum à 100 €/h |
|---|---:|---:|---:|---:|---:|---:|
| U1 | 1 € | 0,08 € | 0,22 € | 15,8 s | **10,6 s** | 7,9 s |
| U2 | 2 € | 0,08 € | 0,52 € | 37,4 s | **25,0 s** | 18,7 s |
| U3 | 5 € | 0,20 € | 1,30 € | 93,6 s | **62,4 s** | 46,8 s |
| U4 | 10 € | 0,30 € | 2,70 € | 194,4 s | **129,6 s** | 97,2 s |
| U5 | 12 € | 0,60 € | 3,00 € | 216,0 s | **144,0 s** | 108,0 s |
| U6 | 25 € | 0,90 € | 6,60 € | 475,2 s | **316,8 s** | 237,6 s |
| U7 | 39 € | 0,80 € | 10,90 € | 784,8 s | **523,2 s** | 392,4 s |
| U8 | 79 € | 1,50 € | 22,20 € | 1 598,4 s | **1 065,6 s** | 799,2 s |

À une cible de 80 % et 75 €/h, ces plafonds deviennent respectivement **5,8 / 15,4 / 38,4 / 81,6 / 86,4 / 196,8 / 336,0 / 686,4 secondes**. La marge voulue ne change pas le travail nécessaire : si le traitement réel dépasse le budget, relever le prix, améliorer le processus ou sortir ce périmètre du standard.

Exemple U1 : avec 0,08 € techniques, **une minute humaine par pièce coûte 1,33 € à 75 €/h**, pour un prix de vente de 1 €. C’est déficitaire avant frais fixes. Une intervention de 5 minutes sur 1 % des pièces représente 3 secondes moyennes par pièce ; sur 10 %, elle représente 30 secondes. Le taux d’exception et le temps réel de reprise sont donc indispensables, même si les jetons coûtent peu.

Le cabinet reste le validateur métier. Le texte commercial ne doit pas laisser comprendre qu’un expert Memlia relit personnellement chaque facture, chaque rapprochement ou chaque hypothèse à ces prix. Le coût de correction d’un défaut Memlia reste à Memlia ; l’exclusion du travail humain métier ne dispense pas de livrer le résultat convenu.

## 3. Ce que finance réellement le socle de 99 €

Le socle maintient **les tâches et intégrations explicitement déployées**, avec supervision et maintenance ordinaires convenues. Il ne débloque pas par défaut douze agents, toutes leurs fonctions et un support individuel illimité. Les nouvelles familles et nouvelles intégrations font l’objet d’un périmètre accepté.

À 70 % de marge, 99 € laissent **29,70 € par mois de coûts directs fixes**. Avec 10 € mensuels d’autres frais fixes hypothétiques, il reste 19,70 € pour l’humain :

| Coût humain | Temps mensuel maximal financé par le socle, après 10 € fixes |
|---:|---:|
| 50 €/h | 23,6 minutes |
| 75 €/h | **15,8 minutes** |
| 100 €/h | 11,8 minutes |

Deux situations illustratives, sans prétendre qu’elles décrivent Memlia aujourd’hui :

| Charge fixe mensuelle d’un cabinet | Coût direct hypothétique à 75 €/h | Marge du socle seul |
|---|---:|---:|
| Faible : 10 € techniques fixes + 10 min humaines | **22,50 €** | **77,3 %** |
| Forte : 25 € techniques fixes + 2 h humaines | **175 €** | **−76,8 %** |

Le socle est fragile si un petit consommateur demande plusieurs heures récurrentes d’accompagnement. Ce temps doit être réduit par la réutilisation, inclus dans un périmètre de service correctement tarifé, ou faire l’objet d’une prestation distincte acceptée. On ne facture pas une correction de bug comme une formation additionnelle pour masquer ce dépassement.

Avec des robots déjà actifs, une ligne de fonctionnement consolidée évite de facturer deux fois la même supervision et les mêmes connecteurs. La remise commerciale se fixe d’après la couverture commune ; la différence ne se déduit pas automatiquement du montant de 99 € sans ce calcul.

## 4. Mise en service : prix fixes et capacité d’effort

Les heures sont **des capacités internes de production pour chiffrer**, pas une vente d’heures à dépenser ni une garantie de délai. Un écart d’estimation interne ne permet pas de dépasser silencieusement un forfait accepté. Examiner les accès et formats avant le devis, et changer de niveau avant engagement si le périmètre ne tient pas.

| Niveau candidat | Prix HT proposé | Effort interne cible | Périmètre de référence |
|---|---:|---:|---|
| **Standard** | **790 €** | Jusqu’à **4 h** | Une tâche, un connecteur et une règle réutilisables, un format existant ; accès, adaptation de paramètres, essais et recette sur cas bornés |
| **Adaptation** | **1 990 €** | Jusqu’à **10 h** | Une famille de travail ; adaptation bornée de formats/règles ou raccordement déjà documenté ; essais d’exceptions et recette élargie ; pas un nouveau système complet |
| **Sur mesure** | **Devis à partir de 4 900 €** | Exemple de chiffrage : **24 h** | Construction spécifique bornée, livrables et jalons écrits. Si la charge estimée dépasse 24 h, chiffrer un forfait supérieur avant de commencer ; 4 900 € n’est pas un plafond universel |

Réserves de coûts techniques initiaux hypothétiques : 15 / 40 / 100 € selon les trois niveaux. Une intégration neuve, un environnement bloqué ou une reprise de données non standard peut dépasser ces exemples : la classification n’est jamais automatique sur la seule taille du cabinet.

### Sensibilités de marge sur la mise en service

| Niveau et effort cible | Coût direct à 50 €/h | Marge | Coût à 75 €/h | Marge | Coût à 100 €/h | Marge |
|---|---:|---:|---:|---:|---:|---:|
| Standard, 4 h | 215 € | 72,8 % | 315 € | **60,1 %** | 415 € | 47,5 % |
| Adaptation, 10 h | 540 € | 72,9 % | 790 € | **60,3 %** | 1 040 € | 47,7 % |
| Sur mesure, exemple 24 h | 1 300 € | 73,5 % | 1 900 € | **61,2 %** | 2 500 € | 49,0 % |

Une cible autour de 60 % pour l’amorçage est utilisée ici comme choix de pilotage ; elle est distincte de la cible illustrative de 70 % sur la consommation. Exiger 70 % sur les mêmes efforts à 75 €/h conduirait à des prix minimaux d’environ **1 050 / 2 633 / 6 333 €**, sans autre coût supplémentaire. Le choix d’une marge initiale plus faible est explicite ; ne pas prétendre que les prix de 790 / 1 990 / 4 900 € dégagent 70 %.

La marge brute doit encore financer les frais commerciaux, l’acquisition, l’entretien du catalogue et les frais généraux. L’effort d’installation réel est à suivre par tâche et intégration ; les plages de 4/10/24 h ne constituent pas des benchmarks techniques vérifiés.

## 5. Paiement et plafonds proposés

- **Mise en service** : proposition 50 % à la commande, 50 % à la recette pour Standard et Adaptation. Pour le sur mesure, jalons possibles de 40 % commande / 40 % livraison du pilote / 20 % recette, explicités au devis. Les critères de recette, délais de réponse et livrables définissent l’échéance ; pas un résultat fiscal ou commercial extérieur.
- **Socle** : 99 € facturés mensuellement à partir de la mise en service acceptée. Proposer une période mensuelle renouvelable ; arrêter précisément préavis, prorata du premier mois et conditions de sortie dans le contrat. Ne pas afficher « sans engagement » avant d’avoir arrêté ces conditions. Le mois avec zéro unité coûte 99 € si le service reste maintenu.
- **Consommation** : relevé mensuel à terme échu, avec facture des unités réellement livrées selon la règle acceptée. Aucun crédit opaque n’est nécessaire. Pour un volume très élevé, convenir d’un acompte ou d’une périodicité plus courte avant exécution, afin de ne pas porter seul plusieurs milliers d’euros de coûts.
- **Budget maximal** : proposition par défaut de **299 € HT par mois au total = 99 € de socle + 200 € d’usage**. C’est un plafond de départ ajustable, pas un troisième abonnement ni un minimum de consommation. Le cabinet peut choisir moins ou plus avant lancement.
- **Lot annoncé** : montrer unité, quantité, prix total, plafond restant et périmètre. Réserver le budget du lot avant exécution. Une demande à 79 € ne démarre pas avec seulement 50 € de budget disponible ; proposer explicitement un lot plus petit ou une hausse du plafond.
- **Pas de dépassement** : à l’épuisement du budget d’usage, ne pas lancer de nouveau travail. Le socle continue de financer le maintien en service tant que l’abonnement reste actif ; le cabinet doit pouvoir voir cette distinction. Une boucle, un sous-agent ou un rejeu technique ne recharge pas automatiquement le budget.

Le plafond global est choisi en euros. Exemples de budgets, sans remise automatique : **299 €** pour 200 € d’usage, **999 €** pour 900 € d’usage, **2 499 €** pour 2 400 € d’usage. Les besoins supérieurs sont chiffrés et autorisés ; le volume ne prouve pas une réduction des coûts humains et ne déclenche pas mécaniquement une remise.

Les 1 000 U1 de la simulation suivante demandent un plafond total d’au moins 1 099 € ; les 10 000 demandent au moins 10 099 €. Le plafond de départ de 299 € arrête donc les nouveaux travaux après 200 U1. Ce n’est pas une offre permettant de traiter ces grands volumes pour 299 €.

Les mécanismes de réservation, de compteur, de plafond et de facturation sont une spécification d’offre à construire et vérifier. Ce document n’affirme pas leur disponibilité dans le produit actuel.

## 6. Scénarios à 100, 1 000 et 10 000 unités

Tous les scénarios sont hypothétiques. Les frais initiaux sont exclus de ces tableaux mensuels et doivent être ajoutés pour calculer la première année. Coût humain à 75 €/h ; coûts fixes « faible » de 22,50 €/mois et « forte » de 175 €/mois définis plus haut.

### A. Uniquement des U1 à 1 € : coût de la reprise maîtrisée

Hypothèse de reprise humaine moyenne de **2 secondes par unité**, plus 0,08 € technique, soit environ 0,1217 € variables par unité. Ces deux secondes peuvent provenir d’interventions plus longues sur une petite fraction du flux ; elles ne constituent pas une mesure actuelle.

| U1/mois | Facture totale 99 + usage | Coût direct charge fixe faible | Marge brute | Coût charge fixe forte | Marge brute |
|---:|---:|---:|---:|---:|---:|
| 100 | **199 €** | 34,67 € | 82,6 % | 187,17 € | **5,9 %** |
| 1 000 | **1 099 €** | 144,17 € | 86,9 % | 296,67 € | 73,0 % |
| 10 000 | **10 099 €** | 1 239,17 € | 87,7 % | 1 391,67 € | 86,2 % |

La forte marge théorique à grand volume est une conséquence des hypothèses, pas une preuve de marge réalisable ni une justification d’un prix accepté par le marché. Les limites de débit, la maintenance, le nombre d’utilisateurs supportés et les temps de vérification peuvent évoluer avec le volume.

### B. Mêmes U1, mais 30 secondes humaines moyennes : prix sous-calibré

Coût variable unitaire = 0,08 € + 0,625 € = **0,705 €**. À 10 000 pièces, le seul temps de reprise atteint **83,3 h humaines/mois**. Aucun tarif de modèle ne fait disparaître ces heures.

| U1/mois | Facture totale | Coût direct charge fixe faible | Marge brute | Coût charge fixe forte | Marge brute |
|---:|---:|---:|---:|---:|---:|
| 100 | 199 € | 93,00 € | 53,3 % | 245,50 € | **−23,4 %** |
| 1 000 | 1 099 € | 727,50 € | 33,8 % | 880,00 € | 19,9 % |
| 10 000 | 10 099 € | 7 072,50 € | **30,0 %** | 7 225,00 € | 28,5 % |

Pour atteindre 70 % de marge variable avec un coût de 0,705 €, il faudrait un prix d’usage d’au moins **2,35 € par U1**, ou diminuer réellement cette charge de reprise. Subventionner ce cas dans le socle de 99 € ne fonctionne pas à grande échelle.

### C. Panier diversifié illustratif, sans remise

Composition artificielle pour tester la grille, pas distribution client constatée : 50 % U1, 20 % U2, 10 % U3, 10 % U4, 5 % U5, 3 % U6, 1 % U7 et 1 % U8. Prix moyen **4,93 €** ; réserve technique moyenne **0,186 €**.

Hypothèses de temps humains moyens respectifs : **2 / 5 / 15 / 30 / 45 / 60 / 120 / 240 secondes** par unité. Moyenne pondérée de 14,15 secondes, coût variable moyen d’environ **0,4808 €**. Ces hypothèses demandent de nombreux traitements sans intervention et ne peuvent pas être présentées comme des temps observés.

| Unités/mois | Facture totale | Coût direct charge fixe faible | Marge brute | Coût charge fixe forte | Marge brute |
|---:|---:|---:|---:|---:|---:|
| 100 | **592 €** | 70,58 € | 88,1 % | 223,08 € | 62,3 % |
| 1 000 | **5 029 €** | 503,29 € | 90,0 % | 655,79 € | 87,0 % |
| 10 000 | **49 399 €** | 4 830,42 € | 90,2 % | 4 982,92 € | 89,9 % |

Le volume seul ne permet donc pas de comparer les factures : 1 000 pièces à 1 € et 1 000 travaux de plusieurs types ne sont pas la même consommation. Une facture théorique de 49 399 € ne prouve pas que la valeur soit reconnue à ce niveau ; un grand compte peut demander un forfait de volume plafonné, à chiffrer sur son mélange réel et ses coûts. Ne pas extrapoler cette moyenne à tous les cabinets.

## 7. Décision avant adoption de cette grille

1. Rapprocher les réserves techniques de cette note des calculs publics Mammouth du chantier, avec tokens, nombre d’appels, rejouages, routage normal/stress et capacité disponible. Ne pas compter deux fois une réserve de reprise déjà présente dans le coût calculé.
2. Vérifier sur jeux fictifs les bornes d’entrée/sortie et les livrables de chaque famille. Mesurer séparément temps d’installation, coût technique, incident de plateforme, intervention de support et reprise par unité ; pas de déduction des temps humains à partir du coût des tokens.
3. Calculer les marges avec les consommations réellement facturables : échecs exclus, lots partiels, corrections, gratuités et temps commercial de support. Garder une allocation cohérente entre socle et unités pour ne pas compter le même humain deux fois.
4. Comparer les devis proposés et acceptés sur des périmètres identiques. Aucun consentement à payer ni taux de conversion français n’est inventé ici. Un pilote payé et sa consommation réelle apportent un signal plus utile qu’un avis sur un tarif affiché.
5. Si les prix sont adoptés, conserver une seule grille versionnée, des unités et plafonds visibles, et une frontière de responsabilité cohérente. Le site vitrine peut ensuite la présenter ; cette note ne publie rien.

**Arbitrage proposé :** lancer la discussion avec ces huit prix et ces trois niveaux de mise en service. Retenir 99 € comme socle validé, un plafond mensuel choisi avant travail et les limites de chaque unité. Les coûts Mammouth et les temps humains doivent décider si une famille reste standard, change de prix ou passe au devis ; le fait d’avoir fixé un modèle fournisseur ne rend pas l’offre économiquement prouvée.
