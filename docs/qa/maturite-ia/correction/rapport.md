# Correction ciblée PR73

Deux défauts de la revue t_873665dd corrigés, sans nouvelle revue ni publication.

## Trois actions

Le moteur retient d’abord les dimensions non formalisées dans l’ordre données, validation, règles, mesure, usages. Quand il en reste moins de trois, il complète par des suivis de dimensions déjà formalisées : validation, règles, mesure, sans doublon. Chaque suivi cite les réponses réelles qui le justifient ; aucune inconnue n’est inventée. La méthode à l’écran et dans le Markdown décrit désormais ce complément.

Non-régression : les 32 combinaisons de dimensions formalisées/non formalisées, couvrant notamment zéro, une, deux, trois et cinq dimensions à traiter, donnent trois actions distinctes, justifiées, dans le bon ordre et sans mutation de l’entrée. Échec initial constaté : profil 1, une action au lieu de trois. Huit tests moteur PASS après correction.

## Impression

Chromium masque le contenu des détails fermés. Les listes de réponses et de justifications ont une copie dédiée au papier, hors des détails. Le CSS masque les copies à l’écran et masque les détails sur papier : pas de doublon et aucune mutation de leur ouverture.

Deux parcours Chromium, détails tous fermés puis ouverture mixte : PDF A4 réel généré ; retour à l’écran avec état identique et copies invisibles. PDFKit/Swift extrait le texte des deux PDF. Vérification des chaînes complètes (question et réponse, action, justification) : quinze réponses, trois actions et neuf justifications PASS dans chacun. Fichiers print-0/1.pdf, print-0/1.txt et expected-print-0/1.json. Le vérificateur verify-print.py s’exécute sur les PDF de .qa/test-results avec expected-print.json adjacent ; dépendance locale : Swift/PDFKit macOS.

## Régressions et livraison

39 parcours navigateur diagnostic/outils PASS, dont les six largeurs 320/375/768/1024/1440/1920, conservation de saisie, export, réseau et stockage. Astro check : zéro erreur, zéro warning, huit hints existants. Build complet PASS, 130 tests Python et 642 tests scripts PASS ; audit ressources QA PASS.

Le premier build a révélé une base main locale obsolète puis le garde d’ascendance sur main courant. Main d8cff067 a été intégré uniquement à la branche PR73 ; conflits additifs diagnostic/ROI/charte résolus en conservant les trois outils, leurs preuves et le contenu de main. Les dates des rendus ont été synchronisées ; revue du glossaire conservée et réaffirmée par l’outil existant. Le script de scellement rétablissait une ancienne date de campagne : la date déjà attestée sur main (2026-10-04T02:49:45.632Z) a été conservée, sans fabriquer de revue ni modifier le fond. Cela ne constitue aucune publication.

CI GitHub à relire sur la branche poussée avant clôture. La seule levée indépendante reste t_873665dd ; fusion et constat public restent t_0edf65c0.
