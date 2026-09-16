---
titre: "Suivre la production sociale dans Excel : modèle, règles et limites"
titreOnglet: "Tableau de suivi de production sociale Excel | Memlia"
resume: "Construisez le suivi sur l’unité dossier × période × étape : une table de saisie contrôlée, des calculs régénérables et une vue agrégée. Les exceptions portent sur les dossiers, jamais sur un classement individuel."
description: "Dictionnaire de colonnes, états fermés, jeu d’essai fictif et règles de gouvernance pour un tableau de suivi de production sociale dans Excel."
datePublication: 2026-09-09
dateMiseAJour: 2026-09-15
auteur: kevin
sujets: [production-sociale, excel, cabinet, methode]
motsCles: ["tableau suivi production sociale Excel cabinet", "suivi portefeuille social", "classeur pôle social", "états de production", "pilotage anti-surveillance"]
brouillon: false
image: img-24-suivi-production-sociale
pipelineVersion: 1
primaryQuery: "tableau suivi production sociale Excel cabinet"
secondaryQueries: ["suivi portefeuille social", "classeur pôle social", "états de production", "pilotage anti-surveillance"]
intent: executer
fanOut: ["colonnes du tableau social", "états et transitions", "séparation Saisie Calcul Vue", "exceptions avant échéance", "gouvernance anti-surveillance", "automatisation du classeur"]
cluster: excel-outils-existants
rolePrincipal: paie-responsables-sociaux
rolesSecondaires: [direction-associes]
tache: "Structurer un classeur de suivi existant pour identifier l’étape et les exceptions de chaque dossier sans classement individuel."
preuveRole:
  niveau: indirect
  source: "preuves/role.json"
  date: 2026-09-13
funnel: MOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Les affirmations Excel et CNIL sont rattachées aux sources primaires relues le 15 septembre 2026. Le contenu est publié sans attestation métier indépendante."
reviewRule: "Revue éditoriale et fact-check réalisés ; publication déclarée non attestée par un professionnel du social ou de la protection des données."
reviewer: marketing
sourcesVerifieesLe: 2026-09-15
cta:
  label: "Identifier une tâche à automatiser"
  destination: "https://cal.com/kevin-svg/decouvrir-memlia"
  outcome: "Memlia peut définir avec le cabinet les règles, exceptions et tests à automatiser dans le classeur existant ; le cabinet valide le résultat."
imageOg: "/images/img-24-suivi-production-sociale-og.webp"
imageAlt: "Cinq dossiers avancent dans trois couches de suivi, avec une exception isolée pour décision."
statutEditorial: publie-non-atteste
sources:
  - { editeur: "CNIL", titre: "Travail, ressources humaines : le contrôle de l’activité des personnes employées", url: "https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees", consulte: 2026-09-15 }
  - { editeur: "Microsoft Support", titre: "Overview of Excel tables", url: "https://support.microsoft.com/en-us/excel/overview-of-excel-tables", consulte: 2026-09-15 }
  - { editeur: "Microsoft Support", titre: "Protect a worksheet", url: "https://support.microsoft.com/en-us/excel/protect-a-worksheet", consulte: 2026-09-15 }
---

Un tableau de suivi de production sociale utile ne commence pas par des graphiques. Il commence par une unité stable : un dossier, une période et une étape du cycle. La saisie décrit les faits, les formules détectent les exceptions, puis une vue agrégée montre ce qui reste à traiter. Elle ne classe pas les personnes.

Ce guide s'adresse aux responsables de pôle social, dirigeants de cabinet et gestionnaires de paie qui veulent structurer ou reprendre un classeur existant. Il fournit un dictionnaire de colonnes, des états fermés et un jeu d'essai fictif. Les règles proposées restent à adapter à l'organisation, aux accès et aux obligations du cabinet.

> **En bref**
> - Une ligne représente `dossier × période`, pas un salarié du cabinet.
> - Une étape est validée par une date ou un état fermé, pas par une couleur libre.
> - Les feuilles `Saisie`, `Calcul` et `Vue` ont des responsabilités distinctes.
> - Le pilotage compte les dossiers par état et par échéance. Il n'établit pas de classement individuel.
> - La protection d'une feuille évite des modifications de cellules, mais ne sécurise pas l'accès au fichier.

## Le modèle minimal : dossier × période × étape

Chaque ligne de la table principale représente l'avancement d'un dossier sur une période donnée. Cette granularité permet de répondre à une question opérationnelle : où se trouve le dossier dans le cycle et quelle action manque avant l'échéance qui lui est applicable ?

Évitez trois autres unités :

- une ligne par gestionnaire, qui transforme le fichier en tableau individuel ;
- une ligne par tâche libre, qui rend les états impossibles à comparer ;
- une ligne permanente par dossier, qui écrase l'historique d'un mois par le suivant.

<!-- [UNIQUE INSIGHT] -->
La clé technique du suivi n'est pas le numéro de ligne. C'est le couple `id_dossier + période`. Une règle d'unicité sur cette clé évite qu'un même dossier apparaisse deux fois pour le même mois avec des états contradictoires.

## Le dictionnaire de colonnes à écrire avant les formules

Le dictionnaire ci-dessous sépare données d'identification, étapes, exceptions et audit. Les noms sont indicatifs. Le cabinet peut les adapter, mais chaque colonne doit garder une seule signification.

| Colonne | Type | Exemple fictif | Règle de saisie | Usage |
| --- | --- | --- | --- | --- |
| `id_dossier` | texte stable | `D-001` | obligatoire, sans nom de client dans la vue agrégée | Identifier le dossier |
| `periode` | mois | `2026-08` | obligatoire | Former la clé avec `id_dossier` |
| `echeance` | date | `2026-09-15` | issue de la règle du dossier | Calculer le temps restant |
| `etat` | liste fermée | `pieces_incompletes` | une valeur autorisée | Situer le dossier dans le cycle |
| `pieces_recues_le` | date ou vide | `2026-09-03` | date réelle, pas case cochée | Prouver la réception |
| `bulletins_controles_le` | date ou vide | `2026-09-07` | renseigné après la revue | Relier le contrôle au cycle |
| `dsn_deposee_le` | date ou vide | `2026-09-10` | renseigné après dépôt | Distinguer prêt et déposé |
| `exception_code` | liste fermée | `PIECE_MANQUANTE` | vide si aucune exception | Regrouper les cas à traiter |
| `exception_detail` | texte court | `variable absente` | ne pas y copier de donnée sensible | Donner le contexte minimal |
| `decision` | liste fermée | `a_arbitrer` | obligatoire si exception | Empêcher une alerte sans suite |
| `maj_le` | date-heure | `2026-09-07 10:00` | mise à jour contrôlée | Repérer la fraîcheur de la ligne |

Les exemples sont entièrement fictifs. Ils décrivent une structure, pas un dossier réel ni un calendrier à appliquer tel quel.

### Pourquoi utiliser une table Excel structurée ?

Microsoft indique qu'une plage de données liées peut être convertie en [table Excel](https://support.microsoft.com/en-us/excel/overview-of-excel-tables) pour en faciliter la gestion et l'analyse. Les colonnes obtiennent des en-têtes filtrables et les formules de colonne peuvent se propager aux nouvelles lignes. Cette structure convient mieux qu'une plage dont la fin doit être modifiée à la main chaque mois.

Donnez un nom explicite à la table, par exemple `t_production_sociale`. Les formules peuvent alors référencer `t_production_sociale[etat]` plutôt qu'une plage fixe comme `H2:H500`.

## Définir des états fermés et leurs transitions

Une colonne d'état libre finit par contenir `OK`, `fait`, `terminé`, `déposé` ou des variantes typographiques qui désignent parfois la même chose. Une liste fermée évite cette ambiguïté.

Voici un cycle de départ à adapter :

1. `a_ouvrir`
2. `attente_pieces`
3. `pieces_incompletes`
4. `pret_calcul`
5. `bulletins_calcules`
6. `ecarts_a_arbitrer`
7. `controle_termine`
8. `dsn_deposee`
9. `retours_a_traiter`
10. `clos`

Une transition doit être cohérente avec les dates. Par exemple, `dsn_deposee` exige une date de dépôt ; `controle_termine` exige une date de contrôle ; `ecarts_a_arbitrer` exige un code d'exception et une décision ouverte. Ces règles sont des choix de gouvernance du cabinet, pas des normes imposées à tous les pôles sociaux.

### Matrice de transition

| État courant | État suivant autorisé | Condition minimale | Cas refusé |
| --- | --- | --- | --- |
| `attente_pieces` | `pieces_incompletes` ou `pret_calcul` | réception évaluée | passage direct à `bulletins_calcules` |
| `bulletins_calcules` | `ecarts_a_arbitrer` ou `controle_termine` | revue des écarts jouée | état terminé sans date de contrôle |
| `controle_termine` | `dsn_deposee` | décision humaine et dépôt effectué | date de dépôt future |
| `dsn_deposee` | `retours_a_traiter` ou `clos` | retours disponibles consultés selon le processus | clôture automatique sans lecture prévue |

Le classeur doit refuser ou signaler une transition incohérente. Il ne doit pas inventer l'état suivant.

## Séparer Saisie, Calcul et Vue

Une architecture simple utilise trois feuilles.

### Feuille Saisie

Elle contient la table principale et les valeurs renseignées par les personnes autorisées. Les listes et contrôles de saisie y sont visibles. Aucune formule critique ne doit dépendre d'une couleur appliquée manuellement.

### Feuille Calcul

Elle contient les colonnes dérivées : jours avant échéance, clé d'unicité, cohérence des transitions, retard de mise à jour et présence d'une exception non décidée. Tout son contenu doit pouvoir être régénéré à partir de la saisie et des règles écrites.

La [protection d'une feuille Excel](https://support.microsoft.com/en-us/excel/protect-a-worksheet) peut empêcher la modification de cellules verrouillées. Microsoft précise cependant que cette protection n'est pas une fonction de sécurité et qu'elle ne remplace pas la protection du fichier ou du classeur. Elle limite les modifications de cellules ; les droits d'accès se gèrent ailleurs.

### Feuille Vue

Elle agrège les dossiers par état, période ou échéance. Elle répond à des questions de flux : combien de dossiers attendent des pièces, combien présentent une exception ouverte, combien sont contrôlés mais non déposés ?

La vue ne doit pas exposer un classement par gestionnaire. Une affectation peut être nécessaire dans la saisie pour organiser le travail, mais sa présence ne justifie pas automatiquement un palmarès individuel.

## Les indicateurs utiles au flux

Un indicateur de pilotage doit mener à une action sur un dossier ou une étape. Les quatre indicateurs de départ peuvent être :

- nombre de dossiers par état ;
- nombre de dossiers dont l'échéance approche avec une étape incomplète ;
- nombre d'exceptions sans décision ;
- nombre de dossiers dont la dernière mise à jour dépasse le délai interne choisi.

Les seuils sont définis par le cabinet. Écrivez chaque règle en français avant sa formule. Exemple : « signaler un dossier dont l'échéance est dans le délai interne choisi et dont l'état n'est pas `controle_termine` ou suivant ». Cette phrase devient la référence de recette.

Écartez les indicateurs qui mesurent en continu les gestes, le temps ou la cadence d'une personne sans finalité et cadre préalables. La [CNIL rappelle](https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees), dans sa page du 9 juillet 2026, qu'un dispositif de contrôle de l'activité doit satisfaire cumulativement des conditions de justification et de proportionnalité, être soumis aux instances représentatives selon les règles en vigueur et être porté à la connaissance des salariés ou agents.

<!-- [UNIQUE INSIGHT] -->
L'anti-surveillance n'est pas seulement une règle d'affichage. Elle doit être testée dans le modèle de données. Si une vue agrégée peut être reconstituée sans identifiant de personne, cet identifiant n'a pas à entrer dans ses formules ni dans ses exports.

## Jeu d'essai fictif de cinq dossiers

Avant d'utiliser le classeur, rejouez les règles sur ce jeu synthétique. Les identifiants, dates et situations sont fictifs.

| Dossier | Période | État | Exception | Décision attendue du test |
| --- | --- | --- | --- | --- |
| `D-001` | `2026-08` | `attente_pieces` | aucune date de réception | signaler selon le seuil interne |
| `D-002` | `2026-08` | `pieces_incompletes` | `PIECE_MANQUANTE` | rester ouvert jusqu'à décision |
| `D-003` | `2026-08` | `bulletins_calcules` | aucune | demander la revue des écarts |
| `D-004` | `2026-08` | `controle_termine` | date de contrôle présente | autoriser le passage au dépôt |
| `D-005` | `2026-08` | `dsn_deposee` | retour à traiter | interdire la clôture automatique |

### Recette minimale

1. Dupliquez `D-001` sur la même période : la clé d'unicité doit signaler le doublon.
2. Effacez la date de contrôle de `D-004` : l'état doit devenir incohérent.
3. Tentez de clôturer `D-005` avec un retour ouvert : la transition doit être refusée ou signalée.
4. Saisissez un état absent de la liste : la validation doit le refuser.
5. Modifiez une cellule protégée de la feuille Calcul : Excel doit empêcher la modification dans le périmètre configuré.

<!-- [ORIGINAL DATA] -->
Ce jeu d'essai n'est pas une observation client. C'est un artefact synthétique conçu pour vérifier cinq propriétés du modèle : unicité, cohérence date-état, clôture des exceptions, domaine fermé des états et protection contre une modification accidentelle.

## Gouvernance : finalité, accès et information

Avant la mise en service, décrivez la finalité du classeur, les personnes autorisées à le lire ou le modifier, les données réellement nécessaires et le moment où les historiques sont revus ou supprimés. Ne fixez pas une durée de conservation universelle sans avoir défini la finalité et les contraintes du cabinet.

Si le dispositif permet de contrôler l'activité des personnes, la page de la CNIL citée plus haut demande notamment d'en informer les personnes concernées et de respecter les procédures applicables avec leurs représentants. Un suivi par dossier n'est pas automatiquement conforme par sa seule structure : la finalité, les données, les accès et l'usage réel restent déterminants.

Trois tests simples renforcent ce cadrage :

- la vue agrégée fonctionne-t-elle sans donnée nominative sur les gestionnaires ?
- une personne non autorisée peut-elle ouvrir le fichier ou ses exports ?
- le détail conservé est-il nécessaire pour traiter les exceptions du dossier ?

Si une réponse est mauvaise, corrigez le modèle ou les accès avant d'ajouter des graphiques.

## Quand garder Excel, quand automatiser le classeur ?

Gardez le classeur tel quel si la saisie est unique, les formules sont comprises, les modifications sont relues et les exceptions restent peu nombreuses. Automatisez la mécanique lorsque la même donnée est ressaisie, qu'une formule critique peut être écrasée, que plusieurs sources doivent être rapprochées ou que les règles d'exception deviennent difficiles à rejouer à la main.

L'objectif n'est pas forcément de remplacer Excel. Une automatisation peut alimenter ou contrôler la table existante, régénérer les calculs et préparer les exceptions. Elle doit rester fail-closed : une donnée absente ou ambiguë bloque la proposition au lieu d'être complétée silencieusement.

Pour le contrôle situé entre `bulletins_calcules` et `controle_termine`, utilisez la [méthode de contrôle des bulletins avant la DSN](/blog/controler-les-bulletins-de-paie-avant-la-dsn). La [méthode Memlia](/#methode) explique comment coder une règle du cabinet, l'éprouver sur un jeu fictif et laisser la validation humaine. Les [garanties du service](/#garanties) précisent aussi ce qui reste bloqué tant que le cabinet n'a pas validé.

Si votre suivi dépend de ressaisies ou de formules fragiles, Memlia peut préparer une automatisation greffée au classeur et aux outils existants. Le périmètre, les exceptions et la recette sont définis avec le cabinet ; le cabinet valide le résultat.

## Erreurs fréquentes

**Dessiner le tableau de bord avant la table.** Les graphiques masquent alors un modèle de données instable.

**Utiliser des couleurs comme états.** Une couleur n'a pas de définition stable, ne porte pas de date et se compte mal.

**Mélanger saisie et formules.** Une valeur manuelle peut remplacer une formule sans alerte visible.

**Confondre feuille protégée et fichier sécurisé.** La protection de feuille ne gère pas l'accès au classeur.

**Conserver une exception sans décision.** L'alerte devient un décor et le dossier reste ambigu.

**Agréger par personne par défaut.** Le suivi quitte le flux de dossiers pour mesurer des individus sans que cette finalité ait été cadrée.

## Questions fréquentes

### Quelles colonnes sont indispensables ?

Au minimum : identifiant du dossier, période, échéance, état, dates des étapes clés, code d'exception, décision et date de mise à jour. Ajoutez une colonne seulement si elle soutient une règle, une preuve ou une décision.

### Peut-on conserver le nom du gestionnaire ?

Une affectation peut servir à l'organisation du travail. Elle ne doit pas devenir par défaut un classement ou une mesure continue de performance. La finalité, l'accès et l'usage de cette donnée doivent être cadrés.

### La protection de feuille suffit-elle ?

Non. Elle limite les modifications sur les cellules verrouillées. Microsoft indique qu'elle n'est pas conçue comme une fonction de sécurité. Les droits d'ouverture, de partage et de modification du fichier doivent être gérés séparément.

### Faut-il un logiciel dédié ?

Pas nécessairement. Le critère est la robustesse du processus : saisie non dupliquée, règles lisibles, calculs régénérables, accès maîtrisés et exceptions traitables. Si ces conditions se dégradent, automatisez la mécanique ou changez de support selon le besoin réel.

## Le modèle à retenir

Construisez d'abord une table `dossier × période`, imposez des états fermés et séparez Saisie, Calcul et Vue. Testez le modèle sur des cas fictifs, pilotez les dossiers par étape et rendez chaque exception décidable. Excel reste alors un support maîtrisé plutôt qu'un empilement de couleurs et de formules invisibles.
