## La tâche dans les mots du cabinet

« L’annonce est arrivée, mais la fiche client est-elle à jour et l’associé a-t-il vu ce qui change ? » Kanta récupère déjà les informations INPI à l’ouverture du dossier. Le BODACC propose des alertes génériques. Nous ne vendons ni cette première lecture ni une nouvelle boîte d’alertes.

Nous prenons le passage de la publication à une action dans le dossier : rapprocher les changements du RNE, du BODACC et de Sirene avec la fiche client, préparer les champs à actualiser et l’alerte destinée à l’associé référent. Si une procédure collective est signalée et qu’une créance du cabinet ou d’un client est identifiée, une date de déclaration est proposée selon la règle validée. Un client concerné par une annonce n’est pas nécessairement le créancier : le dossier distingue débiteur, créancier et responsable du suivi.

Avant engagement, nous vérifions votre outil, son édition et ses options. S’il actualise déjà les fiches et dirige les alertes vers les bons responsables, nous ne dupliquons pas ce circuit. Le suivi de portefeuille reste distinct de la tenue d’un registre légal, de la qualification des bénéficiaires effectifs et du dépôt d’une formalité.

## La règle écrite

**La frontière.** Le SIREN confirmé relie les sources autorisées à la bonne fiche. Chaque changement conserve sa provenance et sa date de lecture ; un événement ne suffit pas à écraser une donnée validée. Le cabinet fixe les champs actualisables, les responsables et les cas de déclaration de créance inclus.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Rapprocher les extraits RNE, BODACC et Sirene de la fiche existante ; proposer les champs modifiés. | La mise à jour de la fiche client, sans écraser les annotations. | Définir les données de référence et résoudre une contradiction. |
| Préparer l’alerte à l’associé avec la publication, le dossier et l’action attendue. | Le destinataire, le contenu et l’envoi de l’alerte. | Apprécier l’effet du changement sur la mission et contacter le client. |
| Calculer un terme calendaire dans un cas de déclaration de créance déjà qualifié. | La date applicable, ses prorogations et son inscription dans le suivi. | Qualifier la créance, les exceptions, le point de départ et décider qui déclare. |

**La proposition.** Une fiche présente les valeurs actuelles et proposées, les sources et l’alerte à l’associé. Pour le calcul de créance, le démonstrateur est limité au cas général validé : créance antérieure, sans sûreté publiée ni contrat publié, créancier et juridiction en métropole, sans point de départ particulier. Il ajoute deux mois calendaires à la date de publication du jugement d’ouverture au BODACC, pas à la date du jugement ni à celle de réception du courriel. Il affiche un terme calendaire à valider, pas une échéance opposable : la prorogation pour un jour non ouvrable et les exceptions restent à vérifier par le professionnel avant inscription dans le suivi.

**L’arrêt.** Identité incertaine, sources contradictoires, lecture incomplète ou événement déjà traité arrêtent la nouvelle fiche. Sans publication datée, sans qualification validée ou hors cas général, aucun terme n’est calculé ; l’alerte reste une demande d’examen humain. L’absence d’annonce ne prouve pas l’absence de changement. Une lecture manquante ne devient pas un dossier « à jour ».

**Le jeu d’essai.** Les dossiers et extraits sont inventés. Le rejeu reprend des changements fictifs déjà fournis en entrée et vérifie les annotations conservées, l’alerte préparée et le calcul calendaire, sans connexion aux registres ou aux logiciels du cabinet. L’automatisation dans vos outils et les règles de date complètes se recettent avant utilisation.

## Rejoué sur le jeu fictif

Le 2026-10-06, dix cas ont été exécutés avec `preuves/rejouer-recadre.py` ; sorties : `preuves/rejeu.json`. Aucun envoi, dépôt ni écriture client. Les dates ci-dessous sont des sorties du calcul sur le jeu fictif, pas des conseils pour un dossier réel.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Publication fictive du 6 septembre 2026, cas général qualifié. | Fiche proposée, alerte à l’associé, terme calendaire au 6 novembre 2026. | Valider les changements et vérifier la date applicable avant inscription. |
| Publication fictive du 31 décembre 2026. | Terme calendaire au 28 février 2027, avec prorogation à vérifier. | Ne pas présenter ce dimanche comme échéance définitive. |
| Changement de fiche sans procédure collective. | Champs proposés et alerte ; aucun calcul de créance. | Valider la mise à jour seulement. |
| Qualification de la créance inconnue. | Fiche et alerte ; aucun terme calculé. | Examen humain. |
| Sûreté publiée ou situation territoriale hors cas général. | Fiche et alerte ; aucun terme calculé. | Déterminer le point de départ et la règle spécifique. |
| Date de publication absente. | Fiche et alerte ; aucun terme calculé. | Retrouver la publication de référence. |
| Sources contradictoires. | Arrêt de la fiche. | Résoudre la contradiction. |
| Identité non confirmée. | Arrêt de la fiche. | Rattacher l’annonce au bon dossier. |
| Lecture incomplète. | Arrêt de la fiche. | Compléter la lecture autorisée. |
| Événement déjà traité. | Arrêt de la nouvelle fiche. | Éviter un doublon. |

## Ce que nous prenons en charge

Nous suivons une publication jusqu’au geste que votre équipe refait : modifier la fiche client, avertir l’associé et préparer la date à examiner. Nous identifions d’abord les fonctions déjà utilisées chez vos éditeurs, puis écrivons la règle du travail résiduel avec vos collaborateurs.

Nous construisons cette préparation dans les outils retenus, faisons recetter les changements et les arrêts, puis maintenons les accès et règles convenus. La source publique n’est pas le produit vendu : la tâche prise en charge est son exploitation dans votre dossier.

## Ce que le cabinet garde

Le cabinet valide la fiche et l’alerte, qualifie les conséquences juridiques, détermine si une créance doit être déclarée et par qui. Il contrôle la date proposée, les règles particulières et les prorogations. Un délai territorial, une sûreté publiée, un contrat publié ou une créance postérieure ne se traitent pas en appliquant automatiquement deux mois à toute annonce.

Aucune qualification de bénéficiaire effectif, inscription légale, déclaration de créance ni formalité n’est réalisée par le démonstrateur. Notre circuit de validation et d’arrêt se précise lors de la recette, selon nos [garanties](/garanties).

## Dans vos outils

Les entrées possibles sont une liste de SIREN validés, les fiches du portefeuille et des extraits ou flux autorisés du RNE, du BODACC et de Sirene. Les sorties sont les champs à actualiser, une alerte à l’associé et, dans le périmètre convenu, une date calculée à valider. Un connecteur, une synchronisation ou un droit d’accès n’est pas présumé disponible : nous les testons avant engagement.

Les champs validés et les annotations restent séparés de la proposition. Les données à accès restreint ne sont pas promises en collecte publique. Si votre logiciel couvre déjà une sortie, nous conservons son circuit et ciblons seulement ce qui manque.

## La preuve

Le jeu fictif montre une fiche proposée à partir de changements fournis en entrée, avec trois sources fictives nommées, une alerte à l’associé et un calcul de terme calendaire. Il ne démontre pas lui-même le rapprochement des extraits. Il ne démontre pas une connexion à Kanta ou aux sources publiques. Notre [méthode](/methode) explique la recette dans les outils réels.

L’article R. 622-24 du Code de commerce fixe le délai général à deux mois à compter de la publication du jugement d’ouverture au BODACC et prévoit des augmentations territoriales. La fiche Service Public précise notamment les points de départ particuliers pour les créanciers titulaires d’une sûreté publiée ou liés par un contrat publié. Ces règles justifient un calcul borné et une validation, non une date universelle pour toute annonce.

Sources : [Kanta, les données INPI](https://www.kanta.fr/) ; [BODACC, service d’alerte](https://www.bodacc.fr/pages/informations_generales_service_alertes/) ; [INPI, Registre national des entreprises](https://www.inpi.fr/realiser-demarches/formalites-dentreprises/mettre-jour-registre-national-entreprises-rne) ; [Insee, Sirene](https://www.insee.fr/fr/information/3591226) ; [Code de commerce, R. 622-24](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000029175247) ; [Service Public, déclaration de créances](https://entreprendre.service-public.gouv.fr/vosdroits/F22359), fiche du 27 novembre 2024, lecture du 6 octobre 2026.

## Le prix

Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources accessibles, des champs à synchroniser, des destinataires, des cas de calcul retenus, des exceptions et des validations. Maintenance, support et évolutions sont écrits. Une description du geste suffit pour commencer.

## Questions de décision

### Que reste-t-il si nous utilisons déjà Kanta et les alertes BODACC ?

Nous vérifions si les changements alimentent réellement votre fiche client, si l’associé reçoit une alerte exploitable et si les dates de créance sont suivies. Nous ne revendons pas la lecture INPI à l’ouverture ni une alerte générique. Si tout ce circuit est déjà couvert, cette tâche ne justifie pas une seconde automatisation.

### La fiche est-elle modifiée sans contrôle ?

La proposition sépare valeurs actuelles, changements et sources. Le cabinet valide avant la mise à jour dans son outil ; les annotations ne sont pas remplacées.

### Le délai de créance est-il calculé pour toute procédure ?

Non. La règle doit être qualifiée et validée. Le jeu présenté calcule seulement le terme calendaire du cas général ; il ne résout ni les points de départ particuliers ni les prorogations. Le professionnel contrôle la date avant son utilisation.

### L’alerte est-elle envoyée et la créance déclarée ?

Le jeu prépare l’alerte ; aucun message ne part. L’associé valide la suite à donner. La déclaration de créance, la qualité du déclarant et les formalités restent humaines.

### Comment vérifier la fiabilité avant utilisation ?

Nous rejouons vos champs et règles sur des données fictives, vérifions les identités, les cas particuliers, les doublons et les arrêts, puis recettons les accès réels. Une lecture incomplète ou une exception ne doit jamais devenir un statut rassurant.
