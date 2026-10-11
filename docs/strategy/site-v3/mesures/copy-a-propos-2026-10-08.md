# À propos : base de la passe de copy

Carte : t_fae663f4. Base de travail : origin/main 4ccf8761, relevée le 08/10/2026.

## Décision

Conserver le H1, les cinq sections, les preuves existantes et tous les liens : l’audit H1 recommande « Conserver ». Resserrer les phrases et relier Kevin Kitanga à la règle écrite et aux essais plutôt qu’à une biographie. Le chapeau dit dès l’ouverture où l’automatisation travaille et qui garde la décision. La valeur et la frontière humaine restent avant le fondateur.

La confiance de marque est une hypothèse qualitative, pas un gain mesuré. Aucune nouvelle revendication réglementaire, preuve client ni donnée de performance.

## Base avant publication

GET https://memlia.fr/a-propos réussi le 08/10/2026, avec Cache-Control: no-cache. Copie HTML de référence conservée sur la carte lors du passage QA. Comparaison du relevé servi et du candidat : aucun lien supprimé ni ajouté ; ancre kevin-kitanga présente avant et après. Le H1, le titre d’onglet et la description restent identiques. Aucune mesure de trafic, de demande ou de conversion n’est disponible dans ce relevé : ne pas attribuer de variation à la copy.

## Vérification de l’implémentation

- npm run regen:generated : PASS, avec réaffirmation des dérivés seulement.
- Positionnement : 8 tests PASS ; identité légale : 11 tests PASS.
- Tests à propos et E-E-A-T : 4 tests PASS.
- Six largeurs 320, 375, 768, 1024, 1440, 1920 : aucun débordement horizontal.
- Captures pleine page 375 et 1440, préférence native reduced-motion : bloc fondateur et CTA final visibles, aucun texte principal tronqué. La première capture en défilement rapide était incomplète ; elle n’est pas une preuve de page absente et est remplacée.
- Construction complète npm run build : attendue en CI Repository gates, pas rejouée sur le Mac conformément au contrat du dépôt.

## Publication et suivi

Après la revue QA unique PASS, fusionner la PR si la CI est verte. En cas de collision sur les dérivés, prendre main pour ces fichiers et régénérer sans changer le fond. Vérifier ensuite la production canonique sans paramètre : chapeau, bloc Kevin, arrêt hors règle, ancre auteur, AboutPage/Person, CTA vers /contact et présence au sitemap.

Consigner la date de publication effective T0 avec le relevé servi. À T0 + 7 jours, vérifier indexabilité, liens et données Search Console disponibles pour /a-propos (clics, impressions, requêtes de marque). À T0 + 28 jours, comparer une période de même durée et relever les demandes qualifiées uniquement si leur provenance est connue. Si les accès ou volumes ne permettent pas une comparaison, écrire « non mesurable », pas zéro. Ces échéances sont relatives à T0 ; elles ne constituent pas des résultats ni des gains annoncés.
