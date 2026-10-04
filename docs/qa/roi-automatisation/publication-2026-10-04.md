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

## Réserve Lighthouse — seuil quatre axes non acquis

Scores publics bruts, ordre performance/accessibilité/bonnes pratiques/SEO :

- Mobile : 96 / 100 / 92 / 92.
- Desktop : 100 / 100 / 92 / 92.
- Reprise mobile : voir rapport brut additionnel dans l'archive ; aucun score arrondi à 95 ni substitué.

Cause attestée par les audits : le beacon static.cloudflareinsights.com est injecté à l'edge et refusé par script-src ; l'audit robots-txt de Lighthouse échoue avec Network.loadNetworkResource « CSP violation ». Le GET indépendant de robots.txt est HTTP200 et l'analyse robots/indexabilité PASS. Ces preuves distinguent l'erreur de collecte Lighthouse de l'indexabilité HTTP, mais ne rendent pas le score brut vert.

Aucune modification de CSP, aucune autorisation de beacon et aucun changement global Cloudflare faits pour gagner des points. Le seuil quatre axes >=95 reste un critère ouvert. Trafic, positions, backlinks et suivi J+7/J+28 : ND.

La matrice conserve les cellules historiques d'implémentation ; l'objet publication est le constat actuel et remplace leur liste historique des travaux publics à faire.

## Retour arrière

Revenir par une PR de revert du commit de fusion PR74, avec CI verte puis Cloudflare SUCCESS et recette sur domaine. Préserver PR55/75/76/77 et éviter réécriture d'historique. La PR documentaire de constat est distincte de la livraison fonctionnelle et peut être révoquée séparément si un constat devient erroné. Aucun rollback réalisé : calculs, confidentialité et exports publics PASS.

## Preuves

Rapports bruts Lighthouse, JSON des deux recettes navigateur, preuves HTTP, exports réellement téléchargés, captures et logs CI sont joints à la carte t_8873d9b2 dans l'archive de livraison. Publication documentaire à suivre via la PR release/roi-publication-t_8873d9b2 ; ne pas confondre création de cette PR et fusion après CI.
