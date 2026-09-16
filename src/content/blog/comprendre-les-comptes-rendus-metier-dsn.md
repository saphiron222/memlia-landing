---
titre: "Comprendre les comptes rendus métier DSN : méthode de lecture"
titreOnglet: "Comptes rendus métier DSN : méthode de lecture | Memlia"
resume: "Un dépôt accepté ne clôt pas le contrôle. Identifiez le retour, son émetteur, sa période et sa population ; lisez le statut dans sa source, rapprochez la donnée de paie, puis documentez la décision et le contrôle suivant."
description: "Méthode pour distinguer les retours DSN, lire un CRM, qualifier une anomalie et tracer la correction sans confondre dépôt accepté et paie juste."
datePublication: 2026-09-15
dateMiseAJour: 2026-09-15
auteur: kevin
sujets: [dsn, paie, production-sociale, methode]
motsCles: ["comptes rendus métier DSN", "CRM DSN", "bilan d’anomalies DSN", "certificat de conformité DSN", "CRM nominatif"]
brouillon: false
image: img-25-comptes-rendus-metier-dsn
pipelineVersion: 1
primaryQuery: "comptes rendus métier DSN"
secondaryQueries: ["comprendre CRM DSN", "bilan d’anomalies DSN", "certificat de conformité DSN", "CRM nominatif"]
intent: comprendre
fanOut: ["distinguer AEE ARE CCO BAN", "lire un CRM par organisme", "qualifier une anomalie DSN", "corriger après un retour DSN", "tracer la décision"]
cluster: paie-social
rolePrincipal: paie-responsables-sociaux
rolesSecondaires: [direction-associes]
tache: "Lire les retours reçus après une DSN, déterminer leur portée et organiser une correction ou un classement justifié."
preuveRole:
  niveau: hypothese
  source: "preuves/role.json"
  date: 2026-09-15
funnel: TOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Chaque affirmation DSN est rattachée à une source officielle relue le 15 septembre 2026 ou bornée comme méthode Memlia. Le contenu est publié sans attestation métier indépendante."
reviewRule: "Revue éditoriale et fact-check réalisés ; publication déclarée non attestée par un professionnel de la paie ou du social."
reviewer: marketing
sourcesVerifieesLe: 2026-09-15
cta:
  label: "Identifier une tâche à automatiser"
  destination: "https://cal.com/kevin-svg/decouvrir-memlia"
  outcome: "Memlia peut préparer une file de retours et d’écarts dans les outils du cabinet ; une personne qualifiée interprète le retour, décide et autorise toute correction."
imageOg: "/images/img-25-comptes-rendus-metier-dsn-og.webp"
imageAlt: "Un dépôt franchi, plusieurs retours distincts et une anomalie isolée avant la décision humaine."
statutEditorial: publie-non-atteste
sources:
  - { editeur: "Net-entreprises", titre: "Les retours d’informations suite au dépôt de votre DSN ou signalement d’événement", url: "https://www.net-entreprises.fr/declaration/retours-suite-au-depot-dsn-ou-signalement/", consulte: 2026-09-15 }
  - { editeur: "Net-entreprises", titre: "Les Comptes Rendus Métiers DSN", url: "https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/", consulte: 2026-09-15 }
  - { editeur: "Net-entreprises", titre: "La fiabilisation des données de la DSN", url: "https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/", consulte: 2026-09-15 }
  - { editeur: "Net-entreprises", titre: "Outils d’auto-contrôle Dsn-Val et brique de contrôle", url: "https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/", consulte: 2026-09-15 }
  - { editeur: "Net-entreprises", titre: "Cahier technique de la norme DSN 2026.1", url: "https://www.net-entreprises.fr/media/documentation/dsn-cahier-technique-2026.1.pdf", consulte: 2026-09-15 }
---

Un compte rendu métier DSN ne donne pas un verdict général sur toute la paie. Il rapporte le résultat d’un contrôle effectué par un organisme destinataire sur les données qu’il a reçues. Pour agir sans surinterpréter le message, commencez par identifier le retour, son émetteur, la déclaration et la population visées. Lisez ensuite son statut dans la documentation associée, rapprochez l’écart de la donnée de paie concernée, puis tracez la décision et le résultat du contrôle suivant.

Ce guide traite **exclusivement de l’interprétation et du suivi après dépôt**. Pour préparer et tester les bulletins et le fichier avant transmission, utilisez plutôt la [méthode de contrôle avant la DSN](/blog/controler-les-bulletins-de-paie-avant-la-dsn). Les deux tâches se suivent, mais ne répondent pas à la même question : avant le dépôt, on éprouve un candidat ; après le dépôt, on interprète les retours réellement émis.

> **En bref**
> - Un accusé d’enregistrement, un certificat, un bilan d’anomalies et un CRM ne prouvent pas la même chose.
> - Un dépôt accepté peut encore être accompagné d’un retour à traiter.
> - Le nom, le format et la portée d’un CRM varient selon l’organisme et le contrôle.
> - L’automatisation peut rassembler et rapprocher ; une personne qualifiée interprète et décide.

## Qu’est-ce qu’un compte rendu métier DSN ?

Net-entreprises définit le CRM comme un rapport par lequel un organisme ou une administration répond au déclarant, après réception de la déclaration, lorsqu’une erreur ou une suspicion d’erreur est détectée. La page officielle sur [les comptes rendus métier DSN](https://www.net-entreprises.fr/declaration/comptes-rendus-metiers-dsn/) précise aussi que chaque organisme intègre les éléments reçus dans son système, vérifie leur cohérence, puis met son retour à disposition sur le tableau de bord.

Un CRM doit donc être lu comme un message situé : **qui contrôle quoi, sur quelle déclaration, selon quelle règle et avec quelle action demandée ?** Il ne constitue pas, à lui seul, une certification globale du bulletin, du dossier ou de toutes les obligations du déclarant.

Le vocabulaire n’est pas uniforme. La source officielle recense, selon les organismes, des synthèses, notifications, bilans de traitement, bilans d’identification, contrôles inter-déclarations et CRM nominatif ou financier. Une étiquette proche ne permet pas de transposer automatiquement la portée d’un retour à un autre. Le document reçu et sa notice restent la référence.

## Pourquoi un dépôt accepté ne suffit-il pas ?

Le dépôt et l’analyse métier forment des étages différents. La page Net-entreprises consacrée aux [retours après dépôt](https://www.net-entreprises.fr/declaration/retours-suite-au-depot-dsn-ou-signalement/) distingue l’accusé d’enregistrement électronique ou l’avis de rejet, le certificat de conformité, le bilan d’anomalies, puis les CRM des organismes.

Dans le tableau, la définition des retours vient de cette source ; la colonne « Premier geste » est une méthode Memlia à adapter à la consigne effectivement reçue.

| Retour | Ce qu’il permet de constater | Premier geste | Ce qu’il ne faut pas en déduire |
| --- | --- | --- | --- |
| AEE, accusé d’enregistrement électronique | Le dépôt est enregistré et les contrôles suivants peuvent être effectués. | Conserver la référence du dépôt et poursuivre la lecture des retours. | Que la déclaration a franchi tous les contrôles. |
| ARE, avis de rejet | Le dépôt ne remplit pas les conditions techniques d’acceptation décrites par le retour. | Lire la cause technique, corriger le fichier puis reprendre la transmission selon la consigne. | La cause métier d’un autre écart éventuel. |
| CCO, certificat de conformité | La transmission a atteint le niveau de conformité indiqué par le certificat. | Archiver le certificat, puis vérifier les bilans et CRM. | Que toutes les données de paie sont justes ou qu’aucun organisme ne demandera de correction. |
| BAN, bilan d’anomalies | Un ou plusieurs contrôles ont relevé des anomalies dans la déclaration. | Ouvrir chaque contrôle et reprendre sa qualification officielle. | Que chaque écart a la même gravité ou la même action. |
| CRM d’un organisme | L’organisme communique le résultat de ses contrôles sur les données reçues. | Identifier émetteur, déclaration, population, règle et action avant toute correction. | Qu’un vocabulaire unique, une échéance unique ou une correction unique vaut pour tous les CRM. |

Les sigles de ce tableau sont ceux de la documentation Net-entreprises. **L’intitulé affiché peut varier selon la version de norme, le portail, l’organisme ou le logiciel.** La portée à retenir est celle décrite dans le retour effectivement reçu, pas celle que suggère une étiquette familière.

Le [cahier technique DSN 2026.1](https://www.net-entreprises.fr/media/documentation/dsn-cahier-technique-2026.1.pdf) borne explicitement la portée du certificat : il indique qu’une déclaration est conforme à la norme d’échange, mais que le compte rendu issu du certificat ne préjuge pas des demandes ultérieures de rectification de données inexactes ou incomplètes. Autrement dit, **conforme à l’échange** n’est pas synonyme de **paie juste**.

> **Exemple de formulation officielle, section 1.4.1.5 de la norme 2026.1 :** « celle-ci est conforme à la norme d’échange ». Ce fragment documente la portée technique du certificat ; il ne reproduit pas l’interface d’un logiciel.

Net-entreprises signale en outre qu’une DSN peut être acceptée avec un certificat de conformité tout en présentant un bilan d’anomalies. La même page distingue des contrôles bloquants, qui entraînent le rejet, et des contrôles non bloquants, pour lesquels la DSN est acceptée alors que des écarts peuvent encore nécessiter une correction.

La frontière entre BAN et CRM reste dépendante du périmètre, du format et de l’organisme décrits dans le retour reçu. Le tableau sert à orienter la lecture ; il ne remplace ni le document ni sa notice.

## Contrôle de structure ou contrôle de cohérence : que regarder ?

La première question est la couche du contrôle. Un rejet technique et un écart métier ne se traitent pas avec les mêmes preuves.

- **Structure et norme d’échange.** Le fichier doit respecter la forme attendue pour pouvoir être reçu et exploité. L’outil [Dsn-Val](https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/) teste avant dépôt le fichier au regard du cahier technique et du journal de maintenance associé. Ce test prépare la transmission ; il ne remplace pas l’analyse des organismes après réception.
- **Cohérence métier.** L’organisme applique ses contrôles aux données qu’il reçoit et produit un retour selon son périmètre. La question devient alors : quelle donnée, quelle période, quelle population et quelle règle ont déclenché le message ?

Ces deux expressions servent ici à orienter la lecture, pas à imposer une taxonomie universelle à tous les organismes. Le statut `bloquant` ou `non bloquant` doit venir du retour ou de sa documentation. Il ne doit pas être deviné à partir d’une couleur, d’un code mémorisé ou de la seule présence du mot « anomalie ».

## Comment lire un CRM en six étapes ?

La séquence suivante est une **méthode Memlia**, pas une procédure réglementaire universelle. Elle organise les preuves et les décisions ; elle ne décide pas à la place du gestionnaire.

### 1. Identifier l’objet exact du retour

Relevez l’organisme émetteur, le type ou code du retour, la déclaration concernée, le SIRET ou identifiant technique autorisé, la période, la date de mise à disposition et, si elle apparaît, la population visée. Ne commencez pas par corriger une donnée tant que le retour n’est pas rattaché au bon dépôt.

Dans un portefeuille, deux déclarations proches peuvent produire des messages différents. Un titre générique tel que `CRM DSN` ne suffit donc pas à relier la preuve au fichier ou à la période.

### 2. Lire le statut dans la source du retour

Cherchez le libellé exact, la règle de contrôle, le niveau indiqué et l’action demandée. Si la notice classe l’écart comme bloquant, informatif, à corriger ou à justifier, conservez cette qualification. Si elle ne le fait pas, notez `qualification à confirmer` plutôt que d’inventer une gravité.

La [page de fiabilisation des données DSN](https://www.net-entreprises.fr/declaration/la-fiabilisation-des-donnees-de-la-dsn/) recommande, en cas d’incompréhension, de contacter l’organisme pour comprendre le retour métier et l’éditeur pour l’usage du logiciel. Cette séparation évite de demander à l’un de trancher une question qui relève de l’autre.

### 3. Localiser la donnée et la population concernées

Rattachez le contrôle à la rubrique, au bloc, au salarié ou à l’agrégat que le retour désigne. Vérifiez ensuite la période d’afférence et la déclaration source. Un CRM nominatif, par exemple, peut viser des éléments individuels ; un retour financier peut porter une autre lecture. Le mot `CRM` ne suffit pas à connaître le niveau de détail.

Le tableau de suivi peut conserver un identifiant de dossier et une référence de retour, tandis que le détail nominatif reste dans le système habilité. Pour structurer cette vue sans classement individuel, voyez le [modèle de suivi de production sociale dans Excel](/blog/suivre-la-production-sociale-dans-excel).

### 4. Rapprocher le retour de la paie et de la preuve

Comparez la donnée déclarée avec le bulletin, l’événement, la pièce ou le paramétrage pertinent. Le but n’est pas de faire disparaître l’alerte, mais d’expliquer l’écart avec une preuve datée.

À ce stade, utilisez trois issues internes simples :

- `expliqué` : la donnée et sa cause sont retrouvées, et aucune correction n’est décidée ;
- `à corriger` : la personne habilitée a confirmé la correction à effectuer dans l’outil de paie ;
- `à arbitrer` : la règle, la preuve ou l’applicabilité ne permet pas encore de décider.

Ces états sont des conventions de travail Memlia. Ils ne remplacent jamais les statuts du CRM.

### 5. Documenter la décision et le canal de correction

Conservez au minimum : le retour source, la donnée examinée, la preuve consultée, la qualification officielle lorsqu’elle existe, la décision, son auteur, sa date et le canal prévu. Une correction en paie, une nouvelle transmission, une correction ultérieure ou une opposition motivée ne sont pas interchangeables.

La source de fiabilisation indique que les erreurs signalées sont à corriger au plus tôt ; une **DSN mensuelle** peut être retransmise en « annule et remplace » avant minuit la veille de l’échéance si cela reste possible, sinon la correction peut relever de la DSN du mois suivant. Cette règle ne s’étend pas automatiquement aux signalements d’événement ni à tous les retours : avant toute action, lisez la consigne du CRM et vérifiez le type de déclaration, le calendrier et la procédure de l’organisme concerné.

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

Ces cas sont synthétiques. Ils ne reproduisent aucun CRM réel et ne fixent aucune conséquence réglementaire. Ils servent à tester trois refus attendus : clôture prématurée, qualification inventée et canal supposé.

## Quel registre tenir pour ne perdre aucun retour ?

Un registre utile sépare le message reçu de la décision humaine. La structure ci-dessous est une proposition Memlia à adapter aux droits d’accès et aux outils du cabinet.

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

Quand un CRM contient des données nominatives, le registre de pilotage ne doit pas devenir une copie générale du retour. Limitez les champs au strict nécessaire, réservez l’accès aux personnes habilitées et renvoyez vers la pièce source sécurisée plutôt que de recopier des données individuelles dans une vue partagée.

## Ce que l’automatisation peut préparer

Une automatisation peut collecter les retours accessibles dans les outils autorisés, normaliser des références techniques, rapprocher une période, signaler un statut absent et préparer une file d’exceptions. Elle peut aussi détecter qu’une preuve ou qu’un retour suivant manque.

Elle ne doit pas déduire seule qu’une paie est juste, transformer un libellé inconnu en anomalie bloquante, choisir le canal de correction ou déposer une nouvelle déclaration. Quand la règle manque ou que deux sources se contredisent, le traitement s’arrête et présente les éléments à la personne responsable.

La [méthode Memlia](/#methode) part précisément de la règle du cabinet, l’éprouve sur des cas fictifs et garde la validation humaine. Les [garanties du service](/#garanties) bornent l’automatisation : la mécanique prépare et signale ; l’équipe autorisée décide.

## Les erreurs de lecture à éviter

**Clore au certificat.** Le certificat porte sur la transmission selon son périmètre. D’autres contrôles et CRM peuvent encore demander une action.

**Traiter tous les CRM comme un même document.** L’émetteur, le format, la population, la règle et l’action varient.

**Deviner la gravité.** Une couleur ou un code isolé ne remplace pas la qualification fournie par la source applicable.

**Corriger sans revenir à la paie.** Le CRM signale un résultat de contrôle ; la décision exige le rapprochement avec la donnée et sa preuve.

**Réutiliser une échéance mémorisée.** Le type de retour et le moment déterminent les options encore ouvertes. Relisez la consigne applicable au cas.

**Écraser le premier retour.** Gardez le lien entre la décision, le fichier corrigé et le contrôle suivant.

## Questions fréquentes

### Un certificat de conformité garantit-il que la paie est juste ?

Non. Le cahier technique indique que le certificat atteste la conformité à la norme d’échange et ne préjuge pas des demandes ultérieures de rectification. Il faut encore consulter les bilans et CRM mis à disposition.

### Quelle différence entre un bilan d’anomalies et un CRM ?

Le bilan d’anomalies rend compte d’anomalies issues des contrôles de la déclaration au niveau décrit par Net-entreprises. Le CRM est le retour d’un organisme destinataire après intégration et analyse des données. Le document reçu et sa notice fixent la portée exacte.

### Un CRM nominatif concerne-t-il toujours la même administration ?

Le terme apparaît notamment dans la liste officielle des retours de l’administration fiscale, mais il ne faut pas déduire la portée d’un document à partir de son seul nom. Vérifiez l’émetteur, le code, la période et la notice associés au retour réellement reçu.

### Faut-il corriger automatiquement toute anomalie ?

Non. Il faut d’abord comprendre la règle, localiser la donnée, vérifier la preuve et faire décider la personne habilitée. L’automatisation peut préparer ce rapprochement ; elle ne remplace pas l’interprétation métier.

### Quand le traitement d’un CRM est-il terminé ?

Selon la méthode proposée ici, lorsque le retour est rattaché au bon dépôt, sa portée est documentée, la décision est tracée et le résultat suivant confirme l’action ou ouvre explicitement un nouvel arbitrage.

## La règle à retenir

Ne cherchez pas un voyant unique après le dépôt. Lisez chaque retour comme une preuve située : émetteur, déclaration, période, population, contrôle et action. Séparez le statut porté par la source de votre état de traitement interne. Puis fermez la boucle sur le résultat suivant, pas sur la seule correction effectuée.

Cette discipline évite deux erreurs opposées : ignorer un retour parce que le dépôt est accepté, ou modifier la paie sans avoir compris ce que l’organisme a réellement signalé. L’outil rassemble et rapproche ; l’humain interprète, décide et contrôle la suite.
