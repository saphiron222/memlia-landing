## La tâche dans les mots du cabinet

Le chef de mission ouvre la synthèse, suit un renvoi et trouve une autre version de la feuille. Un collaborateur a ajouté un commentaire ; un autre a déplacé la pièce. Refaire l’index ne doit ni effacer leurs apports ni choisir leur conclusion.

Nous écrivons votre convention de référencement : identifiant de pièce, entité, exercice, cycle, feuille source et emplacement. Puis nous automatisons la préparation de l’index et le repérage des renvois à examiner. Le résultat attendu est un index relisible, accompagné des exceptions, pas une appréciation de la qualité des travaux d’audit.

## La règle écrite

**La frontière.**

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Inventaire des pièces dans le périmètre autorisé ; proposition d’index et de renvois ; signalement des références absentes, doublons et pièces orphelines. | Adoption d’un renvoi proposé ; affectation d’une pièce orpheline ; choix entre contributions concurrentes ; remplacement d’une référence selon la règle du cabinet. | Choix des diligences, appréciation des éléments collectés, conclusions, revue des travaux, opinion et signature du CAC. |

**La proposition.** L’index produit porte son état, sa version et la pièce source. Il reste séparé des commentaires et conclusions saisis par l’équipe. Une nouvelle préparation remplace seulement les propositions générées ; elle conserve les saisies, leurs auteurs et leurs dates. Deux contributions différentes sur le même champ restent visibles : aucune ne gagne parce qu’elle est arrivée en dernier.

**L’arrêt.** Une référence absente ou dupliquée bloque le renvoi concerné. Une pièce sans affectation apparaît comme orpheline, sans cycle inventé. Un conflit suspend l’adoption et présente les deux apports à la personne habilitée. Si l’entité, l’exercice, les droits ou le statut du dossier ne sont pas identifiables, nous arrêtons la préparation. Nous ne réécrivons pas les travaux signés ou le dossier clôturé.

**Le jeu d’essai.** Un jeu fictif est un ensemble de documents et de contributions inventés pour éprouver la règle. La recette est le contrôle du résultat par vos équipes avant usage : références retrouvées, refus expliqués, apports humains inchangés et reprise d’une version précédente. Les règles d’écriture ne sont activées qu’après cette recette.

## Rejoué sur le jeu fictif

Le dossier fictif « Atlas », exercice 2025, comporte des pièces de cycles distincts et des commentaires d’auditeurs fictifs. Le rejeu du 2026-10-06 est enregistré dans `preuves/rejeu.json` ; `node commercial/recettes/dossier-travail-cac/rejouer.mjs` le reproduit. Il vérifie la convention proposée, pas une intégration déjà livrée dans un cabinet.

| Cas joué | Sortie obtenue | Ce qui reste à décider |
|---|---|---|
| Référence B-99 absente | Renvoi non produit ; exception référence absente | Retrouver la pièce ou corriger la référence |
| Deux pièces portent B-01 | Renvoi suspendu ; doublon nommé | Désigner la pièce et sa référence |
| Pièce P-03 sans feuille source | Pièce orpheline dans la liste d’exceptions | Affecter ou écarter la pièce |
| Deux commentaires différents sur F-01 | Conflit soumis à validation ; deux apports conservés | Arbitrer sans effacer les contributions |
| Pièce B-01 unique et contribution unique | Proposition de renvoi ; commentaire inchangé | Adopter le renvoi après contrôle |
| Dossier signé ou clôturé | Préparation arrêtée ; contributions intactes | Traiter la situation dans le cadre de la mission |

## Ce que nous prenons en charge

Nous observons le passage entre vos feuilles, vos pièces et votre synthèse. Nous écrivons les identifiants et les conditions d’arrêt, construisons la préparation, la faisons recetter par votre équipe et maintenons cette tâche. La livraison comprend l’index proposé, la liste des exceptions, le journal des versions et une fiche outil versable au dossier du CAC.

Cette fiche décrit l’objectif, le périmètre, les formats et sources, la méthode et sa version, les paramètres, les sorties, les limites, les accès et destinataires du traitement, ainsi que les essais attendus et obtenus. Elle laisse un espace à l’appréciation du professionnel. Nous distinguons les opérations de documentation des analyses utilisées pour identifier ou évaluer les risques.

## Ce que le cabinet garde

Votre équipe choisit les pièces utiles, contrôle les renvois, arbitre les conflits et complète la documentation des travaux. Le CAC conserve ses conclusions et son opinion. Une pièce bien indexée n’est pas, par ce seul fait, pertinente ou probante ; un index complet ne démontre pas que les diligences sont suffisantes.

La NEP 230 distingue la documentation au fil des travaux et les interventions après signature. Notre périmètre courant s’arrête au dossier signé ou clôturé. Le complément prévu par son § 10 en cas d’événement entre signature et approbation reste traité par le CAC, hors de la régénération ordinaire de l’index.

## Dans vos outils

Nous partons de votre organisation actuelle : dossiers partagés, feuilles de travail, exports et outils de dossier. Les formats, droits, possibilités de lecture et d’écriture et règles de versionnement sont vérifiés avant engagement. Le service prend en charge une tâche entre ces supports ; il ne remplace pas votre logiciel de dossier et n’impose pas une migration.

Les feuilles maîtresses regroupent les soldes par cycle. Ici, le livrable est différent : maintenir l’index, les liens vers les pièces et les exceptions lors des contributions successives. Le devis précise les données traitées, les flux éventuels vers une IA tierce, les destinataires, les accès de support et la conservation. Aucun traitement local ou absence de transfert n’est affirmé avant vérification.

## La preuve

La démonstration repose sur le dossier fictif et ses exceptions. Le commentaire humain reste identique avant et après préparation ; un conflit laisse les deux versions disponibles. Les résultats du rejeu sont contrôlables sans donnée client.

La NEP 230 § 08 précise : « Les éléments de documentation consignés dans le dossier mentionnent l’identité du membre de l’équipe d’audit qui a effectué les travaux et leur date de réalisation. » Notre proposition conserve ces informations lorsqu’elles sont fournies ; elle ne les invente pas.

La NEP 315 révisée § 14 distingue les outils et techniques automatisés des logiciels qui documentent l’audit. Pour un usage d’identification ou d’évaluation des risques, ses §§ 46 et 48 d) portent sur l’appréciation et sa documentation. La fiche outil est notre support de livraison, pas un modèle prescrit par la norme. Le CAC documente son appréciation et l’usage effectif dans la mission.

Sources : [H2A, NEP 230, Documentation de l’audit des comptes](https://h2a-france.org/normes/documentation-de-laudit-des-comptes/) ; [H2A, NEP 315 révisée](https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/).

## Le prix

Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources à relier, des conventions de références, des exceptions, des accès et des validations. La construction, la recette, la maintenance, le support et les évolutions sont écrits au devis. Nous fixons le résultat attendu avant de développer, sans tarif fictif ni gain chiffré.

## Questions de décision

### Nous avons déjà un outil de dossier : pourquoi confier cette tâche ?

Pour prendre en charge les manipulations qui restent entre vos feuilles, vos pièces et l’index. Si votre outil les traite déjà selon vos règles, nous ne les reconstruisons pas. L’observation sert à délimiter le geste réellement répétitif.

### Deux auditeurs travaillent sur la même feuille : qui l’emporte ?

Personne automatiquement. Les deux contributions sont conservées et présentées ensemble ; la personne habilitée choisit la suite. Une régénération ne remplace jamais un commentaire saisi par le cabinet.

### L’index est-il une preuve que le dossier est suffisant ?

Non. Il aide à retrouver les éléments et les points à examiner. L’étendue des travaux, leur revue et les conclusions restent au cabinet.

### Que faut-il décrire pour commencer ?

Le chemin d’une pièce vers sa feuille, le moment où un renvoi casse et la personne qui le valide. Rien à envoyer : la description suffit. Nous écrivons ensuite la règle dans vos mots et les essais que votre équipe utilisera pour la recette.
