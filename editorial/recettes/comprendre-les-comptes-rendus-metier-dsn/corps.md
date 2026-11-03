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

### Qui reçoit le compte rendu métier et où le consulter ?

Le déclarant qui a effectué le dépôt, et lui seul. Sur la page [Le tableau de bord de la DSN](https://www.net-entreprises.fr/declaration/tableau-de-bord-dsn/), Net-entreprises écrit que « seul le déclarant ayant effectué le dépôt de la DSN mensuelle ou du signalement d’événement peut consulter les retours associés ». L’administrateur fait exception : il « peut néanmoins consulter l’ensemble des dépôts et des retours transmis via le SIRET de connexion en interfaçant son tableau de bord DSN avec l’un des déclarants de la liste proposée ».

Les retours s’affichent dans le tableau de bord DSN, « intégré dans votre logiciel ou sur net-entreprises.fr ». Un cabinet en procédure automatique d’échanges peut le consulter « directement via votre produit (logiciel) de paie » ; dans les autres cas, il doit se connecter à son compte net-entreprises.fr.

La recherche a une limite : il est « impossible à partir du tableau de bord DSN de rechercher un envoi de plus de 3 mois ». Net-entreprises précise que l’historisation « peut se faire soit directement à partir de votre logiciel de paie soit par l’enregistrement des fichiers transmis directement sur votre poste informatique ». Consignez donc la référence de chaque retour dans le registre décrit plus bas dès sa réception.

### Quels sont les numéros des comptes rendus métier (118, 119, 120, 121, 124…) ?

NEOReS, selon Net-entreprises, c’est « la norme d’échange optimisée des retours sociaux, qui désignent les flux des organismes destinataires de données DSN vers les déclarants et leurs solutions de paie ». Les numéros ci-dessous sont ceux des comptes rendus normalisés de cette norme ; Net-entreprises les recense, organisme par organisme, sur sa page [Norme et documentation NEOReS](https://www.net-entreprises.fr/declaration/norme-et-documentation-neores/).

Cette normalisation concerne « uniquement les transmissions d’un organisme de protection sociale vers le déclarant dans le contexte global DSN » : les certificats de conformité, les bilans d’anomalies et les accusés de réception ne sont pas concernés, selon la même page. Voici les numéros qu’elle recense, résumés ; la page propose en plus des spécifications à télécharger pour plusieurs d’entre eux.

| Numéro | Ce que la page en dit |
| --- | --- |
| 118 | Les effectifs calculés par les Urssaf et les Caisses MSA sur la base des DSN reçues sont mis à disposition des déclarants depuis 2022. |
| 119 et 120 | Depuis février 2023, les résultats de contrôles relatifs au recouvrement des cotisations sociales et plus généralement relatifs à la fiabilisation des données sociales, sont transmis par l’Urssaf Caisse Nationale via les comptes rendus normalisés. La page publie les spécifications des contrôles présents dans les CRM normalisés 119 et 120. |
| 121 | Depuis juin 2023, « le compte rendu identité » remonte sous format normalisé les propositions d’amélioration des données d’identification des individus déclarés. La page publie les spécifications des contrôles présents dans le CRM normalisé 121 « CRM Identité ». |
| 124 | Urssaf : depuis mars 2025, les comptes rendus métiers de rappel annuel (124) sont remontés en cas d’anomalie non corrigée au sein des déclarations de l’exercice précédent. |
| 125 | MSA : à partir de mars 2027, les comptes rendus métiers de rappel annuel (125) seront remontés en cas d’anomalie non corrigée au sein des déclarations de l’exercice précédent. |
| 130 | MSA : le compte rendu 130, transmis à H+4 du dépôt de la DSN depuis juillet 2024. |
| 136 | MSA : le compte rendu 136, transmis à J+5 de l’échéance DSN (à partir de juillet 2026). |
| 132 | En cas de substitution, un CRM « post substitution » (132) sera transmis au déclarant au format normalisé pour l’informer des données substituées par l’Urssaf. |
| 134 | En cas de substitution, un CRM « post substitution » (134) sera transmis au déclarant au format normalisé pour l’informer des données substituées par la MSA. |
| 135 | À partir d’octobre 2026, France Travail remontera les propositions d’amélioration de données suite à la réception d’un signalement FCTU avec le compte rendu métier 135 au format normalisé. |

Nous ne donnons aucun sens à un numéro que cette page ne recense pas : relevez l’émetteur et la notice du retour reçu, ou interrogez l’organisme.

## Que veut dire « mandat à acquitter » dans un compte rendu métier DSN ?

**C’est l’information notifiant la nécessité d’acquitter un mandat, retournée au déclarant lorsqu’aucun mandat n’est trouvé.** Net-entreprises la décrit dans [sa fiche d’aide sur la fonction mandat](https://net-entreprises.custhelp.com/app/answers/detail_dsn/a_id/964), sans lui attribuer de code ni de format.

Ce retour suit une consultation que la fiche décrit ainsi : après réception d’un message DSN, et en cas de demande de paiement par prélèvement, l’organisme de protection sociale consulte sa « mandathèque » afin de s’assurer de la présence d’un mandat actif pour le couple « compte bancaire / créancier » du message DSN.

Le déclarant peut donc visualiser la nécessité de compléter et d’acquitter un mandat dans les comptes rendus métier affichés sur le tableau de bord DSN.

La fiche décrit aussi le cas des mandats préremplis : après le dépôt d’une DSN, lorsque des mandats préremplis à acquitter sont disponibles, l’organisme informe le déclarant via un retour métier accessible dans les « Mandats de prélèvement » du détail de sa déclaration.

Elle rappelle l’enjeu : pour effectuer le télépaiement des cotisations il est donc obligatoire d’avoir au préalable acquitté un mandat de prélèvement SEPA.

Selon la fiche, cette fonction permet actuellement de traiter les mandats pour la plupart des institutions de prévoyance et certaines mutuelles et assurances. Elle ne la généralise pas à tous les organismes : pour l’Urssaf, les mandats continuent d’être gérés dans les services+ (Urssaf en ligne), et pour la MSA, les mandats sont gérés directement dans les services complémentaires de la MSA. La liste de la fiche cite d’autres organismes, que nous ne reprenons pas ici.

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
