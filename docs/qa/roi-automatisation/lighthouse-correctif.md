# Correctif Lighthouse ROI — qualification technique

## Périmètre et architecture

La seule route `/outils-comptables-gratuits/calculateur-roi-automatisation` passe par une fonction Cloudflare Pages. Elle appelle l’asset existant, retire avec HTMLRewriter uniquement les scripts `https://static.cloudflareinsights.com/beacon.min.js` et leurs versions, puis émet `Cache-Control: public, max-age=0, must-revalidate, no-transform`. L’ETag et la longueur du corps original sont retirés puisque la réponse change. Aucune saisie n’est lue ni conservée ; aucun calcul, texte métier, export ou réglage global Cloudflare ne change. La CSP HTTP demeure identique ; la CSP meta du build reste intacte.

Le simple en-tête no-transform sur la route ne suffit pas : expérimentation réelle https://f87b9676.memlia.pages.dev, beacon Pages toujours présent. La fonction le retire effectivement : https://cc04f164.memlia.pages.dev, aucun beacon dans le DOM, CSP originale, HTTP200. La zone memlia.fr ajoute un deuxième beacon : no-transform empêche cette transformation en aval selon la documentation Cloudflare. Cet effet sur le domaine doit être constaté après publication et ne se déduit pas de la prévisualisation.

## Collecteur robots, audit conservé

Chrome for Testing 154.0.8037.92 et 150.0.7871.124, Lighthouse 13.4.1 : le collecteur natif `Network.loadNetworkResource` lié à la page échoue sous `connect-src 'none'`. Le GET indépendant public retourne HTTP200 et l’audit Lighthouse natif, appliqué à ce corps réellement récupéré, rend score=1, aucune erreur. PageSpeed alternatif retourne 429 ; sa mesure reste ND.

`npm run lighthouse -- URL --robots-crawler` remplace explicitement seulement la collecte de l’artefact RobotsTxt par un GET HTTP sans cookie, sans query et sans cache, hors document. L’audit `seo/robots-txt`, ses règles, son poids et les autres audits sont ceux de Lighthouse, inchangés. Une panne réseau, un HTTP503 ou un robots invalide échouent réellement. Chaque LHR brut possède un fichier compagnon `.collector.json` avec URL, date, status et corps reçu. Sans ce drapeau, le collecteur natif est conservé pour comparaison. Aucun score n’est réécrit, aucun audit n’est exclu, aucune CSP n’est contournée pendant l’exécution de la page.

Ordre des scores : performance/accessibilité/bonnes pratiques/SEO.
Avant correctif, domaine Chrome154 : mobile96/100/92/92, desktop98/100/92/92 ; Chrome150 desktop99/100/92/92.
Preview fonction + collecteur hors document : desktop100/100/100/69 ; robots=1. SEO69 correspond à la protection noindex du déploiement, conservée. Ce n’est pas une mesure du domaine publié et n’acquiert pas le seuil public.

## Vérification et retour arrière

Tests écrits puis échec observé avant les correctifs : règles d’en-têtes, retrait sélectif des beacons, redirections intactes, GET robots et audit original sur contenu valide/invalide, HTTP503 et panne. Build complet et parcours ROI à rejouer sur le candidat final. CI requise et une QA technique du correctif avant production, sans nouvelle QA métier ROI.

Retour arrière par PR de revert du correctif, CI puis Cloudflare SUCCESS. Le collecteur reste opt-in, sa suppression ne touche pas le produit. Les previews sont expérimentales ; ne pas les présenter comme une publication. Seules les mesures constatées après publication permettront de lever la réserve.

Source : https://developers.cloudflare.com/web-analytics/faq/ (no-transform) ; `lighthouse/core/gather/fetcher.js`, `core/gather/gatherers/seo/robots-txt.js`, `core/audits/seo/robots-txt.js` dans la dépendance 13.4.1.
