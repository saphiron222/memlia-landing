# Correction du FAIL contact — 4 octobre 2026

## Avant / après

Avant : une case obligatoire groupait réponse et analyse de la provenance. Le serveur enregistrait le chemin même sans accord distinct ; la politique disait à tort que ce chemin ne disait rien du visiteur.

Après : la réponse et la sécurité restent sur intérêt légitime. La case obligatoire est une confirmation de lecture de la politique, sans consentement à la provenance. Une seconde case facultative non précochée autorise l’association du seul chemin interne au message. Le navigateur ne remplit ce chemin qu’après accord ; le refus et le retrait avant envoi le vident. Après envoi réussi, le formulaire et le chemin reviennent à leur état initial.

Le serveur ignore toute origine si consentement_origine n’est ni le booléen true ni la valeur de formulaire 'on'. Il enregistre NULL sans empêcher le message, y compris pour un chemin forgé accompagné d’un accord absent, false, vide, 'false', 'true', 1, objet ou tableau. Le nettoyage des chemins reste actif après accord. Aucun changement du schéma D1, du transport, des durées ou des messages existants.

La politique qualifie ce chemin de donnée personnelle liée au message, décrit les deux bases, les douze mois maximum et le retrait par courriel. Les provenances historiques ne constituent pas une preuve de consentement spécifique ; aucune validation rétroactive. Le dispositif de preuve et le retrait manuel sont explicités dans recette.md et restent soumis à la revue métier.

## Exécution réelle

- Test API écrit avant correction : 19 PASS, 1 FAIL, car origine='/garanties' persistait sans accord. Log contact-red.log dans l’archive.
- Après correction : 39 tests Node ciblés PASS (API, Turnstile, purge et lot B), aucun échec ni test ignoré.
- Navigateur : un échec intermédiaire a montré que reset() laissait la valeur de l’input hidden après accord ; correction par recalcul après reset, puis 25 tests PASS, zéro échec ou test ignoré. Refus, accord et retrait avant envoi joués sur le formulaire rendu ; transport intercepté, aucun vrai message.
- Six largeurs des contrats de copy : 320, 375, 768, 1024, 1440 et 1920 px. Contact existant sans JavaScript et protections anti-abus conservés.
- Astro check : zéro erreur, zéro warning, huit hints existants.
- Build complet : 120 tests Python PASS ; 573 tests Node PASS, 1 FAIL. Le seul échec restant est resource-pipeline.test.mjs:71, qui exige la preuve métier du glossaire courant. Aucun PASS créé par dev et aucun gate désactivé.
- Pour la recette navigateur, Astro preview sert le dist réel après génération ; QA_URL local évite uniquement de relancer le build bloqué par cette preuve. Cela ne valide pas la CI ni la publication.
- main actualisé par fusion non destructive : intégration des PR54 et PR57, sans changement propre de leur matière. Articles/Cicatrices, guides individuels et public restent sans diff par rapport à origin/main.

## Sources et suite de la même revue

Sources CNIL effectivement ouvertes le 04/10/2026 : consentement (libre, spécifique, éclairé, univoque, preuve et retrait) ; RGPD chapitre II, articles 6 et 7. Copies complètes dans sources/cnil-consentement.md et sources/cnil-rgpd-articles-6-7.md.

PR56 : https://github.com/saphiron222/memlia-landing/pull/56
La même revue métier doit vérifier cette correction, conserver ses constats favorables sur la matière inchangée et enregistrer les verdicts du glossaire. Rejouer ensuite le build et Repository gates avant fusion ; constater Cloudflare et memlia.fr, puis transmettre les URLs et preuves à t_2caf75a7. Aucune fusion ni publication réalisée par dev lors de cette correction.
