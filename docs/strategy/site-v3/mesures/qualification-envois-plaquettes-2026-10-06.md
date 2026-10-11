# Envois de plaquettes et documents : qualification du service candidat

Décision du 6 octobre 2026 : ne pas ouvrir `/automatisation/envois-plaquettes-documents` maintenant. Rattacher la famille au service existant `/automatisation-cabinet-comptable`. Le besoin de restitution existe, mais une intention d'achat propre à la préparation des lots et au suivi des destinataires n'est pas confirmée par les mesures disponibles. Ce n'est pas une conclusion d'absence de marché.

## Demande mesurée avant rédaction

Instrument du dépôt : `autocompleterGoogle` dans `scripts/lib/seo-instruments.mjs`, Google Suggest, `client=firefox`, français, France. Mesures du 06/10/2026 vers 08:27 CEST. Huit réponses réussies et huit listes vides, aucune panne :

| Requête | Suggestions |
|---|---:|
| automatisation envoi plaquettes cabinet comptable | 0 |
| envoi automatique plaquette comptable | 0 |
| envoi plaquette bilan client | 0 |
| suivi envoi documents cabinet comptable | 0 |
| automatisation envoi documents cabinet comptable | 0 |
| logiciel envoi plaquette comptable | 0 |
| envoi bilan client expert comptable | 0 |
| portail client cabinet comptable | 0 |

Une liste vide n'est ni un volume mensuel nul ni une preuve d'inutilité. Aucun volume mensuel n'est revendiqué. Les quatre angles de cette famille au backlog du 19/09 avaient chacun zéro suggestion et une intention SERP non qualifiée. Le registre ne réserve aucune entrée à la famille candidate.

## Concurrence et lecture des résultats

La recherche Hermes/Firecrawl a échoué avec HTTP 403. Alternative exécutée : lecture directe HTTP et extraction HTML, avec captures conservées. Google retourne une interstitielle de redirection : aucun classement Google exploitable. Bing renvoie surtout des définitions générales d'automatisation : pas un signal sur ce geste. DuckDuckGo fournit une SERP exploitable sur la candidate, mais sans géolocalisation France garantie ; la requête complémentaire `"envoi" "plaquette" "comptable"` avec `kl=fr-fr` répond explicitement sans résultat. Ne pas transformer cette dernière absence sur une requête restrictive en absence de concurrence.

La SERP DuckDuckGo candidate place notamment Factory 456 (plaquette), AzenFlow (automatisation générale), Buildoto (documents), MyUnisoft (facturation), AgentFlow et d'autres offres larges. Cette composition mélange fabrication des comptes, documentation et automatisation du cabinet ; elle ne révèle pas une catégorie d'achat clairement distincte pour les lots d'envoi. Les extraits SERP d'AzenFlow et Buildoto ne valent pas vérification de leurs offres ; aucune de leurs promesses n'est reprise comme un fait.

Sources primaires ouvertes le 06/10, HTTP 200, avec texte et HTML dans le paquet :

1. MyCompanyFiles, `https://www.mycompanyfiles.fr/la-solution/connecteurs-metiers/` (redirection constatée depuis `/connecteurs-metiers/`). Rubrique exacte : « Restitution automatique depuis une GED vers MyCompanyFiles ». Extrait : « Votre cabinet produit des liasses, bilans, bulletins de paie… Tous ces documents sont stockés dans votre GED. » La suite annonce la mise à disposition sur l'application et la plateforme web. Cela confirme une alternative native de restitution ; pas une fonction démontrée de préparation de lots avec autorisation humaine. Aucune compatibilité Memlia n'en est déduite.
2. Factory 456, `https://www.factory456.com/automatisation-de-la-plaquette-comptable-pour-les-cabinets`. Extrait : « Il les envoie même par mail au client comme au commissaire aux comptes. » L'article décrit génération, stockage, envoi et dépôt fiscal dans une prestation plus large. Il confirme une concurrence de service et le geste d'envoi, mais pas une demande isolée pour notre sous-périmètre. Ses affirmations d'infaillibilité, de gain ou de connexion universelle ne sont pas adoptées.
3. Welyb, `https://www.welyb.fr/`. Extrait : « Les clients ont accès aux documents et éléments produits en tout temps ». Alternative de portail et restitution. Cela n'établit ni l'autorisation d'envoi ni un journal des destinataires.
4. ACD, `https://www.acd-groupe.fr/`. Libellés « Dépôt des documents » et « Accès permanent aux documents ». Contexte d'outil collaboratif, pas preuve d'une automatisation des lots à livrer dans notre périmètre.

Conclusion : le geste est réel dans les offres des éditeurs et prestataires. Le besoin d'un service Memlia spécifique entre ces outils reste à qualifier. Un fournisseur qui décrit le geste n'est pas une mesure de demande commerciale.

## Rattachement utile et prévention des variantes

Propriétaire commercial retenu : `/automatisation-cabinet-comptable` (HTTP 200 constaté avec `Cache-Control: no-cache`). Le pilier `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` cite déjà les envois de plaquettes dans l'administratif. La famille `envois-plaquettes-documents` demeure active dans `src/data/familles.ts` : ne pas la supprimer, ni la fusionner avec `cloture-bilan` ou le tri de mail.

La route candidate est actuellement HTTP 404. Elle reste non créée ; aucun canonical croisé, aucune réservation de requête, aucun noindex de compensation. Aucune page actuelle n'est réécrite et les quatre angles du backlog restent des idées non autorisées à publier par ce rapport. Il s'agit d'éviter une page supplémentaire sans preuve de son intention distincte, pas d'affirmer une cannibalisation déjà mesurée.

La valeur à présenter dans une qualification commerciale : associer une version validée à chaque dossier et destinataire, préparer les lots, relever les anomalies, puis rapprocher les traces effectivement disponibles après autorisation. Avant de développer, vérifier d'abord si la restitution native du logiciel ou du portail répond déjà à la tâche.

## Frontière proposée pour une future qualification

Ce tableau est un cadrage de recherche, pas une automatisation livrée ni une recette scellée.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Inventaire des documents et versions, rapprochement au dossier et aux destinataires déjà autorisés, détection des pièces manquantes et doublons, brouillons de lots ; lecture des traces disponibles | Choix du lot à diffuser, confirmation des destinataires et de la version, autorisation explicite d'envoi ; nouvel envoi après correction | Relecture des comptes et documents, décision de diffusion, changement des droits, résolution d'un destinataire ambigu et traitement des incidents |

Arrêt dans le doute : document non validé, version contradictoire, dossier/destinataire non concordants, destinataire absent, autorisation absente ou trace d'envoi incertaine. Ne pas deviner, ne pas renvoyer automatiquement après un incident. Une trace d'envoi n'est ni une réception ni une lecture prouvée ; n'afficher que l'état réellement fourni par l'outil.

Distinct de la construction de la plaquette : les états sont fournis, leur contenu n'est pas fabriqué ici. Distinct du tri de mail : les entrées sont une liste de livraison et les fichiers concernés, pas une classification de la boîte de réception. Aucun envoi réel n'a été effectué.

## Critère de réexamen

Réexaminer lors d'une prochaine mesure utile ou d'une demande entrante qualifiée où un cabinet décrit des lots et destinataires qu'il prépare manuellement malgré ses outils actuels. Pour retenir une page dédiée, confirmer une intention de délégation propre, décrire une exception concrète non résolue nativement et identifier des accès/formats vérifiables. Ensuite seulement : recette à neuf sections, jeu fictif exécuté, `service:preparer`, revue métier indépendante puis `service:sceller`. Ces étapes sont non applicables à cette non-ouverture ; elles n'ont pas été prétendument exécutées.

## Livraison et prochaine étape

Documents à intégrer par l'enfant dev réorienté : ce rapport, les mesures `qualification-envois-plaquettes-2026-10-06.json` et la décision `decision-envois-plaquettes-2026-10-06.json`, tous sous `docs/strategy/site-v3/mesures/`. Les captures et scripts sont des pièces de recherche dans l'archive, pas du contenu public. Pas de modification du registre partagé, du backlog, des familles, du maillage, du sitemap, des titres ni des pages.

Base : `origin/main`, commit `2f4ba16bf55ae52f6d0d018bf7b5de39edd1ef70`, branche locale `site/envois-plaquettes-t_6aac7c25`. Le dev récupère le paquet durable de la carte parente, pas le dossier scratch. L'intégration documentaire en dépôt est le résultat de l'enfant ; la qualification et la décision sont le résultat de cette carte.
