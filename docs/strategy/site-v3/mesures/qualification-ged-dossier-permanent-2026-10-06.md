# GED et dossier permanent : qualification du service candidat

Décision du 6 octobre 2026, carte t_4a179762 : ne pas ouvrir /automatisation/ged-dossier-permanent à ce stade. Rattacher commercialement le nommage, le classement et l’index des pièces à /automatisation-cabinet-comptable. Un besoin documentaire et une offre logicielle existent ; une intention autonome de confier cette tâche dans une GED déjà installée n’est pas démontrée. Ce n’est pas une conclusion d’absence de marché.

## Demande mesurée aujourd’hui

Huit sondes Google Suggest, client firefox, hl=fr, gl=fr, exécutées le 06/10/2026, toutes HTTP 200 :

| Requête | Suggestions retournées |
|---|---|
| automatisation classement dossier comptable | 0 |
| automatiser classement GED cabinet comptable | 0 |
| classement automatique documents comptables | 0 |
| GED cabinet comptable | 2 : ged cabinet comptable ; ged expert comptable |
| dossier permanent comptable | 4 : dossier permanent comptable ; dossier permanent comptabilité ; dossier permanent expert comptable ; exemple dossier permanent expert comptable |
| automatisation dossier permanent | 0 |
| nommage automatique pièces comptables | 0 |
| prestataire classement GED comptable | 0 |

Six listes vides, six suggestions au total sur les deux formulations génériques. Le signal GED relève de la catégorie logicielle ; le dossier permanent reste générique ou informationnel, notamment la recherche d’un exemple. Aucune suggestion ne qualifie la délégation du classement dans l’existant. Les listes vides ne signifient ni zéro recherche ni absence de besoin. Aucun volume mensuel n’a été mesuré. Réponses brutes, URLs et heures UTC dans captures/autocompletion.json.

## Concurrence et limites

Le moteur web du catalogue échoue avec Firecrawl 403. Les trois recherches DuckDuckGo reçoivent un challenge HTTP 202 : elles ne sont pas comptées comme SERP vides. Bing, ouvert au navigateur sur « GED cabinet comptable classement automatique », renvoie surtout des définitions génériques de GED et des homonymes ; cette lecture est insuffisamment pertinente pour établir une concurrence spécialisée et n’est pas utilisée comme preuve d’absence d’offre. La recherche continue donc directement sur des sources primaires, avec liens découverts sur les accueils ACD et Zeendoc.

ACD GED, ouvert aujourd’hui HTTP 200 :
https://www.acd-groupe.fr/solution-expert-comptable/acd-ged/

Extrait exact de la capture texte : « Bénéficiez des fonctions de ACD GED dans Outlook™ : annuaire des adresses mails, suivis événementiels, archivage et classement des pièces jointes ».

Portée : solution de GED pour la profession comptable et classement des pièces jointes lié à Outlook. Cela ne démontre ni un classement autonome de tout dossier permanent ni l’accès de Memlia à la GED. L’offre standard est une première option à examiner, pas un concurrent artificiellement insuffisant.

Zeendoc, « Classement et recherche », ouvert aujourd’hui HTTP 200 :
https://www.zeendoc.com/ged/recherches

Extraits exacts : « un système de recherche intelligent associé à la fonction de classement automatique des documents. » ; « L’ IA dans Zeendoc est capable d’indexer automatiquement vos notes de frais et vos documents fournisseurs » ; « Des noms de fichiers énigmatiques, des dossiers mal organisés, une absence totale de logique... ».

Portée : l’éditeur vend le classement automatique et l’indexation de documents, notamment fournisseurs et notes de frais. Le vocabulaire confirme le geste et l’irritant ; il ne prouve pas une demande de prestation distincte pour un dossier permanent de cabinet. Les taux de détection, gains, localisation et déclarations de conformité de l’éditeur ne sont pas repris comme faits vérifiés. MyCompanyFiles a aussi été ouvert HTTP 200 pour situer l’adjacent collecte/publication, sans l’assimiler au classement dans une GED.

Captures primaires : acd-ged.html/txt, zeendoc-classement.html/txt, concurrents-primaires.json ; les accueils et leurs liens sont conservés dans sources.json. Couverture non exhaustive, classement des concurrents en SERP non établi.

## Périmètre utile à rattacher

Déclencheur : une pièce déjà reçue doit être retrouvée dans le dossier du bon client selon la convention du cabinet. Entrées envisagées : fichiers autorisés, identifiant de dossier explicite, convention de nommage et de classement approuvée, index de la GED, droits disponibles. Sortie utile : proposition de nom, chemin et métadonnées, avec origine et anomalies visibles. La collecte réclame et reçoit la pièce ; cette tâche commence après réception. L’envoi de documents commence après validation, et n’est pas inclus.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Lire les métadonnées autorisées, comparer à la convention écrite, préparer un nom, une destination et un index proposés, détecter les collisions | Valider la proposition de classement et de nommage, résoudre l’identification ambiguë d’un dossier ou les versions concurrentes | Choisir le plan de classement, les droits, la pièce à conserver, apprécier son contenu et sa validité, décider de supprimer ou remplacer un document |

Arrêt envisagé : identité du dossier ambiguë, doublon ou collision de nom, version concurrente, fichier illisible, destination hors périmètre ou droits insuffisants. Aucun reclassement ni renommage dans le doute ; aucun écrasement ni suppression de l’original. Une présence dans l’index ne prouve pas la validité de la pièce. Le dossier permanent n’est pas présenté comme une liste réglementaire universelle.

Ce cadrage n’est pas une automatisation livrée ni un rejeu : aucun cas fictif exécuté n’est revendiqué. Une réouverture exigerait notamment les cas courant, ambiguïté et doublon réellement joués, puis une recette métier.

## Architecture et cannibalisation

Lecture depuis origin/main 2f4ba16bf55ae52f6d0d018bf7b5de39edd1ef70, branche site/ged-dossier-permanent-t_4a179762. La charte du worktree est v4 ; la copie principale locale v3 n’a pas été utilisée comme vérité finale. Aucune doctrine n’a été modifiée.

src/data/familles.ts décrit : « Classer, nommer et retrouver les pièces et le dossier permanent sans reclasser à la main. » Le backlog porte quatre angles informationnels de priorité 3 : méthode de classement/nommage, checklist avant transfert, pièces sensibles, définition. Tous présentent zéro suggestion historique le 19/09. Les questions associées sont génériques (logiciel de saisie, logiciels GED, coût et définition de GED), pas une preuve d’intention commerciale. La méthode de classement vise déjà « automatiser classement GED cabinet comptable » : ne pas réserver cette même intention à une nouvelle page commerciale. Les suggestions fraîches sur le dossier permanent sont une piste de qualification informationnelle, pas un mandat de publier ces quatre angles.

Aucune mention littérale de ged-dossier-permanent n’est trouvée dans le registre de requêtes ou le cache d’autocomplétion parcourus. Leur absence de mention n’est pas une mesure de demande. Conserver la famille et le backlog, sans ajout artificiel de route ni réservation primaire dans le contrat commun.

/automatisation-cabinet-comptable reste la cible commerciale canonique ; ni collecte, ni saisie ni factures fournisseurs ne doivent absorber artificiellement le dossier permanent entier. GET public avec Cache-Control: no-cache : service général HTTP 200, candidate HTTP 404. Aucun contenu public, sitemap, canonical ou lien existant modifié.

## Réouverture et handoff

Réouvrir sur un signal précis de délégation dans l’existant : demande cabinet documentée sans donnée personnelle, requête commerciale distincte qualifiée, ou usage réel d’une proposition de classement avec exceptions récurrentes que les fonctions natives ne couvrent pas. Examiner d’abord la GED déjà installée. Si l’intention reste « exemple » ou définition, le bon format serait une réponse informationnelle utile ; elle doit être qualifiée séparément.

La candidate n’étant pas retenue, service:preparer, revue métier et service:sceller ne s’appliquent pas. Aucun contenu public réglementé ni recette factice n’est produit. L’enfant dev t_766a50e2 est réorienté vers l’intégration documentaire de cette qualification uniquement ; aucune publication de service commandée.

Le paquet durable contient livraison/ (rapport, décision et vérification), captures/ et scripts de mesure. Le développeur doit utiliser l’archive attachée à la carte, pas dépendre de la survie du scratch. Pas de modification directe du registre partagé : la décision vit dans un document autonome de mesures, pour éviter les collisions entre qualifications parallèles.
