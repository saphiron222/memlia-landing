# Bibliothèque 02 — correction de livraison du beacon

Constat du 5 octobre 2026, route `/outils-comptables-gratuits/bibliotheque-prompts-comptables`.

## Cause observée et périmètre

Le GET public contient un script `static.cloudflareinsights.com/beacon.min.js`, absent des sources `src/`. Lighthouse public observe les formes sans suffixe et `/v…`, refusées par la CSP locale. L’injection provient de la livraison Cloudflare, non du moteur de bibliothèque. Les deux étages Pages/zone ne sont pas distingués administrativement dans ce constat ; le mécanisme ROI couvre les deux : filtrage HTML de la réponse Pages, puis `no-transform` contre une nouvelle transformation edge.

PR99 est encore ouverte lors de l’inspection initiale ; ses sept fichiers ne couvrent que l’outil10, ses tests et son rapport. Aucun handler de cette PR n’est nécessaire ici. La bibliothèque réexporte les handlers GET/HEAD ROI déjà sur main. La seule règle de cache ajoutée concerne cette route. CSP exacte conservée, notamment `connect-src 'none'` ; aucune modification du catalogue, des exports, du transfert, des saisies ou des réglages Cloudflare globaux.

Hotspot : `public/_headers` et `tests/scripts/roi-delivery-headers.test.mjs` également touchés par PR99. L’assertion ROI de liste figée devient un contrat de route et d’absence de règle globale ; conserver les règles bibliothèque et outil10 lors de leur intégration, sans dépendance artificielle entre leurs publications.

## Vérifications effectuées

- Deux tests bibliothèque rouges sur la base (handler et règle de route absents), puis verts ; six tests de livraison bibliothèque/ROI PASS.
- Build complet PASS : 134 tests Python et 686 tests scripts dans la suite principale, sans échec. Astro check : 0 erreur, 0 warning, 9 hints.
- Runtime Wrangler Pages réel : huit requêtes GET/HEAD simples et avec validateurs/Range, sur la bibliothèque compilée et une fixture contenant deux beacons injectés. HTTP200 complet, anciens validateurs retirés, HEAD sans corps, CSP maintenue. HTMLRewriter réel retire les deux beacons et conserve les trois scripts témoins (local, autre domaine, inline).
- 24 parcours navigateur bibliothèque PASS sur le runtime Pages, six largeurs incluses. Premier passage pendant le rebuild : 23/24, timeout du scénario stockage ; scénario PASS sur production inchangée et les 24 PASS après stabilisation de l’artefact. Pas de défaut produit établi ni de modification du test.
- Fixture Wrangler : date de compatibilité explicitement fixée à `2026-06-23`, celle du projet ; le défaut par défaut du Wrangler global visait une date plus récente que son workerd. Pas de changement de dépendance ni de configuration du site.

## Lighthouse réel et réserves

Lighthouse 13.4.1, Chromium 153, mobile, collecteur `--robots-crawler` existant (HTTP hors document ; audit robots natif non modifié) :

| Cible | Performance | Accessibilité | Bonnes pratiques | SEO |
| --- | ---: | ---: | ---: | ---: |
| Production AVANT, 18:30 UTC | 64 | 100 | 92 | 100 |
| Runtime Pages local, 18:39 UTC | 98 | 100 | 100 | 100 |

Production avant : `errors-in-console` et `inspector-issues` score0, erreurs CSP beacon. Local : ces deux audits score1, items vides. Le GET brut public contient une occurrence du beacon ; Lighthouse observe deux formes lors de sa navigation. Les rapports JSON bruts et compagnons collecteur sont conservés sans modification dans les preuves de carte.

Le score local n’est pas une mesure de production. La performance publique64 reste un constat de cette exécution, sans attribution au beacon ; un précédent constat publication signalait94. Aucune amélioration publique ni seuil >=95 revendiqués ici. La QA technique unique, la CI de la PR puis la fusion/Cloudflare et les nouvelles mesures publiques mobile/desktop terminent la livraison dans les cartes de relais. Le rapport de publication existant n’était pas encore sur main lors du clone : il est porté par PR100 ; ne pas l’écraser.
