# Comparateur de balances — scénario réseau commun

Le défaut de PR165 est reproduit avant correction : le test commun de `tests/browser/outils.spec.ts` échoue avec « Scénario réseau à définir pour l’outil comparateur-balances-comptables ».

Le scénario charge les deux CSV fictifs, confirme la devise et la comparabilité, compare, vérifie le compte `00123` et le delta `30,00`, puis télécharge le CSV et vérifie le compte et la version du rapport. Le contrôle de stockage reste inchangé (localStorage, sessionStorage et IndexedDB vides).

Après armement, une seule requête est autorisée : GET du script statique local `/_astro/comparateur-balances.worker-<hash>.js`, sans query ni données. Toute autre requête échoue, y compris après export. Un seul Worker traite les deux balances et leur comparaison.

Vérification locale sur le rendu Astro servi par preview, sans suite complète de construction :

- Test commun avant correction : 1 échec, motif attendu.
- Test commun après correction : 1 réussite.
- `QA_URL=http://127.0.0.1:4337 npx playwright test tests/browser/outils.spec.ts tests/browser/comparateur-balances.spec.ts` : 37 réussites (dont les 14 parcours spécifiques).
- `git diff --check` : réussi.
- `npm run blog:audit` avec `origin/main` présent : réussi, aucune erreur. GitHub a toutefois déclaré la PR en conflit, empêchant le déclenchement de CI : main a donc été intégré pour rendre le candidat vérifiable.

Après intégration de main, les scénarios checklist et fusion CSV, leurs en-têtes, contrats et preuves sont conservés. Les paragraphes d’entrée du comparateur sont réinsérés sans rétablir les anciens paragraphes remplacés sur main. Les fichiers générés sont recalculés avec `npm run regen:generated`, sans modifier les revues de fond.

- Suites navigateur outils, comparateur, fusion CSV et concurrence fusion : 60 réussites.
- Tests Node du moteur comparateur, de sa livraison et des en-têtes ROI/pseudonymisation : 27 réussites.
- Les captures fusion produites par les tests sont exclues de la livraison ; les captures approuvées de main sont conservées.

La construction complète « Repository gates » et la recette HTTPS Cloudflare restent à recueillir par la carte platform existante ; ces tests locaux ne s’y substituent pas.
