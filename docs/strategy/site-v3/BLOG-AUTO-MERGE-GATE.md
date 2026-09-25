# Garde procédurale de fusion du blog (25/09/2026)

Le dépôt privé GitHub Free n'atteste pas une protection de branche *enforced*. La décision blog-only de Kevin autorise une fusion autonome **seulement** après les preuves ci-dessous ; elle ne vaut ni permission de pousser directement sur `main`, ni preuve de déploiement.

## Installation et première utilisation

Le script `scripts/blog-auto-merge.mjs` et ses tests doivent d'abord être intégrés par une PR dédiée, avec revue QA indépendante et `Repository gates` réussi sur son HEAD exact. Ne pas employer la copie locale d'une branche non revue comme autorité de publication. Pour ce premier bootstrap, vérifier les mêmes conditions manuellement ; aucune fusion ne doit se produire sur le seul résultat local des tests. Une fois la garde intégrée et son SHA de production attesté, l'exécuter depuis un checkout propre de `main` à jour.

## Entrées et contrôle

`node scripts/blog-auto-merge.mjs --pr N --qa-task t_ID --expected-head SHA40 --expected-main SHA40` vérifie en lecture seule : PR ouverte et non draft visant `main`, HEAD/base/remote exacts, absence de conflit, chemins limités au blog, QA indépendante terminée PASS avec le même HEAD et `Repository gates` réussi sur le commit exact. La seule exception au fichier global `CLAUDE.md` est épinglée à la PR #3 et à son HEAD revu `e024882b1c1048eadff8835e20313292087a2145` ; si ce HEAD change, arrêter et soumettre le nouveau diff à une revue plutôt que d'élargir l'exception. Les workflows CI et la charte globale marketing ne sont jamais inclus par défaut.

`--merge` demande la fusion par l'API PR GitHub avec `--match-head-commit`, après les contrôles. Il ne prouve pas à lui seul la fusion, l'ascendance du commit, le nombre de pushes, ni le déploiement. Lire ensuite la PR fusionnée et `origin/main`, comparer le HEAD fusionné et l'ascendance, puis relever l'ID de déploiement Cloudflare et vérifier la source SHA exacte, le succès du build, le contenu, l'URL, le sitemap et le journal. Tant que cette lecture retour manque, ne pas déclarer publié ni activer les cinq crons. Toute garde inaccessible ou divergente est un arrêt, pas une permission de contournement.

La QA portant sur la PR #3 (`t_0932ee86`) ne vaut que pour son HEAD. Toute nouvelle PR, y compris celle qui installe la garde, exige une QA indépendante propre au HEAD de cette PR avant sa fusion. Les tests de refus de la garde passent dans `npm run build` via `scripts/test-scripts.mjs` et la CI `PR validation` ; une CI verte n'est ni une revue indépendante ni une protection de branche.
