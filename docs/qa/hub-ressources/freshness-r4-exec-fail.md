---
statut: valide
auteur: hermes
---

# RESSOURCES-FRESHNESS-R4-EXEC — FAIL, aucun commit candidat

> Diagnostic intermédiaire, pas verdict final. La reprise de la même carte a corrigé explicitement le contrat de conservation Blog et fermé les erreurs hors businessReview. Voir [freshness-r4-exec.md](freshness-r4-exec.md) et son dossier de preuves pour le résultat actuel. Les mesures ci-dessous décrivent uniquement la première passe.

Carte : `t_54774b16`. Contrôle local du 15 septembre 2026. Base et HEAD conservés : `939464c90ecee928bfd9d7f7be26ea028758cf8b`.

## Verdict et limite de cette exécution

**FAIL : restauration effectuée, migration éditoriale non effectuée, aucun commit créé.** Le critère « rouge exclusivement businessReview » n'est pas satisfait. Le rapport `metier-fix-c-astra.md` antérieur ne décrit plus un candidat valide. Aucun push, déploiement, preview distante, publication, recherche réseau éditoriale ou cron.

La condition d'arrêt de la carte s'applique : conserver les octets publiés révèle une incompatibilité du contrat Blog, au-delà des tests/fixtures à actualiser. Je n'ai pas changé les règles de validation pour faire passer ce candidat ni réattribué les anciens reçus au nouveau contenu. Les tests défaillants et les dossiers sont conservés en l'état pour la correction aval, sans faux scellement.

## Changements réels

Les deux Markdown ont été restaurés directement depuis l'objet Git indiqué, avec `git restore --source=939464c90ecee928bfd9d7f7be26ea028758cf8b --worktree -- <les deux chemins exacts>` :

| Article | SHA-256 vérifié |
|---|---|
| `controler-les-bulletins-de-paie-avant-la-dsn` | `03be4a3d996f0f3c9c9035c9038e7fbd00bfdc5d4a281352ae6cd0050046be92` |
| `suivre-la-production-sociale-dans-excel` | `56a5f5a1e19cd327558d8c024b3570643bc2f233cfce02d117c0ca250430103b` |

La comparaison binaire indépendante contre `git show <base>:<chemin>` est vraie pour les deux. `brouillon:false`, `statutEditorial:publie-non-atteste`, auteur `kevin` résolu vers Kevin Kitanga. Le diff de ces deux fichiers contre HEAD est vide. Aucun autre fichier d'implémentation n'a été modifié par ce run.

Avant restauration : statut détaillé `-uall` de 230 entrées (le décompte de 83 de la carte regroupe les répertoires non suivis), et diff binaire archivés sous `.qa/freshness-r4/`. SHA-256 du diff initial : `3426c69ca5f7531cab76d8c3b6c6b928cb2bb177146eba50c2d1cc0d7e180777`.

## Défaut supplémentaire prouvé, pas un simple hash périmé

1. `scripts/lib/blog-pipeline.mjs:1293-1304` exige `brouillon:true` sauf si le manifeste vaut exactement `go-production` ET `kevin.productionApproved:true`. Mais le même contrat, ligne 1331, exige l'égalité du statut du manifeste avec celui du Markdown publié, `publie-non-atteste`. Aucun alignement des seuls manifests/reçus ne satisfait simultanément ces deux conditions sans changer l'article interdit ou le contrat de validation.
2. Le diagnostic `.qa/freshness-r4/diagnose.mjs` projette en mémoire les métadonnées publiées dans chaque manifeste : `validateCandidate` accepte les deux projections, mais la condition du contrat d'article continue de calculer `expectedDraftUnderCurrentContract:true`, contre les octets publics `false`. Ce n'est donc pas une erreur d'enum ni de schéma Astro.
3. Le report métier de preview exige `publicationBlocked:true` et `decision:defer-until-publication` (`scripts/lib/blog-pipeline.mjs:1140-1147`). Il ne décrit pas ces articles déjà publiés non attestés. On ne peut pas simplement resigner cette preuve avec leurs hashes.
4. Les sept reçus source livrés dans les dossiers portent `checkedAt:2026-09-13`; les articles déclarent une relecture au 15. La règle de fraîcheur impose l'identité de jour entre manifeste, reçus, claims et revue (`:1056-1089`). Ces reçus ne prouvent pas la relecture déclarée au 15. Ce constat est borné aux dossiers inspectés : il ne prétend pas que la publication n'a disposé d'aucune autre preuve. Une migration doit récupérer cette provenance ou distinguer explicitement collecte historique et relecture locale ; elle ne doit pas changer silencieusement une date de collecte.

## Mesures fraîches

| Commande / contrôle | Résultat réel |
|---|---|
| `npm ci --ignore-scripts` | code 0 ; 386 packages ajoutés, 387 audités, 0 vulnérabilité |
| `npm ls parse5 --depth=0` | code 0 ; dépendance directe `parse5@8.0.1` |
| `npm audit --omit=dev` | code 0 ; 0 vulnérabilité |
| `npm run check` | code 0 ; 105 fichiers, 0 erreur, 0 warning, 1 hint préexistant |
| `npm run blog:audit` | code 1 ; 2 entrées pipeline, 0 legacy, **118 diagnostics**, aucun dossier valide |
| `npm run build:site` | code 1 ; Astro construit 9 pages, dont les deux routes Blog ; Python **53/56**, 3 échecs |
| `npm run test:resource-pipeline:unit` | code 0 ; **35/35**, 0 ignoré, mutations intégrées incluses |
| `npm run resource:audit:qa` | code 1 ; 2 erreurs de liaison de surface, 61 diagnostics manifestes dont 2 `buildOutput` ; **0/2 surfaces liées** |
| `npm run build` | code 1 ; s'arrête au Blog et ses 118 diagnostics, avant `build:site` |
| `git diff --check` | code 0 |

Les trois échecs Python :
- `test_build.py:49` attend uniquement les articles de preview, pas les deux articles publics ;
- `test_glossary.py:135` confronte les articles aux vieux hashes des dossiers de revue ;
- `test_resource_v3_traceability.py:69` épingle encore les hashes `92ec8350`.

Les tests de rendu restants confirment le sitemap, le RSS, les métadonnées Blog, les liens internes/glossaire et les unités visibles. L'oracle d'inventaire, la projection du registre et l'absence de champ `effectiveDate` passent. Les comptes H/T restent **41 unités / 49 claims / 57 citations**. Cela ne signifie pas que les sorties H/T sont rescellées : elles ne le sont pas et leur hash de build diverge.

Non exécutés après l'arrêt de périmètre : correction des fixtures, migration des dossiers, scellement, suite Node Blog complète, campagne Playwright/captures et témoins de migration nouveaux. Aucun PASS n'est revendiqué sur ces critères.

## Handoff obligatoire

- `t_391e2204` ne doit pas « adopter un commit » de cette carte : il n'en existe aucun.
- `t_8f07fd85` ne dispose pas d'un candidat à approuver. Les hashes publics de 939464c priment toujours sur la référence 92ec8350 de son corps historique.
- Correction nécessaire avant nouvelle recette : prendre en charge explicitement les articles déjà publiés non attestés dans l'audit Blog, sans les assimiler à une preview ni ouvrir les gates de publication ; migrer les preuves avec leur provenance réelle ; actualiser les trois attentes Python ; sceller H/T sur un build public sans variables de preview ; rejouer la recette intégrale puis seulement créer le commit.
- Le WIP préexistant demeure non committé. Cette note n'est pas un handoff de succès et ne rend pas le worktree propre.

Preuves : `.qa/freshness-r4/diagnostic.json`, `summary.json`, logs individuels et archive de l'état initial. Une archive téléchargeable est jointe au résultat de la carte.
