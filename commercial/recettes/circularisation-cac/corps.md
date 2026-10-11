## La tâche dans les mots du cabinet

Votre plateforme prépare déjà les lettres, envoie les demandes et suit les relances. e-Circu décrit ces fonctions ; Circit propose aussi le rapprochement des réponses et le signalement des exceptions. Nous ne reconstruisons pas ces gestes. Nous partons de ce qui reste à faire dans votre cabinet : proposer les tiers selon votre règle, justifier leur couverture, puis préparer la feuille des écarts et les pièces des contrôles postérieurs choisis par le CAC.

La circularisation désigne ici les demandes de confirmation des tiers. La NEP 505, § 03, décrit « une déclaration directement adressée au commissaire aux comptes ». Au § 09, elle précise : « Le commissaire aux comptes a la maîtrise de la sélection des tiers à qui il souhaite adresser les demandes de confirmation, de la rédaction et de l’envoi de ces demandes, ainsi que de la réception des réponses. » Notre préparation se place sous cette maîtrise, sans la transférer à l’automatisation.

Une campagne garde ses catégories de tiers. Pour les clients et fournisseurs, la règle précise les soldes et le sens des mouvements retenus. Les autres tiers restent ajoutés par le CAC selon l’objectif de sa demande, sans les faire entrer artificiellement dans une règle de couverture monétaire.

## La règle écrite

La règle écrite fixe les gestes, les limites et les essais avant la construction.

**La frontière.**

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Agrégation par tiers ; classement des soldes et mouvements ; tirage avec graine conservée ; dédoublonnage ; couverture ; rapprochement de données et référencement de pièces autorisées | Paramètres et population contrôlés ; liste proposée et ajouts manuels ; export vers la plateforme ; rattachement d’un retour ; rapprochement proposé avec les pièces postérieures | Méthode de sélection et justification ; choix définitif des tiers ; rédaction, envoi et réception sous maîtrise du CAC ; choix et réalisation des procédures ; appréciation des éléments, conclusions et opinion |

**La proposition.** Le CAC fixe les critères : seuil individuel, plus gros soldes, plus gros mouvements dans le sens choisi, puis part aléatoire avec graine conservée. Il fixe aussi l’arrêt à une couverture ou à N comptes et le calendrier : par exemple une passe au 30/09, puis à la clôture. La seconde passe conserve les tiers antérieurs encore présents et signale ceux absents de la population. La feuille expose motif, montant retenu, dénominateur, couverture, paramètres et graine. Une cible de 70 % est un paramètre fictif de cabinet, jamais un seuil prescrit ni une preuve de suffisance. Un tirage reproductible ne rend pas une sélection spécifique extrapolable à toute la population.

Pour les écarts ou non-réponses, nous préparons les rapprochements de soldes, factures et encaissements ou règlements postérieurs prévus par le CAC. Les correspondances proposées, pièces manquantes et ambiguïtés restent visibles ; la conclusion reste vide. Les commentaires et décisions de l’équipe sont séparés des champs calculés et conservés lors d’un rejeu.

**L’arrêt.** Un tiers sous plusieurs identifiants non résolus, un solde de sens inattendu, une population non rapprochée de la source, une pièce illisible ou une devise ou période différente suspend le calcul concerné. Le dénominateur nul, une cible inatteignable et les tiers absents à la seconde passe sont signalés. Une opposition de la direction ou une non-réponse est transmise au CAC, sans décider d’une procédure ni contourner un refus.

**Le jeu d’essai.** Avant un vrai mandat, nous éprouvons la règle sur un jeu d’essai fictif : des données inventées qui vérifient les cas attendus et ceux qui doivent s’arrêter. Vos équipes acceptent le résultat sur leurs formats et leurs circuits de validation.

## Rejoué sur le jeu fictif

Jeu fictif « Campagne Orme » : calcul local d’une sélection et simulation de propositions documentaires, exécutés le 2026-10-06. Preuves internes rejouables : `preuves/rejeu.json` et `preuves/selection-rejeu.json`. Aucun envoi, lecture de PDF ou connexion à une plateforme n’est démontré. Les pièces postérieures sont des références et montants structurés fictifs, pas des diligences d’audit accomplies.

| Cas joué | Sortie obtenue | Ce qui reste à décider |
|---|---|---|
| Classement par solde puis mouvements ; tirage sur le reliquat, graine conservée | Liste sans doublon, motifs et couverture calculée | Valider méthode, paramètres et liste |
| Deuxième passe à la clôture | Tiers antérieurs conservés, nouveaux tiers ajoutés, absents signalés | Accepter les évolutions de population |
| Arrêt à une couverture ou à N comptes | Seuil atteint ou limite de nombre indiquée ; insuffisance visible | Apprécier la suffisance des travaux |
| Retour reçu, sans identifiant permettant un rattachement sûr | Retour non rapproché, pièce conservée dans la sortie, arrêt du rattachement | Identifier la demande puis apprécier le retour |
| Réponse à une demande fermée : 12 000 attendus, 11 700 retournés, même périmètre, justificatif joint | Écart de −300, justificatif référencé, état « écart documenté à examiner » | Expliquer l’écart et conclure sur les éléments |
| Aucune réponse au jalon interne défini par le cabinet | Absence de réponse transmise au CAC ; aucune procédure choisie par la simulation | Choisir et réaliser les procédures alternatives nécessaires |
| Contrôle postérieur choisi par le CAC, règlement fictif unique de même tiers, devise et montant après clôture | Référence proposée ; pièce manquante ou plusieurs correspondances signalées dans les variantes | Examiner la pièce, réaliser le contrôle et conclure |
| Destinataire présent mais validation d’envoi absente | Brouillon maintenu ; envoi bloqué | Valider rédaction, destinataire et envoi |
| Opposition de la direction enregistrée | Campagne suspendue pour examen du refus | Examiner les motifs et décider des suites |
| Régénération avec commentaire saisi par l’équipe | Commentaire conservé à l’identique | Poursuivre la revue, sans ressaisie imposée |
| Montant retourné dans une autre devise ou période | Comparaison refusée ; aucun écart chiffré | Clarifier le périmètre |
| Réponse à une demande ouverte | Information retournée présentée sans calcul d’accord sur un solde | Analyser l’information au regard de l’objectif de la demande |

Le jalon de suivi est une convention du cabinet, pas un délai réglementaire. La simulation montre une frontière d’états, pas l’exécution de diligences d’audit.

## Ce que nous prenons en charge

Nous observons les étapes encore manuelles, écrivons leur règle, construisons la proposition de sélection et la préparation documentaire dans vos outils, puis les éprouvons et les maintenons. Les lettres, envois et relances restent dans votre plateforme. Si elle applique déjà votre règle complète ou produit déjà la feuille attendue, nous ne reconstruisons pas cette partie.

Vous recevez aussi une fiche outil Memlia versable au dossier du CAC : objectif, périmètre, méthode, version, données d’entrée, paramètres, contrôles de pertinence et de fiabilité, sorties, traces, limites, conditions d’arrêt et résultats des essais. Elle prévoit un espace pour votre appréciation de l’outil et de son usage dans la mission.

La NEP 315 révisée définit les outils et techniques automatisés au § 14. Au § 46, pour leur utilisation dans l’identification et l’évaluation des risques, le CAC apprécie notamment « la manière dont les outils fonctionnent » et « le degré de pertinence et de fiabilité des informations qui sont intégrées dans ces outils ». Le § 48 d) vise la consignation de ces éléments d’appréciation au dossier. Notre fiche est un support de livraison, pas un modèle prescrit ou homologué par cette norme ; elle ne suffit pas à apprécier toutes les procédures de la mission.

## Ce que le cabinet garde

Votre équipe contrôle la population et examine la sélection proposée. Le CAC garde la sélection définitive, la maîtrise de la rédaction, de l’envoi et de la réception, ainsi que les procédures et conclusions. La NEP 530, § 04, réserve à son jugement professionnel le choix des méthodes de sélection ; une couverture calculée ne constitue pas un avis sur leur suffisance.

Une non-réponse ne vaut ni accord ni fin des travaux. La NEP 505, § 13, prévoit : « Lorsque le commissaire aux comptes n’obtient pas de réponse à une demande de confirmation, il met en œuvre des procédures d’audit alternatives permettant de collecter les éléments qu’il estime nécessaires pour vérifier les assertions faisant l’objet du contrôle. » Les procédures supplémentaires et l’appréciation finale des éléments relèvent également du CAC (§§ 14 et 15). Une opposition de la direction fait l’objet de son examen (§§ 10 à 12), pas d’une relance automatique qui contourne le refus.

Pour les missions entrant dans leur champ propre, les NEP 911 § 24 (mandat limité à trois exercices) et 912 § 23 (petites entreprises, six exercices), homologuées par arrêté du 24 juillet 2026 publié le 26 juillet, décrivent une faculté : lorsque le CAC intervient plusieurs semaines après clôture, il peut estimer pertinent de contrôler les créances clients par les encaissements postérieurs et les dettes fournisseurs par les factures reçues ou règlements postérieurs. Ces techniques peuvent limiter les confirmations ou s’y substituer. Le CAC apprécie cette possibilité ; ce n’est ni une dispense générale de confirmation ni un traitement automatique des non-réponses. La feuille prépare les données des contrôles retenus ; elle ne prononce aucun statut de conformité et ne prépare aucune opinion.

## Dans vos outils

Nous partons de la balance auxiliaire ou du FEC, de la règle écrite, des retours de votre plateforme et des données postérieures autorisées. Nous vérifions d’abord le nom, l’édition et les options de votre outil : des filtres de sélection ou des briques de sondage peuvent déjà couvrir une partie du geste. Le reste se définit sur votre usage, sans prétendre qu’aucun éditeur ne sait sélectionner des tiers. Formats, identifiants, droits et possibilités d’export sont éprouvés avant engagement ; aucune connexion n’est promise sur le seul nom d’un produit.

Les sorties distinguent proposition, validation, export et examen des pièces. Nous définissons les données lues, les destinataires, les accès du support, la conservation et les traitements tiers avant usage sur un mandat. Nous ne présumons ni traitement exclusivement local ni absence de transfert. Dans un cabinet mixte, missions, accès et responsabilités restent séparés ; le CAC apprécie les conditions d’indépendance.

## La preuve

Les rejeux présentent les entrées, les sorties attendues et obtenues : sélection, deux passes, arrêts, puis états des écarts et non-réponses. Ils ne mesurent aucun gain et ne démontrent pas une automatisation déjà livrée à un cabinet. Les essais d’acceptation de la tâche réelle vérifient les agrégations, les motifs, le dénominateur, l’export et les rapprochements documentaires, puis la préservation des saisies.

Références : [H2A, NEP 505](https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/) ; [NEP 530](https://h2a-france.org/normes/selection-des-elements-a-controler/) ; [NEP 315 révisée](https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/) ; [NEP 911, § 24](https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-trois-exercices-prevue-a-larticle-l-823-12-1-du-code-de-commerce/) ; [NEP 912, § 23](https://h2a-france.org/normes/mission-du-commissaire-aux-comptes-nomme-pour-six-exercices-dans-des-petites-entreprises/). Fonctions déclarées par les éditeurs : [e-Circu](https://www.gestonline.com/blog/circularisation-audit), [Circit](https://www.circit.io/fr/platform/confirm).

## Le prix

Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources, des critères, des deux passes, des pièces et exceptions à rapprocher et des accès à maintenir. Construction, essais d’acceptation, maintenance, support et évolutions y sont décrits. Un modèle gratuit aide à organiser une campagne ; ce service applique la règle du cabinet et prépare les feuilles récurrentes que son environnement ne produit pas déjà.

## Questions de décision

### Peut-on confier seulement la sélection ?

Oui. Nous partons de la population contrôlée et de la règle validée par le CAC. La liste proposée et sa couverture sont exportées après validation ; votre plateforme conserve la campagne.

### Les relances partent-elles sans contrôle ?

Notre préparation n’envoie ni demande ni relance. Ces fonctions restent à la plateforme et au circuit sous maîtrise du CAC.

### Le service choisit-il les tiers et les procédures alternatives ?

Il calcule une proposition de tiers selon la règle que le CAC a définie. Celui-ci valide la liste, choisit les procédures, apprécie les pièces et décide des suites. Une graine et une couverture documentent le calcul, pas la suffisance des éléments collectés.

### Que se passe-t-il si la réponse contredit le solde ?

Le journal présente l’écart et les pièces associées, sans effacer le montant de départ. L’équipe examine l’explication ; le CAC apprécie les éléments collectés.

### La fiche outil remplace-t-elle notre appréciation ?

Non. Elle décrit ce que fait l’automatisation, sur quelles données et avec quelles limites. Vous documentez son appréciation et son utilisation dans votre mission.

[Confier une première tâche](/contact)
