# Réactivation du fragment courant — correction F1

La revue QA de PR203 a reproduit un défaut du filtre : après l’ouverture de `#lettre-g` ou d’un terme, saisir SEPA puis activer à nouveau un lien vers cette même cible ne déclenche aucun `hashchange`. La cible restait masquée.

Le script écoute maintenant aussi les activations normales des liens vers le fragment courant du même document. Il utilise la même restauration que `hashchange` : uniquement pour une cible masquée du glossaire, vider la recherche, recalculer les entrées, le compteur et le bouton, puis défiler. La navigation native reste intacte ; clic modifié, autre document, nouvelle fenêtre ou téléchargement ne restaurent pas le filtre.

## Non-régression

Huit tests ajoutés avant correction : même lettre et même terme, clic et Entrée, 375 et 1440 px. Les huit échouent sur la visibilité de la cible avant correction, puis passent. Le lien de terme est créé hors liste dans le navigateur pour rester activable pendant le filtre ; le lien alphabétique est celui de la page.

Suite ciblée `tests/browser/glossary.spec.ts` sur un serveur Astro réel : 19 tests PASS. Filtre, état vide, effacement, cibles inconnues et visibles, liens initiaux, six largeurs et absence de JavaScript sont préservés. Pas de construction complète sur le Mac.

Le premier run complet 37824301693 a signalé une cible restaurée et un filtre vide, mais hors viewport dans un seul cas clic mobile. Le test refiltrait avant la fin du défilement initial ; il attend désormais les polices et la présence initiale de la cible dans le viewport avant l’action. Les huit cas rejoués trois fois donnent 24 PASS. Le test ainsi préparé reste rouge en production avant livraison (cible hidden), donc conserve son pouvoir de détection de F1. Le verdict CI final confirme ou infirme la stabilité de cette préparation, sans modifier le code du filtre.

## Rendu et matière métier

Main intégré : `05ebe80a`. Le run CI de collecte 37823107561, job 113468921207, construit le candidat `466dd1d6` et exécute le retrait des briefs puis le calcul de lastmod avec succès. Artefact réel 11569673512 : `dist/glossaire.html`, 321115 octets. Le reçu `anchor-ci-render-receipt.json` en conserve la mesure et les dates du step.

Le manifeste et le seul lastmod `/glossaire` sont raccordés à cet artefact. La commande de réaffirmation existante vérifie la matière rendue et les copies de sources. Comparaison exécutable avant/après : affirmations, citations, sources et inventaire rendu identiques ; 27 verdicts et leurs dates, statut et trois lots source/actifs/configuration conservés. Suite resource-pipeline : 36 tests PASS ; audit machine QA PASS. Le workflow temporaire de collecte est retiré du candidat final.

La CI complète finale et la re-revue limitée à F1 sont consignées sur la carte. Ces preuves ne constituent pas encore une vérification production. La fusion et la recette HTTPS restent conditionnées au PASS de cette même revue QA ; aucune nouvelle revue métier.
