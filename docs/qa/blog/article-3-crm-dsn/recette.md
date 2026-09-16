# Recette BLOG-A3 — Comprendre les comptes rendus métier DSN

Date : 15 septembre 2026

Verdict : PASS local et distant, candidat publié non attesté

## Périmètre livré

- Article Astro : `src/content/blog/comprendre-les-comptes-rendus-metier-dsn.md`
- Route canonique : `/blog/comprendre-les-comptes-rendus-metier-dsn`
- Dossier éditorial : `editorial/articles/comprendre-les-comptes-rendus-metier-dsn/`
- Couverture : `img-25-comptes-rendus-metier-dsn`, six variantes AVIF/WebP
- Source et preuves : 33 claims enregistrés, 21 officiels vérifiés, 12 méthodes bornées
- Score indépendant : 94/100, 0 P0

## Tests mesurés

| Contrôle | Résultat |
| --- | --- |
| `npm run check` | PASS, 0 erreur |
| `npm run build` | PASS, 8 pages, 44 tests de preuve, 23 médias historiques scellés, 9 tests de scripts |
| `QA_URL=http://localhost:4321 npm run test` | PASS, 79/79 |
| Oracle BLOG-A3 | PASS, 7/7 |
| Sources vivantes | PASS, 5/5 HTTP 200 |
| Largeurs 320, 375, 768, 1024, 1440, 1920 | PASS, aucun débordement, image chargée, un H1 |
| Revue visuelle desktop pleine page | PASS, aucun défaut sérieux |
| Revue visuelle mobile 375 × 812 | PASS, aucun défaut sérieux |
| Revue image | PASS, 95/100, 0 P0 |
| Preview Cloudflare immuable | PASS, HTTP 200, commit `363a29a`, `X-Robots-Tag` et meta `noindex, nofollow` |

## Preview immuable

- URL : `https://4de61361.memlia.pages.dev/blog/comprendre-les-comptes-rendus-metier-dsn`
- Déploiement : `4de61361-893b-43cc-8ff0-fcc797628838`
- Branche Cloudflare : `preview-blog-a3-crm-dsn`
- Source Cloudflare relue : `363a29a`
- Vérification distante : HTTP 200, 76 493 octets HTML, canonical de production sans slash, image sociale article-spécifique, auteur Kevin Kitanga, statut non attesté et couverture présents.
- Retour arrière : `/Users/kevinkitanga/.npm-global/bin/wrangler pages deployment delete 4de61361-893b-43cc-8ff0-fcc797628838 --project-name memlia --force`

## Mutations négatives

`tests/proof/test_article_3_contract.py` vérifie que le contrat rougit lorsque :

1. une source primaire disparaît ;
2. une date de consultation devient périmée ;
3. un claim perd sa citation dans le corps ;
4. l’auteur n’est plus Kevin Kitanga ;
5. le statut non attesté est remplacé par une attestation fabriquée ;
6. le canonical est altéré ;
7. un lien interne cible une route 404.

Les mutations ne sont appliquées qu’en mémoire. Aucun fichier de production n’est modifié par la recette.

## Captures

- `article-1440x900.png` — première vue desktop.
- `article-375x812.png` — première vue mobile.
- `article-fullpage-1440.png` — intégration complète entre navigation et pied de page.
- `viewport-checks.json` — mesures des six largeurs.

## Limites

- L’absence d’attestation métier indépendante est volontairement visible ; elle n’empêche pas la publication selon la doctrine chantier.
- Aucun dossier ni donnée client réelle n’a été utilisé.
- La preview Cloudflare est déployée ; aucun push, aucune fusion et aucune publication de production n’a été effectué dans cette carte de réalisation.
