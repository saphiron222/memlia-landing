# Hub des agents IA — spécification de la phase 2

> **Statut : brouillon, à valider à la porte 2** (Kevin valide la spécification, le pilote d'image et
> la liste des outils, puis génère les avatars). Décisions de cadre : D1 à D14 du
> [cadrage](HUB-SPECIALISTES-CADRAGE.md), validées le 14/10/2026 ; ADR
> [0001](../../adr/0001-hub-agents-ia-source-unique.md) accepté ; charte v6 §9 bis ; glossaire
> [`CONTEXT.md`](../../../CONTEXT.md). Le copy ci-dessous est un **premier jet de structure** : il passe
> par `marketing-skills:copywriting` puis `copy-editing` dans les tickets de la phase 3, sans changer
> ce qu'il promet.

## 0. Ce que la phase 3 construit

| Surface | Route | Correspondance | Nouvelle ? |
|---|---|---|---|
| Hub des agents IA | `/agents-ia` | agpt.co/experts | oui |
| Neuf fiches d'agent | `/agents-ia/<métier>` | agpt.co/experts/max | oui |
| Page des outils | `/integrations` | factory456.com/marketplace | transformée (les douze guides restent ses pages de détail) |
| Bandeau « Qui prend ce métier » | `/automatisation/paie`, `/integrations` | — | ajout |
| Menu « Ce qu'on automatise » | navigation | — | modifié (D9) |
| Pré-remplissage « Par quelle tâche commencer ? » | `/contact` | appel final d'agpt | ajout |

Les douze agents et leurs destinations :

| Identifiant | Agent · métier | Destination de la carte | Groupe de filtre | Teinte (`PoleId`) |
|---|---|---|---|---|
| `comptabilite` | Balthazar · Comptabilité | `/agents-ia/comptabilite` | Production et conseil | `production-comptable` |
| `paie-social` | Salomé · Paie et social | `/automatisation/paie` | Production et conseil | `paie-social` |
| `juridique-fiscal` | Grégoire · Juridique et fiscal | `/agents-ia/juridique-fiscal` | Production et conseil | `juridique-fiscal` |
| `finance` | Florent · Finance | `/agents-ia/finance` | Production et conseil | `conseil-missions` |
| `missions-audit` | Aude · Missions d'audit | `/commissaires-aux-comptes` | Production et conseil | `audit-cac` |
| `commercial` | Victoire · Commercial | `/agents-ia/commercial` | Relation client | `developpement-cabinet` (pôle neuf) |
| `communication` | Colette · Communication | `/agents-ia/communication` | Relation client | `developpement-cabinet` |
| `relation-client` | Émile · Relation client | `/agents-ia/relation-client` | Relation client | `administratif-secretariat` |
| `gestion-cabinet` | Honoré · Gestion du cabinet | `/agents-ia/gestion-cabinet` | Vie du cabinet | `facturation-recouvrement` |
| `rh-cabinet` | Raphaël · RH du cabinet | `/agents-ia/rh-cabinet` | Vie du cabinet | `rh-formation` |
| `informatique-outils` | Octavie · Informatique et outils | `/integrations` | Vie du cabinet | `excel-outils-existants` |
| `protection-donnees` | Prudence · Protection des données | `/agents-ia/protection-donnees` | Vie du cabinet | `numerique-it-data` |

Groupes : **Production et conseil** (5, disposés 3 + 2 centrés), **Relation client** (3), **Vie du
cabinet** (4, en 2 × 2), et **Tous** (12, 3 × 4). Couleur du pôle neuf `developpement-cabinet` :
`#c2410c` proposée, à mesurer en phase 3 (contraste si elle sert en texte, distance aux teintes
voisines `#b5651d` et `#a16207`). L'accent de Paie et social (`#be123c`) est un rouge : en voile de
carte, il ne doit jamais se lire comme une erreur.

## 1. Le hub `/agents-ia`

Gabarit : héros **centré** (système de page §1), puis sections au même pas. Ordre et rôle repris
d'agpt.co/experts, copy à nous.

| # | Section | Contenu | Forme (système de page) |
|---|---|---|---|
| 1 | Héros | surtitre « Agents IA par métier » ; H1 *Agents IA pour cabinet d'expertise comptable : chacun prépare un métier, vos collaborateurs valident.* ; paragraphe qui **définit l'agent IA** à sa première apparition (*Un agent IA, chez nous, c'est la règle écrite d'un métier de votre cabinet, mise en œuvre dans vos outils. Il prépare, il s'arrête dès qu'un cas sort de la règle, et votre collaborateur valide ce qui part.*) ; ancre « Trouver votre premier agent ↓ » vers #annuaire ; trois avatars en médaillons décalés (Balthazar, Salomé, Grégoire), prénom et métier sous chacun | héros centré ; média = trio d'avatars |
| 2 | Derrière chaque agent, nous | carte pleine largeur, le lockup Memlia à la place d'une figurine ; titre *Derrière chaque agent, nous.* ; une phrase ; cinq gestes en ligne : observer, écrire, éprouver, faire recetter, maintenir ; lien d'action « Voir notre méthode » → `/methode` | bande |
| 3 | Annuaire `#annuaire` | H2 *Qui prend quel métier ?* ; compteur dérivé des données (« 12 agents IA ») ; filtres Tous · Production et conseil · Relation client · Vie du cabinet, chacun avec son compte dérivé ; douze cartes | cartes (3 colonnes au plus) |
| 4 | Construit sur votre cabinet | H2 *Construit sur votre cabinet, pas l'inverse.* ; trois étapes numérotées : **votre règle écrite** (la frontière en trois colonnes, écrite avec vous avant la première ligne) ; **vos outils** (classeur, export, logiciel métier, messagerie ; ce que votre logiciel fait déjà, nous ne le refaisons pas) ; **vos échéances** (l'agent prépare au rythme de votre calendrier de DSN, de TVA, de clôture, et s'arrête dans le doute) | étapes |
| 5 | Votre tâche n'a pas d'agent ? | bandeau court : *Toute tâche répétitive dont la règle peut s'écrire se confie. Décrivez-la en trois phrases.* ; lien → `/contact` | mention + lien d'action |
| 6 | Appel final | H2 *Confiez une première tâche.* ; bouton « Confier une première tâche » → `/contact` | appel final centré |

**La carte d'agent** (reprise de la carte d'agpt, mesures au cadrage §2.5) : bandeau haut teinté du
voile de l'accent du pôle, avec le **libellé du pôle en casse de phrase** (D13) ; tuile d'avatar
carrée à rayon `--r-boite`, bord `--surface-elevee`, qui déborde du bandeau ; micro-libellé « Agent
IA » ; prénom en `--titre-bloc` ; métier ; la ligne d'une phrase (cadrage §8) ; filet ; lien d'action
« Rencontrer <prénom> ». **La carte entière est le lien** (système de page §4). Son nom accessible :
« <prénom>, agent IA <métier> ». Survol : `--carte-ombre-survol`, `--carte-bord-survol`, élévation
de 4 px en 200 ms, rien en mouvement réduit. Jetons à créer : `--avatar-carte` (84 px),
`--avatar-heros` (≈ 116 px).

**Les filtres sans JavaScript** : un groupe de boutons radio (`fieldset` + `legend` visuellement
masquée) stylés en puces `--r-chip` ; la règle CSS `:has()` masque les cartes hors du groupe coché ;
« Tous » est coché par défaut. Sans prise en charge de `:has()`, toutes les cartes restent visibles :
l'annuaire complet est l'état de repli. Le compte de chaque filtre est écrit dans son libellé au
build, depuis les données. Aucune URL ne change (comme agpt).

## 2. Le gabarit de fiche `/agents-ia/<métier>`

Un seul gabarit lu depuis `specialistes.ts` (agpt : un gabarit fixe de 14 sections). Héros
**partagé** (système de page §1). Ordre repris d'agpt.co/experts/max, avec les substitutions de la
consigne.

| # | Section d'agpt | Chez nous | Contenu |
|---|---|---|---|
| 1 | fil d'Ariane | idem | Accueil › Agents IA › <Métier> |
| 2 | héros + démo de conversation | **héros + rejeu** | gauche : label « <Prénom> · agent IA <métier> » (casse de phrase), H1 = ce que l'agent prend en charge (intention d'abord, §3), paragraphe qui finit sur *ce qui part, c'est vous qui le décidez*, bouton « Confier une première tâche », ancre « Voir ce que <prénom> vous remet ↓ » ; **aucun prix**. Droite : le **rejeu**, s'il existe (§2.1), sinon la frontière en trois colonnes de l'agent |
| 3 | chiffres de preuve sociale | **supprimée** | charte §10 |
| 4 | « ce qu'il vous remet le jour un » | **Ce que <prénom> vous remet** | deux cartes de livrables, étiquetées « exemple fictif » : une proposition et un brouillon, chacun avec la pastille « En attente de votre validation » ; une troisième carte en pointillés pour ce qui vient une fois les accès vérifiés |
| 5 | comment il travaille (3 étapes) | **Comment <prénom> travaille** | 01 Vous montrez la tâche · 02 Nous écrivons sa règle · 03 <Prénom> propose, vous validez ; deux puces par étape |
| 6 | compétences + intégrations | **Les tâches qu'il prend en charge** + **Dans vos outils** | les familles titulaires (§3), chacune liée à sa page service, son guide ou son article ; une famille `active: false` se liste « à écrire avec vous », sans lien ; puis les outils du métier avec leur statut, liés à leur section de `/integrations` |
| 7 | avec / sans | **Avec ou sans <prénom>** | colonne « sans » en pointillés, colonne « avec » pleine sur `--accent-voile` ; quatre lignes chacune ; la colonne « avec » dit qui valide ; **aucun chiffre de gain** |
| 8 | ce qu'il ne fera jamais (panneau sombre) | **La règle écrite** (panneau sombre `--encre`) | la frontière en trois colonnes (se prépare seul / attend votre validation / reste humain) ; les conditions d'arrêt ; **Ce qui ne part jamais sans vous** : la liste des envois du métier, chacun avec son geste de validation |
| 9 | qui prend le relais avant et après | **Avant et après <prénom>** | deux ou trois agents voisins (prénom, métier, ligne) ; une ligne *Derrière <prénom>, nous* → `/methode` |
| 10 | FAQ « avant de l'embaucher » | **Avant de confier une tâche à <prénom>** | cinq ou six questions en accordéon natif (§3) |
| 11 | appel final + 3 briefs | **Par quelle tâche commencer ?** | trois tâches de départ en puces ; un clic pré-sélectionne la tâche sur `/contact` (§5) ; bouton ; mention *Rien à envoyer : la description suffit.* |
| 12 | lien vers tous les experts | idem | « Tous les agents IA » → `/agents-ia` |

### 2.1 Le rejeu

Une table HTML accessible (et non une image) : colonnes *Cas joué*, *Sortie obtenue*, *Décision* ; une
puce par ligne **Préparé** / **À valider** / **Arrêt** ; la ligne arrêtée est barrée et garde sa
raison lisible. En tête : *Rejoué sur un dossier fictif* ; en pied : un lien vers la page où la règle
est publiée. Aucun minuteur, aucun compteur de lignes, aucun champ de saisie simulé. Rendu au build,
sans JavaScript, sans requête réseau (CSP `connect-src 'none'` sur `/agents-ia/*`).

**Règle de vérité** : une fiche ne montre un rejeu que s'il est **repris à l'identique** d'une table
« Rejoué sur le jeu fictif » déjà publiée par l'une de ses familles titulaires. Un test vérifie que
chaque cas affiché figure mot pour mot dans la page source rendue. Sources :

| Fiche | Source du rejeu | Statut |
|---|---|---|
| Comptabilité | `/automatisation/saisie-comptable` | publiée |
| Juridique et fiscal | `/automatisation/secretariat-juridique` | publiée |
| Finance | `/automatisation/evaluation-transmission` | publiée |
| Commercial | `/blog/automatiser-l-entree-en-relation-d-un-nouveau-client` | publiée |
| Gestion du cabinet | `/blog/cabinet-comptable-surcharge-de-travail-ou-passe-le-temps` (plan de charge) | publiée |
| Protection des données | `/blog/ia-comptabilite-confidentialite-donnees` | publiée |
| RH du cabinet | **à décider à la porte 2** : écrire et publier la règle de la synthèse de rémunération, livrée et recettée le 20/08, rejouée sur son jeu d'essai fictif (contenu paie : vérification sur source datée) ; sinon, pas de rejeu | — |
| Communication, Relation client | aucune règle publiée : **pas de rejeu** ; le héros montre la frontière | — |

L'image sociale de chaque fiche (1200 × 630) est le **recadrage de ce rejeu ou de la frontière**,
rendu par le pipeline des preuves, et sert aussi de média propre de la page (contrat de page).

## 3. Les fiches de contenu

Pour chaque fiche : H1 (intention d'abord, requête provisoire en gras), familles titulaires, livrables,
frontière, arrêts, envois, avec / sans, voisins, questions, tâches de départ. Les identifiants de
familles sont ceux de `familles.ts` ; les familles neuves (`*`) s'y ajoutent `active: false`.

### Balthazar · Comptabilité (`/agents-ia/comptabilite`)

- **H1** : *Agent IA comptabilité : la saisie, les pièces et le rapprochement bancaire préparés,
  chaque écart validé par vos collaborateurs.* — requête **agent ia comptabilité**.
- **Familles** : `collecte-pieces`, `saisie-ocr`, `banque-rapprochement`, `lettrage`,
  `achats-fournisseurs`, `ventes-caisse`, `notes-de-frais`, `immobilisations-emprunts`,
  `revision-cycles`, `cloture-bilan`, `facture-electronique`, `ged-dossier-permanent` (12) ; pages
  service : saisie-comptable, rapprochement-bancaire, factures-fournisseurs, notes-de-frais,
  facture-electronique.
- **Livrables** : le lot de saisie préparé, écriture par écriture, avec ses contrôles ; la liste des
  pièces à réclamer par dossier, avec le brouillon de relance ; *(pointillés)* le rapprochement du
  mois, une fois les relevés reçus.
- **Frontière** : seul — lire les pièces, pré-imputer, rapprocher les mouvements à un seul candidat,
  préparer les relances ; validation — chaque écriture proposée, chaque appariement, chaque relance ;
  humain — l'imputation d'un cas nouveau, l'écriture dans le logiciel, la clôture.
- **Arrêts** : pièce illisible ; période incohérente ; plusieurs candidats au rapprochement ; écart
  sans règle signée.
- **Ne part jamais sans vous** : une relance de pièces au client ; une écriture intégrée au logiciel.
- **Avec / sans** : sans — ressaisir les factures, chercher la pièce manquante, pointer ligne à ligne,
  découvrir l'écart à la clôture ; avec — un lot préparé que le collaborateur valide, une relance
  prête qu'il envoie, l'écart présenté avec sa source, la pièce illisible arrêtée et nommée.
- **Voisins** : Victoire (avant : l'entrée en relation), Salomé, Grégoire (après).
- **Questions** : Faut-il changer de logiciel comptable ? · Les écritures sont-elles intégrées sans
  contrôle ? · Que devient une pièce illisible ? · Qui voit les pièces de vos clients ? · Combien
  coûte une tâche prise en charge ?
- **Tâches de départ** : `collecte-pieces`, `saisie-ocr`, `banque-rapprochement`.
- **Rejeu** : saisie comptable (publié).

### Grégoire · Juridique et fiscal (`/agents-ia/juridique-fiscal`)

- **H1** : *IA juridique pour expert-comptable : les documents d'approbation des comptes, les
  registres et les échéances fiscales préparés, rien déposé à votre place.* — requête **ia juridique
  expert comptable**. (L'approbation est une décision des associés : l'agent en prépare les documents.)
- **Familles** : `tva`, `is-acomptes`, `declarations-annexes`, `secretariat-juridique`,
  `formalites-creation-modification`, `registres-obligations`, `echeances-fiscales`,
  `teledeclarations-rejets` (8) ; pages service : secretariat-juridique, registres-obligations.
- **Livrables** : le calendrier des approbations et des dépôts du portefeuille, avec le brouillon de
  rappel ; la liste des télédéclarations et de leurs rejets à reprendre ; *(pointillés)* le dossier de
  formalité prêt à relire.
- **Frontière** : seul — rassembler les dates confirmées, préparer les rappels et les projets ;
  validation — chaque date, chaque destinataire, chaque projet ; humain — la qualification des
  obligations, les décisions des associés, la signature, le dépôt et la télédéclaration.
- **Arrêts** : date non confirmée ou divergente ; identité de dossier ambiguë ; dépôt annoncé sans
  justificatif.
- **Ne part jamais sans vous** : une télédéclaration ; un dépôt des comptes ; une formalité ; un
  procès-verbal ; un rappel au client.
- **Voisins** : Balthazar (avant), Florent (après).
- **Questions** : Notre logiciel suit déjà les assemblées : que reste-t-il ? · Le dépôt part-il seul ? ·
  Les échéances sont-elles calculées à partir de la forme de la société ? · Que se passe-t-il quand une
  date manque ? · Combien coûte une tâche prise en charge ?
- **Tâches de départ** : `secretariat-juridique`, `registres-obligations`, `echeances-fiscales`.
- **Rejeu** : secrétariat juridique (publié).

### Florent · Finance (`/agents-ia/finance`)

- **H1** : *Agent IA finance pour cabinet comptable : prévisionnels, trésorerie et situations de vos
  clients préparés, hypothèses tracées.* — requête **agent ia finance**.
- **Familles** : `previsionnel-business-plan`, `tresorerie-previsionnelle`, `financement-aides`,
  `evaluation-transmission`, `situations-reporting-client` (5) ; page service : evaluation-transmission.
- **Livrables** : la situation intermédiaire préparée depuis la comptabilité tenue ; la trésorerie
  projetée depuis les échéances connues, tensions signalées ; *(pointillés)* le dossier de financement.
- **Frontière** : seul — agréger, projeter depuis les données tenues, tracer chaque hypothèse ;
  validation — chaque hypothèse, chaque retraitement ; humain — le conseil, la présentation au client,
  l'engagement du cabinet.
- **Arrêts** : pièce de l'exercice absente ; retraitement non justifié ; donnée de période incohérente.
- **Ne part jamais sans vous** : un prévisionnel ou une situation remis au client ; un dossier de
  financement transmis.
- **Voisins** : Grégoire (avant), Émile (après).
- **Tâches de départ** : `situations-reporting-client`, `tresorerie-previsionnelle`,
  `evaluation-transmission`.
- **Rejeu** : évaluation et transmission (publié).

### Victoire · Commercial (`/agents-ia/commercial`)

- **H1** : *Agent IA commercial pour cabinet comptable : l'entrée en relation et la lettre de mission
  préparées, la signature et la vigilance restent à vous.* — requête **agent ia commercial**.
- **Familles** : `onboarding-client`, `lettre-de-mission-lcbft`, `*propositions-mission`
  (propositions de mission et devis d'honoraires, inactive).
- **Livrables** : la liste des pièces d'entrée à réunir, par jalon ; le projet de lettre de mission
  prêt à relire ; *(pointillés)* la proposition de mission, une fois vos barèmes écrits.
- **Frontière** : seul — réunir les jalons, préparer les demandes de pièces et le projet de lettre ;
  validation — chaque demande, chaque projet ; humain — l'acceptation de la mission, l'appréciation du
  risque et la vigilance LCB-FT, la signature.
- **Arrêts** : pièce illisible ; bénéficiaire effectif non qualifié ; jalon franchi sans autorisation.
- **Ne part jamais sans vous** : une proposition au prospect ; une demande de pièces ; une lettre de
  mission à signer.
- **Voisins** : Colette, Émile, Balthazar (après).
- **Questions** : L'agent décide-t-il de la vigilance LCB-FT ? (non : il prépare les pièces ; la
  décision, et toute déclaration de soupçon, restent au professionnel) · La lettre de mission part-elle
  seule ? · Que devient une pièce illisible ? · Faut-il changer d'outil de signature ?
- **Tâches de départ** : `onboarding-client`, `lettre-de-mission-lcbft`, `*propositions-mission`.
- **Rejeu** : entrée en relation (publié).

### Colette · Communication (`/agents-ia/communication`)

- **H1** : *Agent IA communication pour cabinet comptable : la lettre d'information et l'actualité de
  vos clients rédigées pour relecture.* — requête **agent ia communication**.
- **Familles** (toutes neuves, inactives) : `*lettre-information-clients`, `*actualite-a-diffuser`,
  `*publications-cabinet`.
- **Livrables** : le brouillon de la lettre d'information, depuis l'actualité que vous avez retenue ;
  la note d'actualité adaptée à un secteur de clients ; *(pointillés)* le calendrier des publications.
- **Frontière** : seul — résumer l'actualité retenue, mettre en forme, proposer un calendrier ;
  validation — chaque texte, chaque destinataire ; humain — le choix des sujets, la parole du cabinet,
  la publication et l'envoi.
- **Arrêts** : source non retenue par le cabinet ; règle citée sans source datée ; destinataire non
  autorisé.
- **Ne part jamais sans vous** : une lettre d'information ; une publication ; un article.
- **Rejeu** : aucun (aucune règle publiée) ; le héros montre la frontière.

### Émile · Relation client (`/agents-ia/relation-client`)

- **H1** : *Agent IA relation client pour cabinet comptable : la boîte mail triée et les réponses
  préparées, rien ne part sans validation.* — requête **agent ia relation client**.
- **Familles** : `boite-mail-courriers`, `envois-plaquettes-documents`, `rendez-vous-agenda`,
  `offboarding-transfert` (4).
- **Livrables** : la boîte triée par client et par priorité, chaque message relié à son dossier ; les
  réponses types préparées ; *(pointillés)* le suivi des envois de plaquettes et d'attestations.
- **Frontière** : seul — trier, relier au dossier, préparer une réponse type ; validation — chaque
  réponse ; humain — toute réponse engageante, le conseil, la décision de transférer un dossier.
- **Arrêts** : expéditeur non relié à un dossier ; demande hors des réponses types ; pièce jointe
  illisible.
- **Ne part jamais sans vous** : une réponse au client ; un envoi de document ; une invitation.
- **Rejeu** : aucun ; le héros montre la frontière.

### Honoré · Gestion du cabinet (`/agents-ia/gestion-cabinet`)

- **H1** : *Agent IA de gestion pour cabinet comptable : les honoraires facturés une seule fois, les
  prélèvements suivis et le portefeuille en agrégats.* — requête **à mesurer** (ni « secrétariat », ni
  « ia <mot> cabinet comptable »).
- **Familles** : `honoraires-facturation`, `prelevements-encaissements`, `relances-impayes`,
  `rentabilite-dossiers`, `suivi-dossiers-etats`, `tableau-de-bord-production`,
  `planification-charge` (7).
- **Livrables** : la facturation du mois préparée, chaque acte hors forfait facturé une fois ; les
  rejets de prélèvement et l'échéancier proposé ; *(pointillés)* le tableau de bord du portefeuille,
  en agrégats, jamais par personne.
- **Frontière** : seul — rapprocher les actes et la facturation, repérer les rejets, agréger
  l'avancement ; validation — chaque facture, chaque relance ; humain — le tarif, le geste commercial,
  la répartition de la charge.
- **Arrêts** : acte sans tarif écrit ; rejet sans motif lisible ; donnée nominative demandée.
- **Précision réglementaire** : la facture d'honoraires du cabinet passe par sa propre plateforme
  agréée (réception obligatoire depuis le 01/09/2026, émission selon la taille) ; l'agent la prépare,
  il ne l'émet ni ne la transmet.
- **Ne part jamais sans vous** : une facture d'honoraires ; une relance d'impayé ; un lot de
  prélèvement.
- **Rejeu** : plan de charge (publié).

### Raphaël · RH du cabinet (`/agents-ia/rh-cabinet`)

- **H1** : *Agent IA RH pour cabinet comptable : la synthèse de rémunération et l'arrivée d'un
  collaborateur préparées, en agrégats.* — requête **agent ia rh**.
- **Familles** : `rh-interne-cabinet`, `synthese-remuneration`, `formation-ia-competences` (3).
- **Livrables** : la synthèse annuelle de rémunération d'un salarié, depuis la paie tenue ; le
  dossier d'arrivée d'un collaborateur ; *(pointillés)* la preuve de formation de l'équipe.
- **Frontière** : seul — rassembler depuis la paie tenue, mettre en forme ; validation — chaque
  synthèse ; humain — toute appréciation sur une personne, l'entretien, la décision.
- **Arrêts** : ligne de paie ambiguë ou à double source ; donnée sensible non prévue ; demande
  d'évaluation d'une personne (refusée : anti-surveillance).
- **Ne part jamais sans vous** : une synthèse remise à un salarié ; un document d'arrivée.
- **Questions** : L'agent évalue-t-il vos collaborateurs ? (non, jamais) · Faut-il changer de logiciel
  de paie ? · Que devient une ligne de paie ambiguë ?
- **Rejeu** : à décider à la porte 2 (§2.1).

### Prudence · Protection des données (`/agents-ia/protection-donnees`)

- **H1** : *Agent IA RGPD pour cabinet comptable : la mise à jour du registre des traitements et les
  réponses aux demandes d'accès préparées pour votre référent.* — requête **agent ia rgpd**. (Le
  registre est tenu par le responsable de traitement, art. 30 ; le droit d'accès appartient aux
  personnes physiques concernées, pas à un client personne morale.)
- **Familles** : `rgpd-secret-securite`, `ai-act-conformite`, `*registre-traitements`,
  `*demandes-droits` (2 actives, 2 neuves inactives).
- **Livrables** : la mise à jour du registre que tient votre cabinet, préparée depuis ses outils ; la
  réponse à une demande d'accès d'une personne concernée (client particulier, salarié d'un client,
  collaborateur), préparée avec les données retrouvées ; *(pointillés)* la revue des sous-traitants.
- **Frontière** : seul — inventorier, retrouver, mettre en forme ; validation — chaque réponse, chaque
  ligne du registre ; humain — la décision de votre référent ou de votre délégué désigné, toute
  notification.
- **Ne part jamais sans vous** : une réponse à une personne concernée ; une notification.
- **Questions** : L'agent remplace-t-il votre délégué à la protection des données ? (non : le délégué
  est une personne désignée) · Comment chaque agent traite-t-il vos données ? (lien `/garanties`)
- **Rejeu** : confidentialité (publié). Références réglementaires (registre, droit d'accès, délai,
  désignation) : vérifiées sur source datée avant publication (§7).

### Les trois cartes vers une page existante

- **Salomé · Paie et social** → `/automatisation/paie` : la page reçoit un bandeau « Qui prend ce
  métier : Salomé, agent IA paie et social » (avatar, ligne, lien « Tous les agents IA »), sans changer
  sa requête ni son rejeu. Préalable : corriger `family: paie-social` de `paie.md` (un identifiant de
  pôle, pas de famille).
- **Aude · Missions d'audit** → `/commissaires-aux-comptes` : la carte suffit ; **aucun bloc ajouté** à
  l'accueil CAC (revue `seo-cluster`). Ligne alignée sur l'accueil CAC (la réception du FEC et la revue
  analytique restent dans la suite d'audit du cabinet).
- **Octavie · Informatique et outils** → `/integrations` : la page des outils reçoit le bandeau « Qui
  prend ce métier ».

## 4. Le pré-remplissage du contact

Trois puces par fiche, chacune portant **un identifiant de famille** (liste blanche = les familles de
`familles.ts`). Au clic, l'identifiant est remis à `/contact` (mécanisme arrêté au §7), qui
pré-sélectionne un champ **visible et facultatif** « Tâche à confier ». Jamais de texte libre
transmis, jamais de message pré-écrit, jamais l'accord de provenance pré-coché, aucune donnée
personnelle dans l'URL. Sans JavaScript, la puce mène à `/contact` sans pré-sélection.

## 5. La page des outils `/integrations`

Liste complète, preuves datées et règles de marque : [`hub-agents-ia/OUTILS.md`](hub-agents-ia/OUTILS.md)
(14 et 15/10/2026). **49 outils sur 13 domaines** ; statuts proposés : **Éprouvé 2** (Microsoft Excel,
Silae, sous réserve de K1), **Par export 15** (format documenté par l'éditeur, URL officielle lue et
datée), **Sur demande 32**. Aucun total n'est affiché sur la page.

**Structure** (correspondance factory456.com/marketplace) : héros sans chiffre (H1 sur la requête
retenue au §6) ; puces d'ancres par domaine ; une section par domaine (une phrase sur les gestes repris
et l'agent qui les porte, puis une carte par outil : nom et éditeur **en texte**, statut, ce que nous
reprenons, lien vers le guide s'il existe) ; « Comment nous reprenons un outil » en trois étapes, dont
*accès et formats vérifiés avant tout devis* ; « Votre outil n'est pas cité ? » vers `/contact` ; la
mention de marques. La recherche des douze guides reste, avec **un seul lien par guide** dans la page
(`integrations.spec.ts`) : les cartes d'outils renvoient aux guides par ancre. Le bandeau « Qui prend ce
métier : Octavie, agent IA informatique et outils » s'y pose.

**Règles** : aucun logo (Microsoft, Google, Docusign, PrestaShop et Sage exigent une licence ou un
programme partenaire ; les autres n'ont pas de règle publique) ; mention proposée *Marques citées :
propriété de leurs titulaires ; Memlia n'en est ni partenaire ni revendeur.* ; **aucune plateforme
agréée nommée** tant que la liste officielle d'impots.gouv.fr (en maintenance les 14 et 15/10) n'est
pas relue, et les sept libellés « plateforme agréée » de `couverture-logiciels.mjs` sont à revérifier
contre elle ; « Youtrust (anciennement Yousign) » ; aucune page de détail par outil, sauf Excel, à trois
conditions (K1 validé, requête mesurée distincte de l'article « tableau de bord paie excel », aucun
mot verrouillé).

**À trancher à la porte 2** (détail en tête de l'annexe) : **K1** les recettes sont plus faibles que le
disait `~/dev/CLAUDE.md` (production sociale : en usage depuis le 04/08, recette sur jeu fictif le
05/08, jamais sur une copie du vrai classeur ; synthèse de rémunération : installeur du 20/08 corrigé
le 06/09, passe sur le poste de l'expert-comptable non prouvée) : Excel et Silae restent « Éprouvé » si
Kevin l'accepte, sinon « Par export » ; **K2** ACD reste « Sur demande » tant que le ré-import du
fichier généré n'est pas vérifié ; **K3** facturation électronique ci-dessus ; **K4** RévisAudit absent
ou en texte seul, jamais lié (domaine proscrit) ; **K5** Youtrust ; **K6** Sage 100 « Sur demande »
malgré six guides (ses fiches décrivent des gestes, pas un format d'échange) ; **K7** la mention de
marques et la page Excel conditionnelle.

## 6. Référencement

**Balises par page** : `title` (titre d'onglet, même requête que le H1, plus court), `description`
unique ouvrant par son `descriptionLead` (contrat d'intention), canonical absolue, Open Graph complet ;
`og:title` = H1 = `headline` (contrat de page) ; **un seul `h1`** ; `lang="fr"`.

**Image sociale** : le recadrage 1200 × 630 rendu par le pipeline des preuves (le rejeu ou la frontière
pour une fiche ; le trio d'avatars pour le hub ; la vue par domaine pour la page des outils), JPG
absolu sur `https://memlia.fr` (`scripts/render-social-images.mjs`).

**JSON-LD** (gabarits complets : agent `seo-schema`, scratchpad `phase2/json-ld.md`) :

| Page | Graphe | Règles |
|---|---|---|
| hub | `CollectionPage` + `ItemList` des 12 cartes (`ListItem` → les 9 fiches et les 3 pages existantes) + `BreadcrumbList` (2 niveaux) | aucun `Service` |
| fiche | `WebPage` + **un seul** `Service` (`provider` = l'`Organization` par `@id`, `serviceType`, `areaServed` FR, `audience`) + `BreadcrumbList` (3 niveaux) | le prénom seulement dans `Service.alternateName` ; dates depuis `PageEeat` |
| `/integrations` | `CollectionPage` + `ItemList` des outils (statut en texte) + `BreadcrumbList` | un outil n'est jamais `SoftwareApplication` |

Jamais : `Person` pour un agent, `SoftwareApplication`, `offers`, prix, `aggregateRating`, `review`.
Une garde de build (`assertGraph`) refuse ces types, les `@id` en double, les URL relatives et plus
d'un `Service` par page ; un test par interdit prouve qu'elle rougit.

**FAQPage : décision à prendre à la porte 2.** La consigne la demandait sur les fiches ; l'agent
`seo-schema` recommande de **ne pas l'émettre** : Google a retiré le résultat enrichi le 07/05/2026,
les réponses sont déjà dans la page, et Kevin l'a retirée des outils gratuits le 14/10 pour la même
raison (un gabarit répété). Les questions restent visibles en accordéon. L'accueil et l'accueil CAC
gardent la leur (référencement acquis). Si Kevin la veut : gabarit prêt, activé par donnée, avec
au moins trois questions, aucune question commune à deux fiches et la parité avec la page vérifiée.

**Sitemap et `llms.txt`** : les dix routes neuves (hub + neuf fiches) entrent dans le sitemap des pages
(liste stricte de `test_build.py` mise à jour) ; `/agents-ia` s'ajoute aux hubs codés dans
`scripts/lib/llms-inventory.mjs` ; `public/llms.txt` gagne une section « Agents IA » qui reprend la
définition du §9 bis.

**Maillage** (matrice complète : agent `seo-cluster`, scratchpad `recherche/cannibalisation-maillage.md`
§5) : hub ↔ chaque destination ; fiche → ses pages service (ancre = le geste), ses guides, ses outils
gratuits, un article de sa famille ; page service → « Qui prend cette tâche : <prénom>, agent IA
<métier> » ; pilier #perimetre → hub et fiches par pôle ; accueil EC, section Orientation → hub ;
blog → fiche de la famille quand l'article n'a pas de page service (élargir `estLienCommercialBlog` à
`/agents-ia` et ses fiches) ; outils gratuits → leur fiche (`pageService`) ; `/integrations` ↔ fiches
par domaine. Liens rendus par les données et les gabarits, jamais en éditant un article scellé. Les
fiches Communication et RH du cabinet n'ont aujourd'hui que des liens internes au hub : leur premier
article de famille est le remède, pas un lien forcé.

## 7. Contenus réglementés

Fact-check daté du 14/10/2026 (23 h à 23 h 40), sources officielles : scratchpad
`phase2/fact-check.md` (117 lignes, à copier hors scratchpad avec les autres pièces). Chaque phrase
réglementée d'une page reprend la **formulation proposée** du fact-check et passe la revue `metier`.
Ne s'écrivent jamais :

- « votre DPO », « DPO IA », « délégué IA » (le délégué est une personne désignée, art. 37) ;
  « l'agent tient le registre » (art. 30 : il en prépare la mise à jour) ; « les demandes d'accès de
  vos clients » (le droit appartient aux personnes physiques concernées) ; « registre conforme »,
  « conforme RGPD », « nous répondons en moins d'un mois » ; « tout cabinet doit désigner un DPO »
  comme son contraire.
- « PDP » (dire « plateforme agréée ») ; « nous émettons » ou « nous transmettons vos factures » ;
  « via Chorus Pro » entre entreprises ; « toutes les entreprises émettent dès le 01/09/2026 » (PME et
  micro-entreprises : 01/09/2027) ; « la réforme arrive en 2026 » (la réception est en vigueur) ;
  « article 289 bis du CGI » sans date (abrogé au 01/01/2027).
- « l'agent dépose la DSN », « DSN automatique », « échéance au 5 pour tous » (le 5 ou le 15 de M+1
  selon l'effectif et la date de paie), « CRM corrigés automatiquement ».
- « détection du blanchiment », « déclaration de soupçon automatisée », « nous alertons TRACFIN »,
  « KYC automatisé » ; tout ce qui laisse croire que Memlia voit une déclaration (L.561-18).
- « nous déposons vos formalités ou vos comptes » ; « l'agent approuve les comptes » ; « six mois
  impératifs » (le juge peut prolonger) ; un article de loi cité pour la mauvaise forme de société.
- « conforme NEP », « audit automatisé », « circularisation envoyée par nos soins », « une sortie
  d'outil suffit comme élément probant », « agent IA CAC » ; l'envoi des demandes de confirmation et la
  réception des réponses restent au commissaire aux comptes (NEP 505 § 09).
- « Memlia, tenue au secret professionnel », « secret garanti ».

Restent **non vérifiés**, donc absents des pages tant qu'ils ne le sont pas : le mandat qui permet à
l'expert-comptable d'agir sur la plateforme agréée d'un client ; la différence entre bilan d'anomalies
et CRM ; le délai d'approbation en SAS ; l'article du code de déontologie des experts-comptables sur
le secret.

## 8. Données, gabarits et contrôles

Plan complet, ancré dans le code (chemins et lignes) : [`hub-agents-ia/ARCHITECTURE.md`](hub-agents-ia/ARCHITECTURE.md) ;
gabarits JSON-LD : [`hub-agents-ia/JSON-LD.md`](hub-agents-ia/JSON-LD.md). Ce que le plan change à cette
spécification :

- **Familles neuves** : un registre à part `FAMILLES_HUB` (`active: false` imposé) et le pôle
  `developpement-cabinet`, **hors** de `FAMILLES` : les comptes publics « 60 familles, 12 pôles » de
  l'accueil, de `/methode`, du pilier et de l'article scellé ne bougent pas. `familles.ts` est une
  entrée du calendrier du blog : PR isolée, fusionnée tôt.
- **Avatars** : maîtres dans `docs/design/hub-specialistes/avatars/`, dérivés dans `public/agents/`
  (pas `public/images/`, dont `test_build.py` compte les images d'articles) ; un monogramme tient lieu
  d'avatar tant que les images manquent.
- **Média propre des fiches** : la table de rejeu est du HTML ; chaque fiche prend une exemption
  motivée de la clause « média » du contrat de page plutôt qu'une image qui doublerait le rejeu ; le
  hub a son cadre `49-hero-agents-ia` (série de preuves `agents-ia`, générée depuis les données).
- **Aucune requête réseau** : `connect-src 'none'` exige des Pages Functions (`functions/agents-ia.js`
  et une par fiche, comme les outils gratuits), pas seulement `_headers` ; c'est le ticket 07, prérequis
  de toute fusion d'une fiche.
- **Contact** : `sessionStorage` à usage unique et liste blanche (pas `?tache=`) ; la migration D1
  `0003` doit être **appliquée en production par Kevin avant** la fusion de la fonction, sinon tout envoi
  échoue.
- **Filtres** : les règles de grille comptent les cartes cachées ; une surcharge `flex-basis` par
  filtre tient les dispositions 3 + 2, 3 et 2 × 2, mesurée par Playwright à chaque état.
- **Hub** : sous l'annuaire, la définition détaillée de l'agent IA, le tableau des métiers et la
  frontière en trois colonnes (exigence d'intention informationnelle, cadrage §5).
- **Navigation** : le menu casse cinq assertions existantes, mises à jour délibérément.

**Invariants écrits avant le code** (I1 à I14, chacun avec le mutant qui doit le faire rougir) :
partition des familles ; douze cartes complètes ; comptes publics stables ; filtres sans JavaScript ;
un `h1`, aucune capitale ; JSON-LD attendu ; sitemap ; mots interdits du §9 bis ; statut d'outil fermé
et livraison citée ; rejeu repris mot pour mot ; aucune requête réseau ; garde `domaine-proscrit` portée
depuis `memlia-rdv` ; contact ; avatars mesurés.

**Treize tickets** (`.scratch/hub-specialistes/issues/`) : 01 socle de contrôles rouges et garde
`domaine-proscrit` · 02 données (PR isolée) · 03 utilitaires JSON-LD · 04 hub · 05 navigation · 06 fiche
pilote Comptabilité · 07 CSP et Functions · 08 page des outils · 09 huit fiches restantes · 10 contact
(`ready-for-human` : migration) · 11 maillage · 12 avatars (`ready-for-human` : génération par Kevin
dans ChatGPT) · 13 passe finale. Ordre : 01 → 02 → 03 → 04 → 05 → {06, 07, 08} → 09 → 10 → 11 → 12 → 13 ;
aucune fiche fusionnée sur `main` avant 07.

## 9. Images

Bible, prompts et marche à suivre : [`docs/design/hub-specialistes/prompts-images.md`](../../design/hub-specialistes/prompts-images.md).
