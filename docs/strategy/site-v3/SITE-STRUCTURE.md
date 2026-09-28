# Architecture v3 : l'arbre du site en ligne

Écrite le 16 septembre 2026, remise à l'état réel le 19 septembre puis réconciliée le 28 septembre
avec `src/pages/`, `src/components/Nav.astro`, `Footer.astro` et les registres de contenu. Les
chiffres d'indexation du 18/09 ci-dessous sont historiques, non un relevé de production du 28/09.

## 1. L'arbre réel

```
/                                         accueil
├── /automatisation-cabinet-comptable     service : hub commercial de la catégorie
├── /methode  /garanties  /a-propos  /contact
├── /blog                                 le pilier en tête, hors liste, puis « Les articles »
│   ├── /blog/automatiser-un-cabinet-comptable-la-carte-des-taches    PILIER (pillar-page)
│   ├── /blog/automatiser-la-relance-des-pieces-clients
│   ├── /blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier
│   ├── /blog/comprendre-les-comptes-rendus-metier-dsn
│   ├── /blog/controler-les-bulletins-de-paie-avant-la-dsn
│   ├── /blog/suivre-la-production-sociale-dans-excel
│   ├── /blog/pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils
│   ├── /blog/cabinet-comptable-surcharge-de-travail-ou-passe-le-temps
│   ├── /blog/intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain
│   └── /blog/rubrique/{paie-dsn-cabinet-comptable,gestion-pieces-comptables}
├── /automatisation/<tache>                pages de service publiées (collection services)
├── /integrations                          hub et guides tâche × environnement, seulement candidats admis
├── /outils-comptables-gratuits            hub et outils disponibles, témoin local non indexable
├── /glossaire                            53 ancres
├── /blog/rss.xml                         flux
└── /mentions-legales  /politique-de-confidentialite  /contact/merci  /contact/erreur   noindex
```

La mesure « 14 URL au sitemap, 14 indexées » est le dernier relevé du **18/09**, non le compte
actuel. Ne pas en déduire l'indexation des routes nouvelles : compter le sitemap construit et
mesurer Search Console séparément. Neuf fichiers d'article sont publiés au HEAD du 28/09.
**Incident FE :** au candidat local du 28/09, `src/data/site.mjs` exclut l'article de saisie
du sitemap et `Article.astro` applique aussi `noindex` au HTML statique de cette route :
le test du `dist` (`tests/proof/test_build.py`) constate `noindex, follow`, avec canonical
propre. La fonction Pages `functions/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier.js`
est conçue pour servir 503 avec `X-Robots-Tag: noindex, nofollow` sur GET et HEAD ; ni le
HTML local ni ce code ne prouvent la réponse effectivement servie en production. La suspension
ciblée reste à maintenir, sans réouverture de l'article ni retrait de sa route/canonical par
un pansement. Avant de déclarer la suspension effective, contrôler GET/HEAD du déploiement
exact (statut, en-têtes robots), le HTML rendu et le sitemap ; sans ce contrôle, état servi inconnu.
`Footer.astro` tire les services publiés de la collection, les outils disponibles de `outils.ts`,
les intégrations indexables de `integrations.ts` et les rubriques de `blog-rubriques.mjs` ; un
fichier présent ne prouve ni publication, ni entrée au sitemap. `Nav.astro` garde l'accès lisible
aux grands parcours, sans menu de tâches exhaustif.

**`/ressources` n'existe plus.** La page a été retirée le 16/09/2026 au soir sur décision de Kevin
et rend 404 (`JOURNAL.md`, ligne du 16/09). « Ressources » est devenu un **groupe de navigation**,
sans page propre, qui réunit le blog et le glossaire : un bouton et un panneau qui s'ouvre au
survol, au focus ou au clic, et qui se marque courant dès qu'une de ses destinations l'est
(`src/components/Nav.astro`). Le pied de page porte la même colonne « Ressources » (Blog,
Glossaire, Questions fréquentes, `src/components/Footer.astro`). Conséquence à ne pas oublier : la
surface Ressources scellée par la chaîne de preuve est **le glossaire seul**.

Le pilier est lié depuis `/blog` (dans son propre bloc au-dessus de la liste, avec la pastille « À
lire en premier »), depuis la page de service, depuis le glossaire et depuis chaque satellite. Il est
**absent de la liste** : épinglé dedans, il donnait à lire un ordre faux dès qu'un satellite portait
une date postérieure. La règle est contrôlée deux fois, côté Python (`test_build.py`, helper
`pillar_slugs()` qui lit `format: pillar-page` à la source) et côté navigateur (`blog.spec.ts`), et
la décision est écrite dans `JOURNAL.md`, « Tranché » du 17/09.

## 2. Règles d'URL

- Slug en français, **verbe à l'infinitif puis tâche** : `automatiser-la-relance-des-pieces-clients`. Pas de date, pas de catégorie, pas de mot vide.
- **Une requête primaire par URL** : `build-cluster-plan.py --check` refuse les doublons dans son plan blog ; les contrats inter-surfaces vivent aussi dans `config/page-intent-contract.json` et `config/page-route-contracts.json`. Deux articles sur la même intention fusionnent.
- `cluster`, `famille` et `rolePrincipal` sont des champs du frontmatter, jamais des segments d'URL.
- Deux rubriques utiles sous `/blog/rubrique/`, créées à partir de `blog-rubriques.mjs` avec au
  moins deux articles visibles chacune ; pas de page par tag ou par pôle vide. Le pilier reste
  transversal et hors rubrique.
- `/automatisation/` n'est pas un second hub ; les pages de tâche conservent leur canonical
  propre, tout comme les guides `/integrations/<slug>` et les outils. Pas de canonical croisé
  entre service, article, guide et outil tant que leurs intentions restent distinctes.
- Une republication ne change jamais l'URL ni la date de publication ; elle porte `updatedAt` dans la recette et `dateMiseAJour` dans le frontmatter.

## 3. Le maillage, tel qu'il est contrôlé aujourd'hui

| Lien | Sens | Règle |
|---|---|---|
| satellite vers pilier | obligatoire | dans le corps, ancre « automatiser une tâche du cabinet » ou variante ; jamais « cliquez ici » |
| pilier vers satellite | obligatoire | une ligne par tâche dans la carte, là où la famille est nommée, ancre = la tâche |
| satellite vers satellite (même famille) | 2 | dans le corps, au moment où la tâche voisine intervient |
| satellite vers satellite (autre famille) | 0 à 1 | seulement si la tâche enchaîne réellement |
| satellite vers glossaire | 1 à 2 | ancre sur le terme, vers `/glossaire#<ancre>` |
| satellite vers page de service ou méthode | 1 | le bloc d'appel de fin, un seul bouton principal |

Deux contrôles, deux moments. **Au `--check`**, avant chaque vague : unicité des slugs et des
requêtes primaires, appartenance aux énumérations du schéma, lien obligatoire satellite vers pilier,
minimum de trois liens entrants par article, aucune orpheline, plafonds de cadence, et depuis le
19/09 l'invariant « P1 du backlog, publiée comprise : date et signal primaire positif, sauf l'angle IA publié dont les deux formulations à zéro et les questions correspondent à la SERP par famille du 19/09 » (la date seule ne certifie pas la complétude ; trois historiques synthétiques et série hors gate ; aucun article publié réécrit). **Chaque mercredi**, le cron C3
mesure sur la production (`RUNBOOK-SEO.md` §4) :

- **liens entrants par article**, plancher 3. Dernier relevé, le 17/09 : pilier 5, relance 7, saisie 6, compte rendu métier DSN 3, bulletins 7, production sociale 6 (`mesures/semaine-2026-W38-integrite.json`). Le compte rendu métier DSN est au plancher.
- **ancres** : rouge sur une ancre qui ne décrit rien (« ici », « cet article ») et sur une ancre qui mène à deux destinations différentes selon la page. Le nombre d'ancres distinctes par destination est rendu **en info, sans verdict** : répéter l'ancre la plus claire est voulu.
- **routes** : une page qui nomme des tâches sans mener à aucun article, un article auquel seul le blog mène. Quatre pages surveillées, `/`, `/automatisation-cabinet-comptable`, `/methode`, `/garanties` ; `/contact` en est exclue par décision, en sortir dessert. Ce volet ne dépose aucune tâche : ses correctifs vivent hors de la forge.
- **sources et vitesse** : réouverture de chaque source citée avec recherche de la citation exacte, PageSpeed mobile sur six pages, plancher 95.

Le relevé du 17/09 portait quatre rouges (les trois articles antérieurs à la v3 ne liaient pas le
pilier, et une fiche Service-Public réécrite dont la citation avait disparu). Les quatre ont été
clos le 17/09 au soir sur `e651bb1` (`JOURNAL.md`). **Ils n'ont pas été remesurés depuis** : le
prochain relevé d'intégrité est celui du mercredi.

## 4. Le glossaire : 53 ancres

`src/data/glossary.ts` porte 53 termes, et `tests/proof/test_glossary.py` en exige exactement 53 :
ancres, termes, définitions (uniques), exemples fictifs, confusions courantes, frontières
d'automatisation, blocs de sources et `DefinedTerm` du `DefinedTermSet`, chacun compté à 53.
Chaque terme garde son contrat d'entrée ; chaque
satellite renvoie vers 1 à 2 ancres ; chaque terme cite au moins un article qui l'emploie. La vague
2 a intégré dix termes ; quatre termes réglementaires attendent une revue métier vérifiable,
sans date de publication promise (`GLOSSARY-PLAN.md`).

## 5. Ce que le code fait déjà

| Capacité | Où | État |
|---|---|---|
| Taxonomie en source unique, lue par le schéma, le plan et les tests | `src/data/familles.ts`, `famille` dans `src/content.config.ts` | fait : 60 familles, 12 pôles, `audit-legal` listée et non ouverte |
| Sujets bornés au métier, étendus à la v3 | `src/content.config.ts` | fait : 19 valeurs, dont les 12 ajoutées (automatisation, pieces, saisie, lettrage, revision, fiscal, facturation, courriels, ia, donnees, juridique, pilotage) |
| Cadence codée | `CANDIDATS_PAR_JOUR_MAX`, `CANDIDATS_PAR_SEMAINE_MAX`, `verifierPlafonds` | fait, testé |
| Image de tête par article | brief à six composantes, génération sous budget, recadrage 1920x1080, OG 1200x630, dérivés 768/1200/1600 en AVIF et WebP | couverture seulement ; deux preuves dans le corps viennent de cadres HTML figés (`RUNBOOK-QUOTIDIEN.md` §3) |
| Pilier hors liste, en tête du blog | `src/pages/blog.astro` | fait, contrôlé côté Python et côté navigateur |
| Groupe de navigation « Ressources » | `src/components/Nav.astro`, `src/components/Footer.astro` | fait ; la page `/ressources` est retirée |
| Compteurs de tests | `tests/proof/test_glossary.py` (53), `test_build.py` (`PUBLIC_ARTICLES`, 9 slugs) | fait, à revalider avec chaque publication et vague de glossaire |
| Registre `lastmod` | `npm run lastmod:sync`, `src/data/pages-lastmod.json` | pages dans le registre, articles datés par frontmatter ; lire le registre plutôt que reprendre le compte du 19/09 |
| Exigence « la règle écrite » | `DEBUT_REGLE_ECRITE`, `verifierRegleEcrite` (`scripts/blog-forge.mjs`) | fait le 19/09, témoin de mutation joué |

Ce qui reste, et qui n'est pas urgent : aucune facette « par famille de tâches » n'existe, et elle
n'a plus de page d'accueil depuis le retrait de `/ressources`. Si le besoin revient, il se pose sur
`/blog`, pas sur un hub : une facette à 59 familles actives pour neuf articles serait une
facette vide (familles lues dans le frontmatter `famille:` des articles publiés). À rouvrir quand
plusieurs familles auront leurs quatre satellites publiés, pas avant.

## 6. Schéma et balisage

Inchangés : `Article` et `BreadcrumbList` sur les articles, `DefinedTerm` porté par le glossaire,
`Organization` et `WebSite` au niveau du site. Aucun `FAQPage` nouveau (résultat enrichi retiré en
mai 2026), jamais de `HowTo`.

Depuis le 17/09, l'identité d'entité est **une définition unique** dans `src/data/schema.mjs`, émise
à l'identique par les cinq surfaces, avec l'invariant « un `@id`, une définition » et six preuves
dédiées : les surfaces divergeaient sous le même `@id`, ce qui est le levier de la confirmation
d'entité, pas la page (`JOURNAL.md`, ligne du 17/09).

`lastmod` du sitemap : les articles portent leurs dates de frontmatter, les pages le registre
`pages-lastmod.json`. À chaque publication ou modification de copy : `npm run lastmod:sync` avant le
build, puis la chaîne Ressources (scellement des surfaces et réaffirmation de la revue), puis
`npm run build`.
