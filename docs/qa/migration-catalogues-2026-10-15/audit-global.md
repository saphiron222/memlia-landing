# Audit SEO global — migration vers les catalogues Memlia

Date : 15 octobre 2026. Audit en lecture seule du site et de Search Console ; aucun déploiement, aucune soumission ou suppression dans Google, aucune modification de contenu produit par cet audit.

## Conclusion avant migration

Le socle technique de la version validée est cohérent. Le problème à corriger est l'architecture commerciale héritée : les anciennes pages de services et les guides par environnement continuent d'exister à côté des robots, agents IA et intégrations. La migration doit les retirer de la découverte et remplacer leurs destinations partout, sans perdre leurs URL historiques ni leurs signaux de recherche.

L'export analysé précède cette migration. Son résultat ne vaut donc pas validation de la version migrée. Relancer l'audit après la génération finale.

## Méthode et skills réellement lus

Instructions du dépôt `CLAUDE.md` ; charte `.agents/product-marketing.md` v8 ; skills de l'installation Claude : `seo-audit`, `seo-technical`, `seo-content`, `seo-schema`, `seo-images` et `seo-agentic`, tous en version 2.4.2. Les sections utiles sont appliquées avec les outils disponibles dans Codex : lecture des sources, analyse de l'ensemble des HTML finaux, contrôles HTTP réels et appels Google en lecture seule. Aucune commande spécifique à Claude Code n'est présentée comme exécutée dans Codex.

Le lanceur `claude-seo` annonce un runtime non prêt. Les scripts Python directement utilisables et les bibliothèques déjà installées donnent néanmoins accès aux identifiants existants, sans installation ni modification. `googleapiclient` manque ; les lectures GSC passent par l'API REST officielle avec `google-auth` déjà présent. Aucune clé ni jeton n'est enregistré dans les preuves.

## Mesures du candidat précédent

Preuve exhaustive : `audit-avant.json`. Script : `auditer-export.mjs`.

| Vérification | Mesure avant migration |
|---|---:|
| HTML analysés | 118 |
| Pages indexables | 110 |
| URL dans les sitemaps | 110 |
| Liens HTML internes vérifiés | 7 734 |
| Éléments image | 824 |
| Fichiers image référencés, variantes comprises | 1 062 |
| Erreurs mesurées | 0 |
| Avertissements mesurés | 0 |

Les titres, descriptions et H1 des pages indexables sont uniques. Chaque page possède un canonical absolu cohérent, un H1, un contenu principal et ses métadonnées de partage. Les images sociales et toutes les variantes d'image référencées existent. Les images ont leur texte alternatif et leurs dimensions. Aucun lien interne ou fragment HTML manquant, aucune page indexable orpheline ; toutes sont à deux liens de l'accueil au maximum. Aucun HTML n'atteint 2 Mio : le plus volumineux est le glossaire à 560 428 octets, puis les intégrations à 414 157 octets. L'image de contenu référencée la plus lourde fait 89 778 octets.

Le JSON-LD est syntaxiquement valide ; ses URL internes existent et n'empruntent pas de redirection. Les trois catalogues emploient `CollectionPage`, `ItemList`, `BreadcrumbList`. Les fiches emploient `WebPage`, `Service`, `BreadcrumbList`. L'audit ne remplace pas le validateur Schema.org ni l'inspection des résultats enrichis Google.

Le graphe de robots.txt, sitemaps, llms.txt, llms-full.txt, RSS et versions Markdown est cohérent avant migration. Le texte final, sa version Markdown et le fichier intégral restent produits depuis le même HTML public. Cette cohérence mécanique doit être rejouée après suppression des routes.

## Conservation des signaux acquis

Preuves : `gsc-lecture-seule.json`, requêtes réelles effectuées le 15 octobre 2026, période finale du 15 septembre au 12 octobre 2026, propriété `sc-domain:memlia.fr`.

L'API Search Analytics renvoie 72 lignes de pages, représentant 33 clics et 1 537 impressions dans ces lignes. Parmi elles, 21 anciennes pages d'automatisation ou d'environnement représentent 5 clics et 303 impressions. Ces sommes portent sur les lignes de pages renvoyées ; elles ne sont pas présentées comme un total exhaustif du compte.

| Ancienne URL | Clics | Impressions | Destination pertinente à prévoir |
|---|---:|---:|---|
| `/integrations/bulletin-de-paie-sage` | 2 | 20 | Fiche de l'agent IA Paie et social |
| `/integrations/bulletin-de-paie-silae` | 1 | 29 | Fiche de l'agent IA Paie et social |
| `/integrations/lettrage-cegid` | 1 | 26 | Fiche de l'agent IA Comptabilité, tâche de lettrage |
| `/automatisation/notes-de-frais` | 1 | 15 | Fiche de l'agent IA Comptabilité, tâche correspondante |
| Autres anciennes URL mesurées | 0 | 213 | Robot ou agent qui reprend effectivement la tâche |

Les redirections permanentes doivent être directes et documentées. Les contenus d'articles scellés peuvent être préservés dans leur source et leurs liens migrés par le mécanisme de rendu prévu par le chantier ; le HTML livré doit pointer directement vers les destinations actuelles. Éviter une redirection indistincte de tous les guides vers un hub si une fiche reprend mieux l'intention.

Les anciennes versions `/markdown/integrations/*.md` et `/markdown/automatisation/*.md` ne doivent plus rester des exports concurrents après migration. La même matrice de destination peut couvrir ces anciennes URL textuelles.

L'inspection URL officielle confirme aussi que les trois URL `/integrations/bulletin-de-paie-sage`, `/automatisation/notes-de-frais` et `/automatisation/paie` sont « Envoyée et indexée », verdict `PASS`, avec leurs propres canonicals retenus. Leurs derniers crawls sont les 12 et 13 octobre. Preuve : `gsc-inspection-avant.json`. Il s'agit bien de pages déjà connues de Google, ce qui renforce la nécessité de destinations pertinentes et de redirections permanentes.

## Correctifs prioritaires pour la migration

1. Retirer les anciennes routes commerciales et les guides par environnement des générateurs, menus, cartes, suggestions, voisins, fils d'Ariane et sélecteurs. Les archives internes et les preuves de publication restent conservées.
2. Publier la vraie fiche Paie et social de Salomé avant de faire rediriger `/automatisation/paie` et les guides de paie vers elle. Vérifier les autres destinations partagées Aude/CAC et Octavie/intégrations.
3. Remplacer les URL et références héritées dans les données structurées, notamment les `isRelatedTo` des agents. Les liens HTML corrigés ne suffisent pas.
4. Mettre à jour `public/llms.txt` : remplacer la description « recherche et guides par tâche », le nombre de fiches, les anciennes catégories commerciales et les résumés historiques. Ajouter `/agents-ia` dans l'inventaire typé généré et distinguer correctement agents, robots et intégrations.
5. Retirer les anciennes routes des sitemaps et des versions Markdown. Vérifier la classification de `/integrations` : l'URL ne doit plus être décrite comme un ensemble de guides. Le nom historique d'un fichier sitemap peut rester stable s'il facilite la migration ; il ne doit pas annoncer des URL retirées.
6. Rejouer la propriété des intentions et les contrats de pages après migration. Une URL abandonnée ne doit plus rester propriétaire active d'une requête ; les preuves historiques restent archivées.
7. Relire les liens des pages À propos, Garanties, Méthode et Contact. Les exemples de paie, notes de frais, rapprochement ou juridique doivent présenter l'offre actuelle sans réintroduire la navigation « automatisation par pôle ».
8. Après génération, contrôler les liens HTML, Markdown, JSON-LD, RSS et toutes les ancres, les redirections et les exports ; vérifier également qu'un chemin inconnu renvoie réellement 404.

## Découverte et accès aux agents

La politique existante de robots.txt autorise explicitement la recherche et les usages IA publics, avec une exclusion Bytespider. Elle exprime déjà le choix de visibilité de Memlia ; aucune nouvelle politique d'entraînement n'est décidée par cet audit.

Les fonctions de découverte servent ici à maintenir une présentation textuelle cohérente du site. llms.txt, Markdown et Content-Signal ne garantissent ni classement, ni trafic, ni citation, et ne remplacent pas un HTML accessible et correctement maillé. Aucun fichier WebMCP, API catalog, A2A ou commerce n'est nécessaire à ce site vitrine pour achever la migration demandée.

Preuve HTTP de la version antérieure : `http-avant.json`, prévisualisation `https://fbc59424.memlia.pages.dev`. Douze chemins testés, dont les trois catalogues, llms, les exports et les sitemaps. Tous les chemins attendus répondent 200 avec les types de contenu prévus ; la route inconnue répond 404. Les pages de prévisualisation portent `noindex, nofollow`, avec canonical de production. Cette protection de prévisualisation est intentionnelle ; on ne la confond pas avec l'indexabilité de l'export de production.

## Données disponibles et limites

- Google : clé API, compte de service et propriété GSC configurés ; accès GSC réellement confirmé par HTTP 200. GA4 n'a pas de propriété configurée.
- DataForSEO : variables d'accès présentes, aucun outil MCP DataForSEO exposé dans cette session. Aucun appel payant ni volume de recherche inventé.
- Matomo : accès non configuré dans l'environnement observé.
- CrUX mobile (`PHONE`) : appel réel sur `https://memlia.fr`, aucune donnée terrain disponible. Preuve `crux-production-phone.json`. Aucun LCP/INP/CLS terrain déduit des mesures de laboratoire.
- Lighthouse : les mesures antérieures du chantier restent de laboratoire ; un nouveau rendu ou une modification technique justifie un nouveau contrôle ciblé. Aucun score de santé SEO universel ni garantie de rang n'est annoncé.
- WAF : les réponses aux requêtes ordinaires sont observées ; aucun journal Cloudflare ni trafic d'un robot cryptographiquement vérifié n'a été inspecté. Ne pas assimiler un simple User-Agent imité à un robot réel.

## Intervention Google après publication, pas sur la prévisualisation

La lecture de l'API Sitemaps révèle encore la soumission historique `https://memlia.fr/sitemap-0.xml`, avec une erreur, alors que l'index officiel est désormais `sitemap.xml`. Les huit autres soumissions examinées ne portent aucune erreur ni avertissement. Les champs `indexed` de cette API ne permettent pas de conclure qu'une URL est ou n'est pas indexée : seule l'inspection URL renseigne cet état.

Quand la version migrée sera effectivement publiée en production, retirer cette ancienne soumission et les éventuels sitemaps devenus absents, puis resoumettre l'index officiel. Rien n'est soumis depuis la prévisualisation. Contrôler ensuite les redirections publiques et l'état des principales URL migrées ; l'effet dans Google dépend de son recrawl et n'est pas immédiat.

## Rejouer le contrôle final

Depuis la racine du checkout, après la génération publique et les exports :

```sh
node docs/qa/migration-catalogues-2026-10-15/auditer-export.mjs --dist=dist --output=docs/qa/migration-catalogues-2026-10-15/audit-apres.json --strict=true
```

Le script écrit seulement son rapport dans le dossier QA. Il ne reconstruit pas le site, ne fait pas d'appel réseau et ne modifie aucun fichier de production. Il échoue avec un code non nul si une erreur mesurée subsiste. Le contrôle HTTP distant et les interactions clavier/mobile restent à rejouer sur la nouvelle prévisualisation par le chantier principal.

## Invariants de migration contrôlés pendant l'implémentation

`tests/scripts/migration-catalogues.test.mjs` : 30 tests ciblés réussis. Ils contrôlent les 24 retraits exacts, leur répartition 12 services / 12 guides, les 21 robots préservés, les destinations métier arrêtées dans la matrice, les 24 empreintes d'archives figées, l'absence de chaîne et de boucle, les 96 variantes de redirection (URL nue, slash, `.html`, ancien Markdown), la résolution des liens, les réponses GET et HEAD des deux Pages Functions, la CSP et le corps des 21 robots, et le maintien d'une réponse 404 sur les inconnus.

Les mutants couvrent les destinations externes ou incohérentes, sources dupliquées ou absentes, jokers, paramètres, auto-boucles, chaîne vers une ancienne route, retrait incomplet, mauvais éditeur, retrait accidentel d'un robot et altération d'archives. Les contrôles de syntaxe invoquent le vrai validateur produit ; les contrôles métier et les empreintes utilisent des témoins indépendants et figés dans le test. Ces tests ne remplacent pas le contrôle des destinations et fragments dans le HTML final, à rejouer lorsque l'export migré sera disponible.
