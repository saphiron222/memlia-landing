# Brief éditorial — Automatiser la relance des pièces clients

Statut : a-prioriser
Décideur : Kevin
Action : création
Slug : `automatiser-la-relance-des-pieces-clients`
Date : 2026-09-16

## Lecteur et tâche

- Rôle principal : collaborateurs-comptables (secondaires : assistants-comptables, chefs-mission-portefeuille).
- Preuve du rôle, source et date : indirecte ; le référentiel des besoins ne documente pas encore le pôle comptable (le module 4 flux compta en approche le terrain). Hypothèse à confirmer au premier rendez-vous d'un cabinet sur ce sujet.
- Déclencheur : chaque mois, la période ne peut pas être tenue parce que des pièces manquent, et le collaborateur relance à la main, client par client, sans savoir qui a déjà été relancé.
- Tâche : obtenir les pièces manquantes d'un dossier sans relancer à la main, sans relancer deux fois, et en s'arrêtant à réception.
- Résultat utile : une méthode en trois briques rejouable dans le classeur et la messagerie du cabinet, et le tableau de ce qui reste humain.

## Intention et SERP

- Requête primaire : relance pièces manquantes cabinet comptable (volume ND).
- Fan-out : collecte de pièces comptables automatisée ; relance documents clients expert-comptable ; pièces manquantes dossier comptable checklist (article n° 3, requête distincte).
- SERP France/fr desktop et mobile, date/heure : relevé WebSearch 16/09/2026 (Everial, TaxDome, IT Systèmes, Hexagone Stratégie, FlowZero, Queoval, AzenFlow, Clotilde, Dext, Relancio, Relcompta) ; à refaire le jour du brief.
- Types, formats, sources, fraîcheur, PAA et surfaces visibles : pages fonctionnalités et articles « pourquoi automatiser », promesses chiffrées non sourcées ; aucune page ne livre la méthode (checklist conditionnelle, contrôle de complétude, cadence qui s'arrête).
- Rankability : plausible (terrain occupé par des promesses, pas par des méthodes).
- Business relevance : directe (la règle de relance est exactement ce que Memlia code dans le classeur du cabinet).

## Preuve et vérité

- Information gain : les trois briques écrites comme des règles (déclencheur, condition, action, exception) ; le calendrier de relance en paramètres choisis par le cabinet (aucune valeur présentée comme norme) ; le bloc « ce que la relance ne fait jamais seule ».
- Preuve distinctive : un jeu fictif de six dossiers (régimes et périodicités différents) avec la checklist conditionnelle, l'état « attendu / reçu / lisible », et le journal des relances ; le tableau « se prépare seul / attend une validation / reste humain ».
- Cas courant / limite / refus : courant = pièce attendue non reçue à J+n, relance préparée, validée, envoyée ; limite = pièce reçue mais illisible ou hors période (relance ciblée, pas générique) ; refus = client en litige ou dossier signalé : aucune relance automatique, remontée à un humain.
- Sources officielles : secret professionnel de l'expert-comptable (ordonnance n° 45-2138, article 21 ; Code pénal, article 226-13 ; à relever avec date) ; CNIL, minimisation et durée de conservation des courriels ; aucune statistique de gain.
- Relecteur métier : revue métier IA ; aucune attestation professionnelle revendiquée.

## Structure et maillage

- Plan H1/H2/H3 : H1 le titre ; H2 « Réponse directe » ; H2 « Pourquoi la relance manuelle casse » (H3 on ne sait pas qui a été relancé, on relance ce qui est déjà reçu) ; H2 « Brique 1 : la checklist conditionnelle par dossier » ; H2 « Brique 2 : le contrôle de complétude » (attendu / reçu / lisible) ; H2 « Brique 3 : la cadence qui s'arrête à réception » ; H2 « La règle dans les mots du cabinet » (tableau déclencheur / condition / action / exception) ; H2 « Ce que l'outil refuse et pourquoi » ; H2 « Ce qui s'automatise, ce qui attend une validation, ce qui reste humain » ; H2 « Le jeu fictif » ; H2 « Sources ».
- Liens sortants : pilier (obligatoire), n° 3 complétude, n° 10 saisie (à sa publication), n° 4 relances d'honoraires (inter-familles, 1 seul), glossaire : Relance de pièces, Déclencheur, Exception, Pré-comptabilité.
- Deux liens entrants : pilier ; n° 5 boîte mail et n° 6 choisir la première tâche (inter-familles).
- Risque de cannibalisation : avec n° 3 (« pièces manquantes dossier comptable checklist ») : n° 2 vise la relance (le flux), n° 3 vise l'objet (la checklist) ; requêtes distinctes, chacun renvoie à l'autre.

## CTA et maintenance

- CTA, destination et résultat : « Coder la règle de relance de votre cabinet » → `/contact` → demande décrivant la cadence et les exceptions actuelles du cabinet.
- Déclencheur de révision : publication du n° 3 et du n° 14 (facture électronique, qui change les pièces attendues) ; relecture des sources à six mois.
- Décision attendue de Kevin : valider comme premier satellite de la v3 (avec le pilier, M1).
