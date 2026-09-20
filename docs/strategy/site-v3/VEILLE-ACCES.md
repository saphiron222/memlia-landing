# Veille des accès et des fenêtres réglementaires

## Décision

Deux routines distinctes sont retenues.

- Questions : chaque mardi à 07:35, heure de Paris. Une semaine est l’unité utile d’un forum ; lancer chaque jour ferait recompter les mêmes fils et transformerait la veille en bruit.
- Réglementaire : chaque jour à 07:05, heure de Paris. Un report, une échéance ou un seuil peut rendre une page fausse en vingt-quatre heures ; ce risque justifie un contrôle quotidien.

Le seuil questions est fixé à au moins 3 occurrences, 3 personnes distinctes et 2 fils sur 31 jours. Le comptage des personnes se fait transitoirement ; les identités ne sont jamais écrites. Un besoin déjà présent dans C1 n’est pas un nouvel accès.

## Questions : deux étages obligatoires

1. Récolte mondiale. `last30days` interroge Reddit sur une famille tournante : pièces et approbations, clôture et rapprochement, échanges entre logiciels, paie, audit, adoption de l’IA. La collecte vise les douleurs ; aucune règle étrangère ne passe cette étape.
2. Filtre français. Pour tout candidat qui franchit le seuil, vérifier successivement : geste existant en France ; effet de la règle française sur source primaire datée ; couverture concurrentielle française ; vocabulaire français mesuré, jamais traduit littéralement.

La commande locale `npm run veille:questions` mesure Compta Online. Elle accepte aussi `--last30days=<json>` et produit un relevé anonymisé. Le pré-run `memlia-veille-questions.sh` exécute deux familles par semaine et fait tourner les six familles en trois semaines : pièces/approbations, clôture/rapprochement, échanges entre logiciels, paie, audit, adoption de l’IA. Le corpus brut last30days est temporaire et supprimé après agrégation ; seuls les titres, dates, URL, identifiants hashés et comptes anonymisés persistent. Les terrains privés LinkedIn et Facebook restent `non-mesurable-sans-identifiants` : aucune aspiration de groupe ni donnée personnelle.

Sortie autoritaire : `docs/strategy/site-v3/mesures/veille-observations-YYYY-MM-DD.json`. Le premier tri est `veille-questions-2026-09-20.json`. Les retenues et les rejets motivés restent ensemble. Une retenue nouvelle est ajoutée au registre des accès puis matérialisée en carte kanban ; sinon la routine ne notifie pas.

## Réglementaire : fail-closed

`npm run veille:reglementaire` contrôle le candidat C3 scellé `e73e9905fec92c4dc215e78171e75c0812430a1f`, les trois sources qui soutiennent une formulation et cinq terrains institutionnels : Légifrance/DILA, impots.gouv.fr, net-entreprises, URSSAF et l’Ordre.

Contrat : HTTP 200, TTL de 24 heures avant publication, égalité du candidat aux hashes scellés, présence des formulations soutenues. Les champs critiques sont date, population, obligation, seuil et statut de plateforme. Sans différence, silence. Sur différence ou panne, ouvrir une maintenance ; si une page concernée est publiée, la suspendre en 503 avec `noindex` et hors sitemap jusqu’au nouveau triplet source + revue + sceau.

L’état initial du 20 septembre est critique : l’extrait Service-Public n’est plus retrouvé dans le corps dynamique, l’extrait AIFE n’est plus retrouvé et le terrain URSSAF n’a pas répondu. Quatre terrains de découverte sur cinq répondent HTTP 200. Cela n’autorise aucune publication ; `aiReviewPass` reste faux et FE-01/02/03 restent `SOURCE_INACCESSIBLE` P1. La maintenance durable est `t_5a9073c4` ; la routine ne la duplique pas tant que l’état ne change pas.

## Vie privée et sortie

Les rapports conservent la question, la date, le terrain, l’URL ou son identifiant hashé et des comptes agrégés. Ils ne conservent jamais de nom, pseudonyme, profil ou citation nominative. Une notification ne part que pour un nouvel accès au-dessus du seuil ou une différence réglementaire critique. Les échecs de source sont des différences, pas des silences.

## Automatisation active

| Routine | Identifiant | Fréquence Europe/Paris | Script pré-run | Sortie |
|---|---|---|---|---|
| Questions et douleurs | `d06feab2c862` | mardi 07:35 | `~/.hermes/profiles/marketing/scripts/memlia-veille-questions.sh` | Telegram + bot-chat marketing seulement si un accès nouveau franchit le seuil |
| Fenêtres réglementaires | `174bf40ad474` | chaque jour 07:05 | `~/.hermes/profiles/marketing/scripts/memlia-veille-reglementaire.sh` | Telegram + bot-chat marketing seulement sur différence substantielle |

Les deux jobs ont `continuity=true`, archivent leurs snapshots sous `~/.hermes/profiles/marketing/data/veille-acces/` et répondent exactement `[SILENT]` sans signal. Le canari du 20 septembre a exécuté les deux jobs : statut `ok`, sortie `[SILENT]` pour chacun, donc aucune notification de routine. Le lot questions a mesuré 40 fils Compta Online et 22 fils Reddit sur les familles échanges entre logiciels et paie ; quatre questions ont survécu au filtre lexical, aucune n’avait deux fils indépendants, donc zéro nouvel accès et zéro carte. Le contrôle réglementaire a conservé le candidat scellé, détecté les deux extraits perdus et la panne URSSAF, puis s’est tu parce que la maintenance initiale était déjà matérialisée.
