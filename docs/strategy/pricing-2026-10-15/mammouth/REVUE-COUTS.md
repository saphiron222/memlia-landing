# Revue indépendante des coûts et de la grille agents

> Cette revue concerne le modèle historique de huit travaux, aux empreintes consignées dans ce rapport. L’avertissement de remplacement ajouté depuis à `GRILLE-AGENTS.md` change son empreinte documentaire sans changer ses calculs. Cette revue ne porte pas sur [la nouvelle offre par pôle](../offre-simple/OFFRE.md), demandée ensuite par Kevin.

15 octobre 2026. Revue économique et documentaire, sans clé Mammouth, achat, appel d’inférence ni modification du site ou du classeur livré. Seul le présent rapport est modifié par le relecteur.

**Verdict final : PASS pour l’étude interne chiffrée et son classeur modifiable. Aucun correctif bloquant restant dans le périmètre relu.** Les trois scénarios, les huit unités et les coûts initiaux concordent avec un recalcul indépendant en arithmétique décimale. Les coûts de production, la qualité, les débits et la disposition à payer restent à mesurer : ce PASS ne valide ni une marge réalisée ni une capacité opérationnelle.

**Corrections de revue intégrées :** deux encaissements de mise en service provisionnés, champs modifiables obligatoires distinguant vide et zéro, et référence documentaire à la source consolidée du barème. La clôture et les empreintes finales sont consignées en fin de rapport.

## Périmètre relu

- `GRILLE-AGENTS.md`, source de la recommandation consolidée ;
- `bareme-agents.json`, source unique des prix et des hypothèses ;
- `calcul-economie.mjs`, formules et invariants ;
- `tarifs-modeles.json` et les trois modèles concernés dans l’archive primaire `archives/public-models.json.gz` ;
- `calculs-agents.json` et les données de `COUVERTURE-TRAVAUX.json` ;
- `build-classeur.mjs`, formules d’export, tests de recalcul et de réimportation ;
- classeur XLSX livré et `verification-formules.json` ; lecture des formules et valeurs enregistrées, sans changer le fichier.

Les contrôles de cette revue comprennent un calcul décimal séparé du script JavaScript, l’exécution en lecture seule de `verifier()`, les frontières 200/201 U1, le zéro usage, les trois scénarios et les empreintes des sources de la matrice. Aucun build du site n’a été lancé.

## 1. Tarifs API et hypothèses : séparation correcte

Les valeurs normalisées concordent avec les champs par token de l’archive primaire :

| Modèle | Entrée USD/million | Sortie USD/million |
|---|---:|---:|
| `gpt-6.1-sol` | 2 | 10 |
| `claude-opus-5-5` | 4 | 20 |
| `gpt-6-astra` | 10 | 50 |

La conversion par million est correcte ; aucun tarif d’abonnement chat ni crédit offert n’est déduit du coût API. L’alias mobile `mammouth-recommended` est refusé par le calcul. Les budgets nominaux et doublés des scénarios restent inférieurs aux limites d’entrée/sortie des modèles concernés ; cette comparaison arithmétique ne prouve pas qu’un corpus quelconque tienne dans ces budgets.

Le facteur de base de 1,25 représente une **hypothèse de volume de reprises**. Il ne signifie pas que chaque travail dispose d’un droit à 1,25 tentative ni qu’un échec n’est pas débité par le fournisseur. La conversion de 1,10 €/USD est explicitement budgétaire, non un cours observé. Les majorations de fournisseur des scénarios sont des hypothèses de frais non récupérables ; elles ne sont pas présentées comme une TVA facturée connue.

Le calcul multiplie les budgets totaux d’entrée/sortie du travail par le facteur de volume et de reprises. Cela est cohérent si les budgets nominaux comprennent l’ensemble du dialogue, des instructions, sorties d’outils et éventuels tokens de raisonnement facturés. La note fournisseur signale les composantes encore inconnues ; aucune mesure d’API réelle n’est prétendue disponible.

## 2. Recalcul indépendant du panier à 273 €

Panier : 100 U1, 10 U2, 4 U3, 1 U4, 2 U5. Usage de 174 €, socle de 99 €, total de 273 € HT. Les autres quantités sont nulles.

| Scénario | API calculée | Humain variable | Autres outils variables | Coûts directs totaux/mois | Contribution après 80 € d’allocations |
|---|---:|---:|---:|---:|---:|
| Base | 4,229500 € | 20,000000 € | 4,070000 € | **62,759500 €** | **130,240500 €** |
| Reprises élevées | 13,288320 € | 53,333333 € | 8,140000 € | **153,251653 €** | **39,748347 €** |
| Premium | 66,441600 € | 53,333333 € | 8,140000 € | **236,404933 €** | **−43,404933 €** |

Les totaux directs ajoutent l’infrastructure, la maintenance fixe et l’encaissement ; ils ne sont donc pas égaux à la seule somme des trois premières colonnes.

Les 80 € sont distincts : 30 € de frais généraux, 300 € d’acquisition répartis sur 12 mois et 600 € de catalogue répartis sur 24 mois. La contribution n’est pas présentée comme un bénéfice net ni une trésorerie disponible. La projection annuelle suppose le même panier douze fois et n’invente pas une demande client.

Le scénario premium combine un routage plus coûteux, davantage de tokens/reprises, plus d’humain et une infrastructure plus chère. Il ne mesure pas l’effet isolé du seul modèle ; le rapport décrit correctement cette combinaison. Sa contribution négative est visible et exclut un routage premium généralisé au prix standard sans recalibrage.

À zéro usage, le calcul retrouve **99 € de revenu, 30,98 € directs et −11,98 € après allocations**. Un compte maintenu sans usage n’est donc pas déclaré rentable grâce au faible coût des tokens.

## 3. Encaissement et mise en service

La réserve variable de 2 % n’est pas comptée deux fois : la part sur les unités entre dans leurs coûts, la part sur les 99 € entre dans le coût mensuel fixe. Leur somme vaut 2 % du chiffre d’affaires mensuel. La réserve fixe de facture mensuelle est ajoutée une seule fois.

La revue a signalé qu’un paiement initial en deux fois peut produire deux frais fixes. Le barème a été corrigé avec `setupPaymentCount = 2`. Le calcul indépendant retrouve les valeurs finales :

| Mise en service | Prix HT | Humain | Réserve technique | Encaissement 2 % + 2 × 0,25 € | Coût direct |
|---|---:|---:|---:|---:|---:|
| Standard, effort prévisionnel 4 h | 790 € | 300 € | 10 € | 16,30 € | **326,30 €** |
| Adaptation, 10 h | 1 990 € | 750 € | 25 € | 40,30 € | **815,30 €** |
| Création, exemple 24 h | 4 900 € | 1 800 € | 60 € | 98,50 € | **1 958,50 €** |

Les frais de paiement restent des provisions. Le coût du prestataire réel peut dépendre des moyens d’encaissement, du TTC encaissé, du nombre de factures et d’autres frais ; la réserve de 2 % n’est pas une preuve de contrat de paiement.

Les installations sont des prix fermes pour un périmètre accepté. Les heures sont des hypothèses de capacité interne, sans délai client garanti ; un projet de 60 heures n’est pas déclaré inclus dans 4 900 €. Le modèle ne prétend pas que ces mises en service atteignent toutes 70 % de marge.

## 4. Humain, sous-facturation et coût complet

Les temps 5/10/30/60/90/180/300/600 secondes sont correctement calculés au coût chargé de 75 €/h. Ils représentent des moyennes provisionnées, et non une revue métier individuelle de cette durée pour chaque unité.

Pour U1 à 1 €, le coût variable de base est **0,1844167 €**. Le plafond humain compatible avec 70 % de marge est **10,548 secondes**, avec les autres hypothèses inchangées. À 30 secondes, le coût devient **0,70525 €** et la marge est de 29,475 %.

Si le prix augmente, les frais variables d’encaissement augmentent aussi. Le plancher économique correct à 70 % est donc :

```text
(0,03025 API + 0,625 humain + 0,03 autres) / (1 − 0,70 − 0,02)
= 2,447321... €
```

L’affichage **2,45 €** est correct. Le plancher de 2,35 € de l’étude intermédiaire employait d’autres provisions et excluait cette réserve variable ; il ne doit pas être repris comme résultat consolidé.

Pour éviter de futurs doubles comptes sémantiques, définir lors du passage aux coûts réels ce que contiennent les 75 €/h : coût direct de la main-d’œuvre et charges associées, sans réinclure les mêmes frais généraux/acquisition/catalogue déjà alloués séparément. L’arithmétique actuelle n’additionne pas deux fois les mêmes lignes ; la définition réelle des postes reste une mesure à faire.

Les montants « autres outils » et d’infrastructure restent des provisions. La note n’établit pas que 0,03 € paient n’importe quel OCR ou que 10 € d’infrastructure paient un worker dédié par cabinet. Ces coûts doivent être rapprochés des factures, de la capacité et des incidents ; le rapport le dit.

## 5. Plafonds : engagement commercial, sans prétendre à un moteur existant

Les valeurs en centimes sont exactes :

- 200 U1 donnent 200 € d’usage, 299 € mensuels et 1 089 € maximum avec installation standard ;
- 201 U1 donnent 201 € d’usage : `withinCap = false`, budget restant −1 € ;
- les 200 € sont un plafond d’usage, pas un minimum facturé ;
- à 80 € d’usage, le total vaut 179 € ; à zéro, 99 €.

Le script retourne une projection au-delà du plafond en la signalant ; il n’exécute ni n’autorise un traitement. Le classeur affiche « plafond dépassé ». Le texte prévoit une réservation de lot avant exécution, des alertes, une pause au plafond et une extension explicite. Il précise que cette politique **reste à implémenter** et que le classeur ne pilote aucun agent. Aucune garantie technique indue du produit actuel n’est donc identifiée.

Les quatre fois de tokens apparaissent comme une provision en USD, pas comme une garantie fournisseur ni une borne de facture client effectivement appliquée. Avant un moteur réel, les limites doivent comprendre toutes les tentatives en cours et les appels concurrents ; une simple moyenne de reprises ne garantit pas un coût maximal par unité.

## 6. Couverture et responsabilité

Le JSON contient exactement **128 identifiants uniques** : **94 versions bornées conditionnelles, 31 sur mesure, 2 alias non facturables et 1 renvoi non facturable**. Les 17 empreintes de sources correspondent aux fichiers du site relus. Douze agents, huit unités et vingt et un robots sont présents.

La qualification « version bornée » est essentielle : une mission entière de clôture, de conseil ou d’audit n’est pas ramenée à une préparation de dossier à 25 €. Les actes, nouvelles règles, nouveaux modèles et recherches ouvertes restent hors des petites unités. Les trois renvois non facturables ne deviennent pas trois offres supplémentaires.

La matrice conserve les validations et distingue le travail technique du jugement. Elle sépare également les livrables agents des robots existants : un même reporting ou message n’est pas vendu une deuxième fois parce qu’il est présenté par une figurine. Une tâche complète ne se facture pas cumulativement U1 + U3 + U5 + U7 pour les mêmes étapes incluses.

La densité des pages et tableaux est bornée, et les grands exports supposent un traitement déterministe puis des agrégats textuels limités. Ces choix sont annoncés comme une architecture à recetter, non comme une performance prouvée. Les tokens restent des budgets de chiffrage, pas un prix public vendu au cabinet.

## 7. Revue du classeur

Les trois feuilles suivent un flux lisible : hypothèses sélectionnées → coûts unitaires/installations → budget et contribution. Les formules du budget lisent les résultats des unités ; aucune dépendance circulaire ni dépendance à un état `PASS` n’a été relevée.

`verification-formules.json` documente le recalcul des trois scénarios, les prix et conversions modifiés/restaurés, zéro usage, sans installation, la frontière du plafond, les quantités invalides et les hypothèses manquantes. Le builder réimporte le XLSX et recalcule des résultats attendus ; il ne se contente pas d’un export réussi. La revue a en outre lu les formules et valeurs présentes dans les cellules clés du fichier enregistré et n’y a trouvé aucune cellule d’erreur sur les trois feuilles dans leur état livré.

Ce contrôle n’est pas un essai dans Microsoft Excel natif. Les rendus visuels et les recalculs Artifact Tool décrits par le constructeur ne sont pas renommés en test Excel.

### Point signalé pendant la revue

Dans la première version relue, vider un budget de tokens ou un temps humain dans les lignes modifiables des unités pouvait remplacer implicitement l’hypothèse par zéro. De même, l’effort d’installation et le plafond d’usage devaient distinguer vide et zéro autorisé. Une garde locale et un test d’effacement/restauration ont été demandés au constructeur.

**Point clos :** le builder final et les formules du XLSX ajoutent les gardes aux tokens, prix, temps humain, autres coûts, installation, choix d’installation, socle, allocations et plafond. Les tests effacent/restaurent les entrées concernées, conservent le zéro humain valide et vérifient qu’une donnée obligatoire manquante rend les résultats concernés indisponibles. Le rapport final comporte ces cas et un scan sans erreur. Les trois scénarios mensuels restent identiques ; la première année de contribution après correction de l’encaissement initial vaut **2 026,586 €** dans le scénario de base constant avec installation standard.

## Clôture et empreintes

La dernière phrase de `COUVERTURE-TRAVAUX.md` référence désormais `bareme-agents.json` et `GRILLE-AGENTS.md` comme autorités consolidées ; `ECONOMIE-AGENTS.md` reste l’étude intermédiaire. Les hypothèses provisoires de cette dernière ne sont pas mélangées aux coûts finaux.

Empreintes SHA-256 de la version finale relue :

| Fichier | SHA-256 |
|---|---|
| `GRILLE-AGENTS.md` | `58cf5e6af3e8d2e61d00f86d7d7e676a5f65a9de1e5128ef10ea2e3a9808a6cf` |
| `bareme-agents.json` | `cfad80a599bf887e03ae4ee908730680183e9fd11139c40308e8b19d040f92ed` |
| `calcul-economie.mjs` | `beaaac5da8bedee6764715d64038e38ff8c50c65e6bf60fbe07afb6498f4a746` |
| `build-classeur.mjs` | `f1a5a1811e52fc8e854d9ac198f72a61848011dede20310daaa4c24e84ea53bb` |
| `tarifs-modeles.json` | `e385a1dbbde9be8feef16851f03d12943b080d4ade215c185aee05e6ac1205ea` |
| `COUVERTURE-TRAVAUX.json` | `1e32244105af302207b31cdf05ba59ca76c18c4abe1d1378c875c53d4b734ae4` |
| `COUVERTURE-TRAVAUX.md` | `e3ea5fca755c2756d7b8314e195e8456d07e2c1815cc3d6329f194726e4d9857` |
| `calculs-agents.json` | `6c2073044d9e681f174da7c0d4cca2ebcda0bf66fc8be6c001ef89024c8e1d92` |
| `couts-et-tarifs-agents-mammouth.xlsx` | `0a0d6635ee9e4787eabe51c545c3b2f5ee222f757a058dfd9ed287e10e75b157` |
| `verification-formules.json` | `20d14b0af72bebcf381eb2dfc80003b5465f4cda0abf439b6719f79bfe7aed54` |

Le classeur et sa vérification se trouvent dans `outputs/01a13e1c-ec37-74f0-8a26-6ad074cde9ac/` à la racine du worktree ; les autres fichiers sont voisins du présent rapport.

**Aucun blocage de livraison de la recherche identifié.** La qualification contractuelle de l’API pour le montage client, les mesures réelles et la recette produit demeurent des étapes avant exploitation commerciale réelle, déjà documentées. Aucune consommation client, aucun contact fournisseur ni déploiement produit n’a été lancé par cette revue.
