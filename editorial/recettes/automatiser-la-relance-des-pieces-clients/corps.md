## Réponse directe

Automatiser la relance des pièces clients, c’est tenir pour chaque dossier la liste des pièces attendues sur la période, constater ce qui manque, préparer une relance à cadence fixe et la faire cesser à réception. Trois briques suffisent : une checklist conditionnelle, un contrôle de complétude, une cadence qui cesse. La relance part après validation, jamais seule, et tout dossier en litige sort du circuit.

## Qu’est-ce que la relance de pièces, et pourquoi elle casse à la main

**La relance de pièces** est la demande, adressée à un client à cadence définie, des pièces qu’un cabinet attend pour tenir une période comptable, et qui cesse dès que la pièce est reçue et lisible. **La complétude du dossier** est l’état d’un dossier dont toutes les pièces attendues pour une période sont reçues et exploitables. Les deux notions vont ensemble : on ne relance bien que ce dont on sait précisément qu’il manque.

Chaque mois, la période ne peut pas être tenue parce que des pièces manquent : un relevé, des factures d’achat, la caisse du dernier trimestre. Le collaborateur relance à la main, client par client, depuis sa messagerie. Deux choses cassent alors. Personne ne sait qui a déjà été relancé, ni quand, ni pour quoi ; la deuxième relance répète la première ou l’oublie. Et l’on relance des pièces déjà reçues, parce que la réception n’a pas été constatée au bon endroit. Le résultat n’est pas seulement du temps perdu : c’est un client agacé par une relance inutile, et une pièce vraiment manquante qui attend.

La cause n’est pas la messagerie, ni le client. C’est l’absence d’une règle écrite : quelles pièces sont attendues pour ce dossier et cette période, dans quel état, et à partir de quand on relance. La suite décrit cette règle en trois briques, rejouables dans un classeur et une messagerie ordinaires, sans changer d’outil. C’est une méthode Memlia, pas une procédure réglementaire : chaque cabinet en fixe les paramètres.

## Avant de commencer : ce qu’il faut avoir sous la main

- La liste des dossiers du portefeuille, avec pour chacun son régime d’imposition, sa périodicité de TVA, la présence de salariés, d’une caisse, d’immobilisations ou d’emprunts.
- La messagerie du cabinet et ses messages types de relance, tels qu’ils existent aujourd’hui.
- Un classeur de suivi, même sommaire : une ligne par dossier et par période suffit pour démarrer.
- L’adresse de contact de chaque client pour les pièces, et rien de plus : ni bulletins, ni relevés, ni grand livre ne sont nécessaires à la relance.
- Une personne désignée pour valider les envois et traiter la file des refus.

## Brique 1 : la checklist conditionnelle par dossier

Une liste unique de pièces ne marche pas, parce que deux dossiers n’attendent pas les mêmes pièces. La checklist est donc conditionnelle : elle dépend du régime du dossier, de sa périodicité de TVA, de la présence de salariés, d’une caisse, d’immobilisations, d’emprunts. Pour un dossier donné, ces conditions produisent la liste des pièces attendues sur la période : relevés bancaires de chaque compte, factures d’achat, factures de vente ou journal de caisse, notes de frais, échéanciers d’emprunt, pièces sociales quand elles ne viennent pas du cabinet.

La checklist s’écrit une fois par condition, pas une fois par dossier. Quand un dossier change de régime ou ouvre un compte, sa liste change avec lui. C’est la première [règle de cabinet](/glossaire#regle-de-cabinet) à écrire, dans les mots du cabinet : « pour un dossier soumis à la TVA mensuelle, on attend chaque mois les relevés de tous les comptes et les factures d’achat ; pour un dossier en franchise, les relevés suffisent ». Rien de plus savant qu’une phrase par condition.

| Condition du dossier | Pièces attendues chaque période | Pièces attendues à l’exercice |
|---|---|---|
| Soumis à la TVA, déclaration mensuelle | Relevés de chaque compte, factures d’achat, factures de vente ou journal de caisse | Échéanciers d’emprunt mis à jour, inventaire |
| Franchise en base | Relevés de chaque compte | Factures d’achat de l’exercice, inventaire |
| Salariés | Pièces sociales non produites par le cabinet | Contrats et avenants signés |
| Caisse | Journal de caisse de la période | Comptage de fin d’exercice |
| Emprunt ou immobilisations | Échéance du mois | Tableau d’amortissement, actes d’acquisition |

## Brique 2 : le contrôle de complétude

Une pièce attendue passe par quatre états, et pas trois : attendue, reçue, lisible, hors période. « Reçue » ne suffit pas : un relevé scanné de travers, une facture tronquée, un fichier vide sont reçus et inutilisables. « Hors période » évite l’erreur la plus courante : une pièce d’un autre mois, classée comme reçue, qui laisse croire que la période est complète. Le contrôle de complétude compare, pour chaque dossier et chaque période, la liste attendue et l’état de chaque pièce, et produit une seule chose : la liste de ce qui manque encore.

Ce contrôle est purement déterministe. Il ne juge pas, il compare. C’est ce qui le rend automatisable en toute sécurité : s’il se trompe, c’est que la checklist ou l’état a été mal renseigné, et l’erreur est visible. Il ne déclare jamais un dossier complet de lui-même : la complétude d’une période se valide par une personne, parce que c’est elle qui engage la suite du travail.

## Brique 3 : la cadence qui cesse à réception

La relance suit une cadence choisie par le cabinet, par exemple une première relance quelques jours après la date attendue, une seconde une semaine plus tard, puis une remontée à la personne en charge du dossier. Les délais sont des paramètres du cabinet, pas des normes ; ce qui compte est ailleurs. Une relance ne part que si une pièce est encore manquante au moment de partir, jamais sur la base de l’état d’il y a trois jours. Une relance porte la liste exacte des pièces manquantes, pas une demande générique. Et la cadence cesse dès que la pièce est reçue et lisible, sans que personne ait à la désactiver.

Chaque relance est préparée depuis le message type du cabinet, avec la liste des pièces, puis proposée à validation. La personne qui valide voit ce qui va partir, à qui, et pourquoi. Le journal des relances tient, par dossier, la date, les pièces demandées et l’état au moment de l’envoi : c’est lui qui répond, plus tard, à la question « a-t-on relancé, et quand ».

## La règle dans les mots du cabinet

| Déclencheur | Condition | Action | Exception |
|---|---|---|---|
| Une période s’ouvre pour un dossier | La checklist du dossier est connue | La liste des pièces attendues est créée, toutes à l’état attendu | Dossier sans checklist : remontée, aucune liste créée |
| Une pièce arrive | Elle correspond à une pièce attendue de la période | Son état passe à reçue, puis à lisible après contrôle | Pièce illisible ou hors période : état dédié, relance ciblée |
| La date de première relance est atteinte | Au moins une pièce est encore attendue | Une relance listant les pièces manquantes est préparée et proposée | Dossier en litige ou signalé : aucune relance proposée |
| Une relance est validée | Le message type est complet | La relance part, le journal l’enregistre | Message incomplet : rien ne part |
| Toutes les pièces sont lisibles | La période est complète | La cadence cesse, la complétude est proposée à validation | Aucune |

## Ce que l’outil refuse, et pourquoi

Le refus n’est pas une panne, c’est la partie la plus utile de la règle. L’outil ne relance pas un dossier signalé en litige, en contentieux ou en fin de mission : une relance automatique y ferait plus de mal qu’une pièce manquante. Il ne relance pas un dossier dont la checklist n’a pas été renseignée : relancer « les pièces habituelles » sans savoir lesquelles est exactement l’erreur qu’on veut supprimer. Il n’envoie rien sans validation, même quand la règle est certaine. Et il ne déduit jamais qu’une pièce est reçue parce qu’un courriel est arrivé : la réception se constate sur la pièce, pas sur le message.

Chaque [cas de refus](/glossaire#cas-de-refus) remonte dans une file unique, avec le dossier, la raison et la date. Cette file est traitée d’un coup, une fois par jour ou par semaine, par une personne. Elle vaut mieux qu’une alerte par cas, qui finit ignorée.

## Ce qui s’automatise, ce qui attend une validation, ce qui reste humain

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| La liste des pièces attendues, dossier par dossier, période par période | L’envoi de chaque relance préparée | Le contact avec un client en litige ou en difficulté |
| Le constat de ce qui manque, avec l’état de chaque pièce | La déclaration qu’une période est complète | La décision de sortir un dossier du circuit |
| L’arrêt de la cadence à réception | La modification d’une checklist quand un dossier change | La qualification d’une pièce ambiguë |

## Le jeu fictif

Six dossiers inventés suffisent à rejouer la règle. Un commerce soumis à la TVA mensuelle avec une caisse : relevés de deux comptes, factures d’achat, journal de caisse, chaque mois. Une profession libérale en franchise : relevés d’un compte, chaque trimestre. Une société avec salariés et un emprunt : relevés, factures, échéancier, pièces sociales. Une holding sans activité : un relevé. Un dossier en litige, signalé comme tel. Un dossier nouveau, dont la checklist n’a pas encore été renseignée.

Sur ce jeu, la règle produit exactement ce qu’on attend d’elle. Les quatre premiers dossiers reçoivent une liste attendue conforme à leurs conditions ; deux d’entre eux ont une pièce manquante à la date de première relance et une relance ciblée leur est proposée ; l’un des deux envoie une pièce hors période, qui reste à l’état dédié et déclenche une relance précisant la période attendue. Le dossier en litige ne reçoit rien et apparaît dans la file. Le dossier sans checklist n’a aucune liste et apparaît aussi dans la file, avec sa raison. C’est ce jeu, et non une promesse de gain, qui prouve la règle avant qu’elle ne touche un vrai dossier.

## Le cadre : données, conservation, sous-traitance

Une relance de pièces manipule des données personnelles, ne serait-ce que le nom et l’adresse de courriel du contact chez le client. Le [principe de minimisation](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2) s’applique tel quel : les données doivent être adéquates, pertinentes et limitées à ce qui est nécessaire au regard des finalités pour lesquelles elles sont traitées. L’outil qui relance n’a besoin ni des bulletins, ni du grand livre, ni de l’historique bancaire ; il a besoin de la checklist, des états et d’une adresse de contact.

La durée compte aussi. La CNIL rappelle, dans sa fiche sur [les durées de conservation](https://www.cnil.fr/fr/passer-laction/les-durees-de-conservation-des-donnees), que pour de nombreux traitements de données, la durée de conservation n’est pas fixée par un texte ; c’est alors au cabinet de la fixer, et le journal des relances a besoin d’une règle de purge écrite. Les pièces elles-mêmes obéissent au régime de conservation des documents d’entreprise décrit par [Service-Public](https://entreprendre.service-public.gouv.fr/vosdroits/F10029) : une entreprise doit conserver tout document émis ou reçu dans l’exercice de son activité pendant une durée minimale, ce qui borne le classement des pièces reçues bien au-delà de la relance.

Enfin, si l’outil de relance est hébergé par un tiers, ce tiers traite des données pour le compte du cabinet. La CNIL [définit ainsi le sous-traitant](https://www.cnil.fr/fr/definition/sous-traitant) : la personne physique ou morale (entreprise ou organisme public) qui traite des données pour le compte d’un autre organisme. Le contrat qui l’encadre fait partie du cadrage, avant la première relance. Ce cadre ne rend pas la relance plus lourde : il lui donne ses limites, et c’est à ces limites qu’on reconnaît une automatisation que le cabinet peut assumer devant ses clients.

## Les erreurs fréquentes

- **Relancer sur l’état d’hier.** Une relance préparée le matin et envoyée le soir peut réclamer une pièce reçue entre-temps. La règle relit l’état au moment de l’envoi.
- **Confondre reçu et lisible.** Un fichier vide ou un scan tronqué compte comme reçu dans la plupart des messageries ; il n’est lisible pour personne.
- **Une liste de pièces pour tout le portefeuille.** Elle est fausse pour la moitié des dossiers et fait relancer des pièces qui n’existent pas.
- **Relancer un dossier en litige.** Le message est identique, ses effets ne le sont pas. Le signalement du dossier passe avant la cadence.
- **Traiter les refus un par un.** Une alerte par cas se perd ; une file relue à heure fixe se traite.
- **Garder les relances sans règle de purge.** Le journal est utile, il n’est pas éternel.

## Questions fréquentes

### Combien de relances avant de remonter à une personne ?

C’est un paramètre du cabinet, pas une norme. Le jeu fictif ci-dessus fonctionne avec deux relances puis une remontée ; un cabinet peut en choisir une seule, ou trois, selon sa relation avec ses clients. Ce qui ne se négocie pas, c’est que la cadence cesse à réception et que chaque envoi soit validé.

### Peut-on relancer par la messagerie du cabinet, sans outil dédié ?

Oui. La règle se tient dans un classeur (une ligne par dossier et par période) et les messages types de la messagerie. Un outil ne fait que rejouer cette règle plus vite et tenir le journal ; il ne la remplace pas.

### Que faire d’une pièce reçue hors période ?

Elle reste dans son état dédié, ni attendue ni reçue pour la période en cours. La relance suivante précise la période attendue, et la pièce est conservée pour la période à laquelle elle appartient.

### La relance automatique de pièces est-elle compatible avec le secret professionnel ?

Elle l’est si la relance ne contient que la liste des pièces attendues et l’adresse du contact, sans donnée issue du dossier, et si l’outil qui la prépare est encadré par un contrat quand il est hébergé par un tiers. C’est le sens du principe de minimisation rappelé plus haut.

### Quand une période est-elle vraiment complète ?

Quand toutes les pièces attendues sont à l’état lisible et qu’une personne l’a validé. L’outil propose la complétude, il ne la déclare pas.

## La règle à retenir

Une checklist par condition, quatre états par pièce, une cadence qui cesse à réception, une validation avant chaque envoi, et une file pour ce que la règle refuse. Le reste, délais, messages, canal, appartient au cabinet.

## Pour aller plus loin

Cette famille est la première de [la carte des tâches automatisables d’un cabinet](/blog/automatiser-un-cabinet-comptable-la-carte-des-taches), et la collecte des variables de paie lui ressemble trait pour trait, comme le montre [le contrôle des bulletins avant le dépôt](/blog/controler-les-bulletins-de-paie-avant-la-dsn). La [pièce justificative](/glossaire#piece-justificative) est définie au glossaire. La [méthode Memlia](/methode) part de la règle écrite ci-dessus, la rejoue sur vos fichiers en recette, et la code dans les outils que vous utilisez déjà.
