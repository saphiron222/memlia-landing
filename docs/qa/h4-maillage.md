# H4 — revue indépendante du maillage

**Verdict : PASS, limité au lot liens H4.** Aucun changement de fond métier constaté. Cette revue n'autorise ni scellement ni publication et ne clôture aucune carte.

- Relecteur : `qa:h4-independent-hermes`, agent IA délégué à la QA, distinct de l'auteur `kevin`. Ce n'est pas un CAC humain ni une seconde personne humaine revendiquée.
- Revue unique du lot, le 07/10/2026 en CEST ; contrôles navigateur enregistrés à `2026-10-06T22:55:53.495Z` (UTC).
- Branche : `site/h4-links-t_3a63473a` ; référence HEAD examinée : `64d38238ef6c1b7b5563a4e97e1878b8fe2c3e57`.
- Périmètre : DECISIONS-H4.md, diff des pages/données outils et de la recette du pilier, paquet-revue, sources renouvelées, revues B2 et règles de liaison `scripts/lib/blog-review-binding.mjs`, puis rendu local.

## Contrôle éditorial et destinations

Les huit entrants hors blog sont présents dans `main`, au geste concerné, et non ajoutés au footer :

| Source | Destination blog | Ancre visible |
|---|---|---|
| /automatisation-cabinet-comptable | cabinet-comptable-surcharge-de-travail-ou-passe-le-temps | repérer où passe le temps du cabinet |
| /automatisation-cabinet-comptable | intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain | ce que l’IA prépare et ce qui reste humain |
| /integrations | automatiser-avec-ia-sans-changer-logiciel | écrire le passage entre les outils |
| /garanties | ia-comptabilite-confidentialite-donnees | préparer les données avant de les confier à une IA |
| /methode | logiciel-ia-comptabilite | comparer le parcours complet d’un outil IA |
| /methode | tests-verts-et-regle-des-trois-passes | recetter le parcours en trois passes |
| /outils-comptables-gratuits/generateur-prompt-expert-comptable | utiliser-chatgpt-cabinet-comptable | choisir un premier usage utile de ChatGPT |
| /outils-comptables-gratuits/verificateur-prompt-ia | verifier-reponse-ia-comptabilite | vérifier ensuite la réponse produite |

Le vérificateur précise explicitement que son contrôle porte sur la consigne et non sur la fiabilité de la sortie. Aucun nouveau fait juridique ou garantie de conformité.

Le corps du pilier contient les quatre satellites surcharge, métier IA, premier usage ChatGPT et vérification de réponse, dans quatre transitions courtes. L'ancre `définition du rapprochement bancaire` pointe vers `/glossaire#rapprochement-bancaire`, dont l'identifiant existe dans le DOM. La formulation métier du paragraphe est préservée : seule la parenthèse de renvoi change. Les tableaux, frontières EC/CAC, exemples, citations et preuves inline sont inchangés.

Le hub affiche **16 cartes disponibles** avec un `libelleAction` canonique visible et parlant, distinct pour chaque destination. Les 13 outils du relevé H4 sont une baseline historique, pas un plafond. L'ajout de « Sans compte » dans l'introduction conserve l'information retirée des ancres répétitives ; ce n'est pas une réécriture des descriptions SEO. Aucun titre, description SEO, promesse d'outil, image ni CSS n'est modifié par le lot examiné.

Les contrôles navigateur ont ouvert **33 destinations distinctes** liées depuis ces pages (articles et outils) : toutes en HTTP 200 local. Le fragment glossaire est présent. Ces constats concernent le build local et non le site public.

## Continuité des preuves, sans avis métier inventé

La recette diffère de HEAD uniquement par la référence du calendrier fiscal, devenue `https://www.impots.gouv.fr/professionnel/calendrier-fiscal/2026-09`. Elle fixe le mois déjà nommé dans l'exemple, sans étendre sa portée. Le metadata de la source renouvelée donne HTTP 200, requestedUrl/finalUrl identiques, consultation 07/10/2026 et SHA-256 `b8099015d8289529a05582a4829329cad507ad5d5689f1b72267cd09e4b30186`.

Les six objets claims de la recette sont strictement identiques à HEAD. Les six citations se retrouvent dans les nouvelles copies officielles après décodage HTML et normalisation des espaces/apostrophes. Les contextes extraits ont été relus : qualification au cas par cas fondée sur les faits ; conservation minimale variable ; définition CRM ; TVA mensuelle septembre 2026 et date propre à l'espace professionnel ; minimisation selon les finalités ; durée issue de l'analyse de conformité, avec durées réglementaires possibles. Aucun passage de fond nouveau ne justifie un nouvel avis métier.

Les anciennes empreintes des copies du 29/09 et les raisonnements B2 ne sont pas présentés comme des avis nouvellement rendus sur les copies du 07/10. La revue B2 entière, anciennes notes et provenance comprises, est conservée dans [revues-b2-historique.json](h4-maillage/revues-b2-historique.json). Les nouvelles empreintes, citations et contextes sont dans [checks.json](h4-maillage/checks.json). Les scores qualité/image historiques ne sont ni recalculés ni réattribués au relecteur H4.

## Exécutions et rendu

- `node --test tests/scripts/h4-context-links.test.mjs` : **10 PASS, 0 FAIL**.
- `BLOG_PREVIEW_SLUGS=automatiser-un-cabinet-comptable-la-carte-des-taches npx astro build` : code de sortie 0, **64 pages** générées. Dist technique local seulement ; preview du pilier en `noindex, follow`.
- Chromium réel via Playwright, serveur HTTP local éphémère fermé à la fin : **48 contrôles**, soit huit routes aux largeurs **320, 375, 768, 1024, 1440 et 1920 px**. Aucun débordement horizontal du document (`scrollWidth <= clientWidth`).
- Captures pleines pages du hub réellement produites et inspectées : [1440 px](h4-maillage/hub-outils-1440.png), [375 px](h4-maillage/hub-outils-375.png). Les 16 liens sont lisibles, non tronqués, sans collision ; les libellés longs reviennent proprement à la ligne sur mobile.
- `git diff --check` : code de sortie 0.

## Empreinte officielle et liaison

La commande prescrite avec `dist/blog/<slug>/index.html` a réellement été exécutée mais a retourné **ENOENT** : ce build Astro émet une route `.html`, pas un répertoire `index.html`. Sans modifier de commande gate, de code ou de configuration, l'empreinte officielle a ensuite été obtenue sur le fichier réellement construit :

```sh
node scripts/blog-forge.mjs empreinte automatiser-un-cabinet-comptable-la-carte-des-taches dist/blog/automatiser-un-cabinet-comptable-la-carte-des-taches.html
```

| Empreinte | Valeur |
|---|---|
| bodySha256 | `3374e1dd0cf6d2f4f8368fb8a76598044655d7e2d9ba44c0213a6ff31f8c8005` |
| recipeSha256 | `31b9ef6d625d1a33c7886fc6fe7192faafad97b156f6ff9fe92ca6cc486fea7e` |
| recipeSubstanceSha256 | `246a4cf9fcc1249a4f84851d6799f0f99bfe20dc6e2dac199752d0886adc6f09` |
| renderedSha256 | `ece021589285963f4bcc8ef8c3b6c79465479ee36ee2b3ec4ed0c93f3ea428c5` |

L'empreinte de substance de la recette reste celle de B2 ; le changement d'URL ne constitue pas un nouvel avis de fond. Le PASS scoped H4 et son identité indépendante sont inscrits dans `editorial/recettes/automatiser-un-cabinet-comptable-la-carte-des-taches/revues.json`, lié à ces quatre empreintes. Les anciennes observations y sont explicitement historiques et sauvegardées intégralement avant modification. Vérification exécutée après liaison : `reviewBindingErrors(...)` retourne `[]` sur le corps, la recette et le HTML réellement construit ; assertions d'égalité réussies pour les anciens raisonnements métier, critères image, observations sources et score B2. L'identité éditoriale H4 est distincte de `kevin`.

## Limites et suite relevant du parent

- Aucun sceau, statut public, commande de publication, gate ou carte modifié par cette QA.
- Les preuves générées par `preparer` encore en FAIL faute de liaison valide au moment de leur génération ne sont **pas** réécrites manuellement en PASS ; le parent doit rematérialiser le candidat à partir de cette liaison.
- Pas de CI complète, de validation de production, de mesure SEO, de comparaison J+28 ni de chantier llms/titres dans cette revue.
- Les autres fichiers déjà modifiés à l'arrivée (manifestes ressources, lastmod, mesures titres et preuves matérialisées) ne constituent pas une approbation supplémentaire par cette revue scoped.
