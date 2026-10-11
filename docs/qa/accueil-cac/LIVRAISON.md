# E3 — médias de l’accueil CAC

## Résultat et frontière

Trois cadres HTML figés du « Mandat fictif Atelier des Rives », pas des captures d’un produit livré. La provenance fictive et les limites sont dans les textes alternatifs et détails de `src/data/proofs.ts`. Aucune marque, slogan, date ou cartouche de précaution ajouté aux cadres. Le nom du jeu est un libellé fonctionnel de la fenêtre.

Références `MEDIAS_CAC` inchangées :

| Usage E4 | Identifiant | Actif |
|---|---|---|
| Quotidien, Promesse, observation/essais, poster | `cac/accueil-selection-tiers` | `/proofs/cac/accueil-selection-tiers.webp` |
| Preuves, livraison | `cac/accueil-ecarts-confirmation` | `/proofs/cac/accueil-ecarts-confirmation.webp` |
| Intégration, Garanties, cadrage | `cac/accueil-fichiers-balance` | `/proofs/cac/accueil-fichiers-balance.webp` |
| Image sociale CAC | — | `/proofs/cac/og/accueil-selection-tiers.webp` |

Le poster reprend directement la sélection ; E4 conserve le mode poster seul, sans lecteur ni commandes vidéo avant E9. Aucun média EC repris. La composition de la page publique, ses voisinages et sa recette responsive appartiennent à E4. Les captures E3 sont une galerie des fichiers exportés, pas une prévisualisation de cette page.

## Rejeu et rendu

Sources : `docs/design/accueil-cac-proofs/`. `fixture.mjs` contient uniquement des données inventées. `build-source.mjs` assemble le HTML depuis les calculs de cette fixture. Il n’est ni un outil d’audit ni une automatisation proposée en production.

Convention du jeu : valeurs absolues des soldes, critères solde/mouvement obligatoires, complément jusqu’à la couverture ou au nombre choisi, puis un tiers aléatoire hors sélection. Tirage reproductible par classement SHA-256 de graine + tiers. Ces règles sont un exemple écrit, pas une prescription de méthode ou de taille de sondage. Intermédiaire : 90 000 / 100 000 euros ; clôture : 130 000 / 140 000 euros avec ajout R07. Aucun résultat n’est extrapolé.

    node docs/design/accueil-cac-proofs/build-source.mjs --write
    node scripts/render-proofs-v2.mjs --source=docs/design/accueil-cac-proofs --manifest=docs/qa/accueil-cac/proofs-manifest.json --target-root=public/proofs/cac --unnumbered --adopt
    node scripts/render-proofs-v2.mjs --source=docs/design/accueil-cac-proofs --manifest=docs/qa/accueil-cac/proofs-manifest.json --target-root=public/proofs/cac --unnumbered --check

`--target-root` et `--unnumbered` préservent les identifiants réservés ; sans ces options, les chemins et le numérotage historiques sont inchangés. Douze manifestes historiques ne changent que la référence au renderer ; leurs actifs ont été vérifiés inchangés. Le rendu par défaut a été rejoué en contrôle : 40 actifs conformes.

## Vérification

- Test de comportement observé rouge avant implémentation : registre et fichiers absents.
- Douze tests copy + médias PASS ; fixture, dimensions, poids, contenu, manifeste et absence de chevauchement panneaux/pied couverts.
- Trois cadres 1600 × 900 ; poids 66 812, 67 560 et 65 338 octets. Image sociale 1200 × 630 : 37 166 octets. Tous sous 150 000 octets.
- Rendu CAC `--check` : quatre actifs conformes.
- `npm run build` PASS : suite proof 150 tests PASS, suite Node 827 tests dont 819 PASS et 8 ignorés ; audit Ressources QA PASS.
- `npx astro check` : zéro erreur, zéro avertissement.
- Galerie des actifs exportés vérifiée à 320, 375, 768, 1024, 1440 et 1920 pixels, sans débordement horizontal. Captures pleine page 375 et 1440 jointes à la livraison.
- `git diff --check` PASS.

## Revue indépendante

QA indépendante PASS, diff contre E1 inspecté et tests/rendus rejoués ; quatre WebP relus visuellement. Aucun défaut bloquant. Deux notes non bloquantes : tiret de réponse R07 légèrement ambigu mais période incompatible expliquée ; le renderer contrôle les actifs et non les empreintes sources en mode `--check` (comportement préexistant), couvert ici par le test du manifeste CAC.

Fond E1 déjà relu PASS par métier (PR177). E3 ne change que son chemin de poster, pas les affirmations réglementaires.
