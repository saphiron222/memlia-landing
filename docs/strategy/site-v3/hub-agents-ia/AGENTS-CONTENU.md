# Contenu des douze agents IA du hub memlia.fr

> Livrable du 15/10/2026, relu et intégré le jour même (spec §2.1 et §3, porte 2). Corrections de
> l'intégration : partition rétablie (`ia-generative-agents` au hub, `complements-excel` à Octavie,
> `audit-legal` à Aude, dans les données seulement), démonstration de Grégoire sans cas SAS, arbitrages
> du §15 pris.
> Décision appliquée : « On rêve grand et on fait ensuite » (Kevin, 15/10/2026 ; charte v7 §2) : chaque
> agent présente tout ce qu'un agent IA bien construit peut préparer dans son métier, sans retrait ni
> défense. Lu avant d'écrire : charte v7 (§2, §2 bis, §6, §8, §9, §9 bis, §10), `CONTEXT.md`,
> `HUB-AGENTS-IA-SPEC.md` (porte 2), `FACT-CHECK.md` (14/10), `MOTS-CLES.md` (15/10), `OUTILS.md`,
> `src/data/familles.ts`, relevés Factory 456 (`/runbot`, catalogue du diagnostic) et agpt.co (Max,
> Maria) : listes de tâches et structure de fiche seulement, aucune phrase reprise (vérification au §14).

**Conventions de lecture**

- Gabarit de fiche (spec §2) : mission de carte, H1, chapeau du héros, tâches, livrables, démonstration,
  règle écrite du métier, avec ou sans, questions, tâches de départ, logiciels, voisins.
- Le chapeau définit l'agent IA à sa première apparition (charte §9 bis) et finit sur la décision du cabinet.
- **Famille** : identifiant existant de `familles.ts`, ou « neuve : `<id>` » (à ajouter dans
  `FAMILLES_HUB`, `active: false`, liste « à écrire avec vous » sans lien).
- **Démonstration** : dossier fictif aux noms inventés, dit comme tel au rendu (« Rejoué sur un dossier
  fictif »). Issues : **Préparé** (proposition complète dans la règle, qui attend la validation
  ordinaire), **À valider** (la règle présente un choix au collaborateur), **Arrêt** (la règle refuse ;
  la ligne est barrée au rendu, sa raison reste lisible après « Motif : »).
- Les phrases réglementées reprennent `FACT-CHECK.md` mot pour mot ; elles sont listées au §13 pour la
  revue de contenu réglementé. La copy ne porte aucun tiret cadratin.

---

## 1. Balthazar · Comptabilité

**Destination** `/agents-ia/comptabilite` · **Requête** ia comptabilité (390 par mois, Google, 15/10/2026) · **Voisins** Victoire (avant : l'entrée en relation) ; Grégoire et Florent (après)

**Mission (carte)** : Prépare chaque geste de la tenue, de la pièce reçue à la clôture ; vos collaborateurs valident chaque écriture.

**H1** : IA en comptabilité : de la pièce reçue à la clôture, l'agent IA prépare la saisie, les rapprochements et la révision, vos collaborateurs valident.

**Chapeau** : Balthazar est un agent IA : la règle écrite des tâches comptables de votre cabinet, mise en œuvre dans vos outils. Il lit, rapproche et propose, puis s'arrête dès qu'un cas sort de la règle ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Réclamer les pièces manquantes | Par dossier, la liste des pièces attendues et absentes (mouvement bancaire sans facture, facture sans règlement), avec la relance graduée rédigée dans le ton du cabinet. | `collecte-pieces` |
| Lire et pré-imputer les pièces | Chaque facture lue, ses champs extraits, le compte, la TVA et le journal proposés d'après les imputations déjà validées du dossier. | `saisie-ocr` |
| Reprendre les factures électroniques reçues | Les factures arrivées par la plateforme agréée du client et restées hors de votre outil comptable, rapprochées de la comptabilité, l'écart nommé. | `facture-electronique` |
| Contrôler les factures d'achat | Doublons sans numéro, avoirs non imputés, échéances fournisseurs dépassées : chaque signal présenté avant le règlement ou la clôture. | `achats-fournisseurs` |
| Rapprocher la banque | Chaque mouvement apparié à son écriture quand un seul candidat existe, les suspens classés par type, l'état de rapprochement assemblé. | `banque-rapprochement` |
| Lettrer les comptes de tiers | Factures et règlements appariés selon vos règles écrites (montant, référence, tolérance d'écart), les paiements partiels isolés. | `lettrage` |
| Intégrer ventes, caisse et e-commerce | Tickets Z, exports de boutique en ligne et versements des prestataires de paiement mis au format d'import du dossier, TVA ventilée, commissions séparées. | `ventes-caisse` |
| Tenir immobilisations et emprunts | La fiche d'immobilisation proposée depuis la facture, les dotations et les échéances d'emprunt calculées, les écritures récurrentes prêtes. | `immobilisations-emprunts` |
| Réviser par cycle | Comptes d'attente, soldes de sens anormal, TVA non soldée, charges à payer et produits constatés d'avance proposés avec leur pièce. | `revision-cycles` |
| Préparer la clôture | Balance contrôlée, FEC testé dans sa forme, états et plaquette assemblés pour la revue du chef de mission. | `cloture-bilan` |

Aussi dans son périmètre (familles titulaires sans ligne propre) : `notes-de-frais` (justificatifs de frais lus et contrôlés, manquants réclamés en les nommant) ; `ged-dossier-permanent` (pièces nommées et rangées selon votre plan de classement).

### Ce que Balthazar vous remet

1. *Exemple fictif* · **Le lot de saisie du mois** de l'Atelier Loriot : 42 pièces lues, chaque écriture proposée avec son compte, sa TVA et la pièce en lien ; 3 pièces mises de côté, chacune avec son motif. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La relance de pièces prête à envoyer** : cinq pièces nommées par date, montant et fournisseur, dans le ton de votre cabinet. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le rapprochement bancaire du mois**, relevé par relevé, chaque suspens typé et daté.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : l'Atelier Loriot, SARL de menuiserie inventée, exercice au 31/12/2026, pièces de septembre.

**La règle écrite (lecture et pré-imputation des pièces).** Une pièce lisible d'un fournisseur connu reçoit l'imputation déjà validée pour lui, avec la TVA calculée sur le taux lu ; un fournisseur nouveau reçoit les imputations possibles, à choisir par le collaborateur. Une pièce illisible, datée hors de l'exercice ou identique à une pièce déjà saisie arrête la proposition et nomme son motif.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Facture d'électricité d'un fournisseur déjà imputé en 6061, TVA à 20 % lue | Écriture proposée 6061 / 44566 / 401, pièce en lien | Préparé |
| Première facture d'un fournisseur de quincaillerie | Champs extraits ; deux imputations présentées : achats de matières ou petit équipement | À valider |
| Facture de même numéro et de même montant qu'une pièce saisie en août | Aucune écriture proposée. Motif : doublon probable, pièce d'août en lien | Arrêt |
| Photo de ticket floue, montant TTC illisible | Aucune écriture proposée. Motif : montant illisible ; relance de la pièce préparée | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Lire les pièces et en extraire les champs | Chaque écriture proposée, lot par lot | L'imputation d'un cas nouveau ou atypique |
| Proposer l'imputation d'un fournisseur connu | Chaque appariement à plusieurs candidats, en banque ou en lettrage | L'intégration dans votre logiciel comptable |
| Rapprocher un mouvement de son unique candidat | Chaque relance de pièces au client | Le jugement de révision |
| Préparer relances, états et contrôle de forme du FEC | Chaque régularisation de fin d'exercice | La clôture et les comptes remis au client |

**Conditions d'arrêt**
1. Pièce illisible, incomplète ou déjà saisie.
2. Date hors de l'exercice, ou dossier non identifié.
3. Écart sans règle écrite : plusieurs candidats, montant divergent, compte absent du plan du dossier.

**Ce qui ne part jamais sans vous**
- La relance de pièces au client : votre collaborateur la relit et l'envoie.
- Le lot d'écritures : votre collaborateur le valide, puis l'importe dans votre logiciel.
- La plaquette et les comptes annuels : l'expert-comptable les revoit et les remet.

### Avec ou sans Balthazar

| Sans Balthazar | Avec Balthazar |
|---|---|
| Ressaisir chaque facture à la main | Un lot d'écritures proposé, que votre collaborateur valide |
| Chercher la pièce manquante au moment de la clôture | Une relance prête chaque mois, que votre collaborateur envoie |
| Pointer la banque ligne à ligne | Seuls les mouvements sans candidat unique présentés, que votre collaborateur tranche |
| Découvrir un compte d'attente plein en révision | Les soldes à justifier listés au fil de l'eau, que le chef de mission revoit |

### Avant de confier une tâche à Balthazar

- **Faut-il changer votre logiciel comptable ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. En comptabilité, ce sont les pièces qu'il ne lit pas, les mouvements qu'il ne rapproche pas et les gestes entre deux outils.
- **Les écritures entrent-elles dans le logiciel sans contrôle ?** Chaque écriture proposée attend la validation de votre collaborateur, lot par lot. L'import dans votre logiciel reste son geste.
- **Que devient une pièce illisible ?** Elle sort du lot avec son motif et la relance qui la réclame. Aucune écriture n'est proposée par ressemblance avec une autre pièce.
- **Balthazar prépare-t-il aussi la révision et la clôture ?** Oui : comptes d'attente, régularisations de fin d'exercice, contrôle de la balance et forme du FEC. Le jugement de révision et la clôture restent au chef de mission et à l'expert-comptable.
- **Qui voit les pièces de vos clients ?** Les pièces sont lues en place, dans vos outils, avec les seuls accès ouverts pour la tâche. La règle est rejouée sur un dossier fictif avant de toucher un vrai dossier.
- **Combien coûte une tâche prise en charge ?** Vous payez une tâche prise en charge, pas des sièges. Le devis dépend des sources, des règles et des exceptions ; la maintenance y est écrite.

### Par quelle tâche commencer ?

**Tâches de départ** : `collecte-pieces` · `saisie-ocr` · `banque-rapprochement`

**Logiciels concernés** : Pennylane, Cegid Loop, Cegid Quadra Plus, Sage 100 Comptabilité, Sage Génération Experts, ACD COMPTA, EBP Comptabilité, MyU, Tiime, Inqom, fulll, AMICOMPTA, Dext, N2F, Qonto, Planity, PrestaShop, Microsoft Excel.

---

## 2. Salomé · Paie et social

**Destination** `/automatisation/paie` (bandeau « Qui prend ce métier » ; la requête de la page, « automatisation paie pôle social », et son rejeu ne changent pas) · **Requête d'une fiche propre, si elle s'ouvre** ia paie (40 par mois, à départager de `/automatisation/paie` avant tout titre) · **Voisins** Victoire (avant : l'entrée en relation) ; Balthazar (après : les écritures de paie) ; Raphaël (la paie de l'équipe du cabinet)

**Mission (carte)** : Prépare la paie de vos dossiers, des variables reçues aux retours DSN ; votre gestionnaire valide et dépose.

**H1 (fiche propre)** : IA paie pour cabinet comptable : variables, bulletins et DSN préparés et contrôlés, la DSN déposée par votre gestionnaire.

**Chapeau** : Salomé est un agent IA : la règle écrite des tâches de paie de votre pôle social, mise en œuvre dans vos outils. Elle collecte, contrôle et prépare, puis s'arrête dès qu'un cas sort de la règle ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Collecter les variables du mois | La demande mensuelle préparée pour chaque client ; les variables lues dans les courriels et tableaux reçus, rapprochées du mois précédent ; les manquants nommés. | `variables-de-paie` |
| Contrôler les bulletins avant la DSN | Bulletins calculés comparés à la règle du dossier (taux, plafonds, absences, primes), chaque écart présenté avec sa source. | `bulletins-controle` |
| Préparer la DSN mensuelle | Contrôles de cohérence avant dépôt ; échéance du dossier posée au calendrier selon son effectif et sa date de paie. | `dsn-crm` |
| Trier les retours DSN | Les comptes rendus métier rattachés à leur dossier, chaque écart à corriger présenté avec la correction proposée. | `dsn-crm` |
| Préparer entrées et sorties | DPAE, contrat de travail tiré de votre modèle, solde de tout compte, certificat de travail et attestation employeur prêts à relire. | `entrees-sorties-salaries` |
| Suivre absences et arrêts | Arrêts reçus rattachés au salarié, attestations de salaire préparées, indemnités journalières rapprochées des versements. | `absences-ijss` |
| Tenir les échéances de cotisations | Échéancier Urssaf, retraite complémentaire et prévoyance par dossier, montants rapprochés de la DSN, règlements préparés. | `charges-sociales-echeances` |
| Passer la paie en comptabilité | Le journal de paie mis au format d'import du dossier comptable, la concordance des charges sociales contrôlée. | neuve : `ecritures-de-paie` |
| Diffuser bulletins et états | Bulletins prêts pour le coffre de chaque salarié, journaux et états prêts pour le client, libérés après validation de la paie. | neuve : `diffusion-documents-paie` |
| Piloter la production sociale | Avancement par dossier et par étape, retards et exceptions, en agrégats ; aucune mesure par gestionnaire. | `suivi-production-sociale` |

### Ce que Salomé vous remet

1. *Exemple fictif* · **Le contrôle avant DSN** de la Pâtisserie Mésange : douze bulletins comparés à la règle du dossier, deux écarts présentés avec leur source (prime absente ce mois-ci, taux accident du travail différent de la dernière notification). Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La demande de variables d'octobre**, prête à envoyer au client, avec les trois informations qui manquent déjà. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Les retours DSN du mois triés par dossier**, chaque écart avec la correction proposée.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : la Pâtisserie Mésange, SARL inventée, douze salariés fictifs, paie versée le dernier jour du mois, variables d'octobre 2026.

**La règle écrite (collecte des variables).** Une variable reçue est reprise quand le salarié figure dans la paie du mois et que l'écart au mois précédent reste dans le seuil écrit du dossier. Un salarié absent de la paie, une variable attendue qui manque ou deux sources qui se contredisent arrêtent la reprise et placent le cas devant le gestionnaire.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Heures supplémentaires d'une vendeuse, dans le seuil du dossier | Variable reprise, courriel du client en lien | Préparé |
| Prime exceptionnelle d'un pâtissier, trois fois sa prime habituelle | Écart au mois précédent présenté avec le seuil écrit | À valider |
| Arrêt de travail annoncé par téléphone, sans dates dans le courriel | Absence notée « à confirmer », dates réclamées dans un brouillon au client | À valider |
| Heures transmises pour un apprenti absent de la paie, aucune entrée déclarée | Reprise refusée. Motif : salarié inconnu de la paie du mois | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Demander et lire les variables reçues | Chaque variable hors seuil | L'interprétation d'une situation individuelle et de la convention collective |
| Comparer au mois précédent et à la règle du dossier | Chaque écart de bulletin | Le calcul validé dans le logiciel de paie |
| Trier les comptes rendus métier | Chaque demande au client | Le dépôt de la DSN et de la DPAE |
| Préparer DPAE, attestations et pièces de fin de contrat | Chaque document destiné à un salarié | Le conseil social à l'employeur |

**Conditions d'arrêt**
1. Salarié absent de la paie, ou matricule ambigu.
2. Variable attendue manquante, ou contradictoire entre deux sources.
3. Écart hors du seuil écrit du dossier.

**Ce qui ne part jamais sans vous**
- La DSN : déposée par votre gestionnaire depuis le compte déclarant, après les contrôles.
- La DPAE : déposée par votre gestionnaire.
- La demande de variables ou de pièces : envoyée au client par votre gestionnaire.
- Les bulletins : libérés vers les salariés par votre gestionnaire, une fois la paie validée.
- Les documents de fin de contrat : signés par l'employeur.
- Le règlement des cotisations : validé par l'employeur avant tout paiement.

### Avec ou sans Salomé

| Sans Salomé | Avec Salomé |
|---|---|
| Recopier les variables depuis les courriels | Des variables reprises avec leur source, dont le gestionnaire valide les écarts |
| Découvrir un écart après l'envoi du bulletin | Des contrôles joués avant la DSN, que le gestionnaire corrige |
| Ouvrir les comptes rendus DSN un par un | Des retours triés par dossier, dont le gestionnaire choisit la correction |
| Relancer le client de mémoire | Une demande mensuelle prête, que le gestionnaire envoie |

### Avant de confier une tâche à Salomé

- **Salomé dépose-t-elle la DSN ?** La DSN part de votre compte déclarant, déposée par votre cabinet ; nous contrôlons avant, nous ne déposons jamais. Son échéance suit l'effectif et la date de paie du dossier : le 5 ou le 15 du mois suivant.
- **Les comptes rendus métier sont-ils corrigés sans vous ?** Après chaque dépôt, les organismes renvoient leurs comptes rendus métier ; nous les trions et vous présentons chaque écart à corriger. La correction, puis le nouveau dépôt, restent des gestes de votre gestionnaire.
- **Faut-il changer de logiciel de paie ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Il calcule les bulletins ; nous préparons ce qui arrive avant lui et contrôlons ce qui en sort.
- **Que devient une variable ambiguë ?** La reprise s'arrête et le cas passe devant le gestionnaire, les deux sources côte à côte. Rien n'est complété par analogie avec le mois précédent.
- **Salomé classe-t-elle vos gestionnaires ?** Le suivi de la production sociale se lit par dossier et par étape, en agrégats. Aucune mesure ne porte sur une personne.

### Par quelle tâche commencer ?

**Tâches de départ** : `variables-de-paie` · `bulletins-controle` · `dsn-crm`

**Logiciels concernés** : Silae, Payfit, Sage 100 Paie & RH, Sage Paie, Quadra Paie, Cegid Payroll Ultimate, ACD Paie, Microsoft Excel, Outlook, Gmail.

---

## 3. Grégoire · Juridique et fiscal

**Destination** `/agents-ia/juridique-fiscal` · **Requête** ia juridique expert comptable (aucun volume Google Ads, SERP alignée et annonceurs présents ; lien obligatoire vers `/automatisation/secretariat-juridique`) · **Voisins** Balthazar (avant : la comptabilité tenue) ; Florent (après) ; Victoire (la lettre de mission)

**Mission (carte)** : Prépare déclarations fiscales, approbation des comptes et formalités de vos dossiers ; votre cabinet signe et dépose.

**H1** : IA juridique pour expert-comptable : TVA, liasse, approbation des comptes et formalités préparées, votre cabinet signe et dépose.

**Chapeau** : Grégoire est un agent IA : la règle écrite des tâches juridiques et fiscales de votre cabinet, mise en œuvre dans vos outils. Il calcule les échéances, prépare déclarations et projets d'actes, puis s'arrête dès qu'une date ou une règle manque ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Préparer la TVA | La déclaration préparée depuis la comptabilité tenue ; cohérence entre chiffre d'affaires, TVA collectée et crédits contrôlée, chaque vérification tracée. | `tva` |
| Calculer acomptes et solde d'IS | Acomptes calculés depuis le dernier résultat, relevés préparés, échéances posées au calendrier du dossier. | `is-acomptes` |
| Préparer la liasse fiscale | La liasse remplie depuis la balance validée, contrôles de cohérence entre tableaux, points à justifier listés. | neuve : `liasse-fiscale` |
| Préparer les déclarations annexes | CFE, CVAE, DAS2, IFU et taxes sur les véhicules préparées et suivies jusqu'à leur dépôt. | `declarations-annexes` |
| Tenir le calendrier fiscal du portefeuille | Échéances déclaratives et de paiement de chaque dossier selon son régime et sa clôture, retards signalés en agrégats. | `echeances-fiscales` |
| Suivre télédéclarations et rejets | Accusés de réception lus, rejets rattachés au dossier, correction proposée jusqu'au nouvel envoi. | `teledeclarations-rejets` |
| Préparer l'approbation des comptes | Convocation, projet de rapport de gestion repris des comptes, projets de résolutions et de procès-verbal. | `secretariat-juridique` |
| Préparer le dépôt des comptes | La liasse de pièces assemblée pour le guichet unique ou le greffe, le délai qui suit l'approbation posé au calendrier. | `secretariat-juridique` |
| Constituer les dossiers de formalités | Création, modification ou cessation : dossier préparé pour le guichet unique, pièces manquantes réclamées en les nommant. | `formalites-creation-modification` |
| Mettre à jour registres et bénéficiaires effectifs | Registres des décisions et des mouvements de titres mis à jour, déclaration des bénéficiaires effectifs préparée, changement repéré au registre national des entreprises ou au BODACC. | `registres-obligations` |

### Ce que Grégoire vous remet

1. *Exemple fictif* · **Le calendrier des approbations du portefeuille** : chaque dossier avec sa clôture, sa date limite d'approbation et le dépôt qui suit, plus le rappel prêt pour chaque dirigeant. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **Le projet de procès-verbal d'approbation** de la SARL Bouvreuil, affectation du résultat reprise de la proposition de la gérance, prêt à relire. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Les avis d'impôt et les messages des espaces professionnels** de vos clients, relevés et rattachés à chaque dossier.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : un portefeuille de quatre sociétés inventées ; calendrier joué le 14/10/2026.

**La règle écrite (calendrier d'approbation et de dépôt).** Pour chaque dossier, la date limite d'approbation se calcule depuis la clôture confirmée et le délai écrit pour sa forme sociale, puis le dépôt suit dans le mois, ou dans les deux mois par voie électronique. Une clôture non confirmée ou une forme sociale sans délai écrit dans la règle arrête le calcul ; une prolongation annoncée sans décision reçue laisse la date légale en place et le signale.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| SARL Bouvreuil, clôture au 30/06/2026 confirmée par la balance | Approbation au plus tard le 31/12/2026, dépôt dans le mois qui suit ou dans les deux mois en ligne ; rappel au gérant préparé | Préparé |
| SA Grand-Duc, même clôture, prolongation évoquée par le président | Date légale conservée, mention « prolongation annoncée, décision à recevoir » | À valider |
| SARL Hulotte, clôture au 30/06/2026 selon les statuts, au 31/12/2026 selon la balance remise | Aucune date calculée. Motif : date de clôture divergente entre deux sources | Arrêt |
| SARL Ortolan, comptes approuvés le 20/06/2026, aucun dépôt constaté | Dépôt manquant signalé, justificatif réclamé dans un brouillon au gérant | À valider |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Rassembler dates, balances et décisions déjà prises | Chaque déclaration avant télétransmission | La qualification fiscale ou juridique d'une opération |
| Calculer échéances et acomptes depuis les données tenues | Chaque projet d'acte et de procès-verbal | Les décisions des associés |
| Préparer déclarations, projets d'actes et dossiers de formalité | Chaque date et chaque destinataire d'un rappel | La signature |
| Lire accusés, rejets et annonces légales | Chaque dossier de formalité avant dépôt | La télédéclaration, le dépôt des comptes et des formalités |

**Conditions d'arrêt**
1. Date de clôture non confirmée, ou divergente entre deux sources.
2. Forme sociale ou régime fiscal sans règle écrite dans le dossier.
3. Montant à déclarer sans concordance avec la comptabilité validée.

**Ce qui ne part jamais sans vous**
- La déclaration de TVA, les relevés d'IS et la liasse : télétransmis par votre cabinet après validation.
- Le procès-verbal et les décisions : signés par les associés.
- Le dépôt des comptes et les formalités : déposés par votre cabinet sur le guichet unique, ou au greffe pour un dépôt papier.
- La déclaration des bénéficiaires effectifs : déposée par votre cabinet.
- Le rappel au dirigeant : envoyé par votre collaborateur.

### Avec ou sans Grégoire

| Sans Grégoire | Avec Grégoire |
|---|---|
| Tenir les échéances dans un tableur que personne ne met à jour | Un calendrier recalculé à chaque clôture, que le responsable juridique relit |
| Ressaisir la balance dans la liasse | Une liasse préparée avec ses contrôles, que l'expert-comptable valide et télétransmet |
| Rédiger chaque procès-verbal depuis un ancien modèle | Des projets d'actes repris des comptes, que le juriste relit |
| Découvrir un dépôt oublié l'exercice suivant | Les dépôts manquants signalés, que le collaborateur relance |

### Avant de confier une tâche à Grégoire

- **Notre logiciel juridique suit déjà les assemblées : que reste-t-il ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Il reste souvent le rappel au dirigeant, les pièces qui manquent et le dépôt que personne n'a constaté.
- **Le dépôt des comptes part-il seul ?** Les comptes se déposent en ligne sur le guichet unique, ou sur papier au greffe ; nous préparons la liasse de pièces, sans rien déposer à votre place. Le dépôt suit dans le mois de l'approbation, ou dans les deux mois par voie électronique.
- **Grégoire approuve-t-il les comptes ?** L'approbation est une décision des associés. Grégoire en prépare les documents : convocation, projet de rapport, projets de résolutions et de procès-verbal.
- **Les échéances tiennent-elles compte de la forme de la société ?** En SARL et en SA, les comptes sont approuvés dans les six mois de la clôture, sauf prolongation accordée par le juge. Pour une autre forme, le délai s'écrit d'abord dans la règle du dossier, et le calcul attend qu'il y soit.
- **Les formalités passent-elles par Grégoire ?** Les formalités de création, de modification et de cessation passent par le guichet unique ; nous préparons le dossier, votre cabinet le signe et le dépose. Les pièces manquantes sont réclamées en les nommant.
- **Que devient le calendrier quand une date manque ?** Le calcul s'arrête pour ce dossier et le présente au collaborateur, avec la source qui manque. Les autres dossiers du portefeuille continuent.

### Par quelle tâche commencer ?

**Tâches de départ** : `secretariat-juridique` · `tva` · `echeances-fiscales`

**Logiciels concernés** : Lexis PolyActe, registre national des entreprises (INPI), BODACC, répertoire Sirene, Youtrust (anciennement Yousign), Docusign, Cegid Loop, ACD COMPTA, Sage 100 Comptabilité, EBP Comptabilité, Microsoft Excel.

---

## 4. Florent · Finance

**Destination** `/agents-ia/finance` · **Requête** agent ia finance (20 par mois ; « ia finance », 390, vise l'investissement) · **Voisins** Balthazar et Grégoire (avant : les comptes et les déclarations) ; Émile (après : le rendez-vous avec le client)

**Mission (carte)** : Prépare situations, trésorerie et prévisionnels de vos clients depuis la comptabilité tenue ; chaque hypothèse est tracée pour votre revue.

**H1** : Agent IA finance pour cabinet comptable : situations, trésorerie et prévisionnels de vos clients préparés, chaque hypothèse tracée pour votre revue.

**Chapeau** : Florent est un agent IA : la règle écrite des missions de conseil financier de votre cabinet, mise en œuvre dans vos outils. Il agrège, projette et met en forme, puis s'arrête dès qu'une hypothèse n'a pas de source ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Préparer les situations intermédiaires | Situation trimestrielle ou semestrielle tirée de la comptabilité tenue, retraitements proposés (stocks, charges à payer), commentaires de variation pré-rédigés. | `situations-reporting-client` |
| Tenir le tableau de bord du client | Les indicateurs qu'il a choisis (chiffre d'affaires, marge, trésorerie, délais de paiement) mis à jour chaque mois ; seuils d'alerte signalés au collaborateur. | `situations-reporting-client` |
| Préparer le rendez-vous bilan | Synthèse commentée, graphiques, points de conseil à aborder et questions ouvertes du dossier. | `situations-reporting-client` |
| Projeter la trésorerie | Position rapprochée, encaissements et décaissements datés, semaine par semaine ; tensions signalées avec leurs causes. | `tresorerie-previsionnelle` |
| Construire le prévisionnel | Compte de résultat prévisionnel et plan de financement bâtis depuis l'historique, chaque hypothèse écrite avec sa source. | `previsionnel-business-plan` |
| Comparer budget et réalisé | Écarts du mois rapprochés du budget, comptes en cause listés, questions préparées pour le dirigeant. | `previsionnel-business-plan` |
| Monter le dossier de financement | Prévisionnel, liasses, situation et pièces du dossier permanent assemblés dans l'ordre que demande l'établissement prêteur. | `financement-aides` |
| Repérer aides et crédits d'impôt à étudier | Dispositifs à examiner selon l'activité et le territoire, justificatifs à réunir listés ; l'éligibilité se juge au cabinet. | `financement-aides` |
| Simuler la rémunération du dirigeant | Scénarios salaire et dividendes calculés sur les barèmes de l'année, chaque hypothèse affichée. | neuve : `remuneration-dirigeant` |
| Préparer évaluation et transmission | Retraitements, éléments chiffrés et versions du dossier réunis avant le tableau d'évaluation ; la valeur reste au cabinet. | `evaluation-transmission` |

### Ce que Florent vous remet

1. *Exemple fictif* · **La situation semestrielle** de la Menuiserie Pinson : compte de résultat au 30/06, trois retraitements proposés, commentaire de variation prêt à relire. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La trésorerie projetée semaine par semaine**, la semaine en tension signalée avec ses causes (échéance d'emprunt, TVA, salaires). Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le tableau de bord mensuel de chaque client**, mis à jour à chaque fin de mois tenue.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : la Menuiserie Pinson, SAS inventée, solde bancaire rapproché au 30/09/2026, projection jusqu'au 31/12/2026.

**La règle écrite (trésorerie prévisionnelle).** La projection part du solde bancaire rapproché et n'ajoute que des flux datés et chiffrés : échéances connues (emprunts, salaires, TVA, cotisations) et factures émises ou reçues à leur date d'échéance. Un flux sans date ni montant écrit, un solde non rapproché ou une hypothèse sans source reste hors de la projection et se présente au collaborateur.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Solde rapproché au 30/09 ; échéance d'emprunt, salaires et TVA datés | Projection semaine par semaine jusqu'à fin décembre, chaque flux avec sa source | Préparé |
| Facture client de 18 000 € échue depuis soixante jours | Encaissement laissé à son échéance avec la mention « retard constaté » ; scénario sans cet encaissement présenté à côté | À valider |
| Semaine du 23/11, solde projeté sous le seuil d'alerte écrit du dossier | Tension signalée, les trois flux qui la causent listés | À valider |
| Grosse commande annoncée par le dirigeant, sans date ni montant écrit | Flux non intégré. Motif : hypothèse sans source | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Agréger la comptabilité tenue | Chaque hypothèse et chaque retraitement | Le conseil au client |
| Projeter les flux datés et chiffrés | Chaque commentaire destiné au client | Le choix des hypothèses d'avenir avec le dirigeant |
| Mettre à jour indicateurs, tableaux et graphiques | Chaque scénario de rémunération | La valeur d'une entreprise |
| Assembler les pièces d'un dossier de financement | Chaque dossier avant transmission | L'engagement du cabinet sur un document remis |

**Conditions d'arrêt**
1. Pièce ou période de l'exercice absente.
2. Retraitement sans justification écrite.
3. Hypothèse sans source ni date.

**Ce qui ne part jamais sans vous**
- La situation, le tableau de bord ou le prévisionnel : remis au client par votre collaborateur, après revue de l'expert-comptable.
- Le dossier de financement : transmis par votre cabinet ou par le client, après validation.
- La simulation de rémunération : présentée au dirigeant par l'expert-comptable.

### Avec ou sans Florent

| Sans Florent | Avec Florent |
|---|---|
| Reconstruire la situation dans un tableur à chaque demande | Une situation préparée depuis la comptabilité tenue, que l'expert-comptable commente |
| Apprendre la tension de trésorerie quand le client appelle | Une tension signalée avec ses causes, que le collaborateur présente au client |
| Perdre la trace d'une hypothèse d'une version à l'autre | Chaque hypothèse sourcée et datée, que l'expert-comptable valide |
| Monter le dossier bancaire en cherchant les pièces | Un dossier assemblé dans l'ordre attendu, que le cabinet transmet |

### Avant de confier une tâche à Florent

- **Faut-il changer d'outil de prévisionnel ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. En finance, ce sont les données à rassembler, les hypothèses à tracer et les versions à tenir.
- **D'où viennent les chiffres ?** De la comptabilité tenue par votre cabinet et des pièces du dossier. Une donnée extérieure n'entre qu'avec sa source et sa date.
- **Florent conseille-t-il vos clients ?** Il prépare les chiffres, les scénarios et les points à aborder. Le conseil, la présentation et l'engagement du cabinet restent à l'expert-comptable.
- **Que devient une hypothèse du dirigeant sans chiffre ?** Elle reste hors de la projection et rejoint la liste des questions à lui poser. Rien n'est estimé à sa place.
- **Florent peut-il préparer une évaluation ?** Il réunit retraitements, éléments chiffrés et versions du dossier. La méthode retenue et la valeur restent au cabinet.

### Par quelle tâche commencer ?

**Tâches de départ** : `situations-reporting-client` · `tresorerie-previsionnelle` · `evaluation-transmission`

**Logiciels concernés** : Microsoft Excel, RCA Évaluation, Qonto, Pennylane, Cegid Loop, ACD COMPTA, Sage 100 Comptabilité, EBP Comptabilité, MyU.

---

## 5. Aude · Missions d'audit

**Destination** `/commissaires-aux-comptes` (la carte suffit ; aucun bloc ajouté à l'accueil CAC, spec §3) · **Requête** celle de l'accueil CAC, arrêtée après la mesure C2 ; « ia commissaire aux comptes » n'a aucun volume Google Ads · **Voisins** Octavie (formats et imports des fichiers reçus) ; Prudence (secret et données de la mission)

**Libellé** : Aude · agent IA missions d'audit (le métier se dit « missions d'audit » ; le titre de commissaire aux comptes désigne le lecteur, jamais l'agent).

**Mission (carte)** : Prépare la mécanique de vos mandats : FEC reçu, revue analytique, sélections et confirmations des tiers ; le jugement reste au commissaire aux comptes.

**H1 (fiche propre, si elle s'ouvre)** : IA pour les missions d'audit : FEC, revue analytique et confirmations des tiers préparés, le jugement reste au commissaire aux comptes.

**Chapeau** : Aude est un agent IA : la règle écrite des tâches répétitives de vos missions d'audit, mise en œuvre dans vos outils. Elle teste, rapproche et prépare selon vos paramètres, puis s'arrête dès qu'une donnée sort de la règle ; l'appréciation, les conclusions et la signature restent au commissaire aux comptes, et ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Constater la réception du FEC | Structure, numérotation, équilibre et dates testés à réception, totaux rapprochés de la balance ; défauts listés pour le chef de mission, sans conclusion sur les comptes. | `cac-fec-reception` |
| Préparer et suivre les demandes de documents | Liste par cycle tirée du programme de travail, manquants suivis, relances proposées au chef de mission. | `cac-demandes-documents` |
| Préparer la revue analytique | Procédures analytiques préparées : exercices comparés, variations au-delà du seuil fixé par l'équipe listées à expliquer, colonne de conclusion laissée vide. | `cac-revue-analytique` |
| Rejouer les critères de sélection des écritures | Les critères écrits du cabinet appliqués au FEC (écritures tardives, montants ronds, comptes sensibles), chaque écriture présentée avec la raison du signal. | `cac-revue-ecritures` |
| Préparer la sélection des tiers à confirmer | Demandes de confirmation des tiers (circularisation, NEP 505) : paramètres du commissaire aux comptes appliqués, liste proposée, couverture calculée, graine du tirage conservée. | `cac-confirmations-audit` |
| Rapprocher les réponses reçues | Réponses reçues par le commissaire aux comptes rapprochées des soldes, écarts documentés, absences de réponse signalées pour le choix des procédures. | `cac-confirmations-audit` |
| Rapprocher les fichiers de l'entité et la balance | Paie, immobilisations, stocks et emprunts : tableaux remis par l'entité comparés à la balance, écarts listés. | `cac-dossier-de-travail` |
| Assembler le dossier de travail | Feuilles par cycle, justificatifs indexés, commentaires de l'équipe conservés à chaque nouvelle version. | `cac-dossier-de-travail` |
| Préparer la synthèse et suivre la lettre d'affirmation | Observations reportées dans un projet de synthèse ; déclarations écrites de la direction (lettre d'affirmation, NEP 580) préparées et suivies. | `cac-rapport-certification` |
| Tenir les repères des mandats | Échéances de chaque mandat, assemblées, rapports à émettre ; données déclaratives préparées, sans dépôt. | `cac-suivi-mandats` |

Aussi dans son périmètre, à écrire avec vous (familles CAC existantes, inactives) : `cac-planification-missions` (affectations par mission), `cac-heures-realisees` (temps déjà saisis comparés au budget), `cac-acceptation-mandats` (éléments réunis pour la décision du signataire), `cac-attestations-chiffres` (chiffres rapprochés de leurs pièces).

Titulaire dans les données, jamais affichée (identifiant historique, invariant I1) : `audit-legal`.

### Ce qu'Aude vous remet

1. *Exemple fictif* · **Le constat de réception du FEC** du mandat Héron : contrôles de forme joués, deux défauts listés (écritures déséquilibrées sur un journal, dates hors exercice), aucune conclusion sur les comptes. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La feuille de revue analytique** : variations au-delà du seuil fixé par l'équipe, chacune avec son compte et la question à poser à la direction ; la colonne de conclusion reste vide. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **La sélection des tiers selon vos paramètres et la feuille des écarts**, prêtes à verser dans votre suite d'audit.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : le mandat Héron, SAS inventée, exercice clos le 30/06/2026, FEC et balance remis par l'entité.

**La règle écrite (réception du FEC).** À réception, le FEC est testé dans sa forme (colonnes attendues, numérotation continue par journal, équilibre entre débit et crédit, dates dans l'exercice), puis ses totaux sont rapprochés de la balance remise. Un fichier illisible, un exercice différent de celui du mandat ou une balance absente arrête le constat ; aucune conclusion sur les comptes n'est écrite.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| FEC complet et balance remise, totaux identiques | Constat de forme sans défaut, totaux rapprochés journal par journal | Préparé |
| Journal des ventes déséquilibré sur deux dates | Défaut listé avec les écritures en cause, question préparée pour l'entité | À valider |
| Écritures datées après la clôture dans le fichier de l'exercice | Écritures isolées et listées pour le chef de mission | À valider |
| Fichier remis pour l'exercice précédent | Aucun constat établi. Motif : exercice du fichier différent de celui du mandat | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Tester la forme des fichiers reçus | La méthode et les paramètres de chaque sélection | Le choix des diligences et des procédures |
| Calculer variations, sélections et couvertures selon vos paramètres | La liste de tiers et d'écritures proposée | La rédaction, l'envoi et la réception des demandes de confirmation |
| Rapprocher fichiers de l'entité, balance et réponses reçues | Chaque rapprochement proposé | L'appréciation des éléments collectés |
| Indexer pièces et feuilles du dossier de travail | Chaque relance de documents à l'entité | Les conclusions, l'opinion et la signature |

**Conditions d'arrêt**
1. Fichier illisible, ou d'un autre exercice que celui du mandat.
2. Population non rapprochée de la balance ou de sa source.
3. Tiers sous plusieurs identifiants non résolus, ou réponse sans identifiant qui permette un rattachement sûr.

**Ce qui ne part jamais sans vous**
- Les demandes de confirmation : rédigées, envoyées et reçues sous la maîtrise du commissaire aux comptes.
- La relance de documents et toute question à l'entité : envoyées par le chef de mission.
- La lettre d'affirmation : demandée à la direction par le commissaire aux comptes.
- Le rapport : signé par le commissaire aux comptes.

### Avec ou sans Aude

| Sans Aude | Avec Aude |
|---|---|
| Découvrir un FEC défectueux en pleine intervention | Un FEC constaté à réception, dont le chef de mission décide des suites |
| Rebâtir la revue analytique dans un tableur à chaque mandat | Des variations listées selon votre seuil, que l'auditeur explique |
| Tirer et suivre les confirmations à la main | Une sélection proposée selon vos paramètres, que le commissaire aux comptes valide |
| Perdre les commentaires de l'équipe à chaque nouvelle version | Des commentaires conservés à chaque régénération, et la revue se poursuit |

### Avant de confier une tâche à Aude

- **Aude certifie-t-elle quelque chose ?** Aucun résultat d'outil ne certifie les comptes. Le commissaire aux comptes conserve la responsabilité de sa mission et de son opinion ; nous préparons tableaux, rapprochements et exceptions.
- **Qui envoie les demandes de confirmation ?** Nous préparons la liste des tiers selon votre règle et le tableau des écarts ; l'envoi, la réception des réponses et l'appréciation restent au commissaire aux comptes. La sélection repose sur la méthode et les paramètres que vous fixez.
- **Comment apprécier l'outil au regard de la NEP 315 ?** La NEP 315 vous demande d'apprécier tout outil automatisé : nous vous remettons sa règle et ses essais pour le faire. La fiche outil décrit périmètre, données, paramètres, sorties, limites et cas fictifs rejoués.
- **La sortie suffit-elle pour le dossier de travail ?** Chaque préparation laisse une trace que votre dossier de travail peut reprendre : source, règle appliquée, éléments retenus. Une sortie de calcul n'est pas à elle seule un élément suffisant et approprié : vous l'appréciez et la complétez de vos travaux.
- **Faut-il changer de suite d'audit ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Quand votre suite teste déjà le FEC, nous prenons la sélection selon votre règle, la feuille des écarts et les fichiers de l'entité rapprochés de la balance.
- **Notre cabinet tient aussi des comptabilités : pouvons-nous mutualiser ?** Chaque mission a son périmètre et ses accès, et le commissaire aux comptes apprécie les incompatibilités et les risques d'indépendance. Nous ne présentons jamais la préparation et l'audit des comptes d'une même entité comme une synergie.

### Par quelle tâche commencer ?

**Tâches de départ** : `cac-fec-reception` · `cac-revue-analytique` · `cac-confirmations-audit`

**Logiciels concernés** : Caseware Audit France, Acropole Expert CAC, Auditsoft Premier, PackAUDIT, SmartFEC+, DreamAudit, e-Circu, Circit, Microsoft Excel. (RévisAudit : absent, domaine proscrit, OUTILS K4.)

---

## 6. Victoire · Commercial

**Destination** `/agents-ia/commercial` · **Requête** agent ia commercial (30 par mois ; décision de la porte 2) · **Voisins** Colette (avant : la parole du cabinet) ; Émile, Balthazar et Salomé (après : le dossier ouvert)

**Mission (carte)** : Prépare propositions, entrée en relation et lettres de mission ; l'acceptation du client et la vigilance restent à votre cabinet.

**H1** : Agent IA commercial pour cabinet comptable : propositions, entrée en relation et suivi des prospects préparés, vous décidez de ce qui part.

**Chapeau** : Victoire est un agent IA : la règle écrite des tâches commerciales de votre cabinet, mise en œuvre dans vos outils. Elle qualifie, chiffre et rassemble, puis s'arrête dès qu'une pièce ou un prix sort de la règle ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Repérer les entreprises à contacter | Entreprises nouvellement immatriculées dans vos secteurs et sur votre territoire, lues dans le répertoire Sirene, listées avec leur source ; le choix de qui contacter reste à l'associé. | neuve : `suivi-prospects` |
| Qualifier les demandes entrantes | Formulaire, courriel ou appel noté : activité, forme sociale, effectif, besoin ; fiche prospect complétée des données publiques. | neuve : `suivi-prospects` |
| Préparer le premier rendez-vous | Fiche du prospect, questions à poser, pièces à demander, points que votre règle de vigilance fait vérifier. | neuve : `suivi-prospects` |
| Chiffrer la proposition de mission | Périmètre et honoraires calculés depuis votre barème écrit, options présentées, proposition mise en page aux couleurs du cabinet. | neuve : `propositions-mission` |
| Relancer les propositions en attente | Date d'envoi, montant et prochaine relance de chaque proposition ; brouillon de relance prêt au moment prévu. | neuve : `suivi-prospects` |
| Réunir les pièces d'entrée en relation | Liste par jalon selon votre règle de vigilance (identité, bénéficiaires effectifs, statuts, extrait d'immatriculation), manquants réclamés en les nommant. | `onboarding-client` |
| Préparer le dossier d'appréciation du risque | Pièces et informations rassemblées pour la décision de l'associé, sans appréciation à sa place. | `lettre-de-mission-lcbft` |
| Rédiger la lettre de mission | Projet tiré de votre modèle, des données du dossier et de la proposition acceptée, prêt pour la signature électronique. | `lettre-de-mission-lcbft` |
| Ouvrir le dossier dans vos outils | Fiche créée dans la comptabilité, la paie et la GED selon votre plan de classement ; reprise d'un dossier transmis par un confrère préparée (pièces demandées, balance d'entrée contrôlée). | `onboarding-client` |
| Renouveler les lettres de mission | Lettres échues ou à réviser listées, mises à jour selon le barème en vigueur, prêtes à signer. | `lettre-de-mission-lcbft` |

### Ce que Victoire vous remet

1. *Exemple fictif* · **La proposition de mission** du Studio Rouge-Gorge : tenue, paie de quatre salariés, juridique annuel ; honoraires calculés depuis votre barème, deux options. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La liste des pièces d'entrée en relation par jalon**, avec le brouillon de demande au dirigeant. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le suivi des propositions envoyées** : date, montant, prochaine relance et état de chacune.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : le Studio Rouge-Gorge, SAS de design graphique inventée, entrée en relation ouverte le 01/10/2026.

**La règle écrite (entrée en relation).** Une entrée en relation avance d'un jalon quand chaque pièce que votre règle de vigilance demande pour ce jalon est reçue, lisible et en cours de validité ; une pièce expirée déclenche une nouvelle demande. Une pièce illisible, un bénéficiaire effectif non identifié ou un jalon franchi sans l'accord écrit de l'associé arrête le dossier et le présente à l'associé.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Statuts, extrait d'immatriculation et pièce d'identité de la présidente reçus et lisibles | Jalon « identification de la société » complet, pièces classées dans le dossier | Préparé |
| Pièce d'identité du second associé expirée depuis mars | Pièce signalée, nouvelle demande rédigée pour le dirigeant | À valider |
| Société détenue à 60 % par une holding dont les associés ne sont pas connus | Dossier bloqué. Motif : bénéficiaire effectif non identifié | Arrêt |
| Proposition acceptée, toutes les pièces du jalon reçues | Projet de lettre de mission prêt à relire, honoraires repris de la proposition | À valider |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Noter et qualifier les demandes | Chaque proposition et son prix | L'acceptation de la mission |
| Chiffrer depuis votre barème écrit | Chaque demande de pièces au prospect | L'appréciation du risque et la vigilance LCB-FT |
| Préparer rendez-vous, propositions et lettres depuis vos modèles | Chaque projet de lettre de mission | La déclaration de soupçon, hors de tout ce que nous préparons |
| Réunir, classer et suivre les pièces d'entrée | Chaque relance de prospect | Le choix de qui contacter, et la signature |

**Conditions d'arrêt**
1. Pièce illisible, ou pièce expirée restée sans remplacement.
2. Bénéficiaire effectif non identifié.
3. Prix hors du barème écrit, ou jalon franchi sans l'accord écrit de l'associé.

**Ce qui ne part jamais sans vous**
- La proposition de mission : envoyée au prospect par l'associé.
- La demande de pièces : envoyée par votre collaborateur.
- La lettre de mission : mise en signature par votre cabinet.
- La relance d'un prospect : envoyée par l'associé ou le collaborateur qui suit le contact.

### Avec ou sans Victoire

| Sans Victoire | Avec Victoire |
|---|---|
| Rédiger chaque proposition en repartant d'un ancien devis | Une proposition chiffrée depuis votre barème, que l'associé ajuste et envoie |
| Oublier une proposition restée sans réponse | Chaque proposition suivie, la relance prête que l'associé envoie |
| Courir après les pièces d'identification une fois la mission commencée | Les pièces réunies jalon par jalon, que le collaborateur vérifie |
| Laisser des lettres de mission échues sans renouvellement | Les lettres à renouveler listées, que l'associé fait signer |

### Avant de confier une tâche à Victoire

- **Victoire décide-t-elle de la vigilance LCB-FT ?** À l'entrée en relation, nous réunissons les pièces que votre règle de vigilance demande ; l'appréciation et l'acceptation du client restent à votre cabinet. La déclaration de soupçon appartient au professionnel assujetti ; elle reste hors de tout ce que nous préparons.
- **La lettre de mission part-elle seule en signature ?** Le projet attend la relecture de l'associé, puis votre cabinet le met en signature. Le retour signé est suivi et classé dans le dossier.
- **D'où viennent les prix des propositions ?** De votre barème écrit et des options que vous proposez. Un périmètre que le barème ne couvre pas arrête la proposition et la présente à l'associé.
- **Victoire contacte-t-elle des prospects à votre place ?** Elle prépare la liste, avec sa source, et un premier message. Le choix de qui contacter et chaque envoi restent à l'associé.
- **Faut-il changer d'outil de signature ou de suivi commercial ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Votre outil de signature garde l'envoi et la preuve ; nous préparons ce qui arrive avant et suivons ce qui revient.

### Par quelle tâche commencer ?

**Tâches de départ** : `onboarding-client` · `lettre-de-mission-lcbft` · neuve `propositions-mission`

**Logiciels concernés** : Youtrust (anciennement Yousign), Docusign, jesignexpert.com, Kanta, répertoire Sirene, registre national des entreprises (INPI), Outlook, Gmail, Microsoft Excel.

---

## 7. Colette · Communication

**Destination** `/agents-ia/communication` · **Requête** newsletter expert comptable (10 par mois ; « ia newsletter », 480, vise les lettres sur l'IA à lire) · **Voisins** Victoire (après : le prospect qui répond) ; Émile (les questions des clients) ; Grégoire (les échéances à rappeler)

**Mission (carte)** : Rédige la lettre d'information et l'actualité de vos clients depuis les sources officielles ; vous relisez avant tout envoi.

**H1** : Newsletter d'expert-comptable : l'agent IA rédige la lettre d'information et l'actualité de vos clients, vous relisez avant l'envoi.

**Chapeau** : Colette est un agent IA : la règle écrite des tâches de communication de votre cabinet, mise en œuvre dans vos outils. Elle lit les sources officielles, rédige et met en forme, puis s'arrête dès qu'une règle citée n'a pas de source datée ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Suivre l'actualité utile à vos clients | Sources officielles lues (Légifrance, BOFiP, Urssaf, service-public.fr), changements qui touchent votre portefeuille repérés et résumés pour l'associé. | neuve : `actualite-a-diffuser` |
| Rédiger la lettre d'information | La lettre du mois écrite depuis les sujets retenus, dans le ton de votre cabinet, chaque règle reliée à sa source officielle. | neuve : `lettre-information-clients` |
| Adapter une note à un secteur | Le même sujet réécrit pour un groupe de clients (artisans, commerçants, professions libérales), avec des exemples de leur métier. | neuve : `actualite-a-diffuser` |
| Préparer les rappels collectifs | Déclaration de revenus, clôtures, obligation nouvelle : message à un groupe de clients, avec les pièces à préparer. | neuve : `lettre-information-clients` |
| Rédiger les publications du cabinet | Publications LinkedIn et articles du site tirés de l'actualité et des travaux du cabinet, prêts à relire. | neuve : `publications-cabinet` |
| Tenir le calendrier éditorial | Sujets, dates, canaux et état de relecture sur le trimestre, haute saison comprise. | neuve : `publications-cabinet` |
| Préparer les invitations aux événements | Matinale, webinaire, réunion d'information : invitation, rappel et support de présentation. | neuve : `publications-cabinet` |
| Mettre à jour la présentation du cabinet | Plaquette de présentation, page équipe et pages de services relues et mises à jour. | neuve : `publications-cabinet` |
| Lire les retours en agrégats | Sujets les plus lus et questions reçues après chaque envoi, sans suivi lecteur par lecteur. | neuve : `publications-cabinet` |

### Ce que Colette vous remet

1. *Exemple fictif* · **La lettre d'information d'octobre** du cabinet Alouette : trois sujets retenus par l'associé, chaque règle reliée à sa source officielle, prête à relire. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La note « artisans du bâtiment »** tirée du même sujet, ton et exemples adaptés. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le calendrier éditorial du trimestre**, chaque publication préparée avec son état de relecture.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : le cabinet Alouette, cabinet inventé, lettre d'information d'octobre 2026.

**La règle écrite (lettre d'information).** Un sujet entre dans la lettre s'il a été retenu par le cabinet et que chaque règle citée renvoie à une source officielle datée ; le texte suit le ton et les formules écrites pour le cabinet. Une source absente ou non officielle, une date d'application incertaine ou un destinataire hors de la liste autorisée arrête le sujet, ou l'envoi.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Sujet retenu : réception des factures électroniques, source officielle lue | Paragraphe rédigé autour de la phrase « Depuis le 1er septembre 2026, toute entreprise doit pouvoir recevoir ses factures au format électronique. », lien vers la source | Préparé |
| Sujet proposé par la veille, pas encore retenu par l'associé | Sujet placé en attente au calendrier, résumé joint | À valider |
| Liste de diffusion qui contient trois clients sortis du portefeuille | Destinataires en cause listés, envoi suspendu jusqu'à la décision de l'associé | À valider |
| Barème repris d'un article de presse, sans texte officiel | Aucun paragraphe rédigé. Motif : source non officielle | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Lire les sources officielles et repérer les changements | Chaque sujet retenu | Le choix des sujets et la parole du cabinet |
| Résumer, rédiger et mettre en forme | Chaque texte avant envoi ou publication | Le conseil personnalisé à un client |
| Adapter un sujet à un secteur | Chaque liste de destinataires | La publication et l'envoi |
| Tenir le calendrier et lire les retours en agrégats | Chaque publication programmée | La réponse aux réactions publiques |

**Conditions d'arrêt**
1. Règle citée sans source officielle datée.
2. Date d'application incertaine, ou texte encore en projet.
3. Destinataire hors de la liste que le cabinet a autorisée.

**Ce qui ne part jamais sans vous**
- La lettre d'information : envoyée par votre cabinet après relecture de l'associé.
- La publication LinkedIn ou l'article du site : publiés par votre cabinet.
- L'invitation à un événement : envoyée par votre cabinet.
- Le rappel collectif : envoyé par le collaborateur en charge.

### Avec ou sans Colette

| Sans Colette | Avec Colette |
|---|---|
| Une lettre repoussée de mois en mois, faute de temps | Une lettre prête chaque mois, que l'associé relit et envoie |
| Une actualité recopiée d'une revue sans vérifier sa date | Chaque règle reliée à sa source officielle, que le collaborateur vérifie |
| Le même texte envoyé à tous les clients | Une version par secteur, dont l'associé choisit les destinataires |
| Une page du cabinet muette pendant la haute saison | Un calendrier tenu à l'avance, que le cabinet publie |

### Avant de confier une tâche à Colette

- **Colette publie-t-elle sur les réseaux du cabinet ?** Elle prépare chaque publication et la place au calendrier. La publication reste un geste du cabinet, après relecture.
- **D'où vient l'actualité ?** Des sources officielles : textes, doctrine administrative, pages des organismes. Un article de presse sert de signal, et la règle n'entre dans la lettre qu'avec sa source officielle.
- **La lettre ressemblera-t-elle à celle de tous les cabinets ?** Elle part de vos sujets, de vos secteurs de clients et du ton de votre cabinet. Chaque lettre se relit avant envoi, et vos corrections enrichissent la règle.
- **Qui choisit les sujets ?** L'associé, ou la personne en charge de la communication. Colette propose, à partir de la veille, ce qui touche votre portefeuille.
- **Faut-il changer d'outil d'envoi ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Votre outil d'envoi garde la liste et l'expédition ; nous préparons le contenu et le calendrier.

### Par quelle tâche commencer ?

**Tâches de départ** : neuve `lettre-information-clients` · neuve `actualite-a-diffuser` · neuve `publications-cabinet`

**Logiciels concernés** : Outlook, Gmail, SharePoint, Google Drive, Brevo, Mailchimp.

---

## 8. Émile · Relation client

**Destination** `/agents-ia/relation-client` · **Requête** relation client cabinet comptable (10 par mois ; « ia service client », 70, vise les éditeurs de service client) · **Voisins** Victoire (avant : le nouveau client) ; Balthazar, Grégoire et Florent (le dossier derrière chaque demande)

**Mission (carte)** : Trie chaque demande de vos clients, la relie à son dossier et prépare la réponse ; votre collaborateur valide avant envoi.

**H1** : Relation client en cabinet comptable : l'agent IA trie chaque demande, la relie au dossier et prépare la réponse, votre collaborateur valide.

**Chapeau** : Émile est un agent IA : la règle écrite des tâches de relation client de votre cabinet, mise en œuvre dans vos outils. Il trie, relie et rédige, puis s'arrête dès qu'une demande sort des réponses écrites ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Trier la boîte partagée | Chaque message classé par client, par dossier et par priorité ; échéance proche ou courrier d'un organisme placé en tête. | `boite-mail-courriers` |
| Relier chaque demande à son dossier | Expéditeur reconnu, demande rattachée au dossier, collaborateur du dossier prévenu. | `boite-mail-courriers` |
| Préparer les réponses courantes | Échéance, document, accès au portail : réponse rédigée depuis vos réponses types et les données du dossier. | `boite-mail-courriers` |
| Accuser réception et classer les pièces | Accusé de réception préparé, pièces jointes renommées et rangées dans le dossier selon votre plan. | `boite-mail-courriers` |
| Rattacher le courrier numérisé | Courrier papier scanné et lu, rattaché au dossier, échéance ou montant repéré. | `boite-mail-courriers` |
| Suivre les demandes en attente | Demandes restées sans réponse au-delà du délai que fixe le cabinet, par dossier ; vue du pôle en agrégats. | neuve : `suivi-demandes-clients` |
| Suivre les envois périodiques | Plaquettes, attestations, documents annuels : ce qui est parti et ce qui reste à envoyer, pour chaque dossier. | `envois-plaquettes-documents` |
| Préparer les rendez-vous clients | Ordre du jour, pièces et points ouverts du dossier ; invitation rédigée, créneau proposé. | `rendez-vous-agenda` |
| Préparer la fin de mission et le transfert | Inventaire des documents à remettre, courrier au confrère, accès à clore. | `offboarding-transfert` |
| Recueillir l'avis des clients | Questionnaire après le bilan préparé, réponses rassemblées en agrégats pour l'associé. | neuve : `satisfaction-clients` |

### Ce qu'Émile vous remet

1. *Exemple fictif* · **La boîte partagée du lundi matin, triée** : chaque message avec son dossier, sa priorité et le collaborateur concerné. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **Trois réponses courantes prêtes à valider** : la date d'une échéance, l'envoi d'une attestation, l'accès au portail. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le suivi des envois annuels** de plaquettes et d'attestations, pour chaque dossier.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : la boîte partagée d'un cabinet inventé, messages du 12/10/2026 sur le dossier Fauvette (SARL de fleuristerie inventée).

**La règle écrite (tri et réponse).** Un message reçoit une réponse préparée quand son expéditeur est relié à un dossier et que sa demande correspond à l'une des réponses types écrites par le cabinet, remplie avec les données du dossier ; un expéditeur inconnu est rapproché du dossier probable, à confirmer. Une demande hors des réponses types, dont toute demande de conseil, ou une pièce jointe illisible arrête la réponse et place le message devant le collaborateur du dossier.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| La gérante de Fauvette demande la date de sa prochaine déclaration de TVA | Réponse rédigée avec la date du calendrier du dossier | Préparé |
| La gérante demande la plaquette de l'exercice 2025 | Plaquette retrouvée dans le dossier, envoi préparé | Préparé |
| Message d'une adresse inconnue, facture en pièce jointe | Pièce mise de côté, dossier probable proposé | À valider |
| La gérante demande s'il vaut mieux acheter ou louer sa camionnette | Aucune réponse rédigée. Motif : demande de conseil, hors des réponses types ; message placé devant l'expert-comptable | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Trier, relier au dossier et prioriser | Chaque réponse avant envoi | Toute réponse qui engage le cabinet ou donne un conseil |
| Rédiger réponses types et accusés de réception | Chaque envoi de document | Une réclamation ou un désaccord |
| Classer pièces jointes et courrier | Chaque invitation | La décision de transférer un dossier |
| Préparer rendez-vous et envois périodiques | Chaque courrier de fin de mission | Le ton d'une relation difficile |

**Conditions d'arrêt**
1. Expéditeur relié à aucun dossier, ou à plusieurs.
2. Demande hors des réponses types écrites, dont toute demande de conseil.
3. Pièce jointe illisible, ou destinée à un autre dossier.

**Ce qui ne part jamais sans vous**
- La réponse au client et l'accusé de réception : envoyés par le collaborateur du dossier.
- La plaquette, l'attestation ou le document annuel : envoyés par le collaborateur.
- L'invitation à un rendez-vous : envoyée par le collaborateur.
- Le courrier au confrère : signé par l'expert-comptable.
- Le questionnaire de satisfaction : envoyé par le cabinet.

### Avec ou sans Émile

| Sans Émile | Avec Émile |
|---|---|
| Une boîte partagée lue par tout le monde et traitée par personne | Une boîte triée chaque matin, où chaque collaborateur trouve ses dossiers |
| La même réponse réécrite à chaque demande | Une réponse type remplie avec le dossier, que le collaborateur valide |
| Une pièce jointe perdue dans un fil de messages | Une pièce rangée dans son dossier, que le collaborateur retrouve |
| Une demande oubliée, découverte quand le client relance | Les demandes en attente visibles par dossier, que le responsable de pôle suit |

### Avant de confier une tâche à Émile

- **Émile lit-il les boîtes personnelles de vos collaborateurs ?** Il travaille sur les boîtes partagées et sur celles que vos collaborateurs lui confient. Aucune mesure ne porte sur une personne : le suivi se lit par dossier et en agrégats.
- **Une réponse peut-elle partir sans validation ?** Chaque réponse attend la validation du collaborateur du dossier. L'envoi reste son geste.
- **Que devient une demande de conseil ?** La règle la reconnaît et s'arrête : aucune réponse n'est rédigée. Le message passe devant l'expert-comptable, avec le dossier ouvert.
- **Faut-il changer de messagerie ou de portail client ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Votre messagerie et votre portail restent en place ; nous trions, relions et préparons dans ces outils.
- **Qui voit les messages de vos clients ?** Les messages sont lus en place, dans votre messagerie, avec les seuls accès ouverts pour la tâche. La règle est rejouée sur une boîte fictive avant de toucher la vôtre.

### Par quelle tâche commencer ?

**Tâches de départ** : `boite-mail-courriers` · `envois-plaquettes-documents` · `rendez-vous-agenda`

**Logiciels concernés** : Outlook et Exchange Online, Gmail, SharePoint, OneDrive, Google Drive, Microsoft Excel.

---

## 9. Honoré · Gestion du cabinet

**Destination** `/agents-ia/gestion-cabinet` · **Requête** gestion cabinet comptable (10 par mois, SERP alignée sur le pilotage du cabinet) · **Voisins** Victoire (la lettre de mission qui fixe le tarif) ; Raphaël (l'équipe) ; Octavie (les outils)

**Mission (carte)** : Prépare honoraires, prélèvements, relances d'impayés et plan de charge ; le portefeuille se lit en agrégats, jamais par personne.

**H1** : Gestion de cabinet comptable : honoraires, prélèvements, impayés et plan de charge préparés, le portefeuille lu en agrégats.

**Chapeau** : Honoré est un agent IA : la règle écrite des tâches de gestion de votre cabinet, mise en œuvre dans vos outils. Il rapproche, facture et agrège, puis s'arrête dès qu'un tarif manque ou qu'un indicateur viserait une personne ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Préparer la facturation du mois | Forfaits mensualisés et actes hors forfait (bulletins supplémentaires, attestations, déclarations rectificatives) rapprochés du relevé d'actes, chacun facturé une seule fois. | `honoraires-facturation` |
| Réviser les honoraires | Révision annuelle calculée selon la clause écrite de chaque lettre de mission, proposition par dossier. | `honoraires-facturation` |
| Constituer les lots de prélèvement | Lots préparés depuis les factures validées, mandats et références contrôlés. | `prelevements-encaissements` |
| Traiter les rejets de prélèvement | Rejets lus, motif rattaché au dossier, échéancier proposé. | `prelevements-encaissements` |
| Rapprocher les encaissements | Règlements reçus lettrés avec les factures d'honoraires, restes dus listés, trésorerie du cabinet projetée sur les encaissements attendus. | `prelevements-encaissements` |
| Relancer les impayés | Relance graduée depuis les messages types du cabinet, au stade qui convient ; suspension de mission signalée à l'associé. | `relances-impayes` |
| Mesurer la rentabilité par dossier | Temps déjà saisis rapprochés des honoraires : marge et écarts de tarif par dossier et par mission, en agrégats. | `rentabilite-dossiers` |
| Suivre les dossiers par état | Étape et exceptions de chaque dossier, retards signalés avant l'échéance. | `suivi-dossiers-etats` |
| Tenir le tableau de bord de production | Avancement et retards du portefeuille en indicateurs non nominatifs, par équipe et par étape. | `tableau-de-bord-production` |
| Préparer le plan de charge | Dossiers et pointes de la saison répartis par équipe et par semaine, proposition de répartition à arbitrer. | `planification-charge` |

### Ce qu'Honoré vous remet

1. *Exemple fictif* · **La facturation d'octobre** d'un portefeuille inventé : chaque dossier avec son forfait et ses actes hors forfait ; un acte déjà facturé écarté avec sa référence. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **Les relances d'impayés au deuxième stade**, prêtes à envoyer, avec l'historique de chaque dossier. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le tableau de bord du portefeuille**, en agrégats par équipe et par étape, jamais par personne.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : trois dossiers inventés (Martinet, Rossignol, Sittelle), relevé d'actes d'octobre 2026.

**La règle écrite (actes hors forfait).** Un acte hors forfait se facture une fois : il figure au relevé du mois, son tarif est écrit dans la lettre de mission ou le barème, et aucune facture antérieure ne porte sa référence. Un acte sans tarif écrit ou déjà facturé arrête la ligne ; une lettre de mission échue laisse la ligne au tarif en vigueur et le signale.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Martinet : trois bulletins au-delà du forfait, tarif unitaire écrit dans la lettre | Ligne préparée avec la référence du relevé d'actes | Préparé |
| Martinet : lettre de mission échue au 30/09/2026 | Ligne préparée au tarif de la lettre échue, mention « lettre à renouveler » | À valider |
| Rossignol : attestation demandée par la banque, aucun tarif écrit | Aucune ligne préparée. Motif : acte sans tarif écrit | Arrêt |
| Sittelle : déclaration rectificative déjà facturée en septembre | Aucune ligne préparée. Motif : acte déjà facturé, facture de septembre en lien | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Rapprocher actes, relevés et barèmes | Chaque facture | Le tarif et le geste commercial |
| Constituer lots, relances et échéanciers | Chaque lot de prélèvement | La suspension d'une mission |
| Lettrer les encaissements | Chaque relance d'impayé et chaque échéancier | La répartition de la charge entre les personnes |
| Agréger avancement, charge et rentabilité par dossier ou par équipe | Chaque révision d'honoraires | Toute appréciation d'un collaborateur |

**Conditions d'arrêt**
1. Acte sans tarif écrit, ou déjà facturé.
2. Rejet de prélèvement sans motif lisible.
3. Demande d'un indicateur nominatif sur un collaborateur.

**Ce qui ne part jamais sans vous**
- La facture d'honoraires : émise par votre cabinet après validation, par le circuit qu'il a choisi.
- Le lot de prélèvement : remis à la banque par votre cabinet.
- La relance d'impayé : envoyée par le collaborateur ou par l'associé.
- L'échéancier : proposé au client par l'associé.

### Avec ou sans Honoré

| Sans Honoré | Avec Honoré |
|---|---|
| Des actes hors forfait oubliés, ou facturés deux fois | Chaque acte facturé une fois, la facture validée par le collaborateur |
| Des rejets de prélèvement découverts trop tard | Chaque rejet rattaché à son dossier, l'échéancier proposé que l'associé accepte |
| Des relances écrites quand quelqu'un y pense | Une relance au stade prévu, que l'associé envoie |
| Un plan de charge refait de mémoire avant la haute saison | Une répartition proposée par équipe, que l'associé arbitre |

### Avant de confier une tâche à Honoré

- **Honoré mesure-t-il le travail de chaque collaborateur ?** Les indicateurs se lisent par dossier, par équipe et par étape, jamais par personne. Une demande d'indicateur nominatif arrête la règle.
- **Nos factures d'honoraires passent-elles par Honoré ?** Honoré prépare chaque facture ; votre cabinet l'émet, par la plateforme agréée qu'il a choisie dès que l'émission électronique s'applique à lui. Les PME et les micro-entreprises émettront au format électronique à partir du 1er septembre 2027.
- **Faut-il changer de logiciel de gestion interne ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Votre outil garde les temps et la facture ; nous rapprochons les actes, préparons les lots et suivons ce qui reste dû.
- **Que devient un rejet sans motif ?** La règle s'arrête pour ce dossier et le présente au collaborateur, relevé bancaire en lien. Aucune relance n'est préparée tant que le motif n'est pas connu.
- **Qui décide de suspendre une mission ?** L'associé, toujours. Honoré signale le dossier, son historique de relances et ce qui reste dû.

### Par quelle tâche commencer ?

**Tâches de départ** : `honoraires-facturation` · `relances-impayes` · `planification-charge`

**Logiciels concernés** : ACD GI, MEG (RCA), Microsoft Excel, Qonto, Pennylane, Cegid Loop, Outlook, Gmail.

---

## 10. Raphaël · RH du cabinet

**Destination** `/agents-ia/rh-cabinet` · **Requête** ia rh (390 par mois, fusionnée avec « ia ressources humaines » ; public d'entreprise, intention de même fonction) · **Voisins** Salomé (la paie) ; Octavie (les accès) ; Honoré (le plan de charge)

**Mission (carte)** : Prépare les documents RH de votre équipe, de l'annonce à la synthèse de rémunération ; les décisions sur les personnes restent à vous.

**H1** : IA RH pour cabinet comptable : recrutement, arrivées, formation et synthèse de rémunération préparés, les décisions sur les personnes restent à vous.

**Chapeau** : Raphaël est un agent IA : la règle écrite des tâches RH internes de votre cabinet, mise en œuvre dans vos outils. Il rassemble, rédige et agrège, puis s'arrête dès qu'on lui demande d'apprécier une personne ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Préparer un recrutement | Fiche de poste et annonce rédigées depuis votre besoin, diffusion préparée sur les canaux que vous choisissez. | `rh-interne-cabinet` |
| Organiser les candidatures | Accusés de réception préparés, entretiens planifiés, dossier de chaque candidat assemblé tel qu'il est arrivé, sans tri ni note. | `rh-interne-cabinet` |
| Préparer l'arrivée d'un collaborateur | Contrat tiré de votre modèle, DPAE à déposer, affiliation à la mutuelle, parcours de la première semaine, demande d'accès transmise à Octavie. | `rh-interne-cabinet` |
| Préparer un départ | Documents de fin de contrat, restitution du matériel, révocation des accès demandée. | `rh-interne-cabinet` |
| Préparer les entretiens annuels et professionnels | Convocations aux échéances, trames qui reprennent les faits (poste, formations suivies, souhaits exprimés l'an passé) ; aucune appréciation pré-rédigée. | `rh-interne-cabinet` |
| Rassembler les demandes de congés | Demandes reçues, soldes lus dans la paie, réponse préparée pour le responsable ; capacité de l'équipe par semaine en agrégats. | `rh-interne-cabinet` |
| Suivre la formation continue | Heures suivies, inscriptions et attestations classées pour chaque professionnel soumis à l'obligation de formation. | `formation-ia-competences` |
| Tenir la preuve de formation à l'IA | Les outils d'IA du cabinet, leurs limites écrites et les formations suivies par l'équipe, pièces à l'appui. | `formation-ia-competences` |
| Produire la synthèse annuelle de rémunération | Pour chaque salarié, les éléments de rémunération de l'année repris de la paie tenue, mis en forme, prêts à remettre. | `synthese-remuneration` |
| Préparer les indicateurs sociaux en agrégats | Effectifs, mise à jour du registre unique du personnel, index de l'égalité professionnelle pour les cabinets qui y sont tenus. | neuve : `indicateurs-sociaux-cabinet` |

### Ce que Raphaël vous remet

1. *Exemple fictif* · **La synthèse annuelle de rémunération** d'une collaboratrice inventée, ligne à ligne depuis la paie tenue, prête à remettre. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **Le dossier d'arrivée** d'un collaborateur inventé : contrat tiré de votre modèle, accès à créer logiciel par logiciel, parcours de la première semaine. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le suivi de formation de l'équipe**, heures et attestations classées.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : le cabinet Alouette, cabinet inventé, synthèse de rémunération 2025 d'une collaboratrice inventée.

**La règle écrite (synthèse de rémunération).** La synthèse reprend, pour l'année, chaque élément de rémunération que la paie tenue enregistre, avec sa rubrique et son mois d'origine, sans rien recalculer ; une rubrique nouvelle reçoit un libellé proposé, à valider. Une rubrique présente dans deux sources aux montants différents, une donnée sensible non prévue par la règle ou une demande d'appréciation de la personne arrête la synthèse.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Salaire de base de l'année et prime annuelle versée en décembre | Lignes reprises avec leur rubrique et leur mois | Préparé |
| Rubrique créée cette année pour le forfait mobilités durables | Ligne reprise, libellé proposé pour la synthèse | À valider |
| Avantage en nature véhicule présent dans la paie et dans un tableau annexe, montants différents | Synthèse suspendue. Motif : double source ; les deux montants présentés côte à côte | Arrêt |
| Demande d'ajouter un commentaire sur la performance de l'année | Aucun commentaire rédigé. Motif : appréciation d'une personne, hors de la règle | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Rassembler depuis la paie tenue et vos modèles | Chaque document remis à un salarié ou à un candidat | Le choix d'un candidat |
| Rédiger annonces, convocations et dossiers d'arrivée ou de départ | Chaque annonce avant diffusion | Toute appréciation sur une personne |
| Classer attestations et pièces | Chaque réponse à une demande de congé | L'entretien et ce qui s'y décide |
| Agréger les indicateurs sociaux | Chaque indicateur publié | La rémunération et les décisions d'emploi |

**Conditions d'arrêt**
1. Ligne de paie ambiguë, ou présente dans deux sources.
2. Donnée sensible non prévue par la règle (santé, situation familiale).
3. Demande de noter, de classer ou d'évaluer une personne.

**Ce qui ne part jamais sans vous**
- L'annonce : diffusée par votre cabinet.
- La réponse à un candidat : envoyée par la personne qui recrute.
- Le contrat et les documents de fin de contrat : signés par l'employeur.
- La DPAE : déposée par votre cabinet.
- La synthèse de rémunération : remise au salarié par son responsable.

### Avec ou sans Raphaël

| Sans Raphaël | Avec Raphaël |
|---|---|
| Des candidatures sans réponse pendant la haute saison | Un accusé de réception prêt pour chaque candidat, que le recruteur envoie |
| Une arrivée préparée la veille, accès compris | Un dossier d'arrivée complet, que le responsable valide |
| Des attestations de formation éparpillées dans les boîtes | Chaque attestation classée, que le responsable consulte |
| Une synthèse de rémunération reconstruite à la main | Une synthèse reprise de la paie tenue, que le responsable relit et remet |

### Avant de confier une tâche à Raphaël

- **Raphaël évalue-t-il vos collaborateurs ou vos candidats ?** Jamais : il prépare des documents et des agrégats. Toute demande de note, de classement ou d'appréciation arrête la règle.
- **Faut-il changer de logiciel de paie ou de SIRH ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. La paie reste tenue dans votre logiciel ; Raphaël en lit ce que la tâche demande.
- **Que devient une ligne de paie ambiguë ?** La synthèse s'arrête et présente les deux sources côte à côte au responsable. Rien n'est recalculé ni choisi à sa place.
- **Qui voit les données de l'équipe ?** Les données sont lues en place, avec les seuls accès ouverts pour la tâche. Les vues de pilotage restent en agrégats.
- **Raphaël tient-il le registre du personnel ?** Il en prépare la mise à jour à chaque arrivée et à chaque départ. Le registre reste tenu par votre cabinet, en sa qualité d'employeur.

### Par quelle tâche commencer ?

**Tâches de départ** : `synthese-remuneration` · `rh-interne-cabinet` · `formation-ia-competences`

**Logiciels concernés** : Silae, Microsoft Excel, Outlook, Gmail, SharePoint, Youtrust (anciennement Yousign), Docusign.

---

## 11. Octavie · Informatique et outils

**Destination** `/integrations` (bandeau « Qui prend ce métier » sur la page de compatibilité) · **Requête de la page** intégration logiciels cabinet comptable (aucun volume Google Ads ; Google la lit comme « choisir ses logiciels ») · **Voisins** tous les agents, dont les imports passent par elle ; Raphaël (arrivées et départs) ; Prudence (l'inventaire des outils)

**Mission (carte)** : Relie vos logiciels, contrôle chaque import et prépare accès, sauvegardes et migrations ; votre administrateur applique.

**H1 (proposé à la page `/integrations`, à arrêter par sa spécification)** : Intégration des logiciels de votre cabinet : imports, accès et migrations préparés dans les outils que vous avez déjà choisis.

**Chapeau** : Octavie est un agent IA : la règle écrite des tâches informatiques et d'outillage de votre cabinet, mise en œuvre dans vos outils. Elle convertit, contrôle et prépare, puis s'arrête dès qu'un format change ou qu'un droit d'administration est en jeu ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Relier deux logiciels | L'export d'un outil mis au format d'import de l'autre, par fichier ou par API, sans ressaisie ni double écriture. | `integration-connecteurs` |
| Contrôler chaque import | Schéma, période et doublons vérifiés avant l'import ; un fichier rejoué ne crée aucune ligne en double. | `exports-imports-logiciels` |
| Tenir les classeurs de suivi | Dictionnaire, états et contrôles d'un classeur partagé entretenus ; formules et saisies jamais réécrites, chaque écriture tracée. | `excel-classeurs-suivi` |
| Préparer les accès d'une arrivée ou d'un départ | Comptes et droits à créer ou à révoquer, logiciel par logiciel, transmis à votre administrateur. | neuve : `comptes-acces` |
| Revoir les droits d'accès | Comptes et droits par logiciel et par dossier, comptes orphelins signalés ; jamais l'activité de chacun. | neuve : `comptes-acces` |
| Contrôler les sauvegardes | Rapports de sauvegarde lus chaque jour ; un échec ou un rapport absent signalé le matin même. | neuve : `sauvegardes-mises-a-jour` |
| Préparer les mises à jour des logiciels métier | Notes de version lues, effets sur vos imports et vos classeurs listés, créneau proposé. | neuve : `sauvegardes-mises-a-jour` |
| Qualifier les demandes de support | Demande d'un collaborateur rattachée à la procédure interne ; réponse préparée, ou demande rédigée pour votre prestataire. | neuve : `support-outils` |
| Préparer une migration ou un paramétrage en masse | Plans, tiers et historiques repris, balances avant et après rapprochées ; nouveau plan de comptes appliqué à chaque dossier, contrôle à l'appui. | neuve : `migrations-reprises` |
| Tenir l'inventaire des outils et des usages d'IA | Logiciels, licences et outils d'IA du cabinet, avec les données qu'ils traitent ; Prudence le reprend pour le registre. | neuve : `inventaire-outils` |

Titulaire dans les données, jamais affichée (son libellé « Compléments greffés sur Excel » ne sort sur aucune page, charte §9) : `complements-excel`. La famille de l'IA générative en général reste au hub (ADR 0001).

### Ce qu'Octavie vous remet

1. *Exemple fictif* · **Le fichier d'import du journal de caisse** de l'Épicerie Bergeronnette : export de septembre mis au format de votre logiciel comptable, contrôles joués, deux lignes écartées avec leur motif. Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La liste des accès à créer** pour une arrivée inventée : logiciel par logiciel, droits demandés. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **Le contrôle quotidien des sauvegardes**, un échec signalé le matin même.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : l'Épicerie Bergeronnette, SARL inventée, export de caisse de septembre 2026 vers le logiciel comptable du cabinet.

**La règle écrite (import contrôlé).** Un export entre dans le fichier d'import quand ses colonnes correspondent au schéma écrit, que sa période est celle demandée et qu'aucune de ses lignes n'a déjà été importée. Un schéma modifié par l'éditeur, une période différente ou un compte absent du plan du dossier arrête la ligne ou le fichier, et le présente au collaborateur.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Export de septembre au schéma attendu | Fichier d'import préparé ; totaux par jour égaux à ceux de l'export | Préparé |
| Le même export déposé une seconde fois | Aucune ligne nouvelle ; dépôt signalé comme déjà importé | Préparé |
| Moyen de paiement nouveau (titres-restaurant dématérialisés), absent du plan de comptes du dossier | Lignes isolées, compte à créer proposé | À valider |
| Colonne « TVA » renommée après une mise à jour du logiciel de caisse | Aucun fichier préparé. Motif : schéma modifié par l'éditeur | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Lire exports, rapports et notes de version | Chaque import avant intégration | Le choix des logiciels |
| Préparer fichiers d'import, listes d'accès et réponses de support | Chaque création ou révocation d'accès | Les droits d'administration et la sécurité |
| Comparer avant et après une migration | Chaque mise à jour proposée | Le paramétrage final dans chaque logiciel |
| Tenir l'inventaire des outils | Chaque migration avant bascule | La décision de bascule |

**Conditions d'arrêt**
1. Schéma modifié, ou format inconnu.
2. Période ou dossier différent de celui demandé.
3. Geste qui exige un droit d'administration sans validation écrite.

**Ce qui ne part jamais sans vous**
- L'import dans un logiciel : lancé par le collaborateur.
- La création ou la révocation d'un compte : appliquée par votre administrateur.
- La demande à votre prestataire informatique : envoyée par votre référent.
- La bascule d'une migration : décidée par l'associé.

### Avec ou sans Octavie

| Sans Octavie | Avec Octavie |
|---|---|
| Ressaisir d'un logiciel à l'autre ce que l'export contient déjà | Un fichier d'import contrôlé, que le collaborateur importe |
| Découvrir qu'une sauvegarde échoue depuis des semaines | Un échec signalé le matin même, que votre prestataire traite |
| Des comptes d'anciens collaborateurs encore ouverts | Les comptes à révoquer listés, que l'administrateur ferme |
| Une mise à jour qui casse un import sans prévenir | Les effets listés avant la mise à jour, que le référent planifie |

### Avant de confier une tâche à Octavie

- **Faut-il changer de logiciel ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Octavie travaille entre vos outils, là où un export attend d'être importé ailleurs.
- **Octavie modifie-t-elle vos réglages de sécurité ?** Elle prépare la liste des comptes, des droits et des réglages à changer. Votre administrateur les applique, après validation.
- **Vos formules Excel sont-elles réécrites ?** Le classeur reçoit ce que la règle prévoit, dans les zones qu'elle possède. Vos formules et vos saisies ne sont jamais réécrites, et chaque écriture est tracée.
- **Et si un éditeur change son format ?** L'import s'arrête et le fichier est présenté avec la colonne en cause. La règle est mise à jour, puis rejouée sur le jeu fictif avant de reprendre.
- **Votre outil n'est pas cité ?** Les accès et les formats se vérifient avant tout devis. Décrivez la tâche : nous regardons ce que l'outil exporte et ce qu'il accepte.

### Par quelle tâche commencer ?

**Tâches de départ** : `exports-imports-logiciels` · `integration-connecteurs` · `excel-classeurs-suivi`

**Logiciels concernés** : Microsoft Excel, SharePoint, OneDrive, Google Drive, Outlook, Gmail, Cegid Loop, Sage 100 Comptabilité, ACD COMPTA, Pennylane, EBP Comptabilité, Silae, Planity, PrestaShop.

---

## 12. Prudence · Protection des données

**Destination** `/agents-ia/protection-donnees` · **Requête** rgpd expert comptable (10 par mois ; « ia rgpd », 140, déjà servie par l'article `/blog/rgpd-et-ia-au-cabinet-…`, lien obligatoire) · **Voisins** Octavie (l'inventaire des outils) ; Raphaël (les données de l'équipe) ; Victoire (les mentions de la lettre de mission)

**Mission (carte)** : Prépare la mise à jour du registre et les réponses aux demandes d'accès des personnes concernées ; votre référent décide.

**H1** : RGPD de l'expert-comptable : la mise à jour du registre, les demandes d'accès et les sous-traitants préparés pour votre référent.

**Chapeau** : Prudence est un agent IA : la règle écrite des tâches de protection des données de votre cabinet, mise en œuvre dans vos outils. Elle inventorie, retrouve et rédige, puis s'arrête dès qu'une identité ou un tiers est en doute ; ce qui part, c'est vous qui le décidez.

### Tâches prises en charge

| Geste | Ce qui est préparé | Famille |
|---|---|---|
| Préparer la mise à jour du registre | Tâche par tâche, depuis vos outils : finalité, données, destinataires et durée de chaque traitement ; lignes changées signalées au référent. | neuve : `registre-traitements` |
| Préparer la réponse à une demande d'accès | Données de la personne concernée retrouvées dans les outils listés au registre, réponse rédigée traitement par traitement, délai suivi. | neuve : `demandes-droits` |
| Préparer les autres demandes de droits | Rectification, effacement, opposition : données en cause listées, obligations de conservation qui s'y opposent signalées. | neuve : `demandes-droits` |
| Revoir les contrats de sous-traitance | Clauses que le RGPD exige d'un contrat de sous-traitance repérées dans chaque contrat, manques listés. | `rgpd-secret-securite` |
| Suivre les durées de conservation | Données arrivées au terme de leur durée listées par dossier, suppression ou archivage proposés. | neuve : `durees-conservation` |
| Préparer le dossier d'un incident | Faits, données et personnes concernées rassemblés ; projet de notification préparé pour la décision du responsable de traitement. | neuve : `incidents-donnees` |
| Préparer l'analyse d'impact | Trame remplie depuis le registre et la description du traitement, risques à apprécier listés. | `rgpd-secret-securite` |
| Préparer les mentions d'information | Clause de la lettre de mission, politique de confidentialité, mentions des formulaires, relues à chaque tâche nouvelle. | `rgpd-secret-securite` |
| Préparer une copie pseudonymisée | Noms et identifiants remplacés avant un essai ou un partage hors du cabinet ; la table de correspondance reste chez vous. | `rgpd-secret-securite` |
| Suivre les obligations liées à l'IA | Outils d'IA du cabinet, données traitées, information des personnes et obligations du règlement européen sur l'IA pour un utilisateur, datées et sourcées. | `ai-act-conformite` |

### Ce que Prudence vous remet

1. *Exemple fictif* · **La mise à jour du registre** après une tâche nouvelle : la ligne « collecte des variables de paie » complétée (finalité, données, destinataires, durée). Pastille « En attente de votre validation ».
2. *Exemple fictif* · **La réponse à la demande d'accès** d'une salariée inventée d'un client inventé : données retrouvées dans la paie et la messagerie, réponse rédigée, date limite posée. Pastille « En attente de votre validation ».
3. *Dès que vos accès sont branchés* · **La revue des contrats de vos sous-traitants**, clause par clause.

### Démonstration · rejouée sur un dossier fictif

Dossier fictif : le cabinet Alouette, cabinet inventé, demandes reçues en octobre 2026.

**La règle écrite (demande d'accès).** Une demande d'accès d'une personne concernée, dont l'identité est vérifiée selon la règle du cabinet, déclenche la recherche de ses données dans les outils listés au registre, puis une réponse rédigée qui les présente traitement par traitement. Une identité non vérifiée ou une demande venant d'une personne morale arrête la recherche ; un passage qui concerne aussi un tiers est isolé pour la décision du référent.

| Cas joué | Sortie obtenue | Décision |
|---|---|---|
| Salariée d'un client, identité vérifiée ; données dans la paie et la messagerie | Données retrouvées par traitement, réponse rédigée, date limite posée au calendrier | Préparé |
| Courriel de la même salariée qui cite aussi un collègue | Passages qui concernent le tiers isolés, à trancher par le référent | À valider |
| Client particulier écrivant d'une adresse inconnue du dossier | Aucune recherche lancée. Motif : identité non vérifiée ; demande de justificatif préparée | Arrêt |
| Société cliente qui demande « toutes ses données personnelles » | Aucune recherche lancée. Motif : le droit d'accès appartient aux personnes physiques ; note au référent | Arrêt |

### La règle écrite du métier

| Se prépare seul | Attend votre validation | Reste humain |
|---|---|---|
| Inventorier traitements, outils et sous-traitants | Chaque ligne du registre | La décision du responsable de traitement et de la personne qu'il a désignée |
| Retrouver les données d'une personne concernée | Chaque réponse à une personne concernée | L'appréciation d'un risque ou d'un incident |
| Rédiger registre, réponses, trames et mentions | Chaque proposition de suppression | Toute notification |
| Suivre délais et durées de conservation | Chaque mention d'information | La désignation d'un délégué à la protection des données |

**Conditions d'arrêt**
1. Identité du demandeur non vérifiée.
2. Demande venant d'une personne morale, ou donnée qui concerne aussi un tiers.
3. Traitement absent du registre, ou sous-traitant sans contrat.

**Ce qui ne part jamais sans vous**
- La réponse à une personne concernée : envoyée par votre référent.
- La notification d'un incident : décidée et faite par le responsable de traitement.
- La suppression de données : faite par votre cabinet, après décision.
- La mise à jour du registre : validée par votre référent.

### Avec ou sans Prudence

| Sans Prudence | Avec Prudence |
|---|---|
| Un registre écrit une fois, jamais relu | Un registre mis à jour à chaque tâche nouvelle, que le référent valide |
| Une demande d'accès qui arrive sans que personne sache où chercher | Les données retrouvées outil par outil, que le référent relit |
| Des contrats de sous-traitance jamais relus | Les clauses manquantes listées, que l'associé fait corriger |
| Des données gardées faute de savoir quand les supprimer | Les durées échues listées, dont le cabinet décide la suppression |

### Avant de confier une tâche à Prudence

- **Prudence remplace-t-elle votre délégué à la protection des données ?** Notre agent IA n'est pas votre délégué à la protection des données : il prépare, la personne que vous avez désignée décide. Le registre reste celui que tient votre cabinet.
- **Votre cabinet doit-il désigner un délégué ?** Désigner un DPO dépend de vos traitements : votre cabinet en juge ; la CNIL le recommande même lorsqu'il n'est pas obligatoire. Prudence rassemble les éléments qui éclairent ce choix.
- **Qui peut demander l'accès à ses données ?** Les personnes physiques concernées : clients particuliers, salariés de vos clients, collaborateurs. Une société cliente n'exerce pas ce droit pour elle-même.
- **Quel est le délai de réponse ?** Le délai légal court dès la réception : un mois, prolongeable de deux mois dans les cas prévus, en informant la personne. Prudence pose la date au calendrier dès que la demande arrive.
- **Comment vos données sont-elles traitées pendant la tâche ?** Fichiers lus en place, accès limités à la tâche, jeu d'essai fictif avant tout vrai dossier. Le détail est sur la page Garanties.
- **Faut-il changer d'outil pour le registre ?** Ce que votre logiciel fait déjà, nous ne le refaisons pas : nous prenons ce qu'il laisse. Le registre peut rester dans le modèle de la CNIL ou dans votre tableur ; nous en préparons la mise à jour.

### Par quelle tâche commencer ?

**Tâches de départ** : neuve `registre-traitements` · neuve `demandes-droits` · `rgpd-secret-securite`

**Logiciels concernés** : modèle de registre de la CNIL (tableur), Microsoft Excel, SharePoint, OneDrive, Outlook, Gmail, Silae.

---

> **Notes internes (§13 à §15) : hors copy.** Elles servent la revue et la phase 3 ; aucune ligne
> ci-dessous ne va sur une page.

## 13. Contenu réglementé : ce qui est repris mot pour mot, ce qui a été écarté

### 13.1 Phrases reprises de `FACT-CHECK.md` sans changer un mot

| Agent · emplacement | Phrase | Source FC |
|---|---|---|
| Salomé · questions | La DSN part de votre compte déclarant, déposée par votre cabinet ; nous contrôlons avant, nous ne déposons jamais. | §3 |
| Salomé · questions | Après chaque dépôt, les organismes renvoient leurs comptes rendus métier ; nous les trions et vous présentons chaque écart à corriger. | §3 |
| Grégoire · questions | Les comptes se déposent en ligne sur le guichet unique, ou sur papier au greffe ; nous préparons la liasse de pièces, sans rien déposer à votre place. | §5 |
| Grégoire · questions | Le dépôt suit dans le mois de l'approbation, ou dans les deux mois par voie électronique. | §6 |
| Grégoire · questions | En SARL et en SA, les comptes sont approuvés dans les six mois de la clôture, sauf prolongation accordée par le juge. | §6 |
| Grégoire · questions | Les formalités de création, de modification et de cessation passent par le guichet unique ; nous préparons le dossier, votre cabinet le signe et le dépose. | §5 |
| Aude · questions | Nous préparons la liste des tiers selon votre règle et le tableau des écarts ; l'envoi, la réception des réponses et l'appréciation restent au commissaire aux comptes. | §7 (NEP 505 § 09) |
| Aude · questions | La NEP 315 vous demande d'apprécier tout outil automatisé : nous vous remettons sa règle et ses essais pour le faire. | §7 |
| Aude · questions | Chaque préparation laisse une trace que votre dossier de travail peut reprendre : source, règle appliquée, éléments retenus. | §7 (NEP 230) |
| Victoire · questions | À l'entrée en relation, nous réunissons les pièces que votre règle de vigilance demande ; l'appréciation et l'acceptation du client restent à votre cabinet. | §4 |
| Victoire · questions | La déclaration de soupçon appartient au professionnel assujetti ; elle reste hors de tout ce que nous préparons. | §4 |
| Colette · démonstration | Depuis le 1er septembre 2026, toute entreprise doit pouvoir recevoir ses factures au format électronique. | §2 |
| Honoré · questions | Les PME et les micro-entreprises émettront au format électronique à partir du 1er septembre 2027. | §2 |
| Prudence · questions | Notre agent IA n'est pas votre délégué à la protection des données : il prépare, la personne que vous avez désignée décide. | §1 |
| Prudence · questions | Désigner un DPO dépend de vos traitements : votre cabinet en juge ; la CNIL le recommande même lorsqu'il n'est pas obligatoire. | §1 |
| Prudence · questions | Le délai légal court dès la réception : un mois, prolongeable de deux mois dans les cas prévus, en informant la personne. | §1 |

Reprises de la charte (§6, §9) : « Aucun résultat d'outil ne certifie les comptes » et la réponse sur l'indépendance (Aude) ; « Une sortie de calcul n'est pas à elle seule un élément suffisant et approprié » (Aude). Une seule phrase réglementée est dérivée et non citée : « Son échéance suit l'effectif et la date de paie du dossier : le 5 ou le 15 du mois suivant » (Salomé), tirée de FC §3 et de la liste à éviter n° 10 (« échéance au 5 pour tous ») : à faire relire.

### 13.2 Formulations écartées pour une raison réglementaire

| Agent · tâche | Formulation écartée | Formulation retenue | Raison |
|---|---|---|---|
| Salomé · DSN | l'agent dépose la DSN ; dépôt sans intervention ; retours corrigés seuls | contrôles avant dépôt, DSN déposée par votre gestionnaire ; retours triés, correction et nouveau dépôt par le gestionnaire | FC §3, à éviter n° 10 ; CSS L.133-5-3 (l'obligation pèse sur l'employeur ou son tiers déclarant) |
| Salomé · calendrier | une échéance unique pour tous les dossiers | le 5 ou le 15 du mois suivant selon l'effectif et la date de paie | FC §3 |
| Grégoire · approbation | l'agent approuve les comptes | il en prépare les documents ; l'approbation est une décision des associés | FC à éviter n° 14 |
| Grégoire · dépôt et formalités | nous déposons vos comptes et vos formalités | nous préparons la liasse de pièces et le dossier ; votre cabinet signe et dépose | FC §5, à éviter n° 13 |
| Grégoire · délai d'approbation | un délai de six mois pour toute forme sociale, sans réserve | SARL et SA seulement, avec la prolongation judiciaire ; une autre forme attend que son délai soit écrit dans la règle du dossier ; la démonstration ne joue aucune SAS (son Arrêt porte sur une clôture divergente) | FC §6 : délai SAS non vérifié ; aucun numéro d'article L.232-2x cité |
| Aude · confirmations | demandes de confirmation envoyées par nos soins | sélection et tableau des écarts préparés ; rédaction, envoi et réception sous la maîtrise du commissaire aux comptes | NEP 505 § 09, FC à éviter n° 15 |
| Aude · FEC | contrôle du FEC qui conclut | constat de forme à réception, sans conclusion sur les comptes ; colonne de conclusion vide en revue analytique | charte §9 (interdits CAC), NEP 230 |
| Aude · libellé | l'agent présenté sous le sigle du titre de commissaire aux comptes | « agent IA missions d'audit » | L.821-7, charte §9 bis |
| Victoire · vigilance | contrôle d'identité automatisé, repérage du blanchiment | pièces réunies selon la règle de vigilance ; appréciation, acceptation et toute déclaration au cabinet | FC §4, à éviter n° 11 ; L.561-18 (confidentialité de la déclaration) |
| Victoire · prospection | démarchage mené par l'agent | liste tirée de Sirene, avec sa source, et premier message préparés ; le choix de qui contacter et chaque envoi à l'associé | **à vérifier avant publication** : règles de communication et de sollicitation de la profession d'expert-comptable, et cadre de la prospection entre professionnels ; aucun des deux n'est dans le fact-check du 14/10 |
| Honoré · factures du cabinet | nous émettons ou transmettons vos factures | Honoré prépare ; votre cabinet émet par la plateforme agréée qu'il a choisie ; aucun nom de plateforme | FC §2, à éviter n° 6 et 7 ; OUTILS K3 (liste officielle en maintenance) |
| Balthazar · factures électroniques | factures reçues ou transmises par nous | factures arrivées par la plateforme agréée du client et restées hors de l'outil, rapprochées | FC §2, à éviter n° 7 |
| Prudence · registre | l'agent tient le registre | il prépare la mise à jour du registre que tient votre cabinet | RGPD art. 30, FC à éviter n° 2 |
| Prudence · droits | les demandes d'accès de vos clients | les personnes concernées : clients particuliers, salariés de vos clients, collaborateurs ; la société cliente déclenche un Arrêt | RGPD art. 15, FC à éviter n° 3 |
| Prudence · délégué | l'agent présenté comme délégué à la protection des données | la personne désignée décide | RGPD art. 37, FC à éviter n° 1 et 4 |
| Prudence · incident | un délai de notification chiffré | « projet de notification préparé pour la décision du responsable de traitement », sans délai | le délai de notification n'est pas dans le fact-check du 14/10 |
| Prudence · sous-traitance, IA | numéros d'articles du RGPD et du règlement sur l'IA | « clauses que le RGPD exige », « obligations du règlement européen sur l'IA pour un utilisateur, datées et sourcées » | articles non lus le 14/10 |
| Raphaël · candidatures | tri et classement des candidats | dossier de chaque candidat assemblé tel qu'il est arrivé, sans tri ni note | charte §9 bis (anti-surveillance) |
| Raphaël · obligations | seuil de l'index de l'égalité, volume d'heures de formation continue | « pour les cabinets qui y sont tenus », « pour chaque professionnel soumis à l'obligation » | seuils et volumes non vérifiés |
| Émile · réponses | réponses de premier niveau envoyées seules | réponses et accusés de réception préparés, envoyés par le collaborateur ; toute demande de conseil arrête la règle | charte §9 bis (rien ne part sans validation) |
| Octavie · outils | tout outil branché sur simple demande | accès et formats vérifiés avant tout devis | charte §2 (aucune compatibilité universelle) |

## 14. Récapitulatif et vérification

| Agent | Tâches | Familles existantes portées | Familles neuves proposées (pôle suggéré) |
|---|---|---|---|
| Balthazar · Comptabilité | 10 (+ 2 familles « aussi ») | 12 | aucune |
| Salomé · Paie et social | 10 | 7 | `ecritures-de-paie`, `diffusion-documents-paie` (paie-social) |
| Grégoire · Juridique et fiscal | 10 | 8 | `liasse-fiscale` (juridique-fiscal) |
| Florent · Finance | 10 | 5 | `remuneration-dirigeant` (conseil-missions) |
| Aude · Missions d'audit | 10 (+ 4 familles « aussi ») | 13 (dont `audit-legal`, données seules) | aucune |
| Victoire · Commercial | 10 | 2 | `suivi-prospects`, `propositions-mission` (developpement-cabinet) |
| Colette · Communication | 9 | 0 | `actualite-a-diffuser`, `lettre-information-clients`, `publications-cabinet` (developpement-cabinet) |
| Émile · Relation client | 10 | 4 | `suivi-demandes-clients`, `satisfaction-clients` (administratif-secretariat) |
| Honoré · Gestion du cabinet | 10 | 7 | aucune |
| Raphaël · RH du cabinet | 10 | 3 | `indicateurs-sociaux-cabinet` (rh-formation) |
| Octavie · Informatique et outils | 10 | 4 (dont `complements-excel`, données seules) | `comptes-acces`, `sauvegardes-mises-a-jour`, `support-outils`, `inventaire-outils` (numerique-it-data) ; `migrations-reprises` (excel-outils-existants) |
| Prudence · Protection des données | 10 | 2 | `registre-traitements`, `demandes-droits`, `durees-conservation`, `incidents-donnees` (numerique-it-data) |
| **Total** | **119** | **67 sur 85** | **21** (dont 6 déjà dans la spec : `propositions-mission`, les trois de Colette, `registre-traitements`, `demandes-droits`) |

**Partition** (rejouée à l'intégration, `scratchpad/verif/partition-contenu.mjs` contre `familles.ts`) :
85 familles ; 67 portées par un agent, 1 par le hub (`ia-generative-agents`), 4 par le bloc « Derrière
chaque agent, nous » (`choisir-cadrer`, `regle-jeu-essai-recette`, `validation-humaine-refus`,
`mesure-roi`) ; **aucun doublon** ; 13 familles CAC inactives sans titulaire, comptées et imprimées par
l'invariant I1 (interventions légales, SACC hors attestations, durabilité, relance des honoraires,
déclarations de la profession). Le premier passage portait `ia-generative-agents` chez Octavie (doublon
avec le hub) et laissait `complements-excel` et `audit-legal` sans titulaire : corrigé.

**Démonstrations.** Douze, chacune à quatre cas, toutes avec au moins un Arrêt motivé et au moins un
Préparé et un À valider (contrôle scripté sur la colonne Décision).

**Vérification par séquences de 6 mots** (`scratchpad/verif/ngrams6.py`, minuscules, apostrophes
unifiées, ponctuation retirée, notes internes comprises) :
- contre `releve/textes/` (agpt-experts, agpt-maria, agpt-max, f456-connecteur-pennylane,
  f456-marketplace, f456-runbot) : **0 séquence commune** ;
- contrôle élargi aux 25 pages brutes de Factory 456 (`recherche/raw/factory456/2026-10-14/scrapes/*.md`)
  et au catalogue du diagnostic (`diagnostic-script.js`) : 8 séquences trouvées au premier passage,
  6 réécrites ; restent 2, toutes deux dans la phrase réglementée exacte de FC §6 (« dans les six mois
  de la clôture »), qui reprend la lettre du code de commerce (L.225-100) : gardée à dessein ;
- témoin : deux phrases relevées (une de Factory 456, une d'agpt) ajoutées à une copie du livrable font
  rougir l'instrument (18 séquences) ; l'instrument mesure donc ce qu'il prétend.

## 15. Écarts relevés en chemin (signalés, non corrigés)

- **`familles.ts`, descriptions qui contredisent le fact-check si une fiche les affiche** (spec §2,
  section 6, liste les familles titulaires) : `dsn-crm` « Préparer, contrôler et déposer la DSN »
  (FC à éviter n° 10) ; `facture-electronique` « Recevoir, transmettre et archiver » (FC à éviter n° 7) ;
  `lettre-de-mission-lcbft` « tenir la vigilance LCB-FT » (FC §4 : la vigilance reste au cabinet).
  Correction à porter dans la PR isolée des données (ticket 02), qui touche le calendrier du blog.
- **Gabarit** : « Ce que <prénom> vous remet » doit élider devant voyelle et h muet : Ce qu'Aude,
  Ce qu'Émile, Ce qu'Honoré, Ce qu'Octavie (déjà écrit ainsi ci-dessus).
- **Salomé, Aude, Octavie** mènent à des pages existantes (spec §0) : leur démonstration n'a aujourd'hui
  aucune page où se rendre (aucun bloc sur l'accueil CAC, D5 ; bandeau seul sur `/automatisation/paie`
  et `/integrations`). Si « chaque fiche montre sa démonstration » vaut pour les douze, il faut décider
  où ces trois-là s'affichent.
- **Dates des démonstrations** jouées au 14-15/10/2026 (Grégoire : dépôt manquant constaté au
  14/10/2026 ; Florent : projection jusqu'au 31/12/2026) : à redater si la mise en ligne glisse.
- **Longueur** : environ 90 lignes par agent au lieu de 60, l'écart tenant aux trois tableaux de dix
  et quatre lignes que demande le gabarit.

### Arbitrages pris à l'intégration (15/10/2026)

- **Démonstrations sans fiche** : Octavie montre la sienne sur `/integrations`, sous son bandeau (un
  import contrôlé illustre ce que fait un connecteur) ; Salomé garde sur `/automatisation/paie` le rejeu
  déjà publié, sa démonstration reste dans les données pour le jour où une fiche s'ouvre ; Aude n'ajoute
  rien à l'accueil CAC (D5), sa démonstration reste dans les données. Le test de forme (spec §2.1) porte
  sur les douze démonstrations des données, rendues ou non.
- **Descriptions de `familles.ts`** (`dsn-crm`, `facture-electronique`, `lettre-de-mission-lcbft`) :
  corrigées dans le ticket 02, avec le fact-check, avant qu'une fiche les affiche.
- **Prospection de Victoire** : la tâche « Repérer les entreprises à contacter » ne se publie qu'après
  lecture datée des règles de communication et de sollicitation de la profession et du cadre de la
  prospection entre professionnels, ajoutée au fact-check (revue `metier` du ticket 09). Sans cette
  lecture, la ligne sort de la fiche ; les neuf autres restent.
- **Phrase dérivée de Salomé** (« le 5 ou le 15 du mois suivant ») : relue par la même revue `metier`.
- **Logiciels concernés** : chaque nom cité dans les listes « Logiciels concernés » doit exister dans
  `CONNECTEURS.md` ; contrôle fait à l'intégration de la liste des connecteurs.
