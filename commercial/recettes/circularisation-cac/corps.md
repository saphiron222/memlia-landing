## La tâche dans les mots du cabinet

Une réponse arrive, mais personne ne sait encore à quelle demande la rattacher. Une autre présente un solde différent. Une troisième manque alors que le chef de mission doit revoir la campagne. Nous prenons en charge cette mécanique : préparer les demandes à partir de votre sélection, tenir le journal et présenter les retours à rapprocher, les écarts et les absences de réponse dans vos outils.

La circularisation désigne ici les demandes de confirmation des tiers. La NEP 505, § 03, décrit « une déclaration directement adressée au commissaire aux comptes ». Au § 09, elle précise : « Le commissaire aux comptes a la maîtrise de la sélection des tiers à qui il souhaite adresser les demandes de confirmation, de la rédaction et de l’envoi de ces demandes, ainsi que de la réception des réponses. » Notre préparation se place sous cette maîtrise, sans la transférer à l’automatisation.

Une campagne regroupe vos clients, fournisseurs, banques et autres tiers retenus. Chaque catégorie garde les informations et les demandes choisies par le CAC ; les variantes ne deviennent pas des campagnes indépendantes à recopier.

## La règle écrite

La règle écrite fixe les gestes, les limites et les essais avant la construction.

**La frontière.**

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Brouillons depuis une sélection fournie ; journal par identifiant de demande ; comparaison de montants à périmètre identique ; liste des points en suspens | Rédaction finale, destinataire et canal sous maîtrise du CAC ; autorisation de chaque envoi et relance ; rattachement proposé d’un retour ; reprise après correction | Choix des tiers, du type ouvert ou fermé et des informations ; maîtrise des demandes et de la réception ; appréciation de la fiabilité et du caractère probant ; traitement des refus ; choix des procédures alternatives et supplémentaires ; conclusions et opinion |

**La proposition.** Un brouillon reste un brouillon. Un retour reçu reste à rapprocher jusqu’à son examen. Un écart calculé reste un point à examiner, pas une anomalie établie. Les champs générés sont séparés des commentaires et décisions saisis par votre équipe ; une régénération laisse ces apports intacts.

**L’arrêt.** Un tiers ambigu, un destinataire non validé, une pièce illisible, un périmètre différent ou une opposition de la direction suspend le geste concerné. La condition apparaît dans le journal. La règle n’invente ni rattachement ni réponse et ne poursuit pas les envois d’une campagne contestée.

**Le jeu d’essai.** Avant un vrai mandat, nous éprouvons la règle sur un jeu d’essai fictif : des données inventées qui vérifient les cas attendus et ceux qui doivent s’arrêter. Vos équipes acceptent le résultat sur leurs formats et leurs circuits de validation.

## Rejoué sur le jeu fictif

Jeu fictif « Campagne Orme » : simulation locale des états et des propositions de suivi, exécutée le 2026-10-06. Preuve interne : `preuves/rejeu.json`, rejouable avec `preuves/rejouer.mjs`. Cet essai ne produit aucune lettre réelle, n’envoie aucun message et ne démontre aucune connexion à une messagerie ou à un outil de dossier.

| Cas joué | Sortie obtenue | Ce qui reste à décider |
|---|---|---|
| Retour reçu, sans identifiant permettant un rattachement sûr | Retour non rapproché, pièce conservée dans la sortie, arrêt du rattachement | Identifier la demande puis apprécier le retour |
| Réponse à une demande fermée : 12 000 attendus, 11 700 retournés, même périmètre, justificatif joint | Écart de −300, justificatif référencé, état « écart documenté à examiner » | Expliquer l’écart et conclure sur les éléments |
| Aucune réponse au jalon interne défini par le cabinet | Absence de réponse transmise au CAC ; aucune procédure choisie par la simulation | Choisir et réaliser les procédures alternatives nécessaires |
| Destinataire présent mais validation d’envoi absente | Brouillon maintenu ; envoi bloqué | Valider rédaction, destinataire et envoi |
| Opposition de la direction enregistrée | Campagne suspendue pour examen du refus | Examiner les motifs et décider des suites |
| Régénération avec commentaire saisi par l’équipe | Commentaire conservé à l’identique | Poursuivre la revue, sans ressaisie imposée |
| Montant retourné dans une autre devise ou période | Comparaison refusée ; aucun écart chiffré | Clarifier le périmètre |
| Réponse à une demande ouverte | Information retournée présentée sans calcul d’accord sur un solde | Analyser l’information au regard de l’objectif de la demande |

Le jalon de suivi est une convention du cabinet, pas un délai réglementaire. La simulation montre une frontière d’états, pas l’exécution de diligences d’audit.

## Ce que nous prenons en charge

Nous observons votre campagne, écrivons sa règle, construisons la préparation et le suivi dans vos outils, puis les éprouvons et les maintenons. Le périmètre comprend les données nécessaires aux brouillons, le journal des demandes, les propositions de rattachement, les comparaisons prévues et la présentation des exceptions.

Vous recevez aussi une fiche outil Memlia versable au dossier du CAC : objectif, périmètre, méthode, version, données d’entrée, paramètres, contrôles de pertinence et de fiabilité, sorties, traces, limites, conditions d’arrêt et résultats des essais. Elle prévoit un espace pour votre appréciation de l’outil et de son usage dans la mission.

La NEP 315 révisée définit les outils et techniques automatisés au § 14. Au § 46, pour leur utilisation dans l’identification et l’évaluation des risques, le CAC apprécie notamment « la manière dont les outils fonctionnent » et « le degré de pertinence et de fiabilité des informations qui sont intégrées dans ces outils ». Le § 48 d) vise la consignation de ces éléments d’appréciation au dossier. Notre fiche est un support de livraison, pas un modèle prescrit ou homologué par cette norme ; elle ne suffit pas à apprécier toutes les procédures de la mission.

## Ce que le cabinet garde

Votre équipe conserve la sélection, les autorisations, les contrôles et les conclusions. Le CAC garde la maîtrise de la rédaction, de l’envoi et de la réception, y compris lorsque leur préparation matérielle est assistée. Le circuit de réponse directe au CAC fait partie des critères d’acceptation de la tâche.

Une non-réponse ne vaut ni accord ni fin des travaux. La NEP 505, § 13, prévoit : « Lorsque le commissaire aux comptes n’obtient pas de réponse à une demande de confirmation, il met en œuvre des procédures d’audit alternatives permettant de collecter les éléments qu’il estime nécessaires pour vérifier les assertions faisant l’objet du contrôle. » Les procédures supplémentaires et l’appréciation finale des éléments relèvent également du CAC (§§ 14 et 15). Une opposition de la direction fait l’objet de son examen (§§ 10 à 12), pas d’une relance automatique qui contourne le refus.

Le journal ne prononce aucun statut de conformité du dossier et ne prépare aucune opinion.

## Dans vos outils

Nous partons de votre liste de tiers, de vos trames autorisées, de votre messagerie et de votre dossier de mission. Les formats, identifiants, droits et possibilités d’accès sont vérifiés avant l’engagement. Aucune compatibilité avec un éditeur n’est déduite du seul nom de son produit.

Le journal distingue demande, validation, envoi constaté, réception constatée, rapprochement proposé et examen humain. Nous définissons les données lues, les sorties, les destinataires, les accès du support, la conservation et les éventuels traitements tiers avant tout usage sur un mandat. Nous ne présumons ni traitement exclusivement local ni absence de transfert. Dans un cabinet mixte, les missions, accès et responsabilités restent séparés ; le CAC apprécie les conditions d’indépendance.

## La preuve

La preuve présentée ici est le rejeu fictif des huit états de suivi, avec entrées, sorties attendues et obtenues. Elle ne mesure aucun gain et ne démontre pas une automatisation déjà livrée à un cabinet. La tâche confiée reçoit ensuite ses propres essais d’acceptation, dont les accès, les validations, la réception sous maîtrise du CAC et la préservation des saisies.

Références : [H2A, NEP 505 — Demandes de confirmation des tiers](https://h2a-france.org/normes/demandes-de-confirmation-des-tiers/) ; [H2A, NEP 315 révisée — Connaissance de l’entité et évaluation des risques](https://h2a-france.org/normes/connaissance-de-lentite-et-de-son-environnement-et-evaluation-du-risque-danomalies-significatives-dans-les-comptes/).

## Le prix

Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources, des catégories de tiers, des règles, des exceptions, des validations et des accès à maintenir. Construction, essais d’acceptation, maintenance, support et évolutions y sont décrits. Un modèle gratuit aide à organiser une campagne ; ce service prend en charge sa préparation récurrente et son suivi dans votre environnement.

## Questions de décision

### Peut-on confier seulement le suivi des retours ?

Oui. Le périmètre peut commencer au journal et au rapprochement proposé, sans automatisation de la préparation des demandes. Les états et décisions restent distincts.

### Les relances partent-elles sans contrôle ?

Non. Nous préparons une relance selon la règle du cabinet ; son envoi attend une validation sous maîtrise du CAC. Un refus ou un point litigieux suspend le geste prévu.

### Le service choisit-il les tiers et les procédures alternatives ?

Non. Il reprend votre sélection et présente les absences et exceptions. Le CAC décide des diligences et de leurs suites.

### Que se passe-t-il si la réponse contredit le solde ?

Le journal présente l’écart et les pièces associées, sans effacer le montant de départ. L’équipe examine l’explication ; le CAC apprécie les éléments collectés.

### La fiche outil remplace-t-elle notre appréciation ?

Non. Elle décrit ce que fait l’automatisation, sur quelles données et avec quelles limites. Vous documentez son appréciation et son utilisation dans votre mission.

[Confier une première tâche](/contact)
