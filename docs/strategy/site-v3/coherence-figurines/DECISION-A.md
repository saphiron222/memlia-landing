# Décision A — 15 octobre 2026

Kevin choisit « la A » après consultation de l’atelier et du pilote Méthode. Ce choix autorise la déclinaison des scènes de travail sur les six pages convenues, sans nouvelle validation d’images.

## Traduction dans le site

- Une scène propre par page : portefeuille EC, dossier CAC, règle et recette Méthode, construction À propos, accès et exception Garanties, premier échange Contact. Méthode reprend l’image A approuvée ; cinq images supplémentaires sont générées séparément avec cette image et les figurines originales comme références.
- Héros centrés, Fraunces / Hanken, crème et vert ; mêmes cartes de destination que le catalogue robots. Trois portes : robot, agent IA, tâche sur mesure. Pas d’image obligatoire immédiatement sous le H1.
- Les scènes sont des illustrations de service. Elles ne constituent ni une démonstration produit, ni une équipe réelle, ni une preuve de résultat client. Les tables fictives et accessibles des robots restent intactes.
- Les anciens cadres commerciaux et vidéos explicatives quittent les six pages. Les fichiers historiques restent présents pour leurs recettes et références. Les seuls liens retirés sont les téléchargements des vidéos EC et CAC et l’identifiant de description de la vidéo CAC. Tous les liens vers les services, articles, outils et garanties, ainsi que les ancres utiles, sont conservés.
- Le nom accessible des cartes lit maintenant leur texte visible, au lieu d’un `aria-label` partiel : correction du critère « label in name », sans changement visuel des robots.
- Les références et textes normatifs CAC, son tableau de frontière et ses FAQ restent issus du contenu existant. Aucune nouvelle règle fiscale, sociale ou d’audit n’est publiée dans cette refonte.
- Le formulaire garde son script, ses champs, ses validations, ses consentements et ses présélections. Aucun message réel envoyé. Sans JavaScript, l’alternative courriel reste accessible ; la vérification anti-abus demeure nécessaire pour le formulaire.

## Préservation et dépendance Claude Code

Les pages commerciales utilisent `PageEditoriale.astro`. Les guides continuent d’utiliser `PageCommerciale.astro`, inchangé. Le hub intégrations est laissé en attente, à la demande de Kevin. Son titre dans la navigation n’est pas modifié par anticipation.

Le worktree agents a été relu au commit `42a10d59` (15 octobre, 13:28) : premier gabarit et première fiche présents, chantier encore actif. Aucun changement de son checkout ni fusion partielle. Le lien de construction d’un agent rejoint le cadrage de méthode dans cette branche ; le lien direct vers le catalogue agents sera repris lors du rapprochement avec la version terminée. Le catalogue robots et ses 21 destinations restent consultables.

Les corps d’articles, services et recettes de guides restent inchangés. La régénération actualise les empreintes de surfaces partagées et les dates du registre ; elle ne réécrit pas leurs textes scellés. `preservation.json` consigne les fichiers comparés et l’identité du script contact. Les tests ne dépendent pas d’un ancien commit présent uniquement sur le Mac : ils restent utilisables dans le clone court de la CI.

## Production d’images

Source : `/Users/kevinkitanga/dev/interne/memlia-landing-sources/coherence-figurines/2026-10-15/`.

- `originaux/` : PNG 1536 × 1024, six scènes A ; anciens pilotes A et B conservés.
- `prompts/` : instructions exactes et fichiers de référence pour chaque génération ; outil intégré `image_gen.imagegen`, aucun choix de modèle exposé.
- `planche-production.png` : six scènes à comparer (Accueil EC, CAC, À propos / Garanties, Contact, Méthode).
- `manifest-production.json` : route, original, références, dimensions, poids et empreintes des dérivés.
- `qa/` : captures des six pages, rapports et observations.

Site : `public/illustrations/figurines/{accueil,cac,methode,apropos,garanties,contact}-{640,1200}.{avif,webp}`. Les variantes 128/256/512 de Balthazar et Aude reprennent leurs originaux validés pour les petites cartes. Les images sociales JPEG 1200 × 630 sont générées par le pipeline existant, sans recadrer les figurines.

Manifestes versionnés : `docs/qa/coherence-figurines/production-images.json` et `docs/strategy/site-v3/coherence-figurines/prompts-production.json`. Les cinq logos officiels et les quatre logiciels du hub restent locaux, avec leur provenance et le nettoyage du SVG data.gouv déjà documentés.

## Correction des sections vertes après captures de Kevin

Les captures du 15 octobre à 13:40–13:41 montrent un mélange des anciennes cellules blanches et du fond vert ajouté. Kevin précise ensuite qu’il préfère conserver le vert du hub robots. Le choix final est donc **un fond vert continu**, partagé par la signature du hub et les engagements éditoriaux (`memlia-surface-verte` : mêmes couleur, marge intérieure et arrondi). Les anciennes classes de cellules ont été retirées : aucun rectangle blanc ni bande grise. Les titres et textes s’alignent en lignes, séparées par un trait fin. Le panneau sombre de la règle écrite reste distinct. Vérification ciblée des six blocs sur téléphone et ordinateur.

## Recomposition après les captures de 13:48–13:50

Kevin refuse les longs blocs étroits laissant la moitié droite vide. Les sections données, personnes, recette et périmètre de Garanties sont recomposées en grilles de trois faits, sur l’anatomie des livrables des robots. À propos présente une introduction puis trois engagements, un bloc fondateur en deux colonnes et les publications à côté de leur introduction. Contact présente trois étapes, puis deux colonnes pour les canaux et les informations préalables. Les textes et liens utiles sont répartis, sans ajouter une figurine décorative à chaque paragraphe. `GrilleEditoriale.astro` reprend les espacements, titres et filets verts des livrables des fiches robots. Les bandes vertes restent uniformes et les scènes A restent celles choisies.

## Contrats et exports

Les tests des lecteurs vidéo retirés ont été remplacés par des contrôles de chargement des scènes, de légende, de mouvement réduit, de clavier et de formats responsifs. Les preuves fonctionnelles des services, outils et guides gardent leurs tests. Le témoin de contenu de l’accueil est recalé sur la recette A et continue de rejeter une altération dans les onze sections. Le contrat de navigation attend le libellé robots déjà validé. L’export Markdown refusait la formulation fonctionnelle « date de consultation », assimilée à une note interne de recherche : elle devient « date de lecture » dans Suivi URSSAF et Dette fiscale ; la restitution sociale URSSAF est régénérée depuis sa démonstration. Le garde n’est pas désactivé.

## Ajustement demandé à 14:20 : étapes compactes et deux suppressions

Kevin demande des petites cartes d’étapes, avec sa capture Outils-EC pour référence de composition. Cinq cartes numérotées remplacent les longues rangées et leurs blocs de livrables répétés. Numéro dans un carré vert, repère court, titre Fraunces et un paragraphe ; fond vert clair continu, cartes blanches, sans interaction factice. Trois colonnes au maximum, dernière paire centrée ; deux colonnes sur tablette, pile sur téléphone. La hiérarchie et les cinq ancres historiques restent natives et accessibles sans JavaScript. Cette demande explicite remplace, pour cette section, la règle ancienne qui réservait les cartes aux destinations.

Les textes raccourcis conservent observation, accès et règle, essais fictifs, acceptation par l’équipe, maintenance définie au devis. Les frontières détaillées restent dans le panneau sombre et la section sur le coût. Aucun changement de promesse technique.

Le paragraphe de Méthode contenant le lien « éprouver la préparation des appels de facture électronique » est supprimé entièrement, sans déplacement. Le lien de Garanties vers ce service est conservé. Le test de préservation autorise ce seul retrait sur `/methode` ; le relevé historique reste intact. La déclaration historique de ce lien dans la recette scellée du service devient obsolète : ce point est consigné dans la recette QA, sans réécrire le corps scellé ni contourner le validateur global.

La légende « Nos figurines représentent les tâches que nous construisons et maintenons avec vous. » est supprimée sur À propos. L’image A et son texte alternatif restent présents ; aucun figcaption vide n’est rendu.

Contrat visuel : cabinet souhaitant comprendre la mission avant le contact ; priorité aux cinq étapes et à leur ordre, puis à la règle écrite. Cibles 375 × 1000, 768 × 1000 et 1440 × 1000. Aucun état de chargement, erreur, vide, permission ou résultat partiel : contenu HTML statique, sans action réseau ni contrôle supplémentaire. Vérifier l’état chargé, l’ancre directe, l’absence de JS et le mouvement réduit. Captures et tests ciblés dans la recette QA.
