# Exécution v3 : l'état au 19 septembre 2026, et ce qui reste

Écrite le 16 septembre 2026, remise à l'état réel le 19 septembre 2026. Les phases 0 à 3 de la
première version sont soit faites, soit périmées : elles sont remplacées ici par l'état constaté, le
cycle réel d'un article, et une liste datée de ce qui reste.

Chaque avancée se termine par une preuve, pas par une annonce : les suites (Python, Node,
navigateur), la chaîne de preuve (`build-cluster-plan.py --check`, `test:lastmod`, scellement et
réaffirmation de la surface Ressources), et l'écran (contrôle en ligne sur l'URL immuable du
déploiement, puis la production).

## 1. Ce qui est construit

| Élément | Où | Preuve |
|---|---|---|
| Taxonomie en source unique : 60 familles, 12 pôles, `audit-legal` listée et non ouverte | `src/data/familles.ts`, `famille` dans `src/content.config.ts` | `npx astro check` sans erreur ; `test_build.py::test_familles_des_articles_pipeline` |
| Cadence codée : 2 par jour, 4 par semaine ISO, lundi à jeudi | `CANDIDATS_PAR_JOUR_MAX`, `CANDIDATS_PAR_SEMAINE_MAX`, `verifierPlafonds` | `tests/scripts/blog-pipeline.test.mjs`, `blog-forge.test.mjs` |
| La forge éditoriale : recette, dossier complet, gate, publication scellée | `scripts/blog-forge.mjs` (`preparer`, `sceller`, `publier`), recettes dans `editorial/recettes/<slug>/` | `tests/scripts/blog-forge.test.mjs` : le dossier passe `validateDossier` en prévisualisation, en production et scellé ; un octet modifié casse le sceau |
| Publication scellée : statut `publie` et reçu `preuves/publication.json` (inventaire sha256), audité à chaque build | `validatePublicationSeal`, mode `publication-scellee` de `blog:audit` | même test |
| Six articles publiés, tous passés par la forge | `src/content/blog/`, `editorial/recettes/` | `PUBLIC_ARTICLES` dans `test_build.py` (6 slugs) ; `blog:audit` PASS, 6 dossiers scellés |
| Copy v3 servie sur toute surface | `.agents/product-marketing.md` v3, pages et articles | `test_positioning.py`, `test_integrated_media.py`, `test_legal_identity.py`, `positioning.spec.ts` |
| « La règle écrite » exigée des articles nouveaux | `DEBUT_REGLE_ECRITE = '2026-09-19'`, `verifierRegleEcrite` (`scripts/blog-forge.mjs`) | testé, témoin de mutation joué (`JOURNAL.md`, « Tranché » du 19/09) |
| Glossaire vague 1 intégrée : 43 termes rendus | `src/data/glossary.ts`, manifeste T, revue R5 ancrée | `test_glossary.py` (43), `resource:audit:qa` PASS |
| Identité d'entité : un `@id`, une définition, cinq surfaces | `src/data/schema.mjs` | six preuves dédiées, dont l'invariant (`JOURNAL.md`, 17/09) |
| Backlog ordonné selon les suggestions relevées sur les formulations testées (pannes partielles conservées comme inconnues) | `scripts/seo/questions.mjs`, `scripts/lib/seo-questions.mjs`, `backlog-v3.json` | invariant « priorité 1 exige un signal primaire ou SERP historique daté » dans `build-cluster-plan.py --check` ; la date seule ne certifie pas la complétude ; `mesures/questions-2026-09-19.json` |
| Mesure en place : C1, C2, C3, F1, F2, F3 | `scripts/seo/`, `scripts/lib/seo-*` | `RUNBOOK-SEO.md` ; trois tâches planifiées ; relevés commités dans `mesures/` |

## 2. Le cycle d'un article, tel qu'il tourne

Quatre fois par semaine, du lundi au jeudi. Les commandes exactes sont dans `RUNBOOK-QUOTIDIEN.md`,
qui fait foi ; ce qui suit en est la forme, pour comprendre où sont les portes.

1. **Lire le créneau du jour** : `--check` puis la ligne de la date dans `CONTENT-CALENDAR.md`. Le slug donne l'entrée complète du backlog (titre, requête primaire et secondaires, famille, rôle, intention, format, preuve attendue, autorités, bloc `demande`).
2. **Écrire la recette** : `editorial/recettes/<slug>/recette.json` et `corps.md`. Le corps porte, depuis le 19/09, `## La règle écrite` (la frontière en trois colonnes, la proposition, l'arrêt, le jeu d'essai) et `## Rejoué sur le jeu fictif` (au moins trois lignes, cas joué, sortie obtenue, décision, avec des sorties réelles du rejeu). Avant d'arrêter les liens, demander à la forge ce qui existe déjà (`forge-seo.mjs liens <slug>`, lecture seule) et poser les liens sortants maintenant.
3. **Préparer** : `blog-forge.mjs preparer <slug>` ouvre et copie les sources le jour même, construit les claims, rend la couverture et écrit le paquet de revue. Corriger la recette tant que `erreurs` n'est pas vide.
4. **Faire relire par un sous-agent** d'identité distincte de l'auteur, sur la page rendue : grille éditoriale, verdict métier par affirmation, grille image, et revue qualité à 100 points. Seuil 90 avec zéro défaut bloquant, et tout verdict autre que « soutient » se corrige **dans la recette**, jamais dans la revue.
5. **Sceller** : `sceller <slug>`, gate complet, build Astro compris. Deux tentatives de correction au plus.
6. **Publier** : passage en `go-production`, build et `lastmod:sync`, scellement de la surface Ressources et réaffirmation de la revue, puis `publier <slug>` et `publier` du pilier, qui a reçu un lien.
7. **Prouver et pousser** : `npm run build`, commit par pathspec (jamais `git commit -a`), push, attente du déploiement, contrôle en ligne (code HTTP, équivalence octet à octet sur l'URL du déploiement, sitemap renvoyé à Search Console).
8. **Fermer la boucle** : `forge-seo.mjs apres-publication <slug>` (extension F1) attend que la production serve le titre d'onglet, pose les baselines de dérive de l'article, de `/blog` et du pilier, inscrit la requête au registre et envoie le ping IndexNow. Puis une ligne dans `JOURNAL.md`.

Trois portes ferment ce cycle, et aucune ne s'ouvre à la main : un candidat préparé mais non scellé
fait échouer `blog:audit`, donc le build ; un article daté à partir du 19/09 sans la règle écrite est
refusé par la forge ; un article publié ne se modifie que par republication scellée.

## 3. Le jour sans créneau

Le calendrier n'attribue de créneau que du lundi au jeudi. Le vendredi, et toute journée sans ligne :
régénérer le plan et vérifier les statuts, relever l'indexation, traiter au plus deux tâches de la
file de maintenance par republication scellée (F2), consigner, pousser. Le **premier vendredi du
mois**, avant tout le reste : `questions.mjs relever`, `rapport`, puis examiner les formulations
testées sans suggestion et les intentions potentiellement adverses : aucune suggestion n'établit
ni absence de demande ni volume nul. Confronter SERP, intention cabinet et Search Console avant
de décider une réécriture ou un écart, puis seulement `recaler` et `--check`. Environ
0,13 $ derrière la porte de coût (`RUNBOOK-QUOTIDIEN.md` §6).

## 4. Ce qui reste, daté

| Quand | Quoi | Condition de sortie |
|---|---|---|
| lundi 21/09/2026 | reprise de la cadence : quatre créneaux en semaine W39 (21, 22, 23 et 24/09), le premier planifié du calendrier | premiers articles à porter `## La règle écrite` et `## Rejoué sur le jeu fictif` ; c'est la première mise à l'épreuve réelle de `verifierRegleEcrite` |
| vendredi 02/10/2026 | premier relevé mensuel des questions après le recalage | examiner les formulations P3 sans suggestion relevée ; décider une éventuelle réécriture ou un écart seulement après SERP, intention cabinet et Search Console, sans déduire une absence de demande |
| mi-octobre 2026 | première lecture Search Console utile (les articles du 09 au 17/09 auront 28 jours) | décision sur la réécriture des six articles publiés, gelée jusque-là (`JOURNAL.md`, « Tranché » du 19/09) |
| fin novembre 2026 | photographie du plan candidat du 28/09 : 8 satellites et 1 pilier `published`, 41 satellites `planned` jusqu'au 30/11, soit 50 publiés/planifiés ; 2 `a-replanifier` et 1 `manque` hors compte | seuil « famille à zéro impression après trois satellites effectivement publiés » à examiner ; le plan n'est pas une promesse de publication |
| décembre 2026 | armement de C5 (décroissance et cannibalisation) | trois mois de série C2, sans quoi il n'a rien à comparer |
| sans date, attend Kevin | vague 2 du glossaire (14 termes, `GLOSSARY-PLAN.md` §3) | validation de la liste et du moment |
| sans date, attend Kevin | C4 autorité, entité et visibilité IA (décision D2), Bing Webmaster Tools et jeton Cloudflare Analytics (D3), champ « page d'origine » du formulaire (D4) | `CRONS-SEO.md` §7 |
| sans date, attend Kevin | série de cicatrices | décision sur ses trois premiers sujets (`JOURNAL.md`, « Tranché » du 19/09) |

Deux chantiers restent ouverts sans échéance et sans blocage : la chaîne de redirection de
`http://www.memlia.fr/`, qui passe par deux sauts au lieu d'un (avertissement constant de la
sentinelle depuis le 17/09, zéro impression perdue à ce jour) ; et le maillage du compte rendu
métier DSN, au plancher de trois liens entrants au dernier relevé d'intégrité.

## 5. Ce qui est périmé, et pourquoi

- **Les phases 1 à 3 de la version du 16/09** : les enablers de code sont livrés (sujets étendus, cadence, forge, pilier en tête, registre `lastmod`), la vague 1 du glossaire est intégrée, et les deux premiers articles sont publiés depuis le 16/09.
- **Le calendrier de 36 articles** : remplacé par le backlog de 235 angles satellites plus le pilier, dont le plan tire 238 satellites (les trois articles antérieurs à la v3 compris) et un calendrier qui court jusqu'en novembre 2027.
- **`npm run blog:create` et la chaîne `blog:gate` / `blog:preview` / `blog:review`** : remplacés par la forge (`preparer`, `sceller`, `publier`), qui scelle le dossier sur ses octets.
- **`scripts/migrate-published-blog.mjs`** : il ne sert plus, les trois articles antérieurs à la v3 ayant rejoint la forge le 17/09 au soir avec une recette, des sources revérifiées et une revue neuve. Il ne servirait qu'à un article publié hors forge, et il ne sait pas accueillir une source revérifiée.
- **La facette « par famille de tâches » du hub Ressources** : sans objet depuis le retrait de `/ressources` (voir `SITE-STRUCTURE.md` §5).
- **La mesure fixée à fin décembre** : la première lecture utile est attendue à la mi-octobre, et les seuils de `SEO-STRATEGY.md` §8 sont désormais datés un par un.

## 6. Ce que cette feuille de route ne fait pas

- Depuis la décision ACCÈS du 20/09, elle peut créer une page commerciale par **tâche mesurée**,
  jamais par simple famille éditoriale : chaque page décrit une seule règle livrée, sans catalogue.
  L'architecture, le gabarit et les portes propres à ce flux vivent dans
  `ARCHITECTURE-ACCES-COMMERCIAUX.md` ; ces pages ne passent pas pour des articles.
- Elle ne fixe aucune cible de trafic et ne promet aucun résultat. Elle fixe des seuils de décision.
- Elle ne demande jamais l'indexation d'une URL : la sentinelle liste, Kevin clique.
- Elle ne modifie aucun article publié hors d'une republication scellée par la forge.
