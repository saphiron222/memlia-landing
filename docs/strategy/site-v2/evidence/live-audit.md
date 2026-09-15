# Audit mécanique live — memlia.fr

> NOTE PROVISOIRE SUPPLANTÉE. Lire ../CURRENT-AUDIT.md pour les conclusions revérifiées : Playwright/Lighthouse ont ensuite été exécutés via les dépendances du dépôt principal. Les captures existent. Une occurrence textuelle « téléphone » ne prouve pas un numéro affiché. Aucun téléphone n’est autorisé dans les légales publiques.

**Collecte :** 15/09/2026 (UTC, cache-busting `?audit=20260915`). Source détaillée : [`live-audit.json`](./live-audit.json). Audit HTTP réel, sans validation visuelle simulée.

## Crawl et indexabilité

- `robots.txt`, `sitemap-index.xml`, `sitemap.xml` et `llms.txt` répondent **200**.
- Le sitemap expose `sitemap-0.xml` (200). Crawl des URLs sitemap + liens internes : **10 URLs rencontrées**, dont 7 pages/flux utiles, 1 média MP4, 1 endpoint Cloudflare email-protection en 404.
- Pages HTML utiles observées en 200 : `/`, `/blog`, `/blog/controler-les-bulletins-de-paie-avant-la-dsn`, `/blog/suivre-la-production-sociale-dans-excel`, `/mentions-legales`, `/politique-de-confidentialite`.
- Les pages publiques éditoriales ont `lang="fr"`, canonical absolue cohérente, et `index, follow, max-image-preview:large`.
- Les pages légales portent `noindex, follow` (conforme à la consigne). RSS répond 200 ; son absence de `h1` est normale pour un flux XML.
- Un seul `h1` a été observé sur chaque page HTML éditoriale. Les données JSON-LD ont été décodées et conservées dans le JSON (y compris erreurs éventuelles).

## Réseau, cache, assets

Les statuts, `content-type`, taille, `cache-control`, `etag`, liens `<link>`, scripts et images (`src`, `alt`, dimensions) sont conservés par URL dans le JSON. La collecte ne permet pas de conclure à une politique cache homogène si les en-têtes sont absents : valeur **ND**, pas d’inférence. Les ressources d’images sont listées depuis le DOM ; aucune validation visuelle n’est prétendue.

## Contrôles de contenu ciblés

- Aucun terme téléphone/TVA détecté dans le HTML des pages publiques éditoriales pendant ce passage.
- La détection par terme dans `/mentions-legales` n’établit pas l’affichage d’un numéro. Un téléphone serait interdit sur cette surface publique aussi ; le relevé direct ultérieur est traité dans CURRENT-AUDIT.md.
- Les occurrences détectées dans le MP4 et l’article concerné sont des correspondances textuelles de ressources/contenu et doivent être interprétées avec le détail JSON, pas comme une preuve d’affichage global.

## Comparaison dépôt

Lecture statique de `package.json`, `src/layouts/Base.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `playwright.config.ts` et inventaire `tests/` : Astro + Playwright configurés ; le layout centralise title, description, robots, canonical, OG/Twitter, préchargements de polices, navigation et footer. Nav/footer fournissent les ancres, blog conditionnel, liens légaux et contact mailto. Les tests couvrent notamment site, blog, menu mobile, sections, positionnement, médias, preuves et règles légales.

## Responsive, captures et Lighthouse

- Mesures réelles aux largeurs **ND** : Playwright est déclaré dans le dépôt mais `node_modules` n’est pas présent ; son import local a échoué (`ERR_MODULE_NOT_FOUND`). Aucun screenshot n’a donc été produit, et aucune validation visuelle n’est affirmée.
- Lighthouse lab **ND** : dépendance déclarée, mais exécution non lancée car l’environnement installé manque ; aucun score inventé. Les CWV terrain sont **ND** (pas de CrUX fourni).

## Limites / anomalies observées

- Le crawl de liens internes inclut `/cdn-cgi/l/email-protection`, qui répond 404 ; probablement un artefact de protection Cloudflare plutôt qu’une route éditoriale.
- Le sitemap-index et le sitemap direct répondent tous deux 200 ; leur contenu brut et toutes les preuves de headers sont dans le JSON.
