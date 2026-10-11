# Clôture, bilan et plaquette : ne pas ouvrir de page de service à ce stade

Décision de recherche du 6 octobre 2026, carte t_f5fdfa0b, vague 3 rang 22.

## Résultat

Ne pas préparer ni publier `/automatisation/cloture-bilan`. Rattacher les demandes d'assemblage et de contrôle de complétude de livraison au service général existant `/automatisation-cabinet-comptable`. Conserver la famille éditoriale `cloture-bilan` et ses sujets de méthode dans le backlog, sans les déclarer validés ou prêts à publier. Cette décision n'est pas un refus de prendre la tâche en charge : elle refuse une URL commerciale supplémentaire sans intention distincte suffisamment établie.

## Mesure réalisée

Instrument du dépôt : `autocompleterGoogle`, client Firefox, langue et pays fr ; capture UTC exacte dans demande.json, 06:10:45 le 06/10/2026.

| Sonde | Instrument | Suggestions |
|---|---|---|
| automatisation clôture bilan cabinet comptable | OK | aucune |
| automatisation clôture comptable | OK | aucune |
| automatiser plaquette bilan | OK | aucune |
| plaquette bilan cabinet comptable | OK | aucune |
| logiciel plaquette comptable | OK | logiciel plaquette comptable |
| contrôle plaquette comptable | OK | aucune |
| assemblage plaquette comptable | OK | aucune |

Sept sondes réussies, six listes vides et une suggestion. L'autocomplétion ne mesure pas un volume mensuel ; aucune suggestion ne signifie ni absence de métier ni absence absolue de demande. Le seul signal de ce lot porte sur la recherche d'un logiciel, pas sur la délégation d'une tâche inter-outils. Le cache familial du 19/09 rapportait déjà zéro suggestion. La candidate commerciale exacte est désormais mesurée, et non supposée.

## Besoin et concurrence

ACD décrit déjà dans sa fiche liée à ACD COMPTA : « En interaction directe avec la comptabilité, générez et révisez entièrement à l’écran vos plaquettes, comptes annuels, liasses fiscales, états de détails et annexes. » La fiche mentionne les insertions d'états internes et externes et l'archivage PDF. Le fichier téléchargé affiche Avril 2026 malgré son URL de février 2023. Ce sont des annonces éditeur, pas une compatibilité testée par Memlia.

fulll propose une chaîne intégrée de production comptable, avec tenue, révision et fiscalité dans une base unifiée. Cette offre est adjacente ; la page lue ne démontre pas une fonction précise d'assemblage de plaquette. Sources, extraits et limites exacts dans concurrence.json.

Le besoin différenciant possible pour Memlia serait le contrôle d'un lot de livraison composé de sorties hétérogènes : inventaire attendu selon une règle du cabinet, identité et période communes, version des états, composant absent et maintien du statut de proposition. Ce besoin est une hypothèse de cadrage, pas un irritant client observé. Avant de le vendre séparément, il faut démontrer que les outils existants ne le couvrent pas et disposer d'un signal de délégation, terrain ou recherche.

Les éditeurs ont été lus directement. La recherche SERP n'a pas pu aboutir : Firecrawl 403, Google anti-robot, Bing timeout, DuckDuckGo challenge. Aucun classement concurrent, aucune fréquence des résultats et aucun volume ne sont déduits de ces échecs. La décision est conservatrice : demande commerciale non confirmée, et non certitude qu'elle n'existe pas.

## Rattachement sans cannibalisation

- Commercial : `/automatisation-cabinet-comptable`, qui répond déjà à la prise en charge d'une tâche dans les outils existants. Contrôle public sans query string, Cache-Control no-cache : HTTP 200 ; candidate HTTP 404.
- Méthode : famille existante `cloture-bilan` du backlog. Le plan prévoit notamment `/blog/automatiser-la-production-de-la-plaquette-de-bilan` sur « automatiser plaquette de bilan cabinet comptable », et une checklist de clôture annuelle. Ces routes restent planifiées, pas publiées ni nouvellement approuvées ici.
- Pilier publié : `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches`, section production comptable qui mentionne clôture, puis section administration qui distingue l'envoi de plaquettes. Pas de nouvelle page pour reformuler ces sujets.
- Le registre commun lu ne contient pas de réservation primaire clôture/plaquette/bilan pour la candidate. Ne pas lui réserver de requête commerciale puisqu'aucune recette n'est retenue.
- Ne pas réaffecter à la révision par cycles : justification des soldes distincte du contrôle de complétude du lot. Ne pas réaffecter à l'envoi de documents : une livraison assemblée n'est ni un destinataire validé ni une autorisation de diffusion.

## Frontière à conserver pour un cadrage ultérieur

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Inventaire comparé au manifeste fourni par le cabinet, liste des absents, rapprochement d'identité/période/version, proposition d'ordre des états | Choix des composants et versions retenus, acceptation du lot proposé | Écritures d'inventaire, appréciation comptable, validation des comptes, signature, décision de clôturer et d'envoyer |

Arrêt sur pièce manquante, version ambiguë, identité ou période divergente ; ne jamais remplacer un document saisi/validé par le cabinet ni fabriquer une annexe absente. Ce tableau cadre une hypothèse future et ne prétend pas à un rejeu réalisé.

## Conséquence de livraison

Aucun corps public, recette, preuve fictive ou statut prêt pour dev n'est fabriqué. `service:preparer`, revue metier et `service:sceller` ne s'appliquent qu'à la branche « si retenu » de la carte ; ils ne sont pas exécutés ici. Aucune affirmation réglementaire publique n'est produite ; aucune source juridique n'est utilisée pour déduire une obligation ou un régime d'annexe.

La carte dev enfant t_9b344053 doit intégrer cette décision et ses mesures dans les documents de stratégie du dépôt, au lieu de publier la candidate. Pas de changement de page, H1, canonical, sitemap, footer ou contrat d'intention public. La réouverture sera une décision nouvelle fondée sur une demande distincte documentée, pas une variante artificielle de « logiciel plaquette comptable ».

## Vérification

Instrument exécuté réellement ; sept réponses OK. Dossier de concurrence ouvert, PDF téléchargé et lu. Registre, architecture d'accès, charte, forge et backlog lus depuis un worktree origin/main (base 2f4ba16b). Arbre du worktree propre après recherche ; aucun fichier du dépôt partagé modifié. Vérification automatisée du dossier et des totaux dans verification.json. Paquet durable : rapport, mesures, concurrence, script de mesure, fiche ACD et vérification.

## Conservation dans le dépôt

Dossier intégré depuis les pièces durables de la carte t_f5fdfa0b, sans nouvelle mesure ni modification de la décision. Les observations et contrôles de production ci-dessus datent du 6 octobre 2026. Le champ `documentLocal` de concurrence.json désigne la fiche ACD conservée dans l’archive `qualification-cloture-bilan.tar.gz` jointe à cette carte, et non un fichier de ce dossier. Les JSON sont conservés à l’identique. Cette intégration ne valide pas les sujets éditoriaux planifiés et ne réserve aucune requête à la candidate.
