# Navigation clavier vidéo — correctif du test

Le footer de PR172 contient assez de liens pour atteindre la vidéo au 101e Tab après clic puis blur. Le plafond historique de 100 produisait un faux échec.

`tests/browser/helpers/tab-to.ts` parcourt réellement le clavier jusqu'à la cible ou jusqu'au retour sur un élément DOM déjà rencontré. Aucun calcul de focusables, plafond de liens ou focus programmatique. Body/html représentent aussi le passage par le chrome du navigateur : ils ne sont pas des témoins de cycle. Le timeout Playwright reste la borne globale sur un document sans arrêt DOM ou continuellement renouvelé.

Les assertions intégrées restent inchangées : focus, contour visible, Entrée, Espace, pause/reprise et absence de contrôles natifs. Les deux fixtures comportent 120 liens et vérifient une vidéo accessible ainsi qu'une vidéo hors tabulation : cette dernière doit être refusée, sans faux PASS.

## Preuves du 10 octobre 2026

- Ancienne boucle extraite sans changement : les deux fixtures échouent ; cible accessible inactive après 100 Tab (target-red.log).
- Correctif : deux répétitions des fixtures PASS, puis suite integrated-media et fixtures répétées deux fois : 26 PASS sur le dist de PR172 fa3c4a91.
- Revue QA indépendante unique (sous-agent en lecture seule) : PASS ; rejeu Chromium réel des 13 tests, code 0, 17,8 s. Dist servi sur localhost:4357 identique au dist du candidat PR172, contrôle curl/shasum.
- Aucun changement du lecteur, du contenu, de la recette ou des revues métier.

Commande de rejeu : `QA_URL=http://127.0.0.1:4357 npx playwright test tests/browser/tab-to.spec.ts tests/browser/integrated-media.spec.ts --repeat-each=2`.

Limites : Chromium uniquement ; la détection suppose un ordre stable. Les DOM renouvelés en continu restent bornés par le timeout du test. CI et fusion sont tracées sur la carte t_8b489067.
