# Correction du défaut QA de PR192

Le cadre du hub décrit désormais « Contrôle illustré sur un cas fictif ». Le HTML figé, son contrat et le WebP sont concordants avec le statut des neuf guides : sorties attendues, pas résultats exécutés.

Vérifications locales du 8 octobre 2026 :
- Renderer --adopt puis --check : dix cadres conformes ; seul hub.webp change, les neuf autres actifs et leurs entrées de manifeste restent identiques.
- Contrôle visuel de hub.webp : phrase complète, lisible, sans troncature.
- tests/scripts/integrations.test.mjs : neuf tests PASS, dont la nouvelle assertion du statut illustratif dans la source et le contrat, rapproché du gabarit des guides.
- npm run regen:generated : PASS, 65 pages construites et audit Ressources PASS. Les reçus et sceaux dérivés Ressources sont régénérés sans changement de contenu.
- git diff --check : PASS.

La re-revue reste limitée au défaut signalé et au critère de fini. Aucun guide individuel, lien ou parcours n'est modifié par cette correction. CI distante et production ne sont pas déclarées validées dans ce constat local.
