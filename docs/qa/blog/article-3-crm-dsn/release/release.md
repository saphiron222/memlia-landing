# Release BLOG-A3 — publication de l'article 3

Carte : `t_cb5e619c`. Date : 16 septembre 2026. Publication autorisée par Kevin sans go préalable (décision D1 du chantier).

**PUBLIÉ. Un incident de production est survenu pendant la release et a été résolu ; il est documenté ci-dessous.**

## Ce qui est en ligne

| Élément | Valeur |
|---|---|
| URL | `https://memlia.fr/blog/comprendre-les-comptes-rendus-metier-dsn` |
| Commit publié | `c338751`, poussé sur `origin/main` |
| Déploiement servant la production | `0943f09e`, URL immuable `https://0943f09e.memlia.pages.dev` |
| Verdict de revue ayant libéré la publication | `t_46ed91b5`, PASS 99/100, 0 P0 |

Le commit `c338751` contient le candidat approuvé `1788055` (l'article, rebasé depuis `d625b94`) et `c338751` (le rapport de contre-revue). Le rapport de revue a été intégré volontairement : il est la preuve qui autorise la publication, et la laisser dans une branche reproduirait l'accumulation de preuves non fusionnées triée le 15 septembre.

## Incident : le build git de Cloudflare a produit un déploiement vide

**Constat.** La poussée de `main` a déclenché le build git de Cloudflare Pages, déploiement `e38d6f91`, source `c338751`, annoncé terminé. Son URL immuable `https://e38d6f91.memlia.pages.dev` répondait **404 sur toutes les routes, accueil compris**. Sur l'apex, une lecture avec paramètre anti-cache rendait 404 sur les dix routes du site, tandis qu'une lecture sans paramètre rendait encore 200 avec un en-tête `age: 5003` : le cache servait l'ancien contenu et masquait une origine cassée.

**Ce que cela signifie.** Le site n'était pas encore visiblement tombé pour un visiteur dont la page était en cache, mais toute requête fraîche recevait 404, et l'expiration du cache aurait rendu la panne totale.

**Remède appliqué.** Déploiement explicite du `dist` construit et vérifié localement :

```
npx wrangler pages deploy dist --project-name memlia --branch main --commit-hash c338751 --commit-dirty=false
```

Déploiement `0943f09e` : 4 fichiers téléversés, 57 déjà présents. Les dix routes répondent 200 depuis l'origine immédiatement après.

**Précédent.** Le même mode de défaillance a été traité le 14 septembre 2026 : deux déploiements Production répondaient 404 pendant qu'un troisième servait l'ancien HTML, et la remise en service avait déjà exigé un déploiement explicite du `dist`. Le mécanisme n'a pas été corrigé depuis ; il faut donc considérer que **pousser `main` ne suffit pas à publier ce site**.

## Recette de production

Toutes les lectures ci-dessous ont été faites depuis l'origine, avec un paramètre anti-cache, après le redéploiement.

| Contrôle | Résultat |
|---|---|
| Routes `/`, `/blog`, les trois articles, RSS, sitemap, `llms.txt`, deux pages légales | 10 / 10 en HTTP 200 |
| En-têtes de l'article | 200, `cf-cache-status: DYNAMIC`, aucun `X-Robots-Tag` |
| Meta robots de l'article | `index, follow, max-image-preview:large` |
| Pages légales | `noindex, follow`, inchangé |
| Canonical | `https://memlia.fr/blog/comprendre-les-comptes-rendus-metier-dsn`, sans slash |
| `h1` | 1 |
| JSON-LD | BlogPosting, BreadcrumbList, Person, Organization, WebSite |
| Open Graph | couverture propre à l'article, 1200 × 675 |
| Auteur | « Kevin Kitanga » 5 fois, « Sauvaget » 0 |
| Données interdites | 0 `tel:`, 0 numéro de TVA, 0 donnée client |
| Statut non attesté | présent |
| Images de couverture | 6 / 6 en HTTP 200, AVIF et WebP, trois largeurs |
| Diffusion | RSS, `sitemap-0.xml`, `llms.txt` et index Blog citent l'article |
| Playwright contre `https://memlia.fr` | 79 / 79 |
| Articles précédents | les deux répondent 200 et ne sont pas régressés |

## Contrôles avant publication

Rejoués sur le checkout exact de la release, après rebase sur `main` :

`npm ci --ignore-scripts` sans vulnérabilité ; `npm run check` 85 fichiers et 0 erreur ; `npm run build` 8 pages, 44 preuves Python, 9 tests de scripts ; `npx playwright test` 79 / 79 ; Lighthouse mobile sur l'article 99 / 100 / 100 / 100 et sur l'accueil 100 / 100 / 100 / 100, au-dessus du plancher de 95 par axe.

## Retour arrière

Dernier état sain avant cette release : commit `939464c`, déploiement `124724e9-f3f8-488d-93a7-62f582f1354c`.

Pour revenir à cet état, la voie fiable est le déploiement explicite, pas la seule manipulation de `main` :

```
cd /Users/kevinkitanga/dev/interne/memlia-landing
git revert --no-edit c338751 1788055
git push origin main
git checkout 939464c -- . && npm ci --ignore-scripts && npm run build
npx wrangler pages deploy dist --project-name memlia --branch main --commit-hash 939464c --commit-dirty=false
curl -sI "https://memlia.fr/?v=$(date +%s)"
```

Le retour arrière restaurerait un site sans l'article 3 et sans les couvertures Open Graph propres à chaque article.

## Conséquence pour les releases suivantes

Les publications restantes du chantier, le Hub Ressources puis le site v2, doivent appliquer la même séquence : pousser `main`, puis **déployer explicitement le `dist` vérifié**, puis lire l'URL immuable du déploiement avant de conclure. Un déploiement annoncé terminé par la plateforme ne prouve pas que son contenu est servi.
