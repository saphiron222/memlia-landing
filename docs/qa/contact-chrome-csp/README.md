# Contact : scripts du chrome et CSP

## Correction SEC-01

Astro réinjectait inline les scripts compilés de moins de 4 Ko : navigation, footer et apparitions. La CSP de `/contact` autorise les actifs same-origin, pas ces scripts inline.

La configuration Vite refuse désormais l'inlining des actifs JavaScript. Astro conserve la compilation, la déduplication et les noms d'actifs versionnés. Les autres actifs gardent leur seuil par défaut ; les styles restent inline comme avant. Aucun changement de CSP, de Turnstile, des champs ou du traitement du formulaire.

## Rejouer

    npm ci
    npm run regen:generated
    node --test tests/scripts/contact-chrome-csp.test.mjs
    npx wrangler pages dev dist --ip=127.0.0.1 --port=8796 --show-interactive-dev-session=false
    QA_URL=http://127.0.0.1:8796 node scripts/audit-contact-chrome.mjs

La sonde exige les vrais en-têtes Pages ; `astro preview` ne convient pas. Pour la recette publique : `QA_URL=https://memlia.fr QA_OUT=.qa/contact-public node scripts/audit-contact-chrome.mjs`.

## Résultats locaux

- Avant correction : trois violations `script-src-elem` / `inline` à chacune des largeurs 375 et 1440 px ; apparitions non initialisées et boutons du footer mobile absents.
- Après correction : zéro violation inline, apparitions révélées au défilement, footer mobile ouvrable/fermable avec Entrée/Espace, navigation visible parcourue au clavier, focus et fond restaurés lors de la fermeture du menu.
- 33 tests ciblés contact/CSP/Turnstile/purge passent. Régénération et audit ressources PASS ; registre lastmod conforme. `npm run check` passe (la chaîne suivante de build a commencé).
- Le build complet local a été interrompu par la limite de durée du terminal pendant les tests Node de forge ; pas de résultat global PASS revendiqué. La CI Repository gates reste le contrôle complet avant fusion.
- Aucun envoi de formulaire ni ouverture du service de rendez-vous. Les tests unitaires du traitement utilisent leurs doubles locaux, pas une demande réelle.

## Distinction des parcours

Le chrome actuel masque volontairement le burger (`display:none`) et affiche directement les liens mobiles. La sonde vérifie ces liens dans leur rendu réel, puis expose temporairement le burger dans le navigateur de test pour éprouver son code dormant (boucle de tabulation, Échap, croix, inert et restitution du focus). Ce n'est pas une modification du CSS livré ni une preuve que le burger est le parcours public actuel.

Le runtime local n'a pas la clé Turnstile de production : il affiche l'état d'indisponibilité prévu. Aucun secret n'est nécessaire pour tester le chrome. La recette publique devra distinguer les éventuelles violations du beacon externe SEC-02, enregistrées dans `otherViolations`, des scripts inline SEC-01.
