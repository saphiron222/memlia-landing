# Relances d’honoraires impayés : qualification du service candidat

Décision du 6 octobre 2026, carte t_dd32480d : ne pas ouvrir `/automatisation/relances-impayes` à ce stade. Rattacher le besoin de délégation à `/automatisation-cabinet-comptable`. Le besoin est identifiable, mais cette recherche ne justifie pas une page commerciale distincte. Aucune modification publique n’est demandée.

## Mesure de la demande

Huit sondes réellement exécutées avec `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, Google, hl=fr, gl=fr. Huit réponses réussies, toutes sans suggestion. Captures datées dans preuves/autocompletion.json. Aucun volume mensuel mesuré ; une liste vide n’est pas un volume zéro ni une absence de besoin.

| Sonde | Suggestions |
|---|---|
| automatisation relance honoraires impayés cabinet comptable | aucune |
| relance honoraires impayés expert comptable | aucune |
| logiciel relance honoraires cabinet comptable | aucune |
| automatisation relance impayés | aucune |
| relance impayés cabinet comptable | aucune |
| recouvrement honoraires expert comptable | aucune |
| relance facture impayée expert comptable | aucune |
| automatiser relances honoraires | aucune |

La requête longue candidate n’obtient pas de signal ; les formulations plus courtes et les formulations de logiciel ou de recouvrement ne l’étayent pas davantage dans cet instrument. Cela ne permet pas de conclure que personne ne cherche ce service. Le critère de cette vague est de confirmer une intention distincte avant contenu, pas de remplir une route réservée.

## Besoin et concurrence

Sources primaires éditeurs ouvertes le jour même, captures conservées :

- ACD GI, https://www.acd-groupe.fr/solution-expert-comptable/acd-gi/ : « Toute la gestion interne : Missions, budgets, charges, obligations, honoraires, temps, facturation, analyses… » et « Programmez automatiquement vos honoraires ». Ce contexte ne prouve pas à lui seul une relance.
- Fiche technique liée depuis cette page : https://www.acd-groupe.fr/wp-content/uploads/2022/12/FP-DiaClientGI_decembre2022.pdf . Page 13 : « relances sur modèles ou publipostage Word ». Le passage se trouve dans « SUIVI DES RÈGLEMENTS ET COMPTABILITÉ AUXILIAIRE », option de gestion des encours. Le PDF porte « Avril 2026 » en dernière page malgré un chemin contenant 2022. Il confirme une alternative native aux messages types, sans démontrer une cadence automatique, un arrêt sur litige ou une synchronisation temps réel.
- fulll, https://www.fulll.fr/pilotage-cabinet : « Confrontez automatiquement les feuilles de temps (timesheets) de vos équipes avec les honoraires facturés. Identifiez rapidement le temps productif non facturé. » Offre adjacente de pilotage des honoraires, pas preuve d’une fonction de relance. Ne pas transformer cette source en deuxième concurrent direct du recouvrement.

Le besoin est donc concret : rapprocher encours, historique et messages types du cabinet pour proposer la relance appropriée. Une fonction native existe au moins chez ACD ; son adéquation doit être examinée avant une construction sur mesure. Les déclarations d’éditeurs ne sont pas des essais. Aucun logiciel n’a été testé, aucun défaut concurrent ou niveau de performance n’est revendiqué. L’espace possible de Memlia serait une friction répétée entre outils et une règle de stade non couverte par l’existant ; cette friction n’est pas encore démontrée.

## Limites et sources officielles

Firecrawl recherche et extraction : 403. Reprise par accès directs aux sources et recherche publique. Google a présenté un challenge ; DuckDuckGo HTTP 202 avec challenge ; Bing sur les termes relance, honoraires et logiciel a fourni surtout des résultats hors sujet (plan relance logement, dictionnaires), avec quelques modèles généralistes. Ce n’est pas une SERP spécialisée qualifiée. Aucun rang, part de marché ou inventaire exhaustif n’est revendiqué.

Service-Public F23211 : domaine historique entreprendre.service-public.fr inaccessible par curl ; reprise sur entreprendre.service-public.gouv.fr par navigateur puis curl également en timeout. Aucun contenu officiel n’a pu être actualisé. Ce défaut n’empêche pas la décision de non-ouverture, qui ne comporte aucune affirmation juridique. Ne pas reprendre ici un délai légal, un barème, une pénalité, une mise en demeure ou une procédure de recouvrement. Une future recette qui en traite devra ouvrir ses sources officielles puis passer la revue métier.

## Rattachement et non-cannibalisation

Le service général public répond 200 ; la candidate répond 404, GET no-cache sans query string. Le service général couvre déjà « facturation et recouvrement ». Le pilier `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` décrit les messages types et la validation avant envoi ; il demeure la porte informationnelle existante.

Le backlog conserve quatre angles de priorité 3, sans lancement ni modification : méthode de relance, cadence, arrêts avant envoi, définition d’un impayé. Les douze occurrences d’amorces historiques correspondent à onze requêtes distinctes, exportées dans la qualification JSON avec leurs captures du 19 septembre. Les anciennes questions générales ne prouvent pas une intention de confier. Le registre contient une bibliothèque de prompts et un article sur la relance de pièces : ni l’un ni l’autre n’est un service de relance d’honoraires. Aucun contrat d’intention relances/impayés identifié. Pas de réservation de nouvelle requête, pas de modification du registre partagé.

Ne pas rattacher les impayés d’honoraires aux factures fournisseurs, aux prélèvements ou à la collecte de pièces. Ne pas étendre ce résultat à la famille CAC inactive : la présente carte porte sur les honoraires du cabinet d’expertise comptable.

## Périmètre utile, si une demande future justifie une recette

Déclencheur envisagé : revue périodique des honoraires échus. Entrées à vérifier : identifiant facture stable, échéance contractuelle, solde rapproché, historique des échanges, stade approuvé, messages types et exceptions humaines. Sortie : une proposition de message identifiée et un motif d’arrêt pour chaque exception. Une ancienneté seule ne décide pas d’un litige ou d’une escalade.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Rapprocher les données disponibles, présenter le stade prévu et un brouillon fondé sur le message type approuvé | Vérifier solde, destinataire et contexte ; accepter le message et autoriser son envoi | Envoyer, négocier un échéancier, traiter contestation et litige, engager un recouvrement |

Cette frontière est un cadrage interne, pas une automatisation livrée. Arrêter sur règlement non rapproché, solde contradictoire, promesse de paiement non qualifiée, contestation, procédure signalée ou absence de stade approuvé. Ne jamais écraser les notes et décisions humaines ni recréer une proposition identique au passage suivant. Avant toute future recette, éprouver courant, règlement intervenu et litige, plus paiement partiel et doublon. Aucun résultat fictif n’a été présenté comme exécuté dans cette qualification.

## Réouverture et livraison

Réouvrir uniquement sur une demande explicite de cabinet décrivant une friction répétée hors fonction native, ou sur une mesure fraîche et une SERP pertinente montrant une intention distincte de délégation. Qualifier alors les données, les formats et la frontière avant les neuf sections, le rejeu réellement exécuté, `service:preparer`, une revue métier indépendante et `service:sceller`.

La recette conditionnelle n’est pas retenue : pas de corps public, pas de sceau ou de PASS métier revendiqué. L’enfant dev t_85039dcf est réorienté vers l’intégration documentaire des trois fichiers livraison/ dans docs/strategy/site-v3/mesures. Le paquet contient les captures et scripts ; le worktree marketing est propre, sans modification du dépôt, commit de départ 69269f83e224ce9441fe078bf56e653a485fb7d2, branche site/relances-impayes-t_dd32480d. Aucune publication ou PR créée par ce run.
