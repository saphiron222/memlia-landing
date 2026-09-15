# Revue indépendante du plan site v2

Base comparée : `8c368fb...HEAD` (`bf7796c`, `0067e54`, `b5dcd10`, `6ef1047`). Revue docs-only ; aucun fichier applicatif ou contrat Ressources modifié.

## Verdict exécutif

**REFUSÉ pour libération de COPY.** Le plan respecte globalement le périmètre annoncé : il sépare Blog/Ressources, interdit la création de doublons Glossaire/Guides/Modèles, conserve les routes d’articles et les ancres historiques, et réserve les hotspots de code à la chaîne d’implémentation. Le validateur documentaire passe (`14` pages, `66` arêtes, profondeur `2`, `0` orpheline), mais ce vert ne prouve ni le DOM publié ni le contrat de la release Ressources. Un Critical et deux Important restent ouverts ; la carte de correction `t_74efbe3a` doit rendre un PASS explicite avant `t_42bc3eed`.

## Verdict par critère

| Critère | Verdict | Motif |
|---|---|---|
| Architecture des 14 URL | PASS | Inventaire complet, cinq pages nouvelles, routes existantes et P2 distinguées ; graphe cible sans orpheline. |
| Accueil vs service | PASS | L’accueil oriente la catégorie ; le service qualifie tâche, livrable, dépendances, devis et recette. Heroes, JTBD et missions sont distincts. Fusion obligatoire avant publication si la copy les rapproche. |
| Pages confiance/conversion | PASS | `/methode`, `/garanties`, `/a-propos` et `/contact` répondent à des objections nommées sans être présentées comme moteurs de trafic démontrés ; volumes et difficulté restent ND. |
| Pages métier/usage exclues | PASS | D09 ferme les pages sociales commerciales faute de preuve et de demande d’achat distinctes ; les deux intentions existantes restent servies par les articles. Réexamen prévu sur GSC fraîche. |
| Matrice 21 champs et maillage | PASS documentaire | Les 14 fiches et 66 arêtes se réconcilient ; ce PASS ne vaut pas crawl du futur candidat. |
| Blog et articles | PASS | H1 conservé, chapeau exact et action définis dans `GLOBAL-MESSAGING.md:10-25` ; slugs, auteur et sources des deux articles sont préservés. |
| Preuves, SERP et données | PASS avec limites | Google CAPTCHA et repli Bing incohérent sont exclus ; GSC, CrUX, positions, volumes, KD, conversions, backlinks et visibilité IA sont ND. Lighthouse 87/92 est explicitement une baseline laboratoire insuffisante, pas un PASS de recette. |
| Design et technique | PASS documentaire | Redesign-preserve, charte et composants existants, six largeurs, JS off, reduced-motion, SEO/schema et mutants de recette sont spécifiés ; aucune implémentation n’est revendiquée. |
| Contrat Ressources / Glossaire | FAIL | Le candidat/release autoritaire, ses routes et ses manifestes ne sont pas scellés dans la source de vérité du plan. |
| Ancres historiques | FAIL | Six ancres sont prescrites mais ne disposent pas d’un oracle rendu ni d’un mutant. |
| Anti-doublon Ressources | FAIL | L’interdit existe, sans comparaison reproductible des slugs, termes et intentions du manifeste. |
| Historique marketing v1→v2 | PASS de fond, traçabilité mineure | Les invariants principaux sont présents en v2, mais leur correspondance avec v1 n’est pas explicite. |

## Critical

### C1 — La dépendance Ressources est déclarée, mais la source de vérité exacte n’est pas matérialisée dans le plan

- **Localisation :** `docs/strategy/site-v2/SITE-STRUCTURE.md:86-87`, `docs/strategy/site-v2/IMPLEMENTATION-ROADMAP.md:11,23,27-32`, `docs/strategy/site-v2/PAGE-INVENTORY.md:247-295`.
- **Constat :** le plan exige de lire le manifeste de `t_4cd25435` et de reprendre les URL exactes, mais la matrice fixe déjà `/ressources` et `/glossaire` comme pages, propose leurs titres/descriptions/graphes et fait dépendre le build d’une release dont le manifeste, le hash et le commit ne sont pas joints. Dans ce worktree, le commit indiqué comme candidat Ressources (`939464c90ecee928bfd9d7f7be26ea028758cf8b`) ne contient ni manifeste Ressources/Glossaire ni ces pages : il ne peut donc pas servir de contrat. Une intégration peut satisfaire le graphe cible tout en divergeant du contrat réellement livré.
- **Correction exacte :** ajouter un fichier `docs/strategy/site-v2/evidence/resources-release-contract.json` contenant `source_commit`, chemins des deux manifestes, SHA-256 frais, routes exactes extraites, et statut de release `t_4cd25435`. Remplacer dans `PAGE-INVENTORY.md` et `page-inventory.json` toute fiche `/ressources`/`/glossaire` qui ne provient pas de cette extraction par un lien vers ce fichier et marquer les champs éditoriaux « à reprendre depuis manifeste ». Ajouter dans `validate-plan.py` un échec si le commit, les hashes ou les routes du manifeste ne correspondent pas à la matrice. Tant que ce readback n’existe pas, ne pas considérer la dépendance satisfaite.

## Important

### I1 — La préservation des ancres historiques est normative mais non testée par l’oracle

- **Localisation :** `docs/strategy/site-v2/SITE-STRUCTURE.md:76-81`, `docs/strategy/site-v2/INTERNAL-LINKING.md:30-36`, `docs/strategy/site-v2/TECHNICAL-SEO-SCHEMA.md:35-46`.
- **Constat :** les six ancres `/#usages`, `/#methode`, `/#integration`, `/#garanties`, `/#questions`, `/#preuves` sont bien identifiées et présentes dans le code historique (`src/components/Nav.astro:24-28`, `src/components/Footer.astro:17,27,53-55`), mais `validate-plan.py` ne vérifie que le graphe de pages ; il ne vérifie ni l’existence des IDs dans le HTML candidat, ni les liens historiques, ni leur absence de régression. Le contrat « conserver » peut donc passer avec des pages nouvelles et un graphe parfait alors que des backlinks historiques cassent.
- **Correction exacte :** ajouter dans `TECHNICAL-SEO-SCHEMA.md` une section `Oracle des contrats historiques` listant les six URLs exactes et l’obligation `id`/cible dans le DOM rendu. Étendre `validate-plan.py` (ou l’oracle de recette candidat) avec `historical_anchors = ["/#usages", "...#methode", "...#integration", "...#garanties", "...#questions", "...#preuves"]`, et faire échouer le contrôle si chaque cible n’est pas présente dans les liens et dans le HTML de `/`. Ajouter le même contrôle au tableau de recette de `IMPLEMENTATION-ROADMAP.md:23-25`.

### I2 — Le contrôle anti-doublon Ressources/Glossaire n’a pas d’étape opérable de comparaison de contenu

- **Localisation :** `docs/strategy/site-v2/DECISIONS.md:24-28`, `docs/strategy/site-v2/CONTENT-ROADMAP.md:5-8,22-25`, `docs/strategy/site-v2/PAGE-INVENTORY.md:284-291`.
- **Constat :** le plan interdit correctement les doublons, et le contrat Ressources confirme l’absence actuelle de nouveau contenu (`docs/qa/hub-ressources/modele-na-t_e7c84a8c.md:65-73`), mais la validation ne compare aucun slug, titre, terme ou intention avec `editorial/resources/*/manifest.json`. La condition « zéro doublon » est donc une consigne humaine, pas un contrôle reproductible ; elle est particulièrement importante pour la future page P2 DSN annoncée comme conditionnelle.
- **Correction exacte :** ajouter `docs/strategy/site-v2/evidence/resource-overlap.json`, généré par un script docs-only qui extrait les slugs/titres/termes/intentions des deux manifestes et les compare aux fiches et futurs sujets `PAGE-INVENTORY.md`/`CONTENT-ROADMAP.md`. Le script doit produire `duplicate_slug`, `duplicate_term`, `overlapping_intent` et échouer sur les deux premiers ; `overlapping_intent` doit imposer une décision explicite « enrichir l’existant / créer avec preuve distincte ». Appeler ce contrôle depuis `validate-plan.py` et préciser qu’il doit être rejoué après toute release Ressources.

## Minor

### M1 — Le document marketing v2 remplace fortement v1 sans table de correspondance des invariants

- **Localisation :** `.agents/product-marketing.md:1-63`, notamment `:9`, `:31`, `:47`, `:62-63`.
- **Constat :** l’historique v1/v2 est résumé par deux lignes de changelog, mais la suppression massive de v1 retire des formulations opératoires (familles de tâches, alternatives indirectes, anti-persona détaillé, preuves par thème). Le v2 conserve l’essentiel, sans indiquer explicitement quelles règles v1 sont remplacées, fusionnées ou toujours obligatoires. Cela rend une revue de copy ultérieure moins traçable.
- **Correction exacte :** ajouter après le changelog une table `Invariants v1 → v2` avec au minimum : service non-SaaS/catalogue, prix jamais au siège, validation humaine/fail-closed, outils existants/Excel non catégorie, données fictives et absence de métriques client, anti-surveillance, interdits de copy, auteur Kevin Kitanga. Pour chaque ligne, indiquer `conservé`, `resserré` ou `remplacé` et la section v2 faisant foi.

## Vérifications exécutées

- `python3 docs/strategy/site-v2/validate-plan.py` : **PASS**, 14 pages, 66 arêtes, profondeur maximale 2, 0 orpheline, 5 concurrents, 12 mesures responsive, 4 runs Lighthouse ; le script se décrit lui-même comme validation documentaire, pas acceptation d’implémentation.
- `git diff --check 8c368fb...HEAD` : sortie vide, code retour 0.
- Les 12 documents, les 14 fiches et leurs sources JSON ont été relus ; `page-inventory.json` réconcilie 14 URL et 66 liens.
- `939464c90ecee928bfd9d7f7be26ea028758cf8b` a été résolu et inspecté : il ne porte pas les manifestes/routes Ressources attendus. Le statut de `t_4cd25435` est encore `todo` ; l’absence est une dépendance à matérialiser, pas une release à inventer.
- Historique v1/v2 relu dans `.agents/product-marketing.md` et l’historique Git. Les erreurs SERP sont exclues par `CURRENT-AUDIT.md:65-68` et `COMPETITOR-ANALYSIS.md:21-30`; les scores Lighthouse sous 95 sont bornés comme baseline dans `CURRENT-AUDIT.md:38-50` et D15.

Aucun doublon de route `/ressources` ou `/glossaire` n’est créé par le diff, mais l’absence de doublon de contenu n’est pas encore prouvée. Le plan reste refusé jusqu’au scellement du contrat Ressources, à l’oracle des ancres et au contrôle reproductible de recouvrement. La correction M1 améliore la traçabilité et ne doit pas rouvrir le positionnement.