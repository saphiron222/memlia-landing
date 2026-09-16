# Architecture v3 — un pilier, onze familles, un glossaire élargi

16 septembre 2026. Les 14 URL de la v2 (`../site-v2/PAGE-INVENTORY.md`) ne changent pas. La v3 ajoute des articles, des ancres de glossaire, et une facette « par tâche » sur le hub Ressources. Profondeur maximale : 2 clics depuis l'accueil pour tout article.

## 1. Arbre

```
/                                         accueil (inchangé)
├── /automatisation-cabinet-comptable     service : hub commercial de la catégorie (inchangé)
├── /methode  /garanties  /a-propos  /contact   (inchangés)
├── /blog                                 index : chapeau + pilier en tête + derniers articles
│   ├── /blog/automatiser-un-cabinet-comptable-la-carte-des-taches     PILIER (pillar-page)
│   ├── /blog/<satellite>                  36 articles v3, un par tâche (voir CONTENT-CALENDAR.md)
│   └── /blog/<3 articles publiés>         conservés, reliés au pilier (cluster paie-social)
├── /ressources                           hub : par rôle (existant) + par famille de tâches (v3)
├── /glossaire                            23 ancres existantes + 34 ancres v3 (GLOSSARY-PLAN.md)
└── /mentions-legales  /politique-de-confidentialite  /contact/merci  /contact/erreur   noindex (inchangés)
```

Le pilier est lié depuis `/blog` (en tête), depuis la page service (bloc « comprendre par la pratique »), et depuis chaque satellite. Chaque satellite est lié depuis le pilier et depuis 2 à 3 satellites de sa famille : **profondeur 2 garantie** (accueil → blog → article, ou accueil → service → pilier → article).

## 2. Règles d'URL

- Slug en français, **verbe à l'infinitif + tâche** : `automatiser-la-relance-des-pieces-clients`, `trier-la-boite-mail-du-cabinet-par-client-et-priorite`. Pas de date, pas de catégorie, pas de mot vide.
- **Une requête primaire par URL**, unique sur tout le site (contrôlée dans `cluster-plan.json`). Deux articles qui viseraient la même requête fusionnent.
- Le `cluster` et le `rolePrincipal` sont des champs du frontmatter, jamais des segments d'URL.
- Aucune page de catégorie ou de tag : le hub Ressources et le pilier tiennent ce rôle.

## 3. Hub-and-spoke et matrice de liens

| Lien | Sens | Règle |
|---|---|---|
| satellite → pilier | obligatoire | dans le corps, ancre « automatiser une tâche du cabinet » ou variante ; jamais « cliquez ici » |
| pilier → satellite | obligatoire | une ligne par tâche dans la carte, ancre = la tâche |
| satellite → satellite (même famille) | 2 à 3 | dans le corps, au moment où la tâche voisine intervient |
| satellite → satellite (autre famille) | 0 à 1 | seulement si la tâche enchaîne réellement (relance de pièces → relance d'honoraires) |
| satellite → glossaire | 1 à 2 | ancre sur le terme, vers `/glossaire#<ancre>` |
| satellite → page service ou méthode | 1 | le CTA de fin, un seul |

Minimum trois liens entrants par article, aucune orpheline, contrôle par `build-cluster-plan.py --check` avant chaque vague. Les trois articles publiés reçoivent un lien depuis le pilier et rendent un lien vers lui (ajout d'une ligne, réadoption du dossier scellé par `migrate-published-blog.mjs`, jamais à la main).

## 4. Le hub Ressources : ajouter « par famille de tâches »

Aujourd'hui `/ressources` classe par rôle (13 rôles) et par chemin (comprendre, faire vérifier, cadrer). La v3 ajoute une facette **par famille de tâches** (les onze clusters), parce que le lecteur arrive avec une tâche en tête avant un intitulé de poste. Implémentation : `src/data/resources.ts` expose déjà `cluster` via le frontmatter pipeline ; il manque un libellé par cluster et un bloc de rendu. À faire en vague 2, une fois les premiers satellites publiés (une facette vide nuit).

## 5. Le glossaire : de 23 à 57 ancres, même contrat

Chaque terme garde le contrat d'entrée (`GlossaryEntry`) : définition, contexte, exemple fictif, confusion courante, **frontière d'automatisation**, termes liés, liens internes, sources datées. Les 34 nouveaux termes sont listés dans `GLOSSARY-PLAN.md`. Chaque satellite renvoie vers 1 à 2 ancres ; chaque terme cite au moins un article qui l'emploie (règle « pas de terme sans article »). La chaîne de scellement (surfaces H/T, réaffirmation r4) est rejouée à chaque vague.

## 6. Ce que le code doit permettre (chantier avant la vague 1)

| Enabler | Fichier | Pourquoi |
|---|---|---|
| Étendre l'énumération `sujets` | `src/content.config.ts` | aujourd'hui limitée à paie, dsn, excel, production-sociale, methode, securite, cabinet ; ajouter pieces, saisie, lettrage, revision, fiscal, facturation, courriels, ia, donnees, juridique, pilotage, automatisation |
| Une image de tête par article | `src/data/images.mjs` + `docs/design/site-v2-proofs/` | le champ `image` exige un identifiant du manifeste ; les articles v3 utilisent des **cadres de preuve HTML** rendus par `render-proofs-v2.mjs`, un par famille, jamais une nature morte générée |
| Libellés des clusters | `src/data/resources.ts` | facette « par tâche » du hub (vague 2) |
| Compteurs de tests | `tests/proof/test_glossary.py`, `test_build.py` | 23 termes → 57 ; images 9 AVIF / 12 WebP → à réviser ; sitemap 12 → 12 + articles |
| Chapeau Blog | `src/pages/blog/index.astro` | le pilier en tête, sous le chapeau validé v2 |

## 7. Schéma et balisage

Inchangés : Article + BreadcrumbList sur les articles, DefinedTerm là où le glossaire le porte déjà, Organization/WebSite au niveau site. Aucun FAQPage nouveau (résultat enrichi retiré en mai 2026), jamais de HowTo. `lastmod` du sitemap : les articles portent leurs dates de frontmatter, les pages le registre `pages-lastmod.json` ; à chaque publication, `npm run lastmod:sync` avant le build.
