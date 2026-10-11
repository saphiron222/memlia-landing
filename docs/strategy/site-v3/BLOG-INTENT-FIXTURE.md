# Fixture de conservation historique de l’intention

`tests/scripts/blog-intent-preservation.test.mjs` reconstruit une publication historique dans un dossier temporaire. Sa date de matérialisation est le 3 octobre 2026, cohérente avec les preuves de cette fixture et les mesures d’autocomplétion disponibles. Elle ne dépend pas du jour où la CI tourne : reconstruire le dossier au jour réel faisait expirer sa requête le 7 octobre 2026.

Le test rejoue aussi la matérialisation sous une horloge simulée neuf jours après le dernier relevé présent dans la fixture. La publication scellée doit rester valide, le candidat non scellé doit être refusé pour absence de relevé frais, et un sceau rompu ne doit pas bénéficier de la conservation historique.

Après génération de `dist` par Astro, lancer :

    node --test tests/scripts/blog-intent-preservation.test.mjs

Le build complet inclut ce test via `test:blog-contract`. La date historique n’est fournie que par le test ; les commandes de forge et la fraîcheur de huit jours des vrais candidats restent inchangées. Aucun contenu publié, relevé, avis ou sceau du dépôt n’est réécrit par ce correctif.
