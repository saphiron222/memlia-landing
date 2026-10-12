# Navigation, environnements et références — 12 octobre 2026

Demande de Kevin : supprimer « Sur cette page », rendre le footer lisible, reprendre le hub environnements et citer les autorités dans les paragraphes. La publication des articles de rattrapage est suivie sur leurs cartes Hermes, séparément de cette livraison.

## Résultat

La navigation conserve les cabinets, les trois hubs et le contact. Le footer présente quatre groupes courts ; les catalogues gardent les destinations détaillées. Le hub des services expose toutes les tâches publiques dans son contenu principal. Le hub environnements conserve ses douze guides, groupés par logiciel, et ajoute un filtre par logiciel et tâche. Sans JavaScript, tous les liens restent accessibles.

Les références CAC et du barème sont liées aux propositions qu’elles étayent. Le rendu final des articles conserve les corps et les preuves scellés ; il intègre les références historiques dans les paragraphes et retire les bibliographies uniquement si leurs liens sont déjà présents dans le corps. Une citation manquante bloque le rendu, elle n’est pas jetée. Le sommaire ne conserve pas de lien vers une bibliographie retirée. Les repères des outils sont liés dans leur explication. La garde publique refuse les titres de bibliographie et les paragraphes « Références : », sans interdire le mot source dans les explications ordinaires.

Les autorités et les assertions réglementaires existantes restent celles des revues acquises. Les fichiers générés sont régénérés par les commandes du dépôt ; les verdicts métier historiques ne sont pas remplacés par une nouvelle revue automatique. La réaffirmation porte sur les surfaces de présentation, conformément à la constitution Hermes.

## Vérification locale effectuée

- Astro check : zéro erreur, zéro avertissement (33 conseils).
- Reconstruction Astro finale : 81 pages produites ; régénération des surfaces et audit des ressources PASS.
- Contrat universel des pages et services : PASS ; les contrôles exigent le catalogue depuis chaque footer et toutes les tâches publiques dans le contenu principal du catalogue, en conservant leurs canonical, robots et sitemap.
- 36 tests unitaires ciblés : PASS, avec témoins rouges pour une citation absente et un service devenu introuvable.
- 62 contrats Chromium ciblés : PASS ; navigation desktop/mobile/clavier, burger, outils, footer, recherche des environnements, reset, recherche sans résultat et fonctionnement sans JavaScript.
- Garde des libellés publics : 81 pages, aucun libellé interdit.
- Captures réelles du preview local : footer desktop et hub desktop/mobile. Aucun montage.

Complément du12/10 : retrait du lien du sommaire effectué avec la bibliographie dans la passe finale, titres génériques de sources des outils supprimés, assertions de footer détaillé remplacées par leurs hubs. Le build complet suivant a passé les portes des pages et du blog et ses179 tests Python ; sa dernière suite Node a rendu1175 PASS,16 skips attendus et deux FAIL sur les anciennes assertions du hub (libellé du lien H4 et coque commerciale). Le libellé a été restauré ; le contrat du hub vérifie le chrome Base commun sans duplication de header/footer/tokens, les guides gardent leur coque commerciale. Les19 tests ciblés de ces fichiers passent après correction. Une nouvelle reconstruction et régénération des surfaces a passé l’audit des ressources. La CI complète sur ce candidat final reste requise avant fusion. Les deux premières constructions complètes avaient révélé les anciens contrôles qui exigeaient tous les liens détaillés dans chaque footer ; leurs assertions ont été remplacées par la découvrabilité réelle à travers le catalogue, avec tests négatifs. Ne pas présenter ces exécutions comme des builds complets réussis.

## Points de revue indépendante

Vérifier l’accessibilité des filtres et de la navigation mobile, la présence de chaque service public dans le catalogue, le placement des références historiques et l’absence de modification des claims ou verdicts métier. La table de correspondance des références historiques rejette une phrase devenue introuvable plutôt que de déplacer une citation arbitrairement ; une future réécriture d’un de ces paragraphes doit réconcilier sa citation.

La livraison nécessite une revue QA indépendante PASS, la CI verte puis une vérification de memlia.fr après déploiement. Aucune fusion n’est attestée par ce document initial.
