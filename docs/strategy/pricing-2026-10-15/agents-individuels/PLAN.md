# Recalcul par agent IA — 15 octobre 2026

Kevin corrige explicitement la lecture de la phase précédente : **1 000 € + 300 € étaient un ancien modèle à adapter, pas des prix à reprendre.** Il demande de trouver le prix du socle, celui de chacun des agents et l’usage inclus de chacun. Les chiffres de cette phase sont des recommandations nouvelles, pas des montants approuvés.

- [x] Relire les skills Claude `pricing` et `offers` et les études antérieures.
- [x] Vérifier les douze métiers actuels, les prix publics Mammouth et les modèles de compteurs transversaux.
- [x] Dimensionner et comparer les socles candidats, puis prix, réserve d’activité, maintenance et exceptions par agent.
- [x] Vérifier pleine utilisation, combinaisons d’agents, dépassement, réservations et scénarios défavorables.
- [x] Livrer une seule grille lisible, ses exemples métier et les hypothèses ; retirer les anciens prix des recommandations actives.

Sources réouvertes : Mammouth documentation API, Factory 456, Salesforce Agentforce Pricing et Make Credits. Compteur recommandé : crédits d’activité communs, avec estimation avant chaque traitement et exemples de paniers métier par agent. Aucun nombre de tokens ou de minutes machine vendu au cabinet ; aucun tarif ni volume concurrent pris comme preuve du prix Memlia.

Les prix des robots ne changent pas. Le site, sa charte et les modifications UX en cours restent inchangés. Pas de clé disponible : tarifs publics et calculs hypothétiques, sans appels API payants, contact fournisseur ni traitement client. La revue indépendante de l’ancienne étude ne s’applique pas à cette nouvelle grille.

Livraison : `GRILLE.md`, `ECONOMIE.md`, `offre.json`, calcul reproductible et résultats. Sept groupes de tests PASS, dont 4 095 combinaisons à pleine consommation ; recalcul distinct en Decimal des douze configurations à un agent (écart binaire inférieur à 0,00000001 €), paniers dans leurs quotas, liens locaux et 17 empreintes du catalogue vérifiés. Correction d’un arrondi de coût nul : zéro reste zéro, et tout coût positif réserve au moins un crédit. Aucun moteur de réservation ou de facturation n’est présenté comme déjà développé.

Relecture commerciale : socle unique explicite, chaque agent et son quota, exemples de paniers, supplément au prorata sans achat de bloc, prix annoncé avant lancement, erreurs Memlia exclues, mises en service distinguées. Les six vues de l’ancienne étude et son classeur restent historiques ; aucun nouveau classeur ni nouveau tarif public n’est prétendu livré. Pas de compilation complète, conformément aux consignes du dépôt pour cette modification documentaire uniquement.
