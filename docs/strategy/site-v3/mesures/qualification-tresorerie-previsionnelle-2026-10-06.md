# Trésorerie prévisionnelle — qualification du service candidat

Décision : ne pas ouvrir /automatisation/tresorerie-previsionnelle à ce stade. Rattacher documentairement la famille au service général /automatisation-cabinet-comptable. Ce choix conserve le besoin, pas une nouvelle URL sans intention de délégation qualifiée.

## Demande réellement mesurée

Huit sondes Google autocomplete, client firefox, hl=fr, gl=fr, le 06/10/2026 ; réponses brutes et URL conservées dans mesures.json. Six listes vides ; neuf suggestions au total, toutes dans les deux sondes génériques/tableur. La candidate exacte « automatisation trésorerie prévisionnelle cabinet comptable » ne produit aucune suggestion. Les autres sondes commerciales cabinet/expert-comptable et « plan de trésorerie automatisé » sont également vides. Les suggestions restantes cherchent un tableau, un modèle, une définition ou Excel gratuit : elles ne démontrent pas une demande de délégation à Memlia.

Aucune suggestion n'est un volume mensuel. Une liste vide ne signifie pas zéro demande. Aucun rang Google France ni volume de recherche n'a été mesuré. La recherche Firecrawl a répondu 403 ; Google navigateur a présenté son contrôle anti-bot ; Bing a servi des résultats génériques sur la trésorerie, impropres à une analyse d'intention commerciale fine. La concurrence ci-dessous est donc un examen ciblé des pages officielles, pas un classement SERP.

## Besoin et concurrence

Le geste utile existe : actualiser les échéances client/fournisseur connues, les rapprocher du réalisé, préparer les flux des prochaines semaines et faire ressortir les manques. Il faut distinguer l'échéance contractuelle de la date probable d'encaissement. Le conseil sur les financements ou les reports reste humain.

Agicap, page produit ouverte en HTTP 200 le 06/10/2026 : https://agicap.com/fr/produits/gestion-de-tresorerie/
Extraits exacts conservés dans capture-0.txt :
- « Automatisez et optimisez votre gestion de trésorerie court-terme »
- « Mise à jour automatique du prévisionnel de trésorerie en méthode directe »
- « Créez et suivez des prévisionnels à la maille journalière, hebdomadaire et mensuelle, et projetez vos flux dans des modules dédiés à différents horizons : hebdomadaire, 13 semaines et annuel. »
- « Créez des scénarios pour visualiser l’impact de vos décisions sur votre trésorerie et vos indicateurs clés et liez plusieurs scénarios entre eux. »
Ces fonctions annoncées couvrent directement la projection court terme et les scénarios. Elles ne sont pas testées ici ; aucune supériorité ou intégration Memlia n'en est déduite.

RCA, page Prévisionnel ouverte en HTTP 200 le 06/10/2026 : https://rca.fr/logiciels-experts/previsionnel/
Extrait exact : « Tableau mensuel de trésorerie prévisionnelle ».
La page présente surtout business plan et prévisions financières. C'est un voisin fonctionnel pour les cabinets, pas une preuve que RCA couvre le suivi glissant hebdomadaire des échéances. Ne pas fusionner notre périmètre avec le business plan sur ce seul rapprochement.

Angle Memlia possible mais non qualifié : une mécanique résiduelle entre les exports disponibles et le support de restitution du cabinet, lorsqu'elle n'est pas déjà absorbée par son outil. Il manque un exemple terrain décrivant les sources, la règle d'actualisation, les exceptions, les droits d'accès et la sortie attendue. La seule existence de plusieurs outils ne prouve pas un besoin de service supplémentaire.

## Frontière de travail à conserver

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Lire les échéances connues et le réalisé, dédupliquer selon une clé vérifiée, agréger les flux datés et signaler les données manquantes | Confirmer le solde de départ, les dates probables d'encaissement, les flux récurrents et le scénario à restituer | Choisir les hypothèses nouvelles, arbitrer paiements/financement, conseiller le client |

Pas de valeur inventée pour une échéance absente ; un solde non réconcilié empêche une projection présentée comme fiable. Les dates proposées ne remplacent jamais les saisies du cabinet. Aucun paiement ou report n'est exécuté. Il s'agit des flux du client, pas des honoraires ni des encaissements du cabinet. Le ROI cash d'une automatisation n'est pas un prévisionnel de trésorerie client.

Cette frontière est un cadrage de recherche, pas une règle implémentée ou un rejeu réussi. Aucune recette, revue métier PASS, préparation ou scellement n'est revendiqué.

## Couverture existante et risque de variantes

src/data/familles.ts décrit déjà la famille : « Projeter la trésorerie d’un client depuis les échéances connues, signaler les tensions. »
Le pilier existant /blog/automatiser-un-cabinet-comptable-la-carte-des-taches traite déjà la préparation des données et les hypothèses humaines dans « Conseil et missions spéciales » ; ne pas le réécrire dans cette livraison.
Le backlog du 19/09 conserve quatre angles : projection depuis les échéances, checklist avant présentation, tension détectée et arbitrage, définition/construction. Tous ont des mesures nulles historiques et restent des candidats éditoriaux, pas des articles publiés. Ne pas convertir chaque angle en service. Le registre courant ne réserve pas la route candidate ; le contrat de page ne la porte pas.

Production vérifiée sans query string et avec Cache-Control: no-cache : candidate HTTP 404 ; service général HTTP 200. Le rattachement est documentaire : aucun nouveau texte public, aucune redirection, aucun canonical technique ajouté.

## Condition de réouverture et handoff

Requalifier seulement lorsqu'une demande de cabinet décrit une mise à jour répétitive non couverte nativement et une sortie exploitable, ou qu'une mesure commerciale distincte apparaît. Vérifier alors les accès et formats, écrire la frontière et tester au moins trois cas fictifs : échéances complètes, encaissement décalé confirmé, donnée manquante ou doublon bloquant. Les scénarios et hypothèses doivent rester séparés du réalisé.

L'enfant dev t_a62994f6 intègre uniquement les trois fichiers livraison/ sous docs/strategy/site-v3/mesures/ dans une PR documentaire. Il ne publie pas la route candidate et ne réserve aucune requête ; il préserve backlog, familles et pages existantes. Le paquet comprend les mesures brutes, captures officielles, scripts de collecte et résultat de vérification.

Limites techniques : urllib n'a pas trouvé sa chaîne de certificats locale ; reprise par curl avec TLS vérifié, sans désactivation. Aucun budget API engagé. Les deux outils concurrents n'ont pas été exécutés.
