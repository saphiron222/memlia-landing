# Corrections de l’unique QA PR87

Carte dev : t_baae0f0e. Reprise ciblée de la revue existante t_0f294618 ; aucune fusion ni publication effectuée.

## Défauts reproduits avant correction

- Moteur : les quatre formulations signalées par la QA donnent `détecté` au lieu de `à examiner` ; quatre tests rouges, trois témoins affirmatifs verts.
- Chromium : quatre extraits classés à tort, annulation émettant `reussite` + `recalcul`, confirmation manquante focalisant le textarea : six tests rouges sur sept. Le témoin de copie échouée/export refusé était déjà vert.
- Journaux avant/après conservés avec le handoff de la carte. Tests reproductibles : `tests/scripts/verificateur-prompt-qa.test.mjs` et `tests/browser/verificateur-prompt-qa.spec.ts`.

## Corrections

- Reconnaître les négations en `ni`, l’absence de besoin, `ou pas` et le caractère optionnel. Les extraits originaux et les affirmations explicites sont préservés. Il s’agit toujours d’une heuristique prudente, pas d’une interprétation du sens.
- Utiliser le contrat existant `data-own-telemetry` : le composant émet succès/recalcul après une analyse accomplie seulement, `copie` après résolution du presse-papiers et `export` après déclenchement du téléchargement local. Annulation, copie bloquée et export refusé n’émettent pas de réussite. Chaque événement ne contient que `action` et `outil`, aucun texte saisi. Le démarrage reste géré par le layout partagé, inchangé.
- Associer `verifier-error`, `aria-invalid` et le focus au contrôle réellement refusé : confirmation d’abord, puis consigne vide/trop longue/sensible. Retirer les états invalides lors de la saisie et avant l’analyse suivante.

## Vérification locale du candidat intégré

- Tests moteur 01/07 : 18 PASS, dont sept nouveaux cas.
- Chromium sur le rendu construit : 27 PASS (17 vérificateur, 10 générateur témoin), dont sept nouveaux parcours ; six largeurs, copies exactes, export complet, absence de requêtes et stockage contrôlés par la suite existante.
- `npm run check` : 0 erreur, 0 avertissement après réinstallation des dépendances ajoutées sur main.
- `npm run build` : PASS, 134 tests Python et 678 tests scripts ; audit Ressources PASS.
- `node scripts/audit-verificateur-prompt.mjs` : PASS (DOM, schémas, canonical, sitemap, trois entrants, médias, destinations).
- `git diff --check` : PASS.

Main a avancé depuis la revue initiale : il a été intégré sans retirer ses publications. Le comptage des preuves combine désormais le diagnostic publié et le vérificateur (35). Les rendus/dates et preuves techniques du glossaire ont été recalculés par les scripts du dépôt ; la revue métier existante est conservée, sans nouveau jugement du contenu. Hotspots signalés sur la carte : `src/data/pages-lastmod.json`, registres du glossaire et `docs/strategy/site-v3/mesures/registre-requetes.json`.

La CI et son lien sont consignés dans le handoff après le push. PR87 reste ouverte. Production non vérifiée et non revendiquée. Les trois vulnérabilités npm préexistantes restent hors périmètre.
