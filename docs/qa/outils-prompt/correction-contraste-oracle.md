# Correction ciblée après le FAIL QA de PR51

## Changements

- Les deux textarea et les sélecteurs du générateur utilisent `--texte-2` pour leur frontière, à la place de la ligne décorative `--ligne-forte`. Le focus clavier conserve le token global `--focus` ; aucun comportement de saisie ne change.
- L’oracle documentaire compare les routes propriétaires des requêtes normalisées : une entrée déjà enregistrée pour la même route est autorisée, toute autre route concurrente reste refusée, même si le propriétaire attendu figure aussi au registre.
- Le registre lastmod est synchronisé uniquement pour la route du générateur après modification CSS. Fichier partagé : `src/data/pages-lastmod.json`.

## Exécution réelle

Tests écrits avant les corrections. Échec documentaire observé sur le propriétaire identique ; six échecs navigateur sur la frontière à 1,44070503664411:1. La preview QA précédente était arrêtée : reproduction finale faite sur une preview reconstruite dans le workspace de correction, pas sur le serveur arrêté.

Après correction :

- Contraste mesuré des deux frontières sur crème : **5,608669566398765:1**, seuil requis 3:1.
- Six tests Chromium couvrent 320, 375, 768, 1024, 1440 et 1920 px, les deux textarea vides/remplis, focus clavier/hors focus, contraste intérieur/extérieur et outline visible.
- 18 parcours Chromium verts : six nouveaux tests de contraste, dix tests du générateur et deux tests de conservation/copie refusée.
- Deux tests de non-régression documentaire verts (propriétaire identique, concurrent avec propriétaire présent), quatre tests moteur verts ; oracle réel PASS pour dix briefs, 64 skills et 640 cellules.
- `npm run build` vert : 130 tests Python, 640 tests scripts Node ; audits du build verts.
- `npm run check` : zéro erreur, zéro warning, huit hints non bloquants.
- `git diff --check` vert.

Le premier build post-correction a rencontré le contrôle lastmod attendu après changement du rendu et la limite de durée du terminal ; diagnostic par le test Python précis, synchronisation de cette seule route, puis build complet rejoué avec succès. Aucune garde désactivée.

## Reproduction

Dans le dépôt :

    node --test tests/scripts/outils-docs.test.mjs tests/scripts/prompt-comptable.test.mjs
    python3 docs/strategy/site-v3/outils-ia-vague-3/validate-docs.py
    npm run build
    npm run check
    npx playwright test tests/browser/prompt-contrast.spec.ts tests/browser/prompt-comptable.spec.ts tests/browser/prompt-reprise.spec.ts

Les captures mobiles des champs vides, les mesures JSON et les journaux réel rouge/vert sont joints à la carte de correction. L’inspection visuelle confirme les frontières et l’absence de débordement horizontal ; les éléments précédents sous l’en-tête fixe correspondent à la position de défilement des captures.

## Passage de relais

Correction dans la PR51 existante, sans fusion ni publication. Reprise ciblée de l’unique revue QA `t_b3f1ff96`, puis publication exclusivement par `t_6d974686`. Ce rapport ne déclare ni une nouvelle approbation QA, ni une vérification production.
