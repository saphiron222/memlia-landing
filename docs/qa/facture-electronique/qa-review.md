# QA indépendante d’implémentation — facture-electronique

**Verdict : PASS, avec réserves mineures non bloquantes.** Aucun défaut d’implémentation bloquant constaté. Ce verdict porte sur la candidate locale, pas sur sa publication HTTPS.

- Revue : 2026-10-07, terminée à 19:06 CEST.
- Branche : `site/t_7e3124f5` ; commit : `d5d8e060c3607d4d4dae4e76709bd135007b0efa`.
- Base : `origin/main`, `f91096305e2da1c6b9855bacc185ec2e7e664b36`.
- URL testée : `http://127.0.0.1:4347/automatisation/facture-electronique`.
- Périmètre : code et rendu, SEO technique de candidate, responsive, DA, preuve, sources/CTA et liens. Pas de nouvelle revue métier ; le PASS métier fourni reste inchangé. Aucun code modifié, aucun build complet relancé.

## Contrôles et résultats

### Diff — PASS

Diff comparé à la base : nouvelle recette et ses preuves, contenu de service, branchements dans `service-design`, `proofs`, `page-eeat`, `couverture-logiciels`, contrat d’intention et trois liens contextuels. Aucun changement de template partagé ni de CSS. La nouvelle scène réutilise les classes existantes du renderer v2.

Le diff n’est pas limité matériellement à la page : il comporte aussi des fichiers générés de lastmod, registre de requêtes, manifeste de preuves et réaffirmations du glossaire. Les différences inspectées sur ces dernières portent sur empreintes, dates et reçus, pas sur le contenu public du glossaire ; le registre ajoute le service avec quelques reformattages. Pas de refonte incidente détectée.

### SEO technique — PASS pour la phase candidate

Chromium réel : HTTP 200 aux six largeurs, un seul H1 de 88 caractères, titre d’onglet conforme à la recette et canonical unique `https://memlia.fr/automatisation/facture-electronique`. JSON-LD parsable : `WebPage`, `Service`, `BreadcrumbList`, `Organization`, `WebSite`, plus `Person` auteur ; URL, headline, description et relations cohérentes. Aucun événement `pageerror` pendant les visites.

`robots = noindex, follow`, conforme au statut `pret-preview` et au bandeau de prévisualisation. L’indexabilité de production n’est donc pas validée par ce rapport.

### Responsive et interactions — PASS

Captures pleine page examinées : `320.png`, `375.png`, `768.png`, `1024.png`, `1440.png`, `1920.png`. Recontrôle DOM indépendant en Chromium : `documentElement.scrollWidth` égale la largeur du viewport dans les six cas ; preuve chargée.

| Viewport | Largeur utile du tableau | Largeur défilante |
|---|---:|---:|
| 320 | 286 | 560 |
| 375 | 341 | 560 |
| 768 | 638 | 638 |
| 1024 | 518 | 560 |
| 1440 | 716 | 716 |
| 1920 | 716 | 716 |

Les colonnes partiellement visibles sur certaines captures ne sont **pas perdues ou masquées définitivement** : les deux tableaux ont un conteneur `overflow-x: auto`, `tabindex=0`, `role=region` et un nom accessible. Défilement par flèche droite effectivement vérifié pour les deux à 320 px.

« Agrandir la preuve » fonctionne à 320 px : dialogue ouvert, image native 1600 px chargée, région défilante (252 px utiles / 1600 px), défilement clavier fonctionnel, fermeture par Échap et restitution du focus au déclencheur.

### DA, preuve et séparation sources/CTA — PASS

Comparaison pleine page avec `factures-fournisseurs.png` et `automatiser-la-relance-des-pieces-clients.png` : typographies éditoriales, accent vert, filets, cartes, header/footer et conversion finale cohérents. La grille asymétrique et les espaces généreux reprennent la page service de référence ; la page article reste une référence d’identité, pas un template à copier.

Preuve dédiée `public/proofs/v2/30-service-facture-electronique.webp` : **1600 × 900, 40 288 octets**, donc sous 150 Ko. Inspection du visuel natif : textes lisibles, pas de chevauchement ; FE-01 proposé, FE-03 explicitement exclu, FE-04 arrêté ; note conservée dans un champ séparé. Alt descriptif présent ; aucun habillage promotionnel ajouté à la scène.

Sources et CTA sont deux sections distinctes, sans imbrication ni chevauchement aux six largeurs ; la fin géométrique du bloc sources coïncide avec le début du bloc CTA. Référence DGFiP visible dans les sources ; références éditeurs présentes dans la couverture et le corps. Les six destinations internes uniques du `main` répondent HTTP 200, dont `/contact` et l’image de preuve. Aucun formulaire envoyé.

### Trois liens entrants — PASS

Vérifiés dans le code par le test ciblé **et dans le DOM réellement servi**, HTTP 200 pour chaque page source, destination exacte `/automatisation/facture-electronique` :

- `/automatisation-cabinet-comptable` : « préparer les relances des clients sur une autre plateforme agréée ».
- `/methode` : « éprouver la préparation des appels de facture électronique ».
- `/garanties` : « valider les relances hors de la plateforme du cabinet ».

### Vérifications exécutées

- `node --test tests/scripts/service-facture-electronique.test.mjs` : **2/2 PASS**, aucun skip.
- `node scripts/verify-service-design.mjs` : **VERT**, 6 pages.
- `node scripts/verify-page-contract.mjs` : **VERT**, 65 pages, 5 clauses, 2 exemptions.
- `git diff --check origin/main...HEAD` : signale seulement les trois espaces de fin de ligne documentés ci-dessous.

Le build complet, Astro check, renderer v2 et rejeu métier annoncés dans le contexte préalable ne sont pas présentés comme des exécutions de cette QA et n’ont pas été relancés.

## Défauts précis / réserves non bloquantes

1. **P3 — Hygiène du diff :** espaces de fin de ligne dans `commercial/recettes/facture-electronique/preuves/etude-couverture/ec-production.md`, lignes **155, 879, 914**. `git diff --check` n’est pas entièrement propre ; aucun effet sur la page.
2. **P3 — Composition du H1 :** le deux-points commence une ligne sur plusieurs captures. Retour typographique peu élégant, sans débordement ni perte de texte.
3. **P3 — Découvrabilité du défilement des tableaux :** à 320/375 et 1024 px, les dernières colonnes nécessitent un défilement horizontal ; aucun indice textuel explicite visible. Le défilement et l’accès clavier ont été vérifiés : amélioration UX éventuelle, pas un défaut de contenu inaccessible.

La petite taille de l’aperçu est compensée par l’agrandissement natif testé. La navigation mobile repliée et la longue colonne de lecture ne constituent pas une régression bloquante de cette implémentation.

## Limites et livrable

- Publication HTTPS candidate non contrôlée : récupération du compte Wrangler bloquée selon le contexte fourni. Ce blocage externe n’entraîne pas un FAIL d’implémentation.
- CI GitHub annoncée en cours ; son résultat final n’a pas été contrôlé ici. Aucun verdict de déploiement ou de production.
- Tests navigateur exécutés en Chromium local ; pas de matrice Safari/Firefox, pas d’audit Lighthouse ou de conformité accessibilité exhaustive.
- Liens externes inspectés dans le rendu et le code, sans revalidation de leurs affirmations métier ni exploration des sites tiers.
- Seul fichier créé par cette QA : `.qa/facture-electronique/qa-review.md`. Captures et `geometry.json` préexistants conservés ; aucun changement de code.
