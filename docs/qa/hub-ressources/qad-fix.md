# QAD-FIX — Hub Ressources et glossaire

Date : 2026-09-14

Carte : `t_8931b129`

QAD source : `t_7a6dbdf8`
Candidat amont : archive SHA-256 `57018229bea71d4b669c4efcbdbcc478dc442e1918a49008df7261b14a062028`

## Verdict

**Correction technique livrée ; gate métier toujours FAIL.**

Les deux surfaces rendues H (`/ressources`) et T (`/glossaire`) sont désormais découvertes après le build et doivent être reliées chacune à exactement un manifeste dont le chemin, le nombre d’octets, le SHA-256, les unités rendues et, pour T, les 23 ancres correspondent au `dist` exact. Une surface sans manifeste, un hash divergent, une ancre divergente ou une unité absente ferme l’audit.

Aucun reviewer métier n’a été inventé. Les deux manifestes conservent `reviewerId:null`, `reviewerType:null`, `reviewerRole:null`, `status:"FAIL"`. Le build complet doit donc rester rouge ; ce rouge est le résultat attendu tant que la revue humaine distincte et les autres contrôles non rejoués ne sont pas résolus.

## Chaîne exacte

| Surface | Manifeste | Sortie liée | SHA-256 sortie | Résultat de liaison |
|---|---|---|---|---|
| H `/ressources` | `editorial/resources/hub/manifest.json` | `dist/ressources.html` | `65dc27de845c296328db066bbfc7db2a2ecd8078e2d0e733e0f211281d475d91` | 1 manifeste exact, 0 erreur de relation |
| T `/glossaire` | `editorial/resources/glossaire/manifest.json` | `dist/glossaire.html` | `2afcf8ecd6281d67eab680506b32f7a1ea29a7cd8b6e95a91a0925b8033e7167` | 1 manifeste exact, 23/23 ancres |

Le scellement reproductible se fait après génération du site :

1. `npm run build:site`
2. `npm run resource:seal-surfaces`
3. `npm run resource:audit`

Le scellement réécrit intégralement les deux manifestes possédés par le pipeline. L’audit ne resserre pas le périmètre aux manifestes : il part aussi des surfaces H/T réellement présentes dans `dist`.

## Classification source

Le Hub relie son unité manifeste à `src/pages/ressources.astro`. Le glossaire relie la définition DSN témoin à `src/data/glossary.ts`. Chaque source est présente dans `integrity.sourceBundle`, son contenu est relu sur disque, et citation, source, claim et unité portent leurs empreintes et relations bidirectionnelles.

Cette liaison technique n’est pas une attestation réglementaire. Les claims sensibles restent bloqués faute de source officielle primaire et de reviewer métier humain distinct.

## Reviewer métier absent

| Champ | H | T |
|---|---:|---:|
| `businessReview.required` | `true` | `true` |
| `reviewerId` | `null` | `null` |
| `reviewerType` | `null` | `null` |
| `reviewerRole` | `null` | `null` |
| `status` | `FAIL` | `FAIL` |
| Verdicts claim/source | 0 | 0 |

L’audit exact rend `FAIL`, avec 2 manifestes découverts, 0 PASS, 2 FAIL, 2 surfaces découvertes, 2 reliées et 0 non reliée. L’erreur déterministe « reviewer humain » est présente pour les deux manifestes. Aucun GO, aucune release ni publication ne sont autorisés.

## Glossaire validé dans le coffre

Commande :

`python3 scripts/validate_glossary_evidence.py --root /Users/kevinkitanga/memlia-vault/_inbox/propositions/glossaire --output .qa/resources/glossary-validation.json`

Résultat frais : **PASS**, 9 documents `statut: valide`, 23 termes, 23 ancres, 31 lignes Blog, 24 SEO, 19 noyau, 4 copies source, 119 contrôles et 0 erreur.

Le validateur exige simultanément :

- `statut: valide` ;
- `auteur: hermes` ;
- `valide_par` non vide ;
- `valide_le` date calendaire ISO réelle.

Le témoin `statut: a-valider` produit bien un FAIL et une erreur de frontmatter ; auteur invalide, validation absente et date impossible restent également refusés.

## Témoins négatifs

| Témoin | Résultat attendu | Résultat rejoué |
|---|---:|---:|
| Surface H/T rendue sans manifeste | FAIL | PASS du témoin négatif |
| Relation manifeste → build/ancres/unité cassée | FAIL | PASS du témoin négatif |
| Hash de bundle ou candidat divergent | FAIL | PASS du témoin négatif |
| Reviewer sensible absent ou non humain/distinct | FAIL | PASS du témoin négatif + FAIL du candidat exact |
| Coffre avec statut invalide | FAIL | PASS du témoin négatif |

Preuves : `.qa/resources/negative-node.tap` (4/4), `.qa/resources/negative-witnesses.json`.

## Réconciliation Playwright

Serveur isolé : `http://127.0.0.1:4479`, Astro 7.3.2 avec `--ignore-lock`. Le HTML servi de `/ressources` est octet pour octet identique à `dist/ressources.html`.

| Grandeur | Valeur |
|---|---:|
| Runner attendu | 98 |
| Runner inattendu | 0 |
| Runner ignoré | 0 |
| Specs JSON comptées indépendamment | 98 |
| Rapport durable corrigé | 98/98 |

Le précédent `118/118` n’est plus revendiqué. Preuve : `.qa/resources/playwright-reconciliation.json`.

## Écran

Le Hub mobile 375 px et le glossaire mobile ont été ouverts sur le serveur isolé. Contrôle DOM : largeur document = viewport (375/375), 0 image cassée, 1 H1 par page, 3 ressources sur le Hub et 23 entrées sur le glossaire. La réserve de revue métier est visible sur le glossaire.

Inspection des captures : aucun overflow horizontal, chevauchement ou contrôle masqué au haut des pages. Le Hub montre ses trois ressources. La capture pleine page très longue du glossaire a produit un assemblage Playwright non fiable ; elle n’est pas créditée. Deux viewports ciblés, haut de page et dernière entrée, sont conservés sous `.qa/resources/glossary-{top,last}-375.png`.

## Empreintes

| Artefact | SHA-256 |
|---|---|
| manifeste H | `a3f295b1681c21260126f9acc6cb0fb24c9576d6b9de623ff971a3709d1d0a4a` |
| manifeste T | `a2d50cc3c890e47f6364e3f9cd625dcbcb8a87738fb2983042623556ee247cdd` |
| validation glossaire | `6da84da36dd475c726b43b5f277b13d0ec9a72ca5f2c695c809aad54a9f271f8` |
| réconciliation Playwright | `25ceed60edf596b75c90c9696b8b9e4f24ba602762c056861cb23c0b76508727` |
| témoins Node TAP | `83a917d47a39a7b14ce71c7985bf4a7722bcf31ea8f3a002a9deb9c4cc43234d` |

L’empreinte de `.qa/resources/audit.json` est recalculée après chaque audit car `generatedAt` change ; son contenu courant fait foi avec le rapport versionné.

## Limites et interdits

- Aucun reviewer métier, score, source officielle, résultat GSC/SERP ou GO n’a été inventé.
- Aucun guide, modèle ou page `/glossaire/{slug}` n’a été créé.
- Aucun contenu sensible n’a été retiré ou modifié pour verdir le gate.
- Aucun push, déploiement, preview distante, production, publication ou cron.

## Fichiers modifiés

Liste exacte du commit d’intégration `05cc5e0f9bd8ce47a0055e3f26eb20b9591b65b1` :

- `.claude/tasks/context_session_1.md`
- `astro.config.mjs`
- `docs/blog-pipeline.md`
- `docs/qa/glossaire/recette.md`
- `docs/qa/hub-ressources/qad-fix.md`
- `docs/qa/hub-ressources/recette.md`
- `docs/qa/m4-r4/media-manifest.json`
- `editorial/legacy-baseline.json`
- `editorial/queue.json`
- `editorial/resources/glossaire/manifest.json`
- `editorial/resources/glossaire/skills.json`
- `editorial/resources/hub/manifest.json`
- `editorial/resources/hub/skills.json`
- `editorial/templates/article.md`
- `editorial/templates/brief.md`
- `editorial/templates/business-review-evidence.json`
- `editorial/templates/claims.json`
- `editorial/templates/image.json`
- `editorial/templates/manifest.json`
- `editorial/templates/resource-manifest-v1.schema.json`
- `editorial/templates/review.json`
- `editorial/templates/skills.json`
- `editorial/templates/source-classification.json`
- `package-lock.json`
- `package.json`
- `scripts/blog-pipeline.mjs`
- `scripts/lib/blog-pipeline.mjs`
- `scripts/lib/resource-pipeline.mjs`
- `scripts/prepare-preview.mjs`
- `scripts/resource-pipeline.mjs`
- `scripts/seal-resource-surfaces.mjs`
- `scripts/validate_glossary_evidence.py`
- `src/components/ArticleJsonLd.astro`
- `src/components/Footer.astro`
- `src/components/Nav.astro`
- `src/content.config.ts`
- `src/content/blog/controler-les-bulletins-de-paie-avant-la-dsn.md`
- `src/content/blog/suivre-la-production-sociale-dans-excel.md`
- `src/data/blog-visibility.mjs`
- `src/data/glossary.ts`
- `src/data/resources.ts`
- `src/layouts/Article.astro`
- `src/layouts/Base.astro`
- `src/pages/blog.astro`
- `src/pages/blog/[slug].astro`
- `src/pages/glossaire.astro`
- `src/pages/ressources.astro`
- `tests/browser/blog.spec.ts`
- `tests/browser/glossary.spec.ts`
- `tests/browser/mobile-menu.spec.ts`
- `tests/browser/resources.spec.ts`
- `tests/browser/site.spec.ts`
- `tests/fixtures/resource-candidate-h.json`
- `tests/proof/test_build.py`
- `tests/proof/test_glossary.py`
- `tests/proof/test_glossary_evidence.py`
- `tests/proof/test_resources.py`
- `tests/scripts/blog-candidate-render.test.mjs`
- `tests/scripts/blog-fixture.mjs`
- `tests/scripts/blog-pipeline-hardening.test.mjs`
- `tests/scripts/blog-pipeline.test.mjs`
- `tests/scripts/prepare-preview.test.mjs`
- `tests/scripts/resource-fixture.mjs`
- `tests/scripts/resource-pipeline.test.mjs`
