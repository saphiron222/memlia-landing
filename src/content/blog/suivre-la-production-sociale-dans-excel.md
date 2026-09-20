---
titre: "Tableau de bord paie Excel en cabinet : suivre sans surveiller"
titreOnglet: "Tableau de bord paie Excel : suivre sans surveiller | Memlia"
resume: "Construisez le suivi sur l’unité dossier × période × étape : une table de saisie contrôlée, des calculs régénérables et une vue agrégée. Les exceptions portent sur les dossiers, jamais sur un classement individuel, et un jeu d’essai fictif éprouve le modèle avant la mise en service."
description: "Dictionnaire de colonnes, états fermés, jeu d’essai fictif et règles de gouvernance pour un tableau de suivi de production sociale dans Excel."
datePublication: 2026-09-09
dateMiseAJour: 2026-09-20
auteur: kevin
sujets: [production-sociale, excel, cabinet, methode]
motsCles: ["tableau suivi production sociale Excel cabinet", "suivi portefeuille social", "classeur pôle social", "états de production", "pilotage anti-surveillance"]
brouillon: false
image: img-24-suivi-production-sociale
pipelineVersion: 1
primaryQuery: "tableau de bord paie excel"
secondaryQueries: ["suivi portefeuille social", "classeur pôle social", "états de production", "pilotage anti-surveillance", "tableau suivi production sociale Excel cabinet", "suivi production sociale excel"]
intent: executer
fanOut: ["colonnes du tableau social", "états et transitions", "séparation Saisie Calcul Vue", "exceptions avant échéance", "gouvernance anti-surveillance", "automatisation du classeur"]
cluster: excel-outils-existants
famille: suivi-production-sociale
rolePrincipal: paie-responsables-sociaux
rolesSecondaires: [direction-associes]
tache: "Structurer un classeur de suivi existant pour identifier l’étape et les exceptions de chaque dossier sans classement individuel."
preuveRole:
  niveau: indirect
  source: "preuves/role.json"
  date: 2026-09-20
funnel: MOFU
contentType: searchable
format: how-to-guide
rankability: plausible
businessRelevance: directe
proofStatus: verifiee
proofRequired: "Dictionnaire de onze colonnes, dix états fermés et leur matrice de transition, jeu d’essai fictif de cinq dossiers avec recette en cinq points, frontière en trois colonnes ; cinq affirmations citées mot pour mot depuis la CNIL et le support Microsoft, ouvertes le jour de la republication."
reviewRule: "Réviser à chaque changement de la page CNIL sur le contrôle de l’activité des personnes employées ou des pages Microsoft citées, et à la publication de l’article sur le tableau de bord de production ; relecture des sources à six mois."
reviewer: marketing
sourcesVerifieesLe: 2026-09-20
cta:
  label: "Confier cette tâche"
  destination: "/contact"
  outcome: "Nous écrivons la règle de suivi de votre pôle social dans vos mots, unité, états, transitions et exceptions compris, nous l’automatisons dans le classeur et les outils que votre équipe utilise déjà, et elle la recette sur le jeu fictif puis sur vos dossiers. Chaque décision sur une exception, et tout ce qui touche aux personnes, reste à vos équipes. Rien à envoyer : décrivez la tâche, nous vous disons ce qu’il faut pour la prendre en charge."
imageOg: "/images/img-24-suivi-production-sociale-og.webp"
imageAlt: "Cinq dossiers avancent dans trois couches de suivi, avec une exception isolée pour décision."
statutEditorial: publie
sources:
  - editeur: "CNIL"
    titre: "Travail, ressources humaines : le contrôle de l’activité des personnes employées"
    url: "https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees"
    consulte: 2026-09-20
  - editeur: "Microsoft Support"
    titre: "Overview of Excel tables"
    url: "https://support.microsoft.com/en-us/excel/overview-of-excel-tables"
    consulte: 2026-09-20
  - editeur: "Microsoft Support"
    titre: "Protect a worksheet"
    url: "https://support.microsoft.com/en-us/excel/protect-a-worksheet"
    consulte: 2026-09-20
---

## Réponse directe

Un tableau de suivi de production sociale utile ne commence pas par des graphiques. Il commence par une unité stable : un dossier, une période et une étape du cycle. La saisie décrit les faits, les formules détectent les exceptions, puis une vue agrégée montre ce qui reste à traiter, sans classer les personnes. Trois feuilles suffisent, Saisie, Calcul et Vue, avec des états fermés et un jeu d’essai fictif pour éprouver le modèle avant de s’en servir.

## Qu’est-ce que le suivi de production sociale, et pourquoi casse-t-il à la main ?

**Le suivi de production sociale** est la tenue, dossier par dossier et période par période, de l’étape atteinte dans le cycle de paie : pièces reçues, bulletins calculés, écarts arbitrés, DSN déposée, retours traités. **Une exception** est un dossier qui ne peut pas avancer sans une décision : pièce manquante, écart non expliqué, retour à traiter. **Un agrégat non nominatif** compte des dossiers par état et par échéance, jamais des personnes.

Dans la plupart des cabinets, ce suivi existe déjà, dans un classeur que le responsable de pôle connaît par cœur : une couleur pour « en attente », une autre pour « fait », une colonne de commentaires qui dit tout et son contraire. La règle qui fait tenir ce classeur, quel dossier est prêt, lequel bloque, pourquoi, vit dans la tête de la personne qui le tient. Le jour où elle est absente, le pôle avance à l’aveugle ; le jour où elle part, le classeur ne veut plus rien dire. Écrire cette règle, c’est d’abord fixer l’unité, les états et les exceptions ; c’est ce que fait la méthode ci-dessous, une méthode Memlia dont le cabinet fixe les seuils, les accès et les responsables.

## Le modèle minimal : dossier × période × étape

Chaque ligne de la table principale représente l’avancement d’un dossier sur une période donnée. Cette granularité permet de répondre à une question opérationnelle : où se trouve le dossier dans le cycle et quelle action manque avant l’échéance qui lui est applicable ?

Évitez trois autres unités :

- une ligne par gestionnaire, qui transforme le fichier en tableau individuel ;
- une ligne par tâche libre, qui rend les états impossibles à comparer ;
- une ligne permanente par dossier, qui écrase l’historique d’un mois par le suivant.

La clé technique du suivi n’est pas le numéro de ligne. C’est le couple `id_dossier + période`. Une règle d’unicité sur cette clé évite qu’un même dossier apparaisse deux fois pour le même mois avec des états contradictoires.

## Le dictionnaire de colonnes à écrire avant les formules

Le dictionnaire ci-dessous sépare données d’identification, étapes, exceptions et audit. Les noms sont indicatifs. Le cabinet peut les adapter, mais chaque colonne garde une seule signification.

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

Microsoft indique qu’une plage de données liées peut être convertie en [table Excel](https://support.microsoft.com/en-us/excel/overview-of-excel-tables) pour en faciliter la gestion et l’analyse. Les colonnes obtiennent des en-têtes filtrables et les formules de colonne se propagent aux nouvelles lignes. Cette structure convient mieux qu’une plage dont la fin se modifie à la main chaque mois.

Donnez un nom explicite à la table, par exemple `t_production_sociale`. Les formules peuvent alors référencer `t_production_sociale[etat]` plutôt qu’une plage fixe comme `H2:H500`.

<figure data-blog-proof="social-dictionnaire">
  <img src="/proofs/blog/social-dictionnaire.webp" alt="Dictionnaire fictif des colonnes de production avec types, exemples et règles de saisie." width="1600" height="900" loading="lazy" decoding="async">
  <figcaption><a href="/proofs/blog/social-dictionnaire.webp" target="_blank" rel="noopener">Ouvrir la preuve en grand</a>. Source : jeu d’essai fictif et dictionnaire de colonnes décrits dans cet article ; capture du <time datetime="2026-09-20">20 septembre 2026</time>.</figcaption>
</figure>

## Définir des états fermés et leurs transitions

Une colonne d’état libre finit par contenir `OK`, `fait`, `terminé`, `déposé` ou des variantes typographiques qui désignent parfois la même chose. Une liste fermée évite cette ambiguïté.

Voici un cycle de départ, dont le cabinet fixe les noms et le nombre d’états :

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

Une transition reste cohérente avec les dates. Par exemple, `dsn_deposee` exige une date de dépôt ; `controle_termine` exige une date de contrôle ; `ecarts_a_arbitrer` exige un code d’exception et une décision ouverte. Ces règles sont des choix du cabinet, écrits dans sa règle de suivi.

### Matrice de transition

| État courant | État suivant autorisé | Condition minimale | Cas refusé |
| --- | --- | --- | --- |
| `attente_pieces` | `pieces_incompletes` ou `pret_calcul` | réception évaluée | passage direct à `bulletins_calcules` |
| `bulletins_calcules` | `ecarts_a_arbitrer` ou `controle_termine` | revue des écarts jouée | état terminé sans date de contrôle |
| `controle_termine` | `dsn_deposee` | décision humaine et dépôt effectué | date de dépôt future |
| `dsn_deposee` | `retours_a_traiter` ou `clos` | retours disponibles consultés selon le processus | clôture automatique sans lecture prévue |

Le classeur refuse ou signale une transition incohérente. Il n’invente pas l’état suivant.

## Séparer Saisie, Calcul et Vue

Une architecture simple utilise trois feuilles.

### Feuille Saisie

Elle contient la table principale et les valeurs renseignées par les personnes autorisées. Les listes et contrôles de saisie y sont visibles. Aucune formule critique ne dépend d’une couleur appliquée à la main.

### Feuille Calcul

Elle contient les colonnes dérivées : jours avant échéance, clé d’unicité, cohérence des transitions, retard de mise à jour et présence d’une exception non décidée. Tout son contenu peut se régénérer à partir de la saisie et des règles écrites.

La [protection d’une feuille Excel](https://support.microsoft.com/en-us/excel/protect-a-worksheet) empêche la modification de cellules verrouillées. Microsoft précise cependant que cette protection n’est pas une fonction de sécurité et qu’elle ne remplace pas la protection du fichier ou du classeur. Elle limite les modifications de cellules ; les droits d’accès se gèrent ailleurs.

### Feuille Vue

Elle agrège les dossiers par état, période ou échéance. Elle répond à des questions de flux : combien de dossiers attendent des pièces, combien présentent une exception ouverte, combien sont contrôlés mais non déposés ?

La vue n’expose pas un classement par gestionnaire. Une affectation peut être nécessaire dans la saisie pour organiser le travail, mais sa présence ne justifie pas un palmarès individuel.

<figure data-blog-proof="social-vue-agregee">
  <img src="/proofs/blog/social-vue-agregee.webp" alt="Vue agrégée fictive des dossiers par état et des exceptions, sans donnée nominative." width="1600" height="900" loading="lazy" decoding="async">
  <figcaption><a href="/proofs/blog/social-vue-agregee.webp" target="_blank" rel="noopener">Ouvrir la preuve en grand</a>. Source : jeu d’essai fictif de cinq dossiers décrit dans cet article ; capture du <time datetime="2026-09-20">20 septembre 2026</time>.</figcaption>
</figure>

## Les indicateurs utiles au flux

Un indicateur de pilotage mène à une action sur un dossier ou une étape. Les quatre indicateurs de départ peuvent être :

- nombre de dossiers par état ;
- nombre de dossiers dont l’échéance approche avec une étape incomplète ;
- nombre d’exceptions sans décision ;
- nombre de dossiers dont la dernière mise à jour dépasse le délai interne choisi.

Les seuils sont définis par le cabinet. Écrivez chaque règle en français avant sa formule. Exemple : « signaler un dossier dont l’échéance est dans le délai interne choisi et dont l’état n’est pas `controle_termine` ou suivant ». Cette phrase devient la référence de recette.

Écartez les indicateurs qui mesurent en continu les gestes, le temps ou la cadence d’une personne sans finalité ni cadre préalables. La [CNIL rappelle](https://www.cnil.fr/fr/controle-de-lactivite-des-personnes-employees), dans sa page sur le contrôle de l’activité des personnes employées, qu’un tel dispositif doit satisfaire cumulativement des conditions : « être soumis aux instances représentatives du personnel selon les règles en vigueur », se justifier et rester proportionné, et être porté à la connaissance des salariés ou agents.

La même page donne l’exemple d’un dispositif jugé proportionné : « un logiciel qui compte et transmet à l’encadrant (de façon transparente) le nombre de dossiers traités par trimestre par salarié/agent », parce que la fréquence de la remontée n’est pas assimilable à une surveillance constante. Le suivi décrit ici compte des dossiers par état et par échéance ; il ne remonte rien sur les personnes par défaut, et ce qu’il remonterait un jour se cadre avant d’être construit.

L’anti-surveillance n’est pas seulement une règle d’affichage. Elle se teste dans le modèle de données : si une vue agrégée peut être reconstituée sans identifiant de personne, cet identifiant n’a pas à entrer dans ses formules ni dans ses exports.

## Jeu d’essai fictif de cinq dossiers

Avant d’utiliser le classeur, rejouez les règles sur ce jeu synthétique. Les identifiants, dates et situations sont fictifs.

| Dossier | Période | État | Exception | Décision attendue du test |
| --- | --- | --- | --- | --- |
| `D-001` | `2026-08` | `attente_pieces` | aucune date de réception | signaler selon le seuil interne |
| `D-002` | `2026-08` | `pieces_incompletes` | `PIECE_MANQUANTE` | rester ouvert jusqu’à décision |
| `D-003` | `2026-08` | `bulletins_calcules` | aucune | demander la revue des écarts |
| `D-004` | `2026-08` | `controle_termine` | date de contrôle présente | autoriser le passage au dépôt |
| `D-005` | `2026-08` | `dsn_deposee` | retour à traiter | interdire la clôture automatique |

### Recette minimale

1. Dupliquez `D-001` sur la même période : la clé d’unicité signale le doublon.
2. Effacez la date de contrôle de `D-004` : l’état devient incohérent.
3. Tentez de clôturer `D-005` avec un retour ouvert : la transition est refusée ou signalée.
4. Saisissez un état absent de la liste : la validation le refuse.
5. Modifiez une cellule protégée de la feuille Calcul : Excel empêche la modification dans le périmètre configuré.

Ce jeu d’essai n’est pas une observation client. C’est un artefact synthétique conçu pour vérifier cinq propriétés du modèle : unicité, cohérence date-état, clôture des exceptions, domaine fermé des états et protection contre une modification accidentelle.

## Gouvernance : finalité, accès et information

Avant la mise en service, décrivez la finalité du classeur, les personnes autorisées à le lire ou le modifier, les données réellement nécessaires et le moment où les historiques sont revus ou supprimés. Ne fixez pas une durée de conservation universelle sans avoir défini la finalité et les contraintes du cabinet.

Si le dispositif permet de contrôler l’activité des personnes, la page de la CNIL citée plus haut demande à l’employeur de pouvoir prouver le respect des conditions, en détaillant notamment « les étapes de l’analyse de nécessité et de proportionnalité, le cycle de vie des données traitées », et d’informer les personnes concernées. Un suivi par dossier n’est pas conforme par sa seule structure : la finalité, les données, les accès et l’usage réel restent déterminants.

Trois tests simples renforcent ce cadrage :

- la vue agrégée fonctionne-t-elle sans donnée nominative sur les gestionnaires ?
- une personne non autorisée peut-elle ouvrir le fichier ou ses exports ?
- le détail conservé est-il nécessaire pour traiter les exceptions du dossier ?

Si une réponse est mauvaise, corrigez le modèle ou les accès avant d’ajouter des graphiques.

## Ce qui s’automatise, ce qui attend une validation, ce qui reste humain

| Se prépare seul | Attend une validation | Reste humain |
| --- | --- | --- |
| L’état de chaque dossier par étape, mis à jour depuis les fichiers du cabinet | Le passage d’une exception à l’état `expliqué` ou `à corriger` | L’arbitrage entre deux dossiers en retard |
| La clé d’unicité, la cohérence date-état et la file des exceptions sans décision | La clôture d’un dossier dont les retours ont été lus | La conversation avec le client dont le dossier bloque |
| Les comptes par état et par échéance dans la vue agrégée | La modification d’une règle de transition | Toute mesure qui porterait sur une personne |

Gardez le classeur tel quel si la saisie est unique, les formules comprises, les modifications relues et les exceptions peu nombreuses. Automatisez la mécanique lorsque la même donnée est ressaisie, qu’une formule critique peut être écrasée, que plusieurs sources doivent être rapprochées ou que les règles d’exception deviennent difficiles à rejouer à la main. Une automatisation alimente ou contrôle la table existante, régénère les calculs et prépare les exceptions ; elle reste [fail-closed](/glossaire#fail-closed) : une donnée absente ou ambiguë bloque la proposition au lieu d’être complétée en silence.

## Erreurs fréquentes

- **Dessiner le tableau de bord avant la table.** Les graphiques masquent alors un modèle de données instable.
- **Utiliser des couleurs comme états.** Une couleur n’a pas de définition stable, ne porte pas de date et se compte mal.
- **Mélanger saisie et formules.** Une valeur manuelle peut remplacer une formule sans alerte visible.
- **Confondre feuille protégée et fichier sécurisé.** La protection de feuille ne gère pas l’accès au classeur.
- **Conserver une exception sans décision.** L’alerte devient un décor et le dossier reste ambigu.
- **Agréger par personne par défaut.** Le suivi quitte le flux de dossiers pour mesurer des individus sans que cette finalité ait été cadrée.

## Questions fréquentes

### Quelles colonnes sont indispensables ?

Au minimum : identifiant du dossier, période, échéance, état, dates des étapes clés, code d’exception, décision et date de mise à jour. Ajoutez une colonne seulement si elle soutient une règle, une preuve ou une décision.

### Peut-on conserver le nom du gestionnaire ?

Une affectation peut servir à l’organisation du travail. Elle ne devient pas par défaut un classement ou une mesure continue de performance. La finalité, l’accès et l’usage de cette donnée se cadrent avant.

### La protection de feuille suffit-elle ?

Non. Elle limite les modifications sur les cellules verrouillées. Microsoft indique qu’elle n’est pas conçue comme une fonction de sécurité. Les droits d’ouverture, de partage et de modification du fichier se gèrent séparément.

### Faut-il un logiciel dédié ?

Pas nécessairement. Le critère est la robustesse du processus : saisie non dupliquée, règles lisibles, calculs régénérables, accès maîtrisés et exceptions traitables. Si ces conditions se dégradent, automatisez la mécanique ou changez de support selon le besoin réel.

## La règle à retenir

Une table `dossier × période`, des états fermés, trois feuilles aux responsabilités distinctes, un jeu d’essai fictif rejoué avant la mise en service, et un pilotage qui compte des dossiers par étape sans jamais classer les personnes. Excel reste alors un support maîtrisé plutôt qu’un empilement de couleurs et de formules invisibles.

## Pour aller plus loin

Ce suivi est l’une des sept familles du pôle paie et social de [la carte des tâches automatisables d’un cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches). Entre `bulletins_calcules` et `controle_termine`, il s’appuie sur [le contrôle des bulletins avant la DSN](/blog/controler-les-bulletins-de-paie-avant-la-dsn) ; après `dsn_deposee`, sur [la lecture des comptes rendus métier](/blog/comprendre-les-comptes-rendus-metier-dsn) ; l’[agrégat non nominatif](/glossaire#agregat-non-nominatif) est défini au glossaire. Nous prenons cette tâche entière : nous écrivons la règle de suivi de votre pôle social dans vos mots, unité, états, transitions et exceptions compris, nous l’automatisons dans le classeur et les outils que votre équipe utilise déjà, elle la recette sur le jeu fictif puis sur vos dossiers, et nous la maintenons. Vous gardez chaque décision sur une exception et tout ce qui touche aux personnes. C’est [la méthode](/methode), et ce sont [nos engagements](/garanties) : des agrégats, jamais un classement.
