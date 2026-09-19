## Réponse directe

J’ai livré un outil d’automatisation en promettant qu’il s’installerait sans droits d’administrateur. Chez son utilisateur, l’installation s’annonçait réussie et rien ne se chargeait. La cause tenait à l’endroit où la déclaration de l’outil est lue. La règle qui en est sortie : les accès et les droits se vérifient avant tout engagement, et l’installation refuse d’écrire plutôt que de faire semblant.

## La promesse, et ce que l’utilisateur a vu

Le 20 août 2026, j’ai livré à un cabinet un outil qui vient se greffer dans un logiciel que ses équipes utilisent tous les jours. Je l’avais annoncé comme installable sans droits d’administrateur, et je l’avais écrit en toutes lettres dans l’historique du projet : « réellement sans admin ». Vu de ma machine, c’était vrai : l’installation se déroulait, elle ne réclamait rien à personne, et l’outil apparaissait.

Chez l’utilisateur, l’installation s’est annoncée réussie elle aussi. L’outil figurait bien dans la liste des extensions du logiciel hôte, mais inactif, avec une colonne « Emplacement » vide et un indicateur de chargement rétrogradé. Et pas une ligne de journal. Aucune erreur, aucun message : l’installation disait oui, et rien ne se chargeait.

Une erreur franche vous oriente. Un succès silencieux vous laisse chercher là où il n’y a rien à trouver, et vous fait douter de l’utilisateur avant de douter de vous.

## Trois hypothèses plausibles, trois allers-retours pour rien

J’ai formulé trois hypothèses défendables : une bibliothèque manquante sur le poste, un défaut de signature de l’assemblage livré, un composant d’interopérabilité absent. Chacune m’a coûté un aller-retour au banc d’essai. Chacune était fausse. Trois fois, j’ai corrigé quelque chose qui n’était pas cassé.

Ce qui a tranché, le 6 septembre 2026, n’est pas une quatrième hypothèse : c’est une substitution. J’ai pris le même enregistrement, celui que l’installation venait d’écrire, et je l’ai copié tel quel d’un emplacement à l’autre. Sous la ruche de l’utilisateur, l’activation rend une erreur « fichier introuvable ». Sous la ruche de la machine, le même enregistrement s’active. Une seule variable avait bougé, et elle expliquait tout.

Le système trouvait bien la déclaration de l’outil. Mais la couche qui charge le code va lire son emplacement uniquement dans la ruche de la machine, jamais dans celle de l’utilisateur. Ce comportement est écrit. Les applications qui nécessitent des droits d’administrateur doivent inscrire leurs composants pendant l’installation dans la configuration par ordinateur. L’emplacement symétrique, celui de l’utilisateur, contient des paramètres qui s’appliquent uniquement à l’utilisateur interactif, et la couche de chargement n’y passe pas.

La conséquence est sans appel. Pour ce type d’outil, « sans droits d’administrateur » n’existe pas. Ce n’était pas un défaut à corriger dans mon code : c’était une promesse impossible, et je l’avais faite. Le même cadre le dit autrement : une installation par ordinateur est nécessaire pour permettre à tous les utilisateurs de l’ordinateur d’accéder à l’application, et les utilisateurs standard disposant de privilèges limités peuvent être empêchés d’installer dans le contexte par ordinateur sans obtenir d’abord l’autorisation.

## Le vert qui ne mesurait rien

La partie la plus instructive n’est pas le défaut, c’est l’indicateur. Ma [recette](/glossaire#recette) de livraison, la série de contrôles que je passe avant de déclarer un outil livrable, était verte. Elle l’était le jour de la livraison, et pendant toutes les semaines où l’outil ne se chargeait chez personne.

Elle était verte parce que le poste d’essai portait encore l’enregistrement d’une installation antérieure, faite quand je disposais des droits nécessaires. La recette ne mesurait pas ce que l’installateur venait de faire : elle mesurait un résidu. Le contrôle existait, la commande passait, le résultat s’affichait, et il ne prouvait rien.

Depuis, je pose une seule question devant un indicateur vert : qu’est-ce qui aurait rougi si le défaut existait ? Quand la réponse est « rien », l’indicateur n’est pas une preuve. C’est le réflexe que nous appliquons aux contrôles d’une [chaîne de saisie automatisée](/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier) : un contrôle ne vaut que par ce qu’il sait refuser.

## La règle écrite

**La frontière.** Mettre une automatisation en service chez un cabinet se découpe en trois colonnes, lues avant la première ligne de code.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Le relevé des droits, des accès et des versions d’un poste | L’ouverture d’un droit non accordé par défaut | La décision d’accorder ce droit, ou de le refuser |
| La pose de l’outil et de son témoin sur un poste d’essai purgé | La recette par la personne qui utilisera l’outil | Le jugement sur ce que l’outil fait du travail |
| Le journal d’installation, horodaté et lisible | La mise en service sur les autres postes | La décision de mettre en service, ou de revenir en arrière |

**La proposition.** Ce que je produis, c’est un installateur et son journal ; ce que le cabinet garde, c’est la décision d’ouvrir un droit et le moment où il l’ouvre. Je ne demande plus un accès « pour voir ». Je nomme le droit exact, sa portée, ce qu’il permet et ce qu’il ne permet pas, puis j’attends. Une automatisation qui négocie discrètement ses conditions en s’installant n’est pas une automatisation de confiance.

**L’arrêt.** L’installation refuse d’écrire et nomme sa condition dans quatre cas : quand elle ne peut pas écrire à l’emplacement que la couche de chargement ira lire ; quand elle trouve l’enregistrement d’une installation précédente qu’elle n’a pas posée ; quand le poste porte une version du logiciel hôte qu’elle ne sait pas viser ; quand le journal ne peut pas être écrit, parce qu’une installation dont il ne reste aucune trace ne se recette pas. Dans ces quatre cas, elle cesse, écrit la condition manquante en clair, et ne laisse rien derrière elle. C’est le principe [fail-closed](/glossaire#fail-closed) : dans le doute, on refuse d’écrire plutôt que d’écrire faux.

**Le jeu d’essai.** La règle est rejouée sur un jeu d’essai fictif, des postes de démonstration inventés pour l’exercice, qui ne portent aucune donnée de cabinet. Trois états, joués avant chaque livraison : un poste sans le droit demandé, un poste qui porte le résidu d’une installation antérieure, un poste sain. La mise en service n’attend pas un écran vert : elle attend l’outil qui charge, à l’écran, à côté d’un témoin qui charge aussi, plus le journal écrit.

## Rejoué sur le jeu fictif

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Poste sans le droit demandé | Refus « droit d’écriture absent à l’emplacement lu au chargement », rien d’écrit | Mise en service suspendue, condition transmise au cabinet |
| Poste portant le résidu d’une installation antérieure | Refus « enregistrement préexistant non posé par cet installateur », purge proposée | Purge validée par une personne, puis nouvelle mesure |
| Poste sain, droit accordé | Outil chargé et témoin chargé à l’écran, journal complet horodaté | Mise en service ; ce poste devient la référence |
| Poste sain, version d’hôte non visée | Refus « version du logiciel hôte hors périmètre », rien d’écrit | Poste écarté, périmètre rouvert au devis |

## Questions fréquentes

### Faut-il ouvrir des droits d’administrateur pour toutes vos automatisations ?

Non, c’est l’exception. Beaucoup de tâches s’automatisent sans rien toucher au poste : un classeur, un export, un dossier partagé. La question ne se pose que pour un outil qui doit se greffer à l’intérieur d’un logiciel déjà installé. Dans ce cas, je vous le dis au cadrage, avec le droit exact et sa portée, et vous décidez avant que rien ne soit construit.

### Que se passe-t-il si notre informatique refuse ce droit ?

Le refus est une réponse, et elle arrive tôt. Nous changeons alors de chemin : la même règle peut vivre ailleurs, dans un fichier, un export ou une application qui ne demande rien au poste. Ce qui change, c’est le véhicule, pas la tâche.

### Comment savoir, avant de signer, si cela fonctionnera chez nous ?

Parce que nous le mesurons avant. Les accès, les droits et les versions se relèvent sur un poste réel, avant tout engagement, et ce relevé fait partie du devis. Avant le parc entier, nous commençons par réaliser un déploiement test à petite échelle, sur un poste qui ressemble aux vôtres. C’est l’une des [garanties](/garanties) que nous écrivons noir sur blanc : nous ne nous engageons pas sur un environnement que nous n’avons pas ouvert.

### Pourquoi publier une erreur plutôt qu’une réussite ?

Parce qu’une règle sans cicatrice ne vaut pas grand-chose. Celle-ci m’a coûté trois allers-retours, une promesse à retirer et un installateur à réécrire. Vous pouvez la prendre telle quelle.

## La règle à retenir

Un droit ne s’estime pas, il se relève sur le poste, avant l’engagement. Et la seule preuve qu’une mise en service tient, c’est l’outil qui charge à l’écran à côté d’un témoin qui charge aussi, sur un poste purgé, avec son journal écrit.

## Pour aller plus loin

La mise en service est l’une des étapes que décrit [la carte des tâches automatisables d’un cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches). Nous la prenons entière : nous relevons les accès, les droits et les versions de vos postes avant de nous engager, nous construisons l’automatisation dans les outils que vos équipes utilisent déjà, nous écrivons l’installateur pour qu’il refuse et nomme sa condition plutôt que de faire semblant, et vos équipes la recettent sur un poste réel. Vous gardez la décision d’ouvrir un droit et celle de mettre en service. C’est [la méthode](/methode) : une tâche prise en charge, pas des sièges.
