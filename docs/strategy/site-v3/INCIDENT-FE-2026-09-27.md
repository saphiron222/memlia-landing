# Suspension ciblée — article sur la saisie comptable

Le 27/09/2026, la vérification a constaté que `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` répondait encore `200` en production et figurait dans le sitemap, alors que ses affirmations fiscales attendent une nouvelle validation de la source primaire F39785 et une revue indépendante.

Mesure provisoire : une fonction Cloudflare Pages rend `503` pour GET et HEAD sur cette seule route (pas de corps pour HEAD), avec `no-store`, `Retry-After` et `X-Robots-Tag: noindex, nofollow`. La route est exclue du sitemap par `PAGES_NOINDEX`. Le fichier statique source demeure intact : la suspension ne constitue pas une correction de fond ni une autorisation de republier.

Avant levée : revalider la source primaire et les assertions, obtenir la revue indépendante et le nouveau sceau, retirer la fonction et l'exclusion du sitemap, puis vérifier le déploiement sur l'URL publique (GET et HEAD de la route ; sitemap ; pages voisines). Ne pas fusionner ni déployer en production sans l'autorisation applicable de Kevin. Un retour local vert n'établit pas l'état servi par Cloudflare.
