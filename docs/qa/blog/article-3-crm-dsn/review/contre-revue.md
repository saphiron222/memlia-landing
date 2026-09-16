# Contre-revue BLOG-A3 — comptes rendus métier DSN

Carte : `t_46ed91b5`. Date : 16 septembre 2026. Revue exécutée dans Claude Code, indépendamment du producteur `t_4b180449`.

**VERDICT : PASS — 99/100, 0 P0, 0 P1.** La publication en production est libérée pour `t_cb5e619c`.

## Candidat revu

| Élément | Valeur |
|---|---|
| Commit candidat | `d625b941501b4fa654b26e1352465b3dbfa3f8c3` (parent `8c368fb`) |
| Worktree source | `.worktrees/blog-a3-crm-dsn`, branche `wt/t_4b180449`, propre |
| Reprise de revue | `dcb2155` dans `.worktrees/blog-a3-crm-dsn-review` |
| Périmètre | 36 fichiers, `git show --check` code 0 |
| URL cible | `/blog/comprendre-les-comptes-rendus-metier-dsn` |
| Preview immuable | `https://6c8f8a89.memlia.pages.dev/blog/comprendre-les-comptes-rendus-metier-dsn` |
| Production au moment de la revue | HTTP 404, article non publié |

## Ce qui a été mesuré

| Contrôle | Résultat |
|---|---|
| `npm ci --ignore-scripts` | 0 vulnérabilité |
| `npm run check` | 84 fichiers, 0 erreur, 0 avertissement, 1 hint hérité |
| `npm run build` | 8 pages, 44 preuves Python, 23 médias, 9 tests de scripts |
| `npx playwright test` | 79/79 |
| Mutants `test_article_3_contract.py` | 7/7 |
| Largeurs 320 / 375 / 768 / 1024 / 1440 / 1920 | 0 débordement, 1 `h1`, image chargée partout |
| Lighthouse mobile | Performance 99, Accessibilité 100, Bonnes pratiques 100, SEO 100 |
| Lighthouse desktop | 100 sur les quatre axes |
| Sources primaires | 5/5 HTTP 200, relues le 16/09/2026 |
| Claims officiels | 21/21 confirmés mot pour mot (voir [matrice](matrice-claims.md)) |

Le plancher du dépôt est de 95 par axe. Aucune mesure Lighthouse n'existait sur cette page avant cette revue ; elle a été produite ici.

## Exactitude DSN — vérification indépendante des sources

Les cinq sources ont été rechargées et lues sans passer par les extractions du producteur. Les 21 claims officiels sont soutenus par un passage exact. Deux d'entre eux méritaient la vérification la plus stricte :

- **Portée du certificat de conformité.** Le cahier technique 2026.1, page 13, section 1.4.1.5, dit que le certificat est délivré « en précisant que celle-ci est conforme à la norme d'échange » et que « le compte rendu issu du certificat ne préjuge pas des demandes effectuées auprès de l'employeur par les organismes, les administrations ou les salariés, de rectifier ou mettre à jour les données inexactes ou incomplètes ». L'article restitue correctement cette borne et n'en fait jamais une validation de la paie.
- **Correction après retour.** La page de fiabilisation confirme la règle « annule et remplace » avant minuit la veille de l'échéance si cela est encore possible, sinon la correction dans la DSN du mois suivant. L'article la borne explicitement à la DSN mensuelle et renvoie à la consigne du retour pour les signalements d'événement. Cette prudence est justifiée : la source ne l'étend pas aux signalements.

L'article est parfois **plus prudent que sa source**, ce qui est sans risque : là où Net-entreprises écrit que le certificat « vous libère de vos obligations déclaratives vis-à-vis de la transmission de la DSN », le tableau de l'article retient « la transmission a atteint le niveau de conformité indiqué par le certificat ».

## Identité, interdits et SEO

| Point | Constat |
|---|---|
| Auteur | « Kevin Kitanga » 5 fois dans le HTML rendu, « Sauvaget » 0 |
| Statut non attesté | présent, avant le premier intertitre (position 4033 contre 4858 pour le premier `h2`) |
| Données interdites | 0 `tel:`, 0 numéro de TVA, 0 donnée client, 0 chiffre décoratif |
| Canonical | `https://memlia.fr/blog/comprendre-les-comptes-rendus-metier-dsn`, sans slash |
| Robots | `index, follow, max-image-preview:large` dans le build ; `noindex, nofollow` sur la preview |
| JSON-LD | BlogPosting, BreadcrumbList, Person, Organization, WebSite |
| Open Graph | image propre à l'article en 1200 × 675, `alt` rédigé, Twitter aligné |
| Diffusion | RSS, `sitemap-0.xml`, `llms.txt` et index Blog contiennent l'URL |
| Liens internes | 14 cibles, 0 morte ; 8 ancres de l'accueil résolues dans le DOM de `/` |
| Image | générée, 6 variantes AVIF et WebP, toutes présentes, `alt` non vide |

## Périmètre et cannibalisation

L'angle est strictement post-dépôt : identifier le retour, lire son statut dans sa source, rapprocher la donnée, tracer la décision, contrôler le retour suivant. L'article pré-DSN garde son angle de préparation avant transmission. Le maillage est bidirectionnel : le nouvel article renvoie vers la méthode de contrôle avant la DSN, et l'article pré-DSN reçoit un lien contextuel dans sa section « Après le dépôt ». Aucune requête primaire n'est partagée.

## Identité de la preview

Le HTML distant de la preview et le build local diffèrent de deux lignes. La seule divergence est la balise de mesure d'audience injectée par la plateforme Cloudflare avant la fermeture du corps. Tout le reste, y compris la totalité du contenu, est identique octet pour octet une fois la balise `robots` de preview écartée.

## Observations non bloquantes

**O1 — paraphrase compressée de la portée du certificat (précision, −1 point).** L'article écrit « ne préjuge pas des demandes ultérieures de rectification de données inexactes ou incomplètes ». La source nomme les demandeurs : les organismes, les administrations ou les salariés. Le sens est préservé et la borne reste juste, mais un lecteur pourrait croire la réserve limitée aux seules administrations. Correction possible plus tard, sans urgence : citer les trois demandeurs.

**O2 — double libellé « En bref ».** La page affiche un encart « EN BREF » issu du résumé, puis un second bloc « En bref » à puces dans le corps. Vérifié sur les trois articles : les deux articles déjà publiés portent exactement le même motif, aux mêmes positions. C'est la convention du gabarit, pas une divergence de ce candidat. Toute évolution toucherait les articles publiés et sort du périmètre de cette carte.

**O3 — capacité d'automatisation décrite.** La section sur l'automatisation décrit ce qu'un traitement peut préparer sur les retours DSN, alors qu'aucun module livré ne le fait aujourd'hui. La formulation reste conditionnelle, la limite « la mécanique prépare et signale, l'équipe autorisée décide » est affichée, et le registre éditorial classe ce point en méthode Memlia bornée. Cohérent avec la vente d'un service d'automatisation sur mesure ; aucune correction demandée.

## Score

| Critère | Points |
|---|---:|
| Exactitude et sourçage | 29 / 30 |
| Bornage et honnêteté éditoriale | 20 / 20 |
| SEO et technique | 20 / 20 |
| Périmètre et maillage | 15 / 15 |
| Identité et interdits | 15 / 15 |
| **Total** | **99 / 100** |

Score éditorial interne : il mesure la conformité au contrat de la carte, pas une probabilité de classement.

## Ce que cette revue ne prouve pas

Aucune attestation métier indépendante en paie ou en droit social n'a été produite. L'article l'affiche lui-même, avant le premier intertitre et dans ses métadonnées. La doctrine de chantier autorise la publication sous ce statut, à condition que la limite reste visible : elle l'est.

Les scores Lighthouse sont des mesures de laboratoire sur un serveur local. Ils ne préjugent pas des mesures de terrain en production.
