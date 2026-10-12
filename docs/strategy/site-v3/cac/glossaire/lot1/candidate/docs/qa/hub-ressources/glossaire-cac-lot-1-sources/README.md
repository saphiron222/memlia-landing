# Lot CAC 1 : cadre professionnel

## Reprise ciblée D1–D3 — t_79f71254

Ce paquet remplace celui de t_33e01ca3 pour les trois rattachements signalés par métier, sans modifier les dix entrées publiques, les sources ni leurs dates. Il comporte maintenant 60 unités (56 auparavant) : trois unités restreintes et quatre sous-affirmations ajoutées. Les autres unités sont identiques. Les sections ci-dessous décrivent la préparation initiale ; les contrôles actuels et la table des sous-affirmations sont livrés dans `corrections/` à la racine de l’archive.

D1 : certification rattachée à L.821-53, objet de l’audit rattaché à NEP 200 §03, ligne 68. D2 : rôles H2A/CNCC sourcés séparément, avec `claimSubject` pour lever toute ambiguïté des fragments et une synthèse éditoriale distincte. D3 : représentation sourcée, frontière doctrine/norme classée `methode-memlia` et `frontiere-editoriale`, sans citation institutionnelle ni obligation normative autonome. Les métadonnées additionnelles de statut sont locales au paquet ; l’intégration Ressources les conserve ou les traduit explicitement, sans traiter la synthèse comme un nouveau fait juridique.

Le champ `text` est la sous-affirmation attribuée ; `unitText` conserve le champ public complet, pour son emplacement et son assemblage, et ne constitue jamais une affirmation attribuée en totalité à `sourceId`. La sous-affirmation CNCC du champ H2A utilise une source déjà livrée au lot ; elle reste dans la preuve additionnelle, sans retoucher le tableau de sources de l’entrée publique. La publication groupée doit conserver ce rattachement additionnel.

Tous les verdicts d’auteur restent nuls. Réexamen sur la revue existante t_ada6a80c, limité à D1–D3 et au critère de fini. Aucune publication, aucun fichier global intégré. Réserve A4 et fenêtre de collecte du 06/10 au 13/10 inclus inchangées ; pas de nouvelle ouverture ou de redatage revendiqué.

## Livraison et portée

Paquet candidat : `docs/strategy/site-v3/glossaire-cac-lot-1.json`.

Dix entrées, canonical `/glossaire`, uniquement des ancres. Les champs `entries` et `sources` reprennent les formes GlossaryEntry et GlossarySource de main. Le lot reste `preview-only` ; aucune approbation métier ni publication n’est revendiquée. La revue indépendante est portée par `t_ada6a80c`. Les fichiers globaux du dépôt sont inchangés.

Base lue après fetch : `fdab2843a6f14cacecc95f2d93671a086622ce15`. RUNBOOK-QUOTIDIEN §6, SOURCES-DILA, ARCHITECTURE-CAC et charte `.agents/product-marketing.md` lus. La chaîne `resource-pipeline`, les spécifications `resource-metier-evidence` et `resource-metier-v3` ont été examinées ; ce paquet séparé n’est pas encore un manifeste global Ressources. Ne pas lancer son JSON comme un manifeste `resource-pipeline` et ne pas inventer un PASS de cette chaîne avant intégration.

## Dates et compatibilité

L’union de littéraux `GlossaryEntry.sourceCheckedAt` de main ne contient pas encore les dates réelles de ce lot. L’intégrateur ajoute `2026-10-06` et `2026-10-11` à cette union dans sa livraison groupée. Aucun autre changement de forme n’est requis. `shape-check.ts` vérifie tous les autres champs contre les véritables interfaces, avec cette seule extension explicite. Il ne prétend pas compiler les nouvelles dates contre l’union inchangée.

Les dates du paquet sont réelles : collecte DILA le 6 octobre (horodatage UTC original conservé), ouvertures H2A/CNCC et préparation le 11 octobre. Pour une entrée multisource, `sourceCheckedAt` donne le jour le plus récent ; les dates propres à chaque source restent dans `sources` et `evidence.sources` et toutes passent le contrôle de fraîcheur. Aucun réexport ne redatera une collecte.

Les cinq copies DILA proviennent du référentiel A4 via `scripts/export-dila-source.mjs` de PR125 ; elles conservent identifiant, version, période, provenance et réserve. `httpStatus` vaut null, jamais 200 : il ne s’agit pas d’une ouverture de Légifrance. Une collecte récente du dérivé DINUM ne garantit pas une consolidation récente ni le droit à jour. La fenêtre de collecte de sept jours expire, pour ces copies, après le 13 octobre (jour Paris). Avant une nouvelle préparation/publication après cette fenêtre, renouveler la collecte par le circuit autorisé, sans modifier son horodatage dans le JSON.

H2A : quatre pages officielles rouvertes, HTML et texte visible conservés. CNCC : deux pages publiques rouvertes ; leur réponse HTML HTTP est une coquille JavaScript. Les textes complets ont donc été extraits avec Hermes `web_extract`, sans les attribuer à l’HTML vide ; les métadonnées précisent cette méthode et son instant. La présentation du guide SACC 2018 sert exclusivement au vocabulaire, pas à présenter son ancien régime comme le droit actuel. Les distinctions missions/prestations et les limites d’indépendance sont sourcées par la norme de déontologie H2A ouverte.

## Preuves et lecture métier

`evidence.units` fournit 56 unités : texte, champ d’origine, source, extraits verbatim avec ligne, régime, portée et réserves. Les exemples et frontières Memlia sont distingués des affirmations normatives. Tous les `businessVerdict` sont null. Ces propositions de rattachement sont à juger par métier, pas des verdicts d’auteur.

Les copies complètes et leurs empreintes sont décrites dans `captures.json`. Les paragraphes sensibles restent entiers, notamment les réserves de L.821-35, les paragraphes 06 à 09 de la NEP 200 et les paragraphes d’indépendance de la norme de déontologie. La numérotation retenue est A.821-63, L.821-53, L.821-31, L.821-35 et L.820-1, jamais les anciens renvois L.823.

Chaque entrée possède son maillage de termes liés ; tous les termes référencés appartiennent au lot ou aux 53 ancres existantes. Aucun propriétaire existant ne collisionne avec les dix nouvelles ancres. Les liens d’articles réellement utilisés sont deux articles EC dont la portée est annoncée comme telle, pas des guides d’audit : vérifier une réponse d’IA et préparer les données confidentielles. Leur source publiée sur main et leur corps servi en HTTP 200 sont attestés dans `linkChecks`, avec HTML conservé.

Les destinations CAC futures sont dans `deferredLinks`, hors `internalLinks` : pilier CAC et supplément d’appréciation de l’outil automatisé. Ce lot ne crée ni route autonome ni offre SACC ; les familles en réserve restent inactives. À l’intégration, les liens vers les autres lots ne doivent être promus que si leurs propriétaires sont livrés.

## Contrôles exécutés

- Échec initial du contrôle en l’absence du paquet observé ; création du paquet puis contrôle positif.
- `node docs/qa/hub-ressources/glossaire-cac-lot-1-sources/validate.mjs` : PASS, dix entrées, onze sources, 56 unités, deux articles, 53 ancres existantes examinées.
- `node docs/qa/hub-ressources/glossaire-cac-lot-1-sources/mutations.mjs` : sept mutations refusées (terme manquant, citation inventée, source périmée, lien futur exposé, terme lié absent, empreinte divergente, fausse revue).
- `node --test tests/scripts/dila-source-copy.test.mjs` : cinq tests PASS, sortie conservée dans `tests-dila.log`.
- `tsc --ignoreConfig --noEmit --skipLibCheck --strict --target ES2022 --moduleResolution bundler --module ESNext .../shape-check.ts` : sortie zéro, vérification structurelle et extension de dates déclarée.

Le validateur du lot prouve la syntaxe, les liens attestés, l’intégrité, la fraîcheur au moment de préparation et l’existence des citations dans les copies. Il ne prouve pas leur soutien sémantique : c’est le travail de la revue métier enfant. Après intégration, la publication groupée reste responsable des spécifications d’affirmations additionnelles, des manifestes, des contrôles Ressources et de la livraison publique. Aucune construction complète locale ni modification de ces fichiers n’est effectuée ici.
