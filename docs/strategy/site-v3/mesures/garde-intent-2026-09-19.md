# Garde intent-first — relevé du 19 septembre 2026

Verdict : **OUI**.

La garde n’était pas exécutée avant ce chantier. Elle bloque désormais à trois endroits :

1. `scripts/blog-forge.mjs` refuse une recette dont le H1 ou le titre d’onglet ne porte aucune requête mesurée, avant de créer le dossier candidat ;
2. `scripts/lib/blog-pipeline.mjs` applique le même refus à l’ancien chemin `create` et au gate du dossier ;
3. `package.json:10` exécute `npm run test:blog-title-intent` dans `build:site`, immédiatement après le rendu Astro et le retrait des briefs.

Le runbook appelle la forge à `docs/strategy/site-v3/RUNBOOK-QUOTIDIEN.md:83`, puis fait exécuter le build avant publication. La cadence est contrôlée dès l’entrée du runbook par `build-cluster-plan.py --check` à la ligne 27.

## Titre narratif : rouge observé

Mutation temporaire du H1 de `la-plateforme-que-personne-n-a-achetee` :

> La plateforme que personne n'a achetée, et ce que le refus m'a appris

Commande réellement jouée : `npm run build:site`.

Sortie rouge pertinente :

```text
# Subtest: chaque H1 publié porte une requête mesurée, y compris une mesure sans suggestion
not ok 1 - chaque H1 publié porte une requête mesurée, y compris une mesure sans suggestion
location: 'tests/scripts/blog-title-intent.test.mjs:60:1'
error: "la-plateforme-que-personne-n-a-achetee : H1 narratif sans intention mesurée — La plateforme que personne n'a achetée, et ce que le refus m'a appris"
# pass 2
# fail 1
```

Le fichier a été restauré. Le build complet final est vert et les trois tests intent-first passent.

## Cadence des Cicatrices : trois mutations rouges observées

Oracle : `tests/proof/test_editorial_cadence.py`.

### Cicatrice hors samedi

Mutation temporaire : désactivation de la condition `d.weekday() != 5`.

```text
test_cicatrice_hors_samedi_rougit ... FAIL
AssertionError: False is not true : ['la série Cicatrices ne tient pas sa cadence hebdomadaire du samedi']
Ran 3 tests in 0.039s
FAILED (failures=1)
```

### Deuxième Cicatrice dans la même semaine ISO

Mutation temporaire : désactivation du contrôle `any(n > 1 for n in cicatrices_par_semaine.values())`.

```text
test_deuxieme_cicatrice_de_la_meme_semaine_iso_rougit ... FAIL
AssertionError: False is not true : ['la série Cicatrices ne tient pas sa cadence hebdomadaire du samedi']
Ran 3 tests in 0.041s
FAILED (failures=1)
```

### Une Cicatrice ne consomme pas le plafond des quatre articles ordinaires

Mutation temporaire : remplacement de la sélection des articles ordinaires par `ordinaires = tous`.

```text
test_cicatrice_du_samedi_ne_consomme_pas_le_plafond_des_quatre ... FAIL
AssertionError: Lists differ: ['article ordinaire hors lundi-jeudi : la-plateforme-que-personne-n-a-achetee (2026-09-19)', …] != []
First list contains 9 additional elements.
Ran 3 tests in 0.036s
FAILED (failures=1)
```

Les trois mutations ont été restaurées. Rejeu vert :

```text
test_cicatrice_du_samedi_ne_consomme_pas_le_plafond_des_quatre ... ok
test_cicatrice_hors_samedi_rougit ... ok
test_deuxieme_cicatrice_de_la_meme_semaine_iso_rougit ... ok
Ran 3 tests
OK
```

## Sept articles relevés en production

Mesure à `2026-09-19T20:51:49.182Z`, sur les URL canoniques exactes sans query string, avec `Cache-Control: no-cache`. Résultat réseau : 7/7 HTTP 200, 7/7 URL finales canoniques, 7/7 réponses `cf-cache-status: DYNAMIC`.

Conformité attendue : H1 = `og:title` = JSON-LD `headline` ; le `<title>` peut être plus court, mais doit porter la même requête mesurée.

| Article | H1 | og:title | JSON-LD headline | `<title>` |
|---|---|---|---|---|
| `automatiser-la-relance-des-pieces-clients` | Automatiser la relance des pièces clients manquantes | Automatiser la relance des pièces clients manquantes | Automatiser la relance des pièces clients manquantes | Relance des pièces manquantes en cabinet comptable \| Memlia |
| `automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` | Automatiser la saisie comptable : ce qui reste à vérifier | Automatiser la saisie comptable : ce qui reste à vérifier | Automatiser la saisie comptable : ce qui reste à vérifier | Automatisation saisie comptable : les 6 contrôles \| Memlia |
| `automatiser-un-cabinet-comptable-la-carte-des-taches` | Automatiser un cabinet comptable : la carte des tâches | Automatiser un cabinet comptable : la carte des tâches | Automatiser un cabinet comptable : la carte des tâches | Automatisation cabinet comptable : carte des tâches \| Memlia |
| `comprendre-les-comptes-rendus-metier-dsn` | Comprendre les comptes rendus métier DSN : méthode de lecture | Comprendre les comptes rendus métier DSN : méthode de lecture | Comprendre les comptes rendus métier DSN : méthode de lecture | CRM DSN : lire le compte rendu et ses anomalies \| Memlia |
| `controler-les-bulletins-de-paie-avant-la-dsn` | Comment contrôler les bulletins de paie avant la DSN ? | Comment contrôler les bulletins de paie avant la DSN ? | Comment contrôler les bulletins de paie avant la DSN ? | Contrôle bulletin de paie en cabinet : avant la DSN \| Memlia |
| `la-plateforme-que-personne-n-a-achetee` | Pourquoi un cabinet n’adopte pas un outil : la leçon de mon échec | Pourquoi un cabinet n’adopte pas un outil : la leçon de mon échec | Pourquoi un cabinet n’adopte pas un outil : la leçon de mon échec | Pourquoi un cabinet n’adopte pas un nouvel outil \| Memlia |
| `suivre-la-production-sociale-dans-excel` | Suivre la production sociale dans Excel : modèle, règles et limites | Suivre la production sociale dans Excel : modèle, règles et limites | Suivre la production sociale dans Excel : modèle, règles et limites | Tableau de bord paie Excel : suivre sans surveiller \| Memlia |

Verdict du relevé : **7/7 conformes**. Les trois surfaces longues sont identiques et les sept titres d’onglet portent une requête mesurée.

## Limite résiduelle, nommée

Le dépôt ne possède toujours aucune CI ni aucun hook de push qui force `npm run build`. Une modification directe peut donc rester localement défectueuse tant que ni la forge, ni le gate, ni le build ne sont exécutés. La route documentée et la commande `npm run build` sont gardées ; le contournement volontaire de toute la chaîne ne l’est pas.
