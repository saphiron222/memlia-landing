# Reprise du registre comparateur et des données dérivées

Le comparateur conserve ses textes, calculs et confirmations. Son entrée fournit maintenant l’action « Comparer deux balances comptables » attendue par le contrat du hub. Un test de livraison dédié a échoué avant la correction puis réussi après.

Main du 11 octobre a été intégré dans la branche existante. Les registres outils, preuves et requêtes conservent toutes les entrées de main plus le comparateur. Les liens entrants du comparateur et les scénarios communs des autres outils sont conservés. Les corrections de main aux contrôles d’en-têtes sont reprises, sans modification supplémentaire.

Les données dérivées ont été recalculées avec `npm run regen:generated` : registre lastmod, surfaces et réaffirmations de revue existantes. Aucune nouvelle revue de fond ni modification de la copie des pages ; les paragraphes entrants existants ont simplement été conservés lors de la fusion.

Vérification locale ciblée :
- 26 tests Node du moteur et de livraison PASS ;
- 14 parcours navigateur comparateur PASS ;
- scénario commun réseau/stockage de tous les outils publiés PASS (31,7 secondes) ;
- `test_sitemap_complete_no_legal` PASS après rendu Astro final ;
- `sync-lastmod.mjs --check` PASS, 56 pages.

La construction et les tests complets sont exécutés en CI GitHub, et non sur le Mac. La carte platform existante termine Repository gates et la recette Cloudflare du nouveau candidat. Aucune fusion ni publication de production dans cette reprise.
