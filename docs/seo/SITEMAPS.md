# Sitemaps par type de page

## Organisation

`/sitemap.xml` reste l'index déclaré par robots.txt et par le site. Il est identique à `/sitemap-index.xml`. Les règles d'indexabilité et les sources de lastmod dans astro.config.mjs sont conservées. L'intégration `memlia-sitemaps-types`, exécutée après celle d'Astro, répartit ses blocs `<url>` sans les réécrire.

| Fichier | Routes |
| --- | --- |
| sitemap-pages.xml | accueil et pages générales, dont le pilier EC |
| sitemap-services.xml | /automatisation et descendants |
| sitemap-guides.xml | /integrations et descendants |
| sitemap-outils.xml | /outils-comptables-gratuits et descendants |
| sitemap-blog.xml | /blog et descendants (articles et rubriques) |
| sitemap-glossaire.xml | /glossaire et descendants |
| sitemap-cac.xml | /commissaires-aux-comptes et descendants |

La profession ne modifie pas le type : un futur service CAC sous /automatisation reste dans services ; un outil CAC reste dans outils. Le sitemap CAC désigne l'accueil et les pages de la branche CAC, pas une seconde copie de chaque URL destinée aux CAC.

Un type sans page indexable n'est pas généré ni annoncé dans l'index. Aujourd'hui aucune route CAC n'est publiée : ce fichier et son entrée apparaîtront automatiquement à la publication de la première page CAC. Cela évite de soumettre un sitemap vide à Google. Aucun contenu fictif n'est créé pour le remplir.

L'ancien agrégat /sitemap-0.xml n'est plus produit : toutes les URL figurent une seule fois dans les sous-sitemaps. Les lecteurs actifs de dates, de preview/publication blog et de la sentinelle SEO ont été adaptés ; les preuves historiques restent inchangées.

## Contrôles

- `npm run build` : tests de partition, refus des doublons, exclusion des types vides, XML parsé et limites de taille ; comparaison exhaustive du sitemap aux canonicals des HTML indexables construits.
- `npm run check` : vérification Astro et TypeScript.
- `npm run test:indexability` après déploiement : robots.txt, index et tous ses enfants en HTTP 200 ; chaque page annoncée répond en HTTP 200 et reste indexable.
- Relire les XML publics avec un parseur XML et comparer les ensembles URL/lastmod au build livré. Ne pas déclarer cette étape faite sur la seule base de la CI.

Relevé avant livraison du 06/10/2026 : 55 URL en production et dans le build candidat, aucune URL ajoutée ou retirée, aucun lastmod modifié. Répartition : pages 6, services 5, guides 10, outils 14, blog 19, glossaire 1. robots.txt et pages-lastmod.json n'ont pas été modifiés.

## Search Console

L'accès Google contrôlé sur ce poste est de niveau 1 (Search Console disponible). Après revue QA, CI verte, fusion et contrôle du déploiement :

1. Construire le commit livré pour disposer de dist/sitemap-index.xml.
2. Exécuter `~/.claude/skills/seo/.venv/bin/python scripts/gsc-resubmit-sitemap.py`.
3. Le script soumet /sitemap.xml et chaque sous-sitemap non vide du build, puis relit chaque cible via `sitemaps.get` pour confirmer son enregistrement. Il affiche aussi l'état de lecture de Google. Une soumission n'est pas une preuve d'indexation des URL.
4. Conserver le résultat dans la preuve de livraison. L'ancienne déclaration sitemap-0.xml peut être retirée de la liste Search Console ; retirer une déclaration ne désindexe pas les pages.

Si l'accès API échoue, Kevin peut ouvrir la propriété `sc-domain:memlia.fr`, rubrique Sitemaps, et soumettre `https://memlia.fr/sitemap.xml`, puis les fichiers actifs indiqués dans cet index. Le sitemap CAC ne doit être soumis qu'après sa création avec au moins une page. Les comptes soumis/découverts servent au suivi des groupes ; l'inspection d'URL reste la référence pour le statut d'indexation d'une page.
