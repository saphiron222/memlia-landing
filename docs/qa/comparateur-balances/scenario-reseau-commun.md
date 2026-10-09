# Comparateur de balances — scénario réseau commun

Le défaut de PR165 est reproduit avant correction : le test commun de `tests/browser/outils.spec.ts` échoue avec « Scénario réseau à définir pour l’outil comparateur-balances-comptables ».

Le scénario charge les deux CSV fictifs, confirme la devise et la comparabilité, compare, vérifie le compte `00123` et le delta `30,00`, puis télécharge le CSV et vérifie le compte et la version du rapport. Le contrôle de stockage reste inchangé (localStorage, sessionStorage et IndexedDB vides).

Après armement, une seule requête est autorisée : GET du script statique local `/_astro/comparateur-balances.worker-<hash>.js`, sans query ni données. Toute autre requête échoue, y compris après export. Un seul Worker traite les deux balances et leur comparaison.

Vérification locale sur le rendu Astro servi par preview, sans suite complète de construction :

- Test commun avant correction : 1 échec, motif attendu.
- Test commun après correction : 1 réussite.
- `QA_URL=http://127.0.0.1:4337 npx playwright test tests/browser/outils.spec.ts tests/browser/comparateur-balances.spec.ts` : 37 réussites (dont les 14 parcours spécifiques).
- `git diff --check` : réussi.
- `npm run blog:audit` avec `origin/main` présent : réussi, aucune erreur. L’intégration de main n’est donc pas nécessaire pour cette correction ; aucun outil concurrent n’est modifié.

La construction complète « Repository gates » et la recette HTTPS Cloudflare restent à recueillir par la carte platform existante ; ces tests locaux ne s’y substituent pas.
