# Recette du hub robots — 15 octobre 2026

Prévisualisation vérifiée : https://3d972653.memlia.pages.dev/automatisation-cabinet-comptable
Alias de travail : https://preview-hub-robots.memlia.pages.dev/automatisation-cabinet-comptable

Branche `site/hub-robots`, checkout isolé `.worktrees/hub-robots`. Base agents `ef483a83`, puis intégration de `origin/main` `c5da8bf9`. Aucun changement au checkout principal ou au worktree agents. Aucun corps d’article ou de service historique modifié. Aucun déploiement de production, fusion automatique, envoi de contact ou appel à un espace fiscal/social réel.

## Contenu et ressources

21 robots en six filtres : suivi fiscal 9, accès et portefeuille 2, social et URSSAF 2, données légales 3, facturation électronique 3, documents et pilotage 2. Les 30 entrées des deux catalogues sont couvertes ; les six agents Xpert-iA sont exclus. 84 cas fictifs (quatre par fiche, au moins un arrêt motivé), 126 réponses propres aux tâches et 63 départs facultatifs vers le contact. Chaque robot a trois livrables et sa frontière explicite.

Les 21 figurines ont été inspectées séparément et sur planche contact. Originaux, PNG 1024, WebP, prompts exacts, références archivées, manifeste et captures : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/hub-robots/2026-10-15/`. Le site sert 126 dérivés AVIF/WebP légers, jamais les 21 PNG maîtres. Le manifeste et `palette.json` documentent le conditionnement et la comparaison à Balthazar. Les 21 images sociales propres aux fiches sont issues de leurs démonstrations ; dimensions JPEG 1200×630 vérifiées dans `social-check.json`.

## Contrôles exécutés

| Contrôle | Résultat |
|---|---|
| Compilation Astro | PASS, 106 pages ; aucun composant agents existant à remplacer dans la base inspectée |
| Vérification Astro / TypeScript | 0 erreur, 0 avertissement ; 39 indications non bloquantes |
| Tests Node ciblés | 82 PASS : catalogue, données, mutants, images, schémas, contact, ponts historiques et contrats |
| Navigateur local | 17 scénarios PASS : 8 robots et 9 contact, avec requêtes de contact interceptées |
| Navigateur distant, version finale | 9 scénarios robots PASS : toutes les fiches, filtres 375/768/1440, clavier, FAQ native, sans JS, stockage bloqué, mouvement réduit et destinations historiques |
| Liens et services historiques | 21 fiches et leurs liens internes répondent ; 12 services historiques HTTP 200 ; garde DA services PASS |
| Sitemap, canonical, JSON-LD, Open Graph | Routes robots présentes dans le sitemap des services ; graphes, canonical et image sociale propres à chaque fiche vérifiés |
| Référencement transversal | 361 URL, 443 déclarations croisées ; aucun conflit de requête non motivé |
| Images du site | Vérificateur M4 PASS ; dimensions/poids et distinction des 21 figurines testés |
| Régénération des artefacts | PASS : surfaces scellées, rendu public, lastmod et audit QA ressources, sans toucher aux corps éditoriaux |
| Fonctions Pages | Compilation PASS ; tests CSP, cache, HEAD et maintien des services historiques PASS |
| Sécurité distante des démonstrations | 22 routes hub/fiches sans requête externe ; CSP connect-src none, suppression du beacon, cache no-transform ; aucun traitement réel |
| Prévisualisation | Copie noindex/nofollow ; en-tête HTTP et meta vérifiés ; canonical reste sur memlia.fr ; aucun HSTS ajouté aux previews |
| Lighthouse local, hub ordinateur | Performance 100, accessibilité 100, bonnes pratiques 100, SEO 100 |
| Lighthouse local, fiche CFE mobile | Performance 100, accessibilité 100, bonnes pratiques 100, SEO 100 |

La version finale du test de mouvement accepte la règle globale existante de réduction à 1 ms et vérifie l’absence de déplacement. Le contrôle du sitemap suit le découpage réel du dépôt (`sitemap-services.xml`). Les captures finales et rapports complets sont archivés dans le dossier externe `qa/`. Les mesures Lighthouse portent sur les deux pages indiquées ; elles ne sont pas présentées comme une mesure de toutes les fiches ou de la vitesse réseau en production.

## Inspection visuelle réelle

Comparaison du pilote CFE et du hub aux captures/gabarits validés, dans le navigateur intégré à 375×812 et 1440×1000 ; nouvelle ouverture de la prévisualisation distante. Fraunces/Hanken, crème et vert, trio décalé, six sections, bandeau de carte 138 px, avatar débordant 84 px, héros partagé, tableau de quatre cas, panneau sombre et accordéons natifs. Taille des cellules mobiles remontée à 14 px après le pilote. Aucune nouvelle section de preuve sociale, grille de prix ou FAQ de hub. Largeur du document contrôlée sur les 21 fiches à 375 px ; aucun débordement de page. Les cartes gardent au maximum trois colonnes.

## Migration et limites conservées

L’URL du hub ne change pas. Les douze slugs de services sont conservés, sans redirection inutile. Les anciennes ancres sont maintenues : `prepare` → signature ; `situation`, `livre`, `perimetre`, `taches-guides` → annuaire ; `cabinet`, `outils` → construction sur mesure ; `requis`, `avant` → autre tâche ; `prix`, `suite` → appel final. Le nouveau catalogue ne mélange pas les 21 routines et les anciens services : ceux-ci restent reliés depuis des contenus contextuels, contrôlés par le registre de publication et des tests de refus d’orphelins. Les destinations prévues dans le chantier agents restent donc disponibles.

Le contrôle global `verify-page-contract` reste ROUGE à cause de `service-forge` : exactement 24 erreurs préexistantes de correspondance des H1/titres avec les anciennes requêtes mesurées, deux par service historique. Comparaison réelle avec le worktree agents dans `services-audit-comparison.json` : mêmes erreurs, aucune nouvelle. Les clauses propres au rendu, le positionnement, la garde DA, le contrat blog et ses titres passent. Nous n’avons ni neutralisé ce contrôle ni réécrit les titres des services scellés pour le faire passer. Cela reste un point à résoudre avant une future livraison de production du dépôt complet ; il n’empêche pas de consulter cette prévisualisation.

Certaines pages administratives refusaient la lecture directe lors de la recherche ; les recoupements officiels et limites publiées sont consignés dans `VERIFICATIONS-METIER.md`. La relecture métier est interne au chantier, pas une revue indépendante fictive.
