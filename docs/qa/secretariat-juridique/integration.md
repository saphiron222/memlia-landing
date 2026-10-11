# Intégration du secrétariat juridique

Recette recadrée du parent t_45e23126, PASS métier indépendant conservé dans commercial/recettes/secretariat-juridique/revues.json. Le service concerne seulement les échéances et rappels encore manuels après vérification du circuit juridique existant. Aucun acte, délai légal calculé, signature ou dépôt.

## Adaptations de présentation

Le titre a été raccourci à 87 caractères pour respecter la collection Astro, même intention et même frontière. Les références ont été déplacées dans les paragraphes ; dates de consultation retirées du rendu public. Aucun changement des affirmations métier. Les preuves et leur revue sont conservées, le candidat a été rescellé par service:sceller.

Preuve propre : docs/design/secretariat-juridique-proof, numéro 46. Quatre dossiers fictifs illustrent deux propositions, une exclusion et un arrêt parmi les dix cas rejoués. Le visuel et l’image sociale sont scellés, sans cartouche promotionnel.

## Vérification

Test ajouté avant intégration : deux échecs constatés sur les fichiers absents. Après intégration : secretariat-juridique 2 PASS, service-couverture 5 PASS, service-design 6 PASS et public-source-labels 4 PASS. Dix cas métier rejoués PASS, entrées inchangées. Renderer --check PASS : 1600 × 900, polices chargées, aucun texte tronqué, WebP de moins de 150 Ko. regen:generated PASS et service:audit PASS.

Script reproductible : node scripts/verify-secretariat-juridique.mjs. Six largeurs, HTTP200, H1/canonical/OG, trois ancres contextuelles, médias chargés et absence de débordement global PASS. MEMLIA_VERIFY_ORIGIN=https://memlia.fr ajoute indexabilité, footer et sitemap en production. Captures dans .qa/secretariat-juridique/.

## Revue QA indépendante

Verdict PASS de l’agent QA indépendant (revue déléguée, 8 octobre 2026). Diff de PR198 et rendu Chromium vérifiés : 17 tests ciblés, six largeurs, pas d’erreur JS. Les deux tableaux mobiles sont scrollables au clavier et à la molette : Tab atteint le conteneur, focus visible, flèches gauche/droite, Tab sort. Note sticky desktop à 88 px vérifiée, conforme au gabarit commun. Dix cas réexécutés sans écriture, entrées inchangées. Aucun défaut concret de code ou rendu identifié ; pas de nouvelle revue du fond métier.

Limites : Chromium, sans appareil tactile ni lecteur d’écran. La CI Repository gates reste la preuve de construction et de suite complète avant fusion. Le candidat reste non indexable avant service:publier sur une origine HTTPS réellement servie.

## Mise à jour de main

La copy À propos de PR194 intégrée est conservée ; seul le lien contextuel de notre service y est ajouté. Les conflits de lastmod et sceaux du glossaire ont été résolus depuis main puis régénérés, sans fusion manuelle des empreintes. Six largeurs et trois liens revérifiés PASS.
