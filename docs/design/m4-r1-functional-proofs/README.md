# Neuf preuves fonctionnelles — sources publiques nettoyées

Ces compositions HTML/CSS représentent des jeux fictifs, pas des captures d’un produit en exploitation. Aucun générateur d’image IA n’intervient.

## Reproduire

Depuis la racine du dépôt, avec Node 22+, Python 3 et Chromium Playwright :

```sh
npm ci
npx playwright install chromium
npm run render:proofs
npm run check
npm run build
```

`render:proofs` charge les trois polices locales, contrôle les neuf compositions, rend chaque scène à une origine fixe en **1600 × 900**, puis encode les WebP avec Sharp (`quality: 90`, `effort: 6`). Il régénère également les dérivés dont le manifeste déclare une source dans `public/proofs/`, sans changer le blog ni ses textes. Le lot contient les neuf preuves plus ces seuls dérivés ; aucun dérivé n'est requis si les couvertures de blog ont changé de source.

- Source de composition : `index.html`, `styles.css`.
- PNG versionnés : `renders/`.
- Actifs du site : `public/proofs/` et les éventuels dérivés déclarés dans le manifeste.
- Manifeste actif : `docs/qa/m4-r4/media-manifest.json` ; seul le lot des images concernées est actualisé, vidéo/poster inchangés.
- Contrat textuel : `content-contract.json`, texte central exact et inventaire des suppressions par scène.
- Journal du rendu : `.qa/annotations/render/report.json`.

Le rendu travaille d’abord en mémoire et dans `.qa/annotations/render/`. Aucun actif public n’est remplacé tant que le lot complet n’a pas passé les contrôles de contenu, géométrie et encodage. Une erreur d’écriture disque reste une erreur fatale : le manifeste/build empêche de livrer un lot incohérent, sans prétendre à une transaction atomique du système de fichiers.

## Vérifier sans réécrire

```sh
npm run test:images
npm run test:proof-render
python3 -m unittest discover -s tests/proof -p test_proof_annotations.py -v
```

Le test images exige un `dist/` récent. Il compare les 23 images au manifeste et au build, et contrôle les empreintes des huit sources de rendu (HTML, CSS, contrat, moteur, lockfile et trois polices) et des neuf PNG. Le build Cloudflare reste donc sans dépendance à un navigateur installé. Une modification de source sans nouveau rendu fait échouer le build.

`test:proof-render` vérifie d'abord deux manifestes isolés (sans dérivé puis avec un dérivé), leur rendu réel et leur recalcul sans écriture. Il **rerend** ensuite les neuf sources du dépôt et compare les octets des neuf PNG, des neuf preuves et des seuls dérivés encore déclarés ; cette recette complète exige Chromium et tourne en CI, hors build Cloudflare. Les versions npm sont verrouillées par `package-lock.json` ; le rapport et le manifeste nomment le navigateur réellement utilisé. Après une mise à jour de Chromium, vérifier individuellement les nouveaux rendus avant d'actualiser le sceau, jamais le modifier pour masquer une divergence.

Le rendu refuse un texte central divergent, une annotation interdite (y compris en pseudo-élément CSS), un texte tronqué ou masqué et une étiquette de curseur sur un bouton. La flèche du curseur possède un caractère de secours à taille zéro : cette seule représentation redondante est explicitement exclue du contrôle géométrique des textes. Le texte lisible de son étiquette reste contrôlé.

## Décisions de remaquettage

Palette et typographies conservées : fond `#FFFEFB`, papier `#FCFBF7`, encre `#231F20`, vert `#1C8A41`, ambre `#B76B24`, Fraunces/Hanken. Le cadre passe de trois rangées à une seule surface utile, avec marges de 64 px. Aucun recadrage d’un ancien raster.

- 01 : flux horizontal à trois panneaux, colonnes élargies et étiquette de validation sous les boutons.
- 02 : gestes manuels / compression / résultat ; lignes plus espacées, total 48 incluant 47 propositions et 1 exception.
- 03 : revue agrandie, comparatif et justification préservés ; curseur rapproché de la zone de décision.
- 04 : récit à gauche et timeline à droite, lignes plus hautes, `Session 01` conservée.
- 05 : tableau à gauche et cadrage à droite ; suppression de `Brouillon partagé` sans remplacement.
- 06 : titre à gauche et matrice des quatre cas à droite ; garde-fou `DONNÉES FICTIVES` dans la maquette conservé.
- 07 : checklist à gauche et remise au cabinet à droite ; `Version 1.0` et décision en attente conservées.
- 08 : réseau à quatre entrées et centre agrandi ; restriction de compatibilité conservée.
- 09 : agrégats à gauche et garanties à droite ; lignes de confidentialité élargies, aucune donnée nominative.

Les numéros 01–04 **centraux** représentent les étapes réelles de la méthode, pas la pagination retirée. Les étiquettes de décision et curseurs intégrés aux panneaux sont fonctionnels et conservés. Le libellé de pied « Fail-closed par défaut. » disparaît avec le pied éditorial, mais le refus opérationnel reste intégral : « Aucun export n’est produit avant décision. »

L’oracle textuel ne remplace pas l’œil : contrôler individuellement les quatre coins et le centre de chaque image, puis le cadrage sur la landing. Les microtextes intégrés restent petits sur mobile, comme dans le layout non zoomable demandé ; les textes/alt et le design de la landing ne changent pas.
