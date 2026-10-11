# Vérification exécutée : COPY glossaire

08/10/2026. Candidat : branche site/copy-glossaire depuis origin/main 4f42a88b.

Résultats réels :

- npm ci --ignore-scripts : succès. Audit dépendances : 6 vulnérabilités préexistantes (2 moderate, 4 high) ; aucune dépendance modifiée.
- Python test_positioning.py : 8 tests PASS ; 117 surfaces texte contrôlées.
- node --test tests/scripts/glossary-copy.test.mjs : 6 tests PASS. Les extraits sont présents mot pour mot dans les copies nouvelles ; seules les trois définitions ciblées changent ; toutes les ancres historiques se retrouvent dans le rendu.
- npm run regen:generated : succès, chaîne Ressources QA PASS, 1 surface liée, aucune erreur. Log regen.log.
- npm run build : succès (sortie 0), tous les gates de la chaîne, audit Ressources final PASS. Log build.log.
- Playwright : glossary-copy.spec.ts + glossary.spec.ts + positioning.spec.ts, 14 tests PASS. Mobile/desktop, recherche/effacement, sans JavaScript, canonical/schéma, ancres historiques et six largeurs de 320 à 1920 px. Logs browser.log et browser.json.
- Captures complètes 375 et 1440 : glossaire-*.png. Vues finales lisibles : sortie-*.png. Contrôle visuel du bloc final mobile : titre, paragraphes et CTA visibles, aucun rognage ou débordement.
- git diff --check : succès.

## Incidents résolus sans maquiller les résultats

La capture réseau via fetch Node a dépassé 30 secondes ; curl --fail --location a obtenu les quatre pages avec succès. Les dates de capture viennent de la création des fichiers par ces téléchargements. Légifrance n’est pas déclaré rouverte : extraction refusée et challenge navigateur.

La première régénération après remplacement de la copie Banque de France a refusé la réaffirmation de la revue historique, à raison. La copie historique sensible est donc conservée dans la chaîne avec son verdict acquis ; la réouverture officielle nouvelle vit dans le paquet ciblé et sera appréciée par metier. Ni l’ancre ni le verdict historique n’ont été fabriqués ou élargis à la main. Le PASS automatique Ressources ne vaut pas PASS de cette correction métier, qui reste en attente.

Une première version du nouveau test tentait un changement d’ancre après filtrage SEPA dans le même document : la cible reste masquée, défaut préexistant du script. Carte autonome dev t_200d4451 créée, sans dépendance avec cette publication. Le test de copy vérifie les ancres sur page non filtrée, tandis que le test existant vérifie séparément le filtre et son effacement. Aucun changement du script, du compteur ou du CLS dans ce lot.

## Livraison et suivi restant après revue

La CI GitHub, la fusion et la vérification de production restent à consigner par l’intégration. La capture avant est une mesure de contenu réel, pas une mesure de trafic. Les suivis J+7/J+28 partent de la date effective de publication (voir REVUE.md).

Hotspots : src/data/glossary.ts et editorial/resources/glossaire/manifest.json sont aussi les surfaces des fabriques F5/G5. Préserver leurs ajouts à l’intégration et régénérer les fichiers dérivés au lieu de fusionner leurs sceaux manuellement. scripts/lib/resource-metier-evidence.mjs porte également les ajouts de preuves de ces fabriques ; conserver les références et le corpus historique.
