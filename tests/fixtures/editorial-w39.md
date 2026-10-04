# Scénarios historiques W39

Les deux fichiers `editorial-w39-backlog.json` et `editorial-w39-published.json` figent le backlog et l'état intégré lus depuis `origin/main` au commit `fa32e7c828d8d47115c64fa62e67e9cf597f27e8` (PR63). Ce point contient les archives W39 mais aucun des quatre nouveaux briefs IA. Il permet de rejouer les contre-factuels du 28–30 septembre sans importer une réservation ou une publication d'octobre.

Le décorateur `scenario_w39` ne s'applique qu'aux scénarios datés et à leur helper. Le point d'entrée `--check` reste réellement exécuté par `runpy`, les écritures restent interdites par le test, et les mutations du backlog temporaire restent lues. Les tests de stock courant, de sources mesurées et d'autorité Git gardent les entrées réelles. Le nombre de P3 mesurés décrit le relevé historique, pas la taille future du backlog.

Rejeu : `python3 -m unittest discover -s tests/proof -p 'test_editorial_cadence.py'`. Rejouer aussi sur une copie non-Git du candidat contenant `utiliser-chatgpt-cabinet-comptable`, comme la fixture de publication. Ne pas mettre à jour ces archives pour faire passer une nouvelle publication ; ajouter un scénario distinct si une règle change.

L'inventaire mandaté ajoute uniquement les slugs absents, préserve les réservations et publications présentes, et conserve les négatifs (vrai doublon, angle arbitraire, mauvaise famille). Le contrôle HTML vérifie chaque lien web externe ouvrant `_blank` par les tokens `rel`, sans quota de citations ; trois liens sûrs ne masquent pas un lien dangereux.
