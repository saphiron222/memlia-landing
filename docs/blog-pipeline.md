# Pipeline éditorial du blog

Ce pipeline prépare un candidat par jour au maximum. Il ne publie rien : un article reste `brouillon: true` jusqu’au go explicite de Kevin, et seule la production validée passe à `brouillon: false`.

## Créer un candidat

```bash
npm run blog:create -- <slug> "<titre intent-first>" "<requête primaire mesurée>" [AAAA-MM-JJ]
```

La commande ajoute l’entrée à `editorial/queue.json`, crée `src/content/blog/<slug>.md` et initialise `editorial/articles/<slug>/`. Elle refuse un second candidat actif le même jour et n’écrase jamais un dossier existant.

Le dossier doit conserver :

- `manifest.json` : contrat éditorial, intention, rôle, recherche, maillage, CTA et validations de Kevin. Chaque source porte un `level` fermé (`tier-1` à `tier-5` ou `original-method`), une provenance (`primary`, `secondary` ou `echo`), le booléen `official`, l’URL primaire `upstreamUrl`, une justification et une preuve `classificationEvidence` distincte de la preuve d’ouverture. Cette preuve structurée relie le slug, les SHA-256 du candidat et du manifeste, l’identifiant, les URL, l’éditeur et les labels exacts ; elle nomme `classifiedBy` et un `reviewedBy` distinct, avec un verdict `PASS`. Une méthode originale documente obligatoirement période, population, protocole et limites ;
- `brief.md` : brief approuvé avant rédaction ;
- `claims.json` : inventaire exhaustif des unités textuelles rendues et résultat de fact-check machine-relisible pour chaque affirmation. Chaque claim sensible porte une citation exacte de la copie locale vérifiée, son SHA-256, le SHA-256 de cette copie, l’URL finale, la date, le titre et un localisateur reproductible (`line-range`, `section`, ou `anchor` relié à une plage déclarée dans la preuve source). Une justification structurée nomme les termes partagés et explique le lien claim↔citation. Le garde déterministe vérifie présence, coordonnées, recouvrement lexical, citation trop générique, réemploi sur des claims non équivalents et marqueurs simples de négation/polarité ; il ne prétend jamais comprendre le droit ni prouver à lui seul que la source soutient le claim. `claim.type` appartient obligatoirement à `produit`, `methode`, `information`, `paie`, `social`, `dsn`, `fiscal`, `juridique`, `legal-reglementaire` ou `statistique-chiffre` ;
- `skills.json` : exactement 31 skills Blog et 24 skills SEO, chacun `RUN` avec preuve et résultat `PASS`, ou `N/A` avec justification factuelle ;
- `image.json` : provenance `image_generate` reliée au hash du master, grille visuelle observable, validations, variation mesurée et dimensions ;
- `review.json` : sept critères canoniques (20/15/20/20/10/10/5), score final recalculé ≥ 90, zéro P0 et décision `pret-preview` ;
- `preuves/` : artefacts cités par les manifestes. Une référence vide, absente ou sortant du dossier bloque le gate.

Les templates sont dans `editorial/templates/`, dont `source-classification.json` à copier une fois par source sous le chemin déclaré par `classificationEvidence`. Les placeholders `__A_RENSEIGNER__` sont volontairement bloquants.

## Auditer et ouvrir le gate

### Conservation bornée des deux articles déjà publiés

Les deux articles du commit `939464c90ecee928bfd9d7f7be26ea028758cf8b` restent publics, `brouillon: false`, auteur Kevin Kitanga et `publie-non-atteste`. `blog:audit` les traite par `published-audit`, jamais par `legacy-preserved`. Ce mode exige leurs octets SHA-256 exacts, le dossier complet, ses contrôles de structure/citations et un reçu `preuves/published-adoption.json` couvrant tous ses fichiers. Il ne valide aucune nouvelle rédaction.

`node scripts/migrate-published-blog.mjs` conserve les originaux sous `preuves/inherited/`, réassocie les preuves au candidat publié et inventorie les changements. Les textes des claims, citations, résultats et dates historiques restent inchangés ; les unités rendues reflètent le texte public exact. Les sources conservées sont datées du 13 septembre : la relecture au 15 est une déclaration du commit public, pas un nouveau fact-check démontré par cette migration. `freshFactCheck: false`, `publicationAuthorized: false` et l'absence d'attestation sont explicites dans le résultat.

Les gates `protected-preview` et `production` ne sont pas assouplis. Un rapport de conservation PASS n'est pas accepté par `prepare-preview`. Toute modification des octets, de la provenance, du reçu, de l'auteur, du statut ou des liens fait échouer l'audit. La revue technique et la revue métier aval restent distinctes de cette conservation locale.

### Intention SEO des publications scellées

Pour `editorialStatus: publie`, `blog:audit`, le contrat HTML du build et le test des titres relisent les relevés d'autocomplétion disponibles **à `publishedAt`**, avec la même fenêtre de huit jours, uniquement après validation complète du reçu `preuves/publication.json` (Markdown, manifeste et inventaire de tous les fichiers du dossier). Le simple vieillissement du relevé ne bloque donc pas une PR étrangère à ces articles. Un sceau rompu, un nouveau candidat ou un titre modifié reste contrôlé avec un relevé frais et échoue fermé ; sources, claims, revue métier et autres contrôles du dossier restent actifs. Cette conservation ne certifie pas une nouvelle mesure SEO ni un nouveau fact-check : rafraîchir réellement les relevés et revalider une republication reste une opération éditoriale distincte.

Limite : les fichiers de relevé résident hors du reçu de publication ; le sceau garantit les octets de l'article et de son dossier, pas ceux du relevé historique. Modifier un relevé ancien peut modifier le résultat de ce contrôle sans casser le sceau. La preuve d'autocomplétion elle-même devra être liée cryptographiquement au reçu lors d'une évolution du format de publication, sans retoucher rétroactivement les articles publics.

```bash
npm run blog:audit
npm run blog:gate -- <slug>
```

`blog:audit` vérifie aussi les empreintes SHA-256 des articles historiques dans `editorial/legacy-baseline.json`. Modifier ou supprimer un article historique sans dossier éditorial complet fait échouer le build.

Le gate refuse notamment :

- les preuves SERP ou GSC `ND`/`FAIL` ;
- un frontmatter divergent du manifeste, un H1 dans le corps ou un saut de niveau ;
- une unité du rendu absente de l’inventaire des affirmations, une affirmation non vérifiée, un lien sortant ou deux liens entrants absents ;
- une requête primaire + intention déjà attribuées dans le corpus sans arbitrage structuré de consolidation/différenciation relié aux deux URL ;
- un skill applicable non joué, en échec ou sans artefact ;
- une URL source qui résout, avant le premier fetch ou après une redirection, vers une plage du registre IANA des adresses spéciales IPv4/IPv6, y compris `192.88.99.0/24` ; les IP publiques ordinaires restent autorisées ;
- une source `tier-4`, `tier-5` ou `echo` dans le candidat, ainsi que Medium, Reddit, Substack, WordPress, Quora et Hacker News. Les champs de qualité, l’amont primaire et, le cas échéant, les éléments de méthode doivent concorder entre le manifeste, la preuve issue de l’URL ouverte et la preuve de classification relue. Une source `secondary` doit nommer un amont distinct ; une source `primary` doit rejoindre son URL finale vérifiée. Le garde déterministe refuse les incohérences domaine↔éditeur et ne reconnaît l’officialité que pour un registre borné d’autorités françaises connues. Un claim paie/social/DSN/fiscal/juridique/RGPD exige cette reconnaissance, une provenance primaire et un niveau `tier-1` à `tier-3` : `official: true` seul n’ouvre jamais le gate. `original-method` reste admis pour une méthode transparente hors de ce régime réglementaire ;
- une image uniforme, sans preuve de génération/grille visuelle, non approuvée, mal dimensionnée, non déclarée dans `src/data/images.mjs` ou sans dérivés publics AVIF/WebP. Le garde déterministe refuse aussi les alt manifestement non descriptifs : placeholder, nom de fichier, libellé générique, répétition, suite alphabétique/clavier ou chaîne monobloc manifestement factice ;
- une matière paie/social/DSN/fiscal/juridique/légale/réglementaire, ou une assertion normative métier, sans `blog-factcheck` `RUN`/`PASS`, claims exhaustifs sourcés et revue métier `PASS` distincte reliée au candidat exact. La preuve métier contient exactement un verdict par couple claim/source : `soutient`, `soutient_partiellement`, `contredit` ou `hors_sujet`. Seul `soutient` ouvre le gate ; chaque verdict est lié au slug et aux SHA-256 du Markdown, du claim, de la copie source et de la citation. La sensibilité est recalculée depuis le texte rendu, les métadonnées visibles, le cluster, les rôles et les types de claims : un type générique ne peut pas la neutraliser. Pour ces matières, en mode production, la revue éditoriale doit porter le jour civil Europe/Paris du gate ; sa preuve, la revue métier, le skill de fact-check et sa preuve, chaque claim, son fact-check et chaque résultat source doivent porter ce même jour. La récupération vérifiée de chaque source peut dater de 0 à 7 jours civils avant la revue, bornes incluses : sa preuve conserve exactement la date de récupération déclarée, calculée en Europe/Paris depuis l’instant UTC réel du fetch, et `sourcesVerifiedAt` date la plus ancienne récupération. Cette fenêtre ne reporte ni la revue ni les claims ni le fact-check : en mode production, le candidat redevient bloqué le lendemain jusqu’à une nouvelle vérification. Les fixtures de test prélèvent ce jour à la création du dossier (pas à l'import du module) et conservent l'instant UTC réel du fetch ; une date UTC seule ne suffit pas à la frontière de minuit Paris ;
- Pour une unité liée à une source et marquée uniquement `rgpd`, la mention de la CNIL ou de données personnelles impose toujours un claim vérifié et une source officielle primaire, mais pas un `claim.type` juridique si le texte ne porte aucune formulation d'obligation. Une recommandation attribuée (« conseille », « ne devraient ») peut rester `information` ; « doit », « obligation », « interdit » et les autres formulations contraignantes, ainsi que toute autre famille sensible détectée dans la même unité, conservent l'exigence d'un type sensible canonique. Ce filtre lexical ne tranche pas la portée juridique d'une citation : la revue métier reste requise et peut refuser le claim ;
- Le corps signé `corps.md` peut commencer par un unique H1 identique au titre de la recette : la forge le retire avant le rendu, puis le gate compare le corps rendu après cette seule extraction. Un H1 divergent et toute phrase modifiée conservent le refus ; les revues indépendantes restent obligatoires ;
- une revue sous 90/100 ou contenant un P0 ;
- l’absence du go de Kevin sur le brief.

Les rapports sont écrits sous `.qa/blog/` et restent des artefacts locaux.

Limites assumées : le registre domaine↔éditeur est volontairement borné et doit être étendu par code et tests avant d’admettre une nouvelle autorité ; un domaine officiel légitime absent est donc refusé en matière sensible plutôt qu’accepté par déclaration. La preuve de classification impose une seconde identité mais reste une attestation locale non signée : elle ne prouve pas l’identité civile du relecteur. Le garde déterministe peut aussi refuser une citation légitime courte ou un passage unique qui soutient plusieurs formulations ; il faut alors citer des passages distincts ou consolider les claims. Il ne détecte qu’un sous-ensemble explicite des contradictions lexicales : le verdict du reviewer métier distinct reste obligatoire et seul décisionnaire du support. De même, le garde d’alt ne juge pas la sémantique complète d’une image et ne remplace pas une analyse linguistique : le critère humain `alt-information` reste obligatoire pour vérifier le sujet et le mécanisme. Les revues métier, la provenance image et leurs scores restent des attestations locales déclaratives, non signées cryptographiquement. La fixture de rendu fabrique avec Sharp une image abstraite portant une coche pour éprouver le pipeline ; elle ne constitue ni une sortie réelle de `image_generate`, ni une preuve de conformité à la direction artistique Memlia.

## Construire la preview privée

```bash
npm run blog:preview -- <slug>
```

La commande rejoue le gate, construit uniquement le brouillon ciblé via `BLOG_PREVIEW_SLUG`, puis copie le résultat dans `.qa/preview-dist/<slug>/`. Elle vérifie :

- le témoin visible « Candidat éditorial — preview privée, non publiable » ;
- la meta HTML `noindex, nofollow` ;
- l’en-tête `X-Robots-Tag: noindex, nofollow` ;
- l’absence du candidat dans le sitemap et le RSS.

Déploiement Cloudflare distinct, après succès local :

```bash
npx wrangler pages deploy .qa/preview-dist/<slug> \
  --project-name memlia \
  --branch preview-blog-<slug>
```

Après déploiement, relire l’URL exacte et ses en-têtes avant de produire les captures 320, 375, 768, 1024, 1440 et 1920 px. Une URL de preview n’est jamais une preuve de publication ni d’indexation.

## Produire le dossier de revue

```bash
npm run blog:review -- <slug>
```

La commande recalcule le gate et écrit `.qa/blog/<slug>/review-package.md`, avec la taille et le SHA-256 de chaque artefact. L’URL Cloudflare, les preuves HTML/HTTP, les captures et les résultats de tests restent à joindre au rapport.

## Vérifier un candidat autorisé pour la production

L'autorité blog-only du 25/09/2026 supprime le go individuel de Kevin pour un article de blog ; elle ne permet ni d'inventer ses propos ni de modifier sans preuve un corps signé. L'opérateur trace son identité réelle et un reçu de contrôle lié aux octets exacts, puis suit les gates automatiques et la QA indépendante au SHA final :

1. utiliser la forge pour passer le candidat à `editorialStatus: "go-production"` sous cette autorité existante. Le champ historique `kevin.productionApproved: true` est généré par la forge à partir de la délégation du 16/09 (voir `construireManifest`), uniquement pour compatibilité avec les validateurs et sceaux existants : **il n'atteste ni clic ni nouvelle signature ni revue personnelle de Kevin**. Ne pas le fabriquer manuellement ; le reçu opérateur garde l'identité de l'exécutant et l'empreinte de l'article ;
2. vérifier que le frontmatter émis par la forge porte `statutEditorial: go-production` et `brouillon: false` sans modifier manuellement l'article signé ;
3. exécuter :

```bash
npm run blog:production-check -- <slug>
```

Le contrôle reconstruit sans `BLOG_PREVIEW_SLUG`, refuse tout `noindex`, exige la canonical auto-référente et vérifie l’inclusion dans le sitemap et le RSS. Pendant ce contrôle, la route est publique dans le build local mais le sceau de publication n'existe pas encore : le test d'intention exige alors un relevé frais du jour, sans prétendre que le candidat est déjà scellé. Après `publier`, il compare la date du sceau et ses octets. Il ne pousse rien et ne déploie rien en production.

### Lot de rattrapage (sans antidater)

Pour publier plusieurs articles dans un **même commit de contenu**, ne pas appeler `blog-forge publier` sur le premier pendant que les autres restent brouillons : `production-check` exécute `build:site` sur le site entier, et les liens/sorties du lot ainsi que l'oracle de cadence exigent le lot complet. Dans une branche de contenu isolée, après les revues indépendantes et les reçus opérateur attachés aux octets exacts des candidats sous l'autorité blog-only existante :

1. Matérialiser **tous** les candidats via la forge au statut `go-production` avec leur vraie `datePublication` (29/09/2026 pour le lot W39 du 29) et `brouillon: false` ; les champs de compatibilité hérités ne sont pas une nouvelle approbation personnelle. Ne pas toucher au corps signé si un gate éditorial le refuse.
2. Faire `node scripts/seo/forge-seo.mjs registre reconcilier --date 2026-09-29` **dans cette branche seulement**. La commande lit les frontmatters localement non-brouillons, insère les requêtes manquantes, préserve les entrées existantes et refuse les collisions de requête ; vérifier le diff et la provenance avant de poursuivre. C'est une anticipation de registre **local**, pas une attestation de mise en ligne. Si un contrôle échoue, corriger le lot ou retirer ces entrées anticipées avant livraison. Ne pas committer ce registre dans une PR technique seule.
3. Exécuter `npm run blog:production-check -- <slug-1> <slug-2> <slug-3>` : chaque candidat doit passer le gate `production` et satisfaire le champ de compatibilité issu de la forge, puis un **seul** `build:site` vérifie toutes les pages, canonical, sitemap et RSS. Un slug absent ou un autre gate du site rouge arrête la livraison ; ne pas neutraliser `build:site`.
4. Seulement après succès, finaliser les dossiers par `blog-forge publier` pour chaque slug, recontrôler les trois sceaux, réconcilier le registre et `npm run lastmod:sync && npm run build`. La commande unitaire recontrôle le site entier ; l'état projeté des autres candidats doit rester intact. Relire le diff final : la présence de `publieLe` dans Git ne prouve pas un déploiement. PR, CI au SHA exact, puis contrôle HTTP du SHA déployé et des trois URL restent obligatoires.

Le plan W39 garde les créneaux des 22, 24 et 26 septembre et affiche la date réelle du 28 ou du 29 septembre selon les frontmatters. Aucune entrée du 30 septembre ou d'un autre sujet ne bénéficie de l'exception. `tests/proof/test_build.py` dérive la liste des pages attendues des frontmatters non-brouillons plutôt que d'un inventaire historique figé ; cela n'autorise pas une page sans revue et sans reçu technique : les gates éditoriaux et le contrôle de production restent distincts.

## Garde-fou pSEO

Aucune page programmatique n’est générée par ce pipeline. Une extension future exige avant code : dataset fiable, intention distincte par page, valeur unique, contrôle du contenu mince et lancement par lots soumis à validation humaine.
