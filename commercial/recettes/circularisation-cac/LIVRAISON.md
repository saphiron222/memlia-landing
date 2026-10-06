# Circularisation CAC — remise à la publication

## Décision

Recadrage de Kevin du 06/10 : proposition de sélection selon la règle du cabinet et feuille des écarts/contrôles postérieurs choisis par le CAC. Lettres, envois et relances restent aux plateformes ; Circit couvre aussi le rapprochement des réponses. La version initiale de PR128 et son ancien paquet ne doivent plus servir. La même PR128 reçoit cette recette de remplacement. Une seule page sur « automatiser circularisation » (zéro suggestion mesurée, aucun volume revendiqué), distincte du modèle gratuit ; aucune variante banque/client/fournisseur.

L’architecture C3 et les lectures C1/C2 sont sur main. La charte v5 utilisée est celle de PR107, approuvée par metier et encore en attente de fusion lors de la préparation ; la v4 de main contient encore l’ancienne réserve audit. Cette recette n’altère aucune charte ni aucun ancien contenu.

## Valeur distincte et concurrence

La règle de couverture de PR150 prime sur C3. Les éditeurs peuvent proposer filtres de tiers et briques de sondage. Aucune exclusivité Memlia n’est alléguée. Nous vérifions édition et options avant de retenir un reste : critères soldes/mouvements, tirage reproductible, couverture ou N comptes, deux passes et feuille documentée ; pièces postérieures des contrôles choisis par le CAC. Si l’outil du cabinet réalise déjà le geste complet, ne pas le reconstruire. Les sources éditeurs e-Circu/Circit sont ouvertes et conservées ; pas de démonstration ni compatibilité attestée.

Terrain : C1 V014–V016. Demande et propriétaires : docs/strategy/site-v3/cac/{DEMANDE-CAC.md,ARCHITECTURE-CAC.md,page-intent-plan.json,pages-maillage.json}. Les mesures sont reprises telles quelles depuis la capture C2, sans nouvel appel ni fausse fraîcheur. Le relevé titres-intent-2026-10-06.json est un adaptateur pour la forge, avec provenance et horodatage de chaque entrée.

## Ce que prouve la recette

Douze nouveaux cas exécutables : couverture, N comptes, deux passes, tiers disparu, population non rapprochée, doublon, solde de sens inattendu, dénominateur nul, pièce postérieure proposée, procédure non choisie, pièce manquante et ambiguïtés. Huit états historiques restent rejouables pour les retours et exceptions. Ni PDF lu, ni plateforme connectée, ni diligence réalisée ; conclusions vides. Une fiche outil est annoncée comme support Memlia et ne remplace pas son appréciation par le CAC.

Sources : cinq pages officielles H2A (505/315/530/911/912) et deux éditeurs, avec copies et extraits exacts vérifiés dans le HTML. Les NEP911§24 et 912§23 sont une faculté dans leurs champs propres, pas une dispense générale ni une alternative imposée par le logiciel. Les dates de contrôle restent dans les preuves internes.

## Publication dev (carte t_f91e7a2e)

- Préserver la revue metier du fond. Cette livraison ne publie pas la page ; seul le candidat scellé doit être intégré ici.
- Créer un visuel HTML figé propre à la sélection et aux écarts : motifs solde/mouvement/tirage, couverture et deuxième passe, puis pièces à examiner, sans logos ni cartouche réglementaire.
- Ajouter l’entrée obligatoire dans src/data/couverture-logiciels.mjs après intégration de PR150 : reprendre preuves/couverture-entree.json, sans remplacer les entrées EC. Ne pas ajouter une entrée orpheline avant la route. Le geste déjà couvert doit être visible avant la valeur restante.
- Ajouter SERVICE_DESIGN, SERVICE_EEAT (Kevin Kitanga, sans qualification CAC), schéma Audience CAC et le contrat de page à la publication. Le socle de recette suit les cinq types acceptés par la forge ; les données de rendu doivent cibler les CAC, pas l’audience EC écrite par défaut.
- Poser trois liens contextuels avec l’ancre exacte « Automatiser la circularisation ». Les trois articles prévus sont non publiés lors de cette préparation : pilier CAC, campagne, réponse/rapprochement. S’ils ne sont pas disponibles au lancement, choisir trois sources indexables pertinentes réellement présentes et noter la substitution avant publier. Ni footer ni composants globaux ne comptent.
- Toute évolution du corps réglementé revient à la revue existante uniquement sur les défauts signalés ; un changement d’image, d’EEAT ou de maillage ne constitue pas une nouvelle revue du fond.
- Exécuter les essais d’acceptation réels sur les accès, validations et réception sous maîtrise du CAC avant de revendiquer une livraison opérationnelle. Ne pas convertir le rejeu d’états en preuve d’intégration.
- Conserver les preuves et sceaux. En cas de conflit sur titres-intent-2026-10-06.json, fusionner les mesures par requête, jamais écraser un lot frère. La forge ajoute l’entrée registre service au scellement : préserver les entrées sœurs et la recherche CAC.
- Après construction : cycle service:publier, régénération, tests/build, revue QA du code, PR/CI/fusion ; vérifier la production sans query string, puis créer J+7/J+28.

## Rejeu

Depuis la racine : `node commercial/recettes/circularisation-cac/preuves/rejouer.mjs --check` et `node commercial/recettes/circularisation-cac/preuves/selection-rejouer.mjs --check`. Les copies sources durables se relisent sans les redater. completer-sources.mjs refait réellement les ouvertures et la confrontation exacte des nouveaux extraits.
