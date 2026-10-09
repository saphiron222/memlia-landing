# Accueil CAC — livraison E4

Route statique `/commissaires-aux-comptes`, composée des onze sections partagées, copie E1 et revue métier E2 conservées. Les trois scènes E3 restent propres à cette page. Avant E9, Hero rend uniquement le poster : aucun lecteur, téléchargement ni source vidéo vide.

La couverture suit immédiatement Orientation. Dans Méthode, le tableau de frontière suit les quatre étapes (donc le cadrage), puis la fiche outil encadrée ; ce placement préserve la grille commune et a été accepté par QA. Sources compactes après FAQ, dans un bloc distinct de l’appel final. Les liens d’accueil et du menu sont activés par D6 ; pilier, footer et llms raccordés. H1, OG et headline concordants, Service avec audience CAC et FAQ issue des mêmes données.

## Vérifications

- Rouge observé : quatre contrats de publication avant implémentation.
- 24 tests Node ciblés PASS, dont contenu EC conservé par son témoin et vrai rendu Astro de sections paramétrées.
- 17 tests Playwright PASS : CAC aux six largeurs 320/375/768/1024/1440/1920 et navigation-v3 sur la vraie route ; tableau au clavier, aucune vidéo ni requête média, images chargées au défilement, schéma et sources séparées de l’appel final.
- BuildProof : 18 PASS ; QA a aussi rejoué le module test_build complet : 26 PASS.
- Contrat de 73 pages VERT ; ownership 330 URL / 396 déclarations sans conflit.
- `npm run regen:generated` PASS ; fichiers dérivés ajoutés à la livraison.
- QA indépendante : FAIL initial pour cibles des sources et fiche non encadrée, puis correction avec régression rouge→verte et re-vérification limitée : PASS. Sources ≥44 px ; fiche bord 1 px, padding 24 px, lien vert fléché. Rapports et captures remis avec la carte.

La CI GitHub Repository gates reste l’oracle des tests complets, types et construction finale. Aucun déploiement manuel de production. Search Console : inspection en lecture et sitemap seulement ; aucune demande d’indexation automatique promise.

## Risques et suites

L’illisibilité des détails des preuves à 375 px et la répétition des trois scènes dans la même page sont les limites connues acceptées par E3/système. Aucune compatibilité logicielle ni performance réelle n’est déduite des illustrations fictives. E9 remplace la variante poster et adaptera les assertions qui décrivent l’état sans vidéo ; H4 conserve la ligne CAC de llms.

Hotspots : Hero.astro, Methode.astro, Footer.astro, page-intent-contract.json et llms.txt. Préserver les branches sœurs ; données dérivées régénérées depuis main en cas de conflit.

Retour arrière : revert du commit de fusion sur une branche depuis main, préserver les livraisons ultérieures et régénérer les données dérivées avant PR/CI.
