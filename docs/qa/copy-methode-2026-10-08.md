# COPY — méthode : livraison pour la revue QA

## Résultat

La page garde son H1, ses quatre étapes, ses quatre sections, ses images et toutes ses destinations de liens. Le chapeau présente la tâche entière, de l’observation à la maintenance, dans les outils du cabinet. Le cadrage nomme les quatre parties de la règle écrite dans l’ordre de la charte v5. La frontière utilise la bande à trois cellules du gabarit existant ; aucun CSS ni visuel n’est ajouté. La recette est définie et la livraison comprend règle et essais. Les évolutions reviennent à la recette du cabinet.

CONT-09 : le téléchargement du classeur est distingué du contrôle en ligne et de la validation du rapprochement. Écarts et éléments inexpliqués restent visibles/exportables NON VALIDÉ ; même la concordance attend le collaborateur. Aucun changement du comportement outil ni nouvelle doctrine comptable.

## Vérifications exécutées

Avant écriture, sur origin/main : deux tests navigateur PASS pour téléchargement .xlsx sans JavaScript et export d’exception NON VALIDÉ. Composant ModeleRapprochement.astro lu.

Après écriture :

- `npm run regen:generated` : PASS ; fichiers dérivés joints à la PR.
- `npm run build` : PASS. Le premier passage exigeait le préfixe historique de description ; la formulation a été ajustée, sans changer l’intention.
- `python3 -m unittest discover -s tests/proof -p test_positioning.py -v` : 8 PASS.
- Tests navigateur méthode, positionnement et outil ciblé : 13 PASS.
- Rejeu depuis /methode : téléchargement .xlsx immédiat ; solde 512 fictif 900,00, différence 50,00 exportée NON VALIDÉ ; exemple concordant toujours à valider. Exception inexpliquée 12,34 exportable, test existant PASS.
- Largeurs 320, 375, 768, 1024, 1440, 1920 : aucun dépassement horizontal ; quatre étapes et images chargées. Captures pleine page 375 et 1440 relues.
- Liens de source avant/après identiques, canonical inchangée. Liens internes de main testés HTTP 200 sur la prévisualisation.

## Base avant publication

Relevé HTTP direct avec Cache-Control: no-cache le 08/10/2026 à 00:43:50 UTC : /methode 200 ; canonical https://memlia.fr/methode ; ancienne restriction « ne se télécharge que lorsque » encore présente ; NON VALIDÉ absent. Ce relevé est une base de correction, pas une mesure de conversion.

L’audit initial du 05/10 relève CONT-09 et un passage Lighthouse 78/100/100/100, LCP 4,932 s, CLS 0,0019. Ces scores sont un passage de labo à confirmer ; cette carte ne les attribue pas à la copy et ne reprend pas les travaux techniques H3.

Trafic, demandes qualifiées et taux de conversion : non mesurés dans cette livraison. Aucun gain revendiqué.

## Revue puis publication

Une seule revue QA sur cette carte. Après PASS et CI verte, intégrer la PR puis vérifier /methode réellement en production avec Cache-Control: no-cache, sans query string. Rejouer `methode-copy.spec.ts` avec QA_URL=https://memlia.fr, et les deux tests outil ci-dessus. Vérifier sitemap, canonical, liens et contenu rendu. Si une intégration dev est nécessaire, créer la carte de publication dev avec le verdict QA acquis ; ne pas déclencher une seconde revue de fond.

## Suivis J+7 et J+28

Le point de départ est la date réelle de publication, à consigner à l’intégration. Les contrôles sont dus à cette date +7 et +28 jours, pas à la date de rédaction.

J+7 : rejouer HTTP/canonical/liens et CONT-09 ; relever impressions, clics, requêtes et position de /methode dans Search Console si l’accès est disponible. Relever les demandes qualifiées attribuables seulement si une source les établit. Sinon inscrire « non mesuré ».

J+28 : refaire le même relevé ; comparer les fenêtres de même durée avant/après, distinguer les effets de H3/H4 et des autres publications. Noter les limites de volume avant toute interprétation. Expérience suivante : vérifier si les demandes décrivent mieux la tâche et le résultat attendu, plutôt que conclure sur le seul nombre de visites.

## Notes de périmètre

hotspot: src/data/pages-v2.mjs — plusieurs cartes COPY partagent le fichier ; cette PR ne touche que description et chapeau de methode. En conflit, conserver les autres entrées de main et régénérer les fichiers dérivés.

Les petites illustrations et la longue liste d’outils sont des caractéristiques préexistantes de la page conservée ; les notes visuelles ne déclenchent pas ici de refonte du gabarit ni d’images.
