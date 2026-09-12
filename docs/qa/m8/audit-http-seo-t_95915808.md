# Audit HTTP et SEO de production — t_95915808

Mesure externe finale : **2026-09-09T22:37:13.573Z**  
Verdict : **VALIDÉ**

## Périmètre et rattachement au candidat

- Candidat M7 validé : `17f7658da65038763ade695c96cf40b43e5fb3cf`.
- Déploiement de production communiqué par le parent : `030591b5-bbc7-48b4-be1a-9d66c025e7a9`, branche `main`, source `17f7658`, URL technique `https://030591b5.memlia.pages.dev`.
- `main` local au contrôle : `3d0867d59759fb470190fd38f1b37807f92268ed` ; le candidat `17f7658` en est un ancêtre.
- `git diff 17f7658..HEAD -- src public astro.config.mjs package.json package-lock.json` : **aucun fichier produit différent**. Les deux commits postérieurs concernent l’oracle et la documentation de release.
- Comparaison fraîche du contenu réellement servi par `https://memlia.fr` au `dist` correspondant : **12/12 routes équivalentes** et **46/46 autres fichiers équivalents**, soit **58/58 fichiers**. Les seules transformations HTML constatées sont la protection email Cloudflare et le bloc Analytics, normalisés de façon bornée par l’oracle existant ; aucune autre divergence.

Ce rattachement démontre que le contenu externe correspond au candidat attendu, sans dépendre de la seule URL `pages.dev`.

## Résultats HTTP et redirections

| URL / contrôle | Résultat |
|---|---|
| `https://memlia.fr/` | `200`, `text/html`, aucun `X-Robots-Tag: noindex` |
| `https://www.memlia.fr/` | `301` vers `https://memlia.fr/` |
| `https://www.memlia.fr/blog?source=audit&x=1` | `301` vers `https://memlia.fr/blog?source=audit&x=1` |
| Destination apex du test www | `200`, aucun second saut |
| `https://memlia.fr/m3-page-inexistante` | vraie `404` |
| `https://030591b5.memlia.pages.dev/` | `200`, `X-Robots-Tag: noindex` attendu sur le domaine technique |

L’oracle spécialisé `node scripts/verify-www-redirect.mjs` passe **8/8** : HTTPS et résolution DNS normale, statut 301, chemin et query conservés, un seul saut, canonicals apex et statuts finaux vérifiés, y compris une vraie 404.

La variante `http://` n’a pas été sondée par ce run : la politique d’exécution locale refuse explicitement les téléchargements HTTP non chiffrés. Cette limite ne remet pas en cause les contrôles HTTPS et la canonicalisation www→apex demandés.

## Pages, canonicals et indexabilité

Six pages HTML ont été relues directement en production. Elles répondent toutes `200`, possèdent exactement un H1, un title, une meta description, un `og:url`, une meta robots et une canonical unique.

| Page | Canonical | Robots |
|---|---|---|
| `/` | `https://memlia.fr/` | `index, follow, max-image-preview:large` |
| `/blog` | `https://memlia.fr/blog` | `index, follow, max-image-preview:large` |
| `/blog/controler-les-bulletins-de-paie-avant-la-dsn` | URL apex identique | `index, follow, max-image-preview:large` |
| `/blog/suivre-la-production-sociale-dans-excel` | URL apex identique | `index, follow, max-image-preview:large` |
| `/mentions-legales` | `https://memlia.fr/mentions-legales` | `noindex, follow` intentionnel |
| `/politique-de-confidentialite` | `https://memlia.fr/politique-de-confidentialite` | `noindex, follow` intentionnel |

Marqueurs de version présents dans le HTML externe :

- accueil : H1 `Automatisez les tâches qui ralentissent votre cabinet.` ;
- blog : H1 `Ce qui se vérifie, ce qui s’automatise, ce qui se décide.` ;
- article paie/DSN et article production sociale : titres attendus présents.

Aucune page indexable ne porte le `noindex` des previews. Les deux pages légales restent volontairement `noindex` et sont exclues du sitemap ; ce n’est pas une fuite du garde-fou de preview.

## Robots, sitemap et découverte

- `https://memlia.fr/robots.txt` : `200`, aucun `X-Robots-Tag`, groupe général `Allow: /`, sitemap déclaré `https://memlia.fr/sitemap.xml`; Bytespider reste bloqué conformément au fichier source.
- `https://memlia.fr/sitemap.xml` : `200`, pointe vers `https://memlia.fr/sitemap-0.xml`.
- `https://memlia.fr/sitemap-0.xml` : `200`, exactement quatre URL indexables : accueil, blog et les deux articles.
- Les pages légales et la 404 ne figurent pas dans le sitemap.

L’audit valide l’**indexabilité technique** ; il ne prétend pas prouver l’indexation effective dans Google Search Console.

## Assets critiques

Huit assets critiques ont été téléchargés depuis l’apex, contrôlés en HTTP `200`, avec type MIME attendu et SHA-256 identique au `dist` :

- vidéo R8 MP4 — `164f6090f7d7a820d544d6679e5f68257fb4f929fe35079b5ce9a22ef86585e4` ;
- VTT R8 ;
- poster R8 1200 WebP ;
- image OG ;
- Fraunces 600 et Hanken Grotesk 400 ;
- les deux images principales du blog.

L’oracle exhaustif complète ce sous-ensemble : **46/46 fichiers statiques**, dont l’ensemble des médias et polices présents dans `dist`, sont accessibles et identiques.

## Commandes et preuves

```text
git status --short
git branch --show-current
git rev-parse HEAD
git log --oneline -5
git diff --stat 17f7658da65038763ade695c96cf40b43e5fb3cf..HEAD -- src public astro.config.mjs package.json package-lock.json
git diff --name-only 17f7658da65038763ade695c96cf40b43e5fb3cf..HEAD -- src public astro.config.mjs package.json package-lock.json
node scripts/verify-www-redirect.mjs
node .qa/m8/verify-production.mjs
node --check .qa/t_95915808/audit-seo.mjs
node .qa/t_95915808/audit-seo.mjs
curl -sS -o /dev/null -D - --max-time 20 https://memlia.fr/
curl -sS -o /dev/null -D - --max-time 20 'https://www.memlia.fr/blog?source=audit'
```

Preuves fraîches :

- `.qa/t_95915808/audit-seo.json` — 6 pages, 8 assets critiques, 2 redirections, 4 URL sitemap, **0 erreur** ;
- `.qa/www-redirect.json` — **8/8** ;
- `.qa/m8/independent/report.json` — **12/12 routes**, **46/46 fichiers**, **0 erreur**.

Tentative de lecture Cloudflare via `npx wrangler pages deployment list` bloquée par le contrôle local de dépendance ; le binaire Wrangler n’est pas installé dans `node_modules/.bin`. L’identifiant de déploiement provient donc du handoff parent vérifié, tandis que la conformité du contenu a été établie indépendamment sur l’apex public.

## Conclusion

Publication HTTP/SEO **validée** : apex accessible et indexable, `www` redirigé en 301 sans perte de chemin ou de query, canonicals cohérentes, pages principales/blog/articles/légales accessibles, robots et sitemap cohérents, assets critiques chargés, contenu servi équivalent au candidat validé. Aucun changement éditorial, de design, de DNS, de configuration Cloudflare, aucun déploiement et aucun push n’ont été effectués pendant cet audit.
