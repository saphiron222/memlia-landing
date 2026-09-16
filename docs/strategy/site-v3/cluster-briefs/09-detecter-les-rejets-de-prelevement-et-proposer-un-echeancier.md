# Brief éditorial — Détecter les rejets de prélèvement et proposer un échéancier

Statut : a-prioriser
Décideur : Kevin
Action : création
Slug : `detecter-les-rejets-de-prelevement-et-proposer-un-echeancier`
Date : 2026-09-16

## Lecteur et tâche

- Rôle principal : facturation-recouvrement (secondaires : administratif-secretariat, direction-associes).
- Preuve du rôle, source et date : **observée** — référentiel des besoins, poste « assistante du cabinet », BES-ASS-010 (constituer le lot de prélèvement), BES-ASS-012 (détecter les rejets), BES-ASS-016 (proposer un échéancier de rattrapage après plusieurs rejets), HYP-ASS-002 (l'outil propose, elle ajuste), HYP-ASS-003 (suivi du respect des échéanciers), 2026-08.
- Déclencheur : le retour de banque après le prélèvement mensuel contient des rejets ; ils sont repérés à l'œil, parfois tard, et le rattrapage se calcule à la main.
- Tâche : détecter chaque rejet à réception du retour, le qualifier par son motif, et proposer un échéancier de rattrapage que l'assistante ajuste et valide.
- Résultat utile : la règle de détection (retour de banque → dossier → motif), la règle d'échéancier (paramètres du cabinet), le suivi du respect de l'échéancier, et ce qui reste humain.

## Intention et SERP

- Requête primaire : rejet de prélèvement honoraires cabinet (volume ND).
- Fan-out : rejet prélèvement SEPA motif ; échéancier de rattrapage honoraires ; prélèvement rejeté que faire cabinet comptable.
- SERP France/fr desktop et mobile, date/heure : à relever le jour du brief ; attendu : pages bancaires et éditeurs de paiement (motifs de rejet, B2C et PME), rien vu du cabinet.
- Types, formats, sources, fraîcheur, PAA et surfaces visibles : listes de codes motifs, FAQ bancaires ; aucun article qui relie le rejet au dossier client du cabinet et à un échéancier proposé puis validé.
- Rankability : plausible (requête étroite, terrain libre) ; volume probablement faible : article de conversion et de preuve plus que de trafic.
- Business relevance : directe (besoins observés ; module en préparation, ne rien promettre).

## Preuve et vérité

- Information gain : la chaîne retour de banque → rejet qualifié → dossier → proposition d'échéancier → validation → suivi, écrite en règles ; le lien avec la relance (n° 4) sans la confondre.
- Preuve distinctive : jeu fictif d'un lot de prélèvement de douze dossiers, trois rejets à motifs différents, l'échéancier proposé pour l'un d'eux et son suivi ; le tableau « se prépare seul / attend une validation / reste humain ».
- Cas courant / limite / refus : courant = rejet pour provision insuffisante, échéancier proposé ; limite = mandat révoqué (pas d'échéancier, contact humain) ; refus = deuxième rejet sur un échéancier en cours : aucune nouvelle proposition automatique, remontée.
- Sources officielles : Banque de France ou CFONB (prélèvement SEPA, codes motifs de rejet, à relever avec date) ; Service-Public.fr (mandat de prélèvement) ; aucune valeur d'échéancier présentée comme norme.
- Relecteur métier : revue métier IA.

## Structure et maillage

- Plan H1/H2/H3 : H1 ; H2 « Réponse directe » ; H2 « Où le rejet se perd aujourd'hui » ; H2 « Détecter : du retour de banque au dossier » ; H2 « Qualifier : les motifs et ce qu'ils imposent » ; H2 « Proposer un échéancier, puis ajuster » ; H2 « Suivre le respect de l'échéancier » ; H2 « Ce que l'outil refuse » ; H2 « Jeu fictif » ; H2 « Sources ».
- Liens sortants : pilier ; n° 4 ; n° 18 (à sa publication) ; glossaire : Prélèvement SEPA et rejet, Proposition puis validation.
- Deux liens entrants : pilier ; n° 4.
- Risque de cannibalisation : n° 4 (impayés) : traité, objets distincts (rejet bancaire vs échéance impayée).

## CTA et maintenance

- CTA, destination et résultat : « Décrire votre lot de prélèvement et ses rejets » → `/contact`.
- Déclencheur de révision : changement des codes motifs cités ; publication du n° 18.
- Décision attendue de Kevin : valider pour M3 (famille observée sur le terrain).
