# M4-R5 — direction et témoin préalable

## Périmètre

Base `f0ff8754b3b1e70f8476abacf9ed6b318707d705`, preview parent `https://0ed8c587.memlia.pages.dev`. Conserver le hero R8, son ratio et ses contrôles, le menu, les textes/alt, les médias statiques, les sections et le blog. Aucun changement de contenu ni nouvel asset.

## Direction relue contre le brief

- Palette existante uniquement : crème `#fffefb`, papier `#fcfbf7`, encre `#231f20`, vert `#27b657`, vert texte `#176f37`.
- Typographie conservée : Fraunces pour les titres, Hanken Grotesk pour le corps. Aucun label ajouté.
- Composition : conteneur existant, neuf lignes 50/50 dès 1024px ; copie alignée à gauche, média à droite, cible 400px de haut sans hauteur fixe qui couperait la copie en zoom texte. Les listes complémentaires suivent leur ligne sans réécriture ; les quatre étapes restent ordonnées.
- Mobile/tablette étroite : texte puis média 16:9 à toute la largeur utile, sans carte supplémentaire, sans crop, zoom navigateur conservé.

```text
Desktop : | titre + paragraphes       | preuve 16:9 intacte       |
          | compléments existants, si présents                   |
Mobile  : | titre + paragraphes |
          | preuve 16:9         |
          | compléments         |
```

La mise en page emprunte les proportions mesurées, pas le code ni les assets Navattic. Le choix n'est pas un nouveau kit de cartes : filet et surface discrets, aucune ombre ni animation ajoutée. Les compléments longs restent hors de la ligne principale pour conserver la lisibilité de la copie et éviter des lignes de 700px.

## Rouge avant modification produit

`QA_URL=http://127.0.0.1:4337 npx playwright test tests/browser/proof-layout.spec.ts -g 1280` : sortie1, neuf images de1212px =94,6875% du viewport1280, aucune vraie ligne texte/média. Fichiers `.qa/m4-r5/red.json`, `red.log`. Capture de référence des neuf images aux cinq largeurs et cinq pleines pages dans `.qa/m4-r5/before`.

## Point de vigilance

Les images sources de1600×900 contiennent déjà des microtextes. Un ratio correct ne prouve pas leur lisibilité à320px. Contrôle visuel distinct obligatoire ; ne pas déclarer la lisibilité exhaustive acquise depuis les seules dimensions.
