# Brief éditorial — Automatiser les relances d'honoraires impayés

Statut : a-prioriser
Décideur : Kevin
Action : création
Slug : `automatiser-les-relances-d-honoraires-impayes`
Date : 2026-09-16

## Lecteur et tâche

- Rôle principal : facturation-recouvrement (secondaires : direction-associes, administratif-secretariat).
- Preuve du rôle, source et date : **observée** — référentiel des besoins, poste « assistante du cabinet », BES-ASS-013 (statut de chaque échéance), BES-ASS-014 (savoir qui relancer et quand), BES-ASS-015 (écrire la relance depuis ses messages types), BES-ASS-023 (rien ne part sans sa validation), 2026-08. Aucune citation nominative.
- Déclencheur : après le prélèvement mensuel, des échéances restent impayées ; l'assistante ne sait pas, sans reconstruire, qui relancer, à quel stade, avec quel message.
- Tâche : préparer chaque relance au bon stade depuis les messages types du cabinet, la faire valider, l'envoyer, et arrêter la cadence au règlement.
- Résultat utile : la règle de relance graduée écrite (stades, délais choisis par le cabinet, message type par stade), l'historique par client, et ce qui reste humain.

## Intention et SERP

- Requête primaire : relance impayés cabinet comptable (volume ND).
- Fan-out : relance honoraires expert-comptable ; recouvrement honoraires cabinet ; lettre de relance honoraires modèle.
- SERP France/fr desktop et mobile, date/heure : relevé WebSearch 16/09/2026 (Compta Online, MyUnisoft, Queoval, AzenFlow, Liberall) ; à refaire.
- Types, formats, sources, fraîcheur, PAA et surfaces visibles : guides éditeurs (« facturation automatisée »), tribune sur les modèles d'honoraires ; approche graduée mentionnée en prose ; aucun article sur la relance vue de l'assistante avec validation avant envoi.
- Rankability : plausible.
- Business relevance : directe (besoins observés, module en préparation ; ne rien promettre).

## Preuve et vérité

- Information gain : la relance graduée écrite en règle (stade, délai, message, arrêt), l'historique par client comme objet, la validation humaine avant chaque envoi comme mécanisme et non comme précaution.
- Preuve distinctive : jeu fictif de dix clients à stades différents, un journal de relances, le tableau « se prépare seul / attend une validation / reste humain ».
- Cas courant / limite / refus : courant = échéance impayée à J+n, relance de stade 1 préparée ; limite = règlement partiel (pas de stade suivant sans décision) ; refus = client en échéancier accordé ou en litige : aucune relance proposée, remontée.
- Sources officielles : Code de déontologie des professionnels de l'expertise comptable (honoraires, décret n° 2012-432, à relever) ; Service-Public.fr (relance et mise en demeure, daté) ; recouvrement amiable (glossaire existant).
- Relecteur métier : revue métier IA.

## Structure et maillage

- Plan H1/H2/H3 : H1 ; H2 « Réponse directe » ; H2 « Pourquoi on relance tard, ou deux fois » ; H2 « Les stades, dans les mots du cabinet » ; H2 « Les messages types comme règle » ; H2 « L'historique par client » ; H2 « Rien ne part sans validation » ; H2 « Ce que l'outil refuse » ; H2 « Jeu fictif » ; H2 « Sources ».
- Liens sortants : pilier ; n° 9 rejets de prélèvement ; n° 18 (à sa publication) ; glossaire : Déclencheur, Prélèvement SEPA et rejet, Recouvrement amiable.
- Deux liens entrants : pilier ; n° 2 (inter-familles « relancer des honoraires »).
- Risque de cannibalisation : n° 9 (rejets) : n° 4 vise l'impayé, n° 9 le rejet bancaire et l'échéancier ; distinct.

## CTA et maintenance

- CTA, destination et résultat : « Faire relire votre règle de relance » → `/contact`.
- Déclencheur de révision : publication du n° 9 et du n° 18 ; relecture semestrielle.
- Décision attendue de Kevin : valider pour M2 (famille observée sur le terrain).
