# Contrat des preuves d’intégration

Ces cadres montrent un geste métier. Ce ne sont ni des diapositives commerciales ni des attestations de compatibilité.

## Composition

Chaque scène garde au centre les éléments nécessaires pour comprendre le rejeu fictif :

- l’entrée lue ;
- la règle appliquée ;
- la sortie préparée ;
- la décision attendue ;
- au moins une exception avec sa cause et son état d’arrêt.

Le contexte logiciel reste un libellé fonctionnel. Le jeu fictif et la portée de la démonstration vivent dans `content-contract.json`, le texte alternatif et la page qui porte l’image.

Les nombres du cadre `hub` ne sont pas des statistiques externes : ils projettent la grille d’autocomplétion mesurée le 20 septembre 2026 et versionnée dans `src/data/integrations.ts`. Les 35 couples mesurés se répartissent en 9 guides ouverts à partir de 6 suggestions et 26 variations fermées. `tests/scripts/integrations.test.mjs` recalcule cette projection pour empêcher toute dérive entre la grille et le cadre.

## Éléments interdits dans le cadre

- logo ou signature Memlia ;
- titre de page ou slogan promotionnel ;
- cartouche décoratif dans un coin ;
- mention de partenariat, d’indépendance, d’API ou de compatibilité ;
- pied de page du type « jeu fictif · aucune donnée client ».

Une exception métier n’est pas un pied défensif : elle appartient à la scène quand elle explique pourquoi la règle s’arrête.

## Rendu et contrôle

```bash
node scripts/render-integration-proofs.mjs --adopt
node scripts/render-integration-proofs.mjs --check
node --test tests/scripts/integration-proof-render.test.mjs
```

Le rendu produit dix WebP de 1600 × 900 px sous `public/proofs/integrations/`, chacun sous 150 Ko. La revue se fait sur la planche contact et sur les images individuelles afin de vérifier la lisibilité, les alignements et l’absence de troncature. Les séries historiques scellées ne sont pas modifiées pour répondre à un nouveau besoin.
