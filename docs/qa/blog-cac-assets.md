# Actifs techniques CAC pour F4

Cette livraison ne publie aucun article et n'active aucune rubrique. Les couvertures, recettes, revue métier et publication restent à la fabrique F4.

## Figures

Quatre écrans fictifs ajoutés à la série canonique, avec ses seules classes existantes :

- `cac-inventaire-taches` et `cac-fiche-regle` : `automatiser-un-cabinet-cac-la-carte-des-taches` ;
- `cac-fec-registre-reception` et `cac-fec-constat` : `cac-reception-fec-constat`.

Le registre et le constat affichent « JSON fictif » : deux lignes du banc éditorial ne représentent pas un FEC réel. Les saisies et contributions sont séparées ; le constat reste à revoir, sans opinion produite.

Le renderer réserve explicitement ces deux paires via `reservation: F4`. Toute autre réservation ou paire est refusée ; une recette présente doit toujours reprendre exactement les identifiants du contrat. L'absence de recette n'est permise que pour ces actifs globaux, pas pour publier un article. La forge et ses portes de publication ne changent pas.

`node scripts/render-blog-article-proofs.mjs --preview` rend dans `.qa/annotations/blog-article-proofs-preview` sans toucher au contrat, au manifeste ou aux actifs publics. Regarder les quatre écrans, puis `--adopt` ; `--check` vérifie les 36 cadres, les textes, les polices, les débordements, les dimensions et les médias. Chaque nouvel actif est un WebP 1600 × 900 de moins de 150 000 octets, sans variante mobile. Les 32 médias historiques sont inchangés.

## Calendrier

Les 32 angles de base et le pilier CAC restent présents. Deux suppléments mandatés seulement, dans `cac-dossier-de-travail` :

- `cac-appreciation-outil-automatise` : 20 octobre 2026, how-to-guide, executer ;
- `cac-dossier-constitution-soixante-jours` : 21 octobre 2026, listicle-checklist, executer.

Priorité 3, rôle audit-cac, aucune suggestion dans les réponses réelles du 9 octobre, aucun volume revendiqué. Contributions déplacées au 23 octobre, sans changer l'intention de fusion des saisies. Le registre rejette les doublons, suppléments arbitraires, mauvaise famille et dérives de métadonnées. Plafonds communs EC/CAC de 3/jour ouvré et 15/semaine, alternance et traitement de dateManquee conservés. Les six dérivés sont produits par `python3 docs/strategy/site-v3/build-cluster-plan.py`, jamais édités à la main.

## Vérification locale ciblée

Échecs initiaux observés avant implémentation : figures absentes et suppléments absents.

- 19 tests Node figures/renderer/mobile PASS.
- 18 tests Python CAC et 45 tests éditoriaux PASS.
- 6 tests Node demande/profession PASS.
- Renderer `--preview`, observation des quatre images, `--adopt`, puis `--check` PASS.
- Générateur calendrier `--check` et `git diff --check` PASS.

Le build, Astro et la suite navigateur complète sont vérifiés par GitHub Repository gates. La revue QA indépendante et le reçu d'intégration main accompagnent la carte ; ce document ne les anticipe pas.
