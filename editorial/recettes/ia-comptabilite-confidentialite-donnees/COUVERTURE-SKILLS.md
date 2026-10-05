# Couverture Blog / SEO : ia-comptabilite-confidentialite-donnees

**État : inventaire et lectures, avant preuves de rédaction.** Aucun verdict éditorial, métier ou de publication. Instantané référencé au 05/10/2026, 08:44:53 UTC ; contrôle du dossier effectué de nouveau avant livraison.

## Résultat et portée

- **63 compétences uniques couvertes, 65 SKILL.md lus intégralement** : les deux racines, les sous-skills et toutes les extensions SEO trouvées. Les miroirs `seo-dataforseo` et `seo-image-gen` ont chacun deux fichiers, lus séparément et d'empreintes différentes.
- **32 `a-executer`, 28 `N/A` motivés, 3 `indisponible`**. Tous les SKILL.md ont `lecture_etat: lu`. Aucune lecture n'est un `execute`, RUN ou PASS d'article.
- Confrontation : catalogue Hermes archivé fourni, 56 noms Blog/SEO ; registre technique 31 sous-skills Blog et 24 SEO ; union des packs sans omission. Sept absents du catalogue : `blog-audio`, `blog-notebooklm`, `seo-ahrefs`, `seo-bing`, `seo-profound`, `seo-seranking`, `seo-unlighthouse`. Aucun ajout au manifeste technique.
- À l'inspection initiale, dossier recette cible absent et aucune occurrence cible dans `editorial/articles`. Au contrôle après écriture, seuls les deux JSON de cette délégation existaient dans la recette. Aucun corps, recette, rejeu, image, rendu ou reçu servable auquel attribuer une exécution. Cela décrit le workspace, **pas un constat HTTP** ni les futurs travaux de l'auteur.
- Le brief §3 et ses sources projetées sont du **contexte**. Ils ne sont pas des preuves de rédaction, d'ouverture actuelle des sources ou de maillage réalisé.

Fichiers de référence : [catalogue-lectures.json](catalogue-lectures.json), [couverture-skills.json](couverture-skills.json). Le JSON de couverture est l'autorité pour motifs, constats, changements/maintien et commandes détaillées. Les tableaux ci-dessous en sont une vue lisible, pas une revue.

### Provenance des lectures

La colonne **Lecture** désigne le JSON Pointer `/lectures/N` dans le catalogue. Chaque tuple contient : nom, racine, chemin relatif, SHA-256 et plage de lignes intégralement lue. Le chemin absolu est `racines[tuple[1]] + '/' + tuple[2]`. Les deux racines sont :

- Blog : `/Users/kevinkitanga/hermes/packs/claude-blog`
- SEO : `/Users/kevinkitanga/hermes/packs/claude-seo`

Les 65 empreintes enregistrées ont été vérifiées par `shasum -a 256 --check` : toutes OK, exit 0. Les lectures complémentaires précises figurent séparément dans le catalogue : référence charge cognitive, synthèse locale Google AI, gabarit how-to-guide, signatures CLI, brief, registres et modèle de matrice. **Pas de lecture ou d'exécution exhaustive revendiquée pour toutes les références/templates/scripts transitifs.** La synthèse locale Google ne remplace pas une réouverture actuelle de sa source primaire.

Le catalogue archivé tient sur une longue ligne que `read_file` tronque ; ses noms ont ensuite été extraits exactement par `jq`. Pas de prétention d'avoir relu toutes les descriptions hors périmètre ni d'avoir appelé un nouveau `skills_list`.

## Matrice Blog

Chaque ligne concerne uniquement ce slug. `preuves: []` partout : les artefacts futurs ne sont pas attestés.

| Skill | Lecture | Phase | État | Application restante ou motif N/A |
|---|---:|---|---|---|
| blog | 0 | Orchestration | a-executer | Six piliers et preuves de fiche d'entrée, sans expérience/chiffres inventés. |
| blog-analyze | 1 | Qualité / revue normale | a-executer | Texte et HTML absents ; CLI testée seulement par help, jugement français et revue métier futurs. |
| blog-audio | 2 | Périmètre | N/A | Guide écrit, narration/podcast/TTS non mandatés. |
| blog-audit | 3 | Existant / graphe | a-executer | Contrôler voisins, liens et orphelinage de cette page ; pas audit global neuf exigé. |
| blog-brand | 4 | Charte | a-executer | Vérifier nous/vous, promesses bornées et distinction avec /garanties ; pas nouveau BRAND.md. |
| blog-brief | 5 | Brief | a-executer | Brief §3 lu, application à la recette et aux mesures finales non prouvée. |
| blog-calendar | 6 | Réservation | a-executer | Vérifier backlog source, vrai créneau et quota ; brief ne réserve rien. |
| blog-cannibalization | 7 | Intentions | a-executer | Frontières avec prompt et grille logiciel à confronter au corpus ; pas overlap SERP mesuré. |
| blog-chart | 8 | Médias | N/A | Fiche/table décisionnelles et écrans fictifs, pas série statistique à tracer. |
| blog-cluster | 9 | Architecture | a-executer | Satellite rgpd-secret-securite et liens IA dans cluster existant, pas génération de nouveau cluster. |
| blog-decay | 10 | Maintenance | N/A | Nouvelle URL sans deux périodes historiques comparables ; pas trafic zéro fabriqué. |
| blog-discourse | 11 | Recherche | N/A | Guide evergreen documentaire ; pas engagement/sentiment social, Apify exclu par brief. |
| blog-factcheck | 12 | Sources / claims | a-executer | Réouvrir CNIL/doc fournisseur exact ; préserver contexte et limites, puis revue métier. |
| blog-flow | 13 | Prompts | N/A | Brief/workflow fixés, pas activation ou sync FLOW supplémentaire nécessaire. |
| blog-geo | 14 | Citabilité / rendu | a-executer | Entités, réponses autonomes et sources dans vrai HTML ; score non probabiliste. |
| blog-google | 15 | Mesures | indisponible | Aucune donnée propre au slug rattachable ; credentials Blog non testés, métriques inconnues. |
| blog-image | 16 | Médias | a-executer | Vraie couverture Higgsfield et figures HTML, provenance/inspection futures. |
| blog-locale-audit | 17 | Langues | N/A | Pas de série traduite ou de parité multilingue. |
| blog-localize | 18 | Langues | N/A | Original français, pas adaptation d'une traduction à un autre marché. |
| blog-multilingual | 19 | Langues | N/A | Une seule langue mandatée, pas pipeline international. |
| blog-notebooklm | 20 | Recherche | N/A | Sources publiques directes ; aucun notebook fourni/requis. |
| blog-outline | 21 | Plan | a-executer | How-to-guide et plan §3 à matérialiser : fiche, classes, conditions outil, règle et rejeu. |
| blog-persona | 22 | Voix | a-executer | Lisibilité pour dirigeant/sécurité et charte sur texte final ; pas nouveau persona dans le pack. |
| blog-repurpose | 23 | Distribution | N/A | Pas diffusion sociale/mail/vidéo autorisée ; arrêt LinkedIn/mail conservé. |
| blog-rewrite | 24 | Rédaction | N/A | Nouveau guide, pas réécriture/republication d'un ancien texte cible. |
| blog-schema | 25 | HTML / entités | a-executer | Vérifier stack native, auteur/dates/URLs et contenu visible, sans FAQ rich result promis. |
| blog-seo-check | 26 | On-page | a-executer | Contrôler metadata, H1-H3, canonical, liens, OG, images et JSON-LD sur HTML réel. |
| blog-strategy | 27 | Positionnement | a-executer | Valeur propre préparation des entrées, sans succès SEO attribué aux pages récentes. |
| blog-style | 28 | Voix / charge | a-executer | Charte + cognitive_load séparé ; apprentissage corpus seulement si besoin. |
| blog-taxonomy | 29 | Famille | a-executer | rgpd-secret-securite dans vraie recette, pas nouvelle archive ou sync CMS. |
| blog-translate | 30 | Langues | N/A | Original français uniquement, aucune langue cible demandée. |
| blog-write | 31 | Rédaction / rejeu | a-executer | Auteur doit livrer fiche complète et quatre sorties fictives réellement rejouées ; aucune rédaction ici. |

## Matrice SEO

| Skill | Lecture | Phase | État | Application restante ou motif N/A |
|---|---:|---|---|---|
| seo | 32 | Orchestration | a-executer | Launcher canonique ; runtime doctor non prêt ; application au candidat future. |
| seo-audit | 33 | Synthèse technique | a-executer | Agréger contrôles applicables à cette page ; pas crawl 500 URLs ni health score simulé. |
| seo-backlinks | 34 | Mesure après publication | indisponible | Aucun backlink de la nouvelle URL vérifié ; liens internes ≠ liens externes acquis. |
| seo-cluster | 35 | Intentions / SERP | a-executer | Contrôler frontières du satellite ; architecture prévue ≠ overlap top-10 mesuré. |
| seo-competitor-pages | 36 | Format | N/A | Pas X vs Y, alternative ou classement d'éditeurs ; conditions d'environnement ≠ comparaison commerciale. |
| seo-content | 37 | Qualité / E-E-A-T | a-executer | Who/How/Why et claims sur texte final ; pas credential métier ou origine IA inférés. |
| seo-content-brief | 38 | Brief SEO | a-executer | Recherche/intent/site réel et valeur propre ; conventions Memlia priment sur quotas pack. |
| seo-dataforseo | 39 + 63 | Provider | N/A | Achat de données/API premium non requis, outils exposés mais pas appelés ; variantes divergentes lues. |
| seo-drift | 40 | Maintenance | N/A | Pas baseline servi antérieur ; pas comparaison drift à fabriquer pour URL nouvelle. |
| seo-ecommerce | 41 | Surface | N/A | Ni Merchant Center, produit/offer, marketplace ni UCP. |
| seo-flow | 42 | Prompts | N/A | Pas activation/sync FLOW supplémentaire ; provenance couverte dans autres contrôles. |
| seo-geo | 43 | Citabilité / accessibilité | a-executer | Contrôler vraie page et bots search/training distincts ; ne pas imposer bandes de mots ni llms.txt. |
| seo-google | 44 | Mesures | indisponible | Doctor exit 3, aucune GSC/GA4/CWV du slug ; credentials non testés, pas zéro présumé. |
| seo-hreflang | 45 | Langues | N/A | Pas alternates, une seule version française ; lang reste contrôle seo-page. |
| seo-image-gen | 46 + 64 | Provider image | N/A | Pipeline Gemini/banana non choisi ; Higgsfield + figures HTML selon Memlia, besoin médias reste applicable ailleurs. |
| seo-images | 47 | Médias / rendu | a-executer | Vérifier vrais actifs, alt, dimensions, poids, responsive et LCP, aucune variante portrait des figures. |
| seo-local | 48 | Intention | N/A | Guide documentaire national, pas near-me/GBP/page ville. |
| seo-maps | 49 | Intention | N/A | Pas rayon/établissement/geo-grid ; GEO citation ≠ Maps. |
| seo-page | 50 | HTML / servi | a-executer | Vraies metadata/structure/schema/canonical, d'abord local puis URL publiée ; runtime à réparer. |
| seo-plan | 51 | Stratégie | a-executer | Réconcilier plan source et KPI existants ; aucune nouvelle stratégie annuelle ou métrique fabriquée. |
| seo-programmatic | 52 | Volume | N/A | Guide original unique, pas lot de pages dérivées d'enregistrements. |
| seo-schema | 53 | JSON-LD | a-executer | Syntaxe @graph et entités cohérentes avec le visible, pas données de contact/avis inventées. |
| seo-sitemap | 54 | Publication technique | a-executer | Inclusion réelle sitemap/RSS/index, HTTP 200 et canonical après intégration. |
| seo-sxo | 55 | Intent / utilité | a-executer | Fiche répond au besoin sécurité, pas grille logiciel ; ni consensus ni score persona mesurés ici. |
| seo-technical | 56 | Rendu / indexabilité | a-executer | Mobile, texte visible, canonical/robots/liens/statut ; labo ≠ CWV terrain. |
| seo-ahrefs | 57 | Provider | N/A | Données premium/redondantes non requises ; fichier hors catalogue, auth/connexion non testés. |
| seo-bing | 58 | Provider indexation | N/A | Aucune soumission IndexNow/comparaison Bing mandatée ; option à réévaluer après publication. |
| seo-firecrawl | 59 | Provider crawl | N/A | Astro statique et outils natifs/Hermes suffisants, pas crawl tiers payant nécessaire. |
| seo-profound | 60 | Monitoring | N/A | Pas série continue de citations de marque mandatée ; aucun compte ni pourcentage créé. |
| seo-seranking | 61 | Monitoring | N/A | Pas share-of-voice multiengine premium demandé ; aucune observation assistant simulée. |
| seo-unlighthouse | 62 | Labo multipage | N/A | Audit entier multipage non requis ; contrôle page natif et mesure CWV restent ouverts ailleurs. |

## Commandes utilisables pour les prochaines phases

**Ces commandes sont proposées, non exécutées sur l'article.** Seuls les trois `--help` Blog et `doctor` SEO ont été exécutés dans cette délégation. Sauvegarder ensuite sortie brute, exit code, date, chemin et SHA de l'entrée réellement analysée. Ne jamais rattacher au nouveau slug les anciens PASS d'un autre article.

Depuis `/Users/kevinkitanga/.hermes/kanban/workspaces/t_afe116b0/site`, une fois `corps.md` réellement créé :

```bash
CORPS="editorial/recettes/ia-comptabilite-confidentialite-donnees/corps.md"
python3 /Users/kevinkitanga/hermes/packs/claude-blog/scripts/cognitive_load.py "$CORPS" --format json
```

Le jargon par défaut et plusieurs marqueurs syntaxiques sont anglais. `--jargon <fichier-francais-reel>` peut ajouter du vocabulaire pertinent, sans rendre tout l'analyseur francophone. Le score guide une lecture humaine ; il ne prouve pas conformité ni qualité du français. `blog-style` concerne d'abord la voix : si un apprentissage est utile, fournir 5 à 10 vrais textes du même auteur à `style_learn.py`, sans fabriquer de corpus.

Après construction, définir `HTML` avec le **vrai chemin du HTML complet du candidat exact** :

```bash
python3 /Users/kevinkitanga/hermes/packs/claude-blog/scripts/analyze_blog.py "$HTML" --format json
python3 /Users/kevinkitanga/hermes/packs/claude-blog/scripts/ai_citation_score.py "$HTML" --format json --engine all
```

- `analyze_blog.py --help` annonce une dégradation : **textstat absent**. Ne pas installer globalement dans ce mandat.
- Les options `--rubric` et `--cognitive-load` figurent dans SKILL.md mais **pas dans cette CLI**. Ne pas les ajouter à la commande ; exécuter cognitive_load séparément.
- Le corps sans frontmatter ne contient ni metadata finale ni schema injecté. Ne pas transformer leur absence dans le Markdown en défaut du HTML sans contrôler le rendu.
- Le score GEO est une **heuristique non calibrée**, pas une probabilité ni une observation de citations ChatGPT/Perplexity/Google.

### SEO : diagnostic et prérequis bloquant

```bash
SEO="/Users/kevinkitanga/hermes/packs/claude-seo/scripts/claude-seo"
"$SEO" doctor --json
```

Résultat réel de cette session : **exit 3**, `ready: false`, `browser_ready: true`, `mode: manual`, `plugin_version: 2.3.1`, `python_version: 3.13`, causes `requirements_sha256 changed` et `python changed`. **Aucune réparation automatique.** Une réparation explicite est à autoriser séparément ; pas de fallback avec Python global pour les scripts SEO.

Après réparation autorisée et diagnostic prêt :

```bash
"$SEO" run parse_html.py "$HTML" --json
"$SEO" run metadata_template.py --title '<tabTitle-reel>' --description '<description-reelle>' --json
"$SEO" run google_auth.py --check --json
```

Les arguments de `parse_html.py` ont été consultés : fichier positionnel, `--url` pour base et `--json`. Le runtime n'a pas permis de tester ces analyses. Ne pas utiliser `content_humanize.py` automatiquement sur des citations exactes : il normalise des espaces et peut modifier les octets probants.

Après autorisation des mesures et, pour les vérifications de page, après publication réelle :

```bash
URL="https://memlia.fr/blog/ia-comptabilite-confidentialite-donnees"
"$SEO" run gsc_query.py --property sc-domain:memlia.fr --dimensions query,page --json
"$SEO" run gsc_inspect.py "$URL" --json
"$SEO" run pagespeed_check.py "$URL" --json
```

Ces commandes exigent le niveau d'auth approprié. Aucune absence de clé n'est affirmée puisque les secrets n'ont pas été inspectés. Distinguer données de page, origine, labo et terrain. Une absence de résultats/API n'est pas une mesure zéro. Les rapports gen-AI UI ne sont pas présumés accessibles via cette API. **Pas d'Indexing API pour un BlogPosting ordinaire.** Aucune soumission Bing/IndexNow demandée ici.

### Contrôles natifs du workspace

```bash
node scripts/seo/forge-seo.mjs liens ia-comptabilite-confidentialite-donnees
python3 docs/strategy/site-v3/build-cluster-plan.py --check
npm run test:blog-contract
npm run blog:audit
```

Les deux premières commandes sont de lecture/contrôle ; liens projetés ne deviennent pas acquis. Les gardes natifs sont des contrôles techniques, pas une revue métier. `test:blog-contract` peut contrôler tout le corpus construit : ne pas le présenter comme analyse du seul candidat si ce dernier n'existe pas encore. Les gates de préparation/publication/scellement ne sont pas exécutés dans cette délégation.

### Routage de skills, pas commandes shell

- `/blog seo-check <HTML-ou-candidat>`, `/blog geo <HTML-ou-candidat>`, `/blog factcheck <corps>`, `/blog cannibalization src/content/blog`.
- `/seo page <URL-servie>`, `/seo content <URL-servie>`, `/seo geo <URL-servie>`, `/seo schema <URL-servie>`, `/seo images <URL-servie>`, `/seo sxo <URL-servie> IA cabinet comptable confidentialité données`.

Ils décrivent les procédures à appliquer ; ce ne sont pas des exécutables Hermes ni des appels déjà réalisés. Ils ne créent **aucune seconde revue indépendante SEO**. La carte métier conserve l'unique jugement adapté sur les assertions réglementaires et la suffisance du fond.

## Écarts et décisions à conserver

1. **GEO SEO contradictoire** : le fichier seo-geo conserve des bandes 134-167 mots, règles de récence et phrase absolue sur JavaScript, alors que sa référence Google et Blog GEO refusent les recettes artificielles. Préférer utilité, fidélité des sources, crawl/indexabilité normale et contrôler le rendu réellement exposé. Aucune réécriture AI spécifique ou llms.txt comme levier Google.
2. **Miroirs divergents** : DataForSEO core inclut validation des résultats imbriqués et limites de retry, contrairement à l'extension ; conserver cette prudence. Banana extension expose fallback local/scripts alors que le miroir dit le contraire ; provider non choisi, aucune exécution revendiquée.
3. **Gabarit how-to-guide** : trame lue, mais certains passages demandent année/chiffre d'ouverture/visuels par étape. Le brief et les rails Memlia priment : pas chiffres forcés, faux gains, expérience inventée ou quotas utilisés pour fabriquer de la matière.
4. **Sensibilité métier** : pseudonymisation, caractère reconstructible et autorisation d'environnement ne sont pas prouvés par un script structurel. Les quatre cas prescrits doivent montrer leurs vraies sorties, sans prétendre certifier anonymisation/RGPD/secret. Aucun dossier réel traité.

## Vérification effectuée

Vérification `jq` sur catalogue + matrice : **65 lectures, 63 noms uniques, 63 lignes**, aucun doublon, absent, surplus, référence de lecture invalide ou ligne vide ; états 32/28/3. Confrontation catalogue/registre/archive : 31 Blog, 24 SEO, 56 exposés, sept écarts attendus, aucune entrée du catalogue/registre absente des packs. Empreintes : tous les 65 `shasum --check` OK. JSON écrits/patchés : validation syntaxique des outils Hermes OK.

Rejeu structurel sans écriture :

```bash
jq -s '.[0] as $c | .[1] as $m | {lectures:($c.lectures|length), union:($c.lectures|map(.[0])|unique|length), lignes:($m.lignes|length), absents:(($c.lectures|map(.[0])|unique)-($m.lignes|map(.skill))), surplus:(($m.lignes|map(.skill))-($c.lectures|map(.[0])|unique)), etats:($m.lignes|group_by(.etat)|map({etat:.[0].etat,nombre:length}))}' editorial/recettes/ia-comptabilite-confidentialite-donnees/catalogue-lectures.json editorial/recettes/ia-comptabilite-confidentialite-donnees/couverture-skills.json
jq -r '.racines as $r | .lectures[] | .[3] + "  " + $r[.[1]] + "/" + .[2]' editorial/recettes/ia-comptabilite-confidentialite-donnees/catalogue-lectures.json | shasum -a 256 --check
```

Ces contrôles prouvent la cohérence de l'inventaire et les octets lus, **jamais l'exécution de rédaction ou la vérité métier**. Les écritures restent limitées au catalogue et aux deux vues de couverture. Aucun fichier de l'auteur ou registre technique modifié, aucune publication, aucune revue rédigée.
