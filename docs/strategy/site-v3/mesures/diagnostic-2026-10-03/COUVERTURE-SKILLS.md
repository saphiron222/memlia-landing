# Couverture Blog / SEO — diagnostic et quatre briefs

## Résultat et périmètre

**63 entrées uniques vérifiées** : deux racines, 31 sous-skills Blog et 30 sous-skills SEO, incluant six extensions SEO hors registre de publication. Le catalogue sauvegardé contient 56 entrées Blog/SEO. Les tableaux du pipeline et `editorial/templates/skills.json` sont **identiques, ordre compris : 31 Blog et 24 SEO**.

Cette matrice décrit l'état documentaire et les preuves déjà produites pour le diagnostic. Elle **n'atteste ni rédaction, ni rendu, ni revue, ni publication**. Elle ne convertit pas une lecture de skill ou un ancien `RUN/PASS` en exécution actuelle.

Les quatre slugs concernés sont :

- `crm-dsn-rappel-annuel-et-substitution`
- `echeance-dsn-5-ou-15`
- `collecter-les-variables-de-paie`
- `manuel-de-procedures-cabinet-comptable`

À la vérification de cette livraison, `serp-2026-10-03.json`, `BRIEFS-QUATRE-ARTICLES.md`, `DIAGNOSTIC.md` et `verification.json` sont **absents**. Le parent doit actualiser les cellules après lecture de leurs résultats réels, pas à partir de leur seul nom ou existence.

### États calculés

| Périmètre | Partiel | À exécuter | Indisponible | N/A |
|---|---:|---:|---:|---:|
| Diagnostic | 26 | 10 | 6 | 21 |
| Quatre briefs / chaîne future | 0 | 39 | 0 | 24 |

`À exécuter` dans une phase rédaction, assets, rendu ou publication signifie **étape future hors livrable de cette carte**, pas prérequis pour prétendre avoir écrit un brief. Un skill peut être pertinent pour le diagnostic et N/A pour les nouveaux briefs, ou l'inverse. Les états des briefs valent pour chacun des quatre slugs tant que leurs preuves propres sont absentes.

## Sources réellement consultées

- Constitution prioritaire : `/Users/kevinkitanga/hermes/AGENTS.md`.
- Catalogue : `/Users/kevinkitanga/.hermes/profiles/marketing/cache/spillover/call_zmBJgDXhXSJYfBZWJrjA22cI.txt`, analysé avec `jq` sur le JSON entier ; la ligne géante est tronquée dans l'affichage `read_file`, pas dans le parseur.
- Tous les chemins de skills ci-dessous sont relatifs à **`/Users/kevinkitanga/hermes/packs/memlia-skills/`**. Ils ont été réellement ouverts. Racines résolues : `/Users/kevinkitanga/hermes/packs/claude-blog/skills/blog/SKILL.md` et `/Users/kevinkitanga/hermes/packs/claude-seo/skills/seo/SKILL.md`.
- Lecture structurée de toute l'union : chaque `SKILL.md` complet a été consommé par `jq -Rs`, avec extraction des descriptions, métadonnées, sections, obligations et limites. Plusieurs fichiers ont aussi été lus intégralement via `read_file`, dont les deux racines et **`blog-audio` / `blog-notebooklm`, absents du catalogue**. Cela ne signifie pas lecture intégrale ligne à ligne de tous les scripts, références et agents transitifs.
- Trace de lecture structurée : `/Users/kevinkitanga/.hermes/profiles/marketing/cache/terminal-output/out-1791062393-94405-3490.log` ; pagination utilisée sur l'affichage tronqué. Ces traces de cache peuvent être prunées : les chemins sources et états restent dans le JSON livré.
- Tableaux de publication : `scripts/lib/blog-pipeline.mjs`, lignes 17–38 ; template complet `editorial/templates/skills.json` ; documentation `docs/blog-pipeline.md` ; templates `editorial/templates/brief.md` et `editorial/templates/article.md`.
- Les 12 templates structurels Blog et leur index ont été lus ; détails et divergences ci-dessous.

**Version** : `— / pack 2.2.0` indique qu'aucune version propre n'est déclarée dans le frontmatter. Ne pas attribuer artificiellement la version de la racine au sous-skill. `seo-content-brief` déclare **1.0.0**, même s'il appartient au pack SEO **2.3.1**.

## Différences catalogue / pack / pipeline

| Différence | Entrées |
|---|---|
| Pack présent, catalogue absent | `blog-audio`, `blog-notebooklm`, `seo-ahrefs`, `seo-bing`, `seo-profound`, `seo-seranking`, `seo-unlighthouse` |
| Catalogue présent, pack absent | Aucune |
| Pipeline présent, catalogue absent | `blog-notebooklm`, `blog-audio` |
| Catalogue présent, pipeline absent | `blog`, `seo`, `seo-firecrawl` |
| Pack présent, pipeline absent | `blog`, `seo`, `seo-ahrefs`, `seo-bing`, `seo-firecrawl`, `seo-profound`, `seo-seranking`, `seo-unlighthouse` |

Les racines ne s'orchestrent pas elles-mêmes. Les six extensions SEO hors registre expliquent pourquoi la portée documentaire SEO dépasse les 24 entrées canoniques. **Ne pas les ajouter à `skills.json`** : le validateur refuse les noms hors registre. La matrice de diagnostic peut les documenter sans modifier ce contrat.

## Preuves : légende vérifiable

Tous les chemins suivants sont relatifs au dossier de ce document. Le JSON compagnon conserve leurs sélecteurs précis.

| ID | Preuves présentes et sélecteurs | Ce qu'elles ne démontrent pas |
|---|---|---|
| GSC | `gsc-28j-page.json`, `gsc-28j-page-query.json`, `gsc-7j-page.json`, `gsc-7j-page-query.json`, `gsc-date.json` : `property`, `date_range`, `fenetre`, `rows[].page/query`, `warnings`, `error` | Volume mensuel, causalité SEO, deux trimestres comparables. Lire les dates réelles, pas seulement les noms. |
| INSPECT | `gsc-inspections.json` : `inspections[].url/verdict/canonical/last_crawl_time` | Inspection de tout le corpus ou des quatre futurs slugs. |
| HTML | `live-audit.json` et `onpage-summary.json`, par `url` : canonical, headings, meta, schemaTypes, internal, bodyIncoming, images, hero | CWV, recette mobile, validation exhaustive de toutes propriétés schema ou liens. |
| LIVE | `live/robots.txt`, `live/sitemap.xml`, `live/sitemap-index.xml`, `live/sitemap-0.xml`, `live/blog-rss.xml`, `live/blog` | La présence de copies n'est pas un PASS de validation sitemap/XML ni de chaque URL. |
| ANALYZE | `blog-analyze.json` : `batch`, `count`, `results[].file/language/methodology` | Verdict métier, mesure live ou probabilité de ranking. `language=en` sur corpus français et frontmatter Astro partiellement mal interprété limitent le score. |
| STYLE | `style.json` : `per_post[].file`, paragraph_lengths, headings, first_person | Charte de marque, persona structurée, mesure lexicale française calibrée. |
| LEGACY | `legacy-skills-traces.json` : par slug, `skills.blog/seo`, `recipeProofSkills` | Exécution présente. Les anciennes déclarations RUN/PASS ne servent pas à ouvrir les cellules ci-dessous. |

Une preuve peut alimenter plusieurs contrôles, mais cela **ne prouve pas plusieurs invocations nominales** de skills. `Preuves = aucune` signifie aucune preuve d'exécution du workflow, même lorsque son fichier documentaire a été lu.

## Matrice Blog

Chaque chemin ci-dessous est le fichier réellement ouvert sous la base pack indiquée. `D` = diagnostic, `B` = quatre briefs / chaîne future. Les motifs N/A et les limites sont spécifiques au périmètre.

| Skill / chemin lu | Version propre | Phase / applicabilité | D / B | Preuves | Limite et contrôle restant |
|---|---|---|---|---|---|
| `blog/SKILL.md` | 2.2.0 | Diagnostic + briefs, applicable | partiel / à exécuter | GSC, HTML, ANALYZE, STYLE | Orchestration lue, pas audit complet. Synthèse et quatre briefs à finaliser ; écrire/rendre/publier futurs. |
| `blog-analyze/SKILL.md` | — / pack 2.2.0 | Diagnostic + validation future, applicable | partiel / à exécuter | ANALYZE | Anglais/frontmatter mal calibrés. Séparer défaut réel/artefact ; analyse des articles après rédaction. |
| `blog-audio/SKILL.md` | 2.2.0 | Audio, N/A | N/A / N/A | aucune | Pas de narration demandée ; read_file intégral, pas TTS ni clé testée. Réouvrir uniquement si audio demandé. |
| `blog-audit/SKILL.md` | — / pack 2.2.0 | Diagnostic + validation future, applicable | partiel / à exécuter | ANALYZE, HTML, GSC | Rapport global absent, sources/CWV incomplets. Consolider orphelins, recouvrement et fraîcheur matérielle. |
| `blog-brand/SKILL.md` | — / pack 2.2.0 | Cadrage + briefs, applicable | à exécuter / à exécuter | aucune | Pas de BRAND/VOICE créés. Appliquer `.agents/product-marketing.md`, service dans outils existants et interdits ; ne pas redéfinir charte. |
| `blog-brief/SKILL.md` | — / pack 2.2.0 | Briefs, applicable | N/A / à exécuter | aucune | Briefs absents. Requête, intention, concurrents observés, gain précis, sources, plan, liens, CTA, assets prévus, maintenance. |
| `blog-calendar/SKILL.md` | — / pack 2.2.0 | Planification, applicable | à exécuter / à exécuter | aucune | Quatre slugs ne prouvent ni calendrier ni saisonnalité. Proposer ordre fondé sur besoin/source/SERP, sans annoncer publication. |
| `blog-cannibalization/SKILL.md` | — / pack 2.2.0 | Diagnostic + briefs, applicable | partiel / à exécuter | GSC, HTML | Pas matrice complète/intersection SERP. Comparer requête + intention des quatre sujets et CRM/bulletins/suivi social existants ; arbitrage par URL. |
| `blog-chart/SKILL.md` | — / pack 2.2.0 | Assets quantitatifs, N/A | N/A / N/A | aucune | Pas dataset original ni chart demandé. Tableau de procédure ≠ exécution chart ; réévaluer si données sourcées justifient graphique. |
| `blog-cluster/SKILL.md` | 2.2.0 | Architecture + briefs, applicable | partiel / à exécuter | HTML, GSC | Maillage observé, pas plan/overlap calculé. Fixer hub/spoke et frontières ; cluster execute hors carte. |
| `blog-decay/SKILL.md` | — / pack 2.2.0 | Diagnostic/maintenance, applicable existant | indisponible / N/A | GSC | 7j imbriqués dans 28j, pas QoQ. Obtenir périodes comparables ; nouveaux briefs sans historique : N/A decay. |
| `blog-discourse/SKILL.md` | — / pack 2.2.0 | Recherche/briefs, applicable | à exécuter / à exécuter | aucune | Pas collecte 30j. Lecture publique distincte de distribution arrêtée ; questions datées si utilisées, jamais autorité réglementaire. |
| `blog-factcheck/SKILL.md` | — / pack 2.2.0 | Claims/briefs + validation future, applicable | à exécuter / à exécuter | aucune | Lien présent ou ancien RUN ≠ support claim. Sources officielles datées, citations, exceptions ; revue métier distincte ultérieure. |
| `blog-flow/SKILL.md` | 2.2.0 | Find/Optimize, applicable | à exécuter / à exécuter | aucune | Méthode lue, pas prompt exécuté. Relier observation/hypothèse/dépendance/indicateur/test d'échec ; Win externe N/A. |
| `blog-geo/SKILL.md` | — / pack 2.2.0 | Citabilité/briefs, applicable | partiel / à exécuter | ANALYZE, HTML, LIVE | Readiness ≠ citation mesurée. Sources traçables, réponses utiles, entités CRM/DSN distinctes ; contrôle article futur. |
| `blog-google/SKILL.md` | 2.2.0 | Performance/indexation, applicable | partiel / à exécuter | GSC, INSPECT | Pas CrUX/PSI/GA4/Ads. Fenêtres et faible signal à interpréter ; aucune preuve d'invocation wrapper ; Indexing API blog ordinaire N/A. |
| `blog-image/SKILL.md` | 2.2.0 | Plan assets puis production future, applicable | N/A / à exécuter | aucune | Pas génération des quatre sujets. Brief image/alt à prévoir ; image_generate, provenance et dérivés en rédaction future seulement. |
| `blog-locale-audit/SKILL.md` | 2.2.0 | International, N/A | N/A / N/A | aucune | Monolingue France, aucune traduction à comparer ; maintenir lang=fr. |
| `blog-localize/SKILL.md` | 2.2.0 | International, N/A | N/A / N/A | aucune | Sujets France natifs, pas adaptation depuis traduction ; références françaises restent à sourcer. |
| `blog-multilingual/SKILL.md` | 2.2.0 | International, N/A | N/A / N/A | aucune | Aucune seconde langue ni orchestration multilingue ; ne pas fabriquer versions/hreflang. |
| `blog-notebooklm/SKILL.md` | 2.2.0 | Notebook, N/A | N/A / N/A | aucune | Sources primaires lues directement, pas notebook demandé ; read_file intégral, ni auth ni requête. Réponse notebook ≠ vérité. |
| `blog-outline/SKILL.md` | — / pack 2.2.0 | Briefs, applicable | N/A / à exécuter | aucune | Plans/SERP absents. H2/H3 guidés par intention, sources et lacunes observées, sans rédiger article. |
| `blog-persona/SKILL.md` | — / pack 2.2.0 | Lecteur/ton des briefs, applicable | partiel / à exécuter | STYLE | Profil ≠ persona JSON. Fixer rôle, tâche et expertise ; charte prioritaire, aucune écriture dans skill. |
| `blog-repurpose/SKILL.md` | — / pack 2.2.0 | Distribution, N/A | N/A / N/A | aucune | Pas variantes social/mail/vidéo et canaux arrêtés. Ne pas réactiver ni imposer leur exécution. |
| `blog-rewrite/SKILL.md` | — / pack 2.2.0 | Rédaction future, applicable aux corrections existantes | à exécuter / N/A | ANALYZE, HTML | Aucune réécriture effectuée ; nouveaux sujets = briefs. Recommander corrections substantielles sans modifier corps existant. |
| `blog-schema/SKILL.md` | — / pack 2.2.0 | Plan schema + rendu futur, applicable | partiel / à exécuter | HTML | Types présents ≠ validation complète. Plan entités et concordance visible ; JSON-LD final après rédaction, pas promesse FAQ rich result. |
| `blog-seo-check/SKILL.md` | — / pack 2.2.0 | Diagnostic/briefs puis validation, applicable | partiel / à exécuter | HTML | Pas checklist PASS nouveau contenu. Titres/meta/canonical/liens/alt prescrits puis contrôle Markdown/HTML réel futur. |
| `blog-strategy/SKILL.md` | — / pack 2.2.0 | Diagnostic/briefs, applicable | partiel / à exécuter | GSC, HTML | Slugs ≠ stratégie complète. Relier besoin, offre réelle, intention et gap sourcé ; pas garantie ranking/citation. |
| `blog-style/SKILL.md` | — / pack 2.2.0 | Diagnostic/briefs, applicable | partiel / à exécuter | STYLE | Heuristiques françaises limitées et corpus imparfait. Charte d'abord, pas quotas de questions/anecdotes. |
| `blog-taxonomy/SKILL.md` | — / pack 2.2.0 | Famille/cluster/rôle Astro, applicable | partiel / à exécuter | ANALYZE | Frontmatter partiel, pas sync CMS. Lire référentiel familles, rattacher sujets sans archives minces ; adapters WordPress/Shopify N/A. |
| `blog-translate/SKILL.md` | 2.2.0 | Traduction, N/A | N/A / N/A | aucune | Quatre briefs français France ; aucune traduction demandée. |
| `blog-write/SKILL.md` | — / pack 2.2.0 | Rédaction/rendu/publication futurs, applicable ultérieurement | N/A / à exécuter | aucune | Aucun article produit. Après briefs seulement : écrire, fact-check, générer images, rendre, revoir et publier sous autorité applicable. Tout reste à exécuter. |

## Matrice SEO

| Skill / chemin lu | Version propre | Phase / applicabilité | D / B | Preuves | Limite et contrôle restant |
|---|---|---|---|---|---|
| `seo/SKILL.md` | 2.3.1 | Diagnostic/briefs, applicable | partiel / à exécuter | GSC, INSPECT, HTML | CWV/backlinks/citations absents. Synthèse partielle avec dépendances/test d'échec ; aucun Health Score complet. |
| `seo-ahrefs/SKILL.md` | 2.3.1 | Source optionnelle diagnostic, applicable | indisponible / N/A | aucune | Aucun reçu, clé/installation non vérifiées. Export autorisé ou ND ; aucun achat ni installation. |
| `seo-audit/SKILL.md` | 2.3.1 | Diagnostic/validation future, applicable | partiel / à exécuter | GSC, INSPECT, HTML, LIVE | Corpus blog, pas crawl intégral/performances/backlinks. Rapport partiel ; audit article futur hors carte. |
| `seo-backlinks/SKILL.md` | 2.3.1 | Diagnostic autorité, applicable | indisponible / N/A | aucune | Aucune API/export fourni. Liens HTML internes/sortants ≠ backlinks. Export autorisé et validation ; Common Crawl option non exécutée, jamais zéro/toxicité inventée. |
| `seo-bing/SKILL.md` | 2.3.1 | Source optionnelle diagnostic, applicable | indisponible / N/A | aucune | Pas reçu Bing/IndexNow ; inspections Google ne valent pas Bing/Copilot. Mesure autorisée ou ND, pas soumission. |
| `seo-cluster/SKILL.md` | 2.3.1 | Diagnostic/briefs, applicable | partiel / à exécuter | HTML, GSC | Similarité ≠ overlap SERP calculé. Hubs/spokes et maillage à justifier par SERP réelle, sans exécuter cluster. |
| `seo-competitor-pages/SKILL.md` | 2.3.1 | Comparatif commercial, N/A | N/A / N/A | aucune | Aucun sujet X vs Y/éditeur. 5 ou 15 DSN ≠ comparaison produit ; analyse concurrence relève briefs/SXO. |
| `seo-content-brief/SKILL.md` | **1.0.0** / pack 2.3.1 | Briefs, applicable | N/A / à exécuter | aucune | Brief/SERP absent. Concurrence observée, gap spécifique, outline crédible et maillage ; densité/longueurs non garanties de ranking. |
| `seo-content/SKILL.md` | 2.3.1 | E-E-A-T/briefs/validation future, applicable | partiel / à exécuter | ANALYZE, HTML | Auteur/source présent ≠ expertise/support de claim. Gain réel, plan sources et reviewer métier, aucune expérience inventée. |
| `seo-dataforseo/SKILL.md` | 2.3.1 | Recherche/briefs, applicable comme source possible | à exécuter / à exécuter | aucune | Outils disponibles ≠ collecte réussie. Parent : voie autorisée, reçus/statuts nested tasks/coûts ; volumes ND si absents, aucune dépense ici. |
| `seo-drift/SKILL.md` | 2.3.1 | Baseline/maintenance, applicable | partiel / N/A | HTML | Un snapshot ≠ SQLite drift ni comparaison avant/après. Baseline datée et comparaison après changement réel, pas dérive inventée. |
| `seo-ecommerce/SKILL.md` | 2.3.1 | E-commerce, N/A | N/A / N/A | aucune | Service IA, aucun panier/catalogue/Shopping/marketplace ; pas Product/Merchant artificiel. |
| `seo-firecrawl/SKILL.md` | 2.3.1 | Connecteur crawl optionnel, N/A outil | N/A / N/A | HTML, LIVE | Collecte HTML existante ; pas nécessité d'utiliser ce fournisseur. N/A outil ≠ audit technique complet. Étendre crawl si besoin par voie disponible. |
| `seo-flow/SKILL.md` | 2.3.1 | Diagnostic/briefs, applicable | à exécuter / à exécuter | aucune | Méthode lue, pas livrable stage-specific. Observation, dépendances, falsifiabilité ; Local et actions externes N/A. |
| `seo-geo/SKILL.md` | 2.3.1 | Accessibilité/citabilité, applicable | partiel / à exécuter | HTML, LIVE | Pas mentions/citations mesurées ni contrôle llms complet. Séparer bots search/training/user-fetchers et marquer visibilité ND. |
| `seo-google/SKILL.md` | 2.3.1 | Search Console/indexation, applicable | partiel / à exécuter | GSC, INSPECT | Indexation partielle, pas CrUX/PSI/GA4. Lire dates/warnings et faible signal ; Indexing API blog ordinaire N/A. |
| `seo-hreflang/SKILL.md` | 2.3.1 | International, N/A | N/A / N/A | aucune | Monolingue France, pas paire de versions ; aucun x-default/hreflang artificiel. lang/canonical restent applicables. |
| `seo-image-gen/SKILL.md` | 2.3.1 | Plan assets puis production future, applicable | N/A / à exécuter | aucune | Pas asset nouveau ni fournisseur Gemini invoqué. Hero/OG/alt et provenance image_generate prévus, réalisation future sans doublon blog-image. |
| `seo-images/SKILL.md` | 2.3.1 | Diagnostic/briefs/rendu futur, applicable | partiel / à exécuter | HTML | Dimensions/alt/loading/srcset présents, poids/IPTC/CLS non mesurés. Vérifier poids/formats/alt, prescrire responsive, contrôle réel au rendu futur. |
| `seo-local/SKILL.md` | 2.3.1 | Local, N/A | N/A / N/A | aucune | Intentions nationales métier, pas pages villes/GBP. Adresse sociale Paris n'impose pas SEO local ; pas LocalBusiness sans besoin. |
| `seo-maps/SKILL.md` | 2.3.1 | Maps/geo-grid, N/A | N/A / N/A | aucune | Pas map pack/GBP/avis concernés ; aucun rang mesuré, N/A n'est pas zéro. Aucune collecte/dépense requise. |
| `seo-page/SKILL.md` | 2.3.1 | Diagnostic/briefs/validation future, applicable | partiel / à exécuter | HTML, INSPECT | HTML ≠ CWV ; quatre pages non rédigées. Constats par URL puis title/meta/canonical/liens et contrôle page future. |
| `seo-plan/SKILL.md` | 2.3.1 | Diagnostic/briefs, applicable | partiel / à exécuter | GSC, HTML | Pas plan compétitif final ni volumes/conversions. Séquencer selon preuves et tests d'échec, sans roadmap dev/canaux arrêtés. |
| `seo-profound/SKILL.md` | 2.3.1 | Citations IA optionnelles, applicable | indisponible / N/A | aucune | Pas export/série/clé/abonnement vérifié. Visibilité ND, mesure si accès autorisé fourni, aucun achat. |
| `seo-programmatic/SKILL.md` | 2.3.1 | pSEO, N/A | N/A / N/A | aucune | Quatre sujets éditoriaux distincts, aucun dataset/moteur de pages. Template réutilisé ≠ pSEO ; valeur/intention propres à préserver. |
| `seo-schema/SKILL.md` | 2.3.1 | Diagnostic/briefs/rendu futur, applicable | partiel / à exécuter | HTML, INSPECT | Types/Breadcrumbs ≠ propriétés toutes valides. JSON, @id, dates/auteur/image/canonical et concordance visible à contrôler. |
| `seo-seranking/SKILL.md` | 2.3.1 | Share-of-Voice IA optionnelle, applicable | indisponible / N/A | aucune | Aucun reçu query/plateforme/date. Export autorisé ou ND ; pas score ni installation/dépense inventés. |
| `seo-sitemap/SKILL.md` | 2.3.1 | Diagnostic/publication future, applicable | partiel / à exécuter | LIVE | Copies présentes, pas XML exhaustivement validé. Index/sitemap effectif, statuts/canonical/lastmod ; slugs inclus seulement après publication réelle. |
| `seo-sxo/SKILL.md` | 2.3.1 | Intent/page-type/briefs, applicable | à exécuter / à exécuter | aucune | SERP desktop/mobile absente. Types dominants, tâche utilisateur, mismatch et gain distinctif observés ; surfaces non vérifiées ND. |
| `seo-technical/SKILL.md` | 2.3.1 | Diagnostic/rendu futur, applicable | partiel / à exécuter | HTML, LIVE, INSPECT | Neuf catégories incomplètes : mobile, sécurité, CWV absents. Séparer connu/inconnu ; LCP/INP/CLS terrain vs lab, navigateur futur. |
| `seo-unlighthouse/SKILL.md` | 2.3.1 | Performance lab optionnelle, applicable | à exécuter / N/A | aucune | Aucun audit lab ni dépendances testées. Mesurer via voie disponible ; Lighthouse ne prouve pas INP terrain, pas score 95 présumé. |

## Templates et pipeline : vérification et arbitrages

### Templates structurels réellement lus

Base : `/Users/kevinkitanga/hermes/packs/claude-blog/skills/blog/templates/`.

| Fichier | Pertinence actuelle |
|---|---|
| `case-study.md` | N/A pour les quatre briefs : pas résultats réels/client à raconter ; cas fictif doit être déclaré fictif, pas case study mesuré. |
| `comparison.md` | N/A par défaut : pas décision entre éditeurs/produits ; échéance 5/15 n'impose pas ce template. |
| `data-research.md` | N/A : pas enquête/dataset original fourni ; statistiques et charts non fabricables. |
| `faq-knowledge.md` | Candidat CRM rappel/substitution et échéance DSN ; confirmer sur SERP réelle. |
| `how-to-guide.md` | Candidat collecte variables et manuel procédures ; confirmer séquence/intention par SERP réelle. |
| `listicle.md` | N/A par défaut : pas classement d'options ou best-of établi. |
| `news-analysis.md` | N/A par défaut : aucune actualité datée vérifiée justifiant publication événementielle. |
| `pillar-page.md` | N/A par défaut : quatre spokes ciblés, ne pas remplacer sans arbitrage les hubs existants. |
| `product-review.md` | N/A : aucun test produit réel ni review de logiciel demandé. |
| `roundup.md` | N/A : pas interviews/citations d'experts réunies et vérifiées. |
| `thought-leadership.md` | N/A par défaut : besoin opérationnel, pas opinion/vécu original fourni. |
| `tutorial.md` | N/A par défaut : pas code/configuration ou implémentation technique à livrer. |

L'index `blog/references/content-templates.md` et les listes `blog-brief` / `blog-calendar` retrouvent ces 12 identifiants. Les templates **ne sont pas 12 skills supplémentaires**. Le template SEO `seo-content-brief/references/page-type-templates.md` a également été lu ; sa section Blog Post fournit un canevas, pas une obligation de FAQ ou de chiffres.

### Divergences observées

1. **Index versus fichier how-to** : introduction 100–150 mots dans l'index, 150–200 dans `how-to-guide.md`. Les racines actuelles rendent ces longueurs indicatives ; ne pas en faire un gate.
2. **Promesses de scores dans l'index** : les mentions « 75+ » obtenus en suivant un template ne sont ni mesure actuelle, ni garantie de ranking. La preuve et l'utilité restent à évaluer.
3. **SEO brief propre 1.0.0** : longueurs meta/densités rigides et plans chiffrés coexistent avec la guidance intent-dependent Blog 2.2.0. Aucun remplissage destiné à satisfaire un quota.
4. **Templates génériques versus Memlia** : propositions stock photos, témoignages, expérience personnelle, statistiques/vidéos ne passent pas automatiquement. Memlia demande images générées sur brief écrit, sources datées, aucune donnée client réelle ni vécu inventé.
5. **Documentation versus code/constitution** : `docs/blog-pipeline.md` garde des mentions un candidat/jour et go Kevin ; le code fixe deux/jour (`CANDIDATS_PAR_JOUR_MAX`, ligne 63) et la constitution du 03/10 prime sur l'autorité. Ne pas convertir cette observation en modification des gates : cette carte est documentaire uniquement.
6. **Registre versus union actuelle** : template et tableaux de skills concordent exactement, mais ne couvrent pas les deux racines/six extensions. Cette différence est prévue par le type de registre, pas un échec de génération.

### Contrat minimal restant pour chacun des quatre briefs

- SERP réellement observée, requête et intention, pays/langue/appareil/date ; distinguer recherche web et véritable relevé Google desktop/mobile. PAA/AI Overview/AI Mode non observés = ND, pas absence.
- Comparaison avec articles existants et entre les quatre sujets ; différenciation ou consolidation justifiée par URL.
- Rôle lecteur, tâche et résultat utile ; information gain précise et preuve distinctive réalisable, cas courant/limite/refus.
- Sources officielles datées et support des affirmations réglementaires ; prévoir revue métier distincte. Une URL ouverte ne suffit pas à certifier le droit.
- Choix template final, H2/H3, maillage sortant **et entrant**, CTA fidèle au service livré, déclencheur de maintenance.
- Plan images/OG/alt sans génération dans cette carte ; aucune obligation de chart/statistique/FAQ quand non utile.
- Rédaction, assets, rendu, préflight, recette navigateur, revue et publication : **à exécuter sur une étape ultérieure**, pas attestés par le brief.

## Vérification de cette matrice et limites

Les contrôles réellement exécutés avec `jq` retournent : **63 lignes, 63 noms uniques, aucun skill manquant du pack/catalogue/pipeline, drapeaux catalogue et pipeline corrects, aucun champ requis manquant**. La comparaison template/pipeline retourne `blogEqual=true` et `seoEqual=true`.

Le JSON compagnon est la forme machine-relisible : chemin lu/version propre/version pack, applicability et motif, phase, état diagnostic et briefs, preuves précises, limites et contrôle restant par entrée. Les comptes ci-dessus sont calculés, pas annoncés depuis la description des racines.

**Limites non levées :** pas de CWV terrain CrUX ni audit Lighthouse ; pas d'APIs/export backlinks ; pas de visibilité effective sur les plateformes IA ; pas de revue métier des quatre briefs. Les diagnostics globaux restent partiels. Absence de donnée n'est jamais un zéro ou un PASS.

Deux essais Python de calcul ont été bloqués par le mode single-query. La solution réellement utilisée est `jq` ; aucune configuration ou compétence n'a été modifiée. Aucun article, carte, review ni fichier autre que les deux livrables de couverture n'a été écrit par cette carte.
