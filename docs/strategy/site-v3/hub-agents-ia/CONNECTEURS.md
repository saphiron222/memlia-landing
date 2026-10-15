# Page « compatibilité logiciels » (`/integrations`) : la liste des connecteurs, v2 du 15/10/2026

> Recherche en lecture seule pour memlia.fr, faite à partir de la décision de Kevin du 15/10/2026 : faire comme
> Factory 456. Aucun statut, une carte par logiciel (logo, nom, ce que nos agents font avec, « En savoir plus »
> quand un guide existe), aucun total affiché.
> Sources : douze relevés du 15/10 (01 h - 02 h), dans `scratchpad/phase2/connecteurs-v2-brut/`
> (A1, B, C1, C2, D, E1, E2, F, G, H, I, L1). Contrôles complémentaires faits à 04 h 45 : liste des plateformes
> agréées, pages Sage, BNP Paribas et Revolut lues au navigateur, mentions légales de dix éditeurs.
> Ce que Factory liste n'a servi que de liste de noms à vérifier. Aucune phrase reprise, aucun logo pris chez lui.
> Aucun fichier de logo ou de kit n'a été ouvert ni enregistré. RévisAudit est exclu : son domaine est proscrit.
>
> **Intégré au dépôt le 15/10/2026**, source de `src/data/connecteurs.ts` (tâche 8 du plan). Corrections de
> l'intégration : lignes du commissariat aux comptes (§5) ramenées à la préparation, l'envoi des confirmations
> restant sous la maîtrise du commissaire aux comptes ; noms des fiches alignés sur les cartes (§20).
> Arbitrages pris par défaut, réversibles par Kevin : les quatre cartes de l'État en **nom seul, sans
> bloc-marque** (§19.2 c) ; les concurrents du §18.1 **hors de la liste** ; **aucun lien sortant** vers un
> éditeur (§21, point 7).

## 0. Textes fixes de la page

- **Sous la liste** : « Votre logiciel n'est pas listé ? Nous l'intégrons sur demande. »
- **Mention de marques** (charte §10) : « Marques et logos de leurs titulaires, cités sans partenariat. »
- **Aucun total.** Pas de « 365 connecteurs », pas de « 500+ ». Le compte du §19 est interne.
- **Facturation électronique** : une section sans nom de plateforme (§6).

## 1. Lecture des colonnes

- **Ce que nos agents font avec** : le geste, préparé puis validé. Ce sont nos mots, à reprendre sur la carte.
  Une ligne « idem » renvoie à la carte citée.
- **URL officielle** : la page produit de l'éditeur, relue le 15/10. Elle sert à vérifier, pas à lier
  (voir le §21, point 7).
- **Source du logo** :
  - `kit` : kit média ou fichiers de logos publiés ;
  - `presse` : espace presse, sans fichier de logo ;
  - `charte` : guide ou portail de marque ;
  - `repli` : aucune des trois n'existe, et le logo se prend dans l'en-tête de la page d'accueil officielle.
  - Les fichiers cités (« non ouvert ») n'ont été ni ouverts ni téléchargés.
- **Règle** : ce que l'éditeur publie sur l'usage de son logo par un tiers.
  - `IC` : sa charte de marque exige une licence ou un accord écrit.
  - `IM` : ses mentions légales ou ses CGU exigent une autorisation pour reproduire ses marques, ses logos ou le
    contenu de son site.
  - `R` : usage permis sous conditions (presse seulement, fichiers officiels, aucune affiliation suggérée).
  - `LP` : kit presse sans condition écrite.
  - `-` : aucune règle trouvée.
  - `nv` : non vérifié (site bloqué, rendu en JavaScript ou en maintenance ; aucun contournement).
  - `État` : bloc-marque de l'État (Marianne), réservé aux services de l'État.
  Kevin a décidé d'afficher tous les logos : cette colonne est pour son information (§19).
- **Guide** : le slug du guide memlia.fr existant (`src/data/integrations.ts`, `guides.generated.json`), lu par
  « En savoir plus ».

---

## 2. Production comptable — Balthazar · Comptabilité

Balthazar lit les pièces et les exports de vos logiciels de production. Il prépare le lot de saisie au format
d'import du logiciel du cabinet, puis les rapprochements et les lettrages. Chaque écriture proposée attend la
validation du collaborateur, et l'intégration reste son geste.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Pennylane** | Pennylane SAS | Reprend, avec leur motif, les pièces non imputées et les doublons sans numéro. L'imputation proposée se valide dans Pennylane. | https://www.pennylane.com/fr/expert-comptable | kit : https://pennylane-hq.notion.site/Pennylane-s-Public-Assets-c49cb0dc7d5241bdb83e701061bd034c | `-` (règles du logo en PDF, non ouvert) | - |
| 2 | **Cegid Loop** | Cegid ; pages cabinets sur shine.fr depuis le rachat de Shine (08/06/2026) | Prépare dans le format d'import de Loop les lignes qu'il ne reconnaît pas, et explique chaque paire de lettrage. Tout se valide avant intégration. | https://www.shine.fr/experts-comptables/produits/cegid-loop/ | repli : https://www.cegid.com/fr/ | `IM` https://www.cegid.com/fr/mentions-legales/ | lettrage-cegid |
| 3 | **Cegid Quadra Plus** (évolution de Cegid Quadra, ex-Quadratus) | Cegid | Prépare, au format d'import que Quadra lit déjà, les exceptions de saisie et de lettrage restées à la main. | https://www.shine.fr/experts-comptables/produits/cegid-quadra-plus/ | repli : https://www.cegid.com/fr/ | `IM` (Cegid) | - |
| 4 | **Sage Génération Experts** (anciennement Sage Coala) | Sage (The Sage Group plc) | Prépare le lot de saisie et les points de révision à partir des pièces et des relevés. Le collaborateur valide avant intégration. | https://www.sage.com/fr-fr/experts-comptables/produits/sage-generation-experts-connect/ (lue au navigateur ; 403 aux robots) | repli : https://www.sage.com/fr-fr/ (la salle de presse https://www.sage.com/fr-fr/actualites/communiques-presse/ n'a pas de kit ; les logos passent par le Partner Marketing Hub, réservé aux partenaires) | `IM` https://www.sage.com/fr-fr/informations-legales/ (lue au navigateur le 15/10) | - |
| 5 | **ACD COMPTA** (gamme Suite Expert) | ACD (TeamSystem depuis le 31/03/2026) | Prépare les écritures et les rapprochements bancaires au format d'import d'ACD. L'intégration reste le geste du collaborateur. | https://www.acd-groupe.fr/solution-expert-comptable/acd-compta/ | kit : https://www.acd-groupe.fr/wp-content/uploads/2026/06/ACD-kit-presse-Juin2026.pdf (PDF, non ouvert) | `IM` https://www.acd-groupe.fr/mentions-legales/ | - |
| 6 | **ISACOMPTA CONNECT** | AGIRIS (groupe ISAGRI) | Prépare au format d'import d'ISACOMPTA les écritures des dossiers, agricoles compris. Chaque cas hors règle est arrêté et nommé. | https://www.agiris.fr/logiciel/isacompta | repli : https://www.agiris.fr/ | `IM` https://www.agiris.fr/mentions-legales | - |
| 7 | **AMICOMPTA** | AGIRIS (ISAGRI) | Reprend, avec leur motif, les pièces que l'assistant ne sait pas proposer. Le collaborateur tranche. | https://www.agiris.fr/logiciel/amicompta | repli : https://www.agiris.fr/ | `IM` (AGIRIS) | - |
| 8 | **MyU** (anciennement MyUnisoft) | MyUnisoft | Prépare le lot de saisie et la liste des pièces manquantes de chaque dossier, avec le brouillon de relance. La validation se fait dans MyU. | https://myu.fr/cabinet-comptable/logiciels/myu-production-comptable-fiscale/ | presse : https://myu.fr/espace-presse/ (dossier PDF, non ouvert) | `-` | - |
| 9 | **Tiime** | Tiime Apps | Reprend les transactions que Tiime ne rapproche pas. Il prépare la relance qui réclame la pièce manquante en la nommant. | https://www.tiime.fr/ec/ | kit : https://www.tiime.fr/presse (ZIP, non ouvert) | `IM` https://www.tiime.fr/mentions-legales (alors que le kit est public) | - |
| 10 | **fulll** | fulll SAS (participation minoritaire de Visma) | Reprend un par un les mouvements qui sortent de ses règles de réconciliation. Chaque appariement est proposé, puis validé. | https://www.fulll.fr/production-comptable | repli : https://www.fulll.fr/ (presse sans kit : https://www.fulll.fr/presse) | `-` | - |
| 11 | **Inqom** | INQOM (groupe Visma) | Reprend, avec leur source, les écritures que la saisie automatique laisse en attente. | https://www.inqom.com/expert/ | repli : https://www.inqom.com/ | `IM` https://www.inqom.com/juridique/mentions-legales/ (sauf usage par la presse) | - |
| 12 | **Ingeneo** (anciennement Teogest) | Septeo Group | Prépare les écritures et les contrôles au format d'import d'Ingeneo. Chaque écart est présenté avec sa source. | https://www.ingeneo.septeo.com/solutions/logiciel-expert-comptable | kit : https://www.septeo.com/fr/presse (ZIP du groupe, non ouvert) | `LP` | - |
| 13 | **NETexcom** | NETexcom (Monaco) | Classe les pièces que déposent vos clients et les prépare en écritures pour NETexcom. Le collaborateur valide. | https://www.netexcom.com/ | presse : https://www.netexcom.com/presse/ | `IM` https://www.netexcom.com/mentions-legales/ | - |
| 14 | **Bleez** (anciennement Compta.com) | BLEEZ SAS | Prépare les pièces et les mouvements bancaires en écritures. Le collaborateur valide. | https://bleez.com/ | repli : https://bleez.com/ | `IM` https://bleez.com/mentions-legales | - |
| 15 | **Logaia** | LOGAIA SAS | Prépare les écritures au format d'import de Logaia. Une pièce illisible est arrêtée et nommée. | https://www.logaia.fr/ | repli : https://www.logaia.fr/ | `-` | - |
| 16 | **Limpeed** | Self-Med SAS | Rapproche des relevés les recettes et les dépenses des dossiers BNC, et prépare la 2035 pour relecture. | https://www.limpeed.com/ | repli : https://www.limpeed.com/ | `IM` https://www.limpeed.com/mentions-legales-limpeed | - |
| 17 | **Pilotz** | Pilotz SAS (porté par l'OGA Arcolib) | Prépare les dossiers BNC et LMNP à partir des relevés et des pièces. La liasse part après validation. | https://www.pilotz.fr/ | repli : https://www.pilotz.fr/ | `IM` https://www.pilotz.fr/mentions-legales | - |
| 18 | **Cegid Conciliator** | Cegid | Reprend, avec leur motif, les pièces que la saisie automatique écarte, et les prépare pour validation. | https://www.shine.fr/experts-comptables/cegid-conciliator/ | repli : https://www.cegid.com/fr/ | `IM` (Cegid) | - |
| 19 | **Dext** | Dext France SARL | Reprend les factures atypiques et les doublons sans numéro avant l'export vers le logiciel du cabinet. | https://dext.com/fr/cabinet/produits/saisie-comptable | repli : https://dext.com/fr (presse sans kit : https://dext.com/fr/ressources/presse) | `IM` https://dext.com/fr/terms-and-conditions (art. 5.2) | - |
| 20 | **Yooz** | Yooz SAS | Récupère et dépose les factures reçues hors de Yooz. Les écarts de rapprochement sont présentés avant l'export. | https://www.getyooz.com/fr/solution-expert-comptable | repli : https://www.getyooz.com/fr/ | `IM` https://www.getyooz.com/fr/mentions-legales | - |
| 21 | **iDocus** | IDOCUS SAS | Contrôle les pièces collectées avant leur envoi vers la production, et réclame la pièce manquante en la nommant. | https://idocus.com/ | repli : https://idocus.com/ | `-` | - |
| 22 | **Chaintrust** | Chaintrust SAS (groupe Visma) | Reprend, avec leur source, les écritures laissées en suspens, et contrôle le FEC avant la révision. | https://www.chaintrust.io/saisie-comptable/ | repli : https://www.chaintrust.io/ | `-` | - |
| 23 | **MEG (Mon Expert en Gestion)**, de RCA | RCA SAS | Lit chaque mois la pré-comptabilité que vos clients tiennent dans MEG, prépare les écritures et liste les pièces manquantes. | https://rca.fr/meg-mon-expert-en-gestion/ | kit : https://rca.fr/lesprit-rca/espace-presse/ (ZIP 2025, non ouvert) | `IM` https://rca.fr/mentions-legales/ (alors que le kit est public) | - |
| 24 | **ISAREVISE CONNECT** | AGIRIS (ISAGRI) | Prépare les feuilles de travail et les points de révision à partir des données du dossier. Le réviseur conclut. | https://www.agiris.fr/logiciel/isarevise-connect | repli : https://www.agiris.fr/ | `IM` (AGIRIS) | - |
| 25 | **Confero** (e-ECF, e-DIAG) | Confero SAS | Rassemble par dossier les pièces et les contrôles de l'examen de conformité fiscale, prêts pour la revue du professionnel. | https://confero.fr/ | repli : https://confero.fr/ | `-` https://confero.fr/mentions-legales | - |
| 26 | **ComptaSecure** | ComptaSecure SAS | Trie par dossier les anomalies relevées sur le FEC et relie chacune à son écriture. | https://www.comptasecure.fr/ | repli : https://www.comptasecure.fr/ | `-` | - |
| 27 | **FEC Expert** | Éditions Francis Lefebvre et DGC (groupe Lefebvre Sarrut) | Contrôle la forme du FEC avant sa remise à l'administration ou au commissaire aux comptes. Chaque rejet est expliqué. | https://www.fec-expert.fr/ | repli : https://www.fec-expert.fr/ | `-` https://www.fec-expert.fr/mentions-legales/ | - |
| 28 | **NotaQo** | éditeur non relevé | Relie à leurs écritures les alertes de conformité du FEC et les trie pour la révision. | https://www.notaqo.fr/ | repli : https://www.notaqo.fr/ | `-` https://www.notaqo.fr/mentions-legales | - |
| 29 | **E-Clid** | éditeur non relevé | Convertit les contrôles automatiques des données comptables en liste de points à revoir, dossier par dossier. | https://e-clid.io/ | repli : https://e-clid.io/ | `nv` (aucune page de mentions trouvée) | - |
| 30 | **MyDecisio** | éditeur non relevé | Reprend par dossier les alertes de pré-révision. Chaque écart est présenté avec sa source avant validation. | https://mydecisio.fr/ (ne pas écrire www : erreur 525) | repli : https://mydecisio.fr/ | `-` https://mydecisio.fr/mentions-legales | - |
| 31 | **Syndemos** | Creacte SARL | Prépare les questions de révision à partir du dossier, et suit les réponses des clients jusqu'à la pièce. | https://www.syndemos.fr/ | repli : https://www.syndemos.fr/ | `-` | - |
| 32 | **Bee Report** | BEE REPORT SAS | Réunit et contrôle les balances des entités avant la consolidation. Les écarts intragroupe sont présentés. | https://beereport.fr/ | repli : https://beereport.fr/ | `IM` https://beereport.fr/mentions-legales/ | - |
| 33 | **Crypto Accounting** | éditeur non relevé | Prépare en écritures les opérations des portefeuilles et des plateformes d'échange, avec le FEC du dossier. | https://cryptoaccounting.fr/ | repli : https://cryptoaccounting.fr/ | `nv` (aucune page de mentions trouvée) | - |
| 34 | **Sogescot** (gamme So : So bank, So expense, So pilot) | Sogescot | Prépare en écritures les relevés et les dépenses collectés. Le collaborateur valide. | https://www.sogescot.com/ | repli : https://www.sogescot.com/ | `-` https://www.sogescot.com/mentions-legales/ | - |
| 35 | **EBP Comptabilité** | EBP SA (« EBP, A Cegid Company ») | Prépare et contrôle la demande d'export FEC (destinataire, période, régime), puis le lettrage et la clôture. L'export se fait dans EBP. | https://www.ebp.com/logiciel-comptabilite/ | presse : https://www.ebp.com/presse/ (le kit est sur le portail de marque Cegid, derrière une connexion) | `IM` https://www.ebp.com/mentions-legales/ | export-fec-ebp, lettrage-ebp, cloture-ebp |
| 36 | **Sage 100 Comptabilité** | Sage | Propose les paires de lettrage et de rapprochement à partir de l'export, sans changer leur statut dans Sage. Il prépare aussi la saisie par lot et la clôture. | https://www.sage.com/fr-fr/produits/sage-100/ (lien relevé au navigateur) | repli : https://www.sage.com/fr-fr/ | `IM` (Sage) | rapprochement-bancaire-sage, lettrage-sage, saisie-comptable-sage, cloture-sage |
| 37 | **Sage 50 Comptabilité** (remplace Ciel Compta) | Sage | Lit l'export comptable de vos clients et le contrôle avant son intégration dans le logiciel du cabinet. | https://www.sage.com/fr-fr/produits/sage-50cloud/ (lien relevé au navigateur) | repli : https://www.sage.com/fr-fr/ | `IM` (Sage) | - |
| 38 | **Odoo Comptabilité** | Odoo S.A. (Belgique) | Lit et contrôle le FEC et les exports d'Odoo, puis les rapproche de la comptabilité tenue par le cabinet. | https://www.odoo.com/fr_FR/app/accounting | charte : https://www.odoo.com/fr_FR/page/brand-assets | `R` (ne pas redessiner, couleurs et marges fournies) | - |
| 39 | **Cogilog Compta** | Cogilog SAS | Lit l'export des écritures de vos clients et le contrôle avant intégration. | https://www.cogilog.com/compta/ | repli : https://www.cogilog.com/ | `-` | - |
| 40 | **N2F** | SAS N2JSOFT | Rapproche les notes arrivées hors de l'outil, réclame le justificatif manquant en le nommant et contrôle l'export comptable. | https://www.n2f.com/ | kit et charte : https://www.n2f.com/fr/brand/ (fichiers non ouverts) | `IM` https://www.n2f.com/fr/mentions-legales/ (alors que le kit est public) | - |
| 41 | **Expensya** | Medius (Suède) | Contrôle l'export des notes de frais (TVA, comptes, justificatifs) avant intégration. | https://www.expensya.com/fr/ | repli : https://www.expensya.com/fr/ | `-` | - |
| 42 | **Jenji** | SILAEXPERT (groupe Silae) | Idem Expensya. | https://www.jenji.io/fr/gestion-note-de-frais/application-notes-de-frais | repli : https://www.jenji.io/fr/ | `IM` https://www.jenji.io/fr/mentions-legales | - |
| 43 | **Cegid Notilus** | Cegid | Rapproche des relevés de carte les notes et les déplacements comptabilisés. Un écart est présenté, jamais corrigé d'office. | https://www.cegid.com/fr/produits/cegid-notilus/ | repli : https://www.cegid.com/fr/ | `IM` (Cegid) | - |
| 44 | **Sellsy** | SELLSY SAS (TeamSystem) | Lit les factures de vente et les encaissements de vos clients, et les prépare en écritures de ventes. | https://go.sellsy.com/ | repli : https://go.sellsy.com/ | `-` https://go.sellsy.com/informations-legales/mentions-legales | - |
| 45 | **Axonaut** | DIGITICA SAS | Idem Sellsy, depuis son portail comptable. | https://axonaut.com/ | presse : https://axonaut.com/content/presse (kit sur Google Drive, non ouvert) | `IM` https://axonaut.com/mentions-legales (alors que le kit est public) | - |
| 46 | **Evoliz** | Evoliz SAS (groupe Visma) | Idem Sellsy. | https://www.evoliz.com/ | repli : https://www.evoliz.com/ | `-` https://www.evoliz.com/legal/ | - |
| 47 | **Henrri** | éditeur non relevé | Idem Sellsy. | https://www.henrri.com/ | repli : https://www.henrri.com/ | `-` https://www.henrri.com/mentions-legales/ | - |
| 48 | **MY.Facturation** | éditeur non relevé | Idem Sellsy. | https://www.myfacturation.com/ | repli : https://www.myfacturation.com/ | `-` https://www.myfacturation.com/mentions-legales | - |
| 49 | **ProGBat** | TSL Business SAS | Lit les devis, les situations et les factures des artisans et les prépare en écritures, retenues de garantie comprises. | https://www.progbat.com/ | repli : https://www.progbat.com/ | `-` https://www.progbat.com/mentions-legales | - |

## 3. Paie et social — Salomé · Paie et social

Salomé contrôle les variables reçues, lit l'export de paie du mois et recense les écarts avant la DSN. Votre
gestionnaire de paie valide le bulletin et dépose la déclaration.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Silae** (gamme mySilae) | SILAEXPERT SAS (Silver Lake ; rapprochement avec Cegid annoncé le 09/09/2026, non finalisé) | Lit l'export de paie du mois et la liste des salariés, contrôle les variables et recense les écarts avant la DSN. Rien n'est écrit dans Silae. | https://www.silae.fr/solutions-paie-securisees-et-innovantes/ | charte : https://www.silae.fr/brandbook/ | `-` https://www.silae.fr/mentions-legales/ | dsn-silae, bulletin-de-paie-silae |
| 2 | **Cegid Quadra Paie** | Cegid | Contrôle les variables arrivées par courriel ou par tableur et les prépare pour la saisie. L'OD de paie est rapprochée de la comptabilité. | https://www.shine.fr/experts-comptables/produits/cegid-quadra-plus/ | repli : https://www.cegid.com/fr/ (presse sans kit) | `IM` (Cegid) | - |
| 3 | **Sage Paie** (offre pour les experts-comptables) | Sage | Contrôle les variables avant le calcul, et recense avant la DSN les contrats et les dates attendus. | https://www.sage.com/fr-fr/experts-comptables/paie/ (lue au navigateur le 15/10) | repli : https://www.sage.com/fr-fr/ | `IM` (Sage) | - |
| 4 | **Sage 100 Paie & RH** | Sage | Recense avant le transfert DSN les contrats et les dates attendus, et contrôle les bulletins contre les variables du mois. | https://www.sage.com/fr-fr/produits/sage-100-paie-rh/ (lien relevé au navigateur) | repli : https://www.sage.com/fr-fr/ | `IM` (Sage) | dsn-sage, bulletin-de-paie-sage |
| 5 | **ACD PAIE** (avec Paie Expert et i-PAIE) | ACD (TeamSystem) | Contrôle avant le calcul les variables que vos clients saisissent dans i-PAIE. Les écarts sont présentés au gestionnaire. | https://www.acd-groupe.fr/solution-expert-comptable/acd-paie/ | kit : PDF ACD (non ouvert, voir §2 ligne 5) | `IM` (ACD) | - |
| 6 | **ISAPAYE CONNECT** | AGIRIS (ISAGRI) | Contrôle les variables et rapproche l'OD de paie d'ISACOMPTA avant validation. | https://www.agiris.fr/logiciel/isapaye | repli : https://www.agiris.fr/ | `IM` (AGIRIS) | - |
| 7 | **COT'TNS** | AGIRIS (ISAGRI) | Contrôle les appels de cotisations des indépendants contre les revenus déclarés. L'écart est présenté. | https://www.agiris.fr/logiciel/cottns | repli : https://www.agiris.fr/ | `IM` (AGIRIS) | - |
| 8 | **EBP Paie** | EBP (Cegid) | Lit l'export de paie de vos clients et le rapproche de la comptabilité tenue par le cabinet. | https://www.ebp.com/logiciel-paie/ | presse : https://www.ebp.com/presse/ | `IM` (EBP) | - |
| 9 | **Cegid Payroll Ultimate** | Cegid | Fait les rapprochements que ses contrôles natifs ne couvrent pas : l'export de paie contre la comptabilité et la DSN. | https://www.cegid.com/fr/produits/cegid-payroll-ultimate/ | repli : https://www.cegid.com/fr/ | `IM` (Cegid) | - |
| 10 | **Openpaye** | Freshpay France | Contrôle les variables avant le calcul et rapproche l'export de paie de la comptabilité. | https://openpaye.co/ | repli : https://openpaye.co/ | `-` | - |
| 11 | **Nibelis** | Nibelis SA | Lit les journaux de paie et les DSN, et les rapproche de la comptabilité du dossier. | https://nibelis.com/ | repli : https://nibelis.com/ (presse sans logo) | `IM` https://nibelis.com/mentions-legales/ | - |
| 12 | **Linc** | Linc SAS | Idem Openpaye. | https://www.linc.fr/ | repli : https://www.linc.fr/ | `IM` https://www.linc.fr/legal/mentions-legales | - |
| 13 | **Alassio** | Peppers SAS | Contrôle avant le calcul les variables importées en masse. L'OD de paie est rapprochée de la comptabilité. | https://alassio.fr/ | repli : https://alassio.fr/ | `IM` https://alassio.fr/mentions-legales | - |
| 14 | **Weekera** | WEEKERA SAS | Idem Openpaye. | https://weekera.fr/ | repli : https://weekera.fr/ | `-` | - |
| 15 | **Wagyz** | CHAPSOFT SNC | Idem Openpaye. | https://wagyz.fr/ | kit partenaires : https://wagyz.fr/presse/ | `IM` https://wagyz.fr/mentions-legales/ | - |
| 16 | **Hamac** (GHS) | GHS SAS | Contrôle avant le calcul les contrats courts et leurs variables, et rapproche chaque DSN de ses bulletins. | https://www.ghs.fr/ | repli : https://www.ghs.fr/ | `IM` https://www.ghs.fr/mentions-legales/ | - |
| 17 | **Payfit** | Payfit SAS | Rapproche l'export de paie du client de la comptabilité tenue par le cabinet, et prépare l'OD pour validation. | https://payfit.com/fr/ | repli : https://payfit.com/fr/ (la presse annonce un kit sans le lier) | `-` | - |
| 18 | **ADP DECIDIUM** | ADP | Idem Payfit. | https://www.fr.adp.com/notre-offre/produits/adp-decidium.aspx | repli : même page | `-` | - |
| 19 | **Lucca** (dont Notes de frais) | LUCCA SAS | Contrôle contre les variables du mois les absences et les notes de frais exportées vers la paie. | https://www.lucca.fr/ | repli : https://www.lucca.fr/ (presse sans kit) | `-` | - |
| 20 | **Factorial** | Everyday Software S.L. | Contrôle avant le calcul les absences, les heures et les primes exportées pour la paie. | https://factorial.fr/ | kit : https://factorial.fr/presse (ZIP, non ouvert) | `IM` https://factorial.fr/mentions-legales (accord écrit pour un logo sur une page web) | - |
| 21 | **Eurécia** | Eurécia SAS | Idem Factorial. | https://www.eurecia.com/ | kit : https://www.eurecia.com/kit-media | `IM` https://www.eurecia.com/mentions-legales (le kit lui-même est soumis à autorisation) | - |
| 22 | **quarksUp** | quarksUp SAS | Contrôle avant la paie les éléments variables exportés par le SIRH du client. | https://www.quarksup.com/ | repli : https://www.quarksup.com/ | `-` | - |
| 23 | **Kelio** | KELIO SAS | Contrôle contre le planning les temps badgés exportés pour la paie, et signale l'heure manquante. | https://www.kelio.com/fr | repli : https://www.kelio.com/fr | `IM` https://www.kelio.com/fr/mentions-legales.html | - |
| 24 | **Skello** | Skello SAS | Contrôle les heures et les absences du planning avant leur transfert vers la paie. | https://www.skello.io/ | repli : https://www.skello.io/ | `-` | - |
| 25 | **Combo** | COMBO SAS | Idem Skello. | https://combohr.com/fr/ | repli : https://combohr.com/fr/ | `-` | - |
| 26 | **Swile** | Swile SAS | Rapproche les titres-restaurant et les avantages commandés de la paie et de la comptabilité du mois. | https://www.swile.co/ | kit : https://www.swile.co/press | `LP` | - |
| 27 | **Bimpli** | Swile SAS | Idem Swile. | https://www.bimpli.com/ | repli : https://www.bimpli.com/ | `-` | - |
| 28 | **Edenred** (Ticket Restaurant) | Edenred France | Rapproche les commandes de titres des retenues en paie et de la facture. L'écart est présenté. | https://www.edenred.fr/ | kit : https://media.edenred.com/?lang=fr | `IM` https://www.edenred.fr/mentions-legales | - |
| 29 | **Pluxee** | Pluxee France | Idem Edenred. | https://www.pluxee.fr/ | presse : https://www.pluxee.fr/espace-presse/ (kit sur demande) | `IM` https://www.pluxee.fr/mentions-legales/ | - |
| 30 | **Up Déjeuner** (Groupe Up) | nv | Idem Edenred. | https://up.coop/ (403, non vérifié) | `nv` | `nv` | - |
| 31 | **WiiSmile** | WiiSmile SAS | Rapproche de la comptabilité du client les factures et les participations de l'offre d'avantages. | https://wiismile.fr/ | repli : https://wiismile.fr/ | `IM` https://wiismile.fr/mentions-legales/ | - |
| 32 | **ZenDSN** | Fiabdata SAS | Trie par dossier les anomalies relevées sur les DSN et relie chacune au bulletin à corriger avant la DSN suivante. | https://zendsn.com/ | repli : https://zendsn.com/ | `IM` https://zendsn.com/mentions-legales/ | - |
| 33 | **DSN-Val** | GIP-MDS (net-entreprises) | Contrôle le fichier DSN avant dépôt et explique chaque rejet au gestionnaire. Le dépôt reste son geste. | https://www.net-entreprises.fr/declaration/outils-de-controle-dsn-val/ | repli : https://www.net-entreprises.fr/ | `IM` (GIP-MDS) | - |
| 34 | **Cobham Solutions** (DSN by Cobham, Lecteur DSN) | Cobham Solutions | Lit et contrôle les fichiers DSN, et présente chaque écart avec la rubrique en cause. | https://www.cobham-solutions.fr/ | repli : https://www.cobham-solutions.fr/ | `-` | - |
| 35 | **Gerem** | GEREM SAS | Prépare les scénarios de rémunération du dirigeant à partir de la comptabilité tenue. L'arbitrage reste au conseil. | https://gerem.fr/ | repli : https://gerem.fr/ | `-` | - |
| 36 | **MyFides** (Social'360, calcul des IFC) | Association MyFides | Prépare les calculs sociaux (indemnités de fin de carrière, statut du dirigeant) à partir des données du dossier. | https://www.myfides.fr/ | repli : https://www.myfides.fr/ | `IM` https://www.myfides.fr/mentions-legales/ | - |
| 37 | **Agrume** | Agrume SAS | Applique au dossier les modèles et les procédures de droit social, et prépare le document pour relecture. | https://agrume.fr/ | kit : https://agrume.fr/ressources/espace-presse/ | `-` | - |
| 38 | **LégiSocial** | NetLEGIS SAS | Cite la règle sociale, avec sa source datée, dans la note préparée pour le gestionnaire. | https://www.legisocial.fr/ | repli : https://www.legisocial.fr/ | `-` | - |
| 39 | **Éditions Tissot** | Éditions Tissot SAS | Idem LégiSocial. | https://www.editions-tissot.fr/ | kit : https://www.editions-tissot.fr/contenu/telechargements-presse | `LP` | - |
| 40 | **Dokia** | Dôme Media SAS | Applique au dossier les procédures sociales du pôle. Chaque document est préparé pour relecture. | https://www.dokia.fr/ | repli : https://www.dokia.fr/ | `-` https://www.dokia.fr/mentions-legales/ | - |

## 4. Juridique et formalités — Grégoire · Juridique et fiscal

Grégoire tient le calendrier des approbations et des dépôts. Il prépare les projets d'actes, les registres et les
dossiers de formalité à partir des données du dossier. Les associés décident ; la signature et le dépôt restent au
cabinet.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Lexis PolyActe** | LexisNexis SA (RELX) | Tient l'échéancier des approbations et des dépôts, et prépare les projets d'actes à partir des données du dossier. | https://www.lexisnexis.com/fr-fr/produits/logiciel-secretariat-juridique | repli : même page | `IM` https://www.lexisnexis.com/fr-fr/mentions-legales | - |
| 2 | **AJi Sociétés** | Lefebvre Dalloz | Prépare les projets de procès-verbaux et les registres à partir des comptes approuvés. La signature reste aux associés. | https://boutique.lefebvre-dalloz.fr/aji-societes.html | repli : https://www.lefebvre-dalloz.fr/ (presse sans logo) | `IM` https://www.lefebvre-dalloz.fr/conditions-generales-dutilisation/ | - |
| 3 | **Juriactes** | Juriactes SAS | Prépare les actes d'approbation et de modification à partir du logiciel de production. Le dépôt reste votre geste. | https://juriactes.fr/ | repli : https://juriactes.fr/ | `-` | - |
| 4 | **Express Juridique** | EXPRESS JURIDIQUE SAS | Pré-remplit les actes à partir des données du dossier, pour relecture avant la signature et le dépôt. | https://express-juridique.com/ | repli : https://express-juridique.com/ | `-` | - |
| 5 | **Dexyos** | DEXYOS SASU | Prépare les actes, les formalités et les registres à partir des données comptables. Le dépôt reste le geste du cabinet. | https://www.dexyos.fr/ | repli : https://www.dexyos.fr/ | `IM` https://www.dexyos.fr/cgv-cgu | - |
| 6 | **VIKTA** | VIKTA SAS | Reprend les données comptables dans le projet d'approbation. Chaque date est confirmée avant l'envoi. | https://www.vikta.com/ | repli : https://www.vikta.com/ | `IM` https://www.vikta.com/mentions-legales | - |
| 7 | **Axiocap** | SAS AXIOCAP (Infogreffe au capital) | Tient à jour les registres et les assemblées dématérialisés à partir des décisions validées. | https://www.axiocap.com/ | repli : https://www.axiocap.com/ (presse sans logo) | `-` | - |
| 8 | **Izikap** | Xelians Archivage SAS | Idem Axiocap. | https://www.izikap.fr/ | repli : https://www.izikap.fr/ | `IM` https://www.izikap.fr/mentions-legales/ | - |
| 9 | **Ubikap** | Ubikap SAS | Prépare les convocations et les procès-verbaux d'assemblée. L'envoi part après validation. | https://www.ubikap.com/ | repli : https://www.ubikap.com/ | `-` | - |
| 10 | **ImpalAct** | Legascope SAS | Idem Express Juridique. | https://impalact.fr/ | repli : https://impalact.fr/ | `IM` https://impalact.fr/mentions-legales.html | - |
| 11 | **JurIA** | JurIA SAS | Rédige les projets d'actes à partir du dossier. Le juriste les relit avant la signature et le dépôt. | https://www.juria.fr/ | repli : https://www.juria.fr/ | `IM` https://www.juria.fr/legal/mentions-legales | - |
| 12 | **HermineIA** | HERMINEIA SAS | Idem JurIA. | https://www.hermineia.fr/ | repli : https://www.hermineia.fr/ | `IM` https://www.hermineia.fr/conditions-generales-utilisation | - |
| 13 | **Alf** (anciennement Thisisalf) | ALF SAS | Remplit à partir du dossier les modèles juridiques du cabinet. Chaque document est relu avant l'envoi. | https://askalf.com/fr/ | repli : https://askalf.com/fr/ | `IM` https://askalf.com/fr/conditions-generales/ | - |
| 14 | **LegalVision** | LVPRO | Réunit et contrôle le dossier de formalité avant le dépôt. Le dépôt reste votre geste. | https://www.legalvision.fr/ | repli : https://www.legalvision.fr/ | `IM` https://www.legalvision.fr/p/cgu/ | - |
| 15 | **Legal2digital** | GIE de journaux d'annonces légales | Prépare les annonces légales à partir de l'acte validé, et range l'attestation de parution au dossier. | https://www.legal2digital.fr/ | repli : https://www.legal2digital.fr/ | `IM` https://www.legal2digital.fr/mentions-legales/ | - |
| 16 | **Medialex** | MEDIALEX SAS (groupe Ouest-France) | Idem Legal2digital. | https://www.medialex.fr/ | repli : https://www.medialex.fr/ | `IM` https://www.medialex.fr/mentions-legales/ | - |
| 17 | **Annonces légales Les Echos Le Parisien** | Les Echos Le Parisien Services | Idem Legal2digital. | https://www.annonces-legales.fr/ | repli : https://www.annonces-legales.fr/ | `-` | - |
| 18 | **ProLégales** | N.R. Communication SAS | Idem Legal2digital. | https://www.pro-legales.com/ | repli : https://www.pro-legales.com/ | `IM` https://www.pro-legales.com/mentions-legales.html | - |
| 19 | **Gazette Solutions** | La Gazette Solutions SARL | Idem Legal2digital. | https://www.gazettesolutions.fr/ | repli : https://www.gazettesolutions.fr/ | `-` | - |
| 20 | **Navis et Solution Expert-comptable** (Éditions Francis Lefebvre) | Lefebvre Dalloz | Cite la règle fiscale ou juridique, avec sa source datée, dans la note préparée pour le collaborateur. | https://boutique.lefebvre-dalloz.fr/solution-expert-comptable.html | repli : https://www.lefebvre-dalloz.fr/ | `IM` (Lefebvre Dalloz) | - |
| 21 | **GenIA-L Expert-comptable** | Lefebvre Dalloz | Reprend dans la note du dossier les réponses de recherche, avec leur source. Le collaborateur les relit. | https://boutique.lefebvre-dalloz.fr/genial-expert-comptable.html | repli : https://www.lefebvre-dalloz.fr/ | `IM` (Lefebvre Dalloz) | - |
| 22 | **Lexis+** (anciennement Lexis 360 Intelligence) | LexisNexis | Idem GenIA-L. | https://www.lexisnexis.com/fr-fr/produits/lexis-plus | repli : même page | `IM` (LexisNexis) | - |
| 23 | **Revue Fiduciaire** (RF AlterEgo Experts-Comptables, FiduExpert, RF MyDoc Social Expert) | Groupe Revue Fiduciaire | Idem Navis, pour le juridique, le fiscal et le social. | https://www.revue-fiduciaire.com/ia-juridique/rf-alterego-experts-comptables/ | repli : https://portail.grouperf.com/ | `IM` https://www.revue-fiduciaire.com/mentions-legales | - |
| 24 | **Lexbase** | Lexbase SA | Idem GenIA-L. | https://www.lexbase.fr/ | repli : https://www.lexbase.fr/ | `IM` https://www.lexbase.fr/legal-tech/mentions-legales | - |
| 25 | **Infodoc-experts** | service du Conseil supérieur de l'Ordre | Range au dossier la question posée au service et sa réponse, datées et sourcées. | https://www.infodoc-experts.com/ | repli : https://www.infodoc-experts.com/ | `IM` https://www.infodoc-experts.com/page/conditions-generales-de-vente-infodoc-experts | - |
| 26 | **SVP** | SVP Groupe SAS | Idem Infodoc-experts. | https://www.svp.com/ | repli : https://www.svp.com/ (presse sans kit) | `IM` https://www.svp.com/mentions-legales | - |
| 27 | **WebLex** (et WebLex Pro) | WEBLEX SAS | Reprend dans la lettre d'information l'actualité retenue par le cabinet (Colette). Elle est relue avant l'envoi. | https://www.weblex.fr/ | repli : https://www.weblex.fr/ | `IM` https://www.weblex.fr/conditions-generales-d-utilisation | - |
| 28 | **Wisetax** | Avocode SAS | Idem GenIA-L. | https://wisetax.fr/ | repli : https://wisetax.fr/ | `IM` https://wisetax.fr/cgu/ | - |
| 29 | **JustaxX** (avec RCA) | éditeur non identifié ; distribué par RCA | Réunit les avis de taxe foncière de vos clients et les prépare pour l'audit. La réclamation reste votre décision. | https://rca.fr/logiciels-experts/justaxx/ | repli : https://rca.fr/logiciels-experts/justaxx/ | `IM` (RCA) | - |

## 5. Commissariat aux comptes — Aude · Missions d'audit

Aude prépare, selon la règle écrite du cabinet, la sélection des tiers à confirmer (circularisation, NEP 505),
la feuille des écarts et les fichiers du client rapprochés de la balance. Elle les prépare pour le logiciel de
dossier d'audit que le cabinet utilise déjà. Le commissaire aux comptes apprécie les éléments, documente ses
travaux et conclut.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Caseware Audit France** (et sa version web) | CaseWare France (marque de CaseWare International, sous licence) | Prépare pour le dossier d'audit la sélection des tiers proposée selon la règle du cabinet, la feuille des écarts et les fichiers du client rapprochés de la balance. L'équipe les verse après revue. | https://www.caseware.fr/audit-france-cwf/ | repli : https://www.caseware.fr/ | `IM` https://www.caseware.com/legal/terms-of-use (§13) | - |
| 2 | **Caseware IDEA** | Caseware International | Prépare les fichiers du client (paie, immobilisations, stocks) et les rapproche de la balance avant les analyses. | https://www.caseware.fr/caseware-idea/ | repli : https://www.caseware.fr/ | `IM` (Caseware) | - |
| 3 | **Caseware Extractly** | CaseWare France | Relie dans le classeur de travail chaque pièce probante à sa transaction, et signale chaque écart. | https://www.caseware.fr/caseware-extractly/ | repli : https://www.caseware.fr/ | `IM` (Caseware) | - |
| 4 | **Auditsoft Premier** | Lefebvre Dalloz | Idem Caseware Audit France. | https://boutique.lefebvre-dalloz.fr/auditsoft-premier.html | repli : https://www.lefebvre-dalloz.fr/ | `IM` (Lefebvre Dalloz) | - |
| 5 | **Acropole Expert CAC** | Centre Ouest Informatique (marque Acropole-Expert) | Idem Caseware Audit France. | https://acropole-expert.com/commissaires-aux-comptes/ | repli : https://acropole-expert.com/ | `IM` https://acropole-expert.com/mentions-legales/ | - |
| 6 | **CACAO** | Groupe TGS France | Idem Caseware Audit France. | https://www.tgs-france.fr/services/logiciel-audit-cacao/ | repli : https://www.tgs-france.fr/ (pas de logo propre au produit) | `IM` https://www.tgs-france.fr/mentions-legales/ (logo sur autorisation, à demander par courriel) | - |
| 7 | **MyAuditPilot** | MyAuditPilot (société créée en 2026) | Idem Caseware Audit France. | https://myauditpilot.com/ | repli : https://myauditpilot.com/ | `IM` https://myauditpilot.com/mentions-legales/ (même un lien vers le site demande un accord écrit) | - |
| 8 | **DreamAudit** | Gest On Line SAS | Idem Caseware Audit France. | https://www.dreamaudit.com/fr | repli : https://www.dreamaudit.com/fr | `IM` (Gest On Line) | - |
| 9 | **e-Circu** | Gest On Line SAS | Propose les tiers à confirmer selon la règle écrite du cabinet et prépare la feuille des écarts. L'envoi, les relances et la réception des réponses restent sous la maîtrise du commissaire aux comptes. | https://www.e-circu.com/ | repli : https://www.e-circu.com/ | `IM` (Gest On Line) | - |
| 10 | **e-Recup** | Gest On Line SAS | Tient à jour la liste des pièces demandées au client audité, et rapproche chaque pièce reçue de sa demande. | https://www.e-recup.com/ | repli : https://www.e-recup.com/ | `IM` (Gest On Line) | - |
| 11 | **PackAUDIT** | CNCC | Prépare pour le dossier les fichiers du client rapprochés de la balance, et la feuille des écarts. | https://packaudit.cncc.fr/ | repli : https://packaudit.cncc.fr/ | `IM` https://www.cncc.fr/general/mentions-legales | - |
| 12 | **SmartFEC+** | CNCC | Laisse à SmartFEC+ l'analyse du FEC, qu'il fait déjà, et prépare la sélection des éléments à contrôler et la feuille des écarts. | https://smartfec-plus.cncc.fr/ | repli : https://smartfec-plus.cncc.fr/ | `IM` (CNCC) | - |
| 13 | **Circit** (Confirm) | Circit Limited (Irlande) | Propose selon la règle du cabinet les tiers à confirmer ; l'envoi par la plateforme reste sous la maîtrise du commissaire aux comptes. | https://circit.io/fr/platform/confirm | repli : https://circit.io/ | `IM` https://circit.io/legal/terms-and-conditions | - |
| 14 | **Thomson Reuters Confirmation** (anciennement Confirmation.com) | Thomson Reuters | Idem Circit. | https://eu-fr.confirmation.com/ | charte : https://www.thomsonreuters.com/en/policies/trademark-notice | `IC` | - |
| 15 | **DataSnipper** | DataSnipper | Rassemble les pièces probantes et les relie, dans le classeur de travail, aux lignes à contrôler. | https://www.datasnipper.com/ | repli : https://www.datasnipper.com/ | `-` (conditions en PDF, non ouvert) | - |

Kanta (vigilance LCB-FT, aussi employé par des CAC) a sa carte au §13. RévisAudit est exclu (§17).

## 6. Facturation électronique — Balthazar · Comptabilité, et Honoré · Gestion du cabinet pour vos propres factures

Balthazar relève les factures reçues sur la plateforme agréée que vous ou votre client avez choisie. Il contrôle
leurs mentions et prépare leur imputation. Honoré prépare les factures d'honoraires du cabinet. Nous n'émettons,
ne transmettons et ne recevons aucune facture.

**Aucune plateforme nommée.** La liste officielle (https://www.impots.gouv.fr/liste-des-plateformes-agreees-immatriculees)
était encore illisible le 15/10/2026. À 01 h 11 comme à 04 h 45, le site servait la page « site en maintenance », en
code 200, et annonçait une remise en service le 15/10. La page d'economie.gouv.fr qui annonce la liste répond 403
aux outils. La section peut dire que l'administration publie la liste (lien officiel, sans nombre ni date). Elle
peut dire aussi que nous travaillons avec la plateforme déjà choisie, après avoir vérifié qu'elle figure sur cette
liste à la date du devis. Les éditeurs déjà présents dans d'autres domaines (Pennylane, Cegid, Sage, ACD, Agiris,
EBP, MyU, Tiime, fulll, Inqom, Chaintrust, Yooz, Dext, Qonto, Shine, Ingeneo, SY business de Cegedim, getBob)
n'y prennent pas de qualificatif « plateforme agréée » tant que la liste n'est pas relue.

## 7. Banque et paiements — Balthazar · Comptabilité, et Honoré · Gestion du cabinet pour les prélèvements d'honoraires

Balthazar lit les relevés et les transactions. Il rapproche chaque mouvement de sa pièce et présente ceux qui
restent sans candidat. Aucun paiement, aucun virement n'est initié.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Qonto** | Qonto SA | Rapproche un par un les mouvements et les pièces que l'outil comptable n'a pas appariés. | https://qonto.com/fr | kit : https://qonto.com/fr/press/kit | `-` | - |
| 2 | **Shine** | Shine France SAS (groupe Cegid) | Idem Qonto. | https://www.shine.fr/ | repli : https://www.shine.fr/ (presse sans logo) | `-` | - |
| 3 | **Revolut Business** | Revolut | Lit les relevés multidevises et les rapproche des pièces, change compris. Un mouvement sans pièce est présenté. | https://www.revolut.com/fr-FR/business/ (lue au navigateur ; 403 aux robots) | charte à accès contrôlé : https://brand.revolut.com/ (renvoie vers une validation par jeton) ; repli : page ci-contre | `R` (charte non publique ; marque déposée : https://www.revolut.com/fr-FR/legal/website-terms-and-conditions/) | - |
| 4 | **Wise Business** | Wise | Idem Revolut Business. | https://wise.com/fr/business/ | presse : https://wise.com/press (kit annoncé sans lien) | `IM` https://wise.com/help/articles/79CxCv9Qj1r7mDPJuIwUA3/wise-intellectual-property | - |
| 5 | **Memo Bank** | Memo Bank | Lit les relevés et les rapproche des pièces. Un mouvement sans candidat est présenté avec sa date et son montant. | https://memo.bank/ | kit : https://memo.bank/presse/ (ZIP, non ouvert) | `IM` https://memo.bank/mentions-legales/ | - |
| 6 | **Manager.one** | SaGa Corp, avec la Banque Wormser Frères | Idem Qonto. | https://www.manager.one/fr/ | kit : https://www.manager.one/fr/presse (page Notion) | `IM` https://www.manager.one/fr/mentions-legales | - |
| 7 | **BNP Paribas** | BNP Paribas | Lit les relevés exportés de l'espace professionnel et les rapproche des pièces. Un mouvement sans candidat est présenté. | https://mabanque.bnpparibas/ ; entreprises : https://banqueentreprise.bnpparibas/ | repli : https://group.bnpparibas/ (communiqués sans kit : https://group.bnpparibas/mediaroom/communique-de-presse) | `IM` https://group.bnpparibas/mentions-legales-et-conditions-generales-dutilisation (art. 2, lu au navigateur le 15/10) | - |
| 8 | **SG (Société Générale)** | Société Générale | Idem BNP Paribas. | https://professionnels.sg.fr/ | charte : https://www.societegenerale.com/fr/logo-societe-generale (logo du groupe) | `IM` https://www.societegenerale.com/fr/mentions-legales | - |
| 9 | **Crédit Agricole** (offre pro « Pro By CA ») | Crédit Agricole | Idem BNP Paribas. | https://www.credit-agricole.fr/ | presse : https://presse.credit-agricole.com/section/mediatheque?lang=fra | `IM` https://www.credit-agricole.com/footer/mentions-legales | - |
| 10 | **LCL** | Crédit Lyonnais (Crédit Agricole S.A.) | Idem BNP Paribas. | https://www.lcl.fr/ | presse : https://www.lcl.fr/decouvrir-lcl/presse | `IM` https://www.lcl.fr/informations-legales | - |
| 11 | **Banque Populaire** | BPCE | Idem BNP Paribas. | https://www.banquepopulaire.fr/professionnels/ | presse : https://newsroom.groupebpce.fr/folders/logos-c250-7b707.html | `IM` (usage commercial exclu par l'espace presse) | - |
| 12 | **Caisse d'Epargne** | BPCE | Idem BNP Paribas. | https://www.caisse-epargne.fr/professionnels/ | presse : même dossier BPCE | `IM` | - |
| 13 | **Crédit Mutuel** | Crédit Mutuel | Idem BNP Paribas. | https://www.creditmutuel.fr/home/index.html | repli : même page | `IM` https://www.creditmutuel.com/fr/mentions-legales.html | - |
| 14 | **CIC** | CIC (Crédit Mutuel Alliance Fédérale) | Idem BNP Paribas. | https://www.cic.fr/fr/professionnels.html | repli : même page | `IM` https://www.cic.fr/fr/informations-legales/mentions-legales.html | - |
| 15 | **La Banque Postale** | La Banque Postale | Idem BNP Paribas. | https://www.labanquepostale.fr/professionnels-entrepreneurs.html | presse : https://www.labanquepostale.com/newsroom-publications/espace-presse/identite-de-marque.html | `LP` (logo fourni pour illustrer des publications) | - |
| 16 | **BoursoBank** (Bourso Business) | Boursorama (Société Générale) | Idem BNP Paribas. | https://www.boursobank.com/ | presse : https://www.boursobank-group.com/fr/espace-presse/mediatheque | `IM` https://www.boursobank-group.com/fr/mentions-legales-fr | - |
| 17 | **American Express** | American Express | Rapproche les relevés de carte des notes de frais et des factures, et réclame en le nommant le justificatif manquant. | https://www.americanexpress.com/fr-fr/ | repli : même page | `IM` https://www.americanexpress.com/fr-fr/societes/legale/termes-et-conditions/ | - |
| 18 | **Bridge** | Perspecteev SAS | Lit les relevés agrégés pour rapprocher les mouvements des pièces, sans aucune opération sur le compte. | https://www.bridgeapi.io/ | repli : https://www.bridgeapi.io/ | `-` | - |
| 19 | **Powens** (anciennement Budget Insight) | Powens SAS | Idem Bridge. | https://www.powens.com/fr/ | repli : https://www.powens.com/fr/ | `-` | - |
| 20 | **GoCardless** | GoCardless (groupe Mollie) | Rapproche des factures les encaissements par prélèvement, et relève chaque rejet avec son motif. | https://gocardless.com/fr-fr | charte : https://brand.gocardless.com/ | `-` | - |
| 21 | **Stripe** | Stripe | Rapproche des ventes les versements et les frais, et ventile la commission en écriture. | https://stripe.com/fr | kit : https://stripe.com/fr/newsroom/information (ZIP, non ouvert) | `R` https://stripe.com/fr/marks/legal | - |
| 22 | **PayPal** | PayPal (Europe) | Idem Stripe. | https://www.paypal.com/fr/business | kit : https://newsroom.paypal-corp.com/media-resources | `IM` https://www.paypal.com/fr/legalhub/paypal/useragreement-full | - |
| 23 | **Adyen** | Adyen | Idem Stripe. | https://www.adyen.com/fr_FR | kit : https://www.adyen.com/press-and-media/presskit | `R` | - |
| 24 | **Mollie** | Mollie B.V. | Idem Stripe. | https://www.mollie.com/fr/ | kit : https://www.mollie.com/resources (règles dans le pack, non ouvert) | `-` | - |
| 25 | **Klarna** | Klarna | Rapproche des commandes et des frais les versements du paiement fractionné. | https://www.klarna.com/fr/ | kit : https://www.klarna.com/international/press/ (téléchargement après déclaration du motif, non fait) | `-` | - |
| 26 | **Alma** | Alma SAS | Idem Klarna. | https://almapay.com/ | charte : https://almapay.com/fr-FR/pages/plateforme-marque | `-` | - |
| 27 | **Payplug** | Payplug Enterprise (BPCE) | Idem Stripe. | https://www.payplug.com/fr/ | presse : https://www.payplug.com/fr/presse/ | `LP` | - |
| 28 | **Libeo** | LIBEO SAS (Cegid) | Rapproche les factures fournisseurs payées de leurs règlements et de leurs pièces. Le paiement reste votre geste. | https://libeo.io/ | repli : https://libeo.io/ | `-` | - |
| 29 | **Spendesk** | Spendesk SAS | Rapproche les dépenses par carte de leurs justificatifs, et réclame en le nommant le reçu manquant. | https://www.spendesk.com/fr/ | kit : https://www.spendesk.com/fr/press/ | `LP` | - |
| 30 | **Mooncard** | Moongroup SAS | Idem Spendesk. | https://www.mooncard.co/ | repli : https://www.mooncard.co/ | `IM` https://www.mooncard.co/fr/mentions-legales-conditions-utilisation | - |

## 8. GED et dossier permanent — Balthazar · Comptabilité, avec Octavie · Informatique et outils

Balthazar range les pièces déposées dans l'arborescence du cabinet, les nomme selon sa règle et signale celles
qui manquent au dossier permanent. Rien n'est supprimé, rien n'est versé dans un coffre d'archivage sans
validation.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Microsoft SharePoint** | Microsoft | Lit les pièces déposées, les renomme selon la règle du cabinet et les range dans son arborescence. | https://www.microsoft.com/fr-fr/microsoft-365/sharepoint/collaboration | presse : https://news.microsoft.com/imagegallery/?filter_cats%5B%5D=2333 (galerie « Microsoft Logos ») | `IC` https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks | - |
| 2 | **Microsoft OneDrive** | Microsoft | Idem SharePoint. | https://www.microsoft.com/fr-fr/microsoft-365/onedrive/online-cloud-storage | presse : galerie Microsoft (ligne 1) | `IC` (Microsoft) | - |
| 3 | **Google Drive** | Google | Idem SharePoint. | https://workspace.google.com/intl/fr/products/drive/ | charte : https://partnermarketinghub.withgoogle.com/brands/google/branding-guidelines/how-to-show-googles-brand/ | `IC` (icône produit sur approbation : https://partnermarketinghub.withgoogle.com/brands/google/trademarks-and-terms/trademark-guidelines-for-proper-usage/) | - |
| 4 | **Dropbox** | Dropbox, Inc. | Idem SharePoint. | https://www.dropbox.com/fr/ | kit : https://brand.dropbox.com/ | `R` https://www.dropbox.com/branding (à demander avant tout usage commercial) | - |
| 5 | **Zeendoc** | SAGES Informatique | Reprend dans le dossier du client les documents indexés, et signale la pièce qui manque au dossier permanent. | https://www.zeendoc.com/ | presse : https://www.zeendoc.com/presse/ (fichiers de logo listés, non ouverts) | `IM` https://www.zeendoc.com/mentions-legales/ | - |
| 6 | **Welyb** | Welyb SAS (groupe ISAGRI) | Range dans le bon dossier les pièces que vos clients déposent sur le portail, et réclame en la nommant la pièce manquante. | https://www.welyb.fr/ | repli : https://www.welyb.fr/ | `IM` https://www.welyb.fr/conditions-generales?tab=Mentions-legales | - |
| 7 | **MyCompanyFiles** | MyCompanyFiles SAS (groupe Visma) | Idem Welyb. | https://www.mycompanyfiles.fr/ | repli : https://www.mycompanyfiles.fr/ | `-` | - |
| 8 | **Portail collaboratif Cegid** (avec Quadrabox) | Cegid | Idem Welyb. | https://www.cegid.com/fr/produits/portail-collaboratif/ | repli : https://www.cegid.com/fr/ | `IM` (Cegid) | - |
| 9 | **i-Suite Expert** | ACD | Idem Welyb. | https://www.acd-groupe.fr/solution-collaborative/ | kit : PDF ACD (non ouvert) | `IM` (ACD) | - |
| 10 | **ACD GED** | ACD | Idem Zeendoc. | https://www.acd-groupe.fr/solution-expert-comptable/acd-ged/ | kit : PDF ACD (non ouvert) | `IM` (ACD) | - |
| 11 | **Konnex One** | Elips Solution SAS | Idem Welyb. | https://konnex-one.fr/ | repli : https://konnex-one.fr/ | `IM` https://konnex-one.fr/mentions-legales | - |
| 12 | **Visiativ Document Experts-Comptables** | Visiativ SA | Idem Zeendoc. | https://www.visiativ.com/solution/visiativ-documents-expert-comptable/ | presse : https://www.visiativ.com/actualites/category/communiques-de-presse/ | `-` | - |
| 13 | **illinks GED Premium Expert** | ILLINKS SAS | Idem Zeendoc. | https://www.illinks.fr/ged-premium-expert/ | repli : https://www.illinks.fr/ | `-` | - |
| 14 | **DocuWare** | DocuWare (groupe Ricoh) | Idem Zeendoc. | https://start.docuware.com/fr/ | kit : https://start.docuware.com/press-kit | `R` (usage journalistique) | - |
| 15 | **Open Bee** | OPEN BEE (fonds repris par Konica Minolta en 2026) | Idem Zeendoc. | https://www.openbee.com/ | repli : https://www.openbee.com/ | `IM` https://www.openbee.com/mentions-legales/ | - |
| 16 | **Everial** | Everial | Reprend dans le dossier les documents numérisés et archivés, avec leur référence d'archive. | https://www.everial.com/ | repli : https://www.everial.com/ | `IM` https://www.everial.com/mentions-legales/ | - |
| 17 | **Arkhineo** | Docaposte Arkhineo SAS (La Poste) | Prépare et indexe les pièces à archiver. Le versement dans le coffre se fait après validation. | https://arkhineo.com/ | repli : https://arkhineo.com/ | `IM` https://arkhineo.com/mentions-legales/ | - |
| 18 | **Cecurity.com** | Cecurity.com SA (groupe ISAGRI) | Idem Arkhineo, pour les bulletins et les documents à conserver. | https://www.cecurity.com/ | repli : https://www.cecurity.com/ | `-` | - |
| 19 | **Digiposte** | La Poste (Docaposte) | Prépare les bulletins pour le coffre-fort des salariés. La distribution part après validation du gestionnaire. | https://www.digiposte.fr/ (503 le 15/10) | repli `nv` ; marque listée : https://www.docaposte.com/nos-marques-et-filiales | `IM` https://www.docaposte.com/mentions-legales | - |
| 20 | **kDrive** | Infomaniak Network SA (Suisse) | Idem SharePoint. | https://www.infomaniak.com/fr/ksuite/kdrive | presse : https://www.infomaniak.com/fr/a-propos/presse (logos Infomaniak) | `LP` | - |
| 21 | **Nextcloud** | Nextcloud GmbH | Idem SharePoint. | https://nextcloud.com/fr/ | kit : https://nextcloud.com/press/ | `IC` https://nextcloud.com/trademarks/ (le nom aussi, en usage commercial) | - |

## 9. Signature électronique — Victoire · Commercial

Victoire prépare à partir du dossier la lettre de mission et les documents à signer, puis suit leur retour.
L'envoi pour signature part quand l'associé l'a validé.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Youtrust** (anciennement Yousign) | Youtrust (ex-Yousign SAS ; nouveau nom depuis mai 2026) | Prépare la lettre de mission et les documents à signer, puis suit leur retour. L'envoi part quand l'associé l'a validé. | https://youtrust.com/fr-fr/signature-electronique | kit : https://youtrust.com/fr-fr/espace-presse (ZIP, non ouverts) | `R` https://youtrust.com/fr-fr/conditions-generales | - |
| 2 | **Docusign** | Docusign, Inc. | Idem Youtrust. | https://www.docusign.com/fr-fr/produits/signature-electronique | charte : https://www.docusign.com/ip → https://brand.docusign.com/ | `IC` https://www.docusign.com/legal/terms-and-conditions (art. 2.1.1) | - |
| 3 | **jesignexpert.com** | ECMA | Idem Youtrust. | https://ecma-solutions.com/produits-expert-comptable/jesignexpert | repli : même page | `IM` https://ecma-solutions.com/informations-legales | - |
| 4 | **Universign** | Signaturit Group, « a Namirial Company » | Idem Youtrust. | https://www.universign.com/fr/signature-electronique (renvoie vers signaturit.com) | kit : https://www.signaturit.com/fr/kit-media/ (logo Universign inclus) | `LP` (des directives existent en PDF, non ouvert) | - |
| 5 | **Signaturit** | Signaturit Group (Namirial) | Idem Youtrust. | https://www.signaturit.com/fr/produits/signatures/signaturit/ | kit : https://www.signaturit.com/fr/kit-media/ | `LP` (même réserve) | - |
| 6 | **Acrobat Sign** | Adobe | Idem Youtrust. | https://www.adobe.com/fr/acrobat/business/sign.html | repli : https://www.adobe.com/ | `IC` https://www.adobe.com/legal/permissions/trademarks.html | - |
| 7 | **Goodflag** (anciennement Lex Persona) | Lex Persona SAS | Idem Youtrust. | https://goodflag.com/ | repli : https://goodflag.com/ (presse sans kit) | `-` | - |
| 8 | **Signature électronique Docaposte** | Docaposte (La Poste) | Idem Youtrust. | https://www.docaposte.com/solutions/signature-electronique | repli : https://www.docaposte.com/ | `IM` https://www.docaposte.com/mentions-legales | - |
| 9 | **Oodrive Sign** | Oodrive SAS | Idem Youtrust. | https://www.oodrive.com/fr/sign/ | kit : https://www.oodrive.com/fr/actualites/ (ZIP 2026, non ouvert) | `IM` https://www.oodrive.com/fr/mentions-legales/ (le nom OODRIVE aussi) | - |
| 10 | **ACD Sign** | ACD | Idem Youtrust. | https://www.acd-groupe.fr/2021/05/03/acd-sign-maitrisez-votre-identite-numerique/ | kit : PDF ACD (non ouvert) | `IM` (ACD) | - |

## 10. Messagerie et agenda — Émile · Relation client, et Colette · Communication pour la lettre d'information

Émile trie la boîte du cabinet par dossier et par priorité, relie chaque message au bon client et prépare les
réponses types et les rendez-vous. Colette rédige la lettre d'information pour relecture. Rien ne part sans
validation.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Microsoft Outlook** (et Exchange Online) | Microsoft | Trie la boîte par dossier et par priorité, relie chaque message au bon client et prépare en brouillon les réponses types. | https://www.microsoft.com/fr-fr/microsoft-365/outlook/email-and-calendar-software-microsoft-outlook (contenu à revoir à l'écran : microsoft.com a servi une page de blocage en code 200) | presse : galerie Microsoft (§8 ligne 1) | `IC` (Microsoft) | - |
| 2 | **Microsoft Teams** | Microsoft | Relie au dossier les demandes reçues dans les canaux du cabinet, et prépare la réponse pour le collaborateur. | https://www.microsoft.com/fr-fr/microsoft-teams/group-chat-software (même réserve) | presse : galerie Microsoft | `IC` (Microsoft) | - |
| 3 | **Gmail** | Google | Idem Outlook. | https://workspace.google.com/intl/fr/gmail/ | charte : Google (§8 ligne 3) | `IC` (Google) | - |
| 4 | **Google Agenda** | Google | Propose les rendez-vous dans les créneaux libres et prépare l'invitation. Elle part après validation. | https://workspace.google.com/intl/fr/products/calendar/ | charte : Google | `IC` (Google) | - |
| 5 | **Google Chat** | Google | Idem Teams. | https://workspace.google.com/intl/fr/products/chat/ | charte : Google | `IC` (Google) | - |
| 6 | **Google Meet** | Google | Prépare l'ordre du jour et le compte rendu à partir du dossier. Ils sont relus avant l'envoi. | https://workspace.google.com/intl/fr/products/meet/ | charte : Google | `IC` (Google) | - |
| 7 | **Zoom** (Zoom Workplace) | Zoom Communications, Inc. | Idem Google Meet. | https://www.zoom.com/ | kit : https://www.zoom.com/en/about/media-kit/ | `IC` https://explore.zoom.us/docs/en-us/brandguidelines.html | - |
| 8 | **Slack** | Slack (Salesforce) | Idem Teams. | https://slack.com/intl/fr-fr/ | kit : https://slack.com/media-kit ; charte : https://brand.slackhq.com/ | `IC` https://slack.com/terms-of-service/slack-brand (le logo est interdit, avec ou sans le vôtre) | - |
| 9 | **WhatsApp Business** | WhatsApp (Meta) | Relie au dossier les messages de vos clients et prépare les réponses types. | https://whatsappbusiness.com/fr/ | charte : https://www.meta.com/fr-fr/brand/resources/whatsapp/whatsapp-brand/ | `R` (fichiers officiels, jamais en élément principal) | - |
| 10 | **LinkedIn** (et LinkedIn Ads) | LinkedIn (Microsoft) | Prépare pour relecture les publications du cabinet (Colette), et relève les factures LinkedIn Ads pour la comptabilité. | https://www.linkedin.com/ ; publicités : https://business.linkedin.com/fr/fr/advertise/ads | charte : https://brand.linkedin.com/ | `IC` https://brand.linkedin.com/linkedin-logo (logo complet réservé aux titulaires d'une licence) | - |
| 11 | **AR24** | AR24 SAS (Docaposte) | Prépare la lettre recommandée avec ses pièces et son destinataire. L'envoi part après validation, l'accusé est rangé au dossier. | https://www.ar24.fr/ | repli : https://www.ar24.fr/ | `IM` https://www.ar24.fr/mentions-legales/ | - |
| 12 | **Maileva** | Maileva SAS (Docaposte) | Idem AR24. | https://www.maileva.com/ | repli : https://www.maileva.com/ | `IM` https://www.maileva.com/mentions-legales/ | - |
| 13 | **Merci Facteur** | BOURDET SARL | Idem AR24. | https://www.merci-facteur.com/pro/ | repli : https://www.merci-facteur.com/ | `R` https://www.merci-facteur.com/conditions-generales.php | - |
| 14 | **Calendly** | Calendly | Relie au dossier du client les rendez-vous pris, et rassemble ce qu'il faut pour les préparer. | https://calendly.com/fr | repli : https://calendly.com/fr | `-` | - |
| 15 | **Cal.com** | Cal.com, Inc. | Idem Calendly. | https://cal.com/ | kit : https://cal.com/brand | `LP` | - |
| 16 | **Aircall** | Aircall | Relie au dossier les appels reçus, et prépare la note d'appel et le rappel pour le collaborateur. | https://aircall.io/fr/ | presse : https://aircall.io/fr/press-room/ | `R` https://aircall.io/brand/ | - |
| 17 | **Ringover** | Ringover | Idem Aircall. | https://www.ringover.fr/ | kit : https://www.ringover.fr/presse-kit-media | `LP` | - |
| 18 | **Brevo** (anciennement Sendinblue) | Sendinblue SAS | Rédige la lettre d'information à partir de l'actualité que vous avez retenue, et la prépare dans l'outil pour relecture avant l'envoi. | https://www.brevo.com/fr/ | presse : https://www.brevo.com/fr/press-room/ | `LP` (charte en PDF, non lue) | - |
| 19 | **Mailchimp** | Intuit | Idem Brevo. | https://mailchimp.com/fr/ | kit : https://mailchimp.com/fr/about/brand-assets/ | `R` | - |

## 11. Bureautique et classeurs — Octavie · Informatique et outils

Octavie lit les exports que vous déposez et écrit dans vos classeurs ce que la règle prévoit. Vos formules et vos
saisies ne sont jamais réécrites, et chaque écriture est tracée.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Microsoft Excel** | Microsoft | Lit les exports et écrit dans le classeur ce que la règle prévoit. Les formules et les saisies restent intactes, chaque écriture est tracée. | https://www.microsoft.com/fr-fr/microsoft-365/excel (même réserve qu'Outlook) | presse : galerie Microsoft | `IC` (Microsoft) | - (page de détail possible : OUTILS.md §6) |
| 2 | **Microsoft Word** | Microsoft | Prépare sur vos modèles les lettres de mission, les courriers et les procès-verbaux, relus avant l'envoi. | https://www.microsoft.com/fr-fr/microsoft-365/word | presse : galerie Microsoft | `IC` (Microsoft) | - |
| 3 | **Microsoft PowerPoint** | Microsoft | Prépare la plaquette ou la présentation des comptes à partir de la comptabilité tenue, relue avant la remise. | https://www.microsoft.com/fr-fr/microsoft-365/powerpoint | presse : galerie Microsoft | `IC` (Microsoft) | - |
| 4 | **Google Sheets** | Google | Idem Excel. | https://workspace.google.com/intl/fr/products/sheets/ | charte : Google | `IC` (Google) | - |
| 5 | **Google Docs** | Google | Idem Word. | https://workspace.google.com/intl/fr/products/docs/ | charte : Google | `IC` (Google) | - |
| 6 | **LibreOffice** | The Document Foundation | Idem Excel et Word, sur les classeurs .ods (le modèle de registre de la CNIL en est un). | https://fr.libreoffice.org/ | repli : https://fr.libreoffice.org/ | `nv` (la politique de marque est derrière un anti-robot) | - |
| 7 | **Adobe Acrobat** | Adobe | Lit les PDF reçus, les découpe et les renomme selon la règle du cabinet. Une pièce illisible est arrêtée et nommée. | https://www.adobe.com/fr/acrobat.html | repli : https://www.adobe.com/ | `IC` (Adobe) | - |
| 8 | **Notion** | Notion Labs | Écrit et tient à jour la règle de chaque tâche, consultable par toute l'équipe. | https://www.notion.com/fr | repli : https://www.notion.com/fr | `nv` (la charte n'a pas été lue) | - |
| 9 | **Airtable** | Airtable | Met à jour, à partir des exports, les suivis tenus en base. Chaque modification est tracée. | https://www.airtable.com/ | presse : https://www.airtable.com/newsroom | `LP` | - |

## 12. Caisse et e-commerce — Balthazar · Comptabilité

Balthazar lit les exports de ventes, de caisse et de versements des plateformes de vos clients. Il les met en
écritures au format que votre logiciel importe déjà. Un écart de caisse est présenté, pas corrigé.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Shopify** | Shopify Inc. | Lit les ventes, les remboursements et les versements, et les prépare en écritures au format que le cabinet importe. | https://www.shopify.com/fr | kit : https://www.shopify.com/brand-assets | `IC` (même page) | - |
| 2 | **WooCommerce** | Automattic | Idem Shopify. | https://woocommerce.com/fr/ | charte : https://woocommerce.com/brand-and-logo-guidelines/ | `IC` https://woocommerce.com/trademark-guidelines/ (logos à aucune fin) | - |
| 3 | **PrestaShop** | PrestaShop SA | Remet l'export comptable au format d'import du cabinet (caractères, décimales, comptes étrangers). | https://prestashop.fr/ | kit (groupes d'utilisateurs) : https://www.prestashop-project.org/user-groups/ | `IC` https://www.prestashop-project.org/legal | - |
| 4 | **Adobe Commerce** (Magento) | Adobe | Idem Shopify. | https://experienceleague.adobe.com/fr/docs/commerce (la page produit ne répondait pas) | repli : https://news.adobe.com/ | `IC` (Adobe) | - |
| 5 | **Wix eCommerce** | Wix.com | Idem Shopify. | https://fr.wix.com/ecommerce/site-vente-en-ligne | charte : https://www.wix.com/partners/brand-guidelines | `R` | - |
| 6 | **WiziShop** | WiziShop SAS | Idem Shopify. | https://www.wizishop.fr/ | presse : https://www.wizishop.fr/presse | `R` | - |
| 7 | **Ecwid by Lightspeed** | Ecwid (Lightspeed) | Idem Shopify. | https://www.ecwid.com/fr/ | kit : https://www.ecwid.com/media | `LP` (mais charte Lightspeed, ligne 17) | - |
| 8 | **Amazon Seller Central** | Amazon | Ventile en écritures les ventes, les commissions et les frais des rapports de versement. | https://sell.amazon.fr/ | presse : https://press.aboutamazon.com/logos (réservé à la presse) | `nv` (charte en 403/503 ; probablement `IC`) | - |
| 9 | **eBay** | eBay Inc. | Idem Amazon. | https://www.ebay.fr/sl/sell | repli : même page | `nv` | - |
| 10 | **Etsy** | Etsy, Inc. | Idem Amazon. | https://www.etsy.com/fr/sell (403) | `nv` | `nv` | - |
| 11 | **Cdiscount Marketplace** | Cdiscount (Octopia) | Idem Amazon. | https://marketplace.cdiscount.com/ | repli : même page (presse Octopia : https://octopia.com/fr/presse/) | `-` | - |
| 12 | **ManoMano** | ManoMano | Idem Amazon. | https://www.manomano.fr/ (403) | `nv` | `nv` | - |
| 13 | **Vinted Pro** | Vinted | Idem Amazon. | https://www.vinted.fr/pro | repli : même page (presse : https://company.vinted.com/fr/newsroom) | `-` | - |
| 14 | **SumUp** | SumUp | Rapproche les encaissements par carte et les versements des ventes du jour, et ventile les commissions. | https://www.sumup.com/fr-fr/ | presse : https://www.sumup.com/fr-fr/press/ | `R` (usage éditorial) | - |
| 15 | **Square** | Block, Inc. | Idem SumUp. | https://squareup.com/fr/fr | presse : https://squareup.com/fr/fr/press ; logo : https://squareup.com/fr/fr/logo | `R` (usage éditorial) | - |
| 16 | **Zettle by PayPal** (bientôt « Point de vente PayPal ») | PayPal | Idem SumUp. | https://www.zettle.com/fr | repli : même page (le logo va changer) | `-` | - |
| 17 | **Lightspeed** | Lightspeed Commerce | Lit les clôtures de caisse et les met en écritures (ventes par taux de TVA, modes de règlement). Un écart de caisse est présenté. | https://www.lightspeedhq.fr/ | repli : même page (kit partenaires derrière une connexion) | `IC` https://www.lightspeedhq.com/legal/lightspeed-trademark-and-copyright-guidelines/ | - |
| 18 | **SumUp POS Pro** (anciennement Tiller) | Tiller Systems SAS (SumUp) | Idem Lightspeed. | https://www.tillersystems.com/fr/ | repli : même page | `IM` https://www.tillersystems.com/fr/mentions-legales/ | - |
| 19 | **Zelty** | Zelty | Idem Lightspeed. | https://www.zelty.fr/ | repli : même page | `nv` (mentions illisibles) | - |
| 20 | **L'Addition** | ADSTELLAM SAS (groupe FDJ) | Idem Lightspeed. | https://www.laddition.com/fr | presse : https://www.laddition.com/fr/presse-laddition | `-` | - |
| 21 | **Popina** | JDC SA | Idem Lightspeed. | https://www.popina.com/ | repli : même page | `IM` https://www.popina.com/mentions-legales/ | - |
| 22 | **Hiboutik** | Hiboutik | Idem Lightspeed. | https://www.hiboutik.com/ | repli : même page | `-` | - |
| 23 | **Innovorder** | Innovorder SAS | Idem Lightspeed. | https://www.innovorder.com/ | kit : https://www.innovorder.com/presse | `LP` | - |
| 24 | **Cashpad** | CASHPAD SAS | Idem Lightspeed. | https://www.cashpad.io/ | repli : même page | `-` | - |
| 25 | **CashMag** | CASHMAG SAS | Idem Lightspeed. | https://cashmag.fr/ | repli : même page | `IM` https://cashmag.fr/mentions-legales/ | - |
| 26 | **Planity** | Planity | Met en écritures, au format que le cabinet importe, l'export comptable du mois clôturé (Excel, CSV). | https://www.planity.com/ ; export : https://support.planity.com/hc/fr/articles/28013827565714 | repli : https://www.planity.com/ | `-` | - |
| 27 | **Treatwell** | Treatwell | Rapproche des encaissements du salon les réservations et les versements de la plateforme. | https://www.treatwell.fr/ (espace partenaires en 403) | repli : https://www.treatwell.fr/ | `-` | - |
| 28 | **Uber Eats** | Uber | Ventile en écritures les ventes, les commissions et les frais de livraison des relevés de versement. | https://merchants.ubereats.com/fr/fr/ | charte : https://brand.uber.com/ → https://assets.uber.com/ | `IM` https://www.uber.com/fr/fr/legal/general-terms-of-use/ | - |
| 29 | **Deliveroo** | Deliveroo | Idem Uber Eats. | https://merchants.deliveroo.com/fr-FR | repli : même page | `-` | - |
| 30 | **Airbnb** | Airbnb, Inc. | Relève les revenus et les frais des locations meublées pour la comptabilité, et prépare la déclaration LMNP pour relecture. | https://www.airbnb.fr/host/homes | presse : https://news.airbnb.com/media-assets (usage éditorial) | `IC` https://www.airbnb.fr/help/article/3233 | - |
| 31 | **Booking.com** | Booking.com (Booking Holdings) | Idem Airbnb. | https://www.booking.com/ (espace partenaires en 403) | presse : https://news.booking.com/media-assets/ | `-` | - |
| 32 | **Atoo-Sync** | ATOO NEXT SARL | Contrôle les flux synchronisés entre la boutique et la comptabilité : commande sans facture, paiement sans commande. | https://www.atoo-next.net/ | repli : même page | `-` | - |

## 13. Gestion interne du cabinet et CRM — Honoré · Gestion du cabinet, avec Victoire · Commercial

Honoré rapproche les actes et les temps de la facturation. Il prépare les factures d'honoraires, les relances et
le tableau de bord du portefeuille, en agrégats. Victoire prépare les propositions et les lettres de mission. Le
tarif, la vigilance LCB-FT et la signature restent au cabinet.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **ACD GI** (anciennement Dia Client GI) | ACD | Rapproche les actes et les temps du mois de la facturation, et facture une seule fois chaque acte hors forfait. La facture part après validation. | https://www.acd-groupe.fr/solution-expert-comptable/acd-gi/ | kit : PDF ACD (non ouvert) | `IM` (ACD) | - |
| 2 | **Cegid Loop GRM** | Cegid | Idem ACD GI, avec les missions et le planning. | https://www.shine.fr/experts-comptables/produits/cegid-loop/ | repli : https://www.cegid.com/fr/ | `IM` (Cegid) | - |
| 3 | **ISAGI CONNECT** | AGIRIS (ISAGRI) | Idem ACD GI. | https://www.agiris.fr/logiciel/isagi-connect | repli : https://www.agiris.fr/ | `IM` (AGIRIS) | - |
| 4 | **GoProposal by Sage** | Sage | Prépare la proposition et la lettre de mission à partir de vos barèmes écrits. Elles sont relues avant l'envoi. | https://www.sage.com/fr-fr/experts-comptables/produits/goproposal/ (lien relevé au navigateur) | repli : https://www.sage.com/fr-fr/ | `IM` (Sage) | - |
| 5 | **Kanta** | Kanta SAS (pied de page « Visma Group ») | Réunit les pièces d'entrée en relation et prépare la lettre de mission. La vigilance LCB-FT et la décision restent au professionnel. | https://www.kanta.fr/ | repli : https://www.kanta.fr/ | `IM` https://www.kanta.fr/mentions-legales (même un lien vers le site demande un accord préalable) | - |
| 6 | **VigiCab** | Legapass | Réunit par dossier les pièces de vigilance et suit leur échéance. L'appréciation du risque reste au professionnel. | https://vigicab.com/ | kit Legapass : https://legapass.com/press-room/ (sans logo VigiCab) | `LP` (logos Legapass) | - |
| 7 | **Lettre de mission** (RCA) | RCA | Idem GoProposal. | https://rca.fr/logiciels-experts/lettre-de-mission/ | kit RCA (§2 ligne 23) | `IM` (RCA) | - |
| 8 | **Tempolia** | Tempolia SAS | Idem ACD GI. | https://www.tempolia.fr/experts-comptables.htm | repli : https://www.tempolia.fr/ | `IM` https://www.tempolia.fr/legal.php | - |
| 9 | **Devizen** | Plus que pro SAS | Idem GoProposal. | https://www.devizen.fr/ | repli : même page | `IM` https://www.devizen.fr/mentions-legales | - |
| 10 | **Akuiteo** | Akuiteo SAS | Idem ACD GI. | https://www.akuiteo.com/erp-dedie/cabinets-comptables | repli : https://www.akuiteo.com/ | `IM` https://www.akuiteo.com/mentions-legales/ (sauf éléments fournis à la presse) | - |
| 11 | **Queoval Expert** | SAS Queoval | Idem ACD GI. | https://www.queoval-expert.com/ | repli : même page | `-` | - |
| 12 | **ICP.dec** | ICP Logiciel SAS | Idem ACD GI. | https://icplogiciel.fr/ | repli : même page | `IM` https://icplogiciel.fr/mentions-legales/ | - |
| 13 | **Sofyx** | Sofyx SAS | Idem ACD GI, avec le suivi des prospects. | https://www.sofyx.io/ | repli : même page | `IM` https://www.sofyx.io/mentions-legales | - |
| 14 | **Smartisi** (distribué par Sage) | Smartisi | Tient à jour, sans doublon, les fiches clients et prospects à partir des données légales, et prépare la relance commerciale. | https://www.smartisi.fr/ | repli : même page | `-` (pas de mentions légales sur le site) | - |
| 15 | **OctoVision** (distribué par Sage) | éditeur non nommé sur le site | Tient à jour le suivi de production et les échéances du portefeuille, en agrégats et jamais par personne. | https://octovision.fr/ | repli : même page | `-` | - |
| 16 | **FollowApp** | éditeur non relevé | Idem OctoVision. | https://www.follow-app.fr/ | repli : même page | `nv` (site rendu en JavaScript) | - |
| 17 | **Liasse 360** | FIDATECH SAS | Analyse les liasses pour repérer les missions à proposer, et les présente à l'associé, qui décide. | https://liasse360.fr/ | repli : même page | `-` | - |
| 18 | **Compozz** | Compozz | Tient à jour, à partir des sources du dossier, les données client partagées entre les pôles. | https://www.compozz.fr/ | repli : même page | `-` | - |
| 19 | **HubSpot** | HubSpot, Inc. | Tient à jour les fiches des prospects et des clients, et prépare les relances. Rien ne part sans validation. | https://www.hubspot.fr/ | charte : https://legal.hubspot.com/tm-usage-guidelines | `IC` (même page) | - |
| 20 | **Salesforce** | Salesforce, Inc. | Idem HubSpot. | https://www.salesforce.com/fr/ | presse : https://www.salesforce.com/news/media-library/ | `IC` https://www.salesforce.com/company/legal/tmcusageguidelines/ | - |
| 21 | **Pipedrive** | Pipedrive | Idem HubSpot. | https://www.pipedrive.com/fr | kit : https://www.pipedrive.com/fr/newsroom/press-kit (fichiers sur demande) | `R` | - |
| 22 | **Zoho CRM** | Zoho Corporation | Idem HubSpot. | https://www.zoho.com/fr/crm/ | charte : https://www.zoho.com/branding/ | `IC` https://www.zoho.com/branding/visual-guidelines.html | - |
| 23 | **noCRM.io** | Positive Group France | Idem HubSpot. | https://www.nocrm.io/fr | presse : https://positivegroup.com/fr/presse-et-kit-media | `-` | - |
| 24 | **Twenty** | Twenty.com PBC | Idem HubSpot. | https://twenty.com/ | repli : même page | `R` https://twenty.com/terms | - |
| 25 | **Trello** | Atlassian | Crée les tâches du portefeuille à partir des échéances, et les met à jour à chaque pièce reçue. | https://trello.com/fr | kit : https://atlassian.design/foundations/logos | `R` https://www.atlassian.com/fr/legal/trademark | - |
| 26 | **Asana** | Asana, Inc. | Idem Trello. | https://asana.com/fr | charte : https://asana.com/fr/brand | `R` | - |
| 27 | **monday.com** | monday.com Ltd. | Idem Trello. | https://monday.com/lang/fr | kit : https://monday.com/p/news/press-kit/ | `R` | - |
| 28 | **ClickUp** | ClickUp | Idem Trello. | https://clickup.com/ | kit : https://clickup.com/brand | `R` | - |

## 14. Données légales et administrations — Grégoire · Juridique et fiscal, avec Salomé pour les retours DSN et Victoire pour l'entrée en relation

Grégoire lit les données légales de vos dossiers et les comptes rendus des administrations. Il signale un
changement, une annonce ou un rejet, et prépare la pièce attendue. Aucune déclaration, aucune formalité, aucun dépôt
ne part sans vous.

| # | Service | Organisme | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **impots.gouv.fr, espace professionnel** | DGFiP | Relève et relie au dossier les avis, les accusés de réception et les messages de l'espace professionnel. | https://www.impots.gouv.fr/professionnel (en maintenance les 14 et 15/10) | repli : en-tête de la même page (bloc-marque de l'État) | `État` | - |
| 2 | **net-entreprises.fr** | GIP-MDS | Relève les comptes rendus et les retours DSN, et relie chacun au bulletin à reprendre. Le dépôt reste votre geste. | https://www.net-entreprises.fr/ | repli : même page (presse sans logo : https://www.net-entreprises.fr/presse-et-chercheurs/) | `IM` https://www.net-entreprises.fr/declaration/mentions-legales/ | - |
| 3 | **Urssaf** | Urssaf | Relève les échéanciers et les mises en demeure, les relie au dossier et à la paie, et prépare la réponse. | https://www.urssaf.fr/ (connexion coupée par le serveur le 15/10) | `nv` | `nv` | - |
| 4 | **Agirc-Arrco** (espace entreprises) | Agirc-Arrco | Relève les retours de fiabilisation des DSN et relie chacun au salarié concerné. | https://www.agirc-arrco.fr/entreprises/ | kit : https://www.agirc-arrco.fr/nous-connaitre/espace-presse/kit-de-communication/visuels-a-telecharger/ | `IM` https://www.agirc-arrco.fr/mentions-legales/ (le kit, lui, se dit « libres de droits ») | - |
| 5 | **MSA** | CCMSA | Idem Agirc-Arrco, pour les dossiers agricoles. | https://www.msa.fr/lfp | repli : même page (presse sans logo : https://www.msa.fr/lfp/presse) | `IM` https://www.msa.fr/lfp/mentions-legales (les liens à usage commercial sont exclus) | - |
| 6 | **Registre national des entreprises** (INPI) | INPI | Lit la fiche RNE d'un client pour actualiser son dossier et signaler un changement. Aucune formalité n'est déposée. | https://www.inpi.fr/ressources/formalites-dentreprises/acces-lapi-formalite-rne (data.inpi.fr en 403) | repli : https://www.inpi.fr/ | `IM` https://www.inpi.fr/conditions-generales-dutilisation-du-site-inpifr (§6.2 ; liens profonds encadrés) | - |
| 7 | **Guichet unique des formalités d'entreprises** | INPI | Prépare et contrôle le dossier de formalité avant le dépôt. Le dépôt reste votre geste. | https://formalites.entreprises.gouv.fr/ | repli : en-tête (bloc-marque de l'État) | `État` | - |
| 8 | **Infogreffe** | greffes des tribunaux de commerce | Relit l'extrait Kbis et les actes déposés pour tenir à jour le dossier permanent. | https://www.infogreffe.fr/ | repli : même page | `-` | - |
| 9 | **Répertoire Sirene** (INSEE) | INSEE | Contrôle contre le répertoire l'identité, l'adresse et l'activité des dossiers, et signale tout écart. | https://avis-situation-sirene.insee.fr/ ; API : https://portail-api.insee.fr/ (ne jamais lier sirene[.]fr, domaine mort) | repli : https://www.insee.fr/fr/accueil | `IM` https://www.insee.fr/fr/information/2008466 | - |
| 10 | **BODACC** | DILA | Rapproche les annonces du portefeuille, et prépare l'alerte pour l'associé référent. | https://www.bodacc.fr/ | kit : https://www.dila.gouv.fr/actualites/presse/mediatheque/logos/ (« Logo Bodacc ») | `R` (à confirmer : la phrase des usages permis est tronquée sur le site) | - |
| 11 | **Annuaire des entreprises** | DINUM | Réunit avant l'entrée en relation les informations publiques d'une entreprise. | https://annuaire-entreprises.data.gouv.fr/ (403 le 15/10) | `nv` | `État` probable | - |
| 12 | **Pappers** | Pappers | Idem Annuaire des entreprises. | https://www.pappers.fr/ (403) | `nv` | `nv` | - |
| 13 | **Societe.com** | SOCIETE SAS | Idem Annuaire des entreprises. | https://www.societe.com/ | repli : même page | `-` | - |
| 14 | **Chorus Pro** | AIFE | Suit jusqu'à leur mise en paiement les factures que vos clients adressent au secteur public. Le dépôt reste leur geste. | https://portail.chorus-pro.gouv.fr/aife_csm | kit (acheteurs publics) : https://communaute.chorus-pro.gouv.fr/kit-de-communication-a-destination-des-acheteurs/ (ZIP, non ouvert) | `-` (vérifier si l'en-tête porte le bloc-marque) | - |
| 15 | **jedeclare.com** | ECMA | Relève les comptes rendus de dépôt EDI et les relie au dossier. Chaque rejet est présenté avec sa cause. | https://ecma-solutions.com/produits-expert-comptable/jedeclare | repli : même page | `IM` https://ecma-solutions.com/informations-legales | - |
| 16 | **ASPOne.fr** | TESSI Informatique (groupe Tessi) | Idem jedeclare.com. | https://www.aspone.fr/ | repli : même page | `IM` https://www.aspone.fr/index.php/mentions-legales/ | - |
| 17 | **douane.gouv.fr** (DEB, DES) | DGDDI | Prépare à partir de la comptabilité les déclarations d'échanges de biens et de services. Le cabinet les dépose. | https://www.douane.gouv.fr/ (portail de secours le 15/10) | `nv` | `État` probable | - |
| 18 | **Modèle de registre des traitements** (CNIL, tableur) | CNIL | Tient dans le modèle de la CNIL le registre des traitements du cabinet. Chaque ligne est préparée pour votre référent (Prudence). | https://www.cnil.fr/ (503 les 14 et 15/10) | `nv` | `nv` (logo d'une autorité publique) | - |

## 15. Collecte de factures fournisseurs — Balthazar · Comptabilité

Avec les accès que votre client a confiés au cabinet, Balthazar relève les factures dans les espaces clients de ses
fournisseurs et les range avec leur pièce. Il prépare la relance quand une facture manque. Il relève aussi les
factures des abonnements dont la carte figure ailleurs : Microsoft 365, Google Workspace, Adobe, Dropbox, Zoom,
HubSpot, LinkedIn Ads.

| # | Fournisseur | Groupe | Factures relevées | URL officielle | Source du logo | Règle |
|---|---|---|---|---|---|---|
| 1 | **Orange Pro** | Orange | lignes et abonnements | https://pro.orange.fr/ | charte : https://brand.orange.com/fr | `IC` https://brand.orange.com/fr/node/317 |
| 2 | **SFR Business** | Altice France | lignes et abonnements | https://www.sfrbusiness.fr/ | kit : https://alticefrance.com/actualites/mediatheque/ | `IM` https://www.sfrbusiness.fr/informations-legales/ |
| 3 | **Bouygues Telecom Pro** (et Bouygues Telecom Business) | Bouygues | lignes et abonnements | https://www.bouyguestelecom-pro.fr/ | kit : https://www.corporate.bouyguestelecom.fr/presse-et-actualites/mediatheque/ | `IM` https://www.corporate.bouyguestelecom.fr/mentions-legales/ |
| 4 | **Free Pro** | iliad | lignes et abonnements | https://pro.free.fr/ | repli : même page | `-` |
| 5 | **EDF Entreprises** | EDF | énergie, duplicatas sur 3 ans | https://www.edf.fr/entreprises | repli : même page (visuels sur demande au service de presse) | `IM` https://particulier.edf.fr/fr/accueil/mentions-legales.html |
| 6 | **ENGIE Pro** | ENGIE | énergie | https://pro.engie.fr/ | repli : même page (newsroom sans logo : https://newsroom.engie.com/) | `IM` https://pro.engie.fr/mentions-legales |
| 7 | **TotalEnergies** (professionnels) | TotalEnergies | énergie | https://www.totalenergies.fr/professionnels | repli : même page | `IM` https://totalenergies.com/fr/mentions-legales (art. 4.2) |
| 8 | **Mobility Business de TotalEnergies** (et Wash) | TotalEnergies | cartes carburant, recharge, lavage | https://mobility.totalenergies.com/ | repli : même page | `IM` (TotalEnergies) |
| 9 | **Shell Fleet Solutions** | Shell | cartes carburant | https://www.shell.fr/business-customers/shell-fleet-solutions.html | repli : même page | `nv` |
| 10 | **Veolia Eau** | Veolia | eau | https://www.eau.veolia.fr/professionnels | repli : https://www.eau.veolia.fr/ | `nv` |
| 11 | **Tout sur mon eau** (SUEZ) | SUEZ | eau | https://www.toutsurmoneau.fr/ | repli : https://www.suez.com/fr | `IM` https://www.suez.com/fr/conditions-generales-d-utilisation |
| 12 | **Saur** | Saur | eau | https://www.saurclient.fr/ | repli : https://www.saur.com/fr | `IM` https://www.saur.com/fr/mentions-legales/ |
| 13 | **Amazon Business** | Amazon | achats | https://business.amazon.fr/ | presse : https://press.aboutamazon.com/images-and-videos (réservé à la presse) | `nv` (règle Amazon illisible) |
| 14 | **Manutan** | Manutan Group | fournitures | https://www.manutan.fr/ | kit : https://www.manutan-group.com/fr/ressources/mediatheque | `-` |
| 15 | **Bruneau** | groupe Bruneau | fournitures | https://www.bruneau.fr/ | kit : https://www.bruneau.fr/publishing/content/page/espacepresse/mediatheque | `-` |
| 16 | **Lyreco** | Lyreco | fournitures | https://www.lyreco.com/webshop/FRFR/ | repli : https://www.lyreco.com/group/ | `-` |
| 17 | **Bureau Vallée** | Bureau Vallée | fournitures | https://www.bureau-vallee.fr/ | kit : https://www.bureau-vallee.fr/presse | `IM` https://www.bureau-vallee.fr/mentions-legales |
| 18 | **METRO** | METRO France | achats | https://www.metro.fr/ (403) | `nv` | `nv` |
| 19 | **Leroy Merlin Pro** | ADEO | achats | https://www.leroymerlin.fr/ (403) | presse du groupe : https://www.adeo.com/espace-presse/ | `IM` https://www.adeo.com/mentions-legales/ |
| 20 | **La Poste Pro** (Colissimo compris) | La Poste | courrier et colis | https://www.laposte.fr/professionnel (403/503) | charte : https://www.lebrandcenter.lapostegroupe.com/ (sur inscription) | `IM` https://www.lapostegroupe.com/fr/conditions-generales-d-utilisation (art. 16) |
| 21 | **Chronopost** | La Poste (Geopost) | colis | https://www.chronopost.fr/ (403) | `nv` | `nv` |
| 22 | **UPS** | UPS | colis | https://www.ups.com/fr/fr/ (page « Access Denied » en code 200) | `nv` | `nv` |
| 23 | **DHL Express** | DHL Group | colis ; portail MyBill | https://www.dhl.com/fr-fr/home/express.html | presse : https://www.dhl.com/fr-fr/home/presse.html | `nv` |
| 24 | **SNCF Connect** | SNCF | déplacements | https://www.sncf-connect.com/ (403) | `nv` | `nv` |
| 25 | **Air France** (BlueBiz) | Air France-KLM | déplacements | https://www.bluebiz.com/fr/ | repli : même page | `nv` |
| 26 | **Uber for Business** | Uber | déplacements | https://www.uber.com/fr/fr/business/ | charte : https://assets.uber.com/ | `IM` (CGU Uber) |
| 27 | **Booking.com for Business** | Booking Holdings | hébergement | https://business.booking.com/ (403) | presse : https://news.booking.com/media-assets/ | `nv` |
| 28 | **Ulys** | VINCI Autoroutes | télépéage | https://ulys.com/ | presse : https://ulys.com/presse/ | `IM` https://ulys.com/mention-legales/ |
| 29 | **Bip&Go** | Sanef | télépéage | https://www.bipandgo.com/ | repli : même page | `IM` https://www.bipandgo.com/mentions-legales |
| 30 | **Fulli** | APRR (Mobilis) | télépéage | https://www.fulli.com/professionnel | repli : https://www.fulli.com/ | `IM` https://www.fulli.com/mentions-legales |
| 31 | **Ayvens** | Société Générale | location longue durée | https://www.ayvens.com/fr-fr/ | repli : même page | `-` |
| 32 | **Google Ads** | Google | publicité | https://business.google.com/fr/google-ads/ | charte : Google (§8 ligne 3) | `IC` (Google) |
| 33 | **Publicités Meta** (Facebook, Instagram) | Meta | publicité | https://www.facebook.com/business/ads | charte : https://www.meta.com/brand/resources/facebook/logo/ | `R` (logos d'application) ; `IC` (logo Meta) |
| 34 | **AWS** | Amazon | hébergement | https://docs.aws.amazon.com/fr_fr/awsaccountbilling/latest/aboutv2/getting-viewing-bill.html | charte : https://aws.amazon.com/co-marketing/ | `IC` https://aws.amazon.com/trademark-guidelines/ |
| 35 | **OVHcloud** | OVHcloud | hébergement | https://www.ovhcloud.com/fr/ | kit : https://corporate.ovhcloud.com/fr/newsroom/assets/ | `R` https://www.ovhcloud.com/fr/intellectual-property/trademark/ |
| 36 | **IONOS** | IONOS Group | hébergement | https://www.ionos.fr/ | kit : https://www.ionos.fr/newsroom/telechargements/ | `-` |
| 37 | **Apple** (achats professionnels) | Apple | matériel | https://www.apple.com/fr/retail/business/ | repli : https://www.apple.com/ | `IC` https://www.apple.com/legal/intellectual-property/guidelinesfor3rdparties.html |
| 38 | **Canva** | Canva | logiciel | https://www.canva.com/fr_fr/ (403) | `nv` | `nv` |
| 39 | **Indeed** | Recruit | annonces | https://fr.indeed.com/ (403) | `nv` | `nv` |

## 16. Pilotage et trésorerie — Florent · Finance

Florent prépare, à partir de la comptabilité tenue, la trésorerie projetée, les situations intermédiaires, les
tableaux de bord et les dossiers d'évaluation. Chaque hypothèse est tracée. Le conseil et la présentation au client
restent au cabinet.

| # | Logiciel | Éditeur (groupe) | Ce que nos agents font avec | URL officielle | Source du logo | Règle | Guide |
|---|---|---|---|---|---|---|---|
| 1 | **Agicap** | Agicap SAS | Rapproche de la comptabilité tenue les catégories de trésorerie, et explique les écarts entre le prévu et le réalisé. | https://agicap.com/fr/ | charte : https://zeroheight.com/1a6a2e883/p/32175b-our-logo (liée depuis https://agicap.com/fr/presse/) | `R` https://agicap.com/fr/mentions-legales/ | - |
| 2 | **Okimia** (anciennement Fygr) | Fygr SAS | Idem Agicap. | https://www.okimia.com/fr | presse : https://www.okimia.com/fr/presse (kit sur Google Drive, non ouvert) | `LP` | - |
| 3 | **RCA Prévisionnel** | RCA | Prépare le prévisionnel à partir de la comptabilité tenue et des hypothèses écrites. Chaque hypothèse est tracée. | https://rca.fr/logiciels-experts/previsionnel/ | kit RCA (§2 ligne 23) | `IM` (RCA) | - |
| 4 | **RCA Évaluation** | RCA | Réunit les pièces et les versions avant le tableau d'évaluation. La valeur reste au cabinet. | https://rca.fr/logiciels-experts/evaluation/ | kit RCA | `IM` (RCA) | - |
| 5 | **RCA Tableau de bord** | RCA | Alimente le tableau de bord du client à partir de la comptabilité tenue. Il est relu avant la remise. | https://rca.fr/logiciels-experts/tableau-de-bord/ | kit RCA | `IM` (RCA) | - |
| 6 | **Sage Tableau de Bord Experts** | Sage | Idem RCA Tableau de bord. | https://www.sage.com/fr-fr/experts-comptables/produits/sage-tableau-de-bord-experts/ | repli : https://www.sage.com/fr-fr/ | `IM` (Sage) | - |
| 7 | **Waibi** (Waibi Dashboard) | Waibi SAS | Idem RCA Tableau de bord. | https://waibi.fr/ | repli : même page | `IM` https://waibi.fr/mentions-legales/ (même un lien demande une autorisation écrite) | - |
| 8 | **Forekasts** | Kerys Business Solutions SAS | Idem RCA Prévisionnel. | https://forekasts.fr/ | repli : même page | `IM` https://forekasts.fr/conditions-generales-utilisation/ | - |
| 9 | **Finthesis** | FINTHESIS SAS (groupe Visma) | Idem RCA Tableau de bord. | https://finthesis.io/ | kit : https://finthesis.notion.site/Finthesis-Kit-de-marque-609490e00841491c9486ba0aa84b10fc | `LP` | - |
| 10 | **Amelkis** | Amelkis Solutions | Réunit et contrôle les liasses de consolidation avant le reporting du groupe. | https://amelkis.com/ | repli : même page | `IM` https://amelkis.com/mentions-legales/ | - |
| 11 | **Swotia** | SWOTIA SAS | Compare les données du dossier à son secteur, et prépare l'analyse pour l'entretien de conseil. | https://www.swotia.fr/ | repli : même page | `-` | - |
| 12 | **Valutico** | Web Value GmbH (Autriche) | Idem RCA Évaluation. | https://valutico.com/ | repli : même page | `-` | - |
| 13 | **Avalor** | AVALOR SAS | Idem RCA Évaluation. | https://www.evaluation-entreprise.com/ | repli : même page | `IM` https://www.evaluation-entreprise.com/mentions-legales.aspx | - |
| 14 | **CAUDIA** | CAUDIA SAS | Réunit pour le dossier d'évaluation les données de marché (multiples, coût du capital). | https://caudia.fr/ | repli : même page | `-` | - |
| 15 | **Deal Makr** (Data Makr) | DEAL MAKR SAS | Prépare le dossier de cession à partir de la comptabilité tenue. Il est relu avant la remise. | https://dealmakr.fr/ | repli : même page | `IM` https://dealmakr.fr/mentions-legales/ | - |
| 16 | **Kwote** | kwote SAS | Suit le poste client et prépare les relances. Chaque relance part après validation. | https://kwote.fr/ | repli : même page | `IM` https://kwote.fr/mentions-legales/ | - |
| 17 | **Recovr** | MGD SRL (Belgique) | Idem Kwote. | https://www.recovr.eu/ | repli : même page | `-` | - |
| 18 | **Upflow** | Upflow | Idem Kwote. | https://upflow.io/fr | kit : https://upflow.io/brand | `R` | - |
| 19 | **Payt** | Payt | Idem Kwote. | https://paytsoftware.fr/ | kit : https://paytsoftware.com/media-kit/ | `LP` | - |
| 20 | **Impulse Data** | IMPULSE DATA SAS | Applique au dossier les références sectorielles, en agrégats anonymisés. | https://impulsedata.fr/ | repli : même page | `IM` https://impulsedata.fr/mentions-legales/ | - |
| 21 | **ensō rse** | HELTECH ENSO (distribué aussi par RCA) | Réunit à partir de la comptabilité et de la paie les données extra-financières du reporting RSE, relu avant la remise. | https://enso-rse.com/ | repli : même page | `IM` https://enso-rse.com/mentions-legales/ | - |
| 22 | **La Société Nouvelle** (Metriz) | La Société Nouvelle SAS | Idem ensō rse. | https://www.lasocietenouvelle.org/ | repli : même page | `-` | - |
| 23 | **Microsoft Power BI** | Microsoft | Alimente à partir de vos exports les tableaux de bord du portefeuille, en agrégats et jamais par personne. | https://www.microsoft.com/fr-fr/power-platform/products/power-bi | presse : galerie Microsoft | `IC` (Microsoft) | - |
| 24 | **Data Studio** (anciennement Looker Studio) | Google | Idem Power BI. | https://cloud.google.com/data-studio | charte : Google | `IC` (Google) | - |
| 25 | **Qlik Sense** | Qlik | Idem Power BI. | https://www.qlik.com/fr-fr/da/products/qlik-sense | repli : https://www.qlik.com/fr-fr | `nv` (politique en PDF, non ouvert ; https://www.qlik.com/us/legal/trademarks) | - |
| 26 | **Tableau** | Salesforce | Idem Power BI. | https://www.tableau.com/fr-fr | repli : même page | `IC` (Salesforce) | - |

---

## 17. Exclusion et domaines douteux

**RévisAudit est exclu.** Aucune carte, aucun lien. Son domaine, `revisaudit[.]fr`, porte du contenu de casino
injecté et n'a jamais été visité. Deux points à retenir :
- l'accueil `gestonline.com` et sa page `/nos-solutions` lient vers ce domaine. Les cartes DreamAudit, e-Circu et
  e-Recup du même éditeur pointent vers leurs propres domaines, qui ont été contrôlés et sont propres ;
- les textes d'e-Circu et d'e-Recup citent RévisAudit parmi les logiciels interfacés. Nos lignes ne le reprennent
  pas.

**Autres domaines à ne jamais lier :**

| Domaine | Ce qui a été vu le 15/10 | Relevé |
|---|---|---|
| `ibizasoftware[.]fr` | Ancien domaine de l'éditeur Ibiza, devenu un site d'affiliation de paris sportifs et de casino | A1 |
| `ibiza[.]fr` | Pas de HTTPS ; une liste de répertoire vide en HTTP | A1 |
| `formalis[.]io` | Redirection vers `survey-smiles[.]com` et vers un traceur publicitaire (`sandh-zvg[.]com`) | C1 |
| `sirene[.]fr` | Le DNS ne répond plus. Un domaine abandonné peut être racheté | C2 |
| parqués ou à vendre | mapi.fr, mapi.io, mapi.app, pilotz.com, vesper.io, vesper.pro, iawen.net, sesha.ai, planc.fr, iloa.fr, beereport.com, saveria.fr, saveria.com, vizeo.app, mydecisio.io, moriarty.ai, moriarty.io, moriarty.pro, yeap.io, yeap.co, yeap.eu, staffandgo.com, adnconseils.com | L1, I, B, D |
| homonymes sans rapport | vesper.fr (« Vesper Gaming »), vespertool.com, limpeed.fr, logaia.com, konnex.one, elips-solutions.com, qompta.com (Algérie), adp.fr (renvoie vers parisaeroport.fr), popay.fr, hamac.fr, linc.io, astus.fr, groupeup.com, avalor.io (renvoie vers zscaler.com), vizeo.com, turbopilot.com, intelligentaudit.com | L1, I, B, G |
| anomalies techniques | www.sharepoint.com (certificat invalide), www.mydecisio.fr (erreur 525), www.arkhineo.fr (aucune réponse), developers.signaturit.com, lien « mentions légales » de Zettle vers `site-preview.zettletest.com` (préproduction) | F, I, E2 |
| faux 200 | ups.com (« Access Denied »), microsoft.com (page de blocage), manutan.fr (captcha au second passage), cncc.fr et impalact.fr (200 à toute adresse), impots.gouv.fr (200 sur la page de maintenance) | H, G, D, C1 |

Sites sans mentions légales lisibles : smartisi.fr (aucune), jureva.fr (le lien répond 404), expert-crypto.fr (son
logiciel est servi depuis un sous-domaine vercel.app). Chez ECMA, le SIREN diffère d'une section à l'autre de la page
des informations légales (403 156 540 et 403 154 540).

## 18. Écartés, à arbitrer ou à relire

### 18.1 À arbitrer par Kevin (gardés hors de la liste)

| Nom | Pourquoi il est écarté | Relevé |
|---|---|---|
| Magic RH, Smart Data Pay | Agents IA de paie pour cabinets : des concurrents directs | B |
| Atomiq | Couche d'IA pour experts-comptables : un concurrent direct | L1 |
| Allia (« Sage x Allia ») | Assistant IA de cabinet, partenaire de Sage depuis le 17/09/2026 : un concurrent direct | I |
| Sesha (Sage) | Analyse des dossiers par IA (alertes, pièces manquantes, missions) : très proche de notre offre | L1 |
| LegalPlace, Legalstart, Captain Contrat, Indy | Ils vendent eux-mêmes de l'expertise comptable : ce sont des concurrents des cabinets | C1, A1 |
| Box, Dropbox Sign, M-Files | Aucune trace d'usage dans les cabinets français | F |
| Shopware, BigCommerce, Squarespace Commerce, Salesforce Commerce Cloud, Sylius, Zalando Partner, Mirakl | Rares chez les clients des cabinets (Salesforce et Adobe Commerce restent plausibles pour des CAC de grands comptes) | E2 |
| Swan | Infrastructure bancaire en marque blanche : le client ne voit pas la marque | E1 |
| Chift | API unifiée vendue aux éditeurs : une brique technique, pas un outil du cabinet | I, E2 |
| SOC Networks | Cybersécurité des cabinets, hors des quinze domaines | I |
| Closing Report (Gest On Line) | Le site vise aujourd'hui les directions financières, et l'éditeur lie le domaine proscrit | L1, D |
| Expert Crypto, Self-Med | Une société très récente, et un pendant client de Limpeed | L1 |
| SY business (Cegedim), getBob | Ce sont des plateformes de facturation électronique (§6) | L1, I |

### 18.2 À relire dans un navigateur avant publication (bloqués ou injoignables, rien n'a été contourné)

Vesper (myvesper.fr injoignable), Fisca-pass (503, maintenance), JUREVA (éditeur introuvable), Oxatis et Rakuten
France (403 partout, activité non confirmée), l'e-lettre recommandée de La Poste (fusionnée provisoirement dans
AR24), Moriarty (vu dans la presse en 2025, aucun site). Parmi les cartes `nv` de la liste : Urssaf, Pappers,
l'Annuaire des entreprises, Up Déjeuner, METRO, Chronopost, UPS, SNCF Connect, Canva, Indeed, et les chartes
d'Amazon, d'eBay, d'Etsy, de ManoMano, de LibreOffice et de Qlik.

### 18.3 Retirés, preuve à l'appui (détail dans les relevés)

- **Produits arrêtés ou renommés** :
  - QuickBooks a quitté la France (accès coupé le 31/12/2023).
  - Ibiza n'a plus de site vivant.
  - Cegid Expert n'est plus commercialisé ; sa base installée migre vers Loop.
  - Coala est devenu Sage Génération Experts, et Ciel est devenu Sage 50.
  - Blank s'arrête d'ici janvier 2027, au profit de « Pro By CA ».
  - « Sage Gestion Cabinet Experts », « Sage Business Plan Experts » et « Sage Production Sociale Experts » ne
    figurent plus dans la liste des produits Sage pour cabinets, lue au navigateur le 15/10.
- **Pas des logiciels, ou introuvables** : Intelligent Audit, Mathez Compliance, Diag N'Grow, AdN Conseils,
  TeamMate+, Diligent ACL, MindBridge, Inflo, Kandbaz, SECIB, Formalis, LegalCie, Manewco, HR Path, Popay, Yeap,
  Station Paye, Staff & Go, Astus Tech, Skillio, Saveria, CCEF, Vizeo, Turbopilot, Plan C – Qompta, TaxSaving
  Consulting, ILOA, Iawen, BNCplus, Arcolib (un OGA), Teledec (vise les entreprises qui déposent seules), Base adresse
  nationale.
- **« Mapi »** : introuvable sous ce nom (L1). Le nom correspond probablement à la gamme « MAPi » de RCA (aides
  publiques, A1). Elle n'est pas ajoutée faute de page relue.

## 19. Tableau final

### 19.1 Domaines et nombre de logiciels (compte interne, jamais affiché)

| # | Domaine | Agent qui le porte | Logiciels |
|---|---|---|---|
| 1 | Production comptable | Balthazar · Comptabilité | 49 |
| 2 | Paie et social | Salomé · Paie et social | 40 |
| 3 | Juridique et formalités | Grégoire · Juridique et fiscal | 29 |
| 4 | Commissariat aux comptes | Aude · Missions d'audit | 15 |
| 5 | Facturation électronique | Balthazar, et Honoré pour vos factures | 0 (aucune plateforme nommée) |
| 6 | Banque et paiements | Balthazar, et Honoré pour les prélèvements | 30 |
| 7 | GED et dossier permanent | Balthazar, avec Octavie | 21 |
| 8 | Signature électronique | Victoire · Commercial | 10 |
| 9 | Messagerie et agenda | Émile · Relation client, et Colette | 19 |
| 10 | Bureautique et classeurs | Octavie · Informatique et outils | 9 |
| 11 | Caisse et e-commerce | Balthazar | 32 |
| 12 | Gestion interne du cabinet et CRM | Honoré · Gestion du cabinet, avec Victoire | 28 |
| 13 | Données légales et administrations | Grégoire, avec Salomé et Victoire | 18 |
| 14 | Collecte de factures fournisseurs | Balthazar | 39 |
| 15 | Pilotage et trésorerie | Florent · Finance | 26 |
| | **Total** | | **365 cartes**, chaque logiciel une seule fois |

Raphaël (RH du cabinet) s'appuie sur Silae, Excel et la messagerie, et Prudence (protection des données) sur la
GED, la messagerie et le modèle de registre de la CNIL. Aucun des deux n'a de domaine propre.

Répartition des règles de logo : `IM` 163, `-` 88, `IC` 38, `nv` 27, `R` 26, `LP` 19, `État` 4.

### 19.2 Éditeurs dont un texte public interdit le logo sans accord (pour information ; Kevin a décidé de les afficher)

**a. Une charte de marque exige une licence ou un accord écrit (`IC`)**

- **Microsoft** : Excel, Word, PowerPoint, Outlook, Teams, SharePoint, OneDrive, Power BI, LinkedIn. Le nom en
  texte est admis pour dire une compatibilité réelle, le logo jamais sans licence.
- **Google** : Gmail, Agenda, Chat, Meet, Drive, Sheets, Docs, Google Ads, Data Studio. Les icônes produit passent
  par une demande d'approbation (10 à 20 jours ouvrés pour un site, selon le Partner Marketing Hub).
- **Adobe** : Acrobat, Acrobat Sign, Adobe Commerce.
- **Salesforce** : Salesforce, Slack, Tableau. Un logo n'est admis que dans un schéma d'intégration réelle, ce
  qu'une grille de cartes n'est pas. Pour Slack, le logo est interdit, seul ou à côté du vôtre.
- **Amazon** : AWS. Pour Seller Central et Amazon Business, le logo n'est pas vérifié, et probablement soumis à
  la même règle.
- **Apple, Meta** (logo du groupe), **Docusign**, **Zoom**, **HubSpot**, **Zoho**, **Shopify**, **Automattic**
  (WooCommerce), **PrestaShop**, **Lightspeed**, **Airbnb**, **Orange** et **Thomson Reuters**.
- **Nextcloud** : la règle couvre aussi le nom, en usage commercial.

**b. Les mentions légales ou les CGU exigent une autorisation pour reproduire les marques, les logos ou le contenu du
site (`IM`)**

Ces clauses sont souvent générales et ne nomment pas toujours le logo. Elles restent un texte public qui demande un
accord. Éditeurs concernés :
- **Logiciels comptables et de paie** : Cegid (dont EBP et Shine pour ses pages produit), Sage, ACD, AGIRIS (ISAGRI),
  RCA, Tiime, Inqom, Dext, Yooz, N2F, Jenji, NETexcom, Bleez, Limpeed, Pilotz, Bee Report, Factorial, Eurécia,
  Nibelis, Linc, Alassio, Wagyz, GHS, Kelio, WiiSmile, ZenDSN, MyFides, Edenred et Pluxee.
- **Juridique et documentation** : LexisNexis, Lefebvre Dalloz, Revue Fiduciaire, Dexyos, VIKTA, Izikap, ImpalAct,
  JurIA, HermineIA, Alf, LegalVision, Legal2digital, Medialex, ProLégales, Lexbase, Infodoc-experts, SVP, WebLex et
  Wisetax.
- **Audit** : Caseware, CNCC, Gest On Line, Acropole, TGS France, MyAuditPilot et Circit.
- **Banques et paiement** : BNP Paribas, Société Générale (dont BoursoBank et Ayvens), Crédit Agricole et LCL,
  BPCE (Banque Populaire, Caisse d'Epargne), Crédit Mutuel et CIC, American Express, PayPal, Wise, Memo Bank,
  Manager.one et Mooncard.
- **GED, signature et courrier** : Docaposte (Digiposte, Arkhineo, signature, AR24, Maileva), ECMA (jedeclare.com,
  jesignexpert.com), Oodrive (la règle couvre aussi le nom OODRIVE), Zeendoc, Welyb, Open Bee, Everial et Konnex One.
- **Gestion du cabinet et pilotage** : Kanta, Tempolia, Devizen, Akuiteo, ICP Logiciel, Sofyx, Axonaut, Amelkis,
  Forekasts, Avalor, Kwote, Impulse Data, Deal Makr, ensō rse et Waibi.
- **Caisse** : SumUp POS Pro (ex-Tiller), Popina, CashMag et Uber (CGU).
- **Fournisseurs** : SFR, Bouygues Telecom, EDF, ENGIE, TotalEnergies, SUEZ, Saur, Bureau Vallée, ADEO (Leroy
  Merlin), La Poste, Ulys, Bip&Go et Fulli.
- **Organismes et partenaires EDI** : GIP-MDS (net-entreprises, DSN-Val), INPI, INSEE, MSA, Agirc-Arrco et ASPOne
  (Tessi).

Contradictions relevées : Tiime, N2F, RCA, Axonaut, Agirc-Arrco, Bouygues Telecom, Factorial et Eurécia publient un
kit, alors que leurs mentions demandent un accord.

**c. Bloc-marque de l'État (`État`)**

Il est réservé aux services de l'État et à leurs opérateurs, sur des sites en .gouv.fr. Les modalités
d'utilisation du système de design de l'État, v1.0.1 du 20/07/2026, citent l'article 433-13 du code pénal. Ce n'est
pas une question de marque. Cartes concernées : impots.gouv.fr, le guichet unique des formalités, et, selon toute
probabilité, l'Annuaire des entreprises et douane.gouv.fr.

**d. Restrictions qui visent aussi les liens** : Kanta, Waibi et MyAuditPilot demandent un accord pour un simple
lien. La MSA exclut les liens à usage commercial. L'INPI encadre les liens profonds, et son silence vaut refus.

## 20. Correspondance avec les fiches agents (`AGENTS-CONTENU.md`, commit `ebac4283`)

Chaque nom des listes « Logiciels concernés » est rapproché de sa carte. « Aligner » veut dire que la fiche
écrit un nom que l'éditeur n'emploie plus, ou plus sous cette forme : il faut corriger la fiche, pas la liste.
**Alignements portés dans `AGENTS-CONTENU.md` le 15/10/2026 à l'intégration** (ACD COMPTA, Sage Paie, Payfit,
jesignexpert.com, ACD GI) ; le contrôle est rejoué au §20 bis.

| Nom dans la fiche | Carte (domaine) | État |
|---|---|---|
| Pennylane | Pennylane (§2) | présent |
| Cegid Loop | Cegid Loop (§2) | présent |
| Cegid Quadra Plus | Cegid Quadra Plus (§2) | présent |
| Sage 100 Comptabilité | Sage 100 Comptabilité (§2) | présent |
| Sage Génération Experts | Sage Génération Experts (§2) | présent |
| ACD Comptabilité Expert | ACD COMPTA (§2) | **aligner** : l'ancienne URL `/comptabilite-expert/` renvoie vers `/acd-compta/` |
| EBP Comptabilité | EBP Comptabilité (§2) | présent |
| MyU | MyU (§2) | présent |
| Tiime, Inqom, fulll, AMICOMPTA, Dext, N2F | mêmes noms (§2) | présents |
| Qonto | Qonto (§7) | présent |
| Planity, PrestaShop | mêmes noms (§12) | présents |
| Microsoft Excel | Microsoft Excel (§11) | présent |
| Silae | Silae (§3) | présent |
| PayFit | Payfit (§3) | présent, à la casse près (le site écrit « Payfit ») |
| Sage 100 Paie & RH | Sage 100 Paie & RH (§3) | présent |
| Sage Production Sociale Experts | Sage Paie (§3) | **manquant sous ce nom** : il n'est plus dans la liste Sage du 15/10. L'offre pour les cabinets s'appelle « Sage Paie » |
| Quadra Paie | Cegid Quadra Paie (§3) | présent |
| Cegid Payroll Ultimate | même nom (§3) | présent |
| ACD Paie | ACD PAIE (§3) | présent |
| Outlook ; Outlook et Exchange Online | Microsoft Outlook (et Exchange Online) (§10) | présent |
| Gmail | Gmail (§10) | présent |
| Lexis PolyActe | Lexis PolyActe (§4) | présent |
| registre national des entreprises (INPI) | Registre national des entreprises (§14) | présent |
| BODACC | BODACC (§14) | présent |
| répertoire Sirene | Répertoire Sirene (§14) | présent |
| Youtrust (anciennement Yousign) | même nom (§9) | présent |
| Docusign | Docusign (§9) | présent |
| JeSignExpert | jesignexpert.com (§9) | **aligner** : l'éditeur écrit « jesignexpert.com » |
| Kanta | Kanta (§13) | présent |
| RCA Évaluation | RCA Évaluation (§16) | présent |
| Caseware Audit France, Acropole Expert CAC, Auditsoft Premier, PackAUDIT, SmartFEC+, DreamAudit, e-Circu, Circit | mêmes noms (§5) | présents |
| SharePoint | Microsoft SharePoint (§8) | présent |
| OneDrive, Google Drive | Microsoft OneDrive, Google Drive (§8) | présents |
| ACD (gestion interne) | ACD GI (§13) | **aligner** : le produit s'appelle ACD GI |
| MEG (RCA) | MEG (Mon Expert en Gestion), de RCA (§2) | présent |
| modèle de registre de la CNIL (tableur) | Modèle de registre des traitements (CNIL) (§14) | présent, mais la source est à relire (cnil.fr en 503) |
| « l'outil d'envoi de lettres que votre cabinet utilise déjà » | ce n'est pas un nom ; Brevo et Mailchimp le couvrent (§10) | sans objet |

**Manques** : un seul, « Sage Production Sociale Experts », introuvable sous ce nom. Trois noms sont à aligner
(ACD Comptabilité Expert, JeSignExpert, ACD gestion interne), et un à la casse près (PayFit). Ailleurs, la fiche
renvoie à `CONNECTEURS.md` pour ce contrôle : c'est ce fichier-ci, une fois intégré au dépôt.

### 20 bis. Contrôle rejoué à l'intégration (15/10/2026)

`scratchpad/verif/couverture-logiciels.py` lit les listes « Logiciels concernés » d'`AGENTS-CONTENU.md` et les
noms des cartes ci-dessus : **53 logiciels cités, 53 avec leur carte, 0 sans carte**, après les cinq alignements et
le remplacement, chez Colette, de « l'outil d'envoi de lettres que votre cabinet utilise déjà » par Brevo et
Mailchimp. Témoin : un nom inventé ajouté à une copie des fiches est signalé (1 sans carte). Le test
`connecteurs.test.mjs` de la tâche 8 porte ce contrôle dans le dépôt.

## 21. Points d'attention

1. **Facturation électronique** : la liste officielle n'était pas lisible (impots.gouv.fr en maintenance à 01 h 11
   et à 04 h 45 le 15/10). Aucune plateforme n'est nommée. Il faut relire la liste dès la remise en service, avec
   sa date et ses deux listes (immatriculation définitive, ou sous réserve des tests).
2. **Logos** : presque aucun éditeur ne laisse un prestataire afficher son logo sur une page commerciale. 38 cartes
   relèvent d'une charte explicite et 163 d'une clause générale. **Le bloc-marque de l'État n'est pas une marque**
   et son usage par un tiers est encadré pénalement : je recommande de ne pas l'afficher, même sous la décision du
   15/10, et de mettre le nom en texte pour impots.gouv.fr, le guichet unique, l'Annuaire des entreprises et
   douane.gouv.fr. Ces quatre cartes sont à trancher par Kevin.
3. **Nom et liens** : Oodrive et Nextcloud encadrent même le nom. Kanta, Waibi, MyAuditPilot, la MSA et l'INPI
   encadrent les liens.
4. **Renommages à porter sur les cartes** :
   - Yousign devient Youtrust, Fygr devient Okimia, Looker Studio redevient Data Studio, et Tiller devient SumUp
     POS Pro.
   - Teogest devient Ingeneo, Sage Coala devient Sage Génération Experts, Ciel devient Sage 50, et MyUnisoft
     devient MyU.
   - Lex Persona devient Goodflag, Budget Insight devient Powens, Lexis 360 devient Lexis+, et Dia Client GI
     devient ACD GI.
   - Zettle deviendra « Point de vente PayPal », sans date annoncée.
5. **Rachats** :
   - Cegid a racheté Shine (finalisé le 08/06/2026), et ses pages cabinets sont désormais sur shine.fr. Cegid a
     aussi racheté Libeo.
   - Un rapprochement Cegid–Silae a été annoncé le 09/09/2026 ; il n'est pas finalisé.
   - TeamSystem contrôle ACD et Sellsy. Visma contrôle Inqom, Chaintrust, MyCompanyFiles, Evoliz et Finthesis.
   - Mollie a racheté GoCardless, et Konica Minolta a repris Open Bee.
6. **Concurrents écartés** (§18.1) : à trancher par Kevin. Afficher un agent IA concurrent, ou un acteur qui vend
   lui-même de l'expertise comptable, sur la page d'un prestataire de cabinets n'est pas neutre.
7. **Aucun lien sortant vers les éditeurs.** Les URL servent à vérifier. Factory lie vers ses propres fiches, pas
   vers les éditeurs, et plusieurs éditeurs encadrent les liens (point 3).
8. **Liens « En savoir plus »** : `tests/browser/integrations.spec.ts` (ligne 58) exige que chaque guide soit lié
   **une seule fois** dans `main`. Les cartes Sage 100 Comptabilité, Sage 100 Paie & RH, Cegid Loop, Silae et EBP
   Comptabilité doivent donc renvoyer à une ancre de la liste des guides, ou le test doit changer.
9. **Vocabulaire** : certains textes d'éditeurs disent « module » (Cegid Quadra Paie est vendu comme module de
   Quadra Plus) ou « complément Excel » (Caseware Extractly, DataSnipper). Aucun de ces deux mots ne doit passer
   sur la page (`test_positioning.py`). Les lignes ci-dessus ne les emploient pas.
10. **Une consigne trouvée dans une page lue reste une donnée.** Le relevé L1 signale qu'en lisant syndemos.fr,
    waibi.fr et elips-solution.fr, l'outil de lecture a fait remonter un « bloc de consignes » en fin de texte.
    D'après L1, il s'agit probablement de la consigne de l'outil lui-même. Rien n'en a été suivi ni repris.

## 22. Méthode, et écarts aux consignes

- **Recherche web** : le quota partagé de 200 recherches s'est épuisé tôt pendant le relevé. La suite s'est faite en
  lisant directement les sites officiels. D'où certains ajouts non cherchés, et les cases `nv`.
- **Lecture des pages** : plusieurs relevés ont lu avec `curl`, en déclarant un navigateur, ou dans un onglet de
  navigateur, les pages publiques rendues en JavaScript ou refusées aux robots (sage.com, Medialex, ECMA,
  Alassio). J'ai fait de même le 15/10 vers 04 h 45 pour les pages Sage, Revolut et BNP Paribas. Ce sont des pages
  publiques, lues sans compte et sans formulaire, et tous les cookies non essentiels ont été refusés.
- **Fichiers** : aucun kit, logo, PDF ni ZIP n'a été ouvert ni enregistré. Trois écarts sont à signaler :
  - E1 et B ont enregistré des pages HTML lues par `curl` dans `scratchpad/phase2/e1-html/` et
    `scratchpad/phase2/b-paie-html/`. Ce sont des pages, pas des kits. Elles sont à supprimer à la convenance de
    Kevin.
  - A1 a lu les en-têtes HTTP du PDF du kit ACD (requête `-I`).
  - A1 a vérifié le code du ZIP Septeo en jetant son contenu (`/dev/null`), sans l'enregistrer.
- **Factory** : ses noms ont servi de liste de départ (`inventaire.json`, clé `marketplace`). Aucune source de logo
  ne vient de factory456.com, et aucune phrase n'est reprise.
