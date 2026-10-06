# C3 du 06/10/2026 — cinq citations revérifiées

## Résultat et décision

Le fond des quatre articles est conservé. Aucune citation n'a été retirée sur la seule foi d'un timeout. Aucun corps, recette, manifeste, avis historique ou sceau de publication n'a été modifié. Le maillage reste réservé à H4 (t_28337116, livraison t_3a63473a).

Une alerte est écartée avec preuve primaire actuelle ; quatre autres gardent une limite de transport et restent `a-faire` dans le registre. Cette livraison ne prétend donc pas renouveler les cinq preuves natives de la forge.

| ID du relevé C3 | Citation | Résultat |
| --- | --- | --- |
| 2026-10-06-reverifier-source-automatiser-la-relance-des-pieces-clients-1 | sp-conservation / F10029 | Extrait retrouvé par lecture distante ; preuve HTTP native inaccessible localement, limite maintenue |
| 2026-10-06-reverifier-source-automatiser-la-saisie-comptable-ce-qui-reste-a-verifier-1 | sp-conservation-pieces / F10029 | Extrait retrouvé par lecture distante ; preuve HTTP native inaccessible localement, limite maintenue |
| 2026-10-06-reverifier-source-automatiser-un-cabinet-comptable-la-carte-des-taches-1 | sp-conservation / F10029 | Extrait retrouvé par lecture distante ; preuve HTTP native inaccessible localement, limite maintenue |
| 2026-10-06-reverifier-source-automatiser-un-cabinet-comptable-la-carte-des-taches-2 | impots-calendrier | Citation historique de septembre retrouvée mot pour mot sur la page primaire datée ; alerte écartée |
| 2026-10-06-reverifier-source-logiciel-ia-comptabilite-1 | service-public-pieces / F10029 | Extrait retrouvé par lecture distante ; preuve HTTP native inaccessible localement, limite maintenue |

## Preuves et limites

`verification.json` relie chaque ID, recette, source, extrait, transport et copie, avec les empreintes calculées sur les fichiers réels. `forge-results.json` conserve les cinq échecs du vérificateur natif : quatre `fetch failed`, un extrait absent.

### F10029

Deux lectures par `web_extract` ont retrouvé les phrases citées dans la fiche officielle « Quels sont les délais de conservation des documents pour les entreprises ? », affichant une vérification au 01/07/2024. Le retour réellement reçu est conservé dans `service-public-extraction.json`.

Cette lecture distante ne fournit ni réponse HTTP brute ni garantie de fraîcheur de son éventuel cache. Elle étaye la conservation provisoire du fond mais ne remplace pas `verifySource`. Aucun code HTTP 200 n'est attribué à ces quatre preuves, aucun `checkedAt` natif ni avis ancien n'est retamponné.

La forge a échoué pour les quatre articles. Une reprise indépendante avec curl et le même UA (`MemliaBlogSourceVerifier/1.0 (+https://memlia.fr)`) a aussi échoué : adresse courante, 45 secondes ; ancien domaine `.fr`, 25 secondes ; variante `?lang=fr`, 25 secondes ; IPv4, 20 secondes. La résolution DNS locale rend 160.92.168.33. Le connecteur `lire_fiche(F10029)` n'a pas trouvé cette fiche entreprise ; cela ne prouve pas davantage sa disparition.

Les quatre lignes restent à faire. Lorsqu'un accès HTTP brut est à nouveau disponible, rouvrir la fiche avec la forge ; corriger seulement si la phrase ou son périmètre ont réellement changé. Aucune durée nouvelle n'est affirmée dans les articles par cette livraison.

### Calendrier fiscal

La réponse brute actuelle de la route générique présente octobre 2026. Le bouton « Mois précédent » désigne `/professionnel/calendrier-fiscal/2026-09`. Cette URL officielle a été ouverte par curl avec l'UA de la forge : HTTP 200, sans changement d'URL final. La copie exacte est `calendrier-2026-09.html`.

Elle contient mot pour mot : « Entre les 15 et 24 septembre 2026, dépôt et paiement de la déclaration mensuelle de TVA à la date figurant dans votre espace professionnel. » Le corps du pilier parle explicitement de septembre ; il ne présente pas cette fenêtre comme l'échéance d'octobre. L'affirmation historique reste soutenue. L'alerte `extrait absent` vient du caractère glissant de la route générique, non d'une contradiction fiscale.

L'URL publique reste inchangée dans cette livraison : changer cette seule référence serait technique, pas une nouvelle revue de fond, mais une rematérialisation complète ne peut ici renouveler les autres sources locales. La référence datée est fournie pour la prochaine maintenance de ce lien ; aucun contournement de la forge n'a été appliqué. Une future routine qui n'interroge que le mois courant peut répéter l'alerte.

## Vérifications exécutées

- Test `node --test tests/scripts/c3-source-recheck.test.mjs` : échec observé avant dossier de preuves, puis PASS. Il vérifie les cinq IDs, leurs extraits dans les copies, les empreintes, la cohérence recette/manifeste et le maintien des limites dans le registre.
- `npm run build` : code de sortie 0, journal réel conservé dans le workspace de la carte.
- Contrôle HTTP en production des quatre articles : PASS, quatre HTTP 200, canonical attendu, absence de noindex, cinq affirmations et leurs liens sources présents dans `main`. Résultat dans `production.json` ; captures HTML brutes dans `.qa/c3-production/` du worktree.
- Aucun changement public, aucune republication ou preuve native nouvelle revendiqués.

## Intégration et revue

La livraison attend une seule revue indépendante `metier` sur la conservation des citations et la suffisance des limites, puis CI verte et fusion de la PR documentaire. Après fusion, répéter le contrôle production. Ne pas transformer les quatre limites locales en quatre clôtures réussies. La revue peut accepter ce résultat borné prévu par la carte (« cinq IDs traités ou limite motivée »).
