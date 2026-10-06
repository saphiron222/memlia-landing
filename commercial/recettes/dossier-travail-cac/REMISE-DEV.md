# Remise à dev : dossier de travail CAC

Décision : confier l’index et les renvois, sans remplacer l’outil de dossier ni les feuilles maîtresses gratuites. Requête `automatiser assemblage dossier audit` sondée par l’instrument du dépôt le 6 octobre 2026 : réponse valide, aucune suggestion ; aucun volume ni trafic revendiqué. C1 V020–V023/V065–V066 et C2 documentent le geste, avec des témoignages historiques et un signal indirect pour l’index.

La recette porte neuf sections et six cas fictifs. `service:preparer`, la revue métier indépendante PASS et `service:sceller` ont été exécutés. Le rapport de revue et les copies H2A ouvertes le 6 octobre sont sous `preuves/`. La fiche outil est un livrable volontaire Memlia ; NEP315 §14 distingue les outils analytiques du logiciel documentaire, §§46/48d ne sont invoqués que dans leur champ d’identification/évaluation des risques.

## Séparation fabrication / publication

Le candidat matérialisé `pret-preview` est remis dans l’archive jointe `dossier-travail-cac-scelle.tar.gz`, pas activé dans les collections publiques de cette PR. Sur ce socle, `pret-preview` est déjà rendu par Astro : le commettre sans SERVICE_DESIGN provoque l’échec du build (« Direction artistique absente »). L’image, SERVICE_DESIGN, SERVICE_EEAT, le schéma CAC, la promotion du contrat et les liens restent exclusivement à la carte dev t_2e40a47f. La PR marketing livre la recette, la mesure et les preuves sans nouvelle route ni changement du chrome.

Après ajout des fichiers de design par dev :

1. Rejouer `node commercial/recettes/dossier-travail-cac/rejouer.mjs --check`.
2. Exécuter `npm run service:preparer -- dossier-travail-cac` puis `npm run service:sceller -- dossier-travail-cac` : régénère le candidat et enregistre son propriétaire dans le registre. Réutiliser `revues.json` ; aucune seconde revue du fond pour date/lien/empreinte.
3. Choisir une image propre, HTML figé, montrant index, pièce orpheline et conflit visible ; pas de nom d’éditeur, marque, slogan ou cartouche promotionnel.
4. Poser les trois liens projetés de recette.json. Si les articles CAC ne sont pas encore indexables, documenter trois substitutions réellement pertinentes, sans réduire le minimum et sans compter le chrome.
5. Ajouter Service/Audience CAC et les métadonnées Kevin Kitanga avec dates exactes ; promouvoir le contrat de cette URL, pas ceux des pages futures.
6. Rejouer build/tests, QA du code, puis fusion/publication avec observation réelle no-cache sans query string, footer/sitemap et suivis J+7/J+28.

## Vérifications marketing

- Mesure instrument : ok=true, suggestions=[] ; `preuves/demande.json` et relevé `titres-intent-2026-10-06.json`.
- Rejeu et --check : six cas PASS, inputs inchangés, contributions conservées.
- Revue indépendante : PASS, `revues.json` et `preuves/revue-metier.md`.
- Préparation, scellement et audit avec candidat : PASS (six services).
- Tests de forge : 15 PASS.
- Build complet après séparation des surfaces dev : PASS ; tests Node 707 PASS, 8 skipped, 0 failure ; audit ressources QA PASS. Les tests Python de preuve sont exécutés par le build.

Le rejeu démontre la convention sur un jeu fictif, pas une intégration réelle ni une restauration physique. Le devis et la recette du cabinet fixent ces contrôles avant activation.
