# Reprise de la validation

Le contrat commun `tests/browser/outils.spec.ts` ne possédait pas de parcours pour la checklist. Échec reproduit avant correction : « Scénario réseau à définir pour l’outil checklist-pieces-comptables ».

Correction limitée au scénario : exemple à quatre états, demande des seules pièces manquantes, inconnues séparées, export JSON, lecture locale avec aperçu sans remplacement, confirmation explicite puis réexport identique. Les assertions communes zéro requête après armement et zéro stockage restent intactes.

Intégration de `origin/main` : conservation du système de page et des copies méthode/garanties déjà livrées, avec réinsertion des seuls liens checklist. Registres et preuves additionnels conservés des deux côtés. Surfaces générées réactualisées par `npm run regen:generated` (PASS).

Vérification sur le site compilé servi par Astro preview : 11 tests moteur/preuve HTML PASS ; 9 tests navigateur PASS, dont les huit parcours checklist (six largeurs 320, 375, 768, 1024, 1440, 1920) et le contrat réseau commun de tous les outils. Les essais initiaux sur le serveur de développement ne représentent pas le rendu compilé : outils de développement Astro et imports Vite ajoutent des éléments et requêtes. Aucun assouplissement de test n’a été effectué pour les faire passer.

La construction complète et l’ensemble de la suite restent soumis au verdict GitHub Repository gates. QA indépendante et publication sont les phases des enfants existants ; aucune fusion de cette PR n’est effectuée par la présente construction.
