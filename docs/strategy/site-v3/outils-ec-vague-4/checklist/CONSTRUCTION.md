# Checklist des pièces comptables — construction

Route candidate : /outils-comptables-gratuits/checklist-pieces-comptables. Pas encore publiée.

## Résultat
Trame choisie/éditable, quatre états déclarés, ajout/suppression de pièces libres, demande contenant seulement les manquantes, inconnues séparées, copie, HTML imprimable et exports/réimports CSV/JSON explicites. 100 éléments et 1 Mo. Aucun régime ou document obligatoire déduit. Worker préchargé ; aperçu vérifié, confirmation de remplacement, annulation et refus sans effacer les saisies. Session en mémoire seulement.

## Vérifications exécutées
- Test initial rouge : moteur absent ; puis 10 tests moteur PASS.
- Test séparé du contrat HTML contre le moteur PASS : 11 tests ciblés au total. Captures finales sous reduced-motion : sections historiques révélées, header au sommet sans recouvrement ; contrôle visuel positif après correction de la recette de capture, aucun changement du chrome.
- Astro check : zéro erreur, zéro warning (hints documentés).
- npm run regen:generated puis npm run build PASS : 150 tests Python ; tests scripts 797 PASS, 8 SKIP, zéro FAIL. Audits blog/services/guides, propriété des requêtes, page contract, médias, lastmod et ressources PASS.
- 8 parcours Playwright PASS sur Cloudflare Pages local (wrangler), six largeurs 320/375/768/1024/1440/1920. 320 CSS px équivaut au reflow d’un viewport 1280 px à 400 %.
- CSV/JSON reprise exacte ; version inconnue et 101e pièce refusées ; HTML échappé et formule neutralisée ; toutes reçues sans relance ; ajout/suppression ; copie ; refus de remplacement ; reset protégé et annulation sans données appliquées.
- Zéro requête après chargement, stockages inchangés ; aucun beacon. CSP connect-src none et Cache-Control no-transform, nosniff constatés dans la réponse de wrangler, pas seulement dans une balise meta.
- Canonical, H1/og:title/headline, WebPage/WebApplication/BreadcrumbList, hub/footer/sitemap et trois entrants contrôlés.
- Lighthouse local : mobile 99/100/100/100 ; desktop 100/100/100/100. Rapports bruts joints. Instrument robots natif collecté hors document.
- Scène HTML propre dérivée du jeu fictif, renderer historique adopt/render/check PASS : WebP 1600×900 39 Ko et OG 1200×630 ; manifeste docs/qa/checklist-pieces/proofs-manifest.json.

## Maillage et limites de livraison
Les deux articles proposés existent en production (GET no-cache 200). Leur injection dans le gabarit Article modifiait les attributs Astro des rendus scellés, sans changement de fond ; l’essai a été entièrement retiré, aucune revue historique réécrite. Remplacement utile permis par le contrat commun : /methode montre le résultat concret relevé manquant/paie à clarifier ; /garanties explique la séparation inconnu/manquant et l’absence de déduction fiscale. Le hub fournit le troisième entrant. L’outil conserve un lien sortant vers l’article exact de relance.

La prévisualisation distante a été tentée, mais le jeton Cloudflare disponible ne permet pas de découvrir l’identifiant du compte (wrangler refuse ; API accounts répond 200 avec liste vide). Aucun secret lu/modifié. La recette déployée distante et la confirmation de l’absence de beacon edge restent à la carte de publication ; aucun succès distant n’est revendiqué ici.

npm audit : 6 vulnérabilités préexistantes au npm ci (2 modérées, 4 élevées), aucun ajout de dépendance ; rapport brut fourni, pas de mise à jour hors périmètre.

QA indépendante et publication : cartes enfants existantes. Ne pas fusionner avant PASS QA et CI verte. Lors de l’intégration des autres outils, prendre les fichiers générés de main puis régénérer ; ajouts aux registres communs signalés comme hotspots.
