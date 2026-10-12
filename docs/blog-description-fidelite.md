# Fidélité de la méta-description du blog

La clause 3 de `scripts/verify-blog-contract.mjs` contrôle l’intention, pas une amorce SEO. La description peut porter la requête déclarée et réellement mesurée ailleurs qu’au début et ajouter les articles et prépositions nécessaires au français.

Le contrôle conserve tous les mots métier, dans leur ordre, sans racine approximative ni correspondance partielle. Seules les liaisons grammaticales listées dans la fonction sont neutralisées ; les négations restent significatives. Ainsi « Définition du rapprochement bancaire en comptabilité » porte « définition rapprochement bancaire comptabilité », mais un rapprochement commercial, non bancaire ou une description générique échoue.

La description rendue doit aussi correspondre à celle déclarée dans le frontmatter, à espaces près : le rendu ne peut pas ajouter une promesse absente du texte éditorial. Ce contrôle lexical ne prétend pas établir la vérité d’une affirmation déjà déclarée. Les gardes de sources, de claims, de P0 et la revue indépendante restent responsables de cette vérification, sans changement ni nouvelle revue du candidat bancaire.

Régression ciblée :

    node --test tests/scripts/blog-contract.test.mjs tests/scripts/blog-constitution.test.mjs

Le test bancaire conserve la description originale et la requête mesurée du candidat `qu-est-ce-que-le-rapprochement-bancaire-en-comptabilite`. Les cas négatifs couvrent absence, intention partielle, autre sujet, négation, mot tronqué, requête non mesurée et promesse ajoutée au rendu. La construction et les tests complets sont exécutés par la CI « Repository gates ».
