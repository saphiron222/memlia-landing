# Memlia OS et modèle IA privé — décision du 16/10/2026

Demande de Kevin : deux offres nouvelles, complémentaires du catalogue, dans la DA crème/verte existante. Page commerciale, aucun produit réellement installé, aucune collecte, aucun entraînement ni achat lancé par ce chantier. Le bureau collectif illustre les sources, la mémoire, la préparation et la validation. Les interfaces sont des illustrations fictives, sans faux traitement en direct.

## Architecture retenue
Memlia OS est une couche d’orchestration métier : connecteurs autorisés → ingestion/index documentaire avec provenance et ACL → recherche filtrée par identité → modèle → outils limités par tâche → validation/trace. Le modèle ne stocke pas les autorisations à lui seul. Les permissions sont appliquées avant recherche et action ; l’index suit les retraits et suppressions. Séparer procédures partageables et données des dossiers, comptes techniques, espaces, journaux et secrets. Une instruction contenue dans une source reste une donnée ; elle ne modifie pas la politique.

Sessions bornées, synthèses avec sources et durée définie ; pas d’indexation des échanges privés par défaut, pas de classement des salariés. Tous les outils externes sont autorisés individuellement. Arrêt si droit incertain, source contradictoire, authentification expirée ou demande hors périmètre. Les envois, signatures, dépôts et décisions professionnelles conservent leurs validations.

Le modèle privé est un post-entraînement d’une base à poids accessibles, avec licence vérifiée. Le RAG apporte les connaissances actualisées et les sources ; le fine-tuning travaille comportement, format et vocabulaire. Ne pas entraîner indistinctement sur tous les dossiers. Qualification/déduplication, prévention des fuites entre jeux, holdout figé, comparaison de base, erreurs/refus/coûts/latences, version/approbateur, export et retour arrière. Une baisse de la fonction de perte n’est pas une preuve métier. Aucun réentraînement ou relèvement de budget automatique.

Droits contractuels sur l’adaptation, pas propriété exclusive du modèle de base. Livraison poids adaptés OU adaptateur et recette selon licence. Vérifier licence exacte (les modèles Mistral n’ont pas tous la même), chaîne des droits et restrictions de redistribution. ChatGPT/Claude/Gemini sont des références généralistes, pas des poids que Memlia promet de livrer.

## Mammouth
L’API OpenAI-compatible documente l’inférence de modèles proposés par le fournisseur. Les pages consultées n’établissent pas d’upload de poids personnalisés ni de service de fine-tuning. Le catalogue agents continue de pouvoir utiliser Mammouth. Le modèle privé exige une chaîne distincte à poids accessibles et un hébergement adapté. Toute sortie vers une API distante est cartographiée et autorisée. Aucun appel API effectué, aucune clé disponible.

## Déploiement et matériel
Décision : Memlia OS indépendant du matériel ; ne pas enfermer la page dans un SKU ni promettre une capacité en utilisateurs sans bench. Mac mini Pro avec 64 Go candidat au premier pilote de mémoire et inférence locale ; vérifier SKU réellement disponible au devis. NVIDIA DGX Spark 128 Go candidat à l’expérimentation CUDA et à l’adaptation locale. Serveur GPU dédié pour une charge soutenue ou davantage de concurrence après mesures. Entraînement séparé de l’inférence de production. Pas de transformation de « peut charger 200B » en promesse de débit.

Sources officielles consultées le 16/10 : Apple /fr/mac-mini/specs (page courante affichant M6 / M5 Pro, 64 Go max Pro), NVIDIA DGX Spark hardware (GB10 Arm,128 Go mémoire unifiée,273 Go/s,10GbE), release-notes, MLX-LM (inférence et LoRA/fine-tuning Apple Silicon). Les anciens résultats Apple 2024 M4 ne sont pas la référence d’achat courante. Aucun prix matériel vérifié, aucun benchmark physique réalisé.

Avant commande : volume/format/OCR, taille/contexte du modèle, appels d’outils, usages simultanés, latences p50/p95, qualité métier, débit soutenu, RAM/cache, chiffrement, reprise/redémarrage, sauvegarde restaurée, retrait ACL, perte de connexion, exploitation distante et compatibilité Arm des dépendances. Budget total : équipement, intégration, indexation, stockage/backup, calcul, électricité, administration, maintenance et renouvellement. Le mini-boîtier n’est pas une base de données GPU : index, modèle et orchestration sont des composants distincts.

## SEO et offre
- /memoire-collective-cabinet-comptable : mémoire collective du cabinet comptable ; service d’organisation/contexte/orchestration, distinct d’une fiche agent ou intégration.
- /modele-ia-prive-entreprise : modèle IA privé entreprise ; entraînement spécialisé et cycle de vie, audience entreprise explicitement demandée.
Recherche qualitative via moteur web le 16/10 : résultats « mémoire collective cabinet comptable » encore hétérogènes ; « modèle IA privé entreprise » mélange déploiement et entraînement. Clarifier les livrables et la distinction RAG/adaptation. Aucun volume, rang Google certifié ou demande chiffrée revendiqué. Deux intentions de service dédiées, aucune migration des URL existantes.

Devis dédié pour ces deux prestations. La grille agents (199 € de socle + tarif par agent) reste l’autorité du catalogue ; elle ne devient pas un prix implicite d’entraînement ou de matériel. CTA commun contact, sans données personnelles dans l’URL, aucun formulaire d’upload.

## Références primaires
- https://www.apple.com/fr/mac-mini/specs/
- https://docs.nvidia.com/dgx/dgx-spark/hardware.html
- https://docs.nvidia.com/dgx/dgx-spark/release-notes.html
- https://github.com/ml-explore/mlx-lm
- https://info.mammouth.ai/fr/docs/api-quick-start/
- https://help.mistral.ai/en/articles/347393-under-which-license-are-mistral-s-open-models-available
- https://www.cnil.fr/ia-garantir-la-securite-du-developpement
- https://www.cnil.fr/fr/ia-respecter-lexercice-des-droits-des-personnes
Les recommandations CNIL portent notamment sur minimisation, cloisonnement, sauvegardes, mémorisation et exercice des droits. Elles ne constituent pas une certification de l’offre.


## Dernier arbitrage de Kevin — 16/10, après inspection
Le boîtier type Mac mini est rejeté, ainsi que la section longue en couches et son traitement inspiré de ReStructure. Abandon total de cette direction visuelle, aucune variante matérielle à proposer. L’architecture matérielle reste une question de déploiement, pas l’illustration commerciale. Nouvelle représentation : le bureau collectif, avec sources, mémoire sourcée, préparation par agent et validation, quatre étapes manuelles compactes. Les huit fonctions techniques restent couvertes par les textes, regroupées en quatre principes. Les deux originaux générés sont archivés hors dépôt, retirés de la production.


### Emblème Memlia OS — correction validée par Kevin
Kevin apprécie la nouvelle représentation bureau collectif et demande une figurine propre à Memlia OS dans son centre, à la place du petit pictogramme. Figurine originale monobloc crème, trois courbes et livre ouvert sauge, matière/lumière de Balthazar, anneau vert. Placement central 128 px et rappel final72 px ; aucune réintroduction du matériel ou de la décomposition. Originaux, PNG1024, AVIF/WebP128/256/512 et prompt exact conservés dans les sources durables `figurine-os/`.


### Placement corrigé après retour Kevin
Le pictogramme réseau est restauré au centre du bureau collectif. La figurine quitte l’interface. Elle accompagne désormais la présentation « Le contexte, les outils et les décisions. Reliés. » en192 px, sans cadre ni médaillon, et reste en rappel final72 px. Aucun changement du parcours fonctionnel validé.


### Dernière décision de Kevin — abandon de l’emblème
Retrait complet de la figurine, y compris son rappel final. Aucun nouvel emblème à proposer. Le bureau collectif validé et son pictogramme restent la représentation de Memlia OS. L’introduction de la section est restaurée. Sources des pistes rejetées conservées hors dépôt, aucun actif rejeté dans public/.


## Arbitrage du 16/10 — bases ouvertes et navigation
Kevin demande de remplacer les trois repères ChatGPT/Claude/Gemini par les familles réellement candidates à l’adaptation : Llama, Mistral, Qwen, DeepSeek, Gemma, gpt-oss. Les logos proviennent des sites ou comptes officiels. Les versions de licence vérifiées sont consignées dans docs/qa/memoire-modeles/logos-manifest.json et public/logos/modeles/SOURCES.md. La page dit « à poids accessibles » : elle ne promet ni licence uniforme, ni toutes les bases sur tout matériel. Le choix est fait sur la tâche, le français, les formats, les ressources et les droits applicables. Aucune base n’est déjà entraînée par ce chantier.

Le header regroupe quatre prestations sous Nos services. Intégrations sort du groupe et devient un lien direct. Le footer reprend les mêmes quatre offres, et classe Intégrations avec Outils gratuits dans Vos outils. Aucun ancien catalogue de pôles ou guide environnement ne revient.
