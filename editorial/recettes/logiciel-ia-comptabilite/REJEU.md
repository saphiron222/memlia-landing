# Rejeu éditorial W39 — logiciel IA comptabilité

Ce dossier contient une règle locale déterministe, et **non** un essai de logiciel commercial, de ChatGPT ou d'une automatisation livrée à un cabinet. Toutes les entrées sont fictives ; aucune écriture comptable ni aucun envoi n'est déclenché.

La règle et les quatre entrées (nominal, doublon, période différente, identifiant absent) sont dans `rejouer-cas.mjs`. Exécuter depuis la racine du dépôt :

```sh
node editorial/recettes/logiciel-ia-comptabilite/rejouer-cas.mjs
node editorial/recettes/logiciel-ia-comptabilite/verifier-rejeu.mjs
```

La première commande écrit `journal-rejeu.json` avec chaque entrée et sa sortie ; la seconde rejoue les entrées et confronte statuts et motifs à un oracle déclaré séparément du moteur. Les quatre sorties doivent correspondre aux quatre lignes `cas` de `cas-executes.json`. Ce dernier document est la synthèse éditoriale historique, pas un oracle indépendant ni une mesure de produit. La sortie `proposition_a_valider` n'est jamais une validation ou une imputation comptable.

Provenance : le démonstrateur initial `scripts/replay-w39-fictional-cases.mjs` se trouvait uniquement dans le worktree de préparation `t_f94d562f`, hors du checkout isolé soumis à la revue métier t_b64a2427. Il a été porté dans ce dossier autonome avec sa seule fonction `classerPiece` et les quatre entrées correspondantes pour permettre un rejeu reproductible depuis le commit de livraison. Aucune des autres routines du script initial (prompt et Cicatrice) n'est copiée dans ce sujet. Une sortie correcte n'atteste pas la capacité d'un éditeur, et la revue métier reste distincte de cette vérification mécanique.
