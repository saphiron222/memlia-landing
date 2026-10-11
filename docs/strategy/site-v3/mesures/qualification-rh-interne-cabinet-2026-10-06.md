# Administration RH interne : ne pas ouvrir la page dédiée

Qualification du 06/10/2026, carte t_9c635e13, vague 3 rang 36.

## Décision

Ne pas ouvrir `/automatisation/rh-interne-cabinet`. Conserver le rattachement documentaire au service général `/automatisation-cabinet-comptable`. L'arrivée d'un collaborateur impose une coordination et un dossier administratif concrets ; une offre standard décrit déjà collecte, checklist et responsables. La recherche ne démontre pas une intention distincte de confier cette préparation à un service sur mesure pour un cabinet. Une page générique ajouterait une variante sans différence utile démontrée.

Cette décision ne signifie pas absence de marché. Elle ferme cette candidate dans cette vague ; elle n'ajoute aucune promesse au service général. Aucun contenu public, canonical, sitemap, redirection ou registre de réservation n'est modifié.

## Demande mesurée

Instrument du dépôt actualisé : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, Google Suggest Firefox en français/France. Huit réponses réussies le 06/10, six listes vides, deux suggestions au total :

| Amorce | Suggestions exactes |
|---|---|
| automatisation dossiers RH cabinet comptable | aucune |
| arrivée nouveau collaborateur cabinet comptable checklist | aucune |
| checklist intégration collaborateur cabinet comptable | aucune |
| onboarding cabinet comptable | onboarding client cabinet comptable |
| logiciel RH cabinet comptable | aucune |
| automatisation onboarding salarié | aucune |
| gestion dossier salarié | gestion dossier du personnel |
| checklist arrivée salarié | aucune |

La suggestion « onboarding client cabinet comptable » appartient à une autre intention : entrée d'un client, pas arrivée d'un collaborateur interne ni entrée d'un salarié d'un client. « gestion dossier du personnel » est générale, sans signal de délégation propre aux cabinets. Aucun volume mensuel, gain ou trafic n'est déduit de ces listes. Les réponses horodatées complètes sont livrées séparément.

## Recherche concurrentielle et limites

`web_search` et `web_extract` ont échoué en 403 Firecrawl. Reprise réelle par Bing dans le navigateur sur « onboarding collaborateurs cabinet expertise comptable RH » : dix résultats visibles essentiellement généralistes (Culture RH, LumApps, myRHline, Helloworkplace, 360Learning, Lucca et autres guides). La page ne constitue pas une SERP cabinet fiable pour mesurer une intention de délégation ; elle a permis de trouver une source Lucca. La capture HTTP est conservée. Aucun classement exhaustif ni absence de concurrence n'est revendiqué.

Source primaire éditeur ouverte le 06/10, HTTP 200 : https://www.lucca.fr/magazine/talents/onboarding/onboarding-offboarding , article affiché au 8 octobre 2025. Extraits exacts : « de collecter des données administratives via un formulaire exportables dans le dossier du collaborateur » ; « d’établir la liste des tâches à réaliser et de leur attribuer un responsable » ; « de paramétrer des alertes d’échéance de tâches. » La page nomme Lucca Core HR et Lucca Onboarding et décrit la configuration des processus. Elle documente une réponse standard adjacente, pas une compatibilité Memlia, ni une implémentation testée dans un cabinet. L'URL produit supposée `/solutions/onboarding` a répondu 404 : elle n'est pas utilisée comme preuve.

Les chiffres de rétention, coûts, calendriers d'embauche et fonctionnalités d'évaluation du texte éditeur sont exclus de notre conclusion. Aucun outil concurrent n'a été testé.

## Cadre officiel ouvert

CNIL, « Les règles pour la gestion du personnel », page datée du 17 août 2023, ouverte le 06/10/2026 en HTTP 200 : https://www.cnil.fr/fr/les-regles-pour-la-gestion-du-personnel . Extrait exact : « seules les personnes chargées de la gestion du personnel peuvent consulter les informations des salariés/agents ». Autre extrait : « Les actions sur les données effectuées par les personnes habilitées doivent être enregistrées ». Ces passages justifient des sorties et accès limités à la tâche et des traces adaptées ; ils ne garantissent aucune conformité d'une automatisation.

L'URL initiale `/fr/la-gestion-du-personnel` était erronée (404) ; la reprise navigateur a retrouvé la page canonique. Aucune durée uniforme de conservation, liste universelle de pièces obligatoires ou échéance légale n'est avancée. Les règles exactes d'embauche seraient vérifiées dans une recette future.

## Geste utile conservé

Hypothèse de mission future, pas produit construit : à partir d'une arrivée déjà décidée par le cabinet et d'une checklist approuvée, préparer les tâches de mise à disposition du matériel, les demandes d'accès à valider et l'état des pièces administratives dans un espace RH habilité. Une vue destinée à l'IT ne reçoit pas les pièces RH ; un tableau de pilotage général reste agrégé, sans suivi individuel de performance.

| Se prépare seul après règle et accès éprouvés | Attend une validation | Reste humain |
|---|---|---|
| Préparation de checklist, rapprochement des pièces autorisées avec les pièces attendues, propositions de demandes et liste d'exceptions | Identité et date d'arrivée, nécessité des pièces, responsables, destinataires, droits proposés et brouillons avant envoi | Embauche et sélection, conditions du contrat, appréciation professionnelle, décision RH, autorisation des accès |

L'arrêt doit nommer l'identité ambiguë, la pièce illisible ou excessive, le destinataire non habilité, la date contradictoire et toute demande hors checklist. Une pièce présente ne vaut pas validation juridique. Une demande d'accès préparée ne crée aucun droit. Les saisies du cabinet sont préservées. Aucun classement, score, profil ou évaluation de candidats/collaborateurs, aucune décision d'embauche ou appréciation de période d'essai ne fait partie du besoin.

Ce périmètre reste distinct de l'entrée d'un salarié client, des déclarations de paie et du traitement des candidatures. Les exemples et tâches mentionnés sont des hypothèses : aucun rejeu ni sortie exécutée n'est revendiqué.

## Cannibalisation et surfaces

Worktree depuis origin/main actualisé, branche `site/rh-interne-cabinet-t_9c635e13`. Le backlog contient quatre angles de la famille : préparation d'arrivée, checklist d'intégration, décisions humaines de recrutement et définition RH interne. Compteurs du 19/09 nuls ; questions génériques d'intégration, pas preuve de délégation commerciale. Le contexte historique complet accompagne le paquet, séparément de la mesure fraîche.

Aucune occurrence RH interne/onboarding/personnel pertinente trouvée dans le registre des requêtes ou le contrat d'intention relus. La famille existe dans `src/data/familles.ts`, mais son existence ne justifie pas une page de service. Ne pas convertir automatiquement les angles informationnels en nouveaux articles ou outils.

Vérification publique, sans query string et avec Cache-Control no-cache : candidate HTTP 404, service général HTTP 200. Aucun lien entrant ou nouveau H1 n'est créé.

## Handoff et réouverture

Réorienter l'enfant t_15e39e44 vers l'intégration documentaire des trois fichiers de `livraison/` dans `docs/strategy/site-v3/mesures/`, avec la revue adaptée au diff. Il ne publie pas la candidate : pas de recette, SERVICE_DESIGN/EEAT, preuve HTML, réservation ou suivis de publication.

`service:preparer`, corps à neuf sections, trois cas fictifs, revue métier PASS et `service:sceller` sont non applicables à cette non-ouverture. Aucun PASS ou sceau fictif n'est créé. Le paquet durable contient mesures, captures, contexte, scripts et vérification.

Réouverture seulement sur une demande qualifiée montrant une préparation d'arrivée répétitive entre outils non couverte par le SIRH existant, une fréquence suffisante, une checklist et des habilitations accessibles ; ou une mesure commerciale pertinente corroborée par une SERP exploitable. Un article ou un comparatif n'est pas lancé comme substitut automatique.
