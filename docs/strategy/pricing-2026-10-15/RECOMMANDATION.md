# Tarifs Memlia validés : robots et agents IA

**Validé par Kevin le 15 octobre 2026.** Cette référence fixe le forfait robots et les règles communes. Le prix des agents, le socle et les crédits inclus ont pour seule référence [GRILLE.md](./agents-individuels/GRILLE.md). Aucune ancienne proposition n’est applicable.

## Robots : forfait annuel du portefeuille couvert

| Portefeuille effectivement couvert | Prix annuel HT |
|---|---:|
| De 1 à 100 dossiers | **600 €** |
| De 101 à 250 dossiers | **600 € + 4 € par dossier au-delà de 100** |
| De 251 à 500 dossiers | **1 200 € + 2,40 € par dossier au-delà de 250** |
| Plus de 500 dossiers ou périmètre atypique | **Prix ferme au devis** |

Exemples : 101 dossiers = 604 € ; 150 = 800 € ; 250 = 1 200 € ; 350 = 1 440 € ; 500 = 1 800 €. Un dossier n’est pas recompté à chaque collecte, passage ou robot.

Le forfait de référence **Suivi du portefeuille** couvre neuf routines : suivi des déclarations fiscales, CFE, taxes foncières, suivi URSSAF, messagerie fiscale, habilitations fiscales, informations légales/RNE, dette fiscale et veille BODACC. Le devis fixe les sources, comptes, fréquences, livrables activés et la maintenance de ce périmètre.

Les douze autres robots sont des extensions ou campagnes chiffrées selon leur périmètre. Le catalogue ne doit jamais être présenté comme « 21 robots illimités pour 600 € ». Une vidéo, un modèle de reporting personnalisé ou un volume documentaire massif ne sont pas une collecte fiscale standard.

Un dossier est une entité juridique couverte ; ses comptes et établissements sont précisés au devis. Les dossiers dormants hors périmètre sont exclus. Le prix est fixé au portefeuille autorisé, sans supplément silencieux. Une extension en cours d’année est chiffrée avant accord, selon la durée de surveillance ou le travail de campagne restant.

## Mise en service robots

**Prix fixe au devis avant de commencer** : accès, adaptation, règle écrite, essais et recette. Les accès et connecteurs communs sont mutualisés. Aucun montant standard d’installation robots n’est fixé par cette grille ; il est distinct du fonctionnement annuel. Une correction du périmètre accepté relève de Memlia ; une construction nouvelle reçoit un devis d’extension.

## Agents IA

La seule grille agents applicable est [agents-individuels/GRILLE.md](./agents-individuels/GRILLE.md) : socle commun au cabinet, abonnement par agent choisi avec crédits inclus, puis usage supplémentaire plafonné. Les sièges et sous-agents techniques ne créent pas d’abonnements supplémentaires.

Quand robots et agents utilisent le même résultat, aucun double débit. La maintenance réellement commune est consolidée au devis ; deux lignes ne financent pas le même travail. Les nouvelles adaptations et licences tierces éventuelles sont explicitées avant accord.

## Règles de consommation et de validation

- Le travail, ses entrées, sa restitution et son budget maximal sont connus avant lancement.
- Les reprises de panne Memlia, sessions expirées, attentes de validation et doublons involontaires n’entraînent pas une seconde consommation.
- Un résultat utilisé par plusieurs agents est compté une fois. Les étapes techniques nécessaires ne constituent pas des ventes additionnelles cachées.
- Au plafond autorisé, les nouvelles exécutions attendent une extension ou une réduction explicite du lot.
- Le cabinet garde son jugement, les validations et les décisions. Les préparations ne comprennent aucun envoi, dépôt, paiement ou signature autonomes.

Ces règles définissent l’offre ; elles ne prouvent pas qu’un moteur de facturation ou un compteur de production sont déjà implémentés.

## Simulateur et limites du chiffrage

Le simulateur reprend les montants validés depuis [`tarifs-memlia.json`](../../../src/data/tarifs-memlia.json). Il distingue prix récurrent, mise en service et valorisation du temps. Les temps manuels, le contrôle restant et les dossiers équivalents sont des hypothèses visibles et modifiables. La valeur du temps n’est pas une économie de trésorerie garantie.

Ne pas convertir les heures du collaborateur en heures machine. Ne pas reprendre les gains concurrents comme mesure Memlia. Les campagnes étant saisonnières, aucun délai de rentabilisation en jours n’est déduit mécaniquement d’un gain annuel.

Les prix sont validés, mais les marges restent conditionnelles aux coûts réels, encore non mesurés. Les données de tokens, temps humains, infrastructure et encaissement sont des provisions internes. Kevin confirme le chiffrage Mammouth sur tarifs publics, sans clé ni appel facturé. Les sources originales sont conservées dans `preuves/` et `raw/` ; elles ne constituent pas d’autres offres Memlia.

Sources : [Outils-EC](https://outils-ec.fr/#formules), [son simulateur](https://outils-ec.fr/roi), [Mammouth API](https://info.mammouth.ai/fr/docs/api-quick-start/), [modèles de facturation IA décrits par Stripe](https://stripe.com/resources/more/ai-pricing-models).
