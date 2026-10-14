# Page des outils : connecteurs par domaine (phase 2, recherche du 14-15/10/2026)

> Recherche en lecture seule pour `/integrations` devenue page des outils (cadrage hub §12, D10).
> Aucune écriture dans un dépôt. Les noms internes des automatisations n'apparaissent que dans
> la colonne « interne » du §2 ; aucune ligne publique proposée ne les porte.
> Lectures web : 14/10/2026 sauf mention. Sources déjà datées réutilisées telles quelles :
> `src/data/integrations.ts` (04/10), `guides.generated.json` (06-07/10),
> `src/data/couverture-logiciels.mjs` (06/10, 08/10) et le coffre
> `10-memlia/chantiers/cac-site-niveau-superieur/sorties/couverture-logiciels-2026-10-06/` (06/10).

## 0. À faire trancher par Kevin avant la phase 3

| # | Point | Ce qui a été mesuré | Proposition |
|---|---|---|---|
| K1 | **« Éprouvé » repose sur des recettes plus faibles que ne le disent `~/dev/CLAUDE.md` et la consigne** | Production sociale : en usage chez le cabinet depuis le 04/08 et recette **sur jeu fictif** dans Excel passée le 05/08 (`447466f`, `409f735`, `def07c8`). La recette sur une copie du vrai classeur (`livraison/RECETTE.md` §2, verdict = deux mois validés) n'a **jamais** été faite, et aucune case n'est cochée. La fiche du coffre (19/09) signale déjà que « recette passée le 26/07 » est inexact : le 26/07 est la date d'une leçon `.gitignore`. Synthèse de rémunération : recette jouée par Kevin le 20/08, mais l'installeur livré ce jour-là (HKCU) **ne charge jamais**. Le défaut est corrigé le 06/09 (HKLM, passe écran au banc) ; la passe sur le poste de l'expert-comptable n'est pas prouvée. | Garder **Éprouvé** pour Excel et Silae avec la définition « livrée, en service ou recettée sur jeu fictif dans un vrai Excel ». Sinon, aucun outil n'est Éprouvé, et Silae et Excel passent en **Par export** (preuves publiques au §2). |
| K2 | **ACD, fichier de ré-import des actes** | Le fichier généré est identique au fichier fait main (294 lignes, golden). Le **ré-import dans ACD** n'a jamais été vérifié (RECETTE §2, case « accepté tel quel »). | **Sur demande** par défaut. Il passe Éprouvé si Kevin confirme qu'un fichier généré a été ré-importé par le cabinet. |
| K3 | **Facturation électronique** | La liste officielle est sur impots.gouv.fr, **en maintenance le 14/10 et le 15/10** (relu trois fois). `couverture-logiciels.mjs` qualifie déjà sept éditeurs de « plateforme agréée » sur la foi de leurs propres pages (06/10). | Aucune plateforme nommée sur la page des outils (§3). Revérifier les sept libellés contre la liste dès la fin de la maintenance. |
| K4 | **RévisAudit (Gest On Line)** | `revisaudit[.]fr` est proscrit. Le dépôt du site le lie déjà **dans ses docs** : `docs/strategy/site-v3/cac/TERRAIN-CAC.md:204`, `cac/terrain-verbatims.json:35`, et un guide différé `/integrations/dossier-travail-revisaudit` dans `cac/page-intent-plan.json:40`. Rien dans `src/`, `scripts/` ni `tests/` ne lit ces fichiers (grep du 14/10). | Texte seul ou absent (§5). Refuser le guide différé et porter la garde `domaine-proscrit` dans le site. |
| K5 | **Yousign s'appelle Youtrust** | `developers.yousign.com` redirige (301) vers `developers.youtrust.com`. Selon la presse, la marque change en 2026 et l'application migre jusqu'en 2027. | Écrire « Youtrust (anciennement Yousign) ». |
| K6 | **Sage 100 en « Sur demande »** malgré six guides | Les fiches Sage citées par les guides décrivent des gestes dans le logiciel, pas un format d'échange. L'export FEC n'est décrit que sur le forum Sage, par un utilisateur et non par Sage. | Appliquer la règle fermée : Sur demande. Les guides restent ses pages de détail. |
| K7 | Mention de marques (§4) et page de détail Excel (§6) | — | Valider le texte et la page conditionnelle. |

## 1. Règles appliquées

- **Éprouvé** : une automatisation Memlia livrée et recettée touche l'outil (voir K1 pour la nuance).
- **Par export** : l'éditeur ou l'organisme public documente un format d'export ou d'import, ou une API, à une URL officielle lue et datée, mais aucune automatisation recettée ne le touche encore.
- **Sur demande** : outil courant en cabinet, accès et formats à vérifier avant devis (charte §4).
- La ligne « ce que nous reprenons » ne vise jamais un geste que l'outil fait déjà (charte §6, règle du 06/10). Elle prend ce qui reste.
- Interdit sur la page : un total, « compatible avec tous vos logiciels », « connecteur officiel », « intégration native », « partenaire », un nombre de connecteurs, un logo sans droit écrit (§4).

## 2. Les outils par domaine

### 2.0 Livraisons internes : la seule colonne où les noms internes s'écrivent

| Outil | Livraison interne (dépôt, état) | Lit | Écrit | Ne touche jamais | Ligne publique proposée |
|---|---|---|---|---|---|
| Microsoft Excel | `produit/memlia-suivi-social` (panneau Office.js), en usage chez le cabinet depuis le 04/08/2026, recette sur jeu fictif dans Excel le 05/08 ; `produit/memlia-synthese-salaires` (add-in COM/.NET), recette du 20/08, installeur corrigé le 06/09 (K1) | Le classeur existant : blocs mensuels repérés par leur ligne d'en-tête, Config, Règles ; la zone de saisie | Les quantités du mois (bulletins, DSN, actes), la feuille d'anomalies, le journal avant→après, une feuille possédée régénérée | Les formules en euros, toute cellule à formule, une valeur divergente (signalée, jamais écrasée), la zone de saisie, le brouillon | « Nous lisons les exports que vous déposez et écrivons dans votre classeur ce que la règle prévoit. Vos formules et vos saisies ne sont jamais réécrites ; chaque écriture est tracée. » |
| Silae, mySilae | Les deux dépôts ci-dessus : l'export CSV mensuel, dont le mois détecté est confirmable, et la liste des salariés collée dans le classeur, dont seul le matricule est lu | L'export de paie du mois, la liste des salariés | Rien dans Silae | Silae lui-même, le dépôt de DSN, la colonne NIR (bannie du lecteur par construction) | « Nous lisons l'export de paie du mois et la liste des salariés que votre collaborateur dépose. Rien n'est écrit dans Silae, aucune DSN n'est déposée. » |
| ACD (gestion interne) | `memlia-suivi-social` : fichier `.xls` de ré-import des actes (feuille `ExportACD-AAAAMM`), identique au fichier fait main sur les vrais fichiers (294 lignes) ; ré-import dans ACD non vérifié (K2) | Le dernier export de paie importé | Un fichier à côté, jamais dans ACD | ACD | Si K2 : « Nous préparons le fichier de ré-import des actes du mois, au format que votre cabinet importe déjà. L'import reste votre geste. » |
| Planity, PrestaShop, MEG (RCA) | `produit/memlia-flux-compta` (app de bureau), construite le 04/08 ; le CSV de caisse produit depuis l'export réel de juin est identique au CSV importé par le cabinet, au plan de comptes près ; **recette non faite** | Les exports de caisse, l'export comptable de la boutique, l'export des entreprises | Des fichiers d'import et des colonnes possédées d'un suivi | Les fichiers d'origine (rangés, jamais supprimés) | Aucune avant la recette. Ces trois outils restent **Sur demande** jusque-là. |

### 2.1 Production comptable

| Outil (éditeur) | Statut | Preuve | Ce que nous reprenons | Fiches |
|---|---|---|---|---|
| Cegid Loop (Cegid) | Par export | [Cegid Developers, import des écritures en JSON](https://inte-developers.cegid.com/docreference/BusinessUnits/Loop-Api-Management-Docs/EcritureComptableImportJson.html), lu le 04/10 et le 14/10. ⚠ Le sous-domaine `inte-` ressemble à un environnement d'intégration ; trouver l'URL de production | Les lignes que Loop ne reconnaît pas, préparées dans son format d'import, validées avant intégration | comptabilite |
| Cegid Quadra Plus (Cegid) | Sur demande | [Shine, Cegid Quadra Plus](https://www.shine.fr/experts-comptables/produits/cegid-quadra-plus), lu le 06/10 (coffre, CG5). La fiche du format ASCII qui circule n'est hébergée que par un tiers | Les exceptions de saisie et de lettrage que Quadra laisse à la main | comptabilite |
| Sage 100 Comptabilité (Sage) | Sur demande (K6) | Fiches fr-kb.sage.com citées par les guides (lettrage, rapprochement, saisie par lot, clôture), lues le 04/10 ; aucune fiche de format d'échange | Les paires de lettrage et de rapprochement, proposées sans changer le statut dans Sage (guides existants) | comptabilite |
| Sage Génération Experts (Sage) | Sur demande | Pages sage.com en 403 le 06/10 (coffre, SG1), vues en extrait seulement | À cadrer selon l'édition du cabinet | comptabilite |
| ACD Comptabilité Expert, i-Suite Expert (ACD Groupe) | Sur demande | [acd-groupe.fr](https://www.acd-groupe.fr/), lu le 06/10 ; [guide de connexion API](https://www.acd-groupe.fr/wp-content/uploads/2026/04/Guide-connexion-api-juria-acd.pdf) d'avril 2026, PDF illisible en texte, connu par extrait seulement | Les gestes entre ACD et les fichiers du cabinet, après lecture de l'accès API | comptabilite |
| EBP Comptabilité (EBP, groupe Cegid) | Par export | [EBP, générer un FEC](https://support.ebp.com/hc/fr/articles/360009858758), lu le 07/10 (guide `export-fec-ebp`) ; 403 le 14/10 | La demande d'export FEC préparée et contrôlée (destinataire, période, régime). L'export se fait dans EBP | comptabilite, missions-audit |
| Pennylane (Pennylane) | Par export | [Pennylane API, factures fournisseurs](https://pennylane.readme.io/docs/supplier-invoicing), Company API v2 et OAuth 2.0, mise à jour du 29/09/2026, lue le 14/10 | Les pièces qu'il ne lit pas ou n'impute pas, les doublons sans numéro, chacun avec son motif | comptabilite |
| MyU, ex-MyUnisoft (MyUnisoft) | Sur demande | [Aide MyU, plateforme agréée](https://support.myunisoft.fr/facture-%C3%A9lectronique-et-pa-myunisoft), lu le 06/10 ; aucune documentation d'API publique trouvée | À cadrer | comptabilite |
| Tiime (Tiime) | Sur demande | [Tiime, offre cabinets](https://www.tiime.fr/ec/), lu le 06/10 | Les transactions qu'il ne rapproche pas | comptabilite |
| Inqom (groupe Visma) | Sur demande | [Aide Inqom](https://help.inqom.com/fr/suivre-les-inscriptions-%C3%A0-la-plateforme-agr%C3%A9%C3%A9e), lu le 06/10 | À cadrer | comptabilite |
| fulll (fulll) | Sur demande | [Aide fulll, réconciliation](https://aide.fulll.io/fr/articles/540478-comprendre-la-reconciliation), lu le 06/10 | Les mouvements hors de ses règles de réconciliation | comptabilite |
| AMICOMPTA, ISACOMPTA (Agiris, groupe Isagri) | Sur demande | [Agiris, AMICOMPTA](https://www.agiris.fr/logiciel/amicompta), lu le 06/10 | Les pièces atypiques | comptabilite |
| Dext (Dext) | Sur demande | [Dext, saisie comptable](https://dext.com/fr/cabinet/produits/saisie-comptable), lu le 06/10 | Les factures atypiques et les doublons sans numéro | comptabilite |
| N2F (N2F) | Sur demande | [n2f.com](https://www.n2f.com/), lu le 06/10 | Les notes arrivées hors de l'outil, le justificatif manquant réclamé en le nommant | comptabilite |

### 2.2 Paie et social

| Outil (éditeur) | Statut | Preuve | Ce que nous reprenons | Fiches |
|---|---|---|---|---|
| Silae, mySilae (Silae) | **Éprouvé** (K1) ; sinon Par export | §2.0 ; en public, [API Silae](https://www.silae.fr/api-silae/) et [sa documentation](https://silae-api.document360.io/), lues le 14/10, sans date affichée | L'export du mois et la liste des salariés lus ; contrôles et écarts avant la DSN ; rien n'est écrit dans Silae | paie-social, rh-cabinet |
| Sage 100 Paie & RH, Sage Production Sociale Experts (Sage) | Sur demande | [Sage, contrats sociaux et DSN](https://fr-kb.sage.com/portal/app/portlets/results/view2.jsp?k2dockey=211010160115038), lu le 04/10 | Les contrats et dates attendus, recensés avant le transfert DSN (guides existants) | paie-social |
| Cegid Payroll Ultimate, Quadra Paie (Cegid) | Sur demande | [Cegid Payroll Ultimate](https://www.cegid.com/fr/produits/cegid-payroll-ultimate/), lu le 06/10 | Les rapprochements que ses contrôles natifs ne couvrent pas | paie-social |
| ACD Paie, i-PAIE (ACD Groupe) | Sur demande | [ACD, modules social](https://www.acd-groupe.fr/solution-collaborative/modules-social/), lu le 06/10 | Les variables arrivées par e-mail ou par tableur | paie-social |
| PayFit (PayFit) | Par export | [PayFit API](https://developers.payfit.io/docs/start-with-payfit-api), clé API par entreprise, mise à jour du 11/03/2026, lue le 14/10 | L'export de paie du client rapproché de la comptabilité tenue par le cabinet | paie-social, comptabilite |

net-entreprises n'a pas de ligne : nous n'y déposons rien. La DSN et la DPAE vont dans « Ce qui ne part jamais sans vous ».

### 2.3 Juridique et formalités

| Outil (éditeur) | Statut | Preuve | Ce que nous reprenons | Fiches |
|---|---|---|---|---|
| Lexis PolyActe (LexisNexis) | Sur demande | [LexisNexis, secrétariat juridique](https://www.lexisnexis.com/fr-fr/produits/logiciel-secretariat-juridique), lu le 06/10 | L'échéancier d'approbation et de dépôt, s'il reste hors du circuit juridique | juridique-fiscal |
| Registre national des entreprises (INPI) | Par export | [INPI, accès à l'API formalités RNE](https://www.inpi.fr/ressources/formalites-dentreprises/acces-lapi-formalite-rne) : page du 07/04/2025, lue le 14/10 ; JSON, compte requis | La fiche RNE d'un client lue pour actualiser son dossier et signaler un changement. Aucune formalité déposée | juridique-fiscal |
| BODACC (DILA) | Par export | [data.gouv.fr, API BODACC](https://www.data.gouv.fr/dataservices/672cf66ea47b8d4c15d13d5b), lue le 14/10 : ouverte, Licence ouverte 2.0 | Les annonces rapprochées du portefeuille, l'alerte préparée pour l'associé référent | juridique-fiscal |
| Répertoire Sirene (INSEE) | Par export | [data.gouv.fr, API Sirene](https://www.data.gouv.fr/dataservices/api-sirene-dont-unites-a-diffusion-partielle), lue le 14/10 : accès sur demande au portail de l'INSEE, 30 requêtes par minute | L'identité, l'adresse et l'activité des dossiers, contrôlées | juridique-fiscal, commercial |
| Kanta (groupe Visma) | Sur demande | [Kanta, LCB-FT](https://www.kanta.fr/modules/lutte-anti-blanchiment), lu le 06/10 | Les pièces d'entrée en relation qu'il ne collecte pas. La vigilance reste au cabinet | commercial, juridique-fiscal |

### 2.4 Commissariat aux comptes

Règle de couverture CAC du 06/10 : les suites font déjà la réception du FEC, la collecte des pièces, les rapports et l'archivage. Nous reprenons ce qu'aucune ne documente : la sélection des tiers selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. Aucune fiche n'est étiquetée « CAC ».

| Outil (éditeur) | Statut | Preuve | Ce que nous reprenons | Fiches |
|---|---|---|---|---|
| Acropole Expert CAC (Acropole Expert Informatique) | Sur demande | [acropole-expert.com](https://acropole-expert.com/commissaires-aux-comptes/), mise à jour du 23/09/2026, lu le 06/10 et le 14/10 | La sélection des tiers et la feuille des écarts, en amont de la suite | missions-audit |
| Auditsoft Premier (Lefebvre Dalloz) | Sur demande | [Lefebvre Dalloz, mises à jour 2026](https://assistance.lefebvre-dalloz.fr/logiciels-et-services/comptabilite-fiscalite/auditsoft-premier/les-mises-a-jour/maj-2026/), lu le 06/10 | Idem | missions-audit |
| Caseware Audit France (Caseware France) | Sur demande | [caseware.fr, Audit France](https://www.caseware.fr/audit-france-cwf/), lu le 06/10 et le 14/10 ; la page cite la balance de vérification, pas le FEC | Les fichiers du client rapprochés de la balance (paie, immobilisations, stocks) | missions-audit |
| PackAUDIT (CNCC) | Sur demande | [packaudit.cncc.fr](https://packaudit.cncc.fr/), version 2.2.2 du 31/08/2026, lu le 06/10 | Idem | missions-audit |
| SmartFEC+ (CNCC) | Sur demande | Coffre, `cac-donnees-circularisation.md` §1.1 (06/10) | Rien sur l'analyse du FEC, qu'il fait déjà ; la sélection et les écarts | missions-audit |
| DreamAudit (Gest On Line) | Sur demande | [gestonline.com](https://www.gestonline.com/), lu le 06/10 | Idem Acropole | missions-audit |
| RévisAudit (Gest On Line) | Sur demande, **texte seul et sans lien, après l'avis de Kevin (K4)** | L'éditeur, Gest On Line, suffit comme source ; aucun lien vers le domaine proscrit | Idem Acropole | missions-audit |
| e-Circu (Gest On Line) | Sur demande | [Gest On Line, circularisation](https://www.gestonline.com/blog/circularisation-audit), lu le 06/10, relu le 14/10 : aucun contenu étranger dans le texte rendu | La sélection des tiers et la feuille des écarts ; l'envoi et les relances restent à la plateforme | missions-audit |
| Circit (Circit) | Sur demande | [Circit, Confirm](https://www.circit.io/fr/platform/confirm), lu le 06/10 | La sélection des tiers selon la règle du cabinet | missions-audit |

### 2.5 Banque, GED, messagerie, classeurs, signature

| Outil (éditeur) | Domaine | Statut | Preuve | Ce que nous reprenons | Fiches |
|---|---|---|---|---|---|
| Qonto (Qonto) | banque | Par export | [Qonto Developers](https://docs.qonto.com/home/welcome) (redirection depuis api-doc.qonto.com), lu le 14/10, sans date ; Business API : banque, facturation, tenue | Les mouvements et pièces que l'outil comptable n'a pas appariés | comptabilite, finance |
| SharePoint et OneDrive (Microsoft 365) | GED | Par export | [Microsoft Graph, fichiers](https://learn.microsoft.com/en-us/graph/api/resources/onedrive), mise à jour du 21/11/2024, lue le 14/10 | Les pièces déposées lues et rangées dans l'arborescence du cabinet ; rien n'est supprimé | informatique-outils, protection-donnees |
| Google Drive (Google Workspace) | GED | Par export | [Google Drive API](https://developers.google.com/workspace/drive/api/guides/about-sdk), mise à jour du 25/09/2026, lue le 14/10 | Idem | informatique-outils |
| Outlook, Exchange Online (Microsoft 365) | messagerie et agenda | Par export | [Microsoft Graph, API Mail](https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview), mise à jour du 02/09/2026, lue le 14/10 ; agenda et contacts dans la même boîte | Les messages triés par dossier et par priorité, les brouillons préparés ; rien ne part sans validation | relation-client, communication |
| Gmail (Google Workspace) | messagerie | Par export | [Gmail API](https://developers.google.com/workspace/gmail/api/guides), mise à jour du 18/09/2026, lue le 14/10 | Idem | relation-client, communication |
| Microsoft Excel (Microsoft 365) | classeurs | **Éprouvé** (K1) | §2.0 ; en public, [Office Add-ins pour Excel](https://learn.microsoft.com/en-us/office/dev/add-ins/excel/excel-add-ins-overview), mise à jour du 19/06/2026, lue le 14/10 | Les exports lus, et dans le classeur ce que la règle prévoit ; formules et saisies intactes, chaque écriture tracée | informatique-outils, paie-social, rh-cabinet, gestion-cabinet |
| Fichier des écritures comptables (format fixé par l'article A. 47 A-1 du LPF) | classeurs et données | Par export | [BOFiP, BOI-CF-IOR-60-40-20171004](https://bofip.impots.gouv.fr/bofip/4895-PGP.html/identifiant=BOI-CF-IOR-60-40-20171004), version du 04/10/2017, lue le 14/10 | Le FEC exporté par le logiciel du cabinet ou remis par le client, lu. Sa forme se teste avec Test Compta Demat de la DGFiP, dont la page officielle répondait 403 le 06/10 et le 14/10 | comptabilite, missions-audit |
| Youtrust, anciennement Yousign (Youtrust) | signature | Par export | [Youtrust API](https://developers.youtrust.com/docs/introduction-new), mise à jour du 07/09/2026, lue le 14/10 | La lettre de mission préparée pour la signature, son retour suivi ; l'envoi reste validé par le cabinet | commercial, juridique-fiscal |
| Docusign eSignature (Docusign) | signature | Par export | [Docusign eSignature REST API](https://developers.docusign.com/docs/esign-rest-api/), lue le 14/10, sans date affichée | Idem | commercial, juridique-fiscal |
| JeSignExpert (ECMA) | signature | Sur demande | [ECMA, JeSignExpert](https://ecma-solutions.com/produits-expert-comptable/jesignexpert), illisible le 06/10 : à relire. ECMA est une intégration, jamais un partenaire institutionnel (mémoire `voie-institutionnelle-oec-ecma`) | Idem | commercial |

Les relevés au format CFONB 120 n'ont pas de ligne : la brochure officielle n'a pas été lue sur cfonb.org, seulement des copies tierces. La banque arrive le plus souvent par le logiciel comptable du cabinet.

### 2.6 Caisse et e-commerce, gestion du cabinet, finance, protection des données

| Outil (éditeur) | Domaine | Statut | Preuve | Ce que nous reprenons | Fiches |
|---|---|---|---|---|---|
| Planity (Planity) | caisse | Sur demande | Aucune documentation publique d'export trouvée (14/10) ; voir §2.0 | L'export mensuel de caisse mis en écriture au format que le cabinet importe déjà | comptabilite |
| PrestaShop (PrestaShop SA) | e-commerce | Sur demande | La documentation officielle lue n'a aucune page sur l'export comptable (14/10) ; voir §2.0 | L'export comptable remis au format d'import du cabinet (caractères, décimales, comptes étrangers) | comptabilite |
| ACD, gestion interne (ACD Groupe) | gestion du cabinet | Sur demande (K2) | §2.0 ; format non publié | Le fichier de ré-import des actes du mois préparé ; l'import reste le geste du cabinet | gestion-cabinet |
| MEG (RCA) | gestion du cabinet | Sur demande | [rca.fr](https://www.rca.fr/), lu le 06/10 (coffre, RC1) ; voir §2.0 | Les licences attribuées contrôlées contre le suivi de facturation du cabinet | gestion-cabinet |
| RCA Évaluation (RCA) | finance | Sur demande | [RCA, Évaluation](https://rca.fr/logiciels-experts/evaluation/), lu le 08/10 | Les pièces et versions réunies avant le tableau ; la valeur reste au cabinet | finance |
| Modèle de registre des traitements (CNIL), tableur .ods | protection des données | Sur demande | [CNIL, modèle de registre simplifié](https://www.cnil.fr/la-cnil-publie-un-nouveau-modele-de-registre-simplifie), publié le 23/07/2019 selon les extraits ; 503 le 14/10, à relire avant de passer Par export | Le registre du cabinet tenu dans ce modèle, les réponses aux demandes d'accès préparées ; le référent décide | protection-donnees |

Les douze fiches ont au moins un outil. Communication s'appuie sur la messagerie, et RH du cabinet sur Excel et Silae.

## 3. Facturation électronique : aucune plateforme nommée

**Source officielle :** la [liste des plateformes agréées immatriculées](https://www.impots.gouv.fr/liste-des-plateformes-agreees-immatriculees), publiée par la DGFiP sur impots.gouv.fr. Elle est **en maintenance le 14/10 et le 15/10/2026** (trois lectures). Les fichiers qu'une autre passe a récupérés le 14/10 vers 23 h (`dl/fe/*.pdf`) sont eux aussi la page de maintenance. Des sources secondaires, **non vérifiées**, avancent : une page publiée le 30/07/2024 et modifiée le 12/08/2026 ; deux listes (immatriculation définitive, ou sous réserve des tests d'interopérabilité) ; 101 premières plateformes le 16/01/2026. Aucun de ces éléments ne va sur la page.

**La page peut affirmer :**
1. que l'administration publie la liste, avec le lien officiel, sans nombre ni date tant qu'elle n'a pas été relue ;
2. que nous travaillons avec la plateforme agréée déjà choisie par le cabinet ou par son client, après avoir vérifié qu'elle figure sur la liste à la date du devis, et dans laquelle des deux ;
3. le calendrier, par la source que cite déjà la page service (`src/content/services/facture-electronique.md`, [DGFiP](https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique), consultée le 06/10/2026) : émission des PME au 1er septembre 2027. La réception au 1er septembre 2026 ne s'écrit qu'après relecture de cette même source ;
4. ce que nous reprenons, selon la page service : les clients sur une autre plateforme, hors du circuit que l'outil du cabinet couvre déjà.

**La page ne doit pas affirmer :**
- un nom de plateforme, un nombre de plateformes, ou un statut « agréée » ou « immatriculée » prêté à un éditeur ;
- que Memlia est une plateforme, est reliée à une plateforme ou est « compatible avec toutes les plateformes » ;
- que Memlia émet, transmet, reçoit ou dépose une facture, ou des données de transaction ou de paiement ;
- une « conformité » à la réforme, un délai ou une sanction non relus à la source.

**À corriger en phase 3, fail-closed :** dans `src/data/couverture-logiciels.mjs`, l'entrée `facture-electronique` présente Pennylane, ACD, Inqom, fulll, Cegid Loop et Quadra Plus (via Shine), MyU et Tiime comme porteurs d'une « plateforme agréée ». Cette mention repose sur leurs seules pages (06/10). Il faut les relire contre la liste officielle dès sa remise en ligne et noter la liste (définitive ou sous réserve). Un nom absent perd le qualificatif.

## 4. Logos : aucun, le nom en texte partout

| Éditeur | Règle publique trouvée (lue le 14/10) | Recommandation |
|---|---|---|
| Microsoft (Excel, Outlook, SharePoint, OneDrive) | [Règles d'usage des marques Microsoft](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general) : logos et icônes jamais sans licence expresse. Le nom peut s'écrire en texte s'il décrit fidèlement le produit, sans modification ni affiliation suggérée, et moins visible que notre marque. Une mention de propriété est recommandée | Texte seul, plus la mention ci-dessous |
| Google (Gmail, Google Drive) | [Règles des marques Google](https://partnermarketinghub.withgoogle.com/brands/google/trademarks-and-terms/trademark-guidelines-for-proper-usage/), par redirection depuis about.google : logos en visuel approuvé par Google uniquement. Le nom s'emploie en adjectif suivi du terme générique, jamais dans un nom de produit | Texte seul : « messagerie Gmail », « dossiers Google Drive » |
| Docusign | [Guide des marques](https://www.docusign.com/IP/trademark-brand-guide) et [usage général](https://www.docusign.com/IP/trademark-general), connus par extrait de recherche : logo sur demande de licence, jamais à côté d'un concurrent en signature. Le nom peut identifier le produit, sans suggérer de partenariat | Texte seul (Youtrust est sur la même ligne) |
| PrestaShop | [Politique de propriété intellectuelle](https://www.prestashop-project.org/files/ip-right-policies.pdf), connue par extraits : les marques appartiennent à PrestaShop SA ; kit logo réservé aux groupes d'utilisateurs | Texte seul |
| Sage | Seul document trouvé : le [guide de co-marketing des partenaires](https://developer.sage.com/accounting/downloads/Partner_Co-Marketing_Guidelines_Sept2020.pdf) (sept. 2020). Le logo relève du programme partenaires | Texte seul |
| Cegid (EBP, Loop, Quadra), ACD, Silae, Pennylane, Qonto, Youtrust, MyU, Tiime, Inqom, fulll, Agiris, Dext, N2F, Kanta, LexisNexis, Acropole, Lefebvre Dalloz, Caseware, Gest On Line, Circit, RCA, Planity, ECMA | Aucune règle publique d'usage par un tiers trouvée. Pennylane et Qonto ont été cherchés le 14/10 sans résultat ; les autres n'ont pas été cherchés un par un | Texte seul, par défaut |
| Organismes publics (DGFiP, INPI, DILA, INSEE, CNIL, CNCC) | Non vérifié | Texte seul ; jamais le bloc-marque de l'État |

**Mention proposée** (sous la liste et au pied de la page, K7) : « Les noms de logiciels et de
services cités sont des marques de leurs propriétaires. Memlia n'a de partenariat avec aucun de
ces éditeurs ; les citer ne vaut ni accord ni recommandation de leur part. »
Le site n'a aujourd'hui aucune mention de ce type (grep de `src/` le 14/10).

## 5. Domaine proscrit : `revisaudit[.]fr`

- **Règle** (contexte §6) : ce domaine porte du contenu de casino injecté. Il n'est jamais lié ni cité comme lien : ni `href`, ni URL en texte, ni source dans un JSON.
- **État du dépôt du site** (worktree `hub-specialistes`, grep du 14/10) : deux liens dans les docs (`docs/strategy/site-v3/cac/TERRAIN-CAC.md:204`, `cac/terrain-verbatims.json:35`) et un guide différé `/integrations/dossier-travail-revisaudit` (`cac/page-intent-plan.json:40`). Rien dans `src/`, `scripts/` ni `tests/`.
- **Même éditeur** : Gest On Line publie aussi e-Circu et DreamAudit, et le site cite déjà `gestonline.com` (`couverture-logiciels.mjs`, `commercial/recettes/circularisation-cac/`). La page relue le 14/10 était propre ; le reste du domaine n'a pas été vérifié.
- **Recommandations** :
  1. RévisAudit absent de la page des outils, ou en texte seul après avis de Kevin ;
  2. porter la garde `memlia-rdv/tests/preuve/domaine-proscrit.test.ts` dans `memlia-landing`, sur `dist/` entier (attributs compris) et sur `src/data/*`. C'est l'invariant de phase 3 que nomme le cadrage §4 ;
  3. passer le guide différé à l'état refusé ;
  4. écrire les deux liens des docs sous la forme neutralisée `revisaudit[.]fr`.

## 6. Pages de détail (skill `seo-programmatic`)

**Portes appliquées.** Chaque page :
- vaut d'être publiée seule et porte au moins 300 mots de faits propres ;
- a au moins 40 % de contenu propre face aux autres pages du lot, sans gabarit à trous ;
- a son canonical, son entrée de sitemap et de `pages-lastmod.json`, et son contrat `page-intent-contract.json` ;
- vise une requête mesurée (D14).

| Outil Éprouvé | Verdict | Pourquoi |
|---|---|---|
| Microsoft Excel | **Page de détail possible, à trois conditions** | La matière propre est réelle et dépasse largement 300 mots : deux façons d'agir dans le classeur (panneau greffé, extension installée) ; ce qui est lu, écrit et jamais touché ; les garde-fous (copie de sauvegarde avant écriture, divergence signalée et jamais écrasée, ré-import sans nouvelle écriture, journal avant→après) ; le rejeu sur jeu fictif. Conditions : (a) K1 validé ; (b) une requête mesurée et distincte de celle de l'article `suivre-la-production-sociale-dans-excel` (`tableau de bord paie excel`, cluster `excel-outils-existants`), sinon cannibalisation ; (c) ni « complément Excel », ni « module », ni Excel en catégorie commerciale (charte §4, `test_positioning.py`). Sans les trois, la page reste une carte |
| Silae | **Carte** | La part unique (lecture de l'export, liste des salariés sans NIR, rien dans Silae) tient en une centaine de mots. Le reste est déjà dans les guides `dsn-silae` et `bulletin-de-paie-silae` et dans le moyeu `/automatisation/paie`. Une page Silae passerait sous les 40 % de contenu propre. La carte lie ces deux guides |
| ACD, gestion interne (si K2) | **Carte** | Un seul fichier et un seul geste : le détail ne pourrait raconter qu'un cabinet réel |

- **Par export et Sur demande** : des cartes, sans page par outil. Une page « [outil] + gabarit » sans recette, c'est le motif que le skill classe en contenu mince. Les cartes Sage, Cegid Loop, EBP et Silae lient leurs guides existants (douze guides : ce sont les pages de détail au sens de D10).
- **Échelle** : une page de détail au plus. Aucune porte de volume (100 ou 500 pages) n'est approchée. Le risque est la cannibalisation, pas le volume.

## 7. Écarts relevés en chemin (signalés, non corrigés)

- `~/dev/CLAUDE.md` (tableau des tâches) et `10-memlia/produit/offre-et-modules.md` dans le coffre disent « recette passée le 26/07 » pour la production sociale. Ce n'est pas établi (K1).
- La mémoire du module 6 dit « FINI, Kevin a joué la recette ». D'après la leçon HKCU (`mscoree-hkcu-non-lu-installeur-com.md`), la recette du 20/08 ne mesurait pas l'installeur livré ce jour-là.
- EBP appartient à Cegid depuis 07/2024, ACD rejoint TeamSystem (annonce du 08/04/2026), et un rapprochement Cegid–Silae a été annoncé le 09/09/2026 (coffre, `ec-production.md`, non relu). La colonne « éditeur » se relit à chaque mise à jour.
- Le guide `lettrage-cegid` cite le sous-domaine `inte-developers.cegid.com`.
- Pages en 403 ou 503 le 14/10 : support.ebp.com, economie.gouv.fr (Test Compta Demat), cnil.fr, impots.gouv.fr (maintenance). Les dates de lecture antérieures restent valables ; rien n'a été relu par contournement.

## 8. Comptes (internes, jamais affichés)

- 49 outils sur 13 domaines.
- **Éprouvé proposé** : 2 (Excel, Silae), sous réserve de K1.
- **Par export** : 15. Cegid Loop, EBP, Pennylane, PayFit, RNE (INPI), BODACC, Sirene, Qonto, SharePoint et OneDrive, Google Drive, Outlook, Gmail, FEC, Youtrust, Docusign.
- **Sur demande** : 32, dont ACD gestion interne, qui passe Éprouvé si K2.
- Facturation électronique : 0 plateforme nommée.
