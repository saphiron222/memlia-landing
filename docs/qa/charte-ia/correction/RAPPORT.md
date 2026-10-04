# Charte IA — levée des défauts de la revue unique

Correction de PR55 après le FAIL t_28fd4c97. La publication reste confiée à t_250a564c après constatation indépendante de levée par QA ; aucune fusion ni production dans cette phase.

## Copie de secours

Le repli expose une zone de texte distincte, en lecture seule, contenant le document complet construit par `charterDocument` : titre, statut non officiel et clauses éditées. Elle reçoit le focus et une sélection intégrale sans modifier les clauses. Les modifications du questionnaire ou des clauses retirent ce secours devenu périmé ; le reset confirmé l'efface. Les exports et l'impression gardent le même document.

Deux nouveaux tests Playwright comparent la sélection réelle à un oracle indépendant, pour Clipboard refusé et indisponible. Ils ont d'abord échoué sur l'absence du titre et de la mention, puis passent avec les clauses intactes et les exports octet pour octet identiques. Le test nominal d'export emploie également cet oracle.

## Intégration

Main intégré : version incluant PR53 et les lots B/C/D, le FEC et la correction du hero d'accueil. Huit conflits résolus : quatre preuves/glossaire/lastmod, et les registres outils/requêtes/preuves et le test des images. Les définitions FEC et charte sont toutes deux conservées. Les preuves historiques sont reprises de main, puis le seul changement de chrome dû au lien charte dans le footer est reconstruit.

`CharteIa` ne porte plus `id=outil-calcul`. `OutilZone` demeure le propriétaire de l'ancre ; le contrôle rendu vérifie une ancre unique contenant la charte. Navigation et hero partagé restent identiques à main ; le média hero est eager/prioritaire.

Le test transversal « zéro réseau/stockage » supposait que tout outil autre que les calculateurs/FEC était le rapprochement : échec réel observé sur la charte, puis ajout de son parcours propre, sans modifier les assertions réseau/stockage.

## Glossaire et revue métier conservée

Témoin ../baseline construit sur main intégré. `<main>` sérialisé identique, matière et sources identiques à ce témoin. Les 27 verdicts existants sont conservés octet pour octet (le bornage des affirmations sensibles de main en utilise désormais 25 ; aucune nouvelle décision métier ici).

Le script `refresh-glossary-chrome.mjs` se lance depuis la racine du candidat après rendu et construction du témoin, avant actualisation des preuves. Il utilise l'instrument fail-closed existant avec des sorties isolées dans `correction/`, ne permet que le changement de chrome, vérifie les affirmations rendues et les copies de sources et produit deux reconstructions réelles identiques. Le manifeste courant, le reçu et le registre sont rapprochés. Les anciennes preuves auteur restent historiques.

## Exécution locale

- 2 tests de sélection rouges observés avant correction ; 5 tests charte verts ensuite.
- Moteur et registre : 28 tests Node PASS.
- Build complet : sortie 0, 126 tests Python et 619 tests scripts agrégés PASS ; audit ressources QA PASS.
- Astro check : 0 erreur, 0 warning, 8 hints préexistants.
- 91 parcours Playwright ciblés PASS : charte, gabarit lot A, navigation mobile, outils historiques, lot D et FEC. Six largeurs 320/375/768/1024/1440/1920 sans débordement.
- Sonde indépendante de l'archive QA rejouée sans changement : sélection complète identique pour refus/indisponibilité, éditions préservées, presse-papiers autorisé, .md/.txt téléchargés, PDF réel et contenu extrait relu, refus/annulations/reset/clavier PASS. Aucune requête après chargement ni erreur JS ; stockage, cookies, IndexedDB, caches et service workers vides.
- Contrôle rendu : canonical, H1/OG/headline, WebPage/WebApplication/BreadcrumbList, sitemap/robots, entrants hub/méthode/garanties, médias, ancre unique, export et PDF PASS.
- Captures 375/1440 inspectées. La sélection du champ défile vers la fin mais son contenu intégral est vérifié par les tests. La barre de navigation fixe apparaît à la position du scroll dans les captures pleine page ; le gabarit partagé est conservé, pas de refonte adjacente.

Les logs bruts, sonde, exports/PDF et captures sont remis dans l'archive de correction sur la carte. La CI distante du candidat final doit être constatée et consignée dans le rapport de transmission avant clôture d'implémentation.

## Risques résiduels et livraison

CSP `connect-src none` conservée. Réserves de la revue initiale conservées : vocabulaire calcul/calculateur, aside long et Lighthouse SEO92 expliqué par le contrôle robots bloqué dans le contexte CSP alors que robots est HTTP200. Trois alertes npm héritées de main (une moderate, deux high), aucune dépendance modifiée ici. Pas de données de terrain inventées. `publieLe` de la charte reste null.

Retour arrière : PR de revert du changement charte, sans retirer les outils ni les lots déjà publiés. La publication attend la constatation QA ciblée de la levée de ce FAIL, dans la continuité de la revue unique, puis CI verte et livraison Cloudflare réelle par platform.
