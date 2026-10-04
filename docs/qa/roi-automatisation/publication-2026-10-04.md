# Publication ROI — 4 octobre 2026

## Résultat constaté

PR74 fusionnée à 18:22:45 CEST après Repository gates SUCCESS du candidat 7c7a4fe2 (run 37215067305, 22 min 53 s). Main PR77 était ancêtre et a été recontrôlée juste avant la fusion. Commit livré : 3c636b83f01c3eeb1ac58877bfbd0c6df7055c4c. Cloudflare Pages SUCCESS constaté à 18:29 CEST ; déploiement https://d6810551.memlia.pages.dev.

URL publique : https://memlia.fr/outils-comptables-gratuits/calculateur-roi-automatisation.

La QA de fond t_e5ca28b3 reste acquise : cette publication n'introduit pas de seconde revue de fond. Build local cloné : 126 Python et 628 tests scripts Node PASS. La suite CI complète est conservée dans l'archive de livraison.

## Recette réellement exécutée

13 parcours ROI PASS sur memlia.fr et 13 PASS sur le déploiement : scripts désactivés/bloqués, clic/Entrée sans transfert ni perte, borne 9,99/10/10,01 concordante interface/copie/CSV/JSON, oracle nominal et exports complets, E inconnu, capacité négative, coûts nuls, refus sans perte, clavier et largeurs 320/375/768/1024/1440/1920. Domaine rejoué avec rapport JSON conservé.

Deux sondes indépendantes téléchargent réellement CSV/JSON, lisent le presse-papiers, comparent les contenus complets au moteur, vérifient six largeurs et zéro requête après saisie. Six GET par origine, sans query string et avec Cache-Control: no-cache : page canonique, robots.txt, sitemap-index.xml, sitemap-0.xml, média et OG, tous HTTP200. Index/follow sans X-Robots-Tag noindex sur domaine. Le déploiement pages.dev porte volontairement X-Robots-Tag: noindex : cette protection n'est pas une anomalie du domaine canonique et n'a pas été supprimée.

Maillage contrôlé par le navigateur : hub outils, méthode, service automatisation et footer. Sondes de préservation : accueil, contact, charte IA et ROI HTTP200 sur les deux origines. Captures résultats 375/1440 inspectées : résultats lisibles, trois cartes desktop, pas de débordement horizontal constaté.

Essais non qualifiants conservés : preview Cloudflare Idle non servi (timeouts) ; première sonde pages.dev refusant noindex, corrigée uniquement dans le probe de livraison pour distinguer déploiement et domaine, puis PASS. Aucun échec effacé ou transformé en preuve publique.

## Réserve Lighthouse initiale — historique avant PR79

Scores publics bruts, ordre performance/accessibilité/bonnes pratiques/SEO :

- Mobile : 96 / 100 / 92 / 92.
- Desktop : 100 / 100 / 92 / 92.
- Reprise mobile : voir rapport brut additionnel dans l'archive ; aucun score arrondi à 95 ni substitué.

Cause attestée par les audits : le beacon static.cloudflareinsights.com est injecté à l'edge et refusé par script-src ; l'audit robots-txt de Lighthouse échoue avec Network.loadNetworkResource « CSP violation ». Le GET indépendant de robots.txt est HTTP200 et l'analyse robots/indexabilité PASS. Ces preuves distinguent l'erreur de collecte Lighthouse de l'indexabilité HTTP, mais ne rendent pas le score brut vert.

Aucune modification de CSP, aucune autorisation de beacon et aucun changement global Cloudflare faits pour gagner des points. Le seuil quatre axes >=95 reste un critère ouvert. Trafic, positions, backlinks et suivi J+7/J+28 : ND.

La matrice conserve les cellules historiques d'implémentation ; l'objet publication est le constat actuel et remplace leur liste historique des travaux publics à faire.

## Levée technique constatée après PR79

PR79 fusionnée le 4 octobre 2026 à 20:19:17 CEST, après Repository gates SUCCESS du candidat 6b1efa0c (run 37221659027) et relecture de main/ascendance. Commit livré : 7c9412e536d5b219b0fcdf3179100d652aed5323 ; déploiement https://e40e1ed6.memlia.pages.dev. L’API Cloudflare interrogée par Wrangler confirme la production réussie : son statut est une date relative, rendu uniquement pour latest_stage.status=success avec ended_on. Le check GitHub Cloudflare reste temporairement in_progress : cette latence n’est pas présentée comme un SUCCESS GitHub.

La recette finale compte 13 parcours PASS par origine, après activation du correctif, avec exports/copie complets, borne, ND, refus sans perte, scripts désactivés/bloqués et les six largeurs. Captures 375/1440 conservées et inspectées. Les 16 requêtes d’indexabilité/médias et 26 sondes HTTP additionnelles passent : GET200 sans query/no-cache, beacon absent, CSP intacte, no-transform, anciens ETag/date/Range donnant200 complet, HEAD vide et politique concordante. Domaine indexable ; noindex pages.dev conservé. Accueil/contact/charte préservés, sitemap et maillage présents.

Lighthouse 13.4.1, Chrome for Testing154.0.8037.92, rapports LHR bruts non retouchés et fichiers compagnons :

- Mobile à 20:25:56 CEST : 96 / 100 / 100 / 100.
- Desktop à 20:26:08 CEST : 100 / 100 / 100 / 100.
- Méthode explicite : --robots-crawler, GET réel hors document pour le seul artefact RobotsTxt ; audit natif et poids inchangés, robots-txt score=1. Le vérificateur contrôle les fractions brutes >=0,95, pas seulement leur affichage arrondi.
- Comparaison native desktop à 20:27:12 CEST : 100 / 100 / 100 / 92 ; robots-txt score=0, collecte bloquée par CSP. Cet échec demeure dans l’archive ; il n’est ni effacé ni substitué. Le mode natif ne satisfait pas le seuil.

Le critère public >=95 est acquis selon la méthode qualifiée explicitement prévue par la carte, et non en mode de collecte natif. La CSP, la confidentialité, les calculs et les réglages globaux Cloudflare n’ont pas changé. Mesure mobile prématurée à 20:20:32 CEST : 96/100/92/100, pendant l’ancienne production ; conservée comme non qualifiante. Trafic/positions/backlinks et suivi J+7/J+28 restent ND.

Build local final PASS (126 Python/634 Node) ; Astro 0 erreur/0 warning/8 hints. Risque distinct : npm audit signale devalue et http-cache-semantics HIGH, fast-uri MODERATE. Qualification/correction routée à dev sur t_b19b2c1c, aucune mise à jour opportuniste du lock dans cette livraison.

## Retour arrière

Revenir par une PR de revert du correctif PR79, avec CI verte puis Cloudflare SUCCESS et recette sur domaine. Préserver le produit PR74, PR55/75/76/77/78 et éviter réécriture d'historique. La PR documentaire de constat est distincte de la livraison fonctionnelle et peut être révoquée séparément si un constat devient erroné. Aucun rollback réalisé : calculs, confidentialité et exports publics PASS.

## Preuves

Rapports bruts Lighthouse et companions, JSON des deux recettes navigateur, preuves HTTP, exports réellement téléchargés, captures et logs CI sont conservés dans l’archive finale remise par la carte t_8873d9b2 à t_8193141f. PR78 est intégrée ; ce constat final est porté par la branche release/roi-final-t_8873d9b2, puis fusion après CI sans seconde QA de fond ou des preuves dérivées.
