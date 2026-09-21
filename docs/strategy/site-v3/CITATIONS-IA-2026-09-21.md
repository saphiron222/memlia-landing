# Citations par les moteurs IA — mesure C7 du 21 septembre 2026

## Verdict

**NON MESURÉE — échec fail-closed de la ligne de base ancrée.**

L’instrument est corrigé et le jeu de questions est figé, mais DataForSEO a répondu `HTTP 402 Payment Required`. La ligne de base n’est donc ni zéro citation, ni zéro concurrent : elle n’existe pas encore.

## Ce que l’instrument distingue désormais

| Mesure | Instrument | Recherche web prouvée | Lecture autorisée |
|---|---|---:|---|
| Notoriété du modèle | `llm_responses` | non, `web_search: false` | Memlia est-elle déjà nommée de mémoire ? |
| Citation dans ChatGPT Search | `llm_scraper/live/advanced` | oui, tâche reçue avec `force_web_search: true` | Memlia est-elle citée, et quelles pages sont citées à sa place ? |

Le relevé historique du 19 septembre porte sur six réponses non ancrées : zéro mention, mais **citation non mesurée** (`null`). Il ne partage ni le dénominateur ni le verdict du nouvel instrument.

Une sonde technique ancrée jouée avant la ligne de base a prouvé que le nouvel endpoint rend bien des sources : coût `0,004 $`, trois pages de `cnil.fr`, aucune page Memlia. Cette sonde valide le mécanisme d’extraction ; elle ne fait pas partie de l’échantillon C7 et ne vaut pas carte concurrentielle.

## Échantillon figé avant mesure

Le fichier `mesures/echantillon-ia.json` contient onze questions :

- 4 accès C1 issus du registre de demande daté du 20 septembre ;
- 4 questions réelles et anonymisées de C6, âgées de moins de 31 jours ;
- 3 définitions du glossaire ;
- une page candidate fixée pour chaque question avant tout résultat.

| Origine | Question | Page candidate | Résultat ancré |
|---|---|---|---|
| C1 | Quel calculateur utiliser pour calculer une marge commerciale ? | `/outils-comptables-gratuits/calculateur-marge-commerciale` | non mesuré, HTTP 402 |
| C1 | Comment calculer la date d’échéance d’une facture ? | `/outils-comptables-gratuits/calculateur-date-echeance-facture` | non mesuré, HTTP 402 |
| C1 | Qu’est-ce que la DSN de substitution en 2026 ? | `/glossaire#dsn` | non mesuré, HTTP 402 |
| C1 | Comment automatiser les tâches répétitives d’un cabinet comptable ? | `/automatisation-cabinet-comptable` | non mesuré, HTTP 402 |
| C6 | Cut-off en révision : votre méthode ? | `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` | non mesuré, HTTP 402 |
| C6 | Comment gérez-vous les documents manquants de vos clients ? | `/blog/automatiser-la-relance-des-pieces-clients` | non mesuré, HTTP 402 |
| C6 | Comment éviter les erreurs de facturation qui coûtent cher ? | `/automatisation/controle-factures-fournisseurs` | non mesuré, HTTP 402 |
| C6 | Dans quel ordre reprendre une comptabilité désorganisée pour éviter de refaire le travail ? | `/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` | non mesuré, HTTP 402 |
| Glossaire | Qu’est-ce qu’un compte rendu métier DSN ? | `/glossaire#compte-rendu-metier-dsn` | non mesuré, HTTP 402 |
| Glossaire | Qu’est-ce qu’une DSN annule et remplace ? | `/glossaire#annule-et-remplace-dsn` | non mesuré, HTTP 402 |
| Glossaire | Qu’est-ce qu’une règle de cabinet en expertise comptable ? | `/glossaire#regle-de-cabinet` | non mesuré, HTTP 402 |

## Domaines cités à la place de Memlia

**Ligne de base : aucun domaine attribuable.** Aucune des onze réponses n’a été produite. Écrire une liste vide ferait passer un refus de paiement pour une absence concurrentielle.

**Sonde technique hors échantillon :** `cnil.fr`, trois pages. Ce résultat prouve l’ancrage et l’extraction des sources, pas la position de Memlia sur les onze questions.

## Manques page par page

Aucun manque de contenu n’est déduit des réponses absentes. Les pages candidates et leur rôle sont fixés pour rendre la prochaine comparaison falsifiable, mais « ajouter une définition », « raccourcir une réponse » ou « produire une donnée unique » sans voir ce que ChatGPT Search cite serait une optimisation au jugé, explicitement interdite par C7.

| Page candidate | Diagnostic C7 recevable aujourd’hui | Décision fermée |
|---|---|---|
| Deux calculateurs | La mesure concurrentielle n’existe pas | aucune retouche avant les réponses ancrées |
| Pilier automatisation | La mesure concurrentielle n’existe pas | aucune retouche avant les réponses ancrées |
| Deux articles | La mesure concurrentielle n’existe pas | ne pas rouvrir leur fond scellé |
| Service contrôle des factures | La mesure concurrentielle n’existe pas | aucune retouche avant les réponses ancrées |
| Glossaire et ses trois ancres | Définitions courtes, sources et `DefinedTermSet` existent déjà ; leur citation reste non mesurée | conserver ce patron, ne pas revendiquer d’effet |

## Lisibilité machine mesurée en production

Le 21 septembre, `robots.txt` et l’accueil ont répondu `200` pour onze agents. Aucun accueil n’a servi d’en-tête `x-robots-tag: noindex`.

| Agent | Capacité réellement contrôlée | robots.txt |
|---|---|---|
| `OAI-SearchBot` | citation ChatGPT Search | autorisé explicitement |
| `GPTBot` | entraînement OpenAI | autorisé par `*` |
| `Claude-SearchBot` | citation Claude Search | autorisé explicitement |
| `ClaudeBot` | entraînement Anthropic | autorisé par `*` |
| `PerplexityBot` | citation Perplexity | autorisé explicitement |
| `Googlebot` | Google Search et AI Overviews | autorisé par `*` |
| `Google-Extended` | entraînement/grounding Gemini, pas Google Search | autorisé par `*` |
| `Applebot` | Siri, Spotlight et Safari | autorisé par `*` |
| `Applebot-Extended` | préférence d’entraînement Apple Intelligence | autorisé par `*` |
| `CCBot` | jeu Common Crawl | autorisé par `*` |
| `Bytespider` | entraînement ByteDance | bloqué explicitement |

`/llms.txt` répond `200` et pesait 7 542 octets au relevé. C’est une présence mesurée, pas un levier prouvé : aucun effet de citation ne lui est attribué et Google Search l’ignore.

## Suivi mensuel branché

La routine C4 :

1. valide l’échantillon C1 + C6 + glossaire et sa fraîcheur ;
2. appelle le scraper avec `force_web_search: true` ;
3. refuse toute tâche qui ne prouve pas ce paramètre ;
4. déduplique pages et domaines cités ;
5. conserve séparément l’historique non ancré ;
6. mesure les règles réellement servies aux onze agents et l’en-tête `x-robots-tag` ;
7. s’arrête au premier HTTP 402 et conserve les dernières mesures valides d’autorité et d’entité.

Condition de reprise unique : solde DataForSEO positif et suffisant pour onze tâches, puis `node scripts/seo/autorite.mjs relever --budget 0.60 --mois 2026-09`. Tant que cette condition est fausse, le verdict reste `NON_MESUREE`.