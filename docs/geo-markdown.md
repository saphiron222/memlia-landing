# Export Markdown statique

`npm run build` produit, après les audits du HTML et des ressources :

- `/markdown/index.md` pour l’accueil ;
- `/markdown/<route>.md` pour chaque autre URL du sitemap ;
- `/llms-full.txt`, regroupant ces textes avec leurs URL sources ;
- une section générée de `llms.txt` référençant toutes ces versions ;
- un lien HTML `rel="alternate" type="text/markdown"` dans chaque page concernée ;
- les règles `_headers` Cloudflare servant `/markdown/*` en `text/markdown; charset=utf-8`.

Le générateur lit uniquement le `<main>` du HTML final, après suppression des dates de consultation publiques. Il garde les titres, paragraphes, listes, tableaux, liens absolus et blocs de code ; il exclut navigation, scripts, décor masqué et formulaires. Les outils interactifs ne sont pas exécutables en Markdown. Les encadrés éditoriaux restent présents. Les pages hors sitemap ne sont pas exportées.

## Ordre de construction

`build:site` reste la construction contrôlée des surfaces éditoriales. L’export est une étape finale de `build`, après `resource:audit:qa` : il n’altère pas les corps de pages ni les dates du registre éditorial. Les contrôles historiques du HTML brut et des ressources sont exécutés avant l’ajout du lien de découverte. Le contrat d’export est exécuté ensuite sur la sortie réellement livrée et compare chaque texte au `<main>` final. Il ne faut pas publier la seule sortie de `build:site` pour obtenir cet export.

Aucune fonction Cloudflare ni dépendance supplémentaire. Les fichiers sont régénérés à chaque construction ; ni le Markdown ni les ajouts à `dist/llms.txt` et `dist/_headers` ne sont versionnés. Le générateur est idempotent sur un même `dist`. Les copies textuelles portent `X-Robots-Tag: noindex` pour conserver les pages HTML comme surfaces d’indexation ; elles restent accessibles aux assistants.

## Vérification

- `node --test tests/scripts/agent-markdown.test.mjs` : conversion, nettoyage des sources, sitemap, génération idempotente et témoin négatif d’un export divergent.
- `npm run build` : suite existante puis contrat de l’export complet.
- `node scripts/verify-agent-markdown.mjs` : contrat de `dist` déjà construit.
- `node scripts/verify-agent-markdown.mjs --origin=https://<preview>.memlia.pages.dev` : même contrat via HTTP, avec statut et type MIME pour chaque page et chaque fichier texte.
- Après fusion et déploiement automatique : `node scripts/verify-agent-markdown.mjs --origin=https://memlia.fr`.

Le sitemap local du build vérifié sert d’inventaire au contrôle HTTP. Il faut donc utiliser le build de la révision déployée.

Cet export facilite la lecture textuelle ; il ne promet aucun gain de classement ni de citation. `llms.txt` reste optionnel et n’est pas un levier de classement Google documenté.
