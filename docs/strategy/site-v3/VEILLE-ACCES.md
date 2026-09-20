# Veille des accès et des fenêtres réglementaires

## Décision

Deux routines distinctes sont retenues.

- Questions : chaque mardi à 07:35, heure de Paris. Une semaine est l’unité utile d’un forum ; lancer chaque jour ferait recompter les mêmes fils et transformerait la veille en bruit.
- Réglementaire : chaque jour à 07:05, heure de Paris. Un report, une échéance ou un seuil peut rendre une page fausse en vingt-quatre heures ; ce risque justifie un contrôle quotidien.

Le seuil questions est fixé à au moins 3 occurrences, 3 personnes distinctes et 2 fils sur 31 jours. Le comptage des personnes se fait transitoirement ; les identités ne sont jamais écrites. Un besoin déjà présent dans C1 n’est pas un nouvel accès.

## Questions : deux étages obligatoires

1. Récolte mondiale. `last30days` interroge Reddit sur une famille tournante : pièces et approbations, clôture et rapprochement, échanges entre logiciels, paie, audit, adoption de l’IA. La collecte vise les douleurs ; aucune règle étrangère ne passe cette étape.
2. Filtre français. Pour tout candidat qui franchit le seuil, vérifier successivement : geste existant en France ; effet de la règle française sur source primaire datée ; couverture concurrentielle française ; vocabulaire français mesuré, jamais traduit littéralement.

La commande locale `npm run veille:questions` mesure Compta Online. Elle accepte aussi `--last30days=<json>` et produit un relevé anonymisé. Les terrains privés LinkedIn et Facebook restent `non-mesurable-sans-identifiants` : aucune aspiration de groupe ni donnée personnelle.

Sortie autoritaire : `docs/strategy/site-v3/mesures/veille-observations-YYYY-MM-DD.json`. Le premier tri est `veille-questions-2026-09-20.json`. Les retenues et les rejets motivés restent ensemble. Une retenue nouvelle est ajoutée au registre des accès puis matérialisée en carte kanban ; sinon la routine ne notifie pas.

## Réglementaire : fail-closed

`npm run veille:reglementaire` contrôle le candidat C3 scellé `e73e9905fec92c4dc215e78171e75c0812430a1f`, les trois sources qui soutiennent une formulation et cinq terrains institutionnels : Légifrance/DILA, impots.gouv.fr, net-entreprises, URSSAF et l’Ordre.

Contrat : HTTP 200, TTL de 24 heures avant publication, égalité du candidat aux hashes scellés, présence des formulations soutenues. Les champs critiques sont date, population, obligation, seuil et statut de plateforme. Sans différence, silence. Sur différence ou panne, ouvrir une maintenance ; si une page concernée est publiée, la suspendre en 503 avec `noindex` et hors sitemap jusqu’au nouveau triplet source + revue + sceau.

L’état initial du 20 septembre est critique : l’extrait Service-Public n’est plus retrouvé dans le corps dynamique, l’extrait AIFE n’est plus retrouvé et deux terrains de découverte n’ont pas répondu. Cela n’autorise aucune publication ; `aiReviewPass` reste faux et FE-01/02/03 restent `SOURCE_INACCESSIBLE` P1.

## Vie privée et sortie

Les rapports conservent la question, la date, le terrain, l’URL ou son identifiant hashé et des comptes agrégés. Ils ne conservent jamais de nom, pseudonyme, profil ou citation nominative. Une notification ne part que pour un nouvel accès au-dessus du seuil ou une différence réglementaire critique. Les échecs de source sont des différences, pas des silences.
