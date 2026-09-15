# Triage des 36 branches non intégrées — 15 septembre 2026

Source : inventaire Git du coffre `20-dev/inventaire-branches-non-integrees.md`, contrôlé contre `main` de chaque dépôt le 15 septembre 2026.

Règle : une passe intermédiaire est `OBSOLETE` si une branche retenue contient son travail ; une branche est `INTEGRER` si elle porte encore une contribution absente de `main`. Le tri est terminé avant toute fusion.

## memlia-landing — 27 branches

| Carte | Branche | Verdict | Motif |
|---|---|---|---|
| `t_6f653b66` | `wt/t_6f653b66` | INTEGRER | Les trois documents `docs/agents/` du flux Matt Pocock sont autonomes et absents de `main`. |
| `t_1356eaec` | `wt/t_1356eaec` | OBSOLETE | Première passe BLOG-SYS-4R, reprise par les durcissements suivants. |
| `t_2f990d72` | `wt/t_2f990d72` | OBSOLETE | Passe BLOG-SYS-4R2 incluse dans la lignée finale de réécriture. |
| `t_766f325b` | `wt/t_766f325b` | OBSOLETE | Passe BLOG-SYS-4R3 incluse dans la lignée finale de réécriture. |
| `t_6b7dfe2f` | `wt/t_6b7dfe2f` | OBSOLETE | Passe BLOG-SYS-4R4 intermédiaire incluse dans la lignée finale. |
| `t_33fa3464` | `wt/t_33fa3464` | OBSOLETE | Autre passe BLOG-SYS-4R4, incluse dans la lignée finale. |
| `t_d7e10de5` | `wt/t_d7e10de5` | OBSOLETE | Passe BLOG-SYS-4R5 incluse dans la lignée finale. |
| `t_09f22417` | `wt/t_09f22417` | OBSOLETE | Passe BLOG-SYS-4R6 incluse dans la lignée finale. |
| `t_f442e1b3` | `wt/t_f442e1b3` | OBSOLETE | Ancêtre direct de `site/blog-rewrite-existing` ; son pipeline attend les preuves scellées du candidat désormais périmé et ne s’intègre pas isolément aux articles publiés. |
| `t_69390c85` | `site/blog-seo-system` | OBSOLETE | Première version du pipeline, remplacée par les durcissements de la lignée finale. |
| `t_470b4262` | `wt/t_470b4262` | OBSOLETE | Intégration intermédiaire des articles, incluse dans `site/blog-rewrite-existing`. |
| `t_105b15dd` | `site/blog-rewrite-existing` | OBSOLETE | Fusion annulée : son audit scellé sur les brouillons du 13 septembre refuse les articles publiés et revérifiés le 15 septembre (118 erreurs, empreintes et frontmatter divergents). La mécanique doit être recalculée sur le contenu courant, pas fusionnée avec des preuves périmées. |
| `t_6306ed21` | détachée `92ec835` | OBSOLETE | Même tête que la lignée retenue ; aucune contribution distincte. |
| `t_1505b3b9` | détachée `3dc0ba8` | OBSOLETE | Revue technique historique ; son socle produit est déjà repris dans les lignées retenues. |
| `t_584e6438` | détachée `2d78b8b` | OBSOLETE | Passe BLOG-SYS-5 déjà incluse dans la lignée finale. |
| `t_e7c84a8c` | `wt/t_e7c84a8c` | INTEGRER | Le modèle pilote N/A est une preuve autonome absente de `main`. |
| `t_8931b129` | `wt/t_8931b129` | OBSOLETE | Première correction QAD incluse dans la lignée ressources finale. |
| `t_701859c0` | `wt/t_701859c0` | OBSOLETE | QAD-FIX2 incluse dans la lignée ressources finale. |
| `t_9dfa3cae` | `wt/t_9dfa3cae` | OBSOLETE | Revue IA incluse dans la lignée ressources finale. |
| `t_dcd8a18e` | `wt/t_dcd8a18e` | OBSOLETE | Doublon de la passe de revue IA précédente. |
| `t_1e4e34f1` | `wt/t_1e4e34f1` | OBSOLETE | METIER-FIX-A incluse dans la lignée ressources finale. |
| `t_9b260748` | `wt/t_9b260748` | OBSOLETE | Même tête finale que la lignée ressources retenue. |
| `t_6dbc334d` | `wt/t_6dbc334d` | INTEGRER | Lignée ressources finale : QAD, revue IA, METIER A/B et applicabilité métier. |
| `t_278eba33` | `site/hub-ressources-adaptateurs` | OBSOLETE | Adaptateurs repris et durcis dans la lignée ressources finale. |
| `t_27e8be9f` | `site/glossaire` | OBSOLETE | Glossaire repris avec ses contrats et tests dans la lignée ressources finale. |
| `t_4ec9cc36` | `wt/t_4ec9cc36` | INTEGRER | Sonde d’indexabilité exacte et test absents de `main`. |
| `t_f5098486` | `wt/t_f5098486` | OBSOLETE | Spécification design historique supplantée par le site Astro et ses documents courants. |

Ordre de fusion retenu : `t_6f653b66` → `t_e7c84a8c` → `t_6dbc334d` → `t_4ec9cc36`.

## memlia-desk — 9 branches

| Carte | Branche | Verdict | Motif |
|---|---|---|---|
| `t_a4615754` | `wt/t_a4615754` | INTEGRER | Arbitrage white-label et mises à jour de marché/roadmap absents de `main`. |
| `t_7ce0e75d` | `wt/t_7ce0e75d` | OBSOLETE | Ancêtre direct du triage PowerPoint final `t_54183ce5`. |
| `t_54183ce5` | `wt/t_54183ce5` | INTEGRER | Triage PowerPoint final et décision FN/LP. |
| `t_14c633b9` | `wt/t_14c633b9` | INTEGRER | Correctifs et preuves des tickets 83/90 sans successeur dans ce lot. |
| `t_0887e272` | `wt/t_0887e272` | INTEGRER | Suppression des pages latérales du classeur d’entraînement, outil et tests dédiés. |
| `t_9a45431b` | `wt/t_9a45431b` | OBSOLETE | Passe S41 intermédiaire reprise par `t_9b381cb2`. |
| `t_9b381cb2` | `wt/t_9b381cb2` | INTEGRER | Dernière passe S41, avec témoins mémoire/handles et rapports finaux. |
| `t_bd49b1ba` | `wt/t_bd49b1ba` | INTEGRER | Le harnais transactionnel S52 est retenu via son descendant vérifié `wt/t_e3558eec`, qui contient `f991d9f` et la recette Windows vivante. |
| `t_a1802855` | `wt/t_a1802855` | INTEGRER | Verdict indépendant S52 run787 autonome et absent de `main`. |

Ordre de fusion retenu : `t_a4615754` → `t_54183ce5` → `t_14c633b9` → `t_0887e272` → `t_9b381cb2` → descendant vérifié `t_e3558eec` de `t_bd49b1ba` → `t_a1802855`.

## Totaux

- 36 branches triées.
- 11 verdicts `INTEGRER`.
- 25 verdicts `OBSOLETE`.
- 0 verdict `A DECIDER`.
