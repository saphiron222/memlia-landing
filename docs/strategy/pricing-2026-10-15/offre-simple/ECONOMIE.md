# Économie et règles de l’offre simplifiée

> **Étude historique remplacée.** Les anciens 1 000 € + 300 € ont été repris à tort comme prix imposés. Kevin demande de recalculer socle, prix et quota de chaque agent. Lire [la recommandation actuelle](../agents-individuels/GRILLE.md) et [son économie](../agents-individuels/ECONOMIE.md).

Étude interne du 15/10/2026. La [présentation commerciale](./OFFRE.md) est l’entrée de lecture. **Ni ces coûts ni la rentabilité ne sont mesurés en production.** Le socle mensuel 1 000 € et les 300 € mensuels par pôle viennent de Kevin. Les autres paramètres sont notre proposition modifiable dans `offre.json`.

## Pourquoi cette structure

Le tarif principal devient la prise en charge d’un métier dans le cabinet. Il ne dépend ni des sièges ni de la manière dont nous distribuons le travail entre agents internes. L’abonnement finance une relation de service et un périmètre maintenu ; la réserve d’usage protège les coûts marginaux. Dans le catalogue actuel, douze agents représentent douze métiers : **vendre par pôle ou par agent métier donne aujourd’hui le même nombre de forfaits**. Le mot « pôle » évite de facturer une architecture technique et restera stable si nous ajoutons des sous-agents. Ne pas réunir arbitrairement les douze métiers dans les trois filtres du hub : ce sont des filtres éditoriaux.

Le budget inclus remplace les huit catégories commerciales par un compteur commun en euros. Cette approche est plus facile à présenter, mais son mode de calcul doit rester accessible. **Ce n’est pas une promesse de simplicité sans métrique** : chaque routine doit fournir un budget reproductible avant lancement. Un contrat qui dit seulement « usage courant » ou « usage raisonnable » ne règle pas ce besoin.

La recommandation suit le principe hybride : abonnement, usage inclus, dépassement et plafond. [Stripe explique](https://stripe.com/resources/more/ai-pricing-models) l’intérêt de ce compromis et recommande de garder une seule métrique compréhensible plutôt qu’une matrice de consommations. Cette source soutient la structure ; elle ne démontre ni le consentement à payer des experts-comptables français ni la justesse de nos montants.

## Définition du compteur proposé

Au déploiement, nous qualifions la routine, ses entrées et sorties, le modèle et les outils d’exécution autorisés, ses bornes et son coût de production. Le **budget de service du lot = coût variable prévisionnel complet × 4**, arrondi au centime supérieur, est annoncé avant lancement. La formule est universelle ; la complexité reste dans le devis et la recette, pas dans huit classes de livrables à faire apprendre au cabinet. Le budget d’usage est un prix de service Memlia, sans équivalence avec un crédit fournisseur.

Le coût variable comprend **API, OCR/exécution/outils marginaux et humain opérationnel prévu**. Il exclut le support fixe, déjà financé par le socle et les pôles. La revue professionnelle et les validations du cabinet ne sont pas un coût de production Memlia. Les corrections de défaut et reprises d’incident sont des charges Memlia, jamais une majoration rétroactive de consommation. Un travail sous-traité à prix variable doit entrer dans la réserve avant accord ; une licence directement payée par le client n’y est pas refacturée.

Le coefficient quatre est une **hypothèse de réserve**, pas une pratique Mammouth ni un optimum de marché. Il vise au plus **25 % de coûts variables de production** dans la valeur d’usage, avant encaissement. La valeur et le prix du service principal sont portés par l’abonnement ; ce coefficient sert à dimensionner une consommation complémentaire qui ne soit pas déficitaire.

La grille historique sert à tester cette règle sur des travaux contrastés. Exemples de budgets minimaux calculés avec les anciennes hypothèses : pièce 0,66 €, message 1,13 €, scénario 61,52 € en base ; respectivement 3,26 €, 5,15 € et 176,99 € dans le scénario premium. **Ces exemples ne forment pas une nouvelle grille publique et ne prouvent pas le coût d’une routine réelle.** Ils démontrent pourquoi compter chaque résultat comme « un traitement » indifférencié fausserait les limites. Les nouvelles familles utilisent leur budget propre sans être exclues du compteur.

Le montant du lot est figé à l’accord. Avant chaque appel et étape coûteuse, réservation du coût maximal dans sa provision ; limites de tokens, d’appels, de parallélisme et de relances ; arrêt si le travail sort du périmètre. Si le coût accepté ne peut pas être tenu, ne pas réécrire le budget client après coup : limiter les nouvelles commandes, corriger, puis recadrer les prochaines exécutions. **Ces protections sont des exigences d’un futur produit ; le calculateur documentaire ne les exécute pas.**

Un seul relevé par cabinet permet de mutualiser les enveloppes. Il expose la routine, le dossier par identifiant autorisé, la période, le prix réservé et le travail remis, sans reproduire de données confidentielles dans une URL. Les droits et données restent séparés par mission. Pas de double débit pour un résultat partagé entre pôles ou déjà compris dans les robots. Un lot arrêté techniquement sans résultat ne débite pas le client ; sa dépense réelle demeure dans le coût Memlia.

## Dimensionnement mensuel hypothétique

À consommation incluse totalement utilisée, **200 € d’usage par pôle financent au plus 50 € de coûts variables complets**. Un supplément de 100 € finance au plus 25 € de coûts supplémentaires ; après 2 % d’encaissement, il conserve une marge contributive de 73 € si la réserve est tenue. Cette marge ne prouve rien si nous oublions l’humain dans les 25 €.

Hypothèses fixes : coût humain 75 €/h ; 2 h communes au cabinet et 30 minutes supplémentaires par pôle et par mois ; infrastructure 30 €/mois ; encaissement 2 % du revenu + 0,25 € par facture mensuelle. Les 2 h et 30 minutes sont des **budgets internes de support/maintenance**, pas des heures de conseil ou de développement illimitées offertes au cabinet. Le contrat précise le périmètre du support ; l’absence de coût réel interdit de promettre sa capacité.

Allocations conservées de l’étude précédente : frais généraux 30 €/mois, acquisition 300 € sur 12 mois, développement du catalogue 600 € sur 24 mois, soit **80 €/mois**. Ce ne sont ni des charges réelles connues ni une seconde provision du même temps de support. Les impôts et frais non alloués ne sont pas déduits.

| Pôles | Revenu mensuel | Réserve variable | Autres coûts directs* | Coût direct total | Marge directe | Contribution après 80 € alloués |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 1 300 € | 50 € | 243,75 € | **293,75 €** | 77,4 % | **926,25 €** |
| 2 | 1 600 € | 100 € | 287,25 € | **387,25 €** | 75,8 % | **1 132,75 €** |
| 3 | 1 900 € | 150 € | 330,75 € | **480,75 €** | 74,7 % | **1 339,25 €** |
| 12 | 4 600 € | 600 € | 722,25 € | **1 322,25 €** | 71,3 % | **3 197,75 €** |

*Temps humain fixe, infrastructure et encaissement. L’humain variable de production est déjà dans la réserve variable ; il ne doit être ni omis ni compté deux fois.

À un pôle, sans usage : coût direct 243,75 €, contribution 976,25 €. Avec toute l’enveloppe et 200 € supplémentaires : revenu 1 500 €, coût direct 347,75 €, contribution 1 072,25 €. La cible interne de 70 % de marge directe passe dans le scénario de base pour les douze combinaisons de nombre de pôles, sous les hypothèses retenues.

## Stress et limites

Si le coût humain monte à 100 €/h, le support commun à 4 h et à 1 h par pôle, l’infrastructure à 60 € et l’encaissement à 3 % + 0,30 €, un pôle coûte **649,30 €** : la marge directe tombe à **50,1 %**, contribution **570,70 €**. C’est positif mais sous la cible. Nous ne concluons pas que le tarif est validé parce qu’il ne perd pas encore d’argent.

Un incident demandant 30 h communes, avec ces autres hypothèses, porte le coût direct à **3 249,30 €** et la contribution à **−2 029,30 €** pour ce mois. Il ne se transforme pas en facture complémentaire au client. **Aucun système tarifaire n’assure « jamais perdant »** face à une obligation de correction. L’exposition se réduit avec les essais, la réserve, des engagements support réalistes, un périmètre stable et un suivi du coût par cabinet.

Un routage premium ne doit pas conserver un budget calculé pour un petit modèle. Les [prix Mammouth](../mammouth/FOURNISSEUR.md) sont publiés par modèle et volume d’entrée/sortie. Les tokens, outils, reprises et secondes humaines sont encore hypothétiques ; aucune clé API n’est disponible. Requalifier les coûts prévisionnels avant de fixer les prochaines commandes ; ne pas modifier en silence le coût déjà accepté. Les crédits inclus dans un abonnement de chat ne prouvent pas une capacité API illimitée.

## Installation, positionnement et publication

Repère de mise en service 1 990 € : 10 h hypothétiques à 75 €/h + 25 € de technique + 39,80 € d’encaissement proportionnel + 0,50 € pour deux versements = **815,30 € de coût direct**. Le périmètre de trois routines et deux connecteurs, repris de l’étude précédente, est une borne de devis, pas la définition complète d’un pôle. Un nouveau projet plus lourd est chiffré avant engagement. Un prix identique de mise en service ne doit pas être répété pour un connecteur déjà payé.

À 1 300 €/mois, il faut vendre une délégation durable de plusieurs tâches et le suivi du service. **Ni la simplicité de la formule ni la marge théorique ne démontrent la disposition à payer.** Le prix minimal annuel à un pôle est 15 600 € hors installation. À présenter à des cabinets dont le volume et l’organisation justifient la prise en charge ; ne pas tirer une économie garantie du tarif public à 7 €/h historique d’un concurrent ou du temps machine.

Avant publication : recettes des routines, coûts API et humains réellement relevés, exemples de budgets compréhensibles par un cabinet, acceptabilité commerciale, conditions de support et durée du contrat, puis branchement d’un relevé d’usage auditable. Le montage Mammouth pour les clients doit aussi être précisé au regard des [conditions fournisseur](https://info.mammouth.ai/fr/docs/terms-of-service/) : la documentation d’intégration seule ne démontre pas une autorisation générale de mise à disposition. Aucun fournisseur n’a été contacté.

## Contrôles

`calcul.mjs` et `calcul.test.mjs` ne font aucun appel réseau. Six groupes vérifient : un seul socle et douze métiers, enveloppe non facturée deux fois, frontière au centime et plafond nul par défaut, mutualisation, rejets d’entrées absentes/invalides, réserve complète et scénarios sous cible ou déficitaires. `calculs.json` conserve les résultats reproductibles. Les tests ne sont pas un moteur de réservation concurrente ni de facturation de production.
