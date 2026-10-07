# Provenance des preuves de guides — réparation du contrat de page

Carte : t_aef7fa3c. Réparation infrastructure uniquement ; aucune recette EBP, revue métier ou collection publique modifiée.

## Cause et correction

Le contrat cherchait les preuves dans docs/qa et editorial/articles, pas dans guides/etats. Il refusait ainsi une illustration validée par guide:sceller. Le contrat découvre maintenant les états des guides et appelle verifierPreuveGuide, qui réutilise la validation complète de la forge. Seuls les états scelle/publie cohérents donnent une provenance, limitée à la route du guide et à un seul usage dans le contenu principal. Les nouveaux guides ne peuvent contourner leur sceau par un manifeste QA générique. Le corpus historique préparé conserve sa provenance antérieure.

Les attentes HTML et sitemap étaient également limitées aux neuf guides historiques. L'oracle indépendant ajoute désormais les définitions générées après rapprochement avec recette, candidat, sceau, revue et octets des preuves. Il continue de comparer exactement les ensembles attendus : aucune page orpheline n'est implicitement autorisée.

## Exécution réelle

Base infrastructure : origin/main 2af5aca6e6acd535d13858906f3789dd8d10e15c.

- Régression JS finale exécutée sur cette base sans correctif : FAIL clause 2 pour la preuve réellement préparée, relue et scellée par la forge dans une fixture isolée. Le même test passe après correction, y compris les suppressions/altérations de WebP, HTML de preuve, état, sceau, recette, revue, mesure et métadonnées ; réutilisation et mauvaise route refusées malgré un manifeste QA générique.
- Régression Python : rouge avec l'inventaire historique seul ; verte avec l'inventaire extensible, puis refus des états non scellés et des preuves modifiées.
- npm run check : PASS.
- npm run test:guide-forge : 18 PASS (dont la nouvelle régression, placée dans la commande Chromium déjà exclue du build Cloudflare).
- npm run test:guide-render : 1 PASS, page et liens réellement construits par Astro.
- node --test tests/scripts/page-contract.test.mjs : 18 PASS, sans ajout de navigateur au build Cloudflare.
- Intégration dans un worktree distinct sur le vrai candidat origin/site/lettrage-ebp, 1eea81dd, avec le correctif : regen:generated PASS, texte public rendu, guide:audit PASS (deux états), contrat de page VERT sur 65 pages et npm run test:proof : 151 PASS. Le guide EBP et sa revue métier ne sont pas inclus dans cette PR infrastructure.

Un lancement supplémentaire de npm run build sur la branche infrastructure a dépassé la limite de l'appel terminal (420 secondes), pendant les tests de scripts ; aucune conclusion globale PASS n'est revendiquée. La CI Repository gates et l'unique revue QA restent nécessaires avant fusion. Le défaut d'isolation des fixtures quand une collection contient déjà un nouveau guide reste porté par t_de488db9, pas par cette réparation.

## Coordination et livraison

## Levée R1 — reprise du 7 octobre 2026

La classification protège désormais l'actif dès la découverte du chemin de recette ou d'état, même si la recette est absente ou illisible. Le seul mode `historique` ne suffit plus : l'exception exige le slug du dossier et la validation complète de la recette contre le corpus historique identique. Une collection générée vide et un manifeste QA générique ne libèrent donc plus une preuve préparée sans sceau.

Régression avant correctif : FAIL (`0 !== 1` après recette illisible). Après correctif : 19 tests forge, 18 contrats et 1 rendu Astro PASS ; Astro check sans erreur. Le probe indépendant QA conserve une erreur clause 2 dans chacun des cinq états, y compris recette illisible et faux mode historique. La provenance historique légitime est également exercée et conservée. origin/main d9911182 a été intégré pour préserver la correction du renderer ; aucune recette ni revue EBP modifiée. Re-revue limitée à R1 et au fini ; CI et fusion encore à constater.

hotspot : tests/scripts/guide-forge.test.mjs et tests/proof/test_build.py. t_de488db9 a été informée de ne pas dupliquer l'oracle d'inventaire ; conserver son correctif indépendant d'isolation des fixtures lors de l'intégration.

Après l'unique QA et la CI verte : intégrer la PR infrastructure et transmettre le résultat à t_f4529d49. Aucun constat de publication EBP ni déploiement de guide n'a été effectué ici.
