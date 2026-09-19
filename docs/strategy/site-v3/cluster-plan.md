# Plan de cluster v3 — « automatisation cabinet comptable »

Généré le 2026-09-19 par `build-cluster-plan.py` (source unique : `backlog-v3.json`, `src/data/familles.ts`, `src/content/blog`). 241 satellites (6 publiés, 235 planifiés) en 59 familles et 11 pôles, 964 liens, 346800 mots estimés.

## Méthode

backlog de quatre angles par famille (méthode, contrôle ou checklist, exceptions et refus, définition), 59 familles actives en 12 pôles ; cadence de 4 articles ordinaires par semaine, 2 par jour au plus du lundi au jeudi, plus 1 Cicatrice le samedi ; maillage pilier ↔ satellite et 2 liens cycliques par famille ; priorité posée depuis la demande mesurée par angle (autocomplétion Google et pages de résultats DataForSEO, scripts/seo/questions.mjs, depuis le 19/09/2026 ; un angle de priorité 1 sans mesure datée fait échouer --check).

Recouvrement SERP entre familles (relevés WebSearch des 10/09 et 16/09/2026) : au plus deux domaines partagés, jamais quatre ; chaque famille est donc un cluster distinct, interlié par le pilier, et les quatre angles d’une même famille se lient entre eux.

## Pilier

- **Automatiser un cabinet comptable : la carte des tâches** — `/blog/automatiser-un-cabinet-comptable-la-carte-des-taches` — « automatisation cabinet comptable » — published (2026-09-16).

## Production comptable (`production-comptable`)

### Collecte et relance des pièces (`collecte-pieces`)

Obtenir les pièces attendues d’un dossier, relancer ce qui manque, s’arrêter à réception.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-16 | [Automatiser la relance des pièces clients manquantes](/blog/automatiser-la-relance-des-pieces-clients) | relance pièces manquantes cabinet comptable | how-to-guide | collaborateurs-comptables | 3 | published |
| 2027-02-23 | [Contrôler la complétude d'un dossier client avant saisie](/blog/controler-la-completude-d-un-dossier-client) | pièces manquantes dossier comptable checklist | listicle-checklist | assistants-comptables | 3 | planned |
| 2027-05-25 | [Les cas où la relance de pièces doit rester manuelle](/blog/les-cas-ou-la-relance-de-pieces-doit-rester-manuelle) | relance client automatique cabinet comptable limites | how-to-guide | assistants-comptables | 3 | planned |
| 2027-08-25 | [Qu'est-ce qu'une pièce manquante, au sens du cabinet comptable ?](/blog/qu-est-ce-qu-une-piece-comptable-manquante-au-sens-du-cabinet) | définition pièce manquante cabinet comptable | faq-knowledge | assistants-comptables | 3 | planned |

### Saisie, OCR et pré-comptabilité (`saisie-ocr`)

Lire les pièces, extraire les champs, pré-imputer, et faire remonter ce que la lecture n’a pas su traiter.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-17 | [Automatiser la saisie comptable : ce qui reste à vérifier](/blog/automatiser-la-saisie-comptable-ce-qui-reste-a-verifier) | automatisation saisie comptable OCR | how-to-guide | collaborateurs-comptables | 3 | published |
| 2027-02-24 | [Contrôler une pré-comptabilisation automatique avant validation](/blog/controler-une-pre-comptabilisation-automatique-avant-validation) | checklist contrôle saisie comptable automatisée | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-05-26 | [Quand la lecture automatique d'une pièce doit remonter à un collaborateur](/blog/quand-la-lecture-automatique-d-une-piece-doit-remonter-a-un-collaborateur) | OCR comptable erreur reconnaissance que faire | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2026-11-19 | [OCR comptable et IA générative : quelle différence pour la saisie ?](/blog/ocr-comptable-et-ia-generative-quelle-difference-pour-la-saisie) | différence OCR et IA comptabilité | faq-knowledge | collaborateurs-comptables | 2 | planned |

### Relevés bancaires et rapprochement (`banque-rapprochement`)

Récupérer les relevés, rapprocher les mouvements des écritures, typer les écarts.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-21 | [Rapprochement bancaire automatisé : les écarts à remonter](/blog/rapprochement-bancaire-automatise-les-ecarts-a-remonter) | rapprochement bancaire automatique | how-to-guide | collaborateurs-comptables | 1 | planned |
| 2027-02-25 | [La checklist avant de valider un rapprochement bancaire automatisé](/blog/checklist-avant-de-valider-un-rapprochement-bancaire-automatise) | checklist rapprochement bancaire comptabilité | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-05-27 | [Les écarts qu'un rapprochement bancaire automatique ne tranche pas seul](/blog/les-ecarts-bancaires-qu-un-rapprochement-automatique-ne-doit-pas-trancher-seul) | écart de rapprochement bancaire non expliqué comptabilité | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2026-10-19 | [Qu'est-ce que le rapprochement bancaire, en comptabilité ?](/blog/qu-est-ce-que-le-rapprochement-bancaire-en-comptabilite) | définition rapprochement bancaire comptabilité | faq-knowledge | collaborateurs-comptables | 1 | planned |

### Lettrage des comptes de tiers (`lettrage`)

Apparier factures et règlements selon des règles écrites, isoler les cas de refus.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-30 | [Lettrage automatique : les règles et les cas de refus](/blog/lettrage-automatique-regles-et-cas-de-refus) | lettrage automatique comptable | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-03-01 | [Contrôler un lettrage automatique avant clôture](/blog/controler-un-lettrage-automatique-avant-cloture) | checklist lettrage comptable avant clôture | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-05-31 | [Paiements groupés et écarts de centimes : ce que le lettrage refuse](/blog/paiements-groupes-et-ecarts-de-centimes-ce-que-le-lettrage-automatique-refuse) | lettrage comptable paiement groupé plusieurs factures | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-08-26 | [Qu'est-ce que le lettrage comptable, et peut-on l'automatiser entièrement ?](/blog/qu-est-ce-que-le-lettrage-comptable-et-peut-on-l-automatiser-entierement) | définition lettrage comptable automatique | faq-knowledge | collaborateurs-comptables | 3 | planned |

### Factures d’achat et fournisseurs (`achats-fournisseurs`)

Suivre les factures d’achat, les avoirs, les échéances fournisseurs et les doublons.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-01 | [Automatiser le suivi des factures d'achat et des échéances fournisseurs](/blog/automatiser-le-suivi-des-factures-d-achat-et-des-echeances-fournisseurs) | automatiser factures fournisseurs cabinet comptable | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-03-02 | [Détecter les doublons de factures fournisseurs avant paiement](/blog/detecter-les-doublons-de-factures-fournisseurs-avant-paiement) | doublon facture fournisseur détection automatique | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-06-01 | [Les avoirs fournisseurs qu'un rapprochement automatique n'impute pas seul](/blog/les-avoirs-fournisseurs-qu-un-rapprochement-automatique-ne-doit-pas-imputer-seul) | avoir fournisseur imputation comptable automatique limite | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-08-30 | [Factures d'achat et notes de frais : où est la frontière comptable ?](/blog/factures-d-achat-et-notes-de-frais-ou-est-la-frontiere) | différence facture fournisseur et note de frais comptabilité | faq-knowledge | assistants-comptables | 3 | planned |

### Ventes, caisse et journaux de vente (`ventes-caisse`)

Importer les ventes (caisse, e-commerce, facturation client) sans ressaisie et contrôler les écarts.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-02 | [Automatiser l'import des ventes de caisse et e-commerce en comptabilité](/blog/automatiser-l-import-des-ventes-de-caisse-et-e-commerce-en-comptabilite) | importer ventes caisse comptabilité sans ressaisie | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-03-03 | [Contrôler un journal de ventes importé avant validation](/blog/controler-un-journal-de-ventes-importe-avant-validation) | checklist contrôle journal des ventes comptabilité | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-06-02 | [Les écarts de caisse qu'un import de ventes ne corrige jamais seul](/blog/les-ecarts-de-caisse-qu-un-import-de-ventes-ne-doit-jamais-corriger-seul) | écart de caisse comptabilité que faire | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-08-31 | [Qu'est-ce qu'un journal de ventes, et comment l'alimenter sans ressaisie ?](/blog/qu-est-ce-qu-un-journal-de-ventes-et-comment-il-s-alimente-automatiquement) | définition journal des ventes comptabilité automatique | faq-knowledge | assistants-comptables | 3 | planned |

### Notes de frais (`notes-de-frais`)

Traiter les justificatifs de frais, extraire, contrôler, faire remonter les exceptions.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-03 | [Notes de frais clients : les traiter sans ressaisie](/blog/notes-de-frais-clients-traiter-sans-ressaisie) | notes de frais cabinet comptable automatisation | how-to-guide | assistants-comptables | 3 | planned |
| 2027-03-04 | [La checklist de contrôle d'une note de frais avant remboursement](/blog/checklist-de-controle-d-une-note-de-frais-avant-remboursement) | checklist contrôle note de frais comptabilité | listicle-checklist | assistants-comptables | 3 | planned |
| 2027-06-03 | [Les notes de frais qu'un traitement automatique fait toujours remonter](/blog/les-notes-de-frais-qu-un-traitement-automatique-doit-toujours-faire-remonter) | note de frais anomalie traitement automatique | how-to-guide | assistants-comptables | 3 | planned |
| 2027-09-01 | [Quels frais professionnels sont exonérés de cotisations sociales ?](/blog/quels-frais-professionnels-sont-exoneres-de-cotisations) | frais professionnels exonérés cotisations urssaf | faq-knowledge | assistants-comptables | 3 | planned |

### Immobilisations, amortissements et emprunts (`immobilisations-emprunts`)

Tenir les tableaux d’amortissement et d’emprunt, générer les écritures récurrentes, contrôler les soldes.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-07 | [Automatiser les tableaux d'amortissement et d'emprunt du dossier permanent](/blog/automatiser-les-tableaux-d-amortissement-et-d-emprunt-du-dossier-permanent) | automatiser tableau amortissement comptabilité cabinet | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-03-08 | [Contrôler les soldes d'amortissement avant la clôture](/blog/controler-les-soldes-d-amortissement-avant-la-cloture) | checklist contrôle amortissement avant clôture | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2026-10-07 | [Mise au rebut d'une immobilisation : ce qu'un tableau d'amortissement ne tranche pas](/blog/cession-et-mise-au-rebut-ce-qu-un-tableau-d-amortissement-automatique-ne-tranche-pas) | mise au rebut immobilisation comptabilité | how-to-guide | collaborateurs-comptables | 1 | planned |
| 2027-09-02 | [Qu'est-ce qu'une immobilisation, et comment son amortissement se calcule ?](/blog/qu-est-ce-qu-une-immobilisation-et-comment-son-amortissement-se-calcule) | définition immobilisation amortissement comptable | faq-knowledge | collaborateurs-comptables | 3 | planned |

### Révision par cycles et justification des soldes (`revision-cycles`)

Rejouer les contrôles répétitifs de la révision, justifier chaque solde, tracer les écritures d’inventaire.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-08 | [Automatiser la justification des soldes en révision comptable](/blog/automatiser-la-justification-des-soldes-en-revision-comptable) | automatiser justification des soldes révision comptable | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-03-09 | [Automatiser les contrôles répétitifs de la révision par cycles](/blog/automatiser-les-controles-repetitifs-de-la-revision-par-cycles) | révision comptable par cycles contrôles | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-06-07 | [Les soldes de révision qu'un contrôle automatique ne classe pas seul](/blog/les-soldes-de-revision-qu-un-controle-automatique-ne-doit-pas-classer-seul) | solde non justifié révision comptable que faire | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-09-06 | [Qu'est-ce que la révision par cycles, en comptabilité ?](/blog/qu-est-ce-que-la-revision-par-cycles-en-comptabilite) | définition révision par cycles comptabilité | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Clôture, bilan et plaquette (`cloture-bilan`)

Dérouler la clôture, produire les états et la plaquette, contrôler avant livraison.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-09 | [Automatiser la production de la plaquette de bilan](/blog/automatiser-la-production-de-la-plaquette-de-bilan) | automatiser plaquette de bilan cabinet comptable | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-03-10 | [Clôture annuelle : automatiser les contrôles répétitifs](/blog/cloture-annuelle-automatiser-les-controles-repetitifs) | clôture comptable cabinet automatisation | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-06-08 | [Ce qu'une clôture automatisée laisse toujours au réviseur](/blog/ce-qu-une-cloture-automatisee-laisse-toujours-au-reviseur) | clôture comptable automatique limite jugement professionnel | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-09-07 | [Quelles sont les étapes obligatoires d'une clôture annuelle ?](/blog/quelles-sont-les-etapes-obligatoires-d-une-cloture-annuelle) | étapes clôture annuelle comptable définition | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Situations intermédiaires et reporting client (`situations-reporting-client`)

Produire des situations et tableaux de bord clients à partir de la comptabilité tenue.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-10 | [Automatiser les situations intermédiaires et le reporting client](/blog/automatiser-les-situations-intermediaires-et-le-reporting-client) | automatiser situation comptable intermédiaire client cabinet | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-03-11 | [Contrôler une situation intermédiaire avant de l'envoyer au client](/blog/controler-une-situation-intermediaire-avant-envoi-au-client) | checklist situation comptable intermédiaire avant envoi | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-06-09 | [Les indicateurs qu'un reporting client automatique ne commente pas seul](/blog/les-indicateurs-de-reporting-client-qu-un-tableau-automatique-ne-doit-pas-commenter-seul) | commentaire tableau de bord client comptabilité risque | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-09-08 | [Situation intermédiaire et reporting client : quelle différence ?](/blog/situation-intermediaire-et-reporting-client-quelle-difference) | différence situation intermédiaire et reporting client | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Facture électronique et e-reporting (`facture-electronique`)

Recevoir, transmettre et archiver les factures électroniques ; ce que la réforme change dans la collecte.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-14 | [Automatiser la réception des factures électroniques au cabinet](/blog/automatiser-la-reception-des-factures-electroniques-au-cabinet) | réception facture électronique cabinet comptable automatisation | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2026-09-29 | [Mentions obligatoires de la facture électronique : la checklist avant le passage](/blog/checklist-de-conformite-avant-le-passage-a-la-facture-electronique) | mentions obligatoires facture électronique | listicle-checklist | chefs-mission-portefeuille | 1 | planned |
| 2027-06-10 | [E-reporting : les opérations qu'un cabinet vérifie toujours à la main](/blog/e-reporting-les-operations-qu-un-cabinet-doit-toujours-verifier-a-la-main) | e-reporting TVA vérification manuelle cabinet | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-09-09 | [Facture électronique : ce que change la collecte des pièces](/blog/facture-electronique-ce-que-change-la-collecte-des-pieces) | facture électronique cabinet comptable collecte | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### GED, dossier permanent et nommage des pièces (`ged-dossier-permanent`)

Classer, nommer et retrouver les pièces et le dossier permanent sans reclasser à la main.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-15 | [Automatiser le classement et le nommage des pièces du dossier permanent](/blog/automatiser-le-classement-et-le-nommage-des-pieces-du-dossier-permanent) | automatiser classement GED cabinet comptable | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-03-15 | [La checklist pour vérifier un dossier permanent avant transfert](/blog/checklist-pour-verifier-un-dossier-permanent-avant-transfert) | checklist dossier permanent client cabinet comptable | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-06-14 | [Les pièces sensibles qu'un classement automatique ne déplace pas seul](/blog/les-pieces-sensibles-qu-un-classement-automatique-ne-doit-jamais-deplacer-seul) | pièce comptable confidentielle classement automatique risque | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-09-13 | [Qu'est-ce qu'un dossier permanent, en cabinet d'expertise comptable ?](/blog/qu-est-ce-qu-un-dossier-permanent-en-cabinet-d-expertise-comptable) | définition dossier permanent cabinet comptable | faq-knowledge | collaborateurs-comptables | 3 | planned |

## Portefeuille et échéances (`portefeuille-echeances`)

### Calendrier et échéances fiscales du portefeuille (`echeances-fiscales`)

Tenir, par dossier, les échéances déclaratives et de paiement, avec alertes agrégées.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-22 | [Calendrier fiscal d'un cabinet comptable : suivre les échéances d'un portefeuille](/blog/suivre-les-echeances-fiscales-d-un-portefeuille) | calendrier fiscal cabinet comptable | how-to-guide | chefs-mission-portefeuille | 1 | planned |
| 2027-03-16 | [La checklist mensuelle des échéances fiscales du portefeuille](/blog/checklist-mensuelle-des-echeances-fiscales-du-portefeuille) | checklist échéances fiscales cabinet comptable mensuelle | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-06-15 | [Échéances reportées ou suspendues : ce qu'un calendrier ne décide pas](/blog/echeances-fiscales-reportees-ou-suspendues-ce-qu-un-calendrier-automatique-ne-decide-pas) | report échéance fiscale entreprise procédure | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-09-14 | [Qu'est-ce qu'une échéance fiscale de portefeuille, et comment la suivre ?](/blog/qu-est-ce-qu-une-echeance-fiscale-de-portefeuille-et-comment-elle-se-suit) | définition échéance fiscale portefeuille cabinet | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Télédéclarations et rejets (`teledeclarations-rejets`)

Suivre les envois EDI et EFI, leurs accusés et leurs rejets, jusqu’à la correction.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-16 | [Suivre la liasse EDI-TDFC et ses rejets](/blog/suivre-la-liasse-edi-tdfc-et-ses-rejets) | liasse EDI TDFC rejet suivi | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-03-17 | [La checklist avant le dépôt d'une télédéclaration EDI](/blog/checklist-avant-le-depot-d-une-teledeclaration-edi) | checklist dépôt télédéclaration EDI cabinet comptable | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-06-16 | [Les rejets EDI qu'un suivi automatique ne corrige pas seul](/blog/les-rejets-edi-qu-un-suivi-automatique-ne-doit-pas-corriger-seul) | rejet télédéclaration EDI que faire cabinet comptable | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-09-15 | [Qu'est-ce que la télétransmission EDI-TDFC, en cabinet comptable ?](/blog/qu-est-ce-que-la-teletransmission-edi-tdfc-en-cabinet-comptable) | définition EDI TDFC télétransmission fiscale | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Suivi des dossiers par état (`suivi-dossiers-etats`)

Connaître l’étape et les exceptions de chaque dossier dans un classeur, sans reconstruire.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-17 | [Automatiser le suivi des dossiers par état dans un classeur partagé](/blog/automatiser-le-suivi-des-dossiers-par-etat-dans-un-classeur-partage) | suivi des dossiers par état cabinet comptable automatisation | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-03-18 | [La checklist pour fiabiliser les états d'un classeur de suivi](/blog/checklist-pour-fiabiliser-les-etats-d-un-classeur-de-suivi-de-dossiers) | checklist fiabiliser classeur suivi dossiers comptables | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-06-17 | [Les dossiers bloqués qu'un suivi automatique signale toujours](/blog/les-dossiers-bloques-qu-un-suivi-automatique-doit-toujours-signaler-a-un-humain) | dossier bloqué cabinet comptable alerte | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-09-16 | [Quels sont les états possibles d'un dossier, dans un cabinet comptable ?](/blog/quels-sont-les-etats-possibles-d-un-dossier-dans-un-cabinet-comptable) | états d'un dossier comptable liste définition | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Tableau de bord de production (`tableau-de-bord-production`)

Agréger l’avancement et les retards du portefeuille en indicateurs non nominatifs.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-21 | [Un tableau de bord de production sans classer les personnes](/blog/tableau-de-bord-de-production-sans-classer-les-personnes) | tableau de bord cabinet comptable suivi dossiers | how-to-guide | direction-associes | 3 | planned |
| 2027-03-22 | [Les indicateurs à suivre dans un tableau de bord de production](/blog/checklist-des-indicateurs-a-suivre-dans-un-tableau-de-bord-de-production) | indicateurs tableau de bord cabinet comptable | listicle-checklist | direction-associes | 3 | planned |
| 2027-06-21 | [Pourquoi un tableau de bord de production ne nomme jamais un collaborateur](/blog/pourquoi-un-tableau-de-bord-de-production-ne-doit-jamais-nommer-un-collaborateur) | tableau de bord cabinet comptable surveillance salarié | how-to-guide | direction-associes | 3 | planned |
| 2027-09-20 | [Qu'est-ce qu'un tableau de bord de production, en cabinet comptable ?](/blog/qu-est-ce-qu-un-tableau-de-bord-de-production-en-cabinet-comptable) | définition tableau de bord de production cabinet | faq-knowledge | direction-associes | 3 | planned |

### Plan de charge et affectation (`planification-charge`)

Répartir les dossiers et les périodes de pointe sans surveiller les personnes.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-22 | [Automatiser le plan de charge et l'affectation des dossiers](/blog/automatiser-le-plan-de-charge-et-l-affectation-des-dossiers) | plan de charge cabinet comptable automatisation | how-to-guide | direction-associes | 3 | planned |
| 2027-03-23 | [La checklist pour vérifier un plan de charge avant une période de pointe](/blog/checklist-pour-verifier-un-plan-de-charge-avant-une-periode-de-pointe) | checklist plan de charge cabinet comptable période de pointe | listicle-checklist | direction-associes | 3 | planned |
| 2027-06-22 | [Répartition de charge : ce qu'un plan automatique n'arbitre pas seul](/blog/repartition-de-charge-ce-qu-un-plan-automatique-ne-doit-pas-arbitrer-seul) | répartition de la charge cabinet comptable arbitrage | how-to-guide | direction-associes | 3 | planned |
| 2026-10-20 | [Cabinet comptable en surcharge de travail : où passe le temps, et ce qui s'écrit](/blog/cabinet-comptable-en-surcharge-de-travail-ou-passe-le-temps-et-ce-qui-s-ecrit) | cabinet comptable surcharge de travail | how-to-guide | direction-associes | 1 | planned |

## Paie et social (`paie-social`)

### Collecte des variables de paie (`variables-de-paie`)

Obtenir chaque mois les variables des clients, relancer, contrôler avant le bulletin.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-23 | [Collecter les variables de paie sans relancer à la main](/blog/collecter-les-variables-de-paie-sans-relancer-a-la-main) | collecte variables de paie clients cabinet | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-03-24 | [La checklist de contrôle des variables de paie avant le bulletin](/blog/checklist-de-controle-des-variables-de-paie-avant-le-bulletin) | checklist contrôle variables de paie avant bulletin | listicle-checklist | paie-responsables-sociaux | 3 | planned |
| 2027-06-23 | [Les variables de paie qu'un formulaire automatique ne valide jamais seul](/blog/les-variables-de-paie-qu-un-formulaire-automatique-ne-doit-jamais-valider-seul) | variable de paie incohérente validation manuelle | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-09-21 | [Qu'est-ce qu'une variable de paie, et qui doit la transmettre ?](/blog/qu-est-ce-qu-une-variable-de-paie-et-qui-doit-la-transmettre) | définition variable de paie cabinet comptable | faq-knowledge | paie-responsables-sociaux | 3 | planned |

### Bulletins et contrôles avant et après paie (`bulletins-controle`)

Contrôler la cohérence des bulletins avant le dépôt et après le calcul.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-24 | [Automatiser les contrôles de bulletins après le calcul de la paie](/blog/automatiser-les-controles-de-bulletins-apres-le-calcul-de-la-paie) | contrôle bulletin de paie après calcul cabinet comptable | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-03-25 | [La checklist de contrôle des bulletins à éléments variables](/blog/checklist-de-controle-des-bulletins-a-elements-variables) | checklist bulletin de paie éléments variables contrôle | listicle-checklist | paie-responsables-sociaux | 3 | planned |
| 2027-06-24 | [Les bulletins de paie qu'un contrôle automatique isole toujours](/blog/les-bulletins-de-paie-qu-un-controle-automatique-doit-toujours-isoler) | bulletin de paie atypique contrôle manuel | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2026-11-23 | [Quelles mentions un bulletin de paie doit-il toujours comporter ?](/blog/quelles-mentions-un-bulletin-de-paie-doit-il-toujours-comporter) | mentions obligatoires bulletin de paie définition | faq-knowledge | paie-responsables-sociaux | 2 | planned |
| 2026-09-09 | [Comment contrôler les bulletins de paie avant la DSN ?](/blog/controler-les-bulletins-de-paie-avant-la-dsn) | contrôle bulletin de paie | how-to-guide | paie-responsables-sociaux | 1 | published |

### DSN et comptes rendus métier (`dsn-crm`)

Préparer, contrôler et déposer la DSN ; lire et traiter les retours.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-28 | [Automatiser le contrôle et le dépôt de la DSN](/blog/automatiser-le-controle-et-le-depot-de-la-dsn) | automatiser dépôt DSN cabinet comptable | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2026-09-30 | [Date limite de dépôt de la DSN mensuelle : la checklist avant le 5 ou le 15](/blog/checklist-avant-le-depot-mensuel-de-la-dsn) | date limite dépôt DSN mensuelle | listicle-checklist | paie-responsables-sociaux | 1 | planned |
| 2027-06-28 | [Que faire quand un compte rendu métier DSN signale une anomalie ?](/blog/que-faire-quand-un-compte-rendu-metier-dsn-signale-une-anomalie) | compte rendu métier DSN anomalie action corrective | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2026-10-21 | [CRM DSN de substitution : ce que le compte rendu remplace, et ce qu'il faut refaire](/blog/crm-dsn-de-substitution-ce-que-le-compte-rendu-remplace-et-ce-qu-il-faut-refaire) | crm dsn de substitution | faq-knowledge | paie-responsables-sociaux | 1 | planned |
| 2026-09-15 | [Comprendre les comptes rendus métier DSN : méthode de lecture](/blog/comprendre-les-comptes-rendus-metier-dsn) | crm dsn | how-to-guide | paie-responsables-sociaux | 1 | published |

### Entrées, sorties et attestations (`entrees-sorties-salaries`)

DPAE, contrats, soldes de tout compte, attestations : préparer sans ressaisir.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-29 | [Automatiser les entrées et sorties de salariés sans ressaisie](/blog/automatiser-les-entrees-et-sorties-de-salaries-sans-ressaisie) | automatiser DPAE et solde de tout compte cabinet comptable | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2026-10-01 | [Documents obligatoires en fin de contrat : la checklist de sortie d'un salarié](/blog/checklist-de-sortie-d-un-salarie-documents-et-delais) | documents obligatoires fin de contrat salarié | listicle-checklist | paie-responsables-sociaux | 1 | planned |
| 2026-10-08 | [Rupture conventionnelle : délai d'homologation, ce qu'un générateur ne boucle pas seul](/blog/les-ruptures-de-contrat-qu-un-generateur-automatique-de-documents-ne-doit-pas-boucler-seul) | rupture conventionnelle homologation délai | how-to-guide | paie-responsables-sociaux | 1 | planned |
| 2026-11-24 | [DPAE et attestation employeur : quelle différence ?](/blog/dpae-et-attestation-employeur-quelle-difference) | différence DPAE et attestation employeur | faq-knowledge | paie-responsables-sociaux | 2 | planned |

### Absences, arrêts et IJSS (`absences-ijss`)

Suivre les absences, les arrêts et les indemnités journalières, et leurs pièces.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-30 | [Automatiser le suivi des absences et des indemnités journalières](/blog/automatiser-le-suivi-des-absences-et-des-indemnites-journalieres) | suivi automatique arrêt de travail IJSS cabinet comptable | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-03-29 | [La checklist de contrôle d'un arrêt de travail avant la paie](/blog/checklist-de-controle-d-un-arret-de-travail-avant-la-paie) | checklist contrôle arrêt de travail paie | listicle-checklist | paie-responsables-sociaux | 3 | planned |
| 2027-06-29 | [Les indemnités journalières qu'un rapprochement automatique ne solde pas seul](/blog/les-indemnites-journalieres-qu-un-rapprochement-automatique-ne-doit-pas-solder-seul) | IJSS non reçue rapprochement paie que faire | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-09-22 | [Qu'est-ce que la subrogation, en matière d'indemnités journalières ?](/blog/qu-est-ce-que-la-subrogation-en-matiere-d-indemnites-journalieres) | définition subrogation IJSS employeur | faq-knowledge | paie-responsables-sociaux | 3 | planned |

### Charges sociales et échéances (`charges-sociales-echeances`)

Suivre les échéances Urssaf et caisses par dossier, préparer les règlements.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-12-31 | [Automatiser le suivi des échéances Urssaf et caisses de retraite](/blog/automatiser-le-suivi-des-echeances-urssaf-et-caisses-de-retraite) | suivi échéances urssaf cabinet comptable automatisation | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-03-30 | [La checklist avant le règlement des charges sociales mensuelles](/blog/checklist-avant-le-reglement-des-charges-sociales-mensuelles) | checklist règlement charges sociales mensuelles | listicle-checklist | paie-responsables-sociaux | 3 | planned |
| 2026-10-12 | [Majoration de retard Urssaf : le calcul, et ce qu'un suivi automatique doit signaler](/blog/retard-ou-erreur-de-cotisation-ce-qu-un-suivi-automatique-doit-toujours-signaler) | majoration de retard urssaf calcul | how-to-guide | paie-responsables-sociaux | 1 | planned |
| 2026-10-22 | [Caisses de retraite complémentaire obligatoires : ce que le cabinet suit par dossier](/blog/quelles-charges-sociales-un-cabinet-doit-il-suivre-pour-chaque-dossier) | caisses de retraite complémentaire obligatoires | faq-knowledge | paie-responsables-sociaux | 1 | planned |

### Suivi de la production sociale (`suivi-production-sociale`)

Piloter le pôle social par dossier et par étape, en agrégats, jamais par personne.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-04 | [Piloter le pôle social par étape, sans jamais nommer un salarié](/blog/piloter-le-pole-social-par-etape-sans-jamais-nommer-un-salarie) | pilotage production sociale cabinet comptable agrégats | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-03-31 | [Les indicateurs à agréger pour piloter le pôle social](/blog/checklist-des-indicateurs-a-agreger-pour-le-pole-social) | indicateurs de pilotage pôle social cabinet comptable | listicle-checklist | paie-responsables-sociaux | 3 | planned |
| 2027-06-30 | [Pourquoi un indicateur de production sociale ne remonte jamais un nom](/blog/pourquoi-un-indicateur-de-production-sociale-ne-doit-jamais-remonter-un-nom) | indicateur RH nominatif pôle social risque CNIL | how-to-guide | paie-responsables-sociaux | 3 | planned |
| 2027-09-23 | [Qu'est-ce que le suivi de la production sociale d'un cabinet ?](/blog/qu-est-ce-que-le-suivi-de-la-production-sociale-d-un-cabinet) | définition suivi production sociale cabinet comptable | faq-knowledge | paie-responsables-sociaux | 3 | planned |
| 2026-09-09 | [Suivre la production sociale dans Excel : modèle, règles et limites](/blog/suivre-la-production-sociale-dans-excel) | tableau de bord paie excel | how-to-guide | paie-responsables-sociaux | 1 | published |

## Juridique et fiscal (`juridique-fiscal`)

### TVA : préparation et contrôles (`tva`)

Préparer la déclaration, contrôler la cohérence, tracer ce qui a été vérifié.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-05 | [Préparer la TVA : les contrôles avant déclaration](/blog/preparer-la-tva-les-controles-avant-declaration) | contrôle TVA avant déclaration cabinet | how-to-guide | juridique-fiscal | 3 | planned |
| 2027-04-01 | [La checklist de contrôle de la TVA avant télétransmission](/blog/checklist-de-controle-de-la-tva-avant-teletransmission) | checklist contrôle TVA avant télétransmission | listicle-checklist | juridique-fiscal | 3 | planned |
| 2027-07-01 | [Les opérations de TVA qu'un contrôle automatique ne tranche jamais seul](/blog/les-operations-de-tva-qu-un-controle-automatique-ne-doit-jamais-trancher-seul) | TVA opération complexe contrôle manuel cabinet | how-to-guide | juridique-fiscal | 3 | planned |
| 2026-10-26 | [TVA collectée et TVA déductible : quelle différence ?](/blog/tva-collectee-et-tva-deductible-quelle-difference) | différence TVA collectée TVA déductible | faq-knowledge | juridique-fiscal | 1 | planned |

### Impôt sur les sociétés, acomptes et soldes (`is-acomptes`)

Calculer et suivre acomptes et soldes par dossier, préparer les déclarations.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-06 | [Automatiser le calcul et le suivi des acomptes d'IS](/blog/automatiser-le-calcul-et-le-suivi-des-acomptes-d-is) | automatiser acomptes impôt sur les sociétés cabinet | how-to-guide | juridique-fiscal | 3 | planned |
| 2026-11-17 | [La checklist avant le versement d'un acompte d'IS](/blog/checklist-avant-le-versement-d-un-acompte-d-is) | checklist acompte IS avant versement | listicle-checklist | juridique-fiscal | 2 | planned |
| 2027-07-05 | [Sous-estimation d'acompte d'IS : ce qu'un calcul automatique signale](/blog/sous-estimation-d-acompte-d-is-ce-qu-un-calcul-automatique-doit-signaler) | pénalité sous-estimation acompte IS entreprise | how-to-guide | juridique-fiscal | 3 | planned |
| 2026-10-27 | [Comment se calcule un acompte d'impôt sur les sociétés ?](/blog/comment-se-calcule-un-acompte-d-impot-sur-les-societes) | définition calcul acompte impôt sur les sociétés | faq-knowledge | juridique-fiscal | 1 | planned |

### Déclarations annexes (`declarations-annexes`)

CFE, CVAE, DAS2, IFU, taxes sur les véhicules : préparer et suivre sans oubli.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-07 | [Automatiser le suivi des déclarations annexes : CFE, CVAE, DAS2](/blog/automatiser-le-suivi-des-declarations-annexes-cfe-cvae-das2) | automatiser déclarations annexes cabinet comptable | how-to-guide | juridique-fiscal | 3 | planned |
| 2027-04-05 | [La checklist annuelle des déclarations annexes par dossier](/blog/checklist-annuelle-des-declarations-annexes-par-dossier) | checklist déclarations annexes entreprise annuelle | listicle-checklist | juridique-fiscal | 3 | planned |
| 2027-07-06 | [Quelles déclarations annexes un changement de situation fait revérifier](/blog/quelles-declarations-annexes-un-changement-de-situation-fait-toujours-reverifier) | changement de situation entreprise déclaration fiscale annexe | how-to-guide | juridique-fiscal | 3 | planned |
| 2026-10-28 | [Qui doit déclarer la CVAE ? La règle du cabinet, dossier par dossier](/blog/cfe-cvae-das2-ifu-a-quoi-correspond-chaque-declaration-annexe) | qui doit déclarer la CVAE | faq-knowledge | juridique-fiscal | 1 | planned |

### Approbation des comptes et secrétariat juridique (`secretariat-juridique`)

Préparer AG, procès-verbaux et dépôt des comptes, à partir des données tenues.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-11 | [Approbation des comptes : préparer le secrétariat juridique annuel](/blog/approbation-des-comptes-preparer-le-secretariat-juridique-annuel) | approbation des comptes AG cabinet automatisation | how-to-guide | juridique-fiscal | 3 | planned |
| 2027-04-06 | [La checklist des documents d'une assemblée générale annuelle](/blog/checklist-des-documents-d-une-assemblee-generale-annuelle) | checklist documents assemblée générale annuelle entreprise | listicle-checklist | juridique-fiscal | 3 | planned |
| 2027-07-07 | [Les décisions d'assemblée générale qu'un générateur de PV ne rédige jamais seul](/blog/les-decisions-d-assemblee-generale-qu-un-generateur-de-pv-ne-redige-jamais-seul) | procès-verbal assemblée générale décision complexe | how-to-guide | juridique-fiscal | 3 | planned |
| 2026-10-29 | [Délai de dépôt des comptes au greffe : le calendrier que le cabinet tient par dossier](/blog/quel-est-le-delai-legal-pour-approuver-les-comptes-annuels) | délai dépôt des comptes au greffe | faq-knowledge | juridique-fiscal | 1 | planned |

### Création, modifications et formalités (`formalites-creation-modification`)

Constituer les dossiers de formalités et suivre leur avancement.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-12 | [Automatiser la constitution des dossiers de formalités d'entreprise](/blog/automatiser-la-constitution-des-dossiers-de-formalites-d-entreprise) | automatiser formalités création entreprise cabinet comptable | how-to-guide | juridique-fiscal | 3 | planned |
| 2027-04-07 | [La checklist des pièces d'un dossier de formalité avant dépôt](/blog/checklist-des-pieces-d-un-dossier-de-formalite-avant-depot) | checklist pièces dossier formalité entreprise | listicle-checklist | juridique-fiscal | 3 | planned |
| 2027-07-08 | [Les formalités d'entreprise qui échouent toujours sans validation humaine](/blog/les-formalites-d-entreprise-qui-echouent-toujours-sans-validation-humaine) | rejet dossier formalité guichet unique motif | how-to-guide | juridique-fiscal | 3 | planned |
| 2026-11-02 | [Transfert de siège social : les formalités, et ce qui se prépare seul au cabinet](/blog/quelles-formalites-declencher-lors-d-une-modification-statutaire) | transfert de siège social formalité | faq-knowledge | juridique-fiscal | 1 | planned |

### Registres et obligations périodiques (`registres-obligations`)

Tenir registres, bénéficiaires effectifs et obligations récurrentes par dossier.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-12 | [Automatiser la tenue des registres et du registre des bénéficiaires effectifs](/blog/automatiser-la-tenue-des-registres-et-du-registre-des-beneficiaires-effectifs) | automatiser registre des bénéficiaires effectifs cabinet | how-to-guide | juridique-fiscal | 2 | planned |
| 2026-11-18 | [La checklist annuelle des registres obligatoires d'une société](/blog/checklist-annuelle-des-registres-obligatoires-d-une-societe) | checklist registres obligatoires société annuelle | listicle-checklist | juridique-fiscal | 2 | planned |
| 2026-10-13 | [Changement de bénéficiaire effectif : ce qu'une mise à jour ne déclare pas seule](/blog/changement-de-beneficiaire-effectif-ce-qu-une-mise-a-jour-automatique-ne-declare-pas-seule) | déclaration bénéficiaire effectif changement obligation | how-to-guide | juridique-fiscal | 1 | planned |
| 2026-11-03 | [Qu'est-ce que le registre des bénéficiaires effectifs ?](/blog/qu-est-ce-que-le-registre-des-beneficiaires-effectifs) | définition registre des bénéficiaires effectifs | faq-knowledge | juridique-fiscal | 1 | planned |

### Lettre de mission et vigilance (`lettre-de-mission-lcbft`)

Rédiger, faire signer, renouveler la lettre de mission ; tenir la vigilance LCB-FT.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-13 | [Suivre le renouvellement des lettres de mission](/blog/suivre-le-renouvellement-des-lettres-de-mission) | lettre de mission renouvellement suivi | how-to-guide | administratif-secretariat | 3 | planned |
| 2026-10-05 | [Avenant à la lettre de mission : ce qui se prépare seul, ce qui attend la signature](/blog/checklist-avant-le-renouvellement-d-une-lettre-de-mission) | avenant lettre de mission cabinet comptable | listicle-checklist | administratif-secretariat | 1 | planned |
| 2026-10-14 | [Déclaration de soupçon Tracfin : ce qu'un suivi de mission ne décide jamais seul](/blog/vigilance-lcb-ft-ce-qu-un-suivi-automatique-de-mission-ne-decide-jamais-seul) | déclaration de soupçon Tracfin expert-comptable | how-to-guide | administratif-secretariat | 1 | planned |
| 2026-11-04 | [Qu'est-ce que la lettre de mission d'un expert-comptable ?](/blog/qu-est-ce-que-la-lettre-de-mission-d-un-expert-comptable) | définition lettre de mission expert-comptable | faq-knowledge | administratif-secretariat | 1 | planned |

## Facturation et recouvrement du cabinet (`facturation-recouvrement`)

### Honoraires et actes hors forfait (`honoraires-facturation`)

Facturer les honoraires mensualisés et les actes hors forfait, une seule fois.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-14 | [Ne pas facturer deux fois un acte hors forfait](/blog/ne-pas-facturer-deux-fois-un-acte-hors-forfait) | facturation actes hors forfait cabinet comptable | how-to-guide | facturation-recouvrement | 3 | planned |
| 2027-04-08 | [La checklist mensuelle de facturation des honoraires](/blog/checklist-mensuelle-de-facturation-des-honoraires) | checklist facturation honoraires cabinet comptable mensuelle | listicle-checklist | facturation-recouvrement | 3 | planned |
| 2027-07-12 | [Les actes hors forfait qu'une facturation automatique n'émet jamais seule](/blog/les-actes-hors-forfait-qu-une-facturation-automatique-ne-doit-jamais-emettre-seule) | facturation acte hors forfait validation avant envoi | how-to-guide | facturation-recouvrement | 3 | planned |
| 2027-09-27 | [Honoraires mensualisés et actes hors forfait : quelle différence ?](/blog/honoraires-mensualises-et-actes-hors-forfait-quelle-difference) | différence honoraires mensualisés actes hors forfait | faq-knowledge | facturation-recouvrement | 3 | planned |

### Prélèvements, encaissements et rejets (`prelevements-encaissements`)

Constituer les lots de prélèvement, détecter les rejets, proposer les échéanciers.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-11-16 | [Détecter les rejets de prélèvement et proposer un échéancier](/blog/detecter-les-rejets-de-prelevement-et-proposer-un-echeancier) | rejet de prélèvement honoraires cabinet | how-to-guide | facturation-recouvrement | 2 | planned |
| 2027-04-12 | [La checklist avant de constituer un lot de prélèvement SEPA](/blog/checklist-avant-de-constituer-un-lot-de-prelevement-sepa) | checklist lot de prélèvement SEPA cabinet comptable | listicle-checklist | facturation-recouvrement | 3 | planned |
| 2026-10-15 | [Proposer un échéancier de paiement à un client : la proposition, puis la validation](/blog/les-echeanciers-de-regularisation-qu-un-outil-ne-doit-jamais-proposer-sans-validation) | proposer un échéancier de paiement client | how-to-guide | facturation-recouvrement | 1 | planned |
| 2026-11-05 | [Codes motifs de rejet de prélèvement SEPA : les lire, puis proposer l'échéancier](/blog/qu-est-ce-qu-un-rejet-de-prelevement-et-quels-sont-ses-motifs-courants) | code motif rejet prélèvement SEPA | faq-knowledge | facturation-recouvrement | 1 | planned |

### Relances d’impayés (`relances-impayes`)

Relancer au bon stade depuis les messages types du cabinet, valider avant envoi.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-18 | [Automatiser les relances d'honoraires impayés](/blog/automatiser-les-relances-d-honoraires-impayes) | relance impayés cabinet comptable | how-to-guide | facturation-recouvrement | 3 | planned |
| 2027-04-13 | [La checklist de la cadence de relance d'un impayé](/blog/checklist-de-la-cadence-de-relance-d-un-impaye) | checklist cadence relance impayé cabinet comptable | listicle-checklist | facturation-recouvrement | 3 | planned |
| 2027-07-13 | [Les relances d'impayés qu'un cabinet arrête toujours avant l'envoi](/blog/les-relances-d-impayes-qu-un-cabinet-doit-toujours-arreter-avant-l-envoi) | arrêter une relance impayé cabinet comptable litige | how-to-guide | facturation-recouvrement | 3 | planned |
| 2027-09-28 | [À partir de quand un honoraire est-il considéré comme impayé ?](/blog/a-partir-de-quand-un-honoraire-est-il-considere-comme-impaye) | définition honoraire impayé cabinet comptable délai | faq-knowledge | facturation-recouvrement | 3 | planned |

### Temps, rentabilité et sous-facturation (`rentabilite-dossiers`)

Mesurer coût, marge et écarts de tarif par dossier, en agrégats.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-19 | [Repérer un dossier facturé sous son tarif](/blog/reperer-un-dossier-facture-sous-son-tarif) | sous-facturation cabinet expertise comptable | how-to-guide | direction-associes | 3 | planned |
| 2027-04-14 | [La checklist pour mesurer la rentabilité d'un dossier client](/blog/checklist-pour-mesurer-la-rentabilite-d-un-dossier-client) | checklist rentabilité dossier client cabinet comptable | listicle-checklist | direction-associes | 3 | planned |
| 2027-07-14 | [Écart de tarif détecté : ce qu'un outil de rentabilité ne décide jamais seul](/blog/ecart-de-tarif-detecte-ce-qu-un-outil-de-rentabilite-ne-decide-jamais-seul) | renégocier un tarif client cabinet comptable | how-to-guide | direction-associes | 3 | planned |
| 2027-09-29 | [Comment se mesure la rentabilité d'un dossier, en cabinet comptable ?](/blog/comment-se-mesure-la-rentabilite-d-un-dossier-en-cabinet-comptable) | définition rentabilité dossier cabinet comptable calcul | faq-knowledge | direction-associes | 3 | planned |

## Administration et secrétariat (`administratif-secretariat`)

### Boîte mail, tri et courriers types (`boite-mail-courriers`)

Assainir et tenir le tri par client et par priorité ; préparer les courriers types.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-20 | [Trier la boîte mail du cabinet par client et par priorité](/blog/trier-la-boite-mail-du-cabinet-par-client-et-priorite) | gestion boîte mail cabinet expertise comptable | how-to-guide | direction-associes | 3 | planned |
| 2027-04-15 | [La checklist pour assainir une boîte mail de cabinet saturée](/blog/checklist-pour-assainir-une-boite-mail-de-cabinet-saturee) | checklist assainir boîte mail cabinet comptable | listicle-checklist | administratif-secretariat | 3 | planned |
| 2027-07-15 | [Les courriers qu'un tri automatique de boîte mail ne classe jamais seul](/blog/les-courriers-qu-un-tri-automatique-de-boite-mail-ne-doit-jamais-classer-seul) | courrier sensible boîte mail cabinet comptable secret professionnel | how-to-guide | administratif-secretariat | 3 | planned |
| 2026-11-09 | [Modèles de courrier d'un cabinet comptable : les fiabiliser sans les figer](/blog/qu-est-ce-qu-un-courrier-type-et-comment-le-fiabiliser-au-cabinet) | modèle de courrier cabinet comptable | faq-knowledge | administratif-secretariat | 1 | planned |

### Entrée en relation et onboarding client (`onboarding-client`)

Collecter les pièces d’entrée, poser les jalons, préparer ce qui attend la signature.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-23 | [Automatiser l'entrée en relation d'un nouveau client](/blog/automatiser-l-entree-en-relation-d-un-nouveau-client) | onboarding client cabinet comptable | listicle-checklist | administratif-secretariat | 1 | planned |
| 2027-04-19 | [Automatiser la collecte des pièces d'entrée en relation](/blog/automatiser-la-collecte-des-pieces-d-entree-en-relation) | pièces entrée en relation client cabinet comptable | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-07-19 | [Les jalons d'un onboarding client qui attendent toujours la signature](/blog/les-jalons-d-un-onboarding-client-qui-attendent-toujours-la-signature) | onboarding client cabinet comptable signature lettre de mission | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-09-30 | [Qu'est-ce que l'entrée en relation avec un nouveau client, au cabinet ?](/blog/qu-est-ce-que-l-entree-en-relation-avec-un-nouveau-client-au-cabinet) | définition entrée en relation client cabinet comptable | faq-knowledge | administratif-secretariat | 3 | planned |

### Fin de mission et transfert de dossier (`offboarding-transfert`)

Clore une mission et transférer le dossier au confrère sans rien oublier.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-21 | [Automatiser le transfert de dossier à la fin d'une mission](/blog/automatiser-le-transfert-de-dossier-a-la-fin-d-une-mission) | transfert de dossier client cabinet comptable confrère | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-04-20 | [La checklist de fin de mission avant transfert de dossier](/blog/checklist-de-fin-de-mission-avant-transfert-de-dossier) | checklist fin de mission cabinet comptable | listicle-checklist | administratif-secretariat | 3 | planned |
| 2027-07-20 | [Ce qu'un transfert de dossier ne doit jamais oublier de signaler au confrère](/blog/ce-qu-un-transfert-de-dossier-ne-doit-jamais-oublier-de-signaler-au-confrere) | confraternité transfert dossier cabinet comptable obligation | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-10-04 | [Qu'est-ce qu'une lettre de confrère, et quand l'envoyer ?](/blog/qu-est-ce-qu-une-lettre-de-confrere-et-quand-l-envoyer) | définition lettre de confrère expert-comptable | faq-knowledge | administratif-secretariat | 3 | planned |

### Envois de plaquettes et de documents (`envois-plaquettes-documents`)

Suivre l’envoi des plaquettes, attestations et documents périodiques.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-25 | [Suivre l'envoi des plaquettes de bilan](/blog/suivre-l-envoi-des-plaquettes-de-bilan) | plaquette de bilan suivi envoi clients | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-04-21 | [La checklist de suivi de l'envoi des documents périodiques](/blog/checklist-de-suivi-de-l-envoi-des-documents-periodiques) | checklist suivi envoi documents périodiques cabinet comptable | listicle-checklist | administratif-secretariat | 3 | planned |
| 2027-07-21 | [Les plaquettes de bilan qu'un envoi automatique ne diffuse pas sans relecture](/blog/les-plaquettes-de-bilan-qu-un-envoi-automatique-ne-doit-jamais-diffuser-sans-relecture) | plaquette de bilan erreur avant envoi client | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-10-05 | [Quels documents un cabinet comptable envoie-t-il périodiquement à ses clients ?](/blog/quels-documents-un-cabinet-comptable-envoie-t-il-periodiquement-a-ses-clients) | documents périodiques cabinet comptable client liste | faq-knowledge | administratif-secretariat | 3 | planned |

### Rendez-vous et agenda du cabinet (`rendez-vous-agenda`)

Préparer les rendez-vous périodiques et leurs pièces ; tenir l’agenda partagé.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-26 | [Automatiser la préparation des rendez-vous périodiques du cabinet](/blog/automatiser-la-preparation-des-rendez-vous-periodiques-du-cabinet) | préparer un rendez-vous client cabinet comptable automatisation | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-04-22 | [La checklist avant un rendez-vous client périodique](/blog/checklist-avant-un-rendez-vous-client-periodique) | checklist préparation rendez-vous client cabinet comptable | listicle-checklist | administratif-secretariat | 3 | planned |
| 2027-07-22 | [Les rendez-vous qu'un agenda partagé ne confirme jamais seul](/blog/les-rendez-vous-qu-un-agenda-partage-ne-doit-jamais-confirmer-seul) | confirmation rendez-vous client cabinet comptable automatique | how-to-guide | administratif-secretariat | 3 | planned |
| 2027-10-06 | [Qu'est-ce qu'un agenda partagé de cabinet comptable, et à quoi sert-il ?](/blog/qu-est-ce-qu-un-agenda-partage-de-cabinet-comptable-et-a-quoi-sert-il) | définition agenda partagé cabinet comptable | faq-knowledge | administratif-secretariat | 3 | planned |

## RH et formation (`rh-formation`)

### RH interne du cabinet (`rh-interne-cabinet`)

Recrutement, arrivée d’un collaborateur, entretiens : préparer sans reconstruire.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-27 | [Automatiser la préparation de l'arrivée d'un nouveau collaborateur](/blog/automatiser-la-preparation-de-l-arrivee-d-un-nouveau-collaborateur) | arrivée nouveau collaborateur cabinet comptable checklist | how-to-guide | rh-recrutement-formation | 3 | planned |
| 2027-04-26 | [La checklist d'intégration d'un nouveau collaborateur au cabinet](/blog/checklist-d-integration-d-un-nouveau-collaborateur-au-cabinet) | checklist intégration collaborateur cabinet comptable | listicle-checklist | rh-recrutement-formation | 3 | planned |
| 2027-07-26 | [Les étapes de recrutement qu'un cabinet ne délègue jamais à un outil](/blog/les-etapes-de-recrutement-qu-un-cabinet-ne-doit-jamais-deleguer-a-un-outil) | recrutement collaborateur cabinet comptable décision humaine | how-to-guide | rh-recrutement-formation | 3 | planned |
| 2027-10-07 | [Qu'est-ce que la RH interne d'un cabinet d'expertise comptable ?](/blog/qu-est-ce-que-la-rh-interne-d-un-cabinet-d-expertise-comptable) | définition RH interne cabinet comptable | faq-knowledge | rh-recrutement-formation | 3 | planned |

### Synthèse de rémunération (`synthese-remuneration`)

Produire la synthèse annuelle d’un salarié à partir de la paie tenue.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-01-28 | [Synthèse de rémunération d'un salarié, sans la reconstruire](/blog/synthese-de-remuneration-d-un-salarie-sans-la-reconstruire) | synthèse rémunération salarié cabinet | how-to-guide | rh-recrutement-formation | 3 | planned |
| 2027-04-27 | [La checklist de contrôle d'une synthèse de rémunération avant remise](/blog/checklist-de-controle-d-une-synthese-de-remuneration-avant-remise) | checklist synthèse de rémunération salarié contrôle | listicle-checklist | rh-recrutement-formation | 3 | planned |
| 2027-07-27 | [Les éléments de rémunération qu'une synthèse automatique n'interprète pas seule](/blog/les-elements-de-remuneration-qu-une-synthese-automatique-ne-doit-pas-interpreter-seule) | synthèse rémunération avantage en nature interprétation | how-to-guide | rh-recrutement-formation | 3 | planned |
| 2027-10-11 | [Qu'est-ce qu'une synthèse de rémunération, et à qui sert-elle ?](/blog/qu-est-ce-qu-une-synthese-de-remuneration-et-a-qui-sert-elle) | définition synthèse de rémunération salarié | faq-knowledge | rh-recrutement-formation | 3 | planned |

### Formation et maîtrise de l’IA (`formation-ia-competences`)

Former l’équipe aux outils et à leurs limites ; tenir la preuve de la formation.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-01 | [Organiser la formation de l'équipe à l'IA et à ses limites](/blog/organiser-la-formation-de-l-equipe-a-l-ia-et-a-ses-limites) | former l'équipe à l'IA cabinet comptable | how-to-guide | rh-recrutement-formation | 3 | planned |
| 2027-04-28 | [La checklist pour tenir la preuve de formation à l'IA au cabinet](/blog/checklist-pour-tenir-la-preuve-de-formation-a-l-ia-au-cabinet) | preuve de formation IA obligation cabinet comptable | listicle-checklist | rh-recrutement-formation | 3 | planned |
| 2027-07-28 | [Les usages de l'IA qu'une formation doit toujours signaler comme interdits](/blog/les-usages-de-l-ia-qu-une-formation-doit-toujours-signaler-comme-interdits) | usage interdit IA cabinet comptable formation | how-to-guide | rh-recrutement-formation | 3 | planned |
| 2026-11-10 | [L'IA va-t-elle remplacer les comptables ? Ce qu'elle prend, ce qui reste](/blog/l-ia-va-t-elle-remplacer-les-comptables-ce-qu-elle-prend-ce-qui-reste) | l'ia va-t-elle remplacer les comptables | faq-knowledge | rh-recrutement-formation | 1 | planned |

## Numérique, IT et data (`numerique-it-data`)

### IA générative et agents (`ia-generative-agents`)

Ce que l’IA prépare, ce qu’elle ne décide pas ; agents, assistants, modèles locaux.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-24 | [IA et expert-comptable : ce que l'IA prépare au cabinet, ce qu'elle ne décide pas](/blog/ia-generative-au-cabinet-ce-qu-elle-prepare-ce-qu-elle-ne-decide-pas) | ia expert comptable | faq-knowledge | direction-associes | 1 | planned |
| 2026-10-06 | [Agent IA ou assistant IA : la différence pour un cabinet](/blog/agent-ia-ou-assistant-ia-la-difference-pour-un-cabinet) | agent IA cabinet comptable | faq-knowledge | numerique-it-data | 1 | planned |
| 2027-07-29 | [Automatiser une tâche avec un agent IA : la méthode en cabinet comptable](/blog/automatiser-une-tache-avec-un-agent-ia-la-methode-en-cabinet-comptable) | utiliser un agent IA cabinet comptable méthode | how-to-guide | numerique-it-data | 3 | planned |
| 2027-10-12 | [Ce qu'un agent IA ne doit jamais décider seul dans un cabinet comptable](/blog/ce-qu-un-agent-ia-ne-doit-jamais-decider-seul-dans-un-cabinet-comptable) | agent IA décision autonome cabinet comptable risque | how-to-guide | numerique-it-data | 3 | planned |

### RGPD, secret professionnel et sécurité (`rgpd-secret-securite`)

Données, sous-traitance, hébergement, accès : le cadre de toute automatisation.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-02 | [Automatiser sans exposer le secret professionnel du cabinet](/blog/automatiser-sans-exposer-le-secret-professionnel-du-cabinet) | secret professionnel automatisation cabinet comptable | how-to-guide | numerique-it-data | 3 | planned |
| 2027-04-29 | [La checklist RGPD avant de brancher un outil d'IA sur des données clients](/blog/checklist-rgpd-avant-de-brancher-un-outil-d-ia-sur-des-donnees-clients) | checklist RGPD outil IA cabinet comptable | listicle-checklist | numerique-it-data | 3 | planned |
| 2027-08-02 | [Les données qu'un cabinet ne transmet jamais à un outil d'IA grand public](/blog/les-donnees-qu-un-cabinet-ne-doit-jamais-transmettre-a-un-outil-d-ia-grand-public) | donnée client IA grand public interdiction cabinet comptable | how-to-guide | numerique-it-data | 3 | planned |
| 2027-10-13 | [RGPD et IA au cabinet : sous-traitance et secret professionnel](/blog/rgpd-et-ia-au-cabinet-sous-traitance-et-secret-professionnel) | IA RGPD cabinet expertise comptable | faq-knowledge | numerique-it-data | 3 | planned |

### Connecteurs, imports et synchronisation (`integration-connecteurs`)

Relier les logiciels par API ou par fichiers, sans ressaisie ni double écriture.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-03 | [Automatiser les échanges entre logiciels par connecteur ou par fichier](/blog/automatiser-les-echanges-entre-logiciels-par-connecteur-ou-par-fichier) | connecteur entre logiciels cabinet comptable automatisation | how-to-guide | numerique-it-data | 3 | planned |
| 2027-05-03 | [La checklist avant de brancher un connecteur entre deux logiciels](/blog/checklist-avant-de-brancher-un-connecteur-entre-deux-logiciels-du-cabinet) | checklist connecteur logiciels cabinet comptable | listicle-checklist | numerique-it-data | 3 | planned |
| 2027-08-03 | [Les échecs de synchronisation qu'un connecteur signale sans rejouer seul](/blog/les-echecs-de-synchronisation-qu-un-connecteur-doit-toujours-signaler-sans-rejouer-seul) | échec de synchronisation connecteur cabinet comptable | how-to-guide | numerique-it-data | 3 | planned |
| 2027-10-14 | [Qu'est-ce qu'un connecteur entre logiciels, et quand s'en passer ?](/blog/qu-est-ce-qu-un-connecteur-entre-logiciels-et-quand-s-en-passer) | définition connecteur logiciel cabinet comptable | faq-knowledge | numerique-it-data | 3 | planned |
| 2026-10-03 | [L'outil qui ne se chargeait jamais, et pourquoi je ne promets plus « sans installation »](/blog/l-outil-qui-ne-se-chargeait-jamais) | pourquoi une installation logicielle echoue en cabinet | thought-leadership | numerique-it-data | 3 | planned |

### AI Act et conformité des outils (`ai-act-conformite`)

Les obligations qui s’appliquent à un cabinet utilisateur d’IA, datées et sourcées.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-04 | [Mettre un cabinet comptable en conformité avec l'AI Act](/blog/mettre-un-cabinet-comptable-en-conformite-avec-l-ai-act) | mise en conformité AI Act cabinet comptable | how-to-guide | numerique-it-data | 3 | planned |
| 2027-05-04 | [La checklist de conformité AI Act pour un petit cabinet comptable](/blog/checklist-de-conformite-ai-act-pour-un-petit-cabinet-comptable) | checklist AI Act cabinet comptable | listicle-checklist | numerique-it-data | 3 | planned |
| 2027-08-04 | [Quels usages de l'IA l'AI Act interdit-il à un cabinet comptable ?](/blog/quels-usages-de-l-ia-l-ai-act-interdit-il-a-un-cabinet-comptable) | usages interdits IA AI Act entreprise | how-to-guide | numerique-it-data | 3 | planned |
| 2027-10-18 | [AI Act : ce qu'un cabinet de dix personnes doit faire](/blog/ai-act-ce-qu-un-cabinet-de-dix-personnes-doit-faire) | AI Act cabinet comptable obligations | faq-knowledge | numerique-it-data | 3 | planned |

## Excel et outils existants (`excel-outils-existants`)

### Classeurs de suivi Excel (`excel-classeurs-suivi`)

Structurer et entretenir un classeur de suivi partagé : dictionnaire, états, contrôles.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-08 | [Structurer un classeur de suivi Excel partagé par tout le cabinet](/blog/structurer-un-classeur-de-suivi-excel-partage-par-tout-le-cabinet) | structurer classeur de suivi Excel cabinet comptable | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-05-05 | [La checklist pour vérifier un classeur de suivi Excel avant de le partager](/blog/checklist-pour-verifier-un-classeur-de-suivi-excel-avant-de-le-partager) | checklist classeur Excel cabinet comptable avant partage | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-08-05 | [Les modifications de classeur Excel qu'il ne faut jamais faire sans verrou](/blog/les-modifications-de-classeur-excel-qu-il-ne-faut-jamais-faire-sans-verrou) | insertion de colonne classeur Excel risque cabinet comptable | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-10-19 | [Ce qu'Excel tient, et ce qu'il ne tient plus](/blog/ce-qu-excel-tient-et-ce-qu-il-ne-tient-plus) | limites Excel cabinet comptable | faq-knowledge | direction-associes | 3 | planned |

### Compléments greffés sur Excel (`complements-excel`)

Automatiser dans le classeur existant par un complément, sans macro ni migration.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-09 | [Automatiser sans changer de logiciel](/blog/automatiser-sans-changer-de-logiciel) | automatiser cabinet comptable sans changer de logiciel | how-to-guide | direction-associes | 3 | planned |
| 2027-05-06 | [La checklist avant d'installer un complément Office.js sur un classeur](/blog/checklist-avant-d-installer-un-complement-office-js-sur-un-classeur) | checklist complément Excel cabinet comptable avant installation | listicle-checklist | collaborateurs-comptables | 3 | planned |
| 2027-08-09 | [Ce qu'un complément Excel ne doit jamais écrire sans validation](/blog/ce-qu-un-complement-excel-ne-doit-jamais-ecrire-sans-validation) | complément Excel écriture automatique risque cabinet | how-to-guide | collaborateurs-comptables | 3 | planned |
| 2027-10-20 | [Qu'est-ce qu'un complément Excel greffé sur un classeur existant ?](/blog/qu-est-ce-qu-un-complement-excel-greffe-sur-un-classeur-existant) | définition complément Excel classeur existant | faq-knowledge | direction-associes | 3 | planned |

### Exports et imports des logiciels (`exports-imports-logiciels`)

Importer un export logiciel sans ressaisie, contrôler son schéma, rejouer sans doublon.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-10 | [Importer un export logiciel dans Excel sans ressaisie](/blog/importer-un-export-logiciel-dans-excel-sans-ressaisie) | import export logiciel comptable Excel | how-to-guide | assistants-comptables | 3 | planned |
| 2027-05-10 | [La checklist avant d'importer un export logiciel dans Excel](/blog/checklist-avant-d-importer-un-export-logiciel-dans-excel) | checklist import export logiciel Excel cabinet comptable | listicle-checklist | assistants-comptables | 3 | planned |
| 2027-08-10 | [Les imports d'export logiciel qui doivent toujours être rejoués sans créer de doublon](/blog/les-imports-d-export-logiciel-qui-doivent-toujours-etre-rejoues-sans-creer-de-doublon) | import logiciel idempotent sans doublon cabinet comptable | how-to-guide | assistants-comptables | 3 | planned |
| 2027-10-21 | [Qu'est-ce qu'un export logiciel, et comment vérifier son schéma avant import ?](/blog/qu-est-ce-qu-un-export-logiciel-et-comment-verifier-son-schema-avant-import) | définition export logiciel schéma de colonnes | faq-knowledge | assistants-comptables | 3 | planned |

## Méthode et décision humaine (`methode-decision-humaine`)

### Choisir et cadrer une automatisation (`choisir-cadrer`)

Qualifier les tâches candidates, choisir la première, écrire le cadre.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-05-11 | [Choisir la première tâche à automatiser](/blog/choisir-la-premiere-tache-a-automatiser) | quelle tâche automatiser cabinet comptable | how-to-guide | direction-associes | 3 | planned |
| 2027-08-11 | [Les signaux qui disent qu'une tâche n'est pas prête à être automatisée](/blog/les-signaux-qui-disent-qu-une-tache-n-est-pas-prete-a-etre-automatisee) | quand ne pas automatiser une tâche cabinet comptable | listicle-checklist | direction-associes | 3 | planned |
| 2027-10-25 | [Qu'est-ce qu'une tâche répétitive automatisable, dans un cabinet comptable ?](/blog/qu-est-ce-qu-une-tache-repetitive-automatisable-dans-un-cabinet-comptable) | définition tâche automatisable cabinet comptable | faq-knowledge | direction-associes | 3 | planned |
| 2026-09-19 | [Pourquoi un cabinet n’adopte pas un outil : la leçon de mon échec](/blog/la-plateforme-que-personne-n-a-achetee) | pourquoi les cabinets comptables n'adoptent pas les nouveaux outils | thought-leadership | direction-associes | 3 | published |

### Règle, jeu d’essai et recette (`regle-jeu-essai-recette`)

Écrire la règle dans les mots du cabinet, la rejouer sur un jeu fictif, la recetter.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2026-09-28 | [Manuel de procédures d'un cabinet d'expertise comptable : écrire les règles qui tournent](/blog/manuel-de-procedures-cabinet-expertise-comptable-ecrire-les-regles-qui-tournent) | manuel de procédures cabinet expertise comptable | how-to-guide | direction-associes | 1 | planned |
| 2027-05-12 | [La checklist de recette avant de mettre en service une automatisation](/blog/checklist-de-recette-avant-de-mettre-en-service-une-automatisation) | checklist recette automatisation cabinet comptable | listicle-checklist | direction-associes | 3 | planned |
| 2027-08-12 | [Les cas qu'un jeu d'essai doit toujours inclure avant la recette](/blog/les-cas-qu-un-jeu-d-essai-doit-toujours-inclure-avant-la-recette) | jeu d'essai cas limite cas de refus automatisation | how-to-guide | direction-associes | 3 | planned |
| 2026-11-25 | [Qu'est-ce qu'un manuel de procédures comptables, et que doit-il contenir ?](/blog/qu-est-ce-qu-un-manuel-de-procedures-comptables-et-que-doit-il-contenir) | qu'est-ce qu'un manuel de procédures comptables | faq-knowledge | direction-associes | 2 | planned |
| 2026-09-26 | [Trois défauts que des tests verts n'ont pas vus, et la règle des trois passes](/blog/trois-bugs-que-des-tests-verts-n-ont-pas-vus) | pourquoi des tests qui passent ne prouvent rien | thought-leadership | direction-associes | 3 | planned |

### Validation humaine et cas de refus (`validation-humaine-refus`)

Où va la validation, ce que l’outil refuse, comment les exceptions remontent.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-11 | [Organiser la validation humaine d'une automatisation au cabinet](/blog/organiser-la-validation-humaine-d-une-automatisation-au-cabinet) | validation humaine automatisation cabinet comptable | how-to-guide | direction-associes | 3 | planned |
| 2027-05-13 | [La checklist pour savoir si une exception doit remonter à un humain](/blog/checklist-pour-savoir-si-une-exception-doit-remonter-a-un-humain) | checklist exception automatisation cabinet comptable | listicle-checklist | direction-associes | 3 | planned |
| 2027-08-16 | [Les décisions qu'une automatisation ne prend jamais à la place de l'expert-comptable](/blog/les-decisions-qu-une-automatisation-ne-doit-jamais-prendre-a-la-place-de-l-expert-comptable) | jugement professionnel expert-comptable automatisation limite | how-to-guide | direction-associes | 3 | planned |
| 2027-10-26 | [Ce qu'il ne faut pas automatiser dans un cabinet](/blog/ce-qu-il-ne-faut-pas-automatiser-dans-un-cabinet) | tâches à ne pas automatiser cabinet comptable | faq-knowledge | direction-associes | 3 | planned |

### Mesurer le temps gagné (`mesure-roi`)

Mesurer avant et après sur un jeu fictif ; ne pas reprendre de chiffre non mesuré.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-15 | [Mesurer le temps réellement gagné par une automatisation](/blog/mesurer-le-temps-reellement-gagne-par-une-automatisation) | ROI automatisation cabinet comptable | how-to-guide | direction-associes | 3 | planned |
| 2027-05-17 | [La checklist du protocole de mesure avant-après une automatisation](/blog/checklist-du-protocole-de-mesure-avant-apres-une-automatisation) | checklist mesure avant après automatisation cabinet comptable | listicle-checklist | direction-associes | 3 | planned |
| 2027-08-17 | [Ce qu'un gain de temps mesuré ne doit jamais généraliser sans le dire](/blog/ce-qu-un-gain-de-temps-mesure-ne-doit-jamais-generaliser-sans-le-dire) | chiffre de gain de temps automatisation fiable | how-to-guide | direction-associes | 3 | planned |
| 2027-10-27 | [Qu'est-ce qu'un gain de temps mesuré, en automatisation de cabinet ?](/blog/qu-est-ce-qu-un-gain-de-temps-mesure-en-automatisation-de-cabinet) | définition gain de temps mesuré automatisation | faq-knowledge | direction-associes | 3 | planned |

## Conseil et missions spéciales (`conseil-missions`)

### Prévisionnel et business plan (`previsionnel-business-plan`)

Produire un prévisionnel à partir des données tenues, avec hypothèses tracées.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-16 | [Automatiser la production d'un prévisionnel à partir des données tenues](/blog/automatiser-la-production-d-un-previsionnel-a-partir-des-donnees-tenues) | automatiser prévisionnel financier cabinet comptable | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-05-18 | [La checklist de contrôle d'un prévisionnel avant remise au client](/blog/checklist-de-controle-d-un-previsionnel-avant-remise-au-client) | checklist prévisionnel financier avant remise client | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-08-18 | [Les hypothèses de prévisionnel qu'un générateur automatique ne fixe jamais seul](/blog/les-hypotheses-de-previsionnel-qu-un-generateur-automatique-ne-doit-jamais-fixer-seul) | hypothèses prévisionnel financier décision cabinet | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2026-11-11 | [Compte de résultat prévisionnel : définition, hypothèses, et ce que le cabinet valide](/blog/qu-est-ce-qu-un-previsionnel-financier-et-quelles-hypotheses-le-composent) | compte de résultat prévisionnel définition | faq-knowledge | chefs-mission-portefeuille | 1 | planned |

### Trésorerie prévisionnelle (`tresorerie-previsionnelle`)

Projeter la trésorerie d’un client depuis les échéances connues, signaler les tensions.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-17 | [Automatiser la projection de trésorerie d'un client depuis ses échéances](/blog/automatiser-la-projection-de-tresorerie-d-un-client-depuis-ses-echeances) | automatiser trésorerie prévisionnelle cabinet comptable | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-05-19 | [La checklist avant de présenter une trésorerie prévisionnelle au client](/blog/checklist-avant-de-presenter-une-tresorerie-previsionnelle-au-client) | checklist trésorerie prévisionnelle avant présentation client | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-08-19 | [Tension de trésorerie détectée : ce qu'un outil de projection ne décide jamais seul](/blog/tension-de-tresorerie-detectee-ce-qu-un-outil-de-projection-ne-decide-jamais-seul) | tension de trésorerie client cabinet comptable action | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-10-28 | [Qu'est-ce qu'une trésorerie prévisionnelle, et comment se construit-elle ?](/blog/qu-est-ce-qu-une-tresorerie-previsionnelle-et-comment-elle-se-construit) | définition trésorerie prévisionnelle construction | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Financement et aides (`financement-aides`)

Constituer les dossiers de financement et d’aides à partir du dossier permanent.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-18 | [Automatiser la constitution des dossiers de financement et d'aides](/blog/automatiser-la-constitution-des-dossiers-de-financement-et-d-aides) | automatiser dossier de financement entreprise cabinet comptable | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-05-20 | [La checklist des pièces d'un dossier de financement avant dépôt](/blog/checklist-des-pieces-d-un-dossier-de-financement-avant-depot) | checklist pièces dossier de financement entreprise | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-08-23 | [Les dossiers de financement qu'un cabinet ne dépose jamais sans relecture de l'associé](/blog/les-dossiers-de-financement-qu-un-cabinet-ne-doit-jamais-deposer-sans-relecture-de-l-associe) | relecture dossier de financement avant dépôt cabinet | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-11-01 | [Quelles aides un cabinet comptable aide-t-il à mobiliser pour ses clients ?](/blog/quelles-aides-un-cabinet-comptable-aide-t-il-a-mobiliser-pour-ses-clients) | aides entreprise cabinet comptable accompagnement | faq-knowledge | chefs-mission-portefeuille | 3 | planned |

### Évaluation et transmission (`evaluation-transmission`)

Préparer les éléments chiffrés d’une évaluation ou d’une transmission.

| Date | Article | Requête primaire | Format | Rôle | P | Statut |
|---|---|---|---|---|---|---|
| 2027-02-22 | [Automatiser la préparation des éléments chiffrés d'une évaluation d'entreprise](/blog/automatiser-la-preparation-des-elements-chiffres-d-une-evaluation-d-entreprise) | automatiser évaluation d'entreprise cabinet comptable | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2027-05-24 | [La checklist des éléments chiffrés à réunir avant une évaluation d'entreprise](/blog/checklist-des-elements-chiffres-a-reunir-avant-une-evaluation-d-entreprise) | checklist éléments chiffrés évaluation entreprise | listicle-checklist | chefs-mission-portefeuille | 3 | planned |
| 2027-08-24 | [La méthode d'évaluation qu'un outil ne choisit jamais seul](/blog/la-methode-d-evaluation-qu-un-outil-ne-doit-jamais-choisir-seul) | choix de la méthode d'évaluation entreprise décision | how-to-guide | chefs-mission-portefeuille | 3 | planned |
| 2026-11-26 | [Quelles sont les méthodes d'évaluation d'une entreprise en transmission ?](/blog/quelles-sont-les-methodes-d-evaluation-d-une-entreprise-en-transmission) | définition méthodes évaluation entreprise transmission | faq-knowledge | chefs-mission-portefeuille | 2 | planned |

## Règles de maillage vérifiées

- chaque satellite renvoie au pilier et le pilier renvoie à chaque satellite ;
- deux liens cycliques entre les quatre angles d’une famille ;
- au moins trois liens entrants par article, aucune orpheline ;
- une requête primaire par article, unique sur tout le site.

