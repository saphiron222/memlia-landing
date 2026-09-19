## Réponse directe

J’ai construit une application complète pour remplacer les classeurs d’un cabinet. Le jour du rendez-vous, la personne qui allait s’en servir tous les jours a dit non : pas au prix, que je n’ai jamais annoncé, mais à l’idée de quitter un fichier qu’elle tenait depuis quinze ans. Elle avait raison. La règle qui en est sortie : on automatise dans l’outil que le cabinet ouvre déjà, et on choisit la tâche sur un relevé de temps, jamais sur une hypothèse.

## La décision de départ, et pourquoi elle paraissait raisonnable

Un cabinet d’expertise comptable tenait sa production sociale dans des classeurs. Un pour le suivi, un pour la facturation, un pour les contrôles de fin de mois. Chaque mois, la même personne rouvrait les mêmes fichiers, recopiait les mêmes colonnes d’un export vers un autre, et rattrapait à l’œil les oublis de la fois précédente.

Ma conclusion m’a paru évidente : le problème, c’est le classeur, donc on remplace le classeur. J’ai construit une application web complète — fiches clients, facturation du mois, relances, courriers types, et une validation humaine obligatoire avant tout envoi. Une évaluation de design menée en dehors de moi lui a donné 8 sur 10 et la mention « niveau professionnel ». J’avais préparé une offre, un prix, une durée d’engagement.

Rien là-dedans n’était bâclé. C’était simplement à côté.

## Ce qui a cassé, et la phrase qui l’a montré

Au rendez-vous de cadrage, la personne qui allait utiliser l’outil tous les jours l’a regardé et a dit non.

Pas non au prix : la conversation s’est arrêtée avant que je l’annonce. Non à l’idée d’abandonner un classeur dont elle connaissait chaque onglet, chaque couleur et chaque exception. Et en l’écoutant, j’ai compris ce que j’avais réellement fabriqué. Je ne lui retirais pas un outil : je lui en ajoutais un. Une fenêtre de plus, un mot de passe de plus, un endroit de plus où aller chercher une information qu’elle avait déjà sous les yeux.

C’est la mesure la plus nette que j’aie eue à ce jour, et elle n’a demandé aucun instrument. L’outil existait, il était fini, il était bon, et il n’a pas été adopté. Un logiciel qu’on n’ouvre pas ne vaut rien, quelle que soit sa note.

J’ai proposé autre chose dans la même heure : on ne remplace pas le classeur, on automatise le travail à l’intérieur. L’expert-comptable a validé le principe le jour même. Cinq jours plus tard, une première automatisation greffée dans ce classeur passait sa recette et servait pour de bon.

Ce déplacement n’a rien d’exotique. La plateforme d’extension d’une suite bureautique existe précisément pour créer des solutions qui étendent des applications Office et interagissent avec du contenu dans des documents Office. L’automatisation vit dans le fichier que la personne a déjà sous les yeux : pas de fenêtre en plus, pas de mot de passe en plus. Le geste reste là où il se faisait ; c’est le travail répétitif qui disparaît.

## La seconde erreur, moins visible : j’avais choisi les tâches sans les mesurer

Le refus n’était que la moitié de la leçon. L’autre moitié a mis des semaines à se voir.

Pour décider quoi automatiser, j’avais regardé les fichiers qu’on m’avait envoyés et j’en avais déduit ce qui devait coûter cher. Déduit. Je n’avais pas relevé combien de temps chaque geste prenait réellement, ni à quelle fréquence il revenait, ni où vivait la donnée dont il avait besoin. J’avais construit sur une intuition bien informée, ce qui reste une intuition.

C’est exactement ce que l’analyse de processus fait dans l’autre sens. Elle aide les entreprises à comprendre leurs processus réels, et en partant des données d’exécution elle fournit une vue claire de la manière dont les processus sont réellement exécutés dans la pratique. Le mot qui compte est *réels* : ce qui est écrit dans une procédure et ce qui se passe le mardi matin sont deux objets différents, et seul le second se chronomètre.

La preuve que je n’avais rien mesuré était sous mes yeux, et je ne l’ai pas vue. Le questionnaire de ce rendez-vous est reparti avec toutes ses lignes de réponse vides. Personne ne s’en est aperçu pendant des mois, parce qu’un manque qu’aucun contrôle ne compte n’existe pour personne.

Une semaine après, j’ai remplacé le questionnaire par un formulaire qui calcule ce qui lui manque : les champs vides et les tâches incomplètes remontent tout seuls dans un bloc à la fin. Un relevé incomplet se voit à la fin du rendez-vous, sur place, pas des mois plus tard.

## Ce que cela a coûté

Une application entière construite, évaluée, jamais vendue, jamais mise en service. Des semaines de travail qui n’ont produit aucune valeur pour le cabinet, et un rendez-vous de cadrage à refaire depuis la première question.

Je ne mettrai pas de chiffre d’économie en face : je n’en ai pas mesuré. Ce que j’ai mesuré, c’est le délai entre le refus et la première automatisation réellement utilisée, greffée dans l’outil existant. Cinq jours. Le savoir-faire était là depuis le début ; c’est le véhicule qui était faux.

## La règle écrite

**La frontière.** Choisir et cadrer une tâche à automatiser se découpe en trois colonnes, lues avant la première ligne de code.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le relevé des gestes d’un mois : durée, fréquence, où vit la donnée | La liste des tâches retenues et, dites à voix haute, celles qu’on écarte | Le choix de ce que le cabinet veut voir pris en charge en premier |
| La règle de la tâche, écrite dans les mots du cabinet | La règle relue et corrigée par la personne qui fait le geste | Le jugement sur ce qui compte comme une exception |
| Le rejeu de cette règle sur un jeu d’essai fictif | La recette par la personne qui utilisera l’automatisation | La décision de mettre en service, ou de s’arrêter |

**La proposition.** Ce que nous produisons, c’est un relevé chiffré et une règle écrite ; ce que le cabinet garde, c’est le choix de la tâche et le dernier mot sur la règle. Nous ne proposons plus un outil avant d’avoir relevé le temps qu’il ferait gagner. Et nous ne proposons plus un outil de plus : l’automatisation se greffe dans le logiciel, le classeur ou la messagerie déjà ouverts, c’est la [proposition puis validation](/glossaire#proposition-puis-validation) qui change, pas l’écran.

**L’arrêt.** Le cadrage s’arrête et le dit dans trois cas. Quand la [règle de cabinet](/glossaire#regle-de-cabinet) n’est pas reproductible — la question se pose telle quelle : si je prends votre fichier et votre règle, une personne qui ne vous connaît pas produirait-elle exactement le même résultat que vous ? Un non écarte la tâche, même celle qui pèse le plus lourd, et une exception « et parfois d’autres cas » vaut un non : seule une liste finie et énumérable sauve la piste. Quand la donnée nécessaire n’existe dans aucun fichier et vit dans la tête de quelqu’un. Et quand le relevé lui-même est incomplet, parce qu’un cadrage bâti sur des lignes vides est une hypothèse déguisée. Dans ces trois cas, nous refusons de nous engager plutôt que de promettre faux : c’est le principe [fail-closed](/glossaire#fail-closed).

**Le jeu d’essai.** La règle est rejouée sur un [jeu d’essai fictif](/glossaire#jeu-d-essai-fictif), des dossiers inventés pour l’exercice qui ne portent aucune donnée de cabinet. Et l’extension ne part pas d’un écran vert : on commence par réaliser rapidement un déploiement test à petite échelle : un poste, une personne, un mois réel, avant d’en parler à quiconque d’autre.

## Rejoué sur le jeu fictif

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Tâche la plus douloureuse du relevé, règle non reproductible par un tiers | Refus « règle non déterministe : une exception non énumérable » | Écartée, exclusion annoncée à voix haute devant l’équipe |
| Tâche discrète, revenant chaque semaine, donnée déjà dans le fichier ouvert | Gain annuel calculé par durée multipliée par fréquence, faisabilité haute | Retenue, et passée en premier |
| Tâche fréquente dont la donnée ne vit dans aucun fichier | Refus « donnée absente du système d’information » | Ajournée, une source de donnée à créer d’abord |
| Relevé rendu avec des lignes de réponse vides | Bloc final listant les champs manquants et les tâches incomplètes | Second passage avant tout engagement |

## Questions fréquentes

### Faut-il donc renoncer à tout nouvel outil ?

Non. Il faut renoncer à en ajouter un par défaut. La question n’est pas « quel outil », mais « où se fait le geste aujourd’hui ». Si le travail se fait dans un classeur ouvert huit heures par jour, l’automatisation doit y vivre. Si un logiciel métier est déjà le point d’entrée, elle s’y branche. Un écran neuf se justifie quand la tâche n’a aujourd’hui aucun endroit où se faire.

### Combien de temps prend un relevé sérieux ?

Un passage sur place, poste par poste, avec un formulaire qui chiffre chaque geste en durée et en fréquence et qui signale ses propres trous. Puis un second passage si le premier est revenu incomplet. C’est plus long qu’une intuition, et c’est la seule façon de ne pas construire quelque chose que personne n’ouvrira.

### Et si la tâche la plus pénible est justement celle qu’on écarte ?

Cela arrive, et c’est le cas le plus difficile à annoncer. Une règle qu’un tiers ne peut pas reproduire produira des résultats faux dès qu’elle sortira des mains de son auteur. Nous le disons devant la personne concernée, avec la raison, et nous cherchons ce qui peut être automatisé autour : la préparation, le contrôle, la mise en forme, pendant que le jugement reste humain.

### Pourquoi publier un échec plutôt qu’une réussite ?

Parce que la règle qui compte vient de là. Un cabinet reconnaît tout de suite quelqu’un qui a déjà payé une erreur, et une méthode qui n’a jamais rien coûté à personne n’est qu’un argument commercial.

## La règle à retenir

On n’ajoute pas un outil à une équipe : on automatise le travail là où il se fait déjà. Et on ne choisit pas une tâche parce qu’elle a l’air coûteuse, on la choisit sur un relevé de durée et de fréquence, avec une règle qu’un tiers saurait reproduire. Tant que ces deux conditions ne sont pas réunies, il n’y a rien à vendre et rien à construire.

## Pour aller plus loin

- [La carte des tâches d’un cabinet comptable](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches), pour situer une tâche avant de la cadrer.
- [Suivre la production sociale dans un classeur](/blog/suivre-la-production-sociale-dans-excel), un exemple de tâche reprise dans l’outil déjà ouvert.
- [Notre méthode](/methode) et [nos garanties](/garanties), qui décrivent le relevé, la règle écrite et la recette.
