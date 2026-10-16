# Tarifs Memlia validés

**Validation de Kevin le 15 octobre 2026. Deux références commerciales uniquement :**

1. [RECOMMANDATION.md](./RECOMMANDATION.md) : forfaits robots, périmètre et règles communes.
2. [agents-individuels/GRILLE.md](./agents-individuels/GRILLE.md) : socle de 199 € HT/mois, prix et crédits inclus de chaque agent, équivalents en dossiers, suppléments et mise en service.

Les anciennes propositions, variantes par pôle et anciens classeurs de prix sont supprimés du checkout. Leur historique reste dans Git ; ils ne constituent pas des offres applicables.

La source structurée unique des montants est [`src/data/tarifs-memlia.json`](../../../src/data/tarifs-memlia.json). Les calculs et hypothèses dans `agents-individuels/` vérifient ces tarifs sans créer de grille alternative. Les prix sont validés ; les temps, coûts et équivalents en dossiers restent des hypothèses à calibrer.

`preuves/` et `raw/` conservent les sources fournisseurs et concurrents datées. Les montants qui y figurent ne sont pas des tarifs Memlia. Aucun appel API payant ni traitement client n’a été lancé pour ce chiffrage.
