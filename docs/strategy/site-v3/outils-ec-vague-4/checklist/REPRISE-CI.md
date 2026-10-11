# Reprise de la validation

Le contrat commun `tests/browser/outils.spec.ts` ne possédait pas de parcours pour la checklist. Échec reproduit avant correction : « Scénario réseau à définir pour l’outil checklist-pieces-comptables ».

Correction limitée au scénario : exemple à quatre états, demande des seules pièces manquantes, inconnues séparées, export JSON, lecture locale avec aperçu sans remplacement, confirmation explicite puis réexport identique. Les assertions communes zéro requête après armement et zéro stockage restent intactes.

Intégration de `origin/main` : conservation du système de page et des copies méthode/garanties déjà livrées, avec réinsertion des seuls liens checklist. Registres et preuves additionnels conservés des deux côtés. Surfaces générées réactualisées par `npm run regen:generated` (PASS).

Vérification sur le site compilé servi par Astro preview : 11 tests moteur/preuve HTML PASS ; 9 tests navigateur PASS, dont les huit parcours checklist (six largeurs 320, 375, 768, 1024, 1440, 1920) et le contrat réseau commun de tous les outils. Les essais initiaux sur le serveur de développement ne représentent pas le rendu compilé : outils de développement Astro et imports Vite ajoutent des éléments et requêtes. Aucun assouplissement de test n’a été effectué pour les faire passer.

La construction complète et l’ensemble de la suite restent soumis au verdict GitHub Repository gates. QA indépendante et publication sont les phases des enfants existants ; aucune fusion de cette PR n’est effectuée par la présente construction.

## Reprise du contrat du hub

Le run 37764582883 a terminé en échec : un seul parcours navigateur échoue, le hub refusant le libellé générique « Ouvrir l’outil » sur la nouvelle carte checklist. Le même test a été rejoué sur le site compilé après intégration de main : échec identique observé avant correction.

Correction minimale : ajout du libellé « Préparer la demande des pièces manquantes » à la table des actions du hub, sans affaiblir son test. Les publications indépendantes de main sont conservées ; conflits des registres résolus par addition des seuls éléments checklist et régénération officielle des surfaces. Le moteur et l’interface de l’outil restent inchangés.

Vérification : 11 tests moteur/preuve HTML PASS ; 10 parcours navigateur PASS (huit checklist dont six largeurs, contrat du hub, contrat commun zéro requête/zéro stockage avec export-réimport). `npm run regen:generated` et `git diff --check` PASS. La suite complète est laissée à la CI GitHub ; aucune validation distante n’est déduite de ces résultats locaux.
