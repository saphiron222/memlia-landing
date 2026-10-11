# Suivi des dossiers par état : qualification du 6 octobre 2026

Décision : ne pas ouvrir `/automatisation/suivi-dossiers-etats` à ce stade. Rattacher documentairement le besoin au service général `/automatisation-cabinet-comptable`, sans modifier les surfaces publiques. La tâche reste recevable en mission ; sa page commerciale autonome n’est pas justifiée par les éléments recueillis.

## Besoin et périmètre

Le chef de mission veut savoir où en est un dossier, quel événement permet de proposer son prochain état et quelle exception bloque le passage. Le geste candidat consiste à rapprocher des traces autorisées, préparer un état proposé avec sa provenance et signaler les contradictions ; pas à convertir une pièce reçue en validation de dossier.

La frontière est celle d’un dossier et de ses exceptions, pas celle du tableau de bord agrégé du portefeuille, de la rentabilité ou de la charge future. Les états, notes et validations saisis par le cabinet restent intacts. Un rapprochement non univoque arrête la proposition ; l’état précédent n’est pas écrasé. Il ne s’agit pas de mesurer ou classer les personnes.

Ce besoin est cohérent avec les fonctions annoncées par les éditeurs, mais aucune lacune répétitive distincte à confier à Memlia n’a été qualifiée. Présenter dès maintenant une recette complète inventerait son périmètre.

## Demande mesurée

Instrument du dépôt : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, Firefox, hl=fr et gl=fr. Mesures brutes dans `qualification-suivi-dossiers-etats-2026-10-06.json` et `preuves/autocompletion.json` du paquet.

| Amorce | Suggestions obtenues |
|---|---|
| automatisation suivi dossiers cabinet comptable | aucune |
| automatiser suivi dossiers comptables | aucune |
| suivi dossiers cabinet comptable | suivi dossier client cabinet comptable |
| suivi avancement dossiers comptables | aucune |
| tableau suivi dossiers comptables | tableau suivi dossier comptable |
| logiciel suivi dossiers cabinet comptable | aucune |
| suivi dossiers comptables excel | aucune |
| suivi états dossiers comptables | aucune |

Huit appels réussis, six listes vides, deux suggestions. Les deux suggestions portent sur le suivi et un tableau ; elles ne prouvent pas l’intention de déléguer une automatisation sur mesure. Une liste vide n’est ni une panne ni un volume de recherche nul. Aucun volume mensuel mesuré.

Les quatre angles du backlog datés du 19 septembre restent conservés : suivi des états, fiabilisation du classeur, exceptions de dossiers bloqués, nomenclature des états. Leurs formulations et captures historiques sont jointes au JSON ; elles ne constituent pas quatre pages commerciales à créer. Les questions historiques sur la saisie et le compte 768 sont indirectes et ne qualifient pas ce besoin.

## Concurrence ouverte et preuves

Sources ouvertes le 6 octobre, captures HTML et texte dans le paquet. Il s’agit de documentation éditeur, pas d’un essai fonctionnel.

1. fulll, https://www.fulll.fr/espace-collaboratif, HTTP 200 :

   « Personnalisez vos missions et vos circuits de validation selon l'organisation de votre cabinet. Documents, tâches et validations sont réunis dans un environnement unique pour fluidifier vos processus, automatiser les relances et faciliter le suivi des dossiers. »

   La même page annonce « Suivre l'avancement des missions ». Elle fournit une réponse native au suivi et aux validations. Elle ne prouve pas un rapprochement de deux sources contradictoires ni la préservation de toute saisie locale externe.

2. ACD GRC, https://www.acd-groupe.fr/solution-expert-comptable/acd-grc/, HTTP 200 :

   « Dossier permanent complet, avec ajout personnalisable de rubriques (champs et onglets), pour une meilleure qualification de votre base client. »

   Réponse adjacente : dossier permanent et information client. Cette citation ne prouve pas un suivi automatisé d’états ou une gestion de transitions ; ne pas attribuer à ACD cette couverture sans autre preuve.

3. fulll, https://www.fulll.fr/pilotage-cabinet, HTTP 200 : documente aussi la lecture consolidée, les temps et la marge. Ce périmètre sert à distinguer les sujets ; il n’est pas la preuve du service candidat.

MyCompanyFiles a été ouvert (200), mais la collecte/publication de documents n’est pas retenue comme preuve de transitions de dossiers. L’URL initiale supposée de gestion interne ACD répond 404 ; elle a été remplacée par la page GRC accessible et n’est pas une source positive.

## Pourquoi ne pas fabriquer une page

Le besoin de suivi existe dans le langage mesuré et les offres. Ce qui manque est une décision d’achat propre : quelle mécanique inter-outils le cabinet confie, non résolue par son suivi actuel ? Ni les amorces commerciales ni la documentation ne répondent à cette question. Une page qui promet simplement un tableau ou une liste d’états concurrencerait une fonction standard et répéterait la page générale, sans preuve de service distinct.

La non-ouverture repose sur cette combinaison, pas sur le seul silence de l’autocomplétion. Le rattachement reste documentaire : pas de réservation de nouvelle requête primaire, pas d’ajout au sitemap, pas d’ancre entrante ni de modification du service général. Les articles historiques candidats gardent leur intention informationnelle ; aucun article non publié n’est présenté comme un lien disponible.

## Vérification et limites

Base de travail : `origin/main`, commit `9cad26ef4ad765a0af8f0dde95acad74801789d6`, branche `site/suivi-dossiers-etats-t_d49a53e3` dans le worktree `site/` de la tâche. Worktree propre. Candidate absente du contrat d’intention et du registre de routes ; route publique candidate 404 et service général 200.

`python3 livrer.py` : PASS des huit mesures, compteurs, quatre angles, trois citations exactes, HTTP des sources et surfaces, absence de changements publics. Le PASS est une vérification de qualification, pas une revue métier. Forge `service:preparer`, revue métier, rejeu et `service:sceller` non applicables puisqu’aucun candidat n’est retenu.

Firecrawl search/extract a renvoyé 403. La reprise par HTTP direct avec curl a permis de lire les sources ; urllib avait échoué sur le certificat local, sans désactivation de TLS. La recherche Bing directe a renvoyé des résultats hors sujet sur les colis : elle ne sert ni de SERP qualifiée ni de classement Google France. Revue concurrentielle ciblée, non exhaustive ; aucun fait de conformité, de gain ou de compatibilité n’est repris.

## Suite et condition de réouverture

L’enfant dev intègre seulement les trois fichiers `livraison/` sous `docs/strategy/site-v3/mesures/` via sa voie habituelle. Il ne construit pas la page candidate et ne touche pas le registre partagé pour y réserver une requête.

Réexaminer si un besoin observé nomme un geste répétitif précis : deux sources d’état à rapprocher, règles de transition écrites, contradiction à présenter, volume de dossiers et événements, propriétaire de la validation et critères d’acceptation. Vérifier d’abord les fonctions déjà disponibles dans l’outil du cabinet. Une répétition de sondes, un outil choisi arbitrairement ou un quota de pages ne suffisent pas à rouvrir le sujet.
