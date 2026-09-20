---
titre: "Comment contrôler les bulletins de paie avant la DSN ?"
titreOnglet: "Contrôle bulletin de paie en cabinet : avant la DSN | Memlia"
resume: "Trois revues à clore sur le fichier exact qui sera transmis : pièces et variables, écarts du bulletin, contrôle technique du fichier. Chaque écart est expliqué, corrigé puis retesté, ou confié à une personne désignée, et la trace se rattache au dernier fichier. Rien ne part sans validation."
description: "Contrôle bulletin de paie : trois revues pour vérifier variables, bulletins et fichier DSN, traiter les écarts et garder les preuves."
datePublication: 2026-09-09
dateMiseAJour: 2026-09-17
auteur: kevin
sujets: [paie, dsn, cabinet, methode]
motsCles: ["contrôler bulletin de paie avant DSN", "contrôle DSN", "DSN-Val", "compte rendu métier", "checklist paie"]
brouillon: false
image: img-23-controle-bulletins-paie
pipelineVersion: 1
primaryQuery: "contrôle bulletin de paie"
secondaryQueries: ["comment contrôler la DSN", "contrôle des bulletins de paie", "checklist paie avant DSN", "compte rendu métier DSN", "contrôler bulletin de paie avant DSN", "vérifier bulletin de paie"]
intent: executer
fanOut: ["préparer les pièces et variables", "qualifier les écarts du bulletin", "tester le fichier avec Dsn-Val", "traiter les comptes rendus métier"]
cluster: paie-social
famille: bulletins-controle
rolePrincipal: paie-responsables-sociaux
rolesSecondaires: [direction-associes]
tache: "Exécuter et clôturer une revue reproductible des bulletins et du fichier DSN avant le dépôt, puis organiser le traitement des retours."
preuveRole:
  niveau: hypothese
  source: "preuves/role.json"
  date: 2026-09-18
funnel: TOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Trois revues décrites avec leur responsable, leur moment, leur critère de blocage et leur preuve ; jeu fictif à trois cas (pièce cohérente, absente, contradictoire) ; tableau à trois colonnes de la frontière ; huit affirmations DSN et paie citées mot pour mot depuis Service-Public et Net-entreprises, ouvertes le jour de la republication."
reviewRule: "Réviser à chaque changement de version de Dsn-Val ou du cahier technique DSN cité par Net-entreprises, et à la publication de l’article sur la collecte des variables de paie ; relecture des sources à six mois."
reviewer: marketing
sourcesVerifieesLe: 2026-09-18
cta:
  label: "Confier cette tâche"
  destination: "/contact"
  outcome: "Nous écrivons la règle de contrôle de votre cabinet dans vos mots, rubriques sensibles, seuils et responsables compris, nous l’automatisons dans les outils que votre pôle social utilise déjà, et vos gestionnaires la recettent sur des cas fictifs puis sur vos dossiers. La qualification des écarts, la correction et le dépôt restent à vos équipes. Rien à envoyer : décrivez la tâche, nous vous disons ce qu’il faut pour la prendre en charge."
imageOg: "/images/img-23-controle-bulletins-paie-og.webp"
imageAlt: "Trois contrôles successifs : pièces de paie, comparaison mensuelle et validation du fichier DSN."
statutEditorial: publie
sources:
  - editeur: "Service Public"
    titre: "Déclaration sociale nominative (DSN)"
    url: "https://entreprendre.service-public.gouv.fr/vosdroits/F34059"
    consulte: 2026-09-18
  - editeur: "Net-entreprises"
    titre: "Outils d’auto-contrôle Dsn-Val et brique de contrôle"
    url: "https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/"
    consulte: 2026-09-18
  - editeur: "Net-entreprises"
    titre: "Les comptes rendus métiers DSN"
    url: "https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/"
    consulte: 2026-09-18
  - editeur: "Net-entreprises"
    titre: "La fiabilisation des données de la DSN"
    url: "https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/"
    consulte: 2026-09-18
---

## Réponse directe

Contrôler les bulletins de paie avant la DSN, c’est clore trois revues sur le fichier exact qui sera transmis : les pièces et variables, les écarts du bulletin, puis le contrôle technique du fichier. Chaque écart est expliqué, corrigé puis retesté, ou confié à une personne désignée, et aucune preuve ne vaut si elle ne correspond plus au dernier fichier. Ce contrôle a une règle ; la suite l’écrit pour qu’il se rejoue chaque mois de la même façon, quelle que soit la personne qui le tient.

## Qu’est-ce que le contrôle avant dépôt, et pourquoi casse-t-il à la main ?

**Le contrôle avant dépôt** est la revue, pour un dossier et une période, des données qui alimentent la paie, des bulletins calculés et du fichier de déclaration, avant sa transmission. **La déclaration sociale nominative**, ou DSN, est ce fichier mensuel qui porte les données de paie aux organismes. **Un écart** est une variation détectée entre la période et sa référence : il n’est pas une erreur, il devient expliqué, à corriger ou à arbitrer.

[Service-Public Entreprendre](https://entreprendre.service-public.gouv.fr/vosdroits/F34059) rappelle que la DSN « est une déclaration en ligne réalisée tous les mois à partir des données liées à la paie » et qu’« un logiciel de paie compatible avec la DSN est nécessaire ». Cette dépendance donne l’ordre du travail : contrôler les entrées et le calcul avant de conclure sur le fichier de déclaration.

À la main, ce contrôle casse pour une raison précise. Le gestionnaire sait quelles rubriques regarder sur ce dossier, quel écart est normal en août, quelle prime revient chaque trimestre, quelle absence attend encore son justificatif. Cette règle n’est écrite nulle part : elle se rejoue de mémoire, sous la pression de l’échéance, et elle part avec la personne qui la détient. Le résultat n’est pas un bulletin faux à chaque fois ; c’est un contrôle inégal, qu’on ne peut ni prouver ni transmettre à un collègue. La méthode ci-dessous, une méthode Memlia, écrit cette règle en trois revues et une trace, pour qu’elle appartienne au cabinet.

## Que faut-il avoir sous la main avant de commencer ?

- Le dossier et la période concernés, avec l’échéance applicable à l’entreprise, vérifiée dans la source ou l’outil que le cabinet utilise pour cela.
- Les pièces et instructions du mois telles qu’elles arrivent aujourd’hui : entrées et sorties, absences, variables, régularisations.
- La personne qui prépare, celle qui tranche les exceptions et celle qui autorise le dépôt, nommées pour ce dossier.
- L’identifiant ou l’empreinte du fichier qui passera le dernier contrôle : c’est à lui que toute preuve se rattache.
- Un endroit où tenir la trace, même sommaire : une ligne par dossier, par période et par revue suffit pour commencer.

Une échéance ne se déduit pas d’un ancien tableau. Tant qu’elle n’est pas confirmée pour le dossier et la période, le contrôle reste ouvert et rien ne part.

## Quel résultat obtenir avant le dépôt ?

Le résultat attendu n’est pas une case « OK ». C’est de pouvoir dire, pour ce dossier et cette période, quel fichier a été testé, quels contrôles ont été joués, quels écarts ont été détectés, quelle qualification chacun a reçue, et qui a autorisé le dépôt. Les trois revues, les six champs de trace et les états fermés qui suivent sont une convention de travail : le cabinet en fixe les seuils, les responsables et les rubriques sensibles.

## Revue 1 : rapprocher les pièces, événements et variables

La première revue vérifie que ce qui devait alimenter la paie est identifiable et rattaché à la bonne période. Elle ne juge pas la validité d’une pièce ; elle constate qu’elle est là, lisible, et qu’elle appartient au bon mois.

| Élément de la revue | Règle de travail |
| --- | --- |
| Responsable | Gestionnaire du dossier ; arbitrage confié au responsable social selon la règle du cabinet |
| Moment | Avant le calcul déclaré définitif et avant la génération du fichier DSN à tester |
| Sources de référence | Pièces et instructions présentes dans le système autorisé, paramétrage du dossier et règle écrite du cabinet |
| Critère de blocage | Pièce absente, instruction contradictoire, période incertaine ou événement sans traitement décidé |
| Preuve attendue | Référence de la pièce ou de l’instruction, période, date de contrôle et résultat |
| Clôture | Chaque événement attendu est saisi, explicitement différé ou confié à une personne désignée |

Le périmètre dépend du dossier. La checklist oblige toutefois le gestionnaire à se prononcer sur les rubriques sensibles qui lui sont applicables, sans présumer de leur traitement :

| Zone à examiner si elle concerne le dossier | Question de contrôle | Sortie attendue |
| --- | --- | --- |
| Entrée ou sortie | L’événement, sa date d’effet et la pièce de référence concordent-ils ? | Rapproché, à corriger ou à arbitrer |
| Absence | La nature, la période et le justificatif disponible sont-ils cohérents ? | Variable tracée ou exception ouverte |
| IJSS et maintien | Les éléments disponibles et le paramétrage attendu concordent-ils ? | Contrôle documenté, sans conclure au droit par automatisme |
| Prévoyance et mutuelle | L’affiliation, la période et le paramétrage attendu ont-ils été revus ? | Écart expliqué ou transmis au responsable |
| Temps, prime ou indemnité | La source convenue, la période et la rubrique visée sont-elles identifiées ? | Saisie vérifiée ou anomalie ouverte |
| Prélèvement à la source | La donnée utilisée provient-elle du flux ou du processus de référence du dossier ? | Origine et période tracées |
| Régularisation | La période d’afférence, le motif et la décision sont-ils documentés ? | Traitement explicite, puis contrôle rejoué |

Cette table ne fixe aucun calcul. Elle empêche seulement qu’une rubrique applicable disparaisse du périmètre sans décision.

## Revue 2 : examiner le bulletin et qualifier les écarts

La deuxième revue cherche les variations qui appellent une explication. Un écart n’est pas une erreur : il devient soit attendu et prouvé, soit à corriger, soit à arbitrer.

| Élément de la revue | Règle de travail |
| --- | --- |
| Responsable | Gestionnaire ; responsable social pour les cas hors règle écrite |
| Moment | Après calcul, avant génération du fichier final à transmettre |
| Sources de référence | Bulletin courant, période de comparaison pertinente, pièces rapprochées et paramètres de référence du dossier |
| Critère de blocage | Variation sensible sans cause retrouvée, rubrique attendue absente, rubrique nouvelle inexpliquée ou correction non recalculée |
| Preuve attendue | Rubrique concernée, valeur ou état observé, cause, pièce ou règle consultée et décision |
| Clôture | Tous les écarts sont expliqués, corrigés puis retestés, ou confiés à un décideur identifié |

Examinez au minimum les zones applicables au dossier : présence des rubriques attendues, brut et net, bases, plafonds et taux, temps et absences, IJSS et maintien, prévoyance, mutuelle, prélèvement à la source, régularisations, entrées et sorties. Le contrôle ne décrète pas qu’un taux ou un plafond est correct à partir d’une valeur mémorisée : il le compare à la référence datée que le cabinet a choisie.

La séquence de qualification reste courte :

1. détecter la variation ;
2. retrouver l’événement, la pièce ou la règle qui peut l’expliquer ;
3. choisir `expliqué`, `à corriger` ou `à arbitrer` ;
4. corriger dans l’outil de paie si la personne habilitée le décide ;
5. recalculer, régénérer le fichier et rejouer les contrôles touchés.

### Exemple fictif : une variation de brut expliquée

> **Jeu d’essai fictif, sans donnée client et sans règle de paie réelle.** Le dossier `D-014`, période `2026-08`, comporte une prime ponctuelle de `250 unités fictives`. Le contrôle signale une variation du brut. Si la pièce fictive `P-014-08` est présente et cohérente avec la période, le gestionnaire retient `expliqué`. Si elle manque, l’état devient `à arbitrer`. Si elle contredit la saisie, l’état devient `à corriger`.

La recette de cette règle comporte trois cas : pièce cohérente, pièce absente, pièce contradictoire. Son but est de vérifier le comportement du contrôle, pas de certifier un bulletin.

## Revue 3 : tester le fichier exact avec Dsn-Val

[Net-entreprises](https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/) précise que « l’outil de contrôle Dsn-Val permet de tester votre fichier DSN avant de le déposer » et que « les contrôles effectués portent sur le cahier technique et le journal de maintenance de la norme (JMN) associé ». Dsn-Val est donc un outil d’auto-contrôle du fichier, pas une validation des pièces ni des décisions de paie.

| Élément de la revue | Règle de travail |
| --- | --- |
| Responsable | Gestionnaire ou personne chargée du dépôt, selon l’organisation du cabinet |
| Moment | Après les corrections de paie, sur le fichier exact destiné à la transmission |
| Source de référence | Version de Dsn-Val et documentation technique applicables au fichier |
| Critère de blocage | Anomalie bloquante, résultat rattaché à un ancien fichier ou version de contrôle non identifiée |
| Preuve attendue | Identifiant du fichier, version ou date de l’outil, résultat, anomalies et date du test |
| Clôture | Le fichier final a été testé et chaque anomalie remontée a une action décidée |

Un résultat technique sans anomalie bloquante ne prouve pas qu’une absence a été saisie, qu’un maintien est correct ou qu’une régularisation a été décidée sur la bonne période. Si une correction modifie la paie ou le fichier, l’ancien résultat ne couvre plus le candidat : régénérez et retestez.

<figure data-blog-proof="controle-dsn-val">
  <img src="/proofs/blog/controle-dsn-val.webp" alt="Reconstitution d’un résultat Dsn-Val sur un fichier fictif, avec anomalie bloquante et nouveau test attendu." width="1600" height="900" loading="lazy" decoding="async">
  <figcaption><a href="/proofs/blog/controle-dsn-val.webp" target="_blank" rel="noopener">Ouvrir la preuve en grand</a>. Source : jeu d’essai fictif décrit dans cet article, d’après Net-entreprises (<a href="https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/" rel="noopener">https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/</a>) ; capture du <time datetime="2026-09-20">20 septembre 2026</time>.</figcaption>
</figure>

## Après le dépôt : transformer chaque CRM en action

Cette section ferme la boucle du contrôle avant transmission. Pour distinguer accusé, certificat, bilan et retours des organismes, puis qualifier chaque message, lisez la [méthode de lecture des comptes rendus métier DSN](/blog/comprendre-les-comptes-rendus-metier-dsn).

Le dépôt ouvre une nouvelle phase. [Net-entreprises](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/) définit le compte rendu métier, ou CRM, comme « un rapport permettant à l’organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu’une erreur ou suspicion d’erreur est détectée ». La même page ajoute qu’« il est essentiel pour les déclarants de traiter des anomalies mises en évidence dans les CRM » afin d’effectuer les corrections nécessaires si besoin.

Ne confondez pas l’état du workflow avec la gravité du signalement. `Déposé` indique une étape franchie ; il ne signifie ni `sans anomalie`, ni `conforme`. Conservez deux champs séparés.

| Champ CRM | Contenu attendu |
| --- | --- |
| Organisme | Émetteur du retour |
| Période | Période ou déclaration concernée |
| Nature du retour | Anomalie, suspicion, confirmation ou autre qualification portée par le document |
| Action | Comprendre, corriger en paie, régénérer, retransmettre, contester ou classer avec justification |
| Échéance de traitement | Date ou fenêtre indiquée par la source applicable, pas une date supposée |
| Responsable | Personne chargée de décider ou d’exécuter l’action |
| Preuve de clôture | Nouveau test, retransmission, réponse, justificatif ou décision documentée |

La page officielle sur [la fiabilisation des données de la DSN](https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/) distingue les contrôles avant dépôt et la consultation mensuelle des CRM après dépôt. Elle indique qu’une erreur signalée se corrige en paie, en transmettant une DSN « annule et remplace » « avant minuit la veille de l’échéance si cela est encore possible. Le cas échéant, la correction pourra être réalisée dans la DSN du mois suivant ». En cas d’incompréhension, la même page invite le déclarant à « contacter son organisme pour comprendre le retour métier, et son éditeur pour un accompagnement dans l’usage de son logiciel ».

Cette fenêtre ne suffit pas à décider tous les cas. Son applicabilité dépend du moment, du type de correction et des instructions du retour ou de l’organisme. Le présent guide traite la DSN mensuelle ; il ne transpose pas cette fenêtre aux signalements d’événement ni à d’autres canaux. Dans le doute, gardez l’état bloquant et consultez la documentation ou l’interlocuteur officiel adapté.

<figure data-blog-proof="bulletins-crm">
  <img src="/proofs/blog/bulletins-crm.webp" alt="Retour CRM fictif relié à son dépôt, sa preuve et une décision humaine à arbitrer." width="1600" height="900" loading="lazy" decoding="async">
  <figcaption><a href="/proofs/blog/bulletins-crm.webp" target="_blank" rel="noopener">Ouvrir la preuve en grand</a>. Source : jeu d’essai fictif décrit dans cet article, d’après Net-entreprises (<a href="https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/" rel="noopener">https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/</a>) ; capture du <time datetime="2026-09-20">20 septembre 2026</time>.</figcaption>
</figure>

## Comment traiter un écart inexpliqué ?

Un écart inexpliqué n’est ni ignoré ni corrigé d’office.

1. Passez l’état du contrôle à `à arbitrer`.
2. Identifiez la règle qui a déclenché le signalement et la donnée observée.
3. Recherchez la pièce, l’événement ou la référence datée susceptible de l’expliquer.
4. Attribuez l’arbitrage à une personne nommée dans le workflow du cabinet.
5. Après décision, conservez la justification, corrigez si nécessaire, puis rejouez les contrôles affectés.
6. Fermez seulement lorsque la preuve correspond au dernier fichier testé.

La gravité reste un champ distinct, par exemple `information`, `à traiter avant dépôt` ou `bloquant selon la règle du cabinet`. Ces libellés sont des choix du cabinet, écrits dans sa règle.

## Quelle trace conserver dans le portefeuille ?

Six champs suffisent au départ : dossier, période, revue, résultat, preuve et décision. Ajoutez le responsable et l’horodatage si le circuit du cabinet en a besoin.

| Champ | Exemple fictif | Utilité |
| --- | --- | --- |
| Dossier | `D-014` | Relier le contrôle sans afficher de nom dans la vue agrégée |
| Période | `2026-08` | Empêcher la réutilisation d’une preuve d’un autre mois |
| Revue | `bulletin-écarts` | Identifier la couche contrôlée |
| Résultat | `à arbitrer` | Distinguer le signalement de la décision |
| Preuve | `P-014-08` | Retrouver l’élément dans le système autorisé |
| Décision | `expliqué après revue` | Fermer explicitement l’écart |

Le responsable de pôle suit ensuite des volumes par état, sans classement nominatif. La structure d’une telle vue est détaillée dans [le tableau de suivi de production sociale](/blog/suivre-la-production-sociale-dans-excel).

## Ce qui s’automatise, ce qui attend une validation, ce qui reste humain

| Se prépare seul | Attend une validation | Reste humain |
| --- | --- | --- |
| Le rapprochement des pièces et variables attendues avec celles reçues, dossier par dossier | La qualification de chaque écart signalé sur le bulletin | La correction dans l’outil de paie, et ce qu’elle engage pour un salarié |
| La comparaison du bulletin avec sa période de référence, écarts listés avec leur rubrique | Le passage d’un contrôle à l’état `expliqué` | Le choix du canal et du moment d’une régularisation |
| Le contrôle qu’un résultat Dsn-Val se rattache au dernier fichier, et la file des preuves manquantes | La clôture d’une revue dont tous les écarts ont une décision | L’autorisation du dépôt |

Une automatisation montre pourquoi un contrôle s’est déclenché, et elle cesse quand la règle ne permet pas de conclure : c’est ce refus qui la rend fiable. Le cabinet garde la qualification, la correction, le canal et le dépôt.

## Les erreurs de méthode à éviter

- **Commencer par Dsn-Val.** Le format est testé avant les données qui l’alimentent.
- **Utiliser un seuil comme verdict.** Une variation dépasse un repère interne, mais sa cause reste à qualifier.
- **Mélanger état et gravité.** `Déposé` décrit l’avancement, pas la conformité.
- **Corriger sans régénérer et retester.** La preuve ne correspond plus au fichier final.
- **Appliquer d’office « annule et remplace ».** Il faut d’abord vérifier que la fenêtre et le cas le permettent.
- **Clore au dépôt.** Les CRM disponibles restent à lire, à attribuer et à traiter.
- **Conserver seulement « OK ».** Personne ne peut savoir ce qui a été vérifié, sur quelle période et avec quelle preuve.

## Questions fréquentes

### Dsn-Val suffit-il pour contrôler une DSN ?

Non. Dsn-Val contrôle le fichier au regard du cahier technique et du journal de maintenance de la norme associée. Les pièces, les variables, les écarts du bulletin et les décisions du dossier appartiennent à des revues distinctes.

### Faut-il vérifier chaque ligne du bulletin ?

Le cabinet définit le périmètre à partir des zones sensibles du dossier, des événements du mois, des rubriques attendues et des écarts par rapport à une période pertinente. Cette règle, écrite dans les mots du cabinet, vaut mieux qu’une checklist générique : elle nomme les rubriques qui comptent pour ce dossier.

### Que faire si une correction intervient après le premier test ?

Recalculez si nécessaire, régénérez le fichier et rejouez les contrôles affectés. Conservez la preuve du dernier candidat, pas celle d’une version devenue obsolète.

### Jusqu’à quand utiliser une DSN « annule et remplace » ?

Pour la DSN mensuelle, la page de Net-entreprises consultée le 17 septembre 2026 indique une retransmission avant minuit la veille de l’échéance si cela est encore possible. Le type de correction, le canal et les instructions de l’organisme restent à vérifier pour le cas traité ; ce guide ne généralise pas cette fenêtre aux signalements d’événement.

### Quand le contrôle est-il terminé ?

Avant dépôt, lorsque les trois revues sont closes sur le fichier exact à transmettre. Après dépôt, lorsque chaque CRM disponible a été lu et qu’une action, une échéance, un responsable et une preuve de clôture ont été renseignés.

## Checklist finale de clôture

| Étape | Contrôle | Preuve | Exception | Décision |
| --- | --- | --- | --- | --- |
| Préparer | Dossier, période, échéance et responsables identifiés | Référence datée | Échéance ou rôle incertain | Bloquer et faire préciser |
| Revue 1 | Pièces, événements et variables rapprochés | Pièce ou instruction | Absence ou contradiction | Saisir, différer ou arbitrer |
| Revue 2 | Rubriques applicables et écarts qualifiés | Cause, référence et recalcul | Écart inexpliqué | Corriger ou confier au responsable |
| Revue 3 | Fichier final testé avec l’outil applicable | Identifiant du fichier et résultat | Anomalie ou ancien résultat | Corriger, régénérer et retester |
| Après dépôt | CRM lus et attribués | Retour, action et échéance | Canal ou correction incertain | Consulter l’organisme ou l’éditeur |
| Fermer | Preuves alignées sur le dernier fichier | Trace complète | Champ manquant | Garder le dossier ouvert |

## La règle à retenir

Trois revues closes sur le fichier exact à transmettre, un écart toujours expliqué, corrigé puis retesté ou confié à une personne nommée, et une trace qui se rattache au dernier fichier. La mécanique détecte et rassemble ; la personne qualifie, décide et autorise le dépôt.

## Pour aller plus loin

Ce contrôle est l’une des sept familles du pôle paie et social de [la carte des tâches automatisables d’un cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches). Il commence là où finit [la collecte des pièces](/blog/automatiser-la-relance-des-pieces-clients), dont la relance des variables de paie est la jumelle, et il ouvre sur la lecture des comptes rendus métier après dépôt ; le [contrôle avant DSN](/glossaire#controle-avant-dsn) et [Dsn-Val](/glossaire#dsn-val) sont définis au glossaire. Nous prenons cette tâche entière : nous écrivons la règle de contrôle de votre cabinet dans vos mots, rubriques sensibles, seuils et responsables compris, nous l’automatisons dans les outils que votre pôle social utilise déjà, vos gestionnaires la recettent sur des cas fictifs puis sur vos dossiers, et nous la maintenons. Vous gardez la qualification des écarts, la correction et le dépôt. C’est [la méthode](/methode), et ce sont [nos engagements](/garanties) : rien ne part sans validation.
