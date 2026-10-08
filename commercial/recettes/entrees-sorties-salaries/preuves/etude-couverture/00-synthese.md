# Couverture des logiciels métier : ce que les supports ne montrent plus

Décision du 6 octobre 2026, prise après le premier rendez-vous avec un cabinet de commissariat aux comptes. Document interne, sans nom de client ni de prospect.

Les preuves sont dans les quatre notes de ce dossier, avec plus de 250 sources datées. Limite : le budget de recherche web s'est épuisé en cours d'étude. Les fonctions citées viennent donc surtout des pages et des aides des éditeurs, sans démonstration.

## 1. Le constat

- **Le cabinet CAC rencontré** travaille sur **Acropole Expert CAC** (Acropole Expert Informatique, Saintes). Le showroom montrait presque exactement ce que fait déjà Acropole :
  - l'import du FEC, avec des alertes ;
  - la collecte des pièces par AUDITdrive, relances comprises ;
  - les modèles de rapport ;
  - l'ossature du dossier ;
  - la déclaration d'activité pré-remplie ;
  - l'archivage.

  Réponse du cabinet : « je le fais déjà ».
- **La seule tâche qui l'intéressait n'est automatisée nulle part** : la sélection des tiers à circulariser.
  - Sa méthode : les plus gros soldes, les plus gros mouvements débiteurs et une part aléatoire, jusqu'à environ 70 % du solde ou N comptes. Il fait une passe au 30/09, puis une au 31/12. Le tout dans Excel.
  - Six suites (Acropole, Auditsoft, RevisAudit, DreamAudit, Caseware, PackAUDIT) et quatre plateformes (e-Circu, Auditsoft Anywhere, Circit, Confirmation) commencent après la sélection. Elles prennent une liste déjà choisie.
  - La H2A relève des sélections insuffisantes au regard de la NEP 530, et l'absence d'outil de sélection dans des cabinets locaux. Source : synthèse des contrôles 2025, publiée le 18/09/2026, p. 33, 57 et 60.
- **Côté expertise comptable, même schéma.** Tous les éditeurs couvrent déjà la saisie, la banque, le lettrage, la TVA, les immobilisations, la liasse, la plaquette, la GED et le portail client.

## 2. La règle, pour les supports, le site et les outils

1. Ne jamais présenter comme un gain un geste que l'outil métier du cabinet fait déjà.
2. Une tâche couverte en partie se montre par ce qui reste à faire. L'écran dit ce que l'outil fait déjà. Exemple : « Votre outil envoie et relance ; nous sélectionnons les tiers selon votre règle. »
3. L'outil du cabinet (nom, édition, options souscrites) se demande avant le showroom. Pendant le showroom, Kevin voit ce que cet outil fait déjà et la question à poser.
4. Ce qu'aucun outil ne fait passe en premier.
5. Ce que les éditeurs comblent dans l'année se montre comme une perspective, jamais en tête. C'est le cas de l'IA appliquée à la revue analytique, à l'annexe et au cut-off, et du suivi de la facture électronique.

## 3. CAC : les 13 automatisations actuelles

| Rang | Automatisation | Verdict | Ce que les outils font déjà | Décision |
|---:|---|---|---|---|
| 1 | fec-reception | Couvert | Acropole (FEC sans paramétrage, seuils d'alerte), RevisAudit, DreamAudit, Auditsoft, PackAUDIT ; SmartFEC+ et B.I.AUDIT (CNCC, gratuits), NotaQo, FEC Expert | Retirer |
| 2 | demandes-documents | Couvert dès qu'il y a un portail | AUDITdrive, relié à Acropole (listes prédéfinies, relances automatiques) ; e-Recup (relances, pièces rattachées par IA) ; Caseware Requête ; Auditsoft Anywhere | Retirer |
| 3 | revue-analytique | Partiel, l'écart se referme | Tableau N/N-1 partout (Acropole, Auditsoft, PackAUDIT, RevisAudit, B.I.AUDIT). Commentaires par IA chez Auditsoft (2026), agents Gest On Line en développement, Caseware Verity | Retirer |
| 4 | rapport-certification | Couvert | Modèles CNCC dans toutes les suites | Retirer |
| 5 | confirmations-audit | Partiel | Lettres, envoi, suivi et relances : e-Circu, Auditsoft Anywhere, Circit, Confirmation.com | Remplacer par la sélection (§ 4.1) et les écarts (§ 4.2) |
| 6 | revue-ecritures | Partiel | Tri des écritures (Benford, doublons, dimanches) : B.I.AUDIT gratuit, SmartFEC+, tests de RevisAudit, IDEA, MindBridge, Kantik | Retirer de la version CAC |
| 7 | dossier-de-travail | Couvert : c'est le cœur des suites | Toutes les suites | Retirer |
| 8 | rapport-apports-fusion | Non couvert | Rien de trouvé (module « Fusion » de RevisAudit en 2019, contenu inconnu) | Garder, en fin de liste |
| 9 | attestations-chiffres | Non couvert | Aide au pointage seulement (Dataclip d'Auditsoft) | Garder |
| 10 | durabilite-indicateurs | Non couvert, mais rare pour la cible | Rien | Retirer : mission rare pour un cabinet de 1 à 20 personnes |
| 11 | suivi-mandats | Partiel | Déclaration d'activité pré-remplie via Aglaé (Acropole, Auditsoft, PackAUDIT) ; alerte de mandat chez DreamAudit | Reformuler : l'échéancier des mandats et le barème d'heures, sans la déclaration |
| 12 | acceptation-mandats | Partiel | Questionnaires (Auditsoft, PackAUDIT, Acropole) ; LCB-FT (Kanta) ; données INPI (Gest On Line) | Reformuler : l'indépendance vérifiée sur tout le portefeuille (H2A, p. 32 et 40) |
| 13 | planification-missions | Non couvert pour les CAC | Outils génériques, sans notion de mandat (Akuiteo, Tempolia) | Garder, plus bas dans la liste |

## 4. CAC : les cinq automatisations à créer

### 4.1 Tiers à circulariser sélectionnés (rang 1)

- **Fiche.** Pôle certification. Niveau intermédiaire. Sans IA : la règle est déterministe et se rejoue à l'identique. Construction en une à deux semaines.
- **Aujourd'hui.** La sélection se refait dans Excel à chaque passe, par essais successifs. Sa justification au regard de la NEP 530 manque souvent (H2A).
- **Entrée.** La balance auxiliaire clients ou fournisseurs, ou le FEC, au 30/09 puis au 31/12. Et la règle écrite du cabinet.
- **Règle.**
  1. Agréger par tiers le solde et les mouvements. On retient le débit pour les clients ; pour les fournisseurs, la règle du cabinet fixe le sens.
  2. Retenir les tiers au-delà d'un seuil relié au seuil de signification.
  3. Compléter par les plus gros soldes, puis par les plus gros mouvements, puis par une part aléatoire tirée avec une graine conservée.
  4. S'arrêter à la couverture visée (environ 70 % du solde) ou au nombre visé (20 comptes).
  5. Retirer les doublons entre critères.
  6. À la seconde passe, reprendre les tiers du 30/09 et ajouter les nouveaux.
- **Sortie.**
  - La liste des tiers, avec le motif de chacun : solde, mouvement ou tirage.
  - La couverture atteinte, la graine et les paramètres.
  - Un export vers l'outil de circularisation (e-Circu, Auditsoft, Circit) ou vers le publipostage Word.
- **Validation.** Le CAC valide la sélection. Rien ne part sans lui.
- **Arrêt dans le doute.** La sélection s'arrête et signale le problème dans trois cas :
  - la balance ne se rapproche pas du FEC ;
  - un même tiers figure sous deux comptes ;
  - des clients ont un solde créditeur.
- **Ce que le CAC garde.** La règle, le seuil, les tiers ajoutés à la main et la décision d'envoyer.
- **Ce que les outils font déjà.**
  - Les lettres, l'envoi, le suivi et les relances : e-Circu, Auditsoft Anywhere, Circit, Confirmation.
  - Des briques de tirage : IDEA, et la sélection en unités monétaires (MUS) d'Auditsoft et de RevisAudit. Aucune n'a de règle d'arrêt ni ne gère deux passes.
- **Preuves.** NEP 530 § 06 : la sélection d'éléments spécifiques se combine au sondage. H2A, synthèse 2025, p. 33, 57, 60, 64 et 67 : NEP 530 insuffisante dans 46 % des cabinets EIP et sur 57 % de leurs mandats non EIP.

### 4.2 Écarts de confirmation et procédures alternatives (rang 2)

- **Fiche.** Pôle certification. Niveau intermédiaire. Mixte, pour lire les réponses en PDF. Construction en une à deux semaines.
- **Règle.**
  1. Rapprocher chaque réponse du solde.
  2. Pour chaque écart, chercher l'explication : facture non comptabilisée, règlement en transit.
  3. Pour chaque non-réponse, rapprocher le solde des encaissements ou règlements postérieurs (FEC de N+1, relevés) et des factures.
- **Sortie.** La feuille des écarts et les procédures alternatives faites, avec leurs pièces. La conclusion reste vide.
- **Ce que les outils font déjà.** Circit rapproche les réponses des soldes. DataSnipper extrait les montants. e-Circu centralise les réponses.
- **Preuves.**
  - NEP 505.
  - NEP 911 § 24 et NEP 912 § 23, révisées le 24/07/2026 : les encaissements et factures postérieurs peuvent remplacer les confirmations.
  - H2A, p. 57 : 42 % d'insuffisances sur la NEP 505 dans les cabinets EIP.

### 4.3 Fichiers du client rapprochés de la balance (rang 3)

- **Fiche.** Pôle certification. Niveau intermédiaire. Sans IA, ou mixte si des fichiers arrivent en PDF. Construction en une à deux semaines.
- **Règle.**
  - DSN et journal de paie avec les comptes 421, 431, 641 et 645.
  - Tableau des immobilisations avec les comptes 2x, 28x et 68x.
  - Inventaire valorisé avec les comptes 3x.
  - Une feuille d'écarts par fichier.
- **Ce que les outils font déjà.** Auditsoft analyse les DSN, mais ne les rapproche pas de la balance. IDEA et DataSnipper ne fournissent que des briques.
- **Preuve.** H2A, p. 73 : défaillances sur les immobilisations, les stocks, les achats et les créances.

### 4.4 Conventions réglementées et vérifications spécifiques (rang 4)

- **Fiche.** Pôle certification, à confirmer dans l'offre. Niveau ambitieux. Mixte. Construction en plusieurs semaines.
- **Règle.**
  1. Recenser les conventions à partir des PV, des contrats et des réponses des dirigeants.
  2. Pointer avec les comptes le rapport de gestion et les documents adressés aux actionnaires (NEP 9510).
  3. Préparer le projet de rapport spécial.
- **Ce que les outils font déjà.** Rien dans les suites. Auditsoft pointe la plaquette par IA, mais pour l'annexe, pas pour le rapport de gestion.

### 4.5 Factures électroniques exploitées à la clôture (rang 6, en perspective)

- **Fiche.** Pôle certification. Niveau ambitieux. Mixte. Construction en plusieurs semaines.
- **Règle.**
  1. Rapprocher les flux de la plateforme agréée, le FEC et les statuts des factures.
  2. Lister les factures reçues après la clôture qui portent sur l'exercice (FNP), et celles émises après la clôture (FAE).
  3. Vérifier que l'entité respecte l'obligation de réception : un manquement est une irrégularité à signaler.
- **Ce que les outils font déjà.** Aucun outil ne le fait. PackAUDIT a ajouté un questionnaire le 24/08/2026. L'IA d'Auditsoft travaille sur des factures échantillonnées, en PDF.
- **Preuves.**
  - FAQ de la CNCC sur la facturation électronique, v3 (09/2026), Q44, Q45, Q47 et Q50.
  - Baromètre CNCC 2026 : 80 % des CAC ne connaissent pas les effets de la réforme sur l'audit.

## 5. CAC : le catalogue corrigé (10 automatisations)

| Rang | Automatisation | Pôle | Niveau |
|---:|---|---|---|
| 1 | Tiers à circulariser sélectionnés (nouvelle) | certification | intermédiaire |
| 2 | Écarts de confirmation et procédures alternatives (nouvelle) | certification | intermédiaire |
| 3 | Fichiers du client rapprochés de la balance (nouvelle) | certification | intermédiaire |
| 4 | Conventions réglementées et vérifications spécifiques (nouvelle) | certification | ambitieux |
| 5 | Échéancier des mandats et barème d'heures (suivi-mandats reformulé) | administration | simple |
| 6 | Factures électroniques exploitées à la clôture (nouvelle) | certification | ambitieux |
| 7 | Attestations de chiffres préparées | sacc | simple |
| 8 | Indépendance vérifiée sur le portefeuille (acceptation-mandats reformulé) | administration | intermédiaire |
| 9 | Rapport sur les apports pré-rédigé | interventions-legales | ambitieux |
| 10 | Missions et équipes planifiées | administration | intermédiaire |

Sont retirées :
- fec-reception ;
- demandes-documents ;
- revue-analytique ;
- rapport-certification ;
- confirmations-audit (remplacée) ;
- revue-ecritures ;
- dossier-de-travail ;
- durabilite-indicateurs.

## 6. EC : les 19 automatisations actuelles

| Rang | Automatisation | Verdict | Ce que les outils font déjà | Décision |
|---:|---|---|---|---|
| 1 | relance-pieces | Partiel | **Pennylane** : une demande par transaction, un rappel le 1er et le 15 du mois, et Autopilot qui réclame la pièce seul au bout de 15 jours. **ACD i-Banque** : envoie au client les lignes non imputées. **Agiris bobbee** : liste de points en suspens. **Dext, Inqom, MyUnisoft, Tiime** : relance déclenchée à la main | Reformuler : les pièces hors banque et de clôture, une liste priorisée par dossier, un brouillon qui nomme chaque pièce pour les clients sans application, et le cas des cabinets à plusieurs outils |
| 2 | controles-revision | Partiel | Dossier de révision par cycles chez tous, avec contrôles et écritures générées. Cut-off par IA chez Cegid Loop, CCA et PCA chez Inqom, « Fournisseurs dus » chez Tiime. Autopilot Révision de Pennylane annoncé pour 12/2026 | Reformuler : les points à trancher, rédigés avec leurs écritures ; les FNP et FAE proposés avec leur pièce |
| 3 | boite-mail-triee | Non couvert chez les historiques. Partiel chez Pennylane, avec Outlook seulement et dossier par dossier | Pennylane avec Outlook ; assistants génériques (Fyxer, Copilot) | Garder |
| 4 | variables-paie | Partiel | Portails : mySilae Entreprise, portail Cegid, ACD i-PAIE. Imports chez Silae et Openpaye. Relances de Paie Push | Reformuler : les variables reçues hors portail (e-mail, Excel du client, téléphone) |
| 5 | facture-electronique | Couvert chez les éditeurs plateformes agréées | Statut par client, mandats et inscription en masse : Pennylane, ACD, Inqom, fulll, Cegid, MyU, Tiime | Reformuler et descendre : les clients sur une autre plateforme agréée, les appels à passer, les relances rédigées. À montrer seulement si le portefeuille est réparti sur plusieurs plateformes (fenêtre jusqu'au 01/09/2027) |
| 6 | tableau-de-bord-client | Couvert chez Pennylane et fulll, qui commentent par IA. Partiel ailleurs | Pennylane, fulll (son IA Lya), RCA | Descendre. Ne jamais montrer face à Pennylane ou fulll |
| 7 | relance-honoraires | Couvert | Pennylane GI et MyU GI (relances automatiques, prélèvement SEPA), Cegid Loop, ACD GI (relances sur modèles) | Retirer |
| 8 | approbation-comptes | Inconnu côté logiciels de cabinet. Couvert par les services juridiques en ligne | Captain Contrat, Legal Place (vendus aux entreprises) | Garder, après la question sur le module juridique du cabinet |
| 9 | retours-dsn | Partiel | Silae reçoit les comptes rendus (CRM). Le tableau de bord net-entreprises ne garde que trois mois | Garder et monter : CRM de rappel annuel et DSN de substitution depuis 2026 |
| 10 | confirmations-audit | Non couvert par la production. Outillé côté CAC | — | Remplacer par « Tiers à circulariser sélectionnés », la scène CAC étant partagée |
| 11 | memoire-dossier | Partiel : partout, les notes s'écrivent à la main | ACD GRC (dossier permanent), Pennylane Copilot (synthèses comptables) | Garder |
| 12 | rappels-echeances-fiscales | Non couvert côté client | Pennylane : vue des échéances, mais aucun rappel à J-7 ou J-2 ni e-mail pour les acomptes d'IS (aide du 04/09/2026). Tiime : rappel pour la TVA seulement | Garder et mettre en tête |
| 13 | lettres-de-mission | Couvert pour la génération et la signature | Kanta, Pennylane, MyU (signature JeSignExpert) | Reformuler : la relance des lettres non signées, les lettres périmées, les avenants en masse |
| 14 | embauches-declarees | Couvert chez Silae, par mySilae | DPAE envoyée seule, fiche du salarié créée | Reformuler et descendre : l'embauche annoncée par e-mail ou par téléphone. Jamais face à mySilae |
| 15 | fiches-clients-registres | Partiel | Kanta (INPI à l'ouverture du dossier), alertes BODACC génériques | Garder |
| 16 | opportunites-conseil | Partiel | Signaux chiffrés : Pennylane, fulll, RCA, Sesha ; MyU Vision annoncé | Garder, avec prudence |
| 17 | revue-ecritures | Partiel : au niveau du compte, pas de l'écriture | Anomalies par compte (Pennylane, Inqom, MyUnisoft), Runview, Control FEC, module ECF de fulll | Reformuler : une raison pour chaque écriture |
| 18 | entree-en-relation | Partiel | Kanta (vigilance, INPI, questionnaire) ; synchronisation entre outils d'une même suite | Reformuler : la lettre au confrère, la liste de reprise, l'ouverture du dossier chez plusieurs éditeurs, le calendrier de l'année |
| 19 | liasse-fiscale | Couvert | Tous les logiciels de production | Retirer |

## 7. EC : le catalogue corrigé (17 automatisations)

1. rappels-echeances-fiscales
2. relance-pieces (reformulée)
3. boite-mail-triee
4. retours-dsn
5. variables-paie (variables reçues hors portail)
6. controles-revision (points à trancher et cut-off)
7. memoire-dossier
8. lettres-de-mission (relances et avenants)
9. fiches-clients-registres
10. revue-ecritures (une raison pour chaque écriture)
11. entree-en-relation (ce qui reste après Kanta)
12. approbation-comptes
13. opportunites-conseil
14. tableau-de-bord-client (selon l'outil du cabinet)
15. facture-electronique (selon l'outil du cabinet)
16. embauches-declarees (selon l'outil du cabinet)
17. Tiers à circulariser sélectionnés (pôle audit)

Sont retirées : relance-honoraires, liasse-fiscale et confirmations-audit (remplacée).

## 8. À ne jamais montrer comme un gain

- **EC :**
  - la saisie et l'OCR ;
  - le rapprochement bancaire et le lettrage ;
  - la TVA, les immobilisations, la liasse et l'EDI ;
  - la plaquette, la situation intermédiaire et le prévisionnel ;
  - la GED et le portail client ;
  - la relance des honoraires ;
  - une « révision par IA » générique.
- **CAC :**
  - l'import et le contrôle du FEC ;
  - le portail de collecte ;
  - les modèles de rapport ;
  - l'ossature du dossier et les feuilles maîtresses ;
  - le seuil de signification et l'échantillonnage générique ;
  - l'archivage à 60 jours ;
  - la LCB-FT ;
  - l'envoi et la relance des confirmations.

## 9. Acropole Expert CAC, pour le rappel du cabinet rencontré

- **Ce que l'éditeur documente :**
  - le FEC intégré sans paramétrage, avec des seuils d'alerte ;
  - les balances de trois exercices ;
  - les variations et les ruptures de cohérence ;
  - les modèles de documents et la note de synthèse ;
  - les questionnaires NEP 911 et 912 (ALPE) ;
  - la GED liée aux feuilles, les chaînages entre feuilles et la reprise N-1 ;
  - la déclaration d'activité calculée, puis pré-remplie via Aglaé ;
  - la clôture et l'archivage automatiques ;
  - une « formalisation compatible H2A » ;
  - la collecte des pièces via AUDITdrive (MyCompanyFiles).
- **Non trouvé :** la circularisation, l'échantillonnage, le seuil de signification, les échéances de mandats, les temps passés.
- **L'éditeur est actif** : médaille 2026, billet sur les CAC le 05/10/2026. Le changement d'outil annoncé est donc un choix du cabinet. Il peut aussi passer au SaaS chez le même éditeur. Au rappel, lui demander quel outil il retient, et pourquoi.

## 10. Questions à poser avant le showroom

- **CAC :**
  1. Quel outil d'audit, quelle édition, en local ou en ligne ? Avec quelles options : portail de collecte, circularisation, IA, analyse de données ?
  2. Sur votre dernier dossier, où sont la sélection des tiers, la feuille des écarts, la revue analytique et le rapport : dans l'outil, ou dans un Excel joint ?
  3. Qu'est-ce qui vous prend encore du temps à côté de l'outil ?
- **EC :**
  1. Quels outils pour la production, la paie, la collecte et la LCB-FT ? Quelle part de vos clients utilise l'application ?
  2. Qu'est-ce qui arrive encore par e-mail ou dans un Excel ?
  3. Que faites-vous encore à la main à côté de l'outil ?
- **Questions par tâche :** § 4 de chacune des quatre notes.

## 11. Incertitudes

- **Recherche limitée.** Le budget de recherche web s'est épuisé. Les forums et retours d'utilisateurs ont été peu lus, et la douleur de chaque tâche est surtout déduite.
- **Fonctions annoncées, non démontrées :** Cegid Pulse, MyU Vision, Autopilot Révision de Pennylane (12/2026), Caseware Verity en France, IA d'Auditsoft 2026.
- **Points de la circularisation non vérifiés :**
  - les pages d'e-Circu renvoient une erreur 404 : les faits viennent d'extraits de moteur de recherche ;
  - la feuille « Circularisation » de RevisAudit et de DreamAudit n'a pas été examinée ;
  - la liste des requêtes de SmartFEC+ n'est pas publique.
- **Juridique EC.** Les modules juridiques de Cegid, d'ACD et de Sage n'ont pas été trouvés.
- **Lien à proscrire.** revisaudit.fr porte du contenu de casino injecté : ne jamais le lier sur une surface montrée.

## 12. Notes de preuve

- `cac-suites.md` : suites CAC, Acropole, outils de la CNCC, gestion de cabinet (90 sources).
- `cac-donnees-circularisation.md` : analyse de données, circularisation de bout en bout, collecte des pièces.
- `ec-production.md` : production, révision, portails clients.
- `ec-social-juridique-gestion.md` : paie, juridique, gestion interne, LCB-FT, facture électronique, messagerie (60 sources).
- Qualifications de Hermes du 06/10, qui refusent 24 services EC pour cause de fonctions natives : `~/.hermes/kanban/attachments/<carte>/QUALIFICATION-*.md`.
