## La tâche dans les mots du cabinet

Une note de frais arrive avec un justificatif, une date, un montant, un motif et un dossier auquel la rattacher. Le geste répétitif consiste à vérifier que ces éléments sont présents, à reconnaître ce qui peut être préparé selon la règle du cabinet et à isoler ce qui demande une décision. La difficulté n’est pas le cas courant. Elle tient aux justificatifs absents, aux doublons probables et aux dépenses qui sortent du périmètre écrit.

## La règle écrite

**La frontière.** La règle sépare ce qui se prépare sans ambiguïté de ce qui attend le cabinet.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Lecture des champs présents, détection d’un doublon probable et proposition de classement | Note complète, lisible et conforme à la règle écrite du cabinet | Acceptation de la dépense, traitement d’un justificatif manquant et décision sur un cas hors règle |

**La proposition.** L’automatisation prépare un état et son motif. Le collaborateur valide ou corrige avant toute saisie définitive.

**L’arrêt.** Si le justificatif manque, si deux notes semblent identiques ou si la règle ne couvre pas le cas, le traitement s’arrête et nomme la raison. Il ne complète rien par supposition.

**Le jeu d’essai.** Nous avons rejoué la règle sur trois notes fictives : un cas courant, un doublon probable et un justificatif absent.

## Rejoué sur le jeu fictif

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Note complète avec justificatif lisible | Proposition préparée avec les champs extraits | Validation du collaborateur |
| Même montant, même date et même justificatif qu’une note déjà reçue | Doublon probable signalé, aucune proposition finale | Examen par le cabinet |
| Dépense déclarée sans justificatif | Traitement refusé avec motif « justificatif absent » | Décision humaine |

Preuve locale : `preuves/rejeu.json`, rejouée le 2026-09-20.

## Ce que nous prenons en charge

Nous observons le circuit réel, écrivons les contrôles et les motifs d’arrêt dans les mots du cabinet, puis construisons l’automatisation dans les outils déjà utilisés. Nous préparons le résultat, organisons les exceptions, faisons recetter la règle sur des cas fictifs et maintenons son périmètre lorsqu’il évolue.

## Ce que le cabinet garde

Le cabinet garde l’acceptation de la dépense, la validation de la proposition, la correction d’une information et toute décision sur un cas non prévu. La règle ne transforme jamais une pièce incertaine en donnée certaine.

## Dans vos outils

Le point de départ peut être un fichier, un export, une messagerie ou un dossier partagé. Nous vérifions les formats, les accès et la destination de la proposition avant de nous engager. Le véhicule se choisit après cette vérification, jamais avant la tâche.

## La preuve

La preuve n’est pas une promesse de gain. C’est la capacité à rejouer les mêmes cas et à obtenir les mêmes sorties, y compris les refus attendus. Le reçu fictif ci-dessus montre la frontière vérifiée. [Notre méthode](/methode) explique comment cette règle devient une automatisation recettée.

## Le prix

Vous payez une tâche prise en charge, pas des sièges. Le devis dépend du nombre de sources, des règles, des exceptions, des validations et de la maintenance attendue. Le périmètre et les critères de recette sont écrits avant la construction.

## Questions de décision

### Que se passe-t-il quand une pièce manque ?

La note ne poursuit pas le circuit normal. Elle reste visible avec un motif fermé, afin que le collaborateur sache ce qui manque et décide de la suite.

### Le cabinet doit-il changer d’outil ?

Non par principe. Nous partons du geste et des formats réellement utilisés. Les accès et les possibilités d’intégration sont vérifiés avant tout engagement.

### Qui valide le résultat ?

La personne désignée par le cabinet. L’automatisation prépare et explique ; le cabinet saisit, corrige ou refuse.
