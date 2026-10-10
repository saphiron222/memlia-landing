# Reprise technique du 9 octobre 2026

PR155 intègre main 7bfe2af4 une fois. Les correctifs R1/R2 restent identiques à 160499a1 ; les nouveaux registres et tests inventaires de main sont conservés avec l’entrée relance.

La première CI de reprise révèle un défaut de régénération : build:site normalise le texte public via render-public-source-text.mjs, mais regen:generated et les deux reconstructions de seal-resource-surfaces.mjs scellaient auparavant le HTML Astro brut. Le registre lastmod d’évaluation-transmission diverge donc du rendu final. Reproduction réelle : normalisation publique puis sync-lastmod --check et test_sitemap_complete_no_legal échouent. La correction aligne les trois reconstructions sur le même post-traitement, sans changer le corpus source ni les verdicts métier.

Vérification ciblée : npm run regen:generated, puis PYTHONPATH=tests/proof python3 -m unittest test_build.BuildProof.test_sitemap_complete_no_legal. Les tests relance, preuve, Worker et headers sont rejoués ; la suite complète reste exclusivement en CI GitHub. Aucun changement de règle R1/R2, aucune fusion main ni production. Reprise dev puis QA unique existante.
