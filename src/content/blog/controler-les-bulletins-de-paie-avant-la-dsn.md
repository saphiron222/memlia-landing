---
titre: "Comment contrôler les bulletins de paie avant la DSN ?"
titreOnglet: "Contrôler les bulletins avant la DSN : méthode | Memlia"
resume: "Clôturez trois revues sur le fichier exact à transmettre : pièces et variables, écarts du bulletin, puis contrôle technique DSN. Chaque signalement doit être expliqué, corrigé ou confié à une personne désignée."
description: "Méthode en trois revues pour contrôler variables, bulletins et fichier DSN, qualifier les écarts et conserver les preuves avant le dépôt."
datePublication: 2026-09-09
dateMiseAJour: 2026-09-15
auteur: kevin
sujets: [paie, dsn, cabinet, methode]
motsCles: ["contrôler bulletin de paie avant DSN", "contrôle DSN", "DSN-Val", "compte rendu métier", "checklist paie"]
brouillon: false
image: img-23-controle-bulletins-paie
pipelineVersion: 1
primaryQuery: "contrôler bulletin de paie avant DSN"
secondaryQueries: ["comment contrôler la DSN", "contrôle des bulletins de paie", "checklist paie avant DSN", "compte rendu métier DSN"]
intent: executer
fanOut: ["préparer les pièces et variables", "qualifier les écarts du bulletin", "tester le fichier avec Dsn-Val", "traiter les comptes rendus métier"]
cluster: paie-social
rolePrincipal: paie-responsables-sociaux
rolesSecondaires: [direction-associes]
tache: "Exécuter et clôturer une revue reproductible des bulletins et du fichier DSN avant le dépôt, puis organiser le traitement des retours."
preuveRole:
  niveau: hypothese
  source: "preuves/role.json"
  date: 2026-09-13
funnel: TOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Chaque affirmation paie ou DSN est soit rattachée à une source officielle relue le 15 septembre 2026, soit présentée comme une méthode interne à adapter par le cabinet. Le contenu est publié sans attestation métier indépendante."
reviewRule: "Revue éditoriale et fact-check réalisés ; publication déclarée non attestée par un professionnel de la paie ou du social."
reviewer: marketing
sourcesVerifieesLe: 2026-09-15
cta:
  label: "Identifier une tâche à automatiser"
  destination: "https://cal.com/kevin-svg/decouvrir-memlia"
  outcome: "Memlia peut traduire la règle de contrôle du cabinet en automatisation dans ses outils existants, puis l’éprouver sur des cas fictifs. L’automatisation prépare les écarts ; elle ne valide pas juridiquement la paie, ne corrige pas le dossier et ne dépose aucune DSN."
imageOg: "/images/img-23-controle-bulletins-paie-og.webp"
imageAlt: "Trois contrôles successifs : pièces de paie, comparaison mensuelle et validation du fichier DSN."
statutEditorial: publie-non-atteste
sources:
  - { editeur: "Service Public Entreprendre", titre: "Déclaration sociale nominative (DSN)", url: "https://entreprendre.service-public.gouv.fr/vosdroits/F34059", consulte: 2026-09-15 }
  - { editeur: "Net-entreprises", titre: "Outils d’auto-contrôle Dsn-Val et brique de contrôle", url: "https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/", consulte: 2026-09-15 }
  - { editeur: "Net-entreprises", titre: "Les Comptes Rendus Métiers DSN", url: "https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/", consulte: 2026-09-15 }
  - { editeur: "Net-entreprises", titre: "La fiabilisation des données de la DSN", url: "https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/", consulte: 2026-09-15 }
---

Contrôler les bulletins avant la DSN consiste à fermer trois revues sur le fichier exact qui sera transmis : les pièces et variables, les écarts du bulletin, puis le contrôle technique DSN. Le dossier n'est pas prêt tant qu'un écart reste inexpliqué, qu'une correction n'a pas été retestée ou que la preuve conservée ne correspond plus au fichier final.

Ce guide couvre la préparation avant dépôt et l'organisation des retours après dépôt. Il s'adresse aux gestionnaires de paie et responsables de pôle social. Il ne remplace ni l'analyse du dossier, ni les consignes de l'éditeur ou de l'organisme, ni une validation juridique. Les règles, responsables et seuils proposés doivent être adaptés par le cabinet.

> **Contenu non attesté.** Ce guide a fait l’objet d’un fact-check sur les sources citées, relues le 15 septembre 2026, mais pas d’une attestation indépendante par un professionnel de la paie ou du social. Vérifiez les règles applicables à chaque dossier avant toute décision ou transmission.

> **En bref**
> - Fermez d'abord la revue des pièces et variables, puis celle des écarts du bulletin.
> - Testez ensuite le fichier exact destiné au dépôt avec Dsn-Val.
> - Après chaque correction, régénérez le fichier et rejouez les contrôles touchés.
> - Ne clôturez qu'avec un résultat, une preuve et une décision rattachés au dernier fichier.

## Quel résultat faut-il obtenir avant le dépôt ?

Le résultat attendu n'est pas une case « OK ». Il faut pouvoir identifier le fichier testé, les contrôles joués, les écarts détectés, la qualification retenue et la personne qui autorise le dépôt.

D'après [Service Public Entreprendre](https://entreprendre.service-public.gouv.fr/vosdroits/F34059), « la DSN est une déclaration en ligne réalisée tous les mois à partir des données liées à la paie » et « un logiciel de paie compatible avec la DSN est nécessaire ». Cette dépendance donne l'ordre de travail : contrôler les entrées et le calcul avant de conclure sur le fichier de déclaration.

> **Méthode Memlia, pas exigence réglementaire.** Les trois revues, les six champs de trace et les états fermés décrits ci-dessous forment une convention de travail proposée au cabinet. Ils ne constituent pas une liste légale universelle.

Pour chaque période, commencez par fixer :

- le dossier et la période concernés ;
- l'échéance applicable à l'entreprise, vérifiée dans la source ou l'outil officiel utilisé par le cabinet ;
- la personne qui prépare, celle qui tranche les exceptions et celle qui autorise le dépôt ;
- l'identifiant ou l'empreinte du fichier qui passera le dernier contrôle.

Une échéance ne doit pas être déduite d'un ancien tableau. Si elle n'est pas confirmée pour le dossier et la période, le workflow reste bloqué.

## Revue 1 : rapprocher les pièces, événements et variables

La première revue vérifie que ce qui devait alimenter la paie est identifiable et rattaché à la bonne période. Elle ne juge pas, à elle seule, la validité juridique d'une pièce.

| Élément de la revue | Règle de travail |
| --- | --- |
| Responsable | Gestionnaire du dossier ; arbitrage confié au responsable social selon la règle du cabinet |
| Moment | Avant le calcul déclaré définitif et avant la génération du fichier DSN à tester |
| Sources de référence | Pièces et instructions présentes dans le système autorisé, paramétrage du dossier et règle écrite du cabinet |
| Critère de blocage | Pièce absente, instruction contradictoire, période incertaine ou événement sans traitement décidé |
| Preuve attendue | Référence de la pièce ou de l'instruction, période, date de contrôle et résultat |
| Clôture | Chaque événement attendu est saisi, explicitement différé ou confié à une personne désignée |

Le périmètre dépend du dossier. La checklist doit toutefois obliger le gestionnaire à se prononcer sur les rubriques sensibles qui lui sont applicables, sans présumer de leur traitement :

| Zone à examiner si elle concerne le dossier | Question de contrôle | Sortie attendue |
| --- | --- | --- |
| Entrée ou sortie | L'événement, sa date d'effet et la pièce de référence concordent-ils ? | Rapproché, à corriger ou à arbitrer |
| Absence | La nature, la période et le justificatif disponible sont-ils cohérents ? | Variable tracée ou exception ouverte |
| IJSS et maintien | Les éléments disponibles et le paramétrage attendu concordent-ils ? | Contrôle documenté, sans conclure au droit par automatisme |
| Prévoyance et mutuelle | L'affiliation, la période et le paramétrage attendu ont-ils été revus ? | Écart expliqué ou transmis au responsable |
| Temps, prime ou indemnité | La source convenue, la période et la rubrique visée sont-elles identifiées ? | Saisie vérifiée ou anomalie ouverte |
| Prélèvement à la source | La donnée utilisée provient-elle du flux ou du processus de référence du dossier ? | Origine et période tracées |
| Régularisation | La période d'afférence, le motif et la décision sont-ils documentés ? | Traitement explicite, puis contrôle rejoué |

Cette table ne fixe aucun calcul. Elle empêche seulement qu'une rubrique applicable disparaisse du périmètre sans décision.

## Revue 2 : examiner le bulletin et qualifier les écarts

La deuxième revue cherche les variations qui nécessitent une explication. Un écart n'est pas une erreur : il devient soit attendu et prouvé, soit à corriger, soit à arbitrer.

| Élément de la revue | Règle de travail |
| --- | --- |
| Responsable | Gestionnaire ; responsable social pour les cas hors règle écrite |
| Moment | Après calcul, avant génération du fichier final à transmettre |
| Sources de référence | Bulletin courant, période de comparaison pertinente, pièces rapprochées et paramètres de référence du dossier |
| Critère de blocage | Variation sensible sans cause retrouvée, rubrique attendue absente, rubrique nouvelle inexpliquée ou correction non recalculée |
| Preuve attendue | Rubrique concernée, valeur ou état observé, cause, pièce ou règle consultée et décision |
| Clôture | Tous les écarts sont expliqués, corrigés puis retestés, ou confiés à un décideur identifié |

Examinez au minimum les zones applicables au dossier : présence des rubriques attendues, brut et net, bases, plafonds et taux, temps et absences, IJSS et maintien, prévoyance, mutuelle, prélèvement à la source, régularisations, entrées et sorties. Le contrôle ne doit pas décréter qu'un taux ou un plafond est correct à partir d'une valeur mémorisée. Il doit le comparer à la référence datée choisie par le cabinet.

La séquence de qualification reste courte :

1. détecter la variation ;
2. retrouver l'événement, la pièce ou la règle qui peut l'expliquer ;
3. choisir `expliqué`, `à corriger` ou `à arbitrer` ;
4. corriger dans l'outil de paie si la personne habilitée le décide ;
5. recalculer, régénérer le fichier et rejouer les contrôles touchés.

<!-- [UNIQUE INSIGHT] -->

### Exemple fictif : une variation de brut expliquée

> **Jeu d'essai fictif, sans donnée client et sans règle de paie réelle.** Le dossier `D-014`, période `2026-08`, comporte une prime ponctuelle de `250 unités fictives`. Le contrôle signale une variation du brut. Si la pièce fictive `P-014-08` est présente et cohérente avec la période, le gestionnaire peut retenir `expliqué`. Si elle manque, l'état devient `à arbitrer`. Si elle contredit la saisie, l'état devient `à corriger`.

La recette de cette règle comporte trois cas : pièce cohérente, pièce absente, pièce contradictoire. Son but est de vérifier le comportement du contrôle, pas de certifier un bulletin.

## Revue 3 : tester le fichier exact avec Dsn-Val

[Net-entreprises](https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/) précise que « l'outil de contrôle Dsn-Val permet de tester votre fichier DSN avant de le déposer » et que « les contrôles effectués portent sur le cahier technique et le journal de maintenance de la norme (JMN) associé ». Dsn-Val est donc un outil d'auto-contrôle du fichier, pas une validation des pièces ou des décisions de paie.

| Élément de la revue | Règle de travail |
| --- | --- |
| Responsable | Gestionnaire ou personne chargée du dépôt, selon l'organisation du cabinet |
| Moment | Après les corrections de paie, sur le fichier exact destiné à la transmission |
| Source de référence | Version de Dsn-Val et documentation technique applicables au fichier |
| Critère de blocage | Anomalie bloquante, résultat rattaché à un ancien fichier ou version de contrôle non identifiée |
| Preuve attendue | Identifiant du fichier, version ou date de l'outil, résultat, anomalies et date du test |
| Clôture | Le fichier final a été testé et chaque anomalie remontée a une action décidée |

Un résultat technique sans anomalie bloquante connue ne prouve pas qu'une absence a été saisie, qu'un maintien est correct ou qu'une régularisation a été décidée sur la bonne période. Si une correction modifie la paie ou le fichier, l'ancien résultat ne couvre plus le candidat : régénérez et retestez.

## Après le dépôt : transformer chaque CRM en action

Le dépôt ouvre une nouvelle phase. [Net-entreprises](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/) définit le Compte Rendu Métier, ou CRM, comme « un rapport permettant à l'organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu'une erreur ou suspicion d'erreur est détectée ». La même page précise qu'« il est essentiel pour les déclarants de traiter des anomalies mises en évidence dans les CRM » afin d'effectuer les corrections nécessaires si besoin.

<!-- [UNIQUE INSIGHT] -->
Ne confondez pas l'état du workflow avec la gravité du signalement. `Déposé` indique une étape franchie ; il ne signifie ni `sans anomalie`, ni `conforme`. Conservez deux champs séparés.

| Champ CRM | Contenu attendu |
| --- | --- |
| Organisme | Émetteur du retour |
| Période | Période ou déclaration concernée |
| Nature du retour | Anomalie, suspicion, confirmation ou autre qualification portée par le document |
| Action | Comprendre, corriger en paie, régénérer, retransmettre, contester ou classer avec justification |
| Échéance de traitement | Date ou fenêtre indiquée par la source applicable, pas une date supposée |
| Responsable | Personne chargée de décider ou d'exécuter l'action |
| Preuve de clôture | Nouveau test, retransmission, réponse, justificatif ou décision documentée |

La page officielle sur [la fiabilisation des données de la DSN](https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/) distingue les contrôles avant dépôt et la consultation mensuelle des CRM après dépôt. Elle indique qu'une erreur signalée doit être corrigée en paie et que la DSN mensuelle peut être retransmise en « annule et remplace » avant minuit la veille de l'échéance si cela est encore possible. « Le cas échéant, la correction pourra être réalisée dans la DSN du mois suivant. »

Cette indication ne suffit pas à décider tous les cas. L'applicabilité dépend notamment du moment, du type de correction et des instructions du retour ou de l'organisme. Le présent guide traite la DSN mensuelle ; il ne transpose pas cette fenêtre aux signalements d'événement ou à d'autres canaux. En cas d'incertitude, gardez l'état bloquant et consultez la documentation ou l'interlocuteur officiel adapté.

## Comment traiter un écart inexpliqué ?

Un écart inexpliqué ne doit être ni ignoré ni corrigé automatiquement.

1. Passez l'état du contrôle à `à arbitrer`.
2. Identifiez la règle qui a déclenché le signalement et la donnée observée.
3. Recherchez la pièce, l'événement ou la référence datée susceptible de l'expliquer.
4. Attribuez l'arbitrage à une personne nommée dans le workflow du cabinet.
5. Après décision, conservez la justification, corrigez si nécessaire, puis rejouez les contrôles affectés.
6. Fermez seulement lorsque la preuve correspond au dernier fichier testé.

La gravité reste un champ distinct, par exemple `information`, `à traiter avant dépôt` ou `bloquant selon la règle du cabinet`. Ces libellés sont des choix internes, pas des catégories réglementaires.

## Quelle trace conserver dans le portefeuille ?

La méthode Memlia propose six champs minimum : dossier, période, revue, résultat, preuve et décision. Ajoutez le responsable et l'horodatage si le circuit du cabinet en a besoin.

| Champ | Exemple fictif | Utilité |
| --- | --- | --- |
| Dossier | `D-014` | Relier le contrôle sans afficher de nom dans la vue agrégée |
| Période | `2026-08` | Empêcher la réutilisation d'une preuve d'un autre mois |
| Revue | `bulletin-écarts` | Identifier la couche contrôlée |
| Résultat | `à arbitrer` | Distinguer le signalement de la décision |
| Preuve | `P-014-08` | Retrouver l'élément dans le système autorisé |
| Décision | `expliqué après revue` | Fermer explicitement l'écart |

Le responsable de pôle peut ensuite suivre des volumes par état, sans classement nominatif. La structure d'une telle vue est détaillée dans [le tableau de suivi de production sociale dans Excel](/blog/suivre-la-production-sociale-dans-excel).

## Ce qui peut être automatisé, et ce qui doit rester décidé

Une automatisation peut rapprocher des listes, comparer des périodes, appliquer une règle écrite, signaler une preuve absente et préparer une file d'exceptions. Elle doit montrer pourquoi un contrôle s'est déclenché et s'arrêter quand la règle ne permet pas de conclure.

Le cabinet reste responsable de la qualification, de la correction dans l'outil de paie, du choix du canal et du moment de régularisation, puis du dépôt. Les [outils existants restent le point de départ](/#integration) et les [garanties du service](/#garanties) excluent l'envoi silencieux.

Memlia peut coder la règle du cabinet, l'éprouver sur des cas fictifs puis l'intégrer à son environnement Excel. Le service ne fournit pas une validation juridique, ne corrige pas seul la paie et ne dépose pas la DSN. Le livrable utile est une mécanique de contrôle explicable que l'équipe valide.

## Les erreurs de méthode à éviter

**Commencer par Dsn-Val.** Le format est testé avant les données qui l'alimentent.

**Utiliser un seuil comme verdict.** Une variation dépasse un repère interne, mais sa cause reste à qualifier.

**Mélanger état et gravité.** `Déposé` décrit l'avancement, pas la conformité.

**Corriger sans régénérer et retester.** La preuve ne correspond plus au fichier final.

**Appliquer automatiquement « annule et remplace ».** Il faut d'abord vérifier que la fenêtre et le cas le permettent.

**Clore au dépôt.** Les CRM disponibles doivent encore être lus, attribués et traités.

**Conserver seulement « OK ».** Personne ne peut savoir ce qui a été vérifié, sur quelle période et avec quelle preuve.

## Questions fréquentes

### Dsn-Val suffit-il pour contrôler une DSN ?

Non. Dsn-Val contrôle le fichier au regard du cahier technique et du journal de maintenance de la norme associée. Les pièces, les variables, les écarts du bulletin et les décisions du dossier appartiennent à des revues distinctes.

### Faut-il vérifier chaque ligne du bulletin ?

Le cabinet définit le périmètre à partir des zones sensibles du dossier, des événements du mois, des rubriques attendues et des écarts par rapport à une période pertinente. Une checklist générique ne remplace pas cette règle documentée.

### Que faire si une correction intervient après le premier test ?

Recalculez si nécessaire, régénérez le fichier et rejouez les contrôles affectés. Conservez la preuve du dernier candidat, pas celle d'une version devenue obsolète.

### Jusqu'à quand utiliser une DSN « annule et remplace » ?

Pour la DSN mensuelle, la source Net-entreprises consultée le 15 septembre 2026 indique une retransmission avant minuit la veille de l'échéance si cela est encore possible. Le type de correction, le canal et les instructions de l'organisme doivent être vérifiés pour le cas traité. Ce guide ne généralise pas cette fenêtre aux signalements d'événement.

### Quand le contrôle est-il terminé ?

Avant dépôt, lorsque les trois revues sont closes sur le fichier exact à transmettre. Après dépôt, lorsque chaque CRM disponible a été lu et qu'une action, une échéance, un responsable et une preuve de clôture ont été renseignés.

## Checklist finale de clôture

| Étape | Contrôle | Preuve | Exception | Décision |
| --- | --- | --- | --- | --- |
| Préparer | Dossier, période, échéance et responsables identifiés | Référence datée | Échéance ou rôle incertain | Bloquer et faire préciser |
| Revue 1 | Pièces, événements et variables rapprochés | Pièce ou instruction | Absence ou contradiction | Saisir, différer ou arbitrer |
| Revue 2 | Rubriques applicables et écarts qualifiés | Cause, référence et recalcul | Écart inexpliqué | Corriger ou confier au responsable |
| Revue 3 | Fichier final testé avec l'outil applicable | Identifiant du fichier et résultat | Anomalie ou ancien résultat | Corriger, régénérer et retester |
| Après dépôt | CRM lus et attribués | Retour, action et échéance | Canal ou correction incertain | Consulter l'organisme ou l'éditeur |
| Fermer | Preuves alignées sur le dernier fichier | Trace complète | Champ manquant | Garder le dossier ouvert |

Cette séquence rend le contrôle rejouable : la mécanique détecte et rassemble ; la personne qualifie, décide et autorise le dépôt.
