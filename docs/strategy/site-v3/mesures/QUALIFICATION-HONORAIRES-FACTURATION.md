# Honoraires et facturation : qualification du service candidat

Décision du 6 octobre 2026, carte t_3f3022e4 : ne pas ouvrir `/automatisation/honoraires-facturation` à ce stade. Rattacher le besoin à `/automatisation-cabinet-comptable`, sans ajouter de contenu public ni créer une variante vide. La candidate de vague 3 est une hypothèse de recherche, pas une commande automatique de publication.

## Ce que la mesure établit

Instrument réel du dépôt : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, Google `client=firefox`, `hl=fr`, `gl=fr`. Huit réponses réussies ; sept listes vides ; une suggestion exactement égale à « facturation honoraires expert comptable ». Les captures JSON sont dans le paquet, avec la date UTC de l'appel. Aucun volume mensuel mesuré.

| Sonde | Suggestions |
|---|---|
| automatisation facturation honoraires cabinet comptable | aucune |
| automatisation facturation cabinet comptable | aucune |
| facturation honoraires expert comptable | facturation honoraires expert comptable |
| logiciel facturation honoraires cabinet comptable | aucune |
| facturation hors forfait cabinet comptable | aucune |
| automatiser facturation honoraires | aucune |
| facturation cabinet expertise comptable | aucune |
| gestion honoraires cabinet comptable | aucune |

La suggestion confirme seulement une formulation autour des honoraires. Elle peut relever des frais payés par le client, de leur traitement comptable ou du circuit de facturation du cabinet. Elle ne démontre pas une demande de délégation à un prestataire. Une liste vide n'est ni une absence de besoin ni un volume zéro.

## Besoin et offre existante

Deux sources primaires consultées le jour même, HTTP 200, captures HTML et texte conservées :

- ACD GI : https://www.acd-groupe.fr/solution-expert-comptable/acd-gi/ . Extraits exacts : « Toute la gestion interne : Missions, budgets, charges, obligations, honoraires, temps, facturation, analyses… » ; « Programmez automatiquement vos honoraires ». La page établit que la programmation des honoraires est déjà proposée dans la gestion interne. L'ancienne route Dia Client GI redirige vers ACD GI : ce n'est pas un deuxième concurrent.
- fulll : https://www.fulll.fr/pilotage-cabinet . Extraits exacts : « Facturation du hors-plan » ; « transformation des dépassements de temps identifiés en opportunités de pré-facturation complémentaire. » ; « Détection du hors-plan » ; « Alertes et suggestions de pré-facturation ». La proposition de complément existe aussi dans une offre intégrée. Ses arguments de rentabilité ne deviennent pas le périmètre du candidat Memlia.

Ce sont des déclarations d'éditeurs, pas des tests. Elles ne prouvent ni leur traitement des doublons, ni une validation tarifaire, ni une compatibilité Memlia. Lorsque la fonction native répond au besoin, son paramétrage est l'option à essayer avant une construction sur mesure. L'espace utile éventuel de Memlia est la jonction entre des actes validés, un barème approuvé et un outil de facturation existant ; cette friction n'est pas démontrée par les signaux collectés.

## Limites de recherche, explicites

L'outil web_search a renvoyé un 403 Firecrawl. Reprise par recherche publique : deux requêtes DuckDuckGo ont renvoyé HTTP 202 avec challenge, pas des listes de résultats vides. Bing sur « logiciel facturation honoraires cabinet expertise comptable » a fourni des pages de logiciels généralistes sans traiter les termes spécialisés ; ce résultat n'est pas utilisé comme preuve d'intention. Google sur les trois termes facturation, honoraires et cabinet a présenté un challenge. La SERP spécialisée reste non qualifiée. Aucune position Google, absence de concurrence ou taille de marché n'est revendiquée. Les sources éditeurs ont été découvertes depuis leurs pages générales puis lues directement. L'inventaire concurrentiel n'est pas exhaustif.

La première tentative Python urllib a échoué sur le magasin de certificats local. La reprise par curl a conservé la validation TLS et obtenu les pages ; aucun contournement TLS n'a été utilisé.

## Rattachement et non-cannibalisation

Le worktree part d'origin/main, commit `2f4ba16bf55ae52f6d0d018bf7b5de39edd1ef70`. Quatre angles du backlog honoraires-facturation restent de priorité 3 ; leurs douze amorces disposent de captures vides du 19 septembre. Les questions anciennes (compte 658000, forfait, facturation électronique des professions libérales) sont des indices informationnels indirects, pas une validation de service.

Angles conservés sans requalification artificielle :

- `ne-pas-facturer-deux-fois-un-acte-hors-forfait` : facturation actes hors forfait cabinet comptable ;
- `checklist-mensuelle-de-facturation-des-honoraires` : checklist facturation honoraires cabinet comptable mensuelle ;
- `les-actes-hors-forfait-qu-une-facturation-automatique-ne-doit-jamais-emettre-seule` : facturation acte hors forfait validation avant envoi ;
- `honoraires-mensualises-et-actes-hors-forfait-quelle-difference` : différence honoraires mensualisés actes hors forfait.

Le registre courant et le contrat d'intention n'ont pas d'entrée honoraires identifiée. En production, GET no-cache sans query string : candidate 404 ; service général 200. Aucun article ou nouveau lien public n'est proposé dans cette livraison. Ne pas rattacher cette tâche aux factures fournisseurs, qui concernent les achats, ni aux encaissements ou à la rentabilité. Le service général porte le besoin de délégation tant que sa spécificité ne justifie pas une page.

## Périmètre à garder si un signal futur justifie une recette

Le déclencheur est la préparation périodique de propositions de factures et d'actes hors forfait. Entrées potentielles : identifiants stables des actes et dossiers, règles de forfait, barème approuvé, période et registre des propositions/factures existantes. Sortie envisagée : proposition identifiée et exceptions séparées, jamais une émission déduite d'un dépassement de temps seul.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Rapprocher les actes identifiés et les règles approuvées ; repérer un doublon ; préparer une proposition traçable | Qualifier un acte hors forfait, accepter son montant et autoriser la suite du circuit | Négocier et fixer les honoraires, arbitrer un litige ou une remise, engager le cabinet |

Cette frontière est un cadrage interne, pas une preuve d'automatisation livrée. L'absence d'identifiant stable, un tarif contradictoire, un périmètre de forfait incertain ou un statut d'émission incohérent doivent arrêter la proposition concernée. Une modification humaine ne se réécrit pas ; un second passage sur les mêmes entrées ne crée pas de deuxième proposition. La recette, si ouverte, devra rejouer au minimum courant, doublon et hors forfait sans accord, avec sorties réellement exécutées. Aucun rejeu n'est inventé pour la présente qualification.

## Condition de réouverture

Reprendre uniquement sur une demande explicite de cabinet décrivant une friction répétée hors fonction native, ou sur un signal frais portant une intention de déléguer distincte et une SERP pertinente. Qualifier alors formats, accès, idempotence et circuit de validation avant les neuf sections, `service:preparer`, revue métier indépendante et `service:sceller`. La présente non-ouverture n'appelle ni revue de contenu public ni sceau.

## Livraison au dev

La carte enfant t_6ae99f70 est réorientée vers l'intégration documentaire de cette décision. Le paquet contient les trois fichiers `livraison/` à intégrer dans `docs/strategy/site-v3/mesures/` ainsi que `preuves/` et les scripts ayant produit les résultats. La qualification JSON est une annexe de recherche au registre, pas une réservation de requête pour une URL indexable. Ne pas modifier le registre partagé, le backlog ni les données de service pour fabriquer une publication. La branche marketing reste sans modification du dépôt ; aucune PR ou mise en ligne n'est revendiquée.
