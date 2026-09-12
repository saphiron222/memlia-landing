# Retrait R7 de l’export public — recette du 12 septembre 2026

## Verdict

**VERT sur la preview uniquement.** Le post-build exclut systématiquement `dist/media/r7/` après la copie Astro de `public/`. Les quatre fichiers R7 historiques restent dans le dépôt et les manifestes historiques restent inchangés ; aucun fichier R7 n’est présent dans l’export livré à Cloudflare.

Aucune production, fusion de `main` ou poussée GitHub n’a été effectuée.

## Sujet

| Champ | Valeur |
|---|---|
| Carte | `t_9712f072` |
| Commit du correctif | `03035c482c45ea8480a3af00ad210f96413089bd` |
| Branche Cloudflare | `preview-r7-export` |
| Environnement | Preview |
| Déploiement | `9dd0fea0-a5d8-43c5-8804-b924d12e3cdf` |
| URL immuable | https://9dd0fea0.memlia.pages.dev |
| Alias | https://preview-r7-export.memlia.pages.dev |

Le projet Cloudflare réellement vérifié est `memlia` ; la fiche de publication précédente documente déjà que `memlia-landing` est un ancien nom erroné.

## Correctif borné

- `scripts/strip-briefs.mjs` : compte puis retire récursivement `dist/media/r7/`, vérifie en fail-closed que le dossier ne subsiste pas, et annonce le nombre exclu.
- `tests/proof/test_integrated_media.py` : contrôle séparément l’absence d’assets R7, l’absence de références R7 dans les surfaces exportées, les quatre assets R8 attendus et l’unicité du lecteur DOM R8.
- Sources R7, R8, design, copy, SEO, règles `approvals.deny` et manifestes historiques : inchangés.

## Rouge → vert

| Contrôle | Rouge observé | Vert observé |
|---|---:|---:|
| Build avant correctif | 1 échec sur 35 tests Python ; 4 chemins R7 détectés | — |
| Build après correctif | — | 37/37 Python, 23/23 images, 7 pages |
| Poison de référence `media/r7` dans `dist/index.html` | 1/8 rouge, `index.html` nommé | 8/8 après restauration par copie |

Le build vert annonce explicitement : `4 asset(s) R7 exclu(s) de dist/media/r7/`.

## Trois passes

| Passe | Commande / instrument | Résultat |
|---|---|---|
| Suites | `QA_URL=http://127.0.0.1:4322 npm run test` | 76/76 Playwright, 0 échec |
| Types | `npm run check` | 81 fichiers, 0 erreur, 0 warning, 1 hint hérité |
| Build | `npm run build` | 7 pages, 37/37 Python, 23/23 images |
| Recalcul indépendant | `npm run test:proof-render` | 9 PNG et 21 actifs recalculés identiques |
| Export local | parcours indépendant des 54 fichiers de `dist` | 0 asset R7, 0 référence R7, 4 assets R8 |
| Preview média | Playwright distant ciblé | 8/8 ; R8 charge, durée 45 s, lecture amorcée et VTT 20 cues aux six largeurs |
| Écran | captures réelles 375 et 1440 px | un lecteur visible, source R8, aucun débordement horizontal |

La première invocation locale de `npm run test` a atteint un serveur concurrent périmé sur le port 4321 et rendu 61/76. Elle est exclue : le serveur de ce `dist` avait choisi 4322. Le rejeu avec `QA_URL` explicite a rendu 76/76.

## Vérification HTTP de la preview

Le JSON détaillé est `preview-http.json` dans ce dossier.

| Contrôle | Résultat |
|---|---:|
| Chemins R7 connus | 8/8 HTTP 404 — quatre chemins sur l’URL immuable et l’alias |
| Assets R8 | 4/4 HTTP 200, SHA-256 identiques au `dist` |
| Accueils | 2/2 HTTP 200 avec `X-Robots-Tag: noindex` |
| Lecteur DOM | 1, source `/media/r8/animatique-hero-45s.mp4` |
| Surfaces HTML/XML/JS/CSS/JSON servies | 11 contrôlées, 0 référence `media/r7/` |

Les captures de travail sont conservées sous `.qa/r7-export/preview-375.png` et `.qa/r7-export/preview-1440.png` ; elles ne sont pas versionnées.

## Limites

- La recette prouve la preview et le mécanisme de build ; elle ne change pas la production actuelle.
- La lecture distante ciblée prouve le chargement, la durée, l’amorce de lecture et les sous-titres. Elle ne revendique pas une nouvelle lecture intégrale de 45 secondes.
- Aucun changement visuel n’étant dans le diff, les grands aplats très pâles des preuves restent ceux du candidat approuvé ; les neuf images ont néanmoins chargé à leur largeur intrinsèque attendue dans la suite Playwright.
