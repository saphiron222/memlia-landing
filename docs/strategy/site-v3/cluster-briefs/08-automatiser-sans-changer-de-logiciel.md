# Brief éditorial — Automatiser sans changer de logiciel

Statut : a-prioriser
Décideur : Kevin
Action : création
Slug : `automatiser-sans-changer-de-logiciel`
Date : 2026-09-16

## Lecteur et tâche

- Rôle principal : direction-associes (secondaires : numerique-it-data, collaborateurs-comptables).
- Preuve du rôle, source et date : **observée** — référentiel des besoins, BES-ASS-026 (ne pas ressaisir l'existant au démarrage d'un outil), BES-ASS-027 (ne pas changer d'outil : rester dans son classeur), BES-ASS-001 (fichier d'import ACD recomposé chaque mois), 2026-08 ; leçon de mission : la plateforme web n'a jamais été vendue, le complément dans Excel a levé le blocage.
- Déclencheur : chaque proposition d'automatisation commence par « migrez vers notre logiciel » ; le cabinet refuse de perdre ses classeurs et ses habitudes.
- Tâche : automatiser une tâche en gardant le logiciel de production et le classeur de suivi existants.
- Résultat utile : les trois voies (export/import de fichiers, complément greffé sur le classeur, connecteur quand une interface existe), leurs limites, et un exemple fictif rejoué sur un classeur.

## Intention et SERP

- Requête primaire : automatiser cabinet comptable sans changer de logiciel (volume ND).
- Fan-out : automatiser Excel cabinet comptable (risque : SERP formation/VBA, à utiliser en secondaire seulement) ; automatisation logiciel comptable sans API ; connecter logiciel comptable et Excel.
- SERP France/fr desktop et mobile, date/heure : relevé WebSearch 16/09/2026 (developpez.net VBA, Hexagone Stratégie, AzenFlow, Excel Mania, Nexco) ; à refaire.
- Types, formats, sources, fraîcheur, PAA et surfaces visibles : forum de développeurs (macros), agences (n8n, Zapier, Power Automate), articles génériques ; « sans modifier les outils existants » est revendiqué par une agence RPA : ne pas prétendre être seul, être plus précis.
- Rankability : plausible sur la requête primaire ; éviter « macro », « VBA » dans le titre et le H1.
- Business relevance : directe (le positionnement exact).

## Preuve et vérité

- Information gain : les trois voies comparées sur les mêmes critères (ressaisie, fragilité au changement d'export, maintenance, qui possède la règle), et l'idempotence comme critère de sécurité.
- Preuve distinctive : un classeur fictif de suivi, un export fictif à trois colonnes changées, et ce que chaque voie fait quand l'export change ; le tableau « se prépare seul / attend une validation / reste humain ».
- Cas courant / limite / refus : courant = export mensuel importé sans ressaisie ; limite = colonne renommée dans l'export (contrôle de schéma qui remonte) ; refus = schéma inconnu : l'outil n'écrit rien.
- Sources officielles : Microsoft (documentation des compléments Office, limites d'Excel), RFC 4180 (CSV), citées pour ce qu'elles documentent ; aucune statistique.
- Relecteur métier : revue métier IA.

## Structure et maillage

- Plan H1/H2/H3 : H1 ; H2 « Réponse directe » ; H2 « Pourquoi « changez de logiciel » échoue » ; H2 « Voie 1 : l'export et l'import » ; H2 « Voie 2 : le complément greffé sur le classeur » ; H2 « Voie 3 : le connecteur, quand il existe » ; H2 « Ce qui casse, et le contrôle qui l'attrape » ; H2 « Qui possède la règle » ; H2 « Jeu fictif » ; H2 « Sources ».
- Liens sortants : pilier ; n° 25 et n° 36 (à leur publication) ; n° 35 (inter-familles, complément de synthèse) ; `/automatisation-cabinet-comptable` ; glossaire : Automatisation, Connecteur et API, Automatisation robotisée des processus.
- Deux liens entrants : pilier ; n° 25 (même famille, à sa publication) ; en attendant, la page service.
- Risque de cannibalisation : avec la page service : la page vend, l'article compare les voies ; requêtes distinctes.

## CTA et maintenance

- CTA, destination et résultat : « Voir ce que Memlia greffe sur un classeur » → `/automatisation-cabinet-comptable`.
- Déclencheur de révision : publication des n° 25 et 36 ; changement de la documentation Microsoft citée.
- Décision attendue de Kevin : valider pour M3.
