# Pipeline éditorial du blog

Ce pipeline prépare un candidat par jour au maximum. Il ne publie rien : un article reste `brouillon: true` jusqu’au go explicite de Kevin, et seule la production validée passe à `brouillon: false`.

## Créer un candidat

```bash
npm run blog:create -- <slug> "<titre de travail>" [AAAA-MM-JJ]
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
- une matière paie/social/DSN/fiscal/juridique/légale/réglementaire, ou une assertion normative métier, sans `blog-factcheck` `RUN`/`PASS`, claims exhaustifs sourcés et revue métier `PASS` distincte reliée au candidat exact. La preuve métier contient exactement un verdict par couple claim/source : `soutient`, `soutient_partiellement`, `contredit` ou `hors_sujet`. Seul `soutient` ouvre le gate ; chaque verdict est lié au slug et aux SHA-256 du Markdown, du claim, de la copie source et de la citation. La sensibilité est recalculée depuis le texte rendu, les métadonnées visibles, le cluster, les rôles et les types de claims : un type générique ne peut pas la neutraliser. Pour ces matières, la date du gate, la revue éditoriale, sa preuve, la revue métier, le skill de fact-check, chaque source, chaque claim et chaque résultat source doivent tous porter le même jour UTC ; le candidat redevient donc bloqué le lendemain jusqu’à une nouvelle vérification ;
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

Kevin reste le seul décideur. Après son go explicite sur le candidat exact :

1. passer `manifest.json` à `editorialStatus: "go-production"` et `kevin.productionApproved: true` ;
2. aligner le frontmatter sur `statutEditorial: go-production` et `brouillon: false` ;
3. exécuter :

```bash
npm run blog:production-check -- <slug>
```

Le contrôle reconstruit sans `BLOG_PREVIEW_SLUG`, refuse tout `noindex`, exige la canonical auto-référente et vérifie l’inclusion dans le sitemap et le RSS. Il ne pousse rien et ne déploie rien en production.

## Garde-fou pSEO

Aucune page programmatique n’est générée par ce pipeline. Une extension future exige avant code : dataset fiable, intention distincte par page, valeur unique, contrôle du contenu mince et lancement par lots soumis à validation humaine.
