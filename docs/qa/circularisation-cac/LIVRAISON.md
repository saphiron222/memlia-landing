# Circularisation CAC — candidat de publication

## État

Candidat technique QA PASS le 07/10/2026. La revue métier du recadrage est conservée : corps et revue inchangés. Aucun service publié dans cette phase tant que la forge n’a pas observé le candidat HTTPS.

## Vérifications exécutées

- Test rouge puis vert : couverture, audience CAC, contrat d’intention et cadre fonctionnel propre (2 tests Node).
- Rejeux : 8 états historiques + 12 cas sélection/deux passes/pièces postérieures PASS.
- Renderer HTML figé : 1600 × 900, OG 1200 × 630, polices chargées, aucun débordement ; 42 098 et 26 714 octets. `--adopt` puis `--check` PASS.
- `npm run service:sceller -- circularisation-cac` PASS après substitution des liens uniquement.
- `npm run regen:generated` PASS ; `npm run build` code 0, 150 preuves Python et 797 tests scripts Node PASS, contrôles supplémentaires du build PASS.
- Six largeurs 320, 375, 768, 1024, 1440, 1920 : un H1, canonical, audience CAC, absence de débordement, séparation sources/CTA, corps visible ; trois liens entrants indexables.
- Revue indépendante QA en lecture seule PASS : scellements et images conformes, corps/revue métier identiques à HEAD, agrandissement de preuve fonctionnel, tableaux nommés/focusables/défilables. Réserves non bloquantes : densité du visuel miniature et indice de défilement des tableaux discret.

## Décisions et défaut corrigé

Les trois articles CAC prévus sont absents. Les trois liens autorisés de substitution viennent de `/methode`, `/garanties` et `/outils-comptables-gratuits/suivi-circularisation`, avec l’ancre exacte « Automatiser la circularisation ».

La couverture reprend e-Circu et Circit, y compris le rapprochement des réponses. Les fonctions sont déclarées par les éditeurs, non testées ; édition et options du cabinet sont à vérifier avant engagement, aucun geste déjà couvert n’est reconstruit.

Le corps mobile long ne pouvait atteindre le seuil de révélation du composant partagé : opacity 0 réellement observée à 320 px. La classe `rv` est retirée de la seule colonne de texte ServiceBody, les autres animations conservées. Le test navigateur observe l’échec puis la visibilité sur les six largeurs. Les premières captures rapides étaient également incomplètes à cause du scroll smooth ; les captures finales utilisent un défilement réel stabilisé, pas une suppression forcée des états de visibilité.

Le plan CAC passe à « construite-en-revue ». Les inventaires et documents dérivés sont régénérés par leurs scripts, sans modifier les sources sœurs ; les déplacements du calendrier et reprises de familles EC proviennent du générateur existant.

## Publication restante

`npx wrangler pages deploy dist --project-name=memlia --branch=preview-circularisation-cac` puis `npx wrangler whoami` ont échoué : récupération automatique des comptes impossible, permissions du token ou session expirée. Ne pas simuler l’observation HTTPS ni assouplir la forge. Tester une preview GitHub/Cloudflare si elle est disponible ; sinon réauthentifier Cloudflare avant reprise.

Après preview réelle : `MEMLIA_SERVICE_CANDIDATE_ORIGIN=https://<preview>.memlia.pages.dev npm run service:publier -- circularisation-cac`, régénération/build, PR/CI et fusion, contrôle production sans query string, footer/sitemap et création des suivis J+7/J+28 à partir de la date réelle de publication. Ne pas dater ces suivis depuis la préparation.
