# Suspension ciblée — article sur la saisie comptable

Le 27/09/2026, la vérification a constaté que `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` répondait encore `200` en production et figurait dans le sitemap, alors que ses affirmations fiscales attendent une nouvelle validation de la source primaire F39785 et une revue indépendante.

Mesure provisoire : une fonction Cloudflare Pages rend `503` pour GET et HEAD sur cette seule route (pas de corps pour HEAD), avec `no-store`, `Retry-After` et `X-Robots-Tag: noindex, nofollow`. La route est exclue du sitemap par `PAGES_NOINDEX`. Le fichier statique source demeure intact : la suspension ne constitue pas une correction de fond ni une autorisation de republier.

Avant levée : revalider la source primaire et les assertions, obtenir la revue indépendante et le nouveau sceau, retirer la fonction et l'exclusion du sitemap, puis vérifier le déploiement sur l'URL publique (GET et HEAD de la route ; sitemap ; pages voisines). Ne pas fusionner ni déployer en production sans l'autorisation applicable de Kevin. Un retour local vert n'établit pas l'état servi par Cloudflare.

## Levée préparée le 29/09/2026

La forge a rouvert les quatre sources officielles le 29/09/2026. La fiche primaire F39785 répond 200,
est toujours marquée « Vérifié le 07 août 2026 » et soutient encore les deux assertions de l'article :
suivi des factures reçues pendant leur cycle de vie et signalement d'une anomalie sur la plateforme.
Les copies locales, empreintes et dates de consultation ont été renouvelées ; le corps éditorial n'a
pas été réécrit pour changer la portée de ces affirmations.

Le candidat retire donc la fonction 503 et l'entrée `PAGES_NOINDEX`. Cette préparation ne vaut pas
preuve de remise en ligne : la levée ne devient effective qu'après revue indépendante des nouveaux
octets et sources, scellement, CI au SHA exact, fusion, puis constat en production de GET/HEAD 200,
présence dans le sitemap et absence d'en-tête `noindex`.
