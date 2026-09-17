---
titre: "Comprendre les comptes rendus métier DSN : méthode de lecture"
titreOnglet: "CRM DSN : lire le compte rendu et ses anomalies | Memlia"
resume: "Un dépôt accepté ne clôt pas le contrôle. Identifiez le retour, son émetteur, sa période et sa population ; lisez le statut dans sa source, rapprochez la donnée de paie, puis documentez la décision et le contrôle suivant. La mécanique rassemble et rapproche ; votre équipe décide."
description: "Méthode pour distinguer les retours DSN, lire un CRM, qualifier une anomalie et tracer la correction sans confondre dépôt accepté et paie juste."
datePublication: 2026-09-15
dateMiseAJour: 2026-09-17
auteur: kevin
sujets: [dsn, paie, production-sociale, methode]
motsCles: ["comptes rendus métier DSN", "CRM DSN", "bilan d’anomalies DSN", "certificat de conformité DSN", "CRM nominatif"]
brouillon: false
image: img-25-comptes-rendus-metier-dsn
pipelineVersion: 1
primaryQuery: "crm dsn"
secondaryQueries: ["comprendre CRM DSN", "bilan d’anomalies DSN", "certificat de conformité DSN", "CRM nominatif", "comptes rendus métier DSN", "compte rendu métier dsn", "anomalies dsn"]
intent: comprendre
fanOut: ["distinguer AEE ARE CCO BAN", "lire un CRM par organisme", "qualifier une anomalie DSN", "corriger après un retour DSN", "tracer la décision"]
cluster: paie-social
famille: dsn-crm
rolePrincipal: paie-responsables-sociaux
rolesSecondaires: [direction-associes]
tache: "Lire les retours reçus après une DSN, déterminer leur portée et organiser une correction ou un classement justifié."
preuveRole:
  niveau: hypothese
  source: "preuves/role.json"
  date: 2026-09-17
funnel: TOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Tableau des retours (AEE, ARE, CCO, BAN, CRM) avec leur portée officielle et le premier geste ; méthode en six étapes ; jeu fictif à quatre situations ; registre à dix champs ; frontière en trois colonnes ; sept affirmations DSN citées mot pour mot depuis Net-entreprises, ouvertes le jour de la republication."
reviewRule: "Réviser à chaque changement des pages Net-entreprises citées (retours après dépôt, comptes rendus métier, fiabilisation, Dsn-Val) et à chaque nouvelle version de norme DSN ; relecture des sources à six mois."
reviewer: marketing
sourcesVerifieesLe: 2026-09-17
cta:
  label: "Confier cette tâche"
  destination: "/contact"
  outcome: "Nous écrivons la règle de lecture des retours de votre cabinet dans vos mots, organisme par organisme, nous automatisons la collecte des retours et leur rapprochement avec la paie dans les outils que votre pôle social utilise déjà, et vos gestionnaires la recettent sur des cas fictifs puis sur vos dossiers. L’interprétation, la correction et le dépôt restent à vos équipes. Rien à envoyer : décrivez la tâche, nous vous disons ce qu’il faut pour la prendre en charge."
imageOg: "/images/img-25-comptes-rendus-metier-dsn-og.webp"
imageAlt: "Un dépôt franchi, plusieurs retours distincts et une anomalie isolée avant la décision humaine."
statutEditorial: publie
sources:
  - editeur: "Net-entreprises"
    titre: "Les comptes rendus métiers DSN"
    url: "https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/"
    consulte: 2026-09-17
  - editeur: "Net-entreprises"
    titre: "Les retours d’informations suite au dépôt de votre DSN ou signalement d’événement"
    url: "https://www.net-entreprises.fr/declaration/retours-suite-au-depot-dsn-ou-signalement/"
    consulte: 2026-09-17
  - editeur: "Net-entreprises"
    titre: "La fiabilisation des données de la DSN"
    url: "https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/"
    consulte: 2026-09-17
  - editeur: "Net-entreprises"
    titre: "Outils d’auto-contrôle Dsn-Val et brique de contrôle"
    url: "https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/"
    consulte: 2026-09-17
---

## Réponse directe

Un compte rendu métier DSN ne donne pas un verdict général sur toute la paie. Il rapporte le résultat d’un contrôle effectué par un organisme destinataire sur les données qu’il a reçues. Pour agir sans surinterpréter le message, identifiez le retour, son émetteur, la déclaration et la population visées ; lisez ensuite son statut dans la documentation associée, rapprochez l’écart de la donnée de paie concernée, puis tracez la décision et le résultat du contrôle suivant.

Ce guide traite **exclusivement de l’interprétation et du suivi après dépôt**. Pour préparer et tester les bulletins et le fichier avant transmission, utilisez la [méthode de contrôle avant la DSN](/blog/controler-les-bulletins-de-paie-avant-la-dsn). Les deux tâches se suivent, mais ne répondent pas à la même question : avant le dépôt, on éprouve un candidat ; après le dépôt, on interprète les retours réellement émis.

## Qu’est-ce qu’un compte rendu métier DSN, et pourquoi sa lecture casse-t-elle à la main ?

**Un compte rendu métier**, ou CRM, est le retour d’un organisme destinataire de la DSN après analyse des données reçues. **Un bilan d’anomalies** rend compte des contrôles effectués sur la déclaration elle-même. **Un certificat de conformité** atteste que la transmission a atteint le niveau de conformité indiqué par le certificat, et rien de plus. Ces trois documents ne prouvent pas la même chose, et c’est toute la difficulté.

Net-entreprises définit le CRM comme « un rapport permettant à l’organisme ou administration concernée de faire un retour aux déclarants à réception de leur déclaration lorsqu’une erreur ou suspicion d’erreur est détectée ». La page officielle sur [les comptes rendus métier DSN](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/) précise aussi que « chaque organisme intègre les éléments transmis dans son système et vérifie la cohérence des données transmises » avant de mettre son retour à disposition sur le tableau de bord.

Un CRM se lit donc comme un message situé : **qui contrôle quoi, sur quelle déclaration, selon quelle règle et avec quelle action demandée ?** Il ne constitue pas, à lui seul, une certification du bulletin, du dossier ou de toutes les obligations du déclarant.

Le vocabulaire n’est pas uniforme. La source officielle recense, selon les organismes, des synthèses, notifications, bilans de traitement, bilans d’identification, contrôles inter-déclarations et CRM nominatif ou financier. Une étiquette proche ne permet pas de transposer la portée d’un retour à un autre. Le document reçu et sa notice restent la référence.

À la main, cette lecture casse toujours au même endroit. Le gestionnaire qui suit le dossier depuis des années sait quel retour de quel organisme appelle un correctif immédiat, lequel se justifie par une pièce et lequel se classe. Cette règle vit dans sa tête, jamais dans le dossier : un collègue qui reprend le portefeuille recommence à zéro, un retour lu trop vite devient une correction inutile, un retour lu trop tard devient une régularisation. La méthode ci-dessous, une méthode Memlia, écrit cette règle en six étapes et un registre, pour qu’elle appartienne au cabinet.

## Pourquoi un dépôt accepté ne suffit-il pas ?

Le dépôt et l’analyse métier forment des étages différents. La page Net-entreprises consacrée aux [retours après dépôt](https://www.net-entreprises.fr/declaration/retours-suite-au-depot-dsn-ou-signalement/) distingue l’accusé d’enregistrement électronique ou l’avis de rejet, le certificat de conformité, le bilan d’anomalies, puis les CRM des organismes. Elle borne le certificat en une phrase : « le certificat de conformité vous libère de vos obligations déclaratives vis-à-vis de la transmission de la DSN », et demande aussitôt de vérifier les comptes rendus métier et retours d’informations mis à disposition par les organismes. Autrement dit, **conforme à la transmission** n’est pas synonyme de **paie juste**.

La même page distingue le contrôle bloquant, où la DSN est rejetée et à réémettre, du contrôle non bloquant, où « votre DSN a été acceptée, mais des écarts sont potentiellement à corriger pour une prise en compte correcte par tous les organismes et administrations destinataires ». Un dépôt accepté peut donc encore porter des écarts à traiter.

Dans le tableau, la définition des retours vient de cette source ; la colonne « Premier geste » est une méthode Memlia ; la consigne effectivement reçue prime toujours.

| Retour | Ce qu’il permet de constater | Premier geste | Ce qu’il ne faut pas en déduire |
| --- | --- | --- | --- |
| AEE, accusé d’enregistrement électronique | Le dépôt est enregistré et les contrôles suivants peuvent être effectués. | Conserver la référence du dépôt et poursuivre la lecture des retours. | Que la déclaration a franchi tous les contrôles. |
| ARE, avis de rejet | Le dépôt ne remplit pas les conditions techniques d’acceptation décrites par le retour. | Lire la cause technique, corriger le fichier puis reprendre la transmission selon la consigne. | La cause métier d’un autre écart éventuel. |
| CCO, certificat de conformité | La transmission a atteint le niveau de conformité indiqué par le certificat. | Archiver le certificat, puis vérifier les bilans et CRM. | Que toutes les données de paie sont justes ou qu’aucun organisme ne demandera de correction. |
| BAN, bilan d’anomalies | Un ou plusieurs contrôles ont relevé des anomalies dans la déclaration. | Ouvrir chaque contrôle et reprendre sa qualification officielle. | Que chaque écart a la même gravité ou la même action. |
| CRM d’un organisme | L’organisme communique le résultat de ses contrôles sur les données reçues. | Identifier émetteur, déclaration, population, règle et action avant toute correction. | Qu’un vocabulaire unique, une échéance unique ou une correction unique vaut pour tous les CRM. |

Les sigles de ce tableau sont ceux de la documentation Net-entreprises. **L’intitulé affiché peut varier selon la version de norme, le portail, l’organisme ou le logiciel.** La portée à retenir est celle décrite dans le retour effectivement reçu, pas celle que suggère une étiquette familière.

La frontière entre BAN et CRM dépend du périmètre, du format et de l’organisme décrits dans le retour reçu. Le tableau oriente la lecture ; il ne remplace ni le document ni sa notice.

## Contrôle de structure ou contrôle de cohérence : que regarder ?

La première question est la couche du contrôle. Un rejet technique et un écart métier ne se traitent pas avec les mêmes preuves.

- **Structure et norme d’échange.** Le fichier respecte la forme attendue pour être reçu et exploité. [Net-entreprises](https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/) décrit Dsn-Val ainsi : l’outil « permet de tester votre fichier DSN avant de le déposer », au regard du cahier technique et du journal de maintenance de la norme. Ce test prépare la transmission ; il ne remplace pas l’analyse des organismes après réception.
- **Cohérence métier.** L’organisme applique ses contrôles aux données qu’il reçoit et produit un retour selon son périmètre. La question devient alors : quelle donnée, quelle période, quelle population et quelle règle ont déclenché le message ?

Ces deux expressions servent à orienter la lecture, pas à imposer une taxonomie universelle à tous les organismes. Le statut `bloquant` ou `non bloquant` vient du retour ou de sa documentation. Il ne se devine pas à partir d’une couleur, d’un code mémorisé ou de la seule présence du mot « anomalie ».

## Comment lire un CRM en six étapes ?

La séquence suivante est une **méthode Memlia**. Elle organise les preuves et les décisions ; elle ne décide pas à la place du gestionnaire.

### 1. Identifier l’objet exact du retour

Relevez l’organisme émetteur, le type ou code du retour, la déclaration concernée, le SIRET ou identifiant technique autorisé, la période, la date de mise à disposition et, si elle apparaît, la population visée. Ne commencez pas par corriger une donnée tant que le retour n’est pas rattaché au bon dépôt.

Dans un portefeuille, deux déclarations proches peuvent produire des messages différents. Un titre générique tel que `CRM DSN` ne suffit pas à relier la preuve au fichier ou à la période.

### 2. Lire le statut dans la source du retour

Cherchez le libellé exact, la règle de contrôle, le niveau indiqué et l’action demandée. Si la notice classe l’écart comme bloquant, informatif, à corriger ou à justifier, conservez cette qualification. Si elle ne le fait pas, notez `qualification à confirmer` plutôt que d’inventer une gravité.

La [page de fiabilisation des données DSN](https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/) indique qu’en cas d’incompréhension le déclarant peut « contacter son organisme pour comprendre le retour métier, et son éditeur pour un accompagnement dans l’usage de son logiciel ». Cette séparation évite de demander à l’un de trancher une question qui relève de l’autre.

### 3. Localiser la donnée et la population concernées

Rattachez le contrôle à la rubrique, au bloc, au salarié ou à l’agrégat que le retour désigne. Vérifiez ensuite la période d’afférence et la déclaration source. Un CRM nominatif, par exemple, peut viser des éléments individuels ; un retour financier peut porter une autre lecture. Le mot `CRM` ne suffit pas à connaître le niveau de détail.

Le tableau de suivi conserve un identifiant de dossier et une référence de retour, tandis que le détail nominatif reste dans le système habilité. Pour structurer cette vue sans classement individuel, voyez le [modèle de suivi de production sociale](/blog/suivre-la-production-sociale-dans-excel).

### 4. Rapprocher le retour de la paie et de la preuve

Comparez la donnée déclarée avec le bulletin, l’événement, la pièce ou le paramétrage pertinent. Le but n’est pas de faire disparaître l’alerte, mais d’expliquer l’écart avec une preuve datée.

À ce stade, utilisez trois issues internes simples :

- `expliqué` : la donnée et sa cause sont retrouvées, et aucune correction n’est décidée ;
- `à corriger` : la personne habilitée a confirmé la correction à effectuer dans l’outil de paie ;
- `à arbitrer` : la règle, la preuve ou l’applicabilité ne permet pas encore de décider.

Ces états sont des conventions de travail. Ils ne remplacent jamais les statuts du CRM.

### 5. Documenter la décision et le canal de correction

Conservez au minimum : le retour source, la donnée examinée, la preuve consultée, la qualification officielle lorsqu’elle existe, la décision, son auteur, sa date et le canal prévu. Une correction en paie, une nouvelle transmission, une correction ultérieure ou une opposition motivée ne sont pas interchangeables.

La même page de fiabilisation précise le canal usuel : une erreur signalée se corrige en paie, en transmettant une DSN « annule et remplace » « avant minuit la veille de l’échéance si cela est encore possible. Le cas échéant, la correction pourra être réalisée dans la DSN du mois suivant ». Cette règle vaut pour la DSN mensuelle ; elle ne s’étend pas d’office aux signalements d’événement ni à tous les retours. Avant toute action, lisez la consigne du CRM et vérifiez le type de déclaration, le calendrier et la procédure de l’organisme concerné.

### 6. Contrôler le retour suivant avant de fermer

Après correction, régénérez les éléments concernés, rejouez les contrôles applicables et reliez le nouveau résultat à la décision. Ne clôturez pas sur la preuve d’un ancien fichier. Si le retour suivant maintient l’écart, ouvrez un nouvel arbitrage au lieu d’écraser l’historique.

La boucle est donc : **retour identifié → portée comprise → donnée rapprochée → décision tracée → correction autorisée → résultat suivant vérifié**.

## Exemple fictif : un CRM nominatif à qualifier

> **Jeu d’essai entièrement fictif, sans donnée client ni règle de paie réelle.** Le dossier `D-027`, période `2026-08`, reçoit le retour `R-027-A`. L’émetteur et la notice associent ce retour à une donnée individuelle. Le contrôle indique un écart, mais l’exemple ne lui attribue volontairement ni gravité ni délai réels.

Le gestionnaire suit la séquence :

1. il rattache `R-027-A` au dépôt et à la période concernés ;
2. il lit le libellé et l’action dans la notice applicable ;
3. il localise la rubrique fictive `X-14` et la population visée ;
4. il compare la donnée déclarée à la pièce fictive `P-027-08` ;
5. si les éléments concordent, il documente pourquoi aucune correction n’est retenue ; s’ils divergent, il passe l’état interne à `à corriger` ou `à arbitrer` ;
6. après la décision, il conserve le résultat du contrôle suivant sous une nouvelle référence.

Ce scénario teste la traçabilité. Il ne fournit aucune règle permettant de conclure sur une vraie anomalie DSN.

### Trois autres situations fictives à distinguer

| Situation fictive | Ce que le registre doit empêcher | Action de méthode |
| --- | --- | --- |
| `D-031` reçoit un CCO et un BAN | Clore sur le seul certificat et oublier le bilan. | Ouvrir les deux preuves, puis traiter le BAN selon sa notice. |
| `D-044` reçoit un message sans action explicite | Inventer une gravité à partir de sa couleur ou de son code. | Conserver `qualification à confirmer` et rechercher la documentation de l’émetteur. |
| `D-052` reçoit un retour qui impose un canal particulier | Appliquer par habitude une correction dans la DSN mensuelle suivante. | Vérifier le type de déclaration, le moment et les instructions du retour avant décision. |

Ces cas sont synthétiques. Ils ne reproduisent aucun CRM réel et ne fixent aucune conséquence. Ils servent à tester trois refus attendus : clôture prématurée, qualification inventée et canal supposé.

## Quel registre tenir pour ne perdre aucun retour ?

Un registre utile sépare le message reçu de la décision humaine. La structure ci-dessous est une proposition Memlia ; le cabinet en fixe les droits d’accès et l’outil.

| Champ | Exemple fictif | Rôle |
| --- | --- | --- |
| `id_retour` | `R-027-A` | Relier sans ambiguïté la preuve reçue. |
| `emetteur` | `ORGANISME-A` | Rechercher la bonne documentation. |
| `type_retour` | `CRM-N` | Conserver le libellé ou code source. |
| `periode` | `2026-08` | Éviter un rapprochement sur le mauvais mois. |
| `population` | `P-03` | Borner les personnes ou agrégats concernés. |
| `statut_source` | `à confirmer` | Ne pas inventer une qualification absente. |
| `donnee_visee` | `X-14` | Relier le retour à la paie ou au paramétrage. |
| `decision` | `à arbitrer` | Rendre l’exception actionnable. |
| `preuve` | `P-027-08` | Retrouver l’élément consulté. |
| `controle_suivant` | `R-027-B` | Prouver le résultat après action. |

Dans la vue agrégée, comptez les dossiers ou retours par état et par échéance. N’affichez pas par défaut un classement des gestionnaires. L’affectation sert à distribuer le travail ; elle ne justifie pas une mesure individuelle continue.

Quand un CRM contient des données nominatives, le registre de pilotage ne devient pas une copie générale du retour. Limitez les champs au strict nécessaire, réservez l’accès aux personnes habilitées et renvoyez vers la pièce source sécurisée plutôt que de recopier des données individuelles dans une vue partagée.

## Ce qui s’automatise, ce qui attend une validation, ce qui reste humain

| Se prépare seul | Attend une validation | Reste humain |
| --- | --- | --- |
| La collecte des retours accessibles dans les outils autorisés, et leur rattachement au dépôt et à la période | La qualification d’un retour dont la notice ne fixe pas le niveau | L’interprétation d’un libellé inconnu |
| Le rapprochement d’un retour avec la donnée de paie visée, écart présenté avec sa preuve | Le passage d’un retour à l’état `expliqué` ou `à corriger` | Le choix du canal et du moment de la correction |
| La file des retours sans décision, des preuves manquantes et des contrôles suivants absents | La clôture d’un retour dont le contrôle suivant confirme l’action | Le dépôt d’une nouvelle déclaration |

Quand la règle manque ou que deux sources se contredisent, le traitement cesse et présente les éléments à la personne responsable. C’est ce refus qui rend l’automatisation fiable : elle ne déduit jamais seule qu’une paie est juste, ne transforme pas un libellé inconnu en anomalie bloquante et ne dépose rien.

## Les erreurs de lecture à éviter

- **Clore au certificat.** Le certificat porte sur la transmission selon son périmètre. D’autres contrôles et CRM peuvent encore demander une action.
- **Traiter tous les CRM comme un même document.** L’émetteur, le format, la population, la règle et l’action varient.
- **Deviner la gravité.** Une couleur ou un code isolé ne remplace pas la qualification fournie par la source applicable.
- **Corriger sans revenir à la paie.** Le CRM signale un résultat de contrôle ; la décision exige le rapprochement avec la donnée et sa preuve.
- **Réutiliser une échéance mémorisée.** Le type de retour et le moment déterminent les options encore ouvertes. Relisez la consigne applicable au cas.
- **Écraser le premier retour.** Gardez le lien entre la décision, le fichier corrigé et le contrôle suivant.

## Questions fréquentes

### Un certificat de conformité garantit-il que la paie est juste ?

Non. Net-entreprises indique que le certificat libère le déclarant de ses obligations vis-à-vis de la transmission, et demande de vérifier les comptes rendus métier et retours d’informations mis à disposition par les organismes. Il faut donc encore lire les bilans et les CRM.

### Quelle différence entre un bilan d’anomalies et un CRM ?

Le bilan d’anomalies rend compte d’anomalies issues des contrôles de la déclaration au niveau décrit par Net-entreprises. Le CRM est le retour d’un organisme destinataire après intégration et analyse des données. Le document reçu et sa notice fixent la portée exacte.

### Un CRM nominatif concerne-t-il toujours la même administration ?

Le terme apparaît notamment dans la liste officielle des retours de l’administration fiscale, mais la portée d’un document ne se déduit pas de son seul nom. Vérifiez l’émetteur, le code, la période et la notice associés au retour réellement reçu.

### Faut-il corriger d’office toute anomalie ?

Non. Il faut d’abord comprendre la règle, localiser la donnée, vérifier la preuve et faire décider la personne habilitée. L’automatisation prépare ce rapprochement ; elle ne remplace pas l’interprétation métier.

### Quand le traitement d’un CRM est-il terminé ?

Selon la méthode proposée ici, lorsque le retour est rattaché au bon dépôt, sa portée est documentée, la décision est tracée et le résultat suivant confirme l’action ou ouvre explicitement un nouvel arbitrage.

## La règle à retenir

Ne cherchez pas un voyant unique après le dépôt. Lisez chaque retour comme une preuve située, séparez le statut porté par la source de votre état de traitement interne, puis fermez la boucle sur le résultat suivant, pas sur la seule correction effectuée.

## Pour aller plus loin

La lecture des retours après dépôt est l’une des sept familles du pôle paie et social de [la carte des tâches automatisables d’un cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches). Elle suit [le contrôle des bulletins avant la DSN](/blog/controler-les-bulletins-de-paie-avant-la-dsn) et alimente [le suivi de production sociale](/blog/suivre-la-production-sociale-dans-excel) ; le [compte rendu métier](/glossaire#compte-rendu-metier-dsn) et la DSN « [annule et remplace](/glossaire#annule-et-remplace-dsn) » sont définis au glossaire. Nous prenons cette tâche entière : nous écrivons la règle de lecture de votre cabinet dans vos mots, organisme par organisme, nous automatisons la collecte des retours et leur rapprochement avec la paie dans les outils que votre pôle social utilise déjà, vos gestionnaires la recettent sur des cas fictifs puis sur vos dossiers, et nous la maintenons. Vous gardez l’interprétation, la correction et le dépôt. C’est [la méthode](/methode), et ce sont [nos engagements](/garanties) : la mécanique rassemble et rapproche, votre équipe décide.
