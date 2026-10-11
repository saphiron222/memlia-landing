# Exports et imports des logiciels : qualification du service candidat

Décision du 6 octobre 2026 : ne pas ouvrir /automatisation/exports-imports-logiciels maintenant. Rattacher commercialement cette famille au service existant /automatisation-cabinet-comptable. Le besoin technique est réel, notamment prévenir les imports répétés ; les mesures disponibles ne confirment pas une intention de délégation distincte. Cette décision n'est pas une déclaration d'absence de marché.

## Demande mesurée

Instrument du dépôt : autocompleterGoogle, scripts/lib/seo-instruments.mjs ; Google Suggest client=firefox, hl=fr, gl=fr, le 06/10/2026 vers 08:31 CEST. Huit réponses réussies, sept listes vides. La seule liste non vide contient dix suggestions sur « import export comptabilité » : la requête elle-même et neuf formulations anglaises de finance, accounting, course, procedure, India et companies. Ambiguïté commerce international : ce signal ne qualifie pas l'import de fichiers logiciels en cabinet.

| Requête | Suggestions |
|---|---:|
| automatisation import exports comptables cabinet comptable | 0 |
| automatisation import comptable | 0 |
| import automatique écritures comptables | 0 |
| import export comptabilité | 10, signal ambigu |
| import csv comptabilité | 0 |
| doublon import écritures comptables | 0 |
| automatiser import fichier comptable | 0 |
| conversion fichier comptable import | 0 |

Aucun volume mensuel n'est revendiqué. Une liste vide n'est pas un volume nul. Les quatre angles de la famille dans backlog-v3.json ont chacun zéro suggestion au 19/09 et une intention SERP non qualifiée. Le registre courant ne réserve pas de requête d'import à cette famille. Les mesures brutes, dates et suggestions exactes sont jointes.

## Besoin et concurrence

Hermes/Firecrawl search a répondu HTTP 403. Alternative réellement exécutée : trois SERP DuckDuckGo HTML avec kl=fr-fr et captures conservées, toutes HTTP 200. La localisation effective et les classements Google ne sont pas établis.

La candidate commerciale mélange des guides d'automatisation générale (AzenFlow, ACS, Queoval et autres) et l'activité import-export au sens du commerce international (Figital Expertise). Les promesses chiffrées et réglementaires des extraits ne sont pas reprises comme faits. La requête « import csv écritures comptables logiciel » donne essentiellement des aides éditeur (Sage, MyUnisoft, EBP, CALEB), des guides et de la récupération de données. La requête « doublon import écritures comptables » fait apparaître des discussions Sage/Compta-Online et des aides d'import. Il existe donc un irritant spécifique, mais les résultats répondent surtout à « comment faire / réparer », pas à « confier une tâche ».

Sources primaires ouvertes le 06/10/2026, HTTP 200, HTML et texte archivés :

1. Sage 50, « Importer un Fichier des Écritures Comptables (FEC) » : https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150079909&hypermediatext=null. Extrait exact : « L’importation d’un même fichier une seconde fois entraîne la création de doublons d’écritures comptables. » La page précise que Sage 50 ne contrôle pas les mouvements existants pour les mettre à jour. Preuve d'un risque concret dans ce produit et ce parcours, pas d'un défaut universel des logiciels.
2. Sage Production Comptable Experts, « Importer des écritures comptables via l'état Import Générique » : https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=211010150080170&hypermediatext=null. Extrait exact : « L'intégration par dossier ou par tâche planifiée permet d'inclure les écritures et les pièces correspondantes, selon des formats prédéfinis. » Alternative native à vérifier avant une construction sur mesure ; aucune compatibilité Memlia déduite.
3. CALEB Gestion : https://calebgestion.com/aide/ecritures/importation_ecritures.htm. Extrait exact : « Cette option permet de récupérer des écritures en provenance d'un autre logiciel (ou d'un autre dossier comptable) et stockées dans un fichier texte (TXT ou CSV). » L'aide décrit les colonnes et recommande une sauvegarde ; elle confirme que le schéma et le dossier cible font partie du geste.
4. MyUnisoft : https://support.myunisoft.fr/comment-importer-des-%C3%A9critures-sur-myunisoft-en-utilisant-le-fichier-mod%C3%A8le-.csv. Titre exact : « Comment importer des écritures sur MyUnisoft en utilisant le fichier modèle .csv ? » Alternative native pour les données avec analytique, sans preuve d'idempotence dans cette lecture. Ne pas transformer une aide en certification de comportement.

Aucune donnée client n'a été utilisée, aucun import métier ni écriture réelle n'a été effectué. Aucun fait juridique de la SERP n'est adopté.

## Rattachement utile et séparation des intentions

Propriétaire commercial : /automatisation-cabinet-comptable, HTTP 200 constaté avec Cache-Control: no-cache. La route candidate répond 404 et reste non créée. Le pilier /blog/automatiser-un-cabinet-comptable-la-carte-des-taches couvre déjà les familles ; le glossaire possède « Export logiciel et import CSV ». Ces surfaces répondent respectivement au choix de tâche et à la compréhension. Les idées du backlog ne deviennent pas publiables par ce rapport.

La famille exports-imports-logiciels reste active et distincte de integration-connecteurs. Son entrée est un lot de fichiers fourni ou déposé, avec un schéma et une version connus ; sa sortie est une proposition de fichier cible et un bilan d'écarts. La synchronisation API échange des événements ou des états entre applications : elle ne se confond pas avec cette préparation de lots. Pas de service par éditeur, pas de page par format, pas de déplacement d'URL ni de réécriture des pages existantes.

La non-ouverture évite une nouvelle page sans intention propre confirmée ; elle ne prouve pas une cannibalisation déjà observée. La meilleure piste de réexamen est plus précise : préparer un import récurrent et contrôler son rejeu lorsque la fonction native laisse une opération manuelle non résolue.

## Frontière pour une qualification future

Ce tableau cadre la recherche ; ce n'est ni une recette scellée ni un service déjà livré.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Inventorier les fichiers et lots ; comparer les colonnes au schéma accepté ; contrôler types, dates, montants, compteurs et totaux ; signaler doublons et lots déjà traités ; produire un fichier candidat et un bilan d'écarts | Correspondance des champs et règles initiales ; choix du dossier et de la période ; approbation du lot candidat ; autorisation d'import et de reprise après incident | Jugement comptable, résolution des écarts, modification de règles, décision de correction des écritures existantes et validation de la restitution dans l'outil cible |

Conditions d'arrêt : schéma changé, colonne inconnue ou manquante, date/montant non interprétable, dossier ou période ambigus, identifiant absent ou contradictoire, contrôle de total en écart, lot déjà chargé, résultat d'import incertain.

Idempotence : un nom de fichier ou une empreinte seule ne prouve pas l'absence de doublon métier. Définir le lot et les clés de lignes avec le cabinet ; distinguer retransmission du même lot et nouvel export partiellement recouvrant. Conserver les traces effectivement disponibles. Après un import partiel ou un accusé incertain, arrêter pour rapprochement humain, pas de rejeu automatique. Ne jamais déduire une écriture réussie de la seule génération d'un fichier. Préserver les saisies du cabinet, sans suppression ni remplacement automatique.

## Critère de réexamen et livraison

Réexaminer à la prochaine demande entrante qualifiée ou à une mesure plus probante : un cabinet décrit un import récurrent, une transformation/exception non couverte par l'outil natif, des accès et formats testables, et souhaite confier le geste. Avant une page dédiée, confirmer cette intention, puis préparer neuf sections et un jeu fictif exécuté, service:preparer, revue indépendante metier et service:sceller. Ces étapes sont non applicables à la non-ouverture et n'ont pas été simulées.

L'enfant dev existant est réorienté vers l'intégration documentaire de ce rapport, qualification-exports-imports-2026-10-06.json et decision-exports-imports-2026-10-06.json sous docs/strategy/site-v3/mesures/. Les captures et scripts du paquet sont des pièces de recherche, pas du contenu public. Aucun changement du registre partagé, du backlog, des familles, des contrats d'intention, du maillage, du sitemap ou des pages.

Base de travail : origin/main, branche locale site/exports-imports-t_0368cb6d, dans le worktree site/ de cette carte. Le développeur récupère les trois documents depuis livraison/ de l'archive durable attachée à la carte, pas depuis un dossier scratch susceptible d'être supprimé. La qualification est terminée ; l'intégration en dépôt relève de l'enfant.
