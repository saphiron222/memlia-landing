# Site v3 : l'éditorial de memlia.fr, de la stratégie à la mesure

Porte d'entrée du dossier. Écrit le 16 septembre 2026, remis à l'état réel le 20 septembre puis
réconcilié avec les sources le 28 septembre, puis avec l'inventaire et la charte le 29 septembre 2026.
Le site est en ligne depuis le 16/09 et sert la copy v3 « un savoir-faire que personne n'a écrit »
depuis le 17/09 (`JOURNAL.md`, lignes des 16 et 17/09). Ce dossier décrit ce qui tourne, pas un projet.

Trois sources font foi et ne sont pas redéfinies ici :

- `.agents/product-marketing.md` : la charte de message **v4 du 21/09/2026** (angle v3 du 17/09 et §2 bis « la règle écrite » du 19/09), pour toute surface publique ; §7 ter exige l'authentification du corps personnel exact d'une Cicatrice signée, sans go individuel de publication blog.
- `src/data/familles.ts` : la taxonomie, 60 familles en 12 pôles, `audit-legal` listée et non ouverte (comptées dans le fichier).
- `backlog-v3.json` : les angles et les suggestions relevées sur leurs formulations testées, 243 entrées dont le pilier (comptées dans le fichier) ; le plan ajoute trois articles historiques hors backlog. Le champ `demande.mesureeLe` date un relevé, non une demande quantifiée.

La catégorie commerciale est l'automatisation, avec IA, des tâches répétitives d'un cabinet
d'expertise comptable, vendue comme un service et non comme un logiciel (charte §4). Excel est
une intégration possible, jamais la catégorie. Les mots de catalogue interdits par la charte §9
sont verrouillés par `tests/proof/test_positioning.py` et ne servent pas davantage ici pour
désigner l'offre.

## À lire, dans l'ordre

1. [Stratégie](SEO-STRATEGY.md) : le constat, la thèse, la carte des 60 familles en 12 pôles taxonomiques (59 familles et 11 pôles actifs dans le plan), ce que les suggestions relevées le 19/09 ont changé, les seuils de décision datés.
2. [Autorité commerciale](SEO-AUTORITE-COMMERCIALE-2026-09-20.md) : décision d'architecture accueil → pilier → routes filles, verdict SERP par requête, profondeur 12/30/90, E-E-A-T, backlinks et procédure d'indexation.
3. [Concurrents](COMPETITOR-ANALYSIS.md) : qui occupe chaque famille, en quel format, et l'espace libre. Relevé du 16/09, non remesuré depuis : à lire comme daté.
4. [Architecture](SITE-STRUCTURE.md) : l'arbre du site en ligne, les règles d'URL, le maillage tel que le cron d'intégrité le contrôle, ce que le code fait déjà.
5. [Accès commerciaux](ARCHITECTURE-ACCES-COMMERCIAUX.md) : l'espace `/automatisation/`, le gabarit et la règle anti-cannibalisation ; **les requêtes/volumes/ordres des §§2–3 et 10 sont historiques et supersédés**. Lire le contrat courant en addendum, les frontmatters des services et [l'audit d'audience du 20/09](AUDIT-AUDIENCE-REQUETES-2026-09-20.md).
6. [Glossaire](GLOSSARY-PLAN.md) : 53 termes (23 historiques, vagues de 20 puis 10), quatre réglementaires reportés, déclencheur de revue et chaîne de preuve.
   [Boucle des outils](OUTILS-BOUCLE.md) : seuils J+28/J+90 préenregistrés, quatrième outil suivi à part et télémétrie locale non collectée.
7. [Exécution](IMPLEMENTATION-ROADMAP.md) : l'état au 19/09, le cycle réel d'un article aujourd'hui, ce qui reste et à quelle échéance.
8. [Crons SEO](CRONS-SEO.md) : pourquoi chaque instrument existe, ce qu'il ne mesure pas, le point zéro du 17/09.
9. [Mode opératoire des crons](RUNBOOK-SEO.md) : sentinelle quotidienne, relevé des signaux du lundi, intégrité du mercredi, relevé des questions, extensions de la forge.
10. [Mode opératoire quotidien](RUNBOOK-QUOTIDIEN.md) : la forge éditoriale, de la recette au contrôle en ligne. C'est le document qu'une session de production lit en premier.
11. [Journal](JOURNAL.md) : une ligne par exécution, et les sections « Tranché » qui portent les décisions (l'ordre de la liste du blog le 17/09, la stratégie blog le 19/09).
12. [Mesures](mesures/) : les relevés commités. `questions-2026-09-19.md` et `.json` (suggestions par formulation, SERP par famille), `titres-intent-2026-09-21.json` (test distinct du primaire IA), `semaine-2026-W38-demande.json`, `semaine-2026-W38-integrite.json`, `sentinelle.jsonl`, `registre-requetes.json`, `amorces-marche.json`.
13. [Calendrier](CONTENT-CALENDAR.md), [plan de cluster](cluster-plan.md), [données](cluster-plan.json), [carte interactive](cluster-map.html) : générés par `build-cluster-plan.py`. Ne pas les éditer à la main ; corriger `backlog-v3.json` ou la taxonomie, puis régénérer. `manque` et `a-replanifier` ne sont pas des créneaux de publication.
14. [Briefs du 16/09](cluster-briefs/) : périmés (voir plus bas). Ne pas s'en servir comme source d'un article.

## Gouvernance des faits vivants (réconciliation du 28/09)

| Fait | Propriétaire vérifiable | Socle à revoir quand il change |
|---|---|---|
| Message, frontière humaine, vocabulaire | `.agents/product-marketing.md`, `tests/proof/test_positioning.py` | stratégie et runbook, sans dupliquer la charte |
| Direction artistique et preuve visuelle | `docs/design/2026-09-08-design-navattic-memlia.md`, `src/styles/tokens.css`, renderers de preuves | architecture, accès commerciaux, runbook selon surface |
| Familles et sujets | `src/data/familles.ts`, `backlog-v3.json`, `src/content.config.ts` | stratégie ; régénérer calendrier/plan/carte, jamais les éditer à la main |
| Articles et rubriques visibles | `src/content/blog/`, `src/data/blog-rubriques.mjs`, `src/pages/blog.astro` | architecture, stratégie et compte daté du README |
| Routes indexables, maillage et canonicals | `src/pages/`, `src/data/site.mjs`, `config/page-route-contracts.json`, `Footer.astro` | architecture et contrat d'accès ; contrôler dist puis URL servie |
| Services et guides | `src/content/services/`, `commercial/services/`, `src/data/integrations.ts` | accès commerciaux et architecture |
| Outils gratuits et mesure | `src/data/outils.ts`, `OUTILS-BOUCLE.md` | architecture ; préserver les seuils préenregistrés |
| Glossaire | `src/data/glossary.ts`, revue métier et sceau Ressources | plan du glossaire ; ne jamais re-dater une source non rouverte |
| Forge et publication | `scripts/blog-forge.mjs`, `scripts/lib/blog-body-envelope.mjs`, `scripts/cron-preflight.mjs`, gardes PR/QA/CI | runbook quotidien ; la procédure ne confère pas seule un droit au push |

Rôles : la charte et `CLAUDE.md` posent les interdits ; `SITE-STRUCTURE.md` est la carte ; ce
README indexe l'état et les écarts ; `JOURNAL.md` et les décisions datées gardent l'historique.
Une assertion du moniteur n'est qu'une alerte : vérifier la source et le rendu sur le SHA exact,
puis obtenir revue indépendante avant de dire que le site servi a changé. Ne jamais remplacer un
relevé historique par une valeur reconstruite aujourd'hui.

## Registre de revue par surface — 30/09/2026, candidat local

Ce registre fixe les responsabilités et moments de revue, pas l'existence d'un cron actif ni
un nouveau quota de pages. La base distante observée est `714859e5e72a87e384b5125bd8d84ab4170dde76` ;
les corrections du candidat parent `b63ce5345734fbab3cbbb2add47a1c826d93a238` restent locales.
Un PASS du moniteur local n'actualise ni `origin/main` ni la production.

| Surface / source de vérité | Propriétaire | Déclencheur et cadence de revue | Preuve attendue |
|---|---|---|---|
| Blog : `backlog-v3.json`, recettes et `src/content/blog/` ; règles §7 de la stratégie | marketing ; métier pour faits sensibles ; QA indépendante | avant chaque candidat, maintenance vendredi ; objectifs de quatre ordinaires/semaine et alternance pôle/format, jamais remplissage forcé | recette, sources datées, revue et sceau exacts ; `--check` non mutant ; reçu servi séparé |
| Glossaire : `src/data/glossary.ts`, `GLOSSARY-PLAN.md` §6 | marketing ; métier pour définition sensible ; QA Ressources | besoin d'un terme dans une surface publiée, revue vendredi ; aucun quota de termes | compteur calculé des ancres, source réellement rouverte, chaîne Ressources ; quatre réglementaires toujours reportés |
| Guides : `src/data/integrations.ts`, pages `/integrations/` | marketing ; dev si geste ou intégration change ; métier si sensible ; QA | avant ajout ou évolution d'un guide ; revue mensuelle des liens et changements de documentation éditeur, immédiate sur erreur signalée ; aucune cadence de création | intention distincte, geste et résultat fictifs, cadre HTML propre, tests et canonical conservés ; réponse servie attestée après livraison |
| Outils gratuits : `src/data/outils.ts`, `OUTILS-BOUCLE.md` | marketing pour demande/source ; dev pour règle/calcul ; QA | contrôle de justesse quotidien prévu par la boucle, incident immédiat ; lectures J+28/J+90 aux dates préenregistrées, aucune nouvelle vague pour remplir un calendrier | cas courant/limite/refus, besoin complet sans inscription ; relevés par route, `ND` si instrument absent, seuils historiques inchangés |
| Automatisation : `src/content/services/`, `commercial/`, contrat d'accès commercial | marketing ; dev pour fonction promise ; métier pour faits sensibles ; QA | avant chaque candidat, changement de tâche livrée ou source ; revue mensuelle du parcours et du maillage, sans quota de nouvelles routes | intention cabinet distincte, aucune promesse non livrée, cadre HTML propre, revue/sceau ; dist et HTTP servi distingués |

Choisir Comment pour un geste à exécuter, Pourquoi pour une décision à comprendre et checklist
pour un contrôle complet : le format suit l'intention, pas une variante à publier. La DA reste
celle du recueil canonique et de `tokens.css`, avec preuves HTML figées ; aucun nouveau gabarit
ni changement de route/canonical/sitemap n'est requis par cette revue. Les cadences mensuelles
ci-dessus sont des règles de maintenance, pas une allégation d'exécution ou d'usage mesuré.

Revue sans changement : les seuils et populations d'`OUTILS-BOUCLE.md` restent préenregistrés ;
le quatrième outil et la télémétrie locale restent séparés, aucun résultat d'acquisition nouveau
n'est revendiqué. Les inventaires courants se calculent depuis les sources, les relevés W38 et
19–21/09 restent historiques. Le moniteur ne vérifie pas toute la doctrine : son PASS n'efface
pas les refus éditoriaux historiques signalés dans le runbook §3.

## Ce qui est fait

- **Le site est en ligne** et sert la copy v3 ; les cinq routes de tâche actuellement publiées sont distinctes des routes service encore candidates, exclues du sitemap tant que leur statut n'est pas `publie`.
- **Onze fichiers d'articles publiés** sont présents dans `src/content/blog/` après les deux articles ordinaires W39. Présence au dépôt, exclusion du sitemap et indexabilité du HTML sont trois faits distincts : l'article de saisie FE est exclu du sitemap et son HTML statique porte `noindex, follow` (test dist) ; la fonction de bord vise toujours un 503 avec `X-Robots-Tag`. Aucun état GET/HEAD servi en production n'est attesté ici : voir `SITE-STRUCTURE.md` avant toute allégation de suspension effective.
- **La cadence est codée** : 4 par semaine ISO, 2 par jour au plus, du lundi au jeudi (`CANDIDATS_PAR_SEMAINE_MAX`, `CANDIDATS_PAR_JOUR_MAX` dans `scripts/lib/blog-pipeline.mjs`).
- **Le mécanisme est nommé** : « la règle écrite » (charte §2 bis). La forge refuse de matérialiser un article daté à partir du 19/09/2026 qui ne porte pas `## La règle écrite` et `## Rejoué sur le jeu fictif` (`DEBUT_REGLE_ECRITE` et `verifierRegleEcrite`, `scripts/blog-forge.mjs`).
- **Le glossaire porte 53 termes** (comptés dans `src/data/glossary.ts` ; `tests/proof/test_glossary.py` en exige exactement 53) : 23 historiques, 20 de la vague 1 et 10 de la vague 2.
- **Le backlog est recalé sur les suggestions relevées** le 19/09 : 33 angles en priorité 1 (dont le pilier), 9 en priorité 2, 201 en priorité 3, comptés dans `backlog-v3.json`. Les 201 P3 ont une date `demande.mesureeLe` ; leur priorité signifie qu'aucune suggestion n'a été relevée sur les formulations testées, non que la demande ou le volume sont nuls. `--check` contrôle aussi les P1 publiées du backlog, pilier compris : date et signal primaire positif ; les trois suggestions du pilier concordent avec `mesures/autocompletion-cache.json`. **Exception IA publiée** : la requête primaire exacte « métier comptable intelligence artificielle compétences » a rendu zéro suggestion au relevé du **21/09** (`mesures/titres-intent-2026-09-21.json`) ; ses secondaires ne figurent pas dans les deux relevés (`secondaires: null`, non mesurées). Les quatre questions et l'aperçu IA appartiennent à la SERP **de la famille** `formation-ia-competences` sur « former l'équipe à l'IA cabinet comptable » du **19/09** (`mesures/questions-2026-09-19.json`), pas à la requête primaire. `demande.mesureeLe` et `demande.serpFamille.mesureeLe` portent séparément ces dates et populations. La P1 publiée est conservée comme arbitrage éditorial historique, non comme preuve de volume ou de demande ; le gate doit refuser un primaire positif fictif et une source familiale décalée, sans réécrire l'article. Trois historiques synthétiques et série hors gate.
- **Les surfaces ont grandi** : pages de tâche publiées sous `/automatisation/`, guides `/integrations` et outils autonomes sous `/outils-comptables-gratuits` ; leur état dépend de leurs registres respectifs (`SITE-STRUCTURE.md`, `ARCHITECTURE-ACCES-COMMERCIAUX.md`, `OUTILS-BOUCLE.md`). Les crons et mesures restent décrits dans `CRONS-SEO.md` et `RUNBOOK-SEO.md` ; vérifier leur état effectif avant d'affirmer qu'ils tournent.

## Ce que la mesure dit, sans l'adoucir

- **Zéro impression et zéro clic sur les sept articles du relevé W38** sur 7 comme sur 28 jours (`mesures/semaine-2026-W38-demande.json`) ; ce relevé ne couvre pas les deux articles publiés après la fenêtre.
- Les 17 impressions et 4 clics des 28 jours sont tous sur l'accueil, sur des requêtes de marque mal orthographiées (même fichier, champs `horsRegistre` et `nouvelles`).
- **memlia.fr est absent des 20 premiers résultats** sur « automatisation cabinet comptable » et sur « automatisation saisie comptable » (`CRONS-SEO.md` §1, relevé DataForSEO du 17/09).
- **Google réécrit « memlia » en « mellia »** (`spell = did_you_mean`) et sert une autre entité ; seule `/contact` apparaît, au rang 20, l'accueil est absent (même relevé).
- **Un aperçu IA occupe 57 des 59 pages de résultats relevées** le 19/09 (`mesures/questions-2026-09-19.json`).

Ces cinq lignes ne condamnent pas l'éditorial : une lecture Search Console utile n'est pas attendue
avant la mi-octobre 2026 (`JOURNAL.md`, « Tranché » du 19/09). Elles interdisent d'annoncer un
résultat, et elles fixent le point zéro des seuils de `SEO-STRATEGY.md` §8.

## Décisions historiques du 20/09 à requalifier, sans les réouvrir automatiquement

| Sujet | Ce qui est demandé | Où c'est écrit |
|---|---|---|
| Série de cicatrices | ancien stock à confronter aux faits signés actuels ; aucune Cicatrice inventée | `RUNBOOK-QUOTIDIEN.md` §4 bis |
| D2 : C4, autorité, entité et visibilité IA | go sur le cron mensuel et ses appels IA DataForSEO, environ 0,40 $ par mois | `CRONS-SEO.md` §7 |
| D3 : Bing Webmaster Tools, jeton Cloudflare Analytics | vérifier memlia.fr dans Bing (débloque IndexNow et les liens entrants Bing) ; créer un jeton « Account Analytics : Read », hors dépôt | `CRONS-SEO.md` §7 |
| D4 : champ « page d'origine » du formulaire de contact | décider s'il est ajouté ; sans lui, une demande citant un article ne se mesure que sur le texte du message | `CRONS-SEO.md` §7 |
| Glossaire, vague 2 | dix termes intégrés ; quatre réglementaires reportés pour revue métier, pas pour simple go de calendrier | `GLOSSARY-PLAN.md` §3 |

Ce qui n'attend plus personne : le territoire (élargi et validé le 16/09), la cadence (confirmée
le 19/09), les neuf briefs de la vague 1 (périmés), les brouillons LinkedIn des articles
(abandonnés le 19/09, `JOURNAL.md`).

## Les briefs du 16/09 sont périmés

`cluster-briefs/` contient neuf briefs datés du 16/09/2026, au statut « a-prioriser », qui
attendaient une validation qui n'a jamais eu lieu sous cette forme. Deux de leurs sujets sont
publiés : le pilier et la relance des pièces clients. Les sept autres ont été réordonnés ou
réécrits par le recalage du 19/09 : sur ces sept, un seul est en priorité 1, un en priorité 2 et
cinq en priorité 3 (comptés dans `backlog-v3.json`), et le titre de l'article sur l'IA générative
a changé.

**La source d'un article est désormais la recette de la forge (`editorial/recettes/<slug>/`) et la
ligne du backlog**, pas ces briefs. Ils restent au dépôt comme trace de la vague 1, rien de plus.

## Vérification

```bash
# vérifie le plan en mémoire sans modifier les dérivés, puis refuse : slug ou requête primaire en double, cluster
# ou format hors énumération, satellite sans lien vers le pilier, moins de trois liens entrants,
# orpheline, plafond de cadence dépassé, angle de priorité 1 sans signal mesuré daté
python3 docs/strategy/site-v3/build-cluster-plan.py --check

# après décision éditoriale ou publication avérée : régénère plan, calendrier et carte ;
# la date « Généré le » est celle de cette édition, non celle du dernier --check
python3 docs/strategy/site-v3/build-cluster-plan.py

# suggestions sur les formulations : autocomplétion Google ; SERP par famille : DataForSEO (porte de coût)
node scripts/seo/questions.mjs relever && node scripts/seo/questions.mjs rapport

npm run blog:audit   # les dossiers scellés : un candidat préparé et non scellé fait échouer le build
npm run build        # audit, build, preuves, lastmod, images, scripts
```

Le relevé complet des questions a coûté 0,2125 $ le 19/09, pour 704 amorces et 59 pages de
résultats (`mesures/questions-2026-09-19.json`).

## Limites de ce dossier

Pour les **questions du blog relevées le 19/09**, aucun volume Ads n'a été mesuré dans ce lot ;
les deux requêtes chiffrées le 12/09 étaient des repères antérieurs, pas un inventaire exhaustif.
Le relevé commercial DataForSEO du **20/09** (`mesures/audience-requetes-2026-09-20.json`)
chiffre aussi des variantes nues, dont notes de frais et factures fournisseurs, mais ne chiffre
pas les cinq requêtes de tâche qualifiées retenues : ne jamais transférer leur volume aux pages.
L'autocomplétion est un signal de suggestions, pas une mesure de volume : une liste vide ou un volume `null` ne
prouvent pas l'absence de lecteur, et une panne de l'instrument n'est jamais comptée comme un zéro
(`RUNBOOK-SEO.md` §3 bis). Les rangs de memlia.fr viennent des pages de résultats, pas de Search
Console, qui n'a encore aucune ligne de requête sur les articles. Le recouvrement entre familles
est lu sur des relevés qualitatifs, pas sur un top 10 organique exact : les regroupements sont des
regroupements de cohérence éditoriale. Aucune donnée client, aucun nom de cabinet, aucune promesse
de résultat.
