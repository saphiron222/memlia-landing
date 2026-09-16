# QAD-FIX2 — Gates séquentiels QA, preview, GO et release

Date : 2026-09-14

Carte : `t_701859c0`

Parent technique : `6105393`

## Verdict

**Correction technique terminée ; le candidat métier reste volontairement FAIL en phase QA.**

L’audit exige désormais une phase explicite parmi `qa`, `preview`, `approval` et `release`. Chaque phase n’évalue que les preuves déjà exigibles et refuse à la fois une preuve future préremplie et une preuve courante incomplète. Aucun reviewer, GO Kevin, résultat GSC/SERP, score ou preuve de release n’a été inventé.

## API fail-closed

| Commande | Exigences | État futur imposé |
|---|---|---|
| `npm run resource:audit:qa` | G0–G4 | preview, approval et release strictement en attente |
| `npm run resource:audit:preview` | G0–G4 et preuve preview exacte | approval et release strictement en attente |
| `npm run resource:audit:approval` | G0–G5 et GO Kevin exact | release strictement en attente |
| `npm run resource:audit:release` | G0–G6, preview, GO et release exacts | aucun |

`npm run resource:audit` sans `--phase` échoue. `resource:validate` exige lui aussi une phase explicite. Le build public appelle explicitement `resource:audit:qa` après la génération du site ; il ne choisit donc aucun mode permissif implicite.

Le schéma JSON ferme les états partiels : preview, approval, release et chaque gate doivent être soit entièrement en attente, soit entièrement prouvés. Le validateur métier ajoute les invariants de phase, de hashes, de dates, de reviewer et de preuves.

## Candidat courant

Les deux manifestes H et T ont été rescellés après un build local. En phase QA, ils échouent uniquement sur leurs défauts G0–G4 réels ; aucune exigence de preview, d’approbation ou de release n’apparaît.

| Phase | Erreurs H | Erreurs T | Total | Lecture |
|---|---:|---:|---:|---|
| QA | 21 | 21 | 42 | défauts G0–G4 uniquement |
| Preview | 30 | 30 | 60 | QA + preuve preview courante |
| Approval | 34 | 34 | 68 | QA + preview + GO courant |
| Release | 41 | 41 | 82 | chaîne entière jusqu’à G6 |

La phase QA conserve notamment les refus suivants pour les deux manifestes : reviewer métier humain distinct absent, score recalculé inférieur à 90/100, P0/P1 non nuls, sources sensibles non suffisamment officielles ou prouvées et gates G0–G4 non PASS. Le rapport `.qa/resources/staged-gates/phase-reconciliation.json` vérifie séparément que la phase release réclame toujours preview, approbation et preuve de release.

## Témoins nominaux et négatifs

La suite `tests/scripts/resource-pipeline.test.mjs` couvre 33 témoins :

- états nominaux des quatre phases ;
- conservation exacte des hashes candidat et audit ;
- refus d’une preuve future prématurée ;
- refus d’un champ requis courant absent, y compris par le schéma brut ;
- refus de l’absence de `--phase` et d’une phase inconnue ;
- invariants existants H/A/T/G/M, score, P0/P1, reviewer sensible, sources officielles, bundles, surfaces H/T et témoins W01–W24.

Résultat frais : **33/33 PASS**.

## Chaîne de preuve indépendante

`.qa/resources/staged-gates/independent-chain.json` recalcule en Python standard, sans importer le validateur Node :

- les octets et SHA-256 de chaque fichier des quatre bundles ;
- le digest JSON canonique de chaque bundle ;
- le hash du candidat à partir de sa projection complète ;
- le hash de l’audit après retrait de `auditHash` ;
- les liens `integrity.candidateHash.value` ↔ `audit.candidateHash`.

Résultat : **2/2 manifestes PASS, 8/8 bundles PASS, tous les fichiers et hashes concordants**.

## Vérification exécutée

| Contrôle | Résultat frais |
|---|---|
| `npm run check` | PASS — 100 fichiers, 0 erreur, 0 warning, 1 hint hérité |
| `npm run build:site` | PASS — 9 pages, Python 51/51, Blog Node 55/55 + rendu 1/1, Ressources Node 33/33 |
| `QA_URL=http://127.0.0.1:4323 npm run test` | PASS — Playwright 98/98 |
| `npm run build` | exit 1 attendu — audit QA métier FAIL, 42 défauts réels |
| `git diff --check` | PASS |

Le premier lancement Playwright sur `127.0.0.1:4321` a touché un serveur concurrent périmé et a été exclu. La preuve créditée utilise l’Astro Preview isolée du worktree sur `127.0.0.1:4323`.

## Écran

Le Hub `/ressources` a été ouvert sur le serveur isolé puis capturé en pleine page dans `.qa/resources/staged-gates/hub-ressources.png`. Inspection : 3 ressources uniques, navigation Ressources active, filtres et CTA lisibles, aucun débordement, chevauchement, texte tronqué ou image cassée. La réserve métier « le professionnel doit valider » / « Le cabinet décide » est visible.

## Preuves machine

- `.qa/resources/staged-gates/qa-audit.json`
- `.qa/resources/staged-gates/preview-audit.json`
- `.qa/resources/staged-gates/approval-audit.json`
- `.qa/resources/staged-gates/release-audit.json`
- `.qa/resources/staged-gates/phase-reconciliation.json`
- `.qa/resources/staged-gates/independent-chain.json`
- `.qa/resources/staged-gates/check.log`
- `.qa/resources/staged-gates/build-site.log`
- `.qa/resources/staged-gates/build.log`
- `.qa/resources/staged-gates/playwright.log`
- `.qa/resources/staged-gates/hub-ressources.png`

## Limites et interdits

- Le correctif ne change pas le sens de G0–G6 ; il sépare seulement leur exigibilité dans le temps.
- Le candidat n’est pas prêt pour la preview : QAD reste fermé tant qu’un reviewer métier n’est pas décidé et que les vrais défauts G0–G4 ne sont pas résolus.
- Aucun appel DataForSEO/GSC, aucune recherche externe, preview distante, approbation, release, production, publication, push ou cron.
