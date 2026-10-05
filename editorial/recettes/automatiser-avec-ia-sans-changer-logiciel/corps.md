## Réponse directe

Pour automatiser avec l'IA sans changer de logiciel, commencez par un passage précis entre deux outils : quelle entrée lire, quelle proposition préparer, qui la valide et où constater la suite. Écrivez aussi ce qui arrive lors d'une reprise ou d'une modification humaine. La fiche ci-dessous permet de cadrer ce passage avant de choisir un accès technique, avec un essai fictif qui ne touche aucune saisie.

## Un prompt prépare une réponse ; un passage suit un état

**Un passage entre outils** est le transfert organisé d'une information d'un point de travail à un autre, avec une condition d'entrée et un résultat observable. Exemple : une liste de pièces manquantes devient un brouillon de demande, puis une décision inscrite dans le suivi. Ce n'est pas la migration de tout le dossier.

**Une source de vérité** est l'emplacement désigné pour constater l'état courant. Si la liste de pièces est tenue dans un suivi partagé, le texte d'une conversation ne devient pas une nouvelle liste de référence. **Une proposition** est une sortie préparée et encore modifiable ; **une saisie** est une information que le collaborateur a enregistrée et que la préparation ne réécrit pas.

Le [prompt pour expert-comptable](/blog/prompt-chatgpt-expert-comptable) aide à préparer une sortie ponctuelle. Ici, la question change : comment éviter de refaire une demande déjà traitée, de travailler sur une ancienne liste ou de perdre la décision au retour dans le suivi ? Un état explicite permet de reprendre au bon endroit. Une conversation seule n'apporte pas cette organisation.

L'IA intervient si une partie de la préparation demande de reformuler ou de synthétiser. La détection d'un identifiant déjà traité, la lecture d'un état ou le contrôle d'une version restent des règles explicites. Inutile de demander au modèle de deviner si un dossier a déjà été pris en charge.

## Pourquoi le passage casse à la main

Le collaborateur ouvre le suivi, vérifie les pièces, prépare un texte ailleurs, le corrige, puis retourne inscrire la suite. Entre ces gestes, une pièce arrive ou une autre personne traite le dossier. Le brouillon reste plausible, mais il ne correspond plus à l'état courant.

La règle implicite tient souvent dans une phrase : « Je vérifie une dernière fois avant de reprendre ce que j'avais préparé. » Celui qui connaît le dossier sait où regarder, ce qu'il avait déjà changé et ce qu'il ne faut pas refaire. Si ce savoir reste dans sa tête, la reprise par un collègue devient une enquête.

L'objet à automatiser est ce passage entier, pas seulement la rédaction du message. La [carte des tâches du cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches) sert à choisir la famille de travail ; la fiche suivante descend au niveau d'une entrée, d'une proposition et d'un résultat vérifiable.

## Avant de commencer : décrire un seul geste

Choisissez un geste que l'équipe sait aujourd'hui terminer à la main. Conservez un exemple entièrement fictif du point de départ et du point d'arrivée. Le premier essai peut porter sur une demande de pièces préparée à partir d'un suivi, sans aucun envoi.

Réunissez ces éléments :

- l'emplacement qui indique l'état courant du dossier ;
- les champs utiles à la préparation, avec un exemple de valeur ;
- la personne chargée de relire et de décider ;
- l'endroit où elle saisit sa décision ;
- le signe observable que le geste est terminé ;
- un cas incomplet et un cas déjà traité.

Si la tâche n'est pas encore claire, commencez par [choisir un premier usage ChatGPT](/blog/utiliser-chatgpt-cabinet-comptable). Si le besoin est surtout de choisir un fournisseur, utilisez plutôt la [grille de choix d'un logiciel IA en comptabilité](/blog/logiciel-ia-comptabilite). Ce guide ne classe pas les éditeurs et ne suppose aucun accès disponible dans votre logiciel.

## La fiche de passage à copier

Voici une fiche remplie pour une démonstration de demande de pièces. Remplacez les valeurs fictives, mais gardez les questions. Elle peut vivre dans un document partagé ; aucun compte supplémentaire n'est nécessaire pour écrire la règle.

| Champ | Exemple fictif rempli | Question à résoudre chez vous |
|---|---|---|
| Geste | Préparer une demande de pièces | Quel résultat complet attend le collaborateur ? |
| Source de vérité | Suivi local F-012, version v1 | Où lit-on l'état courant avant chaque reprise ? |
| Déclencheur | Demande explicite de préparation | Qui lance le passage, à quel moment ? |
| Clé de travail | F-012 + période 2026-09 + demande-pieces | Comment reconnaît-on le même travail ? |
| Entrée minimale | Identifiant fictif, période, état, version, liste des pièces | Quels champs suffisent au geste ? |
| Condition | État à préparer, liste renseignée, aucune saisie humaine | Quand est-il possible de préparer ? |
| Proposition | P-F-012-v1, texte de demande en brouillon | Où la sortie reste-t-elle distincte de la saisie ? |
| Validation | Relecture par le responsable du dossier | Qui décide de garder ou de corriger ? |
| Destination | Zone de brouillon, puis suivi tenu par le collaborateur | Quel emplacement est réellement accessible ? |
| Exception | Version changée, pièce absente, dossier déjà traité | Quel motif suspend la préparation ? |
| Trace | Identifiant de proposition, version d'entrée, résultat | Quelle preuve permet de comprendre la reprise ? |
| Fin du passage | Décision saisie, état constaté dans le suivi | Comment sait-on que le geste a abouti ? |
| Reprise | Lire l'état ; réutiliser le même brouillon si rien n'a changé | Comment éviter une seconde proposition inutile ? |
| Retour arrière | Écarter le brouillon, reprendre la tâche à la main | Que peut-on retirer sans toucher aux saisies ? |
| Propriétaire de la règle | Référent de la tâche, remplaçant désigné | Qui traite un nouveau motif d'exception ? |

La clé de travail identifie le geste, pas le texte. Deux brouillons formulés différemment peuvent concerner la même demande. La version décrit l'entrée utilisée : une proposition préparée sur v1 ne devient pas valide pour v2 simplement parce qu'elle paraît bien écrite.

Gardez aussi l'identifiant de la proposition relue. Dire « validé » sans préciser quelle proposition a été lue laisse une ambiguïté dès qu'une nouvelle sortie existe. La trace sert à retrouver une décision, pas à classer les collaborateurs selon leur cadence.

## Vérifier le format et l'accès réellement disponibles

Avant de construire, demandez un essai sur le geste retenu. Un accès en lecture ne prouve pas un accès en écriture. Une liste de connecteurs ne prouve pas que votre version, vos droits et votre format sont couverts.

| Voie envisagée | Essai concret à demander | Motif de maintien manuel |
|---|---|---|
| Export puis import | Export fictif lu, colonnes reconnues, aperçu du résultat avant import | Champ ambigu, doublon ou destination non contrôlée |
| API, accès programmé à un outil | Lecture de l'objet fictif, droits constatés, résultat et erreur observés | Accès absent, écriture trop large ou retour inexploitable |
| Préparation à côté de l'outil | Brouillon distinct, reprise manuelle et état final vérifié | La copie crée plus de travail que le geste initial |

Ce tableau décrit des essais à mener, pas des intégrations testées ici. Aucune connexion à une messagerie ou à un logiciel comptable n'est utilisée dans notre démonstration. Si le format de destination est inconnu, le résultat reste une proposition à relire hors de cette destination.

Distinguez le contrôle de passage de la qualité du texte. La FAQ de la CNIL indique : « Ces systèmes peuvent générer des résultats inexacts qui peuvent, pourtant, paraître plausibles » ([CNIL, questions-réponses sur l'IA générative](https://www.cnil.fr/fr/les-questions-reponses-de-la-cnil-sur-lutilisation-dun-systeme-dia-generative)). Un statut de préparation réussi ne certifie donc pas le contenu proposé. La [checklist de vérification d'une réponse IA](/blog/verifier-reponse-ia-comptabilite) traite cette relecture.

## La règle écrite

**La frontière.** Pour le passage fictif de demande de pièces, les responsabilités se lisent ainsi :

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Lire l'état, vérifier les champs, produire ou retrouver le brouillon | Texte proposé et version d'entrée encore courante | Juger le besoin, modifier le texte, saisir la décision et envoyer |

**La proposition.** Nous séparons P-F-012-v1 de la zone de saisie humaine. La préparation produit un brouillon identifié ; une reprise identique retrouve ce brouillon au lieu d'en fabriquer un second. Le cabinet garde son suivi et les modifications du collaborateur. La [validation humaine](/glossaire#validation-humaine) porte sur une proposition identifiée, pas sur un dossier abstrait.

**L'arrêt.** Dans cette règle, la préparation cesse si un champ est absent, si l'état est inconnu, si le dossier est déjà traité, si une saisie humaine existe ou si la version a changé depuis la proposition. Chaque refus nomme son motif. Une nouvelle version exige une nouvelle préparation explicitement demandée ; elle n'efface pas la proposition précédente.

**Le jeu d'essai.** Le jeu d'essai fictif est un ensemble d'entrées inventées pour vérifier la règle avant un vrai dossier. Nous avons exécuté huit cas locaux : préparation, déjà traité, entrée absente, saisie protégée, reprise identique, version changée, état inconnu et accord sur une ancienne proposition. Le script teste les états et la séparation des zones, pas une IA ni un logiciel éditeur.

## Rejoué sur le jeu fictif

Les sorties ci-dessous proviennent du rejeu local de cette règle. Le texte de démonstration est construit à partir d'une liste fictive ; ce ne sont pas des réponses obtenues de ChatGPT. Aucun modèle n'a été interrogé, aucun message envoyé et aucune écriture métier créée.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| F-012, v1, deux pièces attendues | PROPOSITION / P-F-012-v1 | Relire « Pièces attendues : relevé A, facture B. » |
| F-013 déjà traité | REFUS / DEJA_TRAITE | Ne pas préparer une nouvelle demande |
| F-014 sans liste de pièces | REFUS / ENTREE_ABSENTE | Renseigner l'entrée avant reprise |
| F-015 avec « Texte corrigé par le collaborateur » | REFUS / SAISIE_PROTEGEE | Garder cette saisie inchangée |
| Reprise de F-012, v1, même entrée | REUTILISER / P-F-012-v1 | Retrouver la proposition existante |
| F-012 passé à v2 après préparation | REFUS / VERSION_CHANGEE | Écarter l'ancienne proposition du passage courant |
| F-016 avec état inconnu | REFUS / ETAT_INCONNU | Faire qualifier l'état |
| Accord sur P-F-012-v0, alors que P-F-012-v1 est courant | REFUS / VALIDATION_PERIMEE | Relire la proposition courante |

Dans le premier cas, le brouillon contient exactement les deux éléments de la liste d'entrée. Cela prouve la construction déterministe de ce texte de démonstration, pas la fiabilité d'une reformulation générée. Dans le quatrième, la saisie reste identique après l'appel. Dans le cinquième, l'identifiant reste P-F-012-v1 : la reprise n'ajoute pas une seconde proposition.

## Reprendre et revenir en arrière sans perdre une décision

Une reprise commence par relire la source de vérité. Si l'état est traité, le passage est clos. Si une saisie humaine est présente, la préparation laisse la place au collaborateur. Si l'entrée n'a pas changé et qu'une proposition existe, elle retrouve cette sortie. Si la version a changé, elle présente le motif plutôt que de réutiliser un brouillon périmé.

Le retour arrière porte sur ce que la préparation possède : son brouillon, son état d'essai et son journal. Il ne signifie pas effacer une décision humaine. Si un message a déjà été envoyé ou une écriture enregistrée dans un autre outil, la suite se traite dans cet outil avec son responsable ; ce guide ne démontre aucune annulation de ces actions.

Testez cette séparation avant d'automatiser une destination. Faites modifier le texte par un collaborateur dans le cas fictif, puis relancez la préparation. Si elle écrase sa modification, le passage n'est pas prêt. Faites aussi rejouer le même identifiant deux fois : un second lancement ne devrait pas être une seconde action.

## Quand garder la tâche manuelle

Gardez le geste manuel lorsque ses règles changent à chaque dossier, lorsque la source de vérité n'est pas identifiée ou lorsque la destination ne permet pas de constater le résultat. Un prompt ponctuel peut rester utile à la rédaction, même si le passage ne se prête pas encore à une automatisation.

Pour évaluer l'intérêt, observez le geste complet : lecture, préparation, relecture, exceptions, saisie finale et reprise. Notez les opérations répétées et celles qui demandent réellement du jugement. Un texte obtenu rapidement n'est pas un gain si le collaborateur passe ensuite plus de temps à rétablir les pièces manquantes ou à retrouver la version.

Avant un engagement, précisez ce qui sera maintenu : format des entrées, accès, règle, cas d'essai, destination et traitement d'une panne. Un changement d'accès ou de colonne peut justifier de suspendre la préparation. Le coût dépend de ces contraintes ; aucun prix ni délai fictif ne permet de trancher pour votre tâche.

## Les erreurs fréquentes

- **Prendre une réponse pour un état.** Un message « terminé » ne prouve pas que le suivi de référence a changé.
- **Confondre reprise et nouveau lancement.** Sans clé de travail, le même geste peut produire deux demandes.
- **Valider une ancienne version.** L'accord porte sur la proposition relue et sur son entrée, pas sur toutes les sorties futures.
- **Mélanger proposition et saisie.** Si elles occupent la même zone, une nouvelle préparation peut détruire le travail humain.
- **Choisir une connexion avant la règle.** Un accès technique ne résout ni les exceptions ni le propriétaire du passage.

## Questions fréquentes

### Faut-il changer de logiciel pour utiliser l'IA ?

Pas pour écrire cette fiche ni pour tester une préparation séparée. Le choix technique vient ensuite, à partir des accès et formats réellement disponibles. Garder le logiciel ne signifie pas que toute connexion est possible.

### L'IA doit-elle piloter tout le passage ?

Non. Les identifiants, états, versions et conditions de reprise peuvent être contrôlés par des règles déterministes. Réservez l'IA au geste de préparation qui en a besoin, avec une sortie relue.

### Que faire si deux personnes traitent le même dossier ?

Désignez un suivi de référence et vérifiez l'état au moment de la décision. Une réalisation technique devra éprouver les accès concurrents et empêcher une double action ; notre rejeu local séquentiel ne teste pas cette concurrence. Sans cette preuve, conservez une décision et une saisie manuelles.

### Un export suffit-il à automatiser ?

Il peut suffire à préparer un brouillon séparé. Il ne prouve ni l'import correct dans la destination ni la fraîcheur de l'état au moment de la reprise. Testez les deux extrémités du passage sur le même cas fictif.

### Comment savoir si la tâche est prête ?

Un collègue peut remplir la fiche, rejouer le cas courant, nommer les refus et retrouver le résultat sans demander à l'auteur ce qu'il avait en tête. L'équipe peut alors recetter la réalisation : vérifier, sur les cas convenus, qu'elle fait bien le geste décrit.

## La règle à retenir

Automatiser dans l'existant commence par écrire le passage et sa reprise, pas par choisir une connexion. La proposition se régénère ; la saisie humaine se conserve.

## Pour aller plus loin

Nous prenons en charge la mécanique de ce passage : observer le geste, écrire ses états et ses exceptions, vérifier les accès, construire la préparation dans vos outils et la faire recetter par votre équipe. Vous gardez le jugement et la décision sur le dossier. Notre [méthode](/methode) décrit ce travail ; le [service d'automatisation des tâches du cabinet](/automatisation-cabinet-comptable) en précise le périmètre.
