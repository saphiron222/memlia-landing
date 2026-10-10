# Données structurées par audience — D2

## Résultat

Le validateur local `node --test tests/scripts/schema-render.test.mjs` passe sur les 55 pages indexables du build : JSON valide, contexte Schema.org, un fil par page, positions ordonnées, URL absolues, destination finale égale au canonical, au plus un Service par page, propriétés du Service et des applications présentes.

Ce contrôle local n'est pas une exécution des interfaces Google Rich Results Test ou validator.schema.org. Il ne promet aucun résultat enrichi : Service n'a pas de résultat enrichi spécifique, les outils ne portent ni avis ni notes inventés. Le fil minimal de l'accueil décrit une position, sans viser le résultat enrichi Google à deux positions. FAQPage existant est conservé pour sa sémantique, pas pour une promesse de visibilité.

## Dix pages types

| Page | Types principaux | Contrôle local |
| --- | --- | --- |
| / | WebPage, Service, FAQPage, BreadcrumbList | PASS |
| /automatisation-cabinet-comptable | WebPage, Service, BreadcrumbList | PASS |
| /automatisation/paie | WebPage, Service, BreadcrumbList | PASS |
| /methode | WebPage, BreadcrumbList | PASS |
| /blog | CollectionPage, Blog, BreadcrumbList | PASS |
| /blog/rubrique/paie-dsn-cabinet-comptable | WebPage, CollectionPage, BreadcrumbList | PASS |
| /integrations | CollectionPage, ItemList, BreadcrumbList | PASS |
| /integrations/lettrage-sage | TechArticle, WebPage, BreadcrumbList | PASS |
| /glossaire | CollectionPage, DefinedTermSet, BreadcrumbList | PASS |
| /outils-comptables-gratuits/calculateur-marge-commerciale | WebPage, WebApplication, BreadcrumbList | PASS |

`generated-schema.json` contient les blocs réels de ces dix HTML, pas des modèles fictifs.

## Utilisation

- Service d'une nouvelle audience : appeler `serviceNode({ chemin, audienceType, name, serviceType, description })` avec les textes réels de la page. L'identifiant suit le chemin ; passer `id` seulement pour une entité explicitement partagée. L'appel sans argument conserve le service EC historique à l'identique.
- Service de tâche : renseigner `audienceType` dans `commercial/recettes/<slug>/recette.json`. La forge valide ce texte, le transmet au frontmatter et au manifeste ; la collection et Service.astro l'utilisent. En son absence, le public EC existant reste inchangé. Ne pas confondre ce champ de public avec `audience.qualifier`, qui qualifie l'intention de recherche.
- Fil : Base complète seulement les pages indexables sans BreadcrumbList. Les fils éditoriaux explicites, ceux des articles et ceux des outils restent intacts. L'accueil à JSON-LD externe utilise le même helper.
- Les applications gratuites sont déjà décrites par Outil.astro et acceptées par le contrat de page. Aucun prix, avis ou score n'est ajouté.
- Une page éditoriale, un guide ou un hub ne devient pas artificiellement un Service : les prestations restent sur l'accueil, le pilier et les pages de tâches.

## Preuves

Tests rouges observés avant correction : helper de fil absent ; audienceType supprimé par la forge. Après correction : 74 tests ciblés PASS (3 unitaires, 55 rendus, 16 forge). Astro build : 61 pages ; Astro check : 0 erreur, 0 warning, 9 hints préexistants.

Revue QA indépendante : PASS, aucun défaut concret ; 74 tests ciblés rejoués, diff vérifié. Les sceaux du glossaire et lastmod ont été régénérés par la procédure du dépôt ; aucune nouvelle revue du fond.
