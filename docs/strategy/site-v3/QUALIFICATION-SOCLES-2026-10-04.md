# Qualification des socles — 04 octobre 2026

Relecture ciblée de `t_add8af7c`, après intégration IA PR54. Base récupérée depuis GitHub :
`e27800cfe0dbb348ad9a8ea8d41b00386ba1bdc7`. Aucun ancien candidat local n'est repris.
Les relevés historiques, corps d'articles, recettes, sceaux et avis acquis restent intacts.

## Les quatre signaux transmis et leur issue

Le rapport parent `t_b101bf53/strategy-live.json`, sur `c4a399c8`, signalait quatre écarts.
La nouvelle base ne doit pas être assimilée à cette photographie : PR54 a modifié le runbook.

| Signal transmis | Source relue et constat | Issue |
|---|---|---|
| Accès commerciaux : `site.mjs` plus récent | Le diff depuis la dernière édition du document retire uniquement Saisie de `PAGES_NOINDEX`. `e9866dd8` supprime aussi la fonction Pages 503. La route et le canonical demeurent. | Corriger l'addendum : suspension historique, ne pas la restaurer ; architecture commerciale conservée. |
| Runbook : `blog-forge.mjs` plus récent | Dernier changement `2e8ea7c0`, antérieur à l'édition du runbook intégrée par PR54 (`e2e09b18`). Diff vide entre cette édition et la base fraîche. Image directe 1600 × 900, provenance interne et identités réellement portées par les revues déjà décrites au §3/§4. | Alerte absorbée par l'intégration parente ; procédure conservée avec motif explicite, sans nouvelle recette ni transfert de PASS. |
| Runbook : `render-blog-article-proofs.mjs` plus récent | Constat historique après PR54 : dernier changement `2e8ea7c0`, diff vide ; le renderer exigeait alors 24 cadres, 12 recettes, deux cadres par recette. Qualification courante après PR60 (`e4929b8f`, intégrée sur main `92ee0c81`) : les constantes 24/12 sont retirées ; l'inventaire vient du contrat, avec identifiants uniques, cadres concordants et exactement deux preuves par recette de cette série. Le contrat actuel contient encore 24 cadres pour 12 articles : photographie, non plafond du programme. Modes Pages (sources et actifs scellés) et local (pixels) conservés. | Alerte initialement absorbée, puis changement réel PR60 qualifié ; procédure d'inventaire PR60 conservée dans le runbook, historique PR54 préservé. L'objectif éditorial non universel reste distinct du contrat de cette série. |
| Structure : 11 fichiers annoncés / 12 `.md` | Douze fichiers source : un pilier, neuf ordinaires et deux Cicatrices selon les recettes versionnées (`serie: cicatrices` pour adoption des outils et trois passes). `blog:audit` valide douze dossiers pipeline, sans blocage. L'article des trois passes manquait aussi dans l'arbre écrit. | Compteur et arbre corrigés ; pas d'inférence d'indexation ou de déploiement à partir des fichiers. |

## Signal supplémentaire de la base fraîche

Le moniteur strict sur `e27800cf` rend **2**, avec trois signaux : accès commerciaux,
compteur de fichiers et `Nav.astro` plus récent que `SITE-STRUCTURE.md`. Les deux signaux
runbook ont disparu avant cette livraison : leur issue est démontrée, pas masquée par une date.

Le diff de navigation `bc62a28a` remplace largeur maximale/défilement horizontal par
`flex-wrap: wrap`. Liens et destinations inchangés : documenter le retour à la ligne mobile,
sans changer l'arborescence. La mise à jour du README indexe les documents relus, plutôt que
laisser son registre devenir à son tour une source documentaire non qualifiée.

## Rejouer et interpréter les preuves

Depuis un checkout propre avec dépendances installées :

```bash
python3 /Users/kevinkitanga/hermes/scripts/strategy-docs-monitor.py --repo "$PWD" --ref HEAD --strict
python3 /Users/kevinkitanga/hermes/scripts/test-strategy-docs-monitor.py -q
npm run blog:audit
npm run check
npm run build
```

Le moniteur lit une référence Git, pas les modifications non commitées. Après commit documentaire,
le résultat attendu est `{"drift": [], "schemaVersion": 1}` et une sortie 0. Les 14 témoins du
moniteur incluent compte absent/faux, mentions historiques/commentaires, routes absentes et
source ajoutée après revue ; ils vérifient aussi la sortie stricte 2 d'une mutation CLI. Un PASS
ne certifie pas toute la doctrine et ne constitue pas une revue indépendante.

Les commandes ci-dessus n'ouvrent aucun nouvel article, ne régénèrent pas le calendrier et ne
réactivent pas le cron. `--check` du renderer laisse les actifs publics et le manifeste intacts
mais produit ses annotations locales. Les preuves d'exécution de cette livraison sont jointes à
la carte ; les contrôles après fusion doivent se refaire sur `origin/main` fraîchement récupéré.

## Livraison et limites

Cette qualification est celle du candidat documentaire, pas une assertion de fusion anticipée.
PR, CI et unique revue QA indépendante portent la livraison ; après fusion, relire ces cinq
documents sur main, vérifier leur présence et relancer le moniteur strict. Aucun texte fiscal,
social, juridique ou réglementé n'est modifié : pas de seconde revue métier à créer.

Les preuves HTTP héritées de la carte parente qualifient une surface servie à leur instant de
capture. Elles ne prouvent ni le commit déployé, ni une conformité métier exhaustive. Les anciens
avis et relevés datés sont conservés, jamais réattribués ou remplacés par des mesures supposées.
