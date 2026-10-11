# CI — reprise en onglet isolé

Constat technique du 6 octobre 2026, carte `t_33a53ed2`, PR101.
La QA technique unique du filtre beacon est conservée ; cette note ne revoit
ni le contenu métier, ni le code du générateur ou de la bibliothèque.

## Cause établie

Le message « URL vide » du run `37378790419`, tentative 2, ne prouve pas une
navigation vers une page vide. Sur la base `eaf4679f`, R1 est reproduit en rouge
avec Playwright 1.63.0, Chromium 153 et Node 22.22.3 sur le Mac :

- le lien natif `_blank` ouvre réellement la bibliothèque ; les documents et
  scripts reçoivent HTTP 200 et CDP émet la navigation vers la bonne URL ;
- le test attend d'abord la fin du clic dans le parent devenu arrière-plan,
  alors que l'événement popup est déjà reçu ; le clic reste en attente jusqu'à
  la fermeture du contexte par le timeout ;
- l'assertion URL est alors atteinte pendant la fermeture du contexte et affiche
  une chaîne vide. Ce résultat ne décrit pas la destination réellement chargée.

La charge élevée est observée, mais n'est pas présentée comme cause racine.
`noWaitAfter` seul, puis l'activation après la fin du clic, ont été contre-testés
et rejetés : cinq passages ciblés verts ne suffisaient pas, les deux cas R1
redevenaient rouges dans la suite voisine.

## Correctif du harness

Recevoir le popup et réactiver le parent en parallèle du clic natif, puis
attendre les deux opérations avant de travailler dans le nouvel onglet.
Chaque onglet est activé avant ses contrôles. Le clic conserve les contrôles
Playwright par défaut : pas de `force`, pas de `noWaitAfter`, pas de navigation
simulée, aucun timeout augmenté, aucun retry ajouté.

Toutes les assertions restent présentes : URL des deux onglets, `opener === null`,
modèle complet repris, prompt édité et formulaire originaux inchangés,
stockages vides et export exact. Un second cas retarde réellement la requête
HTTP de destination de 250 ms ; il exerce les mêmes assertions et le même
clic, pas un sommeil censé réparer le test.

## Preuves de non-régression

- Base rouge : reproduction du même timeout R1, traces CDP et réseau conservées.
- Correctif final : dix passages sur les deux cas R1, tous PASS, traces activées.
- Contrôles de mutation réels non livrés : rendre l'opener accessible provoque
  deux échecs sur l'assertion d'isolation ; remplacer le prompt original par
  « Travail perdu » provoque deux échecs sur la conservation du texte.
- Les logs, traces, résultat de la suite voisine et conclusion CI sont archivés
  avec la carte ; la CI doit être verte avant la reprise de publication.

La CI runner/double build reste le périmètre séparé de `t_cac7f25c`.
Aucun changement CSP, traitement local, headers ou logique produit.
