# Site v3 : l'éditorial de memlia.fr, de la stratégie à la mesure

Porte d'entrée du dossier. Écrit le 16 septembre 2026, remis à l'état réel le 20 septembre 2026.
Le site est en ligne depuis le 16/09 et sert la copy v3 « un savoir-faire que personne n'a écrit »
depuis le 17/09 (`JOURNAL.md`, lignes des 16 et 17/09). Ce dossier décrit ce qui tourne, pas un projet.

Trois sources font foi et ne sont pas redéfinies ici :

- `.agents/product-marketing.md` : la charte de message (v3 du 17/09/2026, §2 bis « la règle écrite » du 19/09/2026), pour toute surface publique.
- `src/data/familles.ts` : la taxonomie, 60 familles en 12 pôles, `audit-legal` listée et non ouverte (comptées dans le fichier).
- `backlog-v3.json` : les angles et leur demande mesurée, 243 entrées dont le pilier (comptées dans le fichier).

La catégorie commerciale est l'automatisation, avec IA, des tâches répétitives d'un cabinet
d'expertise comptable, vendue comme un service et non comme un logiciel (charte §4). Excel est
une intégration possible, jamais la catégorie. Les mots de catalogue interdits par la charte §9
sont verrouillés par `tests/proof/test_positioning.py` et ne servent pas davantage ici pour
désigner l'offre.

## À lire, dans l'ordre

1. [Stratégie](SEO-STRATEGY.md) : le constat, la thèse, la carte des 60 familles en 12 pôles, ce que la demande mesurée du 19/09 a changé, les seuils de décision datés.
2. [Autorité commerciale](SEO-AUTORITE-COMMERCIALE-2026-09-20.md) : décision d'architecture accueil → pilier → routes filles, verdict SERP par requête, profondeur 12/30/90, E-E-A-T, backlinks et procédure d'indexation.
3. [Concurrents](COMPETITOR-ANALYSIS.md) : qui occupe chaque famille, en quel format, et l'espace libre. Relevé du 16/09, non remesuré depuis : à lire comme daté.
4. [Architecture](SITE-STRUCTURE.md) : l'arbre du site en ligne, les règles d'URL, le maillage tel que le cron d'intégrité le contrôle, ce que le code fait déjà.
5. [Accès commerciaux](ARCHITECTURE-ACCES-COMMERCIAUX.md) : l'espace `/automatisation/`, les pages de service mesurées, le type comparatif, le gabarit, le contrat de lien et la règle anti-cannibalisation arrêtés le 20/09.
6. [Glossaire](GLOSSARY-PLAN.md) : la vague 1 intégrée (20 termes, 43 rendus), la vague 2 restante (14 termes), la chaîne de publication et son piège.
7. [Exécution](IMPLEMENTATION-ROADMAP.md) : l'état au 19/09, le cycle réel d'un article aujourd'hui, ce qui reste et à quelle échéance.
8. [Crons SEO](CRONS-SEO.md) : pourquoi chaque instrument existe, ce qu'il ne mesure pas, le point zéro du 17/09.
9. [Mode opératoire des crons](RUNBOOK-SEO.md) : sentinelle quotidienne, relevé de demande du lundi, intégrité du mercredi, relevé des questions, extensions de la forge.
10. [Mode opératoire quotidien](RUNBOOK-QUOTIDIEN.md) : la forge éditoriale, de la recette au contrôle en ligne. C'est le document qu'une session de production lit en premier.
11. [Journal](JOURNAL.md) : une ligne par exécution, et les sections « Tranché » qui portent les décisions (l'ordre de la liste du blog le 17/09, la stratégie blog le 19/09).
12. [Mesures](mesures/) : les relevés commités. `questions-2026-09-19.md` et `.json` (la demande), `semaine-2026-W38-demande.json`, `semaine-2026-W38-integrite.json`, `sentinelle.jsonl`, `registre-requetes.json`, `amorces-marche.json`.
13. [Calendrier](CONTENT-CALENDAR.md), [plan de cluster](cluster-plan.md), [données](cluster-plan.json), [carte interactive](cluster-map.html) : générés par `build-cluster-plan.py`. Ne pas les éditer à la main ; corriger `backlog-v3.json` ou la taxonomie, puis régénérer.
14. [Briefs du 16/09](cluster-briefs/) : périmés (voir plus bas). Ne pas s'en servir comme source d'un article.

## Ce qui est fait

- **Le site est en ligne** et sert la copy v3 ; les routes service candidates restent exclues du sitemap tant que leur statut n'est pas `publie`.
- **Sept articles sont publiés**, tous passés par la forge éditoriale `scripts/blog-forge.mjs`. Aucun article n'est publié hors forge depuis le 17/09 au soir.
- **La cadence est codée** : 4 par semaine ISO, 2 par jour au plus, du lundi au jeudi (`CANDIDATS_PAR_SEMAINE_MAX`, `CANDIDATS_PAR_JOUR_MAX` dans `scripts/lib/blog-pipeline.mjs`).
- **Le mécanisme est nommé** : « la règle écrite » (charte §2 bis). La forge refuse de matérialiser un article daté à partir du 19/09/2026 qui ne porte pas `## La règle écrite` et `## Rejoué sur le jeu fictif` (`DEBUT_REGLE_ECRITE` et `verifierRegleEcrite`, `scripts/blog-forge.mjs`).
- **Le glossaire porte 43 termes** (comptés dans `src/data/glossary.ts` ; `tests/proof/test_glossary.py` en exige exactement 43) : les 23 historiques et les 20 de la vague 1, intégrés le 16/09.
- **Le backlog est recalé sur la demande mesurée** du 19/09 : 33 angles en priorité 1 (dont le pilier), 9 en priorité 2, 201 en priorité 3, comptés dans `backlog-v3.json`. Un angle de priorité 1 sans demande mesurée fait échouer `build-cluster-plan.py --check`.
- **La mesure tourne** : C1 sentinelle quotidienne, C2 relevé de demande le lundi, C3 intégrité le mercredi, et dans la forge F1 après publication, F2 le vendredi, F3 les liens manquants (`CRONS-SEO.md`, `RUNBOOK-SEO.md`). C4 et C5 ne sont pas armés. Search Console sur `sc-domain:memlia.fr`, aucun GA4 (décision de Kevin, motif CNIL), Cloudflare Web Analytics pour l'audience.

## Ce que la mesure dit, sans l'adoucir

- **Zéro impression et zéro clic sur les sept articles** dans le dernier relevé disponible, sur 7 comme sur 28 jours (`mesures/semaine-2026-W38-demande.json`).
- Les 17 impressions et 4 clics des 28 jours sont tous sur l'accueil, sur des requêtes de marque mal orthographiées (même fichier, champs `horsRegistre` et `nouvelles`).
- **memlia.fr est absent des 20 premiers résultats** sur « automatisation cabinet comptable » et sur « automatisation saisie comptable » (`CRONS-SEO.md` §1, relevé DataForSEO du 17/09).
- **Google réécrit « memlia » en « mellia »** (`spell = did_you_mean`) et sert une autre entité ; seule `/contact` apparaît, au rang 20, l'accueil est absent (même relevé).
- **Un aperçu IA occupe 57 des 59 pages de résultats relevées** le 19/09 (`mesures/questions-2026-09-19.json`).

Ces cinq lignes ne condamnent pas l'éditorial : une lecture Search Console utile n'est pas attendue
avant la mi-octobre 2026 (`JOURNAL.md`, « Tranché » du 19/09). Elles interdisent d'annoncer un
résultat, et elles fixent le point zéro des seuils de `SEO-STRATEGY.md` §8.

## Ce qui attend Kevin

| Sujet | Ce qui est demandé | Où c'est écrit |
|---|---|---|
| Série de cicatrices | trancher ses trois premiers sujets | `JOURNAL.md`, « Tranché » du 19/09 |
| D2 : C4, autorité, entité et visibilité IA | go sur le cron mensuel et ses appels IA DataForSEO, environ 0,40 $ par mois | `CRONS-SEO.md` §7 |
| D3 : Bing Webmaster Tools, jeton Cloudflare Analytics | vérifier memlia.fr dans Bing (débloque IndexNow et les liens entrants Bing) ; créer un jeton « Account Analytics : Read », hors dépôt | `CRONS-SEO.md` §7 |
| D4 : champ « page d'origine » du formulaire de contact | décider s'il est ajouté ; sans lui, une demande citant un article ne se mesure que sur le texte du message | `CRONS-SEO.md` §7 |
| Glossaire, vague 2 | valider la liste des 14 termes restants et le moment de la vague | `GLOSSARY-PLAN.md` §3 |

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
# régénère plan, calendrier et carte, puis refuse : slug ou requête primaire en double, cluster
# ou format hors énumération, satellite sans lien vers le pilier, moins de trois liens entrants,
# orpheline, plafond de cadence dépassé, angle de priorité 1 sans demande mesurée
python3 docs/strategy/site-v3/build-cluster-plan.py --check

# la demande : autocomplétion Google (gratuite) puis pages de résultats DataForSEO (porte de coût)
node scripts/seo/questions.mjs relever && node scripts/seo/questions.mjs rapport

npm run blog:audit   # les dossiers scellés : un candidat préparé et non scellé fait échouer le build
npm run build        # audit, build, preuves, lastmod, images, scripts
```

Le relevé complet des questions a coûté 0,2125 $ le 19/09, pour 704 amorces et 59 pages de
résultats (`mesures/questions-2026-09-19.json`).

## Limites de ce dossier

Volumes de recherche : non mesurés, hors « automatisation cabinet comptable » et « compte rendu
métier DSN » (10 par mois chacune, relevé DataForSEO du 12/09/2026, cité par `SEO-STRATEGY.md`).
L'autocomplétion est un seuil, pas un compte : une liste vide dit qu'une requête est sous le seuil
de volume, pas qu'elle vaut zéro, et une panne de l'instrument n'est jamais comptée comme un zéro
(`RUNBOOK-SEO.md` §3 bis). Les rangs de memlia.fr viennent des pages de résultats, pas de Search
Console, qui n'a encore aucune ligne de requête sur les articles. Le recouvrement entre familles
est lu sur des relevés qualitatifs, pas sur un top 10 organique exact : les regroupements sont des
regroupements de cohérence éditoriale. Aucune donnée client, aucun nom de cabinet, aucune promesse
de résultat.
