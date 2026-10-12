---
titre: "FEC contrôle : préparer le constat de réception pour la mission CAC"
titreOnglet: "FEC contrôle : constat de réception CAC | Memlia"
resume: "Identifier le fichier et sa période, nommer les contrôles effectués et conserver leur portée. Trois cas JSON fictifs montrent un constat à revoir, un refus de période et un écart technique."
description: "FEC contrôle : identifier la version reçue, consigner les contrôles techniques et présenter les refus avant les travaux sur les écritures en mission CAC."
datePublication: 2026-10-12
auteur: kevin
sujets: [cabinet, donnees, methode]
motsCles: ["fec contrôle", "commissariat aux comptes", "règle écrite", "dossier de travail"]
brouillon: false
image: img-art-cac-fec-reception
pipelineVersion: 1
primaryQuery: "fec contrôle"
secondaryQueries: []
intent: executer
fanOut: ["préparation et décision", "version des entrées", "limites et refus"]
cluster: certification
famille: cac-fec-reception
rolePrincipal: audit-cac
rolesSecondaires: []
tache: "FEC contrôle : préparer le constat de réception pour la mission CAC"
preuveRole:
  niveau: indirect
  source: "preuves/role.json"
  date: 2026-10-12
funnel: MOFU
contentType: searchable
format: tutorial
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Sources NEP officielles et jeu fictif exécuté ; portée bornée à la préparation."
reviewRule: "Relire après évolution des normes ou changement de la tâche ; suivis J+7 et J+28 après publication effective."
reviewer: relecteur-metier-ia-memlia
sourcesVerifieesLe: 2026-10-11
cta:
  label: "Confier cette tâche"
  destination: "/contact"
  outcome: "Nous écrivons la règle de cette tâche dans vos mots, nous la construisons dans vos outils et votre équipe la recette sur un jeu fictif. Vous gardez l’examen des sorties et les décisions de mission. Rien à envoyer : la description du geste suffit."
imageOg: "/images/img-art-cac-fec-reception-og.webp"
imageAlt: "Le constat de réception du FEC : préparation, examen et décision sur le dossier fictif D-004."
statutEditorial: publie
sources:
  - editeur: "H2A"
    titre: "NEP 315"
    url: "https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/"
    consulte: 2026-10-11
  - editeur: "H2A"
    titre: "NEP 330"
    url: "https://h2a-france.org/normes/procedures-daudit-mises-en-oeuvre-par-le-commissaire-aux-comptes-a-lissue-de-son-evaluation-des-risques/"
    consulte: 2026-10-11
  - editeur: "H2A"
    titre: "NEP 230"
    url: "https://h2a-france.org/normes/documentation-de-laudit-des-comptes/"
    consulte: 2026-10-11
  - editeur: "H2A"
    titre: "NEP 500"
    url: "https://h2a-france.org/normes/caractere-probant-des-elements-collectes/"
    consulte: 2026-10-11
---

## Réponse directe

Pour préparer un contrôle du FEC reçu en mission CAC, identifiez d'abord le fichier, l'entité, la période et la version. Produisez ensuite un constat de réception avec les contrôles techniques réellement effectués et les points qui empêchent de poursuivre. Gardez ce constat distinct des tests sur les écritures et des conclusions de mission. Un fichier reçu ou lisible n'est pas, à lui seul, une preuve que les comptes sont fiables.

## Qu'est-ce qu'un constat de réception du FEC ?

**Le FEC** est le fichier des écritures comptables. **Le constat de réception** est une fiche qui identifie l'export reçu et décrit les vérifications effectuées avant de le réutiliser. **La version reçue** est la matière exacte à laquelle ces vérifications se rapportent ; elle reste identifiable lorsqu'un nouvel export arrive.

Le constat répond à quatre questions : qu'avons-nous reçu ? Pour quelle entité et quelle période ? Qu'avons-nous effectivement vérifié ? Qui décide de la suite ? Il ne se présente ni comme un rapport d'audit ni comme une certification du format.

La [NEP 500, paragraphe 06](https://h2a-france.org/normes/caractere-probant-des-elements-collectes/) précise : « Le caractère approprié est fonction de la qualité des éléments collectés, c’est-à-dire de leur fiabilité et de leur pertinence. » La présence d'un fichier et la lecture de ses lignes ne répondent donc pas à toutes les questions sur les éléments utilisés dans la mission. Le constat consigne le nom et la version du traitement effectivement exécuté, sans lui attribuer une portée plus large que ses contrôles.

## Pourquoi la réception casse à la main

Un message dit « voici le FEC définitif ». L'export est déposé dans un dossier où un fichier porte déjà le même nom. Le collaborateur le remplace, puis reprend une feuille qui a été construite sur la première version. Les deux feuilles paraissent parler du même fichier, alors qu'elles n'ont plus la même entrée.

Le problème n'est pas le nombre de clics. La règle implicite manque : un fichier reçu devient une version identifiée, et chaque traitement reste rattaché à cette version. Si le fichier change, le constat change aussi. Le commentaire du chef de mission, lui, ne se réécrit pas automatiquement.

Une autre confusion vient du statut « contrôlé ». Il peut signifier « fichier ouvert », « colonnes présentes », « période rapprochée » ou « écritures examinées ». Sans liste des vérifications effectuées, ce statut ne dit rien d'utilisable à la personne qui reprend le travail.

## Avant de commencer

Réunissez le fichier reçu sans le modifier, le message ou bordereau qui l'accompagne et la demande d'export. Identifiez l'entité et la période attendues. Précisez aussi si le cabinet attend un export provisoire ou une version issue d'une clôture : cette qualification vient de la demande et des informations reçues, pas du nom du fichier.

Dans la fiche de réception, prévoyez les champs suivants :

| Champ | Ce qu'il permet de retrouver |
|---|---|
| Référence du mandat | À quel dossier rattacher l'entrée |
| Nom et version de l'export | Quel objet a été reçu |
| Origine et date de réception | D'où provient la matière |
| Période attendue et période annoncée | Quel périmètre comparer |
| Référence du contrôle et version de sa règle | Quel traitement a été effectué |
| Résultats techniques et limites | Ce qui a été constaté et ce qui reste à faire |
| Commentaire et décision du responsable | Qui a examiné la suite |

L'empreinte d'un fichier aide à distinguer deux contenus. Elle n'atteste pas son exhaustivité ni sa provenance. Gardez donc la trace de réception et les informations de périmètre à côté de cette empreinte.

## 1. Identifier l'entrée sans la réécrire

Conservez le fichier original dans l'emplacement prévu par le cabinet. Le traitement travaille sur une copie ou en lecture seule. La référence de la réception accompagne le constat et les sorties préparées.

Si deux exports ont le même nom mais des contenus différents, donnez-leur deux références. Si le même contenu est reçu deux fois, signalez le doublon sans supprimer silencieusement la trace. Une retransmission peut avoir son propre message d'accompagnement.

Dans notre exemple fictif, D-004 est le dossier et FEC-D004-v1 la première référence d'entrée. Ces identifiants sont inventés. Aucun fichier client n'est utilisé dans le jeu d'essai.

## 2. Nommer les contrôles techniques réellement effectués

La liste des contrôles dépend du traitement employé. Distinguez les colonnes attendues, les formats de dates, les montants lisibles, les périodes, les équilibres calculés et les éventuelles ruptures de séquence. Un contrôle absent n'est pas coché par défaut.

Un total nul donne un résultat de calcul. Il ne démontre pas que toutes les écritures attendues sont présentes. Un fichier peut être équilibré tout en couvrant une mauvaise période. Un contrôle de période peut, lui aussi, rester limité aux informations visibles dans l'export.

La fiche porte donc une colonne « limite ». Par exemple : « écart débit-crédit calculé sur les lignes lues ; exhaustivité de l'export non établie ». Cette précision évite de transformer un résultat exact mais partiel en conclusion générale.

Les résultats utiles à la mission restent liés au traitement effectué. La [NEP 230, paragraphe 04](https://h2a-france.org/normes/documentation-de-laudit-des-comptes/), précise : « Le commissaire aux comptes consigne dans son dossier les éléments qui permettent à toute autre personne ayant une expérience de la pratique de l’audit et n’ayant pas participé à la mission d’être en mesure de comprendre ». La liste qui suit comprend les résultats des procédures et les éléments collectés. Le constat prépare leur référencement ; il ne suffit pas à lui seul à documenter tous les travaux d'audit.

## 3. Séparer anomalie technique et question de mission

Un champ illisible ou une période incompatible avec la demande donne une difficulté d'entrée. Le collaborateur peut préparer une demande de précision ou de nouvel export. Le responsable décide de la suite à donner.

Une écriture qui répond à un critère de sélection est une autre question. Elle appelle des travaux définis dans la mission. Le même écran peut montrer une référence de réception et une référence d'écriture, mais les deux listes conservent leur objet.

La [NEP 330, paragraphe 28](https://h2a-france.org/normes/procedures-daudit-mises-en-oeuvre-par-le-commissaire-aux-comptes-a-lissue-de-son-evaluation-des-risques/) cite notamment l'« examen des écritures comptables significatives, y compris des ajustements effectués lors de la clôture des comptes ». Le contrôle de réception n'est pas cet examen. Il prépare une entrée identifiable pour les travaux qui suivront.

## 4. Présenter le constat avant de poursuivre

La sortie distingue trois zones : les résultats calculés, les informations encore absentes et la décision du responsable. Un nouvel export régénère la première zone sur une nouvelle version ; il ne remplace ni le commentaire ni la décision associés à la précédente.

| Situation | Sortie préparée | Suite à examiner |
|---|---|---|
| Entrée identifiée, contrôles effectués sans difficulté technique relevée | Constat à revoir, avec limites visibles | Décider des travaux suivants |
| Période différente de celle demandée | Refus de poursuite sur cette entrée | Demander une précision ou un export correspondant |
| Écart technique inexpliqué | Constat avec écart nommé | Examiner l'écart avant réutilisation |
| Nouveau contenu sous le même nom | Nouvelle référence de version | Comparer avant de reprendre les feuilles |
| Information absente du fichier | Champ non vérifiable | Obtenir l'information, sans la déduire |

La [carte des tâches du cabinet CAC](/blog/automatiser-un-cabinet-cac-la-carte-des-taches) situe ce geste en amont de la revue des écritures, des demandes de documents et du dossier de travail.

<figure data-blog-proof="cac-fec-registre-reception">
  <img src="/proofs/blog/cac-fec-registre-reception.webp" alt="Registre du dossier fictif D-004 : références des entrées et statuts des propositions à examiner." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## La règle écrite

**La frontière.** Le constat garde une séparation lisible entre calcul, validation et travaux de mission :

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Identifier la version et calculer les résultats des contrôles définis | Examiner le constat et les informations absentes | Apprécier la pertinence et la fiabilité des données |
| Présenter les écarts techniques | Choisir la demande de précision ou de nouvel export | Déterminer les procédures sur les écritures |
| Préparer une nouvelle fiche pour une nouvelle entrée | Autoriser sa réutilisation selon l'organisation du cabinet | Conclure sur les éléments collectés et les comptes |

**La proposition.** Nous préparons le constat, ses références et les résultats des contrôles écrits avec votre équipe. Le collaborateur saisit son commentaire séparément. La nouvelle réception produit une nouvelle proposition ; elle ne réécrit pas la saisie précédente.

**L'arrêt.** Le traitement refuse la poursuite lorsque la période ne correspond pas à celle attendue ou qu'un écart calculé n'est pas expliqué. Un champ absent ou une donnée illisible se présente comme une information manquante, jamais comme une valeur devinée.

**Le jeu d'essai.** Trois cas ont été rejoués sur deux lignes JSON fictives représentant une paire débit-crédit : période attendue et équilibre nul, mauvaise période, écart d'un euro. Ce banc éditorial teste uniquement les conditions de période et d'équilibre décrites ci-dessous. Il ne teste pas les colonnes du format FEC et n'établit ni exhaustivité ni validité du format.

<figure data-blog-proof="cac-fec-constat">
  <img src="/proofs/blog/cac-fec-constat.webp" alt="Fiche du dossier fictif D-004 : proposition et commentaire du responsable dans des espaces distincts." width="1600" height="900" loading="lazy" decoding="async">
</figure>

## Rejoué sur le jeu fictif

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Deux lignes fictives 2026, débit et crédit de 1 200,00 € | CONSTAT_A_REVOIR ; écart 0,00 € | Examiner le constat, sans conclusion sur les comptes |
| Les mêmes lignes portent 2025, période attendue 2026 | REFUS_PERIODE ; écart 0,00 € | Identifier la bonne entrée avant de poursuivre |
| Débit 1 200,00 €, crédit 1 199,00 € en 2026 | REFUS_ECART ; écart 1,00 € | Présenter l'écart au responsable |

Les montants et statuts sont les sorties du rejeu local sur données inventées. Aucune opinion n'est produite dans les trois cas. Ce rejeu montre précisément pourquoi un équilibre nul ne suffit pas : le deuxième cas reste refusé pour sa période.

## Apprécier le traitement utilisé

La fiche outil présente les entrées, les contrôles, les paramètres, les limites et la version du traitement. Elle conserve les cas où la règle aboutit et ceux où elle refuse. C'est le point de départ pour comprendre la sortie et éviter d'en élargir la portée.

La [NEP 315, paragraphe 46](https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/) prévoit l'appréciation de « la manière dont les outils fonctionnent » et du « degré de pertinence et de fiabilité des informations qui sont intégrées dans ces outils ». Un résultat reproductible n'écarte donc pas la question de la bonne entrée ou du bon objectif.

Les accès et la destination des données se cadrent pour la tâche. Le fichier reste dans l'environnement convenu avec le cabinet ; une illustration éditoriale n'autorise aucune transmission de données à un service extérieur. Les [garanties de Memlia](/garanties) expliquent les engagements de traitement et les éléments définis avant la prise en charge.

## Les erreurs fréquentes

- **Nommer la sortie « FEC validé ».** Décrivez les contrôles effectués et leurs résultats.
- **Confondre équilibre et exhaustivité.** Gardez une ligne distincte pour la limite de population.
- **Remplacer l'export précédent.** Créez une nouvelle version et conservez les références des travaux antérieurs.
- **Choisir la période depuis le seul nom du fichier.** Comparez avec la demande et les informations reçues.
- **Fermer le point dès réception.** Le dépôt et l'examen du constat sont deux étapes différentes.

## Questions fréquentes

### Le constat remplace-t-il un contrôle complet du format FEC ?

Non. Sa portée dépend des contrôles effectivement exécutés et de l'outil utilisé. Le banc fictif de cet article ne vérifie que la période et l'équilibre d'une paire de lignes JSON. Le contrôle complet du format est un travail distinct, à identifier comme tel.

### Que faire si le fichier est équilibré mais incomplet ?

Le résultat d'équilibre reste consigné. La complétude de la population reste une autre question, avec ses éléments à obtenir. N'utilisez pas le premier résultat pour fermer automatiquement la seconde.

### Pourquoi conserver une référence par version ?

Pour retrouver l'entrée exacte d'un calcul ou d'une feuille. Le nom du fichier ne suffit pas si son contenu a changé. La référence de réception et le commentaire du responsable accompagnent la version traitée.

### Peut-on partir d'un tableur existant ?

Oui, si les formats et les accès permettent de lire l'entrée et de présenter la sortie sans écraser les saisies. La [méthode de Memlia](/methode) commence par l'observation de ce geste dans les outils de votre équipe, avant de choisir le mode de construction.

## La règle à retenir

Le constat dit quel fichier a été reçu, ce qui a été contrôlé et ce qui empêche de poursuivre. Il prépare une entrée traçable pour les travaux de mission ; il ne conclut pas sur les comptes.

## Pour aller plus loin

Nous prenons en charge la réception du fichier et la préparation du constat : références de version, contrôles écrits avec l'équipe, refus nommés et présentation des résultats dans vos outils. Vous gardez l'examen du constat, les travaux sur les écritures et les décisions de mission. Rien à envoyer pour en parler : décrivez le geste que vos collaborateurs répètent.
