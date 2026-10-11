# QA D1 — accueil par profession

Verdict : PASS, revue indépendante du code et des preuves par un agent isolé, sans modification
des sources. Aucun défaut bloquant identifié. La revue porte sur le diff D1 contre origin/main,
y compris la stabilisation du décodage des captures et le nettoyage du test de contrat.

Constats rejoués par le relecteur :

- Onze sections consomment un sous-objet de `ContenuAccueil` ; EC par défaut et EC explicite
  rendent le même contenu. `contenuDe('cac')` refuse, sans repli métier silencieux.
- Sources FAQ, méthode et garanties existantes conservées ; props explicites d’AppelFinal
  prioritaires. CTA et interactions non réécrits.
- Quatre tests Node ciblés PASS, dont le build Astro isolé et ses onze titres injectés,
  la FAQ propre et la priorité AppelFinal.
- HTML entier de `/` comparé directement : 119032 octets identiques au témoin avant extraction.
- Quatre captures décodées et comparées : pixels identiques à 375 × 14162 et 1440 × 11179.
- Log Astro preview : 47 tests navigateur PASS.
- Sept pages annexes comparées : mêmes règles CSS, ordre de blocs seul modifié ;
  HTML hors styles identique.
- `git diff --check` PASS.

Note de coordination : le changement de compteurs D3/PR112 dans Usages est déjà signalé
sur les deux cartes ; garder son calcul lors de l’intégration, sans recopier le compte figé.
La copy CAC et ses preuves propres restent E1/E2/E3/E4, pas D1.

Preuves de la livraison : `docs/strategy/site-v3/ACCUEIL-PROFESSIONS.md`, les deux tests
`tests/scripts/accueil-*.test.mjs` et `scripts/compare-accueil.mjs`. Les logs et PNG réels
sont joints à la carte D1 ; la revue n’invente pas un succès du build global ou de la CI,
que le parent vérifie séparément avant fusion.
