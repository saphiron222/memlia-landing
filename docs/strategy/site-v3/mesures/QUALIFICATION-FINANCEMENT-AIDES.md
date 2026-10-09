# Financement et aides : qualification du service candidat

Décision du 6 octobre 2026, carte t_bc4590e7 : ne pas ouvrir /automatisation/financement-aides à ce stade. Rattacher l’assemblage des pièces et le suivi de complétude à /automatisation-cabinet-comptable. Le besoin documentaire est crédible ; une intention distincte de confier son automatisation n’est pas démontrée. Ce n’est pas une conclusion d’absence de marché.

## Demande réellement mesurée

Huit sondes Google Suggest, client firefox, hl=fr, gl=fr, exécutées aujourd’hui, répondent HTTP 200 avec zéro suggestion chacune :

- automatisation dossier financement cabinet comptable
- automatisation dossier financement
- dossier financement expert comptable
- automatiser dossier aides entreprise
- logiciel dossier financement expert comptable
- suivi complétude dossier financement
- montage dossier aides cabinet comptable
- collecte pièces financement entreprise

Capture : captures/autocompletion.json, réponses brutes, URLs et heure UTC conservées. Aucun volume mensuel n’a été mesuré. Les listes vides ne signifient ni zéro recherche ni zéro besoin. La mesure historique du 19/09 n’a pas été présentée comme actuelle.

## Concurrence et limites de recherche

La recherche web du catalogue puis l’extraction ont échoué (Firecrawl sans clé, 403). Une première tentative Python a échoué sur le magasin de certificats ; curl a permis les huit mesures sans désactiver TLS. Les trois pages Google HTTP 200 étaient des pages de redirection JavaScript, pas des SERP exploitables.

La SERP DuckDuckGo de la requête candidate est exploitable (HTTP 200, dix résultats). Elle renvoie des guides ou des offres généralistes d’automatisation de cabinet : Just Use AI, iamin, Queoval, AzenFlow, Network Conseil, Factory 456, Envision IA, notamment. Les extraits ne présentent pas une offre consacrée à l’assemblage des pièces de financement. Cela ne prouve pas qu’aucun concurrent spécialisé n’existe. Les deux recherches complémentaires DuckDuckGo ont reçu un challenge HTTP 202 et n’ont pas été comptées comme résultats vides. Captures : concurrence.json et ddg-0.html/txt ; ddg-1/2 documentent les limites.

Source primaire adjacente ouverte aujourd’hui, MyCompanyFiles, HTTP 200 : https://www.mycompanyfiles.fr/

Extraits exacts : « Collecte et dépôt » ; « Rappels automatiques » ; « Vos clients n’oublient plus de vous envoyer leurs éléments. » ; « Journaux d'événements » ; « Retrouvez l’historique des mouvements des fichiers. »

Portée : la collecte, les rappels et les traces constituent une catégorie adjacente déjà outillée. Cette page ne démontre pas une fonctionnalité spécifique de dossier de financement, ni un contrôle d’éligibilité. Les gains et affirmations de conformité de l’éditeur ne sont pas repris comme faits vérifiés.

Factory 456, HTTP 200, https://www.factory456.com/automatisation-de-la-comptabilite : capture primaire complémentaire conservée pour l’offre généraliste. Aucun gain concurrent ni compatibilité universelle n’est revendiqué.

## Source officielle actualisée et besoin identifié

Bpifrance Création, « Faire son business plan », ouvert aujourd’hui HTTP 200 :
https://bpifrance-creation.fr/encyclopedie/previsions-financieres-business-plan/business-plan/faire-son-business-plan

Extrait exact de la section « 8 - La partie documentaire » : « Cette partie doit faire l'objet d'un dossier à part pour réunir toutes les pièces justificatives et ne pas alourdir le business plan. »

Capture : captures/bpi-business-plan.html et .txt. Portée : justifie la séparation de la partie documentaire et du contenu du business plan ; ne définit ni une liste universelle de pièces, ni l’éligibilité à une aide, ni les obligations d’une banque. La page se présente comme publiée en octobre 2025 ; la date d’ouverture de la source est le 06/10/2026, pas une date de modification inventée.

Deux chemins Bpifrance pressentis ont répondu 404, un domaine de solution de financement n’a pas répondu et une autre piste de prêt a répondu 404. Ces essais ne sont pas des sources probantes ; leurs erreurs sont conservées. Aucun texte sensible n’est rédigé à partir de ces échecs.

## Périmètre utile à rattacher

Déclencheur : le cabinet doit préparer la partie documentaire d’un dossier à remettre à un financeur ou à un organisme d’aide. Entrées envisagées : dossier permanent, demande précise de l’organisme, pièces fournies par le client, liste approuvée et datée. Sortie utile : index des pièces proposées, origine et date de chaque pièce, doublons ou écarts visibles, liste des manquants. C’est un cadrage de tâche, pas une fonction Memlia préconstruite.

| Se prépare seul | Attend une validation | Reste humain |
|---|---|---|
| Inventorier les pièces autorisées, comparer à la liste écrite du cabinet, proposer un assemblage et signaler les manquants | Correspondance d’une pièce ambiguë, version à retenir, liste de pièces et proposition de relance | Éligibilité, choix du financement, hypothèses du prévisionnel, appréciation des garanties, conseil, signature et dépôt |

Arrêt envisagé : liste requise absente ou périmée, pièce illisible, deux versions concurrentes, pièce provenant d’un autre dossier. Ne jamais assimiler la présence d’un fichier à la validité du dossier ou à l’accord du financeur. Ne pas générer une pièce manquante, modifier une saisie du cabinet ou envoyer un dossier sans validation.

Ce cadrage n’est pas un rejeu : aucun cas fictif n’a été exécuté et aucun résultat produit n’est revendiqué. Si la page est rouverte, la recette exigera les cas courant, limite et refus réellement joués avant scellement.

## Architecture, cannibalisation et rattachement

Lecture depuis origin/main 2f4ba16b dans le worktree site/financement-aides-t_bc4590e7. La charte du worktree est v4 (21/09), distincte de la copie principale locale v3 ; aucune correction de doctrine hors périmètre.

La famille src/data/familles.ts, ligne 126, décrit : « Constituer les dossiers de financement et d’aides à partir du dossier permanent. » Le backlog contient quatre angles informationnels (constitution, checklist, relecture avant dépôt, aides et accompagnement), tous avec zéro suggestion historique le 19/09 et des questions en partie génériques. Ils ne sont ni publiés ni qualifiés par ce run. Aucun identifiant contenant financement n’a été trouvé dans le registre de requêtes, le cache d’autocomplétion ou le contrat d’intention parcourus.

/automatisation-cabinet-comptable demeure la cible commerciale canonique. Le prévisionnel porte la production chiffrée et les hypothèses ; l’évaluation porte la valeur et la transmission ; cette famille reste l’assemblage documentaire. Ne pas créer une variante « aides » et une variante « financement », ni détourner une page de prévisionnel pour réserver artificiellement une requête.

Contrôle public aujourd’hui par GET avec Cache-Control: no-cache : service général HTTP 200, candidate HTTP 404. Aucun changement de route, sitemap, canonical, contenu public ou contrat d’intention n’a été effectué.

## Critère de réouverture et transmission

Réouvrir seulement sur un signal précis de délégation de cette tâche : demande cabinet documentée sans PII, requête commerciale distincte exploitable, ou preuve d’usage du suivi de complétude avec une frontière de tâche autonome. Rechercher alors le périmètre des solutions spécialisées de financement, aujourd’hui non couvert exhaustivement. Le format pourrait être une méthode ou checklist sourcée si l’intention reste informationnelle ; aucune nouvelle page n’est commandée ici.

service:preparer, revue métier et service:sceller ne s’appliquent pas à une candidate non retenue. Aucun contenu public réglementé n’est livré. L’enfant dev t_931440d7 est réorienté avant clôture : intégrer uniquement les documents de qualification dans docs/strategy/site-v3/mesures ; ni publication ni création de recette.

Livraison : ce rapport, le JSON de décision et la vérification, avec captures et scripts dans qualification-financement-aides.tar.gz. Le paquet est attaché durablement à la carte ; le développeur ne dépend pas de la survie du scratch.
