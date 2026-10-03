# Suspension ciblée — article sur la saisie comptable

Le 27/09/2026, la vérification a constaté que `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` répondait encore `200` en production et figurait dans le sitemap, alors que ses affirmations fiscales attendent une nouvelle validation de la source primaire F39785 et une revue indépendante.

Mesure provisoire prévue par le code : une fonction Cloudflare Pages est conçue pour renvoyer `503` pour GET et HEAD sur cette seule route (pas de corps pour HEAD), avec `no-store`, `Retry-After` et `X-Robots-Tag: noindex, nofollow`. La route est exclue du sitemap par `PAGES_NOINDEX`. Au candidat local du 28/09, `Article.astro` applique également `noindex` au HTML statique de cette route : le test du `dist` (`tests/proof/test_build.py`) constate `robots=noindex, follow`, défense de repli déjà présente. **Ces constats locaux ne prouvent pas la réponse GET/HEAD effectivement servie en production.** Décision éditoriale : conserver la suspension ciblée et contrôler statut, en-têtes robots, HTML rendu et sitemap sur le déploiement exact avant de déclarer la suspension effective. Le fichier éditorial source demeure intact : la suspension ne constitue pas une correction de fond ni une autorisation de republier.

Avant levée : revalider la source primaire et les assertions, obtenir la revue indépendante et le nouveau sceau, retirer conjointement fonction, exclusion du sitemap et `noindex` HTML après décision de réouverture, puis vérifier le déploiement sur l'URL publique (GET et HEAD de la route ; robots HTML ; sitemap ; pages voisines). Ne pas fusionner ni déployer en production sans l'autorisation applicable de Kevin. Un retour local vert n'établit pas l'état servi par Cloudflare.

## Candidat corrigé, réouverture non livrée — point du 03/10/2026

La préparation du 29/09 ne suffisait pas : la fiche F39785 sur les flux de facturation
électronique ne qualifie pas la durée de conservation fiscale. Le nouveau corps distingue
la conservation comptable de dix ans et la transition fiscale de L. 102 B. L'article 36
de la loi n° 2026-534 et l'actualité DILA A18906 du 26/06/2026, examinés par la revue métier
du 30/09, portent la condition : l'ancien délai doit expirer strictement après le 1er janvier 2027.
Les témoins du 1er janvier (exclu) et du 2 janvier (inclus) illustrent seulement ce seuil,
jamais une autorisation de purge. Les régimes spéciaux et la durée de chaque pièce restent
à qualifier par dossier ; F10029, vérifiée en 2024, ne soutient pas seule cette réforme.

La PR29 prépare une livraison coordonnée unique : corps fiscal corrigé, sources, recettes,
revues et sceaux finaux avec retrait de la fonction 503 et de l'exclusion `PAGES_NOINDEX`.
Ces retraits ne doivent jamais être intégrés seuls en amont. Les trois chemins préparatoires
de PR42 ne lèvent aucune protection ; les quatre autres articles restent dans le lot existant.
Le nettoyage CSS historique d'`Article.astro`, sans nécessité pour ces cinq articles, est différé.

La revue du 30/09 reste liée à son triplet isolé, pas une QA finale du nouveau HEAD. Avant
fusion : revue métier et QA indépendantes des octets finaux, scellement, build, CI exact-head,
captures des cinq articles à 320/375/1440 et qualification du circuit technique applicable
au diff global exact par le propriétaire de livraison existant. Ne pas élargir la garde blog-only
ni substituer une commande manuelle à son refus. L'autonomie déjà autorisée ne dispense
d'aucune de ces portes et ne demande pas un nouveau go routinier de Kevin.

Le parent t_01260281 a constaté la suspension GET/HEAD 503 sur le déploiement PR39 ; son
handoff du 03/10 rapporte aussi des builds Cloudflare en échec pour les main suivants.
Ce constat historique ne prouve donc ni la livraison du main courant ni une réouverture.
Après fusion autorisée : vérifier source SHA complet, build et déploiement Cloudflare exacts,
GET/HEAD 200, canonical, robots HTML et en-têtes sans noindex, sitemap, corps fiscal corrigé
et empreintes des images servies. Ne jamais rejouer un HTTP effectivement refusé.
Tant que ces preuves manquent : `publication_completed=false` ; aucune remise en ligne déclarée.
