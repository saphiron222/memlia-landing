# Situations intermédiaires et reporting clients : qualification du 6 octobre 2026

## Décision

Ne pas ouvrir maintenant `/automatisation/situations-reporting-client`. Rattacher documentairement ce besoin au service général existant `/automatisation-cabinet-comptable`, sans modifier son contenu sur ce run. La famille `situations-reporting-client` reste pertinente ; ses quatre angles de backlog restent des candidats informationnels, pas des publications autorisées par cette qualification.

La demande de tableau de bord et de situation comptable existe dans les formulations mesurées, mais aucune sonde commerciale spécifique ne produit de suggestion. Les deux offres éditeurs ouvertes couvrent déjà la restitution de données comptables et le partage de tableaux clients. Aucune preuve de demande distincte pour confier les gestes entre ces outils n'a été trouvée ici. L'absence de suggestion n'établit ni une absence de besoin ni un volume nul : elle ne suffit simplement pas à ouvrir une page supplémentaire, en l'absence d'autre preuve qualifiante.

## Mesure fraîche

Instrument exact du dépôt : `scripts/lib/seo-instruments.mjs#autocompleterGoogle`, Google Suggest, `client=firefox`, `hl=fr`, `gl=fr`. Huit sondes exécutées le 06/10/2026, toutes réussies, six listes vides et treize suggestions réparties sur deux sondes. Aucun volume mensuel mesuré, aucune position Google revendiquée. Résultats intégraux : `preuves/autocompletion.json`, copiés en livraison.

| Sonde | Lecture |
|---|---|
| automatisation reporting client cabinet comptable | Aucune suggestion ; candidate exacte de la carte mesurée |
| reporting client cabinet comptable | Aucune suggestion |
| automatiser tableau de bord client comptable | Aucune suggestion |
| tableau de bord expert comptable | Trois suggestions : expression générique, variante URSSAF, mission tableau de bord ; la dernière peut être une recherche d'achat de mission comptable par une entreprise, pas de délégation du cabinet à Memlia |
| situation intermédiaire comptable | Dix suggestions : expression générique, opérations de capital/fusion/transformation, obligation, traduction, Code de commerce et Excel ; signaux essentiellement informationnels, certains hors périmètre |
| automatisation situation comptable | Aucune suggestion |
| reporting comptable automatique | Aucune suggestion |
| tableau de bord client expert comptable | Aucune suggestion |

Les dix suggestions de situation intermédiaire ne justifient aucune affirmation sur une obligation légale. Le besoin de reporting client ne doit pas être assimilé au suivi de production du cabinet, au prévisionnel, au reporting de facturation électronique ou à une situation requise par une opération juridique.

## Besoin et concurrence documentés

Le besoin fonctionnel est réel au sens où les éditeurs le nomment et proposent des fonctions pour y répondre ; son intensité, sa fréquence et une volonté de confier une automatisation sur mesure ne sont pas mesurées.

### fulll, analyse et conseil

Source primaire éditeur ouverte en HTTP 200 le 06/10/2026 : https://www.fulll.fr/analyse-et-conseil

Extrait exact : « Identifiez rapidement les indicateurs clés grâce à des dashboards prêts à l'emploi, adaptés à différents secteurs d'activité et alimentés au fil de votre production comptable. »

Autre extrait exact : « Les dashboards peuvent être personnalisés, commentés et partagés afin de faciliter les échanges entre le cabinet et ses clients, sur fulll directement, en PDF ou consultable sur l'application mobile. »

Ces passages établissent une offre de tableaux à partir de la production et de restitution client. Les passages de la même page sur les projections et commentaires IA ne sont pas notre périmètre. Aucun essai de fulll effectué, aucun prix repris, aucune supériorité technique prétendue. Captures : `preuves/source-6.html` et `.txt` ; ouverture dans `preuves/sources.json`.

### RCA, Tableau de bord

Source primaire éditeur ouverte en HTTP 200 le 06/10/2026 : https://rca.fr/logiciels-experts/tableau-de-bord/

Extrait exact : « Ce logiciel pour le pilotage d’entreprise simplifie la restitution des données financières et permet une gestion des unités d’œuvre. »

Autre extrait exact : « Avec le logiciel Tableau de bord, vous générez des rapports exportables au format PDF pour les partager facilement. »

L'offre nomme aussi des tableaux personnalisables et des comparaisons entre périodes. La comparaison réalisé/budget est hors périmètre de cette carte. Aucun essai de RCA effectué, aucune promesse d'intégration avec Memlia. Captures : `preuves/rca-tableau-de-bord.{html,txt,json}`.

### Limites de recherche

Le moteur Hermes web_search/web_extract a renvoyé un 403 Firecrawl. Reprise par navigateur Google : redirection `/sorry/`, pas de SERP exploitable. Reprise HTTP Bing sur la candidate et une expression plus courte entre guillemets : HTTP 200 mais résultats centrés sur l'automatisation générique et la marque Tableau ; non qualifiés. Aucun top 10 ni concurrence exhaustive ne sont revendiqués.

Le domaine `www.my-unisoft.fr` a réinitialisé la connexion sur les deux captures : il n'est pas une source fonctionnelle utilisée. `www.r-c-a.fr` répond bien en HTTP 200 mais parle d'aviation : source explicitement écartée, remplacée par le domaine RCA `rca.fr`, vérifié puis page Tableau de bord ouverte. La réussite HTTP ne valide pas le sujet d'une source.

## Frontière du besoin conservé

Hypothèse de tâche à qualifier sur un cas terrain, pas description d'un service déjà construit : préparer un brouillon de situation et de tableau client depuis une comptabilité tenue, en conservant périodes, origine des chiffres et conventions approuvées.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Lire les exports convenus ; vérifier les périodes, mapper les postes selon la règle du cabinet ; préparer un brouillon d'indicateurs et un relevé des écarts | Périmètre des comptes, période et conventions de calcul ; traitement des données manquantes ; validation du tableau avant toute diffusion | Tenue et révision de la comptabilité ; choix et interprétation des indicateurs ; commentaire de la situation, conseil et autorisation d'envoi |

Conditions à tester si une demande concrète arrive : export incomplet, période N/N-1 non comparable, compte non mappé ou écart de total inexpliqué => arrêt nommé, pas de valeur inventée ni de commentaire généré comme conclusion. Les notes du cabinet ne seraient jamais écrasées par une régénération. Aucun rejeu exécuté ici : cette frontière est un cadrage de recherche, pas une preuve produit.

L'opportunité éventuelle est dans un geste de restitution encore manuel malgré l'outil natif : par exemple reprise dans un modèle propre au cabinet avec rapprochement aux exports et exception explicite. Cela doit être montré par un cas, pas déduit d'une carence supposée des éditeurs. Commencer par vérifier si la fonction native suffit.

## Rattachement et anti-cannibalisation

Source de travail : worktree `site/`, branche `site/situations-reporting-client-t_ab847b40`, créée depuis `origin/main`. Les fichiers de référence sont lus sur ce worktree, pas modifiés dans le dépôt partagé. Le contexte machine conserve le commit de départ, les quatre angles du backlog, les entrées pertinentes du registre et le contrat d'intention existant.

La candidate ne figure pas dans le contrat d'intention lu. Le registre n'attribue pas de requête spécifique à cette famille ; cela signifie « pas de réservation trouvée dans ce registre », pas « absence de tout contenu dans toutes les branches ». La page générale existante répond en HTTP 200 ; la candidate répond en HTTP 404, interrogées sans query string et avec `Cache-Control: no-cache`.

Rattachement utile : service général commercial ; famille `situations-reporting-client` pour les futurs contenus de méthode, chacun sur une requête fraîche et distincte. Aucun rattachement au suivi de production interne ni au prévisionnel. Ne pas ouvrir une variante `/reporting`, `/tableaux-clients` ou `/situations-intermediaires` pour contourner le même manque de qualification.

## Livrable et critère de fini

Qualification de vague 3 non retenue : pas de `recette.json`, pas de `corps.md`, pas de page, pas de réservation de requête. `service:preparer`, revue métier et `service:sceller` sont non applicables puisque la page n'est pas retenue. Aucun PASS métier, test fictif de trois cas ou sceau ne sont revendiqués.

Paquet durable : ce rapport, les mesures brutes, le contexte de décision, les captures et scripts de vérification. Les trois fichiers de `livraison/` sont à intégrer par l'enfant dev dans `docs/strategy/site-v3/mesures/` sur main, sous contrôle de la livraison documentaire. Pas de modification des textes publics ou des registres globaux ; pas de revue supplémentaire du fond réglementé, aucune affirmation réglementaire n'étant publiée.

Réouverture possible seulement avec une preuve nouvelle : demande terrain explicite d'un cabinet pour confier la restitution, cas répétitif précis non résolu par son outil, ou intention commerciale distincte confirmée par une recherche exploitable. Alors cadrer la règle, le rejeu réel et le maillage avant la rédaction commerciale. Ce run n'ajoute ni article ni nouvelle carte de recherche artificielle.
