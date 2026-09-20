# Audit de cannibalisation — 7 articles et 2 hubs

- Date de l’analyse : 20/09/2026
- Mode : `blog-cannibalization`, analyse locale (titres/H1, `primaryQuery`, descriptions et H2)
- Corpus : `src/content/blog/*.md` (7 articles) + les 2 H1 de `src/data/blog-rubriques.mjs`
- Donnée de requête : relevé d’autocomplétion du 20/09/2026 transmis avec la carte, instrument `autocompleterGoogle`
- API/SERP : non appelée ; les sévérités ci-dessous sont donc les heuristiques locales du skill, pas des positions Google

## Mesure d’autocomplétion conservée

| Requête testée | Résultat de l’instrument | Décision |
|---|---:|---|
| `paie dsn cabinet comptable` | succès, 0 suggestion | mesure valide mais sans variante proposée |
| `paie et dsn cabinet comptable` | succès, 0 suggestion | requête primaire du hub Paie/DSN |
| `gestion paie dsn cabinet comptable` | succès, 0 suggestion | écartée : formulation moins naturelle |
| `pièces comptables cabinet` | succès, 0 suggestion | secondaire possible, pas le H1 |
| `saisie comptable pièces clients` | succès, 0 suggestion | écartée : chevauche l’article de saisie |
| `saisie comptable et pièces clients` | succès, 0 suggestion | écartée : chevauche l’article de saisie |
| `gestion des pièces comptables` | 4 suggestions : `gestion des pièces comptables`, `gestion des opérations comptables`, `gestion des écritures comptables`, `gestion des pièces justificatives` | requête primaire du hub Pièces |

Une liste vide est enregistrée comme mesure ; elle n’est pas interprétée comme une absence de mesure.

## Cibles et intentions

| Code | Page | Requête primaire | Intention locale |
|---|---|---|---|
| H-P | Hub `paie-dsn-cabinet-comptable` | `paie et dsn cabinet comptable` | comprendre la chaîne sociale complète, du contrôle avant dépôt au retour et au suivi |
| H-G | Hub `gestion-pieces-comptables` | `gestion des pièces comptables` | comprendre la chaîne de la pièce attendue à l’écriture proposée et vérifiée |
| A-B | `controler-les-bulletins-de-paie-avant-la-dsn` | `contrôle bulletin de paie` | exécuter les contrôles avant la DSN |
| A-C | `comprendre-les-comptes-rendus-metier-dsn` | `crm dsn` | lire et qualifier un compte rendu métier DSN |
| A-T | `suivre-la-production-sociale-dans-excel` | `tableau de bord paie excel` | structurer le suivi de production sociale |
| A-S | `automatiser-la-saisie-comptable-ce-qui-reste-a-verifier` | `automatisation saisie comptable` | distinguer extraction, contrôles et anomalies de saisie |
| A-R | `automatiser-la-relance-des-pieces-clients` | `relance pièces manquantes cabinet comptable` | organiser la collecte et l’arrêt des relances |
| A-M | `automatiser-un-cabinet-comptable-la-carte-des-taches` | `automatisation cabinet comptable` | cartographier transversalement les tâches du cabinet |
| A-E | `pourquoi-les-cabinets-comptables-n-adoptent-pas-les-nouveaux-outils` | `pourquoi les cabinets comptables n’adoptent pas les nouveaux outils` | comprendre un échec d’adoption et sa leçon de cadrage |

## Analyse de chaque paire

Heuristique : `Moyenne` = proximité sémantique de cibles primaires, à différencier ; `Faible` = vocabulaire secondaire partagé ou intention distincte, à relier ou simplement surveiller. Aucun match exact ou stem-match des requêtes primaires n’a été trouvé : aucune paire n’est critique ou haute en mode local.

| Paire | Mots-clés et intention partagés | Sévérité | Recommandation | Verdict |
|---|---|---:|---|---|
| H-P ↔ H-G | cabinet, gestion ; deux chaînes métier différentes | Faible | NO ACTION, liens seulement si le contexte l’exige | Pas de risque hub/hub |
| H-P ↔ A-B | paie, DSN, contrôle ; vue d’ensemble contre geste avant dépôt | Moyenne | DIFFERENTIATE : H-P garde `paie et dsn cabinet comptable`, A-B garde `contrôle bulletin de paie` | Risque maîtrisé ; ne jamais cibler `contrôle bulletin de paie` sur H-P |
| H-P ↔ A-C | DSN, retour métier ; chaîne complète contre lecture du CRM | Moyenne | DIFFERENTIATE et lien bidirectionnel | Risque maîtrisé par l’intention |
| H-P ↔ A-T | paie, production sociale, suivi ; chaîne complète contre tableau de bord | Moyenne | DIFFERENTIATE et lien bidirectionnel | Risque maîtrisé par le support et le geste |
| H-P ↔ A-S | cabinet, automatisation ; domaine social contre saisie comptable | Faible | NO ACTION | Aucun risque utile |
| H-P ↔ A-R | cabinet, cycle de production ; social contre collecte de pièces | Faible | NO ACTION | Aucun risque utile |
| H-P ↔ A-M | cabinet, automatisation, paie ; hub d’un domaine contre carte transversale | Moyenne | DIFFERENTIATE ; conserver A-M hors rubrique et comme référence transversale | Pas de fusion ; intentions différentes |
| H-P ↔ A-E | cabinet, outil ; méthode sociale contre adoption | Faible | NO ACTION | Aucun risque utile |
| H-G ↔ A-B | gestion, contrôle ; pièces comptables contre bulletin | Faible | NO ACTION | Aucun risque utile |
| H-G ↔ A-C | gestion, contrôle ; pièce contre retour DSN | Faible | NO ACTION | Aucun risque utile |
| H-G ↔ A-T | gestion, tableau ; pièces contre production sociale | Faible | NO ACTION | Aucun risque utile |
| H-G ↔ A-S | pièces, saisie, écritures, contrôle ; chaîne complète contre saisie automatisée | Moyenne | DIFFERENTIATE : H-G garde `gestion des pièces comptables`, A-S garde `automatisation saisie comptable` | Risque maîtrisé ; H-G ne reprend pas la primaire de A-S |
| H-G ↔ A-R | pièces, complétude, client ; chaîne complète contre relance des manquants | Moyenne | DIFFERENTIATE et lien bidirectionnel | Risque maîtrisé par l’étape du flux |
| H-G ↔ A-M | cabinet, pièces, automatisation ; hub métier contre carte transversale | Moyenne | DIFFERENTIATE ; conserver A-M hors rubrique | Pas de fusion ; A-M reste la référence générale |
| H-G ↔ A-E | cabinet, outil ; chaîne des pièces contre adoption | Faible | NO ACTION | Aucun risque utile |
| A-B ↔ A-C | DSN, contrôle, anomalie ; avant dépôt contre retour après dépôt | Moyenne | DIFFERENTIATE et interlier dans l’ordre du cycle | Intentions complémentaires, pas concurrentes |
| A-B ↔ A-T | paie, contrôle, portefeuille ; vérification contre pilotage | Faible | NO ACTION, interlien contextuel | Pas de cannibalisation |
| A-B ↔ A-S | contrôle, anomalie ; paie contre saisie comptable | Faible | NO ACTION | Pas de cannibalisation |
| A-B ↔ A-R | cabinet, contrôle ; paie contre collecte de pièces | Faible | NO ACTION | Pas de cannibalisation |
| A-B ↔ A-M | cabinet, automatisation, paie ; geste précis contre carte générale | Moyenne | DIFFERENTIATE ; A-M reste transversal | Pas de fusion |
| A-B ↔ A-E | cabinet, outil ; méthode de contrôle contre récit d’adoption | Faible | NO ACTION | Pas de cannibalisation |
| A-C ↔ A-T | DSN, social, suivi ; qualifier un retour contre piloter un portefeuille | Faible | NO ACTION, interlien contextuel | Pas de cannibalisation |
| A-C ↔ A-S | anomalie, contrôle ; social contre comptable | Faible | NO ACTION | Pas de cannibalisation |
| A-C ↔ A-R | cabinet, retour, action ; DSN contre pièces | Faible | NO ACTION | Pas de cannibalisation |
| A-C ↔ A-M | cabinet, automatisation, DSN ; geste précis contre carte générale | Moyenne | DIFFERENTIATE ; A-M reste transversal | Pas de fusion |
| A-C ↔ A-E | cabinet, outil ; lecture métier contre adoption | Faible | NO ACTION | Pas de cannibalisation |
| A-T ↔ A-S | tableau, contrôle, état ; production sociale contre saisie | Faible | NO ACTION | Pas de cannibalisation |
| A-T ↔ A-R | suivi, état, dossier ; production sociale contre complétude des pièces | Faible | NO ACTION | Pas de cannibalisation |
| A-T ↔ A-M | cabinet, automatisation, suivi ; geste précis contre carte générale | Moyenne | DIFFERENTIATE ; A-M reste transversal | Pas de fusion |
| A-T ↔ A-E | cabinet, outil ; tableau de suivi contre adoption | Faible | NO ACTION | Pas de cannibalisation |
| A-S ↔ A-R | pièces, client, contrôle ; traiter une pièce reçue contre obtenir la pièce absente | Moyenne | DIFFERENTIATE et relier dans l’ordre du flux | Intentions complémentaires, pas concurrentes |
| A-S ↔ A-M | cabinet, automatisation, saisie ; geste précis contre carte générale | Moyenne | DIFFERENTIATE ; A-M reste transversal | Pas de fusion |
| A-S ↔ A-E | outil, automatisation ; saisie contre adoption | Faible | NO ACTION | Pas de cannibalisation |
| A-R ↔ A-M | cabinet, automatisation, pièces ; geste précis contre carte générale | Moyenne | DIFFERENTIATE ; A-M reste transversal | Pas de fusion |
| A-R ↔ A-E | cabinet, outil ; relance contre adoption | Faible | NO ACTION | Pas de cannibalisation |
| A-M ↔ A-E | cabinet, automatisation/outils ; carte des tâches contre cause d’un échec d’adoption | Moyenne | DIFFERENTIATE ; A-E reste une Cicatrice hors rubrique | Proximité lexicale, intentions distinctes |

## Verdict

- Verdict général : **PASS local**. Les deux H1 de hub créent deux intentions de synthèse distinctes sans reprendre les requêtes primaires des articles.
- Hub Paie/DSN : risque `Moyen` avec ses trois articles, résolu par une primaire de cycle (`paie et dsn cabinet comptable`) et par des descriptions de gestes distinctes. Il ne vise pas `contrôle bulletin de paie`.
- Hub Saisie/Pièces : risque `Moyen` avec ses deux articles, résolu par la primaire de chaîne (`gestion des pièces comptables`). Il ne vise pas `automatisation saisie comptable`.
- Article transversal A-M : hors rubrique parce qu’il couvre le cabinet entier ; le rattacher réduirait son intention et créerait un hub implicite concurrent.
- Cicatrice A-E : hors rubrique parce qu’elle répond à une question d’adoption et de cadrage, pas à une famille de tâches.
- Action : publier les deux hubs avec les cinq liens bidirectionnels prévus, puis surveiller Search Console ; requalifier en `High` seulement si des URL différentes commencent à se classer sur une même requête.
