# Tableau de bord de production : qualification du 6 octobre 2026

Décision : ne pas ouvrir `/automatisation/tableau-de-bord-production` à ce stade. Le besoin reste rattaché documentairement à `/automatisation-cabinet-comptable`, sans changement public ni réservation d’une requête primaire. Une mission de consolidation peut être utile ; une page autonome n’est pas justifiée par la recherche menée.

## Besoin et périmètre

L’associé ou le responsable de production cherche une vue du portefeuille : dossiers par étape, avancement des missions et retards par période ou pôle. La mécanique candidate consiste à rapprocher les sources autorisées, appliquer des définitions d’indicateurs écrites puis préparer des agrégats datés, avec leurs sources et les exclusions explicites.

Ce périmètre n’est ni le suivi détaillé des transitions d’un dossier, ni la prévision de charge future, ni le reporting financier livré au client. Le pilotage Memlia reste non nominatif : pas de score, classement ou comparaison des collaborateurs. Les états et validations saisis par le cabinet ne sont pas modifiés. Une source périmée, une identité de dossier ambiguë ou deux états incompatibles doivent suspendre l’agrégat concerné plutôt que devenir un retard déduit automatiquement. Ces points sont des hypothèses de cadrage, pas une règle déjà livrée ni testée.

Le besoin de lecture consolidée est documenté chez un éditeur. Ce qui manque est la preuve d’une mécanique répétitive résiduelle à confier : quelles sources restent à rapprocher hors de l’outil actuel, selon quelles conventions, avec quels critères de recette ? Aucun entretien de cabinet ni lacune fonctionnelle observée n’est revendiqué ici.

## Demande mesurée

Instrument du dépôt : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, client Firefox, `hl=fr`, `gl=fr`. Les mesures datées et leurs réponses se trouvent dans `preuves/autocompletion.json` du paquet.

| Amorce | Suggestions obtenues |
|---|---|
| automatisation tableau de bord production cabinet comptable | aucune |
| automatiser tableau de bord cabinet comptable | aucune |
| tableau de bord production cabinet comptable | aucune |
| tableau de bord cabinet expertise comptable | aucune |
| indicateurs tableau de bord cabinet expertise comptable | aucune |
| KPI production cabinet expertise comptable | aucune |
| suivi avancement portefeuille cabinet comptable | aucune |
| logiciel pilotage production cabinet comptable | aucune |

Huit appels réussis, huit listes vides, aucune suggestion. Une liste vide n’est pas une panne et ne prouve ni une absence de demande ni un volume mensuel nul. Aucun volume mensuel ni classement Google France mesuré dans ce run.

Les quatre angles historiques du backlog sont conservés dans le JSON livré : tableau non nominatif, checklist d’indicateurs, frontière de surveillance, définition du tableau de production. Leurs mesures du 19 septembre indiquent zéro suggestion, avec des questions générales sur les tableaux et indicateurs ; ces questions ne prouvent pas une intention de confier un service. Les intentions informationnelles restent distinctes et aucun article non publié n’est proposé comme lien disponible.

## Concurrence ouverte et preuves

Sources ouvertes le 6 octobre 2026, captures HTML et texte jointes. Les fonctions sont annoncées par l’éditeur ; elles n’ont pas été testées.

1. fulll, https://www.fulll.fr/pilotage-cabinet, HTTP 200 :

   « Évaluez en direct la santé comptable et sociale de vos dossiers grâce aux indicateurs issus directement de la production (compta et paie) et aux alertes de gestion. »

   « Lien direct avec la production agrégation temps réel des actes réalisés (comptabilité et paie) sans aucun export ni retraitement de données. »

   « Vision portefeuille unifiée suivi analytique global pour les associés, consolidant l'ensemble du cabinet. »

   Ces annonces répondent directement à une partie du besoin de consolidation et de vision portefeuille. La page traite aussi de rentabilité, timesheets et indicateurs par collaborateur : ces fonctions sortent du périmètre non nominatif choisi pour Memlia. Elles ne prouvent pas un traitement inter-outils des contradictions ni l’existence d’une lacune dans un cabinet donné. L’absence d’une fonction dans cette lecture ne vaut pas preuve qu’elle n’existe pas.

2. fulll, https://www.fulll.fr/espace-collaboratif, HTTP 200 :

   « Suivre l'avancement des missions »

   Cette fonction concerne les missions ; elle ne démontre pas à elle seule les indicateurs agrégés ou les conventions de retard. Elle aide à distinguer la source des états de leur tableau de consolidation.

3. ACD GRC, https://www.acd-groupe.fr/solution-expert-comptable/acd-grc/, HTTP 200 : source adjacente sur le dossier et la relation client, ouverte mais non retenue comme preuve positive d’un tableau de production. Aucune fonction de consolidation des retards n’est attribuée à ACD sur cette seule lecture.

## Décision et rattachement

Le besoin opérationnel est plausible et l’offre native fulll en documente une partie. Les sondes ne qualifient cependant aucune demande propre de délégation et la recherche n’identifie pas de geste inter-outils suffisamment précis pour porter un service différent du général. Fabriquer neuf sections, trois cas fictifs et une promesse de résultat maintenant remplirait un gabarit avant de qualifier la mission.

Le rattachement est documentaire au service général. Les pages voisines sur les états, la production sociale et la charge future ne deviennent ni des variantes de celle-ci ni des dépendances. Pas de route nouvelle, pas de redirection d’une route jamais publiée, pas de lien entrant, pas de modification du sitemap, du registre partagé ou du contrat d’intention.

La forge `service:preparer`, la revue métier, le rejeu et `service:sceller` sont non applicables : aucune recette n’est retenue. Le PASS de vérification du paquet ne se présente pas comme une revue indépendante de contenu.

## Vérification et limites

Travail dans un worktree depuis `origin/main`, branche `site/tableau-de-bord-production-t_d8294488`. La base, l’état du worktree, les compteurs, les citations exactes et la recherche de collisions sont consignés par `livrer.py` dans `verification-tableau-de-bord-production-2026-10-06.json`.

Les surfaces ouvertes répondent : candidate HTTP 404, service général HTTP 200. Aucune surface publique n’a été changée. Firecrawl search et extract ont renvoyé 403 ; la reprise par curl a permis de lire les sources sans désactiver TLS. Revue concurrentielle ciblée, non exhaustive, pas de SERP qualifiée, aucun gain, compatibilité ou conformité revendiqués.

## Suite et condition de réouverture

L’enfant dev est réorienté avant clôture vers l’intégration documentaire des trois fichiers `livraison/` sous `docs/strategy/site-v3/mesures/`, via sa voie habituelle. Il ne construit pas la page candidate. Les captures et scripts du paquet restent les preuves de la décision.

Réexaminer seulement si un besoin terrain décrit : les sources à rapprocher, leur disponibilité, les définitions d’avancement et de retard, la fréquence de consolidation, les exclusions, la validation et un critère de recette non nominatif. Vérifier d’abord si l’outil du cabinet produit déjà la vue attendue. Une nouvelle sonde vide ou un quota de pages ne justifie pas la réouverture.
