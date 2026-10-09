# HSTS du domaine public

## Périmètre

SEC-03 : `Strict-Transport-Security: max-age=31536000` sur `memlia.fr` uniquement.
Ni `includeSubDomains` ni `preload`. Les previews Pages, localhost et `www` ne sont pas inclus.
Les redirections de la zone HTTP → HTTPS et www → canonique restent inchangées.
Aucun réglage de zone, certificat, Web Analytics/RUM, D1 ou formulaire n'est modifié.

`public/_headers` ajoute un bloc par hôte qui se cumule avec les CSP/règles de cache existantes.
Les deux routes HTML servies par Functions (ROI et FEC) utilisent leur handler commun,
car Pages n'applique pas `_headers` aux réponses Functions. Aucun middleware global :
les autres pages restent des assets statiques et aucune nouvelle route Function n'est créée.
L'API de contact n'est pas une page HTML et reste hors du lot SEC-03.

Référence : https://developers.cloudflare.com/pages/configuration/headers/

## Recette reproductible

1. Tests de comportement :
   `node --test tests/scripts/hsts-delivery-function.test.mjs tests/scripts/roi-delivery-function.test.mjs tests/scripts/pseudonymisation-delivery-function.test.mjs tests/scripts/roi-delivery-headers.test.mjs tests/scripts/pseudonymisation-delivery-headers.test.mjs`
2. Construire : `npx astro build` (puis chaîne complète `npm run build` dans la CI).
3. Démarrer Pages local :
   `wrangler pages dev dist --ip 127.0.0.1 --port 8798 --show-interactive-dev-session=false`
4. Contrat local sur le vrai moteur Pages :
   `node scripts/verify-hsts-delivery.mjs http://127.0.0.1:8798`
   Il envoie Host=memlia.fr, vérifie GET/HEAD sur accueil, contact, outil statique,
   ROI, FEC, article et vraie 404 ; puis contrôle les exclusions d'hôtes.
5. Après fusion/déploiement du commit validé : `node scripts/verify-hsts-delivery.mjs`.
   Vérification TLS native de Node active (ni certificat ignoré ni requête insecure).
   Les trois redirections HTTP/www sont aussi inspectées, sans envoi de formulaire.
   Pour reproduire l'état initial seulement :
   `node scripts/verify-hsts-delivery.mjs https://memlia.fr --baseline`.

## Résultats de préparation — 6 octobre 2026

- Avant correction : GET et HEAD publics des sept routes sans HSTS ; réponses 200,
  sauf la 404 réelle. Certificats apex et www acceptés par Node.
- HTTP apex : 301 vers https://memlia.fr/ ; HTTP www : 301 vers https://www.memlia.fr/ ;
  HTTPS www : 301 vers https://memlia.fr/.
- Test Functions rouge avant correction (HSTS null), puis vert ; dix tests ciblés PASS.
- Astro construit 62 pages. Pages local Wrangler 4.101.0 : quatorze réponses GET/HEAD
  portent exactement max-age=31536000, six sondes d'exclusion sans HSTS.
- Les preuves HTTP initiales/locales sont attachées à la carte t_7f3884c5.
- La recette publique verte n'est pas acquise avant fusion et déploiement ; ne pas
  confondre le vert local avec un résultat de production.

## Rollback

Un simple retrait d'en-tête n'efface pas la politique déjà mémorisée par un navigateur.
Pour désactiver HSTS, publier `max-age=0` dans le bloc memlia.fr ET dans le handler
commun ROI/FEC, sans toucher CSP, cache, suppression de beacon ni routes ; vérifier
GET/HEAD publics et garder HTTPS/certificat valides pour distribuer cette révocation.
Après cette livraison de révocation, le bloc et l'ajout dans le handler peuvent être retirés.
Un retour au précédent déploiement retire l'en-tête des nouvelles réponses mais ne
révoque pas les clients déjà engagés pour un an : ce n'est pas un rollback complet.
Ne jamais couper HTTPS pendant ce délai. Pas de preload à retirer ni de sous-domaines engagés.
