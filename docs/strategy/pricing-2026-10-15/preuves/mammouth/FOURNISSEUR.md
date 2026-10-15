# Mammouth : base fournisseur pour la grille des agents Memlia

**Relevé public du 15 octobre 2026.** Recherche Mammouth uniquement, sans clé, achat, requête d’inférence ni contact. Fournisseur retenu par Kevin. Ce document distingue les tarifs observés, les calculs théoriques et les vérifications qui nécessiteront un compte ou un essai réel.

## Ce qui est utilisable dès maintenant

La tarification API permet un chiffrage prévisionnel **en dollars par token**, séparé des abonnements de chat. Le catalogue officiel complet a été récupéré sans authentification : **110 modèles**. Les coûts par travail restent à estimer sur des volumes déclarés ; **aucun coût d’exécution n’a été mesuré**. Une grille interne de prix et de plafonds peut donc être construite maintenant, puis confrontée aux consommations réelles avant toute promesse de marge ou de capacité.

## 1. Chat et API : deux budgets distincts

| Offre chat mensuelle affichée | Prix affiché, TVA incluse | Crédit API inclus chaque mois |
|---|---:|---:|
| Starter | 12 € | 2 $ |
| Standard | 24 € | 4 $ |
| Expert | 72 € | 10 $ |

La page tarifaire affiche des offres d’équipe par utilisateur et un choix annuel. Les trois montants ci-dessus correspondent au **mensuel observé**, pas au devis entreprise. [Tarifs Mammouth](https://mammouth.ai/pricing).

L’API fonctionne également avec des crédits achetés **sans abonnement**. L’abonnement Expert n’équivaut donc pas à de l’API illimitée et n’est pas requis pour le moteur Memlia. La documentation recommande elle-même un petit abonnement et des crédits supplémentaires pour les usages intensifs de développement. [Démarrage API](https://info.mammouth.ai/fr/docs/api-quick-start/).

Non déterminés publiquement dans les pages consultées : minimum de recharge, expiration/report des crédits achetés et inclus, conversion dollar/euro au paiement, TVA des recharges, éventuels frais de paiement, recharge automatique et plafonds administrables par clé. Ne pas les remplacer par des suppositions dans le calcul de marge.

## 2. Prix publics exploitables et unités

Le [Model Explorer officiel](https://model-explorer.mammouth.ai/) lit directement [`https://api.mammouth.ai/public/models`](https://api.mammouth.ai/public/models). Son code confirme que les champs de coût sont des **dollars par token** ; multiplication par un million pour les colonnes ci-dessous. L’export brut complet est [`archives/public-models.json.gz`](./archives/public-models.json.gz) ; la version normalisée est [`tarifs-modeles.json`](./tarifs-modeles.json).

| Identifiant API exact | Entrée $/million | Sortie $/million | Limite d’entrée annoncée | Limite de sortie annoncée |
|---|---:|---:|---:|---:|
| `gpt-6-luna` | 0,10 | 0,50 | 1 050 000 | 128 000 |
| `glm-5.3-flash` | 0,15 | 0,50 | 1 048 576 | 128 000 |
| `minimax-m3` | 0,30 | 1,20 | 512 000 | 512 000 |
| `gpt-6.1-sol` | 2,00 | 10,00 | 1 050 000 | 128 000 |
| `claude-sonnet-5-5` | 2,00 | 10,00 | 1 000 000 | 128 000 |
| `gemini-3.1-pro-preview` | 2,00 | 12,00 | 1 048 576 | 65 536 |
| `claude-opus-5-5` | 4,00 | 20,00 | 1 000 000 | 128 000 |
| `gpt-6-astra` | 10,00 | 50,00 | 1 050 000 | 128 000 |
| `text-embedding-3-small` | 0,02 | 0 | 8 191 | Non renseignée |
| `text-embedding-3-large` | 0,13 | 0 | 8 191 | Non renseignée |

Ce sont des valeurs de catalogue, **pas des capacités validées par un test Memlia**. Deux limites d’entrée et de sortie ne doivent pas être additionnées pour annoncer une fenêtre effective sans essai. Le catalogue emploie `owned_by: openai` pour des familles de marques différentes : ce champ ne suffit pas à identifier le fournisseur d’exécution ou la région de traitement.

La documentation présente ses prix comme des plafonds, le prix réel pouvant diminuer selon le fournisseur disponible. Elle renvoie à l’explorateur pour la liste à jour ; les valeurs capturées ci-dessus concordent pour ces modèles. Un relevé est un instantané, pas un gel contractuel des tarifs.

**Alias à surveiller :** `mammouth-recommended` pointe actuellement vers GLM 5.3 Flash avec Minimax M3 en repli ; le choix peut changer. Son prix correspond au modèle sous-jacent. Pour une borne reproductible, figer un identifiant précis ou budgéter explicitement les replis permis ; ne pas appliquer mécaniquement 0,15/0,50 à tous les appels de cet alias.

## 3. Ce que les prix tokens couvrent — et ce qui reste inconnu

| Composante | Preuve disponible | Règle pour notre chiffrage prévisionnel |
|---|---|---|
| Entrée et sortie texte | Deux prix publics par modèle | Additionner les volumes de **tous** les appels, y compris historiques, instructions et résultats d’outils renvoyés au modèle |
| Raisonnement / thinking | Paramètres pris en charge selon modèle ; détail de facturation non publié | Ne pas limiter la sortie facturée au texte visible ; prévoir une enveloppe de sortie totale, à vérifier ensuite |
| Cache de prompts | Guide Cline : cache non pris en charge ; aucun tarif cache dans le catalogue | Aucun rabais de cache dans la base de coût ; confirmer le périmètre exact avant de compter une réduction |
| Appels de fonctions / outils | Fonctionnalité annoncée ; aucun barème distinct trouvé | Distinguer tokens de dialogue et coût d’exécution de l’outil ; ne pas promettre recherche web/OCR payants inclus sans enveloppe |
| Sonar / recherche approfondie | Prix entrée/sortie présents | Les deux colonnes ne démontrent pas l’absence de frais de recherche ou de requête ; conserver une réserve non chiffrée tant que non documentée |
| Images, OCR, fichiers | Disponibilité de certaines entrées/modèles ; schéma public réduit | Ne pas convertir un nombre de pages ou d’images en tokens sans mesure propre au chemin retenu |
| Erreurs, délais, réponse interrompue | Codes 400/401/429/500/503 documentés ; règle de débit absente | Ne pas considérer les échecs ou annulations comme gratuits ; borner les tentatives et rapprocher les débits après essai |
| Reprises / relances | Aucun crédit automatique établi | Réserver la capacité de reprise au niveau du travail ; ne pas facturer au cabinet chaque tentative technique interne |

Les recommandations de la dernière colonne sont des **conventions de gestion Memlia**, pas des engagements Mammouth. Références : [API](https://info.mammouth.ai/fr/docs/api-quick-start/), [guide Cline](https://info.mammouth.ai/fr/docs/cline/), [catalogue public](https://api.mammouth.ai/public/models).

## 4. Exemples de calcul, pas des mesures

Pour un appel texte, hors frais non documentés :

`coût USD = entrée_facturée × prix_entrée/token + sortie_facturée × prix_sortie/token`

| Budget hypothétique pour un travail entier | Luna | GLM Flash | Sol / Sonnet | Opus | Astra |
|---|---:|---:|---:|---:|---:|
| Total 10 000 tokens entrée + 2 000 sortie | 0,0020 $ | 0,0025 $ | 0,0400 $ | 0,0800 $ | 0,2000 $ |
| Total 100 000 entrée + 10 000 sortie | 0,0150 $ | 0,0200 $ | 0,3000 $ | 0,6000 $ | 1,5000 $ |

Les volumes sont inventés **pour illustrer l’arithmétique**, pas pour décrire un email, un dossier, une paie ou une revue. Un travail à plusieurs appels doit sommer toutes les entrées et sorties consommées, plutôt que multiplier seulement la taille du document initial. Les appels de reprise s’ajoutent à l’enveloppe fournisseur. Les mêmes budgets de tokens ne garantissent pas la même qualité entre modèles.

Ces montants ne comprennent ni orchestration, hébergement, extraction, stockage, outils externes, contrôle ou support humain, ni adaptation et recette initiales. Le cours de conversion et les taxes doivent être traités séparément. **Ils ne suffisent pas à déduire le prix de vente d’un travail.**

## 5. Mesure future : moyens documentés et limites

Mammouth documente un `usage` avec `prompt_tokens`, `completion_tokens` et `total_tokens`, des journaux d’usage/coût dans les paramètres et un GET authentifié `/key/info` pour le crédit consommé par une clé. Les [notes du 1er mai 2026](https://info.mammouth.ai/fr/docs/release-notes/) annoncent plusieurs clés et des logs filtrables par clé. **Aucun de ces dispositifs authentifiés n’a été appelé ici.** Le schéma exact des débits, sa granularité, sa latence et son export restent à observer.

Pour confronter les prix internes au réel, la future recette devrait enregistrer, par tentative : travail et version, modèle demandé et retourné, identifiant de réponse, compteurs facturés, statut et raison d’arrêt, outil sollicité, durée, coût journalisé puis rapprochement des débits. Les données de facturation doivent éviter de recopier le contenu confidentiel des dossiers. Une clé dédiée au scénario facilite l’attribution ; des clés multiples ne démontrent pas une autorisation de revente.

Les mesures attendues sont la distribution des coûts par travail réussi et arrêté, le taux et le coût des reprises, le temps humain résiduel et le coût total de maintien. Ce sont des mesures à venir ; aucun P50/P95 ni coût moyen « mesuré » ne peut être annoncé aujourd’hui.

## 6. Limites de débit et plafonds Memlia

Les [quotas de session de trois heures](https://info.mammouth.ai/fr/docs/quota-policy/) concernent l’offre chat et ses changements de modèles. Ils ne constituent pas des limites API publiées de requêtes ou tokens par minute. Le catalogue fournit des limites par modèle ; la documentation API annonce un 429 mais **aucun chiffre RPM, TPM ou concurrence** dans les pages consultées.

Conventions de conception à retenir pour la grille : plafond de documents/pages/longueur pour chaque travail, enveloppe de tokens et de tentatives, nombre maximal d’outils, budget de dépense, délais et file d’attente. Au dépassement, arrêter le travail et présenter une extension chiffrée ; ne pas augmenter le budget sans accord. Ces plafonds commerciaux sont les nôtres, indépendants du quota Mammouth, et devront être testés techniquement.

## 7. Usage pour les clients Memlia : qualification contractuelle à fermer

Les [CGU du 10 septembre 2026](https://info.mammouth.ai/fr/docs/terms-of-service/) couvrent explicitement plateforme et API (§1). Elles accordent une licence pour les besoins internes (§4), interdisent revente/sous-licence et création d’un service concurrent (§5), et l’AUP réserve la mise à disposition à des tiers à une autorisation expresse. Le bon de commande est prioritaire dans l’ordre contractuel.

Cela ne démontre **ni une autorisation générale d’opérer pour des clients, ni que tout service Memlia intégrant l’API serait interdit**. Les textes publics ne qualifient pas précisément le service envisagé. À éclaircir dans le contrat applicable : traitement opéré par Memlia pour ses cabinets, accès éventuel des clients, compte et clés, plusieurs cabinets, séparation des données et droits sur les résultats. Aucune autorisation n’a été demandée ou obtenue dans cette recherche.

Le DPA public présente le Client comme responsable de traitement ; la chaîne cabinet → Memlia → Mammouth doit correspondre au montage réel. La documentation fournisseurs évoque jusqu’à trente jours de conservation pour les abus ; l’annexe cite plusieurs lieux UE/États-Unis. L’accroche générale de l’accueil sur l’absence de rétention ne suffit donc pas à promettre un zéro rétention ou un traitement exclusivement français. [Confidentialité fournisseurs, 28 septembre 2026](https://info.mammouth.ai/fr/docs/privacy-with-model-providers/), [politique de confidentialité, 20 septembre 2026](https://info.mammouth.ai/fr/docs/privacy-policy/).

Ce sont des points de qualification contractuelle et de traitement des données, sans conclusion juridique définitive. La [politique de remboursement](https://info.mammouth.ai/fr/docs/refund-policy/) traite les achats et le début du service ; elle ne précise pas le débit ou le remboursement de chaque requête API échouée.

## 8. État des dépendances

| Sujet | État | Effet concret |
|---|---|---|
| Étude et grille interne fondées sur prix publics | **Possible maintenant** | Tables, variantes, budgets et simulations peuvent être livrés |
| Coûts réellement mesurés par travail | **Non disponibles : aucune clé** | Pas de facture, de benchmark ni de percentile réel à produire ; ne pas les inventer |
| RPM/TPM, erreurs, reasoning, outils et paiement API | **Non précisés publiquement** | Bornes conservatrices et recette future nécessaires pour confirmer les coûts complets |
| Droits d’usage clients et chaîne de traitement | **À qualifier avant une exploitation commerciale réelle** | Vérifier les conditions/accord applicables ; le fournisseur n’est pas déclaré « interdit » sur la seule lecture publique |
| Traitement d’un dossier réel ou déploiement produit | **Hors de ce chantier** | Aucun traitement lancé ; site et grille prévisionnelle restent réalisables |

## Archives et intégrité

[`manifest.json`](./manifest.json) contient URL, horodatage UTC, statut, en-têtes, taille et SHA-256 des corps originaux et compressés. Quinze sources primaires ont été archivées en gzip : HTML plus texte nettoyé, et JSON brut complet du catalogue. Le script de l’explorateur qui établit le lien officiel vers `/public/models` est préservé dans son HTML.

Les premières lectures Python ont rencontré un problème de chaîne TLS locale ; les captures finales ont été obtenues avec `curl`, **vérification TLS maintenue**. Le manifeste d’échec est conservé à part. Aucune authentification, aucun achat et aucune génération payante n’ont été nécessaires.
