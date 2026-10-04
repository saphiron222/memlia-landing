URL obtenue : https://learn.microsoft.com/fr-fr/azure/ai-services/document-intelligence/overview?view=doc-intel-4.0.0
Consultée le 2026-10-04.

# Qu’est-ce que Azure Document Intelligence dans Les outils Foundry ?

**Ce contenu s’applique à :**![red-checkmark](media/retire-icon.png?view=doc-intel-4.0.0)**v2.1** | **Dernière version :**![blue-checkmark](media/blue-yes-icon.png?view=doc-intel-4.0.0)[**v4.0 (GA)**](?view=doc-intel-4.0.0&preserve-view=tru)

Important

- **L’API REST Document Intelligence v2.1** atteint la fin du support le **15 septembre 2027**.
- **L’API REST Document Intelligence 2022-08-31 v3.0** atteint la fin du support le **30 mars 2029**.
- Pour éviter toute interruption de production, migrez maintenant vers **Azure Document Intelligence 2024-11-30 v4.0**. Pour plus d’informations, consultez [**le guide de migration Document Intelligence**](versioning/migration-guide-overview?view=doc-intel-4.0.0).

Azure Document Intelligence dans Foundry Tools est un service cloud [Foundry Tools](../?view=doc-intel-4.0.0) que vous pouvez utiliser pour créer des solutions de traitement de documents intelligentes. Des quantités massives de données, couvrant différents types de données, sont stockées dans des formulaires et des documents. Vous pouvez utiliser Azure Document Intelligence pour gérer efficacement la vitesse à laquelle les données sont collectées et traitées. Azure Document Intelligence est essentielle à l’amélioration des opérations, aux décisions éclairées basées sur les données et à l’innovation éclairée. Pour plus d’informations sur l’accès à la région, consultez [Disponibilité des produits par région](https://azure.microsoft.com/explore/global-infrastructure/products-by-region/table).

| ✔️ Modèles d’analyse de documents | ✔️ Modèles prédéfinis | ✔️ Modèles personnalisés |

## Modèles d’analyse de documents

Les modèles d’analyse de documents (extraction générale) permettent l’extraction de texte à partir de formulaires et de documents et retournent du contenu structuré prêt pour l’entreprise pour l’action, l’utilisation ou le développement de votre organisation.

Lire | Extrayez du texte imprimé et manuscrit.

Mise en page | Extraire le texte, les tableaux et la structure du document.

Lire | Extrayez du texte imprimé
et manuscrit.

Mise en page | Extraire le texte, les tableaux
et la structure du document.

## Modèles prédéfinis

Vous pouvez utiliser des modèles prédéfinis pour ajouter un traitement intelligent des documents à vos applications et flux sans avoir à entraîner et à créer vos propres modèles.

## Modèles personnalisés

Les modèles personnalisés sont entraînés à l’aide de vos jeux de données étiquetés pour extraire des données distinctes à partir de formulaires et de documents spécifiques à vos cas d’usage. Vous pouvez combiner des modèles personnalisés autonomes pour créer des modèles composés.

### Modèles d’extraction de champs de document

✔️ Les modèles d’extraction de champs de document sont formés pour extraire des champs étiquetés à partir de documents.

### Modèles de classification personnalisés

✔️ Les classifieurs personnalisés identifient les types de documents avant d’appeler un modèle d’extraction.

## Fonctionnalités de module complémentaire

Document Intelligence prend en charge les fonctionnalités facultatives que vous pouvez activer ou désactiver en fonction du scénario d’extraction de document :

## Fonctionnalités d’analyse

Fonctionnalités d’analyse
| ID de modèle | Extraction de contenu | Champs de requête | Paragraphes | Rôles de paragraphe | Marques de sélection | Tables | Paires clé/valeur | Langues | Codes-barres | Analyse de document | Formules* | Police de style* | Haute résolution* | PDF pouvant faire l’objet d’une recherche |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `prebuilt-read` | ✓ | | ✓ | | | | | O | O | | O | O | O | O |
| `prebuilt-layout` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | O | O | O | | O | O | O | |
| `prebuilt-contract` | ✓ | ✓ | ✓ | ✓ | ✓ | | | O | O | ✓ | O | O | | |
| `prebuilt-healthInsuranceCard.us` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-idDocument` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-invoice` | ✓ | ✓ | | | ✓ | ✓ | O | O | O | ✓ | O | O | O | |
| `prebuilt-receipt` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-marriageCertificate.us` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-creditCard` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-check.us` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-payStub.us` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-bankStatement` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-mortgage.us.1003` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-mortgage.us.1004` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-mortgage.us.1005` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-mortgage.us.1008` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-mortgage.us.closingDisclosure` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.w2` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.w4` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1040` (divers) | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1095A` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1095C` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1098` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1098E` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1098T` | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1099` (divers) | ✓ | ✓ | | | ✓ | | | O | O | ✓ | O | O | O | |
| `prebuilt-tax.us.1099SSA` | ✓ | ✓ | | | | | | O | O | ✓ | O | O | O | |
| `{ customModelName }` | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | | O | O | ✓ | O | O | O | |
✓ - Activé
 O - Facultatif
 * - Les fonctionnalités Premium entraînent des coûts supplémentaires

## Modèles et options de développement

Utilisez Document Intelligence pour automatiser le traitement des documents dans les applications et les flux de travail, améliorer les stratégies pilotées par les données et enrichir les fonctionnalités de recherche de documents. Utilisez les liens du tableau pour en savoir plus sur chaque modèle et parcourir les options de développement.

### Lire

![Capture d’écran montrant l’analyse du modèle en lecture à l’aide de Document Intelligence Studio.](media/overview/analyze-read.png?view=doc-intel-4.0.0)

| ID de modèle | Description | Cas d'utilisation de l'automatisation | Options de développement |
|---|---|---|---|
| [lecture préconfigurée](prebuilt/read?view=doc-intel-4.0.0) | ● Extraire du texte de documents. ● [Extraire des données](prebuilt/read?view=doc-intel-4.0.0#data-extraction). | ● Numérisation d’un document ● Conformité et audit ● Traitement des notes manuscrites avant la traduction | ● [Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio/read) ● [REST API](how-to-guides/use-sdk-rest-api?view=doc-intel-4.0.0&preserve-view=true&pivots=programming-language-rest-api) ● [C# SDK](how-to-guides/use-sdk-rest-api?view=doc-intel-4.0.0&preserve-view=true&pivots=programming-language-csharp) ● [Python SDK](how-to-guides/use-sdk-rest-api?view=doc-intel-4.0.0&preserve-view=true&pivots=programming-language-python) ● [Java SDK](how-to-guides/use-sdk-rest-api?view=doc-intel-4.0.0&preserve-view=true&pivots=programming-language-java) ● [JavaScript](how-to-guides/use-sdk-rest-api?view=doc-intel-4.0.0&preserve-view=true&pivots=programming-language-javascript) |

### Mise en page

![Capture d’écran montrant l’analyse du modèle de disposition à l’aide de Document Intelligence Studio.](media/overview/analyze-layout.png?view=doc-intel-4.0.0)

| ID de modèle | Description | Cas d'utilisation de l'automatisation | Options de développement |
|---|---|---|---|
| [disposition prédéfinie](prebuilt/layout?view=doc-intel-4.0.0) | ● Extraire des informations de texte et de disposition à partir de documents. ● [Extraire des données](prebuilt/layout?view=doc-intel-4.0.0#data-extraction). | ● Indexation et récupération document par structure ● Analyse des rapports financiers et médicaux | ● [Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio/layout) ● [REST API](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true) ● [C# SDK](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#layout-model) ● [Python SDK](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#layout-model) ● [Java SDK](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#layout-model) ● [JavaScript](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#layout-model) |

### Document de référence général (devenu obsolète dans la préversion du 31/10/2023)

![Capture d’écran montrant l’analyse générale du modèle de document à l’aide de Document Intelligence Studio.](media/overview/analyze-general-document.png?view=doc-intel-4.0.0)

| ID de modèle | Description | Cas d'utilisation de l'automatisation | Options de développement |
|---|---|---|---|
| [document préconstruit](prebuilt/general-document?view=doc-intel-4.0.0) | ● Extraire des paires texte, disposition et clé/valeur à partir de documents. ● [Extraire des données et des champs](prebuilt/general-document?view=doc-intel-4.0.0#data-extraction). | ● Extraction de paires clé/valeur ● Traitement de formulaire ● Collecte et analyse des données d’enquête | ● [API REST](https://formrecognizer.appliedai.azure.com/studio/document) ● |

### Facture

![Capture d’écran montrant l’analyse du modèle de facture à l’aide de Document Intelligence Studio.](media/overview/analyze-invoice.png?view=doc-intel-4.0.0)

| ID de modèle | Description | Cas d'utilisation de l'automatisation | Options de développement |
|---|---|---|---|
| [préconçu-facture](prebuilt/invoice?view=doc-intel-4.0.0) | ● Extrayez les informations clés des factures. ● [Extraire des données et des champs](prebuilt/invoice?view=doc-intel-4.0.0#field-extraction). | ● Traitement des comptes à payer ● Enregistrement et déclaration fiscaux automatisés | ● [Document Intelligence Studio](https://documentintelligence.ai.azure.com/studio/prebuilt?formCategory=invoice&formType=invoice) ● [REST API](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true&pivots=programming-language-rest-api#analyze-document-post-request) ● [C# SDK](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#prebuilt-model) ● [Python SDK](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#prebuilt-model) ● [Java SDK](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#prebuilt-model) ● [JavaScript](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true#prebuilt-model) |

### Reçu

![Capture d’écran montrant l’analyse du modèle de reçu à l’aide de Document Intelligence Studio.](media/overview/analyze-receipt.png?view=doc-intel-4.0.0)

| ID de modèle | Description | Cas d'utilisation de l'automatisation | Options de développement |
|---|---|---|---|

[... middle omitted — see footer ...]

| Modèles personnalisés | ● [Modèle personnalisé](train/custom-model?view=doc-intel-4.0.0) ● [Modèle composé](model-overview?view=doc-intel-2.1.0&preserve-view=true) |

**Ce contenu s’applique à :**![red-checkmark](media/retire-icon.png?view=doc-intel-4.0.0)**v2.1** | **Dernière version :**![blue-checkmark](media/blue-yes-icon.png?view=doc-intel-4.0.0)[**v4.0 (GA)**](?view=doc-intel-4.0.0&preserve-view=tru)

## Modèles Document Intelligence et options de développement

> - Studio v3.0 prend en charge tout modèle entraîné avec des données étiquetées v2.1.
> - Pour plus d’informations sur la migration de v2.1 vers v3.0, consultez le guide de migration des API.

Pour en savoir plus sur chaque modèle et parcourir les références d’API, utilisez les liens du tableau suivant.

| Modèle | Description | Options de développement |
|---|---|---|
| [Analyse de mise en page](prebuilt/layout?view=doc-intel-2.1.0&preserve-view=true) | Extraction et analyse de texte, de marques de sélection, de tableaux et de coordonnées de boîtes englobantes, à partir de formulaires et de documents | ● Outil d'étiquetage Document Intelligence ● REST API ● SDK de bibliothèque cliente ● Conteneur Docker Document Intelligence |
| [Modèle personnalisé](train/custom-model?view=doc-intel-2.1.0&preserve-view=true) | Extraction et analyse des données à partir de formulaires et de documents spécifiques aux données métiers et aux cas d’usage distincts | ● Outil d’étiquetage Document Intelligence ● Exemple d’outil d’étiquetage ● Conteneur Docker Document Intelligence |
| [Modèle de facture](prebuilt/invoice?view=doc-intel-2.1.0&preserve-view=true) | Traitement et extraction automatisés des informations clés à partir des factures de vente | ● Outil d'étiquetage Document Intelligence ● REST API ● SDK de bibliothèque cliente ● Conteneur Docker Document Intelligence |
| [Modèle de reçu](prebuilt/receipt?view=doc-intel-2.1.0&preserve-view=true) | Traitement automatisé des données et extraction d’informations clés à partir des reçus de vente. | ● Outil d'étiquetage Document Intelligence ● REST API ● SDK de bibliothèque cliente ● Conteneur Docker Document Intelligence |
| [Modèle de document d’identité (ID)](prebuilt/id-document?view=doc-intel-2.1.0&preserve-view=true) | Traitement et extraction automatisés des informations clés à partir des permis de conduire américains et des passeports internationaux | ● Outil d’étiquetage Document Intelligence ● API REST ● Kit de développement logiciel (SDK) de bibliothèque cliente ● Conteneur Docker Document Intelligence |
| [Business card model](concept-business-card?view=doc-intel-2.1.0&preserve-view=true) | Traitement et extraction automatisés des informations clés à partir de cartes de visite | ● Outil d'étiquetage Document Intelligence ● REST API ● SDK de bibliothèque cliente ● Conteneur Docker Document Intelligence |

## Confidentialité et sécurité des données

Comme avec tous les outils Foundry, les développeurs qui utilisent Document Intelligence doivent connaître les stratégies d’Microsoft sur les données client. Pour plus d’informations, consultez [Données, confidentialité et sécurité pour Document Intelligence](/fr-fr/azure/ai-foundry/responsible-ai/document-intelligence/data-privacy-security).

- [Choisissez un modèle Document Intelligence](concept/choose-model-feature?view=doc-intel-4.0.0).
- Traitez vos propres formulaires et documents avec [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).
- Terminez un [guide de démarrage rapide Document Intelligence](quickstarts/get-started-sdks-rest-api?view=doc-intel-4.0.0&preserve-view=true), puis créez une application de traitement de documents dans le langage de développement de votre choix.

- Traitez vos propres formulaires et documents avec l’outil d’étiquetage de Document Intellig

..._This content has been truncated to stay below 50000 characters_...

──────── [TRUNCATED] ────────
Showing 11,222 chars (head) + 3,902 chars (tail) of 50,072 total clean characters.
Full text saved to: /Users/kevinkitanga/.hermes/profiles/dev/cache/web/learn.microsoft.com-4fa91ab8b1.md
To read the omitted middle: read_file path="/Users/kevinkitanga/.hermes/profiles/dev/cache/web/learn.microsoft.com-4fa91ab8b1.md" offset=129 limit=200  (the file is the complete page; raise/lower offset to page through it).
─────────────────────────────