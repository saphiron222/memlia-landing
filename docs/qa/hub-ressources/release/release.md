# Publication du Hub Ressources et du Glossaire

Carte `t_4cd25435`. 16 septembre 2026.

**EN LIGNE.** `https://memlia.fr/ressources` et `https://memlia.fr/glossaire`.

## Ce qui est publié

| | |
|---|---|
| Commit | `c4022d5`, poussé sur `origin/main` |
| Déploiement servant la production | `b209976f` |
| Décision de publier | déléguée par Kevin le 16 septembre, consignée sur `t_af5e3388` |
| Statut du contenu | **non attesté** : aucun professionnel de la paie ou du droit social ne l'a validé |

## Le défaut de construction s'est reproduit, et il était attendu

La poussée a déclenché la construction automatique de la plateforme, déploiement `35a1e802`, annoncé actif. Son URL immuable répondait **404 sur l'accueil comme sur `/ressources`** : dossier vide, exactement comme lors de la publication de l'article ce matin et comme le 14 septembre.

La séquence prévue a tenu : pousser, **attendre la fin de la construction**, puis déployer explicitement le dossier vérifié. Le déploiement `b209976f` sert désormais la production. Déployer avant la fin de la construction ne sert à rien, elle écrase — c'est l'erreur commise ce matin.

Le défaut lui-même reste ouvert sur la carte `t_47aa0a6f`.

## Recette de production

Lectures depuis l'origine, avec paramètre anti-cache, après le déploiement explicite.

| Contrôle | Résultat |
|---|---|
| Routes | 12 / 12 en HTTP 200 : accueil, les deux nouvelles pages, le blog et ses trois articles, RSS, sitemap, `llms.txt`, deux pages légales |
| Robots des deux nouvelles pages | `index, follow, max-image-preview:large` |
| Pages légales | `noindex, follow`, inchangé |
| Canonical | exact et sans slash sur les deux pages |
| `h1` | un seul par page |
| JSON-LD | CollectionPage, ItemList, BreadcrumbList, Organization, WebSite pour le Hub ; CollectionPage, DefinedTermSet, BreadcrumbList, Organization, WebSite pour le Glossaire |
| Sitemap | 7 URL, les deux nouvelles incluses |
| Données interdites | aucune : ni téléphone, ni numéro de TVA |
| Correction du 16 septembre | « Pour être licite » est en ligne ; « Sauf exception » a disparu |
| Playwright contre la production | 98 / 98 |
| Lighthouse bureau, `/ressources` | 97 / 100 / 100 / 100 |
| Lighthouse bureau, `/glossaire` | 96 / 100 / 100 / 100 |
| Blog et articles | non régressés, tous en 200 |

Les deux scores de performance sont au-dessus du plancher de 95 exigé par le dépôt.

## Retour arrière

Dernier état sain avant cette publication : commit `de3d821`, déploiement `3a32907d-be1c-4b38-b117-15cc4a9ce8e6`.

```
cd /Users/kevinkitanga/dev/interne/memlia-landing
git revert --no-edit c4022d5..HEAD && git push origin main
git checkout de3d821 -- . && npm ci --ignore-scripts && npm run build
npx wrangler pages deploy dist --project-name memlia --branch main --commit-dirty=false
curl -sI "https://memlia.fr/?v=$(date +%s)"
```

Le retour arrière retirerait les deux pages et rendrait au site son état d'avant la publication, article 3 compris s'il remonte plus haut que `de3d821`.

## Une observation, pour la suite

Le Glossaire affiche la mention « contenu non attesté » ; **le Hub ne l'affiche pas**, alors qu'il présente directement des affirmations réglementaires sensibles dans ses résumés : échéance de l'annule et remplace, portée de Dsn-Val, nature des comptes rendus métier.

Le Hub énonce bien la posture de service — « sans céder la décision humaine », « chaque ressource distingue ce qui peut être préparé de ce que le professionnel doit valider » — et ses affirmations sont sourcées et exactes. Il lui manque la phrase explicite que portent le Glossaire et les trois articles.

Ce n'est pas une erreur factuelle et cela ne justifiait pas de retenir la publication. C'est une inégalité de transparence entre surfaces, à corriger lors de la prochaine passe de contenu. Une carte la porte.
