# PR155 — corrections R1/R2

Reprise limitée aux deux défauts du rapport QA du 8 octobre 2026 ; publication et intégration à main restent à la carte de publication.

R1 : `overflow-wrap:anywhere` hérité dans le composant permet aux en-têtes CSV et aux erreurs longues de revenir à la ligne. Aucun texte n’est masqué ; le tableau conserve son défilement horizontal local. Régression navigateur : import ouvert puis refus d’en-têtes à 320, 375, 768, 1024, 1440 et 1920 px, ainsi qu’à 320×225.

R2 : le CSV ajoute `date_preparation` en dernière colonne sur chaque facture et chaque message. Elle vient des options du rapport, indépendamment du corps édité et même en l’absence de message. L’ordre des colonnes existantes, la version, les données originales, les éditions et la neutralisation restent conservés.

Rouge observé avant correction : deux tests Node sans colonne de date ; trois parcours navigateur sur la preview précédente débordent (320, 375, 320×225). Après correction : tests ciblés Node et sept parcours de reflow locaux verts. La CI Repository gates et la nouvelle preview sont les preuves de livraison à lire sur la PR ; le rapport de remise sur la carte contient leur résultat final.

N1 tactile non modifié : note QA facultative, hors périmètre R1/R2. Les conflits d’intégration et Lighthouse final restent à la publication.
