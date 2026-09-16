# Collecte SERP H/T FIX-C — partielle, gate FAIL

Statut : a-valider. Auteur : hermes. Contrôle du 14 septembre 2026.

## Périmètre et intégrité

Les quatre tâches Google Organic Live Advanced autorisées ont été envoyées une seule fois chacune, en parallèle, avec `noAiMode: true`. France `2250`, langue `fr`, profondeur `10`, appareils desktop/mobile. Aucun volume, aucun paramètre multiplicateur, aucune nouvelle collecte hors périmètre. Les paramètres `os: windows` / `os: android` sont les valeurs retournées par DataForSEO, pas des paramètres ajoutés par le worker.

L’utilitaire `claude-seo` n’est pas installé dans cet environnement. L’estimation bornée a été calculée avant les appels : 4 × 0,002 = 0,008 USD, déjà autorisés par Kevin. Le ledger compare les coûts de chaque tâche à ceux de son enveloppe et les additionne sans double comptage : coût effectivement retourné **0,008 USD**, y compris les deux tâches échouées.

Les fichiers `*-response.json` conservent exactement la chaîne JSON renvoyée par l’outil ; les `*-tool-receipt.txt` conservent le reçu du tool stocké dans la session Hermes. Ce ne sont pas des réponses reconstituées. Requêtes et réponses sont liées par ID, paramètres, horodatage et SHA-256 dans `collection-ledger.json`. Les fichiers sont privés au workspace ; aucune donnée de cabinet, aucun secret.

## Résultats

| Surface/appareil | ID tâche | Code tâche | URLs organiques distinctes | Collecte |
|---|---|---:|---:|---|
| Hub desktop | 09141650-1656-0139-0000-2d66d463a4a4 | 40101 | 0 | FAIL |
| Hub mobile | 09141650-1656-0139-0000-6eca11d8254b | 20000 | 9 | PASS technique partiel |
| Glossaire desktop | 09141650-1656-0139-0000-6e007ee34467 | 20000 | 9 | PASS technique partiel |
| Glossaire mobile | 09141650-1656-0139-0000-350c1c5e68ec | 40101 | 0 | FAIL |

Piège vérifié : **les quatre enveloppes indiquent `status_code: 20000` et `tasks_error: 0`**, même lorsque la tâche imbriquée indique `40101 / Internal SE Server Error.` et `result: null`. Le statut par tâche fait donc foi. Aucune paire desktop/mobile complète ; aucun PASS H ou T.

## Lecture partielle des formats — inférences, pas audit des pages

Les URL, titres, descriptions et rangs exacts figurent dans le ledger et les réponses brutes. Le classement ci-dessous se fonde uniquement sur ces métadonnées SERP ; aucune URL concurrente n’a été ouverte et aucun fait métier de ses snippets n’est repris à titre de preuve.

| SERP | Rang organique | Domaine | Format suggéré par titre/URL | Intention inférée |
|---|---:|---|---|---|
| Hub mobile | 1 | chaintrust.io | Article processus métier | Information / découverte |
| Hub mobile | 2 | getyooz.com | Page explicative d’éditeur | Information / considération commerciale |
| Hub mobile | 3 | agiris.fr | Article d’éditeur | Information / considération commerciale |
| Hub mobile | 4 | everial.com | Article explicatif | Information |
| Hub mobile | 5 | queoval-expert.com | Guide | Information / considération commerciale |
| Hub mobile | 6 | bonjouria.fr | Offre de service IA métier | Commerciale |
| Hub mobile | 7 | fr.linkedin.com | Article d’opinion professionnel | Information |
| Hub mobile | 8 | myu.fr | Article stratégie | Information / considération commerciale |
| Hub mobile | 9 | bridgeapi.io | Comparatif logiciels | Investigation commerciale |
| Glossaire desktop | 1 | pennylane.com | Glossaire / fiche pratique | Définitions |
| Glossaire desktop | 2 | capeos.fr | Lexique de cabinet | Définitions |
| Glossaire desktop | 3 | capsurlaperformance.fr | Glossaire PDF | Définitions professionnelles |
| Glossaire desktop | 4 | blog.tiime.fr | Lexique / article | Définitions |
| Glossaire desktop | 5 | supexpertise.fr | Lexique pédagogique | Définitions |
| Glossaire desktop | 6 | nexco-expertise.com | Lexique de cabinet | Définitions |
| Glossaire desktop | 7 | actiononline.fr | Glossaire PDF | Définitions |
| Glossaire desktop | 8 | sage.com | Liste de termes | Définitions |
| Glossaire desktop | 9 | comptalents.fr | Lexique | Définitions |

Observation prudente : sur le seul mobile disponible, la requête Hub remonte surtout des articles, guides et offres, pas une preuve suffisante de pertinence d’un index navigationnel. Sur le seul desktop disponible, la requête glossaire remonte des lexiques et listes de définitions, dont le champ peut dépasser celui du glossaire Memlia. Une collecte technique réussie ne suffit pas à attribuer les points d’intention ou de potentiel de classement. Aucun score candidat projeté n’est donné ici.

## Google organique et citabilité IA séparés

- Hub mobile : types retournés `ai_overview`, `organic`, `people_also_ask`.
- Glossaire desktop : `ai_overview`, `organic`, `people_also_ask`, `related_searches`.
- Les objets AI Overview sont asynchrones, sans markdown ni références. Présence d’un emplacement observée ; contenu, citations et visibilité de Memlia **ND**. Aucun appel de récupération AI Overview ajouté.
- Les résultats organiques ne prouvent ni classement de Memlia ni citabilité par un moteur IA. Les snippets ne constituent pas un fact-check paie/fiscal.

## Vérification reproductible et arrêt

`python3 docs/qa/hub-ressources/metier-fix-c-serp/verify_receipts.py` : lecture des quatre réponses brutes, paramètres, IDs, hash, comptes d’URLs et coûts ; aucun réseau. Le script distingue explicitement le PASS de vérification des reçus du FAIL de collecte.

`shasum -a 256 -c checksums.sha256` à exécuter depuis ce dossier. Le premier lancement depuis la racine du repo a échoué faute de chemin ; cette erreur de commande ne concerne pas les reçus.

Condition d’arrêt du GO atteinte. Aucun cinquième appel, aucun candidat v3, aucun import Blog ou changement du contrat, aucun AI_REVIEW_PASS. Une nouvelle tentative limitée aux deux couples échoués nécessiterait **deux tâches supplémentaires** (estimation 0,004 USD), donc une autorisation supplémentaire. Les deux couples réussis ne doivent pas être recollectés tant qu’ils restent applicables et frais.
