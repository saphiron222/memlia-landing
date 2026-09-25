## Réponse directe

La transmission du savoir-faire en cabinet comptable commence par une règle qu’une autre personne peut lire, rejouer et faire valider. Une consigne orale devient un déclencheur, des conditions, une proposition, une validation et des cas d’arrêt. Le jugement ne disparaît pas : la règle montre précisément où il intervient.

Nous partons d’une tâche répétitive reconnue par le cabinet. Nous écrivons son cas courant et ses limites dans les mots de l’équipe, puis nous éprouvons cette frontière sur un jeu fictif. L’automatisation ne vient qu’après, dans les outils déjà utilisés par le cabinet.

Dans cet article :

- la frontière RH de cette méthode ;
- le passage d’une consigne orale à une règle écrite ;
- les sorties réellement obtenues sur cinq cas fictifs ;
- les critères qui permettent de transmettre puis maintenir la règle.

## La frontière RH, dite une fois

Cette méthode traite la transmission d’une règle de production. Elle ne mesure pas la fidélisation et ne permet pas d’attribuer un recrutement, un départ ou le maintien d’une personne à l’automatisation. Le contexte sectoriel est seulement documenté par le communiqué Apec et Conseil supérieur de l’Ordre du 9 décembre 2021, qui évoque [« un contexte de tensions sur le marché de l’emploi cadre, en particulier sur les fonctions d’expertise comptable »](https://corporate.apec.fr/home/actus-medias/toutes-nos-actualites/lapec-et-le-conseil-superieur-de.html), et par [l’OEC Paris, qui pose la question du recrutement, de la fuite des talents et de la fidélisation des équipes](https://lefrancilien.oec-paris.fr/attractivite/comment-recruter-et-fideliser-collaborateurs-cabinet-expert-comptable/). Le résultat pris en charge ici reste borné : une règle écrite, automatisée, recettée et maintenable, sans indicateur RH.

## Le risque du savoir-faire seulement oral

Une consigne orale peut fonctionner longtemps. La personne expérimentée sait quelles pièces regarder, quelles exceptions reconnaître et quand demander un arbitrage. Le problème apparaît quand une autre personne doit reprendre le geste.

« Tu verras selon le dossier » résume une expérience, mais ne dit pas ce qui déclenche l’action. « Fais comme d’habitude » ne décrit ni les conditions nécessaires ni les motifs de refus. La personne qui apprend doit reconstruire la règle à partir d’exemples, parfois sans savoir quel détail était décisif.

Ce flou consomme du temps d’accompagnement sur les cas courants et rend les variantes difficiles à détecter. Il peut aussi donner l’impression qu’une automatisation est impossible, alors que la partie répétitive n’a simplement jamais été isolée du jugement métier.

## Écrire sans rigidifier le métier

Une règle écrite n’est pas une procédure infinie. Elle tient sur une frontière courte : quand commencer, ce qu’il faut vérifier, ce que le système prépare, qui valide et quand s’arrêter.

L’expérience reste indispensable pour placer cette frontière. Une personne expérimentée repère qu’une condition apparemment secondaire change le sens du cas. L’écriture rend cette condition visible ; elle ne décide pas à sa place.

Le livre blanc intersectoriel résumé par l’OEC Paris souligne [la place des dispositifs de développement des compétences et de transmission des savoir-faire dans la création de valeur](https://lefrancilien.oec-paris.fr/attractivite/comment-recruter-et-fideliser-collaborateurs-cabinet-expert-comptable/). La même publication précise que [« les métiers et les savoir-faire évoluent en permanence pour accompagner les stratégies de croissance »](https://lefrancilien.oec-paris.fr/attractivite/comment-recruter-et-fideliser-collaborateurs-cabinet-expert-comptable/). Pour le cabinet, cela conduit à traiter la règle comme un objet maintenu : elle peut être relue, corrigée et rejouée lorsque la pratique change.

La [page de branche d’OPCO Atlas décrit un « enjeu de montée en compétences des collaborateurs pour accompagner cette numérisation »](https://www.opco-atlas.fr/atlas/experts-comptables-commissaires-aux-comptes.html). Ce constat ne mesure ni l’effet de cette règle fictive ni la fidélisation : il situe seulement l’enjeu de transmission dans les cabinets.

## La règle écrite

**La frontière.** Exemple entièrement inventé : à la clôture d’un mois, préparer un contrôle entre le montant du journal des ventes et celui d’un export de contrôle de la même période. Ce n’est ni une règle comptable universelle ni une automatisation Memlia livrée. Pour cet essai seulement, le cabinet fictif décide que la période, les deux montants et la responsable de mission sont requis ; des montants égaux permettent une proposition de contrôle, un écart exige un arbitrage. Rien n’est comptabilisé ni envoyé automatiquement.

**Déclencheur** : les deux sources du mois sont disponibles pour contrôle.

**Conditions** : période, montant du journal, montant de l’export et responsable de mission sont renseignés.

**Proposition** : si les montants sont égaux, la sortie nomme la période, les deux sources et le montant comparé, sans engager le cabinet.

**Validation** : la responsable de mission accepte, corrige ou refuse la proposition après avoir consulté les sources.

**Arrêt** : période ou source absente, montants différents ou règle absente suspendent la proposition avec un motif lisible.

**La proposition.** L’essai calcule une proposition de contrôle, pas une écriture : il montre la période, les deux sources et leur montant commun. La responsable de mission garde la validation.

**L’arrêt.** Sans période, avec deux montants différents ou sans règle écrite, l’essai refuse de proposer et affiche un motif explicite.

**Le jeu d’essai.** Cinq cas fictifs éprouvent le cas courant, l’entrée manquante, la contradiction, l’absence de règle et une seconde période au montant différent. Le script ne prend aucune décision comptable : il compare uniquement les entrées fictives selon cette règle d’essai.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Reconnaître le cas courant | Confirmer la proposition | Définir la règle et ses exceptions |
| Rassembler les éléments prévus | Accepter, corriger ou refuser | Expliquer le contexte à la personne qui reprend |
| Montrer la condition appliquée | Autoriser une action engageante | Faire évoluer la règle avec l’expérience |

Cette frontière n’est pas un catalogue de tâches. Elle décrit une seule répétition stable et les cas qui doivent en sortir.

## Rejoué sur le jeu fictif

Le scénario invente une consigne de préparation. Il ne reprend aucune tâche, règle ou donnée client. Le script `scripts/replay-blog-recrutement-cases.mjs` a exécuté les cinq entrées ci-dessous contre les sorties attendues consignées séparément dans `replay-fixtures.json`. La table consigne les sorties calculées. Ce rejeu illustre la logique de la règle fictive, pas une validation en cabinet ni une preuve d’efficacité RH.

| Cas exécuté | Entrée fictive | Statut obtenu | Message obtenu | Décision issue de l’exécution |
|---|---|---|---|---|
| `TRANS-01` | Août 2026 ; journal des ventes 1200 €, export de contrôle 1200 € | `PROPOSITION` | Contrôle août 2026 préparé : journal des ventes et export de contrôle concordent à 1200 € | Soumettre la proposition à la responsable de mission pour validation |
| `TRANS-02` | La période manque | `ATTENTE` | Entrée manquante : période | Demander l’information manquante avant toute préparation |
| `TRANS-03` | Août 2026 ; journal 1200 €, export 1100 € | `REFUS_CONTRADICTION` | Écart août 2026 : journal des ventes 1200 € / export de contrôle 1100 € | Présenter les deux sources à la responsable de mission pour arbitrage humain |
| `TRANS-04` | Le cas n’a pas de règle écrite | `REFUS_REGLE_ABSENTE` | Aucune règle écrite pour ce cas | Retour au cabinet pour écrire la règle |
| `TRANS-05` | Septembre 2026 ; journal et export 950 € | `PROPOSITION` | Contrôle septembre 2026 préparé : journal des ventes et export de contrôle concordent à 950 € | Soumettre la proposition à la responsable de mission pour validation |

Le rapport de rejeu conserve l’entrée exacte de chaque cas, la sortie calculée et le verdict de comparaison avec les attentes écrites. Le cinquième cas vérifie que la proposition change avec les données d’une autre période. Le quatrième montre pourquoi l’essai refuse en l’absence de règle ; faire appliquer la règle par une seconde personne reste une étape de recette, non un résultat déjà observé.

## Ce qui devient transmissible

Le déclencheur devient nommable. Les entrées nécessaires sont visibles. Les exceptions connues ne sont plus découvertes au hasard. Une proposition montre la condition appliquée, ce qui facilite sa relecture et sa correction.

Cette visibilité sépare deux apprentissages. Comprendre le métier demande du contexte, des échanges et du jugement. Reprendre un geste répétitif demande une règle stable, un exemple et un motif d’arrêt. Le système peut préparer le second sans prétendre absorber le premier.

La maintenance devient un objet collectif. Lorsqu’une pratique change, le cabinet modifie la règle, rejoue les cas fictifs et fait recetter la nouvelle version. La divergence est traitée avant qu’une habitude implicite ne produise deux manières de faire.

## Choisir la première règle à transmettre

La première règle n’est pas nécessairement la tâche la plus longue. C’est une répétition dont le cabinet reconnaît déjà le cas courant, les entrées nécessaires et la personne qui décide. Une consigne encore débattue ou différente à chaque dossier doit d’abord être clarifiée par le cabinet.

Un bon point de départ tient dans une phrase : « Quand ces éléments sont présents, nous préparons cette proposition, puis cette personne la valide. » Cette phrase fait apparaître cinq questions :

1. quel événement déclenche la préparation ;
2. quelles informations sont obligatoires ;
3. quelle sortie peut être préparée sans engager le cabinet ;
4. qui peut accepter, corriger ou refuser cette sortie ;
5. quels cas doivent arrêter le traitement.

La règle est assez précise lorsqu’une seconde personne retrouve le même déclencheur et les mêmes arrêts sur le jeu fictif. Si un test exige encore « demande à la personne qui sait » sans nommer le point d’arbitrage, il faut ajouter la condition manquante ou garder ce cas humain.

L’écriture d’une règle appartient à la famille transversale de [la carte des tâches automatisables d’un cabinet comptable](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches). Le véhicule technique vient ensuite : l’objectif reste la prise en charge d’une tâche répétitive dans les outils existants.

## Vérifier que la règle est transmissible

La preuve se construit sur une règle précise, un jeu d’essai fictif et des sorties observables.

| Point vérifié | Question de recette | Signe que la règle doit être reprise |
|---|---|---|
| Déclencheur | Deux personnes commencent-elles au même moment ? | Le début dépend d’une habitude non écrite |
| Conditions | Les mêmes informations sont-elles exigées ? | Une pièce manque mais le traitement continue |
| Proposition | La sortie montre-t-elle la règle appliquée ? | La personne ne peut pas expliquer le résultat |
| Validation | Le décideur et ses choix sont-ils explicites ? | Une action engageante part sans accord |
| Arrêt | Les exceptions connues provoquent-elles un refus lisible ? | Le système improvise ou masque le doute |

Cette recette vérifie la règle et ses limites. Une correction ne devient pas un score individuel : elle retourne dans la règle après arbitrage du cabinet. La maintenance porte sur le fonctionnement collectif, jamais sur une mesure nominative de productivité.

## Ce qui reste une décision humaine

Choisir la règle, interpréter une exception, accompagner une personne et assumer une action ne sont pas des sorties mécaniques. L’automatisation présente les éléments et prépare le cas courant ; la personne compétente garde l’arbitrage et l’autorisation.

Cette répartition doit rester lisible dans l’outil. Le statut, le motif et la prochaine décision apparaissent ensemble. Un refus sans motif recrée une consigne orale ; une proposition sans responsable de validation transforme une préparation en décision cachée.

## Les erreurs à éviter

### Transformer le savoir-faire en catalogue

Énumérer tout ce que le cabinet fait produit un inventaire difficile à maintenir. On choisit une tâche, puis une règle.

### Confondre documentation et contrôle

La règle décrit le flux. Elle ne sert pas à noter la personne qui l’applique. Aucun score individuel, aucun chronométrage nominatif et aucune surveillance ne sont nécessaires.

### Automatiser avant d’avoir appris

Une consigne variable ne devient pas stable parce qu’elle est codée. Le jeu fictif doit d’abord faire apparaître les conditions et les arrêts manquants.

## La règle à retenir

Une consigne devient transmissible lorsqu’une seconde personne peut reconnaître le même déclencheur, obtenir la même proposition et comprendre les mêmes refus. Le système prépare le courant ; le cabinet écrit la limite, valide la sortie et fait évoluer la règle.

## Pour aller plus loin

[La méthode Memlia](/methode) présente le cycle complet : observation, règle écrite, jeu fictif, recette et maintenance. [Les garanties](/garanties) décrivent le refus et la validation humaine. Pour diagnostiquer les états du flux, lire [où passe le temps dans un cabinet en surcharge](/blog/cabinet-comptable-surcharge-de-travail-ou-passe-le-temps), puis [ce que l’intelligence artificielle prépare et ce qui reste humain](/blog/intelligence-artificielle-metier-comptable-ce-qu-elle-prepare-ce-qui-reste-humain).

Nous écrivons la règle de cette tâche dans vos mots, nous l’automatisons dans les outils que vos équipes utilisent déjà et elles la recettent sur un jeu fictif puis sur vos dossiers. Votre cabinet garde l’accompagnement, les exceptions et chaque décision engageante. [Confier cette tâche](/contact) ne demande aucun document : rien à envoyer, décrivez la tâche et nous vous disons ce qu’il faut pour la prendre en charge.