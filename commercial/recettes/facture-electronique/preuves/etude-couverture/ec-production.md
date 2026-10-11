# Ce que les logiciels de production et de révision des cabinets EC automatisent déjà

État au 06/10/2026. Recherche documentaire en lecture seule, faite pour le showroom Memlia.
Périmètre : logiciels de production comptable et de révision des cabinets d'expertise comptable, et leurs portails clients.

## Comment lire ce document

- **Nature des preuves**
  - [É] : documenté par l'éditeur (site, aide en ligne, communiqué, notes de version).
  - [É/U] : témoignage client publié par l'éditeur.
  - [U] : utilisateurs, presse ou tiers.
  - [O] : source officielle.
  - [D] : déduit par nous.
- **Statuts**
  - *couvert* : l'outil fait le geste.
  - *partiel* : il en fait une partie, ou seulement pour certains clients.
  - *non couvert* : une source dit que l'outil ne le fait pas.
  - *inconnu* : rien trouvé dans la documentation publique. « Non trouvé » ne veut pas dire « absent ».
- **Familles**
  - *Historiques* : Cegid (Loop, Quadra Plus, Expert Plus), ACD, Sage (Génération Experts, ex-Coala), RCA, Agiris (Isacompta), EBP.
  - *Plateformes récentes* : Pennylane, Tiime, MyUnisoft, Inqom, fulll.
  - *Satellites* : outils de collecte (Dext, Chaintrust…), portails (Welyb) et outils spécialisés.
- **Sources** : les codes entre crochets renvoient à l'annexe, qui donne l'URL et la date. Toutes les pages ont été consultées le 06/10/2026. La date citée est celle de publication ou de mise à jour quand la page l'affiche.
- **Limites** : voir la section 5. Recherche web plafonnée, aucune démonstration, pages illisibles, PDF non ouverts.

## Synthèse

1. **La production courante est couverte partout.** Saisie et OCR, banque, lettrage, TVA, immobilisations, liasse et EDI, plaquette, GED, portail client : l'objection « mon logiciel le fait » est fondée. Ces tâches sortent du showroom.
2. **Les pièces bancaires manquantes sont déjà réclamées, parfois sans intervention.**
   - Pennylane envoie au client un e-mail automatique le 1er et le 15 du mois, avec la liste des justificatifs demandés.
   - Son module Autopilot réclame seul la pièce 15 jours après un débit non rapproché.
   - ACD i-Banque envoie au client les lignes non imputées.
   - Reste à couvrir : les pièces hors banque et de clôture, une synthèse priorisée par dossier, un brouillon rédigé pour les clients qui n'utilisent pas l'application, et la consolidation quand le cabinet a plusieurs outils.
3. **Trois tâches du showroom ne sont couvertes par aucun outil trouvé.**
   - Le rappel à chaque client de ses échéances du mois, avec les montants. L'aide Pennylane écrit qu'il n'existe pas de rappel automatique avant l'échéance (J-7, J-2).
   - La mémoire de dossier rédigée automatiquement. Partout, les notes s'écrivent à la main.
   - La revue de 100 % des écritures avec un motif par écriture. Les outils signalent des anomalies compte par compte, pas écriture par écriture.
4. **Boîte mail : seul Pennylane fait une partie du travail, et seulement avec Outlook.**
   - Il rattache les e-mails des contacts au dossier, calcule un indice d'urgence et propose un brouillon.
   - Cela se lit dossier par dossier, sans vue priorisée du portefeuille.
   - Rien chez les historiques ni chez les autres plateformes.
5. **Tableau de bord commenté : déjà fait chez Pennylane et fulll.** Pennylane génère un commentaire par IA pour chaque section du rapport ; fulll fait rédiger une analyse par son IA Lya. Chez les historiques, MyUnisoft, Inqom et Tiime, le commentaire reste écrit à la main.
6. **Facture électronique : le suivi client par client est devenu standard chez les éditeurs plateformes agréées (PA).**
   - Partout : statut par client, mandats, inscription en masse.
   - Certains vont plus loin : Pennylane liste les mandats non signés depuis 30 jours ; Inqom relance en lot ; fulll relance le client à sa connexion suivante.
   - Reste à couvrir : clients sur une autre PA, liste des appels à passer, relances rédigées.
   - Fenêtre courte : l'émission devient obligatoire pour les PME le 01/09/2027.
7. **Révision : tous ont un dossier de travail par cycles, avec contrôles et écritures générées.**
   - Manquent la liste rédigée des points à trancher avec leurs écritures, et le cut-off proposé pièce à l'appui. Exceptions partielles : Cegid Loop, les CCA/PCA chez Inqom, le module « Fournisseurs dus » de Tiime.
   - Excel reste dans le circuit chez Pennylane, Inqom, ACD et Cegid Loop.
8. **Conseil : des signaux existent, pas la note pour l'associé.** Pennylane, fulll, RCA et Sesha émettent des signaux ; MyU Vision est annoncé. Aucun outil ne croise chiffres et échanges pour rédiger une note à l'associé.
9. **Circularisation : aucun logiciel de production ne la fait.** Des outils spécialisés existent (Confirmation.com), plutôt dans le périmètre CAC.
10. **Parts de marché : aucune source publique récente et fiable.**
    - La dernière enquête chiffrée date de 2021 (IFEC, 1 000 répondants) : Cegid équipait 40 % des cabinets en production ; seuls ACD et Sage Coala dépassaient 10 %.
    - Depuis, le marché s'est concentré : Cegid-Shine-Silae, ACD-TeamSystem, Visma (Inqom, Chaintrust).
    - Les chiffres déclarés par les éditeurs ne s'additionnent pas.

### Vue d'ensemble par tâche

| Tâche | Historiques | Plateformes récentes | Ce qui reste vraiment à faire | À montrer en rendez-vous ? |
|---|---|---|---|---|
| relance-pieces | partiel | couvert pour la banque (Pennylane), partiel ailleurs | pièces hors banque et de clôture ; synthèse priorisée ; brouillon pour clients sans appli ; plusieurs outils | Oui, avec cet angle précis |
| controles-revision | partiel | partiel | points à trancher rédigés avec écritures ; cut-off avec pièce ; feuilles Excel | Oui, angle précis |
| revue-ecritures | partiel ou non couvert | partiel (au niveau du compte) | revue écriture par écriture avec motif | Oui, surtout face aux historiques |
| liasse-fiscale | couvert | couvert | liste des points à valider avec leurs comptes | Non |
| rappels-echeances-fiscales | non couvert côté client | non couvert, sauf TVA chez Tiime | l'envoi au client, avec montants | Oui |
| tableau-de-bord-client | partiel (commentaire à la main) | couvert chez Pennylane et fulll, partiel ailleurs | commentaire ; production en série pour tout le portefeuille | Oui face aux historiques ; non face à Pennylane ou fulll |
| opportunites-conseil | partiel ou annoncé | partiel | note à l'associé croisant chiffres et échanges | Oui, avec prudence |
| memoire-dossier | partiel (manuel) | partiel (manuel) | synthèse automatique pour la reprise | Oui |
| boite-mail-triee | non couvert | partiel (Pennylane avec Outlook) | tri sur tout le portefeuille, priorités, brouillons | Oui |
| facture-electronique | partiel avancé | couvert | appels priorisés, relances rédigées, clients sur une autre PA | Seulement pour un portefeuille sur plusieurs PA ; fenêtre courte |
| confirmations-audit | non trouvé | non trouvé | tout | À traiter avec le périmètre CAC |
| Candidates (saisie, banque, lettrage, TVA, immobilisations, plaquette, situation, prévisionnel, GED, portail) | couvert | couvert | validation des exceptions | Non |
| cut-off | partiel | partiel | FNP et FAE proposés avec leur pièce | Oui, à intégrer à controles-revision |
| revision-ia | partiel | partiel | jugement, conclusions | Ne pas vendre de « révision IA » générique |

---

## 1. Les outils

### 1.1 Tableau des outils

| Outil | Éditeur (groupe) | Type | Cabinets visés (chiffres déclarés) | Prix public | Sources |
|---|---|---|---|---|---|
| Cegid Loop | Cegid (Silver Lake). Offre cabinets vendue sous la marque Shine en 2026. Rapprochement avec Silae annoncé le 09/09/2026 | SaaS de production : révision, cut-off, liasse, robot IA « PIA » ; intégré à Microsoft 365 et Teams | de 1,5 ETP à plus de 650 dossiers (témoignages) | non trouvé | [CG1, CG3, CG4, CG25, CG36-CG42] |
| Cegid Quadra Plus (ex-Quadra) | Cegid | Production, Liaison bancaire, « Box » de dépôt avec OCR, Cegid Pilot, gestion interne, paie. Mode de déploiement non précisé | 3 500 cabinets [É] | non trouvé | [CG5] |
| Cegid Expert Plus (ex-Expert / Expert On Demand) | Cegid | Production, console de portefeuille pour la facture électronique. Absent du plan de site produits de cegid.com ; Expert Day du 18/06/2026 annulé | non précisé | non trouvé | [CG6, CG14, CG33] |
| Cegid Conciliator | Cegid | Pré-comptabilité IA : collecte, découpage, plus de 70 contrôles par facture | cabinets sous Expert ou Quadra (témoignages : 15 et 35 salariés) | non trouvé | [CG7, CG46, CG47] |
| Cegid Pulse | Cegid | Couche d'IA « agentique ». Agent TVA annoncé pour mi-septembre 2025 ; les autres capacités sont annoncées sans date | — | non trouvé | [CG16, CG21, CG22] |
| Cegid Business, Cegid Flow, portail collaboratif, Shine Facture | Cegid / Shine | Applications et portails pour les clients ; Shine Facture inclut une console pour le cabinet | clients des cabinets | Shine Facture : 0, 11 ou 25 € HT par mois | [CG9, CG11, CG12, CG18] |
| Cegid Portail Etafi | Cegid | Télédéclaration EDI, audit du FEC, coffre-fort. Destiné aux entreprises, pas aux cabinets | 60 000 entreprises déclarantes | non trouvé | [CG13] |
| EBP, offre cabinets | EBP (Cegid depuis 07/2024) | Logiciel installé ou SaaS : comptabilité et révision, états financiers (liasse), paie. PA Shine | non précisé | sur devis | [EB1-EB4] |
| ACD : Suite Expert (Comptabilité Expert, GI, GRC, GED, Paie), i-Suite Expert, Waibi | ACD Groupe (TeamSystem, annonce du 08/04/2026) | Logiciel installé avec accès web ; portail web et mobile ; PA du Village Connecté (ACD, RCA, Coaxis) | 3 500 cabinets et 30 000 utilisateurs [É] ; 3 200 cabinets selon la presse | non trouvé | [AC1, AC4, AC9, AC23, AC24, AC30, X5] |
| Sage Génération Experts (ex-Coala), Sage for Accountants (SFA), AutoEntry, Sage Active | Sage Group | Logiciel Windows ou cloud Azure. SFA est le portail cloud du cabinet, obligatoire pour la facture électronique. PA Sage | non précisé | non trouvé | [SG1, SG5, SG15, SG33] |
| RCA : MEG et « Logiciels Experts » | RCA (fondateurs majoritaires ; Quilvest ≈ 15 % depuis 2023) | SaaS : portail, pré-compta, pilotage, PA du Village Connecté. Logiciels de mission : Tableau de bord, Bilan imagé, Prévisionnel, Diagnostic opérationnel, MAPi. **Pas de logiciel de production** | 6 400 cabinets ; 250 000 entreprises sur MEG [É] | non public (formules Full Services ou À la carte) | [RC1, RC2, RC5, RC20] |
| Agiris : ISACOMPTA CONNECT, ISAREVISE CONNECT, AMICOMPTA, SAMI, bobbee, portails, ISAGI CONNECT, IO ECF, eFacture | AGIRIS (groupe ISAGRI) | SaaS sur cloud privé : production, révision, IA de saisie, portails, gestion interne, examen de conformité fiscale, PA | 7 100 cabinets, 810 000 dossiers [É] ; cabinets généralistes et agricoles | non trouvé | [AG1, AG2, AG19] |
| Pennylane | Pennylane (levée de 175 M€ en 01/2026, valorisation 3,5 Md€) | Plateforme en ligne unique pour le cabinet et le client ; PA | 6 500 cabinets [É] ; 4 500 selon la presse | 8 € par dossier et par mois (2 € pour une SCI ou un LMNP). PA gratuite si la compta est tenue sur Pennylane. Autopilot en essai gratuit jusqu'en 09/2027 | [PL4, PL28, PL37, PL39, PL47] |
| Tiime (Tiime Expert) | Tiime (autofinancé) | Applications client gratuites, production pour le cabinet, PA ; établissement de paiement depuis 04/2026 | 1 600 à 3 000 cabinets selon la page | 6,99 € par dossier (2024). Gratuit si le client ouvre le compte pro. 0 € via l'API. PA gratuite | [TI6, TI8, TI9, TI11, TI13] |
| MyUnisoft (MyU) | MyUnisoft (Hg majoritaire depuis 03/2025 ; 125 à 140 cabinets actionnaires) | Suite SaaS : production et fiscal, gestion interne, pilotage, datalake, PA | plus de 1 300 cabinets, 255 000 dossiers [É] | non trouvé. Connecteur IA (MCP) inclus, jetons d'IA à la charge du cabinet | [MU4, MU28, MU30, X3] |
| Inqom (Inqom by Visma) | Inqom (groupe Visma) | Production automatisée par IA ; portail Inqom Gestion ; PA via Chaintrust ; Agentix (plateforme d'agents, bêta) | non trouvé | Facture électronique : 1 € par dossier et par mois pour les clients Inqom Expert. Prix bloqués jusqu'à 6 ans | [IQ2, IQ4, IQ6, IQ20] |
| fulll | fulll (In Extenso majoritaire ; Visma minoritaire depuis 03/2026 ; issu d'iBiza) | Plateforme web : pré-compta, compta, paie, révision continue, examen de conformité fiscale, IA Lya, PA | 1 400 à 1 600 (site) ; près de 2 000 (presse) | par utilisateur, montant non publié ; offre jeunes cabinets | [FU13, FU14, FU21, FU27] |
| Dext | Dext (IRIS Software Group selon Compta-Online ; non confirmé sur dext.com) | Pré-compta : collecte, OCR, banque, GED, PA, assistant IA | cabinets et entreprises | Prix de base par dossier masqué. Options : assistant IA 6 € par dossier et par mois ; stockage et crédits 2 €. Royaume-Uni : 2,50 £ par client et par mois | [DX1, DX4, DX22, X3] |
| Chaintrust | Chaintrust (Visma depuis 2024) | Saisie IA, banque, GED, appli mobile, PA du groupe Visma | plus de 1 000 cabinets | à partir de 20 € HT par mois et par dossier (5 € en comptabilité de trésorerie) | [CT1, CT2, CT13] |
| Welyb | Welyb | Portail et GED en marque blanche, connectés aux PA | plus de 300 cabinets (fiche Cabinet Digital) | 68 ou 90 € HT par licence et par mois (1 à 5 licences) ; 495 à 585 € par mois de 6 à 10 licences | [WE1-WE4] |
| iDocus, SoBank, Yooz | iDocus ; Sogescot ; Yooz | Collecte et pré-affectation ; relevés bancaires EBICS ; achats des PME (Yooz est PA) | — | non publics | [PC1-PC3] |
| Outils spécialisés cités | divers | Analyse de FEC : Runview, Control FEC, Conformexpert (ECMA), Supervizor. Analyses et opportunités par IA : Sesha. Tableaux de bord : Finthesis, Jedataviz, Waibi, Bilan imagé. Prévisionnel : Okimia (ex-Fygr), Forekasts. Suivi facture électronique : cockpit Cabinet Digital. Circularisation : Confirmation.com. Portail et CRM : TaxDome, MyCabeo. E-mails : Qolaig | — | Cockpit Cabinet Digital : 0, 39 ou 79 € HT par mois. TaxDome ≈ 50 € par mois (fiche). Autres non publics | [X13, X16-X20, X24] |
| Hors jeu | — | QuickBooks France : accès coupé le 31/12/2023, lecture seule jusqu'au 31/03/2024. Ibiza : site figé, regroupé dans fulll selon la presse. Regate : arrêté par Qonto (07/2026) | — | — | [Q1, I1, FU27, X26] |
| Cador | non identifié | Rien trouvé. cador.fr, cador.io et cador.ai sont illisibles, cador.com est à vendre, cador.co est sans rapport, cador.app refuse la connexion. Absent des 178 fiches de l'annuaire Cabinet Digital | — | — | — |

### 1.2 Poids des outils dans les cabinets

**Aucune source publique récente et fiable ne donne de parts de marché.** La seule enquête chiffrée trouvée date de 2021. Les chiffres plus récents sont déclarés par les éditeurs eux-mêmes.

| Source | Date | Méthode | Chiffres | Fiabilité |
|---|---|---|---|---|
| IFEC, « Les outils numériques dans les cabinets : enquête », IFEC Mag n°69 [X1] | 1er trimestre 2021 | 1 000 répondants en deux semaines ; déclaratif ; échantillon non redressé (syndicat IFEC) | Voir le détail sous le tableau | Moyenne pour 2021, faible pour 2026 : l'enquête précède la montée de Pennylane, MyUnisoft et Tiime [U] |
| Même enquête, notes de satisfaction sur 3 [X1] | 2021 | idem | Gestion interne : planification 1,76 ; suivi d'avancement de la production 1,85 ; lettres de mission 1,78 ; publipostage et e-mailing 1,84. Indicateurs clients : Cegid 1,75, RCA 2,63 | Montre les zones faibles des suites historiques [U] |
| Baromètre EY-Numeum 2025, repris par Compta-Online [X2] | 11/11/2025 | chiffre d'affaires des éditeurs ; pas d'équipement des cabinets | Voir le détail sous le tableau | Élevée pour le chiffre d'affaires, inutilisable pour l'équipement [U] |

Détail des chiffres de l'enquête IFEC 2021 [X1] :
- **Production comptable** : Cegid équipe 40 % des cabinets, trois fois plus que le suivant. Seuls ACD et Sage Coala dépassent 10 % ; Ibiza, Agiris et les autres sont entre 4 et 9 %.
- **Collecte des pièces** : 35 % des cabinets utilisent au moins deux outils. Cegid, RCA et ACD réunissent 44 % des utilisateurs.
- **GED** : Cegid 27 %, ACD 16 %, Agiris 8 %.
- **Indicateurs clients** : Cegid 28 %, RCA 13 %, mais seuls 20 % des répondants ont répondu sur ce point.
- **Équipement** : 50 % des cabinets n'ont qu'un seul éditeur.

Détail du baromètre EY-Numeum 2025 [X2] :
- Chiffre d'affaires 2024 : Cegid 967 M€, Isagri/Agiris 321 M€, Pennylane ≈ 60 M€, Tiime 40,8 M€.
- 83 % des éditeurs font de l'IA une priorité ; 61 % ont intégré l'IA générative, le plus souvent sans tarif spécifique.

Chiffres déclarés par les éditeurs. Ils ne s'additionnent pas : un cabinet utilise souvent plusieurs outils, et « client » peut désigner un seul module.

| Éditeur | Chiffre déclaré | Sources |
|---|---|---|
| Agiris (Isagri) | 7 100 cabinets, 810 000 dossiers | [AG1] |
| Pennylane | 6 500 cabinets (site) ; 4 500 (presse, 23/01/2026) | [PL39, PL47] |
| RCA | 6 400 cabinets ; 250 000 entreprises sur MEG | [RC2] |
| ACD | 3 500 cabinets, 30 000 utilisateurs ; 3 200 selon la presse | [AC1, AC30, X5] |
| Cegid Quadra Plus | 3 500 cabinets | [CG5] |
| Tiime | 1 600 à 3 000 cabinets selon la page | [TI9, TI11] |
| fulll | 1 400 à 1 600 (site) ; près de 2 000 (presse, 10/03/2026) | [FU14, FU21] |
| MyUnisoft | plus de 1 300 cabinets, 255 000 dossiers | [MU28] |
| Chaintrust | plus de 1 000 cabinets | [CT2] |
| Welyb | plus de 300 cabinets (fiche Cabinet Digital) | [WE1] |

Ordre de grandeur de la profession : environ 19 000 à 20 000 cabinets et 21 000 à 22 000 experts-comptables, selon des sources secondaires vues en extrait de recherche. Le chiffre officiel du Conseil supérieur de l'Ordre n'a pas été trouvé.

### 1.3 Mouvements 2024-2026 utiles pour lire le marché [U]

- **Cegid (Silver Lake)**
  - a racheté EBP (07/2024) et Shine (annonce le 26/11/2025, finalisation en 06/2026) ;
  - vend son offre cabinets sous la marque Shine ;
  - a annoncé le 09/09/2026 son rapprochement avec Silae, pour un ensemble de plus de 10 Md€ ;
  - Shine rachète Libeo le 28/09/2026.
  
  Sources : [CG1, CG23, CG25, X3, X4].
- **ACD** rejoint l'italien TeamSystem, annonce du 08/04/2026 [AC23, X5].
- **Visma (Hg)** détient Inqom, Chaintrust, Evoliz, Kanta, Finthesis, MyCompanyFiles et Silverfin, ainsi qu'une part minoritaire de fulll [X3, X17, FU21, CT13].
- **MyUnisoft** : Hg devient majoritaire en 03/2025 [MU30].
- **Pennylane** : levée de 175 M€ en 01/2026 [PL47].
- **Plateformes agréées** : environ 140 sont immatriculées à l'été 2026 [X6]. Parmi elles : Cegid, Sage, Pennylane, Yooz, Dext, Agiris, RCA (via le Village Connecté), Regate by Qonto et ECMA (jefacture.com).
- **Calendrier de la facture électronique** [O, X11, X12] :
  - réception obligatoire pour toutes les entreprises depuis le 01/09/2026 ;
  - émission obligatoire pour les grandes entreprises et les ETI depuis le 01/09/2026 ;
  - émission obligatoire pour les PME et micro-entreprises au 01/09/2027.
- **Mandat** : le décret n° 2026-677 du 27/07/2026 permet au cabinet de désigner une PA pour son client, sur mandat [X14, U].
- **81e Congrès de l'Ordre** : 16 au 18/09/2026, à Paris, sur le thème « [Re]fondation des cabinets » ; facture électronique et IA en pilier thématique [X21].

---

## 2. Couverture par tâche

### 2.1 Tâches du showroom

#### relance-pieces

Promesse Memlia : par dossier, la liste exacte des pièces manquantes et un brouillon de relance qui nomme chaque pièce.

**Historiques — partiel**

- **Geste automatisé**
  - ACD i-Banque repère les écritures bancaires non imputées et les envoie automatiquement au client, qui complète sur mobile ou sur le web.
  - Cegid Loop annonce des relances clients, des rappels automatiques et des alertes, sans préciser à quel niveau. La console d'Expert Plus montre l'état de la collecte par client ; Conciliator signale les pages manquantes.
  - Agiris bobbee tient une liste de points en suspens partagée avec le client : règlements, notes de frais, salaires non justifiés.
  - RCA MEG : le client rattache lui-même ses justificatifs. Pilotage Cabinet signale les incohérences, puis le collaborateur contacte le client.
  - Sage AutoEntry : aucune demande de pièce trouvée.
- **Reste à la main**
  - Les pièces hors banque et de clôture.
  - Une liste par dossier qui nomme chaque pièce, et le brouillon de relance.
  - La relance automatique, non documentée chez ACD, Sage, Agiris et RCA.
  - Chez RCA, le collaborateur regroupe les points et contacte le client : 60 min ramenées à 20 min pour 10 dossiers, selon un témoignage.
- **Sources** : É [AC11 (24/02/2025), CG4, CG6, CG7, AG5, AG7, RC11, RC12 (23/02/2026), SG33]

**Plateformes récentes — couvert pour les pièces bancaires chez Pennylane ; partiel ailleurs**

- **Geste automatisé**
  - **Pennylane**
    - Le cabinet pose une demande par transaction, une à une ou en masse ; le client la retrouve dans son onglet « À faire ».
    - Rappel automatique au client le 1er et le 15 du mois : liste des justificatifs et documents demandés, sans montants.
    - Autopilot envoie seul la demande si aucune facture n'arrive 15 jours après un débit non rapproché (comptabilité d'engagement seulement).
    - Autopilot demande aussi le relevé bancaire le 1er du mois, pour le 10.
    - Les demandes de documents de la GED peuvent être récurrentes ; elles sont relancées.
  - **fulll** : « points en suspens » pour repérer les pièces manquantes et relancer en masse (26/02/2026).
  - **Tiime** : demande par transaction ou en masse. Le bouton « Relancer » envoie un e-mail standard des demandes en cours, sur déclenchement manuel.
  - **Inqom** : onglet « Pièces manquantes » qui liste les lignes 401/411 non lettrées issues de la banque, avec statuts et export Excel. Aucune relance documentée (aide de 07/2024).
  - **MyUnisoft** : drapeau Info/PJ posé à la main sur une ligne, visible du client. Ni récapitulatif ni relance automatique.
- **Reste à la main**
  - Les pièces de clôture (contrats, emprunts, stocks, attestations), demandées une à une.
  - Les textes sont standard, sans tri par montant ni par enjeu.
  - Le client doit utiliser l'application.
  - Chez Inqom et MyUnisoft, la relance elle-même reste à faire par e-mail ou téléphone [D].
- **Sources** : É [PL55 (vérifié mot à mot), PL3, PL5, FU18 (26/02/2026), TI17-TI22, IQ7, MU2, MU16]

**Satellites — partiel**

- **Geste automatisé**
  - **Dext** : le collaborateur envoie une demande groupée par dossier sur les transactions non rapprochées. Le client reçoit une notification dans l'application (aucun e-mail documenté). Export PDF ou CSV si le client n'a pas l'application. Aucune relance automatique (aide du 10/08/2026).
  - **Welyb** : rappels automatiques pour les factures manquantes ; la façon dont le manque est détecté n'est pas précisée.
  - **Chaintrust** : non trouvé.
- **Reste à la main** : les clients sans application, les pièces hors banque, le brouillon.
- **Sources** : É [DX7, WE3] ; [CT3-CT6]

**Terrain**
- Dans une étude de cas publiée par Dext, une collaboratrice décrit les relances de pièces manquantes comme sa principale surcharge avant l'outil [É/U DX23].
- Deux fils Compta-Online de 08-09/2026 demandent aux petits cabinets comment ils suivent et relancent les pièces : 688 et 991 lectures, aucune réponse. C'est un signal d'intérêt, pas un témoignage de pratique [U FO2, FO3].

**Pour le showroom** : ne pas montrer « la liste des pièces bancaires manquantes » à un cabinet équipé de Pennylane, Tiime, Inqom, MyUnisoft, fulll, ACD ou Dext. Montrer plutôt :
- les pièces hors banque et de clôture ;
- une synthèse par dossier, triée par montant et par enjeu ;
- un brouillon qui nomme chaque pièce, pour les clients qui n'ouvrent pas l'application ;
- la consolidation quand les pièces sont réparties entre plusieurs outils.

#### controles-revision

Promesse Memlia : un dossier de travail prérempli avant le bilan, avec les contrôles conformes, les points à trancher avec leurs écritures, et un cut-off proposé avec sa pièce.

**Historiques — partiel**

- **Cegid Loop**
  - Programme de travail par cycle, avec une aide au contrôle pour chaque diligence et une barre de supervision.
  - Alertes sur ce qui bloque la liasse ; points d'attention reportés sur l'exercice suivant ; comparaison avec N-1.
  - Questionnaire anti-blanchiment (LCB-FT) prérempli ; contrôle croisé entre dotations et immobilisations.
  - Cut-off automatisés avec extournes, que l'IA propose dès la saisie.
- **ACD** : plus de 50 assistants de révision (emprunts, IS, TVA, immobilisations, FNP…) qui génèrent les écritures. Tableau de bord de révision avec alertes d'incohérence.
- **Agiris ISAREVISE CONNECT**
  - Programme de travail adapté au dossier ; plus de 60 assistants de feuilles de travail.
  - Plus de 140 contrôles de cohérence et de vraisemblance ; écritures d'OD générées.
  - Notes de synthèse et points en suspens annoncés comme automatisés.
- **Sage Génération Experts** : feuilles de travail (préparation de la CA12 depuis 01/2026), rôles de réviseur, superviseur et signataire, verrou sur les comptes révisés (05/2026).
- **EBP** : plans de révision et feuilles de travail paramétrables.
- **Quadra Plus et Expert Plus** : la révision n'apparaît pas sur les pages actuelles.
- **RCA** : n'a pas d'outil de révision.
- **Reste à la main**
  - La liste rédigée des points à trancher, avec leurs écritures.
  - Le cut-off accompagné de sa pièce, sauf chez Cegid Loop.
  - Des tableaux Excel insérés dans le dossier de travail (ACD) ou collés à la main (tableaux d'emprunt, Cegid Loop).
  - Chez Sage, les utilisateurs demandent depuis longtemps de mieux voir les commentaires sur les comptes (37 votes).
- **Sources** : É [CG30, AC10, AC11, AC27, AG4, SG8, SG11, EB3] ; É/U [CG36, CG40] ; U [SG32] ; extrait de recherche [AC32a]

**Plateformes récentes — partiel**

- **Pennylane**
  - Dossier de travail par cycles (A à K), plus de 200 diligences.
  - Une diligence passe seule en « non applicable » sous un seuil, et repasse « À revoir » si le compte bouge après révision.
  - L'IA propose les anomalies et les synthèses de cycle ; les modules d'inventaire génèrent les écritures.
  - Pré-révision par Autopilot annoncée pour 12/2026.
- **MyUnisoft** : feuilles de travail alimentées depuis la comptabilité (immobilisations, emprunts, crédit-bail, comptes réciproques, cut-off, cadrage de TVA…). Écritures d'inventaire générées à la validation ; questionnaire anti-blanchiment prérempli par IA.
- **Inqom** : l'éditeur annonce 50 % des diligences automatisées. Preuves PDF jointes d'office (12/2025) ; CCA et PCA proposés à partir de la pièce.
- **Tiime** : diligences alimentées, contrôles de cohérence, note de synthèse avec les 5 plus fortes variations, module « Fournisseurs dus ».
- **fulll** : « révision continue » (doublons, erreurs de TVA, pièces manquantes) ; dossier de fin d'exercice non documenté publiquement.
- **Reste à la main**
  - Commentaires, conclusions, points à trancher rédigés.
  - Pennylane : certaines feuilles sont des modèles Excel à remplir puis réimporter ; le chiffre d'affaires du logiciel de facturation se tape à la main.
  - Inqom : feuilles Excel via un complément Excel et SharePoint.
  - FNP et FAE : saisis par formulaire (Inqom) ou par case à cocher (Pennylane).
- **Sources** : É [PL4, PL7-PL11, MU1, MU19, MU26, IQ2, IQ10, IQ12, IQ-V159, TI24-TI26, TI29, TI36, FU2, FU3]

**Satellites — non couvert** : Dext et Chaintrust ne contrôlent que les pièces. É [DX14, CT15]

**Terrain**
- Le blog de Cegid présente le programme de travail de Loop comme le remplaçant des feuilles Excel [É CG30].
- Un expert-comptable qui enquête sur les méthodes de cut-off écrit le 18/09/2026 qu'« aucun outil n'existe à ce jour ». Le sens reste ambigu : il précise aussi n'avoir rien à vendre. Il ajoute que beaucoup de cabinets passent à des outils qui promettent de tout faire, révision comprise [U FO1].

**Pour le showroom** : ne pas montrer un dossier de révision par cycles générique, tous en ont un. Montrer plutôt :
- la liste rédigée des points à trancher, avec écritures et montants ;
- le cut-off proposé pièce à l'appui, surtout FNP et FAE.

Ce sont des arguments forts face à Sage, Quadra, Expert, EBP et Tiime, ou face à des feuilles encore tenues dans Excel.

#### revue-ecritures

Promesse Memlia : revue de 100 % des écritures du FEC ; liste des écritures inhabituelles avec leur raison.

**Historiques — partiel ou non couvert**

- **Cegid Loop** : l'IA repère les incohérences d'imputation et de TVA, et vérifie SIRET, coordonnées bancaires et adresses. Conciliator fait plus de 70 contrôles par facture.
- **Cegid Portail Etafi** (destiné aux entreprises) : test du FEC, contrôles paramétrables, comparaison entre FEC et liasse.
- **ACD**
  - IA lancée le 05/03/2026, gratuite jusqu'au 30/06/2026.
  - Elle alerte sur les fluctuations anormales, les écarts significatifs et la cohérence entre masse salariale et chiffre d'affaires.
  - Elle travaille au niveau des indicateurs ; les données analysées ne sont pas précisées.
  - Outil tiers interconnecté : Notaqo (anti-fraude).
- **Agiris** : IO ECF valide le FEC avec l'outil de la DGFiP et produit le compte rendu d'examen de conformité fiscale.
- **Sage** : rien en natif. Une simple alerte sur les doublons d'écriture est demandée depuis le 18/07/2023 (105 votes).
- **RCA** : non couvert.
- **Reste à la main** : la revue écriture par écriture, avec la raison de chaque alerte.
- **Sources** : É [CG7, CG13, CG30, AC20, AC22, AG4, AG11] ; U [SG32]

**Plateformes récentes — partiel (au niveau du compte)**

- **Pennylane** : un bouton affiche les anomalies. Il signale les écarts inhabituels par compte, les évolutions et les incohérences entre écritures, avec hypothèses, impact et recommandation.
- **Inqom** : à chaque import de FEC, repère les comptes dont le solde a changé et les nouvelles écritures. Son Copilot (en test) signale les fortes variations.
- **MyUnisoft** : signale les comptes non affectés et les soldes anormaux. Un assistant d'audit par IA était annoncé pour le 1er trimestre 2026 (statut inconnu).
- **fulll** : Lya contrôle dès la saisie. Le module d'examen de conformité fiscale automatise plus de 80 % des travaux selon l'éditeur, contrôles du FEC compris.
- **Tiime** : contrôle de cohérence de la balance.
- **Reste à la main** : la revue de 100 % des écritures avec un motif par écriture (non trouvée), et le prix du module fulll.
- **Sources** : É [PL11, PL12, IQ11, IQ18, MU1, MU4, MU14, FU2, FU4, FU11, TI29]

**Satellites et outils spécialisés — partiel**

- Runview : 80 contrôles métiers et points de l'examen de conformité fiscale, selon sa fiche (son site actuel parle surtout d'audit des fournisseurs).
- Control FEC : anomalies, doublons, rapports d'examen de conformité fiscale.
- Conformexpert (ECMA) : contrôle du FEC.
- Supervizor : plus de 350 contrôles sur 100 % des transactions, destiné à l'audit interne.
- Dext Data Health : seulement pour Xero et QuickBooks.
- **Reste à la main** : l'outil ne travaille pas dans le logiciel de production du cabinet, et la raison par écriture n'est pas documentée.
- **Sources** : [X17, X18, X25, DX20]

**Pour le showroom** : à montrer surtout aux cabinets sous Sage, ACD, Quadra, Expert, EBP ou RCA. Face à Pennylane ou fulll, insister sur le niveau de détail : écriture par écriture avec une raison, et non compte par compte. Attention aux outils de FEC spécialisés.

#### liasse-fiscale

Promesse Memlia : liasse préparée, contrôles croisés, points à valider avec leurs comptes.

**Historiques — couvert pour la production ; contrôles croisés partiels**

- **Cegid Loop** : la liasse est générée à partir de la révision, après un contrôle d'anomalies. L'annexe s'intègre automatiquement, quand cela fonctionne (témoignage KPMG Nord).
- **ACD** : liasses et annexes, télédéclaration EDI ; alertes d'incohérence au niveau du dossier.
- **Sage** : liasses 2026, dont le formulaire 2272 ; télédéclaration EDI. Des formulaires manquent selon les utilisateurs.
- **Agiris** : liasse générée dans ISACOMPTA ; ISAREVISE alimente le résultat fiscal.
- **EBP** : liasses, annexes et contrôles de cohérence.
- **Quadra Plus et Expert Plus** : la liasse n'apparaît pas sur les pages actuelles.
- **Reste à la main** : la liste des points à valider avec leurs comptes (non trouvée) et l'annexe quand l'intégration échoue.
- **Sources** : É [CG30, AC10, AC27, SG10, SG21, AG4, AG10, AG11, EB3] ; É/U [CG38] ; U [AC29, SG32, SG36]

**Plateformes récentes — couvert**

- **Pennylane** : formulaires BIC et BNC remplis depuis la compta ; partenaire TELEDEC pour les autres régimes ; contrôles de cohérence sur le formulaire 2054.
- **MyUnisoft** : détecte anomalies et écarts entre formulaires avant chaque envoi EDI.
- **Inqom** : aide au remplissage avec alertes de cohérence ; envoi par Teledec.
- **Tiime** : envoi bloqué tant qu'un contrôle est au rouge.
- **fulll** : télétransmission directe.
- **Reste à la main**
  - Saisies préalables : capital, filiales, déficits, organisme de gestion agréé.
  - Corrections.
  - Une liste des points à valider avec leurs comptes : non trouvée.
- **Sources** : É [PL15, PL16, MU3, MU10, IQ14, IQ15, TI30, TI31, FU2]

**Pour le showroom** : ne pas montrer. L'objection est fondée partout.

#### rappels-echeances-fiscales

Promesse Memlia : un rappel par client, qui ne nomme que ses échéances du mois, avec le montant quand il est connu.

**Historiques — non couvert côté client ; partiel côté cabinet**

- **ACD** : planification et tableau d'avancement des échéances en gestion interne ; alertes dans le portail ; publipostage.
- **Agiris** : bobbee envoie des rappels de tâches automatiques pour l'IS et la TVA.
- **Cegid Flow** : alertes sur des « échéances » non précisées. Cegid Tax Flex : calendrier fiscal pour les PME et ETI.
- **Sage** : calendrier fiscal générique ; notifications au client après télétransmission.
- **RCA et EBP** : non trouvé.
- **Reste à la main** : le message par client qui liste ses échéances du mois avec les montants. Il n'existe nulle part.
- **Sources** : É [AC7, AC27, AC28, AG7, AG9, CG11, CG24, SG20] ; U [SG32]

**Plateformes récentes — non couvert, sauf la TVA chez Tiime**

- **Pennylane**
  - Vue des échéances du portefeuille, avec montants et statut « En retard ».
  - L'aide indique qu'il n'existe aucun rappel automatique (J-7, J-2) pour les déclarations non faites, et qu'aucun e-mail ne part au client pour les acomptes d'IS (04/09/2026).
  - Le client reçoit seulement un e-mail après coup, quand une déclaration envoyée par Pennylane est reçue par l'administration.
- **Tiime** : si le client déclare sa TVA dans Tiime, il reçoit un message 5 jours avant l'échéance. Le cabinet dispose de plannings de TVA, d'IS et de CVAE.
- **MyUnisoft** : suivi interne seulement ; un e-mail part à chaque envoi EDI ; suivi de la TVA prévu sur la feuille de route.
- **Inqom et fulll** : non trouvé.
- **Reste à la main** : le rappel complet au client, avec les montants.
- **Sources** : É [PL17 (vérifié mot à mot), PL18, TI32-TI35, MU11, MU15, MU22, IQ15, FU9]

**Satellites — partiel** : Welyb envoie des rappels d'« échéances à venir », sans préciser lesquelles. MyCabeo annonce un suivi fiscal en temps réel. É [WE3] ; [X17]

**Pour le showroom** : à montrer. C'est la lacune la plus nette.

#### tableau-de-bord-client

Promesse Memlia : une page par client et par période, avec chiffres, courbe et trois phrases de commentaire en brouillon.

**Historiques — partiel ; le commentaire reste à la main**

- **Cegid** : tableaux de bord intégrés à Loop ; connecteur vers Office ; indicateurs partagés dans Cegid Business ; rapports de situation annoncés avec Pulse.
- **ACD**
  - i-Comptes : graphiques sur 3 exercices.
  - Waibi Essentiel (07/09/2026) : 5 onglets, avec des commentaires saisis par le cabinet.
  - Waibi a annoncé une IA de commentaire le 31/10/2025, sans confirmation dans Essentiel.
- **RCA** : logiciel Tableau de bord (réalisé comparé au budget et à N-1, points d'alerte, PDF) ; assistant IA Lucia pour poser des questions sur les données (Congrès 2026).
- **Agiris** : plus de 50 tableaux de bord dans le portail, plus de 70 indicateurs dans bobbee.
- **EBP** : tableaux de bord avec écarts et projections.
- **Sage** : états de gestion seulement. L'édition mensuelle du bilan et du résultat est demandée (33 votes).
- **Reste à la main**
  - Le commentaire rédigé : aucune IA de commentaire documentée.
  - Les indicateurs propres à chaque client : un cabinet sous Loop les prépare par copier-coller dans Excel.
- **Sources** : É [CG4, CG16, CG18, AC4, AC18, AC24, RC13, RC14, AG5-AG7, EB3, SG22] ; É/U [CG37] ; U [SG32]

**Plateformes récentes — couvert chez Pennylane et fulll ; partiel ailleurs**

- **Pennylane**
  - Rapport construit depuis un modèle du cabinet.
  - L'IA rédige un commentaire pour chaque section, à partir des vignettes ; l'éditeur conseille de relire avant envoi.
  - Le rapport reste un brouillon jusqu'à sa publication au client.
  - Un rendez-vous enregistré peut être résumé par IA.
- **fulll** : l'IA Lya rédige une analyse en langage naturel (points d'attention, risques, opportunités) ; modèles sectoriels ; export PDF.
- **MyUnisoft** : rapport PowerPoint avec une diapositive « Commentaires » (09/2026), à remplir à la main.
- **Inqom** : tableaux de bord dynamiques, sans commentaire IA trouvé.
- **Tiime** : page de pilotage côté client, sans commentaire ; renvoie à son partenaire Forekasts.
- **Reste à la main**
  - Chez Pennylane : relire, et publier chaque rapport un par un. Une génération en série n'a pas été trouvée.
  - Ailleurs : rédiger le commentaire.
- **Sources** : É [PL19, PL20 (vérifiés mot à mot), FU4, FU7 (vérifié), MU6-MU8, MU15, IQ2, IQ-V170, TI40, TI45]

**Satellites** : Finthesis, Jedataviz, Waibi et Bilan imagé produisent des tableaux de bord. Aucun commentaire généré n'est documenté sur leurs fiches [X17].

**Pour le showroom** : à montrer face aux historiques, à MyUnisoft, Inqom et Tiime, en insistant sur la production en série pour tout le portefeuille. Face à Pennylane ou fulll, l'objection est fondée.

#### opportunites-conseil

Promesse Memlia : des pistes de conseil repérées dans les chiffres et les échanges, en note pour l'associé.

**Historiques — partiel ou annoncé**

- **Cegid Pulse** : préparation des rendez-vous, scénarios et alertes par dossier. Annoncé sans date ; démontré à Monaco en 11/2025.
- **ACD** : son IA évalue la santé de l'entreprise, ses zones de vigilance et sa valorisation.
- **RCA**
  - Diagnostic opérationnel : l'IA analyse les questionnaires remplis par le client et préremplit constats et préconisations.
  - MAPi : repère les aides publiques à partir des SIRET du portefeuille.
  - Un suivi des signaux faibles est annoncé pour plus tard.
- **Agiris** : travaux en cours (IAnalytics).
- **Sage** : non trouvé.
- **Reste à la main** : la lecture des échanges avec le client et la note rédigée pour l'associé.
- **Sources** : É [CG16, CG22, AC20, RC13, RC15, RC17, RC18, AG16]

**Plateformes récentes — partiel**

- **Pennylane** : un centre de signaux repère les créances élevées par rapport au chiffre d'affaires et les excédents de trésorerie.
- **fulll** : Lya signale risques et opportunités sur le portefeuille et suggère des missions complémentaires.
- **MyUnisoft** : MyU Vision, annoncé le 03/09/2026, doit détecter les opportunités ; disponibilité inconnue.
- **Inqom et Tiime** : non trouvé.
- **Reste à la main** : la même chose, plus la validation.
- **Sources** : É [PL21, FU4, FU10, MU12]

**Satellites** : Sesha émet des alertes sur les anomalies et les opportunités de conseil, selon sa fiche [X17].

**Pour le showroom** : à montrer en mettant en avant le croisement des chiffres et des échanges (e-mails, comptes rendus). Prudence : la concurrence arrive vite.

#### memoire-dossier

Promesse Memlia : l'historique, les particularités et les points de vigilance d'un dossier, consultables par celui qui le reprend.

**Historiques — partiel, tout à la main**

- **Cegid Loop** : un canal Teams par client ; points d'attention reportés sur l'exercice suivant.
- **ACD** : la GRC centralise la relation client ; la GED est reliée à Outlook.
- **Sage** : tuiles « Dossier permanent » et « Note du dossier ». Les notes ne sont pas signalées aux collaborateurs (demande à 53 votes).
- **Agiris** : la gestion interne garde la trace des échanges.
- **Reste à la main** : une synthèse automatique pour le repreneur, qui n'existe nulle part.
- **Sources** : É [CG5, AC5, AC6, SG26, AG4, AG9] ; É/U [CG36, CG37] ; U [SG32]

**Plateformes récentes — partiel, tout à la main**

- **Pennylane** : notes sur la fiche client ; le centre de collaboration garde l'historique des demandes et des e-mails Pennylane et Outlook ; l'IA résume un document.
- **MyUnisoft** : commentaires permanents par compte, commentaires de révision, onglet Discussions.
- **Inqom** : dossier permanent, notes par compte et par cycle.
- **Tiime** : note permanente, fils de discussion internes.
- **fulll** : non trouvé.
- **Reste à la main** : la même chose.
- **Sources** : É [PL22, PL23, PL34, MU17, MU18, MU22, IQ10, IQ-V168, IQ-V179, TI41, TI42]

**Pour le showroom** : à montrer. Argument : le départ ou le changement de collaborateur.

#### boite-mail-triee

Promesse Memlia : boîte mail rangée par dossier et par priorité, avec des brouillons de réponse.

**Historiques — non couvert**

- **ACD** : la GED reliée à Outlook classe les pièces jointes.
- **Agiris** : messagerie interne et collecte des e-mails vers la GED.
- **Cegid** : adresses de collecte des pièces ; intégration Teams et Office 365. Chez un cabinet sous Loop, la plupart des clients envoient encore leurs factures en PDF par e-mail.
- **Sage, RCA, EBP** : non trouvé.
- **Reste à la main** : tout le tri, les priorités et les réponses.
- **Sources** : É [AC5, AG9, AG12, CG3, CG7] ; É/U [CG39]

**Plateformes récentes — partiel chez Pennylane seulement**

- **Pennylane**
  - Une fois Outlook connecté, les e-mails échangés avec les contacts d'un dossier y sont rattachés.
  - Un indice de satisfaction et un indice d'urgence sont calculés, visibles dossier par dossier : il n'existe pas de vue globale du portefeuille.
  - Un assistant IA propose un brouillon de réponse.
- **MyUnisoft, Inqom, fulll, Tiime** : adresses de dépôt des pièces et messageries internes ; ni tri ni brouillon trouvés.
- **Reste à la main**
  - Chez Pennylane : les e-mails d'inconnus ou hors dossier, la vue priorisée de la boîte entière. Gmail n'est pas mentionné.
  - Ailleurs : tout.
- **Sources** : É [PL24, PL25 (vérifiés mot à mot), MU2, MU17, IQ9, IQ-V163, FU6]

**Satellites — partiel**

- Qolaig « Automail » classe les e-mails et propose des brouillons, selon Compta-Online (26/11/2025). Ce n'est pas confirmé sur son site.
- TaxDome propose une boîte de réception partagée.
- **Sources** : [X7, X24, X17]

**Pour le showroom** : à montrer. Face à Pennylane, insister sur la vue priorisée de toute la boîte et sur les e-mails hors contacts.

#### facture-electronique

Promesse Memlia : passage du portefeuille à la facturation électronique, avec l'avancement par client, les relances et les dossiers à appeler.

**Historiques — partiel, avancé**

- **Cegid**
  - PA Cegid immatriculée en 08/2024 (n°0007) ; PA Shine en 05/2026.
  - Console de supervision : inscription par lots, mandats en masse, statuts en temps réel.
  - Console d'Expert Plus : par client, état de la collecte, équipement de facturation, inscription et recommandations.
  - Communiqué du 15/04/2025 : envoi automatique d'e-mails et suivi de l'avancement.
- **ACD** : PA du Village Connecté ; contrôle d'éligibilité ; inscription unitaire ou en lot ; statut par dossier ; mandats ; actions en masse par « robot ».
- **Sage**
  - Inscription groupée de 100 clients au plus ; filtre sur le statut de la PA ; alerte si des statuts n'ont pas été envoyés depuis 5 jours.
  - Un abonnement Sage Active ou AutoEntry est exigé par client.
- **RCA MEG** : inscription depuis MEG ; statut par client. Un kit fournit des modèles d'e-mails à envoyer soi-même.
- **Agiris** : PA eFacture ; suivi par client et relances absents de la page.
- **EBP** : s'appuie sur la PA Shine.
- **Reste à la main**
  - Les relances, sauf l'envoi automatique annoncé par Cegid.
  - La liste des dossiers à appeler.
  - Le suivi des clients rattachés à une autre PA.
  - Les mandats signés hors de l'outil.
- **Sources** : É [CG3, CG6, CG8, CG17, CG20, AC9, AC16, AC19, SG13-SG17, RC9, RC10, RC13, RC21, AG8, EB4] ; U [SG27]

**Plateformes récentes — couvert pour l'avancement ; relances partielles**

- **Pennylane**
  - Statut par client.
  - Liste « Actions à faire » : mandats récemment signés à désigner, mandats expirés après 60 jours à renvoyer, mandats sans signature depuis 30 jours.
  - Inscription automatique à la signature ; invitations en masse.
- **Inqom** : statuts par dossier ; « relancer une demande » à l'unité ou en lot ; mandats importés en CSV.
- **fulll** : tableau des invitations et des inscriptions ; relance automatique à la connexion suivante du client ; kit de communication.
- **Tiime** : statut dans l'annuaire et chez Tiime ; invitations en masse ; mandat sur modèle.
- **MyUnisoft** : PA depuis 01/2026, mais l'aide fait vérifier chaque client dans l'annuaire public, dossier par dossier.
- **Reste à la main** : appels aux clients bloqués, relances rédigées, clients sur une autre PA, mandats signés hors de l'outil.
- **Sources** : É [PL26, PL27 (vérifiés), PL28, IQ16, IQ-V163, FU8, TI43, TI44, MU13, MU20, MU21] ; U [FU22]

**Satellites — partiel**

- **Dext** : désignation en masse jusqu'à 100 clients ; 8 statuts. Son guide de préparation du portefeuille ne décrit que des tâches manuelles.
- **Chaintrust** : 11 statuts ; un indicateur « relances nécessaires » prévu.
- **Cockpit de Cabinet Digital** : import du portefeuille par SIREN, PA par client, liste de contrôle ; 0, 39 ou 79 € HT par mois. Ni relance ni liste d'appels.
- **Sources** : É [DX6, DX17, DX18, CT7, CT8, CT12] ; [X13]

**Pour le showroom** : à montrer seulement pour un portefeuille réparti sur plusieurs PA ou logiciels, avec la liste des appels à passer et des relances rédigées. Sinon, l'outil de l'éditeur suffit. Fenêtre jusqu'au 01/09/2027.

#### confirmations-audit

Promesse Memlia : circularisation pour les missions d'audit d'un cabinet EC.

- **Historiques — inconnu (non trouvé)**
  - Cegid n'a aucun produit d'audit légal dans son catalogue.
  - Chez ACD, une formation « avec audit » existe, mais son PDF n'a pas été consulté.
  - Rien chez Sage, RCA, Agiris ou EBP.
  - Reste à la main : tout.
  - Sources : É [CG14, CG3] ; [D]
- **Plateformes récentes — inconnu (non trouvé)**
  - Seulement des contrôles internes : feuille des comptes réciproques (MyUnisoft), diligences intragroupe avec preuve PDF (Inqom).
  - Aucun envoi de demande de confirmation à un tiers.
  - Reste à la main : tout.
  - Sources : É [MU1, IQ-V159]
- **Outils spécialisés — couvert hors production**
  - Confirmation.com (Thomson Reuters) : circularisation numérique auprès des banques, clients, fournisseurs et avocats, avec suivi des réponses ; prix non public.
  - Logiciels de commissariat aux comptes : RevisAudit, Auditsoft, Caseware, Acropole, Cacao, DreamAudit. Leurs fonctions de circularisation ne sont pas vérifiées.
  - Sources : [X19, X16]

**Pour le showroom** : à traiter avec le périmètre CAC. Rare chez les petits cabinets EC.

### 2.2 Tâches candidates

Format de chaque fiche : statut des historiques ; statut des plateformes récentes ; outils et geste ; reste à la main ; sources ; verdict pour le showroom.

#### saisie-ocr

- **Historiques** : couvert.
- **Plateformes récentes** : couvert.
- **Outils et geste**
  - Cegid : robot PIA de Loop (jusqu'à 70 % des écritures reconnues selon l'éditeur), Conciliator, Box de Quadra.
  - ACD FACT, en option.
  - Sage AutoEntry, par abonnement.
  - Agiris AMICOMPTA : plus de 90 % de la saisie détaillée, 98 % pour les factures électroniques (éditeur, 29/09/2026).
  - Pennylane (93 % des champs reconnus), Tiime, MyUnisoft, Inqom, fulll, Dext, Chaintrust.
- **Reste à la main** : validation, factures atypiques, doublons sans numéro.
- **Sources** : É [CG4, CG7, AC14, SG33, AG5, X10, PL6, TI3, MU2, IQ9, FU5, DX2, CT3]
- **Showroom** : non.

#### rapprochement-bancaire

- **Historiques** : couvert ; non trouvé dans Sage Génération Experts.
- **Plateformes récentes** : couvert.
- **Outils et geste**
  - Quadra : Liaison bancaire (DSP2). Loop : via Jedeclare.
  - ACD : Banque et i-Banque.
  - Agiris : EDI ou lecture du site bancaire.
  - MEG : DSP2 et EBICS.
  - Pennylane : 84 % des rapprochements suggérés par IA.
  - Tiime : rapprochement si montant égal et moins de 31 jours.
  - MyUnisoft : EBICS.
  - fulll : 5 règles.
  - Dext : suggestions.
- **Reste à la main** : lignes non reconnues, paiements groupés.
- **Sources** : É [CG5, AC3, AG3, RC8, PL6, TI3, MU24, FU20, DX8] ; [SG9]
- **Showroom** : non.

#### lettrage

- **Historiques** : couvert ; non vérifié chez ACD.
- **Plateformes récentes** : couvert.
- **Outils et geste**
  - Quadra : lettrage automatique.
  - Sage : automatique et partiel (07/2026), avec des frictions signalées par les utilisateurs.
  - Agiris : automatique.
  - Pennylane : lettrage quotidien selon des règles.
  - MyUnisoft : écart passé en écriture sous un seuil.
  - Inqom : lettrage par IA.
  - fulll : validé d'office quand la certitude est totale.
- **Reste à la main** : cas complexes.
- **Sources** : É [CG5, SG12, AG3, PL3, MU2, IQ2, FU12] ; U [SG28]
- **Showroom** : non.

#### tva

- **Historiques** : couvert.
- **Plateformes récentes** : couvert ; contrôle de cohérence partiel.
- **Outils et geste**
  - Loop : déclarations automatisées et contrôle de cohérence par IA. Cegid Pulse : agent TVA annoncé pour mi-septembre 2025.
  - ACD, Sage (CA3, CA12, feuilles de travail), Agiris (assistant TVA).
  - Pennylane : TVA théorique comparée à la TVA comptabilisée.
  - Tiime : contrôles sur tout le portefeuille.
  - MyUnisoft : feuille de cadrage.
  - Inqom : assistant TVA, mais le rapprochement CA/TVA est fait à la main.
- **Reste à la main** : analyse des écarts ; rapprochement CA/TVA chez Inqom.
- **Sources** : É [CG21, CG30, AC27, SG8, AG3, PL42, TI32, MU1, IQ13]
- **Showroom** : non, sauf un contrôle CA/TVA détaillé face à Inqom ou Sage.

#### immobilisations

- **Historiques** : couvert.
- **Plateformes récentes** : couvert ; non trouvé chez fulll.
- **Outils et geste**
  - ACD : fiches créées automatiquement.
  - Sage : module Investissements et financements.
  - Agiris : écritures automatiques.
  - Pennylane : fiche créée dès la saisie.
  - Tiime, MyUnisoft, Inqom : modules dédiés.
- **Reste à la main** : vérification, cas particuliers.
- **Sources** : É [AC11, SG9, AG3, PL46, TI37, MU1, IQ-V159]
- **Showroom** : non.

#### cut-off (CCA, FNP, FAE)

- **Historiques** : partiel.
- **Plateformes récentes** : partiel.
- **Outils et geste**
  - Cegid Loop : cut-off repérés par IA dès la saisie, avec extournes.
  - ACD : assistant FNP.
  - MyUnisoft : écritures CCA, FNP et FAE générées à la validation d'une feuille.
  - Inqom : CCA et PCA créés seuls à partir d'une pièce couvrant plus de 60 jours et dépassant 100 € HT ; FNP et FAE par formulaire.
  - Pennylane : il faut saisir la période et cocher une case ; aucune détection automatique.
  - Tiime « Fournisseurs dus » : trie les factures autour de la clôture.
  - Sage : non trouvé.
- **Reste à la main** : FNP et FAE proposés avec leur pièce.
- **Sources** : É [CG30, AC27, MU1, IQ12, PL29, PL30, TI36] ; U [FO1]
- **Showroom** : oui, intégré à controles-revision.

#### plaquette

- **Historiques** : couvert.
- **Plateformes récentes** : couvert ; partiel chez Tiime.
- **Outils et geste** : ACD, Sage, Agiris et EBP produisent la plaquette. Pennylane : depuis un modèle, avec signature JeSignExpert. MyUnisoft : rapport PowerPoint. Inqom : bibliothèque de textes.
- **Reste à la main** : commentaires et textes de l'annexe.
- **Sources** : É [AC27, SG7, AG4, EB3, PL31, MU7, IQ-V170, TI38]
- **Showroom** : non.

#### situation-intermediaire

- **Historiques** : partiel ou inconnu.
- **Plateformes récentes** : couvert ; partiel chez MyUnisoft et Inqom.
- **Outils et geste**
  - Pennylane : dossier de travail de situation, avec cut-off à la date de situation.
  - MyUnisoft : blocage des soldes de situation. Inqom : situations simplifiées (10/2026).
  - ACD : situations toutes périodes, selon un revendeur.
  - Sage : demande des utilisateurs.
- **Reste à la main** : commentaires.
- **Sources** : É [PL32, MU36, IQ-V182] ; U [AC29, SG32]
- **Showroom** : non.

#### previsionnel

- **Historiques** : partiel ou couvert.
- **Plateformes récentes** : partiel ou couvert.
- **Outils et geste**
  - RCA Prévisionnel. ACD : partenaires PREVI'START et Cashlab. Cegid : Cash Pilot.
  - MyUnisoft : Budget Flash par IA. fulll : Smart Forecast.
  - Pennylane : côté client. Tiime : module de prévision.
- **Reste à la main** : les hypothèses.
- **Sources** : É [RC16, AC21, AC22, CG31, MU9, FU4, PL45, TI39]
- **Showroom** : non, l'offre est abondante.

#### revision-ia

- **Historiques** : partiel.
- **Plateformes récentes** : partiel.
- **Outils et geste**
  - Loop : IA de cohérence.
  - ACD : IA d'analyse depuis 03/2026.
  - Agiris : SAMI, présenté comme disponible sur la page produit mais « en développement » dans un entretien du 29/09/2026.
  - Pennylane : IA d'anomalies ; Autopilot Révision prévu en 12/2026.
  - MyUnisoft : MCP en lecture seule.
  - Inqom : Copilot ; Agentix en bêta.
  - fulll : Lya.
- **Reste à la main** : jugement, conclusions.
- **Sources** : É [CG30, AC20, AG5, X10, PL4, PL11, MU4, IQ6, IQ18, FU4]
- **Showroom** : ne pas vendre une « révision IA » générique.

#### ged

- **Historiques** : couvert.
- **Plateformes récentes** : couvert.
- **Outils et geste** : ACD GED, GED d'Agiris, SharePoint chez Loop, Pennylane, MyUnisoft, Inqom, fulll, Dext, Chaintrust, Welyb.
- **Reste à la main** : organiser le dossier permanent.
- **Sources** : É [AC5, AG12, CG37, PL5, MU2, IQ-V180, FU6, DX5, CT5, WE1]
- **Showroom** : non.

#### portail-client

- **Historiques** : couvert ; partiel chez Sage.
- **Plateformes récentes** : couvert.
- **Outils et geste**
  - i-Suite d'ACD, MEG de RCA, portail et bobbee d'Agiris, Cegid Business et Flow.
  - Sage : AutoEntry et Sage Active.
  - Pennylane, Tiime, MyUnisoft, Inqom Gestion, fulll, Welyb.
- **Reste à la main** : faire adopter l'outil au client. Des avis négatifs portent sur la bascule de Cegid Business vers Shine.
- **Sources** : É [AC4, RC11, AG6, CG18, SG33, PL45, TI22, MU2, IQ3, FU6, WE1] ; U [CG50]
- **Showroom** : non.

---

## 3. Lacunes : tâches répétitives qu'aucun outil ne couvre (ou seulement en partie)

Le classement combine la fréquence et la douleur. À niveau proche, la lacune la mieux étayée passe devant. La douleur est surtout déduite [D] : les forums, LinkedIn et Reddit ont été peu atteints (section 5).

| Rang | Lacune | Fréquence | Douleur | Preuve que les outils ne la couvrent pas | Concurrence | Angle Memlia |
|---|---|---|---|---|---|---|
| 1 | Relance des pièces, pour la partie que les outils ne couvrent pas : pièces hors banque et de clôture, synthèse priorisée par dossier, brouillon rédigé pour les clients sans application, consolidation entre plusieurs outils | mensuelle, avec un pic au bilan | forte. Relances décrites comme une surcharge [É/U DX23] ; intérêt fort sur Compta-Online [U FO2, FO3] ; publipostage et e-mailing mal notés en 2021 (1,84/3) [X1] | Chez Dext, Inqom, MyUnisoft et Tiime, la relance se déclenche à la main ; le client doit utiliser l'application ; les pièces de clôture se demandent une à une [É DX7, IQ7, MU16, TI19, PL5] | Pennylane (rappel le 1er et le 15, Autopilot), fulll (relance en masse), ACD i-Banque | Tout ce qui sort du flux bancaire ; un texte rédigé et nominatif ; un cabinet équipé de plusieurs outils |
| 2 | Tri de la boîte mail par dossier et par priorité, avec brouillons | quotidienne | forte [D]. Chez un cabinet sous Loop, la plupart des clients envoient leurs factures par e-mail [É/U CG39] | Rien chez les historiques ni chez MyUnisoft, Inqom, fulll et Tiime. Pennylane : Outlook seulement, dossier par dossier, contacts connus seulement [É PL24, PL25] | Pennylane avec Outlook ; Qolaig (start-up) | Vue priorisée de toute la boîte, quel que soit le logiciel de production |
| 3 | Rappel à chaque client de ses échéances du mois, avec les montants | mensuelle, pour tous les clients | moyenne à forte [D] : pénalités, appels des clients | Pennylane le dit : aucun rappel automatique (J-7, J-2), aucun e-mail pour les acomptes d'IS [É PL17]. Tiime : TVA seulement, et seulement si le client déclare dans Tiime [É TI35]. Ailleurs : alertes internes ou rappels génériques [É AC7, AG7, CG11, WE3] | aucune trouvée | Lacune nette, à montrer en premier |
| 4 | Dossier de révision : points à trancher rédigés avec leurs écritures, cut-off proposé avec sa pièce, sortie des feuilles Excel | annuelle par dossier, concentrée de janvier à mai | forte en saison [D] | Pas de liste des points à trancher trouvée ; FNP et FAE saisis par formulaire ou case à cocher [É IQ12, PL29, PL30] ; Excel dans le circuit [É PL10, IQ2, AC32a ; É/U CG36] ; un expert-comptable qui enquête sur le cut-off écrit qu'aucun outil n'existe à ce jour (sens ambigu) [U FO1] | Cegid Loop (cut-off par IA), Inqom (CCA/PCA), Pennylane Autopilot Révision (12/2026), MyUnisoft | Points à trancher et FNP/FAE avec pièce, surtout face aux historiques |
| 5 | Mémoire de dossier : synthèse de l'historique, des particularités et des vigilances | à chaque reprise ou départ de collaborateur | forte au moment de la reprise [D] | Partout, des notes à saisir à la main ; aucune synthèse automatique [É PL22, MU18, IQ10, TI42, SG26] ; chez Sage, les notes ne sont pas signalées aux collaborateurs (53 votes) [U SG32] | aucune trouvée | Lacune nette ; s'appuie sur les e-mails, les notes et la révision |
| 6 | Revue de 100 % des écritures, avec une raison par écriture | annuelle, plus les situations | moyenne : qualité, risque, examen de conformité fiscale | Les plateformes signalent au niveau du compte [É PL11, IQ11, MU1] ; rien en natif chez Sage (alerte doublon demandée depuis 2023) [U SG32] | Runview, Control FEC, Conformexpert, module ECF de fulll, anomalies de Pennylane | Niveau de l'écriture et explication, dans le logiciel du cabinet |
| 7 | Commentaire du tableau de bord, chez les historiques, MyUnisoft, Inqom et Tiime | mensuelle ou trimestrielle, pour les clients sous mission | moyenne. Satisfaction 2021 sur les indicateurs Cegid : 1,75/3 [X1] ; copier-coller Excel [É/U CG37] | Commentaires saisis à la main [É AC24, MU7] | Pennylane et fulll (IA) ; IA annoncée chez Waibi | Production en série pour tout le portefeuille, à tester face aux historiques |
| 8 | Note de conseil pour l'associé, croisant chiffres et échanges | trimestrielle ou annuelle | faible : c'est un gain plutôt qu'une douleur | Signaux chiffrés seulement [É PL21, FU4, RC17] | Pennylane, fulll, RCA, Sesha, MyU Vision (annoncé) | Ajouter la lecture des échanges et rédiger une note |
| 9 | Facture électronique : dossiers à appeler, relances rédigées, clients sur une autre PA | campagne de 2026 à 2027 | forte mais temporaire | Les tableaux de bord PA suivent les statuts, mais les appels, les relances et les mandats hors outil restent à faire [É PL26, IQ16, FU8, RC21, DX18, MU21] | Tous les éditeurs PA ; cockpit Cabinet Digital | Seulement pour un portefeuille sur plusieurs PA ou logiciels ; fenêtre courte |
| 10 | Circularisation | annuelle, et rare chez les petits cabinets EC | moyenne | Aucun logiciel de production [D, CG14] | Confirmation.com, logiciels CAC | À traiter avec le périmètre CAC |

Observation transverse : en 2021, 35 % des cabinets utilisaient au moins deux outils de collecte et 50 % n'avaient qu'un seul éditeur [X1]. Chaque outil couvre son propre flux. Ce qu'aucun ne fait, c'est la synthèse au-dessus de plusieurs outils : pièces, échéances, e-mails, notes [D].

---

## 4. Questions à poser au cabinet

Le but est de savoir si son outil couvre la tâche, dans sa version et selon son usage réel.

**Questions générales (à poser en premier)**
1. Quel logiciel de production, quelle version, quel mode : installé, hébergé ou en ligne ? Par exemple Quadra Plus ou Loop, Génération Experts ou Coala, Expert Plus.
2. Quels modules sont souscrits (révision, liasse, portail, IA, plateforme agréée) ? Lesquels utilisez-vous vraiment, et sur combien de dossiers ?
3. Quelle part de vos clients utilise vraiment l'application ou le portail ? En nombre de dossiers actifs, pas en licences.
4. Pouvez-vous me montrer votre dernier dossier clôturé : où sont les feuilles de travail, les e-mails au client, les notes ?
5. Qu'est-ce qui passe encore par Excel, Word ou Outlook chaque mois, et chaque année ?
6. Utilisez-vous plusieurs outils (pré-compta, portail, plateforme agréée, tableaux de bord) ? Comment l'information passe-t-elle de l'un à l'autre ?

**relance-pieces**
- Quand une pièce manque, qui le voit, et comment le client est-il prévenu : notification de l'application, e-mail automatique, ou e-mail écrit par un collaborateur ?
- La relance nomme-t-elle chaque pièce (date, montant, tiers) ? Pouvez-vous me montrer la dernière envoyée ?
- Les pièces hors banque (contrats, tableaux d'emprunt, inventaire, attestations, relevés manquants) sont-elles demandées par l'outil ou à la main ?
- Combien de relances faut-il avant le bilan, et combien de temps par dossier ?

**controles-revision et cut-off**
- Le module de révision sert-il sur tous les dossiers ? Les feuilles de travail sont-elles préremplies, ou complétées dans Excel ?
- Le logiciel propose-t-il les FNP, FAE et CCA à partir des pièces, ou les calculez-vous ?
- Où notez-vous les points à trancher avec l'associé : dans l'outil, dans Word, par e-mail ?

**revue-ecritures**
- Analysez-vous toutes les écritures (FEC) avec un outil, ou par sondage sur la balance ?
- L'outil dit-il pourquoi une écriture est inhabituelle, ou seulement qu'un compte varie ?
- Utilisez-vous un outil d'analyse de FEC à part (Runview, Control FEC, Conformexpert, module ECF) ?

**liasse-fiscale**
- Quels contrôles fait votre logiciel avant l'envoi EDI, et que faites-vous des alertes ?
- Que ressaisissez-vous : capital, filiales, déficits, organisme de gestion agréé ?

**rappels-echeances-fiscales**
- Vos clients reçoivent-ils un rappel avant chaque échéance (TVA, acomptes d'IS, CFE) ? Qui l'envoie, et avec quel montant ?
- Où est tenu l'échéancier : dans le logiciel, côté cabinet seulement, ou dans un tableur ?

**tableau-de-bord-client**
- Combien de clients reçoivent un tableau de bord, et à quelle fréquence ?
- Qui écrit le commentaire, et en combien de temps ? Le logiciel propose-t-il un commentaire par IA, et l'utilisez-vous ?

**opportunites-conseil**
- Comment repérez-vous un besoin de conseil : alerte de l'outil, revue de l'associé, échanges avec le client ?
- Combien de missions avez-vous proposées l'an dernier à partir d'un signal de l'outil ?

**memoire-dossier**
- Quand un collaborateur part ou qu'un dossier change de main, où le repreneur trouve-t-il les particularités et les points de vigilance ?
- Qui tient les notes du dossier à jour ?

**boite-mail-triee**
- Combien d'e-mails clients par jour et par collaborateur ? Arrivent-ils dans Outlook, dans Gmail, ou dans l'outil ?
- Sont-ils rattachés automatiquement au dossier ? Qui décide de ce qui est urgent ?

**facture-electronique**
- Savez-vous, client par client, quelle plateforme agréée il a choisie, s'il figure à l'annuaire et si le mandat est signé ? Où le suivez-vous ?
- Combien de clients restent à convaincre, ou sont sur une autre plateforme ? Comment les relancez-vous ?

**confirmations-audit**
- Combien de missions d'audit par an ?
- Comment circularisez-vous (outil spécialisé, Confirmation.com, courrier Word), et qui suit les réponses ?

**Tâches candidates**
- Saisie : quelle part des pièces passe sans retouche ?
- TVA : le logiciel compare-t-il le chiffre d'affaires et la TVA collectée ?
- Plaquette et situation : où rédigez-vous l'annexe et les commentaires ?
- Prévisionnel : quel outil utilisez-vous ?
- Révision par IA : l'utilisez-vous vraiment, et sur quels dossiers ?
- Portail : quel est le taux d'adoption par vos clients ?

---

## 5. Limites et incertitudes

- **Recherche web plafonnée.** Le budget de recherche web de la session (200 recherches) a été épuisé le 06/10/2026, en début de travail. L'essentiel vient donc de pages ouvertes directement : sites, centres d'aide, plans de site, communiqués. Forums, LinkedIn, Reddit, YouTube, Capterra et Appvizer ont été très peu atteints. Les retours de terrain sont donc minces.
- **Pages illisibles.**
  - En JavaScript : Cegid Life, jefacture.com (ECMA), les nouveautés de Tiime.
  - Bloquées (erreur 403) : les pages produits de sage.com, les nouveautés de Pennylane, l'aide de Chaintrust.
  - Derrière une connexion (401) : l'article détaillé de fulll sur les points en suspens.
- **PDF non ouverts** (fiches produits ACD, kits presse), sur consigne. Exception : l'enquête IFEC 2021. WebFetch enregistre automatiquement sur le disque les PDF qu'il ouvre. Le dossier tool-results de la session en contient 27, créés entre 18:42 et 18:53 ; 3 viennent de cette recherche et peuvent être supprimés :
  - `/Users/kevinkitanga/.claude/projects/-Users-kevinkitanga-hermes/2d713acf-d493-4af6-8208-7e63ab3dd47e/tool-results/webfetch-1791305306758-6qc8wd.pdf` (IFEC 2021)
  - `/Users/kevinkitanga/.claude/projects/-Users-kevinkitanga-hermes/2d713acf-d493-4af6-8208-7e63ab3dd47e/tool-results/webfetch-1791305074156-4djic5.pdf` (TS Facture)
  - `/Users/kevinkitanga/.claude/projects/-Users-kevinkitanga-hermes/2d713acf-d493-4af6-8208-7e63ab3dd47e/tool-results/webfetch-1791305076237-jyc9yj.pdf` (kit presse ACD)
- **Documentation éditeur contre réalité.** Beaucoup de gestes viennent des pages des éditeurs et de témoignages qu'ils ont choisis. Aucune démonstration n'a été faite, et la disponibilité réelle par version n'est pas vérifiée. Exemples :
  - Cegid Pulse : agent TVA annoncé pour mi-septembre 2025, alors que la page Loop parle encore au futur.
  - Agiris SAMI : « disponible » sur la page produit, « en développement » dans l'entretien du 29/09/2026.
  - Pennylane Autopilot Révision : annoncé pour 12/2026.
  - MyU Vision : annoncé, disponibilité inconnue.
- **Quadra Plus et Expert Plus.** Révision, liasse et plaquette n'apparaissent pas sur les pages actuelles. Elles existent probablement par héritage [D], mais ce n'est pas vérifié. Leur statut « inconnu » ne signifie pas une absence.
- **Chiffres discordants selon les sources.**
  - Pennylane : 4 500, 6 000 ou 6 500 cabinets.
  - Tiime : 1 600, 2 000 ou 3 000.
  - fulll : 1 400, 1 600 ou près de 2 000.
  - ACD : 3 200 ou 3 500.
  - RCA : 33,1 M€ ou « 42 millions » de chiffre d'affaires.
- **Parts de marché.** Aucune source publique postérieure à 2021 n'a été trouvée. L'enquête IFEC est déclarative, faite par un syndicat, et antérieure à la montée des plateformes récentes.
- **Vérifications mot à mot.** Les résumés de WebFetch passent par un petit modèle. Ont été revérifiés mot à mot :
  - Pennylane : relances du 1er et du 15, Autopilot, commentaires par IA, Outlook, tableau de bord PA, absence de rappels d'échéances ;
  - fulll : points en suspens, analyse de Lya ;
  - ACD : i-Banque ;
  - Inqom : pièces manquantes ;
  - le fil Compta-Online sur le cut-off.
  
  Le reste est repris des rapports de recherche, qui citent leurs sources.
- **Cador** : non identifié.
- **Ce que disent les statuts.** Un statut « couvert » ne dit rien de l'usage réel dans un cabinet donné : d'où les questions de la section 4.

---

## Annexe : sources

Toutes consultées le 06/10/2026. La date entre parenthèses est la date de publication ou de mise à jour affichée, quand elle existe. « Maj sitemap » indique une date de modification lue dans un plan de site.

**Transverses (X), forums (FO) et autres**
- X1 IFEC, « Les outils numériques dans les cabinets : enquête », IFEC Mag n°69 : https://www.acd-groupe.fr/wp-content/uploads/2021/04/Dossier_Les_outils_numeriques_dans_les_cabinets_IFEC_MARS2021.pdf (1er trim. 2021) [U]
- X2 https://www.compta-online.com/editeurs-de-logiciels-comptables-ao8194 (11/11/2025) [U]
- X3 https://www.compta-online.com/comptatech-private-equity-licornes-ao8215 (19/09/2026) [U]
- X4 https://www.compta-online.com/les-acquisitions-entreprises-dans-ecosysteme-de-la-comptatech-ao4550 (28/09/2026) [U]
- X5 https://www.compta-online.com/acd-teamsystem-ao8524 (08/04/2026, partenariat ACD) [É]
- X6 https://www.compta-online.com/plateformes-agreees-facturation-electronique-ao6026 (maj 02/08/2026) [U]
- X7 https://www.compta-online.com/startups-innovantes-experts-comptables-ao8234 (26/11/2025) [U]
- X8 https://www.compta-online.com/agents-ia-en-cabinet-comptable-ao8933 (29/09/2026, partenariat Inqom) [É]
- X9 https://www.compta-online.com/ia-metier-en-cabinet-ao8932 (29/09/2026, partenariat Sage : Sage x Allia dans Génération Experts) [É]
- X10 https://www.compta-online.com/ia-en-cabinet-comptable-ao8909 (29/09/2026, partenariat Agiris) [É]
- X11 https://entreprendre.service-public.gouv.fr/vosdroits/F31808 (vérifiée le 11/08/2026) [O]
- X12 https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique (maj 01/09/2026) [O]
- X13 https://www.cabinetdigital.fr/facture-electronique/cockpit-cabinets/ [É Cabinet Digital]
- X14 https://www.cabinetdigital.fr/facture-electronique/mandat-de-designation/ [U]
- X15 https://www.cabinetdigital.fr/outils/annuaire-facture-electronique/ [U]
- X16 Catégories Cabinet Digital :
  - https://www.cabinetdigital.fr/categories/comptabilite_expert_comptable/
  - …/categories/analyse_de_donnees/
  - …/categories/audit/
  - …/categories/portail_client/
  - …/categories/saisie_automatisee_ocr/
  - …/categories/ged_cabinet/
  - …/categories/crm/
  
  [U]
- X17 Fiches Cabinet Digital (préfixe https://www.cabinetdigital.fr/logiciels/) : sesha, runview, control_fec, silverfin, finthesis, jedataviz, waibi, bilan_image, taxdome, mycabeo [U]
- X18 https://www.supervizor.com/ [É]
- X19 https://www.confirmation.com/ [É]
- X20 https://www.okimia.com/ (ex-fygr.io, © 2026) [É]
- X21 https://congres.experts-comptables.com/ (81e Congrès, 16-18/09/2026) [O]
- X22 https://tei.forrester.com/go/cegid/loop (étude Forrester commandée par Cegid, 07/2024 ; 4 cabinets interrogés ; gains annoncés : collecte +35 %, saisie +25 %, révision +20 %) [É]
- X24 https://www.qolaig.com/ [É]
- X25 https://www.runview.fr/ [É]
- X26 https://www.cabinetdigital.fr/actualites/ (« Qonto arrête Regate », 26/07/2026) [U]
- FO1 https://www.compta-online.com/cut-off-en-revision-votre-methode-t74756 (17-18/09/2026, vérifié mot à mot) [U]
- FO2 https://www.compta-online.com/comment-gerez-vous-les-documents-manquants-de-vos-clients-t74739 (01/09/2026) [U]
- FO3 https://www.compta-online.com/relance-clients-vos-methodes-t74729 (13/08/2026) [U]
- Q1 https://quickbooks.intuit.com/fr/ [É]
- I1 https://www.ibizasoftware.fr/ [D]
- PC1 https://www.idocus.com/ [É]
- PC2 https://www.sogescot.com/sobank/solution/ [É]
- PC3 https://www.getyooz.com/fr [É]

**Cegid (CG)** [É sauf mention contraire]
- Pages produits et IA :
  - CG1 https://www.cegid.com/fr/solutions/expertise-comptable/ (maj 05/10/2026)
  - CG3 https://www.shine.fr/experts-comptables/
  - CG4 https://www.shine.fr/experts-comptables/produits/cegid-loop
  - CG5 https://www.shine.fr/experts-comptables/produits/cegid-quadra-plus
  - CG6 https://www.shine.fr/experts-comptables/produits/cegid-expert-plus/
  - CG7 https://www.shine.fr/experts-comptables/cegid-conciliator/
  - CG8 https://www.shine.fr/experts-comptables/plateforme-agreee-shine
  - CG9 https://www.shine.fr/experts-comptables/shine-pour-vos-clients/
  - CG11 https://www.cegid.com/fr/produits/cegid-loop/cegid-flow/ (maj 05/08/2026)
  - CG12 https://www.cegid.com/fr/produits/portail-collaboratif/ (maj 08/12/2025)
  - CG13 https://www.cegid.com/fr/produits/cegid-portail-etafi/ (maj 05/08/2026)
  - CG14 https://www.cegid.com/fr/product-sitemap.xml
  - CG16 https://www.cegid.com/fr/ia/experts-comptables/ (maj 29/06/2026)
- Facture électronique :
  - CG17 https://www.cegid.com/fr/facture-electronique-obligatoire/pdp/ (maj 25/08/2026)
  - CG18 https://www.cegid.com/fr/facture-electronique-obligatoire/experts-comptables/ (maj 24/06/2026)
- Communiqués :
  - CG20 https://www.cegid.com/fr/presse/cegid-annonce-lintegration-native-de-la-pdp-de-cegid-dans-les-solutions-de-cegid-et-debp-a-destination-des-experts-comptables-et-de-leurs-clients/ (15/04/2025)
  - CG21 https://www.cegid.com/fr/presse/facture-electronique-ia-et-services-digitaux-cegid-confirme-son-avance-pour-elever-le-potentiel-des-experts-comptables-avec-une-serie-dinnovations-majeures/ (01/07/2025)
  - CG22 https://www.cegid.com/fr/presse/cegid-perspectives-monaco-2025-le-rendez-vous-privilegie-pour-accompagner-la-profession-comptable-dans-sa-transformation-a-lere-de-lia/ (30/10/2025)
  - CG23 https://www.cegid.com/fr/presse/cegid-acquiert-shine/ (26/11/2025)
  - CG24 https://www.cegid.com/fr/presse/cegid-annonce-les-nouvelles-fonctionnalites-de-cegid-tax-flex/ (03/02/2026)
  - CG25 https://www.cegid.com/fr/presse/cegid-et-silae-annoncent-leur-rapprochement-pour-creer-un-leader-technologique-europeen-porte-par-lintelligence-artificielle/ (09/09/2026)
- Blog, aide et événements :
  - CG29 https://help.shine.fr/fr/articles/2998190-associer-des-justificatifs-a-mes-recettes-et-depenses (maj 25/06/2025)
  - CG30 https://www.shine.fr/blog/revision-continue-cabinet-expertise-comptable (redirigé depuis cegid.com/fr/blog/revision-continue/, maj 19/01/2026)
  - CG31 https://www.shine.fr/blog/souverainete-cabinet-shine-cegid/
  - CG33 https://www.cegid.com/fr/lpm/cpa-event-shine-x-cegid-expert-day-2026/
- Témoignages publiés par l'éditeur [É/U], préfixe https://www.shine.fr/blog/ :
  - CG36 cas-client-logiciel-cegid-loop-revision-gain-de-temps-cabinet-obconseil
  - CG37 cas-client-loop-conseil-cabinet-some-associes/ (26/06/2023)
  - CG38 cas-client-kpmg-nord
  - CG39 cas-client-cabinet-revalen-cegid-loop
  - CG40 cas-client-temoignage-cegid-loop-evolutions-2020-2
  - CG41 cas-client-le-cabinet-william-denis-et-associe-economise-entre-50-et-60-du-temps-de-traitement-des-pieces-grace-a-cegid-loop
  - CG42 cas-client-cabinet-comptable-jpa-cegid-loop
  - CG46 cas-client-hma-expertise-comptable-cegid-conciliator
  - CG47 cas-client-cabinet-adezio-cegid-conciliator
- Avis :
  - CG50 https://fr.trustpilot.com/review/www.cegid.com (2,5/5, 379 avis) [U]

**ACD (AC)** [É sauf mention contraire]
- Pages produits :
  - AC1 https://www.acd-groupe.fr/
  - AC3 https://www.acd-groupe.fr/solution-expert-comptable/acd-compta/
  - AC4 https://www.acd-groupe.fr/solution-collaborative/modules-comptabilite/
  - AC5 https://www.acd-groupe.fr/solution-expert-comptable/acd-ged/
  - AC6 https://www.acd-groupe.fr/solution-expert-comptable/acd-grc/
  - AC7 https://www.acd-groupe.fr/solution-expert-comptable/acd-gi/
  - AC9 https://www.acd-groupe.fr/facture-electronique/
  - AC27 https://www.acd-groupe.fr/cours-en-ligne/
- Actualités (préfixe https://www.acd-groupe.fr/) :
  - AC10 2022/12/01/par-ici-pour-decouvrir-les-nouveautes-2022/ (01/12/2022)
  - AC11 2025/02/24/des-avancees-technologiques-au-service-de-la-productivite-du-cabinet/ (24/02/2025, vérifié mot à mot)
  - AC14 2025/07/30/decouvrez-comment-acd-fact-transforme-votre-gestion-des-factures-en-une-experience-intuitive-et-automatisee/ (30/07/2025)
  - AC16 2025/09/09/explorez-linnovation-acd-au-80e-congres-de-lordre/ (09/09/2025)
  - AC18 2025/10/31/acd-x-waibi-transformez-les-donnees-en-levier-strategiques-pour-vos-clients/ (31/10/2025)
  - AC19 2026/01/19/facture-electronique-inscription-pa-lvc/ (19/01/2026)
  - AC20 2026/03/05/intelligence-artificielle-production-comptable/ (05/03/2026)
  - AC21 2026/02/04/dernieres-interconnexions-fevrier-2026/ (04/02/2026)
  - AC22 2026/03/19/dernieres-interconnexions-mars-2026/ (19/03/2026)
  - AC23 2026/04/08/communique-acd-rejoint-le-geant-technologique-teamsystem/ (08/04/2026)
  - AC24 2026/09/07/decouvrez-loffre-waibi-essentiel-des-indicateurs-cles-directement-integres-a-votre-portail-client-i-suite-expert/ (07/09/2026)
  - AC28 2024/10/04/nouvelle-facon-de-collaborer-avec-vos-clients/ (04/10/2024)
- Sources tierces :
  - AC29 https://www.isiconcept.fr/fr/solutions-cabinet-comptable/suite-expert.html [U, revendeur]
  - AC30 https://www.intelligentcio.com/eu/2026/04/08/teamsystem-expands-in-france-and-turkiye-with-acd-and-dia-yazilim-acquisitions/ (08/04/2026) [U]
  - AC32a https://www.acd-groupe.fr/wp-content/uploads/2023/02/FP-ComptabiliteExpert_fevrier2023.pdf (extrait de recherche, PDF non ouvert)

**Sage (SG)** [É sauf mention contraire]
- SG1 Pages produits Coala et Génération Experts sur sage.com : 403 ; seulement vues en extrait de recherche.
- SG5 à SG22 : base de connaissances, préfixe https://fr-kb.sage.com/portal/app/portlets/results/viewsolution.jsp?solutionid=
  - SG5 251017092718293 (maj 07/09/2026)
  - SG7 251126071452180 (02/12/2025)
  - SG8 260112123330377 (29/01/2026)
  - SG9 260204094240973 (10/02/2026)
  - SG10 260323082245547 (02/04/2026)
  - SG11 260430122759717 (05/05/2026)
  - SG12 260703130741527 (09/07/2026)
  - SG13 260818124318110 (20/08/2026)
  - SG14 260907115228487 (10/09/2026)
  - SG15 260616070208077 (16/06/2026)
  - SG16 260331132705887 (maj 11/09/2026)
  - SG17 260604130839710 (maj 11/09/2026)
  - SG20 250926074300407
  - SG21 260204075251387
  - SG22 241010074607237 (maj 22/04/2026)
- Communauté et retours utilisateurs, préfixe https://communityhub.sage.com/fr/sage-generation-experts-connect/f/ :
  - SG26 annonces/271781 (≈ 08/2026)
  - SG27 facture-electronique/271354 (≈ 08/2026) [U]
  - SG28 sage-production-comptable-discussion-generale/271150/lettrage (≈ 09/2026) [U]
  - SG36 sage-production-comptable-discussion-generale/267505/comptes-non-parametres (≈ 06/2026) [U]
- SG32 https://sagegenerationexpertfrsuggestions.ideas.aha.io/ (portail d'idées des utilisateurs, idées de 2023-2024) [U]
- SG33 AutoEntry :
  - https://help.autoentry.com/fr/articles/12538551-integration-avec-generation-experts
  - …/16597692-guide-pour-les-clients-du-cabinet
  - …/9065462-guide-de-demarrage-pour-les-utilisateurs-de-sage-for-accountants

**RCA (RC)** [É sauf mention contraire]
- Site et MEG :
  - RC1 https://www.rca.fr/
  - RC2 https://rca.fr/lesprit-rca/
  - RC5 https://www.lejournaldesentreprises.com/breve/lediteur-de-logiciels-pour-les-experts-comptables-rca-ouvre-son-capital-quilvest-2068500 (15/09/2023) [U]
  - RC8 https://rca.fr/meg-mon-expert-en-gestion/pre-comptabilite/
  - RC9 https://rca.fr/meg-mon-expert-en-gestion/pilotage/
  - RC10 https://rca.fr/meg-mon-expert-en-gestion/facture-electronique/
  - RC11 https://rca.fr/meg-mon-expert-en-gestion/meg-pour-mes-clients/
  - RC12 https://rca.fr/ressources/pilotage-cabinet-plus-de-visibilite-plus-dimpact-client/ (23/02/2026)
  - RC13 https://rca.fr/nouveautes-coec/ (Congrès 2026)
- Logiciels Experts :
  - RC14 https://rca.fr/logiciels-experts/tableau-de-bord/
  - RC15 https://rca.fr/logiciels-experts/bilan-image/
  - RC16 https://rca.fr/logiciels-experts/previsionnel/
  - RC17 https://rca.fr/logiciels-experts/diagnostic-operationnel/
  - RC18 https://rca.fr/logiciels-experts/mapi/
- Offres et ressources :
  - RC20 https://rca.fr/offres/
  - RC21 https://rca.fr/ressources/organisez-votre-cabinet-avec-ce-kit-complet-facture-electronique/ (17/11/2025, maj 07/05/2026)

**Agiris / Isagri (AG)** [É]
- AG1 https://www.agiris.fr/
- AG2 https://www.isagri.fr/
- AG3 https://www.agiris.fr/logiciel/isacompta
- AG4 https://www.agiris.fr/logiciel/isarevise-connect
- AG5 https://www.agiris.fr/logiciel/amicompta
- AG6 https://www.agiris.fr/logiciel/portail-agiris-connect
- AG7 https://www.agiris.fr/logiciel/bobbee-by-agiris
- AG8 https://www.agiris.fr/logiciel/efacture
- AG9 https://www.agiris.fr/logiciel/isagi-connect
- AG10 https://www.agiris.fr/logiciel/mon-coach
- AG11 https://www.agiris.fr/logiciel/io-ecf
- AG12 https://www.agiris.fr/solutions/ged
- AG16 = X10
- AG19 https://www.agiris.fr/logiciels-expert-comptable

**EBP (EB)** [É]
- EB1 https://www.ebp.com/a-propos/
- EB2 https://www.ebp.com/logiciel-expert-comptable/
- EB3 https://www.ebp.com/logiciel-expert-comptable/solution-production/
- EB4 https://www.ebp.com/pdp-plateforme-dematerialisation-partenaire/

**Welyb (WE)** [É]
- WE1 https://www.welyb.fr/
- WE2 https://www.welyb.fr/clients/professionnels-du-chiffre-tarifs
- WE3 https://www.welyb.fr/services/collecte-des-factures
- WE4 https://www.welyb.fr/services/facturation-electronique

**Pennylane (PL)** [É sauf mention contraire]. « help/ » = https://help.pennylane.com/fr/articles/
- Pages produits et offres :
  - PL1 https://www.pennylane.com/fr/expert-comptable/ia
  - PL5 https://www.pennylane.com/fr/expert-comptable/ged-collaboration
  - PL6 https://www.pennylane.com/fr/expert-comptable/saisie
  - PL7 https://www.pennylane.com/fr/expert-comptable/revision
  - PL21 https://www.pennylane.com/fr/expert-comptable/crm-portail
  - PL28 https://www.pennylane.com/fr/expert-comptable/pdp
  - PL37 https://www.pennylane.com/fr/blog/contenu-expert-comptable/cno-2023-questions-pennylane (13/06/2024)
  - PL39 https://www.pennylane.com/fr/expert-comptable
  - PL42 https://www.pennylane.com/fr/blog/produit/cadrage-tva (13/06/2024)
  - PL45 https://www.pennylane.com/fr/expert-comptable/fonctionnalites-clients
- Centre d'aide — automatisations et saisie :
  - PL3 help/523853-utiliser-autopilot-saisie (vérifié mot à mot)
  - PL4 help/847844-decouvrir-les-automatisations-et-autopilot
  - PL55 help/18636-repondre-aux-demandes-du-cabinet-d-expertise-comptable (maj « cette semaine », vérifié mot à mot)
- Centre d'aide — révision :
  - PL8 help/18699-utiliser-le-dossier-de-travail
  - PL9 help/816701-creer-un-dossier-de-travail-a-partir-d-un-modele-et-appliquer-les-seuils (03/09/2026)
  - PL10 help/23593-utiliser-les-feuilles-de-travail-dans-le-dossier-de-travail (31/08/2026)
  - PL11 help/377709-utiliser-les-automatisations-de-revision-incluses-hors-autopilot
  - PL12 help/449651-superviser-les-comptes-dans-pennylane
  - PL29 help/18719-fonctionnement-des-modules-fae-et-fnp
  - PL30 help/18782-fonctionnement-des-modules-pca-et-cca (03/09/2026)
  - PL46 https://help.pennylane.com/fr/collections/712166-immobilisations
- Centre d'aide — déclarations et états :
  - PL15 help/251130-completion-des-formulaires-de-la-liasse-fiscale-pennylane-et-teledec
  - PL16 help/108858-faq-liasse-fiscale
  - PL17 help/18706-suivre-les-echeances-des-declarations-et-de-cloture (04/09/2026, vérifié mot à mot)
  - PL18 help/18597-consulter-toutes-les-declarations (01/09/2026)
  - PL31 help/18649
  - PL32 help/806481-creer-archiver-et-comparer-une-situation-intermediaire (04/09/2026)
- Centre d'aide — rapports, collaboration et e-mails :
  - PL19 help/837305 (vérifié)
  - PL20 help/819330 (vérifié mot à mot)
  - PL22 help/836992-suivre-l-ensemble-de-vos-clients-depuis-le-portefeuille-clients
  - PL23 help/420119-utiliser-le-centre-de-collaboration
  - PL24 help/634162-connecter-outlook-et-echanger-des-e-mails (vérifié)
  - PL25 help/679279-analyser-automatiquement-les-e-mails-outlook-de-vos-clients (vérifié)
  - PL34 help/523947-utiliser-l-ia-dans-pennylane
- Centre d'aide — plateforme agréée :
  - PL26 help/527818 (vérifié)
  - PL27 help/533950 (28/07/2026)
- Sources tierces :
  - PL47 https://lessentieldeleco.fr/5521-pennylane-les-secrets-dune-croissance-eclair/ (23/01/2026) [U]

**Tiime (TI)** [É sauf mention contraire]. « hs/ » = https://tiime-expert.helpscoutdocs.com/
- Pages produits et offres :
  - TI3 https://www.tiime.fr/ec/pre-compta
  - TI6 https://www.tiime.fr/ec/garder-ma-prod
  - TI8 https://blog.tiime.fr/ec/tiime-change-de-modèle-et-devient-gratuit (03/09/2024)
  - TI9 https://www.tiime.fr/tiime-qui-sommes-nous
  - TI11 https://support.tiime.fr/fr/articles/26357-qui-sommes-nous-chez-tiime (22/07/2026)
  - TI13 https://www.compta-online.com/tiime-plateforme-agreee-gratuite-ao8838 (25/08/2026) [U]
  - TI40 https://blog.tiime.fr/ec/valorisez-vos-données-comptables-pour-développer-vos-nouvelles-missions (16/07/2025)
- Aide cabinet — demandes et relances :
  - TI17 hs/article/376-demander-un-justificatif-client-a-partir-transaction (15/01/2026)
  - TI18 hs/article/359-demander-informations-transaction (28/05/2025)
  - TI19 hs/article/693-comment-envoyer-une-relance-a-mon-client-concernant-les-demandes-dinformations (03/02/2026)
  - TI20 hs/article/660 (07/07/2025)
  - TI21 hs/article/676 (03/06/2025)
  - TI22 https://support.tiime.fr/fr/articles/26215-onglet-a-faire-echanges-avec-votre-expert-comptable
- Aide cabinet — dossier de travail et révision :
  - TI24 hs/category/451-dossier-de-travail
  - TI25 hs/article/577 (03/02/2026)
  - TI26 hs/article/533 (02/03/2026)
  - TI29 hs/article/350-controle-coherence-balance (29/10/2025)
  - TI36 hs/article/602-fournisseurs-dus (20/05/2026)
  - TI37 hs/category/450-modules-de-bilan
- Aide cabinet — déclarations et plannings :
  - TI30 hs/article/549 (03/06/2025)
  - TI31 hs/category/458-declarations-fiscales
  - TI32 hs/article/431 (02/06/2025)
  - TI33 hs/article/424 (18/11/2025)
  - TI34 hs/category/452-planning
  - TI35 https://support.tiime.fr/fr/articles/502859-declarer-votre-tva-depuis-tiime
- Aide cabinet — états, notes et pilotage :
  - TI38 hs/article/409 (02/06/2025)
  - TI39 hs/article/528 (02/06/2025)
  - TI41 hs/article/712 (02/03/2026)
  - TI42 hs/article/398 (02/06/2025)
  - TI45 https://support.tiime.fr/fr/collections/1295211-piloter-et-analyser-mon-activite
- Aide cabinet — plateforme agréée :
  - TI43 hs/article/692 (21/09/2026)
  - TI44 hs/article/697 (09/04/2026)

**MyUnisoft (MU)** [É sauf mention contraire]. myunisoft.fr redirige vers myu.fr
- Fonctionnalités, préfixe https://myu.fr/cabinet-comptable/fonctionnalites/ :
  - MU1 revision-comptable/ (maj sitemap 01/10/2026)
  - MU2 logiciel-comptabilite-expert-comptable/ (maj sitemap 20/08/2026)
  - MU3 logiciel-liasse-fiscale/
  - MU4 mcp-ia-production-comptable/ (maj sitemap 01/10/2026)
  - MU6 logiciel-tableaux-de-bord/
  - MU7 rapport-presentation-bilan-comptable/
  - MU9 logiciel-business-plan-previsions/
- Logiciels, besoins et feuille de route, préfixe https://myu.fr/cabinet-comptable/ :
  - MU8 logiciels/myu-pilotage-financier/
  - MU10 logiciels/myu-production-comptable-fiscale/ (maj sitemap 30/09/2026)
  - MU11 roadmap-produits/ (maj sitemap 06/10/2026)
  - MU22 besoins/gestion-dossiers-clients/
  - MU24 besoins/logiciel-automatisation-comptable/
  - MU26 besoins/automatisation-questionnaire-lab/
- Communiqués et articles, préfixe https://myu.fr/cabinet-comptable/ressources/ :
  - MU12 communiques-de-presse/congres-experts-comptables-2026-myunisoft-ia-cabinets/ (03/09/2026)
  - MU13 communiques-de-presse/myunisoft-plateforme-agreee-facturation/ (29/01/2026)
  - MU14 articles/ia-logiciel-myunisoft/ (15/06/2026)
- MU15 https://myu.fr/services/myupdate-nouveautes-produits/ (MyUpdate, 09/09/2026)
- Centre d'aide :
  - MU16 https://support.myunisoft.fr/fonctionnement-du-flag-info/pj (nouveauté d'octobre 2025)
  - MU17 https://support.myunisoft.fr/comment-fonctionne-longlet-discussions
  - MU18 https://support.myunisoft.fr/les-diff%C3%A9rents-commentaires-disponibles
  - MU19 https://support.myunisoft.fr/int%C3%A9gration-de-la-console-de-personnalisation-des-mod%C3%A8les-du-dossier-de-r%C3%A9vision (28/10/2025)
  - MU20 https://support.myunisoft.fr/facture-%C3%A9lectronique-et-pa-myunisoft
  - MU21 https://support.myunisoft.fr/comment-verifier-mon-inscription-a-la-pa
  - MU36 https://support.myunisoft.fr/production-comptable-et-fiscale
- Société et presse :
  - MU28 https://myu.fr/qui-sommes-nous/ (maj sitemap 01/10/2026)
  - MU30 https://www.cfnews.net/L-actualite/Exclusif-CFNEWS/MyUnisoft-integre-les-comptes-d-un-fonds-paneuropeen-523278 (19/03/2025) [U]

**Inqom (IQ)** [É]. « help » = https://help.inqom.com/fr/
- Site et marques :
  - IQ2 https://www.inqom.com/expert/
  - IQ3 https://www.inqom.com/gestion/
  - IQ4 https://www.inqom.com/facturation-electronique/
  - IQ6 https://www.agentix.fr/ (18/03/2026)
  - IQ20 https://www.visma.com/brands
- Centre d'aide :
  - IQ7 help/les-pi%C3%A8ces-manquantes (07/2024, vérifié)
  - IQ9 help/la-transmission-des-pi%C3%A8ces-comptables (07/2024)
  - IQ10 help/r%C3%A9vision-p%C3%A9riodique (12/2024)
  - IQ11 help/r%C3%A9vision-en-continu
  - IQ12 help/les-cut-off
  - IQ13 help/tva
  - IQ14 help/portail-d%C3%A9claratif-liasse
  - IQ15 help/le-portail-t%C3%A9l%C3%A9d%C3%A9claratif (06/2024)
  - IQ16 help/suivre-les-inscriptions-%C3%A0-la-plateforme-agr%C3%A9%C3%A9e (07/2026)
  - IQ18 help/inqom-copilot
- Notes de version, préfixe help/les-nouveaut%C3%A9s-de-la-version- :
  - IQ-V159 4.159-de-lapplication-inqom-15/12/2025
  - IQ-V163 4.163-de-lapplication-inqom-23/01/2026
  - IQ-V168 4.168-de-lapplication-inqom-27/03/2026
  - IQ-V170 4.170-de-lapplication-inqom-24/04/2026
  - IQ-V179 4.179-de-lapplication-inqom-21/08/2026
  - IQ-V180 4.180-de-lapplication-inqom-18/09/2026
  - IQ-V182 4.182-de-lapplication-inqom-02/10/2026

**fulll (FU)** [É sauf mention contraire]
- Site, préfixe https://www.fulll.fr/ :
  - FU2 production-comptable
  - FU3 outils/revision-en-continu
  - FU4 intelligence-artificielle
  - FU5 pre-compta
  - FU6 espace-collaboratif
  - FU7 analyse-et-conseil (vérifié)
  - FU8 facturation-electronique
  - FU9 pilotage-cabinet
  - FU10 croissance-cabinet
  - FU11 outils/ecf
  - FU12 reconciliation-et-lettrage-automatises
  - FU13 tarifs
  - FU14 notre-mission
- Centre d'aide :
  - FU18 https://aide.fulll.io/fr/articles/571311-acces-aux-points-en-suspens-depuis-le-menu-comptabilite (26/02/2026, vérifié mot à mot)
  - FU20 https://aide.fulll.io/fr/articles/540478-comprendre-la-reconciliation (24/06/2026)
- Presse :
  - FU21 https://www.compta-online.com/visma-fulll-in-extenso-ao8450 (10/03/2026) [U]
  - FU22 https://www.compta-online.com/fulll-pdp-experts-comptables-ao7966 (16/07/2025) [U]
  - FU27 https://www.solutions-numeriques.com/decideur-entreprise/fulll-se-veut-une-plateforme-complete-de-gestion-comptable-fiscale-et-sociale/ (extrait de recherche) [U]

**Dext (DX)** [É sauf mention contraire]
- Pages produits et tarifs :
  - DX1 https://dext.com/fr/cabinet/tarifs/expertise-comptable
  - DX2 https://dext.com/fr/cabinet/produits/saisie-comptable
  - DX4 https://dext.com/fr/cabinet/produits/agent-ia-comptable
  - DX5 https://dext.com/fr/cabinet/produits/logiciel-ged
  - DX6 https://dext.com/fr/cabinet/produits/logiciel-facturation-electronique
- Centre d'aide :
  - DX7 https://help.dext.com/fr/articles/212767-comment-faire-une-demande-de-factures-manquantes-via-la-banque (10/08/2026)
  - DX8 https://help.dext.com/fr/articles/215760-rapprocher-une-transaction-avec-une-ou-plusieurs-factures-dans-dext-cabinets (13/08/2026)
  - DX14 https://help.dext.com/fr/articles/817973-que-peuvent-verifier-et-modifier-les-instructions-d-assistant-ia (01/09/2026)
  - DX17 https://help.dext.com/fr/articles/456600-facture-electronique-gerer-la-designation-dext-pour-les-cabinets
  - DX18 https://help.dext.com/fr/articles/724240-preparer-ses-clients-a-la-facture-electronique
- Site britannique :
  - DX20 https://dext.com/uk/partner/product/ensure-client-data-health
  - DX22 https://dext.com/uk/partner/pricing
- Témoignage :
  - DX23 https://dext.com/fr/ressources/cas-clients-temoignages/compta (non daté) [É/U]

**Chaintrust (CT)** [É]
- CT1 https://www.chaintrust.io/tarif/
- CT2 https://www.chaintrust.io/a-propos/
- CT3 https://www.chaintrust.io/saisie-comptable/
- CT4 https://www.chaintrust.io/saisie-comptable/fonctionnalites/recuperation-bancaire/
- CT5 https://www.chaintrust.io/saisie-comptable/fonctionnalites/ged/
- CT6 https://www.chaintrust.io/saisie-comptable/fonctionnalites/application-mobile/
- CT7 https://www.chaintrust.io/plateforme-agreee-chaintrust/
- CT8 https://www.chaintrust.io/blog/la-tech-dans-la-compta/automatisation-comptable-facturation-electronique-bilan-chaintrust-2025/
- CT12 https://www.chaintrust.io/blog/actualites/facturation-electronique-le-positionnement-de-chaintrust/
- CT13 https://www.chaintrust.io/blog/actualites/chaintrust-devient-la-plateforme-agreee-du-groupe-visma/
- CT15 https://www.cabinetdigital.fr/logiciels/chaintrust/ [U]
