# Calendrier éditorial v3 — 36 articles, 12 mois, quatre vagues

16 septembre 2026. Période : octobre 2026 (M1) à septembre 2027 (M12). Cadence : 2 articles en M1 (le pilier compte), 4 en M3 pour rattraper, 3 les autres mois : 36 en douze mois. Chaque ligne est un brief à écrire, pas un article promis : la SERP est relue le jour du brief, les sources datées le jour de la rédaction, et un article qui n'atteint pas le seuil qualité du pipeline attend le mois suivant.

Règles de portefeuille : au plus trois clusters actifs simultanément ; un cluster n'ouvre sa deuxième vague que si sa première a des impressions Search Console ; les familles observées sur le terrain (facturation-recouvrement, administratif-secretariat) passent avant les familles supposées. Formats : `how-to-guide` par défaut, `pillar-page` pour le pilier, `faq-knowledge` pour les définitions, `listicle-checklist` pour les checklists.

## Vague 1 — M1 à M3 (octobre à décembre 2026) : le pilier et les familles observées

| # | Mois | Slug (sous /blog/) | Requête primaire | Cluster | Rôle principal | Format | Preuve et sources à vérifier | Pourquoi maintenant |
|---|---|---|---|---|---|---|---|---|
| 1 | M1 | automatiser-un-cabinet-comptable-la-carte-des-taches | automatisation cabinet comptable | methode-decision-humaine | direction-associes | pillar-page | carte des onze familles ; page service ; sources par famille | seule requête de catégorie chiffrée ; hub de tout le maillage |
| 2 | M1 | automatiser-la-relance-des-pieces-clients | relance pièces manquantes cabinet comptable | production-comptable | collaborateurs-comptables | how-to-guide | checklist conditionnelle fictive, contrôle de complétude, cadence qui s'arrête à réception ; secret professionnel (OEC) | l'exemple de Kevin ; sujet le plus cité par les concurrents, méthode jamais livrée |
| 3 | M2 | controler-la-completude-d-un-dossier-client | pièces manquantes dossier comptable checklist | production-comptable | assistants-comptables | listicle-checklist | checklist par régime fiscal et par période, jeu fictif ; règle « attendu / reçu / lisible » | l'objet que la requête réclame ; satellite naturel du n° 2 |
| 4 | M2 | automatiser-les-relances-d-honoraires-impayes | relance impayés cabinet comptable | facturation-recouvrement | facturation-recouvrement | how-to-guide | messages types, cadence, arrêt à règlement, historique par client ; besoins BES-ASS-014/015 (non nominatifs) | terrain observé ; rien ne part sans validation |
| 5 | M2 | trier-la-boite-mail-du-cabinet-par-client-et-priorite | gestion boîte mail cabinet expertise comptable | administratif-secretariat | direction-associes | how-to-guide | règles de tri, assainir l'existant, ce qui ne se trie pas seul ; CNIL (courriel professionnel), secret professionnel | BES-EXC-020/021 ; module 5 en préparation, sans le promettre |
| 6 | M3 | choisir-la-premiere-tache-a-automatiser | quelle tâche automatiser cabinet comptable | methode-decision-humaine | direction-associes | how-to-guide | grille répétitivité / règle écrite / exceptions / volume ; le déterminisme décide | prévu en v2 ; alimente le pilier |
| 7 | M3 | ia-generative-au-cabinet-ce-qu-elle-prepare-ce-qu-elle-ne-decide-pas | IA cabinet expertise comptable | numerique-it-data | direction-associes | faq-knowledge | définitions CNIL (IA générative, LLM, hallucination), tableau prépare / valide / humain ; règlement (UE) 2024/1689 | la SERP est générique ; l'angle limites est libre |
| 8 | M3 | automatiser-sans-changer-de-logiciel | automatiser cabinet comptable sans changer de logiciel | excel-outils-existants | direction-associes | how-to-guide | les trois voies (export/import, complément, connecteur) sur un classeur fictif ; éviter la SERP VBA | notre positionnement ; BES-ASS-027 |
| 9 | M3 | detecter-les-rejets-de-prelevement-et-proposer-un-echeancier | rejet de prélèvement honoraires cabinet | facturation-recouvrement | facturation-recouvrement | how-to-guide | codes motifs de rejet (Banque de France / CFONB, à relever), échéancier proposé puis validé ; BES-ASS-012/016 | terrain observé ; personne ne l'écrit |

## Vague 2 — M4 à M6 (janvier à mars 2027) : production comptable et échéances

| # | Mois | Slug | Requête primaire | Cluster | Rôle | Format | Preuve et sources | Pourquoi |
|---|---|---|---|---|---|---|---|---|
| 10 | M4 | automatiser-la-saisie-comptable-ce-qui-reste-a-verifier | automatisation saisie comptable OCR | production-comptable | collaborateurs-comptables | how-to-guide | reliquat d'exceptions sur jeu fictif, file d'anomalies ; éditeurs cités pour leurs propres fonctions | requête la plus disputée ; l'angle « ce qui reste » est libre |
| 11 | M4 | lettrage-automatique-regles-et-cas-de-refus | lettrage automatique comptable | production-comptable | collaborateurs-comptables | how-to-guide | règles de lettrage écrites (montant, référence, tolérance), cas de refus ; PCG (ANC) pour la définition | terme déjà au glossaire |
| 12 | M4 | suivre-les-echeances-fiscales-d-un-portefeuille | suivi échéances fiscales cabinet comptable | portefeuille-echeances | chefs-mission-portefeuille | how-to-guide | statut par dossier et par échéance, agrégé ; calendrier impots.gouv.fr daté ; BES-ASS-013 | ouverture du cluster 4 |
| 13 | M5 | rapprochement-bancaire-automatise-les-ecarts-a-remonter | rapprochement bancaire automatique | production-comptable | collaborateurs-comptables | how-to-guide | clé de rapprochement, écarts typés, jeu fictif | terme déjà au glossaire |
| 14 | M5 | facture-electronique-ce-que-change-la-collecte-des-pieces | facture électronique cabinet comptable collecte | production-comptable | chefs-mission-portefeuille | faq-knowledge | **dates et dénominations relevées sur impots.gouv.fr le jour de la rédaction** ; effet sur la relance de pièces | vague réglementaire en cours ; fact-check obligatoire |
| 15 | M5 | suivre-le-renouvellement-des-lettres-de-mission | lettre de mission renouvellement suivi | administratif-secretariat | administratif-secretariat | how-to-guide | code de déontologie (décret 2012-432, à relever), échéancier par dossier ; BES-ASS-017 | terrain observé |
| 16 | M6 | automatiser-l-entree-en-relation-d-un-nouveau-client | onboarding client cabinet comptable | administratif-secretariat | administratif-secretariat | listicle-checklist | pièces d'entrée, jalons, ce qui attend la signature ; anti-blanchiment (LCB-FT) cité avec source OEC/Tracfin, à relever | FlowZero y promet 8 h ; on y met la checklist |
| 17 | M6 | agent-ia-ou-assistant-ia-la-difference-pour-un-cabinet | agent IA cabinet comptable | numerique-it-data | numerique-it-data | faq-knowledge | définitions sourcées, autonomie bornée, exemples fictifs de tâche ; RAG | vocabulaire du glossaire vague 2 |
| 18 | M6 | ne-pas-facturer-deux-fois-un-acte-hors-forfait | facturation actes hors forfait cabinet comptable | facturation-recouvrement | facturation-recouvrement | how-to-guide | règle d'unicité, idempotence, jeu fictif ; BES-ASS-004/005 | terrain observé |

## Vague 3 — M7 à M9 (avril à juin 2027) : pilotage, révision, fiscal, paie

| # | Mois | Slug | Requête primaire | Cluster | Rôle | Format | Preuve et sources | Pourquoi |
|---|---|---|---|---|---|---|---|---|
| 19 | M7 | tableau-de-bord-de-production-sans-classer-les-personnes | tableau de bord cabinet comptable suivi dossiers | portefeuille-echeances | direction-associes | how-to-guide | agrégats non nominatifs, seuils d'alerte ; CNIL (surveillance des salariés) | anti-surveillance, terrain libre |
| 20 | M7 | automatiser-les-controles-repetitifs-de-la-revision-par-cycles | révision comptable par cycles contrôles | production-comptable | chefs-mission-portefeuille | listicle-checklist | checklist datée par cycle, N/N-1 sur jeu fictif ; NP 2300 ou norme OEC applicable, à relever | format libre sur la SERP |
| 21 | M7 | preparer-la-tva-les-controles-avant-declaration | contrôle TVA avant déclaration cabinet | juridique-fiscal | juridique-fiscal | how-to-guide | contrôles de cohérence (CA3), BOFiP daté ; **fact-check** | ouverture du cluster 9 |
| 22 | M8 | collecter-les-variables-de-paie-sans-relancer-a-la-main | collecte variables de paie clients cabinet | paie-social | paie-responsables-sociaux | how-to-guide | formulaire de variables fictif, relance qui s'arrête, contrôle avant bulletin ; relie aux trois articles publiés | prolonge le cluster livré |
| 23 | M8 | ce-qu-un-jeu-d-essai-fictif-prouve-et-ne-prouve-pas | jeu de test automatisation comptable | methode-decision-humaine | direction-associes | faq-knowledge | cas courant / limite / refus ; CNIL (anonymisation vs fictif) | prévu en v2 |
| 24 | M8 | reperer-un-dossier-facture-sous-son-tarif | sous-facturation cabinet expertise comptable | facturation-recouvrement | direction-associes | how-to-guide | écart tarif affiché / encaissé, seuil, agrégé ; BES-EXC-012/017 ; Liberall cité comme usage | terrain observé |
| 25 | M9 | importer-un-export-logiciel-dans-excel-sans-ressaisie | import export logiciel comptable Excel | excel-outils-existants | assistants-comptables | how-to-guide | schéma de colonnes vérifié, idempotence, jeu fictif ; BES-ASS-001 | terrain observé |
| 26 | M9 | rgpd-et-ia-au-cabinet-sous-traitance-et-secret-professionnel | IA RGPD cabinet expertise comptable | numerique-it-data | direction-associes | faq-knowledge | CNIL (sous-traitant, transferts, IA), code de déontologie (secret) | acheteur prudent |
| 27 | M9 | suivre-l-envoi-des-plaquettes-de-bilan | plaquette de bilan suivi envoi clients | administratif-secretariat | administratif-secretariat | how-to-guide | jalons par dossier, agrégé ; BES-ASS-018 | terrain observé |

## Vague 4 — M10 à M12 (juillet à septembre 2027) : clôture, cadre, limites

| # | Mois | Slug | Requête primaire | Cluster | Rôle | Format | Preuve et sources | Pourquoi |
|---|---|---|---|---|---|---|---|---|
| 28 | M10 | cloture-annuelle-automatiser-les-controles-repetitifs | clôture comptable cabinet automatisation | production-comptable | chefs-mission-portefeuille | listicle-checklist | checklist de clôture fictive, ce qui reste au réviseur | saison de clôture |
| 29 | M10 | notes-de-frais-clients-traiter-sans-ressaisie | notes de frais cabinet comptable automatisation | production-comptable | assistants-comptables | how-to-guide | OCR, extraction, exceptions ; Urssaf (frais professionnels) daté | FlowZero y est ; on y met le reliquat |
| 30 | M10 | ai-act-ce-qu-un-cabinet-de-dix-personnes-doit-faire | AI Act cabinet comptable obligations | numerique-it-data | direction-associes | faq-knowledge | **EUR-Lex relu le jour de la rédaction**, articles 4 et 14 ; aucune date reprise d'un billet | fact-check obligatoire |
| 31 | M11 | approbation-des-comptes-preparer-le-secretariat-juridique-annuel | approbation des comptes AG cabinet automatisation | juridique-fiscal | juridique-fiscal | how-to-guide | jalons légaux (Code de commerce, à relever), documents types, ce qui attend la signature | saison des AG |
| 32 | M11 | mesurer-le-temps-reellement-gagne-par-une-automatisation | ROI automatisation cabinet comptable | methode-decision-humaine | direction-associes | how-to-guide | protocole avant/après sur jeu fictif, ce qu'on ne mesure pas ; contre les chiffres non sourcés | réponse aux promesses concurrentes |
| 33 | M11 | ce-qu-il-ne-faut-pas-automatiser-dans-un-cabinet | tâches à ne pas automatiser cabinet comptable | methode-decision-humaine | direction-associes | faq-knowledge | jugement professionnel, cas de refus, supervision humaine (AI Act art. 14) | angle libre, différenciant |
| 34 | M12 | suivre-la-liasse-edi-tdfc-et-ses-rejets | liasse EDI TDFC rejet suivi | portefeuille-echeances | chefs-mission-portefeuille | how-to-guide | statuts de télétransmission, rejets typés ; DGFiP / jedeclare cités pour leurs propres codes, à relever ; BES-ASS-020 | terrain observé |
| 35 | M12 | synthese-de-remuneration-d-un-salarie-sans-la-reconstruire | synthèse rémunération salarié cabinet | rh-formation | rh-recrutement-formation | how-to-guide | jeu fictif du module 6, ce qui attend la validation RH ; Urssaf | module livré (JF) |
| 36 | M12 | ce-qu-excel-tient-et-ce-qu-il-ne-tient-plus | limites Excel cabinet comptable | excel-outils-existants | direction-associes | faq-knowledge | tableau à deux colonnes, seuils mesurés sur jeu fictif ; Microsoft (limites documentées) | prévu en v2 |

## Maintenance des trois articles publiés

| Article | Action v3 | Quand |
|---|---|---|
| controler-les-bulletins-de-paie-avant-la-dsn | une ligne vers le pilier ; relecture des faits 2026 ; réadoption du dossier scellé | M1, puis trimestrielle |
| suivre-la-production-sociale-dans-excel | une ligne vers le pilier et vers le n° 19 | M1, M7 |
| comprendre-les-comptes-rendus-metier-dsn | une ligne vers le pilier ; relecture Net-entreprises | M1, puis trimestrielle |

## Conditions avant toute rédaction

Brief validé par Kevin ; SERP France/fr relue le jour même (desktop et mobile) ; page existante la plus proche identifiée et raison de ne pas la mettre à jour écrite ; sources primaires avec date d'accès ; exemple fictif ; frontière d'automatisation ; deux liens entrants prévus ; requête primaire absente de `cluster-plan.json`.
