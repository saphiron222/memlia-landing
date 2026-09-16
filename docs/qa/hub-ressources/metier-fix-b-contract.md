# Ressources v2 — contrat d’applicabilité et scellement B

Date de contrôle : 2026-09-14T16:36:51+01:00

Carte : `t_9b260748`

Candidat éditorial repris : `f5f156fe56b55ecab66c82d31673637b74e9be4a`.

## Verdict

**Le contrat technique est durci et le candidat H/T exact est scellé pour une nouvelle revue métier IA. Il reste volontairement FAIL.**

Cette carte ne rend aucun verdict métier et n’injecte ni reviewer, ni `AI_REVIEW_PASS`, ni score, ni GO. L’audit QA doit rester fermé tant que la preuve fraîche du profil `metier` n’est pas reliée au candidat exact.

## P1-04 — applicabilité obligatoire

Chaque claim doit maintenant porter un objet `applicability` fermé qui relie :

- une population ;
- un régime ;
- une date d’effet calendaire valide ;
- les exceptions et limites ;
- exactement les mêmes sources que `claim.sourceIds`.

Le schéma exige les cinq champs. Le validateur les relit, impose une matière textuelle non vide et refuse une date impossible ou une divergence de sources.

Le témoin P1-04 retire successivement `population`, `regime`, `effectiveDate` puis `exceptions` du même claim sensible. Chacune des quatre mutations doit rendre `pass: false` et produire un refus attribué au contrat d’applicabilité.

Cycle TDD observé : le témoin P1-04 a d’abord terminé avec `exit 1`, puis la suite ciblée `P1-04|adaptateur H accepte` a terminé avec `exit 0` après durcissement. La suite Ressources complète confirme ensuite **34/34 PASS**, dont les **24/24 témoins historiques W01 à W24**.

## Sujet canonique de la revue

Le `reviewedCandidateHash` attendu est le SHA-256 du JSON canonique de tout `candidateDigestPayload`, avec une seule exclusion :

`claimsEvidence.sensitiveMatter.businessReview`

Aucun autre bloc, claim, champ d’applicabilité, digest de bundle ou métadonnée du candidat n’est retiré. L’oracle Python indépendant confirme qu’une mutation de `businessReview` seule conserve le sujet, tandis qu’une mutation d’applicabilité le change.

| Surface | Hash candidat scellé | `reviewedCandidateHash` attendu | Mutation de `exceptions` |
|---|---|---|---|
| H `/ressources` | `36d158919673e2e372c7a2c7db7041d56e6c44d752a913281c4a7d0103b49f3a` | `cba8eb38097bd81002e835de9e5b6b41b3dde3a21d70f420e4c2f8c2d671de24` | `55ad9578a441f6eb57f5258be454e710c10461bacf92be696a2d9a8411354ce0` |
| T `/glossaire` | `3121b18721331cdf7e903b07ef93b901a4c19b84b0c0f5a57e9545b65a4cc3fc` | `c0ef2718b9864cbf7139b7671c9a01835b6bca3fb6ca6421933ed40ce1369455` | `4763d74ab79e5675e604a107e3be94c0f36462a4426a1dd3b51a45aab7a0ec9a` |

Les deux mutations produisent une empreinte différente : le hash ne masque donc pas la suppression ou la modification d’une exception.

## Recalcul indépendant du candidat scellé

Le recalcul ci-dessous utilise Python standard et n’importe pas le validateur Node.

| Surface | Unités | Claims | Citations | Sources | Champs d’applicabilité manquants | Citations dont `sourceContentSha256` diverge de la source/copie | Octets manifeste | SHA-256 fichier |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| H | 3 | 3 | 6 | 3 | 0 | 0 | 88 853 | `67c102bd3fef70830269fe3cc035b05498852f8def6a0932416bf6b9bbd462f9` |
| T | 23 | 23 | 24 | 9 | 0 | 0 | 139 656 | `3ae3b821346d164469bbf8554515675c8fdc83b1efa18dc214651a808aae0aed` |
| Total | 26 | 26 | 30 | 12 occurrences | 0 | 0 | — | — |

Les dates de contrôle déclarées par les sources et citations sont toutes le `2026-09-14`. Le pipeline impose en plus la fraîcheur du jour et une fenêtre maximale de 24 heures pour la revue sensible ; une preuve absente, périmée ou produite un autre jour reste bloquante.

## Audit fail-closed

`npm run resource:audit:qa` termine avec `exit 1`, attendu :

| Mesure | Valeur |
|---|---:|
| manifestes découverts | 2 |
| manifestes PASS | 0 |
| manifestes FAIL | 2 |
| surfaces H/T découvertes | 2 |
| surfaces reliées | 2 |
| surfaces orphelines | 0 |
| refus H | 31 |
| refus T | 38 |

Les refus incluent l’absence du reviewer IA `metier`, de son identité Kanban, de son rôle interne, des verdicts claim/source, du fichier de preuve et du hash de candidat revu. Les gates de recherche/qualité historiques restent également fermés. Le scellement n’a donc fabriqué aucun vert.

## Vérifications exécutées

| Contrôle | Résultat frais |
|---|---|
| `node --test tests/scripts/resource-pipeline.test.mjs` | PASS — 34/34 |
| `python3 -m unittest discover -s tests/proof -p 'test_resource_ai_review.py' -v` | PASS — 1/1 |
| `npm run build:site` | PASS — 9 pages ; Python 52/52 ; images 23 ; preview-export 4/4 ; Blog 55/55 + rendu 1/1 ; Ressources 34/34 |
| `npm run check` | PASS — 101 fichiers, 0 erreur, 0 warning, 1 hint hérité |
| `QA_URL=http://127.0.0.1:4339 npm test` | PASS — Playwright 98/98, dont Ressources et Glossaire à 375/1440 |
| `npm run resource:audit:qa` | FAIL attendu — 0/2 manifeste PASS |
| recalcul indépendant unités/claims/citations/sources, copies et hashes | PASS — 26/26 unités/claims ; 30/30 citations ; 0 divergence |
| mutation indépendante du hash de revue | PASS — H et T changent |
| `git diff --check` | PASS |

## Écran et portée

Les pages ont été servies depuis le `dist` frais sur `127.0.0.1:4339` puis capturées réellement :

- `/ressources` à 375 × 812 et 1440 × 900 : titre, trois ressources, parcours, filtres, CTA et pied de page visibles ; aucun débordement, texte coupé, chevauchement ou contrôle masqué ;
- `/glossaire` à 1440 × 900 : titre, réserve de prévisualisation, recherche, compteur de 23 termes, alphabet et première définition visibles ; aucun défaut manifeste.

Le contrôle de portée sur `src/content/blog`, `src/data/glossary.ts`, `src/pages/ressources.astro`, `src/pages/glossaire.astro` et `public/` est vide. Le fond éditorial et les surfaces publiques n’ont pas été modifiés par cette carte ; seuls leur contrat, leurs manifestes scellés et les preuves automatiques évoluent.

## Limites et suite

- Les copies officielles et leurs dates viennent du candidat métier amont ; cette carte vérifie leurs empreintes et la fraîcheur déclarée, sans refaire une revue juridique ou paie.
- Le nouveau reviewer doit utiliser exactement les deux `reviewedCandidateHash` ci-dessus et produire une matrice exhaustive claim→source→citation→applicabilité.
- Même un futur `AI_REVIEW_PASS` reste un contrôle interne : Kevin conserve le gate humain avant preview ou publication.
- Aucun push, preview distante, production, publication, cron ou envoi externe n’a été effectué.
