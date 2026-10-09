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

Le cadre `hub` aide à choisir une tâche dans son environnement : champs à lire, préparation et validation distinctes. Les mesures d’autocomplétion restent dans `src/data/integrations.ts` ; aucun seuil de publication ni compte de variantes fermées n’est affiché dans l’image. Les comptes du hub HTML et de son ItemList viennent de la collection existante. `tests/scripts/integrations.test.mjs` contrôle la grille interne et l’absence de jargon éditorial dans le cadre.

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
