# Diagnostic IA — publication constatée le 5 octobre 2026

Carte de livraison : t_0edf65c0. Ce constat n’ajoute aucune revue du fond : l’unique QA t_873665dd est PASS, après correction des trois actions puis de l’impression. Méthode Memlia v1 préservée : quinze réponses facultatives, cinq dimensions, inconnues explicites, trois actions justifiées et rapport entier sans mail, sans score normatif.

## Livraison et provenance

- PR73 : https://github.com/saphiron222/memlia-landing/pull/73, fusionnée le 05/10/2026 à 09:17:50 UTC.
- Candidat QA/CI : f2a07dfc717f7e69c1a248af3300dc8f4bf70f60 ; Repository gates SUCCESS, https://github.com/saphiron222/memlia-landing/actions/runs/37284364485.
- Main livré : 818320af2aeef3aec192ce8377e8826ac82d6fba. Ascendance de main dans le candidat puis du candidat dans main vérifiée. Aucun push forcé ni suppression de branche ; fusion merge, pas squash d’une branche périmée.
- Cloudflare production : 7e11e252-d0a4-4892-aa5b-39674682c991, https://7e11e252.memlia.pages.dev. API relue : branche main, commit exact, build SUCCESS et deploy SUCCESS ; fin à 09:23:29 UTC. Déploiement automatique GitHub, aucun second déploiement manuel.
- URL canonique publique : https://memlia.fr/outils-comptables-gratuits/diagnostic-maturite-ia-cabinet.
- Wrangler 4.101.0, Node v22.22.3, Lighthouse 13.4.1.

## Exécution de livraison

- Build intégral sur main livré : 130 Python et 659 tests scripts PASS, audits blog/service/ressource et contrats PASS, sortie 0. Premier appel interrompu par la limite de transport de 420 s ; processus contrôlés, une reprise suivie jusqu’à sa sortie 0, sans confondre timeout et succès. La reprise a duré environ 13 minutes.
- Sur memlia.fr : 22 parcours Chromium PASS, zéro échec/flaky/skip.
- Sur déploiement immuable : 22 parcours Chromium PASS, zéro échec/flaky/skip. Premier appel interrompu après 20 tests par le plafond outil de 180 s ; suite entière rejouée avec plafond 360 s, sortie 0.
- Parcours : inconnues/incomplets, quinze formalisées, exemple fictif, précédent/suivant et reprise actualisée, refus de remplacement/reset, export Markdown identique au rapport, copie réussie/refusée et sélection de secours. La copie du test de contrat utilise le double de clipboard déclaré dans la suite ; ne pas la présenter comme un contrôle du presse-papiers natif.
- Impression : douze PDF A4 pour les six profils détails fermés/mixtes/ouverts et une/deux dimensions à traiter sur chacun des deux domaines, sans collision et avec quinze réponses/trois actions/justifications ; deux impressions complémentaires de l’exemple. État écran conservé.
- Six largeurs : 320, 375, 768, 1024, 1440 et 1920 px, sans débordement horizontal du scénario publié ; captures 375/1440 par parcours de scroll réel. Le cas d’édition étendu découvert par QA demeure un suivi indépendant, pas une nouvelle revue bloquante de cette livraison.
- Après chargement, interactions sans requête réseau, localStorage/sessionStorage/IndexedDB et cookies vides ; événements limités à action/outil. Sans JavaScript : quinze questions, méthode et limites accessibles.

## HTTP, SEO, médias et conservation

20 GET réels, URL sans query string, en-tête de requête Cache-Control: no-cache : route, robots.txt, sitemap, hub, méthode, service, deux médias et deux outils frères sur domaine et déploiement. Toutes réponses HTTP 200 non vides. Canonical absolu, WebApplication sans AggregateRating, sitemap et liens entrants hub/méthode/service/footer constatés. Le domaine n’envoie pas X-Robots-Tag noindex ; présence des signaux n’est pas preuve d’indexation par un moteur.

CSP connect-src 'none' conservée. Médias WebP et OG accessibles. Registre : seule entrée diagnostic modifiée, toutes les entrées sœurs identiques à main avant ce constat. Les 64 cellules de matrice et leurs décomptes historiques sont conservés ; la section production est ajoutée sans transformer les preuves locales en audits fournisseurs ou en visibilité.

## Mesures et réserves

Lighthouse public brut, collecteur par défaut : mobile 96/100/92/92 et desktop 100/100/92/92 (performance/accessibilité/bonnes pratiques/SEO). Deux axes restent sous 95 : pas de PASS global Lighthouse. L’audit robots tente un accès dans le contexte CSP connect-src none ; robots.txt HTTP 200 est testé séparément. Le beacon injecté par Cloudflare est bloqué par script-src et produit des erreurs console. Aucun relâchement CSP ni score corrigé artificiellement.

GSC, indexation réelle, backlinks, citations IA, trafic, conversions, J+7 et J+28 : ND. Pas zéro, pas acquis par la publication. Pas d’automatisation supplémentaire créée.

## Preuves

Dans docs/qa/maturite-ia : production-proof.json, deployment-proof.json, browser-domain.json et browser-deployment.json. Archive de livraison jointe à la carte : logs de build et navigateur, preuves HTTP/API, Lighthouse bruts, robots, captures et ce rapport. QA finale conservée dans les pièces de t_873665dd.

Retour arrière : revert de la livraison complète, puis build/déploiement/GET vérifiés ; ne pas retirer seulement la route en laissant ses liens.
